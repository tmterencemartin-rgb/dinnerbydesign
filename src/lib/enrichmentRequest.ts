import { isDirectHttpsContentUrl } from './groundingUtils';

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

export type EnrichmentRequestValidationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

const invalid = (code: string, message: string): EnrichmentRequestValidationResult => ({
  ok: false,
  code,
  message
});

export const validateEnrichmentRequestPayload = (body: unknown): EnrichmentRequestValidationResult => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return invalid('ENRICHMENT_REQUEST_INVALID', 'The enrichment request is invalid.');
  }

  const request = body as Record<string, unknown>;
  if (typeof request.title !== 'string' || !request.title.trim() || request.title.trim().length > 240) {
    return invalid('ENRICHMENT_REQUEST_INVALID', 'The recipe title is invalid.');
  }
  if (typeof request.cuisine !== 'string' || request.cuisine.trim().length > 120) {
    return invalid('ENRICHMENT_REQUEST_INVALID', 'The recipe cuisine is invalid.');
  }
  if (request.mode !== 'cook' && request.mode !== 'ready-made') {
    return invalid('ENRICHMENT_REQUEST_INVALID', 'The enrichment mode is invalid.');
  }
  if (Object.prototype.hasOwnProperty.call(request, 'strictIngredientMatch')
    && typeof request.strictIngredientMatch !== 'boolean') {
    return invalid('ENRICHMENT_REQUEST_INVALID', 'The ingredient matching setting is invalid.');
  }
  if (Object.prototype.hasOwnProperty.call(request, 'strictQuery')
    && (typeof request.strictQuery !== 'string' || request.strictQuery.trim().length > 500)) {
    return invalid('ENRICHMENT_REQUEST_TOO_LARGE', 'Please shorten the ingredient search and try again.');
  }
  if (request.sourceUrl !== undefined && request.sourceUrl !== null
    && !isDirectHttpsContentUrl(request.sourceUrl)) {
    return invalid('ENRICHMENT_SOURCE_INVALID', 'The original recipe link is invalid.');
  }

  return { ok: true };
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
