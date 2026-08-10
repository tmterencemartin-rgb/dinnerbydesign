import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  CONVENIENCE_FISH_GUIDE_DISCLOSURES,
  CONVENIENCE_FISH_GUIDE_DISCLOSURE_FOOTER,
} from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const CONVENIENCE_FISH_GUIDE_PATH = '/guides/fish-finger-fishcake-scampi-dinner-ideas';

export const CONVENIENCE_FISH_GUIDE = {
  title: 'How to turn fish fingers, fishcakes and scampi into better weeknight dinners',
  seoTitle: 'Fish finger, fishcake and scampi dinner ideas | DinnerByDesign',
  description: 'Practical ways to turn fish fingers, fishcakes, scampi, goujons and breaded fillets into varied weeknight dinners, with sides, pack-use ideas and label guidance.',
  publishedAt: '2026-07-28',
  reviewedAt: '2026-07-28',
  nextReviewAt: '2027-01-28',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find dinner ideas using fish fingers, fishcakes, scampi, goujons and breaded fillets',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-28',
  editorialNotes: 'Provides dinner formats without fixed product cooking times and distinguishes scampi from white fish.',
  internalLinks: [
    '/recipes',
    '/guides/how-to-build-a-traybake',
    '/guides/9-ways-with-sausages',
    '/food-costs/make-low-cost-dinners-more-interesting',
    '/food-costs/portion-planning-and-food-waste',
    '/food-safety',
    '/recipe-methodology',
    '/signin',
  ],
  disclosures: [
    'allergen_and_product',
    'storage_and_cooking',
    'source_timing',
  ] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'NHS: Fish and shellfish',
      url: 'https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/',
    },
    {
      label: 'Food Standards Agency: Allergen guidance for food businesses',
      url: 'https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses',
    },
    {
      label: 'Birds Eye: Cod fish fingers',
      url: 'https://www.birdseye.co.uk/range/frozen-fish/fish-fingers/26-cod-fish-fingers',
    },
    {
      label: 'Tesco: Cod fishcakes',
      url: 'https://www.tesco.com/shop/en-GB/products/291845420',
    },
    {
      label: 'Tesco: Haddock goujons',
      url: 'https://www.tesco.com/shop/en-GB/products/271284352',
    },
    {
      label: "Tesco: Young's breaded cod fillets",
      url: 'https://www.tesco.com/shop/en-GB/products/323156114',
    },
    {
      label: 'Whitby Seafoods: Wholetail scampi',
      url: 'https://www.whitby-seafoods.com/product/frozen/whole-tail-scampi-frozen-200g.html',
    },
    {
      label: 'Whitby Seafoods: Scampi FAQ',
      url: 'https://www.whitby-seafoods.com/faq/',
    },
    {
      label: 'Good Food: Fish finger recipes',
      url: 'https://www.bbcgoodfood.com/recipes/collection/fish-finger-recipes',
    },
    {
      label: 'Birds Eye: How to cook frozen fish',
      url: 'https://www.birdseye.co.uk/recipes/frozen-food-cooking-tips/how-to-cook-frozen-fish',
    },
  ],
  faqs: [
    {
      question: 'What can I serve with fish fingers instead of chips?',
      answer: 'Wraps, sandwiches and tacos all work well, adding vegetables and a simple sauce rather than a second helping of potato.',
    },
    {
      question: 'What vegetables go well with fishcakes?',
      answer: 'Greens, green beans, spinach and roasted tomatoes all pair well, particularly since many fishcakes already contain potato.',
    },
    {
      question: 'What can I make with frozen scampi?',
      answer: 'Tacos, rice bowls and lighter chip-shop-style plates all suit scampi, with slaw, peas or a lemon dressing alongside.',
    },
    {
      question: 'Do fishcakes need potatoes on the side?',
      answer: 'Not necessarily. Check the ingredient list first, since many fishcakes already contain a substantial amount of potato.',
    },
    {
      question: 'Is scampi fish or shellfish?',
      answer: 'Shellfish. Scampi is made from langoustine, a crustacean, rather than white fish. Some products use whole tails and others use formed pieces, so check the description on the pack.',
    },
    {
      question: 'Can fish fingers count as a portion of fish?',
      answer: 'Fish fingers contain fish, but whether a serving is equivalent to one NHS portion depends on the amount of fish in the product and how many are served. The NHS describes a portion as around 140g, so check the pack rather than relying on the number of fingers.',
    },
  ],
};

export const CONVENIENCE_FISH_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Fish fingers, fishcakes, scampi, goujons and breaded fillets can form the basis of more than a standard chips-and-peas dinner. Use them in wraps, burgers, rice bowls, traybakes or warm salads, with vegetables and a sauce that suits the coating.</em></p><p>Cooking instructions, seafood content, allergens and serving sizes vary between products and brands. This guide suggests formats and combinations rather than fixed timings. Always follow the instructions on the pack in front of you.</p></section>
<section><h2>Choose the product by the dinner you want</h2><p>Each product suits a slightly different style of dinner because of how it is made. A whole fillet in breadcrumbs behaves differently from a formed fishcake. Scampi is different again because it is shellfish. Start with the product in the freezer, then decide what sort of dinner it suits tonight.</p><div class="guide-table-wrap"><table><thead><tr><th>Product</th><th>Particularly useful for</th><th>Likely accompaniments</th><th>Watch for</th></tr></thead><tbody><tr><td>Fish fingers</td><td>Wraps, sandwiches and tacos</td><td>Peas, slaw, potatoes</td><td>Fish percentage and coating</td></tr><tr><td>Fishcakes</td><td>Warm salads and vegetable plates</td><td>Greens, beans, tomatoes</td><td>Some already contain substantial potato</td></tr><tr><td>Scampi</td><td>Tacos, rice bowls and lighter chip-shop plates</td><td>Slaw, peas, lemon</td><td>Crustacean; coating allergens vary</td></tr><tr><td>Goujons</td><td>Pittas, fajitas and sharing plates</td><td>Salad, corn, yogurt sauce</td><td>Whole fillet versus formed fish</td></tr><tr><td>Breaded fillets</td><td>Burgers and traybakes</td><td>Roasted vegetables, wedges</td><td>Pack cooking instructions</td></tr></tbody></table></div></section>`;

export const CONVENIENCE_FISH_GUIDE_IDEAS_HTML = `<section><h2>Fish finger dinner ideas</h2><p>Fish fingers are usually made from a whole or minced fillet in a crisp breadcrumb coating, which holds up well to being wrapped, layered or cut into pieces.</p><h3>Fish finger wraps with peas, shredded cabbage and yogurt sauce</h3><p>The soft wrap and crisp cabbage give the crumb coating something to contrast against, while a yogurt sauce adds moisture without needing a separate side. Peas can be served whole alongside or stirred through the cabbage.</p><h3>Fish finger sandwiches with lettuce, pickles and oven wedges</h3><p>A sandwich puts the coating's crunch front and centre, with pickles cutting through the richness and wedges covering the carbohydrate side of the plate.</p><h3>Fish finger tacos with sweetcorn, tomato and lime</h3><p>Warm tortillas, sweetcorn, chopped tomato and a squeeze of lime turn the same fish fingers into a dinner built around fresh, acidic flavours.</p></section>
<section><h2>What to serve with fishcakes</h2><p>Many fishcakes already contain a substantial amount of potato. Checking the ingredient list first makes it easier to decide what the dinner needs.</p><h3>Fishcakes with garlicky greens and butter beans</h3><p>Butter beans add bulk and a little protein alongside the fishcake, while quickly cooked greens keep the plate from feeling one-note.</p><h3>Fishcakes with roasted tomatoes, green beans and mustard dressing</h3><p>Roasting concentrates the tomatoes, while mustard dressing adds the sharpness that a fishcake alone may lack.</p><h3>Fishcakes with peas, spinach and a soft egg</h3><p>A soft egg adds richness and turns the plate towards a light, warm salad rather than a traditional fish-and-two-veg dinner.</p></section>
<section><h2>Scampi beyond chips</h2><p>Scampi is made from langoustine, a crustacean, and may use whole tails or formed pieces depending on the product. Its coating already brings richness, salt and crunch, so straightforward accompaniments tend to work well.</p><h3>Scampi tacos with cabbage slaw</h3><p>Crisp slaw adds crunch and acidity without extra cooking.</p><h3>Scampi rice bowls with peas, cucumber and lemon dressing</h3><p>Rice gives the dinner some structure, while cucumber and lemon dressing keep the combination fresh.</p><h3>Scampi with crushed potatoes, green beans and tartare-style yogurt</h3><p>A yogurt-based tartare-style sauce keeps the familiar pairing, while crushed potatoes and green beans give the plate contrast without repeating the standard chips.</p></section>
<section><h2>Goujons and breaded fillets</h2><p>Goujons are strips of fish, whether cut from a fillet or made from formed fish, while breaded fillets are larger pieces. Check the pack for the product's cooking method and timing before building the rest of the dinner around it.</p><h3>Goujon pittas with salad and garlic yogurt</h3><p>Goujons tuck neatly into a warm pitta alongside salad and garlic yogurt.</p><h3>Breaded fish burgers with slaw and wedges</h3><p>A bun and slaw turn a breaded fillet into a burger-style dinner, with wedges covering the carbohydrate element.</p><h3>A tray of breaded fillets, tomatoes, peppers and potatoes</h3><p>These can share a tray only when the pack instructions support the same oven setting and allow everything to cook safely. If the timings differ, start the vegetables separately and add the fish at the point indicated by its pack instructions.</p></section>`;

export const CONVENIENCE_FISH_GUIDE_CLOSING_HTML = `<section><h2>Make the plate feel complete</h2><p>The same reusable formula works across all five products.</p><ol><li>Choose the fish or shellfish product.</li><li>Add one carbohydrate if the product does not already contain much potato.</li><li>Add one or two vegetables.</li><li>Finish with acidity or a simple sauce.</li></ol><p>Lemon juice, malt vinegar, pickles, yogurt and herbs, mustard dressing, tartare sauce or tomato salsa can finish the plate.</p></section>
<section><h2>Using up opened packs</h2><ul><li>Shredded cabbage can serve tacos, wraps and slaw.</li><li>Frozen peas can accompany fishcakes or be crushed for sandwiches.</li><li>Wraps can become pittas or flatbreads in another dinner.</li><li>Yogurt can form the base of a garlic, herb or mustard sauce.</li><li>Remaining potatoes can become wedges, crushed potatoes or a traybake base.</li></ul><p>None of this guarantees a lower cost. A genuine saving would need current, dated prices and a transparent calculation.</p></section>
<section><h2>Nutrition and product differences</h2><p>Breaded fish, fishcakes and scampi vary in seafood content, coating, salt, fat and serving size. Check the current label rather than assuming. Products made with cod, haddock or pollock are white fish and do not replace the recommended oily-fish portion.</p><p>Current <a href="https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/">NHS guidance</a> recommends at least two portions of fish a week, including one portion of oily fish. It describes a portion as around 140g. Fresh and canned tuna do not count as oily fish; neither do products based on white fish such as cod, haddock or pollock.</p><p>Individual products should not be labelled healthy or unhealthy without comparing their current nutrition panels. Formulations vary, so use the serving information and ingredients on the current pack.</p></section>
<section><h2>Allergens and safety</h2><ul><li>Scampi is made from langoustine and is a crustacean product, rather than white fish.</li><li>Coatings may contain wheat, egg or milk.</li><li>Fishcakes and sauces may contain additional allergens.</li><li>Ingredients differ between brands, so check the current pack.</li><li>Follow the pack's cooking, storage and reheating instructions.</li><li>Check that the centre is thoroughly cooked before serving.</li></ul><p>Fish, crustaceans and molluscs are separate regulated allergen categories. The <a href="https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses">Food Standards Agency guidance</a> lists the 14 allergens that must be declared when used as ingredients. Anyone with a diagnosed allergy should check the label every time and follow advice from their clinician.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/guides/how-to-build-a-traybake">How to build a traybake</a></li><li><a href="/guides/9-ways-with-sausages">Nine ways with sausages</a></li><li><a href="/food-costs/make-low-cost-dinners-more-interesting">Making low-cost dinners more interesting</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-safety">Food-safety guidance</a></li></ul></section>`;

export const CONVENIENCE_FISH_GUIDE_SECTIONS: PublicGuideSection[] = [
  { rawHtml: CONVENIENCE_FISH_GUIDE_OPENING_HTML },
  { rawHtml: CONVENIENCE_FISH_GUIDE_IDEAS_HTML },
  { rawHtml: CONVENIENCE_FISH_GUIDE_CLOSING_HTML },
];

export const CONVENIENCE_FISH_GUIDE_RECORD: PublicGuideRecord = {
  id: 'fish-finger-fishcake-scampi-dinner-ideas',
  slug: 'fish-finger-fishcake-scampi-dinner-ideas',
  path: CONVENIENCE_FISH_GUIDE_PATH,
  canonicalPath: CONVENIENCE_FISH_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...CONVENIENCE_FISH_GUIDE,
  metaDescription: CONVENIENCE_FISH_GUIDE.description,
  label: 'Practical cooking guide',
  internalLinks: CONVENIENCE_FISH_GUIDE.internalLinks.filter(path => path !== '/recipes'),
  disclosureItems: CONVENIENCE_FISH_GUIDE_DISCLOSURES,
  disclosureFooter: CONVENIENCE_FISH_GUIDE_DISCLOSURE_FOOTER,
  sections: CONVENIENCE_FISH_GUIDE_SECTIONS,
  cta: {
    title: 'Find more dinner ideas',
    copy: 'Search DinnerByDesign for ideas built around what is already in the freezer or fridge.',
    label: 'Find a dinner',
    href: '/signin',
  },
};
