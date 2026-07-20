import { describe, expect, it } from 'vitest';
import {
  FIVE_DINNERS_PRICE_DISCLOSURES,
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
  PROGRAMMATIC_DISCLOSURE_FOOTER,
  PROGRAMMATIC_DISCLOSURE_KEYS,
  UK_FOOD_COST_CONTEXT_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

describe('programmatic disclosure publishing copy', () => {
  it('keeps every disclosure on the controlled key list', () => {
    const allowed = new Set(PROGRAMMATIC_DISCLOSURE_KEYS);
    [...FIVE_DINNERS_PRICE_DISCLOSURES, ...UK_FOOD_COST_CONTEXT_DISCLOSURES, ...LOWER_COST_CUTS_COMPARISON_DISCLOSURES, ...LOWER_COST_CUTS_SAFETY_DISCLOSURES].forEach(item => expect(allowed.has(item.key)).toBe(true));
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
});
