import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

type ComparisonScope = 'all' | 'search' | 'planning' | 'shopping';

type ComparisonRow = {
  capability: string;
  scope: Exclude<ComparisonScope, 'all'>;
};
export const WHY_DINNER_BY_DESIGN_ROWS: ComparisonRow[] = [
  { capability: 'Remembers preferences between searches', scope: 'search' },
  { capability: 'Applies preferences automatically', scope: 'search' },
  { capability: 'Provides estimated cost per portion', scope: 'search' },
  { capability: 'Compares cost, time, portions and nutrition in one place', scope: 'search' },
  { capability: 'Saves recipes for later', scope: 'planning' },
  { capability: 'Schedules dinners across the week', scope: 'planning' },
  { capability: 'Builds a consolidated, costed shopping list', scope: 'shopping' },
  { capability: 'Accounts for ingredients already available', scope: 'shopping' },
  { capability: 'Surfaces supermarket ready-made options', scope: 'shopping' },
  { capability: 'Carries the user from search to shopping', scope: 'shopping' },
];

const COMPACT_ROWS = WHY_DINNER_BY_DESIGN_ROWS.filter(row => [
  'Remembers preferences between searches',
  'Applies preferences automatically',
  'Provides estimated cost per portion',
  'Schedules dinners across the week',
  'Builds a consolidated, costed shopping list',
].includes(row.capability));

const SCOPE_OPTIONS: Array<{ id: ComparisonScope; label: string }> = [
  { id: 'all', label: 'All capabilities' },
  { id: 'search', label: 'Search' },
  { id: 'planning', label: 'Planning' },
  { id: 'shopping', label: 'Shopping' },
];

const CapabilityMark: React.FC<{ available: boolean; compact?: boolean }> = ({ available, compact = false }) => (
  <span
    className={compact
      ? `inline-flex items-center justify-center ${available ? 'text-emerald-700' : 'text-red-700'}`
      : `inline-flex h-7 w-7 items-center justify-center rounded-full ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
    aria-label={available ? 'Included' : 'Not normally included'}
  >
    {available ? <Check size={compact ? 16 : 17} strokeWidth={2.5} aria-hidden="true" /> : <X size={compact ? 15 : 16} strokeWidth={2.5} aria-hidden="true" />}
  </span>
);

interface WhyDinnerByDesignComparisonProps {
  compact?: boolean;
  onTryFreeSearch?: () => void;
}

export const WhyDinnerByDesignComparison: React.FC<WhyDinnerByDesignComparisonProps> = ({
  compact = false,
  onTryFreeSearch,
}) => {
  const [scope, setScope] = useState<ComparisonScope>('all');
  const rows = useMemo(() => {
    if (compact) return COMPACT_ROWS;
    return scope === 'all' ? WHY_DINNER_BY_DESIGN_ROWS : WHY_DINNER_BY_DESIGN_ROWS.filter(row => row.scope === scope);
  }, [compact, scope]);

  return (
    <div className={compact ? 'mt-8' : 'mt-8 sm:mt-10'}>
      {!compact && (
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter comparison capabilities">
          {SCOPE_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setScope(option.id)}
              aria-pressed={scope === option.id}
              className={`min-h-10 rounded-full border px-3.5 text-xs font-semibold transition-colors ${scope === option.id ? 'border-dbd-accent bg-dbd-accent text-white' : 'border-dbd-rule bg-white text-dbd-ink-2 hover:border-dbd-accent hover:text-dbd-accent'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className={compact ? 'overflow-hidden border-y border-dbd-rule/60' : 'overflow-hidden rounded-xl border border-dbd-rule bg-white shadow-sm'}>
        {compact ? (
          <div className="divide-y divide-dbd-rule/60">
            <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_4.5rem] items-center px-0 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-dbd-ink-3 sm:grid-cols-[minmax(0,1fr)_5rem_6rem]">
              <span>Capability</span>
              <span className="text-center">LLM</span>
              <span className="text-center">DinnerByDesign</span>
            </div>
            {rows.map(row => (
              <div key={row.capability} className="grid grid-cols-[minmax(0,1fr)_3.5rem_4.5rem] items-center px-0 py-2 sm:grid-cols-[minmax(0,1fr)_5rem_6rem]">
                <span className="pr-2 text-[11px] font-semibold leading-4 text-dbd-ink sm:text-xs">{row.capability}</span>
                <span className="flex justify-center"><CapabilityMark available={false} compact /></span>
                <span className="flex justify-center"><CapabilityMark available compact /></span>
              </div>
            ))}
          </div>
        ) : null}

        {!compact && <div className="hidden grid-cols-[minmax(0,1fr)_8rem_8rem] items-center border-b border-dbd-rule bg-dbd-surface-2 px-4 py-3 text-xs font-bold text-dbd-ink-2 sm:grid sm:px-5">
          <span>Capability</span>
          <span className="text-center">Typical LLM search</span>
          <span className="text-center">DinnerByDesign</span>
        </div>}

        {!compact && <div className="divide-y divide-dbd-rule sm:hidden">
          {rows.map(row => (
            <div key={row.capability} className="px-4 py-4">
              <p className="text-sm font-semibold leading-5 text-dbd-ink">{row.capability}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center text-[10px] font-bold uppercase tracking-wide text-dbd-ink-3">
                <div className="flex flex-col items-center gap-1.5"><CapabilityMark available={false} /><span>Typical LLM</span></div>
                <div className="flex flex-col items-center gap-1.5"><CapabilityMark available /><span>DinnerByDesign</span></div>
              </div>
            </div>
          ))}
        </div>}

        {!compact && <div className="hidden divide-y divide-dbd-rule sm:block">
          {rows.map(row => (
            <div key={row.capability} className="grid grid-cols-[minmax(0,1fr)_8rem_8rem] items-center px-4 py-3.5 sm:px-5">
              <span className="text-sm font-semibold leading-5 text-dbd-ink">{row.capability}</span>
              <span className="flex justify-center"><CapabilityMark available={false} /></span>
              <span className="flex justify-center"><CapabilityMark available /></span>
            </div>
          ))}
        </div>}
      </div>

      <p className="mt-4 text-xs leading-5 text-dbd-ink-3">
        This compares DinnerByDesign with a typical one-off LLM recipe search. A general LLM can reproduce some functions with extra prompts, tools or add-ons, but those steps have to be set up and repeated by the user.
      </p>

      {compact && onTryFreeSearch && (
        <button
          type="button"
          onClick={onTryFreeSearch}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-sm bg-dbd-accent px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-dbd-accent-mid focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent focus-visible:ring-offset-2"
        >
          Try a free search <ArrowRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
