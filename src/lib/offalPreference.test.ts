import { describe, expect, it } from 'vitest';
import type { Recipe } from '../types';
import { itemContainsOffal, queryExplicitlyRequestsOffal } from './offalPreference';

const recipe = (title: string): Recipe => ({
  title,
  description: '',
  ingredients: [],
  instructions: [],
  cuisine: 'British',
  totalTime: 30,
  totalServings: 2,
  saladType: 'none',
  isVegetarian: false,
  isPescatarian: false,
  isVegan: false,
  dietFlagsVerified: true,
});

describe('offal preference helpers', () => {
  it('recognises explicit offal searches', () => {
    expect(queryExplicitlyRequestsOffal('offal recipes')).toBe(true);
    expect(queryExplicitlyRequestsOffal('lamb liver')).toBe(true);
    expect(queryExplicitlyRequestsOffal('heart')).toBe(true);
    expect(queryExplicitlyRequestsOffal('heart recipes')).toBe(true);
    expect(queryExplicitlyRequestsOffal('artichoke hearts')).toBe(false);
    expect(queryExplicitlyRequestsOffal('heart-healthy recipes')).toBe(false);
    expect(queryExplicitlyRequestsOffal('kidney bean chilli')).toBe(false);
  });

  it('recognises offal in generated recipes and products', () => {
    expect(itemContainsOffal(recipe('Liver and onions'))).toBe(true);
    expect(itemContainsOffal(recipe('Slow-cooked lamb heart'))).toBe(true);
    expect(itemContainsOffal(recipe('Artichoke hearts with pasta'))).toBe(false);
    expect(itemContainsOffal(recipe('Kidney bean chilli'))).toBe(false);
  });
});
