import {
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
} from './nineBudgetDinnersWithSavouryPiesGuide';
import type { PublicGuideRecord } from './publicGuideModel';

export const PUBLIC_GUIDE_RECORDS = [
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
] satisfies PublicGuideRecord[];

export const PUBLISHED_PUBLIC_GUIDE_RECORDS = PUBLIC_GUIDE_RECORDS.filter(guide => guide.status === 'published');

export const getPublicGuideRecordByPath = (path: string) =>
  PUBLIC_GUIDE_RECORDS.find(guide => guide.path === path || guide.canonicalPath === path);
