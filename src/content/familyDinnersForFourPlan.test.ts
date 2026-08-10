import { describe, expect, it } from 'vitest';
import {
  FAMILY_DINNERS_FOR_FOUR as plan,
  FAMILY_DINNERS_FOR_FOUR_PATH,
  getFamilyDinnersForFourJsonLd,
  renderFamilyDinnersForFourInitialHtml,
} from './familyDinnersForFourPlan';

describe('family dinners for four publishing data', () => {
  it('reconciles recipe, basket and serving costs', () => {
    expect(plan.status).toBe('published');
    expect(plan.recipes).toHaveLength(5);
    expect(plan.servingCount).toBe(20);
    expect(plan.recipes.reduce((sum, recipe) => sum + recipe.cost, 0)).toBeCloseTo(plan.estimatedIngredientCost);
    expect(plan.basket.reduce((sum, item) => sum + item.packCost, 0)).toBeCloseTo(plan.expectedCheckoutCost);
    expect(plan.basket.reduce((sum, item) => sum + item.valueUsed, 0)).toBeCloseTo(plan.estimatedIngredientCost);
    expect(plan.estimatedIngredientCost / plan.servingCount).toBeCloseTo(plan.averageCostPerServing, 2);
    expect(plan.basket.filter(item => item.estimated).map(item => item.ingredient)).toEqual([
      'Cannellini or haricot beans',
      'Vegetable stock cubes',
      'Couscous',
    ]);
    expect(`${plan.title} ${plan.shortTitle} ${plan.seoTitle}`).not.toMatch(/\baffordable\b/i);
  });

  it('uses the canonical route and required structured data', () => {
    expect(FAMILY_DINNERS_FOR_FOUR_PATH).toBe('/dinner-plans/5-affordable-family-dinners-for-four');
    const jsonLd = getFamilyDinnersForFourJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual([
      'Article',
      'CollectionPage',
      'ItemList',
      'FAQPage',
      'BreadcrumbList',
    ]);
    expect(jsonLd['@graph']).toContainEqual(expect.objectContaining({
      '@type': 'CollectionPage',
      url: `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}`,
    }));
  });

  it('puts recipes, costs, disclosures and links in initial HTML', () => {
    const html = renderFamilyDinnersForFourInitialHtml();
    expect(html).toContain(`<h1>${plan.title}</h1>`);
    expect(html).toContain('Complete-pack checkout cost: £35.38');
    expect(html).toContain('Estimated ingredient value used: £18.31');
    expect(html).toContain('Cannellini or haricot beans');
    expect(html).toContain('marked as estimates');
    expect(html).toContain('/food-costs/portion-planning-and-food-waste');
    plan.recipes.forEach(recipe => expect(html).toContain(recipe.title));
    plan.faqs.forEach(item => expect(html).toContain(item.question));
  });
});
