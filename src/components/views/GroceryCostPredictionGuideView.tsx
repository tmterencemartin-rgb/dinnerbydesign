import React from 'react';
import { Wordmark } from '../Wordmark';
import { ArrowRight } from 'lucide-react';
import {
  GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML,
  GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML,
  GROCERY_COST_PREDICTION_GUIDE as guide,
  GROCERY_COST_PREDICTION_OPENING_HTML,
} from '../../content/groceryCostPredictionGuide';
import {
  GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER,
  GROCERY_COST_PREDICTION_DISCLOSURES,
} from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

const articleStyles = 'space-y-10 [&_section]:space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-dbd-ink-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:text-dbd-ink-3 [&_a]:font-semibold [&_a]:text-dbd-accent [&_a:hover]:underline';

const EditorialHtml: React.FC<{ html: string }> = ({ html }) => (
  <div className={articleStyles} dangerouslySetInnerHTML={{ __html: html }} />
);

export const GroceryCostPredictionGuideView: React.FC<{ onPlanWeek: () => void }> = ({ onPlanWeek }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><Wordmark className="text-[34.2px] sm:text-[39.6px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>
    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><a href="/guides" className="hover:underline">Guides</a><span className="px-2">/</span><span>Food cost guides</span></nav>
      <article>
        <header className="mt-7"><p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Food cost guide</p><h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1><p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p><p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 21 July 2026 · Last reviewed 21 July 2026</p></header>
        <div className="mt-10 border-t border-dbd-rule/50 pt-8"><EditorialHtml html={GROCERY_COST_PREDICTION_OPENING_HTML} /></div>
        <ProgrammaticDisclosureList items={GROCERY_COST_PREDICTION_DISCLOSURES.slice(0, 1)} className="mt-8" />
        <div className="mt-10"><EditorialHtml html={GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML} /></div>
        <ProgrammaticDisclosureList items={GROCERY_COST_PREDICTION_DISCLOSURES.slice(1)} className="mt-8" />
        <div className="mt-10"><EditorialHtml html={GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML} /></div>
        <section className="mt-10"><h2 className="text-xl font-bold">Frequently asked questions</h2><div className="mt-5 space-y-7">{guide.faqs.map(faq => <section key={faq.question}><h3 className="text-base font-bold">{faq.question}</h3><p className="mt-2 text-[15px] leading-7 text-dbd-ink-3">{faq.answer}</p></section>)}</div></section>
        <section className="mt-10"><h2 className="text-xl font-bold">Sources and further reading</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-dbd-ink-3">{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{source.label}</a></li>)}</ul></section>
      </article>
      <ProgrammaticDisclosureFooter copy={GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER} className="mt-10" />
      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="text-xl font-bold">Plan with greater visibility</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Build a week around your household, budget and available time, then see how complete packs, shared ingredients and scheduled dinners affect your shopping list.</p><a href="/guides" className="mt-3 inline-block text-xs font-semibold text-white/80 hover:underline">Browse all guides</a></div><button type="button" onClick={onPlanWeek} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Plan my week <ArrowRight size={16} /></button></section>
    </main>
  </div>
);
