import React from 'react';
import { PublicGuideShell } from './components/PublicGuideShell';
import { useSeo } from './hooks/useSeo';
import { safeStorage } from './lib/storage';
import { AFFORDABILITY_PLANNER_PENDING_KEY } from './config/features';
import { FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd } from './content/seoMealPlans';
import {
  BATCH_COOKING_GUIDE,
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  LOW_COST_COOKING_TECHNIQUES_GUIDE,
  LOW_COST_COOKING_TECHNIQUES_PATH,
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
  getLowerCostCutsJsonLd,
  getLowCostCookingTechniquesJsonLd,
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
  COMPLETE_PACKS_GUIDE,
  COMPLETE_PACKS_GUIDE_PATH,
  getCompletePacksGuideJsonLd,
} from './content/completePacksGuide';
import {
  PUBLIC_GUIDE_LIBRARY,
  getPublicGuideLibraryJsonLd,
} from './content/publicGuideLibrary';
import { PUBLIC_LIBRARY_PATH } from './content/publicArticles';
import {
  FIVE_A_DAY_GUIDE,
  FIVE_A_DAY_GUIDE_PATH,
  getFiveADayGuideJsonLd,
} from './content/fiveADayGuide';
import {
  HOME_COOKED_READY_MADE_GUIDE,
  HOME_COOKED_READY_MADE_GUIDE_PATH,
  getHomeCookedReadyMadeGuideJsonLd,
} from './content/homeCookedReadyMadeGuide';
import {
  CHEAP_FINISHING_TOUCHES_GUIDE,
  CHEAP_FINISHING_TOUCHES_GUIDE_PATH,
  getCheapFinishingTouchesGuideJsonLd,
} from './content/cheapFinishingTouchesGuide';
import {
  LOW_COST_DINNERS_GUIDE,
  LOW_COST_DINNERS_GUIDE_PATH,
  getLowCostDinnersGuideJsonLd,
} from './content/lowCostDinnersGuide';
import {
  PULSES_BUDGET_GUIDE,
  PULSES_BUDGET_GUIDE_PATH,
  getPulsesBudgetGuideJsonLd,
} from './content/pulsesBudgetGuide';
import {
  TRAYBAKE_GUIDE,
  TRAYBAKE_GUIDE_PATH,
  getTraybakeGuideJsonLd,
} from './content/traybakeGuide';

const SeoMealPlanView = React.lazy(() => import('./components/views/SeoMealPlanView').then(module => ({ default: module.SeoMealPlanView })));
const FoodCostGuideView = React.lazy(() => import('./components/views/FoodCostGuideView').then(module => ({ default: module.FoodCostGuideView })));
const LowerCostCutsGuideView = React.lazy(() => import('./components/views/LowerCostCutsGuideView').then(module => ({ default: module.LowerCostCutsGuideView })));
const CheaperMeatCutsGuideView = React.lazy(() => import('./components/views/CheaperMeatCutsGuideView').then(module => ({ default: module.CheaperMeatCutsGuideView })));
const SharedIngredientsGuideView = React.lazy(() => import('./components/views/SharedIngredientsGuideView').then(module => ({ default: module.SharedIngredientsGuideView })));
const CompletePacksGuideView = React.lazy(() => import('./components/views/CompletePacksGuideView').then(module => ({ default: module.CompletePacksGuideView })));
const LowCostCookingTechniquesGuideView = React.lazy(() => import('./components/views/LowCostCookingTechniquesGuideView').then(module => ({ default: module.LowCostCookingTechniquesGuideView })));
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
const FiveADayGuideView = React.lazy(() => import('./components/views/FiveADayGuideView').then(module => ({ default: module.FiveADayGuideView })));
const HomeCookedReadyMadeGuideView = React.lazy(() => import('./components/views/HomeCookedReadyMadeGuideView').then(module => ({ default: module.HomeCookedReadyMadeGuideView })));
const CheapFinishingTouchesGuideView = React.lazy(() => import('./components/views/CheapFinishingTouchesGuideView').then(module => ({ default: module.CheapFinishingTouchesGuideView })));
const LowCostDinnersGuideView = React.lazy(() => import('./components/views/LowCostDinnersGuideView').then(module => ({ default: module.LowCostDinnersGuideView })));
const PulsesBudgetGuideView = React.lazy(() => import('./components/views/PulsesBudgetGuideView').then(module => ({ default: module.PulsesBudgetGuideView })));
const TraybakeGuideView = React.lazy(() => import('./components/views/TraybakeGuideView').then(module => ({ default: module.TraybakeGuideView })));

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  jsonLd?: object;
  noIndex?: boolean;
};

type PublicRoute = {
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

const PUBLIC_ROUTES: Record<string, PublicRoute> = {
  [FIVE_DINNERS_FOR_TWO_UNDER_40_PATH]: {
    seo: {
      title: '5 Affordable Dinners for Two Under £40 | DinnerByDesign',
      description: 'Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.',
      canonicalPath: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
      jsonLd: getFiveDinnersForTwoJsonLd(),
    },
    render: ({ plan }) => <SeoMealPlanView onPersonalise={plan} />,
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
  [LOWER_COST_CUTS_PATH]: {
    seo: guideSeo(LOWER_COST_CUTS_GUIDE, LOWER_COST_CUTS_PATH, getLowerCostCutsJsonLd()),
    render: ({ plan }) => <LowerCostCutsGuideView onFindDinners={plan} />,
  },
  [CHEAPER_MEAT_CUTS_GUIDE_PATH]: {
    seo: guideSeo(CHEAPER_MEAT_CUTS_GUIDE, CHEAPER_MEAT_CUTS_GUIDE_PATH, getCheaperMeatCutsGuideJsonLd()),
    render: ({ plan }) => <CheaperMeatCutsGuideView onPlanWeek={plan} />,
  },
  [SHARED_INGREDIENTS_GUIDE_PATH]: {
    seo: guideSeo(SHARED_INGREDIENTS_GUIDE, SHARED_INGREDIENTS_GUIDE_PATH, getSharedIngredientsGuideJsonLd()),
    render: ({ plan }) => <SharedIngredientsGuideView onPlanWeek={plan} />,
  },
  [COMPLETE_PACKS_GUIDE_PATH]: {
    seo: guideSeo(COMPLETE_PACKS_GUIDE, COMPLETE_PACKS_GUIDE_PATH, getCompletePacksGuideJsonLd()),
    render: ({ plan }) => <CompletePacksGuideView onPlanWeek={plan} />,
  },
  [LOW_COST_COOKING_TECHNIQUES_PATH]: {
    seo: guideSeo(LOW_COST_COOKING_TECHNIQUES_GUIDE, LOW_COST_COOKING_TECHNIQUES_PATH, getLowCostCookingTechniquesJsonLd()),
    render: ({ plan }) => <LowCostCookingTechniquesGuideView onFindDinners={plan} />,
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
  [FIVE_A_DAY_GUIDE_PATH]: {
    seo: guideSeo(FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH, getFiveADayGuideJsonLd()),
    render: ({ search }) => <FiveADayGuideView onFindDinner={search} />,
  },
  [HOME_COOKED_READY_MADE_GUIDE_PATH]: {
    seo: guideSeo(HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH, getHomeCookedReadyMadeGuideJsonLd()),
    render: ({ search }) => <HomeCookedReadyMadeGuideView onFindDinner={search} />,
  },
  [CHEAP_FINISHING_TOUCHES_GUIDE_PATH]: {
    seo: guideSeo(CHEAP_FINISHING_TOUCHES_GUIDE, CHEAP_FINISHING_TOUCHES_GUIDE_PATH, getCheapFinishingTouchesGuideJsonLd()),
    render: ({ search }) => <CheapFinishingTouchesGuideView onFindDinner={search} />,
  },
  [LOW_COST_DINNERS_GUIDE_PATH]: {
    seo: guideSeo(LOW_COST_DINNERS_GUIDE, LOW_COST_DINNERS_GUIDE_PATH, getLowCostDinnersGuideJsonLd()),
    render: ({ search }) => <LowCostDinnersGuideView onFindDinner={search} />,
  },
  [PULSES_BUDGET_GUIDE_PATH]: {
    seo: guideSeo(PULSES_BUDGET_GUIDE, PULSES_BUDGET_GUIDE_PATH, getPulsesBudgetGuideJsonLd()),
    render: ({ search }) => <PulsesBudgetGuideView onFindDinners={search} />,
  },
  [TRAYBAKE_GUIDE_PATH]: {
    seo: guideSeo(TRAYBAKE_GUIDE, TRAYBAKE_GUIDE_PATH, getTraybakeGuideJsonLd()),
    render: ({ search }) => <TraybakeGuideView onFindDinners={search} />,
  },
};

const normalisePath = (pathName: string) =>
  pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;

const PublicGuideApp = () => {
  const path = normalisePath(window.location.pathname);
  const route = PUBLIC_ROUTES[path];

  useSeo(route?.seo || {
    title: 'Guide not found | DinnerByDesign',
    description: 'The requested DinnerByDesign guide could not be found.',
    canonicalPath: path,
    noIndex: true,
  });

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
          <img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="mx-auto h-10 w-auto max-w-[230px] object-contain mix-blend-multiply" />
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
