import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE,
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  getNineBudgetFriendlyDinnersWithEggsGuideJsonLd,
  renderNineBudgetFriendlyDinnersWithEggsGuideInitialHtml,
} from './nineBudgetFriendlyDinnersWithEggsGuide';

describe('nine budget-friendly dinners with eggs public guide', () => {
  it('renders the approved article, disclosures, FAQs, sources and search handoff', () => {
    const html = renderNineBudgetFriendlyDinnersWithEggsGuideInitialHtml();
    expect(html).toContain(`<h1>${NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.title}</h1>`);
    expect(html).toContain('1. Shakshuka');
    expect(html).toContain('9. Beans-and-greens pasta with fried eggs');
    expect(html).toContain('Variety, flexibility and reducing waste');
    expect(html).toContain('Storage and cooking safety');
    expect(html).toContain('Food Standards Agency: Rice');
    NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.faqs.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain('meal');
    expect(html.toLowerCase()).not.toContain('cheap');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getNineBudgetFriendlyDinnersWithEggsGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.faqs.length);
  });
});
