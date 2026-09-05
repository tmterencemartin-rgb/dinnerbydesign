import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Recipe } from '../../types';
import { getDisplayMatchReason } from '../../lib/recipeUtils';
import { getRecipeSourcePublisher } from '../../lib/sourceLabel';

interface PublishedRecipeLinkCardProps {
  recipe: Recipe;
  query: string;
}

export const PublishedRecipeLinkCard: React.FC<PublishedRecipeLinkCardProps> = ({ recipe, query }) => {
  const sourceUrl = recipe.sourceUrl || '';
  const publisher = getRecipeSourcePublisher(sourceUrl);
  const note = getDisplayMatchReason(recipe.matchReason, recipe.title, query);

  return (
    <article className="border-y border-dbd-rule/70 bg-white px-3 py-3 sm:px-4 sm:py-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-dbd-accent">Published recipe</p>
      <h3 className="mt-1 text-[15px] font-semibold leading-5 text-dbd-ink">{recipe.title}</h3>
      <p className="mt-1 text-[11px] font-medium text-dbd-ink-3">From {publisher}</p>
      {note && <p className="mt-2 text-[12px] leading-5 text-dbd-ink-3">{note}</p>}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex min-h-9 items-center gap-2 rounded border border-dbd-accent/30 px-3 text-[10px] font-semibold uppercase tracking-wider text-dbd-accent transition-colors hover:bg-dbd-accent/5"
        aria-label={`Open ${recipe.title} at ${publisher}`}
      >
        Open recipe at {publisher}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </article>
  );
};
