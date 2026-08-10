import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';
import { FAMILY_DINNERS_FOR_FOUR, FAMILY_DINNERS_FOR_FOUR_PATH } from './familyDinnersForFourPlan';
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
  {
    title: FAMILY_DINNERS_FOR_FOUR.title,
    path: FAMILY_DINNERS_FOR_FOUR_PATH,
    category: 'Dinner plan',
    pageFamily: FAMILY_DINNERS_FOR_FOUR.pageFamily,
    primarySearchIntent: FAMILY_DINNERS_FOR_FOUR.primarySearchIntent,
    indexingStatus: FAMILY_DINNERS_FOR_FOUR.indexingStatus,
    publishedAt: FAMILY_DINNERS_FOR_FOUR.publishedAt,
    reviewedAt: FAMILY_DINNERS_FOR_FOUR.reviewedAt,
    contentReviewedAt: FAMILY_DINNERS_FOR_FOUR.contentReviewedAt,
    internalLinks: [...FAMILY_DINNERS_FOR_FOUR.internalLinks],
    disclosures: [...FAMILY_DINNERS_FOR_FOUR.disclosures],
    status: FAMILY_DINNERS_FOR_FOUR.status,
  },
  {
    title: FIVE_DINNERS_FOR_TWO_UNDER_40.title,
    path: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
    category: 'Dinner plan',
    pageFamily: FIVE_DINNERS_FOR_TWO_UNDER_40.pageFamily,
    primarySearchIntent: FIVE_DINNERS_FOR_TWO_UNDER_40.primarySearchIntent,
    indexingStatus: FIVE_DINNERS_FOR_TWO_UNDER_40.indexingStatus,
    publishedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.publishedAt,
    reviewedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.reviewedAt,
    contentReviewedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.contentReviewedAt,
    internalLinks: FIVE_DINNERS_FOR_TWO_UNDER_40.internalLinks,
    disclosures: FIVE_DINNERS_FOR_TWO_UNDER_40.disclosures,
    status: FIVE_DINNERS_FOR_TWO_UNDER_40.status,
  },
];

export const PUBLISHED_ARTICLES = PUBLIC_ARTICLES.filter(article => article.status === 'published');

export const PUBLIC_LIBRARY_LAUNCH_THRESHOLD = 12;
export const PUBLIC_LIBRARY_PATH: string | null = '/guides';

export function isUnknownPublicArticlePath(pathName: string) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;
  const belongsToPublicFamily = normalisedPath.startsWith('/dinner-plans/') || normalisedPath.startsWith('/recipes/') || normalisedPath.startsWith('/food-costs/') || normalisedPath.startsWith('/guides/');
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some(article => article.path === normalisedPath && article.status === 'published');
}
