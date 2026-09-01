import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeStorage } from './storage';
import {
  GUEST_WORKSPACE_STORAGE_KEY,
  getGuestRecipeDocumentId,
  readGuestWorkspace,
  writeGuestWorkspace,
} from './guestWorkspace';

describe('guest workspace persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a stable ID for a legacy recipe without an ID', () => {
    const recipe = {
      recipeId: '',
      sourceUrl: 'https://example.com/recipes/chicken-curry',
      title: 'Chicken Curry',
      cuisine: 'Indian',
      mode: 'cook' as const,
    };

    expect(getGuestRecipeDocumentId(recipe)).toBe(getGuestRecipeDocumentId(recipe));
    expect(getGuestRecipeDocumentId(recipe)).toContain('guest-');
    expect(getGuestRecipeDocumentId(recipe)).not.toContain('/');
  });

  it('preserves an existing guest ID so migration retries target the same document', () => {
    const recipe = {
      id: 'guest-123',
      recipeId: 'recipe-1',
      title: 'Chicken Curry',
      cuisine: 'Indian',
      mode: 'cook' as const,
    };

    expect(getGuestRecipeDocumentId(recipe)).toBe('guest-123');
  });

  it('reports when the browser refuses a guest workspace write', () => {
    vi.spyOn(safeStorage, 'setItem').mockReturnValue(false);

    expect(writeGuestWorkspace({
      savedRecipes: [],
      shoppingList: [],
      pantry: [],
      persistentPantryItems: [],
    })).toBe(false);
  });

  it('returns a clean workspace for malformed stored data', () => {
    window.localStorage.setItem(GUEST_WORKSPACE_STORAGE_KEY, '{not-json');

    expect(readGuestWorkspace()).toEqual({
      savedRecipes: [],
      shoppingList: [],
      pantry: [],
      persistentPantryItems: [],
    });
  });
});
