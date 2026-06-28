import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Recipe, 
  ReadyMeal, 
  SearchParams, 
  UserPreferences,
  DinnerSource,
  OperationType,
  SaladPreference,
  DietaryRule
} from '../types';
import { normalizeIngredient, costItemSync } from '../services/groceryService';
import { safeStorage } from '../lib/storage';
import { generateDinnerSuggestions as performServiceSearch, generateMatchRationales, GeminiServiceError, INITIAL_COOK_FROM_SCRATCH_RESULTS, INITIAL_READY_MADE_RESULTS, MORE_CHOICES_RESULTS } from '../services/geminiService';
import { getRecipeKey, isSameRecipe } from '../lib/recipeUtils';
import { passesHardConstraints } from '../lib/dietarySafety';
import { normaliseUserPreferences } from '../lib/preferenceUtils';
import { 
  buildSearchParams, 
  cleanSearchParams, 
  hasActiveFilters, 
  buildActiveCriteria 
} from '../lib/searchUtils';
import { DIETARY_TAXONOMY } from '../constants';
import { handleFirestoreError } from '../firebase';

const SEARCH_CACHE_KEY = 'dbd_recent_search_cache_v1';
const SEARCH_CACHE_TTL_MS = 15 * 60 * 1000;
const SEARCH_CACHE_MAX_ENTRIES = 12;

type SearchCacheEntry = {
  createdAt: number;
  recipes: Recipe[];
  readyMeals: ReadyMeal[];
  hasExhaustedSearch: boolean;
};

type SearchCacheStore = Record<string, SearchCacheEntry>;

const stableStringify = (value: any): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys
    .filter(key => value[key] !== undefined)
    .map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
};

const shouldUseSearchCache = (params: SearchParams, options: { isAppend?: boolean; isReplacement?: boolean; isMoreLikeThis?: boolean }) => {
  return !options.isAppend
    && !options.isReplacement
    && !options.isMoreLikeThis
    && !(params as any)._retry
    && !params.similarityContext
    && !(params.excludeTitles && params.excludeTitles.length > 0);
};

const buildSearchCacheKey = (params: SearchParams, preferences: UserPreferences | null) => stableStringify({
  params,
  preferences: preferences ? normaliseUserPreferences(preferences) : null
});

const readSearchCache = (): SearchCacheStore => {
  try {
    const raw = safeStorage.getItem(SEARCH_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[SearchCache] Failed to read recent search cache:', err);
    return {};
  }
};

const getSearchCacheEntry = (key: string): SearchCacheEntry | null => {
  const cache = readSearchCache();
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.createdAt > SEARCH_CACHE_TTL_MS) return null;
  return entry;
};

const writeSearchCacheEntry = (key: string, entry: SearchCacheEntry) => {
  const cache = readSearchCache();
  cache[key] = entry;

  const pruned = Object.fromEntries(
    Object.entries(cache)
      .filter(([, item]) => Date.now() - item.createdAt <= SEARCH_CACHE_TTL_MS)
      .sort(([, a], [, b]) => b.createdAt - a.createdAt)
      .slice(0, SEARCH_CACHE_MAX_ENTRIES)
  );

  safeStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(pruned));
};

export function useSearch() {
  const { 
    user,
    profile, 
    addLog, 
    setError, 
    isAuthReady, 
    loading,
    showToast,
    addToSearchHistory,
    savePreferences
  } = useAuth();

  const [input, setInput] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const lastQueryRef = useRef('');
  const [source, setSource] = useState<DinnerSource>('cook');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[] | null>(null);
  const [currentReadyMeals, setCurrentReadyMeals] = useState<ReadyMeal[] | null>(null);
  const [searchContradiction, setSearchContradiction] = useState<{ type: 'note' | 'hard' | 'conflict' | 'no_results', content: string } | null>(null);
  const [searchCancelledHint, setSearchCancelledHint] = useState(false);
  const [hasExhaustedSearch, setHasExhaustedSearch] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'partial' | 'complete' | 'noResults' | 'error'>('idle');
  const [searchError, setLocalError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietTypes, setDietTypes] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [religiousEthical, setReligiousEthical] = useState<string[]>([]);
  const [styleWellness, setStyleWellness] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [omitIngredients, setOmitIngredients] = useState<string[]>([]);
  const [maxCalories, setMaxCalories] = useState('');
  const [maxTotalTime, setMaxTotalTime] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState('');
  const [maxCookTime, setMaxCookTime] = useState('');
  const [maxCostPerPortion, setMaxCostPerPortion] = useState('');
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [maxPricePerPerson, setMaxPricePerPerson] = useState('');
  const [maxHeatingTime, setMaxHeatingTime] = useState('');
  const [cookingMethods, setCookingMethods] = useState<string[]>([]);
  const [cookingFats, setCookingFats] = useState<string[]>([]);
  const [supermarkets, setSupermarkets] = useState<string[]>([]);
  const [dietaryRule, setDietaryRule] = useState<DietaryRule>('none');
  const [saladPreference, setSaladPreference] = useState<SaladPreference>('all');
  const [nutritiousChoice, setNutritiousChoice] = useState(false);
  const [highOmega3, setHighOmega3] = useState(false);
  const [highProtein, setHighProtein] = useState(false);
  const [isSimple, setIsSimple] = useState(false);
  const [isLowCost, setIsLowCost] = useState(false);
  const [isLeftoverMode, setIsLeftoverMode] = useState(false);
  const [servings, setServings] = useState('2');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferredSourceIds, setPreferredSourceIds] = useState<string[]>([]);

  // Reset low cost and leftovers when switching to ready-made mode
  useEffect(() => {
    if (source === 'ready-made') {
      setIsLowCost(false);
      setIsLeftoverMode(false);
    }
  }, [source]);
  const [dismissedTitles, setDismissedTitles] = useState<string[]>([]);
  const [isDietaryRuleSuppressed, setIsDietaryRuleSuppressed] = useState(false);
  const [suppressedPermanentKeys, setSuppressedPermanentKeys] = useState<string[]>([]);

  // Check for initial search query from LandingView sandbox
  useEffect(() => {
    if (isAuthReady && !loading && user && !user.isAnonymous) {
      const initialQuery = safeStorage.session.getItem('dbd_initial_search_query');
      if (initialQuery) {
        setInput(initialQuery);
        safeStorage.session.removeItem('dbd_initial_search_query');
        // Optionally trigger handleGenerate here if we want auto-search on entry
      }
    }
  }, [isAuthReady, loading, user]);

  const searchIdRef = useRef(0);
  const searchStartTimeRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastProfileIsLowCostRef = useRef<boolean | null>(null);
  const lastProfileIsSimpleRef = useRef<boolean | null>(null);
  const lastProfileNutritiousChoiceRef = useRef<boolean | null>(null);
  const lastProfileHighOmega3Ref = useRef<boolean | null>(null);
  const lastProfileHighProteinRef = useRef<boolean | null>(null);
  const lastProfileCalorieCeilingRef = useRef<number | null | undefined>(undefined);
  const lastProfileBudgetLimitRef = useRef<number | null | undefined>(undefined);
  const lastProfileSaladPreferenceRef = useRef<SaladPreference | undefined>(undefined);
  const lastProfileServingsRef = useRef<number | undefined>(undefined);
  const lastProfilePreferredSupermarketsRef = useRef<string[] | undefined>(undefined);
  const lastProfileDietaryRuleRef = useRef<DietaryRule | undefined>(undefined);
  const lastProfileCuisinePreferencesRef = useRef<string[] | undefined>(undefined);
  const lastProfileCookingMethodsRef = useRef<string[] | undefined>(undefined);
  const lastProfileCookingFatsRef = useRef<string[] | undefined>(undefined);
  const lastProfileAllergiesRef = useRef<string[] | undefined>(undefined);
  const lastProfilePreferredSourceIdsRef = useRef<string[] | undefined>(undefined);
  const lastProfileExclusionsRef = useRef<string[] | undefined>(undefined);
  const lastProfileReligiousEthicalRef = useRef<string[] | undefined>(undefined);
  const lastProfileReadyToEatUnderMinsRef = useRef<number | null | undefined>(undefined);

  const performSearch = useCallback(async (params: SearchParams, options: { isAppend?: boolean, isReplacement?: boolean, replacementIndex?: number, preferencesOverride?: UserPreferences | null, isMoreLikeThis?: boolean } = {}) => {
    const { isAppend = false, isReplacement = false, replacementIndex, preferencesOverride } = options;
    
    // Abort previous search if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    if (!isReplacement && !isAppend) {
      setHasExhaustedSearch(false);
      setCurrentRecipes(null);
      setCurrentReadyMeals(null);
      setSearchContradiction(null);
      setStatus('searching');
    }

    const currentSearchId = ++searchIdRef.current;
    searchStartTimeRef.current = Date.now();
    setSearchStartTime(Date.now());
    
    if (isAppend) setIsAppending(true);
    else setIsGenerating(true);
    
    setLocalError(null);

    const isAuthorised = !!user;
    const activePrefs = (preferencesOverride !== undefined && (preferencesOverride !== null || !isAuthorised)) ? preferencesOverride : (isAuthorised ? (profile?.preferences || null) : null);
    const cacheKey = shouldUseSearchCache(params, options) ? buildSearchCacheKey(params, activePrefs) : null;
    
    addLog(`SEARCH: performSearch START (id=${currentSearchId}, mode=${params.source}, query="${params.query}", auth=${isAuthorised})`);

    try {
      if (cacheKey) {
        const cached = getSearchCacheEntry(cacheKey);
        if (cached) {
          addLog(`SEARCH: recent cache HIT (id=${currentSearchId}, mode=${params.source}, query="${params.query}")`);
          setCurrentRecipes(cached.recipes);
          setCurrentReadyMeals(cached.readyMeals);
          setHasExhaustedSearch(cached.hasExhaustedSearch);
          setSearchContradiction(null);
          setStatus('complete');
          setEnriching(false);
          return;
        }
      }

      const result = await performServiceSearch(params, activePrefs || undefined, signal);
      const { recipes: accumulatedRecipes = [], readyMeals: accumulatedReadyMeals = [], budgetContradiction: contradiction } = result;
      const alternatives = (result as any).alternatives || [];
      const aiExhausted = (result as any).aiExhausted || false;
      const baseParamsForRationales = params;

      if (currentSearchId !== searchIdRef.current) {
        addLog(`SEARCH: perfomSearch ABORTED (stale id=${currentSearchId})`);
        return;
      }

      if (contradiction) {
        addLog(`SEARCH: Gemini detected budget contradiction for ${contradiction.ingredient}`);
        setSearchContradiction({
          type: 'hard',
          content: `Searching for ${contradiction.ingredient} conflicts with your £${contradiction.budgetLimit} budget limit. ${contradiction.reason}`
        });
        setStatus('noResults');
        setIsGenerating(false);
        setIsAppending(false);
        
        if (!isAppend && !isReplacement) {
          setCurrentRecipes([]);
          setCurrentReadyMeals([]);
        }
        return;
      }

      if (alternatives && alternatives.length > 0) {
        addLog(`SEARCH: No results found, AI suggested alternatives: ${alternatives.join(', ')}`);
      }

      if (accumulatedRecipes.length === 0 && accumulatedReadyMeals.length === 0) {
        setStatus('noResults');
        const filtersActive = !!(params.dietaryRule || (activePrefs && (activePrefs as any).dietaryRule) || params.isSimple || params.isLowCost);
        setSearchContradiction({
          type: filtersActive ? 'conflict' : 'no_results',
          content: filtersActive 
            ? `No dishes match your current filters. This might be due to a strict dietary preference (e.g. Vegetarian only) or exclusions. Try loosening your filters or searching for something else.`
            : `No dishes found for "${params.query || input}". Try adjusting your search term or broadening your criteria.`
        });
        if (!isAppend) {
          setCurrentRecipes([]);
          setCurrentReadyMeals([]);
        }
      } else {
        const timeLimit = params.maxTotalTime || params.maxHeatingTime;
        
        // Effective preferences for programmatic safety filter
        const effectivePrefs = {
          dietaryRule: (params.dietaryRule || activePrefs?.dietaryRule || 'none') as any,
          saladPreference: (params.saladPreference || activePrefs?.saladPreference || 'all') as any,
          allergies: [...(activePrefs?.allergies || [])],
          exclusions: [...(activePrefs?.exclusions || []), ...(params.exclusions || [])],
          religiousEthical: [...(activePrefs?.religiousEthical || []), ...(params.religiousEthical || [])],
          excludeIngredients: params.excludeIngredients || [],
          calorieCeiling: params.maxCalories !== undefined && params.maxCalories !== null ? params.maxCalories : (activePrefs?.calorieCeiling || null),
          budgetLimit: params.maxCostPerPortion || params.maxPricePerPerson || activePrefs?.budgetLimit || null,
          supermarkets: params.supermarkets || []
        };

        const recipesWithFinalIds = accumulatedRecipes
          .filter(r => passesHardConstraints(r, effectivePrefs))
          .filter(r => !timeLimit || r.totalTime <= timeLimit)
          .map(r => ({
            ...r,
            id: r.id || getRecipeKey(r)
          }));
          
        const readyMealsWithFinalIds = accumulatedReadyMeals
          .filter(m => passesHardConstraints(m, effectivePrefs))
          .filter(m => !timeLimit || m.totalTime <= timeLimit)
          .map(m => ({
            ...m,
            id: m.id || getRecipeKey(m)
          }));

        if (recipesWithFinalIds.length === 0 && readyMealsWithFinalIds.length === 0 && (accumulatedRecipes.length > 0 || accumulatedReadyMeals.length > 0)) {
          // If all results were stripped by the programmatic filter
          setStatus('noResults');
          setSearchContradiction({
            type: 'conflict',
            content: `No dishes match your current rules. Try broadening your search or removing an exclusion.`
          });
          if (!isAppend) {
            setCurrentRecipes([]);
            setCurrentReadyMeals([]);
          }
          return;
        }

        if (isReplacement && replacementIndex !== undefined) {
          if (recipesWithFinalIds.length > 0 || readyMealsWithFinalIds.length > 0) {
            const newItems = recipesWithFinalIds.length > 0 ? recipesWithFinalIds : readyMealsWithFinalIds;
            if (currentRecipes) {
              const next = [...currentRecipes];
              next[replacementIndex] = newItems[0] as Recipe;
              setCurrentRecipes(next);
            } else if (currentReadyMeals) {
              const next = [...currentReadyMeals];
              next[replacementIndex] = newItems[0] as ReadyMeal;
              setCurrentReadyMeals(next);
            }
          }
        } else if (isAppend) {
          let newlyAddedCount = 0;
          if (recipesWithFinalIds.length > 0) {
            setCurrentRecipes(prev => {
              const existing = prev || [];
              const uniqueNew = (recipesWithFinalIds as Recipe[]).filter(nr => 
                !existing.some(er => er.title.toLowerCase().trim() === nr.title.toLowerCase().trim())
              );
              newlyAddedCount += uniqueNew.length;
              return [...existing, ...uniqueNew];
            });
          }
          if (readyMealsWithFinalIds.length > 0) {
            setCurrentReadyMeals(prev => {
              const existing = prev || [];
              const uniqueNew = (readyMealsWithFinalIds as ReadyMeal[]).filter(nm => 
                !existing.some(em => em.title.toLowerCase().trim() === nm.title.toLowerCase().trim())
              );
              newlyAddedCount += uniqueNew.length;
              return [...existing, ...uniqueNew];
            });
          }
          
          if (aiExhausted || (recipesWithFinalIds.length === 0 && readyMealsWithFinalIds.length === 0)) {
            setHasExhaustedSearch(true);
          }
        } else {
          setCurrentRecipes(recipesWithFinalIds.length > 0 ? recipesWithFinalIds as Recipe[] : []);
          setCurrentReadyMeals(readyMealsWithFinalIds.length > 0 ? readyMealsWithFinalIds as ReadyMeal[] : []);
          setStatus('partial');
          
          // Only mark as exhausted if we got SIGNIFICANTLY fewer than requested, or AI says so
          const totalFound = recipesWithFinalIds.length + readyMealsWithFinalIds.length;
          if (aiExhausted || (totalFound === 0)) {
            setHasExhaustedSearch(true);
          }

          const finalItems = [...recipesWithFinalIds, ...readyMealsWithFinalIds] as (Recipe | ReadyMeal)[];
          if (cacheKey && finalItems.length > 0) {
            writeSearchCacheEntry(cacheKey, {
              createdAt: Date.now(),
              recipes: recipesWithFinalIds as Recipe[],
              readyMeals: readyMealsWithFinalIds as ReadyMeal[],
              hasExhaustedSearch: aiExhausted || totalFound === 0
            });
          }

          if (finalItems.length > 0) {
            window.dispatchEvent(new CustomEvent('pwa-meaningful-action'));
            const currentId = currentSearchId;
            setEnriching(true);
            generateMatchRationales(finalItems, params, activePrefs || undefined)
              .then(rationales => {
                if (currentId !== searchIdRef.current) return;
                setStatus('complete');
                setEnriching(false);
                if (recipesWithFinalIds.length > 0) {
                  setCurrentRecipes(prev => prev?.map(r => ({
                    ...r,
                    matchReason: rationales[r.title.toLowerCase().trim()] || r.matchReason
                  })) || null);
                }
                if (readyMealsWithFinalIds.length > 0) {
                  setCurrentReadyMeals(prev => prev?.map(m => ({
                    ...m,
                    matchReason: rationales[m.title.toLowerCase().trim()] || m.matchReason
                  })) || null);
                }
              })
              .catch(err => {
                console.error("[performSearch] Deferred enrichment failed:", err);
                setStatus('complete');
                setEnriching(false);
              });
          } else {
            setStatus('complete');
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`[useSearch] performSearch ABORTED (searchId=${currentSearchId})`);
        return;
      }
      setStatus('error');
      const rawErrorMsg = error instanceof GeminiServiceError ? error.message : (error?.message || String(error || "Unknown search error"));
      
      // Clean error messaging to ensure plain English and hide technical details (Operational Silence)
      const cleanErrorMessage = (msg: string): string => {
        if (!msg) return "Our AI service is experiencing a temporary issue. Please try again.";
        const lower = msg.toLowerCase();
        if (
          lower.includes("high demand") || 
          lower.includes("503") || 
          lower.includes("unavailable") || 
          lower.includes("quota") || 
          lower.includes("limit") || 
          lower.includes("resource exhausted") || 
          lower.includes("too many requests") || 
          lower.includes("rate limit") || 
          lower.includes("overloaded") || 
          lower.includes("capacity") ||
          lower.includes("deadline exceeded") ||
          lower.includes("temporary") ||
          lower.includes("apierror") ||
          lower.includes("server error")
        ) {
          return "Our AI service is experiencing a temporary issue. Please try again.";
        }
        return msg;
      };

      const errorMsg = cleanErrorMessage(rawErrorMsg);
      const category = error instanceof GeminiServiceError ? error.category : 'unknown';
      
      console.log(`[Diagnostic] SEARCH: Caught error! Category: ${category}. Raw Message: ${rawErrorMsg}`);
      addLog(`DIAGNOSTIC: Search catch block. Category=${category}. Msg=${errorMsg}`);

      const isParsingError = category === 'parsing';
      const isMultiSearch = (params.count || 3) > 1;
      const alreadyRetried = (params as any)._retry === true;

      if (isParsingError && isMultiSearch && !alreadyRetried) {
        performSearch({ ...params, count: 1, _retry: true } as any, options).catch(() => {});
        return;
      }

      if (!isReplacement && !isAppend) {
        setCurrentRecipes(null);
        setCurrentReadyMeals(null);
        setSearchContradiction(null);
      }

      if (isParsingError) {
        setLocalError("AI returned a malformed response. Please try again or simplify your search.");
      } else if (category === 'schema') {
        setLocalError("AI response was incomplete or mismatched. Please try again.");
      } else if (category === 'quota') {
        setLocalError(errorMsg); 
      } else if (category === 'network') {
        setLocalError(errorMsg);
      } else {
        if (!rawErrorMsg || rawErrorMsg.toLowerCase().includes('unknown') || rawErrorMsg === 'Server error') {
          setLocalError("Something went wrong on our end. Please try refreshing or adjusting your search query.");
        } else {
          setLocalError(errorMsg);
        }
      }
    } finally {
      if (currentSearchId === searchIdRef.current) {
        setIsGenerating(false);
        setIsAppending(false);
      }
    }
  }, [profile?.preferences, addLog, setError]); // Removed currentRecipes/currentReadyMeals from deps to avoid unnecessary re-creations


  const handleStopSearch = useCallback(() => {
    if (!isGenerating && !isAppending && status !== 'searching') return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    searchIdRef.current++;
    setIsGenerating(false);
    setIsAppending(false);
    
    // Crucial: Update status so derived isSearching states in views update correctly
    setStatus(currentRecipes || currentReadyMeals ? 'complete' : 'idle');
    
    setSearchCancelledHint(true);
    setTimeout(() => setSearchCancelledHint(false), 3000);
  }, [isGenerating, isAppending, status, currentRecipes, currentReadyMeals]);

  const handleGenerate = useCallback(async (queryOverride?: string, paramOverrides: Partial<SearchParams> = {}, preferencesOverride?: UserPreferences | null, options?: { skipHistory?: boolean; force?: boolean }) => {
    try {
      const searchQuery = (queryOverride !== undefined ? queryOverride : input).trim();
      const isAuthorised = !!user;
      const activePrefs = (preferencesOverride !== undefined && (preferencesOverride !== null || !isAuthorised)) ? preferencesOverride : (isAuthorised ? (profile?.preferences || null) : null);
      
      // Normalization check: compare trimmed and lowercase
      if (lastQueryRef.current.trim().toLowerCase() === searchQuery.toLowerCase() && !paramOverrides.count && !options?.force) {
        // If query is effectively the same, we might still want to refresh if filters changed,
        // but for auto-search/simple generate we skip if no change.
        if (options?.skipHistory) return;
      }

      setLastQuery(searchQuery);
      lastQueryRef.current = searchQuery;

      const combinedOverrides = {
        cuisines,
        dietTypes,
        exclusions,
        religiousEthical,
        styleWellness,
        excludeIngredients: [...excludeIngredients, ...omitIngredients],
        maxCalories: (maxCalories && !isNaN(parseInt(maxCalories))) ? parseInt(maxCalories) : (maxCalories === null ? null : undefined),
        maxTotalTime: (maxTotalTime && !isNaN(parseInt(maxTotalTime))) ? parseInt(maxTotalTime) : undefined,
        maxHeatingTime: (maxHeatingTime && !isNaN(parseInt(maxHeatingTime))) ? parseInt(maxHeatingTime) : undefined,
        maxCostPerPortion: (maxCostPerPortion && !isNaN(parseFloat(maxCostPerPortion))) ? parseFloat(maxCostPerPortion) : undefined,
        maxPricePerPerson: (maxPricePerPerson && !isNaN(parseFloat(maxPricePerPerson))) ? parseFloat(maxPricePerPerson) : undefined,
        cookingMethods,
        cookingFats,
        supermarkets,
        dietaryRule,
        saladPreference,
        isSimple,
        isLowCost,
        isLeftoverMode,
        nutritiousChoice,
        highOmega3,
        servings: (servings && !isNaN(parseInt(servings))) ? parseInt(servings) : undefined,
        excludeTitles: dismissedTitles.length > 0 ? dismissedTitles : undefined,
        count: source === 'cook' ? INITIAL_COOK_FROM_SCRATCH_RESULTS : INITIAL_READY_MADE_RESULTS,
        ...paramOverrides
      };

      const params = buildSearchParams(searchQuery, source, activePrefs, combinedOverrides);
      const cleaned = cleanSearchParams(params);

      // Add to search history if it's a real query and not from auto-search
      if (searchQuery && searchQuery.length > 2 && !options?.skipHistory) {
        addToSearchHistory(searchQuery, source);
      }

      // We don't setIsGenerating(true) here because performSearch does it immediately
      await performSearch(cleaned, { preferencesOverride: preferencesOverride !== undefined ? preferencesOverride : undefined });
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
      setIsGenerating(false);
    }
  }, [
    input, cuisines, dietTypes, exclusions, religiousEthical, styleWellness, 
    excludeIngredients, omitIngredients, maxCalories, maxTotalTime, maxHeatingTime, 
    maxCostPerPortion, maxPricePerPerson, cookingMethods, cookingFats, supermarkets, 
    saladPreference, isSimple, isLowCost, isLeftoverMode, nutritiousChoice, highOmega3, servings, dismissedTitles, 
    source, profile?.preferences, addToSearchHistory, performSearch, setError, setIsGenerating
  ]);


  // Handle Generate Ref for effect usage
  const handleGenerateRef = useRef(handleGenerate);
  useEffect(() => {
    handleGenerateRef.current = handleGenerate;
  }, [handleGenerate]);

  // Automatic debounced search on input change
  useEffect(() => {
    if (!input || input.trim().length < 3) return;
    
    const timer = setTimeout(() => {
      // Don't auto-search if a search is already in progress with the same query
      if (lastQuery === input.trim()) return;
      
      // Auto-searches skip history to prevent "history pollution" with partial terms
      handleGenerateRef.current(undefined, {}, null, { skipHistory: true });
    }, 500); // 500ms debounce for typing

    return () => clearTimeout(timer);
  }, [input, lastQuery]);

  // Keep track of the last filter values to detect actual filter changes
  const lastFiltersRef = useRef({
    cuisines,
    dietTypes,
    exclusions,
    excludeIngredients,
    omitIngredients,
    maxCalories,
    maxTotalTime,
    maxHeatingTime,
    maxCostPerPortion,
    cookingMethods,
    cookingFats,
    dietaryRule,
    saladPreference,
    nutritiousChoice,
    highOmega3,
    isSimple,
    isLowCost,
    isLeftoverMode,
    supermarkets,
    servings
  });

  // Automatic debounced search on filter change
  useEffect(() => {
    const currentFilters = {
      cuisines,
      dietTypes,
      exclusions,
      excludeIngredients,
      omitIngredients,
      maxCalories,
      maxTotalTime,
      maxHeatingTime,
      maxCostPerPortion,
      cookingMethods,
      cookingFats,
      dietaryRule,
      saladPreference,
      nutritiousChoice,
      highOmega3,
      isSimple,
      isLowCost,
      isLeftoverMode,
      supermarkets,
      servings
    };

    const hasArrayChanged = (a: any[], b: any[]) => {
      if (a.length !== b.length) return true;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.some((val, i) => val !== sortedB[i]);
    };

    const filtersChanged = 
      hasArrayChanged(cuisines, lastFiltersRef.current.cuisines) ||
      hasArrayChanged(dietTypes, lastFiltersRef.current.dietTypes) ||
      hasArrayChanged(exclusions, lastFiltersRef.current.exclusions) ||
      hasArrayChanged(excludeIngredients, lastFiltersRef.current.excludeIngredients) ||
      hasArrayChanged(omitIngredients, lastFiltersRef.current.omitIngredients) ||
      maxCalories !== lastFiltersRef.current.maxCalories ||
      maxTotalTime !== lastFiltersRef.current.maxTotalTime ||
      maxHeatingTime !== lastFiltersRef.current.maxHeatingTime ||
      maxCostPerPortion !== lastFiltersRef.current.maxCostPerPortion ||
      hasArrayChanged(cookingMethods, lastFiltersRef.current.cookingMethods) ||
      hasArrayChanged(cookingFats, lastFiltersRef.current.cookingFats) ||
      dietaryRule !== lastFiltersRef.current.dietaryRule ||
      saladPreference !== lastFiltersRef.current.saladPreference ||
      nutritiousChoice !== lastFiltersRef.current.nutritiousChoice ||
      highOmega3 !== lastFiltersRef.current.highOmega3 ||
      isSimple !== lastFiltersRef.current.isSimple ||
      isLowCost !== lastFiltersRef.current.isLowCost ||
      isLeftoverMode !== lastFiltersRef.current.isLeftoverMode ||
      hasArrayChanged(supermarkets, lastFiltersRef.current.supermarkets) ||
      servings !== lastFiltersRef.current.servings;

    // Update ref to the latest filters
    lastFiltersRef.current = currentFilters;

    // Only automatically re-filter if filters actually changed and there is an active search query
    if (filtersChanged && lastQuery.trim()) {
      const timer = setTimeout(() => {
        handleGenerateRef.current(undefined, {}, null, { skipHistory: true, force: true });
      }, 300); // 300ms debounce
      return () => clearTimeout(timer);
    }
  }, [
    lastQuery,
    cuisines,
    dietTypes,
    exclusions,
    excludeIngredients,
    omitIngredients,
    maxCalories,
    maxTotalTime,
    maxHeatingTime,
    maxCostPerPortion,
    cookingMethods,
    cookingFats,
    dietaryRule,
    saladPreference,
    nutritiousChoice,
    highOmega3,
    isSimple,
    isLowCost,
    isLeftoverMode,
    supermarkets,
    servings
  ]);

  const handleLoadMore = useCallback(async () => {
    if (isGenerating || hasExhaustedSearch) return;
    setError(null);
    setLocalError(null);
    
    try {
      const currentTitles = [
        ...(currentRecipes?.map(r => r.title) || []),
        ...(currentReadyMeals?.map(m => m.title) || [])
      ];
      
      const newDismissed = [...new Set([...dismissedTitles, ...currentTitles])];
      setDismissedTitles(newDismissed);

      const combinedOverrides = {
        cuisines,
        dietTypes,
        exclusions,
        religiousEthical,
        styleWellness,
        excludeIngredients: [...excludeIngredients, ...omitIngredients],
        maxCalories: (maxCalories && !isNaN(parseInt(maxCalories))) ? parseInt(maxCalories) : undefined,
        maxTotalTime: (maxTotalTime && !isNaN(parseInt(maxTotalTime))) ? parseInt(maxTotalTime) : undefined,
        maxHeatingTime: (maxHeatingTime && !isNaN(parseInt(maxHeatingTime))) ? parseInt(maxHeatingTime) : undefined,
        maxCostPerPortion: (maxCostPerPortion && !isNaN(parseFloat(maxCostPerPortion))) ? parseFloat(maxCostPerPortion) : undefined,
        maxPricePerPerson: (maxPricePerPerson && !isNaN(parseFloat(maxPricePerPerson))) ? parseFloat(maxPricePerPerson) : undefined,
        cookingMethods,
        cookingFats,
        supermarkets,
        dietaryRule,
        saladPreference,
        isSimple,
        isLowCost,
        isLeftoverMode,
        nutritiousChoice,
        servings: (servings && !isNaN(parseInt(servings))) ? parseInt(servings) : undefined,
        excludeTitles: newDismissed,
        count: MORE_CHOICES_RESULTS
      };

      const params = buildSearchParams(input || lastQuery, source, profile?.preferences || null, combinedOverrides);
      const cleaned = cleanSearchParams(params);

      await performSearch(cleaned, { isAppend: true });
    } catch (err) {
      console.error("handleLoadMore failure:", err);
    }
  }, [
    isGenerating, hasExhaustedSearch, currentRecipes, currentReadyMeals, dismissedTitles, 
    cuisines, dietTypes, exclusions, religiousEthical, styleWellness, 
    excludeIngredients, omitIngredients, maxCalories, maxTotalTime, maxHeatingTime, 
    maxCostPerPortion, maxPricePerPerson, cookingMethods, cookingFats, supermarkets, 
    saladPreference, isSimple, isLowCost, isLeftoverMode, nutritiousChoice, servings, input, lastQuery, 
    source, profile?.preferences, performSearch
  ]);


  const clearResults = useCallback(() => {
    setCurrentRecipes(null);
    setCurrentReadyMeals(null);
    setSearchContradiction(null);
    setHasExhaustedSearch(false);
  }, []);

  const resetSearchFilters = useCallback(() => {
    searchIdRef.current++;
    setInput('');
    setLastQuery('');
    lastQueryRef.current = '';
    clearResults();
    setStatus('idle');
    setCuisines(profile?.preferences?.cuisinePreferences || []);
    setDietTypes([]);
    setExclusions(profile?.preferences?.exclusions || []);
    setReligiousEthical(profile?.preferences?.religiousEthical || []);
    setStyleWellness([]);
    setExcludeIngredients([]);
    setOmitIngredients([]);
    setDismissedTitles([]);
    setIsGenerating(false);
    setError(null);
    setLocalError(null);
    setMaxCalories(profile?.preferences?.calorieCeiling?.toString() || '');
    setMaxCostPerPortion(profile?.preferences?.budgetLimit?.toString() || '');
    setSaladPreference(profile?.preferences?.saladPreference || 'all');
    setIsSimple(profile?.preferences?.isSimple || false);
    setIsLowCost(profile?.preferences?.isLowCost || false);
    setServings(profile?.preferences?.servings?.toString() || '2');

    const targetUnderMins = profile?.preferences?.readyToEatUnderMins?.toString() || '';
    setMaxTotalTime(targetUnderMins);
    setMaxPrepTime('');
    setMaxCookTime('');
    setSelectedRetailers([]);
    setMaxPricePerPerson(profile?.preferences?.budgetLimit?.toString() || '');
    setMaxHeatingTime(targetUnderMins);
    setCookingMethods(profile?.preferences?.cookingMethods || []);
    setCookingFats(profile?.preferences?.cookingFats || []);
    setSupermarkets(profile?.preferences?.preferredSupermarkets || []);
    setDietaryRule(profile?.preferences?.dietaryRule || 'none');
    setNutritiousChoice(profile?.preferences?.nutritiousChoice || false);
    setHighOmega3(profile?.preferences?.highOmega3 || false);
    setHighProtein(profile?.preferences?.highProtein || false);
    setAllergies(profile?.preferences?.allergies || []);
    setPreferredSourceIds(profile?.preferences?.preferredSourceIds || []);
    setIsDietaryRuleSuppressed(false);
    setSuppressedPermanentKeys([]);

    // Reset session persistence tracking refs on manual search reset
    lastProfileIsLowCostRef.current = profile?.preferences?.isLowCost || false;
    lastProfileIsSimpleRef.current = profile?.preferences?.isSimple || false;
    lastProfileNutritiousChoiceRef.current = profile?.preferences?.nutritiousChoice || false;
    lastProfileHighOmega3Ref.current = profile?.preferences?.highOmega3 || false;
    lastProfileHighProteinRef.current = profile?.preferences?.highProtein || false;
    lastProfileCalorieCeilingRef.current = profile?.preferences?.calorieCeiling;
    lastProfileBudgetLimitRef.current = profile?.preferences?.budgetLimit;
    lastProfileSaladPreferenceRef.current = profile?.preferences?.saladPreference;
    lastProfileServingsRef.current = profile?.preferences?.servings;
    lastProfilePreferredSupermarketsRef.current = profile?.preferences?.preferredSupermarkets || [];
    lastProfileDietaryRuleRef.current = profile?.preferences?.dietaryRule;
    lastProfileCuisinePreferencesRef.current = profile?.preferences?.cuisinePreferences || [];
    lastProfileCookingMethodsRef.current = profile?.preferences?.cookingMethods || [];
    lastProfileCookingFatsRef.current = profile?.preferences?.cookingFats || [];
    lastProfileAllergiesRef.current = profile?.preferences?.allergies || [];
    lastProfilePreferredSourceIdsRef.current = profile?.preferences?.preferredSourceIds || [];
    lastProfileExclusionsRef.current = profile?.preferences?.exclusions || [];
    lastProfileReligiousEthicalRef.current = profile?.preferences?.religiousEthical || [];
    lastProfileReadyToEatUnderMinsRef.current = profile?.preferences?.readyToEatUnderMins;

    setCurrentRecipes(null);
    setCurrentReadyMeals(null);
    setSearchContradiction(null);
    setHasExhaustedSearch(false);
  }, [
    profile?.preferences?.calorieCeiling,
    profile?.preferences?.budgetLimit,
    profile?.preferences?.saladPreference,
    profile?.preferences?.isSimple,
    profile?.preferences?.isLowCost,
    profile?.preferences?.servings,
    profile?.preferences?.nutritiousChoice,
    profile?.preferences?.highOmega3,
    profile?.preferences?.dietaryRule,
    profile?.preferences?.cuisinePreferences,
    profile?.preferences?.cookingMethods,
    profile?.preferences?.cookingFats,
    profile?.preferences?.exclusions,
    profile?.preferences?.religiousEthical,
    profile?.preferences?.preferredSupermarkets,
    profile?.preferences?.readyToEatUnderMins,
    profile?.preferences?.allergies,
    profile?.preferences?.preferredSourceIds,
    setError
  ]);

  const handleNewSearch = () => {
    resetSearchFilters();
    if (profile?.preferences?.preferredMode) {
      setSource(profile?.preferences?.preferredMode || 'cook');
    } else {
      setSource('cook');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPreferencesInitializedRef = useRef(false);
  const lastPreferencesJsonRef = useRef<string | null>(null);
  const lastPrefUidRef = useRef<string | null>(null);

  // Unified synchronization effect listening directly to profile UID and Stringified user preferences changes
  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    const currentUid = profile?.uid || user?.uid || null;
    const currentPreferences = profile?.preferences || null;
    const currentPrefXmlString = currentPreferences ? JSON.stringify(currentPreferences) : null;

    const isUidTransition = currentUid !== lastPrefUidRef.current;
    const arePreferencesUpdated = currentPrefXmlString !== lastPreferencesJsonRef.current;

    if (isUidTransition || arePreferencesUpdated) {
      addLog(`SYSTEM: Hydration/Sync - Triggered due to: uidTransition=${isUidTransition}, preferencesUpdated=${arePreferencesUpdated}`);
      
      lastPrefUidRef.current = currentUid;
      lastPreferencesJsonRef.current = currentPrefXmlString;

      if (currentPreferences) {
        addLog('SYSTEM: Initializing search state values from loaded user profile preferences.');
        
        // Populate all filter states cleanly
        setMaxCalories(currentPreferences.calorieCeiling?.toString() || '');
        setMaxCostPerPortion(currentPreferences.budgetLimit?.toString() || '');
        setMaxPricePerPerson(currentPreferences.budgetLimit?.toString() || '');
        setSaladPreference(currentPreferences.saladPreference || 'all');
        setIsLowCost(currentPreferences.isLowCost || false);
        setIsSimple(currentPreferences.isSimple || false);
        setNutritiousChoice(currentPreferences.nutritiousChoice || false);
        setHighOmega3(currentPreferences.highOmega3 || false);
        setHighProtein(currentPreferences.highProtein || false);
        setServings(currentPreferences.servings?.toString() || '2');
        setSupermarkets(currentPreferences.preferredSupermarkets || []);
        setDietaryRule(currentPreferences.dietaryRule || 'none');
        setCuisines(currentPreferences.cuisinePreferences || []);
        setCookingMethods(currentPreferences.cookingMethods || []);
        setCookingFats(currentPreferences.cookingFats || []);
        setExclusions(currentPreferences.exclusions || []);
        setReligiousEthical(currentPreferences.religiousEthical || []);
        setAllergies(currentPreferences.allergies || []);
        setPreferredSourceIds(currentPreferences.preferredSourceIds || []);
        
        const underMinsStr = currentPreferences.readyToEatUnderMins ? currentPreferences.readyToEatUnderMins.toString() : '';
        setMaxTotalTime(underMinsStr);
        setMaxHeatingTime(underMinsStr);

        // Update tracking refs so any downstream components that read these values stay in perfect sync
        lastProfileIsLowCostRef.current = currentPreferences.isLowCost || false;
        lastProfileIsSimpleRef.current = currentPreferences.isSimple || false;
        lastProfileNutritiousChoiceRef.current = currentPreferences.nutritiousChoice || false;
        lastProfileHighOmega3Ref.current = currentPreferences.highOmega3 || false;
        lastProfileHighProteinRef.current = currentPreferences.highProtein || false;
        lastProfileCalorieCeilingRef.current = currentPreferences.calorieCeiling;
        lastProfileBudgetLimitRef.current = currentPreferences.budgetLimit;
        lastProfileSaladPreferenceRef.current = currentPreferences.saladPreference;
        lastProfileServingsRef.current = currentPreferences.servings;
        lastProfilePreferredSupermarketsRef.current = currentPreferences.preferredSupermarkets || [];
        lastProfileDietaryRuleRef.current = currentPreferences.dietaryRule;
        lastProfileCuisinePreferencesRef.current = currentPreferences.cuisinePreferences || [];
        lastProfileCookingMethodsRef.current = currentPreferences.cookingMethods || [];
        lastProfileCookingFatsRef.current = currentPreferences.cookingFats || [];
        lastProfileAllergiesRef.current = currentPreferences.allergies || [];
        lastProfilePreferredSourceIdsRef.current = currentPreferences.preferredSourceIds || [];
        lastProfileExclusionsRef.current = currentPreferences.exclusions || [];
        lastProfileReligiousEthicalRef.current = currentPreferences.religiousEthical || [];
        lastProfileReadyToEatUnderMinsRef.current = currentPreferences.readyToEatUnderMins;

        isPreferencesInitializedRef.current = true;

        if (isUidTransition) {
          // Authentic identity change: clear state fields that would carry over stale guest searches
          setInput('');
          setLastQuery('');
          lastQueryRef.current = '';
          clearResults();
          setStatus('idle');
          setDietTypes([]);
          setStyleWellness([]);
          setExcludeIngredients([]);
          setOmitIngredients([]);
          setDismissedTitles([]);
          setIsGenerating(false);
          setIsDietaryRuleSuppressed(false);
          setSuppressedPermanentKeys([]);
        } else if (lastQueryRef.current && (currentRecipes || currentReadyMeals)) {
          // Changed preferences from within settings, automatically re-run search query matching new preferences!
          handleGenerate(undefined, {}, currentPreferences, { skipHistory: true });
        }
      } else {
        // Logged out completely with null profile/preferences, restore original guests baseline state safely
        resetSearchFilters();
      }
    }
  }, [profile, profile?.preferences, user, user?.uid, isAuthReady, clearResults, resetSearchFilters, addLog]);



  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-GB';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        addLog(`VOICE: Recognition SUCCESS: "${transcript}"`);
        // Note: handleGenerate will be called by the user manually or we could trigger it
      };

      recognition.onerror = (event: any) => {
        const error = event.error;
        setIsListening(false);
        
        // Ignore "no-speech" and "aborted" as they are common and don't need to be reported as errors
        if (error === 'no-speech' || error === 'aborted') {
          addLog(`VOICE: Recognition ended (${error})`);
          return;
        }

        console.error('Speech recognition error:', error);
        addLog(`VOICE: Recognition ERROR: ${error}`);
        
        // Optionally show a user-friendly message for other errors
        if (error === 'not-allowed') {
          showToast("Microphone access was denied. Please check your browser settings.");
        } else if (error === 'network') {
          showToast("Speech recognition failed due to a network issue.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [addLog]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        addLog('VOICE: Recognition START');
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const activeCriteria = React.useMemo(() => {
    const params = {
      query: input,
      source,
      cuisines,
      dietTypes,
      exclusions,
      religiousEthical,
      styleWellness,
      excludeIngredients: [...excludeIngredients, ...omitIngredients],
      maxCalories: maxCalories ? parseInt(maxCalories) : undefined,
      maxTotalTime: maxTotalTime ? parseInt(maxTotalTime) : undefined,
      maxHeatingTime: maxHeatingTime ? parseInt(maxHeatingTime) : undefined,
      maxCostPerPortion: maxCostPerPortion ? parseFloat(maxCostPerPortion) : undefined,
      maxPricePerPerson: maxPricePerPerson ? parseFloat(maxPricePerPerson) : undefined,
      supermarkets,
      cookingMethods,
      dietaryRule,
      saladPreference,
      isSimple,
      isLowCost,
      nutritiousChoice,
      highOmega3,
      highProtein,
      allergies,
      preferredSourceIds,
      servings: servings ? parseInt(servings) : undefined
    } as SearchParams;

    // Permanent filters are for all sessions (including anonymous guest onboarding)
    const isAuthorised = !!user;
    const effectivePrefs = profile?.preferences || null;

    const result = buildActiveCriteria(params, effectivePrefs, {
      isDietaryRuleSuppressed,
      suppressedPermanentKeys,
      DIETARY_TAXONOMY
    });

    console.log('[useSearch] activeCriteria computed:', { 
      count: result.length, 
      isLowCostInParams: params.isLowCost,
      isLowCostInState: isLowCost,
      labels: result.map(c => c.label),
      isAuthorised
    });

    return result;
  }, [
    profile?.preferences?.dietaryRule,
    profile?.preferences?.isLowCost,
    profile?.preferences?.isSimple,
    profile?.preferences?.nutritiousChoice,
    profile?.preferences?.highOmega3,
    profile?.preferences?.highProtein,
    profile?.preferences?.readyToEatUnderMins,
    profile?.preferences?.calorieCeiling,
    profile?.preferences?.budgetLimit,
    profile?.preferences?.saladPreference,
    profile?.preferences?.allergies?.join(','),
    profile?.preferences?.exclusions?.join(','),
    profile?.preferences?.religiousEthical?.join(','),
    profile?.preferences?.cuisinePreferences?.join(','),
    profile?.preferences?.preferredSupermarkets?.join(','),
    profile?.preferences?.preferredSourceIds?.join(','),
    isDietaryRuleSuppressed,
    suppressedPermanentKeys,
    user?.isAnonymous,
    user?.uid,
    source,
    cuisines,
    dietTypes,
    exclusions,
    religiousEthical,
    styleWellness,
    excludeIngredients,
    omitIngredients,
    maxCalories,
    maxTotalTime,
    maxHeatingTime,
    maxCostPerPortion,
    maxPricePerPerson,
    supermarkets,
    cookingMethods,
    dietaryRule,
    saladPreference,
    isSimple,
    isLowCost,
    nutritiousChoice,
    highOmega3,
    highProtein,
    allergies,
    preferredSourceIds,
    servings
  ]);

  const filterCount = activeCriteria.length;
  const isPreciseSearch = filterCount >= 3;

  const removeFilter = useCallback((type: string, value: string) => {
    // Check if it's a permanent filter type
    const permanentTypes = [
      'dietaryRule', 'saladPreference', 'allergy', 'profileExclusion', 
      'profileReligious', 'profileCuisine', 'profileCookingMethod', 
      'profileCookingFat', 'readyToEatUnderMins', 'isSimple', 'isLowCost', 'nutritiousChoice',
      'maxCalories', 'maxCostPerPortion', 'maxPricePerPerson', 'servings'
    ];

    const currentFilter = activeCriteria.find(c => c.type === type && c.value === value);
    const isActuallyPermanent = currentFilter?.isPermanent;

    if (isActuallyPermanent && permanentTypes.includes(type)) {
      if (type === 'dietaryRule') {
        setIsDietaryRuleSuppressed(true);
      } else {
        setSuppressedPermanentKeys(prev => [...prev, `${type}-${value}`]);
      }
    }

    // Special logic: If clearing an ephemeral filter that has a permanent counterpart,
    // we should ALSO suppress the permanent counterpart so it doesn't just re-appear.
    if (!isActuallyPermanent) {
      if (type === 'maxCalories' && profile?.preferences?.calorieCeiling) {
        setSuppressedPermanentKeys(prev => [...prev, `maxCalories-${profile.preferences.calorieCeiling}`]);
      }
      if (type === 'maxCostPerPortion' && profile?.preferences?.budgetLimit) {
        setSuppressedPermanentKeys(prev => [...prev, `maxCostPerPortion-${profile.preferences.budgetLimit}`]);
      }
      if (type === 'maxPricePerPerson' && profile?.preferences?.budgetLimit) {
        setSuppressedPermanentKeys(prev => [...prev, `maxPricePerPerson-${profile.preferences.budgetLimit}`]);
      }
      if (type === 'servings' && profile?.preferences?.servings && profile.preferences.servings !== 2) {
        setSuppressedPermanentKeys(prev => [...prev, `servings-${profile.preferences.servings}`]);
      }
      if ((type === 'readyToEatUnderMins' || type === 'maxTotalTime' || type === 'maxHeatingTime') && profile?.preferences?.readyToEatUnderMins) {
        setSuppressedPermanentKeys(prev => [...prev, `readyToEatUnderMins-${profile.preferences.readyToEatUnderMins}`]);
      }
      if (type === 'saladPreference' && profile?.preferences?.saladPreference && profile.preferences.saladPreference !== 'all') {
        setSuppressedPermanentKeys(prev => [...prev, `saladPreference-${profile.preferences.saladPreference}`]);
      }
      if (type === 'isSimple' && profile?.preferences?.isSimple) {
        setSuppressedPermanentKeys(prev => [...prev, 'isSimple-true']);
      }
      if (type === 'isLowCost' && profile?.preferences?.isLowCost) {
        setSuppressedPermanentKeys(prev => [...prev, 'isLowCost-true']);
      }
      if (type === 'nutritiousChoice' && profile?.preferences?.nutritiousChoice) {
        setSuppressedPermanentKeys(prev => [...prev, 'nutritiousChoice-true']);
      }
      if (type === 'highOmega3' && profile?.preferences?.highOmega3) {
        setSuppressedPermanentKeys(prev => [...prev, 'highOmega3-true']);
      }
      if (type === 'highProtein' && profile?.preferences?.highProtein) {
        setSuppressedPermanentKeys(prev => [...prev, 'highProtein-true']);
      }
    }

    // Also handle state reset regardless of permanence for these fields
    switch (type) {
      case 'cuisine': setCuisines(prev => prev.filter(v => v !== value)); break;
      case 'profileCuisine': setCuisines(prev => prev.filter(v => v !== value)); break;
      case 'cookingMethod': setCookingMethods(prev => prev.filter(v => v !== value)); break;
      case 'supermarket': setSupermarkets(prev => prev.filter(v => v !== value)); break;
      case 'dietType': setDietTypes(prev => prev.filter(v => v !== value)); break;
      case 'exclusion': setExclusions(prev => prev.filter(v => v !== value)); break;
      case 'religiousEthical': setReligiousEthical(prev => prev.filter(v => v !== value)); break;
      case 'styleWellness': setStyleWellness(prev => prev.filter(v => v !== value)); break;
      case 'excludeIngredient': setExcludeIngredients(prev => prev.filter(v => v !== value)); break;
      case 'omitIngredient': setOmitIngredients(prev => prev.filter(v => v !== value)); break;
      case 'dietaryRule': setDietaryRule('none'); break;
      case 'maxCalories': setMaxCalories(''); break;
      case 'maxTotalTime': setMaxTotalTime(''); break;
      case 'maxCostPerPortion': setMaxCostPerPortion(''); break;
      case 'maxPricePerPerson': setMaxPricePerPerson(''); break;
      case 'readyToEatUnderMins':
      case 'maxHeatingTime': setMaxHeatingTime(''); setMaxTotalTime(''); break;
      case 'servings': setServings('2'); break;
      case 'saladPreference': setSaladPreference('all'); break;
      case 'isSimple': setIsSimple(false); break;
      case 'isLowCost': setIsLowCost(false); break;
      case 'nutritiousChoice': setNutritiousChoice(false); break;
      case 'highOmega3': setHighOmega3(false); break;
      case 'highProtein': setHighProtein(false); break;
    }
    
    // We no longer manually clear queries and results on chip removal; the reactive search useEffect triggers on the filter state changes.
  }, [
    activeCriteria, profile?.preferences, input, currentRecipes, currentReadyMeals, 
    clearResults,
    setCuisines, setCookingMethods, setSupermarkets, setDietTypes, setExclusions, 
    setReligiousEthical, setStyleWellness, setExcludeIngredients, setOmitIngredients, 
    setMaxCalories, setMaxTotalTime, setMaxCostPerPortion, setMaxPricePerPerson, 
    setMaxHeatingTime, setServings, setSaladPreference, setIsSimple, setIsLowCost, setNutritiousChoice, setHighOmega3, setHighProtein,
    setIsDietaryRuleSuppressed, setSuppressedPermanentKeys
  ]);

  return {
    input, setInput,
    lastQuery,
    source, setSource,
    isGenerating,
    isAppending,
    status,
    searchError,
    enriching,
    searchStartTime,
    filterCount,
    isPreciseSearch,
    currentRecipes,
    currentReadyMeals,
    searchContradiction,
    searchCancelledHint,
    hasExhaustedSearch,
    isListening,
    isSpeechSupported,
    toggleVoiceSearch,
    
    cuisines, setCuisines,
    dietTypes, setDietTypes,
    exclusions, setExclusions,
    religiousEthical, setReligiousEthical,
    styleWellness, setStyleWellness,
    excludeIngredients, setExcludeIngredients,
    omitIngredients, setOmitIngredients,
    maxCalories, setMaxCalories,
    maxTotalTime, setMaxTotalTime,
    maxPrepTime, setMaxPrepTime,
    maxCookTime, setMaxCookTime,
    maxCostPerPortion, setMaxCostPerPortion,
    selectedRetailers, setSelectedRetailers,
    maxPricePerPerson, setMaxPricePerPerson,
    maxHeatingTime, setMaxHeatingTime,
    cookingMethods, setCookingMethods,
    cookingFats, setCookingFats,
    dietaryRule, setDietaryRule,
    saladPreference, setSaladPreference,
    nutritiousChoice, setNutritiousChoice,
    highOmega3, setHighOmega3,
    highProtein, setHighProtein,
    isSimple, setIsSimple,
    isLowCost, setIsLowCost,
    isLeftoverMode, setIsLeftoverMode,
    supermarkets, setSupermarkets,
    servings, setServings,
    allergies, setAllergies,
    preferredSourceIds, setPreferredSourceIds,
    dismissedTitles, setDismissedTitles,
    isDietaryRuleSuppressed, setIsDietaryRuleSuppressed,
    suppressedPermanentKeys, setSuppressedPermanentKeys,
    activeCriteria,
    removeFilter,

    performSearch,
    handleGenerate,
    handleLoadMore,
    handleStopSearch,
    handleNewSearch,
    clearResults,
    resetSearchFilters
  };
}
