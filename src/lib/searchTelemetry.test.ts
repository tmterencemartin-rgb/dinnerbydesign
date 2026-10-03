import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../firebase', () => ({ auth: { currentUser: null } }));
import { sendSearchTelemetry } from './searchTelemetry';

describe('sendSearchTelemetry', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('sends the fromCache flag when it is set', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    await sendSearchTelemetry({ requestId: 'r1', stage: 'results_delivered', source: 'cook', durationMs: 3, fromCache: true });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ requestId: 'r1', fromCache: true });
  });

  it('leaves the flag out for a live search', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    await sendSearchTelemetry({ requestId: 'r2', stage: 'results_delivered', source: 'cook', durationMs: 20000 });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).fromCache).toBeUndefined();
  });
});
