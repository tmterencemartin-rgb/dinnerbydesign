import React from 'react';
import { ArrowRight } from 'lucide-react';
import { UK_FOOD_COSTS_2026 as guide } from '../../content/seoFoodCostGuides';
import { UK_FOOD_COST_CONTEXT_DISCLOSURES } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface FoodCostGuideViewProps { onPlanWeek: () => void; }

const SourceLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{children}</a>
);

export const FoodCostGuideView: React.FC<FoodCostGuideViewProps> = ({ onPlanWeek }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[38px] w-auto max-w-[230px] object-contain mix-blend-multiply sm:h-[44px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><span>Food cost guides</span></nav>

      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Food cost guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 18 July 2026 · Last reviewed 19 July 2026. Figures change monthly.</p>
        </header>

        <section className="mt-8 border-y border-dbd-rule/50 py-6">
          <h2 className="text-xl font-bold">What is happening</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">
            <p>UK food price inflation eased through the first half of 2026. The most recent confirmed figure from the ONS is 2.2 per cent for the 12 months to May 2026, down from 3.7 per cent in April. <SourceLink href={guide.sources[0].url}>ONS</SourceLink></p>
            <p>Two faster trackers gave an early reading for June. The <SourceLink href={guide.sources[1].url}>BRC</SourceLink> recorded 2.4 per cent, while <SourceLink href={guide.sources[2].url}>Which?</SourceLink> recorded 2.6 per cent. Their baskets and collection methods differ from the ONS, so the figures should not be treated as directly interchangeable.</p>
            <p>The ONS is the official reference point used here. The next confirmed figure was due on 22 July 2026 when this guide was reviewed.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">What it could mean for your shopping</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">
            <p>National figures describe an average across the country and many kinds of shopping. They provide useful context, but they cannot predict what one household will spend. That depends on the dinners cooked, the ingredients bought and where the shopping is done.</p>
            <p>For context, the Food Foundation's tracked weekly shopping basket cost £53.51 to £60.24 in June 2026, up 30.6 to 38.4 per cent since April 2022. <SourceLink href={guide.sources[3].url}>Food Foundation</SourceLink></p>
            <p>DinnerByDesign works differently. Its estimates are built from the specific dinners, quantities and ingredient prices in a plan, not from a national average.</p>
          </div>
        </section>

        <ProgrammaticDisclosureList items={UK_FOOD_COST_CONTEXT_DISCLOSURES} className="mt-6" />

        <section className="mt-10">
          <h2 className="text-xl font-bold">Why planning can make a difference</h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-7 text-dbd-ink-3">
            {['Reuse core ingredients across several dinners so less is bought and wasted.', 'Filter for lower-cost dinner ideas before deciding what to cook.', 'Use cheaper equivalent ingredients where a dinner allows it.', 'Work from a shopping list tied to scheduled dinners to avoid unplanned or duplicate purchases.'].map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{item}</span></li>)}
          </ul>
        </section>

        <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
          <h2 className="text-xl font-bold">Ways DinnerByDesign can help</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3">DinnerByDesign's Low Cost filter surfaces suitable dinner ideas using lower-cost ingredients. Schedule one or more saved dinners and DinnerByDesign generates a costed shopping list, so you can review the estimate before you shop.</p>
          <p className="mt-3 text-sm leading-6"><a href="/dinner-plans/5-dinners-for-2-under-40" className="font-semibold text-dbd-accent hover:underline">Explore five dinners for two under £40</a>, <a href="/food-costs/cooking-for-four-with-lower-cost-cuts" className="font-semibold text-dbd-accent hover:underline">compare meat cuts when cooking for four</a><span className="text-dbd-ink-3"> or </span><a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">read how ingredient prices are calculated</a>.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">How the trackers differ</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-dbd-ink-3">
            <p><strong className="text-dbd-ink">ONS Consumer Prices Index:</strong> the official reference basket, published after each month ends.</p>
            <p><strong className="text-dbd-ink">BRC Shop Price Index:</strong> shelf prices from major retailers, published faster but with different basket weightings.</p>
            <p><strong className="text-dbd-ink">Which? tracker:</strong> around 27,000 individual product prices across major supermarkets.</p>
            <p>Different baskets, weightings and collection dates can produce different rates for the same period.</p>
          </div>
        </section>

        <section className="mt-10 rounded border border-[#ead8c4] bg-[#fff6eb] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b4c1f]">Forecasts are not measured outcomes</p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-dbd-ink-3">
            <p>The <SourceLink href={guide.sources[4].url}>Food and Drink Federation</SourceLink> forecast food inflation of at least 9 per cent by the end of 2026. <SourceLink href={guide.sources[5].url}>IGD's June forecast</SourceLink> projected a peak of 5.5 per cent and an average of 3.7 to 4.7 per cent across 2026.</p>
            <p>The forecasts differ because their assumptions, timing and scenarios differ. They are uncertain projections and should not be read as recorded price changes.</p>
          </div>
        </section>

        <section className="mt-10 border-t border-dbd-rule/50 pt-8">
          <h2 className="text-xl font-bold">Sources and methodology</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3">Source figures were checked when this guide was reviewed; follow the links for subsequent releases.</p>
          <ul className="mt-4 space-y-3 text-sm leading-6">{guide.sources.map(source => <li key={source.url}><SourceLink href={source.url}>{source.label}</SourceLink></li>)}</ul>
        </section>
      </article>

      <ProgrammaticDisclosureFooter className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make your food budget go further</h2><p className="mt-2 text-sm leading-6 text-white/70">Build a week around your household, budget and available time.</p></div>
        <button type="button" onClick={onPlanWeek} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Plan my week <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
