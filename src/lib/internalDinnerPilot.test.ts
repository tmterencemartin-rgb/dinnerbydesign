import { describe, expect, it } from 'vitest';
import type { Recipe, UserPreferences } from '../types';
import { validateInternalDinnerChoices } from './internalDinnerPilot';

const preferences: UserPreferences = {
  dietaryRule: 'vegetarian', saladPreference: 'all', allergies: [], nutritiousChoice: false,
  isSimple: false, isLowCost: false, highOmega3: false, highProtein: false, servings: 2,
  calorieCeiling: null, budgetLimit: null, exclusions: [], cuisinePreferences: [], religiousEthical: [],
  cookingMethods: [], cookingFats: [], readyToEatUnderMins: null, preferredSupermarkets: [],
  preferredSourceIds: [], preferredMode: 'cook', customCuisines: []
};

const validChoice: Recipe = {
  title: 'Smoky lentil and pepper bowls',
  description: 'Warm lentils, roasted peppers and herby yoghurt make a satisfying weeknight dinner.',
  ingredients: ['Green lentils', 'Red pepper', 'Spinach', 'Greek yoghurt'],
  instructions: ['Roast the pepper until softened.', 'Warm the lentils and serve with spinach and yoghurt.'],
  cuisine: 'British-inspired', matchReason: 'Uses familiar ingredients in a quick, meat-free dinner.',
  totalServings: 2, totalTime: 30, costPerPortion: '£1.80', saladType: 'none',
  isVegetarian: true, isPescatarian: true, isVegan: false, dietFlagsVerified: true
};

describe('validateInternalDinnerChoices', () => {
  it('keeps three distinct choices that meet hard constraints', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Tomato and bean traybake', ingredients: ['Butter beans', 'Tomato', 'Courgette', 'Olive oil'] },
      { ...validChoice, title: 'Mushroom barley skillet', ingredients: ['Pearl barley', 'Mushrooms', 'Kale', 'Vegetable stock'] }
    ], preferences);
    expect(results).toHaveLength(3);
  });

  it('rejects duplicates and a dinner that violates dietary constraints', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Smoky Lentil and Pepper Bowls' },
      { ...validChoice, title: 'Chicken and pepper bowls', ingredients: ['Chicken', 'Pepper', 'Spinach', 'Yoghurt'], isVegetarian: false, isPescatarian: false }
    ], preferences);
    expect(results).toHaveLength(1);
  });

  it('rejects choices that merely rename the same main ingredient', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Spiced lentil and pepper bowls' }
    ], preferences);
    expect(results).toHaveLength(1);
  });

  it('rejects a recovery choice that repeats an existing main ingredient', () => {
    const results = validateInternalDinnerChoices([
      { ...validChoice, title: 'Lentil and kale bowls' },
      { ...validChoice, title: 'Courgette and bean skillet', ingredients: ['Courgette', 'Butter beans', 'Tomato', 'Olive oil'] }
    ], preferences, [validChoice]);
    expect(results.map(choice => choice.title)).toEqual(['Courgette and bean skillet']);
  });
});
