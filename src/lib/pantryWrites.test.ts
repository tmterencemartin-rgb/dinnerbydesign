import { describe, expect, it } from 'vitest';
import { buildPantryItemData } from './pantryWrites';

describe('pantryWrites', () => {
  it('builds pantry item data with explicit values', () => {
    expect(buildPantryItemData({
      id: 'pantry-1',
      name: 'Olive oil',
      category: 'Store cupboard',
      isStaple: true,
      userId: 'user-1',
      lastUsed: 'timestamp',
    })).toEqual({
      id: 'pantry-1',
      name: 'Olive oil',
      category: 'Store cupboard',
      isStaple: true,
      userId: 'user-1',
      lastUsed: 'timestamp',
    });
  });

  it('uses pantry defaults for category and staple state', () => {
    expect(buildPantryItemData({
      id: 'pantry-2',
      name: 'Salt',
      userId: 'user-1',
      lastUsed: 'timestamp',
    })).toMatchObject({
      category: 'Other',
      isStaple: false,
    });
  });
});
