/**
 * INGRIDIENT INTERPRETATION RULES & UK ENGLISH NORMALIZER
 * 
 * Rules:
 * - Split on commas and the word 'and'.
 * - Normalise ingredients to singular names in UK English (tomatoes → tomato, red peppers → red pepper).
 * - Treat plurals and spelling variants as equivalent.
 */

export function parseAndNormaliseIngredients(query: string): string[] {
  if (!query || typeof query !== 'string') return [];
  
  // Split on commas and the word 'and' (with word boundaries to avoid matching "hand" or "brand")
  const parts = query.split(/,|\band\b/i);
  
  const results: string[] = [];
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    let normalized = trimmed.toLowerCase();
    
    // Comprehensive spelling and vocabulary mapping to UK English and singular forms
    const vocabularyMap: Record<string, string> = {
      // US and plural variant mapping to singular UK English
      'cilantro': 'coriander',
      'cilantros': 'coriander',
      'coriander leaf': 'coriander',
      'coriander leaves': 'coriander',
      
      'eggplant': 'aubergine',
      'eggplants': 'aubergine',
      
      'zucchini': 'courgette',
      'zucchinis': 'courgette',
      'baby marrow': 'courgette',
      'baby marrows': 'courgette',
      
      'bell pepper': 'pepper',
      'bell peppers': 'pepper',
      'red peppers': 'red pepper',
      'green peppers': 'green pepper',
      'yellow peppers': 'yellow pepper',
      'chili': 'chilli',
      'chilis': 'chilli',
      'chilly': 'chilli',
      'chillies': 'chilli',
      'chili pepper': 'chilli',
      'chili peppers': 'chilli',
      'chilli peppers': 'chilli',
      'chilli pepper': 'chilli',
      
      'scallion': 'spring onion',
      'scallions': 'spring onion',
      'green onion': 'spring onion',
      'green onions': 'spring onion',
      
      'rutabaga': 'swede',
      'rutabagas': 'swede',
      
      'beet': 'beetroot',
      'beets': 'beetroot',
      
      'chickpeas': 'chickpea',
      
      'snow pea': 'mange tout',
      'snow peas': 'mange tout',
      'sugar snap pea': 'mange tout',
      'sugar snap peas': 'mange tout',
      'mange touts': 'mange tout',
      
      'shrimp': 'prawn',
      'shrimps': 'prawn',
      
      'heavy cream': 'double cream',
      'heavy whipping cream': 'double cream',
      'whipping cream': 'double cream',
      
      'ground beef': 'beef mince',
      'beef minced': 'beef mince',
      'minced beef': 'beef mince',
      
      'ground pork': 'pork mince',
      'pork minced': 'pork mince',
      'minced pork': 'pork mince',
      
      'ground lamb': 'lamb mince',
      'lamb minced': 'lamb mince',
      'minced lamb': 'lamb mince',
      
      'ground turkey': 'turkey mince',
      'turkey minced': 'turkey mince',
      'minced turkey': 'turkey mince',
      
      'tinned tomatoes': 'tinned tomato',
      'chopped tomatoes': 'chopped tomato',
      'plum tomatoes': 'plum tomato',
      'cherry tomatoes': 'cherry tomato',
      'beef tomatoes': 'beef tomato',
      'roma tomatoes': 'roma tomato',
      'tomatoes': 'tomato',
      
      'potatoes': 'potato',
      'sweet potatoes': 'sweet potato',
      'new potatoes': 'new potato',
      'roast potatoes': 'roast potato',
      
      'onions': 'onion',
      'red onions': 'red onion',
      'white onions': 'white onion',
      
      'garlic cloves': 'garlic clove',
      'garlics': 'garlic',
      
      'mushrooms': 'mushroom',
      'chestnut mushrooms': 'chestnut mushroom',
      'button mushrooms': 'button mushroom',
      'wild mushrooms': 'wild mushroom',
      
      'chicken breasts': 'chicken breast',
      'chicken thighs': 'chicken thigh',
      'chicken wings': 'chicken wing',
      'chicken legs': 'chicken leg',
      
      'pork chops': 'pork chop',
      'lamb chops': 'lamb chop',
      
      'sausages': 'sausage',
      'pork sausages': 'pork sausage',
      
      'lentils': 'lentil',
      'red lentils': 'red lentil',
      'green lentils': 'green lentil',
      
      'beans': 'bean',
      'kidney beans': 'kidney bean',
      'black beans': 'black bean',
      'cannellini beans': 'cannellini bean',
      'haricot beans': 'haricot bean',
      'baked beans': 'baked bean',
      'green beans': 'green bean',
      
      'eggs': 'egg',
      'lime juice': 'lime',
      'lemon juice': 'lemon',
    };
    
    // Try vocab mapping first
    if (vocabularyMap[normalized]) {
      normalized = vocabularyMap[normalized];
    } else {
      // 1. If compound term, split and handle singulars or sub-vocab mapping
      const words = normalized.split(/\s+/);
      const singularizedWords = words.map((word, index) => {
        // Skip last word check if it's already a matching sub-element
        if (vocabularyMap[word]) return vocabularyMap[word];
        
        let sing = word;
        if (sing.endsWith('oes')) {
          sing = sing.slice(0, -2); // tomatoes -> tomato
        } else if (sing.endsWith('ies')) {
          sing = sing.slice(0, -3) + 'y'; // strawberries -> strawberry
        } else if (sing.endsWith('s') && !sing.endsWith('ss') && !sing.endsWith('as') && !sing.endsWith('us') && !sing.endsWith('is')) {
          sing = sing.slice(0, -1); // peppers -> pepper
        }
        return vocabularyMap[sing] || sing;
      });
      
      normalized = singularizedWords.join(' ');
      
      // Fallback post-processed mapping
      if (vocabularyMap[normalized]) {
        normalized = vocabularyMap[normalized];
      }
    }
    
    const finalClean = normalized.trim();
    if (finalClean && !results.includes(finalClean)) {
      results.push(finalClean);
    }
  }
  
  return results;
}

// A cautious vocabulary for short ingredient searches without commas or
// joining words. This lets searches such as "cod potatoes" behave like
// ingredient lists without treating ordinary dish names such as "chicken
// curry" as strict ingredient searches.
const UNSEPARATED_INGREDIENT_TERMS = new Set([
  'anchovy', 'apple', 'aubergine', 'avocado', 'bacon', 'banana', 'bean',
  'beef', 'broccoli', 'cabbage', 'carrot', 'cauliflower', 'celery', 'cheese',
  'chickpea', 'chicken', 'chilli', 'chorizo', 'cod', 'courgette', 'cucumber',
  'egg', 'fish', 'flour', 'garlic', 'ginger', 'ham', 'haddock', 'kale', 'leek',
  'lentil', 'lemon', 'lime', 'mackerel', 'mushroom', 'noodle', 'oat', 'onion',
  'pasta', 'pea', 'pepper', 'prawn', 'potato', 'pork', 'rice', 'salmon',
  'sausage', 'spinach', 'squash', 'steak', 'sweetcorn', 'tofu', 'tomato',
  'tuna', 'turkey', 'turnip', 'yogurt', 'yoghurt'
]);

export function detectIngredientIntent(query: string): {
  isIngredientLed: boolean;
  ingredients: string[];
  reason: 'list' | 'phrase' | 'short-food-list';
} | null {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const ingredientPhrases = /\b(i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only|what can i make with|what can i cook with)\b/i;
  const hasListPunctuation = /[,;]/.test(trimmed);
  const hasSimpleAndList = /\b\w+\b\s+\band\b\s+\b\w+\b/i.test(lower) && lower.split(/\s+/).length <= 7;

  const withoutLeadIn = lower
    .replace(/\b(what can i make with|what can i cook with|i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only)\b/gi, '')
    .replace(/[?!.]/g, ' ')
    .trim();

  const ingredients = parseAndNormaliseIngredients(withoutLeadIn || trimmed)
    .map(item => item.replace(/^(some|a bit of|a few|half a|one|two|three)\s+/i, '').trim())
    .filter(item => item.length > 1 && item.split(/\s+/).length <= 3);

  const unseparatedWords = trimmed.split(/\s+/).filter(word => !/^and$/i.test(word));
  const unseparatedIngredients = unseparatedWords.flatMap(word => parseAndNormaliseIngredients(word));
  const isShortUnseparatedIngredientList =
    !hasListPunctuation
    && !ingredientPhrases.test(trimmed)
    && unseparatedWords.length >= 2
    && unseparatedWords.length <= 3
    && unseparatedIngredients.length === unseparatedWords.length
    && unseparatedIngredients.every(ingredient => UNSEPARATED_INGREDIENT_TERMS.has(ingredient));

  if (isShortUnseparatedIngredientList) {
    return { isIngredientLed: true, ingredients: unseparatedIngredients, reason: 'short-food-list' };
  }

  if (ingredients.length >= 2 && ingredientPhrases.test(trimmed)) {
    return { isIngredientLed: true, ingredients, reason: 'phrase' };
  }

  if (ingredients.length >= 2 && hasListPunctuation) {
    return { isIngredientLed: true, ingredients, reason: 'list' };
  }

  if (ingredients.length >= 2 && hasSimpleAndList) {
    return { isIngredientLed: true, ingredients, reason: 'short-food-list' };
  }

  return null;
}

const PANTRY_STAPLE_PATTERN = /^(?:water|salt|pepper|black pepper|white pepper|oil|olive oil|vegetable oil|sunflower oil|rapeseed oil|cooking spray|seasoning|mixed herbs?|dried herbs?|fresh herbs?|herbs?|spices?)$/i;
const INGREDIENT_MODIFIER_PATTERN = /^(?:a|an|the|fresh|frozen|tinned|canned|dried|cooked|raw|large|medium|small|baby|new|free[- ]range|boneless|skinless|lean|smoked|unsmoked|cured|grated|chopped|diced|sliced|quartered|halved|mashed|boiled|roasted|baked|trimmed|drained)$/i;

const INGREDIENT_VARIANT_WORDS: Record<string, Set<string>> = {
  pork: new Set(['mince', 'chop', 'loin', 'shoulder', 'belly', 'fillet', 'sausage']),
  onion: new Set(['red', 'white', 'spring']),
  potato: new Set(['new', 'roast']),
  tomato: new Set(['cherry', 'plum', 'beef', 'tinned', 'chopped']),
  pepper: new Set(['red', 'green', 'yellow', 'bell']),
  chicken: new Set(['breast', 'thigh', 'wing', 'leg']),
  beef: new Set(['mince', 'steak', 'shin', 'brisket']),
  lamb: new Set(['mince', 'chop', 'shoulder', 'leg']),
  turkey: new Set(['mince', 'breast', 'thigh']),
};

const stripIngredientQuantity = (value: string) => value
  .replace(/^\s*[\d¼½¾⅓⅔⅛⅜⅝⅞]+(?:[\d\/\s.-]+)?\s*(?:g|kg|ml|l|oz|lb|tbsp|tsp|tablespoons?|teaspoons?|cups?|cloves?|slices?|pieces?|pcs|cans?|tins?|packets?|packs?|bunches?|sprigs?)?\s*/i, '')
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[•*]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normaliseStrictIngredientLine = (value: string) => {
  const stripped = stripIngredientQuantity(value);
  const parsed = parseAndNormaliseIngredients(stripped);
  return parsed.length > 0 ? parsed : [stripped.toLowerCase()];
};

const isPantryStaple = (value: string) => {
  const normalised = value.trim().toLowerCase();
  return PANTRY_STAPLE_PATTERN.test(normalised)
    || normalised.split(/\s+/).every(word => INGREDIENT_MODIFIER_PATTERN.test(word));
};

const matchesAllowedIngredient = (value: string, allowed: string) => {
  const valueWords = value.toLowerCase().split(/\s+/).filter(Boolean);
  const allowedWords = allowed.toLowerCase().split(/\s+/).filter(Boolean);
  if (valueWords.join(' ') === allowedWords.join(' ')) return true;

  const allowedStart = valueWords.findIndex((_, index) =>
    allowedWords.every((word, offset) => valueWords[index + offset] === word)
  );
  if (allowedStart < 0) return false;

  const remainingWords = valueWords.filter((_, index) =>
    index < allowedStart || index >= allowedStart + allowedWords.length
  );

  const allowedVariantWords = INGREDIENT_VARIANT_WORDS[allowedWords.join(' ')] || new Set<string>();
  return remainingWords.length === 0 || remainingWords.every(word =>
    INGREDIENT_MODIFIER_PATTERN.test(word) || allowedVariantWords.has(word)
  );
};

/**
 * Applies the Search view's strict ingredient option to generated recipe stubs.
 * Pantry staples are allowed, but every other ingredient must be one of the
 * ingredients listed by the user and every listed ingredient must be present.
 */
export function matchesStrictIngredientSearch(item: { ingredients?: string[]; totalIngredientsCount?: number }, query: string): boolean {
  const intent = detectIngredientIntent(query);
  if (!intent?.isIngredientLed || intent.ingredients.length === 0) return true;

  const ingredientLines = Array.isArray(item.ingredients) ? item.ingredients.filter(Boolean) : [];
  if (ingredientLines.length === 0) return false;
  if (typeof item.totalIngredientsCount === 'number' && item.totalIngredientsCount > ingredientLines.length) return false;

  const normalisedLines = ingredientLines.flatMap(normaliseStrictIngredientLine);
  const requestedIngredients = intent.ingredients;

  const includesRequested = requestedIngredients.every(requested =>
    normalisedLines.some(line => matchesAllowedIngredient(line, requested))
  );
  if (!includesRequested) return false;

  return normalisedLines.every(line =>
    isPantryStaple(line) || requestedIngredients.some(requested => matchesAllowedIngredient(line, requested))
  );
}
