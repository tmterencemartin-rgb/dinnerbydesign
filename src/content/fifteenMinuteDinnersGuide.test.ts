import { describe, expect, it } from 'vitest';
import {
  FIFTEEN_MINUTE_DINNERS_GUIDE_PATH,
  FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD,
} from './fifteenMinuteDinnersGuide';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from './publicGuideModel';

describe('fifteen-minute dinners guide', () => {
  it('uses the approved timing definition and keeps the pea condition visible', () => {
    const html = renderPublicGuideInitialHtml(FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD);
    expect(FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD.path).toBe(FIFTEEN_MINUTE_DINNERS_GUIDE_PATH);
    expect(html).toContain('total preparation and cooking time combined');
    expect(html).toContain('defrost them ahead of cooking');
    expect(html).toContain('Peas are an exception here');
    expect(html).toContain('https://www.olivemagazine.com/recipes/quick-and-easy/tortellini-in-a-pea-broth/');
  });

  it('publishes article, FAQ and breadcrumb structured data', () => {
    const graph = getPublicGuideJsonLd(FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD)['@graph'];
    expect(graph.map(item => item['@type'])).toEqual(['Article', 'FAQPage', 'BreadcrumbList']);
    expect(FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD.faqs).toHaveLength(6);
  });
});
