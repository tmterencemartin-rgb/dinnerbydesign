import React from 'react';
import { Wordmark } from '../Wordmark';
import { ArrowRight, Clock3 } from 'lucide-react';
import {
  FAMILY_DINNERS_FOR_FOUR as plan,
  FAMILY_DINNERS_FOR_FOUR_DISCLOSURES,
  type FamilyPlanBasketCategory,
} from '../../content/familyDinnersForFourPlan';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface FamilyDinnersForFourViewProps {
  onPersonalise: () => void;
}

const money = (value: number) => `£${value.toFixed(2)}`;
const categories: FamilyPlanBasketCategory[] = ['Produce', 'Protein', 'Chilled', 'Cupboard', 'Freezer'];

export const FamilyDinnersForFourView: React.FC<FamilyDinnersForFourViewProps> = ({ onPersonalise }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home">
          <Wordmark className="text-[34.2px] sm:text-[39.6px]" />
        </a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3">
        <a href="/" className="hover:underline">DinnerByDesign</a>
        <span className="px-2">/</span>
        <a href="/dinner-plans" className="hover:underline">Affordable dinner plans</a>
        <span className="px-2">/</span>
        <span>Five dinners for four</span>
      </nav>

      <header className="mt-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Affordable family dinner plan</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{plan.title}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{plan.description}</p>
        <p className="mt-3 text-xs text-dbd-ink-3">By {plan.editorialOwner} · Published and reviewed 26 July 2026 · Prices checked 26 July 2026.</p>
      </header>

      <section className="mt-8 space-y-4 border-y border-dbd-rule/50 py-6 text-[15px] leading-7 text-dbd-ink-3">
        {plan.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Plan summary">
        <div className="rounded border border-dbd-rule/60 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Plan</p>
          <p className="mt-1 text-2xl font-bold">5 dinners</p>
          <p className="mt-1 text-xs text-dbd-ink-3">Four servings each</p>
        </div>
        <div className="rounded border border-dbd-rule/60 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Ingredient value used</p>
          <p className="mt-1 text-2xl font-bold">{money(plan.estimatedIngredientCost)}</p>
          <p className="mt-1 text-xs text-dbd-ink-3">{money(plan.averageCostPerServing)} per serving</p>
        </div>
        <div className="rounded border border-dbd-rule/60 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dbd-ink-3">Expected checkout</p>
          <p className="mt-1 text-2xl font-bold">{money(plan.expectedCheckoutCost)}</p>
          <p className="mt-1 text-xs text-dbd-ink-3">Complete reference packs</p>
        </div>
      </section>

      <ProgrammaticDisclosureList items={FAMILY_DINNERS_FOR_FOUR_DISCLOSURES} className="mt-4" />

      <section className="mt-10">
        <h2 className="text-xl font-bold">The five dinners</h2>
        <p className="mt-3 text-sm leading-6 text-dbd-ink-3">Each recipe serves four. Costs use the ingredient value consumed, rather than the complete pack price.</p>
        <div className="mt-5 space-y-6">
          {plan.recipes.map((recipe, index) => (
            <article key={recipe.title} className="rounded border border-dbd-rule/60 bg-white p-4 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-dbd-accent">Dinner {index + 1}</p>
              <h3 className="mt-1 text-lg font-bold">{recipe.title}</h3>
              <p className="mt-2 text-sm leading-6 text-dbd-ink-3">{recipe.summary}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-dbd-ink-3"><Clock3 size={13} />{recipe.timing}</p>

              <div className="mt-5 overflow-x-auto rounded border border-dbd-rule/50">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-dbd-surface text-dbd-ink-3">
                    <tr><th className="p-3 font-bold">Ingredient</th><th className="p-3 font-bold">Quantity for four</th></tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map(item => (
                      <tr key={item.name} className="border-t border-dbd-rule/40">
                        <td className="p-3">{item.name}</td><td className="p-3">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="mt-5 text-sm font-bold">Method</h4>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-dbd-ink-3">
                {recipe.method.map(step => <li key={step}>{step}</li>)}
              </ol>
              <p className="mt-4 text-sm font-bold">Cost: {money(recipe.cost)} total, {money(recipe.perServing)} per serving.</p>
              <p className="mt-2 text-xs leading-5 text-[#596b51]"><strong>Reuse:</strong> {recipe.reuse}</p>
              <p className="mt-2 text-xs leading-5 text-dbd-ink-3"><strong>Allergens and substitutions:</strong> {recipe.allergens}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">One coordinated shopping basket</h2>
        <p className="mt-3 text-sm leading-6 text-dbd-ink-3">Pack cost is the full price paid at checkout. Value used estimates the share consumed by these recipes. The difference carries into later cooking.</p>
        <div className="mt-5 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-bold">{category}</h3>
              <div className="mt-2 overflow-x-auto rounded border border-dbd-rule/60 bg-white">
                <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                  <thead className="bg-dbd-surface text-dbd-ink-3">
                    <tr><th className="p-3 font-bold">Ingredient</th><th className="p-3 font-bold">Used</th><th className="p-3 font-bold">Reference pack</th><th className="p-3 text-right font-bold">Pack</th><th className="p-3 text-right font-bold">Used</th></tr>
                  </thead>
                  <tbody>
                    {plan.basket.filter(item => item.category === category).map(item => (
                      <tr key={item.ingredient} className="border-t border-dbd-rule/40">
                        <td className="p-3"><strong>{item.ingredient}</strong><span className="mt-0.5 block text-[11px] text-dbd-ink-3">{item.usedIn}</span></td>
                        <td className="p-3">{item.quantityUsed}</td>
                        <td className="p-3">{item.referencePack}{item.estimated ? <span className="ml-1 font-semibold text-dbd-accent">(estimate)</span> : null}{item.sourceUrl ? <a className="mt-1 block font-semibold text-dbd-accent hover:underline" href={item.sourceUrl} target="_blank" rel="noreferrer">Price source</a> : null}</td>
                        <td className="p-3 text-right font-semibold">{money(item.packCost)}</td>
                        <td className="p-3 text-right">{money(item.valueUsed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded border border-dbd-rule/60 bg-white p-4 text-sm">
          <p><strong>Complete-pack checkout:</strong> {money(plan.expectedCheckoutCost)}</p>
          <p className="mt-1"><strong>Ingredient value used:</strong> {money(plan.estimatedIngredientCost)}</p>
          <p className="mt-1 text-xs leading-5 text-dbd-ink-3">The {money(plan.estimatedIngredientCost)} total exactly matches the five recipe costs. The remaining {money(plan.expectedCheckoutCost - plan.estimatedIngredientCost)} is held in unused portions of the packs.</p>
        </div>
      </section>

      {[
        ['How the basket is coordinated', plan.coordination],
        ['What remains after Friday', plan.remainders],
        ['Preparation across the week', plan.preparation],
        ['Substitutions', plan.substitutions],
      ].map(([heading, items]) => (
        <section key={heading as string} className="mt-10">
          <h2 className="text-xl font-bold">{heading}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-dbd-ink-3">
            {(items as readonly string[]).map(item => <li key={item} className="border-l-2 border-dbd-accent/40 pl-4">{item}</li>)}
          </ul>
        </section>
      ))}

      <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
        <h2 className="text-xl font-bold">How the figures were calculated</h2>
        <div className="mt-3 space-y-3 text-sm leading-6 text-dbd-ink-3">
          {plan.methodology.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Questions and answers</h2>
        <div className="mt-4 space-y-5">
          {plan.faqs.map(item => <div key={item.question}><h3 className="text-sm font-bold">{item.question}</h3><p className="mt-1 text-sm leading-6 text-dbd-ink-3">{item.answer}</p></div>)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Related reading</h2>
        <p className="mt-3 text-sm leading-7 text-dbd-ink-3">
          Browse <a href="/dinner-plans" className="font-semibold text-dbd-accent hover:underline">affordable dinner plans</a>, compare the <a href="/dinner-plans/5-dinners-for-2-under-40" className="font-semibold text-dbd-accent hover:underline">two-person version</a>, or read about <a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">coordinating ingredients</a>, <a href="/food-costs/portion-planning-and-food-waste" className="font-semibold text-dbd-accent hover:underline">portion planning</a> and <a href="/food-costs/fresh-or-frozen" className="font-semibold text-dbd-accent hover:underline">fresh and frozen choices</a>.
        </p>
        <p className="mt-3 text-sm leading-7 text-dbd-ink-3">See the <a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">pricing methodology</a>, <a href="/recipe-methodology" className="font-semibold text-dbd-accent hover:underline">recipe methodology</a> and <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food" target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">Food Standards Agency cooking guidance</a>.</p>
      </section>

      <ProgrammaticDisclosureFooter className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make this plan fit your household</h2><p className="mt-2 text-sm leading-6 text-white/70">Adjust the servings, replace a dinner and filter by what is already in your fridge or cupboard.</p></div>
        <button type="button" onClick={onPersonalise} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Personalise this plan <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
