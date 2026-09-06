import { describe, expect, it } from 'vitest';
import type { Recipe, UserPreferences } from '../types';
import { getAiCreatedRecipePreferences, validateInternalDinnerChoices } from './internalDinnerPilot';

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
  ingredients: ['200g green lentils', '1 red pepper', '100g spinach', '150g Greek yoghurt'],
  instructions: ['Roast the pepper at 200°C until softened.', 'Warm the lentils and serve with spinach and yoghurt.'],
  cuisine: 'British-inspired', matchReason: 'Uses familiar ingredients in a quick, meat-free dinner.',
  totalServings: 2, totalTime: 30, costPerPortion: '£1.80', saladType: 'none',
  isVegetarian: true, isPescatarian: true, isVegan: false, dietFlagsVerified: true
};

describe('validateInternalDinnerChoices', () => {
  it('keeps three distinct choices that meet hard constraints', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Tomato and bean traybake', ingredients: ['400g butter beans', '2 tomatoes', '1 courgette', '1 tbsp olive oil'] },
      { ...validChoice, title: 'Mushroom barley skillet', ingredients: ['150g pearl barley', '250g mushrooms', '100g kale', '500ml vegetable stock'] }
    ], preferences);
    expect(results).toHaveLength(3);
  });

  it('rejects duplicates and a dinner that violates dietary constraints', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Smoky Lentil and Pepper Bowls' },
      { ...validChoice, title: 'Chicken and pepper bowls', ingredients: ['300g chicken', '1 pepper', '100g spinach', '150g yoghurt'], instructions: ['Cook the chicken until piping hot throughout.', 'Warm the vegetables and serve with yoghurt.'], isVegetarian: false, isPescatarian: false }
    ], preferences);
    expect(results).toHaveLength(1);
  });

  it('rejects a renamed copy of the same choice', () => {
    const results = validateInternalDinnerChoices([
      validChoice,
      { ...validChoice, title: 'Spiced lentil and pepper bowls' }
    ], preferences);
    expect(results).toHaveLength(1);
  });

  it('removes source numbering from method steps', () => {
    const results = validateInternalDinnerChoices([
      { ...validChoice, instructions: ['1. Roast the pepper at 200°C until softened.', '2) Warm the lentils and serve with spinach and yoghurt.'] }
    ], preferences);

    expect(results[0]?.instructions).toEqual([
      'Roast the pepper at 200°C until softened.',
      'Warm the lentils and serve with spinach and yoghurt.'
    ]);
  });

  it('keeps choices that share an ingredient when their cooking approaches differ', () => {
    const results = validateInternalDinnerChoices([
      {
        ...validChoice,
        title: 'Lentil and kale bowls',
        instructions: ['Warm the lentils with the kale and spinach.', 'Finish with yoghurt and roasted pepper.']
      },
      { ...validChoice, title: 'Courgette and bean skillet', ingredients: ['1 courgette', '400g butter beans', '2 tomatoes', '1 tbsp olive oil'] }
    ], preferences, [validChoice]);
    expect(results.map(choice => choice.title)).toEqual(['Lentil and kale bowls', 'Courgette and bean skillet']);
  });

  it('does not apply calorie or source settings to AI-created recipes', () => {
    const applicable = getAiCreatedRecipePreferences({
      ...preferences,
      calorieCeiling: 500,
      nutritiousChoice: true,
      highOmega3: true,
      highProtein: true,
      preferredSourceIds: ['bbc-good-food'],
      preferredSupermarkets: ['Tesco']
    });

    expect(applicable.calorieCeiling).toBeNull();
    expect(applicable.nutritiousChoice).toBe(false);
    expect(applicable.highOmega3).toBe(false);
    expect(applicable.highProtein).toBe(false);
    expect(applicable.preferredSourceIds).toEqual([]);
    expect(applicable.preferredSupermarkets).toEqual([]);
    expect(validateInternalDinnerChoices([validChoice], { ...preferences, calorieCeiling: 500 })).toHaveLength(1);
  });

  it('rejects unmeasured or imperial ingredient lists and implausible price estimates', () => {
    const results = validateInternalDinnerChoices([
      { ...validChoice, title: 'Unmeasured lentils', ingredients: ['Lentils', 'Pepper', 'Spinach', 'Yoghurt'] },
      { ...validChoice, title: 'Imperial lentils', ingredients: ['8 oz lentils', '1 red pepper', '100g spinach', '150g yoghurt'] },
      { ...validChoice, title: 'Overpriced lentils', costPerPortion: '£40.00' }
    ], preferences);

    expect(results).toEqual([]);
  });

  it('rejects unsafe protein steps, unsuitable oven temperatures and timings beyond the saved limit', () => {
    const unrestrictedPreferences = { ...preferences, dietaryRule: 'none' as const, readyToEatUnderMins: 25 };
    const results = validateInternalDinnerChoices([
      { ...validChoice, title: 'Chicken without safety step', ingredients: ['300g chicken', '1 red pepper', '100g spinach', '150g yoghurt'], instructions: ['Fry the chicken.', 'Stir through the vegetables and yoghurt.'], isVegetarian: false, isPescatarian: false },
      { ...validChoice, title: 'Hot traybake', ingredients: ['300g chicken', '1 red pepper', '100g spinach', '150g yoghurt'], instructions: ['Bake at 300°C until piping hot throughout.', 'Serve with the yoghurt.'], isVegetarian: false, isPescatarian: false },
      { ...validChoice, title: 'Slow traybake', ingredients: ['300g chicken', '1 red pepper', '100g spinach', '150g yoghurt'], instructions: ['Bake at 200°C until piping hot throughout.', 'Serve with the yoghurt.'], totalTime: 40, isVegetarian: false, isPescatarian: false }
    ], unrestrictedPreferences);

    expect(results).toEqual([]);
  });
});
