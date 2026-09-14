import React from 'react';

const CONTACT_EMAIL = 'terence@dinnerbydesign.app';

interface FooterProps {
  setView: (view: 'home' | 'settings' | 'planner' | 'shopping' | 'pricing-methodology' | 'food-safety' | 'recipe-methodology' | 'nutrition-methodology' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="shrink-0 border-t border-gray-100 bg-gray-50 py-4 sm:py-6">
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-5 px-3 sm:px-4 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.8fr)] md:items-start lg:grid-cols-[minmax(340px,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-x-12 lg:px-6">
        <div className="flex min-w-0 flex-col items-center md:items-start">
          <div className="relative z-10 flex flex-col items-center gap-0.5 text-[11px] text-gray-500 sm:gap-1 sm:text-[13px] md:items-start">
            <span>&copy; {currentYear} DinnerByDesign. All rights reserved.</span>
            <span className="text-[10.5px] font-semibold text-gray-500 sm:text-[12px]">
              Less searching. More relevant dinners.
            </span>
            <a 
              href="/contact"
              aria-label="Open contact form"
              className="relative z-50 block py-0.5 text-[11px] font-semibold text-dbd-accent transition-colors hover:text-dbd-accent-mid hover:underline sm:text-xs"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        
        <nav aria-label="Footer" className="grid grid-cols-1 justify-items-start gap-x-3 gap-y-3 text-left sm:grid-cols-3 sm:justify-items-center sm:gap-x-6 sm:gap-y-0 md:justify-items-start lg:col-span-3">
          <div className="min-w-0">
            <p className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-gray-500">Guides</p>
            <div className="flex flex-col items-start gap-1.5 md:gap-2">
              <a href="/dinner-plans" className="text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Affordable dinner plans</a>
              <a href="/recipes" className="text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Recipes and cooking ideas</a>
              <a href="/food-costs" className="text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Food-cost &amp; waste</a>
              <a href="/why-dinnerbydesign" className="text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Why DinnerByDesign?</a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-gray-500">Information</p>
            <div className="flex flex-col items-start gap-1.5 md:gap-2">
              <a href="/contact" className="text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Contact us</a>
              <a
                href="/pricing-methodology"
                onClick={(e) => {
                  e.preventDefault();
                  setView('pricing-methodology');
                }}
                className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]"
              >
                How prices are calculated
              </a>
              <a href="/food-safety" onClick={(e) => { e.preventDefault(); setView('food-safety'); }} className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Food safety</a>
              <a href="/recipe-methodology" onClick={(e) => { e.preventDefault(); setView('recipe-methodology'); }} className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Recipe information</a>
              <a href="/nutrition-methodology" onClick={(e) => { e.preventDefault(); setView('nutrition-methodology'); }} className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Nutrition estimates</a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-gray-500">Legal</p>
            <div className="flex flex-col items-start gap-1.5 md:gap-2">
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  setView('privacy');
                }}
                className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]"
              >
                Privacy & cookies
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  setView('terms');
                }}
                className="cursor-pointer text-[10.5px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </nav>

        <div className="border-t border-gray-200/50 pt-2.5 text-center text-[9.5px] leading-4 text-gray-500 sm:pt-3 sm:text-[11px] sm:leading-relaxed md:col-span-2 md:text-left lg:col-span-4">
          DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
        </div>
      </div>
    </footer>
  );
};
