# Canonical Implementation Brief: Rules & Preferences (Rationalized v1)

This document is the single source of truth for all dietary, lifestyle, and kitchen preferences. It supersedes all previous instructions.

## 1. Taxonomy & Data Schema (UserPreferences)

The `UserPreferences` object must align with these 16 fields:

1.  **Dietary preference** (`dietaryRule`): `none | keto | paleo | pescatarian | vegan | vegetarian | gluten-free`
2.  **Salad preference** (`saladPreference`): `all | main-only | side-only | none`
3.  **Allergies** (`allergies`): `string[]` (Eggs, Fish, Gluten/Wheat, Milk/Dairy, Peanuts, Sesame, Shellfish, Soy, Tree nuts)
4.  **Wholesome recipes** (`nutritiousChoice`): `boolean` (Wholesome logic: nutrient-dense, minimally processed)
5.  **Quick & Easy** (`isSimple`): `boolean` (Simplicity bias: fewer ingredients, less prep)
6.  **Low-cost recipes** (`isLowCost`): `boolean` (Budget logic: cheaper cuts, pulses, etc.)
7.  **Portion count** (`servings`): `number` (Default: 2)
8.  **Max calories** (`calorieCeiling`): `number | null` (Target: 400-600 KCAL per adult portion)
9.  **Max cost** (`budgetLimit`): `number | null` (Target: UK market price per portion)
10. **Always exclude** (`exclusions`): `string[]` (User-entered text ingredients)
11. **Cuisine preferences** (`cuisinePreferences`): `string[]` (British, Chinese, French, Indian, Italian, Japanese, Mediterranean, Mexican, Middle Eastern, Spanish, Thai, Vietnamese)
12. **Religious & ethical** (`religiousEthical`): `string[]` (Fair Trade preference, Kosher-friendly, Halal-friendly)
13. **Cooking method** (`cookingMethods`): `string[]` (Air fryer, One pot, Oven bake, Pan fried, Slow cooker, Stir fry, Tray bake)
14. **Cooking fat** (`cookingFats`): `string[]` (Butter, Coconut oil, Ghee, Lard/Dripping, Olive oil, Vegetable oil)
15. **Ready time** (`readyToEatUnderMins`): `number | null` (Total time in minutes)
16. **High Protein** (`highProtein`): `boolean` (Protein logic: prioritize higher protein-to-calorie ratio)

## 2. Hard Constraints (Mandatory Safety)

The following must be treated as absolute hard filters. If a query directly conflicts with these, the model must return an empty array `[]`.

-   **Allergies**: Never return ingredients listed here.
-   **Dietary preference**: Must strictly adhere (e.g., no chicken in Vegetarian).
-   **Salad preference**: If 'none', exclude all salads. If 'main-only', only return salads if they are the main course.
-   **Religious/Ethical**: Strictly follow (e.g., Kosher/Halal meat rules, no non-Fair Trade if specified).
-   **Always exclude**: Programmatic string-match safety filter in `dietarySafety.ts` handles the final layer.

## 3. UI Implementation Rules

-   **Selectors**: Must use **dropdown controls** for all taxonomies (single-select for 1, 2; multi-select for 3, 11, 12, 13, 14).
-   **Simplicity Bias**: When `isSimple` is true, the model must strictly prioritize recipes with no more than 4 ingredients and <30 mins total time.
-   **Empty States**: Display "No dishes match your current rules" if all results are filtered.

## 4. Rationalization Guardrails
- **No chips/tags** for selection. Use clean, vertical lists for active selections.
- **UK English only** for ingredients and costings.
- **Portion Basis**: All metrics (calories, cost) are anchored to **one adult portion**.
