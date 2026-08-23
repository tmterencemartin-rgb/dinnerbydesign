import { UserPreferences, DietaryRule, SaladPreference } from '../types';
import { dietaryRuleAllowsOffal } from './offalPreference';
import { filterCookingFatsForDiet } from './preferenceCompatibility';

/**
 * Normalises user preferences from potentially legacy data formats.
 * Handles variants like caloryCeiling/calorieCeiling, favoriteCuisines/favouriteCuisines, etc.
 */
export const normaliseUserPreferences = (data: any): UserPreferences => {
  if (!data) {
    return {
      dietaryRule: 'none',
      saladPreference: 'all',
      allergies: [],
      nutritiousChoice: false,
      isSimple: false,
      isLowCost: false,
      highOmega3: false,
      highProtein: false,
      includeOffal: false,
      servings: 2,
      calorieCeiling: null,
      budgetLimit: null,
      exclusions: [],
      cuisinePreferences: [],
      religiousEthical: [],
      cookingMethods: [],
      cookingFats: [],
      readyToEatUnderMins: null,
      preferredMode: 'cook',
      customCuisines: [],
      preferredSupermarkets: [],
      preferredSourceIds: []
    };
  }

  // Migration logic for allergiesExclusions
  let allergies = data.allergies || [];
  let exclusions = data.exclusions || [];
  
  if (data.allergiesExclusions && Array.isArray(data.allergiesExclusions)) {
    const legacy = data.allergiesExclusions;
    const allergyMap: Record<string, string> = {
      'Dairy-Free': 'Milk',
      'Egg-Free': 'Eggs',
      'Gluten-Free': 'Cereals containing gluten',
      'Sesame': 'Sesame',
      'Shellfish': 'Crustaceans',
      'Soy-Free': 'Soybeans'
    };
    
    legacy.forEach((item: string) => {
      if (allergyMap[item]) {
        if (!allergies.includes(allergyMap[item])) allergies.push(allergyMap[item]);
      }
    });
  }

  // Map legacy allergy labels to the new standard 14 regulated food allergens
  const legacyAllergyLabelMap: Record<string, string> = {
    'Milk/Dairy': 'Milk',
    'Dairy': 'Milk',
    'Gluten/Wheat': 'Cereals containing gluten',
    'Soy': 'Soybeans',
    'Tree Nuts': 'Tree nuts'
  };

  allergies = allergies.flatMap((item: string) => {
    if (item === 'Shellfish') {
      return ['Crustaceans', 'Molluscs'];
    }
    if (legacyAllergyLabelMap[item]) {
      return [legacyAllergyLabelMap[item]];
    }
    return [item];
  });

  // Map legacy salad preference
  let saladPreference: SaladPreference = data.saladPreference || 'all';
  if (data.saladPreference === 'include') saladPreference = 'all';
  if (data.saladPreference === 'exclude') saladPreference = 'none';

  // Handle legacy dietary mapping
  let dietaryRule: DietaryRule = data.dietaryRule || data.dietaryPreference || 'none';
  if (dietaryRule === 'none' && data.dietTypes && Array.isArray(data.dietTypes) && data.dietTypes.length > 0) {
    const mainRule = data.dietTypes[0].toLowerCase();
    if (['vegan', 'vegetarian', 'paleo', 'keto', 'pescatarian', 'gluten-free', 'mediterranean'].includes(mainRule)) {
      dietaryRule = mainRule as DietaryRule;
    }
  }

  return {
    dietaryRule,
    saladPreference,
    allergies: [...new Set(allergies as string[])],
    nutritiousChoice: data.nutritiousChoice || false,
    isSimple: data.isSimple || false,
    isLowCost: data.isLowCost || false,
    highOmega3: data.highOmega3 || false,
    highProtein: data.highProtein || false,
    includeOffal: data.includeOffal === true && dietaryRuleAllowsOffal(dietaryRule),
    servings: data.servings || 2,
    calorieCeiling: data.calorieCeiling !== undefined ? data.calorieCeiling : (data.caloryCeiling !== undefined ? data.caloryCeiling : null),
    budgetLimit: data.budgetLimit !== undefined ? data.budgetLimit : null,
    exclusions: [...new Set(exclusions as string[])],
    cuisinePreferences: (() => {
      const prefs = new Set<string>((data.cuisinePreferences || data.favouriteCuisines || data.favoriteCuisines || []) as string[]);
      if (data.broadStyle === 'Mediterranean') prefs.add('Mediterranean');
      if (data.broadStyle === 'Middle Eastern') prefs.add('Middle Eastern');
      return [...prefs];
    })(),
    religiousEthical: [...new Set((data.religiousEthical || []).map((item: string) => {
      if (item === 'Kosher') return 'Kosher-friendly';
      if (item === 'Halal' || item === 'Halal-friendly') return 'Prefer Halal-certified ingredients where available';
      if (item === 'Fair Trade only' || item === 'Fair Trade preference') return 'Prefer Fair Trade ingredients where available';
      return item;
    }) as string[])],
    cookingMethods: [...new Set((data.cookingMethods || []) as string[])],
    cookingFats: filterCookingFatsForDiet(dietaryRule, [...new Set((data.cookingFats || []) as string[])]),
    readyToEatUnderMins: data.readyToEatUnderMins || null,
    preferredMode: data.preferredMode || 'cook',
    customCuisines: [...new Set((data.customCuisines || []) as string[])],
    preferredSupermarkets: [...new Set((data.preferredSupermarkets || []).map((item: string) => {
      if (item === "Sainsbury's") return "Sainsbury’s";
      return item;
    }) as string[])],
    preferredSourceIds: [...new Set((data.preferredSourceIds || []) as string[])]
  };
};

/**
 * Checks if the user needs to confirm their dietary baseline (e.g. if they had multiple selected).
 */
export const checkNeedsDietConfirmation = (data: any): boolean => {
  if (!data) return false;
  const rawDiet = data.dietaryRule || data.dietaryPreference || data.dietType || data.dietTypes;
  return Array.isArray(rawDiet) && rawDiet.length > 1;
};
