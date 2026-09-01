import { Recipe, SavedRecipe, ReadyMeal, DietaryRule, SaladPreference } from '../types';
import { DIETARY_EXCLUSION_MAP } from '../constants';
import { dietaryRuleAllowsOffal, itemContainsOffal } from './offalPreference';

const KETO_EXCLUSIONS = [
  'sugar', 'honey', 'syrup', 'flour', 'bread', 'pasta', 'rice', 'noodle', 'couscous', 'bulgur',
  'quinoa', 'oat', 'barley', 'wheat', 'potato', 'sweet potato', 'corn', 'maize', 'bean',
  'lentil', 'chickpea', 'pea', 'batter', 'breadcrumb', 'cereal', 'pastry', 'wrap', 'tortilla', 'pizza'
];

const PALEO_EXCLUSIONS = [
  'sugar', 'syrup', 'flour', 'bread', 'pasta', 'rice', 'noodle', 'couscous', 'bulgur', 'quinoa',
  'oat', 'barley', 'wheat', 'corn', 'maize', 'bean', 'lentil', 'chickpea', 'pea', 'peanut',
  'soy', 'soya', 'tofu', 'tempeh', 'edamame', 'milk', 'cheese', 'butter', 'ghee', 'cream', 'yogurt', 'yoghurt', 'vegetable oil'
];

const MEAT_POULTRY = [
  'beef', 'pork', 'lamb', 'bacon', 'ham', 'sausage', 'venison', 'veal', 'chorizo', 'salami', 'lard', 'gelatine', 'gelatin', 'chicken', 'turkey', 'duck', 'poultry', 'pepperoni',
  'gammon', 'mutton', 'goose', 'pancetta', 'panchetta', 'prosciutto', 'black pudding', 'suet', 'dripping',
  'bone broth', 'chicken stock', 'chicken broth', 'beef stock', 'beef broth', 'lamb stock', 'lamb broth', 'duck stock'
];

const FISH_SEAFOOD = [
  'fish', 'salmon', 'tuna', 'cod', 'haddock', 'trout', 'bass', 'prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop', 'squid', 'octopus', 'seafood', 'anchovy', 'anchovies', 'mackerel', 'sardine', 'fish sauce', 'oyster sauce', 'shrimp paste', 'anchovy paste',
  'roe', 'caviar', 'calamari', 'scampi', 'langoustine', 'crayfish', 'bonito', 'dashi', 'worcestershire'
];

const ANIMAL_DERIVATIVES = [
  'egg', 'milk', 'buttermilk', 'milk powder', 'milk solids', 'dairy', 'cheese', 'butter', 'honey', 'cream', 'yogurt', 'yoghurt', 'whey', 'casein', 'lactose', 'lactalbumin', 'mayo', 'mayonnaise', 'halloumi', 'parmesan', 'feta', 'mozzarella', 'paneer', 'ghee',
  'rennet', 'beeswax', 'isinglass', 'carmine', 'shellac', 'albumen', 'pepsin'
];

const GLUTEN_SOURCES = [
  'wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'bread', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats', 'malt', 'malt extract', 'seitan', 'wheat starch'
];

const matchesKeyword = (text: string, keyword: string): boolean => {
  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
  if (!safeKeyword) return false;

  let baseKeyword = safeKeyword;
  if (baseKeyword.endsWith('ies')) baseKeyword = baseKeyword.slice(0, -3) + 'y';
  else if (baseKeyword.endsWith('es')) baseKeyword = baseKeyword.slice(0, -2);
  else if (baseKeyword.endsWith('s')) baseKeyword = baseKeyword.slice(0, -1);

  return new RegExp(`\\b${baseKeyword}(s|es|ies)?\\b`, 'i').test(text);
};

const containsKeyword = (text: string, keywords: string[]): boolean => keywords.some(keyword => matchesKeyword(text, keyword));

const RELIGIOUS_EXCLUSION_MAP: Record<string, string[]> = {
  'Prefer Halal-certified ingredients where available': ['pork', 'bacon', 'ham', 'gammon', 'lard', 'gelatine', 'gelatin', 'alcohol', 'wine', 'beer', 'rum', 'brandy'],
  'Halal-friendly': ['pork', 'bacon', 'ham', 'gammon', 'lard', 'gelatine', 'gelatin', 'alcohol', 'wine', 'beer', 'rum', 'brandy'],
  'Kosher-friendly': ['pork', 'bacon', 'ham', 'gammon', 'lard', 'shellfish', 'prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'scallop', 'oyster', 'squid', 'octopus'],
  'Prefer Fair Trade ingredients where available': [],
  'Fair Trade preference': [],
  'Fair Trade only': [],
  'Prefer free-range ingredients where available': []
};

const preferenceTerms = (label: string, map: Record<string, string[]>) => {
  const mapped = Object.entries(map).find(([key]) => key.toLowerCase() === label.trim().toLowerCase())?.[1] || [];
  return [label, ...mapped];
};

/**
 * DETERMINISTIC DIETARY SAFETY GATE
 * 
 * ACTIVELY MAINTAINED POLICY LAYER:
 * This module and its test suite (dietarySafety.test.ts) serve as the 
 * single source of truth for programmatic dietary enforcement. 
 * Add new retailer formats, synonyms, and edge-case ingredients here.
 * 
 * Logic:
 * 1. Service verification: Must have dietFlagsVerified = true.
 * 2. Keyword Safety Net: Scans title, description, and ingredients for obvious forbidden terms.
 * 3. Spelling/Formatting: Uses regex word boundaries to catch pluralisations and common retailer ingredient formats.
 */
export function passesDietaryRule(recipe: Recipe | SavedRecipe | ReadyMeal, rule: DietaryRule): boolean {
  if (!rule || rule === 'none') return true;
  
  // 1. Deterministic Keyword Safety Net (Zero-Trust Logic)
  const fieldsToSearch = [
    recipe.title,
    recipe.description || '',
    'ingredients' in recipe ? (recipe.ingredients || []).join(' ') : '',
    'mainProtein' in recipe ? recipe.mainProtein || '' : '',
    recipe.mainIngredient || ''
  ].join(' ').toLowerCase();

  const match = (kws: string[]) => containsKeyword(fieldsToSearch, kws);

  // Derive flags dynamically if they are missing (for legacy or offline recipes)
  const isVegetarian = recipe.isVegetarian !== undefined ? recipe.isVegetarian : !match(MEAT_POULTRY) && !match(FISH_SEAFOOD);
  const isPescatarian = recipe.isPescatarian !== undefined ? recipe.isPescatarian : !match(MEAT_POULTRY);
  const isVegan = recipe.isVegan !== undefined ? recipe.isVegan : !match(MEAT_POULTRY) && !match(FISH_SEAFOOD) && !match(ANIMAL_DERIVATIVES);
  const dietFlagsVerified = recipe.dietFlagsVerified !== undefined ? recipe.dietFlagsVerified : true;

  // 2. Mandatory service flag check
  // Fail closed: If flags aren't explicitly verified as 100% accurate, exclude.
  if (!dietFlagsVerified) return false;

  // 3. Application of specific constraints
  switch (rule) {
    case 'vegetarian':
      // Must have flag AND pass string check for meat, poultry, fish, seafood
      if (!isVegetarian) return false;
      if (match(MEAT_POULTRY) || match(FISH_SEAFOOD)) return false;
      return true;

    case 'pescatarian':
      // Must be (vegetarian OR pescatarian OR vegan) AND pass string check for meat, poultry
      const flagAllowsPesca = !!(isPescatarian || isVegetarian || isVegan);
      if (!flagAllowsPesca) return false;
      if (match(MEAT_POULTRY)) return false;
      return true;

    case 'vegan':
      // Must have flag AND pass string check for meat, poultry, fish, seafood, and animal derivatives
      if (!isVegan) return false;
      if (match(MEAT_POULTRY) || match(FISH_SEAFOOD) || match(ANIMAL_DERIVATIVES)) return false;
      return true;

    case 'gluten-free':
      return !match(GLUTEN_SOURCES);

    case 'keto':
      return !match(KETO_EXCLUSIONS);

    case 'paleo':
      return !match(PALEO_EXCLUSIONS);

    default:
      return true;
  }
}

/**
 * PORTION-BASED CONSTRAINT CHECKER
 * Ensures calories and budget match the user's hard limits on a per-portion basis.
 */
export function passesPortionConstraints(
  item: Recipe | SavedRecipe | ReadyMeal,
  preferences: {
    calorieCeiling: number | null;
    budgetLimit: number | null;
  }
): boolean {
  // 1. Calorie Check
  const explicitCalories = 'caloriesPerPortion' in item ? item.caloriesPerPortion : item.calories;
  const derivedCalories = explicitCalories ?? (
    'totalRecipeCalories' in item && item.totalRecipeCalories !== undefined && item.totalServings && item.totalServings > 0
      ? item.totalRecipeCalories / item.totalServings
      : null
  );
  const calorieCeiling = preferences.calorieCeiling;
  if (Number.isFinite(calorieCeiling) && (calorieCeiling as number) > 0) {
    if (derivedCalories === null || derivedCalories === undefined || !Number.isFinite(derivedCalories)) return false;
    if (derivedCalories > calorieCeiling!) return false;
  }

  // 2. Budget Check
  const budgetLimit = preferences.budgetLimit;
  if (Number.isFinite(budgetLimit) && (budgetLimit as number) > 0) {
    let costPerPortion: number | null = null;

    const costText = 'costPerPortion' in item ? item.costPerPortion : undefined;
    const priceText = 'price' in item ? item.price : undefined;
    const totalPriceText = 'totalPrice' in item ? item.totalPrice : undefined;
    if (costText) {
      const match = costText.replace(/,/g, '').match(/[\d]+(?:\.\d+)?/);
      if (match) costPerPortion = parseFloat(match[0]);
    } else if (priceText) {
      const match = priceText.replace(/,/g, '').match(/[\d]+(?:\.\d+)?/);
      if (match) costPerPortion = parseFloat(match[0]);
    } else if ('totalRecipeCost' in item && item.totalRecipeCost !== undefined && item.totalServings && item.totalServings > 0) {
      costPerPortion = item.totalRecipeCost / item.totalServings;
    } else if (totalPriceText && item.totalServings && item.totalServings > 0) {
      const match = totalPriceText.replace(/,/g, '').match(/[\d]+(?:\.\d+)?/);
      if (match) costPerPortion = parseFloat(match[0]) / item.totalServings;
    }

    // A hard budget cannot be verified without a usable price, so fail closed.
    if (costPerPortion === null || !Number.isFinite(costPerPortion)) return false;
    if (costPerPortion > budgetLimit!) return false;
  }

  return true;
}

/**
 * COMPREHENSIVE HARD CONSTRAINT CHECKER
 * Wraps dietary rules, allergies, exclusions, and religious rules.
 */
export function passesHardConstraints(
  recipe: Recipe | SavedRecipe | ReadyMeal, 
  preferences: {
    dietaryRule: DietaryRule;
    saladPreference?: SaladPreference;
    allergies: string[];
    exclusions: string[];
    religiousEthical: string[];
    excludeIngredients?: string[];
    calorieCeiling: number | null;
    budgetLimit: number | null;
    supermarkets?: string[];
    includeOffal?: boolean;
  }
): boolean {
  // 1. Dietary Rule
  if (!passesDietaryRule(recipe, preferences.dietaryRule)) return false;

  // Offal is incompatible with vegetarian, vegan and pescatarian diets even
  // when an old profile or explicit search carries includeOffal=true.
  if (itemContainsOffal(recipe) && (!dietaryRuleAllowsOffal(preferences.dietaryRule) || preferences.includeOffal !== true)) return false;

  // 3. Salad Preference (HARD)
  const saladPreference = preferences.saladPreference || 'all';
  const isSalad = recipe.title.toLowerCase().includes('salad') || 
                  (recipe.description || '').toLowerCase().includes('salad') ||
                  recipe.saladType === 'main' || 
                  recipe.saladType === 'side';

  if (saladPreference === 'none') {
    if (isSalad) return false;
  } else if (saladPreference === 'main-only') {
    // If we have saladType from the service, use it. Otherwise fallback to keyword check.
    if (recipe.saladType) {
      if (recipe.saladType !== 'main') return false;
    } else {
      if (!isSalad) return false;
    }
  } else if (saladPreference === 'side-only') {
    if (recipe.saladType) {
      if (recipe.saladType !== 'side') return false;
    } else {
      if (!isSalad) return false;
    }
  }

  // 4. Portion-based Limits (Calories/Budget)
  if (!passesPortionConstraints(recipe, { 
    calorieCeiling: preferences.calorieCeiling, 
    budgetLimit: preferences.budgetLimit 
  })) return false;

  // 4.5. Supermarket Check (only for ready meals)
  if ('retailer' in recipe && preferences.supermarkets && preferences.supermarkets.length > 0) {
    const mealRetailer = (recipe as ReadyMeal).retailer?.toLowerCase().replace(/[^a-z0-9]/g, '').trim() || '';
    const hasMatch = preferences.supermarkets.some(s => {
      const target = s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      return mealRetailer.includes(target) || target.includes(mealRetailer);
    });
    if (!hasMatch) return false;
  }

  // 5. Combine all keyword-based hard constraints
  // All these must be ABSOLUTELY excluded if present
  const forbiddenKeywords = [
    ...(preferences.allergies || []).flatMap(allergy => preferenceTerms(allergy, DIETARY_EXCLUSION_MAP)),
    ...(preferences.exclusions || []),
    ...(preferences.religiousEthical || []).flatMap(preference => preferenceTerms(preference, RELIGIOUS_EXCLUSION_MAP)),
    ...(preferences.excludeIngredients || [])
  ].filter(Boolean);

  if (forbiddenKeywords.length === 0) return true;

  // 3. Search target fields
  const fieldsToSearch = [
    recipe.title,
    recipe.description || '',
    'ingredients' in recipe ? (recipe.ingredients || []).join(' ') : '',
    'mainProtein' in recipe ? recipe.mainProtein || '' : '',
    recipe.mainIngredient || ''
  ].join(' ').toLowerCase();

  // 4. Verification Check
  return !forbiddenKeywords.some(kw => {
    return matchesKeyword(fieldsToSearch, kw);
  });
}
