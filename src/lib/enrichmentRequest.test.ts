import { describe, expect, it } from 'vitest';
import {
  buildEnrichmentRequestBody,
  parseEnrichmentRequestOptions,
} from './enrichmentRequest';

describe('enrichment request mapping', () => {
  it('forwards the grounded source URL and strict-search options', () => {
    const body = buildEnrichmentRequestBody('Chicken rice', 'British', 'cook', {
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
      strictIngredientMatch: true,
      query: 'chicken, rice',
    });

    expect(body).toEqual({
      title: 'Chicken rice',
      cuisine: 'British',
      mode: 'cook',
      strictIngredientMatch: true,
      strictQuery: 'chicken, rice',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
    });
  });

  it('maps the proxy request back to enrichment options', () => {
    expect(parseEnrichmentRequestOptions({
      strictIngredientMatch: true,
      strictQuery: 'chicken, rice',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
    })).toEqual({
      strictIngredientMatch: true,
      query: 'chicken, rice',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-rice',
    });
  });

  it('does not pass blank or non-string source URLs downstream', () => {
    expect(parseEnrichmentRequestOptions({ sourceUrl: '   ' })).toEqual({
      strictIngredientMatch: false,
      query: '',
      sourceUrl: null,
    });
    expect(parseEnrichmentRequestOptions({ sourceUrl: 42 })).toEqual({
      strictIngredientMatch: false,
      query: '',
      sourceUrl: null,
    });
  });
});
