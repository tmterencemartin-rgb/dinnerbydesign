import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Loader2, ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';
import { Recipe, ReadyMeal, SavedRecipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { enrichRecipe } from '../services/geminiService';
import { isSameRecipe } from '../lib/recipeUtils';
import { CircleX } from './ui/CircleX';
import { Tooltip } from './ui/Tooltip';
import { RetailerCtaLink } from './RetailerCtaLink';
import { GuidanceNotice } from './Notices';
import { RecipeActionRow } from './RecipeActionRow';
import { convertIngredient } from '../lib/measurementUtils';
import { RecipeRealityChecks } from './RecipeRealityChecks';

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
  const cuisineLabel = recipe.cuisine || '';
  const shouldShowCuisineLabel = cuisineLabel.trim().toLowerCase() !== 'active cook';
  
  const currentIngredients = (enrichedData?.ingredients || (recipe as any).ingredients || [])
    .filter((ing: string) => ing && ing.trim().length > 0);
  const currentInstructions = enrichedData?.instructions || (recipe as any).instructions || [];
  const totalCount = enrichedData 
    ? currentIngredients.length
    : Math.max((recipe as any).totalIngredientsCount || 0, currentIngredients.length);
  const cuisineLower = (recipe.cuisine || '').toLowerCase();
  const titleLower = recipe.title.toLowerCase();

  const tidyKitText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/\brecipes\b/gi, 'dinners')
      .replace(/\brecipe\b/gi, 'dinner')
      .replace(/\bserving\b/gi, 'plating')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const kitSides = React.useMemo(() => {
    const items: { name: string; note: string }[] = [];

    if (recipe.saladType && recipe.saladType !== 'none') {
      items.push({ name: recipe.saladType === 'main' ? 'Crisp green salad' : 'Simple side salad', note: 'Adds freshness beside the main dish' });
    }

    if (cuisineLower.includes('british') || titleLower.includes('pie')) {
      items.push({ name: 'Buttery greens', note: 'Balances rich pastry, gravy or cream' });
      items.push({ name: 'Mashed potato or new potatoes', note: 'Useful when the dish needs extra comfort' });
    } else if (cuisineLower.includes('spanish') || titleLower.includes('paella')) {
      items.push({ name: 'Green salad', note: 'Adds freshness beside saffron rice' });
      items.push({ name: 'Crusty bread', note: 'Useful for catching the last juices' });
    } else if (cuisineLower.includes('indian') || cuisineLower.includes('thai') || cuisineLower.includes('chinese') || cuisineLower.includes('japanese') || cuisineLower.includes('korean')) {
      items.push({ name: 'Steamed rice', note: 'Catches sauce and rounds out the plate' });
      items.push({ name: 'Cucumber or pickled veg', note: 'Cuts through heat and richness' });
    } else if (cuisineLower.includes('italian')) {
      items.push({ name: 'Rocket salad', note: 'Peppery contrast for pasta or baked dishes' });
      items.push({ name: 'Garlic bread', note: 'Good for saucy plates' });
    } else if (cuisineLower.includes('mexican')) {
      items.push({ name: 'Warm tortillas', note: 'Works for scooping and sharing' });
      items.push({ name: 'Lime-dressed slaw', note: 'Adds crunch and acidity' });
    } else {
      items.push({ name: 'Seasonal greens', note: 'Keeps the plate balanced' });
      items.push({ name: 'Rice, potatoes or bread', note: 'Choose one if the dish needs more substance' });
    }

    return items.slice(0, 2);
  }, [cuisineLower, recipe.saladType, titleLower]);

  const kitUpgrades = React.useMemo(() => {
    let upgrades: { name: string; note: string }[];

    if (titleLower.includes('paella')) {
      upgrades = [
        { name: 'Lemon wedges', note: 'Brightens saffron rice and seafood' },
        { name: 'Flat-leaf parsley', note: 'Adds colour without overpowering the pan' },
        { name: 'Smoked paprika', note: 'Deepens the Spanish warmth' }
      ];
    } else if (titleLower.includes('fish') || titleLower.includes('salmon') || titleLower.includes('cod') || titleLower.includes('haddock') || titleLower.includes('plaice')) {
      upgrades = [
        { name: 'Lemon wedges', note: 'Brightens fish and buttery sauces' },
        { name: 'Fresh dill or parsley', note: 'Adds a clean, fresh finish' },
        { name: 'Capers or cornichons', note: 'Brings sharpness without extra cooking' }
      ];
    } else if (cuisineLower.includes('italian') || titleLower.includes('pasta') || titleLower.includes('risotto')) {
      upgrades = [
        { name: 'Fresh basil or parsley', note: 'Adds colour and freshness at the end' },
        { name: 'Chilli flakes', note: 'Gives tomato or cream sauces a little lift' },
        { name: 'Lemon zest', note: 'Cuts through rich cheese, oil or butter' }
      ];
    } else if (cuisineLower.includes('indian') || titleLower.includes('curry') || titleLower.includes('dal')) {
      upgrades = [
        { name: 'Plain yoghurt', note: 'Cools spice and rounds out sauces' },
        { name: 'Fresh coriander or mint', note: 'Adds freshness just before eating' },
        { name: 'Mango chutney or lime pickle', note: 'Adds sweet-sharp contrast' }
      ];
    } else if (cuisineLower.includes('thai') || cuisineLower.includes('chinese') || cuisineLower.includes('japanese') || cuisineLower.includes('korean')) {
      upgrades = [
        { name: 'Spring onions', note: 'Adds freshness and a little bite' },
        { name: 'Lime wedges', note: 'Sharpens salty, sweet or spicy sauces' },
        { name: 'Sesame oil or chilli crisp', note: 'Adds aroma right at the end' }
      ];
    } else if (cuisineLower.includes('mexican') || titleLower.includes('taco') || titleLower.includes('fajita') || titleLower.includes('enchilada')) {
      upgrades = [
        { name: 'Lime wedges', note: 'Brightens beans, meat and cheese' },
        { name: 'Fresh coriander', note: 'Adds a fresh top note' },
        { name: 'Pickled jalapenos', note: 'Adds heat and acidity with no prep' }
      ];
    } else if (recipe.isVegan || recipe.isVegetarian) {
      upgrades = [
        { name: 'Toasted seeds', note: 'Adds crunch and nuttiness' },
        { name: 'Tahini or yoghurt drizzle', note: 'Makes vegetables feel richer' },
        { name: 'Chilli oil', note: 'Adds warmth and gloss at the table' }
      ];
    } else if (cuisineLower.includes('british') || titleLower.includes('pie') || titleLower.includes('chop')) {
      upgrades = [
        { name: 'Fresh parsley or chives', note: 'Lifts rich gravy, pastry or mash' },
        { name: 'English mustard', note: 'Cuts through meat and buttery sides' },
        { name: 'Lemony greens', note: 'Adds brightness beside richer plates' }
      ];
    } else {
      upgrades = [
        { name: 'Fresh herbs', note: 'Adds colour and lift at the end' },
        { name: 'Lemon or vinegar', note: 'Sharpens rich flavours' },
        { name: 'Toasted nuts or seeds', note: 'Adds a quick finishing crunch' }
      ];
    }

    return upgrades.slice(0, 3);
  }, [cuisineLower, recipe.isVegan, recipe.isVegetarian, titleLower]);

  const plateSuggestion = React.useMemo(() => {
    if (titleLower.includes('paella')) {
      return 'Serve straight from the pan or in shallow bowls, with lemon wedges and parsley over the top. Keep the seafood visible rather than buried under the rice.';
    }
    if (titleLower.includes('pie')) {
      return 'Let it stand for five minutes, then portion cleanly and plate with greens on the side so the pastry stays crisp.';
    }
    if (cuisineLower.includes('indian') || cuisineLower.includes('thai') || cuisineLower.includes('chinese')) {
      return 'Spoon over a warm rice base, keep any crisp or fresh elements separate until the last moment, then finish with herbs or acidity.';
    }
    if (cuisineLower.includes('italian')) {
      return 'Plate in warm bowls or shallow plates, add a fresh green side, and finish with herbs, oil or cheese at the table.';
    }
    return 'Plate the main dish first, add one fresh side for contrast, then finish with herbs, citrus or crunch just before eating.';
  }, [cuisineLower, titleLower]);

  const renderKitItems = (items: { name: string; note: string }[], detail = false, showNotes = false) => (
    <div className={detail ? "grid gap-0 divide-y divide-gray-100" : showNotes ? "grid gap-1.5" : "flex flex-wrap gap-1.5"}>
      {items.map((item, index) => (
        detail ? (
          <div key={`${item.name}-detail-${index}`} className="py-1.5 first:pt-0 last:pb-0">
            <p className="text-[12.5px] font-bold text-gray-800 leading-snug">{tidyKitText(item.name)}</p>
            <p className="text-[11.5px] text-gray-500 leading-relaxed mt-0.5">{tidyKitText(item.note)}</p>
          </div>
        ) : showNotes ? (
          <div key={`${item.name}-${index}`} className="max-w-full border-b border-gray-100 px-0 py-1.5 sm:rounded sm:bg-white sm:border sm:px-2">
            <p className="text-[10.5px] font-bold text-gray-700 leading-snug">{tidyKitText(item.name)}</p>
            <p className="mt-0.5 text-[10px] font-medium text-gray-400 leading-snug">{tidyKitText(item.note)}</p>
          </div>
        ) : (
          <span key={`${item.name}-${index}`} className="max-w-full border-b border-gray-100 px-0 py-1 text-[10.5px] font-medium text-gray-700 leading-snug sm:rounded sm:bg-white sm:border sm:px-2 sm:py-0.5">
            {tidyKitText(item.name)}
          </span>
        )
      ))}
    </div>
  );

  const kitPanel = (
    <div className="w-full my-3 border-y border-dbd-rule bg-[#FAF9F6] px-3 py-3.5 sm:my-4 sm:rounded sm:border sm:border-dbd-rule sm:p-4 sm:shadow-[0_1px_5px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-2.5 mb-2.5 sm:mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="hidden sm:block w-4 h-4 text-accent shrink-0" />
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
              Dinner kit
            </h4>
          </div>
          <p className="text-[11px] text-gray-400 font-semibold mt-1">
            Main dish, sides and quick finishes in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-3">
        <div className="min-w-0 border-b border-dbd-rule/70 pb-2 sm:rounded sm:bg-white/75 sm:border sm:p-2.5">
          <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Core dish
          </p>
          <p className="text-[14px] font-bold text-gray-900 leading-snug">
            {tidyKitText(recipe.title)}
          </p>
        </div>

        <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Add alongside
            </p>
            {renderKitItems(kitSides)}
          </div>

          <div className="min-w-0">
            <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Easy upgrades
            </p>
            {renderKitItems(kitUpgrades, false, true)}
          </div>
        </div>
      </div>
    </div>
  );

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
    const replacedRecipe = planner.find(p => p.scheduledDate === day && !isSameRecipe(p, recipe));
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
      showToast(replacedRecipe ? `Replaced ${dayLabel}. Previous dinner moved to saved.` : `Added to ${dayLabel}`, "Undo", () => {
        if (replacedRecipe) {
          updatePlanner(day, replacedRecipe).catch(err => {
            addLog(`UI ERROR: Undo restore failed: ${err.message || String(err)}`);
            console.error("[RecipeCard] Undo restore failed:", err);
          });
          return;
        }
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
      className={`bg-white rounded-none px-0 py-2 sm:rounded sm:p-5 relative group/card overflow-visible transition-all duration-200 ${
        isModal
          ? 'border-0 shadow-none'
          : 'border-b border-gray-100 shadow-none sm:border sm:shadow-[0_1px_4px_rgba(0,0,0,0.025)]'
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
          <div className="flex flex-col gap-1.5 sm:gap-4">
            {/* Title Block - Hero Section for Mobile */}
            <div className="flex flex-col gap-0.5 sm:gap-2 items-start">
              <h3 className="text-[18px] sm:text-[24px] font-bold text-gray-900 leading-[1.2] tracking-tight text-left">
                {recipe.title}
              </h3>
              
              <p className={`text-[12px] sm:text-[14px] text-gray-400 font-medium leading-snug sm:leading-relaxed max-w-2xl lg:max-w-3xl mr-auto w-full text-left ${isExpanded ? '' : 'line-clamp-2'}`}>
                {recipe.description}
              </p>

              {recipe.matchReason && (
                <p className="max-w-2xl lg:max-w-3xl text-[11px] sm:text-[11.5px] text-gray-400 leading-snug">
                  <span className="font-bold tracking-widest uppercase text-[9px] text-gray-400">Match:</span>{' '}
                  <span className="italic">{recipe.matchReason}</span>
                </p>
              )}

              {scheduledDate && (
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-accent font-bold bg-accent/5 px-2 py-0.5 rounded w-fit">
                  <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="capitalize tracking-tight">Scheduled for {scheduledDate}</span>
                </div>
              )}
            </div>

            {/* Core Content Stack - Tightly grouped for precise spacing */}
            <div className={isExpanded ? 'grid gap-2 sm:gap-5 sm:grid-cols-[minmax(240px,0.92fr)_minmax(320px,1.08fr)] sm:items-start' : 'grid grid-cols-1 gap-3 sm:gap-5'}>
              <div className="flex flex-col gap-1.5 sm:gap-3 items-start w-full min-w-0">
                {/* Compressed Metadata Section */}
                <div className="w-full flex flex-col gap-0.5 sm:gap-2 px-1.5 py-1.5 sm:p-3 border-y border-gray-100 sm:border-y-0 sm:bg-gray-50/60 sm:rounded">
                {/* Row 1: Primary Identity (Cuisine & Source) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 justify-start">
                    {shouldShowCuisineLabel && (
                      <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest sm:bg-white/70 sm:px-1.5 sm:py-0.5 sm:rounded">
                        {recipe.cuisine}
                      </span>
                    )}
                    {mode !== 'ready-made' && recipe.sourceUrl && !recipe.sourceUrl.includes('recipe-search') && (
                      <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate max-w-[150px] sm:max-w-[200px]">
                        {recipe.sourceUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </span>
                    )}
                  </div>
                
                {/* Row 2: Performance Stats (Nutrition, Price, Time) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-gray-600 font-medium tracking-tight justify-start">
                    {(recipe.caloriesPerPortion || recipe.calories) && (
                      <Tooltip text="Estimated calories for one adult portion">
                        <span className="cursor-help whitespace-nowrap sm:bg-white/70 sm:px-1.5 sm:py-0.5 sm:rounded">
                          {recipe.caloriesPerPortion || recipe.calories} kcal pp
                        </span>
                      </Tooltip>
                    )}
                    {recipe.costPerPortion && (
                      <div className="flex items-center gap-1">
                        <Tooltip text="Estimated cost for one adult portion">
                          <span className="cursor-help border-b border-dotted border-gray-300 whitespace-nowrap sm:bg-white/70 sm:px-1.5 sm:py-0.5 sm:rounded">
                            {recipe.costPerPortion} pp
                          </span>
                        </Tooltip>
                        {requestedServings !== 1 && (
                          <span className="hidden sm:inline text-gray-400 font-bold text-[9px] uppercase tracking-tighter whitespace-nowrap">
                            Total £{(parseFloat(recipe.costPerPortion.replace(/[^\d.]/g, '')) * requestedServings).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                    {(recipe.totalTime || recipe.prepTime || recipe.cookTime) && (
                      <span className="whitespace-nowrap sm:bg-white/70 sm:px-1.5 sm:py-0.5 sm:rounded">
                        {recipe.totalTime} mins
                      </span>
                    )}
                    {recipe.saladType && recipe.saladType !== 'none' && (
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap sm:bg-white/70 sm:px-1.5 sm:py-0.5 sm:rounded">
                        {recipe.saladType === 'main' ? 'main salad' : 'side salad'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dynamic Card Badges */}
                {(() => {
                  const badges: React.ReactNode[] = [];
                  const descLower = recipe.description.toLowerCase();
                  const batchCooking = 'batchCooking' in recipe ? recipe.batchCooking : undefined;

                // 1. Low Cost
                const costFloat = recipe.costPerPortion ? parseFloat(recipe.costPerPortion.replace(/[^\d.]/g, '')) : NaN;
                if ((('isLowCost' in recipe && (recipe as any).isLowCost)) || (!isNaN(costFloat) && costFloat <= 2.0)) {
                  badges.push(
                    <span key="low-cost" className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Low Cost
                    </span>
                  );
                }

                // 2. Cooking Methods: One-Pot
                if (titleLower.includes('one-pot') || titleLower.includes('one pot') || descLower.includes('one-pot') || descLower.includes('one pot')) {
                  badges.push(
                    <span key="one-pot" className="bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      One-Pot
                    </span>
                  );
                }

                // 3. Cooking Methods: Air Fryer
                if ((recipe as any).isAirFryerFriendly || titleLower.includes('air fryer') || titleLower.includes('airfryer') || descLower.includes('air fryer') || descLower.includes('airfryer')) {
                  badges.push(
                    <span key="air-fryer" className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Air Fryer
                    </span>
                  );
                }

                // 4. Batch Cooking
                if (
                  batchCooking?.suitable &&
                  (batchCooking.confidence === 'medium' || batchCooking.confidence === 'high')
                ) {
                  const tooltipText = [
                    batchCooking.reason,
                    batchCooking.storage ? `Storage: ${batchCooking.storage}` : '',
                    batchCooking.reheat ? `Reheat: ${batchCooking.reheat}` : ''
                  ].filter(Boolean).join(' ');

                  badges.push(
                    <Tooltip
                      key="batch-friendly"
                      text={tooltipText || 'Suitable for cooking extra portions.'}
                      position="bottom"
                      align="left"
                      maxWidth="max-w-[280px]"
                    >
                      <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-help">
                        Batch-friendly
                      </span>
                    </Tooltip>
                  );
                }

                // 5. Dietary Focus: Vegan/Vegetarian
                if (recipe.isVegan) {
                  badges.push(
                    <span key="vegan" className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Vegan
                    </span>
                  );
                } else if (recipe.isVegetarian) {
                  badges.push(
                    <span key="vegetarian" className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Vegetarian
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
              
                {mode === 'ready-made' && (
                  <div className="w-full flex flex-col gap-0 items-start">
                    <RetailerCtaLink product={recipe} type={mode} />
                    <div className="w-full h-px bg-gray-100/70 my-0.5 sm:my-1" />
                  </div>
                )}

                {!isExpanded && (
                  <RecipeRealityChecks checks={(recipe as any).realityChecks} compact />
                )}
              
                <div className="w-full bg-white rounded">
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

                {isExpanded && (
                  <>
                    <div className="hidden sm:block w-full">
                      {kitPanel}
                    </div>
                  </>
                )}
              </div>

              {isExpanded && (
                <div className="hidden sm:block space-y-3 sm:space-y-4 min-w-0">
                  <div>
                    <GuidanceNotice
                      hasCost={hasCost}
                      mode={mode}
                    />
                  </div>

                  <div>
                    <RecipeRealityChecks checks={(recipe as any).realityChecks} />
                  </div>

                </div>
              )}
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
                    className="overflow-hidden flex flex-col gap-0 sm:gap-4"
                  >
                    {/* Responsive side-by-side view for expanded recipe */}
                    <div className="w-full pt-2 sm:pt-5 mt-0 sm:mt-1 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-x-6 lg:gap-x-12 gap-y-2 sm:gap-y-3 items-start">
                        <div className="flex items-center justify-between gap-3">
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

                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider md:self-center">Preparation</h4>
                      
                      {/* Left column: Ingredients */}
                      <div className="w-full h-fit pb-2 md:pb-0 flex flex-col gap-1.5 sm:gap-2.5">
                        {isEnriching && !currentIngredients.length ? (
                          <div className="flex items-center gap-1.5 py-1 text-[11px] text-gray-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Fetching details...</span>
                          </div>
                        ) : (
                          <ul className="text-[12.5px] text-gray-750 space-y-0.5 sm:space-y-1">
                            {currentIngredients.map((ing, i) => (
                              <li key={`${recipe.title.replace(/\s+/g, '-')}-expanded-ing-${i}`} className="flex items-start gap-2 leading-snug sm:leading-relaxed">
                                <span className="mt-[0.45em] h-1 w-1 rounded-full bg-gray-300 shrink-0" />
                                <span>{convertIngredient(ing, unitSystem)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Right column: Instructions & Match Reason */}
                       <div className="w-full flex flex-col gap-2 sm:gap-3">
                        <div>
                          {(recipe as any).totalServings && (
                            <p className="text-[11px] text-gray-500 mb-1">Makes {(recipe as any).totalServings} adult portions</p>
                          )}
                          {isEnriching && !currentInstructions.length ? (
                            <div className="flex items-center gap-1.5 py-3 text-[12px] text-gray-400 italic">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                              <span>Sourcing steps...</span>
                            </div>
                          ) : (
                            <ol className="text-[12.5px] text-gray-750 space-y-1.5 sm:space-y-2">
                              {currentInstructions.map((step, i) => (
                                <li key={`${recipe.title.replace(/\s+/g, '-')}-step-${i}`} className="flex gap-2.5 sm:gap-3">
                                  <span className="flex-shrink-0 w-5 h-5 rounded bg-gray-100 text-gray-600 text-[10.5px] font-bold flex items-center justify-center">
                                    {i + 1}
                                  </span>
                                  <span className="leading-snug">{step}</span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>

                      </div>

                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-100">
                      <h4 className="text-[11px] sm:text-[12px] font-display font-bold text-gray-700 uppercase tracking-widest mb-2">How to plate it</h4>
                      <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">{tidyKitText(plateSuggestion)}</p>
                    </div>

                    <div className="sm:hidden space-y-3 pt-3 border-t border-gray-100">
                      {kitPanel}

                      <GuidanceNotice
                        hasCost={hasCost}
                        mode={mode}
                      />

                      <RecipeRealityChecks checks={(recipe as any).realityChecks} />

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
