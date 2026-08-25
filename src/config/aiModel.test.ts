import { describe, expect, it } from 'vitest';
import {
  ACTIVE_GEMINI_MODEL,
  ACTIVE_GEMINI_PRICING_USD_PER_MILLION,
  estimateGeminiCostUsd,
} from './aiModel';

describe('AI model configuration', () => {
  it('keeps the production search model and rates together', () => {
    expect(ACTIVE_GEMINI_MODEL).toBe('gemini-3.5-flash-lite');
    expect(ACTIVE_GEMINI_PRICING_USD_PER_MILLION).toEqual({ input: 0.3, output: 2.5 });
  });

  it('estimates cost from input and output token counts', () => {
    expect(estimateGeminiCostUsd(1_000_000, 1_000_000)).toBe(2.8);
  });

  it('does not produce negative cost estimates for invalid counts', () => {
    expect(estimateGeminiCostUsd(-10, -20)).toBe(0);
  });
});
