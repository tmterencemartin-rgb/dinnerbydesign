import type { DietaryRule } from '../types';

const DIETARY_COOKING_FAT_EXCLUSIONS: Partial<Record<DietaryRule, string[]>> = {
  pescatarian: ['lard', 'dripping'],
  vegetarian: ['lard', 'dripping'],
  vegan: ['butter', 'ghee', 'lard', 'dripping'],
  // Use a strict Paleo interpretation so the dropdown does not offer fats
  // that the deterministic recipe safety check will reject.
  paleo: ['butter', 'ghee', 'vegetable oil']
};

const normaliseCookingFat = (fat: string) => fat.trim().toLowerCase();

export const dietaryRuleAllowsCookingFat = (dietaryRule: DietaryRule | string | null | undefined, fat: string) => {
  const exclusions = DIETARY_COOKING_FAT_EXCLUSIONS[dietaryRule as DietaryRule] || [];
  const normalisedFat = normaliseCookingFat(fat);
  return !exclusions.some(exclusion => normalisedFat.includes(exclusion));
};

export const filterCookingFatsForDiet = (
  dietaryRule: DietaryRule | string | null | undefined,
  fats: string[]
) => fats.filter(fat => dietaryRuleAllowsCookingFat(dietaryRule, fat));
