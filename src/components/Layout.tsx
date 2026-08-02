import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Calendar, LockKeyhole, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';
import { Tooltip } from './ui/Tooltip';
import { safeStorage } from '../lib/storage';

const LOGO_EASE: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

interface LayoutProps {
  children: React.ReactNode;
  view: any;
  setView: (view: any) => void;
  onNewSearch: () => void;
}

const logoVariants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      clipPath: {
        duration: 0.75,
        ease: LOGO_EASE
      },
      opacity: {
        duration: 0.25
      }
    }
  }
};

export const Layout: React.FC<LayoutProps> = ({ children, view, setView, onNewSearch }) => {
  const { user, goToSignIn, showToast } = useAuth();
  const isGuest = !user || user.isAnonymous;

  const requireAccount = useCallback((message: string) => {
    if (user && !user.isAnonymous) return false;
    showToast(message, 'Sign In', goToSignIn);
    return true;
  }, [goToSignIn, showToast, user]);

  const goToSavedRecipes = useCallback(() => {
    if (requireAccount('Sign in to save and schedule dinners.')) return;

    if (view === 'planner') {
      document.getElementById('saved-recipes-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    safeStorage.session.setItem('dbd_planner_target', 'saved-recipes');
    setView('planner');
  }, [requireAccount, setView, view]);

  const goToShopping = useCallback(() => {
    if (requireAccount('Sign in to create and manage your shopping list.')) return;
    setView('shopping');
  }, [requireAccount, setView]);

  // Revert any leftover dark mode class on the body/html element completely
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'force-light');
  }, []);

  return (
    <div className="native-scroll-root min-h-screen overflow-x-hidden border border-dbd-rule/10 bg-gray-50 text-dbd-ink flex flex-col transition-colors duration-250 pb-[env(safe-area-inset-bottom)]">
      {/* Navigation */}
      <nav className="app-header border-b border-dbd-rule/50 sticky top-0 z-50 bg-dbd-surface pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-[calc(1.125rem+env(safe-area-inset-top))] pb-0 transition-colors duration-250">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Row 1: Brand & Utilities */}
          <div className="flex min-h-[62px] justify-between items-center mb-3 sm:min-h-[78px]">
            <button 
              className="flex shrink-0 items-center cursor-pointer group focus:outline-none" 
              onClick={() => {
                setView('landing');
              }}
              aria-label="Logo - Back to landing page"
            >
              <div className="flex min-w-0 flex-col items-center text-center">
                <motion.img
                  initial="hidden"
                  animate="visible"
                  variants={logoVariants}
                  whileHover={{ scale: 1.035, rotate: -0.3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  src="/dbd-logo-with-pin.png"
                  alt="DinnerByDesign"
                  className="app-header-logo h-[33.3px] w-auto max-w-[200.7px] origin-left object-contain mix-blend-multiply sm:h-[41.4px] sm:max-w-[250.2px]"
                />
                <span className="mt-1 block w-full whitespace-nowrap text-center text-[7.5px] font-medium tracking-[0.035em] text-dbd-ink-3 opacity-80 sm:text-[9px] sm:tracking-[0.05em]">Less searching. Precise matches. Dinner, decided.</span>
              </div>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              <Tooltip text={user && !user.isAnonymous ? "View your account and preferences" : "Sign in and save your preferences and recipes for future visits"} position="bottom" align="right">
                <button 
                  onClick={() => {
                    if (user && !user.isAnonymous) {
                      setView('settings');
                    } else {
                      goToSignIn();
                    }
                  }}
                  className={`text-[11px] sm:text-[12px] font-bold px-1.5 sm:px-2 py-1 transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${view === 'settings' ? 'text-dbd-accent font-semibold' : 'text-dbd-accent hover:opacity-70'}`}
                >
                  {user && !user.isAnonymous && (
                    <div className="w-5 h-5 rounded-full bg-dbd-surface-2 border border-dbd-rule/40 flex items-center justify-center overflow-hidden shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] text-dbd-accent uppercase">{user.email?.charAt(0) || user.displayName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  )}
                  <span>{user && !user.isAnonymous ? 'Account' : 'Sign In'}</span>
                </button>
              </Tooltip>

            </div>
          </div>

          {/* Row 2: Primary Navigation Tabs */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView('home')}
              className={`flex-1 flex min-h-[46px] flex-col items-center justify-center py-2 border-b-2 transition-all cursor-pointer ${view === 'home' ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <Search className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Search</span>
            </button>
            <button 
              onClick={goToSavedRecipes}
              aria-label={isGuest ? 'Save & Schedule, sign in required' : 'Save & Schedule'}
              title={isGuest ? 'Sign in to save and schedule dinners' : undefined}
              className={`flex-1 flex min-h-[46px] flex-col items-center justify-center py-2 border-b-2 transition-all cursor-pointer ${view === 'planner' && !isGuest ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <Calendar className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest">
                Save & Schedule
                {isGuest && <LockKeyhole className="h-2.5 w-2.5" aria-hidden="true" />}
              </span>
            </button>
            <button 
              onClick={goToShopping}
              aria-label={isGuest ? 'Shopping, sign in required' : 'Shopping'}
              title={isGuest ? 'Sign in to create and manage your shopping list' : undefined}
              className={`flex-1 flex min-h-[46px] flex-col items-center justify-center py-2 border-b-2 transition-all cursor-pointer ${view === 'shopping' && !isGuest ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <ShoppingCart className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest">
                Shopping
                {isGuest && <LockKeyhole className="h-2.5 w-2.5" aria-hidden="true" />}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="min-w-0 flex-grow max-w-6xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4 bg-transparent">
        {children}
      </main>

      {isGuest && <Footer setView={setView} />}
    </div>
  );
};
