import React from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface SearchOnboardingHelperProps {
  onDismiss: () => void;
}

export const SearchOnboardingHelper: React.FC<SearchOnboardingHelperProps> = ({ onDismiss }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <div className="bg-white rounded p-5 shadow-[0_1px_5px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        {/* Accent strip */}
        <div className="absolute top-0 left-0 w-1 h-full bg-dbd-accent/20" />
        
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 text-dbd-ink-3 p-2 hover:text-dbd-ink transition-colors z-10"
          aria-label="Dismiss onboarding"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-dbd-accent/10 flex items-center justify-center shrink-0">
              <Search size={14} className="text-dbd-accent" strokeWidth={3} />
            </div>
            <p className="text-[11px] font-bold text-dbd-accent uppercase tracking-widest pl-0.5">Search Guide</p>
          </div>

          <div className="space-y-2 text-left pl-0.5">
            <p className="text-[14px] text-dbd-ink font-bold leading-tight">
              Tap Search to find your first three recipes.
            </p>
            <p className="text-[13px] text-dbd-ink-2 font-medium leading-relaxed">
              Start with a dish, ingredient or cuisine.
            </p>
            <p className="text-[13px] text-dbd-ink-3 italic font-medium leading-relaxed">
              Open Preferences to narrow the results.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
