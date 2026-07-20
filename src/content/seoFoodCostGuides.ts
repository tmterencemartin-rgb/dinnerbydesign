import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
  LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER,
  LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES,
  LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES,
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
