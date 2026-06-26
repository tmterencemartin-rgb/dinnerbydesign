import { describe, it, expect } from 'vitest';
import { convertIngredient, parseNumber, formatNumber } from './measurementUtils';

describe('measurementUtils', () => {
  describe('parseNumber', () => {
    it('parses standard numbers', () => {
      expect(parseNumber('200')).toBe(200);
      expect(parseNumber('1.5')).toBe(1.5);
    });

    it('parses fractional numbers', () => {
      expect(parseNumber('1/2')).toBe(0.5);
      expect(parseNumber('1 1/2')).toBe(1.5);
      expect(parseNumber('3/4')).toBe(0.75);
    });
  });

  describe('formatNumber', () => {
    it('formats metric numbers sensibly', () => {
      expect(formatNumber(198, false)).toBe('200');
      expect(formatNumber(1.5, false)).toBe('1.5');
      expect(formatNumber(10, false)).toBe('10');
    });

    it('formats imperial numbers as elegant fractions', () => {
      expect(formatNumber(7.05, true)).toBe('7');
      expect(formatNumber(1.5, true)).toBe('1 ½');
      expect(formatNumber(0.25, true)).toBe('¼');
      expect(formatNumber(0.75, true)).toBe('¾');
      expect(formatNumber(2.25, true)).toBe('2 ¼');
    });
  });

  describe('convertIngredient', () => {
    it('converts metric weight to imperial weight', () => {
      expect(convertIngredient('200g of pasta', 'imperial')).toBe('7 oz of pasta');
      expect(convertIngredient('1kg potatoes', 'imperial')).toBe('2 ¼ lbs potatoes');
    });

    it('converts metric volume to imperial volume', () => {
      expect(convertIngredient('250ml milk', 'imperial')).toBe('1 cup milk');
      expect(convertIngredient('1l of vegetable stock', 'imperial')).toBe('1 ¾ pint of vegetable stock');
    });

    it('converts imperial units to metric units', () => {
      expect(convertIngredient('7oz cooked chicken', 'metric')).toBe('200g cooked chicken');
      expect(convertIngredient('1 lb minced beef', 'metric')).toBe('455g minced beef');
      expect(convertIngredient('1 cup of cream', 'metric')).toBe('250ml of cream');
    });

    it('leaves other text intact', () => {
      expect(convertIngredient('3 medium eggs', 'imperial')).toBe('3 medium eggs');
      expect(convertIngredient('1 tbsp olive oil', 'imperial')).toBe('1 tbsp olive oil');
    });
  });
});
