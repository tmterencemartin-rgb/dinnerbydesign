import React, { useState } from 'react';
import { Flag, Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getApiUrl } from '../../lib/api';
import { getSearchAuthToken } from '../../lib/searchAuth';
import type { InternalDinnerChoice } from '../../lib/internalDinnerPilot';
import { RecipeActionRow } from '../RecipeActionRow';
import { useAuth } from '../../contexts/AuthContext';
import { isSameRecipe } from '../../lib/recipeUtils';
import { db } from '../../firebase';

interface AiCreatedDinnerSearchProps {
  preferences: unknown;
  disabled?: boolean;
  onGuestSearchDelivered?: () => void;
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

export const AiCreatedDinnerSearch: React.FC<AiCreatedDinnerSearchProps> = ({
  preferences,
  disabled = false,
  onGuestSearchDelivered
}) => {
  const [brief, setBrief] = useState('');
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

  const generateChoices = async () => {
    const trimmedBrief = brief.trim();
    if (!trimmedBrief || isGenerating || disabled) return;

    setIsGenerating(true);
    setError(null);
    setHasPartialChoices(false);
    try {
      const token = await getSearchAuthToken();
      const response = await fetch(getApiUrl('/api/ai-created-dinners'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ brief: trimmedBrief, preferences })
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

  return (
    <section className="rounded border border-dbd-accent/30 bg-dbd-accent/[0.035] px-4 py-4 sm:px-5" aria-labelledby="ai-created-recipe-heading">
      <h2 id="ai-created-recipe-heading" className="text-sm font-semibold text-dbd-ink">AI-created recipes</h2>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-dbd-accent">Created by DinnerByDesign AI</p>
      <p className="mt-1 text-[12px] leading-5 text-dbd-ink-3">
        Original recipes shaped around your brief and saved preferences, with UK metric quantities, timings and price estimates.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="internal-dinner-brief">Dinner brief</label>
            <input
              id="internal-dinner-brief"
              value={brief}
              onChange={event => setBrief(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') void generateChoices();
              }}
              placeholder="For example: quick chicken dinner with peppers"
              className="min-h-10 min-w-0 flex-1 rounded border border-gray-200 bg-white px-3 text-sm text-dbd-ink outline-none transition-colors placeholder:text-gray-400 focus:border-dbd-accent"
              disabled={isGenerating || disabled}
            />
            <button
              type="button"
              onClick={() => void generateChoices()}
              disabled={!brief.trim() || isGenerating || disabled}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded bg-dbd-accent px-4 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-dbd-accent-mid disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
              {isGenerating ? 'Creating' : 'Create three choices'}
            </button>
      </div>
      {error && <p className="mt-3 text-[12px] font-medium text-dbd-accent" role="alert">{error}</p>}
      {hasPartialChoices && <p className="mt-3 text-[12px] font-medium text-dbd-ink-3">We found fewer than three distinct choices that meet your current preferences. You can use these, or try a broader brief for more variety.</p>}

      {choices.length > 0 && (
        <div className="mx-4 mt-4 grid gap-3 lg:grid-cols-3" aria-live="polite">
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
              <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-dbd-ink-3">Method</p>
              <ol className="mt-1 list-decimal space-y-1 pl-4 text-[11px] leading-4 text-dbd-ink-2">
                {choice.instructions.map((step, stepIndex) => <li key={`${choice.title}-${stepIndex}`}>{step}</li>)}
              </ol>
              <p className="mt-3 text-[10px] leading-4 text-dbd-ink-3">Estimates only. Check ingredients for allergies and cook meat, poultry and fish thoroughly before serving.</p>
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
};
