import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ReadyMeal, SearchParams, UserPreferences } from "../types";
import { getApiUrl, getApiConfig, isLocalhost } from "../lib/api";
import { PREFERRED_SOURCES } from '../data/preferredSources';
import { detectIngredientIntent, matchesRequestedIngredientSearch, matchesStrictIngredientSearch, parseAndNormaliseIngredients } from '../lib/ingredientParser';
import { dietaryRuleAllowsOffal } from '../lib/offalPreference';
import { filterCookingFatsForDiet } from '../lib/preferenceCompatibility';
import { buildEnrichmentRequestBody, type EnrichmentRequestOptions } from '../lib/enrichmentRequest';
import { canonicaliseGroundedUrl, isApprovedDirectRecipeUrl, reconcileGroundedSourceUrl, type GroundedSource } from '../lib/groundingUtils';
import { parseModelJson } from '../lib/parseModelJson';
import { ACTIVE_GEMINI_MODEL, ENRICHMENT_GEMINI_MODEL } from '../config/aiModel';
import { auth, signInAnon } from '../firebase';
import { COOKING_METHOD_ALIASES } from '../constants';

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

const BROAD_CHILLI_FALLBACKS = [
  {
    title: 'Quick beef chilli con carne',
    description: 'A fast beef mince and kidney bean chilli with tomatoes, onion and warming spices.',
    cuisine: 'Mexican-inspired',
    totalTime: 25,
    caloriesPerPortion: 450,
    costPerPortion: '£1.80 pp',
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: 'scratch',
    ingredients: ['Beef mince', 'Kidney beans', 'Chopped tomatoes', 'Chilli powder'],
    totalIngredientsCount: 8,
    sourceUrl: 'https://www.bbcgoodfood.com/search?q=chilli%20con%20carne',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'high', reason: 'Keeps and reheats well for another dinner.', storage: 'Cool promptly and refrigerate for up to 2 days.', reheat: 'Reheat until piping hot throughout.' },
    realityChecks: [
      { label: 'Weeknight fit', note: 'Uses a short simmer for a faster version of the classic.', tone: 'positive' },
      { label: 'Shopping friction', note: 'Uses ordinary mince, beans and tinned tomatoes.', tone: 'positive' },
      { label: 'Leftover friendly', note: 'Usually reheats well and can be frozen.', tone: 'positive' }
    ]
  },
  {
    title: 'Turkey and black bean chilli',
    description: 'A lean turkey mince chilli with black beans, tomatoes and smoky seasoning.',
    cuisine: 'Mexican-inspired',
    totalTime: 25,
    caloriesPerPortion: 380,
    costPerPortion: '£1.80 pp',
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: 'scratch',
    ingredients: ['Turkey mince', 'Black beans', 'Chopped tomatoes', 'Smoked paprika'],
    totalIngredientsCount: 8,
    sourceUrl: 'https://www.tescorealfood.com/search?query=turkey%20chilli',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'medium', reason: 'The sauce keeps turkey mince from drying out too much.', storage: 'Cool promptly and refrigerate for up to 2 days.', reheat: 'Reheat with a splash of water until piping hot.' },
    realityChecks: [
      { label: 'Weeknight fit', note: 'Turkey cooks quickly, so this suits a busy evening.', tone: 'positive' },
      { label: 'Cost caution', note: 'Turkey mince varies by shop, so check the shelf price.', tone: 'neutral' },
      { label: 'Cleanup', note: 'One-pan cooking keeps washing up low.', tone: 'positive' }
    ]
  },
  {
    title: 'No-bean beef chilli',
    description: 'A quick beef chilli with tomatoes, onion, peppers and smoky spices, without beans.',
    cuisine: 'Mexican-inspired',
    totalTime: 20,
    caloriesPerPortion: 430,
    costPerPortion: '£1.85 pp',
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: 'scratch',
    ingredients: ['Beef mince', 'Chopped tomatoes', 'Onion', 'Pepper', 'Chilli powder'],
    totalIngredientsCount: 8,
    sourceUrl: 'recipe-search',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'high', reason: 'A tomato-based chilli reheats well.', storage: 'Cool promptly and refrigerate for up to 2 days.', reheat: 'Reheat until piping hot throughout.' },
    realityChecks: [
      { label: 'Weeknight fit', note: 'A short simmer keeps this within a fast evening window.', tone: 'positive' },
      { label: 'Shopping friction', note: 'Uses ordinary mince, tinned tomatoes and peppers.', tone: 'positive' },
      { label: 'Leftover friendly', note: 'The sauce usually tastes better after resting.', tone: 'positive' }
    ]
  },
  {
    title: 'Turkey and sweetcorn chilli',
    description: 'A quick turkey chilli with sweetcorn, tomatoes and mild chilli spice.',
    cuisine: 'Mexican-inspired',
    totalTime: 15,
    caloriesPerPortion: 380,
    costPerPortion: '£1.55 pp',
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: 'scratch',
    ingredients: ['Turkey mince', 'Sweetcorn', 'Chopped tomatoes', 'Chilli powder'],
    totalIngredientsCount: 7,
    sourceUrl: 'recipe-search',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'medium', reason: 'The sauce helps turkey mince reheat without drying out.', storage: 'Cool promptly and refrigerate for up to 2 days.', reheat: 'Reheat gently with a splash of water until piping hot.' },
    realityChecks: [
      { label: 'Weeknight fit', note: 'Turkey mince cooks quickly, so this is the fastest option.', tone: 'positive' },
      { label: 'Cost caution', note: 'Turkey mince prices vary, but sweetcorn helps stretch it.', tone: 'neutral' },
      { label: 'Cleanup', note: 'One-pan cooking keeps washing up low.', tone: 'positive' }
    ]
  },
  {
    title: 'Chicken and bean chilli',
    description: 'A lighter chilli with chicken, beans, tomatoes and smoky spices.',
    cuisine: 'Mexican-inspired',
    totalTime: 30,
    caloriesPerPortion: 490,
    costPerPortion: '£1.95 pp',
    isVegetarian: false,
    isVegan: false,
    isPescatarian: false,
    convenienceProfile: 'scratch',
    ingredients: ['Chicken thigh', 'Cannellini beans', 'Chopped tomatoes', 'Onion', 'Smoked paprika'],
    totalIngredientsCount: 9,
    sourceUrl: 'https://www.jamieoliver.com/search/?s=chicken%20chilli',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'high', reason: 'The sauce and chicken reheat well.', storage: 'Cool promptly and refrigerate for up to 2 days.', reheat: 'Reheat until piping hot throughout.' },
    realityChecks: [
      { label: 'Weeknight fit', note: 'A straightforward one-pan dinner with moderate simmering time.', tone: 'positive' },
      { label: 'Cost caution', note: 'Chicken thigh is usually better value than breast.', tone: 'neutral' },
      { label: 'Leftover friendly', note: 'Works well as a second dinner if chilled promptly.', tone: 'positive' }
    ]
  },
  {
    title: 'Three-bean vegetarian chilli',
    description: 'A quick vegetarian chilli with mixed beans, tomatoes and warm spices.',
    cuisine: 'Mexican-inspired',
    totalTime: 20,
    caloriesPerPortion: 360,
    costPerPortion: '£1.10 pp',
    isVegetarian: true,
    isVegan: true,
    isPescatarian: true,
    convenienceProfile: 'scratch',
    ingredients: ['Mixed beans', 'Chopped tomatoes', 'Onion', 'Smoked paprika'],
    totalIngredientsCount: 8,
    sourceUrl: 'https://www.bbcgoodfood.com/search?q=three%20bean%20chilli',
    saladType: 'none',
    batchCooking: { suitable: true, confidence: 'high', reason: 'Bean chilli keeps its texture and reheats evenly.', storage: 'Cool promptly and refrigerate for up to 3 days.', reheat: 'Reheat until bubbling and piping hot.' },
    realityChecks: [
      { label: 'Shopping friction', note: 'Mostly store-cupboard tins and spices.', tone: 'positive' },
      { label: 'Weeknight fit', note: 'Very quick once the onion is chopped.', tone: 'positive' },
      { label: 'Portion caution', note: 'Beans are filling, especially with rice or wraps.', tone: 'neutral' }
    ]
  }
];

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
    activeModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  } else if (modelId.includes('flash')) {
    activeModels = [modelId];
    if (modelId !== 'gemini-3.1-flash-lite') activeModels.push('gemini-3.1-flash-lite');
    if (modelId !== 'gemini-flash-latest') activeModels.push('gemini-flash-latest');
  }
  let currentModelIndex = 0;

  // If in browser and Direct Mode (localhost only), use native fetch to ensure maximum reliability 
  if (typeof window !== 'undefined' && apiConfig.mode === 'direct' && apiConfig.directApiKey && isLocalhost()) {
    const apiKey = apiConfig.directApiKey;
    const targetModel = modelId;
    
    // Direct mode fallback chain selection
    let directModels = [targetModel];
    if (targetModel === 'gemini-3.5-flash') {
      directModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    } else if (targetModel === 'gemini-3.5-flash-lite') {
      directModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
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
    if (config.googleSearch) {
      restPayload.tools = [{ google_search: {} }];
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
              functionCalls: candidate.content?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall) || null,
              groundingMetadata: candidate.groundingMetadata || null
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
              responseSchema: config?.responseSchema ?? config?.response_schema,
              ...(config?.googleSearch ? { tools: [{ googleSearch: {} }] } : {})
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

const withRequestTimeout = async <T>(request: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const getGroundedSources = (response: any): GroundedSource[] => {
  const metadata = response?.groundingMetadata || response?.candidates?.[0]?.groundingMetadata;
  const chunks = Array.isArray(metadata?.groundingChunks) ? metadata.groundingChunks : [];
  const seen = new Set<string>();

  return chunks.flatMap((chunk: any) => {
    const url = canonicaliseGroundedUrl(chunk?.web?.uri || chunk?.web?.url);
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ url, title: typeof chunk?.web?.title === 'string' ? chunk.web.title : undefined }];
  });
};

const filterToGroundedSources = (items: any[], sources: Map<string, GroundedSource>): any[] => (
  items.filter(item => {
    if (sources.size === 0) {
      const sourceUrl = canonicaliseGroundedUrl(item?.sourceUrl);
      if (!sourceUrl || !isApprovedDirectRecipeUrl(sourceUrl)) return false;
      item.sourceUrl = sourceUrl;
      return true;
    }

    const groundedSourceUrl = reconcileGroundedSourceUrl(item?.sourceUrl, [...sources.values()]);
    if (!groundedSourceUrl) return false;
    item.sourceUrl = groundedSourceUrl;
    return true;
  })
);

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

const SEARCH_MODEL = ACTIVE_GEMINI_MODEL;

async function getSearchAuthToken(): Promise<string> {
  const currentUser = auth.currentUser || (await signInAnon()).user;
  return currentUser.getIdToken();
}

async function fetchProxySuggestions(searchParams: SearchParams, preferences?: UserPreferences, signal?: AbortSignal): Promise<any> {
  const controller = new AbortController();
  const externalAbortHandler = () => controller.abort(signal?.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener('abort', externalAbortHandler, { once: true });
  }
  const timeoutId = setTimeout(() => {
    const timeoutError = new GeminiServiceError('network', "Search request timed out. Please try again.");
    (controller as any).reason = timeoutError;
    controller.abort(timeoutError);
  }, 60000);

  try {
    const url = getApiUrl('/api/generate-suggestions');
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const token = await getSearchAuthToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ searchParams, preferences }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', externalAbortHandler);
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
    signal?.removeEventListener('abort', externalAbortHandler);
    if (error.name === 'AbortError') {
      const reason = (controller as any).reason || (signal as any)?.reason;
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

type RecipeEnrichmentOptions = EnrichmentRequestOptions;

async function fetchProxyEnrichment(title: string, cuisine: string, mode: 'cook' | 'ready-made', options?: RecipeEnrichmentOptions): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const url = getApiUrl('/api/enrich-recipe');
    console.log(`[Diagnostic] Fetching ${url} (Origin: ${window.location.origin})`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEnrichmentRequestBody(title, cuisine, mode, options)),
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
  const { query, count = 3, source, excludeTitles, cuisines: targetCuisines, cuisine: legacyCuisine, isLeftoverMode, ingredientIntent, strictIngredientMatch } = searchParams;
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
  const activeCookingMethodHints = activeCookingMethods.length > 0
    ? activeCookingMethods.map(method => {
        const aliases = COOKING_METHOD_ALIASES[method] || [];
        return aliases.length > 0 ? `${method} (also: ${aliases.join(', ')})` : method;
      }).join('; ')
    : 'Any';
  const activeCookingFats = filterCookingFatsForDiet(
    activeDietaryRule,
    searchParams.cookingFats || preferences?.cookingFats || []
  );
  const activeReligious = [...new Set([
    ...(preferences?.religiousEthical || []),
    ...(searchParams.religiousEthical || [])
  ])];
  const hasFreeRangePreference = activeReligious.some(item => /free[- ]range/i.test(item));
  const activeServings = searchParams.servings || preferences?.servings || 2;
  const activeSupermarkets = isReadyMade ? (searchParams.supermarkets || preferences?.preferredSupermarkets || []) : [];
  const activePreferredSourceIds = searchParams.preferredSourceIds || [];
  const activeIncludeOffal = dietaryRuleAllowsOffal(activeDietaryRule) && (
    searchParams.includeOffal !== undefined
      ? searchParams.includeOffal === true
      : preferences?.includeOffal === true
  );
  const activePreferredSourceNames = activePreferredSourceIds.length > 0
    ? PREFERRED_SOURCES.filter(s => activePreferredSourceIds.includes(s.id)).map(s => s.label)
    : [];
  const hasExplicitDietOrProteinIntent = Boolean(ingredientIntent?.isIngredientLed)
    || /\b(vegetarian|vegan|plant[- ]based|meat[- ]free|beef|chicken|turkey|pork|lamb|fish|salmon|tuna|mackerel|prawn|shrimp|tofu)\b/i.test(query);
  const shouldEncourageRecipeVariety = !isReadyMade && activeDietaryRule === 'none' && !hasExplicitDietOrProteinIntent;
  const isBroadChilliDishSearch = /\b(chilli|chili)\b/i.test(query)
    && !/\b(fresh|red|green|bird['’]?s[- ]eye|flakes?|powder|sauce|oil|pepper|peppers)\b/i.test(query);

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
  if (hasFreeRangePreference) appliedFilters.push("Free-range preferred where stated");
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

  const mediterraneanDietLogic = activeDietaryRule === 'mediterranean'
    ? `\nMEDITERRANEAN DIET PATTERN ACTIVE:
- Favour vegetables, fruit, beans, lentils, whole grains, olive oil, herbs, nuts and seeds.
- Fish and seafood are suitable, with modest amounts of poultry, eggs and dairy where they fit the dish.
- Keep red meat, processed meat, highly processed foods and excess saturated fat secondary rather than making them the focus.
- This is a dietary pattern, not a vegetarian rule. Do not make every result vegetarian and do not require every hallmark ingredient in every recipe.`
    : '';

  const preferredSourcesLogic = activePreferredSourceNames.length > 0
    ? `\nTRUSTED SOURCES (SOFT RANKING HINT ACTIVE):
- The user has expressed a preference for these trusted UK recipe sources: ${activePreferredSourceNames.join(', ')}.
- GENTLY FAVOUR recipes that could reasonably originate from or be attributed to these sources by applying a MODEST positive weight to results from them.
- This is NOT A HARD FILTER. You MUST still prioritize the most relevant recipes for the query "${query}". 
- Highly relevant recipes from other sources SHOULD still appear above weak matches from trusted sources.
- NEVER return an empty or severely reduced result set solely because trusted sources have no good matches. If no good matches exist in trusted sources, return the best matches from all available UK sources.`
    : '';

  const freeRangeLogic = hasFreeRangePreference
    ? `\nFREE-RANGE SOURCING PREFERENCE ACTIVE (SOFT):
- Prefer recipes and products whose named poultry, eggs, meat or dairy ingredients are explicitly described as free-range by the source.
- Do not treat free-range as equivalent to organic, pasture-fed, grass-fed, Halal, Kosher or any wider welfare certification.
- This is a preference, not a hard exclusion. Keep suitable results when the source does not state the production method.
- Include one reality check labelled "Free-range sourcing" for every result. Say "Source explicitly mentions free-range" only when the returned title, description or ingredient list states it; otherwise say "Free-range status is not stated by the source."`
    : '';

  const cookingFatLogic = activeCookingFats.length > 0
    ? `\nCOOKING FAT PREFERENCE ACTIVE:
- Prefer recipes that use one or more of these cooking fats: ${activeCookingFats.join(', ')}.
- Where a recipe uses a generic cooking oil or fat, suggest a selected fat as a practical substitute where it remains suitable for the dish.
- Respect all dietary, allergy and religious constraints; this is a cooking preference, not a safety override.`
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
- Every recipe must use all listed ingredients as primary or key ingredients.
- Minimise extra shopping. Avoid recipes that need many additional fresh or expensive ingredients.
- If a recipe needs extra ingredients, keep them essential and ordinary UK supermarket items.
- In the description or matchReason, briefly explain how the listed ingredients are used.`
    : '';

  const strictIngredientLogic = ingredientIntent?.isIngredientLed
    ? `\nINGREDIENT MATCH ACTIVE:\n- Every listed ingredient must appear in every returned recipe.\n- Natural forms or varieties of a listed ingredient are allowed when they remain the same ingredient category (for example pork mince or pork chops for pork, red onion for onion, and new potatoes for potato).\n- ${strictIngredientMatch ? 'Do not add meaningful ingredients that are not listed, such as garlic, cream or tomatoes when they were not requested.' : 'Extra ingredients are allowed when they are sensible for the dish.'}\n- ${strictIngredientMatch ? 'Basic pantry items such as water, oil, salt, pepper and ordinary seasoning are allowed.' : 'Keep extra ingredients to a sensible minimum.'}\n- Do not replace an exact result with a near match. If there are no exact results, return an empty items array.`
    : '';

  const offalLogic = activeIncludeOffal
    ? ''
    : `\nOFFAL EXCLUSION (HARD):
- Do not return recipes or ready-made products containing liver, kidney, heart, tongue, tripe, sweetbreads, blood sausage, black pudding or other offal.`;

  const recipeVarietyLogic = shouldEncourageRecipeVariety
    ? `\nRECIPE VARIETY (NO DIETARY RULE ACTIVE):
- The user has not asked for vegetarian, vegan or meat-free recipes.
- For a dish with established meat and vegetarian versions, return a useful mix where valid: include at least one conventional meat or other animal-protein version and at least one vegetarian version when the requested count allows.
- Do not use all vegetarian results as the default for a broad dish search, and do not treat the absence of a dietary preference as a preference for vegetarian recipes.`
    : '';
  const chilliDishIntentLogic = isBroadChilliDishSearch
    ? `\nCHILLI DISH INTENT:
- Treat "chilli" or "chili" here as the cooked dish, not as a request for fresh chilli peppers or chilli powder.
- Unless the user names a protein or dietary style, include at least one conventional meat or poultry chilli when the requested count allows.
- Do not let vegetarian chilli results displace all conventional versions simply because they are common or easy to generate.`
    : '';
  const activeExcludedTerms = [
    ...(preferences?.allergies || []),
    ...(preferences?.exclusions || []),
    ...(searchParams.exclusions || []),
    ...(searchParams.excludeIngredients || [])
  ].filter(Boolean);
  const itemContainsAnyTerm = (item: any, terms: string[]) => {
    const searchable = [
      item.title,
      item.description,
      ...(Array.isArray(item.ingredients) ? item.ingredients : [])
    ].filter(Boolean).join(' ').toLowerCase();

    return terms.some(term => {
      const cleaned = String(term).trim().toLowerCase();
      if (!cleaned) return false;
      const base = cleaned.endsWith('ies')
        ? `${cleaned.slice(0, -3)}y`
        : cleaned.endsWith('es')
          ? cleaned.slice(0, -2)
          : cleaned.endsWith('s')
            ? cleaned.slice(0, -1)
            : cleaned;
      const safeBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${safeBase}(s|es|ies)?\\b`, 'i').test(searchable);
    });
  };
  const eligibleChilliFallbacks = BROAD_CHILLI_FALLBACKS.filter(item => {
    const fallbackCost = parseFloat(String(item.costPerPortion).replace(/[^\d.]/g, ''));
    return (!activeMaxTime || item.totalTime <= activeMaxTime)
      && (!activeCalorieLimit || item.caloriesPerPortion <= activeCalorieLimit)
      && (!activeBudgetLimit || fallbackCost <= activeBudgetLimit)
      && !itemContainsAnyTerm(item, activeExcludedTerms);
  });
  const canUseChilliFallback = shouldEncourageRecipeVariety
    && isBroadChilliDishSearch
    && !isReadyMade
    && activeSaladPref !== 'main-only'
    && activeSaladPref !== 'side-only'
    && !activeIsSimple
    && activeCookingMethods.length === 0
    && activeCookingFats.length === 0
    && activeReligious.length === 0
    && eligibleChilliFallbacks.length > 0;

  const groundedSources = new Map<string, GroundedSource>();
  const rememberGroundedSources = (response: any) => {
    getGroundedSources(response).forEach(source => groundedSources.set(source.url, source));
  };

  try {
    const modelClient = getAI();
    
    // Parse and normalise search query elements for ingredient-focused searches
    const parsedIngredients = ingredientIntent?.ingredients?.length ? ingredientIntent.ingredients : parseAndNormaliseIngredients(query);
    const categoryMinimums = ingredientIntent?.categoryMinimums || {};
    const categoryMinimumText = Object.entries(categoryMinimums)
      .map(([category, minimum]) => `${minimum} ${category}${minimum === 1 ? '' : 's'}`)
      .join(', ');
    const categoryMinimumInstruction = categoryMinimumText
      ? `\n- Category minimums: at least ${categoryMinimumText}, counting distinct matching ingredients.`
      : '';
    const preparationPreferences = ingredientIntent?.preparationPreferences;
    const preparationInstruction = preparationPreferences
      ? `\n- Explicit preparation requirements: ${[
          preparationPreferences.skin === 'on' ? 'skin-on' : preparationPreferences.skin === 'off' ? 'skinless' : '',
          preparationPreferences.bone === 'in' ? 'bone-in' : preparationPreferences.bone === 'out' ? 'boneless' : '',
          preparationPreferences.fishForm || ''
        ].filter(Boolean).join(', ')}. These requirements apply to the associated meat, fish or seafood ingredient and must not be substituted.`
      : '';
    const parsedIngredientsInstruction = ingredientIntent?.isIngredientLed && parsedIngredients.length > 0
      ? `\nINGREDIENT PARSING & INTERPRETATION (CRITICAL):
- The user's query "${query}" represents one or more listed ingredients.
- Split these on commas and the word 'and'. The independent parsed ingredients are: ${parsedIngredients.map(i => `'${i}'`).join(', ')}.
- These ingredients have been normalised to singular names in UK English (such as tomatoes to 'tomato', red peppers to 'red pepper'), treating plurals and spelling variants as equivalent.
- You MUST interpret each parsed element as a distinct ingredient list item.
- Every returned recipe must contain ALL of these listed ingredients.${preparationInstruction}
${categoryMinimumInstruction}
- If 'vegetable' is listed, it means at least one named vegetable in the recipe. Do not count vegetable oil, vegetable stock or vegetable broth as the vegetable requirement.
- If 'protein' is listed, it means at least one named meat, fish, seafood, egg, pulse, nut or plant-protein ingredient.
- If 'carbohydrate' is listed, it means at least one named starchy ingredient such as rice, pasta, bread, noodles, potatoes or grains.
- If no exact matches exist, return zero results rather than a near match.
${strictIngredientMatch ? '- Return the complete visible ingredient list for each recipe, not a shortened summary.' : ''}
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
- FOR EVERY RESULT: Use Google Search grounding to find a real UK recipe or product page.
- When Google provides a grounded page, sourceUrl MUST be its exact recipe-page URL. Never invent a URL, use a generic search URL, or return recipe-search. When Google does not provide a grounded page, omit sourceUrl unless it is an exact recipe page from BBC Good Food, BBC Food, Tesco Real Food, Guardian Feast, Mob, delicious. magazine, The Happy Foodie, Kitchen Sanctuary, Diabetes UK, Slimming World, or Jamie Oliver.
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
3. Allergies: ${preferences?.allergies?.join(', ') || 'None'}
4. Max calories per portion: ${activeCalorieLimit || 'None'} kcal
5. Max Cost: ${activeIsLowCost || activeBudgetLimit ? `£${activeBudgetLimit || '2.00'}` : 'None'} per portion
6. Exclusions: ${[...(preferences?.exclusions || []), ...(searchParams.exclusions || [])].join(', ') || 'None'}
7. Cuisine: ${targetCuisines?.length ? targetCuisines.join(', ') : (legacyCuisine || 'Any')}
8. Trusted Sources (Ranking Hint): ${activePreferredSourceNames.length > 0 ? activePreferredSourceNames.join(', ') : 'Any trusted UK source'}
9. Cooking Methods: ${activeCookingMethodHints}
10. Religious/Ethical: ${activeReligious.join(', ') || 'None'}
11. Preferred Supermarkets: ${activeSupermarkets.length > 0 ? activeSupermarkets.join(', ') : 'Any'}
12. Cooking Fats (Preference): ${activeCookingFats.length > 0 ? activeCookingFats.join(', ') : 'Any'}
13. High Omega-3 Prioritisation: ${activeHighOmega3 ? 'Active (focus on oily fish, walnuts, chia, flaxseed)' : 'No'}
14. High Protein Prioritisation: ${activeHighProtein ? 'Active (focus on lean meats, fish, pulses, eggs)' : 'No'}
15. Offal: ${activeIncludeOffal ? 'Allowed' : 'Excluded'}
16. Requested household servings: ${activeServings}${mediterraneanDietLogic}
${saladLogic}${simplicityLogic}${preferredSourcesLogic}${freeRangeLogic}${cookingFatLogic}${budgetLogic}${omega3Logic}${remainsProteinLogic}${leftoversLogic}${offalLogic}${recipeVarietyLogic}${chilliDishIntentLogic}
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
    ${ingredientIntent?.isIngredientLed && parsedIngredients.length > 0 ? `Target Ingredients: MUST contain every specified parsed ingredient (${parsedIngredients.join(', ')}).${categoryMinimumInstruction} Minimise extra shopping and feature these ingredients prominently.` : ''}
    ${activeSaladPref === 'main-only' ? 'Requirement: MUST be a main-course salad.' : ''}
    ${activeSaladPref === 'side-only' ? 'Requirement: MUST be a side salad.' : ''}
    ${activeSaladPref === 'none' ? 'Requirement: NO salads.' : ''}
    ${activeIsLowCost ? 'Priority: Low budget.' : ''}
    ${activeIsSimple ? 'Priority: Simple/Fast (strictly no more than 4 ingredients).' : ''}
    ${activeNutritious ? 'Priority: Nutritious.' : ''}
    ${activeHighOmega3 ? 'Priority: High Omega-3 (focus on oily fish, walnuts, chia, flaxseed).' : ''}
    ${activeHighProtein ? 'Priority: High Protein (focus on lean meats, fish, pulses, eggs).' : ''}
    ${activeCookingFats.length > 0 ? `Preference: Use ${activeCookingFats.join(' or ')} for cooking where practical and suitable.` : ''}
    ${ingredientIntent?.isIngredientLed || isLeftoverMode ? `Priority: Ingredient-led search. ${strictIngredientMatch ? 'Use only the listed ingredients apart from basic pantry items.' : 'Prioritize recipes that maximize the use of these specific items and require few extra ingredients.'}` : ''}
    ${activePreferredSourceNames.length > 0 ? `Requirement: Gently favour recipes from these trusted sources: ${activePreferredSourceNames.join(', ')}.` : ''}
    ${activeMaxTime ? `Must be under ${activeMaxTime} mins.` : ''}
    ${excludeTitles?.length ? `MANDATORY EXCLUSION: Do NOT suggest any of these recipes: ${excludeTitles.join(', ')}.` : ''}
    ${shouldEncourageRecipeVariety ? 'Return a varied set when the dish has both meat and vegetarian versions; do not make every result vegetarian unless the query requires it.' : ''}
    Generate ${count} stubs.`;

    const config = {
        systemInstruction: finalSystemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        googleSearch: true,
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
                  totalServings: { type: Type.NUMBER, description: "Standard number of adult portions made by the full recipe." },
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
                required: ["title", "description", "cuisine", "totalTime", "ingredients", "totalIngredientsCount", "realityChecks", ...(isReadyMade ? ["retailer"] : ["totalServings"])]
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
    rememberGroundedSources(response);

    const text = response.text;
    const geminiDuration = Date.now() - start;
    console.log(`[GeminiService] Response received in ${geminiDuration}ms. Text length: ${text?.length || 0}`);

    if (!text) {
      throw new GeminiServiceError('empty', "Empty response from search service.");
    }

    const data = parseModelJson(text);
    const parsedItems = Array.isArray(data.items) ? data.items : [];
    const filterIngredientLedItems = (candidateItems: any[]) => (
      ingredientIntent?.isIngredientLed && !isReadyMade
        ? candidateItems.filter(item => matchesRequestedIngredientSearch(item, query))
        : candidateItems
    );
    const ingredientMatchedItems = filterIngredientLedItems(parsedItems);
    let rawItems = filterToGroundedSources(ingredientMatchedItems, groundedSources);
    console.log(
      `[GeminiService] Ingredient search candidates: model=${parsedItems.length}, ingredient=${ingredientMatchedItems.length}, grounded=${rawItems.length}, sources=${groundedSources.size}`
    );
    let wasRepaired = false;
    const repairPrompts: string[] = [];
    const repairOutputs: string[] = [];

    // Ingredient-led searches aim to present the requested number of recipes.
    // One compact, time-bounded recovery fills any gap without allowing a slow
    // model request to turn an otherwise useful search into a timeout.
    if (ingredientIntent?.isIngredientLed && !isReadyMade && rawItems.length < count) {
      const recoveryPrompt = `Recover a recipe search for "${query}".
Return up to ${count} complete UK home-cooking recipe stubs.
Every recipe must include all of these requested ingredients in its ingredients array: ${parsedIngredients.join(', ')}.${categoryMinimumInstruction}
Use Google Search grounding and set sourceUrl to an exact grounded recipe page URL.
Return an empty items array only when no grounded page supports the request. Never use an ellipsis or placeholder.`;
      repairPrompts.push(recoveryPrompt);

      const recoveryConfig = {
        ...config,
        systemInstruction: `${finalSystemInstruction}
RECOVERY REQUEST: Keep the response compact and valid. Include every requested ingredient explicitly in each ingredients array and use only a source URL grounded by this response.`,
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
                  totalServings: { type: Type.NUMBER },
                  caloriesPerPortion: { type: Type.NUMBER },
                  costPerPortion: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  totalIngredientsCount: { type: Type.NUMBER },
                  sourceUrl: { type: Type.STRING }
                },
                required: ['title', 'description', 'ingredients']
              }
            }
          },
          required: ['items']
        }
      };

      try {
        const recoveryResponse = await withRequestTimeout(
          callGeminiWithRetry(SEARCH_MODEL, recoveryPrompt, recoveryConfig, 1),
          12_000,
          'Ingredient search recovery'
        );
        rememberGroundedSources(recoveryResponse);
        const recoveryOutputText = recoveryResponse.text || '';
        repairOutputs.push(recoveryOutputText);
        const recoveryData = recoveryOutputText ? parseModelJson(recoveryOutputText) : {};
        const recoveryItems = filterToGroundedSources(
          filterIngredientLedItems(Array.isArray(recoveryData.items) ? recoveryData.items : []),
          groundedSources
        );
        rawItems = [...rawItems, ...recoveryItems];
        wasRepaired = recoveryItems.length > 0;
      } catch (recoveryError) {
        console.warn('[GeminiService] Compact ingredient recovery failed; keeping the results already found.', recoveryError);
      }
    }

    const dedupeItems = (itemsToDedupe: any[]) => {
      const seenTitles = new Set<string>();
      return itemsToDedupe.filter((item: any) => {
        const titleKey = String(item.title || '').trim().toLowerCase();
        if (!titleKey || seenTitles.has(titleKey)) return false;
        seenTitles.add(titleKey);
        return true;
      });
    };
    const isClearlyVegetarian = (item: any) => item.isVegetarian === true
      || /\b(vegetarian|vegan|plant[- ]based|meat[- ]free|lentil|tofu|tempeh|chickpea)\b/i.test([
        item.title,
        item.description,
        ...(Array.isArray(item.ingredients) ? item.ingredients : [])
      ].filter(Boolean).join(' '));
    const isReadyMadeCandidate = (item: any) => {
      const source = String(item.sourceUrl || '').toLowerCase();
      const retailer = String(item.retailer || '').trim();
      if (!retailer) return false;

      const recipeDomains = ['bbcgoodfood.com', 'jamieoliver.com', 'allrecipes.com', 'simplyrecipes.com', 'foodnetwork.com', 'epicurious.com', 'tasty.co', 'delish.com'];
      return !recipeDomains.some(domain => source.includes(domain));
    };

    // The model may under-fill an otherwise valid response. Make a small number
    // of bounded repair requests rather than accepting one result as complete.
    const maxRepairAttempts = ingredientIntent?.isIngredientLed && !isReadyMade ? 0 : 3;
    for (let repairAttempt = 0; repairAttempt < maxRepairAttempts; repairAttempt += 1) {
      rawItems = dedupeItems(rawItems);
      const missingCount = Math.max(0, count - rawItems.length);
      const allVegetarian = shouldEncourageRecipeVariety && rawItems.length > 0 && rawItems.every(isClearlyVegetarian);
      if (missingCount === 0 && !allVegetarian) break;

      const repairCount = Math.max(1, missingCount);
      const existingTitles = [...(excludeTitles || []), ...rawItems.map((item: any) => String(item.title || '').trim())].filter(Boolean);
      const repairPrompt = `Search intent: "${query}".
Return exactly ${repairCount} additional ${isReadyMade ? 'UK supermarket ready-made products' : 'recipe'} stubs.
Do not repeat any existing title: ${existingTitles.join(', ') || 'None'}.
${allVegetarian ? 'At least one added result must be a conventional non-vegetarian version where that is a normal fit for this dish. The user has not selected a vegetarian preference.' : ''}
${isReadyMade ? 'Return commercially available UK ready-made products only.' : 'Return home-cooking recipes only.'}`;
      repairPrompts.push(repairPrompt);

      try {
        const repairConfig = {
          ...config,
          systemInstruction: `${finalSystemInstruction}
REPAIR REQUEST: Generate exactly ${repairCount} additional results for this request. Follow the repair prompt's exclusions and variety requirement.`
        };
        const repairResponse = await callGeminiWithRetry(SEARCH_MODEL, repairPrompt, repairConfig);
        rememberGroundedSources(repairResponse);
        const repairOutputText = repairResponse.text || '';
        repairOutputs.push(repairOutputText);
        const repairData = repairOutputText ? parseModelJson(repairOutputText) : {};
        const repairItems = filterToGroundedSources(
          filterIngredientLedItems(Array.isArray(repairData.items) ? repairData.items : []),
          groundedSources
        );
        const nonVegetarianRepair = allVegetarian
          ? repairItems.find((item: any) => !isClearlyVegetarian(item))
          : null;

        if (allVegetarian && nonVegetarianRepair) {
          rawItems = [...rawItems.slice(0, -1), nonVegetarianRepair, ...repairItems.filter((item: any) => item !== nonVegetarianRepair)];
        } else {
          rawItems = [...rawItems, ...repairItems];
        }
        wasRepaired = wasRepaired || repairItems.length > 0;
      } catch (repairError) {
        console.warn('[GeminiService] Result repair pass failed; keeping the results already found.', repairError);
        break;
      }
    }

    // Ready-made searches can lose otherwise useful candidates when a model
    // response contains recipe pages, missing retailers or duplicate products.
    // Make one bounded recovery request after those checks so a narrow query
    // such as a single protein has a fair chance to reach the normal result
    // count without relaxing any hard user constraints.
    if (isReadyMade) {
      rawItems = dedupeItems(rawItems).filter(isReadyMadeCandidate);
      if (rawItems.length < count) {
        const missingCount = count - rawItems.length;
        const existingTitles = [...(excludeTitles || []), ...rawItems.map((item: any) => String(item.title || '').trim())].filter(Boolean);
        const readyMadeRecoveryPrompt = `Broaden the ready-made product search for "${query}".
Return exactly ${missingCount} additional distinct UK supermarket ready-made product stubs.
Keep the original named protein, dish style or other search intent where possible, but vary product formats and permitted retailers to find genuinely different options.
Do not repeat these titles: ${existingTitles.join(', ') || 'None'}.
Preserve every hard dietary, allergy, ethical, budget and heating-time rule. Use Google Search grounding and provide an exact source product page URL for every result. Never use a generic search URL or a home-cooking recipe.`;
        repairPrompts.push(readyMadeRecoveryPrompt);

        try {
          const readyMadeRecoveryResponse = await callGeminiWithRetry(
            SEARCH_MODEL,
            readyMadeRecoveryPrompt,
            {
              ...config,
              systemInstruction: `${finalSystemInstruction}
READY-MADE RECOVERY: The initial search was under-filled after source and product validation. Return only additional, distinct ready-made products that preserve the original intent and all hard constraints.`
            }
          );
          rememberGroundedSources(readyMadeRecoveryResponse);
          const recoveryOutputText = readyMadeRecoveryResponse.text || '';
          repairOutputs.push(recoveryOutputText);
          const recoveryData = recoveryOutputText ? parseModelJson(recoveryOutputText) : {};
          const recoveryItems = filterToGroundedSources(
            Array.isArray(recoveryData.items) ? recoveryData.items : [],
            groundedSources
          ).filter(isReadyMadeCandidate);
          rawItems = [...rawItems, ...recoveryItems];
          wasRepaired = wasRepaired || recoveryItems.length > 0;
        } catch (recoveryError) {
          console.warn('[GeminiService] Ready-made recovery failed; keeping the products already found.', recoveryError);
        }
      }
    }

    // A broad chilli search is common enough to warrant a deterministic
    // completion path when the provider repeatedly under-fills an unrestricted
    // request. These are only used when no dietary, allergy, budget or timing
    // constraint could make them unsafe.
    if (canUseChilliFallback) {
      const existingTitles = new Set([
        ...(excludeTitles || []),
        ...rawItems.map((item: any) => String(item.title || '').trim())
      ].filter(Boolean).map(title => title.toLowerCase()));
      const fallbackItems = filterToGroundedSources(
        eligibleChilliFallbacks.filter(item => !existingTitles.has(item.title.toLowerCase())),
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

    rawItems = filterToGroundedSources(dedupeItems(rawItems).slice(0, count), groundedSources);
    const repairPrompt = repairPrompts.join('\n');
    const repairOutputText = repairOutputs.join('\n');

    let items = rawItems.map((item: any) => {
      const realityChecks = sanitizeRealityChecks(item.realityChecks);
      if (hasFreeRangePreference) {
        const fields = [
          item.title || '',
          item.description || '',
          ...(Array.isArray(item.ingredients) ? item.ingredients : [])
        ].join(' ');
        const explicitlyConfirmed = /\bfree[- ]range(?:d)?\b/i.test(fields);
        return {
          ...item,
          realityChecks: [
            ...realityChecks.filter(check => check.label.toLowerCase() !== 'free-range sourcing').slice(0, 2),
            {
              label: 'Free-range sourcing',
              note: explicitlyConfirmed
                ? 'Source explicitly mentions free-range.'
                : 'Free-range status is not stated by the source.',
              tone: explicitlyConfirmed ? 'positive' : 'neutral'
            }
          ],
          id: item.id || `dbd-${Math.random().toString(36).substring(2, 9)}`,
          dietFlagsVerified: true
        };
      }
      return {
        ...item,
        realityChecks,
        id: item.id || `dbd-${Math.random().toString(36).substring(2, 9)}`,
        dietFlagsVerified: true
      };
    });

    // Post-generation validation for Ready-made mode
    if (isReadyMade) {
      items = items.filter(isReadyMadeCandidate);
    }

    const finalResult: any = {
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
          inputTokensEstimate: estimateTokensFromText(finalSystemInstruction + prompt + (repairPrompt ? finalSystemInstruction + repairPrompt : '')),
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
export async function enrichRecipe(title: string, cuisine: string, mode: 'cook' | 'ready-made', options?: RecipeEnrichmentOptions): Promise<Partial<Recipe | ReadyMeal>> {
  const config = getApiConfig();
  
  if (isBrowser && config.mode === 'proxy') {
    return fetchProxyEnrichment(title, cuisine, mode, options);
  }

  try {
    const modelClient = getAI();
    const strictIntent = options?.strictIngredientMatch && mode === 'cook' && options.query
      ? detectIngredientIntent(options.query)
      : null;
    const strictIngredients = strictIntent?.isIngredientLed ? strictIntent.ingredients : [];
    const strictDetailLogic = strictIngredients.length > 0
      ? `
STRICT INGREDIENT DETAIL CHECK (HARD):
- The search only allows these ingredients: ${strictIngredients.join(', ')}.
- Every ingredient in the complete recipe must be one of those listed ingredients or a basic pantry item such as water, oil, salt, pepper or ordinary seasoning.
- Do not add rice, potatoes, breadcrumbs, flour, butter, cream, stock, herbs, lemon or any other ingredient unless it is listed or is a permitted pantry item.
- Include the complete ingredient list in the response. The response will be rejected if any unlisted ingredient appears.
`
      : '';
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
- SOURCE URL: Use Google Search grounding to provide an exact real source page for this recipe. Never invent a URL or use a generic search URL. ${options?.sourceUrl ? `Preserve this existing grounded source URL exactly: ${options.sourceUrl}` : 'If no grounded source page supports the recipe, omit the source URL.'}
- TOTAL INGREDIENTS COUNT: Provide an accurate total count of all ingredients required.
- STANDARD SERVINGS: Provide the standard number of adult portions made by the full recipe as totalServings. Do not use the user's current shopping quantity for this field.
${strictDetailLogic}
`;

    const config = {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        googleSearch: true,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            totalServings: { type: Type.NUMBER, description: "Standard number of adult portions made by the full recipe." },
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
          required: ["instructions", "ingredients", "description", "totalIngredientsCount", ...(mode === 'ready-made' ? ["retailer"] : ["totalServings"])]
        }
    };

    let lastStrictMismatch = false;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const prompt = `Full detail for: "${title}" (${cuisine}). mode: ${mode}.
${options?.sourceUrl ? `Existing source URL: ${options.sourceUrl}` : ''}
${strictIngredients.length > 0 ? `This is strict search attempt ${attempt + 1}. The only allowed non-pantry ingredients are: ${strictIngredients.join(', ')}. Review every ingredient before returning the response.` : ''}`;
      const response = await callGeminiWithRetry(ENRICHMENT_GEMINI_MODEL, prompt, config);
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
      if (!strictIngredients.length || matchesStrictIngredientSearch(parsed, options?.query || '')) {
        return parsed;
      }

      lastStrictMismatch = true;
    }

    if (lastStrictMismatch) {
      throw new Error('Recipe details did not pass the strict ingredient check.');
    }

    throw new Error("Empty enrichment response");
  } catch (error: any) {
    if (isBrowser && config.mode === 'direct') {
      console.warn("[GeminiService] Client-side Direct Enrichment failed. Seamlessly falling back to Cloud Proxy...", error);
      try {
        return await fetchProxyEnrichment(title, cuisine, mode, options);
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

    const response = await callGeminiWithRetry(ENRICHMENT_GEMINI_MODEL, systemInstruction, {
        temperature: 0.1,
        responseMimeType: "application/json", 
        responseSchema 
      }
    );

    const text = response.text || "{}";
    const data = parseModelJson(text);
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
