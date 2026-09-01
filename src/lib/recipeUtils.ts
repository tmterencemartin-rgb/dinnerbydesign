import { Recipe, ReadyMeal, SavedRecipe } from '../types';

/**
 * Generates a unique key for a recipe based on its properties.
 * This is used for identity checks and as a document ID in Firestore.
 */
export const getRecipeKey = (item: Recipe | ReadyMeal | SavedRecipe): string => {
  // If it already has a recipeId (from SavedRecipe), use it
  if ('recipeId' in item && item.recipeId) {
    return item.recipeId;
  }

  const title = item.title.toLowerCase().trim();
  const cuisine = item.cuisine.toLowerCase().trim();
  const mode = 'retailer' in item ? 'ready-made' : ('mode' in item ? item.mode : 'cook');
  
  // Combine mode, cuisine and title for a more unique key than just title
  const rawKey = `${mode}:${cuisine}:${title}`;
  return rawKey.replace(/[^a-z0-9:]+/g, '-').replace(/-+$/, '').replace(/^-+/, '');
};

/**
 * Identity used when combining search or planner results.
 * A title is not a reliable identity because different publishers can use
 * the same title for different recipes.
 */
export const getRecipeDeduplicationKey = (item: Recipe | ReadyMeal | SavedRecipe): string => {
  const sourceUrl = typeof item.sourceUrl === 'string' ? item.sourceUrl.trim() : '';
  if (sourceUrl && /^https?:\/\//i.test(sourceUrl)) {
    return `source:${sourceUrl.replace(/\/+$/, '').toLowerCase()}`;
  }
  return `recipe:${getRecipeKey(item)}`;
};

/**
 * Checks if two recipe objects represent the same recipe or a very close variant.
 */
export const isSameRecipe = (
  r1: Recipe | ReadyMeal | SavedRecipe | null | undefined,
  r2: Recipe | ReadyMeal | SavedRecipe | null | undefined
): boolean => {
  if (!r1 || !r2) return false;
  if (getRecipeKey(r1) === getRecipeKey(r2)) return true;

  // Conceptual similarity check
  const normalizeForSimilarity = (title: string) => {
    return title.toLowerCase()
      .replace(/\b(perfect|creamy|classic|easy|best|simple|fresh|delicious|homemade|quick|sticky|crispy|golden|flavourful|tasty|rich|succulent|tender)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const t1 = normalizeForSimilarity(r1.title);
  const t2 = normalizeForSimilarity(r2.title);

  return t1 === t2 && !!t1;
};

/**
 * Safely extracts a source URL, avoiding fabricated fallbacks.
 */
export const getSourceUrl = (item: any): string | null => {
  if (item.sourceUrl && !item.sourceUrl.includes('google.com/search')) {
    return item.sourceUrl;
  }
  return null;
};

/**
 * Evaluates if a matchReason rationale is genuinely informative.
 * Suppresses generic filler, tautologies, or restatements of obvious facts.
 */
export const shouldShowMatchReason = (
  reason: string | null | undefined,
  title: string,
  query: string
): boolean => {
  if (!reason || reason.trim().length === 0) return false;

  const r = reason.toLowerCase().trim();
  const t = title.toLowerCase().trim();
  const q = query.toLowerCase().trim();

  // BANNED SUBJECTIVE/MARKETING ADJECTIVES
  // If these terms appear, the rationale is likely biased/fluff rather than objective logic.
  const bannedTerms = [
    'high-quality', 'premium', 'restaurant-quality', 'delicious', 'deep flavour', 'rich',
    'quality', 'finest', 'authentic', 'gourmet', 'tasty', 'signature', 'classic', 
    'ultimate', 'perfect', 'selected', 'luxury', 'hand-picked', 'award-winning',
    'balanced', 'mouth-watering', 'exquisite', 'expertly', 'best-ever', 'best ever'
  ];

  if (bannedTerms.some(term => r.includes(term))) return false;

  // HIGH-VALUE EXPLANATORY SIGNALS
  // These represent genuine ranking, substitution, or constraint handling logic.
  const explanatorySignals = [
    'budget', 'kcal', 'calorie', 'protein', 'target', 'filter', 'preference', 'rule',
    'substitute', 'closest', 'best available', 'lowest', 'highest', 'ranking', 
    'constraint', 'excluded', 'availability', 'caveat', 'limitation', 'cheaper', 
    'price', 'pp', 'portion', 'nutrition', 'matches your', 'satisfies', 'under', 
    'above', 'instead of', 'chosen because', 'best fit'
  ];

  const hasExplanatorySignal = explanatorySignals.some(sig => r.includes(sig));

  // GENERIC FILLER & RESTATEMENTS
  const genericFiller = [
    'direct match', 'matches search', 'matching the search', 'major uk retailer', 
    'major retailer', 'ready meal', 'curated for you', 'exact match', 
    'relevant result', 'matching your query', 'suggested for you'
  ];

  const isGeneric = genericFiller.some(filler => r.includes(filler));
  
  const isTitleRestatement = r === t || 
                            r === `direct match for ${t}` || 
                            r === `match for ${t}` ||
                            r.includes(`direct match for "${t}"`);

  const isQueryRestatement = r === q || 
                             r === `matches your query for ${q}` ||
                             r === `direct match for ${q}`;

  // FINAL GATING:
  // 1. MUST have an explanatory signal.
  // 2. MUST NOT be generic or a restatement.
  // 3. MUST NOT have been caught by banned terms (checked first).
  return hasExplanatorySignal && !isGeneric && !isTitleRestatement && !isQueryRestatement;
};

/**
 * Determines whether a recipe is Scratch ('scratch') or Convenience Assembly ('convenience').
 */
export const getConvenienceProfile = (item: any): 'scratch' | 'convenience' => {
  // 1. Ready-made matches are always convenience
  const isReadyMade = item.mode === 'ready-made' || 
                      'retailer' in item || 
                      (item.mode && item.mode === 'ready-made') ||
                      (item.convenienceProfile && String(item.convenienceProfile).toLowerCase() === 'ready-made');
  
  if (isReadyMade) {
    return 'convenience';
  }
  
  // 2. Gate keyword checks for cook mode recipes (Homemade)
  const titleLower = (item.title || '').toLowerCase().trim();
  
  // Grilled Lobster Tail, Haddock Fishcakes, and other fresh scratch cooking are homemade recipes
  if (titleLower.includes('lobster') || 
      titleLower.includes('fishcake') || 
      titleLower.includes('haddock') || 
      titleLower.includes('steak') ||
      titleLower.includes('salmon') ||
      titleLower.includes('breast') ||
      titleLower.includes('goujons') ||
      titleLower.includes('biryani') ||
      titleLower.includes('lemon and herb crust') ||
      titleLower.includes('scratch') ||
      titleLower.includes('homemade')) {
    return 'scratch';
  }

  // Specific title classifications suggesting assembly or convenience shortcuts:
  if (titleLower.includes('ready-made') ||
      titleLower.includes('ready-meal') ||
      titleLower.includes('convenience') ||
      titleLower.includes('pre-made') ||
      titleLower.includes('assembly')) {
    return 'convenience';
  }
  
  // 3. Inspect convenienceProfile if it's strictly defined, avoiding loose, secondary keyword checks
  if (item.convenienceProfile) {
    const cp = String(item.convenienceProfile).toLowerCase().trim();
    if (cp === 'scratch' || cp === 'homemade' || cp.includes('scratch')) {
      return 'scratch';
    }
    if (cp === 'convenience' || cp === 'ready-made') {
      return 'convenience';
    }
  }
  
  // Default to scratch for cook mode home recipes unless title explicitly states otherwise
  return 'scratch';
};
