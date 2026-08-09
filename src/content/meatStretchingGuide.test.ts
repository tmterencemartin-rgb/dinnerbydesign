import { describe, expect, it } from 'vitest';
import { MEAT_STRETCHING_GUIDE, MEAT_STRETCHING_GUIDE_PATH, getMeatStretchingGuideJsonLd, renderMeatStretchingGuideInitialHtml } from './meatStretchingGuide';

describe('meat stretching public guide', () => {
  it('renders the approved guide and its sources', () => {
    const html = renderMeatStretchingGuideInitialHtml();
    expect(html).toContain(`<h1>${MEAT_STRETCHING_GUIDE.title}</h1>`);
    expect(html).toContain('7. Beef meatballs with mushrooms and tomato sauce');
    MEAT_STRETCHING_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getMeatStretchingGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${MEAT_STRETCHING_GUIDE_PATH}`);
  });
});
