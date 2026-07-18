import { describe, expect, it } from 'vitest';
import { PUBLISHED_ARTICLES, PUBLIC_ARTICLES } from './publicArticles';

describe('public article registry', () => {
  it('provides unique internal links for every published article', () => {
    expect(PUBLISHED_ARTICLES.length).toBeGreaterThan(0);
    expect(new Set(PUBLISHED_ARTICLES.map(article => article.path)).size).toBe(PUBLISHED_ARTICLES.length);
    expect(PUBLISHED_ARTICLES.every(article => article.path.startsWith('/'))).toBe(true);
    expect(PUBLISHED_ARTICLES.every(article => article.title && article.reviewedAt)).toBe(true);
  });

  it('excludes non-published entries from the admin list', () => {
    expect(PUBLISHED_ARTICLES.every(article => article.status === 'published')).toBe(true);
    expect(PUBLISHED_ARTICLES.length).toBeLessThanOrEqual(PUBLIC_ARTICLES.length);
  });
});
