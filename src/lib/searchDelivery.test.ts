import { describe, expect, it } from 'vitest';
import { hasDeliveredSearchChoices, isDeliverableSearchResult } from './searchDelivery';

describe('isDeliverableSearchResult', () => {
  it('accepts a response containing recipes', () => {
    expect(isDeliverableSearchResult({ recipes: [{ title: 'Soup' }] })).toBe(true);
  });

  it('accepts a genuine no-results response', () => {
    expect(isDeliverableSearchResult({ recipes: [], readyMeals: [], isEmpty: true })).toBe(true);
  });

  it('accepts an explicit budget contradiction response', () => {
    expect(isDeliverableSearchResult({ recipes: [], readyMeals: [], budgetContradiction: { ingredient: 'steak' } })).toBe(true);
  });

  it('does not treat an empty or budget-conflict response as a returned choice', () => {
    expect(hasDeliveredSearchChoices({ recipes: [], readyMeals: [], isEmpty: true })).toBe(false);
    expect(hasDeliveredSearchChoices({ recipes: [], readyMeals: [], budgetContradiction: { ingredient: 'steak' } })).toBe(false);
  });

  it('recognises returned recipes and ready-made dinners as choices', () => {
    expect(hasDeliveredSearchChoices({ recipes: [{ title: 'Soup' }] })).toBe(true);
    expect(hasDeliveredSearchChoices({ readyMeals: [{ title: 'Pasta bake' }] })).toBe(true);
  });

  it('rejects an incomplete response', () => {
    expect(isDeliverableSearchResult({ diagnostics: { status: 'succeeded' } })).toBe(false);
  });
});
