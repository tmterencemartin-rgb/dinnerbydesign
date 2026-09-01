import { PantryItem, SavedRecipe, ShoppingListItem } from '../types';
import { safeStorage } from './storage';

export const GUEST_WORKSPACE_STORAGE_KEY = 'dbd_guest_workspace_v1';

export interface GuestWorkspace {
  savedRecipes: SavedRecipe[];
  shoppingList: ShoppingListItem[];
  pantry: PantryItem[];
  persistentPantryItems: string[];
}

/**
 * Returns a stable Firestore-safe ID for a guest recipe that has no saved ID.
 * The source URL is preferred because titles and recipe IDs can be reused by
 * different publishers.
 */
export const getGuestRecipeDocumentId = (recipe: Pick<SavedRecipe, 'id' | 'recipeId' | 'sourceUrl' | 'title' | 'cuisine' | 'mode'>): string => {
  if (recipe.id && !recipe.id.includes('/')) return recipe.id;

  const stableValue = recipe.sourceUrl || recipe.recipeId || `${recipe.mode}:${recipe.cuisine}:${recipe.title}`;
  const encoded = encodeURIComponent(stableValue).replace(/%/g, '_').slice(0, 400);
  return `guest-${encoded || 'recipe'}`;
};

const emptyGuestWorkspace = (): GuestWorkspace => ({
  savedRecipes: [],
  shoppingList: [],
  pantry: [],
  persistentPantryItems: [],
});

const reviveDate = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const readGuestWorkspace = (): GuestWorkspace => {
  const raw = safeStorage.getItem(GUEST_WORKSPACE_STORAGE_KEY);
  if (!raw) return emptyGuestWorkspace();

  try {
    const parsed = JSON.parse(raw) as Partial<GuestWorkspace>;
    return {
      savedRecipes: (Array.isArray(parsed.savedRecipes) ? parsed.savedRecipes : []).map(recipe => ({
        ...recipe,
        savedAt: reviveDate(recipe.savedAt),
        updatedAt: reviveDate(recipe.updatedAt),
        archivedAt: reviveDate(recipe.archivedAt),
      })) as unknown as SavedRecipe[],
      shoppingList: (Array.isArray(parsed.shoppingList) ? parsed.shoppingList : []).map(item => ({
        ...item,
        generatedAt: reviveDate(item.generatedAt),
      })) as unknown as ShoppingListItem[],
      pantry: (Array.isArray(parsed.pantry) ? parsed.pantry : []).map(item => ({
        ...item,
        lastUsed: reviveDate(item.lastUsed),
      })) as unknown as PantryItem[],
      persistentPantryItems: Array.isArray(parsed.persistentPantryItems)
        ? parsed.persistentPantryItems.filter((item): item is string => typeof item === 'string')
        : [],
    };
  } catch (error) {
    console.warn('[GuestWorkspace] Failed to read local workspace:', error);
    return emptyGuestWorkspace();
  }
};

export const writeGuestWorkspace = (workspace: GuestWorkspace): boolean => {
  return safeStorage.setItem(GUEST_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
};

export const clearGuestWorkspace = () => {
  safeStorage.removeItem(GUEST_WORKSPACE_STORAGE_KEY);
};
