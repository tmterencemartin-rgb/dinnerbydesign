import { describe, expect, it } from 'vitest';
import { PUBLISHED_ARTICLES, PUBLIC_LIBRARY_PATH } from './publicArticles';
import { PUBLIC_GUIDE_GROUPS, PUBLIC_GUIDE_LIBRARY, getPublicGuideLibraryJsonLd, renderPublicGuideLibraryInitialHtml } from './publicGuideLibrary';

describe('public guide library', () => {
  it('launches at the agreed route with every published article', () => {
    expect(PUBLIC_LIBRARY_PATH).toBe('/guides');
    expect(PUBLISHED_ARTICLES).toHaveLength(22);
    const html = renderPublicGuideLibraryInitialHtml();
    expect(html).toContain(`<h1>${PUBLIC_GUIDE_LIBRARY.title}</h1>`);
    PUBLISHED_ARTICLES.forEach(article => expect(html).toContain(`href="${article.path}"`));
    PUBLIC_GUIDE_GROUPS.forEach(group => {
      expect(html).toContain(`<h2 id="${group.id}">${group.title}</h2>`);
      expect(html).toContain(`href="#${group.id}"`);
    });
    expect(html).toContain('<h2>Browse by category</h2>');
    expect(html).toContain('<main id="guide-library-top">');
    expect(html.match(/href="#guide-library-top"/g)).toHaveLength(PUBLIC_GUIDE_GROUPS.length);
    expect(html).toContain('Plan my week');
  });

  it('groups every published guide exactly once by customer need', () => {
    const groupedPaths = PUBLIC_GUIDE_GROUPS.flatMap(group => group.articles.map(article => article.path));
    expect(groupedPaths).toHaveLength(PUBLISHED_ARTICLES.length);
    expect(new Set(groupedPaths)).toEqual(new Set(PUBLISHED_ARTICLES.map(article => article.path)));
  });

  it('provides collection, item-list and breadcrumb structured data', () => {
    const jsonLd = getPublicGuideLibraryJsonLd();
    const types = jsonLd['@graph'].map(item => item['@type']);
    expect(types).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);
    const itemList = jsonLd['@graph'].find(item => item['@type'] === 'ItemList');
    expect(itemList?.itemListElement).toHaveLength(PUBLISHED_ARTICLES.length);
  });
});
