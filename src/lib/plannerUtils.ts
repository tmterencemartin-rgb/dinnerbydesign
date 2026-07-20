import { DinnerSource, ReadyMeal, Recipe, SavedRecipe, SearchParams, UserPreferences } from '../types';
import { passesHardConstraints } from './dietarySafety';
import { buildSearchParams, checkSearchMatch, cleanSearchParams } from './searchUtils';
import { getConvenienceProfile } from './recipeUtils';

export type SavedSortOption = 'newest' | 'oldest' | 'name' | 'quickest' | 'lowest-cost';
export type ConvenienceFilter = 'all' | 'scratch' | 'convenience';

export interface QuickPills {
  under20: boolean;
  vegetarian: boolean;
  highProtein: boolean;
  batch: boolean;
}

export interface CostSavingSwap {
  scheduled: SavedRecipe;
  replacement: SavedRecipe;
  saving: number;
}

export type WeeklyPlanTime = 'any' | 'quick' | 'under30' | 'under45';

export interface WeeklyPlanSettings {
  dinnerCount: 3 | 5 | 7;
  budget: string;
  servings: number;
  protein: string | string[];
  time: WeeklyPlanTime;
  homemadeCount: number;
  minimiseCost?: boolean;
  reuseIngredients?: boolean;
}

export type GenerateDinnerSuggestions = (
  searchParams: SearchParams,
  preferences?: UserPreferences
) => Promise<{
  recipes?: Recipe[];
  readyMeals?: ReadyMeal[];
}>;

export interface WeeklyPlanResult {
  dinners: Array<Recipe | ReadyMeal>;
  alert: string | null;
  selectionSummary?: string;
}

export interface WeeklyPlanCostSummary {
  dinnerCount: number;
  pricedDinnerCount: number;
  servings: number;
  estimatedTotal: number;
  estimatedPerPortion: number;
  budgetTarget: number | null;
  budgetVariance: number | null;
}

const parseCurrencyValue = (value?: string | number | null) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const match = String(value).replace(/,/g, '').match(/[\d.]+/);
  return match ? Number(match[0]) || 0 : 0;
};

export const summariseWeeklyPlanCosts = (
  dinners: Array<Recipe | ReadyMeal>,
  servings: number,
  budget: string | number,
): WeeklyPlanCostSummary | null => {
  const safeServings = Math.max(1, servings || 1);
  let pricedDinnerCount = 0;
  let estimatedTotal = 0;

  dinners.forEach((dinner) => {
    let perPortion = parseCurrencyValue(dinner.costPerPortion);
    if (perPortion <= 0 && 'retailer' in dinner) {
      perPortion = parseCurrencyValue(dinner.price);
      if (perPortion <= 0 && dinner.totalPrice && dinner.totalServings) {
        perPortion = parseCurrencyValue(dinner.totalPrice) / dinner.totalServings;
      }
    }
    if (perPortion <= 0 && 'totalRecipeCost' in dinner && dinner.totalRecipeCost && dinner.totalServings) {
      perPortion = dinner.totalRecipeCost / dinner.totalServings;
    }
    if (perPortion <= 0) return;
    pricedDinnerCount += 1;
    estimatedTotal += perPortion * safeServings;
  });

  if (pricedDinnerCount === 0) return null;

  const budgetValue = typeof budget === 'number' ? budget : Number(budget);
  const budgetTarget = Number.isFinite(budgetValue) && budgetValue > 0 ? budgetValue : null;
  const roundedTotal = Number(estimatedTotal.toFixed(2));

  return {
    dinnerCount: dinners.length,
    pricedDinnerCount,
    servings: safeServings,
    estimatedTotal: roundedTotal,
    estimatedPerPortion: Number((roundedTotal / (pricedDinnerCount * safeServings)).toFixed(2)),
    budgetTarget,
    budgetVariance: budgetTarget === null ? null : Number((budgetTarget - roundedTotal).toFixed(2)),
  };
};

export const parseIngredientLine = (ingredient: string) => {
  const cleanIngredient = ingredient.replace(/^[•\-\*\s\.\(\)]+/, '').trim();
  const match = cleanIngredient.match(/^([\d\/\.\s\-½⅓¼¾]+(?:(?:oz|g|kg|ml|l|tbsp|tsp|cups?|slices?|pcs|pieces?|cans?|pots?|cloves?|stalks?|tins?|bunches?|sprigs?)\b)?)?(.*)$/i);
  if (match) {
    const qtyUnit = (match[1] || '').trim();
    const name = match[2].trim();
    if (qtyUnit) {
      return { qtyUnit, name };
    }
  }
  return { qtyUnit: '', name: cleanIngredient };
};

export const buildSafetyPrefs = (preferences?: UserPreferences | null) => {
  if (!preferences) return null;
  return {
    dietaryRule: preferences.dietaryRule || 'none',
    allergies: preferences.allergies || [],
    exclusions: preferences.exclusions || [],
    religiousEthical: preferences.religiousEthical || [],
    calorieCeiling: preferences.calorieCeiling,
    budgetLimit: preferences.budgetLimit,
    includeOffal: preferences.includeOffal === true,
  };
};

export const parseSavedRecipeCost = (recipe: SavedRecipe): number => {
  const costString = recipe.costPerPortion || recipe.price || '';
  const match = costString.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export const getSavedRecipeTime = (recipe: SavedRecipe): number => {
  return recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);
};

export const isVegetarianSavedRecipe = (recipe: SavedRecipe): boolean => (
  passesHardConstraints(recipe, {
    dietaryRule: 'vegetarian',
    allergies: [],
    exclusions: [],
    religiousEthical: [],
    calorieCeiling: null,
    budgetLimit: null,
  })
);

export const isHighProteinSavedRecipe = (recipe: SavedRecipe): boolean => {
  const proteinText = [
    recipe.mainProtein,
    recipe.mainIngredient,
    recipe.mainIngredientCategory,
    recipe.title,
    ...(recipe.ingredients || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return /\b(chicken|turkey|fish|salmon|tuna|cod|haddock|prawn|shrimp|seafood|beef|steak|pork|ham|bacon|lamb|egg|eggs|tofu|tempeh|lentil|lentils|bean|beans|chickpea|chickpeas|quorn|seitan|yogurt|yoghurt|cottage cheese)\b/.test(proteinText);
};

export const getCompliantUnscheduledRecipes = (
  recipes: SavedRecipe[],
  preferences?: UserPreferences | null
) => {
  const safetyPrefs = buildSafetyPrefs(preferences);
  return recipes.filter(recipe => {
    if (recipe.scheduledDate) return false;
    return !safetyPrefs || passesHardConstraints(recipe, safetyPrefs);
  });
};

export const filterAndSortSavedRecipes = ({
  recipes,
  preferences,
  searchQuery,
  quickPills,
  convenienceFilter,
  sortBy,
}: {
  recipes: SavedRecipe[];
  preferences?: UserPreferences | null;
  searchQuery: string;
  quickPills: QuickPills;
  convenienceFilter: ConvenienceFilter;
  sortBy: SavedSortOption;
}) => {
  const query = searchQuery.trim();

  const processed = recipes
    .filter(recipe => {
      if (recipe.scheduledDate) return false;

      if (query && !checkSearchMatch(recipe, query)) return false;

      if (quickPills.under20) {
        const time = getSavedRecipeTime(recipe);
        if (!time || time > 20) return false;
      }

      if (quickPills.vegetarian) {
        if (!isVegetarianSavedRecipe(recipe)) return false;
      }

      if (quickPills.highProtein) {
        if (!isHighProteinSavedRecipe(recipe)) return false;
      }

      if (quickPills.batch && !recipe.batchCooking?.suitable) return false;

      if (convenienceFilter !== 'all') {
        const itemProfile = recipe.convenienceProfile || getConvenienceProfile(recipe);
        if (itemProfile !== convenienceFilter) return false;
      }

      return true;
    });

  return processed.sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'quickest') {
      const timeA = getSavedRecipeTime(a) || Number.MAX_SAFE_INTEGER;
      const timeB = getSavedRecipeTime(b) || Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    }
    if (sortBy === 'lowest-cost') {
      const costA = parseSavedRecipeCost(a) || Number.MAX_SAFE_INTEGER;
      const costB = parseSavedRecipeCost(b) || Number.MAX_SAFE_INTEGER;
      return costA - costB;
    }

    const timeA = (a.savedAt as any)?.seconds || 0;
    const timeB = (b.savedAt as any)?.seconds || 0;
    if (sortBy === 'oldest') return timeA - timeB;
    return timeB - timeA;
  });
};

export const findCostSavingSwaps = ({
  planner,
  savedRecipes,
  preferences,
  servings,
  limit = 5,
}: {
  planner: SavedRecipe[];
  savedRecipes: SavedRecipe[];
  preferences?: UserPreferences | null;
  servings: number;
  limit?: number;
}): CostSavingSwap[] => {
  const scheduled = planner.filter(item => !!item.scheduledDate);
  const unscheduledSaved = savedRecipes.filter(item => !item.scheduledDate);
  const safetyPrefs = buildSafetyPrefs(preferences);

  const totalCost = (item: SavedRecipe) => {
    const perPortion = parseSavedRecipeCost(item);
    const plannedServings = item.requestedServings || servings || item.totalServings || 1;
    return perPortion * plannedServings;
  };

  const swaps: CostSavingSwap[] = [];

  scheduled.forEach(current => {
    const currentCost = totalCost(current);
    if (currentCost <= 0) return;

    unscheduledSaved.forEach(candidate => {
      if (safetyPrefs && !passesHardConstraints(candidate, safetyPrefs)) return;
      const candidateCost = totalCost(candidate);
      const saving = currentCost - candidateCost;
      if (candidateCost <= 0 || saving < 1) return;
      swaps.push({ scheduled: current, replacement: candidate, saving });
    });
  });

  return swaps.sort((a, b) => b.saving - a.saving).slice(0, limit);
};

const addUniqueCandidates = <T extends Recipe | ReadyMeal>(
  items: T[],
  target: T[],
  targetCount: number,
  seenTitles: Set<string>
) => {
  for (const item of items) {
    const titleKey = item.title.toLowerCase();
    if (!seenTitles.has(titleKey) && target.length < targetCount) {
      target.push(item);
      seenTitles.add(titleKey);
    }
  }
};

const normalizeRequestedProteins = (
  requestedProtein: string | string[],
  dinnerCount: number,
  preferences?: UserPreferences | null
) => {
  const proteinList = Array.isArray(requestedProtein)
    ? requestedProtein.filter(Boolean)
    : requestedProtein ? [requestedProtein] : [];

  if (proteinList.includes('no-preference')) return ['no-preference'];

  if (proteinList.length > 0 && !proteinList.includes('mixed') && !proteinList.includes('no-preference')) {
    return proteinList.slice(0, dinnerCount);
  }
  if (preferences?.dietaryRule === 'vegetarian') return Array(dinnerCount).fill('vegetarian');
  if (preferences?.dietaryRule === 'vegan') return Array(dinnerCount).fill('vegan');
  return ['chicken', 'fish and seafood', 'vegetarian', 'pork', 'beef', 'pulses', 'turkey', 'lamb', 'eggs', 'tofu'];
};

const getProteinText = (protein: string) => {
  if (protein === 'mixed') return 'mixed proteins';
  if (protein === 'no-preference') return 'any suitable protein';
  if (protein === 'offal') return 'offal such as liver, kidney or heart';
  if (protein === 'seafood') return 'fish and seafood';
  if (protein === 'pescatarian') return 'pescatarian proteins';
  if (protein === 'plant-based') return 'tofu and plant-based protein';
  return protein;
};

const getProteinsText = (proteins: string[]) => {
  if (proteins.includes('no-preference')) return 'any suitable protein';
  const cleanProteins = proteins.map(getProteinText).filter(Boolean);
  if (cleanProteins.length === 0) return 'varied proteins';
  if (cleanProteins.length === 1) return cleanProteins[0];
  return `varied proteins across the week: ${cleanProteins.join(', ')}`;
};

const getTimeText = (time: WeeklyPlanTime) => {
  if (time === 'quick') return 'quick dinners';
  if (time === 'under30') return 'dinners under 30 minutes';
  if (time === 'under45') return 'dinners under 45 minutes';
  return 'varied dinners';
};

const getFallbackTimeText = (time: WeeklyPlanTime) => {
  if (time === 'quick') return 'quick';
  if (time === 'under30') return 'under 30 minute';
  if (time === 'under45') return 'under 45 minute';
  return 'weekday';
};

const getMaxTotalTime = (time: WeeklyPlanTime) => {
  if (time === 'under30') return 30;
  if (time === 'under45') return 45;
  return undefined;
};

export const createWeeklyDinnerPlan = async ({
  settings,
  planner,
  preferences,
  generateDinnerSuggestions,
  addLog,
}: {
  settings: WeeklyPlanSettings;
  planner: SavedRecipe[];
  preferences?: UserPreferences | null;
  generateDinnerSuggestions: GenerateDinnerSuggestions;
  addLog: (message: string) => void;
}): Promise<WeeklyPlanResult> => {
  const servingsCount = settings.servings;
  const budgetValue = Number(settings.budget);
  const perPortionBudget = Number.isFinite(budgetValue) && budgetValue > 0
    ? Number((budgetValue / settings.dinnerCount / servingsCount).toFixed(2))
    : undefined;
  const shouldApplyLowCostBias = perPortionBudget !== undefined && perPortionBudget <= 2;
  const shouldMinimiseCost = settings.minimiseCost === true;
  const shouldReuseIngredients = settings.reuseIngredients === true;
  const requestedProteins = normalizeRequestedProteins(settings.protein, settings.dinnerCount, preferences);
  const includeOffalForPlan = requestedProteins.includes('offal') || preferences?.includeOffal === true;
  const proteinText = getProteinsText(requestedProteins);
  const timeText = getTimeText(settings.time);
  const weeklySaladPreference = preferences?.saladPreference === 'main-only' ? 'main-only' : 'all';
  const homemadeTarget = Math.min(settings.homemadeCount, settings.dinnerCount);
  const readyMadeTarget = Math.max(settings.dinnerCount - homemadeTarget, 0);
  const existingPlannerTitles = planner.map(item => item.title);
  const baseSafetyPrefs = buildSafetyPrefs(preferences);
  const safetyPrefs = baseSafetyPrefs
    ? { ...baseSafetyPrefs, includeOffal: includeOffalForPlan }
    : null;
  const optimisationText = [
    shouldMinimiseCost ? 'prioritise the lowest credible full-shop cost' : '',
    shouldReuseIngredients ? 'reuse core ingredients and opened packs across the dinners, with practical leftovers' : '',
  ].filter(Boolean).join('; ');
  const optimisationClause = optimisationText ? `; ${optimisationText}` : '';
  const selectionSummary = [
    shouldMinimiseCost ? 'lower shopping cost' : '',
    shouldReuseIngredients ? 'ingredient reuse' : '',
  ].filter(Boolean).join(' and ');

  const makeParams = (
    query: string,
    sourceMode: DinnerSource,
    count: number,
    excludedTitles: string[]
  ) => cleanSearchParams(buildSearchParams(query, sourceMode, preferences || null, {
    count,
    servings: servingsCount,
    saladPreference: weeklySaladPreference,
    maxCostPerPortion: perPortionBudget,
    maxTotalTime: getMaxTotalTime(settings.time),
    isSimple: settings.time === 'quick' ? true : undefined,
    isLowCost: shouldApplyLowCostBias || shouldMinimiseCost,
    includeOffal: includeOffalForPlan,
    excludeTitles: excludedTitles,
  }));

  const homemadeItems: Recipe[] = [];
  const readyMadeItems: ReadyMeal[] = [];
  const seenTitles = new Set<string>();
  const addEligibleCandidates = <T extends Recipe | ReadyMeal>(items: T[], target: T[], targetCount: number) => {
    const eligible = safetyPrefs ? items.filter(item => passesHardConstraints(item, safetyPrefs)) : items;
    addUniqueCandidates(eligible, target, targetCount, seenTitles);
  };

  if (homemadeTarget > 0) {
    try {
      const query = `${homemadeTarget} cooked dinners for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}${optimisationClause}`;
      const params = makeParams(query, 'cook', homemadeTarget, existingPlannerTitles);
      const result = await generateDinnerSuggestions(params, preferences || undefined);
      addEligibleCandidates(result.recipes || [], homemadeItems, homemadeTarget);
    } catch (err: any) {
      addLog(`UI WARN: weekly batch generation failed, trying focused searches: ${err?.message || err}`);
    }
  }

  if (readyMadeTarget > 0) {
    try {
      const readyQuery = `${readyMadeTarget} UK supermarket ready-made dinner products for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}${optimisationClause}`;
      const readyParams = makeParams(readyQuery, 'ready-made', readyMadeTarget, [...existingPlannerTitles, ...homemadeItems.map(item => item.title)]);
      const readyResult = await generateDinnerSuggestions(readyParams, preferences || undefined);
      addEligibleCandidates(readyResult.readyMeals || [], readyMadeItems, readyMadeTarget);
    } catch (err: any) {
      addLog(`UI WARN: weekly ready-made generation failed: ${err?.message || err}`);
    }
  }

  const baseExcludedTitles = [...existingPlannerTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)];
  const fallbackProteins = requestedProteins;
  const fallbackTimeText = getFallbackTimeText(settings.time);

  for (let i = homemadeItems.length; i < homemadeTarget; i += 1) {
    const fallbackProtein = fallbackProteins[i % fallbackProteins.length];
    const fallbackQuery = `${fallbackTimeText} cooked ${getProteinText(fallbackProtein)} dinner for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}${optimisationClause}`;
    const fallbackParams = makeParams(fallbackQuery, 'cook', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

    try {
      const fallbackResult = await generateDinnerSuggestions(fallbackParams, preferences || undefined);
      addEligibleCandidates(fallbackResult.recipes || [], homemadeItems, homemadeTarget);
    } catch (err: any) {
      addLog(`UI WARN: weekly fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
    }
  }

  for (let i = readyMadeItems.length; i < readyMadeTarget; i += 1) {
    const fallbackProtein = fallbackProteins[(homemadeTarget + i) % fallbackProteins.length];
    const fallbackQuery = `${fallbackTimeText} UK supermarket ready-made ${getProteinText(fallbackProtein)} dinner product for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}${optimisationClause}`;
    const fallbackParams = makeParams(fallbackQuery, 'ready-made', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

    try {
      const fallbackResult = await generateDinnerSuggestions(fallbackParams, preferences || undefined);
      addEligibleCandidates(fallbackResult.readyMeals || [], readyMadeItems, readyMadeTarget);
    } catch (err: any) {
      addLog(`UI WARN: weekly ready-made fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
    }
  }

  const dinners = [...homemadeItems, ...readyMadeItems].slice(0, settings.dinnerCount);
  if (dinners.length === 0) {
    return {
      dinners,
      alert: 'No weekly dinners found within that budget. Try increasing the weekly budget, reducing the number of dinners, or choosing a different protein.',
    };
  }

  if (dinners.length < settings.dinnerCount) {
    return {
      dinners,
      alert: `Only ${dinners.length} suitable ${dinners.length === 1 ? 'dinner was' : 'dinners were'} found. Try increasing the budget, reducing the number of dinners, or changing the protein.`,
    };
  }

  return {
    dinners,
    alert: null,
    selectionSummary: selectionSummary ? `Selected for ${selectionSummary}, while respecting your saved preferences.` : undefined,
  };
};
