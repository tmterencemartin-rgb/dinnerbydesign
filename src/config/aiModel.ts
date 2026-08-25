export const ACTIVE_GEMINI_MODEL = 'gemini-3.1-flash-lite' as const;
export const ENRICHMENT_GEMINI_MODEL = 'gemini-3.5-flash' as const;

export const ACTIVE_GEMINI_PRICING_USD_PER_MILLION = {
  input: 0.25,
  output: 1.5,
} as const;

export function estimateGeminiCostUsd(inputTokens: number, outputTokens: number): number {
  return (Math.max(inputTokens || 0, 0) / 1_000_000) * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.input +
    (Math.max(outputTokens || 0, 0) / 1_000_000) * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.output;
}
