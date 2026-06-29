import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, Sparkles } from 'lucide-react';

interface SearchOnboardingHelperProps {
  onDismiss: () => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

const STARTER_SUGGESTIONS = [
  'Something quick with chicken',
  'A low-cost vegetarian dinner'
];

export const SearchOnboardingHelper: React.FC<SearchOnboardingHelperProps> = ({ onDismiss, onSuggestionSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <div className="bg-white rounded p-4 border border-gray-100 relative overflow-hidden group">
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
            <div className="w-7 h-7 rounded bg-dbd-accent/10 flex items-center justify-center shrink-0">
              <Search size={14} className="text-dbd-accent" strokeWidth={3} />
            </div>
            <p className="text-[11px] font-bold text-dbd-accent tracking-[0.04em] pl-0.5">Getting started</p>
          </div>

          <div className="space-y-2 text-left pl-0.5">
            <p className="text-[14px] text-dbd-ink font-bold leading-tight">
              Find your first dinner recipe.
            </p>
            <p className="text-[13px] text-dbd-ink-2 font-medium leading-relaxed">
              Search by ingredient, dish, cuisine or chef. Or whatever you have in mind.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {STARTER_SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionSelect?.(suggestion)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-[11.5px] text-dbd-ink-2 font-semibold rounded border border-gray-100 transition-colors"
                >
                  <Sparkles size={12} className="text-dbd-accent" />
                  {suggestion}
                </button>
              ))}
            </div>
            <p className="text-[12.5px] text-dbd-ink-3 font-medium leading-relaxed pt-0.5">
              Use Preferences for diet, budget, portions and ingredients to avoid.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
