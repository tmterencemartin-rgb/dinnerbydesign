import { describe, expect, it } from 'vitest';
import { ShoppingListItem } from '../types';
import { buildShoppingListSyncPlan } from './shoppingListWrites';

const item = (overrides: Partial<ShoppingListItem>): ShoppingListItem => ({
  id: overrides.id || 'item-1',
  name: overrides.name || '2 onions',
  nameRaw: overrides.nameRaw || overrides.name || '2 onions',
  ingredientKey: overrides.ingredientKey || 'onion',
  quantityNeeded: overrides.quantityNeeded || 2,
  unitNeeded: overrides.unitNeeded || 'each',
  category: overrides.category || 'Vegetables',
  checked: overrides.checked || false,
  inStock: overrides.inStock || false,
  sourceRecipeIds: overrides.sourceRecipeIds || [],
  sourceDays: overrides.sourceDays || [],
  generatedAt: overrides.generatedAt || null as any,
  userId: overrides.userId || 'user-1',
  stateHash: overrides.stateHash,
  excludedByPantry: overrides.excludedByPantry,
  isCustom: overrides.isCustom,
});

describe('shoppingListWrites', () => {
  it('deletes stale derived items but keeps custom items', () => {
    const dbItems = [
      item({ id: 'stale-derived' }),
      item({ id: 'custom-item', isCustom: true }),
    ];

    const plan = buildShoppingListSyncPlan(dbItems, []);

    expect(plan.staleDbItems.map(entry => entry.id)).toEqual(['stale-derived']);
    expect(plan.upsertItems).toEqual([]);
  });

  it('upserts new derived items', () => {
    const derived = item({ id: 'new-derived' });
    const plan = buildShoppingListSyncPlan([], [derived]);

    expect(plan.staleDbItems).toEqual([]);
    expect(plan.upsertItems.map(entry => entry.id)).toEqual(['new-derived']);
  });

  it('upserts changed derived items and ignores unchanged ones', () => {
    const unchangedDb = item({ id: 'same', stateHash: 'a', checked: false, name: 'Rice' });
    const changedDb = item({ id: 'changed', stateHash: 'a', checked: false, name: 'Pasta' });
    const derivedItems = [
      item({ id: 'same', stateHash: 'a', checked: false, name: 'Rice' }),
      item({ id: 'changed', stateHash: 'b', checked: false, name: 'Pasta' }),
    ];

    const plan = buildShoppingListSyncPlan([unchangedDb, changedDb], derivedItems);

    expect(plan.staleDbItems).toEqual([]);
    expect(plan.upsertItems.map(entry => entry.id)).toEqual(['changed']);
  });

  it('treats checked, name and pantry-exclusion changes as upserts', () => {
    const dbItems = [
      item({ id: 'checked', checked: false }),
      item({ id: 'renamed', name: 'Old name' }),
      item({ id: 'pantry', excludedByPantry: false }),
    ];
    const derivedItems = [
      item({ id: 'checked', checked: true }),
      item({ id: 'renamed', name: 'New name' }),
      item({ id: 'pantry', excludedByPantry: true }),
    ];

    const plan = buildShoppingListSyncPlan(dbItems, derivedItems);

    expect(plan.upsertItems.map(entry => entry.id)).toEqual(['checked', 'renamed', 'pantry']);
  });
});
