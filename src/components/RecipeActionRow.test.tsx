import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeActionRow } from './RecipeActionRow';
import type { Recipe } from '../types';

const showToast = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    handlePrintRecipe: vi.fn(),
    showToast,
  }),
}));

const recipe: Recipe = {
  title: 'Quick chicken traybake',
  description: 'A simple chicken traybake with peppers and herbs.',
  ingredients: ['Chicken thighs', 'Red peppers', 'Olive oil'],
  instructions: ['Heat the oven.', 'Roast until cooked through.'],
  cuisine: 'British',
  totalServings: 2,
  totalTime: 35,
  saladType: 'none',
  isVegetarian: false,
  isPescatarian: false,
  isVegan: false,
  dietFlagsVerified: true,
};

describe('RecipeActionRow', () => {
  it('offers an inline day picker when direct scheduling is enabled', async () => {
    const onDaySelect = vi.fn();

    render(
      <RecipeActionRow
        recipe={recipe}
        isSaved={false}
        scheduledDate={null}
        onSave={vi.fn()}
        onRemove={vi.fn()}
        onDaySelect={onDaySelect}
        planner={[]}
        allowScheduling
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mon' }));

    await waitFor(() => expect(onDaySelect).toHaveBeenCalledWith('monday'));
  });
});
