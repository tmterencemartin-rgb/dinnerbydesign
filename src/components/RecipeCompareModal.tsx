import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Coins, Flame, Users, Utensils } from 'lucide-react';
import { Recipe, ReadyMeal } from '../types';

type ComparableRecipe = Recipe | ReadyMeal;

interface RecipeCompareModalProps {
  items: ComparableRecipe[];
  onClose: () => void;
  onView: (item: ComparableRecipe) => void;
  onRemove: (item: ComparableRecipe) => void;
}

const parseMoney = (value?: string | number | null) => {
  if (typeof value === 'number') return value;
  if (!value) return null;
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : null;
};

const getItemId = (item: ComparableRecipe) => item.id || item.title;

const getPrice = (item: ComparableRecipe) => {
  const readyPrice = 'price' in item ? item.price : undefined;
  return item.costPerPortion || readyPrice || null;
};

const getSource = (item: ComparableRecipe) => {
  if ('retailer' in item && item.retailer) return item.retailer;
  if (item.sourceUrl) return item.sourceUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  return item.cuisine || 'Dinner';
};

const getServings = (item: ComparableRecipe) => {
  if ('servingCount' in item && item.servingCount) return item.servingCount;
  return item.requestedServings || item.totalServings || 'Not stated';
};

const getIngredients = (item: ComparableRecipe) => {
  if (item.ingredients?.length) return item.ingredients;
  if ('servingSuggestion' in item && item.servingSuggestion) return [item.servingSuggestion];
  return ['Check recipe detail or retailer page'];
};

export const RecipeCompareModal: React.FC<RecipeCompareModalProps> = ({
  items,
  onClose,
  onView,
  onRemove
}) => {
  const costValues = items.map(item => parseMoney(getPrice(item)));
  const calorieValues = items.map(item => item.caloriesPerPortion || item.calories || null);
  const timeValues = items.map(item => item.totalTime || null);

  const bestCost = Math.min(...costValues.filter((value): value is number => value !== null));
  const bestCalories = Math.min(...calorieValues.filter((value): value is number => value !== null));
  const bestTime = Math.min(...timeValues.filter((value): value is number => value !== null));

  const badge = (show: boolean, label: string) => show ? (
    <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
      {label}
    </span>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        className="w-full max-w-4xl h-[92dvh] sm:h-auto sm:max-h-[92vh] overflow-hidden bg-white rounded-t-md sm:rounded-md shadow-2xl flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 sm:px-6 py-4 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-dbd-accent">Recipe compare</p>
            <h2 className="text-[18px] font-bold text-gray-950 tracking-tight">Choose the best fit</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close recipe compare"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => {
              const price = getPrice(item);
              const priceNumber = costValues[index];
              const calories = calorieValues[index];
              const time = timeValues[index];
              const ingredients = getIngredients(item);

              return (
                <section key={getItemId(item)} className="min-w-0 bg-white">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{getSource(item)}</p>
                        <h3 className="text-[15px] font-bold text-gray-950 leading-tight mt-1">{item.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item)}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-2 text-[12px] text-gray-600">
                      <div className="flex items-center justify-between gap-3 py-1 border-b border-gray-50">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><Coins className="h-3.5 w-3.5" /> Cost</span>
                        <span className="font-bold text-gray-900">
                          {price || 'Not stated'}
                          {badge(priceNumber !== null && priceNumber === bestCost, 'Lowest')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1 border-b border-gray-50">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><Flame className="h-3.5 w-3.5" /> Calories</span>
                        <span className="font-bold text-gray-900">
                          {calories ? `${calories} kcal pp` : 'Not stated'}
                          {badge(calories !== null && calories === bestCalories, 'Lightest')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1 border-b border-gray-50">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><Clock className="h-3.5 w-3.5" /> Time</span>
                        <span className="font-bold text-gray-900">
                          {time ? `${time} mins` : 'Not stated'}
                          {badge(time !== null && time === bestTime, 'Fastest')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1 border-b border-gray-50">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><Users className="h-3.5 w-3.5" /> Servings</span>
                        <span className="font-bold text-gray-900">{getServings(item)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><Utensils className="h-3.5 w-3.5" /> Cuisine</span>
                        <span className="font-bold text-gray-900">{item.cuisine || 'Dinner'}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Ingredients</p>
                      <ul className="space-y-1 text-[12px] text-gray-600">
                        {ingredients.slice(0, 6).map((ingredient, ingredientIndex) => (
                          <li key={`${getItemId(item)}-${ingredientIndex}`} className="flex gap-2 leading-relaxed">
                            <span className="mt-[0.45em] h-1 w-1 rounded-full bg-gray-300 shrink-0" />
                            <span>{ingredient}</span>
                          </li>
                        ))}
                        {ingredients.length > 6 && (
                          <li className="pl-3 text-[11px] font-semibold text-gray-400">+ {ingredients.length - 6} more</li>
                        )}
                      </ul>
                    </div>

                    {item.matchReason && (
                      <p className="bg-gray-50 px-3 py-2 rounded text-[11px] leading-relaxed text-gray-500">
                        <span className="font-bold text-gray-700">Why:</span> {item.matchReason}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="w-full h-10 rounded bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
                    >
                      View details
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
