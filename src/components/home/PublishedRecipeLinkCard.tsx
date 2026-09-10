import React from 'react';
import { Bookmark, Check, ExternalLink } from 'lucide-react';
import type { Recipe } from '../../types';
import { getDisplayMatchReason } from '../../lib/recipeUtils';
import { getRecipeSourcePublisher } from '../../lib/sourceLabel';

interface PublishedRecipeLinkCardProps {
  recipe: Recipe;
  query: string;
  isSaved?: boolean;
  onToggleSaved?: () => void | Promise<void>;
}

export const PublishedRecipeLinkCard: React.FC<PublishedRecipeLinkCardProps> = ({
  recipe,
  query,
  isSaved = false,
  onToggleSaved,
}) => {
  const sourceUrl = recipe.sourceUrl || '';
  const publisher = getRecipeSourcePublisher(sourceUrl);
  const note = getDisplayMatchReason(recipe.matchReason, recipe.title, query);

  return (
    <article className="border-y border-dbd-rule/70 bg-white px-1 py-2 sm:px-1 sm:py-2.5">
      <h3 className="text-[14px] font-semibold leading-[1.3] text-dbd-ink">{recipe.title}</h3>
      {note && <p className="mt-1 text-[11px] leading-4 text-dbd-ink-3">{note}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-8 items-center gap-1.5 rounded border border-dbd-accent/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-dbd-accent transition-colors hover:bg-dbd-accent/5"
          aria-label={`Open ${recipe.title} at ${publisher}`}
        >
          Open recipe at {publisher}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
        {onToggleSaved && (
          <button
            type="button"
            onClick={() => void onToggleSaved()}
            aria-pressed={isSaved}
            className="inline-flex min-h-8 items-center gap-1.5 rounded border border-gray-200 bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
          >
            {isSaved ? <Check className="h-3 w-3" aria-hidden="true" /> : <Bookmark className="h-3 w-3" aria-hidden="true" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </article>
  );
};
