import { SearchParams, UserPreferences, DinnerSource, Recipe, ReadyMeal, SavedRecipe } from '../types';
import { PREFERRED_SOURCES } from '../data/preferredSources';
import { detectIngredientIntent } from './ingredientParser';

/**
 * Builds search parameters by combining user input, active filters, and persistent preferences.
 */
export const buildSearchParams = (
  query: string,
  source: DinnerSource,
  preferences: UserPreferences | null,
  overrides: Partial<SearchParams> = {}
): SearchParams => {
  // Start with overrides
  const params: SearchParams = {
    query: query.trim(),
    source,
    ...overrides
  };

  if (overrides.ingredientIntent === undefined && source === 'cook') {
    const ingredientIntent = detectIngredientIntent(query);
    if (ingredientIntent) {
      params.ingredientIntent = ingredientIntent;
      params.isLeftoverMode = true;
    }
  }

  // 1. Salad Preference
  // If not overridden, we use preference. Default to 'all' if neither exists.
  if (overrides.saladPreference === undefined) {
    params.saladPreference = preferences?.saladPreference || 'all';
  }

  // 2. Persistent Preferences (only if not a similarity search)
  if (!params.similarityContext) {
    // Dietary Rule
    const persistentDietRule = preferences?.dietaryRule || 'none';
    const temporaryDietRule = overrides.dietaryRule || 'none';
    const finalDietRule = temporaryDietRule !== 'none' ? temporaryDietRule : persistentDietRule;
    if (finalDietRule !== 'none') params.dietaryRule = finalDietRule;
    else delete params.dietaryRule;

    // Diet Types (legacy multi-select support)
    const temporaryDiet = overrides.dietTypes || [];
    if (temporaryDiet.length > 0) params.dietTypes = temporaryDiet;
    else delete params.dietTypes;

    // Allergies / Exclusions
    const persistentAllergies = preferences?.allergies || [];
    const persistentExclusions = preferences?.exclusions || [];
    const temporaryExclusions = overrides.exclusions || [];
    const mergedExclusions = [...new Set([...persistentAllergies, ...persistentExclusions, ...temporaryExclusions])];
    if (mergedExclusions.length > 0) params.exclusions = mergedExclusions;
    else delete params.exclusions;

    // Religious / Ethical
    const persistentReligious = preferences?.religiousEthical || [];
    const temporaryReligious = overrides.religiousEthical || [];
    const mergedReligious = [...new Set([...persistentReligious, ...temporaryReligious])];
    if (mergedReligious.length > 0) params.religiousEthical = mergedReligious;
    else delete params.religiousEthical;

    // Exclude Ingredients
    const temporaryNever = overrides.excludeIngredients || [];
    if (temporaryNever.length > 0) params.excludeIngredients = [...new Set(temporaryNever)];
    else delete params.excludeIngredients;

    // Cooking Methods
    const persistentMethods = preferences?.cookingMethods || [];
    const temporaryMethods = overrides.cookingMethods || [];
    const mergedMethods = [...new Set([...persistentMethods, ...temporaryMethods])];
    if (mergedMethods.length > 0) params.cookingMethods = mergedMethods;
    else delete params.cookingMethods;

    // Cooking Fats
    const persistentFats = preferences?.cookingFats || [];
    const temporaryFats = overrides.cookingFats || [];
    const mergedFats = [...new Set([...persistentFats, ...temporaryFats])];
    if (mergedFats.length > 0) params.cookingFats = mergedFats;
    else delete params.cookingFats;

    // Supermarkets
    if (source === 'ready-made') {
      const persistentSupers = preferences?.preferredSupermarkets || [];
      const temporarySupers = overrides.supermarkets || [];
      const mergedSupers = [...new Set([...persistentSupers, ...temporarySupers])];
      if (mergedSupers.length > 0) params.supermarkets = mergedSupers;
      else delete params.supermarkets;
    } else {
      delete params.supermarkets;
    }

    // Calorie Ceiling
    if (overrides.maxCalories === undefined && preferences?.calorieCeiling !== undefined && preferences?.calorieCeiling !== null) {
      params.maxCalories = preferences.calorieCeiling;
    }

    // Budget Limit
    if (preferences?.budgetLimit !== undefined && preferences?.budgetLimit !== null) {
      if (source === 'cook' && overrides.maxCostPerPortion === undefined) {
        params.maxCostPerPortion = preferences.budgetLimit;
      } else if (source === 'ready-made' && overrides.maxPricePerPerson === undefined) {
        params.maxPricePerPerson = preferences.budgetLimit;
      }
    }

    // Wholesome Choice
    if (overrides.nutritiousChoice !== undefined) {
      params.nutritiousChoice = overrides.nutritiousChoice;
    } else if (preferences?.nutritiousChoice !== undefined) {
      params.nutritiousChoice = preferences.nutritiousChoice;
    }

    // High Omega-3
    if (overrides.highOmega3 !== undefined) {
      params.highOmega3 = overrides.highOmega3;
    } else if (preferences?.highOmega3 !== undefined) {
      params.highOmega3 = preferences.highOmega3;
    }

    // High Protein
    if (overrides.highProtein !== undefined) {
      params.highProtein = overrides.highProtein;
    } else if (preferences?.highProtein !== undefined) {
      params.highProtein = preferences.highProtein;
    }

    // Quick & Easy (Simplicity Bias)
    if (overrides.isSimple !== undefined) {
      params.isSimple = overrides.isSimple;
    } else if (preferences?.isSimple !== undefined) {
      params.isSimple = preferences.isSimple;
    }

    // Servings
    if (overrides.servings !== undefined) {
      params.servings = overrides.servings;
    } else if (preferences?.servings !== undefined) {
      params.servings = preferences.servings;
    }

    // Cuisine
    if (overrides.cuisines) {
      params.cuisines = overrides.cuisines;
    } else if (overrides.cuisine) {
      params.cuisine = overrides.cuisine;
    } else if (preferences?.cuisinePreferences && !overrides.similarityContext) {
      // Note: we don't usually map ALL favorite cuisines to a single search parameter 
      // unless specifically requested.
    }

    // Low Cost
    if (overrides.isLowCost !== undefined) {
      params.isLowCost = overrides.isLowCost;
    } else if (preferences?.isLowCost !== undefined) {
      params.isLowCost = preferences.isLowCost;
    }

    // Leftover Mode
    if (overrides.isLeftoverMode !== undefined) {
      params.isLeftoverMode = overrides.isLeftoverMode;
    }

    // Trusted Sources
    if (overrides.preferredSourceIds) {
      params.preferredSourceIds = overrides.preferredSourceIds;
    } else if (preferences?.preferredSourceIds && preferences.preferredSourceIds.length > 0) {
      params.preferredSourceIds = preferences.preferredSourceIds;
    }

    // Apply £2 limit for Low Cost if no other limit is provided OR if existing limit is higher
    if (params.isLowCost) {
      const lowCostThreshold = 2.0;
      if (source === 'cook') {
        if (params.maxCostPerPortion === undefined || params.maxCostPerPortion > lowCostThreshold) {
          params.maxCostPerPortion = lowCostThreshold;
        }
      } else if (source === 'ready-made') {
        if (params.maxPricePerPerson === undefined || params.maxPricePerPerson > lowCostThreshold) {
          params.maxPricePerPerson = lowCostThreshold;
        }
      }
    }
  }

  console.log("[buildSearchParams] Final Params:", params);

  return params;
};

/**
 * Builds a list of active criteria for UI display (chips/tags).
 * Separates permanent from temporary filters.
 */
export const buildActiveCriteria = (
  params: SearchParams,
  profilePrefs: UserPreferences | null,
  options: {
    isDietaryRuleSuppressed?: boolean;
    suppressedPermanentKeys?: string[];
    DIETARY_TAXONOMY: any;
  }
) => {
  const { isDietaryRuleSuppressed, suppressedPermanentKeys = [], DIETARY_TAXONOMY } = options;
  const list: { type: string, value: string, label: string, isPermanent?: boolean }[] = [];
  
  console.log('[buildActiveCriteria] START:', { 
    paramsLowCost: params.isLowCost, 
    prefsLowCost: profilePrefs?.isLowCost,
    suppressed: suppressedPermanentKeys 
  });
  
  // 1. Dietary Rule (Permanent vs Temporary)
  const persistentDietRule = profilePrefs?.dietaryRule || 'none';
  const temporaryDietRule = params.dietaryRule || 'none';
  
  // Show permanent rule if it's active AND not suppressed AND not overridden by a different temporary rule
  const dietaryKey = `dietaryRule-${persistentDietRule}`;
  if (persistentDietRule !== 'none' && !isDietaryRuleSuppressed && temporaryDietRule === persistentDietRule && !suppressedPermanentKeys.includes(dietaryKey)) {
    list.push({ 
      type: 'dietaryRule', 
      value: persistentDietRule, 
      label: DIETARY_TAXONOMY.dietaryPreferences.labels[persistentDietRule], 
      isPermanent: true 
    });
  }

  // Show temporary rule if it's different from permanent
  if (temporaryDietRule !== 'none' && temporaryDietRule !== persistentDietRule) {
    list.push({ 
      type: 'dietaryRule', 
      value: temporaryDietRule, 
      label: DIETARY_TAXONOMY.dietaryPreferences.labels[temporaryDietRule]
    });
  }

  // 1b. Salad Preference (Unified Logic)
  const temporarySaladPref = params.saladPreference || 'all';
  const persistentSaladPref = profilePrefs?.saladPreference || 'all';
  
  if (persistentSaladPref !== 'all' && !suppressedPermanentKeys.includes(`saladPreference-${persistentSaladPref}`) && (temporarySaladPref === 'all' || temporarySaladPref === persistentSaladPref)) {
    list.push({ 
      type: 'saladPreference', 
      value: persistentSaladPref, 
      label: DIETARY_TAXONOMY.saladPreferences.labels[persistentSaladPref],
      isPermanent: true
    });
  } else if (temporarySaladPref !== 'all' && temporarySaladPref !== persistentSaladPref) {
    list.push({ 
      type: 'saladPreference', 
      value: temporarySaladPref, 
      label: DIETARY_TAXONOMY.saladPreferences.labels[temporarySaladPref],
      isPermanent: false
    });
  }

  // 2. Allergies (Permanent + temporary)
  const persistentAllergies = profilePrefs?.allergies || [];
  const temporaryAllergies = params.allergies || [];

  if (persistentAllergies.length > 0) {
    persistentAllergies.forEach(a => {
      const key = `allergy-${a}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ type: 'allergy', value: a, label: `No ${a}`, isPermanent: true });
      }
    });
  }

  temporaryAllergies.forEach(a => {
    if (!persistentAllergies.includes(a)) {
      list.push({ type: 'allergy', value: a, label: `No ${a}`, isPermanent: false });
    }
  });

  // 3. Exclusions (Permanent)
  if (profilePrefs?.exclusions) {
    profilePrefs.exclusions.forEach(e => {
      const key = `profileExclusion-${e}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ type: 'profileExclusion', value: e, label: `No ${e}`, isPermanent: true });
      }
    });
  }

  // 4. Religious & Ethical (Permanent)
  if (profilePrefs?.religiousEthical) {
    profilePrefs.religiousEthical.forEach(r => {
      const key = `profileReligious-${r}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ type: 'profileReligious', value: r, label: r, isPermanent: true });
      }
    });
  }

  // 5. Cuisines (Permanent vs Temporary)
  const activeParamsCuisines = params.cuisines || (params.cuisine ? [params.cuisine] : []);
  
  // First, always map permanent cuisines from profile preferences
  if (profilePrefs?.cuisinePreferences) {
    profilePrefs.cuisinePreferences.forEach(c => {
      const key = `profileCuisine-${c}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ 
          type: 'profileCuisine', 
          value: c, 
          label: c, 
          isPermanent: true 
        });
      }
    });
  }

  // Then, map map any temporary cuisines that are NOT already in the permanent list
  activeParamsCuisines.forEach(c => {
    const isAlreadyAdded = list.some(item => item.value === c && (item.type === 'profileCuisine' || item.type === 'cuisine'));
    if (!isAlreadyAdded) {
      list.push({ 
        type: 'cuisine', 
        value: c, 
        label: c, 
        isPermanent: false 
      });
    }
  });

  // 6. Supermarkets (Permanent vs Temporary)
  if (params.source === 'ready-made') {
    if (profilePrefs?.preferredSupermarkets) {
      profilePrefs.preferredSupermarkets.forEach(s => {
        const key = `profileSupermarket-${s}`;
        if (!suppressedPermanentKeys.includes(key)) {
          list.push({ 
            type: 'profileSupermarket', 
            value: s, 
            label: s, 
            isPermanent: true 
          });
        }
      });
    }

    if (params.supermarkets) {
      params.supermarkets.forEach(s => {
        const isAlreadyAdded = list.some(item => item.value === s && (item.type === 'profileSupermarket' || item.type === 'supermarket'));
        if (!isAlreadyAdded) {
          list.push({ 
            type: 'supermarket', 
            value: s, 
            label: s, 
            isPermanent: false 
          });
        }
      });
    }
  }

  // 7. Cooking Methods (Permanent vs Temporary)
  if (profilePrefs?.cookingMethods) {
    profilePrefs.cookingMethods.forEach(m => {
      const key = `profileCookingMethod-${m}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ 
          type: 'profileCookingMethod', 
          value: m, 
          label: m, 
          isPermanent: true 
        });
      }
    });
  }

  if (params.cookingMethods) {
    params.cookingMethods.forEach(m => {
      const isAlreadyAdded = list.some(item => item.value === m && (item.type === 'profileCookingMethod' || item.type === 'cookingMethod'));
      if (!isAlreadyAdded) {
        list.push({ 
          type: 'cookingMethod', 
          value: m, 
          label: m, 
          isPermanent: false 
        });
      }
    });
  }

  // 7b. Cooking Fats (Permanent vs Temporary)
  if (profilePrefs?.cookingFats) {
    profilePrefs.cookingFats.forEach(f => {
      const key = `profileCookingFat-${f}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ 
          type: 'profileCookingFat', 
          value: f, 
          label: f, 
          isPermanent: true 
        });
      }
    });
  }

  if (params.cookingFats) {
    params.cookingFats.forEach(f => {
      const isAlreadyAdded = list.some(item => item.value === f && (item.type === 'profileCookingFat' || item.type === 'cookingFat'));
      if (!isAlreadyAdded) {
        list.push({ 
          type: 'cookingFat', 
          value: f, 
          label: f, 
          isPermanent: false 
        });
      }
    });
  }

  // 7c. Trusted Sources (preferredSourceIds)
  if (profilePrefs?.preferredSourceIds) {
    profilePrefs.preferredSourceIds.forEach(id => {
      const sourceObj = PREFERRED_SOURCES.find(s => s.id === id);
      const label = sourceObj ? sourceObj.label : id;
      const key = `profileSource-${id}`;
      if (!suppressedPermanentKeys.includes(key)) {
        list.push({ 
          type: 'profileSource', 
          value: id, 
          label, 
          isPermanent: true 
        });
      }
    });
  }

  if (params.preferredSourceIds) {
    params.preferredSourceIds.forEach(id => {
      const sourceObj = PREFERRED_SOURCES.find(s => s.id === id);
      const label = sourceObj ? sourceObj.label : id;
      const isAlreadyAdded = list.some(item => item.value === id && (item.type === 'profileSource' || item.type === 'preferredSource'));
      if (!isAlreadyAdded) {
        list.push({ 
          type: 'preferredSource', 
          value: id, 
          label, 
          isPermanent: false 
        });
      }
    });
  }

  // 8. Boolean Flags (Permanent vs Temporary)
  const flags = [
    { key: 'isSimple', label: 'Quick and easy recipes' },
    { key: 'nutritiousChoice', label: 'Wholesome recipes' },
    { key: 'highOmega3', label: 'High Omega-3' },
    { key: 'isLowCost', label: 'Low cost recipes' },
    { key: 'highProtein', label: 'High Protein' }
  ] as const;

  const activeFlagsByLabel = new Set<string>();

  flags.forEach(({ key, label }) => {
    const isEphActive = !!(params as any)[key];
    const isPermActive = !!(profilePrefs as any)?.[key];
    const isSuppressed = suppressedPermanentKeys.includes(`${key}-true`);

    if (!isSuppressed) {
      if (isPermActive) {
        list.push({ 
          type: key, 
          value: 'true', 
          label, 
          isPermanent: true 
        });
        activeFlagsByLabel.add(label);
      } else if (isEphActive) {
        list.push({ 
          type: key, 
          value: 'true', 
          label, 
          isPermanent: false 
        });
        activeFlagsByLabel.add(label);
      }
    }
  });

  // 9. Time Constraints (Permanent vs Temporary)
  const timeVal = params.maxTotalTime || params.maxHeatingTime;
  const targetUnderMins = profilePrefs?.readyToEatUnderMins;
  
  if (targetUnderMins && !suppressedPermanentKeys.includes(`readyToEatUnderMins-${targetUnderMins}`)) {
    list.push({ 
      type: 'readyToEatUnderMins', 
      value: targetUnderMins.toString(), 
      label: `Under ${targetUnderMins} min${targetUnderMins > 1 ? 's' : ''}`, 
      isPermanent: true 
    });
  }

  if (timeVal) {
    const isAlreadyAdded = list.some(item => item.type === 'readyToEatUnderMins');
    if (!isAlreadyAdded) {
      list.push({ 
        type: params.source === 'cook' ? 'maxTotalTime' : 'maxHeatingTime', 
        value: timeVal.toString(), 
        label: `Under ${timeVal} mins`, 
        isPermanent: false
      });
    }
  }

  // 10. Temporary Exclusions (excludeIngredients/omitIngredients)
  const allTempExcludes = [
    ...(params.excludeIngredients || []),
    ...(params.exclusions || []).filter(e => !profilePrefs?.exclusions?.includes(e) && !profilePrefs?.allergies?.includes(e))
  ];
  const uniqueTempExcludes = [...new Set(allTempExcludes)];
  uniqueTempExcludes.forEach(i => {
    list.push({ type: 'excludeIngredient', value: i, label: `No ${i}` });
  });

  // Calories (Permanent vs Temporary)
  const targetCalorieCeiling = profilePrefs?.calorieCeiling;
  if (targetCalorieCeiling && !suppressedPermanentKeys.includes(`maxCalories-${targetCalorieCeiling}`)) {
    list.push({ 
      type: 'maxCalories', 
      value: targetCalorieCeiling.toString(), 
      label: `Under ${targetCalorieCeiling} kcal`, 
      isPermanent: true 
    });
  }

  if (params.maxCalories) {
    const isAlreadyAdded = list.some(item => item.type === 'maxCalories');
    if (!isAlreadyAdded) {
      list.push({ 
        type: 'maxCalories', 
        value: params.maxCalories.toString(), 
        label: `Under ${params.maxCalories} kcal`, 
        isPermanent: false 
      });
    }
  }

  // 9b. Portions / Servings (Permanent vs Temporary)
  const targetServings = profilePrefs?.servings || 2;
  const currentServings = params.servings;
  
  if (profilePrefs?.servings && profilePrefs.servings !== 2 && !suppressedPermanentKeys.includes(`servings-${profilePrefs.servings}`)) {
    list.push({
      type: 'servings',
      value: profilePrefs.servings.toString(),
      label: `${profilePrefs.servings} portions`,
      isPermanent: true
    });
  } else if (currentServings && currentServings !== targetServings) {
    list.push({
      type: 'servings',
      value: currentServings.toString(),
      label: `${currentServings} portions`,
      isPermanent: false
    });
  }

  // Budget (Permanent vs Temporary)
  const targetBudgetLimit = profilePrefs?.budgetLimit;
  const budget = params.maxCostPerPortion || params.maxPricePerPerson;
  const isLowCostActive = !!(params.isLowCost || profilePrefs?.isLowCost);
  const isRedundantLowCostBudget = isLowCostActive && budget === 2.0;

  if (targetBudgetLimit && !suppressedPermanentKeys.includes(`budgetLimit-${targetBudgetLimit}`)) {
    const budgetType = params.source === 'cook' ? 'maxCostPerPortion' : 'maxPricePerPerson';
    const label = params.source === 'cook' ? `Under £${targetBudgetLimit}/port.` : `Under £${targetBudgetLimit}`;
    const isRedundantLowCostPermBudget = isLowCostActive && targetBudgetLimit === 2.0;
    if (!isRedundantLowCostPermBudget) {
      list.push({ 
        type: budgetType, 
        value: targetBudgetLimit.toString(), 
        label, 
        isPermanent: true 
      });
    }
  }

  if (budget && !isRedundantLowCostBudget) {
    const isAlreadyAdded = list.some(item => item.type === 'maxCostPerPortion' || item.type === 'maxPricePerPerson');
    if (!isAlreadyAdded) {
      const budgetType = params.source === 'cook' ? 'maxCostPerPortion' : 'maxPricePerPerson';
      const label = params.source === 'cook' ? `Under £${budget}/port.` : `Under £${budget}`;
      list.push({ 
        type: budgetType, 
        value: budget.toString(), 
        label, 
        isPermanent: false 
      });
    }
  }

  console.log('[buildActiveCriteria] END:', { listCount: list.length, listLabels: list.map(l => l.label) });
  return list;
};

/**
 * Normalizes a string for search comparison:
 * - Lowercase
 * - Removes common fillers
 * - Removes non-alphanumeric characters (including spaces)
 * - Simple plural/singular normalization
 */
const normalizeForSearch = (str: string) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\b(a|an|the|with|and|for|of|in|to|my|me|some|any|recipe|recipes|dish|dishes|meal|meals)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/ies\b/g, 'y')
    .replace(/oes\b/g, 'o')
    .replace(/s\b/g, '');
};

/**
 * Checks if a search query matches a recipe, ready meal, or saved recipe.
 * Handles misspellings by checking normalized substrings and keywords.
 */
export const checkSearchMatch = (item: Recipe | ReadyMeal | SavedRecipe, query: string): boolean => {
  if (!query || query.trim().length === 0) return true;
  
  const qOriginal = query.toLowerCase().trim();
  const qNormalized = normalizeForSearch(qOriginal);
  
  if (qNormalized.length < 2) return true; // Too short to filter meaningfully

  const titleNormalized = normalizeForSearch(item.title);
  
  // 1. Direct match on normalized title (handles "chick peas" vs "chickpea")
  if (titleNormalized.includes(qNormalized)) return true;
  if (qNormalized.includes(titleNormalized)) return true;

  // 2. Keyword-based matching
  const keywords = qOriginal.split(/\s+/)
    .filter(k => k.length > 2)
    .map(k => normalizeForSearch(k))
    .filter(k => k.length > 0);

  if (keywords.length === 0) return true;

  const contentNormalized = [
    titleNormalized,
    ...('ingredients' in item && item.ingredients ? item.ingredients.map(i => normalizeForSearch(i)) : []),
    normalizeForSearch(item.description || ''),
    'chefStyle' in item && item.chefStyle ? normalizeForSearch(item.chefStyle) : '',
    'totalCookTime' in item && item.totalCookTime ? String(item.totalCookTime) : '',
    'totalTime' in item && item.totalTime ? String(item.totalTime) : ''
  ].filter(Boolean).join('|');

  // If most keywords match, or any very long keyword matches
  const matchingKeywords = keywords.filter(kw => contentNormalized.includes(kw));
  
  // If we have multiple keywords, we want at least 50% match
  if (keywords.length > 1) {
    return (matchingKeywords.length / keywords.length) >= 0.5;
  }
  
  // Single keyword: must match
  return matchingKeywords.length > 0;
};

/**
 * Removes undefined, null, empty, or NaN values from search parameters for Firestore compatibility.
 */
export const cleanSearchParams = (params: SearchParams): SearchParams => {
  const clean: any = {};
  
  Object.entries(params).forEach(([key, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v) && v.length === 0) return;
    if (typeof v === 'number' && isNaN(v)) return;
    
    if (key === 'similarityContext' && v && typeof v === 'object') {
      const cleanContext: any = {};
      Object.entries(v).forEach(([ckey, cv]) => {
        if (cv !== undefined && cv !== null && cv !== '') {
          cleanContext[ckey] = cv;
        }
      });
      if (Object.keys(cleanContext).length > 0) {
        clean[key] = cleanContext;
      }
      return;
    }

    clean[key] = v;
  });

  return clean as SearchParams;
};

/**
 * Checks if any significant hard constraints or filters are active in the search parameters.
 * Excludes the query, source, and default salad preference.
 */
export const hasActiveFilters = (params: SearchParams): boolean => {
  const filterKeys: (keyof SearchParams)[] = [
    'dietaryRule',
    'dietTypes',
    'exclusions',
    'religiousEthical',
    'excludeIngredients',
    'maxTotalTime',
    'maxPrepTime',
    'maxCookTime',
    'maxCostPerPortion',
    'maxPricePerPerson',
    'maxCalories',
    'maxHeatingTime',
    'isSimple',
    'nutritiousChoice',
    'highOmega3',
    'highProtein',
    'supermarkets',
    'saladPreference'
  ];

  return filterKeys.some(key => {
    const val = params[key];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (key === 'dietaryRule' && val === 'none') return false;
    if (key === 'saladPreference' && val === 'all') return false;
    if (typeof val === 'boolean' && val === false) return false;
    return true;
  });
};
