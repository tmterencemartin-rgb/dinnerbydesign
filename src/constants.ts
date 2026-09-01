import { DietaryRule, SaladPreference } from './types';

export const DIETARY_EXCLUSION_MAP: Record<string, string[]> = {
  'No Pork': ['pork', 'bacon', 'ham', 'gammon', 'prosciutto', 'pancetta', 'lard', 'pig', 'piglet', 'sausage', 'chorizo', 'salami'],
  'Milk': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Milk / Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Milk/Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Eggs': ['egg', 'mayonnaise', 'meringue', 'albumin', 'eggy'],
  'Cereals containing gluten': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'wheat flour', 'bread', 'breadcrumb', 'breadcrumbs', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats', 'malt', 'malt extract', 'seitan', 'wheat starch'],
  'Gluten / Wheat': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'wheat flour', 'bread', 'breadcrumb', 'breadcrumbs', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats', 'malt', 'malt extract', 'seitan', 'wheat starch'],
  'Gluten/Wheat': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'wheat flour', 'bread', 'breadcrumb', 'breadcrumbs', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats', 'malt', 'malt extract', 'seitan', 'wheat starch'],
  'Peanuts': ['peanut', 'groundnut', 'peanuts', 'groundnuts'],
  'Tree nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'hazelnuts', 'walnuts', 'cashews', 'almonds', 'pecans', 'pistachios', 'brazil nuts', 'macadamias', 'tree nut', 'tree nuts', 'mixed nut', 'mixed nuts', 'nut butter'],
  'Tree Nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'hazelnuts', 'walnuts', 'cashews', 'almonds', 'pecans', 'pistachios', 'brazil nuts', 'macadamias', 'tree nut', 'tree nuts', 'mixed nut', 'mixed nuts', 'nut butter'],
  'Sesame': ['sesame', 'tahini', 'sesame oil', 'sesame seed', 'sesame seeds'],
  'Soybeans': ['soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso', 'soy sauce', 'soya sauce', 'soybean', 'soybeans', 'soy protein', 'soya protein', 'soy lecithin'],
  'Soy': ['soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso', 'soy sauce', 'soya sauce', 'soybean', 'soybeans', 'soy protein', 'soya protein', 'soy lecithin'],
  'Fish': ['fish', 'anchovy', 'salmon', 'cod', 'tuna', 'haddock', 'trout', 'bass', 'mackerel', 'sardine', 'halibut', 'anchovies'],
  'XFish': ['fish', 'anchovy', 'salmon', 'cod', 'tuna', 'haddock', 'trout', 'bass', 'mackerel', 'sardine', 'halibut', 'anchovies'],
  'Crustaceans': ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'langoustine', 'scampi', 'krill'],
  'Shellfish': ['shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'clam', 'scallop', 'oyster', 'squid', 'octopus', 'langoustine', 'mollusc', 'crustacean'],
  'Celery': ['celery', 'celeriac', 'celery seed', 'celery seeds'],
  'Lupin': ['lupin', 'lupine', 'lupin flour', 'lupin seed', 'lupin seeds'],
  'Molluscs': ['mussel', 'clam', 'scallop', 'oyster', 'squid', 'octopus', 'snail', 'whelk', 'cuttlefish', 'mollusc', 'molluscs'],
  'Mustard': ['mustard', 'mustard seed', 'dijon', 'senf', 'mustard seeds'],
  'Sulphur dioxide and sulphites': ['sulphite', 'sulfite', 'sulphur dioxide', 'sulfur dioxide', 'e220', 'preservative', 'sulphites', 'sulfites']
};

export const DIETARY_PROTEIN_EXCLUSION_MAP: Record<string, string[]> = {
  'No Pork': ['pork'],
  'Fish': ['fish'],
  'Shellfish': ['seafood', 'shellfish'],
  'Crustaceans': ['seafood', 'crustacean', 'shellfish'],
  'Molluscs': ['seafood', 'mollusc', 'shellfish']
};

export const CUISINES = [
  'British', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 
  'Mediterranean', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai', 'Vietnamese'
];

export const COOKING_METHODS = [
  'Air fryer', 'BBQ', 'Baked', 'Boiled', 'Braised', 'Broiled', 'Deep fried', 'Fried',
  'Griddled', 'Grilled', 'One pot', 'Oven bake', 'Pan fried', 'Poached',
  'Roasted', 'Sautéed', 'Seared', 'Shallow fried', 'Slow cooker', 'Smoked',
  'Sous vide', 'Steamed', 'Stewed', 'Stir fry', 'Tray bake'
];

// Search-friendly aliases keep the controlled labels concise while allowing
// recipe publishers to describe the same method in different ways.
export const COOKING_METHOD_ALIASES: Record<string, string[]> = {
  'Air fryer': ['air-fried', 'air fried', 'air fryer'],
  'BBQ': ['barbecue', 'barbecued', 'barbeque', 'barbecuing'],
  'Baked': ['bake', 'baked', 'baking', 'oven-baked', 'oven baked'],
  'Boiled': ['boil', 'boiled'],
  'Braised': ['braise', 'braised', 'pot-roasted', 'pot roasted'],
  'Broiled': ['broil', 'broiled'],
  'Deep fried': ['deep-fried', 'deep fried', 'deep-frying', 'deep frying'],
  'Fried': ['fry', 'fried'],
  'Griddled': ['griddle', 'griddled'],
  'Grilled': ['grill', 'grilled'],
  'One pot': ['one-pot', 'one pot'],
  'Oven bake': ['bake', 'baked', 'baking', 'oven-baked', 'oven baked'],
  'Pan fried': ['pan-fry', 'pan-fried', 'pan fried'],
  'Poached': ['poach', 'poached'],
  'Roasted': ['roast', 'roasted'],
  'Sautéed': ['sauté', 'sautéed', 'saute', 'sauteed'],
  'Seared': ['sear', 'seared', 'searing'],
  'Shallow fried': ['shallow-fried', 'shallow fried'],
  'Slow cooker': ['slow-cooked', 'slow cooked', 'slow cooker'],
  'Smoked': ['smoke', 'smoked', 'smoking'],
  'Sous vide': ['sous-vide', 'sous vide'],
  'Steamed': ['steam', 'steamed'],
  'Stewed': ['stew', 'stewed'],
  'Stir fry': ['stir-fry', 'stir-fried', 'stir fry'],
  'Tray bake': ['tray-bake', 'tray bake']
};

export const COOKING_FATS = [
  'Butter', 'Coconut oil', 'Ghee', 'Lard/Dripping', 'Olive oil', 'Vegetable oil'
];

export const UK_SUPERMARKETS = [
  'Aldi', 'Asda', 'Co-op', 'Iceland', 'Lidl', 'Marks & Spencer', 'Morrisons', 'Ocado', 'Sainsbury’s', 'Tesco', 'Waitrose'
];

export const DIETARY_TAXONOMY = {
  dietaryPreferences: {
    label: 'Dietary preference',
    options: ['none', 'keto', 'paleo', 'pescatarian', 'vegan', 'vegetarian', 'gluten-free', 'mediterranean'] as DietaryRule[],
    labels: {
      'none': 'No preference',
      'keto': 'Keto',
      'paleo': 'Paleo',
      'pescatarian': 'Pescatarian',
      'vegan': 'Vegan',
      'vegetarian': 'Vegetarian',
      'gluten-free': 'Gluten-free',
      'mediterranean': 'Mediterranean'
    } as Record<DietaryRule, string>
  },
  saladPreferences: {
    label: 'Salad preference',
    options: ['all', 'main-only', 'side-only', 'none'] as SaladPreference[],
    labels: {
      'all': 'No preference',
      'main-only': 'Main course salads only',
      'side-only': 'Side salads',
      'none': 'Exclude all salads'
    } as Record<SaladPreference, string>
  },
  allergies: {
    label: 'Allergies',
    helperText: 'We filter obvious allergens, but cannot guarantee complete allergen safety. Always check ingredients yourself.',
    options: [
      'Celery',
      'Cereals containing gluten',
      'Crustaceans',
      'Eggs',
      'Fish',
      'Lupin',
      'Milk',
      'Molluscs',
      'Mustard',
      'Peanuts',
      'Sesame',
      'Soybeans',
      'Sulphur dioxide and sulphites',
      'Tree nuts'
    ]
  },
  cuisinePreferences: {
    label: 'Cuisine preferences',
    placeholder: 'Add cuisine...',
    helperText: 'Choose one or more cuisines to steer results.',
    options: CUISINES
  },
  religiousEthical: {
    label: 'Religious & ethical preference',
    helperText: 'We try to exclude obvious ingredient conflicts. Fair Trade and free-range are preferences where the source explicitly supports them; religious suitability and certification cannot be guaranteed.',
    options: ['Prefer Fair Trade ingredients where available', 'Prefer free-range ingredients where available', 'Kosher-friendly', 'Prefer Halal-certified ingredients where available']
  },
  cookingMethods: {
    label: 'Cooking method',
    options: COOKING_METHODS
  },
  cookingFats: {
    label: 'Cooking fat',
    options: COOKING_FATS
  },
  supermarkets: {
    label: 'Nearby retailers',
    helperText: 'Choose the shops you can easily use. Ready-made results will prioritise these.',
    options: UK_SUPERMARKETS
  }
};

export const INGREDIENT_VOCABULARY = [
  'Mushrooms', 'Coriander', 'Aubergine', 'Olives', 'Capers', 
  'Celery', 'Fennel', 'Anchovies', 'Tofu', 'Cumin', 'Tumeric',
  'Onions', 'Garlic', 'Chilli', 'Ginger', 'Walnuts', 'Peanuts',
  'Lentils', 'Chickpeas', 'Quinoa', 'Basil', 'Parsley', 'Mint'
];

export const RETAILERS = {
  'Convenience/Food-to-go': ['Boots', 'Leon', 'Pret a Manger'],
  'Specialist/Premium': ['Cook', 'Fortnum & Mason', 'Gousto', 'HelloFresh', 'Ottolenghi'],
  'Supermarkets': UK_SUPERMARKETS
};
