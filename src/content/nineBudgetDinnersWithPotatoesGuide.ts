import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import { renderProgrammaticDisclosureFooterInitialHtml, renderProgrammaticDisclosuresInitialHtml } from './programmaticDisclosures';

export const NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH = '/guides/nine-budget-dinners-with-potatoes';

export const NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on budget wording', body: 'This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen.' },
  { key: 'storage_and_cooking', title: 'Storage and cooking safety', body: 'Cool, store and reheat cooked potato and other leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Fish, eggs, dairy, sausages, pesto, mustard, stock and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings.' },
];

export const NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE = {
  title: 'Nine budget dinners with potatoes',
  seoTitle: 'Nine budget dinners with potatoes | DinnerByDesign',
  description: 'Nine varied potato-led dinners from established recipe sources, with practical ideas for leftovers, cupboard ingredients and reducing waste.',
  publishedAt: '2026-08-09', reviewedAt: '2026-08-09', nextReviewAt: '2027-02-09',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find budget dinner ideas using potatoes', indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-09',
  editorialNotes: 'Nine source-led potato dinners that show how one bag can support varied cooking without treating potatoes as automatically the lowest-cost or superior staple.',
  internalLinks: ['/guides', '/recipes', '/guides/nine-budget-friendly-dinners-with-eggs', '/guides/nine-budget-dinners-with-tinned-vegetables', '/guides/nine-budget-dinners-built-around-bubble-and-squeak', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Spanish tortilla, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/spanish-tortilla' },
    { label: 'Dum aloo potato curry, Krumpli', url: 'https://www.krumpli.co.uk/dum-aloo-curry/' },
    { label: 'Sausage, onion and potato tray bake, Love Food Hate Waste', url: 'https://www.lovefoodhatewaste.com/foods-and-recipes/sausage-onion-and-potato-tray-bake' },
    { label: 'Pea & mint fishcakes, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/pea-mint-fishcakes' },
    { label: 'Bubble & squeak, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bubble-squeak' },
    { label: 'Leek and potato soup, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/leek-and-potato-soup?navref=quicklink' },
    { label: 'Gnocchi with creamy tomato & spinach sauce, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/10338/gnocchi-with-creamy-tomato-and-spinach-sauce' },
    { label: "Golden veggie shepherd's pie, BBC Good Food", url: 'https://www.bbcgoodfood.com/recipes/10035/golden-veggie-shepherds-pie' },
    { label: 'Potato hash with greens, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/potato-hash-with-greens' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Which potatoes work best for these dinners?', answer: 'Use the variety suggested by the source recipe where it specifies one. Otherwise, choose what is already in the cupboard and adapt the cooking time until the potato is tender.' },
    { question: 'Can leftover cooked potato be used in these dinners?', answer: 'Yes. Spanish tortilla, fishcakes, bubble and squeak, shepherd’s pie and hash are all useful places for cooked potato, provided it has been cooled and stored safely.' },
    { question: 'Can I use tinned potatoes?', answer: 'The dum aloo recipe specifically includes instructions for tinned new potatoes. They can be useful when peeling and boiling fresh potatoes is not practical.' },
    { question: 'Are potatoes always the lowest-cost staple?', answer: 'No. The best value depends on the shop, season, pack size and what is already at home. Potatoes are useful because one bag can take several different forms across the week.' },
  ],
};

interface GuideSection { title?: string; paragraphs: string[]; relatedLink?: { label: string; url: string }; }

export const NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_SECTIONS: GuideSection[] = [
  { paragraphs: [
    "Potatoes work well in cost-conscious cooking for practical reasons rather than any single one. A bag keeps for weeks in a cool, dark place, so it does not need using up in a hurry the way fresh vegetables often do. It combines easily with whatever else is around, whether that is a tin of something, a handful of frozen vegetables, a few eggs or the last of a joint of meat.",
    'None of that means potatoes are always the lowest-cost option, or that they are nutritionally superior to rice, pasta or other staples. A single bag can, though, support several genuinely different dinners across a week, particularly when it is paired with cupboard basics rather than served on its own.',
    'The nine dinners below are taken from established recipe publishers. Each uses potato differently: as the base of a curry, folded into a fry-up, layered under a pie, stirred into soup, or bound into cakes and dumplings.',
  ] },
  { title: '1. Spanish tortilla', paragraphs: [
    'A thick potato and onion omelette, cooked slowly until the base and edges are golden and the middle is just set, served warm or at room temperature. BBC Good Food lists it as serving four, with thirty minutes of preparation and fifty minutes of cooking.',
    'Potato is the bulk of the dish rather than a side. A pepper, leftover cooked vegetables or a handful of peas can go in with the onion, and cooked potato from an earlier dinner can reduce the preparation time.',
  ] },
  { title: '2. Dum aloo potato curry', paragraphs: [
    'Krumpli’s North Indian and Bangladeshi potato curry fries new potatoes in ghee, then simmers them in a spiced tomato gravy thickened with cashew nuts and finished with cream. It serves two and gives instructions for tinned new potatoes as well as fresh.',
    'Serve it with rice or flatbread when that suits the household. The sauce keeps for three to five days, making it a reasonable one to prepare ahead.',
  ] },
  { title: '3. Sausage, onion and potato tray bake', paragraphs: [
    'Love Food Hate Waste combines sausages, onion and thickly sliced new potatoes with oil, mustard and thyme, then roasts everything together in one tray. It serves four and takes forty minutes.',
    'Potatoes and onion make up most of the volume, allowing a modest number of sausages to cover the whole dish. The recipe notes that the potatoes need washing rather than peeling, and leftover portions should be refrigerated and reheated only once until piping hot.',
  ] },
  { title: '4. Pea and mint fishcakes', paragraphs: [
    'Flaked cooked fish is mixed with mashed potato, pea and mint pesto, spring onion and egg, shaped into cakes, coated in breadcrumbs and fried until golden. BBC Good Food’s version uses potato to give the fishcakes their bulk and hold them together.',
    'Frozen peas can stand in for fresh, and a small amount of leftover mash has a clear use here. Shape and chill the cakes in advance when that makes the evening easier.',
  ] },
  { title: '5. Bubble and squeak', paragraphs: [
    'Cold leftover mash fried with cabbage or sprouts, onion, garlic and a little bacon until crisp at the edges. BBC Good Food’s recipe serves four, with ten minutes of preparation and twenty minutes of cooking.',
    'A fried or poached egg on top makes it a fuller dinner. This is one of the most direct ways to use cooked potato and vegetables from a previous roast rather than letting them sit in the fridge without a plan.',
  ], relatedLink: { label: 'Nine budget dinners built around bubble and squeak', url: '/guides/nine-budget-dinners-built-around-bubble-and-squeak' } },
  { title: '6. Leek and potato soup', paragraphs: [
    'The Food Standards Agency recipe simmers leeks and potatoes in stock until soft, then seasons and serves the soup with crusty bread. It serves six, takes fifty minutes and is described by the FSA as a low-budget, hearty soup.',
    'Potato gives the soup body without requiring cream or flour. A leek or potato that looks a little tired but is still sound is suitable once it has been trimmed and cooked.',
  ] },
  { title: '7. Gnocchi with creamy tomato and spinach sauce', paragraphs: [
    'Potato gnocchi is tossed with a tomato and mascarpone sauce, with spinach wilted through at the end and Parmesan and basil to serve. BBC Good Food lists four servings, with ten minutes of preparation and ten minutes of cooking.',
    'It is a different potato format from the fry-ups and bakes above, closer to pasta. This is also a useful place for the end of a bag of spinach before it wilts beyond use.',
  ] },
  { title: "8. Golden veggie shepherd's pie", paragraphs: [
    'A filling of lentils, carrots, celery and mushrooms in a tomato and wine sauce, topped with mashed potato and grated cheddar, then baked until golden. The potato topping turns a pan of lentils and vegetables into a substantial dinner.',
    'The source recipe is designed for batch cooking and freezing in individual portions. Tinned green lentils can replace dried ones when the cooking time needs shortening, and the wine is optional.',
  ] },
  { title: '9. Potato hash with greens', paragraphs: [
    'Diced potato is fried with onion and pepper, seasoned with paprika and tarragon, finished with spinach and topped with a poached egg. BBC Good Food lists two servings, with ten minutes of preparation and forty minutes of cooking.',
    'A tin of beans can be stirred through to add bulk, although it is an adaptation rather than part of the published recipe. Poaching the eggs in the reserved potato water saves using a separate pan.',
  ] },
  { title: 'Storing potatoes and using leftovers', paragraphs: [
    'Keep raw potatoes somewhere cool, dark and well ventilated, rather than in the fridge. A cupboard or paper bag away from direct light works better than a plastic bag, which can trap moisture and speed up sprouting.',
    'Cool cooked potato promptly, cover it and refrigerate it. Eat leftovers within a couple of days and reheat them only once, until piping hot throughout. Check the Food Standards Agency guidance before using anything that has been in the fridge for more than a day or two.',
    'A bag of potatoes does not need to dictate a week of familiar dinners. It can turn up in a curry, soup, pie or fry-up, alongside whatever tinned, frozen or fresh ingredients happen to be around.',
  ], relatedLink: { label: 'Browse the guides library', url: '/guides' } },
];

export function getNineBudgetDinnersWithPotatoesGuideJsonLd() {
  const guide = NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE;
  const url = `https://dinnerbydesign.app${NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] },
  ] };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderNineBudgetDinnersWithPotatoesGuideInitialHtml() {
  const guide = NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURE_FOOTER);
  const sections = NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_SECTIONS.map(section => {
    const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
    const relatedLink = section.relatedLink ? `<p>Related guide: <a href="${escapeHtml(section.relatedLink.url)}">${escapeHtml(section.relatedLink.label)}</a></p>` : '';
    return `<section>${heading}${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${relatedLink}</section>`;
  }).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 9 August 2026 · Last reviewed 9 August 2026</p><article>${sections}${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find dinners for tonight</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.</p><p><a href="/signin">Find dinners</a></p></section></main></div>`;
}
