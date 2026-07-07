import { describe, expect, it } from 'vitest';
import { Recipe, SavedRecipe } from '../types';
import {
  getPlannerUpdateDecision,
  getScheduledRecipeForDay,
  isMissingPlannerRecipeError,
} from './plannerWrites';

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

describe('plannerWrites', () => {
  it('chooses an existing saved dinner when scheduling the same recipe', () => {
    const existing = savedRecipe({
      id: 'existing-id',
      title: 'Tomato Pasta',
      cuisine: 'Italian',
    });

    const decision = getPlannerUpdateDecision({
      savedRecipes: [existing],
      scheduledDate: 'monday',
      recipe: recipe({
        title: 'Tomato Pasta',
        cuisine: 'Italian',
      }),
      newId: 'new-id',
    });

    expect(decision.finalId).toBe('existing-id');
    expect(decision.isNew).toBe(false);
    expect(decision.existingInSaved?.id).toBe('existing-id');
  });

  it('detects the dinner already scheduled on the target day', () => {
    const mondayDinner = savedRecipe({
      id: 'monday-id',
      title: 'Monday Dinner',
      scheduledDate: 'monday',
    });

    const decision = getPlannerUpdateDecision({
      savedRecipes: [mondayDinner],
      scheduledDate: 'monday',
      recipe: recipe({
        title: 'New Monday Dinner',
      }),
      newId: 'new-id',
    });

    expect(decision.existingOnDay?.id).toBe('monday-id');
    expect(decision.finalId).toBe('new-id');
    expect(decision.isNew).toBe(true);
  });

  it('finds the scheduled recipe for a day', () => {
    const recipes = [
      savedRecipe({ id: 'saved', scheduledDate: null }),
      savedRecipe({ id: 'tuesday', scheduledDate: 'tuesday' }),
    ];

    expect(getScheduledRecipeForDay(recipes, 'tuesday')?.id).toBe('tuesday');
    expect(getScheduledRecipeForDay(recipes, 'friday')).toBeUndefined();
  });

  it('recognises missing Firestore document errors used by unschedule', () => {
    expect(isMissingPlannerRecipeError({ code: 'not-found' })).toBe(true);
    expect(isMissingPlannerRecipeError({ message: 'No document to update' })).toBe(true);
    expect(isMissingPlannerRecipeError({ code: 'permission-denied' })).toBe(false);
  });
});
