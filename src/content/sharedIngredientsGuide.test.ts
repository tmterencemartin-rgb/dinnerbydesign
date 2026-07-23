import { describe, expect, it } from 'vitest';
import {
  SHARED_INGREDIENTS_GUIDE,
  SHARED_INGREDIENTS_GUIDE_PATH,
  getSharedIngredientsGuideJsonLd,
  renderSharedIngredientsGuideInitialHtml,
} from './sharedIngredientsGuide';

describe('shared ingredients guide', () => {
  it('publishes as an indexable planning guide', () => {
    expect(SHARED_INGREDIENTS_GUIDE_PATH).toBe('/food-costs/five-dinners-same-ingredients');
    expect(SHARED_INGREDIENTS_GUIDE.indexingStatus).toBe('index');
    expect(SHARED_INGREDIENTS_GUIDE.disclosures).toEqual(['serving_assumption', 'price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    expect(SHARED_INGREDIENTS_GUIDE.internalLinks).toContain('/food-costs/ways-to-reduce-grocery-costs');
    expect(SHARED_INGREDIENTS_GUIDE.internalLinks).toContain('/guides');
    expect(SHARED_INGREDIENTS_GUIDE.sources).toHaveLength(2);
  });

  it('renders the approved five-dinner article and canonical source links', () => {
    const html = renderSharedIngredientsGuideInitialHtml();
    expect(html).toContain(`<h1>${SHARED_INGREDIENTS_GUIDE.title}</h1>`);
    expect(html).toContain('Smoky chicken, pepper and potato tray bake');
    expect(html).toContain('Chicken, pepper and tomato bake with a crisp potato topping');
    expect(html).toContain('Buying one larger tray does not automatically reduce the cost per serving');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food');
    expect(html).not.toContain('Internal notes');
    expect(html).not.toContain('if you keep it in');
  });

  it('provides article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getSharedIngredientsGuideJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']));
    const faqPage = jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
    expect(faqPage?.mainEntity).toHaveLength(SHARED_INGREDIENTS_GUIDE.faqs.length);
  });
});
