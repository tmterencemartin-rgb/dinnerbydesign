import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Filter, Clock } from 'lucide-react';

interface SearchStatusRowProps {
  status: 'idle' | 'searching' | 'partial' | 'complete' | 'noResults' | 'error';
  enriching: boolean;
  filterCount: number;
  source: 'cook' | 'ready-made';
  startTime: number | null;
  activeCriteria: any[];
  query?: string;
}

export const SearchStatusRow: React.FC<SearchStatusRowProps> = ({
  status,
  enriching,
  filterCount,
  source,
  startTime,
  activeCriteria,
  query
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'searching' && startTime) {
      const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsed(0);
    }
  }, [status, startTime]);

  if (status === 'idle' || (status === 'complete' && !enriching)) return null;

  const isLowPerf = elapsed > 5;
  const showEnriching = enriching && (status === 'partial' || status === 'complete');
  const showSearching = status === 'searching';

  const filterLabels = activeCriteria.slice(0, 4).map(c => c.label).join(', ');
  const hasMoreFilters = activeCriteria.length > 4;

  const displayQuery = query?.trim();
  const isBroadSearch = filterCount <= 1;

  const isReadyMade = source === 'ready-made';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="overflow-hidden"
      >
        <div className="py-3 px-4 bg-gray-50/70 rounded mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                {showSearching ? (
                  <Loader2 className="w-4 h-4 text-accent animate-spin" />
                ) : (
                  <div className="w-4 h-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <p className="text-[12px] font-bold text-gray-900 leading-tight">
                  {showSearching ? (
                    isBroadSearch && displayQuery ? (
                      `Searching for "${displayQuery}"...`
                    ) : (
                    `Searching with ${filterCount} preferences...`
                    )
                  ) : status === 'partial' ? (
                    "Showing the closest matches first"
                  ) : showEnriching ? (
                    "Adding recipe details..."
                  ) : null}
                </p>
                <p className="text-[10px] text-gray-500 font-medium whitespace-pre-wrap">
                  {showSearching ? (
                    isLowPerf 
                      ? (isBroadSearch 
                          ? (isReadyMade ? "Searching for ready-made dinner products across a range of supermarkets" : "This is a general search based on your keywords. To pinpoint precise recipes, try adding more criteria in Preferences.")
                          : "This is a very precise search – identifying the best matches can take a few seconds.")
                      : (isBroadSearch
                          ? (isReadyMade ? "Searching for ready-made dinner products across a range of supermarkets" : "Searching broadly across all matches – add preferences for more precise results.")
                          : "Applying your specific preferences to find the perfect match.")
                  ) : (status === 'partial' || showEnriching) ? (
                    "Refining descriptions and match rationales."
                  ) : null}
                </p>
              </div>
            </div>


            {showSearching && filterLabels && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/70 rounded">
                <Filter className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  Checking: <span className="text-gray-600 italic">{filterLabels}{hasMoreFilters ? '...' : ''}</span>
                </span>
              </div>
            )}
            
            {showSearching && isLowPerf && (
              <div className="flex items-center gap-1.5 text-accent animate-pulse">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{elapsed}s</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
