import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE,
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD,
} from './bubbleAndSqueakBudgetDinnersGuide';

describe('bubble and squeak public guide', () => {
  it('renders the approved variations, sources, links and handoff', () => {
    const html = renderPublicGuideInitialHtml(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD);
    expect(html).toContain(`<h1>${BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE.title}</h1>`);
    expect(html).toContain('1. Bubble and squeak with fried eggs');
    expect(html).toContain('9. Bubble and squeak cakes with a simple salad and yoghurt or mustard dressing');
    expect(html).toContain('href="/guides/9-budget-dinners-with-leftover-roast-chicken"');
    expect(html).toContain('href="/guides"');
    BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH}`);
  });
});
