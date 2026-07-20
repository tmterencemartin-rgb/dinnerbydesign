import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  COOKING_FOR_ONE_DISCLOSURES,
  COOKING_FOR_ONE_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
  LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER,
  LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES,
  LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES,
  OFFAL_BUDGET_DISCLOSURE_FOOTER,
  OFFAL_PRICE_DISCLOSURES,
  OFFAL_SAFETY_DISCLOSURES,
  PORTION_PLANNING_DISCLOSURE_FOOTER,
  PORTION_PLANNING_DISCLOSURES,
  UK_FOOD_COST_CONTEXT_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export interface FoodCostGuideSource {
  label: string;
  url: string;
}

export const UK_FOOD_COSTS_2026_PATH = '/food-costs/uk-food-costs-2026';

export const UK_FOOD_COSTS_2026 = {
  title: 'Why UK food costs are rising in 2026 — and what it means for your shopping',
  description: 'A clear guide to UK food price inflation in 2026, what national figures mean for household shopping, and how planning dinners can help control costs and waste.',
  publishedAt: '2026-07-18',
  reviewedAt: '2026-07-19',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Understand current UK food-price changes and practical household budgeting implications',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-19',
  editorialNotes: 'Recheck official releases, forecast dates and all numerical claims before changing the review date.',
  internalLinks: ['/dinner-plans/5-dinners-for-2-under-40', '/pricing-methodology'],
  disclosures: ['source_timing', 'price_comparison'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'ONS, Consumer price inflation, UK: May 2026', url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/may2026' },
    { label: 'British Retail Consortium, Summer discounting keeps shop price inflation stable', url: 'https://brc.org.uk/news-and-events/news/corporate-affairs/2026/ungated/summer-discounting-keeps-shop-price-inflation-stable/' },
    { label: 'Which?, Food price inflation tracker', url: 'https://www.which.co.uk/reviews/supermarkets/article/food-price-inflation-tracker-aU2oV0A46tu3' },
    { label: 'Food Foundation, Food Prices Tracker: June 2026', url: 'https://foodfoundation.org.uk/news/food-prices-tracker-june-2026' },
    { label: 'Food and Drink Federation, 2026 food inflation forecast', url: 'https://www.fdf.org.uk/wales/fdf/news-media/press-releases/2026/fdf-revises-food-inflation-forecast-to-at-least-9-by-the-end-of-2026/' },
    { label: 'IGD, June 2026 food inflation forecast', url: 'https://www.igd.com/articles/igd-releases-new-food-inflation-forecast/73470' },
  ] satisfies FoodCostGuideSource[],
};

export function getUkFoodCosts2026JsonLd() {
  const guide = UK_FOOD_COSTS_2026;
  const url = `https://dinnerbydesign.app${UK_FOOD_COSTS_2026_PATH}`;
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
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderUkFoodCosts2026InitialHtml() {
  const guide = UK_FOOD_COSTS_2026;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(UK_FOOD_COST_CONTEXT_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml();
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 18 July 2026 · Last reviewed 19 July 2026</p><article><section><h2>What is happening</h2><p>UK food price inflation eased through the first half of 2026. The most recent confirmed figure from the <a href="${escapeHtml(guide.sources[0].url)}">ONS</a> is 2.2 per cent for the 12 months to May 2026, down from 3.7 per cent in April.</p><p>Two faster trackers gave an early reading for June. The <a href="${escapeHtml(guide.sources[1].url)}">BRC</a> recorded 2.4 per cent, while <a href="${escapeHtml(guide.sources[2].url)}">Which?</a> recorded 2.6 per cent. Their baskets and collection methods differ from the ONS, so the figures should not be treated as directly interchangeable.</p><p>The ONS is the official reference point used here. The next confirmed figure was due on 22 July 2026 when this guide was reviewed.</p></section><section><h2>What it could mean for your shopping</h2><p>National figures describe an average across the country and many kinds of shopping. They provide useful context, but they cannot predict what one household will spend. That depends on the dinners cooked, the ingredients bought and where the shopping is done.</p><p>For context, the <a href="${escapeHtml(guide.sources[3].url)}">Food Foundation</a>'s tracked weekly shopping basket cost £53.51 to £60.24 in June 2026, up 30.6 to 38.4 per cent since April 2022.</p><p>DinnerByDesign works differently. Its estimates are built from the specific dinners, quantities and ingredient prices in a plan, not from a national average.</p></section>${disclosures}<section><h2>Why planning can make a difference</h2><ul><li>Reuse core ingredients across several dinners so less is bought and wasted.</li><li>Filter for lower-cost dinner ideas before deciding what to cook.</li><li>Use cheaper equivalent ingredients where a dinner allows it.</li><li>Work from a shopping list tied to scheduled dinners to avoid unplanned or duplicate purchases.</li></ul></section><section><h2>Ways DinnerByDesign can help</h2><p>DinnerByDesign's Low Cost filter surfaces suitable dinner ideas using lower-cost ingredients. Schedule one or more saved dinners and DinnerByDesign generates a costed shopping list, so you can review the estimate before you shop.</p><p><a href="/dinner-plans/5-dinners-for-2-under-40">Explore five dinners for two under £40</a> or <a href="/pricing-methodology">read how ingredient prices are calculated</a>.</p></section><section><h2>How the trackers differ</h2><ul><li><strong>ONS Consumer Prices Index:</strong> the official reference basket, published after each month ends.</li><li><strong>BRC Shop Price Index:</strong> shelf prices from major retailers, published faster but with different basket weightings.</li><li><strong>Which? tracker:</strong> around 27,000 individual product prices across major supermarkets.</li></ul><p>Different baskets, weightings and collection dates can produce different rates for the same period.</p></section><section><h2>Forecasts are not measured outcomes</h2><p>The <a href="${escapeHtml(guide.sources[4].url)}">Food and Drink Federation</a> forecast food inflation of at least 9 per cent by the end of 2026. <a href="${escapeHtml(guide.sources[5].url)}">IGD's June forecast</a> projected a peak of 5.5 per cent and an average of 3.7 to 4.7 per cent across 2026.</p><p>The forecasts differ because their assumptions, timing and scenarios differ. They are uncertain projections and should not be read as recorded price changes.</p></section><section><h2>Sources</h2><ul>${sources}</ul></section></article>${disclosureFooter}<p><a href="/signin">Plan my week</a></p></main></div>`;
}

export const LOWER_COST_CUTS_PATH = '/food-costs/cooking-for-four-with-lower-cost-cuts';

export const LOWER_COST_CUTS_GUIDE = {
  title: 'How to compare meat cuts when cooking for four',
  seoTitle: 'Lower-cost family dinners: comparing meat cuts | DinnerByDesign',
  description: 'How to compare meat cuts for four servings using pack price, usable yield, cooking method and storage considerations.',
  publishedAt: '2026-07-19',
  reviewedAt: '2026-07-19',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Compare meat cuts for four servings using current pack price, usable yield and suitable cooking methods',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-19',
  editorialNotes: 'The £6 calculation is illustrative arithmetic, not a market-price estimate. Review FSA guidance and AHDB links before changing the content review date.',
  internalLinks: ['/food-costs/uk-food-costs-2026', '/pricing-methodology', '/food-safety', '/recipe-methodology'],
  disclosures: ['price_comparison', 'serving_assumption', 'source_timing', 'storage_and_cooking'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: cooking guidance', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
    { label: 'Food Standards Agency: chilling and leftover guidance', url: 'https://www.food.gov.uk/research/food-and-you-2/food-and-you-2-wave-9-key-findings?print=1' },
    { label: 'AHDB Meat Purchasing Guide', url: 'https://ahdb.org.uk/mpg' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Are lower-cost cuts lower quality?', answer: 'A lower price does not by itself indicate lower quality or safety. Price can reflect demand, the characteristics of the cut, preparation and retailer pricing. Nutritional composition varies by cut and product, so compare the label where this matters.' },
    { question: 'Do lower-cost cuts always take longer to cook?', answer: 'Cuts with more connective tissue, such as shin, shoulder and braising steak, generally need longer, slower cooking. Cuts with less connective tissue, such as thighs and drumsticks, generally cook more quickly.' },
    { question: 'Can one cut be substituted for another in a recipe?', answer: 'Only where the cooking method matches. A cut suited to slow braising will not produce the same result if substituted into a quick-roast recipe, and the reverse also applies.' },
    { question: 'How is cost compared between two cuts?', answer: 'Compare price per kilogram of usable weight on the same date, including any additional ingredients the method requires.' },
  ],
};

export function getLowerCostCutsJsonLd() {
  const guide = LOWER_COST_CUTS_GUIDE;
  const url = `https://dinnerbydesign.app${LOWER_COST_CUTS_PATH}`;
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
          { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url },
        ],
      },
    ],
  };
}

export function renderLowerCostCutsInitialHtml() {
  const guide = LOWER_COST_CUTS_GUIDE;
  const comparisonDisclosures = renderProgrammaticDisclosuresInitialHtml(LOWER_COST_CUTS_COMPARISON_DISCLOSURES);
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(LOWER_COST_CUTS_SAFETY_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(LOWER_COST_CUTS_DISCLOSURE_FOOTER);
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 19 July 2026 · Last reviewed 19 July 2026</p><article><section><p>Examples in this guide are based on four standard servings. The amount required may vary with age, appetite and the dishes served alongside. This guide sets out a method for checking whether a cut represents good value at the price on the shelf, rather than a fixed list of cheaper cuts. Price, yield, cooking time and additional ingredients all affect the result, so the method should be applied with the current price each time.</p></section>${comparisonDisclosures}<section><h2>What makes a cut better value?</h2><p>Value depends on price per kilogram, usable yield after bone, skin and fat are removed, and cooking time relative to the result. A cut with a low shelf price can cost more per serving once loss during preparation and cooking is accounted for. A full comparison also considers additional ingredients and whether the cut can be used across more than one dinner.</p></section><section><h2>Price per kilogram versus usable quantity</h2><p>Price per kilogram reflects the cost of the whole cut as sold, not the cost of what reaches the plate. Bone-in and skin-on cuts lose weight during trimming and cooking. Two cuts at the same shelf price can differ in cost per serving once usable quantity is calculated.</p><ul><li>Divide pack price by the estimated number of servings for an estimated cost per serving, or divide pack price by usable weight in grams and multiply by the grams required per serving.</li><li>Compare cuts on the same date, since prices vary by retailer and by week.</li><li>Include the cost of any stock, marinade or additional ingredients the method requires.</li></ul><p><strong>Illustrative calculation:</strong> if a pack costs £6.00 and provides four servings, the calculated cost is £1.50 per serving. Use the current pack price and the number of servings it provides for your household.</p></section><section><h2>Bone, fat, cooking loss and serving size</h2><p>Bone-in cuts and cuts with a higher fat content return less edible weight than boneless, trimmed cuts of the same starting weight. Cooking loss varies by cut, preparation and technique, so calculations should use a documented yield assumption rather than a universal percentage.</p></section><section><h2>Cooking-time and energy-cost considerations</h2><p>Cuts suited to long, slow cooking, such as shin and shoulder, typically need a low oven temperature over several hours or a slow cooker. Thighs and drumsticks generally need less time. Energy cost depends on appliance, temperature, duration and tariff, so a lower purchase price will not always mean a lower overall cost.</p></section><section><h2>Cuts to run the method on</h2><p>The cuts below are worth applying the method to using the price and pack size in front of you. None is presented here as cheaper; the result depends on the current price and the servings a pack yields.</p><ul><li><strong>Chicken thighs:</strong> bone-in or boneless, skin-on or skinless. Suited to roasting, braising and grilling.</li><li><strong>Chicken drumsticks:</strong> a bone-in cut worth comparing with breast and thighs on price per usable serving. Suited to roasting, braising and barbecuing.</li><li><strong>Pork shoulder:</strong> higher fat content. Suited to slow roasting or braising. A joint may supply more than one dinner.</li><li><strong>Beef shin:</strong> connective tissue breaks down during slow cooking. Suited to stews and braises.</li><li><strong>Braising steak:</strong> suited to slow, moist cooking. It becomes tough if cooked quickly at high heat.</li><li><strong>Turkey thigh:</strong> bone-in or boneless. Suited to roasting and braising. Availability varies by retailer and season.</li></ul></section><section><h2>Which cooking methods suit each cut?</h2><ul><li><strong>Roasting:</strong> chicken thighs, drumsticks, turkey thigh and pork shoulder.</li><li><strong>Braising:</strong> pork shoulder, beef shin and braising steak.</li><li><strong>Slow cooking:</strong> beef shin, braising steak and pork shoulder.</li><li><strong>Grilling or barbecuing:</strong> chicken thighs and drumsticks.</li></ul><p>Matching the method to the cut affects the result and cooking time, which in turn affects energy cost.</p></section><section><h2>Using one pack or joint across more than one dinner</h2><p>A larger joint or pack can supply servings for more than one dinner. Options include cooking a full joint and dividing the cooked meat, freezing raw portions in the quantity required for one dinner, or using cooked meat in a different recipe.</p><p>Label raw or cooked portions with the date before freezing. If a pack contains enough chicken thighs for eight of your household's usual servings, divide it into two four-serving portions. Use one for a traybake and freeze the other for a curry or braise, following the pack's storage instructions.</p></section><section><h2>Storage and food-safety guidance</h2>${safetyDisclosures}<ul><li>Keep the fridge at 5°C or below, and follow the product's storage instructions and use-by date.</li><li>Cook poultry thoroughly. Using a clean temperature probe, the centre should reach 70°C for two minutes, or 75°C for 30 seconds.</li><li>Cool leftovers and refrigerate or freeze them within two hours of cooking.</li><li>Eat refrigerated leftovers within 48 hours, or freeze them.</li><li>Defrost in the fridge, or use a microwave immediately before cooking.</li><li>Reheat only once, until steaming hot throughout.</li><li>Freeze before the use-by date and follow the pack instructions. Once fully defrosted, use within 24 hours.</li></ul></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/uk-food-costs-2026">Understand the wider UK food-cost picture</a>, <a href="/pricing-methodology">read the pricing methodology</a> or <a href="/food-safety">review storage and cooking safety</a>.</p></section></article>${disclosureFooter}<p><a href="/signin">Find lower-cost dinners for four</a></p></main></div>`;
}

export const LOW_COST_COOKING_TECHNIQUES_PATH = '/food-costs/low-cost-cooking-techniques';

export const LOW_COST_COOKING_TECHNIQUES_GUIDE = {
  title: 'Three low-cost cooking techniques for making ingredients go further',
  seoTitle: '3 low-cost cooking techniques | DinnerByDesign',
  description: 'Three low-cost cooking techniques for making ingredients go further, with practical UK substitutions, reuse guidance and food-safety notes.',
  publishedAt: '2026-07-20',
  reviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Find practical low-cost cooking techniques for making affordable ingredients go further in UK households',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-20',
  editorialNotes: 'Keep examples at technique level rather than turning them into complete recipes. Recheck the cited food-safety guidance before changing the review date.',
  internalLinks: ['/food-costs/uk-food-costs-2026', '/food-costs/cooking-for-four-with-lower-cost-cuts', '/food-safety', '/recipe-methodology'],
  disclosures: ['allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'UNESCO: Koshary, daily-life dish and associated practices', url: 'https://ich.unesco.org/en/RL/koshary-daily-life-dish-and-practices-associated-with-it-02278' },
    { label: 'Visit Tuscany: Ribollita recipe', url: 'https://www.visittuscany.com/en/recipes/reboiled-soup-a.k.a.-ribollita-recipe/' },
    { label: 'Food Standards Agency: Best-before and use-by dates', url: 'https://www.food.gov.uk/safety-hygiene/best-before-and-use-by-dates' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Can I use this technique without fish sauce?', answer: 'Yes. Soy sauce can provide savoury flavour, although it tastes different and usually contains gluten. Tamari may be suitable when a gluten-free option is needed, but always check the label.' },
    { question: 'Is koshary usually vegetarian?', answer: 'The combination described here contains no meat or animal-derived ingredients. Check any ready-made sauces and toppings because products vary.' },
    { question: 'Does bread need to be stale for ribollita?', answer: 'Dry bread works well because it absorbs liquid and thickens the soup. Use bread only while it remains safe to eat, and discard it if there is any visible mould.' },
    { question: 'Do I need specialist ingredients?', answer: 'No. The examples can be built from ingredients widely available in UK supermarkets, with the substitutions shown where useful.' },
    { question: 'Which staple ingredients are easiest to reuse across a week?', answer: 'Rice, pasta, bread, beans, lentils, tinned tomatoes and versatile vegetables can each contribute to several different dinners.' },
    { question: 'How can I plan a week around these techniques?', answer: 'Choose dinners that share a staple ingredient or sauce, use concentrated flavourings in small quantities, and schedule ingredients that need using soon earlier in the week.' },
  ],
};

export function getLowCostCookingTechniquesJsonLd() {
  const guide = LOW_COST_COOKING_TECHNIQUES_GUIDE;
  const url = `https://dinnerbydesign.app${LOW_COST_COOKING_TECHNIQUES_PATH}`;
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
          { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url },
        ],
      },
    ],
  };
}

export function renderLowCostCookingTechniquesInitialHtml() {
  const guide = LOW_COST_COOKING_TECHNIQUES_GUIDE;
  const productDisclosures = renderProgrammaticDisclosuresInitialHtml(LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES);
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER);
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>Traditional dishes can demonstrate practical ways to build dinners from a small set of affordable, versatile ingredients. This guide explains three techniques, with an example dinner for each and practical notes for using ingredients available in UK supermarkets.</p><p>The examples below illustrate individual cooking principles. They are not intended to rank whole national cuisines by cost, and no claim is made about which culinary traditions are cheapest overall.</p></section><section><h2>1. Building a dinner around a staple ingredient</h2><p>Rice, pasta and bread can form a substantial base for several dinners, with beans, vegetables and flavourings added in smaller quantities.</p><h3>Representative dinner: koshary</h3><p>Koshary is an Egyptian dish combining pasta, rice, lentils and chickpeas, layered with a spiced tomato sauce and fried onions. The version described here contains no meat or animal-derived ingredients, but individual sauces and toppings should still be checked.</p><h3>UK supermarket ingredients</h3><ul><li>Rice</li><li>Small pasta shapes, such as macaroni</li><li>Brown or green lentils, dried or tinned</li><li>Tinned chickpeas, or cooked dried chickpeas when time allows</li><li>Tinned tomatoes, onions, garlic and cumin</li></ul><p><strong>Substitution:</strong> use tinned lentils in place of dried lentils to reduce preparation time, noting that the texture may differ.</p><p><strong>Reusing ingredients:</strong> a larger batch of lentils or tomato sauce can be cooked once and used across two or three dinners during the week.</p><p><strong>Why it works:</strong> several filling staple ingredients are combined with one strongly flavoured sauce, rather than relying on a large portion of meat.</p><p><strong>Allergen note:</strong> contains gluten in the pasta. Check individual product labels, including any ready-made crispy onions or sauces.</p></section><section><h2>2. Using a concentrated flavouring in small quantities</h2><p>Rather than relying on a large quantity of meat, some dishes use a small amount of a concentrated, salty or savoury ingredient to flavour a larger quantity of grain or noodles.</p><h3>Example dinner: vegetable rice noodles with fish sauce</h3><p>This is a simple UK-adapted dinner illustrating the technique rather than a named traditional dish. A small quantity of fish sauce can add savoury depth to rice noodles and vegetables.</p><h3>UK supermarket ingredients</h3><ul><li>Rice noodles</li><li>Fish sauce</li><li>Spring onions and garlic</li><li>Vegetables such as pak choi or spring greens</li></ul><p><strong>Substitutions:</strong> use soy sauce as a fish-free alternative, noting that the flavour differs. Tamari may be an option where gluten needs to be avoided, subject to the product label.</p><p><strong>Why it can offer practical value:</strong> fish sauce is used in small quantities, so one bottle can contribute to several dinners. This does not mean it is inexpensive to buy; the practical value comes from using a little at a time.</p><p><strong>Why it works:</strong> adding a concentrated savoury ingredient gradually allows a small amount to flavour noodles and vegetables.</p></section>${productDisclosures}<section><h2>3. Reusing bread or vegetables across further dinners</h2><p>Some dishes make purposeful use of bread that has become dry or vegetables that remain safe to eat but need using soon.</p><h3>Representative dinner: ribollita</h3><p>Ribollita is a Tuscan soup made by combining stale bread with cannellini beans, cabbage or cavolo nero, and other vegetables.</p><h3>UK supermarket ingredients</h3><ul><li>Dry or stale bread that remains safe to eat; never bread with visible mould</li><li>Tinned cannellini beans</li><li>Cabbage or other vegetables that remain safe to eat but need using soon</li><li>Olive oil and garlic</li></ul><p><strong>Substitutions:</strong> use butter beans or haricot beans in place of cannellini beans. Use a cooking oil already in the cupboard rather than buying a separate oil.</p><p><strong>Reusing ingredients:</strong> safe, usable bread and vegetables already in the household can contribute to a further dinner before they are wasted.</p><p><strong>Food-safety note:</strong> bread becoming dry or hard is a quality change rather than a safety risk. Visible mould is a safety risk, so discard mouldy bread.</p><p><strong>Allergen note:</strong> bread usually contains gluten. Check any stock cubes and other packaged ingredients.</p><p><strong>Why it works:</strong> bread thickens a bean and vegetable soup while using an ingredient that might otherwise be discarded.</p></section>${safetyDisclosures}<section><h2>Applying the three techniques together</h2><ul><li>Choose a versatile staple as the base for more than one dinner.</li><li>Use a concentrated flavouring sparingly to add depth.</li><li>Plan a further dinner around safe, usable bread or vegetables that need using soon.</li></ul><p>DinnerByDesign's Low Cost filter can help identify suitable dinners, while Plan My Week can organise choices around your household and ingredients.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/uk-food-costs-2026">Understand the wider UK food-cost picture</a>, <a href="/food-costs/cooking-for-four-with-lower-cost-cuts">compare meat cuts when cooking for four</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${disclosureFooter}<section><h2>Make your ingredients go further</h2><p>Use the Low Cost filter and Plan My Week to find suitable dinners for your household.</p><p><a href="/signin">Find low-cost dinners</a></p></section></main></div>`;
}

export const COOKING_FOR_ONE_PATH = '/food-costs/cooking-for-one-without-waste';

export const COOKING_FOR_ONE_GUIDE = {
  title: 'Cooking for one without overspending or wasting ingredients',
  seoTitle: 'Cooking for one without overspending or waste | DinnerByDesign',
  description: 'Practical ways to plan varied dinners for one, reuse ingredients, choose suitable pack sizes and reduce avoidable food waste.',
  publishedAt: '2026-07-20',
  reviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Plan varied dinners for one while managing ingredient spending and reducing avoidable food waste',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-20',
  editorialNotes: 'Keep advice practical and flexible. Recheck the cited food-safety guidance before changing the review date.',
  internalLinks: ['/food-costs/low-cost-cooking-techniques', '/food-safety', '/recipe-methodology'],
  disclosures: ['allergen_and_product', 'serving_assumption', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'How can I avoid wasting ingredients when recipes serve more than one?', answer: 'Choose dinners that share core ingredients, buy loose where you can, and freeze or repurpose the extra portion of anything a recipe makes rather than letting it sit unused.' },
    { question: "Is batch cooking worthwhile when I'm cooking only for myself?", answer: 'Yes. The value comes from cooking a component once, such as a grain, sauce or tray of roasted vegetables, and finishing it differently each time rather than eating one identical dinner repeatedly.' },
    { question: 'How do I stop several dinners tasting the same?', answer: 'Change the finish, not the base. A different spice blend, sauce, or crunchy or fresh element added at the end can change the character of a dinner.' },
    { question: 'Which ingredients are easiest to reuse across different dinners?', answer: 'Grains, beans and lentils, tinned tomatoes, onions and roasted vegetables all take well to different flavour directions. Storage depends on the specific product and dish, so check suitability before freezing or keeping anything for later.' },
    { question: 'Should I buy smaller packs or divide larger packs?', answer: 'Either can work. Smaller or loose quantities can reduce surplus; larger packs can still work if the contents are suitable for freezing and you divide them promptly.' },
    { question: 'How can DinnerByDesign help me plan for one person?', answer: 'Use the search and planning tools to find dinners that share ingredients and build a short sequence rather than a full week, so nothing sits unused.' },
  ],
};

export function getCookingForOneJsonLd() {
  const guide = COOKING_FOR_ONE_GUIDE;
  const url = `https://dinnerbydesign.app${COOKING_FOR_ONE_PATH}`;
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
          { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url },
        ],
      },
    ],
  };
}

export function renderCookingForOneInitialHtml() {
  const guide = COOKING_FOR_ONE_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(COOKING_FOR_ONE_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(COOKING_FOR_ONE_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>Half a bag of spinach going soft in the drawer. A bunch of coriander bought for one recipe, most of it left over. A pack of chicken thighs sized for four, when you only wanted two. Cooking for one often means working around packaging built for someone else&#039;s household, and it&#039;s easy to end up either throwing food away or eating the same dinner three nights running.</p><p>Neither has to be the trade-off. With a little planning, the same handful of ingredients can move in several different directions across a few days — a different spice, a different texture, a different feel — without extra shopping trips or a freezer full of identical containers.</p></section><section><h2>Plan a short sequence, not a rigid week</h2><p>Rather than mapping out a full week, choose three or four dinners at a time that share two or three core ingredients — a vegetable, a grain, a tin of something. A short sequence like this is easier to stick to than a rigid plan, and it leaves room to swap a dinner in or out if your week changes. It also means less produce sitting forgotten at the back of the fridge, because everything you&#039;ve bought already has somewhere to go.</p></section><section><h2>Buy ingredients that can do more than one job</h2><p>When you&#039;re choosing what to buy, look for ingredients that can cross into more than one style of dinner. A tray of vegetables for roasting, a tin of chickpeas and a pot of a grain such as couscous or bulgur wheat can each be cooked once and then taken in different directions with whatever you add afterwards. The versatility comes from the flavourings you finish with, not from buying something different for every dinner.</p></section><section><h2>Cook once, then change direction</h2><p>There&#039;s a difference between eating the same dinner three times and cooking one component once to use three ways. A tray of roasted vegetables, a pot of cooked grain, a pan of softened onion and garlic, or a simple tomato base can each be finished in a different direction — stirred through lemon and yogurt one night, folded into a spiced stew the next, tossed with ginger and soy after that. The cooking happens once; the dinner changes each time.</p></section><section><h2>Right-size fresh ingredients, and freeze early</h2><p>Where your supermarket sells fruit and vegetables loose, buying only the amount you&#039;ll use avoids the choice between a fixed pack and a fridge drawer of leftovers. For fresh meat, fish or vegetables you won&#039;t get through in a day or two, freezing them while they&#039;re still fresh protects both quality and your food budget more than leaving the decision until the last moment.</p><p>Divide food into individual portions and label them clearly before freezing, rather than freezing one large block — it&#039;s much easier to take out exactly what you need.</p></section>${disclosures}<section><h2>Build a flexible cupboard</h2><p>A small set of tinned, dried and frozen staples makes it much easier to put a dinner together without a shop: rice, pasta, lentils, chickpeas, tinned tomatoes, eggs and a bag of frozen vegetables between them cover a wide range of dinners on their own. What stops them feeling repetitive is what you add at the end — a spoonful of a spiced paste, a squeeze of lemon, a scattering of toasted seeds, a spoonful of yogurt or a chilli-flecked oil. The base stays simple; the finish is where the dinner changes character.</p></section><section><h2>Reduce effort without reducing variety</h2><p>Preparing aromatics — chopped onion, garlic, ginger — in one go, and keeping a base sauce or stock ready in the fridge or freezer, cuts down on the small repeated tasks that can make cooking for one feel like more effort than it should. A short rotation of dinners you know well is worth keeping too, not as a limit, but as a dependable starting point to build from when you feel like trying something new.</p></section><section><h2>A three-dinner example</h2><p>Roast a tray of onions, peppers and courgettes, and warm through a tin of chickpeas alongside a pot of a cooked grain such as couscous or bulgur wheat. From there:</p><ul><li>Take a portion in a North African-inspired direction: a spiced paste, a squeeze of lemon and a spoonful of yogurt or a plant-based alternative on top.</li><li>Take another towards a tomato and smoked paprika stew, finished with a slice of toasted bread for crunch.</li><li>Use what&#039;s left in a ginger, garlic and soy-inspired bowl, with something crisp and fresh — sliced spring onion or a handful of beansprouts — added at the end.</li></ul><p>Same roasting tray, same tin of chickpeas, same pot of grain — three distinctly different dinners. This sequence is an illustration of the technique rather than a claim about how any particular dish is traditionally made, and it&#039;s a starting point rather than a complete recipe with fixed quantities.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/low-cost-cooking-techniques">Explore low-cost cooking techniques</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${disclosureFooter}<section><h2>Make your ingredients work harder</h2><p>Use DinnerByDesign to find suitable dinners, save your choices and plan around ingredients you want to use well.</p><p><a href="/signin">Plan dinners for one</a></p></section></main></div>`;
}

export const OFFAL_BUDGET_GUIDE_PATH = '/food-costs/cooking-with-offal-on-a-budget';

export const OFFAL_BUDGET_GUIDE = {
  title: 'Cooking with offal on a budget: what to buy and how to use it',
  seoTitle: 'Cooking with offal on a budget | DinnerByDesign',
  description: 'A practical UK guide to buying and cooking liver, kidney and heart, with current price comparisons, flavour ideas and essential safety guidance.',
  publishedAt: '2026-07-20',
  reviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Learn whether offal can reduce dinner costs and how to buy and cook liver, kidney and heart safely',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-20',
  editorialNotes: 'Recheck retailer prices and the cited FSA and NHS guidance before changing the review date.',
  internalLinks: ['/food-costs/low-cost-cooking-techniques', '/pricing-methodology', '/food-safety', '/recipe-methodology'],
  disclosures: ['price_comparison', 'source_timing', 'storage_and_cooking', 'allergen_and_product', 'serving_assumption'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food?ContensisTextOnly=true' },
    { label: 'NHS: Vitamin A', url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-a/' },
    { label: 'NHS: Foods to avoid in pregnancy', url: 'https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/' },
    { label: 'Tesco: Lamb liver, heart and kidney', url: 'https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-meat-and-poultry/fresh-lamb/lamb-liver' },
    { label: 'Tesco: Lamb mince', url: 'https://www.tesco.com/shop/en-GB/products/261941310' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Is offal difficult to cook?', answer: 'Liver often cooks quickly, while kidney can suit quick or slow cooking depending on the type and preparation. Heart can be cooked slowly or sliced thinly and cooked quickly. Follow a recipe written for the specific offal.' },
    { question: 'Can I substitute offal for ordinary meat in a recipe?', answer: 'Not directly in most cases. Offal has different flavour, texture and cooking requirements, so use a recipe designed for the ingredient.' },
    { question: 'Is liver safe to eat pink?', answer: 'No. The Food Standards Agency advises cooking liver and other offal thoroughly until steaming hot throughout.' },
    { question: 'How often can I eat liver?', answer: 'The NHS advises against eating liver or liver products more than once a week. Liver and liver products should be avoided during pregnancy.' },
    { question: 'Where can I buy heart, tongue or tripe?', answer: 'Availability is less consistent than liver or kidney. A local butcher may be able to source and prepare them, so check before travelling.' },
    { question: 'Is offal always the cheapest option?', answer: 'No. It is often less expensive per kilogram than familiar cuts, but current price, pack size, edible yield and the total cost of the dinner all matter.' },
    { question: 'Can DinnerByDesign help me find offal options?', answer: 'Yes. Search directly for liver, kidney, heart or other offal. You can also turn on Include offal in suggestions in Recipe preferences, or choose Offal in Plan my week for a single plan. Product availability and suitability vary.' },
  ],
};

export function getOffalBudgetGuideJsonLd() {
  const guide = OFFAL_BUDGET_GUIDE;
  const url = `https://dinnerbydesign.app${OFFAL_BUDGET_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
  ] };
}

export function renderOffalBudgetGuideInitialHtml() {
  const guide = OFFAL_BUDGET_GUIDE;
  const price = renderProgrammaticDisclosuresInitialHtml(OFFAL_PRICE_DISCLOSURES);
  const safety = renderProgrammaticDisclosuresInitialHtml(OFFAL_SAFETY_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(OFFAL_BUDGET_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>Liver, kidney and heart can cost less than more familiar cuts, but they are not direct substitutes. Each brings its own flavour, texture and cooking requirement. Used thoughtfully — with onions, vegetables, grains, pulses and assertive seasonings — they can produce satisfying, characterful dinners without relying on a large quantity of meat.</p></section><section><h2>Why consider offal?</h2><p>Offal can bring meat into a dinner as a smaller, supporting element rather than the centrepiece. It is one option among several for managing ingredient spending, not something any household needs to adopt.</p></section><section><h2>Is it necessarily less expensive?</h2><p>Often, but not always. Price snapshot, 20 July 2026: Tesco listed lamb liver at £6.15/kg, lamb heart at £7.30/kg and lamb kidney at £8.00/kg, compared with lamb mince from £13.00/kg. Prices, ranges and availability change, so check the current shelf price.</p>${price}</section><section><h2>Liver, kidney and heart: how they differ</h2><ul><li><strong>Liver:</strong> soft in texture and mild to rich in flavour. Thin, evenly sized pieces cook through quickly.</li><li><strong>Kidney:</strong> firmer, with a distinct mineral flavour. It usually needs its white core trimmed and can suit quick or slow cooking.</li><li><strong>Heart:</strong> denser and leaner, closer to a muscle cut. Cook it long and slow, or slice it thinly for quick cooking.</li></ul></section><section><h2>Flavours that work well</h2><ul><li><strong>Liver:</strong> onions, sage, mustard, vinegar or sherry.</li><li><strong>Kidney:</strong> mustard, Worcestershire sauce, paprika, stock or ale.</li><li><strong>Heart:</strong> garlic, chilli, citrus or a vinegar-based marinade.</li></ul></section>${safety}<section><h2>Three approachable starting points</h2><ul><li>Thoroughly cooked lamb liver with onions, mustard and vinegar.</li><li>Kidney with root vegetables in a rich gravy.</li><li>Slow-cooked heart with garlic, smoked paprika and tomatoes.</li></ul></section><section><h2>Availability in supermarkets and butchers</h2><p>Liver and kidney are stocked fairly reliably by major UK supermarkets. Heart, tongue and tripe are less consistent, and a local butcher may be able to source and prepare them.</p></section><section><h2>Vitamin A, pregnancy and food-safety guidance</h2><p>The NHS advises against eating liver or liver products such as pâté more than once a week. Liver and liver products should be avoided during pregnancy. Follow the cited NHS and Food Standards Agency guidance.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Find offal dinners and products</h2><p>Search DinnerByDesign for liver, kidney, heart and other offal options, then compare suitable dinners and ready-made products in one place.</p></section><section><h2>Sources and further reading</h2><p>Guidance and prices reviewed 20 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/low-cost-cooking-techniques">Explore low-cost cooking techniques</a>, <a href="/pricing-methodology">read the pricing methodology</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Find suitable offal options</h2><p>Use DinnerByDesign to search directly or include offal in your personalised suggestions.</p><p><a href="/signin">Find offal dinners</a></p></section></main></div>`;
}

export const PORTION_PLANNING_GUIDE_PATH = '/food-costs/portion-planning-and-food-waste';

export const PORTION_PLANNING_GUIDE = {
  title: 'How portion planning can help reduce food costs and waste',
  seoTitle: 'Can Portion Planning Reduce Food Costs? | DinnerByDesign',
  description: 'Learn how realistic portions, planned leftovers and better use of supermarket pack sizes can help reduce food spending and waste.',
  publishedAt: '2026-07-20', reviewedAt: '2026-07-20', contentReviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Food cost guide',
  primarySearchIntent: 'Understand how portion planning, planned leftovers and pack-size awareness can reduce food spending and waste',
  indexingStatus: 'index' as const,
  editorialNotes: 'The 300g and 500g example is illustrative arithmetic, not a retailer or product claim. Recheck FSA guidance before changing the review date.',
  internalLinks: ['/food-costs/cooking-for-one-without-waste', '/food-costs/low-cost-cooking-techniques', '/pricing-methodology', '/food-safety'],
  disclosures: ['serving_assumption', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely' },
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food?ContensisTextOnly=true' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Does cooking smaller portions always reduce the checkout cost?', answer: 'No. Many ingredients are sold in fixed pack sizes, so cooking less does not necessarily mean buying less. The value depends on what happens to the unused part of the pack, not just how much you serve.' },
    { question: 'Should I halve a recipe written for four?', answer: 'It can work well if your household is smaller and you do not want leftovers. Cooking the full recipe and planning the extra portions is equally reasonable and can make better use of a fixed pack size.' },
    { question: 'When is cooking extra more economical?', answer: 'When there is a specific plan for the extra before you start cooking — another dinner, a lunch or the freezer. Extra that is cooked without a plan and thrown away is not a saving.' },
    { question: 'Which ingredients are most useful to portion before cooking?', answer: 'More expensive ingredients such as meat, fish and cheese are worth particular attention because changing their quantity usually makes the greatest difference to the cost of a dinner.' },
    { question: 'How does DinnerByDesign calculate cost per portion?', answer: 'Cost per portion reflects the value of the ingredients used in a dinner at the number of servings you set. It does not necessarily match your checkout total because complete packs usually have to be bought.' },
  ],
};

export function getPortionPlanningGuideJsonLd() {
  const guide = PORTION_PLANNING_GUIDE; const url = `https://dinnerbydesign.app${PORTION_PLANNING_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
  ] };
}

export function renderPortionPlanningGuideInitialHtml() {
  const guide = PORTION_PLANNING_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(PORTION_PLANNING_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(PORTION_PLANNING_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>It is easy to assume that cooking more is generous and cooking less saves money. In practice, the two do not always match up. Cooking too much of an expensive ingredient can quietly push up what a dinner costs, while serving smaller portions does not automatically reduce the supermarket checkout because much of what you buy comes in a fixed pack.</p></section><section><h2>Portion planning, not portion control</h2><p>Portion planning is not about eating less. It is about deciding before you cook how many people a dinner is meant to serve and whether any extra portions have a specific purpose.</p></section><section><h2>Where portion planning makes the greatest difference</h2><p>Portion planning has the biggest effect on ingredients that cost the most, particularly meat, fish and cheese. Vegetables, pulses, grains, potatoes and a well-flavoured sauce can provide volume, texture and flavour around a smaller quantity of the priciest ingredient.</p></section><section><h2>Why checkout costs do not always fall</h2><p>If a dinner needs 300g of mince and the smallest available pack is 500g, the full pack still has to be bought. Keep two figures separate: the value of ingredients used in the dinner and the cost of the complete packs bought. The unused part provides further value when it is used in another dinner or stored safely for later.</p></section><section><h2>When cooking extra is economical</h2><p>A larger batch can make good use of a fixed pack when the extra has a purpose before cooking begins: another dinner, a lunch or the freezer.</p></section><section><h2>How to plan portions realistically</h2><p>Realistic portions depend on who you are feeding, their appetite and what else is being served. A household of two can halve a recipe written for four or cook the full amount and earmark the extra for later.</p></section>${disclosures}<section><h2>Practical ways to reduce waste</h2><ul><li>Weigh or measure more expensive ingredients rather than guessing.</li><li>Divide large packs into usable portions promptly.</li><li>Freeze suitable surplus and label leftovers with the date.</li><li>Schedule shared ingredients across several dinners.</li></ul></section><section><h2>Keeping lower-cost dinners satisfying</h2><p>A smaller quantity of chicken can be shredded through spiced rice with herbs and lime. Strong cheese can be grated through a gratin. Pulses and grains take on bold flavours from curry paste, harissa or toasted spices, allowing meat, fish or cheese to add character rather than bulk.</p></section><section><h2>How DinnerByDesign helps</h2><p>DinnerByDesign lets you set servings and see an estimated cost per portion. Build a week that reuses ingredients and generate a shopping list from scheduled dinners, so complete packs are bought with a plan for using them.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Making portion planning work</h2><p>Portion planning works best as part of a bigger picture: realistic servings, awareness of pack sizes, planned leftovers and a week of dinners that share ingredients. It is about making sure everything you buy gets used well.</p></section><section><h2>Sources and further reading</h2><p>Guidance reviewed 20 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/cooking-for-one-without-waste">Plan dinners for one without waste</a>, <a href="/food-costs/low-cost-cooking-techniques">explore low-cost cooking techniques</a>, <a href="/pricing-methodology">read the pricing methodology</a> or <a href="/food-safety">review food-safety guidance</a>.</p></section></article>${footer}<section><h2>Plan portions across your week</h2><p>Use DinnerByDesign to set servings, coordinate ingredients and create a shopping list from scheduled dinners.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
