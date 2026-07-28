import { describe, expect, it } from 'vitest';
import {
  TINNED_FISH_GUIDE,
  TINNED_FISH_GUIDE_PATH,
  getTinnedFishGuideJsonLd,
  renderTinnedFishGuideInitialHtml,
} from './tinnedFishGuide';

describe('tinned fish guide', () => {
  it('publishes a complete crawler-visible guide', () => {
    const html = renderTinnedFishGuideInitialHtml();
    expect(html).toContain(`<h1>${TINNED_FISH_GUIDE.title}</h1>`);
    expect(html).toContain('Tonno e fagioli');
    expect(html).toContain('Tinned and jarred shellfish');
    expect(html).toContain('Questions and answers');
    expect(html).toContain('Sources');
    expect(html).not.toContain('Production notes');
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
  });

  it('declares disclosures and relevant internal links', () => {
    expect(TINNED_FISH_GUIDE.disclosures).toEqual([
      'allergen_and_product',
      'storage_and_cooking',
      'source_timing',
    ]);
    const html = renderTinnedFishGuideInitialHtml();
    TINNED_FISH_GUIDE.internalLinks
      .filter(path => path !== TINNED_FISH_GUIDE_PATH && path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getTinnedFishGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${TINNED_FISH_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(TINNED_FISH_GUIDE.faqs.length);
  });
});
