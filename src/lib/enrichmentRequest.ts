export type EnrichmentRequestOptions = {
  strictIngredientMatch?: boolean;
  query?: string;
  sourceUrl?: string | null;
};

export type EnrichmentRequestBody = {
  title: string;
  cuisine: string;
  mode: 'cook' | 'ready-made';
  strictIngredientMatch: boolean;
  strictQuery: string;
  sourceUrl: string | null;
};

export function buildEnrichmentRequestBody(
  title: string,
  cuisine: string,
  mode: 'cook' | 'ready-made',
  options?: EnrichmentRequestOptions
): EnrichmentRequestBody {
  return {
    title,
    cuisine,
    mode,
    strictIngredientMatch: options?.strictIngredientMatch === true,
    strictQuery: options?.query || '',
    sourceUrl: options?.sourceUrl || null,
  };
}

export function parseEnrichmentRequestOptions(body: unknown): EnrichmentRequestOptions {
  if (!body || typeof body !== 'object') return {};

  const request = body as Record<string, unknown>;
  const sourceUrl = typeof request.sourceUrl === 'string' && request.sourceUrl.trim()
    ? request.sourceUrl
    : null;

  return {
    strictIngredientMatch: request.strictIngredientMatch === true,
    query: typeof request.strictQuery === 'string' ? request.strictQuery : '',
    sourceUrl,
  };
}
