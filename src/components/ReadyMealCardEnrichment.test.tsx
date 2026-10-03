import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, cleanup, render } from '@testing-library/react';

const enrich = vi.fn();
vi.mock('../services/geminiService', () => ({ enrichRecipe: (...args: any[]) => enrich(...args) }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    updatePlanner: vi.fn(), planner: [], removeRecipe: vi.fn(), savedRecipes: [], showToast: vi.fn(),
    unscheduleRecipe: vi.fn(), addLog: vi.fn(), unitSystem: 'metric', setUnitSystem: vi.fn(), user: null, profile: null
  })
}));
import { ReadyMealCard } from './ReadyMealCard';

const meal: any = {
  title: 'Retry test lasagne', cuisine: 'Italian', retailer: 'Tesco', description: 'A lasagne.', ingredients: ['pasta'],
  totalIngredientsCount: 1, sourceUrl: 'https://www.tesco.com/retry-test', realityChecks: [], totalTime: 30
};
const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 300)); });

describe('ReadyMealCard enrichment requests', () => {
  beforeEach(() => { enrich.mockReset(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('requests details once when the request fails', async () => {
    enrich.mockRejectedValue(new Error('503'));
    render(<ReadyMealCard meal={meal} isSaved={false} initiallyExpanded />);
    await settle();
    expect(enrich).toHaveBeenCalledTimes(1);
  });

  it('requests details once when the result has no serving suggestion', async () => {
    enrich.mockResolvedValue({ description: 'd', ingredients: ['pasta'], totalIngredientsCount: 1 });
    render(<ReadyMealCard meal={meal} isSaved={false} initiallyExpanded />);
    await settle();
    expect(enrich).toHaveBeenCalledTimes(1);
  });

  it('requests details once when the result is complete', async () => {
    enrich.mockResolvedValue({ servingSuggestion: 'Serve with salad.', description: 'd', ingredients: ['pasta'], totalIngredientsCount: 1 });
    render(<ReadyMealCard meal={meal} isSaved={false} initiallyExpanded />);
    await settle();
    expect(enrich).toHaveBeenCalledTimes(1);
  });
});
