import { describe, expect, it, vi } from 'vitest';

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
  Type: {}
}));

vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  signInAnon: vi.fn()
}));

import { filterToGroundedSources } from './geminiService';

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

  it('accepts a non-approved publisher only when its grounded URL is a direct HTTPS page', () => {
    const groundedSources = new Map([
      ['https://example.com/recipes/scallops', { url: 'https://example.com/recipes/scallops' }]
    ]);
    const candidate = { title: 'Grounded recipe', sourceUrl: 'https://example.com/recipes/scallops' };

    expect(filterToGroundedSources([candidate], groundedSources)).toEqual([candidate]);
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
});
