import { describe, expect, it, vi } from 'vitest';

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
  Type: {}
}));

vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  signInAnon: vi.fn()
}));

import { filterToGroundedSources, getRecipePublisherKey, selectPublisherVariedRecipes } from './geminiService';

describe('Gemini search grounding filters', () => {
  it('uses the current response source set so a metadata-free recovery can use an approved direct page', () => {
    const initialSources = new Map([
      ['https://www.bbcgoodfood.com/recipes/initial', { url: 'https://www.bbcgoodfood.com/recipes/initial' }]
    ]);
    const recoveryCandidate = {
      title: 'Recovery recipe',
      sourceUrl: 'https://www.kitchensanctuary.com/recovery-recipe/'
    };

    expect(filterToGroundedSources([recoveryCandidate], initialSources)).toEqual([]);
    expect(filterToGroundedSources([recoveryCandidate], new Map())).toEqual([{
      ...recoveryCandidate,
      sourceUrl: 'https://www.kitchensanctuary.com/recovery-recipe'
    }]);
  });

  it('rejects a grounded publisher outside the approved source list', () => {
    const groundedSources = new Map([
      ['https://example.com/recipes/scallops', { url: 'https://example.com/recipes/scallops' }]
    ]);
    const candidate = { title: 'Grounded recipe', sourceUrl: 'https://example.com/recipes/scallops' };

    expect(filterToGroundedSources([candidate], groundedSources)).toEqual([]);
  });

  it('rejects a grounded recipe page when the publisher requires a trial or sign-in', () => {
    const groundedSources = new Map([
      ['https://www.mob.co.uk/recipes/chicken-traybake', { url: 'https://www.mob.co.uk/recipes/chicken-traybake' }]
    ]);

    expect(filterToGroundedSources([{
      title: 'Chicken traybake',
      sourceUrl: 'https://www.mob.co.uk/recipes/chicken-traybake'
    }], groundedSources)).toEqual([]);
  });

  it('rejects grounded HTTP and search URLs', () => {
    const httpSource = new Map([
      ['http://example.com/recipes/scallops', { url: 'http://example.com/recipes/scallops' }]
    ]);
    const searchSource = new Map([
      ['https://example.com/search?q=scallops', { url: 'https://example.com/search?q=scallops' }]
    ]);

    expect(filterToGroundedSources([{ sourceUrl: 'http://example.com/recipes/scallops' }], httpSource)).toEqual([]);
    expect(filterToGroundedSources([{ sourceUrl: 'https://example.com/search?q=scallops' }], searchSource)).toEqual([]);
  });

  it('prefers different recipe publishers while retaining same-publisher fallbacks for narrow searches', () => {
    const bbcFirst = { title: 'First BBC recipe', sourceUrl: 'https://www.bbcgoodfood.com/recipes/first' };
    const bbcSecond = { title: 'Second BBC recipe', sourceUrl: 'https://www.bbcgoodfood.com/recipes/second' };
    const guardian = { title: 'Guardian recipe', sourceUrl: 'https://www.theguardian.com/food/recipe' };

    expect(getRecipePublisherKey('https://www.bbcgoodfood.com/recipes/first')).toBe('bbcgoodfood.com');
    expect(selectPublisherVariedRecipes([bbcFirst, bbcSecond, guardian], 3)).toEqual([bbcFirst, guardian, bbcSecond]);
    expect(selectPublisherVariedRecipes([bbcFirst, bbcSecond], 3)).toEqual([bbcFirst, bbcSecond]);
  });
});
