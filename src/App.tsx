import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { Layout } from './components/Layout';
import { useSearch } from './hooks/useSearch';
import { getContradictionWarning, renderErrorMessage } from './lib/uiUtils';
import { AuthLoading, AuthError, AuthSyncing, AuthSignIn } from './components/AuthScreens';
import { useSeo } from './hooks/useSeo';

// Views
import { HomeView } from './components/views/HomeView';
import { SettingsView } from './components/views/SettingsView';
import { PlannerView } from './components/views/PlannerView';
import { ShoppingListView } from './components/views/ShoppingListView';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsView } from './components/views/TermsView';
import { PricingMethodologyView } from './components/views/PricingMethodologyView';
import {
  FoodSafetyMethodologyView,
  NutritionMethodologyView,
  RecipeMethodologyView,
} from './components/views/TransparencyMethodologyViews';
import { AdminDashboard } from './components/views/AdminDashboard';
import { LandingView } from './components/views/LandingView';
import { SuccessView } from './components/views/SuccessView';
import { SearchPageDesignConcept } from './components/views/SearchPageDesignConcept';
import { BudgetFamilySeoConcept } from './components/views/BudgetFamilySeoConcept';
import { SeoMealPlanView } from './components/views/SeoMealPlanView';
import { FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd } from './content/seoMealPlans';
import { FoodCostGuideView } from './components/views/FoodCostGuideView';
import { LowerCostCutsGuideView } from './components/views/LowerCostCutsGuideView';
import { LowCostCookingTechniquesGuideView } from './components/views/LowCostCookingTechniquesGuideView';
import { CookingForOneGuideView } from './components/views/CookingForOneGuideView';
import { OffalBudgetGuideView } from './components/views/OffalBudgetGuideView';
import { PortionPlanningGuideView } from './components/views/PortionPlanningGuideView';
import {
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  LOW_COST_COOKING_TECHNIQUES_GUIDE,
  LOW_COST_COOKING_TECHNIQUES_PATH,
  OFFAL_BUDGET_GUIDE,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE,
  PORTION_PLANNING_GUIDE_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getCookingForOneJsonLd,
  getLowerCostCutsJsonLd,
  getLowCostCookingTechniquesJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getUkFoodCosts2026JsonLd,
} from './content/seoFoodCostGuides';
import { Toast } from './components/ui/Toast';
import { InstallPrompt } from './components/InstallPrompt';
import { BookmarkPrompt } from './components/BookmarkPrompt';
import { AppView } from './types';
import { safeStorage } from './lib/storage';
import {
  AFFORDABILITY_PLANNER_PENDING_KEY,
  AFFORDABILITY_PLANNER_PILOT,
  AFFORDABILITY_PLANNER_PRESET_KEY,
} from './config/features';

import { StatusBanner } from './components/StatusBanner';

const AppContent = () => {
  const { 
    user, 
    profile, 
    isAuthReady, 
    error, 
    authError,
    view,
    setView: setViewContext,
    highlight,
    clearHighlight,
    toast,
    setToast
  } = useAuth();

  const seoConfig = React.useMemo(() => {
    switch (view) {
      case 'planner':
        return {
          title: 'Your Dinner Planner — DinnerByDesign',
          description: 'Organise your bespoke recipes, coordinate portion counts, and manage your weekly dinner schedule with DinnerByDesign.',
          canonicalPath: '/planner',
          noIndex: true
        };
      case 'shopping':
        return {
          title: 'Your Shopping List — DinnerByDesign',
          description: 'View your dynamic smart shopping list automatically grouped by department for efficient grocery shopping.',
          canonicalPath: '/shopping',
          noIndex: true
        };
      case 'settings':
        return {
          title: 'Account Settings — DinnerByDesign',
          description: 'Manage your dietary rules, allergies, ingredient exclusions, unit system, and account preferences.',
          canonicalPath: '/settings',
          noIndex: true
        };
      case 'privacy':
        return {
          title: 'Privacy, Cookies & AI Data — DinnerByDesign',
          description: 'Read how DinnerByDesign handles account data, AI processing, service providers, retention, cookies and UK data-protection rights.',
          canonicalPath: '/privacy'
        };
      case 'terms':
        return {
          title: 'Terms of Service — DinnerByDesign',
          description: 'Review DinnerByDesign service terms, free-trial rules, subscription prices, renewals, cancellation, refunds and account access.',
          canonicalPath: '/terms'
        };
      case 'pricing-methodology':
        return {
          title: 'Ingredient Pricing Methodology — DinnerByDesign',
          description: 'Learn how DinnerByDesign calculates estimated ingredient costs, full-pack checkout costs, catalogue coverage and price fallbacks.',
          canonicalPath: '/pricing-methodology'
        };
      case 'food-safety':
        return {
          title: 'Dietary, Allergy & Cooking Safety — DinnerByDesign',
          description: 'Understand how DinnerByDesign applies dietary rules and allergy filters, and why labels and safe cooking guidance must still be checked.',
          canonicalPath: '/food-safety'
        };
      case 'recipe-methodology':
        return {
          title: 'Recipe & Recommendation Methodology — DinnerByDesign',
          description: 'Learn how DinnerByDesign creates, attributes, checks and selects recipe and ready-made dinner information.',
          canonicalPath: '/recipe-methodology'
        };
      case 'nutrition-methodology':
        return {
          title: 'Nutrition Estimate Methodology — DinnerByDesign',
          description: 'Learn how DinnerByDesign nutrition and calorie estimates are produced and why actual values may vary.',
          canonicalPath: '/nutrition-methodology'
        };
      case 'success':
        return {
          title: 'Subscription Success — DinnerByDesign',
          description: 'Thank you for subscribing to DinnerByDesign Premium! Your account has been upgraded.',
          canonicalPath: '/success',
          noIndex: true
        };
      case 'signin':
        return {
          title: 'Sign In / Sign Up — DinnerByDesign',
          description: 'Access your DinnerByDesign account or create a new profile to start planning your custom menus.',
          canonicalPath: '/signin',
          noIndex: true
        };
      case 'admin':
        return {
          title: 'Admin Dashboard — DinnerByDesign',
          description: 'DinnerByDesign Administration and Management.',
          canonicalPath: '/admin',
          noIndex: true
        };
      case 'meal-plan-five-for-two-under-40':
        return {
          title: '5 Affordable Dinners for Two Under £40 | DinnerByDesign',
          description: 'Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.',
          canonicalPath: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
          jsonLd: getFiveDinnersForTwoJsonLd()
        };
      case 'food-costs-uk-2026':
        return {
          title: `${UK_FOOD_COSTS_2026.title} | DinnerByDesign`,
          description: UK_FOOD_COSTS_2026.description,
          canonicalPath: UK_FOOD_COSTS_2026_PATH,
          jsonLd: getUkFoodCosts2026JsonLd()
        };
      case 'food-costs-lower-cost-cuts':
        return {
          title: LOWER_COST_CUTS_GUIDE.seoTitle,
          description: LOWER_COST_CUTS_GUIDE.description,
          canonicalPath: LOWER_COST_CUTS_PATH,
          jsonLd: getLowerCostCutsJsonLd()
        };
      case 'food-costs-low-cost-cooking-techniques':
        return {
          title: LOW_COST_COOKING_TECHNIQUES_GUIDE.seoTitle,
          description: LOW_COST_COOKING_TECHNIQUES_GUIDE.description,
          canonicalPath: LOW_COST_COOKING_TECHNIQUES_PATH,
          jsonLd: getLowCostCookingTechniquesJsonLd()
        };
      case 'food-costs-cooking-for-one':
        return {
          title: COOKING_FOR_ONE_GUIDE.seoTitle,
          description: COOKING_FOR_ONE_GUIDE.description,
          canonicalPath: COOKING_FOR_ONE_PATH,
          jsonLd: getCookingForOneJsonLd()
        };
      case 'food-costs-offal-budget':
        return {
          title: OFFAL_BUDGET_GUIDE.seoTitle,
          description: OFFAL_BUDGET_GUIDE.description,
          canonicalPath: OFFAL_BUDGET_GUIDE_PATH,
          jsonLd: getOffalBudgetGuideJsonLd()
        };
      case 'food-costs-portion-planning':
        return {
          title: PORTION_PLANNING_GUIDE.seoTitle,
          description: PORTION_PLANNING_GUIDE.description,
          canonicalPath: PORTION_PLANNING_GUIDE_PATH,
          jsonLd: getPortionPlanningGuideJsonLd()
        };
      case 'home':
      case 'landing':
      default:
        return {
          title: 'DinnerByDesign | Ad-free UK Dinner Recipe Finder & Costed Shopping Lists',
          description: 'Ad-free UK dinner recipes. Search by budget, get multiple options per search, plus costed shopping lists.',
          canonicalPath: '/',
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "DinnerByDesign",
                "url": "https://dinnerbydesign.app/",
                "description": "DinnerByDesign is an ad-free UK dinner recipe finder for verified dinner ideas, ready-made supermarket options, preference-led search, scheduling and costed shopping lists.",
                "applicationCategory": "FoodAndDrinkApplication",
                "operatingSystem": "Web",
                "alternateName": "DinnerByDesign app",
                "brand": {
                  "@type": "Brand",
                  "name": "DinnerByDesign"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "2.99",
                  "priceCurrency": "GBP",
                  "description": "Monthly access after a seven-day free trial."
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is DinnerByDesign?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "DinnerByDesign is an ad-free UK dinner recipe finder. It helps you search, compare, save, schedule and shop for dinner ideas from one place."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I search by ingredients I already have?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Search from ingredients in your fridge or cupboard, then use preferences to narrow results by diet, budget, time and cooking method."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does it include supermarket ready-made options?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Ready-made mode helps find convenient supermarket options and turns each result into a practical dinner kit with sides and simple upgrades."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does it estimate shopping costs?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. DinnerByDesign estimates cost per portion and builds a grouped UK shopping list from your scheduled dinners."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can DinnerByDesign plan dinners to a weekly budget?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Choose your number of dinners, household size and weekly budget. DinnerByDesign prioritises suitable lower-cost options and ingredient reuse, then shows the combined estimated dinner cost against your target. Schedule your chosen dinners to generate the shopping list."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is DinnerByDesign a video-based guided cooking app?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No. DinnerByDesign is a search, planning and shopping-list app for dinner ideas. It is not a video-based guided cooking lesson app."
                    }
                  }
                ]
              }
            ]
          }
        };
    }
  }, [view]);

  useSeo(seoConfig);

  const [showFilters, setShowFilters] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const isSearchDesignPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('design') === 'search-page';
  const isBudgetFamilySeoPreview = AFFORDABILITY_PLANNER_PILOT && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('design') === 'budget-family';

  const setView = (v: AppView, highlightOrFilters?: string | boolean | null) => {
    if (typeof highlightOrFilters === 'string') {
      setViewContext(v, highlightOrFilters);
      setShowFilters(false);
    } else if (typeof highlightOrFilters === 'boolean') {
      setViewContext(v);
      setShowFilters(highlightOrFilters);
    } else {
      setViewContext(v);
    }
  };

  const searchState = useSearch();

  // Auto redirect guest user away from protected views to landing
  const isGuest = !user || user.isAnonymous;
  React.useEffect(() => {
    if (isGuest && view !== 'home' && (view as string) !== 'landing' && view !== 'pricing-methodology' && view !== 'food-safety' && view !== 'recipe-methodology' && view !== 'nutrition-methodology' && view !== 'privacy' && view !== 'terms' && view !== 'signin' && view !== 'success' && view !== 'meal-plan-five-for-two-under-40' && view !== 'food-costs-uk-2026' && view !== 'food-costs-lower-cost-cuts' && view !== 'food-costs-low-cost-cooking-techniques' && view !== 'food-costs-cooking-for-one' && view !== 'food-costs-offal-budget' && view !== 'food-costs-portion-planning') {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const isFromEmail = params?.get('view') === 'home' || params?.get('from') === 'email' || params?.get('highlight') === 'password-management';
      if (isFromEmail) {
        setView('signin');
      } else {
        setView('landing');
      }
    }
    // Auto-redirect signed-in users away from auth and landing views
    if (!isGuest && (view === 'signin' || view === 'landing')) {
      setView('home');
    }
  }, [isGuest, view]);

  React.useEffect(() => {
    if (!AFFORDABILITY_PLANNER_PILOT || isGuest) return;
    if (safeStorage.session.getItem(AFFORDABILITY_PLANNER_PENDING_KEY) !== 'true') return;
    safeStorage.session.removeItem(AFFORDABILITY_PLANNER_PENDING_KEY);
    setView('planner');
  }, [isGuest]);

  // Check the active auth state upon return from subscription purchase,
  // and if a valid user session exists, route them straight to the success view.
  React.useEffect(() => {
    if (isAuthReady) {
      const params = new URLSearchParams(window.location.search);
      const isReturnFromCheckout = params.has('session_id');
      const hasValidSession = user && !user.isAnonymous;
      
      if (isReturnFromCheckout && hasValidSession) {
        if (view !== 'success') {
          setView('success');
        }
      }
    }
  }, [isAuthReady, user, view, setView]);

  if (!isAuthReady) {
    return <AuthLoading />;
  }

  // Handle high-latency profile sync to prevent flash of unstyled/empty content
  if (user && !user.isAnonymous && !profile && isAuthReady) {
    return <AuthSyncing />;
  }

  if (isSearchDesignPreview) {
    return (
      <Layout view="home" setView={setView} onNewSearch={() => {}}>
        <SearchPageDesignConcept
          onBack={() => {
            window.history.pushState({}, '', '/?view=home');
            setView('home');
          }}
        />
      </Layout>
    );
  }

  if (isBudgetFamilySeoPreview) {
    return (
      <BudgetFamilySeoConcept
        onBack={() => {
          window.history.pushState({}, '', '/?view=landing');
          setView('landing');
        }}
        onUsePlan={() => {
          safeStorage.session.setItem(AFFORDABILITY_PLANNER_PRESET_KEY, JSON.stringify({
            dinnerCount: 5,
            budget: '30',
            servings: 4,
            minimiseCost: true,
            reuseIngredients: true,
          }));
          if (isGuest) {
            safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
            setView('signin');
            return;
          }
          setView('planner');
        }}
      />
    );
  }

  if (view === 'landing') {
    return <LandingView />;
  }

  // Allow guests to view Privacy, Terms or Success standalone without forcing registration/sign-in
  if (view === 'privacy') {
    return <PrivacyPage setView={setView} />;
  }

  if (view === 'terms') {
    return <TermsView setView={setView} />;
  }

  if (view === 'pricing-methodology') {
    return <PricingMethodologyView setView={setView} />;
  }

  if (view === 'food-safety') {
    return <FoodSafetyMethodologyView setView={setView} />;
  }

  if (view === 'recipe-methodology') {
    return <RecipeMethodologyView setView={setView} />;
  }

  if (view === 'nutrition-methodology') {
    return <NutritionMethodologyView setView={setView} />;
  }

  if (view === 'meal-plan-five-for-two-under-40') {
    return <SeoMealPlanView onPersonalise={() => {
      safeStorage.session.setItem(AFFORDABILITY_PLANNER_PRESET_KEY, JSON.stringify({ dinnerCount: 5, budget: '40', servings: 2, minimiseCost: true, reuseIngredients: true }));
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-uk-2026') {
    return <FoodCostGuideView onPlanWeek={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-lower-cost-cuts') {
    return <LowerCostCutsGuideView onFindDinners={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-low-cost-cooking-techniques') {
    return <LowCostCookingTechniquesGuideView onFindDinners={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-cooking-for-one') {
    return <CookingForOneGuideView onPlanDinners={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-offal-budget') {
    return <OffalBudgetGuideView onFindDinners={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'food-costs-portion-planning') {
    return <PortionPlanningGuideView onPlanWeek={() => {
      if (isGuest) {
        safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
        setView('signin');
        return;
      }
      setView('planner');
    }} />;
  }

  if (view === 'success') {
    return (
      <Layout view={view} setView={setView} onNewSearch={() => {}}>
        <SuccessView setView={setView} />
      </Layout>
    );
  }

  if (view === 'signin' && (!user || user.isAnonymous)) {
    if (authError) return <AuthError error={authError} />;
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isSignInByDefault = params?.get('mode') === 'signin' || params?.get('view') === 'home' || params?.get('from') === 'email' || params?.get('highlight') === 'password-management';
    return <AuthSignIn defaultMode={isSignInByDefault ? 'signin' : 'signup'} />;
  }

  if (isGuest && view !== 'home') {
    if (authError) return <AuthError error={authError} />;
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isSignInByDefault = params?.get('mode') === 'signin' || params?.get('view') === 'home' || params?.get('from') === 'email' || params?.get('highlight') === 'password-management';
    return <AuthSignIn defaultMode={isSignInByDefault ? 'signin' : 'signup'} />;
  }

  const localContradiction = getContradictionWarning(
    searchState.input,
    profile?.preferences || null,
    searchState.isDietaryRuleSuppressed,
    () => {
      searchState.setIsDietaryRuleSuppressed(true);
      searchState.handleGenerate();
    },
    searchState.activeCriteria
  );

  const contradictionWarning = localContradiction || (searchState.searchContradiction ? {
    type: searchState.searchContradiction.type,
    content: searchState.searchContradiction.content,
    colors: searchState.searchContradiction.type === 'conflict' ? { text: '#8C4A43', bg: '#FDF2F0', border: '#F5E1DE' } : 
            searchState.searchContradiction.type === 'no_results' ? { text: '#5E554A', bg: '#F7F5F1', border: '#E5E0D8' } :
            { text: '#5E554A', bg: '#F0EDE8', border: '#D9D2C7' }
  } : null);


  return (
    <>
      <StatusBanner setView={setView} />
      <Layout 
        view={view} 
        setView={setView} 
        onNewSearch={searchState.handleNewSearch}
      >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {renderErrorMessage(error)}
        </div>
      )}
      
      <AnimatePresence>
        {view === 'home' && (
          <HomeView 
            {...searchState}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setPreferencesError={() => {}}
            contradictionWarning={contradictionWarning}
            isEmptyResults={!searchState.isGenerating && !searchState.isAppending && !searchState.searchError && searchState.lastQuery !== '' && (searchState.source === 'cook' ? (searchState.currentRecipes !== null && searchState.currentRecipes.length === 0) : (searchState.currentReadyMeals !== null && searchState.currentReadyMeals.length === 0))}
            showInlineSuccess={showInlineSuccess}
            localPreferences={profile?.preferences || {}}
            updateLocalPreference={() => {}} 
            handleTotalTimeChange={(val) => searchState.setMaxTotalTime(val)}
            timeConflict={null}
            setView={setView}
            cookingMethods={searchState.cookingMethods}
            setCookingMethods={searchState.setCookingMethods}
            saladPreference={searchState.saladPreference}
            setSaladPreference={searchState.setSaladPreference}
          />
        )}
        {view === 'settings' && (
          <SettingsView 
            setView={setView} 
            highlight={highlight} 
            clearHighlight={clearHighlight} 
          />
        )}
        {view === 'planner' && (
          <PlannerView 
            setView={setView}
          />
        )}
        {view === 'shopping' && (
          <ShoppingListView setView={setView} />
        )}
        {view === 'admin' && (
          <AdminDashboard />
        )}
      </AnimatePresence>
    </Layout>
      <AnimatePresence>
        {toast && (
          <Toast 
            key={toast.id}
            message={toast.message} 
            actionLabel={toast.actionLabel} 
            onAction={toast.onAction} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
      <InstallPrompt />
      <BookmarkPrompt />
    </>
  );
};

const App = () => {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppErrorBoundary>
  );
};

export default App;
