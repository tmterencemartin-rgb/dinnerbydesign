import { describe, expect, it } from 'vitest';
import { FIVE_DINNERS_FOR_TWO_UNDER_40 as plan, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd } from './seoMealPlans';

describe('SEO meal-plan publishing data', () => {
  it('publishes a stable five-dinner plan within its stated checkout target', () => {
    expect(plan.status).toBe('published');
    expect(plan.dinners).toHaveLength(5);
    expect(new Set(plan.dinners.map(dinner => dinner.title)).size).toBe(5);
    expect(plan.dinners.reduce((sum, dinner) => sum + dinner.estimatedCost, 0)).toBeCloseTo(plan.estimatedIngredientCost);
    expect(plan.expectedCheckoutCost).toBeLessThanOrEqual(plan.budgetTarget);
    expect(plan.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('uses the same canonical path in structured publishing data', () => {
    const jsonLd = getFiveDinnersForTwoJsonLd();
    expect(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH).toBe('/dinner-plans/5-dinners-for-2-under-40');
    expect(jsonLd['@graph'][0]).toMatchObject({
      '@type': 'CollectionPage',
      url: `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`,
    });
  });
});
