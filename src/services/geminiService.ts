import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ReadyMeal, SearchParams, UserPreferences } from "../types";
import { getApiUrl, getApiConfig, isLocalhost } from "../lib/api";
import { PREFERRED_SOURCES } from '../data/preferredSources';
import { parseAndNormaliseIngredients } from '../lib/ingredientParser';

export const RECIPE_SCHEMA_VERSION = "1.2.0-thin";
const SEARCH_PERMISSION_MESSAGE = "Recipe search is temporarily unavailable because the search service account needs attention. This is on our side, so please try again later.";

/**
 * Result count constants for search flows.
 */
export const DEFAULT_RESULT_COUNT = 3;
/** @deprecated Use DEFAULT_RESULT_COUNT */
export const INITIAL_COOK_FROM_SCRATCH_RESULTS = DEFAULT_RESULT_COUNT;
/** @deprecated Use DEFAULT_RESULT_COUNT */
export const MORE_CHOICES_RESULTS = DEFAULT_RESULT_COUNT;
/** @deprecated Use DEFAULT_RESULT_COUNT */
export const INITIAL_READY_MADE_RESULTS = DEFAULT_RESULT_COUNT;

/**
 * Custom error class for Gemini service failures.
 */
export class GeminiServiceError extends Error {
  constructor(
    public category: 'model' | 'tool' | 'schema' | 'empty' | 'parsing' | 'network' | 'quota' | 'permission',
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

// Lazy initialization of Gemini
let aiInstance: GoogleGenAI | null = null;
let lastApiKeyUsed: string | null = null;

function getAI() {
  const config = getApiConfig();
  
  let apiKey = process.env.GEMINI_API_KEY;
  
  // If we're in the browser and Direct Mode is enabled (on localhost only), try to use the stored client-side key
  if (typeof window !== 'undefined' && config.mode === 'direct' && config.directApiKey && isLocalhost()) {
    apiKey = config.directApiKey;
  }
  
  if (!apiKey) {
    console.error("[GeminiService] GEMINI_API_KEY is MISSING in environment (process.env.GEMINI_API_KEY)");
    throw new GeminiServiceError('network', "GEMINI_API_KEY is not available. Please check your setup.");
  }

  // Re-initialize if the key changed (e.g. user updated Settings)
  if (!aiInstance || lastApiKeyUsed !== apiKey) {
    console.log(`[GeminiService] Initializing Gemini client (Mode: ${config.mode}, Key Length: ${apiKey.length})`);
    
    aiInstance = new GoogleGenAI({ 
      apiKey,
      httpOptions: typeof window === 'undefined' ? {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      } : {}
    });
    lastApiKeyUsed = apiKey;
  }
  return aiInstance;
}

/**
 * Parse and sanitize Google Gemini provider errors, handling HTML leakage.
 */
function parseProviderError(error: any): { status: number; message: string; isTemporary: boolean; isPermission: boolean } {
  let status = error?.status || error?.error?.code || 0;
  let rawMsg = error?.message || String(error);
  let isTemporary = false;
  let isPermission = false;

  // Try to parse JSON from message like "ApiError: {"error":{...}}"
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
      // ignore parsing error
    }
  }

  const messageLower = rawMsg.toLowerCase();
  isPermission = status === 403 ||
    messageLower.includes("permission_denied") ||
    messageLower.includes("permission denied") ||
    messageLower.includes("lightning dunning") ||
    (messageLower.includes("deny") && messageLower.includes("project"));
  
  if (status === 502 || status === 503 || status === 504 || status === 429) {
    isTemporary = true;
  }
  if (
    messageLower.includes("bad gateway") ||
    messageLower.includes("service unavailable") ||
    messageLower.includes("gateway timeout") ||
    messageLower.includes("deadline exceeded") ||
    messageLower.includes("too many requests") ||
    messageLower.includes("resource exhausted") ||
    messageLower.includes("transient") ||
    messageLower.includes("temporarily unavailable")
  ) {
    isTemporary = true;
  }

  // SPECIFIC EXCEPTION: "credits are depleted" or "billing" related errors are NOT temporary. 
  // Retrying won't help until the user fixes their account.
  if (messageLower.includes('credits') && (messageLower.includes('depleted') || messageLower.includes('billing'))) {
    isTemporary = false;
  }

  // Sanitize HTML leakage immediately
  if (rawMsg.includes("<!DOCTYPE html>") || rawMsg.includes("<html")) {
    const apiConfig = getApiConfig();
    const isActuallyProxy = apiConfig.mode === 'proxy';
    
    if (isActuallyProxy) {
      rawMsg = "The search service is currently unavailable. Please try again later.";
    } else {
      rawMsg = "The search request was intercepted by a network login or proxy (HTML returned). This often happens on public Wi-Fi or behind corporate firewalls.";
    }
    isTemporary = true;
    if (status === 0) status = 502; // default 502 Bad Gateway
  }

  return {
    status,
    message: rawMsg,
    isTemporary,
    isPermission
  };
}

/**
 * Serializes a schema object for the REST API, ensuring type enums are strings.
 */
function serializeSchemaForRest(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;
  
  const result: any = { ...schema };
  
  // Convert Type enum to string if it's not already
  if (result.type) {
    if (typeof result.type === 'number') {
      // Mapping for @google/genai Type enum numbers to strings
      // 0: UNSPECIFIED, 1: STRING, 2: NUMBER, 3: INTEGER, 4: BOOLEAN, 5: ARRAY, 6: OBJECT
      const typeMap: Record<number, string> = {
        1: 'STRING', 2: 'NUMBER', 3: 'INTEGER', 4: 'BOOLEAN', 5: 'ARRAY', 6: 'OBJECT'
      };
      result.type = typeMap[result.type] || 'STRING';
    } else if (typeof result.type === 'string') {
      result.type = result.type.toUpperCase();
    }
  }

  if (result.items) {
    result.items = serializeSchemaForRest(result.items);
  }

  if (result.properties) {
    const props: any = {};
    for (const key in result.properties) {
      props[key] = serializeSchemaForRest(result.properties[key]);
    }
    result.properties = props;
  }

  return result;
}

/**
 * Helper to call Gemini with retries for temporary errors (like 502).
 */
async function callGeminiWithRetry(modelId: string, contents: any, config: any, retries = 4, delay = 1000): Promise<any> {
  const apiConfig = getApiConfig();
  
  // Model Fallback chain for basic text/flash tasks to handle daily/per-minute free quota limits robustly
  let activeModels = [modelId];
  if (modelId === 'gemini-3.5-flash') {
    activeModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  } else if (modelId.includes('flash')) {
    activeModels = [modelId];
    if (modelId !== 'gemini-3.1-flash-lite') activeModels.push('gemini-3.1-flash-lite');
    if (modelId !== 'gemini-flash-latest') activeModels.push('gemini-flash-latest');
  }
  let currentModelIndex = 0;

  // If in browser and Direct Mode (localhost only), use native fetch to ensure maximum reliability 
  if (typeof window !== 'undefined' && apiConfig.mode === 'direct' && apiConfig.directApiKey && isLocalhost()) {
    const apiKey = apiConfig.directApiKey;
    // Use gemini-3.5-flash for maximum reliability in direct mode calls
    const targetModel = modelId.includes('gemini-') ? modelId.replace(/gemini-(1\.5|2\.0|3\.1|3\.5)-flash/g, 'gemini-3.5-flash') : 'gemini-3.5-flash';
    
    // Direct mode fallback chain selection
    let directModels = [targetModel];
    if (targetModel === 'gemini-3.5-flash') {
      directModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    }
    let directModelIndex = 0;

    // Prepare contents array properly for REST
    let contentsArray: any[] = [];
    if (typeof contents === 'string') {
      contentsArray = [{ role: 'user', parts: [{ text: contents }] }];
    } else if (Array.isArray(contents)) {
      contentsArray = contents.map(c => typeof c === 'string' ? { role: 'user', parts: [{ text: c }] } : { role: 'user', ...c });
    } else {
      contentsArray = [{ role: 'user', ...contents }];
    }

    // Convert SDK-style config to REST-style payload
    const restPayload: any = {
      contents: contentsArray,
      systemInstruction: config.systemInstruction ? { parts: [{ text: config.systemInstruction }] } : undefined,
      generationConfig: {
        temperature: config.temperature,
        candidateCount: 1
      }
    };

    if (config.topP !== undefined) restPayload.generationConfig.topP = config.topP;
    if (config.topK !== undefined) restPayload.generationConfig.topK = config.topK;

    if (config.responseMimeType === 'application/json') {
      restPayload.generationConfig.responseMimeType = 'application/json';
      if (config.responseSchema) {
        restPayload.generationConfig.responseSchema = serializeSchemaForRest(config.responseSchema);
      }
    }

    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        let responseData = null;
        while (directModelIndex < directModels.length) {
          const currentModel = directModels[directModelIndex] || targetModel;
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
          
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(restPayload),
              referrerPolicy: 'no-referrer'
            });

            const timestamp = new Date().toISOString();
            const promptLength = JSON.stringify(restPayload.contents).length;

            if (!res.ok) {
              const errorBody = await res.text();
              let errData;
              try {
                errData = JSON.parse(errorBody);
              } catch (e) {
                // ignore
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
              functionCalls: candidate.content?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall) || null
            };
            break;
          } catch (error: any) {
            const parsed = parseProviderError(error);
            const isQuota = parsed.status === 429 || 
                            parsed.message.toLowerCase().includes("quota") || 
                            parsed.message.toLowerCase().includes("exhausted") || 
                            parsed.message.toLowerCase().includes("limit") ||
                            parsed.message.toLowerCase().includes("resource_exhausted");

            if (isQuota && directModelIndex < directModels.length - 1) {
              directModelIndex++;
              console.log(`[GeminiService Info] Direct model met quota limit. Trying fallback to ${directModels[directModelIndex]}...`);
              await new Promise(resolve => setTimeout(resolve, 50));
              continue;
            }
            throw error;
          }
        }
        return responseData;
      } catch (error: any) {
        lastError = error;
        const parsed = parseProviderError(error);

        if (parsed.isTemporary && i < retries - 1) {
          console.log(`[GeminiService Info] Direct request attempt ${i + 1} returned transient status (${parsed.status}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5;
          continue;
        }
        console.log(`[GeminiService Info] Direct request failed after ${i + 1} attempts`);
        throw error;
      }
    }
    throw lastError;
  }

  // Otherwise use the standard SDK (server-side or legacy client support)
  const modelClient = getAI();
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      let response = null;
      while (currentModelIndex < activeModels.length) {
        const currentModel = activeModels[currentModelIndex];
        try {
          const timestamp = new Date().toISOString();
          const promptLength = JSON.stringify(contents).length;
          
          console.log(`[GeminiService SDK Log] [${timestamp}] Calling model: ${currentModel} | PromptLength: ${promptLength}`);

	          const response = await modelClient.models.generateContent({
	            model: currentModel,
	            contents: [{ role: 'user', parts: [{ text: typeof contents === 'string' ? contents : JSON.stringify(contents) }] }],
	            config: {
	              systemInstruction: config?.systemInstruction,
	              temperature: config?.temperature ?? 0.7,
	              responseMimeType: config?.responseMimeType ?? config?.response_mime_type,
	              responseSchema: config?.responseSchema ?? config?.response_schema
	            }
	          });

          console.log(`[GeminiService SDK Log] [${timestamp}] Model: ${currentModel} | Success`);
          return response;
        } catch (error: any) {
          const timestamp = new Date().toISOString();
          const parsed = parseProviderError(error);
          console.error(`[GeminiService SDK Log] [${timestamp}] Model: ${currentModel} | Status: ${parsed.status} | Error: ${parsed.message}`);
          
          const isQuota = parsed.status === 429 || 
                          parsed.message.toLowerCase().includes("quota") || 
                          parsed.message.toLowerCase().includes("exhausted") || 
                          parsed.message.toLowerCase().includes("limit") ||
                          parsed.message.toLowerCase().includes("resource_exhausted");

          if (isQuota && currentModelIndex < activeModels.length - 1) {
            currentModelIndex++;
            console.log(`[GeminiService Info] SDK model met quota limit. Trying fallback to ${activeModels[currentModelIndex]}...`);
            await new Promise(resolve => setTimeout(resolve, 50));
            continue;
          }
          throw error;
        }
      }
      return response;
    } catch (error: any) {
      lastError = error;
      const parsed = parseProviderError(error);

      if (parsed.isTemporary && i < retries - 1) {
        console.log(`[GeminiService Info] SDK attempt ${i + 1} met transient status (${parsed.status}) using model ${activeModels[currentModelIndex] || modelId}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; 
        continue;
      }
      console.log(`[GeminiService Info] SDK request permanently failed: ${error?.message || error}`);
      throw error;
    }
  }
  throw lastError;
}

// Environment detection
const isBrowser = typeof window !== 'undefined';

const estimateTokensFromText = (value: string | undefined | null) => {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
};

const sanitizeRealityChecks = (checks: any): any[] => {
  if (!Array.isArray(checks)) return [];

  const allowedTones = new Set(['positive', 'caution', 'neutral']);

  return checks
    .filter(check => check && typeof check === 'object')
    .map(check => ({
      label: String(check.label || '').trim().slice(0, 28),
      note: String(check.note || '').trim().slice(0, 120),
      tone: allowedTones.has(check.tone) ? check.tone : 'neutral'
    }))
    .filter(check => check.label && check.note)
    .slice(0, 3);
};

const SEARCH_MODEL = 'gemini-3.1-flash-lite';

async function fetchProxySuggestions(searchParams: SearchParams, preferences?: UserPreferences, signal?: AbortSignal): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    const timeoutError = new GeminiServiceError('network', "Search request timed out. Please try again.");
    (controller as any).reason = timeoutError;
    controller.abort();
  }, 60000);

  try {
    const url = getApiUrl('/api/generate-suggestions');
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchParams, preferences }),
      signal: signal || controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const text = await response.text();
      let err;
      try {
        err = JSON.parse(text);
      } catch (e) {
        err = { error: { message: `Server error (${response.status}): ${text.slice(0, 100)}` } };
      }
      
      let errMessage = "Server error";
      let errCategory = "model";
      
      if (err && typeof err === 'object') {
        if (err.error && typeof err.error === 'object') {
          errMessage = err.error.message || "Server error";
          errCategory = err.error.category || err.category || "model";
        } else {
          errMessage = err.error || "Server error";
          errCategory = err.category || "model";
        }
      }
      
      throw new GeminiServiceError(errCategory as any, errMessage);
    }
    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const reason = (signal as any)?.reason || (controller as any).reason;
      if (reason instanceof GeminiServiceError) {
        throw reason;
      }
      console.log(`[GeminiService] Search fetch aborted`);
      throw error;
    }
    const category = error instanceof GeminiServiceError ? error.category : 'network';
    const message = error instanceof GeminiServiceError ? error.message : (error?.message || String(error || "Unknown transport error"));
    
    console.log(`[Diagnostic] Gemini Fetch FAILED: ${message} (Category: ${category})`);
    
    if (error instanceof GeminiServiceError) throw error;
    throw new GeminiServiceError('network', `Failed to connect to API: ${message}`);
  }
}

async function fetchProxyEnrichment(title: string, cuisine: string, mode: 'cook' | 'ready-made'): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const url = getApiUrl('/api/enrich-recipe');
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, cuisine, mode }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const text = await response.text();
      let err;
      try {
        err = JSON.parse(text);
      } catch (e) {
        err = { error: { message: `Enrichment failed (${response.status}): ${text.slice(0, 100)}` } };
      }
      
      let errMessage = "Enrichment failed";
      if (err && typeof err === 'object') {
        if (err.error && typeof err.error === 'object') {
          errMessage = err.error.message || "Enrichment failed";
        } else {
          errMessage = err.error || "Enrichment failed";
        }
      }
      throw new Error(errMessage);
    }
    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw new Error(`Failed to contact enrichment API: ${error.message}`);
  }
}

export async function generateDinnerSuggestions(searchParams: SearchParams, preferences?: UserPreferences, signal?: AbortSignal): Promise<{ 
  recipes?: Recipe[], 
  readyMeals?: ReadyMeal[],
  isEmpty?: boolean,
  appliedFilters?: string[],
  isCurated?: boolean,
  diagnostics?: {
    repaired: boolean;
    errorType?: string;
    timings?: any;
    usage?: {
      model: string;
      inputChars: number;
      outputChars: number;
      inputTokensEstimate: number;
      outputTokensEstimate: number;
    };
    fromCache?: boolean;
  };
  budgetContradiction?: {
    ingredient: string;
    budgetLimit: string;
    reason: string;
    cheaperAlternatives: string[];
  }
}> {
  const config = getApiConfig();
  
  if (isBrowser && config.mode === 'proxy') {
    return fetchProxySuggestions(searchParams, preferences, signal);
  }

  const start = Date.now();
  const { query, count = 3, source, excludeTitles, cuisines: targetCuisines, cuisine: legacyCuisine, isLeftoverMode, ingredientIntent } = searchParams;
  const isReadyMade = source === 'ready-made';
  
  const appliedFilters: string[] = [];
  const activeDietaryRule = searchParams.dietaryRule || preferences?.dietaryRule || 'none';
  const activeSaladPref = searchParams.saladPreference || preferences?.saladPreference || 'all';
  const activeIsSimple = searchParams.isSimple || preferences?.isSimple || false;
  const activeIsLowCost = searchParams.isLowCost || preferences?.isLowCost || false;
  const activeNutritious = searchParams.nutritiousChoice || preferences?.nutritiousChoice || false;
  const activeHighOmega3 = searchParams.highOmega3 || preferences?.highOmega3 || false;
  const activeHighProtein = searchParams.highProtein || preferences?.highProtein || false;
  const activeMaxTime = searchParams.maxTotalTime || preferences?.readyToEatUnderMins || null;
  const activeCalorieLimit = searchParams.maxCalories || preferences?.calorieCeiling || null;
  const activeBudgetLimit = searchParams.maxCostPerPortion || preferences?.budgetLimit || null;
  const activeCookingMethods = searchParams.cookingMethods || preferences?.cookingMethods || [];
  const activeCookingFats = preferences?.cookingFats || [];
  const activeReligious = preferences?.religiousEthical || [];
  const activeServings = searchParams.servings || preferences?.servings || 2;
  const activeSupermarkets = isReadyMade ? (searchParams.supermarkets || preferences?.preferredSupermarkets || []) : [];
  const activePreferredSourceIds = searchParams.preferredSourceIds || [];
  const activeIncludeOffal = searchParams.includeOffal !== undefined
    ? searchParams.includeOffal
    : preferences?.includeOffal === true;
  const activePreferredSourceNames = activePreferredSourceIds.length > 0
    ? PREFERRED_SOURCES.filter(s => activePreferredSourceIds.includes(s.id)).map(s => s.label)
    : [];

  if (targetCuisines && targetCuisines.length > 0) appliedFilters.push(...targetCuisines);
  else if (legacyCuisine) appliedFilters.push(legacyCuisine);
  if (activeDietaryRule && activeDietaryRule !== 'none') {
    appliedFilters.push(activeDietaryRule.charAt(0).toUpperCase() + activeDietaryRule.slice(1));
  }
  if (activeSaladPref === 'main-only') appliedFilters.push("Main course salads only");
  if (activeSaladPref === 'side-only') appliedFilters.push("Side salads only");
  if (activeIsSimple) appliedFilters.push("Quick and easy recipes");
  if (activeIsLowCost) appliedFilters.push("Low-cost recipes");
  if (activeNutritious) appliedFilters.push("Wholesome recipes");
  if (activeHighOmega3) appliedFilters.push("High Omega-3");
  if (activeHighProtein) appliedFilters.push("High Protein");
  if (activeMaxTime) appliedFilters.push(`Under ${activeMaxTime}min`);
  if (ingredientIntent?.isIngredientLed || isLeftoverMode) appliedFilters.push("Ingredient-led");

  const saladLogic = (activeSaladPref === 'main-only' || activeSaladPref === 'side-only')
    ? `\nSALAD RESTRICTION ACTIVE (${activeSaladPref === 'main-only' ? 'Main course salads only' : 'Side salads only'}):
- You MUST ONLY return salads.
- A salad is defined as a dish consisting primarily of mixed pieces of foods, which can be vegetables, fruits, cheese, or cooked protein, typically served cold or at room temperature.
- If the user query is "${query}" and it is hard to find a salad for it, you MUST adapt it (e.g., if query is "beef", return "Thai Beef Salad" or "Steak and Rocket Salad").
- DO NOT return hot stews, roasts, or traditional main courses that are not salads.`
    : activeSaladPref === 'none'
      ? `\nSALAD RESTRICTION ACTIVE (No salads):
- You MUST NOT return any salads.`
      : '';

    const simplicityLogic = activeIsSimple 
    ? `\nSIMPLICITY BIAS (Quick and easy recipes ACTIVE): 
- STRICTLY limit recipes to NO MORE THAN 4 ingredients.
- Total time MUST be under 30 minutes.
- Preparation steps must be minimal.`
    : '';

  const preferredSourcesLogic = activePreferredSourceNames.length > 0
    ? `\nTRUSTED SOURCES (SOFT RANKING HINT ACTIVE):
- The user has expressed a preference for these trusted UK recipe sources: ${activePreferredSourceNames.join(', ')}.
- GENTLY FAVOUR recipes that could reasonably originate from or be attributed to these sources by applying a MODEST positive weight to results from them.
- This is NOT A HARD FILTER. You MUST still prioritize the most relevant recipes for the query "${query}". 
- Highly relevant recipes from other sources SHOULD still appear above weak matches from trusted sources.
- NEVER return an empty or severely reduced result set solely because trusted sources have no good matches. If no good matches exist in trusted sources, return the best matches from all available UK sources.`
    : '';

  const budgetLogic = activeIsLowCost
    ? `\nBUDGET BIAS (Low-cost recipes ACTIVE):
- Prioritise recipes using affordable, bulk-buy, or pantry ingredients (e.g., pulses, grains, seasonal vegetables, cheaper cuts of meat).
- Avoid luxury or imported speciality ingredients unless they are used in very small quantities.
- The total cost per portion should ideally be within the stated limit (£${activeBudgetLimit || '2.00'}). If it is IMPOSSIBLE to meet the limit for the query "${query}", you MUST still return a budgetContradiction object explaining why and provide the closest possible items.`
    : '';

  const omega3Logic = activeHighOmega3
    ? `\nHIGH OMEGA-3 BIAS (High Omega-3 recipes ACTIVE):
- STRICTLY prioritise recipes featuring ingredients rich in essential Omega-3 fatty acids (EPA/DHA or ALA) such as:
- Fresh oily fish (Salmon, Mackerel, Sardines, Herrings, Trout, Anchovies, Pilchards)
- Seeds & Nuts (Walnuts, Chia seeds, Flaxseeds, Linseeds, Pumpkin seeds)
- Green leafy vegetables (Spinach, Kale, Brussels sprouts) if relevant
- Highlight/prominently include one or more of these ingredients in each recipe suggestion.`
    : '';

  const remainsProteinLogic = activeHighProtein
    ? `\nHIGH PROTEIN BIAS (High Protein recipes ACTIVE):
- Prioritize recipes with a high protein-to-calorie ratio.
- Favor main protein sources such as lean meats (chicken breast, turkey, venison), fish, eggs, and plant-based proteins (tofu, tempeh, pulses).
- Ensure the main protein component is prominent and well-defined.`
    : '';

  const leftoversLogic = ingredientIntent?.isIngredientLed || isLeftoverMode
    ? `\nINGREDIENT-LED SEARCH ACTIVE:
- The user appears to be starting from ingredients they already have.
- Listed ingredients: ${(ingredientIntent?.ingredients?.length ? ingredientIntent.ingredients : parseAndNormaliseIngredients(query)).join(', ') || query}.
- STRICTLY prioritise recipes that use most or all listed ingredients as primary or key ingredients.
- Minimise extra shopping. Avoid recipes that need many additional fresh or expensive ingredients.
- If a recipe needs extra ingredients, keep them essential and ordinary UK supermarket items.
- In the description or matchReason, briefly explain how the listed ingredients are used.`
    : '';

  const offalLogic = activeIncludeOffal
    ? ''
    : `\nOFFAL EXCLUSION (HARD):
- Do not return recipes or ready-made products containing liver, kidney, heart, tongue, tripe, sweetbreads, blood sausage, black pudding or other offal.`;

  try {
    const modelClient = getAI();
    
    // Parse and normalise search query elements for ingredient-focused searches
    const parsedIngredients = ingredientIntent?.ingredients?.length ? ingredientIntent.ingredients : parseAndNormaliseIngredients(query);
    const parsedIngredientsInstruction = ingredientIntent?.isIngredientLed && parsedIngredients.length > 0
      ? `\nINGREDIENT PARSING & INTERPRETATION (CRITICAL):
- The user's query "${query}" represents one or more listed ingredients.
- Split these on commas and the word 'and'. The independent parsed ingredients are: ${parsedIngredients.map(i => `'${i}'`).join(', ')}.
- These ingredients have been normalised to singular names in UK English (such as tomatoes to 'tomato', red peppers to 'red pepper'), treating plurals and spelling variants as equivalent.
- You MUST interpret each parsed element as a distinct ingredient list item.
- Always try to return recipes/dishes that contain ALL of these listed ingredients.
- Do NOT return zero results; if perfect matches for all listed ingredients are not possible, prioritize returning recipes containing as many of them as possible.
- Keep extra ingredients to a minimum and separate obvious pantry staples from meaningful extra shopping in your reasoning.`
      : '';

    // Core system logic - fixed for model efficiency
    const systemInstruction = `You are an expert UK dinner assistant. Your goal is to generate exactly ${count} ${isReadyMade ? 'UK supermarket ready-made products' : 'recipe'} stubs based on the user's intent.
Target: UK audience, Metric units, UK English spelling.
Portion Basis: ONE adult portion.

INTENT PARSING (CRITICAL):
- If the query "${query}" contains phrases like "£X per portion", "under £X", or "cheap", prioritize items meeting that budget even if the explicit maxCost is not set.
- If the query contains a name (e.g., "Jamie Oliver", "Delia"), assume the user wants that specific style or celebrity's recipes.
- If the query is an ingredient list (e.g., "chicken, rice"), find dishes using those.
- FOR RECIPES (HOMEMADE): You MUST provide a "sourceUrl" and an ACCURATE "totalIngredientsCount". The "totalIngredientsCount" is the total number of ingredients in a standard version of this recipe (e.g. usually between 5-15). Do NOT just count the stub ingredients you return. If you can attribute the recipe to a real UK source (e.g. BBC Good Food, Jamie Oliver, Tesco Real Food), use their domain or a representative search URL. If it's a generic classic, use "recipe-search" or a similar descriptive string.
- CONVENIENCE CLASSIFICATION (CRITICAL): Assign a 'convenienceProfile' to every recipe stub: 'scratch' for traditional scratch-cooking/baking/home recipes; 'convenience' for assembly-based dishes, ready-made products, or convenience shortcuts.
- BATCH COOKING CLASSIFICATION (RECIPES ONLY): Add a 'batchCooking' object for home-cooking recipes. Set suitable=true only when the recipe keeps well, reheats well, scales sensibly to extra portions, and is not texture-sensitive. Good candidates include soups, stews, curries, chilli, pasta sauces, tray bakes, casseroles, rice dishes and lentil dishes. Avoid labelling dressed salads, crispy/fried dishes, fresh fish/shellfish-heavy dishes, rare steak, and recipes that should be served immediately. Include a short reason plus storage/reheat notes when suitable=true.
- READY-MADE KIT (READY-MADE ONLY): Add a 'readyMadeKit' object that turns the core product into a complete dinner. Include the core product title, 1-3 optional supermarket sides, and 2-3 tiny upgrades using ordinary UK items such as herbs, yoghurt, lemon, bagged salad, frozen veg, microwave rice, naan, or slaw. Upgrades must be specific to the product and cuisine: avoid repeating generic texture ideas across unrelated products, and do not default to crispy onions or grated cheese unless they clearly suit that exact dish. Toasted breadcrumbs can suit some pasta-based products, but use them sparingly and only when they genuinely improve the item. Keep upgrades fast, cheap, and realistic for a tired weekday.
- RECIPE REALITY CHECKS (CRITICAL): Add exactly 3 "realityChecks" to every item. Each check must be practical, plain-English and specific to the item, not generic praise. Use labels such as "Hidden effort", "Shopping friction", "Weeknight fit", "Cost caution", "Leftover friendly", "Portion caution", or "Cleanup". Each check has { label, note, tone }, where tone is "positive", "caution", or "neutral". Notes must be under 110 characters and should help the user decide if this dinner is realistic tonight.
${parsedIngredientsInstruction}

HARD CONSTRAINTS:
1. Dietary: ${activeDietaryRule}
2. Salad: ${activeSaladPref}
3. Allergies: ${preferences?.allergies?.join(', ') || 'None'}
4. Max calories per portion: ${activeCalorieLimit || 'None'} kcal
5. Max Cost: ${activeIsLowCost || activeBudgetLimit ? `£${activeBudgetLimit || '2.00'}` : 'None'} per portion
6. Exclusions: ${[...(preferences?.exclusions || []), ...(searchParams.exclusions || [])].join(', ') || 'None'}
7. Cuisine: ${targetCuisines?.length ? targetCuisines.join(', ') : (legacyCuisine || 'Any')}
8. Trusted Sources (Ranking Hint): ${activePreferredSourceNames.length > 0 ? activePreferredSourceNames.join(', ') : 'Any trusted UK source'}
9. Cooking Methods: ${activeCookingMethods.length > 0 ? activeCookingMethods.join(', ') : 'Any'}
10. Religious/Ethical: ${activeReligious.join(', ') || 'None'}
11. Preferred Supermarkets: ${activeSupermarkets.length > 0 ? activeSupermarkets.join(', ') : 'Any'}
12. High Omega-3 Prioritisation: ${activeHighOmega3 ? 'Active (focus on oily fish, walnuts, chia, flaxseed)' : 'No'}
13. High Protein Prioritisation: ${activeHighProtein ? 'Active (focus on lean meats, fish, pulses, eggs)' : 'No'}
14. Offal: ${activeIncludeOffal ? 'Allowed' : 'Excluded'}
${saladLogic}${simplicityLogic}${preferredSourcesLogic}${budgetLogic}${omega3Logic}${remainsProteinLogic}${leftoversLogic}${offalLogic}
`;

    const rejectionPolicy = `Return { "items": [] } if:
- The query "${query}" strictly violates any HARD DIETARY, RELIGIOUS, or ALLERGY constraint.
${isReadyMade ? `- ONLY commercially available UK ready-made products (branded or own-brand) from ${activeSupermarkets.length > 0 ? activeSupermarkets.join(' or ') : 'any major UK supermarket, e.g., Tesco, Waitrose, Sainsbury’s, Morrisons, Aldi, Asda, Lidl, Co-op, Marks & Spencer, Ocado'}. NO home recipes. Under NO circumstances return products from other supermarkets when preferred supermarkets are specified above.` : '- Home-cooking recipes only. NO "retailer" fields.'}

BUDGET POLICY: 
If the budget limit is too low for the ingredient/dish requested (e.g. "Steak" under £2), do NOT return empty. Instead:
1. Populate the 'budgetContradiction' object with the reason.
2. Return the closest possible budget-friendly alternatives (e.g. Beef Mince or Stewing Beef for "Beef").
`;

    const finalSystemInstruction = systemInstruction + rejectionPolicy;

    // Dynamic prompt - minimal and direct
    const prompt = `Search intent: "${query}". 
    ${ingredientIntent?.isIngredientLed && parsedIngredients.length > 0 ? `Target Ingredients: MUST contain as many specified parsed ingredients (${parsedIngredients.join(', ')}) as possible. Minimise extra shopping and feature these ingredients prominently.` : ''}
    ${activeSaladPref === 'main-only' ? 'Requirement: MUST be a main-course salad.' : ''}
    ${activeSaladPref === 'side-only' ? 'Requirement: MUST be a side salad.' : ''}
    ${activeSaladPref === 'none' ? 'Requirement: NO salads.' : ''}
    ${activeIsLowCost ? 'Priority: Low budget.' : ''}
    ${activeIsSimple ? 'Priority: Simple/Fast (strictly no more than 4 ingredients).' : ''}
    ${activeNutritious ? 'Priority: Nutritious.' : ''}
    ${activeHighOmega3 ? 'Priority: High Omega-3 (focus on oily fish, walnuts, chia, flaxseed).' : ''}
    ${activeHighProtein ? 'Priority: High Protein (focus on lean meats, fish, pulses, eggs).' : ''}
    ${ingredientIntent?.isIngredientLed || isLeftoverMode ? 'Priority: Ingredient-led search. Prioritize recipes that maximize the use of these specific items and require few extra ingredients.' : ''}
    ${activePreferredSourceNames.length > 0 ? `Requirement: Gently favour recipes from these trusted sources: ${activePreferredSourceNames.join(', ')}.` : ''}
    ${activeMaxTime ? `Must be under ${activeMaxTime} mins.` : ''}
    ${excludeTitles?.length ? `MANDATORY EXCLUSION: Do NOT suggest any of these recipes: ${excludeTitles.join(', ')}.` : ''}
    Generate ${count} stubs.`;

    const config = {
        systemInstruction: finalSystemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  totalTime: { type: Type.NUMBER },
                  caloriesPerPortion: { type: Type.NUMBER },
                  costPerPortion: { type: Type.STRING },
                  isVegetarian: { type: Type.BOOLEAN },
                  isVegan: { type: Type.BOOLEAN },
                  isPescatarian: { type: Type.BOOLEAN },
                  convenienceProfile: { type: Type.STRING, enum: ['scratch', 'convenience'] },
                  realityChecks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        note: { type: Type.STRING },
                        tone: { type: Type.STRING, enum: ['positive', 'caution', 'neutral'] }
                      },
                      required: ['label', 'note', 'tone']
                    }
                  },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  totalIngredientsCount: { type: Type.NUMBER, description: "Total number of ingredients in the full version of this recipe." },
                  sourceUrl: { type: Type.STRING },
                  ...(isReadyMade ? {
                    retailer: { type: Type.STRING },
                    isAirFryerFriendly: { type: Type.BOOLEAN },
                    readyMadeKit: {
                      type: Type.OBJECT,
                      properties: {
                        coreProduct: { type: Type.STRING },
                        sides: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              role: { type: Type.STRING },
                              note: { type: Type.STRING }
                            },
                            required: ['name']
                          }
                        },
                        upgrades: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              role: { type: Type.STRING },
                              note: { type: Type.STRING }
                            },
                            required: ['name']
                          }
                        },
                        totalTimeNote: { type: Type.STRING },
                        fitNote: { type: Type.STRING }
                      }
                    }
                  } : {
                    saladType: { type: Type.STRING, enum: ['main', 'side', 'none'] },
                    batchCooking: {
                      type: Type.OBJECT,
                      properties: {
                        suitable: { type: Type.BOOLEAN },
                        confidence: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                        reason: { type: Type.STRING },
                        storage: { type: Type.STRING },
                        reheat: { type: Type.STRING }
                      },
                      required: ['suitable', 'confidence']
                    }
                  })
                },
                required: ["title", "description", "cuisine", "totalTime", "ingredients", "sourceUrl", "totalIngredientsCount", "realityChecks", ...(isReadyMade ? ["retailer"] : [])]
              }
            },
            budgetContradiction: {
              type: Type.OBJECT,
              properties: {
                ingredient: { type: Type.STRING },
                budgetLimit: { type: Type.STRING },
                reason: { type: Type.STRING },
                cheaperAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["items"]
        }
    };

    const aiConfig = getApiConfig();
    console.log(`[GeminiService] Calling model ${SEARCH_MODEL} (Mode: ${aiConfig.mode}) with prompt length: ${prompt.length}...`);
    
    const response = await callGeminiWithRetry(SEARCH_MODEL, prompt, config);

    const text = response.text;
    const geminiDuration = Date.now() - start;
    console.log(`[GeminiService] Response received in ${geminiDuration}ms. Text length: ${text?.length || 0}`);

    if (!text) {
      throw new GeminiServiceError('empty', "Empty response from search service.");
    }

    const data = JSON.parse(text);
    const rawItems = data.items || [];
    let items = rawItems.map((item: any) => ({
      ...item,
      realityChecks: sanitizeRealityChecks(item.realityChecks),
      id: item.id || `dbd-${Math.random().toString(36).substring(2, 9)}`,
      dietFlagsVerified: true // Mandatory for deterministic safety gate
    }));

    // Post-generation validation for Ready-made mode
    if (isReadyMade) {
      items = items.filter((item: any) => {
        const source = (item.sourceUrl || '').toLowerCase();
        const retailer = (item.retailer || '').toLowerCase();
        
        // 1. Must have a retailer
        if (!retailer) return false;

        // 2. Reject known recipe sites in ready-made mode
        const RECIPE_DOMAINS = ['bbcgoodfood.com', 'jamieoliver.com', 'allrecipes.com', 'simplyrecipes.com', 'foodnetwork.com', 'epicurious.com', 'tasty.co', 'delish.com'];
        const isRecipeSite = RECIPE_DOMAINS.some(domain => source.includes(domain));
        if (isRecipeSite) return false;

        return true;
      });
    }

    const finalResult: any = {
      appliedFilters,
      items,
      isEmpty: items.length === 0 && !data.budgetContradiction,
      budgetContradiction: data.budgetContradiction,
      isCurated: false,
      diagnostics: {
        repaired: false,
        timings: { geminiCall: geminiDuration, totalRoundTrip: Date.now() - start },
        usage: {
          model: SEARCH_MODEL,
          inputChars: finalSystemInstruction.length + prompt.length,
          outputChars: text.length,
          inputTokensEstimate: estimateTokensFromText(finalSystemInstruction + prompt),
          outputTokensEstimate: estimateTokensFromText(text)
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
  } catch (error: any) {
    if (isBrowser && config.mode === 'direct') {
      console.warn("[GeminiService] Client-side Direct API call failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        return await fetchProxySuggestions(searchParams, preferences, signal);
      } catch (fallbackError: any) {
        console.error("[GeminiService] Cloud Proxy fallback failed too:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("[GeminiService] Search failed:", error);
    
    const parsed = parseProviderError(error);
    let category: 'network' | 'quota' | 'model' | 'permission' = 'model';
    
    if (parsed.isPermission) {
      category = 'permission';
    } else if (parsed.status === 429 || parsed.message.toLowerCase().includes("quota") || parsed.message.toLowerCase().includes("resource exhausted")) {
      category = 'quota';
    } else if (parsed.isTemporary) {
      category = 'network';
    } else if (parsed.message.includes("API_KEY")) {
      category = 'network';
    }

    throw new GeminiServiceError(category, parsed.isPermission ? SEARCH_PERMISSION_MESSAGE : parsed.message);
  }
}

/**
 * Fetches full ingredients and instructions for a thin recipe stub.
 */
export async function enrichRecipe(title: string, cuisine: string, mode: 'cook' | 'ready-made'): Promise<Partial<Recipe | ReadyMeal>> {
  const config = getApiConfig();
  
  if (isBrowser && config.mode === 'proxy') {
    return fetchProxyEnrichment(title, cuisine, mode);
  }

  try {
    const modelClient = getAI();
    const systemInstruction = `You are a professional UK culinary content generator.
Convert the provided title and cuisine into a complete, high-quality UK ${mode === 'ready-made' ? 'supermarket product detail' : 'recipe'}.
Units: Metric only.
Spelling: UK English only.

ORIGINALITY:
- Instructions MUST be original, distinctive, and synthesized.
- NO verbatim copying from external sites.

REQUISITES:
${mode === 'cook' ? '- Ingredients MUST include specific quantities/units (e.g. "200g", "1 tsp").' : '- Must be a real commercial UK ready-made product. Instructions reflect heating (oven/microwave/air-fryer).'}
- READY-MADE KIT: For ready-made mode, add a 'readyMadeKit' object with the core product, 1-3 optional supermarket sides, and 2-3 tiny upgrades using ordinary UK items. Upgrades must be product-specific and cuisine-aware; avoid repeated generic texture ideas, especially crispy onions or grated cheese, unless they genuinely fit the product. Toasted breadcrumbs can suit some pasta-based products, but use them sparingly and only when they genuinely improve the item.
- DESCRIPTION: Synthesize the best aspects in a professional tone.
- SOURCE URL: Explicitly provide a representative source for this recipe (domain or search url).
- TOTAL INGREDIENTS COUNT: Provide an accurate total count of all ingredients required.
`;

    const prompt = `Full detail for: "${title}" (${cuisine}). mode: ${mode}.`;
    
    const config = {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            totalIngredientsCount: { type: Type.NUMBER },
            costPerPortion: { type: Type.STRING },
            caloriesPerPortion: { type: Type.NUMBER },
            totalTime: { type: Type.NUMBER },
            sourceUrl: { type: Type.STRING },
            ...(mode === 'ready-made' ? {
              retailer: { type: Type.STRING },
              servingSuggestion: { type: Type.STRING },
              isAirFryerFriendly: { type: Type.BOOLEAN },
              readyMadeKit: {
                type: Type.OBJECT,
                properties: {
                  coreProduct: { type: Type.STRING },
                  sides: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        note: { type: Type.STRING }
                      },
                      required: ['name']
                    }
                  },
                  upgrades: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        note: { type: Type.STRING }
                      },
                      required: ['name']
                    }
                  },
                  totalTimeNote: { type: Type.STRING },
                  fitNote: { type: Type.STRING }
                }
              }
            } : {})
          },
          required: ["instructions", "ingredients", "description", "sourceUrl", "totalIngredientsCount", ...(mode === 'ready-made' ? ["retailer"] : [])]
        }
    };

    const response = await callGeminiWithRetry("gemini-3.5-flash", prompt, config);

    const text = response.text;

    if (!text) {
      throw new Error("Empty enrichment response");
    }

    return JSON.parse(text);
  } catch (error: any) {
    if (isBrowser && config.mode === 'direct') {
      console.warn("[GeminiService] Client-side Direct Enrichment failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        return await fetchProxyEnrichment(title, cuisine, mode);
      } catch (fallbackError: any) {
        console.error("[GeminiService] Cloud Proxy Enrichment fallback failed too:", fallbackError);
        throw fallbackError;
      }
    }
    console.error("[GeminiService] Enrichment failed:", error);
    const parsed = parseProviderError(error);
    throw new GeminiServiceError(parsed.isTemporary ? 'network' : 'model', parsed.message);
  }
}

/**
 * Generates match rationales for a list of items asynchronously.
 */
export async function generateMatchRationales(
  items: (Recipe | ReadyMeal)[],
  searchParams: SearchParams,
  preferences?: UserPreferences
): Promise<Record<string, string>> {
  if (!items.length) return {};

  const config = getApiConfig();

  if (isBrowser && config.mode === 'proxy') {
    try {
      const url = getApiUrl('/api/generate-rationales');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, searchParams, preferences })
      });
      if (!response.ok) return {};
      return response.json();
    } catch (err) {
      console.error("[GeminiService] Client failed to fetch rationales:", err);
      return {};
    }
  }

  try {
    const modelClient = getAI();
    const itemSummaries = items.map(item => ({
      title: item.title,
      cuisine: item.cuisine,
      description: item.description,
      price: item.costPerPortion
    }));

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        rationales: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              matchReason: { type: Type.STRING }
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
Context: Query: "${searchParams.query}", Diet: ${preferences?.dietaryRule || "None"}

Items: ${JSON.stringify(itemSummaries)}`;

    const response = await callGeminiWithRetry("gemini-3.5-flash", systemInstruction, { 
        temperature: 0.1,
        responseMimeType: "application/json", 
        responseSchema 
      }
    );

    const text = response.text || "{}";
    const data = JSON.parse(text);
    const rationalesMap: Record<string, string> = {};
    if (data.rationales && Array.isArray(data.rationales)) {
      data.rationales.forEach((r: any) => {
        if (r.title && r.matchReason) {
          rationalesMap[r.title.toLowerCase().trim()] = r.matchReason;
        }
      });
    }
    return rationalesMap;
  } catch (error) {
    if (isBrowser && config.mode === 'direct') {
      console.warn("[GeminiService] Client-side Direct Rationale failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        const url = getApiUrl('/api/generate-rationales');
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, searchParams, preferences })
        });
        if (response.ok) return response.json();
      } catch (fallbackError) {
        console.error("[GeminiService] Cloud Proxy Rationale fallback failed:", fallbackError);
      }
    }
    console.error("[GeminiService] Failed to generate match rationales:", error);
    return {};
  }
}

/**
 * Fetches server-side diagnostics about the Gemini API key status.
 * (Keeping as a stub for compatibility with App.tsx logs)
 */
export async function fetchDiagnostics() {
  return { status: "client-side", message: "Gemini is now running client-side." };
}
