import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Loader2, 
  Info, 
  Check, 
  Search, 
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';
import { SearchStatusRow } from '../home/SearchStatusRow';
import { CircleX } from '../ui/CircleX';
import { Tooltip } from '../ui/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
import { RecipeListActions } from '../RecipeListActions';
import { NumberStepper } from '../ui/NumberStepper';
import { RecipeCard } from '../RecipeCard';
import { ReadyMealCard } from '../ReadyMealCard';
import { SearchHeader } from '../home/SearchHeader';
import { SearchInput } from '../home/SearchInput';
import { SearchExamples } from '../home/SearchExamples';
import { CriteriaChips } from '../home/CriteriaChips';
import { FilterOverlay } from '../home/FilterOverlay';
import { ConnectionDiagnostics } from '../home/ConnectionDiagnostics';
import { DIETARY_TAXONOMY } from '../../constants';
import { isSameRecipe } from '../../lib/recipeUtils';
import { detectIngredientIntent } from '../../lib/ingredientParser';
import { CompactRecipeItem } from '../CompactRecipeItem';
import { RecipeDetailOverlay } from '../RecipeDetailOverlay';
import { SearchOnboardingHelper } from '../home/SearchOnboardingHelper';
import { RecipeCompareModal } from '../RecipeCompareModal';

import { PREFERRED_SOURCES } from '../../data/preferredSources';
import { safeStorage } from '../../lib/storage';
import { normaliseUserPreferences } from '../../lib/preferenceUtils';

const stripSearchLeadIn = (query: string) =>
  query
    .replace(/\b(what can i make with|what can i cook with|i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only)\b/gi, '')
    .replace(/[?!.]/g, ' ')
    .trim();

const sentenceCase = (value: string) => {
  const clean = value.trim().replace(/\s+/g, ' ');
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : '';
};

const formatDinnerBrief = (query: string, ingredientIntent: ReturnType<typeof detectIngredientIntent>) => {
  const cleanQuery = stripSearchLeadIn(query);
  if (!cleanQuery) return '';

  if (!ingredientIntent?.isIngredientLed) {
    return sentenceCase(cleanQuery);
  }

  const parts = cleanQuery
    .split(/,|\band\b/i)
    .map(part => sentenceCase(part))
    .filter(Boolean);

  const displayParts = parts.length >= 2 ? parts : ingredientIntent.ingredients.map(sentenceCase);
  if (displayParts.length <= 1) return displayParts[0] || sentenceCase(cleanQuery);
  if (displayParts.length === 2) return `${displayParts[0]} and ${displayParts[1]}`;
  return `${displayParts.slice(0, -1).join(', ')} and ${displayParts[displayParts.length - 1]}`;
};

const buildResultsHeading = ({
  count,
  query,
  source,
  ingredientIntent
}: {
  count: number;
  query: string;
  source: 'cook' | 'ready-made';
  ingredientIntent: ReturnType<typeof detectIngredientIntent>;
}) => {
  if (!count || !query.trim()) return '';

  if (source === 'cook' && isNotBoringSummerSaladsQuery(query)) {
    return NOT_BORING_SUMMER_SALADS_RESULTS_TITLE;
  }

  const brief = formatDinnerBrief(query, ingredientIntent);
  if (!brief) return '';

  if (source === 'ready-made') {
    return `${count} ready-made ${count === 1 ? 'option' : 'options'} for ${brief}`;
  }

  if (ingredientIntent?.isIngredientLed) {
    return `${count} ${count === 1 ? 'way' : 'ways'} to cook ${brief}`;
  }

  return `${count} ${count === 1 ? 'option' : 'options'} for ${brief}`;
};

const NOT_BORING_SUMMER_SALADS_SEARCH_TITLE = 'Non-boring summer salads';
const NOT_BORING_SUMMER_SALADS_RESULTS_TITLE = 'Out-of-the-ordinary summer salads';
const NOT_BORING_SUMMER_SALADS_QUERY =
  'unusual summer main course salads with interesting flavour combinations, substantial enough for dinner, fresh, seasonal, under 30 minutes';
const NOT_BORING_SUMMER_SALADS_RESULTS_COPY =
  'Three ways to prepare unusual summer main course salads with interesting flavour combinations, substantial enough for dinner, fresh, seasonal and ready in under 30 minutes.';

const isNotBoringSummerSaladsQuery = (query: string) =>
  [
    NOT_BORING_SUMMER_SALADS_QUERY,
    NOT_BORING_SUMMER_SALADS_SEARCH_TITLE,
    NOT_BORING_SUMMER_SALADS_RESULTS_TITLE
  ]
    .map(value => value.toLowerCase())
    .includes(query.trim().toLowerCase());

interface HomeViewProps {
  // ... (keeping props as they were for compatibility if possible, but adding useAuth internal logic)
  input: string;
  setInput: (val: string) => void;
  lastQuery: string;
  source: 'cook' | 'ready-made';
  setSource: (val: 'cook' | 'ready-made') => void;
  isGenerating: boolean;
  handleGenerate: (queryOverride?: string, paramOverrides?: any, preferencesOverride?: any, options?: { skipHistory?: boolean; force?: boolean; suppressDietaryRule?: boolean }) => Promise<void>;
  handleStopSearch: () => void;
  isSpeechSupported: boolean;
  isListening: boolean;
  toggleVoiceSearch: () => void;
  searchCancelledHint: boolean;
  currentRecipes: any[] | null;
  currentReadyMeals: any[] | null;
  handleLoadMore: () => Promise<any>;
  handleNewSearch: () => void;
  clearResults: () => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  preferencesError?: string | null;
  setPreferencesError: (val: string | null) => void;
  contradictionWarning: any | null;
  isEmptyResults: boolean;
  showInlineSuccess: boolean;
  activeCriteria: any[];
  removeFilter: (type: string, value: string) => void;
  resetSearchFilters: () => void;
  localPreferences: any;
  updateLocalPreference: (key: string, value: any) => void;
  isDietaryRuleSuppressed: boolean;
  setIsDietaryRuleSuppressed: (val: boolean) => void;
  suppressedPermanentKeys: string[];
  setSuppressedPermanentKeys: (val: string[]) => void;
  
  cuisines: string[];
  setCuisines: (val: string[]) => void;
  excludeIngredients: string[];
  setExcludeIngredients: (val: string[]) => void;
  maxTotalTime: string;
  maxHeatingTime: string;
  handleTotalTimeChange: (val: string) => void;
  setMaxHeatingTime: (val: string) => void;
  timeConflict: any;
  servings: string;
  setServings: (val: string) => void;
  cookingMethods: string[];
  setCookingMethods: (val: string[]) => void;
  omitIngredients: string[];
  setOmitIngredients: (val: string[]) => void;
  nutritiousChoice: boolean;
  setNutritiousChoice: (val: boolean) => void;
  highOmega3: boolean;
  setHighOmega3: (val: boolean) => void;
  highProtein: boolean;
  setHighProtein: (val: boolean) => void;
  isSimple: boolean;
  setIsSimple: (val: boolean) => void;
  isLowCost: boolean;
  setIsLowCost: (val: boolean) => void;
  isLeftoverMode: boolean;
  setIsLeftoverMode: (val: boolean) => void;
  supermarkets: string[];
  setSupermarkets: (val: string[]) => void;
  dietaryRule: string;
  setDietaryRule: (val: any) => void;
  saladPreference: 'all' | 'main-only' | 'side-only' | 'none';
  setSaladPreference: (val: 'all' | 'main-only' | 'side-only' | 'none') => void;
  maxCalories: string;
  setMaxCalories: (val: string) => void;
  maxCostPerPortion: string;
  setMaxCostPerPortion: (val: string) => void;
  exclusions: string[];
  setExclusions: (val: string[]) => void;
  styleWellness: string[];
  setStyleWellness: (val: string[]) => void;
  allergies: string[];
  setAllergies: (val: string[]) => void;
  religiousEthical: string[];
  setReligiousEthical: (val: string[]) => void;
  cookingFats: string[];
  setCookingFats: (val: string[]) => void;
  preferredSourceIds: string[];
  setPreferredSourceIds: (val: string[]) => void;
  hasExhaustedSearch: boolean;
  isAppending: boolean;
  setView: (view: any, highlight?: string) => void;
  searchError?: string | null;
  status?: 'idle' | 'searching' | 'partial' | 'complete' | 'noResults' | 'error';
  enriching?: boolean;
  searchStartTime?: number | null;
  filterCount?: number;
  isPreciseSearch?: boolean;
}


export const HomeView: React.FC<HomeViewProps> = (props) => {
  const {
    savedRecipes,
    saveRecipe,
    removeRecipe,
    updatePlanner,
    showToast,
    user,
    profile,
    updateProfile,
    savePreferences,
    accessStatus,
    addLog
  } = useAuth();

  const isReadOnly = accessStatus === 'read_only';

  const {
    input, setInput, lastQuery,
    source, setSource,
    isGenerating, handleGenerate, handleStopSearch,
    isSpeechSupported, isListening, toggleVoiceSearch,
    searchCancelledHint,
    currentRecipes, currentReadyMeals,
    handleLoadMore, handleNewSearch, clearResults,
    showFilters, setShowFilters, preferencesError, setPreferencesError,
    contradictionWarning, isEmptyResults,
    showInlineSuccess,
    activeCriteria, removeFilter, resetSearchFilters,
    localPreferences, updateLocalPreference,
    isDietaryRuleSuppressed, setIsDietaryRuleSuppressed,
    suppressedPermanentKeys, setSuppressedPermanentKeys,
    nutritiousChoice, setNutritiousChoice,
    highOmega3, setHighOmega3,
    highProtein, setHighProtein,
    isSimple, setIsSimple,
    isLowCost, setIsLowCost,
    isLeftoverMode, setIsLeftoverMode,
    supermarkets, setSupermarkets,
    dietaryRule, setDietaryRule,
    saladPreference, setSaladPreference,
    maxCalories, setMaxCalories,
    maxCostPerPortion, setMaxCostPerPortion,
    exclusions, setExclusions,
    styleWellness, setStyleWellness,
    allergies, setAllergies,
    religiousEthical, setReligiousEthical,
    cookingFats, setCookingFats,
    preferredSourceIds, setPreferredSourceIds,
    cuisines, setCuisines,
    excludeIngredients, setExcludeIngredients,
    maxTotalTime, maxHeatingTime, handleTotalTimeChange, setMaxHeatingTime,
    timeConflict,
    servings, setServings,
    cookingMethods, setCookingMethods,
    omitIngredients, setOmitIngredients,
    hasExhaustedSearch, isAppending,
    setView,
    searchError,
    status = 'idle',
    enriching = false,
    searchStartTime = null,
    filterCount = 0,
    isPreciseSearch = false
  } = props;

  const isSearching = status === 'searching';
  const ingredientIntent = React.useMemo(() => detectIngredientIntent(input), [input]);
  const resultsQuery = lastQuery || input;
  const resultsIngredientIntent = React.useMemo(() => detectIngredientIntent(resultsQuery), [resultsQuery]);
  const resultsCount = (source === 'cook' ? currentRecipes?.length : currentReadyMeals?.length) || 0;
  const resultsHeading = React.useMemo(
    () => buildResultsHeading({
      count: resultsCount,
      query: resultsQuery,
      source,
      ingredientIntent: resultsIngredientIntent
    }),
    [resultsCount, resultsQuery, source, resultsIngredientIntent]
  );
  const showNotBoringSummerSaladsResultsCopy =
    source === 'cook' && resultsCount === 3 && isNotBoringSummerSaladsQuery(resultsQuery);
  const hasNearbyRetailers = source === 'ready-made' && supermarkets.length > 0;
  const showFullLoader = isSearching && (!currentRecipes || currentRecipes.length === 0) && (!currentReadyMeals || currentReadyMeals.length === 0);
  const showInlineStatus = (isSearching && !showFullLoader) || enriching;
  const hasPreferenceConflictNotice = !!contradictionWarning && contradictionWarning.type !== 'no_results';
  const dietaryConflictCriterion = React.useMemo(
    () => activeCriteria.find(criterion => criterion.type === 'dietaryRule'),
    [activeCriteria]
  );

  // Stale Results logic for Batch Apply
  const [dirty, setDirty] = React.useState(false);
  const [hasDismissedSearchOnboarding, setHasDismissedSearchOnboarding] = React.useState(() => {
    if (profile && !user?.isAnonymous) return profile.searchOnboardingDismissed === true;
    return safeStorage.getItem('dbd_search_onboarding_dismissed') === 'true';
  });
  const [hasPerformedSearch, setHasPerformedSearch] = React.useState(() => {
    return safeStorage.getItem('dbd_has_searched') === 'true';
  });

  React.useEffect(() => {
    if (profile && !user?.isAnonymous) {
      setHasDismissedSearchOnboarding(profile.searchOnboardingDismissed === true);
    }
  }, [profile?.searchOnboardingDismissed, user?.isAnonymous]);

  const markSearchOnboardingDismissed = React.useCallback(async () => {
    setHasDismissedSearchOnboarding(true);
    safeStorage.setItem('dbd_search_onboarding_dismissed', 'true');

    if (user && !user.isAnonymous && profile?.searchOnboardingDismissed !== true) {
      try {
        await updateProfile({
          searchOnboardingDismissed: true,
          searchOnboardingDismissedAt: new Date() as any
        });
      } catch (err: any) {
        addLog(`ONBOARDING_DISMISS_SAVE_FAIL: ${err?.message || err}`);
      }
    }
  }, [addLog, profile?.searchOnboardingDismissed, updateProfile, user]);

  React.useEffect(() => {
    if (status === 'complete' || status === 'partial') {
      if ((currentRecipes?.length || 0) > 0 || (currentReadyMeals?.length || 0) > 0) {
        setHasPerformedSearch(true);
        safeStorage.setItem('dbd_has_searched', 'true');
      }
    }
  }, [currentRecipes, currentReadyMeals, status]);

  React.useEffect(() => {
    (window as any).showFiltersTrigger = () => setShowFilters(true);
    return () => { delete (window as any).showFiltersTrigger; };
  }, [setShowFilters]);

  React.useEffect(() => {
    if (isSearching) {
      if (!hasDismissedSearchOnboarding) {
        markSearchOnboardingDismissed();
      }
    }
  }, [isSearching, hasDismissedSearchOnboarding, markSearchOnboardingDismissed]);

  // If filterCount >= 3, removing a chip doesn't auto-search.
  // We should show a "Refresh results" button.
  const showRefreshButton = dirty && activeCriteria.length >= 3 && !isSearching;

  React.useEffect(() => {
    // When results change, we are no longer dirty
    if (status === 'complete' || status === 'partial') {
      setDirty(false);
    }
  }, [currentRecipes, currentReadyMeals, status]);

  // If filters change from useSearch and we are in precise mode, we become dirty
  // (Handling this by comparing current lastQuery/activeCriteria with the results)
  // Actually, a simpler way is to just listen for filter count changes if >= 3

  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [compareItems, setCompareItems] = React.useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = React.useState(false);

  const isSaved = (recipe: any) => savedRecipes.some(r => isSameRecipe(r, recipe));
  const isScheduled = (recipe: any) => savedRecipes.some(r => isSameRecipe(r, recipe) && !!r.scheduledDate);

  const isCompareSelected = (item: any) => compareItems.some(compareItem => isSameRecipe(compareItem, item));

  const handleCompareToggle = (item: any) => {
    setCompareItems(prev => {
      if (prev.some(compareItem => isSameRecipe(compareItem, item))) {
        const next = prev.filter(compareItem => !isSameRecipe(compareItem, item));
        if (next.length < 2) setShowCompareModal(false);
        return next;
      }

      const next = prev.length >= 2 ? [prev[1], item] : [...prev, item];
      if (next.length === 2) setShowCompareModal(true);
      return next;
    });
  };

  const handleCompareView = (item: any) => {
    setShowCompareModal(false);
    setSelectedItem(item);
  };

  const handleToggleSaved = async (recipe: any) => {
    if (isReadOnly) {
      showToast("Your trial has ended. Upgrade to save more recipes.", "Upgrade", () => setView('settings'));
      return;
    }
    if (!user || user.isAnonymous) {
      showToast("Sign in to save recipes to your personal cookbook!", "Sign In", () => {
        setView('settings');
      });
      return;
    }
    const existing = savedRecipes.find(r => isSameRecipe(r, recipe));
    try {
      if (existing) {
        await removeRecipe(existing.id!);
        showToast("Recipe removed from saved");
      } else {
        await saveRecipe(recipe);
        window.dispatchEvent(new CustomEvent('pwa-meaningful-action'));
        showToast("Recipe saved!");
      }
    } catch (err: any) {
      addLog?.(`UI ERROR: toggle saved recipe failed: ${err?.message || err}`);
      showToast("Could not update saved status.");
    }
  };

  const handlePlannerUpdate = async (dayId: string, recipe: any) => {
    if (isReadOnly) {
      showToast("Your trial has ended. Upgrade to continue planning.", "Upgrade", () => setView('settings'));
      return;
    }
    try {
      await updatePlanner(dayId, recipe);
      window.dispatchEvent(new CustomEvent('pwa-meaningful-action'));
      showToast(`Scheduled for ${dayId}`);
      setView('planner');
    } catch (err: any) {
      addLog?.(`UI ERROR: updatePlanner failed: ${err?.message || err}`);
      showToast("Could not schedule recipe.");
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const excludeInputRef = useRef<HTMLInputElement>(null);
  const omitInputRef = useRef<HTMLInputElement>(null);

  const handleNotBoringSummerSalads = React.useCallback(() => {
    if (isReadOnly || isSearching) return;

    setInput(NOT_BORING_SUMMER_SALADS_SEARCH_TITLE);
    setShowFilters(false);
    setPreferencesError(null);
    handleGenerate(NOT_BORING_SUMMER_SALADS_QUERY, {
      saladPreference: 'main-only',
      maxTotalTime: 30,
      isSimple: true
    });
  }, [handleGenerate, isReadOnly, isSearching, setInput, setPreferencesError, setShowFilters]);

  const getSavedPreferenceSuppressionKeys = React.useCallback(() => {
    const prefs = profile?.preferences;
    if (!prefs) return [];

    const keys: string[] = [];
    if (prefs.dietaryRule && prefs.dietaryRule !== 'none') keys.push(`dietaryRule-${prefs.dietaryRule}`);
    if (prefs.saladPreference && prefs.saladPreference !== 'all') keys.push(`saladPreference-${prefs.saladPreference}`);
    (prefs.allergies || []).forEach(item => keys.push(`allergy-${item}`));
    (prefs.exclusions || []).forEach(item => keys.push(`profileExclusion-${item}`));
    (prefs.religiousEthical || []).forEach(item => keys.push(`profileReligious-${item}`));
    (prefs.cuisinePreferences || []).forEach(item => keys.push(`profileCuisine-${item}`));
    (prefs.preferredSupermarkets || []).forEach(item => keys.push(`profileSupermarket-${item}`));
    (prefs.cookingMethods || []).forEach(item => keys.push(`profileCookingMethod-${item}`));
    (prefs.cookingFats || []).forEach(item => keys.push(`profileCookingFat-${item}`));
    (prefs.preferredSourceIds || []).forEach(item => keys.push(`profileSource-${item}`));
    if (prefs.isSimple) keys.push('isSimple-true');
    if (prefs.isLowCost) keys.push('isLowCost-true');
    if (prefs.nutritiousChoice) keys.push('nutritiousChoice-true');
    if (prefs.highOmega3) keys.push('highOmega3-true');
    if (prefs.highProtein) keys.push('highProtein-true');
    if (prefs.readyToEatUnderMins) keys.push(`readyToEatUnderMins-${prefs.readyToEatUnderMins}`);
    if (prefs.calorieCeiling) keys.push(`maxCalories-${prefs.calorieCeiling}`);
    if (prefs.budgetLimit) keys.push(`budgetLimit-${prefs.budgetLimit}`);
    if (prefs.servings && prefs.servings !== 2) keys.push(`servings-${prefs.servings}`);

    return [...new Set(keys)];
  }, [profile?.preferences]);

  const handleReset = async () => {
    const staleSavedPreferenceKeys = getSavedPreferenceSuppressionKeys();

    setCuisines([]);
    setExclusions([]);
    setReligiousEthical([]);
    setStyleWellness([]);
    setExcludeIngredients([]);
    setOmitIngredients([]);
    setMaxCalories('');
    handleTotalTimeChange('');
    setMaxHeatingTime('');
    setMaxCostPerPortion('');
    setSupermarkets([]);
    setCookingMethods([]);
    setCookingFats([]);
    setDietaryRule('none');
    setSaladPreference('all');
    setNutritiousChoice(false);
    setHighOmega3(false);
    setHighProtein(false);
    setIsSimple(false);
    setIsLowCost(false);
    setAllergies([]);
    setPreferredSourceIds([]);
    setServings('2');
    setIsDietaryRuleSuppressed(false);
    setSuppressedPermanentKeys(staleSavedPreferenceKeys);
    if (excludeInputRef.current) excludeInputRef.current.value = '';
    if (omitInputRef.current) omitInputRef.current.value = '';

    if (user && !user.isAnonymous) {
      try {
        await savePreferences(normaliseUserPreferences(null));
        setPreferencesError(null);
      } catch (err: any) {
        addLog?.(`UI ERROR: clear saved preferences failed: ${err?.message || err}`);
        setPreferencesError("Could not clear saved preferences. Please try again.");
        return;
      }
    }

    setShowFilters(false);
  };

  const handleSaveFilters = () => {
    // Commit pending inputs if any
    const excludeVal = excludeInputRef.current?.value.trim();
    let finalExclude = [...excludeIngredients];
    if (excludeVal && !excludeIngredients.includes(excludeVal)) {
      finalExclude = [...excludeIngredients, excludeVal];
      setExcludeIngredients(finalExclude);
      if (excludeInputRef.current) excludeInputRef.current.value = '';
    }

    const omitVal = omitInputRef.current?.value.trim();
    let finalOmit = [...omitIngredients];
    if (omitVal && !omitIngredients.includes(omitVal)) {
      finalOmit = [...omitIngredients, omitVal];
      setOmitIngredients(finalOmit);
      if (omitInputRef.current) omitInputRef.current.value = '';
    }

    setShowFilters(false);
    
    // Always trigger handleGenerate when applying from overlay if we have a state to search for
    if (input.trim() || currentRecipes || currentReadyMeals) {
      handleGenerate();
    }
  };

  return (
    <motion.div 
      key="home"
      onViewportEnter={() => console.log('[HomeView] Mounted')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
        {/* Search Section */}
      <div className="w-full flex flex-col relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full bg-gray-50 -z-10" />
        
        <div className="flex flex-col">
          <div className="w-full max-w-4xl mx-auto space-y-4 my-2">
            {/* Row 1: Segmented Controls */}
            <div className="flex items-center justify-center pb-1">
              <SearchHeader 
                source={source}
                setSource={setSource}
                isDietaryRuleSuppressed={isDietaryRuleSuppressed}
                suppressedPermanentKeys={suppressedPermanentKeys}
                clearSuppression={() => {
                  setIsDietaryRuleSuppressed(false);
                  setSuppressedPermanentKeys([]);
                  handleGenerate();
                }}
              />
            </div>

            {/* Row 2: Main Input Field and Preferences control on the side */}
            <div className="flex flex-col gap-3 relative w-full">
              <div className="flex gap-2 items-center w-full">
                <div className="flex-grow min-w-0">
                  <SearchInput 
                    input={input}
                    setInput={setInput}
                    onClear={clearResults}
                    isGenerating={isSearching}
                    handleGenerate={(q, p, pref) => {
                      console.log('[HomeView] handleGenerate triggered via input');
                      setShowFilters(false);
                      handleGenerate(q, p, pref);
                    }}
                    handleStopSearch={handleStopSearch}
                    isSpeechSupported={isSpeechSupported}
                    isListening={isListening}
                    toggleVoiceSearch={toggleVoiceSearch}
                    source={source}
                    inputRef={searchInputRef}
                    isLeftoverMode={isLeftoverMode}
                    isLowCost={isLowCost}
                    isReadOnly={isReadOnly}
                  />
                </div>
                <Tooltip text="Open Preferences to set dietary rules, portions, budget, calorie targets, nearby retailers and ingredients to exclude." position="bottom" align="right" maxWidth="max-w-[260px]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters(true);
                      setPreferencesError(null);
                    }}
                    className={`flex items-center justify-center gap-2 px-3 h-11 rounded border text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shrink-0 ${
                      showFilters
                        ? 'bg-gray-100 border-gray-400 text-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    aria-label="Open search preferences"
                    title="Open search preferences"
                  >
                    <Settings className="w-4.5 h-4.5" />
                    <span className="hidden sm:inline text-[12px] font-bold font-ibm-plex-mono uppercase tracking-wider">
                      Preferences
                    </span>
                  </button>
                </Tooltip>
              </div>

              {source === 'ready-made' && (
                <div className={`${isSpeechSupported ? 'pl-[42px]' : 'pl-[12px]'} pr-4`}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters(true);
                      setPreferencesError(null);
                    }}
                    className="text-left text-[11.5px] text-gray-400 hover:text-gray-700 leading-relaxed font-semibold transition-colors"
                  >
                    {hasNearbyRetailers
                      ? `Prioritising nearby retailers: ${supermarkets.slice(0, 3).join(', ')}${supermarkets.length > 3 ? '...' : ''}. Change this in Preferences.`
                      : 'Want more useful Ready-made results? Add nearby retailers in Preferences.'}
                  </button>
                </div>
              )}

              {source === 'cook' && (
                <div className={`${isSpeechSupported ? 'pl-[42px]' : 'pl-[12px]'} pr-4`}>
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleNotBoringSummerSalads}
                      disabled={isReadOnly || isSearching}
                      className="text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="block text-[12px] font-normal leading-snug text-dbd-accent">
                        {NOT_BORING_SUMMER_SALADS_SEARCH_TITLE}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] font-normal leading-relaxed text-gray-500">
                        Fresh, substantial salads with interesting flavour combinations.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNotBoringSummerSalads}
                      disabled={isReadOnly || isSearching}
                      className="self-start text-[11px] font-normal text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300 sm:self-auto"
                    >
                      Find options
                    </button>
                  </div>
                </div>
              )}
              
              {(!hasPerformedSearch || !hasDismissedSearchOnboarding) && !currentRecipes?.length && !currentReadyMeals?.length && (
                <div className="w-full select-none animate-fade-in flex flex-col gap-4">
                  {!hasDismissedSearchOnboarding && !isSearching && (
                    <SearchOnboardingHelper 
                      onSuggestionSelect={(suggestion) => {
                        setInput(suggestion);
                        searchInputRef.current?.focus();
                      }}
                      onDismiss={() => {
                        markSearchOnboardingDismissed();
                      }} 
                    />
                  )}
                  
                  {(hasDismissedSearchOnboarding || isSearching) && (
                    <div className={`${isSpeechSupported ? 'pl-[42px]' : 'pl-[12px]'} pr-4`}>
                      <p className="text-[12px] text-gray-400 leading-relaxed font-semibold">
                        {source === 'cook' 
                          ? "Search by ingredient, cuisine, chef or phrase — e.g. 'Low cost recipes'."
                          : "Search for ready-made dinners from shops you can easily use."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <SearchStatusRow 
              status={status}
              enriching={enriching}
              filterCount={filterCount}
              source={source}
              startTime={searchStartTime}
              activeCriteria={activeCriteria}
              query={input}
              ingredientIntent={ingredientIntent}
            />

            {(hasPerformedSearch || isSearching || (currentRecipes && currentRecipes.length > 0) || (currentReadyMeals && currentReadyMeals.length > 0)) && (
              <RecipeListActions 
                onTryAgain={((source === 'cook' ? currentRecipes : currentReadyMeals) || isSearching || isAppending) ? handleLoadMore : undefined}
                onNewSearch={((source === 'cook' ? currentRecipes : currentReadyMeals) || isSearching || isAppending) ? handleNewSearch : undefined}
                isGenerating={isSearching || isAppending}
                totalCount={(source === 'cook' ? currentRecipes?.length : currentReadyMeals?.length) || 0}
                isSuppressed={isDietaryRuleSuppressed || suppressedPermanentKeys.length > 0}
                source={source}
                isLeftoverMode={isLeftoverMode}
                setIsLeftoverMode={setIsLeftoverMode}
                isLowCost={isLowCost}
                setIsLowCost={!localPreferences.isLowCost ? (val) => {
                  console.log('[HomeView] setIsLowCost clicked:', val);
                  setIsLowCost(val);
                  if (input || currentRecipes || currentReadyMeals) {
                    handleGenerate(undefined, { isLowCost: val });
                  }
                } : undefined}
                onNavigateToSettings={() => setView('settings')}
              >
                <div className="space-y-4 min-w-0 w-full">
                  {showRefreshButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleGenerate()}
                      className="w-full py-2 bg-accent text-white rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent/20 animate-pulse mt-2"
                    >
                      <Search className="w-3.5 h-3.5" strokeWidth={3} />
                      Apply changes to results
                    </motion.button>
                  )}

                  {activeCriteria.length > 0 && (
                    <CriteriaChips 
                      activeCriteria={activeCriteria}
                      removeFilter={(t, v) => {
                        removeFilter(t, v);
                      }}
                      onNavigateToSettings={() => setView('settings')}
                    />
                  )}

                  {/* Trusted Sources Summary Link */}
                  {(localPreferences?.preferredSourceIds || []).length > 0 && (
                    <button 
                      onClick={() => setView('settings')}
                      className="group flex flex-wrap items-center gap-1.5 px-0.5 py-1 opacity-70 hover:opacity-100 transition-opacity text-left"
                    >
                      <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Trusted sources:</span>
                      <span className="text-[10.5px] font-bold text-gray-600 leading-tight">
                        {(() => {
                          const selected = PREFERRED_SOURCES.filter(s => localPreferences?.preferredSourceIds?.includes(s.id));
                          const labels = selected.map(s => s.label);
                          if (labels.length <= 3) return labels.join(', ');
                          return `${labels.slice(0, 3).join(', ')} +${labels.length - 3} more`;
                        })()}
                      </span>
                      <ChevronRight size={10} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </RecipeListActions>
            )}

            <AnimatePresence>
              {searchCancelledHint && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2 mb-2"
                >
                  <Info className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-500 font-medium">Search cancelled – showing your last results.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {contradictionWarning && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 sm:px-4 py-3 border rounded-lg"
                style={{ 
                  backgroundColor: contradictionWarning.colors?.bg || '#F7F5F1',
                  borderColor: contradictionWarning.colors?.border || '#E5E0D8'
                }}
              >
                <div 
                  className="text-[12px] leading-relaxed" 
                  style={{ 
                    color: contradictionWarning.colors?.text || '#5E554A' 
                  }}
                >
                  {contradictionWarning.content}
                </div>
              </motion.div>
            )}
          </div>

        <AnimatePresence>
          {showInlineSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="bg-[#F9FAF9] border border-[#E9EFE9] text-[#2D3E2D] px-3 py-2 rounded-lg flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="w-4 h-4 rounded-full bg-white border border-[#DCE4DC] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-[#4D664D]" strokeWidth={4} />
                </div>
                <span className="text-[12px] font-semibold tracking-tight">Defaults saved</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFilters && (
            <FilterOverlay 
              key="filter-overlay"
              onClose={() => setShowFilters(false)}
              onSave={handleSaveFilters}
              onReset={handleReset}
              source={source}
              maxCalories={maxCalories}
              setMaxCalories={setMaxCalories}
              maxTotalTime={maxTotalTime}
              handleTotalTimeChange={handleTotalTimeChange}
              maxHeatingTime={maxHeatingTime}
              setMaxHeatingTime={setMaxHeatingTime}
              maxCostPerPortion={maxCostPerPortion}
              setMaxCostPerPortion={setMaxCostPerPortion}
              cuisines={cuisines}
              setCuisines={setCuisines}
              cookingMethods={cookingMethods}
              setCookingMethods={setCookingMethods}
              nutritiousChoice={nutritiousChoice}
              setNutritiousChoice={setNutritiousChoice}
              highOmega3={highOmega3}
              setHighOmega3={setHighOmega3}
              highProtein={highProtein}
              setHighProtein={setHighProtein}
              isSimple={isSimple}
              setIsSimple={setIsSimple}
              isLowCost={isLowCost}
              setIsLowCost={setIsLowCost}
              supermarkets={supermarkets}
              setSupermarkets={setSupermarkets}
              dietaryRule={dietaryRule}
              setDietaryRule={setDietaryRule}
              saladPreference={saladPreference}
              setSaladPreference={setSaladPreference}
              servings={servings}
              setServings={setServings}
              allergies={allergies}
              setAllergies={setAllergies}
              religiousEthical={religiousEthical}
              setReligiousEthical={setReligiousEthical}
              cookingFats={cookingFats}
              setCookingFats={setCookingFats}
              preferredSourceIds={preferredSourceIds}
              setPreferredSourceIds={setPreferredSourceIds}
              isDietaryRuleSuppressed={isDietaryRuleSuppressed}
              suppressedPermanentKeys={suppressedPermanentKeys}
              clearSuppression={() => {
                setIsDietaryRuleSuppressed(false);
                setSuppressedPermanentKeys([]);
                handleGenerate();
              }}
              excludeInputRef={excludeInputRef}
              omitInputRef={omitInputRef}
              excludeIngredients={excludeIngredients}
              setExcludeIngredients={setExcludeIngredients}
              omitIngredients={omitIngredients}
              setOmitIngredients={setOmitIngredients}
            />
          )}
        </AnimatePresence>
      </div>
    </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {/* Search Error UI - Only show if no results exist */}
        {searchError && !isGenerating && !isAppending && !currentRecipes?.length && !currentReadyMeals?.length && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">
              Recipe search is unavailable right now.
            </h3>
            <p className="text-[13px] text-gray-500 mx-auto mb-6 max-w-sm leading-relaxed px-4">
              {searchError || "Please try again in a moment or simplify your query."}
            </p>
            <button 
              onClick={() => handleGenerate()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-[13px] font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
            >
              Try Search Again
            </button>
            
            {window.location.search.includes('debug=true') && (
              <details className="mt-8 text-[11px] text-gray-400 group text-center">
                <summary className="cursor-pointer hover:text-gray-600 transition-colors uppercase tracking-widest font-bold">Debug logs</summary>
                <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-100 max-w-xs mx-auto break-words text-left font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {searchError}
                </div>
              </details>
            )}
          </motion.div>
        )}

        {status === 'noResults' && !searchError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-4 text-center h-full w-full"
          >
            {!input ? (
              <div className="space-y-6 w-full max-w-xl mx-auto py-2">
                {(!user || user.isAnonymous === true) && (
                  <SearchExamples 
                    onSelect={(val) => {
                      setShowFilters(false);
                      setInput(val);
                      handleGenerate(val);
                    }}
                    isLoading={isSearching}
                    mode={source}
                  />
                )}

                <div className="space-y-1 py-4">
                  <p className="text-[14px] font-bold text-gray-900">Find exactly what to cook — and everything you need to buy.</p>
                  <p className="text-[12.5px] text-gray-500">Tell us what you have and we'll return a choice of recipes you can actually cook</p>
                </div>
              </div>
            ) : (
              <div className={`space-y-4 px-4 sm:px-6 max-w-xl mx-auto w-full ${hasPreferenceConflictNotice ? 'py-4' : 'py-8'}`}>
                {!hasPreferenceConflictNotice && (
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                
                {!hasPreferenceConflictNotice && (
                  <div className="space-y-1.5">
                    <h3 className="text-[16px] font-bold text-gray-900">No recipes match all selected preferences.</h3>
                    <p className="text-[13px] text-gray-500 mx-auto leading-relaxed font-medium">
                      Try removing one or two preferences to broaden the search.
                    </p>
                  </div>
                )}

                {activeCriteria.length > 0 && (
                  <div className="pt-2 flex flex-col gap-3 max-w-sm mx-auto w-full">
                    {!hasPreferenceConflictNotice && (
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {activeCriteria.slice(0, 8).map((criterion) => (
                          <span
                            key={`${criterion.type}-${criterion.value}`}
                            className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider"
                          >
                            {criterion.label}
                          </span>
                        ))}
                        {activeCriteria.length > 8 && (
                          <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            +{activeCriteria.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                    {hasPreferenceConflictNotice && dietaryConflictCriterion && (
                      <button
                        onClick={() => {
                          setIsDietaryRuleSuppressed(true);
                          handleGenerate(undefined, {}, undefined, { force: true, suppressDietaryRule: true });
                        }}
                        className="w-full py-3 bg-dbd-accent text-white rounded text-[12px] font-bold uppercase tracking-widest hover:bg-dbd-accent-mid transition-all shadow-md"
                      >
                        Search anyway
                      </button>
                    )}
                    {contradictionWarning?.type === 'conflict' && !dietaryConflictCriterion && (
                      <button
                        onClick={() => handleGenerate(undefined, {}, undefined, { force: true })}
                        className="w-full py-3 bg-dbd-accent text-white rounded text-[12px] font-bold uppercase tracking-widest hover:bg-dbd-accent-mid transition-all shadow-md"
                      >
                        Search anyway
                      </button>
                    )}
                    {!hasPreferenceConflictNotice && (
                      <button
                        onClick={handleReset}
                        className="w-full py-3 bg-gray-900 text-white rounded text-[12px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
                      >
                        Clear all preferences
                      </button>
                    )}
                    <button 
                      onClick={() => setShowFilters(true)}
                      className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded text-[12px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                      Edit preferences
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {(source === 'cook' ? (currentRecipes && currentRecipes.length > 0) : (currentReadyMeals && currentReadyMeals.length > 0)) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5 sm:space-y-3 pb-16 bg-transparent max-w-4xl mx-auto w-full"
          >
            {resultsHeading && (
              <div className="border-b border-dbd-rule/60 px-3 pb-2 sm:px-4 sm:pb-2.5">
                <h2 className="text-[13px] sm:text-[15px] font-bold text-dbd-ink tracking-tight leading-snug">
                  {resultsHeading}
                </h2>
                {showNotBoringSummerSaladsResultsCopy && (
                  <p className="mt-1 text-[12px] font-normal leading-relaxed text-gray-500">
                    {NOT_BORING_SUMMER_SALADS_RESULTS_COPY}
                  </p>
                )}
              </div>
            )}

            {compareItems.length > 0 && (
              <div className="bg-white border border-gray-100 rounded px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-dbd-accent">Compare</p>
                  <p className="text-[12px] text-gray-500 font-medium truncate">
                    {compareItems.length === 1
                      ? 'Select one more recipe to compare.'
                      : compareItems.map(item => item.title).join(' vs ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={compareItems.length < 2}
                    onClick={() => setShowCompareModal(true)}
                    className="h-8 px-3 rounded bg-gray-900 text-white disabled:bg-gray-200 disabled:text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCompareItems([]);
                      setShowCompareModal(false);
                    }}
                    className="h-8 px-3 rounded bg-white text-gray-400 hover:text-gray-700 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {source === 'cook' ? (
              currentRecipes?.map((recipe, idx) => (
                <CompactRecipeItem 
                  key={recipe.id || `compact-recipe-${idx}`}
                  item={recipe}
                  source="cook"
                  onClick={() => setSelectedItem(recipe)}
                  onCompare={() => handleCompareToggle(recipe)}
                  isCompareSelected={isCompareSelected(recipe)}
                />
              ))
            ) : (
              currentReadyMeals?.map((meal, idx) => (
                <CompactRecipeItem 
                  key={meal.id || `compact-meal-${idx}`}
                  item={meal}
                  source="ready-made"
                  onClick={() => setSelectedItem(meal)}
                  onCompare={() => handleCompareToggle(meal)}
                  isCompareSelected={isCompareSelected(meal)}
                />
              ))
            )}

            {hasExhaustedSearch && (
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg space-y-2 mt-2 sm:mt-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">No more matching dinners found</p>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed pl-6">
                  Try broadening your search term or loosening some of your permanent preferences in Settings.
                </p>
              </div>
            )}             {((currentRecipes?.length || 0) + (currentReadyMeals?.length || 0) > 0) && (
              <div className="flex flex-row gap-1.5 sm:gap-3 pt-0.5 sm:pt-4">
                {!hasExhaustedSearch && (
                  <button 
                    onClick={() => handleLoadMore()}
                    disabled={isGenerating || isAppending}
                    className="flex-1 min-w-0 px-2 py-2.5 sm:py-3 bg-white border border-gray-100 rounded text-[9px] sm:text-[10px] font-semibold text-accent uppercase tracking-[0.14em] sm:tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {(isGenerating || isAppending) && <Loader2 className="w-3 h-3 animate-spin" />}
                    More choices, please
                  </button>
                )}
                <button 
                  onClick={handleNewSearch}
                  disabled={isGenerating || isAppending}
                  className="flex-1 min-w-0 px-2 py-2.5 sm:py-3 bg-white border border-gray-100 rounded text-[9px] sm:text-[10px] font-semibold text-gray-400 hover:text-gray-600 hover:border-gray-200 uppercase tracking-[0.14em] sm:tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Close & New Search
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompareModal && compareItems.length === 2 && (
          <RecipeCompareModal
            items={compareItems}
            onClose={() => setShowCompareModal(false)}
            onView={handleCompareView}
            onRemove={(item) => {
              setCompareItems(prev => prev.filter(compareItem => !isSameRecipe(compareItem, item)));
              setShowCompareModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <RecipeDetailOverlay 
            item={selectedItem}
            isSaved={isSaved(selectedItem)}
            isScheduled={isScheduled(selectedItem)}
            onClose={() => setSelectedItem(null)}
            onToggleSaved={() => handleToggleSaved(selectedItem)}
            onPlannerUpdate={(dayId) => handlePlannerUpdate(dayId, selectedItem)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
