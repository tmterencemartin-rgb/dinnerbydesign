import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleX } from './ui/CircleX';
import { Wind, CalendarPlus, Check, Archive, StickyNote } from 'lucide-react';
import { SavedRecipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { isSameRecipe, getConvenienceProfile } from '../lib/recipeUtils';

interface SavedRecipeItemProps {
  recipe: SavedRecipe;
  onRemove: () => void;
  targetDay?: string | null;
  onPlannerAdd?: () => void;
  layoutMode?: 'list' | 'grid';
  onViewDetail?: (recipe: SavedRecipe) => void;
  isBacklog?: boolean;
}

export const SavedRecipeItem: React.FC<SavedRecipeItemProps> = ({ 
  recipe, 
  onRemove,
  targetDay,
  onPlannerAdd,
  layoutMode = 'list',
  onViewDetail,
  isBacklog = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChoosingDay, setIsChoosingDay] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<Partial<SavedRecipe> | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(recipe.personalNote || '');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    setCheckedIngredients({});
  }, [recipe.id, recipe.title]);

  useEffect(() => {
    setNoteDraft(recipe.personalNote || '');
    setIsEditingNote(false);
  }, [recipe.id, recipe.personalNote]);

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

  const { updatePlanner, planner, addLog, handlePrintRecipe, updateRecipe, profile, showToast, unscheduleRecipe } = useAuth();

  const currentIngredients = (enrichedData?.ingredients || recipe.ingredients || [])
    .filter((ing: string) => ing && ing.trim().length > 0);
  const currentInstructions = enrichedData?.instructions || recipe.instructions || [];
  const totalCount = enrichedData 
    ? currentIngredients.length
    : Math.max(recipe.totalIngredientsCount || 0, currentIngredients.length);
  const cuisineLabel = recipe.cuisine || '';
  const shouldShowCuisineLabel = cuisineLabel.trim().toLowerCase() !== 'active cook';

  useEffect(() => {
    if (isExpanded && (!currentInstructions.length || currentIngredients.length < totalCount) && !isEnriching) {
      setIsEnriching(true);
      import('../services/geminiService').then(({ enrichRecipe }) => {
        enrichRecipe(recipe.title, recipe.cuisine, recipe.mode)
          .then(data => {
            setEnrichedData(data);
            setIsEnriching(false);
            // Optionally update the database with enriched data
            if (recipe.id) {
              updateRecipe(recipe.id, data).catch(err => {
                console.error("Failed to persist enriched data:", err);
              });
            }
          })
          .catch(err => {
            console.error("Enrichment failed (SavedRecipeItem):", err);
            setIsEnriching(false);
          });
      }).catch(err => {
        console.error("Failed to dynamically import geminiService module:", err);
        setIsEnriching(false);
      });
    }
  }, [isExpanded, recipe.title, recipe.cuisine, recipe.mode, currentInstructions.length, currentIngredients.length, isEnriching, recipe.id, updateRecipe]);

  const scheduledDate = recipe.scheduledDate || planner.find(p => isSameRecipe(p, recipe))?.scheduledDate;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);
  const weekIsFull = planner.filter(p => !!p.scheduledDate).length >= 7;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const personalNote = (recipe.personalNote || '').trim();
  const noteButtonLabel = personalNote ? 'Note' : 'Add note';

  const handleSaveNote = async () => {
    if (!recipe.id || isSavingNote) return;
    const cleanNote = noteDraft.trim().slice(0, 1000);
    setIsSavingNote(true);
    try {
      await updateRecipe(recipe.id, { personalNote: cleanNote || null });
      showToast(cleanNote ? 'Note saved' : 'Note removed');
      setIsEditingNote(false);
    } catch (err: any) {
      addLog(`UI ERROR: save personal note failed for ${recipe.id}: ${err?.message || err}`);
      showToast('Could not save note');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDaySelect = async (day: string) => {
    if (day === scheduledDate) {
      setIsChoosingDay(false);
      return;
    }
    const replacedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, recipe));
    const result = await updatePlanner(day, recipe).catch(err => {
      console.error("handleDaySelect (SavedRecipeItem) failed:", err);
      addLog(`UI ERROR: updatePlanner failed (SavedRecipeItem): ${err?.message || err}`);
      return undefined;
    });
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
    if (result) {
      showToast(replacedRecipe ? `Replaced ${dayLabel}. Previous recipe moved to saved.` : `Added to ${dayLabel}`, "Undo", () => {
        if (replacedRecipe) {
          updatePlanner(day, replacedRecipe).catch(err => {
            addLog(`UI ERROR: Undo restore failed (SavedRecipeItem): ${err?.message || err}`);
            console.error("[SavedRecipeItem] Undo restore failed:", err);
          });
          return;
        }
        if (result.id) {
          unscheduleRecipe(result.id).catch(err => {
            addLog(`UI ERROR: Undo unschedule failed (SavedRecipeItem): ${err?.message || err}`);
            console.error("[SavedRecipeItem] Undo unschedule failed:", err);
          });
        }
      });
    }
    setToastMessage(null);
    setShowCheck(true);
    setTimeout(() => {
      setToastMessage(null);
      setShowCheck(false);
    }, 2000);
    setIsChoosingDay(false);
    if (onPlannerAdd) onPlannerAdd();
  };

  if (layoutMode === 'grid') {
    return (
      <div className={`bg-white border border-gray-100 rounded p-4 hover:border-gray-200 transition-all duration-200 flex flex-col justify-between h-full relative group min-h-[160px] ${isChoosingDay ? 'z-40' : 'z-10'}`}>
        <div className="space-y-2">
          {/* Header row: Cuisine / Retailer + Delete Button */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {recipe.mode === 'ready-made' && recipe.retailer ? recipe.retailer : recipe.cuisine}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
              title="Archive"
            >
              <Archive size={14} className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetail ? onViewDetail(recipe) : setIsExpanded(!isExpanded)}
            className="text-[13px] font-bold text-gray-900 leading-tight hover:text-accent cursor-pointer line-clamp-2 transition-colors"
            title="View dinner details"
          >
            {recipe.title}
          </h3>

          {/* Compressed Badge Grid */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            {recipe.totalTime && (
              <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1">
                {recipe.totalTime}m
              </span>
            )}
            {recipe.costPerPortion && (
              <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1">
                {recipe.costPerPortion}
              </span>
            )}
            {recipe.calories && (
              <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1">
                {recipe.calories} kcal
              </span>
            )}
            {personalNote && (
              <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1">
                <StickyNote className="w-2.5 h-2.5" /> Note
              </span>
            )}
            {recipe.isAirFryerFriendly && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-0.5">
                <Wind className="w-2.5 h-2.5" /> Air Fryer
              </span>
            )}
            {profile?.preferences?.dietaryRule === 'none' && (recipe.isVegetarian || recipe.isVegan) && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10.5px] font-semibold">
                {recipe.isVegan ? 'Plant' : 'Veg'}
              </span>
            )}
            {(() => {
              const cp = recipe.convenienceProfile || getConvenienceProfile(recipe);
              if (cp === 'scratch') {
                return (
                  <span className="bg-gray-100 text-gray-700 text-[10.5px] px-2 py-0.5 rounded flex items-center gap-1">
                    Homemade
                  </span>
                );
              } else {
                return (
                  <span className="bg-gray-50 text-gray-600 text-[10.5px] px-2 py-0.5 rounded flex items-center gap-1">
                    Ready-made
                  </span>
                );
              }
            })()}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100/60">
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrintRecipe(recipe);
              }}
              className="text-[10.5px] text-gray-400 hover:text-accent font-bold transition-colors cursor-pointer"
            >
              Print
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingNote(true);
              }}
              className={`text-[10.5px] font-bold transition-colors cursor-pointer ${personalNote ? 'text-orange-800 hover:text-accent' : 'text-gray-400 hover:text-accent'}`}
            >
              {noteButtonLabel}
            </button>
          </div>

          {scheduledDate ? (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded uppercase text-[9.5px] font-bold tracking-wider">
              {scheduledDate.slice(0, 3)}
            </span>
          ) : (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsChoosingDay(!isChoosingDay);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  showCheck
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
                title="Schedule"
              >
                {showCheck ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <CalendarPlus className="w-2.5 h-2.5" />
                )}
                <span>Schedule</span>
              </button>

              {isChoosingDay && (
                <div className="absolute right-0 bottom-full mb-2 z-50 bg-white border border-gray-100 rounded shadow-md p-3 min-w-[220px]">
                  <div className="flex justify-between items-start gap-3 mb-1.5 border-b border-gray-50 pb-1.5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dinner Day</span>
                      {weekIsFull && !scheduledDate && (
                        <p className="mt-0.5 text-[10.5px] text-gray-500 leading-snug">Schedule full. Choose a day to replace.</p>
                      )}
                    </div>
                    <button onClick={() => setIsChoosingDay(false)} className="text-gray-400 hover:text-gray-600"><CircleX size={10} /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {days.map(day => {
                      const bookedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, recipe));
                      const isBooked = !!bookedRecipe;
                      return (
                        <button 
                          key={day}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDaySelect(day);
                          }}
                          className={`text-left px-2 py-1.5 text-[11px] rounded transition-colors flex items-center justify-between ${
                            day === scheduledDate 
                              ? 'bg-accent text-white font-semibold' 
                            : isBooked 
                                ? 'text-gray-700 hover:bg-accent/5' 
                                : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="capitalize block">{day}</span>
                            {bookedRecipe && (
                              <span className="block truncate max-w-[125px] text-[9.5px] text-gray-400 font-medium normal-case tracking-normal">{bookedRecipe.title}</span>
                            )}
                          </span>
                          {isBooked && day !== scheduledDate && <span className="text-[8.5px] uppercase font-bold tracking-widest text-accent">Replace</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {personalNote && !isEditingNote && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingNote(true);
            }}
            className="mt-2 w-full text-left rounded bg-orange-50/45 px-2 py-1.5 text-[11.5px] leading-snug text-gray-600 hover:bg-orange-50 transition-colors cursor-pointer"
            title="Edit personal note"
          >
            <span className="font-semibold text-orange-800">Note:</span>{' '}
            <span className="line-clamp-2">{personalNote}</span>
          </button>
        )}

        {isEditingNote && (
          <div className="mt-2 rounded border border-orange-100 bg-orange-50/35 p-2" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value.slice(0, 1000))}
              placeholder="Personal note..."
              className="w-full min-h-[74px] resize-none rounded border border-orange-100 bg-white px-2 py-1.5 text-[12px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 focus:border-accent/40"
              maxLength={1000}
            />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-gray-400">{noteDraft.length}/1000</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setNoteDraft(recipe.personalNote || '');
                    setIsEditingNote(false);
                  }}
                  className="h-6 px-2 rounded border border-gray-100 bg-white text-[10.5px] font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="h-6 px-2 rounded bg-accent text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-accent-dark disabled:opacity-60 cursor-pointer"
                >
                  {isSavingNote ? 'Saving' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification Container */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gray-900/90 text-white text-[10px] font-bold rounded shadow-xl pointer-events-none z-[60]"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`${isBacklog ? 'py-1.5' : 'py-2'} px-0 sm:px-0.5 border-b border-gray-100 last:border-none relative group transition-colors bg-white ${isChoosingDay ? 'z-40' : ''}`}>
      {isExpanded && (
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-2 right-4 z-10 p-1.5 bg-white/80 transition-colors"
          title="Close detail"
        >
          <CircleX size={16} />
        </button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 min-h-[34px] w-full sm:relative">
        {/* Left Side: Scheduled Badge + Recipe Heading & Sub-stats */}
        <div className="flex items-start gap-2.5 flex-grow min-w-0">
          {scheduledDate && !isBacklog && (
            <div className="w-12 shrink-0 flex items-center justify-start pt-0.5 animate-in fade-in zoom-in duration-150">
              <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase text-[10px] font-semibold tracking-wider block">
                {scheduledDate.slice(0, 3)}
              </span>
            </div>
          )}

          <div 
            className={`flex-grow min-w-0 cursor-pointer hover:opacity-75 transition-opacity ${isBacklog ? '' : 'sm:pr-32 md:pr-44'}`}
            onClick={() => onViewDetail ? onViewDetail(recipe) : setIsExpanded(!isExpanded)}
          >
            <div className="flex flex-col">
              <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                {recipe.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-gray-400 font-normal mt-0.5">
                {(() => {
                  const items: React.ReactNode[] = [];
                  
                  if (recipe.mode === 'ready-made' && recipe.retailer) {
                    items.push(
                      <span key="retailer" className="uppercase font-semibold tracking-tight text-gray-500">
                        {recipe.retailer}
                      </span>
                    );
                  }
                  
                  if (shouldShowCuisineLabel) {
                    items.push(
                      <span key="cuisine" className="capitalize">
                        {recipe.cuisine}
                      </span>
                    );
                  }
                  
                  if (recipe.mode !== 'ready-made' && recipe.sourceUrl && !recipe.sourceUrl.includes('recipe-search')) {
                    items.push(
                      <span key="source" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        {recipe.sourceUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </span>
                    );
                  }
                  
                  if (recipe.isAirFryerFriendly) {
                    items.push(
                      <span key="airfryer" className="text-gray-600 font-medium">
                        Air fryer
                      </span>
                    );
                  }
                  
                  if (recipe.totalTime) {
                    items.push(
                      <span key="time" className="text-gray-600">
                        {recipe.totalTime} mins
                      </span>
                    );
                  }
                  
                  if (recipe.calories) {
                    items.push(
                      <span key="calories" className="text-gray-600">
                        {recipe.calories} kcal
                      </span>
                    );
                  }
                  
                  if (recipe.costPerPortion) {
                    items.push(
                      <span key="cost" className="border-b border-dotted border-gray-200 text-gray-600">
                        {recipe.costPerPortion} pp
                      </span>
                    );
                  }

                  const cp = recipe.convenienceProfile || getConvenienceProfile(recipe);
                  if (cp === 'scratch') {
                    items.push(
                      <span key="convenience-profile" className="bg-gray-50 text-gray-700 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        Homemade
                      </span>
                    );
                  } else {
                    items.push(
                      <span key="convenience-profile" className="bg-gray-50 text-gray-600 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        Ready-made
                      </span>
                    );
                  }
 
                  const currentDiet = profile?.preferences?.dietaryRule || 'none';
                  if (currentDiet === 'none' && (recipe.isVegetarian || recipe.isVegan)) {
                    items.push(
                      <span 
                        key="dietary-variety" 
                        className="bg-gray-50 text-gray-700 text-[11px] px-1.5 py-0.5 rounded font-medium"
                      >
                        {recipe.isVegan ? 'Vegan' : 'Vegetarian'}
                      </span>
                    );
                  }

                  if (personalNote) {
                    items.push(
                      <span key="personal-note" className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        <StickyNote className="w-3 h-3" />
                        Note
                      </span>
                    );
                  }
                  
                  return items.reduce<React.ReactNode[]>((acc, item, index) => {
                    if (index > 0) {
                      acc.push(
                        <span key={`sep-${index}`} className="text-gray-300 select-none">•</span>
                      );
                    }
                    acc.push(item);
                    return acc;
                  }, []);
                })()}

              </div>

              {isBacklog && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="relative inline-flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChoosingDay(!isChoosingDay);
                      }}
                      className={`inline-flex h-7 items-center gap-1.5 px-2.5 rounded border text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        scheduledDate || showCheck
                          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-700'
                          : 'border-accent/25 bg-accent/10 text-accent hover:bg-accent hover:border-accent hover:text-white'
                      }`}
                      title="Schedule"
                    >
                      {!scheduledDate && !showCheck && <CalendarPlus className="w-3.5 h-3.5" />}
                      <span>{scheduledDate ? 'Scheduled' : showCheck ? 'Scheduled' : 'Schedule'}</span>
                    </button>

                    {isChoosingDay && (
                      <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded shadow-md p-3 min-w-[260px] animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="flex justify-between items-start gap-3 mb-2 border-b border-gray-50 pb-1.5">
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Schedule Dinner</span>
                            {weekIsFull && !scheduledDate && (
                              <p className="mt-0.5 text-[11px] text-gray-500 leading-snug">Schedule full. Choose a day to replace.</p>
                            )}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setIsChoosingDay(false); }} className="text-gray-400 hover:text-gray-600 cursor-pointer"><CircleX size={12} /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {days.map(day => {
                            const bookedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, recipe));
                            const isBooked = !!bookedRecipe;
                            return (
                              <button
                                key={day}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDaySelect(day);
                                }}
                                className={`text-left px-3 py-2 text-[13px] rounded transition-colors flex items-center justify-between cursor-pointer ${
                                  day === scheduledDate
                                    ? 'bg-accent text-white font-semibold'
                                    : isBooked
                                      ? 'text-gray-700 hover:bg-accent/5'
                                      : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className="min-w-0 pr-2">
                                  <span className="capitalize block">{day}</span>
                                  {bookedRecipe && (
                                    <span className="block truncate max-w-[150px] text-[10px] text-gray-400 font-medium normal-case tracking-normal">{bookedRecipe.title}</span>
                                  )}
                                </span>
                                {isBooked && day !== scheduledDate && <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Replace</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingNote(true);
                    }}
                    className={`inline-flex h-7 items-center gap-1.5 px-2.5 rounded border text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      personalNote
                        ? 'border-orange-100 bg-orange-50/70 text-orange-800 hover:bg-orange-50'
                        : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                    title={personalNote ? 'Edit personal note' : 'Add personal note'}
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    <span>{noteButtonLabel}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="inline-flex h-7 items-center gap-1.5 px-2.5 rounded border border-gray-100 text-[11px] font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all cursor-pointer whitespace-nowrap"
                    title="Archive"
                  >
                    <span>Archive</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Consolidated Action Buttons */}
        {!isBacklog && (
        <div className="flex items-center gap-1.5 shrink-0 pt-0 w-full sm:w-auto justify-end sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
          {!isBacklog && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingNote(true);
              }}
              className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer font-medium ${
                personalNote
                  ? 'border-orange-100 bg-orange-50/70 text-orange-800 hover:bg-orange-50'
                  : 'border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {noteButtonLabel}
            </button>
          )}

          {!isBacklog && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrintRecipe(recipe);
              }}
              className="text-xs px-2.5 py-1 rounded border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
            >
              Print
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsChoosingDay(!isChoosingDay);
              }}
              className={`flex h-7 items-center gap-1 px-2.5 rounded border text-[11.5px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                scheduledDate || showCheck
                  ? 'bg-emerald-50/60 border-emerald-100 text-emerald-700 font-semibold'
                  : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
              title="Add to Schedule"
            >
              {scheduledDate || showCheck ? (
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              ) : (
                <CalendarPlus className="w-2.5 h-2.5 text-gray-400" />
              )}
              <span>{scheduledDate ? `Scheduled` : showCheck ? 'Scheduled' : 'Schedule'}</span>
            </button>

            {isChoosingDay && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded shadow-md p-3 min-w-[260px] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex justify-between items-start gap-3 mb-2 border-b border-gray-50 pb-1.5">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Schedule Dinner</span>
                    {weekIsFull && !scheduledDate && (
                      <p className="mt-0.5 text-[11px] text-gray-500 leading-snug">Schedule full. Choose a day to replace.</p>
                    )}
                  </div>
                  <button onClick={() => setIsChoosingDay(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><CircleX size={12} /></button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {days.map(day => {
                    const bookedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, recipe));
                    const isBooked = !!bookedRecipe;
                    return (
                      <button 
                        key={day}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDaySelect(day);
                        }}
                        className={`text-left px-3 py-2 text-[13px] rounded transition-colors flex items-center justify-between cursor-pointer ${
                          day === scheduledDate 
                            ? 'bg-accent text-white font-semibold' 
                            : isBooked 
                              ? 'text-gray-700 hover:bg-accent/5' 
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="min-w-0 pr-2">
                          <span className="capitalize block">{day}</span>
                          {bookedRecipe && (
                            <span className="block truncate max-w-[150px] text-[10px] text-gray-400 font-medium normal-case tracking-normal">{bookedRecipe.title}</span>
                          )}
                        </span>
                        {isBooked && day !== scheduledDate && <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Replace</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {!isBacklog && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-xs px-2.5 py-1 rounded border border-transparent text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              aria-label="Remove recipe"
            >
              Remove
            </button>
          )}
        </div>
        )}
      </div>

      {personalNote && !isEditingNote && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingNote(true);
          }}
          className="mt-1.5 w-full text-left rounded bg-orange-50/45 px-2 py-1.5 text-[11.5px] leading-snug text-gray-600 hover:bg-orange-50 transition-colors cursor-pointer"
          title="Edit personal note"
        >
          <span className="font-semibold text-orange-800">Note:</span>{' '}
          <span className="line-clamp-2">{personalNote}</span>
        </button>
      )}

      {isEditingNote && (
        <div className="mt-2 rounded border border-orange-100 bg-orange-50/35 p-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value.slice(0, 1000))}
            placeholder="Personal note..."
            className="w-full min-h-[74px] resize-none rounded border border-orange-100 bg-white px-2 py-1.5 text-[12px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 focus:border-accent/40"
            maxLength={1000}
          />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium text-gray-400">{noteDraft.length}/1000</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setNoteDraft(recipe.personalNote || '');
                  setIsEditingNote(false);
                }}
                className="h-6 px-2 rounded border border-gray-100 bg-white text-[10.5px] font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="h-6 px-2 rounded bg-accent text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-accent-dark disabled:opacity-60 cursor-pointer"
              >
                {isSavingNote ? 'Saving' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50/50 -mx-1.5 px-1.5 pb-3 border-t border-gray-50 mt-2"
          >
            <div className="pt-2.5 space-y-2.5 w-full">
              {recipe.description && (
                <p className="text-[12.5px] text-gray-400 leading-relaxed italic">{recipe.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentIngredients.length > 0 || isEnriching) && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Ingredients</h4>
                    {isEnriching && !currentIngredients.length ? (
                      <p className="text-[12px] text-gray-400 animate-pulse">Sourcing ingredients...</p>
                    ) : (
                      <ul className="space-y-0">
                        {currentIngredients.map((ing, i) => {
                          const parsed = parseIngredient(ing);
                          const itemKey = `${recipe.id || recipe.title}-${i}`;
                          const isChecked = !!checkedIngredients[itemKey];
                          return (
                            <li 
                              key={itemKey} 
                              className={`flex items-center gap-2.5 py-1 border-b border-gray-100/60 text-xs select-none transition-all duration-150 ${
                                isChecked ? 'opacity-40 line-through' : 'text-gray-700'
                              }`}
                            >
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => setCheckedIngredients(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))}
                                className="rounded text-emerald-600 focus:ring-emerald-500 h-3 w-3 border-gray-300 cursor-pointer animate-none" 
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
                {(currentInstructions.length > 0 || isEnriching) && recipe.mode !== 'ready-made' && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Method</h4>
                    {isEnriching && !currentInstructions.length ? (
                      <p className="text-[12px] text-gray-400 animate-pulse">Sourcing instructions...</p>
                    ) : (
                      <div className="space-y-0">
                        {currentInstructions.map((step, i) => (
                          <div key={i} className="flex items-start gap-2.5 pb-1.5 border-b border-gray-50 last:border-0 mb-1.5 last:mb-0">
                            <div className="w-4 h-4 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-xs text-gray-600 leading-normal max-w-2xl">{step}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {recipe.servingSuggestion && !currentIngredients.length && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Serving Suggestion</h4>
                    <p className="text-[12px] text-gray-700 leading-relaxed">{recipe.servingSuggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900/90 text-white text-[11px] font-bold rounded shadow-xl pointer-events-none z-[60]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
