import { SavedRecipe, ShoppingListItem, PantryItem } from '../types';
import { costItemSync } from '../services/groceryService';

export const SHOPPING_CATEGORIES: Record<string, string[]> = {
  'Meat & fish': ['chicken', 'beef', 'pork', 'lamb', 'steak', 'sausage', 'bacon', 'ham', 'turkey', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'meat', 'fillet', 'thigh', 'breast', 'cod', 'haddock', 'sea bass', 'chorizo', 'salami'],
  'Dairy & eggs': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg', 'parmesan', 'cheddar', 'mozzarella', 'feta', 'halloumi', 'sour cream', 'crème fraîche', 'creme fraiche'],
  'Cupboard': ['oil', 'vinegar', 'salt', 'pepper', 'spice', 'flour', 'sugar', 'rice', 'pasta', 'noodle', 'stock', 'broth', 'sauce', 'soy', 'honey', 'syrup', 'nut', 'seed', 'mustard', 'mayo', 'ketchup', 'tahini', 'curry paste', 'bouillon', 'cumin', 'curry', 'turmeric', 'paprika', 'cinnamon', 'oregano'],
  'Veg & fruit': ['apple', 'banana', 'onion', 'garlic', 'spinach', 'lettuce', 'tomato', 'carrot', 'potato', 'herb', 'fruit', 'vegetable', 'lemon', 'lime', 'ginger', 'pepper', 'cucumber', 'broccoli', 'cauliflower', 'cabbage', 'kale', 'mushroom', 'celery', 'avocado', 'salad', 'coriander', 'parsley', 'basil', 'thyme', 'rosemary', 'mint', 'chili', 'chilli', 'leek', 'zucchini', 'courgette', 'eggplant', 'aubergine', 'squash'],
  'Tins & jars': ['bean', 'lentil', 'chickpea', 'canned', 'tin', 'coconut milk', 'chopped tomatoes', 'passata', 'pesto'],
  'Bakery': ['bread', 'roll', 'baguette', 'tortilla', 'wrap', 'naan', 'pita'],
  'Frozen': ['frozen', 'ice cream', 'peas', 'corn', 'sorbet'],
};

/**
 * Simple singularization for merging similar ingredients
 */
export const singularize = (str: string): string => {
  const s = str.toLowerCase().trim();
  if (s.endsWith('ies') && s.length > 3) return s.slice(0, -3) + 'y'; 
  if (s.endsWith('oes') && s.length > 3) return s.slice(0, -2);        
  if (s.endsWith('s') && s.length > 3 && !s.endsWith('ss') && !s.endsWith('us')) return s.slice(0, -1); 
  return s;
};

export const getIngredientCategory = (ingredient: string): string => {
  const lower = ingredient.toLowerCase();

  // Resolve common overlaps before the broad keyword scan. Without this,
  // "eggplant" can match "egg" and "red pepper" can match cupboard pepper.
  if (/\b(eggplant|aubergine)\b/.test(lower)) return 'Veg & fruit';
  if (/\b(red|green|yellow|orange|bell|sweet) pepper\b/.test(lower)) return 'Veg & fruit';
  if (/\b(black|white|pink|sichuan) pepper\b|\bpeppercorns?\b/.test(lower)) return 'Cupboard';

  for (const [cat, keywords] of Object.entries(SHOPPING_CATEGORIES)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'Other';
};

export const parseIngredientName = (ing: string) => {
  const units = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'cups', 'oz', 'lb', 'bunch', 'bunches', 'clove', 'cloves', 'can', 'cans', 'tin', 'tins', 'pack', 'packs', 'bag', 'bags', 'slice', 'slices', 'head', 'heads', 'clove', 'cloves', 'knob', 'pinch', 'piece', 'pieces'];
  const unitRegex = new RegExp(`^([\\d\\/\\.\\-\\s½⅓¼¾⅔⅜⅝⅞]+)\\s*(${units.join('|')})\\s+(.*)$`, 'i');
  const match = ing.match(unitRegex);
  
  if (match) {
    return {
      quantity: match[1].trim(),
      unit: match[2].trim().toLowerCase(),
      name: match[3].trim()
    };
  }
  
  const numMatch = ing.match(/^([\d\/\.\-\s½⅓¼¾⅔⅜⅝⅞]+)\s+(.*)$/);
  if (numMatch) {
    return {
      quantity: numMatch[1].trim(),
      unit: '',
      name: numMatch[2].trim()
    };
  }

  return { quantity: '', unit: '', name: ing.trim() };
};

export interface ShoppingListDerivationOptions {
  planner: SavedRecipe[];
  pantry: PantryItem[];
  existingItems: ShoppingListItem[];
  userId: string;
  onLog?: (msg: string) => void;
  persistentPantryKeys?: string[];
}

/**
 * Normalizes an ingredient name to a clean identifier string.
 * Strips out quantities, units, parentheses, and normalizes plurals.
 * Strips out common preparation adjectives (e.g. diced, chopped) to ensure smart aggregation.
 */
export function normalizeIngredientKey(name: string): string {
  // 1. Remove anything in parentheses
  let cleaned = name.split('(')[0];
  // 2. Parse out ingredient name (tries to strip standard quantities and units)
  const parsed = parseIngredientName(cleaned);
  let ingredientName = parsed.name || cleaned;
  
  // Clean up common descriptors and prep methods or prefixes
  let lowerName = ingredientName.toLowerCase().trim();
  const descriptors = [
    'diced', 'chopped', 'sliced', 'minced', 'grated', 'peeled', 'halved', 'quartered', 
    'crushed', 'shredded', 'pureed', 'cooked', 'fresh', 'raw', 'ground', 'fine', 'finely',
    'extra virgin', 'virgin', 'organic', 'large', 'small', 'medium', 'clove of', 'cloves of',
    'can of', 'cans of', 'tin of', 'tins of', 'packet of', 'pack of', 'cups of', 'cup of',
    'teaspoon of', 'teaspoons of', 'tablespoon of', 'tablespoons of', 'tbsp of', 'tsp of',
    'bunch of', 'bunches of', 'pinch of', 'pinches of', 'head of', 'heads of', 'piece of', 'pieces of',
    'handful of', 'handfuls of', 'bag of', 'bags of', 'bottle of', 'bottles of', 'jar of', 'jars of',
    'cloves', 'clove'
  ];
  
  descriptors.forEach(desc => {
    const regex = new RegExp(`\\b${desc}\\b`, 'gi');
    lowerName = lowerName.replace(regex, '');
  });
  
  // Clean up any remaining leading/trailing "of" or dangling commas/spaces
  lowerName = lowerName.replace(/^\s*of\s+/i, '').replace(/\bof\b/gi, '').trim();

  // 3. Lowercase, lowercase singularize, replace non-alphanumeric with hyphen
  let key = singularize(lowerName);
  key = key.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return key || 'unknown';
}

/**
 * Generates a beautiful, descriptive, and clean title for an ingredient display.
 * Strips out descriptors and ensures elegant title casing.
 */
export function cleanIngredientName(name: string): string {
  let cleaned = name.split('(')[0];
  const parsed = parseIngredientName(cleaned);
  let result = parsed.name || cleaned;
  
  const descriptors = [
    'diced', 'chopped', 'sliced', 'minced', 'grated', 'peeled', 'halved', 'quartered', 
    'crushed', 'shredded', 'pureed', 'cooked', 'fresh', 'raw', 'ground', 'fine', 'finely',
    'extra virgin', 'virgin', 'organic', 'large', 'small', 'medium', 'clove of', 'cloves of',
    'can of', 'cans of', 'tin of', 'tins of', 'packet of', 'pack of', 'cups of', 'cup of',
    'teaspoon of', 'teaspoons of', 'tablespoon of', 'tablespoons of', 'tbsp of', 'tsp of',
    'bunch of', 'bunches of', 'pinch of', 'pinches of', 'head of', 'heads of', 'piece of', 'pieces of',
    'handful of', 'handfuls of', 'bag of', 'bags of', 'bottle of', 'bottles of', 'jar of', 'jars of'
  ];
  
  descriptors.forEach(desc => {
    const regex = new RegExp(`\\b${desc}\\b`, 'gi');
    result = result.replace(regex, '');
  });
  
  result = result.replace(/^\s*of\s+/i, '').replace(/\bof\b/gi, '').replace(/,/g, '').replace(/\s+/g, ' ').trim();
  
  if (!result) return cleaned;
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export interface ConsolidatedIngredient {
  id: string; // normalized key
  name: string; // clean display name
  category: string;
  sourceRecipeIds: string[];
  sourceDays: string[];
  unitQuantities: Record<string, number>; // e.g. { "g": 250, "": 2 }
  unparseableQuantities: string[];
}

export interface SupermarketPlanSummary {
  plannedDinnerCount: number;
  preferredSupermarkets: string[];
  estimatedDinnerCost: number;
  estimatedBasketCost: number;
  shopWeight: 'light' | 'balanced' | 'heavy';
  headline: string;
  costExplanation: string;
  reusedIngredients: ConsolidatedIngredient[];
  oneUseIngredients: ConsolidatedIngredient[];
  readyMadeCount: number;
  homemadeCount: number;
  planNotes: string[];
}

/**
 * Scans the weekly schedule, pulls ingredient lists from all assigned recipes, 
 * and merges them into a mathematically aggregated, unified data structure.
 */
export function aggregateWeeklyIngredients(planner: SavedRecipe[]): ConsolidatedIngredient[] {
  const totalIngredientsMap = new Map<string, ConsolidatedIngredient>();

  planner.forEach(entry => {
    const mode = entry.mode || (entry.retailer ? 'ready-made' : 'cook');

    if (mode === 'ready-made') {
      const baseServings = entry.totalServings || 1;
      const requested = entry.requestedServings || 1;
      const packsCount = Math.ceil(requested / baseServings);
      
      const name = entry.retailer ? `${entry.retailer}: ${entry.title}` : `Recipe: ${entry.title}`;
      const key = normalizeIngredientKey(name);
      const recipeId = entry.id || entry.recipeId || 'unknown';
      const day = entry.scheduledDate || 'unscheduled';

      if (totalIngredientsMap.has(key)) {
        const existing = totalIngredientsMap.get(key)!;
        if (!existing.sourceRecipeIds.includes(recipeId)) {
          existing.sourceRecipeIds.push(recipeId);
        }
        if (entry.scheduledDate && !existing.sourceDays.includes(day)) {
          existing.sourceDays.push(day);
        }
        existing.unitQuantities['pack'] = (existing.unitQuantities['pack'] || 0) + packsCount;
      } else {
        totalIngredientsMap.set(key, {
          id: key,
          name: name,
          unitQuantities: { 'pack': packsCount },
          unparseableQuantities: [],
          category: 'Ready-made dinners',
          sourceRecipeIds: [recipeId],
          sourceDays: entry.scheduledDate ? [day] : []
        });
      }
      return;
    }

    if (entry.ingredients && entry.ingredients.length > 0) {
      const baseServings = entry.totalServings || 2;
      const requested = entry.requestedServings || 2;
      const scale = requested / baseServings;

      entry.ingredients.forEach(ing => {
        try {
          const key = normalizeIngredientKey(ing);
          if (!key || key === 'unknown') return;

          const { quantity, unit, name } = parseIngredientName(ing);
          const numericQty = parseNumericQuantity(quantity) * scale;
          const recipeId = entry.id || entry.recipeId || 'unknown';
          const day = entry.scheduledDate || 'unscheduled';

          if (totalIngredientsMap.has(key)) {
            const existing = totalIngredientsMap.get(key)!;
            if (!existing.sourceRecipeIds.includes(recipeId)) {
              existing.sourceRecipeIds.push(recipeId);
            }
            if (entry.scheduledDate && !existing.sourceDays.includes(day)) {
              existing.sourceDays.push(day);
            }
            
            if (numericQty > 0) {
              existing.unitQuantities[unit] = (existing.unitQuantities[unit] || 0) + numericQty;
            } else if (quantity) {
              const strQty = quantity + (unit ? ' ' + unit : '');
              if (!existing.unparseableQuantities.includes(strQty)) {
                existing.unparseableQuantities.push(strQty);
              }
            }
          } else {
            const cleanName = cleanIngredientName(name);
            totalIngredientsMap.set(key, {
              id: key,
              name: cleanName,
              unitQuantities: numericQty > 0 ? { [unit]: numericQty } : {},
              unparseableQuantities: (numericQty === 0 && quantity) ? [quantity + (unit ? ' ' + unit : '')] : [],
              category: getIngredientCategory(key),
              sourceRecipeIds: [recipeId],
              sourceDays: entry.scheduledDate ? [day] : []
            });
          }
        } catch (e) {
          // ignore parsing error
        }
      });
    }
  });

  return Array.from(totalIngredientsMap.values());
}

const parseMoney = (value?: string): number => {
  if (!value) return 0;
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export function buildSupermarketPlanSummary(
  planner: SavedRecipe[],
  preferredSupermarkets: string[] = []
): SupermarketPlanSummary {
  const scheduled = planner.filter(entry => !!entry.scheduledDate);
  const ingredients = aggregateWeeklyIngredients(scheduled);
  const reusedIngredients = ingredients
    .filter(item => item.sourceRecipeIds.length > 1)
    .sort((a, b) => b.sourceRecipeIds.length - a.sourceRecipeIds.length || a.name.localeCompare(b.name));
  const oneUseIngredients = ingredients
    .filter(item => item.sourceRecipeIds.length === 1 && item.category !== 'Ready-made dinners')
    .sort((a, b) => {
      const categoryRank = (category: string) => category === 'Veg & fruit' || category === 'Dairy & eggs' ? 0 : 1;
      return categoryRank(a.category) - categoryRank(b.category) || a.name.localeCompare(b.name);
    });

  const estimatedDinnerCost = scheduled.reduce((total, item) => {
    const perPortion = parseMoney(item.costPerPortion || item.price);
    const servings = item.requestedServings || item.totalServings || 1;
    return total + (perPortion * servings);
  }, 0);

  const extraBasketBuffer = Math.min(oneUseIngredients.length * 0.85, 12);
  const estimatedBasketCost = estimatedDinnerCost > 0
    ? estimatedDinnerCost + extraBasketBuffer
    : 0;
  const readyMadeCount = scheduled.filter(item => item.mode === 'ready-made' || !!item.retailer).length;
  const homemadeCount = scheduled.length - readyMadeCount;
  const shopWeight: SupermarketPlanSummary['shopWeight'] = oneUseIngredients.length >= 16
    ? 'heavy'
    : reusedIngredients.length >= 4 || oneUseIngredients.length <= 6
      ? 'light'
      : 'balanced';
  const headline = scheduled.length === 1
    ? 'Add more dinners to sense-check the week.'
    : shopWeight === 'heavy'
      ? 'This plan may feel shop-heavy.'
      : shopWeight === 'light'
        ? 'This plan makes good use of the shop.'
        : 'This plan looks workable, with a few extra buys.';
  const costExplanation = estimatedDinnerCost > 0
    ? shopWeight === 'heavy'
      ? `Dinners total about £${estimatedDinnerCost.toFixed(2)}, but the first shop may feel closer to £${estimatedBasketCost.toFixed(2)} because several ingredients are only used once.`
      : `Dinners total about £${estimatedDinnerCost.toFixed(2)}; the first shop may feel closer to £${estimatedBasketCost.toFixed(2)} once partial packs and extras are included.`
    : 'Build the shopping list to see what this week is likely to need.';
  const planNotes: string[] = [];

  if (reusedIngredients.length > 0) {
    planNotes.push(`${reusedIngredients.length} ${reusedIngredients.length === 1 ? 'ingredient is' : 'ingredients are'} reused across dinners.`);
  } else if (scheduled.length > 1) {
    planNotes.push('No obvious ingredient overlap yet.');
  }

  if (oneUseIngredients.length > 0) {
    planNotes.push(`${oneUseIngredients.length} likely one-use ${oneUseIngredients.length === 1 ? 'ingredient' : 'ingredients'} in this plan.`);
  }

  if (readyMadeCount > 0 && homemadeCount > 0) {
    planNotes.push(`Mixes ${homemadeCount} homemade and ${readyMadeCount} ready-made ${readyMadeCount === 1 ? 'backup' : 'options'}.`);
  }

  return {
    plannedDinnerCount: scheduled.length,
    preferredSupermarkets,
    estimatedDinnerCost,
    estimatedBasketCost,
    shopWeight,
    headline,
    costExplanation,
    reusedIngredients,
    oneUseIngredients,
    readyMadeCount,
    homemadeCount,
    planNotes
  };
}

const parseNumericQuantity = (q: string): number => {
  if (!q) return 0;
  const normalized = q.trim()
    .replace(/½/g, ' 1/2').replace(/⅓/g, ' 1/3').replace(/¼/g, ' 1/4')
    .replace(/¾/g, ' 3/4').replace(/⅔/g, ' 2/3').replace(/⅜/g, ' 3/8')
    .replace(/⅝/g, ' 5/8').replace(/⅞/g, ' 7/8')
    .replace(/\s+/g, ' ');

  // For a stated range, use the upper bound so the list does not under-buy.
  const range = normalized.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
  if (range) return Number(range[2]);

  const mixed = normalized.match(/^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const denominator = Number(mixed[3]);
    return denominator > 0 ? Number(mixed[1]) + Number(mixed[2]) / denominator : 0;
  }

  const fraction = normalized.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator > 0 ? Number(fraction[1]) / denominator : 0;
  }

  const val = Number(normalized);
  return Number.isFinite(val) ? val : 0;
};

/**
 * PURE derivation of the shopping list from the weekly schedule.
 * Merges ingredients, applies pantry filters, and preserves custom items/checked states.
 */
export function buildShoppingListData(options: ShoppingListDerivationOptions): ShoppingListItem[] {
  const { planner, pantry, existingItems, userId, onLog } = options;
  
  onLog?.(`Starting derivation for ${planner.length} recipes.`);

  // 1. Perform dynamic plan-wide aggregation of all scheduled recipes
  const aggregatedIngredients = aggregateWeeklyIngredients(planner);
  
  // Preserve checked status ONLY if the state hash hasn't changed
  const validCheckStates = new Map<string, boolean>();
  existingItems.forEach(item => {
    if (item.checked && item.stateHash) {
      validCheckStates.set(item.stateHash, true);
    }
  });

  const customItems = existingItems.filter(i => i.isCustom);
  const pantryKeys = new Set(pantry.map(p => normalizeIngredientKey(p.name)));

  const derivedItems: ShoppingListItem[] = [];

  // 2. Add derived consolidated items from the plan
  aggregatedIngredients.forEach(data => {
    const key = data.id; // already normalized key (e.g. "onion")
    
    // Format the display name with summed quantities
    const quantityStrings: string[] = [];
    
    Object.entries(data.unitQuantities).forEach(([unit, qty]) => {
      // Round to 2 decimal places if needed
      const roundedQty = Math.round(qty * 100) / 100;
      if (unit === '') {
        quantityStrings.push(roundedQty.toString());
      } else {
        quantityStrings.push(`${roundedQty}${unit}`);
      }
    });
    
    // Add any that couldn't be parsed as numbers (e.g. "a splash")
    data.unparseableQuantities.forEach(q => {
      if (!quantityStrings.includes(q)) quantityStrings.push(q);
    });

    let finalName = '';
    if (quantityStrings.length > 0) {
      // If there's only one numeric quantity, put it in front
      if (quantityStrings.length === 1) {
        finalName = `${quantityStrings[0]} ${data.name}`;
      } else {
        finalName = `${data.name} (${quantityStrings.join(' + ')})`;
      }
    } else {
      finalName = data.name;
    }

    const normKey = key;
    const isExcluded = pantryKeys.has(key) || !!(options.persistentPantryKeys && (options.persistentPantryKeys.includes(key) || options.persistentPantryKeys.includes(normKey)));
    const sourceRecipeIds = Array.from(data.sourceRecipeIds);
    const stateHash = `${key}|${finalName}|${[...sourceRecipeIds].sort().join(',')}|${[...data.sourceDays].sort().join(',')}`;
    const safeKey = key.replace(/[^a-z0-9]/g, '_');
    const existingMatch = existingItems.find(ei => ei.ingredientKey === key && !ei.isCustom);

    derivedItems.push(costItemSync({
      id: existingMatch?.id || `derived-${safeKey}`,
      name: finalName,
      nameRaw: finalName,
      ingredientKey: key, 
      quantityNeeded: 1, 
      unitNeeded: "each",
      category: data.category,
      checked: validCheckStates.has(stateHash),
      inStock: validCheckStates.has(stateHash) || isExcluded,
      stateHash: stateHash,
      sourceRecipeIds: sourceRecipeIds,
      sourceDays: Array.from(data.sourceDays),
      generatedAt: existingMatch?.generatedAt || null,
      userId: userId,
      excludedByPantry: isExcluded
    }));
  });

  // 2. Add custom items
  customItems.forEach(ci => {
    derivedItems.push({
      ...ci,
      category: 'Added items',
      checked: ci.checked || false,
      inStock: ci.inStock || ci.checked || false
    });
  });

  return derivedItems;
}
