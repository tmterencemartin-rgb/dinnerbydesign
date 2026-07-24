import { describe, expect, it } from 'vitest';
import {
  HOME_COOKED_READY_MADE_FAQS,
  HOME_COOKED_READY_MADE_GUIDE,
  HOME_COOKED_READY_MADE_GUIDE_PATH,
  getHomeCookedReadyMadeGuideJsonLd,
  renderHomeCookedReadyMadeGuideInitialHtml,
} from './homeCookedReadyMadeGuide';

describe('home-cooked or ready-made guide publishing data', () => {
  it('renders the approved article, FAQs, sources and crawlable links', () => {
    const html = renderHomeCookedReadyMadeGuideInitialHtml();
    expect(html).toContain(`<h1>${HOME_COOKED_READY_MADE_GUIDE.title}</h1>`);
    expect(html).toContain('Ready-made versions contained significantly more free sugar overall.');
    expect(html).toContain('Frozen vegetables, a side salad or extra protein are straightforward additions');
    HOME_COOKED_READY_MADE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    HOME_COOKED_READY_MADE_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    HOME_COOKED_READY_MADE_GUIDE.internalLinks
      .filter(path => path !== '/signin')
      .forEach(path => expect(html).toContain(`href="${path}"`));
  });

  it('provides matching Article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getHomeCookedReadyMadeGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${HOME_COOKED_READY_MADE_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(HOME_COOKED_READY_MADE_FAQS.length);
    expect(jsonLd['@graph'][2].itemListElement[2].item).toBe(`https://dinnerbydesign.app${HOME_COOKED_READY_MADE_GUIDE_PATH}`);
  });
});
