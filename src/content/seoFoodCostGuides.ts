import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  BATCH_COOKING_DISCLOSURE_FOOTER,
  BATCH_COOKING_DISCLOSURES,
  COOKING_FOR_ONE_DISCLOSURES,
  COOKING_FOR_ONE_DISCLOSURE_FOOTER,
  FRESH_OR_FROZEN_DISCLOSURE_FOOTER,
  FRESH_OR_FROZEN_DISCLOSURES,
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
  LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER,
  LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES,
  LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES,
  MEDITERRANEAN_DISCLOSURE_FOOTER,
  MEDITERRANEAN_PRODUCT_DISCLOSURES,
  MEDITERRANEAN_SOURCE_DISCLOSURES,
  MEDITERRANEAN_STORAGE_DISCLOSURES,
  OFFAL_BUDGET_DISCLOSURE_FOOTER,
  OFFAL_PRICE_DISCLOSURES,
  OFFAL_SAFETY_DISCLOSURES,
  PORTION_PLANNING_DISCLOSURE_FOOTER,
  PORTION_PLANNING_DISCLOSURES,
  SUMMER_STEWS_DISCLOSURE_FOOTER,
  SUMMER_STEWS_DISCLOSURES,
  UK_FOOD_COST_CONTEXT_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';
import { renderCookingForOnePlanInitialHtml } from './cookingForOnePlan';

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
  title: 'Five dinners for one from one Aldi basket',
  seoTitle: 'Five dinners for one from one Aldi basket | DinnerByDesign',
  description: 'A costed five-dinner plan for one using four established recipes, with an Aldi basket, next-day lunches, freezer portions and leftover guidance.',
  publishedAt: '2026-07-20',
  reviewedAt: '2026-07-28',
  priceReviewedAt: '2026-07-27',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Find a costed five-dinner plan for one using a coordinated Aldi basket with realistic leftovers',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-28',
  editorialNotes: 'Monthly price review required. Recheck every Aldi basket line, the four publisher recipes and FSA guidance. Keep complete-pack checkout cost distinct from ingredient value used and do not introduce promotional prices.',
  internalLinks: ['/food-costs/ways-to-reduce-grocery-costs', '/food-costs/five-dinners-same-ingredients', '/pricing-methodology', '/food-safety', '/recipe-methodology'],
  disclosures: ['price_estimate', 'serving_assumption', 'source_timing', 'storage_and_cooking', 'allergen_and_product'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Tesco Real Food: Chickpea saag', url: 'https://realfood.tesco.com/recipes/chickpea-saag.html' },
    { label: 'Tesco Real Food: One-pot tomato pasta', url: 'https://realfood.tesco.com/recipes/one-pot-tomato-pasta.html' },
    { label: 'Aldi: One pot balsamic chicken', url: 'https://www.aldi.co.uk/recipes/collections/family-meals/one-pot-balsamic-chicken' },
    { label: 'Good Food: Chicken noodle soup', url: 'https://www.bbcgoodfood.com/recipes/chicken-noodle-soup' },
    { label: 'Aldi UK product listings', url: 'https://www.aldi.co.uk/products' },
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Does this plan scale publisher recipes down to one serving?', answer: 'No. Each recipe is used at its published yield. Extra servings become three named next-day lunches, the fifth scheduled dinner and two dated freezer portions.' },
    { question: 'Why is the checkout total higher than the ingredient value used?', answer: 'The checkout total covers every complete pack bought. Ingredient value counts only the quantities used in the ten servings. The remaining food carries into later cooking or needs a specific leftover plan.' },
    { question: 'Does the plan claim to be zero waste?', answer: 'No. It is coordinated to reduce waste. The article identifies the remaining chicken, spinach, mushrooms, yogurt, vegetables and cupboard products rather than pretending every pack is finished.' },
    { question: 'Will the Aldi basket cost the same everywhere?', answer: 'Not necessarily. Prices, pack sizes, promotions and stock can vary by store and change after the check date. The figures are a dated estimate rather than a promise.' },
    { question: 'Did DinnerByDesign develop or test these recipes?', answer: 'No. The recipes come from Tesco Real Food, Aldi and Good Food. Follow the original publisher for quantities, timings and method. DinnerByDesign provides the basket, costing and leftover analysis.' },
    { question: 'What is assumed to be in the cupboard?', answer: 'Cooking oil, salt and pepper are treated as already owned and excluded from the checkout and ingredient-value figures. Every other listed ingredient is costed.' },
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
  const plan = renderCookingForOnePlanInitialHtml();
  const disclosures = renderProgrammaticDisclosuresInitialHtml(COOKING_FOR_ONE_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(COOKING_FOR_ONE_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/food-costs">Food-cost and waste guidance</a> / Cooking for one</nav><p>Costed dinner plan</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 28 July 2026</p><article>${plan}${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><p>Recipes, prices and guidance reviewed 28 July 2026. Aldi prices were checked 27 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/five-dinners-same-ingredients">see how shared ingredients can become different dinners</a>, <a href="/pricing-methodology">read the pricing methodology</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${disclosureFooter}<section><h2>Make the plan fit your week</h2><p>Use DinnerByDesign to adapt dinner ideas around your preferences, budget and ingredients.</p><p><a href="/signin">Plan dinners for one</a></p></section></main></div>`;
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
  internalLinks: ['/food-costs/ways-to-reduce-grocery-costs', '/pricing-methodology', '/food-safety', '/recipe-methodology'],
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
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>Liver, kidney and heart can cost less than more familiar cuts, but they are not direct substitutes. Each brings its own flavour, texture and cooking requirement. Used thoughtfully — with onions, vegetables, grains, pulses and assertive seasonings — they can produce satisfying, characterful dinners without relying on a large quantity of meat.</p></section><section><h2>Why consider offal?</h2><p>Offal can bring meat into a dinner as a smaller, supporting element rather than the centrepiece. It is one option among several for managing ingredient spending, not something any household needs to adopt.</p></section><section><h2>Is it necessarily less expensive?</h2><p>Often, but not always. Price snapshot, 20 July 2026: Tesco listed lamb liver at £6.15/kg, lamb heart at £7.30/kg and lamb kidney at £8.00/kg, compared with lamb mince from £13.00/kg. Prices, ranges and availability change, so check the current shelf price.</p>${price}</section><section><h2>Liver, kidney and heart: how they differ</h2><ul><li><strong>Liver:</strong> soft in texture and mild to rich in flavour. Thin, evenly sized pieces cook through quickly.</li><li><strong>Kidney:</strong> firmer, with a distinct mineral flavour. It usually needs its white core trimmed and can suit quick or slow cooking.</li><li><strong>Heart:</strong> denser and leaner, closer to a muscle cut. Cook it long and slow, or slice it thinly for quick cooking.</li></ul></section><section><h2>Flavours that work well</h2><ul><li><strong>Liver:</strong> onions, sage, mustard, vinegar or sherry.</li><li><strong>Kidney:</strong> mustard, Worcestershire sauce, paprika, stock or ale.</li><li><strong>Heart:</strong> garlic, chilli, citrus or a vinegar-based marinade.</li></ul></section>${safety}<section><h2>Three approachable starting points</h2><ul><li>Thoroughly cooked lamb liver with onions, mustard and vinegar.</li><li>Kidney with root vegetables in a rich gravy.</li><li>Slow-cooked heart with garlic, smoked paprika and tomatoes.</li></ul></section><section><h2>Availability in supermarkets and butchers</h2><p>Liver and kidney are stocked fairly reliably by major UK supermarkets. Heart, tongue and tripe are less consistent, and a local butcher may be able to source and prepare them.</p></section><section><h2>Vitamin A, pregnancy and food-safety guidance</h2><p>The NHS advises against eating liver or liver products such as pâté more than once a week. Liver and liver products should be avoided during pregnancy. Follow the cited NHS and Food Standards Agency guidance.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Find offal dinners and products</h2><p>Search DinnerByDesign for liver, kidney, heart and other offal options, then compare suitable dinners and ready-made products in one place.</p></section><section><h2>Sources and further reading</h2><p>Guidance and prices reviewed 20 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/pricing-methodology">read the pricing methodology</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Find suitable offal options</h2><p>Use DinnerByDesign to search directly or include offal in your personalised suggestions.</p><p><a href="/signin">Find offal dinners</a></p></section></main></div>`;
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
  internalLinks: ['/dinner-plans/5-affordable-family-dinners-for-four', '/food-costs/cooking-for-one-without-waste', '/food-costs/ways-to-reduce-grocery-costs', '/food-costs/batch-cooking-on-a-budget', '/pricing-methodology', '/food-safety'],
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
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>It is easy to assume that cooking more is generous and cooking less saves money. In practice, the two do not always match up. Cooking too much of an expensive ingredient can quietly push up what a dinner costs, while serving smaller portions does not automatically reduce the supermarket checkout because much of what you buy comes in a fixed pack.</p></section><section><h2>Portion planning, not portion control</h2><p>Portion planning is not about eating less. It is about deciding before you cook how many people a dinner is meant to serve and whether any extra portions have a specific purpose.</p></section><section><h2>Where portion planning makes the greatest difference</h2><p>Portion planning has the biggest effect on ingredients that cost the most, particularly meat, fish and cheese. Vegetables, pulses, grains, potatoes and a well-flavoured sauce can provide volume, texture and flavour around a smaller quantity of the priciest ingredient.</p></section><section><h2>Why checkout costs do not always fall</h2><p>If a dinner needs 300g of mince and the smallest available pack is 500g, the full pack still has to be bought. Keep two figures separate: the value of ingredients used in the dinner and the cost of the complete packs bought. The unused part provides further value when it is used in another dinner or stored safely for later.</p></section><section><h2>When cooking extra is economical</h2><p>A larger batch can make good use of a fixed pack when the extra has a purpose before cooking begins: another dinner, a lunch or the freezer.</p></section><section><h2>How to plan portions realistically</h2><p>Realistic portions depend on who you are feeding, their appetite and what else is being served. A household of two can halve a recipe written for four or cook the full amount and earmark the extra for later.</p></section>${disclosures}<section><h2>Practical ways to reduce waste</h2><ul><li>Weigh or measure more expensive ingredients rather than guessing.</li><li>Divide large packs into usable portions promptly.</li><li>Freeze suitable surplus and label leftovers with the date.</li><li>Schedule shared ingredients across several dinners.</li></ul></section><section><h2>Keeping lower-cost dinners satisfying</h2><p>A smaller quantity of chicken can be shredded through spiced rice with herbs and lime. Strong cheese can be grated through a gratin. Pulses and grains take on bold flavours from curry paste, harissa or toasted spices, allowing meat, fish or cheese to add character rather than bulk.</p></section><section><h2>How DinnerByDesign helps</h2><p>DinnerByDesign lets you set servings and see an estimated cost per portion. Build a week that reuses ingredients and generate a shopping list from scheduled dinners, so complete packs are bought with a plan for using them.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Making portion planning work</h2><p>Portion planning works best as part of a bigger picture: realistic servings, awareness of pack sizes, planned leftovers and a week of dinners that share ingredients. It is about making sure everything you buy gets used well.</p></section><section><h2>Sources and further reading</h2><p>Guidance reviewed 20 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/dinner-plans/5-affordable-family-dinners-for-four">See a five-dinner family plan with serving and pack costs</a>, <a href="/food-costs/cooking-for-one-without-waste">plan dinners for one without waste</a>, <a href="/food-costs/ways-to-reduce-grocery-costs">explore practical ways to manage grocery costs</a>, <a href="/food-costs/batch-cooking-on-a-budget">learn when batch cooking can save money</a>, <a href="/pricing-methodology">read the pricing methodology</a> or <a href="/food-safety">review food-safety guidance</a>.</p></section></article>${footer}<section><h2>Plan portions across your week</h2><p>Use DinnerByDesign to set servings, coordinate ingredients and create a shopping list from scheduled dinners.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}

export const MEDITERRANEAN_AFFORDABLE_COOKING_PATH = '/food-costs/mediterranean-inspired-affordable-cooking';

export const MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE = {
  title: 'Mediterranean-inspired ways to make affordable ingredients taste good',
  seoTitle: 'Mediterranean-inspired budget cooking | DinnerByDesign',
  description: 'How techniques from Greek, Italian, Lebanese and Spanish cooking can help you make satisfying, affordable dinners, with practical UK-supermarket substitutions.',
  publishedAt: '2026-07-20', reviewedAt: '2026-07-20', contentReviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Food cost guide',
  primarySearchIntent: 'Use Mediterranean-inspired cooking techniques to make affordable ingredients appetising and reuse them across several dinners',
  indexingStatus: 'index' as const,
  editorialNotes: 'Keep the traditions distinct, retain the softened Spanish framing, and recheck the cultural, FSA and allergen sources before changing the review date.',
  internalLinks: ['/food-costs/ways-to-reduce-grocery-costs', '/food-costs/portion-planning-and-food-waste', '/food-costs/fresh-or-frozen', '/food-safety', '/recipe-methodology'],
  disclosures: ['storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Visit Greece: Greek pulses to quicken your pulse', url: 'https://www.visitgreece.gr/experiences/gastronomy/traditional-products/greek-pulses-to-quicken-your-pulse/' },
    { label: 'Turismo Roma: Chickpeas and Roman-style pasta with chickpeas', url: 'https://www.turismoroma.it/en/page/chickpeas-and-roman-style-pasta-chickpeas' },
    { label: 'Lebanese University-affiliated research: Lebanese food exchange system including moujadara', url: 'https://www.researchgate.net/publication/348394395_Development_of_a_Lebanese_food_exchange_system_based_on_frequently_consumed_Eastern_Mediterranean_traditional_dishes_and_Arabic_sweets' },
    { label: 'La Tienda: Lentil and Chorizo Stew — preparation reference only', url: 'https://www.tienda.com/recipes/lentil-and-chorizo-stew' },
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely' },
    { label: 'Food Standards Agency: Allergen guidance for food businesses', url: 'https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Is Mediterranean cooking always cheaper?', answer: 'No. Good olive oil, fresh fish, nuts and speciality cheese can be some of the pricier items in a UK shop. The value here comes from specific techniques, not from the region\'s cooking being inexpensive overall.' },
    { question: 'Do I need extra virgin olive oil, or can I use something else?', answer: 'A more everyday cooking oil works for the cooking itself, although the dish will lose some of olive oil\'s characteristic flavour. If you want that flavour, a small amount used to finish the dish goes further than using it throughout.' },
    { question: 'Can I make these dinners vegetarian or vegan?', answer: 'Fasolada and the mujadara version described here contain no meat. Pasta e ceci can be prepared without anchovy where the chosen recipe allows. For a meat-free Spanish-inspired lentil stew, omit the chorizo and build the smoky flavour with paprika, recognising that this is an adaptation rather than traditional lentejas con chorizo.' },
    { question: 'What is the easiest way to start if I have not cooked much with lentils or chickpeas before?', answer: 'Tinned lentils and chickpeas are the simplest way in. They are already cooked and only need heating through, so a dish such as pasta e ceci or mujadara is a reasonable first attempt.' },
    { question: 'How can I avoid the more expensive ingredients pushing up the price?', answer: 'Use them in small quantities as flavouring — a little chorizo, a modest amount of good olive oil as a finishing touch, or cheese grated rather than sliced — rather than as the bulk of the dinner.' },
  ],
};

export function getMediterraneanAffordableCookingJsonLd() {
  const guide = MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE;
  const url = `https://dinnerbydesign.app${MEDITERRANEAN_AFFORDABLE_COOKING_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
  ] };
}

export function renderMediterraneanAffordableCookingInitialHtml() {
  const guide = MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE;
  const storage = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_STORAGE_DISCLOSURES);
  const product = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_PRODUCT_DISCLOSURES);
  const sourceTiming = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_SOURCE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(MEDITERRANEAN_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>Beans, lentils, grains, vegetables and a handful of well-chosen flavourings turn up again and again across the Mediterranean's many different culinary traditions — and they are a genuinely useful starting point for a satisfying, affordable dinner. This is not a claim that Mediterranean cooking is cheap: some of its best-known ingredients, from good olive oil to fresh fish, are not. It is an argument for borrowing a handful of techniques that several of these traditions share.</p></section><section><h2>There is no single Mediterranean cuisine</h2><p>Greek, Italian, Lebanese, Spanish, Moroccan and Turkish cooking — to name just a few — are distinct culinary traditions with their own ingredients, history and character. Treating Mediterranean food as one uniform, inexpensive cuisine flattens that variety, and it is not accurate either. What is worth taking from these traditions is not a claim about their overall cost, but a set of techniques that turn up across several of them.</p></section><section><h2>Where the practical value comes from</h2><ul><li>Building a dinner around beans, lentils, grains and vegetables, rather than a large piece of meat or fish.</li><li>Using herbs, garlic, citrus, tomatoes and spices to bring flavour, rather than relying on the quantity of a costly ingredient.</li><li>Treating meat, fish or cheese as a smaller, supporting element where a dish calls for it, rather than the bulk of the plate.</li><li>Reusing bread, cooked grains, sauces and vegetables across more than one dinner.</li></ul><p>None of this is exclusive to the Mediterranean — similar techniques appear in low-cost cooking traditions worldwide — but it is a useful, well-documented set of examples to draw from.</p></section><section><h2>Affordable ingredients that carry flavour well</h2><ul><li>Dried or tinned lentils, chickpeas and beans</li><li>Onions and garlic</li><li>Tinned tomatoes</li><li>Rice, pasta, bulgur wheat and couscous</li><li>Herbs such as parsley, oregano, mint and bay</li><li>Spices such as cumin, paprika and cinnamon</li><li>Lemon</li></ul><p>These form the backbone of a satisfying dinner without needing a large quantity of any single expensive ingredient.</p></section><section><h2>Ingredients that can make the checkout more expensive</h2><p>Good-quality extra virgin olive oil, fresh fish and seafood, pine nuts, almonds, saffron and speciality cheeses can all add significantly to a shopping bill. They can still have a place — used in small quantities, saved for when you want to spend a little more, or swapped for a more accessible alternative.</p></section><section><h2>Four appetising dinner examples</h2><h3>Greek fasolada</h3><p>A hearty white bean soup, one of the best-known bean dishes in Greek cooking, made by simmering dried white beans with onion, carrot, celery and tomato, finished with a generous amount of olive oil. It is traditionally meat-free.</p><h3>Roman pasta e ceci</h3><p>A central and southern Italian dish of small pasta and chickpeas, simmered in a tomato-and-rosemary broth with garlic. The chickpea-and-pasta base needs no meat, although some Roman versions include anchovy.</p><h3>Lebanese mujadara</h3><p>A Levantine dish of lentils and rice, or bulgur wheat, built almost entirely around deeply caramelised onions, with cumin as the main spice. The version described here contains no animal-derived ingredients; check stock, packaged ingredients and accompaniments. It is found across Lebanon, Jordan and Syria.</p><h3>Spanish lentejas con chorizo</h3><p>A Spanish lentil stew with potato, carrot, onion, garlic and paprika, where a small amount of chorizo is sliced in to flavour the whole pot rather than serving as the main component.</p></section><section><h2>Reusing ingredients across several dinners</h2><p>A larger pot of cooked lentils, chickpeas or rice can be split across two or three dinners. A batch of caramelised onions can flavour a grain, a stew or a simple bean dish. A tomato-and-garlic base can work beneath pasta e ceci one night and a different bean or vegetable dinner later on.</p></section>${storage}<section><h2>UK-supermarket substitutions and how they alter the result</h2><ul><li>Tinned lentils or chickpeas are already cooked, so they can be drained and added without soaking, in place of dried.</li><li>Use a more everyday cooking oil in place of extra virgin olive oil for cooking. The dish will lose some of the fruitier, more peppery flavour that good olive oil brings, although this matters less for cooking than for a finishing drizzle.</li><li>Widely available cooking chorizo can replace a specific artisan variety. It still gives a smoky, paprika-forward flavour, although the exact taste and texture vary by brand.</li><li>A more everyday hard cheese can replace Parmesan or Pecorino for grating. This changes the flavour but still adds a savoury, salty finish.</li><li>A widely available long-grain rice may replace a specific variety, but texture, liquid requirements and cooking time can differ, so follow the pack instructions.</li></ul><p>These substitutions change the character of a dish rather than its core structure, so try the closest available alternative rather than skipping the ingredient's role entirely.</p></section>${product}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for dinners built around beans, lentils and grains, and use the Low Cost filter alongside these techniques. Plan my week can help you schedule dinners that reuse a base sauce, cooked grain or batch of caramelised onions across more than one night.</p></section><section><h2>Sources and further reading</h2><p>The Spanish example uses a preparation reference rather than an official cultural authority and is therefore described in deliberately general terms.</p><ul>${sources}</ul></section>${sourceTiming}<section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce waste</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Make affordable ingredients taste good</h2><p>Use DinnerByDesign to find suitable dinners and plan ingredients across your week.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}

export const SUMMER_STEWS_GUIDE_PATH = '/food-costs/summer-stews-seasonal-vegetables';

export const SUMMER_STEWS_GUIDE = {
  title: 'Summer stews: making vegetables go further',
  seoTitle: 'Affordable summer stews and vegetable ideas | DinnerByDesign',
  description: 'A practical guide to building lighter, appetising stews around whichever vegetables are available, affordable or already in the fridge.',
  publishedAt: '2026-07-20',
  reviewedAt: '2026-07-20',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Use flexible summer stews to make good-value vegetables and shared ingredients go further',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-20',
  editorialNotes: 'Review the cited Food Standards Agency guidance before changing the content review date. The dinner examples are flexible ideas rather than named traditional dishes.',
  internalLinks: ['/food-costs/ways-to-reduce-grocery-costs', '/food-costs/portion-planning-and-food-waste', '/food-safety', '/recipe-methodology'],
  disclosures: ['storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Do vegetables cost less in summer?', answer: 'Not automatically — prices and availability vary by vegetable, retailer and time of year. The value in this approach comes from flexibility and reuse, not from a guaranteed seasonal saving.' },
    { question: 'Can I use frozen or tinned vegetables instead of fresh?', answer: 'Frozen vegetables can work well, but follow the pack instructions and cook them thoroughly. They may need to be added earlier than their fresh equivalents. Tinned tomatoes provide a convenient base for all three examples.' },
    { question: 'Do I need to add vegetables in stages, or can I add everything at once?', answer: 'Staging keeps more texture and colour in the finished dish, but it is not essential. Adding everything together and cooking it down is a reasonable alternative if that is the result you prefer.' },
    { question: 'How long can I keep a cooked stew before eating it?', answer: 'Refrigerate it within two hours of cooking, and eat it within 48 hours or freeze it. Reheat only once, until it is steaming hot throughout.' },
    { question: 'What if I do not have the exact vegetables listed in a recipe?', answer: 'These dinners are built to accept substitution — use whichever similar vegetables are good value or already need using and remain safe to eat, adjusting cooking time for firmer or softer ingredients as needed.' },
  ],
};

export function getSummerStewsGuideJsonLd() {
  const guide = SUMMER_STEWS_GUIDE;
  const url = `https://dinnerbydesign.app${SUMMER_STEWS_GUIDE_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
      { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
    ],
  };
}

export function renderSummerStewsGuideInitialHtml() {
  const guide = SUMMER_STEWS_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(SUMMER_STEWS_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(SUMMER_STEWS_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 20 July 2026 · Last reviewed 20 July 2026</p><article><section><p>A summer stew is generally lighter and quicker-cooking than a winter stew, built on fresh vegetables, herbs and a lighter broth or tomato base. Ingredients go in at different stages so each one keeps an appropriate texture, rather than everything cooking down together for hours.</p><p>The financial case for cooking this way is not that summer vegetables are automatically cheap — prices and availability still vary through the season and by retailer. It is that a stew built this way is unusually good at absorbing whatever you actually have that remains safe to eat: whichever vegetables are good value that week, or already sitting in the fridge needing to be used.</p></section><section><h2>Where the practical value comes from</h2><ul><li>It accommodates whichever vegetables are currently good value or already need using, provided they remain safe to eat.</li><li>It combines vegetables with beans, lentils or grains, rather than relying on a large quantity of meat.</li><li>One tomato base, bunch of herbs or pack of vegetables can be used across several dinners.</li><li>Irregular quantities and surplus vegetables — the half pepper, the last two courgettes — become an intentional part of the dish rather than loose ends to work around.</li><li>It accepts substitutions without needing a completely different recipe.</li><li>It can be served with bread, rice or another inexpensive accompaniment when you want more volume.</li></ul></section><section><h2>Staging vegetables by cooking time</h2><p>The main technique worth knowing is that not everything needs to go into the pot at once. Onions and firmer vegetables — peppers, aubergine, carrots — go in first and cook down into the base. Courgette, leafy vegetables and other more delicate ingredients go in later, so they retain their colour, texture and freshness rather than turning soft and grey. Herbs, and any final squeeze of lemon, go in right at the end, off the heat or close to it.</p><p>This is not a rigid rule — some dinners benefit from everything cooking down together, and that is a reasonable choice too. Staging is simply a way to keep more texture and colour in the finished dish, if that is what you want from it.</p></section><section><h2>Three flexible dinner ideas</h2><p>These are presented as adaptable starting points rather than named traditional dishes — change the vegetables to whatever you have, and treat the quantities as a guide rather than a fixed recipe.</p><h3>Tomato, courgette and butter bean stew with lemon and basil</h3><p>Onion and garlic cooked down first with tinned tomatoes, then butter beans warmed through, courgette added in the last few minutes so it keeps some bite, finished with lemon juice and torn basil off the heat.</p><h3>Chicken, pepper and sweetcorn broth with smoked paprika</h3><p>A light broth built from onion, pepper and smoked paprika, with a modest amount of chicken added to flavour rather than fill the bowl, and sweetcorn stirred in towards the end so it stays sweet and crisp. Cook the chicken thoroughly until steaming hot throughout, with no pink meat remaining.</p><h3>Aubergine, chickpea and tomato stew finished with fresh herbs</h3><p>Aubergine cooked down with onion and garlic until soft, chickpeas added to warm through, tinned tomatoes providing the base, and a handful of fresh parsley or coriander stirred in just before serving.</p></section><section><h2>Reusing a base across several dinners</h2><p>A larger batch of the onion-and-tomato base from any of these can do more than one job: it is the start of tonight's stew, but it can just as easily go under some pasta, alongside a piece of fish, or into a bean dish later in the week. The same applies to a bunch of herbs or a pack of vegetables bought for one dinner — splitting it across two dinners in the same week is usually more useful than trying to use all of it in one sitting.</p></section><section><h2>Serving for extra volume</h2><p>Bread, rice, couscous or another inexpensive accompaniment is a straightforward way to add volume to a lighter stew without adding more of the more expensive ingredients. A smaller pot of stew served over rice, or with a thick slice of bread on the side, often goes further than the same stew served alone.</p></section><section><h2>Food safety for cooked stews</h2><p>These dishes can be eaten warm or a little cooler, but that should not be confused with leaving a cooked stew out at room temperature for an extended period. Current Food Standards Agency guidance is to cool cooked food and refrigerate it within two hours, eat refrigerated leftovers within 48 hours or freeze them, and reheat only once, until steaming hot all the way through.</p></section>${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for dinners that flex around whatever vegetables you have, and use the Low Cost filter alongside these techniques. Plan my week can help schedule a base sauce, herb bunch or vegetable pack across more than one dinner, and our <a href="/food-costs/ways-to-reduce-grocery-costs">low-cost cooking techniques</a> and <a href="/food-costs/portion-planning-and-food-waste">portion-planning guides</a> cover the wider principles in more detail.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce waste</a>, <a href="/food-costs/fresh-or-frozen">choose between fresh and frozen produce</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Make vegetables work harder across your week</h2><p>Find suitable dinners and plan shared ingredients with DinnerByDesign.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}

export const FRESH_OR_FROZEN_GUIDE_PATH = '/food-costs/fresh-or-frozen';

export const FRESH_OR_FROZEN_GUIDE = {
  title: 'Fresh or frozen: which is better for the way you cook?',
  seoTitle: 'Fresh or frozen: which is better for the way you cook? | DinnerByDesign',
  description: 'How fresh and frozen fruit and vegetables generally differ, and how to choose between them depending on what and how you are cooking.',
  publishedAt: '2026-07-21',
  reviewedAt: '2026-07-21',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Choose between fresh and frozen fruit and vegetables based on use, storage, texture and waste',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-21',
  editorialNotes: 'NHS and Food Standards Agency guidance was reviewed on 20 July 2026. Product-specific pages need their own source and suitability checks.',
  internalLinks: ['/dinner-plans/5-affordable-family-dinners-for-four', '/food-costs/portion-planning-and-food-waste', '/food-costs/summer-stews-seasonal-vegetables', '/food-safety', '/recipe-methodology'],
  disclosures: ['storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'NHS: 5 A Day — what counts?', url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/' },
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Can I mix fresh and frozen ingredients in the same dish?', answer: 'Yes. Add each ingredient at the stage that suits its cooking time and follow the packet instructions for frozen products.' },
    { question: 'Can cooked dishes made with frozen ingredients be stored?', answer: 'Follow the storage and reheating guidance for the finished dish, as well as any instructions on the ingredient packet.' },
    { question: 'Why do packet instructions matter?', answer: 'Preparation, defrosting, cooking and storage requirements vary between products. The packet gives the instructions for the particular product you bought.' },
    { question: 'Is fresh or frozen always the cheapest option?', answer: 'No. Prices, pack sizes and the amount you will actually use vary. Compare the current pack price with how much is likely to be eaten rather than assuming one format always costs less.' },
    { question: 'What should I choose if I am unsure?', answer: 'Choose fresh when appearance, crispness or uncooked texture matters. Choose frozen when longer storage and taking out only what you need are more useful, while checking that the product suits your intended dish.' },
  ],
};

export function getFreshOrFrozenGuideJsonLd() {
  const guide = FRESH_OR_FROZEN_GUIDE;
  const url = `https://dinnerbydesign.app${FRESH_OR_FROZEN_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
  ] };
}

export function renderFreshOrFrozenGuideInitialHtml() {
  const guide = FRESH_OR_FROZEN_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FRESH_OR_FROZEN_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(FRESH_OR_FROZEN_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 21 July 2026 · Last reviewed 21 July 2026</p><article><section><p>Fresh fruit and vegetables can be ideal when texture, appearance or immediate use matters. Frozen versions offer a longer storage window and are often washed, trimmed and portioned before freezing. Some can be cooked straight from frozen; others need to be handled according to the packet.</p><p>Neither format is automatically better or cheaper. The useful question is which one suits what you are cooking, how soon you will use it and how much is likely to be left over.</p></section><section><h2>Quick answer</h2><p>Choose fresh when crispness, appearance or uncooked texture is central to the dish. Choose frozen when longer storage, convenience and using only the amount needed matter more. The best choice varies by product and cooking method.</p></section><section><h2>Key differences</h2><table><thead><tr><th>Factor</th><th>Fresh</th><th>Frozen</th></tr></thead><tbody><tr><th>Best for</th><td>Raw or appearance-led uses, depending on the product</td><td>Cooked dishes where a softer texture is suitable</td></tr><tr><th>Texture</th><td>Often firmer when recently bought and stored well</td><td>Product-dependent; may soften or release moisture</td></tr><tr><th>Storage</th><td>Varies by product; check its condition and date</td><td>Generally longer; follow the date and storage instructions</td></tr><tr><th>Preparation</th><td>May need washing, trimming or chopping</td><td>Often prepared and portioned, but check the packet</td></tr><tr><th>Waste</th><td>Useful when the whole amount will be eaten in time</td><td>Useful when you want to remove smaller amounts and keep the rest frozen</td></tr><tr><th>Nutrition</th><td>Both fresh and frozen fruit and vegetables count towards 5 A Day; exact content varies</td><td>Neither format is universally more nutritious</td></tr></tbody></table></section><section><h2>Does freezing affect quality?</h2><p>It can. Freezing changes the structure of some fruit and vegetables, so they may be softer after defrosting or release more moisture during cooking. That may matter in a salad or a dish where a crisp finish is important, but much less in a soup, stew, sauce, pie filling or blended dish.</p><p>The effect is product-specific. Frozen peas can retain a useful colour and sweetness in cooked dishes, while frozen spinach is particularly convenient where it will be stirred into a sauce, curry or stew. Frozen berries may soften as they thaw but can still work well in compote, baking or porridge when prepared according to the packet.</p></section><section><h2>Is frozen produce as nutritious as fresh?</h2><p>Both fresh and frozen fruit and vegetables count towards your 5 A Day. Exact nutrient content varies with the product, variety, storage and cooking, so neither format should be described as universally more nutritious.</p></section><section><h2>Which is more convenient?</h2><p>Frozen produce is often washed, trimmed, chopped or portioned before sale. That can shorten preparation and lets you remove only what you need. Fresh produce can be more convenient when it will be eaten uncooked or needs no defrosting, and when its appearance or crispness matters.</p><p>If only part of a frozen pack is used, return the remainder to the freezer promptly, reseal it and follow the packet's storage instructions.</p></section><section><h2>Which can create less waste?</h2><p>Frozen produce can reduce unused leftovers because a smaller quantity can be taken from the pack while the rest stays frozen. Fresh can be equally sensible when you know the whole amount will be used while it is still suitable to eat. Buying more than you need undermines either choice.</p></section><section><h2>Best cooking uses</h2><ul><li><strong>Salads and presentation-led dishes:</strong> fresh is usually the more suitable starting point.</li><li><strong>Soups, stews, curries and pies:</strong> either can work; adjust timing and liquid for the product.</li><li><strong>Roasting and stir-frying:</strong> product-dependent, because some frozen vegetables release more moisture.</li><li><strong>Baking, compotes and porridge:</strong> frozen fruit can work well when prepared according to the packet.</li></ul></section><section><h2>When to choose fresh</h2><ul><li>You plan to use it soon.</li><li>Texture, crispness or appearance is important.</li><li>The ingredient will be served uncooked and is suitable for that use.</li><li>You know the amount bought will be used.</li></ul></section><section><h2>When to choose frozen</h2><ul><li>You want a longer storage window.</li><li>You need only a small amount at a time.</li><li>Prepared or portioned ingredients make the dish easier.</li><li>The ingredient will be cooked into a dish where a softer texture is suitable.</li></ul></section><section><h2>Verdict</h2><p>Neither format is universally better. Choose according to how soon the ingredient will be used, how it will be cooked and whether convenience, texture or reducing waste matters most for that dinner.</p></section>${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign by ingredient, then use Plan my week to place fresh and frozen options where they make most sense across the week.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/dinner-plans/5-affordable-family-dinners-for-four">See how one family dinner plan uses fresh and frozen ingredients across five dinners</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce food waste</a>, <a href="/food-costs/summer-stews-seasonal-vegetables">make vegetables go further in summer stews</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Choose ingredients that suit your week</h2><p>Search by what you have and plan flexible dinners.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}

export const BATCH_COOKING_GUIDE_PATH = '/food-costs/batch-cooking-on-a-budget';

export const BATCH_COOKING_GUIDE = {
  title: "Batch cooking on a budget: when it saves money and when it doesn't",
  seoTitle: 'Batch cooking on a budget: when it saves money | DinnerByDesign',
  description: "Batch cooking can make ingredients go further, but only when portions are planned, stored safely and actually eaten. Here's when it works.",
  publishedAt: '2026-07-21',
  reviewedAt: '2026-07-21',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Understand when batch cooking can reduce shopping costs and how to plan, vary and store portions safely',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-21',
  editorialNotes: 'Food Standards Agency guidance was reviewed on 20 July 2026. No retailer prices, numerical savings or energy-consumption claims are included.',
  internalLinks: ['/food-costs/portion-planning-and-food-waste', '/food-costs/ways-to-reduce-grocery-costs', '/food-safety', '/recipe-methodology'],
  disclosures: ['allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food' },
    { label: 'Food Standards Agency: Home food fact checker', url: 'https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker' },
  ] satisfies FoodCostGuideSource[],
  faqs: [
    { question: 'Is batch cooking always cheaper?', answer: 'No. It only saves money when the portions are suitable, actually get eaten and are stored properly. A large batch cooked without a plan for every portion can cost more than cooking smaller amounts more often.' },
    { question: 'What can I batch cook without a large freezer?', answer: 'Dishes you will finish within a couple of days work well with fridge storage alone, such as a bean stew or lentil base. If freezer space is limited, cook smaller batches more often.' },
    { question: 'Which dishes do not batch cook well?', answer: 'Anything intended to be served freshly assembled, such as a salad, or a dish that relies on a just-cooked crisp texture tends to lose what makes it work once stored and reheated.' },
    { question: 'How do I prevent batch-cooked dinners becoming repetitive?', answer: 'Batch-cook a base rather than a finished dish, then finish it differently each time with another grain, spice, vegetable or side.' },
    { question: 'How should cooked portions be labelled and stored?', answer: 'Label each portion with the dish and date. Refrigerate what you will eat within 48 hours and freeze the rest promptly. Cooked rice should be refrigerated for no more than a day before reheating, or frozen sooner.' },
  ],
};

export function getBatchCookingGuideJsonLd() {
  const guide = BATCH_COOKING_GUIDE;
  const url = `https://dinnerbydesign.app${BATCH_COOKING_GUIDE_PATH}`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, datePublished: guide.publishedAt, dateModified: guide.reviewedAt, author: { '@type': 'Organization', name: guide.editorialOwner }, publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' }, mainEntityOfPage: url, citation: guide.sources.map(source => source.url) },
    { '@type': 'FAQPage', mainEntity: guide.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' }, { '@type': 'ListItem', position: 2, name: 'Food cost guides', item: url }] },
  ] };
}

export function renderBatchCookingGuideInitialHtml() {
  const guide = BATCH_COOKING_GUIDE;
  const footer = renderProgrammaticDisclosureFooterInitialHtml(BATCH_COOKING_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 21 July 2026 · Last reviewed 21 July 2026</p><article><section><h2>Quick answer</h2><p>Batch cooking can reduce what you spend on food, but quantity alone does not create a saving. Cooking a very large amount only helps if the portions are suitable, someone actually wants to eat them again, and the extra does not just disappear into the freezer. The saving comes from how the batch is planned and used, not from the size of the pot. A large batch cooked without a plan for every portion can end up costing more than cooking smaller amounts more often.</p></section><section><h2>Where the economies come from</h2><ul><li>Using complete packs of ingredients more effectively, rather than buying more than one dinner needs and using only part of it.</li><li>Buying fewer small or partially used packs across the week, since one larger cook can draw on a single set of ingredients.</li><li>Spreading preparation across several dinners, so the effort of chopping, browning or making a sauce base happens once.</li><li>Making planned use of leftovers, rather than leaving them to go off unnoticed.</li><li>Reducing reliance on expensive last-minute options — a takeaway or convenience dinner bought because nothing else was ready.</li><li>Portioning food before serving or freezing, which helps prevent oversized servings and forgotten containers.</li><li>Reusing one cooked base in different ways, so variety does not depend on buying new ingredients each time.</li></ul></section><section><h2>What makes a good batch-cooked dish</h2><p>Not every dish is worth cooking in bulk. A good candidate stores well without separating or turning watery, divides easily into individual portions, reheats successfully without drying out or losing texture, and still tastes appealing on the third or fourth time round, not just the first. Dishes built around a sauce, stew or braise tend to fit this better than anything meant to be served freshly assembled, such as a salad or a dish that relies on a just-cooked crisp texture.</p></section><section><h2>Batch cooking does not have to mean repetition</h2><p>The dinner that gets tiresome is usually the one eaten in exactly the same form four times in a row. The more useful approach is to batch-cook a base — a sauce, a cooked protein, a pot of roasted vegetables — and finish it differently each time with a different grain, spice, vegetable or side. The cooking happens once; what you eat still changes.</p></section><section><h2>Useful batch-cooking bases</h2><ul><li>Tomato and vegetable sauce</li><li>Cooked mince and vegetables</li><li>Lentil and tomato base</li><li>Roasted vegetables</li><li>Bean or chickpea stew</li><li>Cooked chicken, prepared plainly so it can go in different directions — refrigerate portions you will use within a day or two, and freeze the rest</li></ul></section><section><h2>Turning one base into different dinners</h2><p>A tomato-and-vegetable base is a good example of how far one batch can stretch. The same pot can become a herby pasta sauce one night, a smoky bean stew with tinned chickpeas or cannellini beans and a spoonful of smoked paprika another night, a gently spiced topping for a baked potato later in the week, or the sauce underneath a tray bake with whatever vegetables need using. The base does the work; a different grain, protein, spice or side changes what is actually on the plate.</p><p>A batch of cooked mince works the same way — stirred through pasta one night, spooned into a jacket potato or wrapped in a tortilla another, or added to rice with a different set of spices later in the week. A lentil and tomato base can move from a simple stew, to a sauce under a baked vegetable, to a filling alongside flatbread, without needing a fresh set of ingredients each time. If you plan to use a base later rather than within the next day or two, freeze the later portions and defrost them safely in the fridge rather than leaving them refrigerated for the whole week.</p></section>${renderProgrammaticDisclosuresInitialHtml(BATCH_COOKING_DISCLOSURES.slice(0, 1))}<section><h2>Portioning before storage</h2><p>Dividing a batch into individual or dinner-sized portions as soon as it is cool enough to store, rather than putting the whole pot straight into one large container, makes a real difference. It is much easier to take out exactly what a dinner needs, rather than defrosting more than you intend to eat because the portions are not already the right size. It also makes forgotten containers less likely, since a labelled, sensibly sized portion is easier to plan around than an anonymous large block.</p></section><section><h2>Fridge and freezer planning</h2><p>Current Food Standards Agency guidance is to cool cooked food and refrigerate it within two hours, eat refrigerated leftovers within 48 hours or freeze them, and reheat food only once, until it is steaming hot all the way through. Freeze portions promptly once they have cooled, and label each one with the dish and date, so nothing sits unidentified at the back of the freezer until it is no longer worth eating.</p><p>Cooked rice needs particular care: cool it quickly, keep it refrigerated for no more than one day before reheating, reheat it only once, and make sure it is steaming hot throughout. If a batch of rice will not be used that quickly, freeze it promptly instead.</p></section>${renderProgrammaticDisclosuresInitialHtml(BATCH_COOKING_DISCLOSURES.slice(1))}<section><h2>When batch cooking can cost more</h2><ul><li>Overbuying ingredients because a recipe is being scaled up, rather than checking what the household will actually get through.</li><li>Adding too many special or one-off ingredients to a large batch, which increases the cost of the whole pot rather than just one dinner.</li><li>Freezing more than a household's freezer can reasonably hold well, leading to poor storage conditions or food pushed to the back and forgotten.</li><li>Preparing more portions than the household actually wants to eat, so some are thrown away rather than used.</li></ul><p>In each case, the batch itself is not the problem — the absence of a plan for every portion is.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Use the Batch-friendly filter to find dinners that suit cooking in bulk, and Plan my week to schedule how each portion will be used across the week — including which portions are eaten from the fridge in the next day or two, and which are frozen for later — rather than cooking a large batch without a plan for all of it. Shared-ingredient planning and the generated shopping list can help you buy complete packs with a specific use for all the ingredients, rather than ending up with a partially used ingredient left over.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/portion-planning-and-food-waste">Plan portions and reduce food waste</a>, <a href="/food-costs/ways-to-reduce-grocery-costs">explore practical ways to manage grocery costs</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Plan every portion</h2><p>Find batch-friendly dinners and decide how each portion will be used.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
