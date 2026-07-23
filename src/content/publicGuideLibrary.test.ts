import { describe, expect, it } from 'vitest';
import { PUBLISHED_ARTICLES, PUBLIC_LIBRARY_PATH } from './publicArticles';
import { PUBLIC_GUIDE_LIBRARY, getPublicGuideLibraryJsonLd, renderPublicGuideLibraryInitialHtml } from './publicGuideLibrary';

describe('public guide library', () => {
  it('launches at the agreed route with every published article', () => {
    expect(PUBLIC_LIBRARY_PATH).toBe('/guides');
    expect(PUBLISHED_ARTICLES).toHaveLength(16);
    const html = renderPublicGuideLibraryInitialHtml();
    expect(html).toContain(`<h1>${PUBLIC_GUIDE_LIBRARY.title}</h1>`);
    PUBLISHED_ARTICLES.forEach(article => expect(html).toContain(`href="${article.path}"`));
    expect(html).toContain('Plan my week');
  });

  it('provides collection, item-list and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideLibraryJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);
    const itemList = jsonLd['@graph'].find(item => item['@type'] === 'ItemList');
    expect(itemList?.itemListElement).toHaveLength(PUBLISHED_ARTICLES.length);
  });
});
