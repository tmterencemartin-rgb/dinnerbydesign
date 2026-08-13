import { describe, expect, it } from 'vitest';
import {
  FAMILY_FUSSY_EATERS_GUIDE,
  FAMILY_FUSSY_EATERS_GUIDE_PATH,
  FAMILY_FUSSY_EATERS_GUIDE_RECORD,
} from './familyDinnersForFussyEatersGuide';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';

describe('family dinners for fussy eaters guide', () => {
  it('renders the approved planning estimate, flexible finishes and safety guidance', () => {
    const html = renderPublicGuideInitialHtml(FAMILY_FUSSY_EATERS_GUIDE_RECORD);

    expect(FAMILY_FUSSY_EATERS_GUIDE_RECORD.path).toBe(FAMILY_FUSSY_EATERS_GUIDE_PATH);
    expect(html).toContain(`<h1>${FAMILY_FUSSY_EATERS_GUIDE.title}</h1>`);
    expect(html).toContain('This is a planning example rather than a tested recipe.');
    expect(html).toContain('Keep only the portions planned for the next 48 hours in the fridge; freeze the rest.');
    expect(html).toContain('one base, flexible finishes');
    expect(html).toContain('Food Standards Agency');
    expect(html).toContain('Find recipes');
    FAMILY_FUSSY_EATERS_GUIDE.sources.forEach(source => expect(html).toContain(`href="${source.url}"`));
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const graph = getPublicGuideJsonLd(FAMILY_FUSSY_EATERS_GUIDE_RECORD)['@graph'];

    expect(graph.map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(FAMILY_FUSSY_EATERS_GUIDE_RECORD.faqs).toHaveLength(4);
  });
});
