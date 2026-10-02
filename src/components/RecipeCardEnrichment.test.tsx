import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, cleanup, render } from '@testing-library/react';

const enrich = vi.fn();
vi.mock('../services/geminiService', () => ({ enrichRecipe: (...args: any[]) => enrich(...args) }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ updatePlanner: vi.fn(), planner: [], removeRecipe: vi.fn(), savedRecipes: [], showToast: vi.fn(), unscheduleRecipe: vi.fn(), addLog: vi.fn(), unitSystem: 'metric', setUnitSystem: vi.fn(), user: null, profile: null }) }));
import { RecipeCard } from './RecipeCard';

const recipe: any = { title: 'Retry test stew', cuisine: 'British', totalTime: 30, totalServings: 2, description: 'A stew.', ingredients: ['1 onion'], totalIngredientsCount: 1, sourceUrl: 'https://www.kitchensanctuary.com/retry-test', realityChecks: [] };
const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 300)); });

describe('RecipeCard enrichment requests', () => {
  beforeEach(() => { enrich.mockReset(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  it('requests details once when the request fails', async () => { enrich.mockRejectedValue(new Error('503')); render(<RecipeCard recipe={recipe} isSaved={false} initiallyExpanded />); await settle(); expect(enrich).toHaveBeenCalledTimes(1); });
  it('requests details once when the result has no method', async () => { enrich.mockResolvedValue({ instructions: [], ingredients: ['1 onion'], description: 'd', totalIngredientsCount: 1 }); render(<RecipeCard recipe={recipe} isSaved={false} initiallyExpanded />); await settle(); expect(enrich).toHaveBeenCalledTimes(1); });
  it('requests details once when the result is complete', async () => { enrich.mockResolvedValue({ instructions: ['Cook it.'], ingredients: ['1 onion'], description: 'd', totalIngredientsCount: 1 }); render(<RecipeCard recipe={recipe} isSaved={false} initiallyExpanded />); await settle(); expect(enrich).toHaveBeenCalledTimes(1); });
});
