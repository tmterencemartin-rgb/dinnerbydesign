import { describe, expect, it } from 'vitest';
import {
  BATCH_COOKING_DISCLOSURE_FOOTER,
  BATCH_COOKING_DISCLOSURES,
  CHEAPER_MEAT_CUTS_COST_DISCLOSURES,
  CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER,
  CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES,
  CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES,
  FIVE_DINNERS_PRICE_DISCLOSURES,
  FRESH_OR_FROZEN_DISCLOSURE_FOOTER,
  FRESH_OR_FROZEN_DISCLOSURES,
  GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER,
  GROCERY_COST_OPTIONS_DISCLOSURES,
  GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER,
  GROCERY_COST_PREDICTION_DISCLOSURES,
  HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER,
  HOME_COOKED_READY_MADE_DISCLOSURES,
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
  LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER,
  LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES,
  LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES,
  PROGRAMMATIC_DISCLOSURE_FOOTER,
  PROGRAMMATIC_DISCLOSURE_KEYS,
  SHARED_INGREDIENTS_DISCLOSURE_FOOTER,
  SHARED_INGREDIENTS_PLANNING_DISCLOSURES,
  SHARED_INGREDIENTS_SAFETY_DISCLOSURES,
  SUMMER_STEWS_DISCLOSURE_FOOTER,
  SUMMER_STEWS_DISCLOSURES,
  UK_FOOD_COST_CONTEXT_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

describe('programmatic disclosure publishing copy', () => {
  it('keeps every disclosure on the controlled key list', () => {
    const allowed = new Set(PROGRAMMATIC_DISCLOSURE_KEYS);
    [...FIVE_DINNERS_PRICE_DISCLOSURES, ...UK_FOOD_COST_CONTEXT_DISCLOSURES, ...LOWER_COST_CUTS_COMPARISON_DISCLOSURES, ...LOWER_COST_CUTS_SAFETY_DISCLOSURES, ...LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES, ...LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES, ...SUMMER_STEWS_DISCLOSURES, ...FRESH_OR_FROZEN_DISCLOSURES, ...BATCH_COOKING_DISCLOSURES, ...GROCERY_COST_OPTIONS_DISCLOSURES, ...GROCERY_COST_PREDICTION_DISCLOSURES, ...CHEAPER_MEAT_CUTS_COST_DISCLOSURES, ...CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES, ...CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES, ...SHARED_INGREDIENTS_PLANNING_DISCLOSURES, ...SHARED_INGREDIENTS_SAFETY_DISCLOSURES, ...HOME_COOKED_READY_MADE_DISCLOSURES].forEach(item => expect(allowed.has(item.key)).toBe(true));
  });

  it('renders important qualifications and methodology links in initial HTML', () => {
    const disclosureHtml = renderProgrammaticDisclosuresInitialHtml(FIVE_DINNERS_PRICE_DISCLOSURES);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml();
    expect(disclosureHtml).toContain('aria-label="Important information"');
    expect(disclosureHtml).toContain('Cooking energy is excluded');
    PROGRAMMATIC_DISCLOSURE_FOOTER.links.forEach(link => expect(footerHtml).toContain(`href="${link.href}"`));
  });

  it('keeps the lower-cost-cuts guide free of market-price claims', () => {
    const html = renderProgrammaticDisclosuresInitialHtml(LOWER_COST_CUTS_COMPARISON_DISCLOSURES);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(LOWER_COST_CUTS_DISCLOSURE_FOOTER);
    expect(html).toContain('illustrative rather than a market-price estimate');
    expect(LOWER_COST_CUTS_COMPARISON_DISCLOSURES.map(item => item.key)).not.toContain('price_estimate');
    expect(footerHtml).toContain('/food-safety');
  });

  it('qualifies allergens and food safety without implying a price comparison', () => {
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER);
    expect(LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES.map(item => item.key)).toEqual(['allergen_and_product']);
    expect(LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES.map(item => item.key)).toEqual(['storage_and_cooking', 'source_timing']);
    expect(footerHtml).toContain('/food-safety');
    expect(footerHtml).toContain('/recipe-methodology');
  });

  it('publishes summer-stews safety, allergen and review disclosures', () => {
    expect(SUMMER_STEWS_DISCLOSURES.map(item => item.key)).toEqual(['storage_and_cooking', 'allergen_and_product', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(SUMMER_STEWS_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/food-safety');
    expect(footerHtml).toContain('/recipe-methodology');
  });

  it('publishes fresh-or-frozen storage and review disclosures', () => {
    expect(FRESH_OR_FROZEN_DISCLOSURES.map(item => item.key)).toEqual(['storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(FRESH_OR_FROZEN_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/food-safety');
    expect(footerHtml).toContain('/recipe-methodology');
  });

  it('publishes batch-cooking allergen, storage and review disclosures', () => {
    expect(BATCH_COOKING_DISCLOSURES.map(item => item.key)).toEqual(['allergen_and_product', 'storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(BATCH_COOKING_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/food-safety');
    expect(footerHtml).toContain('/recipe-methodology');
  });

  it('publishes the grocery-cost cornerstone qualifications beside its claims', () => {
    expect(GROCERY_COST_OPTIONS_DISCLOSURES.map(item => item.key)).toEqual(['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/guides');
    expect(footerHtml).toContain('/pricing-methodology');
    expect(footerHtml).toContain('/food-safety');
  });

  it('publishes the grocery-prediction qualifications without an unrelated allergen disclosure', () => {
    expect(GROCERY_COST_PREDICTION_DISCLOSURES.map(item => item.key)).toEqual(['price_comparison', 'storage_and_cooking', 'source_timing']);
    expect(GROCERY_COST_PREDICTION_DISCLOSURES.map(item => item.key)).not.toContain('allergen_and_product');
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/guides');
    expect(footerHtml).toContain('/pricing-methodology');
    expect(footerHtml).toContain('/food-safety');
  });

  it('publishes the cheaper-meat-cuts cost, allergen and safety qualifications', () => {
    expect(CHEAPER_MEAT_CUTS_COST_DISCLOSURES.map(item => item.key)).toEqual(['price_comparison']);
    expect(CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES.map(item => item.key)).toEqual(['allergen_and_product']);
    expect(CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES.map(item => item.key)).toEqual(['storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/guides');
    expect(footerHtml).toContain('/pricing-methodology');
    expect(footerHtml).toContain('/food-safety');
  });

  it('publishes the shared-ingredients serving, cost, product and safety qualifications', () => {
    expect(SHARED_INGREDIENTS_PLANNING_DISCLOSURES.map(item => item.key)).toEqual(['serving_assumption', 'price_comparison', 'allergen_and_product']);
    expect(SHARED_INGREDIENTS_SAFETY_DISCLOSURES.map(item => item.key)).toEqual(['storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(SHARED_INGREDIENTS_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/guides');
    expect(footerHtml).toContain('/pricing-methodology');
    expect(footerHtml).toContain('/food-safety');
  });

  it('publishes the ready-made comparison qualifications and relevant methodology links', () => {
    expect(HOME_COOKED_READY_MADE_DISCLOSURES.map(item => item.key)).toEqual(['serving_assumption', 'price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    const footerHtml = renderProgrammaticDisclosureFooterInitialHtml(HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER);
    expect(footerHtml).toContain('/guides');
    expect(footerHtml).toContain('/nutrition-methodology');
    expect(footerHtml).toContain('/food-safety');
    expect(footerHtml).toContain('/pricing-methodology');
  });
});
