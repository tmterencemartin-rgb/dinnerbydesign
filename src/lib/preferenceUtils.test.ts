import { describe, it, expect } from 'vitest';
import { normaliseUserPreferences, checkNeedsDietConfirmation } from './preferenceUtils';

describe('preferenceUtils', () => {
  describe('normaliseUserPreferences', () => {
    it('maps legacy caloryCeiling to calorieCeiling', () => {
      const legacyData = { caloryCeiling: 500 };
      const normalised = normaliseUserPreferences(legacyData);
      expect(normalised.calorieCeiling).toBe(500);
    });

    it('maps legacy favoriteCuisines/favouriteCuisines to cuisinePreferences', () => {
      const legacyData1 = { favoriteCuisines: ['Italian', 'Mexican'] };
      const normalised1 = normaliseUserPreferences(legacyData1);
      expect(normalised1.cuisinePreferences).toEqual(['Italian', 'Mexican']);

      const legacyData2 = { favouriteCuisines: ['French'] };
      const normalised2 = normaliseUserPreferences(legacyData2);
      expect(normalised2.cuisinePreferences).toEqual(['French']);
    });

    it('migrates broadStyle to cuisinePreferences', () => {
      const legacyData = { broadStyle: 'Mediterranean', favouriteCuisines: ['Italian'] };
      const normalised = normaliseUserPreferences(legacyData);
      expect(normalised.cuisinePreferences).toContain('Mediterranean');
      expect(normalised.cuisinePreferences).toContain('Italian');
    });

    it('converts legacy dietTypes array to dietaryRule', () => {
      const legacyData = { dietTypes: ['Vegan', 'Gluten-Free'] };
      const normalised = normaliseUserPreferences(legacyData);
      expect(normalised.dietaryRule).toBe('vegan');
    });

    it('migrates legacy religiousEthical values', () => {
      const legacyData = { religiousEthical: ['Kosher', 'Halal', 'Fair Trade only'] };
      const normalised = normaliseUserPreferences(legacyData);
      expect(normalised.religiousEthical).toEqual(['Kosher-friendly', 'Prefer Halal-certified ingredients where available', 'Prefer Fair Trade ingredients where available']);
    });

    it('migrates legacy Sainsbury\'s to Sainsbury’s', () => {
      const legacyData = { preferredSupermarkets: ['Tesco', 'Sainsbury\'s'] };
      const normalised = normaliseUserPreferences(legacyData);
      expect(normalised.preferredSupermarkets).toEqual(['Tesco', 'Sainsbury’s']);
    });

    it('removes retired published-recipe source preferences', () => {
      const normalised = normaliseUserPreferences({
        preferredSourceIds: ['bbc_good_food', 'waitrose', 'the_telegraph', 'the_times_sunday_times']
      });

      expect(normalised.preferredSourceIds).toEqual([]);
    });

    it('handles missing data with defaults', () => {
      const normalised = normaliseUserPreferences(null);
      expect(normalised.dietaryRule).toBe('none');
      expect(normalised.cuisinePreferences).toEqual([]);
      expect(normalised.calorieCeiling).toBe(null);
      expect(normalised.includeOffal).toBe(false);
    });

    it('preserves an explicit offal preference', () => {
      expect(normaliseUserPreferences({ includeOffal: true }).includeOffal).toBe(true);
      expect(normaliseUserPreferences({ includeOffal: false }).includeOffal).toBe(false);
    });

    it('clears conflicting offal preference for pescatarian users', () => {
      expect(normaliseUserPreferences({ dietaryRule: 'pescatarian', includeOffal: true }).includeOffal).toBe(false);
    });

    it('clears cooking fats that conflict with the dietary rule', () => {
      expect(normaliseUserPreferences({
        dietaryRule: 'vegan',
        cookingFats: ['Olive oil', 'Butter', 'Ghee', 'Lard/Dripping']
      }).cookingFats).toEqual(['Olive oil']);
    });

    it('preserves existing correct fields', () => {
      const data = { dietaryRule: 'vegetarian', calorieCeiling: 800 };
      const normalised = normaliseUserPreferences(data);
      expect(normalised.dietaryRule).toBe('vegetarian');
      expect(normalised.calorieCeiling).toBe(800);
    });
  });

  describe('checkNeedsDietConfirmation', () => {
    it('flags profiles with multiple legacy diet types', () => {
      const data = { dietTypes: ['Vegan', 'Paleo'] };
      expect(checkNeedsDietConfirmation(data)).toBe(true);
    });

    it('does not flag profiles with already migrated dietaryRule', () => {
      const data = { dietaryRule: 'vegan' };
      expect(checkNeedsDietConfirmation(data)).toBe(false);
    });

    it('handles empty/null data', () => {
      expect(checkNeedsDietConfirmation(null)).toBe(false);
      expect(checkNeedsDietConfirmation({})).toBe(false);
    });
  });
});
