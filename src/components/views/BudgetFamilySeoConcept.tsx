import React, { useState } from 'react';
import { Wordmark } from '../Wordmark';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Info,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  UsersRound,
} from 'lucide-react';

interface BudgetFamilySeoConceptProps {
  onBack: () => void;
  onUsePlan: () => void;
}

const BASE_SERVINGS = 4;

const dinners = [
  {
    day: 'Monday',
    title: 'Smoky lentil bolognese',
    detail: '30 min · Vegetarian',
    baseCost: 4.6,
    reuse: 'Carrots and onions are used again on Wednesday.',
  },
  {
    day: 'Tuesday',
    title: 'Paprika chicken traybake',
    detail: '40 min · One tray',
    baseCost: 6.8,
    reuse: 'Save two chicken thighs for Thursday.',
  },
  {
    day: 'Wednesday',
    title: 'Tomato chickpea curry',
    detail: '25 min · Vegetarian',
    baseCost: 4.9,
    reuse: 'Uses the remaining carrots and opened yoghurt.',
  },
  {
    day: 'Thursday',
    title: 'Chicken and vegetable fried rice',
    detail: '20 min · Uses leftovers',
    baseCost: 4.2,
    reuse: 'Uses Tuesday’s chicken and Wednesday’s rice.',
  },
  {
    day: 'Friday',
    title: 'Loaded bean and potato wedges',
    detail: '35 min · Vegetarian',
    baseCost: 5.3,
    reuse: 'Finishes the potatoes, yoghurt and cheese.',
  },
];

const money = (value: number) => `£${value.toFixed(2)}`;

export const BudgetFamilySeoConcept: React.FC<BudgetFamilySeoConceptProps> = ({ onBack, onUsePlan }) => {
  const [servings, setServings] = useState(BASE_SERVINGS);
  const [showMethod, setShowMethod] = useState(false);
  const scale = servings / BASE_SERVINGS;
  const basketCost = 28.4 * scale;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 text-dbd-ink">
      <header className="border-b border-dbd-rule/50 bg-dbd-surface">
        <div className="mx-auto flex min-h-[82px] max-w-6xl items-center justify-between px-3 sm:min-h-[100px] lg:px-6">
          <button onClick={onBack} aria-label="Back to DinnerByDesign" className="text-left">
            <Wordmark className="text-[34.2px] sm:text-[41.4px]" />
            <span className="ml-[42px] mt-1 hidden text-[9px] font-medium tracking-[0.05em] text-dbd-ink-3 sm:block sm:ml-[52px]">
              Less searching. More relevant dinners.
            </span>
          </button>
          <button className="text-xs font-bold text-dbd-accent">Sign in</button>
        </div>

        <div className="mx-auto flex max-w-6xl items-center px-3 lg:px-6">
          <div className="flex min-h-[46px] flex-1 flex-col items-center justify-center border-b-2 border-dbd-ink py-2 text-dbd-ink">
            <Search className="mb-1 h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Search</span>
          </div>
          <div className="flex min-h-[46px] flex-1 flex-col items-center justify-center border-b-2 border-transparent py-2 text-dbd-ink-3">
            <Calendar className="mb-1 h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Save &amp; Schedule</span>
          </div>
          <div className="flex min-h-[46px] flex-1 flex-col items-center justify-center border-b-2 border-transparent py-2 text-dbd-ink-3">
            <ShoppingCart className="mb-1 h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Shopping</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:py-8 lg:px-4">
        <button
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-dbd-ink-3 hover:text-dbd-ink"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dbd-ink-3">Budget dinner plan</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Five family dinners for about £30</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dbd-ink-3">
            A simple Monday-to-Friday plan that reuses ingredients and reduces waste.
          </p>
        </div>

        <section className="mb-4 rounded-lg border border-dbd-rule/60 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-dbd-ink-3">Estimated basket</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{money(basketCost)}</span>
                <span className="text-xs text-dbd-ink-3">for five dinners</span>
              </div>
              <p className="mt-1 text-xs text-dbd-ink-3">About {money(basketCost / (servings * 5))} per portion</p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-dbd-rule/40 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <UsersRound size={17} /> People
              </span>
              <div className="flex items-center rounded-md border border-dbd-rule/70 bg-dbd-surface">
                <button
                  aria-label="Reduce household size"
                  onClick={() => setServings((value) => Math.max(2, value - 1))}
                  className="p-2.5 hover:bg-dbd-surface-2"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-9 text-center text-sm font-bold">{servings}</span>
                <button
                  aria-label="Increase household size"
                  onClick={() => setServings((value) => Math.min(8, value + 1))}
                  className="p-2.5 hover:bg-dbd-surface-2"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-dbd-rule/60 bg-white shadow-sm">
          <div className="border-b border-dbd-rule/50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold">Your five dinners</h2>
          </div>

          <div className="divide-y divide-dbd-rule/40">
            {dinners.map((dinner) => (
              <article key={dinner.day} className="px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-dbd-ink-3">{dinner.day}</p>
                    <h3 className="mt-1 text-sm font-semibold sm:text-base">{dinner.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-dbd-ink-3">
                      <Clock3 size={13} /> {dinner.detail}
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#596b51]">
                      <Check className="mt-0.5 shrink-0" size={13} /> {dinner.reuse}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold">{money(dinner.baseCost * scale)}</p>
                    <p className="mt-0.5 text-[10px] text-dbd-ink-3">{money(dinner.baseCost / BASE_SERVINGS)} each</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-dbd-rule/60 bg-white shadow-sm">
          <button
            onClick={() => setShowMethod((value) => !value)}
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Info size={16} /> How costs are estimated
            </span>
            {showMethod ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showMethod && (
            <div className="border-t border-dbd-rule/40 px-4 py-4 text-xs leading-5 text-dbd-ink-3 sm:px-5">
              Indicative UK supermarket prices checked July 2026. Full packs required for the five dinners are included. Oil, salt and pepper are treated as cupboard ingredients; promotions are excluded.
            </div>
          )}
        </section>

        <div className="mt-5 rounded-lg border border-dbd-rule/60 bg-dbd-surface p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
          <div>
            <h2 className="text-sm font-bold">Make this plan work for your family</h2>
            <p className="mt-1 text-xs leading-5 text-dbd-ink-3">Apply your dietary preferences, replace dinners and create one shopping list.</p>
          </div>
          <button onClick={onUsePlan} className="mt-4 min-h-11 w-full rounded-md bg-dbd-ink px-5 text-sm font-bold text-white sm:mt-0 sm:w-auto">
            Personalise this plan
          </button>
        </div>
      </main>
    </div>
  );
};
