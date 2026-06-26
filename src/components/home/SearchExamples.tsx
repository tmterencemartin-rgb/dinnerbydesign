import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface SearchExamplesProps {
  onSelect: (query: string) => void;
  isLoading?: boolean;
  mode?: 'cook' | 'ready-made';
}

const COOK_EXAMPLES = [
  "Leftover chicken",
  "Mediterranean",
  "Fish fingers",
  "Ottolenghi",
  "Nutritious",
  "£2 per portion",
  "Tinned tomatoes",
  "Dover Sole"
];

const READY_MADE_EXAMPLES = [
  "Chinese",
  "Tesco",
  "Vegetarian",
  "Beef",
  "Pasta",
  "Air Fryer"
];

export const SearchExamples: React.FC<SearchExamplesProps> = ({ onSelect, isLoading, mode = 'cook' }) => {
  const { profile, user } = useAuth();
  
  if (user && user.isAnonymous === false) return null;
  
  const history = mode === 'ready-made' 
    ? (profile?.searchHistoryReadyMade || []) 
    : (profile?.searchHistoryCook || profile?.searchHistory || []);
    
  const isGuest = !user || user.isAnonymous;

  const staticExamples = mode === 'ready-made' ? READY_MADE_EXAMPLES : COOK_EXAMPLES;

  // Filter out forbidden terms
  const isForbidden = (term: string) => {
    const t = term.toLowerCase();
    const partials = ['chicke', 'chic', 'chi', 'chicken thighs, leeks', 'liver', 'waitrose', 'chicken'];
    if (partials.includes(t)) return true;
    if (mode === 'ready-made' && (t === 'jamie oliver' || t === 'bbq' || t === 'tin of chickpeas' || t === 'traybake' || t === 'tinned chickpeas')) return true;
    return false;
  };

  // Filter out forbidden terms and keep only the longest version of overlapping terms
  const processedHistory = history
    .map(h => {
      const lower = h.toLowerCase();
      if (lower === 'waitrose') return 'Jamie Oliver';
      if (lower === 'tin of chickpeas' || lower === 'tinned chickpeas') return 'Tinned Chickpeas';
      if (lower === 'left over chicken' || lower === 'leftover chicken') return 'Leftover chicken';
      return h;
    })
    .filter(h => !isForbidden(h))
    .filter((h, idx, arr) => {
      // Don't show "chi" if "chicken" is also in the history
      const hLower = h.toLowerCase();
      return !arr.some((other, oIdx) => 
        oIdx !== idx && 
        other.toLowerCase().startsWith(hLower) && 
        other.length > h.length
      );
    });

  const historyToDisplay = processedHistory.slice(0, 3);
  
  // Static examples that aren't already in the history we are showing
  const staticToDisplay = staticExamples
    .filter(s => !historyToDisplay.some(h => h.toLowerCase() === s.toLowerCase()))
    .filter(s => !isForbidden(s));

  const combined = [...historyToDisplay, ...staticToDisplay];
  
  // Final deduplication (case-insensitive)
  const seen = new Set<string>();
  const displayChips = combined.filter(chip => {
    const lower = chip.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  }).slice(0, 8);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-0.5 px-1">
      <div className="flex gap-2 items-center">
        {displayChips.map((chip, index) => (
          <motion.button
            key={`${chip}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              if (!isLoading) {
                console.info('chip_tap', { chip_label: chip });
                onSelect(chip);
              }
            }}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border shadow-sm ${
              isLoading 
                ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95'
            }`}
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
