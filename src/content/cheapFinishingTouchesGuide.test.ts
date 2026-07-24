import { describe, expect, it } from 'vitest';
import {
  CHEAP_FINISHING_TOUCHES_FAQS,
  CHEAP_FINISHING_TOUCHES_GUIDE,
  CHEAP_FINISHING_TOUCHES_GUIDE_PATH,
  getCheapFinishingTouchesGuideJsonLd,
  renderCheapFinishingTouchesGuideInitialHtml,
} from './cheapFinishingTouchesGuide';

describe('cheap finishing touches public guide', () => {
  it('renders complete crawler-visible content and publishing links', () => {
    const html = renderCheapFinishingTouchesGuideInitialHtml();
    expect(html).toContain(`<h1>${CHEAP_FINISHING_TOUCHES_GUIDE.title}</h1>`);
    expect(html).toContain('Acid: when a dish tastes flat or heavy');
    expect(html).toContain('What low-cost means here');
    expect(html).toContain('check every label');
    CHEAP_FINISHING_TOUCHES_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    CHEAP_FINISHING_TOUCHES_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    CHEAP_FINISHING_TOUCHES_GUIDE.internalLinks
      .filter(path => path !== CHEAP_FINISHING_TOUCHES_GUIDE_PATH)
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getCheapFinishingTouchesGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${CHEAP_FINISHING_TOUCHES_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(CHEAP_FINISHING_TOUCHES_FAQS.length);
    expect(jsonLd['@graph'][2].itemListElement[2].item).toBe(`https://dinnerbydesign.app${CHEAP_FINISHING_TOUCHES_GUIDE_PATH}`);
  });
});
