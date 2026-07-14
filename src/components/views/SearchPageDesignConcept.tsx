import React from 'react';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchPageDesignConceptProps {
  onBack: () => void;
}

const activeCriteria = ['Main-course salads', 'Under 30 mins', 'Simple'];

const sampleResults = [
  {
    tag: 'British',
    source: 'BBCGOODFOOD.COM',
    title: 'Smoked Mackerel, Watermelon and Feta Salad',
    meta: '420 kcal pp | £2.80 pp | 10 mins'
  },
  {
    tag: 'Mediterranean',
    source: 'REALFOOD.TESCO.COM',
    title: 'Peach, Prosciutto and Mozzarella Salad',
    meta: '380 kcal pp | £3.20 pp | 15 mins'
  },
  {
    tag: 'British',
    source: 'JAMIEOLIVER.COM',
    title: "Strawberry, Avocado and Goat's Cheese Salad",
    meta: '350 kcal pp | £2.50 pp | 20 mins'
  }
];

export const SearchPageDesignConcept: React.FC<SearchPageDesignConceptProps> = ({ onBack }) => {
  return (
    <div className="mx-auto w-full max-w-4xl pb-12">
      <div className="mb-5 border-b border-dbd-rule/70 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-dbd-ink-3 transition-colors hover:text-dbd-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Current search page
        </button>
        <h1 className="text-[19px] font-bold tracking-tight text-dbd-ink sm:text-[23px]">
          Search page design concept
        </h1>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-dbd-ink-3">
          A quieter version of Search: fewer panels, fewer icons, and stronger priority for the query and results.
        </p>
      </div>

      <section className="space-y-5">
        <div className="space-y-3 border-b border-dbd-rule/70 pb-5">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-dbd-accent">
                Search
              </p>
              <h2 className="mt-1 text-[20px] font-bold leading-tight tracking-tight text-dbd-ink sm:text-[26px]">
                What do you want dinner to work around?
              </h2>
            </div>
            <button
              type="button"
              className="hidden shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-dbd-ink-3 transition-colors hover:text-dbd-ink sm:inline-flex"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Preferences
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-h-12 flex-1 items-center gap-2 border border-dbd-rule bg-white px-3 shadow-sm">
              <Search className="h-4.5 w-4.5 shrink-0 text-dbd-ink-3" />
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-dbd-ink">
                unusual summer main-course salads
              </span>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-dbd-ink-3 transition-colors hover:text-dbd-ink"
                aria-label="Clear search"
                title="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              className="min-h-12 shrink-0 bg-dbd-accent px-5 text-[12px] font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-dbd-accent-mid"
            >
              Find options
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="grid flex-1 grid-cols-2 gap-1 rounded bg-dbd-surface-2 p-1">
              <button
                type="button"
                className="min-h-10 bg-white text-[11px] font-bold uppercase tracking-widest text-dbd-accent shadow-sm"
              >
                Homemade
              </button>
              <button
                type="button"
                className="min-h-10 text-[11px] font-bold uppercase tracking-widest text-dbd-ink-3"
              >
                Ready-made
              </button>
            </div>
            <button
              type="button"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 px-2 text-[11px] font-bold uppercase tracking-widest text-dbd-ink-3 transition-colors hover:text-dbd-ink sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Preferences
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 border-b border-dbd-rule/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-[18px] font-bold tracking-tight text-dbd-ink sm:text-[22px]">
                3 main-course salads under 30 minutes
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-dbd-ink-3">
                Fresh, substantial options with interesting flavour combinations.
              </p>
            </div>
            <button
              type="button"
              className="self-start text-[11px] font-bold uppercase tracking-widest text-dbd-accent transition-colors hover:text-dbd-accent-mid sm:self-auto"
            >
              Refine results
            </button>
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">
            {activeCriteria.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <span className="text-dbd-rule">|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="divide-y divide-dbd-rule/60 border-y border-dbd-rule/70">
            {sampleResults.map(result => (
              <article
                key={result.title}
                className="grid gap-3 bg-white px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-dbd-ink-3">
                    <span>{result.tag}</span>
                    <span className="text-dbd-rule">|</span>
                    <span className="truncate">{result.source}</span>
                  </div>
                  <h3 className="mt-1 truncate text-[16px] font-bold leading-tight text-dbd-ink">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium text-dbd-ink-3">
                    {result.meta}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="min-h-9 bg-dbd-surface px-3 text-[10px] font-bold uppercase tracking-widest text-dbd-ink-3 transition-colors hover:text-dbd-ink"
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    className="min-h-9 bg-dbd-ink px-4 text-[10px] font-bold uppercase tracking-widest text-white"
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              className="min-h-10 border border-dbd-rule bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-dbd-accent shadow-sm"
            >
              More choices
            </button>
            <button
              type="button"
              className="min-h-10 border border-dbd-rule bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-dbd-ink-3 shadow-sm"
            >
              New search
            </button>
          </div>
        </div>

        <div className="border-t border-dbd-rule/70 pt-4">
          <p className="text-[12px] leading-relaxed text-dbd-ink-3">
            Account prompt idea: after useful results appear, show a small line such as “Create an account to save these recipes and build your week” near the save action rather than adding another panel.
          </p>
        </div>
      </section>
    </div>
  );
};
