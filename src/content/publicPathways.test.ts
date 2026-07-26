import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PUBLISHED_ARTICLES } from './publicArticles';
import {
  PUBLIC_PATHWAYS,
  getPublicPathwayForArticle,
  getPublicPathwayJsonLd,
  renderPublicPathwayInitialHtml,
} from './publicPathways';

describe('public pathways', () => {
  it('gives every published article exactly one public home', () => {
    expect(PUBLIC_PATHWAYS).toHaveLength(3);
    const assignedPaths = PUBLIC_PATHWAYS.flatMap(pathway => pathway.articlePaths);
    expect(assignedPaths).toHaveLength(PUBLISHED_ARTICLES.length);
    expect(new Set(assignedPaths).size).toBe(PUBLISHED_ARTICLES.length);
    expect(new Set(assignedPaths)).toEqual(new Set(PUBLISHED_ARTICLES.map(article => article.path)));
    PUBLISHED_ARTICLES.forEach(article => expect(getPublicPathwayForArticle(article.path)).toBeTruthy());
  });

  it('renders crawler-visible article and cross-pathway links', () => {
    PUBLIC_PATHWAYS.forEach(pathway => {
      const html = renderPublicPathwayInitialHtml(pathway);
      expect(html).toContain(`<h1>${pathway.title}</h1>`);
      pathway.articles.forEach(article => expect(html).toContain(`href="${article.path}"`));
      PUBLIC_PATHWAYS.filter(item => item.id !== pathway.id).forEach(item => {
        expect(html).toContain(`href="${item.path}"`);
      });
    });
  });

  it('provides collection, item-list and breadcrumb structured data for each hub', () => {
    PUBLIC_PATHWAYS.forEach(pathway => {
      const jsonLd = getPublicPathwayJsonLd(pathway);
      expect(jsonLd['@graph'].map(item => item['@type'])).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);
      const itemList = jsonLd['@graph'].find(item => item['@type'] === 'ItemList');
      expect(itemList?.itemListElement).toHaveLength(pathway.articles.length);
    });
  });

  it('includes every hub in the canonical sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    PUBLIC_PATHWAYS.forEach(pathway => {
      expect(sitemap).toContain(`<loc>https://dinnerbydesign.app${pathway.path}</loc>`);
    });
  });
});
