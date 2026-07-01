import { describe, expect, it } from 'vitest';
import { SavedRecipe } from '../types';
import { buildSupermarketPlanSummary } from './shoppingUtils';

const makeRecipe = (overrides: Partial<SavedRecipe>): SavedRecipe => ({
  recipeId: overrides.recipeId || overrides.id || overrides.title || 'recipe',
  title: overrides.title || 'Recipe',
  cuisine: overrides.cuisine || 'British',
  mode: overrides.mode || 'cook',
  savedAt: null,
  userId: 'user-1',
  ...overrides
});

describe('buildSupermarketPlanSummary', () => {
  it('summarises cost, ingredient reuse, and one-use ingredients for a scheduled week', () => {
    const planner = [
      makeRecipe({
        id: 'monday',
        title: 'Chicken rice bowl',
        scheduledDate: 'monday',
        costPerPortion: '£2.50',
        requestedServings: 2,
        totalServings: 2,
        ingredients: ['200g chicken thighs', '150g rice', '1 red pepper']
      }),
      makeRecipe({
        id: 'tuesday',
        title: 'Vegetable rice',
        scheduledDate: 'tuesday',
        costPerPortion: '£1.80',
        requestedServings: 2,
        totalServings: 2,
        ingredients: ['150g rice', '1 courgette']
      }),
      makeRecipe({
        id: 'unscheduled',
        title: 'Saved but not planned',
        ingredients: ['1 onion']
      })
    ];

    const summary = buildSupermarketPlanSummary(planner, ['Tesco']);

    expect(summary.plannedDinnerCount).toBe(2);
    expect(summary.preferredSupermarkets).toEqual(['Tesco']);
    expect(summary.estimatedDinnerCost).toBe(8.6);
    expect(summary.reusedIngredients.map(item => item.name)).toContain('Rice');
    expect(summary.oneUseIngredients.map(item => item.name)).toEqual(
      expect.arrayContaining(['Chicken thighs', 'Red pepper', 'Courgette'])
    );
    expect(summary.planNotes.some(note => note.includes('reused'))).toBe(true);
  });
});
