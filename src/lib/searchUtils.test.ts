import { describe, it, expect } from 'vitest';
import { buildActiveCriteria, buildSearchParams, cleanSearchParams, detectPreferenceContradiction } from './searchUtils';
import { UserPreferences, DinnerSource } from '../types';
import { DIETARY_TAXONOMY } from '../constants';

describe('searchUtils', () => {
  describe('buildSearchParams', () => {
    const mockPreferences: UserPreferences = {
      dietaryRule: 'vegan',
      saladPreference: 'main-only',
      allergies: ['Nuts'],
      nutritiousChoice: false,
      isSimple: false,
      isLowCost: false,
      highOmega3: false,
      highProtein: false,
      servings: 2,
      calorieCeiling: 600,
      budgetLimit: 5,
      exclusions: [],
      cuisinePreferences: ['Italian'],
      religiousEthical: ['Halal'],
      cookingMethods: ['Oven'],
      cookingFats: ['Olive Oil'],
      readyToEatUnderMins: 30,
      preferredMode: 'cook',
      customCuisines: [],
      preferredSupermarkets: ['Tesco'],
      preferredSourceIds: [],
      includeOffal: false
    };

    it('merges user input and preferences correctly', () => {
      const params = buildSearchParams('Pasta', 'cook', mockPreferences);
      
      expect(params.query).toBe('Pasta');
      expect(params.dietaryRule).toBe('vegan');
      expect(params.exclusions).toContain('Nuts');
      expect(params.maxCalories).toBe(600);
      expect(params.maxCostPerPortion).toBe(5);
    });

    it('respects overrides over preferences', () => {
      const params = buildSearchParams('Pasta', 'cook', mockPreferences, { maxCalories: 400 });
      expect(params.maxCalories).toBe(400);
    });

    it('handles budgetLimit for ready-made source', () => {
      const params = buildSearchParams('Curry', 'ready-made', mockPreferences);
      expect(params.maxPricePerPerson).toBe(5);
      expect(params.maxCostPerPortion).toBeUndefined();
    });

    it('carries saved cuisine and source-appropriate time preferences into params', () => {
      const cookParams = buildSearchParams('Pasta', 'cook', mockPreferences);
      expect(cookParams.cuisines).toEqual(['Italian']);
      expect(cookParams.maxTotalTime).toBe(30);

      const readyMadeParams = buildSearchParams('Curry', 'ready-made', mockPreferences);
      expect(readyMadeParams.maxHeatingTime).toBe(30);
    });

    it('honours explicit empty cuisine and time overrides', () => {
      const params = buildSearchParams('Pasta', 'cook', mockPreferences, {
        cuisines: [],
        maxTotalTime: undefined
      });

      expect(params.cuisines).toBeUndefined();
      expect(params.maxTotalTime).toBeUndefined();
    });

    it('marks ingredient-list searches as ingredient-led for cook mode', () => {
      const params = buildSearchParams('chicken, spinach and rice', 'cook', mockPreferences);
      expect(params.ingredientIntent).toMatchObject({
        isIngredientLed: true,
        ingredients: ['chicken', 'spinach', 'rice']
      });
      expect(params.isLeftoverMode).toBe(true);
    });

    it('keeps strict ingredient matching as a temporary cook-search option', () => {
      const params = buildSearchParams('ham, eggs and potatoes', 'cook', mockPreferences, {
        strictIngredientMatch: true
      });

      expect(params.strictIngredientMatch).toBe(true);
      expect(buildSearchParams('ham curry', 'cook', mockPreferences, {
        strictIngredientMatch: true
      }).strictIngredientMatch).toBeUndefined();
      expect(buildSearchParams('ham, eggs and potatoes', 'ready-made', mockPreferences, {
        strictIngredientMatch: true
      }).strictIngredientMatch).toBeUndefined();
    });

    it('does not mark dish-name searches as ingredient-led', () => {
      const params = buildSearchParams('chicken curry', 'cook', mockPreferences);
      expect(params.ingredientIntent).toBeUndefined();
    });

    it('excludes offal by default and preserves an opt-in preference', () => {
      expect(buildSearchParams('pasta', 'cook', mockPreferences).includeOffal).toBe(false);
      expect(buildSearchParams('pasta', 'cook', { ...mockPreferences, dietaryRule: 'none', includeOffal: true }).includeOffal).toBe(true);
    });

    it('temporarily includes offal for an explicit search without changing other preferences', () => {
      const params = buildSearchParams('liver recipes', 'cook', { ...mockPreferences, dietaryRule: 'none' });
      expect(params.includeOffal).toBe(true);
      expect(mockPreferences.includeOffal).toBe(false);
      expect(params.dietaryRule).toBeUndefined();
    });

    it('keeps offal disabled for pescatarian searches, including explicit offal queries', () => {
      const pescatarianPreferences = { ...mockPreferences, dietaryRule: 'pescatarian' as const, includeOffal: true };
      expect(buildSearchParams('liver recipes', 'cook', pescatarianPreferences).includeOffal).toBe(false);
      expect(buildSearchParams('fish', 'cook', pescatarianPreferences).includeOffal).toBe(false);
    });

    it('removes cooking fats that conflict with the active dietary rule', () => {
      const params = buildSearchParams('pasta', 'cook', {
        ...mockPreferences,
        dietaryRule: 'vegan',
        cookingFats: ['Olive oil', 'Butter', 'Ghee', 'Lard/Dripping']
      });

      expect(params.cookingFats).toEqual(['Olive oil']);
    });

    it('does not treat artichoke hearts as an offal search', () => {
      expect(buildSearchParams('pasta with artichoke hearts', 'cook', mockPreferences).includeOffal).toBe(false);
    });

    it('does not merge preferences for similarity searches', () => {
      const params = buildSearchParams('Pasta', 'cook', mockPreferences, { 
        similarityContext: { title: 'Old Pasta', cuisine: 'Italian', description: 'Old recipe' } 
        });
        
        expect(params.dietaryRule).toBeUndefined();
        expect(params.maxCalories).toBeUndefined();
      });
  });

  describe('cleanSearchParams', () => {
    it('strips null, undefined, and empty values', () => {
      const params = {
        query: 'Pasta',
        dietTypes: [],
        exclusions: null as any,
        maxCalories: undefined,
        isHealthy: true,
        maxCostPerPortion: 0 // Should be kept
      };
      
      const cleaned = cleanSearchParams(params as any);
      
      expect(cleaned).toHaveProperty('query', 'Pasta');
      expect(cleaned).toHaveProperty('isHealthy', true);
      expect(cleaned).toHaveProperty('maxCostPerPortion', 0);
      
      expect(cleaned).not.toHaveProperty('dietTypes');
      expect(cleaned).not.toHaveProperty('exclusions');
      expect(cleaned).not.toHaveProperty('maxCalories');
    });

    it('cleans similarityContext object', () => {
      const params = {
        query: 'Pasta',
        similarityContext: {
          title: 'Old Pasta',
          cuisine: '',
          notes: undefined
        }
      };
      
      const cleaned = cleanSearchParams(params as any);
      expect(cleaned.similarityContext).toEqual({ title: 'Old Pasta' });
    });
  });

  describe('buildActiveCriteria', () => {
    const basePreferences: UserPreferences = {
      dietaryRule: 'vegetarian',
      saladPreference: 'side-only',
      allergies: ['Eggs'],
      nutritiousChoice: true,
      isSimple: true,
      isLowCost: true,
      highOmega3: true,
      highProtein: true,
      servings: 4,
      calorieCeiling: 500,
      budgetLimit: 3,
      exclusions: ['Mushrooms'],
      cuisinePreferences: ['Italian'],
      religiousEthical: ['Halal-friendly'],
      cookingMethods: ['Air fryer'],
      cookingFats: ['Olive oil'],
      readyToEatUnderMins: 25,
      preferredMode: 'cook',
      customCuisines: [],
      preferredSupermarkets: ['Tesco'],
      preferredSourceIds: ['bbc_good_food']
    };

    const buildLabels = (params: any, prefs: UserPreferences | null = basePreferences) =>
      buildActiveCriteria(params, prefs, {
        DIETARY_TAXONOMY,
        suppressedPermanentKeys: []
      }).map(c => c.label);

    it('shows saved preference chips for every major preference category', () => {
      const labels = buildLabels({
        query: 'pasta',
        source: 'cook',
        dietaryRule: 'vegetarian',
        saladPreference: 'side-only'
      });

      expect(labels).toEqual(expect.arrayContaining([
        'Vegetarian',
        'Side salads',
        'No Eggs',
        'No Mushrooms',
        'Halal-friendly',
        'Italian',
        'Air fryer',
        'Olive oil',
        'BBC Good Food',
        'Quick and easy recipes',
        'Wholesome recipes',
        'High Omega-3',
        'Low cost recipes',
        'High Protein',
        'Under 25 mins',
        'Under 500 kcal',
        '4 portions',
        'Under £3/port.'
      ]));
    });

    it('shows temporary allergies as chips even when they are not saved defaults', () => {
      const labels = buildLabels({
        query: 'pasta',
        source: 'cook',
        allergies: ['Eggs']
      }, {
        ...basePreferences,
        dietaryRule: 'none',
        saladPreference: 'all',
        allergies: [],
        exclusions: [],
        religiousEthical: [],
        cuisinePreferences: [],
        cookingMethods: [],
        cookingFats: [],
        preferredSourceIds: [],
        nutritiousChoice: false,
        isSimple: false,
        isLowCost: false,
        highOmega3: false,
        highProtein: false,
        readyToEatUnderMins: null,
        calorieCeiling: null,
        budgetLimit: null,
        servings: 2
      });

      expect(labels).toContain('No Eggs');
    });

    it('does not duplicate strict ingredient matching as a result chip', () => {
      expect(buildLabels({
        query: 'ham, eggs and potatoes',
        source: 'cook',
        strictIngredientMatch: true
      })).not.toContain('Use only listed ingredients');

      expect(buildLabels({
        query: 'ham curry',
        source: 'cook',
        strictIngredientMatch: true
      })).not.toContain('Use only listed ingredients');
    });

    it('does not duplicate temporary chips already covered by saved preferences', () => {
      const labels = buildLabels({
        query: 'pasta',
        source: 'cook',
        allergies: ['Eggs'],
        excludeIngredients: ['mushrooms', 'Leeks', 'leeks'],
        exclusions: ['Mushrooms'],
        cookingMethods: ['Air fryer'],
        cookingFats: ['Olive oil'],
        preferredSourceIds: ['bbc_good_food']
      }, {
        ...basePreferences,
        exclusions: ['Mushrooms', 'Leeks']
      });

      expect(labels.filter(label => label === 'No Eggs')).toHaveLength(1);
      expect(labels.filter(label => label.toLowerCase() === 'no mushrooms')).toHaveLength(1);
      expect(labels.filter(label => label.toLowerCase() === 'no leeks')).toHaveLength(1);
      expect(labels.filter(label => label === 'Air fryer')).toHaveLength(1);
      expect(labels.filter(label => label === 'Olive oil')).toHaveLength(1);
      expect(labels.filter(label => label === 'BBC Good Food')).toHaveLength(1);
    });

    it('hides suppressed saved preferences but keeps unsuppressed ones visible', () => {
      const labels = buildActiveCriteria({
        query: 'pasta',
        source: 'cook',
        dietaryRule: 'vegetarian',
        saladPreference: 'side-only'
      } as any, basePreferences, {
        DIETARY_TAXONOMY,
        suppressedPermanentKeys: ['allergy-Eggs', 'profileExclusion-Mushrooms']
      }).map(c => c.label);

      expect(labels).toContain('Vegetarian');
      expect(labels).toContain('Side salads');
      expect(labels).not.toContain('No Eggs');
      expect(labels).not.toContain('No Mushrooms');
    });
  });

  describe('detectPreferenceContradiction', () => {
    const basePreferences: UserPreferences = {
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
      preferredMode: 'cook',
      customCuisines: [],
      preferredSupermarkets: [],
      preferredSourceIds: []
    };

    it('flags vegetarian searches for beef', () => {
      const conflict = detectPreferenceContradiction({
        query: 'beef stew',
        source: 'cook',
        dietaryRule: 'vegetarian'
      }, basePreferences);

      expect(conflict?.conflictLabel).toBe('Vegetarian');
    });

    it('flags vegan searches for eggs', () => {
      const conflict = detectPreferenceContradiction({
        query: 'egg fried rice',
        source: 'cook',
        dietaryRule: 'vegan'
      }, basePreferences);

      expect(conflict?.conflictLabel).toBe('Vegan');
    });

    it('flags allergy conflicts from saved preferences', () => {
      const conflict = detectPreferenceContradiction({
        query: 'omelette',
        source: 'cook'
      }, {
        ...basePreferences,
        allergies: ['Eggs']
      });

      expect(conflict?.conflictLabel).toBe('No Eggs');
    });

    it('flags common derived and compound allergen terms', () => {
      const cases = [
        ['miso noodles', 'Soybeans'],
        ['scampi', 'Crustaceans'],
        ['oyster sauce', 'Molluscs'],
        ['macadamia chicken', 'Tree nuts'],
        ['barley malt loaf', 'Cereals containing gluten'],
        ['sulphite preservative', 'Sulphur dioxide and sulphites']
      ] as const;

      for (const [query, allergy] of cases) {
        const conflict = detectPreferenceContradiction({
          query,
          source: 'cook'
        }, {
          ...basePreferences,
          allergies: [allergy]
        });

        expect(conflict?.conflictLabel).toBe(`No ${allergy}`);
      }
    });

    it('flags excluded ingredient conflicts', () => {
      const conflict = detectPreferenceContradiction({
        query: 'mushroom risotto',
        source: 'cook'
      }, {
        ...basePreferences,
        exclusions: ['mushroom']
      });

      expect(conflict?.conflictLabel).toBe('No mushroom');
    });

    it('allows searches without obvious conflicts', () => {
      const conflict = detectPreferenceContradiction({
        query: 'vegetable curry',
        source: 'cook',
        dietaryRule: 'vegetarian'
      }, basePreferences);

      expect(conflict).toBeNull();
    });
  });
});
