import { describe, expect, it } from 'vitest';
import { getClientErrorKind, normaliseClientErrorText } from './clientErrorTelemetry';

describe('client error telemetry', () => {
  it('classifies failed dynamic imports separately', () => {
    expect(getClientErrorKind('Failed to fetch dynamically imported module: https://dinnerbydesign.app/assets/App.js?token=secret')).toBe('dynamic_import');
    expect(getClientErrorKind('Unexpected client error')).toBe('runtime');
  });

  it('redacts URLs, email addresses and sensitive query values', () => {
    const result = normaliseClientErrorText('Failed for terence@example.com at https://example.test/app?token=secret&query=private');

    expect(result).not.toContain('terence@example.com');
    expect(result).not.toContain('https://example.test');
    expect(result).not.toContain('token=secret');
    expect(result).toContain('[redacted-email]');
    expect(result).toContain('[redacted-url]');
  });
});
