export interface SeoMealPlanDinner {
  day: string;
  title: string;
  description: string;
  totalTimeMinutes: number;
  estimatedCost: number;
  sharedIngredientNote: string;
}

export interface SeoMealPlan {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  householdSize: number;
  dinnerCount: number;
  budgetTarget: number;
  estimatedIngredientCost: number;
  expectedCheckoutCost: number;
  priceBasisDate: string;
  publishedAt: string;
  reviewedAt: string;
  editorialOwner: string;
  status: 'published' | 'draft' | 'retired';
  introduction: string[];
  dinners: SeoMealPlanDinner[];
  sharedIngredients: Array<{ ingredient: string; uses: string }>;
  substitutions: Array<{ swap: string; effect: string }>;
  shoppingStrategy: string[];
  budgetPrinciples: Array<{ title: string; explanation: string }>;
  flexibleScenarios: Array<{ question: string; answer: string }>;
}

export const FIVE_DINNERS_FOR_TWO_UNDER_40: SeoMealPlan = {
  slug: '5-dinners-for-2-under-40',
  title: '5 affordable dinners for two under £40',
  shortTitle: 'Five dinners for two under £40',
  description: 'A five-night UK dinner plan for two, designed around a £40 target with shared ingredients, practical substitutions and transparent reference-price estimates.',
  householdSize: 2,
  dinnerCount: 5,
  budgetTarget: 40,
  estimatedIngredientCost: 25.35,
  expectedCheckoutCost: 37.9,
  priceBasisDate: '2026-07-18',
  publishedAt: '2026-07-18',
  reviewedAt: '2026-07-18',
  editorialOwner: 'DinnerByDesign editorial team',
  status: 'published',
  introduction: [
    'Planning five different dinners can easily create five disconnected shopping lists. This week is designed differently: useful ingredients are deliberately carried from one dinner into another, while chicken, pulses and eggs provide variety without requiring five separate main-protein purchases.',
    'The £40 target refers to the expected checkout cost of representative complete packs for two people. The lower ingredient figure shows the estimated value actually used across the ten portions. Keeping both figures visible makes it easier to distinguish the food consumed from the cash likely to be needed at the supermarket.',
    'This is a practical starting point rather than a fixed prescription. Brands, pack sizes, retailer, location and ingredients already at home will change the total. The substitutions below show how to adapt the week without losing its underlying cost-control structure.',
  ],
  dinners: [
    { day: 'Monday', title: 'Paprika chicken and pepper traybake', description: 'Chicken, peppers, onions and potatoes roasted together with paprika.', totalTimeMinutes: 40, estimatedCost: 6.4, sharedIngredientNote: 'Keep half the chicken, one pepper and some cooked potatoes for later dinners.' },
    { day: 'Tuesday', title: 'Tomato and lentil pasta', description: 'A simple red-lentil tomato sauce with pasta and a little cheddar.', totalTimeMinutes: 30, estimatedCost: 3.75, sharedIngredientNote: 'Uses the same onions, garlic, tomatoes and cheddar needed later in the week.' },
    { day: 'Wednesday', title: 'Chicken and vegetable fried rice', description: 'Monday’s reserved chicken with rice, pepper, carrot and egg.', totalTimeMinutes: 20, estimatedCost: 4.8, sharedIngredientNote: 'Turns reserved chicken and vegetables into a quick midweek dinner.' },
    { day: 'Thursday', title: 'Loaded bean and potato bowls', description: 'Crisp potatoes topped with tomato beans, cheddar and yoghurt.', totalTimeMinutes: 35, estimatedCost: 4.2, sharedIngredientNote: 'Finishes the potatoes, tomatoes and cheddar without requiring another main protein.' },
    { day: 'Friday', title: 'Carrot, chickpea and spinach curry', description: 'A tomato-based chickpea curry served with the remaining rice and yoghurt.', totalTimeMinutes: 30, estimatedCost: 6.2, sharedIngredientNote: 'Uses the remaining carrots, spinach, tomatoes, rice and yoghurt.' },
  ],
  sharedIngredients: [
    { ingredient: 'Onions and garlic', uses: 'The traybake, pasta sauce and curry.' },
    { ingredient: 'Peppers and carrots', uses: 'The traybake, fried rice and curry.' },
    { ingredient: 'Potatoes', uses: 'Monday’s traybake and Thursday’s loaded bowls.' },
    { ingredient: 'Rice', uses: 'Wednesday’s fried rice and Friday’s curry.' },
    { ingredient: 'Tomatoes', uses: 'The pasta sauce, loaded beans and curry.' },
    { ingredient: 'Cheddar and yoghurt', uses: 'Small amounts across Tuesday, Thursday and Friday.' },
  ],
  substitutions: [
    { swap: 'Replace chicken with an extra tin of chickpeas and 250g mushrooms.', effect: 'Creates a vegetarian week and should reduce the reference estimate.' },
    { swap: 'Use frozen spinach and mixed peppers.', effect: 'Can reduce waste and may cost less than buying several fresh packs.' },
    { swap: 'Use brown rice or wholewheat pasta already at home.', effect: 'Keeps the plan structure while avoiding an unnecessary new pack.' },
  ],
  shoppingStrategy: [
    'Buy one main chicken pack and divide it between Monday’s traybake and Wednesday’s fried rice. Cook and reserve Wednesday’s portion promptly rather than treating it as an accidental leftover.',
    'Use one bag each of potatoes, onions and carrots across several dinners. These ingredients are inexpensive, flexible and less likely to leave an unusable remainder than several specialist side dishes.',
    'Open tins and longer-life packs later in the week. Lentils, beans, chickpeas, pasta and rice provide budget resilience if a fresh ingredient becomes unavailable or needs replacing.',
    'Cheddar and yoghurt are supporting ingredients rather than the centre of a dinner. Small quantities add flavour across several nights without requiring a separate topping or sauce for each dish.',
  ],
  budgetPrinciples: [
    { title: 'One chicken purchase, two dinners', explanation: 'Chicken is used twice, reducing the need to buy another higher-cost main protein for Wednesday.' },
    { title: 'Three pulse-led dinners', explanation: 'Lentils, beans and chickpeas keep the week varied while protecting the overall target.' },
    { title: 'Repeated vegetables with different roles', explanation: 'Peppers, carrots, onions, potatoes and tomatoes appear in different combinations rather than as identical leftovers.' },
    { title: 'No promotional price dependency', explanation: 'The plan does not require a loyalty-card offer, multibuy or temporary reduction to remain below its stated reference target.' },
  ],
  flexibleScenarios: [
    { question: 'If you already have rice, pasta or spices', answer: 'Mark those items as already in stock when personalising the plan. The expected checkout estimate should fall because no new pack is required.' },
    { question: 'If you are cooking for three or four', answer: 'Increase the household size in Plan My Week. Quantities will scale, but complete-pack rounding means the total will not always rise in a perfectly straight line.' },
    { question: 'If you shop at a different supermarket', answer: 'Keep the dinner structure and compare equivalent standard packs. Treat £37.90 as the reference-basket estimate rather than a promise from a particular retailer.' },
    { question: 'If you want a vegetarian week', answer: 'Replace the chicken with chickpeas and mushrooms and apply the vegetarian rule before generating alternatives.' },
  ],
};

export const FIVE_DINNERS_FOR_TWO_UNDER_40_PATH = '/dinner-plans/5-dinners-for-2-under-40';

export function getFiveDinnersForTwoJsonLd() {
  const url = `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: FIVE_DINNERS_FOR_TWO_UNDER_40.title, description: FIVE_DINNERS_FOR_TWO_UNDER_40.description, datePublished: FIVE_DINNERS_FOR_TWO_UNDER_40.publishedAt, dateModified: FIVE_DINNERS_FOR_TWO_UNDER_40.reviewedAt, isPartOf: { '@type': 'WebSite', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntity: { '@id': `${url}#plan` } },
      { '@type': 'ItemList', '@id': `${url}#plan`, name: FIVE_DINNERS_FOR_TWO_UNDER_40.shortTitle, numberOfItems: FIVE_DINNERS_FOR_TWO_UNDER_40.dinners.length, itemListElement: FIVE_DINNERS_FOR_TWO_UNDER_40.dinners.map((dinner, index) => ({ '@type': 'ListItem', position: index + 1, name: dinner.title })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Affordable dinner plans', item: url }] },
      { '@type': 'FAQPage', mainEntity: [
        { '@type': 'Question', name: 'Does the £40 target include full supermarket packs?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The expected checkout figure uses representative complete packs; the lower ingredient figure shows only the value used by these dinners.' } },
        { '@type': 'Question', name: 'Can I make the plan vegetarian?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Replace the chicken with chickpeas and mushrooms, then apply vegetarian preferences when personalising the plan.' } },
        { '@type': 'Question', name: 'Will my actual checkout be exactly £37.90?', acceptedAnswer: { '@type': 'Answer', text: 'No. Retailer, location, availability, substitutions, promotions and ingredients already at home will change it.' } },
      ] },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));
const formatMoney = (value: number) => `£${value.toFixed(2)}`;

export function renderFiveDinnersForTwoInitialHtml() {
  const plan = FIVE_DINNERS_FOR_TWO_UNDER_40;
  const dinners = plan.dinners.map(dinner => `<article><p>${escapeHtml(dinner.day)}</p><h3>${escapeHtml(dinner.title)}</h3><p>${escapeHtml(dinner.description)}</p><p>About ${dinner.totalTimeMinutes} minutes · ${formatMoney(dinner.estimatedCost)}</p><p>${escapeHtml(dinner.sharedIngredientNote)}</p></article>`).join('');
  const shared = plan.sharedIngredients.map(item => `<li><strong>${escapeHtml(item.ingredient)}:</strong> ${escapeHtml(item.uses)}</li>`).join('');
  const substitutions = plan.substitutions.map(item => `<li><strong>${escapeHtml(item.swap)}</strong> ${escapeHtml(item.effect)}</li>`).join('');
  const introduction = plan.introduction.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const strategy = plan.shoppingStrategy.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const principles = plan.budgetPrinciples.map(item => `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.explanation)}</li>`).join('');
  const scenarios = plan.flexibleScenarios.map(item => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Affordable dinner plans</nav><p>Affordable weekly dinner plan</p><h1>${escapeHtml(plan.title)}</h1><p>${escapeHtml(plan.description)}</p><p>By ${escapeHtml(plan.editorialOwner)} · Reviewed 18 July 2026</p><section><h2>A practical £40 week, not five separate shopping lists</h2>${introduction}</section><section aria-label="Plan summary"><h2>Plan summary</h2><p>Dinner target: ${formatMoney(plan.budgetTarget)} for five dinners for two.</p><p>Estimated ingredients: ${formatMoney(plan.estimatedIngredientCost)}.</p><p>Expected checkout: ${formatMoney(plan.expectedCheckoutCost)} using full reference packs.</p><p>These are planning estimates based on the DinnerByDesign UK reference-price catalogue, not a retailer quotation.</p></section><section><h2>The five-night dinner plan</h2>${dinners}</section><section><h2>The shopping strategy behind the week</h2>${strategy}</section><section><h2>How we kept the plan under £40</h2><ul>${principles}</ul></section><section><h2>How ingredients are reused</h2><ul>${shared}</ul></section><section><h2>Practical substitutions</h2><ul>${substitutions}</ul></section><section><h2>Make the plan work in different circumstances</h2>${scenarios}</section><section><h2>How this plan was selected</h2><p>The plan repeats useful ingredients across five different dinners to reduce disconnected purchases and food waste. It is not guaranteed to be the mathematically cheapest possible basket.</p><p><a href="/pricing-methodology">Read the ingredient-pricing methodology</a> or <a href="/recipe-methodology">see how dinners are selected</a>.</p></section><section><h2>Questions about this £40 plan</h2><h3>Does the £40 target include full supermarket packs?</h3><p>Yes. The expected checkout figure uses representative complete packs.</p><h3>Will my actual checkout be exactly £37.90?</h3><p>No. Retailer, availability, substitutions, promotions and ingredients already at home will change it.</p></section><p><a href="/signin">Personalise this dinner plan</a></p></main></div>`;
}
