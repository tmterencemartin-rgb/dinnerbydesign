import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Recipe } from '../../types';
import { PublishedRecipeLinkCard } from './PublishedRecipeLinkCard';

const recipe: Recipe = {
  title: 'Roast chicken with lemon',
  description: 'A published recipe description that must not appear in the hand-off card.',
  ingredients: ['Chicken', 'Lemon', 'Thyme'],
  instructions: ['A source method that must not appear in the hand-off card.'],
  cuisine: 'British',
  matchReason: 'Matches the search by using chicken and lemon.',
  totalServings: 2,
  totalTime: 45,
  saladType: 'none',
  sourceUrl: 'https://www.bbcgoodfood.com/recipes/roast-chicken-lemon',
  isVegetarian: false,
  isPescatarian: false,
  isVegan: false,
  dietFlagsVerified: true
};

describe('PublishedRecipeLinkCard', () => {
  it('shows a compact outbound publisher link without recipe content or duplicated source text', () => {
    render(<PublishedRecipeLinkCard recipe={recipe} query="chicken and lemon" />);

    expect(screen.getByText('Roast chicken with lemon')).toBeTruthy();
    expect(screen.queryByText('From BBC Good Food')).toBeNull();
    expect(screen.queryByText('Published recipe')).toBeNull();
    expect(screen.getByRole('link', { name: 'Open Roast chicken with lemon at BBC Good Food' }).getAttribute('href'))
      .toBe(recipe.sourceUrl);
    expect(screen.queryByText('Chicken')).toBeNull();
    expect(screen.queryByText('A source method that must not appear in the hand-off card.')).toBeNull();
  });

  it('lets a user save a published recipe without opening the publisher page', () => {
    const onToggleSaved = vi.fn();
    render(<PublishedRecipeLinkCard recipe={recipe} query="chicken and lemon" onToggleSaved={onToggleSaved} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(saveButton);
    expect(onToggleSaved).toHaveBeenCalledTimes(1);
  });
});
