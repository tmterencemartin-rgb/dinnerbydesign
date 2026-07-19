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
  indexingStatus: 'index',
  contentReviewedAt: '2026-07-19',
  editorialNotes: 'Recheck official releases, forecast dates and all numerical claims before changing the review date.',
  internalLinks: ['/dinner-plans/5-dinners-for-2-under-40', '/pricing-methodology'],
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
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 18 July 2026 · Last reviewed 19 July 2026</p><article><section><h2>What is happening</h2><p>UK food price inflation eased through the first half of 2026. The most recent confirmed figure from the <a href="${escapeHtml(guide.sources[0].url)}">ONS</a> is 2.2 per cent for the 12 months to May 2026, down from 3.7 per cent in April.</p><p>Two faster trackers gave an early reading for June. The <a href="${escapeHtml(guide.sources[1].url)}">BRC</a> recorded 2.4 per cent, while <a href="${escapeHtml(guide.sources[2].url)}">Which?</a> recorded 2.6 per cent. Their baskets and collection methods differ from the ONS, so the figures should not be treated as directly interchangeable.</p><p>The ONS is the official reference point used here. The next confirmed figure was due on 22 July 2026 when this guide was reviewed.</p></section><section><h2>What it could mean for your shopping</h2><p>National figures describe an average across the country and many kinds of shopping. They provide useful context, but they cannot predict what one household will spend. That depends on the dinners cooked, the ingredients bought and where the shopping is done.</p><p>For context, the <a href="${escapeHtml(guide.sources[3].url)}">Food Foundation</a>'s tracked weekly shopping basket cost £53.51 to £60.24 in June 2026, up 30.6 to 38.4 per cent since April 2022.</p><p>DinnerByDesign works differently. Its estimates are built from the specific dinners, quantities and ingredient prices in a plan, not from a national average.</p></section><section><h2>Why planning can make a difference</h2><ul><li>Reuse core ingredients across several dinners so less is bought and wasted.</li><li>Filter for lower-cost dinner ideas before deciding what to cook.</li><li>Use cheaper equivalent ingredients where a dinner allows it.</li><li>Work from a shopping list tied to scheduled dinners to avoid unplanned or duplicate purchases.</li></ul></section><section><h2>Ways DinnerByDesign can help</h2><p>DinnerByDesign's Low Cost filter surfaces suitable dinner ideas using lower-cost ingredients. Schedule one or more saved dinners and DinnerByDesign generates a costed shopping list, so you can review the estimate before you shop.</p><p><a href="/dinner-plans/5-dinners-for-2-under-40">Explore five dinners for two under £40</a> or <a href="/pricing-methodology">read how ingredient prices are calculated</a>.</p></section><section><h2>How the trackers differ</h2><ul><li><strong>ONS Consumer Prices Index:</strong> the official reference basket, published after each month ends.</li><li><strong>BRC Shop Price Index:</strong> shelf prices from major retailers, published faster but with different basket weightings.</li><li><strong>Which? tracker:</strong> around 27,000 individual product prices across major supermarkets.</li></ul><p>Different baskets, weightings and collection dates can produce different rates for the same period.</p></section><section><h2>Forecasts are not measured outcomes</h2><p>The <a href="${escapeHtml(guide.sources[4].url)}">Food and Drink Federation</a> forecast food inflation of at least 9 per cent by the end of 2026. <a href="${escapeHtml(guide.sources[5].url)}">IGD's June forecast</a> projected a peak of 5.5 per cent and an average of 3.7 to 4.7 per cent across 2026.</p><p>The forecasts differ because their assumptions, timing and scenarios differ. They are uncertain projections and should not be read as recorded price changes.</p></section><section><h2>Sources</h2><ul>${sources}</ul></section></article><p><a href="/signin">Plan my week</a></p></main></div>`;
}
