import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  PULSES_BUDGET_FAQS,
  PULSES_BUDGET_GUIDE,
  PULSES_BUDGET_GUIDE_PATH,
  PULSES_BUDGET_GUIDE_RECORD,
} from './pulsesBudgetGuide';

describe('pulses budget public guide', () => {
  it('renders complete crawler-visible content, comparison and sources', () => {
    const html = renderPublicGuideInitialHtml(PULSES_BUDGET_GUIDE_RECORD);
    expect(html).toContain(`<h1>${PULSES_BUDGET_GUIDE.title}</h1>`);
    expect(html).toContain('Dried or tinned: which is better value?');
    expect(html).toContain('Dried kidney beans need particular care');
    expect(html).toContain('<table>');
    PULSES_BUDGET_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    PULSES_BUDGET_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    PULSES_BUDGET_GUIDE.internalLinks
      .filter(path => path !== PULSES_BUDGET_GUIDE_PATH)
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(PULSES_BUDGET_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${PULSES_BUDGET_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(PULSES_BUDGET_FAQS.length);
  });
});
