import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  CHEAP_FINISHING_TOUCHES_DISCLOSURE_FOOTER,
  CHEAP_FINISHING_TOUCHES_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const CHEAP_FINISHING_TOUCHES_GUIDE_PATH = '/food-costs/cheap-finishing-touches';

export const CHEAP_FINISHING_TOUCHES_GUIDE = {
  title: 'Cheap finishing touches that make everyday dinners taste better',
  seoTitle: 'Low-cost ways to add flavour and texture to dinner | DinnerByDesign',
  description: 'Use acidity, crunch, savoury depth, heat and fresh contrast to lift everyday dinners without substantially increasing their cost.',
  publishedAt: '2026-07-24',
  reviewedAt: '2026-07-24',
  nextReviewAt: '2027-07-24',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Find inexpensive finishing touches that add flavour, texture and contrast to everyday dinners',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-24',
  editorialNotes: 'Technique-led guide. Cheap and low-cost refer to cost per use and small quantities, not a guarantee that every complete pack is inexpensive.',
  internalLinks: [
    '/guides',
    '/food-costs/how-to-use-complete-packs',
    '/food-costs/five-dinners-same-ingredients',
    '/food-safety',
    '/food-costs/make-low-cost-dinners-more-interesting',
    '/guides/home-cooked-or-ready-made-dinners',
    '/pricing-methodology',
    '/signin',
  ],
  disclosures: ['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Love Food Hate Waste: Herbs',
      url: 'https://www.lovefoodhatewaste.com/foods-and-recipes/herbs',
    },
    {
      label: 'Food Standards Agency: Food allergies, intolerances and coeliac disease',
      url: 'https://www.food.gov.uk/food-safety-and-hygiene/food-allergies-intolerances-and-coeliac-disease',
    },
  ],
};

export interface CheapFinishingTouchesSection {
  title?: string;
  paragraphs: string[];
  bullets?: string[];
}

export const CHEAP_FINISHING_TOUCHES_SECTIONS: CheapFinishingTouchesSection[] = [
  {
    paragraphs: [
      "A dinner can be properly cooked and still taste a little flat, heavy or unremarkable. The fix isn't always another ingredient added to the pot. Often what's missing is contrast: something added right at the end that the rest of the dish doesn't have.",
      'Five things tend to do this job: acidity, crunch, savoury depth, heat and fresh contrast. None of them need buying all at once. One or two used repeatedly are more useful than a cupboard full of specialist jars. Most of these additions are used at the finishing stage. A few, such as a cheese rind or anchovies softened in oil, build depth earlier, but the same principle applies: a small amount can change the dish without substantially changing its cost.',
    ],
  },
  {
    title: 'Acid: when a dish tastes flat or heavy',
    paragraphs: [
      "Acidity is often the simplest fix for a dish that tastes flat or feels heavy. A squeeze of lemon or lime cuts through richness and sharpens flavour that's gone a bit dull. A splash of malt, red wine or rice vinegar does something similar when stirred into a soup or lentil stew. Chopped pickled onions or other pickles bring the same lift to something like a baked potato or a bean chilli.",
      'Start small. Add a little, taste, then decide whether it needs more. It is easy to add a little more, but difficult to take it back out once the dish becomes too sharp.',
    ],
  },
  {
    title: 'Crunch: when everything feels too soft',
    paragraphs: [
      'Inexpensive dinners can start to feel repetitive when everything on the plate has roughly the same soft texture. A contrasting crunch is often more noticeable than another ingredient stirred into the main dish.',
      "Toasted breadcrumbs are the most useful example. Stale bread, blitzed or torn and fried briefly in a little oil, makes a crisp topping for pasta, cauliflower cheese, mash or soup, and turns bread that would otherwise be thrown away into something worth having. Crisp bacon or pancetta pieces, toasted seeds or chopped nuts, and fried or crispy onions all do a similar job.",
      "Bacon, pancetta and nuts aren't automatically cheap by the pack, though. Their value here comes from using a small amount at a time, provided the rest gets used up or stored properly rather than going to waste.",
    ],
  },
  {
    title: 'Savoury depth: when flavour feels thin',
    paragraphs: [
      'Some dishes taste thin rather than flat, missing the deeper, more rounded savouriness sometimes called umami. A splash of soy sauce or fish sauce, a spoonful of miso, anchovies mashed into hot oil, or a Parmesan rind simmered in a sauce or stock can all add that without much bulk.',
      "These ingredients tend to be high in salt, so it's worth tasting before adding more, particularly if more than one goes into the same dish. A cheese rind is most worth keeping if it's something that would otherwise be thrown away, rather than bought specifically for this purpose. Several of these additions contain common allergens, including fish, milk, soya, tree nuts and cereals containing gluten. If you're cooking for somebody with an allergy, check every label, ask what they can safely eat, and take care to prevent cross-contamination.",
    ],
  },
  {
    title: 'Heat and spice: when a familiar dish needs a different direction',
    paragraphs: [
      "A familiar dish can feel different with one seasoning change. Smoked paprika turns a plain tray of roasted potatoes into something with a different character entirely, and chilli flakes can shift tomato pasta, wilted greens or a fried egg without changing anything else about the dish. More heat doesn't automatically mean more flavour, though. A small amount, tasted as it's added, usually does the job.",
    ],
  },
  {
    title: 'Fresh contrast: when a dish feels rich or tired',
    paragraphs: [
      "Fresh herbs, added right at the end rather than cooked through, bring a lift that's hard to get any other way. Parsley, coriander and mint all work well like this. A spoonful of yoghurt or crème fraîche does something similar for a curry or roasted vegetables, adding coolness and a touch of acidity as well as creaminess.",
      'Herbs are one of the easier ingredients to waste, since most dinners only need a small handful. Picking one herb that turns up across several dinners planned for the week cuts down on this. Chopped herbs can also be frozen, in an ice cube tray with a little oil or water, for up to six months.',
    ],
  },
  {
    title: "What's actually missing?",
    paragraphs: [
      'A short way to work out what a dish actually needs:',
      "Choose one of these first, taste the result, and only reach for a second adjustment if it's still needed.",
    ],
    bullets: [
      'Tastes flat: try lemon juice or vinegar.',
      'Feels heavy: add acidity, herbs or pickles.',
      'Too soft: add toasted crumbs, seeds or crispy onions.',
      'Lacks depth: try miso, soy sauce, anchovy or a cheese rind.',
      'Familiar but a bit dull: add chilli, smoked paprika or a fresh herb.',
      'Too hot or strongly spiced: finish with yoghurt.',
    ],
  },
  {
    title: 'The real cost',
    paragraphs: [
      "Not every suggestion here is cheap in every sense. A jar of miso or a bag of chilli flakes used across dozens of dinners works out as good value per use, even if the price on the shelf looks high. A bunch of fresh herbs bought for one dish and left to wilt in the fridge is the opposite: a small upfront cost that's mostly wasted.",
      'It is worth weighing cost per use against the price of the whole pack, how likely the rest is to actually get used, how long it keeps, and whether something similar is already sitting in the cupboard.',
    ],
  },
  {
    title: 'Conclusion',
    paragraphs: [
      "Most of what a dinner costs sits in its main ingredients, not in what's added at the end. But the final impression, whether a dish tastes flat, thin or genuinely worth going back for, often comes down to a teaspoon, a squeeze or a scattering added just before serving.",
      "Pick one dinner already in rotation this week and give it a single, deliberate finishing touch.",
    ],
  },
];

export const CHEAP_FINISHING_TOUCHES_FAQS = [
  {
    question: 'What can I add when a dish tastes bland?',
    answer: "It depends what's missing. A squeeze of lemon or a splash of vinegar fixes a flat, heavy taste. A splash of soy sauce, a spoonful of miso or a Parmesan rind adds depth to something that tastes thin rather than flat.",
  },
  {
    question: 'What is the cheapest way to add crunch?',
    answer: 'Toasted breadcrumbs made from stale bread are often one of the least expensive options, particularly when they use bread that might otherwise be wasted.',
  },
  {
    question: 'Can I add acidity after cooking?',
    answer: "Yes, that's usually the best time. A squeeze of lemon or a dash of vinegar stirred in just before serving is easier to judge by taste than adding it earlier in the cooking.",
  },
  {
    question: 'How can I use fresh herbs without wasting the rest?',
    answer: "Pick one herb that appears across several dinners planned for the week, or freeze chopped herbs in an ice cube tray with a little oil or water. They'll keep in the freezer for up to six months.",
  },
  {
    question: 'Which savoury ingredients contain a lot of salt?',
    answer: 'Soy sauce, fish sauce, miso, anchovies and hard cheese are all worth using with a light hand. Taste before adding more, especially if combining more than one in the same dish.',
  },
  {
    question: 'What finishing touches work well with roasted vegetables?',
    answer: 'A squeeze of lemon, toasted seeds or nuts, a spoonful of yoghurt, or a scattering of chilli flakes all work well, depending on whether the dish needs sharpness, crunch, coolness or heat.',
  },
];

export function getCheapFinishingTouchesGuideJsonLd() {
  const guide = CHEAP_FINISHING_TOUCHES_GUIDE;
  const url = `https://dinnerbydesign.app${CHEAP_FINISHING_TOUCHES_GUIDE_PATH}`;

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
        mainEntity: CHEAP_FINISHING_TOUCHES_FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
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

const renderSection = (section: CheapFinishingTouchesSection) => {
  const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';
  return `<section>${heading}<p>${escapeHtml(firstParagraph)}</p>${bullets}${remainingParagraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`;
};

export function renderCheapFinishingTouchesGuideInitialHtml() {
  const guide = CHEAP_FINISHING_TOUCHES_GUIDE;
  const sectionHtml = CHEAP_FINISHING_TOUCHES_SECTIONS.map(renderSection);
  const disclosures = renderProgrammaticDisclosuresInitialHtml(CHEAP_FINISHING_TOUCHES_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(CHEAP_FINISHING_TOUCHES_DISCLOSURE_FOOTER);
  const faqs = CHEAP_FINISHING_TOUCHES_FAQS.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guide</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 24 July 2026 · Last reviewed 24 July 2026</p><article>${sectionHtml.slice(0, 4).join('')}${disclosures}${sectionHtml.slice(4).join('')}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Related guidance</h2><ul><li><a href="/food-costs/how-to-use-complete-packs">Use complete packs without wasting ingredients</a></li><li><a href="/food-costs/five-dinners-same-ingredients">Plan several dinners around shared ingredients</a></li><li><a href="/food-costs/make-low-cost-dinners-more-interesting">Make low-cost dinners more interesting</a></li><li><a href="/guides/home-cooked-or-ready-made-dinners">Compare home-cooked and ready-made dinners</a></li></ul></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Give a familiar dinner a different finish</h2><p>Tell DinnerByDesign what you have, your budget and your preferences, and find a recipe that makes those ingredients feel less predictable.</p><p><a href="/signin">Find a dinner</a> · <a href="/guides">Browse all guides</a></p></section></main></div>`;
}
