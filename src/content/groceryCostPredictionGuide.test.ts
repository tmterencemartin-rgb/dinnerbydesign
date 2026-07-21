import { describe, expect, it } from 'vitest';
import {
  GROCERY_COST_PREDICTION_GUIDE,
  GROCERY_COST_PREDICTION_GUIDE_PATH,
  getGroceryCostPredictionGuideJsonLd,
  renderGroceryCostPredictionGuideInitialHtml,
} from './groceryCostPredictionGuide';

describe('grocery-cost prediction guide', () => {
  it('publishes as an indexable transparency guide', () => {
    expect(GROCERY_COST_PREDICTION_GUIDE_PATH).toBe('/food-costs/why-grocery-costs-are-hard-to-predict');
    expect(GROCERY_COST_PREDICTION_GUIDE.indexingStatus).toBe('index');
    expect(GROCERY_COST_PREDICTION_GUIDE.disclosures).toEqual(['price_comparison', 'storage_and_cooking', 'source_timing']);
    expect(GROCERY_COST_PREDICTION_GUIDE.internalLinks).toContain('/pricing-methodology');
    expect(GROCERY_COST_PREDICTION_GUIDE.internalLinks).toContain('/guides');
    expect(GROCERY_COST_PREDICTION_GUIDE.sources).toHaveLength(1);
  });

  it('renders the complete approved article without editorial notes', () => {
    const html = renderGroceryCostPredictionGuideInitialHtml();
    expect(html).toContain(`<h1>${GROCERY_COST_PREDICTION_GUIDE.title}</h1>`);
    expect(html).toContain('You have to budget before you know the final cost');
    expect(html).toContain('ingredient value used');
    expect(html).toContain('complete-pack cost');
    expect(html).toContain('additional shopping cost');
    expect(html).toContain('How to read cost estimates');
    expect(html).toContain('Storage note');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('Sources and further reading');
    expect(html).toContain('Plan with greater visibility');
    expect(html).toContain('Plan my week');
    expect(html).not.toContain('Questions for the editor');
    expect(html).not.toContain('CTA link:');
  });

  it('provides article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getGroceryCostPredictionGuideJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']));
    const faqPage = jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
    expect(faqPage?.mainEntity).toHaveLength(GROCERY_COST_PREDICTION_GUIDE.faqs.length);
  });
});
