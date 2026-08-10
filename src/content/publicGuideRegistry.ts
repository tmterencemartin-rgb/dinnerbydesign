import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
} from './nineBudgetDinnersWithSavouryPiesGuide';
import {
  MINCE_BUDGET_DINNERS_GUIDE_RECORD,
} from './minceBudgetDinnersGuide';
import {
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_RECORD,
} from './nineBudgetDinnersThreeCuisinesGuide';
import {
  SAUSAGE_WAYS_GUIDE_RECORD,
} from './sausageWaysGuide';
import {
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD,
} from './bubbleAndSqueakBudgetDinnersGuide';
import {
  MEAT_STRETCHING_GUIDE_RECORD,
} from './meatStretchingGuide';
import {
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD,
} from './leftoverRoastChickenBudgetDinnersGuide';
import {
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_RECORD,
} from './nineBudgetFriendlyDinnersWithEggsGuide';
import {
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_RECORD,
} from './nineBudgetDinnersWithTinnedVegetablesGuide';
import {
  WHOLE_CHICKEN_VALUE_GUIDE_RECORD,
} from './wholeChickenValueGuide';
import {
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD,
} from './nineBudgetDinnersWithPotatoesGuide';
import {
  NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_RECORD,
} from './nineBudgetDinnersWithRiceGuide';
import type { PublicGuideRecord } from './publicGuideModel';

export const PUBLIC_GUIDE_RECORDS = [
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
  MINCE_BUDGET_DINNERS_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_RECORD,
  SAUSAGE_WAYS_GUIDE_RECORD,
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD,
  MEAT_STRETCHING_GUIDE_RECORD,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD,
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_RECORD,
  WHOLE_CHICKEN_VALUE_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD,
] satisfies PublicGuideRecord[];

export const PUBLISHED_PUBLIC_GUIDE_RECORDS = PUBLIC_GUIDE_RECORDS.filter(guide => guide.status === 'published');

export const getPublicGuideRecordByPath = (path: string) =>
  PUBLIC_GUIDE_RECORDS.find(guide => guide.path === path || guide.canonicalPath === path);
