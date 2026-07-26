import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_GUIDE_LIBRARY, PUBLIC_GUIDE_PATHWAYS } from '../../content/publicGuideLibrary';

export const GuidesLibraryView: React.FC<{ onPlanWeek: () => void }> = ({ onPlanWeek }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <main className="mx-auto max-w-5xl px-4 pb-12 sm:pb-16">
      <header className="max-w-3xl">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-dbd-accent sm:text-[10px]">Public resources</p>
        <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{PUBLIC_GUIDE_LIBRARY.title}</h1>
        <p className="mt-2.5 text-sm leading-6 text-dbd-ink-3 sm:mt-3">{PUBLIC_GUIDE_LIBRARY.description}</p>
      </header>

      <section className="mt-7 sm:mt-9">
        <h2 className="border-b border-dbd-rule/60 pb-3 text-base font-semibold sm:text-lg">Choose where to start</h2>
        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {PUBLIC_GUIDE_PATHWAYS.map((pathway, index) => (
            <a key={pathway.id} href={pathway.path} className="group flex min-h-[190px] flex-col rounded border border-dbd-rule/70 bg-white p-5 transition-colors hover:border-dbd-accent">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-dbd-accent">0{index + 1}</span>
              <h2 className="mt-3 text-lg font-semibold leading-6 text-dbd-ink group-hover:text-dbd-accent">{pathway.title}</h2>
              <p className="mt-2 text-xs leading-5 text-dbd-ink-3">{pathway.shortDescription}</p>
              <span className="mt-auto flex items-center justify-between pt-5 text-xs font-semibold text-dbd-ink-2 group-hover:text-dbd-accent">
                <span>{pathway.articles.length} {pathway.articles.length === 1 ? 'guide' : 'guides'}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <h2 className="text-lg font-semibold">Plan dinners around your household</h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">Turn practical ideas into a coordinated week and a shopping list built from the dinners you schedule.</p>
        </div>
        <button type="button" onClick={onPlanWeek} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">
          Plan my week <ArrowRight size={14} />
        </button>
      </section>
    </main>
  </div>
);
