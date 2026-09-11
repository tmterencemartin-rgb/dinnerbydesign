import React, { useState, useContext, useEffect } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { 
  ChevronLeft, 
  Mail, 
  PlusCircle, 
  ShoppingCart, 
  CheckCircle, 
  Check, 
  Archive, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../lib/api';
import { ShoppingListItem } from '../../types';
import { CircleX } from '../ui/CircleX';
import { normalizeIngredientKey } from '../../lib/shoppingUtils';
import { convertIngredient } from '../../lib/measurementUtils';
import { Tooltip } from '../ui/Tooltip';
import {
  costItemSync,
  calculateShoppingCostSummary,
  INGREDIENT_PRICE_CATALOGUE_META,
} from '../../services/groceryService';

interface ShoppingListViewProps {
  setView: (view: any) => void;
}

export const ShoppingListView = ({ setView }: ShoppingListViewProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isEmailing, setIsEmailing] = useState(false);
  const { 
    user,
    shoppingList, 
    planner, 
    pantry,
    toggleShoppingItem, 
    updateShoppingItem,
    addCustomShoppingItem,
    removeShoppingItem, 
    addToPantry,
    removeFromPantry,
    addLog,
    unscheduleRecipe,
    removeRecipe,
    showToast,
    persistentPantryItems,
    addPersistentPantryItem,
    removePersistentPantryItem,
    unitSystem,
    setUnitSystem,
    accessStatus
  } = useAuth();

  const isReadOnly = accessStatus === 'read_only';

  const checkReadOnly = (msg: string) => {
    if (isReadOnly) {
      showToast(msg, "Upgrade", () => setView('settings'));
      return true;
    }
    return false;
  };
  
  const getDisplayItemName = (name: string) => {
    const converted = convertIngredient(name, unitSystem);
    return converted.charAt(0).toUpperCase() + converted.slice(1);
  };
  
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const onBackToPlan = () => setView('planner');
  const [customItem, setCustomItem] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPantry, setShowPantry] = useState(false);

  const handleEmailList = async () => {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    // Helper function to handle local mail client dispatch
    const triggerLocalMailFallback = () => {
      try {
        let bodyText = `DINNER BY DESIGN: SHOPPING LIST\nExported: ${dateStr}\n----------------------------------\n\n`;
        categories.forEach(category => {
          bodyText += `${category.toUpperCase()}\n`;
          groupedItems[category].forEach(item => {
            const checkMark = item.checked ? '[X] ' : '[ ] ';
            bodyText += `${checkMark}${getDisplayItemName(item.name)}\n`;
          });
          bodyText += '\n';
        });
        bodyText += `----------------------------------\nSchedule your next dinner at ${window.location.origin}\n`;
        
        const fallbackMailto = `mailto:?subject=${encodeURIComponent(`Shopping List - ${dateStr}`)}&body=${encodeURIComponent(bodyText)}`;
        const a = document.createElement('a');
        a.href = fallbackMailto;
        a.click();
        showToast?.("Local mail composer opened.");
      } catch (fallbackErr) {
        console.error("Local mailto composer failed:", fallbackErr);
        handleCopyList();
        showToast?.("Email failed & local mail client unavailable. List copied to clipboard instead!");
      }
    };

    if (!user || !user.email) {
      triggerLocalMailFallback();
      return;
    }

    setIsEmailing(true);
    try {
      let html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #111; font-size: 24px; margin-bottom: 4px;">Shopping List</h1>
          <p style="color: #999; font-size: 14px; margin-bottom: 24px;">Exported on ${dateStr}</p>
          
          ${categories.map(category => `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 12px;">
                ${category}
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${groupedItems[category].map(item => `
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                      <div style="width: 16px; height: 16px; border: 1px solid #ddd; border-radius: 4px;"></div>
                    </td>
                    <td style="padding: 8px 0; font-size: 15px; color: ${item.checked ? '#999' : '#111'}; text-decoration: ${item.checked ? 'line-through' : 'none'};">
                      ${getDisplayItemName(item.name)}
                    </td>
                  </tr>
                `).join('')}
              </table>
            </div>
          `).join('')}
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            Sent from DinnerByDesign — Find exactly what to cook — and everything you need to buy.
          </p>
        </div>
      `;

      const response = await fetch(getApiUrl('/api/send-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: `Shopping List: ${dateStr}`,
          html,
          type: 'shopping_list_email',
          source: 'shopping_list_view',
          userId: user.uid
        })
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const isRestriction = resData?.error?.name === 'RECIPIENT_RESTRICTION' || 
                               resData?.error?.name === 'RESEND_RESTRICTION' ||
                               resData?.error?.name === 'validation_error' ||
                               resData?.error?.status === 403 ||
                               resData?.error?.message?.includes('restricted') ||
                               resData?.error?.message?.includes('validation');
        
        if (isRestriction) {
          showToast?.("Restricted: Email not verified in sending service. Copy manually instead.");
        } else {
          showToast?.(`Cloud delivery issue: ${resData?.error?.message || 'Server API issue'}. Opening local mail client...`);
        }
        triggerLocalMailFallback();
        return;
      }
      
      if (resData?.simulated) {
        showToast?.("Simulated send: Verify your email on Resend to receive real recipe emails!");
      } else {
        showToast?.("Shopping list sent to your email!");
      }
    } catch (err: any) {
      console.error("Email list error, triggering mailto fallback:", err);
      showToast?.(`Service unavailable. Opening local mail client...`);
      triggerLocalMailFallback();
    } finally {
      setIsEmailing(false);
    }
  };


  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkReadOnly("Your trial has ended. Upgrade to add custom items.")) return;
    if (!customItem.trim()) return;
    try {
      await addCustomShoppingItem(customItem.trim());
      setCustomItem('');
    } catch (err) {
      console.error("Add custom item failed:", err);
      addLog?.(`UI ERROR: addCustomShoppingItem failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const startEditing = (item: ShoppingListItem) => {
    setEditingItemId(item.id);
    setEditValue(item.name);
  };

  const saveEdit = async () => {
    if (!editingItemId) return;
    if (checkReadOnly("Your trial has ended. Upgrade to change your list.")) return;
    try {
      await updateShoppingItem(editingItemId, { name: editValue });
      setEditingItemId(null);
    } catch (err) {
      console.error("Update item failed:", err);
      addLog?.(`UI ERROR: updateShoppingItem failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleToggleItem = async (item: ShoppingListItem) => {
    if (checkReadOnly("Your trial has ended. Upgrade to change your list.")) return;
    const isCurrentlyInStock = !!(item.inStock || item.checked || item.excludedByPantry);
    const cleanName = item.name.split(' (')[0].trim();
    const normKey = normalizeIngredientKey(cleanName);
    
    try {
      if (!isCurrentlyInStock) {
        // Checking: Mark as in stock (adds to persistentPantryItems in local storage)
        setShowPantry(true);
        await addPersistentPantryItem(normKey);
        await updateShoppingItem(item.id, { inStock: true, checked: true, excludedByPantry: true });
        addLog?.(`UI: Marked in-stock and saved to persistent staples: ${cleanName} (${normKey})`);
      } else {
        // Unchecking: Restore to Buy (removes from persistentPantryItems)
        await removePersistentPantryItem(normKey);
        await updateShoppingItem(item.id, { inStock: false, checked: false, excludedByPantry: false });
        
        // Also if it exists in raw user pantry, clear it
        const cleanNameLower = cleanName.toLowerCase().trim();
        const pantryEntry = pantry.find(p => p.name.toLowerCase().trim() === cleanNameLower);
        if (pantryEntry) {
          await removeFromPantry(pantryEntry.id);
        }
        addLog?.(`UI: Restored to Buy and removed from persistent staples: ${cleanName} (${normKey})`);
      }
    } catch (err) {
      console.error("Failed to toggle item state:", err);
      showToast?.("Failed to update item state.");
    }
  };

  const hasScheduledDinners = planner.some(item => !!item.scheduledDate);
  const activeItems = React.useMemo(
    () => hasScheduledDinners ? shoppingList : [],
    [hasScheduledDinners, shoppingList]
  );
  const pantryGotItItems = activeItems.filter(it => it.inStock || it.checked || it.excludedByPantry);
  const editingItems = activeItems.filter(it => !it.inStock && !it.checked && !it.excludedByPantry);
  const pantryItems = activeItems.filter(it => it.excludedByPantry);

  const shoppingCostSummary = React.useMemo(
    () => calculateShoppingCostSummary(activeItems.filter(it => !it.inStock && !it.checked && !it.excludedByPantry)),
    [activeItems]
  );
  const totalEstimatedCost = shoppingCostSummary.proportionalTotal;
  const expectedCheckoutCost = shoppingCostSummary.checkoutTotal;
  const catalogueVersion = new Date(`${INGREDIENT_PRICE_CATALOGUE_META.version}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDeleteItem = async (item: ShoppingListItem) => {
    if (checkReadOnly("Your trial has ended. Upgrade to change your list.")) return;
    try {
      if (item.isCustom) {
        await removeShoppingItem(item.id);
      } else {
        if (item.sourceRecipeIds && item.sourceRecipeIds.length > 0) {
          const validRecipeIds = item.sourceRecipeIds.filter(id => id && id !== 'unknown');
          if (validRecipeIds.length > 0) {
            for (const recipeId of validRecipeIds) {
              await removeRecipe(recipeId);
            }
            showToast?.("Recipe removed from your library and plan");
          }
        }
        if (item.id && !item.id.startsWith('derived-')) {
          await removeShoppingItem(item.id);
        }
      }
    } catch (err) {
      console.error("Delete item failed:", err);
      addLog?.(`UI ERROR: handleDeleteItem failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const numberOfNights = new Set(planner.map(p => p.scheduledDate).filter(Boolean)).size;

  const groupedItems = editingItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const categories = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Ready-made dinners') return 1;
    if (b === 'Ready-made dinners') return -1;
    return a.localeCompare(b);
  });
  const hasVisibleShoppingItems = categories.length > 0 || pantryGotItItems.length > 0;

  const bodyContent = (() => {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    let bodyText = `DINNER BY DESIGN: SHOPPING LIST\nExported: ${dateStr}\n----------------------------------\n\n`;
    
    categories.forEach(category => {
      bodyText += `${category.toUpperCase()}\n`;
      groupedItems[category].forEach(item => {
        const checkMark = item.checked ? '[X] ' : '[ ] ';
        bodyText += `${checkMark}${getDisplayItemName(item.name)}\n`;
      });
      bodyText += '\n';
    });
    
    bodyText += `----------------------------------\nSchedule your next dinner at ${window.location.origin}\n`;
    return bodyText;
  })();

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Shopping List - ${new Date().toLocaleDateString('en-GB')}`)}&body=${encodeURIComponent(bodyContent)}`;

  const handleCopyList = () => {
    navigator.clipboard.writeText(bodyContent).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setCopyStatus('Failed');
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <div className="pb-20 space-y-4 -mt-4">
      <button
        type="button"
        onClick={() => setView('home')}
        className="fixed right-4 top-1/2 z-50 inline-flex min-h-9 -translate-y-1/2 items-center gap-1.5 rounded border border-gray-200 bg-white px-3 text-[11px] font-bold uppercase tracking-widest text-gray-700 shadow-sm transition-colors hover:border-dbd-accent hover:text-dbd-accent sm:right-6"
      >
        <ChevronLeft className="h-4 w-4 -ml-0.5" aria-hidden="true" />
        Back to search
      </button>
      {/* Header & Navigation */}
      <div className="space-y-1 pt-4 sm:pt-5">
        <div className="flex justify-between items-center">
          <button 
            id="back-to-plan-btn"
            onClick={onBackToPlan}
            className="flex min-h-8 items-center gap-1 text-[13px] font-normal text-accent hover:text-gray-900 transition-colors"
          >
            <ChevronLeft id="back-chevron" className="w-4 h-4 -ml-1" />
            <span id="back-text">Back to Schedule</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center pb-2 pt-0 space-y-2">
          <h2 className="text-[20px] font-bold text-gray-900">Shopping list</h2>
          {hasVisibleShoppingItems && (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <p className="text-[13px] font-medium">
                  {editingItems.length} {editingItems.length === 1 ? 'item' : 'items'}
                </p>
                {totalEstimatedCost > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <div className="flex flex-col items-center sm:items-start -space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <motion.p
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 2 }}
                          animate={shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, backgroundColor: ['rgba(191, 75, 23, 0)', 'rgba(191, 75, 23, 0.12)', 'rgba(191, 75, 23, 0)'] }}
                          transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, ease: 'easeOut' }}
                          key={`${totalEstimatedCost}-${expectedCheckoutCost}`}
                          className="rounded px-1 text-[12px] font-bold text-accent"
                        >
                          Estimated ingredients: £{totalEstimatedCost.toFixed(2)} {numberOfNights > 0 ? `for ${numberOfNights} ${numberOfNights === 1 ? 'dinner' : 'dinners'}` : ''}
                        </motion.p>
                        <Tooltip
                          text={
                            <div className="text-left space-y-1.5 p-0.5 leading-normal font-sans">
                              <p className="font-bold text-[12px] text-white border-b border-white/10 pb-1 mb-1">How is this calculated?</p>
                              <p className="text-gray-300 text-[11px] font-medium leading-relaxed">
                                <strong>Estimated ingredients</strong> is the proportional value of the quantities used. <strong>Expected checkout</strong> rounds each consolidated ingredient up to the full packs required.
                              </p>
                              <p className="text-gray-300 text-[11px] font-medium leading-relaxed">
                                Prices use the reference catalogue where an ingredient matches, with category estimates used as a fallback. Items marked in stock are excluded.
                              </p>
                            </div>
                          }
                          position="top"
                          align="center"
                          interactive={true}
                          maxWidth="max-w-[280px]"
                        >
                          <button 
                            type="button" 
                            className="p-1 text-gray-500 hover:text-accent rounded-full hover:bg-gray-50 focus:outline-none transition-colors cursor-help flex items-center justify-center"
                            aria-label="About price calculations"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                      <p className="text-[9.5px] text-gray-500 font-medium">
                        Expected checkout: £{expectedCheckoutCost.toFixed(2)} · excludes items already in stock
                      </p>
                    </div>
                  </div>
                )}
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleEmailList}
                    disabled={isEmailing}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-accent transition-all active:scale-95 group disabled:opacity-50"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-[13px] font-medium border-b border-transparent group-hover:border-accent">
                      {isEmailing ? 'Sending...' : 'Email'}
                    </span>
                  </button>
                  <button 
                    onClick={handleCopyList}
                    className={`flex items-center gap-1.5 transition-all active:scale-95 group ${copyStatus === 'Copied!' ? 'text-emerald-500' : 'text-gray-500 hover:text-accent'}`}
                  >
                    <PlusCircle className={`w-3.5 h-3.5 ${copyStatus === 'Copied!' ? 'hidden' : ''}`} />
                    {copyStatus === 'Copied!' && <Check className="w-3.5 h-3.5" />}
                    <span className="text-[13px] font-medium border-b border-transparent group-hover:border-accent">
                      {copyStatus || 'Copy list'}
                    </span>
                  </button>

                  <span className="w-px h-3.5 bg-gray-200 mx-1" />

                  <div className="inline-flex rounded bg-white p-0.5 border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setUnitSystem('metric')}
                      className={`px-2.5 py-0.5 text-[9.5px] font-bold rounded transition-all duration-150 cursor-pointer ${
                        unitSystem === 'metric'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitSystem('imperial')}
                      className={`px-2.5 py-0.5 text-[9.5px] font-bold rounded transition-all duration-150 cursor-pointer ${
                        unitSystem === 'imperial'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-medium text-gray-500 text-center leading-relaxed w-full max-w-2xl mx-auto">
                <span className="font-semibold text-gray-700">Price basis:</span> {shoppingCostSummary.verifiedMatchCount} verified retailer matches, {shoppingCostSummary.referenceMatchCount} reference matches and {shoppingCostSummary.fallbackMatchCount} category estimates. Reference catalogue version {catalogueVersion}. Actual retailer prices and available pack sizes may vary.
              </p>
              <details className="w-full max-w-2xl rounded border border-gray-100 bg-white px-3 py-2 text-left">
                <summary className="cursor-pointer text-[11px] font-bold text-dbd-accent">How we calculate prices</summary>
                <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-gray-500">
                  <p>Estimated ingredients shows the proportional value used by your dinners. Expected checkout rounds each consolidated ingredient up to the complete packs required.</p>
                  <p>Ingredients shared across scheduled dinners are combined first. Items marked as already in stock are excluded. Catalogue matches use typical UK reference prices; unmatched items use clearly reported category estimates.</p>
                  <button type="button" onClick={() => setView('pricing-methodology')} className="font-bold text-dbd-accent hover:underline">
                    View the full ingredient pricing methodology
                  </button>
                </div>
              </details>
              <nav
                aria-label="Guides for using your shopping list"
                className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-gray-500"
              >
                <span>Using part packs?</span>
                <a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">
                  Plan around complete packs
                </a>
                <span aria-hidden="true" className="text-gray-300">·</span>
                <a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">
                  Reuse ingredients across dinners
                </a>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Add Item & List Panel */}
      <div className="space-y-4">
        {hasScheduledDinners && (
        <div className="space-y-1">
          {/* Custom Item Form */}
          <form onSubmit={handleAddCustom} className="relative group max-w-2xl mx-auto">
            <input 
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Add an extra item to your list..."
              className="w-full py-2 bg-white border border-gray-100 rounded text-[14px] focus:ring-4 focus:ring-accent/5 focus:border-accent/20 outline-none transition-all px-4"
            />
            <button 
              type="submit"
              disabled={!customItem.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-accent disabled:opacity-30 transition-colors"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
          </form>
        </div>
        )}

        {!hasVisibleShoppingItems ? (
          <div className="py-8 text-center space-y-3 px-4 bg-white rounded max-w-md mx-auto">
            <div className="bg-gray-50 w-10 h-10 rounded flex items-center justify-center mx-auto">
               <ShoppingCart className="w-5 h-5 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">No shopping list yet</h3>
              <p className="text-[13px] text-gray-500 mx-auto leading-relaxed font-medium">
                Schedule dinners to build your shopping list.
              </p>
            </div>
          </div>
        ) : (
          <LayoutGroup id="shopping-list-items">
          <div className="space-y-6 max-w-6xl mx-auto">
            {categories.length === 0 && pantryGotItItems.length > 0 && (
               <div className="py-6 text-center space-y-3 px-4 sm:px-6 bg-emerald-50/20 rounded max-w-lg mx-auto">
                  <div className="bg-white border border-gray-100 w-10 h-10 rounded flex items-center justify-center mx-auto mb-2">
                     <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-[14px] text-gray-900 font-bold">You're all set!</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                    Everything required for your {planner.length} planned {planner.length === 1 ? 'dinner' : 'dinners'} is in stock.
                  </p>
                  <button 
                    onClick={() => setShowPantry(true)}
                    className="text-[12px] text-accent font-bold hover:underline cursor-pointer"
                  >
                    View in-stock list ({pantryGotItItems.length})
                  </button>
               </div>
            )}

            {/* List Categories (To Buy List) */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <p className="text-[12px] text-gray-500 font-medium bg-gray-50/80 py-1.5 px-3 rounded inline-block mb-1">
                  Tick items you already have to reduce your estimated spend.
                </p>
                <div className="shopping-category-list mt-2">
                <AnimatePresence initial={false}>
                {categories.map(category => {
                  const isSmall = groupedItems[category].length <= 2;
                  return (
                    <motion.div
                      key={category} 
                      layout
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: 'easeOut' }}
                      className={`shopping-category-card mb-3 bg-white border border-gray-100 rounded hover:border-gray-200 transition-colors ${
                        isSmall ? 'p-2 md:p-1.5 lg:p-2' : 'p-2.5 md:p-2 lg:p-2.5'
                      }`}
                    >
                      {/* Category Header */}
                    <div className="flex items-center justify-between border-b border-gray-50 pb-0 mb-0.5">
                      <h4 className="font-bold text-[10px] tracking-wider text-gray-500 uppercase">
                        {category}
                      </h4>
                      {category.toLowerCase().includes('cupboard') && (
                        <Tooltip 
                          text="Cupboard items are everyday pantry staples (like oil, salt, and flour) that you likely already have. Check them off to remove them from your active shopping list and total cost estimate." 
                          position="top" 
                          align="center"
                        >
                          <button 
                            type="button"
                            className="p-1 hover:bg-gray-50 rounded-full transition-colors focus:outline-none flex items-center justify-center cursor-help"
                            aria-label="About cupboard items"
                          >
                            <Info className="w-4 h-4 text-gray-500 hover:text-accent transition-colors" />
                          </button>
                        </Tooltip>
                      )}
                    </div>

                    {/* Items List Wrapper */}
                    <div className="flex flex-col">
                      <AnimatePresence initial={false}>
                      {groupedItems[category].map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          layoutId={`shopping-item-${item.id}`}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                          transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: 'easeOut' }}
                          className={`flex items-center justify-between py-0 px-2 -mx-2 rounded group transition-all relative ${
                            (item.inStock || item.checked) ? 'bg-gray-50/50 opacity-60' : 'hover:bg-gray-50/30'
                          }`}
                        >
                          <div className="flex items-center gap-1 min-w-0 flex-1">
                            {/* Checkbox / Tap Target Area */}
                            <button 
                              onClick={() => handleToggleItem(item)}
                              aria-label={`Mark ${item.name} as ${item.inStock || item.checked ? 'needing purchase' : 'already in stock'}`}
                              className="p-2 -ml-2 group/cb focus:outline-none"
                            >
                              <div className={`w-[17px] h-[17px] rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer group-focus-visible/cb:ring-2 group-focus-visible/cb:ring-accent/30 ${
                                (item.inStock || item.checked) 
                                  ? 'bg-gray-900 border-gray-900' 
                                  : 'bg-white border-gray-200 group-hover/cb:border-accent group-hover/cb:ring-2 group-hover/cb:ring-accent/10'
                              }`}>
                                {(item.inStock || item.checked) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                              </div>
                            </button>

                            {/* Input / Item Name */}
                            <div className="flex-grow min-w-0">
                              {editingItemId === item.id ? (
                                <input 
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={saveEdit}
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                  className="w-full bg-white border border-gray-100 py-1 text-[13px] outline-none rounded px-2"
                                />
                              ) : (
                                <span 
                                  onClick={() => startEditing(item)}
                                  className={`text-[13px] cursor-text transition-all break-words leading-tight font-medium hover:text-accent ${(item.inStock || item.checked) ? 'text-gray-500' : 'text-gray-700'}`}
                                >
                                  {getDisplayItemName(item.name)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Day Badges and Hover Actions */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5 relative">
                            {/* Day Badges Grouped on the Right */}
                            <div className="flex gap-0.5 items-center flex-wrap justify-end sm:group-hover:opacity-0 transition-opacity">
                              {item.sourceDays && item.sourceDays.length > 0 && item.sourceDays.map(d => (
                                <span 
                                  key={d} 
                                  className="text-[9px] leading-none font-bold bg-gray-100/80 text-gray-500 px-1 py-[1.5px] rounded uppercase"
                                >
                                  {d.slice(0, 3)}
                                </span>
                              ))}
                            </div>

                            {/* Hover Actions Menu */}
                            <div className="static sm:absolute sm:right-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white pl-1 sm:pl-2">
                              <button 
                                onClick={() => handleDeleteItem(item)}
                                className="p-1 text-gray-300 hover:text-red-500 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      </AnimatePresence>
                    </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            </div>
            )}

            {/* Pantry / Got It Section */}
            {pantryGotItItems.length > 0 && (
              <div className="space-y-4 pt-10 border-t border-gray-100">
                <div className="flex items-center justify-between w-full">
                  <button 
                    onClick={() => setShowPantry(!showPantry)}
                    className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <span>Pantry / Got It ({pantryGotItItems.length} {pantryGotItItems.length === 1 ? 'item' : 'items'})</span>
                    {showPantry ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {/* Info Tooltip */}
                  <div className="relative group/pantry-tooltip flex items-center">
                    <Info className="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-help" />
                    <span className="absolute bottom-full right-0 mb-2 w-64 p-2.5 bg-gray-900 text-white text-[11px] leading-relaxed rounded opacity-0 pointer-events-none group-hover/pantry-tooltip:opacity-100 transition-opacity z-20 shadow-md font-medium">
                      Items marked here will automatically stay in your pantry for future shopping lists.
                    </span>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                {showPantry && (
                  <motion.div 
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.2, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-3">
                      <AnimatePresence initial={false}>
                      {pantryGotItItems.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          layoutId={`shopping-item-${item.id}`}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                          transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: 'easeOut' }}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50/50 hover:bg-gray-50 rounded group transition-all"
                        >
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            <button 
                              onClick={() => handleToggleItem(item)}
                              aria-label={`Restore ${item.name} to shopping list`}
                              className="w-[20px] h-[20px] rounded border bg-gray-900 border-gray-900 text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </button>
                            <span className="text-[13px] text-gray-500 line-through opacity-60 truncate">
                              {getDisplayItemName(item.name)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleToggleItem(item)}
                              className="text-[11px] text-accent font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item)}
                              className="p-1 text-gray-300 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      </AnimatePresence>
                    </div>

                    {/* Manual In stock Pantry Staples (Original persistence) */}
                    {pantry.length > 0 && (
                      <div className="space-y-2 pt-6 border-t border-gray-100">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manual Staples & Extras</p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {pantry.map(p => (
                              <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-100 rounded text-[12px] text-gray-500 hover:border-gray-200 transition-colors">
                                <span>{p.name}</span>
                                <button 
                                  onClick={() => removeFromPantry(p.id)}
                                  className="text-gray-300 hover:text-red-500 py-0.5 cursor-pointer"
                                >
                                  <CircleX size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                      </div>
                    )}
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            )}
          </div>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
};
