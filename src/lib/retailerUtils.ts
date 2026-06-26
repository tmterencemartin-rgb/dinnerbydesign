/**
 * Utility functions for building retailer search URLs and determining the correct CTA label.
 */

/**
 * Normalizes a retailer name to a lowercase key used in URL generation.
 */
function normalizeRetailer(retailer: string): string {
  const r = retailer.toLowerCase();
  if (r.includes('tesco')) return 'tesco';
  if (r.includes('sainsbury')) return 'sainsburys';
  if (r.includes('waitrose')) return 'waitrose';
  if (r.includes('ocado')) return 'ocado';
  return r;
}

/**
 * Builds a search URL for a specific UK retailer.
 */
export function buildRetailerSearchUrl(retailer: string, query: string): string | null {
  const normRetailer = normalizeRetailer(retailer);
  const qParameter = new URLSearchParams({ query }).toString();

  switch (normRetailer) {
    case 'tesco':
      return `https://www.tesco.com/groceries/en-GB/search?query=${encodeURIComponent(query)}`;
    case 'sainsburys':
      return `https://www.sainsburys.co.uk/gol-ui/SearchResults/${encodeURIComponent(query)}`;
    case 'sainsbury':
      return `https://www.sainsburys.co.uk/gol-ui/SearchResults/${encodeURIComponent(query)}`;
    case 'waitrose':
      return `https://www.waitrose.com/ecom/shop/search?searchTerm=${encodeURIComponent(query)}`;
    case 'ocado':
      return `https://www.ocado.com/search?entry=${encodeURIComponent(query)}`;
    case 'morrisons':
      return `https://groceries.morrisons.com/search?entry=${encodeURIComponent(query)}`;
    case 'morrison':
      return `https://groceries.morrisons.com/search?entry=${encodeURIComponent(query)}`;
    case 'asda':
      return `https://groceries.asda.com/search/${encodeURIComponent(query)}`;
    case 'co-op':
      return `https://shop.coop.co.uk/search?term=${encodeURIComponent(query)}`;
    case 'coop':
      return `https://shop.coop.co.uk/search?term=${encodeURIComponent(query)}`;
    case 'm&s':
      return `https://www.ocado.com/search?entry=${encodeURIComponent(query)}`;
    case 'marks and spencer':
      return `https://www.ocado.com/search?entry=${encodeURIComponent(query)}`;
    case 'iceland':
      return `https://www.iceland.co.uk/search?q=${encodeURIComponent(query)}`;
    case 'aldi':
      return `https://groceries.aldi.co.uk/en-GB/search?keywords=${encodeURIComponent(query)}`;
    case 'lidl':
      return `https://www.google.com/search?q=${encodeURIComponent('Lidl ' + query)}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(retailer + ' ' + query)}`;
  }
}

/**
 * Constructs a precise search query string using product details.
 */
export function buildRetailerQuery(product: { brand?: string; title: string; size?: string }): string {
  return [
    product.brand,
    product.title, // 'name' in brief maps to 'title' in our model
    product.size
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface RetailerCta {
  label: string;
  url: string;
  helper: string | null;
}

/**
 * Validates whether a URL strictly matches a known retailer Product Detail Page (PDP) pattern.
 */
function isValidRetailerPdp(url: string, retailer: string): boolean {
  const r = retailer.toLowerCase();
  try {
    const uri = new URL(url);
    const host = uri.hostname.toLowerCase();
    const path = uri.pathname.toLowerCase();

    // Stricter PDP pattern matching:
    // Retailer URLs usually end with a numeric ID or a slug containing a numeric ID
    if (r.includes('tesco')) {
      return host.includes('tesco.com') && /^\/groceries\/en-gb\/products\/\d+$/i.test(path);
    }
    if (r.includes('sainsbury')) {
      return host.includes('sainsburys.co.uk') && /^\/gol-ui\/product\/\d+$/i.test(path);
    }
    if (r.includes('waitrose')) {
      return host.includes('waitrose.com') && /^\/ecom\/products\/.*\/[a-z0-9-]+$/i.test(path);
    }
    if (r.includes('ocado')) {
      return host.includes('ocado.com') && /^\/products\/.*-\d+$/i.test(path);
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Performs a deterministic sanity check on the URL path to ensure basic attribute consistency.
 * This checks if significant keywords from the title or brand appear in the slug for retailers
 * that use descriptive paths (Waitrose, Ocado).
 */
function passesSanityCheck(url: string, product: { brand?: string; title: string }): boolean {
  const urlLower = url.toLowerCase();
  
  const stopWords = new Set(['with', 'from', 'made', 'good', 'fresh', 'best', 'organic', 'british', 'essential', 'Waitrose', 'Tesco']);
  const titleWords = product.title.toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  // For retailers with descriptive slugs (Waitrose, Ocado), we require at least one title word match.
  if (urlLower.includes('waitrose.com') || urlLower.includes('ocado.com')) {
    const hasTitleMatch = titleWords.some(word => urlLower.includes(word));
    // Also check brand if provided
    const brandPrefix = product.brand?.toLowerCase()?.split(/\s+/)[0];
    const hasBrandMatch = brandPrefix && brandPrefix.length > 2 && urlLower.includes(brandPrefix);
    
    return hasTitleMatch || hasBrandMatch;
  }

  // For retailers that use numeric IDs (Tesco, Sainsbury's), path-based sanity checking is limited 
  // without external validation, so we rely on the strict host + PDP regex defined in isValidRetailerPdp.
  return true; 
}

/**
 * Determines the best CTA for a product based on deterministic verification filters.
 * 
 * Hierarchy:
 * 1. View at {Retailer} - Only for deterministically validated PDP URLs + Sanity Check.
 * 2. Search at {Retailer} - Default fallback for known retailers.
 * 3. Check at {Retailer} - For low-confidence or generic matches.
 * 4. null - No outbound destination.
 */
export function getRetailerCta(product: { 
  retailer?: string; 
  sourceUrl?: string | null; 
  brandVerified?: boolean; 
  searchQueryStrong?: boolean;
  brand?: string;
  title: string;
  size?: string;
}): RetailerCta | null {
  if (!product.retailer) return null;

  const retailerName = product.retailer;
  const normRetailer = normalizeRetailer(retailerName);
  
  // Deterministic Validation: 
  // View at {Retailer} — show only when we have a verified product URL (PDP)
  const isPdp = product.sourceUrl ? isValidRetailerPdp(product.sourceUrl, normRetailer) : false;
  const isSane = (product.sourceUrl && isPdp) ? passesSanityCheck(product.sourceUrl, product) : false;
  
  if (product.sourceUrl && isPdp && isSane) {
    return {
      label: `View at ${retailerName}`,
      url: product.sourceUrl,
      helper: 'Price and availability set by retailer'
    };
  }

  // Downgrade Path:
  // If we have a URL but it's not a validated PDP, or failed sanity,
  // we treat the retailer as known but fall back to Search to ensure user accuracy.
  
  const query = buildRetailerQuery(product);
  const searchUrl = buildRetailerSearchUrl(product.retailer, query);

  if (!searchUrl) return null;

  // Search at {Retailer} — show when we have strong distinctive terms (Default fallback)
  if (product.searchQueryStrong || (product.brand && product.size)) {
    return {
      label: `Search at ${retailerName}`,
      url: searchUrl,
      helper: 'Opens retailer search results'
    };
  }

  // Check at {Retailer} — show when matching signals are weak or generic
  return {
    label: `Check at ${retailerName}`,
    url: searchUrl,
    helper: 'Exact match may vary by store'
  };
}
