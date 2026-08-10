import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  MINCE_BUDGET_DINNERS_GUIDE,
  MINCE_BUDGET_DINNERS_GUIDE_FAQS,
  MINCE_BUDGET_DINNERS_GUIDE_PATH,
  MINCE_BUDGET_DINNERS_GUIDE_RECORD,
} from './minceBudgetDinnersGuide';

describe('mince budget dinners public guide', () => {
  it('renders the complete article, disclosures, FAQs, sources and one search handoff', () => {
    const html = renderPublicGuideInitialHtml(MINCE_BUDGET_DINNERS_GUIDE_RECORD);
    expect(html).toContain(`<h1>${MINCE_BUDGET_DINNERS_GUIDE.title}</h1>`);
    expect(html).toContain('Mince and bean chilli with rice or baked potatoes');
    expect(html).toContain('Mince ragu stretched with lentils, mushrooms or grated carrot');
    expect(html).toContain('A note on budget wording');
    expect(html).toContain('Food Standards Agency: Home food fact checker');
    MINCE_BUDGET_DINNERS_GUIDE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    MINCE_BUDGET_DINNERS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain('meal');
    expect(html.toLowerCase()).not.toContain('cheap');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(MINCE_BUDGET_DINNERS_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${MINCE_BUDGET_DINNERS_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(MINCE_BUDGET_DINNERS_GUIDE_FAQS.length);
  });
});
