import { createHmac } from 'node:crypto';

export const GUEST_SEARCH_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const GUEST_SEARCH_RATE_LIMIT_MAXIMUM = 12;

export interface GuestSearchRateWindow {
  count: number;
  windowStartedAtMs: number;
}

export function createGuestSearchRateLimitId(clientIp: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(clientIp.trim() || 'unknown')
    .digest('base64url');
}

export function isGuestSearchRateLimitAvailable(window: GuestSearchRateWindow | null, now: number): boolean {
  if (!window || now - window.windowStartedAtMs >= GUEST_SEARCH_RATE_LIMIT_WINDOW_MS) return true;
  return window.count < GUEST_SEARCH_RATE_LIMIT_MAXIMUM;
}

export function nextGuestSearchRateWindow(window: GuestSearchRateWindow | null, now: number): GuestSearchRateWindow {
  if (!window || now - window.windowStartedAtMs >= GUEST_SEARCH_RATE_LIMIT_WINDOW_MS) {
    return { count: 1, windowStartedAtMs: now };
  }
  return { count: window.count + 1, windowStartedAtMs: window.windowStartedAtMs };
}
