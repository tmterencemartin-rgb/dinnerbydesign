import { describe, expect, it } from 'vitest';
import { percentile, summariseSearchTelemetry } from './searchTelemetrySummary';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 3, 12, 0, 0);

const delivery = (requestId: string, durationMs: number, extra: Record<string, unknown> = {}) => ({
  requestId, stage: 'results_delivered', durationMs, deviceClass: 'mobile', createdAtMs: NOW, ...extra
});
const usage = (requestId: string, extra: Record<string, unknown> = {}) => ({
  requestId, type: 'recipe_search', status: 'succeeded', latencyMs: 5_000, totalRoundTripMs: 12_000,
  serverLatencyMs: 13_000, resultCount: 3, requestedCount: 3, createdAtMs: NOW, ...extra
});

describe('percentile', () => {
  it('returns null for no values', () => expect(percentile([], 0.5)).toBeNull());
  it('returns the only value for one value', () => {
    expect(percentile([7], 0.5)).toBe(7);
    expect(percentile([7], 0.95)).toBe(7);
  });
  it('uses nearest rank', () => {
    const values = Array.from({ length: 20 }, (_, index) => index + 1);
    expect(percentile(values, 0.5)).toBe(10);
    expect(percentile(values, 0.95)).toBe(19);
  });
  it('does not depend on input order', () => expect(percentile([9, 1, 5], 0.5)).toBe(5));
});

describe('summariseSearchTelemetry', () => {
  it('excludes device-cache hits from the delivery times and the match', () => {
    const result = summariseSearchTelemetry(
      [delivery('a', 20_000), delivery('b', 4, { fromCache: true })],
      [usage('a')]
    );
    expect(result.byDevice[0]).toMatchObject({ device: 'mobile', count: 1, p50: 20_000 });
    expect(result.matching).toMatchObject({ deliveredWithId: 1, matched: 1, unmatched: 0, cacheHitsExcluded: 1 });
  });

  it('counts a live delivery with no usage event as unmatched', () => {
    const result = summariseSearchTelemetry([delivery('a', 20_000), delivery('b', 21_000)], [usage('a')]);
    expect(result.matching).toMatchObject({ deliveredWithId: 2, matched: 1, unmatched: 1, unmatchedShare: 0.5 });
  });

  it('ignores a failed usage event when matching', () => {
    const result = summariseSearchTelemetry([delivery('a', 20_000)], [usage('a', { status: 'failed' })]);
    expect(result.matching.unmatched).toBe(1);
  });

  it('splits delivery times by device and reports empty groups as null', () => {
    const result = summariseSearchTelemetry(
      [delivery('a', 20_000), delivery('b', 18_000, { deviceClass: 'tablet' })],
      []
    );
    expect(result.byDevice.map(row => [row.device, row.count])).toEqual([['mobile', 1], ['tablet', 1], ['desktop', 0]]);
    expect(result.byDevice[2].p50).toBeNull();
  });

  it('uses only usage events inside the window and only search types', () => {
    const result = summariseSearchTelemetry([], [
      usage('new', { totalRoundTripMs: 10_000 }),
      usage('old', { totalRoundTripMs: 30_000, createdAtMs: NOW - 10 * DAY }),
      usage('other', { type: 'ai_created_dinner', totalRoundTripMs: 40_000 })
    ], { sinceMs: NOW - DAY });
    expect(result.server.sample).toBe(1);
    expect(result.server.roundTrip.p50).toBe(10_000);
  });

  it('reports browser minus server request time for matched requests', () => {
    const result = summariseSearchTelemetry(
      [delivery('a', 23_000), delivery('b', 21_000)],
      [usage('a', { serverLatencyMs: 13_000 }), usage('b', { serverLatencyMs: 12_000 })]
    );
    expect(result.browserMinusServer).toMatchObject({ count: 2, p50: 9_000 });
  });

  it('counts searches near the time budget and their mean result count', () => {
    const result = summariseSearchTelemetry([], [
      usage('a', { totalRoundTripMs: 27_500, resultCount: 1 }),
      usage('b', { totalRoundTripMs: 28_000, resultCount: 2 }),
      usage('c', { totalRoundTripMs: 9_000, resultCount: 3 })
    ]);
    expect(result.nearBudget).toMatchObject({ count: 2, meanResultCount: 1.5 });
    expect(result.nearBudget.share).toBeCloseTo(2 / 3);
  });

  it('gives a per-day table, newest first, limited to the requested days', () => {
    const result = summariseSearchTelemetry(
      [delivery('a', 1, { createdAtMs: NOW }), delivery('b', 1, { createdAtMs: NOW }), delivery('c', 1, { createdAtMs: NOW - DAY })],
      [usage('a'), usage('c')],
      { days: 2 }
    );
    expect(result.perDay).toEqual([
      { day: '2026-10-03', delivered: 2, matched: 1, unmatched: 1 },
      { day: '2026-10-02', delivered: 1, matched: 1, unmatched: 0 }
    ]);
  });

  it('copes with empty input', () => {
    const result = summariseSearchTelemetry([], []);
    expect(result.matching.unmatchedShare).toBeNull();
    expect(result.nearBudget.share).toBeNull();
    expect(result.perDay).toEqual([]);
  });
});
