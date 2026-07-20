import type { ReadyMeal, Recipe, SavedRecipe } from '../types';

const DIRECT_OFFAL_PATTERN = /\b(offal|livers?|kidneys?|tripe|tongues?|sweetbreads?|black pudding|blood sausage)\b/i;
const LIVER_PATE_PATTERN = /\b(?:liver|chicken|duck|pork)\s+p[aâ]t[eé]\b|\bp[aâ]t[eé]\b[^.]{0,40}\bliver\b/i;
const ANIMAL_HEART_PATTERN = /\b(?:beef|ox|lamb|sheep|mutton|pork|pig|chicken|duck|turkey|venison|veal|calf)\s+hearts?\b|\b(?:braised|grilled|stuffed|sliced|slow[- ]cooked)\s+hearts?\b|\bhearts?\s+(?:stew|curry|recipe|dish)\b/i;
const NON_OFFAL_HEART_PATTERN = /\b(?:artichoke|palm)\s+hearts?\b|\bheart[- ]healthy\b|\bheart health\b|\bhealthy heart\b/i;
const NON_OFFAL_KIDNEY_PATTERN = /\bkidney beans?\b/i;
const EXPLICIT_HEART_PATTERN = /^\s*hearts?(?:\s+(?:recipes?|stew|curry|dishes?|dinners?))?\s*$/i;

const containsOffalLanguage = (value: string, allowStandaloneHeart: boolean) => {
  const candidate = value
    .replace(NON_OFFAL_HEART_PATTERN, ' ')
    .replace(NON_OFFAL_KIDNEY_PATTERN, ' ');

  if (DIRECT_OFFAL_PATTERN.test(candidate) || LIVER_PATE_PATTERN.test(candidate)) return true;
  if (ANIMAL_HEART_PATTERN.test(candidate)) return true;
  return allowStandaloneHeart && (
    EXPLICIT_HEART_PATTERN.test(candidate) ||
    /\b(?:cook(?:ing)?|prepare|braise|grill|buy)\s+(?:an?\s+)?hearts?\b/i.test(candidate)
  );
};

export const queryExplicitlyRequestsOffal = (query: string) => containsOffalLanguage(query, true);

export const itemContainsOffal = (item: Recipe | SavedRecipe | ReadyMeal) => {
  const fields = [
    item.title,
    item.description || '',
    'ingredients' in item ? (item.ingredients || []).join(' ') : '',
    'mainProtein' in item ? item.mainProtein || '' : '',
    item.mainIngredient || '',
  ].join(' ');

  return containsOffalLanguage(fields, false);
};
