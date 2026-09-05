import type { Recipe, UserPreferences } from '../types';
import { passesHardConstraints } from './dietarySafety';

export type InternalDinnerChoice = Recipe;

const stringList = (value: unknown, minimum = 0): string[] => (
  Array.isArray(value)
    ? value.map(item => String(item || '').trim()).filter(Boolean).slice(0, 24)
    : []
).filter(item => item.length <= 240).slice(0, Math.max(minimum, 24));

const cleanText = (value: unknown, limit: number) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit);

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const titleKey = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const hasRequiredShape = (item: any): item is InternalDinnerChoice => (
  cleanText(item?.title, 120).length >= 4 &&
  cleanText(item?.description, 360).length >= 20 &&
  stringList(item?.ingredients).length >= 3 &&
  stringList(item?.instructions).length >= 2
);

export function validateInternalDinnerChoices(
  rawChoices: unknown,
  preferences: UserPreferences,
  existingChoices: InternalDinnerChoice[] = []
): InternalDinnerChoice[] {
  const seenTitles = new Set(existingChoices.map(choice => titleKey(choice.title)));
  const seenMainIngredients = new Set(existingChoices.map(choice => titleKey(choice.ingredients[0] || '')));

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
        instructions: stringList(item.instructions),
        cuisine: cleanText(item.cuisine, 80) || 'Home cooking',
        matchReason: cleanText(item.matchReason, 240),
        caloriesPerPortion: Math.max(0, Math.round(toNumber(item.caloriesPerPortion, 0))) || undefined,
        costPerPortion: cleanText(item.costPerPortion, 30) || undefined,
        totalServings: Math.min(12, Math.max(1, Math.round(toNumber(item.totalServings, preferences.servings || 2)))),
        totalTime: Math.min(240, Math.max(5, Math.round(toNumber(item.totalTime, 30)))),
        saladType: ['main', 'side', 'none'].includes(item.saladType) ? item.saladType : 'none',
        isVegetarian: item.isVegetarian === true,
        isPescatarian: item.isPescatarian === true,
        isVegan: item.isVegan === true,
        dietFlagsVerified: true,
        convenienceProfile: 'scratch'
      };

      if (!passesHardConstraints(choice, preferences)) return [];
      const mainIngredientKey = titleKey(choice.ingredients[0] || '');
      if (!mainIngredientKey || seenMainIngredients.has(mainIngredientKey)) return [];
      seenTitles.add(key);
      seenMainIngredients.add(mainIngredientKey);
      return [choice];
    })
    .slice(0, 3);
}
