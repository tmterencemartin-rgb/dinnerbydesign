import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { serverTimestamp } from 'firebase/firestore';
import { 
  ChevronLeft, 
  CircleX, 
  ArrowUpCircle, 
  Trash, 
  Search, 
  History, 
  Beef,
  Wind,
  Settings,
  Lock,
  ChevronRight,
  ChevronDown,
  List,
  LayoutGrid,
  Clock,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Recipe, ReadyMeal, SavedRecipe } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { RetailerCtaLink } from '../RetailerCtaLink';
import { SavedRecipeItem } from '../SavedRecipeItem';
import { passesHardConstraints, passesDietaryRule } from '../../lib/dietarySafety';
import { buildSearchParams, checkSearchMatch, cleanSearchParams } from '../../lib/searchUtils';
import { getConvenienceProfile } from '../../lib/recipeUtils';
import { buildSupermarketPlanSummary } from '../../lib/shoppingUtils';
import { calculateActiveIngredientsCost } from '../../services/groceryService';

interface PlannerViewProps {
  setView: (view: any) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ setView }) => {
  const { 
    profile, 
    planner, 
    savedRecipes, 
    updatePlanner, 
    saveRecipe,
    unscheduleRecipe, 
    removeRecipe,
    clearPlannerWeek, 
    addLog,
    handlePrintRecipe,
    showToast,
    updateRecipe,
    user,
    accessStatus,
    shoppingList
  } = useAuth();

  const isReadOnly = accessStatus === 'read_only';

  const [viewingPlannerEntry, setViewingPlannerEntry] = useState<SavedRecipe | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedIngredients({});
  }, [viewingPlannerEntry?.id, viewingPlannerEntry?.title]);

  const parseIngredient = (ing: string) => {
    const cleanIng = ing.replace(/^[•\-\*\s\.\(\)]+/, '').trim();
    const match = cleanIng.match(/^([\d\/\.\s\-½⅓¼¾]+(?:(?:oz|g|kg|ml|l|tbsp|tsp|cups?|slices?|pcs|pieces?|cans?|pots?|cloves?|stalks?|tins?|bunches?|sprigs?)\b)?)?(.*)$/i);
    if (match) {
      const qtyUnit = (match[1] || '').trim();
      const name = match[2].trim();
      if (qtyUnit) {
        return { qtyUnit, name };
      }
    }
    return { qtyUnit: '', name: cleanIng };
  };

  // Handle enrichment for the detail view
  useEffect(() => {
    const filteredIngredients = (viewingPlannerEntry?.ingredients || [])
      .filter((ing: string) => ing && ing.trim().length > 0);

    const lacksData = viewingPlannerEntry && (
      (viewingPlannerEntry.mode === 'cook' && (!viewingPlannerEntry.instructions?.length || filteredIngredients.length < 3)) ||
      (viewingPlannerEntry.mode === 'ready-made' && !viewingPlannerEntry.servingSuggestion)
    );

    if (viewingPlannerEntry && lacksData && !isEnriching) {
      setIsEnriching(true);
      import('../../services/geminiService').then(({ enrichRecipe }) => {
        enrichRecipe(viewingPlannerEntry.title, viewingPlannerEntry.cuisine || '', viewingPlannerEntry.mode)
          .then(data => {
            const updated = { ...viewingPlannerEntry, ...data };
            setViewingPlannerEntry(updated);
            setIsEnriching(false);
            if (viewingPlannerEntry.id) {
              updateRecipe(viewingPlannerEntry.id, data).catch(console.error);
            }
          })
          .catch(err => {
            console.error("Detail enrichment failed:", err);
            setIsEnriching(false);
          });
      }).catch(err => {
        console.error("Failed to dynamically import geminiService module:", err);
        setIsEnriching(false);
      });
    }
  }, [viewingPlannerEntry, isEnriching, updateRecipe]);
  const [showClearWeekConfirm, setShowClearWeekConfirm] = useState(false);
  const [showDeleteAllSavedConfirm, setShowDeleteAllSavedConfirm] = useState(false);
  const [targetPlannerDay, setTargetPlannerDay] = useState<string | null>(null);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedSortBy, setSavedSortBy] = useState<'newest' | 'oldest' | 'name' | 'quickest' | 'lowest-cost'>('newest');
  const [convenienceFilter, setConvenienceFilter] = useState<'all' | 'scratch' | 'convenience'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [quickPills, setQuickPills] = useState({
    under20: false,
    budget: false,
    healthy: false,
    batch: false,
  });
  const [hasExhaustedSaved, setHasExhaustedSaved] = useState(false);
  const [savedDisplayOffset, setSavedDisplayOffset] = useState(0);
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showPlanWeek, setShowPlanWeek] = useState(false);
  const [showAllSwapOptions, setShowAllSwapOptions] = useState(false);
  const [planDinnerCount, setPlanDinnerCount] = useState<3 | 5 | 7>(5);
  const [planBudget, setPlanBudget] = useState('40');
  const [planServings, setPlanServings] = useState(profile?.preferences?.servings || 2);
  const [planProtein, setPlanProtein] = useState('mixed');
  const [planTime, setPlanTime] = useState<'any' | 'quick' | 'under30'>('any');
  const [planHomemadeCount, setPlanHomemadeCount] = useState<number>(5);
  const [planAlert, setPlanAlert] = useState<string | null>(null);
  const [isPlanningWeek, setIsPlanningWeek] = useState(false);

  useEffect(() => {
    setPlanServings(profile?.preferences?.servings || 2);
  }, [profile?.preferences?.servings]);

  useEffect(() => {
    setPlanAlert(null);
  }, [planDinnerCount, planBudget, planServings, planProtein, planTime, planHomemadeCount]);

  useEffect(() => {
    setPlanHomemadeCount(prev => Math.min(prev, planDinnerCount));
  }, [planDinnerCount]);

  useEffect(() => {
    setHasExhaustedSaved(false);
    setSavedDisplayOffset(0);
  }, [
    savedSearchQuery,
    quickPills,
    convenienceFilter
  ]);

  const handleResetFilters = () => {
    setSavedSearchQuery('');
    setQuickPills({
      under20: false,
      budget: false,
      healthy: false,
      batch: false,
    });
    setSavedSortBy('newest');
    setConvenienceFilter('all');
  };

  const parseCost = (recipe: SavedRecipe): number => {
    const costStr = recipe.costPerPortion || recipe.price || '';
    const match = costStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const getRecipeTime = (recipe: SavedRecipe): number => {
    return recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);
  };

  const activeSavedRecipes = React.useMemo(
    () => savedRecipes.filter(r => !r.isArchived),
    [savedRecipes]
  );
  const activeUnscheduledSavedCount = React.useMemo(
    () => activeSavedRecipes.filter(item => !item.scheduledDate).length,
    [activeSavedRecipes]
  );

  const filteredSavedRecipes = React.useMemo(() => {
    const activePrefs = profile?.preferences;
    const unscheduled = activeSavedRecipes.filter(r => !r.scheduledDate);
    
    let processed = unscheduled.filter(recipe => {
      // 0. Hard Constraints (Dietary, Allergies, Exclusions, Calories, Budget)
      if (activePrefs) {
        const safetyPrefs = {
          dietaryRule: activePrefs.dietaryRule || 'none',
          allergies: activePrefs.allergies || [],
          exclusions: activePrefs.exclusions || [],
          religiousEthical: activePrefs.religiousEthical || [],
          calorieCeiling: activePrefs.calorieCeiling,
          budgetLimit: activePrefs.budgetLimit
        };
        if (!passesHardConstraints(recipe, safetyPrefs)) return false;
      }

      // 1. Search Query Match
      if (savedSearchQuery) {
        const matchesSearch = checkSearchMatch(recipe, savedSearchQuery);
        if (!matchesSearch) return false;
      }

      // 2. Quick Pills (Mood Toggles)
      if (quickPills.under20) {
        const time = getRecipeTime(recipe);
        if (!time || time > 20) return false;
      }
      if (quickPills.budget) {
        const cost = parseCost(recipe);
        if (cost === 0 || cost >= 5) return false;
      }
      if (quickPills.healthy) {
        const kcal = recipe.caloriesPerPortion || recipe.calories || 0;
        const isHealthy = recipe.isNutritious || (kcal > 0 && kcal < 500);
        if (!isHealthy) return false;
      }
      if (quickPills.batch) {
        if (!recipe.batchCooking?.suitable) return false;
      }

      // 3. Convenience Profile Segment Filter
      if (convenienceFilter !== 'all') {
        const itemProfile = recipe.convenienceProfile || getConvenienceProfile(recipe);
        if (itemProfile !== convenienceFilter) return false;
      }

      return true;
    });

    processed.sort((a, b) => {
      if (savedSortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (savedSortBy === 'quickest') {
        const timeA = getRecipeTime(a) || Number.MAX_SAFE_INTEGER;
        const timeB = getRecipeTime(b) || Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      }
      if (savedSortBy === 'lowest-cost') {
        const costA = parseCost(a) || Number.MAX_SAFE_INTEGER;
        const costB = parseCost(b) || Number.MAX_SAFE_INTEGER;
        return costA - costB;
      }
      
      const timeA = (a.savedAt as any)?.seconds || 0;
      const timeB = (b.savedAt as any)?.seconds || 0;
      if (savedSortBy === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA;
    });

    return processed;
  }, [
    activeSavedRecipes,
    profile?.preferences,
    savedSearchQuery,
    quickPills,
    savedSortBy,
    convenienceFilter
  ]);

  const hasActiveSavedFilters = convenienceFilter !== 'all' || Object.values(quickPills).some(Boolean);

  const source = profile?.preferences?.preferredMode || 'cook';
  const supermarketPlanSummary = React.useMemo(
    () => buildSupermarketPlanSummary(planner, profile?.preferences?.preferredSupermarkets || []),
    [planner, profile?.preferences?.preferredSupermarkets]
  );
  const supermarketLabel = supermarketPlanSummary.preferredSupermarkets.length > 0
    ? supermarketPlanSummary.preferredSupermarkets.join(', ')
    : 'your usual supermarket';
  const activeShoppingListTotal = React.useMemo(
    () => calculateActiveIngredientsCost(shoppingList.filter(item => !item.inStock && !item.checked)),
    [shoppingList]
  );
  const costSavingSwaps = React.useMemo(() => {
    const scheduled = planner.filter(item => !!item.scheduledDate);
    const unscheduledSaved = activeSavedRecipes.filter(item => !item.scheduledDate);
    const activePrefs = profile?.preferences;
    const safetyPrefs = activePrefs ? {
      dietaryRule: activePrefs.dietaryRule || 'none',
      allergies: activePrefs.allergies || [],
      exclusions: activePrefs.exclusions || [],
      religiousEthical: activePrefs.religiousEthical || [],
      calorieCeiling: activePrefs.calorieCeiling,
      budgetLimit: activePrefs.budgetLimit
    } : null;
    const totalCost = (item: SavedRecipe) => {
      const costStr = item.costPerPortion || item.price || '';
      const match = costStr.match(/[\d.]+/);
      const perPortion = match ? parseFloat(match[0]) : 0;
      const servings = item.requestedServings || profile?.preferences?.servings || item.totalServings || 1;
      return perPortion * servings;
    };

    const swaps: Array<{
      scheduled: SavedRecipe;
      replacement: SavedRecipe;
      saving: number;
    }> = [];

    scheduled.forEach(current => {
      const currentCost = totalCost(current);
      if (currentCost <= 0) return;

      unscheduledSaved.forEach(candidate => {
        if (safetyPrefs && !passesHardConstraints(candidate, safetyPrefs)) return;
        const candidateCost = totalCost(candidate);
        const saving = currentCost - candidateCost;
        if (candidateCost <= 0 || saving < 1) return;
        swaps.push({ scheduled: current, replacement: candidate, saving });
      });
    });

    return swaps
      .sort((a, b) => b.saving - a.saving)
      .slice(0, 5);
  }, [planner, activeSavedRecipes, profile?.preferences]);
  const bestCostSavingSwap = costSavingSwaps[0] || null;
  const additionalCostSavingSwaps = costSavingSwaps.slice(1);

  useEffect(() => {
    setShowAllSwapOptions(false);
  }, [bestCostSavingSwap?.scheduled.id, bestCostSavingSwap?.replacement.id, costSavingSwaps.length]);

  const checkReadOnly = (msg: string) => {
    if (isReadOnly) {
      showToast(msg, "Upgrade", () => setView('settings'));
      return true;
    }
    return false;
  };

  const handlePlanWeek = async () => {
    if (checkReadOnly("Your trial has ended. Upgrade to plan your week.")) return;
    if (!user) {
      showToast("Sign in to create a weekly plan.", "Sign In", () => setView('settings'));
      return;
    }

    setPlanAlert(null);
    setIsPlanningWeek(true);
    try {
      const servingsCount = planServings;
      const budgetValue = Number(planBudget);
      const perPortionBudget = Number.isFinite(budgetValue) && budgetValue > 0
        ? Number((budgetValue / planDinnerCount / servingsCount).toFixed(2))
        : undefined;
      const shouldApplyLowCostBias = perPortionBudget !== undefined && perPortionBudget <= 2;
      const proteinText = planProtein === 'mixed' ? 'mixed proteins' : planProtein;
      const timeText = planTime === 'quick'
        ? 'quick dinners'
        : planTime === 'under30'
          ? 'dinners under 30 minutes'
          : 'varied dinners';
      const weeklySaladPreference = profile?.preferences?.saladPreference === 'main-only' ? 'main-only' : 'all';
      const homemadeTarget = Math.min(planHomemadeCount, planDinnerCount);
      const readyMadeTarget = Math.max(planDinnerCount - homemadeTarget, 0);
      const makeParams = (query: string, sourceMode: 'cook' | 'ready-made', count: number, excludedTitles: string[]) => cleanSearchParams(buildSearchParams(query, sourceMode, profile?.preferences || null, {
        count,
        servings: servingsCount,
        saladPreference: weeklySaladPreference,
        maxCostPerPortion: perPortionBudget,
        maxTotalTime: planTime === 'under30' ? 30 : undefined,
        isSimple: planTime === 'quick' ? true : undefined,
        isLowCost: shouldApplyLowCostBias,
        excludeTitles: excludedTitles
      }));

      const { generateDinnerSuggestions } = await import('../../services/geminiService');
      const homemadeItems: Recipe[] = [];
      const readyMadeItems: ReadyMeal[] = [];
      const addCandidates = <T extends Recipe | ReadyMeal>(items: T[], target: T[], targetCount: number) => {
        for (const item of items) {
          const titleKey = item.title.toLowerCase();
          if (!seenTitles.has(titleKey) && target.length < targetCount) {
            target.push(item);
            seenTitles.add(titleKey);
          }
        }
      };
      const seenTitles = new Set<string>();

      try {
        const query = `${homemadeTarget} cooked dinners for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}`;
        const params = makeParams(query, 'cook', homemadeTarget, planner.map(item => item.title));
        const result = await generateDinnerSuggestions(params, profile?.preferences || undefined);
        addCandidates((result.recipes || []) as Recipe[], homemadeItems, homemadeTarget);
      } catch (err: any) {
        addLog(`UI WARN: weekly batch generation failed, trying focused searches: ${err?.message || err}`);
      }

      if (readyMadeTarget > 0) {
        try {
          const readyQuery = `${readyMadeTarget} UK supermarket ready-made dinner products for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}`;
          const readyParams = makeParams(readyQuery, 'ready-made', readyMadeTarget, [...planner.map(item => item.title), ...homemadeItems.map(item => item.title)]);
          const readyResult = await generateDinnerSuggestions(readyParams, profile?.preferences || undefined);
          addCandidates((readyResult.readyMeals || []) as ReadyMeal[], readyMadeItems, readyMadeTarget);
        } catch (err: any) {
          addLog(`UI WARN: weekly ready-made generation failed: ${err?.message || err}`);
        }
      }

      const baseExcludedTitles = [...planner.map(item => item.title), ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)];
      const dietaryRule = profile?.preferences?.dietaryRule || 'none';
      const fallbackProteins = (() => {
        if (planProtein !== 'mixed') return Array(planDinnerCount).fill(planProtein);
        if (dietaryRule === 'vegetarian') return ['vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian'];
        if (dietaryRule === 'vegan') return ['vegan', 'vegan', 'vegan', 'vegan', 'vegan', 'vegan', 'vegan'];
        return ['chicken', 'fish', 'vegetarian', 'pork', 'beef', 'pulses', 'turkey'];
      })();

      for (let i = homemadeItems.length; i < homemadeTarget; i += 1) {
        const fallbackProtein = fallbackProteins[i % fallbackProteins.length];
        const fallbackQuery = `${planTime === 'under30' ? 'under 30 minute' : planTime === 'quick' ? 'quick' : 'weekday'} cooked ${fallbackProtein} dinner for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}`;
        const fallbackParams = makeParams(fallbackQuery, 'cook', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

        try {
          const fallbackResult = await generateDinnerSuggestions(fallbackParams, profile?.preferences || undefined);
          addCandidates((fallbackResult.recipes || []) as Recipe[], homemadeItems, homemadeTarget);
        } catch (err: any) {
          addLog(`UI WARN: weekly fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
        }
      }

      for (let i = readyMadeItems.length; i < readyMadeTarget; i += 1) {
        const fallbackProtein = fallbackProteins[(homemadeTarget + i) % fallbackProteins.length];
        const fallbackQuery = `${planTime === 'under30' ? 'under 30 minute' : planTime === 'quick' ? 'quick' : 'weekday'} UK supermarket ready-made ${fallbackProtein} dinner product for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}`;
        const fallbackParams = makeParams(fallbackQuery, 'ready-made', 1, [...baseExcludedTitles, ...homemadeItems.map(item => item.title), ...readyMadeItems.map(item => item.title)]);

        try {
          const fallbackResult = await generateDinnerSuggestions(fallbackParams, profile?.preferences || undefined);
          addCandidates((fallbackResult.readyMeals || []) as ReadyMeal[], readyMadeItems, readyMadeTarget);
        } catch (err: any) {
          addLog(`UI WARN: weekly ready-made fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
        }
      }

      const recipes = [...homemadeItems, ...readyMadeItems].slice(0, planDinnerCount);
      if (recipes.length === 0) {
        setPlanAlert("No weekly dinners found within that budget. Try increasing the weekly budget, reducing the number of dinners, or choosing a different protein.");
        return;
      }

      for (const recipe of recipes) {
        await saveRecipe(recipe);
      }

      if (recipes.length < planDinnerCount) {
        setPlanAlert(`Only ${recipes.length} suitable ${recipes.length === 1 ? 'dinner was' : 'dinners were'} found. Try increasing the budget, reducing the number of dinners, or changing the protein.`);
        showToast(`Added ${recipes.length} ${recipes.length === 1 ? 'dinner' : 'dinners'} to Saved.`);
        return;
      }

      showToast(`Added ${recipes.length} ${recipes.length === 1 ? 'dinner' : 'dinners'} to Saved.`);
      setPlanAlert(null);
      setShowPlanWeek(false);
    } catch (err: any) {
      addLog(`UI ERROR: handlePlanWeek failed: ${err?.message || err}`);
      setPlanAlert("Could not create weekly dinners from those settings. Please try again, or loosen one of the requirements.");
    } finally {
      setIsPlanningWeek(false);
    }
  };

  const handleDeleteSavedRecipe = async (recipe: SavedRecipe) => {
    if (checkReadOnly("Your trial has ended. Upgrade to edit your collection.")) return;
    addLog(`UI ACTION: archiveSavedRecipe START for ${recipe.id}`);
    if (!recipe.id) return;
    
    try {
      await updateRecipe(recipe.id, { isArchived: true, archivedAt: serverTimestamp() });
      addLog(`UI ACTION: archiveSavedRecipe SUCCESS for ${recipe.id}`);
      showToast("Archived from Saved");
    } catch (err: any) {
      addLog(`UI ERROR: archiveSavedRecipe failed for ${recipe.id}: ${err.message}`);
    }
  };

  return (
    <motion.div 
      key="planner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      <div className="space-y-4 -mt-4">
        {viewingPlannerEntry ? (
          <div className="space-y-6 overflow-visible pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setViewingPlannerEntry(null)}
                className="flex items-center gap-1 text-[13px] font-normal text-accent hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 -ml-1" />
                <span>Back to Schedule</span>
              </button>
              <button 
                onClick={() => setViewingPlannerEntry(null)}
                className="p-1 px-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                title="Close"
              >
                <CircleX size={16} />
              </button>
            </div>
            
            <div className="px-4 space-y-4">
              <div className="space-y-4">
                <div className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  {viewingPlannerEntry.scheduledDate}
                </div>
                <h2 className="text-[15px] font-medium text-gray-900 leading-tight">
                  {viewingPlannerEntry.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400 font-normal mt-1.5 mb-4">
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {viewingPlannerEntry.mode === 'ready-made' ? 'Ready-made dish' : 'Active Cook'}
                  </span>
                  {(() => {
                    const parts: React.ReactNode[] = [];
                    
                    const calories = viewingPlannerEntry.caloriesPerPortion || viewingPlannerEntry.calories;
                    if (calories) {
                      parts.push(<span key="cal">{calories} kcal pp</span>);
                    }
                    
                    const priceVal = viewingPlannerEntry.costPerPortion || viewingPlannerEntry.price;
                    if (priceVal) {
                      parts.push(<span key="price">{priceVal} pp</span>);
                    }
                    
                    if (viewingPlannerEntry.requestedServings) {
                      parts.push(<span key="servings">{viewingPlannerEntry.requestedServings} portions</span>);
                    }
                    
                    if (viewingPlannerEntry.mode === 'ready-made' && viewingPlannerEntry.retailer) {
                      parts.push(<span key="retailer">{viewingPlannerEntry.retailer}</span>);
                    }
                    
                    if (viewingPlannerEntry.totalTime) {
                      parts.push(<span key="time">{viewingPlannerEntry.totalTime} mins total</span>);
                    }
                    
                    if (viewingPlannerEntry.isAirFryerFriendly) {
                      parts.push(
                        <span key="airfryer" className="text-accent font-medium uppercase tracking-wider inline-flex items-center gap-0.5 text-[10px]">
                          <Wind className="w-2.5 h-2.5" /> Air Fryer
                        </span>
                      );
                    }
                    
                    if (viewingPlannerEntry.sourceUrl && !viewingPlannerEntry.sourceUrl.includes('recipe-search')) {
                      parts.push(
                        <span key="source" className="text-gray-500 font-bold uppercase tracking-wider text-[10.5px]">
                          {viewingPlannerEntry.sourceUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                        </span>
                      );
                    }
                    
                    return parts.reduce<React.ReactNode[]>((acc, item, index) => {
                      if (index > 0) {
                        acc.push(<span key={`dot-${index}`} className="text-gray-300 font-bold">•</span>);
                      }
                      acc.push(item);
                      return acc;
                    }, []);
                  })()}
                </div>
              </div>

              {viewingPlannerEntry.description && (
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-2xl">
                  {viewingPlannerEntry.description}
                </p>
              )}

              <RetailerCtaLink product={viewingPlannerEntry} type={viewingPlannerEntry.mode} />

              {(viewingPlannerEntry.ingredients || isEnriching) && viewingPlannerEntry.mode !== 'ready-made' && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <h3 className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 font-sans">Ingredients</h3>
                  {isEnriching && !viewingPlannerEntry.ingredients?.length ? (
                    <p className="text-[14px] text-gray-400 animate-pulse">Sourcing ingredients...</p>
                  ) : (
                    <ul className="space-y-0">
                      {viewingPlannerEntry.ingredients?.filter(ing => ing && ing.trim().length > 0).map((ing, i) => {
                        const parsed = parseIngredient(ing);
                        const itemKey = `${viewingPlannerEntry.id || viewingPlannerEntry.title}-${i}`;
                        const isChecked = !!checkedIngredients[itemKey];
                        return (
                          <li 
                            key={itemKey} 
                            className={`flex items-center gap-2.5 py-1.5 border-b border-gray-100/60 text-sm select-none transition-all duration-150 ${
                              isChecked ? 'opacity-40 line-through' : 'text-gray-700'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => setCheckedIngredients(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))}
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-gray-300 cursor-pointer" 
                            />
                            <p className="text-gray-600">
                              {parsed.qtyUnit ? (
                                <>
                                  <span className="font-semibold text-gray-800">{parsed.qtyUnit}</span>{' '}
                                  {parsed.name}
                                </>
                              ) : (
                                ing
                              )}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {(viewingPlannerEntry.instructions || isEnriching) && viewingPlannerEntry.mode !== 'ready-made' && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h3 className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 font-sans">Method</h3>
                  {isEnriching && !viewingPlannerEntry.instructions?.length ? (
                    <p className="text-[14px] text-gray-400 animate-pulse">Sourcing instructions...</p>
                  ) : (
                    <div className="space-y-0">
                      {viewingPlannerEntry.instructions?.map((step, i) => (
                        <div key={`${viewingPlannerEntry.id || viewingPlannerEntry.title}-step-${i}`} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 mb-3 last:mb-0">
                          <div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {viewingPlannerEntry.servingSuggestion && (
                <div className="space-y-1.5 pt-4 border-t border-gray-100">
                  <h3 className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 font-sans">Serving Suggestion</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed max-w-2xl italic">
                    {viewingPlannerEntry.servingSuggestion}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1 pt-4 sm:pt-5">
              <div className="flex justify-between items-center">
                <button 
                  id="back-to-search-btn"
                  onClick={() => setView('home')} 
                  className="flex items-center gap-1 text-[13px] font-normal text-accent hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft id="back-chevron" className="w-4 h-4 -ml-1" />
                  <span id="back-text">Back to search</span>
                </button>
              </div>

              <div className="flex flex-col items-center pb-2 pt-0 space-y-2">
                <h2 className="text-[20px] font-bold text-gray-900 text-center">Save & Schedule</h2>
                <p className="text-[12px] text-gray-400 font-medium text-center max-w-md">
                  {(!user || user.isAnonymous) 
                    ? "Keep track of your weekly dinners and browse your temporary collection below."
                    : "Schedule your dinners, browse your saved collection, and build your shopping list for the week ahead."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded border border-gray-100 px-4 sm:px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-[13.5px] font-bold text-gray-950">Plan my week</h3>
                  <p className="text-[11.5px] text-gray-400 font-medium leading-relaxed">
                    Create several dinners at once, with budget, protein and time preferences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlanWeek(prev => !prev)}
                  className="h-9 px-4 rounded bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0"
                >
                  {showPlanWeek ? 'Close' : 'Create weekly dinners'}
                </button>
              </div>

              {showPlanWeek && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dinners</span>
                      <select
                        value={planDinnerCount}
                        onChange={(e) => setPlanDinnerCount(Number(e.target.value) as 3 | 5 | 7)}
                        className="w-full h-10 bg-gray-50 border border-gray-100 rounded px-3 text-[12px] font-semibold text-gray-700 outline-none"
                      >
                        <option value={3}>3 dinners</option>
                        <option value={5}>5 dinners</option>
                        <option value={7}>7 dinners</option>
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Serves</span>
                      <select
                        value={planServings}
                        onChange={(e) => setPlanServings(Number(e.target.value))}
                        className="w-full h-10 bg-gray-50 border border-gray-100 rounded px-3 text-[12px] font-semibold text-gray-700 outline-none"
                      >
                        <option value={1}>1 person</option>
                        <option value={2}>2 people</option>
                        <option value={3}>3 people</option>
                        <option value={4}>4 people</option>
                        <option value={5}>5 people</option>
                        <option value={6}>6 people</option>
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Weekly budget</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">£</span>
                        <input
                          value={planBudget}
                          onChange={(e) => setPlanBudget(e.target.value)}
                          inputMode="decimal"
                          className="w-full h-10 bg-gray-50 border border-gray-100 rounded pl-7 pr-3 text-[12px] font-semibold text-gray-700 outline-none"
                        />
                      </div>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Protein</span>
                      <select
                        value={planProtein}
                        onChange={(e) => setPlanProtein(e.target.value)}
                        className="w-full h-10 bg-gray-50 border border-gray-100 rounded px-3 text-[12px] font-semibold text-gray-700 outline-none"
                      >
                        <option value="mixed">Mixed</option>
                        <option value="chicken">Chicken</option>
                        <option value="fish">Fish</option>
                        <option value="beef">Beef</option>
                        <option value="pork">Pork</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</span>
                      <select
                        value={planTime}
                        onChange={(e) => setPlanTime(e.target.value as 'any' | 'quick' | 'under30')}
                        className="w-full h-10 bg-gray-50 border border-gray-100 rounded px-3 text-[12px] font-semibold text-gray-700 outline-none"
                      >
                        <option value="any">Any</option>
                        <option value="quick">Quick</option>
                        <option value="under30">Under 30 mins</option>
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Homemade/Ready-made</span>
                      <select
                        value={planHomemadeCount}
                        onChange={(e) => setPlanHomemadeCount(Number(e.target.value))}
                        className="w-full h-10 bg-gray-50 border border-gray-100 rounded px-3 text-[12px] font-semibold text-gray-700 outline-none"
                      >
                        {Array.from({ length: planDinnerCount + 1 }, (_, value) => (
                          <option key={value} value={value}>
                            {value} homemade {value === 1 ? 'dinner' : 'dinners'}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                      {Number(planBudget) > 0
                        ? `Plans ${planDinnerCount} dinners for ${planServings} ${planServings === 1 ? 'person' : 'people'}: about £${(Number(planBudget) / planDinnerCount).toFixed(2)} per dinner, or £${(Number(planBudget) / planDinnerCount / planServings).toFixed(2)} per person.`
                        : `Plans ${planDinnerCount} dinners for ${planServings} ${planServings === 1 ? 'person' : 'people'}.`}
                      {' '}Includes {planHomemadeCount} homemade {planHomemadeCount === 1 ? 'dinner' : 'dinners'} and {planDinnerCount - planHomemadeCount} ready-made {planDinnerCount - planHomemadeCount === 1 ? 'dinner' : 'dinners'}. Results are added to Saved so you can schedule them yourself.
                    </p>
                    <button
                      type="button"
                      onClick={handlePlanWeek}
                      disabled={isPlanningWeek}
                      className="h-10 px-4 rounded bg-dbd-accent text-white text-[11px] font-bold uppercase tracking-widest hover:bg-dbd-accent-mid disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isPlanningWeek && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Create plan
                    </button>
                  </div>
                  {isPlanningWeek && (
                    <div className="text-[11px] text-gray-500 leading-relaxed bg-gray-50/70 border border-gray-100 px-3 py-2">
                      <span className="font-semibold text-gray-700">Creating your weekly dinners...</span>{' '}
                      This takes a moment because we're building several suitable options at once.
                    </div>
                  )}
                  {planAlert && !isPlanningWeek && (
                    <div className="text-[11px] text-amber-900 leading-relaxed bg-amber-50 border border-amber-100 px-3 py-2">
                      {planAlert}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Unified Save & Schedule Panel */}
            <div className="mt-0 bg-white rounded border border-gray-100 overflow-hidden flex flex-col">
              {/* Panel Content - Single scrollable flow */}
              <div className="px-1 sm:px-3.5 py-3 sm:py-5 space-y-5">
                
                {/* SECTION 1: SAVED (BACKLOG) */}
                <div className="space-y-1.5 relative z-20">
                  {/* SAVED HEADER ROW */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Saved</h3>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12px] text-gray-400 font-medium">{filteredSavedRecipes.length} items</span>
                      {user && !user.isAnonymous && activeSavedRecipes.length > 0 && (
                        <div className="flex items-center gap-2">
                          {showDeleteAllSavedConfirm ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Archive all?</span>
                              <button 
                                onClick={async () => {
                                  if (checkReadOnly("Your trial has ended. Upgrade to edit your collection.")) return;
                                  try {
                                    await Promise.all(
                                      activeSavedRecipes
                                        .filter(r => !r.scheduledDate && r.id)
                                        .map(r => updateRecipe(r.id!, { isArchived: true, archivedAt: serverTimestamp() }))
                                    );
                                  } catch (err) {
                                    addLog(`UI ERROR: archive all saved failed: ${err instanceof Error ? err.message : String(err)}`);
                                  } finally {
                                    setShowDeleteAllSavedConfirm(false);
                                  }
                                }}
                                className="text-[11px] text-accent font-bold hover:underline"
                              >
                                Yes
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowDeleteAllSavedConfirm(true)}
                              className="text-[10.5px] font-bold text-accent uppercase tracking-widest hover:underline"
                            >
                              Archive list
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeSavedRecipes.length === 0 ? (
                    <div className="w-full py-6 px-4 text-center max-w-md mx-auto bg-white/50">
                      <h5 className="font-semibold text-gray-900 mb-1 font-display text-[14px] tracking-tight">Nothing saved yet</h5>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4 max-w-sm mx-auto">
                        Save dinners from Search, then schedule them here.
                      </p>
                      <button 
                        onClick={() => setView('home')}
                        className="uppercase tracking-widest text-[10px] font-bold bg-gray-900 text-white px-4 py-2 rounded hover:bg-black transition-all inline-block cursor-pointer"
                      >
                        Find recipes
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Search and Organize Controls - Integrated Header */}
                      <div className="bg-gray-50/40 border-b border-gray-100 px-1.5 py-0.5 sm:px-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 h-auto">
                          {/* Left: Search Bar */}
                          <div className="relative w-full sm:max-w-[340px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input 
                              type="text"
                              value={savedSearchQuery}
                              onChange={(e) => setSavedSearchQuery(e.target.value)}
                              placeholder="Search saved dinners..."
                              className="w-full h-6 bg-white border border-gray-100 rounded pl-8 pr-8 text-xs font-medium outline-none focus:border-accent/40 transition-all"
                            />
                            {savedSearchQuery && (
                              <button 
                                onClick={() => setSavedSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <CircleX size={14} />
                              </button>
                            )}
                          </div>

                          {/* Right: Unified Controls */}
                          <div className="flex items-center gap-1 self-start sm:self-auto h-6 relative">
                            {/* 1. Filters Dropdown */}
                            <div className="relative">
                              <button 
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className={`text-[11px] font-semibold h-6 px-1.5 rounded border transition-all flex items-center gap-1 cursor-pointer select-none ${
                                  isFilterDropdownOpen || hasActiveSavedFilters
                                    ? 'border-accent bg-accent/5 text-accent'
                                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                <Settings className="w-3.5 h-3.5" />
                                <span>Filters</span>
                                {hasActiveSavedFilters && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                )}
                                <span className="text-gray-400 text-[10px] ml-0.5">▼</span>
                              </button>

                              {isFilterDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsFilterDropdownOpen(false)} />
                                  <div className="absolute left-0 md:left-auto md:right-0 top-full mt-1.5 w-56 bg-white border border-gray-100 rounded shadow-md p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1 text-left">COOKING STYLE</div>
                                    <div className="space-y-1">
                                      <label className="flex items-center gap-2 px-1.5 py-1 hover:bg-gray-50 rounded cursor-pointer text-xs font-medium text-gray-700 select-none">
                                        <input type="checkbox" checked={convenienceFilter === 'scratch'} onChange={() => setConvenienceFilter(prev => prev === 'scratch' ? 'all' : 'scratch')} className="rounded border-gray-300 text-accent h-3.5 w-3.5 cursor-pointer" />
                                        <span>🍳 Homemade</span>
                                      </label>
                                      <label className="flex items-center gap-2 px-1.5 py-1 hover:bg-gray-50 rounded cursor-pointer text-xs font-medium text-gray-700 select-none">
                                        <input type="checkbox" checked={convenienceFilter === 'convenience'} onChange={() => setConvenienceFilter(prev => prev === 'convenience' ? 'all' : 'convenience')} className="rounded border-gray-300 text-accent h-3.5 w-3.5 cursor-pointer" />
                                        <span>📦 Ready-made</span>
                                      </label>
                                    </div>
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <div className="mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1 text-left">QUICK MOODS</div>
                                    <div className="space-y-1">
                                      {[
                                        {id: 'under20', label: '⏱️ Under 20 min'},
                                        {id: 'budget', label: '💰 Budget (<£5)'},
                                        {id: 'healthy', label: '🥗 Healthy (<500kcal)'},
                                        {id: 'batch', label: 'Batch-friendly'}
                                      ].map(pill => (
                                        <label key={pill.id} className="flex items-center gap-2 px-1.5 py-1 hover:bg-gray-50 rounded cursor-pointer text-xs font-medium text-gray-700 select-none">
                                          <input type="checkbox" checked={quickPills[pill.id as keyof typeof quickPills]} onChange={() => setQuickPills(p => ({ ...p, [pill.id]: !p[pill.id as keyof typeof quickPills] }))} className="rounded border-gray-300 text-accent h-3.5 w-3.5 cursor-pointer" />
                                          <span>{pill.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                    {hasActiveSavedFilters && (
                                      <>
                                        <div className="border-t border-gray-100 my-1.5"></div>
                                        <button onClick={(e) => { e.stopPropagation(); handleResetFilters(); }} className="w-full text-center py-1 text-[10.5px] font-semibold text-accent hover:bg-accent/5 rounded-md transition-colors cursor-pointer">Reset Filters</button>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* 2. Sort Dropdown */}
                            <div className="flex items-center gap-1 px-1.5 bg-white hover:bg-gray-50 rounded border border-gray-100 h-6 transition-colors">
                              <History className="w-3.5 h-3.5 text-gray-400" />
                              <select value={savedSortBy} onChange={(e) => setSavedSortBy(e.target.value as any)} className="bg-transparent text-[11px] font-bold text-gray-500 outline-none cursor-pointer py-0.5 pr-0.5">
                                <option value="newest">Newest Added</option>
                                <option value="oldest">Oldest Added</option>
                                <option value="name">Alphabetical (A-Z)</option>
                                <option value="quickest">Quickest first</option>
                                <option value="lowest-cost">Lowest cost first</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const isFiltering = !!(savedSearchQuery || hasActiveSavedFilters);
                        const processed = filteredSavedRecipes;

                        return (
                          <div className="pt-1.5 bg-transparent">
                            <div id="saved-recipes-list">
                              {processed.length === 0 && activeSavedRecipes.length > 0 ? (
                                <div className="py-5 text-center bg-gray-50/50 mx-1 my-1">
                                  <p className="text-[12px] text-gray-950 font-medium">No saved dinners match this view.</p>
                                  <button onClick={handleResetFilters} className="text-[11px] text-accent font-bold hover:underline mt-1 inline-block cursor-pointer">Show all saved dinners</button>
                                </div>
                              ) : (
                                (() => {
                                  const displayed = isFiltering ? processed.slice(savedDisplayOffset, savedDisplayOffset + 6) : (showAllSaved ? processed : processed.slice(0, 6));
                                  return (
                                    <>
                                      <div className="divide-y divide-gray-50 w-full">
                                        {displayed.map(recipe => (
                                          <SavedRecipeItem 
                                            key={recipe.id} 
                                            recipe={recipe} 
                                            layoutMode="list"
                                            isBacklog={true}
                                            onRemove={() => handleDeleteSavedRecipe(recipe)}
                                            onPlannerAdd={() => setViewingPlannerEntry(null)}
                                            onViewDetail={setViewingPlannerEntry}
                                          />
                                        ))}
                                      </div>

                                      {isFiltering && processed.length > 0 && (
                                        <div className="p-3 border-t border-gray-50">
                                          {hasExhaustedSaved || savedDisplayOffset + 6 >= processed.length ? (
                                            <div className="p-2 bg-gray-50/50 rounded-md text-center">
                                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">End of results</p>
                                            </div>
                                          ) : (
                                            <button 
                                              onClick={() => {
                                                const nextOffset = savedDisplayOffset + 6;
                                                if (nextOffset < processed.length) setSavedDisplayOffset(nextOffset);
                                                else setHasExhaustedSaved(true);
                                              }}
                                              className="w-full py-2 text-[11px] font-bold text-accent uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                              More choices
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()
                              )}
                            </div>
                        
                            {activeSavedRecipes.length > 6 && !isFiltering && (
                              <div className="flex justify-center py-3 border-t border-gray-50 mt-1">
                                <button onClick={() => setShowAllSaved(!showAllSaved)} className="text-[11px] text-accent font-bold uppercase tracking-widest hover:underline cursor-pointer">
                                  {showAllSaved ? 'Show less' : 'View all saved dinners'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* SECTION 2: SCHEDULED (WEEKLY PLAN) */}
                <div className="space-y-6 relative z-10">
                  {/* SCHEDULED HEADER ROW */}
                  <div className="flex flex-col gap-2 border-b border-gray-100 pb-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Scheduled</h3>
                      {planner.length > 0 && (
                        <div className="flex items-center justify-end gap-2 min-w-0">
                          {showClearWeekConfirm ? (
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Are you sure?</span>
                              <button 
                                onClick={async () => {
                                  if (checkReadOnly("Your trial has ended. Upgrade to continue planning.")) return;
                                  try {
                                    await clearPlannerWeek();
                                  } catch (err) {
                                    addLog(`UI ERROR: clearPlannerWeek failed: ${err instanceof Error ? err.message : String(err)}`);
                                  } finally {
                                    setShowClearWeekConfirm(false);
                                  }
                                }}
                                className="text-[11px] text-accent font-bold hover:underline"
                              >
                                Yes
                              </button>
                              <button 
                                onClick={() => setShowClearWeekConfirm(false)}
                                className="text-[11px] text-gray-500 hover:text-gray-600 font-medium"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowClearWeekConfirm(true)}
                              className="text-[11px] font-bold text-accent uppercase tracking-widest hover:underline"
                            >
                              clear schedule
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 pl-1">
                      <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
                        {Math.min(planner.length, 7)}/7 days filled
                      </span>
                      <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
                        {planner.length} {planner.length === 1 ? 'item' : 'items'} planned
                      </span>
                    </div>
                    {planner.length > 0 && (
                      <div className="pl-1 pt-1">
                        <div className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between ${
                          bestCostSavingSwap ? 'text-emerald-900' : 'text-gray-600'
                        }`}>
                          <div className="min-w-0">
                            <p className={`text-[11px] font-bold uppercase tracking-widest ${
                              bestCostSavingSwap ? 'text-emerald-800' : 'text-gray-500'
                            }`}>
                              {bestCostSavingSwap
                                ? costSavingSwaps.length === 1
                                  ? 'Cost-saving swap found'
                                  : `${costSavingSwaps.length} cost-saving swaps found`
                                : 'Cost-saving swap check'}
                            </p>
                            {bestCostSavingSwap ? (
                              <>
                                <p className="mt-1 text-[12px] leading-relaxed">
                                  Best option: swap <span className="font-semibold">{bestCostSavingSwap.scheduled.title}</span> for <span className="font-semibold">{bestCostSavingSwap.replacement.title}</span> and save about £{bestCostSavingSwap.saving.toFixed(2)}.
                                </p>
                                <p className="mt-1 text-[11px] text-emerald-800/80 leading-relaxed">
                                  Found in saved dinners that are not already scheduled, fit your preferences, and reduce this week's cost by at least £1.
                                </p>
                                {additionalCostSavingSwaps.length > 0 && (
                                  <div className="mt-2 space-y-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setShowAllSwapOptions(prev => !prev)}
                                      className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 hover:underline"
                                    >
                                      {showAllSwapOptions ? 'Hide other swaps' : `Show ${additionalCostSavingSwaps.length} other ${additionalCostSavingSwaps.length === 1 ? 'swap' : 'swaps'}`}
                                    </button>
                                    {showAllSwapOptions && (
                                      <div className="space-y-1.5">
                                        {additionalCostSavingSwaps.map(option => (
                                          <div key={`${option.scheduled.id || option.scheduled.title}-${option.replacement.id || option.replacement.title}`} className="flex flex-col gap-1 border-b border-emerald-100 px-0 py-1.5 sm:rounded sm:border sm:px-2 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-[11px] text-emerald-900 leading-relaxed">
                                              Swap <span className="font-semibold">{option.scheduled.title}</span> for <span className="font-semibold">{option.replacement.title}</span> and save about £{option.saving.toFixed(2)}.
                                            </p>
                                            {option.scheduled.scheduledDate && (
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  if (checkReadOnly("Your trial has ended. Upgrade to swap scheduled dinners.")) return;
                                                  const day = option.scheduled.scheduledDate;
                                                  if (!day) return;
                                                  await updatePlanner(day, option.replacement);
                                                  showToast(`Swapped ${day} dinner.`);
                                                }}
                                                className="h-7 px-2.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shrink-0"
                                              >
                                                Swap
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <p className="mt-1 text-[12px] text-gray-600 leading-relaxed">
                                  Helps keep costs down by checking unscheduled saved dinners against this week.
                                </p>
                                <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                                  Looks for clear cost data, a match with your preferences, and a saving of at least £1.
                                  {activeUnscheduledSavedCount > 0
                                    ? ' Nothing cheaper found right now.'
                                    : ' Save more dinners to give it options to compare.'}
                                </p>
                              </>
                            )}
                          </div>
                          {bestCostSavingSwap?.scheduled.scheduledDate && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (checkReadOnly("Your trial has ended. Upgrade to swap scheduled dinners.")) return;
                                const day = bestCostSavingSwap.scheduled.scheduledDate;
                                if (!day) return;
                                await updatePlanner(day, bestCostSavingSwap.replacement);
                                showToast(`Swapped ${day} dinner.`);
                              }}
                              className="h-8 px-3 rounded bg-emerald-700 text-white text-[10.5px] font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shrink-0"
                            >
                              Swap dinner
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WEEKLY SCHEDULE GRID */}
                  <div id="weekly-schedule-list" className="divide-y divide-gray-50 px-0">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(dayId => {
                      const entry = planner.find(e => e.scheduledDate === dayId);
                      const dayLabel = dayId.slice(0, 3).toUpperCase();
                      return (
                        <div key={dayId} className="relative py-2 px-0 sm:px-1.5 flex items-start gap-2 sm:gap-3 group min-h-[48px] transition-colors hover:bg-gray-50/50">
                          <div className="w-12 shrink-0 flex items-start justify-start pt-[2px]">
                            <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase text-[10px] font-semibold tracking-wider block">
                              {dayLabel}
                            </span>
                          </div>
                          
                          <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-0">
                            <div 
                              className={`min-w-0 transition-opacity ${entry ? 'cursor-pointer hover:opacity-85' : ''}`}
                              onClick={() => {
                                if (entry) {
                                  setViewingPlannerEntry(entry);
                                }
                              }}
                            >
                              {entry ? (
                                <div className="space-y-0.5">
                                  <h4 className="text-[13.5px] font-bold text-gray-900 truncate pr-4">{entry.title}</h4>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10.5px] font-bold text-accent uppercase tracking-wider">{entry.cuisine || 'Dinner'}</span>
                                    {entry.price && <span className="text-[10px] text-gray-400 font-medium">• {entry.price} pp</span>}
                                    {entry.totalTime && <span className="text-[10px] text-gray-400 font-medium">• {entry.totalTime} mins</span>}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-[13px] text-gray-400 font-medium">Nothing scheduled yet</span>
                                  {targetPlannerDay === dayId && (
                                    <p className="text-[11px] text-accent font-semibold mt-1 animate-in fade-in slide-in-from-top-1">Select a recipe below to schedule for {dayId}...</p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {entry ? (
                                <div className="flex items-center gap-1.5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePrintRecipe(entry);
                                    }}
                                    className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-accent rounded transition-colors"
                                    title="Print"
                                  >
                                    <List size={14} />
                                  </button>
                                  <button 
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (checkReadOnly("Your trial has ended. Upgrade to continue planning.")) return;
                                      if (entry.id) {
                                        try {
                                          await unscheduleRecipe(entry.id);
                                        } catch (err: any) {
                                          addLog(`UI ERROR: unscheduleRecipe failed: ${err?.message || err}`);
                                        }
                                      }
                                    }}
                                    className="p-1.5 bg-gray-50 hover:bg-accent/5 text-gray-400 hover:text-accent rounded transition-colors"
                                    title="Move to Saved"
                                  >
                                    <ArrowUpCircle size={14} />
                                  </button>
                                  <button 
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (checkReadOnly("Your trial has ended. Upgrade to edit your collection.")) return;
                                      if (entry.id) {
                                        try {
                                          await removeRecipe(entry.id);
                                        } catch (err: any) {
                                          addLog(`UI ERROR: removeRecipe failed: ${err?.message || err}`);
                                        }
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-gray-300 font-medium uppercase tracking-wider">Open</span>
                              )}
                            </div>

                            {targetPlannerDay === dayId && (
                              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded shadow-md p-3 min-w-0 sm:min-w-[240px]">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Choose from Saved</span>
                                  <button onClick={() => setTargetPlannerDay(null)}><CircleX size={12} /></button>
                                </div>
                                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                  {savedRecipes
                                    .filter(r => {
                                      if (r.scheduledDate) return false;
                                      const prefs = profile?.preferences;
                                      if (!prefs) return true;
                                      const safetyPrefs = {
                                        dietaryRule: prefs.dietaryRule || 'none',
                                        allergies: prefs.allergies || [],
                                        exclusions: prefs.exclusions || [],
                                        religiousEthical: prefs.religiousEthical || [],
                                        calorieCeiling: prefs.calorieCeiling,
                                        budgetLimit: prefs.budgetLimit
                                      };
                                      return passesHardConstraints(r, safetyPrefs);
                                    })
                                    .length === 0 ? (
                                    <p className="text-[12px] text-gray-500 py-2">No compliant unscheduled recipes yet.</p>
                                  ) : (
                                    savedRecipes
                                      .filter(r => {
                                        if (r.scheduledDate) return false;
                                        const prefs = profile?.preferences;
                                        if (!prefs) return true;
                                        const safetyPrefs = {
                                          dietaryRule: prefs.dietaryRule || 'none',
                                          allergies: prefs.allergies || [],
                                          exclusions: prefs.exclusions || [],
                                          religiousEthical: prefs.religiousEthical || [],
                                          calorieCeiling: prefs.calorieCeiling,
                                          budgetLimit: prefs.budgetLimit
                                        };
                                        return passesHardConstraints(r, safetyPrefs);
                                      })
                                      .map(recipe => (
                                      <button 
                                        key={recipe.id}
                                        onClick={() => {
                                          updatePlanner(dayId, recipe).catch(err => {
                                            addLog(`UI ERROR: New updatePlanner failed: ${err.message || String(err)}`);
                                          });
                                          setTargetPlannerDay(null);
                                        }}
                                        className="w-full text-left px-2 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50 rounded transition-colors truncate"
                                      >
                                        {recipe.title}
                                      </button>
                                    ))
                                  )}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-50">
                                  <button 
                                    onClick={() => {
                                      setTargetPlannerDay(null);
                                      setView('home');
                                    }}
                                    className="w-full text-center text-[12px] text-accent font-medium hover:underline"
                                  >
                                    Search for new recipe
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {supermarketPlanSummary.plannedDinnerCount > 0 && (
                    <div className="border border-gray-100 bg-white rounded px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.025)]">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div className="min-w-0 max-w-2xl">
                          <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-widest">
                            Weekly shop check
                          </h4>
                          <p className="mt-2 text-[14px] sm:text-[15px] font-bold text-gray-900 leading-snug">
                            Based on your scheduled dinners.
                          </p>
                          <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                            {activeShoppingListTotal > 0
                              ? `Your Shopping List currently estimates about £${activeShoppingListTotal.toFixed(2)} for this plan.`
                              : 'Build the Shopping List to see what this week is likely to cost.'}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                            Saved dinners are not included until you schedule them. Prices are based on {supermarketLabel} where available and may vary by pack size and retailer.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setView('shopping')}
                            className="h-9 px-3 rounded bg-gray-900 text-white text-[10.5px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
                          >
                            View shopping list
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
