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

  it('a first call that never returns makes one model call', async () => {
    generateContent.mockReturnValue(new Promise(() => {}));
    const result = generateDinnerSuggestions(searchParams());

    const assertion = expect(result).rejects.toBeInstanceOf(GeminiServiceError);
    await vi.advanceTimersByTimeAsync(120_000);
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('preserves a GeminiServiceError category through the outer search catch', async () => {
    generateContent.mockRejectedValue(new GeminiServiceError('network', 'known network failure'));
    const result = generateDinnerSuggestions(searchParams());

    await expect(result).rejects.toMatchObject({ category: 'network', message: 'known network failure' });
  });
});
