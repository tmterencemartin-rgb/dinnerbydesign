import { describe, expect, it } from 'vitest';
import {
  GROCERY_COST_OPTIONS_GUIDE,
  GROCERY_COST_OPTIONS_GUIDE_PATH,
  getGroceryCostOptionsGuideJsonLd,
  renderGroceryCostOptionsGuideInitialHtml,
} from './groceryCostOptionsGuide';

describe('grocery-cost options guide', () => {
  it('publishes as an indexable cornerstone with the controlled disclosures', () => {
    expect(GROCERY_COST_OPTIONS_GUIDE_PATH).toBe('/food-costs/ways-to-reduce-grocery-costs');
    expect(GROCERY_COST_OPTIONS_GUIDE.indexingStatus).toBe('index');
    expect(GROCERY_COST_OPTIONS_GUIDE.disclosures).toEqual(['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    expect(GROCERY_COST_OPTIONS_GUIDE.internalLinks).toContain('/guides');
    expect(GROCERY_COST_OPTIONS_GUIDE.sources).toHaveLength(2);
    expect(GROCERY_COST_OPTIONS_GUIDE.sources.every(source => source.url.startsWith('https://www.gov.uk/'))).toBe(true);
  });

  it('renders the complete reader page in crawler-visible HTML', () => {
    const html = renderGroceryCostOptionsGuideInitialHtml();
    expect(html).toContain(`<h1>${GROCERY_COST_OPTIONS_GUIDE.title}</h1>`);
    for (let number = 1; number <= 12; number += 1) expect(html).toContain(`<h2>${number}.`);
    expect(html).toContain('<table>');
    expect(html).toContain('A note on cost');
    expect(html).toContain('Food safety');
    expect(html).toContain('Sources');
    expect(html).toContain('Plan my week');
  });

  it('provides article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getGroceryCostOptionsGuideJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']));
  });
});
