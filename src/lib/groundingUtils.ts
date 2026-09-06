export type GroundedSource = {
  url: string;
  title?: string;
};

const TRUSTED_RECIPE_PUBLISHER_HOSTS = new Set([
  'bbcgoodfood.com',
  'bbc.co.uk',
  'tescorealfood.com',
  'tesco.com',
  'theguardian.com',
  'deliciousmagazine.co.uk',
  'thehappyfoodie.co.uk',
  'deliaonline.com',
  'nigella.com',
  'foodnetwork.co.uk',
  'pinchofnom.com',
  'maryberry.co.uk',
  'greatbritishrecipes.com',
  'recipetineats.com',
  'gressinghamduck.co.uk',
  'kitchensanctuary.com',
  'diabetes.org.uk',
  'slimmingworld.co.uk',
  'jamieoliver.com',
  'waitrose.com',
  'asda.com',
  'sainsburysmagazine.co.uk',
  'olivemagazine.com',
  'greatbritishchefs.com',
  'telegraph.co.uk',
  'thetimes.com',
  'thesundaytimes.co.uk',
  'goodhousekeeping.com'
]);

// These publishers require sign-in, payment, a trial or an app before a visitor
// can rely on the recipe. Do not send DinnerByDesign visitors to that barrier.
const BLOCKED_RECIPE_PUBLISHER_HOSTS = new Set([
  'mob.co.uk'
]);

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

export const isTrustedRecipePublisherUrl = (value: unknown): boolean => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;

  const host = new URL(canonicalUrl).hostname.toLowerCase().replace(/^www\./, '');
  return TRUSTED_RECIPE_PUBLISHER_HOSTS.has(host);
};

export const isBlockedRecipePublisherUrl = (value: unknown): boolean => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;

  const host = new URL(canonicalUrl).hostname.toLowerCase().replace(/^www\./, '');
  return [...BLOCKED_RECIPE_PUBLISHER_HOSTS].some(domain => host === domain || host.endsWith(`.${domain}`));
};

export const isDirectHttpsContentUrl = (value: unknown): boolean => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;

  const url = new URL(canonicalUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname === '/' || /\/(?:search|tag|category|topics?|cuisines?|collections?)(?:\/|$)/i.test(url.pathname)) {
    return false;
  }

  return !['q', 'query', 'search', 's'].some(param => url.searchParams.has(param));
};

export const isApprovedDirectRecipeUrl = (value: unknown): boolean => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  return !!canonicalUrl
    && !isInternalGroundingUrl(canonicalUrl)
    && !isBlockedRecipePublisherUrl(canonicalUrl)
    && isTrustedRecipePublisherUrl(canonicalUrl)
    && isDirectHttpsContentUrl(canonicalUrl);
};

type PublisherPageResponse = Pick<Response, 'status' | 'url'>;
type PublisherPageRequest = (url: string, init: RequestInit) => Promise<PublisherPageResponse>;

const PUBLISHER_PAGE_TIMEOUT_MS = 4_000;

const samePublisher = (left: string, right: string): boolean => {
  const leftHost = new URL(left).hostname.toLowerCase().replace(/^www\./, '');
  const rightHost = new URL(right).hostname.toLowerCase().replace(/^www\./, '');
  return leftHost === rightHost;
};

/**
 * Reject pages a trusted publisher explicitly reports as missing. A temporary
 * publisher block, rate limit or server error leaves the existing result in
 * place, as those responses do not establish that the page has gone away.
 */
export const confirmPublisherRecipePageUrl = async (
  value: unknown,
  request: PublisherPageRequest = fetch
): Promise<string | null> => {
  const sourceUrl = canonicaliseGroundedUrl(value);
  if (!sourceUrl || !isTrustedRecipePublisherUrl(sourceUrl)) return sourceUrl;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PUBLISHER_PAGE_TIMEOUT_MS);

  try {
    let response = await request(sourceUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal
    });

    if (response.status === 405 || response.status === 501) {
      response = await request(sourceUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal
      });
    }

    if (response.status === 404 || response.status === 410) return null;

    const resolvedUrl = canonicaliseGroundedUrl(response.url) || sourceUrl;
    if (!samePublisher(sourceUrl, resolvedUrl) || !isDirectHttpsContentUrl(resolvedUrl)) return null;
    return resolvedUrl;
  } catch {
    // Some publishers block automated checks. Their response is inconclusive,
    // so keep the already-approved source rather than hiding a usable recipe.
    return sourceUrl;
  } finally {
    clearTimeout(timeoutId);
  }
};
