import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE,
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD,
} from './nineBudgetDinnersWithPotatoesGuide';

describe('nine budget dinners with potatoes public guide', () => {
  it('renders the approved dinners, sources, links and handoff', () => {
    const html = renderPublicGuideInitialHtml(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD);
    expect(html).toContain(`<h1>${NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE.title}</h1>`);
    expect(html).toContain('4. Pea and mint fishcakes');
    expect(html).toContain('coated in breadcrumbs and fried until golden');
    expect(html).toContain('href="/guides/nine-budget-dinners-built-around-bubble-and-squeak"');
    expect(html).toContain(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD.cta.copy);
    NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][0].citation).toHaveLength(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD.sources.length);
  });
});
