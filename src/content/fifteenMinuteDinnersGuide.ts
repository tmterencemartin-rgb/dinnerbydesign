import type { ProgrammaticDisclosureKey, ProgrammaticDisclosureItem } from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const FIFTEEN_MINUTE_DINNERS_GUIDE_PATH = '/guides/fifteen-minute-dinners-everyday-supermarket-ingredients';

export const FIFTEEN_MINUTE_DINNERS_GUIDE = {
  title: 'Fifteen-minute dinners from everyday supermarket ingredients',
  seoTitle: 'Fifteen-minute dinners from everyday supermarket ingredients | DinnerByDesign',
  description: 'Ten publisher recipes with total preparation and cooking times of fifteen minutes or less, plus servings, dietary notes and practical timing caveats.',
  publishedAt: '2026-08-11',
  reviewedAt: '2026-08-11',
  nextReviewAt: '2027-02-11',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find fifteen-minute dinners using ordinary supermarket ingredients, with total timings checked against each publisher method',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-11',
  editorialNotes: 'Time-led collection of ten published recipes. Publisher timings were checked against the listed method, with product, allergen and defrosting conditions kept visible.',
  internalLinks: [
    '/recipes',
    '/guides',
    '/food-costs/cooking-for-one-without-waste',
    '/food-costs/five-dinners-same-ingredients',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/fresh-or-frozen',
    '/food-safety',
    '/recipe-methodology',
    '/signin',
  ],
  disclosures: [
    'serving_assumption',
    'allergen_and_product',
    'storage_and_cooking',
    'source_timing',
  ] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'delicious. magazine: warm borlotti bean and tuna salad',
      url: 'https://www.deliciousmagazine.co.uk/recipes/warm-borlotti-bean-and-tuna-salad/',
    },
    {
      label: 'Waitrose: Vietnamese rice noodle stir-fry',
      url: 'https://www.waitrose.com/content/waitrose/en/home/recipes/recipe_directory/v/vietnamese-rice-noodlestirfry.html',
    },
    {
      label: 'Waitrose: speedy veg noodles with oyster sauce',
      url: 'https://www.waitrose.com/ecom/recipe/speedy-veg-noodles-with-oyster-sauce',
    },
    {
      label: 'Waitrose: miso cod with sesame veggie noodles',
      url: 'https://www.waitrose.com/ecom/recipe/miso-cod-with-sesame-veggie-noodles',
    },
    {
      label: 'delicious. magazine: Thai fried egg salad',
      url: 'https://www.deliciousmagazine.co.uk/recipes/thai-fried-egg-salad-yum-kai-do/',
    },
    {
      label: 'Tesco Real Food: pesto eggs on toast',
      url: 'https://realfood.tesco.com/recipes/pesto-eggs-on-toast.html',
    },
    {
      label: 'BBC Good Food: 10-minute couscous salad',
      url: 'https://www.bbcgoodfood.com/recipes/10minute-couscous-salad',
    },
    {
      label: 'BBC Good Food: Indian chickpeas with poached eggs',
      url: 'https://www.bbcgoodfood.com/recipes/indian-chickpeas-poached-eggs',
    },
    {
      label: 'olive magazine: spaghetti with tuna, capers and chilli',
      url: 'https://www.olivemagazine.com/recipes/fish-and-seafood/spaghetti-with-tuna-capers-and-chilli/',
    },
    {
      label: 'olive magazine: tortellini in a pea broth',
      url: 'https://www.olivemagazine.com/recipes/quick-and-easy/tortellini-in-a-pea-broth/',
    },
    {
      label: 'Food Standards Agency: Home food fact checker',
      url: 'https://www.gov.uk/government/publications/home-food-fact-checker',
    },
  ],
  faqs: [
    {
      question: 'What counts as a fifteen-minute dinner?',
      answer: "A dinner with a total preparation and cooking time of fifteen minutes or less, checked against both the publisher's stated figure and the method's own steps. Recipes where the two disagreed were left out rather than included with a caveat.",
    },
    {
      question: 'Are these dinners suitable for one person?',
      answer: "Most are given as two servings. Halving ingredients works for the salads, egg dishes and pasta dinners. Tinned and jarred ingredients such as beans or sweetcorn can often be kept for a second dinner once opened, but check the product's own label and storage instructions rather than assuming this applies to every item.",
    },
    {
      question: 'Can frozen vegetables be used?',
      answer: "Yes, where a recipe calls for fresh vegetables that are also sold frozen, such as broccoli, a frozen version can generally be substituted without changing the timing. Peas are an exception here: defrost them first for the tortellini dinner, since that recipe's stated time depends on it.",
    },
    {
      question: 'Are fifteen-minute dinners always inexpensive?',
      answer: 'Not necessarily. Speed and cost are separate filters, and this collection is built around verified timing, not price. Some dinners here will cost more than others depending on what is already in the cupboard.',
    },
    {
      question: 'How can I make the preparation quicker?',
      answer: 'Put the kettle on before starting anything else, and chop vegetables while pasta or noodle water comes to the boil rather than before turning the hob on.',
    },
    {
      question: 'Can I use leftovers in these dinners?',
      answer: 'These recipes are built around fresh or store-cupboard ingredients rather than a pre-cooked component. Leftover rice or cooked chicken can generally be added to the noodle or egg dinners, but this will change the stated timing.',
    },
  ],
};

export const FIFTEEN_MINUTE_DINNERS_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'serving_assumption',
    title: 'Serving assumptions',
    body: 'Most entries use the serving count given by the publisher, usually two servings. Halving or keeping leftovers changes the quantity, storage needs and practical timing for an individual household.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Packaged ingredients such as pesto, stock, oyster sauce, miso sauce, noodles and tortellini vary by brand and may contain allergens. Check the current product label, especially when making a substitution.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: "Follow the publisher's method and the storage instructions on each pack. For the tortellini entry, defrost the peas before cooking if the ten-minute timing matters; the publisher's stated time was not verified with peas used straight from frozen.",
  },
  {
    key: 'source_timing',
    title: 'Recipe and timing review',
    body: 'The linked publisher recipes, their stated timings and the relevant method steps were checked on 11 August 2026. Publisher pages, products and availability can change, so follow the current source and label.',
  },
];

export const FIFTEEN_MINUTE_DINNERS_DISCLOSURE_FOOTER = {
  body: 'DinnerByDesign selected and compared these published recipes but did not develop or test them. Follow the original publisher’s ingredients, quantities, method, allergen information and current safety advice.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/food-safety', label: 'Food safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const FIFTEEN_MINUTE_DINNERS_OPENING_HTML = `<section><h2>Introduction</h2><p>Fifteen minutes disappears quickly once chopping, heating and washing up are counted in. The ten dinners below all have a total time of fifteen minutes or less as stated by the original publisher, and each method has been checked step by step rather than taken from the headline figure alone.</p><p>Every dinner here uses everyday supermarket ingredients, though a handful of items, such as miso sauce, oyster sauce, fresh cod and fresh tortellini, are common rather than universal and are not stocked in every branch. That is flagged against the entry where it applies.</p></section>
<section><h2>Quick answer</h2><p>Fifteen minutes means total preparation and cooking time combined, not cooking time alone, and not hands-on time alone. A dinner that cooks in ten minutes but needs twenty minutes of chopping first does not qualify. Nor does a recipe whose own steps, added up in sequence, run past fifteen minutes even if the publisher's headline figure says otherwise. Both kinds of dinner have been left out of this collection.</p><p>Where a recipe's stated time depends on an ingredient being prepared in a particular way in advance, such as defrosted rather than frozen peas, that condition is noted against the entry rather than assumed.</p></section>
<section><h2>At a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Dinner</th><th>Total time</th><th>Servings</th><th>Dietary</th><th>Best suited to</th></tr></thead><tbody><tr><td>Warm borlotti bean and tuna salad</td><td>10 min</td><td>2</td><td>Contains fish; vegan option given</td><td>A lighter dinner with no hob cooking beyond warming the beans</td></tr><tr><td>Vietnamese rice noodle stir-fry</td><td>15 min</td><td>2</td><td>Contains fish, peanuts</td><td>A lighter, citrus-dressed noodle dinner</td></tr><tr><td>Speedy veg noodles with oyster sauce</td><td>15 min</td><td>4</td><td>Contains egg, soya, molluscs, nuts, gluten</td><td>Feeding more than two people</td></tr><tr><td>Miso cod with veggie noodles</td><td>15 min</td><td>2</td><td>Contains fish, soya, sesame, gluten</td><td>A fresh-fish dinner without extra chopping</td></tr><tr><td>Thai fried egg salad</td><td>10 min</td><td>2</td><td>Dairy-free, gluten-free</td><td>A lighter dinner, best paired with rice or bread</td></tr><tr><td>Pesto eggs on toast</td><td>15 min</td><td>2</td><td>Vegetarian, depending on pesto</td><td>Using up half a jar of pesto</td></tr><tr><td>10-minute couscous salad</td><td>10 min</td><td>2</td><td>Vegetarian by ingredients; contains milk, nuts</td><td>A lighter dinner with no hob at all</td></tr><tr><td>Indian chickpeas with poached eggs</td><td>15 min</td><td>2</td><td>Vegetarian</td><td>A fibre-rich dinner with no meat or fish</td></tr><tr><td>Spaghetti with tuna, capers and chilli</td><td>10 min</td><td>4</td><td>Contains fish, gluten</td><td>A dinner with only one thing to cook</td></tr><tr><td>Tortellini in a pea broth</td><td>10 min</td><td>2</td><td>Vegetarian</td><td>A single-pot dinner using frozen peas, defrosted first</td></tr></tbody></table></div></section>`;

export const FIFTEEN_MINUTE_DINNERS_ENTRIES_HTML = `<section><h2>The dinners</h2><h3>1. Warm borlotti bean and tuna salad</h3><p><strong>Source:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/warm-borlotti-bean-and-tuna-salad/">delicious. magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes (5 min prep, 5 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Tinned tuna in olive oil, a jar of borlotti beans, red onion, rosemary, red wine vinegar, parsley.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner. The only knife work is finely chopping half a red onion and some parsley; everything else is tin, jar and pan.</p><p><strong>Substitution or preparation note:</strong> The recipe gives a vegan version: leave out the tuna and the dinner still works as a warm bean salad.</p><p><strong>Allergen information:</strong> Contains fish.</p></section>
<section><h3>2. Vietnamese rice noodle stir-fry</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/content/waitrose/en/home/recipes/recipe_directory/v/vietnamese-rice-noodlestirfry.html">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes. Serves 2.</p><p><strong>Key ingredients:</strong> Rice noodles, lime, fish sauce, orange, courgette, carrots, unsalted peanuts.</p><p><strong>Why it suits a weeknight:</strong> Grating the courgette and carrot is the main task; the noodles themselves cook for around three minutes.</p><p><strong>Substitution or preparation note:</strong> A one-pan dinner for two; swap the peanuts for cashews or leave them out for a nut-free version.</p><p><strong>Allergen information:</strong> Contains fish and peanuts.</p></section>
<section><h3>3. Speedy veg noodles with oyster sauce</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/ecom/recipe/speedy-veg-noodles-with-oyster-sauce">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 4.</p><p><strong>Key ingredients:</strong> Fine egg noodles, Tenderstem broccoli, mixed pepper stir-fry, mushrooms, garlic, ginger, oyster sauce.</p><p><strong>Why it suits a weeknight:</strong> Serves four, so it suits feeding more than two people within the same fifteen minutes.</p><p><strong>Substitution or preparation note:</strong> Prepping the garlic, ginger and broccoli while the water comes to the boil keeps this inside fifteen minutes.</p><p><strong>Allergen information:</strong> Contains egg, soya, molluscs, tree nuts and gluten. Oyster sauce formulations vary by brand, so check the specific jar for the full allergen list.</p></section>
<section><h3>4. Miso cod with veggie noodles</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/ecom/recipe/miso-cod-with-sesame-veggie-noodles">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Cod fillets, miso sauce, noodle-cut vegetable stir-fry, garlic, sesame seeds.</p><p><strong>Why it suits a weeknight:</strong> The fish goes under the grill while the noodles are stir-fried, so both finish together.</p><p><strong>Substitution or preparation note:</strong> This uses fresh cod rather than tinned or frozen fish, and miso sauce is not stocked in every UK supermarket, so check what is in before shopping around it.</p><p><strong>Allergen information:</strong> Contains fish, soya, sesame and gluten. Miso sauce recipes vary between brands, so check the label of the specific product used.</p></section>
<section><h3>5. Thai fried egg salad</h3><p><strong>Source:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/thai-fried-egg-salad-yum-kai-do/">delicious. magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes (5 min prep, 5 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Eggs, banana shallot, red chilli, garlic, lime juice, fish sauce, coriander.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner: fried eggs dressed with a sharp, salty sauce rather than the usual pasta or noodle base.</p><p><strong>Substitution or preparation note:</strong> The publisher suggests serving this with rice or a leafy salad, since on its own it is a lighter dinner.</p><p><strong>Allergen information:</strong> Contains egg and fish.</p></section>
<section><h3>6. Pesto eggs on toast</h3><p><strong>Source:</strong> <a href="https://realfood.tesco.com/recipes/pesto-eggs-on-toast.html">Tesco Real Food</a></p><p><strong>Total time and servings:</strong> 15 minutes, as stated by the publisher. Serves 2.</p><p><strong>Key ingredients:</strong> Eggs, sourdough bread, chestnut mushrooms, basil, garlic, green pesto.</p><p><strong>Why it suits a weeknight:</strong> Bread-based rather than pasta or rice, and a reasonable way to use half a jar of pesto sitting in the fridge.</p><p><strong>Substitution or preparation note:</strong> Two pans running at once (mushrooms and eggs) keep the timing tight; a grill can be used for the toast instead of a toaster.</p><p><strong>Allergen information:</strong> Contains egg and wheat. Shop-bought pesto typically contains milk and nuts; check the specific jar used.</p></section>
<section><h3>7. 10-minute couscous salad</h3><p><strong>Source:</strong> <a href="https://www.bbcgoodfood.com/recipes/10minute-couscous-salad">BBC Good Food</a></p><p><strong>Total time and servings:</strong> 10 minutes, no hob cooking. Serves 2.</p><p><strong>Key ingredients:</strong> Couscous, hot vegetable stock, spring onions, red pepper, cucumber, feta, pesto, pine nuts.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner with nothing on the hob: the couscous is simply covered in hot stock and left to absorb it.</p><p><strong>Substitution or preparation note:</strong> Swap the feta and pine nuts for whatever salad vegetables need using up.</p><p><strong>Allergen information:</strong> Contains milk (feta) and nuts (pine nuts). Shop-bought pesto may also contain nuts and milk; check the specific jar used.</p></section>
<section><h3>8. Indian chickpeas with poached eggs</h3><p><strong>Source:</strong> <a href="https://www.bbcgoodfood.com/recipes/indian-chickpeas-poached-eggs">BBC Good Food</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> A tin of chickpeas, yellow pepper, garlic, red chilli, spring onions, ground spices, tomatoes, eggs.</p><p><strong>Why it suits a weeknight:</strong> The chickpea mixture simmers while the eggs poach in a separate pan, so both steps run at once rather than one after the other.</p><p><strong>Substitution or preparation note:</strong> Crushing a few of the chickpeas with a fork thickens the mixture without needing a blender.</p><p><strong>Allergen information:</strong> Contains egg.</p></section>
<section><h3>9. Spaghetti with tuna, capers and chilli</h3><p><strong>Source:</strong> <a href="https://www.olivemagazine.com/recipes/fish-and-seafood/spaghetti-with-tuna-capers-and-chilli/">olive magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes, as stated by the publisher. Serves 4.</p><p><strong>Key ingredients:</strong> Spaghetti, red onion, red chilli, garlic, capers, flat-leaf parsley, lemon, tinned tuna in spring water, olive oil.</p><p><strong>Why it suits a weeknight:</strong> The spaghetti is the only thing that goes near the hob. Everything else is mixed in a bowl while it cooks.</p><p><strong>Substitution or preparation note:</strong> Makes four servings, so this is a good one to halve for a single dinner or keep whole for two dinners across the week.</p><p><strong>Allergen information:</strong> Contains fish and gluten.</p></section>
<section><h3>10. Tortellini in a pea broth</h3><p><strong>Source:</strong> <a href="https://www.olivemagazine.com/recipes/quick-and-easy/tortellini-in-a-pea-broth/">olive magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes, as stated by the publisher. Serves 2.</p><p><strong>Key ingredients:</strong> Stock, a pack of fresh tortellini, frozen peas, basil, lemon, parmesan to serve.</p><p><strong>Why it suits a weeknight:</strong> One pot: the tortellini cooks directly in the stock, with peas added for the final two minutes.</p><p><strong>Substitution or preparation note:</strong> The publisher's ingredient list specifies defrosted peas, not peas straight from frozen. This recipe is verified at ten minutes on that basis; using peas straight from the freezer has not been tested against the stated time, so defrost them ahead of cooking (in the fridge overnight, or in the microwave) if the ten-minute timing matters.</p><p><strong>Allergen information:</strong> Tortellini typically contains wheat and egg, and the filling may contain dairy or meat depending on the variety; check the specific pack used.</p></section>`;

export const FIFTEEN_MINUTE_DINNERS_CLOSING_HTML = `<section><h2>Making fifteen minutes realistic</h2><p>A few habits make the difference between a dinner that genuinely takes fifteen minutes and one that quietly takes twenty.</p><ul><li>Put the kettle on before doing anything else, for pasta, noodles or couscous.</li><li>Use frozen vegetables where a recipe suits them; they need no chopping and go straight into the pan.</li><li>Choose quick-cooking pasta or noodle shapes rather than those needing ten minutes or more.</li><li>Prepare ingredients in the order they are needed, not all at once before starting.</li><li>Use one pan where the recipe allows it, to cut down on washing up as well as time.</li><li>Check whether a step needs the oven preheated, and start that before anything else.</li></ul><p>None of this guarantees identical timing in every kitchen. A slower hob, a smaller pan or a less sharp knife will all add minutes that a recipe's stated time does not account for.</p><p>Several of these dinners use part of a tin, jar or pack. Follow the guidance on the packaging for storing what is left, including any use-by date once opened.</p></section>
<section><h2>When a fifteen-minute dinner may not suit</h2><p>Cooking for more than two people, an unfamiliar technique, a dietary substitution, or a recipe with more chopping than usual can all push a fifteen-minute dinner past its stated time. The dinners above are a starting point, not a guarantee, and the notes against each one flag where this is most likely.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><p>For dinners built around a single person's shopping, see <a href="/food-costs/cooking-for-one-without-waste">DinnerByDesign's guidance on cooking for one</a>. For a longer view of the week ahead, the <a href="/food-costs/five-dinners-same-ingredients">shared-ingredient guide</a> and <a href="/food-costs/portion-planning-and-food-waste">portion-planning guidance</a> can help you adjust choices to your household and what is already in the cupboard.</p></section>`;

export const FIFTEEN_MINUTE_DINNERS_SECTIONS: PublicGuideSection[] = [
  { rawHtml: FIFTEEN_MINUTE_DINNERS_OPENING_HTML },
  { rawHtml: FIFTEEN_MINUTE_DINNERS_ENTRIES_HTML },
  { rawHtml: FIFTEEN_MINUTE_DINNERS_CLOSING_HTML },
];

export const FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD: PublicGuideRecord = {
  id: 'fifteen-minute-dinners-everyday-supermarket-ingredients',
  slug: 'fifteen-minute-dinners-everyday-supermarket-ingredients',
  path: FIFTEEN_MINUTE_DINNERS_GUIDE_PATH,
  canonicalPath: FIFTEEN_MINUTE_DINNERS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...FIFTEEN_MINUTE_DINNERS_GUIDE,
  metaDescription: FIFTEEN_MINUTE_DINNERS_GUIDE.description,
  label: 'Practical cooking guide',
  internalLinks: FIFTEEN_MINUTE_DINNERS_GUIDE.internalLinks.filter(path => path !== '/recipes'),
  disclosureItems: FIFTEEN_MINUTE_DINNERS_DISCLOSURES,
  disclosureFooter: FIFTEEN_MINUTE_DINNERS_DISCLOSURE_FOOTER,
  sections: FIFTEEN_MINUTE_DINNERS_SECTIONS,
  sourcesTitle: 'Sources and further reading',
  cta: {
    title: 'Find a dinner for tonight',
    copy: 'Search DinnerByDesign by ingredient, time or dietary preference and turn a fifteen-minute idea into a plan for your household.',
    label: 'Find a dinner',
    href: '/signin',
  },
};
