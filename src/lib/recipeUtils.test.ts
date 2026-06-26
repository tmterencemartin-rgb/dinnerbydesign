import { describe, it, expect } from 'vitest';
import { getRecipeKey, isSameRecipe, getSourceUrl } from './recipeUtils';
import { Recipe, ReadyMeal, SavedRecipe } from '../types';

describe('recipeUtils', () => {
  describe('getRecipeKey', () => {
    it('generates different keys for same title but different mode', () => {
      const cookItem = { title: 'Chicken Curry', cuisine: 'Indian' } as Recipe;
      const readyItem = { title: 'Chicken Curry', cuisine: 'Indian', retailer: 'Tesco' } as ReadyMeal;
      
      const cookKey = getRecipeKey(cookItem);
      const readyKey = getRecipeKey(readyItem);
      
      expect(cookKey).not.toBe(readyKey);
      expect(cookKey).toContain('cook');
      expect(readyKey).toContain('ready-made');
    });

    it('generates different keys for same title and mode but different cuisine', () => {
      const item1 = { title: 'Spicy Rice', cuisine: 'Mexican' } as Recipe;
      const item2 = { title: 'Spicy Rice', cuisine: 'Thai' } as Recipe;
      
      expect(getRecipeKey(item1)).not.toBe(getRecipeKey(item2));
    });

    it('is stable given the same input object', () => {
      const item = { title: 'Pasta', cuisine: 'Italian' } as Recipe;
      const key1 = getRecipeKey(item);
      const key2 = getRecipeKey(item);
      
      expect(key1).toBe(key2);
    });

    it('respects existing recipeId if present', () => {
      const item = { title: 'Pasta', cuisine: 'Italian', recipeId: 'custom-id' } as any;
      expect(getRecipeKey(item)).toBe('custom-id');
    });
  });

  describe('isSameRecipe', () => {
    it('returns true for items with the same key', () => {
      const item1 = { title: 'Pasta', cuisine: 'Italian' } as Recipe;
      const item2 = { title: 'Pasta', cuisine: 'Italian' } as Recipe;
      
      expect(isSameRecipe(item1, item2)).toBe(true);
    });

    it('returns false for items with different keys', () => {
      const item1 = { title: 'Pasta', cuisine: 'Italian' } as Recipe;
      const item2 = { title: 'Pizza', cuisine: 'Italian' } as Recipe;
      
      expect(isSameRecipe(item1, item2)).toBe(false);
    });

    it('handles null/undefined inputs', () => {
      expect(isSameRecipe(null, undefined)).toBe(false);
      expect(isSameRecipe({ title: 'A', cuisine: 'B' } as any, null)).toBe(false);
    });
  });

  describe('getSourceUrl', () => {
    it('returns original URL for genuine links', () => {
      const url = 'https://www.bbcgoodfood.com/recipes/chicken-curry';
      const item = { sourceUrl: url };
      expect(getSourceUrl(item)).toBe(url);
    });

    it('returns null for google search fallbacks', () => {
      const url = 'https://www.google.com/search?q=chicken+curry+recipe';
      const item = { sourceUrl: url };
      expect(getSourceUrl(item)).toBe(null);
    });

    it('returns null if sourceUrl is missing', () => {
      expect(getSourceUrl({})).toBe(null);
    });
  });
});
