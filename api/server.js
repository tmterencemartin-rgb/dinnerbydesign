var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// firebase-applet-config.json
var firebase_applet_config_default;
var init_firebase_applet_config = __esm({
  "firebase-applet-config.json"() {
    firebase_applet_config_default = {
      projectId: "gen-lang-client-0925408841",
      appId: "1:302877651140:web:2a5ea3bfcef2c473165991",
      apiKey: "AIzaSyCqBh_8OYI5aP8etFl_cGtwRY8t87N2T-A",
      authDomain: "gen-lang-client-0925408841.firebaseapp.com",
      firestoreDatabaseId: "ai-studio-ffdbb575-df5b-4ac3-a6ad-710b4076125a",
      storageBucket: "gen-lang-client-0925408841.firebasestorage.app",
      messagingSenderId: "302877651140",
      measurementId: ""
    };
  }
});

// src/lib/storage.ts
var safeStorage;
var init_storage = __esm({
  "src/lib/storage.ts"() {
    safeStorage = {
      getItem: (key) => {
        try {
          if (typeof window === "undefined" || !window.localStorage) return null;
          return localStorage.getItem(key);
        } catch (e) {
          console.warn(`[Storage] Failed to read ${key} from localStorage:`, e);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          if (typeof window === "undefined" || !window.localStorage) return false;
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.warn(`[Storage] Failed to write ${key} to localStorage:`, e);
          return false;
        }
      },
      removeItem: (key) => {
        try {
          if (typeof window === "undefined" || !window.localStorage) return;
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`[Storage] Failed to remove ${key} from localStorage:`, e);
        }
      },
      session: {
        getItem: (key) => {
          try {
            if (typeof window === "undefined" || !window.sessionStorage) return null;
            return sessionStorage.getItem(key);
          } catch (e) {
            console.warn(`[Storage] Failed to read ${key} from sessionStorage:`, e);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            if (typeof window === "undefined" || !window.sessionStorage) return false;
            sessionStorage.setItem(key, value);
            return true;
          } catch (e) {
            console.warn(`[Storage] Failed to write ${key} to sessionStorage:`, e);
            return false;
          }
        },
        removeItem: (key) => {
          try {
            if (typeof window === "undefined" || !window.sessionStorage) return;
            sessionStorage.removeItem(key);
          } catch (e) {
            console.warn(`[Storage] Failed to remove ${key} from sessionStorage:`, e);
          }
        }
      }
    };
  }
});

// src/lib/api.ts
function isLocalhost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.") || window.location.hostname.startsWith("10.");
}
function getApiConfig() {
  let mode = safeStorage.getItem("MODEL_API_MODE") || "proxy";
  const customBaseUrl = safeStorage.getItem("CUSTOM_API_BASE_URL") || void 0;
  let directApiKey = safeStorage.getItem("DIRECT_GEMINI_API_KEY") || void 0;
  if (mode === "direct" && !isLocalhost()) {
    console.log("[API] Production environment detected. Forcing MODEL_API_MODE to 'proxy' for reliability.");
    mode = "proxy";
  }
  if (directApiKey !== void 0) {
    const trimmed = directApiKey.trim();
    if (trimmed === "" || trimmed === "null" || trimmed === "undefined") {
      directApiKey = void 0;
    } else {
      directApiKey = trimmed;
    }
  }
  if (mode === "direct" && !directApiKey) {
    mode = "proxy";
  }
  return { mode, customBaseUrl, directApiKey };
}
function getApiUrl(path2) {
  const normalizedPath = path2.startsWith("/") ? path2 : `/${path2}`;
  const customUrl = safeStorage.getItem("CUSTOM_API_BASE_URL");
  if (customUrl && customUrl !== "undefined" && customUrl !== "null" && customUrl.trim() !== "") {
    const trimmed = customUrl.trim();
    if (typeof window !== "undefined") {
      const isKnownLocal = trimmed.includes("10.0.2.2") || trimmed.includes("localhost") || trimmed.includes("127.0.0.1");
      const isOnSameOrigin = window.location.origin.includes(trimmed.replace(/^https?:\/\//, "").split(":")[0]);
      if (!isKnownLocal || isOnSameOrigin) {
        const cleanBase = trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
        return `${cleanBase}${normalizedPath}`;
      } else {
        console.warn(`[API] Ignoring saved custom URL (${trimmed}) as it is likely unreachable from this origin (${window.location.origin}).`);
      }
    } else {
      const cleanBase = trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
      return `${cleanBase}${normalizedPath}`;
    }
  }
  const browserEnv = globalThis;
  const envUrl = browserEnv.__DBD_API_BASE_URL__ || (typeof process !== "undefined" ? process.env.VITE_API_BASE_URL : void 0);
  if (envUrl && envUrl !== "undefined" && envUrl !== "null" && envUrl.trim() !== "") {
    const cleanBase = envUrl.trim().endsWith("/") ? envUrl.trim().slice(0, -1) : envUrl.trim();
    return `${cleanBase}${normalizedPath}`;
  }
  return normalizedPath;
}
var init_api = __esm({
  "src/lib/api.ts"() {
    init_storage();
  }
});

// src/lib/clientErrorTelemetry.ts
var init_clientErrorTelemetry = __esm({
  "src/lib/clientErrorTelemetry.ts"() {
    init_api();
  }
});

// src/firebase.ts
var import_app, import_auth, import_firestore, app, isNativeRuntime, auth, db, signInAnon;
var init_firebase = __esm({
  "src/firebase.ts"() {
    import_app = require("firebase/app");
    import_auth = require("firebase/auth");
    import_firestore = require("firebase/firestore");
    init_firebase_applet_config();
    init_clientErrorTelemetry();
    app = (0, import_app.initializeApp)(firebase_applet_config_default);
    isNativeRuntime = () => {
      const capacitor = globalThis.Capacitor;
      return Boolean(capacitor?.isNativePlatform?.());
    };
    auth = (() => {
      try {
        const isNative = isNativeRuntime();
        return (0, import_auth.initializeAuth)(app, {
          persistence: isNative ? import_auth.browserLocalPersistence : import_auth.indexedDBLocalPersistence,
          ...isNative ? {} : { popupRedirectResolver: import_auth.browserPopupRedirectResolver }
        });
      } catch {
        return (0, import_auth.getAuth)(app);
      }
    })();
    db = (0, import_firestore.initializeFirestore)(app, {
      experimentalForceLongPolling: true,
      localCache: (0, import_firestore.memoryLocalCache)()
    }, firebase_applet_config_default.firestoreDatabaseId);
    signInAnon = () => (0, import_auth.signInAnonymously)(auth);
  }
});

// src/lib/searchAuth.ts
var searchAuth_exports = {};
__export(searchAuth_exports, {
  getSearchAuthToken: () => getSearchAuthToken
});
async function getSearchAuthToken() {
  const currentUser = auth.currentUser || (await signInAnon()).user;
  return currentUser.getIdToken();
}
var init_searchAuth = __esm({
  "src/lib/searchAuth.ts"() {
    init_firebase();
  }
});

// server.cts
var import_dotenv = __toESM(require("dotenv"));

// src/api-server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_firestore2 = require("firebase-admin/firestore");
var import_app2 = require("firebase-admin/app");
var import_auth2 = require("firebase-admin/auth");
var import_google_auth_library = require("google-auth-library");
init_firebase_applet_config();

// src/services/geminiService.ts
var import_genai = require("@google/genai");
init_api();

// src/data/preferredSources.ts
var PREFERRED_SOURCES = [
  {
    id: "bbc_good_food",
    label: "BBC Good Food",
    description: "Big, reliable collection of everyday UK recipes with sensible ingredients."
  },
  {
    id: "bbc_food",
    label: "BBC Food",
    description: "Recipes from BBC programmes and chefs, with strong basics and classics."
  },
  {
    id: "tesco_real_food",
    label: "Tesco Real Food",
    description: "Supermarket-friendly recipes with ingredients you can actually buy in UK shops, including diabetes-friendly dishes."
  },
  {
    id: "guardian_feast",
    label: "Guardian Feast",
    description: "More adventurous and global recipes from the Guardian\u2019s food writers."
  },
  {
    id: "mob",
    label: "Mob",
    description: "Younger, fast-moving recipes focused on bold flavour and simple prep."
  },
  {
    id: "delicious_magazine",
    label: "delicious. magazine",
    description: "Polished midweek and weekend recipes with good how-to detail."
  },
  {
    id: "the_happy_foodie",
    label: "The Happy Foodie",
    description: "Cookbook-driven recipes from well-known authors and new releases."
  },
  {
    id: "kitchen_sanctuary",
    label: "Kitchen Sanctuary",
    description: "Tried-and-tested comfort food with clear instructions and videos."
  },
  {
    id: "diabetes_uk",
    label: "Diabetes UK recipes",
    description: "Nutritionally checked recipes designed for people living with diabetes."
  },
  {
    id: "tesco_diabetes",
    label: "Tesco diabetes recipes",
    description: "Diabetes UK-approved recipes using mainstream supermarket ingredients."
  },
  {
    id: "slimming_world_diabetes",
    label: "Slimming World & Diabetes UK",
    description: "Lighter, portion-aware recipes developed with Diabetes UK."
  },
  {
    id: "bbc_low_gi",
    label: "BBC low-GI & diabetes",
    description: "Quick, diabetes-friendly and low-GI ideas from BBC recipe collections."
  },
  {
    id: "waitrose",
    label: "Waitrose",
    description: "Supermarket recipes ranging from quick everyday dishes to seasonal cooking."
  },
  {
    id: "asda",
    label: "Asda",
    description: "Practical supermarket recipes and cooking ideas built around accessible ingredients."
  },
  {
    id: "sainsburys_magazine",
    label: "Sainsbury's Magazine",
    description: "Seasonal recipes, classic dishes and practical ideas from Sainsbury's food magazine."
  },
  {
    id: "olive_magazine",
    label: "olive magazine",
    description: "Travel-led, seasonal and modern recipes from olive magazine."
  },
  {
    id: "great_british_chefs",
    label: "Great British Chefs",
    description: "Chef-led recipes, from accessible cooking to more ambitious dishes."
  },
  {
    id: "the_telegraph",
    label: "The Telegraph",
    description: "Food writing and recipes from The Telegraph's cookery coverage."
  },
  {
    id: "the_times_sunday_times",
    label: "The Times & Sunday Times",
    description: "Recipes and food writing from The Times and Sunday Times."
  },
  {
    id: "good_housekeeping",
    label: "Good Housekeeping",
    description: "Test-kitchen recipes and practical cooking guidance from Good Housekeeping."
  }
];

// src/lib/ingredientParser.ts
var MAIN_INGREDIENT_ALIAS_MAP = {
  // Meat, poultry and game
  "turkey breasts": "turkey breast",
  "turkey thighs": "turkey thigh",
  "turkey mince": "turkey mince",
  "duck legs": "duck leg",
  "duck breasts": "duck breast",
  "duck fillets": "duck fillet",
  "venison steaks": "venison steak",
  "venison mince": "venison mince",
  "rabbit legs": "rabbit leg",
  "rabbit joints": "rabbit joint",
  "lamb shoulders": "lamb shoulder",
  "lamb legs": "lamb leg",
  "lamb necks": "lamb neck",
  "lamb loins": "lamb loin",
  "lamb steaks": "lamb steak",
  "lamb fillets": "lamb fillet",
  "lamb racks": "lamb rack",
  "rack of lamb": "lamb rack",
  "racks of lamb": "lamb rack",
  "lamb cutlets": "lamb cutlet",
  "lamb breasts": "lamb breast",
  "lamb saddles": "lamb saddle",
  "lamb ribs": "lamb rib",
  "lamb medallions": "lamb medallion",
  "lamb kebabs": "lamb kebab",
  // Silverside is a beef cut in UK usage; keep the protein explicit in searches.
  "silverside": "beef silverside",
  "silversides": "beef silverside",
  "silverside joint": "beef silverside joint",
  "silverside joints": "beef silverside joint",
  "beef silverside": "beef silverside",
  "beef silverside joint": "beef silverside joint",
  "beef silverside joints": "beef silverside joint",
  // Fish and seafood
  "anchovies": "anchovy",
  "sardines": "sardine",
  "herrings": "herring",
  "trouts": "trout",
  "pollocks": "pollock",
  "plaice": "plaice",
  "hakes": "hake",
  "monkfish": "monkfish",
  "seabass": "sea bass",
  "sea bass fillets": "sea bass fillet",
  "salmon fillets": "salmon fillet",
  "cod fillets": "cod fillet",
  "haddock fillets": "haddock fillet",
  "tuna steaks": "tuna steak",
  "mackerel fillets": "mackerel fillet",
  "squid": "squid",
  "calamari": "squid",
  "scallops": "scallop",
  "mussels": "mussel",
  "oysters": "oyster",
  "lobsters": "lobster",
  "langoustines": "langoustine",
  "crayfish": "crayfish",
  "prawns": "prawn",
  // Vegetables and herbs
  "carrots": "carrot",
  "leeks": "leek",
  "parsnips": "parsnip",
  "radishes": "radish",
  "turnips": "turnip",
  "swedes": "swede",
  "beetroots": "beetroot",
  "beets": "beetroot",
  "cabbages": "cabbage",
  "cauliflowers": "cauliflower",
  "courgettes": "courgette",
  "aubergines": "aubergine",
  "asparagus": "asparagus",
  "artichokes": "artichoke",
  "fennel bulbs": "fennel bulb",
  "celeriac": "celeriac",
  "watercress": "watercress",
  "rocket leaves": "rocket",
  "spring greens": "spring green",
  "green beans": "green bean",
  "runner beans": "runner bean",
  "broad beans": "broad bean",
  "fava beans": "fava bean",
  "edamame beans": "edamame bean",
  "sugar snap peas": "sugar snap",
  "snap peas": "snap pea",
  "pak choi": "pak choi",
  "bok choy": "pak choi",
  "spring onions": "spring onion",
  "shallots": "shallot",
  "red onions": "red onion",
  "white onions": "white onion",
  "cherry tomatoes": "cherry tomato",
  "plum tomatoes": "plum tomato",
  "sun-dried tomatoes": "sun-dried tomato",
  "butternut squashes": "butternut squash",
  "sweet potatoes": "sweet potato",
  "brussels sprouts": "brussels sprout",
  "coriander leaves": "coriander",
  "parsley leaves": "parsley",
  "flat leaf parsley": "flat-leaf parsley",
  "basil leaves": "basil",
  "mint leaves": "mint",
  "thyme leaves": "thyme",
  "rosemary sprigs": "rosemary",
  "chives": "chive",
  // Pulses, grains and starches
  "lentils": "lentil",
  "red lentils": "red lentil",
  "green lentils": "green lentil",
  "chickpeas": "chickpea",
  "chick peas": "chickpea",
  "kidney beans": "kidney bean",
  "butter beans": "butter bean",
  "black beans": "black bean",
  "cannellini beans": "cannellini bean",
  "haricot beans": "haricot bean",
  "baked beans": "baked bean",
  "peas": "pea",
  "oats": "oat",
  "noodles": "noodle",
  "egg noodles": "egg noodle",
  "rice noodles": "rice noodle",
  "hen eggs": "hen egg",
  "chicken eggs": "chicken egg",
  "duck eggs": "duck egg",
  "goose eggs": "goose egg",
  "quail eggs": "quail egg",
  "pearl barley": "pearl barley",
  "bulgur wheat": "bulgur wheat",
  "cous cous": "couscous",
  "couscous": "couscous",
  "quinoas": "quinoa",
  "polenta": "polenta",
  // Dairy, fats and compound cupboard ingredients
  "butters": "butter",
  "milks": "milk",
  "greek yogurt": "greek yoghurt",
  "greek yoghurts": "greek yoghurt",
  "natural yogurt": "natural yoghurt",
  "plain yogurt": "plain yoghurt",
  "yogurts": "yoghurt",
  "yoghurts": "yoghurt",
  "creme fraiche": "cr\xE8me fra\xEEche",
  "cr\xE8mes fra\xEEches": "cr\xE8me fra\xEEche",
  "cheddars": "cheddar",
  "mozzarella": "mozzarella",
  "parmesan": "parmesan",
  "fetas": "feta",
  "halloumi": "halloumi",
  "ricotta": "ricotta",
  "mascarpone": "mascarpone",
  "olive oils": "olive oil",
  "coconut milks": "coconut milk",
  "sesame oils": "sesame oil",
  // Fruit, nuts and seeds
  "apples": "apple",
  "bananas": "banana",
  "oranges": "orange",
  "lemons": "lemon",
  "limes": "lime",
  "peaches": "peach",
  "nectarines": "nectarine",
  "plums": "plum",
  "pears": "pear",
  "strawberries": "strawberry",
  "raspberries": "raspberry",
  "blueberries": "blueberry",
  "almonds": "almond",
  "walnuts": "walnut",
  "hazelnuts": "hazelnut",
  "cashews": "cashew",
  "pistachios": "pistachio",
  "peanuts": "peanut",
  "pine nuts": "pine nut",
  "pumpkin seeds": "pumpkin seed",
  "sunflower seeds": "sunflower seed",
  "sesame seeds": "sesame seed",
  "chia seeds": "chia seed",
  "flax seeds": "flax seed",
  "linseeds": "linseed"
};
var ADDITIONAL_MAIN_INGREDIENT_TERMS = [
  "lamb",
  "turkey",
  "duck",
  "venison",
  "rabbit",
  "game",
  "sardine",
  "herring",
  "trout",
  "pollock",
  "plaice",
  "hake",
  "monkfish",
  "anchovy",
  "scallop",
  "mussel",
  "oyster",
  "lobster",
  "langoustine",
  "crayfish",
  "squid",
  "parsnip",
  "radish",
  "artichoke",
  "fennel",
  "fennel bulb",
  "celeriac",
  "watercress",
  "rocket",
  "spring green",
  "runner bean",
  "broad bean",
  "fava bean",
  "edamame bean",
  "snap pea",
  "shallot",
  "pak choi",
  "butternut squash",
  "asparagus",
  "aubergine",
  "courgette",
  "coriander",
  "parsley",
  "basil",
  "mint",
  "thyme",
  "rosemary",
  "sage",
  "oregano",
  "dill",
  "chive",
  "barley",
  "bulgur wheat",
  "couscous",
  "quinoa",
  "polenta",
  "oat",
  "bread",
  "pasta",
  "spaghetti",
  "penne",
  "macaroni",
  "orzo",
  "gnocchi",
  "tortilla",
  "corn",
  "butter",
  "milk",
  "cheddar",
  "mozzarella",
  "parmesan",
  "feta",
  "halloumi",
  "ricotta",
  "mascarpone",
  "greek yoghurt",
  "natural yoghurt",
  "plain yoghurt",
  "cr\xE8me fra\xEEche",
  "orange",
  "peach",
  "nectarine",
  "plum",
  "pear",
  "strawberry",
  "raspberry",
  "blueberry",
  "almond",
  "walnut",
  "hazelnut",
  "cashew",
  "pistachio",
  "peanut",
  "pumpkin seed",
  "sunflower seed",
  "sesame seed",
  "chia seed",
  "flax seed",
  "linseed"
];
var ADDITIONAL_COMPOUND_INGREDIENT_PHRASES = [
  "turkey breast",
  "turkey thigh",
  "turkey mince",
  "duck leg",
  "duck breast",
  "duck fillet",
  "venison steak",
  "venison mince",
  "rabbit leg",
  "rabbit joint",
  "lamb mince",
  "lamb shoulder",
  "lamb leg",
  "lamb neck",
  "lamb loin",
  "lamb steak",
  "lamb fillet",
  "lamb rack",
  "lamb chop",
  "lamb shank",
  "lamb cutlet",
  "lamb breast",
  "lamb saddle",
  "lamb rib",
  "lamb medallion",
  "lamb kebab",
  "sea bass",
  "sea bass fillet",
  "tiger prawn",
  "king prawn",
  "king crab",
  "salmon fillet",
  "cod fillet",
  "haddock fillet",
  "tuna steak",
  "mackerel fillet",
  "spring green",
  "runner bean",
  "broad bean",
  "fava bean",
  "edamame bean",
  "sugar snap",
  "snap pea",
  "pak choi",
  "spring onion",
  "red onion",
  "white onion",
  "cherry tomato",
  "plum tomato",
  "sun-dried tomato",
  "butternut squash",
  "fennel bulb",
  "red cabbage",
  "savoy cabbage",
  "sweet potato",
  "new potato",
  "roast potato",
  "red lentil",
  "green lentil",
  "butter bean",
  "kidney bean",
  "black bean",
  "cannellini bean",
  "haricot bean",
  "baked bean",
  "egg noodle",
  "rice noodle",
  "wild rice",
  "brown rice",
  "basmati rice",
  "long grain rice",
  "pearl barley",
  "bulgur wheat",
  "coconut milk",
  "greek yoghurt",
  "natural yoghurt",
  "plain yoghurt",
  "cr\xE8me fra\xEEche",
  "flat-leaf parsley",
  "fresh coriander",
  "fresh basil",
  "fresh mint",
  "fresh thyme",
  "fresh rosemary",
  "cream cheese",
  "goat cheese",
  "cottage cheese",
  "cheddar cheese",
  "mozzarella cheese",
  "parmesan cheese",
  "feta cheese",
  "halloumi cheese",
  "ricotta cheese",
  "olive oil",
  "rapeseed oil",
  "sesame oil",
  "pumpkin seed",
  "sunflower seed",
  "sesame seed",
  "chia seed",
  "flax seed",
  "pine nut"
];
function parseAndNormaliseIngredients(query2) {
  if (!query2 || typeof query2 !== "string") return [];
  const parts = query2.split(/,|\band\b/i);
  const results = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    let normalized = trimmed.toLowerCase();
    const vocabularyMap = {
      ...MAIN_INGREDIENT_ALIAS_MAP,
      // US and plural variant mapping to singular UK English
      "cilantro": "coriander",
      "cilantros": "coriander",
      "coriander leaf": "coriander",
      "coriander leaves": "coriander",
      "eggplant": "aubergine",
      "eggplants": "aubergine",
      "zucchini": "courgette",
      "zucchinis": "courgette",
      "baby marrow": "courgette",
      "baby marrows": "courgette",
      "bell pepper": "bell pepper",
      "bell peppers": "bell pepper",
      "red peppers": "red pepper",
      "green peppers": "green pepper",
      "yellow peppers": "yellow pepper",
      "chili": "chilli",
      "chilis": "chilli",
      "chilly": "chilli",
      "chillies": "chilli",
      "chili pepper": "chilli",
      "chili peppers": "chilli",
      "chilli peppers": "chilli",
      "chilli pepper": "chilli",
      "scallion": "spring onion",
      "scallions": "spring onion",
      "green onion": "spring onion",
      "green onions": "spring onion",
      "rutabaga": "swede",
      "rutabagas": "swede",
      "beet": "beetroot",
      "beets": "beetroot",
      "chickpeas": "chickpea",
      "chick peas": "chickpea",
      "snow pea": "mange tout",
      "snow peas": "mange tout",
      "sugar snap pea": "mange tout",
      "sugar snap peas": "mange tout",
      "sugar snaps": "sugar snap",
      "mange touts": "mange tout",
      "shrimp": "prawn",
      "shrimps": "prawn",
      "heavy cream": "double cream",
      "heavy whipping cream": "double cream",
      "whipping cream": "double cream",
      "ground beef": "beef mince",
      "beef minced": "beef mince",
      "minced beef": "beef mince",
      "ground pork": "pork mince",
      "pork minced": "pork mince",
      "minced pork": "pork mince",
      "ground lamb": "lamb mince",
      "lamb minced": "lamb mince",
      "minced lamb": "lamb mince",
      "ground turkey": "turkey mince",
      "turkey minced": "turkey mince",
      "minced turkey": "turkey mince",
      "streaky bacon": "streaky bacon",
      "back bacon": "back bacon",
      "smoked bacon": "smoked bacon",
      "unsmoked bacon": "unsmoked bacon",
      "bacon rashers": "bacon rasher",
      "rashers": "bacon rasher",
      "bacon lardons": "bacon lardon",
      "lardons": "bacon lardon",
      "bacon medallions": "bacon medallion",
      "bacon bits": "bacon bit",
      "pork bellies": "pork belly",
      "pork loins": "pork loin",
      "pork tenderloins": "pork tenderloin",
      "pork shoulders": "pork shoulder",
      "pork legs": "pork leg",
      "pork chops": "pork chop",
      "pork steaks": "pork steak",
      "pork ribs": "pork rib",
      "pork joints": "pork joint",
      "pork roasting joints": "pork roasting joint",
      "pork fillets": "pork fillet",
      "pork medallions": "pork medallion",
      "pork tenderloin": "pork tenderloin",
      "pork knuckles": "pork knuckle",
      "pork hocks": "pork hock",
      "pork collars": "pork collar",
      "pork necks": "pork neck",
      "pork escalopes": "pork escalope",
      "pork schnitzels": "pork schnitzel",
      "spare ribs": "spare rib",
      "baby back ribs": "baby back rib",
      "gammon steaks": "gammon steak",
      "gammon joints": "gammon joint",
      "roast pork": "roast pork",
      "roasting pork": "roasting pork",
      "pulled pork": "pulled pork",
      "diced pork": "diced pork",
      "chicken tenderloin": "chicken tenderloin",
      "chicken fillets": "chicken fillet",
      "chicken tenderloins": "chicken tenderloin",
      "chicken tenders": "chicken tender",
      "chicken strips": "chicken strip",
      "chicken drumsticks": "chicken drumstick",
      "chicken drumettes": "chicken drumette",
      "chicken breast fillets": "chicken breast fillet",
      "chicken thigh fillets": "chicken thigh fillet",
      "chicken winglets": "chicken winglet",
      "chicken quarters": "chicken quarter",
      "chicken leg quarters": "chicken leg quarter",
      "chicken crowns": "chicken crown",
      "whole chickens": "whole chicken",
      "chicken pieces": "chicken piece",
      "chicken portions": "chicken portion",
      "chicken sausages": "chicken sausage",
      "chicken giblets": "chicken giblet",
      "chicken livers": "chicken liver",
      "chicken hearts": "chicken heart",
      "chicken necks": "chicken neck",
      "pot roasts": "pot roast",
      "beef fillets": "beef fillet",
      "beef sirloins": "beef sirloin",
      "sirloin steak": "sirloin steak",
      "sirloin steaks": "sirloin steak",
      "rib eye": "ribeye",
      "rib-eye": "ribeye",
      "rib eyes": "ribeye",
      "rib-eyes": "ribeye",
      "ribeyes": "ribeye",
      "ribeye steaks": "ribeye steak",
      "rib eye steak": "ribeye steak",
      "rib eye steaks": "ribeye steak",
      "beef ribeye": "beef ribeye",
      "beef ribeye steaks": "beef ribeye steak",
      "rib steaks": "rib steak",
      "beef rib steaks": "beef rib steak",
      "strip loin": "striploin",
      "striploin steaks": "striploin steak",
      "beef striploin": "beef striploin",
      "beef striploin steaks": "beef striploin steak",
      "beef rumps": "beef rump",
      "rump steak": "rump steak",
      "rump steaks": "rump steak",
      "beef topsides": "beef topside",
      "beef silversides": "beef silverside",
      "top rump": "top rump",
      "top rumps": "top rump",
      "thick flank": "thick flank",
      "thick flanks": "thick flank",
      "beef chucks": "beef chuck",
      "chuck steaks": "chuck steak",
      "chuck roast": "chuck roast",
      "chuck roasts": "chuck roast",
      "braising steaks": "braising steak",
      "stewing steaks": "stewing steak",
      "frying steaks": "frying steak",
      "minute steaks": "minute steak",
      "beef shins": "beef shin",
      "beef briskets": "beef brisket",
      "short ribs": "short rib",
      "beef short ribs": "beef short rib",
      "flank steaks": "flank steak",
      "skirt steaks": "skirt steak",
      "feather blades": "featherblade",
      "featherblade steaks": "featherblade steak",
      "bavette steaks": "bavette steak",
      "onglet steaks": "onglet steak",
      "flat irons": "flat iron",
      "flat iron steaks": "flat iron steak",
      "hanger steaks": "hanger steak",
      "beef hanger steaks": "beef hanger steak",
      "beef cheeks": "beef cheek",
      "beef oxtail": "oxtail",
      "oxtails": "oxtail",
      "t bone": "t-bone",
      "t-bone steaks": "t-bone steak",
      "porterhouse steaks": "porterhouse steak",
      "tomahawk steaks": "tomahawk steak",
      "beef medallions": "beef medallion",
      "diced beef": "diced beef",
      "stewing beef": "stewing beef",
      "braising beef": "braising beef",
      "beef joints": "beef joint",
      "roasting joint": "roasting joint",
      "roasting joints": "roasting joint",
      "beef roasting joint": "beef roasting joint",
      "topside joints": "topside joint",
      "silverside joints": "silverside joint",
      "rump joints": "rump joint",
      "beef tenderloin": "beef fillet",
      "tenderloin": "beef fillet",
      "lamb shoulders": "lamb shoulder",
      "lamb legs": "lamb leg",
      "lamb necks": "lamb neck",
      "lamb loins": "lamb loin",
      "lamb steaks": "lamb steak",
      "lamb fillets": "lamb fillet",
      "lamb racks": "lamb rack",
      "rack of lamb": "lamb rack",
      "racks of lamb": "lamb rack",
      "lamb cutlets": "lamb cutlet",
      "lamb breasts": "lamb breast",
      "lamb saddles": "lamb saddle",
      "lamb ribs": "lamb rib",
      "lamb medallions": "lamb medallion",
      "lamb kebabs": "lamb kebab",
      "lamb shanks": "lamb shank",
      "duck breasts": "duck breast",
      "tiger prawns": "tiger prawn",
      "king crabs": "king crab",
      "sea bass": "sea bass",
      "tinned tomatoes": "tinned tomato",
      "chopped tomatoes": "chopped tomato",
      "plum tomatoes": "plum tomato",
      "cherry tomatoes": "cherry tomato",
      "beef tomatoes": "beef tomato",
      "roma tomatoes": "roma tomato",
      "tomatoes": "tomato",
      "potatoes": "potato",
      "peas": "pea",
      "sweet potatoes": "sweet potato",
      "new potatoes": "new potato",
      "roast potatoes": "roast potato",
      "onions": "onion",
      "red onions": "red onion",
      "white onions": "white onion",
      "garlic cloves": "garlic clove",
      "garlics": "garlic",
      "mushrooms": "mushroom",
      "chestnut mushrooms": "chestnut mushroom",
      "button mushrooms": "button mushroom",
      "wild mushrooms": "wild mushroom",
      "chicken breasts": "chicken breast",
      "chicken thighs": "chicken thigh",
      "chicken wings": "chicken wing",
      "chicken legs": "chicken leg",
      "lamb chops": "lamb chop",
      "sausages": "sausage",
      "pork sausages": "pork sausage",
      "lentils": "lentil",
      "red lentils": "red lentil",
      "green lentils": "green lentil",
      "beans": "bean",
      "butter beans": "butter bean",
      "kidney beans": "kidney bean",
      "black beans": "black bean",
      "cannellini beans": "cannellini bean",
      "haricot beans": "haricot bean",
      "baked beans": "baked bean",
      "green beans": "green bean",
      "sweet corn": "sweetcorn",
      "wild rice": "wild rice",
      "brussels sprouts": "brussels sprout",
      "baby corn": "baby corn",
      "lemon grass": "lemongrass",
      "eggs": "egg",
      "cream cheese": "cream cheese",
      "sour cream": "sour cream",
      "goat cheese": "goat cheese",
      "cottage cheese": "cottage cheese",
      "buttermilk": "buttermilk",
      "passion fruit": "passion fruit",
      "dragon fruit": "dragon fruit",
      "star fruit": "star fruit",
      "pine nuts": "pine nut",
      "chest nuts": "chestnut",
      "macadamia nuts": "macadamia nut",
      "lime juice": "lime",
      "lemon juice": "lemon",
      "proteins": "protein",
      "carbohydrates": "carbohydrate",
      "carbs": "carbohydrate"
    };
    if (vocabularyMap[normalized]) {
      normalized = vocabularyMap[normalized];
    } else {
      const words = normalized.split(/\s+/);
      const singularizedWords = words.map((word, index) => {
        if (vocabularyMap[word]) return vocabularyMap[word];
        let sing = word;
        if (sing.endsWith("oes")) {
          sing = sing.slice(0, -2);
        } else if (sing.endsWith("ies")) {
          sing = sing.slice(0, -3) + "y";
        } else if (sing.endsWith("s") && !sing.endsWith("ss") && !sing.endsWith("as") && !sing.endsWith("us") && !sing.endsWith("is")) {
          sing = sing.slice(0, -1);
        }
        return vocabularyMap[sing] || sing;
      });
      normalized = singularizedWords.join(" ");
      if (vocabularyMap[normalized]) {
        normalized = vocabularyMap[normalized];
      }
    }
    const finalClean = normalized.trim();
    if (finalClean && !results.includes(finalClean)) {
      results.push(finalClean);
    }
  }
  return results;
}
var UNSEPARATED_INGREDIENT_TERMS = /* @__PURE__ */ new Set([
  "anchovy",
  "apple",
  "aubergine",
  "avocado",
  "bacon",
  "banana",
  "bean",
  "beef",
  "broccoli",
  "cabbage",
  "carrot",
  "cauliflower",
  "celery",
  "cheese",
  "chickpea",
  "chicken",
  "chilli",
  "chorizo",
  "cod",
  "courgette",
  "cucumber",
  "duck",
  "egg",
  "fish",
  "flour",
  "garlic",
  "ginger",
  "ham",
  "haddock",
  "kale",
  "lamb",
  "leek",
  "lentil",
  "lemon",
  "lime",
  "mackerel",
  "mushroom",
  "noodle",
  "oat",
  "onion",
  "pasta",
  "pea",
  "pepper",
  "prawn",
  "potato",
  "pork",
  "rice",
  "salmon",
  "crab",
  "bass",
  "sausage",
  "shin",
  "brisket",
  "sirloin",
  "ribeye",
  "rump",
  "topside",
  "silverside",
  "chuck",
  "beef silverside",
  "flank",
  "skirt",
  "featherblade",
  "bavette",
  "onglet",
  "hanger",
  "cheek",
  "oxtail",
  "striploin",
  "porterhouse",
  "tomahawk",
  "medallion",
  "gammon",
  "pancetta",
  "rasher",
  "lardon",
  "drumstick",
  "drumette",
  "tenderloin",
  "tender",
  "strip",
  "quarter",
  "crown",
  "piece",
  "portion",
  "giblet",
  "liver",
  "heart",
  "neck",
  "spinach",
  "squash",
  "steak",
  "sweetcorn",
  "tofu",
  "tomato",
  "tuna",
  "turkey",
  "turnip",
  "vegetable",
  "protein",
  "carbohydrate",
  "yogurt",
  "yoghurt",
  "lemongrass",
  "buttermilk",
  "chestnut",
  ...ADDITIONAL_MAIN_INGREDIENT_TERMS
]);
var UNSEPARATED_INGREDIENT_PHRASES = /* @__PURE__ */ new Set([
  // Vegetables, pulses and fruit
  "green bean",
  "red bean",
  "butter bean",
  "kidney bean",
  "black bean",
  "baked bean",
  "cannellini bean",
  "haricot bean",
  "broad bean",
  "fava bean",
  "mixed bean",
  "chickpea",
  "sweetcorn",
  "red pepper",
  "green pepper",
  "yellow pepper",
  "bell pepper",
  "sweet pepper",
  "sugar snap",
  "mange tout",
  "red onion",
  "white onion",
  "spring onion",
  "hen egg",
  "chicken egg",
  "duck egg",
  "goose egg",
  "quail egg",
  "sweet potato",
  "new potato",
  "roast potato",
  "garlic clove",
  "chestnut mushroom",
  "button mushroom",
  "wild mushroom",
  "chopped tomato",
  "tinned tomato",
  "plum tomato",
  "cherry tomato",
  "beef tomato",
  "roma tomato",
  // Meat, fish and seafood forms
  "beef fillet",
  "beef sirloin",
  "sirloin steak",
  "beef ribeye",
  "ribeye",
  "beef rump",
  "rump steak",
  "beef topside",
  "beef silverside",
  "top rump",
  "thick flank",
  "beef chuck",
  "beef silverside joint",
  "braising steak",
  "stewing steak",
  "beef shin",
  "beef brisket",
  "short rib",
  "beef short rib",
  "flank steak",
  "skirt steak",
  "featherblade",
  "featherblade steak",
  "bavette steak",
  "onglet steak",
  "flat iron",
  "flat iron steak",
  "hanger steak",
  "beef cheek",
  "oxtail",
  "diced beef",
  "stewing beef",
  "braising beef",
  "beef joint",
  "ribeye steak",
  "rib steak",
  "striploin",
  "striploin steak",
  "beef striploin",
  "beef striploin steak",
  "chuck steak",
  "chuck roast",
  "frying steak",
  "minute steak",
  "t-bone",
  "t-bone steak",
  "porterhouse steak",
  "tomahawk steak",
  "beef hanger steak",
  "beef medallion",
  "roasting joint",
  "beef roasting joint",
  "topside joint",
  "silverside joint",
  "rump joint",
  "pot roast",
  "streaky bacon",
  "back bacon",
  "smoked bacon",
  "unsmoked bacon",
  "bacon rasher",
  "bacon lardon",
  "bacon medallion",
  "bacon bit",
  "pancetta",
  "pork belly",
  "pork loin",
  "pork tenderloin",
  "pork shoulder",
  "pork leg",
  "pork chop",
  "pork steak",
  "pork rib",
  "pork joint",
  "pork roasting joint",
  "pork fillet",
  "pork medallion",
  "pork knuckle",
  "pork hock",
  "pork collar",
  "pork neck",
  "pork escalope",
  "pork schnitzel",
  "spare rib",
  "baby back rib",
  "gammon steak",
  "gammon joint",
  "roast pork",
  "roasting pork",
  "pulled pork",
  "diced pork",
  "chicken breast",
  "lamb mince",
  "lamb shank",
  "lamb chop",
  "lamb shoulder",
  "lamb leg",
  "lamb neck",
  "lamb loin",
  "lamb steak",
  "lamb fillet",
  "lamb rack",
  "lamb cutlet",
  "lamb breast",
  "lamb saddle",
  "lamb rib",
  "lamb medallion",
  "lamb kebab",
  "duck breast",
  "tiger prawn",
  "king crab",
  "sea bass",
  "chicken thigh",
  "chicken wing",
  "chicken leg",
  "chicken fillet",
  "chicken tenderloin",
  "chicken tender",
  "chicken strip",
  "chicken drumstick",
  "chicken drumette",
  "chicken breast fillet",
  "chicken thigh fillet",
  "chicken winglet",
  "chicken quarter",
  "chicken leg quarter",
  "chicken crown",
  "whole chicken",
  "chicken piece",
  "chicken portion",
  "chicken mince",
  "chicken sausage",
  "chicken giblet",
  "chicken liver",
  "chicken heart",
  "chicken neck",
  "pork mince",
  "beef mince",
  "lamb mince",
  "turkey mince",
  "pork chop",
  "lamb chop",
  "pork sausage",
  "salmon fillet",
  "salmon steak",
  "cod fillet",
  "haddock fillet",
  "white fish",
  // Pulses, grains and noodles
  "red lentil",
  "green lentil",
  "wild rice",
  "pearl barley",
  "basmati rice",
  "brown rice",
  "long grain rice",
  "egg noodle",
  "rice noodle",
  "brussels sprout",
  "baby corn",
  "lemongrass",
  // Sauces, stocks, fats and other compound cupboard ingredients
  "coconut milk",
  "coconut cream",
  "curry paste",
  "tomato puree",
  "tomato paste",
  "fish sauce",
  "soy sauce",
  "oyster sauce",
  "hot sauce",
  "vegetable stock",
  "chicken stock",
  "beef stock",
  "vegetable stock cube",
  "chicken stock cube",
  "olive oil",
  "rapeseed oil",
  "sesame oil",
  "balsamic vinegar",
  "red wine vinegar",
  "white wine vinegar",
  "double cream",
  "cream cheese",
  "sour cream",
  "goat cheese",
  "cottage cheese",
  "buttermilk",
  "passion fruit",
  "dragon fruit",
  "star fruit",
  "pine nut",
  "chestnut",
  "macadamia nut",
  ...ADDITIONAL_COMPOUND_INGREDIENT_PHRASES
]);
var VEGETABLE_CATEGORY_TERMS = /* @__PURE__ */ new Set([
  "artichoke",
  "asparagus",
  "aubergine",
  "avocado",
  "beetroot",
  "broccoli",
  "brussels sprout",
  "butternut squash",
  "cabbage",
  "carrot",
  "cauliflower",
  "celeriac",
  "celery",
  "chard",
  "courgette",
  "cucumber",
  "fennel",
  "fennel bulb",
  "garlic",
  "green bean",
  "kale",
  "leek",
  "lettuce",
  "mange tout",
  "mushroom",
  "okra",
  "onion",
  "pak choi",
  "parsnip",
  "pea",
  "pepper",
  "potato",
  "pumpkin",
  "radish",
  "rocket",
  "shallot",
  "spinach",
  "spring green",
  "spring onion",
  "squash",
  "sweetcorn",
  "sweet potato",
  "swede",
  "tomato",
  "turnip",
  "watercress",
  "mixed vegetable",
  "seasonal vegetable",
  "frozen vegetable",
  "stir-fry vegetable"
]);
var INGREDIENT_CATEGORY_ALIASES = {
  vegetable: "vegetable",
  vegetables: "vegetable",
  veg: "vegetable",
  veggies: "vegetable",
  protein: "protein",
  proteins: "protein",
  carbohydrate: "carbohydrate",
  carbohydrates: "carbohydrate",
  carb: "carbohydrate",
  carbs: "carbohydrate"
};
var CATEGORY_LABEL_PATTERN = /\b(vegetable|vegetables|veg|veggies|protein|proteins|carbohydrate|carbohydrates|carb|carbs)\b/gi;
var CATEGORY_QUANTITY_PATTERN = /\b(?:(?:at\s+least|a\s+minimum\s+of)\s+)?(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|a\s+couple\s+of|a\s+few)\s+(?:(?:different|distinct|separate)\s+)?(vegetable|vegetables|veg|veggies|protein|proteins|carbohydrate|carbohydrates|carb|carbs)\b/gi;
var CATEGORY_QUANTITY_WORDS = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  "a couple of": 2,
  "a few": 3
};
var normaliseCategoryQuantities = (query2) => {
  const minimums = {};
  const quantityNormalisedQuery = query2.replace(CATEGORY_QUANTITY_PATTERN, (_match, rawQuantity, rawCategory) => {
    const category = INGREDIENT_CATEGORY_ALIASES[rawCategory.toLowerCase()];
    const quantity = Number(rawQuantity) || CATEGORY_QUANTITY_WORDS[rawQuantity.toLowerCase()];
    if (category && quantity > 0) {
      minimums[category] = Math.max(minimums[category] || 0, quantity);
      return category;
    }
    return rawCategory;
  });
  const labelNormalisedQuery = quantityNormalisedQuery.replace(
    CATEGORY_LABEL_PATTERN,
    (rawCategory) => INGREDIENT_CATEGORY_ALIASES[rawCategory.toLowerCase()] || rawCategory
  );
  const queryWithConnectors = /\b(?:vegetable|veg|veggies|protein|carbohydrate|carbs?)\b/i.test(labelNormalisedQuery) ? labelNormalisedQuery.replace(/\b(?:with|plus)\b/gi, " and ") : labelNormalisedQuery;
  return { query: queryWithConnectors, minimums };
};
var PROTEIN_CATEGORY_TERMS = /* @__PURE__ */ new Set([
  "anchovy",
  "bacon",
  "beef",
  "bean",
  "chickpea",
  "chorizo",
  "chicken",
  "crab",
  "duck",
  "egg",
  "game",
  "haddock",
  "ham",
  "hake",
  "herring",
  "lamb",
  "lentil",
  "lobster",
  "mackerel",
  "monkfish",
  "mussel",
  "oyster",
  "pancetta",
  "pea",
  "pork",
  "prawn",
  "rabbit",
  "salmon",
  "sausage",
  "scallop",
  "seitan",
  "sardine",
  "squid",
  "tofu",
  "trout",
  "tuna",
  "turkey",
  "venison",
  "white fish",
  "tempeh",
  "edamame",
  "quinoa",
  "almond",
  "cashew",
  "peanut",
  "walnut",
  "pistachio"
]);
var CARBOHYDRATE_CATEGORY_TERMS = /* @__PURE__ */ new Set([
  "barley",
  "bean",
  "bread",
  "bulgur wheat",
  "chickpea",
  "couscous",
  "corn",
  "flour",
  "gnocchi",
  "lentil",
  "macaroni",
  "naan",
  "noodle",
  "oat",
  "orzo",
  "pasta",
  "pea",
  "pitta",
  "polenta",
  "potato",
  "quinoa",
  "rice",
  "roti",
  "spaghetti",
  "sweetcorn",
  "sweet potato",
  "tortilla",
  "wrap",
  "yam",
  "plantain",
  "cassava"
]);
var AMBIGUOUS_STANDALONE_DISH_TERMS = /* @__PURE__ */ new Set([
  "chilli",
  "pasta",
  "rice",
  "noodle",
  "steak"
]);
var COMPOUND_INGREDIENT_MODIFIERS = /* @__PURE__ */ new Set([
  "juice",
  "fillet",
  "fillets",
  "steak",
  "steaks",
  "breast",
  "thigh",
  "wing",
  "leg",
  "chop",
  "chops",
  "mince",
  "minced",
  "sausage",
  "sausages",
  "tenderloin",
  "tender",
  "strip",
  "drumstick",
  "drumsticks",
  "drumette",
  "drumettes",
  "quarter",
  "quarters",
  "crown",
  "crowns",
  "piece",
  "pieces",
  "portion",
  "portions",
  "giblet",
  "giblets",
  "liver",
  "livers",
  "heart",
  "hearts",
  "neck",
  "necks",
  "paste",
  "puree",
  "sauce",
  "stock",
  "cube",
  "oil",
  "vinegar",
  "cream",
  "milk",
  "powder",
  "fresh",
  "frozen",
  "tinned",
  "canned",
  "cooked",
  "raw",
  "large",
  "medium",
  "small",
  "new",
  "baby",
  "mashed",
  "boiled",
  "baked",
  "roasted",
  "diced",
  "chopped",
  "sliced",
  "quartered",
  "halved"
]);
var extractIngredientPreparationPreferences = (query2) => {
  const source = typeof query2 === "string" ? query2 : "";
  const preferences = {};
  const skinOn = /\bskin[-\s]+on\b|\bwith(?:\s+the)?\s+skin\b|\bskin\s+attached\b/gi;
  const skinOff = /\bskinless\b|\bwithout(?:\s+the)?\s+skin\b|\bno\s+skin\b/gi;
  const boneIn = /\bbone[-\s]+in\b|\bwith(?:\s+the)?\s+bones?\b|\bon\s+the\s+bone\b/gi;
  const boneOut = /\bboneless\b|\bwithout(?:\s+the)?\s+bones?\b|\bno\s+bones?\b/gi;
  const hasFishContext = /\b(?:fish|salmon|cod|haddock|mackerel|trout|tuna|sardine|herring|pollock|plaice|hake|monkfish|bass|anchovy)\b/i.test(source);
  const fishFilleted = hasFishContext ? /\bfilleted\b/gi : /$^/g;
  const fishFilletNoun = hasFishContext ? /\bfillet(?:s)?\b/gi : /$^/g;
  const fishWhole = hasFishContext ? /\bwhole\b/gi : /$^/g;
  const fishSteak = hasFishContext ? /\bsteaks?\b/gi : /$^/g;
  if (source.match(skinOn)) preferences.skin = "on";
  if (source.match(skinOff)) preferences.skin = "off";
  if (source.match(boneIn)) preferences.bone = "in";
  if (source.match(boneOut)) preferences.bone = "out";
  if (source.match(fishFilleted) || source.match(fishFilletNoun)) preferences.fishForm = "filleted";
  if (source.match(fishWhole)) preferences.fishForm = "whole";
  if (source.match(fishSteak)) preferences.fishForm = "steak";
  const cleanedQuery = source.replace(skinOn, " ").replace(skinOff, " ").replace(boneIn, " ").replace(boneOut, " ").replace(fishFilleted, " ").replace(fishWhole, " ").replace(fishSteak, " ").replace(/\s+/g, " ").trim();
  return { cleanedQuery, preferences };
};
var hasPreparationPreferences = (preferences) => Boolean(preferences.skin || preferences.bone || preferences.fishForm);
var PREFIX_INGREDIENT_MODIFIERS = /* @__PURE__ */ new Set([
  "fresh",
  "frozen",
  "tinned",
  "canned",
  "cooked",
  "raw",
  "large",
  "medium",
  "small",
  "new",
  "baby",
  "mashed",
  "boiled",
  "baked",
  "roasted",
  "diced",
  "chopped",
  "sliced",
  "quartered",
  "halved"
]);
var parseUnseparatedIngredientList = (query2) => {
  const words = query2.split(/\s+/).filter((word) => !/^and$/i.test(word));
  const parsed = [];
  for (let index = 0; index < words.length; ) {
    let matchedPhrase = false;
    const maxPhraseLength = Math.min(3, words.length - index);
    for (let phraseLength = maxPhraseLength; phraseLength >= 2; phraseLength -= 1) {
      const phrase = words.slice(index, index + phraseLength).join(" ");
      const normalisedPhrase = parseAndNormaliseIngredients(phrase)[0];
      const firstWord = words[index].toLowerCase();
      const lastWord = words[index + phraseLength - 1].toLowerCase();
      const modifierBody = firstWord !== lastWord && PREFIX_INGREDIENT_MODIFIERS.has(firstWord) ? parseAndNormaliseIngredients(words.slice(index + 1, index + phraseLength).join(" "))[0] : normalisedPhrase;
      const isKnownCompound = UNSEPARATED_INGREDIENT_PHRASES.has(normalisedPhrase) || UNSEPARATED_INGREDIENT_TERMS.has(normalisedPhrase) && COMPOUND_INGREDIENT_MODIFIERS.has(lastWord) || firstWord !== lastWord && PREFIX_INGREDIENT_MODIFIERS.has(firstWord) && UNSEPARATED_INGREDIENT_TERMS.has(modifierBody);
      if (isKnownCompound) {
        parsed.push(normalisedPhrase);
        index += phraseLength;
        matchedPhrase = true;
        break;
      }
    }
    if (matchedPhrase) continue;
    const normalisedWord = parseAndNormaliseIngredients(words[index])[0];
    if (!normalisedWord || !UNSEPARATED_INGREDIENT_TERMS.has(normalisedWord)) return [];
    parsed.push(normalisedWord);
    index += 1;
  }
  return parsed;
};
function detectIngredientIntent(query2) {
  const trimmed = query2?.trim();
  if (!trimmed) return null;
  const { cleanedQuery, preferences } = extractIngredientPreparationPreferences(trimmed);
  const hasPreparation = hasPreparationPreferences(preferences);
  const { query: categoryNormalisedQuery, minimums: categoryMinimums } = normaliseCategoryQuantities(cleanedQuery);
  const lower = categoryNormalisedQuery.toLowerCase();
  const ingredientPhrases = /\b(i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only|what can i make with|what can i cook with)\b/i;
  const hasListPunctuation = /[,;]/.test(cleanedQuery);
  const hasSimpleAndList = /\b\w+\b\s+\band\b\s+\b\w+\b/i.test(lower) && lower.split(/\s+/).length <= 7;
  const withoutLeadIn = lower.replace(/\b(what can i make with|what can i cook with|i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only)\b/gi, "").replace(/\b(?:only|just)\b/gi, " ").replace(/[?!.]/g, " ").trim();
  const ingredients = parseAndNormaliseIngredients(withoutLeadIn || categoryNormalisedQuery).map((item) => item.replace(/^(some|a bit of|a few|half a|one|two|three)\s+/i, "").trim()).filter((item) => item.length > 1 && item.split(/\s+/).length <= 3);
  const shortIngredientQuery = withoutLeadIn || categoryNormalisedQuery;
  const unseparatedWords = shortIngredientQuery.split(/\s+/).filter((word) => !/^and$/i.test(word));
  const unseparatedIngredients = parseUnseparatedIngredientList(shortIngredientQuery);
  const categoryMetadata = Object.keys(categoryMinimums).length > 0 ? { categoryMinimums } : {};
  const isShortUnseparatedIngredientList = !hasListPunctuation && !ingredientPhrases.test(trimmed) && unseparatedWords.length >= 2 && unseparatedWords.length <= 6 && unseparatedIngredients.length >= 2 && unseparatedIngredients.length <= 4;
  if (isShortUnseparatedIngredientList) {
    return { isIngredientLed: true, ingredients: unseparatedIngredients, reason: "short-food-list", ...categoryMetadata, ...hasPreparation ? { preparationPreferences: preferences } : {} };
  }
  const isStandaloneIngredientSearch = !hasListPunctuation && !ingredientPhrases.test(trimmed) && !/\b(?:recipe|recipes|dish|dishes|dinner|dinners|ideas|idea|curry)\b/i.test(cleanedQuery) && ingredients.length === 1 && unseparatedWords.length === 1 && UNSEPARATED_INGREDIENT_TERMS.has(ingredients[0]) && !AMBIGUOUS_STANDALONE_DISH_TERMS.has(ingredients[0]);
  if (isStandaloneIngredientSearch) {
    return { isIngredientLed: true, ingredients, reason: "short-food-list", ...categoryMetadata, ...hasPreparation ? { preparationPreferences: preferences } : {} };
  }
  if (ingredients.length >= 2 && ingredientPhrases.test(cleanedQuery)) {
    return { isIngredientLed: true, ingredients, reason: "phrase", ...categoryMetadata, ...hasPreparation ? { preparationPreferences: preferences } : {} };
  }
  if (ingredients.length >= 2 && hasListPunctuation) {
    return { isIngredientLed: true, ingredients, reason: "list", ...categoryMetadata, ...hasPreparation ? { preparationPreferences: preferences } : {} };
  }
  if (ingredients.length >= 2 && hasSimpleAndList) {
    if (unseparatedIngredients.length === ingredients.length) {
      return { isIngredientLed: true, ingredients: unseparatedIngredients, reason: "short-food-list", ...categoryMetadata, ...hasPreparation ? { preparationPreferences: preferences } : {} };
    }
  }
  if (hasPreparation && ingredients.length > 0) {
    return { isIngredientLed: true, ingredients, reason: "short-food-list", ...categoryMetadata, preparationPreferences: preferences };
  }
  return null;
}
var PANTRY_STAPLE_PATTERN = /^(?:water|salt|pepper|black pepper|white pepper|oil|olive oil|vegetable oil|sunflower oil|rapeseed oil|cooking spray|seasoning|mixed herbs?|dried herbs?|fresh herbs?|herbs?|spices?)$/i;
var INGREDIENT_MODIFIER_PATTERN = /^(?:a|an|the|fresh|frozen|tinned|canned|dried|cooked|raw|large|medium|small|baby|new|free[- ]range|boneless|skinless|lean|smoked|unsmoked|cured|grated|chopped|diced|sliced|quartered|halved|mashed|boiled|roasted|baked|trimmed|drained)$/i;
var INGREDIENT_VARIANT_WORDS = {
  bacon: /* @__PURE__ */ new Set(["streaky", "back", "smoked", "unsmoked", "rasher", "lardon", "medallion", "bit", "pancetta"]),
  pork: /* @__PURE__ */ new Set([
    "mince",
    "chop",
    "loin",
    "tenderloin",
    "shoulder",
    "belly",
    "leg",
    "fillet",
    "steak",
    "rib",
    "sausage",
    "joint",
    "roast",
    "roasting",
    "pulled",
    "diced",
    "knuckle",
    "hock",
    "collar",
    "neck",
    "escalope",
    "schnitzel",
    "gammon"
  ]),
  onion: /* @__PURE__ */ new Set(["red", "white", "spring"]),
  potato: /* @__PURE__ */ new Set(["new", "roast"]),
  // Generic tomato searches should include common substantive forms used in
  // UK recipes, including passata and purée.
  tomato: /* @__PURE__ */ new Set([
    "cherry",
    "plum",
    "beef",
    "tinned",
    "chopped",
    "sun-dried",
    "sundried",
    "puree",
    "pur\xE9e",
    "paste",
    "passata",
    "sauce",
    "based"
  ]),
  egg: /* @__PURE__ */ new Set(["hen", "chicken", "duck", "goose", "quail"]),
  pepper: /* @__PURE__ */ new Set(["red", "green", "yellow", "bell"]),
  chicken: /* @__PURE__ */ new Set([
    "breast",
    "thigh",
    "wing",
    "leg",
    "fillet",
    "tenderloin",
    "tender",
    "strip",
    "drumstick",
    "drumette",
    "winglet",
    "quarter",
    "crown",
    "whole",
    "piece",
    "portion",
    "mince",
    "sausage",
    "giblet",
    "liver",
    "heart",
    "neck"
  ]),
  beef: /* @__PURE__ */ new Set([
    "mince",
    "steak",
    "fillet",
    "sirloin",
    "ribeye",
    "rib",
    "rump",
    "topside",
    "silverside",
    "top",
    "thick",
    "flank",
    "chuck",
    "braising",
    "stewing",
    "shin",
    "brisket",
    "short",
    "skirt",
    "featherblade",
    "bavette",
    "onglet",
    "flat",
    "hanger",
    "cheek",
    "oxtail",
    "striploin",
    "porterhouse",
    "tomahawk",
    "medallion",
    "diced",
    "joint",
    "roasting",
    "tenderloin"
  ]),
  lamb: /* @__PURE__ */ new Set([
    "mince",
    "chop",
    "shoulder",
    "leg",
    "neck",
    "loin",
    "steak",
    "fillet",
    "rack",
    "cutlet",
    "breast",
    "saddle",
    "rib",
    "medallion",
    "kebab",
    "shank"
  ]),
  turkey: /* @__PURE__ */ new Set(["mince", "breast", "thigh"]),
  duck: /* @__PURE__ */ new Set(["breast", "leg", "fillet"]),
  fish: /* @__PURE__ */ new Set([
    "salmon",
    "cod",
    "haddock",
    "mackerel",
    "trout",
    "tuna",
    "sardine",
    "herring",
    "pollock",
    "plaice",
    "hake",
    "monkfish",
    "bass",
    "anchovy",
    "white",
    "oily",
    "sea",
    "fillet",
    "fillets",
    "steak",
    "steaks",
    "portion",
    "portions",
    "side",
    "sides",
    "whole"
  ]),
  rice: /* @__PURE__ */ new Set(["wild", "brown", "basmati", "long", "jasmine", "bomba", "risotto"]),
  bean: /* @__PURE__ */ new Set(["butter", "kidney", "black", "cannellini", "haricot", "baked", "green", "broad", "fava", "runner", "edamame"]),
  lentil: /* @__PURE__ */ new Set(["red", "green", "brown", "black", "puy"]),
  noodle: /* @__PURE__ */ new Set(["egg", "rice", "udon", "soba"]),
  mushroom: /* @__PURE__ */ new Set(["chestnut", "button", "wild", "portobello", "shiitake", "oyster"]),
  cheese: /* @__PURE__ */ new Set(["cheddar", "goat", "cottage", "cream", "blue", "feta", "parmesan", "mozzarella", "halloumi", "ricotta"]),
  yoghurt: /* @__PURE__ */ new Set(["greek", "natural", "plain"]),
  salmon: /* @__PURE__ */ new Set(["fillet", "steak", "portion", "side"]),
  cod: /* @__PURE__ */ new Set(["fillet", "loin", "steak", "portion"]),
  haddock: /* @__PURE__ */ new Set(["fillet", "loin", "portion"]),
  mackerel: /* @__PURE__ */ new Set(["fillet", "steak", "portion"]),
  trout: /* @__PURE__ */ new Set(["fillet", "steak", "portion"]),
  tuna: /* @__PURE__ */ new Set(["fillet", "steak", "portion"]),
  plaice: /* @__PURE__ */ new Set(["fillet", "portion", "side", "whole"]),
  sardine: /* @__PURE__ */ new Set(["fillet", "portion", "whole"]),
  herring: /* @__PURE__ */ new Set(["fillet", "portion", "whole"]),
  pollock: /* @__PURE__ */ new Set(["fillet", "loin", "portion"]),
  hake: /* @__PURE__ */ new Set(["fillet", "loin", "portion"]),
  monkfish: /* @__PURE__ */ new Set(["fillet", "tail", "portion"]),
  anchovy: /* @__PURE__ */ new Set(["fillet"]),
  sausage: /* @__PURE__ */ new Set(["pork", "chicken", "beef", "lamb", "turkey", "vegetarian", "veggie", "chipolata"]),
  prawn: /* @__PURE__ */ new Set(["tiger", "king"]),
  crab: /* @__PURE__ */ new Set(["king", "meat", "claw", "white", "brown", "lump"]),
  bass: /* @__PURE__ */ new Set(["sea"])
};
var FISH_SPECIES_WORDS = /* @__PURE__ */ new Set([
  "salmon",
  "cod",
  "haddock",
  "mackerel",
  "trout",
  "tuna",
  "sardine",
  "herring",
  "pollock",
  "plaice",
  "hake",
  "monkfish",
  "bass",
  "anchovy"
]);
var FISH_FORM_WORDS = /* @__PURE__ */ new Set([
  "fillet",
  "fillets",
  "steak",
  "steaks",
  "portion",
  "portions",
  "side",
  "sides",
  "whole"
]);
var BEEF_CUT_TERMS = /* @__PURE__ */ new Set([
  "fillet",
  "sirloin",
  "rib",
  "ribeye",
  "ribeye steak",
  "rib steak",
  "striploin",
  "striploin steak",
  "rump",
  "topside",
  "silverside",
  "beef silverside",
  "top rump",
  "thick flank",
  "chuck",
  "chuck steak",
  "chuck roast",
  "braising steak",
  "stewing steak",
  "frying steak",
  "minute steak",
  "shin",
  "brisket",
  "short rib",
  "flank",
  "flank steak",
  "skirt",
  "skirt steak",
  "featherblade",
  "featherblade steak",
  "bavette",
  "bavette steak",
  "onglet",
  "onglet steak",
  "flat iron",
  "flat iron steak",
  "hanger",
  "hanger steak",
  "beef cheek",
  "oxtail",
  "diced beef",
  "stewing beef",
  "braising beef",
  "beef joint",
  "beef striploin",
  "beef striploin steak",
  "chuck roast",
  "frying steak",
  "minute steak",
  "t-bone",
  "t-bone steak",
  "porterhouse steak",
  "tomahawk",
  "tomahawk steak",
  "porterhouse",
  "beef hanger steak",
  "medallion",
  "beef medallion",
  "roasting joint",
  "beef roasting joint",
  "topside joint",
  "silverside joint",
  "beef silverside joint",
  "rump joint",
  "pot roast"
]);
var BEEF_CUT_VARIANT_WORDS = /* @__PURE__ */ new Set([
  "beef",
  "steak",
  "joint",
  "roast",
  "fillet",
  "loin",
  "portion",
  "diced",
  "braising",
  "stewing",
  "rib",
  "striploin",
  "porterhouse",
  "tomahawk",
  "medallion",
  "roasting"
]);
var BACON_VARIANT_TERMS = /* @__PURE__ */ new Set([
  "streaky bacon",
  "back bacon",
  "smoked bacon",
  "unsmoked bacon",
  "bacon rasher",
  "bacon lardon",
  "bacon medallion",
  "bacon bit",
  "pancetta"
]);
var BACON_VARIANT_WORDS = /* @__PURE__ */ new Set([
  "bacon",
  "streaky",
  "back",
  "smoked",
  "unsmoked",
  "rasher",
  "lardon",
  "medallion",
  "bit",
  "pancetta"
]);
var PORK_CUT_TERMS = /* @__PURE__ */ new Set([
  "pork belly",
  "pork loin",
  "pork tenderloin",
  "pork shoulder",
  "pork leg",
  "pork chop",
  "pork steak",
  "pork rib",
  "pork joint",
  "pork roasting joint",
  "pork fillet",
  "pork medallion",
  "pork knuckle",
  "pork hock",
  "pork collar",
  "pork neck",
  "pork escalope",
  "pork schnitzel",
  "spare rib",
  "baby back rib",
  "gammon steak",
  "gammon joint",
  "roast pork",
  "roasting pork",
  "pulled pork",
  "diced pork"
]);
var PORK_CUT_VARIANT_WORDS = /* @__PURE__ */ new Set([
  "pork",
  "mince",
  "chop",
  "loin",
  "tenderloin",
  "shoulder",
  "belly",
  "leg",
  "fillet",
  "steak",
  "rib",
  "joint",
  "roast",
  "roasting",
  "pulled",
  "diced",
  "knuckle",
  "hock",
  "collar",
  "neck",
  "escalope",
  "schnitzel",
  "gammon"
]);
var CHICKEN_CUT_TERMS = /* @__PURE__ */ new Set([
  "chicken breast",
  "chicken thigh",
  "chicken wing",
  "chicken leg",
  "chicken fillet",
  "chicken tenderloin",
  "chicken tender",
  "chicken strip",
  "chicken drumstick",
  "chicken drumette",
  "chicken breast fillet",
  "chicken thigh fillet",
  "chicken winglet",
  "chicken quarter",
  "chicken leg quarter",
  "chicken crown",
  "whole chicken",
  "chicken piece",
  "chicken portion",
  "chicken mince",
  "chicken sausage",
  "chicken giblet",
  "chicken liver",
  "chicken heart",
  "chicken neck"
]);
var CHICKEN_CUT_VARIANT_WORDS = /* @__PURE__ */ new Set([
  "chicken",
  "breast",
  "thigh",
  "wing",
  "leg",
  "fillet",
  "tenderloin",
  "tender",
  "strip",
  "drumstick",
  "drumette",
  "winglet",
  "quarter",
  "crown",
  "whole",
  "piece",
  "portion",
  "mince",
  "sausage",
  "giblet",
  "liver",
  "heart",
  "neck"
]);
var stripIngredientQuantity = (value) => value.replace(/^\s*[\d¼½¾⅓⅔⅛⅜⅝⅞]+(?:[\d\/\s.-]+)?\s*(?:g|kg|ml|l|oz|lb|tbsp|tsp|tablespoons?|teaspoons?|cups?|cloves?|slices?|pieces?|pcs|cans?|tins?|packets?|packs?|bunches?|sprigs?)?\s*/i, "").replace(/\([^)]*\)/g, " ").replace(/[•*]/g, " ").replace(/\s+/g, " ").trim();
var normaliseStrictIngredientLine = (value) => {
  const stripped = stripIngredientQuantity(value);
  const parsed = parseAndNormaliseIngredients(stripped);
  return parsed.length > 0 ? parsed : [stripped.toLowerCase()];
};
var isPantryStaple = (value) => {
  const normalised = value.trim().toLowerCase();
  return PANTRY_STAPLE_PATTERN.test(normalised) || /^(?:(?:freshly|coarsely|finely)\s+)?ground\s+(?:black|white)?\s*pepper$/i.test(normalised) || /^(?:sea|fine|coarse)\s+salt$/i.test(normalised) || normalised.split(/\s+/).every((word) => INGREDIENT_MODIFIER_PATTERN.test(word));
};
var matchesAllowedIngredient = (value, allowed) => {
  const valueWithoutPreparation = extractIngredientPreparationPreferences(value).cleanedQuery;
  const valueWords = valueWithoutPreparation.toLowerCase().split(/\s+/).filter(Boolean);
  const allowedWords = allowed.toLowerCase().split(/\s+/).filter(Boolean);
  const allowedKey = allowedWords.join(" ");
  if (valueWords.join(" ") === allowedWords.join(" ")) return true;
  const allowedStart = valueWords.findIndex(
    (_, index) => allowedWords.every((word, offset) => valueWords[index + offset] === word)
  );
  if (allowedStart < 0) {
    if (allowedKey !== "fish") return false;
    const speciesIndex = valueWords.findIndex((word) => FISH_SPECIES_WORDS.has(word));
    if (speciesIndex < 0) return false;
    const remainingWords2 = valueWords.filter((_, index) => index !== speciesIndex);
    return remainingWords2.length === 0 || remainingWords2.every(
      (word) => INGREDIENT_MODIFIER_PATTERN.test(word) || FISH_FORM_WORDS.has(word) || word === "sea"
    );
  }
  const remainingWords = valueWords.filter(
    (_, index) => index < allowedStart || index >= allowedStart + allowedWords.length
  );
  const allowedVariantWords = INGREDIENT_VARIANT_WORDS[allowedKey] || (FISH_SPECIES_WORDS.has(allowedKey) || allowedKey === "sea bass" ? /* @__PURE__ */ new Set([...FISH_FORM_WORDS, "loin", "tail"]) : allowedKey === "fish" ? /* @__PURE__ */ new Set([...FISH_SPECIES_WORDS, ...FISH_FORM_WORDS, "white", "oily", "sea"]) : BEEF_CUT_TERMS.has(allowedKey) ? BEEF_CUT_VARIANT_WORDS : BACON_VARIANT_TERMS.has(allowedKey) ? BACON_VARIANT_WORDS : PORK_CUT_TERMS.has(allowedKey) ? PORK_CUT_VARIANT_WORDS : CHICKEN_CUT_TERMS.has(allowedKey) ? CHICKEN_CUT_VARIANT_WORDS : /* @__PURE__ */ new Set());
  return remainingWords.length === 0 || remainingWords.every(
    (word) => INGREDIENT_MODIFIER_PATTERN.test(word) || allowedVariantWords.has(word)
  );
};
var matchesVegetableCategory = (value) => {
  const normalisedValue = value.trim().toLowerCase();
  if (/\bvegetable\s+(?:oil|stock|broth|bouillon)\b/i.test(normalisedValue)) return false;
  const parsedValues = parseAndNormaliseIngredients(normalisedValue);
  return parsedValues.some((candidate) => candidate === "vegetable" || VEGETABLE_CATEGORY_TERMS.has(candidate) || candidate.split(/\s+/).some((word) => VEGETABLE_CATEGORY_TERMS.has(word)));
};
var matchesIngredientCategory = (value, categoryTerms) => {
  const normalisedValue = value.trim().toLowerCase();
  const parsedValues = parseAndNormaliseIngredients(normalisedValue);
  return parsedValues.some((candidate) => {
    if (categoryTerms.has(candidate)) return true;
    return candidate.split(/\s+/).some((word) => categoryTerms.has(word));
  });
};
var matchesRequestedIngredient = (value, allowed) => allowed === "vegetable" ? matchesVegetableCategory(value) : allowed === "protein" ? matchesIngredientCategory(value, PROTEIN_CATEGORY_TERMS) : allowed === "carbohydrate" ? matchesIngredientCategory(value, CARBOHYDRATE_CATEGORY_TERMS) : matchesAllowedIngredient(value, allowed);
var isIngredientCategory = (value) => value === "vegetable" || value === "protein" || value === "carbohydrate";
var matchesRequestedPreparation = (value, requested) => {
  if (!requested || !hasPreparationPreferences(requested)) return true;
  const found = extractIngredientPreparationPreferences(value).preferences;
  const isFishOrMeatLine = /\b(?:fish|salmon|cod|haddock|mackerel|trout|tuna|sardine|herring|pollock|plaice|hake|monkfish|bass|anchovy|chicken|turkey|duck|pork|beef|lamb|venison|rabbit)\b/i.test(value);
  if (!isFishOrMeatLine) return true;
  return (!requested.skin || found.skin === requested.skin) && (!requested.bone || found.bone === requested.bone) && (!requested.fishForm || found.fishForm === requested.fishForm);
};
function matchesRequestedIngredientSearch(item, query2) {
  const intent = detectIngredientIntent(query2);
  if (!intent?.isIngredientLed || intent.ingredients.length === 0) return true;
  const ingredientLines = Array.isArray(item.ingredients) ? item.ingredients.filter(Boolean) : [];
  if (ingredientLines.length === 0) return false;
  const normalisedLines = ingredientLines.flatMap(normaliseStrictIngredientLine);
  const requestedIngredients = intent.ingredients;
  const requestedPreparation = intent.preparationPreferences;
  return requestedIngredients.every(
    (requested) => isIngredientCategory(requested) && (intent.categoryMinimums?.[requested] || 1) > 1 ? new Set(normalisedLines.filter(
      (line) => matchesRequestedIngredient(line, requested) && matchesRequestedPreparation(line, requestedPreparation)
    )).size >= (intent.categoryMinimums?.[requested] || 1) : normalisedLines.some(
      (line) => matchesRequestedIngredient(line, requested) && matchesRequestedPreparation(line, requestedPreparation)
    )
  );
}
function matchesStrictIngredientSearch(item, query2) {
  if (!matchesRequestedIngredientSearch(item, query2)) return false;
  const ingredientLines = Array.isArray(item.ingredients) ? item.ingredients.filter(Boolean) : [];
  if (typeof item.totalIngredientsCount === "number" && item.totalIngredientsCount > ingredientLines.length) return false;
  const intent = detectIngredientIntent(query2);
  if (!intent?.isIngredientLed || intent.ingredients.length === 0) return true;
  const normalisedLines = ingredientLines.flatMap(normaliseStrictIngredientLine);
  const requestedIngredients = intent.ingredients;
  const requestedPreparation = intent.preparationPreferences;
  return normalisedLines.every(
    (line) => isPantryStaple(line) || requestedIngredients.some(
      (requested) => matchesRequestedIngredient(line, requested) && matchesRequestedPreparation(line, requestedPreparation)
    )
  );
}

// src/lib/offalPreference.ts
var OFFAL_INCOMPATIBLE_DIETARY_RULES = /* @__PURE__ */ new Set([
  "pescatarian",
  "vegetarian",
  "vegan"
]);
var dietaryRuleAllowsOffal = (dietaryRule) => !dietaryRule || !OFFAL_INCOMPATIBLE_DIETARY_RULES.has(dietaryRule);

// src/lib/preferenceCompatibility.ts
var DIETARY_COOKING_FAT_EXCLUSIONS = {
  pescatarian: ["lard", "dripping"],
  vegetarian: ["lard", "dripping"],
  vegan: ["butter", "ghee", "lard", "dripping"],
  // Use a strict Paleo interpretation so the dropdown does not offer fats
  // that the deterministic recipe safety check will reject.
  paleo: ["butter", "ghee", "vegetable oil"]
};
var normaliseCookingFat = (fat) => fat.trim().toLowerCase();
var dietaryRuleAllowsCookingFat = (dietaryRule, fat) => {
  const exclusions = DIETARY_COOKING_FAT_EXCLUSIONS[dietaryRule] || [];
  const normalisedFat = normaliseCookingFat(fat);
  return !exclusions.some((exclusion) => normalisedFat.includes(exclusion));
};
var filterCookingFatsForDiet = (dietaryRule, fats) => fats.filter((fat) => dietaryRuleAllowsCookingFat(dietaryRule, fat));

// src/lib/groundingUtils.ts
var TRUSTED_RECIPE_PUBLISHER_HOSTS = /* @__PURE__ */ new Set([
  "bbcgoodfood.com",
  "bbc.co.uk",
  "tescorealfood.com",
  "tesco.com",
  "theguardian.com",
  "mob.co.uk",
  "deliciousmagazine.co.uk",
  "thehappyfoodie.co.uk",
  "kitchensanctuary.com",
  "diabetes.org.uk",
  "slimmingworld.co.uk",
  "jamieoliver.com",
  "waitrose.com",
  "asda.com",
  "sainsburysmagazine.co.uk",
  "olivemagazine.com",
  "greatbritishchefs.com",
  "telegraph.co.uk",
  "thetimes.com",
  "thesundaytimes.co.uk",
  "goodhousekeeping.com"
]);
var canonicaliseGroundedUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value.trim())) return null;
  try {
    const url = new URL(value.trim());
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};
var normaliseGroundedUrlForMatch = (value) => {
  const url = new URL(value);
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  url.hash = "";
  const meaningfulParams = [...url.searchParams.entries()].filter(([key]) => !/^(utm_[^=]+|gclid|fbclid|dclid|msclkid)$/i.test(key)).sort(([leftKey, leftValue], [rightKey, rightValue]) => leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
  url.search = new URLSearchParams(meaningfulParams).toString();
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
};
var reconcileGroundedSourceUrl = (candidate, sources) => {
  const canonicalCandidate = canonicaliseGroundedUrl(candidate);
  if (!canonicalCandidate) return null;
  const exactMatch = sources.find((source) => canonicaliseGroundedUrl(source.url) === canonicalCandidate);
  if (exactMatch) return canonicaliseGroundedUrl(exactMatch.url);
  const candidateMatchKey = normaliseGroundedUrlForMatch(canonicalCandidate);
  const relaxedMatch = sources.find((source) => {
    const canonicalSource = canonicaliseGroundedUrl(source.url);
    return canonicalSource && normaliseGroundedUrlForMatch(canonicalSource) === candidateMatchKey;
  });
  return relaxedMatch ? canonicaliseGroundedUrl(relaxedMatch.url) : null;
};
var isInternalGroundingUrl = (value) => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;
  const host = new URL(canonicalUrl).hostname.toLowerCase();
  return host === "vertexaisearch.cloud.google.com" || host === "vertexaisearch.googleapis.com" || host.endsWith(".vertexaisearch.cloud.google.com");
};
var isTrustedRecipePublisherUrl = (value) => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;
  const host = new URL(canonicalUrl).hostname.toLowerCase().replace(/^www\./, "");
  return TRUSTED_RECIPE_PUBLISHER_HOSTS.has(host);
};
var isDirectHttpsContentUrl = (value) => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  if (!canonicalUrl) return false;
  const url = new URL(canonicalUrl);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname === "/" || /\/(?:search|tag|category|topics?|cuisines?|collections?)(?:\/|$)/i.test(url.pathname)) {
    return false;
  }
  return !["q", "query", "search", "s"].some((param) => url.searchParams.has(param));
};
var isApprovedDirectRecipeUrl = (value) => {
  const canonicalUrl = canonicaliseGroundedUrl(value);
  return !!canonicalUrl && !isInternalGroundingUrl(canonicalUrl) && isTrustedRecipePublisherUrl(canonicalUrl) && isDirectHttpsContentUrl(canonicalUrl);
};

// src/lib/enrichmentRequest.ts
var invalid = (code, message) => ({
  ok: false,
  code,
  message
});
var validateEnrichmentRequestPayload = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return invalid("ENRICHMENT_REQUEST_INVALID", "The enrichment request is invalid.");
  }
  const request = body;
  if (typeof request.title !== "string" || !request.title.trim() || request.title.trim().length > 240) {
    return invalid("ENRICHMENT_REQUEST_INVALID", "The recipe title is invalid.");
  }
  if (typeof request.cuisine !== "string" || request.cuisine.trim().length > 120) {
    return invalid("ENRICHMENT_REQUEST_INVALID", "The recipe cuisine is invalid.");
  }
  if (request.mode !== "cook" && request.mode !== "ready-made") {
    return invalid("ENRICHMENT_REQUEST_INVALID", "The enrichment mode is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(request, "strictIngredientMatch") && typeof request.strictIngredientMatch !== "boolean") {
    return invalid("ENRICHMENT_REQUEST_INVALID", "The ingredient matching setting is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(request, "strictQuery") && (typeof request.strictQuery !== "string" || request.strictQuery.trim().length > 500)) {
    return invalid("ENRICHMENT_REQUEST_TOO_LARGE", "Please shorten the ingredient search and try again.");
  }
  if (request.sourceUrl !== void 0 && request.sourceUrl !== null && !isDirectHttpsContentUrl(request.sourceUrl)) {
    return invalid("ENRICHMENT_SOURCE_INVALID", "The original recipe link is invalid.");
  }
  return { ok: true };
};
function buildEnrichmentRequestBody(title, cuisine, mode, options) {
  return {
    title,
    cuisine,
    mode,
    strictIngredientMatch: options?.strictIngredientMatch === true,
    strictQuery: options?.query || "",
    sourceUrl: options?.sourceUrl || null
  };
}
function parseEnrichmentRequestOptions(body) {
  if (!body || typeof body !== "object") return {};
  const request = body;
  const sourceUrl = typeof request.sourceUrl === "string" && request.sourceUrl.trim() ? request.sourceUrl : null;
  return {
    strictIngredientMatch: request.strictIngredientMatch === true,
    query: typeof request.strictQuery === "string" ? request.strictQuery : "",
    sourceUrl
  };
}

// src/lib/parseModelJson.ts
var parseModelJson = (text) => {
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Empty model response");
  const candidates = [trimmed];
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());
  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) {
    candidates.push(trimmed.slice(objectStart, objectEnd + 1));
  }
  let lastError;
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      lastError = error;
    }
    const repaired = candidate.replace(
      /("(?:items|rationales)"\s*:\s*)\[\s*(?:\.\.\.|…)\s*\]/g,
      "$1[]"
    ).replace(
      /("(?:items|rationales)"\s*:\s*)\.\.\.(?=\s*[,}])/g,
      "$1[]"
    );
    if (repaired !== candidate) {
      try {
        return JSON.parse(repaired);
      } catch (error) {
        lastError = error;
      }
    }
    if (/"items"\s*:\s*(?:\.\.\.|…|\[\s*(?:\.\.\.|…))/i.test(candidate)) {
      return { items: [] };
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Invalid model JSON");
};

// src/config/aiModel.ts
var ACTIVE_GEMINI_MODEL = "gemini-3.1-flash-lite";
var ENRICHMENT_GEMINI_MODEL = "gemini-3.5-flash";
var ACTIVE_GEMINI_PRICING_USD_PER_MILLION = {
  input: 0.25,
  output: 1.5
};
function estimateGeminiCostUsd(inputTokens, outputTokens) {
  return Math.max(inputTokens || 0, 0) / 1e6 * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.input + Math.max(outputTokens || 0, 0) / 1e6 * ACTIVE_GEMINI_PRICING_USD_PER_MILLION.output;
}

// src/constants.ts
var COOKING_METHOD_ALIASES = {
  "Air fryer": ["air-fried", "air fried", "air fryer"],
  "BBQ": ["barbecue", "barbecued", "barbeque", "barbecuing"],
  "Baked": ["bake", "baked", "baking", "oven-baked", "oven baked"],
  "Boiled": ["boil", "boiled"],
  "Braised": ["braise", "braised", "pot-roasted", "pot roasted"],
  "Broiled": ["broil", "broiled"],
  "Deep fried": ["deep-fried", "deep fried", "deep-frying", "deep frying"],
  "Fried": ["fry", "fried"],
  "Griddled": ["griddle", "griddled"],
  "Grilled": ["grill", "grilled"],
  "One pot": ["one-pot", "one pot"],
  "Oven bake": ["bake", "baked", "baking", "oven-baked", "oven baked"],
  "Pan fried": ["pan-fry", "pan-fried", "pan fried"],
  "Poached": ["poach", "poached"],
  "Roasted": ["roast", "roasted"],
  "Saut\xE9ed": ["saut\xE9", "saut\xE9ed", "saute", "sauteed"],
  "Seared": ["sear", "seared", "searing"],
  "Shallow fried": ["shallow-fried", "shallow fried"],
  "Slow cooker": ["slow-cooked", "slow cooked", "slow cooker"],
  "Smoked": ["smoke", "smoked", "smoking"],
  "Sous vide": ["sous-vide", "sous vide"],
  "Steamed": ["steam", "steamed"],
  "Stewed": ["stew", "stewed"],
  "Stir fry": ["stir-fry", "stir-fried", "stir fry"],
  "Tray bake": ["tray-bake", "tray bake"]
};

// src/services/geminiService.ts
var SEARCH_PERMISSION_MESSAGE = "Recipe search is temporarily unavailable because the search service account needs attention. This is on our side, so please try again later.";
var BROAD_CHILLI_FALLBACKS = [
  {
    title: "Quick beef chilli con carne",
    description: "A fast beef mince and kidney bean chilli with tomatoes, onion and warming spices.",
    cuisine: "Mexican-inspired",
    totalTime: 25,
    caloriesPerPortion: 450,
    costPerPortion: "\xA31.80 pp",
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: "scratch",
    ingredients: ["Beef mince", "Kidney beans", "Chopped tomatoes", "Chilli powder"],
    totalIngredientsCount: 8,
    sourceUrl: "https://www.bbcgoodfood.com/search?q=chilli%20con%20carne",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "high", reason: "Keeps and reheats well for another dinner.", storage: "Cool promptly and refrigerate for up to 2 days.", reheat: "Reheat until piping hot throughout." },
    realityChecks: [
      { label: "Weeknight fit", note: "Uses a short simmer for a faster version of the classic.", tone: "positive" },
      { label: "Shopping friction", note: "Uses ordinary mince, beans and tinned tomatoes.", tone: "positive" },
      { label: "Leftover friendly", note: "Usually reheats well and can be frozen.", tone: "positive" }
    ]
  },
  {
    title: "Turkey and black bean chilli",
    description: "A lean turkey mince chilli with black beans, tomatoes and smoky seasoning.",
    cuisine: "Mexican-inspired",
    totalTime: 25,
    caloriesPerPortion: 380,
    costPerPortion: "\xA31.80 pp",
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: "scratch",
    ingredients: ["Turkey mince", "Black beans", "Chopped tomatoes", "Smoked paprika"],
    totalIngredientsCount: 8,
    sourceUrl: "https://www.tescorealfood.com/search?query=turkey%20chilli",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "medium", reason: "The sauce keeps turkey mince from drying out too much.", storage: "Cool promptly and refrigerate for up to 2 days.", reheat: "Reheat with a splash of water until piping hot." },
    realityChecks: [
      { label: "Weeknight fit", note: "Turkey cooks quickly, so this suits a busy evening.", tone: "positive" },
      { label: "Cost caution", note: "Turkey mince varies by shop, so check the shelf price.", tone: "neutral" },
      { label: "Cleanup", note: "One-pan cooking keeps washing up low.", tone: "positive" }
    ]
  },
  {
    title: "No-bean beef chilli",
    description: "A quick beef chilli with tomatoes, onion, peppers and smoky spices, without beans.",
    cuisine: "Mexican-inspired",
    totalTime: 20,
    caloriesPerPortion: 430,
    costPerPortion: "\xA31.85 pp",
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: "scratch",
    ingredients: ["Beef mince", "Chopped tomatoes", "Onion", "Pepper", "Chilli powder"],
    totalIngredientsCount: 8,
    sourceUrl: "recipe-search",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "high", reason: "A tomato-based chilli reheats well.", storage: "Cool promptly and refrigerate for up to 2 days.", reheat: "Reheat until piping hot throughout." },
    realityChecks: [
      { label: "Weeknight fit", note: "A short simmer keeps this within a fast evening window.", tone: "positive" },
      { label: "Shopping friction", note: "Uses ordinary mince, tinned tomatoes and peppers.", tone: "positive" },
      { label: "Leftover friendly", note: "The sauce usually tastes better after resting.", tone: "positive" }
    ]
  },
  {
    title: "Turkey and sweetcorn chilli",
    description: "A quick turkey chilli with sweetcorn, tomatoes and mild chilli spice.",
    cuisine: "Mexican-inspired",
    totalTime: 15,
    caloriesPerPortion: 380,
    costPerPortion: "\xA31.55 pp",
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: "scratch",
    ingredients: ["Turkey mince", "Sweetcorn", "Chopped tomatoes", "Chilli powder"],
    totalIngredientsCount: 7,
    sourceUrl: "recipe-search",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "medium", reason: "The sauce helps turkey mince reheat without drying out.", storage: "Cool promptly and refrigerate for up to 2 days.", reheat: "Reheat gently with a splash of water until piping hot." },
    realityChecks: [
      { label: "Weeknight fit", note: "Turkey mince cooks quickly, so this is the fastest option.", tone: "positive" },
      { label: "Cost caution", note: "Turkey mince prices vary, but sweetcorn helps stretch it.", tone: "neutral" },
      { label: "Cleanup", note: "One-pan cooking keeps washing up low.", tone: "positive" }
    ]
  },
  {
    title: "Chicken and bean chilli",
    description: "A lighter chilli with chicken, beans, tomatoes and smoky spices.",
    cuisine: "Mexican-inspired",
    totalTime: 30,
    caloriesPerPortion: 490,
    costPerPortion: "\xA31.95 pp",
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: "scratch",
    ingredients: ["Chicken thigh", "Cannellini beans", "Chopped tomatoes", "Onion", "Smoked paprika"],
    totalIngredientsCount: 9,
    sourceUrl: "https://www.jamieoliver.com/search/?s=chicken%20chilli",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "high", reason: "The sauce and chicken reheat well.", storage: "Cool promptly and refrigerate for up to 2 days.", reheat: "Reheat until piping hot throughout." },
    realityChecks: [
      { label: "Weeknight fit", note: "A straightforward one-pan dinner with moderate simmering time.", tone: "positive" },
      { label: "Cost caution", note: "Chicken thigh is usually better value than breast.", tone: "neutral" },
      { label: "Leftover friendly", note: "Works well as a second dinner if chilled promptly.", tone: "positive" }
    ]
  },
  {
    title: "Three-bean vegetarian chilli",
    description: "A quick vegetarian chilli with mixed beans, tomatoes and warm spices.",
    cuisine: "Mexican-inspired",
    totalTime: 20,
    caloriesPerPortion: 360,
    costPerPortion: "\xA31.10 pp",
    isVegetarian: true,
    isVegan: true,
    isPescatarian: true,
    convenienceProfile: "scratch",
    ingredients: ["Mixed beans", "Chopped tomatoes", "Onion", "Smoked paprika"],
    totalIngredientsCount: 8,
    sourceUrl: "https://www.bbcgoodfood.com/search?q=three%20bean%20chilli",
    saladType: "none",
    batchCooking: { suitable: true, confidence: "high", reason: "Bean chilli keeps its texture and reheats evenly.", storage: "Cool promptly and refrigerate for up to 3 days.", reheat: "Reheat until bubbling and piping hot." },
    realityChecks: [
      { label: "Shopping friction", note: "Mostly store-cupboard tins and spices.", tone: "positive" },
      { label: "Weeknight fit", note: "Very quick once the onion is chopped.", tone: "positive" },
      { label: "Portion caution", note: "Beans are filling, especially with rice or wraps.", tone: "neutral" }
    ]
  }
];
var GeminiServiceError = class extends Error {
  constructor(category, message, details) {
    super(message);
    this.category = category;
    this.details = details;
    this.name = "GeminiServiceError";
  }
};
var aiInstance = null;
var lastApiKeyUsed = null;
function getAI() {
  const config = getApiConfig();
  let apiKey = process.env.GEMINI_API_KEY;
  if (typeof window !== "undefined" && config.mode === "direct" && config.directApiKey && isLocalhost()) {
    apiKey = config.directApiKey;
  }
  if (!apiKey) {
    console.error("[GeminiService] GEMINI_API_KEY is MISSING in environment (process.env.GEMINI_API_KEY)");
    throw new GeminiServiceError("network", "GEMINI_API_KEY is not available. Please check your setup.");
  }
  if (!aiInstance || lastApiKeyUsed !== apiKey) {
    console.log(`[GeminiService] Initializing Gemini client (Mode: ${config.mode}, Key Length: ${apiKey.length})`);
    aiInstance = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: typeof window === "undefined" ? {
        headers: {
          "User-Agent": "aistudio-build"
        }
      } : {}
    });
    lastApiKeyUsed = apiKey;
  }
  return aiInstance;
}
function parseProviderError(error) {
  let status = error?.status || error?.error?.code || 0;
  let rawMsg = error?.message || String(error);
  let isTemporary = false;
  let isPermission = false;
  if (rawMsg.includes("ApiError:")) {
    try {
      const jsonStart = rawMsg.indexOf("{");
      if (jsonStart !== -1) {
        const jsonStr = rawMsg.slice(jsonStart);
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error) {
          if (parsed.error.code) status = parsed.error.code;
          if (parsed.error.message) rawMsg = parsed.error.message;
        } else if (parsed?.code) {
          status = parsed.code;
        }
      }
    } catch (e) {
    }
  }
  const messageLower = rawMsg.toLowerCase();
  isPermission = status === 403 || messageLower.includes("permission_denied") || messageLower.includes("permission denied") || messageLower.includes("lightning dunning") || messageLower.includes("deny") && messageLower.includes("project");
  if (status === 502 || status === 503 || status === 504 || status === 429) {
    isTemporary = true;
  }
  if (messageLower.includes("bad gateway") || messageLower.includes("service unavailable") || messageLower.includes("gateway timeout") || messageLower.includes("deadline exceeded") || messageLower.includes("too many requests") || messageLower.includes("resource exhausted") || messageLower.includes("transient") || messageLower.includes("temporarily unavailable")) {
    isTemporary = true;
  }
  if (messageLower.includes("credits") && (messageLower.includes("depleted") || messageLower.includes("billing"))) {
    isTemporary = false;
  }
  if (rawMsg.includes("<!DOCTYPE html>") || rawMsg.includes("<html")) {
    const apiConfig = getApiConfig();
    const isActuallyProxy = apiConfig.mode === "proxy";
    if (isActuallyProxy) {
      rawMsg = "The search service is currently unavailable. Please try again later.";
    } else {
      rawMsg = "The search request was intercepted by a network login or proxy (HTML returned). This often happens on public Wi-Fi or behind corporate firewalls.";
    }
    isTemporary = true;
    if (status === 0) status = 502;
  }
  return {
    status,
    message: rawMsg,
    isTemporary,
    isPermission
  };
}
function serializeSchemaForRest(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const result = { ...schema };
  if (result.type) {
    if (typeof result.type === "number") {
      const typeMap = {
        1: "STRING",
        2: "NUMBER",
        3: "INTEGER",
        4: "BOOLEAN",
        5: "ARRAY",
        6: "OBJECT"
      };
      result.type = typeMap[result.type] || "STRING";
    } else if (typeof result.type === "string") {
      result.type = result.type.toUpperCase();
    }
  }
  if (result.items) {
    result.items = serializeSchemaForRest(result.items);
  }
  if (result.properties) {
    const props = {};
    for (const key in result.properties) {
      props[key] = serializeSchemaForRest(result.properties[key]);
    }
    result.properties = props;
  }
  return result;
}
async function callGeminiWithRetry(modelId, contents, config, retries = 4, delay = 1e3) {
  const apiConfig = getApiConfig();
  let activeModels = [modelId];
  if (modelId === "gemini-3.5-flash") {
    activeModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  } else if (modelId.includes("flash")) {
    activeModels = [modelId];
    if (modelId !== "gemini-3.1-flash-lite") activeModels.push("gemini-3.1-flash-lite");
    if (modelId !== "gemini-flash-latest") activeModels.push("gemini-flash-latest");
  }
  let currentModelIndex = 0;
  if (typeof window !== "undefined" && apiConfig.mode === "direct" && apiConfig.directApiKey && isLocalhost()) {
    const apiKey = apiConfig.directApiKey;
    const targetModel = modelId;
    let directModels = [targetModel];
    if (targetModel === "gemini-3.5-flash") {
      directModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    } else if (targetModel === "gemini-3.5-flash-lite") {
      directModels = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    }
    let directModelIndex = 0;
    let contentsArray = [];
    if (typeof contents === "string") {
      contentsArray = [{ role: "user", parts: [{ text: contents }] }];
    } else if (Array.isArray(contents)) {
      contentsArray = contents.map((c) => typeof c === "string" ? { role: "user", parts: [{ text: c }] } : { role: "user", ...c });
    } else {
      contentsArray = [{ role: "user", ...contents }];
    }
    const restPayload = {
      contents: contentsArray,
      systemInstruction: config.systemInstruction ? { parts: [{ text: config.systemInstruction }] } : void 0,
      generationConfig: {
        temperature: config.temperature,
        candidateCount: 1
      }
    };
    if (config.topP !== void 0) restPayload.generationConfig.topP = config.topP;
    if (config.topK !== void 0) restPayload.generationConfig.topK = config.topK;
    if (config.responseMimeType === "application/json") {
      restPayload.generationConfig.responseMimeType = "application/json";
      if (config.responseSchema) {
        restPayload.generationConfig.responseSchema = serializeSchemaForRest(config.responseSchema);
      }
    }
    if (config.googleSearch) {
      restPayload.tools = [{ google_search: {} }];
    }
    let lastError2;
    for (let i = 0; i < retries; i++) {
      try {
        let responseData = null;
        while (directModelIndex < directModels.length) {
          const currentModel = directModels[directModelIndex] || targetModel;
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
          try {
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(restPayload),
              referrerPolicy: "no-referrer"
            });
            const timestamp = (/* @__PURE__ */ new Date()).toISOString();
            const promptLength = JSON.stringify(restPayload.contents).length;
            if (!res.ok) {
              const errorBody = await res.text();
              let errData;
              try {
                errData = JSON.parse(errorBody);
              } catch (e) {
              }
              const status = res.status;
              const errorMsg = errData?.error?.message || errorBody;
              console.error(`[GeminiService Direct Log] [${timestamp}] Model: ${currentModel} | Status: ${status} | Error: ${errorMsg} | PromptLength: ${promptLength}`);
              throw { status, message: errorMsg };
            }
            console.log(`[GeminiService Direct Log] [${timestamp}] Model: ${currentModel} | Status: 200 | PromptLength: ${promptLength}`);
            const data = await res.json();
            const candidate = data.candidates?.[0];
            if (!candidate) {
              if (data.promptFeedback?.blockReason) {
                throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
              }
              throw new Error("No candidates in Gemini response");
            }
            responseData = {
              text: candidate.content?.parts?.[0]?.text || "",
              functionCalls: candidate.content?.parts?.filter((p) => p.functionCall).map((p) => p.functionCall) || null,
              groundingMetadata: candidate.groundingMetadata || null
            };
            break;
          } catch (error) {
            const parsed = parseProviderError(error);
            const isQuota = parsed.status === 429 || parsed.message.toLowerCase().includes("quota") || parsed.message.toLowerCase().includes("exhausted") || parsed.message.toLowerCase().includes("limit") || parsed.message.toLowerCase().includes("resource_exhausted");
            if (isQuota && directModelIndex < directModels.length - 1) {
              directModelIndex++;
              console.log(`[GeminiService Info] Direct model met quota limit. Trying fallback to ${directModels[directModelIndex]}...`);
              await new Promise((resolve) => setTimeout(resolve, 50));
              continue;
            }
            throw error;
          }
        }
        return responseData;
      } catch (error) {
        lastError2 = error;
        const parsed = parseProviderError(error);
        if (parsed.isTemporary && i < retries - 1) {
          console.log(`[GeminiService Info] Direct request attempt ${i + 1} returned transient status (${parsed.status}). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
          continue;
        }
        console.log(`[GeminiService Info] Direct request failed after ${i + 1} attempts`);
        throw error;
      }
    }
    throw lastError2;
  }
  const modelClient = getAI();
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      let response = null;
      while (currentModelIndex < activeModels.length) {
        const currentModel = activeModels[currentModelIndex];
        try {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const promptLength = JSON.stringify(contents).length;
          console.log(`[GeminiService SDK Log] [${timestamp}] Calling model: ${currentModel} | PromptLength: ${promptLength}`);
          const response2 = await modelClient.models.generateContent({
            model: currentModel,
            contents: [{ role: "user", parts: [{ text: typeof contents === "string" ? contents : JSON.stringify(contents) }] }],
            config: {
              systemInstruction: config?.systemInstruction,
              temperature: config?.temperature ?? 0.7,
              responseMimeType: config?.responseMimeType ?? config?.response_mime_type,
              responseSchema: config?.responseSchema ?? config?.response_schema,
              ...config?.googleSearch ? { tools: [{ googleSearch: {} }] } : {}
            }
          });
          console.log(`[GeminiService SDK Log] [${timestamp}] Model: ${currentModel} | Success`);
          return response2;
        } catch (error) {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const parsed = parseProviderError(error);
          console.error(`[GeminiService SDK Log] [${timestamp}] Model: ${currentModel} | Status: ${parsed.status} | Error: ${parsed.message}`);
          const isQuota = parsed.status === 429 || parsed.message.toLowerCase().includes("quota") || parsed.message.toLowerCase().includes("exhausted") || parsed.message.toLowerCase().includes("limit") || parsed.message.toLowerCase().includes("resource_exhausted");
          if (isQuota && currentModelIndex < activeModels.length - 1) {
            currentModelIndex++;
            console.log(`[GeminiService Info] SDK model met quota limit. Trying fallback to ${activeModels[currentModelIndex]}...`);
            await new Promise((resolve) => setTimeout(resolve, 50));
            continue;
          }
          throw error;
        }
      }
      return response;
    } catch (error) {
      lastError = error;
      const parsed = parseProviderError(error);
      if (parsed.isTemporary && i < retries - 1) {
        console.log(`[GeminiService Info] SDK attempt ${i + 1} met transient status (${parsed.status}) using model ${activeModels[currentModelIndex] || modelId}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5;
        continue;
      }
      console.log(`[GeminiService Info] SDK request permanently failed: ${error?.message || error}`);
      throw error;
    }
  }
  throw lastError;
}
var isBrowser = typeof window !== "undefined";
var estimateTokensFromText = (value) => {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
};
var withRequestTimeout = async (request, timeoutMs, label) => {
  let timeoutId;
  try {
    return await Promise.race([
      request,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};
var getGroundedSources = (response) => {
  const metadata = response?.groundingMetadata || response?.candidates?.[0]?.groundingMetadata;
  const chunks = Array.isArray(metadata?.groundingChunks) ? metadata.groundingChunks : [];
  const seen = /* @__PURE__ */ new Set();
  return chunks.flatMap((chunk) => {
    const url = canonicaliseGroundedUrl(chunk?.web?.uri || chunk?.web?.url);
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ url, title: typeof chunk?.web?.title === "string" ? chunk.web.title : void 0 }];
  });
};
var filterToGroundedSources = (items, sources) => items.filter((item) => {
  if (sources.size === 0) {
    const sourceUrl = canonicaliseGroundedUrl(item?.sourceUrl);
    if (!sourceUrl || !isApprovedDirectRecipeUrl(sourceUrl)) return false;
    item.sourceUrl = sourceUrl;
    return true;
  }
  const groundedSourceUrl = reconcileGroundedSourceUrl(item?.sourceUrl, [...sources.values()]);
  if (!groundedSourceUrl || !isDirectHttpsContentUrl(groundedSourceUrl)) return false;
  item.sourceUrl = groundedSourceUrl;
  return true;
});
var sanitizeRealityChecks = (checks) => {
  if (!Array.isArray(checks)) return [];
  const allowedTones = /* @__PURE__ */ new Set(["positive", "caution", "neutral"]);
  return checks.filter((check) => check && typeof check === "object").map((check) => ({
    label: String(check.label || "").trim().slice(0, 28),
    note: String(check.note || "").trim().slice(0, 120),
    tone: allowedTones.has(check.tone) ? check.tone : "neutral"
  })).filter((check) => check.label && check.note).slice(0, 3);
};
var replaceForbiddenDinnerCopy = (value) => value.replace(/\bmeal(s)?\b/gi, (match) => {
  const replacement = match.toLowerCase().endsWith("s") ? "dinners" : "dinner";
  return match[0] === match[0].toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
});
var sanitizeGeneratedCopy = (value, key = "") => {
  if (typeof value === "string") {
    return ["id", "sourceUrl", "tone", "saladType", "convenienceProfile"].includes(key) ? value : replaceForbiddenDinnerCopy(value);
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeGeneratedCopy(item, key));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, sanitizeGeneratedCopy(childValue, childKey)]));
};
var sanitizeRationaleMap = (value) => Object.fromEntries(
  Object.entries(value || {}).map(([title, rationale]) => [
    title,
    typeof rationale === "string" ? replaceForbiddenDinnerCopy(rationale) : String(rationale || "")
  ])
);
var SEARCH_MODEL = ACTIVE_GEMINI_MODEL;
async function getSearchAuthToken2() {
  const authModule = await Promise.resolve().then(() => (init_searchAuth(), searchAuth_exports));
  return authModule.getSearchAuthToken();
}
async function fetchProxySuggestions(searchParams, preferences, signal) {
  const controller = new AbortController();
  const externalAbortHandler = () => controller.abort(signal?.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", externalAbortHandler, { once: true });
  }
  const timeoutId = setTimeout(() => {
    const timeoutError = new GeminiServiceError("network", "Search request timed out. Please try again.");
    controller.reason = timeoutError;
    controller.abort(timeoutError);
  }, 6e4);
  try {
    const url = getApiUrl("/api/generate-suggestions");
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const token = await getSearchAuthToken2();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      },
      body: JSON.stringify({ searchParams, preferences }),
      signal: controller.signal
    });
    if (!response.ok) {
      const text = await response.text();
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", externalAbortHandler);
      let err;
      try {
        err = JSON.parse(text);
      } catch (e) {
        err = { error: { message: `Server error (${response.status}): ${text.slice(0, 100)}` } };
      }
      let errMessage = "Server error";
      let errCategory = "model";
      if (err && typeof err === "object") {
        if (err.error && typeof err.error === "object") {
          errMessage = err.error.message || "Server error";
          errCategory = err.error.category || err.category || "model";
        } else {
          errMessage = err.error || "Server error";
          errCategory = err.category || "model";
        }
      }
      throw new GeminiServiceError(errCategory, errMessage);
    }
    const payload = await response.json();
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", externalAbortHandler);
    return payload;
  } catch (error) {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", externalAbortHandler);
    if (error.name === "AbortError") {
      const reason = controller.reason || signal?.reason;
      if (reason instanceof GeminiServiceError) {
        throw reason;
      }
      console.log(`[GeminiService] Search fetch aborted`);
      throw error;
    }
    const category = error instanceof GeminiServiceError ? error.category : "network";
    const message = error instanceof GeminiServiceError ? error.message : error?.message || String(error || "Unknown transport error");
    console.log(`[Diagnostic] Gemini Fetch FAILED: ${message} (Category: ${category})`);
    if (error instanceof GeminiServiceError) throw error;
    throw new GeminiServiceError("network", `Failed to connect to API: ${message}`);
  }
}
async function fetchProxyEnrichment(title, cuisine, mode, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6e4);
  try {
    const url = getApiUrl("/api/enrich-recipe");
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildEnrichmentRequestBody(title, cuisine, mode, options)),
      signal: controller.signal
    });
    if (!response.ok) {
      const text = await response.text();
      clearTimeout(timeoutId);
      let err;
      try {
        err = JSON.parse(text);
      } catch (e) {
        err = { error: { message: `Enrichment failed (${response.status}): ${text.slice(0, 100)}` } };
      }
      let errMessage = "Enrichment failed";
      if (err && typeof err === "object") {
        if (err.error && typeof err.error === "object") {
          errMessage = err.error.message || "Enrichment failed";
        } else {
          errMessage = err.error || "Enrichment failed";
        }
      }
      throw new Error(errMessage);
    }
    const payload = await response.json();
    clearTimeout(timeoutId);
    return sanitizeGeneratedCopy(payload);
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`Failed to contact enrichment API: ${error.message}`);
  }
}
async function generateDinnerSuggestions(searchParams, preferences, signal) {
  const config = getApiConfig();
  if (isBrowser && config.mode === "proxy") {
    return fetchProxySuggestions(searchParams, preferences, signal);
  }
  const start = Date.now();
  const { query: query2, count = 3, source, excludeTitles, cuisines: targetCuisines, cuisine: legacyCuisine, isLeftoverMode, ingredientIntent, strictIngredientMatch } = searchParams;
  const isReadyMade = source === "ready-made";
  const appliedFilters = [];
  const activeDietaryRule = searchParams.dietaryRule || preferences?.dietaryRule || "none";
  const activeSaladPref = searchParams.saladPreference || preferences?.saladPreference || "all";
  const activeIsSimple = searchParams.isSimple || preferences?.isSimple || false;
  const activeIsLowCost = searchParams.isLowCost || preferences?.isLowCost || false;
  const activeNutritious = searchParams.nutritiousChoice || preferences?.nutritiousChoice || false;
  const activeHighOmega3 = searchParams.highOmega3 || preferences?.highOmega3 || false;
  const activeHighProtein = searchParams.highProtein || preferences?.highProtein || false;
  const activeMaxTime = searchParams.maxTotalTime || preferences?.readyToEatUnderMins || null;
  const activeCalorieLimit = searchParams.maxCalories || preferences?.calorieCeiling || null;
  const activeBudgetLimit = searchParams.maxCostPerPortion || preferences?.budgetLimit || null;
  const activeCookingMethods = searchParams.cookingMethods || preferences?.cookingMethods || [];
  const activeCookingMethodHints = activeCookingMethods.length > 0 ? activeCookingMethods.map((method) => {
    const aliases = COOKING_METHOD_ALIASES[method] || [];
    return aliases.length > 0 ? `${method} (also: ${aliases.join(", ")})` : method;
  }).join("; ") : "Any";
  const activeCookingFats = filterCookingFatsForDiet(
    activeDietaryRule,
    searchParams.cookingFats || preferences?.cookingFats || []
  );
  const activeReligious = [.../* @__PURE__ */ new Set([
    ...preferences?.religiousEthical || [],
    ...searchParams.religiousEthical || []
  ])];
  const hasFreeRangePreference = activeReligious.some((item) => /free[- ]range/i.test(item));
  const activeServings = searchParams.servings || preferences?.servings || 2;
  const activeSupermarkets = isReadyMade ? searchParams.supermarkets || preferences?.preferredSupermarkets || [] : [];
  const activePreferredSourceIds = searchParams.preferredSourceIds || [];
  const activeIncludeOffal = dietaryRuleAllowsOffal(activeDietaryRule) && (searchParams.includeOffal !== void 0 ? searchParams.includeOffal === true : preferences?.includeOffal === true);
  const activePreferredSourceNames = activePreferredSourceIds.length > 0 ? PREFERRED_SOURCES.filter((s) => activePreferredSourceIds.includes(s.id)).map((s) => s.label) : [];
  const hasExplicitDietOrProteinIntent = Boolean(ingredientIntent?.isIngredientLed) || /\b(vegetarian|vegan|plant[- ]based|meat[- ]free|beef|chicken|turkey|pork|lamb|fish|salmon|tuna|mackerel|prawn|shrimp|tofu)\b/i.test(query2);
  const shouldEncourageRecipeVariety = !isReadyMade && activeDietaryRule === "none" && !hasExplicitDietOrProteinIntent;
  const isBroadChilliDishSearch = /\b(chilli|chili)\b/i.test(query2) && !/\b(fresh|red|green|bird['’]?s[- ]eye|flakes?|powder|sauce|oil|pepper|peppers)\b/i.test(query2);
  if (targetCuisines && targetCuisines.length > 0) appliedFilters.push(...targetCuisines);
  else if (legacyCuisine) appliedFilters.push(legacyCuisine);
  if (activeDietaryRule && activeDietaryRule !== "none") {
    appliedFilters.push(activeDietaryRule.charAt(0).toUpperCase() + activeDietaryRule.slice(1));
  }
  if (activeSaladPref === "main-only") appliedFilters.push("Main course salads only");
  if (activeSaladPref === "side-only") appliedFilters.push("Side salads only");
  if (activeIsSimple) appliedFilters.push("Quick and easy recipes");
  if (activeIsLowCost) appliedFilters.push("Low-cost recipes");
  if (activeNutritious) appliedFilters.push("Wholesome recipes");
  if (activeHighOmega3) appliedFilters.push("High Omega-3");
  if (activeHighProtein) appliedFilters.push("High Protein");
  if (hasFreeRangePreference) appliedFilters.push("Free-range preferred where stated");
  if (activeMaxTime) appliedFilters.push(`Under ${activeMaxTime}min`);
  if (ingredientIntent?.isIngredientLed || isLeftoverMode) appliedFilters.push("Ingredient-led");
  const saladLogic = activeSaladPref === "main-only" || activeSaladPref === "side-only" ? `
SALAD RESTRICTION ACTIVE (${activeSaladPref === "main-only" ? "Main course salads only" : "Side salads only"}):
- You MUST ONLY return salads.
- A salad is defined as a dish consisting primarily of mixed pieces of foods, which can be vegetables, fruits, cheese, or cooked protein, typically served cold or at room temperature.
- If the user query is "${query2}" and it is hard to find a salad for it, you MUST adapt it (e.g., if query is "beef", return "Thai Beef Salad" or "Steak and Rocket Salad").
- DO NOT return hot stews, roasts, or traditional main courses that are not salads.` : activeSaladPref === "none" ? `
SALAD RESTRICTION ACTIVE (No salads):
- You MUST NOT return any salads.` : "";
  const simplicityLogic = activeIsSimple ? `
SIMPLICITY BIAS (Quick and easy recipes ACTIVE):
- STRICTLY limit recipes to NO MORE THAN 4 ingredients.
- Total time MUST be under 30 minutes.
- Preparation steps must be minimal.` : "";
  const mediterraneanDietLogic = activeDietaryRule === "mediterranean" ? `
MEDITERRANEAN DIET PATTERN ACTIVE:
- Favour vegetables, fruit, beans, lentils, whole grains, olive oil, herbs, nuts and seeds.
- Fish and seafood are suitable, with modest amounts of poultry, eggs and dairy where they fit the dish.
- Keep red meat, processed meat, highly processed foods and excess saturated fat secondary rather than making them the focus.
- This is a dietary pattern, not a vegetarian rule. Do not make every result vegetarian and do not require every hallmark ingredient in every recipe.` : "";
  const preferredSourcesLogic = activePreferredSourceNames.length > 0 ? `
TRUSTED SOURCES (SOFT RANKING HINT ACTIVE):
- The user has expressed a preference for these trusted UK recipe sources: ${activePreferredSourceNames.join(", ")}.
- GENTLY FAVOUR recipes that could reasonably originate from or be attributed to these sources by applying a MODEST positive weight to results from them.
- This is NOT A HARD FILTER. You MUST still prioritize the most relevant recipes for the query "${query2}".
- Highly relevant recipes from other sources SHOULD still appear above weak matches from trusted sources.
- NEVER return an empty or severely reduced result set solely because trusted sources have no good matches. If no good matches exist in trusted sources, return the best matches from all available UK sources.` : "";
  const freeRangeLogic = hasFreeRangePreference ? `
FREE-RANGE SOURCING PREFERENCE ACTIVE (SOFT):
- Prefer recipes and products whose named poultry, eggs, meat or dairy ingredients are explicitly described as free-range by the source.
- Do not treat free-range as equivalent to organic, pasture-fed, grass-fed, Halal, Kosher or any wider welfare certification.
- This is a preference, not a hard exclusion. Keep suitable results when the source does not state the production method.
- Include one reality check labelled "Free-range sourcing" for every result. Say "Source explicitly mentions free-range" only when the returned title, description or ingredient list states it; otherwise say "Free-range status is not stated by the source."` : "";
  const cookingFatLogic = activeCookingFats.length > 0 ? `
COOKING FAT PREFERENCE ACTIVE:
- Prefer recipes that use one or more of these cooking fats: ${activeCookingFats.join(", ")}.
- Where a recipe uses a generic cooking oil or fat, suggest a selected fat as a practical substitute where it remains suitable for the dish.
- Respect all dietary, allergy and religious constraints; this is a cooking preference, not a safety override.` : "";
  const budgetLogic = activeIsLowCost ? `
BUDGET BIAS (Low-cost recipes ACTIVE):
- Prioritise recipes using affordable, bulk-buy, or pantry ingredients (e.g., pulses, grains, seasonal vegetables, cheaper cuts of meat).
- Avoid luxury or imported speciality ingredients unless they are used in very small quantities.
- The total cost per portion should ideally be within the stated limit (\xA3${activeBudgetLimit || "2.00"}). If it is IMPOSSIBLE to meet the limit for the query "${query2}", you MUST still return a budgetContradiction object explaining why and provide the closest possible items.` : "";
  const omega3Logic = activeHighOmega3 ? `
HIGH OMEGA-3 BIAS (High Omega-3 recipes ACTIVE):
- STRICTLY prioritise recipes featuring ingredients rich in essential Omega-3 fatty acids (EPA/DHA or ALA) such as:
- Fresh oily fish (Salmon, Mackerel, Sardines, Herrings, Trout, Anchovies, Pilchards)
- Seeds & Nuts (Walnuts, Chia seeds, Flaxseeds, Linseeds, Pumpkin seeds)
- Green leafy vegetables (Spinach, Kale, Brussels sprouts) if relevant
- Highlight/prominently include one or more of these ingredients in each recipe suggestion.` : "";
  const remainsProteinLogic = activeHighProtein ? `
HIGH PROTEIN BIAS (High Protein recipes ACTIVE):
- Prioritize recipes with a high protein-to-calorie ratio.
- Favor main protein sources such as lean meats (chicken breast, turkey, venison), fish, eggs, and plant-based proteins (tofu, tempeh, pulses).
- Ensure the main protein component is prominent and well-defined.` : "";
  const leftoversLogic = ingredientIntent?.isIngredientLed || isLeftoverMode ? `
INGREDIENT-LED SEARCH ACTIVE:
- The user appears to be starting from ingredients they already have.
- Listed ingredients: ${(ingredientIntent?.ingredients?.length ? ingredientIntent.ingredients : parseAndNormaliseIngredients(query2)).join(", ") || query2}.
- Every recipe must use all listed ingredients as primary or key ingredients.
- Minimise extra shopping. Avoid recipes that need many additional fresh or expensive ingredients.
- If a recipe needs extra ingredients, keep them essential and ordinary UK supermarket items.
- In the description or matchReason, briefly explain how the listed ingredients are used.` : "";
  const strictIngredientLogic = ingredientIntent?.isIngredientLed ? `
INGREDIENT MATCH ACTIVE:
- Every listed ingredient must appear in every returned recipe.
- Natural forms or varieties of a listed ingredient are allowed when they remain the same ingredient category (for example pork mince or pork chops for pork, red onion for onion, and new potatoes for potato).
- ${strictIngredientMatch ? "Do not add meaningful ingredients that are not listed, such as garlic, cream or tomatoes when they were not requested." : "Extra ingredients are allowed when they are sensible for the dish."}
- ${strictIngredientMatch ? "Basic pantry items such as water, oil, salt, pepper and ordinary seasoning are allowed." : "Keep extra ingredients to a sensible minimum."}
- Do not replace an exact result with a near match. If there are no exact results, return an empty items array.` : "";
  const offalLogic = activeIncludeOffal ? "" : `
OFFAL EXCLUSION (HARD):
- Do not return recipes or ready-made products containing liver, kidney, heart, tongue, tripe, sweetbreads, blood sausage, black pudding or other offal.`;
  const recipeVarietyLogic = shouldEncourageRecipeVariety ? `
RECIPE VARIETY (NO DIETARY RULE ACTIVE):
- The user has not asked for vegetarian, vegan or meat-free recipes.
- For a dish with established meat and vegetarian versions, return a useful mix where valid: include at least one conventional meat or other animal-protein version and at least one vegetarian version when the requested count allows.
- Do not use all vegetarian results as the default for a broad dish search, and do not treat the absence of a dietary preference as a preference for vegetarian recipes.` : "";
  const chilliDishIntentLogic = isBroadChilliDishSearch ? `
CHILLI DISH INTENT:
- Treat "chilli" or "chili" here as the cooked dish, not as a request for fresh chilli peppers or chilli powder.
- Unless the user names a protein or dietary style, include at least one conventional meat or poultry chilli when the requested count allows.
- Do not let vegetarian chilli results displace all conventional versions simply because they are common or easy to generate.` : "";
  const activeExcludedTerms = [
    ...preferences?.allergies || [],
    ...preferences?.exclusions || [],
    ...searchParams.exclusions || [],
    ...searchParams.excludeIngredients || []
  ].filter(Boolean);
  const itemContainsAnyTerm = (item, terms) => {
    const searchable = [
      item.title,
      item.description,
      ...Array.isArray(item.ingredients) ? item.ingredients : []
    ].filter(Boolean).join(" ").toLowerCase();
    return terms.some((term) => {
      const cleaned = String(term).trim().toLowerCase();
      if (!cleaned) return false;
      const base = cleaned.endsWith("ies") ? `${cleaned.slice(0, -3)}y` : cleaned.endsWith("es") ? cleaned.slice(0, -2) : cleaned.endsWith("s") ? cleaned.slice(0, -1) : cleaned;
      const safeBase = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${safeBase}(s|es|ies)?\\b`, "i").test(searchable);
    });
  };
  const eligibleChilliFallbacks = BROAD_CHILLI_FALLBACKS.filter((item) => {
    const fallbackCost = parseFloat(String(item.costPerPortion).replace(/[^\d.]/g, ""));
    return (!activeMaxTime || item.totalTime <= activeMaxTime) && (!activeCalorieLimit || item.caloriesPerPortion <= activeCalorieLimit) && (!activeBudgetLimit || fallbackCost <= activeBudgetLimit) && !itemContainsAnyTerm(item, activeExcludedTerms);
  });
  const canUseChilliFallback = shouldEncourageRecipeVariety && isBroadChilliDishSearch && !isReadyMade && activeSaladPref !== "main-only" && activeSaladPref !== "side-only" && !activeIsSimple && activeCookingMethods.length === 0 && activeCookingFats.length === 0 && activeReligious.length === 0 && eligibleChilliFallbacks.length > 0;
  const groundedSources = /* @__PURE__ */ new Map();
  const rememberGroundedSources = (response) => {
    const responseSources = getGroundedSources(response);
    responseSources.forEach((source2) => groundedSources.set(source2.url, source2));
    return responseSources;
  };
  const groundedSourceMap = (sources) => new Map(
    sources.map((source2) => [source2.url, source2])
  );
  try {
    const modelClient = getAI();
    const parsedIngredients = ingredientIntent?.ingredients?.length ? ingredientIntent.ingredients : parseAndNormaliseIngredients(query2);
    const categoryMinimums = ingredientIntent?.categoryMinimums || {};
    const categoryMinimumText = Object.entries(categoryMinimums).map(([category, minimum]) => `${minimum} ${category}${minimum === 1 ? "" : "s"}`).join(", ");
    const categoryMinimumInstruction = categoryMinimumText ? `
- Category minimums: at least ${categoryMinimumText}, counting distinct matching ingredients.` : "";
    const preparationPreferences = ingredientIntent?.preparationPreferences;
    const preparationInstruction = preparationPreferences ? `
- Explicit preparation requirements: ${[
      preparationPreferences.skin === "on" ? "skin-on" : preparationPreferences.skin === "off" ? "skinless" : "",
      preparationPreferences.bone === "in" ? "bone-in" : preparationPreferences.bone === "out" ? "boneless" : "",
      preparationPreferences.fishForm || ""
    ].filter(Boolean).join(", ")}. These requirements apply to the associated meat, fish or seafood ingredient and must not be substituted.` : "";
    const parsedIngredientsInstruction = ingredientIntent?.isIngredientLed && parsedIngredients.length > 0 ? `
INGREDIENT PARSING & INTERPRETATION (CRITICAL):
- The user's query "${query2}" represents one or more listed ingredients.
- Split these on commas and the word 'and'. The independent parsed ingredients are: ${parsedIngredients.map((i) => `'${i}'`).join(", ")}.
- These ingredients have been normalised to singular names in UK English (such as tomatoes to 'tomato', red peppers to 'red pepper'), treating plurals and spelling variants as equivalent.
- You MUST interpret each parsed element as a distinct ingredient list item.
- Every returned recipe must contain ALL of these listed ingredients.${preparationInstruction}
${categoryMinimumInstruction}
- For a generic ingredient such as tomato, common substantive forms such as fresh tomato, cherry or plum tomato, chopped or tinned tomato, passata, tomato pur\xE9e or tomato paste count as that ingredient. Do not count a trace flavouring or an unrelated product name.
- For a generic protein such as pork, a normal pork cut, pork mince or pork sausage counts unless the user asked for a specific cut.
- If 'vegetable' is listed, it means at least one named vegetable in the recipe. Do not count vegetable oil, vegetable stock or vegetable broth as the vegetable requirement.
- If 'protein' is listed, it means at least one named meat, fish, seafood, egg, pulse, nut or plant-protein ingredient.
- If 'carbohydrate' is listed, it means at least one named starchy ingredient such as rice, pasta, bread, noodles, potatoes or grains.
- If no supported matches exist, return zero results rather than a near match.
${strictIngredientMatch ? "- Return the complete visible ingredient list for each recipe, not a shortened summary." : ""}
   - Keep extra ingredients to a minimum and separate obvious pantry staples from meaningful extra shopping in your reasoning.` : "";
    const systemInstruction = `You are an expert UK dinner assistant. Your goal is to generate exactly ${count} ${isReadyMade ? "UK supermarket ready-made products" : "recipe"} stubs based on the user's intent.
Target: UK audience, Metric units, UK English spelling.
Portion Basis: ONE adult portion.

INTENT PARSING (CRITICAL):
- If the query "${query2}" contains phrases like "\xA3X per portion", "under \xA3X", or "cheap", prioritize items meeting that budget even if the explicit maxCost is not set.
- If the query contains a name (e.g., "Jamie Oliver", "Delia"), assume the user wants that specific style or celebrity's recipes.
- If the query is an ingredient list (e.g., "chicken, rice"), find dishes using those.
- FOR EVERY RESULT: Use Google Search grounding to find a real UK recipe or product page.
- sourceUrl is required for every result. When Google provides a grounded page, it MUST be that page's exact recipe or product URL. If Google provides no usable grounding metadata, use only an exact direct HTTPS recipe or product page from one of these approved sources: BBC Good Food, BBC Food, Tesco Real Food, The Guardian, Mob, delicious. magazine, The Happy Foodie, Kitchen Sanctuary, Diabetes UK, Slimming World, Jamie Oliver, Waitrose, Asda, Sainsbury's Magazine, Olive Magazine, Great British Chefs, The Telegraph, The Times or Sunday Times, and Good Housekeeping. Never invent a URL, use a generic search, category or collection page, return recipe-search, or omit sourceUrl.
- Return complete JSON. Never use an ellipsis or placeholder such as "...". If no supported result exists, return an empty items array.
- FOR RECIPES (HOMEMADE): You MUST provide an ACCURATE "totalIngredientsCount". The "totalIngredientsCount" is the total number of ingredients in a standard version of this recipe (e.g. usually between 5-15). Do NOT just count the stub ingredients you return.
- FOR RECIPES (HOMEMADE): Provide an ACCURATE "totalServings" value for the standard full recipe yield. Use the recipe's usual number of adult portions, not the user's current shopping quantity.
- CONVENIENCE CLASSIFICATION (CRITICAL): Assign a 'convenienceProfile' to every recipe stub: 'scratch' for traditional scratch-cooking/baking/home recipes; 'convenience' for assembly-based dishes, ready-made products, or convenience shortcuts.
- BATCH COOKING CLASSIFICATION (RECIPES ONLY): Add a 'batchCooking' object for home-cooking recipes. Set suitable=true only when the recipe keeps well, reheats well, scales sensibly to extra portions, and is not texture-sensitive. Good candidates include soups, stews, curries, chilli, pasta sauces, tray bakes, casseroles, rice dishes and lentil dishes. Avoid labelling dressed salads, crispy/fried dishes, fresh fish/shellfish-heavy dishes, rare steak, and recipes that should be served immediately. Include a short reason plus storage/reheat notes when suitable=true.
- READY-MADE KIT (READY-MADE ONLY): Add a 'readyMadeKit' object that turns the core product into a complete dinner. Include the core product title, 1-3 optional supermarket sides, and 2-3 tiny upgrades using ordinary UK items such as herbs, yoghurt, lemon, bagged salad, frozen veg, microwave rice, naan, or slaw. Upgrades must be specific to the product and cuisine: avoid repeating generic texture ideas across unrelated products, and do not default to crispy onions or grated cheese unless they clearly suit that exact dish. Toasted breadcrumbs can suit some pasta-based products, but use them sparingly and only when they genuinely improve the item. Keep upgrades fast, cheap, and realistic for a tired weekday.
- RECIPE REALITY CHECKS (CRITICAL): Add exactly 3 "realityChecks" to every item. Each check must be practical, plain-English and specific to the item, not generic praise. Use labels such as "Hidden effort", "Shopping friction", "Weeknight fit", "Cost caution", "Leftover friendly", "Portion caution", or "Cleanup". Each check has { label, note, tone }, where tone is "positive", "caution", or "neutral". Notes must be under 110 characters and should help the user decide if this dinner is realistic tonight.
${parsedIngredientsInstruction}${strictIngredientLogic}

HARD CONSTRAINTS:
1. Dietary: ${activeDietaryRule}
2. Salad: ${activeSaladPref}
3. Allergies: ${preferences?.allergies?.join(", ") || "None"}
4. Max calories per portion: ${activeCalorieLimit || "None"} kcal
5. Max Cost: ${activeIsLowCost || activeBudgetLimit ? `\xA3${activeBudgetLimit || "2.00"}` : "None"} per portion
6. Exclusions: ${[...preferences?.exclusions || [], ...searchParams.exclusions || []].join(", ") || "None"}
7. Cuisine: ${targetCuisines?.length ? targetCuisines.join(", ") : legacyCuisine || "Any"}
8. Trusted Sources (Ranking Hint): ${activePreferredSourceNames.length > 0 ? activePreferredSourceNames.join(", ") : "Any trusted UK source"}
9. Cooking Methods: ${activeCookingMethodHints}
10. Religious/Ethical: ${activeReligious.join(", ") || "None"}
11. Preferred Supermarkets: ${activeSupermarkets.length > 0 ? activeSupermarkets.join(", ") : "Any"}
12. Cooking Fats (Preference): ${activeCookingFats.length > 0 ? activeCookingFats.join(", ") : "Any"}
13. High Omega-3 Prioritisation: ${activeHighOmega3 ? "Active (focus on oily fish, walnuts, chia, flaxseed)" : "No"}
14. High Protein Prioritisation: ${activeHighProtein ? "Active (focus on lean meats, fish, pulses, eggs)" : "No"}
15. Offal: ${activeIncludeOffal ? "Allowed" : "Excluded"}
16. Requested household servings: ${activeServings}${mediterraneanDietLogic}
${saladLogic}${simplicityLogic}${preferredSourcesLogic}${freeRangeLogic}${cookingFatLogic}${budgetLogic}${omega3Logic}${remainsProteinLogic}${leftoversLogic}${offalLogic}${recipeVarietyLogic}${chilliDishIntentLogic}
`;
    const rejectionPolicy = `Return { "items": [] } if:
- The query "${query2}" strictly violates any HARD DIETARY, RELIGIOUS, or ALLERGY constraint.
${isReadyMade ? `- ONLY commercially available UK ready-made products (branded or own-brand) from ${activeSupermarkets.length > 0 ? activeSupermarkets.join(" or ") : "any major UK supermarket, e.g., Tesco, Waitrose, Sainsbury\u2019s, Morrisons, Aldi, Asda, Lidl, Co-op, Marks & Spencer, Ocado"}. NO home recipes. Under NO circumstances return products from other supermarkets when preferred supermarkets are specified above.` : '- Home-cooking recipes only. NO "retailer" fields.'}

BUDGET POLICY:
If the budget limit is too low for the ingredient/dish requested (e.g. "Steak" under \xA32), do NOT return empty. Instead:
1. Populate the 'budgetContradiction' object with the reason.
2. Return the closest possible budget-friendly alternatives (e.g. Beef Mince or Stewing Beef for "Beef").
`;
    const finalSystemInstruction = systemInstruction + rejectionPolicy;
    const prompt = `Search intent: "${query2}".
    ${ingredientIntent?.isIngredientLed && parsedIngredients.length > 0 ? `Target Ingredients: MUST contain every specified parsed ingredient (${parsedIngredients.join(", ")}).${categoryMinimumInstruction} Minimise extra shopping and feature these ingredients prominently.` : ""}
    ${activeSaladPref === "main-only" ? "Requirement: MUST be a main-course salad." : ""}
    ${activeSaladPref === "side-only" ? "Requirement: MUST be a side salad." : ""}
    ${activeSaladPref === "none" ? "Requirement: NO salads." : ""}
    ${activeIsLowCost ? "Priority: Low budget." : ""}
    ${activeIsSimple ? "Priority: Simple/Fast (strictly no more than 4 ingredients)." : ""}
    ${activeNutritious ? "Priority: Nutritious." : ""}
    ${activeHighOmega3 ? "Priority: High Omega-3 (focus on oily fish, walnuts, chia, flaxseed)." : ""}
    ${activeHighProtein ? "Priority: High Protein (focus on lean meats, fish, pulses, eggs)." : ""}
    ${activeCookingFats.length > 0 ? `Preference: Use ${activeCookingFats.join(" or ")} for cooking where practical and suitable.` : ""}
    ${ingredientIntent?.isIngredientLed || isLeftoverMode ? `Priority: Ingredient-led search. ${strictIngredientMatch ? "Use only the listed ingredients apart from basic pantry items." : "Prioritize recipes that maximize the use of these specific items and require few extra ingredients."}` : ""}
    ${activePreferredSourceNames.length > 0 ? `Requirement: Gently favour recipes from these trusted sources: ${activePreferredSourceNames.join(", ")}.` : ""}
    ${activeMaxTime ? `Must be under ${activeMaxTime} mins.` : ""}
    ${excludeTitles?.length ? `MANDATORY EXCLUSION: Do NOT suggest any of these recipes: ${excludeTitles.join(", ")}.` : ""}
    ${shouldEncourageRecipeVariety ? "Return a varied set when the dish has both meat and vegetarian versions; do not make every result vegetarian unless the query requires it." : ""}
    Generate ${count} stubs.`;
    const config2 = {
      systemInstruction: finalSystemInstruction,
      temperature: 0.1,
      responseMimeType: "application/json",
      googleSearch: true,
      responseSchema: {
        type: import_genai.Type.OBJECT,
        properties: {
          items: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                title: { type: import_genai.Type.STRING },
                description: { type: import_genai.Type.STRING },
                cuisine: { type: import_genai.Type.STRING },
                totalTime: { type: import_genai.Type.NUMBER },
                totalServings: { type: import_genai.Type.NUMBER, description: "Standard number of adult portions made by the full recipe." },
                caloriesPerPortion: { type: import_genai.Type.NUMBER },
                costPerPortion: { type: import_genai.Type.STRING },
                isVegetarian: { type: import_genai.Type.BOOLEAN },
                isVegan: { type: import_genai.Type.BOOLEAN },
                isPescatarian: { type: import_genai.Type.BOOLEAN },
                convenienceProfile: { type: import_genai.Type.STRING, enum: ["scratch", "convenience"] },
                realityChecks: {
                  type: import_genai.Type.ARRAY,
                  items: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      label: { type: import_genai.Type.STRING },
                      note: { type: import_genai.Type.STRING },
                      tone: { type: import_genai.Type.STRING, enum: ["positive", "caution", "neutral"] }
                    },
                    required: ["label", "note", "tone"]
                  }
                },
                ingredients: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                totalIngredientsCount: { type: import_genai.Type.NUMBER, description: "Total number of ingredients in the full version of this recipe." },
                sourceUrl: {
                  type: import_genai.Type.STRING,
                  description: "Exact direct HTTPS URL of the recipe or product page, never a search, category or collection page."
                },
                ...isReadyMade ? {
                  retailer: { type: import_genai.Type.STRING },
                  isAirFryerFriendly: { type: import_genai.Type.BOOLEAN },
                  readyMadeKit: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      coreProduct: { type: import_genai.Type.STRING },
                      sides: {
                        type: import_genai.Type.ARRAY,
                        items: {
                          type: import_genai.Type.OBJECT,
                          properties: {
                            name: { type: import_genai.Type.STRING },
                            role: { type: import_genai.Type.STRING },
                            note: { type: import_genai.Type.STRING }
                          },
                          required: ["name"]
                        }
                      },
                      upgrades: {
                        type: import_genai.Type.ARRAY,
                        items: {
                          type: import_genai.Type.OBJECT,
                          properties: {
                            name: { type: import_genai.Type.STRING },
                            role: { type: import_genai.Type.STRING },
                            note: { type: import_genai.Type.STRING }
                          },
                          required: ["name"]
                        }
                      },
                      totalTimeNote: { type: import_genai.Type.STRING },
                      fitNote: { type: import_genai.Type.STRING }
                    }
                  }
                } : {
                  saladType: { type: import_genai.Type.STRING, enum: ["main", "side", "none"] },
                  batchCooking: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      suitable: { type: import_genai.Type.BOOLEAN },
                      confidence: { type: import_genai.Type.STRING, enum: ["low", "medium", "high"] },
                      reason: { type: import_genai.Type.STRING },
                      storage: { type: import_genai.Type.STRING },
                      reheat: { type: import_genai.Type.STRING }
                    },
                    required: ["suitable", "confidence"]
                  }
                }
              },
              required: ["title", "description", "cuisine", "totalTime", "ingredients", "totalIngredientsCount", "sourceUrl", "realityChecks", ...isReadyMade ? ["retailer"] : ["totalServings"]]
            }
          },
          budgetContradiction: {
            type: import_genai.Type.OBJECT,
            properties: {
              ingredient: { type: import_genai.Type.STRING },
              budgetLimit: { type: import_genai.Type.STRING },
              reason: { type: import_genai.Type.STRING },
              cheaperAlternatives: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
            }
          }
        },
        required: ["items"]
      }
    };
    const aiConfig = getApiConfig();
    console.log(`[GeminiService] Calling model ${SEARCH_MODEL} (Mode: ${aiConfig.mode}) with prompt length: ${prompt.length}...`);
    const response = await callGeminiWithRetry(SEARCH_MODEL, prompt, config2);
    const initialGroundedSources = rememberGroundedSources(response);
    const text = response.text;
    const geminiDuration = Date.now() - start;
    console.log(`[GeminiService] Response received in ${geminiDuration}ms. Text length: ${text?.length || 0}`);
    if (!text) {
      throw new GeminiServiceError("empty", "Empty response from search service.");
    }
    const data = parseModelJson(text);
    const parsedItems = Array.isArray(data.items) ? data.items : [];
    const filterIngredientLedItems = (candidateItems) => ingredientIntent?.isIngredientLed && !isReadyMade ? candidateItems.filter((item) => matchesRequestedIngredientSearch(item, query2)) : candidateItems;
    const ingredientMatchedItems = filterIngredientLedItems(parsedItems);
    let rawItems = filterToGroundedSources(ingredientMatchedItems, groundedSourceMap(initialGroundedSources));
    console.log(
      `[GeminiService] Ingredient search candidates: model=${parsedItems.length}, ingredient=${ingredientMatchedItems.length}, grounded=${rawItems.length}, sources=${groundedSources.size}`
    );
    let wasRepaired = false;
    const repairPrompts = [];
    const repairOutputs = [];
    if (ingredientIntent?.isIngredientLed && !isReadyMade && rawItems.length < count) {
      const recoveryPrompt = `Recover a recipe search for "${query2}".
Return up to ${count} complete UK home-cooking recipe stubs.
Every recipe must include all of these requested ingredients in its ingredients array: ${parsedIngredients.join(", ")}.${categoryMinimumInstruction}
Use Google Search grounding and set sourceUrl to an exact grounded recipe page URL. Search natural combinations such as "pork and tomato recipes" where useful, while keeping every listed ingredient requirement. If grounding metadata is unavailable, use only a direct recipe page from the approved sources named in the system instructions.
Return an empty items array only when no grounded page supports the request. Never use an ellipsis or placeholder.`;
      repairPrompts.push(recoveryPrompt);
      const recoveryConfig = {
        ...config2,
        systemInstruction: `${finalSystemInstruction}
RECOVERY REQUEST: Keep the response compact and valid. Include every requested ingredient explicitly in each ingredients array and use only a source URL grounded by this response.`,
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            items: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  title: { type: import_genai.Type.STRING },
                  description: { type: import_genai.Type.STRING },
                  cuisine: { type: import_genai.Type.STRING },
                  totalTime: { type: import_genai.Type.NUMBER },
                  totalServings: { type: import_genai.Type.NUMBER },
                  caloriesPerPortion: { type: import_genai.Type.NUMBER },
                  costPerPortion: { type: import_genai.Type.STRING },
                  ingredients: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                  totalIngredientsCount: { type: import_genai.Type.NUMBER },
                  saladType: { type: import_genai.Type.STRING, enum: ["main", "side", "none"] },
                  realityChecks: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        label: { type: import_genai.Type.STRING },
                        note: { type: import_genai.Type.STRING },
                        tone: { type: import_genai.Type.STRING, enum: ["positive", "caution", "neutral"] }
                      },
                      required: ["label", "note", "tone"]
                    }
                  },
                  sourceUrl: {
                    type: import_genai.Type.STRING,
                    description: "Exact direct HTTPS URL of the recipe page, never a search, category or collection page."
                  }
                },
                required: [
                  "title",
                  "description",
                  "cuisine",
                  "totalTime",
                  "totalServings",
                  "ingredients",
                  "totalIngredientsCount",
                  "realityChecks",
                  "sourceUrl"
                ]
              }
            }
          },
          required: ["items"]
        }
      };
      try {
        const recoveryResponse = await withRequestTimeout(
          callGeminiWithRetry(SEARCH_MODEL, recoveryPrompt, recoveryConfig, 1),
          12e3,
          "Ingredient search recovery"
        );
        const recoveryGroundedSources = rememberGroundedSources(recoveryResponse);
        const recoveryOutputText = recoveryResponse.text || "";
        repairOutputs.push(recoveryOutputText);
        const recoveryData = recoveryOutputText ? parseModelJson(recoveryOutputText) : {};
        const recoveryItems = filterToGroundedSources(
          filterIngredientLedItems(Array.isArray(recoveryData.items) ? recoveryData.items : []),
          groundedSourceMap(recoveryGroundedSources)
        );
        rawItems = [...rawItems, ...recoveryItems];
        wasRepaired = recoveryItems.length > 0;
      } catch (recoveryError) {
        console.warn("[GeminiService] Compact ingredient recovery failed; keeping the results already found.", recoveryError);
      }
    }
    const dedupeItems = (itemsToDedupe) => {
      const seenTitles = /* @__PURE__ */ new Set();
      return itemsToDedupe.filter((item) => {
        const titleKey = String(item.title || "").trim().toLowerCase();
        if (!titleKey || seenTitles.has(titleKey)) return false;
        seenTitles.add(titleKey);
        return true;
      });
    };
    const isClearlyVegetarian = (item) => item.isVegetarian === true || /\b(vegetarian|vegan|plant[- ]based|meat[- ]free|lentil|tofu|tempeh|chickpea)\b/i.test([
      item.title,
      item.description,
      ...Array.isArray(item.ingredients) ? item.ingredients : []
    ].filter(Boolean).join(" "));
    const isReadyMadeCandidate = (item) => {
      const source2 = String(item.sourceUrl || "").toLowerCase();
      const retailer = String(item.retailer || "").trim();
      if (!retailer) return false;
      const recipeDomains = ["bbcgoodfood.com", "jamieoliver.com", "allrecipes.com", "simplyrecipes.com", "foodnetwork.com", "epicurious.com", "tasty.co", "delish.com"];
      return !recipeDomains.some((domain) => source2.includes(domain));
    };
    const maxRepairAttempts = ingredientIntent?.isIngredientLed && !isReadyMade ? 0 : 3;
    for (let repairAttempt = 0; repairAttempt < maxRepairAttempts; repairAttempt += 1) {
      rawItems = dedupeItems(rawItems);
      const missingCount = Math.max(0, count - rawItems.length);
      const allVegetarian = shouldEncourageRecipeVariety && rawItems.length > 0 && rawItems.every(isClearlyVegetarian);
      if (missingCount === 0 && !allVegetarian) break;
      const repairCount = Math.max(1, missingCount);
      const existingTitles = [...excludeTitles || [], ...rawItems.map((item) => String(item.title || "").trim())].filter(Boolean);
      const repairPrompt2 = `Search intent: "${query2}".
Return exactly ${repairCount} additional ${isReadyMade ? "UK supermarket ready-made products" : "recipe"} stubs.
Do not repeat any existing title: ${existingTitles.join(", ") || "None"}.
${allVegetarian ? "At least one added result must be a conventional non-vegetarian version where that is a normal fit for this dish. The user has not selected a vegetarian preference." : ""}
${isReadyMade ? "Return commercially available UK ready-made products only." : "Return home-cooking recipes only."}`;
      repairPrompts.push(repairPrompt2);
      try {
        const repairConfig = {
          ...config2,
          systemInstruction: `${finalSystemInstruction}
REPAIR REQUEST: Generate exactly ${repairCount} additional results for this request. Follow the repair prompt's exclusions and variety requirement.`
        };
        const repairResponse = await callGeminiWithRetry(SEARCH_MODEL, repairPrompt2, repairConfig);
        const repairGroundedSources = rememberGroundedSources(repairResponse);
        const repairOutputText2 = repairResponse.text || "";
        repairOutputs.push(repairOutputText2);
        const repairData = repairOutputText2 ? parseModelJson(repairOutputText2) : {};
        const repairItems = filterToGroundedSources(
          filterIngredientLedItems(Array.isArray(repairData.items) ? repairData.items : []),
          groundedSourceMap(repairGroundedSources)
        );
        const nonVegetarianRepair = allVegetarian ? repairItems.find((item) => !isClearlyVegetarian(item)) : null;
        if (allVegetarian && nonVegetarianRepair) {
          rawItems = [...rawItems.slice(0, -1), nonVegetarianRepair, ...repairItems.filter((item) => item !== nonVegetarianRepair)];
        } else {
          rawItems = [...rawItems, ...repairItems];
        }
        wasRepaired = wasRepaired || repairItems.length > 0;
      } catch (repairError) {
        console.warn("[GeminiService] Result repair pass failed; keeping the results already found.", repairError);
        break;
      }
    }
    if (isReadyMade) {
      rawItems = dedupeItems(rawItems).filter(isReadyMadeCandidate);
      if (rawItems.length < count) {
        const missingCount = count - rawItems.length;
        const existingTitles = [...excludeTitles || [], ...rawItems.map((item) => String(item.title || "").trim())].filter(Boolean);
        const readyMadeRecoveryPrompt = `Broaden the ready-made product search for "${query2}".
Return exactly ${missingCount} additional distinct UK supermarket ready-made product stubs.
Keep the original named protein, dish style or other search intent where possible, but vary product formats and permitted retailers to find genuinely different options.
Do not repeat these titles: ${existingTitles.join(", ") || "None"}.
Preserve every hard dietary, allergy, ethical, budget and heating-time rule. Use Google Search grounding and provide an exact source product page URL for every result. Never use a generic search URL or a home-cooking recipe.`;
        repairPrompts.push(readyMadeRecoveryPrompt);
        try {
          const readyMadeRecoveryResponse = await callGeminiWithRetry(
            SEARCH_MODEL,
            readyMadeRecoveryPrompt,
            {
              ...config2,
              systemInstruction: `${finalSystemInstruction}
READY-MADE RECOVERY: The initial search was under-filled after source and product validation. Return only additional, distinct ready-made products that preserve the original intent and all hard constraints.`
            }
          );
          const readyMadeRecoveryGroundedSources = rememberGroundedSources(readyMadeRecoveryResponse);
          const recoveryOutputText = readyMadeRecoveryResponse.text || "";
          repairOutputs.push(recoveryOutputText);
          const recoveryData = recoveryOutputText ? parseModelJson(recoveryOutputText) : {};
          const recoveryItems = filterToGroundedSources(
            Array.isArray(recoveryData.items) ? recoveryData.items : [],
            groundedSourceMap(readyMadeRecoveryGroundedSources)
          ).filter(isReadyMadeCandidate);
          rawItems = [...rawItems, ...recoveryItems];
          wasRepaired = wasRepaired || recoveryItems.length > 0;
        } catch (recoveryError) {
          console.warn("[GeminiService] Ready-made recovery failed; keeping the products already found.", recoveryError);
        }
      }
    }
    if (canUseChilliFallback) {
      const existingTitles = new Set([
        ...excludeTitles || [],
        ...rawItems.map((item) => String(item.title || "").trim())
      ].filter(Boolean).map((title) => title.toLowerCase()));
      const fallbackItems = filterToGroundedSources(
        eligibleChilliFallbacks.filter((item) => !existingTitles.has(item.title.toLowerCase())),
        groundedSources
      );
      const allVegetarian = rawItems.length > 0 && rawItems.every(isClearlyVegetarian);
      if (allVegetarian && rawItems.length >= count && fallbackItems.length > 0) {
        rawItems = [...rawItems.slice(0, count - 1), fallbackItems[0]];
        wasRepaired = true;
      } else if (rawItems.length < count) {
        rawItems = [...rawItems, ...fallbackItems.slice(0, count - rawItems.length)];
        wasRepaired = wasRepaired || fallbackItems.length > 0;
      }
    }
    rawItems = dedupeItems(rawItems).slice(0, count);
    const repairPrompt = repairPrompts.join("\n");
    const repairOutputText = repairOutputs.join("\n");
    let items = rawItems.map((item) => {
      const sanitizedItem = sanitizeGeneratedCopy(item);
      const realityChecks = sanitizeRealityChecks(sanitizedItem.realityChecks);
      if (hasFreeRangePreference) {
        const fields = [
          sanitizedItem.title || "",
          sanitizedItem.description || "",
          ...Array.isArray(sanitizedItem.ingredients) ? sanitizedItem.ingredients : []
        ].join(" ");
        const explicitlyConfirmed = /\bfree[- ]range(?:d)?\b/i.test(fields);
        return {
          ...sanitizedItem,
          realityChecks: [
            ...realityChecks.filter((check) => check.label.toLowerCase() !== "free-range sourcing").slice(0, 2),
            {
              label: "Free-range sourcing",
              note: explicitlyConfirmed ? "Source explicitly mentions free-range." : "Free-range status is not stated by the source.",
              tone: explicitlyConfirmed ? "positive" : "neutral"
            }
          ],
          id: item.id || `dbd-${Math.random().toString(36).substring(2, 9)}`,
          dietFlagsVerified: true
        };
      }
      return {
        ...sanitizedItem,
        realityChecks,
        id: item.id || `dbd-${Math.random().toString(36).substring(2, 9)}`,
        dietFlagsVerified: true
      };
    });
    if (isReadyMade) {
      items = items.filter(isReadyMadeCandidate);
    }
    const finalResult = {
      appliedFilters,
      items,
      isEmpty: items.length === 0 && !data.budgetContradiction,
      budgetContradiction: data.budgetContradiction,
      isCurated: false,
      diagnostics: {
        repaired: wasRepaired,
        groundedSourceCount: groundedSources.size,
        timings: { geminiCall: geminiDuration, totalRoundTrip: Date.now() - start },
        usage: {
          model: SEARCH_MODEL,
          inputChars: finalSystemInstruction.length + prompt.length + (repairPrompt ? finalSystemInstruction.length + repairPrompt.length : 0),
          outputChars: text.length + repairOutputText.length,
          inputTokensEstimate: estimateTokensFromText(finalSystemInstruction + prompt + (repairPrompt ? finalSystemInstruction + repairPrompt : "")),
          outputTokensEstimate: estimateTokensFromText(text + repairOutputText)
        },
        fromCache: false
      }
    };
    if (isReadyMade) {
      finalResult.readyMeals = items;
    } else {
      finalResult.recipes = items;
    }
    return finalResult;
  } catch (error) {
    if (isBrowser && config.mode === "direct") {
      console.warn("[GeminiService] Client-side Direct API call failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        return await fetchProxySuggestions(searchParams, preferences, signal);
      } catch (fallbackError) {
        console.error("[GeminiService] Cloud Proxy fallback failed too:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("[GeminiService] Search failed:", error);
    const parsed = parseProviderError(error);
    let category = "model";
    if (parsed.isPermission) {
      category = "permission";
    } else if (parsed.status === 429 || parsed.message.toLowerCase().includes("quota") || parsed.message.toLowerCase().includes("resource exhausted")) {
      category = "quota";
    } else if (parsed.isTemporary) {
      category = "network";
    } else if (parsed.message.includes("API_KEY")) {
      category = "network";
    }
    throw new GeminiServiceError(category, parsed.isPermission ? SEARCH_PERMISSION_MESSAGE : parsed.message);
  }
}
async function enrichRecipe(title, cuisine, mode, options) {
  const config = getApiConfig();
  if (isBrowser && config.mode === "proxy") {
    return fetchProxyEnrichment(title, cuisine, mode, options);
  }
  try {
    const modelClient = getAI();
    const strictIntent = options?.strictIngredientMatch && mode === "cook" && options.query ? detectIngredientIntent(options.query) : null;
    const strictIngredients = strictIntent?.isIngredientLed ? strictIntent.ingredients : [];
    const strictDetailLogic = strictIngredients.length > 0 ? `
STRICT INGREDIENT DETAIL CHECK (HARD):
- The search only allows these ingredients: ${strictIngredients.join(", ")}.
- Every ingredient in the complete recipe must be one of those listed ingredients or a basic pantry item such as water, oil, salt, pepper or ordinary seasoning.
- Do not add rice, potatoes, breadcrumbs, flour, butter, cream, stock, herbs, lemon or any other ingredient unless it is listed or is a permitted pantry item.
- Include the complete ingredient list in the response. The response will be rejected if any unlisted ingredient appears.
` : "";
    const systemInstruction = `You are a professional UK culinary content generator.
Convert the provided title and cuisine into a complete, high-quality UK ${mode === "ready-made" ? "supermarket product detail" : "recipe"}.
Units: Metric only.
Spelling: UK English only.

ORIGINALITY:
- Instructions MUST be original, distinctive, and synthesized.
- NO verbatim copying from external sites.

REQUISITES:
${mode === "cook" ? '- Ingredients MUST include specific quantities/units (e.g. "200g", "1 tsp").' : "- Must be a real commercial UK ready-made product. Instructions reflect heating (oven/microwave/air-fryer)."}
- READY-MADE KIT: For ready-made mode, add a 'readyMadeKit' object with the core product, 1-3 optional supermarket sides, and 2-3 tiny upgrades using ordinary UK items. Upgrades must be product-specific and cuisine-aware; avoid repeated generic texture ideas, especially crispy onions or grated cheese, unless they genuinely fit the product. Toasted breadcrumbs can suit some pasta-based products, but use them sparingly and only when they genuinely improve the item.
- DESCRIPTION: Synthesize the best aspects in a professional tone.
- SOURCE URL: Use Google Search grounding to provide an exact real source page for this recipe. Never invent a URL or use a generic search URL. ${options?.sourceUrl ? `Preserve this existing grounded source URL exactly: ${options.sourceUrl}` : "If no grounded source page supports the recipe, omit the source URL."}
- TOTAL INGREDIENTS COUNT: Provide an accurate total count of all ingredients required.
- STANDARD SERVINGS: Provide the standard number of adult portions made by the full recipe as totalServings. Do not use the user's current shopping quantity for this field.
${strictDetailLogic}
`;
    const config2 = {
      systemInstruction,
      temperature: 0.1,
      responseMimeType: "application/json",
      googleSearch: true,
      responseSchema: {
        type: import_genai.Type.OBJECT,
        properties: {
          instructions: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
          ingredients: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
          description: { type: import_genai.Type.STRING },
          totalServings: { type: import_genai.Type.NUMBER, description: "Standard number of adult portions made by the full recipe." },
          totalIngredientsCount: { type: import_genai.Type.NUMBER },
          costPerPortion: { type: import_genai.Type.STRING },
          caloriesPerPortion: { type: import_genai.Type.NUMBER },
          totalTime: { type: import_genai.Type.NUMBER },
          sourceUrl: { type: import_genai.Type.STRING },
          ...mode === "ready-made" ? {
            retailer: { type: import_genai.Type.STRING },
            servingSuggestion: { type: import_genai.Type.STRING },
            isAirFryerFriendly: { type: import_genai.Type.BOOLEAN },
            readyMadeKit: {
              type: import_genai.Type.OBJECT,
              properties: {
                coreProduct: { type: import_genai.Type.STRING },
                sides: {
                  type: import_genai.Type.ARRAY,
                  items: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      name: { type: import_genai.Type.STRING },
                      role: { type: import_genai.Type.STRING },
                      note: { type: import_genai.Type.STRING }
                    },
                    required: ["name"]
                  }
                },
                upgrades: {
                  type: import_genai.Type.ARRAY,
                  items: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      name: { type: import_genai.Type.STRING },
                      role: { type: import_genai.Type.STRING },
                      note: { type: import_genai.Type.STRING }
                    },
                    required: ["name"]
                  }
                },
                totalTimeNote: { type: import_genai.Type.STRING },
                fitNote: { type: import_genai.Type.STRING }
              }
            }
          } : {}
        },
        required: ["instructions", "ingredients", "description", "totalIngredientsCount", ...mode === "ready-made" ? ["retailer"] : ["totalServings"]]
      }
    };
    let lastStrictMismatch = false;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const prompt = `Full detail for: "${title}" (${cuisine}). mode: ${mode}.
${options?.sourceUrl ? `Existing source URL: ${options.sourceUrl}` : ""}
${strictIngredients.length > 0 ? `This is strict search attempt ${attempt + 1}. The only allowed non-pantry ingredients are: ${strictIngredients.join(", ")}. Review every ingredient before returning the response.` : ""}`;
      const response = await callGeminiWithRetry(ENRICHMENT_GEMINI_MODEL, prompt, config2);
      const text = response.text;
      if (!text) {
        throw new Error("Empty enrichment response");
      }
      const parsed = parseModelJson(text);
      const groundedSources = getGroundedSources(response);
      const existingSourceUrl = canonicaliseGroundedUrl(options?.sourceUrl);
      const returnedSourceUrl = reconcileGroundedSourceUrl(parsed.sourceUrl, groundedSources);
      if (existingSourceUrl) {
        parsed.sourceUrl = existingSourceUrl;
      } else if (returnedSourceUrl) {
        parsed.sourceUrl = returnedSourceUrl;
      } else {
        delete parsed.sourceUrl;
      }
      if (!strictIngredients.length || matchesStrictIngredientSearch(parsed, options?.query || "")) {
        return sanitizeGeneratedCopy(parsed);
      }
      lastStrictMismatch = true;
    }
    if (lastStrictMismatch) {
      throw new Error("Recipe details did not pass the strict ingredient check.");
    }
    throw new Error("Empty enrichment response");
  } catch (error) {
    if (isBrowser && config.mode === "direct") {
      console.warn("[GeminiService] Client-side Direct Enrichment failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        return await fetchProxyEnrichment(title, cuisine, mode, options);
      } catch (fallbackError) {
        console.error("[GeminiService] Cloud Proxy Enrichment fallback failed too:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("[GeminiService] Enrichment failed:", error);
    const parsed = parseProviderError(error);
    throw new GeminiServiceError(parsed.isTemporary ? "network" : "model", parsed.message);
  }
}
async function generateMatchRationales(items, searchParams, preferences) {
  if (!items.length) return {};
  const config = getApiConfig();
  if (isBrowser && config.mode === "proxy") {
    try {
      const url = getApiUrl("/api/generate-rationales");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, searchParams, preferences })
      });
      if (!response.ok) return {};
      return response.json().then(sanitizeRationaleMap);
    } catch (err) {
      console.error("[GeminiService] Client failed to fetch rationales:", err);
      return {};
    }
  }
  try {
    const modelClient = getAI();
    const itemSummaries = items.map((item) => ({
      title: item.title,
      cuisine: item.cuisine,
      description: item.description,
      price: item.costPerPortion
    }));
    const responseSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        rationales: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING },
              matchReason: { type: import_genai.Type.STRING }
            },
            required: ["title", "matchReason"]
          }
        }
      },
      required: ["rationales"]
    };
    const systemInstruction = `You are a match rationale generator for a dinner planning app.
Provide objective, non-obvious explanations for why these specific items were suggested.
NO subjective adjectives (tasty, delicious, premium).
Return a short, plain-language reason only. Do not begin with or include "matches the query", "match:", or similar meta wording.
Context: Query: "${searchParams.query}", Diet: ${preferences?.dietaryRule || "None"}

Items: ${JSON.stringify(itemSummaries)}`;
    const response = await callGeminiWithRetry(
      ENRICHMENT_GEMINI_MODEL,
      systemInstruction,
      {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema
      }
    );
    const text = response.text || "{}";
    const data = parseModelJson(text);
    const rationalesMap = {};
    if (data.rationales && Array.isArray(data.rationales)) {
      data.rationales.forEach((r) => {
        if (r.title && r.matchReason) {
          rationalesMap[r.title.toLowerCase().trim()] = r.matchReason;
        }
      });
    }
    return sanitizeRationaleMap(rationalesMap);
  } catch (error) {
    if (isBrowser && config.mode === "direct") {
      console.warn("[GeminiService] Client-side Direct Rationale failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        const url = getApiUrl("/api/generate-rationales");
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, searchParams, preferences })
        });
        if (response.ok) return response.json().then(sanitizeRationaleMap);
      } catch (fallbackError) {
        console.error("[GeminiService] Cloud Proxy Rationale fallback failed:", fallbackError);
      }
    }
    console.error("[GeminiService] Failed to generate match rationales:", error);
    return {};
  }
}

// src/lib/resend.ts
var import_resend = require("resend");
var resendClient = null;
function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required for email delivery. Please configure it in your Settings or .env file.");
    }
    resendClient = new import_resend.Resend(apiKey);
  }
  return resendClient;
}
function translateResendError(error) {
  if (!error) {
    return new Error("The email delivery service is experiencing a temporary issue. Please try again later or copy the details directly.");
  }
  const errMsg = (error.message || "").toLowerCase();
  const errName = (error.name || "").toLowerCase();
  const errCode = (error.code || "").toLowerCase();
  const isValidationError = errName.includes("validation") || errName.includes("verify") || errName.includes("restriction") || errCode.includes("restriction") || errCode.includes("validation") || errMsg.includes("verify") || errMsg.includes("restriction") || errMsg.includes("not verified") || errMsg.includes("unauthorized") || errMsg.includes("onboarding") || errMsg.includes("registered") || errMsg.includes("sandbox") || errMsg.includes("domain not verified");
  if (isValidationError) {
    const e2 = new Error("This email is currently restricted to verified recipients. Please copy the details manually if you cannot verify this address in your email provider settings.");
    e2.code = "EMAIL_DELIVERY_FAILURE";
    e2.status = 403;
    e2.name = "validation_error";
    return e2;
  }
  const isAuthError = errName.includes("auth") || errName.includes("invalid_api") || errMsg.includes("api key") || errMsg.includes("unauthorized") || errMsg.includes("forbidden") || errMsg.includes("api_key");
  if (isAuthError) {
    const e2 = new Error("Our email service is currently offline. Please configure your API key in the settings panel.");
    e2.code = "EMAIL_AUTH_FAILURE";
    e2.status = 401;
    return e2;
  }
  const e = new Error("The email delivery service is experiencing a temporary issue. Please try again later or copy the details directly.");
  e.code = "EMAIL_GENERAL_FAILURE";
  return e;
}
function resolveFromAddress(requestedFrom) {
  const envFrom = process.env.RESEND_FROM_EMAIL;
  let displayName = "";
  const match = requestedFrom.match(/^(.*?)\s*<.*?>/);
  if (match && match[1]) {
    displayName = match[1].trim();
  } else if (!requestedFrom.includes("<") && !requestedFrom.includes("@")) {
    displayName = requestedFrom.trim();
  }
  if (!envFrom) {
    if (displayName) {
      return `${displayName} <onboarding@resend.dev>`;
    }
    return "DinnerByDesign <onboarding@resend.dev>";
  }
  if (envFrom.includes("<")) {
    return envFrom;
  }
  if (displayName) {
    return `${displayName} <${envFrom}>`;
  }
  return envFrom;
}
async function sendEmail({
  to,
  subject,
  html,
  from = "DinnerByDesign <terence@dinnerbydesign.app>",
  replyTo
}) {
  const resend = getResendClient();
  const resolvedFrom = resolveFromAddress(from);
  try {
    console.log(`[Resend] Attempting standard email send to: ${to}, subject: ${subject}, from: ${resolvedFrom}`);
    const { data, error } = await resend.emails.send({
      from: resolvedFrom,
      to,
      subject,
      html,
      replyTo
    });
    if (!error) {
      console.log(`[Resend] Email successfully sent from standard sender: ${from}`);
      return data;
    }
    console.log("[Resend] Standard send returned fallback-eligible status:", JSON.stringify(error, null, 2));
    const errorMessage = error.message?.toLowerCase() || "";
    const errorCode = error.code?.toLowerCase() || "";
    const isValidationError = error.name === "validation_error" || error.name === "RESEND_RESTRICTION" || error.name === "restriction_error" || errorCode.includes("validation") || errorCode.includes("restriction") || errorMessage.includes("verify") || errorMessage.includes("restriction") || errorMessage.includes("not verified") || errorMessage.includes("unauthorized") || errorMessage.includes("sandbox") || errorMessage.includes("registered");
    if (isValidationError && resolvedFrom !== "DinnerByDesign <onboarding@resend.dev>" && resolvedFrom !== "onboarding@resend.dev") {
      console.log("[Resend] Domain verification/validation issue detected. Retrying with onboarding@resend.dev...");
      const fallbackFrom = "DinnerByDesign <onboarding@resend.dev>";
      const retryResult = await resend.emails.send({
        from: fallbackFrom,
        to,
        subject,
        html,
        replyTo
      });
      if (retryResult.error) {
        console.log("[Resend] Fallback retry also returned status:", JSON.stringify(retryResult.error, null, 2));
        throw translateResendError(retryResult.error);
      }
      console.log("[Resend] Email successfully sent using fallback sender onboarding@resend.dev!");
      return retryResult.data;
    }
    throw translateResendError(error);
  } catch (err) {
    const isSandboxError = err.message?.toLowerCase().includes("restricted") || err.name === "RESEND_RESTRICTION" || err.name === "validation_error";
    if (isSandboxError) {
      console.log("[Resend Sandbox Notice]:", err.message);
    } else {
      console.warn("[Resend Handled Exception]:", err.message || err);
    }
    const errorMsg = err.message || "";
    if (errorMsg.includes("could not be delivered") || errorMsg.includes("currently offline") || errorMsg.includes("experiencing a temporary issue")) {
      throw err;
    }
    if (resolvedFrom !== "DinnerByDesign <onboarding@resend.dev>" && resolvedFrom !== "onboarding@resend.dev") {
      try {
        console.log("[Resend] Attempting retry from onboarding@resend.dev inside catch clause...");
        const fallbackFrom = "DinnerByDesign <onboarding@resend.dev>";
        const retryResult = await resend.emails.send({
          from: fallbackFrom,
          to,
          subject,
          html,
          replyTo
        });
        if (retryResult.error) {
          throw retryResult.error;
        }
        console.log("[Resend] Email successfully sent using fallback sender in catch clause!");
        return retryResult.data;
      } catch (retryErr) {
        console.log("[Resend] Catch block fallback retry returned status:", retryErr.message || retryErr);
        throw translateResendError(retryErr);
      }
    }
    throw translateResendError(err);
  }
}

// src/lib/emailDelivery.ts
function getSimulatedEmailResult() {
  return {
    ok: false,
    delivered: false,
    simulated: true,
    error: {
      code: "EMAIL_NOT_DELIVERED",
      message: "The email provider did not confirm delivery."
    }
  };
}

// src/content/programmaticDisclosures.ts
var FIVE_DINNERS_PRICE_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "About these estimates",
    body: "Costs cover ten portions and use representative UK reference packs with prices checked 18 July 2026. Retailer prices, pack sizes, promotions, availability and ingredients already at home vary. The expected checkout uses complete packs; the ingredient total uses the estimated quantities consumed. Cooking energy is excluded."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "This plan provides five dinners for two people. Appetite, portion size and any additional sides may change the quantity required."
  }
];
var UK_FOOD_COST_CONTEXT_DISCLOSURES = [
  {
    key: "source_timing",
    title: "How to read these figures",
    body: "National trackers use different baskets, weightings and collection dates, so their figures are not directly interchangeable and cannot predict one household\u2019s shopping total. Figures were checked when this guide was reviewed on 19 July 2026; follow the cited sources for later releases."
  }
];
var COOKING_FOR_ONE_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "About these estimates",
    body: "Aldi UK online prices were checked 27 July 2026. The \xA330.36 checkout estimate uses complete packs and ignores temporary promotional reductions. The \xA314.49 ingredient value uses the estimated quantities consumed across ten servings. Cooking oil, salt, pepper and cooking energy are excluded."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Four published recipes provide ten servings: five scheduled dinners, three next-day lunches and two future freezer portions. Appetite and portion needs vary."
  },
  {
    key: "source_timing",
    title: "Prices and availability",
    body: "Prices, pack sizes and stock can vary by Aldi store and may change after the check date. Check the current product and price before shopping."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Pasta, noodles, breadcrumbs, yogurt, stock cubes, soy sauce and other packaged ingredients vary by product and may contain allergens. Check every label before use."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and safety",
    body: "Follow each product label and the original publisher\u2019s cooking method. Cool leftovers and refrigerate or freeze them within two hours. Reheat only once until steaming hot throughout. Defrost frozen portions in the fridge and use within 24 hours."
  }
];
var OFFAL_PRICE_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "How to read this price snapshot",
    body: "The figures compare listed shelf prices per kilogram checked 20 July 2026. They do not compare complete-pack checkout cost, edible yield or the total cost of a finished dinner. Prices, ranges and availability change."
  },
  {
    key: "source_timing",
    title: "Price and guidance review",
    body: "Retailer prices and official guidance were checked on 20 July 2026. Follow the cited retailer, Food Standards Agency and NHS links for current information."
  }
];
var OFFAL_SAFETY_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking safety",
    body: "Cook liver, kidney and other offal thoroughly until steaming hot throughout. Follow product storage instructions, use-by dates and current Food Standards Agency guidance."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Worcestershire sauce commonly contains fish, mustard is an allergen, ale usually contains gluten, and sherry may contain sulphites. Stock and prepared sauces vary by product, so check every label."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Quantities are not fixed in this guide. Adjust them to your appetite and to the dinner you are building around them."
  }
];
var PORTION_PLANNING_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Portion sizes in this guide are illustrative. Adjust quantities to suit your household, appetite and what else is being served."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking safety",
    body: "Freeze suitable surplus promptly and follow product labels. When reheating leftovers, reheat them only once and until steaming hot throughout. Follow current Food Standards Agency guidance."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Ingredients and allergens vary between packaged products, including curry pastes, harissa, sauces and cheese. Check individual labels."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety guidance was reviewed on 20 July 2026. Follow the cited Food Standards Agency links for later updates."
  }
];
var MEDITERRANEAN_STORAGE_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Cool cooked rice quickly, ideally within an hour, refrigerate it for no more than one day before reheating, and reheat it only once. If it will not be used that quickly, freeze planned portions promptly."
  }
];
var MEDITERRANEAN_PRODUCT_DISCLOSURES = [
  {
    key: "allergen_and_product",
    title: "Allergens and product labels",
    body: "Pasta and bulgur wheat contain gluten; anchovies contain fish; feta, Parmesan, Pecorino and yogurt contain milk. Almonds are a regulated nut allergen. Pine nuts can also cause allergic reactions, although they are not one of the UK's 14 regulated allergens. Chorizo, wine and packaged products vary, so check every label."
  }
];
var MEDITERRANEAN_SOURCE_DISCLOSURES = [
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Cultural references, food-safety guidance and allergen guidance were reviewed on 20 July 2026. Follow the cited sources for later updates."
  }
];
var SUMMER_STEWS_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow current Food Standards Agency guidance on cooling, refrigerating and reheating cooked dishes. Cook chicken thoroughly until steaming hot throughout, with no pink meat remaining."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Bread usually contains gluten. Stock, broth and other packaged ingredients vary by product and may contain allergens, so check every label."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety guidance was reviewed on 20 July 2026. Follow the cited Food Standards Agency guidance for later updates."
  }
];
var FRESH_OR_FROZEN_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow the product date and its storage, defrosting and cooking instructions. Frozen vegetables should be cooked thoroughly according to the packet instructions."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "NHS and Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates."
  }
];
var BATCH_COOKING_DISCLOSURES = [
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Standard pasta, tortillas and flatbreads commonly contain wheat. Products and alternative versions vary, so check labels for allergens and dietary suitability."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow current Food Standards Agency guidance on cooling, refrigerating, freezing and reheating cooked food, including the specific guidance on cooked rice."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates."
  }
];
var FAMILY_FUSSY_EATERS_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "The five-use example is a planning estimate, not a tested recipe yield. Adjust the quantity and portion size for your household, appetite and the amount of base used in each dinner."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and safety",
    body: "Cool cooked food promptly, refrigerate or freeze it within two hours, eat refrigerated leftovers within 48 hours, thaw frozen portions in the fridge and reheat only once until steaming hot throughout. Follow product labels and current Food Standards Agency guidance."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Stock cubes, sauces, pasta, wraps, bread, cheese and other packaged ingredients vary by product. Check every label, including when choosing a vegetarian substitute or a different brand."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety and child-feeding guidance was checked on 13 August 2026. Follow the cited sources for later updates and seek professional advice for a significant feeding, swallowing or allergy concern."
  }
];
var GROCERY_COST_OPTIONS_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "A note on cost",
    body: "Grocery costs vary with household needs, products, retailers, pack sizes and location. These techniques can improve planning and ingredient use, but none of them guarantees a specific saving."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and product labels",
    body: "Check product labels for allergens, storage instructions and suitability."
  },
  {
    key: "storage_and_cooking",
    title: "Food safety",
    body: "Follow current Food Standards Agency guidance when cooling, storing, freezing or reheating food."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates."
  }
];
var GROCERY_COST_PREDICTION_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "How to read cost estimates",
    body: "Prices and availability vary by retailer, location, product and date. Estimates are not guaranteed checkout totals, and complete-pack cost may exceed the value of the ingredients used. Promotional and loyalty prices may also have eligibility conditions."
  },
  {
    key: "storage_and_cooking",
    title: "Storage note",
    body: "Follow current Food Standards Agency guidance when chilling, freezing, defrosting or reheating food."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited source for later updates."
  }
];
var CHEAPER_MEAT_CUTS_COST_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "How to use this guide",
    body: "This guide does not rank cuts or use live retailer prices. Prices, pack sizes and availability vary, and a lower pack or kilogram price does not automatically mean a lower cost per serving once bone, trimming and cooking time are considered."
  }
];
var CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES = [
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Marinades, spice blends, stock products and prepared sauces vary by brand and can contain allergens, so check every product label before use."
  }
];
var CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow product cooking and storage instructions. Make sure chicken and turkey are steaming hot throughout, with no pink meat remaining and juices running clear. Follow current Food Standards Agency guidance when cooling, refrigerating, freezing, defrosting and reheating cooked meat."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food Standards Agency cooking and storage guidance was reviewed on 22 July 2026. Follow the cited sources for later updates."
  }
];
var SHARED_INGREDIENTS_PLANNING_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "The five dinner descriptions assume two adults. Adjust quantities for your household and compare the available pack sizes before buying."
  },
  {
    key: "price_comparison",
    title: "A note on cost",
    body: "Using shared ingredients can reduce part-used packs, but it does not guarantee a lower checkout total. Pack sizes, current prices, cupboard ingredients and how much the household uses all affect the outcome."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and product labels",
    body: "Check labels on tinned products, seasonings and any substitutions for allergens, storage instructions and suitability."
  }
];
var SHARED_INGREDIENTS_SAFETY_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow the chicken packaging and current Food Standards Agency guidance. Keep raw chicken separate, cook it thoroughly, cool and refrigerate leftovers promptly, and reheat them only once until steaming hot throughout."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food Standards Agency cooking, chilling, freezing and defrosting guidance was reviewed on 23 July 2026. Follow the cited sources for later updates."
  }
];
var FIVE_A_DAY_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Portion calculation",
    body: "The NHS adult reference is 80g for one portion of ordinary fresh, frozen or tinned fruit and vegetables. Children need different amounts, and pur\xE9es, dried produce, juice, beans and pulses follow separate rules. The worked calculation is illustrative rather than a result from a specific DinnerByDesign recipe."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "NHS and British Heart Foundation guidance was reviewed on 24 July 2026. Follow the cited sources for later updates."
  }
];
var LOW_COST_DINNERS_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "A note on cost",
    body: "These techniques can help make a small set of ingredients feel more varied, but they do not guarantee a lower shopping total. Current prices, pack sizes, what is already at home and what goes unused all affect the result."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and product labels",
    body: "Soy sauce, miso, hard cheese, yoghurt, nuts, seeds, stock and ready-made seasonings can contain common allergens or substantial salt. Check every label for the people eating the dinner and use a suitable alternative where needed."
  }
];
var HOME_COOKED_READY_MADE_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Pack size and portions",
    body: "A manufacturer-defined serving is predictable, but it is not a personalised recommendation. Appetite, age, activity and any individual dietary advice may change what is suitable."
  },
  {
    key: "price_comparison",
    title: "How to read the cost comparison",
    body: "The cited UK study compared cost per 100g and did not include cooking energy or the value of household time. Pack sizes, ingredient reuse, equipment and what goes unused can change the answer for an individual household."
  },
  {
    key: "allergen_and_product",
    title: "Product labels",
    body: "Check the complete nutrition panel, ingredient list, allergens and serving information. A front-of-pack claim such as high protein or under 500 calories describes one feature rather than the quality or suitability of the whole dish."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and reheating",
    body: "Follow use-by dates, storage directions and preparation instructions on the pack. For leftovers, follow current Food Standards Agency guidance and reheat only once until steaming hot throughout."
  },
  {
    key: "source_timing",
    title: "Evidence review",
    body: "The research and official guidance were reviewed on 24 July 2026. Product formulations and labelling guidance can change, so check the cited sources and the current pack."
  }
];
var PULSES_COST_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "About these estimates",
    body: "Ingredient and energy figures are illustrative estimates based on products and energy rates checked 25 July 2026. Actual cost depends on the product, tariff, appliance, pan and cooking method."
  },
  {
    key: "price_comparison",
    title: "How to use the comparison",
    body: "Compare cooked or drained quantities rather than shelf prices alone. Promotions, loyalty prices, pack sizes and availability change, so check the current unit price before buying."
  },
  {
    key: "source_timing",
    title: "Price and guidance review",
    body: "Product prices, Ofgem rates and official guidance were checked 25 July 2026. Follow the cited sources for later information."
  }
];
var PULSES_SAFETY_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow the packet instructions for soaking and cooking dried pulses. Dried red kidney beans need particular care. Refrigerate cooked food promptly and follow the cited Food Standards Agency guidance."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Stock, miso, hard cheese, yoghurt, sauces and flavoured pulse products vary by brand and may contain allergens. Check every label."
  }
];
var TRAYBAKE_SAFETY_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Cooking safely",
    body: "Cooking time varies by ingredient size, cut and oven. Follow product instructions and use the Food Standards Agency checks described in this guide, particularly for chicken and fish."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Harissa, curry paste, stock, yoghurt and cheese vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety guidance was reviewed 25 July 2026. Follow the cited Food Standards Agency page for later updates."
  }
];
var SAUSAGE_GUIDE_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "How to read the price example",
    body: "The two Tesco products show how pack size and range can change the shelf price and unit price. They are examples, not a ranking of quality or value. Prices and availability vary."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow the pack instructions and use-by date. Cook sausages thoroughly, keep raw and cooked products separate, refrigerate leftovers promptly and follow the rice guidance in this article."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Sausages, stock, mustard, bread, yoghurt and prepared sauces vary by product and may contain allergens. Check every label, including vegetarian alternatives."
  },
  {
    key: "source_timing",
    title: "Price and guidance review",
    body: "Product prices and official food-safety guidance were checked 25 July 2026. Follow the cited product pages and official guidance for later information."
  }
];
var FIVE_STAPLES_GUIDE_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "A note on cost",
    body: "This guide does not use live retailer prices or rank the five dinners by cost. The full ingredient list, pack sizes, current prices and ingredients already at home determine the result."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Chorizo, cr\xE8me fra\xEEche, stock, parmesan, pasta, cashews, bread, ham, curry paste and other packaged ingredients vary by product and may contain allergens. Check every label and follow the original publisher\u2019s recipe."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow each publisher\u2019s method and the product instructions. Cool cooked rice quickly, ideally within one hour, refrigerate it for no more than one day before reheating, and reheat it only once until steaming hot throughout."
  },
  {
    key: "source_timing",
    title: "Recipe and guidance review",
    body: "Publisher recipe details, NHS nutrition guidance and Food Standards Agency food-safety guidance were checked 28 July 2026. Follow the cited sources for later information."
  }
];
var CONVENIENCE_FISH_GUIDE_DISCLOSURES = [
  {
    key: "allergen_and_product",
    title: "Products and allergens",
    body: "Fish, crustaceans and molluscs are separate regulated allergen categories. Coatings, fishcakes and sauces vary by product and may contain cereals containing gluten, egg, milk, mustard or other allergens. Check the current label every time."
  },
  {
    key: "storage_and_cooking",
    title: "Cooking and storage",
    body: "Follow the cooking, storage and reheating instructions on the pack in front of you. When combining products on one tray, use the stated oven setting and add each item at the point required by its own instructions."
  },
  {
    key: "source_timing",
    title: "Guidance and product review",
    body: "NHS nutrition guidance, Food Standards Agency allergen guidance and the linked product information were checked 28 July 2026. Products and official guidance can change, so follow the current source and pack."
  }
];
var TINNED_FISH_GUIDE_DISCLOSURES = [
  {
    key: "allergen_and_product",
    title: "Products and allergens",
    body: "Fish, crustaceans and molluscs are separate regulated allergen categories. Packing liquids, sauces and dressings may introduce other allergens. Check every current label and follow individual medical advice."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and preparation",
    body: "Follow the current pack instructions. Transfer unused contents to a covered container, refrigerate them and follow the manufacturer\u2019s open-life guidance rather than storing leftovers in the opened tin."
  },
  {
    key: "source_timing",
    title: "Guidance and product review",
    body: "NHS nutrition guidance, Food Standards Agency safety and allergen guidance, product wording and preserved-sardine marketing standards were checked 28 July 2026. Follow the current source and label for later information."
  }
];
var PROGRAMMATIC_DISCLOSURE_FOOTER = {
  body: "Prices, availability and product information may change after publication. Costs are estimates based on the assumptions shown on each page.",
  links: [
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var COOKING_FOR_ONE_DISCLOSURE_FOOTER = {
  body: "This costed plan uses published recipes that DinnerByDesign did not develop or test. Prices and availability are a dated Aldi UK snapshot. Check current product labels and follow each publisher\u2019s method and current food-safety guidance.",
  links: [
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var OFFAL_BUDGET_DISCLOSURE_FOOTER = {
  body: "Offal prices, ranges, availability and product information vary. Check current shelf prices and labels, and follow current NHS and Food Standards Agency guidance.",
  links: [
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var PORTION_PLANNING_DISCLOSURE_FOOTER = {
  body: "This guide explains a planning technique rather than prescribing fixed portions. Pack sizes, appetites, product information and storage instructions vary.",
  links: [
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var MEDITERRANEAN_DISCLOSURE_FOOTER = {
  body: "This guide draws practical techniques from several distinct culinary traditions. Ingredient availability, product information and allergens vary, so check labels and follow current storage and cooking guidance.",
  links: [
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var SUMMER_STEWS_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than fixed recipes. Ingredient availability, product information, allergens and storage instructions vary, so check labels and follow current food-safety guidance.",
  links: [
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var FRESH_OR_FROZEN_DISCLOSURE_FOOTER = {
  body: "This guide describes general tendencies rather than fixed rules. Product preparation, storage instructions and suitability for uncooked use vary, so check the packet.",
  links: [
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var BATCH_COOKING_DISCLOSURE_FOOTER = {
  body: "Batch-cooking results vary with ingredients, portion sizes, available storage and how every portion is used. Check product labels and follow current food-safety guidance.",
  links: [
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var FAMILY_FUSSY_EATERS_DISCLOSURE_FOOTER = {
  body: "This guide is a flexible planning method, not a tested recipe or clinical feeding advice. Household needs, appetites, products and storage options vary, so adjust the example and follow current labels and guidance.",
  links: [
    { href: "/food-safety", label: "Storage and cooking safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER = {
  body: "These are practical starting points rather than guaranteed savings. Grocery costs, pack sizes, ingredient needs and storage options vary by household.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" }
  ]
};
var GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER = {
  body: "Grocery estimates can improve visibility and control, but products, prices, pack sizes, substitutions and ingredients already at home vary by household and shop.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" }
  ]
};
var CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER = {
  body: "Prices, pack sizes, usable quantities, cooking time and availability vary. Compare the pack in front of you, check product labels and follow current food-safety guidance.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" }
  ]
};
var SHARED_INGREDIENTS_DISCLOSURE_FOOTER = {
  body: "This guide illustrates one shared-ingredient planning approach rather than fixed recipes or guaranteed savings. Adjust quantities, check product labels and follow current food-safety guidance.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Storage and cooking safety" }
  ]
};
var FIVE_A_DAY_DISCLOSURE_FOOTER = {
  body: "This guide explains general UK 5 A Day guidance. It does not replace individual advice from a registered healthcare professional.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/nutrition-methodology", label: "Nutrition estimate methodology" }
  ]
};
var LOW_COST_DINNERS_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible cooking ideas rather than fixed recipes or guaranteed savings. Ingredient prices, pack sizes, availability and product information vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "Pricing methodology" },
    { href: "/food-safety", label: "Food safety guidance" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER = {
  body: "This is a general comparison, not an assessment of every recipe or supermarket product. Individual nutritional needs, prices, ingredients and serving sizes vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/nutrition-methodology", label: "Nutrition estimate methodology" },
    { href: "/food-safety", label: "Food safety guidance" },
    { href: "/pricing-methodology", label: "Pricing methodology" }
  ]
};
var PULSES_DISCLOSURE_FOOTER = {
  body: "This guide provides general cooking, cost and storage information. Product prices, energy tariffs, pack instructions and individual dietary needs vary.",
  links: [
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" },
    { href: "/guides", label: "Browse all guides" }
  ]
};
var TRAYBAKE_DISCLOSURE_FOOTER = {
  body: "This guide provides general cooking guidance. Ingredient size, oven performance, product instructions and individual dietary needs vary.",
  links: [
    { href: "/food-safety", label: "Food safety" },
    { href: "/guides", label: "Browse all guides" }
  ]
};
var SAUSAGE_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than complete recipes. Product prices, pack sizes, ingredients, cooking instructions and allergens vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var FIVE_STAPLES_GUIDE_DISCLOSURE_FOOTER = {
  body: "DinnerByDesign selected and compared these published recipes but did not develop or test them. Follow the original publisher\u2019s ingredients, quantities, method, allergen information and safety advice.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var CONVENIENCE_FISH_GUIDE_DISCLOSURE_FOOTER = {
  body: "DinnerByDesign provides general dinner-planning ideas rather than product-specific cooking instructions. Product composition, allergens, serving information and preparation methods vary by brand.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/food-safety", label: "Food safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var TINNED_FISH_GUIDE_DISCLOSURE_FOOTER = {
  body: "DinnerByDesign provides flexible dinner ideas rather than product-specific recipes. Packing liquid, drained weight, salt, ingredients, allergens and preparation instructions vary between products.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/food-safety", label: "Food safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
function renderProgrammaticDisclosuresInitialHtml(items) {
  return `<aside aria-label="Important information">${items.map((item) => `<section><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.body)}</p></section>`).join("")}</aside>`;
}
function renderProgrammaticDisclosureFooterInitialHtml(copy = PROGRAMMATIC_DISCLOSURE_FOOTER) {
  const links = copy.links.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(" \xB7 ");
  return `<aside aria-label="About this guide"><h2>About this guide</h2><p>${escapeHtml(copy.body)}</p><p>${links}</p></aside>`;
}

// src/content/publicGuideModel.ts
function getPublicGuideJsonLd(guide) {
  const url = `https://dinnerbydesign.app${guide.canonicalPath}`;
  const breadcrumbRoot = guide.breadcrumbRoot ?? { label: "Guides", url: "/guides" };
  const breadcrumbRootUrl = breadcrumbRoot.url.startsWith("http") ? breadcrumbRoot.url : `https://dinnerbydesign.app${breadcrumbRoot.url}`;
  const graph = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.metaDescription,
      datePublished: guide.publishedAt,
      dateModified: guide.reviewedAt,
      author: { "@type": "Organization", name: guide.editorialOwner },
      publisher: { "@type": "Organization", name: "DinnerByDesign", url: "https://dinnerbydesign.app/" },
      mainEntityOfPage: url,
      citation: guide.sources.map((source) => source.url)
    },
    ...guide.jsonLdGraphItems ?? [],
    ...guide.faqs.length > 0 ? [{
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }] : [],
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "DinnerByDesign", item: "https://dinnerbydesign.app/" },
        { "@type": "ListItem", position: 2, name: breadcrumbRoot.label, item: breadcrumbRootUrl },
        { "@type": "ListItem", position: 3, name: guide.title, item: url }
      ]
    }
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

// src/content/seoMealPlans.ts
var FIVE_DINNERS_FOR_TWO_UNDER_40 = {
  slug: "5-dinners-for-2-under-40",
  title: "5 dinners for two under \xA340",
  seoTitle: "5 dinners for two under \xA340 | DinnerByDesign",
  shortTitle: "Five dinners for two under \xA340",
  description: "A five-night UK dinner plan for two, designed around a \xA340 target with shared ingredients, practical substitutions and transparent reference-price estimates.",
  householdSize: 2,
  dinnerCount: 5,
  budgetTarget: 40,
  estimatedIngredientCost: 25.35,
  expectedCheckoutCost: 37.9,
  priceBasisDate: "2026-07-18",
  publishedAt: "2026-07-18",
  reviewedAt: "2026-07-18",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Dinner plan",
  primarySearchIntent: "Affordable weekly dinners for two within a \xA340 supermarket checkout target",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-19",
  costMethodology: "Representative UK standard packs, with checkout cost and the estimated value used shown separately.",
  editorialNotes: "Review pack prices, availability assumptions, substitutions and all stated totals before republishing.",
  minimumDinnerCount: 5,
  eligibilityRules: ["Exactly five distinct dinners", "Expected checkout cost no higher than \xA340", "At least three ingredients reused across the week", "No promotional price required"],
  internalLinks: ["/pricing-methodology", "/recipe-methodology", "/food-costs/uk-food-costs-2026"],
  disclosures: ["price_estimate", "serving_assumption", "allergen_and_product"],
  status: "published",
  introduction: [
    "Planning five different dinners can easily create five disconnected shopping lists. This week is designed differently: useful ingredients are deliberately carried from one dinner into another, while chicken, pulses and eggs provide variety without requiring five separate main-protein purchases.",
    "The \xA340 target refers to the expected checkout cost of representative complete packs for two people. The lower ingredient figure shows the estimated value actually used across the ten portions. Keeping both figures visible makes it easier to distinguish the food consumed from the cash likely to be needed at the supermarket.",
    "This is a practical starting point rather than a fixed prescription. Brands, pack sizes, retailer, location and ingredients already at home will change the total. The substitutions below show how to adapt the week without losing its underlying cost-control structure."
  ],
  dinners: [
    { day: "Monday", title: "Paprika chicken and pepper traybake", description: "Chicken, peppers, onions and potatoes roasted together with paprika.", totalTimeMinutes: 40, estimatedCost: 6.4, sharedIngredientNote: "Keep half the chicken, one pepper and some cooked potatoes for later dinners." },
    { day: "Tuesday", title: "Tomato and lentil pasta", description: "A simple red-lentil tomato sauce with pasta and a little cheddar.", totalTimeMinutes: 30, estimatedCost: 3.75, sharedIngredientNote: "Uses the same onions, garlic, tomatoes and cheddar needed later in the week." },
    { day: "Wednesday", title: "Chicken and vegetable fried rice", description: "Monday\u2019s reserved chicken with rice, pepper, carrot and egg.", totalTimeMinutes: 20, estimatedCost: 4.8, sharedIngredientNote: "Turns reserved chicken and vegetables into a quick midweek dinner." },
    { day: "Thursday", title: "Loaded bean and potato bowls", description: "Crisp potatoes topped with tomato beans, cheddar and yoghurt.", totalTimeMinutes: 35, estimatedCost: 4.2, sharedIngredientNote: "Finishes the potatoes, tomatoes and cheddar without requiring another main protein." },
    { day: "Friday", title: "Carrot, chickpea and spinach curry", description: "A tomato-based chickpea curry served with the remaining rice and yoghurt.", totalTimeMinutes: 30, estimatedCost: 6.2, sharedIngredientNote: "Uses the remaining carrots, spinach, tomatoes, rice and yoghurt." }
  ],
  sharedIngredients: [
    { ingredient: "Onions and garlic", uses: "The traybake, pasta sauce and curry." },
    { ingredient: "Peppers and carrots", uses: "The traybake, fried rice and curry." },
    { ingredient: "Potatoes", uses: "Monday\u2019s traybake and Thursday\u2019s loaded bowls." },
    { ingredient: "Rice", uses: "Wednesday\u2019s fried rice and Friday\u2019s curry." },
    { ingredient: "Tomatoes", uses: "The pasta sauce, loaded beans and curry." },
    { ingredient: "Cheddar and yoghurt", uses: "Small amounts across Tuesday, Thursday and Friday." }
  ],
  substitutions: [
    { swap: "Replace chicken with an extra tin of chickpeas and 250g mushrooms.", effect: "Creates a vegetarian week and should reduce the reference estimate." },
    { swap: "Use frozen spinach and mixed peppers.", effect: "Can reduce waste and may cost less than buying several fresh packs." },
    { swap: "Use brown rice or wholewheat pasta already at home.", effect: "Keeps the plan structure while avoiding an unnecessary new pack." }
  ],
  shoppingStrategy: [
    "Buy one main chicken pack and divide it between Monday\u2019s traybake and Wednesday\u2019s fried rice. Cook and reserve Wednesday\u2019s portion promptly rather than treating it as an accidental leftover.",
    "Use one bag each of potatoes, onions and carrots across several dinners. These ingredients are inexpensive, flexible and less likely to leave an unusable remainder than several specialist side dishes.",
    "Open tins and longer-life packs later in the week. Lentils, beans, chickpeas, pasta and rice provide budget resilience if a fresh ingredient becomes unavailable or needs replacing.",
    "Cheddar and yoghurt are supporting ingredients rather than the centre of a dinner. Small quantities add flavour across several nights without requiring a separate topping or sauce for each dish."
  ],
  budgetPrinciples: [
    { title: "One chicken purchase, two dinners", explanation: "Chicken is used twice, reducing the need to buy another higher-cost main protein for Wednesday." },
    { title: "Three pulse-led dinners", explanation: "Lentils, beans and chickpeas keep the week varied while protecting the overall target." },
    { title: "Repeated vegetables with different roles", explanation: "Peppers, carrots, onions, potatoes and tomatoes appear in different combinations rather than as identical leftovers." },
    { title: "No promotional price dependency", explanation: "The plan does not require a loyalty-card offer, multibuy or temporary reduction to remain below its stated reference target." }
  ],
  flexibleScenarios: [
    { question: "If you already have rice, pasta or spices", answer: "Mark those items as already in stock when personalising the plan. The expected checkout estimate should fall because no new pack is required." },
    { question: "If you are cooking for three or four", answer: "Increase the household size in Plan My Week. Quantities will scale, but complete-pack rounding means the total will not always rise in a perfectly straight line." },
    { question: "If you shop at a different supermarket", answer: "Keep the dinner structure and compare equivalent standard packs. Treat \xA337.90 as the reference-basket estimate rather than a promise from a particular retailer." },
    { question: "If you want a vegetarian week", answer: "Replace the chicken with chickpeas and mushrooms and apply the vegetarian rule before generating alternatives." }
  ],
  shoppingList: [
    { category: "Protein", ingredient: "Chicken breast", quantityRequired: "800g", referencePack: "2 \xD7 400g packs", checkoutCost: 6, usedValue: 6, usedIn: "Monday and Wednesday" },
    { category: "Produce", ingredient: "Peppers", quantityRequired: "2", referencePack: "3-pack", checkoutCost: 1.5, usedValue: 1, usedIn: "Monday and Wednesday" },
    { category: "Produce", ingredient: "Onions", quantityRequired: "600g", referencePack: "1kg bag", checkoutCost: 1, usedValue: 0.6, usedIn: "Monday, Tuesday, Thursday and Friday" },
    { category: "Produce", ingredient: "Potatoes", quantityRequired: "1.5kg", referencePack: "2.5kg bag", checkoutCost: 1.5, usedValue: 0.9, usedIn: "Monday and Thursday" },
    { category: "Produce", ingredient: "Carrots", quantityRequired: "600g", referencePack: "1kg bag", checkoutCost: 0.6, usedValue: 0.36, usedIn: "Wednesday and Friday" },
    { category: "Cupboard", ingredient: "Pasta", quantityRequired: "300g", referencePack: "500g pack", checkoutCost: 0.75, usedValue: 0.45, usedIn: "Tuesday" },
    { category: "Cupboard", ingredient: "Red lentils", quantityRequired: "250g", referencePack: "500g pack", checkoutCost: 1, usedValue: 0.5, usedIn: "Tuesday" },
    { category: "Cupboard", ingredient: "Chopped tomatoes", quantityRequired: "3 \xD7 400g tins", referencePack: "3 \xD7 400g tins", checkoutCost: 1.5, usedValue: 1.5, usedIn: "Tuesday, Thursday and Friday" },
    { category: "Chilled", ingredient: "Cheddar", quantityRequired: "300g", referencePack: "400g pack", checkoutCost: 2.5, usedValue: 1.88, usedIn: "Tuesday and Thursday" },
    { category: "Cupboard", ingredient: "Rice", quantityRequired: "400g", referencePack: "1kg pack", checkoutCost: 1.5, usedValue: 0.6, usedIn: "Wednesday and Friday" },
    { category: "Chilled", ingredient: "Eggs", quantityRequired: "4", referencePack: "12-pack", checkoutCost: 2.5, usedValue: 0.83, usedIn: "Wednesday" },
    { category: "Cupboard", ingredient: "Beans", quantityRequired: "2 \xD7 400g tins", referencePack: "2 \xD7 400g tins", checkoutCost: 1, usedValue: 1, usedIn: "Thursday" },
    { category: "Chilled", ingredient: "Natural yoghurt", quantityRequired: "500g", referencePack: "500g pot", checkoutCost: 1.5, usedValue: 1.5, usedIn: "Thursday and Friday" },
    { category: "Cupboard", ingredient: "Chickpeas", quantityRequired: "2 \xD7 400g tins", referencePack: "2 \xD7 400g tins", checkoutCost: 1, usedValue: 1, usedIn: "Friday" },
    { category: "Freezer", ingredient: "Spinach", quantityRequired: "300g", referencePack: "2 \xD7 250g packs", checkoutCost: 3.4, usedValue: 2.04, usedIn: "Friday" },
    { category: "Produce", ingredient: "Garlic", quantityRequired: "1 bulb", referencePack: "3-bulb pack", checkoutCost: 0.75, usedValue: 0.25, usedIn: "Tuesday and Friday" },
    { category: "Cupboard", ingredient: "Curry powder", quantityRequired: "20g", referencePack: "80g jar", checkoutCost: 1, usedValue: 0.25, usedIn: "Friday" },
    { category: "Cupboard", ingredient: "Paprika", quantityRequired: "About 25g", referencePack: "40g jar", checkoutCost: 1, usedValue: 0.62, usedIn: "Monday and Thursday" },
    { category: "Cupboard", ingredient: "Soy sauce", quantityRequired: "30ml", referencePack: "150ml bottle", checkoutCost: 1, usedValue: 0.2, usedIn: "Wednesday" },
    { category: "Freezer", ingredient: "Frozen peas", quantityRequired: "300g", referencePack: "500g bag", checkoutCost: 1.2, usedValue: 0.72, usedIn: "Wednesday" },
    { category: "Freezer", ingredient: "Frozen mixed vegetables", quantityRequired: "500g", referencePack: "1kg bag", checkoutCost: 1.5, usedValue: 0.75, usedIn: "Wednesday and Friday" },
    { category: "Produce", ingredient: "Salad leaves", quantityRequired: "200g", referencePack: "200g bag", checkoutCost: 1.2, usedValue: 1.2, usedIn: "Thursday" },
    { category: "Cupboard", ingredient: "Vegetable stock", quantityRequired: "2 cubes", referencePack: "10-cube pack", checkoutCost: 1, usedValue: 0.2, usedIn: "Tuesday and Friday" },
    { category: "Produce", ingredient: "Lemons", quantityRequired: "1", referencePack: "2-pack", checkoutCost: 0.6, usedValue: 0.3, usedIn: "Monday and Friday" },
    { category: "Cupboard", ingredient: "Tomato pur\xE9e", quantityRequired: "100g", referencePack: "200g tube", checkoutCost: 0.7, usedValue: 0.35, usedIn: "Tuesday and Friday" },
    { category: "Produce", ingredient: "Spring onions", quantityRequired: "Half a bunch", referencePack: "1 bunch", checkoutCost: 0.7, usedValue: 0.35, usedIn: "Wednesday" }
  ],
  preparationAdvice: [
    "Before cooking on Monday, divide the chicken between Monday and Wednesday so the second portion is clearly reserved.",
    "Chop the onions, carrots and peppers needed across the week in one session, keeping each dinner\u2019s quantity separate.",
    "Measure the rice, pasta and lentils before cooking so the remaining dry ingredients stay available for another week."
  ],
  leftoverGuidance: [
    "The reference basket leaves useful dry goods, spices, eggs and some vegetables after these five dinners; these remain part of the checkout cost but not the value used.",
    "Cool reserved cooked ingredients promptly, refrigerate them, and follow current food-safety guidance when reheating.",
    "If plans change, prioritise fresh salad leaves, yoghurt and opened produce; unopened cupboard and frozen ingredients can support a later dinner."
  ],
  faqs: [
    { question: "Does the \xA340 target include full supermarket packs?", answer: "Yes. The expected checkout figure uses representative complete packs; the lower ingredient figure shows only the estimated value used by these dinners." },
    { question: "Can I make the plan vegetarian?", answer: "Yes. Replace the chicken with chickpeas and mushrooms, then apply vegetarian preferences when personalising the plan." },
    { question: "Will my actual checkout be exactly \xA337.90?", answer: "No. Retailer, location, availability, substitutions, promotions and ingredients already at home will change it." },
    { question: "Are cupboard basics included?", answer: "Every priced item used in the calculation is shown in the shopping list. Salt, pepper and cooking oil are treated as cupboard basics and are not included in the \xA337.90 reference basket." },
    { question: "Can I scale this plan for a larger household?", answer: "Yes. Increase the household size when personalising the plan. Complete-pack rounding means the checkout estimate may not increase in a perfectly straight line." }
  ]
};
var FIVE_DINNERS_FOR_TWO_UNDER_40_PATH = "/dinner-plans/5-dinners-for-2-under-40";
function getFiveDinnersForTwoJsonLd() {
  return getPublicGuideJsonLd(FIVE_DINNERS_FOR_TWO_UNDER_40_GUIDE_RECORD);
}
var escapeHtml2 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var formatMoney = (value) => `\xA3${value.toFixed(2)}`;
var FIVE_DINNERS_FOR_TWO_DISCLOSURES = [
  ...FIVE_DINNERS_PRICE_DISCLOSURES,
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Product ingredients, allergens, pack sizes and substitutions vary. Check current labels before shopping or cooking, especially for sauces, stock cubes, dairy, eggs and any vegetarian swaps."
  }
];
var FIVE_DINNERS_FOR_TWO_DISCLOSURES_FOR_RECORD = FIVE_DINNERS_FOR_TWO_UNDER_40.disclosures.map((key) => {
  const disclosure = FIVE_DINNERS_FOR_TWO_DISCLOSURES.find((item) => item.key === key);
  if (!disclosure) throw new Error(`Missing five dinners for two disclosure for ${key}`);
  return disclosure;
});
var renderFiveDinnersForTwoArticleSections = () => {
  const plan = FIVE_DINNERS_FOR_TWO_UNDER_40;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FIVE_DINNERS_FOR_TWO_DISCLOSURES);
  const dinners = plan.dinners.map((dinner) => `<article><p>${escapeHtml2(dinner.day)}</p><h3>${escapeHtml2(dinner.title)}</h3><p>${escapeHtml2(dinner.description)}</p><p>About ${dinner.totalTimeMinutes} minutes \xB7 ${formatMoney(dinner.estimatedCost)}</p><p>${escapeHtml2(dinner.sharedIngredientNote)}</p></article>`).join("");
  const shared = plan.sharedIngredients.map((item) => `<li><strong>${escapeHtml2(item.ingredient)}:</strong> ${escapeHtml2(item.uses)}</li>`).join("");
  const substitutions = plan.substitutions.map((item) => `<li><strong>${escapeHtml2(item.swap)}</strong> ${escapeHtml2(item.effect)}</li>`).join("");
  const introduction = plan.introduction.map((paragraph) => `<p>${escapeHtml2(paragraph)}</p>`).join("");
  const strategy = plan.shoppingStrategy.map((paragraph) => `<p>${escapeHtml2(paragraph)}</p>`).join("");
  const principles = plan.budgetPrinciples.map((item) => `<li><strong>${escapeHtml2(item.title)}:</strong> ${escapeHtml2(item.explanation)}</li>`).join("");
  const scenarios = plan.flexibleScenarios.map((item) => `<h3>${escapeHtml2(item.question)}</h3><p>${escapeHtml2(item.answer)}</p>`).join("");
  const shoppingList = ["Protein", "Produce", "Chilled", "Cupboard", "Freezer"].map((category) => `<section><h3>${category}</h3><ul>${plan.shoppingList.filter((item) => item.category === category).map((item) => `<li><strong>${escapeHtml2(item.ingredient)}</strong>: ${escapeHtml2(item.quantityRequired)} required; ${escapeHtml2(item.referencePack)} at ${formatMoney(item.checkoutCost)}; about ${formatMoney(item.usedValue)} used. Used in ${escapeHtml2(item.usedIn)}.</li>`).join("")}</ul></section>`).join("");
  const preparation = plan.preparationAdvice.map((item) => `<li>${escapeHtml2(item)}</li>`).join("");
  const leftovers = plan.leftoverGuidance.map((item) => `<li>${escapeHtml2(item)}</li>`).join("");
  const faqs = plan.faqs.map((item) => `<h3>${escapeHtml2(item.question)}</h3><p>${escapeHtml2(item.answer)}</p>`).join("");
  return `<section><h2>A practical \xA340 week, not five separate shopping lists</h2>${introduction}</section><section aria-label="Plan summary"><h2>Plan summary</h2><p>Dinner target: ${formatMoney(plan.budgetTarget)} for five dinners for two.</p><p>Estimated ingredients: ${formatMoney(plan.estimatedIngredientCost)}, about ${formatMoney(plan.estimatedIngredientCost / 10)} per portion.</p><p>Expected checkout: ${formatMoney(plan.expectedCheckoutCost)} using full reference packs.</p></section>${disclosures}<section><h2>The five-night dinner plan</h2>${dinners}</section><section><h2>Complete shopping list and cost calculation</h2><p>The checkout column represents complete reference packs. The value-used column apportions only the quantity used across these ten portions. Adding the listed packs gives ${formatMoney(plan.expectedCheckoutCost)}; adding the value used gives ${formatMoney(plan.estimatedIngredientCost)}.</p>${shoppingList}</section><section><h2>Preparation and leftovers</h2><h3>Prepare once, use again</h3><ul>${preparation}</ul><h3>What remains after the week</h3><ul>${leftovers}</ul></section><section><h2>The shopping strategy behind the week</h2>${strategy}</section><section><h2>How we kept the plan under \xA340</h2><ul>${principles}</ul></section><section><h2>How ingredients are reused</h2><ul>${shared}</ul></section><section><h2>Practical substitutions</h2><ul>${substitutions}</ul></section><section><h2>Make the plan work in different circumstances</h2>${scenarios}</section><section><h2>How this plan was selected</h2><p>The plan repeats useful ingredients across five different dinners to reduce disconnected purchases and food waste. It is not guaranteed to be the mathematically cheapest possible basket.</p><p><a href="/pricing-methodology">Read the ingredient-pricing methodology</a>, <a href="/recipe-methodology">see how dinners are selected</a> or <a href="/food-costs/uk-food-costs-2026">understand the wider UK food-cost picture</a>.</p></section><section><h2>Questions about this \xA340 plan</h2>${faqs}</section>`;
};
var FIVE_DINNERS_FOR_TWO_UNDER_40_GUIDE_RECORD = {
  id: "five-dinners-for-two-under-40",
  slug: FIVE_DINNERS_FOR_TWO_UNDER_40.slug,
  path: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  canonicalPath: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  status: FIVE_DINNERS_FOR_TWO_UNDER_40.status,
  category: "dinner-plans",
  reviewSensitivity: "price-sensitive",
  title: FIVE_DINNERS_FOR_TWO_UNDER_40.title,
  seoTitle: FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle,
  description: FIVE_DINNERS_FOR_TWO_UNDER_40.description,
  metaDescription: "Five affordable UK dinners for two under a \xA340 target, with shared ingredients, full-pack checkout estimates and practical substitutions.",
  label: "Dinner plan",
  publishedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.publishedAt,
  reviewedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.reviewedAt,
  nextReviewAt: "2026-10-18",
  editorialOwner: FIVE_DINNERS_FOR_TWO_UNDER_40.editorialOwner,
  pageFamily: FIVE_DINNERS_FOR_TWO_UNDER_40.pageFamily,
  primarySearchIntent: FIVE_DINNERS_FOR_TWO_UNDER_40.primarySearchIntent,
  indexingStatus: FIVE_DINNERS_FOR_TWO_UNDER_40.indexingStatus,
  contentReviewedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.contentReviewedAt,
  editorialNotes: FIVE_DINNERS_FOR_TWO_UNDER_40.editorialNotes,
  internalLinks: [...FIVE_DINNERS_FOR_TWO_UNDER_40.internalLinks],
  disclosures: [...FIVE_DINNERS_FOR_TWO_UNDER_40.disclosures],
  disclosureItems: FIVE_DINNERS_FOR_TWO_DISCLOSURES_FOR_RECORD,
  disclosureFooter: PROGRAMMATIC_DISCLOSURE_FOOTER,
  breadcrumbRoot: { label: "Affordable dinner plans", url: "/dinner-plans" },
  sources: [
    { label: "DinnerByDesign pricing methodology", url: "https://dinnerbydesign.app/pricing-methodology" },
    { label: "DinnerByDesign recipe methodology", url: "https://dinnerbydesign.app/recipe-methodology" },
    { label: "UK food-cost context", url: "https://dinnerbydesign.app/food-costs/uk-food-costs-2026" }
  ],
  faqs: FIVE_DINNERS_FOR_TWO_UNDER_40.faqs,
  sections: [{ rawHtml: renderFiveDinnersForTwoArticleSections() }],
  cta: {
    title: "Personalise this dinner plan",
    copy: "Use DinnerByDesign to adjust the week around your household, ingredients, budget and preferences.",
    label: "Personalise this dinner plan",
    href: "/signin"
  },
  jsonLdGraphItems: [
    {
      "@type": "CollectionPage",
      "@id": `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}#page`,
      url: `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`,
      name: FIVE_DINNERS_FOR_TWO_UNDER_40.title,
      description: FIVE_DINNERS_FOR_TWO_UNDER_40.description,
      datePublished: FIVE_DINNERS_FOR_TWO_UNDER_40.publishedAt,
      dateModified: FIVE_DINNERS_FOR_TWO_UNDER_40.reviewedAt,
      isPartOf: { "@type": "WebSite", name: "DinnerByDesign", url: "https://dinnerbydesign.app/" },
      mainEntity: { "@id": `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}#plan` }
    },
    {
      "@type": "ItemList",
      "@id": `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}#plan`,
      name: FIVE_DINNERS_FOR_TWO_UNDER_40.shortTitle,
      numberOfItems: FIVE_DINNERS_FOR_TWO_UNDER_40.dinners.length,
      itemListElement: FIVE_DINNERS_FOR_TWO_UNDER_40.dinners.map((dinner, index) => ({ "@type": "ListItem", position: index + 1, name: dinner.title }))
    }
  ],
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};
function renderFiveDinnersForTwoInitialHtml() {
  const plan = FIVE_DINNERS_FOR_TWO_UNDER_40;
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml();
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Affordable dinner plans</nav><p>Affordable weekly dinner plan</p><h1>${escapeHtml2(plan.title)}</h1><p>${escapeHtml2(plan.description)}</p><p>By ${escapeHtml2(plan.editorialOwner)} \xB7 Published 18 July 2026 \xB7 Content reviewed 19 July 2026 \xB7 Prices checked 18 July 2026</p>${renderFiveDinnersForTwoArticleSections()}${disclosureFooter}<p><a href="/signin">Personalise this dinner plan</a></p></main></div>`;
}

// src/content/familyDinnersForFourPlan.ts
var FAMILY_DINNERS_FOR_FOUR_PATH = "/dinner-plans/5-affordable-family-dinners-for-four";
var FAMILY_DINNERS_FOR_FOUR_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "How to read the costs",
    body: "Prices were checked against an Aldi UK reference basket on 26 July 2026. The \xA335.38 checkout figure covers complete packs. The \xA318.31 ingredient figure estimates only the quantities used across the 20 servings. Retailer, region, availability and promotions will change the amount paid."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Each recipe is written for four servings. Appetite, portion size and any additional sides may change the quantity your household needs."
  },
  {
    key: "source_timing",
    title: "Source and price timing",
    body: "Recipe structure, product pages and prices were reviewed on 26 July 2026. Aldi product availability, pack sizes and online prices may change after that date."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow use-by dates and the storage, freezing and cooking instructions on each pack. Refrigerate or freeze raw chicken promptly and cook it thoroughly."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Sausages, stock cubes, pasta, couscous and replacement products vary. Check every label for allergens and dietary suitability."
  }
];
var FAMILY_DINNERS_FOR_FOUR = {
  slug: "5-affordable-family-dinners-for-four",
  title: "Five family dinners for four using one coordinated basket",
  shortTitle: "Five family dinners for four",
  seoTitle: "5 family dinners for four using one basket | DinnerByDesign",
  description: "Five affordable UK family dinners for four, with one coordinated shopping basket, shared ingredients, pack costs and practical ways to reduce waste.",
  householdSize: 4,
  dinnerCount: 5,
  servingCount: 20,
  expectedCheckoutCost: 35.38,
  estimatedIngredientCost: 18.31,
  averageCostPerServing: 0.92,
  priceBasisDate: "2026-07-26",
  publishedAt: "2026-07-26",
  reviewedAt: "2026-07-26",
  contentReviewedAt: "2026-07-26",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Dinner plan",
  primarySearchIntent: "Affordable family dinners for four using one coordinated UK shopping basket",
  indexingStatus: "index",
  status: "published",
  disclosures: ["price_estimate", "serving_assumption", "source_timing", "storage_and_cooking", "allergen_and_product"],
  internalLinks: [
    "/dinner-plans",
    "/dinner-plans/5-dinners-for-2-under-40",
    "/food-costs/five-dinners-same-ingredients",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/fresh-or-frozen",
    "/pricing-methodology",
    "/recipe-methodology"
  ],
  introduction: [
    "Shopping for five separate dinners across a week often leaves a fridge full of loose ends: half a bag of carrots, a part-used tin of tomatoes, or three peppers when a recipe only called for one.",
    "This plan works differently. All five dinners draw from a single basket, so what is bought for Monday gets used again later in the week. Below is the plan, the ingredients behind it, and an honest account of the likely cost and what is left in the cupboard afterwards."
  ],
  recipes: [
    {
      title: "Sausage and root-vegetable traybake",
      summary: "Sausages, carrots and potatoes roasted together on one tray.",
      ingredients: [
        { name: "Pork sausages", quantity: "8" },
        { name: "Carrots, cut into batons", quantity: "400g" },
        { name: "Potatoes, cut into chunks", quantity: "500g" },
        { name: "Onion, cut into wedges", quantity: "1" },
        { name: "Olive oil", quantity: "1 tbsp" },
        { name: "Dried mixed herbs", quantity: "1 tsp" }
      ],
      timing: "Prep 10 min \xB7 cook 35 min in the oven \xB7 total 45 min",
      method: [
        "Heat the oven to 200\xB0C, or 180\xB0C fan.",
        "Toss the carrots, potatoes and onion with the oil and herbs on a large baking tray.",
        "Add the sausages, spacing everything out in a single layer.",
        "Roast for 35 minutes, turning once, until the sausages are cooked through and the vegetables are tender."
      ],
      cost: 2.64,
      perServing: 0.66,
      reuse: "Carrots and onion are shared with the cottage pie later in the week.",
      allergens: "Sausages may contain gluten from rusk, so check the pack. A meat-free sausage can replace pork, but compare the pack price with the \xA31.79 used here."
    },
    {
      title: "Red lentil cottage pie",
      summary: "A mash-topped pie built on red lentils rather than mince, using the same carrots and potatoes bought for the traybake.",
      ingredients: [
        { name: "Red lentils", quantity: "250g" },
        { name: "Carrots, grated", quantity: "200g" },
        { name: "Onion, chopped", quantity: "1" },
        { name: "Garlic, crushed", quantity: "2 cloves" },
        { name: "Olive oil", quantity: "1 tsp" },
        { name: "Chopped tomatoes", quantity: "1 tin" },
        { name: "Vegetable stock cube", quantity: "1" },
        { name: "Potatoes", quantity: "800g" },
        { name: "Butter", quantity: "25g" },
        { name: "Milk", quantity: "A splash, about 50ml" },
        { name: "Mature cheddar, grated", quantity: "100g" },
        { name: "Frozen peas", quantity: "100g" }
      ],
      timing: "Prep 15 min \xB7 cook 30 min \xB7 total 45 min",
      method: [
        "Boil the potatoes until soft, then mash with the butter and milk.",
        "Heat the oil in a pan and fry the onion, garlic and carrots for five minutes.",
        "Add the lentils, tomatoes and stock cube dissolved in 400ml water. Simmer for 20 minutes, stirring occasionally, until the lentils are soft and the mixture has thickened. Stir through the peas.",
        "Spoon into an ovenproof dish, top with the mash, and scatter over the cheddar.",
        "Grill for 8 to 10 minutes until the top is golden."
      ],
      cost: 2.86,
      perServing: 0.72,
      reuse: "Uses the remaining carrots and more of the potatoes bought for the traybake.",
      allergens: "Contains dairy. Some stock cubes contain gluten, so check the pack. Drained tinned green lentils can replace dried red lentils to shorten the cooking time."
    },
    {
      title: "Smoky bean and tomato pasta bake",
      summary: "Two tins of beans and tinned tomatoes with smoked paprika, finished under the grill with a second portion of cheddar.",
      ingredients: [
        { name: "Pasta, penne or similar", quantity: "300g" },
        { name: "Cannellini or haricot beans, drained", quantity: "2 tins" },
        { name: "Chopped tomatoes", quantity: "1 tin" },
        { name: "Onion, chopped", quantity: "1" },
        { name: "Garlic, crushed", quantity: "2 cloves" },
        { name: "Olive oil", quantity: "1 tsp" },
        { name: "Smoked paprika", quantity: "1 tsp" },
        { name: "Spinach", quantity: "100g" },
        { name: "Mature cheddar, grated", quantity: "100g" }
      ],
      timing: "Prep 10 min \xB7 cook 20 min \xB7 total 30 min",
      method: [
        "Cook the pasta according to the pack instructions.",
        "Heat the oil and fry the onion and garlic for five minutes. Add the beans, tomatoes and smoked paprika, then simmer for 10 minutes.",
        "Stir the spinach through the sauce until wilted, then combine with the drained pasta.",
        "Transfer to an ovenproof dish, scatter over the cheddar, and grill for five minutes until melted and lightly browned."
      ],
      cost: 2.96,
      perServing: 0.74,
      reuse: "Finishes the two tins of tomatoes bought for the week and uses a second portion of the cheddar.",
      allergens: "Contains gluten and dairy. Gluten-free pasta is a direct swap. Any tinned white bean can replace cannellini or haricot beans."
    },
    {
      title: "Chicken and vegetable couscous",
      summary: "Diced chicken thighs with courgette and pepper, spooned over couscous.",
      ingredients: [
        { name: "Chicken thigh fillets, diced", quantity: "500g" },
        { name: "Couscous", quantity: "250g" },
        { name: "Courgette, diced", quantity: "1" },
        { name: "Pepper, diced", quantity: "1" },
        { name: "Onion, chopped", quantity: "1" },
        { name: "Garlic, crushed", quantity: "1 clove" },
        { name: "Ground cumin", quantity: "1 tsp" },
        { name: "Vegetable stock cube", quantity: "1" },
        { name: "Frozen peas", quantity: "100g" },
        { name: "Olive oil", quantity: "1 tbsp" }
      ],
      timing: "Prep 10 min \xB7 cook 15 min \xB7 total 25 min",
      method: [
        "Fry the chicken in the oil for 6 to 8 minutes until browned and cooked through, then set aside.",
        "In the same pan, soften the onion, garlic, courgette and pepper for five minutes. Stir in the cumin.",
        "Return the chicken to the pan with the peas and heat through.",
        "Prepare the couscous with stock made from the stock cube, following the pack instructions.",
        "Serve the chicken and vegetables over the couscous."
      ],
      cost: 5.89,
      perServing: 1.47,
      reuse: "Shares courgette and pepper with the frittata, and the stock cube and peas with the cottage pie.",
      allergens: "Couscous contains gluten. Rice or quinoa can replace it. Two drained tins of chickpeas reduce this dinner to about \xA33.33, or \xA30.83 per serving."
    },
    {
      title: "Vegetable and cheddar frittata with potato wedges",
      summary: "Baked potato wedges with an egg-based frittata using onion, courgette, pepper and spinach.",
      ingredients: [
        { name: "Potatoes, cut into wedges", quantity: "500g" },
        { name: "Olive oil", quantity: "2 tsp" },
        { name: "Onion, chopped", quantity: "1" },
        { name: "Medium eggs", quantity: "6" },
        { name: "Courgette, sliced", quantity: "1" },
        { name: "Pepper, sliced", quantity: "1" },
        { name: "Spinach", quantity: "100g" },
        { name: "Mature cheddar, grated", quantity: "50g" }
      ],
      timing: "Prep 15 min \xB7 cook 25 to 30 min \xB7 total about 40 to 45 min",
      method: [
        "Heat the oven to 200\xB0C, or 180\xB0C fan. Toss the wedges in half the oil and roast for 25 to 30 minutes, turning once.",
        "About 15 minutes before the wedges are ready, heat the remaining oil in a small ovenproof frying pan and soften the onion, courgette and pepper for five minutes. Add the spinach and let it wilt.",
        "Beat the eggs and pour them over the vegetables. Cook on a low heat for five minutes until the edges set.",
        "Scatter over the cheddar and finish under the grill for 3 to 4 minutes until set and golden.",
        "Serve with the potato wedges."
      ],
      cost: 3.96,
      perServing: 0.99,
      reuse: "Uses the remaining courgette, one more pepper, and the spinach, cheddar, potatoes and last onion bought for the other dinners.",
      allergens: "Contains eggs and dairy. A dairy-free hard-cheese alternative can replace cheddar. Use a different recipe for an egg allergy."
    }
  ],
  basket: [
    { category: "Produce", ingredient: "Carrots", quantityUsed: "600g", referencePack: "Nature's Pick carrots, 1kg", packCost: 0.69, valueUsed: 0.41, usedIn: "Traybake, cottage pie", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-carrots-000000000000339791" },
    { category: "Produce", ingredient: "Onions", quantityUsed: "5, about 625g", referencePack: "Nature's Pick brown onions, 1kg, standard price", packCost: 0.99, valueUsed: 0.62, usedIn: "All five dinners", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-brown-onions-000000000000339777" },
    { category: "Produce", ingredient: "Garlic", quantityUsed: "5 cloves", referencePack: "Nature's Pick garlic, 4 bulbs, standard price", packCost: 0.87, valueUsed: 0.11, usedIn: "Cottage pie, pasta bake, couscous", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-garlic-000000000000273810" },
    { category: "Produce", ingredient: "Potatoes", quantityUsed: "1.8kg", referencePack: "Nature's Pick British white potatoes, 2.5kg", packCost: 1.65, valueUsed: 1.19, usedIn: "Traybake, cottage pie, frittata", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-british-white-potatoes-000000000000340016" },
    { category: "Produce", ingredient: "Courgettes", quantityUsed: "2, 500g pack", referencePack: "Nature's Pick courgettes, 500g", packCost: 1.39, valueUsed: 1.39, usedIn: "Couscous, frittata", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-courgettes-500g-000000000000339808" },
    { category: "Produce", ingredient: "Peppers", quantityUsed: "2 of 3", referencePack: "Nature's Pick mixed peppers, 3 pack, standard price", packCost: 1.79, valueUsed: 1.19, usedIn: "Couscous, frittata", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-mixed-peppers-000000000000275392" },
    { category: "Produce", ingredient: "Spinach", quantityUsed: "200g", referencePack: "Nature's Pick British baby spinach, 450g", packCost: 1.59, valueUsed: 0.71, usedIn: "Pasta bake, frittata", sourceUrl: "https://www.aldi.co.uk/product/nature-s-pick-british-baby-spinach-000000000000340023" },
    { category: "Protein", ingredient: "Pork sausages", quantityUsed: "8", referencePack: "Butcher's Select pork sausages, 8 pack", packCost: 1.79, valueUsed: 1.79, usedIn: "Traybake", sourceUrl: "https://www.aldi.co.uk/product/butchers-select-butchers-pork-sausages-8-pack-000000000000383313" },
    { category: "Protein", ingredient: "Chicken thigh fillets", quantityUsed: "500g", referencePack: "Ashfields chicken thigh fillets, 600g", packCost: 4.39, valueUsed: 3.66, usedIn: "Couscous", sourceUrl: "https://www.aldi.co.uk/product/ashfields-chicken-thigh-fillets-000000000000416054" },
    { category: "Chilled", ingredient: "Mature cheddar", quantityUsed: "250g", referencePack: "Emporium British extra mature cheddar, 400g", packCost: 2.49, valueUsed: 1.56, usedIn: "Cottage pie, pasta bake, frittata", sourceUrl: "https://www.aldi.co.uk/product/emporium-british-extra-mature-cheddar-cheese-000000000000522620" },
    { category: "Chilled", ingredient: "Medium eggs", quantityUsed: "6", referencePack: "Merevale British medium free-range eggs, 6 pack", packCost: 1.49, valueUsed: 1.49, usedIn: "Frittata", sourceUrl: "https://www.aldi.co.uk/product/merevale-british-medium-free-range-eggs-6-pack-000000000000416701" },
    { category: "Chilled", ingredient: "Butter", quantityUsed: "25g", referencePack: "Cowbelle British salted butter, 250g", packCost: 1.99, valueUsed: 0.2, usedIn: "Cottage pie", sourceUrl: "https://www.aldi.co.uk/product/cowbelle-british-salted-butter-250g-000000000000416554" },
    { category: "Chilled", ingredient: "Semi-skimmed milk", quantityUsed: "About 50ml", referencePack: "Cowbelle British semi-skimmed milk, 1 pint", packCost: 0.85, valueUsed: 0.07, usedIn: "Cottage pie", sourceUrl: "https://www.aldi.co.uk/product/cowbelle-british-semi-skimmed-milk-1-7-fat-000000000417494001" },
    { category: "Cupboard", ingredient: "Red lentils", quantityUsed: "250g", referencePack: "Worldwide Foods red lentils, 500g", packCost: 0.99, valueUsed: 0.5, usedIn: "Cottage pie", sourceUrl: "https://www.aldi.co.uk/product/worldwide-foods-red-lentils-000000000000336258" },
    { category: "Cupboard", ingredient: "Chopped tomatoes", quantityUsed: "2 tins", referencePack: "Everyday Essentials chopped tomatoes, 400g, 2 tins", packCost: 0.86, valueUsed: 0.86, usedIn: "Cottage pie, pasta bake", sourceUrl: "https://www.aldi.co.uk/product/everyday-essentials-chopped-tomatoes-in-tomato-juice-000000000000278702" },
    { category: "Cupboard", ingredient: "Cannellini or haricot beans", quantityUsed: "2 tins", referencePack: "Four Seasons cannellini beans, 400g, 2 tins", packCost: 0.9, valueUsed: 0.9, usedIn: "Pasta bake", estimated: true },
    { category: "Cupboard", ingredient: "Vegetable stock cubes", quantityUsed: "2 of 12", referencePack: "Bramwells vegetable stock cubes, 12 pack", packCost: 0.55, valueUsed: 0.09, usedIn: "Cottage pie, couscous", estimated: true },
    { category: "Cupboard", ingredient: "Couscous", quantityUsed: "250g", referencePack: "Plain couscous, 500g", packCost: 0.95, valueUsed: 0.48, usedIn: "Couscous dinner", estimated: true },
    { category: "Cupboard", ingredient: "Penne pasta", quantityUsed: "300g", referencePack: "Cucina penne pasta, 500g", packCost: 0.69, valueUsed: 0.41, usedIn: "Pasta bake", sourceUrl: "https://www.aldi.co.uk/product/cucina-penne-pasta-500g-000000000000308638" },
    { category: "Cupboard", ingredient: "Smoked paprika", quantityUsed: "1 tsp", referencePack: "Ready, Set...Cook! smoked paprika, 40g", packCost: 0.69, valueUsed: 0.05, usedIn: "Pasta bake", sourceUrl: "https://www.aldi.co.uk/product/ready-set-cook-smoked-paprika-000000000000575323" },
    { category: "Cupboard", ingredient: "Ground cumin", quantityUsed: "1 tsp", referencePack: "Ready, Set...Cook! cumin, jar", packCost: 0.65, valueUsed: 0.05, usedIn: "Couscous", sourceUrl: "https://www.aldi.co.uk/product/ready-set-cook-cumin-000000000000335731" },
    { category: "Cupboard", ingredient: "Dried mixed herbs", quantityUsed: "1 tsp", referencePack: "Ready, Set...Cook! mixed herbs, jar", packCost: 0.59, valueUsed: 0.05, usedIn: "Traybake", sourceUrl: "https://www.aldi.co.uk/product/ready-set-cook-mixed-herbs-000000000000335977" },
    { category: "Cupboard", ingredient: "Olive oil", quantityUsed: "About 50ml", referencePack: "Solesta olive oil, 1 litre, standard price", packCost: 5.39, valueUsed: 0.27, usedIn: "All five dinners", sourceUrl: "https://www.aldi.co.uk/product/solesta-olive-oil-000000000000511100" },
    { category: "Freezer", ingredient: "Frozen peas", quantityUsed: "200g", referencePack: "Four Seasons garden peas, 900g", packCost: 1.15, valueUsed: 0.26, usedIn: "Cottage pie, couscous", sourceUrl: "https://www.aldi.co.uk/product/four-seasons-garden-peas-000000000000366805" }
  ],
  coordination: [
    "Carrots bought for Monday\u2019s traybake are roasted, then grated into the cottage pie filling. One 2.5kg sack of potatoes covers the traybake, the cottage pie mash and the frittata wedges.",
    "Courgette, pepper, spinach and onion are split between the couscous and the frittata. Cheddar is bought as one 400g block and used three times in different ways.",
    "Twelve ingredients appear in two or more dinners. Reuse is concentrated on fresh produce, cheddar, tomatoes, stock, olive oil and peas, rather than forcing every ingredient into two recipes."
  ],
  remainders: [
    "About 400g carrots, 700g potatoes, three onions, three garlic bulbs, one pepper and 250g spinach remain. Store them as directed on the packs, and freeze the pepper or wilt the spinach if they will not be used in time.",
    "About 100g raw chicken remains from the 600g pack. Use it within the pack\u2019s instructions or freeze it promptly in a sealed container or bag.",
    "About 150g cheddar, most of the butter and milk, and longer-life lentils, couscous, pasta, stock cubes, spices, olive oil and frozen peas carry into the following week."
  ],
  preparation: [
    "Chop the onions and garlic needed for the week in one go and keep them covered in the fridge.",
    "Grate the cottage-pie carrots while preparing the carrots for the traybake.",
    "Dice Thursday\u2019s chicken the night before if useful, keeping it covered and refrigerated until it is cooked."
  ],
  substitutions: [
    "For a vegetarian version, replace the pork sausages with a meat-free equivalent and swap the chicken for two drained tins of chickpeas. The couscous dinner then costs about \xA33.33, or \xA30.83 per serving.",
    "Frozen diced onion, pepper and spinach can replace fresh versions. Texture will be softer, and frozen is not always cheaper, so compare the pack price.",
    "Leeks can replace courgette, butter beans can replace cannellini or haricot beans, and another hard cheese can replace cheddar."
  ],
  methodology: [
    "Pack cost is the full price of the smallest suitable pack, whether or not the whole pack is used. Value used is the estimated share consumed by these five recipes. The five dinner costs reconcile to the \xA318.31 value-used total; the \xA335.38 checkout figure is higher because it includes complete packs.",
    "The plan assumes an empty cupboard. A household that already has olive oil, stock cubes or dried herbs is likely to spend less than the checkout figure.",
    "Cannellini or haricot beans, stock cubes and couscous are marked as estimates because their current online prices could not be verified on the linked Aldi product pages. In-store prices may differ. Costs also vary by retailer, region and time of year."
  ],
  faqs: [
    { question: "Can this plan be scaled for more or fewer than four servings?", answer: "Yes. Quantities scale with servings, but checkout cost will not move in a perfectly straight line because many ingredients come in fixed pack sizes." },
    { question: "Does the cost change with a different retailer?", answer: "Yes. These figures use an Aldi UK reference basket. Another supermarket or region may produce a noticeably different total." },
    { question: "What if someone will not eat one of the five dinners?", answer: "The couscous and pasta bake are the easiest to adapt without losing the shared-ingredient structure. Use the substitutions above or personalise the plan." },
    { question: "Which cupboard ingredients are assumed to be at home?", answer: "None. Spice jars, stock cubes and olive oil are all included, so an existing cupboard should lower the likely checkout cost." },
    { question: "How should leftovers be stored?", answer: "Follow the use-by date and storage instructions on each pack. Refrigerate or freeze promptly, particularly for raw chicken, and follow current Food Standards Agency guidance." }
  ]
};
function getFamilyDinnersForFourJsonLd() {
  return getPublicGuideJsonLd(FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD);
}
var escapeHtml3 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var money = (value) => `\xA3${value.toFixed(2)}`;
var FAMILY_DINNERS_FOR_FOUR_DISCLOSURES_FOR_RECORD = FAMILY_DINNERS_FOR_FOUR.disclosures.map((key) => {
  const disclosure = FAMILY_DINNERS_FOR_FOUR_DISCLOSURES.find((item) => item.key === key);
  if (!disclosure) throw new Error(`Missing family dinners for four disclosure for ${key}`);
  return disclosure;
});
var renderFamilyDinnersForFourArticleSections = () => {
  const plan = FAMILY_DINNERS_FOR_FOUR;
  const recipes = plan.recipes.map((recipe, index) => `<article><h3>${index + 1}. ${escapeHtml3(recipe.title)}</h3><p>${escapeHtml3(recipe.summary)}</p><h4>Ingredients for four</h4><ul>${recipe.ingredients.map((item) => `<li>${escapeHtml3(item.quantity)} ${escapeHtml3(item.name)}</li>`).join("")}</ul><p>${escapeHtml3(recipe.timing)}</p><ol>${recipe.method.map((step) => `<li>${escapeHtml3(step)}</li>`).join("")}</ol><p><strong>Cost: ${money(recipe.cost)} total, ${money(recipe.perServing)} per serving.</strong></p><p><strong>Reuse:</strong> ${escapeHtml3(recipe.reuse)}</p><p><strong>Allergens and substitutions:</strong> ${escapeHtml3(recipe.allergens)}</p></article>`).join("");
  const basket = ["Produce", "Protein", "Chilled", "Cupboard", "Freezer"].map((category) => `<section><h3>${category}</h3><ul>${plan.basket.filter((item) => item.category === category).map((item) => `<li><strong>${escapeHtml3(item.ingredient)}</strong>: ${escapeHtml3(item.quantityUsed)} used; ${escapeHtml3(item.referencePack)} at ${money(item.packCost)}${item.estimated ? " estimated" : ""}; ${money(item.valueUsed)} used in ${escapeHtml3(item.usedIn)}.${item.sourceUrl ? ` <a href="${escapeHtml3(item.sourceUrl)}">Price source</a>.` : ""}</li>`).join("")}</ul></section>`).join("");
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml3(item)}</li>`).join("")}</ul>`;
  const faqs = plan.faqs.map((item) => `<h3>${escapeHtml3(item.question)}</h3><p>${escapeHtml3(item.answer)}</p>`).join("");
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FAMILY_DINNERS_FOR_FOUR_DISCLOSURES);
  return `${plan.introduction.map((item) => `<p>${escapeHtml3(item)}</p>`).join("")}<section aria-label="Plan summary"><h2>Plan summary</h2><p>Five dinners, four servings each, 20 servings in total.</p><p>Complete-pack checkout cost: ${money(plan.expectedCheckoutCost)}.</p><p>Estimated ingredient value used: ${money(plan.estimatedIngredientCost)}, or ${money(plan.averageCostPerServing)} per serving.</p></section>${disclosures}<section><h2>The five dinners</h2>${recipes}</section><section><h2>One coordinated shopping basket</h2><p>Pack cost is the full price paid at checkout. Value used estimates the share consumed by this plan.</p>${basket}<p><strong>Totals: pack cost ${money(plan.expectedCheckoutCost)}, value used ${money(plan.estimatedIngredientCost)}.</strong></p></section><section><h2>How the basket is coordinated</h2>${list(plan.coordination)}</section><section><h2>What remains after Friday</h2>${list(plan.remainders)}</section><section><h2>Preparation across the week</h2>${list(plan.preparation)}</section><section><h2>Substitutions</h2>${list(plan.substitutions)}</section><section><h2>How the figures were calculated</h2>${plan.methodology.map((item) => `<p>${escapeHtml3(item)}</p>`).join("")}</section><section><h2>Questions and answers</h2>${faqs}</section><section><h2>Related reading</h2><p><a href="/dinner-plans">Affordable dinner plans</a>, <a href="/dinner-plans/5-dinners-for-2-under-40">five dinners for two under \xA340</a>, <a href="/food-costs/five-dinners-same-ingredients">five dinners using the same ingredients</a>, <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>, <a href="/food-costs/fresh-or-frozen">fresh or frozen ingredients</a>, <a href="/pricing-methodology">pricing methodology</a> and <a href="/recipe-methodology">recipe methodology</a>.</p><p><a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food">Food Standards Agency cooking guidance</a> and <a href="https://www.nhs.uk/healthier-families/recipes/">NHS Healthier Families recipes</a>.</p></section>`;
};
var FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD = {
  id: "five-affordable-family-dinners-for-four",
  slug: FAMILY_DINNERS_FOR_FOUR.slug,
  path: FAMILY_DINNERS_FOR_FOUR_PATH,
  canonicalPath: FAMILY_DINNERS_FOR_FOUR_PATH,
  status: FAMILY_DINNERS_FOR_FOUR.status,
  category: "dinner-plans",
  reviewSensitivity: "price-sensitive",
  title: FAMILY_DINNERS_FOR_FOUR.title,
  seoTitle: FAMILY_DINNERS_FOR_FOUR.seoTitle,
  description: FAMILY_DINNERS_FOR_FOUR.description,
  metaDescription: FAMILY_DINNERS_FOR_FOUR.description,
  label: "Dinner plan",
  publishedAt: FAMILY_DINNERS_FOR_FOUR.publishedAt,
  reviewedAt: FAMILY_DINNERS_FOR_FOUR.reviewedAt,
  nextReviewAt: "2026-10-26",
  editorialOwner: FAMILY_DINNERS_FOR_FOUR.editorialOwner,
  pageFamily: FAMILY_DINNERS_FOR_FOUR.pageFamily,
  primarySearchIntent: FAMILY_DINNERS_FOR_FOUR.primarySearchIntent,
  indexingStatus: FAMILY_DINNERS_FOR_FOUR.indexingStatus,
  contentReviewedAt: FAMILY_DINNERS_FOR_FOUR.contentReviewedAt,
  editorialNotes: "Review Aldi reference prices, product availability, basket rounding and stated substitutions before republishing.",
  internalLinks: [...FAMILY_DINNERS_FOR_FOUR.internalLinks],
  disclosures: [...FAMILY_DINNERS_FOR_FOUR.disclosures],
  disclosureItems: FAMILY_DINNERS_FOR_FOUR_DISCLOSURES_FOR_RECORD,
  disclosureFooter: PROGRAMMATIC_DISCLOSURE_FOOTER,
  breadcrumbRoot: { label: "Affordable dinner plans", url: "/dinner-plans" },
  sources: [
    ...FAMILY_DINNERS_FOR_FOUR.basket.filter((item) => Boolean(item.sourceUrl)).map((item) => ({ label: `Aldi: ${item.referencePack}`, url: item.sourceUrl })),
    { label: "Food Standards Agency cooking guidance", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" },
    { label: "NHS Healthier Families recipes", url: "https://www.nhs.uk/healthier-families/recipes/" }
  ],
  faqs: [...FAMILY_DINNERS_FOR_FOUR.faqs],
  sections: [{ rawHtml: renderFamilyDinnersForFourArticleSections() }],
  cta: {
    title: "Personalise this dinner plan",
    copy: "Use DinnerByDesign to adapt the week around your household size, budget and preferences.",
    label: "Personalise this dinner plan",
    href: "/signin"
  },
  jsonLdGraphItems: [
    {
      "@type": "CollectionPage",
      "@id": `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#page`,
      url: `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}`,
      name: FAMILY_DINNERS_FOR_FOUR.title,
      description: FAMILY_DINNERS_FOR_FOUR.description,
      datePublished: FAMILY_DINNERS_FOR_FOUR.publishedAt,
      dateModified: FAMILY_DINNERS_FOR_FOUR.reviewedAt,
      isPartOf: { "@type": "WebSite", name: "DinnerByDesign", url: "https://dinnerbydesign.app/" },
      mainEntity: { "@id": `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#plan` }
    },
    {
      "@type": "ItemList",
      "@id": `https://dinnerbydesign.app${FAMILY_DINNERS_FOR_FOUR_PATH}#plan`,
      name: FAMILY_DINNERS_FOR_FOUR.shortTitle,
      numberOfItems: FAMILY_DINNERS_FOR_FOUR.recipes.length,
      itemListElement: FAMILY_DINNERS_FOR_FOUR.recipes.map((recipe, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: recipe.title
      }))
    }
  ],
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};
function renderFamilyDinnersForFourInitialHtml() {
  const plan = FAMILY_DINNERS_FOR_FOUR;
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/dinner-plans">Affordable dinner plans</a> / ${escapeHtml3(plan.shortTitle)}</nav><p>Affordable family dinner plan</p><h1>${escapeHtml3(plan.title)}</h1><p>${escapeHtml3(plan.description)}</p><p>By ${escapeHtml3(plan.editorialOwner)} \xB7 Published and reviewed 26 July 2026 \xB7 Prices checked 26 July 2026</p>${renderFamilyDinnersForFourArticleSections()}${renderProgrammaticDisclosureFooterInitialHtml()}<p><a href="/signin">Personalise this dinner plan</a></p></main></div>`;
}

// src/content/nineBudgetDinnersWithSavouryPiesGuide.ts
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH = "/guides/nine-budget-dinners-with-savoury-pies";
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on budget wording", body: "This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen." },
  { key: "storage_and_cooking", title: "Storage and cooking safety", body: "Cool, store, freeze and reheat pies and leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Pastry, dairy, fish, sausages, stock, sauces and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings." }
];
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE = {
  title: "Nine budget dinners with savoury pies",
  seoTitle: "Nine budget dinners with savoury pies | DinnerByDesign",
  description: "Nine savoury pie dinners from established UK recipe sources, with practical ideas for stretching ingredients, using leftovers and choosing budget-friendly toppings.",
  publishedAt: "2026-08-09",
  reviewedAt: "2026-08-09",
  nextReviewAt: "2027-02-09",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using savoury pies",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-09",
  editorialNotes: "Nine source-led savoury pie dinners with adaptations clearly separated from publisher methods.",
  internalLinks: ["/guides", "/recipes", "/guides/9-budget-dinners-with-beef-or-pork-mince", "/guides/9-budget-dinners-with-leftover-roast-chicken", "/guides/nine-budget-dinners-with-potatoes", "/guides/nine-budget-dinners-with-tinned-vegetables", "/guides/seven-ways-to-make-meat-go-further", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Seven veg cottage pie, Tesco Real Food", url: "https://realfood.tesco.com/recipes/seven-veg-cottage-pie.html" },
    { label: "Chip shop fish pie, Tesco Real Food", url: "https://realfood.tesco.com/recipes/chip-shop-fish-pie.html" },
    { label: "Chicken and leek pot pies, Tesco Real Food", url: "https://realfood.tesco.com/recipes/chicken-and-leek-pot-pies.html" },
    { label: "Cowboy pie, Tesco Real Food", url: "https://realfood.tesco.com/recipes/cowboy-pie.html" },
    { label: "Lentil shepherd's pie with garlic and herb mash, Tesco Real Food", url: "https://realfood.tesco.com/recipes/lentil-shepherds-pie-with-garlic-and-herb-mash.html" },
    { label: "Creamy mushroom pot pie, Tesco Real Food", url: "https://realfood.tesco.com/recipes/creamy-mushroom-pot-pie.html" },
    { label: "Melting cheese and onion pie, Olive magazine", url: "https://www.olivemagazine.com/recipes/vegetarian/melting-cheese-and-onion-pie/" },
    { label: "Chicken, tarragon and mushroom pies, Tesco Real Food", url: "https://realfood.tesco.com/recipes/chicken-tarragon-and-mushroom-pies.html" },
    { label: "Corned beef pie, Tesco Real Food", url: "https://realfood.tesco.com/recipes/corned-beef-pie.html" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Can savoury pies help with budget cooking?", answer: "They can, when the filling and topping are chosen carefully. A pie can stretch smaller amounts of meat, fish, vegetables or pulses into a fuller dinner without relying on a large centrepiece ingredient." },
    { question: "Do all savoury pies need pastry?", answer: "No. Mash, sliced potato, puff pastry, shortcrust pastry, filo and crumble-style toppings can all work, depending on the filling and what is already in the kitchen." },
    { question: "Can I freeze savoury pies?", answer: "Some source recipes are marked freezable and some give specific freezing or reheating instructions. Follow the linked publisher guidance for the individual recipe, and use current Food Standards Agency advice for safe storage and reheating." },
    { question: "Are pies always lower cost than other dinners?", answer: "No. The cost depends on the filling, topping, pack sizes and what is already at home. The useful point is that pies give small amounts of protein, vegetables or pulses somewhere practical to go." }
  ]
};
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_SECTIONS = [
  { paragraphs: [
    "A pie is a shape more than a recipe. That is worth remembering when the freezer holds half a bag of mince, two tins of beans and the end of a block of cheese. Wrapped in mash, pastry, filo or a scattering of oats, small amounts of meat, fish, vegetables or pulses go further than they would sitting on a plate on their own.",
    "None of this is about occasion baking or a from-scratch shortcrust every night. It is about treating a pie as a practical dinner format: a way to stretch what is already in, use up odds and ends, and end up with something that still feels like a proper dinner rather than a compromise.",
    "The nine dinners below come from established UK food publishers, each verified and linked. Every one uses a topping that suits a weekday budget: mash, sliced potato, puff or shortcrust pastry, or a simple pastry lid. Where a swap comes directly from the recipe, it is presented as the publisher's own suggestion. Where it does not, it is labelled below as an adaptation rather than something the source recommends."
  ] },
  { title: "1. Cottage pie, stretched with lentils", paragraphs: [
    "Tesco Real Food's seven veg cottage pie takes a single 250g pack of mince and pads it out with tinned green lentils and blitzed chestnut mushrooms, so a small amount of meat covers four dinners rather than two or three. The root vegetable and spinach layers use up whatever is soft in the vegetable drawer, and the soft cheese folded through the mash means a little goes further than a block of butter alone.",
    "The soy sauce and Worcestershire sauce are both listed as optional extras in the recipe itself, so a store cupboard without either is not a barrier. Adaptation, not from the source: any mushroom variety should blitz down in the same way as the chestnut mushrooms specified, if that is what is available.",
    "The recipe carries a freezable tag, so it suits batch cooking: make a double portion and freeze half before baking, or freeze the finished pie in portions for later in the week."
  ] },
  { title: "2. Fish pie topped with frozen chips", paragraphs: [
    "Tesco Real Food's chip shop fish pie swaps the usual mashed potato topping for frozen oven chips, which removes the peeling and boiling stage and uses a bag that is likely already in the freezer. The filling is built from a standard frozen fish pie mix plus a small amount of salmon, bulked out with frozen peas, so there is no need to buy several types of fresh fish.",
    "The recipe itself suggests using white onions or leeks in place of spring onions, adjusting the quantity to suit. A jar of white lasagne sauce stands in for a homemade white sauce, which keeps the method to one dish and limited washing up.",
    "No freezing guidance is given for this particular dish, so it is best treated as a same-week dinner rather than a batch-and-freeze option."
  ] },
  { title: "3. Chicken and leek pot pies", paragraphs: [
    "A single 258g pack of chicken breast fillets is enough for four individual Tesco Real Food chicken and leek pot pies once mixed with a cream and mustard sauce and half a pack of leeks. That keeps the meat cost down while still giving each portion a reasonable amount of filling. Shop-bought ready-rolled pastry means there is no pastry-making stage to build into an evening.",
    "The recipe itself notes that spring onions or white onions can replace the leeks if needed. The recipe carries a freezable tag, though it does not give specific reheating or defrosting guidance beyond that."
  ] },
  { title: "4. Sausage and bean pie", paragraphs: [
    "Tesco Real Food's cowboy pie is built from frozen sausages, two tins of baked beans and frozen mashed potato, so it is close to a store cupboard dinner already. The tinned beans do double duty as both protein and sauce, so there is no separate gravy to make, and the mash topping comes from the freezer rather than a bag of fresh potatoes.",
    "The recipe suggests any hard cheese in place of Cheddar if that is what is available. It does not carry a freezing tag, so it reads as a cook-and-eat dinner rather than one to batch ahead."
  ] },
  { title: "5. Lentil shepherd's pie", paragraphs: [
    "Tesco Real Food's lentil shepherd's pie with garlic and herb mash is a fully meat-free take on shepherd's pie, built from four tins of green lentils, a tin of chopped tomatoes and a vegetable stock pot rather than any mince substitute. It is a useful one for a week where the meat budget is going elsewhere, and the ragu makes considerably more than the pie itself needs.",
    "The recipe's own tip is to set aside half the ragu to use later in a lentil keema curry, effectively turning one cooking session into two separate dinners. Adaptation, not from the source: if the garlic and herb soft cheese specified for the mash is not available, a plain soft cheese with a little crushed garlic stirred through would follow the same principle, though this has not been tested against the recipe."
  ] },
  { title: "6. Vegetable pot pie", paragraphs: [
    "Described by Tesco Real Food as a five-ingredient dinner, creamy mushroom pot pie leans entirely on the freezer and store cupboard: a frozen vegetable base mix, frozen mushrooms, a tin of condensed mushroom soup standing in for a homemade sauce, and ready-rolled puff pastry. A frozen bean and pea mix is served alongside rather than folded in, which keeps the main filling simple.",
    "Because the sauce comes from a tin rather than a roux, there is no butter, flour and stock to balance, and the whole dinner can be built without any fresh vegetables at all if the freezer is better stocked than the fridge."
  ] },
  { title: "7. Cheese, onion and potato pie", paragraphs: [
    "Olive magazine's melting cheese and onion pie is built almost entirely from onions cooked down to a soft puree, with floury potatoes added in slices rather than mashed, so it uses a fairly small amount of cheese for the number of portions it makes. Lancashire cheese is specified alongside a smaller amount of mature Cheddar. Adaptation, not from the source: another crumbly or well-flavoured hard cheese may work on the same principle if Lancashire is not stocked locally, though the recipe itself does not suggest this.",
    "At eight servings from one pie, this is one of the better dinners here for splitting across two evenings or freezing the second half. The recipe gives explicit freezing and reheating instructions: cool completely, then freeze, defrost overnight in the fridge, and reheat until piping hot."
  ] },
  { title: "8. Leftover chicken pie", paragraphs: [
    "Tesco Real Food's chicken, tarragon and mushroom pies are written specifically around leftover roast chicken. The recipe uses 300g of already-cooked meat rather than raw chicken, which is roughly what is left after a Sunday roast for two or three people. Chestnut mushrooms and frozen peas round out the filling, so a modest amount of chicken still fills four individual pie dishes.",
    "This is one of the more direct answers to the question of what to do with a chicken carcass and a bowl of cold meat once the initial roast dinner is done, rather than reheating the same dinner a second time. The freezable tag and full freezing instructions make it suitable for batching: freeze the assembled pies unbaked, or freeze once cooked and reheat from frozen until piping hot."
  ] },
  { title: "9. Corned beef pie", paragraphs: [
    "Tesco Real Food's corned beef pie is built from a single tin of corned beef and leans on a mix of fresh and frozen vegetables to fill it out: onions, leek and carrot in the filling, and frozen peas with sliced Savoy cabbage served alongside. It is still a largely store-cupboard dinner, since the tinned corned beef is doing the main work, but it draws on more of the vegetable drawer and freezer than some of the other dinners here. Ready-rolled shortcrust pastry sits on top rather than a mash lid, which keeps the method to one pan and one baking step.",
    "The recipe itself suggests spring or white onions in place of leek if needed. It is not written with a potato topping. Adaptation, not from the source: for a more traditional corned beef and potato pie, a layer of thinly sliced or diced potato could be added to the filling before the pastry goes on, following the same ordinary logic used in older regional versions of this dish. This is a suggested variation rather than part of the Tesco recipe, and has not been tested against it. This recipe does not carry freezing guidance, so it is best treated as a cook-and-eat dinner."
  ] },
  { title: "Choosing a topping, and not wasting what is left", paragraphs: [
    "The topping is usually the easiest place to adjust a pie to what is actually in the kitchen. Mash suits a fridge with soft or slightly tired potatoes that need using rather than serving whole. Sliced potato works well when there are just one or two left over from another dinner. Pastry, fresh or ready-rolled, is the option that needs the least from the fridge and the most from the freezer or store cupboard. Filo and crumble-style toppings, while not covered in the nine dinners above, are worth keeping in mind for the same reason: they use small amounts of fat and can sit on top of almost any filling below.",
    "None of this makes pies automatically less expensive, healthier or quicker than any other dinner. What it does is give small amounts of protein, vegetables or pulses somewhere useful to go, rather than sitting half-used in the fridge until they are thrown out. Starting from what is already in, rather than a shopping list, is usually where the saving actually comes from."
  ], relatedLink: { label: "Browse the guides library", url: "/guides" } }
];
var NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD = {
  id: "nine-budget-dinners-with-savoury-pies",
  slug: "nine-budget-dinners-with-savoury-pies",
  path: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/minceBudgetDinnersGuide.ts
var MINCE_BUDGET_DINNERS_GUIDE_PATH = "/guides/9-budget-dinners-with-beef-or-pork-mince";
var MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "A note on budget wording",
    body: "This guide does not use live retailer prices or promise a fixed saving. Current pack size, fat percentage, retailer, promotion status and ingredients already at home all affect the final cost."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and reheating",
    body: "Follow product labels, chill leftovers promptly and reheat cooked mince dishes until steaming hot throughout. Rice needs particular care, so follow current Food Standards Agency guidance when cooling and reheating it."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Stock, sauces, pasta, wraps, breadcrumbs, oats, cheese and prepared seasonings vary by product and may contain allergens. Check labels for everyone eating the dinner."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety guidance and editorial claims were reviewed 6 August 2026. Follow the cited Food Standards Agency pages for later updates."
  }
];
var MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than complete recipes. Product prices, pack sizes, ingredients, cooking instructions and allergens vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var MINCE_BUDGET_DINNERS_GUIDE = {
  title: "9 budget dinners with beef or pork mince",
  seoTitle: "9 Budget Dinners With Beef or Pork Mince | DinnerByDesign",
  description: "Nine practical dinner ideas using beef or pork mince, with ways to stretch portions, use up everyday ingredients and keep weeknight cooking simple.",
  publishedAt: "2026-08-06",
  reviewedAt: "2026-08-06",
  nextReviewAt: "2027-08-06",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using beef mince or pork mince",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-06",
  editorialNotes: "One canonical ingredient-led guide with nine distinct mince dinner ideas and one handoff to ordinary DinnerByDesign search.",
  internalLinks: ["/guides", "/recipes", "/food-costs/cooking-with-pulses-on-a-budget", "/food-costs/portion-planning-and-food-waste", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.gov.uk/government/publications/home-food-fact-checker"
    },
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.gov.uk/government/publications/cooking-your-food"
    }
  ]
};
var MINCE_BUDGET_DINNERS_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "Mince is one of the more useful things to keep in, whether it's beef, pork or a mix of the two. It cooks quickly, picks up whatever flavour you're going for, and stretches a long way once it's paired with something starchy or a tin of pulses. Below are nine ways to use it across the week that don't all collapse into the same tomato-and-pasta idea."
    ]
  },
  {
    title: "Mince and bean chilli with rice or baked potatoes",
    paragraphs: [
      "Beef mince holds its shape well under chilli spicing, which is likely why it's the usual choice here, though pork mince works too if that's what you've got in. A tin of kidney beans or black beans adds bulk without adding much to the bill, and the dish is forgiving enough to take whatever vegetables need using up, such as a diced pepper, a grated carrot, or half a bag of frozen sweetcorn. Serve over rice or split between a couple of baked potatoes, with soured cream or grated cheese if there's some in the fridge. Chilli freezes well, so a bigger batch cooked on a Sunday can cover a midweek dinner with little extra effort. Swapping in a drained tin of lentils for part of the mince stretches it further without changing much about how it eats."
    ]
  },
  {
    title: "Pork mince noodles with cabbage, carrot and soy",
    paragraphs: [
      "Pork mince suits this one because it cooks fast and takes on soy, ginger and garlic without much persuasion. Shredded cabbage and grated carrot bulk the dish out at low cost and add a bit of crunch, and frozen stir-fry vegetables are a fair substitute when fresh ones aren't to hand. Straight noodles or rice noodles both work, and this is a dinner that's genuinely quicker to cook than a takeaway is to arrive. Leftovers reheat reasonably well in a pan with a splash of water, though the noodles will soften further. Beef mince can stand in if pork isn't available, though the flavour leans a little richer."
    ]
  },
  {
    title: "Cottage pie with extra lentils or frozen mixed veg",
    paragraphs: [
      "Beef mince is the traditional choice for cottage pie. A beef-pork mix can work when you want the filling to stretch further. Stirring in a tin of green lentils or a bag of frozen mixed vegetables stretches it considerably more and doesn't stand out once it's under the mash. This is a good batch-cooking candidate: the filling freezes on its own, or the whole assembled pie can go in the freezer before baking. A simpler mash on top, roughly mashed rather than whipped smooth, still does the job."
    ]
  },
  {
    title: "Mince pasta bake with tomato sauce and grated cheese",
    paragraphs: [
      "This is the dish most people already associate with mince, so the aim here is to make it stretch rather than reinvent it. A tin of chopped tomatoes, a squeeze of tomato puree and a grated carrot or courgette bulk the sauce without much fuss, and dried pasta shapes such as penne or fusilli hold sauce better than spaghetti in a bake. Topping with grated cheese and a short spell under the grill gives a bit of texture without much extra spend. Any leftover sauce freezes well on its own, separate from the pasta, which keeps it more useful later on."
    ]
  },
  {
    title: "Beef mince tacos or wraps with beans and salad",
    paragraphs: [
      "Beef mince browned with a basic spice mix of cumin, paprika and a little chilli powder covers most of what a shop-bought taco seasoning does. A tin of black beans, refried or otherwise, makes the filling more substantial, and shredded lettuce, a chopped tomato or a spoon of salsa rounds it out. Wraps or hard shells both work, and this is one of the quicker dinners on this list from fridge to table. Leftover filling keeps for a day or two and works equally well spooned over rice the next night rather than reheated in a wrap."
    ]
  },
  {
    title: "Pork mince meatballs with pasta or mash",
    paragraphs: [
      "Pork mince makes a softer, slightly fattier meatball than beef, which is usually an advantage rather than a drawback here. Mixing in a handful of oats or breadcrumbs and a beaten egg helps them hold together and quietly increases the yield. They sit well in a tomato sauce over pasta, or alongside mash and a green vegetable for something closer to a Sunday-dinner feel. Meatballs freeze cleanly either raw or cooked, so doubling the mixture and freezing half is a reasonable use of the extra ten minutes it takes to roll them."
    ]
  },
  {
    title: "Mince and potato hash with a fried egg",
    paragraphs: [
      "This one is closer to a fridge-clearing dinner than a planned one, and that's part of its appeal. Diced potato, browned mince and an onion cooked down together in one pan make a filling dish without much washing-up, and a fried egg on top turns it into something that feels more finished than it is. Frozen diced onion or ready-diced potato can save a bit of time on a weeknight. Either beef or pork mince works, and leftover roast potatoes are a reasonable substitute for raw diced ones if there are some going spare."
    ]
  },
  {
    title: "Stuffed peppers with mince, rice and tomato",
    paragraphs: [
      "Peppers vary in price through the year, so this is one to use when peppers are good value rather than a weekly staple, but it stretches mince well when they are. Cooked rice mixed with browned mince, a little tomato and some herbs fills the halved peppers, which then bake until soft. A tin of chopped tomatoes poured around the peppers in the dish doubles as a light sauce. This dinner also works with courgettes halved lengthways if peppers are pricier that week, and any extra filling freezes on its own for using another way later."
    ]
  },
  {
    title: "Mince ragu stretched with lentils, mushrooms or grated carrot",
    paragraphs: [
      "A ragu built slowly with a tin of tomatoes, a splash of stock and a good hour on a low heat gets more flavour out of a modest amount of mince than a quick fry ever will. Mushrooms, finely chopped, add a savoury depth that appears to make the mince go further without anyone missing the extra meat, and grated carrot or a tin of green lentils does something similar for texture and bulk. This is a good dinner to cook in a larger batch, since ragu tends to taste better the next day and freezes well in portions. Beef mince is the more traditional choice, though pork works fine if that's what's in."
    ]
  },
  {
    title: "A note on cost",
    paragraphs: [
      "Beef mince, pork mince and mixed mince can move around in price depending on the shop, the fat percentage, the pack size and what's on promotion. It is worth checking the current pack and unit prices rather than building a whole dinner plan around a fixed rule. Where a specific saving is mentioned elsewhere on the site, it will be dated and tied to a particular price check rather than presented as a permanent figure."
    ]
  }
];
var MINCE_BUDGET_DINNERS_GUIDE_FAQS = [
  {
    question: "Can I use beef and pork mince in the same dinners?",
    answer: "Often, yes. Beef mince usually gives a deeper flavour, while pork mince can be softer and slightly richer. The swap works best in chilli, noodles, meatballs, hash and ragu. For cottage pie, beef is the more traditional choice."
  },
  {
    question: "How do I make mince stretch further?",
    answer: "Pair it with beans, lentils, rice, pasta, potatoes or vegetables that need using up. The mince then seasons the whole dinner instead of sitting as the only main ingredient on the plate."
  },
  {
    question: "Can cooked mince dishes be frozen?",
    answer: "Many cooked mince dishes freeze well, including chilli, ragu, meatballs and cottage pie filling. Cool them promptly, freeze in useful portions and reheat until steaming hot all the way through."
  },
  {
    question: "Are these full recipes?",
    answer: "No. These are flexible dinner ideas to help you decide what to cook. Use DinnerByDesign search when you want recipes matched to your time, budget and preferences."
  }
];
var MINCE_BUDGET_DINNERS_GUIDE_RECORD = {
  id: "9-budget-dinners-with-beef-or-pork-mince",
  slug: "9-budget-dinners-with-beef-or-pork-mince",
  path: MINCE_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: MINCE_BUDGET_DINNERS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...MINCE_BUDGET_DINNERS_GUIDE,
  metaDescription: MINCE_BUDGET_DINNERS_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: MINCE_BUDGET_DINNERS_GUIDE_SECTIONS,
  faqs: MINCE_BUDGET_DINNERS_GUIDE_FAQS,
  cta: {
    title: "Find mince recipes for dinner",
    copy: "Search DinnerByDesign for beef or pork mince recipes that suit your time, budget and preferences.",
    label: "Find mince recipes",
    href: "/signin"
  }
};

// src/content/nineBudgetDinnersThreeCuisinesGuide.ts
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH = "/guides/nine-budget-dinners-three-cuisines";
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "About these estimates",
    body: "Guide prices are estimates based on named Tesco products and pack sizes checked online on 6 August 2026. They cover the main ingredients only and use the stated serving assumptions. Retailer, regional and availability differences, offers, pack sizes and ingredients already at home change the result."
  },
  {
    key: "price_comparison",
    title: "How to read the price examples",
    body: "The per-serving figures are guide calculations, not fixed costs or a ranking of the three cuisines. They distinguish the value of the ingredients used from the packs you may need to buy, and exclude oil and salt assumed to be in the cupboard."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Figures are based on four servings unless the dinner fact line says otherwise. Rice served alongside the dal and bean chilli is assumed at 75g dry rice per person; bread and other sides are included only where stated."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and reheating",
    body: "Follow current Food Standards Agency guidance when cooling, storing and reheating cooked rice and other leftovers. Rice needs particularly prompt cooling and should be reheated only once until steaming hot throughout."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Tortillas, flatbreads, stock, spices, curry powder, garam masala, eggs and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner."
  },
  {
    key: "source_timing",
    title: "Price and guidance review",
    body: "The Tesco price examples and Food Standards Agency guidance were checked on 6 August 2026. Prices, availability and official guidance can change, so follow the cited sources for later information."
  }
];
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than complete recipes. Product prices, pack sizes, ingredients, cooking instructions, storage advice and allergens vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE = {
  title: "Nine budget dinners from three cuisines: Indian, Mexican and Egyptian",
  seoTitle: "Nine budget dinners from three cuisines: Indian, Mexican and Egyptian | DinnerByDesign",
  description: "Nine varied budget dinners inspired by Indian, Mexican and Egyptian cooking, using overlapping ingredients and practical UK supermarket substitutions.",
  publishedAt: "2026-08-06",
  reviewedAt: "2026-08-06",
  nextReviewAt: "2026-09-06",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find varied budget dinner ideas inspired by Indian, Mexican and Egyptian cooking",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-06",
  editorialNotes: "One canonical guide showing how an overlapping shopping list can produce varied dinners inspired by three cuisines, with transparent Tesco guide prices and food-safety guidance.",
  internalLinks: ["/guides", "/recipes", "/food-costs/cooking-with-pulses-on-a-budget", "/food-costs/portion-planning-and-food-waste", "/food-costs/five-dinners-same-ingredients", "/pricing-methodology", "/food-safety", "/signin"],
  disclosures: ["price_estimate", "price_comparison", "serving_assumption", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food"
    },
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.food.gov.uk/safety-hygiene/home-food-fact-checker"
    }
  ],
  faqs: [
    {
      question: "Can budget cooking still produce varied dinners?",
      answer: "Yes. The nine examples use overlapping ingredients but change the spice mix, texture and way the dinner is served. Dal, tacos, ful medames and koshari do not eat alike even when they share onions, pulses, rice or tomatoes."
    },
    {
      question: "What ingredients are used most often?",
      answer: "Onions and garlic form the base of nearly all nine dinners. Tinned tomatoes, rice, pulses, potatoes, eggs and a small group of spices also recur across the list."
    },
    {
      question: "Are these traditional versions of the dishes?",
      answer: "No. They are home-style or inspired adaptations for a UK cupboard. The guide identifies where a substitution or simplified method changes the dish rather than presenting it as a definitive version."
    },
    {
      question: "How should cooked rice be stored?",
      answer: "Cool cooked rice as quickly as possible, ideally within one hour, then cover and refrigerate it. Use it within 24 hours, reheat it only once and make sure it is steaming hot throughout before serving."
    },
    {
      question: "Do the price figures include every ingredient?",
      answer: "They cover the main ingredients listed for each dinner. Oil and salt are assumed to be in the cupboard, while rice, bread and tortillas are included only where the dinner fact line says so. The named products and price-check date are set out in the costing methodology."
    }
  ]
};
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "Keeping food costs down does not have to mean eating the same few dishes on repeat. An overlapping shopping list of tinned pulses, rice, potatoes, eggs, vegetables and a handful of everyday spices can still produce dinners that taste genuinely different across the week. This guide sets out nine such dinners: three home-style Indian dinners, three Mexican-inspired dinners and three Egyptian-inspired dinners, built from ingredients most UK supermarkets already stock. None is presented as the definitive version of a national dish. Each is adapted for a UK cupboard, with substitutions suggested where an ingredient may be harder to find and the adaptation explained in the text.",
      "The aim is variety without a long shopping list. Onions, garlic, tinned tomatoes, tinned pulses, rice, eggs and a small spice collection cover most of what follows. The section on making these ingredients go further sets out what a full run of all nine actually uses, and what that means for the packs you would need to buy."
    ]
  },
  {
    title: "Cuisines",
    paragraphs: []
  },
  {
    title: "Budget Indian dinners",
    paragraphs: ["Three dinners built on lentils, chickpeas and vegetables, spiced simply rather than from a long ingredient list."]
  },
  {
    title: "1. Home-style dal with rice or flatbreads",
    paragraphs: [
      "Serves 4 \xB7 about 35 minutes \xB7 around 35p per serving before rice or bread",
      "200g red split lentils, 1 onion, 2 garlic cloves, thumb-sized piece of ginger, \xBD x 400g tin tomatoes, 1 tsp each cumin and turmeric",
      "To cook: soften the onion and garlic in a little oil over a medium hob heat for 3 to 4 minutes, stir in the ginger, cumin and turmeric for a minute, then add the lentils and tomatoes with about 600ml water. Simmer uncovered for 20 to 25 minutes, stirring occasionally, until the lentils have broken down and the dal is thick enough to coat the back of a spoon.",
      "This is a simple dal, red split lentils simmered until soft with onion, garlic and a little grated or frozen ginger. Dal has many regional variations, and this one uses a single lentil rather than a mix. Yellow split peas can be used instead of red lentils, and jarred or frozen chopped ginger and garlic are practical swaps for fresh. The dal can be made a day ahead, since the flavour rounds out overnight, and it freezes well in portions for a couple of months. Extra dal makes a good base for a vegetable soup, or can be stirred through cooked rice for a quick second dinner."
    ]
  },
  {
    title: "2. Chana masala with rice or flatbreads",
    paragraphs: [
      "Serves 4 \xB7 about 30 minutes \xB7 around 35p per serving before rice or bread",
      "2 x 400g tins chickpeas, drained, 1 onion, 2 garlic cloves, 400g tin tomatoes, 1 tsp each cumin and ground coriander, 1 tsp garam masala or curry powder",
      "To cook: fry the onion and garlic in oil over a medium hob heat until soft, about 5 minutes, then add the spices and cook for a further minute. Stir in the tomatoes and chickpeas with a splash of water and simmer for 15 to 20 minutes, until the sauce has thickened and coats the chickpeas rather than pooling around them.",
      "Chana masala is a home-style chickpea curry from North India, with tinned chickpeas simmered in a spiced onion and tomato sauce until they take on the flavour. Tinned butter beans can be used in place of chickpeas, and shop-bought curry powder covers most of what garam masala adds if it is not already in the cupboard, though the result tends to read as flatter rather than equivalent. The tomato and onion base can be made ahead and the chickpeas stirred in when reheating. The finished dish freezes well. Keep unfrozen leftovers in the fridge and eat within 48 hours. Leftovers are good spooned into a wrap or over a jacket potato, rather than served the same way twice."
    ]
  },
  {
    title: "3. Aloo gobi-inspired potato and vegetable dish",
    paragraphs: [
      "Serves 4 \xB7 about 35 minutes \xB7 around 45p per serving, using a whole cauliflower",
      "600g potatoes, 1 cauliflower (or 450g frozen cauliflower florets), 1 onion, 2 garlic cloves, 1 tsp turmeric, 1 tsp cumin or mustard seed",
      "To cook: fry the onion and garlic in oil over a medium hob heat for 3 to 4 minutes, stir in the turmeric and cumin or mustard seed, then add the potato and cauliflower with a small splash of water. Cover and cook for 20 to 25 minutes, stirring occasionally, until the potato is tender when tested with a knife and lightly golden at the edges.",
      "A simplified take on aloo gobi, diced potato and cauliflower cooked slowly with turmeric and cumin, or mustard seed if there is some in, until tender. Frozen cauliflower florets work as well as fresh here, and any other vegetable that needs using up, such as peas or green beans, can go in alongside. The potato can be parboiled in advance to shorten the final cooking time. Unlike the other two Indian dinners here, this one suits the fridge better than the freezer, since potato can turn watery once frozen and thawed, but it reheats well if eaten within 48 hours. Any extra is a useful base to bulk out with a tin of chickpeas for a slightly different dinner later in the week."
    ]
  },
  {
    title: "Budget Mexican-inspired dinners",
    paragraphs: ["Three dinners that lean on tinned beans, potatoes and eggs, spiced with cumin, paprika and chilli rather than a long list of specialist ingredients."]
  },
  {
    title: "4. Bean chilli with rice",
    paragraphs: [
      "Serves 4 \xB7 about 35 minutes \xB7 around 35p per serving with kidney beans, or around 40p with black beans, before rice",
      "2 x 400g tins kidney or black beans, drained, 1 onion, 2 garlic cloves, 400g tin tomatoes, 1 tsp cumin, 1 tsp paprika, \xBD tsp chilli powder",
      "To cook: fry the onion and garlic in oil over a medium hob heat until soft, about 5 minutes, stir in the spices for a minute, then add the tomatoes and beans. Simmer uncovered for 20 to 25 minutes, until the sauce has thickened and reduced by about a third.",
      "A home-style bean chilli, tinned kidney or black beans simmered in a warmly spiced tomato sauce with onion and garlic. Any tinned bean works here, and a spoonful of smoked paprika is a good addition if it is to hand. The chilli freezes and reheats very well, and the spicing tends to settle and round out if it is left overnight and reheated the next day. Refrigerate and use within 48 hours if it is not being frozen. Leftovers are just as good over a baked potato or spooned into a tortilla as a taco filling, rather than reheated exactly the same way twice."
    ]
  },
  {
    title: "5. Potato and bean tacos",
    paragraphs: [
      "Serves 4, two tacos each \xB7 about 35 minutes \xB7 around 45p per serving, tortillas included",
      "500g potatoes, 400g tin kidney beans, drained, 1 onion, 1 tsp cumin, 1 tsp paprika, 8 tortillas",
      "To cook: soften the diced onion in oil over a medium hob heat for 3 to 4 minutes, then add the diced potato and fry over medium-high heat for 12 to 15 minutes, turning occasionally, until golden and cooked through. Stir in the spices and beans for a final 2 to 3 minutes to warm through. Warm the tortillas in a dry pan or a low oven for a couple of minutes before filling.",
      "Diced potato, onion and tinned beans, fried until golden and spiced with cumin and paprika, folded into warmed tortillas with whatever salad or salsa is to hand. A soft flatbread can be used instead of a tortilla, and any tinned bean can replace the kidney beans specified, though black beans cost a little more per tin than kidney beans do. The potato and bean filling can be cooked in advance and reheated in a dry pan before serving, which makes this a sensible option for a night with limited time. Extra filling is just as good spooned over rice or piled onto a jacket potato as it is folded into another tortilla."
    ]
  },
  {
    title: "6. Mexican-style eggs with beans and tortillas",
    paragraphs: [
      "Serves 4 \xB7 about 25 minutes \xB7 around 70p per serving, tortillas included",
      "4 eggs, 400g tin tomatoes, 400g tin black beans, drained, 1 onion, 2 garlic cloves, 1 tsp cumin, 8 tortillas",
      "To cook: simmer the onion, garlic, tomatoes, cumin and beans in a pan over a medium hob heat for 10 to 12 minutes, until thickened, then set aside and keep warm. Fry or gently poach the eggs separately until the white is set and the yolk is still soft, then build each plate on a warmed tortilla.",
      "A stove-top take on huevos rancheros, with a fried egg on a tortilla and sauce spooned over rather than the egg poached directly in the sauce, which is closer to how the dish is commonly served than a fully poached version would be. Chilli flakes can replace fresh chilli, and any tinned bean can be used in place of black beans. The bean and tomato base can be made in advance and kept in the fridge for up to 48 hours, with the eggs cooked fresh when reheating, since eggs are best cooked just before serving rather than reheated from cold. This sits among the pricier dinners here, since eggs and a full pack of tortillas both go into the cost, but any leftover sauce on its own freezes well and can be reheated with fresh eggs added on another night."
    ]
  },
  {
    title: "Budget Egyptian-inspired dinners",
    paragraphs: ["Three dinners that draw on tinned pulses, rice and eggs, common ingredients in Egyptian home cooking and easy to adapt for a UK cupboard."]
  },
  {
    title: "7. Ful medames with bread and salad",
    paragraphs: [
      "Serves 4 \xB7 about 20 minutes \xB7 around 60p per serving before bread",
      "2 x 300g tins broad (fava) beans, drained, 2 garlic cloves, \xBD lemon, 1 tsp cumin, olive oil, 1 salad tomato and \xBC cucumber, sliced",
      "To cook: warm the beans through in a pan over a low to medium hob heat for 5 to 8 minutes, then drain, keeping a little of the liquid back. Roughly mash with a fork, garlic, lemon juice, cumin and olive oil, loosening with the reserved liquid if it seems dry.",
      "A practical version of ful medames, a widely eaten Egyptian dish of stewed fava beans, mashed with garlic, lemon juice, cumin and a little olive oil, served with flatbread and a simple tomato and cucumber salad. Fava beans cost more per tin than most other tinned pulses in this guide, which is most of why this dinner is pricier than the others despite the short ingredient list. Tinned butter beans are a workable alternative where fava beans are harder to find, and bottled lemon juice can be used instead of fresh, though both move the dish away from the version most commonly eaten in Egypt rather than standing in for it exactly. The mash keeps for up to two days in the fridge, covered, and the flavour holds up well over that time, so it is a sensible thing to make slightly ahead. Extra ful is good the next day as a sandwich filling or spread over a jacket potato."
    ]
  },
  {
    title: "8. Koshari-inspired rice, lentils and pasta",
    paragraphs: [
      "Serves 4 \xB7 about 45 minutes \xB7 around 45p per serving",
      "150g rice, 100g brown or red lentils, 100g small pasta, 400g tin chickpeas, drained, 400g tin tomatoes, 1 onion, 2 garlic cloves, 1 tsp cumin, splash of vinegar",
      "To cook: cook the rice, lentils and pasta separately until tender, following pack instructions for the rice and pasta and allowing about 20 to 25 minutes for brown or red lentils. Meanwhile, fry the onion and garlic in oil over a medium hob heat, add the tomatoes, cumin and a splash of vinegar, and simmer for 10 minutes to make the sauce, stirring the chickpeas through it for the final few minutes to warm through. Layer the rice, lentils, pasta and chickpea sauce in a bowl to serve.",
      "Koshari is a well-known Egyptian dish combining rice, lentils, pasta and chickpeas, served with a spiced, vinegar-sharpened tomato sauce. Chickpeas are a standard part of koshari rather than an optional extra, so this version keeps them in rather than treating them as a stretch ingredient. Red split lentils cook faster than the brown or green lentils used traditionally and can stand in for them, though they break down more readily and change the texture of the finished dish rather than replicating it. The rice, lentils, pasta and chickpeas can each be cooked ahead and combined just before serving, which spreads the cooking out over less rushed pockets of time, and this is one of the better dinners here for making in a larger batch. Because it contains rice, leftovers should follow the rice guidance below: cool them quickly, refrigerate and eat within 24 hours, reheating only once, with an extra spoonful of the tomato sauce to loosen everything back up."
    ]
  },
  {
    title: "9. Egyptian-inspired tomato and pepper eggs",
    paragraphs: [
      "Serves 4 \xB7 about 20 minutes \xB7 around 70p per serving before bread",
      "4 eggs, 400g tin tomatoes, 2 peppers (or 300g frozen sliced peppers), 1 onion, 2 garlic cloves, 1 tsp cumin, 1 tsp paprika",
      "To cook: soften the onion, garlic and peppers in oil over a medium hob heat for 6 to 8 minutes, add the tomatoes and spices, and simmer for 10 minutes until slightly reduced. Make small wells in the sauce, crack in the eggs, cover the pan and cook for 5 to 8 minutes until the whites are set and the yolks are as firm as you prefer.",
      "Eggs cooked into a spiced tomato and pepper sauce until just set, in a style found across Egyptian home cooking as well as elsewhere in the region, served with bread for mopping up the sauce. This version adds peppers, which are not always part of simpler Egyptian tomato and egg dishes, so it sits closer to a shared regional style than to one specific traditional recipe. A bag of frozen sliced peppers can be used instead of fresh, and chilli flakes stand in for fresh chilli if extra heat is wanted. The tomato and pepper sauce can be made ahead and kept in the fridge for up to 48 hours, with the eggs added fresh when it is reheated. Any leftover sauce on its own freezes well, ready for eggs to be added on a night when there is little time to cook from scratch."
    ]
  },
  {
    title: "A note on rice and leftovers",
    paragraphs: [
      "Two of these dinners, the dal and the bean chilli, are often served with rice, and rice is a central part of the koshari itself. The Food Standards Agency's food safety guidance covers rice specifically, separately from its general advice on leftovers: cool cooked rice as quickly as possible, ideally within one hour, then cover it, refrigerate it and use it within 24 hours. Rice should only be reheated once and should be steaming hot throughout before serving. Other leftovers should be cooled and refrigerated within two hours, eaten within 48 hours or frozen. Rice needs closer attention to cooling time than most other leftovers, which is why the guidance treats it separately.",
      "Sources: Food Standards Agency, Cooking your food, and the rice guidance in the Home food fact checker."
    ]
  },
  {
    title: "Making budget ingredients go further",
    paragraphs: [
      "A handful of ingredients turn up again and again across these nine dinners. Onions and garlic form the base of nearly all of them. Tinned tomatoes appear in six of the nine, in full or half tins. Rice supports the dal, the bean chilli and the koshari. Pulses, tinned or dried, give bulk and protein to seven of the nine: tinned chickpeas or beans in six of them, and dried red split lentils in two. Eggs cover two of the dishes, and flatbreads or tortillas turn up wherever a dinner is designed for scooping or wrapping rather than eating with a fork.",
      "Across the nine dinners, the ingredients actually used add up to 8 onions, 16 garlic cloves, 5\xBD tins of tomatoes, 3 tins of chickpeas, 4 tins of kidney or black beans, 2 tins of broad (fava) beans, 300g dried red split lentils, 1.1kg potatoes, 8 eggs, 16 tortillas, 1 cauliflower, 2 peppers and 100g small pasta. Buying to that exactly is not realistic, since tins, packs and loose vegetables come in fixed sizes, so the shopping list runs a little ahead of what gets used:",
      "6 x 400g tins tomatoes, to cover 5\xBD used (a half tin left over)\n3 x 400g tins chickpeas and 4 x 400g tins kidney or black beans (2 for the bean chilli, 1 for the tacos, 1 for the eggs), bought exactly to the tin\n2 x 300g tins broad (fava) beans for the ful medames, bought exactly to the tin\n1 x 500g pack dried red split lentils, to cover 300g used across the dal and the koshari\n2 garlic bulbs, to cover 16 cloves needed (roughly 2 cloves spare)\n1 x 2kg pack potatoes, to cover 1.1kg used\n2 x 6-packs eggs, to cover 8 used (4 spare)\n2 x 8-packs tortillas, used exactly\n1 cauliflower, 1 x 3-pack peppers (1 spare), 1 x 500g pack small pasta (400g spare)",
      "Rice and bread are not included in the per-serving figures above except where stated. Where the dal and the bean chilli are served with rice, this guide assumes a standard 75g dry rice per person, or 300g for four servings; across those two dinners plus the 150g used directly in the koshari, that comes to 750g of rice, from a single 1kg pack. Flatbread, naan or pitta served alongside the dal, the ful medames or the Egyptian-inspired eggs is costed separately by whatever bread is chosen, and is not included above.",
      "On seasoning, cumin does more work across this list than anything else, appearing in some form in all three cuisines. A basic set of ground cumin, ground coriander, paprika and chilli powder or flakes covers most of what these nine dinners need, and none of them assumes a full spice cupboard is already sitting in the kitchen. Garam masala adds something distinct to the chana masala, but shop-bought curry powder is a practical stand-in, and smoked paprika is worth adding to the bean chilli if it is to hand rather than something the recipe already assumes."
    ]
  },
  {
    title: "Costing methodology",
    paragraphs: [
      "Guide prices are named against a specific Tesco product and pack, checked online on 6 August 2026. Where the lowest-priced widely available line was out of stock at the time of checking, the next lowest-priced in-stock line is used instead.",
      "Tesco Red Split Lentils 500G: \xA32.10 (\xA34.20/kg)\nGrower's Harvest Long Grain Rice 1Kg: \xA30.52 (\xA30.52/kg)\nGrower's Harvest Chopped Tomatoes 400G: \xA30.43\nTesco Chickpeas In Water 400G: \xA30.41\nGrower's Harvest Red Kidney Beans In Water 400G: \xA30.33\nTesco Black Beans 400G: \xA30.46\nTesco Broad Beans In Water 300G: \xA30.90\nTesco 6 Mixed Weight Barn Eggs 268g: \xA31.00\nH.W. Nevills Plain White Tortilla Wraps 8 Pack: \xA30.99\nTesco All Rounder Potatoes 2Kg: \xA31.32 (\xA30.66/kg)\nTesco Cauliflower Each: \xA31.15\nTesco Sweet Peppers 500G (3-pack): \xA32.10, around 70p per pepper\nTesco Fusilli Pasta 500G: \xA30.75 (\xA31.50/kg)\nTesco Brown Onions Loose: \xA30.99/kg, around 15p per onion\nTesco Large Garlic (1 bulb, around 9 cloves): \xA30.40, around 9p for 2 cloves\nTesco Whole Cucumber Each: \xA30.89\nTesco Lemon Each: \xA30.37\nTesco Root Ginger Loose: \xA35.50/kg, around 14p for a thumb-sized piece\nTesco Classic Round Tomatoes 6 Pack: \xA30.99, around 16p per tomato",
      "A splash of vinegar in the koshari, from a bottle otherwise kept in the cupboard, works out at under 1p and is not itemised separately. Figures are per serving, based on four servings per dish unless the fact line says otherwise, and cover the main ingredients only. Oil and salt are assumed to already be in the cupboard and are not costed. Rice, bread or tortillas served alongside a dinner are included in the figure only where the fact line says so, and the rice assumption is set out above. Prices vary by retailer, pack size, offers and stock availability, so these are guide figures rather than a fixed cost, and are worth rechecking close to publication."
    ]
  },
  {
    title: "How the nine dinners compare",
    paragraphs: [
      "Despite the overlap in ingredients, these nine dinners do not taste or eat alike. The dal is soft and mellow, built for spooning over rice. The chana masala and the aloo gobi-inspired dish both lean toward warming spice, one saucy and one drier, with the potato dish holding its shape rather than breaking down. The bean chilli is warmly spiced and thick, closer in texture to a stew, while the potato and bean tacos are designed for eating with the hands, and the Mexican-style eggs sit somewhere between the two, a fried egg and a spooned sauce meant to be scooped up with tortilla rather than piled onto a plate. The ful medames is mashed and spreadable, eaten cool or just warm rather than hot from the pan, koshari is a layered, textured dish that mixes soft rice and lentils with bite from the pasta and chickpeas, and the Egyptian-inspired eggs are closer in style to the Mexican version but carry a different balance of spice, leaning on pepper and cumin rather than chilli heat."
    ]
  }
];
var NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_RECORD = {
  id: "nine-budget-dinners-three-cuisines",
  slug: "nine-budget-dinners-three-cuisines",
  path: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "price-sensitive",
  ...NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/sausageWaysGuide.ts
var SAUSAGE_WAYS_GUIDE_PATH = "/guides/9-ways-with-sausages";
var SAUSAGE_WAYS_GUIDE = {
  title: "9 ways with sausages for easy everyday dinners",
  seoTitle: "9 easy ways with sausages for everyday dinners | DinnerByDesign",
  description: "Nine practical ways to turn a pack of sausages into varied, affordable dinners, from traybakes and pasta to flatbreads, fried rice and hash.",
  publishedAt: "2026-07-25",
  reviewedAt: "2026-07-25",
  nextReviewAt: "2027-07-25",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find simple and varied everyday dinner ideas using sausages",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-25",
  editorialNotes: "One canonical inspiration guide with nine distinct ideas and one handoff to ordinary DinnerByDesign search.",
  internalLinks: ["/guides", "/guides/how-to-build-a-traybake", "/food-costs/cooking-with-pulses-on-a-budget", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Tesco Groceries: Tesco British Pork Sausages 8 Pack 454G",
      url: "https://www.tesco.com/shop/en-GB/products/261879050"
    },
    {
      label: "Tesco Groceries: Tesco Finest 6 Pork Sausages 400G",
      url: "https://www.tesco.com/shop/en-GB/products/280002982"
    },
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.gov.uk/government/publications/home-food-fact-checker"
    },
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.gov.uk/government/publications/cooking-your-food"
    }
  ]
};
var SAUSAGE_WAYS_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "There's a pack of sausages in the fridge, and nobody's especially keen on the usual sausage and mash again. It's easy to see why sausages end up there in the first place: they're straightforward to cook, widely liked, and a reasonable thing to reach for when there isn't much time or inspiration to spare. The trouble is that the same pack tends to become the same dinner, on repeat, until it doesn't feel worth buying again.",
      "The usual dinner isn't the only option, though. Sausages don't have to be cooked and served whole. Sliced, crumbled out of their skins, or roasted alongside other ingredients, the same pack can point in genuinely different directions. Most of the ideas below work with pork, chicken or vegetarian sausages, though cooking times and a few of the techniques will vary, so it's worth checking the pack."
    ]
  },
  {
    title: "Sausage, apple and mustard traybake",
    paragraphs: [
      "Everything goes on one tray: wedges of potato, red onion and eating apple, with a spoonful of mustard stirred through the oil before it all goes in. The apple softens and turns slightly sweet as it roasts, which sits well against the mustard and the sausages' own seasoning. Once the tray's in the oven there's very little else to do until it comes out, which makes this one of the more hands-off ideas here for a weeknight."
    ]
  },
  {
    title: "Sausage and tomato pasta",
    paragraphs: [
      "Take the meat out of the skins and break it into a tomato sauce, the way you might with mince. Sausages are already seasoned with herbs and spices, so this style of sauce usually needs less extra seasoning than a plain mince ragu would. Four or five sausages, broken up this way, will comfortably sauce a pack of pasta for several people, which is useful to know if the fridge only has a partly used pack to work with."
    ]
  },
  {
    title: "Sausage, bean and vegetable stew",
    paragraphs: [
      "Sliced or whole sausages simmer in a stew with tinned beans, tinned tomatoes and whatever vegetables need using up, fresh or frozen. The beans and vegetables carry a good share of the dish, so a modest number of sausages stretches further here than it would served on its own. It suits a stocked cupboard and a half-empty vegetable drawer particularly well."
    ]
  },
  {
    title: "Sausage fried rice",
    paragraphs: [
      "Slice cooked sausages and stir them through leftover rice with frozen peas, sweetcorn or whatever vegetables are around, plus a beaten egg stirred through towards the end. This one only works safely with rice that's been cooled and stored properly; see the food safety note below for what that involves."
    ]
  },
  {
    title: "Sausage and lentil casserole",
    paragraphs: [
      "Red lentils are the easiest choice because they soften into the sauce and help thicken it. Green or brown lentils work too, but they keep their shape and usually take longer. Either way, lentils make a smaller number of sausages go further while keeping the dinner filling."
    ]
  },
  {
    title: "Sausage flatbreads",
    paragraphs: [
      "Cooked sausages, sliced or split open, sit in a warmed flatbread with salad, a spoonful of yoghurt and something with a bit of sharpness: pickled onion, chopped herbs or a squeeze of lemon all work. This is a fresher way to eat sausages than most of the other ideas here, and a useful one when the rest of the fridge doesn't offer much beyond salad and yoghurt."
    ]
  },
  {
    title: "Sausage and pepper frittata",
    paragraphs: [
      "Leftover cooked sausages, sliced, go into a frittata with peppers and any small amounts of vegetables that aren't quite enough on their own for anything else. It's a good use for both a couple of leftover sausages and the odd half pepper or handful of spinach sitting in the fridge, and it works just as well served warm as it does cold the next day, which suits a packed lunch."
    ]
  },
  {
    title: "Sausage meatballs",
    paragraphs: [
      "Take the meat out of the skins, roll it into balls and cook them in a tomato sauce rather than serving the sausages whole. Because the meat is already seasoned, there's usually little need to add much beyond what's already in the sausage, which saves a step compared with making meatballs from plain mince and taste-testing the seasoning as you go."
    ]
  },
  {
    title: "Sausage and potato hash",
    paragraphs: [
      "A pan of diced potato, onion and sliced sausage, fried until the potato is properly browned and any other vegetables that need using are worked in. It uses up both leftover cooked sausages and the last of a bag of potatoes without much fuss, and holds up well finished with a fried egg on top."
    ]
  },
  {
    title: "Making a pack go further",
    paragraphs: [
      "Sausages vary a good deal in price depending on meat content, brand and pack size, so it isn't accurate to call them cheap as a rule. As one example, checked on Tesco's website on 25 July 2026, Tesco British Pork Sausages 8 Pack (454g) cost \xA31.79 (\xA33.94 per kg), while Tesco Finest 6 Pork Sausages (400g) cost \xA33.30 for a smaller pack (\xA38.25 per kg). Prices like these are examples rather than a fixed rule, and it's worth checking pack and unit prices against each other when deciding what to buy.",
      "What tends to make sausages cost-effective isn't the price on the pack, but how far their flavour is spread. A tomato pasta sauce made with four crumbled sausages can serve more people than four sausages presented whole on a plate, because the meat is seasoning the whole dish rather than making up the entire portion. The same idea applies to the bean stew, the lentil casserole and the hash."
    ]
  },
  {
    title: "A note on food safety",
    paragraphs: [
      "Cook sausages according to the pack instructions, keep raw and cooked sausages separate, and cool and refrigerate leftovers promptly, reheating them until steaming hot all the way through.",
      "Rice needs a little more care. Cool cooked rice quickly, ideally within an hour, keep it in the fridge for no more than a day, and reheat it only once until steaming hot throughout. Rice left at room temperature for too long may become unsafe, and reheating does not necessarily put that right."
    ]
  },
  {
    title: "In short",
    paragraphs: [
      "None of this needs unfamiliar ingredients or a shopping trip beyond the usual list. A pack of sausages that would otherwise become the same dinner twice in a fortnight can go nine different directions just by changing how it's used: sliced instead of whole, crumbled into a sauce, or paired with something fresher. Sometimes variety comes less from what's in the fridge and more from what's done with it."
    ]
  }
];
var SAUSAGE_WAYS_GUIDE_FAQS = [
  {
    question: "Can sausages be cooked from frozen?",
    answer: "Many can, but not all. Check the pack first and allow extra time where necessary. They should be cooked thoroughly and steaming hot all the way through, with no pink meat inside."
  },
  {
    question: "How long do cooked sausages keep?",
    answer: "Cooled and refrigerated promptly, cooked sausages are best eaten within two days, or frozen if that's not going to happen."
  },
  {
    question: "Which of these ideas work with vegetarian sausages?",
    answer: "Most of them, though not every vegetarian sausage comes in a casing that peels away and crumbles the way a pork sausage does. Some are softer or already loose-textured, so they may suit slicing better than crumbling. Check the product before using it for the pasta or meatball ideas."
  }
];
var SAUSAGE_WAYS_GUIDE_RECORD = {
  id: "9-ways-with-sausages",
  slug: "9-ways-with-sausages",
  path: SAUSAGE_WAYS_GUIDE_PATH,
  canonicalPath: SAUSAGE_WAYS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "price-sensitive",
  ...SAUSAGE_WAYS_GUIDE,
  metaDescription: SAUSAGE_WAYS_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: SAUSAGE_GUIDE_DISCLOSURES,
  disclosureFooter: SAUSAGE_GUIDE_DISCLOSURE_FOOTER,
  sections: SAUSAGE_WAYS_GUIDE_SECTIONS,
  faqs: SAUSAGE_WAYS_GUIDE_FAQS,
  cta: {
    title: "Find sausage recipes for dinner",
    copy: "Search DinnerByDesign for sausage recipes that suit your time, budget and preferences.",
    label: "Find sausage recipes",
    href: "/signin"
  }
};

// src/content/bubbleAndSqueakBudgetDinnersGuide.ts
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH = "/guides/nine-budget-dinners-built-around-bubble-and-squeak";
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on budget wording", body: "This guide does not use live retailer prices or promise a fixed saving. The cost depends on what is already at home, current prices and the toppings you choose." },
  { key: "storage_and_cooking", title: "Leftovers and food safety", body: "Cooked potato, vegetables, meat and fish need prompt cooling, suitable storage and thorough reheating. Follow current Food Standards Agency guidance and product-label instructions." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Bacon, black pudding, sausages, baked beans, cheese, yoghurt, mustard, fish and prepared sauces vary by product and may contain allergens. Check labels for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe and food-safety sources were checked on 8 August 2026. Follow the linked publisher and Food Standards Agency pages for later updates." }
];
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers variations on a flexible bubble-and-squeak base rather than nine separate complete recipes. Ingredient quantities, storage advice and cooking instructions vary.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE = {
  title: "Nine budget dinners built around bubble and squeak",
  seoTitle: "Nine Budget Dinners Built Around Bubble and Squeak | DinnerByDesign",
  description: "Nine practical ways to turn bubble and squeak into a varied dinner, using eggs, beans, fish, leftover chicken and cupboard ingredients.",
  publishedAt: "2026-08-08",
  reviewedAt: "2026-08-08",
  nextReviewAt: "2027-08-08",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find dinner ideas built around bubble and squeak",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-08",
  editorialNotes: "Nine clearly labelled variations on one verified bubble-and-squeak method, with one separately sourced chickpea sauce.",
  internalLinks: ["/guides", "/recipes", "/guides/9-budget-dinners-with-leftover-roast-chicken", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Bubble & squeak, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bubble-squeak" },
    { label: "Tomato & chickpea curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Can I make bubble and squeak without leftovers?", answer: "Yes. Cook potato and vegetables specifically for it, then cool them before frying. Cold potato helps the mixture hold together." },
    { question: "What vegetables work in bubble and squeak?", answer: "Cabbage and sprouts are traditional, but cooked carrots, peas and greens can work too. Use vegetables that are safe to eat and have been stored properly." },
    { question: "How do I stop bubble and squeak falling apart?", answer: "Use cold cooked potato, avoid overloading the pan and add a little flour, breadcrumbs or beaten egg if the mixture feels too loose." },
    { question: "Can bubble and squeak be a dinner on its own?", answer: "Yes. Eggs, beans, fish, sausages or a sauce can turn it into a fuller dinner, depending on what is available." }
  ]
};
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_SECTIONS = [
  { paragraphs: [
    "Bubble and squeak is cooked potato and vegetables, roughly mashed or chopped, fried until crisp and golden. It's particularly useful the day after a roast, when there's leftover mash, cabbage or sprouts sitting in the fridge, but there is no reason it has to start with leftovers; potato and vegetables cooked specifically for the purpose work just as well.",
    "The base recipe used throughout this guide is BBC Good Food's Bubble & squeak, which fries cold leftover mashed potato with cabbage or sprouts, onion, garlic and a little bacon until crisp at the edges. It serves four, with ten minutes of preparation and twenty minutes of cooking. Everything below builds on that base with a different topping or addition."
  ] },
  { title: "1. Bubble and squeak with fried eggs", paragraphs: [
    "A fried egg with a runny yolk turns a panful of crisp potato and cabbage into a dinner rather than a side dish. Break the yolk over the top and it does the work a sauce would otherwise do.",
    "This is the base recipe with nothing added beyond the egg, so it is the one to start with if any of the others feel like too much. Frying the egg in a separate pan while the bubble and squeak finishes crisping means neither has to wait for the other."
  ] },
  { title: "2. Bubble and squeak with black pudding and apples or chutney", paragraphs: [
    "Slices of black pudding fried alongside the potato cake, with a few slices of apple softened in the same pan, or a spoonful of chutney on the side to cut through the richness.",
    "Black pudding brings a peppery depth that is a long way from the plainness of the egg version. It is entirely optional, and the base works without it. Add it only in the final few minutes to avoid it drying out."
  ] },
  { title: "3. Bubble and squeak with sausages and onion gravy", paragraphs: [
    "A small number of sausages, browned and simmered briefly in onion gravy, served alongside or on top of the bubble and squeak. The gravy gives the dinner more body and a longer cooking time than the egg version.",
    "Two or three sausages, sliced, go further across a panful of bubble and squeak than they would served whole alongside mash, which is a useful way to stretch a small pack."
  ] },
  { title: "4. Bubble and squeak with baked beans and cheese", paragraphs: [
    "Tinned baked beans, warmed through and spooned generously over bubble and squeak, finished with grated cheese melted under the grill or stirred through while hot.",
    "The beans are the bulk of the dinner alongside the potato base, making this one of the most cupboard-led versions on the list. Transfer any unused beans to a covered container and follow the tin label guidance for storage."
  ] },
  { title: "5. Bubble and squeak with leftover roast chicken", paragraphs: [
    "A modest amount of cooked chicken, shredded and folded through the bubble and squeak as it fries, or piled on top once served. It uses two sets of leftovers at once: chicken and vegetables.",
    "Cooked chicken only needs warming through, not further cooking, so add it towards the end to avoid it drying out or overcooking. The leftover roast chicken guide has more ideas if there is more meat left than one dinner can use."
  ], relatedLink: { label: "Nine budget dinners with leftover roast chicken", url: "/guides/9-budget-dinners-with-leftover-roast-chicken" } },
  { title: "6. Bubble and squeak with smoked fish and a poached egg", paragraphs: [
    "Flaked smoked mackerel or smoked haddock, warmed gently and folded through or served alongside the bubble and squeak, topped with a softly poached egg. Smoked fish takes the dish away from a fry-up and towards a fish supper.",
    "Check the pack instructions. Smoked haddock needs cooking, while some hot-smoked mackerel fillets are ready to eat or can simply be warmed through."
  ] },
  { title: "7. Bubble and squeak topped with a spiced tomato and chickpea sauce", paragraphs: [
    "Spoon spiced tomato and chickpea sauce, in the style of BBC Good Food's Tomato & chickpea curry, over crisp bubble and squeak rather than serving it with rice. The sauce should sit on top and bring contrast, not smother the crisp base underneath.",
    "This is the only dinner on the list with a spiced, saucy element rather than a fried or grilled topping, and the only one built around a separate source recipe. Making a full batch of the sauce and freezing half keeps the next version simple."
  ] },
  { title: "8. Bubble and squeak with mushrooms, greens and a soft egg", paragraphs: [
    "Mushrooms fried until golden, whatever greens are to hand wilted in at the last minute, and a softly cooked egg on top. This is the most adaptable entry, useful when there are odd amounts of several vegetables rather than a full portion of any one.",
    "Fry the mushrooms separately before adding them, rather than in with the potato from the start, to stop them making the whole pan watery."
  ] },
  { title: "9. Bubble and squeak cakes with a simple salad and yoghurt or mustard dressing", paragraphs: [
    "Shape the same mixture into smaller patties rather than one large panful, then serve with a simple salad and a spoonful of yoghurt or mustard dressing rather than a hot topping.",
    "Smaller cakes cook faster and crisp more evenly than one large cake, and the cold salad and dressing make this feel like a genuinely different dinner. A spoonful of plain yoghurt with lemon, or a little mustard loosened with oil, is enough."
  ] },
  { title: "Getting the base right", paragraphs: [
    "Cold cooked potato holds together better than warm potato, so cool it in the fridge for at least an hour, or use genuine leftovers, before frying. Avoid overloading the pan: a thinner layer crisps on the outside, while a thick crowded pan tends to steam instead.",
    "Almost any cooked vegetable works, not just cabbage: sprouts, carrots, peas and other greens can all go in. If the mixture feels too loose to hold its shape, a spoonful of flour or breadcrumbs, or a beaten egg, helps bind it. None of this requires leftovers specifically."
  ] },
  { title: "A note on leftovers and food safety", paragraphs: [
    "Cooked potato, vegetables, meat and fish need proper cooling, storing and reheating to stay safe to eat. Check current Food Standards Agency guidance before building a dinner around anything that has been sitting in the fridge for more than a day or two."
  ] },
  { title: "A flexible base, not a rulebook", paragraphs: [
    "Bubble and squeak works best as a starting point rather than a compulsory way to use every leftover in the fridge. The practical win is that it gives odds and ends a defined purpose, so cooked potato and vegetables are more likely to get used before they are forgotten."
  ], relatedLink: { label: "Browse the guides library", url: "/guides" } }
];
var BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD = {
  id: "nine-budget-dinners-built-around-bubble-and-squeak",
  slug: "nine-budget-dinners-built-around-bubble-and-squeak",
  path: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE,
  metaDescription: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/meatStretchingGuide.ts
var MEAT_STRETCHING_GUIDE_PATH = "/guides/seven-ways-to-make-meat-go-further";
var MEAT_STRETCHING_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on budget wording", body: "This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen." },
  { key: "storage_and_cooking", title: "Storage and cooking safety", body: "Cook meat, pulses and leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Beans, lentils, sausages, stock, dairy, pasta, pesto and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings." }
];
var MEAT_STRETCHING_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var MEAT_STRETCHING_GUIDE = {
  title: "Seven ways to make meat go further with beans, lentils and mushrooms",
  seoTitle: "Seven ways to make meat go further | DinnerByDesign",
  description: "Seven familiar dinners showing how beans, lentils and mushrooms can make a smaller amount of meat go further without making dinner feel like a compromise.",
  publishedAt: "2026-08-09",
  reviewedAt: "2026-08-09",
  nextReviewAt: "2027-02-09",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Ways to make meat go further with beans, lentils and mushrooms",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-09",
  editorialNotes: "Seven source-led dinners that distinguish published recipe methods from practical, clearly labelled adaptations.",
  internalLinks: ["/guides", "/recipes", "/guides/9-budget-dinners-with-beef-or-pork-mince", "/guides/nine-budget-dinners-with-tinned-vegetables", "/guides/nine-budget-dinners-with-rice", "/guides/cooking-with-pulses-on-a-budget", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Chilli con carne, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe" },
    { label: "Cottage pie, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/775643/cottage-pie" },
    { label: "Bean & sausage hotpot, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot" },
    { label: "Fragrant chicken curry with chick peas, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/fragrant-chicken-curry-chick-peas" },
    { label: "Spaghetti Bolognese, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/spaghetti-bolognese" },
    { label: "Bacon & mushroom pasta, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bacon-mushroom-pasta" },
    { label: "Beef meatballs with tomato sauce, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/beef-meatballs-with-tomato-sauce" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Can I replace all the meat with beans or lentils?", answer: "You can, but this guide is about making a smaller amount of meat cover more dinners. Start by replacing some of the meat, then adjust the seasoning and texture to suit the dish." },
    { question: "Which lentils work best?", answer: "Green and brown lentils hold their shape in pies and sauces. Red lentils soften more, which suits chilli and tomato-based sauces." },
    { question: "Do tinned beans need cooking first?", answer: "Tinned beans are already cooked. Drain and rinse them where the label suggests, then warm them through in the sauce or hotpot." },
    { question: "Will mushrooms make a mince dish watery?", answer: "Finely chop them and cook them first so their moisture cooks away before they go into the sauce or filling." }
  ]
};
var MEAT_STRETCHING_GUIDE_SECTIONS = [
  { paragraphs: [
    "A pack of mince, a few sausages or chicken left over from a roast does not always stretch to a full dinner for the whole household on its own. Beans, lentils and mushrooms are a practical way to close that gap without turning dinner into something unfamiliar or making it feel like a compromise.",
    "Some of these dinners already include beans, lentils or mushrooms in the published recipe. Others are familiar meat-led dishes with a suggested addition. Those are clearly marked as adaptations, rather than presented as the publisher's own method."
  ] },
  { title: "1. Chilli con carne, with beans doing the bulk of the work", paragraphs: [
    "BBC Good Food's chilli con carne combines minced beef with red kidney beans in a spiced tomato sauce. The beans are part of the recipe as written, and make up a substantial share of each serving alongside the mince.",
    "Adaptation: a handful of dried red lentils, added with the tomatoes and given time to soften, can bulk the chilli out further and thicken the sauce. This is not part of the original recipe."
  ] },
  { title: "2. Cottage pie, stretched with lentils and mushrooms", paragraphs: [
    "BBC Good Food's cottage pie is a mince filling with onion, carrot and celery in a stock-based gravy, topped with potato mash and baked until golden.",
    "Adaptation: some of the mince can be replaced with cooked green or brown lentils and finely chopped mushrooms. Cook the mushrooms first, then add them to the filling. This substitution is not part of the original recipe."
  ] },
  { title: "3. Sausage and bean hotpot", paragraphs: [
    "BBC Good Food's bean and sausage hotpot browns sausages, then simmers them in tomato sauce with butter beans, mustard and a little treacle or sugar. It serves four, with five minutes of preparation and forty minutes of cooking.",
    "Butter beans and the sauce carry most of the dish, so a modest number of sausages is enough to cover four. A second tin of beans can make the pot go further, or use another tinned bean in place of butter beans."
  ] },
  { title: "4. Fragrant chicken curry with chickpeas", paragraphs: [
    "Chicken simmers in a spiced sauce, with chickpeas and coriander stirred through near the end. BBC Good Food lists four servings, with thirty to forty minutes of preparation and thirty minutes of cooking.",
    "The chickpeas are part of the source recipe. A smaller amount of chicken can still make a full dinner once the sauce and chickpeas are taken into account. Another tinned pulse can stand in for chickpeas."
  ] },
  { title: "5. Spaghetti Bolognese, built with mushrooms", paragraphs: [
    "The Food Standards Agency version combines beef mince with onion, garlic, tomatoes, mushrooms, pepper, carrot and courgette, served over spaghetti. It serves two and takes fifty minutes.",
    "Mushrooms are part of the recipe as written, giving the sauce texture beyond the mince. Adaptation: dried red lentils added with the tomatoes soften into the sauce and make it go further. This is not part of the original recipe."
  ] },
  { title: "6. Bacon and mushroom pasta, with beans added", paragraphs: [
    "BBC Good Food's bacon and mushroom pasta fries bacon and mushrooms until golden, then tosses them with pasta, pesto and creme fraiche. It is ready in under thirty minutes.",
    "The mushrooms are already doing useful work in the dish. Adaptation: stir in a drained tin of cannellini or borlotti beans once the pasta and sauce are combined to add bulk without needing more bacon."
  ] },
  { title: "7. Beef meatballs with mushrooms and tomato sauce", paragraphs: [
    "The Food Standards Agency recipe makes lean beef meatballs, then simmers them in tomato sauce with mushrooms and peppers. It serves four and takes one hour and five minutes.",
    "The mushrooms are part of the source recipe, helping the sauce go further. Adaptation: a small amount of cooked, well-drained lentils or finely grated mushroom can be worked into the meatball mixture to use less mince per meatball. This is not part of the original recipe."
  ] },
  { title: "Choosing the right addition", paragraphs: [
    "Lentils suit saucy mince dishes and pies, where they soften into the sauce. Beans suit chilli, stews and sausage dinners, where they hold their shape. Mushrooms work well in sauces, pies and pasta dishes, where their savouriness fits naturally with the meat.",
    "Using less meat in a dinner does not mean less flavour or less variety. Chilli, curry, pasta, pie and hotpot can all still taste like themselves while leaving a little more room in the weekly shop."
  ], relatedLink: { label: "Browse the guides library", url: "/guides" } }
];
var MEAT_STRETCHING_GUIDE_RECORD = {
  id: "seven-ways-to-make-meat-go-further",
  slug: "seven-ways-to-make-meat-go-further",
  path: MEAT_STRETCHING_GUIDE_PATH,
  canonicalPath: MEAT_STRETCHING_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...MEAT_STRETCHING_GUIDE,
  metaDescription: MEAT_STRETCHING_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: MEAT_STRETCHING_GUIDE_DISCLOSURES,
  disclosureFooter: MEAT_STRETCHING_GUIDE_DISCLOSURE_FOOTER,
  sections: MEAT_STRETCHING_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/leftoverRoastChickenBudgetDinnersGuide.ts
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH = "/guides/9-budget-dinners-with-leftover-roast-chicken";
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURES = [
  {
    key: "price_comparison",
    title: "A note on budget wording",
    body: "This guide does not use live retailer prices or promise a fixed saving. Current pack sizes, retailer prices and ingredients already at home all affect the final cost."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and reheating",
    body: "Follow current Food Standards Agency guidance when cooling, storing and reheating leftover chicken, cooked rice and dishes made with them. Check the guidance again if your storage conditions differ."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Stock, soy sauce, wraps, pastry, yoghurt, houmous, mayonnaise, cheese and prepared seasonings vary by product and may contain allergens. Check labels for everyone eating the dinner."
  },
  {
    key: "source_timing",
    title: "Guidance review",
    body: "Food-safety guidance and editorial claims were reviewed 6 August 2026. Follow the cited Food Standards Agency pages for later updates."
  }
];
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than complete recipes. Ingredients, pack sizes, cooking instructions and allergens vary.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE = {
  title: "9 budget dinners with leftover roast chicken",
  seoTitle: "9 Budget Dinners With Leftover Roast Chicken | DinnerByDesign",
  description: "Nine practical dinner ideas for using leftover roast chicken, with ways to stretch portions, use everyday ingredients and reduce food waste.",
  publishedAt: "2026-08-06",
  reviewedAt: "2026-08-06",
  nextReviewAt: "2027-08-06",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using leftover roast chicken",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-06",
  editorialNotes: "One canonical leftover-led guide with nine distinct roast chicken dinner ideas, food-safety guidance and one handoff to ordinary DinnerByDesign search.",
  internalLinks: ["/guides", "/recipes", "/food-costs/cooking-with-pulses-on-a-budget", "/food-costs/portion-planning-and-food-waste", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.gov.uk/government/publications/home-food-fact-checker"
    },
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.gov.uk/government/publications/cooking-your-food"
    },
    {
      label: "Food Standards Agency: Reheating leftovers until steaming hot throughout",
      url: "https://www.food.gov.uk/research/behaviour-and-perception/not-reheating-leftovers-until-steaming-hot-throughout"
    }
  ]
};
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "A roast chicken rarely gets used all at once, and what's left in the fridge a day or two later is worth more than a sandwich filling. Shredded or diced, roast chicken carries flavour into soups, bakes, curries and rice dishes without much effort, and it pairs well with things already in the cupboard: potatoes, tinned tomatoes, stock, beans, yoghurt. Below are nine dinners built around that leftover chicken, each one designed to stretch it a bit further rather than just bulking out a plate."
    ]
  },
  {
    title: "Chicken fried rice",
    paragraphs: [
      "Fried rice is one of the quickest ways to turn a small amount of chicken into a full dinner. Cooked, cold rice fries better than fresh, so this is a natural fit for a rice portion left over from another night. Add a beaten egg, frozen peas and sweetcorn, and a splash of soy sauce, and around 150g of shredded chicken is enough for two generous portions once everything else bulks it out. A grated carrot or some finely sliced spring onion is a reasonable addition if there's some to use up. To stretch the chicken further, lean more heavily on the vegetables and treat the meat as one ingredient among several rather than the main event."
    ]
  },
  {
    title: "Chicken, leek and mushroom pie filling",
    paragraphs: [
      "A white sauce built from butter, flour and milk, with sliced leek and mushroom softened in first, turns a modest amount of chicken into a filling that goes a long way under pastry or mash. About 200g of diced chicken is plenty for a pie serving four, especially once the vegetables are added. Ready-rolled puff pastry keeps this simple, and a shortcrust or mashed potato topping works just as well if that's what's in. A tin of sweetcorn or a couple of handfuls of frozen peas stirred through the sauce add bulk and help the filling stretch across more portions than the chicken alone would manage."
    ]
  },
  {
    title: "Chicken and sweetcorn soup",
    paragraphs: [
      "This is the one to make if the chicken has dried out slightly, since a slow simmer in stock brings it back to life. Sweetcorn, whether tinned or frozen, is the main bulking ingredient here, along with a diced onion and some sliced spring onion if there's any about. Around 100g of shredded chicken is enough for a pan that serves two to three, particularly with a swirl of beaten egg stirred through at the end for extra body, in the style of a simple egg-drop soup. Rice or noodles added to the pot turn this from a starter into more of a main dinner. Any extra should be cooled promptly, covered and put in the fridge, then eaten within 48 hours or frozen for another week."
    ]
  },
  {
    title: "Chicken wraps with yoghurt, salad and pickles",
    paragraphs: [
      "This is the dinner for a night when there's not much appetite for cooking. Shredded chicken, a spoonful of plain yoghurt mixed with a little garlic or lemon, and whatever salad is knocking about in the fridge fill a wrap or flatbread well, and there's barely a pan to wash up afterwards. Around 80 to 100g of chicken per wrap is a reasonable amount, and a bit of pickled onion or gherkin adds the sharpness that stops the whole thing tasting flat. Swapping the yoghurt for houmous is an easy variation if that's what's open in the fridge. To stretch the chicken further, add a tin of drained chickpeas to the filling so the wrap isn't relying on meat for its bulk."
    ]
  },
  {
    title: "Chicken pasta bake",
    paragraphs: [
      "A tomato or white sauce poured over pasta and shredded chicken, topped with cheese and baked until bubbling, is a dependable way to use up both leftover chicken and any pasta sauce sitting in the cupboard. Around 150g of chicken is enough for a bake serving three to four once the pasta and sauce are factored in, and frozen spinach or broccoli stirred through adds colour and volume. A tin of chopped tomatoes can stand in for a jarred sauce if that's what's to hand. Bulking the pasta itself, rather than the chicken, is usually the easiest way to make this dinner go further across more portions."
    ]
  },
  {
    title: "Chicken curry with chickpeas or lentils",
    paragraphs: [
      "A curry built from onion, garlic, tinned tomatoes and whatever spices are in the cupboard turns a small amount of chicken into a dinner that reheats well the next day. Around 150g of shredded chicken is plenty for a curry serving three, especially once a tin of chickpeas or a handful of red lentils is added to thicken the sauce and increase the volume. Coconut milk is a reasonable swap for some of the tomato base if a creamier curry is wanted. Lentils are the more effective stretcher of the two, since they break down as they cook and thicken the sauce rather than sitting as a separate ingredient."
    ]
  },
  {
    title: "Chicken risotto",
    paragraphs: [
      "Risotto works from raw rice rather than leftover rice, unlike the fried rice above, so this is one to start from a bag of arborio or carnaroli rather than reaching for a cooked portion out of the fridge. Cooked slowly with stock, added a ladleful at a time, the rice gives a creamy base that carries shredded chicken well without needing much of it. Around 120g of chicken, stirred through near the end of cooking so it warms through rather than overcooks, is enough for a risotto serving two to three. Frozen peas or sweetcorn stirred in during the last few minutes add colour and bulk. A vegetable stock cube can replace chicken stock if that's what's in, and the flavour holds up reasonably well. Using a bit more rice and stock than the chicken alone would need is the simplest way to stretch this dinner across more servings."
    ]
  },
  {
    title: "Loaded baked potatoes with chicken and beans",
    paragraphs: [
      "A baked potato is already a filling base, so it doesn't take much chicken on top to make a proper dinner of it. For each potato, mix around 80g of shredded chicken with either a tin of beans in a light sauce, or with sweetcorn and a spoon of mayonnaise, then spoon that over the split potato. Cheese grated over the top is optional but does add to the sense of a finished plate. Baked beans are a fair swap for the tinned beans if that's what's in the cupboard, and this dinner scales easily up or down depending on how many potatoes go in the oven. Splitting the chicken across more potatoes, topped up with extra beans, is the easiest way to feed more people from the same amount of meat."
    ]
  },
  {
    title: "Chicken hash with potatoes and a fried egg",
    paragraphs: [
      "This is the one-pan dinner for when the fridge looks a bit bare and there's not much energy for a proper cook. Diced potato, fried until golden with an onion and the leftover chicken stirred through towards the end, comes together with barely any planning. Around 100 to 120g of chicken is enough for a hash serving two, topped with a fried egg so the yolk runs into everything underneath. Leftover roast potatoes work well here instead of raw diced ones if there are some going spare, which also cuts the cooking time considerably. Frozen diced onion is a reasonable time-saver if a fresh one isn't to hand. Adding a handful of frozen peas or sweetcorn towards the end of cooking bulks the pan out without needing more chicken."
    ]
  },
  {
    title: "A note on food safety",
    paragraphs: [
      "Leftover chicken should go in the fridge promptly, ideally within two hours of cooking. The Food Standards Agency advises eating leftovers within 48 hours or freezing them if that isn't going to happen. When reheating, chicken and any dish containing it should be heated until steaming hot all the way through, not just warmed, and should only be reheated once.",
      "Rice needs its own rule, and it applies to the fried rice above rather than the risotto, since risotto is cooked fresh from raw rice each time. The Food Standards Agency advises cooling cooked rice quickly, ideally within an hour, then refrigerating it and using it within 24 hours. As with any leftover, reheat rice only once and make sure it's steaming hot all the way through before serving."
    ]
  }
];
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS = [
  {
    question: "How long can leftover roast chicken be kept in the fridge?",
    answer: "Cool it promptly, refrigerate it within two hours of cooking and eat it within 48 hours, or freeze it if that will not be possible. Follow current Food Standards Agency guidance if your storage conditions differ."
  },
  {
    question: "Can I use leftover chicken in fried rice?",
    answer: "Yes, but use rice that was cooled quickly, refrigerated promptly and used within 24 hours. Reheat the finished fried rice only once and make sure it is steaming hot throughout before serving."
  },
  {
    question: "How can I make leftover chicken stretch further?",
    answer: "Pair it with potatoes, pasta, rice, beans, lentils or vegetables that need using up. The chicken then adds flavour to the whole dinner rather than sitting as the only main ingredient."
  },
  {
    question: "Can these leftover chicken ideas be frozen?",
    answer: "Many can be frozen, including soup, pie filling, curry and pasta bake. Cool the dish promptly, freeze it in useful portions and reheat it until steaming hot throughout. Check rice guidance separately."
  }
];
var LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD = {
  id: "9-budget-dinners-with-leftover-roast-chicken",
  slug: "9-budget-dinners-with-leftover-roast-chicken",
  path: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE,
  metaDescription: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_SECTIONS,
  faqs: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS,
  cta: {
    title: "Find chicken recipes for dinner",
    copy: "Search DinnerByDesign for chicken recipes that suit your time, budget and preferences.",
    label: "Find chicken recipes",
    href: "/signin"
  }
};

// src/content/nineBudgetFriendlyDinnersWithEggsGuide.ts
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH = "/guides/nine-budget-friendly-dinners-with-eggs";
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURES = [
  {
    key: "storage_and_cooking",
    title: "Storage and cooking safety",
    body: "Follow current Food Standards Agency guidance when cooling, storing and reheating cooked rice and other leftovers. Rice needs particularly prompt cooling and should be reheated only once until steaming hot throughout."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Eggs, pasta, bread, tortillas, stock, Parmesan, yogurt and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner."
  },
  {
    key: "source_timing",
    title: "Source and guidance review",
    body: "The recipe pages and Food Standards Agency guidance were checked on 7 August 2026. Recipe details, product ingredients and official guidance can change, so follow the cited sources for later information."
  }
];
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers flexible dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and sources.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE = {
  title: "Nine budget-friendly dinners with eggs",
  seoTitle: "Nine budget-friendly dinners with eggs | DinnerByDesign",
  description: "Nine varied budget-friendly dinners with eggs, rice, potatoes, beans, pasta and vegetables, using established recipe sources and practical leftovers advice.",
  publishedAt: "2026-08-07",
  reviewedAt: "2026-08-07",
  nextReviewAt: "2026-09-07",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find varied budget-friendly dinner ideas using eggs",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-07",
  editorialNotes: "Nine source-led dinner ideas showing how eggs can support varied, budget-friendly cooking while helping use up rice, potatoes, vegetables and leftovers.",
  internalLinks: ["/guides", "/recipes", "/guides/nine-budget-dinners-three-cuisines", "/guides/9-ways-with-sausages", "/guides/9-budget-dinners-with-leftover-roast-chicken", "/food-safety", "/signin"],
  disclosures: ["storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Shakshuka, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/shakshuka" },
    { label: "Easy egg-fried rice, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/egg-fried-rice" },
    { label: "Spanish tortilla, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/spanish-tortilla" },
    { label: "Quick veg and soft cheese frittata, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/quick-veg-soft-cheese-frittata" },
    { label: "Egg curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/egg-curry" },
    { label: "One-pan eggs with tomatoes, peppers & yogurt, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/turkish-one-pan-eggs-peppers-menemen" },
    { label: "Bubble & squeak, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bubble-squeak" },
    { label: "Potato hash with greens, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/potato-hash-with-greens" },
    { label: "Beans-and-Greens Pasta with Fried Eggs, Food Network Kitchen", url: "https://www.foodnetwork.com/fnk/recipes/beans-and-greens-pasta-with-fried-eggs-9840292" },
    { label: "Food Standards Agency: Rice", url: "https://www.food.gov.uk/print/pdf/node/4286" }
  ],
  faqs: [
    {
      question: "Can eggs make a filling budget-friendly dinner?",
      answer: "Yes. Eggs add protein to inexpensive ingredients such as rice, potatoes, beans, pasta and vegetables, while the recipes use different spices, textures and cooking methods to keep the dinners varied."
    },
    {
      question: "Which of these egg dinners are best for using leftovers?",
      answer: "Egg-fried rice uses cooked rice, bubble and squeak uses leftover mashed potato and cooked vegetables, and the frittata is useful for small amounts of several vegetables. The shakshuka-style sauces can also use tomatoes and peppers that are starting to soften."
    },
    {
      question: "Can I substitute ingredients in these egg dinners?",
      answer: "Yes, within reason. Frozen vegetables can replace fresh ones, tinned beans can usually replace another tinned bean, and ordinary spaghetti can replace chickpea spaghetti in the pasta dish. The article identifies where a substitution changes the original source recipe."
    },
    {
      question: "How should cooked rice be stored?",
      answer: "Cool cooked rice as quickly as possible, ideally within one hour, then cover and refrigerate it. Use it within 24 hours, reheat it only once and make sure it is steaming hot throughout before serving."
    },
    {
      question: "Are these complete recipes?",
      answer: "No. They are source-led dinner ideas and practical notes that point to the established recipe for the full method, ingredients and timings. Follow the linked source recipe and its current instructions when cooking."
    }
  ]
};
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "Eggs are one of the few ingredients that make a genuine case for themselves on cost, versatility and speed all at once. A box of six is affordable for the protein it delivers, keeps for weeks in the fridge, and turns rice, potatoes, vegetables, beans and pasta into a finished dinner rather than a pile of leftovers. That makes eggs a useful starting point for anyone trying to keep grocery spending under control without falling back on the same two or three dishes on repeat.",
      "This is a guide to nine budget-friendly dinners with eggs, each taken from an established recipe source rather than presented as anything original. None of them assumes a big shop or a long ingredient list. Between them, they cover rice, potatoes, beans, pasta and a handful of vegetables, which means most of the store-cupboard basics already at the back of the cupboard have somewhere to go. The aim is affordable egg recipes that still feel like proper dinners: budget family dinners built around leftover ingredients, not a fallback when the fridge is bare."
    ]
  },
  {
    title: "1. Shakshuka",
    paragraphs: [
      "Eggs baked in a spiced tomato sauce of onion, chilli, coriander and cherry tomatoes, a dish with roots across North Africa and the Middle East and a longstanding fixture on BBC Good Food.",
      "The sauce is built from onion, tinned or cherry tomatoes and a little chilli, all inexpensive and long-keeping, with the eggs turning a side sauce into a full dinner. It scales up easily by adding an extra egg or two per additional person.",
      "Onion, chilli, coriander, cherry tomatoes and eggs. A pepper can stand in for the chilli, parsley can replace the coriander, and a pinch of paprika is a reasonable way to add warmth if the chilli is left out. Tinned tomatoes can replace cherry tomatoes outside of summer.",
      "A good way to use up tomatoes that are starting to soften, since they cook down into the sauce rather than needing to look presentable. The sauce alone freezes well, ready for eggs to be added fresh another night.",
      "The sauce can be made ahead and reheated; add and cook the eggs fresh just before serving, since eggs are best cooked close to the point of eating rather than reheated from cold."
    ],
    source: { label: "Shakshuka, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/shakshuka", details: "Serves 2 \xB7 Prep 5 mins \xB7 Cook 20 mins" }
  },
  {
    title: "2. Easy egg-fried rice",
    paragraphs: [
      "A quick stir-fry of rice, egg and onion, seasoned to taste, and one of the more direct ways to turn cooked rice into a dinner in its own right.",
      "It is built around rice and eggs rather than meat or fish, so a bag of rice and a box of eggs cover most of the cost. Cooking extra rice for an earlier dinner means a second one later in the week costs very little more.",
      "Long grain rice, vegetable oil, onion, eggs and spring onions to serve. Frozen peas, sweetcorn or diced carrot are common, inexpensive additions if there are vegetables that need using up.",
      "This is a genuine leftovers dish rather than one that merely tolerates them. Cold, day-old rice fries better than freshly cooked rice, and small amounts of odd vegetables can go in alongside it.",
      "Rice should be cooled and refrigerated quickly after cooking, then used within 24 hours and reheated only once. The Food Standards Agency's rice-specific food safety guidance recommends cooling rice quickly and using it within one day."
    ],
    source: { label: "Easy egg-fried rice, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/egg-fried-rice", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 10 mins" }
  },
  {
    title: "3. Spanish tortilla",
    paragraphs: [
      "A thick potato and onion omelette, cooked slowly in a covered pan until the base and edges are golden and the middle is just set, served warm or at room temperature.",
      "Potatoes and onions are two of the lower-cost vegetables on a UK shopping list, and the dish scales easily to whatever quantity of potato is in the cupboard.",
      "Potatoes, onion, garlic, eggs and olive oil. Any leftover cooked potato from a previous dinner can be used instead of cooking a fresh batch, cutting the cooking time down considerably.",
      "A practical way to use up potatoes that are past their best for roasting or mashing, and it keeps well, so a larger tortilla can cover more than one dinner across the week.",
      "Cooking the potato and onion gently, covered, before the eggs go in is what gives the tortilla its texture; rushing this stage with high heat tends to brown the potato rather than soften it."
    ],
    source: { label: "Spanish tortilla, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/spanish-tortilla", details: "Serves 4 \xB7 Prep 30 mins \xB7 Cook 50 mins" }
  },
  {
    title: "4. Quick veg and soft cheese frittata",
    paragraphs: [
      "An open-faced omelette finished under the grill, built around courgette, sweetcorn, spinach and lardons or bacon, and softened with spoonfuls of soft cheese.",
      "Eight eggs and a small amount of bacon or lardons go a long way once padded out with courgette, sweetcorn and spinach, so the dish feeds four without needing a larger amount of meat.",
      "Eight eggs, lardons or bacon, courgettes, sweetcorn, spinach and soft cheese. The bacon or lardons can be left out for a vegetarian version, with the vegetable content adjusted to make up the difference, though this moves the dish away from the recipe as written.",
      "This is the dish to reach for when there are small amounts of several vegetables rather than a full portion of any one, since a frittata can absorb odd quantities without the dish looking thrown together.",
      "Starting the frittata on the hob and finishing it under the grill avoids the need to turn it, and a cast-iron or other ovenproof pan makes this easier."
    ],
    source: { label: "Quick veg and soft cheese frittata, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/quick-veg-soft-cheese-frittata", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 20 mins" }
  },
  {
    title: "5. Egg curry",
    paragraphs: [
      "Hard-boiled eggs served on a spiced curry sauce of onion, beans, spinach, tomatoes and coconut milk, closer to a bean and vegetable curry topped with eggs than a classic Indian egg curry, but a good example of how far a few eggs can stretch when paired with rice or flatbread.",
      "Beans, tinned tomatoes and a handful of spinach make a substantial sauce, with the eggs adding protein rather than being the main cost of the dish.",
      "Onion, curry paste, tinned beans, spinach, tinned tomatoes, coconut milk and hard-boiled eggs. A milder curry paste or powder suits those who prefer less heat, and any tinned bean can be used.",
      "The sauce freezes well on its own, so a batch can be split, with fresh eggs boiled and added when the second portion is reheated. It is also a good way to use spinach that is starting to wilt.",
      "Boiling the eggs while the sauce simmers means both are ready at the same time, rather than one holding up the other."
    ],
    source: { label: "Egg curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/egg-curry", details: "Serves 2 \xB7 Prep 10 mins" }
  },
  {
    title: "6. One-pan eggs with tomatoes, peppers and yogurt (menemen-inspired)",
    paragraphs: [
      "BBC Good Food's own title for this recipe is One-pan eggs with tomatoes, peppers & yogurt, described on the page as inspired by menemen rather than presented as a direct version of it. It is a soft, cooked-down mixture of tomato and pepper with small wells made in the sauce, eggs cracked into the wells and cooked in pockets rather than stirred through, finished with a spoonful of yogurt. This is closer to shakshuka's method than to the more scrambled, mixed-through style traditionally associated with menemen.",
      "It shares most of its ingredients with shakshuka, which makes it a natural second dinner from the same shopping list, without repeating the same dish.",
      "Onion, green pepper, tomatoes, eggs and yogurt to finish, with chilli or paprika for warmth. Tinned tomatoes can be used in place of fresh outside of summer, and any colour of pepper works.",
      "A good home for tomatoes and peppers that are a little too soft to serve raw, since they cook down fully into the sauce rather than needing to hold their shape.",
      "Space the wells evenly so each egg has enough sauce around it, and keep the heat gentle once the eggs go in, since they continue cooking in the residual heat after the pan comes off the hob."
    ],
    source: { label: "One-pan eggs with tomatoes, peppers & yogurt, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/turkish-one-pan-eggs-peppers-menemen", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 25 mins" }
  },
  {
    title: "7. Bubble and squeak, adapted with a fried egg",
    paragraphs: [
      "BBC Good Food's bubble and squeak recipe includes bacon: leftover mashed potato fried with cabbage or sprouts, onion, garlic and chopped bacon until golden and crisp at the edges. The fried egg on top in this guide is a further adaptation, not part of the source recipe, added to turn a side dish into a full dinner.",
      "The base is designed specifically around leftovers rather than fresh ingredients bought for the dish, so the potato and vegetables cost nothing extra, and only a small amount of bacon and the added egg are new ingredients.",
      "Cold leftover mashed potato, leftover boiled cabbage or sprouts, onion, garlic and bacon, fried in butter or dripping, with a fried egg added on top. The bacon can be left out for a vegetarian version, and any leftover cooked vegetable can be worked in alongside the potato and cabbage.",
      "This is one of the clearest examples in the list of a dinner built specifically to use up what is already in the fridge, particularly after a roast dinner, rather than one that simply happens to keep well.",
      "Pressing the mixture down and leaving it to fry undisturbed for a few minutes is what gives it a crisp base; stirring too often keeps it soft rather than golden."
    ],
    source: { label: "Bubble & squeak, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bubble-squeak", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 20 mins" }
  },
  {
    title: "8. Potato hash with greens",
    paragraphs: [
      "Diced potato fried with onion and pepper, seasoned with paprika and tarragon, finished with wilted spinach and topped with a poached egg, cooked in the same pan the potatoes were boiled in.",
      "Potatoes, onion and pepper are all lower-cost vegetables, and the egg on top turns what would otherwise be a side dish into a complete dinner without adding meat or fish.",
      "Potatoes, onion, pepper, paprika, tarragon, spinach and eggs. A tin of beans stirred through is a reasonable way to add bulk and stretch the dish further, though it is not part of the recipe as written.",
      "A practical way to use up potatoes, pepper and the last of a bag of spinach before it wilts past the point of being useful.",
      "Poaching the eggs in the reserved potato water, once it is back to a gentle simmer, saves boiling a separate pan."
    ],
    source: { label: "Potato hash with greens, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/potato-hash-with-greens", details: "Serves 2 \xB7 Prep 10 mins \xB7 Cook 40 mins" }
  },
  {
    title: "9. Beans-and-greens pasta with fried eggs",
    paragraphs: [
      "Chickpea spaghetti tossed with chickpeas, spinach and a lemony broth, topped with a fried egg and crisp Parmesan frico chips made by melting spoonfuls of grated Parmesan in the pan until browned. Ordinary spaghetti is a reasonable substitute for the chickpea spaghetti specified, at some cost to the extra protein and fibre it adds.",
      "Chickpeas and spinach make up most of the dish, with pasta as the base, so the egg on top adds protein and richness without the dish needing meat or a large amount of cheese.",
      "Chickpea spaghetti, olive oil, onion, garlic, chickpeas, vegetable broth, spinach, lemon, eggs and Parmesan for the frico. Ordinary spaghetti or another pasta shape can replace the chickpea spaghetti, any tinned bean can replace the chickpeas, and a vegetable stock cube dissolved in water is a reasonable stand-in for shop-bought broth.",
      "A reliable way to use up the last of a bag of spinach and the heel of a lemon or a block of Parmesan too small to grate for anything else.",
      "Frying the eggs separately keeps the yolk in control, so it can be broken over the pasta at the table rather than cooked through in the pan. The Parmesan frico is made by spooning small rounds of grated cheese into a dry pan and cooking until the edges brown and crisp."
    ],
    source: { label: "Beans-and-Greens Pasta with Fried Eggs, Food Network Kitchen", url: "https://www.foodnetwork.com/fnk/recipes/beans-and-greens-pasta-with-fried-eggs-9840292", details: "Serves 4 \xB7 Total 40 mins" }
  },
  {
    title: "Variety, flexibility and reducing waste",
    paragraphs: [
      "These nine dinners share a single ingredient but do not share a single flavour, texture or cuisine, which is the point of building a week's cooking around eggs rather than around one recipe repeated with small changes. Between them, they use up leftover rice, cooked potato, softening tomatoes and peppers, the last of a bag of spinach, and whatever is left in the fridge after a roast dinner, so eggs end up doing double duty: they are the dinner in their own right, and they are also what makes it worth keeping other ingredients on hand rather than letting them go to waste.",
      "None of this depends on unusual ingredients or a big weekly shop. A box of eggs, a few tins, some rice or pasta and whatever vegetables are already in the fridge cover most of what is here, which is really the argument for budget cooking with eggs in the first place: not a fallback when money is tight, but a genuinely useful starting point for a varied week of dinners."
    ]
  },
  {
    title: "A note on rice safety",
    paragraphs: [
      "The egg-fried rice and the koshari-inspired pasta and rice dish both rely on cooked rice, so the Food Standards Agency's rice-specific guidance matters here. Cool cooked rice quickly, refrigerate it and use it within 24 hours. Reheat it only once and make sure it is steaming hot throughout before serving."
    ]
  }
];
var NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_RECORD = {
  id: "nine-budget-friendly-dinners-with-eggs",
  slug: "nine-budget-friendly-dinners-with-eggs",
  path: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE,
  metaDescription: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/nineBudgetDinnersWithTinnedVegetablesGuide.ts
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH = "/guides/nine-budget-dinners-with-tinned-vegetables";
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURES = [
  { key: "storage_and_cooking", title: "Storage and cooking safety", body: "Follow the source recipe and current Food Standards Agency guidance when cooling, storing, freezing and reheating cooked dinners. Instructions and storage advice vary by recipe and product." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Tinned vegetables, beans, fish, cheese, stock, tortillas and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe pages were checked on 7 August 2026. Recipe details, ingredients, instructions and timings can change, so follow the linked publisher page when cooking." }
];
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and sources.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE = {
  title: "Nine budget dinners with tinned vegetables",
  seoTitle: "Nine budget dinners with tinned vegetables | DinnerByDesign",
  description: "Nine varied dinners using tinned vegetables, beans and potatoes, with established recipe sources and practical ideas for using what is already in the cupboard.",
  publishedAt: "2026-08-07",
  reviewedAt: "2026-08-07",
  nextReviewAt: "2026-09-07",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using tinned vegetables",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-07",
  editorialNotes: "Nine source-led dinners showing how tinned vegetables, beans and potatoes can support varied cooking with a useful cupboard back-up.",
  internalLinks: ["/guides", "/recipes", "/guides/nine-budget-friendly-dinners-with-eggs", "/guides/nine-budget-dinners-three-cuisines", "/guides/9-ways-with-sausages", "/food-safety", "/signin"],
  disclosures: ["storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Shakshuka, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/shakshuka" },
    { label: "Easy tuna pasta bake, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/easy-tuna-pasta-bake" },
    { label: "Vegetable and bean chilli, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli" },
    { label: "Easy fish pie, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/family-meals-easy-fish-pie" },
    { label: "Tomato and chickpea curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry" },
    { label: "Dum Aloo Potato Curry, Krumpli", url: "https://www.krumpli.co.uk/dum-aloo-curry/" },
    { label: "Bean and sausage hotpot, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot" },
    { label: "Refried bean quesadillas, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/refried-bean-quesadillas" },
    { label: "Sweetcorn fritters with eggs and black bean salsa, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/sweetcorn-fritters-eggs-black-bean-salsa" }
  ],
  faqs: [
    { question: "Which tinned vegetables are most useful for dinner?", answer: "Chopped tomatoes, sweetcorn, peas and potatoes are useful cupboard staples. Beans and chickpeas are pulses rather than vegetables, but they are equally useful in a cupboard and work alongside the tinned vegetables in several of these dinners." },
    { question: "Can tinned potatoes be used in a dinner?", answer: "Yes. The dum aloo potato curry linked in this guide gives instructions for using tinned new potatoes as an alternative to boiling and peeling fresh ones." },
    { question: "Are tinned vegetables better than fresh or frozen?", answer: "No. Fresh, frozen and tinned vegetables all have a place. Tins are useful because they keep for months and can provide a back-up when the fridge is running low." },
    { question: "How can I avoid wasting tins?", answer: "Keep a small rotating stock, buy a couple of extras as part of an ordinary shop and use the oldest tins first. This makes it less likely that unopened tins disappear at the back of the cupboard." },
    { question: "Are these complete recipes?", answer: "No. They are source-led dinner ideas with practical notes. Use the linked publisher recipe for its full ingredient list, method, timings and current instructions." }
  ]
};
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_SECTIONS = [
  { paragraphs: [
    "Grocery bills have made a lot of households more careful about what goes in the trolley, and tinned vegetables are one of the simplest ways to keep costs down without cooking the same three dinners on repeat. They are not a replacement for fresh or frozen vegetables, which still earn their place for texture, flavour and variety. What tins offer is a back-up: something in the cupboard that keeps for months, does not wilt or spoil if the week gets away from you, and turns pasta, rice, potatoes, eggs, pulses or a small amount of meat or fish into a proper dinner even when the fridge is running low.",
    "This guide sets out nine dinners built around tinned vegetables, each taken from an established recipe publisher. Tinned tomatoes, sweetcorn, peas, beans and potatoes all turn up here, paired with everyday cupboard staples. None depends on a long fresh-ingredient list, and none is presented as the only or best way to cook the dish, just a workable one for a week when a full shop has not happened."
  ] },
  { title: "1. Shakshuka", source: { label: "Shakshuka, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/shakshuka", details: "Serves 2 \xB7 Prep 5 mins \xB7 Cook 20 mins" }, paragraphs: [
    "Eggs baked in a spiced tomato sauce of onion, chilli, coriander and tomatoes, finished at the table straight from the pan.",
    "Tomatoes form the base of the sauce, either from a tin or from cherry tomatoes as the source recipe specifies. A pepper and a pinch of paprika are reasonable substitutes if fresh chilli and coriander are not to hand.",
    "It is a useful way to cook tomatoes that are starting to soften. The sauce can be prepared ahead, with eggs added fresh when it is time to cook."
  ] },
  { title: "2. Easy tuna pasta bake", source: { label: "Easy tuna pasta bake, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/easy-tuna-pasta-bake", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 20 mins" }, paragraphs: [
    "Pasta stirred through a cheese sauce with tuna, peas and sweetcorn, topped with grated cheddar and finished under the grill until golden.",
    "Sweetcorn, alongside peas, gives the bake colour and bite against the pasta and sauce. Any small pasta shape works in place of the one specified, and a tin of salmon is a straightforward swap for tuna.",
    "The full quantity is useful for a smaller household too, as the source recipe gives clear instructions for serving a larger dish."
  ] },
  { title: "3. Vegetable and bean chilli", source: { label: "Vegetable and bean chilli, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 30 to 35 mins" }, paragraphs: [
    "A chilli of courgette, peppers, red lentils and tomatoes, with sweetcorn and butter beans stirred through towards the end of cooking.",
    "Tinned tomatoes form the sauce, with tinned sweetcorn and butter beans added later so they keep some texture. Any tinned bean works in place of butter beans, and courgette can be swapped for another vegetable that needs using up.",
    "The recipe is a useful batch-cooking option, with the source providing the full method and storage advice."
  ] },
  { title: "4. Easy fish pie", source: { label: "Easy fish pie, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/family-meals-easy-fish-pie", details: "Serves 6 to 8 \xB7 Prep 15 mins \xB7 Cook 45 mins" }, paragraphs: [
    "A creamy fish pie mix bound in a cheese sauce with mustard and chives, finished with sweetcorn and peas, topped with mash and grated cheddar, and baked until golden.",
    "Sweetcorn and peas add colour and a contrast in texture to the soft fish and sauce. Frozen versions of both work just as well as tinned, which gives the dish some flexibility.",
    "A bag of frozen fish pie mix is handy for a night when fresh fish was not part of the shop. Follow the source recipe for its preparation and serving advice."
  ] },
  { title: "5. Tomato and chickpea curry", source: { label: "Tomato and chickpea curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 45 mins" }, paragraphs: [
    "Chickpeas warmed through in a spiced tomato and coconut milk sauce, finished with coriander and served with rice.",
    "Tinned tomatoes and chickpeas do most of the work, needing little beyond onion, garlic, coconut milk and spices to become a full sauce. Any tinned pulse can stand in for chickpeas.",
    "It is a good one to cook ahead when the week is likely to be busy. Follow the source for its method and storage instructions."
  ] },
  { title: "6. Dum aloo potato curry", source: { label: "Dum Aloo Potato Curry, Krumpli", url: "https://www.krumpli.co.uk/dum-aloo-curry/", details: "Serves 2 \xB7 Prep 5 mins \xB7 Cook 1 hr 15 mins" }, paragraphs: [
    "A North Indian and Bangladeshi potato curry, with new potatoes fried in ghee then simmered in a spiced tomato gravy thickened with cashew nuts and finished with cream.",
    "The recipe explicitly builds in tinned new potatoes as an alternative to boiling and peeling fresh ones, with instructions given for both. Using tinned potatoes removes the boiling and peeling stage.",
    "The sauce can be made ahead and the potatoes added when reheating. The publisher gives further make-ahead advice on the recipe page."
  ] },
  { title: "7. Bean and sausage hotpot", source: { label: "Bean and sausage hotpot, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot", details: "Serves 4 \xB7 Prep 5 mins \xB7 Cook 40 mins" }, paragraphs: [
    "Sausages browned and simmered in a tomato sauce with tinned butter beans, a little treacle or sugar and mustard, served with rice or crusty bread.",
    "Tinned butter beans and a tomato-based sauce carry most of the dish, with the sausages providing flavour and substance. Any tinned bean can be used in place of butter beans.",
    "Adding a second tin is one way to stretch the dish when there are more people to feed."
  ] },
  { title: "8. Refried bean quesadillas", source: { label: "Refried bean quesadillas, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/refried-bean-quesadillas", details: "Serves 4 \xB7 Prep 10 mins \xB7 Cook 20 mins" }, paragraphs: [
    "Tortillas filled with refried beans, cheese and coriander, folded and fried until crisp and melted through, then served with salsa and sour cream.",
    "Tinned beans are mashed with onion, garlic and spices to make the filling, needing little more than cheese and a tortilla to become a dinner. Sweetcorn or leftover cooked vegetables can be added to the filling to bulk it out.",
    "Keep any unused filling according to the source guidance, ready for a second batch."
  ] },
  { title: "9. Sweetcorn fritters with eggs and black bean salsa", source: { label: "Sweetcorn fritters with eggs and black bean salsa, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/sweetcorn-fritters-eggs-black-bean-salsa", details: "Serves 4 \xB7 Makes 8 fritters \xB7 Prep 10 mins \xB7 Cook 20 mins" }, paragraphs: [
    "Baked fritters of tinned sweetcorn, onion and pepper, topped with poached eggs and a salsa of tomato, black beans, lime and coriander.",
    "Tinned sweetcorn is central to the fritters, with tinned black beans forming the base of the salsa. The source recipe makes eight fritters and gives a way to serve half on the day and the rest later.",
    "That makes it a useful example of how one tin of sweetcorn can support more than one dinner without cooking the same thing twice."
  ] },
  { title: "A note on the cupboard", paragraphs: [
    "A small, rotating stock of tins covers most of what these nine dinners need: chopped tomatoes, sweetcorn, peas, beans, chickpeas and potatoes are the ones that turn up most often, alongside tinned fish if it is eaten in the household. Buying a couple of extras on a normal shop, rather than a large stockpile all at once, makes it easier to use them before the ones at the back of the cupboard are forgotten.",
    "Rotating stock and using the oldest tins first keeps things moving. Tinned vegetables in sauce or brine can carry more salt than fresh or frozen, so check the label where a dish is already well seasoned, and drain and rinse beans or pulses if that suits the product and recipe. Fresh and frozen vegetables still have their place in a weekly shop. The point of keeping a few tins in reserve is flexibility, not a rule about which is best."
  ] }
];
var NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_RECORD = {
  id: "nine-budget-dinners-with-tinned-vegetables",
  slug: "nine-budget-dinners-with-tinned-vegetables",
  path: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/wholeChickenValueGuide.ts
var WHOLE_CHICKEN_VALUE_GUIDE_PATH = "/guides/is-a-whole-chicken-better-value-than-chicken-pieces";
var WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on value", body: "This guide does not use live retailer prices or promise a fixed saving. Compare the current price per kilogram, what you will use and any storage you need before deciding." },
  { key: "storage_and_cooking", title: "Raw chicken and storage", body: "Follow the product label, use-by date and current Food Standards Agency guidance when handling, freezing, defrosting and cooking chicken." },
  { key: "source_timing", title: "Source review", body: "The jointing and food-safety sources were checked on 8 August 2026. Follow the linked publisher or Food Standards Agency page for later updates." }
];
var WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide explains a shopping and cooking choice. Chicken size, price, storage space and the parts your household will use all vary.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var WHOLE_CHICKEN_VALUE_GUIDE = {
  title: "Is a whole chicken better value than chicken pieces?",
  seoTitle: "Is a Whole Chicken Better Value Than Chicken Pieces? | DinnerByDesign",
  description: "A practical guide to comparing a whole chicken with chicken pieces, including how to use the cuts, whether to joint it and when pre-cut chicken makes more sense.",
  publishedAt: "2026-08-08",
  reviewedAt: "2026-08-08",
  nextReviewAt: "2027-08-08",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Decide whether a whole chicken is better value than chicken pieces",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-08",
  editorialNotes: "A source-led buying guide that distinguishes whole-chicken planning from using leftover roast chicken.",
  internalLinks: ["/guides", "/recipes", "/guides/9-budget-dinners-with-leftover-roast-chicken", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "source_timing"],
  sources: [
    { label: "How to joint a raw chicken, BBC Good Food", url: "https://www.bbcgoodfood.com/videos/techniques/how-joint-raw-chicken-video" },
    { label: "JFC Jamie's fried chicken, Jamie Oliver", url: "https://www.jamieoliver.com/recipes/chicken/jfc-jamie-s-fried-chicken/" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Is a whole chicken always cheaper than chicken pieces?", answer: "No. A whole chicken can offer good value when its cuts and carcass will be used, but current prices, freezer space and the parts your household prefers all matter." },
    { question: "Do I need to joint a whole chicken?", answer: "No. Roasting it whole and dividing the cooked meat afterwards can work just as well. Jointing is useful when different cuts will be cooked in different dinners." },
    { question: "What can I do with a chicken carcass?", answer: "Use it to make stock or soup if that fits your cooking. If it will not be used, include that honestly when deciding whether a whole chicken represents value." },
    { question: "When are chicken pieces the better choice?", answer: "Pieces can make more sense for cooking for one, limited freezer space, a dinner needing one particular cut, or anyone who would rather not handle a whole raw bird." }
  ]
};
var WHOLE_CHICKEN_VALUE_GUIDE_SECTIONS = [
  { paragraphs: [
    "Stand at the chicken counter for long enough and the choice repeats itself every week: a whole bird sitting next to trays of breasts, thighs and drumsticks, sometimes at a lower price per kilogram but asking more of you in return. It's tempting to treat the whole chicken as the automatically cheaper option, but that only holds if the price per kilogram and the portions you'll actually use both stack up. A whole bird that ends up half-used in the freezer isn't better value than a tray of thighs bought for a specific dinner and eaten in full.",
    "The short answer is that a whole chicken can offer good value, but only when it's used across more than one dinner. That depends less on the price tag and more on storage space, freezer habits and whether jointing or roasting a whole bird is something the household is willing to do."
  ] },
  { title: "What a whole chicken gives you", paragraphs: [
    "A typical whole chicken breaks down into two breasts, two thighs, two drumsticks, two wings and a carcass useful for stock or soup. The exact size and number of portions varies by bird and by how it is divided.",
    "Buying pieces means paying for exactly the cut wanted and nothing else. Buying whole means paying for all of it at once, including parts that take more planning to use well, such as the carcass and wings. Whether that is a good trade depends on what happens to those parts after the shop.",
    "Bird sizes vary enough that it is worth checking the weight on the label rather than assuming. A smaller chicken suits a household eating lightly or wanting less to store; a larger one gives more scope for splitting across dinners, provided there is freezer space to match."
  ] },
  { title: "Three ways to use it", paragraphs: [
    "There is no fixed plan, and a single chicken will not stretch to a guaranteed number of dinners in every household. These are examples of how the different parts tend to get used rather than a formula.",
    "Roast the whole bird with vegetables for one dinner, then carve and store whatever is not eaten. Use cooked shredded meat from a roast, or raw breast and thigh meat cooked separately, in a dinner built around rice, pasta or a curry-style sauce later in the week. Simmer the carcass and any smaller scraps into stock, soup or a casserole.",
    "Some households get three distinct dinners out of one chicken this way; others get two, or one dinner plus stock in the freezer for later. What matters more than the exact count is whether the parts get used within a sensible timeframe rather than sitting at the back of the freezer indefinitely."
  ] },
  { title: "Roast whole or joint it first?", paragraphs: [
    "Roasting the bird whole is the simplest approach: cook it, carve it, and divide or freeze whatever is not eaten straight away. This suits anyone who wants one dinner now and does not mind sorting the rest afterwards.",
    "Jointing before cooking gives more flexibility, as breasts, thighs, drumsticks and wings can be used in different dinners across the week. It does mean handling raw poultry directly, which some people would rather avoid.",
    "Jointing is entirely optional. For anyone who does want to learn, BBC Good Food has a video guide and Jamie Oliver includes step-by-step jointing tips in the linked chicken recipe below."
  ] },
  { title: "Handling, freezing and cooking chicken", paragraphs: [
    "Keep raw chicken and its utensils separate from food that will be eaten raw, wash hands after handling it, and cook poultry all the way through. The Food Standards Agency gives current cooking guidance.",
    "Freezing is what makes splitting a chicken across several dinners realistic. Portions can be frozen raw after jointing, or cooked after a roast. Label them with the date and defrost in the fridge before cooking. Without a plan to freeze at least some of it, a whole chicken tends to get eaten in one or two sittings, narrowing the value gap with buying pieces."
  ] },
  { title: "When pre-cut chicken may make more sense", paragraphs: [
    "A whole chicken is not automatically the better choice. Cooking for one makes a whole bird harder to use before it needs freezing or eating up, and limited freezer space makes it difficult to store parts that will not be cooked immediately.",
    "Some people are simply less comfortable handling raw whole poultry than a packaged cut, and that is a reasonable preference. Sometimes a dinner calls for one particular cut, in which case buying it directly is more straightforward. Convenience has a value of its own, even when it is not the lowest option per kilogram."
  ] },
  { title: "How to compare fairly in the shop", paragraphs: [
    "Compare the price per kilogram, not only the total on the label, since pack sizes differ and a whole bird can have a larger total price. Think honestly about how much of the bird will actually get used, not only the parts that sound appealing.",
    "Check use-by dates and freezer space before committing to a bigger bird than the household can get through. Decide in advance whether the carcass and wings are likely to become stock, or whether they will sit in the freezer unused. There is no shame in choosing pieces if stock-making does not fit the week."
  ] },
  { title: "Verdict", paragraphs: [
    "A whole chicken can make the weekly shop go further, but only when there is a reasonably realistic plan for the parts, not just the roast dinner. Bought with no particular plan, it can just as easily become another ingredient that goes unused.",
    "For dinners built around meat that is already cooked, the leftover roast chicken guide picks up from there. This guide is about the buying decision itself; that one is about what to do with what is left over."
  ], relatedLink: { label: "Nine budget dinners with leftover roast chicken", url: "/guides/9-budget-dinners-with-leftover-roast-chicken" } }
];
var WHOLE_CHICKEN_VALUE_GUIDE_RECORD = {
  id: "is-a-whole-chicken-better-value-than-chicken-pieces",
  slug: "is-a-whole-chicken-better-value-than-chicken-pieces",
  path: WHOLE_CHICKEN_VALUE_GUIDE_PATH,
  canonicalPath: WHOLE_CHICKEN_VALUE_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...WHOLE_CHICKEN_VALUE_GUIDE,
  metaDescription: WHOLE_CHICKEN_VALUE_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURES,
  disclosureFooter: WHOLE_CHICKEN_VALUE_GUIDE_DISCLOSURE_FOOTER,
  sections: WHOLE_CHICKEN_VALUE_GUIDE_SECTIONS,
  cta: {
    title: "Find chicken recipes for dinner",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and find a recipe that suits your household.",
    label: "Find chicken recipes",
    href: "/signin"
  }
};

// src/content/fiveADayGuide.ts
var FIVE_A_DAY_GUIDE_PATH = "/guides/do-vegetables-in-dishes-count-towards-5-a-day";
var FIVE_A_DAY_GUIDE = {
  title: "Do vegetables in dishes count towards your 5 A Day?",
  seoTitle: "Vegetables in dishes and your 5 A Day | DinnerByDesign",
  description: "Find out how vegetables in Bolognese, paella, chilli and other dishes count towards your 5 A Day, including portions and the effect of cooking.",
  publishedAt: "2026-07-24",
  reviewedAt: "2026-07-24",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Nutrition guide",
  primarySearchIntent: "Understand whether vegetables cooked into a dish count towards 5 A Day and how portions should be calculated",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-24",
  editorialNotes: "Keep the portion rules aligned with current NHS guidance. The worked calculation is illustrative and does not represent a specific DinnerByDesign recipe.",
  internalLinks: ["/guides", "/nutrition-methodology", "/signin"],
  disclosures: ["serving_assumption", "source_timing"],
  sources: [
    { label: "NHS: 5 A Day, what counts?", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/" },
    { label: "NHS: 5 A Day portion sizes", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/" },
    { label: "NHS: Why 5 A Day?", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/why-5-a-day/" },
    { label: "British Heart Foundation: What counts as 5-a-day?", url: "https://www.bhf.org.uk/informationsupport/heart-matters-magazine/nutrition/5-a-day/what-counts-as-5-a-day" },
    { label: "American Journal of Clinical Nutrition: Lycopene bioavailability study", url: "https://doi.org/10.1093/ajcn/66.1.116" }
  ]
};
var escapeHtml4 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var extractArticleSections = (initialHtml) => {
  const match = initialHtml.match(/<article>([\s\S]*?)<\/article>/);
  if (!match) throw new Error("5 A Day guide HTML is missing article content.");
  return match[1];
};
function renderFiveADayGuideLegacyInitialHtml() {
  const guide = FIVE_A_DAY_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FIVE_A_DAY_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(FIVE_A_DAY_DISCLOSURE_FOOTER);
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml4(source.url)}">${escapeHtml4(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Nutrition guide</nav><p>Nutrition guide</p><h1>${escapeHtml4(guide.title)}</h1><p>${escapeHtml4(guide.description)}</p><p>By ${escapeHtml4(guide.editorialOwner)} \xB7 Published 24 July 2026 \xB7 Last reviewed 24 July 2026</p><article><section><p>Onion, carrot, celery and tomato go into the pan for a Bolognese. Four vegetables, and a natural assumption follows: that is four portions of your 5 A Day, sorted. It is not quite that simple, though the vegetables are not wasted either.</p><p>They still count. Cooking, mixing and serving vegetables inside a dish does not cancel them out. What changes is the maths, not the eligibility.</p></section><section><h2>Vegetables cooked into a dish still count</h2><p>The NHS is direct on this point: fruit and vegetables do not have to be eaten on their own to count, and they do not have to be fresh. Frozen, tinned and dried varieties are all eligible, and so are vegetables cooked into soups, stews, curries and pasta sauces.</p><p>That covers much of what a UK household cooks on a weeknight. A chilli made with tinned tomatoes and kidney beans, a paella built on peppers and peas, or a curry base of onion and garlic can all contribute. Cooking a vegetable into a sauce does not remove it from the count.</p><p>Base ingredients people may overlook can contribute too. Onion counts when enough reaches the plate. Concentrated tomato pur\xE9e follows a different calculation from fresh tomato, with one heaped tablespoon counting as a portion.</p></section><section><h2>Variety and portion count are not the same thing</h2><p>This is where the confusion usually starts. Four vegetable varieties in a recipe reads as four portions, but a portion is a quantity, not a headcount of ingredients.</p><p>An adult portion is roughly 80g of eligible vegetable, and it has to reach the plate. A Bolognese made with onion, carrot, celery and tomato may deliver only one or two full portions per serving once the total vegetable weight is divided across everyone eating it. The dish contains four varieties. It is unlikely to contain four portions.</p><p>Potatoes are a separate case and worth flagging early. They are classed as a starchy food by the NHS, not a vegetable, so they do not count towards the total, however they are cooked.</p></section><section><h2>Working out what a dinner is actually giving you</h2><p>For ordinary fresh, frozen or tinned vegetables, the calculation is straightforward once the ingredient weights are known. Pur\xE9es, dried produce, beans and pulses each follow their own rule instead. Add up the eligible vegetable weight in the full recipe, divide by the number of servings, then divide that figure by 80.</p><ul><li>800g eligible vegetables in the pot</li><li>Recipe serves four</li><li>200g vegetables per serving</li><li>200 \xF7 80 = roughly 2.5 portions per serving</li></ul><p>Treat that as an estimate rather than a fixed figure. Trimming, ingredient swaps and how generously a dish is served can all move the number up or down. A recipe listing four vegetables and a recipe delivering four portions on the plate are two different things, and the gap between them is usually where people overestimate.</p></section>${disclosures}<section><h2>Does cooking reduce the benefit?</h2><p>Some vitamins are heat-sensitive, and prolonged cooking does reduce levels of certain ones, vitamin C among them. That is a real trade-off, not a reason to write off cooked vegetables generally.</p><p>Cooking can also improve access to certain nutrients. The clearest evidence is for tomatoes: a controlled trial found that lycopene from tomato paste was substantially more available to the body than the same dose from fresh tomato, when both were eaten alongside a source of fat. That finding is specific to tomatoes and to this comparison. It is not a general rule that cooking improves nutrient absorption across vegetables.</p><p>Tinned, frozen and dried forms can all contribute, though not always by the same rule. Tinned and frozen vegetables match fresh weight for weight. Dried fruit is measured differently, at 30g rather than 80g. Beans and pulses can count only once per day, however much of them you eat.</p></section><section><h2>Getting more from dinners you already cook</h2><p>Reaching a higher portion count rarely means changing what is on the menu. Smaller adjustments to a recipe already in rotation tend to move the number more than switching to something new.</p><p>Bulking a Bolognese or chilli with extra tinned tomatoes or added vegetables such as mushrooms and peppers raises the total vegetable weight without changing the dish. Beans and pulses are a partial exception: a second tin adds volume and fibre, but it does not add a second portion, since beans and pulses can count only once per day.</p><p>The ratio of sauce to servings matters too. Stretching a sauce from four servings to six leaves each serving at about two-thirds of its original amount. The drop still reduces what each person gets.</p></section><section><h2>The short version</h2><p>A dish with several vegetable ingredients is not the same as a dish with several portions. Cooking does not disqualify a vegetable from the 5 A Day count, and tinned, frozen and dried forms can all contribute, though each follows its own rule rather than one shared 80g calculation. What determines the portion figure is weight per serving, not the number of vegetables listed. Working that out, even roughly, is a better guide than counting ingredients on the packet.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Put the vegetables you have to use</h2><p>Tell DinnerByDesign what needs using, along with your time, budget and preferences, and find a dinner that fits.</p><p><a href="/signin">Find a dinner</a></p></section></main></div>`;
}
var FIVE_A_DAY_GUIDE_RECORD = {
  id: "do-vegetables-in-dishes-count-towards-5-a-day",
  slug: "do-vegetables-in-dishes-count-towards-5-a-day",
  path: FIVE_A_DAY_GUIDE_PATH,
  canonicalPath: FIVE_A_DAY_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...FIVE_A_DAY_GUIDE,
  metaDescription: FIVE_A_DAY_GUIDE.description,
  label: "Nutrition guide",
  nextReviewAt: "2027-07-24",
  disclosureItems: FIVE_A_DAY_DISCLOSURES,
  disclosureFooter: FIVE_A_DAY_DISCLOSURE_FOOTER,
  sections: [{ rawHtml: extractArticleSections(renderFiveADayGuideLegacyInitialHtml()) }],
  faqs: [
    {
      question: "Do vegetables cooked into sauces count towards 5 A Day?",
      answer: "Yes. Vegetables can count when they are cooked into sauces, soups, stews, curries and similar dishes, as long as enough eligible vegetable reaches the serving."
    },
    {
      question: "Does one vegetable ingredient mean one portion?",
      answer: "No. A portion is based on quantity, not the number of different vegetables listed. For most fresh, frozen or tinned vegetables, an adult portion is about 80g."
    },
    {
      question: "Do potatoes count towards 5 A Day?",
      answer: "No. The NHS treats potatoes as a starchy food rather than a vegetable for 5 A Day counting."
    }
  ],
  cta: {
    title: "Put the vegetables you have to use",
    copy: "Tell DinnerByDesign what needs using, along with your time, budget and preferences, and find a dinner that fits.",
    label: "Find a dinner",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderSources: false
};

// src/content/homeCookedReadyMadeGuide.ts
var HOME_COOKED_READY_MADE_GUIDE_PATH = "/guides/home-cooked-or-ready-made-dinners";
var HOME_COOKED_READY_MADE_GUIDE = {
  title: "Home-cooked or ready-made? The honest comparison",
  seoTitle: "Home-cooked vs ready-made dinners: an honest comparison | DinnerByDesign",
  description: "Compare home-cooked and ready-made dinners on cost, portions, ingredient waste, nutrition labels, safety and everyday effort.",
  publishedAt: "2026-07-24",
  reviewedAt: "2026-07-24",
  nextReviewAt: "2027-07-24",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking and nutrition guide",
  primarySearchIntent: "Compare home-cooked and ready-made dinners beyond convenience, including portions, waste, labels, nutrition, cost and safety",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-24",
  editorialNotes: "Evidence-led comparison. Keep conclusions product-specific and avoid presenting either option as universally better.",
  internalLinks: ["/guides", "/food-costs/make-low-cost-dinners-more-interesting", "/nutrition-methodology", "/food-safety", "/pricing-methodology", "/signin"],
  disclosures: ["price_comparison", "serving_assumption", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Public Health Nutrition: UK comparison of ready-made and home-cooked dishes",
      url: "https://doi.org/10.1017/S1368980023000034"
    },
    {
      label: "GOV.UK: Food labelling, giving food information to consumers",
      url: "https://www.gov.uk/guidance/food-labelling-giving-food-information-to-consumers"
    },
    {
      label: "Institute for Fiscal Studies: Product reformulation and dietary salt intake",
      url: "https://ifs.org.uk/articles/product-reformulation-effective-reducing-dietary-salt-intake"
    },
    {
      label: "Food Standards Agency: Cooking and reheating food safely",
      url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food"
    }
  ]
};
var HOME_COOKED_READY_MADE_SECTIONS = [
  {
    paragraphs: [
      "It's a common assumption: cooking from scratch is always the better choice, and ready-made is what you fall back on when time or energy runs short. The comparison looks different once portion size, ingredient waste, cooking energy and someone's actual circumstances are counted alongside taste and cost.",
      "Neither option wins in every situation. Ready-made dinners offer predictable quantities, clear on-pack information and no leftover ingredients from that particular dish. Home cooking generally gives more control over vegetables, fibre and seasoning, and the available UK evidence suggests it's usually less expensive and can have a lower environmental impact. But that answer shifts once cooking energy, unused ingredients and the value of someone's time are factored in."
    ]
  },
  {
    title: "Where ready-made genuinely helps",
    paragraphs: [
      "A ready-made dish is sized once, by the manufacturer, and doesn't need judging by eye. That single fact explains most of its real advantages:",
      "This matters more for some households than others. A one-person household, someone with an irregular schedule, or anyone managing limited time or energy can find these advantages genuinely useful, not just convenient. That said, a manufacturer's serving size is a standard figure, not necessarily the right amount for a particular appetite."
    ],
    bullets: [
      "A predictable pack and serving size, rather than an estimate",
      "No half-used onion, herbs, cream or specialist sauce left over from that dish",
      "Clear calorie and nutrient information printed on the pack",
      "Consistent preparation instructions every time",
      "Very little preparation or washing up",
      "Accessibility for anyone short on time, energy, equipment or cooking confidence"
    ]
  },
  {
    title: "The limits of those advantages",
    paragraphs: [
      "Those advantages have edges. A fixed pack can still be too large for one person or too small for two. Packaging itself creates a different form of waste, even when the ingredients inside are used in full. Storage and reheating instructions still need following properly for the dish to be safe to eat.",
      "Nutrition declarations are useful, but they're average values rather than a measurement of the exact dish in front of you. Front-of-pack claims such as 'high protein' or 'under 500 calories' usually highlight one attractive figure, not the nutritional quality of the whole dish."
    ]
  },
  {
    title: "Where home cooking tends to perform better",
    paragraphs: [
      "Home cooking tends to offer more control over salt, added sugar, fat and portion size, along with more scope to add vegetables, pulses and wholegrain ingredients. A recipe can be adjusted around a dietary preference in a way a fixed product can't. Ingredients also tend to work out cheaper on average, provided the full pack gets used rather than part of it going to waste, and batch cooking or scaling up for a family is usually easier.",
      "None of that makes home cooking automatically inexpensive or nutritious. A homemade creamy pasta bake can still carry more salt, saturated fat or calories than a carefully chosen supermarket alternative. The advantage depends on the recipe actually cooked, not on the fact that it was cooked at home."
    ]
  },
  {
    title: "What the UK research found",
    paragraphs: [
      "A 2023 UK study from the Rowett Institute at the University of Aberdeen compared fifty-four chilled or frozen ready-made dishes against their home-cooked equivalents, using UK national dietary survey data. A few findings are worth knowing directly, rather than assuming:",
      "The study didn't fully account for cooking costs, the time and effort of cooking, or differences in serving size between a ready-made pack and a home-cooked portion. It's also a comparison of this specific dataset, not a verdict on every ultra-processed dish or every home-cooked equivalent. Broader concerns about heavily processed food are a separate discussion from what this particular study measured."
    ],
    bullets: [
      "Ready-made versions contained significantly more free sugar overall.",
      "The researchers did not find a significant difference in salt or fat content between the two.",
      "Ready-made versions generally cost more per 100g.",
      "Animal-based dishes had higher emissions than plant-based ones, whether ready-made or home-cooked.",
      "Animal-based ready-made dishes cooked in an oven produced the highest emissions and were the most expensive of everything compared."
    ]
  },
  {
    title: "Has reformulation narrowed the difference?",
    paragraphs: [
      "Manufacturers have reduced salt and altered formulations across several UK product categories over the past two decades. Analysis of UK grocery purchases found a measurable decline in average salt content, and that the decline was driven by manufacturers reformulating products rather than by people choosing different ones. That's a genuine improvement, but it doesn't mean every current ready-made range now matches home cooking nutritionally. The practical approach is to judge the actual product in front of you rather than a claim printed on the front of the pack."
    ]
  },
  {
    title: "A practical decision guide",
    paragraphs: ["A few realistic situations help make the choice less abstract:"],
    bullets: [
      "Cooking for one with an unpredictable week: a single ready-made dish may prevent more waste than a part-used set of ingredients.",
      "Cooking for a family: home cooking will often provide better value and easier serving flexibility.",
      "Monitoring calories, protein or salt: a labelled pack can be easier to record accurately than an unweighed recipe.",
      "Trying to cut salt or add more vegetables: home cooking usually gives more control.",
      "Short on energy: whichever option gets a proper dinner eaten is the sensible one on that particular day.",
      "Using the same ingredients across several dinners: home cooking becomes considerably more economical once full packs are used rather than partly wasted."
    ]
  },
  {
    title: "The useful middle ground",
    paragraphs: ["This doesn't have to be an either-or decision. A few small combinations get some of the benefit of both:"],
    bullets: [
      "Add frozen vegetables to a ready-made curry.",
      "Serve a ready-made lasagne with a side salad or peas.",
      "Use a prepared sauce, but add your own vegetables and protein.",
      "Freeze spare portions of a home-cooked dish individually, so they behave like a ready-made option later in the week.",
      "Choose frozen chopped vegetables and herbs to cut down on the ingredient waste that home cooking can otherwise create."
    ]
  },
  {
    title: "Conclusion",
    paragraphs: [
      "Ready-made dinners tend to win on effort, predictability and straightforward labelling. Home cooking usually offers more control and often better value, particularly when ingredients are fully used rather than left to spoil. The better choice depends on the specific product, the specific recipe, the household cooking it, and what's actually likely to be eaten rather than wasted."
    ]
  }
];
var HOME_COOKED_READY_MADE_FAQS = [
  {
    question: "Are ready-made dinners always less healthy?",
    answer: "Not always. UK research comparing fifty-four ready-made dishes with home-cooked equivalents found significantly more free sugar in the ready-made versions, but no significant difference in salt or fat. Nutritional quality depends on the specific product, not the category as a whole."
  },
  {
    question: "Are the calories on packaged food exact?",
    answer: "No. Nutrition declarations are mandatory on most prepacked food in Great Britain, but the figures are average values that allow for natural variation, not an exact measurement of the individual pack in your hand."
  },
  {
    question: "Is home cooking always cheaper?",
    answer: "Usually, but not automatically. It tends to work out cheaper when ingredients are bought in full packs and actually used, rather than partly wasted. Cooking energy, equipment and the time involved aren't part of most straightforward cost comparisons."
  },
  {
    question: "Which option creates less food waste?",
    answer: "It depends what's being measured. Ready-made avoids the leftover ingredients that a single home-cooked dish can create, but it introduces its own packaging waste. Freezing spare home-cooked portions individually can reduce ingredient waste, particularly when reusable containers are used."
  },
  {
    question: "Are ready-made dishes safer than home-cooked ones?",
    answer: "Not inherently. Ready-made dishes come with standardised preparation instructions, but they still need to be stored and heated correctly to be safe, just as a home-cooked dish does."
  },
  {
    question: "How can I make a ready-made dinner more balanced?",
    answer: "Frozen vegetables, a side salad or extra protein are straightforward additions that can round out a ready-made dish without much extra effort."
  }
];
var escapeHtml5 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var HOME_COOKED_READY_MADE_DISCLOSURES_FOR_RECORD = HOME_COOKED_READY_MADE_GUIDE.disclosures.map((key) => {
  const disclosure = HOME_COOKED_READY_MADE_DISCLOSURES.find((item) => item.key === key);
  if (!disclosure) throw new Error(`Missing home-cooked ready-made disclosure for ${key}`);
  return disclosure;
});
var extractArticleSections2 = (initialHtml) => {
  const match = initialHtml.match(/<article>([\s\S]*?)<\/article>/);
  if (!match) throw new Error("Home-cooked or ready-made guide HTML is missing article content.");
  return match[1];
};
var renderSection = (section) => {
  const heading = section.title ? `<h2>${escapeHtml5(section.title)}</h2>` : "";
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  const bullets = section.bullets?.length ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml5(item)}</li>`).join("")}</ul>` : "";
  return `<section>${heading}<p>${escapeHtml5(firstParagraph)}</p>${bullets}${remainingParagraphs.map((paragraph) => `<p>${escapeHtml5(paragraph)}</p>`).join("")}</section>`;
};
function renderHomeCookedReadyMadeGuideLegacyInitialHtml() {
  const guide = HOME_COOKED_READY_MADE_GUIDE;
  const sectionHtml = HOME_COOKED_READY_MADE_SECTIONS.map(renderSection);
  const disclosures = renderProgrammaticDisclosuresInitialHtml(HOME_COOKED_READY_MADE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER);
  const faqs = HOME_COOKED_READY_MADE_FAQS.map((faq) => `<section><h3>${escapeHtml5(faq.question)}</h3><p>${escapeHtml5(faq.answer)}</p></section>`).join("");
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml5(source.url)}">${escapeHtml5(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking and nutrition guide</nav><p>Practical cooking and nutrition guide</p><h1>${escapeHtml5(guide.title)}</h1><p>${escapeHtml5(guide.description)}</p><p>By ${escapeHtml5(guide.editorialOwner)} \xB7 Published 24 July 2026 \xB7 Last reviewed 24 July 2026</p><article>${sectionHtml.slice(0, 3).join("")}${disclosures}${sectionHtml.slice(3).join("")}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Related guidance</h2><p><a href="/food-costs/make-low-cost-dinners-more-interesting">See how to make low-cost dinners more interesting</a>.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find the option that fits tonight</h2><p>Search home-cooked recipes or ready-made supermarket options around your time, budget and preferences.</p><p><a href="/signin">Find a dinner</a> \xB7 <a href="/guides">Browse all guides</a></p></section></main></div>`;
}
var HOME_COOKED_READY_MADE_GUIDE_RECORD = {
  id: "home-cooked-or-ready-made-dinners",
  slug: "home-cooked-or-ready-made-dinners",
  path: HOME_COOKED_READY_MADE_GUIDE_PATH,
  canonicalPath: HOME_COOKED_READY_MADE_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...HOME_COOKED_READY_MADE_GUIDE,
  metaDescription: HOME_COOKED_READY_MADE_GUIDE.description,
  label: "Practical cooking and nutrition guide",
  disclosureItems: HOME_COOKED_READY_MADE_DISCLOSURES_FOR_RECORD,
  disclosureFooter: HOME_COOKED_READY_MADE_DISCLOSURE_FOOTER,
  sections: [{ rawHtml: extractArticleSections2(renderHomeCookedReadyMadeGuideLegacyInitialHtml()) }],
  faqs: HOME_COOKED_READY_MADE_FAQS,
  cta: {
    title: "Find the option that fits tonight",
    copy: "Search home-cooked recipes or ready-made supermarket options around your time, budget and preferences.",
    label: "Find a dinner",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};

// src/content/chickenThighCostGuide.ts
var CHICKEN_THIGH_COST_GUIDE_PATH = "/recipes/5-chicken-thigh-recipes-for-four-aldi-cost-estimates";
var CHICKEN_THIGH_COST_GUIDE = {
  title: "Five chicken thigh recipes for four with Aldi cost estimates",
  seoTitle: "Five Chicken Thigh Recipes for Four with Aldi Cost Estimates | DinnerByDesign",
  description: "Compare five established chicken thigh recipes for four using Aldi UK cost estimates, including ingredient value, full-pack cost and price per serving.",
  publishedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  nextReviewAt: "2026-10-27",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Recipe cost comparison",
  primarySearchIntent: "Compare chicken thigh recipes for four by estimated Aldi ingredient and full-pack cost",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-27",
  editorialNotes: "Curated external recipes with original methods retained by their publishers. DinnerByDesign supplies cost and practical-use analysis only.",
  internalLinks: ["/recipes", "/pricing-methodology", "/recipe-methodology", "/food-safety", "/signin"],
  disclosures: ["price_estimate", "price_comparison", "serving_assumption", "source_timing", "storage_and_cooking", "allergen_and_product"],
  status: "published",
  sources: [
    { label: "Tesco Real Food: Easy chicken traybake", url: "https://realfood.tesco.com/recipes/easy-chicken-traybake.html" },
    { label: "Aldi: Chicken Proven\xE7al and vegetable stew", url: "https://www.aldi.co.uk/recipes/courses/mains/chicken-provencal-and-vegetable-stew" },
    { label: "Aldi: One Pot at Home Chicken", url: "https://www.aldi.co.uk/recipes/courses/mains/one-pot-at-home-chicken" },
    { label: "Sainsbury\u2019s Magazine: Quick chicken and lentil curry", url: "https://www.sainsburysmagazine.co.uk/recipes/curries/easy-chicken-and-lentil-curry" },
    { label: "delicious. magazine: Quick chicken noodles", url: "https://www.deliciousmagazine.co.uk/recipes/quick-chicken-noodles/" },
    { label: "Aldi: Ashfields chicken thighs", url: "https://www.aldi.co.uk/product/ashfields-chicken-thighs-000000000000382103" },
    { label: "Aldi: Ashfields chicken thigh fillets", url: "https://www.aldi.co.uk/product/ashfields-chicken-thigh-fillets-000000000000416054" },
    { label: "Aldi: Ashfields chicken breast fillets", url: "https://www.aldi.co.uk/product/ashfields-chicken-breast-fillets-000000000000383730" },
    { label: "Aldi: Nature\u2019s Pick brown onions", url: "https://www.aldi.co.uk/product/nature-s-pick-brown-onions-000000000000339777" },
    { label: "Aldi: Nature\u2019s Pick British baking potatoes", url: "https://www.aldi.co.uk/product/nature-s-pick-british-baking-potatoes-000000000000339757" },
    { label: "Aldi: Nature\u2019s Pick carrots", url: "https://www.aldi.co.uk/product/nature-s-pick-carrots-000000000000339791" },
    { label: "Aldi: Nature\u2019s Pick mixed peppers", url: "https://www.aldi.co.uk/product/nature-s-pick-mixed-peppers-000000000000275392" },
    { label: "Aldi: Four Seasons garden peas", url: "https://www.aldi.co.uk/product/four-seasons-garden-peas-000000000000366805" },
    { label: "Aldi: Everyday Essentials chopped tomatoes", url: "https://www.aldi.co.uk/product/everyday-essentials-chopped-tomatoes-in-tomato-juice-000000000000278702" },
    { label: "Aldi: Worldwide Foods basmati rice", url: "https://www.aldi.co.uk/product/worldwide-foods-basmati-rice-000000000000262344" },
    { label: "Aldi: Solesta sunflower oil", url: "https://www.aldi.co.uk/product/solesta-sunflower-oil-000000000000198481" },
    { label: "Aldi: Solesta olive oil", url: "https://www.aldi.co.uk/product/solesta-olive-oil-000000000000511100" },
    { label: "Aldi: Nature\u2019s Pick courgettes", url: "https://www.aldi.co.uk/product/nature-s-pick-courgettes-000000000000339808" },
    { label: "Aldi: Worldwide Foods red lentils", url: "https://www.aldi.co.uk/product/worldwide-foods-red-lentils-000000000000336258" },
    { label: "Aldi: Ready, Set\u2026Cook! medium curry powder", url: "https://www.aldi.co.uk/product/ready-set-cook-medium-curry-powder-000000000336690001" },
    { label: "Aldi: Nature\u2019s Pick red onions", url: "https://www.aldi.co.uk/product/nature-s-pick-red-onions-000000000000339914" },
    { label: "Aldi: Nature\u2019s Pick garlic", url: "https://www.aldi.co.uk/product/nature-s-pick-garlic-000000000000273810" },
    { label: "Aldi: Everyday Essentials wonky lemons", url: "https://www.aldi.co.uk/product/everyday-essentials-wonky-lemons-000000000000268496" },
    { label: "Aldi: Nature\u2019s Pick limes", url: "https://www.aldi.co.uk/product/nature-s-pick-limes-000000000000285988" },
    { label: "Aldi: Bramwells peri-peri seasoning", url: "https://www.aldi.co.uk/product/bramwells-peri-peri-seasoning-000000000337370007" },
    { label: "Aldi: Bramwells medium peri-peri sauce and marinade", url: "https://www.aldi.co.uk/product/bramwells-medium-peri-peri-sauce-marinade-000000000337375001" }
  ]
};
var CHICKEN_THIGH_COMPARED_RECIPES = [
  {
    title: "Easy chicken traybake",
    publisher: "Tesco Real Food",
    url: "https://realfood.tesco.com/recipes/easy-chicken-traybake.html",
    serves: "4",
    timing: "5 minutes preparation, 1 hour cooking",
    ingredientValue: "\xA35.61\u2013\xA35.87",
    perServing: "\xA31.40\u2013\xA31.47",
    fullPack: "\xA310.60\u2013\xA311.10",
    rows: [["Chicken", "\xA32.24"], ["Vegetables and fruit", "\xA32.03"], ["Carbohydrate", "\xA30.60"], ["Other ingredients", "\xA30.74\u2013\xA31.00"]],
    description: "A single-tray combination of chicken thighs, potatoes, peppers, onion, courgette and Greek-style salad cheese. It is the longest-cooking option here, but most of that time is hands-off.",
    practicalNote: "Best for a low-effort oven dinner when hands-on time needs to stay short. Some courgette, salad cheese and a spare pepper should remain for a stir-fry, omelette, salad or scrambled eggs. Tesco also suggests white potatoes as a substitution.",
    uncertainty: "The Greek-style salad cheese price was not available to verify, so it contributes to the range."
  },
  {
    title: "Chicken Proven\xE7al and vegetable stew",
    publisher: "Aldi",
    url: "https://www.aldi.co.uk/recipes/courses/mains/chicken-provencal-and-vegetable-stew",
    serves: "4",
    timing: "20 minutes preparation, 40 minutes cooking",
    ingredientValue: "\xA34.39\u2013\xA34.45",
    perServing: "\xA31.10\u2013\xA31.11",
    fullPack: "\xA38.10\u2013\xA38.45",
    rows: [["Chicken", "\xA32.99"], ["Vegetables", "\xA30.83"], ["Carbohydrate", "\xA30.40"], ["Other ingredients", "\xA30.17\u2013\xA30.23"]],
    description: "A one-pot stew of chicken thighs, potatoes, carrots, onion and tinned tomatoes. It has the lowest estimated ingredient value and checkout range in this comparison.",
    practicalNote: "Best for a colder evening using ingredients that store for a while. Spare onions and carrots keep well and can form the base of soup, another traybake or another stew.",
    uncertainty: "Paprika was unverified and the chicken stock cube page showed no current price."
  },
  {
    title: "One Pot at Home Chicken",
    publisher: "Aldi",
    url: "https://www.aldi.co.uk/recipes/courses/mains/one-pot-at-home-chicken",
    serves: "4",
    timing: "15 minutes preparation, 35 minutes cooking",
    ingredientValue: "\xA38.19\u2013\xA38.41",
    perServing: "\xA32.05\u2013\xA32.10",
    fullPack: "\xA317.97\u2013\xA319.32",
    rows: [["Chicken", "\xA34.39"], ["Vegetables", "\xA31.02"], ["Carbohydrate", "\xA30.73"], ["Other ingredients", "\xA32.05\u2013\xA32.27"]],
    description: "A boneless-thigh option with rice, vegetables and a broader seasoning list. Its estimated ingredient value is higher than the other four, while the one-pot format may still appeal when washing-up is the deciding factor.",
    practicalNote: "Best when a complete, well-seasoned dinner from familiar supermarket ingredients appeals. The remaining spices and stock pots keep well; fresh coriander is better used within a few days. The 80ml olive oil is included in ingredient value but its complete pack is excluded from checkout cost.",
    uncertainty: "Paprika, oregano, dried chilli flakes and fresh coriander were unverified. Tomato pur\xE9e and the chicken stock pot had no current price."
  },
  {
    title: "Quick chicken and lentil curry",
    publisher: "Sainsbury\u2019s Magazine",
    url: "https://www.sainsburysmagazine.co.uk/recipes/curries/easy-chicken-and-lentil-curry",
    serves: "4",
    timing: "10 minutes preparation, 30 minutes total",
    ingredientValue: "\xA35.52\u2013\xA35.77",
    perServing: "\xA31.38\u2013\xA31.44",
    fullPack: "\xA310.71\u2013\xA311.36",
    rows: [["Chicken", "\xA33.66"], ["Vegetables", "\xA30.82\u2013\xA31.00"], ["Carbohydrate", "\xA30.65"], ["Other ingredients", "\xA30.39\u2013\xA30.46"]],
    description: "The shortest stated total time in the group. Red lentils add substance alongside the chicken, and the curry powder keeps the seasoning list compact.",
    practicalNote: "Best when time is short and a curry is wanted. Spare lentils keep for months, while the yoghurt and spinach can move into a marinade, another curry or pasta.",
    uncertainty: "Fresh spinach and low-fat natural yoghurt were unverified, and the chicken stock cube page showed no current price."
  },
  {
    title: "Quick chicken noodles",
    publisher: "delicious. magazine",
    url: "https://www.deliciousmagazine.co.uk/recipes/quick-chicken-noodles/",
    serves: "4",
    timing: "25 minutes hands-on time",
    ingredientValue: "\xA35.82\u2013\xA36.62",
    perServing: "\xA31.46\u2013\xA31.66",
    fullPack: "\xA39.91\u2013\xA311.51",
    rows: [["Chicken", "\xA33.66"], ["Vegetables", "\xA31.41\u2013\xA31.91"], ["Carbohydrate", "\xA30.57\u2013\xA30.77"], ["Other ingredients", "\xA30.18\u2013\xA30.28"]],
    description: "A lighter, quicker-looking option using chicken, noodles and crisp vegetables. The recipe calls for four chicken thighs; the estimate assumes about 500g of boneless thigh fillets.",
    practicalNote: "Best for a warm-weather or quick evening when a salad-style dish appeals. Optional herbs, peanuts and spring onions are excluded. Fish sauce, sugar and unused rice noodles can carry into another dinner.",
    uncertainty: "Cucumber, fresh chilli, dried rice noodles or vermicelli, fish sauce and caster sugar were unverified."
  }
];
var CHICKEN_THIGH_COST_FAQS = [
  {
    question: "Are chicken thighs cheaper than chicken breasts?",
    answer: "Often, but not always. At the Aldi prices checked on 27 July 2026, bone-in thighs cost substantially less per kilogram than chicken breast fillets. Promotions, pack sizes and the amount of bone or skin can change the useful comparison."
  },
  {
    question: "Are bone-in chicken thighs cheaper than boneless thigh fillets?",
    answer: "They usually have a lower shelf price per kilogram. Boneless fillets may be easier to prepare and can suit quicker recipes, so the better choice depends on time, edible yield and the dish."
  },
  {
    question: "Did DinnerByDesign create or test these recipes?",
    answer: "No. Each recipe belongs to the named publisher. DinnerByDesign has not developed, reproduced or kitchen-tested the recipes; use the publisher\u2019s page for quantities, timings and method."
  },
  {
    question: "Why are the Aldi cost estimates shown as ranges?",
    answer: "Twelve ingredients could not be verified with a current Aldi online price, while three more were confirmed unavailable with no price displayed. Low and high working values keep that uncertainty visible instead of presenting a false single figure."
  },
  {
    question: "What is the difference between ingredient value and full-pack cost?",
    answer: "Ingredient value estimates the share of each pack used in the recipe. Full-pack cost estimates what you might pay when buying the required packs from scratch, with the stated cupboard assumptions. Neither figure includes cooking energy."
  }
];
var GUIDE_DISCLOSURES = [
  {
    key: "price_estimate",
    title: "About these estimates",
    body: "Prices were checked on Aldi UK on 27 July 2026. Ingredient value estimates only the quantities used; full-pack cost estimates the packs needed when starting from scratch, subject to the cupboard assumptions shown. Cooking energy is excluded."
  },
  {
    key: "price_comparison",
    title: "Why every cost is a range",
    body: "Twelve ingredients could not be verified with a current online price. Three more, chicken stock cubes, chicken stock pots and tomato pur\xE9e, were checked directly and showed no price because they were unavailable. Working low and high values are used for all fifteen."
  },
  {
    key: "serving_assumption",
    title: "Serving assumption",
    body: "Every comparison uses the publisher\u2019s four-serving recipe. Appetite, portion size, substitutions and additional sides may change the quantities required."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Recipes and products can contain regulated allergens, including milk, fish, gluten, soya, nuts or celery. Check the original recipe and every current product label before cooking."
  },
  {
    key: "storage_and_cooking",
    title: "Cooking and storage",
    body: "Follow the original publisher\u2019s method, the chicken pack instructions and current Food Standards Agency guidance. Keep raw chicken separate and cook it thoroughly until steaming hot throughout."
  },
  {
    key: "source_timing",
    title: "Editorial and price review",
    body: "Recipe pages, product pages and cost calculations were reviewed on 27 July 2026. Retailer prices, pack sizes, promotions and availability can change."
  }
];
var GUIDE_FOOTER = {
  body: "DinnerByDesign selected established recipes for comparison and added cost, substitution, occasion and waste-use analysis. It did not write, reproduce or kitchen-test the recipes. Use the original publisher for quantities, timings and method.",
  links: [
    { href: "/recipes", label: "Recipes and cooking ideas" },
    { href: "/pricing-methodology", label: "How prices are calculated" },
    { href: "/recipe-methodology", label: "How dinners are selected" },
    { href: "/food-safety", label: "Food safety" }
  ]
};
var GUIDE_DISCLOSURES_FOR_RECORD = CHICKEN_THIGH_COST_GUIDE.disclosures.map((key) => {
  const disclosure = GUIDE_DISCLOSURES.find((item) => item.key === key);
  if (!disclosure) throw new Error(`Missing chicken thigh disclosure for ${key}`);
  return disclosure;
});
var escapeHtml6 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var extractArticleSections3 = (initialHtml) => {
  const match = initialHtml.match(/<article>([\s\S]*?)<\/article>/);
  if (!match) throw new Error("Chicken thigh cost guide HTML is missing article content.");
  return match[1];
};
var renderCostTable = (recipe) => {
  const rows = recipe.rows.map(([category, estimate]) => `<tr><td>${escapeHtml6(category)}</td><td>${escapeHtml6(estimate)}</td></tr>`).join("");
  return `<div class="guide-table-wrap"><table><thead><tr><th>Cost group</th><th>Estimated ingredient value</th></tr></thead><tbody>${rows}<tr><th>Total ingredient value</th><th>${escapeHtml6(recipe.ingredientValue)}</th></tr><tr><td>Estimated cost per serving</td><td>${escapeHtml6(recipe.perServing)}</td></tr><tr><td>Estimated full-pack cost</td><td>${escapeHtml6(recipe.fullPack)}</td></tr></tbody></table></div>`;
};
function renderChickenThighCostGuideLegacyInitialHtml() {
  const guide = CHICKEN_THIGH_COST_GUIDE;
  const recipes = CHICKEN_THIGH_COMPARED_RECIPES.map((recipe, index) => `
    <section>
      <h2>${index + 1}. ${escapeHtml6(recipe.publisher)}: ${escapeHtml6(recipe.title)}</h2>
      <p><strong>Serves:</strong> ${escapeHtml6(recipe.serves)} \xB7 <strong>Publisher\u2019s timing:</strong> ${escapeHtml6(recipe.timing)}</p>
      <p>${escapeHtml6(recipe.description)}</p>
      ${renderCostTable(recipe)}
      <p><strong>Which occasion suits it:</strong> ${escapeHtml6(recipe.practicalNote)}</p>
      <p><strong>Price uncertainty:</strong> ${escapeHtml6(recipe.uncertainty)}</p>
      <p><a href="${escapeHtml6(recipe.url)}">See the original ${escapeHtml6(recipe.publisher)} recipe for quantities and method</a></p>
    </section>
  `).join("");
  const faqs = CHICKEN_THIGH_COST_FAQS.map((faq) => `<section><h3>${escapeHtml6(faq.question)}</h3><p>${escapeHtml6(faq.answer)}</p></section>`).join("");
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml6(source.url)}">${escapeHtml6(source.label)}</a></li>`).join("");
  const disclosures = renderProgrammaticDisclosuresInitialHtml(GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(GUIDE_FOOTER);
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/recipes">Recipes and cooking ideas</a> / Recipe cost comparison</nav><p>Recipe cost comparison</p><h1>${escapeHtml6(guide.title)}</h1><p>${escapeHtml6(guide.description)}</p><p>By ${escapeHtml6(guide.editorialOwner)} \xB7 Published 27 July 2026 \xB7 Last reviewed 27 July 2026</p><article>
    <section>
      <p>Chicken thighs are a flexible cut and, gram for gram, are often cheaper than chicken breast. That is not guaranteed everywhere: prices, pack sizes and promotions move, and bone-in and boneless packs are not identical comparisons. Thighs do, though, work across very different cooking styles, from a slow traybake to a quick noodle dinner.</p>
      <p>These five established recipes come from Tesco, Aldi, Sainsbury\u2019s Magazine and delicious. magazine. DinnerByDesign has compared their estimated Aldi ingredient value, price per serving and full-pack cost so you can see where the differences come from.</p>
      <p>DinnerByDesign did not develop, reproduce or kitchen-test these recipes. The complete quantities, timings and method remain on each publisher\u2019s page. Our contribution is the Aldi cost calculation, affordability comparison, substitutions, waste considerations and a view on which occasion each recipe may suit.</p>
    </section>
    <section>
      <h2>Why chicken thighs can suit cost-conscious cooking</h2>
      <p>At the Aldi prices checked, bone-in, skin-on chicken thighs cost \xA32.99 per kilogram, compared with \xA37.22 per kilogram for the referenced fresh chicken breast fillets. Boneless thigh fillets were \xA37.32 per kilogram. These figures are specific to Aldi UK on 27 July 2026; this article does not compare other retailers.</p>
      <p>Two recipes below use bone-in thighs and three use boneless fillets. That is each publisher\u2019s choice, not something DinnerByDesign changed, and it helps explain part of the cost difference between the five.</p>
    </section>
    ${disclosures}
    ${recipes}
    <section>
      <h2>How the five recipes compare</h2>
      <ul>
        <li><strong>Lowest estimated ingredient value:</strong> Aldi\u2019s Chicken Proven\xE7al and vegetable stew at \xA34.39\u2013\xA34.45, or \xA31.10\u2013\xA31.11 per serving.</li>
        <li><strong>Lowest estimated full-pack cost:</strong> the same Aldi stew at \xA38.10\u2013\xA38.45.</li>
        <li><strong>Shortest stated total time:</strong> Sainsbury\u2019s Magazine\u2019s curry at 30 minutes. The noodle recipe lists 25 minutes hands-on time, which is not directly comparable with total time.</li>
        <li><strong>Best for using cupboard ingredients:</strong> the Aldi stew has the shortest supporting ingredient list.</li>
        <li><strong>Most obvious fresh-ingredient reuse:</strong> the Tesco traybake leaves courgette, pepper and salad cheese that can move into another dinner.</li>
      </ul>
      <p>At the checked Aldi prices, bone-in chicken thighs were \xA32.99 per kilogram and boneless thigh fillets were \xA37.32 per kilogram. That gap helps explain why the stew estimates below the boneless-thigh options, although bone, skin and edible yield mean price per kilogram is not the whole answer.</p>
    </section>
    <section>
      <h2>What could not be priced exactly</h2>
      <p>Twelve items remained unverified: paprika, oregano, dried chilli flakes, fresh coriander, Greek-style salad cheese, fresh spinach, low-fat natural yoghurt, dried rice noodles or vermicelli, cucumber, fish sauce, caster sugar and fresh red chilli.</p>
      <p>Three more were checked and confirmed unavailable with no price shown: chicken stock cubes, chicken stock pots and tomato pur\xE9e. The ranges on this page cover all fifteen affected prices. Verified ingredients use the Aldi prices shown on the linked product pages.</p>
      <p>Where Aldi displayed a promotion, including courgettes and mixed peppers, the regular non-promotional price was used. Cooking oil, salt and pepper are generally treated as cupboard ingredients. The exception is the 80ml olive oil in One Pot at Home Chicken, which is included in ingredient value but not as a complete pack at checkout. Optional serving ingredients are excluded.</p>
    </section>
    <section><h2>Frequently asked questions</h2>${faqs}</section>
    <section><h2>Sources</h2><ul>${sources}</ul></section>
    ${footer}
  </article><section><h2>Compare recipes with your own budget</h2><p>Use DinnerByDesign to search for recipes that fit your ingredients, preferences and available time.</p><p><a href="/signin">Find a recipe</a></p></section></main></div>`;
}
var CHICKEN_THIGH_COST_GUIDE_RECORD = {
  id: "five-chicken-thigh-recipes-for-four-aldi-cost-estimates",
  slug: "5-chicken-thigh-recipes-for-four-aldi-cost-estimates",
  path: CHICKEN_THIGH_COST_GUIDE_PATH,
  canonicalPath: CHICKEN_THIGH_COST_GUIDE_PATH,
  category: "recipes",
  reviewSensitivity: "price-sensitive",
  ...CHICKEN_THIGH_COST_GUIDE,
  metaDescription: CHICKEN_THIGH_COST_GUIDE.description,
  label: "Recipe cost comparison",
  disclosureItems: GUIDE_DISCLOSURES_FOR_RECORD,
  disclosureFooter: GUIDE_FOOTER,
  breadcrumbRoot: { label: "Recipes and cooking ideas", url: "/recipes" },
  sections: [{ rawHtml: extractArticleSections3(renderChickenThighCostGuideLegacyInitialHtml()) }],
  faqs: CHICKEN_THIGH_COST_FAQS,
  cta: {
    title: "Compare recipes with your own budget",
    copy: "Use DinnerByDesign to search for recipes that fit your ingredients, preferences and available time.",
    label: "Find a recipe",
    href: "/signin"
  },
  jsonLdGraphItems: [
    {
      "@type": "ItemList",
      "@id": `https://dinnerbydesign.app${CHICKEN_THIGH_COST_GUIDE_PATH}#recipes`,
      numberOfItems: CHICKEN_THIGH_COMPARED_RECIPES.length,
      itemListElement: CHICKEN_THIGH_COMPARED_RECIPES.map((recipe, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: recipe.title,
        url: recipe.url
      }))
    }
  ],
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};

// src/content/nineBudgetDinnersWithPotatoesGuide.ts
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH = "/guides/nine-budget-dinners-with-potatoes";
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on budget wording", body: "This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen." },
  { key: "storage_and_cooking", title: "Storage and cooking safety", body: "Cool, store and reheat cooked potato and other leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Fish, eggs, dairy, sausages, pesto, mustard, stock and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings." }
];
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE = {
  title: "Nine budget dinners with potatoes",
  seoTitle: "Nine budget dinners with potatoes | DinnerByDesign",
  description: "Nine varied potato-led dinners from established recipe sources, with practical ideas for leftovers, cupboard ingredients and reducing waste.",
  publishedAt: "2026-08-09",
  reviewedAt: "2026-08-09",
  nextReviewAt: "2027-02-09",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using potatoes",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-09",
  editorialNotes: "Nine source-led potato dinners that show how one bag can support varied cooking without treating potatoes as automatically the lowest-cost or superior staple.",
  internalLinks: ["/guides", "/recipes", "/guides/nine-budget-friendly-dinners-with-eggs", "/guides/nine-budget-dinners-with-tinned-vegetables", "/guides/nine-budget-dinners-built-around-bubble-and-squeak", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Spanish tortilla, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/spanish-tortilla" },
    { label: "Dum aloo potato curry, Krumpli", url: "https://www.krumpli.co.uk/dum-aloo-curry/" },
    { label: "Sausage, onion and potato tray bake, Love Food Hate Waste", url: "https://www.lovefoodhatewaste.com/foods-and-recipes/sausage-onion-and-potato-tray-bake" },
    { label: "Pea & mint fishcakes, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/pea-mint-fishcakes" },
    { label: "Bubble & squeak, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/bubble-squeak" },
    { label: "Leek and potato soup, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/leek-and-potato-soup?navref=quicklink" },
    { label: "Gnocchi with creamy tomato & spinach sauce, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/10338/gnocchi-with-creamy-tomato-and-spinach-sauce" },
    { label: "Golden veggie shepherd's pie, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/10035/golden-veggie-shepherds-pie" },
    { label: "Potato hash with greens, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/potato-hash-with-greens" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Which potatoes work best for these dinners?", answer: "Use the variety suggested by the source recipe where it specifies one. Otherwise, choose what is already in the cupboard and adapt the cooking time until the potato is tender." },
    { question: "Can leftover cooked potato be used in these dinners?", answer: "Yes. Spanish tortilla, fishcakes, bubble and squeak, shepherd\u2019s pie and hash are all useful places for cooked potato, provided it has been cooled and stored safely." },
    { question: "Can I use tinned potatoes?", answer: "The dum aloo recipe specifically includes instructions for tinned new potatoes. They can be useful when peeling and boiling fresh potatoes is not practical." },
    { question: "Are potatoes always the lowest-cost staple?", answer: "No. The best value depends on the shop, season, pack size and what is already at home. Potatoes are useful because one bag can take several different forms across the week." }
  ]
};
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_SECTIONS = [
  { paragraphs: [
    "Potatoes work well in cost-conscious cooking for practical reasons rather than any single one. A bag keeps for weeks in a cool, dark place, so it does not need using up in a hurry the way fresh vegetables often do. It combines easily with whatever else is around, whether that is a tin of something, a handful of frozen vegetables, a few eggs or the last of a joint of meat.",
    "None of that means potatoes are always the lowest-cost option, or that they are nutritionally superior to rice, pasta or other staples. A single bag can, though, support several genuinely different dinners across a week, particularly when it is paired with cupboard basics rather than served on its own.",
    "The nine dinners below are taken from established recipe publishers. Each uses potato differently: as the base of a curry, folded into a fry-up, layered under a pie, stirred into soup, or bound into cakes and dumplings."
  ] },
  { title: "1. Spanish tortilla", paragraphs: [
    "A thick potato and onion omelette, cooked slowly until the base and edges are golden and the middle is just set, served warm or at room temperature. BBC Good Food lists it as serving four, with thirty minutes of preparation and fifty minutes of cooking.",
    "Potato is the bulk of the dish rather than a side. A pepper, leftover cooked vegetables or a handful of peas can go in with the onion, and cooked potato from an earlier dinner can reduce the preparation time."
  ] },
  { title: "2. Dum aloo potato curry", paragraphs: [
    "Krumpli\u2019s North Indian and Bangladeshi potato curry fries new potatoes in ghee, then simmers them in a spiced tomato gravy thickened with cashew nuts and finished with cream. It serves two and gives instructions for tinned new potatoes as well as fresh.",
    "Serve it with rice or flatbread when that suits the household. The sauce keeps for three to five days, making it a reasonable one to prepare ahead."
  ] },
  { title: "3. Sausage, onion and potato tray bake", paragraphs: [
    "Love Food Hate Waste combines sausages, onion and thickly sliced new potatoes with oil, mustard and thyme, then roasts everything together in one tray. It serves four and takes forty minutes.",
    "Potatoes and onion make up most of the volume, allowing a modest number of sausages to cover the whole dish. The recipe notes that the potatoes need washing rather than peeling, and leftover portions should be refrigerated and reheated only once until piping hot."
  ] },
  { title: "4. Pea and mint fishcakes", paragraphs: [
    "Flaked cooked fish is mixed with mashed potato, pea and mint pesto, spring onion and egg, shaped into cakes, coated in breadcrumbs and fried until golden. BBC Good Food\u2019s version uses potato to give the fishcakes their bulk and hold them together.",
    "Frozen peas can stand in for fresh, and a small amount of leftover mash has a clear use here. Shape and chill the cakes in advance when that makes the evening easier."
  ] },
  { title: "5. Bubble and squeak", paragraphs: [
    "Cold leftover mash fried with cabbage or sprouts, onion, garlic and a little bacon until crisp at the edges. BBC Good Food\u2019s recipe serves four, with ten minutes of preparation and twenty minutes of cooking.",
    "A fried or poached egg on top makes it a fuller dinner. This is one of the most direct ways to use cooked potato and vegetables from a previous roast rather than letting them sit in the fridge without a plan."
  ], relatedLink: { label: "Nine budget dinners built around bubble and squeak", url: "/guides/nine-budget-dinners-built-around-bubble-and-squeak" } },
  { title: "6. Leek and potato soup", paragraphs: [
    "The Food Standards Agency recipe simmers leeks and potatoes in stock until soft, then seasons and serves the soup with crusty bread. It serves six, takes fifty minutes and is described by the FSA as a low-budget, hearty soup.",
    "Potato gives the soup body without requiring cream or flour. A leek or potato that looks a little tired but is still sound is suitable once it has been trimmed and cooked."
  ] },
  { title: "7. Gnocchi with creamy tomato and spinach sauce", paragraphs: [
    "Potato gnocchi is tossed with a tomato and mascarpone sauce, with spinach wilted through at the end and Parmesan and basil to serve. BBC Good Food lists four servings, with ten minutes of preparation and ten minutes of cooking.",
    "It is a different potato format from the fry-ups and bakes above, closer to pasta. This is also a useful place for the end of a bag of spinach before it wilts beyond use."
  ] },
  { title: "8. Golden veggie shepherd's pie", paragraphs: [
    "A filling of lentils, carrots, celery and mushrooms in a tomato and wine sauce, topped with mashed potato and grated cheddar, then baked until golden. The potato topping turns a pan of lentils and vegetables into a substantial dinner.",
    "The source recipe is designed for batch cooking and freezing in individual portions. Tinned green lentils can replace dried ones when the cooking time needs shortening, and the wine is optional."
  ] },
  { title: "9. Potato hash with greens", paragraphs: [
    "Diced potato is fried with onion and pepper, seasoned with paprika and tarragon, finished with spinach and topped with a poached egg. BBC Good Food lists two servings, with ten minutes of preparation and forty minutes of cooking.",
    "A tin of beans can be stirred through to add bulk, although it is an adaptation rather than part of the published recipe. Poaching the eggs in the reserved potato water saves using a separate pan."
  ] },
  { title: "Storing potatoes and using leftovers", paragraphs: [
    "Keep raw potatoes somewhere cool, dark and well ventilated, rather than in the fridge. A cupboard or paper bag away from direct light works better than a plastic bag, which can trap moisture and speed up sprouting.",
    "Cool cooked potato promptly, cover it and refrigerate it. Eat leftovers within a couple of days and reheat them only once, until piping hot throughout. Check the Food Standards Agency guidance before using anything that has been in the fridge for more than a day or two.",
    "A bag of potatoes does not need to dictate a week of familiar dinners. It can turn up in a curry, soup, pie or fry-up, alongside whatever tinned, frozen or fresh ingredients happen to be around."
  ], relatedLink: { label: "Browse the guides library", url: "/guides" } }
];
var NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD = {
  id: "nine-budget-dinners-with-potatoes",
  slug: "nine-budget-dinners-with-potatoes",
  path: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/fifteenMinuteDinnersGuide.ts
var FIFTEEN_MINUTE_DINNERS_GUIDE_PATH = "/guides/fifteen-minute-dinners-everyday-supermarket-ingredients";
var FIFTEEN_MINUTE_DINNERS_GUIDE = {
  title: "Fifteen-minute dinners from everyday supermarket ingredients",
  seoTitle: "Fifteen-minute dinners from everyday supermarket ingredients | DinnerByDesign",
  description: "Ten publisher recipes with total preparation and cooking times of fifteen minutes or less, plus servings, dietary notes and practical timing caveats.",
  publishedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  nextReviewAt: "2027-02-11",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find fifteen-minute dinners using ordinary supermarket ingredients, with total timings checked against each publisher method",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-11",
  editorialNotes: "Time-led collection of ten published recipes. Publisher timings were checked against the listed method, with product, allergen and defrosting conditions kept visible.",
  internalLinks: [
    "/recipes",
    "/guides",
    "/food-costs/cooking-for-one-without-waste",
    "/food-costs/five-dinners-same-ingredients",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/fresh-or-frozen",
    "/food-safety",
    "/recipe-methodology",
    "/signin"
  ],
  disclosures: [
    "serving_assumption",
    "allergen_and_product",
    "storage_and_cooking",
    "source_timing"
  ],
  sources: [
    {
      label: "delicious. magazine: warm borlotti bean and tuna salad",
      url: "https://www.deliciousmagazine.co.uk/recipes/warm-borlotti-bean-and-tuna-salad/"
    },
    {
      label: "Waitrose: Vietnamese rice noodle stir-fry",
      url: "https://www.waitrose.com/content/waitrose/en/home/recipes/recipe_directory/v/vietnamese-rice-noodlestirfry.html"
    },
    {
      label: "Waitrose: speedy veg noodles with oyster sauce",
      url: "https://www.waitrose.com/ecom/recipe/speedy-veg-noodles-with-oyster-sauce"
    },
    {
      label: "Waitrose: miso cod with sesame veggie noodles",
      url: "https://www.waitrose.com/ecom/recipe/miso-cod-with-sesame-veggie-noodles"
    },
    {
      label: "delicious. magazine: Thai fried egg salad",
      url: "https://www.deliciousmagazine.co.uk/recipes/thai-fried-egg-salad-yum-kai-do/"
    },
    {
      label: "Tesco Real Food: pesto eggs on toast",
      url: "https://realfood.tesco.com/recipes/pesto-eggs-on-toast.html"
    },
    {
      label: "BBC Good Food: 10-minute couscous salad",
      url: "https://www.bbcgoodfood.com/recipes/10minute-couscous-salad"
    },
    {
      label: "BBC Good Food: Indian chickpeas with poached eggs",
      url: "https://www.bbcgoodfood.com/recipes/indian-chickpeas-poached-eggs"
    },
    {
      label: "olive magazine: spaghetti with tuna, capers and chilli",
      url: "https://www.olivemagazine.com/recipes/fish-and-seafood/spaghetti-with-tuna-capers-and-chilli/"
    },
    {
      label: "olive magazine: tortellini in a pea broth",
      url: "https://www.olivemagazine.com/recipes/quick-and-easy/tortellini-in-a-pea-broth/"
    },
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.gov.uk/government/publications/home-food-fact-checker"
    }
  ],
  faqs: [
    {
      question: "What counts as a fifteen-minute dinner?",
      answer: "A dinner with a total preparation and cooking time of fifteen minutes or less, checked against both the publisher's stated figure and the method's own steps. Recipes where the two disagreed were left out rather than included with a caveat."
    },
    {
      question: "Are these dinners suitable for one person?",
      answer: "Most are given as two servings. Halving ingredients works for the salads, egg dishes and pasta dinners. Tinned and jarred ingredients such as beans or sweetcorn can often be kept for a second dinner once opened, but check the product's own label and storage instructions rather than assuming this applies to every item."
    },
    {
      question: "Can frozen vegetables be used?",
      answer: "Yes, where a recipe calls for fresh vegetables that are also sold frozen, such as broccoli, a frozen version can generally be substituted without changing the timing. Peas are an exception here: defrost them first for the tortellini dinner, since that recipe's stated time depends on it."
    },
    {
      question: "Are fifteen-minute dinners always inexpensive?",
      answer: "Not necessarily. Speed and cost are separate filters, and this collection is built around verified timing, not price. Some dinners here will cost more than others depending on what is already in the cupboard."
    },
    {
      question: "How can I make the preparation quicker?",
      answer: "Put the kettle on before starting anything else, and chop vegetables while pasta or noodle water comes to the boil rather than before turning the hob on."
    },
    {
      question: "Can I use leftovers in these dinners?",
      answer: "These recipes are built around fresh or store-cupboard ingredients rather than a pre-cooked component. Leftover rice or cooked chicken can generally be added to the noodle or egg dinners, but this will change the stated timing."
    }
  ]
};
var FIFTEEN_MINUTE_DINNERS_DISCLOSURES = [
  {
    key: "serving_assumption",
    title: "Serving assumptions",
    body: "Most entries use the serving count given by the publisher, usually two servings. Halving or keeping leftovers changes the quantity, storage needs and practical timing for an individual household."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Packaged ingredients such as pesto, stock, oyster sauce, miso sauce, noodles and tortellini vary by brand and may contain allergens. Check the current product label, especially when making a substitution."
  },
  {
    key: "storage_and_cooking",
    title: "Storage and cooking",
    body: "Follow the publisher's method and the storage instructions on each pack. For the tortellini entry, defrost the peas before cooking if the ten-minute timing matters; the publisher's stated time was not verified with peas used straight from frozen."
  },
  {
    key: "source_timing",
    title: "Recipe and timing review",
    body: "The linked publisher recipes, their stated timings and the relevant method steps were checked on 11 August 2026. Publisher pages, products and availability can change, so follow the current source and label."
  }
];
var FIFTEEN_MINUTE_DINNERS_DISCLOSURE_FOOTER = {
  body: "DinnerByDesign selected and compared these published recipes but did not develop or test them. Follow the original publisher\u2019s ingredients, quantities, method, allergen information and current safety advice.",
  links: [
    { href: "/guides", label: "Browse all guides" },
    { href: "/food-safety", label: "Food safety" },
    { href: "/recipe-methodology", label: "How dinners are selected" }
  ]
};
var FIFTEEN_MINUTE_DINNERS_OPENING_HTML = `<section><h2>Introduction</h2><p>Fifteen minutes disappears quickly once chopping, heating and washing up are counted in. The ten dinners below all have a total time of fifteen minutes or less as stated by the original publisher, and each method has been checked step by step rather than taken from the headline figure alone.</p><p>Every dinner here uses everyday supermarket ingredients, though a handful of items, such as miso sauce, oyster sauce, fresh cod and fresh tortellini, are common rather than universal and are not stocked in every branch. That is flagged against the entry where it applies.</p></section>
<section><h2>Quick answer</h2><p>Fifteen minutes means total preparation and cooking time combined, not cooking time alone, and not hands-on time alone. A dinner that cooks in ten minutes but needs twenty minutes of chopping first does not qualify. Nor does a recipe whose own steps, added up in sequence, run past fifteen minutes even if the publisher's headline figure says otherwise. Both kinds of dinner have been left out of this collection.</p><p>Where a recipe's stated time depends on an ingredient being prepared in a particular way in advance, such as defrosted rather than frozen peas, that condition is noted against the entry rather than assumed.</p></section>
<section><h2>At a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Dinner</th><th>Total time</th><th>Servings</th><th>Dietary</th><th>Best suited to</th></tr></thead><tbody><tr><td>Warm borlotti bean and tuna salad</td><td>10 min</td><td>2</td><td>Contains fish; vegan option given</td><td>A lighter dinner with no hob cooking beyond warming the beans</td></tr><tr><td>Vietnamese rice noodle stir-fry</td><td>15 min</td><td>2</td><td>Contains fish, peanuts</td><td>A lighter, citrus-dressed noodle dinner</td></tr><tr><td>Speedy veg noodles with oyster sauce</td><td>15 min</td><td>4</td><td>Contains egg, soya, molluscs, nuts, gluten</td><td>Feeding more than two people</td></tr><tr><td>Miso cod with veggie noodles</td><td>15 min</td><td>2</td><td>Contains fish, soya, sesame, gluten</td><td>A fresh-fish dinner without extra chopping</td></tr><tr><td>Thai fried egg salad</td><td>10 min</td><td>2</td><td>Dairy-free, gluten-free</td><td>A lighter dinner, best paired with rice or bread</td></tr><tr><td>Pesto eggs on toast</td><td>15 min</td><td>2</td><td>Vegetarian, depending on pesto</td><td>Using up half a jar of pesto</td></tr><tr><td>10-minute couscous salad</td><td>10 min</td><td>2</td><td>Vegetarian by ingredients; contains milk, nuts</td><td>A lighter dinner with no hob at all</td></tr><tr><td>Indian chickpeas with poached eggs</td><td>15 min</td><td>2</td><td>Vegetarian</td><td>A fibre-rich dinner with no meat or fish</td></tr><tr><td>Spaghetti with tuna, capers and chilli</td><td>10 min</td><td>4</td><td>Contains fish, gluten</td><td>A dinner with only one thing to cook</td></tr><tr><td>Tortellini in a pea broth</td><td>10 min</td><td>2</td><td>Vegetarian</td><td>A single-pot dinner using frozen peas, defrosted first</td></tr></tbody></table></div></section>`;
var FIFTEEN_MINUTE_DINNERS_ENTRIES_HTML = `<section><h2>The dinners</h2><h3>1. Warm borlotti bean and tuna salad</h3><p><strong>Source:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/warm-borlotti-bean-and-tuna-salad/">delicious. magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes (5 min prep, 5 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Tinned tuna in olive oil, a jar of borlotti beans, red onion, rosemary, red wine vinegar, parsley.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner. The only knife work is finely chopping half a red onion and some parsley; everything else is tin, jar and pan.</p><p><strong>Substitution or preparation note:</strong> The recipe gives a vegan version: leave out the tuna and the dinner still works as a warm bean salad.</p><p><strong>Allergen information:</strong> Contains fish.</p></section>
<section><h3>2. Vietnamese rice noodle stir-fry</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/content/waitrose/en/home/recipes/recipe_directory/v/vietnamese-rice-noodlestirfry.html">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes. Serves 2.</p><p><strong>Key ingredients:</strong> Rice noodles, lime, fish sauce, orange, courgette, carrots, unsalted peanuts.</p><p><strong>Why it suits a weeknight:</strong> Grating the courgette and carrot is the main task; the noodles themselves cook for around three minutes.</p><p><strong>Substitution or preparation note:</strong> A one-pan dinner for two; swap the peanuts for cashews or leave them out for a nut-free version.</p><p><strong>Allergen information:</strong> Contains fish and peanuts.</p></section>
<section><h3>3. Speedy veg noodles with oyster sauce</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/ecom/recipe/speedy-veg-noodles-with-oyster-sauce">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 4.</p><p><strong>Key ingredients:</strong> Fine egg noodles, Tenderstem broccoli, mixed pepper stir-fry, mushrooms, garlic, ginger, oyster sauce.</p><p><strong>Why it suits a weeknight:</strong> Serves four, so it suits feeding more than two people within the same fifteen minutes.</p><p><strong>Substitution or preparation note:</strong> Prepping the garlic, ginger and broccoli while the water comes to the boil keeps this inside fifteen minutes.</p><p><strong>Allergen information:</strong> Contains egg, soya, molluscs, tree nuts and gluten. Oyster sauce formulations vary by brand, so check the specific jar for the full allergen list.</p></section>
<section><h3>4. Miso cod with veggie noodles</h3><p><strong>Source:</strong> <a href="https://www.waitrose.com/ecom/recipe/miso-cod-with-sesame-veggie-noodles">Waitrose</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Cod fillets, miso sauce, noodle-cut vegetable stir-fry, garlic, sesame seeds.</p><p><strong>Why it suits a weeknight:</strong> The fish goes under the grill while the noodles are stir-fried, so both finish together.</p><p><strong>Substitution or preparation note:</strong> This uses fresh cod rather than tinned or frozen fish, and miso sauce is not stocked in every UK supermarket, so check what is in before shopping around it.</p><p><strong>Allergen information:</strong> Contains fish, soya, sesame and gluten. Miso sauce recipes vary between brands, so check the label of the specific product used.</p></section>
<section><h3>5. Thai fried egg salad</h3><p><strong>Source:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/thai-fried-egg-salad-yum-kai-do/">delicious. magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes (5 min prep, 5 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> Eggs, banana shallot, red chilli, garlic, lime juice, fish sauce, coriander.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner: fried eggs dressed with a sharp, salty sauce rather than the usual pasta or noodle base.</p><p><strong>Substitution or preparation note:</strong> The publisher suggests serving this with rice or a leafy salad, since on its own it is a lighter dinner.</p><p><strong>Allergen information:</strong> Contains egg and fish.</p></section>
<section><h3>6. Pesto eggs on toast</h3><p><strong>Source:</strong> <a href="https://realfood.tesco.com/recipes/pesto-eggs-on-toast.html">Tesco Real Food</a></p><p><strong>Total time and servings:</strong> 15 minutes, as stated by the publisher. Serves 2.</p><p><strong>Key ingredients:</strong> Eggs, sourdough bread, chestnut mushrooms, basil, garlic, green pesto.</p><p><strong>Why it suits a weeknight:</strong> Bread-based rather than pasta or rice, and a reasonable way to use half a jar of pesto sitting in the fridge.</p><p><strong>Substitution or preparation note:</strong> Two pans running at once (mushrooms and eggs) keep the timing tight; a grill can be used for the toast instead of a toaster.</p><p><strong>Allergen information:</strong> Contains egg and wheat. Shop-bought pesto typically contains milk and nuts; check the specific jar used.</p></section>
<section><h3>7. 10-minute couscous salad</h3><p><strong>Source:</strong> <a href="https://www.bbcgoodfood.com/recipes/10minute-couscous-salad">BBC Good Food</a></p><p><strong>Total time and servings:</strong> 10 minutes, no hob cooking. Serves 2.</p><p><strong>Key ingredients:</strong> Couscous, hot vegetable stock, spring onions, red pepper, cucumber, feta, pesto, pine nuts.</p><p><strong>Why it suits a weeknight:</strong> A lighter dinner with nothing on the hob: the couscous is simply covered in hot stock and left to absorb it.</p><p><strong>Substitution or preparation note:</strong> Swap the feta and pine nuts for whatever salad vegetables need using up.</p><p><strong>Allergen information:</strong> Contains milk (feta) and nuts (pine nuts). Shop-bought pesto may also contain nuts and milk; check the specific jar used.</p></section>
<section><h3>8. Indian chickpeas with poached eggs</h3><p><strong>Source:</strong> <a href="https://www.bbcgoodfood.com/recipes/indian-chickpeas-poached-eggs">BBC Good Food</a></p><p><strong>Total time and servings:</strong> 15 minutes (5 min prep, 10 min cook). Serves 2.</p><p><strong>Key ingredients:</strong> A tin of chickpeas, yellow pepper, garlic, red chilli, spring onions, ground spices, tomatoes, eggs.</p><p><strong>Why it suits a weeknight:</strong> The chickpea mixture simmers while the eggs poach in a separate pan, so both steps run at once rather than one after the other.</p><p><strong>Substitution or preparation note:</strong> Crushing a few of the chickpeas with a fork thickens the mixture without needing a blender.</p><p><strong>Allergen information:</strong> Contains egg.</p></section>
<section><h3>9. Spaghetti with tuna, capers and chilli</h3><p><strong>Source:</strong> <a href="https://www.olivemagazine.com/recipes/fish-and-seafood/spaghetti-with-tuna-capers-and-chilli/">olive magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes, as stated by the publisher. Serves 4.</p><p><strong>Key ingredients:</strong> Spaghetti, red onion, red chilli, garlic, capers, flat-leaf parsley, lemon, tinned tuna in spring water, olive oil.</p><p><strong>Why it suits a weeknight:</strong> The spaghetti is the only thing that goes near the hob. Everything else is mixed in a bowl while it cooks.</p><p><strong>Substitution or preparation note:</strong> Makes four servings, so this is a good one to halve for a single dinner or keep whole for two dinners across the week.</p><p><strong>Allergen information:</strong> Contains fish and gluten.</p></section>
<section><h3>10. Tortellini in a pea broth</h3><p><strong>Source:</strong> <a href="https://www.olivemagazine.com/recipes/quick-and-easy/tortellini-in-a-pea-broth/">olive magazine</a></p><p><strong>Total time and servings:</strong> 10 minutes, as stated by the publisher. Serves 2.</p><p><strong>Key ingredients:</strong> Stock, a pack of fresh tortellini, frozen peas, basil, lemon, parmesan to serve.</p><p><strong>Why it suits a weeknight:</strong> One pot: the tortellini cooks directly in the stock, with peas added for the final two minutes.</p><p><strong>Substitution or preparation note:</strong> The publisher's ingredient list specifies defrosted peas, not peas straight from frozen. This recipe is verified at ten minutes on that basis; using peas straight from the freezer has not been tested against the stated time, so defrost them ahead of cooking (in the fridge overnight, or in the microwave) if the ten-minute timing matters.</p><p><strong>Allergen information:</strong> Tortellini typically contains wheat and egg, and the filling may contain dairy or meat depending on the variety; check the specific pack used.</p></section>`;
var FIFTEEN_MINUTE_DINNERS_CLOSING_HTML = `<section><h2>Making fifteen minutes realistic</h2><p>A few habits make the difference between a dinner that genuinely takes fifteen minutes and one that quietly takes twenty.</p><ul><li>Put the kettle on before doing anything else, for pasta, noodles or couscous.</li><li>Use frozen vegetables where a recipe suits them; they need no chopping and go straight into the pan.</li><li>Choose quick-cooking pasta or noodle shapes rather than those needing ten minutes or more.</li><li>Prepare ingredients in the order they are needed, not all at once before starting.</li><li>Use one pan where the recipe allows it, to cut down on washing up as well as time.</li><li>Check whether a step needs the oven preheated, and start that before anything else.</li></ul><p>None of this guarantees identical timing in every kitchen. A slower hob, a smaller pan or a less sharp knife will all add minutes that a recipe's stated time does not account for.</p><p>Several of these dinners use part of a tin, jar or pack. Follow the guidance on the packaging for storing what is left, including any use-by date once opened.</p></section>
<section><h2>When a fifteen-minute dinner may not suit</h2><p>Cooking for more than two people, an unfamiliar technique, a dietary substitution, or a recipe with more chopping than usual can all push a fifteen-minute dinner past its stated time. The dinners above are a starting point, not a guarantee, and the notes against each one flag where this is most likely.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><p>For dinners built around a single person's shopping, see <a href="/food-costs/cooking-for-one-without-waste">DinnerByDesign's guidance on cooking for one</a>. For a longer view of the week ahead, the <a href="/food-costs/five-dinners-same-ingredients">shared-ingredient guide</a> and <a href="/food-costs/portion-planning-and-food-waste">portion-planning guidance</a> can help you adjust choices to your household and what is already in the cupboard.</p></section>`;
var FIFTEEN_MINUTE_DINNERS_SECTIONS = [
  { rawHtml: FIFTEEN_MINUTE_DINNERS_OPENING_HTML },
  { rawHtml: FIFTEEN_MINUTE_DINNERS_ENTRIES_HTML },
  { rawHtml: FIFTEEN_MINUTE_DINNERS_CLOSING_HTML }
];
var FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD = {
  id: "fifteen-minute-dinners-everyday-supermarket-ingredients",
  slug: "fifteen-minute-dinners-everyday-supermarket-ingredients",
  path: FIFTEEN_MINUTE_DINNERS_GUIDE_PATH,
  canonicalPath: FIFTEEN_MINUTE_DINNERS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...FIFTEEN_MINUTE_DINNERS_GUIDE,
  metaDescription: FIFTEEN_MINUTE_DINNERS_GUIDE.description,
  label: "Practical cooking guide",
  internalLinks: FIFTEEN_MINUTE_DINNERS_GUIDE.internalLinks.filter((path2) => path2 !== "/recipes"),
  disclosureItems: FIFTEEN_MINUTE_DINNERS_DISCLOSURES,
  disclosureFooter: FIFTEEN_MINUTE_DINNERS_DISCLOSURE_FOOTER,
  sections: FIFTEEN_MINUTE_DINNERS_SECTIONS,
  sourcesTitle: "Sources and further reading",
  cta: {
    title: "Find a dinner for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn a fifteen-minute idea into a plan for your household.",
    label: "Find a dinner",
    href: "/signin"
  }
};

// src/content/nineBudgetDinnersWithRiceGuide.ts
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH = "/guides/nine-budget-dinners-with-rice";
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURES = [
  { key: "price_comparison", title: "A note on budget wording", body: "This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen." },
  { key: "storage_and_cooking", title: "Storage and cooking safety", body: "Cool, store and reheat cooked rice and other leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary." },
  { key: "allergen_and_product", title: "Ingredients and allergens", body: "Fish, eggs, dairy, stock, pesto, mustard, coconut products and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner." },
  { key: "source_timing", title: "Source review", body: "The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings." }
];
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURE_FOOTER = {
  body: "This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.",
  links: [{ href: "/guides", label: "Browse all guides" }, { href: "/food-safety", label: "Food safety" }]
};
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE = {
  title: "Nine budget dinners with rice",
  seoTitle: "Nine budget dinners with rice | DinnerByDesign",
  description: "Nine varied rice-led dinners from established recipe sources, with practical ideas for leftovers, cupboard ingredients and reducing waste.",
  publishedAt: "2026-08-09",
  reviewedAt: "2026-08-09",
  nextReviewAt: "2027-02-09",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find budget dinner ideas using rice",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-09",
  editorialNotes: "Nine source-led rice dinners that show how one cupboard staple can support varied cooking without treating rice as automatically the lowest-cost or superior staple.",
  internalLinks: ["/guides", "/recipes", "/guides/nine-budget-friendly-dinners-with-eggs", "/guides/nine-budget-dinners-with-tinned-vegetables", "/guides/nine-budget-dinners-three-cuisines", "/food-safety", "/signin"],
  disclosures: ["price_comparison", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Easy egg-fried rice, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/egg-fried-rice" },
    { label: "Tomato & chickpea curry, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry" },
    { label: "Zesty lentil & haddock pilaf, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/zesty-lentil-haddock-pilaf" },
    { label: "Next level kedgeree, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/next-level-kedgeree" },
    { label: "Mushroom risotto, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/mushroom-risotto" },
    { label: "Vegetable & bean chilli, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli" },
    { label: "Smoky spiced jollof rice & coconut-fried plantain, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/smoky-spiced-jollof-rice-coconut-fried-plantain" },
    { label: "Stuffed peppers with rice, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/easy-stuffed-peppers" },
    { label: "Cauliflower baked rice, BBC Good Food", url: "https://www.bbcgoodfood.com/recipes/cauliflower-baked-rice" },
    { label: "Cooking your food, Food Standards Agency", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Can I use leftover rice for these dinners?", answer: "Egg-fried rice and stuffed peppers are useful options for properly cooled and refrigerated cooked rice. Follow Food Standards Agency guidance before using leftovers." },
    { question: "Which rice should I buy?", answer: "Use the type named by the source recipe. Basmati, easy-cook, risotto rice and ready-cooked pouches behave differently, so swapping them can change the result." },
    { question: "Does rice always make a dinner low cost?", answer: "No. The cost depends on the other ingredients, pack size and what is already at home. Rice is useful because it can take many different forms across the week." },
    { question: "Can rice be used beyond curries and stir-fries?", answer: "Yes. This guide includes pilaf, kedgeree, risotto, chilli, jollof rice, stuffed peppers and a baked rice dish." }
  ]
};
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_SECTIONS = [
  { paragraphs: [
    "A bag of rice keeps for months in the cupboard, which makes it a sensible thing to have in whether or not there is a specific dinner planned around it. It works with vegetables, eggs, beans, fish and small amounts of meat, and it moves easily between cuisines, from a curry to a risotto to a stir-fry.",
    "Rice is not always the lowest-cost staple, or nutritionally better than pasta, potatoes or bread. A single bag can still support a varied run of dinners, particularly when it is paired with whatever else is already in the cupboard, fridge or freezer that week.",
    "Cooked rice needs careful handling. Check the Food Standards Agency guidance before building a dinner around rice that has been in the fridge for a day or two."
  ] },
  { title: "1. Easy egg-fried rice", paragraphs: ["A stir-fry of rice, egg, onion and spring onion, seasoned to taste. BBC Good Food lists four servings, with ten minutes of preparation and ten minutes of cooking.", "Cold, day-old rice fries well, making this a direct use for a rice-based leftover. Frozen peas, sweetcorn or diced carrot are useful additions when vegetables need using."] },
  { title: "2. Tomato and chickpea curry", paragraphs: ["Chickpeas warmed in a spiced tomato and coconut sauce, served with rice. It serves four, with ten minutes of preparation and forty-five minutes of cooking.", "Rice turns a tinned-ingredient sauce into dinner. The sauce freezes well on its own, so it can be paired with freshly cooked rice on a different night."] },
  { title: "3. Zesty lentil and haddock pilaf", paragraphs: ["Rice and lentils are folded through with flaked smoked haddock, lemon zest and parsley, then topped with almonds and crisp fried onions. It serves four, with four minutes of preparation and sixteen minutes of cooking.", "Rice and lentils give the dish its bulk, so a modest amount of fish goes a long way. The almonds can be left out and another smoked or white fish can be used instead."] },
  { title: "4. Next level kedgeree", paragraphs: ["Smoked haddock in a curried, cream-enriched sauce, stirred through rice and topped with a poached egg, coriander and garam masala. It serves four, with thirty minutes of preparation and forty-five minutes of cooking.", "The sauce can be made a day ahead and kept chilled for up to two days, then reheated with freshly cooked rice. Frozen peas are an optional addition in the source recipe."] },
  { title: "5. Mushroom risotto", paragraphs: ["Arborio rice is cooked with stock made from soaked dried mushrooms, fresh mushrooms, butter and cheese until creamy and tender. It serves four, with five minutes of preparation and twenty-five minutes of cooking, plus soaking.", "This is the dinner where the rice itself does most of the work. The source suggests chicken, roasted pumpkin or butternut squash as ways to vary it."] },
  { title: "6. Vegetable and bean chilli with rice", paragraphs: ["A chilli of courgette, peppers, red lentils, tomatoes, sweetcorn and butter beans, served with rice. It serves four, with ten minutes of preparation and thirty-five minutes of cooking.", "Rice gives the chilli a useful base, and the sauce freezes well for another dinner. Tinned beans and whatever vegetables need using can keep it flexible."] },
  { title: "7. Smoky spiced jollof rice", paragraphs: ["Rice cooks in a smoky blended tomato and pepper sauce and is served with coconut-fried plantain. It serves six, with ten minutes of preparation and forty minutes of cooking.", "The source recipe freezes half the tomato and pepper mix for a future dinner, which makes the next batch simpler to prepare."] },
  { title: "8. Stuffed peppers with rice", paragraphs: ["Peppers are softened in the microwave, then filled with ready-cooked rice, pesto, olives and goat\u2019s cheese before cooking again until hot. It serves four, with five minutes of preparation and ten minutes of cooking.", "The recipe uses ready-cooked rice pouches as a cupboard standby. Properly cooled leftover rice can be used instead, and another soft cheese can replace goat\u2019s cheese."] },
  { title: "9. Cauliflower baked rice", paragraphs: ["Rice bakes under foil with cauliflower, onion, dried fruit and boiling water until tender, then is finished with feta, olives and herbs. It serves six to eight, with fifteen minutes of preparation and forty-five minutes of cooking.", "The rice cooks directly in the oven rather than being boiled separately, making this the only baked rice dinner on the list. Broccoli or leeks can stand in for some of the cauliflower."] },
  { title: "Using rice across the week", paragraphs: [
    "There is no need to cook a large pan of rice and work through it without a plan. Cook a fresh batch for one dinner, such as the tomato and chickpea curry, then use properly cooled and refrigerated rice in egg-fried rice or stuffed peppers later in the week.",
    "A limited shop does not have to mean a repetitive one. Rice can become a curry, risotto, stuffed pepper, smoky one-pot dish or a bake, each with a different flavour and texture."
  ], relatedLink: { label: "Browse the guides library", url: "/guides" } }
];
var NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_RECORD = {
  id: "nine-budget-dinners-with-rice",
  slug: "nine-budget-dinners-with-rice",
  path: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  ...NINE_BUDGET_DINNERS_WITH_RICE_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_SECTIONS,
  cta: {
    title: "Find dinners for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.",
    label: "Find dinners",
    href: "/signin"
  }
};

// src/content/familyDinnersForFussyEatersGuide.ts
var FAMILY_FUSSY_EATERS_GUIDE_PATH = "/guides/family-dinners-for-fussy-eaters-one-base-flexible-finishes";
var FAMILY_FUSSY_EATERS_GUIDE = {
  title: "Family dinners for fussy eaters: one base, flexible finishes",
  seoTitle: "Family dinners for fussy eaters: one base, flexible finishes | DinnerByDesign",
  description: "A practical way to cook one mild base and finish it differently for children and adults, with flexible formats, freezer planning and food-safety guidance.",
  publishedAt: "2026-08-13",
  reviewedAt: "2026-08-13",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Plan family dinners for children with different food preferences using one mild base and flexible finishes",
  indexingStatus: "index",
  contentReviewedAt: "2026-08-13",
  editorialNotes: "Draft V approved 13 August 2026. The 1kg mince quantity is explicitly presented as a planning estimate, not a tested recipe yield. Food-safety guidance was checked against current Food Standards Agency pages and child-feeding guidance was checked against Healthier Together.",
  internalLinks: [
    "/dinner-plans/5-affordable-family-dinners-for-four",
    "/food-costs/batch-cooking-on-a-budget",
    "/food-costs/portion-planning-and-food-waste",
    "/food-safety",
    "/recipe-methodology",
    "/pricing-methodology"
  ],
  disclosures: FAMILY_FUSSY_EATERS_DISCLOSURES.map((disclosure) => disclosure.key),
  sources: [
    { label: "Food Standards Agency: Cooking your food", url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food" },
    { label: "Food Standards Agency: How to chill, freeze and defrost food safely", url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely" },
    { label: "Healthier Together: Taste, texture and food fussiness", url: "https://sybhealthiertogether.nhs.uk/parentscarers/general-wellbeing/food-eating/taste-texture-and-food-fussiness" }
  ]
};
var FAMILY_FUSSY_EATERS_GUIDE_SECTIONS = [
  {
    rawHtml: `<p>One person wants pasta with nothing on it. Someone else wants a dinner with a bit of spice. You're standing at the hob wondering whether tonight is, again, going to mean two or three separate dinners.</p><p>This is an ordinary problem in households where children eat differently from each other or from the adults. It's rarely about fussiness alone. Texture matters to a lot of children. So does familiarity. Some find a plate with everything touching genuinely harder to manage than the same food served apart.</p><p>The method below won't resolve every eating difficulty, and it isn't trying to. What it offers is a way to cook one dinner that finishes several ways, so the person cooking isn't running two or three separate jobs on a weeknight. One base, several finishes, fewer separate jobs.</p><section><h2>What \u201Cone base, flexible finishes\u201D means</h2><p>Start with something mild. A tomato and mince base, a pot of shredded chicken, a tray of roasted vegetables: none of it needs seasoning strong enough to suit everyone, because the seasoning happens afterwards, not during cooking.</p><p>Keep the strong stuff separate. Chilli, harissa, a sharper sauce, a spoon of mustard stirred through for the adults: these sit in small bowls at the table rather than in the pan. Each person then finishes or assembles their own serving, which is a different job from cooking five different dinners. It's one dinner with several endings.</p><p>Whatever base is left gets stored properly and used again within a few days, ideally with a different format the second time round so it doesn't read as a repeat. A base cooked on Monday can turn up as a jacket potato filling on Wednesday without anyone feeling short-changed.</p></section><section><h2>Five base formats that work this way</h2><p>These are the formats that tend to hold up across a working week. Each one supports more than one finish, and each one can be scaled up deliberately so there's something left for later.</p><h3>Mild tomato base with beef, lentils or beans</h3><p>Cooked gently with onion, tomato and a small amount of stock, this is plain enough to serve over pasta with nothing more than grated cheese. The same pot, warmed through with a spoonful of chilli or paprika stirred in separately, becomes an adult's dinner. It also works over rice, in a jacket potato, or as a filling for a wrap.</p><h3>Plain shredded chicken or chicken thighs</h3><p>Poached or roasted without strong seasoning, chicken like this can go into a bowl with rice and cucumber for a child who wants things kept apart, or get tossed through a sauce for someone who doesn't. It keeps well and reheats without drying out if handled carefully.</p><h3>Baked potatoes with separate fillings</h3><p>The potato does most of the work here. Butter and cheese for one plate, baked beans or the tomato base for another, a sharper filling for the adults. Nothing needs to be cooked twice, only served differently.</p><h3>Rice with a mild protein and optional toppings</h3><p>A pan of plain rice with plain chicken, tofu or beans sitting alongside it lets each person build their own bowl. Toppings such as grated cheese, sweetcorn or a mild sauce stay in small dishes rather than mixed through everything.</p><h3>Soft roasted vegetables with pasta, couscous or flatbreads</h3><p>Roasted courgette, pepper and squash can be blended into a smooth sauce if that texture is more acceptable, left visible and separate for another child, and dressed with a stronger sauce for the adults. This is one option among several, not a rule, and some children do better when vegetables stay recognisable rather than hidden.</p></section><section><h2>Making it work on an ordinary weeknight</h2><p>Strong flavours go on last. Chilli, fresh herbs, a squeeze of lime: added at the table rather than in the pan, so the base itself stays neutral enough for everyone.</p><p>One familiar item alongside something less familiar may be easier for some children than presenting an entirely new dinner. A child who trusts the rice is more likely to try the new topping sitting next to it.</p><p>Dips, grated cheese, yoghurt or a piece of fruit can round out a plate without anyone having to cook a second dinner from scratch. These are additions, not compensations, and they're worth keeping stocked for exactly this purpose.</p><p>A plain component is a legitimate part of the dinner, not a failure of the dinner. Texture is worth checking as carefully as flavour: a child who avoids sauce may be responding to how it feels rather than how it tastes.</p><p>Where it suits the household, letting a child assemble their own wrap, bowl or jacket potato hands over some of the decision-making, which can lower resistance on its own. And leftovers used this way are a plan, not a container pushed to the back of the fridge because nobody quite knew what to do with it.</p></section><section><h2>A five-dinner example</h2><p>This plan uses one base all week: a mild tomato base with beef, lentils or beans. It's cooked once, in a larger batch than a single dinner needs, and carried through five different formats rather than restarted each night.</p><p><strong>Night one:</strong> the base freshly made, served over pasta. Plain for whoever wants it plain, chilli flakes stirred in at the table for whoever doesn't.</p><p><strong>Night two:</strong> the base over rice, with grated cheese, yoghurt or a mild sauce set out in separate small bowls.</p><p><strong>Night three:</strong> jacket potatoes, with the base as one filling option and plain butter and cheese as the other.</p><p><strong>Night four:</strong> wraps or flatbreads, filled with the base, cucumber and yoghurt laid out for anyone who wants to build their own.</p><p><strong>Night five:</strong> the last of the base under a layer of mash, baked until the top is golden. A different format again, from the same pot.</p><p>Because the base is only safe in the fridge for two days, night five's portion, and usually night four's, needs to come out of the freezer rather than the fridge. That's covered in the storage section below.</p></section><section><h2>Example shopping list</h2><p>This assumes two adults and two children, and makes roughly five portions of base, one per night. On pasta, rice and mash nights the base is the main component; on jacket potato and wrap nights it's used as a lighter filling alongside the potato or wrap itself, so the exact quantity matters less there. Adjust up or down against your own household and what's already in the cupboard.</p><p>This is a planning example rather than a tested recipe. The 1kg mince quantity is a starting estimate for a large batch, so adjust it to your household and the amount of base each dinner needs.</p><ul><li>1kg minced beef, or (vegetarian) 500g dried red lentils and 2 x 400g tins beans</li><li>4 x 400g tins chopped tomatoes, 2 onions, 4 cloves garlic, 1 stock cube</li><li>Pasta, rice, 5 to 6 baking potatoes, wraps or flatbreads</li><li>Potatoes and milk or butter, for the mash topping on night five</li><li>Grated cheese, plain yoghurt, cucumber, chilli flakes or hot sauce for the table</li><li>Freezer bags or containers, labelled with the date, for the portions cooked ahead</li></ul></section><section><h2>A short preparation plan</h2><ol><li><strong>Step one:</strong> cook the whole batch of base in one go, ideally at the weekend or whenever there's a spare hour. One large pot rather than five small ones.</li><li><strong>Step two:</strong> divide it into portions as soon as it's cooled, roughly matched to what each night needs. Keep only the portions planned for the next 48 hours in the fridge; freeze the rest.</li><li><strong>Step three:</strong> move the next frozen portion into the fridge the morning or evening before it's needed, so it's thawed and ready to reheat in time.</li><li><strong>Step four:</strong> reheat only the portion being used that night, add the format (pasta, rice, potato, wrap or mash), and put out the separate finishes.</li></ol></section><section><h2>Storage and leftovers</h2><p>Cooked food should go into the fridge or freezer within two hours, not left out to cool on the side for longer than that. Once refrigerated, this kind of base is best eaten within 48 hours, which is why the plan above splits it between fridge and freezer rather than keeping five days' worth in the fridge at once. Frozen portions should be labelled with the date and thawed in the fridge, not on the counter; once thawed, eat within 24 hours and don't refreeze. As a general quality guide, home-frozen batches like this are usually best used within a few months, though that's about flavour and texture rather than safety. When reheating, the base needs to be steaming hot all the way through, not just warmed, and each portion should only be reheated once. This follows current <a href="https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food">Food Standards Agency guidance on cooking your food</a> and on <a href="https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely">chilling, freezing and defrosting safely</a>, both worth checking directly for anything not covered here.</p></section><section><h2>Shopping and cost</h2><p>Buying for one base rather than five separate dinners tends to cut down on the small, disconnected purchases that push a weekly shop higher than planned. Costed examples and up-to-date pricing for individual recipes sit within each recipe page rather than in this guide, and the methodology behind those figures is set out separately below.</p></section><section><h2>Safety and suitability</h2><p>Cooking instructions on packaging should be followed rather than judged by eye, particularly for mince, chicken and any product where undercooking carries a real risk. Allergen labels are worth checking every time, including on stock cubes, sauces and any product bought as a substitute for a usual brand, since formulations do change.</p><p>Portion size and texture should be adapted to a child's age and ability. Where there's a swallowing difficulty, a diagnosed allergy or a significant feeding concern, that's a conversation for a GP, dietitian or health visitor rather than a dinner-planning guide. This page is about making weeknight cooking more manageable, not a substitute for medical or behavioural advice.</p></section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for a mild base you'd cook once and carry across a week, such as a tomato and lentil sauce or a plain roast chicken, and you can use the results to plan this kind of reuse. Once you've found one, the seven-day planner lets you place it early in the week and its later formats further along, and the costed shopping list groups the ingredients into one trip rather than several. Preferences can be adjusted as a household's needs change, which matters when what worked last month has stopped working this month. For related planning, see <a href="/dinner-plans/5-affordable-family-dinners-for-four">5 affordable family dinners for four</a>, <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a>, and <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>. Details on ingredient sourcing and cost figures sit in our <a href="/recipe-methodology">recipe methodology</a> and <a href="/pricing-methodology">pricing methodology</a>.</p></section>`
  }
];
var FAMILY_FUSSY_EATERS_GUIDE_RECORD = {
  id: "family-dinners-for-fussy-eaters-one-base-flexible-finishes",
  slug: "family-dinners-for-fussy-eaters-one-base-flexible-finishes",
  path: FAMILY_FUSSY_EATERS_GUIDE_PATH,
  canonicalPath: FAMILY_FUSSY_EATERS_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...FAMILY_FUSSY_EATERS_GUIDE,
  metaDescription: FAMILY_FUSSY_EATERS_GUIDE.description,
  label: "Family dinner guide",
  nextReviewAt: "2027-08-13",
  disclosureItems: FAMILY_FUSSY_EATERS_DISCLOSURES,
  disclosureFooter: FAMILY_FUSSY_EATERS_DISCLOSURE_FOOTER,
  sections: FAMILY_FUSSY_EATERS_GUIDE_SECTIONS,
  faqs: [
    {
      question: "How do I avoid cooking separate dinners every night?",
      answer: "Build the dinner around one mild base that can carry several formats, and move the strong flavours to the table instead of the pan. Each person can finish their plate differently, but only one thing has been cooked."
    },
    {
      question: "What if a child dislikes mixed textures?",
      answer: "Keep components separate rather than combined. Rice, base and toppings in their own space on the plate, or in their own bowl, can work better for a child who finds mixed food harder to manage than the same ingredients kept apart."
    },
    {
      question: "Is this the same as hiding vegetables in the dinner?",
      answer: "No. Blending vegetables into a base is one option among several, offered for texture reasons, not as a way to get round what a child will and won't eat. Some readers will know this territory as picky eating rather than fussy eating; the practical answer is the same either way."
    },
    {
      question: "Can I use a different base?",
      answer: "Yes. Plain shredded chicken, a lentil and tomato base, beans or soft roasted vegetables can all work. Keep the base mild, store portions safely and change the format or finishes so the later dinner feels different."
    }
  ],
  cta: {
    title: "Find a flexible dinner base",
    copy: "Search DinnerByDesign for a base that suits your household, then adapt the formats, preferences and shopping list around the week ahead.",
    label: "Find recipes",
    href: "/signin"
  },
  sourcesTitle: "Sources and further reading"
};

// src/content/tinnedFishGuide.ts
var TINNED_FISH_GUIDE_PATH = "/guides/tinned-fish-recipes-tuna-salmon-sardines";
var TINNED_FISH_GUIDE = {
  title: "Tinned fish recipes: easy dinner ideas with tuna, salmon, sardines and more",
  seoTitle: "Tinned fish recipes and dinner ideas | DinnerByDesign",
  description: "Practical tinned fish recipes and dinner ideas using tuna, salmon, sardines, pilchards, mackerel, crab, mussels, cockles and winkles.",
  publishedAt: "2026-07-28",
  reviewedAt: "2026-07-28",
  nextReviewAt: "2027-01-28",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find practical dinner ideas using tinned fish and preserved seafood",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-28",
  editorialNotes: "Separates fish, crustacean and mollusc products; uses no fixed product timings or unsupported health comparisons.",
  internalLinks: [
    "/recipes",
    "/guides/fish-finger-fishcake-scampi-dinner-ideas",
    "/food-costs/cooking-with-pulses-on-a-budget",
    "/food-costs/portion-planning-and-food-waste",
    "/food-safety",
    "/recipe-methodology",
    "/signin"
  ],
  disclosures: [
    "allergen_and_product",
    "storage_and_cooking",
    "source_timing"
  ],
  sources: [
    {
      label: "NHS: Fish and shellfish",
      url: "https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/"
    },
    {
      label: "Food Standards Agency: Allergen guidance",
      url: "https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses"
    },
    {
      label: "Food Standards Agency: Canned food safety",
      url: "https://www.food.gov.uk/print/pdf/node/4286"
    },
    {
      label: "Princes: Canned tuna range",
      url: "https://www.princes.co.uk/product-categories/tuna-chunks/"
    },
    {
      label: "UK legislation archive: Preserved sardine marketing standards",
      url: "https://www.legislation.gov.uk/eur/1989/2136/pdfs/eur_19892136_2003-07-01_en.pdf"
    }
  ],
  faqs: [
    {
      question: "Does tinned tuna count as oily fish?",
      answer: "No. NHS guidance says that neither fresh nor tinned tuna counts as oily fish."
    },
    {
      question: "Are sardines and pilchards the same fish?",
      answer: "The names overlap, but the answer depends on the product. Preserved sardines and sardine-type products can come from several related species, so read the species and description on the label rather than relying on size."
    },
    {
      question: "Can you eat the bones in tinned salmon or sardines?",
      answer: "Yes. The NHS lists the soft bones in tinned salmon, sardines and pilchards as edible and notes that they provide calcium and phosphorus. They can still be removed if preferred."
    },
    {
      question: "Should I drain tinned fish?",
      answer: "It depends on the dish and the packing liquid. Drain brine when it would make the dish too salty; keep some tomato sauce when it forms part of the recipe. Check whether the nutrition panel is given for the drained product."
    },
    {
      question: "Are anchovies the same as sardines?",
      answer: "No. They are different fish and have different flavours and uses, even though both are sold in small tins or jars."
    },
    {
      question: "Can tinned mackerel replace fresh mackerel?",
      answer: "Sometimes. The texture, salt and sauce can change the dish, so it works better in recipes that welcome those differences than as an automatic swap."
    },
    {
      question: "Can leftovers stay in the opened tin?",
      answer: "No. Transfer them to a covered container, refrigerate them and follow the storage period on the manufacturer\u2019s label."
    }
  ]
};
var TINNED_FISH_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>A tin of tuna, salmon, sardines or mackerel can do more than fill a sandwich. Add a carbohydrate, something fresh or frozen from the vegetable drawer, and one strong flavouring, and the cupboard tin becomes the starting point for dinner.</em></p><p>The detail on the label matters. Packing liquid, drained weight, salt, bones and allergens vary between products, even when the name on the front looks similar. Use these ideas as combinations rather than fixed recipes, then follow the pack and any tested recipe for preparation and cooking.</p></section>
<section><h2>Tinned fish and seafood at a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Product</th><th>Often sold in</th><th>Good dinner partners</th><th>Check the label for</th></tr></thead><tbody><tr><td>Tuna</td><td>Spring water, brine or oil</td><td>White beans, pasta, rice, jacket potatoes, sweetcorn, lemon, chilli</td><td>Drained weight, salt and packing liquid</td></tr><tr><td>Salmon</td><td>Red or pink salmon; liquids vary</td><td>Potatoes, rice, pasta, peas, leeks, lemon, dill, capers</td><td>Skin and soft edible bones; drained weight</td></tr><tr><td>Sardines and pilchards</td><td>Oil, brine or tomato sauce</td><td>Toast, pasta, potatoes, tomatoes, peppers, lemon, parsley</td><td>Species and product wording; soft edible bones</td></tr><tr><td>Mackerel</td><td>Oil, brine or flavoured sauce</td><td>Potatoes, rice, pasta, beetroot, tomato, mustard, lemon</td><td>Salt, sauce ingredients and drained weight</td></tr><tr><td>Crab</td><td>Brine or dressed products</td><td>Pasta, rice, bread, cucumber, spring onion, chilli, lime</td><td>Crustacean allergen and any added ingredients</td></tr><tr><td>Mussels</td><td>Brine, oil or sauce</td><td>Pasta, rice, bread, tomato, garlic, parsley, chilli</td><td>Mollusc allergen and sauce ingredients</td></tr><tr><td>Cockles and winkles</td><td>Often jarred in vinegar or brine</td><td>Bread, potatoes, rice, salads, spring onion, white pepper</td><td>Mollusc allergen, storage instructions and vinegar</td></tr></tbody></table></div></section>`;
var TINNED_FISH_GUIDE_IDEAS_HTML = `<section><h2>Tuna</h2><p>Tuna is sold in spring water, brine and oil. Each behaves a little differently once drained, so choose by looking at the full dish rather than treating the tins as interchangeable. Oil-packed tuna can bring some of its own richness; tuna in spring water or brine often needs a dressing, tomatoes or another moist ingredient.</p><h3>Tonno e fagioli</h3><p>Mix drained tuna with white beans, red onion, parsley, lemon and olive oil. The beans make the dish more substantial, while the sharp dressing keeps the tuna from feeling heavy.</p><h3>Tuna Caesar-style salad</h3><p>Add tuna to crisp lettuce, croutons and a Caesar-style dressing. Calling it Caesar-style makes the variation clear and leaves room to adjust the dressing for eggs, anchovies, milk or other allergens.</p><h3>Pasta, jacket potatoes and rice bowls</h3><p>Try tuna with capers and parsley in pasta, with sweetcorn and yoghurt on a jacket potato, or in a rice bowl with spring onion, cucumber and chilli. These combinations also make good use of small amounts of vegetables already in the fridge.</p></section>
<section><h2>Salmon</h2><p>Tinned salmon flakes easily and suits dishes where the fish is mixed through rather than left in large pieces. Some tins contain skin and small bones. The NHS notes that the soft bones in tinned salmon can be eaten and provide calcium and phosphorus, though they can be removed if the texture is unwelcome.</p><h3>Fishcakes</h3><p>Combine drained salmon with mashed potato, herbs and a binder such as beaten egg. Quantities and cooking instructions belong in a tested recipe, particularly when raw egg is used.</p><h3>Creamy pasta</h3><p>Fold flaked salmon through pasta with cr\xE8me fra\xEEche, lemon, dill and peas. Add the salmon near the end so it stays in flakes rather than disappearing into the sauce.</p><h3>Kedgeree-style rice</h3><p>Rice, curry spices, boiled egg and tinned salmon make a useful kedgeree-style dish. The description matters here: traditional kedgeree is commonly made with smoked fish.</p><h3>Chowder</h3><p>Potato, leek, milk and salmon make a straightforward chowder. Taste before adding salt, especially if the fish was packed in brine.</p></section>
<section><h2>Sardines and pilchards</h2><p>The names overlap in everyday use, but the label is the safest guide to the species and product in front of you. Preserved sardines and sardine-type products can be made from several related species, while UK products labelled pilchards are often sold in tomato sauce. Size alone is not a dependable way to tell one tin from another.</p><h3>Tomato pasta</h3><p>Sardines or pilchards in tomato sauce can be folded through pasta with onion, parsley and lemon. Check the sauce before seasoning because salt and sugar vary by product.</p><h3>Toast and beans</h3><p>Mash sardines onto toast with lemon and black pepper, or serve them with white beans or baked beans. A spoonful of chopped tomato or cucumber cuts through an oil-packed tin.</p><h3>Warm potato salad</h3><p>New potatoes, sardines, green beans and a mustard dressing make a fuller potato salad. Keep the fish in pieces and fold it through last.</p></section>
<section><h2>Mackerel</h2><p>Tinned mackerel has a pronounced flavour, especially when it comes in tomato, mustard or pepper sauce. That makes it useful with ingredients that can stand up to it, including beetroot, horseradish, pickled vegetables and sharp dressings.</p><h3>P\xE2t\xE9 and toast</h3><p>Blend drained mackerel with cream cheese, lemon and black pepper, then serve with toast and a crisp salad. Check both the fish and cheese labels for allergens and salt.</p><h3>Warm potato salad</h3><p>Pair flaked mackerel with warm potatoes, beetroot and watercress. Mustard or horseradish adds enough sharpness without hiding the fish.</p><h3>Rice bowls and pasta</h3><p>Use mackerel with rice and pickled vegetables, or fold it through pasta with lemon, chilli and tomatoes. A flavoured tin may already provide most of the sauce.</p></section>`;
var TINNED_FISH_GUIDE_CLOSING_HTML = `<section><h2>Tinned and jarred shellfish</h2><p>Crab, mussels, cockles and winkles need their own treatment because they fall into different allergen categories from fish. They are also sold in different formats. Crab and mussels may be tinned, while cockles and winkles are often jarred in vinegar or brine.</p><h3>Crab</h3><p>Stir crab through pasta or rice with spring onion, chilli and lime. White and brown crab meat have different flavours, so check which the tin contains before choosing the other ingredients.</p><h3>Mussels</h3><p>Use tinned mussels with tomato, garlic and pasta, or serve them on toast with parsley and lemon. If they come in a flavoured sauce, read the label before adding more salt or fat.</p><h3>Cockles and winkles</h3><p>Their briny or vinegary flavour works best as an accent. Add a small spoonful to potato salad, rice or toast, then taste before adding more vinegar or seasoning.</p></section>
<section><h2>Anchovies as a flavouring</h2><p>Anchovies usually make more sense as a seasoning than as the centre of dinner. Stir a small amount into tomato sauce, a dressing or pasta, then taste before adding salt. Their presence still needs to be declared as fish.</p></section>
<section><h2>Practical handling</h2><p>A few checks make these cupboard ingredients easier to use well.</p><ul><li>Compare drained weight as well as the size of the tin. The liquid can account for a sizeable part of the stated weight.</li><li>Drain according to the dish and the label. Oil, brine and sauce affect flavour and nutrition differently.</li><li>Soft bones in tinned salmon, sardines and pilchards are edible, according to the NHS, but can be removed for texture.</li><li>If only part of a tin is used, transfer the remainder to a covered container, refrigerate it and follow the manufacturer\u2019s open-life instructions. Do not store leftovers in the opened tin.</li><li>Reject tins that are bulging, leaking or badly damaged, and follow any preparation instructions on the label.</li></ul></section>
<section><h2>Allergens and safety</h2><p>Fish, crustaceans and molluscs are three separate regulated allergen categories. Tuna, salmon, sardines, pilchards, mackerel and anchovies are fish; crab is a crustacean; mussels, cockles and winkles are molluscs.</p><p>That classification should not be used to predict what is safe for one person. Anyone with a diagnosed or suspected allergy should follow their medical advice and check every current label. Sauces and dressings can also introduce egg, milk, mustard, sulphites or cereals containing gluten.</p></section>
<section><h2>Nutrition framing</h2><p>The <a href="https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/">NHS recommends</a> at least two portions of fish a week, including one portion of oily fish; a portion is around 140g. Salmon, sardines, pilchards and mackerel count as oily fish. Fresh and tinned tuna do not.</p><p>The NHS gives separate limits for some people, including those who are pregnant or trying for a baby. Product-level claims still need the current nutrition panel because salt, oil, sauce and drained weight differ between tins.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/guides/fish-finger-fishcake-scampi-dinner-ideas">Fish finger, fishcake and scampi dinner ideas</a></li><li><a href="/food-costs/cooking-with-pulses-on-a-budget">Cooking with pulses on a budget</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-safety">Food-safety guidance</a></li><li><a href="/recipe-methodology">Recipe methodology</a></li></ul></section>`;
var TINNED_FISH_GUIDE_SECTIONS = [
  { rawHtml: TINNED_FISH_GUIDE_OPENING_HTML },
  { rawHtml: TINNED_FISH_GUIDE_IDEAS_HTML },
  { rawHtml: TINNED_FISH_GUIDE_CLOSING_HTML }
];
var TINNED_FISH_GUIDE_RECORD = {
  id: "tinned-fish-recipes-tuna-salmon-sardines",
  slug: "tinned-fish-recipes-tuna-salmon-sardines",
  path: TINNED_FISH_GUIDE_PATH,
  canonicalPath: TINNED_FISH_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...TINNED_FISH_GUIDE,
  metaDescription: TINNED_FISH_GUIDE.description,
  label: "Practical cooking guide",
  internalLinks: TINNED_FISH_GUIDE.internalLinks.filter((path2) => path2 !== "/recipes"),
  disclosureItems: TINNED_FISH_GUIDE_DISCLOSURES,
  disclosureFooter: TINNED_FISH_GUIDE_DISCLOSURE_FOOTER,
  sections: TINNED_FISH_GUIDE_SECTIONS,
  cta: {
    title: "Find more dinner ideas",
    copy: "Search DinnerByDesign for ideas built around what is already in the cupboard, fridge or freezer.",
    label: "Find a dinner",
    href: "/signin"
  }
};

// src/content/convenienceFishGuide.ts
var CONVENIENCE_FISH_GUIDE_PATH = "/guides/fish-finger-fishcake-scampi-dinner-ideas";
var CONVENIENCE_FISH_GUIDE = {
  title: "How to turn fish fingers, fishcakes and scampi into better weeknight dinners",
  seoTitle: "Fish finger, fishcake and scampi dinner ideas | DinnerByDesign",
  description: "Practical ways to turn fish fingers, fishcakes, scampi, goujons and breaded fillets into varied weeknight dinners, with sides, pack-use ideas and label guidance.",
  publishedAt: "2026-07-28",
  reviewedAt: "2026-07-28",
  nextReviewAt: "2027-01-28",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find dinner ideas using fish fingers, fishcakes, scampi, goujons and breaded fillets",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-28",
  editorialNotes: "Provides dinner formats without fixed product cooking times and distinguishes scampi from white fish.",
  internalLinks: [
    "/recipes",
    "/guides/how-to-build-a-traybake",
    "/guides/9-ways-with-sausages",
    "/food-costs/make-low-cost-dinners-more-interesting",
    "/food-costs/portion-planning-and-food-waste",
    "/food-safety",
    "/recipe-methodology",
    "/signin"
  ],
  disclosures: [
    "allergen_and_product",
    "storage_and_cooking",
    "source_timing"
  ],
  sources: [
    {
      label: "NHS: Fish and shellfish",
      url: "https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/"
    },
    {
      label: "Food Standards Agency: Allergen guidance for food businesses",
      url: "https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses"
    },
    {
      label: "Birds Eye: Cod fish fingers",
      url: "https://www.birdseye.co.uk/range/frozen-fish/fish-fingers/26-cod-fish-fingers"
    },
    {
      label: "Tesco: Cod fishcakes",
      url: "https://www.tesco.com/shop/en-GB/products/291845420"
    },
    {
      label: "Tesco: Haddock goujons",
      url: "https://www.tesco.com/shop/en-GB/products/271284352"
    },
    {
      label: "Tesco: Young's breaded cod fillets",
      url: "https://www.tesco.com/shop/en-GB/products/323156114"
    },
    {
      label: "Whitby Seafoods: Wholetail scampi",
      url: "https://www.whitby-seafoods.com/product/frozen/whole-tail-scampi-frozen-200g.html"
    },
    {
      label: "Whitby Seafoods: Scampi FAQ",
      url: "https://www.whitby-seafoods.com/faq/"
    },
    {
      label: "Good Food: Fish finger recipes",
      url: "https://www.bbcgoodfood.com/recipes/collection/fish-finger-recipes"
    },
    {
      label: "Birds Eye: How to cook frozen fish",
      url: "https://www.birdseye.co.uk/recipes/frozen-food-cooking-tips/how-to-cook-frozen-fish"
    }
  ],
  faqs: [
    {
      question: "What can I serve with fish fingers instead of chips?",
      answer: "Wraps, sandwiches and tacos all work well, adding vegetables and a simple sauce rather than a second helping of potato."
    },
    {
      question: "What vegetables go well with fishcakes?",
      answer: "Greens, green beans, spinach and roasted tomatoes all pair well, particularly since many fishcakes already contain potato."
    },
    {
      question: "What can I make with frozen scampi?",
      answer: "Tacos, rice bowls and lighter chip-shop-style plates all suit scampi, with slaw, peas or a lemon dressing alongside."
    },
    {
      question: "Do fishcakes need potatoes on the side?",
      answer: "Not necessarily. Check the ingredient list first, since many fishcakes already contain a substantial amount of potato."
    },
    {
      question: "Is scampi fish or shellfish?",
      answer: "Shellfish. Scampi is made from langoustine, a crustacean, rather than white fish. Some products use whole tails and others use formed pieces, so check the description on the pack."
    },
    {
      question: "Can fish fingers count as a portion of fish?",
      answer: "Fish fingers contain fish, but whether a serving is equivalent to one NHS portion depends on the amount of fish in the product and how many are served. The NHS describes a portion as around 140g, so check the pack rather than relying on the number of fingers."
    }
  ]
};
var CONVENIENCE_FISH_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Fish fingers, fishcakes, scampi, goujons and breaded fillets can form the basis of more than a standard chips-and-peas dinner. Use them in wraps, burgers, rice bowls, traybakes or warm salads, with vegetables and a sauce that suits the coating.</em></p><p>Cooking instructions, seafood content, allergens and serving sizes vary between products and brands. This guide suggests formats and combinations rather than fixed timings. Always follow the instructions on the pack in front of you.</p></section>
<section><h2>Choose the product by the dinner you want</h2><p>Each product suits a slightly different style of dinner because of how it is made. A whole fillet in breadcrumbs behaves differently from a formed fishcake. Scampi is different again because it is shellfish. Start with the product in the freezer, then decide what sort of dinner it suits tonight.</p><div class="guide-table-wrap"><table><thead><tr><th>Product</th><th>Particularly useful for</th><th>Likely accompaniments</th><th>Watch for</th></tr></thead><tbody><tr><td>Fish fingers</td><td>Wraps, sandwiches and tacos</td><td>Peas, slaw, potatoes</td><td>Fish percentage and coating</td></tr><tr><td>Fishcakes</td><td>Warm salads and vegetable plates</td><td>Greens, beans, tomatoes</td><td>Some already contain substantial potato</td></tr><tr><td>Scampi</td><td>Tacos, rice bowls and lighter chip-shop plates</td><td>Slaw, peas, lemon</td><td>Crustacean; coating allergens vary</td></tr><tr><td>Goujons</td><td>Pittas, fajitas and sharing plates</td><td>Salad, corn, yogurt sauce</td><td>Whole fillet versus formed fish</td></tr><tr><td>Breaded fillets</td><td>Burgers and traybakes</td><td>Roasted vegetables, wedges</td><td>Pack cooking instructions</td></tr></tbody></table></div></section>`;
var CONVENIENCE_FISH_GUIDE_IDEAS_HTML = `<section><h2>Fish finger dinner ideas</h2><p>Fish fingers are usually made from a whole or minced fillet in a crisp breadcrumb coating, which holds up well to being wrapped, layered or cut into pieces.</p><h3>Fish finger wraps with peas, shredded cabbage and yogurt sauce</h3><p>The soft wrap and crisp cabbage give the crumb coating something to contrast against, while a yogurt sauce adds moisture without needing a separate side. Peas can be served whole alongside or stirred through the cabbage.</p><h3>Fish finger sandwiches with lettuce, pickles and oven wedges</h3><p>A sandwich puts the coating's crunch front and centre, with pickles cutting through the richness and wedges covering the carbohydrate side of the plate.</p><h3>Fish finger tacos with sweetcorn, tomato and lime</h3><p>Warm tortillas, sweetcorn, chopped tomato and a squeeze of lime turn the same fish fingers into a dinner built around fresh, acidic flavours.</p></section>
<section><h2>What to serve with fishcakes</h2><p>Many fishcakes already contain a substantial amount of potato. Checking the ingredient list first makes it easier to decide what the dinner needs.</p><h3>Fishcakes with garlicky greens and butter beans</h3><p>Butter beans add bulk and a little protein alongside the fishcake, while quickly cooked greens keep the plate from feeling one-note.</p><h3>Fishcakes with roasted tomatoes, green beans and mustard dressing</h3><p>Roasting concentrates the tomatoes, while mustard dressing adds the sharpness that a fishcake alone may lack.</p><h3>Fishcakes with peas, spinach and a soft egg</h3><p>A soft egg adds richness and turns the plate towards a light, warm salad rather than a traditional fish-and-two-veg dinner.</p></section>
<section><h2>Scampi beyond chips</h2><p>Scampi is made from langoustine, a crustacean, and may use whole tails or formed pieces depending on the product. Its coating already brings richness, salt and crunch, so straightforward accompaniments tend to work well.</p><h3>Scampi tacos with cabbage slaw</h3><p>Crisp slaw adds crunch and acidity without extra cooking.</p><h3>Scampi rice bowls with peas, cucumber and lemon dressing</h3><p>Rice gives the dinner some structure, while cucumber and lemon dressing keep the combination fresh.</p><h3>Scampi with crushed potatoes, green beans and tartare-style yogurt</h3><p>A yogurt-based tartare-style sauce keeps the familiar pairing, while crushed potatoes and green beans give the plate contrast without repeating the standard chips.</p></section>
<section><h2>Goujons and breaded fillets</h2><p>Goujons are strips of fish, whether cut from a fillet or made from formed fish, while breaded fillets are larger pieces. Check the pack for the product's cooking method and timing before building the rest of the dinner around it.</p><h3>Goujon pittas with salad and garlic yogurt</h3><p>Goujons tuck neatly into a warm pitta alongside salad and garlic yogurt.</p><h3>Breaded fish burgers with slaw and wedges</h3><p>A bun and slaw turn a breaded fillet into a burger-style dinner, with wedges covering the carbohydrate element.</p><h3>A tray of breaded fillets, tomatoes, peppers and potatoes</h3><p>These can share a tray only when the pack instructions support the same oven setting and allow everything to cook safely. If the timings differ, start the vegetables separately and add the fish at the point indicated by its pack instructions.</p></section>`;
var CONVENIENCE_FISH_GUIDE_CLOSING_HTML = `<section><h2>Make the plate feel complete</h2><p>The same reusable formula works across all five products.</p><ol><li>Choose the fish or shellfish product.</li><li>Add one carbohydrate if the product does not already contain much potato.</li><li>Add one or two vegetables.</li><li>Finish with acidity or a simple sauce.</li></ol><p>Lemon juice, malt vinegar, pickles, yogurt and herbs, mustard dressing, tartare sauce or tomato salsa can finish the plate.</p></section>
<section><h2>Using up opened packs</h2><ul><li>Shredded cabbage can serve tacos, wraps and slaw.</li><li>Frozen peas can accompany fishcakes or be crushed for sandwiches.</li><li>Wraps can become pittas or flatbreads in another dinner.</li><li>Yogurt can form the base of a garlic, herb or mustard sauce.</li><li>Remaining potatoes can become wedges, crushed potatoes or a traybake base.</li></ul><p>None of this guarantees a lower cost. A genuine saving would need current, dated prices and a transparent calculation.</p></section>
<section><h2>Nutrition and product differences</h2><p>Breaded fish, fishcakes and scampi vary in seafood content, coating, salt, fat and serving size. Check the current label rather than assuming. Products made with cod, haddock or pollock are white fish and do not replace the recommended oily-fish portion.</p><p>Current <a href="https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/">NHS guidance</a> recommends at least two portions of fish a week, including one portion of oily fish. It describes a portion as around 140g. Fresh and canned tuna do not count as oily fish; neither do products based on white fish such as cod, haddock or pollock.</p><p>Individual products should not be labelled healthy or unhealthy without comparing their current nutrition panels. Formulations vary, so use the serving information and ingredients on the current pack.</p></section>
<section><h2>Allergens and safety</h2><ul><li>Scampi is made from langoustine and is a crustacean product, rather than white fish.</li><li>Coatings may contain wheat, egg or milk.</li><li>Fishcakes and sauces may contain additional allergens.</li><li>Ingredients differ between brands, so check the current pack.</li><li>Follow the pack's cooking, storage and reheating instructions.</li><li>Check that the centre is thoroughly cooked before serving.</li></ul><p>Fish, crustaceans and molluscs are separate regulated allergen categories. The <a href="https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses">Food Standards Agency guidance</a> lists the 14 allergens that must be declared when used as ingredients. Anyone with a diagnosed allergy should check the label every time and follow advice from their clinician.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/guides/how-to-build-a-traybake">How to build a traybake</a></li><li><a href="/guides/9-ways-with-sausages">Nine ways with sausages</a></li><li><a href="/food-costs/make-low-cost-dinners-more-interesting">Making low-cost dinners more interesting</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-safety">Food-safety guidance</a></li></ul></section>`;
var CONVENIENCE_FISH_GUIDE_SECTIONS = [
  { rawHtml: CONVENIENCE_FISH_GUIDE_OPENING_HTML },
  { rawHtml: CONVENIENCE_FISH_GUIDE_IDEAS_HTML },
  { rawHtml: CONVENIENCE_FISH_GUIDE_CLOSING_HTML }
];
var CONVENIENCE_FISH_GUIDE_RECORD = {
  id: "fish-finger-fishcake-scampi-dinner-ideas",
  slug: "fish-finger-fishcake-scampi-dinner-ideas",
  path: CONVENIENCE_FISH_GUIDE_PATH,
  canonicalPath: CONVENIENCE_FISH_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...CONVENIENCE_FISH_GUIDE,
  metaDescription: CONVENIENCE_FISH_GUIDE.description,
  label: "Practical cooking guide",
  internalLinks: CONVENIENCE_FISH_GUIDE.internalLinks.filter((path2) => path2 !== "/recipes"),
  disclosureItems: CONVENIENCE_FISH_GUIDE_DISCLOSURES,
  disclosureFooter: CONVENIENCE_FISH_GUIDE_DISCLOSURE_FOOTER,
  sections: CONVENIENCE_FISH_GUIDE_SECTIONS,
  cta: {
    title: "Find more dinner ideas",
    copy: "Search DinnerByDesign for ideas built around what is already in the freezer or fridge.",
    label: "Find a dinner",
    href: "/signin"
  }
};

// src/content/fiveStaplesGuide.ts
var FIVE_STAPLES_GUIDE_PATH = "/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses";
var FIVE_STAPLES_GUIDE = {
  title: "Five dinners built around potatoes, rice, pasta, bread and pulses",
  seoTitle: "5 dinners built around potatoes, rice, pasta, bread and pulses | DinnerByDesign",
  description: "Five published recipes that put potatoes, rice, pasta, bread or pulses at the centre, with timings, servings, equipment, leftovers and pack-use notes.",
  publishedAt: "2026-07-28",
  reviewedAt: "2026-07-28",
  nextReviewAt: "2027-07-28",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Find practical dinner ideas built around potatoes, rice, pasta, bread and pulses",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-28",
  editorialNotes: "Compares five established publisher recipes without reproducing their methods or presenting undated price claims.",
  internalLinks: [
    "/recipes",
    "/food-costs/cooking-with-pulses-on-a-budget",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/five-dinners-same-ingredients",
    "/food-costs/cooking-for-one-without-waste",
    "/pricing-methodology",
    "/food-safety",
    "/recipe-methodology",
    "/signin"
  ],
  disclosures: [
    "price_comparison",
    "allergen_and_product",
    "storage_and_cooking",
    "source_timing"
  ],
  sources: [
    {
      label: "Tesco Real Food: creamy leeks and chorizo sweet potatoes",
      url: "https://realfood.tesco.com/recipes/creamy-leeks-and-chorizo-sweet-potatoes.html"
    },
    {
      label: "Good Food: creamy tomato risotto",
      url: "https://www.bbcgoodfood.com/recipes/creamy-tomato-risotto"
    },
    {
      label: "delicious. magazine: speedy sun-dried tomato pasta",
      url: "https://www.deliciousmagazine.co.uk/recipes/speedy-sun-dried-tomato-pasta/"
    },
    {
      label: "Good Food: cherry tomato and ham bread and butter bake",
      url: "https://www.bbcgoodfood.com/recipes/cherry-tomato-ham-bread-butter-bake"
    },
    {
      label: "Tesco Real Food: coconut chickpea dumpling curry",
      url: "https://realfood.tesco.com/recipes/coconut-chickpea-dumpling-curry.html"
    },
    {
      label: "NHS: The Eatwell Guide",
      url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/"
    },
    {
      label: "Food Standards Agency: Home food fact checker",
      url: "https://www.gov.uk/government/publications/home-food-fact-checker"
    }
  ],
  faqs: [
    {
      question: "Which dinner is fastest?",
      answer: "The sun-dried tomato pasta is the fastest of the five. The publisher gives five minutes of preparation and eight to twelve minutes of cooking, depending on the pasta shape."
    },
    {
      question: "Which options serve four people?",
      answer: "The creamy tomato risotto and the cherry tomato and ham bread bake both serve four as published. The other three serve two."
    },
    {
      question: "Which dinners contain no meat?",
      answer: "The tomato risotto is vegetarian. The coconut chickpea dumpling curry is vegan. Check every pack and chosen substitute if allergens or a strict dietary requirement matter."
    },
    {
      question: "Can I swap in a wholegrain version?",
      answer: "Sometimes, though wholewheat pasta, brown rice and different breads can change cooking time, liquid absorption and texture. Follow the publisher\u2019s tested ingredient list or its stated substitution advice."
    },
    {
      question: "Is stale bread safe to use?",
      answer: "Dry or stale bread can be used in the bake. Bread showing any mould should be discarded in full because growth can extend beyond the visible patch."
    },
    {
      question: "Is a staple-led dinner always less expensive?",
      answer: "No. The full ingredient list, current prices and pack sizes decide the result. Add a price only when the source, date, servings and costing method can be shown beside it."
    }
  ]
};
var FIVE_STAPLES_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Potatoes, rice, pasta, bread and pulses can each carry a substantial dinner when the rest of the dish supplies enough flavour, moisture and variety. Pulses have an extra role because they also contribute protein and fibre. The cheapest option depends on the complete shopping list, pack sizes and current prices.</em></p></section>
<section><h2>Start with the ingredient that gives the dish its shape</h2><p>Dinner planning often starts with chicken, mince or fish. The potato, rice or pasta is picked afterwards, once the expensive part of the plate has already been decided. Starting with the staple changes the question. You begin with the ingredient that gives the dish its shape, then add only what it needs for flavour, moisture, vegetables and protein.</p><p>The five recipes below use familiar staples in distinct ways. Sweet potato becomes an edible shell. Risotto rice thickens its own sauce. Pasta carries a blended tomato dressing. Stale bread absorbs an egg and milk mixture. Chickpeas are shaped into dumplings, with brown rice alongside.</p><p>These are published recipes from Tesco Real Food, Good Food and delicious. magazine. Use the linked publisher page for the full ingredients, quantities and cooking method.</p></section>
<section><h2>The five dinners at a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Staple</th><th>Published recipe</th><th>Serves</th><th>Time</th><th>Main tools</th><th>Useful when</th></tr></thead><tbody><tr><td>Sweet potato</td><td>Creamy leeks and chorizo sweet potatoes</td><td>2</td><td>30 mins</td><td>Microwave and oven</td><td>A warm dinner for two</td></tr><tr><td>Rice</td><td>Creamy tomato risotto</td><td>4</td><td>40 mins</td><td>Hob</td><td>A meat-free family dinner</td></tr><tr><td>Pasta</td><td>Speedy sun-dried tomato pasta</td><td>2</td><td>About 15 mins</td><td>Hob and food processor</td><td>The quickest option</td></tr><tr><td>Bread</td><td>Cherry tomato and ham bread and butter bake</td><td>4</td><td>50 mins</td><td>Oven</td><td>Using stale bread</td></tr><tr><td>Chickpeas and rice</td><td>Coconut chickpea dumpling curry</td><td>2</td><td>45 mins</td><td>Hob and food processor</td><td>A vegan dinner for two</td></tr></tbody></table></div><p><em>Times and servings are taken from the linked publisher pages, checked 28 July 2026.</em></p></section>
<section><h2>Choose by the sort of evening you are having</h2><ul><li><strong>Short on time:</strong> the sun-dried tomato pasta takes about 15 minutes and serves two.</li><li><strong>Cooking for four:</strong> the tomato risotto and bread bake both serve four.</li><li><strong>Avoiding meat:</strong> the risotto is vegetarian and the chickpea curry is vegan as published.</li><li><strong>Using stale bread:</strong> the bread and butter bake turns four thick slices into the body of the dish.</li><li><strong>Planning tomorrow\u2019s lunch:</strong> Tesco describes the chickpea curry leftovers as suitable for lunch the next day, provided the rice is cooled and stored safely.</li></ul></section>`;
var FIVE_STAPLES_GUIDE_RECIPES_HTML = `<section><h2>1. Sweet potato: creamy leeks and chorizo sweet potatoes</h2><p><strong>Publisher:</strong> <a href="https://realfood.tesco.com/recipes/creamy-leeks-and-chorizo-sweet-potatoes.html">Tesco Real Food</a> \xB7 Serves 2 \xB7 30 minutes</p><p><strong>Why the staple works:</strong> two large sweet potatoes form the base and the container. Microwaving softens the centres quickly, while a short spell in the oven gives the skins a firmer finish.</p><p><strong>What completes it:</strong> chorizo brings salt, spice and cooking fat. Leeks, garlic, cr\xE8me fra\xEEche, thyme and spinach turn those flavours into a filling rather than a separate sauce.</p><p><strong>Pack-use note:</strong> the published recipe calls for a 65g pack of diced chorizo. If the available pack is larger, plan the remainder for eggs, a tomato sauce or a second potato dinner before opening it.</p></section>
<section><h2>2. Rice: creamy tomato risotto</h2><p><strong>Publisher:</strong> <a href="https://www.bbcgoodfood.com/recipes/creamy-tomato-risotto">Good Food</a> \xB7 Serves 4 \xB7 40 minutes</p><p><strong>Why the staple works:</strong> risotto rice absorbs the tomato-stock mixture a little at a time. Stirring releases starch, so the rice creates the creamy texture instead of sitting beneath a separate sauce.</p><p><strong>What completes it:</strong> chopped and fresh tomatoes give the dish body and sweetness. Rosemary, basil and parmesan supply the sharper flavours that plain rice would lack.</p><p><strong>Pack-use note:</strong> parmesan and fresh basil often outlast one recipe. Use the basil within the next few days, and keep the parmesan for pasta, soup or roasted vegetables.</p></section>
<section><h2>3. Pasta: speedy sun-dried tomato pasta</h2><p><strong>Publisher:</strong> <a href="https://www.deliciousmagazine.co.uk/recipes/speedy-sun-dried-tomato-pasta/">delicious. magazine</a> \xB7 Serves 2 \xB7 About 15 minutes</p><p><strong>Why the staple works:</strong> the sauce is blended while the pasta boils, so the two jobs happen at the same time. A little pasta water loosens the sauce and helps it coat the pasta before serving.</p><p><strong>What completes it:</strong> sun-dried tomatoes, cashews, parmesan, tomato pur\xE9e and vegetable stock make a concentrated sauce. Basil and black pepper finish the dish without a long ingredient list.</p><p><strong>Pack-use note:</strong> a jar of sun-dried tomatoes usually covers more than one dinner. Keep the tomatoes under their oil and check the label for storage instructions after opening.</p></section>
<section><h2>4. Bread: cherry tomato and ham bread and butter bake</h2><p><strong>Publisher:</strong> <a href="https://www.bbcgoodfood.com/recipes/cherry-tomato-ham-bread-butter-bake">Good Food</a> \xB7 Serves 4 \xB7 50 minutes</p><p><strong>Why the staple works:</strong> stale white bread absorbs seasoned egg and milk, then sets into the body of the bake. Bread that feels disappointing as a sandwich can work well here because dryness helps it take up the liquid.</p><p><strong>What completes it:</strong> ham, cheddar and eggs provide protein and richness. Cherry tomatoes add acidity and stop the bake from feeling too heavy.</p><p><strong>Pack-use note:</strong> plan the remaining ham and cheddar for sandwiches, baked potatoes or a second pasta dish rather than leaving two opened packs without a job.</p></section>
<section><h2>5. Pulses: coconut chickpea dumpling curry</h2><p><strong>Publisher:</strong> <a href="https://realfood.tesco.com/recipes/coconut-chickpea-dumpling-curry.html">Tesco Real Food</a> \xB7 Serves 2 \xB7 45 minutes</p><p><strong>Why the staple works:</strong> the chickpeas are blended with onion, garlic, spice, flour and baking powder, then shaped into dumplings. They become the main texture of the curry instead of disappearing into the sauce. Brown rice provides the second staple.</p><p><strong>What completes it:</strong> chopped tomatoes, coconut milk, pepper and korma paste make a mild sauce. The recipe is vegan as published.</p><p><strong>Pack-use note:</strong> the recipe uses 200ml coconut milk, which may leave half of a standard 400ml tin. Freeze the remainder in a labelled portion if the pack permits, or use it promptly in soup, curry or porridge.</p></section>`;
var FIVE_STAPLES_GUIDE_CLOSING_HTML = `<section><h2>How the five staples behave</h2><div class="guide-table-wrap"><table><thead><tr><th>Staple</th><th>Job in the dish</th><th>Planning point</th></tr></thead><tbody><tr><td>Potatoes</td><td>Hold a filling and provide most of the bulk</td><td>Store somewhere cool, dark and dry</td></tr><tr><td>Rice</td><td>Absorbs liquid or sits alongside a sauce</td><td>Cooked rice needs fast cooling and short refrigerated storage</td></tr><tr><td>Pasta</td><td>Carries a sauce and portions easily before cooking</td><td>Dry pasta is shelf-stable; opened sauce ingredients often need the plan</td></tr><tr><td>Bread</td><td>Absorbs liquid in a bake</td><td>Stale bread can be useful; mouldy bread must be discarded</td></tr><tr><td>Pulses</td><td>Add body, protein and fibre</td><td>Tinned pulses are quick; dried pulses need advance soaking or cooking where specified</td></tr></tbody></table></div></section>
<section><h2>A note on price and nutrition</h2><p>A staple-led dinner is not automatically the cheapest choice. Chorizo, parmesan, cashews or fresh herbs can change the cost quickly. A proper comparison needs a dated shopping basket, the retailer and region, the number of servings, and a clear split between full-pack checkout cost and the value of the quantity used.</p><p>The <a href="https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/">NHS Eatwell Guide</a> places starchy foods at just over a third of overall food intake and recommends higher-fibre or wholegrain versions where practical. That balance applies across a day or week. One dinner does not need to reproduce the whole guide.</p><p>Pulses sit across two useful roles in this article. Chickpeas contain carbohydrate, yet they also contribute protein and fibre. That gives the curry a different nutritional shape from a dish built mainly around potatoes, rice, pasta or bread.</p></section>
<section><h2>Leftovers and rice safety</h2><p>The Food Standards Agency says to cool cooked rice as quickly as possible, ideally within one hour, keep it refrigerated for no more than one day before reheating, and reheat it only once until steaming hot throughout. Read the <a href="https://www.gov.uk/government/publications/home-food-fact-checker">current official guidance</a>.</p><p>For the other dishes, follow the storage instructions on the publisher page and ingredient packs. Cool leftovers promptly and use them within the stated period.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/food-costs/cooking-with-pulses-on-a-budget">Cooking with pulses</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-costs/five-dinners-same-ingredients">Using complete packs across several dinners</a></li><li><a href="/food-costs/cooking-for-one-without-waste">Cooking for one</a></li><li><a href="/pricing-methodology">Pricing methodology</a></li></ul></section>`;
var FIVE_STAPLES_GUIDE_SECTIONS = [
  { rawHtml: FIVE_STAPLES_GUIDE_OPENING_HTML },
  { rawHtml: FIVE_STAPLES_GUIDE_RECIPES_HTML },
  { rawHtml: FIVE_STAPLES_GUIDE_CLOSING_HTML }
];
var FIVE_STAPLES_GUIDE_RECORD = {
  id: "dinners-built-around-potatoes-rice-pasta-bread-pulses",
  slug: "dinners-built-around-potatoes-rice-pasta-bread-pulses",
  path: FIVE_STAPLES_GUIDE_PATH,
  canonicalPath: FIVE_STAPLES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...FIVE_STAPLES_GUIDE,
  metaDescription: FIVE_STAPLES_GUIDE.description,
  label: "Practical cooking guide",
  internalLinks: FIVE_STAPLES_GUIDE.internalLinks.filter((path2) => path2 !== "/recipes"),
  disclosureItems: FIVE_STAPLES_GUIDE_DISCLOSURES,
  disclosureFooter: FIVE_STAPLES_GUIDE_DISCLOSURE_FOOTER,
  sections: FIVE_STAPLES_GUIDE_SECTIONS,
  cta: {
    title: "Find a dinner for tonight",
    copy: "Search DinnerByDesign by ingredient, time or dietary preference and turn one of these staple-led ideas into a plan for your household.",
    label: "Find a dinner",
    href: "/signin"
  }
};

// src/content/pulsesBudgetGuide.ts
var PULSES_BUDGET_GUIDE_PATH = "/food-costs/cooking-with-pulses-on-a-budget";
var PULSES_BUDGET_GUIDE = {
  title: "Cooking with lentils, beans and chickpeas on a budget",
  seoTitle: "Cooking with lentils, beans and chickpeas on a budget | DinnerByDesign",
  description: "Compare dried and tinned pulses, choose the right variety for the dish and use lentils, beans and chickpeas without making dinner feel like a compromise.",
  publishedAt: "2026-07-25",
  reviewedAt: "2026-07-25",
  nextReviewAt: "2027-01-25",
  priceReviewedAt: "2026-07-25",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Learn how to buy and cook lentils, beans and chickpeas economically",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-25",
  editorialNotes: "Price examples are a dated Tesco snapshot. Cooked yield and hob-use figures are explicitly presented as approximations.",
  internalLinks: [
    "/guides",
    "/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses",
    "/food-costs/make-low-cost-dinners-more-interesting",
    "/food-costs/five-dinners-same-ingredients",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/fresh-or-frozen",
    "/pricing-methodology",
    "/food-safety",
    "/signin"
  ],
  disclosures: ["price_estimate", "price_comparison", "source_timing", "storage_and_cooking", "allergen_and_product"],
  sources: [
    { label: "NHS: 5 A Day, what counts?", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/" },
    { label: "Food Standards Agency: How to chill, freeze and defrost food safely", url: "https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely" },
    { label: "Food Standards Agency: Natural toxins factsheet", url: "https://acss.food.gov.uk/sites/default/files/natural-toxins-factsheet.pdf" },
    { label: "Ofgem: Energy price cap unit rates and standing charges", url: "https://www.ofgem.gov.uk/information-consumers/energy-advice-households/energy-price-cap-unit-rates-and-standing-charges" },
    { label: "Tesco Groceries: Laila Chickpeas 2kg", url: "https://www.tesco.com/shop/en-GB/products/310108624" },
    { label: "Tesco Groceries: Lentils, grains and pulses", url: "https://www.tesco.com/groceries/en-GB/shop/food-cupboard/dried-pasta-rice-noodles-and-cous-cous/lentils-grains-and-pulses" }
  ]
};
var PULSE_USES = [
  ["Red lentils", "Dhal, soup, curry, tomato sauce", "Thickens and softens into the sauce"],
  ["Green or brown lentils", "Stews, salads, pies", "Firmer texture and substance"],
  ["Chickpeas", "Curries, traybakes, salads, hummus", "Mild flavour and a distinct bite"],
  ["Cannellini beans", "Soups, tomato dishes, mash", "Creamy texture"],
  ["Butter beans", "Stews, bakes, crushed toppings", "Large, soft and substantial"],
  ["Kidney beans", "Chilli and rice dishes", "Firm texture and familiar flavour"],
  ["Black beans", "Chilli, rice bowls, fillings", "Earthier flavour and darker colour"]
];
var PULSES_BUDGET_FAQS = [
  {
    question: "Are dried pulses always cheaper than tinned?",
    answer: "No. Dried lentils are often economical because they cook quickly, but chickpeas take longer. Product price, cooked yield, hob type and cooking time all affect the comparison."
  },
  {
    question: "Which pulse is easiest to add to a sauce?",
    answer: "Red lentils soften into a sauce and can thicken it. Chickpeas and most beans keep more of their shape and give the dish a distinct bite."
  },
  {
    question: "How can pulses stretch a meat-based dinner?",
    answer: "Start by replacing about a third of the meat with lentils or beans, then adjust the liquid and seasoning. The dish will change, but the result can still feel balanced and satisfying."
  },
  {
    question: "Do beans, lentils and chickpeas count towards 5 A Day?",
    answer: "Yes, but they count as a maximum of one portion a day, however much you eat or however many varieties you combine. An adult portion is about 80g."
  },
  {
    question: "Do dried kidney beans need special preparation?",
    answer: "Yes. Follow the packet instructions. Food Standards Agency guidance says dried red kidney beans should be soaked for at least 12 hours and boiled vigorously for at least 10 minutes in fresh water."
  },
  {
    question: "Can cooked pulses be frozen?",
    answer: "Yes. Cool them promptly, divide them into useful quantities and freeze them if they will not be eaten within the recommended refrigerated storage time."
  }
];
var escapeHtml7 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var paragraphs = (items) => items.map((item) => `<p>${escapeHtml7(item)}</p>`).join("");
var pulseUseRows = () => PULSE_USES.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml7(cell)}</td>`).join("")}</tr>`).join("");
var PULSES_BUDGET_GUIDE_SECTIONS = [
  {
    rawHtml: `<section>${paragraphs([
      "A tin of chickpeas often sits in the cupboard for months. Someone buys a bag of red lentils meaning to use it, then reaches for pasta instead because they're not sure what to do with it. Pulses have a reputation for being cheap and worthy rather than something to actually look forward to eating.",
      "That reputation is only partly deserved. Lentils, beans and chickpeas are inexpensive, keep for a long time and work across a wide range of cooking styles. They can replace some of the meat in a dish or stand as the main ingredient in their own right. Used well, they reduce the cost of a dinner without making it feel like a compromise.",
      "Used badly, they do the opposite. A handful of underseasoned lentils tipped into a sauce to bulk it out tends to taste exactly like that: bulk. Some people don't get on with the texture of pulses at all, however they're cooked. This guide is about giving pulses a clear job in a dish, flavour, texture or substance, rather than treating them as padding."
    ])}</section>`
  },
  {
    rawHtml: `<section><h2>Dried or tinned: which is better value?</h2>${paragraphs([
      "The shelf price alone isn't a fair comparison. Dried pulses need cooking, which carries an energy cost and changes the weight considerably between dry and cooked. Tinned pulses are sold with a drained weight lower than the tin's total weight. A fair comparison has to account for both, and prices vary enough between brands and pack sizes that one product shouldn't stand in for the whole category.",
      "Take chickpeas. On Tesco's website, Natco dried chickpeas cost \xA31.50 for 500g (\xA33.00 per kg) at the standard price, checked 25 July 2026. Laila dried chickpeas, sold in a larger 2kg bag, list at a \xA34.00 regular price (\xA32.00 per kg), with a lower \xA32.90 Clubcard price available to loyalty scheme members on the same date. Brand and pack size make a real difference here, so it's worth checking the unit price on the shelf rather than assuming one product represents the category.",
      "Once soaked and simmered, dried chickpeas typically yield around two to two and a half times their dry weight, a widely used kitchen conversion rather than an exact figure. So 100g of dried chickpeas, costing roughly 20p to 30p depending on brand, produces somewhere in the region of 220 to 250g cooked, a similar amount to the drained contents of a standard tin.",
      "Energy cost is harder to pin down precisely, since it depends on the hob, the pan and how low the heat is once the pan is simmering rather than boiling. As a rough guide, published UK hob running-cost estimates suggest a small ring simmering on gas uses somewhere in the region of 1 to 1.3 kWh per hour, and an electric ring nearer 1 to 1.5 kWh per hour, since electric rings cycle on and off around a set temperature rather than reducing output as smoothly as a gas flame lowered by hand. At Ofgem's Q3 2026 price cap rates (7.33p per kWh for gas, 26.11p per kWh for electricity, effective from 1 July 2026), roughly 90 minutes of mostly-simmering cooking works out at somewhere between 10p and 15p on gas, or 40p to 60p on electric. These are estimates built on assumed appliance output rather than a measurement of this specific dish, and the real figure will vary with the hob and pan used.",
      "Put together, a batch of dried chickpeas comparable to one tin costs roughly 30p to 45p on a gas hob, or 60p to 90p on an electric hob, once the ingredient and energy estimates are combined. A budget-range tin of chickpeas costs around 41 to 45p for 400g, of which roughly 240g is drained chickpeas once the liquid is poured off. On gas, dried and tinned chickpeas land in a similar range. On an electric hob, the tin is the more reliably cheaper option once energy is accounted for.",
      "Lentils are simpler to cost. Tesco own-brand dried red lentils cost around \xA32.60 per kg, checked the same date. They need no soaking and cook in around 25 minutes, so using the same rough energy assumptions, the cooking cost falls to somewhere in the region of 3p to 5p on gas, or 10p to 15p on electric. Using these assumptions, dried lentils are likely to remain cheaper than the tinned products checked, even with cooking energy included, though promotions, tariffs and different appliances could narrow that gap. The cooked yield follows a similar ratio to chickpeas.",
      "None of this means dried pulses are the wrong choice. It means the saving depends on the pulse, the brand, the hob and how much of the bag gets used, rather than on the shelf price alone.",
      "Convenience still matters, separately from cost. A tin can be opened and used within minutes. Cooking from dried takes planning: chickpeas need soaking the night before, and even a modest batch takes over an hour of largely unattended simmering. That doesn't mean the whole bag has to go in at once; measuring out only what's needed for one dinner avoids ending up with more cooked pulses than the household will use.",
      "The cheapest price per gram isn't always the cheapest outcome for a particular household, once cooked yield and energy are factored in. Lentils tend to reward buying dried. Chickpeas are closer to a toss-up and depend heavily on brand and hob type, and tinned is often the simpler choice unless there's a plan to use a full batch across more than one dinner."
    ])}</section>`,
    disclosureItems: PULSES_COST_DISCLOSURES
  },
  {
    rawHtml: `<section><h2>Choosing the right pulse for the dish</h2><p>Pulses are not interchangeable. Red lentils collapse into a sauce; chickpeas hold their shape and bite. Picking the wrong one changes a dish more than many cooks expect.</p><div class="guide-table-wrap"><table><thead><tr><th>Pulse</th><th>Suitable uses</th><th>What it contributes</th></tr></thead><tbody>${pulseUseRows()}</tbody></table></div><p>As a rough guide, reach for red lentils when a dish needs thickening, and for chickpeas, cannellini or butter beans when it needs something to bite into.</p></section>`
  },
  {
    rawHtml: `<section><h2>Stretching meat-based dinners</h2>${paragraphs([
      "Lentils or beans can reduce the amount of meat needed in a bolognese-style sauce, chilli, cottage pie, sausage casserole or chicken stew. This works best when the pulses go in early enough to take on the flavour of the dish, in a modest proportion relative to the meat.",
      "The honest version is that pulses do change a dish. A cottage pie built around equal parts lentils and mince looks and tastes different from one made with mince alone. That is not necessarily a problem, but it is worth trying a modest ratio first, perhaps replacing a third of the meat, and adjusting liquid and seasoning from there."
    ])}</section>`
  },
  {
    rawHtml: `<section><h2>Making pulse-based dinners taste satisfying</h2>${paragraphs([
      "Underseasoning is likely to be part of why people go off pulses, though texture plays a role too. Build flavour from onion, garlic and spices early. Finish with lemon, lime or vinegar to cut through earthiness. Add savoury depth with stock, miso or hard cheese. Contrast the soft texture with a green vegetable, toasted seeds or crisp roasted chickpeas. Fresh herbs or yoghurt can lift a dish that has tasted flat through the middle of cooking."
    ])}</section>`
  },
  {
    rawHtml: `<section><h2>Getting more than one dinner from a pack</h2>${paragraphs([
      "A single tin or bag of pulses rarely needs to disappear into one dish. Chickpeas, for instance, can move across a week: a chickpea and vegetable curry, crushed chickpeas on toast with lemon and herbs, then roasted chickpeas added to a tray of vegetables.",
      "Lentils can do something similar: worked into a tomato and mince sauce one night, turned into a lentil and vegetable soup the next, then served spiced with rice and yoghurt later in the week.",
      "Opened tins should be stored, covered, in the fridge according to the instructions on the label. Tesco's own tinned chickpeas, for example, specify moving any unused contents into a covered container, refrigerating, and using within three days. Once lentils or chickpeas have been cooked from dried, or made into a sauce or soup at home, the general Food Standards Agency guidance for cooked food applies instead: eat within two days of cooking, or freeze. These are two different situations rather than conflicting advice: one is manufacturer guidance for an opened, unheated product, the other is general guidance for food cooked in your own kitchen.",
      "Cooked batches of dried pulses freeze well once cooled, which is often more useful than a bag that's produced more than the household will get through in that time."
    ])}<p>The guide to <a href="/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses">dinners built around potatoes, rice, pasta, bread and pulses</a> includes a chickpea dumpling curry alongside four other staple-led ideas.</p></section>`
  },
  {
    rawHtml: `<section><h2>Food safety</h2>${paragraphs([
      "Dried pulses should be prepared according to the instructions on the packet, particularly soaking and cooking times, since these vary by type and brand. Dried kidney beans need particular care. According to the Food Standards Agency's natural toxins factsheet, dried red kidney beans contain natural toxins called lectins, which can cause stomach ache and vomiting; these are destroyed if the beans are soaked for at least 12 hours and then boiled vigorously for at least 10 minutes in fresh water. Tinned kidney beans have already been through this process as part of canning and can be used without further treatment.",
      "Tinned pulses are already cooked as part of the canning process, which is part of why they're convenient. Once a tin is opened, any unused contents should be moved into a separate container and refrigerated rather than left in the tin.",
      "For anything cooked at home, a pot of lentils, a batch of soaked and boiled chickpeas, general Food Standards Agency guidance applies: cool food as quickly as reasonably possible and get it into the fridge within two hours of cooking, rather than leaving it to cool on the side for longer. Once refrigerated, leftovers are best eaten within two days, or frozen if that's not realistic. Don't rely on smell to judge whether something's still fine to eat; use dates and storage instructions instead."
    ])}</section>`,
    disclosureItems: PULSES_SAFETY_DISCLOSURES
  },
  {
    rawHtml: `<section><h2>Nutrition and 5 A Day</h2>${paragraphs([
      "Beans, lentils and chickpeas count towards 5 A Day, but only as one portion, however much you eat or however many types you combine. A portion is 80g, roughly three heaped tablespoons, according to NHS guidance checked 25 July 2026.",
      "Pulses are a useful source of fibre and protein, and a reasonable way to eat less meat across a week without a household feeling short-changed. They are not a direct nutritional substitute for meat in every respect, and treating them as one is not necessary to get value from using them."
    ])}</section>`
  },
  {
    rawHtml: `<section><h2>When pulses may not be the best choice</h2>${paragraphs([
      "Pulses don't suit every dinner or every household. Some people find beans and lentils cause digestive discomfort, particularly in large amounts or when eaten more often than the gut is used to. Texture is a genuine sticking point for some cooks, however well the dish is seasoned. Dried varieties need planning ahead, which doesn't always fit around a working week. Some tinned or flavoured pulse products carry more salt than a home-cooked version, so it's worth checking the label where that matters. And buying an unfamiliar variety for a single recipe can undo any saving if the rest of the bag goes unused.",
      "Where any of that applies, it's reasonable to start with a familiar dish, a chilli or a bolognese-style sauce, rather than a pulse-led curry from scratch, and build up from there."
    ])}</section>`
  },
  {
    rawHtml: `<section><h2>In short</h2>${paragraphs([
      "Pulses offer good value when they suit the dish, are seasoned properly and are bought in a form the household will actually use. A cheap bag of chickpeas sitting untouched in the cupboard is not a saving; it is just a bag of chickpeas."
    ])}</section>`
  },
  {
    rawHtml: "<section><h2>Sources and further reading</h2><p>Prices and guidance checked 25 July 2026. Cooked-yield ratios and hob-energy use are kitchen and industry approximations and vary by product, appliance and method.</p></section>"
  },
  {
    rawHtml: '<section><h2>Related guides</h2><ul><li><a href="/food-costs/make-low-cost-dinners-more-interesting">Make low-cost dinners more interesting</a></li><li><a href="/food-costs/five-dinners-same-ingredients">Plan five dinners around shared ingredients and complete packs</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-costs/fresh-or-frozen">Fresh or frozen: which suits the way you cook?</a></li><li><a href="/pricing-methodology">How DinnerByDesign calculates ingredient prices</a></li></ul></section>'
  }
];
var PULSES_BUDGET_GUIDE_RECORD = {
  id: "cooking-with-pulses-on-a-budget",
  slug: "cooking-with-pulses-on-a-budget",
  path: PULSES_BUDGET_GUIDE_PATH,
  canonicalPath: PULSES_BUDGET_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...PULSES_BUDGET_GUIDE,
  metaDescription: PULSES_BUDGET_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: [...PULSES_COST_DISCLOSURES, ...PULSES_SAFETY_DISCLOSURES],
  disclosureFooter: PULSES_DISCLOSURE_FOOTER,
  sections: PULSES_BUDGET_GUIDE_SECTIONS,
  faqs: PULSES_BUDGET_FAQS,
  cta: {
    title: "Find a dinner built around pulses",
    copy: "Search DinnerByDesign for dinners using lentils, beans or chickpeas.",
    label: "Find pulse-based dinners",
    href: "/signin"
  }
};

// src/content/traybakeGuide.ts
var TRAYBAKE_GUIDE_PATH = "/guides/how-to-build-a-traybake";
var TRAYBAKE_GUIDE = {
  title: "How to build a traybake that cooks evenly and tastes properly finished",
  seoTitle: "How to build a traybake that cooks evenly | DinnerByDesign",
  description: "Tray size, staged cooking and a proper finish: the method behind a traybake that browns instead of steams. Search traybake dinners on DinnerByDesign.",
  publishedAt: "2026-07-25",
  reviewedAt: "2026-07-25",
  nextReviewAt: "2027-07-25",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Learn how to build a traybake that browns well and finishes cooking at the same time",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-25",
  editorialNotes: "One canonical technique guide with a single handoff to ordinary DinnerByDesign search. No indexable filter pages.",
  internalLinks: ["/guides", "/food-safety", "/signin"],
  disclosures: ["storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food"
    }
  ]
};
var TRAYBAKE_GUIDE_SECTIONS = [
  {
    paragraphs: [
      "A traybake is easy to get onto a plate and easy to get wrong. Everything goes onto one tray, into one oven, and comes out looking like a dinner. Whether it tastes like one, and whether it's actually cooked through, has usually been decided before anything went in the oven.",
      "Most disappointing traybakes come down to a small number of avoidable choices: too much crammed onto one tray, ingredients cut to different sizes and added all at once regardless of how quickly they cook, and nothing added once it comes out. None of that takes extra time to fix. It takes doing things in a different order."
    ]
  },
  {
    title: "1. Choose a tray large enough to leave space between ingredients",
    paragraphs: [
      "Overcrowding is probably the most common reason a traybake disappoints. When ingredients are packed close together, the moisture they release turns into steam with nowhere to go, and instead of browning, everything softens and stews in its own liquid. If the tray looks full before anything's gone in, use a bigger one or a second tray. Ingredients should sit in close to a single layer, with visible gaps between them, not stacked or touching edge to edge."
    ]
  },
  {
    title: "2. Select a base that can tolerate the longest cooking time",
    paragraphs: [
      "The ingredient that takes longest to cook, usually a potato, a piece of squash, or another dense vegetable, goes in first and effectively sets the length of time the tray spends in the oven. Larger or thickly cut potatoes take noticeably longer than small ones, and may need a head start in the oven on their own before anything else goes in, rather than assuming any potato counts as the base regardless of size. Everything else is added or timed relative to that base, rather than cooked alongside it for the same length of time regardless of what it actually needs."
    ]
  },
  {
    title: "3. Cut ingredients to match how quickly they cook",
    paragraphs: [
      "Consistency matters most within an ingredient, not necessarily across all of them. Potatoes cut to a similar size cook at a similar rate; cut unevenly, some pieces will be done while others are still raw in the middle. A piece of potato and a piece of pepper were never going to cook in the same time regardless of how neatly they're cut, which is part of why staging matters more than trying to make every ingredient on the tray the same size."
    ]
  },
  {
    title: "4. Add quicker ingredients in stages",
    paragraphs: [
      "A raw potato and a piece of fish don't belong in the oven for the same length of time, and no amount of clever cutting changes that. The base goes in first. Ingredients that cook faster, peppers, cherry tomatoes, delicate fish, quick-cooking greens, go in partway through, timed so everything finishes together rather than starting together. This is the single biggest fix for an unevenly cooked traybake, and it costs nothing beyond opening the oven door once or twice.",
      "Watery vegetables need a bit more thought within this. Courgettes, mushrooms and tomatoes all release a lot of liquid as they cook, which can undo a well-spaced tray by flooding the base of it late on. Salting courgette slices for ten minutes beforehand and patting them dry removes some of that liquid before it reaches the tray. Mushrooms are better handled differently: giving them a bit more space than other ingredients and roasting them uncovered lets the liquid they release evaporate rather than pool, without needing to salt them first. Tomatoes are usually fine left as they are, since their liquid is often meant to become part of the dish, but it's worth knowing which ingredients are contributing moisture on purpose and which are doing it by accident."
    ]
  },
  {
    title: "5. Finish with something the oven never touched",
    paragraphs: [
      "The element that separates a considered traybake from an assembled one is usually added after the tray comes out, not before it goes in. Fresh herbs, a spoonful of yoghurt, crumbled cheese, toasted seeds, or a squeeze of lemon each add contrast, brightness or texture that sustained oven heat tends to flatten out.",
      "Acid is worth treating on its own terms rather than folding it in with spice. A spoonful of harissa or curry paste stirred through before roasting has time to cook into everything else and mellow, which is usually the effect wanted. Lemon and vinegar behave differently: roasted alongside everything else, much of their brightness cooks off, leaving a general sourness rather than the fresh lift a squeeze of lemon gives at the table. Where a dish wants that lift, adding the acid after cooking rather than before tends to get closer to it.",
      "Seasoning is worth checking twice for a related reason. Salt and spice can taste right on raw ingredients and still read as underseasoned once roasted, partly because some of the moisture carrying that seasoning cooks away, and partly because roasting changes how strongly other flavours come through. That isn't true of every dish, but tasting and adjusting once the tray comes out catches problems that seasoning only at the start sometimes misses."
    ]
  },
  {
    title: "Three traybakes that use this method",
    paragraphs: []
  },
  {
    title: "Chicken thighs, potatoes and peppers",
    paragraphs: [
      "Potatoes as the base, cut to an even size and started first with oil and seasoning; larger chunks or whole baby potatoes benefit from ten to fifteen minutes in the oven on their own before anything else goes in. Bone-in, skin-on chicken thighs go in alongside the potatoes once they've had that head start, since the two then need a similar length of time. Peppers, cut into large pieces so they don't disappear, go in around twenty minutes before the end. Finish with lemon squeezed over at the table rather than before cooking, and parsley if there's some to hand."
    ]
  },
  {
    title: "Chickpeas, squash and harissa",
    paragraphs: [
      "Squash as the base, cut into wedges rather than small cubes so it holds its shape through the full cooking time. A spoonful of harissa mixed with oil goes over the squash from the start, giving it time to cook in properly. Drained tinned chickpeas go in for the final fifteen minutes or so, since they're already cooked and only need warming through and a little colour, not the full time in the oven. Finish with yoghurt loosened with a splash of water and drizzled over, plus coriander if available."
    ]
  },
  {
    title: "Fish, tomatoes and courgettes, with the fish added later",
    paragraphs: [
      "Cherry tomatoes and courgette, salted and patted dry beforehand given how much water courgette releases, go in first, since they need longer in the oven than the fish will. A firm white fish fillet, or salmon, goes in for the final part of cooking only. Fish is done when the flesh turns opaque and flakes easily with a fork; overcooking it by even a few minutes undoes the point of adding it last."
    ]
  },
  {
    title: "A note on food safety",
    paragraphs: [
      "Cooking times for chicken and fish vary too much by cut, thickness and oven to give one number that works for every traybake. For chicken, the Food Standards Agency's guidance is to check with a food thermometer that the thickest part has reached 70\xB0C for at least 2 minutes, or an equivalent combination such as 75\xB0C for 30 seconds. Without a thermometer, cut into the thickest part and check that the juices run clear, there's no pink meat left, and it's steaming hot all the way through. For fish, cook until the flesh turns opaque and separates easily with a fork. When in doubt, particularly with chicken, it's better to give it a few more minutes than to guess."
    ]
  },
  {
    title: "In short",
    paragraphs: [
      "None of this makes a traybake more complicated to cook, just more deliberate about the order things happen in. A tray with room to spare, a base that can take the time, additions staged to match how quickly they cook, and something added at the end that the oven never touched: that's most of the difference between a traybake that tastes assembled and one that tastes considered."
    ]
  }
];
var TRAYBAKE_GUIDE_FAQS = [
  {
    question: "Why does a traybake steam instead of brown?",
    answer: "The tray is usually overcrowded or contains several ingredients releasing liquid at once. Use a larger tray or a second tray and leave visible space between ingredients."
  },
  {
    question: "Which ingredient should go into a traybake first?",
    answer: "Start with the ingredient that needs the longest cooking time, often potato, squash or another dense vegetable. Add quicker ingredients later."
  },
  {
    question: "Should fish go into a traybake at the beginning?",
    answer: "Usually not. Add fish for the final part of cooking so it finishes with the vegetables without becoming dry."
  },
  {
    question: "How do I know chicken in a traybake is safely cooked?",
    answer: "Check that the thickest part reaches 70\xB0C for 2 minutes, or 75\xB0C for 30 seconds. If you do not have a thermometer, check that it is steaming hot throughout, with no pink meat and clear juices."
  },
  {
    question: "What should I add after a traybake comes out of the oven?",
    answer: "Try fresh herbs, yoghurt, crumbled cheese, toasted seeds, lemon juice or vinegar. Choose one that adds freshness, acidity, creaminess or texture."
  }
];
var TRAYBAKE_GUIDE_RECORD = {
  id: "how-to-build-a-traybake",
  slug: "how-to-build-a-traybake",
  path: TRAYBAKE_GUIDE_PATH,
  canonicalPath: TRAYBAKE_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "safety-sensitive",
  ...TRAYBAKE_GUIDE,
  metaDescription: TRAYBAKE_GUIDE.description,
  label: "Practical cooking guide",
  disclosureItems: TRAYBAKE_SAFETY_DISCLOSURES,
  disclosureFooter: TRAYBAKE_DISCLOSURE_FOOTER,
  sections: TRAYBAKE_GUIDE_SECTIONS,
  faqs: TRAYBAKE_GUIDE_FAQS,
  cta: {
    title: "Find a traybake for tonight",
    copy: "Search DinnerByDesign for traybake dinners, filtered by what is already in your kitchen or by cost.",
    label: "Search traybake dinners",
    href: "/signin"
  }
};

// src/content/lowCostDinnersGuide.ts
var LOW_COST_DINNERS_GUIDE_PATH = "/food-costs/make-low-cost-dinners-more-interesting";
var LOW_COST_DINNERS_GUIDE = {
  title: "Low-cost dinners don't have to be boring",
  seoTitle: "How to make low-cost dinners more interesting | DinnerByDesign",
  description: "Practical ways to make affordable dinners more varied and satisfying using seasoning, texture, cooking methods and low-cost finishing touches.",
  publishedAt: "2026-07-24",
  reviewedAt: "2026-07-26",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Find practical ways to make low-cost dinners more varied and enjoyable without expanding the shopping list",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-26",
  editorialNotes: "Consolidated flavour, texture, cooking-method and finishing-touch guide with no specific cost or savings figures. Review annually, next due 26 July 2027.",
  internalLinks: [
    "/guides",
    "/food-costs/ways-to-reduce-grocery-costs",
    "/food-costs/five-dinners-same-ingredients",
    "/guides/home-cooked-or-ready-made-dinners",
    "/pricing-methodology",
    "/signin"
  ],
  disclosures: ["price_comparison", "allergen_and_product"],
  sources: [
    { label: "DinnerByDesign pricing methodology", url: "https://dinnerbydesign.app/pricing-methodology" },
    { label: "DinnerByDesign recipe methodology", url: "https://dinnerbydesign.app/recipe-methodology" }
  ]
};
var LOW_COST_DINNERS_GUIDE_FAQS = [
  {
    question: "How can low-cost dinners feel less repetitive?",
    answer: "Keep the main ingredients familiar, then change one detail: seasoning, texture, cooking method or finish."
  },
  {
    question: "Do I need a larger shopping list to add variety?",
    answer: "Not always. A small set of flavour-builders, such as mustard, curry powder, vinegar, garlic or chilli flakes, can shift the same base ingredients in different directions."
  },
  {
    question: "Are ready-made options a step down?",
    answer: "No. They can be the sensible choice when they reduce waste, suit a smaller household or make dinner easier on a difficult evening."
  },
  {
    question: "Does sharing ingredients across several dinners always save money?",
    answer: "No. Pack size, what goes unused and current retailer pricing all affect the real cost."
  }
];
var LOW_COST_DINNERS_GUIDE_SECTIONS = [
  { rawHtml: "<section><p>Cutting the cost of dinner can bring a nagging worry: that the dinners ahead are going to be a long run of plain pasta, unseasoned lentils and baked beans on toast. If every budget dish tastes roughly the same, saving money quickly stops feeling worth it.</p><p>That repetition often isn't caused by the ingredients. It's caused by using them the same way every time. Beans, lentils, eggs, potatoes, tinned tomatoes and cheaper cuts of meat aren't dull by nature. They're starting points, and what happens after they go in the basket is where the variety actually comes from.</p></section>" },
  { rawHtml: "<section><h2>Affordable ingredients are not inherently dull</h2><p>Lentils can turn into a dhal one night, a tomato-based pasta sauce the next, and spiced patties after that. Eggs move just as easily between a frittata, a shakshuka or a vegetable fried rice. None of these are lesser versions of a more expensive dish. They're different dishes that happen to share a starting ingredient.</p><p>Tinned tomatoes work the same way. The same tin can underpin a simple pasta sauce, a shakshuka, a chilli or a curry base, and each can taste quite different despite sharing a shelf-stable ingredient that's usually inexpensive. The variety comes from what's added around it, not from buying something different every week.</p></section>" },
  { rawHtml: "<section><h2>Build flavour inexpensively</h2><p>A short list of flavour-builders does most of the work here, and there's no need to own all of them at once, or to restock every one every week. One spice blend, one acidic ingredient and one savoury seasoning will already shift a dish a long way from its last outing.</p><ul><li>Mustard</li><li>Curry powder</li><li>Smoked paprika</li><li>Dried herbs</li><li>Chilli flakes</li><li>Soy sauce</li><li>Vinegar or lemon juice</li><li>Garlic</li><li>Stock</li></ul><p>It is worth tasting as you go, particularly with stock, soy sauce and other salty seasonings. It's easy to oversalt a dish by adding several of these on top of each other without checking first.</p></section>" },
  { rawHtml: "<section><h2>Change the cooking method</h2><p>The same vegetable behaves differently depending on how it's cooked. Roasted cabbage picks up browned, slightly sweet edges that boiled cabbage never gets. Chickpeas can go soft into a curry or crisp up in the oven for a completely different texture. Potatoes can become wedges, mash, a r\xF6sti or a pie topping without a single change to the shopping list.</p><p>These changes often require no new main ingredients. The point is to treat cooking method as another variable, alongside seasoning, rather than defaulting to the same pan and the same timing every time. Vegetables roasted quickly at a high temperature can taste quite different from the same vegetables simmered gently in a stew, even when the shopping list is identical.</p></section>" },
  { rawHtml: "<section><h2>Add texture and contrast</h2><p>Budget dishes can start to feel monotonous when everything on the plate has the same soft texture. A small contrasting element often makes more difference than adding another costly ingredient.</p><ul><li>Toasted breadcrumbs</li><li>Crisp fried onions</li><li>Shredded raw vegetables</li><li>Pickled onions</li><li>Seeds</li><li>A spoonful of yoghurt</li><li>Fresh herbs, when affordable</li><li>A squeeze of lemon</li></ul><p>A bowl of dhal, for example, changes considerably with a spoonful of yoghurt and a scattering of toasted seeds on top, even though the dhal itself hasn't changed at all. The same logic applies to soups, stews and anything else that tends to come out uniformly soft.</p></section>" },
  { rawHtml: "<section><h2>Work out what is actually missing</h2><p>A finishing touch works best when it solves a particular problem rather than adding more ingredients at random. Taste first, then choose one adjustment:</p><ul><li><strong>Tastes flat:</strong> try a little lemon juice or vinegar.</li><li><strong>Feels heavy:</strong> add acidity, herbs or pickles.</li><li><strong>Too soft:</strong> add toasted crumbs, seeds or crisp onions.</li><li><strong>Lacks depth:</strong> try a small amount of soy sauce, miso or hard cheese.</li><li><strong>Familiar but dull:</strong> add chilli, smoked paprika or a fresh herb.</li><li><strong>Too hot:</strong> finish with yoghurt.</li></ul><p>Start small, taste again and only make a second adjustment if the dish still needs it. Cost per use matters here as much as shelf price. A jar used across many dinners may offer better value than a fresh ingredient bought for one dish and left unused.</p></section>" },
  {
    rawHtml: "<section><h2>Reuse ingredients without repeating the same dinner</h2><p>Shopping for a small set of ingredients that reappear across several dishes can bring costs down while still giving some variety. Peppers, onions and tinned tomatoes, for instance, can turn up in:</p><ul><li>A smoky bean chilli</li><li>A vegetable paella</li><li>A tomato and pepper pasta sauce</li></ul><p>The ingredients overlap, but the seasoning, texture and format change from one dinner to the next. It is worth noting that a shared ingredient list doesn't automatically guarantee a saving; pack size, what goes unused and current retailer pricing all affect the real cost.</p></section>",
    disclosureItems: LOW_COST_DINNERS_DISCLOSURES
  },
  { rawHtml: "<section><h2>Give familiar dishes one deliberate change</h2><p>None of this means reinventing every dinner from scratch. Most households already have two or three low-cost dishes on repeat, and the quickest way to see a difference is to leave the dish alone and change one detail around it. Sometimes one small, deliberate change to something already in rotation is enough:</p><ul><li>Add mustard and crisp breadcrumbs to cauliflower cheese.</li><li>Turn leftover chilli into stuffed potatoes.</li><li>Add roasted carrots and warm spices to lentil soup.</li><li>Finish tomato pasta with toasted crumbs and lemon zest.</li><li>Add shredded cabbage and a sharp dressing beside sausages and mash.</li></ul><p>Each of these keeps the original shopping list intact. The change is in the detail added on top, which is usually enough to make a familiar dish feel worth cooking again.</p></section>" },
  { rawHtml: `<section><h2>A note on effort and cost</h2><p>It's worth being honest that none of this is effortless for everyone. Time, energy, equipment, food prices and access to a decent supermarket vary a great deal between households, and low-cost cooking asks more of some people than others.</p><p>Ready-made options aren't a step down from this either; they can be the sensible choice, particularly when they cut down on waste or suit a smaller household better than cooking from scratch. <a href="/guides/home-cooked-or-ready-made-dinners">Compare the two approaches in more detail</a>.</p></section>` },
  { rawHtml: "<section><h2>Where to start</h2><p>Affordable cooking tends to stick as a habit when it still gives people something to look forward to. Variety doesn't need a bigger shopping list. It needs a change to how the same ingredients are seasoned, cooked or finished.</p><p>This week, try picking one low-cost dish already in rotation and changing a single thing about it: the seasoning, the cooking method, the texture, or the finish.</p></section>" },
  { rawHtml: '<section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/five-dinners-same-ingredients">see how shared ingredients can become five different dinners</a> or <a href="/pricing-methodology">read how DinnerByDesign calculates ingredient costs</a>.</p></section>' }
];
var LOW_COST_DINNERS_GUIDE_RECORD = {
  id: "make-low-cost-dinners-more-interesting",
  slug: "make-low-cost-dinners-more-interesting",
  path: LOW_COST_DINNERS_GUIDE_PATH,
  canonicalPath: LOW_COST_DINNERS_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...LOW_COST_DINNERS_GUIDE,
  nextReviewAt: "2027-07-26",
  metaDescription: LOW_COST_DINNERS_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: LOW_COST_DINNERS_DISCLOSURES,
  disclosureFooter: LOW_COST_DINNERS_DISCLOSURE_FOOTER,
  sections: LOW_COST_DINNERS_GUIDE_SECTIONS,
  faqs: LOW_COST_DINNERS_GUIDE_FAQS,
  cta: {
    title: "Make familiar ingredients feel less predictable",
    copy: "Tell DinnerByDesign what you already have, your budget and your preferences, and find a dinner that gives those ingredients a different direction.",
    label: "Find a dinner",
    href: "/signin"
  }
};

// src/content/groceryCostOptionsGuide.ts
var GROCERY_COST_OPTIONS_GUIDE_PATH = "/food-costs/ways-to-reduce-grocery-costs";
var GROCERY_COST_OPTIONS_GUIDE = {
  title: "12 practical ways to reduce and manage your grocery costs",
  seoTitle: "12 ways to manage grocery costs | DinnerByDesign",
  description: "Explore 12 practical ways to manage grocery costs, use ingredients more effectively and reduce avoidable food waste.",
  publishedAt: "2026-07-21",
  reviewedAt: "2026-07-26",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Find practical ways to manage grocery spending, use ingredients effectively and reduce avoidable food waste",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-26",
  editorialNotes: "Cornerstone guide incorporating the former low-cost cooking-techniques material. Keep its methods aligned with the detailed guides and recheck cited sources whenever the review date changes.",
  internalLinks: [
    "/guides",
    "/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses",
    "/food-costs/uk-food-costs-2026",
    "/dinner-plans/5-affordable-family-dinners-for-four",
    "/dinner-plans/5-dinners-for-2-under-40",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/cooking-for-one-without-waste",
    "/food-costs/batch-cooking-on-a-budget",
    "/food-costs/mediterranean-inspired-affordable-cooking",
    "/food-costs/cooking-with-cheaper-cuts-of-meat",
    "/food-costs/cooking-with-offal-on-a-budget",
    "/food-costs/fresh-or-frozen",
    "/food-costs/summer-stews-seasonal-vegetables",
    "/food-costs/five-dinners-same-ingredients"
  ],
  disclosures: ["price_comparison", "allergen_and_product", "storage_and_cooking", "source_timing"],
  sources: [
    { label: "Food Standards Agency: Cooking your food", url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food" },
    { label: "Food Standards Agency: How to chill, freeze and defrost food safely", url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely" },
    { label: "UNESCO: Koshary, daily-life dish and associated practices", url: "https://ich.unesco.org/en/RL/koshary-daily-life-dish-and-practices-associated-with-it-02278" },
    { label: "Visit Tuscany: Ribollita", url: "https://www.visittuscany.com/en/recipes/reboiled-soup-a.k.a.-ribollita-recipe/" }
  ],
  faqs: [
    { question: "What is the best way to start reducing grocery costs?", answer: "Start with whichever problem affects you most \u2014 waste, expensive ingredients, lack of time or unpredictable spending \u2014 and use the comparison table to find the matching technique, rather than trying to change everything at once." },
    { question: "Does cooking from scratch always cost less?", answer: "Not necessarily. It often helps, but the saving depends on using the ingredients you buy, choosing suitable quantities and not letting complete packs go to waste. Cooking from scratch with a lot of leftover, unused ingredients can cost more than a simpler shop." },
    { question: "How can I reduce waste when supermarkets sell complete packs?", answer: "Plan dinners that share ingredients, so a partly used pack has a second destination already in mind, and keep a few flexible fallback dinners ready for anything left over that does not fit a specific plan." },
    { question: "Is batch cooking always economical?", answer: "No. It only helps when every portion has a purpose. A large batch cooked without a plan for the extra can end up wasted rather than saving anything." },
    { question: "Are frozen ingredients always cheaper than fresh?", answer: "No. Prices vary by product, retailer and season. Frozen ingredients can help reduce waste because you use only what you need, but that is a different benefit from being guaranteed cheaper." },
    { question: "How can DinnerByDesign help manage grocery spending?", answer: "You can build a week of dinners around your household, budget and available time, then generate a shopping list from the dinners you have scheduled \u2014 bringing planning, portioning and pack awareness together in one place." }
  ]
};
var GROCERY_COST_STARTING_POINTS = [
  ["Ingredients being thrown away", "Portion planning and fresh-or-frozen choices"],
  ["Unpredictable weekly spending", "Planning several dinners around a budget"],
  ["Partially used packs", "Shared-ingredient planning"],
  ["Expensive proteins", "Lower-cost cuts, eggs, pulses or offal"],
  ["Repetitive budget cooking", "Cuisine-inspired flavours and flexible bases"],
  ["Limited cooking time", "Purposeful batch cooking"],
  ["Last-minute purchases", "Flexible fallback dinners"],
  ["Confusing supermarket trips", "A list generated from scheduled dinners"]
];
var escapeHtml8 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
var groceryCostStartingPointRows = () => GROCERY_COST_STARTING_POINTS.map(([problem, start]) => `<tr><th>${escapeHtml8(problem)}</th><td>${escapeHtml8(start)}</td></tr>`).join("");
var GROCERY_COST_OPTIONS_GUIDE_SECTIONS = [
  {
    rawHtml: "<section><p>Controlling what you spend on groceries involves more than hunting for the cheapest products on the shelf. It is really about a handful of connected decisions: planning what you will actually cook, choosing realistic quantities, coordinating ingredients across several dinners, using complete packs effectively, avoiding unnecessary waste, and having a purpose for any surplus portions.</p><p>One distinction is worth keeping in mind throughout: the value of the ingredients you use in a dinner is not the same as the cost of the complete pack you had to buy to get them. Many of the techniques below work by closing that gap, making sure more of what you pay for actually gets eaten.</p></section>",
    disclosureItems: GROCERY_COST_OPTIONS_DISCLOSURES.slice(0, 1)
  },
  {
    rawHtml: `<section><h2>Quick answer</h2><p>The most effective approach is usually a combination of realistic portion planning, coordinated ingredients, flexible lower-cost products and a clear purpose for everything you buy. No single technique works for every household. The best starting point depends on whether your main problem is waste, expensive ingredients, lack of time or unpredictable weekly spending.</p></section>
<section><h2>1. Plan several dinners together</h2><p>Choosing three or four dinners at a time, built around a budget and a small set of shared ingredients, cuts down on the disconnected purchases that quietly push up a weekly shop. It is worth keeping this flexible rather than rigid \u2014 a plan that can absorb a changed evening or a swapped dinner is more useful than one that falls apart the first time your week does not go to schedule.</p><p>Our <a href="/food-costs/uk-food-costs-2026">guide to UK food costs</a> looks at where grocery spending typically goes in more detail. The <a href="/dinner-plans/5-affordable-family-dinners-for-four">five-dinner family plan using one coordinated basket</a> shows complete-pack and ingredient-used costs for four people, while <a href="/dinner-plans/5-dinners-for-2-under-40">5 dinners for 2 under \xA340</a> provides a smaller-household example. The guide to <a href="/food-costs/five-dinners-same-ingredients">five dinners using the same ingredients</a> explains the underlying approach.</p></section>
<section><h2>2. Plan realistic portions</h2><p>Portion planning is not about automatically serving less \u2014 it is about deciding how many people a dinner needs to serve, and what any extra portions are for. This matters at the checkout too: using only part of a pack does not reduce what you paid for it unless the rest gets used later, whether that is another dinner, a lunch, or the freezer.</p><p>Household size affects this more than anything else. Our guide to <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a> covers the general principles, and <a href="/food-costs/cooking-for-one-without-waste">cooking for one without waste</a> looks specifically at adjusting for a smaller household.</p></section>
<section><h2>3. Batch-cook with a purpose</h2><p>Cooking a larger quantity only helps when every portion has somewhere to go: another dinner, the fridge for prompt use, the freezer for later, or a flexible base you can finish differently each time. Batch cooking without a plan for the extra is not a saving \u2014 it is just a bigger version of the same risk.</p><p>Our guide to <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a> looks at when it helps and when it does not.</p></section>
<section><h2>4. Use lower-cost cooking techniques</h2><p>Stewing, braising, roasting, baking and building a good sauce can turn modest ingredients into a dinner with real depth of flavour and texture. Three principles are particularly useful:</p><ul><li><strong>Build around a versatile staple.</strong> Rice, pasta, bread, beans and lentils can provide the base for several different dinners.</li><li><strong>Use concentrated flavour in small quantities.</strong> A little fish sauce, soy sauce, miso, stock or spice can flavour a larger quantity of grains, noodles or vegetables. Check labels for allergens and salt.</li><li><strong>Give safe ingredients a planned further use.</strong> Dry bread that remains safe can thicken a soup; vegetables that need using soon can move into a stew, sauce or tray bake.</li></ul><p>Koshary combines rice, pasta, lentils, chickpeas, spiced tomato sauce and fried onions around inexpensive staples. Ribollita uses beans, vegetables and dry bread to make a substantial soup. These dishes come from distinct traditions and are included as examples of the techniques, not as claims that any cuisine is uniformly inexpensive.</p><p>For five published examples, see <a href="/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses">dinners built around potatoes, rice, pasta, bread and pulses</a>.</p></section>
<section><h2>5. Explore cuisines that use inexpensive staples well</h2><p>Several culinary traditions make good use of pulses, grains, tomatoes, vegetables, herbs and spices to build a satisfying dinner without leaning on an expensive centrepiece ingredient. No cuisine is inherently cheap \u2014 the cost still depends on the specific ingredients and products you choose \u2014 but the techniques are genuinely useful. Our <a href="/food-costs/mediterranean-inspired-affordable-cooking">Mediterranean-inspired affordable cooking guide</a> explores this in practice.</p></section>
<section><h2>6. Consider lower-cost cuts and alternative proteins</h2><p>Lower-cost meat cuts, offal, eggs, and beans, chickpeas or lentils can all bring protein to a dinner without needing a large, expensive centrepiece. Combining a smaller amount of meat with vegetables, grains or pulses often works just as well as a bigger portion on its own. See our guides to <a href="/food-costs/cooking-with-cheaper-cuts-of-meat">choosing and cooking cheaper meat cuts</a> and <a href="/food-costs/cooking-with-offal-on-a-budget">cooking with offal on a budget</a> for more detail. The most economical option will depend on the products available, the pack sizes and what your household will genuinely use.</p></section>
<section><h2>7. Decide when fresh or frozen is more practical</h2><p>Fresh and frozen each suit different dinners \u2014 shelf life, convenience, texture, preparation and how likely something is to go to waste all vary by ingredient and how you are planning to cook it. Neither format is always the better choice; it depends on how soon the ingredient will be used and how you intend to cook it. Our <a href="/food-costs/fresh-or-frozen">fresh or frozen guide</a> covers this in more detail.</p></section>
<section><h2>8. Use seasonal and flexible dinner formats</h2><p>Stews, tray bakes, soups and adaptable sauces are naturally good at absorbing whatever vegetables are available, already in the fridge, or simply need using. <a href="/food-costs/summer-stews-seasonal-vegetables">Summer stews</a> are a good example of this \u2014 light, quick-cooking dinners that flex around what you have without feeling like an afterthought.</p></section>
<section><h2>9. Give complete packs more than one purpose</h2><p>A single ingredient bought for one dinner can often do more than one job across the week. Peppers might go into a spiced rice dish, a stew and a tray bake; a tub of yoghurt into a sauce one night and a dressing another; a bag of spinach into a pasta dish and a curry-inspired dinner; a plainly cooked batch of chicken finished with a different set of flavours each time. This is not about building a rigid weekly menu. It is about noticing where one purchase can quietly cover several dinners. Our guide to <a href="/food-costs/five-dinners-same-ingredients">planning five dinners around shared ingredients and complete packs</a> shows the approach in practice.</p></section>
<section><h2>10. Start with ingredients already available</h2><p>Before choosing what to cook, it is worth checking the cupboard, fridge and freezer first. Prioritise opened products and ingredients that need using soon, while continuing to follow use-by dates and storage instructions.</p></section>`,
    disclosureItems: GROCERY_COST_OPTIONS_DISCLOSURES.slice(1, 3)
  },
  {
    rawHtml: `<section><h2>11. Keep flexible fallback dinners available</h2><p>A small collection of dependable dinners \u2014 built from eggs, rice, pasta, frozen vegetables, pulses or tinned tomatoes \u2014 reduces the chance of an expensive last-minute decision on a night when nothing has been planned. These do not have to be an afterthought: a well-seasoned baked egg dish or a good tomato pasta can be just as appetising as anything else in the week&apos;s plan.</p></section>
<section><h2>12. Build the shopping list from scheduled dinners</h2><p>A shopping list that follows your dinner plan, rather than the other way around, naturally accounts for household servings, ingredients shared between dinners, complete pack sizes, and what is already available at home. This is where planning, portioning and pack awareness come together into one practical step, and it is the point where DinnerByDesign can help most directly \u2014 generating a shopping list from the dinners you have actually scheduled.</p></section>
<section><h2>Where should you start?</h2><table><thead><tr><th>If the main problem is...</th><th>A useful place to start</th></tr></thead><tbody>${groceryCostStartingPointRows()}</tbody></table></section>
<section><h2>Bringing it together</h2><p>These techniques work best in combination, and you do not need to adopt all twelve at once.</p><p>Portion planning becomes more useful when dinners share ingredients. Batch cooking works better when every portion has a purpose. Fresh and frozen choices become easier when the week is already planned. Choose the combination that gives your household greater control.</p></section>
`,
    disclosureItems: GROCERY_COST_OPTIONS_DISCLOSURES.slice(3)
  }
];
var GROCERY_COST_OPTIONS_GUIDE_RECORD = {
  id: "ways-to-reduce-grocery-costs",
  slug: "ways-to-reduce-grocery-costs",
  path: GROCERY_COST_OPTIONS_GUIDE_PATH,
  canonicalPath: GROCERY_COST_OPTIONS_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...GROCERY_COST_OPTIONS_GUIDE,
  nextReviewAt: "2027-07-26",
  metaDescription: GROCERY_COST_OPTIONS_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: GROCERY_COST_OPTIONS_DISCLOSURES,
  disclosureFooter: GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER,
  sections: GROCERY_COST_OPTIONS_GUIDE_SECTIONS,
  cta: {
    title: "Put these ideas into practice",
    copy: "Build a week of dinners around your household, budget and available time, then generate a shopping list from the dinners you schedule.",
    label: "Plan my week",
    href: "/signin"
  }
};

// src/content/groceryCostPredictionGuide.ts
var GROCERY_COST_PREDICTION_GUIDE_PATH = "/food-costs/why-grocery-costs-are-hard-to-predict";
var GROCERY_COST_PREDICTION_GUIDE = {
  title: "Why is it so difficult to budget accurately for food?",
  seoTitle: "Why grocery costs are so difficult to predict accurately | DinnerByDesign",
  description: "Why an exact grocery total is so hard to predict, and how transparent estimates and better planning can still give you more control.",
  publishedAt: "2026-07-21",
  reviewedAt: "2026-07-21",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Understand why grocery costs are difficult to predict and how practical budgeting can still provide greater control",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-21",
  editorialNotes: "Transparency guide about household budgeting uncertainty. Keep the distinction between ingredient value, complete-pack cost and additional shopping cost aligned with the pricing methodology.",
  internalLinks: [
    "/pricing-methodology",
    "/food-costs/ways-to-reduce-grocery-costs",
    "/food-costs/uk-food-costs-2026",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/batch-cooking-on-a-budget",
    "/food-costs/fresh-or-frozen",
    "/dinner-plans/5-dinners-for-2-under-40",
    "/guides"
  ],
  disclosures: ["price_comparison", "storage_and_cooking", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: How to chill, freeze and defrost food safely",
      url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely"
    }
  ],
  faqs: [
    { question: "Why is my supermarket total higher than the combined recipe costs?", answer: "Usually because you are paying for complete packs, not just the quantities each recipe uses, and because prices, promotions or availability may have shifted since the estimate was made." },
    { question: "Can I predict my grocery spending exactly?", answer: "Not reliably. Too many details \u2014 stock, pack sizes, promotions and substitutions \u2014 are unknown when you plan. You can get a realistic estimate, not a guaranteed figure." },
    { question: "What is the difference between ingredient value and complete-pack cost?", answer: "Ingredient value is what the quantity used in a dinner is roughly worth. Complete-pack cost is what you actually pay for the pack it came from, which is often more." },
    { question: "Should cupboard ingredients be treated as free?", answer: "Not quite. They do not add to this week\u2019s shop, but they will need replacing eventually, so they still carry a longer-term cost." },
    { question: "Why do supermarket substitutions affect a weekly budget?", answer: "A substitution \u2014 a different brand, a larger pack, fresh instead of frozen \u2014 can change both what you pay now and what is left over for later in the week." },
    { question: "How much flexibility should I leave in a food budget?", answer: "Enough to absorb an ordinary change of plan \u2014 a postponed dinner, an extra guest or a rushed evening \u2014 without the whole week\u2019s budget falling apart." },
    { question: "Are grocery cost estimates still useful?", answer: "Yes. They help you compare dinners, spot expensive ingredients and coordinate a week, even though they cannot guarantee the final total." },
    { question: "How does DinnerByDesign help households manage spending?", answer: "By showing ingredient value and complete-pack cost separately, accounting for servings and shared ingredients, and being clear that every figure is an estimate rather than a guarantee." }
  ]
};
var GROCERY_COST_PREDICTION_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Accurately budgeting for groceries is difficult because the final amount depends on prices, promotions, product availability, pack sizes, substitutions and what the household already has. Many of these details aren't known when the week is planned. An estimate can't guarantee the checkout total, but it can still help you set a realistic target, compare options and make better use of what you buy.</em></p></section>`;
var GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML = `<section><h2>You have to budget before you know the final cost</h2><p>Setting a food budget means deciding what to spend before you actually know several important things: which products will be in stock, which pack sizes will be on the shelf, whether an advertised offer will still be running, whether a loyalty price applies to you, whether your usual product will need substituting, whether prices have moved since your last shop, or whether the week's plans will even go as expected.</p><p>If you've prepared a careful list and still ended up with a surprising total at the till, that's not a sign you did anything wrong. It's a fairly ordinary result of budgeting for something with this many moving parts. Our <a href="/dinner-plans/5-dinners-for-2-under-40">5 affordable dinners for two under \xA340</a> guide shows how a coordinated target can work while remaining an estimate.</p></section>
<section><h2>A recipe's cost isn't necessarily what you pay at the checkout</h2><p>It helps to separate three different figures. The ingredient value used is what the quantities in the dinner are roughly worth. The complete-pack cost is what you actually pay for the packs those quantities came from. The additional shopping cost is what you need to spend once you've accounted for anything already in the cupboard or fridge.</p><p>A simple example: a dinner might call for two chicken breasts, but the pack in front of you contains four. You pay for the whole pack, even though the recipe only uses half of it. The remaining two breasts only deliver value to the household if they are stored safely and used later. The dinner's ingredient value can therefore be considerably lower than the amount paid at the checkout.</p></section>
<section><h2>Pack sizes make this particularly difficult</h2><p>Recipes describe quantities; supermarkets sell products. A recipe might need 150g from a 500g pack, one tablespoon from a full bottle, a small spoonful from a whole jar of spice, half a bag of vegetables, or two items from a multipack of six. Adding up the value used across a week's recipes was never going to match the total you pay at the till, because you're not buying by the gram \u2014 you're buying by the pack.</p><p><strong>Illustrative examples:</strong> <em>The pack-size examples above are illustrative only and aren't tied to specific retailer products or prices.</em></p></section>
<section><h2>Prices aren't fixed</h2><p>On top of all this, prices themselves move: ordinary price changes, temporary promotions, loyalty-card pricing, differences between stores or regions, online versus in-store pricing, and simple changes in what's available that week. An estimate can accurately reflect the products and prices checked on a particular date, yet still differ from what you find a few days later \u2014 that's not a fault in the estimate, just a reflection of the fact that prices continue to change.</p><p>Our guide to <a href="/food-costs/uk-food-costs-2026">why UK food costs are rising in 2026</a> provides the wider context.</p></section>
<section><h2>Substitutions change the budget</h2><p>Plenty of ordinary moments can quietly shift what you spend: your usual own-brand product is out of stock, only a larger pack is left, you decide to buy a preferred brand instead, a fresh ingredient gets swapped for frozen (or the other way round), a dietary requirement narrows your options, or an online order arrives with a retailer's substitution. Any one of these can be small on its own, but it can affect both today's shop and what's left over for later in the week.</p></section>
<section><h2>Similar-looking products don't always offer the same value</h2><p>Own-brand versus branded, fresh versus frozen, loose versus packaged, prepared versus unprepared, different cuts of the same meat, products that include bone, skin or liquid, different pack sizes \u2014 all of these can look like a straightforward like-for-like choice and not be one. The lowest price on the shelf isn't automatically the best value; that also depends on how much of it you'll actually use, whether it suits your household, how well it stores, and whether the rest of the pack gets eaten. Our <a href="/food-costs/fresh-or-frozen">fresh or frozen guide</a> explores one of these choices in more detail.</p></section>
<section><h2>What's already in your cupboard complicates things further</h2><p>A recipe might call for flour, oil, herbs, spices or stock that you already have at home. That raises two different questions: what's the value of everything the dinner actually uses, and what do you need to buy for this particular shop? Treating every ingredient as a fresh purchase overstates what you need to spend this week; treating cupboard staples as free understates their real cost, since they'll eventually need replacing too.</p></section>
<section><h2>Plans change during the week</h2><p>An evening out, an extra person at the table, a postponed dinner, an ingredient that suddenly needs using sooner than planned, a rushed evening that calls for something different, or leftover portions eaten instead of the next scheduled dinner \u2014 all of these are completely ordinary, and all of them can shift a budget that looked solid on paper. A useful budget leaves room for this rather than assuming the week will go exactly to plan.</p></section>
<section><h2>An apparently cheap dinner can still make for a costly shop</h2><p>Low ingredient value doesn't automatically mean low cost to the household. A dinner can look inexpensive on paper and still push up the shop if it needs several new jars or bottles, a large pack with no obvious second use, something highly perishable, a product you're unlikely to buy again soon, or a quantity that doesn't suit your household size. None of this means every unused ingredient is thrown away straight away \u2014 but it's part of why a low-cost recipe doesn't always translate into a low-cost trip to the shop.</p></section>
<section><h2>Why more price information doesn't solve everything</h2><p>Even with recent, accurate prices, someone still has to decide which supermarket product actually represents a given recipe ingredient, which brand or quality level is a fair assumption, which pack size a household would realistically buy, whether a promotional price is generally available or only to some shoppers, how to treat a product that's out of stock, and at what point a price is too old to be useful. Gathering more data narrows these judgement calls; it doesn't remove them.</p></section>
<section><h2>What you can control</h2><p>You can't control supermarket prices, but there's a fair amount you can control:</p><ul><li>Plan several dinners together, rather than one at a time</li><li>Set a target with some flexibility built in, rather than an exact figure</li><li>Choose dinners that share ingredients</li><li>Check what's already available before you shop</li><li>Plan a use for the remainder of any complete pack</li><li>Choose realistic household servings \u2014 our <a href="/food-costs/portion-planning-and-food-waste">portion-planning guide</a> can help</li><li>Keep a few flexible fallback dinners in reserve</li><li>Use <a href="/food-costs/batch-cooking-on-a-budget">batch cooking</a> purposefully where it suits the week</li><li>Compare fresh and frozen where it makes sense to</li><li>Freeze suitable surplus ingredients or portions safely</li><li>Check the likely complete-pack cost before you shop, not just the recipe cost</li></ul><p>For further practical ideas, see <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce and manage your grocery costs</a>.</p></section>`;
var GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML = `<section><h2>Why estimates are still worth having</h2><p>An estimate doesn't need to predict every penny to be useful. A transparent one can help you compare broadly similar dinners, spot the more expensive ingredients before you shop, understand how many people you're actually feeding, see where a complete pack changes the real cost, coordinate ingredients across the week, stay near your target, anticipate where the real shop might come in higher, and make more informed substitutions when something isn't available. A good estimate narrows the uncertainty. It doesn't remove it.</p></section>
<section><h2>How DinnerByDesign approaches this</h2><p>Costs in DinnerByDesign are presented as estimates, with the assumptions behind them kept visible rather than hidden. Ingredient value is shown separately from complete-pack cost, and household servings are taken into account. Ingredients can be shared across the dinners you schedule, and shopping-list estimates can account for what you've already got. Price information carries a review date, and pack sizes or product availability can still change the final total \u2014 the app doesn't promise an exact checkout figure, for the same reasons set out above. Our <a href="/pricing-methodology">pricing methodology</a> explains the underlying approach in more detail.</p></section>
<section><h2>Verdict</h2><p><em>Households can't know every final product, price, pack size or substitution when they set a food budget. That makes predicting the checkout total exactly very difficult, even after a carefully planned week. The answer isn't to abandon budgeting \u2014 it's to use transparent estimates, plan several dinners together, account for complete packs, and leave room for ordinary changes. Better information can't remove every uncertainty, but it can give you considerably more control.</em></p></section>`;
var GROCERY_COST_PREDICTION_GUIDE_SECTIONS = [
  { rawHtml: GROCERY_COST_PREDICTION_OPENING_HTML, disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES.slice(0, 1) },
  { rawHtml: GROCERY_COST_PREDICTION_BEFORE_SAFETY_HTML, disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES.slice(1) },
  { rawHtml: GROCERY_COST_PREDICTION_AFTER_SAFETY_HTML }
];
var GROCERY_COST_PREDICTION_GUIDE_RECORD = {
  id: "why-grocery-costs-are-hard-to-predict",
  slug: "why-grocery-costs-are-hard-to-predict",
  path: GROCERY_COST_PREDICTION_GUIDE_PATH,
  canonicalPath: GROCERY_COST_PREDICTION_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...GROCERY_COST_PREDICTION_GUIDE,
  nextReviewAt: "2027-07-21",
  metaDescription: GROCERY_COST_PREDICTION_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: GROCERY_COST_PREDICTION_DISCLOSURES,
  disclosureFooter: GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER,
  sections: GROCERY_COST_PREDICTION_GUIDE_SECTIONS,
  cta: {
    title: "Plan with greater visibility",
    copy: "Build a week around your household, budget and available time, then see how complete packs, shared ingredients and scheduled dinners affect your shopping list.",
    label: "Plan my week",
    href: "/signin"
  }
};

// src/content/cheaperMeatCutsGuide.ts
var CHEAPER_MEAT_CUTS_GUIDE_PATH = "/food-costs/cooking-with-cheaper-cuts-of-meat";
var CHEAPER_MEAT_CUTS_GUIDE = {
  title: "Cooking with cheaper cuts of meat: what to buy and how to use it",
  seoTitle: "Cooking with cheaper cuts of meat | DinnerByDesign",
  description: "Compare and cook beef shin, braising steak, chicken thighs, pork shoulder and turkey thighs, including usable quantity and cost per serving.",
  publishedAt: "2026-07-22",
  reviewedAt: "2026-07-26",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Choose and cook lower-cost meat cuts using methods that suit their texture, usable quantity and available time",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-26",
  editorialNotes: "Consolidated method and four-serving comparison guide rather than a live price ranking. Recheck Food Standards Agency cooking and storage guidance before changing the review date.",
  internalLinks: [
    "/pricing-methodology",
    "/food-costs/why-grocery-costs-are-hard-to-predict",
    "/food-costs/batch-cooking-on-a-budget",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/cooking-with-offal-on-a-budget",
    "/food-costs/ways-to-reduce-grocery-costs",
    "/guides"
  ],
  disclosures: ["price_comparison", "allergen_and_product", "storage_and_cooking", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food"
    },
    {
      label: "Food Standards Agency: How to chill, freeze and defrost food safely",
      url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely"
    }
  ],
  faqs: [
    {
      question: "Are cheaper cuts always cheaper per serving?",
      answer: "Not always. Bone weight, trimming and cooking losses can reduce the usable meat you get, so it is worth considering cost per serving rather than price per pack or kilogram."
    },
    {
      question: "Which cheaper cut is easiest for a beginner?",
      answer: "Boneless chicken thighs are a reasonable starting point. They are forgiving to cook and work in a wide range of everyday dinners."
    },
    {
      question: "Can chicken thighs replace chicken breast?",
      answer: "Often, particularly in curries, casseroles and traybakes. The texture and cooking time differ slightly, so adjust the method rather than assume a direct swap."
    },
    {
      question: "Does slow cooking use too much energy to save money?",
      answer: "It depends on the appliance, cooking duration and energy tariff. There is no single answer, so consider how the cut will actually be cooked rather than assuming every slowly cooked dish will cost less overall."
    },
    {
      question: "Can cooked meat be frozen?",
      answer: "Yes. Cool, portion and store it safely, following current Food Standards Agency guidance and the product instructions."
    }
  ]
};
var CHEAPER_MEAT_CUTS_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Beef shin, braising steak, chicken thighs and drumsticks, pork shoulder and turkey thighs can be useful alternatives to more familiar cuts. Some need longer, gentler cooking; others can be roasted or cooked in one pan. The best choice depends on the pack price, the amount of usable meat, the cooking time and what you plan to do with the leftovers. Cheaper does not have to mean dull. These cuts often bring plenty of flavour and work particularly well with spices, herbs, tomatoes, pulses and seasonal vegetables.</em></p></section>
<section><h2>Why are some cuts cheaper?</h2><p>A few ordinary factors explain the price difference: more connective tissue that needs longer cooking to soften, bones, skin or visible fat that reduce the usable meat in the pack, less consumer demand than convenient cuts such as chicken breast, and the usual effects of retailer, pack size, promotion and time of year.</p><p>A lower price per pack or kilogram does not automatically mean a lower cost per serving. Bone weight, trimming, longer cooking energy and what you serve alongside it all affect the real value of a dinner. Our guide to <a href="/pricing-methodology">how prices are calculated</a> explains this distinction in more depth.</p><p><strong>Prices and availability:</strong> <em>Prices and availability vary between retailers, packs and dates. The comparisons in this guide are general rather than tied to a specific shop or price. Our guide to <a href="/food-costs/why-grocery-costs-are-hard-to-predict">why grocery costs are difficult to predict</a> looks at this in more detail.</em></p></section>
<section><h2>How to compare cuts for four servings</h2><p>Start with the current pack price, then estimate how many of your household&apos;s usual servings the usable meat will provide after accounting for bone, skin, trimming and cooking loss. Compare cuts on the same date and include any extra stock, marinade or ingredients required by the cooking method.</p><p><strong>Illustrative calculation:</strong> if a pack costs \xA36.00 and provides four servings, its calculated cost is \xA31.50 per serving. This is arithmetic rather than a current retailer price. Replace both figures with the pack and serving information in front of you.</p><p>Cooking time matters as well. Beef shin and pork shoulder may need several hours, while boneless chicken thighs are usually quicker. Energy cost depends on the appliance, temperature, duration and tariff, so a lower shelf price does not guarantee a lower overall cost.</p></section>`;
var CHEAPER_MEAT_CUTS_DETAILS_HTML = `<section><h2>At a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Cut</th><th>Character</th><th>Best methods</th><th>Time</th><th>Good for</th></tr></thead><tbody><tr><td>Beef shin</td><td>Deep flavour; becomes tender slowly</td><td>Braising, slow cooking</td><td>Longer</td><td>Stews, rag\xF9-style sauces, pies</td></tr><tr><td>Braising steak</td><td>Rich and versatile</td><td>Casseroles, braising</td><td>Longer</td><td>Tomato-based dishes, pies, shredded beef</td></tr><tr><td>Chicken thighs</td><td>Juicy and forgiving</td><td>Roasting, traybakes, casseroles</td><td>Moderate</td><td>Curries, rice dishes, one-pan dinners</td></tr><tr><td>Chicken drumsticks</td><td>Flavourful and bone-in</td><td>Roasting, braising</td><td>Moderate</td><td>Traybakes, spiced chicken, tomato dishes</td></tr><tr><td>Pork shoulder</td><td>Rich; suits larger batches</td><td>Slow roasting, braising</td><td>Longer</td><td>Shredded pork, stews, fillings</td></tr><tr><td>Turkey thighs</td><td>Full-flavoured and substantial</td><td>Roasting, braising</td><td>Moderate to long</td><td>Curries, casseroles, shredded turkey</td></tr></tbody></table></div><p><strong>Cooking times and safety:</strong> <em>Timings above are general guidance, not exact instructions for every pack. Always follow the cooking instructions on the product you have bought.</em></p></section>
<section><h2>Beef shin</h2><p>Beef shin comes from a hard-working part of the animal, which is exactly why it needs slow, gentle cooking. Connective tissue that would stay tough after a quick sear breaks down over time into something rich and tender. Onions, carrots, tomatoes, mushrooms, bay, thyme and warming spices such as cinnamon or allspice all suit it well, in a classic stew, a rag\xF9-style sauce or a pie filling. A smaller quantity goes a long way stirred through beans, lentils or plenty of root vegetables, rather than needing to be the bulk of the dish.</p><p>It can be less convenient than braising steak when you are short on time. It often needs trimming, and the cooking time is genuinely long, so it suits a day when something can be left cooking rather than a rushed evening.</p></section>
<section><h2>Braising steak</h2><p>Braising steak is usually quicker to prepare than shin, making it a practical choice for casseroles, pie fillings and sauces left to cook gently. Browning the meat first can add depth of flavour, but it is a nice-to-have rather than essential \u2014 skip it on a busier evening and the dish will still work. Root vegetables, beans or lentils stretch the dish further. Pre-diced packs are convenient, but a larger piece cut yourself can sometimes offer better value. Compare the pack in front of you rather than assuming either is automatically the better buy.</p></section>
<section><h2>Chicken thighs and drumsticks</h2><p>Thighs and drumsticks behave a little differently. Boneless thighs give more usable meat for the pack weight, and they are generally more forgiving than chicken breast, tending to stay juicy during roasting, braising and casserole cooking. They suit curries, casseroles, traybakes and rice-based dinners well.</p><p>Drumsticks are usually bone-in, so part of the pack weight is not meat you will eat. That matters when working out portions. They roast and braise well and hold their own in a traybake or tomato-based dish. Skin-on or skinless is a matter of preference and the dish, rather than one being clearly better.</p><p>A few flavour directions worth trying: lemon and oregano, tomato and paprika, ginger and garlic, or a milder spice blend with peppers and rice.</p></section>`;
var CHEAPER_MEAT_CUTS_PLANNING_HTML = `<section><h2>Pork shoulder</h2><p>Pork shoulder suits slow cooking for the same reason as beef shin \u2014 connective tissue and fat that reward a long, gentle cook, becoming tender and easy to shred rather than staying firm. Buying a whole joint rather than smaller pieces can offer good value, but only if your household will genuinely get through it. A large joint is only useful if it gets eaten, either at one sitting or across more than one dinner with a plan for the rest. Our guide to <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a> covers that approach in more detail.</p><p>A roast dinner, shredded pork in flatbreads or a filling for baked potatoes are all reasonable directions. Trim excess fat if you prefer; some of the fat melts during cooking and adds flavour.</p></section>
<section><h2>Turkey thighs</h2><p>Turkey thigh is the least familiar of these cuts, but worth getting to know. It is darker and generally fuller-flavoured than turkey breast, suiting casseroles, curries and roasting methods that give the darker meat enough time to become tender. Availability varies considerably between retailers and individual stores, so turkey thighs may not be as dependable an everyday option as chicken thighs.</p><p>Bone-in and boneless versions need different serving assumptions, since bone weight is not usable meat. Compare the specific pack in front of you rather than assuming turkey thigh will always be cheaper than chicken \u2014 that varies by retailer and by week.</p></section>
<section><h2>Choosing the right cut for the time you have</h2><ul><li><strong>Need something relatively quick:</strong> boneless chicken thighs</li><li><strong>Happy to leave something cooking:</strong> beef shin, braising steak or pork shoulder</li><li><strong>Want a traybake:</strong> thighs or drumsticks</li><li><strong>Cooking a larger batch:</strong> pork shoulder, braising steak or turkey thigh</li><li><strong>Need predictable portions:</strong> boneless cuts are usually easier to divide evenly</li><li><strong>Want deeper flavour from a smaller quantity:</strong> slow-cooked beef or pork alongside pulses and vegetables</li></ul><p>\u201CQuick\u201D is relative here and should not come at the expense of cooking something safely and thoroughly.</p></section>
<section><h2>Making cheaper cuts go further</h2><p>Our guide to <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a> covers the general principles behind this list in more detail.</p><ul><li>Cook a larger quantity only when there is a definite plan for all of it.</li><li>Pair meat with beans, lentils, potatoes, rice or seasonal vegetables, rather than serving it alone.</li><li>Reuse the cooked meat in a genuinely different second dinner, not the same dish twice.</li><li>Portion leftovers before refrigerating or freezing them.</li><li>Label frozen portions with the dish and the date.</li><li>Use bones and skin for stock if you would like to \u2014 it is a nice extra, not something you need to do.</li><li>Weigh up cooking energy and total preparation time alongside the shelf price, not instead of it.</li></ul><p>Pork shoulder is a good example: served with potatoes one evening, then shredded into a tomato and bean dish later in the week, the same joint covers two distinctly different dinners.</p></section>`;
var CHEAPER_MEAT_CUTS_CLOSING_HTML = `<section><h2>When a cheaper cut may not be better value</h2><ul><li>A large pack or joint that will not realistically get used.</li><li>A high proportion of bone or trimming for what you actually need.</li><li>Several hours of cooking for a small quantity of usable meat.</li><li>A cut your household does not particularly enjoy, however good the price.</li><li>Extra ingredients bought specially for just one dish.</li><li>A promotion that week making a different cut cheaper instead.</li></ul><p>None of this makes these cuts a poor choice. It is simply why cheaper and better value are not always the same thing.</p></section>
<section><h2>Verdict</h2><p><em>Cheaper cuts can offer good value when they suit the dish, the cooking time and the household. Chicken thighs are useful for everyday flexibility, while beef shin, braising steak, pork shoulder and turkey thighs come into their own when there is time for slower cooking. Compare the actual pack, account for bones and trimming, and decide how any extra cooked meat will be used. The best-value cut is usually the one that becomes dinners people will genuinely eat.</em></p></section>
<section><h2>Related guides</h2><p><a href="/food-costs/cooking-with-offal-on-a-budget">Cooking with offal on a budget</a> covers a related but distinct subject. For the wider principles behind this guide, see <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce grocery costs</a> and <a href="/food-costs/batch-cooking-on-a-budget">when batch cooking can offer useful value</a>.</p></section>`;
var CHEAPER_MEAT_CUTS_GUIDE_RECORD = {
  id: "cooking-with-cheaper-cuts-of-meat",
  slug: "cooking-with-cheaper-cuts-of-meat",
  path: CHEAPER_MEAT_CUTS_GUIDE_PATH,
  canonicalPath: CHEAPER_MEAT_CUTS_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...CHEAPER_MEAT_CUTS_GUIDE,
  nextReviewAt: "2027-07-26",
  metaDescription: CHEAPER_MEAT_CUTS_GUIDE.description,
  label: "Food cost guide",
  sourcesTitle: "Sources and further reading",
  disclosureItems: [
    ...CHEAPER_MEAT_CUTS_COST_DISCLOSURES,
    ...CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES,
    ...CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES
  ],
  disclosureFooter: CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: CHEAPER_MEAT_CUTS_OPENING_HTML, disclosureItems: CHEAPER_MEAT_CUTS_COST_DISCLOSURES },
    { rawHtml: CHEAPER_MEAT_CUTS_DETAILS_HTML, disclosureItems: CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES },
    { rawHtml: CHEAPER_MEAT_CUTS_PLANNING_HTML, disclosureItems: CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES },
    { rawHtml: CHEAPER_MEAT_CUTS_CLOSING_HTML }
  ],
  cta: {
    title: "Plan with these cuts in mind",
    copy: "Build a week of dinners around your household, budget and available time, and see how a cut such as pork shoulder or braising steak can support more than one dinner.",
    label: "Plan my week",
    href: "/signin"
  }
};

// src/content/sharedIngredientsGuide.ts
var SHARED_INGREDIENTS_GUIDE_PATH = "/food-costs/five-dinners-same-ingredients";
var SHARED_INGREDIENTS_GUIDE = {
  title: "How to plan five dinners around shared ingredients and complete packs",
  seoTitle: "Five dinners using shared ingredients and complete packs | DinnerByDesign",
  description: "See how chicken thighs, potatoes, peppers, onions and tinned tomatoes can become five different dinners, with practical plans for complete packs.",
  publishedAt: "2026-07-23",
  reviewedAt: "2026-07-26",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Plan five different dinners around shared ingredients and complete packs to reduce disconnected purchases and part-used packs",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-26",
  editorialNotes: "Consolidated shared-ingredient and complete-pack planning guide for two adults. Keep the five dinners distinct by method, texture and seasoning, and recheck Food Standards Agency guidance before changing the review date.",
  internalLinks: [
    "/dinner-plans/5-affordable-family-dinners-for-four",
    "/food-costs/cooking-with-cheaper-cuts-of-meat",
    "/food-costs/ways-to-reduce-grocery-costs",
    "/food-costs/portion-planning-and-food-waste",
    "/food-costs/batch-cooking-on-a-budget",
    "/food-costs/why-grocery-costs-are-hard-to-predict",
    "/guides",
    "/pricing-methodology",
    "/food-safety"
  ],
  disclosures: ["serving_assumption", "price_comparison", "allergen_and_product", "storage_and_cooking", "source_timing"],
  sources: [
    {
      label: "Food Standards Agency: How to chill, freeze and defrost food safely",
      url: "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely"
    },
    {
      label: "Food Standards Agency: Cooking your food",
      url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food"
    }
  ],
  faqs: [
    {
      question: "Do all five dinners use every core ingredient?",
      answer: "Yes. Chicken thighs, potatoes, peppers, onions and tinned tomatoes appear in every dinner, but the cooking method, texture and seasoning change."
    },
    {
      question: "Does repeating ingredients mean repeating the same dinner?",
      answer: "It should not. Roasting, braising, pan cooking, stuffing and layering create different textures and presentations even when the shopping basket stays the same."
    },
    {
      question: "Will buying one larger pack always cost less?",
      answer: "No. Compare the pack price, the quantity and how much your household will genuinely use. The benefit comes from using what you buy, not simply choosing a larger pack."
    },
    {
      question: "Should I prepare all five dinners at once?",
      answer: "Not necessarily. Portion and label the chicken, but prepare vegetables only for the next one or two dinners so they retain more of their texture and freshness."
    },
    {
      question: "Should I cook a complete pack at once?",
      answer: "Not necessarily. Dividing a pack before cooking may preserve more flexibility than cooking everything at once. Follow the pack instructions, label anything frozen and decide how each portion will be used."
    },
    {
      question: "Can I adapt the basket for a larger household?",
      answer: "Yes. The examples assume two adults, so increase the quantities to suit your household and check that the available pack sizes still make sense for the plan."
    }
  ]
};
var SHARED_INGREDIENTS_OPENING_HTML = `<section><p>Five unrelated dinners can create five separate ingredient lists, and by Thursday, a fridge drawer holding half a bag of peppers and an onion with no obvious purpose. One way round this is to keep the core ingredients steady and change what you do with them.</p></section>
<section><h2>Quick answer</h2><p><em>The same five ingredients can produce five genuinely different dinners if the cooking method, texture and seasoning change each time. Chicken thighs, potatoes, peppers, onions and tinned tomatoes can be roasted, braised, crisped, stuffed or layered into a bake, each with its own herbs and spices. A few cupboard ingredients, including oil, salt, pepper and a chosen set of herbs or spices, are still needed alongside the five core ingredients.</em></p></section>
<section><h2>The five-ingredient basket</h2><p>This basket works because every item tolerates more than one cooking method.</p><ul><li><strong>Chicken thighs:</strong> roast, braise, shred or dice, as covered in <a href="/food-costs/cooking-with-cheaper-cuts-of-meat">cooking with cheaper cuts of meat</a>.</li><li><strong>Potatoes:</strong> crush, roast or fry.</li><li><strong>Peppers:</strong> roast whole, slice for a relish, or hollow out for stuffing.</li><li><strong>Onions:</strong> a base note in all five dinners, softened or caramelised depending on the dish.</li><li><strong>Tinned tomatoes:</strong> a sauce base, a relish, or a light braising liquid.</li></ul><p>Coordinating pack sizes across the five dinners can shorten the shopping list and reduce the number of part-used packs left over, as discussed in <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce and manage grocery costs</a>, though the right quantities depend on household size and on what pack sizes are available. Two adults is the assumption used for the dinner descriptions below, in line with <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>; larger households will need to scale the amounts.</p></section>`;
var SHARED_INGREDIENTS_DINNERS_HTML = `<section><h2>How the five dinners remain different</h2><div class="guide-table-wrap"><table><thead><tr><th>Dinner</th><th>Main method</th><th>Dominant texture</th><th>Character</th></tr></thead><tbody><tr><td>Tray bake</td><td>Roasting</td><td>Crisp and caramelised</td><td>Smoky</td></tr><tr><td>Braise</td><td>Gentle braising</td><td>Soft and sauce-led</td><td>Rich and savoury</td></tr><tr><td>Hash</td><td>Pan cooking</td><td>Crisp and chopped</td><td>Quick and informal</td></tr><tr><td>Stuffed peppers</td><td>Baking</td><td>Structured and filled</td><td>Colourful and composed</td></tr><tr><td>Layered bake</td><td>Baking, layered</td><td>Crisp-topped, soft beneath</td><td>Warm and hearty</td></tr></tbody></table></div></section>
<section><h2>The five dinners</h2><h3>1. Smoky chicken, pepper and potato tray bake</h3><p>Chicken thighs, sliced peppers, onion wedges and quartered potatoes go into one tray, with tinned tomatoes spooned underneath to form a rough sauce as everything roasts. Smoked paprika and a splash of oil are the main cupboard additions. The result is crisp-edged, slightly caramelised at the corners, and largely hands-off once it is in the oven.</p><h3>2. Tomato-braised chicken with peppers and crushed potatoes</h3><p>Here the same five ingredients go into a pan rather than a tray. Chicken, onion and peppers are softened first, then simmered gently in the tinned tomatoes until the sauce thickens and the chicken is tender enough to break apart with a fork. Potatoes are boiled and roughly crushed rather than roasted. Bay leaf, thyme or a pinch of dried oregano suit this one. It is softer and more sauce-led than the tray bake, closer to a stew than a roast.</p><h3>3. Chicken and potato hash with pepper and tomato relish</h3><p>Diced potatoes are fried until crisp, then shredded cooked chicken and softened onion are worked through the pan. Peppers and tinned tomatoes are cooked down separately into a warm, chunky relish spooned over the top rather than mixed in. Paprika or a little chilli flake works well. The contrast between the crisp hash and the loose relish is what separates this from the braise: it is quicker to put together and better suited to a busy evening.</p><h3>4. Chicken-stuffed peppers with tomato-roasted potatoes</h3><p>Halved peppers are filled with a mixture of chopped cooked chicken, softened onion and cooked, diced potato, then baked until the filling is hot through and the pepper has softened at the edges. A separate batch of potatoes is roasted alongside in a tomato sauce made from the tin. Dried oregano or basil suits the filling. Because the ingredients are composed into a filled, baked dish rather than mixed loosely in a pan, this feels more structured and composed than the tray bake or hash, even though the shopping list has not changed.</p><h3>5. Chicken, pepper and tomato bake with a crisp potato topping</h3><p>Onions and peppers are softened, then chopped cooked chicken is added and the tinned tomatoes reduced down into a thick filling. This is topped with crushed or roughly mashed potato and baked until the top develops crisp, browned edges. Where the braise stays soft and sauce-led throughout, this one has a clear textural contrast: a firm, crisp top over a soft, savoury filling. Rosemary suits the topping.</p></section>`;
var SHARED_INGREDIENTS_PACKS_HTML = `<section><h2>Plan for complete packs, not only recipe quantities</h2><p>A recipe may call for three chicken thighs when the available pack contains six, or one pepper when they are sold in a multipack. The ingredient value used in one dinner is not the same as the complete-pack cost paid at the checkout. The difference becomes easier to manage when every remainder has a realistic destination before shopping begins.</p><p>For this five-dinner example, divide the chicken into the portions needed across the week, assign each pepper and onion to a dinner, and check whether the potato and tomato quantities match the packs available. A larger pack only offers useful value when the household will genuinely use it.</p><p>For a fully costed example, see <a href="/dinner-plans/5-affordable-family-dinners-for-four">five affordable family dinners for four using one coordinated basket</a>. It shows the complete-pack checkout cost, the ingredient value used and what remains after the week.</p></section>
<section><h2>Complete-pack planning examples</h2><div class="guide-table-wrap"><table><thead><tr><th>Pack or ingredient</th><th>First use</th><th>Planned further use</th><th>Practical action</th></tr></thead><tbody><tr><td>Chicken thighs</td><td>Tray bake</td><td>Braise, hash or layered bake</td><td>Divide, label and store safely</td></tr><tr><td>Peppers</td><td>Roasted dinner</td><td>Relish, stuffing or braise</td><td>Assign each pepper before shopping</td></tr><tr><td>Potatoes</td><td>Roasted</td><td>Crushed, fried or used as a topping</td><td>Match the bag size to all five dinners</td></tr><tr><td>Tinned tomatoes</td><td>Tray-bake sauce</td><td>Braising liquid, relish or filling</td><td>Choose tins that reconcile with the plan</td></tr><tr><td>Fresh herbs or yoghurt</td><td>Seasoning or finish</td><td>A different finish later in the week</td><td>Check opened-product instructions</td></tr></tbody></table></div></section>
<section><h2>Five practical ways to handle a pack</h2><ul><li><strong>Use it across genuinely different dinners.</strong> Change the seasoning, method or texture so the second use does not feel like a repeat.</li><li><strong>Divide and freeze suitable ingredients promptly.</strong> Follow the product label and current food-safety guidance.</li><li><strong>Prepare a flexible component.</strong> A tomato base or roasted vegetables can take a different direction later in the week.</li><li><strong>Choose loose, frozen or smaller formats where practical.</strong> A lower unit price is not useful when the remainder is unlikely to be eaten.</li><li><strong>Adjust the plan to the available pack.</strong> Sometimes changing a dinner is simpler than forcing an unwanted remainder into the week.</li></ul><p>Complete-pack planning is a habit, not a demand to use every last item regardless of appetite, storage space or changed plans. A smaller pack at a higher unit price may still be the sensible choice when it avoids waste.</p></section>`;
var SHARED_INGREDIENTS_PLANNING_HTML = `<section><h2>One coordinated preparation session</h2><p>Rather than preparing all five dinners&apos; worth of ingredients in one sitting, the groundwork can be split sensibly:</p><ul><li>divide and label the chicken portions for each dinner;</li><li>freeze any portions that will not be used before their use-by date;</li><li>identify which vegetables belong to which dinner;</li><li>prepare vegetables for the first one or two dinners only, rather than all five, as set out in <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a>;</li><li>keep raw chicken separate from vegetables and any ready-to-eat ingredients throughout.</li></ul><p>Preparing all the vegetables at once may save a little time initially, but it can reduce their texture and freshness later in the week. Prepare only what will be used shortly and keep it covered and refrigerated.</p></section>
<section><h2>Scheduling and storage</h2><p>Follow the storage instructions and use-by date on the chicken packaging. Keep raw chicken covered at the bottom of the fridge, separate from cooked and ready-to-eat ingredients. Portions that will not be used before the use-by date should be frozen in time. Defrost chicken in the fridge and cook it within 24 hours of defrosting; do not refreeze it raw once thawed.</p><p>Cook chicken until it is steaming hot throughout, with no pink meat and clear juices. Cooked leftovers should be cooled and refrigerated within two hours, then eaten within 48 hours or frozen. Reheat leftovers only once, and make sure they are steaming hot throughout.</p></section>`;
var SHARED_INGREDIENTS_CLOSING_HTML = `<section><h2>Does using the same ingredients reduce costs?</h2><p>Not necessarily. Coordinating one basket across five dinners can reduce the number of part-used packs left in the fridge, which is where a lot of ingredients quietly go to waste. But the checkout total depends on pack sizes, on how much of each pack is actually used, and on what is already sitting in the cupboard, as explained in <a href="/food-costs/why-grocery-costs-are-hard-to-predict">why grocery costs are difficult to predict</a>. Buying one larger tray does not automatically reduce the cost per serving. Compare the pack price, the quantity and how much the household will genuinely use. The saving, where it exists, tends to come from using what is bought rather than from any five-ingredient trick.</p></section>
<section><h2>When this approach works well</h2><p>This style of planning suits households that want a shorter shopping list, do not mind repeating ingredients as long as the dinners look and taste different, and have a reasonable set of herbs and spices already in the cupboard. It also depends on having enough fridge or freezer space to store portioned ingredients safely across the week, and on being willing to plan several dinners at once rather than deciding dinner by dinner.</p></section>
<section><h2>When it may not work</h2><p>It is less useful where one household member dislikes chicken, peppers or tinned tomatoes, since the whole basket rests on those five ingredients pulling their weight across every dinner. Households with significantly different dietary needs from one dinner to the next may find the approach adds complexity rather than removing it. And if the basket ends up needing several new sauces, spice blends or specialist ingredients to make the five dinners feel distinct, much of the point of a shared shopping list is lost.</p></section>
<section><h2>Verdict</h2><p><em>Repeat the basket, not the dinner. The five dinners above show how far cooking method, texture and seasoning can stretch the same five ingredients, but the approach only earns its keep if every dinner still feels worth eating, and every ingredient bought actually gets used.</em></p></section>`;
var SHARED_INGREDIENTS_GUIDE_RECORD = {
  id: "five-dinners-same-ingredients",
  slug: "five-dinners-same-ingredients",
  path: SHARED_INGREDIENTS_GUIDE_PATH,
  canonicalPath: SHARED_INGREDIENTS_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...SHARED_INGREDIENTS_GUIDE,
  nextReviewAt: "2027-07-26",
  metaDescription: SHARED_INGREDIENTS_GUIDE.description,
  label: "Food cost guide",
  sourcesTitle: "Sources and further reading",
  disclosureItems: [
    ...SHARED_INGREDIENTS_PLANNING_DISCLOSURES,
    ...SHARED_INGREDIENTS_SAFETY_DISCLOSURES
  ],
  disclosureFooter: SHARED_INGREDIENTS_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: SHARED_INGREDIENTS_OPENING_HTML, disclosureItems: SHARED_INGREDIENTS_PLANNING_DISCLOSURES },
    { rawHtml: SHARED_INGREDIENTS_DINNERS_HTML },
    { rawHtml: SHARED_INGREDIENTS_PACKS_HTML },
    { rawHtml: SHARED_INGREDIENTS_PLANNING_HTML, disclosureItems: SHARED_INGREDIENTS_SAFETY_DISCLOSURES },
    { rawHtml: SHARED_INGREDIENTS_CLOSING_HTML }
  ],
  cta: {
    title: "Plan your week",
    copy: "DinnerByDesign can build several dinners around your household, budget and available time, while looking for opportunities to reuse ingredients across the week.",
    label: "Plan my week",
    href: "/signin"
  }
};

// src/content/cookingForOnePlan.ts
var COOKING_FOR_ONE_PRICE_CHECK_DATE = "27 July 2026";
var COOKING_FOR_ONE_CHECKOUT_TOTAL = "\xA330.36";
var COOKING_FOR_ONE_USED_VALUE = "\xA314.49";
var COOKING_FOR_ONE_SCHEDULE = [
  { when: "Dinner 1", dinner: "Chickpea saag", destination: "Second serving becomes lunch the next day." },
  { when: "Dinner 2", dinner: "One-pot tomato pasta", destination: "Second serving becomes lunch the next day." },
  { when: "Dinner 3", dinner: "One-pot balsamic chicken", destination: "Eat one serving and freeze the other three once cool." },
  { when: "Dinner 4", dinner: "Chicken noodle soup", destination: "Second serving becomes lunch the next day." },
  { when: "Dinner 5", dinner: "Defrosted balsamic chicken", destination: "Two dated portions remain for later." }
];
var COOKING_FOR_ONE_RECIPES = [
  {
    name: "Chickpea saag",
    publisher: "Tesco Real Food",
    url: "https://realfood.tesco.com/recipes/chickpea-saag.html",
    servings: 2,
    ingredientValue: "\xA33.77",
    perServing: "\xA31.89",
    summary: "This combines chickpeas, spinach, Tenderstem broccoli, onion, garlic, lemon, coriander, garam masala and a little Greek-style yogurt. It is the most vegetable-heavy dinner in the plan and uses a substantial part of the spinach pack at once.",
    servingPlan: "Eat one serving for dinner and cool the second promptly for lunch the next day. The publisher lists naan or flatbread as optional, so neither is included in the basket or cost. A blender is needed for the spinach mixture.",
    basketFit: "Spinach and garlic return later in the week, while the remaining yogurt and lemon have ordinary breakfast, lunch and dressing uses."
  },
  {
    name: "One-pot tomato pasta",
    publisher: "Tesco Real Food",
    url: "https://realfood.tesco.com/recipes/one-pot-tomato-pasta.html",
    servings: 2,
    ingredientValue: "\xA31.30",
    perServing: "\xA30.65",
    summary: "This pasta uses spaghetti, chopped tomatoes, onion, garlic, dried thyme, red wine vinegar and breadcrumbs. It is a useful contrast to the chicken dishes and avoids a specialist chilled ingredient bought for one spoonful.",
    servingPlan: "Have one serving for dinner and refrigerate the other for lunch the next day. The recipe\u2019s cooking oil is treated as already owned, alongside salt and pepper. Everything else is included in the basket.",
    basketFit: "Onion and garlic are already open, and the remaining spaghetti, breadcrumbs, thyme and vinegar all keep well for later cooking."
  },
  {
    name: "One-pot balsamic chicken",
    publisher: "Aldi",
    url: "https://www.aldi.co.uk/recipes/collections/family-meals/one-pot-balsamic-chicken",
    servings: 4,
    ingredientValue: "\xA37.17",
    perServing: "\xA31.79",
    summary: "This is the batch anchor. Aldi\u2019s recipe uses a pack of chicken breasts with red onion, red and yellow pepper, salad tomatoes, balsamic vinegar and spinach. For costing, \u201Cone pack\u201D is treated as Aldi\u2019s 650g Ashfields chicken breast pack because the recipe page does not state a weight.",
    servingPlan: "Eat one serving on dinner three. Once the remaining food has cooled, divide it into three labelled containers and freeze promptly. Defrost one in the fridge for dinner five. The other two remain as dated future dinners.",
    basketFit: "The spinach is shared with the saag. The remaining pepper and tomatoes have straightforward uses beyond this plan, while balsamic vinegar keeps for later cooking."
  },
  {
    name: "Chicken noodle soup",
    publisher: "Good Food",
    url: "https://www.bbcgoodfood.com/recipes/chicken-noodle-soup",
    servings: 2,
    ingredientValue: "\xA32.25",
    perServing: "\xA31.12",
    summary: "This soup uses chicken breast, stock, ginger, garlic, noodles, sweetcorn, mushrooms, spring onions and soy sauce. Aldi\u2019s egg noodles are used because the publisher explicitly permits rice or wheat noodles.",
    servingPlan: "Eat one serving for dinner and refrigerate the other for lunch the next day. Optional mint, basil and chilli are not included. The 300g chicken pack leaves about 125g raw; freeze it before the printed use-by date for another dish.",
    basketFit: "It reuses garlic and gives the remaining ginger, spring onions, mushrooms and soy sauce straightforward future uses."
  }
];
var COOKING_FOR_ONE_BASKET = [
  { product: "Brown onions", pack: "1kg", price: "\xA30.99", used: "250g", valueUsed: "\xA30.25" },
  { product: "British baby spinach", pack: "450g", price: "\xA31.59", used: "300g", valueUsed: "\xA31.06" },
  { product: "Loose garlic", pack: "1 bulb", price: "\xA30.45", used: "5 cloves", valueUsed: "\xA30.28" },
  { product: "Wonky lemons", pack: "4", price: "\xA30.89", used: "1", valueUsed: "\xA30.22" },
  { product: "Cut coriander", pack: "30g", price: "\xA30.50", used: "30g", valueUsed: "\xA30.50" },
  { product: "Garam masala", pack: "90g", price: "\xA30.89", used: "about 4g", valueUsed: "\xA30.04" },
  { product: "Chickpeas", pack: "400g can", price: "\xA30.41", used: "1 can", valueUsed: "\xA30.41" },
  { product: "Tenderstem broccoli", pack: "200g", price: "\xA31.45", used: "200g", valueUsed: "\xA31.45" },
  { product: "Fat-free Greek-style yogurt", pack: "500g", price: "\xA30.95", used: "30g", valueUsed: "\xA30.06" },
  { product: "Natural breadcrumbs", pack: "175g", price: "\xA30.99", used: "about 30g", valueUsed: "\xA30.17" },
  { product: "Dried thyme", pack: "15g", price: "\xA30.65", used: "about 0.75g", valueUsed: "\xA30.03" },
  { product: "Chopped tomatoes", pack: "400g can", price: "\xA30.43", used: "1 can", valueUsed: "\xA30.43" },
  { product: "Red wine vinegar", pack: "500ml", price: "\xA31.65", used: "10ml", valueUsed: "\xA30.03" },
  { product: "Spaghetti", pack: "500g", price: "\xA30.75", used: "250g", valueUsed: "\xA30.38" },
  { product: "Chicken breast fillets", pack: "650g", price: "\xA34.69", used: "650g", valueUsed: "\xA34.69" },
  { product: "Red onions", pack: "1kg", price: "\xA30.95", used: "250g", valueUsed: "\xA30.24" },
  { product: "Mixed peppers", pack: "3", price: "\xA31.79", used: "2", valueUsed: "\xA31.19" },
  { product: "Salad tomatoes", pack: "6", price: "\xA30.99", used: "4", valueUsed: "\xA30.66" },
  { product: "Balsamic vinegar", pack: "500ml", price: "\xA31.39", used: "75ml", valueUsed: "\xA30.21" },
  { product: "Chicken breast fillets", pack: "300g", price: "\xA32.29", used: "175g", valueUsed: "\xA31.34" },
  { product: "Chicken stock cubes", pack: "12 cubes", price: "\xA30.69", used: "1\xBD cubes", valueUsed: "\xA30.09" },
  { product: "Fresh ginger", pack: "130g", price: "\xA30.99", used: "about 5g", valueUsed: "\xA30.04" },
  { product: "Egg noodles", pack: "410g", price: "\xA31.29", used: "50g", valueUsed: "\xA30.16" },
  { product: "Sweetcorn in water", pack: "285g", price: "\xA30.55", used: "about 30g", valueUsed: "\xA30.06" },
  { product: "Baby button mushrooms", pack: "200g", price: "\xA30.95", used: "about 60g", valueUsed: "\xA30.29" },
  { product: "Spring onions", pack: "100g", price: "\xA30.65", used: "about 30g", valueUsed: "\xA30.20" },
  { product: "Light soy sauce", pack: "150ml", price: "\xA30.55", used: "10ml", valueUsed: "\xA30.04" }
];
var COOKING_FOR_ONE_ASSUMPTIONS = [
  "One small onion is costed at 100g and one standard onion at 150g; two red onions are costed at 250g in total.",
  "Five garlic cloves are costed as five-eighths of one loose bulb, assuming about eight cloves per bulb. Bulb sizes vary.",
  "Two teaspoons of garam masala are costed at about 4g; two tablespoons of yogurt at 30g.",
  "Four tablespoons of breadcrumbs are costed at about 30g. Half a teaspoon of thyme plus a pinch is costed at about 0.75g.",
  "One teaspoon of chopped ginger is costed at 5g; two tablespoons of sweetcorn at 30g; three mushrooms at 60g; two spring onions at 30g.",
  "Aldi\u2019s balsamic chicken recipe says one pack of chicken breasts without a weight. The costing uses the 650g pack.",
  "Temporary promotional reductions found during the check are not used. This makes the basket less dependent on a short-lived offer.",
  "Recipe totals and headline figures are calculated from unrounded lines. Displayed rows may differ by a penny when added independently."
];
var COOKING_FOR_ONE_LEFTOVERS = [
  "About 125g raw chicken remains from the 300g pack. Freeze it before the printed use-by date, or use it promptly according to the label.",
  "About 150g spinach remains. Use it within the pack\u2019s storage guidance in eggs, soup, pasta or as a wilted side.",
  "About 140g mushrooms remains. Refrigerate and plan a specific use within a few days.",
  "About 470g yogurt remains. Keep it refrigerated and follow the use-by date; it can cover breakfasts, sauces and dressings.",
  "One pepper and two salad tomatoes remain, along with most of both onion bags and three lemons. These need ordinary follow-on uses rather than being described as zero waste.",
  "Spring onions and ginger remain in the fridge. Spaghetti, noodles, breadcrumbs, spices, vinegars and soy sauce carry forward in the cupboard."
];
var escapeHtml9 = (value) => value.replace(
  /[&<>"']/g,
  (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character
);
var table = (headings, rows) => `<table><thead><tr>${headings.map((heading) => `<th>${escapeHtml9(heading)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml9(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
function renderCookingForOnePlanInitialHtml() {
  const schedule = table(
    ["When", "Dinner", "What happens to the rest"],
    COOKING_FOR_ONE_SCHEDULE.map((item) => [item.when, item.dinner, item.destination])
  );
  const recipes = COOKING_FOR_ONE_RECIPES.map((recipe, index) => `<section><h2>${index + 1}. ${escapeHtml9(recipe.name)}</h2><p><strong>Original recipe:</strong> <a href="${escapeHtml9(recipe.url)}">${escapeHtml9(recipe.publisher)}: ${escapeHtml9(recipe.name)}</a></p><p>${escapeHtml9(recipe.summary)}</p><p>${escapeHtml9(recipe.servingPlan)}</p><p><strong>Why it earns its place:</strong> ${escapeHtml9(recipe.basketFit)}</p></section>`).join("");
  const costs = table(
    ["Published dish", "Ingredient value", "Per serving"],
    [
      ...COOKING_FOR_ONE_RECIPES.map((recipe) => [recipe.name, recipe.ingredientValue, recipe.perServing]),
      ["Total", COOKING_FOR_ONE_USED_VALUE, "10 servings"]
    ]
  );
  const basket = table(
    ["Product", "Pack", "Price", "Used", "Value used"],
    COOKING_FOR_ONE_BASKET.map((item) => [item.product, item.pack, item.price, item.used, item.valueUsed])
  );
  const assumptions = COOKING_FOR_ONE_ASSUMPTIONS.map((item) => `<li>${escapeHtml9(item)}</li>`).join("");
  const leftovers = COOKING_FOR_ONE_LEFTOVERS.map((item) => `<li>${escapeHtml9(item)}</li>`).join("");
  return `<section><p>Cooking for one often becomes awkward at the shopping stage. Most recipe publishers still write for two or four people, while spinach, chicken and herbs arrive in packs that rarely match one serving. Scaling everything down can look neat on paper, but it may introduce quantities the original publisher never tested.</p><p>This plan takes a more practical route. Four established recipes are cooked at their published yield. One serving is eaten for dinner, three extra servings become named next-day lunches, and one four-serving dish supplies a second scheduled dinner plus two dated freezer portions.</p><p>The basket is coordinated to reduce waste, not eliminate it. Some food remains for later. The important part is that the perishable leftovers are visible and given a realistic destination.</p></section><section><h2>The five-dinner schedule</h2>${schedule}</section>${recipes}<section><h2>5. The freezer night</h2><p>Dinner five is one of the balsamic chicken portions frozen after dinner three. Defrost it in the fridge, use it within 24 hours of defrosting, and reheat it only once until steaming hot throughout. It is not a fifth recipe, which is precisely the point: no new shopping or preparation is needed.</p></section><section><h2>Where every serving goes</h2><p>The four published recipes provide ten servings: five scheduled dinners, three next-day lunches and two future freezer portions.</p></section><section><h2>What the basket costs</h2><p>At the prices checked on ${COOKING_FOR_ONE_PRICE_CHECK_DATE}, the estimated complete-pack checkout total is <strong>${COOKING_FOR_ONE_CHECKOUT_TOTAL}</strong> for 27 packs or items. The estimated value of the quantities used across all ten servings is <strong>${COOKING_FOR_ONE_USED_VALUE}</strong>, calculated from unrounded ingredient lines. In practical terms, a little under half of the checkout value is used in these recipes; much of the balance remains for later cooking.</p><p>Cooking oil, salt and pepper are assumed already owned and excluded from both figures. Temporary promotional reductions are not used. Aldi prices, pack sizes and availability may vary by store and can change after the check date.</p>${costs}</section><section><h2>The full Aldi basket</h2>${basket}</section><section><h2>Costing assumptions</h2><ul>${assumptions}</ul></section><section><h2>Fresh food left after the plan</h2><ul>${leftovers}</ul></section><section><h2>Food-safety note</h2><p>Cool cooked leftovers and put them in the fridge within two hours. Eat refrigerated leftovers within 48 hours or freeze them. Reheat only once and make sure food is steaming hot throughout. Once frozen food has defrosted in the fridge, use it within 24 hours.</p></section><section><h2>What DinnerByDesign did, and did not do</h2><p>DinnerByDesign selected and compared these published recipes. It did not develop or test them. Use each original publisher\u2019s page for quantities, timings and method.</p><p>DinnerByDesign\u2019s contribution is the Aldi availability check, the coordinated basket, the comparison between complete-pack checkout cost and ingredient value used, the serving destinations, and the explicit costing and leftover assumptions.</p></section>`;
}

// src/content/seoFoodCostGuides.ts
var extractLegacyArticleSections = (initialHtml) => {
  const match = initialHtml.match(/<article>([\s\S]*?)<\/article>/);
  if (!match) throw new Error("Legacy guide HTML is missing article content.");
  return match[1];
};
var UK_FOOD_COSTS_2026_PATH = "/food-costs/uk-food-costs-2026";
var UK_FOOD_COSTS_2026 = {
  title: "Why UK food costs are rising in 2026 \u2014 and what it means for your shopping",
  description: "A clear guide to UK food price inflation in 2026, what national figures mean for household shopping, and how planning dinners can help control costs and waste.",
  publishedAt: "2026-07-18",
  reviewedAt: "2026-07-19",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Understand current UK food-price changes and practical household budgeting implications",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-19",
  editorialNotes: "Recheck official releases, forecast dates and all numerical claims before changing the review date.",
  internalLinks: ["/dinner-plans/5-dinners-for-2-under-40", "/pricing-methodology"],
  disclosures: ["source_timing", "price_comparison"],
  sources: [
    { label: "ONS, Consumer price inflation, UK: May 2026", url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/may2026" },
    { label: "British Retail Consortium, Summer discounting keeps shop price inflation stable", url: "https://brc.org.uk/news-and-events/news/corporate-affairs/2026/ungated/summer-discounting-keeps-shop-price-inflation-stable/" },
    { label: "Which?, Food price inflation tracker", url: "https://www.which.co.uk/reviews/supermarkets/article/food-price-inflation-tracker-aU2oV0A46tu3" },
    { label: "Food Foundation, Food Prices Tracker: June 2026", url: "https://foodfoundation.org.uk/news/food-prices-tracker-june-2026" },
    { label: "Food and Drink Federation, 2026 food inflation forecast", url: "https://www.fdf.org.uk/wales/fdf/news-media/press-releases/2026/fdf-revises-food-inflation-forecast-to-at-least-9-by-the-end-of-2026/" },
    { label: "IGD, June 2026 food inflation forecast", url: "https://www.igd.com/articles/igd-releases-new-food-inflation-forecast/73470" }
  ]
};
var escapeHtml10 = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
function renderUkFoodCosts2026LegacyInitialHtml() {
  const guide = UK_FOOD_COSTS_2026;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(UK_FOOD_COST_CONTEXT_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml();
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml10(source.url)}">${escapeHtml10(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml10(guide.title)}</h1><p>${escapeHtml10(guide.description)}</p><p>By ${escapeHtml10(guide.editorialOwner)} \xB7 Published 18 July 2026 \xB7 Last reviewed 19 July 2026</p><article><section><h2>What is happening</h2><p>UK food price inflation eased through the first half of 2026. The most recent confirmed figure from the <a href="${escapeHtml10(guide.sources[0].url)}">ONS</a> is 2.2 per cent for the 12 months to May 2026, down from 3.7 per cent in April.</p><p>Two faster trackers gave an early reading for June. The <a href="${escapeHtml10(guide.sources[1].url)}">BRC</a> recorded 2.4 per cent, while <a href="${escapeHtml10(guide.sources[2].url)}">Which?</a> recorded 2.6 per cent. Their baskets and collection methods differ from the ONS, so the figures should not be treated as directly interchangeable.</p><p>The ONS is the official reference point used here. The next confirmed figure was due on 22 July 2026 when this guide was reviewed.</p></section><section><h2>What it could mean for your shopping</h2><p>National figures describe an average across the country and many kinds of shopping. They provide useful context, but they cannot predict what one household will spend. That depends on the dinners cooked, the ingredients bought and where the shopping is done.</p><p>For context, the <a href="${escapeHtml10(guide.sources[3].url)}">Food Foundation</a>'s tracked weekly shopping basket cost \xA353.51 to \xA360.24 in June 2026, up 30.6 to 38.4 per cent since April 2022.</p><p>DinnerByDesign works differently. Its estimates are built from the specific dinners, quantities and ingredient prices in a plan, not from a national average.</p></section>${disclosures}<section><h2>Why planning can make a difference</h2><ul><li>Reuse core ingredients across several dinners so less is bought and wasted.</li><li>Filter for lower-cost dinner ideas before deciding what to cook.</li><li>Use cheaper equivalent ingredients where a dinner allows it.</li><li>Work from a shopping list tied to scheduled dinners to avoid unplanned or duplicate purchases.</li></ul></section><section><h2>Ways DinnerByDesign can help</h2><p>DinnerByDesign's Low Cost filter surfaces suitable dinner ideas using lower-cost ingredients. Schedule one or more saved dinners and DinnerByDesign generates a costed shopping list, so you can review the estimate before you shop.</p><p><a href="/dinner-plans/5-dinners-for-2-under-40">Explore five dinners for two under \xA340</a> or <a href="/pricing-methodology">read how ingredient prices are calculated</a>.</p></section><section><h2>How the trackers differ</h2><ul><li><strong>ONS Consumer Prices Index:</strong> the official reference basket, published after each month ends.</li><li><strong>BRC Shop Price Index:</strong> shelf prices from major retailers, published faster but with different basket weightings.</li><li><strong>Which? tracker:</strong> around 27,000 individual product prices across major supermarkets.</li></ul><p>Different baskets, weightings and collection dates can produce different rates for the same period.</p></section><section><h2>Forecasts are not measured outcomes</h2><p>The <a href="${escapeHtml10(guide.sources[4].url)}">Food and Drink Federation</a> forecast food inflation of at least 9 per cent by the end of 2026. <a href="${escapeHtml10(guide.sources[5].url)}">IGD's June forecast</a> projected a peak of 5.5 per cent and an average of 3.7 to 4.7 per cent across 2026.</p><p>The forecasts differ because their assumptions, timing and scenarios differ. They are uncertain projections and should not be read as recorded price changes.</p></section><section><h2>Sources</h2><ul>${sources}</ul></section></article>${disclosureFooter}<p><a href="/signin">Plan my week</a></p></main></div>`;
}
var UK_FOOD_COSTS_2026_GUIDE_RECORD = {
  id: "uk-food-costs-2026",
  slug: "uk-food-costs-2026",
  path: UK_FOOD_COSTS_2026_PATH,
  canonicalPath: UK_FOOD_COSTS_2026_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...UK_FOOD_COSTS_2026,
  seoTitle: `${UK_FOOD_COSTS_2026.title} | DinnerByDesign`,
  metaDescription: UK_FOOD_COSTS_2026.description,
  label: "Food cost guide",
  nextReviewAt: "2026-08-19",
  disclosures: UK_FOOD_COST_CONTEXT_DISCLOSURES.map((disclosure) => disclosure.key),
  disclosureItems: UK_FOOD_COST_CONTEXT_DISCLOSURES,
  disclosureFooter: PROGRAMMATIC_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: extractLegacyArticleSections(renderUkFoodCosts2026LegacyInitialHtml()) }
  ],
  faqs: [
    {
      question: "Can national food inflation figures predict my shopping total?",
      answer: "No. National figures give useful context, but one household\u2019s spending depends on what is cooked, where the shopping is done, pack sizes, promotions and what is already in the kitchen."
    },
    {
      question: "Why do different food trackers show different numbers?",
      answer: "Trackers use different baskets, weightings, stores and collection dates. That means figures from ONS, BRC, Which? and other sources can point in the same direction while still producing different percentages."
    },
    {
      question: "Are food inflation forecasts measured price changes?",
      answer: "No. Forecasts are projections based on assumptions available at the time. They should be read separately from recorded figures already published by official or named tracker sources."
    }
  ],
  cta: {
    title: "Plan dinners with cost in mind",
    copy: "Use DinnerByDesign to compare dinner ideas, save the ones that suit you and build a shopping list around the week ahead.",
    label: "Plan my week",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderSources: false
};
var COOKING_FOR_ONE_PATH = "/food-costs/cooking-for-one-without-waste";
var COOKING_FOR_ONE_GUIDE = {
  title: "Five dinners for one from one Aldi basket",
  seoTitle: "Five dinners for one from one Aldi basket | DinnerByDesign",
  description: "A costed five-dinner plan for one using four established recipes, with an Aldi basket, next-day lunches, freezer portions and leftover guidance.",
  publishedAt: "2026-07-20",
  reviewedAt: "2026-07-28",
  priceReviewedAt: "2026-07-27",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Find a costed five-dinner plan for one using a coordinated Aldi basket with realistic leftovers",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-28",
  editorialNotes: "Monthly price review required. Recheck every Aldi basket line, the four publisher recipes and FSA guidance. Keep complete-pack checkout cost distinct from ingredient value used and do not introduce promotional prices.",
  internalLinks: ["/food-costs/ways-to-reduce-grocery-costs", "/food-costs/five-dinners-same-ingredients", "/pricing-methodology", "/food-safety", "/recipe-methodology"],
  disclosures: ["price_estimate", "serving_assumption", "source_timing", "storage_and_cooking", "allergen_and_product"],
  sources: [
    { label: "Tesco Real Food: Chickpea saag", url: "https://realfood.tesco.com/recipes/chickpea-saag.html" },
    { label: "Tesco Real Food: One-pot tomato pasta", url: "https://realfood.tesco.com/recipes/one-pot-tomato-pasta.html" },
    { label: "Aldi: One pot balsamic chicken", url: "https://www.aldi.co.uk/recipes/collections/family-meals/one-pot-balsamic-chicken" },
    { label: "Good Food: Chicken noodle soup", url: "https://www.bbcgoodfood.com/recipes/chicken-noodle-soup" },
    { label: "Aldi UK product listings", url: "https://www.aldi.co.uk/products" },
    { label: "Food Standards Agency: Cooking your food", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Does this plan scale publisher recipes down to one serving?", answer: "No. Each recipe is used at its published yield. Extra servings become three named next-day lunches, the fifth scheduled dinner and two dated freezer portions." },
    { question: "Why is the checkout total higher than the ingredient value used?", answer: "The checkout total covers every complete pack bought. Ingredient value counts only the quantities used in the ten servings. The remaining food carries into later cooking or needs a specific leftover plan." },
    { question: "Does the plan claim to be zero waste?", answer: "No. It is coordinated to reduce waste. The article identifies the remaining chicken, spinach, mushrooms, yogurt, vegetables and cupboard products rather than pretending every pack is finished." },
    { question: "Will the Aldi basket cost the same everywhere?", answer: "Not necessarily. Prices, pack sizes, promotions and stock can vary by store and change after the check date. The figures are a dated estimate rather than a promise." },
    { question: "Did DinnerByDesign develop or test these recipes?", answer: "No. The recipes come from Tesco Real Food, Aldi and Good Food. Follow the original publisher for quantities, timings and method. DinnerByDesign provides the basket, costing and leftover analysis." },
    { question: "What is assumed to be in the cupboard?", answer: "Cooking oil, salt and pepper are treated as already owned and excluded from the checkout and ingredient-value figures. Every other listed ingredient is costed." }
  ]
};
var COOKING_FOR_ONE_GUIDE_SECTIONS = [
  {
    rawHtml: renderCookingForOnePlanInitialHtml(),
    disclosureItems: COOKING_FOR_ONE_DISCLOSURES
  },
  {
    rawHtml: '<section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/five-dinners-same-ingredients">see how shared ingredients can become different dinners</a>, <a href="/pricing-methodology">read the pricing methodology</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section>'
  }
];
var COOKING_FOR_ONE_GUIDE_RECORD = {
  id: "cooking-for-one-without-waste",
  slug: "cooking-for-one-without-waste",
  path: COOKING_FOR_ONE_PATH,
  canonicalPath: COOKING_FOR_ONE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "price-sensitive",
  ...COOKING_FOR_ONE_GUIDE,
  nextReviewAt: "2026-08-28",
  metaDescription: COOKING_FOR_ONE_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: [
    ...COOKING_FOR_ONE_DISCLOSURES.slice(0, 3),
    COOKING_FOR_ONE_DISCLOSURES[4],
    COOKING_FOR_ONE_DISCLOSURES[3]
  ],
  disclosureFooter: COOKING_FOR_ONE_DISCLOSURE_FOOTER,
  sections: COOKING_FOR_ONE_GUIDE_SECTIONS,
  cta: {
    title: "Make the plan fit your week",
    copy: "Use DinnerByDesign to adapt dinner ideas around your preferences, budget and ingredients.",
    label: "Plan dinners for one",
    href: "/signin"
  }
};
var OFFAL_BUDGET_GUIDE_PATH = "/food-costs/cooking-with-offal-on-a-budget";
var OFFAL_BUDGET_GUIDE = {
  title: "Cooking with offal on a budget: what to buy and how to use it",
  seoTitle: "Cooking with offal on a budget | DinnerByDesign",
  description: "A practical UK guide to buying and cooking liver, kidney and heart, with current price comparisons, flavour ideas and essential safety guidance.",
  publishedAt: "2026-07-20",
  reviewedAt: "2026-07-20",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Learn whether offal can reduce dinner costs and how to buy and cook liver, kidney and heart safely",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-20",
  editorialNotes: "Recheck retailer prices and the cited FSA and NHS guidance before changing the review date.",
  internalLinks: ["/food-costs/ways-to-reduce-grocery-costs", "/pricing-methodology", "/food-safety", "/recipe-methodology"],
  disclosures: ["price_comparison", "source_timing", "storage_and_cooking", "allergen_and_product", "serving_assumption"],
  sources: [
    { label: "Food Standards Agency: Cooking your food", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food?ContensisTextOnly=true" },
    { label: "NHS: Vitamin A", url: "https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-a/" },
    { label: "NHS: Foods to avoid in pregnancy", url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/" },
    { label: "Tesco: Lamb liver, heart and kidney", url: "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-meat-and-poultry/fresh-lamb/lamb-liver" },
    { label: "Tesco: Lamb mince", url: "https://www.tesco.com/shop/en-GB/products/261941310" }
  ],
  faqs: [
    { question: "Is offal difficult to cook?", answer: "Liver often cooks quickly, while kidney can suit quick or slow cooking depending on the type and preparation. Heart can be cooked slowly or sliced thinly and cooked quickly. Follow a recipe written for the specific offal." },
    { question: "Can I substitute offal for ordinary meat in a recipe?", answer: "Not directly in most cases. Offal has different flavour, texture and cooking requirements, so use a recipe designed for the ingredient." },
    { question: "Is liver safe to eat pink?", answer: "No. The Food Standards Agency advises cooking liver and other offal thoroughly until steaming hot throughout." },
    { question: "How often can I eat liver?", answer: "The NHS advises against eating liver or liver products more than once a week. Liver and liver products should be avoided during pregnancy." },
    { question: "Where can I buy heart, tongue or tripe?", answer: "Availability is less consistent than liver or kidney. A local butcher may be able to source and prepare them, so check before travelling." },
    { question: "Is offal always the cheapest option?", answer: "No. It is often less expensive per kilogram than familiar cuts, but current price, pack size, edible yield and the total cost of the dinner all matter." },
    { question: "Can DinnerByDesign help me find offal options?", answer: "Yes. Search directly for liver, kidney, heart or other offal. You can also turn on Include offal in suggestions in Recipe preferences, or choose Offal in Plan my week for a single plan. Product availability and suitability vary." }
  ]
};
function renderOffalBudgetGuideInitialHtml() {
  const guide = OFFAL_BUDGET_GUIDE;
  const price = renderProgrammaticDisclosuresInitialHtml(OFFAL_PRICE_DISCLOSURES);
  const safety = renderProgrammaticDisclosuresInitialHtml(OFFAL_SAFETY_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(OFFAL_BUDGET_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map((faq) => `<section><h3>${escapeHtml10(faq.question)}</h3><p>${escapeHtml10(faq.answer)}</p></section>`).join("");
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml10(source.url)}">${escapeHtml10(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml10(guide.title)}</h1><p>${escapeHtml10(guide.description)}</p><p>By ${escapeHtml10(guide.editorialOwner)} \xB7 Published 20 July 2026 \xB7 Last reviewed 20 July 2026</p><article><section><p>Liver, kidney and heart can cost less than more familiar cuts, but they are not direct substitutes. Each brings its own flavour, texture and cooking requirement. Used thoughtfully \u2014 with onions, vegetables, grains, pulses and assertive seasonings \u2014 they can produce satisfying, characterful dinners without relying on a large quantity of meat.</p></section><section><h2>Why consider offal?</h2><p>Offal can bring meat into a dinner as a smaller, supporting element rather than the centrepiece. It is one option among several for managing ingredient spending, not something any household needs to adopt.</p></section><section><h2>Is it necessarily less expensive?</h2><p>Often, but not always. Price snapshot, 20 July 2026: Tesco listed lamb liver at \xA36.15/kg, lamb heart at \xA37.30/kg and lamb kidney at \xA38.00/kg, compared with lamb mince from \xA313.00/kg. Prices, ranges and availability change, so check the current shelf price.</p>${price}</section><section><h2>Liver, kidney and heart: how they differ</h2><ul><li><strong>Liver:</strong> soft in texture and mild to rich in flavour. Thin, evenly sized pieces cook through quickly.</li><li><strong>Kidney:</strong> firmer, with a distinct mineral flavour. It usually needs its white core trimmed and can suit quick or slow cooking.</li><li><strong>Heart:</strong> denser and leaner, closer to a muscle cut. Cook it long and slow, or slice it thinly for quick cooking.</li></ul></section><section><h2>Flavours that work well</h2><ul><li><strong>Liver:</strong> onions, sage, mustard, vinegar or sherry.</li><li><strong>Kidney:</strong> mustard, Worcestershire sauce, paprika, stock or ale.</li><li><strong>Heart:</strong> garlic, chilli, citrus or a vinegar-based marinade.</li></ul></section>${safety}<section><h2>Three approachable starting points</h2><ul><li>Thoroughly cooked lamb liver with onions, mustard and vinegar.</li><li>Kidney with root vegetables in a rich gravy.</li><li>Slow-cooked heart with garlic, smoked paprika and tomatoes.</li></ul></section><section><h2>Availability in supermarkets and butchers</h2><p>Liver and kidney are stocked fairly reliably by major UK supermarkets. Heart, tongue and tripe are less consistent, and a local butcher may be able to source and prepare them.</p></section><section><h2>Vitamin A, pregnancy and food-safety guidance</h2><p>The NHS advises against eating liver or liver products such as p\xE2t\xE9 more than once a week. Liver and liver products should be avoided during pregnancy. Follow the cited NHS and Food Standards Agency guidance.</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Find offal dinners and products</h2><p>Search DinnerByDesign for liver, kidney, heart and other offal options, then compare suitable dinners and ready-made products in one place.</p></section><section><h2>Sources and further reading</h2><p>Guidance and prices reviewed 20 July 2026.</p><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/pricing-methodology">read the pricing methodology</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Find suitable offal options</h2><p>Use DinnerByDesign to search directly or include offal in your personalised suggestions.</p><p><a href="/signin">Find offal dinners</a></p></section></main></div>`;
}
var OFFAL_BUDGET_GUIDE_RECORD = {
  id: "cooking-with-offal-on-a-budget",
  slug: "cooking-with-offal-on-a-budget",
  path: OFFAL_BUDGET_GUIDE_PATH,
  canonicalPath: OFFAL_BUDGET_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...OFFAL_BUDGET_GUIDE,
  nextReviewAt: "2027-07-20",
  metaDescription: OFFAL_BUDGET_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: [
    ...OFFAL_PRICE_DISCLOSURES,
    ...OFFAL_SAFETY_DISCLOSURES
  ],
  disclosureFooter: OFFAL_BUDGET_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: extractLegacyArticleSections(renderOffalBudgetGuideInitialHtml()) }
  ],
  cta: {
    title: "Find suitable offal options",
    copy: "Use DinnerByDesign to search directly or include offal in your personalised suggestions.",
    label: "Find offal dinners",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};
var PORTION_PLANNING_GUIDE_PATH = "/food-costs/portion-planning-and-food-waste";
var PORTION_PLANNING_GUIDE = {
  title: "How portion planning can help reduce food costs and waste",
  seoTitle: "Can Portion Planning Reduce Food Costs? | DinnerByDesign",
  description: "Learn how realistic portions, planned leftovers and better use of supermarket pack sizes can help reduce food spending and waste.",
  publishedAt: "2026-07-20",
  reviewedAt: "2026-07-20",
  contentReviewedAt: "2026-07-20",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Understand how portion planning, planned leftovers and pack-size awareness can reduce food spending and waste",
  indexingStatus: "index",
  editorialNotes: "The 300g and 500g example is illustrative arithmetic, not a retailer or product claim. Recheck FSA guidance before changing the review date.",
  internalLinks: ["/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses", "/dinner-plans/5-affordable-family-dinners-for-four", "/food-costs/cooking-for-one-without-waste", "/food-costs/ways-to-reduce-grocery-costs", "/food-costs/batch-cooking-on-a-budget", "/pricing-methodology", "/food-safety"],
  disclosures: ["serving_assumption", "storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Food Standards Agency: How to chill, freeze and defrost food safely", url: "https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely" },
    { label: "Food Standards Agency: Cooking your food", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food?ContensisTextOnly=true" }
  ],
  faqs: [
    { question: "Does cooking smaller portions always reduce the checkout cost?", answer: "No. Many ingredients are sold in fixed pack sizes, so cooking less does not necessarily mean buying less. The value depends on what happens to the unused part of the pack, not just how much you serve." },
    { question: "Should I halve a recipe written for four?", answer: "It can work well if your household is smaller and you do not want leftovers. Cooking the full recipe and planning the extra portions is equally reasonable and can make better use of a fixed pack size." },
    { question: "When is cooking extra more economical?", answer: "When there is a specific plan for the extra before you start cooking \u2014 another dinner, a lunch or the freezer. Extra that is cooked without a plan and thrown away is not a saving." },
    { question: "Which ingredients are most useful to portion before cooking?", answer: "More expensive ingredients such as meat, fish and cheese are worth particular attention because changing their quantity usually makes the greatest difference to the cost of a dinner." },
    { question: "How does DinnerByDesign calculate cost per portion?", answer: "Cost per portion reflects the value of the ingredients used in a dinner at the number of servings you set. It does not necessarily match your checkout total because complete packs usually have to be bought." }
  ]
};
var PORTION_PLANNING_GUIDE_SECTIONS = [
  {
    rawHtml: '<section><p>It is easy to assume that cooking more is generous and cooking less saves money. In practice, the two do not always match up. Cooking too much of an expensive ingredient can quietly push up what a dinner costs, while serving smaller portions does not automatically reduce the supermarket checkout because much of what you buy comes in a fixed pack.</p></section><section><h2>Portion planning, not portion control</h2><p>Portion planning is not about eating less. It is about deciding before you cook how many people a dinner is meant to serve and whether any extra portions have a specific purpose.</p></section><section><h2>Where portion planning makes the greatest difference</h2><p>Portion planning has the biggest effect on ingredients that cost the most, particularly meat, fish and cheese. Vegetables, pulses, grains, potatoes and a well-flavoured sauce can provide volume, texture and flavour around a smaller quantity of the priciest ingredient.</p><p>The guide to <a href="/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses">dinners built around potatoes, rice, pasta, bread and pulses</a> shows how five familiar staples can provide the structure of a complete dish.</p></section><section><h2>Why checkout costs do not always fall</h2><p>If a dinner needs 300g of mince and the smallest available pack is 500g, the full pack still has to be bought. Keep two figures separate: the value of ingredients used in the dinner and the cost of the complete packs bought. The unused part provides further value when it is used in another dinner or stored safely for later.</p></section><section><h2>When cooking extra is economical</h2><p>A larger batch can make good use of a fixed pack when the extra has a purpose before cooking begins: another dinner, a lunch or the freezer.</p></section><section><h2>How to plan portions realistically</h2><p>Realistic portions depend on who you are feeding, their appetite and what else is being served. A household of two can halve a recipe written for four or cook the full amount and earmark the extra for later.</p></section>',
    disclosureItems: PORTION_PLANNING_DISCLOSURES
  },
  {
    rawHtml: '<section><h2>Practical ways to reduce waste</h2><ul><li>Weigh or measure more expensive ingredients rather than guessing.</li><li>Divide large packs into usable portions promptly.</li><li>Freeze suitable surplus and label leftovers with the date.</li><li>Schedule shared ingredients across several dinners.</li></ul></section><section><h2>Keeping lower-cost dinners satisfying</h2><p>A smaller quantity of chicken can be shredded through spiced rice with herbs and lime. Strong cheese can be grated through a gratin. Pulses and grains take on bold flavours from curry paste, harissa or toasted spices, allowing meat, fish or cheese to add character rather than bulk.</p></section><section><h2>How DinnerByDesign helps</h2><p>DinnerByDesign lets you set servings and see an estimated cost per portion. Build a week that reuses ingredients and generate a shopping list from scheduled dinners, so complete packs are bought with a plan for using them.</p></section><section><h2>Making portion planning work</h2><p>Portion planning works best as part of a bigger picture: realistic servings, awareness of pack sizes, planned leftovers and a week of dinners that share ingredients. It is about making sure everything you buy gets used well.</p></section><section><h2>Related guidance</h2><p><a href="/dinner-plans/5-affordable-family-dinners-for-four">See a five-dinner family plan with serving and pack costs</a>, <a href="/food-costs/cooking-for-one-without-waste">plan dinners for one without waste</a>, <a href="/food-costs/ways-to-reduce-grocery-costs">explore practical ways to manage grocery costs</a>, <a href="/food-costs/batch-cooking-on-a-budget">learn when batch cooking can save money</a>, <a href="/pricing-methodology">read the pricing methodology</a> or <a href="/food-safety">review food-safety guidance</a>.</p></section>'
  }
];
var PORTION_PLANNING_GUIDE_RECORD = {
  id: "portion-planning-and-food-waste",
  slug: "portion-planning-and-food-waste",
  path: PORTION_PLANNING_GUIDE_PATH,
  canonicalPath: PORTION_PLANNING_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...PORTION_PLANNING_GUIDE,
  nextReviewAt: "2027-07-20",
  metaDescription: PORTION_PLANNING_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: PORTION_PLANNING_DISCLOSURES,
  disclosureFooter: PORTION_PLANNING_DISCLOSURE_FOOTER,
  sections: PORTION_PLANNING_GUIDE_SECTIONS,
  cta: {
    title: "Plan portions across your week",
    copy: "Use DinnerByDesign to set servings, coordinate ingredients and create a shopping list from scheduled dinners.",
    label: "Plan my week",
    href: "/signin"
  }
};
var MEDITERRANEAN_AFFORDABLE_COOKING_PATH = "/food-costs/mediterranean-inspired-affordable-cooking";
var MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE = {
  title: "Mediterranean-inspired ways to make everyday ingredients taste good",
  seoTitle: "Mediterranean-inspired budget cooking | DinnerByDesign",
  description: "How techniques from Greek, Italian, Lebanese and Spanish cooking can help you make satisfying, affordable dinners, with practical UK-supermarket substitutions.",
  publishedAt: "2026-07-20",
  reviewedAt: "2026-07-20",
  contentReviewedAt: "2026-07-20",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Use Mediterranean-inspired cooking techniques to make affordable ingredients appetising and reuse them across several dinners",
  indexingStatus: "index",
  editorialNotes: "Keep the traditions distinct, retain the softened Spanish framing, and recheck the cultural, FSA and allergen sources before changing the review date.",
  internalLinks: ["/food-costs/ways-to-reduce-grocery-costs", "/food-costs/portion-planning-and-food-waste", "/food-costs/fresh-or-frozen", "/food-safety", "/recipe-methodology"],
  disclosures: ["storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Visit Greece: Greek pulses to quicken your pulse", url: "https://www.visitgreece.gr/experiences/gastronomy/traditional-products/greek-pulses-to-quicken-your-pulse/" },
    { label: "Turismo Roma: Chickpeas and Roman-style pasta with chickpeas", url: "https://www.turismoroma.it/en/page/chickpeas-and-roman-style-pasta-chickpeas" },
    { label: "Lebanese University-affiliated research: Lebanese food exchange system including moujadara", url: "https://www.researchgate.net/publication/348394395_Development_of_a_Lebanese_food_exchange_system_based_on_frequently_consumed_Eastern_Mediterranean_traditional_dishes_and_Arabic_sweets" },
    { label: "La Tienda: Lentil and Chorizo Stew \u2014 preparation reference only", url: "https://www.tienda.com/recipes/lentil-and-chorizo-stew" },
    { label: "Food Standards Agency: How to chill, freeze and defrost food safely", url: "https://www.food.gov.uk/safety-hygiene/how-to-chill-freeze-and-defrost-food-safely" },
    { label: "Food Standards Agency: Allergen guidance for food businesses", url: "https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses" }
  ],
  faqs: [
    { question: "Is Mediterranean cooking always cheaper?", answer: "No. Good olive oil, fresh fish, nuts and speciality cheese can be some of the pricier items in a UK shop. The value here comes from specific techniques, not from the region's cooking being inexpensive overall." },
    { question: "Do I need extra virgin olive oil, or can I use something else?", answer: "A more everyday cooking oil works for the cooking itself, although the dish will lose some of olive oil's characteristic flavour. If you want that flavour, a small amount used to finish the dish goes further than using it throughout." },
    { question: "Can I make these dinners vegetarian or vegan?", answer: "Fasolada and the mujadara version described here contain no meat. Pasta e ceci can be prepared without anchovy where the chosen recipe allows. For a meat-free Spanish-inspired lentil stew, omit the chorizo and build the smoky flavour with paprika, recognising that this is an adaptation rather than traditional lentejas con chorizo." },
    { question: "What is the easiest way to start if I have not cooked much with lentils or chickpeas before?", answer: "Tinned lentils and chickpeas are the simplest way in. They are already cooked and only need heating through, so a dish such as pasta e ceci or mujadara is a reasonable first attempt." },
    { question: "How can I avoid the more expensive ingredients pushing up the price?", answer: "Use them in small quantities as flavouring \u2014 a little chorizo, a modest amount of good olive oil as a finishing touch, or cheese grated rather than sliced \u2014 rather than as the bulk of the dinner." }
  ]
};
function renderMediterraneanAffordableCookingInitialHtml() {
  const guide = MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE;
  const storage = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_STORAGE_DISCLOSURES);
  const product = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_PRODUCT_DISCLOSURES);
  const sourceTiming = renderProgrammaticDisclosuresInitialHtml(MEDITERRANEAN_SOURCE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(MEDITERRANEAN_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map((faq) => `<section><h3>${escapeHtml10(faq.question)}</h3><p>${escapeHtml10(faq.answer)}</p></section>`).join("");
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml10(source.url)}">${escapeHtml10(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml10(guide.title)}</h1><p>${escapeHtml10(guide.description)}</p><p>By ${escapeHtml10(guide.editorialOwner)} \xB7 Published 20 July 2026 \xB7 Last reviewed 20 July 2026</p><article><section><p>Beans, lentils, grains, vegetables and a handful of well-chosen flavourings turn up again and again across the Mediterranean's many different culinary traditions \u2014 and they are a genuinely useful starting point for a satisfying, affordable dinner. This is not a claim that Mediterranean cooking is cheap: some of its best-known ingredients, from good olive oil to fresh fish, are not. It is an argument for borrowing a handful of techniques that several of these traditions share.</p></section><section><h2>There is no single Mediterranean cuisine</h2><p>Greek, Italian, Lebanese, Spanish, Moroccan and Turkish cooking \u2014 to name just a few \u2014 are distinct culinary traditions with their own ingredients, history and character. Treating Mediterranean food as one uniform, inexpensive cuisine flattens that variety, and it is not accurate either. What is worth taking from these traditions is not a claim about their overall cost, but a set of techniques that turn up across several of them.</p></section><section><h2>Where the practical value comes from</h2><ul><li>Building a dinner around beans, lentils, grains and vegetables, rather than a large piece of meat or fish.</li><li>Using herbs, garlic, citrus, tomatoes and spices to bring flavour, rather than relying on the quantity of a costly ingredient.</li><li>Treating meat, fish or cheese as a smaller, supporting element where a dish calls for it, rather than the bulk of the plate.</li><li>Reusing bread, cooked grains, sauces and vegetables across more than one dinner.</li></ul><p>None of this is exclusive to the Mediterranean \u2014 similar techniques appear in low-cost cooking traditions worldwide \u2014 but it is a useful, well-documented set of examples to draw from.</p></section><section><h2>Affordable ingredients that carry flavour well</h2><ul><li>Dried or tinned lentils, chickpeas and beans</li><li>Onions and garlic</li><li>Tinned tomatoes</li><li>Rice, pasta, bulgur wheat and couscous</li><li>Herbs such as parsley, oregano, mint and bay</li><li>Spices such as cumin, paprika and cinnamon</li><li>Lemon</li></ul><p>These form the backbone of a satisfying dinner without needing a large quantity of any single expensive ingredient.</p></section><section><h2>Ingredients that can make the checkout more expensive</h2><p>Good-quality extra virgin olive oil, fresh fish and seafood, pine nuts, almonds, saffron and speciality cheeses can all add significantly to a shopping bill. They can still have a place \u2014 used in small quantities, saved for when you want to spend a little more, or swapped for a more accessible alternative.</p></section><section><h2>Four appetising dinner examples</h2><h3>Greek fasolada</h3><p>A hearty white bean soup, one of the best-known bean dishes in Greek cooking, made by simmering dried white beans with onion, carrot, celery and tomato, finished with a generous amount of olive oil. It is traditionally meat-free.</p><h3>Roman pasta e ceci</h3><p>A central and southern Italian dish of small pasta and chickpeas, simmered in a tomato-and-rosemary broth with garlic. The chickpea-and-pasta base needs no meat, although some Roman versions include anchovy.</p><h3>Lebanese mujadara</h3><p>A Levantine dish of lentils and rice, or bulgur wheat, built almost entirely around deeply caramelised onions, with cumin as the main spice. The version described here contains no animal-derived ingredients; check stock, packaged ingredients and accompaniments. It is found across Lebanon, Jordan and Syria.</p><h3>Spanish lentejas con chorizo</h3><p>A Spanish lentil stew with potato, carrot, onion, garlic and paprika, where a small amount of chorizo is sliced in to flavour the whole pot rather than serving as the main component.</p></section><section><h2>Reusing ingredients across several dinners</h2><p>A larger pot of cooked lentils, chickpeas or rice can be split across two or three dinners. A batch of caramelised onions can flavour a grain, a stew or a simple bean dish. A tomato-and-garlic base can work beneath pasta e ceci one night and a different bean or vegetable dinner later on.</p></section>${storage}<section><h2>UK-supermarket substitutions and how they alter the result</h2><ul><li>Tinned lentils or chickpeas are already cooked, so they can be drained and added without soaking, in place of dried.</li><li>Use a more everyday cooking oil in place of extra virgin olive oil for cooking. The dish will lose some of the fruitier, more peppery flavour that good olive oil brings, although this matters less for cooking than for a finishing drizzle.</li><li>Widely available cooking chorizo can replace a specific artisan variety. It still gives a smoky, paprika-forward flavour, although the exact taste and texture vary by brand.</li><li>A more everyday hard cheese can replace Parmesan or Pecorino for grating. This changes the flavour but still adds a savoury, salty finish.</li><li>A widely available long-grain rice may replace a specific variety, but texture, liquid requirements and cooking time can differ, so follow the pack instructions.</li></ul><p>These substitutions change the character of a dish rather than its core structure, so try the closest available alternative rather than skipping the ingredient's role entirely.</p></section>${product}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for dinners built around beans, lentils and grains, and use the Low Cost filter alongside these techniques. Plan my week can help you schedule dinners that reuse a base sauce, cooked grain or batch of caramelised onions across more than one night.</p></section><section><h2>Sources and further reading</h2><p>The Spanish example uses a preparation reference rather than an official cultural authority and is therefore described in deliberately general terms.</p><ul>${sources}</ul></section>${sourceTiming}<section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce waste</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Make affordable ingredients taste good</h2><p>Use DinnerByDesign to find suitable dinners and plan ingredients across your week.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
var MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE_RECORD = {
  id: "mediterranean-inspired-affordable-cooking",
  slug: "mediterranean-inspired-affordable-cooking",
  path: MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  canonicalPath: MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE,
  nextReviewAt: "2027-07-20",
  metaDescription: MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: [
    ...MEDITERRANEAN_STORAGE_DISCLOSURES,
    ...MEDITERRANEAN_PRODUCT_DISCLOSURES,
    ...MEDITERRANEAN_SOURCE_DISCLOSURES
  ],
  disclosureFooter: MEDITERRANEAN_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: extractLegacyArticleSections(renderMediterraneanAffordableCookingInitialHtml()) }
  ],
  cta: {
    title: "Make affordable ingredients taste good",
    copy: "Use DinnerByDesign to find suitable dinners and plan ingredients across your week.",
    label: "Plan my week",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};
var SUMMER_STEWS_GUIDE_PATH = "/food-costs/summer-stews-seasonal-vegetables";
var SUMMER_STEWS_GUIDE = {
  title: "Summer stews: making vegetables go further",
  seoTitle: "Summer stews and vegetable ideas | DinnerByDesign",
  description: "A practical guide to building lighter, appetising stews around whichever vegetables are available, affordable or already in the fridge.",
  publishedAt: "2026-07-20",
  reviewedAt: "2026-07-20",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Use flexible summer stews to make good-value vegetables and shared ingredients go further",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-20",
  editorialNotes: "Review the cited Food Standards Agency guidance before changing the content review date. The dinner examples are flexible ideas rather than named traditional dishes.",
  internalLinks: ["/food-costs/ways-to-reduce-grocery-costs", "/food-costs/portion-planning-and-food-waste", "/food-safety", "/recipe-methodology"],
  disclosures: ["storage_and_cooking", "allergen_and_product", "source_timing"],
  sources: [
    { label: "Food Standards Agency: Cooking your food", url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food" }
  ],
  faqs: [
    { question: "Do vegetables cost less in summer?", answer: "Not automatically \u2014 prices and availability vary by vegetable, retailer and time of year. The value in this approach comes from flexibility and reuse, not from a guaranteed seasonal saving." },
    { question: "Can I use frozen or tinned vegetables instead of fresh?", answer: "Frozen vegetables can work well, but follow the pack instructions and cook them thoroughly. They may need to be added earlier than their fresh equivalents. Tinned tomatoes provide a convenient base for all three examples." },
    { question: "Do I need to add vegetables in stages, or can I add everything at once?", answer: "Staging keeps more texture and colour in the finished dish, but it is not essential. Adding everything together and cooking it down is a reasonable alternative if that is the result you prefer." },
    { question: "How long can I keep a cooked stew before eating it?", answer: "Refrigerate it within two hours of cooking, and eat it within 48 hours or freeze it. Reheat only once, until it is steaming hot throughout." },
    { question: "What if I do not have the exact vegetables listed in a recipe?", answer: "These dinners are built to accept substitution \u2014 use whichever similar vegetables are good value or already need using and remain safe to eat, adjusting cooking time for firmer or softer ingredients as needed." }
  ]
};
function renderSummerStewsGuideInitialHtml() {
  const guide = SUMMER_STEWS_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(SUMMER_STEWS_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(SUMMER_STEWS_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map((faq) => `<section><h3>${escapeHtml10(faq.question)}</h3><p>${escapeHtml10(faq.answer)}</p></section>`).join("");
  const sources = guide.sources.map((source) => `<li><a href="${escapeHtml10(source.url)}">${escapeHtml10(source.label)}</a></li>`).join("");
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml10(guide.title)}</h1><p>${escapeHtml10(guide.description)}</p><p>By ${escapeHtml10(guide.editorialOwner)} \xB7 Published 20 July 2026 \xB7 Last reviewed 20 July 2026</p><article><section><p>A summer stew is generally lighter and quicker-cooking than a winter stew, built on fresh vegetables, herbs and a lighter broth or tomato base. Ingredients go in at different stages so each one keeps an appropriate texture, rather than everything cooking down together for hours.</p><p>The financial case for cooking this way is not that summer vegetables are automatically cheap \u2014 prices and availability still vary through the season and by retailer. It is that a stew built this way is unusually good at absorbing whatever you actually have that remains safe to eat: whichever vegetables are good value that week, or already sitting in the fridge needing to be used.</p></section><section><h2>Where the practical value comes from</h2><ul><li>It accommodates whichever vegetables are currently good value or already need using, provided they remain safe to eat.</li><li>It combines vegetables with beans, lentils or grains, rather than relying on a large quantity of meat.</li><li>One tomato base, bunch of herbs or pack of vegetables can be used across several dinners.</li><li>Irregular quantities and surplus vegetables \u2014 the half pepper, the last two courgettes \u2014 become an intentional part of the dish rather than loose ends to work around.</li><li>It accepts substitutions without needing a completely different recipe.</li><li>It can be served with bread, rice or another inexpensive accompaniment when you want more volume.</li></ul></section><section><h2>Staging vegetables by cooking time</h2><p>The main technique worth knowing is that not everything needs to go into the pot at once. Onions and firmer vegetables \u2014 peppers, aubergine, carrots \u2014 go in first and cook down into the base. Courgette, leafy vegetables and other more delicate ingredients go in later, so they retain their colour, texture and freshness rather than turning soft and grey. Herbs, and any final squeeze of lemon, go in right at the end, off the heat or close to it.</p><p>This is not a rigid rule \u2014 some dinners benefit from everything cooking down together, and that is a reasonable choice too. Staging is simply a way to keep more texture and colour in the finished dish, if that is what you want from it.</p></section><section><h2>Three flexible dinner ideas</h2><p>These are presented as adaptable starting points rather than named traditional dishes \u2014 change the vegetables to whatever you have, and treat the quantities as a guide rather than a fixed recipe.</p><h3>Tomato, courgette and butter bean stew with lemon and basil</h3><p>Onion and garlic cooked down first with tinned tomatoes, then butter beans warmed through, courgette added in the last few minutes so it keeps some bite, finished with lemon juice and torn basil off the heat.</p><h3>Chicken, pepper and sweetcorn broth with smoked paprika</h3><p>A light broth built from onion, pepper and smoked paprika, with a modest amount of chicken added to flavour rather than fill the bowl, and sweetcorn stirred in towards the end so it stays sweet and crisp. Cook the chicken thoroughly until steaming hot throughout, with no pink meat remaining.</p><h3>Aubergine, chickpea and tomato stew finished with fresh herbs</h3><p>Aubergine cooked down with onion and garlic until soft, chickpeas added to warm through, tinned tomatoes providing the base, and a handful of fresh parsley or coriander stirred in just before serving.</p></section><section><h2>Reusing a base across several dinners</h2><p>A larger batch of the onion-and-tomato base from any of these can do more than one job: it is the start of tonight's stew, but it can just as easily go under some pasta, alongside a piece of fish, or into a bean dish later in the week. The same applies to a bunch of herbs or a pack of vegetables bought for one dinner \u2014 splitting it across two dinners in the same week is usually more useful than trying to use all of it in one sitting.</p></section><section><h2>Serving for extra volume</h2><p>Bread, rice, couscous or another inexpensive accompaniment is a straightforward way to add volume to a lighter stew without adding more of the more expensive ingredients. A smaller pot of stew served over rice, or with a thick slice of bread on the side, often goes further than the same stew served alone.</p></section><section><h2>Food safety for cooked stews</h2><p>These dishes can be eaten warm or a little cooler, but that should not be confused with leaving a cooked stew out at room temperature for an extended period. Current Food Standards Agency guidance is to cool cooked food and refrigerate it within two hours, eat refrigerated leftovers within 48 hours or freeze them, and reheat only once, until steaming hot all the way through.</p></section>${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for dinners that flex around whatever vegetables you have, and use the Low Cost filter alongside these techniques. Plan my week can help schedule a base sauce, herb bunch or vegetable pack across more than one dinner, and our <a href="/food-costs/ways-to-reduce-grocery-costs">low-cost cooking techniques</a> and <a href="/food-costs/portion-planning-and-food-waste">portion-planning guides</a> cover the wider principles in more detail.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section><section><h2>Related guidance</h2><p><a href="/food-costs/ways-to-reduce-grocery-costs">Explore practical ways to manage grocery costs</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce waste</a>, <a href="/food-costs/fresh-or-frozen">choose between fresh and frozen produce</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section></article>${footer}<section><h2>Make vegetables work harder across your week</h2><p>Find suitable dinners and plan shared ingredients with DinnerByDesign.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
var SUMMER_STEWS_GUIDE_RECORD = {
  id: "summer-stews-seasonal-vegetables",
  slug: "summer-stews-seasonal-vegetables",
  path: SUMMER_STEWS_GUIDE_PATH,
  canonicalPath: SUMMER_STEWS_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...SUMMER_STEWS_GUIDE,
  nextReviewAt: "2027-07-20",
  metaDescription: SUMMER_STEWS_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: SUMMER_STEWS_DISCLOSURES,
  disclosureFooter: SUMMER_STEWS_DISCLOSURE_FOOTER,
  sections: [
    { rawHtml: extractLegacyArticleSections(renderSummerStewsGuideInitialHtml()) }
  ],
  cta: {
    title: "Make vegetables work harder across your week",
    copy: "Find suitable dinners and plan shared ingredients with DinnerByDesign.",
    label: "Plan my week",
    href: "/signin"
  },
  autoRenderDisclosures: false,
  autoRenderFaqs: false,
  autoRenderSources: false
};
var FRESH_OR_FROZEN_GUIDE_PATH = "/food-costs/fresh-or-frozen";
var FRESH_OR_FROZEN_GUIDE = {
  title: "Fresh or frozen: which is better for the way you cook?",
  seoTitle: "Fresh or frozen: which is better for the way you cook? | DinnerByDesign",
  description: "How fresh and frozen fruit and vegetables generally differ, and how to choose between them depending on what and how you are cooking.",
  publishedAt: "2026-07-21",
  reviewedAt: "2026-07-21",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Choose between fresh and frozen fruit and vegetables based on use, storage, texture and waste",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-21",
  editorialNotes: "NHS and Food Standards Agency guidance was reviewed on 20 July 2026. Product-specific pages need their own source and suitability checks.",
  internalLinks: ["/dinner-plans/5-affordable-family-dinners-for-four", "/food-costs/portion-planning-and-food-waste", "/food-costs/summer-stews-seasonal-vegetables", "/food-safety", "/recipe-methodology"],
  disclosures: ["storage_and_cooking", "source_timing"],
  sources: [
    { label: "NHS: 5 A Day \u2014 what counts?", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/" },
    { label: "Food Standards Agency: Cooking your food", url: "https://www.food.gov.uk/safety-hygiene/cooking-your-food" }
  ],
  faqs: [
    { question: "Can I mix fresh and frozen ingredients in the same dish?", answer: "Yes. Add each ingredient at the stage that suits its cooking time and follow the packet instructions for frozen products." },
    { question: "Can cooked dishes made with frozen ingredients be stored?", answer: "Follow the storage and reheating guidance for the finished dish, as well as any instructions on the ingredient packet." },
    { question: "Why do packet instructions matter?", answer: "Preparation, defrosting, cooking and storage requirements vary between products. The packet gives the instructions for the particular product you bought." },
    { question: "Is fresh or frozen always the cheapest option?", answer: "No. Prices, pack sizes and the amount you will actually use vary. Compare the current pack price with how much is likely to be eaten rather than assuming one format always costs less." },
    { question: "What should I choose if I am unsure?", answer: "Choose fresh when appearance, crispness or uncooked texture matters. Choose frozen when longer storage and taking out only what you need are more useful, while checking that the product suits your intended dish." }
  ]
};
var FRESH_OR_FROZEN_GUIDE_SECTIONS = [
  {
    rawHtml: "<section><p>Fresh fruit and vegetables can be ideal when texture, appearance or immediate use matters. Frozen versions offer a longer storage window and are often washed, trimmed and portioned before freezing. Some can be cooked straight from frozen; others need to be handled according to the packet.</p><p>Neither format is automatically better or cheaper. The useful question is which one suits what you are cooking, how soon you will use it and how much is likely to be left over.</p></section><section><h2>Quick answer</h2><p>Choose fresh when crispness, appearance or uncooked texture is central to the dish. Choose frozen when longer storage, convenience and using only the amount needed matter more. The best choice varies by product and cooking method.</p></section><section><h2>Key differences</h2><table><thead><tr><th>Factor</th><th>Fresh</th><th>Frozen</th></tr></thead><tbody><tr><th>Best for</th><td>Raw or appearance-led uses, depending on the product</td><td>Cooked dishes where a softer texture is suitable</td></tr><tr><th>Texture</th><td>Often firmer when recently bought and stored well</td><td>Product-dependent; may soften or release moisture</td></tr><tr><th>Storage</th><td>Varies by product; check its condition and date</td><td>Generally longer; follow the date and storage instructions</td></tr><tr><th>Preparation</th><td>May need washing, trimming or chopping</td><td>Often prepared and portioned, but check the packet</td></tr><tr><th>Waste</th><td>Useful when the whole amount will be eaten in time</td><td>Useful when you want to remove smaller amounts and keep the rest frozen</td></tr><tr><th>Nutrition</th><td>Both fresh and frozen fruit and vegetables count towards 5 A Day; exact content varies</td><td>Neither format is universally more nutritious</td></tr></tbody></table></section><section><h2>Does freezing affect quality?</h2><p>It can. Freezing changes the structure of some fruit and vegetables, so they may be softer after defrosting or release more moisture during cooking. That may matter in a salad or a dish where a crisp finish is important, but much less in a soup, stew, sauce, pie filling or blended dish.</p><p>The effect is product-specific. Frozen peas can retain a useful colour and sweetness in cooked dishes, while frozen spinach is particularly convenient where it will be stirred into a sauce, curry or stew. Frozen berries may soften as they thaw but can still work well in compote, baking or porridge when prepared according to the packet.</p></section><section><h2>Is frozen produce as nutritious as fresh?</h2><p>Both fresh and frozen fruit and vegetables count towards your 5 A Day. Exact nutrient content varies with the product, variety, storage and cooking, so neither format should be described as universally more nutritious.</p></section><section><h2>Which is more convenient?</h2><p>Frozen produce is often washed, trimmed, chopped or portioned before sale. That can shorten preparation and lets you remove only what you need. Fresh produce can be more convenient when it will be eaten uncooked or needs no defrosting, and when its appearance or crispness matters.</p><p>If only part of a frozen pack is used, return the remainder to the freezer promptly, reseal it and follow the packet's storage instructions.</p></section><section><h2>Which can create less waste?</h2><p>Frozen produce can reduce unused leftovers because a smaller quantity can be taken from the pack while the rest stays frozen. Fresh can be equally sensible when you know the whole amount will be used while it is still suitable to eat. Buying more than you need undermines either choice.</p></section><section><h2>Best cooking uses</h2><ul><li><strong>Salads and presentation-led dishes:</strong> fresh is usually the more suitable starting point.</li><li><strong>Soups, stews, curries and pies:</strong> either can work; adjust timing and liquid for the product.</li><li><strong>Roasting and stir-frying:</strong> product-dependent, because some frozen vegetables release more moisture.</li><li><strong>Baking, compotes and porridge:</strong> frozen fruit can work well when prepared according to the packet.</li></ul></section><section><h2>When to choose fresh</h2><ul><li>You plan to use it soon.</li><li>Texture, crispness or appearance is important.</li><li>The ingredient will be served uncooked and is suitable for that use.</li><li>You know the amount bought will be used.</li></ul></section><section><h2>When to choose frozen</h2><ul><li>You want a longer storage window.</li><li>You need only a small amount at a time.</li><li>Prepared or portioned ingredients make the dish easier.</li><li>The ingredient will be cooked into a dish where a softer texture is suitable.</li></ul></section><section><h2>Verdict</h2><p>Neither format is universally better. Choose according to how soon the ingredient will be used, how it will be cooked and whether convenience, texture or reducing waste matters most for that dinner.</p></section>",
    disclosureItems: FRESH_OR_FROZEN_DISCLOSURES
  },
  {
    rawHtml: '<section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign by ingredient, then use Plan my week to place fresh and frozen options where they make most sense across the week.</p></section><section><h2>Related guidance</h2><p><a href="/dinner-plans/5-affordable-family-dinners-for-four">See how one family dinner plan uses fresh and frozen ingredients across five dinners</a>, <a href="/food-costs/portion-planning-and-food-waste">plan portions and reduce food waste</a>, <a href="/food-costs/summer-stews-seasonal-vegetables">make vegetables go further in summer stews</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section>'
  }
];
var FRESH_OR_FROZEN_GUIDE_RECORD = {
  id: "fresh-or-frozen",
  slug: "fresh-or-frozen",
  path: FRESH_OR_FROZEN_GUIDE_PATH,
  canonicalPath: FRESH_OR_FROZEN_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...FRESH_OR_FROZEN_GUIDE,
  nextReviewAt: "2027-07-21",
  metaDescription: FRESH_OR_FROZEN_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: FRESH_OR_FROZEN_DISCLOSURES,
  disclosureFooter: FRESH_OR_FROZEN_DISCLOSURE_FOOTER,
  sections: FRESH_OR_FROZEN_GUIDE_SECTIONS,
  cta: {
    title: "Choose ingredients that suit your week",
    copy: "Search by what you have and plan flexible dinners.",
    label: "Plan my week",
    href: "/signin"
  }
};
var BATCH_COOKING_GUIDE_PATH = "/food-costs/batch-cooking-on-a-budget";
var BATCH_COOKING_GUIDE = {
  title: "Batch cooking on a budget: when it saves money and when it doesn't",
  seoTitle: "Batch cooking on a budget: when it saves money | DinnerByDesign",
  description: "Batch cooking can make ingredients go further, but only when portions are planned, stored safely and actually eaten. Here's when it works.",
  publishedAt: "2026-07-21",
  reviewedAt: "2026-07-21",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Food cost guide",
  primarySearchIntent: "Understand when batch cooking can reduce shopping costs and how to plan, vary and store portions safely",
  indexingStatus: "index",
  contentReviewedAt: "2026-07-21",
  editorialNotes: "Food Standards Agency guidance was reviewed on 20 July 2026. No retailer prices, numerical savings or energy-consumption claims are included.",
  internalLinks: ["/food-costs/portion-planning-and-food-waste", "/food-costs/ways-to-reduce-grocery-costs", "/food-safety", "/recipe-methodology"],
  disclosures: ["allergen_and_product", "storage_and_cooking", "source_timing"],
  sources: [
    { label: "Food Standards Agency: Cooking your food", url: "https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food" },
    { label: "Food Standards Agency: Home food fact checker", url: "https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker" }
  ],
  faqs: [
    { question: "Is batch cooking always cheaper?", answer: "No. It only saves money when the portions are suitable, actually get eaten and are stored properly. A large batch cooked without a plan for every portion can cost more than cooking smaller amounts more often." },
    { question: "What can I batch cook without a large freezer?", answer: "Dishes you will finish within a couple of days work well with fridge storage alone, such as a bean stew or lentil base. If freezer space is limited, cook smaller batches more often." },
    { question: "Which dishes do not batch cook well?", answer: "Anything intended to be served freshly assembled, such as a salad, or a dish that relies on a just-cooked crisp texture tends to lose what makes it work once stored and reheated." },
    { question: "How do I prevent batch-cooked dinners becoming repetitive?", answer: "Batch-cook a base rather than a finished dish, then finish it differently each time with another grain, spice, vegetable or side." },
    { question: "How should cooked portions be labelled and stored?", answer: "Label each portion with the dish and date. Refrigerate what you will eat within 48 hours and freeze the rest promptly. Cooked rice should be refrigerated for no more than a day before reheating, or frozen sooner." }
  ]
};
var BATCH_COOKING_GUIDE_SECTIONS = [
  { rawHtml: `<section><h2>Quick answer</h2><p>Batch cooking can reduce what you spend on food, but quantity alone does not create a saving. Cooking a very large amount only helps if the portions are suitable, someone actually wants to eat them again, and the extra does not just disappear into the freezer. The saving comes from how the batch is planned and used, not from the size of the pot. A large batch cooked without a plan for every portion can end up costing more than cooking smaller amounts more often.</p></section><section><h2>Where the economies come from</h2><ul><li>Using complete packs of ingredients more effectively, rather than buying more than one dinner needs and using only part of it.</li><li>Buying fewer small or partially used packs across the week, since one larger cook can draw on a single set of ingredients.</li><li>Spreading preparation across several dinners, so the effort of chopping, browning or making a sauce base happens once.</li><li>Making planned use of leftovers, rather than leaving them to go off unnoticed.</li><li>Reducing reliance on expensive last-minute options \u2014 a takeaway or convenience dinner bought because nothing else was ready.</li><li>Portioning food before serving or freezing, which helps prevent oversized servings and forgotten containers.</li><li>Reusing one cooked base in different ways, so variety does not depend on buying new ingredients each time.</li></ul></section><section><h2>What makes a good batch-cooked dish</h2><p>Not every dish is worth cooking in bulk. A good candidate stores well without separating or turning watery, divides easily into individual portions, reheats successfully without drying out or losing texture, and still tastes appealing on the third or fourth time round, not just the first. Dishes built around a sauce, stew or braise tend to fit this better than anything meant to be served freshly assembled, such as a salad or a dish that relies on a just-cooked crisp texture.</p></section><section><h2>Batch cooking does not have to mean repetition</h2><p>The dinner that gets tiresome is usually the one eaten in exactly the same form four times in a row. The more useful approach is to batch-cook a base \u2014 a sauce, a cooked protein, a pot of roasted vegetables \u2014 and finish it differently each time with a different grain, spice, vegetable or side. The cooking happens once; what you eat still changes.</p></section><section><h2>Useful batch-cooking bases</h2><ul><li>Tomato and vegetable sauce</li><li>Cooked mince and vegetables</li><li>Lentil and tomato base</li><li>Roasted vegetables</li><li>Bean or chickpea stew</li><li>Cooked chicken, prepared plainly so it can go in different directions \u2014 refrigerate portions you will use within a day or two, and freeze the rest</li></ul></section><section><h2>Turning one base into different dinners</h2><p>A tomato-and-vegetable base is a good example of how far one batch can stretch. The same pot can become a herby pasta sauce one night, a smoky bean stew with tinned chickpeas or cannellini beans and a spoonful of smoked paprika another night, a gently spiced topping for a baked potato later in the week, or the sauce underneath a tray bake with whatever vegetables need using. The base does the work; a different grain, protein, spice or side changes what is actually on the plate.</p><p>A batch of cooked mince works the same way \u2014 stirred through pasta one night, spooned into a jacket potato or wrapped in a tortilla another, or added to rice with a different set of spices later in the week. A lentil and tomato base can move from a simple stew, to a sauce under a baked vegetable, to a filling alongside flatbread, without needing a fresh set of ingredients each time. If you plan to use a base later rather than within the next day or two, freeze the later portions and defrost them safely in the fridge rather than leaving them refrigerated for the whole week.</p></section><section><h2>Portioning before storage</h2><p>Dividing a batch into individual or dinner-sized portions as soon as it is cool enough to store, rather than putting the whole pot straight into one large container, makes a real difference. It is much easier to take out exactly what a dinner needs, rather than defrosting more than you intend to eat because the portions are not already the right size. It also makes forgotten containers less likely, since a labelled, sensibly sized portion is easier to plan around than an anonymous large block.</p></section><section><h2>Fridge and freezer planning</h2><p>Current Food Standards Agency guidance is to cool cooked food and refrigerate it within two hours, eat refrigerated leftovers within 48 hours or freeze them, and reheat food only once, until it is steaming hot all the way through. Freeze portions promptly once they have cooled, and label each one with the dish and date, so nothing sits unidentified at the back of the freezer until it is no longer worth eating.</p><p>Cooked rice needs particular care: cool it quickly, keep it refrigerated for no more than one day before reheating, reheat it only once, and make sure it is steaming hot throughout. If a batch of rice will not be used that quickly, freeze it promptly instead.</p></section><section><h2>When batch cooking can cost more</h2><ul><li>Overbuying ingredients because a recipe is being scaled up, rather than checking what the household will actually get through.</li><li>Adding too many special or one-off ingredients to a large batch, which increases the cost of the whole pot rather than just one dinner.</li><li>Freezing more than a household's freezer can reasonably hold well, leading to poor storage conditions or food pushed to the back and forgotten.</li><li>Preparing more portions than the household actually wants to eat, so some are thrown away rather than used.</li></ul><p>In each case, the batch itself is not the problem \u2014 the absence of a plan for every portion is.</p></section><section><h2>How DinnerByDesign can help</h2><p>Use the Batch-friendly filter to find dinners that suit cooking in bulk, and Plan my week to schedule how each portion will be used across the week \u2014 including which portions are eaten from the fridge in the next day or two, and which are frozen for later \u2014 rather than cooking a large batch without a plan for all of it. Shared-ingredient planning and the generated shopping list can help you buy complete packs with a specific use for all the ingredients, rather than ending up with a partially used ingredient left over.</p></section><section><h2>Related guidance</h2><p><a href="/food-costs/portion-planning-and-food-waste">Plan portions and reduce food waste</a>, <a href="/food-costs/ways-to-reduce-grocery-costs">explore practical ways to manage grocery costs</a>, <a href="/food-safety">review food-safety guidance</a> or <a href="/recipe-methodology">read how dinners are selected</a>.</p></section>` }
];
var BATCH_COOKING_GUIDE_RECORD = {
  id: "batch-cooking-on-a-budget",
  slug: "batch-cooking-on-a-budget",
  path: BATCH_COOKING_GUIDE_PATH,
  canonicalPath: BATCH_COOKING_GUIDE_PATH,
  status: "published",
  category: "food-costs",
  reviewSensitivity: "safety-sensitive",
  ...BATCH_COOKING_GUIDE,
  nextReviewAt: "2027-07-21",
  metaDescription: BATCH_COOKING_GUIDE.description,
  label: "Food cost guide",
  disclosureItems: BATCH_COOKING_DISCLOSURES,
  disclosureFooter: BATCH_COOKING_DISCLOSURE_FOOTER,
  sections: BATCH_COOKING_GUIDE_SECTIONS,
  cta: {
    title: "Plan every portion",
    copy: "Find batch-friendly dinners and decide how each portion will be used.",
    label: "Plan my week",
    href: "/signin"
  }
};

// src/content/curriesAroundTheWorldGuides.ts
var CURRIES_DISCLOSURES = [
  {
    key: "source_timing",
    title: "About the sources",
    body: "Recipe pages, publisher access and cooking times can change. The links below take you to the original pages, where the current method, ingredients, serving information and availability should be checked before cooking."
  },
  {
    key: "allergen_and_product",
    title: "Ingredients and allergens",
    body: "Publisher recipes and packaged ingredients vary. Check the original recipe and every product label, especially curry pastes, fish sauce, shrimp paste, stock, yoghurt, bread and other prepared ingredients."
  }
];
var CURRIES_DISCLOSURE_FOOTER = {
  body: "DinnerByDesign summarises published recipe and cuisine information to help with comparison. It does not reproduce publisher recipes, and the linked publishers are not partners or endorsers of DinnerByDesign.",
  links: [
    { href: "/recipe-methodology", label: "Recipe and recommendation methodology" },
    { href: "/food-safety", label: "Dietary, allergy and cooking safety" }
  ]
};
var CURRIES_DISCLOSURE_KEYS = CURRIES_DISCLOSURES.map((item) => item.key);
var CURRIES_AROUND_THE_WORLD_GUIDE_PATH = "/guides/curries-around-the-world";
var INDIAN_REGIONAL_CURRIES_GUIDE_PATH = "/guides/indian-regional-curries";
var currySourceLinks = {
  sriLankan: "https://www.olivemagazine.com/recipes/meat-and-poultry/kolambas-chicken-curry/",
  thai: "https://www.deliciousmagazine.co.uk/recipes/the-ultimate-thai-green-curry/",
  japanese: "https://www.olivemagazine.com/recipes/quick-and-easy/japanese-chicken-broccoli-and-mushroom-curry/",
  rendang: "https://www.olivemagazine.com/recipes/meat-and-poultry/john-torodes-beef-rendang/",
  trinidadian: "https://www.olivemagazine.com/recipes/meat-and-poultry/trini-curry-goat/",
  kukuPaka: "https://thehappyfoodie.co.uk/recipes/aysha-boras-coconut-chicken-curry-kuku-paka/",
  capeMalay: "https://www.harighotra.co.uk/cape-malay-chicken-curry-recipe",
  dalMakhani: "https://www.deliciousmagazine.co.uk/recipes/dal-makhani/",
  bengali: "https://www.deliciousmagazine.co.uk/recipes/easy-bengali-fish-curry/",
  roganJosh: "https://www.deliciousmagazine.co.uk/recipes/kashmiri-lamb-shank-rogan-josh/",
  vindaloo: "https://www.deliciousmagazine.co.uk/recipes/pork-vindaloo/",
  meenMoilee: "https://www.deliciousmagazine.co.uk/recipes/meen-moilee-keralan-fish-curry/",
  chettinad: "https://www.olivemagazine.com/recipes/meat-and-poultry/chettinad-chicken-curry/"
};
var CURRIES_AROUND_THE_WORLD_GUIDE_SECTIONS = [
  {
    rawHtml: `<section>
      <h2>Introduction</h2>
      <p>\u201CCurry\u201D does not name a single dish. In English, the word is applied to a wide range of spiced sauces, dry-fried pastes and slow-cooked stews from South Asia, Southeast Asia, East Africa, the Caribbean and beyond. Each has its own name, technique and history in its home country. A Sri Lankan chicken curry, Japanese curry rice and Trinidadian curry goat share little beyond a pot and a spoonful of spice.</p>
      <p>The word\u2019s origins are debated. The most widely supported account traces it to a Dravidian word for a spiced dish or sauce eaten with rice, often identified as the Tamil <em>kari</em>. It is thought to have passed into European languages through Portuguese traders before the British applied it more broadly across South Asia. Local names remain important: English-language writing may add \u201Ccurry\u201D to help readers find their way, while the dishes themselves belong to more specific traditions.</p>
      <p>This guide sets out how the main traditions differ, what to look for when choosing a recipe and how to plan a dinner around whichever direction appeals, from a quick Thai curry made with a shop-bought paste to a long-cooked Indonesian rendang.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Indian regional curries</h2>
      <p>North and South India alone produce so many distinct styles that \u201CIndian curry\u201D is shorthand for dozens of traditions. Punjabi-style gravies often lean on ghee, onion, tomato and dairy, built up with garam masala, cumin and dried fenugreek leaves. Further south, coconut, curry leaves, mustard seed and tamarind become more prominent, and tempering may be poured over the finished dish rather than built in from the start.</p>
      <p>A Kerala fish curry and a Punjabi butter chicken may both be called Indian curry in English, but their cooking fat, souring agent and spice technique differ. Vegetarian versions are widespread, and quick dishes exist alongside long-cooked gravies. Ghee can be swapped for a neutral oil as a practical substitution, with some loss of richness.</p>
      <p>For the detail behind this broad comparison, read <a href="${INDIAN_REGIONAL_CURRIES_GUIDE_PATH}">Indian Regional Curries Explained</a>.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Sri Lankan curries</h2>
      <p>Sri Lankan curries share ingredients with South India, including coconut milk, curry leaves and mustard seed, but the spice blend has its own character. Roasted curry powder is toasted dark before grinding, giving a smoky, bitter edge. Cinnamon, cardamom, cloves and pandan may appear alongside it, with dishes ranging from a mild white curry to a fiery, almost dry black pork curry.</p>
      <p>Rice and curry is often a spread of several small curries, a sambol and rice rather than one dish with a side. Vegetable curries using runner beans, jackfruit or cashew are common, and many recipes come together fairly quickly once the spice paste is ready.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Thai curries</h2>
      <p>Thai curry is defined more by its paste than by a fixed spice cupboard. Red and green pastes commonly use chilli, lemongrass, galangal, garlic and shallot. Red paste usually uses dried chillies, while green paste uses fresh ones and can be hotter than its colour suggests. Yellow curry brings turmeric and tends to be milder, massaman adds warm spices such as cinnamon, cardamom and cumin, and panang makes a thicker sauce with ground peanuts.</p>
      <p>Shop-bought paste can make a Thai curry a practical weeknight choice. Vegetarian versions need fish sauce and shrimp paste replaced with suitable alternatives, and the flavour balance will change. The linked <a href="${currySourceLinks.thai}">ultimate Thai green curry</a> is a direct publisher example.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Japanese curry</h2>
      <p>Japanese curry, or <em>kar\u0113 raisu</em>, has a different lineage. It arrived through the British navy in the late nineteenth century as a European-style stew thickened with a butter-and-flour roux and seasoned with curry powder. The Japanese version retained the roux, softened the spicing and often added sweetness from grated apple, honey or ketchup.</p>
      <p>The result is a thick, stew-like sauce with onion, carrot and potato, commonly served with chicken, pork or beef. Boxed roux cubes combine seasoning and thickening, which makes this one of the quicker curry styles to prepare. See the linked <a href="${currySourceLinks.japanese}">Japanese chicken and broccoli curry</a> for a publisher example.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Malaysian and Indonesian curries</h2>
      <p>Malay and Indonesian cooking includes wet, spiced coconut curries such as curry kapitan and dry, long-cooked dishes such as rendang. In rendang, meat cooks with coconut milk and spice paste until the liquid reduces and the meat begins to fry gently in its own oil. Versions differ between regions and households in their cooking time, ingredients and finishing method.</p>
      <p>Both countries also have laksa, a noodle soup built around a curry broth. Long ingredient lists can make these dishes slower to assemble, although a jarred paste can reduce the work. The linked <a href="${currySourceLinks.rendang}">John Torode beef rendang</a> is a long-cooked publisher example.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Caribbean curry dishes</h2>
      <p>Caribbean curry developed through the cooking of Indian communities brought to Trinidad and Guyana during the nineteenth century. Trinidad-style curry powder is worked into a paste with garlic, ginger and green seasoning. Curry goat and curry chicken are familiar examples, browned in the spice paste before liquid is added and served with rice, roti or both.</p>
      <p>Goat needs longer cooking to become tender, while chicken versions are generally quicker. A <a href="${currySourceLinks.trinidadian}">Trinidadian curry goat</a> gives one source-led route into the style.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>East African curries</h2>
      <p>Along the Swahili coast and inland into Kenya, Tanzania and Uganda, curry reflects Gujarati and Goan migration as well as local coastal cooking. Kuku paka combines spiced chicken, coconut, tomato and chilli. In the linked recipe, the chicken is marinated for one to five hours, grilled for colour and flavour, then finished in the coconut sauce. It is better suited to a relaxed weekend than a rushed weeknight.</p>
      <p>The linked <a href="${currySourceLinks.kukuPaka}">Kuku paka recipe</a> comes from a family with roots in Tanzania. Vegetable and pulse dishes such as ndengu made with mung dal offer a quicker, plant-based route into the region\u2019s flavours.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>South African Cape Malay curries</h2>
      <p>Cape Malay curry comes from the Muslim communities of Bo-Kaap in Cape Town, whose history includes people brought to the Cape from Indonesia, Malaysia and India from the seventeenth century onwards. The cooking uses a fragrant blend of cumin, coriander, turmeric, cinnamon and cardamom, sometimes balanced with dried fruit and a light sour edge.</p>
      <p>Chicken and lamb versions are commonly served with yellow rice and sambals. The fruit-forward sweetness can make this a gentler starting point for a household that finds chilli-heavy dishes difficult. The linked <a href="${currySourceLinks.capeMalay}">Cape Malay chicken curry</a> is one publisher example.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Comparison table</h2>
      <p>Use this as a starting point rather than a fixed rule. Individual households and regions within each country vary, sometimes considerably.</p>
      <div class="guide-table-wrap"><table><thead><tr><th>Tradition</th><th>Typical flavour base</th><th>Texture</th><th>Common methods</th><th>Suitable ingredients</th></tr></thead><tbody>
        <tr><td>Indian, North</td><td>Ghee, onion, tomato, garam masala</td><td>Thick, creamy</td><td>Slow-simmered gravy</td><td>Chicken, paneer, lentils</td></tr>
        <tr><td>Indian, South</td><td>Coconut, curry leaves, tamarind</td><td>Thinner, tangy</td><td>Tempering and quick simmer</td><td>Fish, lentils, vegetables</td></tr>
        <tr><td>Sri Lankan</td><td>Roasted curry powder, coconut, pandan</td><td>Mild to dry-roasted</td><td>Simmered, several small dishes</td><td>Vegetables, chicken, seafood</td></tr>
        <tr><td>Thai</td><td>Fresh paste, chilli, lemongrass, galangal</td><td>Thin to thick, coconut-based</td><td>Quick simmer</td><td>Chicken, beef, tofu</td></tr>
        <tr><td>Japanese</td><td>Roux, butter, flour, curry powder</td><td>Thick, stew-like</td><td>Slow-braised stew</td><td>Beef, pork, root vegetables</td></tr>
        <tr><td>Malaysian and Indonesian</td><td>Candlenut, galangal, tamarind, coconut</td><td>Wet or dry and reduced</td><td>Long simmer or dry-fry</td><td>Chicken, beef</td></tr>
        <tr><td>Caribbean</td><td>Trinidad curry powder, green seasoning</td><td>Thick, wet</td><td>Browned, then slow-simmered</td><td>Goat, chicken, chickpeas</td></tr>
        <tr><td>East African</td><td>Coconut, tomato, mild spice</td><td>Light, coconut-forward</td><td>Quick simmer or grill then simmer</td><td>Chicken, mung dal, vegetables</td></tr>
        <tr><td>Cape Malay</td><td>Mild spice blend, dried fruit, vinegar</td><td>Thick, slightly sweet</td><td>Slow-simmered</td><td>Chicken, lamb</td></tr>
      </tbody></table></div>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Choosing a curry by preference</h2>
      <p>If time is short, a Thai curry made with a shop-bought paste, a quick East African ndengu or a tempered South Indian dal can fit inside 45 minutes. For a low-cost dinner, coconut milk, everyday spices and vegetables or pulses already in the cupboard can open several routes, although specialist ingredients and current shop prices vary.</p>
      <p>Vegetarian and vegan cooks have plenty of choice in South Indian and Sri Lankan traditions, where lentil, chickpea and vegetable curries are established dishes. Fish and seafood curries are particularly well established in Kerala, Sri Lanka and East Africa.</p>
      <p>For a milder dinner, Cape Malay and Japanese curry are two gentle starting points. Slower options include Caribbean curry goat, Indonesian rendang and East African kuku paka once its marinating time is included. These suit a day when there is time for cooking and planned leftovers.</p>
      <p>Air-fryer or oven-baked sides can work alongside many curries. Bhajis, papadums and flatbreads can be prepared separately while the curry finishes on the hob. If the shopping list is driven by what is already in the cupboard, coconut milk, tinned tomatoes and pulses give a practical starting point.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Source-led recipe examples</h2>
      <p>These named publisher recipes are starting points for exploring the traditions above. Each link opens the original publisher page. DinnerByDesign does not reproduce the recipes, and nothing here implies a partnership or endorsement.</p>
      <ul>
        <li><a href="${currySourceLinks.sriLankan}">Sri Lankan chicken curry from Kolamba</a>, olive magazine</li>
        <li><a href="${currySourceLinks.thai}">The ultimate Thai green curry</a>, delicious. magazine</li>
        <li><a href="${currySourceLinks.japanese}">Japanese chicken and broccoli curry</a>, olive magazine</li>
        <li><a href="${currySourceLinks.rendang}">John Torode\u2019s beef rendang</a>, olive magazine</li>
        <li><a href="${currySourceLinks.trinidadian}">Trinidadian curry goat</a>, olive magazine</li>
        <li><a href="${currySourceLinks.kukuPaka}">Kuku paka</a>, The Happy Foodie</li>
        <li><a href="${currySourceLinks.capeMalay}">Cape Malay chicken curry</a>, Hari Ghotra</li>
      </ul>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>How DinnerByDesign can help</h2>
      <p>Searching by cuisine name only goes so far when traditions overlap. DinnerByDesign lets you search by ingredient, cuisine, cooking method, dietary preference, time and budget together, as well as by preferred recipe source. A search can begin with \u201Cchicken, 30 minutes, mild\u201D rather than a cuisine name someone may not know.</p>
      <p><a href="/signin">Search DinnerByDesign</a> for a curry style, ingredient or cooking method, then compare source-backed recipes and plan the dinners that suit your household.</p>
    </section>`
  },
  { disclosureItems: CURRIES_DISCLOSURES }
];
var CURRIES_AROUND_THE_WORLD_GUIDE_FAQS = [
  { question: "Are all curry dishes similar?", answer: "No. The word covers different sauces, pastes, stews and dry-cooked dishes from many culinary traditions. Texture, spice technique, souring ingredients and serving format can all differ." },
  { question: "Which curry is suitable for a quick dinner?", answer: "A Thai curry made with a shop-bought paste, a quick South Indian dal or a simple East African pulse dish can be practical choices. Check the current publisher method and timing before cooking." },
  { question: "Which curry styles offer vegetarian choices?", answer: "South Indian and Sri Lankan cooking include many lentil, chickpea and vegetable dishes. Thai, Japanese, Caribbean and East African traditions also have vegetarian routes, although fish sauce, shrimp paste and stock may need checking or replacing." },
  { question: "Which curry is likely to be milder?", answer: "Cape Malay and Japanese curry can be gentle starting points because they rely more on warm spices than fresh chilli. Individual recipes and household tastes vary." },
  { question: "Can DinnerByDesign find a specific curry style?", answer: "It can search for a cuisine, dish, ingredient or cooking method, then combine that with time, dietary preference, budget and preferred recipe source." }
];
var CURRIES_AROUND_THE_WORLD_GUIDE_SOURCES = [
  { label: "Sri Lankan chicken curry from Kolamba, olive magazine", url: currySourceLinks.sriLankan },
  { label: "The ultimate Thai green curry, delicious. magazine", url: currySourceLinks.thai },
  { label: "Japanese chicken and broccoli curry, olive magazine", url: currySourceLinks.japanese },
  { label: "John Torode\u2019s beef rendang, olive magazine", url: currySourceLinks.rendang },
  { label: "Trinidadian curry goat, olive magazine", url: currySourceLinks.trinidadian },
  { label: "Aysha Bora\u2019s coconut chicken curry, Kuku Paka, The Happy Foodie", url: currySourceLinks.kukuPaka },
  { label: "Cape Malay chicken curry, Hari Ghotra", url: currySourceLinks.capeMalay },
  { label: "Oxford English Dictionary entry for curry", url: "https://www.oed.com/dictionary/curry_n1" }
];
var CURRIES_AROUND_THE_WORLD_GUIDE_RECORD = {
  id: "curries-around-the-world",
  slug: "curries-around-the-world",
  path: CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
  canonicalPath: CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  title: "Curries Around the World: How to Choose the Right One for Your Kitchen",
  seoTitle: "Curries around the world: styles, flavours and recipes | DinnerByDesign",
  description: "A region-by-region guide to curry traditions from India to the Caribbean, with source-backed recipes and practical help choosing a dinner.",
  metaDescription: "A region-by-region guide to curry traditions from India to the Caribbean, with source-backed recipes and practical help choosing a dinner.",
  label: "Cuisine guide",
  publishedAt: "2026-09-01",
  reviewedAt: "2026-09-01",
  nextReviewAt: "2027-09-01",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Understand the differences between curry traditions and choose a source-backed recipe by time, flavour and dietary preference",
  indexingStatus: "index",
  contentReviewedAt: "2026-09-01",
  editorialNotes: "Draft IV source-led guide. Recipe links and key recipe-specific timings were checked on 1 September 2026. Historical and cultural framing remains due for a specialist review before the next annual content review.",
  internalLinks: [
    "/guides",
    INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
    "/recipes",
    "/food-costs",
    "/recipe-methodology",
    "/food-safety",
    "/signin"
  ],
  disclosures: CURRIES_DISCLOSURE_KEYS,
  disclosureItems: CURRIES_DISCLOSURES,
  disclosureFooter: CURRIES_DISCLOSURE_FOOTER,
  sources: CURRIES_AROUND_THE_WORLD_GUIDE_SOURCES,
  faqs: CURRIES_AROUND_THE_WORLD_GUIDE_FAQS,
  sections: CURRIES_AROUND_THE_WORLD_GUIDE_SECTIONS,
  cta: {
    title: "Find a curry that fits your household",
    copy: "Search by ingredient, time, dietary preference, budget and recipe source, then save and plan the dinners that suit you.",
    label: "Find recipes",
    href: "/signin"
  }
};
var INDIAN_REGIONAL_CURRIES_GUIDE_SECTIONS = [
  {
    rawHtml: `<section>
      <p>The hub article uses a North and South comparison to make a large subject easier to navigate. India\u2019s curry traditions divide much further by state, community and coastline, and the differences go well beyond the amount of chilli used. This page looks at six: Punjab, Bengal, Kashmir, Goa, Kerala and Tamil Nadu.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Punjab and the North</h2>
      <p>Punjabi cooking is often associated outside India with thick, glossy gravies built on ghee or butter, onion, tomato and cream, seasoned with garam masala, cumin and dried fenugreek leaves. Butter chicken and dal makhani may be cooked slowly and finished with cream or butter. The tandoor contributes both breads such as naan, roti and kulcha, and meat that is charred before it meets the sauce.</p>
      <p>The <a href="${currySourceLinks.dalMakhani}">dal makhani from Babur restaurant</a> on delicious. magazine demonstrates a slow-cooked, dairy-finished restaurant style. A household version may be plainer and quicker.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Bengal</h2>
      <p>Bengali curries often use mustard oil and mustard seed paste, producing a sharper flavour than the ghee and cream associated with Punjabi gravies. Panch phoron, a whole-seed mixture of fenugreek, nigella, cumin, mustard and fennel, is a familiar tempering. Fish features strongly in West Bengal, a river delta and coastal state.</p>
      <p>The <a href="${currySourceLinks.bengali}">easy Bengali fish curry</a> on delicious. magazine uses panch phoron, tamarind and curry leaves rather than a raw mustard paste. It is a simplified route into related flavours rather than a definitive version of shorshe maach.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Kashmir</h2>
      <p>Kashmiri cooking sits within the geographic North but follows its own rules. Kashmiri Pandit households may cook without onion or garlic for religious reasons, using asafoetida, ginger and dried ginger powder instead. Kashmiri Muslim wazwan cooking uses onion and garlic, and households vary, so neither approach is the single correct version.</p>
      <p>Rogan josh gets its deep red colour from Kashmiri chilli and sometimes ratanjot, rather than from intense heat. The meat is browned and simmered in a yoghurt-based gravy. <a href="${currySourceLinks.roganJosh}">Vivek Singh\u2019s Kashmiri lamb shank rogan josh</a> on delicious. magazine demonstrates the technique of whisking yoghurt in gradually to reduce the risk of splitting.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Goa</h2>
      <p>Goa\u2019s cooking carries centuries of Portuguese influence, most clearly in vindaloo. The dish is linked to the Portuguese <em>carne de vinha d\u2019alhos</em>, in which meat was prepared with wine, vinegar and garlic. Goan cooks developed their own versions using local vinegar, chilli and other spices. Marinating can be done the day before, while the cooking itself may be relatively short once that work is complete.</p>
      <p>The <a href="${currySourceLinks.vindaloo}">pork vindaloo</a> on delicious. magazine is a family recipe tested by the magazine\u2019s kitchen. It represents one household\u2019s take, since vindaloo varies between Goan kitchens.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Kerala and the Malabar coast</h2>
      <p>Kerala shares South India\u2019s coconut, curry leaf and mustard seed base, while its coastal geography places fish and seafood near the centre of the cooking. Meen moilee is a gently spiced fish dish finished with coconut milk, turmeric and green chilli, and can be ready quickly.</p>
      <p><a href="${currySourceLinks.meenMoilee}">Atul Kochhar\u2019s meen moilee</a> on delicious. magazine crisps the fish separately before it meets the sauce, helping the skin retain its texture. Avial, a mixed vegetable dish in coconut and yoghurt, offers a vegetarian counterpart.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Tamil Nadu and Chettinad</h2>
      <p>Chettinad food, from the trading communities of Tamil Nadu, is often described as one of India\u2019s more heavily spiced regional cuisines. Whole spices are dry-roasted and ground for each dish, with black pepper contributing much of the heat in some preparations. This is a broad tendency rather than a fixed rule, since heat and spice balance vary between households.</p>
      <p><a href="${currySourceLinks.chettinad}">Chettinad chicken</a> from olive magazine uses a toasted, ground spice mix. A restaurant or family version in Chettinad may use more or different whole spices.</p>
      <p>Sambar and rasam are not usually filed under \u201Ccurry\u201D in English, and they are structurally different from a curry gravy. Sambar is a lentil-based vegetable stew, while rasam is a thin, spiced broth. They share a tempering technique with Chettinad and other South Indian curries, in which whole spices such as mustard seed are bloomed in hot oil and added towards the end.</p>
    </section>`
  },
  {
    rawHtml: `<section>
      <h2>Accompaniments and practical notes</h2>
      <p>Bread is more common in the North, including naan, roti and paratha, while rice and rice-based dishes are particularly prominent further south and east. Both traditions appear throughout India. Dal and tempered vegetable dishes are often the quickest route into these regional flavours; tandoor-marinated meats, rogan josh and biryani-style dishes need longer and may benefit from preparation the day before.</p>
      <p>Ghee can be swapped for neutral oil, and fresh curry leaves for dried, with some loss of aroma. Coconut cream can stand in for coconut milk when a thicker sauce is wanted. These are practical substitutions rather than traditional versions of the dishes.</p>
    </section>`
  }
];
var INDIAN_REGIONAL_CURRIES_GUIDE_FAQS = [
  { question: "Is Indian curry one single style?", answer: "No. North and South India are only a broad starting comparison. State, community, religion, geography and household practice all shape the cooking." },
  { question: "Which Indian regional styles use coconut?", answer: "Coconut is especially prominent in many South Indian and coastal traditions, including Kerala and Goa, although the exact dish, coconut product and spice balance vary." },
  { question: "Are Kashmiri curries always made without onion and garlic?", answer: "No. Some Kashmiri Pandit preparations avoid them for religious reasons, while Kashmiri Muslim cooking uses them. Households and communities differ." },
  { question: "Is vindaloo always very hot?", answer: "No. Chilli heat varies between recipes and households. Vinegar, garlic and the broader spice balance are central to the style, while heat can be adjusted." },
  { question: "What is the quickest place to start?", answer: "A dal, tempered vegetable dish or quick fish curry can be a practical introduction. Use a named publisher recipe and check its current timings and ingredient details." }
];
var INDIAN_REGIONAL_CURRIES_GUIDE_SOURCES = [
  { label: "Dal makhani from Babur restaurant, delicious. magazine", url: currySourceLinks.dalMakhani },
  { label: "Easy Bengali fish curry, delicious. magazine", url: currySourceLinks.bengali },
  { label: "Kashmiri lamb shank rogan josh, delicious. magazine", url: currySourceLinks.roganJosh },
  { label: "Pork vindaloo, delicious. magazine", url: currySourceLinks.vindaloo },
  { label: "Meen moilee, delicious. magazine", url: currySourceLinks.meenMoilee },
  { label: "Chettinad chicken curry, olive magazine", url: currySourceLinks.chettinad }
];
var INDIAN_REGIONAL_CURRIES_GUIDE_RECORD = {
  id: "indian-regional-curries",
  slug: "indian-regional-curries",
  path: INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
  canonicalPath: INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
  status: "published",
  category: "guides",
  reviewSensitivity: "standard",
  title: "Indian Regional Curries Explained",
  seoTitle: "Indian regional curries explained: six traditions and recipes | DinnerByDesign",
  description: "A closer look at Punjabi, Bengali, Kashmiri, Goan, Keralan and Chettinad cooking, with source-backed recipes and practical substitutions.",
  metaDescription: "A closer look at Punjabi, Bengali, Kashmiri, Goan, Keralan and Chettinad cooking, with source-backed recipes and practical substitutions.",
  label: "Cuisine guide",
  publishedAt: "2026-09-01",
  reviewedAt: "2026-09-01",
  nextReviewAt: "2027-09-01",
  editorialOwner: "DinnerByDesign editorial team",
  pageFamily: "Practical cooking guide",
  primarySearchIntent: "Understand the differences between six Indian regional curry traditions and choose a source-backed recipe",
  indexingStatus: "index",
  contentReviewedAt: "2026-09-01",
  editorialNotes: "Draft IV source-led regional guide. Six named publisher recipe links were checked on 1 September 2026. Historical and cultural framing remains due for a specialist review before the next annual content review.",
  internalLinks: [
    "/guides",
    CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
    "/recipes",
    "/recipe-methodology",
    "/food-safety",
    "/signin"
  ],
  disclosures: CURRIES_DISCLOSURE_KEYS,
  disclosureItems: CURRIES_DISCLOSURES,
  disclosureFooter: CURRIES_DISCLOSURE_FOOTER,
  sources: INDIAN_REGIONAL_CURRIES_GUIDE_SOURCES,
  faqs: INDIAN_REGIONAL_CURRIES_GUIDE_FAQS,
  sections: INDIAN_REGIONAL_CURRIES_GUIDE_SECTIONS,
  cta: {
    title: "Search by region, ingredient or time",
    copy: "Use DinnerByDesign to compare source-backed recipes around the ingredients, dietary preferences and cooking time that suit your household.",
    label: "Find recipes",
    href: "/signin"
  }
};

// src/content/publicGuideRegistry.ts
var PUBLIC_GUIDE_RECORDS = [
  FIVE_DINNERS_FOR_TWO_UNDER_40_GUIDE_RECORD,
  FAMILY_DINNERS_FOR_FOUR_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD,
  MINCE_BUDGET_DINNERS_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_RECORD,
  SAUSAGE_WAYS_GUIDE_RECORD,
  BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD,
  MEAT_STRETCHING_GUIDE_RECORD,
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD,
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_RECORD,
  WHOLE_CHICKEN_VALUE_GUIDE_RECORD,
  FIVE_A_DAY_GUIDE_RECORD,
  HOME_COOKED_READY_MADE_GUIDE_RECORD,
  CHICKEN_THIGH_COST_GUIDE_RECORD,
  TINNED_FISH_GUIDE_RECORD,
  CONVENIENCE_FISH_GUIDE_RECORD,
  FIVE_STAPLES_GUIDE_RECORD,
  PULSES_BUDGET_GUIDE_RECORD,
  TRAYBAKE_GUIDE_RECORD,
  LOW_COST_DINNERS_GUIDE_RECORD,
  UK_FOOD_COSTS_2026_GUIDE_RECORD,
  GROCERY_COST_OPTIONS_GUIDE_RECORD,
  GROCERY_COST_PREDICTION_GUIDE_RECORD,
  CHEAPER_MEAT_CUTS_GUIDE_RECORD,
  SHARED_INGREDIENTS_GUIDE_RECORD,
  OFFAL_BUDGET_GUIDE_RECORD,
  MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE_RECORD,
  SUMMER_STEWS_GUIDE_RECORD,
  BATCH_COOKING_GUIDE_RECORD,
  PORTION_PLANNING_GUIDE_RECORD,
  FRESH_OR_FROZEN_GUIDE_RECORD,
  COOKING_FOR_ONE_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_RICE_GUIDE_RECORD,
  NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE_RECORD,
  FIFTEEN_MINUTE_DINNERS_GUIDE_RECORD,
  FAMILY_FUSSY_EATERS_GUIDE_RECORD,
  CURRIES_AROUND_THE_WORLD_GUIDE_RECORD,
  INDIAN_REGIONAL_CURRIES_GUIDE_RECORD
];
var PUBLISHED_PUBLIC_GUIDE_RECORDS = PUBLIC_GUIDE_RECORDS.filter((guide) => guide.status === "published");

// src/content/publicArticles.ts
var publicGuideRecordToArticle = (guide) => ({
  title: guide.title,
  path: guide.path,
  category: guide.label,
  pageFamily: guide.pageFamily,
  primarySearchIntent: guide.primarySearchIntent,
  indexingStatus: guide.indexingStatus,
  publishedAt: guide.publishedAt,
  reviewedAt: guide.reviewedAt,
  contentReviewedAt: guide.contentReviewedAt,
  internalLinks: [...guide.internalLinks],
  disclosures: [...guide.disclosures],
  status: "published"
});
var PUBLIC_ARTICLES = [
  ...PUBLISHED_PUBLIC_GUIDE_RECORDS.map(publicGuideRecordToArticle)
];
var PUBLISHED_ARTICLES = PUBLIC_ARTICLES.filter((article) => article.status === "published");
function isUnknownPublicArticlePath(pathName) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, "") : pathName;
  const belongsToPublicFamily = normalisedPath.startsWith("/dinner-plans/") || normalisedPath.startsWith("/recipes/") || normalisedPath.startsWith("/food-costs/") || normalisedPath.startsWith("/guides/");
  return belongsToPublicFamily && !PUBLIC_ARTICLES.some((article) => article.path === normalisedPath && article.status === "published");
}

// src/content/publicRedirects.ts
var PUBLIC_PAGE_REDIRECTS = {
  "/food-costs/cooking-for-four-with-lower-cost-cuts": "/food-costs/cooking-with-cheaper-cuts-of-meat",
  "/food-costs/low-cost-cooking-techniques": "/food-costs/ways-to-reduce-grocery-costs",
  "/food-costs/how-to-use-complete-packs": "/food-costs/five-dinners-same-ingredients",
  "/food-costs/cheap-finishing-touches": "/food-costs/make-low-cost-dinners-more-interesting"
};
function getPublicPageRedirect(pathName) {
  const normalisedPath = pathName.length > 1 ? pathName.replace(/\/+$/, "") : pathName;
  return PUBLIC_PAGE_REDIRECTS[normalisedPath] || null;
}

// src/lib/ingredientPriceRefresh.ts
var ALLOWED_UNITS = /* @__PURE__ */ new Set(["g", "kg", "ml", "l", "each"]);
var MAX_FEED_ITEMS = 400;
function requireText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`${field} must be a non-empty string of at most ${maxLength} characters.`);
  }
  return value.trim();
}
function requirePositiveNumber(value, field, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > maximum) {
    throw new Error(`${field} must be a positive number no greater than ${maximum}.`);
  }
  return value;
}
function requireHttpsUrl(value, field) {
  const text = requireText(value, field, 2e3);
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new Error(`${field} must be a valid URL.`);
  }
  if (url.protocol !== "https:") throw new Error(`${field} must use HTTPS.`);
  return url.toString();
}
function normaliseObservedAt(value) {
  const text = requireText(value, "observedAt", 50);
  const timestamp = Date.parse(text);
  if (!Number.isFinite(timestamp)) throw new Error("observedAt must be a valid date or timestamp.");
  if (timestamp > Date.now() + 864e5) throw new Error("observedAt cannot be in the future.");
  return new Date(timestamp).toISOString();
}
function parseLicensedIngredientPriceFeed(payload) {
  const rawItems = Array.isArray(payload) ? payload : payload && typeof payload === "object" && Array.isArray(payload.items) ? payload.items : null;
  if (!rawItems) throw new Error("The licensed price feed must be an array or an object containing an items array.");
  if (rawItems.length > MAX_FEED_ITEMS) throw new Error(`The licensed price feed cannot contain more than ${MAX_FEED_ITEMS} items.`);
  const seen = /* @__PURE__ */ new Set();
  return rawItems.map((rawItem, index) => {
    if (!rawItem || typeof rawItem !== "object") throw new Error(`Item ${index + 1} must be an object.`);
    const item = rawItem;
    const ingredientKey = requireText(item.ingredientKey, `Item ${index + 1} ingredientKey`, 100).toLowerCase();
    if (!/^[a-z0-9][a-z0-9 '&-]*$/.test(ingredientKey)) throw new Error(`Item ${index + 1} has an invalid ingredientKey.`);
    if (seen.has(ingredientKey)) throw new Error(`The feed contains duplicate ingredientKey: ${ingredientKey}.`);
    seen.add(ingredientKey);
    const aliases = item.aliases === void 0 ? [] : item.aliases;
    if (!Array.isArray(aliases) || aliases.length > 30 || aliases.some((alias) => typeof alias !== "string")) {
      throw new Error(`Item ${index + 1} aliases must be an array of at most 30 strings.`);
    }
    const packUnit = requireText(item.packUnit, `Item ${index + 1} packUnit`, 10);
    if (!ALLOWED_UNITS.has(packUnit)) throw new Error(`Item ${index + 1} has an unsupported packUnit.`);
    return {
      ingredientKey,
      aliases: aliases.map((alias) => alias.trim().toLowerCase()).filter(Boolean),
      productLabel: requireText(item.productLabel, `Item ${index + 1} productLabel`, 200),
      retailer: requireText(item.retailer, `Item ${index + 1} retailer`, 100),
      packPrice: requirePositiveNumber(item.packPrice, `Item ${index + 1} packPrice`, 1e3),
      packQuantity: requirePositiveNumber(item.packQuantity, `Item ${index + 1} packQuantity`, 1e5),
      packUnit,
      sourceUrl: requireHttpsUrl(item.sourceUrl, `Item ${index + 1} sourceUrl`),
      observedAt: normaliseObservedAt(item.observedAt),
      feedId: typeof item.feedId === "string" && item.feedId.trim() ? item.feedId.trim().slice(0, 200) : void 0
    };
  });
}
function catalogueEntryMatchesFeedItem(current, incoming) {
  if (!current) return false;
  return current.productLabel === incoming.productLabel && current.retailer === incoming.retailer && current.packPrice === incoming.packPrice && current.packQuantity === incoming.packQuantity && current.packUnit === incoming.packUnit && current.sourceUrl === incoming.sourceUrl;
}
function ingredientPriceDocumentId(ingredientKey) {
  return ingredientKey.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// src/lib/accountReconciliation.ts
function findRegisteredIdentitiesWithoutProfiles(identities, profileIds) {
  const profileIdSet = new Set(profileIds);
  return identities.filter((identity) => !identity.isAnonymous && !profileIdSet.has(identity.uid));
}
function findAnonymousIdentitiesWithoutProfiles(identities, profileIds) {
  const profileIdSet = new Set(profileIds);
  return identities.filter((identity) => identity.isAnonymous && !profileIdSet.has(identity.uid));
}
function summariseAccountReconciliation(identities, profileIds) {
  const profileIdSet = new Set(profileIds);
  const identityIdSet = new Set(identities.map((identity) => identity.uid));
  const registeredIdentities = identities.filter((identity) => !identity.isAnonymous);
  const anonymousIdentities = identities.filter((identity) => identity.isAnonymous);
  return {
    authenticationIdentities: identities.length,
    registeredIdentities: registeredIdentities.length,
    anonymousIdentities: anonymousIdentities.length,
    profileDocuments: profileIdSet.size,
    registeredWithoutProfile: findRegisteredIdentitiesWithoutProfiles(identities, profileIdSet).length,
    anonymousWithoutProfile: findAnonymousIdentitiesWithoutProfiles(identities, profileIdSet).length,
    profilesWithoutAuthentication: [...profileIdSet].filter((uid) => !identityIdSet.has(uid)).length
  };
}

// src/lib/searchDelivery.ts
function isDeliverableSearchResult(result) {
  const recipes = Array.isArray(result?.recipes) ? result.recipes : [];
  const readyMeals = Array.isArray(result?.readyMeals) ? result.readyMeals : [];
  return recipes.length > 0 || readyMeals.length > 0 || result?.isEmpty === true || !!result?.budgetContradiction;
}

// src/lib/searchUtils.ts
var normaliseIncomingSearchParams = (value) => {
  const candidate = value && typeof value === "object" ? value : {};
  const query2 = typeof candidate.query === "string" ? candidate.query.trim() : "";
  const source = candidate.source === "ready-made" ? "ready-made" : "cook";
  const params = { ...candidate, query: query2, source };
  if (source === "cook") {
    const ingredientIntent = detectIngredientIntent(query2);
    if (ingredientIntent) {
      params.ingredientIntent = ingredientIntent;
      params.isLeftoverMode = true;
    } else {
      delete params.ingredientIntent;
      if (params.strictIngredientMatch) delete params.strictIngredientMatch;
    }
  } else {
    delete params.ingredientIntent;
    delete params.strictIngredientMatch;
  }
  return params;
};
var queryConflictGroups = {
  meat: ["beef", "steak", "burger", "mince", "lamb", "mutton", "pork", "bacon", "ham", "sausage", "chorizo", "chicken", "turkey", "duck", "goose", "venison"],
  fish: ["fish", "salmon", "tuna", "cod", "haddock", "sardine", "mackerel", "trout", "anchovy", "prawn", "shrimp", "crab", "lobster", "mussel", "clam", "scallop", "squid"],
  eggs: ["egg", "eggs", "omelette", "frittata", "quiche"],
  dairy: ["milk", "cheese", "cheddar", "parmesan", "mozzarella", "butter", "cream", "yoghurt", "yogurt"],
  gluten: ["wheat", "barley", "rye", "spelt", "flour", "bread", "breadcrumb", "breadcrumbs", "pasta", "couscous", "semolina", "bulgur", "oat", "oats", "malt", "seitan"],
  nuts: ["almond", "almonds", "walnut", "walnuts", "cashew", "cashews", "hazelnut", "hazelnuts", "pecan", "pecans", "pistachio", "pistachios", "brazil nut", "brazil nuts", "macadamia", "macadamias", "tree nut", "tree nuts", "mixed nut", "mixed nuts"],
  peanuts: ["peanut", "peanuts"],
  soy: ["soy", "soya", "tofu", "tempeh", "edamame", "miso", "soy sauce", "soya sauce", "soy lecithin"],
  sesame: ["sesame", "tahini"],
  mustard: ["mustard"],
  celery: ["celery"],
  lupin: ["lupin"],
  sulphites: ["sulphite", "sulfite", "sulphur dioxide", "sulfur dioxide"]
};
var allergyTerms = {
  "Celery": queryConflictGroups.celery,
  "Cereals containing gluten": queryConflictGroups.gluten,
  "Crustaceans": ["prawn", "prawns", "shrimp", "crab", "lobster", "crayfish", "langoustine", "scampi"],
  "Eggs": queryConflictGroups.eggs,
  "Fish": queryConflictGroups.fish,
  "Lupin": queryConflictGroups.lupin,
  "Milk": queryConflictGroups.dairy,
  "Molluscs": ["mussel", "mussels", "clam", "clams", "scallop", "scallops", "oyster", "oysters", "squid", "octopus", "snail", "snails", "whelk", "whelks", "cuttlefish"],
  "Mustard": queryConflictGroups.mustard,
  "Peanuts": queryConflictGroups.peanuts,
  "Sesame": queryConflictGroups.sesame,
  "Soybeans": queryConflictGroups.soy,
  "Tree nuts": queryConflictGroups.nuts,
  "Sulphur dioxide and sulphites": queryConflictGroups.sulphites
};

// src/lib/searchRequestValidation.ts
var MAX_SEARCH_QUERY_LENGTH = 500;
var MAX_SEARCH_ARRAY_ITEMS = 40;
var MAX_SEARCH_ITEM_LENGTH = 160;
var SEARCH_ARRAY_FIELDS = [
  "cuisines",
  "dietTypes",
  "allergies",
  "exclusions",
  "religiousEthical",
  "styleWellness",
  "excludeIngredients",
  "omitIngredients",
  "cookingMethods",
  "cookingFats",
  "retailers",
  "supermarkets",
  "excludeTitles",
  "preferredSourceIds"
];
var PREFERENCE_ARRAY_FIELDS = [
  "allergies",
  "exclusions",
  "cuisinePreferences",
  "religiousEthical",
  "cookingMethods",
  "cookingFats",
  "preferredSupermarkets",
  "preferredSourceIds",
  "customCuisines"
];
var BOOLEAN_FIELDS = [
  "isSimple",
  "isLowCost",
  "nutritiousChoice",
  "highOmega3",
  "highProtein",
  "includeOffal"
];
var NUMBER_FIELDS = [
  "maxTotalTime",
  "maxPrepTime",
  "maxCookTime",
  "maxCostPerPortion",
  "maxPricePerPerson",
  "maxHeatingTime",
  "maxCalories",
  "servings",
  "count",
  "calorieCeiling",
  "budgetLimit",
  "readyToEatUnderMins"
];
var NULLABLE_NUMBER_FIELDS = /* @__PURE__ */ new Set([
  "maxCostPerPortion",
  "maxPricePerPerson",
  "maxCalories",
  "calorieCeiling",
  "budgetLimit",
  "readyToEatUnderMins"
]);
var DIETARY_RULES = /* @__PURE__ */ new Set([
  "none",
  "keto",
  "paleo",
  "pescatarian",
  "vegan",
  "vegetarian",
  "gluten-free",
  "mediterranean"
]);
var SALAD_PREFERENCES = /* @__PURE__ */ new Set(["all", "main-only", "side-only", "none"]);
var SOURCES = /* @__PURE__ */ new Set(["cook", "ready-made"]);
var isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
var invalid2 = (code, message) => ({
  ok: false,
  code,
  message
});
function validateStringArrays(record, fields, label) {
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) continue;
    const value = record[field];
    if (!Array.isArray(value)) {
      return invalid2("SEARCH_REQUEST_INVALID", `${label} contains an invalid ${field} value.`);
    }
    if (value.length > MAX_SEARCH_ARRAY_ITEMS || value.some((item) => typeof item !== "string" || item.length > MAX_SEARCH_ITEM_LENGTH)) {
      return invalid2("SEARCH_REQUEST_TOO_LARGE", `${label} contains too much filter information.`);
    }
  }
  return { ok: true };
}
function validateScalarTypes(record, label) {
  for (const field of BOOLEAN_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(record, field) && typeof record[field] !== "boolean") {
      return invalid2("SEARCH_REQUEST_INVALID", `${label} contains an invalid ${field} value.`);
    }
  }
  for (const field of NUMBER_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) continue;
    const value = record[field];
    if (value === null && NULLABLE_NUMBER_FIELDS.has(field)) continue;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1e4) {
      return invalid2("SEARCH_REQUEST_INVALID", `${label} contains an invalid ${field} value.`);
    }
  }
  return { ok: true };
}
function validateSearchParams(searchParams) {
  if (!isRecord(searchParams)) {
    return invalid2("SEARCH_REQUEST_INVALID", "The search request is invalid.");
  }
  if (typeof searchParams.query !== "string") {
    return invalid2("SEARCH_REQUEST_INVALID", "The search query must be text.");
  }
  if (searchParams.query.trim().length > MAX_SEARCH_QUERY_LENGTH) {
    return invalid2("SEARCH_QUERY_TOO_LONG", "Please shorten the search query and try again.");
  }
  if (typeof searchParams.source !== "string" || !SOURCES.has(searchParams.source)) {
    return invalid2("SEARCH_REQUEST_INVALID", "The search source is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(searchParams, "count")) {
    const count = searchParams.count;
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > 3) {
      return invalid2("SEARCH_REQUEST_INVALID", "The requested result count is invalid.");
    }
  }
  const arraysResult = validateStringArrays(searchParams, SEARCH_ARRAY_FIELDS, "The search request");
  if (!arraysResult.ok) return arraysResult;
  return validateScalarTypes(searchParams, "The search request");
}
function validatePreferences(preferences) {
  if (preferences === void 0 || preferences === null) return { ok: true };
  if (!isRecord(preferences)) {
    return invalid2("PREFERENCES_INVALID", "The saved preferences are invalid.");
  }
  const arraysResult = validateStringArrays(preferences, PREFERENCE_ARRAY_FIELDS, "The saved preferences");
  if (!arraysResult.ok) return arraysResult;
  const scalarResult = validateScalarTypes(preferences, "The saved preferences");
  if (!scalarResult.ok) return scalarResult;
  if (Object.prototype.hasOwnProperty.call(preferences, "dietaryRule") && (typeof preferences.dietaryRule !== "string" || !DIETARY_RULES.has(preferences.dietaryRule))) {
    return invalid2("PREFERENCES_INVALID", "The saved dietary preference is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(preferences, "saladPreference") && (typeof preferences.saladPreference !== "string" || !SALAD_PREFERENCES.has(preferences.saladPreference))) {
    return invalid2("PREFERENCES_INVALID", "The saved salad preference is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(preferences, "preferredMode") && (typeof preferences.preferredMode !== "string" || !SOURCES.has(preferences.preferredMode))) {
    return invalid2("PREFERENCES_INVALID", "The saved search mode is invalid.");
  }
  return { ok: true };
}
var validateSearchRequestPayload = (searchParams, preferences) => {
  const searchResult = validateSearchParams(searchParams);
  if (!searchResult.ok) return searchResult;
  return validatePreferences(preferences);
};

// src/lib/webhookSafety.ts
var STRIPE_WEBHOOK_PROCESSING_LEASE_MS = 5 * 60 * 1e3;
var TRANSACTIONAL_EMAIL_CLAIM_LEASE_MS = 5 * 60 * 1e3;
function toMillis(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof value?.toMillis === "function") {
    const millis = value.toMillis();
    return Number.isFinite(millis) ? millis : null;
  }
  return null;
}
function getWebhookClaimDecision(record, now = Date.now(), leaseMs = STRIPE_WEBHOOK_PROCESSING_LEASE_MS) {
  if (record?.status === "succeeded") return "already_processed";
  const processingStartedAt = toMillis(record?.processingStartedAt);
  if (record?.status === "processing" && processingStartedAt !== null && now - processingStartedAt < leaseMs) {
    return "in_progress";
  }
  return "process";
}
function shouldApplyStripeEvent(currentEventCreatedAt, incomingEventCreatedAt) {
  const incoming = typeof incomingEventCreatedAt === "number" && Number.isFinite(incomingEventCreatedAt) ? incomingEventCreatedAt : null;
  const current = typeof currentEventCreatedAt === "number" && Number.isFinite(currentEventCreatedAt) ? currentEventCreatedAt : null;
  if (incoming === null || current === null) return true;
  return incoming >= current;
}
function isFreshEmailClaim(claimedAt, now = Date.now(), leaseMs = TRANSACTIONAL_EMAIL_CLAIM_LEASE_MS) {
  const claimMillis = toMillis(claimedAt);
  return claimMillis !== null && now - claimMillis < leaseMs;
}

// src/api-server.ts
var import_meta = {};
function getFirebaseConfig() {
  return firebase_applet_config_default;
}
process.on("uncaughtException", (err) => {
  console.error("FATAL UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL UNHANDLED REJECTION at:", promise, "reason:", reason);
});
function logApiError(type, error) {
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const errorMsg = error?.message || String(error);
    const errorStack = error?.stack || "";
    const details = error?.category ? `Category: ${error.category}` : "";
    console.error(`[API Error Diagnostic] [${timestamp}] [${type}] ${errorMsg}
Stack: ${errorStack}
Details: ${details}`);
  } catch (e) {
    console.error("Failed to log API error:", e);
  }
}
var PRODUCTION_APP_URL = "https://dinnerbydesign.app";
var ADMIN_EMAILS = /* @__PURE__ */ new Set(["tmterencemartin@gmail.com", "qa-admin@dinnerbydesign.app"]);
var CONTACT_RECIPIENT = "terence@dinnerbydesign.app";
var CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1e3;
var CONTACT_RATE_LIMIT_MAXIMUM = 4;
var contactAttempts = /* @__PURE__ */ new Map();
var GUEST_SEARCH_LIMIT = 3;
var GUEST_IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1e3;
var GUEST_IP_RATE_LIMIT_MAXIMUM = 12;
var guestSearchAttemptsByIp = /* @__PURE__ */ new Map();
var CLIENT_ERROR_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1e3;
var CLIENT_ERROR_RATE_LIMIT_MAXIMUM = 30;
var clientErrorAttemptsByIp = /* @__PURE__ */ new Map();
var MONITORING_ALERT_COOLDOWN_MS = 24 * 60 * 60 * 1e3;
var escapeHtml11 = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
var renderPublicSeoInitialHtml = (heading, description) => `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><h1>${escapeHtml11(heading)}</h1><p>${escapeHtml11(description)}</p></main></div>`;
function hasContactRateLimitCapacity(req) {
  const forwardedFor = req.get("x-forwarded-for");
  const client = (forwardedFor ? forwardedFor.split(",")[0] : req.ip || "unknown").trim();
  const now = Date.now();
  const recentAttempts = (contactAttempts.get(client) || []).filter((attempt) => now - attempt < CONTACT_RATE_LIMIT_WINDOW_MS);
  if (recentAttempts.length >= CONTACT_RATE_LIMIT_MAXIMUM) {
    contactAttempts.set(client, recentAttempts);
    return false;
  }
  recentAttempts.push(now);
  contactAttempts.set(client, recentAttempts);
  return true;
}
function isTrustedContactOrigin(req) {
  const origin = req.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    return parsed.origin === PRODUCTION_APP_URL || ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}
function hasClientErrorRateLimitCapacity(req) {
  const forwardedFor = req.get("x-forwarded-for");
  const client = (forwardedFor ? forwardedFor.split(",")[0] : req.ip || "unknown").trim();
  const now = Date.now();
  const recentAttempts = (clientErrorAttemptsByIp.get(client) || []).filter((attempt) => now - attempt < CLIENT_ERROR_RATE_LIMIT_WINDOW_MS);
  if (recentAttempts.length >= CLIENT_ERROR_RATE_LIMIT_MAXIMUM) {
    clientErrorAttemptsByIp.set(client, recentAttempts);
    return false;
  }
  recentAttempts.push(now);
  clientErrorAttemptsByIp.set(client, recentAttempts);
  return true;
}
function sanitiseClientErrorText(value, maxLength) {
  return String(value || "").replace(/https?:\/\/[^\s)]+/gi, "[redacted-url]").replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[redacted-email]").replace(/[?&](?:token|key|code|email|query|search)=[^&\s]*/gi, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
function getAppOrigin(req) {
  const requestOrigin = req.headers.origin || req.headers.referer || `${req.protocol}://${req.get("host")}`;
  const origin = Array.isArray(requestOrigin) ? requestOrigin[0] : requestOrigin;
  if (!origin) return PRODUCTION_APP_URL;
  try {
    const parsed = new URL(origin);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    const isDinnerByDesignPreview = parsed.hostname.startsWith("dinnerbydesign-") && parsed.hostname.endsWith(".vercel.app");
    if (isLocal || isDinnerByDesignPreview) return parsed.origin;
    return PRODUCTION_APP_URL;
  } catch {
    return PRODUCTION_APP_URL;
  }
}
var _db = null;
function ensureFirebaseAdminApp() {
  if ((0, import_app2.getApps)().length === 0) {
    const config = getFirebaseConfig();
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      (0, import_app2.initializeApp)({
        credential: (0, import_app2.cert)(serviceAccount),
        projectId: serviceAccount.project_id || config.projectId || process.env.FIREBASE_PROJECT_ID
      });
    } else {
      (0, import_app2.initializeApp)({
        projectId: config.projectId || process.env.FIREBASE_PROJECT_ID
      });
    }
  }
}
function getDb() {
  if (!_db) {
    const config = getFirebaseConfig();
    ensureFirebaseAdminApp();
    _db = (0, import_firestore2.getFirestore)(config.firestoreDatabaseId || void 0);
  }
  return _db;
}
var firestoreAdminAuth = null;
async function getFirestoreAdminAccessToken() {
  const serviceAccountJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!serviceAccountJson) return null;
  const credentials = JSON.parse(serviceAccountJson);
  firestoreAdminAuth ||= new import_google_auth_library.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"]
  });
  const client = await firestoreAdminAuth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error("google_access_token_missing");
  return {
    token,
    projectId: credentials.project_id || getFirebaseConfig().projectId || process.env.FIREBASE_PROJECT_ID
  };
}
async function firestoreAdminRequest(pathname, token) {
  const response = await fetch(`https://firestore.googleapis.com${pathname}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`firestore_admin_${response.status}`);
    error.status = response.status;
    error.body = body.slice(0, 200);
    throw error;
  }
  return response.json();
}
async function checkFirestoreBackups() {
  if (String(process.env.FIRESTORE_BACKUP_MONITORING_ENABLED || "").toLowerCase() !== "true") {
    return {
      status: "not_configured",
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: "monitoring_not_enabled"
    };
  }
  const auth2 = await getFirestoreAdminAccessToken();
  if (!auth2?.projectId) {
    return {
      status: "failed",
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: "firebase_service_account_missing"
    };
  }
  const databaseId = getFirebaseConfig().firestoreDatabaseId || "(default)";
  const databasePath = `projects/${encodeURIComponent(auth2.projectId)}/databases/${encodeURIComponent(databaseId)}`;
  const schedulesResponse = await firestoreAdminRequest(`/v1/${databasePath}/backupSchedules`, auth2.token);
  const schedules = schedulesResponse.backupSchedules || [];
  if (schedules.length === 0) {
    return {
      status: "failed",
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: "backup_schedule_missing"
    };
  }
  const database = await firestoreAdminRequest(`/v1/${databasePath}`, auth2.token);
  const locationId = String(database.locationId || "").trim();
  if (!locationId) {
    return {
      status: "failed",
      scheduleCount: schedules.length,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: "firestore_location_missing"
    };
  }
  const backupsResponse = await firestoreAdminRequest(
    `/v1/projects/${encodeURIComponent(auth2.projectId)}/locations/${encodeURIComponent(locationId)}/backups?pageSize=100`,
    auth2.token
  );
  const backups = (backupsResponse.backups || []).filter((backup) => backup.database === database.name && backup.state === "READY").filter((backup) => typeof backup.snapshotTime === "string").sort((left, right) => Date.parse(right.snapshotTime) - Date.parse(left.snapshotTime));
  const latestSnapshotTime = backups[0]?.snapshotTime || null;
  const ageHours = latestSnapshotTime ? (Date.now() - Date.parse(latestSnapshotTime)) / (60 * 60 * 1e3) : null;
  const maxAgeHours = Math.min(Math.max(Number(process.env.FIRESTORE_BACKUP_MAX_AGE_HOURS || 48), 24), 168);
  const status = ageHours !== null && ageHours >= 0 && ageHours <= maxAgeHours ? "passed" : "failed";
  return {
    status,
    scheduleCount: schedules.length,
    readyBackupCount: backups.length,
    latestSnapshotTime,
    ageHours,
    errorCategory: status === "passed" ? null : "recent_ready_backup_missing"
  };
}
function getAdminAuth() {
  ensureFirebaseAdminApp();
  return (0, import_auth2.getAuth)();
}
async function verifyAdminRequest(req, res) {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) {
    res.status(401).json({ ok: false, error: "Sign in as an administrator to continue." });
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = String(decoded.email || "").toLowerCase();
    if (!ADMIN_EMAILS.has(email)) {
      res.status(403).json({ ok: false, error: "Administrator access is required." });
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("[AdminAuth] Token verification failed:", error);
    res.status(401).json({ ok: false, error: "Your administrator session could not be verified." });
    return null;
  }
}
function getClientIp(req) {
  const forwardedFor = req.get("x-forwarded-for");
  return (forwardedFor ? forwardedFor.split(",")[0] : req.ip || "unknown").trim();
}
function getRecentGuestIpAttempts(req) {
  const clientIp = getClientIp(req);
  const now = Date.now();
  return {
    clientIp,
    now,
    recent: (guestSearchAttemptsByIp.get(clientIp) || []).filter((attempt) => now - attempt < GUEST_IP_RATE_LIMIT_WINDOW_MS)
  };
}
function hasGuestIpCapacity(req) {
  const { recent } = getRecentGuestIpAttempts(req);
  return recent.length < GUEST_IP_RATE_LIMIT_MAXIMUM;
}
function recordGuestIpAttempt(req) {
  const { clientIp, now, recent } = getRecentGuestIpAttempts(req);
  recent.push(now);
  guestSearchAttemptsByIp.set(clientIp, recent);
}
async function verifySearchIdentity(req, res) {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) {
    res.status(401).json({ ok: false, error: "Please refresh the page and try again." });
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const isAnonymous = decoded.firebase?.sign_in_provider === "anonymous";
    if (!isAnonymous) return { uid: decoded.uid, isAnonymous: false };
    if (!hasGuestIpCapacity(req)) {
      res.status(429).json({ ok: false, error: "Guest search access is temporarily limited. Please create an account to continue." });
      return null;
    }
    const usageSnapshot = await getDb().collection("guestSearchUsage").doc(decoded.uid).get();
    const count = Number(usageSnapshot.data()?.count || 0);
    if (count >= GUEST_SEARCH_LIMIT) {
      res.status(403).json({ ok: false, error: "You've used your 3 free searches. Create an account to start your 7-day trial." });
      return null;
    }
    return { uid: decoded.uid, isAnonymous: true, guestSearchCount: count };
  } catch (error) {
    console.error("[SearchAuth] Token verification failed:", error);
    res.status(401).json({ ok: false, error: "Please refresh the page and try again." });
    return null;
  }
}
async function commitGuestSearchUsage(req, uid) {
  try {
    const usageRef = getDb().collection("guestSearchUsage").doc(uid);
    const usage = await getDb().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(usageRef);
      const count = Number(snapshot.data()?.count || 0);
      if (count >= GUEST_SEARCH_LIMIT) return { allowed: false, count };
      const next = count + 1;
      transaction.set(usageRef, {
        count: next,
        updatedAt: import_firestore2.FieldValue.serverTimestamp(),
        lastSearchAt: import_firestore2.FieldValue.serverTimestamp()
      }, { merge: true });
      return { allowed: true, count: next };
    });
    if (!usage.allowed) return "limit";
    recordGuestIpAttempt(req);
    return "committed";
  } catch (error) {
    console.error("[SearchAuth] Failed to commit guest search usage:", error);
    return "unavailable";
  }
}
async function listAllAuthenticationIdentities() {
  const identities = [];
  let pageToken;
  do {
    const page = await getAdminAuth().listUsers(1e3, pageToken);
    page.users.forEach((userRecord) => {
      identities.push({
        uid: userRecord.uid,
        isAnonymous: !userRecord.email && !userRecord.phoneNumber && userRecord.providerData.length === 0,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        createdAt: userRecord.metadata.creationTime || null,
        lastSignInAt: userRecord.metadata.lastSignInTime || null,
        providers: userRecord.providerData.map((provider) => provider.providerId),
        disabled: userRecord.disabled
      });
    });
    pageToken = page.pageToken;
  } while (pageToken);
  return identities;
}
async function recordEmailEvent({
  to,
  subject,
  from,
  status,
  simulated = false,
  error,
  response,
  type = "unspecified",
  source = "server",
  userId = null,
  metadata = {}
}) {
  try {
    await getDb().collection("emailEvents").add({
      to: to || "",
      subject: subject || "",
      from: from || "",
      type,
      source,
      userId,
      status,
      simulated,
      errorMessage: error ? error?.message || String(error) : null,
      errorName: error?.name || null,
      providerId: response?.id || response?.data?.id || null,
      metadata,
      createdAt: import_firestore2.FieldValue.serverTimestamp()
    });
    if (status === "failed" && !String(type).endsWith("_alert")) {
      await maybeSendEmailFailureAlert(type);
    }
  } catch (logErr) {
    console.error("[EmailLog] Failed to record email event:", logErr);
  }
}
async function maybeSendEmailFailureAlert(failedType) {
  try {
    const cutoff = Date.now() - 60 * 60 * 1e3;
    const snapshot = await getDb().collection("emailEvents").orderBy("createdAt", "desc").limit(100).get();
    const recentFailures = snapshot.docs.map((doc2) => doc2.data()).filter((event) => {
      const createdAt = event.createdAt;
      const createdAtMillis = typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : 0;
      return event.status === "failed" && createdAtMillis >= cutoff;
    });
    const criticalTypes = /* @__PURE__ */ new Set([
      "new_account_notification",
      "welcome_email",
      "trial_ending_reminder",
      "password_changed_confirmation"
    ]);
    const criticalFailure = criticalTypes.has(failedType) || recentFailures.some((event) => criticalTypes.has(event.type));
    if (!criticalFailure && recentFailures.length < 3) return;
    const stateRef = getDb().collection("emailFailureAlertState").doc("current");
    const state = (await stateRef.get()).data() || {};
    const lastAlertMillis = typeof state.lastAlertAt?.toMillis === "function" ? state.lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < MONITORING_ALERT_COOLDOWN_MS) return;
    const failedTypes = [...new Set(recentFailures.map((event) => String(event.type || "unspecified")))].slice(0, 8);
    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: "DinnerByDesign email delivery issue detected",
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Email delivery issue detected</h2>
  <p>Recent transactional email failures have crossed the monitoring threshold.</p>
  <p><strong>${recentFailures.length}</strong> failed email attempts were recorded in the last hour.</p>
  <p style="color: #666; font-size: 13px;">Types: ${escapeHtml11(failedTypes.join(", ") || failedType)}</p>
  <p>Review the Email log in the Admin Dashboard. Recipient content is not included in this alert.</p>
</div>
      `.trim()
    }, {
      type: "email_delivery_alert",
      source: "monitoring",
      metadata: { failureCount: recentFailures.length, failedTypes }
    });
    await stateRef.set({
      lastAlertAt: import_firestore2.FieldValue.serverTimestamp(),
      failureCount: recentFailures.length,
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("[EmailMonitoring] Failure alert evaluation failed:", error);
  }
}
async function sendTrackedEmail(email, meta) {
  try {
    const response = await sendEmail(email);
    await recordEmailEvent({
      ...meta,
      to: email.to,
      subject: email.subject,
      from: email.from,
      status: "sent",
      response
    });
    return response;
  } catch (error) {
    await recordEmailEvent({
      ...meta,
      to: email.to,
      subject: email.subject,
      from: email.from,
      status: "failed",
      error
    });
    throw error;
  }
}
async function updateSearchCanaryState(details) {
  const stateRef = getDb().collection("searchCanaryState").doc("current");
  const currentSnapshot = await stateRef.get();
  const current = currentSnapshot.data() || {};
  const now = Date.now();
  const lastAlertAt = current.lastFailureAlertAt;
  const lastAlertMillis = typeof lastAlertAt?.toMillis === "function" ? lastAlertAt.toMillis() : 0;
  const shouldAlert = details.status === "failed" && (current.status !== "failed" || now - lastAlertMillis >= 24 * 60 * 60 * 1e3);
  let lastFailureAlertAt = current.lastFailureAlertAt || null;
  if (shouldAlert) {
    try {
      await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: "DinnerByDesign search canary failed",
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Search canary failure</h2>
  <p>The scheduled production search check failed.</p>
  <p>Review <strong>Search assurance</strong> in the Admin Dashboard. No customer search allowance was used.</p>
  <p style="color: #666; font-size: 13px;">Latency: ${details.latencyMs}ms \xB7 Category: ${escapeHtml11(details.errorCategory || "unknown")}</p>
</div>
        `.trim()
      }, {
        type: "search_canary_failure",
        source: "search_canary",
        metadata: { requestId: details.requestId, status: details.status }
      });
      lastFailureAlertAt = import_firestore2.FieldValue.serverTimestamp();
    } catch (error) {
      console.error("[SearchCanary] Failure alert could not be sent:", error);
    }
  }
  await stateRef.set({
    status: details.status,
    requestId: details.requestId,
    latencyMs: details.latencyMs,
    resultCount: details.resultCount,
    errorCategory: details.errorCategory || null,
    lastPassedAt: details.status === "passed" ? import_firestore2.FieldValue.serverTimestamp() : current.lastPassedAt || null,
    lastFailedAt: details.status === "failed" ? import_firestore2.FieldValue.serverTimestamp() : current.lastFailedAt || null,
    lastFailureAlertAt,
    updatedAt: import_firestore2.FieldValue.serverTimestamp()
  }, { merge: true });
}
async function updateDeepHealthState(details) {
  const stateRef = getDb().collection("deepHealthState").doc("current");
  const currentSnapshot = await stateRef.get();
  const current = currentSnapshot.data() || {};
  const now = Date.now();
  const lastAlertAt = current.lastFailureAlertAt;
  const lastAlertMillis = typeof lastAlertAt?.toMillis === "function" ? lastAlertAt.toMillis() : 0;
  const shouldAlert = details.status === "failed" && (current.status !== "failed" || now - lastAlertMillis >= MONITORING_ALERT_COOLDOWN_MS);
  let lastFailureAlertAt = current.lastFailureAlertAt || null;
  if (shouldAlert) {
    try {
      await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: "DinnerByDesign dependency health check failed",
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Dependency health check failed</h2>
  <p>The protected daily readiness check found a production dependency or configuration problem.</p>
  <p>Review the service health signals in the Admin Dashboard. No customer search allowance was used.</p>
  <p style="color: #666; font-size: 13px;">Checks: ${escapeHtml11(JSON.stringify(details.checks))} \xB7 Latency: ${details.latencyMs}ms \xB7 Category: ${escapeHtml11(details.errorCategory || "unknown")}</p>
</div>
        `.trim()
      }, {
        type: "deep_health_failure",
        source: "deep_health_monitor",
        metadata: { checks: details.checks, status: details.status }
      });
      lastFailureAlertAt = import_firestore2.FieldValue.serverTimestamp();
    } catch (error) {
      console.error("[DeepHealth] Failure alert could not be sent:", error);
    }
  }
  await stateRef.set({
    status: details.status,
    checks: details.checks,
    latencyMs: details.latencyMs,
    errorCategory: details.errorCategory || null,
    lastPassedAt: details.status === "passed" ? import_firestore2.FieldValue.serverTimestamp() : current.lastPassedAt || null,
    lastFailedAt: details.status === "failed" ? import_firestore2.FieldValue.serverTimestamp() : current.lastFailedAt || null,
    lastFailureAlertAt,
    updatedAt: import_firestore2.FieldValue.serverTimestamp()
  }, { merge: true });
}
async function maybeSendSearchDeliveryAlert(details) {
  if (!["failed", "user_reported"].includes(details.stage)) return;
  try {
    const cutoff = Date.now() - 60 * 60 * 1e3;
    const snapshot = await getDb().collection("searchDeliveryEvents").orderBy("createdAt", "desc").limit(200).get();
    const recentEvents = snapshot.docs.map((doc2) => doc2.data()).filter((event) => {
      const createdAt = event.createdAt;
      const createdAtMillis = typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : 0;
      return createdAtMillis >= cutoff;
    });
    const failures = recentEvents.filter((event) => event.stage === "failed");
    const reports = recentEvents.filter((event) => event.stage === "user_reported");
    const shouldAlert = failures.length >= 3 || reports.length >= 2;
    if (!shouldAlert) return;
    const stateRef = getDb().collection("searchDeliveryAlertState").doc("current");
    const stateSnapshot = await stateRef.get();
    const state = stateSnapshot.data() || {};
    const lastAlertAt = state.lastAlertAt;
    const lastAlertMillis = typeof lastAlertAt?.toMillis === "function" ? lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < 24 * 60 * 60 * 1e3) return;
    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: "DinnerByDesign search issues detected",
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Search issues detected</h2>
  <p>The last hour contains repeated search failures or user reports.</p>
  <p><strong>${failures.length}</strong> failed searches and <strong>${reports.length}</strong> user reports were recorded.</p>
  <p>Most recent signal: ${escapeHtml11(details.source)} on ${escapeHtml11(details.deviceClass)}.</p>
  <p>Review Search assurance in the Admin Dashboard. Search text and user details are not included.</p>
</div>
      `.trim()
    }, {
      type: "search_delivery_alert",
      source: "search_telemetry",
      metadata: {
        failureCount: failures.length,
        reportCount: reports.length,
        source: details.source,
        deviceClass: details.deviceClass
      }
    });
    await stateRef.set({
      lastAlertAt: import_firestore2.FieldValue.serverTimestamp(),
      failureCount: failures.length,
      reportCount: reports.length,
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("[SearchTelemetry] Delivery alert evaluation failed:", error);
  }
}
async function recordStripeWebhookEvent(event, status, details = {}) {
  try {
    const eventId = event?.id || `unverified_${Date.now()}`;
    const record = {
      eventId,
      type: event?.type || "unknown",
      status,
      stripeCreatedAt: event?.created ? import_firestore2.Timestamp.fromMillis(event.created * 1e3) : null,
      receivedAt: details.receivedAt || import_firestore2.FieldValue.serverTimestamp(),
      updatedAt: import_firestore2.FieldValue.serverTimestamp(),
      message: details.message || null,
      error: details.error || null
    };
    ["customerId", "userId", "subscriptionId", "invoiceId"].forEach((key) => {
      if (details[key]) record[key] = details[key];
    });
    await getDb().collection("stripeWebhookEvents").doc(eventId).set(record, { merge: true });
  } catch (logErr) {
    console.error("[Webhook Health] Failed to record Stripe webhook event:", logErr);
  }
}
async function claimStripeWebhookEvent(event) {
  const eventId = String(event?.id || "").trim();
  if (!eventId) return { status: "process", eventId: null };
  const eventRef = getDb().collection("stripeWebhookEvents").doc(eventId);
  const now = Date.now();
  return getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(eventRef);
    const decision = getWebhookClaimDecision(snapshot.data(), now, STRIPE_WEBHOOK_PROCESSING_LEASE_MS);
    if (decision !== "process") return { status: decision, eventId };
    transaction.set(eventRef, {
      eventId,
      type: event?.type || "unknown",
      status: "processing",
      stripeCreatedAt: event?.created ? import_firestore2.Timestamp.fromMillis(event.created * 1e3) : null,
      processingStartedAt: import_firestore2.Timestamp.fromMillis(now),
      receivedAt: import_firestore2.FieldValue.serverTimestamp(),
      updatedAt: import_firestore2.FieldValue.serverTimestamp(),
      message: "Webhook claimed for processing",
      error: null
    }, { merge: true });
    return { status: "process", eventId };
  });
}
async function hasLiveAuthenticationIdentity(uid) {
  try {
    await getAdminAuth().getUser(uid);
    return true;
  } catch (error) {
    if (error?.code === "auth/user-not-found") return false;
    throw error;
  }
}
async function claimUserEmailSend(userRef, sentField) {
  const sendingField = `${sentField}SendingAt`;
  const now = Date.now();
  return getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return false;
    const data = snapshot.data() || {};
    if (data[sentField] === true || isFreshEmailClaim(data[sendingField], now)) return false;
    transaction.update(userRef, {
      [sendingField]: import_firestore2.Timestamp.fromMillis(now),
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    });
    return true;
  });
}
async function completeUserEmailSend(userRef, sentField) {
  const sendingField = `${sentField}SendingAt`;
  await getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return;
    transaction.update(userRef, {
      [sentField]: true,
      [`${sentField}At`]: import_firestore2.FieldValue.serverTimestamp(),
      [sendingField]: import_firestore2.FieldValue.delete(),
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    });
  });
}
async function releaseUserEmailSend(userRef, sentField) {
  const sendingField = `${sentField}SendingAt`;
  try {
    await getDb().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      if (!snapshot.exists) return;
      transaction.update(userRef, { [sendingField]: import_firestore2.FieldValue.delete() });
    });
  } catch (error) {
    console.error(`[Email] Failed to release ${sentField} claim:`, error);
  }
}
async function claimUserInvoiceEmailSend(userRef, invoiceId) {
  const sendingField = "subscriptionPaymentFailedEmailSendingAt";
  const sendingInvoiceField = "subscriptionPaymentFailedEmailSendingInvoiceId";
  const now = Date.now();
  return getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return false;
    const data = snapshot.data() || {};
    if (data.subscriptionPaymentFailedEmailLastInvoiceId === invoiceId) return false;
    if (data[sendingInvoiceField] === invoiceId && isFreshEmailClaim(data[sendingField], now)) return false;
    transaction.update(userRef, {
      [sendingInvoiceField]: invoiceId,
      [sendingField]: import_firestore2.Timestamp.fromMillis(now),
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    });
    return true;
  });
}
async function completeUserInvoiceEmailSend(userRef, invoiceId) {
  await getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return;
    transaction.update(userRef, {
      subscriptionPaymentFailedEmailLastInvoiceId: invoiceId,
      subscriptionPaymentFailedEmailSentAt: import_firestore2.FieldValue.serverTimestamp(),
      subscriptionPaymentFailedEmailSendingInvoiceId: import_firestore2.FieldValue.delete(),
      subscriptionPaymentFailedEmailSendingAt: import_firestore2.FieldValue.delete(),
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    });
  });
}
async function releaseUserInvoiceEmailSend(userRef) {
  try {
    await getDb().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      if (!snapshot.exists) return;
      transaction.update(userRef, {
        subscriptionPaymentFailedEmailSendingInvoiceId: import_firestore2.FieldValue.delete(),
        subscriptionPaymentFailedEmailSendingAt: import_firestore2.FieldValue.delete()
      });
    });
  } catch (error) {
    console.error("[Email] Failed to release payment-failure email claim:", error);
  }
}
function estimateTokensFromChars(chars) {
  return Math.ceil(Math.max(chars || 0, 0) / 4);
}
function classifyAiRequest(searchParams) {
  const query2 = String(searchParams?.query || "").toLowerCase();
  if (query2.includes("cooked dinners for") || query2.includes("ready-made dinner products") || query2.includes("ready-made ") || query2.includes("weekday cooked") || query2.includes("weekly")) {
    return "weekly_plan";
  }
  return searchParams?.source === "ready-made" ? "ready_made_search" : "recipe_search";
}
async function recordAiUsageEvent(details) {
  try {
    const now = /* @__PURE__ */ new Date();
    await getDb().collection("aiUsageEvents").add({
      ...details,
      dateKey: now.toISOString().slice(0, 10),
      createdAt: import_firestore2.FieldValue.serverTimestamp()
    });
    if (details.status === "failed") {
      await maybeSendAiFailureAlert(String(details.errorCategory || details.failureStage || "unknown"));
    }
  } catch (logErr) {
    console.error("[Usage] Failed to record usage event:", logErr);
  }
}
async function maybeSendAiFailureAlert(failedCategory) {
  try {
    const cutoff = Date.now() - 60 * 60 * 1e3;
    const snapshot = await getDb().collection("aiUsageEvents").orderBy("createdAt", "desc").limit(200).get();
    const recentFailures = snapshot.docs.map((doc2) => doc2.data()).filter((event) => {
      const createdAt = event.createdAt;
      const createdAtMillis = typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : 0;
      return event.status === "failed" && createdAtMillis >= cutoff;
    });
    const criticalPattern = /auth|permission|quota|rate|limit|unauthori[sz]ed|forbidden|capacity/i;
    const criticalFailure = criticalPattern.test(failedCategory) || recentFailures.some((event) => criticalPattern.test(String(event.errorCategory || event.failureStage || "")));
    if (!criticalFailure && recentFailures.length < 3) return;
    const stateRef = getDb().collection("aiFailureAlertState").doc("current");
    const state = (await stateRef.get()).data() || {};
    const lastAlertMillis = typeof state.lastAlertAt?.toMillis === "function" ? state.lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < MONITORING_ALERT_COOLDOWN_MS) return;
    const categories = [...new Set(recentFailures.map((event) => String(event.errorCategory || event.failureStage || "unknown")))].slice(0, 8);
    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: "DinnerByDesign AI service issue detected",
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">AI service issue detected</h2>
  <p>Recent AI request failures have crossed the monitoring threshold.</p>
  <p><strong>${recentFailures.length}</strong> failed AI requests were recorded in the last hour.</p>
  <p style="color: #666; font-size: 13px;">Categories: ${escapeHtml11(categories.join(", ") || failedCategory)}</p>
  <p>Review Service Health in the Admin Dashboard. Search text and account details are not included in this alert.</p>
</div>
      `.trim()
    }, {
      type: "ai_service_alert",
      source: "monitoring",
      metadata: { failureCount: recentFailures.length, categories }
    });
    await stateRef.set({
      lastAlertAt: import_firestore2.FieldValue.serverTimestamp(),
      failureCount: recentFailures.length,
      updatedAt: import_firestore2.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("[AiMonitoring] Failure alert evaluation failed:", error);
  }
}
function normaliseSearchRequestId(value) {
  const requestId = String(value || "").trim();
  return /^[a-zA-Z0-9-]{8,80}$/.test(requestId) ? requestId : null;
}
function isAuthorisedCronRequest(req) {
  const cronSecret = String(process.env.CRON_SECRET || "").trim();
  const authorization = req.get("authorization") || "";
  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}
var _filename = "";
var _dirname = "";
try {
  if (typeof import_meta !== "undefined" && import_meta.url) {
    _filename = (0, import_url.fileURLToPath)(import_meta.url);
    _dirname = import_path.default.dirname(_filename);
  } else if (typeof __filename !== "undefined") {
    _filename = __filename;
    _dirname = __dirname;
  } else {
    _filename = process.cwd();
    _dirname = process.cwd();
  }
} catch (e) {
  _filename = process.cwd();
  _dirname = process.cwd();
}
function createApp() {
  console.log(`[API] Booting app (env: ${process.env.NODE_ENV})...`);
  const app2 = (0, import_express.default)();
  const isProdEnv = process.env.NODE_ENV === "production";
  app2.use("/api", (0, import_cors.default)({
    origin: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  }));
  app2.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }
    const redirectPath = getPublicPageRedirect(req.path);
    if (!redirectPath) {
      return next();
    }
    return res.redirect(308, redirectPath);
  });
  app2.use((req, res, next) => {
    if (req.path === "/api/stripe-webhook") return next();
    return import_express.default.json()(req, res, next);
  });
  app2.get("/api/connection-test", (req, res) => {
    if (isProdEnv) {
      return res.status(404).json({ ok: false });
    }
    res.json({
      ok: true,
      time: (/* @__PURE__ */ new Date()).toISOString(),
      env: {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  });
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      geminiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
  });
  app2.get("/api/health/deep", async (req, res) => {
    if (!isAuthorisedCronRequest(req)) {
      return res.status(process.env.CRON_SECRET ? 401 : 503).json({
        ok: false,
        error: process.env.CRON_SECRET ? "Unauthorised." : "Deep health monitoring is not configured."
      });
    }
    const startedAt = Date.now();
    const checks = {
      firestore: "not_checked",
      gemini: process.env.GEMINI_API_KEY ? "configured" : "missing",
      backups: String(process.env.FIRESTORE_BACKUP_MONITORING_ENABLED || "").toLowerCase() === "true" ? "not_checked" : "not_configured"
    };
    let errorCategory = null;
    try {
      await getDb().collection("monitoring").doc("readiness").get();
      checks.firestore = "ok";
    } catch (error) {
      checks.firestore = "failed";
      errorCategory = String(error?.code || error?.name || "firestore_unavailable").slice(0, 80);
      console.error("[DeepHealth] Firestore readiness check failed:", error);
    }
    if (checks.backups === "not_checked") {
      try {
        const backupCheck = await checkFirestoreBackups();
        checks.backups = backupCheck.status;
        if (backupCheck.status === "failed") errorCategory ||= backupCheck.errorCategory || "backup_check_failed";
      } catch (error) {
        checks.backups = "failed";
        errorCategory ||= String(error?.code || error?.name || "backup_check_failed").slice(0, 80);
        console.error("[DeepHealth] Firestore backup check failed:", error);
      }
    }
    const latencyMs = Date.now() - startedAt;
    const healthy = checks.firestore === "ok" && checks.gemini === "configured" && checks.backups !== "failed";
    try {
      await updateDeepHealthState({
        status: healthy ? "passed" : "failed",
        latencyMs,
        checks,
        errorCategory: healthy ? null : errorCategory || "configuration_missing"
      });
    } catch (error) {
      console.error("[DeepHealth] State update failed:", error);
    }
    return res.status(healthy ? 200 : 503).json({
      ok: healthy,
      status: healthy ? "ok" : "failed",
      checks,
      latencyMs
    });
  });
  app2.get("/api/monitor/search-canary", async (req, res) => {
    if (!isAuthorisedCronRequest(req)) {
      return res.status(process.env.CRON_SECRET ? 401 : 503).json({
        ok: false,
        error: process.env.CRON_SECRET ? "Unauthorised." : "Search canary monitoring is not configured."
      });
    }
    const startedAt = Date.now();
    const requestId = `canary-${Date.now()}`;
    const searchParams = {
      query: "pasta",
      source: "cook",
      count: 1,
      telemetryRequestId: requestId
    };
    try {
      const result = await generateDinnerSuggestions(searchParams);
      const resultCount = (result?.recipes?.length || 0) + (result?.readyMeals?.length || 0);
      const deliverable = isDeliverableSearchResult(result);
      const latencyMs = Date.now() - startedAt;
      await getDb().collection("searchCanaryEvents").add({
        requestId,
        status: deliverable ? "passed" : "failed",
        source: "cook",
        resultCount,
        latencyMs,
        createdAt: import_firestore2.FieldValue.serverTimestamp()
      });
      await updateSearchCanaryState({
        status: deliverable ? "passed" : "failed",
        requestId,
        latencyMs,
        resultCount,
        errorCategory: deliverable ? null : "undeliverable_response"
      });
      await recordAiUsageEvent({
        requestId,
        type: "search_canary",
        source: "cook",
        model: result?.diagnostics?.usage?.model || ACTIVE_GEMINI_MODEL,
        status: deliverable ? "succeeded" : "failed",
        failureStage: deliverable ? null : "undeliverable_response",
        queryLength: searchParams.query.length,
        requestedCount: searchParams.count,
        resultCount,
        serverLatencyMs: latencyMs,
        inputTokensEstimate: result?.diagnostics?.usage?.inputTokensEstimate || 0,
        outputTokensEstimate: result?.diagnostics?.usage?.outputTokensEstimate || 0,
        estimatedCostUsd: estimateGeminiCostUsd(
          result?.diagnostics?.usage?.inputTokensEstimate || 0,
          result?.diagnostics?.usage?.outputTokensEstimate || 0
        )
      });
      if (!deliverable) {
        return res.status(503).json({ ok: false, status: "failed", latencyMs });
      }
      return res.json({ ok: true, status: "passed", resultCount, latencyMs });
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      await getDb().collection("searchCanaryEvents").add({
        requestId,
        status: "failed",
        source: "cook",
        resultCount: 0,
        latencyMs,
        errorCategory: String(error?.category || error?.name || "unknown").slice(0, 80),
        createdAt: import_firestore2.FieldValue.serverTimestamp()
      });
      await updateSearchCanaryState({
        status: "failed",
        requestId,
        latencyMs,
        resultCount: 0,
        errorCategory: String(error?.category || error?.name || "unknown").slice(0, 80)
      });
      await recordAiUsageEvent({
        requestId,
        type: "search_canary",
        source: "cook",
        model: ACTIVE_GEMINI_MODEL,
        status: "failed",
        failureStage: "request_error",
        queryLength: searchParams.query.length,
        requestedCount: searchParams.count,
        resultCount: 0,
        serverLatencyMs: latencyMs,
        estimatedCostUsd: 0,
        errorCategory: String(error?.category || error?.name || "unknown").slice(0, 80)
      });
      console.error("[SearchCanary] Production canary failed:", error);
      return res.status(503).json({ ok: false, status: "failed", latencyMs });
    }
  });
  app2.get("/api/admin/accounts/reconciliation", async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;
    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get()
      ]);
      const profileIds = profileSnapshot.docs.map((profile) => profile.id);
      const summary = summariseAccountReconciliation(
        identities,
        profileIds
      );
      const registeredWithoutProfileAccounts = findRegisteredIdentitiesWithoutProfiles(
        identities,
        profileIds
      ).map((identity) => ({
        uid: identity.uid,
        email: identity.email,
        displayName: identity.displayName,
        createdAt: identity.createdAt,
        lastSignInAt: identity.lastSignInAt,
        providers: identity.providers,
        disabled: identity.disabled
      })).sort((a, b) => {
        const bCreatedAt = b.createdAt ? Date.parse(b.createdAt) : 0;
        const aCreatedAt = a.createdAt ? Date.parse(a.createdAt) : 0;
        return bCreatedAt - aCreatedAt;
      });
      const anonymousWithoutProfileUids = findAnonymousIdentitiesWithoutProfiles(
        identities,
        profileIds
      ).map((identity) => identity.uid);
      return res.json({
        ok: true,
        summary: {
          ...summary,
          registeredWithoutProfileAccounts,
          anonymousWithoutProfileUids
        },
        checkedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("[AdminAccounts] Reconciliation failed:", error);
      return res.status(503).json({
        ok: false,
        error: "Account reconciliation is unavailable. Server-side Firebase administration must be configured."
      });
    }
  });
  app2.post("/api/admin/monitoring/access", async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;
    try {
      const requestedPath = String(req.body?.path || "/admin").split("?")[0].slice(0, 120) || "/admin";
      const deviceClass = ["mobile", "tablet", "desktop"].includes(req.body?.deviceClass) ? req.body.deviceClass : "unknown";
      await getDb().collection("adminAccessEvents").add({
        event: "dashboard_opened",
        userId: admin.uid,
        email: String(admin.email || "").toLowerCase() || null,
        path: requestedPath,
        deviceClass,
        createdAt: import_firestore2.FieldValue.serverTimestamp()
      });
      return res.status(204).send();
    } catch (error) {
      console.error("[AdminMonitoring] Failed to record administrator access:", error);
      return res.status(500).json({ ok: false });
    }
  });
  app2.post("/api/admin/accounts/cleanup", import_express.default.json(), async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;
    const category = String(req.body?.category || "");
    const requestedUids = Array.isArray(req.body?.uids) ? [...new Set(
      req.body.uids.map((uid) => String(uid || "").trim()).filter((uid) => uid.length > 0)
    )] : [];
    if (!["registered_without_profile", "anonymous_without_profile"].includes(category)) {
      return res.status(400).json({ ok: false, error: "A valid cleanup category is required." });
    }
    if (requestedUids.length === 0 || requestedUids.length > 1e3 || requestedUids.some((uid) => uid.length > 128)) {
      return res.status(400).json({ ok: false, error: "Between 1 and 1,000 valid account identifiers are required." });
    }
    if (requestedUids.includes(admin.uid)) {
      return res.status(400).json({ ok: false, error: "The administrative account cannot be included." });
    }
    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get()
      ]);
      const profileIds = profileSnapshot.docs.map((profile) => profile.id);
      const eligibleIdentities = category === "registered_without_profile" ? findRegisteredIdentitiesWithoutProfiles(identities, profileIds) : findAnonymousIdentitiesWithoutProfiles(identities, profileIds);
      const eligibleByUid = new Map(eligibleIdentities.map((identity) => [identity.uid, identity]));
      const invalidUids = requestedUids.filter((uid) => {
        const identity = eligibleByUid.get(uid);
        const email = String(identity?.email || "").toLowerCase();
        return !identity || ADMIN_EMAILS.has(email);
      });
      if (invalidUids.length > 0) {
        return res.status(409).json({
          ok: false,
          error: "Cleanup stopped because one or more accounts no longer match the reviewed category.",
          invalidCount: invalidUids.length
        });
      }
      const result = await getAdminAuth().deleteUsers(requestedUids);
      if (result.failureCount > 0) {
        return res.status(500).json({
          ok: false,
          error: `${result.failureCount} account identities could not be deleted.`,
          successCount: result.successCount,
          failureCount: result.failureCount
        });
      }
      return res.json({
        ok: true,
        category,
        deletedCount: result.successCount
      });
    } catch (error) {
      console.error("[AdminAccounts] Cleanup failed:", error);
      return res.status(500).json({
        ok: false,
        error: "The reviewed account identities could not be deleted."
      });
    }
  });
  app2.delete("/api/admin/accounts/:uid", async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;
    const targetUid = String(req.params.uid || "").trim();
    if (!targetUid || targetUid.length > 128) {
      return res.status(400).json({ ok: false, error: "A valid account identifier is required." });
    }
    if (targetUid === admin.uid) {
      return res.status(400).json({ ok: false, error: "You cannot delete your own administrative account." });
    }
    try {
      const profileRef = getDb().collection("users").doc(targetUid);
      const profileSnapshot = await profileRef.get();
      const profileEmail = String(profileSnapshot.data()?.email || "").toLowerCase();
      let authenticationRecord = null;
      try {
        authenticationRecord = await getAdminAuth().getUser(targetUid);
      } catch (error) {
        if (error?.code !== "auth/user-not-found") throw error;
      }
      const authenticationEmail = String(authenticationRecord?.email || "").toLowerCase();
      if (ADMIN_EMAILS.has(profileEmail) || ADMIN_EMAILS.has(authenticationEmail)) {
        return res.status(400).json({ ok: false, error: "The administrative account cannot be deleted." });
      }
      if (authenticationRecord) {
        await getAdminAuth().deleteUser(targetUid);
      }
      await getDb().recursiveDelete(profileRef);
      return res.json({
        ok: true,
        authenticationIdentityDeleted: !!authenticationRecord,
        profileDataDeleted: profileSnapshot.exists
      });
    } catch (error) {
      console.error(`[AdminAccounts] Failed to delete ${targetUid}:`, error);
      return res.status(500).json({
        ok: false,
        error: "The complete account could not be deleted."
      });
    }
  });
  let stripe = null;
  const getStripe = async () => {
    if (!stripe) {
      const { default: Stripe } = await import("stripe");
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
      }
      stripe = new Stripe(key);
    }
    return stripe;
  };
  app2.post("/api/search-telemetry", async (req, res) => {
    const authorization = req.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return res.status(401).json({ ok: false });
    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      const requestId = normaliseSearchRequestId(req.body?.requestId);
      const stage = String(req.body?.stage || "");
      const source = req.body?.source === "ready-made" ? "ready-made" : req.body?.source === "cook" ? "cook" : null;
      const allowedStages = /* @__PURE__ */ new Set(["started", "results_delivered", "no_results_delivered", "failed", "cancelled", "user_reported"]);
      if (!requestId || !allowedStages.has(stage) || !source) {
        return res.status(400).json({ ok: false, error: "Invalid search telemetry event." });
      }
      const durationMs = Number.isFinite(Number(req.body?.durationMs)) ? Math.max(0, Math.min(3e5, Number(req.body.durationMs))) : null;
      const resultCount = Number.isFinite(Number(req.body?.resultCount)) ? Math.max(0, Math.min(100, Number(req.body.resultCount))) : null;
      const viewportWidth = Number.isFinite(Number(req.body?.viewportWidth)) ? Math.max(0, Math.min(5e3, Number(req.body.viewportWidth))) : null;
      await getDb().collection("searchDeliveryEvents").add({
        requestId,
        stage,
        source,
        durationMs,
        resultCount,
        errorCategory: String(req.body?.errorCategory || "").slice(0, 80) || null,
        deviceClass: ["mobile", "tablet", "desktop"].includes(req.body?.deviceClass) ? req.body.deviceClass : "unknown",
        viewportWidth,
        userId: decoded.uid,
        isAnonymous: decoded.firebase?.sign_in_provider === "anonymous",
        createdAt: import_firestore2.FieldValue.serverTimestamp()
      });
      await maybeSendSearchDeliveryAlert({
        stage,
        source,
        deviceClass: ["mobile", "tablet", "desktop"].includes(req.body?.deviceClass) ? req.body.deviceClass : "unknown"
      });
      return res.status(204).send();
    } catch (error) {
      console.error("[SearchTelemetry] Failed to record client event:", error);
      return res.status(500).json({ ok: false });
    }
  });
  app2.post("/api/client-errors", async (req, res) => {
    if (!hasClientErrorRateLimitCapacity(req)) {
      return res.status(429).json({ ok: false });
    }
    const allowedKinds = /* @__PURE__ */ new Set(["runtime", "unhandled_rejection", "boundary", "dynamic_import", "resource"]);
    const kind = String(req.body?.kind || "");
    const message = sanitiseClientErrorText(req.body?.message, 2e3);
    if (!allowedKinds.has(kind) || !message) {
      return res.status(400).json({ ok: false, error: "Invalid client error event." });
    }
    let userId = null;
    let isAnonymous = null;
    const authorization = req.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (token) {
      try {
        const decoded = await getAdminAuth().verifyIdToken(token);
        userId = decoded.uid;
        isAnonymous = decoded.firebase?.sign_in_provider === "anonymous";
      } catch {
      }
    }
    try {
      await getDb().collection("clientErrorEvents").add({
        kind,
        message,
        stack: sanitiseClientErrorText(req.body?.stack, 3e3) || null,
        source: sanitiseClientErrorText(req.body?.source, 500) || null,
        path: sanitiseClientErrorText(req.body?.path, 300) || "/",
        deviceClass: ["mobile", "tablet", "desktop"].includes(req.body?.deviceClass) ? req.body.deviceClass : "unknown",
        viewportWidth: Number.isFinite(Number(req.body?.viewportWidth)) ? Math.max(0, Math.min(5e3, Number(req.body.viewportWidth))) : null,
        userId,
        isAnonymous,
        createdAt: import_firestore2.FieldValue.serverTimestamp()
      });
      return res.status(204).send();
    } catch (error) {
      console.error("[ClientErrors] Failed to record browser error:", error);
      return res.status(500).json({ ok: false });
    }
  });
  app2.post("/api/generate-suggestions", async (req, res) => {
    console.log(`[API] Received request for /api/generate-suggestions`);
    const requestStartedAt = Date.now();
    const requestId = normaliseSearchRequestId(req.body?.requestId || req.body?.searchParams?.telemetryRequestId);
    try {
      const searchIdentity = await verifySearchIdentity(req, res);
      if (!searchIdentity) return;
      const { searchParams: rawSearchParams, preferences } = req.body;
      const validation = validateSearchRequestPayload(rawSearchParams, preferences);
      if ("code" in validation) {
        return res.status(400).json({
          ok: false,
          error: {
            code: validation.code,
            message: validation.message,
            retryable: false,
            status: 400,
            category: "request"
          }
        });
      }
      const searchParams = normaliseIncomingSearchParams(rawSearchParams);
      if (!searchParams.query) {
        return res.status(400).json({
          ok: false,
          error: {
            code: "SEARCH_QUERY_REQUIRED",
            message: "Please enter a recipe or ingredient to search for.",
            retryable: false,
            status: 400,
            category: "model"
          }
        });
      }
      const result = await generateDinnerSuggestions(searchParams, preferences);
      if (!isDeliverableSearchResult(result)) {
        await recordAiUsageEvent({
          requestId,
          type: classifyAiRequest(searchParams),
          source: searchParams.source || "cook",
          model: ACTIVE_GEMINI_MODEL,
          status: "failed",
          failureStage: "undeliverable_response",
          queryLength: String(searchParams.query || "").length,
          requestedCount: searchParams.count || 3,
          resultCount: 0,
          serverLatencyMs: Date.now() - requestStartedAt,
          estimatedCostUsd: 0,
          errorCategory: "model"
        });
        return res.status(503).json({
          ok: false,
          error: {
            code: "SEARCH_INVALID_RESPONSE",
            message: "Search returned an incomplete response. Please try again.",
            retryable: true,
            status: 503,
            category: "model"
          }
        });
      }
      if (searchIdentity.isAnonymous) {
        const usageCommit = await commitGuestSearchUsage(req, searchIdentity.uid);
        if (usageCommit === "limit") {
          return res.status(403).json({ ok: false, error: "You've used your 3 free searches. Create an account to start your 7-day trial." });
        }
        if (usageCommit === "unavailable") {
          return res.status(503).json({
            ok: false,
            error: {
              code: "SEARCH_USAGE_UNAVAILABLE",
              message: "Your search could not be completed. Please try again in a moment.",
              retryable: true,
              status: 503,
              category: "network"
            }
          });
        }
      }
      const usage = result?.diagnostics?.usage || null;
      const inputTokens = usage?.inputTokensEstimate || estimateTokensFromChars(usage?.inputChars || 0 || String(searchParams.query || "").length);
      const outputTokens = usage?.outputTokensEstimate || estimateTokensFromChars(JSON.stringify(result || {}).length);
      await recordAiUsageEvent({
        requestId,
        type: classifyAiRequest(searchParams),
        source: searchParams.source || "cook",
        model: usage?.model || ACTIVE_GEMINI_MODEL,
        status: "succeeded",
        queryLength: String(searchParams.query || "").length,
        requestedCount: searchParams.count || 3,
        resultCount: (result?.recipes?.length || 0) + (result?.readyMeals?.length || 0),
        latencyMs: result?.diagnostics?.timings?.geminiCall || null,
        totalRoundTripMs: result?.diagnostics?.timings?.totalRoundTrip || null,
        serverLatencyMs: Date.now() - requestStartedAt,
        inputTokensEstimate: inputTokens,
        outputTokensEstimate: outputTokens,
        estimatedCostUsd: estimateGeminiCostUsd(inputTokens, outputTokens)
      });
      res.json(result);
    } catch (error) {
      console.error("[Server API] Gemini Search Error:", error);
      logApiError("generate-suggestions", error);
      const failedSearchParams = req.body?.searchParams || {};
      await recordAiUsageEvent({
        requestId,
        type: classifyAiRequest(failedSearchParams),
        source: failedSearchParams.source || "cook",
        model: ACTIVE_GEMINI_MODEL,
        status: "failed",
        queryLength: String(failedSearchParams.query || "").length,
        requestedCount: failedSearchParams.count || 3,
        resultCount: 0,
        latencyMs: null,
        totalRoundTripMs: null,
        serverLatencyMs: Date.now() - requestStartedAt,
        inputTokensEstimate: estimateTokensFromChars(String(failedSearchParams.query || "").length),
        outputTokensEstimate: 0,
        estimatedCostUsd: 0,
        errorCategory: error.category || "model"
      });
      const category = error.category || "model";
      let message = error.message || "Internal search service error";
      if (message.includes("<!DOCTYPE html>") || message.includes("<html")) {
        message = "Search is temporarily unavailable. Please try again.";
      }
      const messageLower = message.toLowerCase();
      const isPermission = category === "permission" || messageLower.includes("permission_denied") || messageLower.includes("permission denied") || messageLower.includes("lightning dunning") || messageLower.includes("deny") && messageLower.includes("project");
      const isTransient = messageLower.includes("high demand") || messageLower.includes("503") || messageLower.includes("unavailable") || messageLower.includes("overloaded") || messageLower.includes("capacity") || messageLower.includes("deadline exceeded") || messageLower.includes("temporary") || messageLower.includes("apierror") || messageLower.includes("internal error");
      const isQuota = category === "quota" || messageLower.includes("quota") || messageLower.includes("limit") || messageLower.includes("resource exhausted");
      if (isPermission || isTransient || isQuota) {
        message = isPermission ? "Recipe search is temporarily unavailable because the search service account needs attention. This is on our side, so please try again later." : isQuota ? "Our search service is currently at capacity due to high demand. You didn't do anything wrong! Please wait about 60 seconds and try again." : "Our search provider is experiencing a temporary issue. This is a backend stability matter and usually resolves quickly. Please try again in a moment. [Check Status](https://aistudio.google.com/status)";
      }
      const status = isQuota ? 429 : 503;
      const errorResponse = {
        ok: false,
        error: {
          code: isPermission ? "SEARCH_SERVICE_ACCOUNT_UNAVAILABLE" : isQuota ? "SEARCH_QUOTA_EXHAUSTED" : "SEARCH_TEMPORARY_FAILURE",
          message,
          retryable: !isPermission && (isTransient || isQuota),
          status,
          category: isPermission ? "permission" : category
        }
      };
      res.status(status).json(errorResponse);
    }
  });
  app2.post("/api/enrich-recipe", async (req, res) => {
    console.log(`[API] Received request for /api/enrich-recipe`);
    try {
      const validation = validateEnrichmentRequestPayload(req.body);
      if ("code" in validation) {
        return res.status(400).json({
          ok: false,
          error: {
            code: validation.code,
            message: validation.message,
            retryable: false,
            status: 400,
            category: "request"
          }
        });
      }
      const { title, cuisine, mode } = req.body;
      const result = await enrichRecipe(title, cuisine, mode, parseEnrichmentRequestOptions(req.body));
      res.json(result);
    } catch (error) {
      console.error("[Server API] Gemini Enrichment Error:", error);
      logApiError("enrich-recipe", error);
      let message = error.message || "Internal enrichment error";
      if (message.includes("<!DOCTYPE html>") || message.includes("<html")) {
        message = "Recipe enrichment is temporarily unavailable. Please try again.";
      }
      res.status(503).json({
        ok: false,
        error: {
          code: "ENRICHMENT_TEMPORARY_FAILURE",
          message: "Recipe enrichment is temporarily unavailable due to high demand. Please try again in a moment.",
          retryable: true,
          status: 503
        }
      });
    }
  });
  app2.post("/api/create-checkout-session", async (req, res) => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      if (!token) return res.status(401).json({ error: "A signed-in account is required." });
      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.firebase?.sign_in_provider === "anonymous") {
        return res.status(403).json({ error: "A registered account is required to subscribe." });
      }
      const stripeClient = await getStripe();
      const origin = getAppOrigin(req);
      const { plan, userId } = req.body;
      if (!userId || userId !== decoded.uid) {
        return res.status(400).json({ error: "The signed-in account could not be verified." });
      }
      const isYearly = plan === "yearly";
      const successUrl = origin.endsWith("/") ? `${origin}success?session_id={CHECKOUT_SESSION_ID}` : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = origin.endsWith("/") ? `${origin}?payment=cancel` : `${origin}/?payment=cancel`;
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: userId,
        customer_email: decoded.email || void 0,
        metadata: { userId, plan: isYearly ? "annual" : "monthly" },
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `DinnerByDesign Access (${isYearly ? "Annual" : "Monthly"})`,
                description: "Unlock advanced search and unlimited dinner planning"
              },
              unit_amount: isYearly ? 3e3 : 299,
              // £30.00 or £2.99
              recurring: {
                interval: isYearly ? "year" : "month"
              }
            },
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl
      });
      res.json({ id: session.id, url: session.url });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/get-checkout-session", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
      const stripeClient = await getStripe();
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/create-portal-session", async (req, res) => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      if (!token) return res.status(401).json({ error: "A signed-in account is required." });
      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.firebase?.sign_in_provider === "anonymous") {
        return res.status(403).json({ error: "A registered account is required to manage billing." });
      }
      const stripeClient = await getStripe();
      const userRef = getDb().collection("users").doc(decoded.uid);
      const profileSnapshot = await userRef.get();
      const profile = profileSnapshot.data() || {};
      let customerId = String(profile.subscription?.stripeCustomerId || "").trim();
      if (!customerId && decoded.email) {
        const customers = await stripeClient.customers.list({
          email: decoded.email,
          limit: 100
        });
        const customersWithActiveSubscriptions = [];
        for (const customer of customers.data || []) {
          const subscriptions = await stripeClient.subscriptions.list({
            customer: customer.id,
            status: "all",
            limit: 20
          });
          const hasManageableSubscription = (subscriptions.data || []).some((subscription) => ["active", "trialing", "past_due", "unpaid"].includes(subscription.status));
          if (hasManageableSubscription) customersWithActiveSubscriptions.push(customer.id);
        }
        if (customersWithActiveSubscriptions.length === 1) {
          customerId = customersWithActiveSubscriptions[0];
          if (profileSnapshot.exists) {
            await userRef.set({
              subscription: {
                stripeCustomerId: customerId,
                updatedAt: import_firestore2.FieldValue.serverTimestamp()
              },
              updatedAt: import_firestore2.FieldValue.serverTimestamp()
            }, { merge: true });
          }
        }
      }
      if (!customerId) {
        return res.status(404).json({ error: "Your billing details are not ready yet. Please try again shortly." });
      }
      const returnUrl = `${getAppOrigin(req)}/?view=settings`;
      const session = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe Portal Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/stripe-webhook", import_express.default.raw({ type: "application/json" }), async (req, res) => {
    const stripeClient = await getStripe();
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      if (webhookSecret) {
        event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        event = JSON.parse(req.body.toString());
        console.log("[Webhook] WARNING: Signature verification skipped (no secret set)");
      }
    } catch (err) {
      console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(`[Webhook] Handling event: ${event.type}`);
    const webhookClaim = await claimStripeWebhookEvent(event);
    if (webhookClaim.status === "already_processed") {
      console.log(`[Webhook] Ignoring duplicate event ${webhookClaim.eventId}`);
      return res.json({ received: true, duplicate: true });
    }
    if (webhookClaim.status === "in_progress") {
      console.log(`[Webhook] Deferring event ${webhookClaim.eventId} while another attempt is active`);
      return res.status(409).json({ received: false, retryable: true });
    }
    await recordStripeWebhookEvent(event, "processing", {
      message: "Webhook received and verified"
    });
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.client_reference_id || session.metadata?.userId;
          const customerId = session.customer;
          await recordStripeWebhookEvent(event, "processing", {
            userId,
            customerId,
            message: "Checkout session completed"
          });
          if (userId && customerId) {
            console.log(`[Webhook] Linking customer ${customerId} to user ${userId}`);
            if (!await hasLiveAuthenticationIdentity(userId)) {
              console.warn(`[Webhook] Skipping checkout for deleted authentication identity ${userId}`);
              break;
            }
            const userRef = getDb().collection("users").doc(userId);
            await userRef.set({
              subscription: {
                stripeCustomerId: customerId,
                updatedAt: import_firestore2.FieldValue.serverTimestamp()
              }
            }, { merge: true });
            const userDoc = await userRef.get();
            const userData = userDoc.data();
            const userEmail = userData?.email || session.customer_details?.email;
            const shouldSendSubscriptionConfirmation = userEmail ? await claimUserEmailSend(userRef, "subscriptionConfirmationEmailSent") : false;
            if (shouldSendSubscriptionConfirmation) {
              try {
                const appUrl = PRODUCTION_APP_URL;
                await sendTrackedEmail({
                  to: userEmail,
                  subject: "Your DinnerByDesign subscription is active",
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.55;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">DinnerByDesign</p>
                      <h2 style="color: #111827; margin: 0 0 16px; font-size: 26px; line-height: 1.2;">Your subscription is active</h2>
                      <p style="margin: 0 0 14px;">Thanks for subscribing. Your DinnerByDesign account now has full access to recipe search, saved recipes, planning tools, shopping lists, and personalised settings while your subscription remains active.</p>
                      <p style="margin: 0 0 22px;">Stripe handles your secure payment, receipts, invoices, and card details. This email is simply our confirmation that DinnerByDesign has activated your account.</p>
                      <div style="background: #f9fafb; border: 1px solid #eef0f3; border-radius: 12px; padding: 16px 18px; margin: 22px 0;">
                        <p style="margin: 0 0 8px; font-weight: 700; color: #111827;">What you can do now</p>
                        <ul style="margin: 0; padding-left: 18px; color: #4b5563;">
                          <li>Search for unlimited dinner ideas.</li>
                          <li>Save recipes and sync them across devices.</li>
                          <li>Plan dinners and build shopping lists.</li>
                          <li>Manage your subscription from Settings.</li>
                        </ul>
                      </div>
                      <div style="margin: 28px 0;">
                        <a href="${appUrl}/?view=home" style="background-color: #111827; color: #ffffff; padding: 13px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Open DinnerByDesign</a>
                      </div>
                      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">To change or cancel your subscription, open DinnerByDesign and go to Settings \u2192 Subscription.</p>
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:terence@dinnerbydesign.app" style="color: #111827;">terence@dinnerbydesign.app</a>.</p>
                    </div>
                  `
                }, {
                  type: "subscription_active",
                  source: "stripe_webhook",
                  userId,
                  metadata: {
                    stripeCustomerId: customerId,
                    stripeSessionId: session.id
                  }
                });
                await completeUserEmailSend(userRef, "subscriptionConfirmationEmailSent");
                console.log(`[Webhook] Subscription confirmation email sent to ${userEmail}`);
              } catch (emailErr) {
                await releaseUserEmailSend(userRef, "subscriptionConfirmationEmailSent");
                console.error(`[Webhook] Failed to send subscription confirmation email:`, emailErr);
              }
            }
          }
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          await recordStripeWebhookEvent(event, "processing", {
            customerId,
            subscriptionId: subscription.id,
            message: `Subscription event ${subscription.status || "unknown"}`
          });
          const userQuery = await getDb().collection("users").where("subscription.stripeCustomerId", "==", customerId).limit(1).get();
          if (!userQuery.empty) {
            const userDoc = userQuery.docs[0];
            const userId = userDoc.id;
            if (!await hasLiveAuthenticationIdentity(userId)) {
              console.warn(`[Webhook] Skipping subscription update for deleted authentication identity ${userId}`);
              break;
            }
            const userData = userDoc.data();
            await recordStripeWebhookEvent(event, "processing", {
              userId,
              customerId,
              subscriptionId: subscription.id,
              message: `Updating subscription to ${subscription.status || "unknown"}`
            });
            const status = subscription.status;
            const isTrialing = status === "trialing";
            const isPaying = status === "active";
            const graceEndsAt = userData?.subscriptionPaymentGraceEndsAt;
            const graceEndsAtMillis = typeof graceEndsAt?.toMillis === "function" ? graceEndsAt.toMillis() : graceEndsAt instanceof Date ? graceEndsAt.getTime() : 0;
            const isPaymentGraceActive = status === "past_due" && graceEndsAtMillis > Date.now();
            const hasAccess = isTrialing || isPaying || isPaymentGraceActive;
            const subscriptionAccessStatus = isPaying || isPaymentGraceActive ? "paid" : isTrialing ? "trial" : "read_only";
            const summary = {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: status,
              accessStatus: subscriptionAccessStatus,
              trialStart: subscription.trial_start ? import_firestore2.Timestamp.fromMillis(subscription.trial_start * 1e3) : null,
              trialEnd: subscription.trial_end ? import_firestore2.Timestamp.fromMillis(subscription.trial_end * 1e3) : null,
              subscriptionCreatedAt: subscription.created ? import_firestore2.Timestamp.fromMillis(subscription.created * 1e3) : null,
              currentPeriodStart: import_firestore2.Timestamp.fromMillis(subscription.current_period_start * 1e3),
              currentPeriodEnd: import_firestore2.Timestamp.fromMillis(subscription.current_period_end * 1e3),
              isTrialing,
              isPaying,
              hasAccess,
              lastStripeEventCreatedAt: event.created || null,
              lastStripeEventId: event.id || null,
              updatedAt: import_firestore2.FieldValue.serverTimestamp()
            };
            console.log(`[Webhook] Updating subscription for user ${userId} to ${status}`);
            const appliedSubscriptionUpdate = await getDb().runTransaction(async (transaction) => {
              const currentSnapshot = await transaction.get(userDoc.ref);
              if (!currentSnapshot.exists) return false;
              const currentData = currentSnapshot.data() || {};
              if (!shouldApplyStripeEvent(currentData.subscription?.lastStripeEventCreatedAt, event.created)) {
                return false;
              }
              transaction.set(userDoc.ref, {
                subscription: summary,
                isPremium: isPaying || isPaymentGraceActive,
                accessStatus: summary.accessStatus,
                updatedAt: import_firestore2.FieldValue.serverTimestamp()
              }, { merge: true });
              return true;
            });
            if (!appliedSubscriptionUpdate) {
              console.log(`[Webhook] Ignoring older subscription event ${event.id || "(unknown)"}`);
              break;
            }
            const userEmail = userData?.email;
            const shouldSendCancellationEmail = event.type === "customer.subscription.deleted" && userEmail && await claimUserEmailSend(userDoc.ref, "subscriptionCancellationEmailSent");
            if (shouldSendCancellationEmail) {
              try {
                const appUrl = PRODUCTION_APP_URL;
                const endDate = subscription.current_period_end ? new Date(subscription.current_period_end * 1e3).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) : null;
                await sendTrackedEmail({
                  to: userEmail,
                  subject: "Your DinnerByDesign subscription has been cancelled",
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.55;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">DinnerByDesign</p>
                      <h2 style="color: #111827; margin: 0 0 16px; font-size: 26px; line-height: 1.2;">Your subscription has been cancelled</h2>
                      <p style="margin: 0 0 14px;">This email confirms that your DinnerByDesign subscription has been cancelled.</p>
                      ${endDate ? `<p style="margin: 0 0 14px;">Your paid access is currently scheduled to end on <strong>${endDate}</strong>.</p>` : ""}
                      <p style="margin: 0 0 22px;">Your DinnerByDesign account remains available, and you can return to Settings if you decide to subscribe again later.</p>
                      <div style="margin: 28px 0;">
                        <a href="${appUrl}/?view=settings" style="background-color: #111827; color: #ffffff; padding: 13px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Open Account Settings</a>
                      </div>
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:terence@dinnerbydesign.app" style="color: #111827;">terence@dinnerbydesign.app</a>.</p>
                    </div>
                  `
                }, {
                  type: "subscription_cancelled",
                  source: "stripe_webhook",
                  userId,
                  metadata: {
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscription.id
                  }
                });
                await completeUserEmailSend(userDoc.ref, "subscriptionCancellationEmailSent");
                console.log(`[Webhook] Subscription cancellation email sent to ${userEmail}`);
              } catch (emailErr) {
                await releaseUserEmailSend(userDoc.ref, "subscriptionCancellationEmailSent");
                console.error(`[Webhook] Failed to send subscription cancellation email:`, emailErr);
              }
            }
          } else {
            console.warn(`[Webhook] No user found for customer ID: ${customerId}`);
          }
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object;
          await recordStripeWebhookEvent(event, "processing", {
            customerId: invoice.customer,
            subscriptionId: invoice.subscription,
            invoiceId: invoice.id,
            message: "Invoice paid"
          });
          if (invoice.subscription) {
            const customerId = invoice.customer;
            const userQuery = await getDb().collection("users").where("subscription.stripeCustomerId", "==", customerId).limit(1).get();
            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              if (await hasLiveAuthenticationIdentity(userDoc.id)) {
                await getDb().runTransaction(async (transaction) => {
                  const currentSnapshot = await transaction.get(userDoc.ref);
                  if (!currentSnapshot.exists) return;
                  const currentData = currentSnapshot.data() || {};
                  if (!shouldApplyStripeEvent(currentData.lastStripePaymentEventCreatedAt, event.created)) return;
                  transaction.set(userDoc.ref, {
                    isPremium: true,
                    accessStatus: "paid",
                    subscriptionPaymentFailedEmailLastInvoiceId: null,
                    subscriptionPaymentGraceEndsAt: null,
                    lastStripePaymentEventCreatedAt: event.created || null,
                    lastStripePaymentEventId: event.id || null,
                    updatedAt: import_firestore2.FieldValue.serverTimestamp()
                  }, { merge: true });
                });
              }
            }
          }
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object;
          const customerId = invoice.customer;
          await recordStripeWebhookEvent(event, "processing", {
            customerId,
            subscriptionId: invoice.subscription,
            invoiceId: invoice.id,
            message: "Invoice payment failed"
          });
          const userQuery = await getDb().collection("users").where("subscription.stripeCustomerId", "==", customerId).limit(1).get();
          if (!userQuery.empty) {
            const userDoc = userQuery.docs[0];
            if (!await hasLiveAuthenticationIdentity(userDoc.id)) {
              console.warn(`[Webhook] Skipping payment-failure update for deleted authentication identity ${userDoc.id}`);
              break;
            }
            const userData = userDoc.data();
            const graceEndsAt = import_firestore2.Timestamp.fromMillis(Date.now() + 5 * 24 * 60 * 60 * 1e3);
            console.log(`[Webhook] Payment failed for user ${userDoc.id}`);
            const appliedPaymentFailure = await getDb().runTransaction(async (transaction) => {
              const currentSnapshot = await transaction.get(userDoc.ref);
              if (!currentSnapshot.exists) return false;
              const currentData = currentSnapshot.data() || {};
              if (!shouldApplyStripeEvent(currentData.lastStripePaymentEventCreatedAt, event.created)) return false;
              transaction.set(userDoc.ref, {
                isPremium: true,
                accessStatus: "paid",
                "subscription.subscriptionStatus": "past_due",
                "subscription.accessStatus": "paid",
                "subscription.hasAccess": true,
                subscriptionPaymentGraceEndsAt: graceEndsAt,
                lastStripePaymentEventCreatedAt: event.created || null,
                lastStripePaymentEventId: event.id || null,
                updatedAt: import_firestore2.FieldValue.serverTimestamp()
              }, { merge: true });
              return true;
            });
            if (!appliedPaymentFailure) {
              console.log(`[Webhook] Ignoring older payment event ${event.id || "(unknown)"}`);
              break;
            }
            const userEmail = userData?.email || invoice.customer_email;
            const shouldSendPaymentFailureEmail = userEmail ? await claimUserInvoiceEmailSend(userDoc.ref, invoice.id) : false;
            if (shouldSendPaymentFailureEmail) {
              try {
                const appUrl = PRODUCTION_APP_URL;
                const invoiceUrl = invoice.hosted_invoice_url || null;
                const amountDue = typeof invoice.amount_due === "number" && invoice.currency ? new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: String(invoice.currency).toUpperCase()
                }).format(invoice.amount_due / 100) : null;
                await sendTrackedEmail({
                  to: userEmail,
                  subject: "Action needed: payment failed for your DinnerByDesign subscription",
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.55;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">DinnerByDesign</p>
                      <p style="margin: 0 0 14px;">We couldn't process your payment${amountDue ? ` of <strong>${amountDue}</strong>` : ""}.</p>
                      <p style="margin: 0 0 22px;">Update your payment details within 5 days to avoid losing access to saved recipes, search, and your dinner schedule.</p>
                      <div style="margin: 28px 0;">
                        <a href="${invoiceUrl || `${appUrl}/?view=settings`}" style="background-color: #111827; color: #ffffff; padding: 13px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Update payment details</a>
                      </div>
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:terence@dinnerbydesign.app" style="color: #111827;">terence@dinnerbydesign.app</a>.</p>
                    </div>
                  `
                }, {
                  type: "payment_failed",
                  source: "stripe_webhook",
                  userId: userDoc.id,
                  metadata: {
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: invoice.subscription,
                    stripeInvoiceId: invoice.id,
                    amountDue: invoice.amount_due || null,
                    currency: invoice.currency || null
                  }
                });
                await completeUserInvoiceEmailSend(userDoc.ref, invoice.id);
                console.log(`[Webhook] Payment failed email sent to ${userEmail}`);
              } catch (emailErr) {
                await releaseUserInvoiceEmailSend(userDoc.ref);
                console.error(`[Webhook] Failed to send payment failed email:`, emailErr);
              }
            }
          }
          break;
        }
      }
      await recordStripeWebhookEvent(event, "succeeded", {
        message: "Webhook handled successfully"
      });
      res.json({ received: true });
    } catch (err) {
      console.error(`[Webhook Handler Error] ${err.message}`);
      await recordStripeWebhookEvent(event, "failed", {
        error: err?.message || String(err),
        message: "Webhook handler failed"
      });
      res.status(500).send(`Webhook Handler Error: ${err.message}`);
    }
  });
  app2.post("/api/send-email", async (req, res) => {
    const {
      to,
      subject,
      html,
      from,
      type = "unspecified",
      source = "api",
      userId = null,
      metadata = {}
    } = req.body;
    const hasApiKey = !!process.env.RESEND_API_KEY;
    console.log(`[API] /api/send-email: to=${to}, subject=${subject}, hasKey=${hasApiKey}`);
    try {
      if (!hasApiKey) {
        console.error("[API] RESEND_API_KEY is missing");
        await recordEmailEvent({
          to,
          subject,
          from,
          type,
          source,
          userId,
          metadata,
          status: "failed",
          error: new Error("RESEND_API_KEY is missing")
        });
        return res.status(500).json({
          ok: false,
          error: {
            code: "RESEND_KEY_MISSING",
            message: "Email service is not configured. (RESEND_API_KEY is missing)",
            status: 500
          }
        });
      }
      if (!to || !subject || !html) {
        await recordEmailEvent({
          to,
          subject,
          from,
          type,
          source,
          userId,
          metadata,
          status: "failed",
          error: new Error("Missing 'to', 'subject', or 'html' in body")
        });
        return res.status(400).json({
          ok: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing 'to', 'subject', or 'html' in body",
            status: 400
          }
        });
      }
      const data = await sendEmail({ to, subject, html, from });
      await recordEmailEvent({
        to,
        subject,
        from,
        type,
        source,
        userId,
        metadata,
        status: "sent",
        response: data
      });
      res.json({ ok: true, data });
    } catch (error) {
      const statusCode = error?.status || 500;
      const errorMsg = (error?.message || "").toLowerCase();
      const errorName = (error?.name || error?.error && error?.error.name || "").toLowerCase();
      const isValidationError = errorName.includes("validation") || errorName.includes("restriction") || errorMsg.includes("restricted") || errorMsg.includes("verified") || errorMsg.includes("sandbox") || errorMsg.includes("onboarding");
      if (isValidationError) {
        console.info(`[API] send-email: Resend sandbox/restriction handled (Recipient: ${to}). Simulating success.`);
        await recordEmailEvent({
          to,
          subject,
          from,
          type,
          source,
          userId,
          metadata,
          status: "simulated",
          simulated: true,
          error
        });
        return res.status(200).json(getSimulatedEmailResult());
      }
      console.error("[API] send-email caught unexpected error:", error);
      await recordEmailEvent({
        to,
        subject,
        from,
        type,
        source,
        userId,
        metadata,
        status: "failed",
        error
      });
      res.status(statusCode).json({
        ok: false,
        error: {
          code: error.code || "EMAIL_FAILURE",
          message: isProdEnv ? "Failed to send email" : error.message || "Failed to send email",
          status: statusCode,
          name: error.name || "EMAIL_FAILURE"
        }
      });
    }
  });
  app2.post("/api/notify-new-account", async (req, res) => {
    const authorization = req.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) {
      return res.status(401).json({ ok: false, error: "A signed-in account is required." });
    }
    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.firebase?.sign_in_provider === "anonymous") {
        return res.status(403).json({ ok: false, error: "A registered account is required." });
      }
      const profileRef = getDb().collection("users").doc(decoded.uid);
      const profileSnapshot = await profileRef.get();
      if (!profileSnapshot.exists) {
        return res.status(404).json({ ok: false, error: "The new account profile is not ready yet." });
      }
      const profile = profileSnapshot.data() || {};
      if (profile.newAccountNotificationSentAt) {
        return res.json({ ok: true, alreadySent: true });
      }
      const createdAt = (/* @__PURE__ */ new Date()).toISOString();
      const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">New DinnerByDesign account</h2>
  <p>A new registered account has been created.</p>
  <p>Open the Admin Dashboard to review the account details.</p>
  <p style="color: #666; font-size: 13px;">Created: ${escapeHtml11(createdAt)}</p>
</div>
      `.trim();
      await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: "New DinnerByDesign account created",
        html: emailHtml
      }, {
        type: "new_account_notification",
        source: "auth_context",
        userId: decoded.uid,
        metadata: { event: "account_created" }
      });
      await profileRef.set({ newAccountNotificationSentAt: import_firestore2.FieldValue.serverTimestamp() }, { merge: true });
      return res.json({ ok: true, alreadySent: false });
    } catch (error) {
      console.error("[AccountNotification] Failed to notify owner of new account:", error);
      return res.status(500).json({ ok: false, error: "The owner notification could not be sent." });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    if (!isTrustedContactOrigin(req)) {
      return res.status(403).json({ ok: false, error: "This enquiry could not be sent from this site." });
    }
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const message = String(req.body?.message || "").trim();
    const company = String(req.body?.company || "").trim();
    if (company) {
      return res.status(200).json({ ok: true });
    }
    if (!name || !email || !message || name.length > 120 || email.length > 254 || message.length > 4e3) {
      return res.status(400).json({ ok: false, error: "Please enter your name, email address and message." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }
    if (!hasContactRateLimitCapacity(req)) {
      return res.status(429).json({ ok: false, error: "Please wait a little while before sending another enquiry." });
    }
    const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f2937"><h1 style="margin:0 0 20px;font-size:22px">New DinnerByDesign enquiry</h1><p><strong>Name:</strong> ${escapeHtml11(name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml11(email)}">${escapeHtml11(email)}</a></p><p style="margin:24px 0 8px"><strong>Message:</strong></p><div style="white-space:pre-wrap;line-height:1.6">${escapeHtml11(message)}</div></div>`;
    try {
      const response = await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: `DinnerByDesign enquiry from ${name}`,
        html,
        replyTo: email
      }, {
        type: "contact_enquiry",
        source: "public_contact_form",
        metadata: { name, replyTo: email }
      });
      return res.status(200).json({ ok: true, response });
    } catch (error) {
      console.error("[Contact] Failed to send enquiry:", error);
      return res.status(503).json({ ok: false, error: "We could not send your enquiry just now. Please try again shortly." });
    }
  });
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app2.get("/api/ingredient-prices/refresh", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    const suppliedAuthorization = req.get("authorization") || "";
    if (!cronSecret) {
      return res.json({ ok: true, status: "disabled", reason: "Ingredient-price refresh is not configured." });
    }
    if (suppliedAuthorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ ok: false, error: "Not authorised." });
    }
    const feedUrl = process.env.INGREDIENT_PRICE_FEED_URL;
    const allowedOrigin = process.env.INGREDIENT_PRICE_FEED_ALLOWED_ORIGIN;
    const permissionConfirmed = process.env.INGREDIENT_PRICE_FEED_PERMISSION_CONFIRMED === "true";
    if (!feedUrl || !allowedOrigin || !permissionConfirmed) {
      return res.json({
        ok: true,
        status: "disabled",
        reason: "A licensed ingredient-price feed has not been fully configured."
      });
    }
    let parsedFeedUrl;
    let parsedAllowedOrigin;
    try {
      parsedFeedUrl = new URL(feedUrl);
      parsedAllowedOrigin = new URL(allowedOrigin);
      if (parsedFeedUrl.protocol !== "https:" || parsedAllowedOrigin.protocol !== "https:" || parsedFeedUrl.origin !== parsedAllowedOrigin.origin) {
        throw new Error("Feed URL and allowed origin must use the same HTTPS origin.");
      }
    } catch (error) {
      return res.status(503).json({ ok: false, error: error.message || "The licensed feed configuration is invalid." });
    }
    const runStartedAt = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15e3);
      let response;
      try {
        response = await fetch(parsedFeedUrl, {
          signal: controller.signal,
          headers: process.env.INGREDIENT_PRICE_FEED_TOKEN ? { Authorization: `Bearer ${process.env.INGREDIENT_PRICE_FEED_TOKEN}` } : void 0
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`Licensed price feed returned HTTP ${response.status}.`);
      const items = parseLicensedIngredientPriceFeed(await response.json());
      const db2 = getDb();
      const documentRefs = items.map((item) => db2.collection("ingredientPriceCatalogue").doc(ingredientPriceDocumentId(item.ingredientKey)));
      const currentSnapshots = documentRefs.length ? await db2.getAll(...documentRefs) : [];
      const batch = db2.batch();
      let reviewCount = 0;
      let currentCount = 0;
      items.forEach((item, index) => {
        const reference = documentRefs[index];
        const snapshot = currentSnapshots[index];
        const current = snapshot?.exists ? snapshot.data() : void 0;
        const receivedAt = import_firestore2.FieldValue.serverTimestamp();
        const isPublishedAndUnchanged = current?.active === true && current?.verificationStatus === "verified" && catalogueEntryMatchesFeedItem(current, item);
        if (isPublishedAndUnchanged) {
          currentCount += 1;
          batch.set(reference, {
            aliases: item.aliases,
            verifiedAt: item.observedAt,
            catalogueVersion: item.observedAt.slice(0, 10),
            sourceType: "retailer-verified",
            refreshStatus: "current",
            lastRefreshAttemptAt: receivedAt,
            pendingPriceRefresh: import_firestore2.FieldValue.delete()
          }, { merge: true });
          return;
        }
        reviewCount += 1;
        const baseDocument = current ? {} : {
          ingredientKey: item.ingredientKey,
          aliases: item.aliases,
          productLabel: item.productLabel,
          retailer: item.retailer,
          packPrice: item.packPrice,
          packQuantity: item.packQuantity,
          packUnit: item.packUnit,
          sourceUrl: item.sourceUrl,
          verifiedAt: "",
          verificationStatus: "draft",
          active: false,
          sourceType: "retailer-verified",
          catalogueVersion: "draft"
        };
        batch.set(reference, {
          ...baseDocument,
          refreshStatus: "review",
          lastRefreshAttemptAt: receivedAt,
          pendingPriceRefresh: {
            ...item,
            receivedAt
          }
        }, { merge: true });
      });
      await batch.commit();
      await db2.collection("ingredientPriceRefreshRuns").add({
        status: "completed",
        itemCount: items.length,
        reviewCount,
        currentCount,
        startedAt: runStartedAt,
        completedAt: import_firestore2.FieldValue.serverTimestamp(),
        feedOrigin: parsedFeedUrl.origin
      });
      return res.json({ ok: true, itemCount: items.length, reviewCount, currentCount });
    } catch (error) {
      logApiError("INGREDIENT_PRICE_REFRESH", error);
      try {
        await getDb().collection("ingredientPriceRefreshRuns").add({
          status: "failed",
          startedAt: runStartedAt,
          completedAt: import_firestore2.FieldValue.serverTimestamp(),
          errorMessage: String(error?.message || error).slice(0, 500)
        });
      } catch (logError) {
        console.error("[IngredientPriceRefresh] Failed to record refresh failure:", logError);
      }
      return res.status(502).json({ ok: false, error: "The licensed ingredient-price feed could not be refreshed." });
    }
  });
  app2.post("/api/generate-rationales", async (req, res) => {
    console.log(`[API] Received request for /api/generate-rationales`);
    try {
      const { items, searchParams, preferences } = req.body;
      const result = await generateMatchRationales(items, searchParams, preferences);
      res.json(result);
    } catch (error) {
      console.error("[Server API] Rationale Error:", error);
      let errMsg = error.message || "Internal server error";
      if (errMsg.includes("<!DOCTYPE html>") || errMsg.includes("<html")) {
        errMsg = "Rationale generation is temporarily unavailable. Please try again.";
      }
      const isQuotaErr = error.category === "quota";
      res.status(isQuotaErr ? 429 : 500).json({
        ok: false,
        error: {
          code: isQuotaErr ? "RATIONALE_QUOTA_EXHAUSTED" : "RATIONALE_TEMPORARY_FAILURE",
          message: isQuotaErr ? "Daily limit reached. Please try again tomorrow." : errMsg,
          retryable: true,
          status: isQuotaErr ? 429 : 500
        }
      });
    }
  });
  app2.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD" || !isUnknownPublicArticlePath(req.path)) {
      return next();
    }
    const requestedPath = req.path.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
    res.status(404).type("html").send(`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Page not found \u2014 DinnerByDesign</title></head><body><main><p><a href="/">DinnerByDesign</a></p><h1>Page not found</h1><p>There is no published guide or dinner plan at ${requestedPath}.</p><p><a href="/dinner-plans/5-dinners-for-2-under-40">View the affordable dinner plan</a> or <a href="/food-costs/uk-food-costs-2026">read the UK food-cost guide</a>.</p></main></body></html>`);
  });
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  if (isProd) {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    const indexPath = import_path.default.resolve(distPath, "index.html");
    console.log(`[API] Serving static files from: ${distPath}`);
    app2.use(import_express.default.static(distPath));
    app2.get(/.*/, async (req, res, next) => {
      if (req.url && req.url.startsWith("/api/")) {
        return next();
      }
      try {
        let html = await import_fs.default.promises.readFile(indexPath, "utf8");
        const siteUrl = "https://dinnerbydesign.app";
        let title = "DinnerByDesign | Ad-free UK Dinner Recipe Finder & Costed Shopping Lists";
        let description = "Ad-free UK dinner recipe search: dinner ideas from trusted UK sources, ready-made supermarket options, preference-led search and costed shopping lists.";
        let shareTitle = "DinnerByDesign | UK Dinner Recipe Finder";
        let shareDescription = "Less searching. More relevant dinners. Find verified dinner recipes, ready-made supermarket options and costed shopping lists built around your tastes and budget.";
        let canonicalPath = "/";
        let noIndex = false;
        let schema = null;
        let initialBody = null;
        const pathName = req.path;
        if (pathName === FIVE_DINNERS_FOR_TWO_UNDER_40_PATH) {
          title = FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle;
          description = "Five affordable UK dinners for two under a \xA340 target, with shared ingredients, full-pack checkout estimates and practical substitutions.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = FIVE_DINNERS_FOR_TWO_UNDER_40_PATH;
          schema = getFiveDinnersForTwoJsonLd();
          initialBody = renderFiveDinnersForTwoInitialHtml();
        } else if (pathName === FAMILY_DINNERS_FOR_FOUR_PATH) {
          title = FAMILY_DINNERS_FOR_FOUR.seoTitle;
          description = FAMILY_DINNERS_FOR_FOUR.description;
          shareTitle = title;
          shareDescription = description;
          canonicalPath = FAMILY_DINNERS_FOR_FOUR_PATH;
          schema = getFamilyDinnersForFourJsonLd();
          initialBody = renderFamilyDinnersForFourInitialHtml();
        } else if (pathName === "/why-dinnerbydesign") {
          title = "Why DinnerByDesign? Search, plan and shop in one workflow";
          description = "See how DinnerByDesign extends recipe search with saved preferences, estimated costs, weekly planning and a consolidated shopping list.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/why-dinnerbydesign";
          initialBody = renderPublicSeoInitialHtml("Recipe search is only the first step.", description);
        } else if (pathName === "/privacy") {
          title = "Privacy, Cookies & AI Data \u2014 DinnerByDesign";
          description = "Read how DinnerByDesign handles account data, AI processing, service providers, retention, cookies and UK data-protection rights.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/privacy";
          initialBody = renderPublicSeoInitialHtml("Privacy, cookies and AI data", description);
        } else if (pathName === "/terms") {
          title = "Terms of Service \u2014 DinnerByDesign";
          description = "Review DinnerByDesign service terms, free-trial rules, subscription prices, renewals, cancellation, refunds and account access.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/terms";
          initialBody = renderPublicSeoInitialHtml("Terms of Service", description);
        } else if (pathName === "/pricing-methodology") {
          title = "Ingredient Pricing Methodology \u2014 DinnerByDesign";
          description = "Learn how DinnerByDesign calculates estimated ingredient costs, full-pack checkout costs, catalogue coverage and price fallbacks.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/pricing-methodology";
          initialBody = renderPublicSeoInitialHtml("Ingredient Pricing Methodology", description);
        } else if (pathName === "/food-safety") {
          title = "Dietary, Allergy & Cooking Safety \u2014 DinnerByDesign";
          description = "Understand how DinnerByDesign applies dietary rules and allergy filters, and why labels and safe cooking guidance must still be checked.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/food-safety";
          initialBody = renderPublicSeoInitialHtml("Dietary, Allergy & Cooking Safety", description);
        } else if (pathName === "/recipe-methodology") {
          title = "Recipe & Recommendation Methodology \u2014 DinnerByDesign";
          description = "Learn how DinnerByDesign creates, attributes, checks and selects recipe and ready-made dinner information.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/recipe-methodology";
          initialBody = renderPublicSeoInitialHtml("Recipe & Recommendation Methodology", description);
        } else if (pathName === "/nutrition-methodology") {
          title = "Nutrition Estimate Methodology \u2014 DinnerByDesign";
          description = "Learn how DinnerByDesign nutrition and calorie estimates are produced and why actual values may vary.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/nutrition-methodology";
          initialBody = renderPublicSeoInitialHtml("Nutrition Estimate Methodology", description);
        } else if (pathName === "/planner") {
          title = "Your Dinner Planner \u2014 DinnerByDesign";
          description = "Your weekly bespoke dinner schedule and preparation planner.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/planner";
          noIndex = true;
        } else if (pathName === "/shopping") {
          title = "Your Shopping List \u2014 DinnerByDesign";
          description = "Your smart, interactive shopping and grocery lists automatically grouped by department.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/shopping";
          noIndex = true;
        } else if (pathName === "/settings") {
          title = "Account Settings \u2014 DinnerByDesign";
          description = "Manage your dietary rule taxonomies, allergies, excluded ingredients, and account credentials.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/settings";
          noIndex = true;
        } else if (pathName === "/signin" || pathName === "/success" || pathName === "/admin") {
          title = pathName === "/signin" ? "Sign In / Sign Up \u2014 DinnerByDesign" : pathName === "/success" ? "Subscription Success \u2014 DinnerByDesign" : "Admin Dashboard \u2014 DinnerByDesign";
          description = pathName === "/signin" ? "Access your DinnerByDesign account or create a new profile to start planning your custom menus." : pathName === "/success" ? "Thank you for subscribing to DinnerByDesign Premium! Your account has been upgraded." : "DinnerByDesign Administration and Management.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = pathName;
          noIndex = true;
        } else {
          schema = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "DinnerByDesign",
                "url": "https://dinnerbydesign.app/",
                "description": "DinnerByDesign is an ad-free UK dinner recipe finder for verified dinner ideas, ready-made supermarket options, preference-led search, scheduling and costed shopping lists.",
                "applicationCategory": "FoodAndDrinkApplication",
                "operatingSystem": "Web",
                "alternateName": "DinnerByDesign app",
                "brand": {
                  "@type": "Brand",
                  "name": "DinnerByDesign"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "2.99",
                  "priceCurrency": "GBP",
                  "description": "Monthly access after a seven-day free trial."
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is DinnerByDesign?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "DinnerByDesign is an ad-free UK dinner recipe finder. It helps you search, compare, save, schedule and shop for dinner ideas from one place."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I search by ingredients I already have?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Search from ingredients in your fridge or cupboard, then use preferences to narrow results by diet, budget, time and cooking method."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does it include supermarket ready-made options?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Ready-made mode helps find convenient supermarket options and turns each result into a practical dinner kit with sides and simple upgrades."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does it estimate shopping costs?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Items are grouped so you can work through the list more easily, with ingredients combined across scheduled dinners where the app can scale them sensibly."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can DinnerByDesign plan dinners to a weekly budget?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Choose your number of dinners, household size and weekly budget. DinnerByDesign prioritises suitable lower-cost options and ingredient reuse, then shows the combined estimated dinner cost against your target. Schedule your chosen dinners to generate the shopping list."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is DinnerByDesign a video-based guided cooking app?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No. DinnerByDesign is a search, planning and shopping-list app for dinner ideas. It is not a video-based guided cooking lesson app."
                    }
                  }
                ]
              }
            ]
          };
        }
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        if (html.includes('<meta name="description"')) {
          html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`);
        } else {
          html = html.replace("</head>", `<meta name="description" content="${description}" />
</head>`);
        }
        const canonicalUrl = `${siteUrl}${canonicalPath}`;
        if (html.includes('rel="canonical"')) {
          html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
          html = html.replace("</head>", `<link rel="canonical" href="${canonicalUrl}" />
</head>`);
        }
        const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";
        if (html.includes('<meta name="robots"')) {
          html = html.replace(/<meta name="robots" content=".*?"\s*\/?>/, `<meta name="robots" content="${robotsContent}" />`);
        } else {
          html = html.replace("</head>", `<meta name="robots" content="${robotsContent}" />
</head>`);
        }
        const shareImage = `${siteUrl}/og-image.svg`;
        html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonicalUrl}" />`).replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${shareTitle}" />`).replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${shareDescription}" />`).replace(/<meta property="og:image" content=".*?"\s*\/?>/, `<meta property="og:image" content="${shareImage}" />`).replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${shareTitle}" />`).replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${shareDescription}" />`).replace(/<meta name="twitter:image" content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${shareImage}" />`);
        if (schema) {
          const schemaString = `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(schema)}</script>`;
          html = html.replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, "");
          html = html.replace("</head>", `${schemaString}
</head>`);
        }
        if (initialBody) {
          html = html.replace(/<div id="root">[\s\S]*?<\/div>/, initialBody);
        }
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(html);
      } catch (err) {
        console.error("[API] Prerender failed, sending raw indexPath:", err);
        res.sendFile(indexPath);
      }
    });
  } else {
    let viteMiddleware = null;
    let vitePromise = null;
    app2.use((req, res, next) => {
      if (viteMiddleware) {
        return viteMiddleware(req, res, next);
      }
      if (!vitePromise) {
        console.log(`[API] Lazy-initializing Vite middleware...`);
        const viteModuleName = "vite";
        vitePromise = import(viteModuleName).then(({ createServer: createViteServer }) => {
          return createViteServer({
            root: process.cwd(),
            server: { middlewareMode: true },
            appType: "spa"
          });
        }).then((vite) => {
          viteMiddleware = vite.middlewares;
        }).catch((err) => {
          console.error("[API] Failed to initialize Vite middleware dynamically:", err);
        });
      }
      vitePromise.then(() => {
        if (viteMiddleware) {
          viteMiddleware(req, res, next);
        } else {
          res.status(500).send("Vite server is still starting or failed to start.");
        }
      });
    });
  }
  app2.use((err, _req, res, _next) => {
    console.error("[Global Error Handler Caught]:", err);
    const origin = _req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      ok: false,
      error: {
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: isProd ? "An unexpected error occurred" : err.message || "Unknown error",
        status: statusCode,
        stack: isProd ? void 0 : err.stack
      }
    });
  });
  return app2;
}

// server.cts
import_dotenv.default.config({ path: ".env.local" });
import_dotenv.default.config();
process.on("uncaughtException", (err) => {
  console.error("FATAL UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL UNHANDLED REJECTION at:", promise, "reason:", reason);
});
async function startServer() {
  const PORT = Number(process.env.PORT || 3e3);
  if (!process.env.NODE_ENV) {
    const isCompiled = process.argv[1]?.includes("dist") || false;
    process.env.NODE_ENV = isCompiled ? "production" : "development";
  }
  console.log(`[Server] Booting in ${process.env.NODE_ENV} mode...`);
  const app2 = await createApp();
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app2.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
  return app2;
}
var appPromise = startServer();
var handler = async (req, res) => {
  try {
    const app2 = await appPromise;
    return app2(req, res);
  } catch (err) {
    console.error("[Vercel Handler] Global Error:", err);
    res.status(500).json({ error: "Internal Server Error during boot" });
  }
};
Object.assign(handler, { createApp, default: handler });
module.exports = handler;
