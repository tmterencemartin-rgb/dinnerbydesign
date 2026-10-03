import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

type Read = { name: string; since: number | null; max: number | null; ordered: boolean };
const reads: Read[] = [];
let sizeFor: Record<string, number> = {};

vi.mock('../../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => {
  class Timestamp {
    constructor(public ms: number) {}
    toDate() { return new Date(this.ms); }
    toMillis() { return this.ms; }
    static fromMillis(ms: number) { return new Timestamp(ms); }
    static fromDate(date: Date) { return new Timestamp(date.getTime()); }
  }
  return {
    Timestamp,
    collection: (_db: any, ...path: string[]) => ({ name: path.join('/') }),
    query: (source: any, ...constraints: any[]) => ({ source, constraints }),
    where: (_field: string, _op: string, value: any) => ({ kind: 'where', value }),
    orderBy: () => ({ kind: 'orderBy' }),
    limit: (n: number) => ({ kind: 'limit', n }),
    doc: () => ({}),
    updateDoc: vi.fn(),
    serverTimestamp: () => 'ts',
    getDocs: async (q: any) => {
      const source = q?.source ?? q;
      const constraints: any[] = q?.constraints ?? [];
      const name = source.name;
      const where = constraints.find(c => c.kind === 'where');
      const lim = constraints.find(c => c.kind === 'limit');
      reads.push({
        name,
        since: where ? where.value.toMillis() : null,
        max: lim ? lim.n : null,
        ordered: constraints.some(c => c.kind === 'orderBy')
      });
      const size = sizeFor[name] || 0;
      return { size, docs: Array.from({ length: size }, (_, i) => ({ id: `${name}-${i}`, data: () => ({ createdAt: new (Timestamp as any)(Date.now()), status: 'succeeded' }) })) };
    }
  };
});
// Stable references: the dashboard lists these as effect dependencies, so new objects on each render would loop.
const stableAuth = { setView: vi.fn(), isAdmin: true, user: { uid: 'admin', getIdToken: async () => 'token' } };
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => stableAuth }));
vi.mock('../admin/IngredientPriceCatalogueAdmin', () => ({ IngredientPriceCatalogueAdmin: () => null }));

import { AdminDashboard } from './AdminDashboard';

const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 150)); });
const readsOf = (name: string) => reads.filter(read => read.name === name);
const openServiceHealth = async () => {
  const toggle = screen.getAllByRole('button').find(button => button.getAttribute('aria-expanded') !== null && /service health/i.test(button.textContent || '')) as HTMLElement;
  fireEvent.click(toggle);
  await settle();
};
const windowSelect = () => screen.getAllByRole('combobox')
  .find(el => Array.from((el as HTMLSelectElement).options).some(option => option.value === '30d')) as HTMLSelectElement;

describe('AdminDashboard telemetry reads', () => {
  beforeEach(() => {
    reads.length = 0;
    sizeFor = {};
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => null }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('reads usage and delivery events with a window start, an order and a limit of 5,000', async () => {
    render(<AdminDashboard />);
    await settle();
    for (const name of ['aiUsageEvents', 'searchDeliveryEvents']) {
      const read = readsOf(name)[0];
      expect(read, name).toBeDefined();
      expect(read.since).not.toBeNull();
      expect(read.ordered).toBe(true);
      expect(read.max).toBe(5000);
    }
  });

  it('changing the window reloads only the two telemetry collections', async () => {
    render(<AdminDashboard />);
    await settle();
    const usersBefore = readsOf('users').length;
    const webhooksBefore = readsOf('stripeWebhookEvents').length;
    const usageBefore = readsOf('aiUsageEvents').length;
    const firstSince = readsOf('aiUsageEvents')[0].since as number;

    await openServiceHealth();
    fireEvent.change(windowSelect(), { target: { value: '30d' } });
    await settle();

    expect(readsOf('users')).toHaveLength(usersBefore);
    expect(readsOf('stripeWebhookEvents')).toHaveLength(webhooksBefore);
    expect(readsOf('aiUsageEvents')).toHaveLength(usageBefore + 1);
    expect(readsOf('aiUsageEvents').at(-1)!.since as number).toBeLessThan(firstSince - 20 * 24 * 60 * 60 * 1000);
  });

  it('offers no unbounded window', async () => {
    render(<AdminDashboard />);
    await settle();
    await openServiceHealth();
    expect(Array.from(windowSelect().options).map(option => option.value)).toEqual(['24h', '7d', '30d']);
  });

  it('shows the truncation notice only when a read reaches its limit', async () => {
    render(<AdminDashboard />);
    await settle();
    await openServiceHealth();
    expect(screen.queryByText(/reached its 5,000-event limit/)).toBeNull();
    cleanup();
    sizeFor = { aiUsageEvents: 5000 };
    render(<AdminDashboard />);
    await settle();
    await openServiceHealth();
    expect(screen.queryByText(/reached its 5,000-event limit/)).not.toBeNull();
  });
});
