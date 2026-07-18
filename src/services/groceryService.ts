import { ShoppingListItem } from '../types';
import { parseNumber } from '../lib/measurementUtils';

export interface GroceryProduct {
  retailer: "tesco" | "sainsburys" | "asda" | "waitrose" | "morrisons";
  productId: string;
  title: string;
  brand?: string;
  packPrice: number;
  promoPrice?: number;
  currency: "GBP";
  packSizeText: string;
  unitPriceText?: string;
  quantityInPack?: number;
  unitInPack?: "g" | "ml" | "each" | "kg" | "l";
  matchConfidence: number;
}

export const INGREDIENT_PRICE_CATALOGUE_META = {
  label: 'Typical UK reference prices',
  version: '2026-07-18',
  retailer: 'UK supermarket reference basket',
  sourceType: 'curated-reference' as const,
};

export interface ShoppingCostSummary {
  proportionalTotal: number;
  checkoutTotal: number;
  totalItemCount: number;
  pricedItemCount: number;
  referenceMatchCount: number;
  fallbackMatchCount: number;
  excludedStapleCount: number;
}

type CatalogueUnit = 'g' | 'kg' | 'ml' | 'l' | 'each';

export interface IngredientPriceCatalogueEntry {
  ingredientKey: string;
  aliases: string[];
  productLabel: string;
  packPrice: number;
  packQuantity: number;
  packUnit: CatalogueUnit;
  retailer: string;
  catalogueVersion: string;
  sourceType: typeof INGREDIENT_PRICE_CATALOGUE_META.sourceType;
  sourceUrl?: string;
  verifiedAt?: string;
}

/**
 * Static price basis for estimated costs.
 * These reflect typical UK supermarket prices per standard unit.
 */
const REFERENCE_PRICE_VALUES: Record<string, { price: number; unit: CatalogueUnit; quantity: number }> = {
  'chicken': { price: 3.00, unit: 'g', quantity: 400 },
  'beef': { price: 5.00, unit: 'g', quantity: 500 },
  'pork': { price: 4.00, unit: 'g', quantity: 500 },
  'salmon': { price: 5.00, unit: 'g', quantity: 240 },
  'cod': { price: 4.50, unit: 'g', quantity: 250 },
  'chorizo': { price: 2.50, unit: 'g', quantity: 200 },
  'prawn': { price: 5.00, unit: 'g', quantity: 250 },
  'shrimp': { price: 5.00, unit: 'g', quantity: 250 },
  'bacon': { price: 2.00, unit: 'g', quantity: 200 },
  'milk': { price: 1.50, unit: 'l', quantity: 2 },
  'cream': { price: 1.30, unit: 'ml', quantity: 300 },
  'cheese': { price: 2.50, unit: 'g', quantity: 400 },
  'cheddar': { price: 2.50, unit: 'g', quantity: 400 },
  'parmesan': { price: 3.00, unit: 'g', quantity: 200 },
  'egg': { price: 2.50, unit: 'each', quantity: 12 },
  'onion': { price: 1.00, unit: 'kg', quantity: 1 },
  'garlic': { price: 0.75, unit: 'each', quantity: 3 },
  'ginger': { price: 0.60, unit: 'g', quantity: 100 },
  'chili': { price: 0.60, unit: 'g', quantity: 50 },
  'chilli': { price: 0.60, unit: 'g', quantity: 50 },
  'lemon': { price: 0.30, unit: 'each', quantity: 1 },
  'lime': { price: 0.25, unit: 'each', quantity: 1 },
  'soy': { price: 1.00, unit: 'ml', quantity: 150 },
  'honey': { price: 1.50, unit: 'g', quantity: 340 },
  'mustard': { price: 1.00, unit: 'g', quantity: 180 },
  'mayo': { price: 1.20, unit: 'ml', quantity: 400 },
  'ketchup': { price: 1.20, unit: 'g', quantity: 400 },
  'cumin': { price: 1.00, unit: 'g', quantity: 40 },
  'paprika': { price: 1.00, unit: 'g', quantity: 40 },
  'turmeric': { price: 1.00, unit: 'g', quantity: 40 },
  'coriander': { price: 0.70, unit: 'g', quantity: 50 },
  'basil': { price: 0.70, unit: 'g', quantity: 50 },
  'parsley': { price: 0.70, unit: 'g', quantity: 50 },
  'thyme': { price: 0.70, unit: 'g', quantity: 20 },
  'rosemary': { price: 0.70, unit: 'g', quantity: 20 },
  'mint': { price: 0.70, unit: 'g', quantity: 30 },
  'oregano': { price: 1.00, unit: 'g', quantity: 10 },
  'curry': { price: 1.00, unit: 'g', quantity: 80 },
  'paste': { price: 1.50, unit: 'g', quantity: 200 },
  'potato': { price: 1.50, unit: 'kg', quantity: 2.5 },
  'carrot': { price: 0.60, unit: 'kg', quantity: 1 },
  'spinach': { price: 1.70, unit: 'g', quantity: 250 },
  'herb': { price: 0.70, unit: 'each', quantity: 1 },
  'pasta': { price: 0.75, unit: 'g', quantity: 500 },
  'penne': { price: 0.75, unit: 'g', quantity: 500 },
  'rice': { price: 1.50, unit: 'kg', quantity: 1 },
  'tomato': { price: 1.00, unit: 'each', quantity: 6 },
  'cherry tomato': { price: 1.00, unit: 'g', quantity: 250 },
  'pepper': { price: 1.50, unit: 'each', quantity: 3 },
  'butter': { price: 2.00, unit: 'g', quantity: 250 },
  'bread': { price: 1.20, unit: 'each', quantity: 1 },
  'oil': { price: 4.00, unit: 'l', quantity: 1 },
  'flour': { price: 1.00, unit: 'kg', quantity: 1.5 },
  'sugar': { price: 1.00, unit: 'kg', quantity: 1 },
  'bean': { price: 0.50, unit: 'g', quantity: 400 },
  'chickpea': { price: 0.50, unit: 'g', quantity: 400 },
  'lentil': { price: 1.00, unit: 'g', quantity: 500 },
  'coconut milk': { price: 0.80, unit: 'ml', quantity: 400 },
  'chopped tomatoes': { price: 0.50, unit: 'g', quantity: 400 },
  'passata': { price: 0.60, unit: 'g', quantity: 500 },
  'pesto': { price: 1.10, unit: 'g', quantity: 190 },
};

export const INGREDIENT_PRICE_CATALOGUE: Record<string, IngredientPriceCatalogueEntry> = Object.fromEntries(
  Object.entries(REFERENCE_PRICE_VALUES).map(([ingredientKey, basis]) => [ingredientKey, {
    ingredientKey,
    aliases: [ingredientKey],
    productLabel: `${ingredientKey} reference pack`,
    packPrice: basis.price,
    packQuantity: basis.quantity,
    packUnit: basis.unit,
    retailer: INGREDIENT_PRICE_CATALOGUE_META.retailer,
    catalogueVersion: INGREDIENT_PRICE_CATALOGUE_META.version,
    sourceType: INGREDIENT_PRICE_CATALOGUE_META.sourceType,
  }])
);

/**
 * Typical metric weight (in grams) or volume (in ml) for a single piece ("each") of an ingredient.
 * Used to correctly scale estimated costs when there's a unit mismatch.
 */
const ESTIMATED_PIECE_WEIGHTS: Record<string, number> = {
  'chicken': 170,     // 170g per breast/thigh portion
  'beef': 200,        // 200g per steak/portion
  'pork': 150,        // 150g per pork chop/portion
  'salmon': 120,      // 120g per salmon fillet
  'cod': 125,         // 125g per cod fillet
  'chorizo': 100,     // 100g per chorizo sausage link
  'onion': 150,       // 150g per onion
  'potato': 175,      // 175g per potato
  'carrot': 75,       // 75g per carrot
  'spinach': 100,     // 100g per handful/bag
  'tomato': 80,       // 80g per tomato
  'cherry tomato': 15, // 15g per cherry tomato
  'pepper': 150,      // 150g per bell pepper
  'lemon': 80,        // 80g per lemon
  'lime': 50,         // 50g per lime
  'butter': 250,      // 250g per block
  'cheese': 200,      // 200g per unit
  'cheddar': 200,     // 200g per unit
  'parmesan': 100,    // 100g per unit
  'garlic': 15,       // 15g per garlic bulb
  'ginger': 15,       // 15g per piece of ginger
  'chili': 8,         // 8g per fresh chili
  'chilli': 8,        // 8g per fresh chilli
  'bread': 400,       // 400g per loaf
  'egg': 50,          // 50g per egg
};

/**
 * Gets the estimated weight/volume (in g/ml) for a single piece ("each") of the ingredient.
 */
function getPieceWeight(key: string): number {
  const matchedKey = Object.keys(ESTIMATED_PIECE_WEIGHTS).find(k => 
    key.toLowerCase().includes(k) || k.includes(key.toLowerCase())
  );
  return matchedKey ? ESTIMATED_PIECE_WEIGHTS[matchedKey] : 100; // default to 100g/ml
}

const CUSTOM_UNITS = [
  'g', 'kg', 'ml', 'l', 'each',
  'tsp', 'teaspoon', 'teaspoons',
  'tbsp', 'tablespoon', 'tablespoons',
  'clove', 'cloves',
  'sprig', 'sprigs',
  'pinch', 'pinches',
  'dash', 'dashes',
  'splash', 'splashes',
  'slice', 'slices',
  'leaf', 'leaves',
  'handful', 'handfuls',
  'bunch', 'bunches',
  'can', 'cans',
  'tin', 'tins',
  'pack', 'packs', 'packet', 'packets',
  'gram', 'grams', 'kilogram', 'kilograms',
  'millilitre', 'millilitres', 'litre', 'litres',
  'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds', 'cup', 'cups'
];

const UNIT_CONVERSIONS: Record<string, { qty: number, unit: "each" | "g" | "kg" | "ml" | "l" }> = {
  'g': { qty: 1, unit: 'g' },
  'gram': { qty: 1, unit: 'g' },
  'grams': { qty: 1, unit: 'g' },
  'kg': { qty: 1, unit: 'kg' },
  'kilogram': { qty: 1, unit: 'kg' },
  'kilograms': { qty: 1, unit: 'kg' },
  'ml': { qty: 1, unit: 'ml' },
  'millilitre': { qty: 1, unit: 'ml' },
  'millilitres': { qty: 1, unit: 'ml' },
  'l': { qty: 1, unit: 'l' },
  'litre': { qty: 1, unit: 'l' },
  'litres': { qty: 1, unit: 'l' },
  'each': { qty: 1, unit: 'each' },
  'oz': { qty: 28.35, unit: 'g' },
  'ounce': { qty: 28.35, unit: 'g' },
  'ounces': { qty: 28.35, unit: 'g' },
  'lb': { qty: 453.6, unit: 'g' },
  'lbs': { qty: 453.6, unit: 'g' },
  'pound': { qty: 453.6, unit: 'g' },
  'pounds': { qty: 453.6, unit: 'g' },
  'cup': { qty: 250, unit: 'ml' },
  'cups': { qty: 250, unit: 'ml' },

  'tsp': { qty: 5, unit: 'ml' },
  'teaspoon': { qty: 5, unit: 'ml' },
  'teaspoons': { qty: 5, unit: 'ml' },
  'tbsp': { qty: 15, unit: 'ml' },
  'tablespoon': { qty: 15, unit: 'ml' },
  'tablespoons': { qty: 15, unit: 'ml' },
  'pinch': { qty: 0.5, unit: 'g' },
  'pinches': { qty: 0.5, unit: 'g' },
  'dash': { qty: 1, unit: 'ml' },
  'dashes': { qty: 1, unit: 'ml' },
  'splash': { qty: 5, unit: 'ml' },
  'splashes': { qty: 5, unit: 'ml' },
  'clove': { qty: 5, unit: 'g' },
  'cloves': { qty: 5, unit: 'g' },
  'sprig': { qty: 2, unit: 'g' },
  'sprigs': { qty: 2, unit: 'g' },
  'slice': { qty: 10, unit: 'g' },
  'slices': { qty: 10, unit: 'g' },
  'leaf': { qty: 0.5, unit: 'g' },
  'leaves': { qty: 0.5, unit: 'g' },
  'handful': { qty: 30, unit: 'g' },
  'handfuls': { qty: 30, unit: 'g' },
  'bunch': { qty: 50, unit: 'g' },
  'bunches': { qty: 50, unit: 'g' },
  'can': { qty: 400, unit: 'g' },
  'cans': { qty: 400, unit: 'g' },
  'tin': { qty: 400, unit: 'g' },
  'tins': { qty: 400, unit: 'g' },
  'pack': { qty: 250, unit: 'g' },
  'packs': { qty: 250, unit: 'g' },
  'packet': { qty: 250, unit: 'g' },
  'packets': { qty: 250, unit: 'g' },
};

/**
 * Normalises a raw ingredient string into structured data.
 * e.g. "2 red onions" -> quantity 2, unit "each", key "red onion"
 * or "Penne pasta (300g)" -> quantity 300, unit "g", key "Penne pasta"
 */
export function normalizeIngredient(nameRaw: string): { 
  ingredientKey: string; 
  quantityNeeded: number; 
  unitNeeded: "each" | "g" | "kg" | "ml" | "l" 
} {
  const cleanStr = nameRaw.trim();
  const NUMBER_PATTERN = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)';
  
  // Regex 1: Standard "[quantity] [unit] [name]" or "[quantity] [name]"
  const standardRegex = new RegExp(`^(${NUMBER_PATTERN})\\s*(${CUSTOM_UNITS.join('|')})?\\s+(.*)$`, 'i');
  // Regex 2: Bracketed unit at end "[name] ([quantity] [unit])" or "[name] [quantity] [unit]"
  const tailRegex = new RegExp(`^(.*?)\\s*\\(?(${NUMBER_PATTERN})\\s*(${CUSTOM_UNITS.join('|')})?\\)?$`, 'i');

  let match = cleanStr.match(standardRegex);
  if (match) {
    const qty = parseNumber(match[1]);
    const unitRaw = (match[2] || 'each').toLowerCase();
    const namePart = match[3].trim().toLowerCase();
    return finalizeNormalization(namePart, qty, unitRaw);
  }

  match = cleanStr.match(tailRegex);
  if (match && match[2]) {
    const namePart = match[1].trim().toLowerCase();
    const qty = parseNumber(match[2]);
    const unitRaw = (match[3] || 'each').toLowerCase();
    return finalizeNormalization(namePart, qty, unitRaw);
  }

  return {
    ingredientKey: cleanStr.toLowerCase(),
    quantityNeeded: 1,
    unitNeeded: "each",
  };
}

function finalizeNormalization(namePart: string, qty: number, unitRaw: string): any {
  let key = namePart;
  // Simple singularization
  if (key.endsWith('ies') && key.length > 3) key = key.slice(0, -3) + 'y';
  else if (key.endsWith('oes') && key.length > 3) key = key.slice(0, -2);
  else if (key.endsWith('s') && key.length > 3 && !key.endsWith('ss') && !key.endsWith('us')) key = key.slice(0, -1);

  let quantity = qty;
  let unit: "each" | "g" | "kg" | "ml" | "l" = "each";

  const conv = UNIT_CONVERSIONS[(unitRaw || '').toLowerCase()];
  if (conv) {
    quantity = qty * conv.qty;
    unit = conv.unit;
  }

  return {
    ingredientKey: key,
    quantityNeeded: quantity,
    unitNeeded: unit,
  };
}

/**
 * Estimates cost for a single item based on static price data (Synchronous version).
 */
export function costItemSync(item: ShoppingListItem): ShoppingListItem {
  const { ingredientKey, quantityNeeded, unitNeeded } = normalizeIngredient(item.name || item.nameRaw);
  
  // Broad exclusions for pantry staples and unpriceable garnishes
  const exclusions = [
    'salt', 'pepper', 'water', 'oil', 'vinegar', 'spice', 'herb', 
    'seasoning', 'to taste', 'optional', 'flour', 'sugar', 'cornflour',
    'baking powder', 'bicarbonate of soda', 'yeast', 'stock cube'
  ];
  if (exclusions.some(ex => ingredientKey.toLowerCase().includes(ex))) {
    return { ...item, ingredientKey, quantityNeeded, unitNeeded, costing: {
      effectivePackPrice: 0,
      recipeCost: 0,
      packsRequired: 0,
      basketCost: 0,
      costingMethod: "estimated"
    }, flags: [...new Set([...(item.flags || []), 'excluded_staple'])] };
  }

  // Find best match in our static pricing table
  const basisKey = Object.keys(INGREDIENT_PRICE_CATALOGUE).find(k =>
    ingredientKey.toLowerCase().includes(k) || k.includes(ingredientKey.toLowerCase())
  );
  const catalogueEntry = basisKey ? INGREDIENT_PRICE_CATALOGUE[basisKey] : null;
  let basis = catalogueEntry ? {
    price: catalogueEntry.packPrice,
    unit: catalogueEntry.packUnit,
    quantity: catalogueEntry.packQuantity,
  } : null;
  const usedReferencePrice = !!basis;

  if (!basis) {
    const catLower = (item.category || '').toLowerCase().trim();
    const keyLower = ingredientKey.toLowerCase();
    
    if (
      catLower.includes('meat') || 
      catLower.includes('fish') || 
      keyLower.includes('chicken') || 
      keyLower.includes('beef') || 
      keyLower.includes('pork') || 
      keyLower.includes('fish') || 
      keyLower.includes('salmon') || 
      keyLower.includes('lobster') || 
      keyLower.includes('crab') || 
      keyLower.includes('prawn') || 
      keyLower.includes('steak') || 
      keyLower.includes('plaice') || 
      keyLower.includes('seabass') || 
      keyLower.includes('fillet') ||
      keyLower.includes('haddock') ||
      keyLower.includes('cod')
    ) {
      const isPremium = 
        keyLower.includes('lobster') || 
        keyLower.includes('crab') || 
        keyLower.includes('scallop') || 
        keyLower.includes('prawn') || 
        keyLower.includes('shrimp') || 
        keyLower.includes('sirloin') || 
        keyLower.includes('ribeye') || 
        keyLower.includes('fillet') || 
        keyLower.includes('sea bass') || 
        keyLower.includes('seabass') || 
        keyLower.includes('plaice') || 
        keyLower.includes('halibut');
      
      if (isPremium) {
        basis = { price: 5.00, unit: 'g', quantity: 250 }; // approx £20.00/kg standard premium baseline (avoids massive pack caps, scales proportionally)
      } else {
        basis = { price: 3.00, unit: 'g', quantity: 400 }; // standard £7.50/kg baseline (avoids massive pack caps, scales proportionally)
      }
    } else if (
      catLower.includes('dairy') || 
      catLower.includes('egg') || 
      keyLower.includes('cheese') || 
      keyLower.includes('milk') || 
      keyLower.includes('egg') || 
      keyLower.includes('butter')
    ) {
      if (unitNeeded === 'g') {
        basis = { price: 2.20, unit: 'g', quantity: 250 };
      } else if (unitNeeded === 'kg') {
        basis = { price: 8.80, unit: 'kg', quantity: 1 };
      } else if (unitNeeded === 'ml') {
        basis = { price: 1.50, unit: 'ml', quantity: 300 };
      } else if (unitNeeded === 'l') {
        basis = { price: 1.50, unit: 'l', quantity: 1 };
      } else {
        basis = { price: 2.00, unit: 'each', quantity: 1 };
      }
    } else if (
      catLower.includes('veg') || 
      catLower.includes('fruit') || 
      keyLower.includes('tomato') || 
      keyLower.includes('mushroom') || 
      keyLower.includes('pepper') || 
      keyLower.includes('onion')
    ) {
      if (unitNeeded === 'g') {
        basis = { price: 1.20, unit: 'g', quantity: 250 };
      } else if (unitNeeded === 'kg') {
        basis = { price: 3.50, unit: 'kg', quantity: 1 };
      } else if (unitNeeded === 'ml' || unitNeeded === 'l') {
        basis = { price: 1.20, unit: 'ml', quantity: 250 };
      } else {
        basis = { price: 0.80, unit: 'each', quantity: 1 };
      }
    } else if (
      catLower.includes('bakery') || 
      keyLower.includes('bread') || 
      keyLower.includes('roll') || 
      keyLower.includes('tortilla')
    ) {
      if (unitNeeded === 'g') {
        basis = { price: 1.30, unit: 'g', quantity: 400 };
      } else {
        basis = { price: 1.20, unit: 'each', quantity: 1 };
      }
    } else if (
      catLower.includes('tin') || 
      catLower.includes('jar') || 
      keyLower.includes('bean') || 
      keyLower.includes('chickpea')
    ) {
      if (unitNeeded === 'g') {
        basis = { price: 0.80, unit: 'g', quantity: 400 };
      } else if (unitNeeded === 'ml') {
        basis = { price: 0.80, unit: 'ml', quantity: 400 };
      } else {
        basis = { price: 0.90, unit: 'each', quantity: 1 };
      }
    } else if (
      catLower.includes('cupboard') ||
      catLower.includes('spices') ||
      catLower.includes('condiment')
    ) {
      if (unitNeeded === 'g') {
        basis = { price: 1.00, unit: 'g', quantity: 100 };
      } else if (unitNeeded === 'kg') {
        basis = { price: 5.00, unit: 'kg', quantity: 1 };
      } else if (unitNeeded === 'ml') {
        basis = { price: 1.00, unit: 'ml', quantity: 150 };
      } else if (unitNeeded === 'l') {
        basis = { price: 3.00, unit: 'l', quantity: 1 };
      } else {
        basis = { price: 1.00, unit: 'each', quantity: 1 };
      }
    } else {
      if (unitNeeded === 'g') {
        basis = { price: 1.50, unit: 'g', quantity: 200 };
      } else if (unitNeeded === 'kg') {
        basis = { price: 5.00, unit: 'kg', quantity: 1 };
      } else if (unitNeeded === 'ml') {
        basis = { price: 1.50, unit: 'ml', quantity: 200 };
      } else if (unitNeeded === 'l') {
        basis = { price: 3.00, unit: 'l', quantity: 1 };
      } else {
        basis = { price: 1.50, unit: 'each', quantity: 1 };
      }
    }
  }

  // Calculate proportional cost
  let recipeCost = 0;
  
  // Standardise units for calculation (Base everything in grams or millilitres)
  const toBaseUnit = (qty: number, unit: string) => {
    if (unit === 'kg') return qty * 1000;
    if (unit === 'l') return qty * 1000;
    return qty;
  };

  // Convert 'each' to weight/volume if there's a mismatch with basis.unit
  let convertedQuantity = quantityNeeded;
  let convertedUnit = unitNeeded;

  if ((basis.unit === 'g' || basis.unit === 'kg') && unitNeeded === 'each') {
    const pieceWeight = getPieceWeight(ingredientKey);
    convertedQuantity = quantityNeeded * pieceWeight;
    convertedUnit = 'g';
  } else if ((basis.unit === 'ml' || basis.unit === 'l') && unitNeeded === 'each') {
    const pieceVolume = getPieceWeight(ingredientKey);
    convertedQuantity = quantityNeeded * pieceVolume;
    convertedUnit = 'ml';
  } else if (basis.unit === 'each' && unitNeeded !== 'each') {
    const pieceWeight = getPieceWeight(ingredientKey);
    const qtyBaseRaw = toBaseUnit(quantityNeeded, unitNeeded);
    convertedQuantity = qtyBaseRaw / pieceWeight;
    convertedUnit = 'each';
  }

  const qtyBase = toBaseUnit(convertedQuantity, convertedUnit);
  const basisBase = toBaseUnit(basis.quantity, basis.unit);

  if (basis.unit === 'each') {
    if (convertedUnit === 'each') {
      recipeCost = (basis.price / basis.quantity) * convertedQuantity;
    } else {
      recipeCost = basis.price;
    }
  } else {
    if (convertedUnit === 'each') {
      recipeCost = basis.price * convertedQuantity;
    } else {
      recipeCost = (basis.price / basisBase) * qtyBase;
    }
  }

  return {
    ...item,
    ingredientKey,
    quantityNeeded,
    unitNeeded,
    costing: {
      effectivePackPrice: basis.price,
      recipeCost,
      packsRequired: Math.ceil(qtyBase / basisBase),
      basketCost: Math.ceil(qtyBase / basisBase) * basis.price,
      costingMethod: "estimated"
    },
    flags: [...new Set([
      ...(item.flags || []).filter(flag => flag !== 'reference_price_match' && flag !== 'category_price_fallback'),
      usedReferencePrice ? 'reference_price_match' : 'category_price_fallback'
    ])]
  };
}

/**
 * Estimates cost for a single item based on static price data.
 */
export async function costItem(item: ShoppingListItem): Promise<ShoppingListItem> {
  return costItemSync(item);
}


/**
 * Costs the entire shopping list using the static estimated logic (Synchronous version).
 */
export function costShoppingListSync(items: ShoppingListItem[]) {
  const costedItems = items.map(item => costItemSync(item));

  const recipeCostTotal = costedItems
    .reduce((sum, i) => sum + (i.costing?.recipeCost ?? 0), 0);

  return {
    items: costedItems,
    totals: {
      recipeCostTotal,
    }
  };
}

/**
 * Costs the entire shopping list using the static estimated logic.
 */
export async function costShoppingList(items: ShoppingListItem[]) {
  return costShoppingListSync(items);
}

/**
 * Calculates total cost of all active ingredient items in the shopping list.
 */
export function calculateActiveIngredientsCost(items: ShoppingListItem[]): number {
  return items.reduce((sum, item) => sum + (costItemSync(item).costing?.recipeCost || 0), 0);
}

/**
 * Returns the two user-facing cost views for active shopping-list items:
 * the proportional value used by the dinners and the full packs needed at checkout.
 */
export function calculateShoppingCostSummary(items: ShoppingListItem[]): ShoppingCostSummary {
  return items.reduce<ShoppingCostSummary>((summary, item) => {
    const costed = costItemSync(item);
    const flags = costed.flags || [];
    const recipeCost = costed.costing?.recipeCost || 0;
    const basketCost = costed.costing?.basketCost || 0;
    const excludedAsStaple = flags.includes('excluded_staple');

    summary.totalItemCount += 1;
    summary.proportionalTotal += recipeCost;
    summary.checkoutTotal += basketCost;
    if (recipeCost > 0 || basketCost > 0) summary.pricedItemCount += 1;
    if (flags.includes('reference_price_match')) summary.referenceMatchCount += 1;
    if (flags.includes('category_price_fallback')) summary.fallbackMatchCount += 1;
    if (excludedAsStaple) summary.excludedStapleCount += 1;
    return summary;
  }, {
    proportionalTotal: 0,
    checkoutTotal: 0,
    totalItemCount: 0,
    pricedItemCount: 0,
    referenceMatchCount: 0,
    fallbackMatchCount: 0,
    excludedStapleCount: 0,
  });
}
