import { describe, expect, it } from 'vitest';
import {
  CONVENIENCE_FISH_GUIDE,
  CONVENIENCE_FISH_GUIDE_PATH,
  getConvenienceFishGuideJsonLd,
  renderConvenienceFishGuideInitialHtml,
} from './convenienceFishGuide';

describe('convenience fish guide', () => {
  it('publishes a complete crawler-visible guide', () => {
    const html = renderConvenienceFishGuideInitialHtml();
    expect(html).toContain(`<h1>${CONVENIENCE_FISH_GUIDE.title}</h1>`);
    expect(html).toContain('Fish finger dinner ideas');
    expect(html).toContain('Scampi beyond chips');
    expect(html).toContain('Questions and answers');
    expect(html).toContain('Sources');
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
  });

  it('declares disclosures and relevant internal links', () => {
    expect(CONVENIENCE_FISH_GUIDE.disclosures).toEqual([
      'allergen_and_product',
      'storage_and_cooking',
      'source_timing',
    ]);
    const html = renderConvenienceFishGuideInitialHtml();
    CONVENIENCE_FISH_GUIDE.internalLinks
      .filter(path => path !== CONVENIENCE_FISH_GUIDE_PATH && path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getConvenienceFishGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${CONVENIENCE_FISH_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(CONVENIENCE_FISH_GUIDE.faqs.length);
  });
});
