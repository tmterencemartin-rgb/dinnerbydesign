import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
  it('shows an outbound publisher link without recipe content', () => {
    render(<PublishedRecipeLinkCard recipe={recipe} query="chicken and lemon" />);

    expect(screen.getByText('Roast chicken with lemon')).toBeTruthy();
    expect(screen.getByText('From BBC Good Food')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open Roast chicken with lemon at BBC Good Food' }).getAttribute('href'))
      .toBe(recipe.sourceUrl);
    expect(screen.queryByText('Chicken')).toBeNull();
    expect(screen.queryByText('A source method that must not appear in the hand-off card.')).toBeNull();
  });
});
