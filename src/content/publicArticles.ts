import { COOKING_FOR_ONE_GUIDE, COOKING_FOR_ONE_PATH, LOWER_COST_CUTS_GUIDE, LOWER_COST_CUTS_PATH, LOW_COST_COOKING_TECHNIQUES_GUIDE, LOW_COST_COOKING_TECHNIQUES_PATH, OFFAL_BUDGET_GUIDE, OFFAL_BUDGET_GUIDE_PATH, PORTION_PLANNING_GUIDE, PORTION_PLANNING_GUIDE_PATH, UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';
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

export const PUBLIC_ARTICLES: PublicArticleLink[] = [
  {
    title: PORTION_PLANNING_GUIDE.title, path: PORTION_PLANNING_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: PORTION_PLANNING_GUIDE.pageFamily, primarySearchIntent: PORTION_PLANNING_GUIDE.primarySearchIntent,
    indexingStatus: PORTION_PLANNING_GUIDE.indexingStatus, publishedAt: PORTION_PLANNING_GUIDE.publishedAt,
    reviewedAt: PORTION_PLANNING_GUIDE.reviewedAt, contentReviewedAt: PORTION_PLANNING_GUIDE.contentReviewedAt,
    internalLinks: PORTION_PLANNING_GUIDE.internalLinks, disclosures: PORTION_PLANNING_GUIDE.disclosures, status: 'published',
  },
  {
    title: OFFAL_BUDGET_GUIDE.title,
    path: OFFAL_BUDGET_GUIDE_PATH,
    category: 'Food cost guide',
    pageFamily: OFFAL_BUDGET_GUIDE.pageFamily,
    primarySearchIntent: OFFAL_BUDGET_GUIDE.primarySearchIntent,
    indexingStatus: OFFAL_BUDGET_GUIDE.indexingStatus,
    publishedAt: OFFAL_BUDGET_GUIDE.publishedAt,
    reviewedAt: OFFAL_BUDGET_GUIDE.reviewedAt,
    contentReviewedAt: OFFAL_BUDGET_GUIDE.contentReviewedAt,
    internalLinks: OFFAL_BUDGET_GUIDE.internalLinks,
    disclosures: OFFAL_BUDGET_GUIDE.disclosures,
    status: 'published',
  },
  {
    title: COOKING_FOR_ONE_GUIDE.title,
    path: COOKING_FOR_ONE_PATH,
    category: 'Food cost guide',
    pageFamily: COOKING_FOR_ONE_GUIDE.pageFamily,
    primarySearchIntent: COOKING_FOR_ONE_GUIDE.primarySearchIntent,
    indexingStatus: COOKING_FOR_ONE_GUIDE.indexingStatus,
    publishedAt: COOKING_FOR_ONE_GUIDE.publishedAt,
    reviewedAt: COOKING_FOR_ONE_GUIDE.reviewedAt,
    contentReviewedAt: COOKING_FOR_ONE_GUIDE.contentReviewedAt,
    internalLinks: COOKING_FOR_ONE_GUIDE.internalLinks,
    disclosures: COOKING_FOR_ONE_GUIDE.disclosures,
    status: 'published',
  },
  {
    title: LOW_COST_COOKING_TECHNIQUES_GUIDE.title,
    path: LOW_COST_COOKING_TECHNIQUES_PATH,
    category: 'Food cost guide',
    pageFamily: LOW_COST_COOKING_TECHNIQUES_GUIDE.pageFamily,
    primarySearchIntent: LOW_COST_COOKING_TECHNIQUES_GUIDE.primarySearchIntent,
    indexingStatus: LOW_COST_COOKING_TECHNIQUES_GUIDE.indexingStatus,
    publishedAt: LOW_COST_COOKING_TECHNIQUES_GUIDE.publishedAt,
    reviewedAt: LOW_COST_COOKING_TECHNIQUES_GUIDE.reviewedAt,
    contentReviewedAt: LOW_COST_COOKING_TECHNIQUES_GUIDE.contentReviewedAt,
    internalLinks: LOW_COST_COOKING_TECHNIQUES_GUIDE.internalLinks,
    disclosures: LOW_COST_COOKING_TECHNIQUES_GUIDE.disclosures,
    status: 'published',
  },
  {
    title: LOWER_COST_CUTS_GUIDE.title,
    path: LOWER_COST_CUTS_PATH,
    category: 'Food cost guide',
    pageFamily: LOWER_COST_CUTS_GUIDE.pageFamily,
    primarySearchIntent: LOWER_COST_CUTS_GUIDE.primarySearchIntent,
    indexingStatus: LOWER_COST_CUTS_GUIDE.indexingStatus,
    publishedAt: LOWER_COST_CUTS_GUIDE.publishedAt,
    reviewedAt: LOWER_COST_CUTS_GUIDE.reviewedAt,
    contentReviewedAt: LOWER_COST_CUTS_GUIDE.contentReviewedAt,
    internalLinks: LOWER_COST_CUTS_GUIDE.internalLinks,
    disclosures: LOWER_COST_CUTS_GUIDE.disclosures,
    status: 'published',
  },
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
    disclosures: UK_FOOD_COSTS_2026.disclosures,
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
    disclosures: FIVE_DINNERS_FOR_TWO_UNDER_40.disclosures,
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
