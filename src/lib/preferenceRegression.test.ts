import { describe, expect, it } from 'vitest';
import type { Recipe } from '../types';
import { filterCookingFatsForDiet } from './preferenceCompatibility';
import { passesHardConstraints } from './dietarySafety';

const baseRecipe: Recipe = {
  title: 'Tomato and herb pasta',
  description: 'A simple pasta dish with tomato and herbs.',
  ingredients: ['Pasta', 'Tomato', 'Basil'],
  instructions: [],
  cuisine: 'Italian',
  totalTime: 25,
  saladType: 'none',
  isVegetarian: true,
  isPescatarian: true,
  isVegan: true,
  dietFlagsVerified: true,
  calories: 700,
  caloriesPerPortion: 350,
  costPerPortion: '£1.80',
  totalServings: 2
};

const basePreferences = {
  dietaryRule: 'none' as const,
  saladPreference: 'all' as const,
  allergies: [],
  exclusions: [],
  religiousEthical: [],
  calorieCeiling: null,
  budgetLimit: null,
  includeOffal: false
};

describe('preference regression checklist', () => {
  it.each([
    ['vegan rejects dairy', { title: 'Creamy pasta', ingredients: ['Pasta', 'Cream'], isVegan: false }, { dietaryRule: 'vegan' as const }],
    ['gluten-free rejects wheat', { title: 'Wheat pasta', ingredients: ['Wheat pasta'], isVegan: true }, { dietaryRule: 'gluten-free' as const }],
    ['Paleo rejects legumes', { title: 'Lentil stew', ingredients: ['Lentils'], isVegan: true }, { dietaryRule: 'paleo' as const }],
    ['pescatarian rejects poultry', { title: 'Chicken pasta', ingredients: ['Chicken', 'Pasta'], isVegetarian: false, isPescatarian: false, isVegan: false }, { dietaryRule: 'pescatarian' as const }],
    ['Halal-friendly rejects pork', { title: 'Pork pasta', ingredients: ['Pork', 'Pasta'], isVegetarian: false, isPescatarian: false, isVegan: false }, { religiousEthical: ['Halal-friendly'] }],
    ['allergy rejects the mapped allergen', { title: 'Almond pasta', ingredients: ['Pasta', 'Almonds'] }, { allergies: ['Tree nuts'] }],
    ['offal is excluded unless explicitly included', { title: 'Liver and onions', ingredients: ['Lamb liver', 'Onion'] }, {}]
  ])('%s', (_label, recipeOverrides, preferenceOverrides) => {
    expect(passesHardConstraints(
      { ...baseRecipe, ...recipeOverrides },
      { ...basePreferences, ...preferenceOverrides }
    )).toBe(false);
  });

  it('allows an explicitly included offal recipe when no diet conflicts', () => {
    const liverRecipe = { ...baseRecipe, title: 'Liver and onions', ingredients: ['Lamb liver', 'Onion'] };
    expect(passesHardConstraints(liverRecipe, { ...basePreferences, includeOffal: true })).toBe(true);
  });

  it('enforces both calorie and budget ceilings per portion', () => {
    expect(passesHardConstraints(baseRecipe, { ...basePreferences, calorieCeiling: 400, budgetLimit: 2 })).toBe(true);
    expect(passesHardConstraints({ ...baseRecipe, caloriesPerPortion: 401 }, { ...basePreferences, calorieCeiling: 400 })).toBe(false);
    expect(passesHardConstraints({ ...baseRecipe, costPerPortion: '£2.01' }, { ...basePreferences, budgetLimit: 2 })).toBe(false);
  });

  it('removes prohibited cooking fats from the preference choices', () => {
    expect(filterCookingFatsForDiet('vegan', ['Olive oil', 'Butter', 'Ghee', 'Lard/Dripping'])).toEqual(['Olive oil']);
    expect(filterCookingFatsForDiet('paleo', ['Olive oil', 'Vegetable oil', 'Butter', 'Lard/Dripping'])).toEqual(['Olive oil', 'Lard/Dripping']);
  });
});
