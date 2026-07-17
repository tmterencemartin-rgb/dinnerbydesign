import { describe, expect, it } from 'vitest';
import { SavedRecipe, UserPreferences } from '../types';
import {
  createWeeklyDinnerPlan,
  filterAndSortSavedRecipes,
  findCostSavingSwaps,
  parseIngredientLine,
} from './plannerUtils';

const baseRecipe = (overrides: Partial<SavedRecipe>): SavedRecipe => ({
  id: overrides.id || overrides.title?.toLowerCase().replace(/\s+/g, '-') || 'recipe',
  recipeId: overrides.recipeId || overrides.id || 'recipe',
  title: overrides.title || 'Recipe',
  description: overrides.description || '',
  cuisine: overrides.cuisine || 'Dinner',
  mode: overrides.mode || 'cook',
  savedAt: overrides.savedAt || null,
  userId: 'user-1',
  ...overrides,
});

const preferences: UserPreferences = {
  dietaryRule: 'none',
  saladPreference: 'all',
  allergies: [],
  nutritiousChoice: false,
  isSimple: false,
  isLowCost: false,
  highOmega3: false,
  highProtein: false,
  servings: 2,
  calorieCeiling: null,
  budgetLimit: null,
  exclusions: [],
  cuisinePreferences: [],
  religiousEthical: [],
  cookingMethods: [],
  cookingFats: [],
  readyToEatUnderMins: null,
  preferredSupermarkets: [],
  preferredSourceIds: [],
  preferredMode: 'cook',
  customCuisines: [],
};

describe('plannerUtils', () => {
  it('parses ingredient quantity and name for the planner detail view', () => {
    expect(parseIngredientLine('- 250g potatoes')).toEqual({
      qtyUnit: '250g',
      name: 'potatoes',
    });
  });

  it('filters saved recipes by search, quick pills, scheduled state and convenience profile', () => {
    const recipes = [
      baseRecipe({
        title: 'Quick Lentil Pasta',
        description: 'simple lentil pasta',
        totalTime: 18,
        costPerPortion: '£1.80',
        caloriesPerPortion: 420,
        isNutritious: true,
        isVegetarian: true,
        mainProtein: 'lentils',
        ingredients: ['lentils', 'tomatoes', 'pasta'],
        convenienceProfile: 'scratch',
      }),
      baseRecipe({
        title: 'Ready Lasagne',
        description: 'supermarket dinner',
        totalTime: 10,
        price: '£3.50',
        convenienceProfile: 'convenience',
      }),
      baseRecipe({
        title: 'Scheduled Pasta',
        description: 'already on the week',
        totalTime: 12,
        costPerPortion: '£1.20',
        scheduledDate: 'monday',
        convenienceProfile: 'scratch',
      }),
    ];

    const result = filterAndSortSavedRecipes({
      recipes,
      preferences,
      searchQuery: 'pasta',
      quickPills: {
        under20: true,
        vegetarian: true,
        highProtein: true,
        batch: false,
      },
      convenienceFilter: 'scratch',
      sortBy: 'quickest',
    });

    expect(result.map(recipe => recipe.title)).toEqual(['Quick Lentil Pasta']);
  });

  it('keeps saved dinners visible even when they conflict with current preferences', () => {
    const result = filterAndSortSavedRecipes({
      recipes: [
        baseRecipe({
          title: 'Chicken Traybake',
          description: 'saved before preferences changed',
          mainProtein: 'chicken',
          ingredients: ['chicken', 'potatoes'],
          dietFlagsVerified: true,
          isVegetarian: false,
        }),
      ],
      preferences: {
        ...preferences,
        dietaryRule: 'vegetarian',
      },
      searchQuery: '',
      quickPills: {
        under20: false,
        vegetarian: false,
        highProtein: false,
        batch: false,
      },
      convenienceFilter: 'all',
      sortBy: 'newest',
    });

    expect(result.map(recipe => recipe.title)).toEqual(['Chicken Traybake']);
  });

  it('finds lower-cost unscheduled saved dinners that can replace scheduled dinners', () => {
    const planner = [
      baseRecipe({
        id: 'scheduled',
        title: 'Expensive Dinner',
        scheduledDate: 'tuesday',
        costPerPortion: '£4.50',
        requestedServings: 2,
      }),
    ];
    const savedRecipes = [
      baseRecipe({
        id: 'cheap',
        title: 'Cheaper Dinner',
        costPerPortion: '£2.50',
        requestedServings: 2,
      }),
      baseRecipe({
        id: 'already-planned',
        title: 'Already Planned',
        scheduledDate: 'friday',
        costPerPortion: '£1.50',
        requestedServings: 2,
      }),
    ];

    const swaps = findCostSavingSwaps({
      planner,
      savedRecipes,
      preferences,
      servings: 2,
    });

    expect(swaps).toHaveLength(1);
    expect(swaps[0].replacement.title).toBe('Cheaper Dinner');
    expect(swaps[0].saving).toBe(4);
  });

  it('creates a mixed weekly plan from generated homemade and ready-made dinners', async () => {
    const generatedQueries: string[] = [];
    const result = await createWeeklyDinnerPlan({
      settings: {
        dinnerCount: 3,
        budget: '30',
        servings: 2,
        protein: 'mixed',
        time: 'under30',
        homemadeCount: 2,
      },
      planner: [
        baseRecipe({
          title: 'Existing Pasta',
          scheduledDate: 'monday',
        }),
      ],
      preferences,
      generateDinnerSuggestions: async params => {
        generatedQueries.push(params.query);
        if (params.source === 'ready-made') {
          return {
            readyMeals: [
              {
                title: 'Ready Curry',
                description: 'supermarket curry',
                retailer: 'Tesco',
                price: '£3.00',
                cuisine: 'Indian',
                totalTime: 10,
                saladType: 'none',
                isVegetarian: false,
                isPescatarian: false,
                isVegan: false,
                dietFlagsVerified: true,
              },
            ],
          };
        }

        return {
          recipes: [
            {
              title: 'Chicken Traybake',
              description: 'easy dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'British',
              totalServings: 2,
              totalTime: 25,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: false,
              isVegan: false,
              dietFlagsVerified: true,
            },
            {
              title: 'Fish Rice Bowl',
              description: 'quick dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'Asian',
              totalServings: 2,
              totalTime: 20,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: true,
              isVegan: false,
              dietFlagsVerified: true,
            },
          ],
        };
      },
      addLog: () => {},
    });

    expect(result.alert).toBeNull();
    expect(result.dinners.map(item => item.title)).toEqual([
      'Chicken Traybake',
      'Fish Rice Bowl',
      'Ready Curry',
    ]);
    expect(generatedQueries[0]).toContain('2 cooked dinners');
    expect(generatedQueries[1]).toContain('1 UK supermarket ready-made dinner products');
  });

  it('applies the affordability pilot priorities to weekly generation', async () => {
    let capturedQuery = '';
    let capturedLowCost = false;

    const result = await createWeeklyDinnerPlan({
      settings: {
        dinnerCount: 3,
        budget: '24',
        servings: 4,
        protein: 'mixed',
        time: 'any',
        homemadeCount: 3,
        minimiseCost: true,
        reuseIngredients: true,
      },
      planner: [],
      preferences,
      generateDinnerSuggestions: async params => {
        capturedQuery = params.query;
        capturedLowCost = params.isLowCost === true;
        return {
          recipes: ['One', 'Two', 'Three'].map((title) => ({
            title,
            description: 'Affordable dinner',
            ingredients: ['onion', 'carrot'],
            instructions: ['Cook'],
            cuisine: 'British',
            totalServings: 4,
            totalTime: 30,
            saladType: 'none' as const,
            isVegetarian: true,
            isPescatarian: true,
            isVegan: true,
            dietFlagsVerified: true,
          })),
        };
      },
      addLog: () => {},
    });

    expect(capturedLowCost).toBe(true);
    expect(capturedQuery).toContain('lowest credible full-shop cost');
    expect(capturedQuery).toContain('reuse core ingredients and opened packs');
    expect(result.selectionSummary).toContain('lower shopping cost and ingredient reuse');
  });

  it('passes no-preference protein and under 45 minute timing into weekly planning params', async () => {
    let capturedQuery = '';
    let capturedMaxTime: number | undefined;

    const result = await createWeeklyDinnerPlan({
      settings: {
        dinnerCount: 3,
        budget: '30',
        servings: 2,
        protein: 'no-preference',
        time: 'under45',
        homemadeCount: 3,
      },
      planner: [],
      preferences,
      generateDinnerSuggestions: async params => {
        if (!capturedQuery) capturedQuery = params.query;
        capturedMaxTime = params.maxTotalTime;
        return {
          recipes: [
            {
              title: 'Flexible Dinner',
              description: 'easy dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'Dinner',
              totalServings: 2,
              totalTime: 40,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: false,
              isVegan: false,
              dietFlagsVerified: true,
            },
            {
              title: 'Flexible Dinner Two',
              description: 'easy dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'Dinner',
              totalServings: 2,
              totalTime: 35,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: false,
              isVegan: false,
              dietFlagsVerified: true,
            },
            {
              title: 'Flexible Dinner Three',
              description: 'easy dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'Dinner',
              totalServings: 2,
              totalTime: 30,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: false,
              isVegan: false,
              dietFlagsVerified: true,
            },
          ],
        };
      },
      addLog: () => {},
    });

    expect(result.dinners.map(item => item.title)).toEqual([
      'Flexible Dinner',
      'Flexible Dinner Two',
      'Flexible Dinner Three',
    ]);
    expect(capturedQuery).toContain('any suitable protein');
    expect(capturedQuery).toContain('dinners under 45 minutes');
    expect(capturedMaxTime).toBe(45);
  });

  it('passes multiple selected proteins into weekly planning params', async () => {
    let capturedQuery = '';

    const result = await createWeeklyDinnerPlan({
      settings: {
        dinnerCount: 5,
        budget: '45',
        servings: 2,
        protein: ['chicken', 'seafood', 'vegetarian', 'beef', 'pulses'],
        time: 'any',
        homemadeCount: 5,
      },
      planner: [],
      preferences,
      generateDinnerSuggestions: async params => {
        if (!capturedQuery) capturedQuery = params.query;
        return {
          recipes: [
            {
              title: 'Varied Dinner',
              description: 'weekly dinner',
              ingredients: [],
              instructions: [],
              cuisine: 'Dinner',
              totalServings: 2,
              totalTime: 35,
              saladType: 'none',
              isVegetarian: false,
              isPescatarian: false,
              isVegan: false,
              dietFlagsVerified: true,
            },
          ],
        };
      },
      addLog: () => {},
    });

    expect(result.dinners.map(item => item.title)).toEqual(['Varied Dinner']);
    expect(capturedQuery).toContain('varied proteins across the week');
    expect(capturedQuery).toContain('chicken');
    expect(capturedQuery).toContain('fish and seafood');
    expect(capturedQuery).toContain('vegetarian');
    expect(capturedQuery).toContain('beef');
    expect(capturedQuery).toContain('pulses');
  });

  it('falls back to focused weekly searches and returns a shortage alert', async () => {
    const warnings: string[] = [];
    let calls = 0;

    const result = await createWeeklyDinnerPlan({
      settings: {
        dinnerCount: 3,
        budget: '15',
        servings: 2,
        protein: 'vegetarian',
        time: 'quick',
        homemadeCount: 3,
      },
      planner: [],
      preferences,
      generateDinnerSuggestions: async params => {
        calls += 1;
        if (calls === 1) throw new Error('temporary provider issue');
        if (params.source === 'cook' && calls === 2) {
          return {
            recipes: [
              {
                title: 'Vegetarian Beans',
                description: 'fallback dinner',
                ingredients: [],
                instructions: [],
                cuisine: 'Dinner',
                totalServings: 2,
                totalTime: 15,
                saladType: 'none',
                isVegetarian: true,
                isPescatarian: true,
                isVegan: false,
                dietFlagsVerified: true,
              },
            ],
          };
        }
        return { recipes: [] };
      },
      addLog: message => warnings.push(message),
    });

    expect(result.dinners.map(item => item.title)).toEqual(['Vegetarian Beans']);
    expect(result.alert).toContain('Only 1 suitable dinner was found');
    expect(warnings[0]).toContain('weekly batch generation failed');
  });
});
