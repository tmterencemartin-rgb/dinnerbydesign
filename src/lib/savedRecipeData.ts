import { ReadyMeal, Recipe, SavedRecipe } from '../types';
import { getConvenienceProfile, getRecipeKey, getSourceUrl } from './recipeUtils';

export interface SavedRecipeTimestamps {
  savedAt: unknown;
  updatedAt: unknown;
}

export const prepareSavedRecipeData = (
  item: Recipe | ReadyMeal | SavedRecipe,
  userId: string,
  scheduledDate: string | null = null,
  timestamps: SavedRecipeTimestamps
) => {
  const recipeId = getRecipeKey(item);
  const data: Record<string, unknown> = {
    recipeId,
    title: item.title,
    description: item.description || undefined,
    cuisine: item.cuisine || undefined,
    totalTime: item.totalTime || undefined,
    calories: item.calories || undefined,
    mode: ('mode' in item && item.mode) ? item.mode : ('retailer' in item ? 'ready-made' : 'cook'),
    saladType: ('saladType' in item && item.saladType) ? item.saladType : undefined,
    category: ('category' in item && item.category) ? item.category : undefined,
    convenienceProfile: item.convenienceProfile || getConvenienceProfile(item),
    savedAt: timestamps.savedAt,
    updatedAt: timestamps.updatedAt,
    isArchived: false,
    archivedAt: null,
    personalNote: ('personalNote' in item) ? item.personalNote : undefined,
    userId,
    scheduledDate,
    requestedServings: (item as any).requestedServings || undefined,
    totalServings: (item as any).totalServings || undefined,
    mainProtein: item.mainProtein || undefined,
    mainIngredient: item.mainIngredient || undefined,
    mainIngredientCategory: item.mainIngredientCategory || undefined,
    isNutritious: item.isNutritious,
    nutritiousReason: item.nutritiousReason,
    sourceUrl: getSourceUrl(item),
    totalIngredientsCount: (item as any).totalIngredientsCount || undefined,
    isVegetarian: ('isVegetarian' in item) ? item.isVegetarian : undefined,
    isPescatarian: ('isPescatarian' in item) ? item.isPescatarian : undefined,
    isVegan: ('isVegan' in item) ? item.isVegan : undefined,
    dietFlagsVerified: ('dietFlagsVerified' in item) ? item.dietFlagsVerified : undefined,
    isAirFryerFriendly: ('isAirFryerFriendly' in item) ? item.isAirFryerFriendly : undefined,
    realityChecks: (item as any).realityChecks || undefined,
  };

  if ('ingredients' in item) {
    data.ingredients = item.ingredients;
    data.instructions = item.instructions;
    data.prepTime = item.prepTime || undefined;
    data.cookTime = item.cookTime || undefined;
    data.costPerPortion = item.costPerPortion || undefined;
  }

  if ('retailer' in item) {
    data.retailer = item.retailer;
    data.price = item.price;
    data.servingSuggestion = item.servingSuggestion || undefined;
    data.readyMadeKit = item.readyMadeKit || undefined;
  }

  const clean: Record<string, unknown> = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) clean[key] = data[key];
  });
  return clean;
};
