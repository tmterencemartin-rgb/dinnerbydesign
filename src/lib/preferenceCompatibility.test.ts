import { describe, expect, it } from 'vitest';
import { dietaryRuleAllowsCookingFat, filterCookingFatsForDiet } from './preferenceCompatibility';

describe('preference compatibility', () => {
  it('blocks lard and dripping for pescatarian and vegetarian diets', () => {
    expect(dietaryRuleAllowsCookingFat('pescatarian', 'Lard/Dripping')).toBe(false);
    expect(dietaryRuleAllowsCookingFat('vegetarian', 'Lard/Dripping')).toBe(false);
    expect(filterCookingFatsForDiet('pescatarian', ['Olive oil', 'Lard/Dripping'])).toEqual(['Olive oil']);
  });

  it('blocks animal fats for vegan diets but keeps plant oils', () => {
    expect(filterCookingFatsForDiet('vegan', ['Butter', 'Ghee', 'Lard/Dripping', 'Coconut oil'])).toEqual(['Coconut oil']);
  });

  it('hides strict Paleo-incompatible fats while keeping compatible choices', () => {
    expect(filterCookingFatsForDiet('paleo', [
      'Butter',
      'Coconut oil',
      'Ghee',
      'Lard/Dripping',
      'Olive oil',
      'Vegetable oil'
    ])).toEqual(['Coconut oil', 'Lard/Dripping', 'Olive oil']);
  });

  it('allows all cooking fats when no incompatible diet is active', () => {
    expect(filterCookingFatsForDiet('none', ['Butter', 'Lard/Dripping', 'Olive oil'])).toEqual(['Butter', 'Lard/Dripping', 'Olive oil']);
  });
});
