// Recipe search combines Google grounding with structured recipe data. Keep it on
// the fuller Flash model; Flash-Lite remains available only as a fallback.
export const ACTIVE_GEMINI_MODEL = 'gemini-3.5-flash' as const;
export const ENRICHMENT_GEMINI_MODEL = 'gemini-3.5-flash' as const;

export const ACTIVE_GEMINI_PRICING_USD_PER_MILLION = {
  input: 1.5,
  output: 9,
} as const;

export function estimateGeminiCostUsd(inputTokens: number, outputTokens: number): number {
  return (Math.max(inputTokens || 0, 0) / 1_000_000) * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.input +
    (Math.max(outputTokens || 0, 0) / 1_000_000) * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.output;
}
