import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER,
  GROCERY_COST_OPTIONS_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const GROCERY_COST_OPTIONS_GUIDE_PATH = '/food-costs/ways-to-reduce-grocery-costs';

export const GROCERY_COST_OPTIONS_GUIDE = {
  title: '12 practical ways to reduce and manage your grocery costs',
  seoTitle: '12 ways to manage grocery costs | DinnerByDesign',
  description: 'Explore 12 practical ways to manage grocery costs, use ingredients more effectively and reduce avoidable food waste.',
  publishedAt: '2026-07-21',
  reviewedAt: '2026-07-21',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Find practical ways to manage grocery spending, use ingredients effectively and reduce avoidable food waste',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-21',
  editorialNotes: 'Cornerstone guide linking the first 11 public pages. Keep its methods aligned with the detailed guides and recheck Food Standards Agency sources whenever the review date changes.',
  internalLinks: [
    '/guides',
    '/food-costs/uk-food-costs-2026',
    '/dinner-plans/5-dinners-for-2-under-40',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/cooking-for-one-without-waste',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/low-cost-cooking-techniques',
    '/food-costs/mediterranean-inspired-affordable-cooking',
    '/food-costs/cooking-for-four-with-lower-cost-cuts',
    '/food-costs/cooking-with-offal-on-a-budget',
    '/food-costs/fresh-or-frozen',
    '/food-costs/summer-stews-seasonal-vegetables',
  ],
  disclosures: ['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food' },
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely' },
  ],
  faqs: [
    { question: 'What is the best way to start reducing grocery costs?', answer: 'Start with whichever problem affects you most — waste, expensive ingredients, lack of time or unpredictable spending — and use the comparison table to find the matching technique, rather than trying to change everything at once.' },
    { question: 'Does cooking from scratch always cost less?', answer: 'Not necessarily. It often helps, but the saving depends on using the ingredients you buy, choosing suitable quantities and not letting complete packs go to waste. Cooking from scratch with a lot of leftover, unused ingredients can cost more than a simpler shop.' },
    { question: 'How can I reduce waste when supermarkets sell complete packs?', answer: 'Plan dinners that share ingredients, so a partly used pack has a second destination already in mind, and keep a few flexible fallback dinners ready for anything left over that does not fit a specific plan.' },
    { question: 'Is batch cooking always economical?', answer: 'No. It only helps when every portion has a purpose. A large batch cooked without a plan for the extra can end up wasted rather than saving anything.' },
    { question: 'Are frozen ingredients always cheaper than fresh?', answer: 'No. Prices vary by product, retailer and season. Frozen ingredients can help reduce waste because you use only what you need, but that is a different benefit from being guaranteed cheaper.' },
    { question: 'How can DinnerByDesign help manage grocery spending?', answer: 'You can build a week of dinners around your household, budget and available time, then generate a shopping list from the dinners you have scheduled — bringing planning, portioning and pack awareness together in one place.' },
  ],
};

export const GROCERY_COST_STARTING_POINTS = [
  ['Ingredients being thrown away', 'Portion planning and fresh-or-frozen choices'],
  ['Unpredictable weekly spending', 'Planning several dinners around a budget'],
  ['Partially used packs', 'Shared-ingredient planning'],
  ['Expensive proteins', 'Lower-cost cuts, eggs, pulses or offal'],
  ['Repetitive budget cooking', 'Cuisine-inspired flavours and flexible bases'],
  ['Limited cooking time', 'Purposeful batch cooking'],
  ['Last-minute purchases', 'Flexible fallback dinners'],
  ['Confusing supermarket trips', 'A list generated from scheduled dinners'],
] as const;

export function getGroceryCostOptionsGuideJsonLd() {
  const guide = GROCERY_COST_OPTIONS_GUIDE;
  const url = `https://dinnerbydesign.app${GROCERY_COST_OPTIONS_GUIDE_PATH}`;
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
        mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderGroceryCostOptionsGuideInitialHtml() {
  const guide = GROCERY_COST_OPTIONS_GUIDE;
  const costDisclosure = renderProgrammaticDisclosuresInitialHtml(GROCERY_COST_OPTIONS_DISCLOSURES.slice(0, 1));
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(GROCERY_COST_OPTIONS_DISCLOSURES.slice(1, 3));
  const reviewDisclosure = renderProgrammaticDisclosuresInitialHtml(GROCERY_COST_OPTIONS_DISCLOSURES.slice(3));
  const footer = renderProgrammaticDisclosureFooterInitialHtml(GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER);
  const rows = GROCERY_COST_STARTING_POINTS.map(([problem, start]) => `<tr><th>${escapeHtml(problem)}</th><td>${escapeHtml(start)}</td></tr>`).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 21 July 2026 · Last reviewed 21 July 2026</p><article><section><p>Controlling what you spend on groceries involves more than hunting for the cheapest products on the shelf. It is really about a handful of connected decisions: planning what you will actually cook, choosing realistic quantities, coordinating ingredients across several dinners, using complete packs effectively, avoiding unnecessary waste, and having a purpose for any surplus portions.</p><p>One distinction is worth keeping in mind throughout: the value of the ingredients you use in a dinner is not the same as the cost of the complete pack you had to buy to get them. Many of the techniques below work by closing that gap — making sure more of what you pay for actually gets eaten.</p></section>${costDisclosure}<section><h2>Quick answer</h2><p>The most effective approach is usually a combination of realistic portion planning, coordinated ingredients, flexible lower-cost products and a clear purpose for everything you buy. No single technique works for every household. The best starting point depends on whether your main problem is waste, expensive ingredients, lack of time or unpredictable weekly spending.</p></section><section><h2>1. Plan several dinners together</h2><p>Choosing three or four dinners at a time, built around a budget and a small set of shared ingredients, cuts down on the disconnected purchases that quietly push up a weekly shop. It is worth keeping this flexible rather than rigid — a plan that can absorb a changed evening or a swapped dinner is more useful than one that falls apart the first time your week does not go to schedule.</p><p>Our <a href="/food-costs/uk-food-costs-2026">guide to UK food costs</a> looks at where grocery spending typically goes in more detail, and a sample plan like <a href="/dinner-plans/5-dinners-for-2-under-40">5 dinners for 2 under £40</a> shows what a coordinated, budget-led week can look like in practice.</p></section><section><h2>2. Plan realistic portions</h2><p>Portion planning is not about automatically serving less — it is about deciding how many people a dinner needs to serve, and what any extra portions are for. This matters at the checkout too: using only part of a pack does not reduce what you paid for it unless the rest gets used later, whether that is another dinner, a lunch, or the freezer.</p><p>Household size affects this more than anything else. Our guide to <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a> covers the general principles, and <a href="/food-costs/cooking-for-one-without-waste">cooking for one without waste</a> looks specifically at adjusting for a smaller household.</p></section><section><h2>3. Batch-cook with a purpose</h2><p>Cooking a larger quantity only helps when every portion has somewhere to go: another dinner, the fridge for prompt use, the freezer for later, or a flexible base you can finish differently each time. Batch cooking without a plan for the extra is not a saving — it is just a bigger version of the same risk.</p><p>Our guide to <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a> looks at when it helps and when it does not.</p></section><section><h2>4. Use lower-cost cooking techniques</h2><p>Stewing, braising, roasting, baking, and building a good sauce are all ways of turning modest ingredients into a dinner with real depth of flavour and texture. Herbs, spices and aromatics do a lot of the work here — budget-conscious cooking does not have to mean bland cooking. Our guide to <a href="/food-costs/low-cost-cooking-techniques">low-cost cooking techniques</a> goes through these in more detail.</p></section><section><h2>5. Explore cuisines that use inexpensive staples well</h2><p>Several culinary traditions make good use of pulses, grains, tomatoes, vegetables, herbs and spices to build a satisfying dinner without leaning on an expensive centrepiece ingredient. No cuisine is inherently cheap — the cost still depends on the specific ingredients and products you choose — but the techniques are genuinely useful. Our <a href="/food-costs/mediterranean-inspired-affordable-cooking">Mediterranean-inspired affordable cooking guide</a> explores this in practice.</p></section><section><h2>6. Consider lower-cost cuts and alternative proteins</h2><p>Lower-cost meat cuts, offal, eggs, and beans, chickpeas or lentils can all bring protein to a dinner without needing a large, expensive centrepiece. Combining a smaller amount of meat with vegetables, grains or pulses often works just as well as a bigger portion on its own. See our guides to <a href="/food-costs/cooking-for-four-with-lower-cost-cuts">cooking for four with lower-cost cuts</a> and <a href="/food-costs/cooking-with-offal-on-a-budget">cooking with offal on a budget</a> for more detail. The most economical option will depend on the products available, the pack sizes and what your household will genuinely use.</p></section><section><h2>7. Decide when fresh or frozen is more practical</h2><p>Fresh and frozen each suit different dinners — shelf life, convenience, texture, preparation and how likely something is to go to waste all vary by ingredient and how you are planning to cook it. Neither format is always the better choice; it depends on how soon the ingredient will be used and how you intend to cook it. Our <a href="/food-costs/fresh-or-frozen">fresh or frozen guide</a> covers this in more detail.</p></section><section><h2>8. Use seasonal and flexible dinner formats</h2><p>Stews, tray bakes, soups and adaptable sauces are naturally good at absorbing whatever vegetables are available, already in the fridge, or simply need using. <a href="/food-costs/summer-stews-seasonal-vegetables">Summer stews</a> are a good example of this — light, quick-cooking dinners that flex around what you have without feeling like an afterthought.</p></section><section><h2>9. Give complete packs more than one purpose</h2><p>A single ingredient bought for one dinner can often do more than one job across the week. Peppers might go into a spiced rice dish, a stew and a tray bake; a tub of yoghurt into a sauce one night and a dressing another; a bag of spinach into a pasta dish and a curry-inspired dinner; a plainly cooked batch of chicken finished with a different set of flavours each time. This is not about building a rigid weekly menu — it is about noticing where one purchase can quietly cover several dinners.</p></section><section><h2>10. Start with ingredients already available</h2><p>Before choosing what to cook, it is worth checking the cupboard, fridge and freezer first. Prioritise opened products and ingredients that need using soon, while continuing to follow use-by dates and storage instructions.</p></section>${safetyDisclosures}<section><h2>11. Keep flexible fallback dinners available</h2><p>A small collection of dependable dinners — built from eggs, rice, pasta, frozen vegetables, pulses or tinned tomatoes — reduces the chance of an expensive last-minute decision on a night when nothing has been planned. These do not have to be an afterthought: a well-seasoned baked egg dish or a good tomato pasta can be just as appetising as anything else in the week&apos;s plan.</p></section><section><h2>12. Build the shopping list from scheduled dinners</h2><p>A shopping list that follows your dinner plan, rather than the other way around, naturally accounts for household servings, ingredients shared between dinners, complete pack sizes, and what is already available at home. This is where planning, portioning and pack awareness come together into one practical step, and it is the point where DinnerByDesign can help most directly — generating a shopping list from the dinners you have actually scheduled.</p></section><section><h2>Where should you start?</h2><table><thead><tr><th>If the main problem is...</th><th>A useful place to start</th></tr></thead><tbody>${rows}</tbody></table></section><section><h2>Bringing it together</h2><p>These techniques work best in combination, and you do not need to adopt all twelve at once.</p><p>Portion planning becomes more useful when dinners share ingredients. Batch cooking works better when every portion has a purpose. Fresh and frozen choices become easier when the week is already planned. Choose the combination that gives your household greater control.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${reviewDisclosure}</article>${footer}<section><h2>Put these ideas into practice</h2><p>Build a week of dinners around your household, budget and available time, then generate a shopping list from the dinners you schedule.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
