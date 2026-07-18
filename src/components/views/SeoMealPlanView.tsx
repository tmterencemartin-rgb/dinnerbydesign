import React from 'react';
import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { FIVE_DINNERS_FOR_TWO_UNDER_40 as plan } from '../../content/seoMealPlans';

interface SeoMealPlanViewProps { onPersonalise: () => void; }
const money = (value: number) => `£${value.toFixed(2)}`;

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
        <p className="mt-3 text-xs text-dbd-ink-3">By {plan.editorialOwner} · Published and price basis reviewed 18 July 2026.</p>
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

      <p className="mt-3 text-xs leading-5 text-dbd-ink-3">These are planning estimates based on the DinnerByDesign UK reference-price catalogue, not a retailer quotation. Prices, brands, pack sizes and what you already own will change the checkout total.</p>

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

      <section className="mt-10"><h2 className="text-xl font-bold">The shopping strategy behind the week</h2><div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{plan.shoppingStrategy.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">How we kept the plan under £40</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.budgetPrinciples.map(item => <div key={item.title} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.explanation}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">How ingredients are reused</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.sharedIngredients.map(item => <div key={item.ingredient} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.ingredient}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.uses}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Practical substitutions</h2><div className="mt-4 space-y-3">{plan.substitutions.map(item => <div key={item.swap} className="rounded border border-dbd-rule/60 bg-white p-4"><h3 className="text-sm font-bold">{item.swap}</h3><p className="mt-1 text-xs leading-5 text-dbd-ink-3">{item.effect}</p></div>)}</div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Make the plan work in different circumstances</h2><div className="mt-4 space-y-5">{plan.flexibleScenarios.map(item => <div key={item.question}><h3 className="text-sm font-bold">{item.question}</h3><p className="mt-1 text-sm leading-6 text-dbd-ink-3">{item.answer}</p></div>)}</div></section>

      <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5"><h2 className="text-xl font-bold">How this plan was selected</h2><div className="mt-3 space-y-3 text-sm leading-6 text-dbd-ink-3"><p>The plan balances five different dinners with a mixture of chicken, pulses and eggs. Ingredients are deliberately repeated so that opened packs can be used again rather than becoming five disconnected shopping lists.</p><p>It is not guaranteed to be the mathematically cheapest possible basket. The expected checkout estimate rounds consolidated ingredients to representative full packs and excludes common cupboard quantities such as salt, pepper and cooking oil.</p><p><a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">Read the ingredient-pricing methodology</a> or <a href="/recipe-methodology" className="font-semibold text-dbd-accent hover:underline">see how dinners are selected</a>.</p></div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Questions about this £40 plan</h2><div className="mt-4 space-y-3 text-sm leading-6 text-dbd-ink-3"><div><h3 className="font-bold text-dbd-ink">Does the £40 target include full supermarket packs?</h3><p>Yes. The expected checkout figure uses representative complete packs; the lower ingredient figure shows only the value used by these dinners.</p></div><div><h3 className="font-bold text-dbd-ink">Can I make the plan vegetarian?</h3><p>Yes. Replace the chicken with chickpeas and mushrooms, then apply vegetarian preferences when personalising the plan.</p></div><div><h3 className="font-bold text-dbd-ink">Will my actual checkout be exactly £37.90?</h3><p>No. Retailer, location, availability, substitutions, promotions and ingredients already at home will change it.</p></div></div></section>

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="text-xl font-bold">Make this week fit your household</h2><p className="mt-2 text-sm leading-6 text-white/70">Apply dietary rules, change the budget, replace dinners and generate one consolidated shopping list.</p></div><button type="button" onClick={onPersonalise} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Personalise this plan <ArrowRight size={16} /></button></section>
    </main>
  </div>
);
