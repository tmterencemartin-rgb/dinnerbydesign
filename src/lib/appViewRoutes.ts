import type { AppView } from '../types';

export const QUERY_PARAM_APP_VIEWS = new Set<AppView>([
  'home',
  'settings',
  'planner',
  'shopping',
  'pricing-methodology',
  'food-safety',
  'recipe-methodology',
  'nutrition-methodology',
  'privacy',
  'terms',
  'admin',
  'success',
  'signin',
  'landing',
]);

export const PUBLIC_PATH_APP_VIEW_ROUTES = {
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/settings': 'settings',
  '/planner': 'planner',
  '/shopping': 'shopping',
  '/pricing-methodology': 'pricing-methodology',
  '/food-safety': 'food-safety',
  '/recipe-methodology': 'recipe-methodology',
  '/nutrition-methodology': 'nutrition-methodology',
  '/success': 'success',
  '/signin': 'signin',
  '/admin': 'admin',
  '/dinner-plans/5-dinners-for-2-under-40': 'meal-plan-five-for-two-under-40',
  '/food-costs/uk-food-costs-2026': 'food-costs-uk-2026',
  '/food-costs/cooking-for-four-with-lower-cost-cuts': 'food-costs-lower-cost-cuts',
  '/food-costs/cooking-with-cheaper-cuts-of-meat': 'food-costs-cheaper-meat-cuts',
  '/food-costs/five-dinners-same-ingredients': 'food-costs-shared-ingredients',
  '/food-costs/how-to-use-complete-packs': 'food-costs-complete-packs',
  '/food-costs/low-cost-cooking-techniques': 'food-costs-low-cost-cooking-techniques',
  '/food-costs/cooking-for-one-without-waste': 'food-costs-cooking-for-one',
  '/food-costs/cooking-with-offal-on-a-budget': 'food-costs-offal-budget',
  '/food-costs/portion-planning-and-food-waste': 'food-costs-portion-planning',
  '/food-costs/mediterranean-inspired-affordable-cooking': 'food-costs-mediterranean-affordable-cooking',
  '/food-costs/summer-stews-seasonal-vegetables': 'food-costs-summer-stews',
  '/food-costs/fresh-or-frozen': 'food-costs-fresh-or-frozen',
  '/food-costs/batch-cooking-on-a-budget': 'food-costs-batch-cooking',
  '/food-costs/ways-to-reduce-grocery-costs': 'food-costs-grocery-cost-options',
  '/food-costs/why-grocery-costs-are-hard-to-predict': 'food-costs-grocery-prediction',
  '/guides': 'guides',
  '/guides/do-vegetables-in-dishes-count-towards-5-a-day': 'five-a-day-guide',
  '/guides/home-cooked-or-ready-made-dinners': 'home-cooked-ready-made-guide',
  '/food-costs/cheap-finishing-touches': 'cheap-finishing-touches-guide',
  '/food-costs/make-low-cost-dinners-more-interesting': 'low-cost-dinners-guide',
} satisfies Record<string, AppView>;

const normalisePath = (path: string) => {
  const [withoutHash] = path.split('#');
  const [pathname] = withoutHash.split('?');
  const trimmedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return trimmedPath || '/';
};

export const getAppViewFromPublicPath = (path: string): AppView | null =>
  PUBLIC_PATH_APP_VIEW_ROUTES[normalisePath(path) as keyof typeof PUBLIC_PATH_APP_VIEW_ROUTES] ?? null;

export const isQueryParamAppView = (view: string | null): view is AppView =>
  Boolean(view && QUERY_PARAM_APP_VIEWS.has(view as AppView));

export const getAppViewFromLocation = (location: string, viewParam: string | null): AppView | null => {
  const publicPathView = getAppViewFromPublicPath(location);
  if (publicPathView) return publicPathView;
  return isQueryParamAppView(viewParam) ? viewParam : null;
};
