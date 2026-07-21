import { describe, expect, it } from 'vitest';
import {
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  LOW_COST_COOKING_TECHNIQUES_GUIDE,
  LOW_COST_COOKING_TECHNIQUES_PATH,
  OFFAL_BUDGET_GUIDE,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getCookingForOneJsonLd,
  getFreshOrFrozenGuideJsonLd,
  getLowerCostCutsJsonLd,
  getLowCostCookingTechniquesJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getSummerStewsGuideJsonLd,
  getUkFoodCosts2026JsonLd,
  renderCookingForOneInitialHtml,
  renderFreshOrFrozenGuideInitialHtml,
  renderLowerCostCutsInitialHtml,
  renderLowCostCookingTechniquesInitialHtml,
  renderOffalBudgetGuideInitialHtml,
  renderPortionPlanningGuideInitialHtml,
  renderSummerStewsGuideInitialHtml,
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

  it('publishes the low-cost cooking techniques guide with sources, disclosures and structured data', () => {
    expect(LOW_COST_COOKING_TECHNIQUES_PATH).toBe('/food-costs/low-cost-cooking-techniques');
    expect(LOW_COST_COOKING_TECHNIQUES_GUIDE.indexingStatus).toBe('index');
    expect(LOW_COST_COOKING_TECHNIQUES_GUIDE.disclosures).toEqual(['allergen_and_product', 'storage_and_cooking', 'source_timing']);
    expect(LOW_COST_COOKING_TECHNIQUES_GUIDE.disclosures).not.toContain('price_estimate');
    expect(LOW_COST_COOKING_TECHNIQUES_GUIDE.sources).toHaveLength(3);

    const html = renderLowCostCookingTechniquesInitialHtml();
    expect(html).toContain(`<h1>${LOW_COST_COOKING_TECHNIQUES_GUIDE.title}</h1>`);
    expect(html).toContain('Representative dinner: koshary');
    expect(html).toContain('Representative dinner: ribollita');
    expect(html).toContain('Ingredients and allergens');
    expect(html).toContain('Storage and safety');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('/food-costs/cooking-for-four-with-lower-cost-cuts');
    expect(html).toContain('/food-safety');
    expect(html).toContain('About this guide');
    expect(html).not.toContain('[EDITOR:');

    const jsonLd = getLowCostCookingTechniquesJsonLd();
    expect(jsonLd['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${LOW_COST_COOKING_TECHNIQUES_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });

  it('publishes the cooking-for-one guide with practical disclosures and structured data', () => {
    expect(COOKING_FOR_ONE_PATH).toBe('/food-costs/cooking-for-one-without-waste');
    expect(COOKING_FOR_ONE_GUIDE.indexingStatus).toBe('index');
    expect(COOKING_FOR_ONE_GUIDE.disclosures).toEqual(['allergen_and_product', 'serving_assumption', 'storage_and_cooking', 'source_timing']);
    expect(COOKING_FOR_ONE_GUIDE.sources).toHaveLength(1);

    const html = renderCookingForOneInitialHtml();
    expect(html).toContain(`<h1>${COOKING_FOR_ONE_GUIDE.title}</h1>`);
    expect(html).toContain('Plan a short sequence, not a rigid week');
    expect(html).toContain('A three-dinner example');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('/food-costs/low-cost-cooking-techniques');
    expect(html).toContain('/food-safety');
    expect(html).toContain('About this guide');

    const jsonLd = getCookingForOneJsonLd();
    expect(jsonLd['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${COOKING_FOR_ONE_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });

  it('publishes the offal guide with qualified prices, safety guidance and structured data', () => {
    expect(OFFAL_BUDGET_GUIDE_PATH).toBe('/food-costs/cooking-with-offal-on-a-budget');
    expect(OFFAL_BUDGET_GUIDE.indexingStatus).toBe('index');
    expect(OFFAL_BUDGET_GUIDE.disclosures).toEqual(['price_comparison', 'source_timing', 'storage_and_cooking', 'allergen_and_product', 'serving_assumption']);
    expect(OFFAL_BUDGET_GUIDE.sources).toHaveLength(5);
    const html = renderOffalBudgetGuideInitialHtml();
    expect(html).toContain(`<h1>${OFFAL_BUDGET_GUIDE.title}</h1>`);
    expect(html).toContain('How to read this price snapshot');
    expect(html).toContain('complete-pack checkout cost');
    expect(html).toContain('Find offal dinners and products');
    expect(html).toContain('/pricing-methodology');
    expect(getOffalBudgetGuideJsonLd()['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${OFFAL_BUDGET_GUIDE_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });

  it('publishes the portion-planning guide with controlled disclosures and structured data', () => {
    expect(PORTION_PLANNING_GUIDE_PATH).toBe('/food-costs/portion-planning-and-food-waste');
    expect(PORTION_PLANNING_GUIDE.indexingStatus).toBe('index');
    expect(PORTION_PLANNING_GUIDE.disclosures).toEqual(['serving_assumption', 'storage_and_cooking', 'allergen_and_product', 'source_timing']);
    expect(PORTION_PLANNING_GUIDE.sources).toHaveLength(2);
    const html = renderPortionPlanningGuideInitialHtml();
    expect(html).toContain(`<h1>${PORTION_PLANNING_GUIDE.title}</h1>`);
    expect(html).toContain('Portion planning, not portion control');
    expect(html).toContain('Serving assumption');
    expect(html).toContain('Making portion planning work');
    expect(html).toContain('/pricing-methodology');
    expect(getPortionPlanningGuideJsonLd()['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${PORTION_PLANNING_GUIDE_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });

  it('publishes the summer-stews guide with flexible dinner ideas and safety disclosures', () => {
    expect(SUMMER_STEWS_GUIDE_PATH).toBe('/food-costs/summer-stews-seasonal-vegetables');
    expect(SUMMER_STEWS_GUIDE.indexingStatus).toBe('index');
    expect(SUMMER_STEWS_GUIDE.disclosures).toEqual(['storage_and_cooking', 'allergen_and_product', 'source_timing']);
    expect(SUMMER_STEWS_GUIDE.disclosures).not.toContain('price_estimate');
    expect(SUMMER_STEWS_GUIDE.sources).toHaveLength(1);

    const html = renderSummerStewsGuideInitialHtml();
    expect(html).toContain(`<h1>${SUMMER_STEWS_GUIDE.title}</h1>`);
    expect(html).toContain('Three flexible dinner ideas');
    expect(html).toContain('Cook the chicken thoroughly');
    expect(html).toContain('Ingredients and allergens');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('/food-costs/low-cost-cooking-techniques');
    expect(html).toContain('/food-safety');
    expect(html).toContain('About this guide');

    expect(getSummerStewsGuideJsonLd()['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${SUMMER_STEWS_GUIDE_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });

  it('publishes the fresh-or-frozen guide with a qualified comparison and crawlable links', () => {
    expect(FRESH_OR_FROZEN_GUIDE_PATH).toBe('/food-costs/fresh-or-frozen');
    expect(FRESH_OR_FROZEN_GUIDE.indexingStatus).toBe('index');
    expect(FRESH_OR_FROZEN_GUIDE.disclosures).toEqual(['storage_and_cooking', 'source_timing']);
    expect(FRESH_OR_FROZEN_GUIDE.sources).toHaveLength(2);
    const html = renderFreshOrFrozenGuideInitialHtml();
    expect(html).toContain(`<h1>${FRESH_OR_FROZEN_GUIDE.title}</h1>`);
    expect(html).toContain('<table>');
    expect(html).toContain('Neither format is universally better');
    expect(html).toContain('/food-costs/portion-planning-and-food-waste');
    expect(html).toContain('About this guide');
    expect(getFreshOrFrozenGuideJsonLd()['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Article', mainEntityOfPage: `https://dinnerbydesign.app${FRESH_OR_FROZEN_GUIDE_PATH}` }),
      expect.objectContaining({ '@type': 'FAQPage' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
  });
});
