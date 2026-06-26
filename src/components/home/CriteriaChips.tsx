import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { CircleX } from '../ui/CircleX';

interface CriteriaChipsProps {
  activeCriteria: any[];
  removeFilter: (type: string, value: string) => void;
  onNavigateToSettings: () => void;
}

export const CriteriaChips: React.FC<CriteriaChipsProps> = ({
  activeCriteria,
  removeFilter,
  onNavigateToSettings
}) => {
  console.log('[CriteriaChips] Render:', { 
    count: activeCriteria.length, 
    labels: activeCriteria.map(c => c.label),
    data: activeCriteria
  });
  
  React.useEffect(() => {
    console.log('[CriteriaChips] Mounted');
    return () => console.log('[CriteriaChips] Unmounted');
  }, []);

  if (activeCriteria.length === 0) return null;

  return (
    <div className="flex flex-nowrap items-center gap-x-2 overflow-x-auto no-scrollbar scrollbar-hide py-2 px-1">
      {activeCriteria.map(criterion => {
        const isExclusion = ['allergy', 'profileExclusion', 'excludeIngredient'].includes(criterion.type);
        
        // Match user requested format options like `✕ Tomato` or `- Peanut`
        const rawLabel = criterion.label;
        const cleanLabel = (isExclusion && rawLabel.startsWith('No ')) 
          ? rawLabel.slice(3) 
          : rawLabel;
        
        const displayLabel = isExclusion ? `✕ ${cleanLabel}` : rawLabel;

        return (
          <div 
            key={`${criterion.type}-${criterion.value}-${criterion.label}`} 
            className={`group flex items-center gap-2.5 pl-3 pr-1.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 border shadow-sm ${
              isExclusion
                ? 'bg-red-50/15 border-red-200/50 hover:bg-red-50/25 hover:border-red-300 text-red-800'
                : criterion.isPermanent 
                  ? 'bg-white border-accent/20 hover:border-accent/40 text-accent font-bold' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div 
              className="flex items-center gap-1.5 cursor-default"
              onClick={() => criterion.isPermanent && onNavigateToSettings()}
            >
              {!isExclusion && criterion.isPermanent && <Sparkles className="w-3 h-3 text-accent/60" />}
              <span className={`font-bold text-[11px] uppercase tracking-wider ${
                isExclusion ? 'text-red-700/95 font-ibm-plex-mono' : 'text-accent'
              }`}>
                {displayLabel}
              </span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeFilter(criterion.type, criterion.value);
              }} 
              className="transition-transform active:scale-90 cursor-pointer"
              title={isExclusion ? "Remove exclusion for this search" : criterion.isPermanent ? "Suppress for this search" : "Remove preference"}
            >
              {isExclusion ? (
                <span className="inline-flex items-center justify-center rounded-full bg-red-100/50 p-1 hover:bg-red-100">
                  <X className="w-2.5 h-2.5 text-red-700" strokeWidth={3} />
                </span>
              ) : (
                <CircleX size={10} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
