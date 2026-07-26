import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PUBLIC_LIBRARY_LAUNCH_THRESHOLD, PUBLIC_LIBRARY_PATH, PUBLISHED_ARTICLES, PUBLIC_ARTICLES, isUnknownPublicArticlePath } from './publicArticles';
import { PUBLIC_PAGE_REDIRECTS, getPublicPageRedirect } from './publicRedirects';

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
    expect(isUnknownPublicArticlePath('/guides/not-a-real-guide')).toBe(true);
    expect(isUnknownPublicArticlePath('/recipes/not-a-real-recipe')).toBe(true);
    expect(isUnknownPublicArticlePath('/dinner-plans/5-dinners-for-2-under-40')).toBe(false);
    expect(isUnknownPublicArticlePath('/dinner-plans/5-dinners-for-2-under-40/')).toBe(false);
    expect(isUnknownPublicArticlePath('/dinner-plans/5-affordable-family-dinners-for-four')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/cooking-for-four-with-lower-cost-cuts')).toBe(true);
    expect(isUnknownPublicArticlePath('/food-costs/cooking-with-cheaper-cuts-of-meat')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/five-dinners-same-ingredients')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/how-to-use-complete-packs')).toBe(true);
    expect(isUnknownPublicArticlePath('/food-costs/low-cost-cooking-techniques')).toBe(true);
    expect(isUnknownPublicArticlePath('/food-costs/cheap-finishing-touches')).toBe(true);
    expect(isUnknownPublicArticlePath('/food-costs/make-low-cost-dinners-more-interesting')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/cooking-with-pulses-on-a-budget')).toBe(false);
    expect(isUnknownPublicArticlePath('/guides/how-to-build-a-traybake')).toBe(false);
    expect(isUnknownPublicArticlePath('/guides/9-ways-with-sausages')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/cooking-for-one-without-waste')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/summer-stews-seasonal-vegetables')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/fresh-or-frozen')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/batch-cooking-on-a-budget')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/ways-to-reduce-grocery-costs')).toBe(false);
    expect(isUnknownPublicArticlePath('/food-costs/why-grocery-costs-are-hard-to-predict')).toBe(false);
    expect(isUnknownPublicArticlePath('/guides/do-vegetables-in-dishes-count-towards-5-a-day')).toBe(false);
    expect(isUnknownPublicArticlePath('/guides/home-cooked-or-ready-made-dinners')).toBe(false);
    expect(isUnknownPublicArticlePath('/pricing-methodology')).toBe(false);
  });

  it('maps every retired overlapping page to its surviving canonical page', () => {
    expect(getPublicPageRedirect('/food-costs/cooking-for-four-with-lower-cost-cuts')).toBe('/food-costs/cooking-with-cheaper-cuts-of-meat');
    expect(getPublicPageRedirect('/food-costs/low-cost-cooking-techniques/')).toBe('/food-costs/ways-to-reduce-grocery-costs');
    expect(getPublicPageRedirect('/food-costs/how-to-use-complete-packs')).toBe('/food-costs/five-dinners-same-ingredients');
    expect(getPublicPageRedirect('/food-costs/cheap-finishing-touches')).toBe('/food-costs/make-low-cost-dinners-more-interesting');
    expect(getPublicPageRedirect('/food-costs/not-a-real-guide')).toBeNull();
    expect(Object.keys(PUBLIC_PAGE_REDIRECTS)).toHaveLength(4);
  });

  it('includes every published article in the canonical sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    PUBLISHED_ARTICLES.forEach(article => expect(sitemap).toContain(`<loc>https://dinnerbydesign.app${article.path}</loc>`));
    Object.keys(PUBLIC_PAGE_REDIRECTS).forEach(path => expect(sitemap).not.toContain(`<loc>https://dinnerbydesign.app${path}</loc>`));
  });

  it('requires the public library when the twelfth page is published', () => {
    if (PUBLISHED_ARTICLES.length >= PUBLIC_LIBRARY_LAUNCH_THRESHOLD) {
      expect(PUBLIC_LIBRARY_PATH, 'Create /guides and add its restrained footer link before publishing page 12.').toBeTruthy();
    } else {
      expect(PUBLIC_LIBRARY_PATH).toBeNull();
    }
  });

  it('includes the launched public library in the canonical sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    expect(PUBLIC_LIBRARY_PATH).toBe('/guides');
    expect(sitemap).toContain('<loc>https://dinnerbydesign.app/guides</loc>');
    expect(sitemap).toContain('<loc>https://dinnerbydesign.app/dinner-plans</loc>');
    expect(sitemap).toContain('<loc>https://dinnerbydesign.app/recipes</loc>');
    expect(sitemap).toContain('<loc>https://dinnerbydesign.app/food-costs</loc>');
  });
});
