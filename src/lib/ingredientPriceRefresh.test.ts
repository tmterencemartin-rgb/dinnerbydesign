import { describe, expect, it } from 'vitest';
import {
  catalogueEntryMatchesFeedItem,
  ingredientPriceDocumentId,
  parseLicensedIngredientPriceFeed,
} from './ingredientPriceRefresh';

const validItem = {
  ingredientKey: 'Chicken Breast',
  aliases: ['Chicken breasts'],
  productLabel: 'British chicken breast fillets',
  retailer: 'Licensed UK retailer feed',
  packPrice: 4.25,
  packQuantity: 600,
  packUnit: 'g',
  sourceUrl: 'https://data-provider.example/products/chicken-123',
  observedAt: '2026-07-18T08:00:00Z',
  feedId: 'chicken-123',
};

describe('licensed ingredient price feed', () => {
  it('normalises a valid feed item', () => {
    expect(parseLicensedIngredientPriceFeed({ items: [validItem] })).toEqual([{
      ...validItem,
      ingredientKey: 'chicken breast',
      aliases: ['chicken breasts'],
      observedAt: '2026-07-18T08:00:00.000Z',
    }]);
  });

  it('rejects non-HTTPS source URLs', () => {
    expect(() => parseLicensedIngredientPriceFeed([{ ...validItem, sourceUrl: 'http://example.com/item' }]))
      .toThrow('must use HTTPS');
  });

  it('rejects duplicate ingredient keys', () => {
    expect(() => parseLicensedIngredientPriceFeed([validItem, validItem]))
      .toThrow('duplicate ingredientKey');
  });

  it('detects whether a published entry is unchanged', () => {
    const [item] = parseLicensedIngredientPriceFeed([validItem]);
    expect(catalogueEntryMatchesFeedItem(item, item)).toBe(true);
    expect(catalogueEntryMatchesFeedItem({ ...item, packPrice: 4 }, item)).toBe(false);
  });

  it('creates stable Firestore document ids', () => {
    expect(ingredientPriceDocumentId(' Fish & Seafood ')).toBe('fish-seafood');
  });
});
