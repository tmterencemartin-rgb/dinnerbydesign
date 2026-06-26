import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Loader2, ChevronUp, ChevronDown, Wind } from 'lucide-react';
import { ReadyMeal, SavedRecipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { enrichRecipe } from '../services/geminiService';
import { isSameRecipe } from '../lib/recipeUtils';
import { CircleX } from './ui/CircleX';
import { Tooltip } from './ui/Tooltip';
import { RetailerCtaLink } from './RetailerCtaLink';
import { RecipeActionRow } from './RecipeActionRow';
import { AiSafetyNotice, CostDisclaimerNotice } from './Notices';

interface ReadyMealCardProps {
  meal: ReadyMeal;
  onSave?: (m: ReadyMeal) => void;
  onMoreLikeThis?: (m: ReadyMeal) => void;
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

export const ReadyMealCard: React.FC<ReadyMealCardProps> = ({ 
  meal, 
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
  const [enrichedData, setEnrichedData] = useState<Partial<ReadyMeal> | null>(null);
  const [isChoosingDay, setIsChoosingDay] = useState(false);

  const currentServingSuggestion = enrichedData?.servingSuggestion || meal.servingSuggestion;

  useEffect(() => {
    if (isExpanded && !currentServingSuggestion && !isEnriching) {
      setIsEnriching(true);
      enrichRecipe(meal.title, meal.cuisine, 'ready-made')
        .then(data => {
          setEnrichedData(data);
          setIsEnriching(false);
        })
        .catch(err => {
          console.error("Enrichment failed:", err);
          setIsEnriching(false);
        });
    }
  }, [isExpanded, meal.title, meal.cuisine, currentServingSuggestion, isEnriching]);

  const { updatePlanner, planner, removeRecipe, savedRecipes, showToast, unscheduleRecipe, addLog } = useAuth();

  const scheduledDate = planner.find(p => isSameRecipe(p, meal))?.scheduledDate;

  const handleDaySelect = async (day: string) => {
    if (day === scheduledDate) {
      const saved = savedRecipes.find(p => isSameRecipe(p, meal));
      if (saved && saved.id) {
        await unscheduleRecipe(saved.id).catch(err => {
          addLog(`UI ERROR: unscheduleRecipe failed (ReadyMealCard): ${err.message || String(err)}`);
          console.error("handleDaySelect unschedule failed:", err);
        });
        showToast("Removed from schedule");
      }
      setIsChoosingDay(false);
      return;
    }
    const result = await updatePlanner(day, { ...meal, requestedServings }).catch(err => {
      addLog(`UI ERROR: updatePlanner failed (ReadyMealCard): ${err.message || String(err)}`);
      console.error("handleDaySelect updatePlanner failed:", err);
      return undefined;
    });
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
    
    if (result) {
      showToast(`Added to ${dayLabel}`, "Undo", () => {
        if (result.isNew) {
          removeRecipe(result.id).catch(err => {
            addLog(`UI ERROR: Undo remove failed (meal): ${err.message || String(err)}`);
            console.error("[ReadyMealCard] Undo remove failed:", err);
          });
        } else {
          unscheduleRecipe(result.id).catch(err => {
            addLog(`UI ERROR: Undo unschedule failed (meal): ${err.message || String(err)}`);
            console.error("[ReadyMealCard] Undo unschedule failed:", err);
          });
        }
      });
    }

    setIsChoosingDay(false);
    if (onPlannerAdd) onPlannerAdd();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-gray-100 rounded p-3 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.025)] relative group/card overflow-visible transition-all duration-200"
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
                {meal.title}
              </h3>
              
              <p className="text-[12px] sm:text-[14px] text-gray-400 font-medium leading-relaxed max-w-2xl lg:max-w-3xl mr-auto w-full line-clamp-2 text-left">
                {meal.description}
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
              <div className="w-full flex flex-col gap-0.5 sm:gap-2 pt-1.5 pb-0 px-1.5 sm:p-3 bg-gray-50/60 rounded">
                {/* Row 1: Primary Identity (Retailer & Cuisine) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 justify-start">
                  <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/70 px-1.5 py-0.5 rounded">
                    {meal.cuisine}
                  </span>
                  {meal.retailer && (
                    <span className="text-[9px] sm:text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                      {meal.retailer}
                    </span>
                  )}
                </div>
                
                {/* Row 2: Performance Stats (Nutrition, Price, Time) */}
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-gray-600 font-medium tracking-tight justify-start">
                  {(meal.costPerPortion || meal.price) && (
                    <Tooltip text="Estimated price for one adult portion">
                      <span className="cursor-help whitespace-nowrap bg-white/70 px-1.5 py-0.5 rounded">
                        {meal.costPerPortion || meal.price} pp
                      </span>
                    </Tooltip>
                  )}
                  {requestedServings !== 1 && (
                    <span className="text-gray-400 font-bold text-[8.5px] sm:text-[9px] uppercase tracking-tighter whitespace-nowrap">
                      {Math.ceil(requestedServings / (meal.totalServings || 1))} packs req.
                    </span>
                  )}
                  {(meal.caloriesPerPortion || meal.calories) && (
                    <Tooltip text="Estimated calories for one adult portion">
                      <span className="cursor-help whitespace-nowrap bg-white/70 px-1.5 py-0.5 rounded">
                        {meal.caloriesPerPortion || meal.calories} kcal pp
                      </span>
                    </Tooltip>
                  )}
                  {meal.totalTime && (
                    <span className="whitespace-nowrap bg-white/70 px-1.5 py-0.5 rounded">
                      {meal.totalTime} mins
                    </span>
                  )}
                  {meal.saladType && meal.saladType !== 'none' && (
                    <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap bg-white/70 px-1.5 py-0.5 rounded">
                      🥗 {meal.saladType}
                    </span>
                  )}
                  {meal.isAirFryerFriendly && (
                    <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                      ⚡ Air Fryer
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full flex flex-col gap-0 items-start">
                <RetailerCtaLink product={meal} />
                <div className="w-full h-px bg-gray-100/70 my-0.5 sm:my-1" />
              </div>
              
              <div className="w-full bg-white rounded">
                <RecipeActionRow 
                  recipe={{ ...meal, ...enrichedData, requestedServings }}
                  isSaved={isSaved}
                  scheduledDate={scheduledDate}
                  onSave={() => {
                    if (onSave) {
                      onSave({ ...meal, requestedServings });
                    } else if (onToggleSaved) {
                      onToggleSaved();
                    }
                  }}
                  onRemove={() => {
                    if (onToggleSaved) {
                      onToggleSaved();
                    } else {
                      const saved = savedRecipes.find(p => isSameRecipe(p, meal));
                      if (saved && saved.id) removeRecipe(saved.id).catch(err => console.error("[ReadyMealCard] Action remove failed:", err));
                    }
                  }}
                  onDaySelect={handleDaySelect}
                  planner={planner}
                />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-3">
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 sm:space-y-3"
                  >
                    <div className="max-w-2xl lg:max-w-3xl mr-auto w-full space-y-0.25 sm:space-y-3 pt-1">
                       <AiSafetyNotice />
                       <CostDisclaimerNotice 
                         hasCost={!!(meal.costPerPortion || meal.price)} 
                         mode="ready-made"
                       />
                    </div>

                    <div className="pt-0.5 border-t border-gray-100/50">
                      <h4 className="text-[10px] sm:text-[12px] font-display font-bold text-gray-600 uppercase tracking-wider mb-0.5">Serving suggestion</h4>
                      {isEnriching && !currentServingSuggestion ? (
                        <div className="flex items-center gap-2 py-4 text-[13px] text-gray-400 italic">
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          <span>Sourcing details...</span>
                        </div>
                      ) : (
                        <p className="text-[12.5px] text-gray-700 leading-relaxed">{currentServingSuggestion}</p>
                      )}
                    </div>

                    {meal.matchReason && meal.matchReason.length > 0 && (
                      <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/40">
                        <p className="text-[11.5px] text-gray-500 leading-relaxed italic">
                          <span className="font-semibold not-italic tracking-[0.05em] uppercase text-[9.5px]">Why this match:</span> {meal.matchReason}
                        </p>
                      </div>
                    )}
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
                  <>Details <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
