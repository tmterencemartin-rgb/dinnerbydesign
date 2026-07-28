import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  FIVE_STAPLES_GUIDE_DISCLOSURES,
  FIVE_STAPLES_GUIDE_DISCLOSURE_FOOTER,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const FIVE_STAPLES_GUIDE_PATH = '/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses';

export const FIVE_STAPLES_GUIDE = {
  title: 'Five dinners built around potatoes, rice, pasta, bread and pulses',
  seoTitle: '5 dinners built around potatoes, rice, pasta, bread and pulses | DinnerByDesign',
  description: 'Five published recipes that put potatoes, rice, pasta, bread or pulses at the centre, with timings, servings, equipment, leftovers and pack-use notes.',
  publishedAt: '2026-07-28',
  reviewedAt: '2026-07-28',
  nextReviewAt: '2027-07-28',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find practical dinner ideas built around potatoes, rice, pasta, bread and pulses',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-28',
  editorialNotes: 'Compares five established publisher recipes without reproducing their methods or presenting undated price claims.',
  internalLinks: [
    '/recipes',
    '/food-costs/cooking-with-pulses-on-a-budget',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/five-dinners-same-ingredients',
    '/food-costs/cooking-for-one-without-waste',
    '/pricing-methodology',
    '/food-safety',
    '/recipe-methodology',
    '/signin',
  ],
  disclosures: [
    'price_comparison',
    'allergen_and_product',
    'storage_and_cooking',
    'source_timing',
  ] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Tesco Real Food: creamy leeks and chorizo sweet potatoes',
      url: 'https://realfood.tesco.com/recipes/creamy-leeks-and-chorizo-sweet-potatoes.html',
    },
    {
      label: 'Good Food: creamy tomato risotto',
      url: 'https://www.bbcgoodfood.com/recipes/creamy-tomato-risotto',
    },
    {
      label: 'delicious. magazine: speedy sun-dried tomato pasta',
      url: 'https://www.deliciousmagazine.co.uk/recipes/speedy-sun-dried-tomato-pasta/',
    },
    {
      label: 'Good Food: cherry tomato and ham bread and butter bake',
      url: 'https://www.bbcgoodfood.com/recipes/cherry-tomato-ham-bread-butter-bake',
    },
    {
      label: 'Tesco Real Food: coconut chickpea dumpling curry',
      url: 'https://realfood.tesco.com/recipes/coconut-chickpea-dumpling-curry.html',
    },
    {
      label: 'NHS: The Eatwell Guide',
      url: 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/',
    },
    {
      label: 'Food Standards Agency: Home food fact checker',
      url: 'https://www.gov.uk/government/publications/home-food-fact-checker',
    },
  ],
  faqs: [
    {
      question: 'Which dinner is fastest?',
      answer: 'The sun-dried tomato pasta is the fastest of the five. The publisher gives five minutes of preparation and eight to twelve minutes of cooking, depending on the pasta shape.',
    },
    {
      question: 'Which options serve four people?',
      answer: 'The creamy tomato risotto and the cherry tomato and ham bread bake both serve four as published. The other three serve two.',
    },
    {
      question: 'Which dinners contain no meat?',
      answer: 'The tomato risotto is vegetarian. The coconut chickpea dumpling curry is vegan. Check every pack and chosen substitute if allergens or a strict dietary requirement matter.',
    },
    {
      question: 'Can I swap in a wholegrain version?',
      answer: 'Sometimes, though wholewheat pasta, brown rice and different breads can change cooking time, liquid absorption and texture. Follow the publisher’s tested ingredient list or its stated substitution advice.',
    },
    {
      question: 'Is stale bread safe to use?',
      answer: 'Dry or stale bread can be used in the bake. Bread showing any mould should be discarded in full because growth can extend beyond the visible patch.',
    },
    {
      question: 'Is a staple-led dinner always less expensive?',
      answer: 'No. The full ingredient list, current prices and pack sizes decide the result. Add a price only when the source, date, servings and costing method can be shown beside it.',
    },
  ],
};

export const FIVE_STAPLES_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Potatoes, rice, pasta, bread and pulses can each carry a substantial dinner when the rest of the dish supplies enough flavour, moisture and variety. Pulses have an extra role because they also contribute protein and fibre. The cheapest option depends on the complete shopping list, pack sizes and current prices.</em></p></section>
<section><h2>Start with the ingredient that gives the dish its shape</h2><p>Dinner planning often starts with chicken, mince or fish. The potato, rice or pasta is picked afterwards, once the expensive part of the plate has already been decided. Starting with the staple changes the question. You begin with the ingredient that gives the dish its shape, then add only what it needs for flavour, moisture, vegetables and protein.</p><p>The five recipes below use familiar staples in distinct ways. Sweet potato becomes an edible shell. Risotto rice thickens its own sauce. Pasta carries a blended tomato dressing. Stale bread absorbs an egg and milk mixture. Chickpeas are shaped into dumplings, with brown rice alongside.</p><p>These are published recipes from Tesco Real Food, Good Food and delicious. magazine. Use the linked publisher page for the full ingredients, quantities and cooking method.</p></section>
<section><h2>The five dinners at a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Staple</th><th>Published recipe</th><th>Serves</th><th>Time</th><th>Main tools</th><th>Useful when</th></tr></thead><tbody><tr><td>Sweet potato</td><td>Creamy leeks and chorizo sweet potatoes</td><td>2</td><td>30 mins</td><td>Microwave and oven</td><td>A warm dinner for two</td></tr><tr><td>Rice</td><td>Creamy tomato risotto</td><td>4</td><td>40 mins</td><td>Hob</td><td>A meat-free family dinner</td></tr><tr><td>Pasta</td><td>Speedy sun-dried tomato pasta</td><td>2</td><td>About 15 mins</td><td>Hob and food processor</td><td>The quickest option</td></tr><tr><td>Bread</td><td>Cherry tomato and ham bread and butter bake</td><td>4</td><td>50 mins</td><td>Oven</td><td>Using stale bread</td></tr><tr><td>Chickpeas and rice</td><td>Coconut chickpea dumpling curry</td><td>2</td><td>45 mins</td><td>Hob and food processor</td><td>A vegan dinner for two</td></tr></tbody></table></div><p><em>Times and servings are taken from the linked publisher pages, checked 28 July 2026.</em></p></section>
<section><h2>Choose by the sort of evening you are having</h2><ul><li><strong>Short on time:</strong> the sun-dried tomato pasta takes about 15 minutes and serves two.</li><li><strong>Cooking for four:</strong> the tomato risotto and bread bake both serve four.</li><li><strong>Avoiding meat:</strong> the risotto is vegetarian and the chickpea curry is vegan as published.</li><li><strong>Using stale bread:</strong> the bread and butter bake turns four thick slices into the body of the dish.</li><li><strong>Planning tomorrow’s lunch:</strong> Tesco describes the chickpea curry leftovers as suitable for lunch the next day, provided the rice is cooled and stored safely.</li></ul></section>`;

export const FIVE_STAPLES_GUIDE_RECIPES_HTML = `<section><h2>1. Sweet potato: creamy leeks and chorizo sweet potatoes</h2><p><strong>Publisher:</strong> <a href="https://realfood.tesco.com/recipes/creamy-leeks-and-chorizo-sweet-potatoes.html">Tesco Real Food</a> · Serves 2 · 30 minutes</p><p><strong>Why the staple works:</strong> two large sweet potatoes form the base and the container. Microwaving softens the centres quickly, while a short spell in the oven gives the skins a firmer finish.</p><p><strong>What completes it:</strong> chorizo brings salt, spice and cooking fat. Leeks, garlic, crème fraîche, thyme and spinach turn those flavours into a filling rather than a separate sauce.</p><p><strong>Pack-use note:</strong> the published recipe calls for a 65g pack of diced chorizo. If the available pack is larger, plan the remainder for eggs, a tomato sauce or a second potato dinner before opening it.</p></section>
<section><h2>2. Rice: creamy tomato risotto</h2><p><strong>Publisher:</strong> <a href="https://www.bbcgoodfood.com/recipes/creamy-tomato-risotto">Good Food</a> · Serves 4 · 40 minutes</p><p><strong>Why the staple works:</strong> risotto rice absorbs the tomato-stock mixture a little at a time. Stirring releases starch, so the rice creates the creamy texture instead of sitting beneath a separate sauce.</p><p><strong>What completes it:</strong> chopped and fresh tomatoes give the dish body and sweetness. Rosemary, basil and parmesan supply the sharper flavours that plain rice would lack.</p><p><strong>Pack-use note:</strong> parmesan and fresh basil often outlast one recipe. Use the basil within the next few days, and keep the parmesan for pasta, soup or roasted vegetables.</p></section>
<section><h2>3. Pasta: speedy sun-dried tomato pasta</h2><p><strong>Publisher:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/speedy-sun-dried-tomato-pasta/">delicious. magazine</a> · Serves 2 · About 15 minutes</p><p><strong>Why the staple works:</strong> the sauce is blended while the pasta boils, so the two jobs happen at the same time. A little pasta water loosens the sauce and helps it coat the pasta before serving.</p><p><strong>What completes it:</strong> sun-dried tomatoes, cashews, parmesan, tomato purée and vegetable stock make a concentrated sauce. Basil and black pepper finish the dish without a long ingredient list.</p><p><strong>Pack-use note:</strong> a jar of sun-dried tomatoes usually covers more than one dinner. Keep the tomatoes under their oil and check the label for storage instructions after opening.</p></section>
<section><h2>4. Bread: cherry tomato and ham bread and butter bake</h2><p><strong>Publisher:</strong> <a href="https://www.bbcgoodfood.com/recipes/cherry-tomato-ham-bread-butter-bake">Good Food</a> · Serves 4 · 50 minutes</p><p><strong>Why the staple works:</strong> stale white bread absorbs seasoned egg and milk, then sets into the body of the bake. Bread that feels disappointing as a sandwich can work well here because dryness helps it take up the liquid.</p><p><strong>What completes it:</strong> ham, cheddar and eggs provide protein and richness. Cherry tomatoes add acidity and stop the bake from feeling too heavy.</p><p><strong>Pack-use note:</strong> plan the remaining ham and cheddar for sandwiches, baked potatoes or a second pasta dish rather than leaving two opened packs without a job.</p></section>
<section><h2>5. Pulses: coconut chickpea dumpling curry</h2><p><strong>Publisher:</strong> <a href="https://realfood.tesco.com/recipes/coconut-chickpea-dumpling-curry.html">Tesco Real Food</a> · Serves 2 · 45 minutes</p><p><strong>Why the staple works:</strong> the chickpeas are blended with onion, garlic, spice, flour and baking powder, then shaped into dumplings. They become the main texture of the curry instead of disappearing into the sauce. Brown rice provides the second staple.</p><p><strong>What completes it:</strong> chopped tomatoes, coconut milk, pepper and korma paste make a mild sauce. The recipe is vegan as published.</p><p><strong>Pack-use note:</strong> the recipe uses 200ml coconut milk, which may leave half of a standard 400ml tin. Freeze the remainder in a labelled portion if the pack permits, or use it promptly in soup, curry or porridge.</p></section>`;

export const FIVE_STAPLES_GUIDE_CLOSING_HTML = `<section><h2>How the five staples behave</h2><div class="guide-table-wrap"><table><thead><tr><th>Staple</th><th>Job in the dish</th><th>Planning point</th></tr></thead><tbody><tr><td>Potatoes</td><td>Hold a filling and provide most of the bulk</td><td>Store somewhere cool, dark and dry</td></tr><tr><td>Rice</td><td>Absorbs liquid or sits alongside a sauce</td><td>Cooked rice needs fast cooling and short refrigerated storage</td></tr><tr><td>Pasta</td><td>Carries a sauce and portions easily before cooking</td><td>Dry pasta is shelf-stable; opened sauce ingredients often need the plan</td></tr><tr><td>Bread</td><td>Absorbs liquid in a bake</td><td>Stale bread can be useful; mouldy bread must be discarded</td></tr><tr><td>Pulses</td><td>Add body, protein and fibre</td><td>Tinned pulses are quick; dried pulses need advance soaking or cooking where specified</td></tr></tbody></table></div></section>
<section><h2>A note on price and nutrition</h2><p>A staple-led dinner is not automatically the cheapest choice. Chorizo, parmesan, cashews or fresh herbs can change the cost quickly. A proper comparison needs a dated shopping basket, the retailer and region, the number of servings, and a clear split between full-pack checkout cost and the value of the quantity used.</p><p>The <a href="https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/">NHS Eatwell Guide</a> places starchy foods at just over a third of overall food intake and recommends higher-fibre or wholegrain versions where practical. That balance applies across a day or week. One dinner does not need to reproduce the whole guide.</p><p>Pulses sit across two useful roles in this article. Chickpeas contain carbohydrate, yet they also contribute protein and fibre. That gives the curry a different nutritional shape from a dish built mainly around potatoes, rice, pasta or bread.</p></section>
<section><h2>Leftovers and rice safety</h2><p>The Food Standards Agency says to cool cooked rice as quickly as possible, ideally within one hour, keep it refrigerated for no more than one day before reheating, and reheat it only once until steaming hot throughout. Read the <a href="https://www.gov.uk/government/publications/home-food-fact-checker">current official guidance</a>.</p><p>For the other dishes, follow the storage instructions on the publisher page and ingredient packs. Cool leftovers promptly and use them within the stated period.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/food-costs/cooking-with-pulses-on-a-budget">Cooking with pulses</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-costs/five-dinners-same-ingredients">Using complete packs across several dinners</a></li><li><a href="/food-costs/cooking-for-one-without-waste">Cooking for one</a></li><li><a href="/pricing-methodology">Pricing methodology</a></li></ul></section>`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function getFiveStaplesGuideJsonLd() {
  const guide = FIVE_STAPLES_GUIDE;
  const url = `https://dinnerbydesign.app${FIVE_STAPLES_GUIDE_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: guide.reviewedAt,
        author: { '@type': 'Organization', name: guide.editorialOwner },
        publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
        mainEntityOfPage: url,
        citation: guide.sources.map(source => source.url),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: guide.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Recipes and cooking ideas', item: 'https://dinnerbydesign.app/recipes' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}

export function renderFiveStaplesGuideInitialHtml() {
  const guide = FIVE_STAPLES_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FIVE_STAPLES_GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(FIVE_STAPLES_GUIDE_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/recipes">Recipes and cooking ideas</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 28 July 2026 · Last reviewed 28 July 2026</p><article>${FIVE_STAPLES_GUIDE_OPENING_HTML}${FIVE_STAPLES_GUIDE_RECIPES_HTML}${disclosures}${FIVE_STAPLES_GUIDE_CLOSING_HTML}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find a dinner for tonight</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and turn one of these staple-led ideas into a plan for your household.</p><p><a href="/signin">Find a dinner</a></p></section></main></div>`;
}
