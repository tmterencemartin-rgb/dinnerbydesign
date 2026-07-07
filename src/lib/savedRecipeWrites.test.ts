import { describe, expect, it } from 'vitest';
import { Recipe, SavedRecipe } from '../types';
import { findExistingSavedRecipe, getUnscheduledSavedRecipes } from './savedRecipeWrites';

const savedRecipe = (overrides: Partial<SavedRecipe>): SavedRecipe => ({
  id: overrides.id || 'saved-1',
  recipeId: overrides.recipeId || overrides.id || 'saved-1',
  title: overrides.title || 'Saved Dinner',
  cuisine: overrides.cuisine || 'Dinner',
  mode: overrides.mode || 'cook',
  savedAt: null,
  userId: 'user-1',
  ...overrides,
});

const recipe = (overrides: Partial<Recipe>): Recipe => ({
  title: overrides.title || 'New Dinner',
  description: overrides.description || 'Dinner',
  ingredients: overrides.ingredients || [],
  instructions: overrides.instructions || [],
  cuisine: overrides.cuisine || 'Dinner',
  totalServings: overrides.totalServings || 2,
  totalTime: overrides.totalTime || 25,
  saladType: overrides.saladType || 'none',
  isVegetarian: overrides.isVegetarian || false,
  isPescatarian: overrides.isPescatarian || false,
  isVegan: overrides.isVegan || false,
  dietFlagsVerified: overrides.dietFlagsVerified || true,
  ...overrides,
});

describe('savedRecipeWrites', () => {
  it('finds an existing saved recipe for the same dinner', () => {
    const existing = savedRecipe({
      id: 'existing-id',
      title: 'Mushroom Risotto',
      cuisine: 'Italian',
    });

    const match = findExistingSavedRecipe([
      savedRecipe({ id: 'other-id', title: 'Other Dinner' }),
      existing,
    ], recipe({
      title: 'Mushroom Risotto',
      cuisine: 'Italian',
    }));

    expect(match?.id).toBe('existing-id');
  });

  it('returns only unscheduled saved recipes for remove-all-saved', () => {
    const recipes = [
      savedRecipe({ id: 'unscheduled-1', scheduledDate: null }),
      savedRecipe({ id: 'scheduled', scheduledDate: 'monday' }),
      savedRecipe({ id: 'unscheduled-2' }),
    ];

    expect(getUnscheduledSavedRecipes(recipes).map(item => item.id)).toEqual([
      'unscheduled-1',
      'unscheduled-2',
    ]);
  });
});
