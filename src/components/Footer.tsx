import React, { useEffect, useRef, useState } from 'react';

const CONTACT_EMAIL = 'chef@dinnerbydesign.app';

interface FooterProps {
  setView: (view: 'home' | 'settings' | 'planner' | 'shopping' | 'pricing-methodology' | 'food-safety' | 'recipe-methodology' | 'nutrition-methodology' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);
  const copiedResetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (copiedResetTimer.current !== null) {
      window.clearTimeout(copiedResetTimer.current);
    }
  }, []);

  const copyEmailAsFallback = () => {
    if (!navigator.clipboard?.writeText) return;

    void navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setEmailCopied(true);

      if (copiedResetTimer.current !== null) {
        window.clearTimeout(copiedResetTimer.current);
      }

      copiedResetTimer.current = window.setTimeout(() => {
        setEmailCopied(false);
        copiedResetTimer.current = null;
      }, 2500);
    }).catch(() => {
      // The mail link still opens normally when clipboard access is unavailable.
    });
  };
  
  return (
    <footer className="shrink-0 border-t border-gray-100 bg-gray-50 py-4 sm:py-6">
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-4 px-4 sm:gap-y-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:px-10">
        <div className="flex min-w-0 flex-col items-center lg:items-start">
          <div className="relative z-10 flex flex-col items-center gap-0.5 text-[11px] text-gray-500 sm:gap-1 sm:text-[13px] lg:items-start">
            <span>&copy; {currentYear} DinnerByDesign. All rights reserved.</span>
            <span className="text-[10.5px] font-semibold text-gray-400 sm:text-[12px]">
              Less searching. Better matches. Dinner, decided.
            </span>
            <a 
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={copyEmailAsFallback}
              aria-label={`Email ${CONTACT_EMAIL}. The address will also be copied.`}
              className="relative z-50 block py-0.5 text-[11px] font-semibold text-accent transition-colors hover:text-accent/80 hover:underline sm:text-xs"
            >
              {emailCopied ? 'Email address copied' : CONTACT_EMAIL}
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-2 lg:justify-end">
          <a href="/dinner-plans" className="whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Affordable dinner plans
          </a>
          <a href="/recipes" className="whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Recipes and cooking ideas
          </a>
          <a href="/food-costs" className="whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Food-cost &amp; waste
          </a>
          <a
            href="/pricing-methodology"
            onClick={(e) => {
              e.preventDefault();
              setView('pricing-methodology');
            }}
            className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]"
          >
            How prices are calculated
          </a>
          <a href="/food-safety" onClick={(e) => { e.preventDefault(); setView('food-safety'); }} className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Food safety
          </a>
          <a href="/recipe-methodology" onClick={(e) => { e.preventDefault(); setView('recipe-methodology'); }} className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Recipe information
          </a>
          <a href="/nutrition-methodology" onClick={(e) => { e.preventDefault(); setView('nutrition-methodology'); }} className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]">
            Nutrition estimates
          </a>
          <a 
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              setView('privacy');
            }}
            className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]"
          >
            Privacy & cookies
          </a>
          <a 
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              setView('terms');
            }}
            className="cursor-pointer whitespace-nowrap text-[11px] text-gray-500 transition-colors hover:text-gray-900 sm:text-[13px]"
          >
            Terms of Service
          </a>
        </div>

        <div className="border-t border-gray-200/50 pt-2.5 text-center text-[9.5px] leading-4 text-gray-400 sm:pt-3 sm:text-[11px] sm:leading-relaxed lg:col-span-2 lg:text-left">
          DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
        </div>
      </div>
    </footer>
  );
};
