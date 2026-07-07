import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Calendar, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LogoIcon } from './icons/LogoIcon';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';
import { Tooltip } from './ui/Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  view: any;
  setView: (view: any) => void;
  onNewSearch: () => void;
}

const logoVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const wordVariants: any = {
  hidden: { opacity: 0, y: 5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

export const Layout: React.FC<LayoutProps> = ({ children, view, setView, onNewSearch }) => {
  const { user } = useAuth();

  // Revert any leftover dark mode class on the body/html element completely
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'force-light');
  }, []);

  return (
    <div className="min-h-screen border border-dbd-rule/10 bg-gray-50 text-dbd-ink flex flex-col transition-colors duration-250 pb-[env(safe-area-inset-bottom)]">
      {/* Navigation */}
      <nav className="border-b border-dbd-rule/50 sticky top-0 z-50 bg-dbd-surface pt-[calc(1.25rem+env(safe-area-inset-top))] md:pt-7 lg:pt-9 pb-0 transition-colors duration-250">
        <div className="max-w-6xl mx-auto px-3 md:px-3 lg:px-6">
          {/* Row 1: Brand & Utilities */}
          <div className="flex justify-between items-center mb-2 md:mb-3 lg:mb-4">
            <button 
              className="flex shrink-0 items-center cursor-pointer group focus:outline-none" 
              onClick={() => {
                setView('landing');
              }}
              aria-label="Logo - Back to landing page"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-dbd-surface-2 border border-dbd-rule/40 rounded-full flex items-center justify-center mr-2 group-hover:border-dbd-accent transition-all">
                <LogoIcon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col items-start text-left min-w-0">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={logoVariants}
                  className="text-[17px] sm:text-[19px] font-display font-semibold text-dbd-ink tracking-tight leading-none whitespace-nowrap"
                >
                  <motion.span variants={wordVariants} className="inline-block">Dinner</motion.span>
                  <motion.span variants={wordVariants} className="inline-block font-bold text-dbd-accent mx-[1px]">By</motion.span>
                  <motion.span variants={wordVariants} className="inline-block">Design</motion.span>
                </motion.div>
                <span className="text-[9px] font-medium text-dbd-ink-3 tracking-[0.05em] mt-1 opacity-80 text-left whitespace-nowrap hidden sm:block">Less searching. Better matches. Dinner, decided.</span>
              </div>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              <Tooltip text={user && !user.isAnonymous ? "View your account and preferences" : "Sign in and save your preferences and recipes for future visits"} position="bottom" align="right">
                <button 
                  onClick={() => setView('settings')}
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
              className={`flex-1 flex flex-col items-center py-1.5 md:py-2 lg:py-2.5 border-b-2 transition-all cursor-pointer ${view === 'home' ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <Search className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Search</span>
            </button>
            <button 
              onClick={() => setView('planner')}
              className={`flex-1 flex flex-col items-center py-1.5 md:py-2 lg:py-2.5 border-b-2 transition-all cursor-pointer ${view === 'planner' ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <Calendar className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Save & Schedule</span>
            </button>
            <button 
              onClick={() => setView('shopping')}
              className={`flex-1 flex flex-col items-center py-1.5 md:py-2 lg:py-2.5 border-b-2 transition-all cursor-pointer ${view === 'shopping' ? 'border-dbd-ink text-dbd-ink font-semibold' : 'border-transparent text-dbd-ink-3 hover:text-dbd-ink-2'}`}
            >
              <ShoppingCart className="w-4 h-4 mb-1 md:mb-1.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Shop</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto w-full px-2 sm:px-3 lg:px-4 py-4 bg-transparent">
        {children}
      </main>

      <Footer setView={setView} />
    </div>
  );
};
