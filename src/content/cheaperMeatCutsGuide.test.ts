import { describe, expect, it } from 'vitest';
import {
  CHEAPER_MEAT_CUTS_GUIDE,
  CHEAPER_MEAT_CUTS_GUIDE_PATH,
  getCheaperMeatCutsGuideJsonLd,
  renderCheaperMeatCutsGuideInitialHtml,
} from './cheaperMeatCutsGuide';

describe('cheaper meat cuts guide', () => {
  it('publishes as an indexable method-led guide', () => {
    expect(CHEAPER_MEAT_CUTS_GUIDE_PATH).toBe('/food-costs/cooking-with-cheaper-cuts-of-meat');
    expect(CHEAPER_MEAT_CUTS_GUIDE.indexingStatus).toBe('index');
    expect(CHEAPER_MEAT_CUTS_GUIDE.disclosures).toEqual(['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing']);
    expect(CHEAPER_MEAT_CUTS_GUIDE.internalLinks).toContain('/food-costs/cooking-for-four-with-lower-cost-cuts');
    expect(CHEAPER_MEAT_CUTS_GUIDE.internalLinks).toContain('/guides');
    expect(CHEAPER_MEAT_CUTS_GUIDE.sources).toHaveLength(2);
  });

  it('renders the approved reader-facing article without editorial notes', () => {
    const html = renderCheaperMeatCutsGuideInitialHtml();
    expect(html).toContain(`<h1>${CHEAPER_MEAT_CUTS_GUIDE.title}</h1>`);
    expect(html).toContain('Why are some cuts cheaper?');
    expect(html).toContain('Chicken thighs and drumsticks');
    expect(html).toContain('When a cheaper cut may not be better value');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('Sources and further reading');
    expect(html).toContain('Plan with these cuts in mind');
    expect(html).not.toContain('Suggested internal-link placements');
    expect(html).not.toContain('CTA link:');
  });

  it('provides article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getCheaperMeatCutsGuideJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']));
    const faqPage = jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
    expect(faqPage?.mainEntity).toHaveLength(CHEAPER_MEAT_CUTS_GUIDE.faqs.length);
  });
});
