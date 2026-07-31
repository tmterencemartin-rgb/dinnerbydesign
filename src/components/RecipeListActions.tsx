import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface RecipeListActionsProps {
  onTryAgain?: () => void;
  onNewSearch?: () => void;
  isGenerating: boolean;
  totalCount?: number;
  isSuppressed?: boolean;
  children?: React.ReactNode;
  isLeftoverMode?: boolean;
  setIsLeftoverMode?: (val: boolean) => void;
  isLowCost?: boolean;
  setIsLowCost?: (val: boolean) => void;
  source?: 'cook' | 'ready-made';
  onNavigateToSettings?: () => void;
  usesGuestSearch?: boolean;
  guestSearchesRemaining?: number;
}

export const RecipeListActions = ({ 
  onTryAgain, 
  onNewSearch,
  isGenerating,
  totalCount = 0,
  isSuppressed,
  children,
  isLeftoverMode = false,
  setIsLeftoverMode,
  isLowCost = false,
  setIsLowCost,
  source,
  onNavigateToSettings,
  usesGuestSearch = false,
  guestSearchesRemaining
}: RecipeListActionsProps) => {
  return (
    <div className="w-full bg-transparent rounded-t-xl px-2 border-b border-dbd-rule/40 mb-1 sm:mb-2 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2 py-1 min-h-[36px] sm:py-1.5 sm:min-h-[44px] w-full">
        <div className="flex items-center gap-3">
          {onTryAgain && (
            <Tooltip text={usesGuestSearch ? "Uses one of your free searches" : "More recipes like this please..."} position="bottom">
              <button 
                type="button"
                onClick={onTryAgain}
                disabled={isGenerating}
                aria-label={usesGuestSearch ? "Show more recipe choices, uses one free search" : "Show more recipe choices"}
                className="py-1 text-[10.5px] font-bold text-dbd-accent uppercase tracking-[0.1em] hover:opacity-80 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isGenerating && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                <span className="hidden sm:inline">{usesGuestSearch ? 'More choices · uses 1 search' : 'More choices'}</span>
                <span className="sm:hidden">{usesGuestSearch ? 'More · 1 search' : 'More'}</span>
              </button>
            </Tooltip>
          )}
          
          {onTryAgain && onNewSearch && <div className="h-3 w-px bg-dbd-rule/40" />}

          {onNewSearch && (
            <Tooltip text="Clear this search and start again" position="bottom">
              <button 
                type="button"
                onClick={onNewSearch}
                disabled={isGenerating}
                aria-label="Clear this search and start again"
                className="py-1 text-[10.5px] font-bold text-dbd-ink-3 hover:text-dbd-ink-2 uppercase tracking-[0.1em] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                {isGenerating && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                <span className="hidden sm:inline">New search</span>
                <span className="sm:hidden">New</span>
              </button>
            </Tooltip>
          )}

          {guestSearchesRemaining !== undefined && (
            <span className="whitespace-nowrap text-[10.5px] font-bold tracking-[0.04em] text-dbd-ink-2 sm:text-[11px]">
              {guestSearchesRemaining} free {guestSearchesRemaining === 1 ? 'search' : 'searches'} left
            </span>
          )}
        </div>

        {children && (
          <div className="flex-1 min-w-0 flex items-center px-1 sm:px-4 overflow-hidden">
            {children}
          </div>
        )}

        <div className="shrink-0 ml-auto flex items-center gap-1.5 sm:gap-2 overflow-visible flex-nowrap justify-end max-w-full">
        </div>
      </div>
    </div>
  );
};
