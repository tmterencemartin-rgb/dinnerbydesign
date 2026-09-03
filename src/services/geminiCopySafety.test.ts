import { describe, expect, it, vi } from 'vitest';

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
  Type: {}
}));

vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  signInAnon: vi.fn()
}));

import { replaceForbiddenDinnerCopy, sanitizeGeneratedCopy } from './geminiService';

describe('generated copy safety', () => {
  it('keeps generated copy within the dinner terminology rule', () => {
    expect(replaceForbiddenDinnerCopy('A quick meal for two.')).toBe('A quick dinner for two.');
    expect(replaceForbiddenDinnerCopy('Three easy meals')).toBe('Three easy dinners');
    expect(replaceForbiddenDinnerCopy('Dinner is ready')).toBe('Dinner is ready');
  });

  it('sanitises nested detail copy without changing source links', () => {
    expect(sanitizeGeneratedCopy({
      description: 'A comforting meal.',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken'
    })).toEqual({
      description: 'A comforting dinner.',
      sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken'
    });
  });
});
