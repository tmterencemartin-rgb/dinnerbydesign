import type {
  ProgrammaticDisclosureFooterCopy,
  ProgrammaticDisclosureItem,
  ProgrammaticDisclosureKey,
} from './programmaticDisclosures';
import {
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
} from './publicGuideModel';

export const CHICKEN_THIGH_COST_GUIDE_PATH = '/recipes/5-chicken-thigh-recipes-for-four-aldi-cost-estimates';

export const CHICKEN_THIGH_COST_GUIDE = {
  title: 'Five chicken thigh recipes for four with Aldi cost estimates',
  seoTitle: 'Five Chicken Thigh Recipes for Four with Aldi Cost Estimates | DinnerByDesign',
  description: 'Compare five established chicken thigh recipes for four using Aldi UK cost estimates, including ingredient value, full-pack cost and price per serving.',
  publishedAt: '2026-07-27',
  reviewedAt: '2026-07-27',
  nextReviewAt: '2026-10-27',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Recipe cost comparison',
  primarySearchIntent: 'Compare chicken thigh recipes for four by estimated Aldi ingredient and full-pack cost',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-27',
  editorialNotes: 'Curated external recipes with original methods retained by their publishers. DinnerByDesign supplies cost and practical-use analysis only.',
  internalLinks: ['/recipes', '/pricing-methodology', '/recipe-methodology', '/food-safety', '/signin'],
  disclosures: ['price_estimate', 'price_comparison', 'serving_assumption', 'source_timing', 'storage_and_cooking', 'allergen_and_product'] satisfies ProgrammaticDisclosureKey[],
  status: 'published' as const,
  sources: [
    { label: 'Tesco Real Food: Easy chicken traybake', url: 'https://realfood.tesco.com/recipes/easy-chicken-traybake.html' },
    { label: 'Aldi: Chicken Provençal and vegetable stew', url: 'https://www.aldi.co.uk/recipes/courses/mains/chicken-provencal-and-vegetable-stew' },
    { label: 'Aldi: One Pot at Home Chicken', url: 'https://www.aldi.co.uk/recipes/courses/mains/one-pot-at-home-chicken' },
    { label: 'Sainsbury’s Magazine: Quick chicken and lentil curry', url: 'https://www.sainsburysmagazine.co.uk/recipes/curries/easy-chicken-and-lentil-curry' },
    { label: 'delicious. magazine: Quick chicken noodles', url: 'https://www.deliciousmagazine.co.uk/recipes/quick-chicken-noodles/' },
    { label: 'Aldi: Ashfields chicken thighs', url: 'https://www.aldi.co.uk/product/ashfields-chicken-thighs-000000000000382103' },
    { label: 'Aldi: Ashfields chicken thigh fillets', url: 'https://www.aldi.co.uk/product/ashfields-chicken-thigh-fillets-000000000000416054' },
    { label: 'Aldi: Ashfields chicken breast fillets', url: 'https://www.aldi.co.uk/product/ashfields-chicken-breast-fillets-000000000000383730' },
    { label: 'Aldi: Nature’s Pick brown onions', url: 'https://www.aldi.co.uk/product/nature-s-pick-brown-onions-000000000000339777' },
    { label: 'Aldi: Nature’s Pick British baking potatoes', url: 'https://www.aldi.co.uk/product/nature-s-pick-british-baking-potatoes-000000000000339757' },
    { label: 'Aldi: Nature’s Pick carrots', url: 'https://www.aldi.co.uk/product/nature-s-pick-carrots-000000000000339791' },
    { label: 'Aldi: Nature’s Pick mixed peppers', url: 'https://www.aldi.co.uk/product/nature-s-pick-mixed-peppers-000000000000275392' },
    { label: 'Aldi: Four Seasons garden peas', url: 'https://www.aldi.co.uk/product/four-seasons-garden-peas-000000000000366805' },
    { label: 'Aldi: Everyday Essentials chopped tomatoes', url: 'https://www.aldi.co.uk/product/everyday-essentials-chopped-tomatoes-in-tomato-juice-000000000000278702' },
    { label: 'Aldi: Worldwide Foods basmati rice', url: 'https://www.aldi.co.uk/product/worldwide-foods-basmati-rice-000000000000262344' },
    { label: 'Aldi: Solesta sunflower oil', url: 'https://www.aldi.co.uk/product/solesta-sunflower-oil-000000000000198481' },
    { label: 'Aldi: Solesta olive oil', url: 'https://www.aldi.co.uk/product/solesta-olive-oil-000000000000511100' },
    { label: 'Aldi: Nature’s Pick courgettes', url: 'https://www.aldi.co.uk/product/nature-s-pick-courgettes-000000000000339808' },
    { label: 'Aldi: Worldwide Foods red lentils', url: 'https://www.aldi.co.uk/product/worldwide-foods-red-lentils-000000000000336258' },
    { label: 'Aldi: Ready, Set…Cook! medium curry powder', url: 'https://www.aldi.co.uk/product/ready-set-cook-medium-curry-powder-000000000336690001' },
    { label: 'Aldi: Nature’s Pick red onions', url: 'https://www.aldi.co.uk/product/nature-s-pick-red-onions-000000000000339914' },
    { label: 'Aldi: Nature’s Pick garlic', url: 'https://www.aldi.co.uk/product/nature-s-pick-garlic-000000000000273810' },
    { label: 'Aldi: Everyday Essentials wonky lemons', url: 'https://www.aldi.co.uk/product/everyday-essentials-wonky-lemons-000000000000268496' },
    { label: 'Aldi: Nature’s Pick limes', url: 'https://www.aldi.co.uk/product/nature-s-pick-limes-000000000000285988' },
    { label: 'Aldi: Bramwells peri-peri seasoning', url: 'https://www.aldi.co.uk/product/bramwells-peri-peri-seasoning-000000000337370007' },
    { label: 'Aldi: Bramwells medium peri-peri sauce and marinade', url: 'https://www.aldi.co.uk/product/bramwells-medium-peri-peri-sauce-marinade-000000000337375001' },
  ],
};

interface ComparedRecipe {
  title: string;
  publisher: string;
  url: string;
  serves: string;
  timing: string;
  ingredientValue: string;
  perServing: string;
  fullPack: string;
  rows: Array<[string, string]>;
  description: string;
  practicalNote: string;
  uncertainty: string;
}

export const CHICKEN_THIGH_COMPARED_RECIPES: ComparedRecipe[] = [
  {
    title: 'Easy chicken traybake',
    publisher: 'Tesco Real Food',
    url: 'https://realfood.tesco.com/recipes/easy-chicken-traybake.html',
    serves: '4',
    timing: '5 minutes preparation, 1 hour cooking',
    ingredientValue: '£5.61–£5.87',
    perServing: '£1.40–£1.47',
    fullPack: '£10.60–£11.10',
    rows: [['Chicken', '£2.24'], ['Vegetables and fruit', '£2.03'], ['Carbohydrate', '£0.60'], ['Other ingredients', '£0.74–£1.00']],
    description: 'A single-tray combination of chicken thighs, potatoes, peppers, onion, courgette and Greek-style salad cheese. It is the longest-cooking option here, but most of that time is hands-off.',
    practicalNote: 'Best for a low-effort oven dinner when hands-on time needs to stay short. Some courgette, salad cheese and a spare pepper should remain for a stir-fry, omelette, salad or scrambled eggs. Tesco also suggests white potatoes as a substitution.',
    uncertainty: 'The Greek-style salad cheese price was not available to verify, so it contributes to the range.',
  },
  {
    title: 'Chicken Provençal and vegetable stew',
    publisher: 'Aldi',
    url: 'https://www.aldi.co.uk/recipes/courses/mains/chicken-provencal-and-vegetable-stew',
    serves: '4',
    timing: '20 minutes preparation, 40 minutes cooking',
    ingredientValue: '£4.39–£4.45',
    perServing: '£1.10–£1.11',
    fullPack: '£8.10–£8.45',
    rows: [['Chicken', '£2.99'], ['Vegetables', '£0.83'], ['Carbohydrate', '£0.40'], ['Other ingredients', '£0.17–£0.23']],
    description: 'A one-pot stew of chicken thighs, potatoes, carrots, onion and tinned tomatoes. It has the lowest estimated ingredient value and checkout range in this comparison.',
    practicalNote: 'Best for a colder evening using ingredients that store for a while. Spare onions and carrots keep well and can form the base of soup, another traybake or another stew.',
    uncertainty: 'Paprika was unverified and the chicken stock cube page showed no current price.',
  },
  {
    title: 'One Pot at Home Chicken',
    publisher: 'Aldi',
    url: 'https://www.aldi.co.uk/recipes/courses/mains/one-pot-at-home-chicken',
    serves: '4',
    timing: '15 minutes preparation, 35 minutes cooking',
    ingredientValue: '£8.19–£8.41',
    perServing: '£2.05–£2.10',
    fullPack: '£17.97–£19.32',
    rows: [['Chicken', '£4.39'], ['Vegetables', '£1.02'], ['Carbohydrate', '£0.73'], ['Other ingredients', '£2.05–£2.27']],
    description: 'A boneless-thigh option with rice, vegetables and a broader seasoning list. Its estimated ingredient value is higher than the other four, while the one-pot format may still appeal when washing-up is the deciding factor.',
    practicalNote: 'Best when a complete, well-seasoned dinner from familiar supermarket ingredients appeals. The remaining spices and stock pots keep well; fresh coriander is better used within a few days. The 80ml olive oil is included in ingredient value but its complete pack is excluded from checkout cost.',
    uncertainty: 'Paprika, oregano, dried chilli flakes and fresh coriander were unverified. Tomato purée and the chicken stock pot had no current price.',
  },
  {
    title: 'Quick chicken and lentil curry',
    publisher: 'Sainsbury’s Magazine',
    url: 'https://www.sainsburysmagazine.co.uk/recipes/curries/easy-chicken-and-lentil-curry',
    serves: '4',
    timing: '10 minutes preparation, 30 minutes total',
    ingredientValue: '£5.52–£5.77',
    perServing: '£1.38–£1.44',
    fullPack: '£10.71–£11.36',
    rows: [['Chicken', '£3.66'], ['Vegetables', '£0.82–£1.00'], ['Carbohydrate', '£0.65'], ['Other ingredients', '£0.39–£0.46']],
    description: 'The shortest stated total time in the group. Red lentils add substance alongside the chicken, and the curry powder keeps the seasoning list compact.',
    practicalNote: 'Best when time is short and a curry is wanted. Spare lentils keep for months, while the yoghurt and spinach can move into a marinade, another curry or pasta.',
    uncertainty: 'Fresh spinach and low-fat natural yoghurt were unverified, and the chicken stock cube page showed no current price.',
  },
  {
    title: 'Quick chicken noodles',
    publisher: 'delicious. magazine',
    url: 'https://www.deliciousmagazine.co.uk/recipes/quick-chicken-noodles/',
    serves: '4',
    timing: '25 minutes hands-on time',
    ingredientValue: '£5.82–£6.62',
    perServing: '£1.46–£1.66',
    fullPack: '£9.91–£11.51',
    rows: [['Chicken', '£3.66'], ['Vegetables', '£1.41–£1.91'], ['Carbohydrate', '£0.57–£0.77'], ['Other ingredients', '£0.18–£0.28']],
    description: 'A lighter, quicker-looking option using chicken, noodles and crisp vegetables. The recipe calls for four chicken thighs; the estimate assumes about 500g of boneless thigh fillets.',
    practicalNote: 'Best for a warm-weather or quick evening when a salad-style dish appeals. Optional herbs, peanuts and spring onions are excluded. Fish sauce, sugar and unused rice noodles can carry into another dinner.',
    uncertainty: 'Cucumber, fresh chilli, dried rice noodles or vermicelli, fish sauce and caster sugar were unverified.',
  },
];

export const CHICKEN_THIGH_COST_FAQS = [
  {
    question: 'Are chicken thighs cheaper than chicken breasts?',
    answer: 'Often, but not always. At the Aldi prices checked on 27 July 2026, bone-in thighs cost substantially less per kilogram than chicken breast fillets. Promotions, pack sizes and the amount of bone or skin can change the useful comparison.',
  },
  {
    question: 'Are bone-in chicken thighs cheaper than boneless thigh fillets?',
    answer: 'They usually have a lower shelf price per kilogram. Boneless fillets may be easier to prepare and can suit quicker recipes, so the better choice depends on time, edible yield and the dish.',
  },
  {
    question: 'Did DinnerByDesign create or test these recipes?',
    answer: 'No. Each recipe belongs to the named publisher. DinnerByDesign has not developed, reproduced or kitchen-tested the recipes; use the publisher’s page for quantities, timings and method.',
  },
  {
    question: 'Why are the Aldi cost estimates shown as ranges?',
    answer: 'Twelve ingredients could not be verified with a current Aldi online price, while three more were confirmed unavailable with no price displayed. Low and high working values keep that uncertainty visible instead of presenting a false single figure.',
  },
  {
    question: 'What is the difference between ingredient value and full-pack cost?',
    answer: 'Ingredient value estimates the share of each pack used in the recipe. Full-pack cost estimates what you might pay when buying the required packs from scratch, with the stated cupboard assumptions. Neither figure includes cooking energy.',
  },
];

const GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_estimate',
    title: 'About these estimates',
    body: 'Prices were checked on Aldi UK on 27 July 2026. Ingredient value estimates only the quantities used; full-pack cost estimates the packs needed when starting from scratch, subject to the cupboard assumptions shown. Cooking energy is excluded.',
  },
  {
    key: 'price_comparison',
    title: 'Why every cost is a range',
    body: 'Twelve ingredients could not be verified with a current online price. Three more, chicken stock cubes, chicken stock pots and tomato purée, were checked directly and showed no price because they were unavailable. Working low and high values are used for all fifteen.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Every comparison uses the publisher’s four-serving recipe. Appetite, portion size, substitutions and additional sides may change the quantities required.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Recipes and products can contain regulated allergens, including milk, fish, gluten, soya, nuts or celery. Check the original recipe and every current product label before cooking.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Cooking and storage',
    body: 'Follow the original publisher’s method, the chicken pack instructions and current Food Standards Agency guidance. Keep raw chicken separate and cook it thoroughly until steaming hot throughout.',
  },
  {
    key: 'source_timing',
    title: 'Editorial and price review',
    body: 'Recipe pages, product pages and cost calculations were reviewed on 27 July 2026. Retailer prices, pack sizes, promotions and availability can change.',
  },
];

const GUIDE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'DinnerByDesign selected established recipes for comparison and added cost, substitution, occasion and waste-use analysis. It did not write, reproduce or kitchen-test the recipes. Use the original publisher for quantities, timings and method.',
  links: [
    { href: '/recipes', label: 'Recipes and cooking ideas' },
    { href: '/pricing-methodology', label: 'How prices are calculated' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
    { href: '/food-safety', label: 'Food safety' },
  ],
};

const GUIDE_DISCLOSURES_FOR_RECORD = CHICKEN_THIGH_COST_GUIDE.disclosures.map(key => {
  const disclosure = GUIDE_DISCLOSURES.find(item => item.key === key);
  if (!disclosure) throw new Error(`Missing chicken thigh disclosure for ${key}`);
  return disclosure;
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

const extractArticleSections = (initialHtml: string) => {
  const match = initialHtml.match(/<article>([\s\S]*?)<\/article>/);
  if (!match) throw new Error('Chicken thigh cost guide HTML is missing article content.');
  return match[1];
};

const renderCostTable = (recipe: ComparedRecipe) => {
  const rows = recipe.rows.map(([category, estimate]) => `<tr><td>${escapeHtml(category)}</td><td>${escapeHtml(estimate)}</td></tr>`).join('');
  return `<div class="guide-table-wrap"><table><thead><tr><th>Cost group</th><th>Estimated ingredient value</th></tr></thead><tbody>${rows}<tr><th>Total ingredient value</th><th>${escapeHtml(recipe.ingredientValue)}</th></tr><tr><td>Estimated cost per serving</td><td>${escapeHtml(recipe.perServing)}</td></tr><tr><td>Estimated full-pack cost</td><td>${escapeHtml(recipe.fullPack)}</td></tr></tbody></table></div>`;
};

export function getChickenThighCostGuideJsonLd() {
  return getPublicGuideJsonLd(CHICKEN_THIGH_COST_GUIDE_RECORD);
}

function renderChickenThighCostGuideLegacyInitialHtml() {
  const guide = CHICKEN_THIGH_COST_GUIDE;
  const recipes = CHICKEN_THIGH_COMPARED_RECIPES.map((recipe, index) => `
    <section>
      <h2>${index + 1}. ${escapeHtml(recipe.publisher)}: ${escapeHtml(recipe.title)}</h2>
      <p><strong>Serves:</strong> ${escapeHtml(recipe.serves)} · <strong>Publisher’s timing:</strong> ${escapeHtml(recipe.timing)}</p>
      <p>${escapeHtml(recipe.description)}</p>
      ${renderCostTable(recipe)}
      <p><strong>Which occasion suits it:</strong> ${escapeHtml(recipe.practicalNote)}</p>
      <p><strong>Price uncertainty:</strong> ${escapeHtml(recipe.uncertainty)}</p>
      <p><a href="${escapeHtml(recipe.url)}">See the original ${escapeHtml(recipe.publisher)} recipe for quantities and method</a></p>
    </section>
  `).join('');
  const faqs = CHICKEN_THIGH_COST_FAQS.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const disclosures = renderProgrammaticDisclosuresInitialHtml(GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(GUIDE_FOOTER);

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/recipes">Recipes and cooking ideas</a> / Recipe cost comparison</nav><p>Recipe cost comparison</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 27 July 2026 · Last reviewed 27 July 2026</p><article>
    <section>
      <p>Chicken thighs are a flexible cut and, gram for gram, are often cheaper than chicken breast. That is not guaranteed everywhere: prices, pack sizes and promotions move, and bone-in and boneless packs are not identical comparisons. Thighs do, though, work across very different cooking styles, from a slow traybake to a quick noodle dinner.</p>
      <p>These five established recipes come from Tesco, Aldi, Sainsbury’s Magazine and delicious. magazine. DinnerByDesign has compared their estimated Aldi ingredient value, price per serving and full-pack cost so you can see where the differences come from.</p>
      <p>DinnerByDesign did not develop, reproduce or kitchen-test these recipes. The complete quantities, timings and method remain on each publisher’s page. Our contribution is the Aldi cost calculation, affordability comparison, substitutions, waste considerations and a view on which occasion each recipe may suit.</p>
    </section>
    <section>
      <h2>Why chicken thighs can suit cost-conscious cooking</h2>
      <p>At the Aldi prices checked, bone-in, skin-on chicken thighs cost £2.99 per kilogram, compared with £7.22 per kilogram for the referenced fresh chicken breast fillets. Boneless thigh fillets were £7.32 per kilogram. These figures are specific to Aldi UK on 27 July 2026; this article does not compare other retailers.</p>
      <p>Two recipes below use bone-in thighs and three use boneless fillets. That is each publisher’s choice, not something DinnerByDesign changed, and it helps explain part of the cost difference between the five.</p>
    </section>
    ${disclosures}
    ${recipes}
    <section>
      <h2>How the five recipes compare</h2>
      <ul>
        <li><strong>Lowest estimated ingredient value:</strong> Aldi’s Chicken Provençal and vegetable stew at £4.39–£4.45, or £1.10–£1.11 per serving.</li>
        <li><strong>Lowest estimated full-pack cost:</strong> the same Aldi stew at £8.10–£8.45.</li>
        <li><strong>Shortest stated total time:</strong> Sainsbury’s Magazine’s curry at 30 minutes. The noodle recipe lists 25 minutes hands-on time, which is not directly comparable with total time.</li>
        <li><strong>Best for using cupboard ingredients:</strong> the Aldi stew has the shortest supporting ingredient list.</li>
        <li><strong>Most obvious fresh-ingredient reuse:</strong> the Tesco traybake leaves courgette, pepper and salad cheese that can move into another dinner.</li>
      </ul>
      <p>At the checked Aldi prices, bone-in chicken thighs were £2.99 per kilogram and boneless thigh fillets were £7.32 per kilogram. That gap helps explain why the stew estimates below the boneless-thigh options, although bone, skin and edible yield mean price per kilogram is not the whole answer.</p>
    </section>
    <section>
      <h2>What could not be priced exactly</h2>
      <p>Twelve items remained unverified: paprika, oregano, dried chilli flakes, fresh coriander, Greek-style salad cheese, fresh spinach, low-fat natural yoghurt, dried rice noodles or vermicelli, cucumber, fish sauce, caster sugar and fresh red chilli.</p>
      <p>Three more were checked and confirmed unavailable with no price shown: chicken stock cubes, chicken stock pots and tomato purée. The ranges on this page cover all fifteen affected prices. Verified ingredients use the Aldi prices shown on the linked product pages.</p>
      <p>Where Aldi displayed a promotion, including courgettes and mixed peppers, the regular non-promotional price was used. Cooking oil, salt and pepper are generally treated as cupboard ingredients. The exception is the 80ml olive oil in One Pot at Home Chicken, which is included in ingredient value but not as a complete pack at checkout. Optional serving ingredients are excluded.</p>
    </section>
    <section><h2>Frequently asked questions</h2>${faqs}</section>
    <section><h2>Sources</h2><ul>${sources}</ul></section>
    ${footer}
  </article><section><h2>Compare recipes with your own budget</h2><p>Use DinnerByDesign to search for recipes that fit your ingredients, preferences and available time.</p><p><a href="/signin">Find a recipe</a></p></section></main></div>`;
}

export const CHICKEN_THIGH_COST_GUIDE_RECORD = {
  id: 'five-chicken-thigh-recipes-for-four-aldi-cost-estimates',
  slug: '5-chicken-thigh-recipes-for-four-aldi-cost-estimates',
  path: CHICKEN_THIGH_COST_GUIDE_PATH,
  canonicalPath: CHICKEN_THIGH_COST_GUIDE_PATH,
  category: 'recipes',
  reviewSensitivity: 'price-sensitive',
  ...CHICKEN_THIGH_COST_GUIDE,
  metaDescription: CHICKEN_THIGH_COST_GUIDE.description,
  label: 'Recipe cost comparison',
  disclosureItems: GUIDE_DISCLOSURES_FOR_RECORD,
  disclosureFooter: GUIDE_FOOTER,
  breadcrumbRoot: { label: 'Recipes and cooking ideas', url: '/recipes' },
  sections: [{ rawHtml: extractArticleSections(renderChickenThighCostGuideLegacyInitialHtml()) }],
  faqs: CHICKEN_THIGH_COST_FAQS,
  cta: {
    title: 'Compare recipes with your own budget',
    copy: 'Use DinnerByDesign to search for recipes that fit your ingredients, preferences and available time.',
    label: 'Find a recipe',
    href: '/signin',
  },
  jsonLdGraphItems: [
    {
      '@type': 'ItemList',
      '@id': `https://dinnerbydesign.app${CHICKEN_THIGH_COST_GUIDE_PATH}#recipes`,
      numberOfItems: CHICKEN_THIGH_COMPARED_RECIPES.length,
      itemListElement: CHICKEN_THIGH_COMPARED_RECIPES.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: recipe.title,
        url: recipe.url,
      })),
    },
  ],
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false,
} satisfies PublicGuideRecord;

export function renderChickenThighCostGuideInitialHtml() {
  return renderPublicGuideInitialHtml(CHICKEN_THIGH_COST_GUIDE_RECORD);
}
