import { describe, expect, it } from 'vitest';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';
import {
  SAUSAGE_WAYS_GUIDE,
  SAUSAGE_WAYS_GUIDE_FAQS,
  SAUSAGE_WAYS_GUIDE_PATH,
  SAUSAGE_WAYS_GUIDE_RECORD,
} from './sausageWaysGuide';

describe('sausage ways public guide', () => {
  it('renders the complete article, disclosures, FAQs, sources and one search handoff', () => {
    const html = renderPublicGuideInitialHtml(SAUSAGE_WAYS_GUIDE_RECORD);
    expect(html).toContain(`<h1>${SAUSAGE_WAYS_GUIDE.title}</h1>`);
    expect(html).toContain('Sausage, apple and mustard traybake');
    expect(html).toContain('Sausage and potato hash');
    expect(html).toContain('How to read the price example');
    expect(html).toContain('Rice needs a little more care.');
    SAUSAGE_WAYS_GUIDE_FAQS.forEach(faq => expect(html).toContain(`<h3>${faq.question}</h3>`));
    SAUSAGE_WAYS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
    expect(html.match(/href="\/signin"/g)).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain('meal');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideJsonLd(SAUSAGE_WAYS_GUIDE_RECORD);
    expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${SAUSAGE_WAYS_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].mainEntity).toHaveLength(SAUSAGE_WAYS_GUIDE_FAQS.length);
  });
});
