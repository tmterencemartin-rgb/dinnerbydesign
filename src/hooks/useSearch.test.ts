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
    constructor(category: string, message: string) {
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
  const mockShowToast = vi.fn();
  const mockSetView = vi.fn();
  const mockGoToSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    (useAuth as any).mockReturnValue({
      profile: { preferences: {} },
      addLog: mockAddLog,
      setError: mockSetError,
      isAuthReady: true,
      loading: false,
      addToSearchHistory: mockAddToSearchHistory,
      showToast: mockShowToast,
      setView: mockSetView,
      goToSignUp: mockGoToSignUp,
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
    expect(result.current.guestSearchCount).toBe(1);
  });

  it('does not consume a free search when the service fails', async () => {
    (geminiService.generateDinnerSuggestions as any).mockRejectedValue(
      new (geminiService.GeminiServiceError as any)('network', 'Search request timed out. Please try again.')
    );

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleGenerate('slow search');
    });

    expect(result.current.guestSearchCount).toBe(0);
    expect(window.localStorage.getItem('dbd_guest_search_count_v1')).toBe(null);
    expect(result.current.searchError).toBe('Search request timed out. Please try again.');
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

  it('counts more choices as a guest search', async () => {
    (geminiService.generateDinnerSuggestions as any)
      .mockResolvedValueOnce({
        recipes: [{ title: 'Chicken One', cuisine: 'British', totalTime: 25 }],
        readyMeals: []
      })
      .mockResolvedValueOnce({
        recipes: [{ title: 'Chicken Two', cuisine: 'British', totalTime: 20 }],
        readyMeals: []
      });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleGenerate('quick chicken dinner');
    });

    expect(result.current.guestSearchCount).toBe(1);

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(result.current.guestSearchCount).toBe(2);
    expect(window.localStorage.getItem('dbd_guest_search_count_v1')).toBe('2');
    expect(geminiService.generateDinnerSuggestions).toHaveBeenCalledTimes(2);
  });

  it('blocks more choices when a guest has used all free searches', async () => {
    window.localStorage.setItem('dbd_guest_search_count_v1', '3');
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(geminiService.generateDinnerSuggestions).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      "You've used your 3 free searches. Create an account to start your 7-day trial.",
      'Create account',
      mockGoToSignUp
    );
  });

  it('tops up broad chilli searches after client-side filtering leaves one result', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({
      recipes: [{
        title: 'Turkey and Sweetcorn Chilli',
        description: 'A quick turkey chilli with sweetcorn.',
        cuisine: 'Tex-Mex',
        ingredients: ['Turkey mince', 'Sweetcorn', 'Chopped tomatoes'],
        instructions: [],
        totalServings: 2,
        totalTime: 15,
        saladType: 'none',
        sourceUrl: 'recipe-search',
        isVegetarian: false,
        isPescatarian: false,
        isVegan: false,
        dietFlagsVerified: true
      }],
      readyMeals: []
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleGenerate('chilli');
    });

    expect(result.current.currentRecipes).toHaveLength(3);
    expect(result.current.currentRecipes?.map(r => r.title)).toEqual([
      'Turkey and Sweetcorn Chilli',
      'Quick beef chilli con carne',
      'No-bean beef chilli'
    ]);
  });

  it('filters strict ingredient searches before showing recipe cards', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({
      recipes: [
        {
          title: 'Ham, egg and potato hash',
          ingredients: ['ham', 'eggs', 'potatoes', 'oil'],
          totalIngredientsCount: 4,
          totalTime: 25,
          cuisine: 'British'
        },
        {
          title: 'Ham, egg and potato bake',
          ingredients: ['ham', 'eggs', 'potatoes', 'onion'],
          totalIngredientsCount: 4,
          totalTime: 35,
          cuisine: 'British'
        }
      ],
      readyMeals: []
    });

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setInput('ham, eggs and potatoes');
      result.current.setStrictIngredientMatch(true);
    });

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(geminiService.generateDinnerSuggestions).toHaveBeenCalledWith(
      expect.objectContaining({ strictIngredientMatch: true }),
      undefined,
      expect.any(AbortSignal)
    );
    expect(result.current.currentRecipes?.map(recipe => recipe.title)).toEqual(['Ham, egg and potato hash']);
  });

  it('explains when strict matching removes every recipe', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({
      recipes: [{
        title: 'Chicken traybake',
        ingredients: ['chicken thighs', 'potatoes', 'green beans', 'onion'],
        totalIngredientsCount: 4,
        totalTime: 45,
        cuisine: 'British'
      }],
      readyMeals: []
    });

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setInput('chicken thighs potatoes green beans');
      result.current.setStrictIngredientMatch(true);
    });

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(result.current.currentRecipes).toEqual([]);
    expect(result.current.searchContradiction?.content).toContain('unlisted ingredients');
    expect(result.current.searchContradiction?.content).toContain('garlic, herbs or lemon');
  });

  it('hides raw permission-denied provider payloads from users', async () => {
    const providerPayload = '{"error":{"code":403,"message":"Lightning dunning decision is deny for project: projects/58614176053","status":"PERMISSION_DENIED"}}';
    (geminiService.generateDinnerSuggestions as any).mockRejectedValue(
      new (geminiService.GeminiServiceError as any)('network', `ApiError: ${providerPayload}`)
    );

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.handleGenerate('family dinners');
    });

    expect(result.current.searchError).toBe(
      'Recipe search is temporarily unavailable because the search service account needs attention. This is on our side, so please try again later.'
    );
    expect(result.current.searchError).not.toContain('Lightning dunning');
    expect(result.current.searchError).not.toContain('projects/');
  });
});
