import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  CHEAP_FINISHING_TOUCHES_FAQS,
  CHEAP_FINISHING_TOUCHES_GUIDE as guide,
  CHEAP_FINISHING_TOUCHES_SECTIONS,
} from '../../content/cheapFinishingTouchesGuide';
import {
  CHEAP_FINISHING_TOUCHES_DISCLOSURE_FOOTER,
  CHEAP_FINISHING_TOUCHES_DISCLOSURES,
} from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

const Section: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className={title ? 'mt-10' : 'mt-10 border-t border-dbd-rule/50 pt-8'}>
    {title && <h2 className="text-xl font-bold">{title}</h2>}
    <div className={`${title ? 'mt-4' : ''} space-y-4 text-[15px] leading-7 text-dbd-ink-3`}>{children}</div>
  </section>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2 pl-5">
    {items.map(item => <li key={item} className="list-disc pl-1">{item}</li>)}
  </ul>
);

export const CheapFinishingTouchesGuideView: React.FC<{ onFindDinner: () => void }> = ({ onFindDinner }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[34.2px] w-auto max-w-[207px] object-contain mix-blend-multiply sm:h-[39.6px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><a href="/guides" className="hover:underline">Guides</a><span className="px-2">/</span><span>Food cost guide</span></nav>
      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Food cost guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 24 July 2026 · Last reviewed 24 July 2026</p>
        </header>

        {CHEAP_FINISHING_TOUCHES_SECTIONS.map((section, index) => (
          <Section key={section.title ?? 'opening'} title={section.title}>
            <p>{section.paragraphs[0]}</p>
            {section.bullets && <BulletList items={section.bullets} />}
            {section.paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {index === 3 && <ProgrammaticDisclosureList items={CHEAP_FINISHING_TOUCHES_DISCLOSURES} className="mt-8" />}
          </Section>
        ))}

        <Section title="Frequently asked questions">
          <div className="space-y-7">
            {CHEAP_FINISHING_TOUCHES_FAQS.map(faq => (
              <section key={faq.question}>
                <h3 className="font-semibold text-dbd-ink">{faq.question}</h3>
                <p className="mt-2">{faq.answer}</p>
              </section>
            ))}
          </div>
        </Section>

        <Section title="Related guidance">
          <ul className="space-y-2">
            <li><a href="/food-costs/how-to-use-complete-packs" className="font-semibold text-dbd-accent hover:underline">Use complete packs without wasting ingredients</a></li>
            <li><a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">Plan several dinners around shared ingredients</a></li>
            <li><a href="/food-costs/make-low-cost-dinners-more-interesting" className="font-semibold text-dbd-accent hover:underline">Make low-cost dinners more interesting</a></li>
            <li><a href="/guides/home-cooked-or-ready-made-dinners" className="font-semibold text-dbd-accent hover:underline">Compare home-cooked and ready-made dinners</a></li>
          </ul>
        </Section>

        <Section title="Sources and further reading">
          <ul className="space-y-2">
            {guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{source.label}</a></li>)}
          </ul>
        </Section>

        <ProgrammaticDisclosureFooter copy={CHEAP_FINISHING_TOUCHES_DISCLOSURE_FOOTER} className="mt-10" />
      </article>

      <section className="mt-10 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div><h2 className="text-lg font-semibold">Give a familiar dinner a different finish</h2><p className="mt-1.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm">Tell DinnerByDesign what you have, your budget and your preferences, and find a recipe that makes those ingredients feel less predictable.</p></div>
        <button type="button" onClick={onFindDinner} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">Find a dinner <ArrowRight size={14} /></button>
      </section>
    </main>
  </div>
);
