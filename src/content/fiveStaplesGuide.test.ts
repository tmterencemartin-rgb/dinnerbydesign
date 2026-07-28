import { describe, expect, it } from 'vitest';
import {
  FIVE_STAPLES_GUIDE,
  FIVE_STAPLES_GUIDE_PATH,
  getFiveStaplesGuideJsonLd,
  renderFiveStaplesGuideInitialHtml,
} from './fiveStaplesGuide';

describe('five staples public guide', () => {
  it('renders the complete article and one account handoff', () => {
    const html = renderFiveStaplesGuideInitialHtml();
    expect(html).toContain(`<h1>${FIVE_STAPLES_GUIDE.title}</h1>`);
    expect(html).toContain('The five dinners at a glance');
    expect(html).toContain('Coconut chickpea dumpling curry');
    expect(html).toContain('Food Standards Agency');
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    FIVE_STAPLES_GUIDE.faqs.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    FIVE_STAPLES_GUIDE.internalLinks
      .filter(path => path !== FIVE_STAPLES_GUIDE_PATH && path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getFiveStaplesGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${FIVE_STAPLES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(FIVE_STAPLES_GUIDE.faqs.length);
  });
});
