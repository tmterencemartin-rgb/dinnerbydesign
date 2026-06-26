import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import * as geminiService from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

// Mock the Auth Context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: any) => children,
}));

// Mock the Gemini Service
vi.mock('../services/geminiService', () => ({
  generateDinnerSuggestions: vi.fn(),
  generateMatchRationales: vi.fn().mockResolvedValue({}),
  GeminiServiceError: class extends Error {
    category: string;
    constructor(message: string, category: string) {
      super(message);
      this.category = category;
    }
  },
  INITIAL_COOK_FROM_SCRATCH_RESULTS: 3,
  INITIAL_READY_MADE_RESULTS: 3,
  MORE_CHOICES_RESULTS: 3
}));

describe('useSearch Hook Lifecycle', () => {
  const mockAddLog = vi.fn();
  const mockSetError = vi.fn();
  const mockAddToSearchHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      profile: { preferences: {} },
      addLog: mockAddLog,
      setError: mockSetError,
      isAuthReady: true,
      loading: false,
      addToSearchHistory: mockAddToSearchHistory,
    });
  });

  it('should handle successful search and clear loading state correctly', async () => {
    const mockRecipes = [{ title: 'Leek Soup', cuisine: 'British', totalTime: 30 }];
    let resolveSearch: (val: any) => void;
    const searchPromise = new Promise((resolve) => { resolveSearch = resolve; });
    (geminiService.generateDinnerSuggestions as any).mockReturnValue(searchPromise);

    const { result } = renderHook(() => useSearch());

    // Set input
    act(() => {
      result.current.setInput('leek recipes');
    });

    // Trigger generate
    let p: Promise<void>;
    act(() => {
      p = result.current.handleGenerate();
    });

    expect(result.current.isGenerating).toBe(true);
    expect(result.current.currentRecipes).toBe(null); 

    await act(async () => {
      resolveSearch!({
        recipes: mockRecipes,
        readyMeals: []
      });
      await p;
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.currentRecipes).toHaveLength(1);
    expect(result.current.currentRecipes![0].title).toBe('Leek Soup');
    expect(result.current.searchContradiction).toBe(null);
  });

  it('should handle zero results and show empty state contradiction', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({
      recipes: [],
      readyMeals: []
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleGenerate('unknown food');
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.currentRecipes).toEqual([]); 
    expect(result.current.searchContradiction).not.toBe(null);
    expect(result.current.searchContradiction?.type).toBe('no_results');
  });

  it('should handle race conditions by ignoring stale results', async () => {
    let resolveFirst: (val: any) => void;
    const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });
    
    (geminiService.generateDinnerSuggestions as any)
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        recipes: [{ title: 'Second Result', cuisine: 'International' }],
        readyMeals: []
      });

    const { result } = renderHook(() => useSearch());

    // Start first search
    let p1: Promise<void>;
    act(() => {
      p1 = result.current.handleGenerate('first');
    });

    // Start second search immediately
    let p2: Promise<void>;
    act(() => {
      p2 = result.current.handleGenerate('second');
    });

    // Resolve second one first
    await act(async () => {
      await p2!;
    });

    expect(result.current.currentRecipes![0].title).toBe('Second Result');

    // Now resolve the first one
    await act(async () => {
      resolveFirst!({
        recipes: [{ title: 'First Result', cuisine: 'International' }],
        readyMeals: []
      });
      await p1!;
    });

    // It should STILL be 'Second Result' because 'First Result' was stale
    expect(result.current.currentRecipes![0].title).toBe('Second Result');
    expect(result.current.isGenerating).toBe(false);
  });

  it('should normalize queries and skip duplicate active searches', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({ recipes: [], readyMeals: [] });
    const { result } = renderHook(() => useSearch());
    
    await act(async () => {
      await result.current.handleGenerate('Leek Recipes ');
    });
    
    expect(geminiService.generateDinnerSuggestions).toHaveBeenCalledTimes(1);
    
    // Try searching again with different casing and extra space
    await act(async () => {
      await result.current.handleGenerate(' leek recipes', {}, null, { skipHistory: true });
    });
    
    // Should NOT have called service again because of normalization
    expect(geminiService.generateDinnerSuggestions).toHaveBeenCalledTimes(1);
  });

  it('should clear empty state when a new valid search starts', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({
      recipes: [],
      readyMeals: []
    });

    const { result } = renderHook(() => useSearch());

    // First search with no results
    await act(async () => {
      await result.current.handleGenerate('nothing');
    });
    expect(result.current.currentRecipes).toEqual([]);
    expect(result.current.searchContradiction).not.toBe(null);

    // Second search starts
    let resolveSecond: (val: any) => void;
    const secondPromise = new Promise((resolve) => { resolveSecond = resolve; });
    (geminiService.generateDinnerSuggestions as any).mockReturnValueOnce(secondPromise);

    let p2: Promise<void>;
    act(() => {
      p2 = result.current.handleGenerate('something');
    });

    // State should be back to null immediately
    expect(result.current.currentRecipes).toBe(null);
    expect(result.current.searchContradiction).toBe(null);
    expect(result.current.isGenerating).toBe(true);

    await act(async () => {
      resolveSecond!({ recipes: [{ title: 'Soup', cuisine: 'British' }] });
      await p2!;
    });

    expect(result.current.currentRecipes).toHaveLength(1);
  });
});
