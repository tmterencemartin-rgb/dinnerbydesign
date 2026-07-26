import { describe, expect, it } from 'vitest';
import { isPublicGuideRoute } from './publicRoute';

describe('isPublicGuideRoute', () => {
  it('routes public guide families to the lightweight guide shell', () => {
    expect(isPublicGuideRoute('/guides')).toBe(true);
    expect(isPublicGuideRoute('/guides/')).toBe(true);
    expect(isPublicGuideRoute('/dinner-plans')).toBe(true);
    expect(isPublicGuideRoute('/recipes')).toBe(true);
    expect(isPublicGuideRoute('/food-costs')).toBe(true);
    expect(isPublicGuideRoute('/guides/do-vegetables-in-dishes-count-towards-5-a-day')).toBe(true);
    expect(isPublicGuideRoute('/recipes/future-recipe')).toBe(true);
    expect(isPublicGuideRoute('/food-costs/fresh-or-frozen')).toBe(true);
    expect(isPublicGuideRoute('/dinner-plans/5-dinners-for-2-under-40')).toBe(true);
  });

  it('keeps working-app and account routes in the application shell', () => {
    expect(isPublicGuideRoute('/')).toBe(false);
    expect(isPublicGuideRoute('/signin')).toBe(false);
    expect(isPublicGuideRoute('/planner')).toBe(false);
    expect(isPublicGuideRoute('/shopping')).toBe(false);
    expect(isPublicGuideRoute('/pricing-methodology')).toBe(false);
  });
});
