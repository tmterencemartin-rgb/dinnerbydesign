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

  test('detects ingredient lists with natural strict-search wording', () => {
    expect(detectIngredientIntent('salmon and potatoes only')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['salmon', 'potato'],
      reason: 'short-food-list'
    });
  });

  test('detects short ingredient searches without separators', () => {
    expect(detectIngredientIntent('cod potatoes')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['cod', 'potato'],
      reason: 'short-food-list'
    });
  });

  test('detects compound ingredients in short searches without separators', () => {
    expect(detectIngredientIntent('chicken green beans')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['chicken', 'green bean'],
      reason: 'short-food-list'
    });
  });

  test('detects butter beans in short searches without separators', () => {
    expect(detectIngredientIntent('sausage butter beans')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['sausage', 'butter bean'],
      reason: 'short-food-list'
    });
  });

  test('detects common compound ingredient forms in short searches', () => {
    expect(detectIngredientIntent('salmon fillets mashed potatoes')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['salmon fillet', 'mashed potato'],
      reason: 'short-food-list'
    });
    expect(detectIngredientIntent('chicken coconut milk curry paste')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['chicken', 'coconut milk', 'curry paste'],
      reason: 'short-food-list'
    });
  });

  test('covers the supplied compound ingredient catalogue', () => {
    const compounds: Array<[string, string]> = [
      ['beef fillet', 'beef fillet'], ['pork belly', 'pork belly'], ['chicken breast', 'chicken breast'],
      ['lamb shanks', 'lamb shank'], ['duck breast', 'duck breast'], ['tiger prawns', 'tiger prawn'],
      ['king crab', 'king crab'], ['sea bass', 'sea bass'], ['butter beans', 'butter bean'],
      ['kidney beans', 'kidney bean'], ['black beans', 'black bean'], ['chick peas', 'chickpea'],
      ['sweet corn', 'sweetcorn'], ['wild rice', 'wild rice'], ['brown rice', 'brown rice'],
      ['pearl barley', 'pearl barley'], ['bell peppers', 'bell pepper'], ['brussels sprouts', 'brussels sprout'],
      ['sweet potatoes', 'sweet potato'], ['spring onions', 'spring onion'], ['cherry tomatoes', 'cherry tomato'],
      ['sugar snaps', 'sugar snap'], ['baby corn', 'baby corn'], ['lemon grass', 'lemongrass'],
      ['cream cheese', 'cream cheese'], ['sour cream', 'sour cream'], ['goat cheese', 'goat cheese'],
      ['cottage cheese', 'cottage cheese'], ['olive oil', 'olive oil'], ['coconut milk', 'coconut milk'],
      ['buttermilk', 'buttermilk'], ['heavy cream', 'double cream'], ['passion fruit', 'passion fruit'],
      ['dragon fruit', 'dragon fruit'], ['star fruit', 'star fruit'], ['pine nuts', 'pine nut'],
      ['chest nuts', 'chestnut'], ['macadamia nuts', 'macadamia nut']
    ];

    for (const [query, expectedIngredient] of compounds) {
      expect(detectIngredientIntent(`${query} potato`)).toMatchObject({
        isIngredientLed: true,
        ingredients: [expectedIngredient, 'potato'],
        reason: 'short-food-list'
      });
    }
  });

  test('does not treat ordinary dish names as ingredient-led searches', () => {
    expect(detectIngredientIntent('chicken curry')).toBeNull();
    expect(detectIngredientIntent('beef fillet curry')).toBeNull();
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

  test('allows natural variants of listed ingredients but rejects new ingredients', () => {
    expect(matchesStrictIngredientSearch({
      ingredients: ['pork mince', '2 red onions', 'new potatoes', 'oil', 'salt']
    }, 'pork onions and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['pork chops', 'onions', 'potatoes', 'garlic']
    }, 'pork onions and potatoes')).toBe(false);
  });

  test('allows common fish and sausage forms in strict ingredient searches', () => {
    expect(matchesStrictIngredientSearch({
      ingredients: ['2 salmon fillets', '500g mashed potatoes', 'oil', 'salt', 'pepper']
    }, 'salmon and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['pork sausages', 'butter beans', 'oil', 'pepper']
    }, 'sausage butter beans')).toBe(true);
  });
});
