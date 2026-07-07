import { describe, expect, it } from 'vitest';
import { ReadyMeal, Recipe, SavedRecipe } from '../types';
import { prepareSavedRecipeData } from './savedRecipeData';

const timestamps = {
  savedAt: 'saved-timestamp',
  updatedAt: 'updated-timestamp',
};

describe('savedRecipeData', () => {
  it('prepares a cooked recipe for savedRecipes storage', () => {
    const recipe: Recipe = {
      title: 'Chicken Rice',
      description: 'Simple dinner',
      ingredients: ['200g rice', '2 chicken thighs'],
      instructions: ['Cook rice', 'Cook chicken'],
      cuisine: 'Dinner',
      caloriesPerPortion: 520,
      calories: 520,
      costPerPortion: '£2.20',
      totalServings: 2,
      totalTime: 30,
      prepTime: 10,
      cookTime: 20,
      saladType: 'none',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
      isNutritious: true,
      mainProtein: 'chicken',
      mainIngredient: 'Chicken thighs',
      mainIngredientCategory: 'chicken',
      isVegetarian: false,
      isPescatarian: false,
      isVegan: false,
      dietFlagsVerified: true,
    };

    const data = prepareSavedRecipeData(recipe, 'user-1', 'monday', timestamps);

    expect(data).toMatchObject({
      title: 'Chicken Rice',
      mode: 'cook',
      userId: 'user-1',
      scheduledDate: 'monday',
      savedAt: 'saved-timestamp',
      updatedAt: 'updated-timestamp',
      ingredients: ['200g rice', '2 chicken thighs'],
      instructions: ['Cook rice', 'Cook chicken'],
      costPerPortion: '£2.20',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
      isArchived: false,
      archivedAt: null,
    });
    expect(data.recipeId).toContain('cook');
  });

  it('prepares a ready-made dinner with retailer fields', () => {
    const meal: ReadyMeal = {
      title: 'Ready Curry',
      description: 'A supermarket curry',
      retailer: 'Tesco',
      price: '£3.50',
      costPerPortion: '£3.50',
      cuisine: 'Indian',
      caloriesPerPortion: 610,
      servingSuggestion: 'Add salad',
      totalTime: 12,
      saladType: 'none',
      sourceUrl: 'https://www.tesco.com/groceries/en-GB/products/123',
      isVegetarian: false,
      isPescatarian: false,
      isVegan: false,
      dietFlagsVerified: true,
      readyMadeKit: {
        coreProduct: 'Curry',
        sides: [{ name: 'Rice' }],
      },
    };

    const data = prepareSavedRecipeData(meal, 'user-1', null, timestamps);

    expect(data).toMatchObject({
      title: 'Ready Curry',
      mode: 'ready-made',
      retailer: 'Tesco',
      price: '£3.50',
      servingSuggestion: 'Add salad',
      readyMadeKit: {
        coreProduct: 'Curry',
        sides: [{ name: 'Rice' }],
      },
      scheduledDate: null,
    });
  });

  it('preserves personal notes and removes undefined fields', () => {
    const saved: SavedRecipe = {
      recipeId: 'saved-id',
      title: 'Saved Pasta',
      cuisine: 'Italian',
      mode: 'cook',
      savedAt: null,
      userId: 'user-1',
      personalNote: 'Use the good olive oil',
      sourceUrl: 'https://www.google.com/search?q=saved+pasta+recipe',
    };

    const data = prepareSavedRecipeData(saved, 'user-1', null, timestamps);

    expect(data.personalNote).toBe('Use the good olive oil');
    expect(data.sourceUrl).toBeNull();
    expect(data.description).toBeUndefined();
    expect(Object.values(data)).not.toContain(undefined);
  });
});
