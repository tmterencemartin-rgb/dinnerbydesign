import React from 'react';
import { Wordmark } from '../Wordmark';
import { ArrowRight } from 'lucide-react';
import {
  COOKING_FOR_ONE_ASSUMPTIONS,
  COOKING_FOR_ONE_BASKET,
  COOKING_FOR_ONE_CHECKOUT_TOTAL,
  COOKING_FOR_ONE_LEFTOVERS,
  COOKING_FOR_ONE_PRICE_CHECK_DATE,
  COOKING_FOR_ONE_RECIPES,
  COOKING_FOR_ONE_SCHEDULE,
  COOKING_FOR_ONE_USED_VALUE,
} from '../../content/cookingForOnePlan';
import { COOKING_FOR_ONE_GUIDE as guide } from '../../content/seoFoodCostGuides';
import { COOKING_FOR_ONE_DISCLOSURES, COOKING_FOR_ONE_DISCLOSURE_FOOTER } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface CookingForOneGuideViewProps {
  onPlanDinners: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`mt-10 ${className}`.trim()}>
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{children}</div>
  </section>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-3">
    {items.map(item => (
      <li key={item} className="flex gap-3">
        <span aria-hidden="true" className="text-dbd-accent">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TableWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto rounded border border-dbd-rule/60 bg-white">{children}</div>
);

const thClass = 'border-b border-dbd-rule/60 px-3 py-3 text-left text-xs font-bold text-dbd-ink';
const tdClass = 'border-b border-dbd-rule/40 px-3 py-3 align-top text-sm leading-5 text-dbd-ink-3';

export const CookingForOneGuideView: React.FC<CookingForOneGuideViewProps> = ({ onPlanDinners }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><Wordmark className="text-[34.2px] sm:text-[39.6px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3">
        <a href="/" className="hover:underline">DinnerByDesign</a>
        <span className="px-2">/</span>
        <a href="/food-costs" className="hover:underline">Food-cost and waste guidance</a>
        <span className="px-2">/</span>
        <span>Cooking for one</span>
      </nav>

      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Costed dinner plan</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 20 July 2026 · Last reviewed 28 July 2026</p>
        </header>

        <section className="mt-8 space-y-4 border-y border-dbd-rule/50 py-6 text-[15px] leading-7 text-dbd-ink-3">
          <p>Cooking for one often becomes awkward at the shopping stage. Most recipe publishers still write for two or four people, while spinach, chicken and herbs arrive in packs that rarely match one serving. Scaling everything down can look neat on paper, but it may introduce quantities the original publisher never tested.</p>
          <p>This plan takes a more practical route. Four established recipes are cooked at their published yield. One serving is eaten for dinner, three extra servings become named next-day lunches, and one four-serving dish supplies a second scheduled dinner plus two dated freezer portions.</p>
          <p>The basket is coordinated to reduce waste, not eliminate it. Some food remains for later. The important part is that the perishable leftovers are visible and given a realistic destination.</p>
        </section>

        <GuideSection title="The five-dinner schedule">
          <TableWrap>
            <table className="w-full min-w-[620px] border-collapse">
              <thead><tr><th className={thClass}>When</th><th className={thClass}>Dinner</th><th className={thClass}>What happens to the rest</th></tr></thead>
              <tbody>
                {COOKING_FOR_ONE_SCHEDULE.map(item => (
                  <tr key={item.when}><td className={tdClass}>{item.when}</td><td className={tdClass}>{item.dinner}</td><td className={tdClass}>{item.destination}</td></tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </GuideSection>

        {COOKING_FOR_ONE_RECIPES.map((recipe, index) => (
          <GuideSection key={recipe.name} title={`${index + 1}. ${recipe.name}`}>
            <p><span className="font-semibold text-dbd-ink">Original recipe:</span> <a href={recipe.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{recipe.publisher}: {recipe.name}</a></p>
            <p>{recipe.summary}</p>
            <p>{recipe.servingPlan}</p>
            <p><span className="font-semibold text-dbd-ink">Why it earns its place:</span> {recipe.basketFit}</p>
          </GuideSection>
        ))}

        <GuideSection title="5. The freezer night">
          <p>Dinner five is one of the balsamic chicken portions frozen after dinner three. Defrost it in the fridge, use it within 24 hours of defrosting, and reheat it only once until steaming hot throughout. It is not a fifth recipe, which is precisely the point: no new shopping or preparation is needed.</p>
        </GuideSection>

        <GuideSection title="Where every serving goes">
          <p>The four published recipes provide ten servings: five scheduled dinners, three next-day lunches and two future freezer portions.</p>
          <TableWrap>
            <table className="w-full min-w-[540px] border-collapse">
              <thead><tr><th className={thClass}>Published dish</th><th className={thClass}>Servings</th><th className={thClass}>Destination</th></tr></thead>
              <tbody>
                {COOKING_FOR_ONE_RECIPES.map(recipe => (
                  <tr key={recipe.name}>
                    <td className={tdClass}>{recipe.name}</td>
                    <td className={tdClass}>{recipe.servings}</td>
                    <td className={tdClass}>{recipe.servings === 4 ? '2 scheduled dinners, 2 freezer portions' : '1 dinner, 1 next-day lunch'}</td>
                  </tr>
                ))}
                <tr><td className={tdClass}>Total</td><td className={tdClass}>10</td><td className={tdClass}>5 dinners, 3 lunches, 2 future freezer portions</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </GuideSection>

        <GuideSection title="What the basket costs">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-dbd-rule/60 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-dbd-ink-3">Complete-pack checkout</p>
              <p className="mt-1 text-2xl font-bold text-dbd-ink">{COOKING_FOR_ONE_CHECKOUT_TOTAL}</p>
            </div>
            <div className="rounded border border-dbd-rule/60 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-dbd-ink-3">Ingredient value used</p>
              <p className="mt-1 text-2xl font-bold text-dbd-ink">{COOKING_FOR_ONE_USED_VALUE}</p>
            </div>
          </div>
          <p>These estimates use Aldi UK online prices checked {COOKING_FOR_ONE_PRICE_CHECK_DATE}. The checkout figure covers 27 complete packs or items. The ingredient value uses the estimated quantities consumed across all ten servings, calculated from unrounded lines. In practical terms, a little under half of the checkout value is used here; much of the balance remains for later cooking.</p>
          <p>Cooking oil, salt and pepper are assumed already owned and excluded from both figures. Temporary promotional reductions are not used.</p>
          <ProgrammaticDisclosureList items={COOKING_FOR_ONE_DISCLOSURES} className="mt-6" />
          <TableWrap>
            <table className="w-full min-w-[500px] border-collapse">
              <thead><tr><th className={thClass}>Published dish</th><th className={thClass}>Ingredient value</th><th className={thClass}>Per serving</th></tr></thead>
              <tbody>
                {COOKING_FOR_ONE_RECIPES.map(recipe => <tr key={recipe.name}><td className={tdClass}>{recipe.name}</td><td className={tdClass}>{recipe.ingredientValue}</td><td className={tdClass}>{recipe.perServing}</td></tr>)}
                <tr><td className={tdClass}>Total</td><td className={tdClass}>{COOKING_FOR_ONE_USED_VALUE}</td><td className={tdClass}>10 servings</td></tr>
              </tbody>
            </table>
          </TableWrap>
        </GuideSection>

        <GuideSection title="The full Aldi basket">
          <TableWrap>
            <table className="w-full min-w-[720px] border-collapse">
              <thead><tr><th className={thClass}>Product</th><th className={thClass}>Pack</th><th className={thClass}>Price</th><th className={thClass}>Used</th><th className={thClass}>Value used</th></tr></thead>
              <tbody>
                {COOKING_FOR_ONE_BASKET.map((item, index) => (
                  <tr key={`${item.product}-${index}`}><td className={tdClass}>{item.product}</td><td className={tdClass}>{item.pack}</td><td className={tdClass}>{item.price}</td><td className={tdClass}>{item.used}</td><td className={tdClass}>{item.valueUsed}</td></tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </GuideSection>

        <GuideSection title="Costing assumptions">
          <BulletList items={COOKING_FOR_ONE_ASSUMPTIONS} />
        </GuideSection>

        <GuideSection title="Fresh food left after the plan">
          <BulletList items={COOKING_FOR_ONE_LEFTOVERS} />
        </GuideSection>

        <GuideSection title="Food-safety note">
          <p>Cool cooked leftovers and put them in the fridge within two hours. Eat refrigerated leftovers within 48 hours or freeze them. Reheat only once and make sure food is steaming hot throughout. Once frozen food has defrosted in the fridge, use it within 24 hours.</p>
          <p><a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food" target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">Read the current Food Standards Agency guidance</a>.</p>
        </GuideSection>

        <GuideSection title="What DinnerByDesign did, and did not do">
          <p>DinnerByDesign selected and compared these published recipes. It did not develop or test them. Use each original publisher’s page for quantities, timings and method.</p>
          <p>DinnerByDesign’s contribution is the Aldi availability check, the coordinated basket, the comparison between complete-pack checkout cost and ingredient value used, the serving destinations, and the explicit costing and leftover assumptions.</p>
        </GuideSection>

        <GuideSection title="Frequently asked questions">
          {guide.faqs.map(faq => <section key={faq.question}><h3 className="font-bold text-dbd-ink">{faq.question}</h3><p className="mt-2">{faq.answer}</p></section>)}
        </GuideSection>

        <GuideSection title="Sources and further reading" className="border-t border-dbd-rule/50 pt-8">
          <p>Recipes, prices and guidance reviewed 28 July 2026. Aldi prices were checked 27 July 2026.</p>
          <ul className="space-y-3 text-sm leading-6">{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{source.label}</a></li>)}</ul>
        </GuideSection>

        <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
          <h2 className="text-xl font-bold">Related guidance</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3"><a href="/food-costs/ways-to-reduce-grocery-costs" className="font-semibold text-dbd-accent hover:underline">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">see how shared ingredients can become different dinners</a>, <a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">read the pricing methodology</a> or <a href="/food-safety" className="font-semibold text-dbd-accent hover:underline">review food-safety guidance</a>.</p>
        </section>
      </article>

      <ProgrammaticDisclosureFooter copy={COOKING_FOR_ONE_DISCLOSURE_FOOTER} className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make the plan fit your week</h2><p className="mt-2 text-sm leading-6 text-white/70">Use DinnerByDesign to adapt dinner ideas around your preferences, budget and ingredients.</p></div>
        <button type="button" onClick={onPlanDinners} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Plan dinners for one <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
