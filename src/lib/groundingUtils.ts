export type GroundedSource = {
  url: string;
  title?: string;
};

export const APPROVED_RECIPE_PUBLISHER_HOSTS = [
  'goodto.com',
  'bbcgoodfood.com',
  'bbc.co.uk',
  'tescorealfood.com',
  'realfood.tesco.com',
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
  'annaskitchentable.co.uk',
  'independent.co.uk',
  'recipesmadeeasy.co.uk',
  'riverford.co.uk',
  'ottolenghi.co.uk',
  'coop.co.uk',
  'jamesmartinchef.co.uk',
  'hairybikers.com',
  'dontgobaconmyheart.co.uk',
  'krumpli.co.uk',
  'ourmodernkitchen.com',
  'kitchensanctuary.com',
  'diabetes.org.uk',
  'slimmingworld.co.uk',
  'jamieoliver.com',
  'asda.com',
  'sainsburysmagazine.co.uk',
  'olivemagazine.com',
  'greatbritishchefs.com',
  'goodhousekeeping.com',
  'easypeasyfoodie.com',
  'lovepork.com',
  'groceries.morrisons.com',
  'marksandspencer.com',
  'abelandcole.co.uk'
] as const;

const TRUSTED_RECIPE_PUBLISHER_HOSTS = new Set<string>(APPROVED_RECIPE_PUBLISHER_HOSTS);

// These publishers are not suitable for automatic published-recipe results.
// They currently require a trial, payment or an app hand-off that cannot be
// relied on to reach a usable recipe page for every visitor.
const BLOCKED_RECIPE_PUBLISHER_HOSTS = new Set([
  'mob.co.uk',
  'waitrose.com',
  'telegraph.co.uk',
  'thetimes.com',
  'thesundaytimes.co.uk'
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

  if (/\.(?:avif|gif|jpe?g|png|svg|webp)(?:$|\/)/i.test(url.pathname)) return false;

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'bbcgoodfood.com' && !/^\/recipes\/[^/]+(?:\/[^/]*)?$/i.test(url.pathname)) {
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

type PublisherPageResponse = Pick<Response, 'status' | 'url'> & Partial<Pick<Response, 'text'>>;
type PublisherPageRequest = (url: string, init: RequestInit) => Promise<PublisherPageResponse>;

const PUBLISHER_PAGE_TIMEOUT_MS = 4_000;
const ACCESS_BARRIER_PATTERN = /\b(?:start|begin)\s+(?:your\s+)?free\s+trial\b|\b(?:subscribe|sign\s*in|log\s*in)\s+to\s+(?:continue|view|read|access|unlock)\b|\b(?:this|the)\s+(?:content|recipe|page)\s+(?:is\s+)?(?:for|available to)\s+(?:subscribers|members)\b|\b(?:membership|subscription)\s+required\b/i;
const MISSING_PAGE_PATTERN = /\b(?:page|recipe)\s+not\s+found\b|\b404\s+(?:error|not found)\b/i;
const GENERIC_INDEX_TITLE_PATTERN = /^(?:recipes?|recipe archive|food & drink)\s*(?:[|–-]|$)/i;

const extractPageTitle = (html: string): string => (
  html.match(/<title[^>]*>\s*([^<]+?)\s*<\/title>/i)?.[1]?.trim() || ''
);

const samePublisher = (left: string, right: string): boolean => {
  const leftHost = new URL(left).hostname.toLowerCase().replace(/^www\./, '');
  const rightHost = new URL(right).hostname.toLowerCase().replace(/^www\./, '');
  return leftHost === rightHost;
};

/**
 * Reject pages a trusted publisher explicitly reports as missing, generic or gated.
 * A temporary publisher block, rate limit or server error leaves the existing
 * result in place, as those responses do not establish that the page has gone
 * away or that a visitor cannot use it.
 */
export const confirmPublisherRecipePageUrl = async (
  value: unknown,
  request: PublisherPageRequest = fetch
): Promise<string | null> => {
  const sourceUrl = canonicaliseGroundedUrl(value);
  if (!sourceUrl || !isApprovedDirectRecipeUrl(sourceUrl)) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PUBLISHER_PAGE_TIMEOUT_MS);

  try {
    const headResponse = await request(sourceUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal
    });

    if ([401, 402, 404, 410].includes(headResponse.status)) return null;

    let resolvedUrl = canonicaliseGroundedUrl(headResponse.url) || sourceUrl;
    if (!samePublisher(sourceUrl, resolvedUrl) || !isDirectHttpsContentUrl(resolvedUrl)) return null;

    // A HEAD response never contains the visitor-facing content, even though
    // the Fetch Response object exposes a text() method. Always follow a
    // successful header check with a deliberately small page request.
    const pageResponse = await request(sourceUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { Range: 'bytes=0-65535', Accept: 'text/html,application/xhtml+xml' },
      signal: controller.signal
    });

    if ([401, 402, 404, 410].includes(pageResponse.status)) return null;
    resolvedUrl = canonicaliseGroundedUrl(pageResponse.url) || sourceUrl;
    if (!samePublisher(sourceUrl, resolvedUrl) || !isDirectHttpsContentUrl(resolvedUrl)) return null;

    if (typeof pageResponse.text === 'function') {
      const pageExcerpt = (await pageResponse.text()).slice(0, 65_536);
      const pageTitle = extractPageTitle(pageExcerpt);
      if (
        ACCESS_BARRIER_PATTERN.test(pageExcerpt)
        || MISSING_PAGE_PATTERN.test(pageExcerpt)
        || GENERIC_INDEX_TITLE_PATTERN.test(pageTitle)
      ) return null;
    }

    return resolvedUrl;
  } catch {
    // BBC Good Food's access layer can return a visually plausible page while
    // withholding the recipe behind a sign-in, trial or subscription prompt.
    // If its page cannot be verified, fail closed rather than surfacing a link
    // that may take the user straight to a paywall.
    const host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, '');
    return host === 'bbcgoodfood.com' ? null : sourceUrl;
  } finally {
    clearTimeout(timeoutId);
  }
};
