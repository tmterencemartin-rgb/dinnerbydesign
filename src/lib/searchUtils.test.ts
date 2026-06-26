import { describe, it, expect } from 'vitest';
import { buildSearchParams, cleanSearchParams } from './searchUtils';
import { UserPreferences, DinnerSource } from '../types';

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
      preferredSourceIds: []
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
});
