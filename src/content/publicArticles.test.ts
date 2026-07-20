import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PUBLIC_LIBRARY_LAUNCH_THRESHOLD, PUBLIC_LIBRARY_PATH, PUBLISHED_ARTICLES, PUBLIC_ARTICLES, isUnknownPublicArticlePath } from './publicArticles';

describe('public article registry', () => {
  it('provides unique internal links for every published article', () => {
    expect(PUBLISHED_ARTICLES.length).toBeGreaterThan(0);
    expect(new Set(PUBLISHED_ARTICLES.map(article => article.path)).size).toBe(PUBLISHED_ARTICLES.length);
    expect(PUBLISHED_ARTICLES.every(article => article.path.startsWith('/'))).toBe(true);
    expect(PUBLISHED_ARTICLES.every(article => article.title && article.reviewedAt)).toBe(true);
    expect(PUBLISHED_ARTICLES.every(article => article.primarySearchIntent && article.publishedAt && article.contentReviewedAt)).toBe(true);
    expect(PUBLISHED_ARTICLES.every(article => article.indexingStatus === 'index' && article.internalLinks.length > 0)).toBe(true);
    expect(PUBLISHED_ARTICLES.every(article => article.disclosures.length > 0)).toBe(true);
  });

  it('excludes non-published entries from the admin list', () => {
    expect(PUBLISHED_ARTICLES.every(article => article.status === 'published')).toBe(true);
    expect(PUBLISHED_ARTICLES.length).toBeLessThanOrEqual(PUBLIC_ARTICLES.length);
  });

  it('identifies unpublished paths in protected public page families', () => {
    expect(isUnknownPublicArticlePath('/dinner-plans/not-a-real-plan')).toBe(true);
    expect(isUnknownPublicArticlePath('/food-costs/not-a-real-guide')).toBe(true);
    expect(isUnknownPublicArticlePath('/dinner-plans/5-dinners-for-2-under-40')).toBe(false);
    expect(isUnknownPublicArticlePath('/dinner-plans/5-dinners-for-2-under-40/')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/cooking-for-four-with-lower-cost-cuts')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/low-cost-cooking-techniques')).toBe(false);
    expect(isUnknownPublicArticlePath('/pricing-methodology')).toBe(false);
  });

  it('includes every published article in the canonical sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    PUBLISHED_ARTICLES.forEach(article => expect(sitemap).toContain(`<loc>https://dinnerbydesign.app${article.path}</loc>`));
  });

  it('requires the public library when the twelfth page is published', () => {
    if (PUBLISHED_ARTICLES.length >= PUBLIC_LIBRARY_LAUNCH_THRESHOLD) {
      expect(PUBLIC_LIBRARY_PATH, 'Create /guides and add its restrained footer link before publishing page 12.').toBeTruthy();
    } else {
      expect(PUBLIC_LIBRARY_PATH).toBeNull();
    }
  });
});
