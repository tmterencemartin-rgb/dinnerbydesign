import { BATCH_COOKING_GUIDE, BATCH_COOKING_GUIDE_PATH, COOKING_FOR_ONE_GUIDE, COOKING_FOR_ONE_PATH, FRESH_OR_FROZEN_GUIDE, FRESH_OR_FROZEN_GUIDE_PATH, LOWER_COST_CUTS_GUIDE, LOWER_COST_CUTS_PATH, LOW_COST_COOKING_TECHNIQUES_GUIDE, LOW_COST_COOKING_TECHNIQUES_PATH, MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE, MEDITERRANEAN_AFFORDABLE_COOKING_PATH, OFFAL_BUDGET_GUIDE, OFFAL_BUDGET_GUIDE_PATH, PORTION_PLANNING_GUIDE, PORTION_PLANNING_GUIDE_PATH, SUMMER_STEWS_GUIDE, SUMMER_STEWS_GUIDE_PATH, UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';
import { GROCERY_COST_OPTIONS_GUIDE, GROCERY_COST_OPTIONS_GUIDE_PATH } from './groceryCostOptionsGuide';
import { GROCERY_COST_PREDICTION_GUIDE, GROCERY_COST_PREDICTION_GUIDE_PATH } from './groceryCostPredictionGuide';
import { CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH } from './cheaperMeatCutsGuide';
import { SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH } from './sharedIngredientsGuide';
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
    title: SHARED_INGREDIENTS_GUIDE.title, path: SHARED_INGREDIENTS_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: SHARED_INGREDIENTS_GUIDE.pageFamily, primarySearchIntent: SHARED_INGREDIENTS_GUIDE.primarySearchIntent,
    indexingStatus: SHARED_INGREDIENTS_GUIDE.indexingStatus, publishedAt: SHARED_INGREDIENTS_GUIDE.publishedAt,
    reviewedAt: SHARED_INGREDIENTS_GUIDE.reviewedAt, contentReviewedAt: SHARED_INGREDIENTS_GUIDE.contentReviewedAt,
    internalLinks: SHARED_INGREDIENTS_GUIDE.internalLinks, disclosures: SHARED_INGREDIENTS_GUIDE.disclosures, status: 'published',
  },
  {
    title: CHEAPER_MEAT_CUTS_GUIDE.title, path: CHEAPER_MEAT_CUTS_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: CHEAPER_MEAT_CUTS_GUIDE.pageFamily, primarySearchIntent: CHEAPER_MEAT_CUTS_GUIDE.primarySearchIntent,
    indexingStatus: CHEAPER_MEAT_CUTS_GUIDE.indexingStatus, publishedAt: CHEAPER_MEAT_CUTS_GUIDE.publishedAt,
    reviewedAt: CHEAPER_MEAT_CUTS_GUIDE.reviewedAt, contentReviewedAt: CHEAPER_MEAT_CUTS_GUIDE.contentReviewedAt,
    internalLinks: CHEAPER_MEAT_CUTS_GUIDE.internalLinks, disclosures: CHEAPER_MEAT_CUTS_GUIDE.disclosures, status: 'published',
  },
  {
    title: GROCERY_COST_PREDICTION_GUIDE.title, path: GROCERY_COST_PREDICTION_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: GROCERY_COST_PREDICTION_GUIDE.pageFamily, primarySearchIntent: GROCERY_COST_PREDICTION_GUIDE.primarySearchIntent,
    indexingStatus: GROCERY_COST_PREDICTION_GUIDE.indexingStatus, publishedAt: GROCERY_COST_PREDICTION_GUIDE.publishedAt,
    reviewedAt: GROCERY_COST_PREDICTION_GUIDE.reviewedAt, contentReviewedAt: GROCERY_COST_PREDICTION_GUIDE.contentReviewedAt,
    internalLinks: GROCERY_COST_PREDICTION_GUIDE.internalLinks, disclosures: GROCERY_COST_PREDICTION_GUIDE.disclosures, status: 'published',
  },
  {
    title: GROCERY_COST_OPTIONS_GUIDE.title, path: GROCERY_COST_OPTIONS_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: GROCERY_COST_OPTIONS_GUIDE.pageFamily, primarySearchIntent: GROCERY_COST_OPTIONS_GUIDE.primarySearchIntent,
    indexingStatus: GROCERY_COST_OPTIONS_GUIDE.indexingStatus, publishedAt: GROCERY_COST_OPTIONS_GUIDE.publishedAt,
    reviewedAt: GROCERY_COST_OPTIONS_GUIDE.reviewedAt, contentReviewedAt: GROCERY_COST_OPTIONS_GUIDE.contentReviewedAt,
    internalLinks: GROCERY_COST_OPTIONS_GUIDE.internalLinks, disclosures: GROCERY_COST_OPTIONS_GUIDE.disclosures, status: 'published',
  },
  {
    title: BATCH_COOKING_GUIDE.title, path: BATCH_COOKING_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: BATCH_COOKING_GUIDE.pageFamily, primarySearchIntent: BATCH_COOKING_GUIDE.primarySearchIntent,
    indexingStatus: BATCH_COOKING_GUIDE.indexingStatus, publishedAt: BATCH_COOKING_GUIDE.publishedAt,
    reviewedAt: BATCH_COOKING_GUIDE.reviewedAt, contentReviewedAt: BATCH_COOKING_GUIDE.contentReviewedAt,
    internalLinks: BATCH_COOKING_GUIDE.internalLinks, disclosures: BATCH_COOKING_GUIDE.disclosures, status: 'published',
  },
  {
    title: FRESH_OR_FROZEN_GUIDE.title, path: FRESH_OR_FROZEN_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: FRESH_OR_FROZEN_GUIDE.pageFamily, primarySearchIntent: FRESH_OR_FROZEN_GUIDE.primarySearchIntent,
    indexingStatus: FRESH_OR_FROZEN_GUIDE.indexingStatus, publishedAt: FRESH_OR_FROZEN_GUIDE.publishedAt,
    reviewedAt: FRESH_OR_FROZEN_GUIDE.reviewedAt, contentReviewedAt: FRESH_OR_FROZEN_GUIDE.contentReviewedAt,
    internalLinks: FRESH_OR_FROZEN_GUIDE.internalLinks, disclosures: FRESH_OR_FROZEN_GUIDE.disclosures, status: 'published',
  },
  {
    title: SUMMER_STEWS_GUIDE.title, path: SUMMER_STEWS_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: SUMMER_STEWS_GUIDE.pageFamily, primarySearchIntent: SUMMER_STEWS_GUIDE.primarySearchIntent,
    indexingStatus: SUMMER_STEWS_GUIDE.indexingStatus, publishedAt: SUMMER_STEWS_GUIDE.publishedAt,
    reviewedAt: SUMMER_STEWS_GUIDE.reviewedAt, contentReviewedAt: SUMMER_STEWS_GUIDE.contentReviewedAt,
    internalLinks: SUMMER_STEWS_GUIDE.internalLinks, disclosures: SUMMER_STEWS_GUIDE.disclosures, status: 'published',
  },
  {
    title: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.title, path: MEDITERRANEAN_AFFORDABLE_COOKING_PATH, category: 'Food cost guide',
    pageFamily: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.pageFamily, primarySearchIntent: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.primarySearchIntent,
    indexingStatus: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.indexingStatus, publishedAt: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.publishedAt,
    reviewedAt: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.reviewedAt, contentReviewedAt: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.contentReviewedAt,
    internalLinks: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.internalLinks, disclosures: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.disclosures, status: 'published',
  },
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
export const PUBLIC_LIBRARY_PATH: string | null = '/guides';

export function isUnknownPublicArticlePath(pathName: string) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;
  const belongsToPublicFamily = normalisedPath.startsWith('/dinner-plans/') || normalisedPath.startsWith('/food-costs/');
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some(article => article.path === normalisedPath && article.status === 'published');
}
