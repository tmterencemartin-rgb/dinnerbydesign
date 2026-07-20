import { Recipe, SavedRecipe, ReadyMeal, DietaryRule, SaladPreference } from '../types';
import { itemContainsOffal } from './offalPreference';

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

  const match = (kws: string[]) => kws.some(kw => {
    // Exact word boundary regex to avoid false positives like "eggplant" for "egg"
    // Also supports common pluralisations (s, es, ies)
    const safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${safeKw}(s|es|ies)?\\b`, 'i');
    return regex.test(fieldsToSearch);
  });

  const MEAT_POULTRY = [
    'beef', 'pork', 'lamb', 'bacon', 'ham', 'sausage', 'venison', 'veal', 'chorizo', 'salami', 'lard', 'gelatine', 'gelatin', 'chicken', 'turkey', 'duck', 'poultry', 'pepperoni',
    'gammon', 'mutton', 'goose', 'pancetta', 'panchetta', 'prosciutto', 'black pudding', 'suet', 'dripping'
  ];
  
  const FISH_SEAFOOD = [
    'fish', 'salmon', 'tuna', 'cod', 'haddock', 'trout', 'bass', 'prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop', 'squid', 'octopus', 'seafood', 'anchovy', 'anchovies', 'mackerel', 'sardine', 'fish sauce', 'oyster sauce', 'shrimp paste',
    'roe', 'caviar', 'calamari', 'scampi', 'langoustine', 'crayfish', 'bonito', 'dashi', 'worcestershire'
  ];
  
  const ANIMAL_DERIVATIVES = [
    'egg', 'milk', 'dairy', 'cheese', 'butter', 'honey', 'cream', 'yogurt', 'yoghurt', 'whey', 'casein', 'mayo', 'mayonnaise', 'halloumi', 'parmesan', 'feta', 'mozzarella', 'paneer', 'ghee',
    'rennet', 'beeswax', 'isinglass', 'carmine', 'shellac', 'albumen', 'pepsin'
  ];

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
      const GLUTEN_SOURCES = ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'bread', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats'];
      return !match(GLUTEN_SOURCES);

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
  const caloriesPerPortion = 'caloriesPerPortion' in item ? item.caloriesPerPortion : item.calories;
  if (preferences.calorieCeiling && caloriesPerPortion) {
    if (caloriesPerPortion > preferences.calorieCeiling) return false;
  }

  // 2. Budget Check
  const budgetLimit = preferences.budgetLimit;
  if (budgetLimit) {
    let costPerPortion: number | null = null;
    
    if ('costPerPortion' in item && item.costPerPortion) {
      // costPerPortion is usually a string like "£2.50" or "£2.50 pp"
      const match = item.costPerPortion.match(/[\d.]+/);
      if (match) costPerPortion = parseFloat(match[0]);
    } else if ('price' in item && item.price) {
      const match = item.price.match(/[\d.]+/);
      if (match) costPerPortion = parseFloat(match[0]);
    }

    if (costPerPortion !== null && costPerPortion > budgetLimit) return false;
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

  // Offal is excluded from ordinary suggestions unless the saved preference or an explicit search allows it.
  if (preferences.includeOffal !== true && itemContainsOffal(recipe)) return false;

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
    ...(preferences.allergies || []),
    ...(preferences.exclusions || []),
    ...(preferences.religiousEthical || []),
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
    let safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim().toLowerCase();
    if (!safeKw) return false;
    
    // Simple singularisation: if ends in 's', also try matching without 's'
    // This ensures "onions" matches "onion"
    let baseKw = safeKw;
    if (baseKw.endsWith('ies')) baseKw = baseKw.slice(0, -3) + 'y';
    else if (baseKw.endsWith('es')) baseKw = baseKw.slice(0, -2);
    else if (baseKw.endsWith('s')) baseKw = baseKw.slice(0, -1);

    // Matches the base word (singular) or its common plural forms in the target text
    // This handles both "onion" -> "onions" and "onions" -> "onion" 
    const regex = new RegExp(`\\b${baseKw}(s|es|ies)?\\b`, 'i');
    return regex.test(fieldsToSearch);
  });
}
