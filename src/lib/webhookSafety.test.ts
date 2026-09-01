import { describe, expect, it } from 'vitest';
import {
  getWebhookClaimDecision,
  isFreshEmailClaim,
  shouldApplyStripeEvent,
} from './webhookSafety';

describe('webhook safety', () => {
  it('does not process a webhook that has already succeeded', () => {
    expect(getWebhookClaimDecision({ status: 'succeeded' })).toBe('already_processed');
  });

  it('waits for a recent webhook attempt instead of running it twice', () => {
    expect(getWebhookClaimDecision({
      status: 'processing',
      processingStartedAt: 9_700,
    }, 10_000, 500)).toBe('in_progress');
  });

  it('reclaims a webhook after its processing lease expires', () => {
    expect(getWebhookClaimDecision({
      status: 'processing',
      processingStartedAt: 9_000,
    }, 10_000, 500)).toBe('process');
  });

  it('ignores an older Stripe update while accepting a newer one', () => {
    expect(shouldApplyStripeEvent(200, 199)).toBe(false);
    expect(shouldApplyStripeEvent(200, 201)).toBe(true);
  });

  it('treats missing event timestamps as eligible for compatibility', () => {
    expect(shouldApplyStripeEvent(undefined, undefined)).toBe(true);
  });

  it('recognises a recent email claim', () => {
    expect(isFreshEmailClaim(9_700, 10_000, 500)).toBe(true);
    expect(isFreshEmailClaim(9_000, 10_000, 500)).toBe(false);
  });
});
