import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AppView } from '../../types';
import { INGREDIENT_PRICE_CATALOGUE_META } from '../../services/groceryService';

interface PricingMethodologyViewProps {
  setView: (view: AppView) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3 border-t border-gray-100 pt-6">
    <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
    <div className="space-y-3 text-[13.5px] leading-relaxed text-gray-600">{children}</div>
  </section>
);

export const PricingMethodologyView: React.FC<PricingMethodologyViewProps> = ({ setView }) => {
  const { user } = useAuth();
  const isGuest = !user || user.isAnonymous;
  const catalogueVersion = new Date(`${INGREDIENT_PRICE_CATALOGUE_META.version}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mx-auto max-w-3xl px-4 py-10 pb-20 select-text"
    >
      <button
        type="button"
        onClick={() => setView(isGuest ? 'landing' : 'shopping')}
        className="mb-6 rounded p-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent"
      >
        ← {isGuest ? 'Back to DinnerByDesign' : 'Back to Shopping'}
      </button>

      <header className="space-y-3">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Pricing transparency</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">How DinnerByDesign calculates ingredient prices</h1>
        <p className="text-[15px] leading-relaxed text-gray-600">
          DinnerByDesign provides cost estimates to help compare dinners, plan against a weekly budget and understand what a chosen week may cost at the supermarket. These figures are planning tools—not quotations, guarantees of availability or promises of the exact amount a retailer will charge.
        </p>
        <p className="text-[11.5px] text-gray-400">Reference catalogue version: {catalogueVersion}</p>
      </header>

      <div className="mt-8 space-y-6">
        <Section title="The two costs we show">
          <p><strong className="text-gray-900">Estimated ingredients</strong> is the proportional value of the quantities used in scheduled dinners. If 200g is used from a 500g reference pack costing £5.00, the estimated ingredient value is £2.00.</p>
          <p><strong className="text-gray-900">Expected checkout</strong> estimates the complete packs needed. In the same example, buying one 500g pack produces an expected checkout cost of £5.00. If 600g is required, the calculation rounds up to two packs and £10.00.</p>
          <p>Showing both figures distinguishes the value consumed by the dinners from the cash a household may need at the checkout.</p>
        </Section>

        <Section title="How ingredients are combined">
          <p>Matching ingredients are consolidated across all scheduled dinners before pack requirements are calculated. If three dinners require 200g, 250g and 150g of chicken, the shopping list prices a combined requirement of 600g rather than three unrelated purchases.</p>
          <p>This makes shared ingredients visible, reduces duplicate list entries and produces a more realistic full-pack estimate. Ingredients remain separate when combining them would be inappropriate.</p>
        </Section>

        <Section title="Reference catalogue and price coverage">
          <p>Recognised ingredients are matched to a maintained catalogue of typical UK supermarket reference prices. Catalogue records can hold the ingredient and its aliases, a representative product label, pack quantity, pack unit, standard price, retailer or reference-basket description, catalogue version, source and verification information.</p>
          <p>The current catalogue is a curated UK reference basket. It is not described as live retailer pricing. The Shopping view reports how many priced items matched the catalogue so users can judge how much of the total rests on direct reference matches.</p>
        </Section>

        <Section title="Category estimates and unmatched ingredients">
          <p>When an ingredient does not match a catalogue entry, DinnerByDesign uses a broader estimate based on its category, quantity and unit. Categories include meat and fish, dairy and eggs, vegetables and fruit, bakery, tins and jars, cupboard goods and other ingredients.</p>
          <p>Category estimates improve coverage but are less precise than catalogue matches. Their number is shown separately rather than being presented as verified product pricing.</p>
        </Section>

        <Section title="Quantities, units and portions">
          <p>Recipe descriptions are converted into standard quantities such as grams, kilograms, millilitres, litres or individual items. Common household measures—including teaspoons, tablespoons, cloves, handfuls, tins and packs—are converted using practical reference quantities.</p>
          <p>Where an individual item must be compared with a weight-based pack, a representative piece weight is used. Ingredient quantities are also scaled for the number of portions scheduled. These conversions are necessarily estimates because fresh produce and individual portions vary in size.</p>
        </Section>

        <Section title="Items already available at home">
          <p>Ingredients marked as already in stock are excluded from the active ingredient and checkout estimates. This lets users account for food already in the fridge, freezer or cupboards.</p>
          <p>The calculation relies on the user’s information and cannot determine whether the quantity remaining at home is sufficient.</p>
        </Section>

        <Section title="Cupboard-staple assumptions">
          <p>Very small quantities of common staples—such as salt, water, seasoning, oil, vinegar, flour or sugar—may be treated as already available and assigned no additional cost. This prevents a pinch of seasoning from being charged as a new full pack every time it appears.</p>
          <p>Households differ, so these assumptions may not reflect what every user already owns.</p>
        </Section>

        <Section title="Standard prices, promotions and retailers">
          <p>Unless explicitly stated, estimates should be understood as standard reference prices. They do not assume that a temporary promotion, loyalty-card price, multibuy discount, reduced item or personalised offer will be available.</p>
          <p>Products, pack sizes and prices vary between retailers and locations. A reference product is selected for budgeting; it does not imply that an equivalent branded, organic, premium or welfare-certified product will cost the same.</p>
        </Section>

        <Section title="Recipe estimates and shopping-list estimates">
          <p>A recipe result or newly built week may show an early estimated cost per portion. This helps compare dinners before they are scheduled. Once dinners are scheduled, the shopping list can consolidate quantities, recognise ingredient reuse, remove items already owned and calculate full-pack requirements.</p>
          <p>The later shopping-list calculation is therefore the more detailed planning estimate and may differ from the initial dinner estimate.</p>
        </Section>

        <Section title="Ready-made dinners">
          <p>Ready-made products are treated as complete packs. If a pack serves two and the dinner is scheduled for four people, the expected requirement is two packs. Optional sides and upgrades are costed separately when included in the shopping list.</p>
        </Section>

        <Section title="Why the checkout total may differ">
          <p>The final amount may be higher or lower because of price changes, different brands, alternative pack sizes, stock availability, substitutions, regional variation, promotions, ingredient interpretation, fresh-produce weights, optional ingredients or additional household purchases.</p>
          <p>Delivery charges, minimum-order charges, travel costs, carrier bags, membership fees, loyalty rewards and personalised pricing are not included unless specifically stated.</p>
        </Section>

        <Section title="Our transparency standard">
          <p>Where a cost is shown, DinnerByDesign aims to explain what it represents, whether it is proportional or based on complete packs, which catalogue version was used, how many ingredients were directly matched, how many used category estimates and which items were excluded as already owned.</p>
          <p>We use “estimated”, “expected” and “reference price” deliberately. We will not describe figures as exact or live supermarket prices unless the source, timing and coverage justify that claim.</p>
        </Section>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-6 text-[12.5px] leading-relaxed text-gray-500">
        Questions about the methodology can be sent to{' '}
        <a href="mailto:chef@dinnerbydesign.app" className="font-semibold text-dbd-accent hover:underline">chef@dinnerbydesign.app</a>.
      </div>
    </motion.main>
  );
};
