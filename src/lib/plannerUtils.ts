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

export type WeeklyPlanTime = 'any' | 'quick' | 'under30';

export interface WeeklyPlanSettings {
  dinnerCount: 3 | 5 | 7;
  budget: string;
  servings: number;
  protein: string;
  time: WeeklyPlanTime;
  homemadeCount: number;
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
}

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
  const safetyPrefs = buildSafetyPrefs(preferences);
  const query = searchQuery.trim();

  const processed = recipes
    .filter(recipe => {
      if (recipe.scheduledDate) return false;
      if (safetyPrefs && !passesHardConstraints(recipe, safetyPrefs)) return false;

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

const getFallbackProteins = (
  requestedProtein: string,
  dinnerCount: number,
  preferences?: UserPreferences | null
) => {
  if (requestedProtein !== 'mixed') return Array(dinnerCount).fill(requestedProtein);
  if (preferences?.dietaryRule === 'vegetarian') return Array(dinnerCount).fill('vegetarian');
  if (preferences?.dietaryRule === 'vegan') return Array(dinnerCount).fill('vegan');
  return ['chicken', 'fish', 'vegetarian', 'pork', 'beef', 'pulses', 'turkey'];
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
  const proteinText = settings.protein === 'mixed' ? 'mixed proteins' : settings.protein;
  const timeText = settings.time === 'quick'
    ? 'quick dinners'
    : settings.time === 'under30'
      ? 'dinners under 30 minutes'
      : 'varied dinners';
  const weeklySaladPreference = preferences?.saladPreference === 'main-only' ? 'main-only' : 'all';
  const homemadeTarget = Math.min(settings.homemadeCount, settings.dinnerCount);
  const readyMadeTarget = Math.max(settings.dinnerCount - homemadeTarget, 0);
  const existingPlannerTitles = planner.map(item => item.title);

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
    maxTotalTime: settings.time === 'under30' ? 30 : undefined,
    isSimple: settings.time === 'quick' ? true : undefined,
    isLowCost: shouldApplyLowCostBias,
    excludeTitles: excludedTitles,
  }));

  const homemadeItems: Recipe[] = [];
  const readyMadeItems: ReadyMeal[] = [];
  const seenTitles = new Set<string>();

  if (homemadeTarget > 0) {
    try {
      const query = `${homemadeTarget} cooked dinners for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}`;
      const params = makeParams(query, 'cook', homemadeTarget, existingPlannerTitles);
      const result = await generateDinnerSuggestions(params, preferences || undefined);
      addUniqueCandidates(result.recipes || [], homemadeItems, homemadeTarget, seenTitles);
    } catch (err: any) {
      addLog(`UI WARN: weekly batch generation failed, trying focused searches: ${err?.message || err}`);
    }
  }

  if (readyMadeTarget > 0) {
    try {
      const readyQuery = `${readyMadeTarget} UK supermarket ready-made dinner products for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}`;
      const readyParams = makeParams(readyQuery, 'ready-made', readyMadeTarget, [...existingPlannerTitles, ...homemadeItems.map(item => item.title)]);
      const readyResult = await generateDinnerSuggestions(readyParams, preferences || undefined);
      addUniqueCandidates(readyResult.readyMeals || [], readyMadeItems, readyMadeTarget, seenTitles);
    } catch (err: any) {
      addLog(`UI WARN: weekly ready-made generation failed: ${err?.message || err}`);
    }
  }

  const baseExcludedTitles = [...existingPlannerTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)];
  const fallbackProteins = getFallbackProteins(settings.protein, settings.dinnerCount, preferences);

  for (let i = homemadeItems.length; i < homemadeTarget; i += 1) {
    const fallbackProtein = fallbackProteins[i % fallbackProteins.length];
    const fallbackQuery = `${settings.time === 'under30' ? 'under 30 minute' : settings.time === 'quick' ? 'quick' : 'weekday'} cooked ${fallbackProtein} dinner for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}`;
    const fallbackParams = makeParams(fallbackQuery, 'cook', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

    try {
      const fallbackResult = await generateDinnerSuggestions(fallbackParams, preferences || undefined);
      addUniqueCandidates(fallbackResult.recipes || [], homemadeItems, homemadeTarget, seenTitles);
    } catch (err: any) {
      addLog(`UI WARN: weekly fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
    }
  }

  for (let i = readyMadeItems.length; i < readyMadeTarget; i += 1) {
    const fallbackProtein = fallbackProteins[(homemadeTarget + i) % fallbackProteins.length];
    const fallbackQuery = `${settings.time === 'under30' ? 'under 30 minute' : settings.time === 'quick' ? 'quick' : 'weekday'} UK supermarket ready-made ${fallbackProtein} dinner product for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}`;
    const fallbackParams = makeParams(fallbackQuery, 'ready-made', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

    try {
      const fallbackResult = await generateDinnerSuggestions(fallbackParams, preferences || undefined);
      addUniqueCandidates(fallbackResult.readyMeals || [], readyMadeItems, readyMadeTarget, seenTitles);
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

  return { dinners, alert: null };
};
