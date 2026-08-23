import React from 'react';
import { PublicGuideShell } from './components/PublicGuideShell';
import { Wordmark } from './components/Wordmark';
import { useSeo } from './hooks/useSeo';
import { safeStorage } from './lib/storage';
import { AFFORDABILITY_PLANNER_PENDING_KEY } from './config/features';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd } from './content/seoMealPlans';
import {
  FAMILY_DINNERS_FOR_FOUR,
  FAMILY_DINNERS_FOR_FOUR_PATH,
  getFamilyDinnersForFourJsonLd,
} from './content/familyDinnersForFourPlan';
import {
  BATCH_COOKING_GUIDE,
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE,
  MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  OFFAL_BUDGET_GUIDE,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getBatchCookingGuideJsonLd,
  getCookingForOneJsonLd,
  getFreshOrFrozenGuideJsonLd,
  getMediterraneanAffordableCookingJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getSummerStewsGuideJsonLd,
  getUkFoodCosts2026JsonLd,
} from './content/seoFoodCostGuides';
import {
  GROCERY_COST_OPTIONS_GUIDE,
  GROCERY_COST_OPTIONS_GUIDE_PATH,
  getGroceryCostOptionsGuideJsonLd,
} from './content/groceryCostOptionsGuide';
import {
  GROCERY_COST_PREDICTION_GUIDE,
  GROCERY_COST_PREDICTION_GUIDE_PATH,
  getGroceryCostPredictionGuideJsonLd,
} from './content/groceryCostPredictionGuide';
import {
  CHEAPER_MEAT_CUTS_GUIDE,
  CHEAPER_MEAT_CUTS_GUIDE_PATH,
  getCheaperMeatCutsGuideJsonLd,
} from './content/cheaperMeatCutsGuide';
import {
  SHARED_INGREDIENTS_GUIDE,
  SHARED_INGREDIENTS_GUIDE_PATH,
  getSharedIngredientsGuideJsonLd,
} from './content/sharedIngredientsGuide';
import {
  PUBLIC_GUIDE_LIBRARY,
  getPublicGuideLibraryJsonLd,
} from './content/publicGuideLibrary';
import { PUBLIC_LIBRARY_PATH } from './content/publicArticles';
import {
  PUBLIC_DINNER_PLANS_PATH,
  PUBLIC_FOOD_COSTS_PATH,
  PUBLIC_RECIPES_PATH,
  getPublicPathway,
  getPublicPathwayJsonLd,
} from './content/publicPathways';
import {
  PublicEditorialGuideView,
} from './components/views/PublicEditorialGuideView';
import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from './content/publicGuideRegistry';
import {
  getPublicGuideJsonLd,
  getPublicGuidePublishedLabel,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
} from './content/publicGuideModel';

const SeoMealPlanView = React.lazy(() => import('./components/views/SeoMealPlanView').then(module => ({ default: module.SeoMealPlanView })));
const FamilyDinnersForFourView = React.lazy(() => import('./components/views/FamilyDinnersForFourView').then(module => ({ default: module.FamilyDinnersForFourView })));
const FoodCostGuideView = React.lazy(() => import('./components/views/FoodCostGuideView').then(module => ({ default: module.FoodCostGuideView })));
const CheaperMeatCutsGuideView = React.lazy(() => import('./components/views/CheaperMeatCutsGuideView').then(module => ({ default: module.CheaperMeatCutsGuideView })));
const SharedIngredientsGuideView = React.lazy(() => import('./components/views/SharedIngredientsGuideView').then(module => ({ default: module.SharedIngredientsGuideView })));
const CookingForOneGuideView = React.lazy(() => import('./components/views/CookingForOneGuideView').then(module => ({ default: module.CookingForOneGuideView })));
const OffalBudgetGuideView = React.lazy(() => import('./components/views/OffalBudgetGuideView').then(module => ({ default: module.OffalBudgetGuideView })));
const PortionPlanningGuideView = React.lazy(() => import('./components/views/PortionPlanningGuideView').then(module => ({ default: module.PortionPlanningGuideView })));
const MediterraneanAffordableCookingGuideView = React.lazy(() => import('./components/views/MediterraneanAffordableCookingGuideView').then(module => ({ default: module.MediterraneanAffordableCookingGuideView })));
const SummerStewsGuideView = React.lazy(() => import('./components/views/SummerStewsGuideView').then(module => ({ default: module.SummerStewsGuideView })));
const FreshOrFrozenGuideView = React.lazy(() => import('./components/views/FreshOrFrozenGuideView').then(module => ({ default: module.FreshOrFrozenGuideView })));
const BatchCookingGuideView = React.lazy(() => import('./components/views/BatchCookingGuideView').then(module => ({ default: module.BatchCookingGuideView })));
const GroceryCostOptionsGuideView = React.lazy(() => import('./components/views/GroceryCostOptionsGuideView').then(module => ({ default: module.GroceryCostOptionsGuideView })));
const GroceryCostPredictionGuideView = React.lazy(() => import('./components/views/GroceryCostPredictionGuideView').then(module => ({ default: module.GroceryCostPredictionGuideView })));
const GuidesLibraryView = React.lazy(() => import('./components/views/GuidesLibraryView').then(module => ({ default: module.GuidesLibraryView })));
const PublicPathwayView = React.lazy(() => import('./components/views/PublicPathwayView').then(module => ({ default: module.PublicPathwayView })));
const ContactView = React.lazy(() => import('./components/views/ContactView').then(module => ({ default: module.ContactView })));

export type SeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  jsonLd?: object;
  noIndex?: boolean;
};

export type PublicRoute = {
  seo: SeoConfig;
  render: (actions: { plan: () => void; search: () => void }) => React.ReactNode;
};

const guideSeo = (
  guide: { seoTitle: string; description: string },
  canonicalPath: string,
  jsonLd: object,
): SeoConfig => ({
  title: guide.seoTitle,
  description: guide.description,
  canonicalPath,
  jsonLd,
});

const getPublicGuideAction = (
  guide: PublicGuideRecord,
  actions: { plan: () => void; search: () => void },
) => {
  const ctaText = `${guide.cta.title} ${guide.cta.label}`.toLowerCase();
  return guide.category === 'dinner-plans' || ctaText.includes('plan') ? actions.plan : actions.search;
};

const PUBLIC_GUIDE_RECORD_ROUTES = PUBLISHED_PUBLIC_GUIDE_RECORDS.reduce<Record<string, PublicRoute>>((routes, guide) => {
  routes[guide.path] = {
    seo: {
      title: guide.seoTitle,
      description: guide.metaDescription || guide.description,
      canonicalPath: guide.canonicalPath,
      jsonLd: getPublicGuideJsonLd(guide),
      noIndex: guide.indexingStatus === 'noindex',
    },
    render: actions => (
      <PublicEditorialGuideView
        guide={guide}
        label={guide.label}
        publishedLabel={getPublicGuidePublishedLabel(guide)}
        renderInitialHtml={() => renderPublicGuideInitialHtml(guide)}
        ctaTitle={guide.cta.title}
        ctaCopy={guide.cta.copy}
        ctaLabel={guide.cta.label}
        onCta={getPublicGuideAction(guide, actions)}
      />
    ),
  };
  return routes;
}, {});

export const PUBLIC_ROUTES: Record<string, PublicRoute> = {
  '/contact': {
    seo: {
      title: 'Contact DinnerByDesign',
      description: 'Send an enquiry to DinnerByDesign.',
      canonicalPath: '/contact',
      noIndex: true,
    },
    render: () => <ContactView />,
  },
  ...[PUBLIC_DINNER_PLANS_PATH, PUBLIC_RECIPES_PATH, PUBLIC_FOOD_COSTS_PATH].reduce<Record<string, PublicRoute>>((routes, pathwayPath) => {
    const pathway = getPublicPathway(pathwayPath);
    if (!pathway) return routes;
    routes[pathwayPath] = {
      seo: {
        title: pathway.seoTitle,
        description: pathway.description,
        canonicalPath: pathway.path,
        jsonLd: getPublicPathwayJsonLd(pathway),
      },
      render: ({ plan, search }) => (
        <PublicPathwayView
          pathway={pathway}
          onPrimaryAction={pathway.id === 'recipes' ? search : plan}
        />
      ),
    };
    return routes;
  }, {}),
  ...PUBLIC_GUIDE_RECORD_ROUTES,
  [FIVE_DINNERS_FOR_TWO_UNDER_40_PATH]: {
    seo: {
      title: FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle,
      description: 'Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.',
      canonicalPath: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
      jsonLd: getFiveDinnersForTwoJsonLd(),
    },
    render: ({ plan }) => <SeoMealPlanView onPersonalise={plan} />,
  },
  [FAMILY_DINNERS_FOR_FOUR_PATH]: {
    seo: guideSeo(FAMILY_DINNERS_FOR_FOUR, FAMILY_DINNERS_FOR_FOUR_PATH, getFamilyDinnersForFourJsonLd()),
    render: ({ plan }) => <FamilyDinnersForFourView onPersonalise={plan} />,
  },
  [UK_FOOD_COSTS_2026_PATH]: {
    seo: {
      title: `${UK_FOOD_COSTS_2026.title} | DinnerByDesign`,
      description: UK_FOOD_COSTS_2026.description,
      canonicalPath: UK_FOOD_COSTS_2026_PATH,
      jsonLd: getUkFoodCosts2026JsonLd(),
    },
    render: ({ plan }) => <FoodCostGuideView onPlanWeek={plan} />,
  },
  [CHEAPER_MEAT_CUTS_GUIDE_PATH]: {
    seo: guideSeo(CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH, getCheaperMeatCutsGuideJsonLd()),
    render: ({ plan }) => <CheaperMeatCutsGuideView onPlanWeek={plan} />,
  },
  [SHARED_INGREDIENTS_GUIDE_PATH]: {
    seo: guideSeo(SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH, getSharedIngredientsGuideJsonLd()),
    render: ({ plan }) => <SharedIngredientsGuideView onPlanWeek={plan} />,
  },
  [COOKING_FOR_ONE_PATH]: {
    seo: guideSeo(COOKING_FOR_ONE_GUIDE, COOKING_FOR_ONE_PATH, getCookingForOneJsonLd()),
    render: ({ plan }) => <CookingForOneGuideView onPlanDinners={plan} />,
  },
  [OFFAL_BUDGET_GUIDE_PATH]: {
    seo: guideSeo(OFFAL_BUDGET_GUIDE, OFFAL_BUDGET_GUIDE_PATH, getOffalBudgetGuideJsonLd()),
    render: ({ plan }) => <OffalBudgetGuideView onFindDinners={plan} />,
  },
  [PORTION_PLANNING_GUIDE_PATH]: {
    seo: guideSeo(PORTION_PLANNING_GUIDE, PORTION_PLANNING_GUIDE_PATH, getPortionPlanningGuideJsonLd()),
    render: ({ plan }) => <PortionPlanningGuideView onPlanWeek={plan} />,
  },
  [MEDITERRANEAN_AFFORDABLE_COOKING_PATH]: {
    seo: guideSeo(MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE, MEDITERRANEAN_AFFORDABLE_COOKING_PATH, getMediterraneanAffordableCookingJsonLd()),
    render: ({ plan }) => <MediterraneanAffordableCookingGuideView onPlanWeek={plan} />,
  },
  [SUMMER_STEWS_GUIDE_PATH]: {
    seo: guideSeo(SUMMER_STEWS_GUIDE, SUMMER_STEWS_GUIDE_PATH, getSummerStewsGuideJsonLd()),
    render: ({ plan }) => <SummerStewsGuideView onPlanWeek={plan} />,
  },
  [FRESH_OR_FROZEN_GUIDE_PATH]: {
    seo: guideSeo(FRESH_OR_FROZEN_GUIDE, FRESH_OR_FROZEN_GUIDE_PATH, getFreshOrFrozenGuideJsonLd()),
    render: ({ plan }) => <FreshOrFrozenGuideView onPlanWeek={plan} />,
  },
  [BATCH_COOKING_GUIDE_PATH]: {
    seo: guideSeo(BATCH_COOKING_GUIDE, BATCH_COOKING_GUIDE_PATH, getBatchCookingGuideJsonLd()),
    render: ({ plan }) => <BatchCookingGuideView onPlanWeek={plan} />,
  },
  [GROCERY_COST_OPTIONS_GUIDE_PATH]: {
    seo: guideSeo(GROCERY_COST_OPTIONS_GUIDE, GROCERY_COST_OPTIONS_GUIDE_PATH, getGroceryCostOptionsGuideJsonLd()),
    render: ({ plan }) => <GroceryCostOptionsGuideView onPlanWeek={plan} />,
  },
  [GROCERY_COST_PREDICTION_GUIDE_PATH]: {
    seo: guideSeo(GROCERY_COST_PREDICTION_GUIDE, GROCERY_COST_PREDICTION_GUIDE_PATH, getGroceryCostPredictionGuideJsonLd()),
    render: ({ plan }) => <GroceryCostPredictionGuideView onPlanWeek={plan} />,
  },
  [PUBLIC_LIBRARY_PATH || '/guides']: {
    seo: {
      title: PUBLIC_GUIDE_LIBRARY.seoTitle,
      description: PUBLIC_GUIDE_LIBRARY.description,
      canonicalPath: PUBLIC_LIBRARY_PATH || '/guides',
      jsonLd: getPublicGuideLibraryJsonLd(),
    },
    render: ({ plan }) => <GuidesLibraryView onPlanWeek={plan} />,
  },
};

const normalisePath = (pathName: string) =>
  pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;

export const getPublicRoute = (pathName: string) =>
  PUBLIC_ROUTES[normalisePath(pathName)];

export const getPublicRouteSeo = (pathName: string): SeoConfig => {
  const path = normalisePath(pathName);
  return getPublicRoute(path)?.seo || {
    title: 'Guide not found | DinnerByDesign',
    description: 'The requested DinnerByDesign guide could not be found.',
    canonicalPath: path,
    noIndex: true,
  };
};

const PublicGuideApp = () => {
  const path = normalisePath(window.location.pathname);
  const route = getPublicRoute(path);

  useSeo(getPublicRouteSeo(path));

  const plan = React.useCallback(() => {
    safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
    window.location.assign('/signin');
  }, []);

  const search = React.useCallback(() => {
    window.location.assign('/signin');
  }, []);

  if (!route) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-5 py-16 text-center">
        <a href="/" aria-label="DinnerByDesign home">
          <Wordmark className="mx-auto text-[40px]" />
        </a>
        <h1 className="mt-12 text-2xl font-bold text-dbd-ink">Guide not found</h1>
        <p className="mt-3 text-sm text-dbd-ink-3">The address may have changed, or the guide may no longer be available.</p>
        <a href="/guides" className="mt-6 inline-flex min-h-11 items-center rounded bg-dbd-ink px-5 text-sm font-semibold text-white">
          Browse all guides
        </a>
      </main>
    );
  }

  return (
    <PublicGuideShell pathName={path}>
      {route.render({ plan, search })}
    </PublicGuideShell>
  );
};

export default PublicGuideApp;
