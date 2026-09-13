import React, { useState } from 'react';
import { ChevronDown, Flag, Loader2, Mic, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getApiUrl } from '../../lib/api';
import { getSearchSecurityHeaders } from '../../lib/searchAuth';
import type { InternalDinnerChoice } from '../../lib/internalDinnerPilot';
import { RecipeActionRow } from '../RecipeActionRow';
import { CircleX } from '../ui/CircleX';
import { useAuth } from '../../contexts/AuthContext';
import { isSameRecipe } from '../../lib/recipeUtils';
import { db } from '../../firebase';

interface AiCreatedDinnerSearchProps {
  input: string;
  setInput: (value: string) => void;
  preferences: unknown;
  disabled?: boolean;
  isSpeechSupported: boolean;
  isListening: boolean;
  toggleVoiceSearch: () => void;
  strictIngredientMatch: boolean;
  onGuestSearchDelivered?: () => void;
}

export interface AiCreatedDinnerSearchHandle {
  submitSuggestedSearch: (brief: string) => void;
}

const choiceMeta = (choice: InternalDinnerChoice) => [
  `${choice.totalTime} mins`,
  choice.costPerPortion ? `Estimated ${choice.costPerPortion}` : null
].filter(Boolean).join(' · ');

type FeedbackKind = 'rating' | 'problem';
type ProblemType = 'quantity_or_timing' | 'dietary_or_allergy' | 'cooking_instruction' | 'price_estimate' | 'other';

const problemLabels: Record<ProblemType, string> = {
  quantity_or_timing: 'Quantity or timing',
  dietary_or_allergy: 'Dietary or allergy concern',
  cooking_instruction: 'Cooking instruction',
  price_estimate: 'Price estimate',
  other: 'Other'
};

export const AiCreatedDinnerSearch = React.forwardRef<AiCreatedDinnerSearchHandle, AiCreatedDinnerSearchProps>(({
  input,
  setInput,
  preferences,
  disabled = false,
  isSpeechSupported,
  isListening,
  toggleVoiceSearch,
  strictIngredientMatch,
  onGuestSearchDelivered
}, ref) => {
  const [choices, setChoices] = useState<InternalDinnerChoice[]>([]);
  const [hasPartialChoices, setHasPartialChoices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [problemChoiceKey, setProblemChoiceKey] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});
  const [submittingFeedbackKey, setSubmittingFeedbackKey] = useState<string | null>(null);
  const { accessStatus, planner, removeRecipe, saveRecipe, savedRecipes, showToast, updatePlanner, user } = useAuth();

  const saveChoice = async (choice: InternalDinnerChoice) => {
    const savedId = await saveRecipe(choice);
    if (!savedId) throw new Error('Save did not return a recipe id.');
    showToast('Recipe saved.');
  };

  const removeChoice = async (choice: InternalDinnerChoice) => {
    const saved = savedRecipes.find(recipe => isSameRecipe(recipe, choice));
    if (!saved?.id) return;
    await removeRecipe(saved.id);
    showToast('Recipe removed from saved.');
  };

  const scheduleChoice = async (day: string, choice: InternalDinnerChoice) => {
    const result = await updatePlanner(day, choice);
    if (!result) throw new Error('Schedule did not return a recipe id.');
    showToast(`Scheduled for ${day}. Shopping list updated.`);
  };

  const submitFeedback = async (
    choice: InternalDinnerChoice,
    choiceKey: string,
    feedbackKind: FeedbackKind,
    rating: -1 | 0 | 1,
    problemType: ProblemType | 'none'
  ) => {
    if (!user) {
      showToast('Sign in to rate or flag a recipe.');
      return;
    }

    setSubmittingFeedbackKey(choiceKey);
    try {
      await addDoc(collection(db, 'feedback'), {
        type: 'ai_created_recipe',
        feedbackKind,
        rating,
        problemType,
        recipeTitle: choice.title,
        recipeSnapshot: {
          ingredients: choice.ingredients,
          instructions: choice.instructions,
          totalServings: choice.totalServings,
          totalTime: choice.totalTime,
          costPerPortion: choice.costPerPortion || null
        },
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setFeedbackState(previous => ({
        ...previous,
        [choiceKey]: feedbackKind === 'rating'
          ? (rating > 0 ? 'Rated useful' : 'Rated needs work')
          : 'Problem flagged'
      }));
      setProblemChoiceKey(null);
      showToast(feedbackKind === 'rating' ? 'Thanks for the rating.' : 'Thanks, the problem has been flagged.');
    } catch {
      showToast('We could not save that feedback. Please try again.');
    } finally {
      setSubmittingFeedbackKey(null);
    }
  };

  const generateChoices = async (briefOverride?: string) => {
    const trimmedBrief = (briefOverride ?? input).trim();
    if (!trimmedBrief || isGenerating || disabled) return;

    setIsGenerating(true);
    setError(null);
    setHasPartialChoices(false);
    try {
      const searchSecurityHeaders = await getSearchSecurityHeaders();
      const response = await fetch(getApiUrl('/api/ai-created-dinners'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...searchSecurityHeaders
        },
        body: JSON.stringify({ brief: trimmedBrief, preferences, strictIngredientMatch })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'AI-created dinners could not be completed.');
      const deliveredChoices = Array.isArray(payload?.choices) ? payload.choices : [];
      setChoices(deliveredChoices);
      setHasPartialChoices(payload?.partial === true || (deliveredChoices.length > 0 && deliveredChoices.length < 3));
      onGuestSearchDelivered?.();
    } catch (requestError: any) {
      setError(requestError?.message || 'AI-created dinners could not be completed.');
      setChoices([]);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    submitSuggestedSearch: (brief: string) => {
      setInput(brief);
      void generateChoices(brief);
    }
  }));

  const startNewSearch = () => {
    setInput('');
    setChoices([]);
    setHasPartialChoices(false);
    setError(null);
    setProblemChoiceKey(null);
    setFeedbackState({});
  };
  const showStyledDefaultPlaceholder = !input && !disabled && !isListening;

  return (
    <section
      className={choices.length > 0 ? 'rounded border border-dbd-accent/30 bg-dbd-accent/[0.035] px-4 py-4 sm:px-5' : 'w-full'}
      aria-label="AI-created recipe search"
    >
      {choices.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <h2 id="ai-created-recipe-heading" className="text-sm font-semibold text-dbd-ink">AI-created recipes</h2>
          <button
            type="button"
            onClick={startNewSearch}
            className="inline-flex shrink-0 items-center gap-1 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-dbd-ink-2 transition-colors hover:border-dbd-accent hover:text-dbd-accent"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Start a new search
          </button>
        </div>
      )}
      {choices.length === 0 && (
        <>
          <div className="flex w-full flex-nowrap items-center gap-2">
            <form
          onSubmit={event => {
            event.preventDefault();
            void generateChoices();
          }}
          className={`grid min-w-0 flex-1 grid-cols-2 gap-2 items-stretch transition-all sm:flex sm:h-11 sm:gap-0 sm:overflow-hidden sm:rounded ${
            disabled ? 'opacity-75 sm:bg-gray-100' : 'sm:bg-gray-50'
          }`}
        >
        <label className="sr-only" htmlFor="internal-dinner-brief">Search recipes by ingredient, dish, cuisine or chef</label>
        <div className={`col-span-2 flex h-11 min-w-0 items-center rounded border px-1 transition-all sm:h-auto sm:flex-1 sm:rounded-none ${
          disabled ? 'border-gray-200 bg-gray-100' : 'border-gray-200/80 bg-gray-100/60'
        }`}>
          {isGenerating ? (
            <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin text-dbd-accent" aria-label="Searching" />
          ) : (
            isSpeechSupported && (
              <button
                type="button"
                onClick={toggleVoiceSearch}
                disabled={disabled}
                aria-label={isListening ? 'Stop voice search' : 'Search by voice'}
                title={isListening ? 'Stop voice search' : 'Search by voice'}
                className={`rounded p-1.5 px-2 transition-all duration-200 ${
                  isListening
                    ? 'bg-dbd-accent text-white animate-pulse shadow-sm'
                    : disabled ? 'text-gray-300' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Mic className={`h-3.5 w-3.5 ${isListening ? 'text-white' : ''}`} aria-hidden="true" />
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
              id="internal-dinner-brief"
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Search recipes by ingredient, dish, cuisine or chef"
              placeholder={showStyledDefaultPlaceholder ? undefined : (isListening ? 'Listening...' : 'Search here by ingredient, dish, cuisine or chef')}
              className={`search-query-input h-full w-full min-w-0 bg-transparent px-2 font-ibm-plex-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-800 outline-none placeholder:text-gray-500 ${isListening ? 'placeholder:text-dbd-accent' : ''}`}
              disabled={isGenerating || disabled}
            />
          </div>
          {input && !isGenerating && !disabled && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="mr-0.5 p-1 text-gray-300 transition-colors hover:text-gray-500"
              aria-label="Clear search"
            >
              <CircleX size={12} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isGenerating || disabled || isListening}
          aria-label={isGenerating ? 'Searching for dinner options' : 'Find dinner options'}
          aria-busy={isGenerating}
          className={`h-11 rounded px-3 text-white text-[10px] font-semibold uppercase tracking-[0.1em] transition-all flex items-center justify-center sm:h-auto sm:rounded-none sm:px-5 sm:text-[11px] sm:border-l sm:border-gray-100 ${
            disabled ? 'bg-gray-500' : 'bg-dbd-accent hover:bg-dbd-accent-mid active:scale-[0.98]'
          }`}
        >
          {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Find options'}
        </button>
            </form>
          </div>
        </>
      )}
      {error && <p className="mt-3 text-[12px] font-medium text-dbd-accent" role="alert">{error}</p>}
      {hasPartialChoices && <p className="mt-3 text-[12px] font-medium text-dbd-ink-3">We found fewer than three distinct choices that meet your current preferences. You can use these, or try a broader brief for more variety.</p>}

      {choices.length > 0 && (
        <div className="mt-4 grid gap-3 lg:grid-cols-3" aria-live="polite">
          {choices.map((choice, index) => (
            <article key={`${choice.title}-${index}`} className="rounded border border-gray-200 bg-white p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-dbd-accent">Choice {index + 1}</p>
              <h3 className="mt-1 text-sm font-semibold leading-5 text-dbd-ink">{choice.title}</h3>
              <p className="mt-1 text-[12px] leading-5 text-dbd-ink-3">{choice.description}</p>
              <p className="mt-2 text-[11px] font-medium text-dbd-ink-2">{choiceMeta(choice)}</p>
              {choice.matchReason && <p className="mt-2 text-[11px] leading-4 text-dbd-ink-3">{choice.matchReason}</p>}
              <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-dbd-ink-3">Ingredients</p>
              <ul className="mt-1 space-y-1 text-[11px] leading-4 text-dbd-ink-2">
                {choice.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}
              </ul>
              <p className="mt-3 text-[10px] leading-4 text-dbd-ink-3">Estimates only. Check ingredients for allergies and cook meat, poultry and fish thoroughly before serving.</p>
              <details className="group mt-3 rounded border border-gray-100 bg-gray-50/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-dbd-ink-3 outline-none transition-colors hover:text-dbd-accent focus-visible:ring-2 focus-visible:ring-dbd-accent">
                  <span>View method</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ol className="border-t border-gray-100 px-2.5 py-2 pl-7 text-[11px] leading-4 text-dbd-ink-2">
                  {choice.instructions.map((step, stepIndex) => <li key={`${choice.title}-${stepIndex}`} className="mb-1 last:mb-0">{step}</li>)}
                </ol>
              </details>
              <div className="mt-3">
                <RecipeActionRow
                  recipe={choice}
                  isSaved={savedRecipes.some(recipe => isSameRecipe(recipe, choice))}
                  scheduledDate={planner.find(recipe => isSameRecipe(recipe, choice))?.scheduledDate}
                  onSave={() => saveChoice(choice)}
                  onRemove={() => void removeChoice(choice)}
                  onDaySelect={(day) => scheduleChoice(day, choice)}
                  planner={planner}
                  allowScheduling
                  saveDisabled={accessStatus === 'read_only'}
                />
              </div>
              {(() => {
                const choiceKey = `${choice.title}-${index}`;
                const isSubmitting = submittingFeedbackKey === choiceKey;
                return (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-medium text-dbd-ink-3">Was this useful?</span>
                      <button
                        type="button"
                        onClick={() => void submitFeedback(choice, choiceKey, 'rating', 1, 'none')}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-dbd-ink-2 hover:border-dbd-accent hover:text-dbd-accent disabled:opacity-50"
                        aria-label={`Rate ${choice.title} as useful`}
                      >
                        <ThumbsUp className="h-3 w-3" aria-hidden="true" /> Useful
                      </button>
                      <button
                        type="button"
                        onClick={() => void submitFeedback(choice, choiceKey, 'rating', -1, 'none')}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-dbd-ink-2 hover:border-dbd-accent hover:text-dbd-accent disabled:opacity-50"
                        aria-label={`Rate ${choice.title} as needing work`}
                      >
                        <ThumbsDown className="h-3 w-3" aria-hidden="true" /> Needs work
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemChoiceKey(current => current === choiceKey ? null : choiceKey)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-dbd-ink-3 hover:text-dbd-accent disabled:opacity-50"
                        aria-expanded={problemChoiceKey === choiceKey}
                      >
                        <Flag className="h-3 w-3" aria-hidden="true" /> Flag a problem
                      </button>
                    </div>
                    {problemChoiceKey === choiceKey && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(Object.keys(problemLabels) as ProblemType[]).map(problemType => (
                          <button
                            key={problemType}
                            type="button"
                            onClick={() => void submitFeedback(choice, choiceKey, 'problem', 0, problemType)}
                            disabled={isSubmitting}
                            className="rounded bg-gray-50 px-2 py-1 text-[10px] font-medium text-dbd-ink-2 hover:bg-dbd-accent/10 hover:text-dbd-accent disabled:opacity-50"
                          >
                            {problemLabels[problemType]}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-[10px] leading-4 text-dbd-ink-3">{feedbackState[choiceKey] || 'Feedback is reviewed to improve future AI-created recipes.'}</p>
                  </div>
                );
              })()}
            </article>
          ))}
        </div>
      )}
    </section>
  );
});
