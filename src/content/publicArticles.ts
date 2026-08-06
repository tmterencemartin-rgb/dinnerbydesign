import { BATCH_COOKING_GUIDE, BATCH_COOKING_GUIDE_PATH, COOKING_FOR_ONE_GUIDE, COOKING_FOR_ONE_PATH, FRESH_OR_FROZEN_GUIDE, FRESH_OR_FROZEN_GUIDE_PATH, MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE, MEDITERRANEAN_AFFORDABLE_COOKING_PATH, OFFAL_BUDGET_GUIDE, OFFAL_BUDGET_GUIDE_PATH, PORTION_PLANNING_GUIDE, PORTION_PLANNING_GUIDE_PATH, SUMMER_STEWS_GUIDE, SUMMER_STEWS_GUIDE_PATH, UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';
import { FAMILY_DINNERS_FOR_FOUR, FAMILY_DINNERS_FOR_FOUR_PATH } from './familyDinnersForFourPlan';
import { GROCERY_COST_OPTIONS_GUIDE, GROCERY_COST_OPTIONS_GUIDE_PATH } from './groceryCostOptionsGuide';
import { GROCERY_COST_PREDICTION_GUIDE, GROCERY_COST_PREDICTION_GUIDE_PATH } from './groceryCostPredictionGuide';
import { CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH } from './cheaperMeatCutsGuide';
import { SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH } from './sharedIngredientsGuide';
import { FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH } from './fiveADayGuide';
import { HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH } from './homeCookedReadyMadeGuide';
import { LOW_COST_DINNERS_GUIDE, LOW_COST_DINNERS_GUIDE_PATH } from './lowCostDinnersGuide';
import { PULSES_BUDGET_GUIDE, PULSES_BUDGET_GUIDE_PATH } from './pulsesBudgetGuide';
import { TRAYBAKE_GUIDE, TRAYBAKE_GUIDE_PATH } from './traybakeGuide';
import { SAUSAGE_WAYS_GUIDE, SAUSAGE_WAYS_GUIDE_PATH } from './sausageWaysGuide';
import { MINCE_BUDGET_DINNERS_GUIDE, MINCE_BUDGET_DINNERS_GUIDE_PATH } from './minceBudgetDinnersGuide';
import { LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE, LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH } from './leftoverRoastChickenBudgetDinnersGuide';
import { CHICKEN_THIGH_COST_GUIDE, CHICKEN_THIGH_COST_GUIDE_PATH } from './chickenThighCostGuide';
import { FIVE_STAPLES_GUIDE, FIVE_STAPLES_GUIDE_PATH } from './fiveStaplesGuide';
import { CONVENIENCE_FISH_GUIDE, CONVENIENCE_FISH_GUIDE_PATH } from './convenienceFishGuide';
import { TINNED_FISH_GUIDE, TINNED_FISH_GUIDE_PATH } from './tinnedFishGuide';
import { NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE, NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH } from './nineBudgetDinnersThreeCuisinesGuide';
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
    title: TINNED_FISH_GUIDE.title,
    path: TINNED_FISH_GUIDE_PATH,
    category: 'Practical cooking guide',
    pageFamily: TINNED_FISH_GUIDE.pageFamily,
    primarySearchIntent: TINNED_FISH_GUIDE.primarySearchIntent,
    indexingStatus: TINNED_FISH_GUIDE.indexingStatus,
    publishedAt: TINNED_FISH_GUIDE.publishedAt,
    reviewedAt: TINNED_FISH_GUIDE.reviewedAt,
    contentReviewedAt: TINNED_FISH_GUIDE.contentReviewedAt,
    internalLinks: [...TINNED_FISH_GUIDE.internalLinks],
    disclosures: [...TINNED_FISH_GUIDE.disclosures],
    status: 'published',
  },
  {
    title: CONVENIENCE_FISH_GUIDE.title,
    path: CONVENIENCE_FISH_GUIDE_PATH,
    category: 'Practical cooking guide',
    pageFamily: CONVENIENCE_FISH_GUIDE.pageFamily,
    primarySearchIntent: CONVENIENCE_FISH_GUIDE.primarySearchIntent,
    indexingStatus: CONVENIENCE_FISH_GUIDE.indexingStatus,
    publishedAt: CONVENIENCE_FISH_GUIDE.publishedAt,
    reviewedAt: CONVENIENCE_FISH_GUIDE.reviewedAt,
    contentReviewedAt: CONVENIENCE_FISH_GUIDE.contentReviewedAt,
    internalLinks: [...CONVENIENCE_FISH_GUIDE.internalLinks],
    disclosures: [...CONVENIENCE_FISH_GUIDE.disclosures],
    status: 'published',
  },
  {
    title: FIVE_STAPLES_GUIDE.title,
    path: FIVE_STAPLES_GUIDE_PATH,
    category: 'Practical cooking guide',
    pageFamily: FIVE_STAPLES_GUIDE.pageFamily,
    primarySearchIntent: FIVE_STAPLES_GUIDE.primarySearchIntent,
    indexingStatus: FIVE_STAPLES_GUIDE.indexingStatus,
    publishedAt: FIVE_STAPLES_GUIDE.publishedAt,
    reviewedAt: FIVE_STAPLES_GUIDE.reviewedAt,
    contentReviewedAt: FIVE_STAPLES_GUIDE.contentReviewedAt,
    internalLinks: [...FIVE_STAPLES_GUIDE.internalLinks],
    disclosures: [...FIVE_STAPLES_GUIDE.disclosures],
    status: 'published',
  },
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
    title: SAUSAGE_WAYS_GUIDE.title, path: SAUSAGE_WAYS_GUIDE_PATH, category: 'Practical cooking guide',
    pageFamily: SAUSAGE_WAYS_GUIDE.pageFamily, primarySearchIntent: SAUSAGE_WAYS_GUIDE.primarySearchIntent,
    indexingStatus: SAUSAGE_WAYS_GUIDE.indexingStatus, publishedAt: SAUSAGE_WAYS_GUIDE.publishedAt,
    reviewedAt: SAUSAGE_WAYS_GUIDE.reviewedAt, contentReviewedAt: SAUSAGE_WAYS_GUIDE.contentReviewedAt,
    internalLinks: SAUSAGE_WAYS_GUIDE.internalLinks, disclosures: SAUSAGE_WAYS_GUIDE.disclosures, status: 'published',
  },
  {
    title: MINCE_BUDGET_DINNERS_GUIDE.title, path: MINCE_BUDGET_DINNERS_GUIDE_PATH, category: 'Practical cooking guide',
    pageFamily: MINCE_BUDGET_DINNERS_GUIDE.pageFamily, primarySearchIntent: MINCE_BUDGET_DINNERS_GUIDE.primarySearchIntent,
    indexingStatus: MINCE_BUDGET_DINNERS_GUIDE.indexingStatus, publishedAt: MINCE_BUDGET_DINNERS_GUIDE.publishedAt,
    reviewedAt: MINCE_BUDGET_DINNERS_GUIDE.reviewedAt, contentReviewedAt: MINCE_BUDGET_DINNERS_GUIDE.contentReviewedAt,
    internalLinks: MINCE_BUDGET_DINNERS_GUIDE.internalLinks, disclosures: MINCE_BUDGET_DINNERS_GUIDE.disclosures, status: 'published',
  },
  {
    title: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.title, path: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH, category: 'Practical cooking guide',
    pageFamily: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.pageFamily, primarySearchIntent: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.primarySearchIntent,
    indexingStatus: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.indexingStatus, publishedAt: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.publishedAt,
    reviewedAt: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.reviewedAt, contentReviewedAt: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.contentReviewedAt,
    internalLinks: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.internalLinks, disclosures: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.disclosures, status: 'published',
  },
  {
    title: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.title, path: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH, category: 'Practical cooking guide',
    pageFamily: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.pageFamily, primarySearchIntent: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.primarySearchIntent,
    indexingStatus: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.indexingStatus, publishedAt: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.publishedAt,
    reviewedAt: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.reviewedAt, contentReviewedAt: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.contentReviewedAt,
    internalLinks: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.internalLinks, disclosures: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.disclosures, status: 'published',
  },
  {
    title: TRAYBAKE_GUIDE.title, path: TRAYBAKE_GUIDE_PATH, category: 'Practical cooking guide',
    pageFamily: TRAYBAKE_GUIDE.pageFamily, primarySearchIntent: TRAYBAKE_GUIDE.primarySearchIntent,
    indexingStatus: TRAYBAKE_GUIDE.indexingStatus, publishedAt: TRAYBAKE_GUIDE.publishedAt,
    reviewedAt: TRAYBAKE_GUIDE.reviewedAt, contentReviewedAt: TRAYBAKE_GUIDE.contentReviewedAt,
    internalLinks: TRAYBAKE_GUIDE.internalLinks, disclosures: TRAYBAKE_GUIDE.disclosures, status: 'published',
  },
  {
    title: PULSES_BUDGET_GUIDE.title, path: PULSES_BUDGET_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: PULSES_BUDGET_GUIDE.pageFamily, primarySearchIntent: PULSES_BUDGET_GUIDE.primarySearchIntent,
    indexingStatus: PULSES_BUDGET_GUIDE.indexingStatus, publishedAt: PULSES_BUDGET_GUIDE.publishedAt,
    reviewedAt: PULSES_BUDGET_GUIDE.reviewedAt, contentReviewedAt: PULSES_BUDGET_GUIDE.contentReviewedAt,
    internalLinks: PULSES_BUDGET_GUIDE.internalLinks, disclosures: PULSES_BUDGET_GUIDE.disclosures, status: 'published',
  },
  {
    title: HOME_COOKED_READY_MADE_GUIDE.title, path: HOME_COOKED_READY_MADE_GUIDE_PATH, category: 'Cooking and nutrition guide',
    pageFamily: HOME_COOKED_READY_MADE_GUIDE.pageFamily, primarySearchIntent: HOME_COOKED_READY_MADE_GUIDE.primarySearchIntent,
    indexingStatus: HOME_COOKED_READY_MADE_GUIDE.indexingStatus, publishedAt: HOME_COOKED_READY_MADE_GUIDE.publishedAt,
    reviewedAt: HOME_COOKED_READY_MADE_GUIDE.reviewedAt, contentReviewedAt: HOME_COOKED_READY_MADE_GUIDE.contentReviewedAt,
    internalLinks: HOME_COOKED_READY_MADE_GUIDE.internalLinks, disclosures: HOME_COOKED_READY_MADE_GUIDE.disclosures, status: 'published',
  },
  {
    title: LOW_COST_DINNERS_GUIDE.title, path: LOW_COST_DINNERS_GUIDE_PATH, category: 'Food cost guide',
    pageFamily: LOW_COST_DINNERS_GUIDE.pageFamily, primarySearchIntent: LOW_COST_DINNERS_GUIDE.primarySearchIntent,
    indexingStatus: LOW_COST_DINNERS_GUIDE.indexingStatus, publishedAt: LOW_COST_DINNERS_GUIDE.publishedAt,
    reviewedAt: LOW_COST_DINNERS_GUIDE.reviewedAt, contentReviewedAt: LOW_COST_DINNERS_GUIDE.contentReviewedAt,
    internalLinks: LOW_COST_DINNERS_GUIDE.internalLinks, disclosures: LOW_COST_DINNERS_GUIDE.disclosures, status: 'published',
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
