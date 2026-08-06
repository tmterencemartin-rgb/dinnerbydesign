import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE,
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH,
  getNineBudgetDinnersThreeCuisinesGuideJsonLd,
  renderNineBudgetDinnersThreeCuisinesGuideInitialHtml,
} from './nineBudgetDinnersThreeCuisinesGuide';

describe('nine budget dinners from three cuisines public guide', () => {
  it('renders the approved article, disclosures, FAQs, sources and search handoff', () => {
    const html = renderNineBudgetDinnersThreeCuisinesGuideInitialHtml();
    expect(html).toContain(`<h1>${NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.title}</h1>`);
    expect(html).toContain('1. Home-style dal with rice or flatbreads');
    expect(html).toContain('8. Koshari-inspired rice, lentils and pasta');
    expect(html).toContain('Making budget ingredients go further');
    expect(html).toContain('About these estimates');
    expect(html).toContain('Food Standards Agency: Home food fact checker');
    NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.faqs.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain('meal');
    expect(html.toLowerCase()).not.toContain('cheap');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getNineBudgetDinnersThreeCuisinesGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.faqs.length);
  });
});
