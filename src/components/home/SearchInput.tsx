import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { CircleX } from '../ui/CircleX';
import { DinnerSource } from '../../types';

interface SearchInputProps {
  input: string;
  setInput: (val: string) => void;
  isGenerating: boolean;
  handleGenerate: (queryOverride?: string, paramOverrides?: any, preferencesOverride?: any) => Promise<void> | void;
  handleStopSearch: () => void;
  isSpeechSupported: boolean;
  isListening: boolean;
  toggleVoiceSearch: () => void;
  source: DinnerSource;
  inputRef: React.RefObject<HTMLInputElement>;
  onClear?: () => void;
  isLeftoverMode?: boolean;
  isLowCost?: boolean;
  isReadOnly?: boolean;
  readOnlyPlaceholder?: string;
  placeholderOverride?: string;
  mobileSecondaryAction?: React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  input,
  setInput,
  isGenerating,
  handleGenerate,
  handleStopSearch,
  isSpeechSupported,
  isListening,
  toggleVoiceSearch,
  source,
  inputRef,
  onClear,
  isLeftoverMode = false,
  isLowCost = false,
  isReadOnly = false,
  readOnlyPlaceholder,
  placeholderOverride,
  mobileSecondaryAction
}) => {
  const getSearchPlaceholder = (): string => {
    if (isListening) {
      return "Listening...";
    }
    if (placeholderOverride) {
      return placeholderOverride;
    }
    if (isLowCost && isLeftoverMode) {
      return "Search low-cost recipes matching your ingredients";
    }
    if (isLowCost) {
      return "Budget-friendly dinner ideas";
    }
    if (isLeftoverMode) {
      return "What's in the fridge? Some leftover chicken or corned beef? A couple of red peppers?  Maybe some sticks of celery?";
    }
    return "Search here by ingredient, dish, cuisine or chef";
  };
  const showStyledDefaultPlaceholder = !input
    && !isReadOnly
    && !isListening
    && !placeholderOverride
    && !isLowCost
    && !isLeftoverMode;
  const inputPlaceholder = isReadOnly
    ? (readOnlyPlaceholder || "Upgrade to search again")
    : (showStyledDefaultPlaceholder ? undefined : getSearchPlaceholder());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isGenerating && !isReadOnly && !isListening) {
          handleGenerate();
        }
      }}
      className={`grid grid-cols-2 gap-2 w-full items-stretch transition-all sm:flex sm:h-11 sm:gap-0 sm:overflow-hidden sm:rounded ${
        isReadOnly ? 'opacity-75 sm:bg-gray-100' : 'sm:bg-gray-50'
      }`}
    >
      <div className={`col-span-2 flex h-11 min-w-0 items-center rounded border px-1 transition-all sm:h-auto sm:flex-1 sm:rounded-none ${
        isReadOnly ? 'border-gray-200 bg-gray-100' : 'border-gray-200/80 bg-gray-100/60'
      }`}>
        {isGenerating ? (
          <button
            type="button"
            onClick={handleStopSearch}
            className="p-1 px-1.5 rounded text-dbd-accent hover:bg-dbd-accent/10 transition-all duration-200"
            title="Stop search"
            aria-label="Stop search"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        ) : (
          isSpeechSupported && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              disabled={isReadOnly}
              aria-label={isListening ? 'Stop voice search' : 'Search by voice'}
              title={isListening ? 'Stop voice search' : 'Search by voice'}
              className={`p-1.5 px-2 rounded transition-all duration-200 ${
                isListening 
                  ? 'bg-dbd-accent text-white animate-pulse shadow-sm' 
                  : isReadOnly ? 'text-gray-300' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-white' : ''}`} />
            </button>
          )
        )}

        <div className="relative min-w-0 flex-grow h-full">
          {showStyledDefaultPlaceholder && (
            <span
              aria-hidden="true"
              className="search-prompt-fade-in pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center truncate font-ibm-plex-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500"
            >
              <span className="text-dbd-accent">Search here</span><span className="ml-[0.35em]">by ingredient, dish, cuisine or chef</span>
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isReadOnly}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Search recipes by ingredient, dish, cuisine or chef"
            placeholder={inputPlaceholder}
            className={`search-query-input h-full w-full min-w-0 bg-transparent px-2 font-ibm-plex-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-800 outline-none placeholder:text-gray-500 ${isListening ? 'placeholder:text-dbd-accent' : ''}`}
          />
        </div>

        {input && !isGenerating && !isReadOnly && (
          <button
            type="button"
            onClick={() => {
              setInput('');
              onClear?.();
              inputRef.current?.focus();
            }}
            className="p-1 text-gray-300 hover:text-gray-500 transition-colors mr-0.5"
            aria-label="Clear search"
          >
            <CircleX size={12} />
          </button>
        )}
      </div>

      <button 
        type="submit"
        disabled={isListening || isReadOnly || isGenerating}
        aria-label={isGenerating ? 'Searching for dinner options' : 'Find dinner options'}
        aria-busy={isGenerating}
        className={`h-11 rounded px-3 text-white text-[12px] font-semibold uppercase tracking-[0.1em] transition-all flex items-center justify-center sm:h-auto sm:rounded-none sm:px-5 sm:text-[13px] sm:border-l sm:border-gray-100 ${
          isReadOnly ? 'bg-gray-500' : 'bg-dbd-accent hover:bg-dbd-accent-mid active:scale-[0.98]'
        }`}
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          'Find options'
        )}
      </button>

      {mobileSecondaryAction && (
        <div className="h-11 sm:hidden">
          {mobileSecondaryAction}
        </div>
      )}
    </form>
  );
};
