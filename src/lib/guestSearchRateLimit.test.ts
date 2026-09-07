import { describe, expect, it } from 'vitest';
import {
  GUEST_SEARCH_RATE_LIMIT_MAXIMUM,
  GUEST_SEARCH_RATE_LIMIT_WINDOW_MS,
  createGuestSearchRateLimitId,
  isGuestSearchRateLimitAvailable,
  nextGuestSearchRateWindow,
} from './guestSearchRateLimit';

describe('guest search rate limit', () => {
  it('creates a stable, non-reversible identifier for a client address', () => {
    const first = createGuestSearchRateLimitId('203.0.113.10', 'test-secret');
    expect(first).toBe(createGuestSearchRateLimitId('203.0.113.10', 'test-secret'));
    expect(first).not.toContain('203.0.113.10');
    expect(first).not.toBe(createGuestSearchRateLimitId('203.0.113.11', 'test-secret'));
  });

  it('blocks the thirteenth successful guest search in an hour', () => {
    const now = Date.now();
    expect(isGuestSearchRateLimitAvailable({ count: GUEST_SEARCH_RATE_LIMIT_MAXIMUM, windowStartedAtMs: now }, now)).toBe(false);
  });

  it('starts a fresh window after an hour', () => {
    const now = Date.now();
    const expired = { count: GUEST_SEARCH_RATE_LIMIT_MAXIMUM, windowStartedAtMs: now - GUEST_SEARCH_RATE_LIMIT_WINDOW_MS };
    expect(isGuestSearchRateLimitAvailable(expired, now)).toBe(true);
    expect(nextGuestSearchRateWindow(expired, now)).toEqual({ count: 1, windowStartedAtMs: now });
  });
});
