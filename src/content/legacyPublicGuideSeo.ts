import type { AppView } from '../types';
import type { SeoConfig } from '../hooks/useSeo';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd } from './seoMealPlans';
import { GROCERY_COST_OPTIONS_GUIDE, GROCERY_COST_OPTIONS_GUIDE_PATH, getGroceryCostOptionsGuideJsonLd } from './groceryCostOptionsGuide';
import { GROCERY_COST_PREDICTION_GUIDE, GROCERY_COST_PREDICTION_GUIDE_PATH, getGroceryCostPredictionGuideJsonLd } from './groceryCostPredictionGuide';
import { CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH, getCheaperMeatCutsGuideJsonLd } from './cheaperMeatCutsGuide';
import { SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH, getSharedIngredientsGuideJsonLd } from './sharedIngredientsGuide';
import { COMPLETE_PACKS_GUIDE, COMPLETE_PACKS_GUIDE_PATH, getCompletePacksGuideJsonLd } from './completePacksGuide';
import { PUBLIC_GUIDE_LIBRARY, getPublicGuideLibraryJsonLd } from './publicGuideLibrary';
import { PUBLIC_LIBRARY_PATH } from './publicArticles';
import { FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH, getFiveADayGuideJsonLd } from './fiveADayGuide';
import { HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH, getHomeCookedReadyMadeGuideJsonLd } from './homeCookedReadyMadeGuide';
import { CHEAP_FINISHING_TOUCHES_GUIDE, CHEAP_FINISHING_TOUCHES_GUIDE_PATH, getCheapFinishingTouchesGuideJsonLd } from './cheapFinishingTouchesGuide';
import { LOW_COST_DINNERS_GUIDE, LOW_COST_DINNERS_GUIDE_PATH, getLowCostDinnersGuideJsonLd } from './lowCostDinnersGuide';
import {
  BATCH_COOKING_GUIDE,
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  LOW_COST_COOKING_TECHNIQUES_GUIDE,
  LOW_COST_COOKING_TECHNIQUES_PATH,
  MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE,
  MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  OFFAL_BUDGET_GUIDE,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getCookingForOneJsonLd,
  getBatchCookingGuideJsonLd,
  getFreshOrFrozenGuideJsonLd,
  getLowerCostCutsJsonLd,
  getLowCostCookingTechniquesJsonLd,
  getMediterraneanAffordableCookingJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getSummerStewsGuideJsonLd,
  getUkFoodCosts2026JsonLd,
} from './seoFoodCostGuides';

const guideSeoConfig = (
  guide: { seoTitle: string; description: string },
  canonicalPath: string,
  jsonLd: object,
): SeoConfig => ({
  title: guide.seoTitle,
  description: guide.description,
  canonicalPath,
  jsonLd,
});

const LEGACY_PUBLIC_GUIDE_SEO_CONFIGS: Partial<Record<AppView, () => SeoConfig>> = {
  'meal-plan-five-for-two-under-40': () => ({
    title: FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle,
    description: 'Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.',
    canonicalPath: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
    jsonLd: getFiveDinnersForTwoJsonLd(),
  }),
  'food-costs-uk-2026': () => ({
    title: `${UK_FOOD_COSTS_2026.title} | DinnerByDesign`,
    description: UK_FOOD_COSTS_2026.description,
    canonicalPath: UK_FOOD_COSTS_2026_PATH,
    jsonLd: getUkFoodCosts2026JsonLd(),
  }),
  'food-costs-lower-cost-cuts': () => guideSeoConfig(LOWER_COST_CUTS_GUIDE, LOWER_COST_CUTS_PATH, getLowerCostCutsJsonLd()),
  'food-costs-cheaper-meat-cuts': () => guideSeoConfig(CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH, getCheaperMeatCutsGuideJsonLd()),
  'food-costs-shared-ingredients': () => guideSeoConfig(SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH, getSharedIngredientsGuideJsonLd()),
  'food-costs-complete-packs': () => guideSeoConfig(COMPLETE_PACKS_GUIDE, COMPLETE_PACKS_GUIDE_PATH, getCompletePacksGuideJsonLd()),
  'food-costs-low-cost-cooking-techniques': () => guideSeoConfig(LOW_COST_COOKING_TECHNIQUES_GUIDE, LOW_COST_COOKING_TECHNIQUES_PATH, getLowCostCookingTechniquesJsonLd()),
  'food-costs-cooking-for-one': () => guideSeoConfig(COOKING_FOR_ONE_GUIDE, COOKING_FOR_ONE_PATH, getCookingForOneJsonLd()),
  'food-costs-offal-budget': () => guideSeoConfig(OFFAL_BUDGET_GUIDE, OFFAL_BUDGET_GUIDE_PATH, getOffalBudgetGuideJsonLd()),
  'food-costs-portion-planning': () => guideSeoConfig(PORTION_PLANNING_GUIDE, PORTION_PLANNING_GUIDE_PATH, getPortionPlanningGuideJsonLd()),
  'food-costs-mediterranean-affordable-cooking': () => guideSeoConfig(MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE, MEDITERRANEAN_AFFORDABLE_COOKING_PATH, getMediterraneanAffordableCookingJsonLd()),
  'food-costs-summer-stews': () => guideSeoConfig(SUMMER_STEWS_GUIDE, SUMMER_STEWS_GUIDE_PATH, getSummerStewsGuideJsonLd()),
  'food-costs-fresh-or-frozen': () => guideSeoConfig(FRESH_OR_FROZEN_GUIDE, FRESH_OR_FROZEN_GUIDE_PATH, getFreshOrFrozenGuideJsonLd()),
  'food-costs-batch-cooking': () => guideSeoConfig(BATCH_COOKING_GUIDE, BATCH_COOKING_GUIDE_PATH, getBatchCookingGuideJsonLd()),
  'food-costs-grocery-cost-options': () => guideSeoConfig(GROCERY_COST_OPTIONS_GUIDE, GROCERY_COST_OPTIONS_GUIDE_PATH, getGroceryCostOptionsGuideJsonLd()),
  'food-costs-grocery-prediction': () => guideSeoConfig(GROCERY_COST_PREDICTION_GUIDE, GROCERY_COST_PREDICTION_GUIDE_PATH, getGroceryCostPredictionGuideJsonLd()),
  guides: () => ({
    title: PUBLIC_GUIDE_LIBRARY.seoTitle,
    description: PUBLIC_GUIDE_LIBRARY.description,
    canonicalPath: PUBLIC_LIBRARY_PATH || '/guides',
    jsonLd: getPublicGuideLibraryJsonLd(),
  }),
  'five-a-day-guide': () => guideSeoConfig(FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH, getFiveADayGuideJsonLd()),
  'home-cooked-ready-made-guide': () => guideSeoConfig(HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH, getHomeCookedReadyMadeGuideJsonLd()),
  'cheap-finishing-touches-guide': () => guideSeoConfig(CHEAP_FINISHING_TOUCHES_GUIDE, CHEAP_FINISHING_TOUCHES_GUIDE_PATH, getCheapFinishingTouchesGuideJsonLd()),
  'low-cost-dinners-guide': () => guideSeoConfig(LOW_COST_DINNERS_GUIDE, LOW_COST_DINNERS_GUIDE_PATH, getLowCostDinnersGuideJsonLd()),
};

export const getLegacyPublicGuideSeoConfig = (view: AppView): SeoConfig | null => (
  LEGACY_PUBLIC_GUIDE_SEO_CONFIGS[view]?.() || null
);
