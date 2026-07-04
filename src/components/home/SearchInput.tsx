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
  isReadOnly = false
}) => {
  const getSearchPlaceholder = (): string => {
    if (isListening) {
      return "Listening...";
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
    return "What sounds good for dinner?";
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isGenerating && !isReadOnly && !isListening) {
          handleGenerate();
        }
      }}
      className={`flex w-full items-stretch h-11 rounded ring-1 transition-all overflow-hidden ${
        isReadOnly ? 'bg-gray-100 ring-gray-100 opacity-75' : 'bg-gray-50 ring-gray-200 focus-within:ring-2 focus-within:ring-gray-900/10'
      }`}
    >
      <div className="flex-1 flex items-center min-w-0 px-1">
        {isGenerating ? (
          <button
            type="button"
            onClick={handleStopSearch}
            className="p-1 px-1.5 rounded text-dbd-accent hover:bg-dbd-accent/10 transition-all duration-200"
            title="Stop search"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        ) : (
          isSpeechSupported && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              disabled={isReadOnly}
              className={`p-1.5 px-2 rounded transition-all duration-200 ${
                isListening 
                  ? 'bg-dbd-accent text-white animate-pulse shadow-sm' 
                  : isReadOnly ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-white' : ''}`} />
            </button>
          )
        )}

        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isReadOnly}
          placeholder={isReadOnly ? "Upgrade to search again" : getSearchPlaceholder()}
          className={`flex-grow min-w-0 px-2 bg-transparent font-ibm-plex-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-800 outline-none placeholder:text-gray-400 h-full ${isListening ? 'placeholder:text-dbd-accent' : ''}`}
        />

        {input && !isGenerating && !isReadOnly && (
          <button
            type="button"
            onClick={() => {
              setInput('');
              onClear?.();
              inputRef.current?.focus();
            }}
            className="p-1 text-gray-300 hover:text-gray-500 transition-colors mr-0.5"
          >
            <CircleX size={12} />
          </button>
        )}
      </div>

      <button 
        type="submit"
        disabled={isListening || isReadOnly}
        className={`shrink-0 px-3 sm:px-5 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] transition-all flex items-center justify-center border-l border-gray-100 ${
          isReadOnly ? 'bg-gray-400' : 'bg-dbd-accent hover:bg-dbd-accent-mid active:scale-[0.98]'
        }`}
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          'Find options'
        )}
      </button>
    </form>
  );
};
