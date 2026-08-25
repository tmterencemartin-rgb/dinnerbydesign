export type GroundedSource = {
  url: string;
  title?: string;
};

export const canonicaliseGroundedUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value.trim())) return null;
  try {
    const url = new URL(value.trim());
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
};

const normaliseGroundedUrlForMatch = (value: string): string => {
  const url = new URL(value);
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  url.hash = '';

  const meaningfulParams = [...url.searchParams.entries()]
    .filter(([key]) => !/^(utm_[^=]+|gclid|fbclid|dclid|msclkid)$/i.test(key))
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => (
      leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue)
    ));
  url.search = new URLSearchParams(meaningfulParams).toString();

  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
  return url.toString().replace(/\/$/, '');
};

export const reconcileGroundedSourceUrl = (
  candidate: unknown,
  sources: GroundedSource[]
): string | null => {
  const canonicalCandidate = canonicaliseGroundedUrl(candidate);
  if (!canonicalCandidate) return null;

  const exactMatch = sources.find(source => canonicaliseGroundedUrl(source.url) === canonicalCandidate);
  if (exactMatch) return canonicaliseGroundedUrl(exactMatch.url);

  const candidateMatchKey = normaliseGroundedUrlForMatch(canonicalCandidate);
  const relaxedMatch = sources.find(source => {
    const canonicalSource = canonicaliseGroundedUrl(source.url);
    return canonicalSource && normaliseGroundedUrlForMatch(canonicalSource) === candidateMatchKey;
  });

  return relaxedMatch ? canonicaliseGroundedUrl(relaxedMatch.url) : null;
};

export const retainCandidateSourceUrl = (
  candidate: unknown,
  sources: GroundedSource[]
): string | null => {
  const canonicalCandidate = canonicaliseGroundedUrl(candidate);
  if (!canonicalCandidate) return null;

  // Google Search occasionally returns recipe text without its grounding
  // metadata. In that case there is no source set to reconcile against, so
  // retain only a valid page URL instead of turning every recipe into a false
  // negative. When metadata is present, continue to require an exact match.
  return sources.length === 0
    ? canonicalCandidate
    : reconcileGroundedSourceUrl(canonicalCandidate, sources);
};

export const isInternalGroundingUrl = (value: unknown): boolean => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;

  const host = new URL(canonicalUrl).hostname.toLowerCase();
  return host === 'vertexaisearch.cloud.google.com'
    || host === 'vertexaisearch.googleapis.com'
    || host.endsWith('.vertexaisearch.cloud.google.com');
};
