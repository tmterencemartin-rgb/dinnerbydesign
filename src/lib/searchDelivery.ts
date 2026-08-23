export function isDeliverableSearchResult(result: any) {
  const recipes = Array.isArray(result?.recipes) ? result.recipes : [];
  const readyMeals = Array.isArray(result?.readyMeals) ? result.readyMeals : [];

  return recipes.length > 0
    || readyMeals.length > 0
    || result?.isEmpty === true
    || !!result?.budgetContradiction;
}
