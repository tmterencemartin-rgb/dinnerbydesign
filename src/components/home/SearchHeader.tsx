import React from 'react';
import { motion } from 'framer-motion';
import { DinnerSource } from '../../types';

interface SearchHeaderProps {
  source: DinnerSource;
  setSource: (source: DinnerSource) => void;
  isDietaryRuleSuppressed: boolean;
  suppressedPermanentKeys: string[];
  clearSuppression: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  source,
  setSource,
  isDietaryRuleSuppressed,
  suppressedPermanentKeys,
  clearSuppression
}) => {
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
            source === 'cook' ? 'text-accent' : 'text-gray-500 hover:text-gray-600'
          }`}>
            Homemade
          </span>
          <span className={`text-[10px] font-normal tracking-normal normal-case leading-tight block mt-1 ${
            source === 'cook' ? 'text-accent/75' : 'text-gray-500'
          }`}>
            recipes to cook
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
            source === 'ready-made' ? 'text-accent' : 'text-gray-500 hover:text-gray-600'
          }`}>
            Ready-made
          </span>
          <span className={`text-[10px] font-normal tracking-normal normal-case leading-tight block mt-1 ${
            source === 'ready-made' ? 'text-accent/75' : 'text-gray-500'
          }`}>
            supermarket options
          </span>
        </button>
      </div>
    </div>
  );
};
