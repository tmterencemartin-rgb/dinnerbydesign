// Pure summary of search timing and write-completeness, used by the admin dashboard.
// Keeping it out of the component makes the maths testable.

export interface DeliveryEventLike {
  requestId?: string;
  stage?: string;
  durationMs?: number | null;
  deviceClass?: string;
  fromCache?: boolean;
  createdAtMs?: number | null;
}

export interface UsageEventLike {
  requestId?: string;
  type?: string;
  status?: string;
  latencyMs?: number | null;
  totalRoundTripMs?: number | null;
  serverLatencyMs?: number | null;
  resultCount?: number;
  requestedCount?: number;
  createdAtMs?: number | null;
}

export interface SummaryOptions {
  /** Only usage events at or after this time are used. Delivery events are expected to be filtered already. */
  sinceMs?: number;
  /** A search whose server round trip is at least this long is counted as near the time budget. */
  nearBudgetMs?: number;
  /** Number of most recent UTC days in the per-day table. */
  days?: number;
}

const SEARCH_USAGE_TYPES = new Set(['recipe_search', 'ready_made_search', 'weekly_plan']);
const DEVICES = ['mobile', 'tablet', 'desktop'] as const;

/** Nearest-rank percentile. Returns null for an empty list. */
export function percentile(values: number[], fraction: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1))];
}

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const spread = (values: number[]) => ({ count: values.length, p50: percentile(values, 0.5), p95: percentile(values, 0.95) });
const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function summariseSearchTelemetry(
  deliveryEvents: DeliveryEventLike[],
  usageEvents: UsageEventLike[],
  options: SummaryOptions = {}
) {
  const sinceMs = options.sinceMs ?? 0;
  const nearBudgetMs = options.nearBudgetMs ?? 27_000;
  const days = options.days ?? 7;

  // Searches served from the device cache have no server call behind them and a near-zero duration.
  const delivered = deliveryEvents.filter(event => event.stage === 'results_delivered');
  const live = delivered.filter(event => event.fromCache !== true);
  const cacheHits = delivered.length - live.length;

  const byDevice = DEVICES.map(device => ({
    device,
    ...spread(live.filter(event => event.deviceClass === device && isNumber(event.durationMs)).map(event => event.durationMs as number))
  }));

  const searchUsage = usageEvents.filter(event =>
    event.status === 'succeeded'
    && SEARCH_USAGE_TYPES.has(event.type || '')
    && (sinceMs === 0 || (isNumber(event.createdAtMs) && event.createdAtMs >= sinceMs))
  );
  const server = {
    sample: searchUsage.length,
    gemini: spread(searchUsage.map(event => event.latencyMs).filter(isNumber)),
    roundTrip: spread(searchUsage.map(event => event.totalRoundTripMs).filter(isNumber)),
    request: spread(searchUsage.map(event => event.serverLatencyMs).filter(isNumber))
  };

  const nearBudgetRows = searchUsage.filter(event => isNumber(event.totalRoundTripMs) && event.totalRoundTripMs >= nearBudgetMs);
  const withRoundTrip = searchUsage.filter(event => isNumber(event.totalRoundTripMs)).length;
  const nearBudget = {
    count: nearBudgetRows.length,
    share: withRoundTrip ? nearBudgetRows.length / withRoundTrip : null,
    meanResultCount: nearBudgetRows.length
      ? nearBudgetRows.reduce((sum, event) => sum + (event.resultCount || 0), 0) / nearBudgetRows.length
      : null
  };

  // Match each live delivery to its server usage event by request ID.
  const usageByRequest = new Map<string, UsageEventLike>();
  usageEvents
    .filter(event => event.status === 'succeeded' && event.requestId)
    .forEach(event => usageByRequest.set(event.requestId as string, event));
  const withId = live.filter(event => event.requestId);
  const matchedEvents = withId.filter(event => usageByRequest.has(event.requestId as string));
  const unmatched = withId.length - matchedEvents.length;
  const matching = {
    deliveredWithId: withId.length,
    matched: matchedEvents.length,
    unmatched,
    unmatchedShare: withId.length ? unmatched / withId.length : null,
    cacheHitsExcluded: cacheHits
  };

  // Browser time minus the server request time: network, token and client work, plus cold starts.
  const overheads = matchedEvents
    .map(event => {
      const usage = usageByRequest.get(event.requestId as string);
      return isNumber(event.durationMs) && isNumber(usage?.serverLatencyMs) ? event.durationMs - (usage!.serverLatencyMs as number) : null;
    })
    .filter(isNumber);
  const browserMinusServer = spread(overheads);

  const perDayMap = new Map<string, { delivered: number; matched: number }>();
  withId.forEach(event => {
    if (!isNumber(event.createdAtMs)) return;
    const key = dayKey(event.createdAtMs);
    const row = perDayMap.get(key) || { delivered: 0, matched: 0 };
    row.delivered += 1;
    if (usageByRequest.has(event.requestId as string)) row.matched += 1;
    perDayMap.set(key, row);
  });
  const perDay = [...perDayMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, days)
    .map(([day, row]) => ({ day, delivered: row.delivered, matched: row.matched, unmatched: row.delivered - row.matched }));

  return { byDevice, server, nearBudget, matching, browserMinusServer, perDay };
}
