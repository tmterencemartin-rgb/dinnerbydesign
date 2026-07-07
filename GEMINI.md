# Canonical Implementation Brief: Rules & Preferences (Rationalized v1)

This document is the single source of truth for all dietary, lifestyle, and kitchen preferences. It supersedes all previous instructions.

## 1. Taxonomy & Data Schema (UserPreferences)

The `UserPreferences` object must align with these 21 fields:

1.  **Dietary preference** (`dietaryRule`): `none | keto | paleo | pescatarian | vegan | vegetarian | gluten-free`
2.  **Salad preference** (`saladPreference`): `all | main-only | side-only | none`
3.  **Allergies** (`allergies`): `string[]` (Eggs, Fish, Gluten/Wheat, Milk/Dairy, Peanuts, Sesame, Shellfish, Soy, Tree nuts)
4.  **Wholesome recipes** (`nutritiousChoice`): `boolean` (Wholesome logic: nutrient-dense, minimally processed)
5.  **Quick & Easy** (`isSimple`): `boolean` (Simplicity bias: fewer ingredients, less prep)
6.  **Low-cost recipes** (`isLowCost`): `boolean` (Budget logic: cheaper cuts, pulses, etc.)
7.  **Omega-3 rich** (`highOmega3`): `boolean` (Prioritise oily fish and other omega-3-rich dinner choices)
8.  **High Protein** (`highProtein`): `boolean` (Protein logic: prioritize higher protein-to-calorie ratio)
9.  **Portion count** (`servings`): `number` (Default: 2)
10. **Max calories** (`calorieCeiling`): `number | null` (Target: 400-600 KCAL per adult portion)
11. **Max cost** (`budgetLimit`): `number | null` (Target: UK market price per portion)
12. **Always exclude** (`exclusions`): `string[]` (User-entered text ingredients)
13. **Cuisine preferences** (`cuisinePreferences`): `string[]` (British, Chinese, French, Indian, Italian, Japanese, Mediterranean, Mexican, Middle Eastern, Spanish, Thai, Vietnamese)
14. **Religious & ethical** (`religiousEthical`): `string[]` (Fair Trade preference, Kosher-friendly, Halal-friendly)
15. **Cooking method** (`cookingMethods`): `string[]` (Air fryer, One pot, Oven bake, Pan fried, Slow cooker, Stir fry, Tray bake)
16. **Cooking fat** (`cookingFats`): `string[]` (Butter, Coconut oil, Ghee, Lard/Dripping, Olive oil, Vegetable oil)
17. **Ready time** (`readyToEatUnderMins`): `number | null` (Ready to eat in under this many minutes)
18. **Preferred supermarkets** (`preferredSupermarkets`): `string[]` (Tesco, Sainsbury's/Sainsbury's-style values, Asda, Waitrose, Morrisons, etc.)
19. **Preferred sources** (`preferredSourceIds`): `string[]` (Trusted recipe-source IDs)
20. **Preferred mode** (`preferredMode`): `cook | ready-made`
21. **Custom cuisines** (`customCuisines`): `string[]` (Legacy/user-added cuisine values)

## 2. Hard Constraints (Mandatory Safety)

The following must be treated as absolute hard filters. If a query directly conflicts with these, the model must return an empty array `[]`.

-   **Allergies**: Never return ingredients listed here.
-   **Dietary preference**: Must strictly adhere (e.g., no chicken in Vegetarian).
-   **Salad preference**: If 'none', exclude all salads. If 'main-only', only return salads if they are the main course.
-   **Religious/Ethical**: Strictly follow (e.g., Kosher/Halal meat rules, no non-Fair Trade if specified).
-   **Always exclude**: Programmatic string-match safety filter in `dietarySafety.ts` handles the final layer.

## 3. UI Implementation Rules

-   **Selectors**: Must use **dropdown controls** for all taxonomies where practical (single-select for dietary rule, salad preference, and preferred mode; multi-select for allergies, cuisines, religious/ethical rules, cooking methods, cooking fats, supermarkets, and trusted sources).
-   **Simplicity Bias**: When `isSimple` is true, the model must strictly prioritize recipes with no more than 4 ingredients and <30 mins total time.
-   **Empty States**: Display "No dishes match your current rules" if all results are filtered.
-   **Weekly planner protein choices**: Beef, Chicken, Eggs, Fish & seafood, Lamb, Mixed, No preference, Pescatarian, Pork, Pulses, Tofu / plant-based, Turkey, Vegetarian, Vegan.
-   **Weekly planner time choices**: Any, Quick, Under 30 mins, Under 45 mins. Under-30 and under-45 planner choices must set `maxTotalTime` in generated search params.

## 4. Rationalization Guardrails
- **No chips/tags** for selection. Use clean, vertical lists for active selections.
- **UK English only** for ingredients and costings.
- **Portion Basis**: All metrics (calories, cost) are anchored to **one adult portion**.
