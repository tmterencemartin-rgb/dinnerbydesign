import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE,
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  getNineBudgetDinnersWithTinnedVegetablesGuideJsonLd,
  renderNineBudgetDinnersWithTinnedVegetablesGuideInitialHtml,
} from './nineBudgetDinnersWithTinnedVegetablesGuide';

describe('nine budget dinners with tinned vegetables public guide', () => {
  it('renders the approved article, disclosures, FAQs, sources and search handoff', () => {
    const html = renderNineBudgetDinnersWithTinnedVegetablesGuideInitialHtml();
    expect(html).toContain(`<h1>${NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.title}</h1>`);
    expect(html).toContain('6. Dum aloo potato curry');
    expect(html).toContain('9. Sweetcorn fritters with eggs and black bean salsa');
    expect(html).toContain('A note on the cupboard');
    expect(html).toContain('Storage and cooking safety');
    NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.faqs.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.replace(/href="[^"]+"/g, '').toLowerCase()).not.toContain('meal');
    expect(html.toLowerCase()).not.toContain('cheap');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getNineBudgetDinnersWithTinnedVegetablesGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.faqs.length);
  });
});
