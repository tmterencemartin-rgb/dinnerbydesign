import { describe, expect, it } from 'vitest';
import {
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
    expect(html).toContain('It is worth noting that a shared ingredient list');
    LOW_COST_DINNERS_GUIDE.internalLinks
      .filter(path => path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}"`));
  });

  it('uses matching Article and breadcrumb structured data', () => {
    const jsonLd = getLowCostDinnersGuideJsonLd();
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].itemListElement[2].item).toBe(`https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`);
  });
});
