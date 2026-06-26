import React from 'react';

interface FooterProps {
  setView: (view: 'home' | 'settings' | 'planner' | 'shopping' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-end space-y-4 lg:space-y-0">
        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="text-gray-500 text-[13px] flex flex-col items-center lg:items-start gap-1 relative z-10">
            <span>&copy; {currentYear} DinnerByDesign. All rights reserved.</span>
            <a 
              href="mailto:chef@dinnerbydesign.app" 
              className="relative z-50 block text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors py-0.5 text-xs"
            >
              chef@dinnerbydesign.app
            </a>
          </div>
          <div className="text-gray-400 text-[11px] max-w-2xl text-center lg:text-left leading-relaxed mt-4 pt-2 border-t border-gray-200/50 relative">
            DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, or food brand mentioned on this platform. Chef names are used solely as descriptive search filters to help users find recipes in a particular culinary style. All recipes are sourced from their respective websites and full attribution is provided. DinnerByDesign claims no ownership of third-party recipe content.
          </div>
        </div>
        
        <div className="flex items-center space-x-6 shrink-0">
          <a 
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              setView('privacy');
            }}
            className="text-gray-500 hover:text-gray-900 text-[13px] transition-colors whitespace-nowrap cursor-pointer"
          >
            Privacy Policy
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
      </div>
    </footer>
  );
};
