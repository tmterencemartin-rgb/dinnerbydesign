import { describe, expect, it } from 'vitest';
import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
} from './nineBudgetDinnersWithSavouryPiesGuide';
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
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH)?.title).toBe('Nine budget dinners with potatoes');
    expect(getPublicGuideRecordByPath(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH)?.title).toBe('Nine budget dinners with rice');
  });
});
