import { describe, expect, it } from 'vitest';
import { ShoppingListItem } from '../types';
import {
  calculateShoppingCostSummary,
  costItemSync,
  INGREDIENT_PRICE_CATALOGUE,
  INGREDIENT_PRICE_CATALOGUE_META,
} from './groceryService';

const makeItem = (name: string, category: string): ShoppingListItem => ({
  id: name,
  name,
  nameRaw: name,
  ingredientKey: name,
  quantityNeeded: 1,
  unitNeeded: 'each',
  category,
  checked: false,
  sourceRecipeIds: ['recipe-1'],
  sourceDays: ['monday'],
  generatedAt: null as any,
  userId: 'user-1',
});

describe('ingredient price catalogue', () => {
  it('distinguishes proportional ingredient cost from full-pack checkout cost', () => {
    const chicken = costItemSync(makeItem('200g chicken breast', 'Meat & fish'));

    expect(chicken.costing?.recipeCost).toBe(1.5);
    expect(chicken.costing?.basketCost).toBe(3);
    expect(chicken.costing?.packsRequired).toBe(1);
    expect(chicken.flags).toContain('reference_price_match');
    expect(INGREDIENT_PRICE_CATALOGUE.chicken).toMatchObject({
      ingredientKey: 'chicken',
      packPrice: 3,
      packQuantity: 400,
      packUnit: 'g',
      catalogueVersion: INGREDIENT_PRICE_CATALOGUE_META.version,
    });
  });

  it('reports reference, fallback and excluded-staple coverage', () => {
    const summary = calculateShoppingCostSummary([
      makeItem('200g chicken breast', 'Meat & fish'),
      makeItem('1 courgette', 'Veg & fruit'),
      makeItem('Salt to taste', 'Cupboard'),
    ]);

    expect(summary.proportionalTotal).toBeCloseTo(2.3);
    expect(summary.checkoutTotal).toBeCloseTo(3.8);
    expect(summary.pricedItemCount).toBe(2);
    expect(summary.referenceMatchCount).toBe(1);
    expect(summary.fallbackMatchCount).toBe(1);
    expect(summary.excludedStapleCount).toBe(1);
    expect(INGREDIENT_PRICE_CATALOGUE_META.sourceType).toBe('curated-reference');
  });
});
