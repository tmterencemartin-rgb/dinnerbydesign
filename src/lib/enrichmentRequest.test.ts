import { describe, expect, it } from 'vitest';
import {
  buildEnrichmentRequestBody,
  parseEnrichmentRequestOptions,
  validateEnrichmentRequestPayload,
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

  it('rejects malformed enrichment requests before model work starts', () => {
    expect(validateEnrichmentRequestPayload({ title: '', cuisine: 'British', mode: 'cook' })).toEqual({
      ok: false,
      code: 'ENRICHMENT_REQUEST_INVALID',
      message: 'The recipe title is invalid.'
    });
    expect(validateEnrichmentRequestPayload({ title: 'Chicken', cuisine: 'British', mode: 'cook', strictIngredientMatch: 'yes' })).toEqual({
      ok: false,
      code: 'ENRICHMENT_REQUEST_INVALID',
      message: 'The ingredient matching setting is invalid.'
    });
  });

  it('rejects oversized searches and non-content source links', () => {
    expect(validateEnrichmentRequestPayload({
      title: 'Chicken',
      cuisine: 'British',
      mode: 'cook',
      strictQuery: 'x'.repeat(501)
    })).toEqual({
      ok: false,
      code: 'ENRICHMENT_REQUEST_TOO_LARGE',
      message: 'Please shorten the ingredient search and try again.'
    });
    expect(validateEnrichmentRequestPayload({
      title: 'Chicken',
      cuisine: 'British',
      mode: 'cook',
      sourceUrl: 'https://example.com/search?q=chicken'
    })).toEqual({
      ok: false,
      code: 'ENRICHMENT_SOURCE_INVALID',
      message: 'The original recipe link is invalid.'
    });
  });
});
