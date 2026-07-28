import { describe, expect, it } from 'vitest';
import { FIVE_DINNERS_FOR_TWO_UNDER_40 as plan, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd, renderFiveDinnersForTwoInitialHtml } from './seoMealPlans';

describe('SEO meal-plan publishing data', () => {
  it('publishes a stable five-dinner plan within its stated checkout target', () => {
    expect(plan.status).toBe('published');
    expect(plan.dinners).toHaveLength(5);
    expect(new Set(plan.dinners.map(dinner => dinner.title)).size).toBe(5);
    expect(plan.dinners.reduce((sum, dinner) => sum + dinner.estimatedCost, 0)).toBeCloseTo(plan.estimatedIngredientCost);
    expect(plan.expectedCheckoutCost).toBeLessThanOrEqual(plan.budgetTarget);
    expect(plan.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(plan.editorialOwner).toBeTruthy();
    expect(plan.introduction.join(' ').length).toBeGreaterThan(600);
    expect(plan.shoppingStrategy).toHaveLength(4);
    expect(plan.budgetPrinciples).toHaveLength(4);
    expect(plan.flexibleScenarios).toHaveLength(4);
    expect(plan.shoppingList.reduce((sum, item) => sum + item.checkoutCost, 0)).toBeCloseTo(plan.expectedCheckoutCost);
    expect(plan.shoppingList.reduce((sum, item) => sum + item.usedValue, 0)).toBeCloseTo(plan.estimatedIngredientCost);
    expect(plan.faqs.length).toBeGreaterThanOrEqual(4);
    expect(plan.indexingStatus).toBe('index');
    expect(plan.primarySearchIntent).toBeTruthy();
    expect(plan.disclosures).toEqual(expect.arrayContaining(['price_estimate', 'serving_assumption']));
    expect(`${plan.title} ${plan.shortTitle} ${plan.seoTitle}`).not.toMatch(/\baffordable\b/i);
  });

  it('uses the same canonical path in structured publishing data', () => {
    const jsonLd = getFiveDinnersForTwoJsonLd();
    expect(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH).toBe('/dinner-plans/5-dinners-for-2-under-40');
    expect(jsonLd['@graph'][0]).toMatchObject({
      '@type': 'CollectionPage',
      url: `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`,
    });
  });

  it('puts the auditable calculation and every FAQ in initial HTML', () => {
    const html = renderFiveDinnersForTwoInitialHtml();
    expect(html).toContain('Complete shopping list and cost calculation');
    expect(html).toContain('about £2.54 per portion');
    expect(html).toContain('Prices checked 18 July 2026');
    expect(html).toContain('About these estimates');
    expect(html).toContain('Cooking energy is excluded');
    expect(html).toContain('About this guide');
    plan.faqs.forEach(item => expect(html).toContain(item.question));
  });
});
