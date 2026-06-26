import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { Recipe, ReadyMeal, SavedRecipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { enrichRecipe } from '../services/geminiService';
import { isSameRecipe } from '../lib/recipeUtils';
import { CircleX } from './ui/CircleX';
import { Tooltip } from './ui/Tooltip';
import { RetailerCtaLink } from './RetailerCtaLink';
import { AiSafetyNotice, CostDisclaimerNotice } from './Notices';
import { RecipeActionRow } from './RecipeActionRow';
import { convertIngredient } from '../lib/measurementUtils';

interface RecipeCardProps {
  recipe: Recipe | ReadyMeal;
  onSave?: (r: Recipe | ReadyMeal) => void;
  onMoreLikeThis?: (r: Recipe | ReadyMeal) => void;
  isSaved: boolean;
  isScheduled?: boolean;
  targetDay?: string | null;
  onPlannerAdd?: () => void;
  onPlannerUpdate?: (dayId: string) => void;
  onToggleSaved?: () => void;
  query?: string;
  requestedServings?: number;
  initiallyExpanded?: boolean;
  isModal?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onSave, 
  onMoreLikeThis, 
  isSaved,
  isScheduled = false,
  targetDay,
  onPlannerAdd,
  onPlannerUpdate,
  onToggleSaved,
  query = "",
  requestedServings = 2,
  initiallyExpanded = false,
  isModal = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<Partial<Recipe | ReadyMeal> | null>(null);
  const [isChoosingDay, setIsChoosingDay] = useState(false);

  const mode = (recipe as any).retailer ? 'ready-made' : 'cook';
  
  const currentIngredients = (enrichedData?.ingredients || (recipe as any).ingredients || [])
    .filter((ing: string) => ing && ing.trim().length > 0);
  const currentInstructions = enrichedData?.instructions || (recipe as any).instructions || [];
  const totalCount = enrichedData 
    ? currentIngredients.length
    : Math.max((recipe as any).totalIngredientsCount || 0, currentIngredients.length);

  useEffect(() => {
    if (isExpanded && !currentInstructions?.length && !isEnriching) {
      setIsEnriching(true);
      enrichRecipe(recipe.title, recipe.cuisine, mode)
        .then(data => {
          setEnrichedData(data);
          setIsEnriching(false);
        })
        .catch(err => {
          console.error("Enrichment failed:", err);
          setIsEnriching(false);
        });
    }
  }, [isExpanded, recipe.title, recipe.cuisine, currentInstructions.length, isEnriching]);

  const { updatePlanner, planner, removeRecipe, savedRecipes, showToast, unscheduleRecipe, addLog, unitSystem, setUnitSystem } = useAuth();

  const scheduledDate = planner.find(p => isSameRecipe(p, recipe))?.scheduledDate;

  const handleDaySelect = async (day: string) => {
    if (day === scheduledDate) {
      const saved = savedRecipes.find(p => isSameRecipe(p, recipe));
      if (saved && saved.id) {
        await unscheduleRecipe(saved.id).catch(err => {
          addLog(`UI ERROR: unscheduleRecipe failed (RecipeCard): ${err.message || String(err)}`);
          console.error("handleDaySelect unschedule failed:", err);
        });
        showToast("Removed from schedule");
      }
      setIsChoosingDay(false);
      return;
    }
    const fullRecipe = { 
      ...recipe, 
      ...enrichedData, 
      requestedServings 
    };
    const result = await updatePlanner(day, fullRecipe).catch(err => {
      addLog(`UI ERROR: updatePlanner failed (RecipeCard): ${err.message || String(err)}`);
      console.error("handleDaySelect updatePlanner failed:", err);
      return undefined;
    });
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
    
    if (result) {
      showToast(`Added to ${dayLabel}`, "Undo", () => {
        if (result.isNew) {
          removeRecipe(result.id).catch(err => {
            addLog(`UI ERROR: Undo remove failed: ${err.message || String(err)}`);
            console.error("[RecipeCard] Undo remove failed:", err);
          });
        } else {
          unscheduleRecipe(result.id).catch(err => {
            addLog(`UI ERROR: Undo unschedule failed: ${err.message || String(err)}`);
            console.error("[RecipeCard] Undo unschedule failed:", err);
          });
        }
      });
    }

    setIsChoosingDay(false);
    if (onPlannerAdd) onPlannerAdd();
  };

  const hasCost = !!recipe.costPerPortion;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-gray-200/50 rounded-xl p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative group/card overflow-visible transition-all duration-200"
    >
      {isExpanded && !isModal && (
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 transition-colors"
          title="Close detail"
        >
          <CircleX size={16} />
        </button>
      )}
      <div className="">
        <div className="flex flex-col">
          {/* Main Card Content Stack */}
          <div className="flex flex-col gap-2 sm:gap-4">
            {/* Title Block - Hero Section for Mobile */}
            <div className="flex flex-col gap-1 sm:gap-2 items-start">
              <h3 className="text-[18px] sm:text-[24px] font-bold text-gray-900 leading-[1.2] tracking-tight text-left">
                {recipe.title}
              </h3>
              
              <p className={`text-[12px] sm:text-[14px] text-gray-400 font-medium leading-relaxed max-w-2xl lg:max-w-3xl mr-auto w-full text-left ${isExpanded ? '' : 'line-clamp-2'}`}>
                {recipe.description}
              </p>

              {scheduledDate && (
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-accent font-bold bg-accent/5 px-2 py-0.5 rounded w-fit">
                  <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="capitalize tracking-tight">Scheduled for {scheduledDate}</span>
                </div>
              )}
            </div>

            {/* Core Content Stack - Tightly grouped for precise spacing */}
            <div className="flex flex-col gap-0.5 items-start w-full">
              {/* Compressed Metadata Section */}
              <div className="w-full flex flex-col gap-0.5 sm:gap-2 pt-1.5 pb-0 px-1.5 sm:p-3 bg-gray-50/50 rounded-xl border border-gray-100/50">
                {/* Row 1: Primary Identity (Cuisine & Source) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 justify-start">
                  <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-gray-200/50">
                    {recipe.cuisine}
                  </span>
                  {mode !== 'ready-made' && recipe.sourceUrl && !recipe.sourceUrl.includes('recipe-search') && (
                    <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate max-w-[150px] sm:max-w-[200px]">
                      In the style of {recipe.sourceUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </span>
                  )}
                </div>
                
                {/* Row 2: Performance Stats (Nutrition, Price, Time) */}
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-gray-600 font-medium tracking-tight justify-start">
                  {(recipe.caloriesPerPortion || recipe.calories) && (
                    <Tooltip text="Estimated calories for one adult portion">
                      <span className="cursor-help whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        {recipe.caloriesPerPortion || recipe.calories} kcal pp
                      </span>
                    </Tooltip>
                  )}
                  {recipe.costPerPortion && (
                    <div className="flex items-center gap-1">
                      <Tooltip text="Estimated cost for one adult portion">
                        <span className="cursor-help border-b border-dotted border-gray-300 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          {recipe.costPerPortion} pp
                        </span>
                      </Tooltip>
                      {requestedServings !== 1 && (
                        <span className="text-gray-400 font-bold text-[8.5px] sm:text-[9px] uppercase tracking-tighter whitespace-nowrap">
                          Total £{(parseFloat(recipe.costPerPortion.replace(/[^\d.]/g, '')) * requestedServings).toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                  {(recipe.totalTime || recipe.prepTime || recipe.cookTime) && (
                    <span className="whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      {recipe.totalTime} mins
                    </span>
                  )}
                  {recipe.saladType && recipe.saladType !== 'none' && (
                    <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      🥗 {recipe.saladType}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Card Badges */}
              {(() => {
                const badges: React.ReactNode[] = [];
                const titleLower = recipe.title.toLowerCase();
                const descLower = recipe.description.toLowerCase();

                // 1. Low Cost (💰 Low Cost)
                const costFloat = recipe.costPerPortion ? parseFloat(recipe.costPerPortion.replace(/[^\d.]/g, '')) : NaN;
                if ((('isLowCost' in recipe && (recipe as any).isLowCost)) || (!isNaN(costFloat) && costFloat <= 2.0)) {
                  badges.push(
                    <span key="low-cost" className="bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1">
                      💰 Low Cost
                    </span>
                  );
                }

                // 2. Cooking Methods: One-Pot (🍲 One-Pot)
                if (titleLower.includes('one-pot') || titleLower.includes('one pot') || descLower.includes('one-pot') || descLower.includes('one pot')) {
                  badges.push(
                    <span key="one-pot" className="bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1">
                      🍲 One-Pot
                    </span>
                  );
                }

                // 3. Cooking Methods: Air Fryer (⚡ Air Fryer)
                if ((recipe as any).isAirFryerFriendly || titleLower.includes('air fryer') || titleLower.includes('airfryer') || descLower.includes('air fryer') || descLower.includes('airfryer')) {
                  badges.push(
                    <span key="air-fryer" className="bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1">
                      ⚡ Air Fryer
                    </span>
                  );
                }

                // 4. Dietary Focus: Vegan/Vegetarian
                if (recipe.isVegan) {
                  badges.push(
                    <span key="vegan" className="bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1">
                      🌱 Vegan
                    </span>
                  );
                } else if (recipe.isVegetarian) {
                  badges.push(
                    <span key="vegetarian" className="bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1">
                      🍃 Vegetarian
                    </span>
                  );
                }

                if (badges.length === 0) return null;

                return (
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-start">
                    {badges}
                  </div>
                );
              })()}
              
              <div className="w-full flex flex-col gap-0 items-start">
                <RetailerCtaLink product={recipe} type={mode} />
                <div className="w-full border-t border-gray-100/30 sm:border-gray-100/60 my-0.5 sm:my-1" />
              </div>
              
              <div className="w-full bg-white rounded-xl">
                <RecipeActionRow 
                  recipe={{ ...recipe, ...enrichedData, requestedServings } as any}
                  isSaved={isSaved}
                  scheduledDate={scheduledDate}
                  onSave={() => {
                    if (onSave) {
                      onSave({ ...recipe, requestedServings } as any);
                    } else if (onToggleSaved) {
                      onToggleSaved();
                    }
                  }}
                  onRemove={() => {
                    if (onToggleSaved) {
                      onToggleSaved();
                    } else {
                      const saved = savedRecipes.find(p => isSameRecipe(p, recipe));
                      if (saved && saved.id) removeRecipe(saved.id).catch(err => console.error("[RecipeCard] Action remove failed:", err));
                    }
                  }}
                  onDaySelect={handleDaySelect}
                  planner={planner}
                />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-3">
              {currentIngredients.length > 0 && !isExpanded && (
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-1 pb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Ingredients ({unitSystem})
                  </span>
                  <div className="inline-flex border border-gray-100 rounded-full p-0.5 bg-gray-50 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setUnitSystem('metric')}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all duration-150 ${
                        unitSystem === 'metric'
                          ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitSystem('imperial')}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all duration-150 ${
                        unitSystem === 'imperial'
                          ? 'bg-white text-accent shadow-sm border border-gray-100/50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              )}
              
              {!isExpanded && (
                <div className="space-y-0.5 pt-0.5 max-w-2xl lg:max-w-3xl mr-auto w-full">
                  {isEnriching && !currentIngredients.length ? (
                    <div className="flex items-center gap-2 py-1.5 text-[11px] text-gray-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Fetching details...</span>
                    </div>
                  ) : (
                    <ul className="text-[12.5px] text-gray-700 space-y-0.5">
                      {currentIngredients.slice(0, 2).map((ing, i) => (
                        <li key={`${recipe.title.replace(/\s+/g, '-')}-ing-${i}`} className="flex items-start">
                          <span className="text-gray-300 mr-2">•</span>
                          {convertIngredient(ing, unitSystem)}
                        </li>
                      ))}
                      {totalCount > 2 && (
                        <li className="text-[11px] text-gray-400 pl-4 font-medium tracking-tight">
                          + {totalCount - 2} {totalCount - 2 === 1 ? 'ingredient' : 'ingredients'}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-0.5 sm:gap-4"
                  >
                    <div className="max-w-2xl lg:max-w-3xl mr-auto w-full space-y-0.25 sm:space-y-3">
                      <AiSafetyNotice />
                      <CostDisclaimerNotice 
                        hasCost={hasCost} 
                        mode={mode}
                      />
                    </div>

                    {/* Responsive side-by-side view for expanded recipe */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12 items-start w-full pt-1 border-t border-gray-100">
                      
                      {/* Left column: Sticky Ingredients */}
                      <div className="w-full md:sticky md:top-24 h-fit pb-3 md:pb-0 border-b md:border-b-0 md:border-r md:pr-6 lg:pr-8 border-gray-100 flex flex-col gap-2">
                        <div className="flex flex-col gap-2 pb-0.5 border-b border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Ingredients
                          </span>
                          <div className="inline-flex w-fit border border-gray-100 rounded-full p-0.5 bg-gray-50 shadow-inner">
                            <button
                              type="button"
                              onClick={() => setUnitSystem('metric')}
                              className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all duration-150 ${
                                unitSystem === 'metric'
                                  ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              Metric
                            </button>
                            <button
                              type="button"
                              onClick={() => setUnitSystem('imperial')}
                              className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all duration-150 ${
                                unitSystem === 'imperial'
                                  ? 'bg-white text-accent shadow-sm border border-gray-100/50'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              Imperial
                            </button>
                          </div>
                        </div>

                        {isEnriching && !currentIngredients.length ? (
                          <div className="flex items-center gap-1.5 py-1 text-[11px] text-gray-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Fetching details...</span>
                          </div>
                        ) : (
                          <ul className="text-[12px] text-gray-750 space-y-0.5">
                            {currentIngredients.map((ing, i) => (
                              <li key={`${recipe.title.replace(/\s+/g, '-')}-expanded-ing-${i}`} className="flex items-start">
                                <span className="text-gray-350 mr-1.5 select-none">•</span>
                                <span>{convertIngredient(ing, unitSystem)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Right column: Instructions & Match Reason */}
                       <div className="w-full flex flex-col gap-3">
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-0.5 border-b border-gray-100 mb-1">Preparation</h4>
                          {(recipe as any).totalServings && (
                            <p className="text-[11px] text-gray-500 mb-1">Recipe makes {(recipe as any).totalServings} adult portions</p>
                          )}
                          {isEnriching && !currentInstructions.length ? (
                            <div className="flex items-center gap-1.5 py-3 text-[12px] text-gray-400 italic">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                              <span>Sourcing steps...</span>
                            </div>
                          ) : (
                            <ol className="text-[12px] text-gray-750 space-y-1.5">
                              {currentInstructions.map((step, i) => (
                                <li key={`${recipe.title.replace(/\s+/g, '-')}-step-${i}`} className="flex gap-2">
                                  <span className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-gray-50 text-gray-600 text-[10.5px] font-medium flex items-center justify-center border border-gray-100">
                                    {i + 1}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>

                        <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/40">
                          <p className="text-[11px] text-gray-500 leading-relaxed italic">
                            <span className="font-semibold not-italic tracking-[0.05em] uppercase text-[9px]">Why this match:</span> {recipe.matchReason}
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1 text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all rounded flex items-center justify-center gap-1 border border-transparent hover:border-gray-100"
              >
                {isExpanded ? (
                  <>Hide <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Ingredients and instructions <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
