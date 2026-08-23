import { getApiUrl } from './api';

export type ClientErrorKind = 'runtime' | 'unhandled_rejection' | 'boundary' | 'dynamic_import' | 'resource';

interface ClientErrorDetails {
  kind: ClientErrorKind;
  message?: string | null;
  stack?: string | null;
  source?: string | null;
}

const recentReports = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 30_000;

const redactSensitiveText = (value: string, maxLength: number) => value
  .replace(/https?:\/\/[^\s)]+/gi, '[redacted-url]')
  .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[redacted-email]')
  .replace(/[?&](?:token|key|code|email|query|search)=[^&\s]*/gi, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

export const normaliseClientErrorText = (value: unknown, maxLength = 2000) =>
  redactSensitiveText(String(value || 'Unknown client error'), maxLength) || 'Unknown client error';

export const getClientErrorKind = (message: string): ClientErrorKind => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('failed to fetch dynamically imported module')
    || lowerMessage.includes('importing a module script failed')
    || lowerMessage.includes('loading chunk') && lowerMessage.includes('failed')
    || lowerMessage.includes('unable to preload css')) {
    return 'dynamic_import';
  }
  return 'runtime';
};

const getDeviceClass = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  if (width > 0 && width < 640) return 'mobile';
  if (width > 0 && width < 1024) return 'tablet';
  return 'desktop';
};

export const reportClientError = (details: ClientErrorDetails) => {
  if (typeof window === 'undefined') return;

  const message = normaliseClientErrorText(details.message);
  const stack = details.stack ? normaliseClientErrorText(details.stack, 3000) : null;
  const source = details.source ? normaliseClientErrorText(details.source, 500) : null;
  const path = window.location.pathname.slice(0, 300) || '/';
  const fingerprint = `${details.kind}:${message}:${path}`;
  const now = Date.now();
  const previousReportAt = recentReports.get(fingerprint) || 0;
  if (now - previousReportAt < DUPLICATE_WINDOW_MS) return;
  recentReports.set(fingerprint, now);

  void fetch(getApiUrl('/api/client-errors'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind: details.kind,
      message,
      stack,
      source,
      path,
      deviceClass: getDeviceClass(),
      viewportWidth: window.innerWidth,
    }),
    keepalive: true,
  }).catch(() => {
    // Error reporting must never create another visible application error.
  });
};
