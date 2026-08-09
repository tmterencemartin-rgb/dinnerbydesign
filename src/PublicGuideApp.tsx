import React from 'react';
import { PublicGuideShell } from './components/PublicGuideShell';
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
import {
  SAUSAGE_WAYS_GUIDE,
  SAUSAGE_WAYS_GUIDE_PATH,
  getSausageWaysGuideJsonLd,
} from './content/sausageWaysGuide';
import {
  MINCE_BUDGET_DINNERS_GUIDE,
  MINCE_BUDGET_DINNERS_GUIDE_PATH,
  getMinceBudgetDinnersGuideJsonLd,
} from './content/minceBudgetDinnersGuide';
import {
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  getLeftoverRoastChickenBudgetDinnersGuideJsonLd,
} from './content/leftoverRoastChickenBudgetDinnersGuide';
import {
  CHICKEN_THIGH_COST_GUIDE,
  CHICKEN_THIGH_COST_GUIDE_PATH,
  getChickenThighCostGuideJsonLd,
} from './content/chickenThighCostGuide';
import {
  FIVE_STAPLES_GUIDE,
  FIVE_STAPLES_GUIDE_PATH,
  getFiveStaplesGuideJsonLd,
} from './content/fiveStaplesGuide';
import {
  CONVENIENCE_FISH_GUIDE,
  CONVENIENCE_FISH_GUIDE_PATH,
  getConvenienceFishGuideJsonLd,
} from './content/convenienceFishGuide';
import {
  TINNED_FISH_GUIDE,
  TINNED_FISH_GUIDE_PATH,
  getTinnedFishGuideJsonLd,
} from './content/tinnedFishGuide';
import {
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE,
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH,
  getNineBudgetDinnersThreeCuisinesGuideJsonLd,
} from './content/nineBudgetDinnersThreeCuisinesGuide';
import {
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE,
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  getNineBudgetFriendlyDinnersWithEggsGuideJsonLd,
} from './content/nineBudgetFriendlyDinnersWithEggsGuide';
import {
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE,
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  getNineBudgetDinnersWithTinnedVegetablesGuideJsonLd,
} from './content/nineBudgetDinnersWithTinnedVegetablesGuide';
import {
  WHOLE_CHICKEN_VALUE_GUIDE,
  WHOLE_CHICKEN_VALUE_GUIDE_PATH,
  getWholeChickenValueGuideJsonLd,
} from './content/wholeChickenValueGuide';
import {
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE,
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  getBubbleAndSqueakBudgetDinnersGuideJsonLd,
} from './content/bubbleAndSqueakBudgetDinnersGuide';
import {
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE,
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
  getNineBudgetDinnersWithPotatoesGuideJsonLd,
} from './content/nineBudgetDinnersWithPotatoesGuide';
import { NINE_BUDGET_DINNERS_WITH_RICE_GUIDE, NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH, getNineBudgetDinnersWithRiceGuideJsonLd } from './content/nineBudgetDinnersWithRiceGuide';

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
const FiveADayGuideView = React.lazy(() => import('./components/views/FiveADayGuideView').then(module => ({ default: module.FiveADayGuideView })));
const HomeCookedReadyMadeGuideView = React.lazy(() => import('./components/views/HomeCookedReadyMadeGuideView').then(module => ({ default: module.HomeCookedReadyMadeGuideView })));
const LowCostDinnersGuideView = React.lazy(() => import('./components/views/LowCostDinnersGuideView').then(module => ({ default: module.LowCostDinnersGuideView })));
const PulsesBudgetGuideView = React.lazy(() => import('./components/views/PulsesBudgetGuideView').then(module => ({ default: module.PulsesBudgetGuideView })));
const TraybakeGuideView = React.lazy(() => import('./components/views/TraybakeGuideView').then(module => ({ default: module.TraybakeGuideView })));
const SausageWaysGuideView = React.lazy(() => import('./components/views/SausageWaysGuideView').then(module => ({ default: module.SausageWaysGuideView })));
const MinceBudgetDinnersGuideView = React.lazy(() => import('./components/views/MinceBudgetDinnersGuideView').then(module => ({ default: module.MinceBudgetDinnersGuideView })));
const LeftoverRoastChickenBudgetDinnersGuideView = React.lazy(() => import('./components/views/LeftoverRoastChickenBudgetDinnersGuideView').then(module => ({ default: module.LeftoverRoastChickenBudgetDinnersGuideView })));
const ChickenThighCostGuideView = React.lazy(() => import('./components/views/ChickenThighCostGuideView').then(module => ({ default: module.ChickenThighCostGuideView })));
const FiveStaplesGuideView = React.lazy(() => import('./components/views/FiveStaplesGuideView').then(module => ({ default: module.FiveStaplesGuideView })));
const ConvenienceFishGuideView = React.lazy(() => import('./components/views/ConvenienceFishGuideView').then(module => ({ default: module.ConvenienceFishGuideView })));
const TinnedFishGuideView = React.lazy(() => import('./components/views/TinnedFishGuideView').then(module => ({ default: module.TinnedFishGuideView })));
const NineBudgetDinnersThreeCuisinesGuideView = React.lazy(() => import('./components/views/NineBudgetDinnersThreeCuisinesGuideView').then(module => ({ default: module.NineBudgetDinnersThreeCuisinesGuideView })));
const NineBudgetFriendlyDinnersWithEggsGuideView = React.lazy(() => import('./components/views/NineBudgetFriendlyDinnersWithEggsGuideView').then(module => ({ default: module.NineBudgetFriendlyDinnersWithEggsGuideView })));
const NineBudgetDinnersWithTinnedVegetablesGuideView = React.lazy(() => import('./components/views/NineBudgetDinnersWithTinnedVegetablesGuideView').then(module => ({ default: module.NineBudgetDinnersWithTinnedVegetablesGuideView })));
const WholeChickenValueGuideView = React.lazy(() => import('./components/views/WholeChickenValueGuideView').then(module => ({ default: module.WholeChickenValueGuideView })));
const BubbleAndSqueakBudgetDinnersGuideView = React.lazy(() => import('./components/views/BubbleAndSqueakBudgetDinnersGuideView').then(module => ({ default: module.BubbleAndSqueakBudgetDinnersGuideView })));
const NineBudgetDinnersWithPotatoesGuideView = React.lazy(() => import('./components/views/NineBudgetDinnersWithPotatoesGuideView').then(module => ({ default: module.NineBudgetDinnersWithPotatoesGuideView })));
const NineBudgetDinnersWithRiceGuideView = React.lazy(() => import('./components/views/NineBudgetDinnersWithRiceGuideView').then(module => ({ default: module.NineBudgetDinnersWithRiceGuideView })));
const ContactView = React.lazy(() => import('./components/views/ContactView').then(module => ({ default: module.ContactView })));

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
  [FIVE_A_DAY_GUIDE_PATH]: {
    seo: guideSeo(FIVE_A_DAY_GUIDE, FIVE_A_DAY_GUIDE_PATH, getFiveADayGuideJsonLd()),
    render: ({ search }) => <FiveADayGuideView onFindDinner={search} />,
  },
  [HOME_COOKED_READY_MADE_GUIDE_PATH]: {
    seo: guideSeo(HOME_COOKED_READY_MADE_GUIDE, HOME_COOKED_READY_MADE_GUIDE_PATH, getHomeCookedReadyMadeGuideJsonLd()),
    render: ({ search }) => <HomeCookedReadyMadeGuideView onFindDinner={search} />,
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
  [SAUSAGE_WAYS_GUIDE_PATH]: {
    seo: guideSeo(SAUSAGE_WAYS_GUIDE, SAUSAGE_WAYS_GUIDE_PATH, getSausageWaysGuideJsonLd()),
    render: ({ search }) => <SausageWaysGuideView onFindDinners={search} />,
  },
  [MINCE_BUDGET_DINNERS_GUIDE_PATH]: {
    seo: guideSeo(MINCE_BUDGET_DINNERS_GUIDE, MINCE_BUDGET_DINNERS_GUIDE_PATH, getMinceBudgetDinnersGuideJsonLd()),
    render: ({ search }) => <MinceBudgetDinnersGuideView onFindDinners={search} />,
  },
  [LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH]: {
    seo: guideSeo(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE, LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH, getLeftoverRoastChickenBudgetDinnersGuideJsonLd()),
    render: ({ search }) => <LeftoverRoastChickenBudgetDinnersGuideView onFindDinners={search} />,
  },
  [CHICKEN_THIGH_COST_GUIDE_PATH]: {
    seo: guideSeo(CHICKEN_THIGH_COST_GUIDE, CHICKEN_THIGH_COST_GUIDE_PATH, getChickenThighCostGuideJsonLd()),
    render: ({ search }) => <ChickenThighCostGuideView onFindRecipes={search} />,
  },
  [FIVE_STAPLES_GUIDE_PATH]: {
    seo: guideSeo(FIVE_STAPLES_GUIDE, FIVE_STAPLES_GUIDE_PATH, getFiveStaplesGuideJsonLd()),
    render: ({ search }) => <FiveStaplesGuideView onFindDinners={search} />,
  },
  [CONVENIENCE_FISH_GUIDE_PATH]: {
    seo: guideSeo(CONVENIENCE_FISH_GUIDE, CONVENIENCE_FISH_GUIDE_PATH, getConvenienceFishGuideJsonLd()),
    render: ({ search }) => <ConvenienceFishGuideView onFindDinners={search} />,
  },
  [TINNED_FISH_GUIDE_PATH]: {
    seo: guideSeo(TINNED_FISH_GUIDE, TINNED_FISH_GUIDE_PATH, getTinnedFishGuideJsonLd()),
    render: ({ search }) => <TinnedFishGuideView onFindDinners={search} />,
  },
  [NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH]: {
    seo: guideSeo(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE, NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH, getNineBudgetDinnersThreeCuisinesGuideJsonLd()),
    render: ({ search }) => <NineBudgetDinnersThreeCuisinesGuideView onFindDinners={search} />,
  },
  [NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH]: {
    seo: guideSeo(NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE, NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH, getNineBudgetFriendlyDinnersWithEggsGuideJsonLd()),
    render: ({ search }) => <NineBudgetFriendlyDinnersWithEggsGuideView onFindDinners={search} />,
  },
  [NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH]: {
    seo: guideSeo(NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE, NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH, getNineBudgetDinnersWithTinnedVegetablesGuideJsonLd()),
    render: ({ search }) => <NineBudgetDinnersWithTinnedVegetablesGuideView onFindDinners={search} />,
  },
  [WHOLE_CHICKEN_VALUE_GUIDE_PATH]: {
    seo: guideSeo(WHOLE_CHICKEN_VALUE_GUIDE, WHOLE_CHICKEN_VALUE_GUIDE_PATH, getWholeChickenValueGuideJsonLd()),
    render: ({ search }) => <WholeChickenValueGuideView onFindDinners={search} />,
  },
  [BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH]: {
    seo: guideSeo(BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE, BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH, getBubbleAndSqueakBudgetDinnersGuideJsonLd()),
    render: ({ search }) => <BubbleAndSqueakBudgetDinnersGuideView onFindDinners={search} />,
  },
  [NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH]: {
    seo: guideSeo(NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE, NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH, getNineBudgetDinnersWithPotatoesGuideJsonLd()),
    render: ({ search }) => <NineBudgetDinnersWithPotatoesGuideView onFindDinners={search} />,
  },
  [NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH]: { seo: guideSeo(NINE_BUDGET_DINNERS_WITH_RICE_GUIDE, NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH, getNineBudgetDinnersWithRiceGuideJsonLd()), render: ({ search }) => <NineBudgetDinnersWithRiceGuideView onFindDinners={search} /> },
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
