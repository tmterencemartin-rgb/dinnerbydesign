import { DietaryRule, SaladPreference } from './types';

export const DIETARY_EXCLUSION_MAP: Record<string, string[]> = {
  'No Pork': ['pork', 'bacon', 'ham', 'gammon', 'prosciutto', 'pancetta', 'lard', 'pig', 'piglet', 'sausage', 'chorizo', 'salami'],
  'Milk': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Milk / Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Milk/Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'lactose', 'ghee', 'cream cheese', 'crème fraîche'],
  'Eggs': ['egg', 'mayonnaise', 'meringue', 'albumin', 'eggy'],
  'Cereals containing gluten': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'bread', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats'],
  'Gluten / Wheat': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'bread', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats'],
  'Gluten/Wheat': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'flour', 'bread', 'pasta', 'couscous', 'semolina', 'bulgur', 'oat', 'oats'],
  'Peanuts': ['peanut', 'groundnut', 'peanuts', 'groundnuts'],
  'Tree nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'hazelnuts', 'walnuts', 'cashews', 'almonds', 'pecans', 'pistachios', 'brazil nuts', 'macadamias'],
  'Tree Nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'hazelnuts', 'walnuts', 'cashews', 'almonds', 'pecans', 'pistachios', 'brazil nuts', 'macadamias'],
  'Sesame': ['sesame', 'tahini', 'sesame oil', 'sesame seed', 'sesame seeds'],
  'Soybeans': ['soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso', 'soy sauce', 'soya sauce', 'soybean', 'soybeans'],
  'Soy': ['soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso', 'soy sauce', 'soya sauce', 'soybean', 'soybeans'],
  'Fish': ['fish', 'anchovy', 'salmon', 'cod', 'tuna', 'haddock', 'trout', 'bass', 'mackerel', 'sardine', 'halibut', 'anchovies'],
  'XFish': ['fish', 'anchovy', 'salmon', 'cod', 'tuna', 'haddock', 'trout', 'bass', 'mackerel', 'sardine', 'halibut', 'anchovies'],
  'Crustaceans': ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'langoustine', 'krill'],
  'Shellfish': ['shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'clam', 'scallop', 'oyster', 'squid', 'octopus', 'langoustine', 'mollusc', 'crustacean'],
  'Celery': ['celery', 'celeriac', 'celery seed', 'celery seeds'],
  'Lupin': ['lupin', 'lupine', 'lupin flour', 'lupin seed', 'lupin seeds'],
  'Molluscs': ['mussel', 'clam', 'scallop', 'oyster', 'squid', 'octopus', 'snail', 'whelk', 'mollusc'],
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
  'Air fryer', 'One pot', 'Oven bake', 'Pan fried', 'Slow cooker', 'Stir fry', 'Tray bake'
];

export const COOKING_FATS = [
  'Butter', 'Coconut oil', 'Ghee', 'Lard/Dripping', 'Olive oil', 'Vegetable oil'
];

export const UK_SUPERMARKETS = [
  'Aldi', 'Asda', 'Co-op', 'Iceland', 'Lidl', 'Marks & Spencer', 'Morrisons', 'Ocado', 'Sainsbury’s', 'Tesco', 'Waitrose'
];

export const DIETARY_TAXONOMY = {
  dietaryPreferences: {
    label: 'Dietary preference',
    options: ['none', 'keto', 'paleo', 'pescatarian', 'vegan', 'vegetarian', 'gluten-free'] as DietaryRule[],
    labels: {
      'none': 'None',
      'keto': 'Keto',
      'paleo': 'Paleo',
      'pescatarian': 'Pescatarian',
      'vegan': 'Vegan',
      'vegetarian': 'Vegetarian',
      'gluten-free': 'Gluten-free'
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
    helperText: 'We try to exclude obviously unsuitable recipes, but cannot guarantee religious compliance or product certification.',
    options: ['Fair Trade preference', 'Kosher-friendly', 'Halal-friendly']
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
