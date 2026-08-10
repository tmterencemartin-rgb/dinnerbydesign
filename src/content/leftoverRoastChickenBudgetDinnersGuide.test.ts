import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD,
} from './leftoverRoastChickenBudgetDinnersGuide';

describe('leftover roast chicken budget dinners public guide', () => {
  it('renders the complete article, disclosures, FAQs, sources and one search handoff', () => {
    const html = renderPublicGuideInitialHtml(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD);
    expect(html).toContain(`<h1>${LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.title}</h1>`);
    expect(html).toContain('Chicken fried rice');
    expect(html).toContain('Chicken hash with potatoes and a fried egg');
    expect(html).toContain('A note on food safety');
    expect(html).toContain('Food Standards Agency: Home food fact checker');
    expect(html).toContain('using it within 24 hours');
    LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain('meal');
    expect(html.toLowerCase()).not.toContain('cheap');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS.length);
  });
});
