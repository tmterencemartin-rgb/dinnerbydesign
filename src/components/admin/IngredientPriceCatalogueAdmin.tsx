import React, { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, deleteField, doc, getDocs, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { ChevronDown } from 'lucide-react';
import { db } from '../../firebase';
import { CatalogueUnit, RuntimeIngredientPriceCatalogueEntry } from '../../services/groceryService';

type PendingPriceRefresh = Pick<RuntimeIngredientPriceCatalogueEntry,
  'ingredientKey' | 'aliases' | 'productLabel' | 'retailer' | 'packPrice' | 'packQuantity' | 'packUnit' | 'sourceUrl'
> & { observedAt: string; feedId?: string; receivedAt?: Timestamp };

type CatalogueRecord = RuntimeIngredientPriceCatalogueEntry & {
  id: string;
  updatedAt?: Timestamp;
  refreshStatus?: 'review' | 'current' | 'approved' | 'rejected';
  pendingPriceRefresh?: PendingPriceRefresh;
};

const emptyDraft = {
  ingredientKey: '', aliases: '', productLabel: '', retailer: 'Tesco', packPrice: '', packQuantity: '',
  packUnit: 'g' as CatalogueUnit, sourceUrl: '', verifiedAt: '', verificationStatus: 'draft' as 'draft' | 'verified', active: false,
};

export const IngredientPriceCatalogueAdmin: React.FC = () => {
  const [entries, setEntries] = useState<CatalogueRecord[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const load = async () => {
    const snapshot = await getDocs(collection(db, 'ingredientPriceCatalogue'));
    setEntries(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as CatalogueRecord)).sort((a, b) => a.ingredientKey.localeCompare(b.ingredientKey)));
  };
  useEffect(() => { void load(); }, []);

  const staleCount = useMemo(() => entries.filter(entry => {
    if (entry.verificationStatus !== 'verified' || !entry.verifiedAt) return false;
    return Date.now() - new Date(entry.verifiedAt).getTime() > 14 * 86400000;
  }).length, [entries]);
  const reviewCount = useMemo(() => entries.filter(entry => entry.refreshStatus === 'review' && entry.pendingPriceRefresh).length, [entries]);

  const edit = (entry: CatalogueRecord) => {
    setEditingId(entry.id);
    setDraft({
      ingredientKey: entry.ingredientKey, aliases: entry.aliases.join(', '), productLabel: entry.productLabel,
      retailer: entry.retailer, packPrice: String(entry.packPrice), packQuantity: String(entry.packQuantity), packUnit: entry.packUnit,
      sourceUrl: entry.sourceUrl || '', verifiedAt: entry.verifiedAt?.slice(0, 10) || '', verificationStatus: entry.verificationStatus, active: entry.active,
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const ingredientKey = draft.ingredientKey.trim().toLowerCase();
    if (!ingredientKey || !draft.productLabel.trim() || Number(draft.packPrice) <= 0 || Number(draft.packQuantity) <= 0) return;
    if (draft.verificationStatus === 'verified' && (!draft.sourceUrl.trim() || !draft.verifiedAt)) return;
    setBusy(true);
    const id = editingId || ingredientKey.replace(/[^a-z0-9]+/g, '-');
    await setDoc(doc(db, 'ingredientPriceCatalogue', id), {
      ingredientKey,
      aliases: draft.aliases.split(',').map(value => value.trim().toLowerCase()).filter(Boolean),
      productLabel: draft.productLabel.trim(), retailer: draft.retailer.trim(), packPrice: Number(draft.packPrice),
      packQuantity: Number(draft.packQuantity), packUnit: draft.packUnit, sourceUrl: draft.sourceUrl.trim(),
      verifiedAt: draft.verifiedAt ? new Date(`${draft.verifiedAt}T12:00:00Z`).toISOString() : '',
      verificationStatus: draft.verificationStatus, active: draft.active && draft.verificationStatus === 'verified',
      sourceType: 'retailer-verified', catalogueVersion: draft.verifiedAt || 'draft', updatedAt: serverTimestamp(),
    });
    setDraft(emptyDraft); setEditingId(null); await load(); setBusy(false);
  };

  const approveRefresh = async (entry: CatalogueRecord) => {
    const pending = entry.pendingPriceRefresh;
    if (!pending) return;
    setBusy(true);
    try {
      await setDoc(doc(db, 'ingredientPriceCatalogue', entry.id), {
        ingredientKey: pending.ingredientKey,
        aliases: pending.aliases,
        productLabel: pending.productLabel,
        retailer: pending.retailer,
        packPrice: pending.packPrice,
        packQuantity: pending.packQuantity,
        packUnit: pending.packUnit,
        sourceUrl: pending.sourceUrl,
        verifiedAt: pending.observedAt,
        verificationStatus: 'verified',
        active: true,
        sourceType: 'retailer-verified',
        catalogueVersion: pending.observedAt.slice(0, 10),
        refreshStatus: 'approved',
        pendingPriceRefresh: deleteField(),
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const rejectRefresh = async (entry: CatalogueRecord) => {
    setBusy(true);
    try {
      await setDoc(doc(db, 'ingredientPriceCatalogue', entry.id), {
        refreshStatus: 'rejected',
        pendingPriceRefresh: deleteField(),
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await load();
    } finally {
      setBusy(false);
    }
  };

  return <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
    <button
      type="button"
      onClick={() => setIsOpen(previous => !previous)}
      aria-expanded={isOpen}
      aria-controls="pricing-data-panel"
      className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
    >
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Pricing data</span>
        <span className="mt-1 block text-base font-bold text-gray-950">Ingredient price catalogue</span>
        <span className="mt-1 block text-xs text-gray-500">Only active, verified entries with a source and verification date affect customer estimates. Licensed-feed changes require approval.</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-xs font-semibold text-gray-600">{entries.length} entries · {entries.filter(e => e.active).length} active · {reviewCount} to review · {staleCount} stale</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </span>
    </button>
    {isOpen && <div id="pricing-data-panel">
    <form onSubmit={save} className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-6">
      <input required placeholder="Ingredient key" value={draft.ingredientKey} onChange={e => setDraft({...draft, ingredientKey:e.target.value})} className="rounded border p-2 text-xs" />
      <input required placeholder="Retail product" value={draft.productLabel} onChange={e => setDraft({...draft, productLabel:e.target.value})} className="col-span-2 rounded border p-2 text-xs" />
      <input placeholder="Aliases, comma separated" value={draft.aliases} onChange={e => setDraft({...draft, aliases:e.target.value})} className="col-span-2 rounded border p-2 text-xs" />
      <input placeholder="Retailer" value={draft.retailer} onChange={e => setDraft({...draft, retailer:e.target.value})} className="rounded border p-2 text-xs" />
      <input required type="number" min="0.01" step="0.01" placeholder="Pack price £" value={draft.packPrice} onChange={e => setDraft({...draft, packPrice:e.target.value})} className="rounded border p-2 text-xs" />
      <input required type="number" min="0.01" step="0.01" placeholder="Pack quantity" value={draft.packQuantity} onChange={e => setDraft({...draft, packQuantity:e.target.value})} className="rounded border p-2 text-xs" />
      <select value={draft.packUnit} onChange={e => setDraft({...draft, packUnit:e.target.value as CatalogueUnit})} className="rounded border p-2 text-xs">{['g','kg','ml','l','each'].map(unit=><option key={unit}>{unit}</option>)}</select>
      <input type="date" value={draft.verifiedAt} onChange={e => setDraft({...draft, verifiedAt:e.target.value})} className="rounded border p-2 text-xs" />
      <select value={draft.verificationStatus} onChange={e => setDraft({...draft, verificationStatus:e.target.value as 'draft'|'verified'})} className="rounded border p-2 text-xs"><option value="draft">Draft</option><option value="verified">Verified</option></select>
      <label className="flex items-center gap-2 rounded border px-2 text-xs"><input type="checkbox" checked={draft.active} onChange={e => setDraft({...draft, active:e.target.checked})}/>Active</label>
      <input type="url" placeholder="Retailer source URL" value={draft.sourceUrl} onChange={e => setDraft({...draft, sourceUrl:e.target.value})} className="col-span-2 rounded border p-2 text-xs lg:col-span-5" />
      <button disabled={busy} className="rounded bg-gray-950 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{editingId ? 'Update entry' : 'Add entry'}</button>
    </form>
    <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-y text-gray-500"><tr><th className="p-2">Ingredient</th><th>Product and pack</th><th>Status</th><th>Verified</th><th></th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id} className="border-b"><td className="p-2 font-semibold">{entry.ingredientKey}</td><td>{entry.productLabel} · £{entry.packPrice.toFixed(2)} / {entry.packQuantity}{entry.packUnit}<div className="text-gray-400">{entry.retailer}</div>{entry.pendingPriceRefresh && <div className="mt-1 rounded bg-amber-50 px-2 py-1 text-amber-800">Proposed: {entry.pendingPriceRefresh.productLabel} · £{entry.pendingPriceRefresh.packPrice.toFixed(2)} / {entry.pendingPriceRefresh.packQuantity}{entry.pendingPriceRefresh.packUnit}</div>}</td><td>{entry.verificationStatus}{entry.active ? ' · active' : ''}{entry.refreshStatus === 'review' ? ' · review update' : ''}</td><td>{entry.verifiedAt?.slice(0,10) || 'Not verified'}</td><td className="whitespace-nowrap text-right">{entry.pendingPriceRefresh && <><button disabled={busy} type="button" onClick={()=>void approveRefresh(entry)} className="p-2 font-semibold text-emerald-700 disabled:opacity-50">Approve</button><button disabled={busy} type="button" onClick={()=>void rejectRefresh(entry)} className="p-2 font-semibold text-amber-700 disabled:opacity-50">Reject</button></>}<button type="button" onClick={()=>edit(entry)} className="p-2 font-semibold">Edit</button><button type="button" onClick={async()=>{if(window.confirm(`Delete ${entry.ingredientKey}?`)){await deleteDoc(doc(db,'ingredientPriceCatalogue',entry.id)); await load();}}} className="p-2 font-semibold text-red-600">Delete</button></td></tr>)}</tbody></table></div>
    </div>}
  </section>;
};
