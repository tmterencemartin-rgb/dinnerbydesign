import React from 'react';

interface FooterProps {
  setView: (view: 'home' | 'settings' | 'planner' | 'shopping' | 'pricing-methodology' | 'food-safety' | 'recipe-methodology' | 'nutrition-methodology' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="grow border-t border-gray-100 bg-gray-50 py-6">
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-5 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:px-10">
        <div className="flex min-w-0 flex-col items-center lg:items-start">
          <div className="text-gray-500 text-[13px] flex flex-col items-center lg:items-start gap-1 relative z-10">
            <span>&copy; {currentYear} DinnerByDesign. All rights reserved.</span>
            <span className="text-gray-400 text-[12px] font-semibold">
              Less searching. Better matches. Dinner, decided.
            </span>
            <a 
              href="mailto:chef@dinnerbydesign.app" 
              className="relative z-50 block text-accent font-semibold hover:text-accent/80 hover:underline transition-colors py-0.5 text-xs"
            >
              chef@dinnerbydesign.app
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-end">
          <a href="/guides" className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap">
            Guides
          </a>
          <a
            href="/pricing-methodology"
            onClick={(e) => {
              e.preventDefault();
              setView('pricing-methodology');
            }}
            className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer"
          >
            How prices are calculated
          </a>
          <a href="/food-safety" onClick={(e) => { e.preventDefault(); setView('food-safety'); }} className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer">
            Food safety
          </a>
          <a href="/recipe-methodology" onClick={(e) => { e.preventDefault(); setView('recipe-methodology'); }} className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer">
            Recipe information
          </a>
          <a href="/nutrition-methodology" onClick={(e) => { e.preventDefault(); setView('nutrition-methodology'); }} className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer">
            Nutrition estimates
          </a>
          <a 
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              setView('privacy');
            }}
            className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer"
          >
            Privacy & cookies
          </a>
          <a 
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              setView('terms');
            }}
            className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer"
          >
            Terms of Service
          </a>
        </div>

        <div className="border-t border-gray-200/50 pt-3 text-center text-[11px] leading-relaxed text-gray-400 lg:col-span-2 lg:text-left">
          DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
        </div>
      </div>
    </footer>
  );
};
