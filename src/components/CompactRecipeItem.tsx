import React from 'react';
import { Recipe, ReadyMeal } from '../types';
import { getRecipeSourceLabel } from '../lib/sourceLabel';

interface CompactRecipeItemProps {
  item: Recipe | ReadyMeal;
  source: 'cook' | 'ready-made';
  onClick: () => void;
  onCompare?: () => void;
  isCompareSelected?: boolean;
  compareDisabled?: boolean;
}

export const CompactRecipeItem: React.FC<CompactRecipeItemProps> = ({
  item,
  source,
  onClick,
  onCompare,
  isCompareSelected = false,
  compareDisabled = false
}) => {
  const isCook = source === 'cook';
  const recipe = item as Recipe;
  const meal = item as ReadyMeal;

  const sourceUrl = isCook ? recipe.sourceUrl : meal.sourceUrl;
  const domain = sourceUrl ? getRecipeSourceLabel(sourceUrl) : null;
  const cuisineLabel = isCook ? recipe.cuisine : meal.retailer || meal.cuisine;
  const shouldShowCuisineLabel = cuisineLabel && cuisineLabel.trim().toLowerCase() !== 'active cook';
  const calories = item.caloriesPerPortion;
  const costPerPortion = isCook ? recipe.costPerPortion : meal.price;
  const totalCost = isCook ? recipe.totalRecipeCost : meal.totalPrice;
  const time = item.totalTime || (meal as any).heatingTime;
  const kitSideCount = !isCook ? (meal.readyMadeKit?.sides?.length || 0) : 0;
  const kitUpgradeCount = !isCook ? (meal.readyMadeKit?.upgrades?.length || 0) : 0;

  const Separator = () => (
    <span className="inline-block w-[1px] h-3 bg-gray-200 mx-1 sm:mx-2" aria-hidden="true" />
  );

  return (
    <div
      className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-50/70 transition-colors duration-200 group ${
        isCompareSelected ? 'border-l-2 border-dbd-accent bg-dbd-accent/5 pl-[10px] sm:pl-[14px]' : 'border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Taxonomy & Source */}
          <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
            {shouldShowCuisineLabel && (
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
                {cuisineLabel}
              </span>
            )}
            {domain ? (
              <>
                {shouldShowCuisineLabel && <Separator />}
                <a
                  href={sourceUrl || undefined}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[10px] uppercase font-bold text-gray-500 tracking-wider truncate hover:text-dbd-accent hover:underline"
                  aria-label={`Open original recipe for ${item.title}`}
                >
                  Original: {domain}
                </a>
              </>
            ) : isCook ? (
              <>
                {shouldShowCuisineLabel && <Separator />}
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider truncate">
                  Source unavailable
                </span>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClick}
            className="w-full text-left active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent/30 focus-visible:ring-offset-2 rounded"
          >
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-gray-900 truncate leading-tight group-hover:text-accent transition-colors">
                {item.title}
              </h3>

              {item.matchReason && (
                <p className="mt-1 line-clamp-2 text-[10.5px] leading-snug text-gray-500">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-gray-500">Match:</span>{' '}
                  {item.matchReason}
                </p>
              )}

              {/* Row 2: Visual Metadata (Strictly matching user snippet) */}
              <div className="flex flex-wrap items-center gap-y-0.5 sm:gap-y-1 mt-1 sm:mt-2 text-[11px] text-gray-500 font-medium tracking-tight">
                {calories && (
                  <>
                    <span className="whitespace-nowrap">{calories} kcal pp</span>
                    <Separator />
                  </>
                )}

                {costPerPortion && (
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                     <span>{costPerPortion} pp</span>
                     {totalCost && (
                       <span className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded">
                          Total {isCook ? `£${(totalCost as number).toFixed(2)}` : totalCost}
                       </span>
                     )}
                  </div>
                )}

                {time && (
                  <>
                    <Separator />
                    <span className="whitespace-nowrap">{time} mins</span>
                  </>
                )}

                {source === 'ready-made' && (item as ReadyMeal).isAirFryerFriendly && (
                  <div className="ml-2 text-[10px] text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Air Fryer
                  </div>
                )}
              </div>

              {!isCook && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-gray-500">
                  <span className="rounded bg-gray-50 px-2 py-0.5 uppercase tracking-wider">
                    Dinner kit
                  </span>
                  <span className="truncate">
                    {kitSideCount || kitUpgradeCount
                      ? `${kitSideCount} add-ons + ${kitUpgradeCount} upgrades`
                      : 'Add-ons + quick upgrades'}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Text-only action cue */}
        <div className="shrink-0 flex items-center gap-1.5">
          {onCompare && (
            <button
              type="button"
              aria-label={`${isCompareSelected ? 'Remove from comparison' : 'Compare'} ${item.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
              disabled={compareDisabled && !isCompareSelected}
              className={`min-w-[68px] rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isCompareSelected
                  ? 'bg-dbd-accent text-white'
                  : compareDisabled
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-500 hover:bg-dbd-accent/5 hover:text-dbd-accent'
              }`}
            >
              {isCompareSelected ? 'Selected' : 'Compare'}
            </button>
          )}
          <button
            type="button"
            onClick={onClick}
            className="min-w-[44px] text-center rounded bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:bg-dbd-accent/5 group-hover:text-dbd-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent/30 focus-visible:ring-offset-2"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};
