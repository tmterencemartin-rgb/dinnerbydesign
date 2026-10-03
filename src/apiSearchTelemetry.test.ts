// @vitest-environment node
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import http from 'node:http';

const added: any[] = [];
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({
    collection: () => ({
      doc: () => ({ get: async () => ({ exists: false, data: () => ({}) }), set: async () => {} }),
      add: async (doc: any) => { added.push(doc); },
      orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }), get: async () => ({ docs: [] }) }),
      where: () => ({ get: async () => ({ docs: [] }), orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }) }) })
    }),
    runTransaction: async () => ({ allowed: true, count: 1 })
  }),
  FieldValue: { serverTimestamp: () => 'ts', increment: (n: number) => n },
  Timestamp: { fromMillis: (n: number) => n, now: () => ({ toMillis: () => Date.now() }) }
}));
vi.mock('firebase-admin/app', () => ({ cert: () => ({}), getApps: () => [{}], initializeApp: () => ({}) }));
vi.mock('firebase-admin/auth', () => ({ getAuth: () => ({ verifyIdToken: async () => ({ uid: 'u1', firebase: { sign_in_provider: 'password' } }) }) }));
vi.mock('firebase-admin/app-check', () => ({ getAppCheck: () => ({ verifyToken: async () => ({}) }) }));
vi.mock('google-auth-library', () => ({ GoogleAuth: class {} }));
vi.mock('./services/geminiService', () => ({
  generateDinnerSuggestions: vi.fn(), generateInternalDinnerChoices: vi.fn(), generateMatchRationales: vi.fn(), enrichRecipe: vi.fn()
}));

let server: http.Server;
let port = 0;
const post = (body: unknown) => new Promise<number>((resolve, reject) => {
  const data = JSON.stringify(body);
  const req = http.request({
    port, path: '/api/search-telemetry', method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data), authorization: 'Bearer token' }
  }, res => { res.resume(); res.on('end', () => resolve(res.statusCode || 0)); });
  req.on('error', reject);
  req.write(data);
  req.end();
});

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  const { createApp } = await import('./api-server');
  await new Promise<void>(resolve => { server = createApp().listen(0, () => { port = (server.address() as any).port; resolve(); }); });
});
afterAll(() => { server?.close(); });
beforeEach(() => { added.length = 0; });

describe('/api/search-telemetry', () => {
  it('stores fromCache true for a device-cache delivery', async () => {
    const status = await post({ requestId: 'req-cache-1', stage: 'results_delivered', source: 'cook', durationMs: 4, resultCount: 3, deviceClass: 'mobile', fromCache: true });
    expect(status).toBe(204);
    expect(added[0]).toMatchObject({ requestId: 'req-cache-1', fromCache: true });
  });

  it('stores fromCache false when the flag is absent or not true', async () => {
    await post({ requestId: 'req-live-1', stage: 'results_delivered', source: 'cook', durationMs: 20000, deviceClass: 'mobile' });
    await post({ requestId: 'req-live-2', stage: 'results_delivered', source: 'cook', durationMs: 20000, deviceClass: 'mobile', fromCache: 'true' });
    expect(added.map(doc => doc.fromCache)).toEqual([false, false]);
  });
});
