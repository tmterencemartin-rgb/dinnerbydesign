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
import { AdminDashboard } from './components/views/AdminDashboard';
import { LandingView } from './components/views/LandingView';
import { SuccessView } from './components/views/SuccessView';
import { Toast } from './components/ui/Toast';
import { InstallPrompt } from './components/InstallPrompt';
import { BookmarkPrompt } from './components/BookmarkPrompt';
import { AppView } from './types';

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
          title: 'Privacy Policy — DinnerByDesign',
          description: 'Read the privacy policy of DinnerByDesign to see how we protect and manage your private data.',
          canonicalPath: '/privacy'
        };
      case 'terms':
        return {
          title: 'Terms of Service — DinnerByDesign',
          description: 'Review the terms of service, trial rules, and subscription details for DinnerByDesign.',
          canonicalPath: '/terms'
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
          description: 'DinnerByDesign is an ad-free UK dinner recipe app for verified dinner ideas, ready-made supermarket options, preference-led search and costed shopping lists.',
          canonicalPath: '/',
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "DinnerByDesign",
                "url": "https://dinnerbydesign.app/",
                "description": "Ad-free UK dinner finding with verified dinner ideas, ready-made supermarket options, preference-led search and costed shopping lists.",
                "applicationCategory": "FoodAndDrinkApplication",
                "operatingSystem": "Web",
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
                      "text": "DinnerByDesign is an ad-free UK dinner recipe app which enables you to search, compare, save, schedule and shop from one place."
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
    if (isGuest && view !== 'home' && (view as string) !== 'landing' && view !== 'privacy' && view !== 'terms' && view !== 'signin' && view !== 'success') {
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
