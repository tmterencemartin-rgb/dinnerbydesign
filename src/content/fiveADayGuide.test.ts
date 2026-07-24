import { describe, expect, it } from 'vitest';
import { FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH, getFiveADayGuideJsonLd, renderFiveADayGuideInitialHtml } from './fiveADayGuide';

describe('5 A Day guide publishing data', () => {
  it('renders the approved article and visible source links', () => {
    const html = renderFiveADayGuideInitialHtml();
    expect(html).toContain(`<h1>${FIVE_A_DAY_GUIDE.title}</h1>`);
    expect(html).toContain('800g eligible vegetables in the pot');
    expect(html).toContain('Beans and pulses can count only once per day');
    FIVE_A_DAY_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
  });

  it('uses matching Article and breadcrumb structured data', () => {
    const jsonLd = getFiveADayGuideJsonLd();
    expect(jsonLd['@graph'][0].mainEntityOfPage).toBe(`https://dinnerbydesign.app${FIVE_A_DAY_GUIDE_PATH}`);
    expect(jsonLd['@graph'][1].itemListElement[2].item).toBe(`https://dinnerbydesign.app${FIVE_A_DAY_GUIDE_PATH}`);
  });
});
