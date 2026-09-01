import { describe, expect, it } from 'vitest';
import { SavedRecipe } from '../types';
import { aggregateWeeklyIngredients, buildShoppingListData, buildSupermarketPlanSummary, getIngredientCategory } from './shoppingUtils';

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
    expect(summary.shopWeight).toBe('light');
    expect(summary.headline).toBe('This plan makes good use of the shop.');
    expect(summary.costExplanation).toContain('Dinners total about £8.60');
    expect(summary.reusedIngredients.map(item => item.name)).toContain('Rice');
    expect(summary.oneUseIngredients.map(item => item.name)).toEqual(
      expect.arrayContaining(['Chicken thighs', 'Red pepper', 'Courgette'])
    );
    expect(summary.planNotes.some(note => note.includes('reused'))).toBe(true);
  });
});

describe('shopping edge cases', () => {
  it('keeps overlapping produce names in the correct category', () => {
    expect(getIngredientCategory('1 red pepper')).toBe('Veg & fruit');
    expect(getIngredientCategory('1 eggplant')).toBe('Veg & fruit');
    expect(getIngredientCategory('black pepper')).toBe('Cupboard');
  });

  it('uses the upper bound for ranges and parses mixed fractions', () => {
    const ingredients = aggregateWeeklyIngredients([
      makeRecipe({
        id: 'range',
        title: 'Range recipe',
        scheduledDate: 'monday',
        totalServings: 2,
        requestedServings: 2,
        ingredients: ['1-2 onions', '1 1/2kg potatoes'],
      }),
    ]);

    expect(ingredients.find(item => item.id === 'onion')?.unitQuantities['']).toBe(2);
    expect(ingredients.find(item => item.id === 'potato')?.unitQuantities.kg).toBe(1.5);
  });
});

describe('buildShoppingListData', () => {
  it('keeps manually added shopping items separate from generated items', () => {
    const planner = [
      makeRecipe({
        id: 'monday',
        title: 'Chicken rice bowl',
        scheduledDate: 'monday',
        requestedServings: 2,
        totalServings: 2,
        ingredients: ['200g chicken thighs']
      })
    ];

    const list = buildShoppingListData({
      planner,
      pantry: [],
      userId: 'user-1',
      existingItems: [
        {
          id: 'custom-1',
          name: 'Tomato paste',
          nameRaw: 'Tomato paste',
          ingredientKey: 'tomato-paste',
          quantityNeeded: 1,
          unitNeeded: 'each',
          category: 'Other',
          checked: false,
          inStock: false,
          sourceRecipeIds: [],
          sourceDays: [],
          generatedAt: null as any,
          userId: 'user-1',
          isCustom: true
        }
      ]
    });

    expect(list.find(item => item.id === 'custom-1')?.category).toBe('Added items');
    expect(list.find(item => item.sourceRecipeIds.includes('monday'))?.category).toBe('Meat & fish');
  });
});
