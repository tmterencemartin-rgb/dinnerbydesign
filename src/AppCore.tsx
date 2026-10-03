import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { useSearch } from './hooks/useSearch';
import { getContradictionWarning, renderErrorMessage } from './lib/uiUtils';
import { AuthLoading, AuthError, AuthSyncing, AuthSignIn } from './components/AuthScreens';
import { useSeo, type SeoConfig } from './hooks/useSeo';
import { LEGACY_PUBLIC_GUIDE_VIEWS, LegacyPublicGuideView } from './LegacyPublicGuideView';

// Views
const HomeView = React.lazy(() => import('./components/views/HomeView').then(module => ({ default: module.HomeView })));
const SettingsView = React.lazy(() => import('./components/views/SettingsView').then(module => ({ default: module.SettingsView })));
const PlannerView = React.lazy(() => import('./components/views/PlannerView').then(module => ({ default: module.PlannerView })));
const ShoppingListView = React.lazy(() => import('./components/views/ShoppingListView').then(module => ({ default: module.ShoppingListView })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsView = React.lazy(() => import('./components/views/TermsView').then(module => ({ default: module.TermsView })));
const PricingMethodologyView = React.lazy(() => import('./components/views/PricingMethodologyView').then(module => ({ default: module.PricingMethodologyView })));
const FoodSafetyMethodologyView = React.lazy(() => import('./components/views/TransparencyMethodologyViews').then(module => ({ default: module.FoodSafetyMethodologyView })));
const NutritionMethodologyView = React.lazy(() => import('./components/views/TransparencyMethodologyViews').then(module => ({ default: module.NutritionMethodologyView })));
const RecipeMethodologyView = React.lazy(() => import('./components/views/TransparencyMethodologyViews').then(module => ({ default: module.RecipeMethodologyView })));
const AdminDashboard = React.lazy(() => import('./components/views/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const LandingView = React.lazy(() => import('./components/views/LandingView').then(module => ({ default: module.LandingView })));
const SuccessView = React.lazy(() => import('./components/views/SuccessView').then(module => ({ default: module.SuccessView })));
const SearchPageDesignConcept = React.lazy(() => import('./components/views/SearchPageDesignConcept').then(module => ({ default: module.SearchPageDesignConcept })));
const BudgetFamilySeoConcept = React.lazy(() => import('./components/views/BudgetFamilySeoConcept').then(module => ({ default: module.BudgetFamilySeoConcept })));
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

const ViewLoading = () => (
  <div className="flex min-h-[42vh] items-center justify-center" role="status" aria-live="polite">
    <div className="flex items-center gap-2 text-xs font-medium text-dbd-ink-3">
      <span className="h-3 w-3 animate-pulse rounded-full bg-dbd-accent" aria-hidden="true" />
      Opening…
    </div>
  </div>
);

const GUEST_VISIBLE_VIEWS = new Set<AppView>([
  'home',
  'planner',
  'shopping',
  'landing',
  'pricing-methodology',
  'food-safety',
  'recipe-methodology',
  'nutrition-methodology',
  'privacy',
  'terms',
  'signin',
  'success',
  'guides',
  'five-a-day-guide',
  'home-cooked-ready-made-guide',
  'cheap-finishing-touches-guide',
  'low-cost-dinners-guide',
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
]);

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
    clearError,
    toast,
    setToast
  } = useAuth();

  const [legacyPublicGuideSeo, setLegacyPublicGuideSeo] = useState<SeoConfig | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLegacyPublicGuideSeo(null);

    if (!LEGACY_PUBLIC_GUIDE_VIEWS.has(view)) return () => { cancelled = true; };

    void import('./content/legacyPublicGuideSeo').then(({ getLegacyPublicGuideSeoConfig }) => {
      if (!cancelled) setLegacyPublicGuideSeo(getLegacyPublicGuideSeoConfig(view));
    });

    return () => { cancelled = true; };
  }, [view]);

  const seoConfig = React.useMemo(() => {
    if (legacyPublicGuideSeo) return legacyPublicGuideSeo;

    if (LEGACY_PUBLIC_GUIDE_VIEWS.has(view)) {
      return {
        title: 'DinnerByDesign public resource',
        description: 'Practical dinner planning, recipe and food-cost guidance from DinnerByDesign.',
        canonicalPath: '/',
      };
    }

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
                    "name": "Why aren’t some publishers included?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We show published recipes only when we can link directly to an accessible recipe page. Some publishers are not included when their pages require a subscription, sign-in, app hand-off or do not reliably open as a direct recipe link."
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
                      "text": "Yes. Items are grouped so you can work through the list more easily, with ingredients combined across scheduled dinners where the app can scale them sensibly."
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
  }, [legacyPublicGuideSeo, view]);

  useSeo(seoConfig);

  const [showFilters, setShowFilters] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [isViewPending, startViewTransition] = React.useTransition();
  const isSearchDesignPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('design') === 'search-page';
  const isBudgetFamilySeoPreview = AFFORDABILITY_PLANNER_PILOT && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('design') === 'budget-family';

  const setView = (v: AppView, highlightOrFilters?: string | boolean | null) => {
    clearError();
    startViewTransition(() => {
      if (typeof highlightOrFilters === 'string') {
        setViewContext(v, highlightOrFilters);
        setShowFilters(false);
      } else if (typeof highlightOrFilters === 'boolean') {
        setViewContext(v);
        setShowFilters(highlightOrFilters);
      } else {
        setViewContext(v);
      }
    });
  };

  const searchState = useSearch();

  // Auto redirect guest user away from protected views to landing
  const isGuest = !user || user.isAnonymous;
  const openPlannerFromGuide = () => {
    if (isGuest) {
      safeStorage.session.setItem(AFFORDABILITY_PLANNER_PENDING_KEY, 'true');
      setView('signin');
      return;
    }
    setView('planner');
  };

  const openSearchFromGuide = () => {
    if (isGuest) {
      setView('signin');
      return;
    }
    setView('home');
  };

  const openFiveForTwoPlan = () => {
    safeStorage.session.setItem(AFFORDABILITY_PLANNER_PRESET_KEY, JSON.stringify({ dinnerCount: 5, budget: '40', servings: 2, minimiseCost: true, reuseIngredients: true }));
    openPlannerFromGuide();
  };

  React.useEffect(() => {
    if (!isAuthReady || isGuest) return;
    const preloadTimer = window.setTimeout(() => {
      void Promise.all([
        import('./components/views/PlannerView'),
        import('./components/views/ShoppingListView'),
        import('./components/views/SettingsView'),
      ]).catch(() => undefined);
    }, 1200);
    return () => window.clearTimeout(preloadTimer);
  }, [isAuthReady, isGuest]);

  React.useEffect(() => {
    if (!isAuthReady) return;
    if (isGuest && !GUEST_VISIBLE_VIEWS.has(view)) {
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
  }, [isAuthReady, isGuest, view]);

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
    if (authError) return <AuthError error={authError} />;
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

  if (LEGACY_PUBLIC_GUIDE_VIEWS.has(view)) {
    return (
      <LegacyPublicGuideView
        view={view}
        onPlanWeek={openPlannerFromGuide}
        onFindDinner={openSearchFromGuide}
        onPersonalise={openFiveForTwoPlan}
      />
    );
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

  // Guests can use the browser-only planning and shopping workspace. Account-only
  // views such as Settings and Admin remain protected.
  if (isGuest && !['home', 'planner', 'shopping'].includes(view)) {
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

      {isViewPending && (
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-dbd-ink-3" role="status" aria-live="polite">
          <span className="h-2 w-2 animate-pulse rounded-full bg-dbd-accent" aria-hidden="true" />
          Opening…
        </div>
      )}

      <React.Suspense fallback={<ViewLoading />}>
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
      </React.Suspense>
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

const AppCore = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default AppCore;
