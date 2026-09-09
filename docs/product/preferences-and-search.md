# DinnerByDesign Preferences and Search Rules

This document describes the maintained preference schema and the behaviour those preferences must produce. The TypeScript interfaces and normalisation utilities remain the implementation authority.

## Current preference schema

`UserPreferences` contains:

| Field | Purpose |
| --- | --- |
| `dietaryRule` | Primary dietary rule |
| `saladPreference` | All, main only, side only or none |
| `allergies` | Regulated allergen exclusions |
| `nutritiousChoice` | Preference for wholesome recipes |
| `isSimple` | Preference for simpler, quicker recipes |
| `isLowCost` | Preference for lower-cost recipes |
| `highOmega3` | Preference for omega-3-rich choices |
| `highProtein` | Preference for higher-protein choices |
| `includeOffal` | Whether ordinary suggestions may include offal |
| `servings` | Default number of servings |
| `calorieCeiling` | Maximum calories per adult serving |
| `budgetLimit` | Maximum estimated ingredient value per adult serving |
| `exclusions` | User-entered ingredients that must be excluded, including allergies or intolerances outside the regulated allergen list |
| `cuisinePreferences` | Preferred cuisines |
| `religiousEthical` | Religious and ethical requirements |
| `cookingMethods` | Preferred cooking methods |
| `cookingFats` | Preferred cooking fats |
| `readyToEatUnderMins` | Preferred maximum total time |
| `preferredSupermarkets` | Preferred supermarkets for relevant searches and estimates |
| `preferredSourceIds` | Preferred recipe sources |
| `preferredMode` | Cook or ready-made mode |
| `customCuisines` | Legacy or user-added cuisine values |

Defaults and legacy migrations are maintained in `src/lib/preferenceUtils.ts`.

## Hard restrictions

The following are safety or suitability restrictions rather than ranking preferences:

- allergies
- the active dietary rule
- religious and ethical restrictions
- explicit ingredient exclusions
- an offal exclusion when `includeOffal` is not enabled
- cooking-fat choices that conflict with the active dietary rule; under the current strict Paleo interpretation, butter, ghee and vegetable oil are hidden and rejected

Apply these restrictions during generation and again through deterministic application checks. If all generated results conflict with the active restrictions, return no results and explain the outcome in plain English.

The Allergies control contains the 14 UK regulated allergen groups. The Other ingredients to avoid control is available for additional allergies, intolerances or personal exclusions. Neither control can guarantee the absence of cross-contact in a packaged product or kitchen; users must still check the product label and preparation guidance.

Salad preference is also enforced according to its selected mode. A request for a main salad must not be satisfied with a side salad, and a user who excludes salads must not receive one.

## Ingredient interpretation

When a user provides several ingredients:

- split the entry on commas and the word `and`;
- normalise singular and plural forms in UK English;
- treat common spelling variants as equivalent;
- treat `vegetable` or `vegetables` as a category that can match a named vegetable, but not vegetable oil or vegetable stock;
- treat `protein` as a category that can match a named meat, fish, seafood, egg, pulse, nut or plant-protein ingredient;
- treat `carbohydrate`, `carbohydrates` or `carbs` as a category that can match a named starchy ingredient such as rice, pasta, bread, noodles, potatoes or grains;
- understand quantities before these categories, so `one protein and two vegetables` requires at least one distinct protein ingredient and two distinct vegetable ingredients;
- look for recipes containing all requested ingredients before relaxing the search.

For an ingredient-led search, the Search view may also enable `strictIngredientMatch`. This is a temporary per-search control, not part of `UserPreferences`. When enabled, every listed ingredient must be present and every other meaningful ingredient is rejected. Basic pantry items such as water, oil, salt, pepper and ordinary seasoning are allowed. If the generated result data does not contain a complete ingredient list, it cannot pass the strict check.

An explicit search may temporarily override a related preference only where the product rules allow it. It must not silently change the saved profile.

## Preference strength

Hard restrictions determine whether a result is permitted. Other settings influence ordering and generation:

- `nutritiousChoice`
- `isSimple`
- `isLowCost`
- `highOmega3`
- `highProtein`
- cuisine preferences
- cooking methods and fats
- preferred sources
- preferred supermarkets

Do not describe a preference as a guarantee when it is being used as a ranking signal.

## Weekly planner inheritance

The weekly planner inherits relevant saved restrictions. Protein choices that conflict with the dietary rule, allergies, exclusions or religious and ethical requirements must not be offered.

The implemented planner protein choices are:

- Beef
- Chicken
- Eggs
- Fish & seafood
- Lamb
- Offal
- Pescatarian
- Pork
- Pulses
- Tofu / plant-based
- Turkey
- Vegetarian
- Vegan

The planner supports Any, Quick, Under 30 mins and Under 45 mins. The under-30 and under-45 choices set hard maximum total times.

Selecting Offal in the planner permits it for that plan only. It does not alter the saved `includeOffal` preference.

## Offal handling

Offal is excluded from ordinary suggestions by default.

- Use one saved control for including offal.
- A direct search for liver, kidney, heart or another recognised offal term may permit matching results for that search.
- Keep all other dietary, allergen, religious and ethical restrictions active.
- Apply the rule in both generation instructions and deterministic filtering.

## Cost and serving assumptions

- Calories and estimated ingredient value are expressed per adult serving unless the interface clearly states another basis.
- A budget limit concerns the estimated value used in the dish. It is not automatically the same as the complete-pack checkout cost.
- Shopping-list estimates may change after pack sizes, shared ingredients and ingredients already available are considered.
- Public cost claims must also follow the programmatic publishing standard and pricing methodology.

## Interface behaviour

- Use established controls and visual patterns rather than creating a second preference system.
- Explain inherited filtering when the available choices might otherwise appear incomplete.
- Use plain-English empty states and errors.
- Keep technical service status and routing details out of the ordinary interface.
- Keep one saved preference set, but show only the controls relevant to the selected search mode. AI-created recipes use dietary, ingredient, time, cost, cuisine, cooking-method, cooking-fat, simplicity and lower-cost preferences. They do not use calorie or nutrition targets, trusted sources or preferred supermarkets because they do not provide verified nutrition figures or external listings. Published searches use trusted sources but not supermarkets. Ready-made searches use preferred supermarkets, and use cuisine rather than cooking-method or cooking-fat preferences.

## Public three-way discovery

The public three-way search presents AI-created dinners, published recipes and ready-made options with equal prominence.

- AI-created recipes are original DinnerByDesign suggestions. They show full ingredients and instructions and can be saved, scheduled, added to the shopping list, printed and emailed. Use `AI-created recipes` as the result-panel heading without repeating a second AI attribution line in the same panel. Use UK metric quantities and ordinary UK supermarket ingredients; present times and costs as estimates; and remind people to check allergens and cook meat, poultry and fish thoroughly. Do not present them as tested, nutritionally exact or allergen-safe. Let people rate a choice or flag a specific problem for administrator review. The service aims to return three distinct choices. It makes bounded recovery attempts where validation under-fills the set, then shows any valid choices rather than discarding them all.
- Published recipes remain link-only. Show a title, publisher, short relevance note and original source link, but do not show, generate or send their ingredient list or method. Before showing a trusted publisher link, check its headers and a small page response. Exclude pages that explicitly report they are missing, show a trial or sign-in barrier, resolve to a generic listing or redirect away from a direct recipe page. Do not hide a source merely because its publisher blocks an automated availability check.
- Ready-made options continue to link to the retailer product page.
- All three routes count towards the same guest-search allowance. A guest receives no more than three completed searches.
- `THREE_WAY_SEARCH_PILOT` is the immediate rollback switch. Setting it to `false` restores the existing two-route interface.
