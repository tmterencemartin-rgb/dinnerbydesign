import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import * as geminiService from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

const sendSearchTelemetry = vi.fn();
let requestCounter = 0;
vi.mock('../lib/searchTelemetry', () => ({
  createSearchRequestId: () => `test-request-${++requestCounter}`,
  sendSearchTelemetry: (event: any) => sendSearchTelemetry(event)
}));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: any) => children,
}));
vi.mock('../services/geminiService', () => ({
  generateDinnerSuggestions: vi.fn(),
  generateMatchRationales: vi.fn().mockResolvedValue({}),
  GeminiServiceError: class extends Error {
    category: string;
    constructor(category: string, message: string) { super(message); this.category = category; }
  },
  INITIAL_COOK_FROM_SCRATCH_RESULTS: 3,
  INITIAL_READY_MADE_RESULTS: 3,
  MORE_CHOICES_RESULTS: 3
}));

const threeRecipes = ['Leek Soup', 'Leek Pie', 'Leek Risotto'].map(title => ({
  title, cuisine: 'British', totalTime: 30, totalServings: 2, ingredients: ['2 leeks'], sourceUrl: `https://www.kitchensanctuary.com/${title}`
}));

describe('useSearch delivery telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requestCounter = 0;
    window.localStorage.clear();
    window.sessionStorage.clear();
    (useAuth as any).mockReturnValue({
      profile: { preferences: {} }, addLog: vi.fn(), setError: vi.fn(), isAuthReady: true, loading: false,
      addToSearchHistory: vi.fn(), showToast: vi.fn(), setView: vi.fn(), goToSignUp: vi.fn(),
    });
  });

  it('marks a delivery served from the device cache and does not mark a live one', async () => {
    (geminiService.generateDinnerSuggestions as any).mockResolvedValue({ recipes: threeRecipes, readyMeals: [] });
    const { result } = renderHook(() => useSearch());

    act(() => { result.current.setInput('leek recipes'); });
    await act(async () => { await result.current.handleGenerate(); });
    act(() => { result.current.setInput('leek recipes'); });
    await act(async () => { await result.current.handleGenerate(); });

    const delivered = sendSearchTelemetry.mock.calls.map(call => call[0]).filter(event => event.stage === 'results_delivered');
    expect(geminiService.generateDinnerSuggestions).toHaveBeenCalledTimes(1);
    expect(delivered).toHaveLength(2);
    expect(delivered[0].fromCache).toBeUndefined();
    expect(delivered[1].fromCache).toBe(true);
  });
});
