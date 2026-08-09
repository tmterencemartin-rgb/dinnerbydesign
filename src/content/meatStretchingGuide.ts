import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import { renderProgrammaticDisclosureFooterInitialHtml, renderProgrammaticDisclosuresInitialHtml } from './programmaticDisclosures';

export const MEAT_STRETCHING_GUIDE_PATH = '/guides/seven-ways-to-make-meat-go-further';

export const MEAT_STRETCHING_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on budget wording', body: 'This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen.' },
  { key: 'storage_and_cooking', title: 'Storage and cooking safety', body: 'Cook meat, pulses and leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Beans, lentils, sausages, stock, dairy, pasta, pesto and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings.' },
];

export const MEAT_STRETCHING_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const MEAT_STRETCHING_GUIDE = {
  title: 'Seven ways to make meat go further with beans, lentils and mushrooms',
  seoTitle: 'Seven ways to make meat go further | DinnerByDesign',
  description: 'Seven familiar dinners showing how beans, lentils and mushrooms can make a smaller amount of meat go further without making dinner feel like a compromise.',
  publishedAt: '2026-08-09', reviewedAt: '2026-08-09', nextReviewAt: '2027-02-09',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Ways to make meat go further with beans, lentils and mushrooms', indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-09',
  editorialNotes: 'Seven source-led dinners that distinguish published recipe methods from practical, clearly labelled adaptations.',
  internalLinks: ['/guides', '/recipes', '/guides/9-budget-dinners-with-beef-or-pork-mince', '/guides/nine-budget-dinners-with-tinned-vegetables', '/guides/nine-budget-dinners-with-rice', '/guides/cooking-with-pulses-on-a-budget', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Chilli con carne, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe' },
    { label: 'Cottage pie, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/775643/cottage-pie' },
    { label: 'Bean & sausage hotpot, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot' },
    { label: 'Fragrant chicken curry with chick peas, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/fragrant-chicken-curry-chick-peas' },
    { label: 'Spaghetti Bolognese, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/spaghetti-bolognese' },
    { label: 'Bacon & mushroom pasta, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bacon-mushroom-pasta' },
    { label: 'Beef meatballs with tomato sauce, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/beef-meatballs-with-tomato-sauce' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Can I replace all the meat with beans or lentils?', answer: 'You can, but this guide is about making a smaller amount of meat cover more dinners. Start by replacing some of the meat, then adjust the seasoning and texture to suit the dish.' },
    { question: 'Which lentils work best?', answer: 'Green and brown lentils hold their shape in pies and sauces. Red lentils soften more, which suits chilli and tomato-based sauces.' },
    { question: 'Do tinned beans need cooking first?', answer: 'Tinned beans are already cooked. Drain and rinse them where the label suggests, then warm them through in the sauce or hotpot.' },
    { question: 'Will mushrooms make a mince dish watery?', answer: 'Finely chop them and cook them first so their moisture cooks away before they go into the sauce or filling.' },
  ],
};

interface GuideSection { title?: string; paragraphs: string[]; relatedLink?: { label: string; url: string }; }

export const MEAT_STRETCHING_GUIDE_SECTIONS: GuideSection[] = [
  { paragraphs: [
    'A pack of mince, a few sausages or chicken left over from a roast does not always stretch to a full dinner for the whole household on its own. Beans, lentils and mushrooms are a practical way to close that gap without turning dinner into something unfamiliar or making it feel like a compromise.',
    'Some of these dinners already include beans, lentils or mushrooms in the published recipe. Others are familiar meat-led dishes with a suggested addition. Those are clearly marked as adaptations, rather than presented as the publisher\'s own method.',
  ] },
  { title: '1. Chilli con carne, with beans doing the bulk of the work', paragraphs: [
    'BBC Good Food\'s chilli con carne combines minced beef with red kidney beans in a spiced tomato sauce. The beans are part of the recipe as written, and make up a substantial share of each serving alongside the mince.',
    'Adaptation: a handful of dried red lentils, added with the tomatoes and given time to soften, can bulk the chilli out further and thicken the sauce. This is not part of the original recipe.',
  ] },
  { title: '2. Cottage pie, stretched with lentils and mushrooms', paragraphs: [
    'BBC Good Food\'s cottage pie is a mince filling with onion, carrot and celery in a stock-based gravy, topped with potato mash and baked until golden.',
    'Adaptation: some of the mince can be replaced with cooked green or brown lentils and finely chopped mushrooms. Cook the mushrooms first, then add them to the filling. This substitution is not part of the original recipe.',
  ] },
  { title: '3. Sausage and bean hotpot', paragraphs: [
    'BBC Good Food\'s bean and sausage hotpot browns sausages, then simmers them in tomato sauce with butter beans, mustard and a little treacle or sugar. It serves four, with five minutes of preparation and forty minutes of cooking.',
    'Butter beans and the sauce carry most of the dish, so a modest number of sausages is enough to cover four. A second tin of beans can make the pot go further, or use another tinned bean in place of butter beans.',
  ] },
  { title: '4. Fragrant chicken curry with chickpeas', paragraphs: [
    'Chicken simmers in a spiced sauce, with chickpeas and coriander stirred through near the end. BBC Good Food lists four servings, with thirty to forty minutes of preparation and thirty minutes of cooking.',
    'The chickpeas are part of the source recipe. A smaller amount of chicken can still make a full dinner once the sauce and chickpeas are taken into account. Another tinned pulse can stand in for chickpeas.',
  ] },
  { title: '5. Spaghetti Bolognese, built with mushrooms', paragraphs: [
    'The Food Standards Agency version combines beef mince with onion, garlic, tomatoes, mushrooms, pepper, carrot and courgette, served over spaghetti. It serves two and takes fifty minutes.',
    'Mushrooms are part of the recipe as written, giving the sauce texture beyond the mince. Adaptation: dried red lentils added with the tomatoes soften into the sauce and make it go further. This is not part of the original recipe.',
  ] },
  { title: '6. Bacon and mushroom pasta, with beans added', paragraphs: [
    'BBC Good Food\'s bacon and mushroom pasta fries bacon and mushrooms until golden, then tosses them with pasta, pesto and creme fraiche. It is ready in under thirty minutes.',
    'The mushrooms are already doing useful work in the dish. Adaptation: stir in a drained tin of cannellini or borlotti beans once the pasta and sauce are combined to add bulk without needing more bacon.',
  ] },
  { title: '7. Beef meatballs with mushrooms and tomato sauce', paragraphs: [
    'The Food Standards Agency recipe makes lean beef meatballs, then simmers them in tomato sauce with mushrooms and peppers. It serves four and takes one hour and five minutes.',
    'The mushrooms are part of the source recipe, helping the sauce go further. Adaptation: a small amount of cooked, well-drained lentils or finely grated mushroom can be worked into the meatball mixture to use less mince per meatball. This is not part of the original recipe.',
  ] },
  { title: 'Choosing the right addition', paragraphs: [
    'Lentils suit saucy mince dishes and pies, where they soften into the sauce. Beans suit chilli, stews and sausage dinners, where they hold their shape. Mushrooms work well in sauces, pies and pasta dishes, where their savouriness fits naturally with the meat.',
    'Using less meat in a dinner does not mean less flavour or less variety. Chilli, curry, pasta, pie and hotpot can all still taste like themselves while leaving a little more room in the weekly shop.',
  ], relatedLink: { label: 'Browse the guides library', url: '/guides' } },
];

export function getMeatStretchingGuideJsonLd() {
  const guide = MEAT_STRETCHING_GUIDE;
  const url = `https://dinnerbydesign.app${MEAT_STRETCHING_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] },
  ] };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderMeatStretchingGuideInitialHtml() {
  const guide = MEAT_STRETCHING_GUIDE;
  const sections = MEAT_STRETCHING_GUIDE_SECTIONS.map(section => `<section>${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ''}${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.relatedLink ? `<p>Related guide: <a href="${escapeHtml(section.relatedLink.url)}">${escapeHtml(section.relatedLink.label)}</a></p>` : ''}</section>`).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 9 August 2026 · Last reviewed 9 August 2026</p><article>${sections}${renderProgrammaticDisclosuresInitialHtml(MEAT_STRETCHING_GUIDE_DISCLOSURES)}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${renderProgrammaticDisclosureFooterInitialHtml(MEAT_STRETCHING_GUIDE_DISCLOSURE_FOOTER)}</article><section><h2>Find dinners for tonight</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.</p><p><a href="/signin">Find dinners</a></p></section></main></div>`;
}
