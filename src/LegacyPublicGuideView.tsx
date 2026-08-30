import React from 'react';
import type { AppView } from './types';

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

export const LEGACY_PUBLIC_GUIDE_VIEWS = new Set<AppView>([
  'meal-plan-five-for-two-under-40',
  'food-costs-uk-2026',
  'food-costs-lower-cost-cuts',
  'food-costs-cheaper-meat-cuts',
  'food-costs-shared-ingredients',
  'food-costs-complete-packs',
  'food-costs-low-cost-cooking-techniques',
  'food-costs-cooking-for-one',
  'food-costs-offal-budget',
  'food-costs-portion-planning',
  'food-costs-mediterranean-affordable-cooking',
  'food-costs-summer-stews',
  'food-costs-fresh-or-frozen',
  'food-costs-batch-cooking',
  'food-costs-grocery-cost-options',
  'food-costs-grocery-prediction',
  'guides',
  'five-a-day-guide',
  'home-cooked-ready-made-guide',
  'cheap-finishing-touches-guide',
  'low-cost-dinners-guide',
]);

interface LegacyPublicGuideViewProps {
  view: AppView;
  onPlanWeek: () => void;
  onFindDinner: () => void;
  onPersonalise: () => void;
}

export const LegacyPublicGuideView: React.FC<LegacyPublicGuideViewProps> = ({
  view,
  onPlanWeek,
  onFindDinner,
  onPersonalise,
}) => {
  switch (view) {
    case 'meal-plan-five-for-two-under-40':
      return <SeoMealPlanView onPersonalise={onPersonalise} />;
    case 'food-costs-uk-2026':
      return <FoodCostGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-lower-cost-cuts':
      return <LowerCostCutsGuideView onFindDinners={onPlanWeek} />;
    case 'food-costs-cheaper-meat-cuts':
      return <CheaperMeatCutsGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-shared-ingredients':
      return <SharedIngredientsGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-complete-packs':
      return <CompletePacksGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-low-cost-cooking-techniques':
      return <LowCostCookingTechniquesGuideView onFindDinners={onPlanWeek} />;
    case 'food-costs-cooking-for-one':
      return <CookingForOneGuideView onPlanDinners={onPlanWeek} />;
    case 'food-costs-offal-budget':
      return <OffalBudgetGuideView onFindDinners={onPlanWeek} />;
    case 'food-costs-portion-planning':
      return <PortionPlanningGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-mediterranean-affordable-cooking':
      return <MediterraneanAffordableCookingGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-summer-stews':
      return <SummerStewsGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-fresh-or-frozen':
      return <FreshOrFrozenGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-batch-cooking':
      return <BatchCookingGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-grocery-cost-options':
      return <GroceryCostOptionsGuideView onPlanWeek={onPlanWeek} />;
    case 'food-costs-grocery-prediction':
      return <GroceryCostPredictionGuideView onPlanWeek={onPlanWeek} />;
    case 'guides':
      return <GuidesLibraryView onPlanWeek={onPlanWeek} />;
    case 'five-a-day-guide':
      return <FiveADayGuideView onFindDinner={onFindDinner} />;
    case 'home-cooked-ready-made-guide':
      return <HomeCookedReadyMadeGuideView onFindDinner={onFindDinner} />;
    case 'cheap-finishing-touches-guide':
      return <CheapFinishingTouchesGuideView onFindDinner={onFindDinner} />;
    case 'low-cost-dinners-guide':
      return <LowCostDinnersGuideView onFindDinner={onFindDinner} />;
    default:
      return null;
  }
};
