import { UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';

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
  status: 'published' | 'draft' | 'retired';
}

export const PUBLIC_ARTICLES: PublicArticleLink[] = [
  {
    title: UK_FOOD_COSTS_2026.title,
    path: UK_FOOD_COSTS_2026_PATH,
    category: 'Food cost guide',
    pageFamily: UK_FOOD_COSTS_2026.pageFamily,
    primarySearchIntent: UK_FOOD_COSTS_2026.primarySearchIntent,
    indexingStatus: UK_FOOD_COSTS_2026.indexingStatus,
    publishedAt: UK_FOOD_COSTS_2026.publishedAt,
    reviewedAt: UK_FOOD_COSTS_2026.reviewedAt,
    contentReviewedAt: UK_FOOD_COSTS_2026.contentReviewedAt,
    internalLinks: UK_FOOD_COSTS_2026.internalLinks,
    status: 'published',
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
    status: FIVE_DINNERS_FOR_TWO_UNDER_40.status,
  },
];

export const PUBLISHED_ARTICLES = PUBLIC_ARTICLES.filter(article => article.status === 'published');

export const PUBLIC_LIBRARY_LAUNCH_THRESHOLD = 12;
export const PUBLIC_LIBRARY_PATH: string | null = null;

export function isUnknownPublicArticlePath(pathName: string) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;
  const belongsToPublicFamily = normalisedPath.startsWith('/dinner-plans/') || normalisedPath.startsWith('/food-costs/');
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some(article => article.path === normalisedPath && article.status === 'published');
}
