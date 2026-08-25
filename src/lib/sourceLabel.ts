const INTERNAL_GROUNDING_HOSTS = new Set([
  'vertexaisearch.cloud.google.com',
  'vertexaisearch.googleapis.com'
]);

export const getRecipeSourceLabel = (sourceUrl: unknown): string => {
  if (typeof sourceUrl !== 'string' || !sourceUrl.trim()) return 'Source page';

  try {
    const host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, '');
    if (INTERNAL_GROUNDING_HOSTS.has(host) || host.endsWith('.vertexaisearch.cloud.google.com')) {
      return 'Source page';
    }
    return host || 'Source page';
  } catch {
    return 'Source page';
  }
};
