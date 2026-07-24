import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  LOW_COST_DINNERS_DISCLOSURE_FOOTER,
  LOW_COST_DINNERS_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const LOW_COST_DINNERS_GUIDE_PATH = '/food-costs/make-low-cost-dinners-more-interesting';

export const LOW_COST_DINNERS_GUIDE = {
  title: "Low-cost dinners don't have to be boring",
  seoTitle: 'How to make low-cost dinners more interesting | DinnerByDesign',
  description: 'Practical ways to make affordable dinners more varied and satisfying using seasoning, texture, different cooking methods and inexpensive ingredients.',
  publishedAt: '2026-07-24',
  reviewedAt: '2026-07-24',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Find practical ways to make low-cost dinners more varied and enjoyable without expanding the shopping list',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-24',
  editorialNotes: 'Technique-led guide with no specific cost or savings figures. Review annually, next due 24 July 2027.',
  internalLinks: [
    '/guides',
    '/food-costs/low-cost-cooking-techniques',
    '/food-costs/five-dinners-same-ingredients',
    '/guides/home-cooked-or-ready-made-dinners',
    '/pricing-methodology',
    '/signin',
  ],
  disclosures: ['price_comparison'] satisfies ProgrammaticDisclosureKey[],
};

export function getLowCostDinnersGuideJsonLd() {
  const guide = LOW_COST_DINNERS_GUIDE;
  const url = `https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`;
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

export function renderLowCostDinnersGuideInitialHtml() {
  const guide = LOW_COST_DINNERS_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(LOW_COST_DINNERS_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(LOW_COST_DINNERS_DISCLOSURE_FOOTER);

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guide</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 24 July 2026 · Last reviewed 24 July 2026</p><article><section><p>Cutting the cost of dinner can bring a nagging worry: that the dinners ahead are going to be a long run of plain pasta, unseasoned lentils and baked beans on toast. If every budget dish tastes roughly the same, saving money quickly stops feeling worth it.</p><p>That repetition often isn't caused by the ingredients. It's caused by using them the same way every time. Beans, lentils, eggs, potatoes, tinned tomatoes and cheaper cuts of meat aren't dull by nature. They're starting points, and what happens after they go in the basket is where the variety actually comes from.</p></section><section><h2>Affordable ingredients are not inherently dull</h2><p>Lentils can turn into a dhal one night, a tomato-based pasta sauce the next, and spiced patties after that. Eggs move just as easily between a frittata, a shakshuka or a vegetable fried rice. None of these are lesser versions of a more expensive dish. They're different dishes that happen to share a starting ingredient.</p><p>Tinned tomatoes work the same way. The same tin can underpin a simple pasta sauce, a shakshuka, a chilli or a curry base, and each can taste quite different despite sharing a shelf-stable ingredient that's usually inexpensive. The variety comes from what's added around it, not from buying something different every week.</p></section><section><h2>Build flavour inexpensively</h2><p>A short list of flavour-builders does most of the work here, and there's no need to own all of them at once, or to restock every one every week. One spice blend, one acidic ingredient and one savoury seasoning will already shift a dish a long way from its last outing.</p><ul><li>Mustard</li><li>Curry powder</li><li>Smoked paprika</li><li>Dried herbs</li><li>Chilli flakes</li><li>Soy sauce</li><li>Vinegar or lemon juice</li><li>Garlic</li><li>Stock</li></ul><p>It is worth tasting as you go, particularly with stock, soy sauce and other salty seasonings. It's easy to oversalt a dish by adding several of these on top of each other without checking first.</p></section><section><h2>Change the cooking method</h2><p>The same vegetable behaves differently depending on how it's cooked. Roasted cabbage picks up browned, slightly sweet edges that boiled cabbage never gets. Chickpeas can go soft into a curry or crisp up in the oven for a completely different texture. Potatoes can become wedges, mash, a rösti or a pie topping without a single change to the shopping list.</p><p>These changes often require no new main ingredients. The point is to treat cooking method as another variable, alongside seasoning, rather than defaulting to the same pan and the same timing every time. Vegetables roasted quickly at a high temperature can taste quite different from the same vegetables simmered gently in a stew, even when the shopping list is identical.</p></section><section><h2>Add texture and contrast</h2><p>Budget dishes can start to feel monotonous when everything on the plate has the same soft texture. A small contrasting element often makes more difference than adding another costly ingredient.</p><ul><li>Toasted breadcrumbs</li><li>Crisp fried onions</li><li>Shredded raw vegetables</li><li>Pickled onions</li><li>Seeds</li><li>A spoonful of yoghurt</li><li>Fresh herbs, when affordable</li><li>A squeeze of lemon</li></ul><p>A bowl of dhal, for example, changes considerably with a spoonful of yoghurt and a scattering of toasted seeds on top, even though the dhal itself hasn't changed at all. The same logic applies to soups, stews and anything else that tends to come out uniformly soft.</p></section><section><h2>Reuse ingredients without repeating the same dinner</h2><p>Shopping for a small set of ingredients that reappear across several dishes can bring costs down while still giving some variety. Peppers, onions and tinned tomatoes, for instance, can turn up in:</p><ul><li>A smoky bean chilli</li><li>A vegetable paella</li><li>A tomato and pepper pasta sauce</li></ul><p>The ingredients overlap, but the seasoning, texture and format change from one dinner to the next. It is worth noting that a shared ingredient list doesn't automatically guarantee a saving; pack size, what goes unused and current retailer pricing all affect the real cost.</p></section>${disclosures}<section><h2>Give familiar dishes one deliberate change</h2><p>None of this means reinventing every dinner from scratch. Most households already have two or three low-cost dishes on repeat, and the quickest way to see a difference is to leave the dish alone and change one detail around it. Sometimes one small, deliberate change to something already in rotation is enough:</p><ul><li>Add mustard and crisp breadcrumbs to cauliflower cheese.</li><li>Turn leftover chilli into stuffed potatoes.</li><li>Add roasted carrots and warm spices to lentil soup.</li><li>Finish tomato pasta with toasted crumbs and lemon zest.</li><li>Add shredded cabbage and a sharp dressing beside sausages and mash.</li></ul><p>Each of these keeps the original shopping list intact. The change is in the detail added on top, which is usually enough to make a familiar dish feel worth cooking again.</p></section><section><h2>A note on effort and cost</h2><p>It's worth being honest that none of this is effortless for everyone. Time, energy, equipment, food prices and access to a decent supermarket vary a great deal between households, and low-cost cooking asks more of some people than others.</p><p>Ready-made options aren't a step down from this either; they can be the sensible choice, particularly when they cut down on waste or suit a smaller household better than cooking from scratch. <a href="/guides/home-cooked-or-ready-made-dinners">Compare the two approaches in more detail</a>.</p></section><section><h2>Where to start</h2><p>Affordable cooking tends to stick as a habit when it still gives people something to look forward to. Variety doesn't need a bigger shopping list. It needs a change to how the same ingredients are seasoned, cooked or finished.</p><p>This week, try picking one low-cost dish already in rotation and changing a single thing about it: the seasoning, the cooking method, the texture, or the finish.</p></section><section><h2>Related guidance</h2><p><a href="/food-costs/low-cost-cooking-techniques">Explore three low-cost cooking techniques</a>, <a href="/food-costs/five-dinners-same-ingredients">see how shared ingredients can become five different dinners</a> or <a href="/pricing-methodology">read how DinnerByDesign calculates ingredient costs</a>.</p></section>${footer}</article><section><h2>Make familiar ingredients feel less predictable</h2><p>Tell DinnerByDesign what you already have, your budget and your preferences, and find a dinner that gives those ingredients a different direction.</p><p><a href="/signin">Find a dinner</a></p></section></main></div>`;
}
