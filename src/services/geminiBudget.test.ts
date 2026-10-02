// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const generateContent = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
  Type: {
    OBJECT: 'OBJECT', ARRAY: 'ARRAY', STRING: 'STRING', NUMBER: 'NUMBER', BOOLEAN: 'BOOLEAN'
  }
}));

vi.mock('../firebase', () => ({
  auth: { currentUser: null },
  signInAnon: vi.fn()
}));

import { generateDinnerSuggestions, GeminiServiceError } from './geminiService';

const searchParams = () => ({ query: 'chicken curry', count: 3, source: 'cook' as const });

describe('published recipe search time budget', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    generateContent.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns a retryable network error when the first call never settles', async () => {
    generateContent.mockReturnValue(new Promise(() => {}));
    const result = generateDinnerSuggestions(searchParams());

    const assertion = expect(result).rejects.toMatchObject({
      name: 'GeminiServiceError',
      category: 'network',
      message: 'Our search service is experiencing a temporary issue. Please try again.'
    });
    await vi.advanceTimersByTimeAsync(40_000);
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('keeps an empty result found before the deadline and completes one repair', async () => {
    generateContent
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ text: '{"items":[]}' }), 27_500)))
      .mockReturnValue(new Promise(() => {}));
    const result = generateDinnerSuggestions(searchParams());

    const assertion = expect(result).resolves.toMatchObject({ recipes: [] });
    await vi.advanceTimersByTimeAsync(70_000);
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it('stops retrying at the deadline when each call takes 12 s and then fails with a 503', async () => {
    generateContent.mockImplementation(() => new Promise((_, reject) => {
      setTimeout(() => reject(Object.assign(new Error('503 service unavailable'), { status: 503 })), 12_000);
    }));
    const result = generateDinnerSuggestions(searchParams());

    const assertion = expect(result).rejects.toMatchObject({
      message: 'Our search service is experiencing a temporary issue. Please try again.'
    });
    await vi.advanceTimersByTimeAsync(120_000);
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(3);
  });

  it('returns a recipe found before the deadline without starting a late round', async () => {
    const recipe = {
      title: 'Budget test chicken curry',
      description: 'A simple curry.',
      cuisine: 'Indian',
      totalTime: 40,
      totalServings: 2,
      ingredients: ['400g chicken thighs', '1 onion'],
      totalIngredientsCount: 2,
      sourceUrl: 'https://www.kitchensanctuary.com/budget-deadline-test-recipe',
      realityChecks: [{ label: 'Cost', note: 'Uses common ingredients.', tone: 'positive' }]
    };
    generateContent
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ text: JSON.stringify({ items: [recipe] }) }), 26_000)))
      .mockReturnValue(new Promise(() => {}));
    vi.stubGlobal('fetch', vi.fn(() => new Promise(resolve => {
      setTimeout(() => resolve({ status: 200, url: recipe.sourceUrl, text: async () => '<title>Budget test chicken curry | Kitchen Sanctuary</title>' }), 3_000);
    })));

    const result = generateDinnerSuggestions(searchParams());
    const assertion = expect(result).resolves.toMatchObject({
      recipes: [expect.objectContaining({ title: recipe.title })]
    });
    await vi.advanceTimersByTimeAsync(70_000);
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('preserves a GeminiServiceError category through the outer search catch', async () => {
    generateContent.mockRejectedValue(new GeminiServiceError('network', 'known network failure'));
    const result = generateDinnerSuggestions(searchParams());

    await expect(result).rejects.toMatchObject({ category: 'network', message: 'known network failure' });
  });
});
