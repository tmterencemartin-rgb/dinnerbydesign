import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  PULSES_COST_DISCLOSURES,
  PULSES_DISCLOSURE_FOOTER,
  PULSES_SAFETY_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const PULSES_BUDGET_GUIDE_PATH = '/food-costs/cooking-with-pulses-on-a-budget';

export const PULSES_BUDGET_GUIDE = {
  title: 'Cooking with lentils, beans and chickpeas on a budget',
  seoTitle: 'Cooking with lentils, beans and chickpeas on a budget | DinnerByDesign',
  description: 'Compare dried and tinned pulses, choose the right variety for the dish and use lentils, beans and chickpeas without making dinner feel like a compromise.',
  publishedAt: '2026-07-25',
  reviewedAt: '2026-07-25',
  nextReviewAt: '2027-01-25',
  priceReviewedAt: '2026-07-25',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Learn how to buy and cook lentils, beans and chickpeas economically',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-25',
  editorialNotes: 'Price examples are a dated Tesco snapshot. Cooked yield and hob-use figures are explicitly presented as approximations.',
  internalLinks: [
    '/guides',
    '/food-costs/make-low-cost-dinners-more-interesting',
    '/food-costs/five-dinners-same-ingredients',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/fresh-or-frozen',
    '/pricing-methodology',
    '/food-safety',
    '/signin',
  ],
  disclosures: ['price_estimate', 'price_comparison', 'source_timing', 'storage_and_cooking', 'allergen_and_product'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'NHS: 5 A Day, what counts?', url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/' },
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely' },
    { label: 'Food Standards Agency: Natural toxins factsheet', url: 'https://acss.food.gov.uk/sites/default/files/natural-toxins-factsheet.pdf' },
    { label: 'Ofgem: Energy price cap unit rates and standing charges', url: 'https://www.ofgem.gov.uk/information-consumers/energy-advice-households/energy-price-cap-unit-rates-and-standing-charges' },
    { label: 'Tesco Groceries: Laila Chickpeas 2kg', url: 'https://www.tesco.com/shop/en-GB/products/310108624' },
    { label: 'Tesco Groceries: Lentils, grains and pulses', url: 'https://www.tesco.com/groceries/en-GB/shop/food-cupboard/dried-pasta-rice-noodles-and-cous-cous/lentils-grains-and-pulses' },
  ],
};

export const PULSE_USES = [
  ['Red lentils', 'Dhal, soup, curry, tomato sauce', 'Thickens and softens into the sauce'],
  ['Green or brown lentils', 'Stews, salads, pies', 'Firmer texture and substance'],
  ['Chickpeas', 'Curries, traybakes, salads, hummus', 'Mild flavour and a distinct bite'],
  ['Cannellini beans', 'Soups, tomato dishes, mash', 'Creamy texture'],
  ['Butter beans', 'Stews, bakes, crushed toppings', 'Large, soft and substantial'],
  ['Kidney beans', 'Chilli and rice dishes', 'Firm texture and familiar flavour'],
  ['Black beans', 'Chilli, rice bowls, fillings', 'Earthier flavour and darker colour'],
];

export const PULSES_BUDGET_FAQS = [
  {
    question: 'Are dried pulses always cheaper than tinned?',
    answer: 'No. Dried lentils are often economical because they cook quickly, but chickpeas take longer. Product price, cooked yield, hob type and cooking time all affect the comparison.',
  },
  {
    question: 'Which pulse is easiest to add to a sauce?',
    answer: 'Red lentils soften into a sauce and can thicken it. Chickpeas and most beans keep more of their shape and give the dish a distinct bite.',
  },
  {
    question: 'How can pulses stretch a meat-based dinner?',
    answer: 'Start by replacing about a third of the meat with lentils or beans, then adjust the liquid and seasoning. The dish will change, but the result can still feel balanced and satisfying.',
  },
  {
    question: 'Do beans, lentils and chickpeas count towards 5 A Day?',
    answer: 'Yes, but they count as a maximum of one portion a day, however much you eat or however many varieties you combine. An adult portion is about 80g.',
  },
  {
    question: 'Do dried kidney beans need special preparation?',
    answer: 'Yes. Follow the packet instructions. Food Standards Agency guidance says dried red kidney beans should be soaked for at least 12 hours and boiled vigorously for at least 10 minutes in fresh water.',
  },
  {
    question: 'Can cooked pulses be frozen?',
    answer: 'Yes. Cool them promptly, divide them into useful quantities and freeze them if they will not be eaten within the recommended refrigerated storage time.',
  },
];

export function getPulsesBudgetGuideJsonLd() {
  const guide = PULSES_BUDGET_GUIDE;
  const url = `https://dinnerbydesign.app${PULSES_BUDGET_GUIDE_PATH}`;
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
        mainEntity: PULSES_BUDGET_FAQS.map(faq => ({
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
const paragraphs = (items: string[]) => items.map(item => `<p>${escapeHtml(item)}</p>`).join('');

export function renderPulsesBudgetGuideInitialHtml() {
  const guide = PULSES_BUDGET_GUIDE;
  const costDisclosures = renderProgrammaticDisclosuresInitialHtml(PULSES_COST_DISCLOSURES);
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(PULSES_SAFETY_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(PULSES_DISCLOSURE_FOOTER);
  const rows = PULSE_USES.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
  const faqs = PULSES_BUDGET_FAQS.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guide</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 25 July 2026 · Last reviewed 25 July 2026</p><article>
<section>${paragraphs([
  "A tin of chickpeas often sits in the cupboard for months. Someone buys a bag of red lentils meaning to use it, then reaches for pasta instead because they're not sure what to do with it. Pulses have a reputation for being cheap and worthy rather than something to actually look forward to eating.",
  'That reputation is only partly deserved. Lentils, beans and chickpeas are inexpensive, keep for a long time and work across a wide range of cooking styles. They can replace some of the meat in a dish or stand as the main ingredient in their own right. Used well, they reduce the cost of a dinner without making it feel like a compromise.',
  "Used badly, they do the opposite. A handful of underseasoned lentils tipped into a sauce to bulk it out tends to taste exactly like that: bulk. Some people don't get on with the texture of pulses at all, however they're cooked. This guide is about giving pulses a clear job in a dish, flavour, texture or substance, rather than treating them as padding.",
])}</section>
<section><h2>Dried or tinned: which is better value?</h2>${paragraphs([
  "The shelf price alone isn't a fair comparison. Dried pulses need cooking, which carries an energy cost and changes the weight considerably between dry and cooked. Tinned pulses are sold with a drained weight lower than the tin's total weight. A fair comparison has to account for both, and prices vary enough between brands and pack sizes that one product shouldn't stand in for the whole category.",
  "Take chickpeas. On Tesco's website, Natco dried chickpeas cost £1.50 for 500g (£3.00 per kg) at the standard price, checked 25 July 2026. Laila dried chickpeas, sold in a larger 2kg bag, list at a £4.00 regular price (£2.00 per kg), with a lower £2.90 Clubcard price available to loyalty scheme members on the same date. Brand and pack size make a real difference here, so it's worth checking the unit price on the shelf rather than assuming one product represents the category.",
  'Once soaked and simmered, dried chickpeas typically yield around two to two and a half times their dry weight, a widely used kitchen conversion rather than an exact figure. So 100g of dried chickpeas, costing roughly 20p to 30p depending on brand, produces somewhere in the region of 220 to 250g cooked, a similar amount to the drained contents of a standard tin.',
  "Energy cost is harder to pin down precisely, since it depends on the hob, the pan and how low the heat is once the pan is simmering rather than boiling. As a rough guide, published UK hob running-cost estimates suggest a small ring simmering on gas uses somewhere in the region of 1 to 1.3 kWh per hour, and an electric ring nearer 1 to 1.5 kWh per hour, since electric rings cycle on and off around a set temperature rather than reducing output as smoothly as a gas flame lowered by hand. At Ofgem's Q3 2026 price cap rates (7.33p per kWh for gas, 26.11p per kWh for electricity, effective from 1 July 2026), roughly 90 minutes of mostly-simmering cooking works out at somewhere between 10p and 15p on gas, or 40p to 60p on electric. These are estimates built on assumed appliance output rather than a measurement of this specific dish, and the real figure will vary with the hob and pan used.",
  'Put together, a batch of dried chickpeas comparable to one tin costs roughly 30p to 45p on a gas hob, or 60p to 90p on an electric hob, once the ingredient and energy estimates are combined. A budget-range tin of chickpeas costs around 41 to 45p for 400g, of which roughly 240g is drained chickpeas once the liquid is poured off. On gas, dried and tinned chickpeas land in a similar range. On an electric hob, the tin is the more reliably cheaper option once energy is accounted for.',
  'Lentils are simpler to cost. Tesco own-brand dried red lentils cost around £2.60 per kg, checked the same date. They need no soaking and cook in around 25 minutes, so using the same rough energy assumptions, the cooking cost falls to somewhere in the region of 3p to 5p on gas, or 10p to 15p on electric. Using these assumptions, dried lentils are likely to remain cheaper than the tinned products checked, even with cooking energy included, though promotions, tariffs and different appliances could narrow that gap. The cooked yield follows a similar ratio to chickpeas.',
  'None of this means dried pulses are the wrong choice. It means the saving depends on the pulse, the brand, the hob and how much of the bag gets used, rather than on the shelf price alone.',
  "Convenience still matters, separately from cost. A tin can be opened and used within minutes. Cooking from dried takes planning: chickpeas need soaking the night before, and even a modest batch takes over an hour of largely unattended simmering. That doesn't mean the whole bag has to go in at once; measuring out only what's needed for one dinner avoids ending up with more cooked pulses than the household will use.",
  "The cheapest price per gram isn't always the cheapest outcome for a particular household, once cooked yield and energy are factored in. Lentils tend to reward buying dried. Chickpeas are closer to a toss-up and depend heavily on brand and hob type, and tinned is often the simpler choice unless there's a plan to use a full batch across more than one dinner.",
])}${costDisclosures}</section>
<section><h2>Choosing the right pulse for the dish</h2><p>Pulses are not interchangeable. Red lentils collapse into a sauce; chickpeas hold their shape and bite. Picking the wrong one changes a dish more than many cooks expect.</p><div class="guide-table-wrap"><table><thead><tr><th>Pulse</th><th>Suitable uses</th><th>What it contributes</th></tr></thead><tbody>${rows}</tbody></table></div><p>As a rough guide, reach for red lentils when a dish needs thickening, and for chickpeas, cannellini or butter beans when it needs something to bite into.</p></section>
<section><h2>Stretching meat-based dinners</h2>${paragraphs([
  'Lentils or beans can reduce the amount of meat needed in a bolognese-style sauce, chilli, cottage pie, sausage casserole or chicken stew. This works best when the pulses go in early enough to take on the flavour of the dish, in a modest proportion relative to the meat.',
  "The honest version is that pulses do change a dish. A cottage pie built around equal parts lentils and mince looks and tastes different from one made with mince alone. That is not necessarily a problem, but it is worth trying a modest ratio first, perhaps replacing a third of the meat, and adjusting liquid and seasoning from there.",
])}</section>
<section><h2>Making pulse-based dinners taste satisfying</h2>${paragraphs([
  'Underseasoning is likely to be part of why people go off pulses, though texture plays a role too. Build flavour from onion, garlic and spices early. Finish with lemon, lime or vinegar to cut through earthiness. Add savoury depth with stock, miso or hard cheese. Contrast the soft texture with a green vegetable, toasted seeds or crisp roasted chickpeas. Fresh herbs or yoghurt can lift a dish that has tasted flat through the middle of cooking.',
])}</section>
<section><h2>Getting more than one dinner from a pack</h2>${paragraphs([
  'A single tin or bag of pulses rarely needs to disappear into one dish. Chickpeas, for instance, can move across a week: a chickpea and vegetable curry, crushed chickpeas on toast with lemon and herbs, then roasted chickpeas added to a tray of vegetables.',
  'Lentils can do something similar: worked into a tomato and mince sauce one night, turned into a lentil and vegetable soup the next, then served spiced with rice and yoghurt later in the week.',
  "Opened tins should be stored, covered, in the fridge according to the instructions on the label. Tesco's own tinned chickpeas, for example, specify moving any unused contents into a covered container, refrigerating, and using within three days. Once lentils or chickpeas have been cooked from dried, or made into a sauce or soup at home, the general Food Standards Agency guidance for cooked food applies instead: eat within two days of cooking, or freeze. These are two different situations rather than conflicting advice: one is manufacturer guidance for an opened, unheated product, the other is general guidance for food cooked in your own kitchen.",
  "Cooked batches of dried pulses freeze well once cooled, which is often more useful than a bag that's produced more than the household will get through in that time.",
])}</section>
<section><h2>Food safety</h2>${paragraphs([
  "Dried pulses should be prepared according to the instructions on the packet, particularly soaking and cooking times, since these vary by type and brand. Dried kidney beans need particular care. According to the Food Standards Agency's natural toxins factsheet, dried red kidney beans contain natural toxins called lectins, which can cause stomach ache and vomiting; these are destroyed if the beans are soaked for at least 12 hours and then boiled vigorously for at least 10 minutes in fresh water. Tinned kidney beans have already been through this process as part of canning and can be used without further treatment.",
  "Tinned pulses are already cooked as part of the canning process, which is part of why they're convenient. Once a tin is opened, any unused contents should be moved into a separate container and refrigerated rather than left in the tin.",
  "For anything cooked at home, a pot of lentils, a batch of soaked and boiled chickpeas, general Food Standards Agency guidance applies: cool food as quickly as reasonably possible and get it into the fridge within two hours of cooking, rather than leaving it to cool on the side for longer. Once refrigerated, leftovers are best eaten within two days, or frozen if that's not realistic. Don't rely on smell to judge whether something's still fine to eat; use dates and storage instructions instead.",
])}${safetyDisclosures}</section>
<section><h2>Nutrition and 5 A Day</h2>${paragraphs([
  'Beans, lentils and chickpeas count towards 5 A Day, but only as one portion, however much you eat or however many types you combine. A portion is 80g, roughly three heaped tablespoons, according to NHS guidance checked 25 July 2026.',
  "Pulses are a useful source of fibre and protein, and a reasonable way to eat less meat across a week without a household feeling short-changed. They are not a direct nutritional substitute for meat in every respect, and treating them as one is not necessary to get value from using them.",
])}</section>
<section><h2>When pulses may not be the best choice</h2>${paragraphs([
  "Pulses don't suit every dinner or every household. Some people find beans and lentils cause digestive discomfort, particularly in large amounts or when eaten more often than the gut is used to. Texture is a genuine sticking point for some cooks, however well the dish is seasoned. Dried varieties need planning ahead, which doesn't always fit around a working week. Some tinned or flavoured pulse products carry more salt than a home-cooked version, so it's worth checking the label where that matters. And buying an unfamiliar variety for a single recipe can undo any saving if the rest of the bag goes unused.",
  "Where any of that applies, it's reasonable to start with a familiar dish, a chilli or a bolognese-style sauce, rather than a pulse-led curry from scratch, and build up from there.",
])}</section>
<section><h2>In short</h2>${paragraphs([
  "Pulses offer good value when they suit the dish, are seasoned properly and are bought in a form the household will actually use. A cheap bag of chickpeas sitting untouched in the cupboard is not a saving; it is just a bag of chickpeas.",
])}</section>
<section><h2>Frequently asked questions</h2>${faqs}</section>
<section><h2>Sources and further reading</h2><p>Prices and guidance checked 25 July 2026. Cooked-yield ratios and hob-energy use are kitchen and industry approximations and vary by product, appliance and method.</p><ul>${sources}</ul></section>
<section><h2>Related guides</h2><ul><li><a href="/food-costs/make-low-cost-dinners-more-interesting">Make low-cost dinners more interesting</a></li><li><a href="/food-costs/five-dinners-same-ingredients">Plan five dinners around shared ingredients and complete packs</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-costs/fresh-or-frozen">Fresh or frozen: which suits the way you cook?</a></li><li><a href="/pricing-methodology">How DinnerByDesign calculates ingredient prices</a></li></ul></section>
${footer}</article><section><h2>Find a dinner built around pulses</h2><p>Search DinnerByDesign for dinners using lentils, beans or chickpeas.</p><p><a href="/signin">Find pulse-based dinners</a></p></section></main></div>`;
}
