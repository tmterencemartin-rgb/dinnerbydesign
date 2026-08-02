import { describe, test, expect } from 'vitest';
import { detectIngredientIntent, parseAndNormaliseIngredients } from './ingredientParser';

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
});
