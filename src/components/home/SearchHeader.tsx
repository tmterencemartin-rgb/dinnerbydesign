import React from 'react';
import { motion } from 'framer-motion';
import { DinnerSource } from '../../types';

export type SearchMode = 'published' | 'ai-created' | 'ready-made';

export const SEARCH_MODE_DESCRIPTIONS: Record<SearchMode, string> = {
  'ai-created': 'Recipe ideas built around your ingredients and preferences.',
  published: 'Recipes from named UK publishers, linking out to the original page.',
  'ready-made': 'Choose your favourite or closest supermarket or retailer in preferences'
};

interface SearchHeaderProps {
  source: DinnerSource;
  setSource: (source: DinnerSource) => void;
  isDietaryRuleSuppressed: boolean;
  suppressedPermanentKeys: string[];
  clearSuppression: () => void;
  sourceHandoff?: boolean;
  threeWaySearch?: boolean;
  mode?: SearchMode;
  onModeChange?: (mode: SearchMode) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  source,
  setSource,
  isDietaryRuleSuppressed,
  suppressedPermanentKeys,
  clearSuppression,
  sourceHandoff = false,
  threeWaySearch = false,
  mode = 'published',
  onModeChange
}) => {
  if (threeWaySearch) {
    const modes: Array<{ id: SearchMode; label: string }> = [
      { id: 'ai-created', label: 'AI-created recipes' },
      { id: 'published', label: 'Published recipes' },
      { id: 'ready-made', label: 'Ready-made dinners' }
    ];

    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[620px] grid grid-cols-3 gap-1 rounded bg-gray-100/80 p-1">
          {modes.map(searchMode => {
            const isActive = mode === searchMode.id;
            return (
              <button
                key={searchMode.id}
                id={`mode-${searchMode.id}`}
                type="button"
                onClick={() => onModeChange?.(searchMode.id)}
                className="relative z-10 flex h-16 min-w-0 flex-col items-center justify-center rounded px-1 py-2.5 text-center transition-colors sm:px-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeModePill"
                    className="absolute inset-0 -z-10 rounded border border-[#f1ede9] bg-white"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`block text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${
                  isActive ? 'text-dbd-accent' : 'text-gray-500 hover:text-gray-600'
                }`}>
                  {searchMode.id === 'published' ? (
                    <>
                      <span className="block sm:inline">Published</span>{' '}
                      <span className="block sm:inline">recipes</span>
                    </>
                  ) : searchMode.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[420px] flex p-1 bg-gray-100/80 rounded relative">
        <button
          id="mode-cook"
          type="button"
          onClick={() => setSource('cook')}
          className="relative z-10 flex-1 py-3 transition-colors rounded cursor-pointer flex flex-col items-center justify-center text-center px-2"
        >
          {source === 'cook' && (
            <motion.div 
              layoutId="activeModePill" 
              className="absolute inset-0 bg-white border border-[#f1ede9] rounded -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={`text-[12px] font-bold uppercase tracking-wider ${
            source === 'cook' ? 'text-dbd-accent' : 'text-gray-500 hover:text-gray-600'
          }`}>
            {sourceHandoff ? 'Published recipes' : 'Homemade'}
          </span>
          <span className={`text-[10px] font-normal tracking-normal normal-case leading-tight block mt-1 ${
            source === 'cook' ? 'text-dbd-accent' : 'text-gray-500'
          }`}>
            {sourceHandoff ? 'open at the original source' : 'recipes to cook'}
          </span>
        </button>
        
        <button
          id="mode-ready-made"
          type="button"
          onClick={() => setSource('ready-made')}
          className="relative z-10 flex-1 py-3 transition-colors rounded cursor-pointer flex flex-col items-center justify-center text-center px-2"
        >
          {source === 'ready-made' && (
            <motion.div 
              layoutId="activeModePill" 
              className="absolute inset-0 bg-white border border-[#f1ede9] rounded -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={`text-[12px] font-bold uppercase tracking-wider ${
            source === 'ready-made' ? 'text-dbd-accent' : 'text-gray-500 hover:text-gray-600'
          }`}>
            Ready-made
          </span>
          <span className={`text-[10px] font-normal tracking-normal normal-case leading-tight block mt-1 ${
            source === 'ready-made' ? 'text-dbd-accent' : 'text-gray-500'
          }`}>
            supermarket options
          </span>
        </button>
      </div>
    </div>
  );
};
