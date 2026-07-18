import { describe, expect, it } from 'vitest';
import { UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH, getUkFoodCosts2026JsonLd, renderUkFoodCosts2026InitialHtml } from './seoFoodCostGuides';

describe('food-cost guide publishing data', () => {
  it('publishes the guide with review metadata and source links', () => {
    expect(UK_FOOD_COSTS_2026_PATH).toBe('/food-costs/uk-food-costs-2026');
    expect(UK_FOOD_COSTS_2026.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(UK_FOOD_COSTS_2026.sources.length).toBeGreaterThanOrEqual(5);
    expect(UK_FOOD_COSTS_2026.sources.every(source => source.url.startsWith('https://'))).toBe(true);
  });

  it('uses Article schema and an indexable initial article body', () => {
    const jsonLd = getUkFoodCosts2026JsonLd();
    expect(jsonLd['@graph'][0]).toMatchObject({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${UK_FOOD_COSTS_2026_PATH}` });
    const html = renderUkFoodCosts2026InitialHtml();
    expect(html).toContain(`<h1>${UK_FOOD_COSTS_2026.title}</h1>`);
    expect(html).toContain('Sources');
    expect(html).toContain('/dinner-plans/5-dinners-for-2-under-40');
  });
});
