import { describe, expect, it } from 'vitest';
import { isDeliverableSearchResult } from './searchDelivery';

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

  it('rejects an incomplete response', () => {
    expect(isDeliverableSearchResult({ diagnostics: { status: 'succeeded' } })).toBe(false);
  });
});
