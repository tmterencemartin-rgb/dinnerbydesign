import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE,
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
} from './nineBudgetDinnersWithSavouryPiesGuide';

describe('savoury pies public guide', () => {
  it('renders the approved guide and its sources', () => {
    const html = renderPublicGuideInitialHtml(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD);
    expect(html).toContain(`<h1>${NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE.title}</h1>`);
    expect(html).toContain('9. Corned beef pie');
    expect(html).toContain(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD.cta.copy);
    NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][0].citation).toHaveLength(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD.sources.length);
  });
});
