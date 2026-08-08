import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import { renderProgrammaticDisclosureFooterInitialHtml, renderProgrammaticDisclosuresInitialHtml } from './programmaticDisclosures';

export const WHOLE_CHICKEN_VALUE_GUIDE_PATH = '/guides/is-a-whole-chicken-better-value-than-chicken-pieces';

export const WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on value', body: 'This guide does not use live retailer prices or promise a fixed saving. Compare the current price per kilogram, what you will use and any storage you need before deciding.' },
  { key: 'storage_and_cooking', title: 'Raw chicken and storage', body: 'Follow the product label, use-by date and current Food Standards Agency guidance when handling, freezing, defrosting and cooking chicken.' },
  { key: 'source_timing', title: 'Source review', body: 'The jointing and food-safety sources were checked on 8 August 2026. Follow the linked publisher or Food Standards Agency page for later updates.' },
];

export const WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide explains a shopping and cooking choice. Chicken size, price, storage space and the parts your household will use all vary.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const WHOLE_CHICKEN_VALUE_GUIDE = {
  title: 'Is a whole chicken better value than chicken pieces?',
  seoTitle: 'Is a Whole Chicken Better Value Than Chicken Pieces? | DinnerByDesign',
  description: 'A practical guide to comparing a whole chicken with chicken pieces, including how to use the cuts, whether to joint it and when pre-cut chicken makes more sense.',
  publishedAt: '2026-08-08', reviewedAt: '2026-08-08', nextReviewAt: '2027-08-08',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Food cost guide',
  primarySearchIntent: 'Decide whether a whole chicken is better value than chicken pieces', indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-08',
  editorialNotes: 'A source-led buying guide that distinguishes whole-chicken planning from using leftover roast chicken.',
  internalLinks: ['/guides', '/recipes', '/guides/9-budget-dinners-with-leftover-roast-chicken', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'How to joint a raw chicken, BBC Good Food', url: 'https://www.bbcgoodfood.com/videos/techniques/how-joint-raw-chicken-video' },
    { label: "JFC Jamie's fried chicken, Jamie Oliver", url: 'https://www.jamieoliver.com/recipes/chicken/jfc-jamie-s-fried-chicken/' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Is a whole chicken always cheaper than chicken pieces?', answer: 'No. A whole chicken can offer good value when its cuts and carcass will be used, but current prices, freezer space and the parts your household prefers all matter.' },
    { question: 'Do I need to joint a whole chicken?', answer: 'No. Roasting it whole and dividing the cooked meat afterwards can work just as well. Jointing is useful when different cuts will be cooked in different dinners.' },
    { question: 'What can I do with a chicken carcass?', answer: 'Use it to make stock or soup if that fits your cooking. If it will not be used, include that honestly when deciding whether a whole chicken represents value.' },
    { question: 'When are chicken pieces the better choice?', answer: 'Pieces can make more sense for cooking for one, limited freezer space, a dinner needing one particular cut, or anyone who would rather not handle a whole raw bird.' },
  ],
};

interface GuideSection {
  title?: string;
  paragraphs: string[];
  relatedLink?: { label: string; url: string };
}

export const WHOLE_CHICKEN_VALUE_GUIDE_SECTIONS: GuideSection[] = [
  { paragraphs: [
    "Stand at the chicken counter for long enough and the choice repeats itself every week: a whole bird sitting next to trays of breasts, thighs and drumsticks, sometimes at a lower price per kilogram but asking more of you in return. It's tempting to treat the whole chicken as the automatically cheaper option, but that only holds if the price per kilogram and the portions you'll actually use both stack up. A whole bird that ends up half-used in the freezer isn't better value than a tray of thighs bought for a specific dinner and eaten in full.",
    "The short answer is that a whole chicken can offer good value, but only when it's used across more than one dinner. That depends less on the price tag and more on storage space, freezer habits and whether jointing or roasting a whole bird is something the household is willing to do.",
  ] },
  { title: 'What a whole chicken gives you', paragraphs: [
    'A typical whole chicken breaks down into two breasts, two thighs, two drumsticks, two wings and a carcass useful for stock or soup. The exact size and number of portions varies by bird and by how it is divided.',
    'Buying pieces means paying for exactly the cut wanted and nothing else. Buying whole means paying for all of it at once, including parts that take more planning to use well, such as the carcass and wings. Whether that is a good trade depends on what happens to those parts after the shop.',
    'Bird sizes vary enough that it is worth checking the weight on the label rather than assuming. A smaller chicken suits a household eating lightly or wanting less to store; a larger one gives more scope for splitting across dinners, provided there is freezer space to match.',
  ] },
  { title: 'Three ways to use it', paragraphs: [
    'There is no fixed plan, and a single chicken will not stretch to a guaranteed number of dinners in every household. These are examples of how the different parts tend to get used rather than a formula.',
    'Roast the whole bird with vegetables for one dinner, then carve and store whatever is not eaten. Use cooked shredded meat from a roast, or raw breast and thigh meat cooked separately, in a dinner built around rice, pasta or a curry-style sauce later in the week. Simmer the carcass and any smaller scraps into stock, soup or a casserole.',
    'Some households get three distinct dinners out of one chicken this way; others get two, or one dinner plus stock in the freezer for later. What matters more than the exact count is whether the parts get used within a sensible timeframe rather than sitting at the back of the freezer indefinitely.',
  ] },
  { title: 'Roast whole or joint it first?', paragraphs: [
    'Roasting the bird whole is the simplest approach: cook it, carve it, and divide or freeze whatever is not eaten straight away. This suits anyone who wants one dinner now and does not mind sorting the rest afterwards.',
    'Jointing before cooking gives more flexibility, as breasts, thighs, drumsticks and wings can be used in different dinners across the week. It does mean handling raw poultry directly, which some people would rather avoid.',
    'Jointing is entirely optional. For anyone who does want to learn, BBC Good Food has a video guide and Jamie Oliver includes step-by-step jointing tips in the linked chicken recipe below.',
  ] },
  { title: 'Handling, freezing and cooking chicken', paragraphs: [
    'Keep raw chicken and its utensils separate from food that will be eaten raw, wash hands after handling it, and cook poultry all the way through. The Food Standards Agency gives current cooking guidance.',
    'Freezing is what makes splitting a chicken across several dinners realistic. Portions can be frozen raw after jointing, or cooked after a roast. Label them with the date and defrost in the fridge before cooking. Without a plan to freeze at least some of it, a whole chicken tends to get eaten in one or two sittings, narrowing the value gap with buying pieces.',
  ] },
  { title: 'When pre-cut chicken may make more sense', paragraphs: [
    'A whole chicken is not automatically the better choice. Cooking for one makes a whole bird harder to use before it needs freezing or eating up, and limited freezer space makes it difficult to store parts that will not be cooked immediately.',
    'Some people are simply less comfortable handling raw whole poultry than a packaged cut, and that is a reasonable preference. Sometimes a dinner calls for one particular cut, in which case buying it directly is more straightforward. Convenience has a value of its own, even when it is not the lowest option per kilogram.',
  ] },
  { title: 'How to compare fairly in the shop', paragraphs: [
    'Compare the price per kilogram, not only the total on the label, since pack sizes differ and a whole bird can have a larger total price. Think honestly about how much of the bird will actually get used, not only the parts that sound appealing.',
    'Check use-by dates and freezer space before committing to a bigger bird than the household can get through. Decide in advance whether the carcass and wings are likely to become stock, or whether they will sit in the freezer unused. There is no shame in choosing pieces if stock-making does not fit the week.',
  ] },
  { title: 'Verdict', paragraphs: [
    'A whole chicken can make the weekly shop go further, but only when there is a reasonably realistic plan for the parts, not just the roast dinner. Bought with no particular plan, it can just as easily become another ingredient that goes unused.',
    'For dinners built around meat that is already cooked, the leftover roast chicken guide picks up from there. This guide is about the buying decision itself; that one is about what to do with what is left over.',
  ], relatedLink: { label: 'Nine budget dinners with leftover roast chicken', url: '/guides/9-budget-dinners-with-leftover-roast-chicken' } },
];

export function getWholeChickenValueGuideJsonLd() {
  const guide = WHOLE_CHICKEN_VALUE_GUIDE;
  const url = `https://dinnerbydesign.app${WHOLE_CHICKEN_VALUE_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] },
  ] };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderWholeChickenValueGuideInitialHtml() {
  const guide = WHOLE_CHICKEN_VALUE_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURE_FOOTER);
  const sections = WHOLE_CHICKEN_VALUE_GUIDE_SECTIONS.map(section => {
    const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
    const relatedLink = section.relatedLink ? `<p>Related guide: <a href="${escapeHtml(section.relatedLink.url)}">${escapeHtml(section.relatedLink.label)}</a></p>` : '';
    return `<section>${heading}${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${relatedLink}</section>`;
  }).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guide</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 8 August 2026 · Last reviewed 8 August 2026</p><article>${sections}${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find chicken recipes for dinner</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and find a recipe that suits your household.</p><p><a href="/signin">Find chicken recipes</a></p></section></main></div>`;
}
