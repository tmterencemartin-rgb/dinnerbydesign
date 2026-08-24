import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WhyDinnerByDesignComparison } from '../WhyDinnerByDesignComparison';

interface WhyDinnerByDesignViewProps {
  onTryFreeSearch: () => void;
}

export const WhyDinnerByDesignView: React.FC<WhyDinnerByDesignViewProps> = ({ onTryFreeSearch }) => (
  <main className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
    <header className="max-w-3xl pt-7 sm:pt-10">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Why DinnerByDesign?</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-dbd-ink sm:text-5xl">
        Recipe search is only the first step.
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-dbd-ink-3 sm:text-[17px]">
        A general LLM can suggest a recipe. DinnerByDesign keeps the decisions connected, from preferences and cost through to saving, scheduling and the shopping list.
      </p>
    </header>

    <section aria-labelledby="comparison-heading" className="mt-9 sm:mt-12">
      <div className="max-w-2xl">
        <h2 id="comparison-heading" className="text-xl font-bold text-dbd-ink sm:text-2xl">What happens after the search?</h2>
        <p className="mt-2 text-sm leading-6 text-dbd-ink-3">
          Use the filters to focus on the part of the workflow that matters to you.
        </p>
      </div>
      <WhyDinnerByDesignComparison />
    </section>

    <section className="mt-10 rounded-xl bg-dbd-ink p-6 text-white sm:mt-14 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">See the workflow for yourself.</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Start with three free searches, then decide whether DinnerByDesign earns a place in your weekly routine.</p>
      </div>
      <button
        type="button"
        onClick={onTryFreeSearch}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink transition-colors hover:bg-dbd-surface sm:mt-0 sm:w-auto"
      >
        Try a free search <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  </main>
);
