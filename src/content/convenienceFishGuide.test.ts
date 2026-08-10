import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  CONVENIENCE_FISH_GUIDE,
  CONVENIENCE_FISH_GUIDE_PATH,
  CONVENIENCE_FISH_GUIDE_RECORD,
} from './convenienceFishGuide';

describe('convenience fish guide', () => {
  it('publishes a complete crawler-visible guide', () => {
    const html = renderPublicGuideInitialHtml(CONVENIENCE_FISH_GUIDE_RECORD);
    expect(html).toContain(`<h1>${CONVENIENCE_FISH_GUIDE.title}</h1>`);
    expect(html).toContain('Fish finger dinner ideas');
    expect(html).toContain('Scampi beyond chips');
    expect(html).toContain('Frequently asked questions');
    expect(html).toContain('Sources');
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
  });

  it('declares disclosures and relevant internal links', () => {
    expect(CONVENIENCE_FISH_GUIDE.disclosures).toEqual([
      'allergen_and_product',
      'storage_and_cooking',
      'source_timing',
    ]);
    const html = renderPublicGuideInitialHtml(CONVENIENCE_FISH_GUIDE_RECORD);
    CONVENIENCE_FISH_GUIDE_RECORD.internalLinks
      .filter(path => path !== CONVENIENCE_FISH_GUIDE_PATH && path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(CONVENIENCE_FISH_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${CONVENIENCE_FISH_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(CONVENIENCE_FISH_GUIDE.faqs.length);
  });
});
