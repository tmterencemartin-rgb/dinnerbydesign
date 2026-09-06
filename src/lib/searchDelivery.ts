export function hasDeliveredSearchChoices(result: any) {
  const recipes = Array.isArray(result?.recipes) ? result.recipes : [];
  const readyMeals = Array.isArray(result?.readyMeals) ? result.readyMeals : [];

  return recipes.length > 0 || readyMeals.length > 0;
}

export function isDeliverableSearchResult(result: any) {
  return hasDeliveredSearchChoices(result)
    || result?.isEmpty === true
    || !!result?.budgetContradiction;
}
