import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

const enrich = vi.fn();
const updateRecipe = vi.fn(async () => {});
const entry: any = {
  id: 'p1', title: 'Retry test planner stew', cuisine: 'British', mode: 'cook', scheduledDate: 'monday', description: 'A stew.',
  ingredients: ['1 onion'], totalIngredientsCount: 1, instructions: [], sourceUrl: 'https://www.kitchensanctuary.com/retry-test-planner',
  realityChecks: [], totalTime: 30, totalServings: 2
};
vi.mock('../../services/geminiService', () => ({ enrichRecipe: (...args: any[]) => enrich(...args) }));
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    profile: { preferences: {} }, planner: [entry], savedRecipes: [], updatePlanner: vi.fn(), saveRecipe: vi.fn(),
    unscheduleRecipe: vi.fn(), removeRecipe: vi.fn(), clearPlannerWeek: vi.fn(), addLog: vi.fn(), handlePrintRecipe: vi.fn(),
    showToast: vi.fn(), updateRecipe, user: null, accessStatus: 'active', shoppingList: [], unitSystem: 'metric', setUnitSystem: vi.fn()
  })
}));
import { PlannerView } from './PlannerView';

const open = async () => {
  render(<PlannerView setView={() => {}} />);
  fireEvent.click((await screen.findAllByText('Retry test planner stew'))[0]);
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 300)); });
};

describe('PlannerView enrichment requests', () => {
  beforeEach(() => { enrich.mockReset(); updateRecipe.mockClear(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('requests details once when the request fails', async () => {
    enrich.mockRejectedValue(new Error('503'));
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
  });

  it('requests details once and does not overwrite the entry when the result has no method', async () => {
    enrich.mockResolvedValue({ instructions: [], ingredients: ['1 onion'], description: 'd', totalIngredientsCount: 1 });
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
    expect(updateRecipe).not.toHaveBeenCalled();
  });

  it('requests details once for a short recipe that has a method but fewer than three ingredients', async () => {
    enrich.mockResolvedValue({ instructions: ['Toast the bread.', 'Add the cheese.'], ingredients: ['bread', 'cheese'], description: 'd', totalIngredientsCount: 2 });
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
    expect(updateRecipe).toHaveBeenCalledTimes(1);
  });
});
