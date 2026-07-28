export interface CookingForOneRecipe {
  name: string;
  publisher: string;
  url: string;
  servings: number;
  ingredientValue: string;
  perServing: string;
  summary: string;
  servingPlan: string;
  basketFit: string;
}

export interface CookingForOneBasketLine {
  product: string;
  pack: string;
  price: string;
  used: string;
  valueUsed: string;
}

export const COOKING_FOR_ONE_PRICE_CHECK_DATE = '27 July 2026';
export const COOKING_FOR_ONE_CHECKOUT_TOTAL = '£30.36';
export const COOKING_FOR_ONE_USED_VALUE = '£14.49';

export const COOKING_FOR_ONE_SCHEDULE = [
  { when: 'Dinner 1', dinner: 'Chickpea saag', destination: 'Second serving becomes lunch the next day.' },
  { when: 'Dinner 2', dinner: 'One-pot tomato pasta', destination: 'Second serving becomes lunch the next day.' },
  { when: 'Dinner 3', dinner: 'One-pot balsamic chicken', destination: 'Eat one serving and freeze the other three once cool.' },
  { when: 'Dinner 4', dinner: 'Chicken noodle soup', destination: 'Second serving becomes lunch the next day.' },
  { when: 'Dinner 5', dinner: 'Defrosted balsamic chicken', destination: 'Two dated portions remain for later.' },
];

export const COOKING_FOR_ONE_RECIPES: CookingForOneRecipe[] = [
  {
    name: 'Chickpea saag',
    publisher: 'Tesco Real Food',
    url: 'https://realfood.tesco.com/recipes/chickpea-saag.html',
    servings: 2,
    ingredientValue: '£3.77',
    perServing: '£1.89',
    summary: 'This combines chickpeas, spinach, Tenderstem broccoli, onion, garlic, lemon, coriander, garam masala and a little Greek-style yogurt. It is the most vegetable-heavy dinner in the plan and uses a substantial part of the spinach pack at once.',
    servingPlan: 'Eat one serving for dinner and cool the second promptly for lunch the next day. The publisher lists naan or flatbread as optional, so neither is included in the basket or cost. A blender is needed for the spinach mixture.',
    basketFit: 'Spinach and garlic return later in the week, while the remaining yogurt and lemon have ordinary breakfast, lunch and dressing uses.',
  },
  {
    name: 'One-pot tomato pasta',
    publisher: 'Tesco Real Food',
    url: 'https://realfood.tesco.com/recipes/one-pot-tomato-pasta.html',
    servings: 2,
    ingredientValue: '£1.30',
    perServing: '£0.65',
    summary: 'This pasta uses spaghetti, chopped tomatoes, onion, garlic, dried thyme, red wine vinegar and breadcrumbs. It is a useful contrast to the chicken dishes and avoids a specialist chilled ingredient bought for one spoonful.',
    servingPlan: 'Have one serving for dinner and refrigerate the other for lunch the next day. The recipe’s cooking oil is treated as already owned, alongside salt and pepper. Everything else is included in the basket.',
    basketFit: 'Onion and garlic are already open, and the remaining spaghetti, breadcrumbs, thyme and vinegar all keep well for later cooking.',
  },
  {
    name: 'One-pot balsamic chicken',
    publisher: 'Aldi',
    url: 'https://www.aldi.co.uk/recipes/collections/family-meals/one-pot-balsamic-chicken',
    servings: 4,
    ingredientValue: '£7.17',
    perServing: '£1.79',
    summary: 'This is the batch anchor. Aldi’s recipe uses a pack of chicken breasts with red onion, red and yellow pepper, salad tomatoes, balsamic vinegar and spinach. For costing, “one pack” is treated as Aldi’s 650g Ashfields chicken breast pack because the recipe page does not state a weight.',
    servingPlan: 'Eat one serving on dinner three. Once the remaining food has cooled, divide it into three labelled containers and freeze promptly. Defrost one in the fridge for dinner five. The other two remain as dated future dinners.',
    basketFit: 'The spinach is shared with the saag. The remaining pepper and tomatoes have straightforward uses beyond this plan, while balsamic vinegar keeps for later cooking.',
  },
  {
    name: 'Chicken noodle soup',
    publisher: 'Good Food',
    url: 'https://www.bbcgoodfood.com/recipes/chicken-noodle-soup',
    servings: 2,
    ingredientValue: '£2.25',
    perServing: '£1.12',
    summary: 'This soup uses chicken breast, stock, ginger, garlic, noodles, sweetcorn, mushrooms, spring onions and soy sauce. Aldi’s egg noodles are used because the publisher explicitly permits rice or wheat noodles.',
    servingPlan: 'Eat one serving for dinner and refrigerate the other for lunch the next day. Optional mint, basil and chilli are not included. The 300g chicken pack leaves about 125g raw; freeze it before the printed use-by date for another dish.',
    basketFit: 'It reuses garlic and gives the remaining ginger, spring onions, mushrooms and soy sauce straightforward future uses.',
  },
];

export const COOKING_FOR_ONE_BASKET: CookingForOneBasketLine[] = [
  { product: 'Brown onions', pack: '1kg', price: '£0.99', used: '250g', valueUsed: '£0.25' },
  { product: 'British baby spinach', pack: '450g', price: '£1.59', used: '300g', valueUsed: '£1.06' },
  { product: 'Loose garlic', pack: '1 bulb', price: '£0.45', used: '5 cloves', valueUsed: '£0.28' },
  { product: 'Wonky lemons', pack: '4', price: '£0.89', used: '1', valueUsed: '£0.22' },
  { product: 'Cut coriander', pack: '30g', price: '£0.50', used: '30g', valueUsed: '£0.50' },
  { product: 'Garam masala', pack: '90g', price: '£0.89', used: 'about 4g', valueUsed: '£0.04' },
  { product: 'Chickpeas', pack: '400g can', price: '£0.41', used: '1 can', valueUsed: '£0.41' },
  { product: 'Tenderstem broccoli', pack: '200g', price: '£1.45', used: '200g', valueUsed: '£1.45' },
  { product: 'Fat-free Greek-style yogurt', pack: '500g', price: '£0.95', used: '30g', valueUsed: '£0.06' },
  { product: 'Natural breadcrumbs', pack: '175g', price: '£0.99', used: 'about 30g', valueUsed: '£0.17' },
  { product: 'Dried thyme', pack: '15g', price: '£0.65', used: 'about 0.75g', valueUsed: '£0.03' },
  { product: 'Chopped tomatoes', pack: '400g can', price: '£0.43', used: '1 can', valueUsed: '£0.43' },
  { product: 'Red wine vinegar', pack: '500ml', price: '£1.65', used: '10ml', valueUsed: '£0.03' },
  { product: 'Spaghetti', pack: '500g', price: '£0.75', used: '250g', valueUsed: '£0.38' },
  { product: 'Chicken breast fillets', pack: '650g', price: '£4.69', used: '650g', valueUsed: '£4.69' },
  { product: 'Red onions', pack: '1kg', price: '£0.95', used: '250g', valueUsed: '£0.24' },
  { product: 'Mixed peppers', pack: '3', price: '£1.79', used: '2', valueUsed: '£1.19' },
  { product: 'Salad tomatoes', pack: '6', price: '£0.99', used: '4', valueUsed: '£0.66' },
  { product: 'Balsamic vinegar', pack: '500ml', price: '£1.39', used: '75ml', valueUsed: '£0.21' },
  { product: 'Chicken breast fillets', pack: '300g', price: '£2.29', used: '175g', valueUsed: '£1.34' },
  { product: 'Chicken stock cubes', pack: '12 cubes', price: '£0.69', used: '1½ cubes', valueUsed: '£0.09' },
  { product: 'Fresh ginger', pack: '130g', price: '£0.99', used: 'about 5g', valueUsed: '£0.04' },
  { product: 'Egg noodles', pack: '410g', price: '£1.29', used: '50g', valueUsed: '£0.16' },
  { product: 'Sweetcorn in water', pack: '285g', price: '£0.55', used: 'about 30g', valueUsed: '£0.06' },
  { product: 'Baby button mushrooms', pack: '200g', price: '£0.95', used: 'about 60g', valueUsed: '£0.29' },
  { product: 'Spring onions', pack: '100g', price: '£0.65', used: 'about 30g', valueUsed: '£0.20' },
  { product: 'Light soy sauce', pack: '150ml', price: '£0.55', used: '10ml', valueUsed: '£0.04' },
];

export const COOKING_FOR_ONE_ASSUMPTIONS = [
  'One small onion is costed at 100g and one standard onion at 150g; two red onions are costed at 250g in total.',
  'Five garlic cloves are costed as five-eighths of one loose bulb, assuming about eight cloves per bulb. Bulb sizes vary.',
  'Two teaspoons of garam masala are costed at about 4g; two tablespoons of yogurt at 30g.',
  'Four tablespoons of breadcrumbs are costed at about 30g. Half a teaspoon of thyme plus a pinch is costed at about 0.75g.',
  'One teaspoon of chopped ginger is costed at 5g; two tablespoons of sweetcorn at 30g; three mushrooms at 60g; two spring onions at 30g.',
  'Aldi’s balsamic chicken recipe says one pack of chicken breasts without a weight. The costing uses the 650g pack.',
  'Temporary promotional reductions found during the check are not used. This makes the basket less dependent on a short-lived offer.',
  'Recipe totals and headline figures are calculated from unrounded lines. Displayed rows may differ by a penny when added independently.',
];

export const COOKING_FOR_ONE_LEFTOVERS = [
  'About 125g raw chicken remains from the 300g pack. Freeze it before the printed use-by date, or use it promptly according to the label.',
  'About 150g spinach remains. Use it within the pack’s storage guidance in eggs, soup, pasta or as a wilted side.',
  'About 140g mushrooms remains. Refrigerate and plan a specific use within a few days.',
  'About 470g yogurt remains. Keep it refrigerated and follow the use-by date; it can cover breakfasts, sauces and dressings.',
  'One pepper and two salad tomatoes remain, along with most of both onion bags and three lemons. These need ordinary follow-on uses rather than being described as zero waste.',
  'Spring onions and ginger remain in the fridge. Spaghetti, noodles, breadcrumbs, spices, vinegars and soy sauce carry forward in the cupboard.',
];

const escapeHtml = (value: string) => value.replace(
  /[&<>"']/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character),
);

const table = (headings: string[], rows: string[][]) => (
  `<table><thead><tr>${headings.map(heading => `<th>${escapeHtml(heading)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
);

export function renderCookingForOnePlanInitialHtml() {
  const schedule = table(
    ['When', 'Dinner', 'What happens to the rest'],
    COOKING_FOR_ONE_SCHEDULE.map(item => [item.when, item.dinner, item.destination]),
  );
  const recipes = COOKING_FOR_ONE_RECIPES.map((recipe, index) => (
    `<section><h2>${index + 1}. ${escapeHtml(recipe.name)}</h2><p><strong>Original recipe:</strong> <a href="${escapeHtml(recipe.url)}">${escapeHtml(recipe.publisher)}: ${escapeHtml(recipe.name)}</a></p><p>${escapeHtml(recipe.summary)}</p><p>${escapeHtml(recipe.servingPlan)}</p><p><strong>Why it earns its place:</strong> ${escapeHtml(recipe.basketFit)}</p></section>`
  )).join('');
  const costs = table(
    ['Published dish', 'Ingredient value', 'Per serving'],
    [
      ...COOKING_FOR_ONE_RECIPES.map(recipe => [recipe.name, recipe.ingredientValue, recipe.perServing]),
      ['Total', COOKING_FOR_ONE_USED_VALUE, '10 servings'],
    ],
  );
  const basket = table(
    ['Product', 'Pack', 'Price', 'Used', 'Value used'],
    COOKING_FOR_ONE_BASKET.map(item => [item.product, item.pack, item.price, item.used, item.valueUsed]),
  );
  const assumptions = COOKING_FOR_ONE_ASSUMPTIONS.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const leftovers = COOKING_FOR_ONE_LEFTOVERS.map(item => `<li>${escapeHtml(item)}</li>`).join('');

  return `<section><p>Cooking for one often becomes awkward at the shopping stage. Most recipe publishers still write for two or four people, while spinach, chicken and herbs arrive in packs that rarely match one serving. Scaling everything down can look neat on paper, but it may introduce quantities the original publisher never tested.</p><p>This plan takes a more practical route. Four established recipes are cooked at their published yield. One serving is eaten for dinner, three extra servings become named next-day lunches, and one four-serving dish supplies a second scheduled dinner plus two dated freezer portions.</p><p>The basket is coordinated to reduce waste, not eliminate it. Some food remains for later. The important part is that the perishable leftovers are visible and given a realistic destination.</p></section><section><h2>The five-dinner schedule</h2>${schedule}</section>${recipes}<section><h2>5. The freezer night</h2><p>Dinner five is one of the balsamic chicken portions frozen after dinner three. Defrost it in the fridge, use it within 24 hours of defrosting, and reheat it only once until steaming hot throughout. It is not a fifth recipe, which is precisely the point: no new shopping or preparation is needed.</p></section><section><h2>Where every serving goes</h2><p>The four published recipes provide ten servings: five scheduled dinners, three next-day lunches and two future freezer portions.</p></section><section><h2>What the basket costs</h2><p>At the prices checked on ${COOKING_FOR_ONE_PRICE_CHECK_DATE}, the estimated complete-pack checkout total is <strong>${COOKING_FOR_ONE_CHECKOUT_TOTAL}</strong> for 27 packs or items. The estimated value of the quantities used across all ten servings is <strong>${COOKING_FOR_ONE_USED_VALUE}</strong>, calculated from unrounded ingredient lines. In practical terms, a little under half of the checkout value is used in these recipes; much of the balance remains for later cooking.</p><p>Cooking oil, salt and pepper are assumed already owned and excluded from both figures. Temporary promotional reductions are not used. Aldi prices, pack sizes and availability may vary by store and can change after the check date.</p>${costs}</section><section><h2>The full Aldi basket</h2>${basket}</section><section><h2>Costing assumptions</h2><ul>${assumptions}</ul></section><section><h2>Fresh food left after the plan</h2><ul>${leftovers}</ul></section><section><h2>Food-safety note</h2><p>Cool cooked leftovers and put them in the fridge within two hours. Eat refrigerated leftovers within 48 hours or freeze them. Reheat only once and make sure food is steaming hot throughout. Once frozen food has defrosted in the fridge, use it within 24 hours.</p></section><section><h2>What DinnerByDesign did, and did not do</h2><p>DinnerByDesign selected and compared these published recipes. It did not develop or test them. Use each original publisher’s page for quantities, timings and method.</p><p>DinnerByDesign’s contribution is the Aldi availability check, the coordinated basket, the comparison between complete-pack checkout cost and ingredient value used, the serving destinations, and the explicit costing and leftover assumptions.</p></section>`;
}
