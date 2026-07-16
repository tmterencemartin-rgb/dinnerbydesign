import React, { useState } from 'react';
import { Printer, Check, CalendarCheck, Calendar, Mail, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Recipe, ReadyMeal, SavedRecipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../lib/api';
import { InlineDayPicker } from './ui/InlineDayPicker';
import { enrichRecipe } from '../services/geminiService';

interface RecipeActionRowProps {
  recipe: Recipe | ReadyMeal | SavedRecipe;
  isSaved: boolean;
  scheduledDate: string | null | undefined;
  onSave: () => void | Promise<void>;
  onRemove: () => void;
  onDaySelect: (day: string) => void;
  planner: SavedRecipe[];
}

export const RecipeActionRow: React.FC<RecipeActionRowProps> = ({ 
  recipe, 
  isSaved, 
  scheduledDate, 
  onSave, 
  onRemove, 
  onDaySelect, 
  planner 
}) => {
  const [isEmailing, setIsEmailing] = useState(false);
  const [isChoosingDay, setIsChoosingDay] = useState(false);
  const { user, handlePrintRecipe, showToast, goToSignIn } = useAuth();

  const handleSaveAndSchedule = async () => {
    if (!user || user.isAnonymous) {
      goToSignIn();
      return;
    }

    if (!isSaved) {
      await onSave();
      window.dispatchEvent(new CustomEvent('pwa-meaningful-action'));
      return;
    }
    
    showToast(scheduledDate ? 'Recipe is already scheduled.' : 'Recipe is saved.');
  };

  const handleDaySelect = async (day: string) => {
    await Promise.resolve(onDaySelect(day));
    setIsChoosingDay(false);
  };

  const handleEmailRecipe = async () => {
    if (!user || !user.email) {
      showToast("Please sign in with an email account to use this feature.");
      return;
    }

    setIsEmailing(true);
    let finalIngredients = 'ingredients' in recipe && recipe.ingredients ? recipe.ingredients : [];
    let finalInstructions = 'instructions' in recipe && recipe.instructions ? recipe.instructions : [];
    let finalDescription = 'description' in recipe && recipe.description ? recipe.description : '';
    const mode = 'mode' in recipe ? recipe.mode : ('retailer' in recipe ? 'ready-made' : 'cook');

    try {
      const expectedCount = 'totalIngredientsCount' in recipe ? recipe.totalIngredientsCount || 0 : 0;
      const isIncomplete = finalInstructions.length === 0 || 
                           finalIngredients.length === 0 || 
                           (expectedCount > 0 && finalIngredients.length < expectedCount) ||
                           finalIngredients.length <= (mode === 'ready-made' ? 0 : 2);

      if (isIncomplete) {
        try {
          const enriched = await enrichRecipe(recipe.title, recipe.cuisine, mode);
          if (enriched) {
            if (enriched.ingredients && enriched.ingredients.length > 0) {
              finalIngredients = enriched.ingredients;
            }
            if (enriched.instructions && enriched.instructions.length > 0) {
              finalInstructions = enriched.instructions;
            }
            if (enriched.description) {
              finalDescription = enriched.description;
            }
          }
        } catch (enrichErr) {
          console.error("Failed to enrich recipe before emailing:", enrichErr);
        }
      }

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #111; margin-bottom: 8px;">${recipe.title}</h1>
          ${finalDescription ? `<p style="font-style: italic; color: #666; margin-bottom: 24px;">${finalDescription}</p>` : ''}
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Ingredients</h2>
            <ul style="padding-left: 20px;">
              ${finalIngredients?.length > 0 
                ? finalIngredients.map(ing => `<li style="margin-bottom: 8px;">${ing}</li>`).join('') 
                : '<li style="color: #999;">Check retailer for pack ingredients.</li>'}
            </ul>
          </div>

          <div style="padding: 0 20px;">
            <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Instructions</h2>
            <ol style="padding-left: 20px;">
              ${finalInstructions?.length > 0 
                ? finalInstructions.map(step => `<li style="margin-bottom: 12px; line-height: 1.5;">${step}</li>`).join('') 
                : `<li>Follow heating instructions on packaging from ${ (recipe as ReadyMeal).retailer || 'retailer' }.</li>`}
            </ol>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            Sent from DinnerByDesign — Your efficient, precise, personalised recipe search.
          </p>
        </div>
      `;

      const response = await fetch(getApiUrl('/api/send-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: `Recipe: ${recipe.title}`,
          html,
          type: 'recipe_email',
          source: 'recipe_action_row',
          userId: user.uid
        })
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = resData?.error?.message || resData?.message || 'Failed to send email via API endpoint';
        const isRestriction = resData?.error?.name === 'RECIPIENT_RESTRICTION' || 
                               resData?.error?.name === 'RESEND_RESTRICTION' ||
                               resData?.error?.name === 'validation_error' ||
                               resData?.error?.status === 403 ||
                               resData?.error?.message?.includes('restricted') ||
                               resData?.error?.message?.includes('validation');
        
        if (isRestriction) {
          showToast("Restricted: Email not verified in sending service. Copy manually instead.");
          throw new Error("RECIPIENT_RESTRICTION"); // Trigger fallback
        }
        
        throw new Error(errorMsg);
      }

      if (resData?.simulated) {
        showToast("Simulated send: Verify your email on Resend to receive real recipe emails!");
      } else {
        showToast("Recipe sent to your email!");
      }
    } catch (err: any) {
      if (err.message !== "RECIPIENT_RESTRICTION") {
        console.error("Email error, launching local mail fallback:", err);
      }
      try {
        let bodyContent = `${recipe.title}\n${finalDescription ? `${finalDescription}\n` : ''}\nIngredients:\n${finalIngredients?.map(ing => `- ${ing}`).join('\n') || 'Check retailer for pack ingredients.'}\n\nInstructions:\n${finalInstructions?.map((step, index) => `${index + 1}. ${step}`).join('\n') || 'Follow heating instructions on packaging.'}\n\nSent from DinnerByDesign — ${window.location.origin}`;
        
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Recipe: ${recipe.title}`)}&body=${encodeURIComponent(bodyContent)}`;
        const a = document.createElement('a');
        a.href = mailtoUrl;
        a.click();
        
        if (err.message !== "RECIPIENT_RESTRICTION") {
          showToast("Opened in local mail app.");
        }
      } catch (fallbackErr) {
        console.error("Failed to trigger local mailto:", fallbackErr);
        showToast("Failed to send email. Ready to copy manually?");
      }
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="grid grid-cols-3 items-center gap-1 sm:flex sm:flex-wrap sm:gap-2">
        <button 
          onClick={handleSaveAndSchedule}
          className={`min-w-0 flex items-center justify-center gap-1 sm:gap-2 px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-none sm:rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b sm:border ${
            isSaved 
              ? 'bg-transparent sm:bg-accent text-accent sm:text-white border-accent hover:bg-accent/5 sm:hover:bg-accent/90'
              : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
          }`}
        >
          {!isSaved ? (
            <Calendar className="hidden sm:block w-3.5 h-3.5" />
          ) : scheduledDate ? (
            <CalendarCheck className="hidden sm:block w-3.5 h-3.5" />
          ) : (
            <Check className="hidden sm:block w-3.5 h-3.5" />
          )}
          <span>{!isSaved ? 'Save' : scheduledDate ? 'Scheduled' : 'Saved'}</span>
        </button>
        
        <button 
          onClick={handleEmailRecipe}
          disabled={isEmailing}
          className="min-w-0 flex items-center justify-center gap-1 sm:gap-2 px-1.5 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-600 border-b sm:border border-gray-100 rounded-none sm:rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
        >
          {isEmailing ? <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Mail className="hidden sm:block w-3.5 h-3.5" />}
          <span>Email</span>
        </button>
        
        <button 
          onClick={() => handlePrintRecipe(recipe)}
          className="min-w-0 flex items-center justify-center gap-1 sm:gap-2 px-1.5 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-600 border-b sm:border border-gray-100 rounded-none sm:rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-gray-50 whitespace-nowrap"
        >
          <Printer className="hidden sm:block w-3.5 h-3.5" />
          <span>Print</span>
        </button>
      </div>
      <AnimatePresence>
        {isChoosingDay && (
          <InlineDayPicker
            onSelect={handleDaySelect}
            onClose={() => setIsChoosingDay(false)}
            planner={planner}
            currentDay={scheduledDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
