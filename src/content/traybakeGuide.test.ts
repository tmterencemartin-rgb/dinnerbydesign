import { describe, expect, it } from 'vitest';
import {
  TRAYBAKE_GUIDE,
  TRAYBAKE_GUIDE_FAQS,
  TRAYBAKE_GUIDE_PATH,
  getTraybakeGuideJsonLd,
  renderTraybakeGuideInitialHtml,
} from './traybakeGuide';

describe('traybake public guide', () => {
  it('renders complete crawler-visible content with one search handoff', () => {
    const html = renderTraybakeGuideInitialHtml();
    expect(html).toContain(`<h1>${TRAYBAKE_GUIDE.title}</h1>`);
    expect(html).toContain('Choose a tray large enough');
    expect(html).toContain('75°C for 30 seconds');
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    TRAYBAKE_GUIDE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    TRAYBAKE_GUIDE.internalLinks
      .filter(path => path !== TRAYBAKE_GUIDE_PATH)
      .forEach(path => expect(html).toContain(`href="${path}`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getTraybakeGuideJsonLd();
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${TRAYBAKE_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(TRAYBAKE_GUIDE_FAQS.length);
  });
});
