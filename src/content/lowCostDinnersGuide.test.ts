import { describe, expect, it } from 'vitest';
import {
  LOW_COST_DINNERS_GUIDE_FAQS,
  LOW_COST_DINNERS_GUIDE,
  LOW_COST_DINNERS_GUIDE_PATH,
  getLowCostDinnersGuideJsonLd,
  renderLowCostDinnersGuideInitialHtml,
} from './lowCostDinnersGuide';

describe('low-cost dinners guide publishing data', () => {
  it('renders the approved article and crawlable internal links', () => {
    const html = renderLowCostDinnersGuideInitialHtml();
    expect(html).toContain('<h1>Low-cost dinners don&#039;t have to be boring</h1>');
    expect(html).toContain('Vegetables roasted quickly at a high temperature');
    expect(html).toContain('Work out what is actually missing');
    expect(html).toContain('Cost per use matters here');
    expect(html).toContain('It is worth noting that a shared ingredient list');
    LOW_COST_DINNERS_GUIDE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    LOW_COST_DINNERS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    LOW_COST_DINNERS_GUIDE.internalLinks
      .filter(path => path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}"`));
  });

  it('uses matching Article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getLowCostDinnersGuideJsonLd();
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(LOW_COST_DINNERS_GUIDE_FAQS.length);
    expect(jsonLd['@graph'][2].itemListElement[2].item).toBe(`https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`);
  });
});
