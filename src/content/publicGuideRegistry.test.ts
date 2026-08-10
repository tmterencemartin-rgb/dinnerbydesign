import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
} from './nineBudgetDinnersWithSavouryPiesGuide';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
} from './seoMealPlans';
import {
  FAMILY_DINNERS_FOR_FOUR_PATH,
} from './familyDinnersForFourPlan';
import {
  MINCE_BUDGET_DINNERS_GUIDE_PATH,
} from './minceBudgetDinnersGuide';
import {
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH,
} from './nineBudgetDinnersThreeCuisinesGuide';
import {
  SAUSAGE_WAYS_GUIDE_PATH,
} from './sausageWaysGuide';
import {
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
} from './bubbleAndSqueakBudgetDinnersGuide';
import {
  MEAT_STRETCHING_GUIDE_PATH,
} from './meatStretchingGuide';
import {
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
} from './leftoverRoastChickenBudgetDinnersGuide';
import {
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
} from './nineBudgetFriendlyDinnersWithEggsGuide';
import {
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
} from './nineBudgetDinnersWithTinnedVegetablesGuide';
import {
  WHOLE_CHICKEN_VALUE_GUIDE_PATH,
} from './wholeChickenValueGuide';
import {
  FIVE_A_DAY_GUIDE_PATH,
} from './fiveADayGuide';
import {
  HOME_COOKED_READY_MADE_GUIDE_PATH,
} from './homeCookedReadyMadeGuide';
import {
  CHICKEN_THIGH_COST_GUIDE_PATH,
} from './chickenThighCostGuide';
import {
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
} from './nineBudgetDinnersWithPotatoesGuide';
import {
  NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH,
} from './nineBudgetDinnersWithRiceGuide';
import {
  TINNED_FISH_GUIDE_PATH,
} from './tinnedFishGuide';
import {
  CONVENIENCE_FISH_GUIDE_PATH,
} from './convenienceFishGuide';
import {
  FIVE_STAPLES_GUIDE_PATH,
} from './fiveStaplesGuide';
import {
  PULSES_BUDGET_GUIDE_PATH,
} from './pulsesBudgetGuide';
import {
  TRAYBAKE_GUIDE_PATH,
} from './traybakeGuide';
import {
  LOW_COST_DINNERS_GUIDE_PATH,
} from './lowCostDinnersGuide';
import {
  GROCERY_COST_OPTIONS_GUIDE_PATH,
} from './groceryCostOptionsGuide';
import {
  GROCERY_COST_PREDICTION_GUIDE_PATH,
} from './groceryCostPredictionGuide';
import {
  CHEAPER_MEAT_CUTS_GUIDE_PATH,
} from './cheaperMeatCutsGuide';
import {
  SHARED_INGREDIENTS_GUIDE_PATH,
} from './sharedIngredientsGuide';
import {
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE_PATH,
  MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026_PATH,
} from './seoFoodCostGuides';
import {
  PUBLIC_GUIDE_RECORDS,
  PUBLISHED_PUBLIC_GUIDE_RECORDS,
  getPublicGuideRecordByPath,
} from './publicGuideRegistry';

describe('public guide registry', () => {
  it('registers migrated public guides with unique paths', () => {
    const paths = PUBLIC_GUIDE_RECORDS.map(guide => guide.path);
    expect(paths).toContain(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH);
    expect(paths).toContain(FAMILY_DINNERS_FOR_FOUR_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH);
    expect(paths).toContain(MINCE_BUDGET_DINNERS_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH);
    expect(paths).toContain(SAUSAGE_WAYS_GUIDE_PATH);
    expect(paths).toContain(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH);
    expect(paths).toContain(MEAT_STRETCHING_GUIDE_PATH);
    expect(paths).toContain(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH);
    expect(paths).toContain(WHOLE_CHICKEN_VALUE_GUIDE_PATH);
    expect(paths).toContain(FIVE_A_DAY_GUIDE_PATH);
    expect(paths).toContain(HOME_COOKED_READY_MADE_GUIDE_PATH);
    expect(paths).toContain(CHICKEN_THIGH_COST_GUIDE_PATH);
    expect(paths).toContain(TINNED_FISH_GUIDE_PATH);
    expect(paths).toContain(CONVENIENCE_FISH_GUIDE_PATH);
    expect(paths).toContain(FIVE_STAPLES_GUIDE_PATH);
    expect(paths).toContain(PULSES_BUDGET_GUIDE_PATH);
    expect(paths).toContain(TRAYBAKE_GUIDE_PATH);
    expect(paths).toContain(LOW_COST_DINNERS_GUIDE_PATH);
    expect(paths).toContain(UK_FOOD_COSTS_2026_PATH);
    expect(paths).toContain(GROCERY_COST_OPTIONS_GUIDE_PATH);
    expect(paths).toContain(GROCERY_COST_PREDICTION_GUIDE_PATH);
    expect(paths).toContain(CHEAPER_MEAT_CUTS_GUIDE_PATH);
    expect(paths).toContain(SHARED_INGREDIENTS_GUIDE_PATH);
    expect(paths).toContain(OFFAL_BUDGET_GUIDE_PATH);
    expect(paths).toContain(MEDITERRANEAN_AFFORDABLE_COOKING_PATH);
    expect(paths).toContain(SUMMER_STEWS_GUIDE_PATH);
    expect(paths).toContain(BATCH_COOKING_GUIDE_PATH);
    expect(paths).toContain(PORTION_PLANNING_GUIDE_PATH);
    expect(paths).toContain(FRESH_OR_FROZEN_GUIDE_PATH);
    expect(paths).toContain(COOKING_FOR_ONE_PATH);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('keeps published guides ready for indexing and review', () => {
    PUBLISHED_PUBLIC_GUIDE_RECORDS.forEach(guide => {
      expect(guide.indexingStatus).toBe('index');
      expect(guide.canonicalPath).toBe(guide.path);
      expect(guide.contentReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.sections.length).toBeGreaterThan(0);
      expect(guide.sources.length).toBeGreaterThan(0);
      expect(guide.faqs.length).toBeGreaterThan(0);
      expect(guide.disclosureItems.map(item => item.key)).toEqual(guide.disclosures);
    });
  });

  it('looks up guides by public path', () => {
    expect(getPublicGuideRecordByPath(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH)?.title).toBe('5 dinners for two under £40');
    expect(getPublicGuideRecordByPath(FAMILY_DINNERS_FOR_FOUR_PATH)?.title).toBe('Five family dinners for four using one coordinated basket');
    const guide = getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH);
    expect(guide?.title).toBe('Nine budget dinners with savoury pies');
    expect(getPublicGuideRecordByPath(MINCE_BUDGET_DINNERS_GUIDE_PATH)?.title).toBe('9 budget dinners with beef or pork mince');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH)?.title).toBe('Nine budget dinners from three cuisines: Indian, Mexican and Egyptian');
    expect(getPublicGuideRecordByPath(SAUSAGE_WAYS_GUIDE_PATH)?.title).toBe('9 ways with sausages for easy everyday dinners');
    expect(getPublicGuideRecordByPath(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH)?.title).toBe('Nine budget dinners built around bubble and squeak');
    expect(getPublicGuideRecordByPath(MEAT_STRETCHING_GUIDE_PATH)?.title).toBe('Seven ways to make meat go further with beans, lentils and mushrooms');
    expect(getPublicGuideRecordByPath(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH)?.title).toBe('9 budget dinners with leftover roast chicken');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH)?.title).toBe('Nine budget-friendly dinners with eggs');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH)?.title).toBe('Nine budget dinners with tinned vegetables');
    expect(getPublicGuideRecordByPath(WHOLE_CHICKEN_VALUE_GUIDE_PATH)?.title).toBe('Is a whole chicken better value than chicken pieces?');
    expect(getPublicGuideRecordByPath(FIVE_A_DAY_GUIDE_PATH)?.title).toBe('Do vegetables in dishes count towards your 5 A Day?');
    expect(getPublicGuideRecordByPath(HOME_COOKED_READY_MADE_GUIDE_PATH)?.title).toBe('Home-cooked or ready-made? The honest comparison');
    expect(getPublicGuideRecordByPath(CHICKEN_THIGH_COST_GUIDE_PATH)?.title).toBe('Five chicken thigh recipes for four with Aldi cost estimates');
    expect(getPublicGuideRecordByPath(TINNED_FISH_GUIDE_PATH)?.title).toBe('Tinned fish recipes: easy dinner ideas with tuna, salmon, sardines and more');
    expect(getPublicGuideRecordByPath(CONVENIENCE_FISH_GUIDE_PATH)?.title).toBe('How to turn fish fingers, fishcakes and scampi into better weeknight dinners');
    expect(getPublicGuideRecordByPath(FIVE_STAPLES_GUIDE_PATH)?.title).toBe('Five dinners built around potatoes, rice, pasta, bread and pulses');
    expect(getPublicGuideRecordByPath(PULSES_BUDGET_GUIDE_PATH)?.title).toBe('Cooking with lentils, beans and chickpeas on a budget');
    expect(getPublicGuideRecordByPath(TRAYBAKE_GUIDE_PATH)?.title).toBe('How to build a traybake that cooks evenly and tastes properly finished');
    expect(getPublicGuideRecordByPath(LOW_COST_DINNERS_GUIDE_PATH)?.title).toBe("Low-cost dinners don't have to be boring");
    expect(getPublicGuideRecordByPath(UK_FOOD_COSTS_2026_PATH)?.title).toBe('Why UK food costs are rising in 2026 — and what it means for your shopping');
    expect(getPublicGuideRecordByPath(GROCERY_COST_OPTIONS_GUIDE_PATH)?.title).toBe('12 practical ways to reduce and manage your grocery costs');
    expect(getPublicGuideRecordByPath(GROCERY_COST_PREDICTION_GUIDE_PATH)?.title).toBe('Why is it so difficult to budget accurately for food?');
    expect(getPublicGuideRecordByPath(CHEAPER_MEAT_CUTS_GUIDE_PATH)?.title).toBe('Cooking with cheaper cuts of meat: what to buy and how to use it');
    expect(getPublicGuideRecordByPath(SHARED_INGREDIENTS_GUIDE_PATH)?.title).toBe('How to plan five dinners around shared ingredients and complete packs');
    expect(getPublicGuideRecordByPath(OFFAL_BUDGET_GUIDE_PATH)?.title).toBe('Cooking with offal on a budget: what to buy and how to use it');
    expect(getPublicGuideRecordByPath(MEDITERRANEAN_AFFORDABLE_COOKING_PATH)?.title).toBe('Mediterranean-inspired ways to make everyday ingredients taste good');
    expect(getPublicGuideRecordByPath(SUMMER_STEWS_GUIDE_PATH)?.title).toBe('Summer stews: making vegetables go further');
    expect(getPublicGuideRecordByPath(BATCH_COOKING_GUIDE_PATH)?.title).toBe("Batch cooking on a budget: when it saves money and when it doesn't");
    expect(getPublicGuideRecordByPath(PORTION_PLANNING_GUIDE_PATH)?.title).toBe('How portion planning can help reduce food costs and waste');
    expect(getPublicGuideRecordByPath(FRESH_OR_FROZEN_GUIDE_PATH)?.title).toBe('Fresh or frozen: which is better for the way you cook?');
    expect(getPublicGuideRecordByPath(COOKING_FOR_ONE_PATH)?.title).toBe('Five dinners for one from one Aldi basket');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH)?.title).toBe('Nine budget dinners with potatoes');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH)?.title).toBe('Nine budget dinners with rice');
  });
});
