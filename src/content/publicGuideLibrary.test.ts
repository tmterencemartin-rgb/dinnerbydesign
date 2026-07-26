import { describe, expect, it } from 'vitest';
import { PUBLIC_LIBRARY_PATH } from './publicArticles';
import { PUBLIC_GUIDE_LIBRARY, PUBLIC_GUIDE_PATHWAYS, getPublicGuideLibraryJsonLd, renderPublicGuideLibraryInitialHtml } from './publicGuideLibrary';

describe('public guide library', () => {
  it('acts as a signpost to the three public pathways', () => {
    expect(PUBLIC_LIBRARY_PATH).toBe('/guides');
    expect(PUBLIC_GUIDE_PATHWAYS).toHaveLength(3);
    const html = renderPublicGuideLibraryInitialHtml();
    expect(html).toContain(`<h1>${PUBLIC_GUIDE_LIBRARY.title}</h1>`);
    PUBLIC_GUIDE_PATHWAYS.forEach(pathway => {
      expect(html).toContain(`href="${pathway.path}"`);
      expect(html).toContain(pathway.title);
    });
    expect(html).toContain('Plan my week');
  });

  it('provides collection, pathway-list and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideLibraryJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);
    const itemList = jsonLd['@graph'].find(item => item['@type'] === 'ItemList');
    expect(itemList?.itemListElement).toHaveLength(3);
  });
});
