import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER,
  GROCERY_COST_PREDICTION_DISCLOSURES,
} from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const GROCERY_COST_PREDICTION_GUIDE_PATH = '/food-costs/why-grocery-costs-are-hard-to-predict';

export const GROCERY_COST_PREDICTION_GUIDE = {
  title: 'Why is it so difficult to budget accurately for food?',
  seoTitle: 'Why grocery costs are so difficult to predict accurately | DinnerByDesign',
  description: 'Why an exact grocery total is so hard to predict, and how transparent estimates and better planning can still give you more control.',
  publishedAt: '2026-07-21',
  reviewedAt: '2026-07-21',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Understand why grocery costs are difficult to predict and how practical budgeting can still provide greater control',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-21',
  editorialNotes: 'Transparency guide about household budgeting uncertainty. Keep the distinction between ingredient value, complete-pack cost and additional shopping cost aligned with the pricing methodology.',
  internalLinks: [
    '/pricing-methodology',
    '/food-costs/ways-to-reduce-grocery-costs',
    '/food-costs/uk-food-costs-2026',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/fresh-or-frozen',
    '/dinner-plans/5-dinners-for-2-under-40',
    '/guides',
  ],
  disclosures: ['price_comparison', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: How to chill, freeze and defrost food safely',
      url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely',
    },
  ],
  faqs: [
    { question: 'Why is my supermarket total higher than the combined recipe costs?', answer: 'Usually because you are paying for complete packs, not just the quantities each recipe uses, and because prices, promotions or availability may have shifted since the estimate was made.' },
    { question: 'Can I predict my grocery spending exactly?', answer: 'Not reliably. Too many details — stock, pack sizes, promotions and substitutions — are unknown when you plan. You can get a realistic estimate, not a guaranteed figure.' },
    { question: 'What is the difference between ingredient value and complete-pack cost?', answer: 'Ingredient value is what the quantity used in a dinner is roughly worth. Complete-pack cost is what you actually pay for the pack it came from, which is often more.' },
    { question: 'Should cupboard ingredients be treated as free?', answer: 'Not quite. They do not add to this week’s shop, but they will need replacing eventually, so they still carry a longer-term cost.' },
    { question: 'Why do supermarket substitutions affect a weekly budget?', answer: 'A substitution — a different brand, a larger pack, fresh instead of frozen — can change both what you pay now and what is left over for later in the week.' },
    { question: 'How much flexibility should I leave in a food budget?', answer: 'Enough to absorb an ordinary change of plan — a postponed dinner, an extra guest or a rushed evening — without the whole week’s budget falling apart.' },
    { question: 'Are grocery cost estimates still useful?', answer: 'Yes. They help you compare dinners, spot expensive ingredients and coordinate a week, even though they cannot guarantee the final total.' },
    { question: 'How does DinnerByDesign help households manage spending?', answer: 'By showing ingredient value and complete-pack cost separately, accounting for servings and shared ingredients, and being clear that every figure is an estimate rather than a guarantee.' },
  ],
};

export const GROCERY_COST_PREDICTION_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Accurately budgeting for groceries is difficult because the final amount depends on prices, promotions, product availability, pack sizes, substitutions and what the household already has. Many of these details aren't known when the week is planned. An estimate can't guarantee the checkout total, but it can still help you set a realistic target, compare options and make better use of what you buy.</em></p></section>`;

export const GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML = `<section><h2>You have to budget before you know the final cost</h2><p>Setting a food budget means deciding what to spend before you actually know several important things: which products will be in stock, which pack sizes will be on the shelf, whether an advertised offer will still be running, whether a loyalty price applies to you, whether your usual product will need substituting, whether prices have moved since your last shop, or whether the week's plans will even go as expected.</p><p>If you've prepared a careful list and still ended up with a surprising total at the till, that's not a sign you did anything wrong. It's a fairly ordinary result of budgeting for something with this many moving parts. Our <a href="/dinner-plans/5-dinners-for-2-under-40">5 affordable dinners for two under £40</a> guide shows how a coordinated target can work while remaining an estimate.</p></section>
<section><h2>A recipe's cost isn't necessarily what you pay at the checkout</h2><p>It helps to separate three different figures. The ingredient value used is what the quantities in the dinner are roughly worth. The complete-pack cost is what you actually pay for the packs those quantities came from. The additional shopping cost is what you need to spend once you've accounted for anything already in the cupboard or fridge.</p><p>A simple example: a dinner might call for two chicken breasts, but the pack in front of you contains four. You pay for the whole pack, even though the recipe only uses half of it. The remaining two breasts only deliver value to the household if they are stored safely and used later. The dinner's ingredient value can therefore be considerably lower than the amount paid at the checkout.</p></section>
<section><h2>Pack sizes make this particularly difficult</h2><p>Recipes describe quantities; supermarkets sell products. A recipe might need 150g from a 500g pack, one tablespoon from a full bottle, a small spoonful from a whole jar of spice, half a bag of vegetables, or two items from a multipack of six. Adding up the value used across a week's recipes was never going to match the total you pay at the till, because you're not buying by the gram — you're buying by the pack.</p><p><strong>Illustrative examples:</strong> <em>The pack-size examples above are illustrative only and aren't tied to specific retailer products or prices.</em></p></section>
<section><h2>Prices aren't fixed</h2><p>On top of all this, prices themselves move: ordinary price changes, temporary promotions, loyalty-card pricing, differences between stores or regions, online versus in-store pricing, and simple changes in what's available that week. An estimate can accurately reflect the products and prices checked on a particular date, yet still differ from what you find a few days later — that's not a fault in the estimate, just a reflection of the fact that prices continue to change.</p><p>Our guide to <a href="/food-costs/uk-food-costs-2026">why UK food costs are rising in 2026</a> provides the wider context.</p></section>
<section><h2>Substitutions change the budget</h2><p>Plenty of ordinary moments can quietly shift what you spend: your usual own-brand product is out of stock, only a larger pack is left, you decide to buy a preferred brand instead, a fresh ingredient gets swapped for frozen (or the other way round), a dietary requirement narrows your options, or an online order arrives with a retailer's substitution. Any one of these can be small on its own, but it can affect both today's shop and what's left over for later in the week.</p></section>
<section><h2>Similar-looking products don't always offer the same value</h2><p>Own-brand versus branded, fresh versus frozen, loose versus packaged, prepared versus unprepared, different cuts of the same meat, products that include bone, skin or liquid, different pack sizes — all of these can look like a straightforward like-for-like choice and not be one. The lowest price on the shelf isn't automatically the best value; that also depends on how much of it you'll actually use, whether it suits your household, how well it stores, and whether the rest of the pack gets eaten. Our <a href="/food-costs/fresh-or-frozen">fresh or frozen guide</a> explores one of these choices in more detail.</p></section>
<section><h2>What's already in your cupboard complicates things further</h2><p>A recipe might call for flour, oil, herbs, spices or stock that you already have at home. That raises two different questions: what's the value of everything the dinner actually uses, and what do you need to buy for this particular shop? Treating every ingredient as a fresh purchase overstates what you need to spend this week; treating cupboard staples as free understates their real cost, since they'll eventually need replacing too.</p></section>
<section><h2>Plans change during the week</h2><p>An evening out, an extra person at the table, a postponed dinner, an ingredient that suddenly needs using sooner than planned, a rushed evening that calls for something different, or leftover portions eaten instead of the next scheduled dinner — all of these are completely ordinary, and all of them can shift a budget that looked solid on paper. A useful budget leaves room for this rather than assuming the week will go exactly to plan.</p></section>
<section><h2>An apparently cheap dinner can still make for a costly shop</h2><p>Low ingredient value doesn't automatically mean low cost to the household. A dinner can look inexpensive on paper and still push up the shop if it needs several new jars or bottles, a large pack with no obvious second use, something highly perishable, a product you're unlikely to buy again soon, or a quantity that doesn't suit your household size. None of this means every unused ingredient is thrown away straight away — but it's part of why a low-cost recipe doesn't always translate into a low-cost trip to the shop.</p></section>
<section><h2>Why more price information doesn't solve everything</h2><p>Even with recent, accurate prices, someone still has to decide which supermarket product actually represents a given recipe ingredient, which brand or quality level is a fair assumption, which pack size a household would realistically buy, whether a promotional price is generally available or only to some shoppers, how to treat a product that's out of stock, and at what point a price is too old to be useful. Gathering more data narrows these judgement calls; it doesn't remove them.</p></section>
<section><h2>What you can control</h2><p>You can't control supermarket prices, but there's a fair amount you can control:</p><ul><li>Plan several dinners together, rather than one at a time</li><li>Set a target with some flexibility built in, rather than an exact figure</li><li>Choose dinners that share ingredients</li><li>Check what's already available before you shop</li><li>Plan a use for the remainder of any complete pack</li><li>Choose realistic household servings — our <a href="/food-costs/portion-planning-and-food-waste">portion-planning guide</a> can help</li><li>Keep a few flexible fallback dinners in reserve</li><li>Use <a href="/food-costs/batch-cooking-on-a-budget">batch cooking</a> purposefully where it suits the week</li><li>Compare fresh and frozen where it makes sense to</li><li>Freeze suitable surplus ingredients or portions safely</li><li>Check the likely complete-pack cost before you shop, not just the recipe cost</li></ul><p>For further practical ideas, see <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce and manage your grocery costs</a>.</p></section>`;

export const GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML = `<section><h2>Why estimates are still worth having</h2><p>An estimate doesn't need to predict every penny to be useful. A transparent one can help you compare broadly similar dinners, spot the more expensive ingredients before you shop, understand how many people you're actually feeding, see where a complete pack changes the real cost, coordinate ingredients across the week, stay near your target, anticipate where the real shop might come in higher, and make more informed substitutions when something isn't available. A good estimate narrows the uncertainty. It doesn't remove it.</p></section>
<section><h2>How DinnerByDesign approaches this</h2><p>Costs in DinnerByDesign are presented as estimates, with the assumptions behind them kept visible rather than hidden. Ingredient value is shown separately from complete-pack cost, and household servings are taken into account. Ingredients can be shared across the dinners you schedule, and shopping-list estimates can account for what you've already got. Price information carries a review date, and pack sizes or product availability can still change the final total — the app doesn't promise an exact checkout figure, for the same reasons set out above. Our <a href="/pricing-methodology">pricing methodology</a> explains the underlying approach in more detail.</p></section>
<section><h2>Verdict</h2><p><em>Households can't know every final product, price, pack size or substitution when they set a food budget. That makes predicting the checkout total exactly very difficult, even after a carefully planned week. The answer isn't to abandon budgeting — it's to use transparent estimates, plan several dinners together, account for complete packs, and leave room for ordinary changes. Better information can't remove every uncertainty, but it can give you considerably more control.</em></p></section>`;

export const GROCERY_COST_PREDICTION_GUIDE_SECTIONS: PublicGuideSection[] = [
  { rawHtml: GROCERY_COST_PREDICTION_OPENING_HTML, disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES.slice(0, 1) },
  { rawHtml: GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML, disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES.slice(1) },
  { rawHtml: GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML },
];

export const GROCERY_COST_PREDICTION_GUIDE_RECORD: PublicGuideRecord = {
  id: 'why-grocery-costs-are-hard-to-predict',
  slug: 'why-grocery-costs-are-hard-to-predict',
  path: GROCERY_COST_PREDICTION_GUIDE_PATH,
  canonicalPath: GROCERY_COST_PREDICTION_GUIDE_PATH,
  status: 'published',
  category: 'food-costs',
  reviewSensitivity: 'price-sensitive',
  ...GROCERY_COST_PREDICTION_GUIDE,
  nextReviewAt: '2027-07-21',
  metaDescription: GROCERY_COST_PREDICTION_GUIDE.description,
  label: 'Food cost guide',
  disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES,
  disclosureFooter: GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER,
  sections: GROCERY_COST_PREDICTION_GUIDE_SECTIONS,
  cta: {
    title: 'Plan with greater visibility',
    copy: 'Build a week around your household, budget and available time, then see how complete packs, shared ingredients and scheduled dinners affect your shopping list.',
    label: 'Plan my week',
    href: '/signin',
  },
};

export function getGroceryCostPredictionGuideJsonLd() {
  return getPublicGuideJsonLd(GROCERY_COST_PREDICTION_GUIDE_RECORD);
}

export function renderGroceryCostPredictionGuideInitialHtml() {
  return renderPublicGuideInitialHtml(GROCERY_COST_PREDICTION_GUIDE_RECORD);
}
