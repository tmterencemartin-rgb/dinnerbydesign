import type { ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  PROGRAMMATIC_DISCLOSURE_FOOTER,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
} from './publicGuideModel';

export type FamilyPlanBasketCategory = 'Produce' | 'Protein' | 'Chilled' | 'Cupboard' | 'Freezer';

export interface FamilyPlanRecipe {
  title: string;
  summary: string;
  ingredients: Array<{ name: string; quantity: string }>;
  timing: string;
  method: string[];
  cost: number;
  perServing: number;
  reuse: string;
  allergens: string;
}

export interface FamilyPlanBasketItem {
  category: FamilyPlanBasketCategory;
  ingredient: string;
  quantityUsed: string;
  referencePack: string;
  packCost: number;
  valueUsed: number;
  usedIn: string;
  sourceUrl?: string;
  estimated?: boolean;
}

export const FAMILY_DINNERS_FOR_FOUR_PATH = '/dinner-plans/5-affordable-family-dinners-for-four';

export const FAMILY_DINNERS_FOR_FOUR_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_estimate',
    title: 'How to read the costs',
    body: 'Prices were checked against an Aldi UK reference basket on 26 July 2026. The £35.38 checkout figure covers complete packs. The £18.31 ingredient figure estimates only the quantities used across the 20 servings. Retailer, region, availability and promotions will change the amount paid.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Each recipe is written for four servings. Appetite, portion size and any additional sides may change the quantity your household needs.',
  },
  {
    key: 'source_timing',
    title: 'Source and price timing',
    body: 'Recipe structure, product pages and prices were reviewed on 26 July 2026. Aldi product availability, pack sizes and online prices may change after that date.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow use-by dates and the storage, freezing and cooking instructions on each pack. Refrigerate or freeze raw chicken promptly and cook it thoroughly.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Sausages, stock cubes, pasta, couscous and replacement products vary. Check every label for allergens and dietary suitability.',
  },
];

export const FAMILY_DINNERS_FOR_FOUR = {
  slug: '5-affordable-family-dinners-for-four',
  title: 'Five family dinners for four using one coordinated basket',
  shortTitle: 'Five family dinners for four',
  seoTitle: '5 family dinners for four using one basket | DinnerByDesign',
  description: 'Five affordable UK family dinners for four, with one coordinated shopping basket, shared ingredients, pack costs and practical ways to reduce waste.',
  householdSize: 4,
  dinnerCount: 5,
  servingCount: 20,
  expectedCheckoutCost: 35.38,
  estimatedIngredientCost: 18.31,
  averageCostPerServing: 0.92,
  priceBasisDate: '2026-07-26',
  publishedAt: '2026-07-26',
  reviewedAt: '2026-07-26',
  contentReviewedAt: '2026-07-26',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Dinner plan' as const,
  primarySearchIntent: 'Affordable family dinners for four using one coordinated UK shopping basket',
  indexingStatus: 'index' as const,
  status: 'published' as const,
  disclosures: ['price_estimate', 'serving_assumption', 'source_timing', 'storage_and_cooking', 'allergen_and_product'] as ProgrammaticDisclosureKey[],
  internalLinks: [
    '/dinner-plans',
    '/dinner-plans/5-dinners-for-2-under-40',
    '/food-costs/five-dinners-same-ingredients',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/fresh-or-frozen',
    '/pricing-methodology',
    '/recipe-methodology',
  ],
  introduction: [
    'Shopping for five separate dinners across a week often leaves a fridge full of loose ends: half a bag of carrots, a part-used tin of tomatoes, or three peppers when a recipe only called for one.',
    'This plan works differently. All five dinners draw from a single basket, so what is bought for Monday gets used again later in the week. Below is the plan, the ingredients behind it, and an honest account of the likely cost and what is left in the cupboard afterwards.',
  ],
  recipes: [
    {
      title: 'Sausage and root-vegetable traybake',
      summary: 'Sausages, carrots and potatoes roasted together on one tray.',
      ingredients: [
        { name: 'Pork sausages', quantity: '8' },
        { name: 'Carrots, cut into batons', quantity: '400g' },
        { name: 'Potatoes, cut into chunks', quantity: '500g' },
        { name: 'Onion, cut into wedges', quantity: '1' },
        { name: 'Olive oil', quantity: '1 tbsp' },
        { name: 'Dried mixed herbs', quantity: '1 tsp' },
      ],
      timing: 'Prep 10 min · cook 35 min in the oven · total 45 min',
      method: [
        'Heat the oven to 200°C, or 180°C fan.',
        'Toss the carrots, potatoes and onion with the oil and herbs on a large baking tray.',
        'Add the sausages, spacing everything out in a single layer.',
        'Roast for 35 minutes, turning once, until the sausages are cooked through and the vegetables are tender.',
      ],
      cost: 2.64,
      perServing: 0.66,
      reuse: 'Carrots and onion are shared with the cottage pie later in the week.',
      allergens: 'Sausages may contain gluten from rusk, so check the pack. A meat-free sausage can replace pork, but compare the pack price with the £1.79 used here.',
    },
    {
      title: 'Red lentil cottage pie',
      summary: 'A mash-topped pie built on red lentils rather than mince, using the same carrots and potatoes bought for the traybake.',
      ingredients: [
        { name: 'Red lentils', quantity: '250g' },
        { name: 'Carrots, grated', quantity: '200g' },
        { name: 'Onion, chopped', quantity: '1' },
        { name: 'Garlic, crushed', quantity: '2 cloves' },
        { name: 'Olive oil', quantity: '1 tsp' },
        { name: 'Chopped tomatoes', quantity: '1 tin' },
        { name: 'Vegetable stock cube', quantity: '1' },
        { name: 'Potatoes', quantity: '800g' },
        { name: 'Butter', quantity: '25g' },
        { name: 'Milk', quantity: 'A splash, about 50ml' },
        { name: 'Mature cheddar, grated', quantity: '100g' },
        { name: 'Frozen peas', quantity: '100g' },
      ],
      timing: 'Prep 15 min · cook 30 min · total 45 min',
      method: [
        'Boil the potatoes until soft, then mash with the butter and milk.',
        'Heat the oil in a pan and fry the onion, garlic and carrots for five minutes.',
        'Add the lentils, tomatoes and stock cube dissolved in 400ml water. Simmer for 20 minutes, stirring occasionally, until the lentils are soft and the mixture has thickened. Stir through the peas.',
        'Spoon into an ovenproof dish, top with the mash, and scatter over the cheddar.',
        'Grill for 8 to 10 minutes until the top is golden.',
      ],
      cost: 2.86,
      perServing: 0.72,
      reuse: 'Uses the remaining carrots and more of the potatoes bought for the traybake.',
      allergens: 'Contains dairy. Some stock cubes contain gluten, so check the pack. Drained tinned green lentils can replace dried red lentils to shorten the cooking time.',
    },
    {
      title: 'Smoky bean and tomato pasta bake',
      summary: 'Two tins of beans and tinned tomatoes with smoked paprika, finished under the grill with a second portion of cheddar.',
      ingredients: [
        { name: 'Pasta, penne or similar', quantity: '300g' },
        { name: 'Cannellini or haricot beans, drained', quantity: '2 tins' },
        { name: 'Chopped tomatoes', quantity: '1 tin' },
        { name: 'Onion, chopped', quantity: '1' },
        { name: 'Garlic, crushed', quantity: '2 cloves' },
        { name: 'Olive oil', quantity: '1 tsp' },
        { name: 'Smoked paprika', quantity: '1 tsp' },
        { name: 'Spinach', quantity: '100g' },
        { name: 'Mature cheddar, grated', quantity: '100g' },
      ],
      timing: 'Prep 10 min · cook 20 min · total 30 min',
      method: [
        'Cook the pasta according to the pack instructions.',
        'Heat the oil and fry the onion and garlic for five minutes. Add the beans, tomatoes and smoked paprika, then simmer for 10 minutes.',
        'Stir the spinach through the sauce until wilted, then combine with the drained pasta.',
        'Transfer to an ovenproof dish, scatter over the cheddar, and grill for five minutes until melted and lightly browned.',
      ],
      cost: 2.96,
      perServing: 0.74,
      reuse: 'Finishes the two tins of tomatoes bought for the week and uses a second portion of the cheddar.',
      allergens: 'Contains gluten and dairy. Gluten-free pasta is a direct swap. Any tinned white bean can replace cannellini or haricot beans.',
    },
    {
      title: 'Chicken and vegetable couscous',
      summary: 'Diced chicken thighs with courgette and pepper, spooned over couscous.',
      ingredients: [
        { name: 'Chicken thigh fillets, diced', quantity: '500g' },
        { name: 'Couscous', quantity: '250g' },
        { name: 'Courgette, diced', quantity: '1' },
        { name: 'Pepper, diced', quantity: '1' },
        { name: 'Onion, chopped', quantity: '1' },
        { name: 'Garlic, crushed', quantity: '1 clove' },
        { name: 'Ground cumin', quantity: '1 tsp' },
        { name: 'Vegetable stock cube', quantity: '1' },
        { name: 'Frozen peas', quantity: '100g' },
        { name: 'Olive oil', quantity: '1 tbsp' },
      ],
      timing: 'Prep 10 min · cook 15 min · total 25 min',
      method: [
        'Fry the chicken in the oil for 6 to 8 minutes until browned and cooked through, then set aside.',
        'In the same pan, soften the onion, garlic, courgette and pepper for five minutes. Stir in the cumin.',
        'Return the chicken to the pan with the peas and heat through.',
        'Prepare the couscous with stock made from the stock cube, following the pack instructions.',
        'Serve the chicken and vegetables over the couscous.',
      ],
      cost: 5.89,
      perServing: 1.47,
      reuse: 'Shares courgette and pepper with the frittata, and the stock cube and peas with the cottage pie.',
      allergens: 'Couscous contains gluten. Rice or quinoa can replace it. Two drained tins of chickpeas reduce this dinner to about £3.33, or £0.83 per serving.',
    },
    {
      title: 'Vegetable and cheddar frittata with potato wedges',
      summary: 'Baked potato wedges with an egg-based frittata using onion, courgette, pepper and spinach.',
      ingredients: [
        { name: 'Potatoes, cut into wedges', quantity: '500g' },
        { name: 'Olive oil', quantity: '2 tsp' },
        { name: 'Onion, chopped', quantity: '1' },
        { name: 'Medium eggs', quantity: '6' },
        { name: 'Courgette, sliced', quantity: '1' },
        { name: 'Pepper, sliced', quantity: '1' },
        { name: 'Spinach', quantity: '100g' },
        { name: 'Mature cheddar, grated', quantity: '50g' },
      ],
      timing: 'Prep 15 min · cook 25 to 30 min · total about 40 to 45 min',
      method: [
        'Heat the oven to 200°C, or 180°C fan. Toss the wedges in half the oil and roast for 25 to 30 minutes, turning once.',
        'About 15 minutes before the wedges are ready, heat the remaining oil in a small ovenproof frying pan and soften the onion, courgette and pepper for five minutes. Add the spinach and let it wilt.',
        'Beat the eggs and pour them over the vegetables. Cook on a low heat for five minutes until the edges set.',
        'Scatter over the cheddar and finish under the grill for 3 to 4 minutes until set and golden.',
        'Serve with the potato wedges.',
      ],
      cost: 3.96,
      perServing: 0.99,
      reuse: 'Uses the remaining courgette, one more pepper, and the spinach, cheddar, potatoes and last onion bought for the other dinners.',
      allergens: 'Contains eggs and dairy. A dairy-free hard-cheese alternative can replace cheddar. Use a different recipe for an egg allergy.',
    },
  ] as FamilyPlanRecipe[],
  basket: [
    { category: 'Produce', ingredient: 'Carrots', quantityUsed: '600g', referencePack: "Nature's Pick carrots, 1kg", packCost: 0.69, valueUsed: 0.41, usedIn: 'Traybake, cottage pie', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-carrots-000000000000339791' },
    { category: 'Produce', ingredient: 'Onions', quantityUsed: '5, about 625g', referencePack: "Nature's Pick brown onions, 1kg, standard price", packCost: 0.99, valueUsed: 0.62, usedIn: 'All five dinners', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-brown-onions-000000000000339777' },
    { category: 'Produce', ingredient: 'Garlic', quantityUsed: '5 cloves', referencePack: "Nature's Pick garlic, 4 bulbs, standard price", packCost: 0.87, valueUsed: 0.11, usedIn: 'Cottage pie, pasta bake, couscous', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-garlic-000000000000273810' },
    { category: 'Produce', ingredient: 'Potatoes', quantityUsed: '1.8kg', referencePack: "Nature's Pick British white potatoes, 2.5kg", packCost: 1.65, valueUsed: 1.19, usedIn: 'Traybake, cottage pie, frittata', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-british-white-potatoes-000000000000340016' },
    { category: 'Produce', ingredient: 'Courgettes', quantityUsed: '2, 500g pack', referencePack: "Nature's Pick courgettes, 500g", packCost: 1.39, valueUsed: 1.39, usedIn: 'Couscous, frittata', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-courgettes-500g-000000000000339808' },
    { category: 'Produce', ingredient: 'Peppers', quantityUsed: '2 of 3', referencePack: "Nature's Pick mixed peppers, 3 pack, standard price", packCost: 1.79, valueUsed: 1.19, usedIn: 'Couscous, frittata', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-mixed-peppers-000000000000275392' },
    { category: 'Produce', ingredient: 'Spinach', quantityUsed: '200g', referencePack: "Nature's Pick British baby spinach, 450g", packCost: 1.59, valueUsed: 0.71, usedIn: 'Pasta bake, frittata', sourceUrl: 'https://www.aldi.co.uk/product/nature-s-pick-british-baby-spinach-000000000000340023' },
    { category: 'Protein', ingredient: 'Pork sausages', quantityUsed: '8', referencePack: "Butcher's Select pork sausages, 8 pack", packCost: 1.79, valueUsed: 1.79, usedIn: 'Traybake', sourceUrl: 'https://www.aldi.co.uk/product/butchers-select-butchers-pork-sausages-8-pack-000000000000383313' },
    { category: 'Protein', ingredient: 'Chicken thigh fillets', quantityUsed: '500g', referencePack: 'Ashfields chicken thigh fillets, 600g', packCost: 4.39, valueUsed: 3.66, usedIn: 'Couscous', sourceUrl: 'https://www.aldi.co.uk/product/ashfields-chicken-thigh-fillets-000000000000416054' },
    { category: 'Chilled', ingredient: 'Mature cheddar', quantityUsed: '250g', referencePack: 'Emporium British extra mature cheddar, 400g', packCost: 2.49, valueUsed: 1.56, usedIn: 'Cottage pie, pasta bake, frittata', sourceUrl: 'https://www.aldi.co.uk/product/emporium-british-extra-mature-cheddar-cheese-000000000000522620' },
    { category: 'Chilled', ingredient: 'Medium eggs', quantityUsed: '6', referencePack: 'Merevale British medium free-range eggs, 6 pack', packCost: 1.49, valueUsed: 1.49, usedIn: 'Frittata', sourceUrl: 'https://www.aldi.co.uk/product/merevale-british-medium-free-range-eggs-6-pack-000000000000416701' },
    { category: 'Chilled', ingredient: 'Butter', quantityUsed: '25g', referencePack: 'Cowbelle British salted butter, 250g', packCost: 1.99, valueUsed: 0.20, usedIn: 'Cottage pie', sourceUrl: 'https://www.aldi.co.uk/product/cowbelle-british-salted-butter-250g-000000000000416554' },
    { category: 'Chilled', ingredient: 'Semi-skimmed milk', quantityUsed: 'About 50ml', referencePack: 'Cowbelle British semi-skimmed milk, 1 pint', packCost: 0.85, valueUsed: 0.07, usedIn: 'Cottage pie', sourceUrl: 'https://www.aldi.co.uk/product/cowbelle-british-semi-skimmed-milk-1-7-fat-000000000417494001' },
    { category: 'Cupboard', ingredient: 'Red lentils', quantityUsed: '250g', referencePack: 'Worldwide Foods red lentils, 500g', packCost: 0.99, valueUsed: 0.50, usedIn: 'Cottage pie', sourceUrl: 'https://www.aldi.co.uk/product/worldwide-foods-red-lentils-000000000000336258' },
    { category: 'Cupboard', ingredient: 'Chopped tomatoes', quantityUsed: '2 tins', referencePack: 'Everyday Essentials chopped tomatoes, 400g, 2 tins', packCost: 0.86, valueUsed: 0.86, usedIn: 'Cottage pie, pasta bake', sourceUrl: 'https://www.aldi.co.uk/product/everyday-essentials-chopped-tomatoes-in-tomato-juice-000000000000278702' },
    { category: 'Cupboard', ingredient: 'Cannellini or haricot beans', quantityUsed: '2 tins', referencePack: 'Four Seasons cannellini beans, 400g, 2 tins', packCost: 0.90, valueUsed: 0.90, usedIn: 'Pasta bake', estimated: true },
    { category: 'Cupboard', ingredient: 'Vegetable stock cubes', quantityUsed: '2 of 12', referencePack: 'Bramwells vegetable stock cubes, 12 pack', packCost: 0.55, valueUsed: 0.09, usedIn: 'Cottage pie, couscous', estimated: true },
    { category: 'Cupboard', ingredient: 'Couscous', quantityUsed: '250g', referencePack: 'Plain couscous, 500g', packCost: 0.95, valueUsed: 0.48, usedIn: 'Couscous dinner', estimated: true },
    { category: 'Cupboard', ingredient: 'Penne pasta', quantityUsed: '300g', referencePack: 'Cucina penne pasta, 500g', packCost: 0.69, valueUsed: 0.41, usedIn: 'Pasta bake', sourceUrl: 'https://www.aldi.co.uk/product/cucina-penne-pasta-500g-000000000000308638' },
    { category: 'Cupboard', ingredient: 'Smoked paprika', quantityUsed: '1 tsp', referencePack: 'Ready, Set...Cook! smoked paprika, 40g', packCost: 0.69, valueUsed: 0.05, usedIn: 'Pasta bake', sourceUrl: 'https://www.aldi.co.uk/product/ready-set-cook-smoked-paprika-000000000000575323' },
    { category: 'Cupboard', ingredient: 'Ground cumin', quantityUsed: '1 tsp', referencePack: 'Ready, Set...Cook! cumin, jar', packCost: 0.65, valueUsed: 0.05, usedIn: 'Couscous', sourceUrl: 'https://www.aldi.co.uk/product/ready-set-cook-cumin-000000000000335731' },
    { category: 'Cupboard', ingredient: 'Dried mixed herbs', quantityUsed: '1 tsp', referencePack: 'Ready, Set...Cook! mixed herbs, jar', packCost: 0.59, valueUsed: 0.05, usedIn: 'Traybake', sourceUrl: 'https://www.aldi.co.uk/product/ready-set-cook-mixed-herbs-000000000000335977' },
    { category: 'Cupboard', ingredient: 'Olive oil', quantityUsed: 'About 50ml', referencePack: 'Solesta olive oil, 1 litre, standard price', packCost: 5.39, valueUsed: 0.27, usedIn: 'All five dinners', sourceUrl: 'https://www.aldi.co.uk/product/solesta-olive-oil-000000000000511100' },
    { category: 'Freezer', ingredient: 'Frozen peas', quantityUsed: '200g', referencePack: 'Four Seasons garden peas, 900g', packCost: 1.15, valueUsed: 0.26, usedIn: 'Cottage pie, couscous', sourceUrl: 'https://www.aldi.co.uk/product/four-seasons-garden-peas-000000000000366805' },
  ] as FamilyPlanBasketItem[],
  coordination: [
    'Carrots bought for Monday’s traybake are roasted, then grated into the cottage pie filling. One 2.5kg sack of potatoes covers the traybake, the cottage pie mash and the frittata wedges.',
    'Courgette, pepper, spinach and onion are split between the couscous and the frittata. Cheddar is bought as one 400g block and used three times in different ways.',
    'Twelve ingredients appear in two or more dinners. Reuse is concentrated on fresh produce, cheddar, tomatoes, stock, olive oil and peas, rather than forcing every ingredient into two recipes.',
  ],
  remainders: [
    'About 400g carrots, 700g potatoes, three onions, three garlic bulbs, one pepper and 250g spinach remain. Store them as directed on the packs, and freeze the pepper or wilt the spinach if they will not be used in time.',
    'About 100g raw chicken remains from the 600g pack. Use it within the pack’s instructions or freeze it promptly in a sealed container or bag.',
    'About 150g cheddar, most of the butter and milk, and longer-life lentils, couscous, pasta, stock cubes, spices, olive oil and frozen peas carry into the following week.',
  ],
  preparation: [
    'Chop the onions and garlic needed for the week in one go and keep them covered in the fridge.',
    'Grate the cottage-pie carrots while preparing the carrots for the traybake.',
    'Dice Thursday’s chicken the night before if useful, keeping it covered and refrigerated until it is cooked.',
  ],
  substitutions: [
    'For a vegetarian version, replace the pork sausages with a meat-free equivalent and swap the chicken for two drained tins of chickpeas. The couscous dinner then costs about £3.33, or £0.83 per serving.',
    'Frozen diced onion, pepper and spinach can replace fresh versions. Texture will be softer, and frozen is not always cheaper, so compare the pack price.',
    'Leeks can replace courgette, butter beans can replace cannellini or haricot beans, and another hard cheese can replace cheddar.',
  ],
  methodology: [
    'Pack cost is the full price of the smallest suitable pack, whether or not the whole pack is used. Value used is the estimated share consumed by these five recipes. The five dinner costs reconcile to the £18.31 value-used total; the £35.38 checkout figure is higher because it includes complete packs.',
    'The plan assumes an empty cupboard. A household that already has olive oil, stock cubes or dried herbs is likely to spend less than the checkout figure.',
    'Cannellini or haricot beans, stock cubes and couscous are marked as estimates because their current online prices could not be verified on the linked Aldi product pages. In-store prices may differ. Costs also vary by retailer, region and time of year.',
  ],
  faqs: [
    { question: 'Can this plan be scaled for more or fewer than four servings?', answer: 'Yes. Quantities scale with servings, but checkout cost will not move in a perfectly straight line because many ingredients come in fixed pack sizes.' },
    { question: 'Does the cost change with a different retailer?', answer: 'Yes. These figures use an Aldi UK reference basket. Another supermarket or region may produce a noticeably different total.' },
    { question: 'What if someone will not eat one of the five dinners?', answer: 'The couscous and pasta bake are the easiest to adapt without losing the shared-ingredient structure. Use the substitutions above or personalise the plan.' },
    { question: 'Which cupboard ingredients are assumed to be at home?', answer: 'None. Spice jars, stock cubes and olive oil are all included, so an existing cupboard should lower the likely checkout cost.' },
    { question: 'How should leftovers be stored?', answer: 'Follow the use-by date and storage instructions on each pack. Refrigerate or freeze promptly, particularly for raw chicken, and follow current Food Standards Agency guidance.' },
  ],
} as const;

export function getFamilyDinnersForFourJsonLd() {
  return getPublicGuideJsonLd(FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD);
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));
const money = (value: number) => `£${value.toFixed(2)}`;

const FAMILY_DINNERS_FOR_FOUR_DISCLOSURES_FOR_RECORD = FAMILY_DINNERS_FOR_FOUR.disclosures.map(key => {
  const disclosure = FAMILY_DINNERS_FOR_FOUR_DISCLOSURES.find(item => item.key === key);
  if (!disclosure) throw new Error(`Missing family dinners for four disclosure for ${key}`);
  return disclosure;
});

const renderFamilyDinnersForFourArticleSections = () => {
  const plan = FAMILY_DINNERS_FOR_FOUR;
  const recipes = plan.recipes.map((recipe, index) => `<article><h3>${index + 1}. ${escapeHtml(recipe.title)}</h3><p>${escapeHtml(recipe.summary)}</p><h4>Ingredients for four</h4><ul>${recipe.ingredients.map(item => `<li>${escapeHtml(item.quantity)} ${escapeHtml(item.name)}</li>`).join('')}</ul><p>${escapeHtml(recipe.timing)}</p><ol>${recipe.method.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p><strong>Cost: ${money(recipe.cost)} total, ${money(recipe.perServing)} per serving.</strong></p><p><strong>Reuse:</strong> ${escapeHtml(recipe.reuse)}</p><p><strong>Allergens and substitutions:</strong> ${escapeHtml(recipe.allergens)}</p></article>`).join('');
  const basket = (['Produce', 'Protein', 'Chilled', 'Cupboard', 'Freezer'] as const).map(category => `<section><h3>${category}</h3><ul>${plan.basket.filter(item => item.category === category).map(item => `<li><strong>${escapeHtml(item.ingredient)}</strong>: ${escapeHtml(item.quantityUsed)} used; ${escapeHtml(item.referencePack)} at ${money(item.packCost)}${item.estimated ? ' estimated' : ''}; ${money(item.valueUsed)} used in ${escapeHtml(item.usedIn)}.${item.sourceUrl ? ` <a href="${escapeHtml(item.sourceUrl)}">Price source</a>.` : ''}</li>`).join('')}</ul></section>`).join('');
  const list = (items: readonly string[]) => `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  const faqs = plan.faqs.map(item => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('');
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FAMILY_DINNERS_FOR_FOUR_DISCLOSURES);
  return `${plan.introduction.map(item => `<p>${escapeHtml(item)}</p>`).join('')}<section aria-label="Plan summary"><h2>Plan summary</h2><p>Five dinners, four servings each, 20 servings in total.</p><p>Complete-pack checkout cost: ${money(plan.expectedCheckoutCost)}.</p><p>Estimated ingredient value used: ${money(plan.estimatedIngredientCost)}, or ${money(plan.averageCostPerServing)} per serving.</p></section>${disclosures}<section><h2>The five dinners</h2>${recipes}</section><section><h2>One coordinated shopping basket</h2><p>Pack cost is the full price paid at checkout. Value used estimates the share consumed by this plan.</p>${basket}<p><strong>Totals: pack cost ${money(plan.expectedCheckoutCost)}, value used ${money(plan.estimatedIngredientCost)}.</strong></p></section><section><h2>How the basket is coordinated</h2>${list(plan.coordination)}</section><section><h2>What remains after Friday</h2>${list(plan.remainders)}</section><section><h2>Preparation across the week</h2>${list(plan.preparation)}</section><section><h2>Substitutions</h2>${list(plan.substitutions)}</section><section><h2>How the figures were calculated</h2>${plan.methodology.map(item => `<p>${escapeHtml(item)}</p>`).join('')}</section><section><h2>Questions and answers</h2>${faqs}</section><section><h2>Related reading</h2><p><a href="/dinner-plans">Affordable dinner plans</a>, <a href="/dinner-plans/5-dinners-for-2-under-40">five dinners for two under £40</a>, <a href="/food-costs/five-dinners-same-ingredients">five dinners using the same ingredients</a>, <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>, <a href="/food-costs/fresh-or-frozen">fresh or frozen ingredients</a>, <a href="/pricing-methodology">pricing methodology</a> and <a href="/recipe-methodology">recipe methodology</a>.</p><p><a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food">Food Standards Agency cooking guidance</a> and <a href="https://www.nhs.uk/healthier-families/recipes/">NHS Healthier Families recipes</a>.</p></section>`;
};

export const FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD = {
  id: 'five-affordable-family-dinners-for-four',
  slug: FAMILY_DINNERS_FOR_FOUR.slug,
  path: FAMILY_DINNERS_FOR_FOUR_PATH,
  canonicalPath: FAMILY_DINNERS_FOR_FOUR_PATH,
  status: FAMILY_DINNERS_FOR_FOUR.status,
  category: 'dinner-plans',
  reviewSensitivity: 'price-sensitive',
  title: FAMILY_DINNERS_FOR_FOUR.title,
  seoTitle: FAMILY_DINNERS_FOR_FOUR.seoTitle,
  description: FAMILY_DINNERS_FOR_FOUR.description,
  metaDescription: FAMILY_DINNERS_FOR_FOUR.description,
  label: 'Dinner plan',
  publishedAt: FAMILY_DINNERS_FOR_FOUR.publishedAt,
  reviewedAt: FAMILY_DINNERS_FOR_FOUR.reviewedAt,
  nextReviewAt: '2026-10-26',
  editorialOwner: FAMILY_DINNERS_FOR_FOUR.editorialOwner,
  pageFamily: FAMILY_DINNERS_FOR_FOUR.pageFamily,
  primarySearchIntent: FAMILY_DINNERS_FOR_FOUR.primarySearchIntent,
  indexingStatus: FAMILY_DINNERS_FOR_FOUR.indexingStatus,
  contentReviewedAt: FAMILY_DINNERS_FOR_FOUR.contentReviewedAt,
  editorialNotes: 'Review Aldi reference prices, product availability, basket rounding and stated substitutions before republishing.',
  internalLinks: [...FAMILY_DINNERS_FOR_FOUR.internalLinks],
  disclosures: [...FAMILY_DINNERS_FOR_FOUR.disclosures],
  disclosureItems: FAMILY_DINNERS_FOR_FOUR_DISCLOSURES_FOR_RECORD,
  disclosureFooter: PROGRAMMATIC_DISCLOSURE_FOOTER,
  breadcrumbRoot: { label: 'Affordable dinner plans', url: '/dinner-plans' },
  sources: [
    ...FAMILY_DINNERS_FOR_FOUR.basket
      .filter((item): item is FamilyPlanBasketItem & { sourceUrl: string } => Boolean(item.sourceUrl))
      .map(item => ({ label: `Aldi: ${item.referencePack}`, url: item.sourceUrl })),
    { label: 'Food Standards Agency cooking guidance', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
    { label: 'NHS Healthier Families recipes', url: 'https://www.nhs.uk/healthier-families/recipes/' },
  ],
  faqs: [...FAMILY_DINNERS_FOR_FOUR.faqs],
  sections: [{ rawHtml: renderFamilyDinnersForFourArticleSections() }],
  cta: {
    title: 'Personalise this dinner plan',
    copy: 'Use DinnerByDesign to adapt the week around your household size, budget and preferences.',
    label: 'Personalise this dinner plan',
    href: '/signin',
  },
  jsonLdGraphItems: [
    {
      '@type': 'CollectionPage',
      '@id': `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#page`,
      url: `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}`,
      name: FAMILY_DINNERS_FOR_FOUR.title,
      description: FAMILY_DINNERS_FOR_FOUR.description,
      datePublished: FAMILY_DINNERS_FOR_FOUR.publishedAt,
      dateModified: FAMILY_DINNERS_FOR_FOUR.reviewedAt,
      isPartOf: { '@type': 'WebSite', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
      mainEntity: { '@id': `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#plan` },
    },
    {
      '@type': 'ItemList',
      '@id': `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#plan`,
      name: FAMILY_DINNERS_FOR_FOUR.shortTitle,
      numberOfItems: FAMILY_DINNERS_FOR_FOUR.recipes.length,
      itemListElement: FAMILY_DINNERS_FOR_FOUR.recipes.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: recipe.title,
      })),
    },
  ],
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false,
} satisfies PublicGuideRecord;

export function renderFamilyDinnersForFourInitialHtml() {
  const plan = FAMILY_DINNERS_FOR_FOUR;
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/dinner-plans">Affordable dinner plans</a> / ${escapeHtml(plan.shortTitle)}</nav><p>Affordable family dinner plan</p><h1>${escapeHtml(plan.title)}</h1><p>${escapeHtml(plan.description)}</p><p>By ${escapeHtml(plan.editorialOwner)} · Published and reviewed 26 July 2026 · Prices checked 26 July 2026</p>${renderFamilyDinnersForFourArticleSections()}${renderProgrammaticDisclosureFooterInitialHtml()}<p><a href="/signin">Personalise this dinner plan</a></p></main></div>`;
}

export function renderFamilyDinnersForFourGuideInitialHtml() {
  return renderPublicGuideInitialHtml(FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD);
}
