import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatPublicArticleTitle, formatPublicNumber, PUBLIC_PATHWAYS, type PublicPathway } from '../../content/publicPathways';

interface PublicPathwayViewProps {
  pathway: PublicPathway;
  onPrimaryAction: () => void;
}

export const PublicPathwayView: React.FC<PublicPathwayViewProps> = ({ pathway, onPrimaryAction }) => {
  const otherPathways = PUBLIC_PATHWAYS.filter(item => item.id !== pathway.id);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
      <main className="mx-auto max-w-5xl px-4 pb-12 sm:pb-16">
        <header className="max-w-3xl">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-dbd-accent sm:text-[10px]">{pathway.eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{pathway.title}</h1>
          <p className="mt-2.5 text-sm leading-6 text-dbd-ink-3 sm:mt-3">{pathway.description}</p>
        </header>

        <section className="mt-7 sm:mt-9">
          <div className="flex items-end justify-between gap-4 border-b border-dbd-rule/60 pb-3">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">Browse this pathway</h2>
              <p className="mt-1 text-xs leading-5 text-dbd-ink-3">{formatPublicNumber(pathway.articles.length)} {pathway.articles.length === 1 ? 'guide' : 'guides'}, with no duplicate topics.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-3">
            {pathway.articles.map((article, index) => (
              <article key={article.path} className="border-b border-dbd-rule/50">
                <a href={article.path} className="group flex min-h-[92px] items-start justify-between gap-4 py-4 text-dbd-ink-2 transition-colors hover:text-dbd-accent">
                  <span>
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.11em] text-dbd-ink-3">{index === 0 ? 'Start here' : article.category}</span>
                    <span className="mt-1.5 block text-sm font-semibold leading-5">{formatPublicArticleTitle(article.title)}</span>
                  </span>
                  <ArrowRight size={14} className="mt-5 shrink-0 text-dbd-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-dbd-accent" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 border-t border-dbd-rule/60 pt-5 sm:mt-10">
          <h2 className="text-base font-semibold sm:text-lg">Explore another pathway</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {otherPathways.map(item => (
              <a key={item.id} href={item.path} className="group rounded border border-dbd-rule/70 bg-white p-4 transition-colors hover:border-dbd-accent">
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-semibold text-dbd-ink group-hover:text-dbd-accent">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-dbd-ink-3">{item.shortDescription}</span>
                  </span>
                  <ArrowRight size={14} className="mt-1 shrink-0 text-dbd-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-dbd-accent" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div>
            <h2 className="text-lg font-semibold">Make it work for your household</h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">Use your own budget, preferences, servings and available ingredients.</p>
          </div>
          <button type="button" onClick={onPrimaryAction} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">
            {pathway.actionLabel} <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  );
};
