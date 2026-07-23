import { describe, expect, it } from 'vitest';
import {
  COMPLETE_PACKS_GUIDE,
  COMPLETE_PACKS_GUIDE_PATH,
  getCompletePacksGuideJsonLd,
  renderCompletePacksGuideInitialHtml,
} from './completePacksGuide';

describe('complete packs guide', () => {
  it('publishes an indexable guide with the required transparency information', () => {
    expect(COMPLETE_PACKS_GUIDE_PATH).toBe('/food-costs/how-to-use-complete-packs');
    expect(COMPLETE_PACKS_GUIDE.indexingStatus).toBe('index');
    expect(COMPLETE_PACKS_GUIDE.disclosures).toEqual(['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    expect(COMPLETE_PACKS_GUIDE.internalLinks).toContain('/food-costs/five-dinners-same-ingredients');
    expect(COMPLETE_PACKS_GUIDE.internalLinks).toContain('/guides');
    expect(COMPLETE_PACKS_GUIDE.sources).toHaveLength(2);
  });

  it('provides crawlable article, FAQ and breadcrumb content', () => {
    const html = renderCompletePacksGuideInitialHtml();
    expect(html).toContain(`<h1>${COMPLETE_PACKS_GUIDE.title}</h1>`);
    expect(html).toContain('Complete-pack planning examples');
    expect(html).toContain('Plan my week');
    expect(html).toContain('About this guide');

    const jsonLd = getCompletePacksGuideJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    const faqPage = jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
    expect(faqPage?.mainEntity).toHaveLength(COMPLETE_PACKS_GUIDE.faqs.length);
  });
});
