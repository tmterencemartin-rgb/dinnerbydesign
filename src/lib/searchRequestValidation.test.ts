import { describe, expect, it } from 'vitest';
import { validateSearchRequestPayload } from './searchRequestValidation';

describe('search request validation', () => {
  it('accepts a normal partial preference payload', () => {
    expect(validateSearchRequestPayload(
      { query: 'chicken, rice', source: 'cook', count: 3 },
      { allergies: ['peanut'], highProtein: true }
    )).toEqual({ ok: true });
  });

  it('accepts nullable saved budget and calorie limits', () => {
    expect(validateSearchRequestPayload(
      { query: 'chicken', source: 'cook', maxCostPerPortion: null },
      { calorieCeiling: null, budgetLimit: null, readyToEatUnderMins: null }
    )).toEqual({ ok: true });
  });

  it('rejects malformed preferences before they reach the search service', () => {
    expect(validateSearchRequestPayload(
      { query: 'chicken', source: 'cook' },
      { allergies: 'peanut' }
    )).toEqual({
      ok: false,
      code: 'SEARCH_REQUEST_INVALID',
      message: 'The saved preferences contains an invalid allergies value.'
    });
    expect(validateSearchRequestPayload(
      { query: 'chicken', source: 'cook' },
      ['not', 'an', 'object']
    )).toEqual({
      ok: false,
      code: 'PREFERENCES_INVALID',
      message: 'The saved preferences are invalid.'
    });
  });

  it('rejects oversized queries and filter arrays', () => {
    expect(validateSearchRequestPayload(
      { query: 'x'.repeat(501), source: 'cook' },
      undefined
    )).toEqual({
      ok: false,
      code: 'SEARCH_QUERY_TOO_LONG',
      message: 'Please shorten the search query and try again.'
    });
    expect(validateSearchRequestPayload(
      { query: 'chicken', source: 'cook', excludeTitles: Array.from({ length: 41 }, () => 'dish') },
      undefined
    )).toEqual({
      ok: false,
      code: 'SEARCH_REQUEST_TOO_LARGE',
      message: 'The search request contains too much filter information.'
    });
  });

  it('rejects result counts outside the supported range', () => {
    expect(validateSearchRequestPayload({ query: 'chicken', source: 'cook', count: 4 }, undefined)).toEqual({
      ok: false,
      code: 'SEARCH_REQUEST_INVALID',
      message: 'The requested result count is invalid.'
    });
  });
});
