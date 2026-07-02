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
}

export const RecipeDetailOverlay: React.FC<RecipeDetailOverlayProps> = ({
  item,
  onClose,
  isSaved,
  isScheduled,
  onToggleSaved,
  onPlannerUpdate
}) => {
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

  if (!item) return null;

  const mode = (item as any).retailer ? 'ready-made' : 'cook';
  const detailLabel = mode === 'ready-made' ? 'Ready-made dish' : 'Dinner detail';

  return (
    <motion.div
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
        className="w-full h-full sm:h-[90vh] sm:max-w-4xl bg-white sm:rounded-md shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-20">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
            <span className="text-[12px] font-bold uppercase tracking-widest">Close</span>
          </button>
          
          <div className="flex flex-col items-center flex-1 mx-4 overflow-hidden">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{detailLabel}</span>
          </div>

          <div className="w-10 sm:w-20" /> {/* Balanced Spacer */}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto bg-white p-2 sm:p-8 overscroll-contain custom-scrollbar">
          <div className="max-w-3xl mx-auto pb-8 sm:pb-12">
             {mode === 'cook' ? (
                <RecipeCard 
                  recipe={item as Recipe}
                  isSaved={isSaved}
                  isScheduled={isScheduled}
                  onToggleSaved={onToggleSaved}
                  onPlannerUpdate={onPlannerUpdate}
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
                  initiallyExpanded={true}
                  isModal={true}
                />
             )}
          </div>
          
          {/* Visual Padding for mobile bottom bars if any */}
          <div className="h-4 sm:hidden" />
        </div>
      </motion.div>
    </motion.div>
  );
};
