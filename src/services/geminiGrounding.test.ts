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
});
