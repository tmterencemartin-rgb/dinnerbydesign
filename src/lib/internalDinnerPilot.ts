import type { Recipe, UserPreferences } from '../types';
import { passesHardConstraints } from './dietarySafety';

export type InternalDinnerChoice = Recipe;

/**
 * AI-created recipes do not provide verified nutrition data or use external
 * publishers and retailers. Keep those saved preferences intact, while
 * removing them from this specific generation route.
 */
export const getAiCreatedRecipePreferences = (preferences: UserPreferences): UserPreferences => ({
  ...preferences,
  calorieCeiling: null,
  nutritiousChoice: false,
  highOmega3: false,
  highProtein: false,
  preferredSupermarkets: [],
  preferredSourceIds: []
});

const stringList = (value: unknown, minimum = 0): string[] => (
  Array.isArray(value)
    ? value.map(item => String(item || '').trim()).filter(Boolean).slice(0, 24)
    : []
).filter(item => item.length <= 240).slice(0, Math.max(minimum, 24));

const cleanText = (value: unknown, limit: number) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit);
const cleanInstruction = (value: string) => value.replace(/^\s*\d+\s*[.)]\s*/, '').trim();

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const titleKey = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const choiceFingerprint = (choice: Pick<InternalDinnerChoice, 'ingredients' | 'instructions' | 'cuisine'>) => [
  titleKey(choice.ingredients.join(' ')),
  titleKey(choice.instructions.join(' ')),
  titleKey(choice.cuisine)
].join('|');

const IMPERIAL_MEASURE_PATTERN = /\b(?:oz|ounces?|lb|lbs|pounds?|cups?|fahrenheit|°\s*f)\b/i;
const METRIC_MEASURE_PATTERN = /\b\d+(?:\.\d+)?\s*(?:g|kg|ml|l)\b/i;
const QUANTITY_PATTERN = /^\s*(?:\d+(?:[./]\d+)?|½|¼|¾|one\b|two\b|three\b|four\b|half\b)/i;
const OVEN_TEMPERATURE_PATTERN = /(\d{2,3})\s*°?\s*c\b/gi;
const ANIMAL_PROTEIN_PATTERN = /\b(?:chicken|turkey|poultry|beef|pork|lamb|duck|fish|salmon|cod|haddock|tuna|prawn|seafood|sausage|mince)\b/i;
const COOK_THOROUGHLY_PATTERN = /\b(?:cook(?:ed)?\s+(?:all\s+the\s+way\s+)?through|cook(?:ed)?\s+thoroughly|fully\s+cook(?:ed)?|piping\s+hot|no\s+pink|opaque\s+and\s+flake|flakes?\s+easily)\b/i;
const SAFE_POULTRY_TEMPERATURE_PATTERN = /\b(?:75|80)\s*°?\s*c\b|\b70\s*°?\s*c\s*(?:for\s*)?(?:at\s+least\s*)?2\s*(?:minutes?|mins?)\b/i;

const hasRealisticMetricIngredients = (ingredients: string[]): boolean => {
  if (ingredients.some(ingredient => IMPERIAL_MEASURE_PATTERN.test(ingredient))) return false;
  const quantifiedIngredients = ingredients.filter(ingredient => QUANTITY_PATTERN.test(ingredient));
  return quantifiedIngredients.length >= Math.min(3, Math.ceil(ingredients.length * 0.6))
    && ingredients.some(ingredient => METRIC_MEASURE_PATTERN.test(ingredient));
};

const hasSensibleOvenTemperature = (instructions: string[]): boolean => {
  const method = instructions.join(' ');
  if (IMPERIAL_MEASURE_PATTERN.test(method)) return false;
  const ovenTemperatures = [...method.matchAll(OVEN_TEMPERATURE_PATTERN)]
    .map(match => Number(match[1]))
    .filter(temperature => temperature >= 120);
  if (/\b(?:oven|roast|bake)\b/i.test(method) && ovenTemperatures.length === 0) return false;
  return ovenTemperatures.every(temperature => temperature <= 240);
};

const hasSafeProteinCookingGuidance = (ingredients: string[], instructions: string[]): boolean => {
  if (!ANIMAL_PROTEIN_PATTERN.test(ingredients.join(' '))) return true;
  const method = instructions.join(' ');
  return COOK_THOROUGHLY_PATTERN.test(method) || SAFE_POULTRY_TEMPERATURE_PATTERN.test(method);
};

const hasRealisticPriceEstimate = (value: unknown): boolean => {
  const costText = cleanText(value, 30);
  const match = costText.match(/£\s*(\d+(?:\.\d{1,2})?)/);
  if (!match) return false;
  const price = Number(match[1]);
  return Number.isFinite(price) && price >= 0.2 && price <= 25;
};

const hasRequiredShape = (item: any): item is InternalDinnerChoice => (
  cleanText(item?.title, 120).length >= 4 &&
  cleanText(item?.description, 360).length >= 20 &&
  stringList(item?.ingredients).length >= 3 &&
  stringList(item?.instructions).length >= 2 &&
  hasRealisticMetricIngredients(stringList(item?.ingredients)) &&
  hasSensibleOvenTemperature(stringList(item?.instructions)) &&
  hasSafeProteinCookingGuidance(stringList(item?.ingredients), stringList(item?.instructions)) &&
  hasRealisticPriceEstimate(item?.costPerPortion)
);

export function validateInternalDinnerChoices(
  rawChoices: unknown,
  preferences: UserPreferences,
  existingChoices: InternalDinnerChoice[] = []
): InternalDinnerChoice[] {
  const applicablePreferences = getAiCreatedRecipePreferences(preferences);
  const seenTitles = new Set(existingChoices.map(choice => titleKey(choice.title)));
  const seenChoiceFingerprints = new Set(existingChoices.map(choiceFingerprint));

  return (Array.isArray(rawChoices) ? rawChoices : [])
    .flatMap((item: any) => {
      if (!hasRequiredShape(item)) return [];

      const title = cleanText(item.title, 120);
      const key = titleKey(title);
      if (!key || seenTitles.has(key)) return [];

      const choice: InternalDinnerChoice = {
        title,
        description: cleanText(item.description, 360),
        ingredients: stringList(item.ingredients),
        instructions: stringList(item.instructions).map(cleanInstruction).filter(Boolean),
        cuisine: cleanText(item.cuisine, 80) || 'Home cooking',
        matchReason: cleanText(item.matchReason, 240),
        costPerPortion: cleanText(item.costPerPortion, 30) || undefined,
        totalServings: Math.min(12, Math.max(1, Math.round(toNumber(item.totalServings, applicablePreferences.servings || 2)))),
        totalTime: Math.min(240, Math.max(5, Math.round(toNumber(item.totalTime, 30)))),
        saladType: ['main', 'side', 'none'].includes(item.saladType) ? item.saladType : 'none',
        isVegetarian: item.isVegetarian === true,
        isPescatarian: item.isPescatarian === true,
        isVegan: item.isVegan === true,
        dietFlagsVerified: true,
        convenienceProfile: 'scratch'
      };

      if (!passesHardConstraints(choice, applicablePreferences)) return [];
      if (applicablePreferences.readyToEatUnderMins && choice.totalTime > applicablePreferences.readyToEatUnderMins) return [];
      const fingerprint = choiceFingerprint(choice);
      if (!fingerprint || seenChoiceFingerprints.has(fingerprint)) return [];
      seenTitles.add(key);
      seenChoiceFingerprints.add(fingerprint);
      return [choice];
    })
    .slice(0, 3);
}
