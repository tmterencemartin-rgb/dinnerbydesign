import { describe, expect, it } from 'vitest';
import { WHOLE_CHICKEN_VALUE_GUIDE, WHOLE_CHICKEN_VALUE_GUIDE_PATH, getWholeChickenValueGuideJsonLd, renderWholeChickenValueGuideInitialHtml } from './wholeChickenValueGuide';

describe('whole chicken value public guide', () => {
  it('renders the approved article, sources, internal guide and search handoff', () => {
    const html = renderWholeChickenValueGuideInitialHtml();
    expect(html).toContain(`<h1>${WHOLE_CHICKEN_VALUE_GUIDE.title}</h1>`);
    expect(html).toContain('What a whole chicken gives you');
    expect(html).toContain('How to compare fairly in the shop');
    expect(html).toContain('href="/guides/9-budget-dinners-with-leftover-roast-chicken"');
    WHOLE_CHICKEN_VALUE_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getWholeChickenValueGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${WHOLE_CHICKEN_VALUE_GUIDE_PATH}`);
  });
});
