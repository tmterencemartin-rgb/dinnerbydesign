import { describe, test, expect } from 'vitest';
import { detectIngredientIntent, matchesRequestedIngredientSearch, matchesStrictIngredientSearch, parseAndNormaliseIngredients } from './ingredientParser';

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

    expect(detectIngredientIntent('haddock peas')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['haddock', 'pea'],
      reason: 'short-food-list'
    });

    expect(detectIngredientIntent('lamb rice')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['lamb', 'rice'],
      reason: 'short-food-list'
    });
  });

  test('detects a standalone named ingredient search', () => {
    expect(detectIngredientIntent('mackerel')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['mackerel'],
      reason: 'short-food-list'
    });
    expect(matchesRequestedIngredientSearch({ ingredients: ['Mackerel', 'lemon'] }, 'mackerel')).toBe(true);
    expect(matchesRequestedIngredientSearch({ ingredients: ['Chickpea', 'tomato'] }, 'mackerel')).toBe(false);
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

  test('covers common UK beef cuts in short searches', () => {
    const beefCuts = [
      'beef fillet', 'beef sirloin', 'sirloin steak', 'beef ribeye', 'ribeye steak', 'rib steak',
      'striploin steak', 'beef striploin', 'beef rump',
      'beef topside', 'beef silverside', 'top rump', 'thick flank', 'beef chuck',
      'chuck steak', 'chuck roast', 'braising steak', 'stewing steak', 'frying steak', 'minute steak',
      'beef shin', 'beef brisket', 'short rib',
      'beef short rib', 'flank steak', 'skirt steak', 'featherblade', 'featherblade steak',
      'bavette steak', 'onglet steak', 'flat iron', 'flat iron steak', 'hanger steak',
      'beef cheek', 'oxtail', 't-bone steak', 'porterhouse steak', 'tomahawk steak',
      'beef medallion', 'diced beef', 'stewing beef', 'braising beef', 'beef joint',
      'roasting joint', 'beef roasting joint', 'topside joint', 'silverside joint', 'rump joint', 'pot roast'
    ];

    for (const cut of beefCuts) {
      expect(detectIngredientIntent(`${cut} potato`)).toMatchObject({
        isIngredientLed: true,
        reason: 'short-food-list'
      });
    }
  });

  test('interprets silverside as the UK beef cut', () => {
    expect(detectIngredientIntent('silverside')).toMatchObject({
      isIngredientLed: true,
      ingredients: ['beef silverside'],
      reason: 'short-food-list'
    });

    expect(matchesRequestedIngredientSearch({
      ingredients: ['Beef silverside joint', 'potatoes']
    }, 'silverside and potatoes')).toBe(true);

    expect(matchesRequestedIngredientSearch({
      ingredients: ['Silverside fish', 'potatoes']
    }, 'silverside and potatoes')).toBe(false);
  });

  test('covers common bacon and pork variants in short searches', () => {
    const variants = [
      'streaky bacon', 'back bacon', 'smoked bacon', 'unsmoked bacon', 'bacon rashers',
      'bacon lardons', 'bacon medallions', 'pancetta', 'pork belly', 'pork loin',
      'pork tenderloin', 'pork shoulder', 'pork leg', 'pork chops', 'pork steaks',
      'pork ribs', 'pork joint', 'pork roasting joint', 'pork fillet', 'pork medallions',
      'pork knuckle', 'pork hock', 'pork collar', 'pork neck', 'pork escalope',
      'pork schnitzel', 'spare ribs', 'baby back ribs', 'gammon steak', 'gammon joint',
      'roast pork', 'roasting pork', 'pulled pork', 'diced pork'
    ];

    for (const variant of variants) {
      expect(detectIngredientIntent(`${variant} potato`)).toMatchObject({
        isIngredientLed: true,
        reason: 'short-food-list'
      });
    }
  });

  test('covers common chicken compounds in short searches', () => {
    const variants = [
      'chicken breast', 'chicken breast fillet', 'chicken thigh', 'chicken thigh fillet',
      'chicken wing', 'chicken winglet', 'chicken leg', 'chicken fillet', 'chicken tenderloin',
      'chicken tender', 'chicken strip', 'chicken drumstick', 'chicken drumette',
      'chicken quarter', 'chicken leg quarter', 'chicken crown', 'whole chicken',
      'chicken piece', 'chicken portion', 'chicken mince', 'chicken sausage', 'chicken giblet',
      'chicken liver', 'chicken heart', 'chicken neck'
    ];

    for (const variant of variants) {
      expect(detectIngredientIntent(`${variant} potato`)).toMatchObject({
        isIngredientLed: true,
        reason: 'short-food-list'
      });
    }
  });

  test('covers common lamb compounds in short searches', () => {
    const variants = [
      'lamb mince', 'lamb chops', 'lamb shanks', 'lamb shoulder', 'lamb leg',
      'lamb neck', 'lamb loin', 'lamb steak', 'lamb fillet', 'lamb rack',
      'rack of lamb', 'lamb cutlet', 'lamb breast', 'lamb saddle', 'lamb ribs',
      'lamb medallion', 'lamb kebab'
    ];

    for (const variant of variants) {
      expect(detectIngredientIntent(`${variant} rice`)).toMatchObject({
        isIngredientLed: true,
        reason: 'short-food-list'
      });
    }
  });

  test('detects main ingredient families in short searches', () => {
    const ingredients = [
      'lamb', 'turkey', 'duck', 'venison', 'sardines', 'trout', 'scallops', 'mussels',
      'parsnips', 'asparagus', 'pak choi', 'butternut squash', 'quinoa', 'couscous',
      'pasta', 'spaghetti', 'coriander', 'flat-leaf parsley', 'fresh basil', 'king prawns', 'cheddar cheese',
      'butter', 'milk', 'cheddar', 'almonds', 'walnuts', 'pumpkin seeds'
    ];

    for (const ingredient of ingredients) {
      expect(detectIngredientIntent(`${ingredient} rice`), ingredient).toMatchObject({
        isIngredientLed: true,
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

  test('requires every listed ingredient in ordinary ingredient-led searches', () => {
    expect(matchesRequestedIngredientSearch({
      ingredients: ['green beans', 'garlic', 'chilli']
    }, 'crab and green beans')).toBe(false);

    expect(matchesRequestedIngredientSearch({
      ingredients: ['crab meat', 'green beans', 'garlic', 'chilli']
    }, 'crab and green beans')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['crab meat', 'green beans', 'garlic', 'chilli']
    }, 'crab and green beans')).toBe(false);
  });

  test('allows common pantry staples but rejects recipes without an ingredient list', () => {
    expect(matchesStrictIngredientSearch({
      ingredients: ['ham', 'eggs', 'new potatoes', 'olive oil', 'dried herbs']
    }, 'ham and eggs and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['ham', 'eggs', 'potatoes', 'olive oil', 'sea salt', 'freshly ground black pepper']
    }, 'ham, eggs and potatoes')).toBe(true);

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

  test('recognises bird egg variants without weakening specific egg searches', () => {
    expect(detectIngredientIntent('duck egg and rice')?.ingredients).toEqual(['duck egg', 'rice']);

    expect(matchesStrictIngredientSearch({
      ingredients: ['2 duck eggs', 'rice', 'oil', 'salt']
    }, 'egg and rice')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['2 hen eggs', 'rice', 'oil', 'salt']
    }, 'duck egg and rice')).toBe(false);

    expect(matchesStrictIngredientSearch({
      ingredients: ['2 duck eggs', 'rice', 'oil', 'salt']
    }, 'duck egg and rice')).toBe(true);
  });

  test('recognises and enforces skin and bone preparation variants', () => {
    expect(detectIngredientIntent('skin on chicken thighs')?.ingredients).toEqual(['chicken thigh']);
    expect(detectIngredientIntent('skin on chicken thighs')?.preparationPreferences).toEqual({ skin: 'on' });
    expect(detectIngredientIntent('skinless chicken thighs')?.preparationPreferences).toEqual({ skin: 'off' });
    expect(detectIngredientIntent('bone-in chicken thighs')?.preparationPreferences).toEqual({ bone: 'in' });
    expect(detectIngredientIntent('boneless chicken thighs')?.preparationPreferences).toEqual({ bone: 'out' });

    expect(matchesRequestedIngredientSearch({
      ingredients: ['skin-on chicken thighs', 'oil', 'salt']
    }, 'skin on chicken thighs')).toBe(true);
    expect(matchesRequestedIngredientSearch({
      ingredients: ['skinless chicken thighs', 'oil', 'salt']
    }, 'skin on chicken thighs')).toBe(false);
    expect(matchesStrictIngredientSearch({
      ingredients: ['boneless chicken thighs', 'oil', 'salt']
    }, 'bone-in chicken thighs')).toBe(false);
    expect(matchesStrictIngredientSearch({
      ingredients: ['bone-in chicken thighs', 'oil', 'salt']
    }, 'bone-in chicken thighs')).toBe(true);
  });

  test('recognises and enforces fish cut-form variants separately from bonelessness', () => {
    expect(detectIngredientIntent('fish filleted')?.ingredients).toEqual(['fish']);
    expect(detectIngredientIntent('fish filleted')?.preparationPreferences).toEqual({ fishForm: 'filleted' });
    expect(detectIngredientIntent('whole salmon')?.preparationPreferences).toEqual({ fishForm: 'whole' });
    expect(detectIngredientIntent('tuna steaks and rice')?.preparationPreferences).toEqual({ fishForm: 'steak' });

    expect(matchesRequestedIngredientSearch({
      ingredients: ['salmon fillets', 'potatoes', 'oil']
    }, 'fish filleted and potatoes')).toBe(true);
    expect(matchesRequestedIngredientSearch({
      ingredients: ['whole salmon', 'potatoes', 'oil']
    }, 'fish filleted and potatoes')).toBe(false);
    expect(matchesStrictIngredientSearch({
      ingredients: ['tuna steaks', 'rice', 'oil']
    }, 'tuna steaks and rice')).toBe(true);
    expect(matchesStrictIngredientSearch({
      ingredients: ['tuna fillets', 'rice', 'oil']
    }, 'tuna steaks and rice')).toBe(false);
    expect(matchesStrictIngredientSearch({
      ingredients: ['salmon fillets', 'rice', 'oil']
    }, 'salmon fillets and rice')).toBe(true);
  });

  test('allows common fish and sausage forms in strict ingredient searches', () => {
    expect(matchesRequestedIngredientSearch({
      ingredients: ['plaice fillets', 'potatoes', 'green beans']
    }, 'plaice potatoes green beans')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['plaice fillets', 'potatoes', 'green beans', 'lemon']
    }, 'plaice potatoes green beans')).toBe(false);

    expect(matchesStrictIngredientSearch({
      ingredients: ['2 salmon fillets', '500g mashed potatoes', 'oil', 'salt', 'pepper']
    }, 'salmon and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['pork sausages', 'butter beans', 'oil', 'pepper']
    }, 'sausage butter beans')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['beef sirloin steak', 'potatoes', 'oil', 'salt']
    }, 'beef and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['sirloin steak', 'potatoes', 'oil', 'salt']
    }, 'sirloin and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['bavette steak', 'potatoes', 'oil', 'salt']
    }, 'bavette and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['hanger steak', 'potatoes', 'oil', 'salt']
    }, 'hanger and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['streaky bacon', 'potatoes', 'oil', 'salt']
    }, 'bacon and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['roast pork', 'potatoes', 'oil', 'salt']
    }, 'pork and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['pork loin steak', 'potatoes', 'oil', 'salt']
    }, 'pork loin and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['chicken breast fillet', 'potatoes', 'oil', 'salt']
    }, 'chicken breast and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['chicken drumsticks', 'potatoes', 'oil', 'salt']
    }, 'chicken and potatoes')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['haddock fillets', 'peas', 'rice', 'oil']
    }, 'haddock peas')).toBe(false);

    expect(matchesStrictIngredientSearch({
      ingredients: ['lamb shoulder', 'brown rice', 'olive oil', 'salt']
    }, 'lamb rice')).toBe(true);

    expect(matchesStrictIngredientSearch({
      ingredients: ['lamb shoulder', 'brown rice', 'onion', 'olive oil']
    }, 'lamb rice')).toBe(false);
  });
});
