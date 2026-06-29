import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CircleX, 
  Plus, 
  ArrowUpCircle, 
  Trash, 
  Info, 
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
  Coins,
  Loader2,
  WandSparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Recipe, SavedRecipe } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { RetailerCtaLink } from '../RetailerCtaLink';
import { SavedRecipeItem } from '../SavedRecipeItem';
import { passesHardConstraints, passesDietaryRule } from '../../lib/dietarySafety';
import { buildSearchParams, checkSearchMatch, cleanSearchParams } from '../../lib/searchUtils';
import { getConvenienceProfile } from '../../lib/recipeUtils';

interface PlannerViewProps {
  setView: (view: any) => void;
  onAddToPlanner?: (dayId: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ setView, onAddToPlanner }) => {
  const { 
    profile, 
    planner, 
    savedRecipes, 
    updatePlanner, 
    saveRecipe,
    unscheduleRecipe, 
    removeRecipe, 
    clearPlannerWeek, 
    removeAllSavedRecipes,
    addLog,
    handlePrintRecipe,
    showToast,
    updateRecipe,
    user,
    accessStatus
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
  const [savedSortBy, setSavedSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [convenienceFilter, setConvenienceFilter] = useState<'all' | 'scratch' | 'convenience'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [quickPills, setQuickPills] = useState({
    under20: false,
    budget: false,
    healthy: false,
  });
  const [hasExhaustedSaved, setHasExhaustedSaved] = useState(false);
  const [savedDisplayOffset, setSavedDisplayOffset] = useState(0);
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showPlanWeek, setShowPlanWeek] = useState(false);
  const [planDinnerCount, setPlanDinnerCount] = useState<3 | 5 | 7>(5);
  const [planBudget, setPlanBudget] = useState('40');
  const [planServings, setPlanServings] = useState(profile?.preferences?.servings || 2);
  const [planProtein, setPlanProtein] = useState('mixed');
  const [planTime, setPlanTime] = useState<'any' | 'quick' | 'under30'>('any');
  const [isPlanningWeek, setIsPlanningWeek] = useState(false);

  useEffect(() => {
    setPlanServings(profile?.preferences?.servings || 2);
  }, [profile?.preferences?.servings]);

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

  const filteredSavedRecipes = React.useMemo(() => {
    const activePrefs = profile?.preferences;
    const unscheduled = savedRecipes.filter(r => !r.scheduledDate);
    
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
      
      const timeA = (a.savedAt as any)?.seconds || 0;
      const timeB = (b.savedAt as any)?.seconds || 0;
      if (savedSortBy === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA;
    });

    return processed;
  }, [
    savedRecipes,
    profile?.preferences,
    savedSearchQuery,
    quickPills,
    savedSortBy,
    convenienceFilter
  ]);

  const source = profile?.preferences?.preferredMode || 'cook';

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
      const query = `${planDinnerCount} cooked dinners for ${servingsCount} people with ${proteinText}, ${timeText}${budgetValue ? ` under £${budgetValue} total` : ''}`;
      const params = cleanSearchParams(buildSearchParams(query, 'cook', profile?.preferences || null, {
        count: planDinnerCount,
        servings: servingsCount,
        saladPreference: weeklySaladPreference,
        maxCostPerPortion: perPortionBudget,
        maxTotalTime: planTime === 'under30' ? 30 : undefined,
        isSimple: planTime === 'quick' ? true : undefined,
        isLowCost: shouldApplyLowCostBias,
        excludeTitles: planner.map(item => item.title)
      }));

      const { generateDinnerSuggestions } = await import('../../services/geminiService');
      const collected: Recipe[] = [];
      try {
        const result = await generateDinnerSuggestions(params, profile?.preferences || undefined);
        collected.push(...((result.recipes || []) as Recipe[]));
      } catch (err: any) {
        addLog(`UI WARN: weekly batch generation failed, trying focused searches: ${err?.message || err}`);
      }

      const seenTitles = new Set(collected.map(recipe => recipe.title.toLowerCase()));
      const baseExcludedTitles = [...planner.map(item => item.title), ...collected.map(recipe => recipe.title)];
      const dietaryRule = profile?.preferences?.dietaryRule || 'none';
      const fallbackProteins = (() => {
        if (planProtein !== 'mixed') return Array(planDinnerCount).fill(planProtein);
        if (dietaryRule === 'vegetarian') return ['vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian', 'vegetarian'];
        if (dietaryRule === 'vegan') return ['vegan', 'vegan', 'vegan', 'vegan', 'vegan', 'vegan', 'vegan'];
        return ['chicken', 'fish', 'vegetarian', 'pork', 'beef', 'pulses', 'turkey'];
      })();

      for (let i = collected.length; i < planDinnerCount; i += 1) {
        const fallbackProtein = fallbackProteins[i % fallbackProteins.length];
        const fallbackQuery = `${planTime === 'under30' ? 'under 30 minute' : planTime === 'quick' ? 'quick' : 'weekday'} cooked ${fallbackProtein} dinner for ${servingsCount} people${budgetValue ? ` under £${budgetValue} total` : ''}`;
        const fallbackParams = cleanSearchParams(buildSearchParams(fallbackQuery, 'cook', profile?.preferences || null, {
          count: 1,
          servings: servingsCount,
          saladPreference: weeklySaladPreference,
          maxCostPerPortion: perPortionBudget,
          maxTotalTime: planTime === 'under30' ? 30 : undefined,
          isSimple: planTime === 'quick' ? true : undefined,
          isLowCost: shouldApplyLowCostBias,
          excludeTitles: [...baseExcludedTitles, ...collected.map(recipe => recipe.title)]
        }));

        try {
          const fallbackResult = await generateDinnerSuggestions(fallbackParams, profile?.preferences || undefined);
          const nextRecipe = ((fallbackResult.recipes || []) as Recipe[])
            .find(recipe => !seenTitles.has(recipe.title.toLowerCase()));
          if (nextRecipe) {
            collected.push(nextRecipe);
            seenTitles.add(nextRecipe.title.toLowerCase());
          }
        } catch (err: any) {
          addLog(`UI WARN: weekly fallback generation failed for ${fallbackProtein}: ${err?.message || err}`);
        }
      }

      const recipes = collected.slice(0, planDinnerCount);
      if (recipes.length === 0) {
        showToast("I couldn't create a weekly plan from those settings. Try a higher budget or fewer dinners.");
        return;
      }

      for (const recipe of recipes) {
        await saveRecipe(recipe);
      }

      showToast(`Added ${recipes.length} ${recipes.length === 1 ? 'dinner' : 'dinners'} to Saved.`);
      setShowPlanWeek(false);
    } catch (err: any) {
      addLog(`UI ERROR: handlePlanWeek failed: ${err?.message || err}`);
      showToast("Could not create the weekly plan. Please try again.");
    } finally {
      setIsPlanningWeek(false);
    }
  };

  const handleDeleteSavedRecipe = async (recipe: SavedRecipe) => {
    if (checkReadOnly("Your trial has ended. Upgrade to edit your collection.")) return;
    addLog(`UI ACTION: handleDeleteSavedRecipe START for ${recipe.id}`);
    if (!recipe.id) return;
    
    try {
      await removeRecipe(recipe.id);
      addLog(`UI ACTION: handleDeleteSavedRecipe SUCCESS for ${recipe.id}`);
      // Toast for undo is handled at a higher level or we can add it here if needed
      // For now, let's just use showToast from context if available
    } catch (err: any) {
      addLog(`UI ERROR: handleDeleteSavedRecipe failed for ${recipe.id}: ${err.message}`);
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
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-dbd-accent/10 flex items-center justify-center shrink-0">
                    <WandSparkles className="w-4 h-4 text-dbd-accent" />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-bold text-gray-950">Plan my week</h3>
                    <p className="text-[11.5px] text-gray-400 font-medium leading-relaxed">
                      Create several dinners at once, with budget, protein and time preferences.
                    </p>
                  </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                      {Number(planBudget) > 0
                        ? `Plans ${planDinnerCount} dinners for ${planServings} ${planServings === 1 ? 'person' : 'people'}: about £${(Number(planBudget) / planDinnerCount).toFixed(2)} per dinner, or £${(Number(planBudget) / planDinnerCount / planServings).toFixed(2)} per person.`
                        : `Plans ${planDinnerCount} dinners for ${planServings} ${planServings === 1 ? 'person' : 'people'}.`}
                      {' '}Results are added to Saved so you can schedule them yourself.
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
                </div>
              )}
            </div>

            {/* Unified Save & Schedule Panel */}
            <div className="mt-0 bg-white rounded border border-gray-100 overflow-hidden flex flex-col">
              {/* Panel Content - Single scrollable flow */}
              <div className="px-1 sm:px-3.5 py-5 sm:py-7 space-y-10">
                
                {/* SECTION 1: SAVED (BACKLOG) */}
                <div className="space-y-2.5 relative z-20">
                  {/* SAVED HEADER ROW */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Saved</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-gray-400 font-medium">{filteredSavedRecipes.length} items</span>
                      {user && !user.isAnonymous && savedRecipes.length > 0 && (
                        <div className="flex items-center gap-2">
                          {showDeleteAllSavedConfirm ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Are you sure?</span>
                              <button 
                                onClick={async () => {
                                  if (checkReadOnly("Your trial has ended. Upgrade to edit your collection.")) return;
                                  try {
                                    await removeAllSavedRecipes();
                                  } catch (err) {
                                    addLog(`UI ERROR: removeAllSavedRecipes failed: ${err instanceof Error ? err.message : String(err)}`);
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
                              className="text-[11px] font-bold text-accent uppercase tracking-widest hover:underline"
                            >
                              Clear Saved List
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {savedRecipes.length === 0 ? (
                    <div className="w-full py-12 px-4 rounded text-center max-w-xl mx-auto my-4 bg-white/50">
                      <h5 className="font-semibold text-gray-800 mb-2 font-display text-[15px] tracking-tight">Your Saved List is Empty</h5>
                      <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-md mx-auto">
                        Click the bookmark icon on any recipe while browsing the <span className="font-medium text-gray-700">Search</span> tab to start building your personal, curated dinner collection.
                      </p>
                      <button 
                        onClick={() => setView('home')}
                        className="uppercase tracking-widest text-[10px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded hover:bg-black transition-all inline-block cursor-pointer"
                      >
                        Browse Recipes
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Search and Organize Controls - Integrated Header */}
                      <div className="bg-gray-50/50 border-b border-gray-100 px-1.5 py-2 sm:px-2.5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 h-auto md:h-8">
                          {/* Left: Search Bar */}
                          <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input 
                              type="text"
                              value={savedSearchQuery}
                              onChange={(e) => setSavedSearchQuery(e.target.value)}
                              placeholder="Search saved recipes..."
                              className="w-full h-8 bg-white border border-gray-100 rounded pl-9 pr-9 text-xs font-medium outline-none focus:border-accent/40 transition-all"
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
                          <div className="flex items-center gap-1 self-start md:self-auto h-8 relative">
                            {/* 1. Filters Dropdown */}
                            <div className="relative">
                              <button 
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className={`text-xs font-semibold h-8 px-1.5 rounded border transition-all flex items-center gap-1 cursor-pointer select-none ${
                                  isFilterDropdownOpen || convenienceFilter !== 'all' || quickPills.under20 || quickPills.budget || quickPills.healthy
                                    ? 'border-accent bg-accent/5 text-accent'
                                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                <Settings className="w-3.5 h-3.5" />
                                <span>Filters</span>
                                {(convenienceFilter !== 'all' || quickPills.under20 || quickPills.budget || quickPills.healthy) && (
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
                                      {[{id: 'under20', label: '⏱️ Under 20 min'}, {id: 'budget', label: '💰 Budget (<£5)'}, {id: 'healthy', label: '🥗 Healthy (<500kcal)'}].map(pill => (
                                        <label key={pill.id} className="flex items-center gap-2 px-1.5 py-1 hover:bg-gray-50 rounded cursor-pointer text-xs font-medium text-gray-700 select-none">
                                          <input type="checkbox" checked={quickPills[pill.id as keyof typeof quickPills]} onChange={() => setQuickPills(p => ({ ...p, [pill.id]: !p[pill.id as keyof typeof quickPills] }))} className="rounded border-gray-300 text-accent h-3.5 w-3.5 cursor-pointer" />
                                          <span>{pill.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                    {(convenienceFilter !== 'all' || quickPills.under20 || quickPills.budget || quickPills.healthy) && (
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
                            <div className="flex items-center gap-1 px-1.5 bg-white hover:bg-gray-50 rounded border border-gray-100 h-8 transition-colors">
                              <History className="w-3.5 h-3.5 text-gray-400" />
                              <select value={savedSortBy} onChange={(e) => setSavedSortBy(e.target.value as any)} className="bg-transparent text-[11px] font-bold text-gray-500 outline-none cursor-pointer py-0.5 pr-0.5">
                                <option value="newest">Newest Added</option>
                                <option value="oldest">Oldest Added</option>
                                <option value="name">Alphabetical (A-Z)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const isFiltering = !!(savedSearchQuery || quickPills.under20 || quickPills.budget || quickPills.healthy || convenienceFilter !== 'all');
                        const processed = filteredSavedRecipes;

                        return (
                          <div className="p-0 sm:p-0.5 bg-transparent">
                            <div id="saved-recipes-list">
                              {processed.length === 0 && savedRecipes.length > 0 ? (
                                <div className="py-10 text-center bg-gray-50/50 rounded p-6 mx-2 my-2">
                                  <p className="text-[13px] text-gray-950 font-medium">No saved recipes match that filter.</p>
                                  <button onClick={handleResetFilters} className="text-[12px] text-accent font-bold hover:underline mt-1 inline-block cursor-pointer">Clear Filters</button>
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
                        
                            {savedRecipes.length > 6 && !isFiltering && (
                              <div className="flex justify-center py-3 border-t border-gray-50 mt-1">
                                <button onClick={() => setShowAllSaved(!showAllSaved)} className="text-[11px] text-accent font-bold uppercase tracking-widest hover:underline cursor-pointer">
                                  {showAllSaved ? 'Show less' : 'View all saved recipes'}
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
                  </div>

                  {/* WEEKLY SCHEDULE GRID */}
                  <div id="weekly-schedule-list" className="divide-y divide-gray-50 px-0">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(dayId => {
                      const entry = planner.find(e => e.scheduledDate === dayId);
                      const dayLabel = dayId.slice(0, 3).toUpperCase();
                      return (
                        <div key={dayId} className="relative py-2 px-1.5 flex items-start gap-2 sm:gap-3 group min-h-[48px] transition-colors hover:bg-gray-50/50">
                          <div className="w-12 shrink-0 flex items-start justify-start pt-[2px]">
                            <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase text-[10px] font-semibold tracking-wider block">
                              {dayLabel}
                            </span>
                          </div>
                          
                          <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-0">
                            <div 
                              className="min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
                              onClick={() => {
                                if (entry) {
                                  setViewingPlannerEntry(entry);
                                } else {
                                  setTargetPlannerDay(targetPlannerDay === dayId ? null : dayId);
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
                                <div className="text-right">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (checkReadOnly("Your trial has ended. Upgrade to add to planner.")) return;
                                      onAddToPlanner?.(dayId);
                                    }}
                                    className="inline-flex items-center gap-1.5 h-8 px-3 bg-white border border-gray-200 text-[11px] font-bold text-gray-700 rounded hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors"
                                  >
                                    <Plus size={12} />
                                    <span>Schedule</span>
                                  </button>
                                </div>
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
                                      if (onAddToPlanner) onAddToPlanner(dayId);
                                      else setView('home');
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
                </div>

                {planner.length === 0 && savedRecipes.length === 0 && (
                  <div className="py-12 bg-gray-50/50 rounded text-center">
                    <p className="text-[14px] text-gray-900 font-bold mb-1">Your week is looking clear</p>
                    <p className="text-[13px] text-gray-500 font-normal">
                      Start by <button onClick={() => setView('home')} className="text-accent font-bold hover:underline">searching for dinner</button>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
