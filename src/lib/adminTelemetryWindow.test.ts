import { describe, expect, it } from 'vitest';
import { TELEMETRY_WINDOWS, estimateNetForWindow, telemetryWindowStartMs } from './adminTelemetryWindow';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 3, 12, 0, 0);

describe('telemetryWindowStartMs', () => {
  it('starts 1, 7 and 30 days back', () => {
    expect(telemetryWindowStartMs('24h', NOW)).toBe(NOW - DAY);
    expect(telemetryWindowStartMs('7d', NOW)).toBe(NOW - 7 * DAY);
    expect(telemetryWindowStartMs('30d', NOW)).toBe(NOW - 30 * DAY);
  });

  it('has no unbounded window', () => {
    expect(Object.keys(TELEMETRY_WINDOWS)).toEqual(['24h', '7d', '30d']);
  });
});

describe('estimateNetForWindow', () => {
  it('gives the full monthly figures for a 30 day window', () => {
    const result = estimateNetForWindow(10, 5, 30);
    expect(result.grossRevenue).toBeCloseTo(29.9);
    expect(result.stripeFees).toBeCloseTo(10 * (2.99 * 0.015 + 0.2));
    expect(result.net).toBeCloseTo(result.grossRevenue - result.stripeFees - 5);
  });

  it('prorates revenue and fees to the window, so one day of cost is set against one day of revenue', () => {
    const day = estimateNetForWindow(30, 0, 1);
    const month = estimateNetForWindow(30, 0, 30);
    expect(day.grossRevenue).toBeCloseTo(month.grossRevenue / 30);
    expect(day.stripeFees).toBeCloseTo(month.stripeFees / 30);
  });

  it('does not overstate the net when only a short window of cost is loaded', () => {
    const oneDayCost = 0.5;
    const prorated = estimateNetForWindow(30, oneDayCost, 1).net;
    const unprorated = 30 * 2.99 - 30 * (2.99 * 0.015 + 0.2) - oneDayCost;
    expect(prorated).toBeLessThan(unprorated / 10);
  });

  it('handles no paid users', () => {
    expect(estimateNetForWindow(0, 2, 7)).toMatchObject({ grossRevenue: 0, stripeFees: 0, net: -2 });
  });
});
