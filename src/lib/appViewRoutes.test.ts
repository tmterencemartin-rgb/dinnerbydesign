import { describe, expect, it } from 'vitest';
import {
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE_PATH,
  LOW_COST_COOKING_TECHNIQUES_PATH,
  MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026_PATH,
} from '../content/seoFoodCostGuides';
import { CHEAPER_MEAT_CUTS_GUIDE_PATH } from '../content/cheaperMeatCutsGuide';
import { CHEAP_FINISHING_TOUCHES_GUIDE_PATH } from '../content/cheapFinishingTouchesGuide';
import { COMPLETE_PACKS_GUIDE_PATH } from '../content/completePacksGuide';
import { FIVE_A_DAY_GUIDE_PATH } from '../content/fiveADayGuide';
import { FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from '../content/seoMealPlans';
import { GROCERY_COST_OPTIONS_GUIDE_PATH } from '../content/groceryCostOptionsGuide';
import { GROCERY_COST_PREDICTION_GUIDE_PATH } from '../content/groceryCostPredictionGuide';
import { HOME_COOKED_READY_MADE_GUIDE_PATH } from '../content/homeCookedReadyMadeGuide';
import { LOW_COST_DINNERS_GUIDE_PATH } from '../content/lowCostDinnersGuide';
import { PUBLIC_LIBRARY_PATH } from '../content/publicArticles';
import { SHARED_INGREDIENTS_GUIDE_PATH } from '../content/sharedIngredientsGuide';
import { getAppViewFromLocation, getAppViewFromPublicPath, isQueryParamAppView } from './appViewRoutes';

describe('app view routes', () => {
  it('maps public URLs to the app views that render them', () => {
    expect(getAppViewFromPublicPath('/privacy')).toBe('privacy');
    expect(getAppViewFromPublicPath('/terms')).toBe('terms');
    expect(getAppViewFromPublicPath('/signin?mode=signin')).toBe('signin');
    expect(getAppViewFromPublicPath('/planner')).toBe('planner');
    expect(getAppViewFromPublicPath('/shopping')).toBe('shopping');
    expect(getAppViewFromPublicPath('/admin')).toBe('admin');
    expect(getAppViewFromPublicPath(`${PUBLIC_LIBRARY_PATH}/`)).toBe('guides');
    expect(getAppViewFromPublicPath(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH)).toBe('meal-plan-five-for-two-under-40');
    expect(getAppViewFromPublicPath(UK_FOOD_COSTS_2026_PATH)).toBe('food-costs-uk-2026');
    expect(getAppViewFromPublicPath(CHEAPER_MEAT_CUTS_GUIDE_PATH)).toBe('food-costs-cheaper-meat-cuts');
    expect(getAppViewFromPublicPath(SHARED_INGREDIENTS_GUIDE_PATH)).toBe('food-costs-shared-ingredients');
    expect(getAppViewFromPublicPath(COMPLETE_PACKS_GUIDE_PATH)).toBe('food-costs-complete-packs');
    expect(getAppViewFromPublicPath(LOW_COST_COOKING_TECHNIQUES_PATH)).toBe('food-costs-low-cost-cooking-techniques');
    expect(getAppViewFromPublicPath(COOKING_FOR_ONE_PATH)).toBe('food-costs-cooking-for-one');
    expect(getAppViewFromPublicPath(OFFAL_BUDGET_GUIDE_PATH)).toBe('food-costs-offal-budget');
    expect(getAppViewFromPublicPath(PORTION_PLANNING_GUIDE_PATH)).toBe('food-costs-portion-planning');
    expect(getAppViewFromPublicPath(MEDITERRANEAN_AFFORDABLE_COOKING_PATH)).toBe('food-costs-mediterranean-affordable-cooking');
    expect(getAppViewFromPublicPath(SUMMER_STEWS_GUIDE_PATH)).toBe('food-costs-summer-stews');
    expect(getAppViewFromPublicPath(FRESH_OR_FROZEN_GUIDE_PATH)).toBe('food-costs-fresh-or-frozen');
    expect(getAppViewFromPublicPath(BATCH_COOKING_GUIDE_PATH)).toBe('food-costs-batch-cooking');
    expect(getAppViewFromPublicPath(GROCERY_COST_OPTIONS_GUIDE_PATH)).toBe('food-costs-grocery-cost-options');
    expect(getAppViewFromPublicPath(GROCERY_COST_PREDICTION_GUIDE_PATH)).toBe('food-costs-grocery-prediction');
    expect(getAppViewFromPublicPath(FIVE_A_DAY_GUIDE_PATH)).toBe('five-a-day-guide');
    expect(getAppViewFromPublicPath(HOME_COOKED_READY_MADE_GUIDE_PATH)).toBe('home-cooked-ready-made-guide');
    expect(getAppViewFromPublicPath(CHEAP_FINISHING_TOUCHES_GUIDE_PATH)).toBe('cheap-finishing-touches-guide');
    expect(getAppViewFromPublicPath(LOW_COST_DINNERS_GUIDE_PATH)).toBe('low-cost-dinners-guide');
  });

  it('keeps unknown public paths out of the signed-in app view map', () => {
    expect(getAppViewFromPublicPath('/guides/not-yet-an-app-view')).toBeNull();
    expect(getAppViewFromPublicPath('/')).toBeNull();
  });

  it('accepts the same query-param views as the previous auth routing', () => {
    expect(isQueryParamAppView('home')).toBe(true);
    expect(isQueryParamAppView('planner')).toBe(true);
    expect(isQueryParamAppView('food-costs-grocery-cost-options')).toBe(false);
    expect(isQueryParamAppView(null)).toBe(false);
  });

  it('uses explicit path routes ahead of stale view query params', () => {
    expect(getAppViewFromLocation('/planner?view=home', 'home')).toBe('planner');
    expect(getAppViewFromLocation('/shopping?view=home', 'home')).toBe('shopping');
    expect(getAppViewFromLocation('/?view=planner', 'planner')).toBe('planner');
  });
});
