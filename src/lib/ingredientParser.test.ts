import { describe, test, expect } from 'vitest';
import { detectIngredientIntent, matchesStrictIngredientSearch, parseAndNormaliseIngredients } from './ingredientParser';

describe('Ingredient Parser & Normalizer', () => {
  test('splits on commas and the word-and', () => {
    const input = 'red peppers, rice and tomatoes';
    const result = parseAndNormaliseIngredients(input);
    expect(result).toEqual(['red pepper', 'rice', 'tomato']);
  });

  test('normalises plural nouns to singular forms', () => {
    expect(parseAndNormaliseIngredients('tomatoes')).toEqual(['tomato']);
    expect(parseAndNormaliseIngredients('potatoes')).toEqual(['potato']);
    expect(parseAndNormaliseIngredients('onions')).toEqual(['onion']);
    expect(parseAndNormaliseIngredients('carrots')).toEqual(['carrot']);
    expect(parseAndNormaliseIngredients('spiced sausages')).toEqual(['spiced sausage']);
  });

  test('converts US terms and local spelling variations to UK English', () => {
    expect(parseAndNormaliseIngredients('zucchini')).toEqual(['courgette']);
    expect(parseAndNormaliseIngredients('zucchinis')).toEqual(['courgette']);
    expect(parseAndNormaliseIngredients('eggplants')).toEqual(['aubergine']);
    expect(parseAndNormaliseIngredients('cilantro')).toEqual(['coriander']);
    expect(parseAndNormaliseIngredients('shrimps')).toEqual(['prawn']);
    expect(parseAndNormaliseIngredients('chilis')).toEqual(['chilli']);
    expect(parseAndNormaliseIngredients('chillies')).toEqual(['chilli']);
    expect(parseAndNormaliseIngredients('ground beef')).toEqual(['beef mince']);
  });

  test('handles double and single plural compounds elegantly', () => {
    expect(parseAndNormaliseIngredients('red peppers, green onions')).toEqual(['red pepper', 'spring onion']);
  });

  test('handles clean array when query is empty or invalid', () => {
    expect(parseAndNormaliseIngredients('')).toEqual([]);
    expect(parseAndNormaliseIngredients('   ')).toEqual([]);
  });

  test('detects comma-separated ingredient searches', () => {
    expect(detectIngredientIntent('chicken, spinach and rice')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['chicken', 'spinach', 'rice'],
      reason: 'list'
    });
  });

  test('detects natural ingredient-led phrases', () => {
    expect(detectIngredientIntent('I have chicken, spinach and rice')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['chicken', 'spinach', 'rice'],
      reason: 'phrase'
    });
  });

  test('does not treat ordinary dish names as ingredient-led searches', () => {
    expect(detectIngredientIntent('chicken curry')).toBeNull();
    expect(detectIngredientIntent('chilli')).toBeNull();
    expect(detectIngredientIntent('chilli recipe')).toBeNull();
    expect(detectIngredientIntent('Jamie Oliver pasta')).toBeNull();
  });

  test('enforces every listed ingredient and rejects meaningful extras in strict mode', () => {
    expect(matchesStrictIngredientSearch({
      ingredients: ['250g ham', '2 eggs', '500g potatoes', '1 tbsp oil', 'salt', 'pepper']
    }, 'ham, eggs and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['250g ham', '2 eggs', '500g potatoes', '1 onion']
    }, 'ham, eggs and potatoes')).toBe(false);

    expect(matchesStrictIngredientSearch({
      ingredients: ['250g ham', '500g potatoes'],
      totalIngredientsCount: 3
    }, 'ham, eggs and potatoes')).toBe(false);

    expect(matchesStrictIngredientSearch({
      ingredients: ['ham', 'eggs', 'potatoes'],
      totalIngredientsCount: 6
    }, 'ham, eggs and potatoes')).toBe(false);
  });

  test('allows common pantry staples but rejects recipes without an ingredient list', () => {
    expect(matchesStrictIngredientSearch({
      ingredients: ['ham', 'eggs', 'new potatoes', 'olive oil', 'dried herbs']
    }, 'ham and eggs and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({}, 'ham and eggs')).toBe(false);
  });
});
