import React from 'react';
import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { FIVE_DINNERS_FOR_TWO_UNDER_40 as plan } from '../../content/seoMealPlans';
import { FIVE_DINNERS_PRICE_DISCLOSURES } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface SeoMealPlanViewProps { onPersonalise: () => void; }
const money = (value: number) => `£${value.toFixed(2)}`;
const shoppingCategories = ['Protein', 'Produce', 'Chilled', 'Cupboard', 'Freezer'] as const;

export const SeoMealPlanView: React.FC<SeoMealPlanViewProps> = ({ onPersonalise }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[38px] w-auto max-w-[230px] object-contain mix-blend-multiply sm:h-[44px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><span>Affordable dinner plans</span></nav>
      <header className="mt-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Affordable weekly dinner plan</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{plan.title}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{plan.description}</p>
        <p className="mt-3 text-xs text-dbd-ink-3">By {plan.editorialOwner} · Published 18 July 2026 · Content reviewed 19 July 2026 · Prices checked 18 July 2026.</p>
      </header>

      <section className="mt-8 border-y border-dbd-rule/50 py-6">
        <h2 className="text-xl font-bold">A practical £40 week, not five separate shopping lists</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{plan.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Plan summary">
        <div className="rounded border border-dbd-rule/60 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Dinner target</p><p className="mt-1 text-2xl font-bold">{money(plan.budgetTarget)}</p><p className="mt-1 text-xs text-dbd-ink-3">Five dinners for two</p></div>
        <div className="rounded border border-dbd-rule/60 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Estimated ingredients</p><p className="mt-1 text-2xl font-bold">{money(plan.estimatedIngredientCost)}</p><p className="mt-1 text-xs text-dbd-ink-3">About {money(plan.estimatedIngredientCost / 10)} per portion</p></div>
        <div className="rounded border border-dbd-rule/60 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Expected checkout</p><p className="mt-1 text-2xl font-bold">{money(plan.expectedCheckoutCost)}</p><p className="mt-1 text-xs text-dbd-ink-3">Full reference packs required</p></div>
      </section>

      <ProgrammaticDisclosureList items={FIVE_DINNERS_PRICE_DISCLOSURES} className="mt-4" />

      <section className="mt-10">
        <h2 className="text-xl font-bold">The five-night dinner plan</h2>
        <div className="mt-4 overflow-hidden rounded border border-dbd-rule/60 bg-white">
          {plan.dinners.map((dinner) => <article key={dinner.day} className="border-b border-dbd-rule/40 p-4 last:border-b-0 sm:p-5">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-dbd-accent">{dinner.day}</p><h3 className="mt-1 text-base font-bold">{dinner.title}</h3><p className="mt-1 text-sm leading-6 text-dbd-ink-3">{dinner.description}</p></div><p className="shrink-0 text-sm font-bold">{money(dinner.estimatedCost)}</p></div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-dbd-ink-3"><Clock3 size={13} /> About {dinner.totalTimeMinutes} minutes</p>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#596b51]"><Check className="mt-0.5 shrink-0" size={13} />{dinner.sharedIngredientNote}</p>
          </article>)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Complete shopping list and cost calculation</h2>
        <p className="mt-3 text-sm leading-6 text-dbd-ink-3">The checkout cost represents complete reference packs. Value used apportions only the quantities used across ten portions. Together, the listed packs total {money(plan.expectedCheckoutCost)} and the quantities used total {money(plan.estimatedIngredientCost)}.</p>
        <div className="mt-5 space-y-5">
          {shoppingCategories.map(category => <div key={category}>
            <h3 className="text-sm font-bold">{category}</h3>
            <div className="mt-2 overflow-x-auto rounded border border-dbd-rule/60 bg-white">
              <table className="w-full min-w-[620px] border-collapse text-left text-xs">
                <thead className="bg-dbd-surface text-dbd-ink-3"><tr><th className="p-3 font-bold">Ingredient</th><th className="p-3 font-bold">Required</th><th className="p-3 font-bold">Reference pack</th><th className="p-3 text-right font-bold">Checkout</th><th className="p-3 text-right font-bold">Used</th></tr></thead>
                <tbody>{plan.shoppingList.filter(item => item.category === category).map(item => <tr key={item.ingredient} className="border-t border-dbd-rule/40"><td className="p-3"><strong>{item.ingredient}</strong><span className="mt-0.5 block text-[11px] text-dbd-ink-3">{item.usedIn}</span></td><td className="p-3">{item.quantityRequired}</td><td className="p-3">{item.referencePack}</td><td className="p-3 text-right font-semibold">{money(item.checkoutCost)}</td><td className="p-3 text-right">{money(item.usedValue)}</td></tr>)}</tbody>
              </table>
            </div>
          </div>)}
        </div>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <div><h2 className="text-xl font-bold">Prepare once, use again</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-dbd-ink-3">{plan.preparationAdvice.map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{item}</span></li>)}</ul></div>
        <div><h2 className="text-xl font-bold">What remains after the week</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-dbd-ink-3">{plan.leftoverGuidance.map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{item}</span></li>)}</ul></div>
      </section>

      <section className="mt-10"><h2 className="text-xl font-bold">The shopping strategy behind the week</h2><div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{plan.shoppingStrategy.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">How we kept the plan under £40</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.budgetPrinciples.map(item => <div key={item.title} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.explanation}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">How ingredients are reused</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.sharedIngredients.map(item => <div key={item.ingredient} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.ingredient}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.uses}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Practical substitutions</h2><div className="mt-4 space-y-3">{plan.substitutions.map(item => <div key={item.swap} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.swap}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.effect}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Make the plan work in different circumstances</h2><div className="mt-4 space-y-5">{plan.flexibleScenarios.map(item => <div key={item.question}><h3 className="text-sm font-bold">{item.question}</h3><p className="mt-1 text-sm leading-6 text-dbd-ink-3">{item.answer}</p></div>)}</div></section>

      <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5"><h2 className="text-xl font-bold">How this plan was selected</h2><div className="mt-3 space-y-3 text-sm leading-6 text-dbd-ink-3"><p>The plan balances five different dinners with a mixture of chicken, pulses and eggs. Ingredients are deliberately repeated so that opened packs can be used again rather than becoming five disconnected shopping lists.</p><p>It is not guaranteed to be the mathematically cheapest possible basket. The expected checkout estimate rounds consolidated ingredients to representative full packs and excludes common cupboard quantities such as salt, pepper and cooking oil.</p><p><a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">Read the ingredient-pricing methodology</a>, <a href="/recipe-methodology" className="font-semibold text-dbd-accent hover:underline">see how dinners are selected</a> or <a href="/food-costs/uk-food-costs-2026" className="font-semibold text-dbd-accent hover:underline">understand the wider UK food-cost picture</a>.</p></div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Questions about this £40 plan</h2><div className="mt-4 space-y-4 text-sm leading-6 text-dbd-ink-3">{plan.faqs.map(item => <div key={item.question}><h3 className="font-bold text-dbd-ink">{item.question}</h3><p>{item.answer}</p></div>)}</div></section>

      <ProgrammaticDisclosureFooter className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="text-xl font-bold">Make this week fit your household</h2><p className="mt-2 text-sm leading-6 text-white/70">Apply dietary rules, change the budget, replace dinners and generate one consolidated shopping list.</p></div><button type="button" onClick={onPersonalise} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Personalise this plan <ArrowRight size={16} /></button></section>
    </main>
  </div>
);
