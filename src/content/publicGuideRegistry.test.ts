import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
} from './nineBudgetDinnersWithSavouryPiesGuide';
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
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
} from './nineBudgetDinnersWithPotatoesGuide';
import {
  NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH,
} from './nineBudgetDinnersWithRiceGuide';
import {
  PUBLIC_GUIDE_RECORDS,
  PUBLISHED_PUBLIC_GUIDE_RECORDS,
  getPublicGuideRecordByPath,
} from './publicGuideRegistry';

describe('public guide registry', () => {
  it('registers migrated public guides with unique paths', () => {
    const paths = PUBLIC_GUIDE_RECORDS.map(guide => guide.path);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH);
    expect(paths).toContain(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH);
    expect(paths).toContain(MEAT_STRETCHING_GUIDE_PATH);
    expect(paths).toContain(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH);
    expect(paths).toContain(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH);
    expect(paths).toContain(WHOLE_CHICKEN_VALUE_GUIDE_PATH);
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
    const guide = getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH);
    expect(guide?.title).toBe('Nine budget dinners with savoury pies');
    expect(getPublicGuideRecordByPath(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH)?.title).toBe('Nine budget dinners built around bubble and squeak');
    expect(getPublicGuideRecordByPath(MEAT_STRETCHING_GUIDE_PATH)?.title).toBe('Seven ways to make meat go further with beans, lentils and mushrooms');
    expect(getPublicGuideRecordByPath(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH)?.title).toBe('9 budget dinners with leftover roast chicken');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH)?.title).toBe('Nine budget-friendly dinners with eggs');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH)?.title).toBe('Nine budget dinners with tinned vegetables');
    expect(getPublicGuideRecordByPath(WHOLE_CHICKEN_VALUE_GUIDE_PATH)?.title).toBe('Is a whole chicken better value than chicken pieces?');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH)?.title).toBe('Nine budget dinners with potatoes');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH)?.title).toBe('Nine budget dinners with rice');
  });
});
