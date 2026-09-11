import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { Recipe, ReadyMeal } from '../types';
import { RecipeCard } from './RecipeCard';
import { ReadyMealCard } from './ReadyMealCard';
import { useSeo } from '../hooks/useSeo';

interface RecipeDetailOverlayProps {
  item: Recipe | ReadyMeal | null;
  onClose: () => void;
  isSaved: boolean;
  isScheduled: boolean;
  onToggleSaved: () => void;
  onPlannerUpdate: (dayId: string) => void;
  query?: string;
  strictIngredientMatch?: boolean;
  requestedServings?: number;
}

export const RecipeDetailOverlay: React.FC<RecipeDetailOverlayProps> = ({
  item,
  onClose,
  isSaved,
  isScheduled,
  onToggleSaved,
  onPlannerUpdate,
  query = '',
  strictIngredientMatch = false,
  requestedServings = 2
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const seoTitle = item ? `${item.title} — DinnerByDesign` : '';
  const seoDescription = item ? `Dinner details for ${item.title}. ${item.description || ''}` : '';
  
  const seoJsonLd = React.useMemo(() => {
    if (!item) return undefined;
    const isReadyMeal = (item as any).retailer !== undefined;
    if (isReadyMeal) {
      const meal = item as ReadyMeal;
      return {
        "@context": "https://schema.org",
        "@type": "MenuItem",
        "name": meal.title,
        "description": meal.description,
        "offers": meal.costPerPortion ? {
          "@type": "Offer",
          "price": meal.costPerPortion.replace(/[^\d.]/g, ''),
          "priceCurrency": "GBP"
        } : undefined
      };
    } else {
      const recipe = item as Recipe;
      return {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.title,
        "description": recipe.description,
        "prepTime": recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
        "cookTime": recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
        "totalTime": recipe.totalTime ? `PT${recipe.totalTime}M` : undefined,
        "recipeIngredient": recipe.ingredients || [],
        "recipeInstructions": recipe.instructions?.map((inst, idx) => ({
          "@type": "HowToStep",
          "text": inst,
          "position": idx + 1
        })) || [],
        "recipeCuisine": recipe.cuisine,
        "nutrition": recipe.caloriesPerPortion ? {
          "@type": "NutritionInformation",
          "calories": `${recipe.caloriesPerPortion} calories`
        } : undefined
      };
    }
  }, [item]);

  useSeo({
    title: seoTitle,
    description: seoDescription,
    jsonLd: seoJsonLd
  });

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [item?.id, item?.title]);

  if (!item) return null;

  const mode = (item as any).retailer ? 'ready-made' : 'cook';
  const detailLabel = mode === 'ready-made' ? 'Ready-made dish' : 'Dinner detail';
  const returnLabel = mode === 'ready-made' ? 'Back to options' : 'Back to recipes';

  return (
    <motion.div
      data-testid="recipe-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '20%' }}
        animate={{ y: 0 }}
        exit={{ y: '20%' }}
        className="relative w-full h-full max-h-[100dvh] sm:h-[90vh] sm:max-h-[90vh] sm:max-w-4xl bg-white sm:rounded-md shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="recipe-detail-header flex items-center justify-between px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] border-b border-gray-100 bg-white sticky top-0 z-20">
          <button 
            onClick={onClose}
            aria-label="Close dinner details"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
          
          <div className="flex flex-col items-center flex-1 mx-4 overflow-hidden">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">{detailLabel}</span>
          </div>

          <div className="w-10 sm:w-20" /> {/* Balanced Spacer */}
        </div>

        {/* Modal Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white p-2 sm:p-8 overscroll-contain custom-scrollbar">
          <div className="max-w-3xl mx-auto pb-24 sm:pb-20">
             {mode === 'cook' ? (
                <RecipeCard 
                  recipe={item as Recipe}
                  isSaved={isSaved}
                  isScheduled={isScheduled}
                  onToggleSaved={onToggleSaved}
                  onPlannerUpdate={onPlannerUpdate}
                  query={query}
                  strictIngredientMatch={strictIngredientMatch}
                  initiallyExpanded={true}
                  isModal={true}
                />
             ) : (
                <ReadyMealCard 
                  meal={item as ReadyMeal}
                  isSaved={isSaved}
                  isScheduled={isScheduled}
                  onToggleSaved={onToggleSaved}
                  onPlannerUpdate={onPlannerUpdate}
                  requestedServings={requestedServings}
                  initiallyExpanded={true}
                  isModal={true}
                />
             )}
          </div>
          
          {/* Visual Padding for mobile bottom bars if any */}
          <div className="h-4 sm:hidden" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={returnLabel}
          className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent focus-visible:ring-offset-2 sm:bottom-5 sm:right-6"
        >
          <ChevronLeft size={15} aria-hidden="true" />
          <span>{returnLabel}</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
