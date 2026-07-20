import { Timestamp, FieldValue } from 'firebase/firestore';

export type AppView = 'home' | 'settings' | 'planner' | 'shopping' | 'pricing-methodology' | 'food-safety' | 'recipe-methodology' | 'nutrition-methodology' | 'privacy' | 'terms' | 'landing' | 'signin' | 'admin' | 'success' | 'meal-plan-five-for-two-under-40' | 'food-costs-uk-2026' | 'food-costs-lower-cost-cuts' | 'food-costs-low-cost-cooking-techniques';

export type DinnerSource = 'cook' | 'ready-made';
export type SaladPreference = 'all' | 'main-only' | 'side-only' | 'none';
export type SaladType = 'main' | 'side' | 'none';
export type DietaryRule = 'none' | 'keto' | 'paleo' | 'pescatarian' | 'vegan' | 'vegetarian' | 'gluten-free';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface BatchCookingInfo {
  suitable: boolean;
  confidence: 'low' | 'medium' | 'high';
  reason?: string;
  storage?: string;
  reheat?: string;
}

export interface RealityCheck {
  label: string;
  note: string;
  tone: 'positive' | 'caution' | 'neutral';
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  matchReason?: string;
  caloriesPerPortion?: number;
  totalRecipeCalories?: number;
  totalRecipeCost?: number;
  /** @deprecated Use caloriesPerPortion instead */
  calories?: number; // legacy fallback
  costPerPortion?: string;
  totalServings: number;
  totalTime: number;
  prepTime?: number;
  cookTime?: number;
  saladType: SaladType;
  sourceUrl?: string | null;
  totalIngredientsCount?: number;
  isNutritious?: boolean;
  nutritiousReason?: string;
  mainProtein?: string; // e.g., 'pork', 'beef', 'chicken', 'fish', 'tofu', 'lamb', 'turkey', 'duck', 'seafood', 'none'
  mainIngredient?: string; // e.g., 'Chicken Thighs', 'Sea Bass', 'Lentils'
  mainIngredientCategory?: string; // e.g., 'chicken', 'fish', 'vegetable', 'pasta', 'pulses'
  isVegetarian: boolean;
  isPescatarian: boolean;
  isVegan: boolean;
  dietFlagsVerified: boolean;
  portionBasis?: string; // default: 'adult_portion'
  servingEstimateConfidence?: number; // 0-1
  requestedServings?: number;
  chefStyle?: string;
  totalCookTime?: number;
  category?: string;
  convenienceProfile?: 'scratch' | 'convenience';
  batchCooking?: BatchCookingInfo;
  realityChecks?: RealityCheck[];
}

export interface ReadyMeal {
  id?: string;
  title: string;
  description: string;
  retailer: string;
  price: string; // This will be the per-person price string
  costPerPortion?: string;
  totalPrice?: string;
  servingCount?: string;
  totalServings?: number;
  cuisine: string;
  caloriesPerPortion?: number;
  /** @deprecated Use caloriesPerPortion instead */
  calories?: number; // legacy fallback
  matchReason?: string;
  servingSuggestion?: string;
  totalTime: number; // Heating/Prep time combined
  saladType: SaladType;
  sourceUrl?: string | null;
  totalIngredientsCount?: number;
  brand?: string;
  size?: string;
  brandVerified?: boolean;
  searchQueryStrong?: boolean;
  isNutritious?: boolean;
  nutritiousReason?: string;
  mainProtein?: string; // e.g., 'pork', 'beef', 'chicken', 'fish', 'tofu', 'lamb', 'turkey', 'duck', 'seafood', 'none'
  mainIngredient?: string; // e.g., 'Chicken Thighs', 'Sea Bass', 'Lentils'
  mainIngredientCategory?: string; // e.g., 'chicken', 'fish', 'vegetable', 'pasta', 'pulses'
  isVegetarian: boolean;
  isPescatarian: boolean;
  isVegan: boolean;
  dietFlagsVerified: boolean;
  isAirFryerFriendly?: boolean;
  portionBasis?: string; // default: 'adult_portion'
  requestedServings?: number;
  ingredients?: string[];
  instructions?: string[];
  readyMadeKit?: ReadyMadeKit;
  prepTime?: number;
  cookTime?: number;
  convenienceProfile?: 'scratch' | 'convenience';
  realityChecks?: RealityCheck[];
}

export interface ReadyMadeKitItem {
  name: string;
  role?: string;
  note?: string;
}

export interface ReadyMadeKit {
  coreProduct?: string;
  sides?: ReadyMadeKitItem[];
  upgrades?: ReadyMadeKitItem[];
  totalTimeNote?: string;
  fitNote?: string;
}

export interface UserPreferences {
  dietaryRule: DietaryRule;     // 1. Dietary preference
  saladPreference: SaladPreference; // 2. Salad preference
  allergies: string[];          // 3. Allergies
  nutritiousChoice: boolean;    // 4. Wholesome recipes (tick box)
  isSimple: boolean;            // 5. Quick and easy recipes (tick box)
  isLowCost: boolean;           // 6. Low-cost recipes (tick box)
  highOmega3: boolean;          // 18. Omega-3 rich (tick box)
  highProtein: boolean;         // 19. High Protein (tick box)
  servings: number;             // 7. Portion/Servings count
  calorieCeiling: number | null; // 8. Max calories per adult portion
  budgetLimit: number | null;   // 9. Max cost per adult portion
  exclusions: string[];         // 10. Always exclude (text)
  cuisinePreferences: string[];  // 11. Cuisine preferences
  religiousEthical: string[];   // 13. Religious & ethical preference
  cookingMethods: string[];     // 14. Cooking method
  cookingFats: string[];        // 15. Cooking fat
  readyToEatUnderMins: number | null; // 16. Ready to eat in under (mins)
  preferredSupermarkets: string[]; // 17. Preferred supermarkets
  preferredSourceIds: string[]; // 18. Trusted sources
  preferredMode: DinnerSource;  // Default mode
  customCuisines: string[];     // User added cuisines (legacy fallback)
}

export type AccessStatus = 'trial' | 'read_only' | 'paid';

export interface UserSubscriptionSummary {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'paused' | null;
  accessStatus: AccessStatus | null;
  trialStart: Timestamp | FieldValue | null;
  trialEnd: Timestamp | FieldValue | null;
  subscriptionCreatedAt?: Timestamp | FieldValue | null;
  currentPeriodStart: Timestamp | FieldValue | null;
  currentPeriodEnd: Timestamp | FieldValue | null;
  isTrialing: boolean;
  isPaying: boolean;
  hasAccess: boolean;
  updatedAt: Timestamp | FieldValue;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  welcomeEmailSent?: boolean;
  searchOnboardingDismissed?: boolean;
  searchOnboardingDismissedAt?: Timestamp | FieldValue;
  subscriptionConfirmationEmailSent?: boolean;
  subscriptionConfirmationEmailSentAt?: Timestamp | FieldValue;
  subscriptionCancellationEmailSent?: boolean;
  subscriptionCancellationEmailSentAt?: Timestamp | FieldValue;
  subscriptionPaymentFailedEmailLastInvoiceId?: string | null;
  subscriptionPaymentFailedEmailSentAt?: Timestamp | FieldValue;
  subscriptionPaymentGraceEndsAt?: Timestamp | FieldValue | null;
  trialEndingReminderEmailSent?: boolean;
  trialEndingReminderEmailSentAt?: Timestamp | FieldValue;
  preferences: UserPreferences;
  isPremium?: boolean;
  permanentAccess?: boolean;
  permanentAccessGrantedAt?: Timestamp | FieldValue;
  permanentAccessGrantedBy?: string | null;
  permanentAccessEmailSent?: boolean;
  permanentAccessEmailSentAt?: Timestamp | FieldValue | null;
  permanentAccessEmailError?: string | null;
  accessStatus?: AccessStatus;
  trialStartedAt?: Timestamp | FieldValue;
  subscription?: UserSubscriptionSummary;
  searchHistory?: string[];
  searchHistoryCook?: string[];
  searchHistoryReadyMade?: string[];
  adminNote?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface SearchParams {
  query: string;
  source: DinnerSource;
  cuisines?: string[];
  /** @deprecated Use cuisines (array) instead */
  cuisine?: string; // legacy support
  dietaryRule?: DietaryRule;
  dietTypes?: string[];
  allergies?: string[];
  exclusions?: string[];
  religiousEthical?: string[];
  styleWellness?: string[];
  // Cook-only
  excludeIngredients?: string[];
  omitIngredients?: string[];
  maxTotalTime?: number;
  maxPrepTime?: number;
  maxCookTime?: number;
  timeConstraintType?: 'total' | 'prep-cook';
  maxCostPerPortion?: number | null;
  cookingMethods?: string[];
  cookingFats?: string[];
  // Ready-made-only
  retailers?: string[];
  maxPricePerPerson?: number | null;
  maxHeatingTime?: number;
  // Shared
  supermarkets?: string[];
  maxCalories?: number | null;
  excludeTitles?: string[];
  saladPreference?: SaladPreference;
  isSimple?: boolean;
  isLowCost?: boolean;
  isLeftoverMode?: boolean;
  ingredientIntent?: {
    isIngredientLed: boolean;
    ingredients: string[];
    reason: 'list' | 'phrase' | 'short-food-list';
  };
  nutritiousChoice?: boolean;
  preferredSourceIds?: string[];
  highOmega3?: boolean;
  highProtein?: boolean;
  servings?: number;
  similarityContext?: {
    title: string;
    cuisine: string;
    description: string;
    ingredients?: string[];
    style?: string;
    time?: number;
  };
  count?: number;
}

export interface SavedRecipe {
  id?: string;
  recipeId: string;
  title: string;
  description?: string;
  cuisine: string;
  totalTime?: number;
  prepTime?: number;
  cookTime?: number;
  calories?: number;
  caloriesPerPortion?: number;
  costPerPortion?: string;
  totalRecipeCalories?: number;
  totalRecipeCost?: number;
  totalServings?: number;
  portionBasis?: string;
  servingEstimateConfidence?: number;
  ingredients?: string[];
  sourceUrl?: string;
  totalIngredientsCount?: number;
  brand?: string;
  size?: string;
  brandVerified?: boolean;
  searchQueryStrong?: boolean;
  saladType?: SaladType;
  mode: 'cook' | 'ready-made';
  instructions?: string[];
  readyMadeKit?: ReadyMadeKit;
  savedAt: Timestamp | FieldValue | null; // Firestore Timestamp
  updatedAt?: Timestamp | FieldValue | null;
  isArchived?: boolean;
  archivedAt?: Timestamp | FieldValue | null;
  personalNote?: string | null;
  userId: string;
  retailer?: string;
  price?: string;
  servingSuggestion?: string;
  isNutritious?: boolean;
  nutritiousReason?: string;
  mainProtein?: string;
  mainIngredient?: string;
  mainIngredientCategory?: string;
  isVegetarian?: boolean;
  isPescatarian?: boolean;
  isVegan?: boolean;
  dietFlagsVerified?: boolean;
  isAirFryerFriendly?: boolean;
  scheduledDate?: string | null; // Unified model: null = unscheduled/scheduled, string = scheduled for that day
  requestedServings?: number; // Number of people to cook for on this specific occasion
  chefStyle?: string;
  totalCookTime?: number;
  category?: string;
  convenienceProfile?: 'scratch' | 'convenience';
  batchCooking?: BatchCookingInfo;
  realityChecks?: RealityCheck[];
}

export interface ShoppingListItem {
  id: string;
  name: string;              // Existing field for compatibility (usually "2 red onions")
  nameRaw: string;           // Brief's version of name e.g. "2 red onions"
  ingredientKey: string;     // Normalised, e.g. "red onion"
  quantityNeeded: number;    // 2
  unitNeeded: "each" | "g" | "kg" | "ml" | "l";
  category: string;
  checked: boolean;
  inStock?: boolean;
  sourceRecipeIds: string[];
  sourceDays: string[];
  generatedAt: Timestamp | FieldValue;
  userId: string;
  isCustom?: boolean;
  excludedByPantry?: boolean;

  matchedProduct?: {
    retailer: "tesco" | "sainsburys" | "asda" | "waitrose" | "morrisons";
    productId: string;
    title: string;
    brand?: string;
    packPrice: number;          // standard price
    promoPrice?: number;        // if on promotion
    currency: "GBP";
    packSizeText: string;       // "1kg", "6 pack"
    unitPriceText?: string;     // "£0.14 / 100g"
    quantityInPack?: number;    // e.g. 1000
    unitInPack?: "g" | "ml" | "each" | "kg" | "l";
    matchConfidence: number;    // 0–1
  };

  costing?: {
    effectivePackPrice: number; // promo or standard
    recipeCost: number;         // cost of exact amount used
    packsRequired: number;      // rounded up
    basketCost: number;         // packsRequired * effectivePackPrice
    leftoverQuantity?: number;
    costingMethod: "exact" | "pack" | "estimated";
  };

  stateHash?: string; // Tracks name+quantity+recipes to detect material changes

  flags?: string[];             // ["low_confidence_match", "unit_assumed"]
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  isStaple: boolean;
  lastUsed?: Timestamp | FieldValue;
  userId: string;
}
