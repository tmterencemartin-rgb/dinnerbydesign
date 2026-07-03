import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Loader2, ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';
import { ReadyMeal, ReadyMadeKitItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { enrichRecipe } from '../services/geminiService';
import { isSameRecipe } from '../lib/recipeUtils';
import { CircleX } from './ui/CircleX';
import { Tooltip } from './ui/Tooltip';
import { RetailerCtaLink } from './RetailerCtaLink';
import { RecipeActionRow } from './RecipeActionRow';
import { GuidanceNotice } from './Notices';
import { RecipeRealityChecks } from './RecipeRealityChecks';

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
  const currentKit = enrichedData?.readyMadeKit || meal.readyMadeKit;

  const fallbackKit = React.useMemo(() => {
    const cuisine = (meal.cuisine || '').toLowerCase();
    const title = meal.title || 'Core product';
    const sides: ReadyMadeKitItem[] = [];

    if (meal.saladType && meal.saladType !== 'none') {
      sides.push({ name: 'Bagged salad', role: 'fresh crunch', note: 'Keeps the plate lighter' });
    }

    if (cuisine.includes('indian') || cuisine.includes('thai') || cuisine.includes('chinese') || cuisine.includes('japanese') || cuisine.includes('korean')) {
      sides.push({ name: 'Microwave rice', role: 'base', note: 'Bulks it out quickly' });
    } else if (cuisine.includes('italian')) {
      sides.push({ name: 'Garlic bread', role: 'side', note: 'Adds comfort with no prep' });
    } else if (cuisine.includes('mexican')) {
      sides.push({ name: 'Tortilla chips or wraps', role: 'side', note: 'Good for scooping and sharing' });
    } else {
      sides.push({ name: 'Steam-bag greens', role: 'veg', note: 'Adds colour in minutes' });
    }

    const titleLower = title.toLowerCase();
    let upgrades: ReadyMadeKitItem[];

    if (titleLower.includes('fish') || titleLower.includes('salmon') || titleLower.includes('cod') || titleLower.includes('haddock') || titleLower.includes('plaice') || titleLower.includes('scampi')) {
      upgrades = [
        { name: 'Lemon wedges', role: 'lift', note: 'Freshens breaded or buttery fish' },
        { name: 'Tartare sauce', role: 'dip', note: 'Adds creamy sharpness fast' },
        { name: 'Malt vinegar', role: 'finish', note: 'Gives a chip-shop edge' }
      ];
    } else if (cuisine.includes('italian') || titleLower.includes('pasta') || titleLower.includes('lasagne') || titleLower.includes('meatball')) {
      upgrades = [
        { name: 'Fresh basil', role: 'finish', note: 'Makes tomato sauces feel fresher' },
        { name: 'Rocket leaves', role: 'freshness', note: 'Adds peppery contrast' },
        { name: 'Chilli flakes', role: 'heat', note: 'Adds a little warmth at the table' }
      ];
    } else if (cuisine.includes('indian') || titleLower.includes('curry') || titleLower.includes('tikka') || titleLower.includes('korma')) {
      upgrades = [
        { name: 'Plain yoghurt', role: 'cooling', note: 'Softens spice and richness' },
        { name: 'Mango chutney', role: 'sweet-sharp', note: 'Adds contrast with no prep' },
        { name: 'Fresh coriander', role: 'finish', note: 'Adds a fresher final note' }
      ];
    } else if (cuisine.includes('thai') || cuisine.includes('chinese') || cuisine.includes('japanese') || cuisine.includes('korean')) {
      upgrades = [
        { name: 'Spring onions', role: 'finish', note: 'Adds fresh bite' },
        { name: 'Lime wedges', role: 'lift', note: 'Sharpens sweet or salty sauces' },
        { name: 'Sesame seeds', role: 'texture', note: 'Adds a simple toasted finish' }
      ];
    } else if (cuisine.includes('mexican') || titleLower.includes('taco') || titleLower.includes('fajita') || titleLower.includes('enchilada')) {
      upgrades = [
        { name: 'Lime wedges', role: 'lift', note: 'Brightens beans, cheese and spice' },
        { name: 'Soured cream', role: 'cooling', note: 'Rounds out chilli heat' },
        { name: 'Jarred jalapenos', role: 'heat', note: 'Adds punch straight from the jar' }
      ];
    } else if (titleLower.includes('pie') || titleLower.includes('stroganoff') || cuisine.includes('british')) {
      upgrades = [
        { name: 'Fresh parsley or chives', role: 'finish', note: 'Lifts cream, gravy or mash' },
        { name: 'English mustard', role: 'sharpness', note: 'Cuts through richer sauces' },
        { name: 'Lemon-dressed greens', role: 'freshness', note: 'Balances heavier plates' }
      ];
    } else {
      upgrades = [
        { name: 'Fresh herbs', role: 'finish', note: 'Makes the plate feel fresher' },
        { name: 'Lemon or lime', role: 'lift', note: 'Brightens rich sauces' },
        { name: 'Toasted seeds', role: 'texture', note: 'Adds quick crunch without cooking' }
      ];
    }

    return {
      coreProduct: title,
      sides: sides.slice(0, 2),
      upgrades,
      totalTimeNote: meal.totalTime ? `Around ${meal.totalTime} mins plus any quick sides` : undefined,
      fitNote: 'Built for a complete dinner with minimal extra prep'
    };
  }, [meal.cuisine, meal.saladType, meal.title, meal.totalTime]);

  const dinnerKit = {
    ...fallbackKit,
    ...currentKit,
    sides: currentKit?.sides?.length ? currentKit.sides : fallbackKit.sides,
    upgrades: currentKit?.upgrades?.length ? currentKit.upgrades : fallbackKit.upgrades
  };
  const packCount = Math.ceil(requestedServings / (meal.totalServings || 1));
  const packLabel = packCount === 1 ? '1 pack' : `${packCount} packs`;
  const retailerPattern = meal.retailer ? new RegExp(`^${meal.retailer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i') : null;

  const tidyKitText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(retailerPattern || /^$/, '')
      .replace(/^Taste the Difference\s+/i, '')
      .replace(/\bready meal\b/gi, 'ready-made dinner')
      .replace(/\brecipes\b/gi, 'dinners')
      .replace(/\brecipe\b/gi, 'dinner')
      .replace(/\bserving\b/gi, 'plating')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const renderKitItems = (items: ReadyMadeKitItem[] | undefined, detail = false, showNotes = false) => (
    <div className={detail ? "grid gap-0 divide-y divide-gray-100" : showNotes ? "grid gap-1.5" : "flex flex-wrap gap-1.5"}>
      {(items || []).slice(0, 3).map((item, index) => {
        const displayName = tidyKitText(item.name);
        const displayNote = tidyKitText(item.note);

        return detail ? (
        <div key={`${item.name}-detail-${index}`} className="py-2 first:pt-0 last:pb-0">
          <p className="text-[13px] font-bold text-gray-800 leading-snug">{displayName}</p>
          {item.note && (
            <p className="text-[12px] text-gray-500 leading-relaxed mt-0.5">{displayNote}</p>
          )}
        </div>
      ) : showNotes ? (
        <div key={`${item.name}-${index}`} className="max-w-full rounded bg-white border border-gray-100 px-2 py-1.5">
          <p className="text-[11px] font-bold text-gray-700 leading-snug">{displayName}</p>
          {item.note && (
            <p className="mt-0.5 text-[10px] font-medium text-gray-400 leading-snug">{displayNote}</p>
          )}
        </div>
      ) : (
        <span key={`${item.name}-${index}`} className="max-w-full rounded bg-white border border-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 leading-snug">
          {displayName}
        </span>
      );
      })}
    </div>
  );

  const kitPanel = (
    <div className="w-full rounded border border-gray-200 bg-white p-3 sm:p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2.5 sm:mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-accent shrink-0" />
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
              Dinner kit
            </h4>
          </div>
          <p className="text-[11px] text-gray-400 font-semibold mt-1">
            Product, sides and quick finishes in one place.
          </p>
        </div>
        {dinnerKit.totalTimeNote && (
          <span className="w-fit rounded bg-gray-50 border border-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500">
            {tidyKitText(dinnerKit.totalTimeNote)}
          </span>
        )}
      </div>

      <div className="grid gap-2.5 sm:gap-4">
        <div className="min-w-0 rounded bg-gray-50/80 border border-gray-100 p-2 sm:p-3">
          <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Core product
          </p>
          <p className="text-[15px] font-bold text-gray-900 leading-snug">
            {tidyKitText(dinnerKit.coreProduct || meal.title)}
          </p>
        </div>

        <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Add alongside
            </p>
            {renderKitItems(dinnerKit.sides)}
          </div>

          <div className="min-w-0">
            <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Quick upgrades
            </p>
            {renderKitItems(dinnerKit.upgrades, false, true)}
          </div>
        </div>

        {dinnerKit.fitNote && (
          <p className="text-[11px] text-gray-400 leading-relaxed pt-2 border-t border-gray-100">
            {tidyKitText(dinnerKit.fitNote)}
          </p>
        )}
      </div>
    </div>
  );

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
    const replacedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, meal));
    const result = await updatePlanner(day, { ...meal, requestedServings }).catch(err => {
      addLog(`UI ERROR: updatePlanner failed (ReadyMealCard): ${err.message || String(err)}`);
      console.error("handleDaySelect updatePlanner failed:", err);
      return undefined;
    });
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
    
    if (result) {
      showToast(replacedRecipe ? `Replaced ${dayLabel}. Previous dish moved to saved.` : `Added to ${dayLabel}`, "Undo", () => {
        if (replacedRecipe) {
          updatePlanner(day, replacedRecipe).catch(err => {
            addLog(`UI ERROR: Undo restore failed (meal): ${err.message || String(err)}`);
            console.error("[ReadyMealCard] Undo restore failed:", err);
          });
          return;
        }
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
      className={`bg-white rounded p-3 sm:p-5 relative group/card overflow-visible transition-all duration-200 ${
        isModal
          ? 'border-0 shadow-none'
          : 'border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.025)]'
      }`}
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
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Title Block - Hero Section for Mobile */}
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-[20px] sm:text-[24px] font-bold text-gray-900 leading-[1.18] tracking-tight text-left">
                {meal.title}
              </h3>
              
              <p className={`text-[14px] text-gray-400 font-medium leading-relaxed max-w-2xl lg:max-w-3xl mr-auto w-full text-left ${isModal ? '' : 'line-clamp-2'}`}>
                {meal.description}
              </p>

              {meal.matchReason && meal.matchReason.length > 0 && (
                <p className="max-w-2xl lg:max-w-3xl text-[11px] sm:text-[11.5px] text-gray-400 leading-snug">
                  <span className="font-bold tracking-widest uppercase text-[9px] text-gray-400">Match:</span>{' '}
                  <span className="italic">{tidyKitText(meal.matchReason)}</span>
                </p>
              )}

              {scheduledDate && (
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-accent font-bold bg-accent/5 px-2 py-0.5 rounded w-fit">
                  <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="capitalize tracking-tight">Scheduled for {scheduledDate}</span>
                </div>
              )}
            </div>

            <div className={`grid gap-3 sm:gap-5 ${isExpanded ? 'md:grid-cols-[minmax(240px,0.78fr)_minmax(420px,1.22fr)] md:items-start' : 'grid-cols-1'}`}>
              <div className="flex flex-col gap-2.5 sm:gap-3 items-start w-full min-w-0 md:sticky md:top-4">
                <div className="w-full flex flex-col gap-2 py-2.5 border-y border-gray-100">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-start">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {meal.cuisine}
                    </span>
                    {meal.retailer && (
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                        {meal.retailer}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-gray-600 font-medium tracking-tight justify-start">
                    {(meal.costPerPortion || meal.price) && (
                      <Tooltip text="Estimated price for one adult portion">
                        <span className="cursor-help whitespace-nowrap">
                          {meal.costPerPortion || meal.price} pp
                        </span>
                      </Tooltip>
                    )}
                    {requestedServings !== 1 && (
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-tight whitespace-nowrap">
                        Buy {packLabel}
                      </span>
                    )}
                    {(meal.caloriesPerPortion || meal.calories) && (
                      <Tooltip text="Estimated calories for one adult portion">
                        <span className="cursor-help whitespace-nowrap">
                          {meal.caloriesPerPortion || meal.calories} kcal pp
                        </span>
                      </Tooltip>
                    )}
                    {meal.totalTime && (
                      <span className="whitespace-nowrap">
                        {meal.totalTime} mins
                      </span>
                    )}
                    {meal.saladType && meal.saladType !== 'none' && (
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                        🥗 {meal.saladType}
                      </span>
                    )}
                    {meal.isAirFryerFriendly && (
                      <span className="text-accent text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                        ⚡ Air Fryer
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2 items-start">
                  <RetailerCtaLink product={meal} />
                </div>

                <div className="w-full bg-white rounded pt-1">
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

                {isExpanded && (
                  <div className="hidden md:block w-full pt-1">
                    <GuidanceNotice 
                      hasCost={!!(meal.costPerPortion || meal.price)} 
                      mode="ready-made"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-5 min-w-0">
                {kitPanel}

                {!isExpanded && (
                  <RecipeRealityChecks checks={meal.realityChecks} compact />
                )}

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3 sm:space-y-5"
                  >
                    <div className="md:hidden max-w-2xl lg:max-w-3xl mr-auto w-full space-y-2.5 pt-1 border-t border-gray-100">
                       <GuidanceNotice 
                         hasCost={!!(meal.costPerPortion || meal.price)} 
                         mode="ready-made"
                       />
                    </div>

                    <RecipeRealityChecks checks={meal.realityChecks} />

                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-[11px] sm:text-[12px] font-display font-bold text-gray-700 uppercase tracking-widest mb-2">How to plate it</h4>
                      {isEnriching && !currentServingSuggestion ? (
                        <div className="flex items-center gap-2 py-4 text-[13px] text-gray-400 italic">
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          <span>Sourcing details...</span>
                        </div>
                      ) : (
                        <p className="text-[14px] text-gray-700 leading-relaxed">{tidyKitText(currentServingSuggestion)}</p>
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1.5 text-[11px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all rounded flex items-center justify-center gap-1 border border-transparent hover:border-gray-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
              >
                {isExpanded ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Details <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
