import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import { renderProgrammaticDisclosureFooterInitialHtml, renderProgrammaticDisclosuresInitialHtml } from './programmaticDisclosures';

export const NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH = '/guides/nine-budget-dinners-with-rice';

export const NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on budget wording', body: 'This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen.' },
  { key: 'storage_and_cooking', title: 'Storage and cooking safety', body: 'Cool, store and reheat cooked rice and other leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Fish, eggs, dairy, stock, pesto, mustard, coconut products and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings.' },
];

export const NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const NINE_BUDGET_DINNERS_WITH_RICE_GUIDE = {
  title: 'Nine budget dinners with rice', seoTitle: 'Nine budget dinners with rice | DinnerByDesign',
  description: 'Nine varied rice-led dinners from established recipe sources, with practical ideas for leftovers, cupboard ingredients and reducing waste.',
  publishedAt: '2026-08-09', reviewedAt: '2026-08-09', nextReviewAt: '2027-02-09',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Practical cooking guide', primarySearchIntent: 'Find budget dinner ideas using rice', indexingStatus: 'index' as const, contentReviewedAt: '2026-08-09',
  editorialNotes: 'Nine source-led rice dinners that show how one cupboard staple can support varied cooking without treating rice as automatically the lowest-cost or superior staple.',
  internalLinks: ['/guides', '/recipes', '/guides/nine-budget-friendly-dinners-with-eggs', '/guides/nine-budget-dinners-with-tinned-vegetables', '/guides/nine-budget-dinners-three-cuisines', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Easy egg-fried rice, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/egg-fried-rice' },
    { label: 'Tomato & chickpea curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry' },
    { label: 'Zesty lentil & haddock pilaf, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/zesty-lentil-haddock-pilaf' },
    { label: 'Next level kedgeree, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/next-level-kedgeree' },
    { label: 'Mushroom risotto, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/mushroom-risotto' },
    { label: 'Vegetable & bean chilli, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli' },
    { label: 'Smoky spiced jollof rice & coconut-fried plantain, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/smoky-spiced-jollof-rice-coconut-fried-plantain' },
    { label: 'Stuffed peppers with rice, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/easy-stuffed-peppers' },
    { label: 'Cauliflower baked rice, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/cauliflower-baked-rice' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Can I use leftover rice for these dinners?', answer: 'Egg-fried rice and stuffed peppers are useful options for properly cooled and refrigerated cooked rice. Follow Food Standards Agency guidance before using leftovers.' },
    { question: 'Which rice should I buy?', answer: 'Use the type named by the source recipe. Basmati, easy-cook, risotto rice and ready-cooked pouches behave differently, so swapping them can change the result.' },
    { question: 'Does rice always make a dinner low cost?', answer: 'No. The cost depends on the other ingredients, pack size and what is already at home. Rice is useful because it can take many different forms across the week.' },
    { question: 'Can rice be used beyond curries and stir-fries?', answer: 'Yes. This guide includes pilaf, kedgeree, risotto, chilli, jollof rice, stuffed peppers and a baked rice dish.' },
  ],
};

interface GuideSection { title?: string; paragraphs: string[]; relatedLink?: { label: string; url: string }; }

export const NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_SECTIONS: GuideSection[] = [
  { paragraphs: [
    "A bag of rice keeps for months in the cupboard, which makes it a sensible thing to have in whether or not there is a specific dinner planned around it. It works with vegetables, eggs, beans, fish and small amounts of meat, and it moves easily between cuisines, from a curry to a risotto to a stir-fry.",
    'Rice is not always the lowest-cost staple, or nutritionally better than pasta, potatoes or bread. A single bag can still support a varied run of dinners, particularly when it is paired with whatever else is already in the cupboard, fridge or freezer that week.',
    'Cooked rice needs careful handling. Check the Food Standards Agency guidance before building a dinner around rice that has been in the fridge for a day or two.',
  ] },
  { title: '1. Easy egg-fried rice', paragraphs: ['A stir-fry of rice, egg, onion and spring onion, seasoned to taste. BBC Good Food lists four servings, with ten minutes of preparation and ten minutes of cooking.', 'Cold, day-old rice fries well, making this a direct use for a rice-based leftover. Frozen peas, sweetcorn or diced carrot are useful additions when vegetables need using.'] },
  { title: '2. Tomato and chickpea curry', paragraphs: ['Chickpeas warmed in a spiced tomato and coconut sauce, served with rice. It serves four, with ten minutes of preparation and forty-five minutes of cooking.', 'Rice turns a tinned-ingredient sauce into dinner. The sauce freezes well on its own, so it can be paired with freshly cooked rice on a different night.'] },
  { title: '3. Zesty lentil and haddock pilaf', paragraphs: ['Rice and lentils are folded through with flaked smoked haddock, lemon zest and parsley, then topped with almonds and crisp fried onions. It serves four, with four minutes of preparation and sixteen minutes of cooking.', 'Rice and lentils give the dish its bulk, so a modest amount of fish goes a long way. The almonds can be left out and another smoked or white fish can be used instead.'] },
  { title: '4. Next level kedgeree', paragraphs: ['Smoked haddock in a curried, cream-enriched sauce, stirred through rice and topped with a poached egg, coriander and garam masala. It serves four, with thirty minutes of preparation and forty-five minutes of cooking.', 'The sauce can be made a day ahead and kept chilled for up to two days, then reheated with freshly cooked rice. Frozen peas are an optional addition in the source recipe.'] },
  { title: '5. Mushroom risotto', paragraphs: ['Arborio rice is cooked with stock made from soaked dried mushrooms, fresh mushrooms, butter and cheese until creamy and tender. It serves four, with five minutes of preparation and twenty-five minutes of cooking, plus soaking.', 'This is the dinner where the rice itself does most of the work. The source suggests chicken, roasted pumpkin or butternut squash as ways to vary it.'] },
  { title: '6. Vegetable and bean chilli with rice', paragraphs: ['A chilli of courgette, peppers, red lentils, tomatoes, sweetcorn and butter beans, served with rice. It serves four, with ten minutes of preparation and thirty-five minutes of cooking.', 'Rice gives the chilli a useful base, and the sauce freezes well for another dinner. Tinned beans and whatever vegetables need using can keep it flexible.'] },
  { title: '7. Smoky spiced jollof rice', paragraphs: ['Rice cooks in a smoky blended tomato and pepper sauce and is served with coconut-fried plantain. It serves six, with ten minutes of preparation and forty minutes of cooking.', 'The source recipe freezes half the tomato and pepper mix for a future dinner, which makes the next batch simpler to prepare.'] },
  { title: '8. Stuffed peppers with rice', paragraphs: ['Peppers are softened in the microwave, then filled with ready-cooked rice, pesto, olives and goat’s cheese before cooking again until hot. It serves four, with five minutes of preparation and ten minutes of cooking.', 'The recipe uses ready-cooked rice pouches as a cupboard standby. Properly cooled leftover rice can be used instead, and another soft cheese can replace goat’s cheese.'] },
  { title: '9. Cauliflower baked rice', paragraphs: ['Rice bakes under foil with cauliflower, onion, dried fruit and boiling water until tender, then is finished with feta, olives and herbs. It serves six to eight, with fifteen minutes of preparation and forty-five minutes of cooking.', 'The rice cooks directly in the oven rather than being boiled separately, making this the only baked rice dinner on the list. Broccoli or leeks can stand in for some of the cauliflower.'] },
  { title: 'Using rice across the week', paragraphs: [
    'There is no need to cook a large pan of rice and work through it without a plan. Cook a fresh batch for one dinner, such as the tomato and chickpea curry, then use properly cooled and refrigerated rice in egg-fried rice or stuffed peppers later in the week.',
    'A limited shop does not have to mean a repetitive one. Rice can become a curry, risotto, stuffed pepper, smoky one-pot dish or a bake, each with a different flavour and texture.',
  ], relatedLink: { label: 'Browse the guides library', url: '/guides' } },
];

export function getNineBudgetDinnersWithRiceGuideJsonLd() {
  const guide = NINE_BUDGET_DINNERS_WITH_RICE_GUIDE;
  const url = `https://dinnerbydesign.app${NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] },
  ] };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderNineBudgetDinnersWithRiceGuideInitialHtml() {
  const guide = NINE_BUDGET_DINNERS_WITH_RICE_GUIDE;
  const sections = NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_SECTIONS.map(section => `<section>${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ''}${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.relatedLink ? `<p>Related guide: <a href="${escapeHtml(section.relatedLink.url)}">${escapeHtml(section.relatedLink.label)}</a></p>` : ''}</section>`).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 9 August 2026 · Last reviewed 9 August 2026</p><article>${sections}${renderProgrammaticDisclosuresInitialHtml(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURES)}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${renderProgrammaticDisclosureFooterInitialHtml(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURE_FOOTER)}</article><section><h2>Find dinners for tonight</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.</p><p><a href="/signin">Find dinners</a></p></section></main></div>`;
}
