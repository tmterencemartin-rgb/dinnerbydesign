const MAX_SEARCH_QUERY_LENGTH = 500;
const MAX_SEARCH_ARRAY_ITEMS = 40;
const MAX_SEARCH_ITEM_LENGTH = 160;

const SEARCH_ARRAY_FIELDS = [
  'cuisines',
  'dietTypes',
  'allergies',
  'exclusions',
  'religiousEthical',
  'styleWellness',
  'excludeIngredients',
  'omitIngredients',
  'cookingMethods',
  'cookingFats',
  'retailers',
  'supermarkets',
  'excludeTitles',
  'preferredSourceIds'
] as const;

const PREFERENCE_ARRAY_FIELDS = [
  'allergies',
  'exclusions',
  'cuisinePreferences',
  'religiousEthical',
  'cookingMethods',
  'cookingFats',
  'preferredSupermarkets',
  'preferredSourceIds',
  'customCuisines'
] as const;

const BOOLEAN_FIELDS = [
  'isSimple',
  'isLowCost',
  'nutritiousChoice',
  'highOmega3',
  'highProtein',
  'includeOffal'
] as const;

const NUMBER_FIELDS = [
  'maxTotalTime',
  'maxPrepTime',
  'maxCookTime',
  'maxCostPerPortion',
  'maxPricePerPerson',
  'maxHeatingTime',
  'maxCalories',
  'servings',
  'count',
  'calorieCeiling',
  'budgetLimit',
  'readyToEatUnderMins'
] as const;

const NULLABLE_NUMBER_FIELDS = new Set([
  'maxCostPerPortion',
  'maxPricePerPerson',
  'maxCalories',
  'calorieCeiling',
  'budgetLimit',
  'readyToEatUnderMins'
]);

const DIETARY_RULES = new Set([
  'none',
  'keto',
  'paleo',
  'pescatarian',
  'vegan',
  'vegetarian',
  'gluten-free',
  'mediterranean'
]);

const SALAD_PREFERENCES = new Set(['all', 'main-only', 'side-only', 'none']);
const SOURCES = new Set(['cook', 'ready-made']);

export type SearchRequestValidationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  !!value && typeof value === 'object' && !Array.isArray(value)
);

const invalid = (code: string, message: string): SearchRequestValidationResult => ({
  ok: false,
  code,
  message
});

function validateStringArrays(
  record: UnknownRecord,
  fields: readonly string[],
  label: string
): SearchRequestValidationResult {
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) continue;
    const value = record[field];
    if (!Array.isArray(value)) {
      return invalid('SEARCH_REQUEST_INVALID', `${label} contains an invalid ${field} value.`);
    }
    if (value.length > MAX_SEARCH_ARRAY_ITEMS || value.some(item => (
      typeof item !== 'string' || item.length > MAX_SEARCH_ITEM_LENGTH
    ))) {
      return invalid('SEARCH_REQUEST_TOO_LARGE', `${label} contains too much filter information.`);
    }
  }
  return { ok: true };
}

function validateScalarTypes(record: UnknownRecord, label: string): SearchRequestValidationResult {
  for (const field of BOOLEAN_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(record, field) && typeof record[field] !== 'boolean') {
      return invalid('SEARCH_REQUEST_INVALID', `${label} contains an invalid ${field} value.`);
    }
  }

  for (const field of NUMBER_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) continue;
    const value = record[field];
    if (value === null && NULLABLE_NUMBER_FIELDS.has(field)) continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 10_000) {
      return invalid('SEARCH_REQUEST_INVALID', `${label} contains an invalid ${field} value.`);
    }
  }

  return { ok: true };
}

function validateSearchParams(searchParams: unknown): SearchRequestValidationResult {
  if (!isRecord(searchParams)) {
    return invalid('SEARCH_REQUEST_INVALID', 'The search request is invalid.');
  }

  if (typeof searchParams.query !== 'string') {
    return invalid('SEARCH_REQUEST_INVALID', 'The search query must be text.');
  }
  if (searchParams.query.trim().length > MAX_SEARCH_QUERY_LENGTH) {
    return invalid('SEARCH_QUERY_TOO_LONG', 'Please shorten the search query and try again.');
  }
  if (typeof searchParams.source !== 'string' || !SOURCES.has(searchParams.source)) {
    return invalid('SEARCH_REQUEST_INVALID', 'The search source is invalid.');
  }
  if (Object.prototype.hasOwnProperty.call(searchParams, 'count')) {
    const count = searchParams.count;
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > 3) {
      return invalid('SEARCH_REQUEST_INVALID', 'The requested result count is invalid.');
    }
  }

  const arraysResult = validateStringArrays(searchParams, SEARCH_ARRAY_FIELDS, 'The search request');
  if (!arraysResult.ok) return arraysResult;

  return validateScalarTypes(searchParams, 'The search request');
}

function validatePreferences(preferences: unknown): SearchRequestValidationResult {
  if (preferences === undefined || preferences === null) return { ok: true };
  if (!isRecord(preferences)) {
    return invalid('PREFERENCES_INVALID', 'The saved preferences are invalid.');
  }

  const arraysResult = validateStringArrays(preferences, PREFERENCE_ARRAY_FIELDS, 'The saved preferences');
  if (!arraysResult.ok) return arraysResult;

  const scalarResult = validateScalarTypes(preferences, 'The saved preferences');
  if (!scalarResult.ok) return scalarResult;

  if (Object.prototype.hasOwnProperty.call(preferences, 'dietaryRule')
    && (typeof preferences.dietaryRule !== 'string' || !DIETARY_RULES.has(preferences.dietaryRule))) {
    return invalid('PREFERENCES_INVALID', 'The saved dietary preference is invalid.');
  }
  if (Object.prototype.hasOwnProperty.call(preferences, 'saladPreference')
    && (typeof preferences.saladPreference !== 'string' || !SALAD_PREFERENCES.has(preferences.saladPreference))) {
    return invalid('PREFERENCES_INVALID', 'The saved salad preference is invalid.');
  }
  if (Object.prototype.hasOwnProperty.call(preferences, 'preferredMode')
    && (typeof preferences.preferredMode !== 'string' || !SOURCES.has(preferences.preferredMode))) {
    return invalid('PREFERENCES_INVALID', 'The saved search mode is invalid.');
  }

  return { ok: true };
}

export const validateSearchRequestPayload = (
  searchParams: unknown,
  preferences: unknown
): SearchRequestValidationResult => {
  const searchResult = validateSearchParams(searchParams);
  if (!searchResult.ok) return searchResult;
  return validatePreferences(preferences);
};
