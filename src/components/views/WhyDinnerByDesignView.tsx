import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WhyDinnerByDesignComparison } from '../WhyDinnerByDesignComparison';

interface WhyDinnerByDesignViewProps {
  onTryFreeSearch: () => void;
}

export const WhyDinnerByDesignView: React.FC<WhyDinnerByDesignViewProps> = ({ onTryFreeSearch }) => (
  <main className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
    <header className="max-w-3xl pt-7 sm:pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-dbd-accent sm:text-[10px]">Why DinnerByDesign?</p>
      <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight text-dbd-ink sm:text-3xl">
        Recipe search is only the first step.
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-dbd-ink-3 sm:text-[17px]">
        A general LLM can suggest a recipe. DinnerByDesign keeps the decisions connected, from preferences and cost through to saving, scheduling and the shopping list.
      </p>
    </header>

    <section aria-labelledby="comparison-heading" className="mt-9 sm:mt-12">
      <div className="max-w-2xl">
        <h2 id="comparison-heading" className="text-base font-semibold text-dbd-ink sm:text-lg">What happens after the search?</h2>
        <p className="mt-2 text-sm leading-6 text-dbd-ink-3">
          Use the filters to focus on the part of the workflow that matters to you.
        </p>
      </div>
      <WhyDinnerByDesignComparison />
    </section>

    <section className="mt-10 border-t border-dbd-rule/60 pt-7 sm:mt-12 sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div>
        <h2 className="text-lg font-semibold text-dbd-ink">See the workflow for yourself.</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-dbd-ink-3">Start with three free searches, then decide whether DinnerByDesign earns a place in your weekly routine.</p>
      </div>
      <button
        type="button"
        onClick={onTryFreeSearch}
        className="mt-4 inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-dbd-accent px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-dbd-accent-mid focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent focus-visible:ring-offset-2 sm:mt-0 sm:w-auto"
      >
        Try a free search <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  </main>
);
