export const STRIPE_WEBHOOK_PROCESSING_LEASE_MS = 5 * 60 * 1000;
export const TRANSACTIONAL_EMAIL_CLAIM_LEASE_MS = 5 * 60 * 1000;

export type WebhookClaimDecision = 'process' | 'already_processed' | 'in_progress';

function toMillis(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof (value as { toMillis?: () => number } | null)?.toMillis === 'function') {
    const millis = (value as { toMillis: () => number }).toMillis();
    return Number.isFinite(millis) ? millis : null;
  }
  return null;
}

export function getWebhookClaimDecision(
  record: { status?: unknown; processingStartedAt?: unknown } | null | undefined,
  now = Date.now(),
  leaseMs = STRIPE_WEBHOOK_PROCESSING_LEASE_MS,
): WebhookClaimDecision {
  if (record?.status === 'succeeded') return 'already_processed';

  const processingStartedAt = toMillis(record?.processingStartedAt);
  if (
    record?.status === 'processing'
    && processingStartedAt !== null
    && now - processingStartedAt < leaseMs
  ) {
    return 'in_progress';
  }

  return 'process';
}

export function shouldApplyStripeEvent(
  currentEventCreatedAt: unknown,
  incomingEventCreatedAt: unknown,
): boolean {
  const incoming = typeof incomingEventCreatedAt === 'number' && Number.isFinite(incomingEventCreatedAt)
    ? incomingEventCreatedAt
    : null;
  const current = typeof currentEventCreatedAt === 'number' && Number.isFinite(currentEventCreatedAt)
    ? currentEventCreatedAt
    : null;

  if (incoming === null || current === null) return true;
  return incoming >= current;
}

export function isFreshEmailClaim(
  claimedAt: unknown,
  now = Date.now(),
  leaseMs = TRANSACTIONAL_EMAIL_CLAIM_LEASE_MS,
): boolean {
  const claimMillis = toMillis(claimedAt);
  return claimMillis !== null && now - claimMillis < leaseMs;
}
