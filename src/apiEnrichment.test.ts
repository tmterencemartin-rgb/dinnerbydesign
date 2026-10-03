// @vitest-environment node
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import http from 'node:http';

let guestCount = 2;
const enrich = vi.fn();
const rationales = vi.fn(async () => ({ stew: 'Uses one pan.' }));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({ collection: () => ({ doc: () => ({ get: async () => ({ exists: true, data: () => ({ count: guestCount }) }), set: async () => {} }), add: async () => {}, orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }) }) }), runTransaction: async () => ({ allowed: true, count: 1 }) }),
  FieldValue: { serverTimestamp: () => 'ts', increment: (n: number) => n },
  Timestamp: { fromMillis: (n: number) => n, now: () => ({ toMillis: () => Date.now() }) }
}));
vi.mock('firebase-admin/app', () => ({ cert: () => ({}), getApps: () => [{}], initializeApp: () => ({}) }));
vi.mock('firebase-admin/auth', () => ({ getAuth: () => ({ verifyIdToken: async (token: string) => token === 'anon' ? { uid: 'u-anon', firebase: { sign_in_provider: 'anonymous' } } : { uid: 'u-registered', firebase: { sign_in_provider: 'password' } } }) }));
vi.mock('firebase-admin/app-check', () => ({ getAppCheck: () => ({ verifyToken: async () => ({}) }) }));
vi.mock('google-auth-library', () => ({ GoogleAuth: class {} }));
vi.mock('./services/geminiService', () => ({ generateDinnerSuggestions: vi.fn(), generateInternalDinnerChoices: vi.fn(), generateMatchRationales: (...args: any[]) => (rationales as any)(...args), enrichRecipe: (...args: any[]) => enrich(...args) }));
const unusableLinks = new Set<string>();
vi.mock('./lib/groundingUtils', async importOriginal => ({ ...(await importOriginal() as any), confirmPublisherRecipePageUrl: async (url: string) => unusableLinks.has(url) ? null : url }));

let server: http.Server;
let port = 0;
const post = (path: string, body: unknown, token?: string) => new Promise<{ status: number; text: string }>((resolve, reject) => {
  const data = JSON.stringify(body);
  const req = http.request({ port, path, method: 'POST', headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data), ...(token ? { authorization: `Bearer ${token}` } : {}) } }, res => {
    let text = '';
    res.on('data', chunk => { text += chunk; });
    res.on('end', () => resolve({ status: res.statusCode || 0, text }));
  });
  req.on('error', reject); req.write(data); req.end();
});
const enrichBody = (url: string, extra: Record<string, unknown> = {}) => ({ title: 'Test stew', cuisine: 'British', mode: 'cook', sourceUrl: `https://www.kitchensanctuary.com/${url}`, ...extra });
const complete = { instructions: ['Cook it.'], ingredients: ['1 onion'], description: 'A stew.', totalIngredientsCount: 1, totalServings: 2 };
const rationaleBody = { items: [{ title: 'Stew' }], searchParams: { query: 'stew' } };

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  const { createApp } = await import('./api-server');
  await new Promise<void>(resolve => { server = createApp().listen(0, () => { port = (server.address() as any).port; resolve(); }); });
});
afterAll(() => { server?.close(); });
beforeEach(() => { guestCount = 2; enrich.mockReset(); enrich.mockResolvedValue(complete); });

describe('enrichment and rationale endpoints', () => {
  it('refuses requests without a token', async () => {
    expect((await post('/api/enrich-recipe', enrichBody('no-token'))).status).toBe(401);
    expect((await post('/api/generate-rationales', rationaleBody)).status).toBe(401);
  });
  it('serves a guest who has used all free searches', async () => {
    guestCount = 3;
    expect((await post('/api/enrich-recipe', enrichBody('guest-at-limit'), 'anon')).status).toBe(200);
    expect((await post('/api/generate-rationales', rationaleBody, 'anon')).status).toBe(200);
  });
  it('serves a registered user', async () => { expect((await post('/api/enrich-recipe', enrichBody('registered'), 'registered')).status).toBe(200); });
  it('makes one model call for a repeated request', async () => { await post('/api/enrich-recipe', enrichBody('repeat'), 'registered'); await post('/api/enrich-recipe', enrichBody('repeat'), 'registered'); expect(enrich).toHaveBeenCalledTimes(1); });
  it('bypasses the cache for strict ingredient requests', async () => { const strict = enrichBody('strict', { strictIngredientMatch: true, strictQuery: 'leek' }); await post('/api/enrich-recipe', strict, 'registered'); await post('/api/enrich-recipe', strict, 'registered'); expect(enrich).toHaveBeenCalledTimes(2); });
  it('does not cache a result with empty instructions', async () => { enrich.mockResolvedValue({ ...complete, instructions: [] }); await post('/api/enrich-recipe', enrichBody('empty-instructions'), 'registered'); await post('/api/enrich-recipe', enrichBody('empty-instructions'), 'registered'); expect(enrich).toHaveBeenCalledTimes(2); });
  it('shares one model call between simultaneous identical requests', async () => { enrich.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(complete), 150))); await Promise.all([1, 2, 3].map(() => post('/api/enrich-recipe', enrichBody('concurrent'), 'registered'))); expect(enrich).toHaveBeenCalledTimes(1); });
  it('does not cache a result for a source link that fails the check', async () => {
    const retired = enrichBody('retired-link');
    unusableLinks.add(retired.sourceUrl);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await post('/api/enrich-recipe', retired, 'registered');
    await post('/api/enrich-recipe', retired, 'registered');
    const lines = log.mock.calls.map(call => String(call[0]));
    log.mockRestore();
    unusableLinks.delete(retired.sourceUrl);
    expect(lines.some(line => line.includes('cache_hit') && line.includes('retired-link'))).toBe(false);
    expect(enrich).toHaveBeenCalledTimes(2);
  });
});
