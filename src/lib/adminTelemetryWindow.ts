// Shared window and period arithmetic for the admin dashboard.

export type TelemetryWindow = '24h' | '7d' | '30d';

const DAY_MS = 24 * 60 * 60 * 1000;

export const TELEMETRY_WINDOWS: Record<TelemetryWindow, { label: string; days: number }> = {
  '24h': { label: 'Last 24 hours', days: 1 },
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 }
};

export const telemetryWindowStartMs = (window: TelemetryWindow, now: number = Date.now()): number =>
  now - TELEMETRY_WINDOWS[window].days * DAY_MS;

export const MONTHLY_PRICE_GBP = 2.99;
const STRIPE_PERCENT = 0.015;
const STRIPE_FIXED_GBP = 0.2;
const DAYS_PER_MONTH = 30;

/**
 * Revenue, fees and net for the same period as the AI cost.
 * Subscription revenue and fees are monthly figures, so they are prorated to the window.
 */
export function estimateNetForWindow(paidUsers: number, aiCostGbp: number, windowDays: number) {
  const fraction = windowDays / DAYS_PER_MONTH;
  const grossRevenue = paidUsers * MONTHLY_PRICE_GBP * fraction;
  const stripeFees = paidUsers * ((MONTHLY_PRICE_GBP * STRIPE_PERCENT) + STRIPE_FIXED_GBP) * fraction;
  return { grossRevenue, stripeFees, net: grossRevenue - stripeFees - aiCostGbp };
}
