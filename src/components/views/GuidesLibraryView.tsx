import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLISHED_ARTICLES } from '../../content/publicArticles';
import { PUBLIC_GUIDE_LIBRARY } from '../../content/publicGuideLibrary';

export const GuidesLibraryView: React.FC<{ onPlanWeek: () => void }> = ({ onPlanWeek }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface"><div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]"><a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[38px] w-auto max-w-[230px] object-contain mix-blend-multiply sm:h-[44px]" /></a><a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a></div></header>
    <main className="mx-auto max-w-5xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><span>Guides</span></nav>
      <header className="mt-7 max-w-3xl"><p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Public guide library</p><h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{PUBLIC_GUIDE_LIBRARY.title}</h1><p className="mt-4 text-[15px] leading-7 text-dbd-ink-3">{PUBLIC_GUIDE_LIBRARY.description}</p></header>
      <section className="mt-10 border-t border-dbd-rule/50 pt-8"><h2 className="text-xl font-bold">Browse all guides</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PUBLISHED_ARTICLES.map(article => <article key={article.path} className="flex h-full flex-col rounded border border-dbd-rule/60 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dbd-accent">{article.category}</p><h3 className="mt-2 flex-grow text-lg font-bold leading-snug"><a href={article.path} className="hover:text-dbd-accent hover:underline">{article.title}</a></h3><a href={article.path} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-dbd-accent hover:underline">Read guide <ArrowRight size={15} /></a></article>)}</div></section>
      <section className="mt-12 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="text-xl font-bold">Plan dinners around your household</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Turn practical guidance into a coordinated week and a shopping list built from the dinners you schedule.</p></div><button type="button" onClick={onPlanWeek} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Plan my week <ArrowRight size={16} /></button></section>
    </main>
  </div>
);
