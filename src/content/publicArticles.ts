import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from './publicGuideRegistry';
import type { PublicGuideRecord } from './publicGuideModel';
import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';

export interface PublicArticleLink {
  title: string;
  path: string;
  category: string;
  pageFamily: string;
  primarySearchIntent: string;
  indexingStatus: 'index' | 'noindex';
  publishedAt: string;
  reviewedAt: string;
  contentReviewedAt: string;
  internalLinks: string[];
  disclosures: ProgrammaticDisclosureKey[];
  status: 'published' | 'draft' | 'retired';
}

const publicGuideRecordToArticle = (guide: PublicGuideRecord): PublicArticleLink => ({
  title: guide.title,
  path: guide.path,
  category: guide.label,
  pageFamily: guide.pageFamily,
  primarySearchIntent: guide.primarySearchIntent,
  indexingStatus: guide.indexingStatus,
  publishedAt: guide.publishedAt,
  reviewedAt: guide.reviewedAt,
  contentReviewedAt: guide.contentReviewedAt,
  internalLinks: [...guide.internalLinks],
  disclosures: [...guide.disclosures],
  status: 'published',
});

export const PUBLIC_ARTICLES: PublicArticleLink[] = [
  ...PUBLISHED_PUBLIC_GUIDE_RECORDS.map(publicGuideRecordToArticle),
];

export const PUBLISHED_ARTICLES = PUBLIC_ARTICLES.filter(article => article.status === 'published');

export const PUBLIC_LIBRARY_LAUNCH_THRESHOLD = 12;
export const PUBLIC_LIBRARY_PATH: string | null = '/guides';

export function isUnknownPublicArticlePath(pathName: string) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;
  const belongsToPublicFamily = normalisedPath.startsWith('/dinner-plans/') || normalisedPath.startsWith('/recipes/') || normalisedPath.startsWith('/food-costs/') || normalisedPath.startsWith('/guides/');
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some(article => article.path === normalisedPath && article.status === 'published');
}
