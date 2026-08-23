import { auth } from '../firebase';
import { getApiUrl } from './api';
import { DinnerSource } from '../types';

export type SearchTelemetryStage =
  | 'started'
  | 'results_delivered'
  | 'no_results_delivered'
  | 'failed'
  | 'cancelled'
  | 'user_reported';

interface SearchTelemetryEvent {
  requestId: string;
  stage: SearchTelemetryStage;
  source: DinnerSource;
  durationMs?: number | null;
  resultCount?: number;
  errorCategory?: string | null;
}

export function createSearchRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `search-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDeviceClass(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 640) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
}

export async function sendSearchTelemetry(event: SearchTelemetryEvent): Promise<void> {
  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    await fetch(getApiUrl('/api/search-telemetry'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        ...event,
        deviceClass: getDeviceClass(),
        viewportWidth: typeof window === 'undefined' ? null : window.innerWidth
      }),
      keepalive: true
    });
  } catch {
    // Observability must never interrupt or change the search experience.
  }
}
