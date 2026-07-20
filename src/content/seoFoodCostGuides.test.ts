import { describe, expect, it } from 'vitest';
import {
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getLowerCostCutsJsonLd,
  getUkFoodCosts2026JsonLd,
  renderLowerCostCutsInitialHtml,
  renderUkFoodCosts2026InitialHtml,
} from './seoFoodCostGuides';

describe('food-cost guide publishing data', () => {
  it('publishes the guide with review metadata and source links', () => {
    expect(UK_FOOD_COSTS_2026_PATH).toBe('/food-costs/uk-food-costs-2026');
    expect(UK_FOOD_COSTS_2026.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(UK_FOOD_COSTS_2026.sources.length).toBeGreaterThanOrEqual(5);
    expect(UK_FOOD_COSTS_2026.sources.every(source => source.url.startsWith('https://'))).toBe(true);
    expect(UK_FOOD_COSTS_2026.sources.map(source => source.label)).toEqual(expect.arrayContaining([
      expect.stringContaining('ONS'),
      expect.stringContaining('British Retail Consortium'),
      expect.stringContaining('Which?'),
      expect.stringContaining('Food Foundation'),
      expect.stringContaining('Food and Drink Federation'),
      expect.stringContaining('IGD'),
    ]));
    expect(UK_FOOD_COSTS_2026.indexingStatus).toBe('index');
    expect(UK_FOOD_COSTS_2026.disclosures).toEqual(expect.arrayContaining(['source_timing', 'price_comparison']));
  });

  it('uses Article schema and an indexable initial article body', () => {
    const jsonLd = getUkFoodCosts2026JsonLd();
    expect(jsonLd['@graph'][0]).toMatchObject({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${UK_FOOD_COSTS_2026_PATH}` });
    const html = renderUkFoodCosts2026InitialHtml();
    expect(html).toContain(`<h1>${UK_FOOD_COSTS_2026.title}</h1>`);
    expect(html).toContain('Sources');
    expect(html).toContain('/dinner-plans/5-dinners-for-2-under-40');
    expect(html).toContain('a peak of 5.5 per cent');
    expect(html).toContain('an average of 3.7 to 4.7 per cent');
    expect(html).toContain('How to read these figures');
    expect(html).toContain('cannot predict one household’s shopping total');
    expect(html).toContain('About this guide');
  });

  it('publishes the lower-cost-cuts guide as an evidence-light comparison method', () => {
    expect(LOWER_COST_CUTS_PATH).toBe('/food-costs/cooking-for-four-with-lower-cost-cuts');
    expect(LOWER_COST_CUTS_GUIDE.indexingStatus).toBe('index');
    expect(LOWER_COST_CUTS_GUIDE.disclosures).toEqual(expect.arrayContaining(['price_comparison', 'serving_assumption', 'source_timing', 'storage_and_cooking']));
    expect(LOWER_COST_CUTS_GUIDE.disclosures).not.toContain('price_estimate');
    expect(LOWER_COST_CUTS_GUIDE.sources).toHaveLength(3);

    const html = renderLowerCostCutsInitialHtml();
    expect(html).toContain(`<h1>${LOWER_COST_CUTS_GUIDE.title}</h1>`);
    expect(html).toContain('Illustrative calculation');
    expect(html).toContain('does not rank cuts or use live retailer prices');
    expect(html).toContain("eight of your household's usual servings");
    expect(html).toContain('Storage and safety');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('/food-costs/uk-food-costs-2026');
    expect(html).toContain('About this guide');

    const jsonLd = getLowerCostCutsJsonLd();
    expect(jsonLd['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${LOWER_COST_CUTS_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });
});
