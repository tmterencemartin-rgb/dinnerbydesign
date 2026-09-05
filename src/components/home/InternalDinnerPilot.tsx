import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { getApiUrl } from '../../lib/api';
import { getSearchAuthToken } from '../../lib/searchAuth';
import type { InternalDinnerChoice } from '../../lib/internalDinnerPilot';

interface AiCreatedDinnerSearchProps {
  preferences: unknown;
  disabled?: boolean;
  onGuestSearchDelivered?: () => void;
}

const choiceMeta = (choice: InternalDinnerChoice) => [
  `${choice.totalTime} mins`,
  choice.costPerPortion,
  choice.caloriesPerPortion ? `${choice.caloriesPerPortion} kcal pp` : null
].filter(Boolean).join(' · ');

export const AiCreatedDinnerSearch: React.FC<AiCreatedDinnerSearchProps> = ({
  preferences,
  disabled = false,
  onGuestSearchDelivered
}) => {
  const [brief, setBrief] = useState('');
  const [choices, setChoices] = useState<InternalDinnerChoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChoices = async () => {
    const trimmedBrief = brief.trim();
    if (!trimmedBrief || isGenerating || disabled) return;

    setIsGenerating(true);
    setError(null);
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
      setChoices(Array.isArray(payload?.choices) ? payload.choices : []);
      onGuestSearchDelivered?.();
    } catch (requestError: any) {
      setError(requestError?.message || 'AI-created dinners could not be completed.');
      setChoices([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="rounded border border-dbd-accent/30 bg-dbd-accent/[0.035] px-4 py-4 sm:px-5" aria-labelledby="ai-created-dinner-heading">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-dbd-accent" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="ai-created-dinner-heading" className="text-sm font-semibold text-dbd-ink">AI-created dinners</h2>
          <p className="mt-1 text-[12px] leading-5 text-dbd-ink-3">
            Create three original choices from your brief and saved preferences. They do not use published recipes or source links. Saving, scheduling, shopping, printing and email are not available for these choices yet.
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
        </div>
      </div>

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
                {choice.ingredients.slice(0, 6).map(ingredient => <li key={ingredient}>{ingredient}</li>)}
              </ul>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-dbd-ink-3">Method</p>
              <ol className="mt-1 list-decimal space-y-1 pl-4 text-[11px] leading-4 text-dbd-ink-2">
                {choice.instructions.map((step, stepIndex) => <li key={`${choice.title}-${stepIndex}`}>{step}</li>)}
              </ol>
              <p className="mt-3 text-[10px] leading-4 text-dbd-ink-3">Check quantities and allergen suitability before cooking.</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
