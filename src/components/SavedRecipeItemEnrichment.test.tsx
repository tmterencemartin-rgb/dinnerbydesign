import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

const enrich = vi.fn();
const updateRecipe = vi.fn(async () => {});
vi.mock('../services/geminiService', () => ({ enrichRecipe: (...args: any[]) => enrich(...args) }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    updatePlanner: vi.fn(), planner: [], addLog: vi.fn(), handlePrintRecipe: vi.fn(), updateRecipe, profile: null,
    showToast: vi.fn(), unscheduleRecipe: vi.fn(), accessStatus: 'active'
  })
}));
import { SavedRecipeItem } from './SavedRecipeItem';

const saved: any = {
  id: 'r1', title: 'Retry test saved stew', cuisine: 'British', mode: 'cook', description: 'A stew.', ingredients: ['1 onion'],
  totalIngredientsCount: 3, instructions: [], sourceUrl: 'https://www.kitchensanctuary.com/retry-test-saved',
  realityChecks: [], totalTime: 30, totalServings: 2
};
const open = async () => {
  render(<SavedRecipeItem recipe={saved} onRemove={() => {}} />);
  fireEvent.click(screen.getAllByText('Retry test saved stew')[0]);
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 300)); });
};

describe('SavedRecipeItem enrichment requests', () => {
  beforeEach(() => { enrich.mockReset(); updateRecipe.mockClear(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('requests details once when the request fails', async () => {
    enrich.mockRejectedValue(new Error('503'));
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
  });

  it('requests details once and does not overwrite the saved recipe when the result has no method', async () => {
    enrich.mockResolvedValue({ instructions: [], ingredients: ['1 onion'], description: 'd', totalIngredientsCount: 1 });
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
    expect(updateRecipe).not.toHaveBeenCalled();
  });

  it('requests details once and saves the result when it is complete', async () => {
    enrich.mockResolvedValue({ instructions: ['Cook it.'], ingredients: ['1 onion', '1 carrot', '1 leek'], description: 'd', totalIngredientsCount: 3 });
    await open();
    expect(enrich).toHaveBeenCalledTimes(1);
    expect(updateRecipe).toHaveBeenCalledTimes(1);
  });
});
