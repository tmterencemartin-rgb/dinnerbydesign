export const PUBLIC_PAGE_REDIRECTS = {
  '/food-costs/cooking-for-four-with-lower-cost-cuts': '/food-costs/cooking-with-cheaper-cuts-of-meat',
  '/food-costs/low-cost-cooking-techniques': '/food-costs/ways-to-reduce-grocery-costs',
  '/food-costs/how-to-use-complete-packs': '/food-costs/five-dinners-same-ingredients',
  '/food-costs/cheap-finishing-touches': '/food-costs/make-low-cost-dinners-more-interesting',
} as const;

export type RetiredPublicPagePath = keyof typeof PUBLIC_PAGE_REDIRECTS;

export function getPublicPageRedirect(pathName: string) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;
  return PUBLIC_PAGE_REDIRECTS[normalisedPath as RetiredPublicPagePath] || null;
}
