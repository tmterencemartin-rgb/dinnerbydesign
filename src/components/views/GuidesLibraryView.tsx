import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_GUIDE_GROUPS, PUBLIC_GUIDE_LIBRARY } from '../../content/publicGuideLibrary';

export const GuidesLibraryView: React.FC<{ onPlanWeek: () => void }> = ({ onPlanWeek }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface"><div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between px-4 sm:min-h-[88px]"><a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[30.6px] w-auto max-w-[189px] object-contain mix-blend-multiply sm:h-[36px]" /></a><a href="/signin?mode=signin" className="text-xs font-semibold text-dbd-accent hover:underline">Sign in</a></div></header>
    <main id="guide-library-top" className="mx-auto max-w-5xl scroll-mt-2 px-4 py-5 pb-12 sm:py-9 sm:pb-16">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><span>Guides</span></nav>
      <header className="mt-4 max-w-3xl sm:mt-6"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-dbd-accent sm:text-[10px]">Public guide library</p><h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{PUBLIC_GUIDE_LIBRARY.title}</h1><p className="mt-2.5 text-sm leading-6 text-dbd-ink-3 sm:mt-3">{PUBLIC_GUIDE_LIBRARY.description}</p></header>
      <nav aria-label="Guide categories" className="mt-5 border-y border-dbd-rule/50 py-3.5 sm:mt-7 sm:flex sm:items-baseline sm:gap-5 sm:py-4">
        <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-dbd-ink-3">Browse by category</h2>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 sm:mt-0">
          {PUBLIC_GUIDE_GROUPS.map(group => (
            <a key={group.id} href={`#${group.id}`} className="text-xs leading-5 text-dbd-ink-2 underline decoration-dbd-rule underline-offset-4 transition-colors hover:text-dbd-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dbd-accent sm:text-sm">
              {group.title}
            </a>
          ))}
        </div>
      </nav>
      <div className="mt-6 space-y-8 border-t border-dbd-rule/50 pt-5 sm:mt-8 sm:space-y-10 sm:pt-6">
        {PUBLIC_GUIDE_GROUPS.map(group => (
          <section key={group.id}>
            <div className="max-w-2xl">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id={group.id} className="scroll-mt-4 text-base font-semibold sm:text-lg">{group.title}</h2>
                <a href="#guide-library-top" className="shrink-0 text-[10px] font-medium text-dbd-ink-3 underline decoration-dbd-rule underline-offset-4 hover:text-dbd-accent sm:text-xs" aria-label={`Back to the top from ${group.title}`}>Back to top</a>
              </div>
              <p className="mt-1 text-xs leading-5 text-dbd-ink-3 sm:text-sm">{group.description}</p>
            </div>
            <div className="mt-2 grid border-t border-dbd-rule/50 sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:border-0 lg:grid-cols-3">
              {group.articles.map(article => (
                <article key={article.path} className="border-b border-dbd-rule/50 py-3.5 sm:flex sm:h-full sm:flex-col sm:rounded sm:border sm:border-dbd-rule/60 sm:bg-white sm:p-4">
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-dbd-accent sm:text-[9px]">{article.category}</p>
                  <h3 className="mt-1 text-sm font-medium leading-5 sm:mt-1.5 sm:flex-grow sm:text-base sm:font-semibold sm:leading-snug"><a href={article.path} className="hover:text-dbd-accent hover:underline">{article.title}</a></h3>
                  <a href={article.path} className="mt-3 hidden items-center gap-1.5 text-xs font-semibold text-dbd-accent hover:underline sm:inline-flex">Read guide <ArrowRight size={13} /></a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-8 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5"><div><h2 className="text-lg font-semibold">Plan dinners around your household</h2><p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">Turn practical guidance into a coordinated week and a shopping list built from the dinners you schedule.</p></div><button type="button" onClick={onPlanWeek} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">Plan my week <ArrowRight size={14} /></button></section>
    </main>
  </div>
);
