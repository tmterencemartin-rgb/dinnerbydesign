import { UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';
import { FAMILY_DINNERS_FOR_FOUR, FAMILY_DINNERS_FOR_FOUR_PATH } from './familyDinnersForFourPlan';
import { CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH } from './cheaperMeatCutsGuide';
import { SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH } from './sharedIngredientsGuide';
import { FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH } from './fiveADayGuide';
import { HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH } from './homeCookedReadyMadeGuide';
import { CHICKEN_THIGH_COST_GUIDE, CHICKEN_THIGH_COST_GUIDE_PATH } from './chickenThighCostGuide';
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
    title: CHICKEN_THIGH_COST_GUIDE.title,
    path: CHICKEN_THIGH_COST_GUIDE_PATH,
    category: 'Recipe cost comparison',
    pageFamily: CHICKEN_THIGH_COST_GUIDE.pageFamily,
    primarySearchIntent: CHICKEN_THIGH_COST_GUIDE.primarySearchIntent,
    indexingStatus: CHICKEN_THIGH_COST_GUIDE.indexingStatus,
    publishedAt: CHICKEN_THIGH_COST_GUIDE.publishedAt,
    reviewedAt: CHICKEN_THIGH_COST_GUIDE.reviewedAt,
    contentReviewedAt: CHICKEN_THIGH_COST_GUIDE.contentReviewedAt,
    internalLinks: [...CHICKEN_THIGH_COST_GUIDE.internalLinks],
    disclosures: [...CHICKEN_THIGH_COST_GUIDE.disclosures],
    status: CHICKEN_THIGH_COST_GUIDE.status,
  },
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
    title: HOME_COOKED_READY_MADE_GUIDE.title, path: HOME_COOKED_READY_MADE_GUIDE_PATH, category: 'Cooking and nutrition guide',
    pageFamily: HOME_COOKED_READY_MADE_GUIDE.pageFamily, primarySearchIntent: HOME_COOKED_READY_MADE_GUIDE.primarySearchIntent,
    indexingStatus: HOME_COOKED_READY_MADE_GUIDE.indexingStatus, publishedAt: HOME_COOKED_READY_MADE_GUIDE.publishedAt,
    reviewedAt: HOME_COOKED_READY_MADE_GUIDE.reviewedAt, contentReviewedAt: HOME_COOKED_READY_MADE_GUIDE.contentReviewedAt,
    internalLinks: HOME_COOKED_READY_MADE_GUIDE.internalLinks, disclosures: HOME_COOKED_READY_MADE_GUIDE.disclosures, status: 'published',
  },
  {
    title: FIVE_A_DAY_GUIDE.title, path: FIVE_A_DAY_GUIDE_PATH, category: 'Nutrition guide',
    pageFamily: FIVE_A_DAY_GUIDE.pageFamily, primarySearchIntent: FIVE_A_DAY_GUIDE.primarySearchIntent,
    indexingStatus: FIVE_A_DAY_GUIDE.indexingStatus, publishedAt: FIVE_A_DAY_GUIDE.publishedAt,
    reviewedAt: FIVE_A_DAY_GUIDE.reviewedAt, contentReviewedAt: FIVE_A_DAY_GUIDE.contentReviewedAt,
    internalLinks: FIVE_A_DAY_GUIDE.internalLinks, disclosures: FIVE_A_DAY_GUIDE.disclosures, status: 'published',
  },
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
  const belongsToPublicFamily = normalisedPath.startsWith('/dinner-plans/') || normalisedPath.startsWith('/recipes/') || normalisedPath.startsWith('/food-costs/') || normalisedPath.startsWith('/guides/');
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some(article => article.path === normalisedPath && article.status === 'published');
}
