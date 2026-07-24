import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER,
  HOME_COOKED_READY_MADE_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const HOME_COOKED_READY_MADE_GUIDE_PATH = '/guides/home-cooked-or-ready-made-dinners';

export const HOME_COOKED_READY_MADE_GUIDE = {
  title: 'Home-cooked or ready-made? The honest comparison',
  seoTitle: 'Home-cooked vs ready-made dinners: an honest comparison | DinnerByDesign',
  description: 'Compare home-cooked and ready-made dinners on cost, portions, ingredient waste, nutrition labels, safety and everyday effort.',
  publishedAt: '2026-07-24',
  reviewedAt: '2026-07-24',
  nextReviewAt: '2027-07-24',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking and nutrition guide',
  primarySearchIntent: 'Compare home-cooked and ready-made dinners beyond convenience, including portions, waste, labels, nutrition, cost and safety',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-24',
  editorialNotes: 'Evidence-led comparison. Keep conclusions product-specific and avoid presenting either option as universally better.',
  internalLinks: ['/guides', '/food-costs/make-low-cost-dinners-more-interesting', '/nutrition-methodology', '/food-safety', '/pricing-methodology', '/signin'],
  disclosures: ['price_comparison', 'serving_assumption', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Public Health Nutrition: UK comparison of ready-made and home-cooked dishes',
      url: 'https://doi.org/10.1017/S1368980023000034',
    },
    {
      label: 'GOV.UK: Food labelling, giving food information to consumers',
      url: 'https://www.gov.uk/guidance/food-labelling-giving-food-information-to-consumers',
    },
    {
      label: 'Institute for Fiscal Studies: Product reformulation and dietary salt intake',
      url: 'https://ifs.org.uk/articles/product-reformulation-effective-reducing-dietary-salt-intake',
    },
    {
      label: 'Food Standards Agency: Cooking and reheating food safely',
      url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food',
    },
  ],
};

export interface HomeCookedReadyMadeSection {
  title?: string;
  paragraphs: string[];
  bullets?: string[];
}

export const HOME_COOKED_READY_MADE_SECTIONS: HomeCookedReadyMadeSection[] = [
  {
    paragraphs: [
      "It's a common assumption: cooking from scratch is always the better choice, and ready-made is what you fall back on when time or energy runs short. The comparison looks different once portion size, ingredient waste, cooking energy and someone's actual circumstances are counted alongside taste and cost.",
      "Neither option wins in every situation. Ready-made dinners offer predictable quantities, clear on-pack information and no leftover ingredients from that particular dish. Home cooking generally gives more control over vegetables, fibre and seasoning, and the available UK evidence suggests it's usually less expensive and can have a lower environmental impact. But that answer shifts once cooking energy, unused ingredients and the value of someone's time are factored in.",
    ],
  },
  {
    title: 'Where ready-made genuinely helps',
    paragraphs: [
      "A ready-made dish is sized once, by the manufacturer, and doesn't need judging by eye. That single fact explains most of its real advantages:",
      "This matters more for some households than others. A one-person household, someone with an irregular schedule, or anyone managing limited time or energy can find these advantages genuinely useful, not just convenient. That said, a manufacturer's serving size is a standard figure, not necessarily the right amount for a particular appetite.",
    ],
    bullets: [
      'A predictable pack and serving size, rather than an estimate',
      'No half-used onion, herbs, cream or specialist sauce left over from that dish',
      'Clear calorie and nutrient information printed on the pack',
      'Consistent preparation instructions every time',
      'Very little preparation or washing up',
      'Accessibility for anyone short on time, energy, equipment or cooking confidence',
    ],
  },
  {
    title: 'The limits of those advantages',
    paragraphs: [
      'Those advantages have edges. A fixed pack can still be too large for one person or too small for two. Packaging itself creates a different form of waste, even when the ingredients inside are used in full. Storage and reheating instructions still need following properly for the dish to be safe to eat.',
      "Nutrition declarations are useful, but they're average values rather than a measurement of the exact dish in front of you. Front-of-pack claims such as 'high protein' or 'under 500 calories' usually highlight one attractive figure, not the nutritional quality of the whole dish.",
    ],
  },
  {
    title: 'Where home cooking tends to perform better',
    paragraphs: [
      "Home cooking tends to offer more control over salt, added sugar, fat and portion size, along with more scope to add vegetables, pulses and wholegrain ingredients. A recipe can be adjusted around a dietary preference in a way a fixed product can't. Ingredients also tend to work out cheaper on average, provided the full pack gets used rather than part of it going to waste, and batch cooking or scaling up for a family is usually easier.",
      "None of that makes home cooking automatically inexpensive or nutritious. A homemade creamy pasta bake can still carry more salt, saturated fat or calories than a carefully chosen supermarket alternative. The advantage depends on the recipe actually cooked, not on the fact that it was cooked at home.",
    ],
  },
  {
    title: 'What the UK research found',
    paragraphs: [
      'A 2023 UK study from the Rowett Institute at the University of Aberdeen compared fifty-four chilled or frozen ready-made dishes against their home-cooked equivalents, using UK national dietary survey data. A few findings are worth knowing directly, rather than assuming:',
      "The study didn't fully account for cooking costs, the time and effort of cooking, or differences in serving size between a ready-made pack and a home-cooked portion. It's also a comparison of this specific dataset, not a verdict on every ultra-processed dish or every home-cooked equivalent. Broader concerns about heavily processed food are a separate discussion from what this particular study measured.",
    ],
    bullets: [
      'Ready-made versions contained significantly more free sugar overall.',
      'The researchers did not find a significant difference in salt or fat content between the two.',
      'Ready-made versions generally cost more per 100g.',
      'Animal-based dishes had higher emissions than plant-based ones, whether ready-made or home-cooked.',
      'Animal-based ready-made dishes cooked in an oven produced the highest emissions and were the most expensive of everything compared.',
    ],
  },
  {
    title: 'Has reformulation narrowed the difference?',
    paragraphs: [
      "Manufacturers have reduced salt and altered formulations across several UK product categories over the past two decades. Analysis of UK grocery purchases found a measurable decline in average salt content, and that the decline was driven by manufacturers reformulating products rather than by people choosing different ones. That's a genuine improvement, but it doesn't mean every current ready-made range now matches home cooking nutritionally. The practical approach is to judge the actual product in front of you rather than a claim printed on the front of the pack.",
    ],
  },
  {
    title: 'A practical decision guide',
    paragraphs: ['A few realistic situations help make the choice less abstract:'],
    bullets: [
      'Cooking for one with an unpredictable week: a single ready-made dish may prevent more waste than a part-used set of ingredients.',
      'Cooking for a family: home cooking will often provide better value and easier serving flexibility.',
      'Monitoring calories, protein or salt: a labelled pack can be easier to record accurately than an unweighed recipe.',
      'Trying to cut salt or add more vegetables: home cooking usually gives more control.',
      'Short on energy: whichever option gets a proper dinner eaten is the sensible one on that particular day.',
      'Using the same ingredients across several dinners: home cooking becomes considerably more economical once full packs are used rather than partly wasted.',
    ],
  },
  {
    title: 'The useful middle ground',
    paragraphs: ["This doesn't have to be an either-or decision. A few small combinations get some of the benefit of both:"],
    bullets: [
      'Add frozen vegetables to a ready-made curry.',
      'Serve a ready-made lasagne with a side salad or peas.',
      'Use a prepared sauce, but add your own vegetables and protein.',
      'Freeze spare portions of a home-cooked dish individually, so they behave like a ready-made option later in the week.',
      'Choose frozen chopped vegetables and herbs to cut down on the ingredient waste that home cooking can otherwise create.',
    ],
  },
  {
    title: 'Conclusion',
    paragraphs: [
      "Ready-made dinners tend to win on effort, predictability and straightforward labelling. Home cooking usually offers more control and often better value, particularly when ingredients are fully used rather than left to spoil. The better choice depends on the specific product, the specific recipe, the household cooking it, and what's actually likely to be eaten rather than wasted.",
    ],
  },
];

export const HOME_COOKED_READY_MADE_FAQS = [
  {
    question: 'Are ready-made dinners always less healthy?',
    answer: 'Not always. UK research comparing fifty-four ready-made dishes with home-cooked equivalents found significantly more free sugar in the ready-made versions, but no significant difference in salt or fat. Nutritional quality depends on the specific product, not the category as a whole.',
  },
  {
    question: 'Are the calories on packaged food exact?',
    answer: 'No. Nutrition declarations are mandatory on most prepacked food in Great Britain, but the figures are average values that allow for natural variation, not an exact measurement of the individual pack in your hand.',
  },
  {
    question: 'Is home cooking always cheaper?',
    answer: "Usually, but not automatically. It tends to work out cheaper when ingredients are bought in full packs and actually used, rather than partly wasted. Cooking energy, equipment and the time involved aren't part of most straightforward cost comparisons.",
  },
  {
    question: 'Which option creates less food waste?',
    answer: "It depends what's being measured. Ready-made avoids the leftover ingredients that a single home-cooked dish can create, but it introduces its own packaging waste. Freezing spare home-cooked portions individually can reduce ingredient waste, particularly when reusable containers are used.",
  },
  {
    question: 'Are ready-made dishes safer than home-cooked ones?',
    answer: 'Not inherently. Ready-made dishes come with standardised preparation instructions, but they still need to be stored and heated correctly to be safe, just as a home-cooked dish does.',
  },
  {
    question: 'How can I make a ready-made dinner more balanced?',
    answer: 'Frozen vegetables, a side salad or extra protein are straightforward additions that can round out a ready-made dish without much extra effort.',
  },
];

export function getHomeCookedReadyMadeGuideJsonLd() {
  const guide = HOME_COOKED_READY_MADE_GUIDE;
  const url = `https://dinnerbydesign.app${HOME_COOKED_READY_MADE_GUIDE_PATH}`;

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
        mainEntity: HOME_COOKED_READY_MADE_FAQS.map(faq => ({
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

const renderSection = (section: HomeCookedReadyMadeSection) => {
  const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';
  return `<section>${heading}<p>${escapeHtml(firstParagraph)}</p>${bullets}${remainingParagraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`;
};

export function renderHomeCookedReadyMadeGuideInitialHtml() {
  const guide = HOME_COOKED_READY_MADE_GUIDE;
  const sectionHtml = HOME_COOKED_READY_MADE_SECTIONS.map(renderSection);
  const disclosures = renderProgrammaticDisclosuresInitialHtml(HOME_COOKED_READY_MADE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER);
  const faqs = HOME_COOKED_READY_MADE_FAQS.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking and nutrition guide</nav><p>Practical cooking and nutrition guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 24 July 2026 · Last reviewed 24 July 2026</p><article>${sectionHtml.slice(0, 3).join('')}${disclosures}${sectionHtml.slice(3).join('')}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Related guidance</h2><p><a href="/food-costs/make-low-cost-dinners-more-interesting">See how to make low-cost dinners more interesting</a>.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find the option that fits tonight</h2><p>Search home-cooked recipes or ready-made supermarket options around your time, budget and preferences.</p><p><a href="/signin">Find a dinner</a> · <a href="/guides">Browse all guides</a></p></section></main></div>`;
}
