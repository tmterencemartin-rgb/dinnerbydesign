import express from "express";
import { waitUntil } from "@vercel/functions";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth as getFirebaseAdminAuth } from "firebase-admin/auth";
import { getAppCheck as getFirebaseAdminAppCheck } from "firebase-admin/app-check";
import { GoogleAuth } from "google-auth-library";
import firebaseConfig from "../firebase-applet-config.json";
import { generateDinnerSuggestions, enrichRecipe, generateMatchRationales, generateInternalDinnerChoices } from "../src/services/geminiService";
import { sendEmail } from "../src/lib/resend";
import { getSimulatedEmailResult } from "../src/lib/emailDelivery";
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH, getFiveDinnersForTwoJsonLd, renderFiveDinnersForTwoInitialHtml } from "../src/content/seoMealPlans";
import { FAMILY_DINNERS_FOR_FOUR, FAMILY_DINNERS_FOR_FOUR_PATH, getFamilyDinnersForFourJsonLd, renderFamilyDinnersForFourInitialHtml } from "../src/content/familyDinnersForFourPlan";
import { isUnknownPublicArticlePath } from "../src/content/publicArticles";
import { getPublicPageRedirect } from "../src/content/publicRedirects";
import { ACTIVE_GEMINI_MODEL, estimateGeminiCostUsd } from "../src/config/aiModel";
import {
  catalogueEntryMatchesFeedItem,
  ingredientPriceDocumentId,
  parseLicensedIngredientPriceFeed,
} from "../src/lib/ingredientPriceRefresh";
import {
  findAnonymousIdentitiesWithoutProfiles,
  findRegisteredIdentitiesWithoutProfiles,
  summariseAccountReconciliation,
} from "../src/lib/accountReconciliation";
import { hasDeliveredSearchChoices, isDeliverableSearchResult } from "../src/lib/searchDelivery";
import { parseEnrichmentRequestOptions, validateEnrichmentRequestPayload } from "../src/lib/enrichmentRequest";
import { normaliseIncomingSearchParams } from "../src/lib/searchUtils";
import { normaliseUserPreferences } from "../src/lib/preferenceUtils";
import { THREE_WAY_SEARCH_PILOT } from "../src/config/features";
import { validateSearchRequestPayload } from "../src/lib/searchRequestValidation";
import { canonicaliseGroundedUrl, confirmPublisherRecipePageUrl } from "../src/lib/groundingUtils";
import {
  GUEST_SEARCH_RATE_LIMIT_WINDOW_MS,
  createGuestSearchRateLimitId,
  isGuestSearchRateLimitAvailable,
  nextGuestSearchRateWindow,
} from "../src/lib/guestSearchRateLimit";
import {
  getWebhookClaimDecision,
  isFreshEmailClaim,
  shouldApplyStripeEvent,
  STRIPE_WEBHOOK_PROCESSING_LEASE_MS,
} from "../src/lib/webhookSafety";
import type { SearchParams } from "../src/types";
function getFirebaseConfig() {
  return firebaseConfig;
}

process.on("uncaughtException", (err) => {
  console.error("FATAL UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL UNHANDLED REJECTION at:", promise, "reason:", reason);
});

// Helper to write diagnostic logs for API errors
function logApiError(type: string, error: any) {
  try {
    const timestamp = new Date().toISOString();
    const errorMsg = error?.message || String(error);
    const errorStack = error?.stack || "";
    const details = error?.category ? `Category: ${error.category}` : "";
    
    // Serverless file systems are read-only, so we completely avoid writing to api-errors.log
    console.error(`[API Error Diagnostic] [${timestamp}] [${type}] ${errorMsg}\nStack: ${errorStack}\nDetails: ${details}`);
  } catch (e) {
    console.error("Failed to log API error:", e);
  }
}

const PRODUCTION_APP_URL = "https://dinnerbydesign.app";
const ADMIN_EMAILS = new Set(["tmterencemartin@gmail.com", "qa-admin@dinnerbydesign.app"]);
const CONTACT_RECIPIENT = "tmterencemartin@gmail.com";
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAXIMUM = 4;
const contactAttempts = new Map<string, number[]>();
const GUEST_SEARCH_LIMIT = 3;
const guestSearchAttemptsByIp = new Map<string, number[]>();
const CLIENT_ERROR_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CLIENT_ERROR_RATE_LIMIT_MAXIMUM = 30;
const clientErrorAttemptsByIp = new Map<string, number[]>();
const MONITORING_ALERT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const AUTOMATIC_REFUND_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const REFUND_REQUEST_LEASE_MS = 10 * 60 * 1000;
const ENRICHMENT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const ENRICHMENT_CACHE_MAX_ENTRIES = 500;
const enrichmentCache = new Map<string, { result: any; expiresAt: number }>();
const enrichmentInFlight = new Map<string, Promise<any>>();
const isCacheableEnrichment = (result: any) =>
  Array.isArray(result?.instructions) && result.instructions.length > 0
  && Array.isArray(result?.ingredients) && result.ingredients.length > 0;

const getEnrichmentCacheKey = (title: string, cuisine: string, mode: string, options: ReturnType<typeof parseEnrichmentRequestOptions>) => {
  const sourceUrl = canonicaliseGroundedUrl(options.sourceUrl);
  if (options.strictIngredientMatch) return null;
  return sourceUrl || JSON.stringify({ title: title.trim().toLowerCase(), cuisine: cuisine.trim().toLowerCase(), mode });
};

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderPublicSeoInitialHtml = (heading: string, description: string) =>
  `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main></div>`;

function renderWelcomeEmailHtml(displayName: string) {
  const firstName = escapeHtml(displayName.trim().split(/\s+/).filter(Boolean)[0] || 'there');
  const appUrl = `${PRODUCTION_APP_URL}/?view=home&from=email`;

  return `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <p>Hi ${firstName},</p>
  <p>DinnerByDesign helps you decide what to cook, search recipes you can actually make, and build a shopping list as you go — around your diet, budget and the time you have.</p>
  <p>Get started in under a minute:</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><span style="font-size: 15px; font-weight: bold; color: #111;">1. Set your preferences</span><br><span style="color: #555; font-size: 13.5px;">On the search page, tap Preferences beside the search box to set dietary needs, portions, budget, calorie targets and any ingredients to exclude.</span></td></tr>
    <tr><td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><span style="font-size: 15px; font-weight: bold; color: #111;">2. Find and schedule recipes</span><br><span style="color: #555; font-size: 13.5px;">Search by ingredients you have in, filter to your constraints, and tap Schedule to add a recipe to your planner.</span></td></tr>
    <tr><td style="padding: 12px 0;"><span style="font-size: 15px; font-weight: bold; color: #111;">3. Build your shopping list</span><br><span style="color: #555; font-size: 13.5px;">Your list updates automatically, scaled to your portions — tick off what you already have and it adjusts.</span></td></tr>
  </table>
  <div style="margin: 32px 0; text-align: center;"><a href="${appUrl}" style="background-color: #111; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 14px;">Find your first recipe →</a></div>
  <p>Questions or feedback? Reply to this email — we read and answer every one.</p>
  <p style="margin-top: 24px; font-weight: 500; margin-bottom: 2px;">The DinnerByDesign team</p>
  <p style="margin: 0; font-size: 13px; color: #666;"><a href="mailto:terence@dinnerbydesign.app" style="color: #666; text-decoration: underline;">terence@dinnerbydesign.app</a></p>
</div>
  `.trim();
}

function hasContactRateLimitCapacity(req: express.Request) {
  const forwardedFor = req.get("x-forwarded-for");
  const client = (forwardedFor ? forwardedFor.split(",")[0] : req.ip || "unknown").trim();
  const now = Date.now();
  const recentAttempts = (contactAttempts.get(client) || []).filter(attempt => now - attempt < CONTACT_RATE_LIMIT_WINDOW_MS);

  if (recentAttempts.length >= CONTACT_RATE_LIMIT_MAXIMUM) {
    contactAttempts.set(client, recentAttempts);
    return false;
  }

  recentAttempts.push(now);
  contactAttempts.set(client, recentAttempts);
  return true;
}

function isTrustedContactOrigin(req: express.Request) {
  const origin = req.get("origin");
  if (!origin) return false;

  try {
    const parsed = new URL(origin);
    return parsed.origin === PRODUCTION_APP_URL
      || ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function hasClientErrorRateLimitCapacity(req: express.Request) {
  const forwardedFor = req.get('x-forwarded-for');
  const client = (forwardedFor ? forwardedFor.split(',')[0] : req.ip || 'unknown').trim();
  const now = Date.now();
  const recentAttempts = (clientErrorAttemptsByIp.get(client) || [])
    .filter(attempt => now - attempt < CLIENT_ERROR_RATE_LIMIT_WINDOW_MS);

  if (recentAttempts.length >= CLIENT_ERROR_RATE_LIMIT_MAXIMUM) {
    clientErrorAttemptsByIp.set(client, recentAttempts);
    return false;
  }

  recentAttempts.push(now);
  clientErrorAttemptsByIp.set(client, recentAttempts);
  return true;
}

function sanitiseClientErrorText(value: unknown, maxLength: number) {
  return String(value || '')
    .replace(/https?:\/\/[^\s)]+/gi, '[redacted-url]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[redacted-email]')
    .replace(/[?&](?:token|key|code|email|query|search)=[^&\s]*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function getAppOrigin(req: express.Request): string {
  const requestOrigin = req.headers.origin || req.headers.referer || `${req.protocol}://${req.get("host")}`;
  const origin = Array.isArray(requestOrigin) ? requestOrigin[0] : requestOrigin;

  if (!origin) return PRODUCTION_APP_URL;

  try {
    const parsed = new URL(origin);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    const isDinnerByDesignPreview = parsed.hostname.startsWith("dinnerbydesign-")
      && parsed.hostname.endsWith(".vercel.app");

    if (isLocal || isDinnerByDesignPreview) return parsed.origin;
    return PRODUCTION_APP_URL;
  } catch {
    return PRODUCTION_APP_URL;
  }
}

// Initialize Firebase Admin lazily
let _db: any = null;
function ensureFirebaseAdminApp() {
  if (getApps().length === 0) {
    const config = getFirebaseConfig();
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || config.projectId || process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      initializeApp({
        projectId: config.projectId || process.env.FIREBASE_PROJECT_ID,
      });
    }
  }
}

function getDb() {
  if (!_db) {
    const config = getFirebaseConfig();
    ensureFirebaseAdminApp();
    _db = getFirestore(config.firestoreDatabaseId || undefined);
  }
  return _db;
}

type FirestoreBackupCheck = {
  status: 'passed' | 'failed' | 'not_configured';
  scheduleCount: number;
  readyBackupCount: number;
  latestSnapshotTime?: string | null;
  ageHours?: number | null;
  errorCategory?: string | null;
};

let firestoreAdminAuth: GoogleAuth | null = null;

async function getFirestoreAdminAccessToken() {
  const serviceAccountJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
  if (!serviceAccountJson) return null;

  const credentials = JSON.parse(serviceAccountJson);
  firestoreAdminAuth ||= new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await firestoreAdminAuth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error('google_access_token_missing');

  return {
    token,
    projectId: credentials.project_id || getFirebaseConfig().projectId || process.env.FIREBASE_PROJECT_ID
  };
}

async function firestoreAdminRequest(pathname: string, token: string) {
  const response = await fetch(`https://firestore.googleapis.com${pathname}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`firestore_admin_${response.status}`);
    (error as any).status = response.status;
    (error as any).body = body.slice(0, 200);
    throw error;
  }
  return response.json();
}

async function checkFirestoreBackups(): Promise<FirestoreBackupCheck> {
  if (String(process.env.FIRESTORE_BACKUP_MONITORING_ENABLED || '').toLowerCase() !== 'true') {
    return {
      status: 'not_configured',
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: 'monitoring_not_enabled'
    };
  }

  const auth = await getFirestoreAdminAccessToken();
  if (!auth?.projectId) {
    return {
      status: 'failed',
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: 'firebase_service_account_missing'
    };
  }

  const databaseId = getFirebaseConfig().firestoreDatabaseId || '(default)';
  const databasePath = `projects/${encodeURIComponent(auth.projectId)}/databases/${encodeURIComponent(databaseId)}`;
  const schedulesResponse = await firestoreAdminRequest(`/v1/${databasePath}/backupSchedules`, auth.token) as { backupSchedules?: any[] };
  const schedules = schedulesResponse.backupSchedules || [];
  if (schedules.length === 0) {
    return {
      status: 'failed',
      scheduleCount: 0,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: 'backup_schedule_missing'
    };
  }

  const database = await firestoreAdminRequest(`/v1/${databasePath}`, auth.token) as { name?: string; locationId?: string };
  const locationId = String(database.locationId || '').trim();
  if (!locationId) {
    return {
      status: 'failed',
      scheduleCount: schedules.length,
      readyBackupCount: 0,
      latestSnapshotTime: null,
      ageHours: null,
      errorCategory: 'firestore_location_missing'
    };
  }

  const backupsResponse = await firestoreAdminRequest(
    `/v1/projects/${encodeURIComponent(auth.projectId)}/locations/${encodeURIComponent(locationId)}/backups?pageSize=100`,
    auth.token
  ) as { backups?: any[] };
  const backups = (backupsResponse.backups || [])
    .filter(backup => backup.database === database.name && backup.state === 'READY')
    .filter(backup => typeof backup.snapshotTime === 'string')
    .sort((left, right) => Date.parse(right.snapshotTime) - Date.parse(left.snapshotTime));
  const latestSnapshotTime = backups[0]?.snapshotTime || null;
  const ageHours = latestSnapshotTime ? (Date.now() - Date.parse(latestSnapshotTime)) / (60 * 60 * 1000) : null;
  const maxAgeHours = Math.min(Math.max(Number(process.env.FIRESTORE_BACKUP_MAX_AGE_HOURS || 48), 24), 168);
  const status = ageHours !== null && ageHours >= 0 && ageHours <= maxAgeHours ? 'passed' : 'failed';

  return {
    status,
    scheduleCount: schedules.length,
    readyBackupCount: backups.length,
    latestSnapshotTime,
    ageHours,
    errorCategory: status === 'passed' ? null : 'recent_ready_backup_missing'
  };
}

function getAdminAuth() {
  ensureFirebaseAdminApp();
  return getFirebaseAdminAuth();
}

function getAdminAppCheck() {
  ensureFirebaseAdminApp();
  return getFirebaseAdminAppCheck();
}

async function verifyAdminRequest(req: express.Request, res: express.Response) {
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

function getClientIp(req: express.Request) {
  const forwardedFor = req.get("x-forwarded-for");
  return (forwardedFor ? forwardedFor.split(",")[0] : req.ip || "unknown").trim();
}

function getRecentGuestIpAttempts(req: express.Request) {
  const clientIp = getClientIp(req);
  const now = Date.now();
  return {
    clientIp,
    now,
    recent: (guestSearchAttemptsByIp.get(clientIp) || [])
    .filter(attempt => now - attempt < GUEST_SEARCH_RATE_LIMIT_WINDOW_MS),
  };
}

function getGuestRateLimitSecret() {
  return String(process.env.GUEST_RATE_LIMIT_SECRET || '').trim();
}

function getGuestRateLimitRef(req: express.Request) {
  const secret = getGuestRateLimitSecret();
  if (!secret) return null;
  return getDb().collection('guestSearchRateLimits').doc(createGuestSearchRateLimitId(getClientIp(req), secret));
}

function getGuestRateWindow(snapshot: FirebaseFirestore.DocumentSnapshot): { count: number; windowStartedAtMs: number } | null {
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  const startedAt = data?.windowStartedAt;
  const windowStartedAtMs = typeof startedAt?.toMillis === 'function' ? startedAt.toMillis() : 0;
  if (!Number.isFinite(windowStartedAtMs) || windowStartedAtMs <= 0) return null;
  return { count: Number(data?.count || 0), windowStartedAtMs };
}

async function hasGuestIpCapacity(req: express.Request) {
  const rateLimitRef = getGuestRateLimitRef(req);
  if (rateLimitRef) {
    const snapshot = await rateLimitRef.get();
    return isGuestSearchRateLimitAvailable(getGuestRateWindow(snapshot), Date.now());
  }
  const { recent } = getRecentGuestIpAttempts(req);
  return recent.length < 12;
}

function recordGuestIpAttempt(req: express.Request) {
  const { clientIp, now, recent } = getRecentGuestIpAttempts(req);
  recent.push(now);
  guestSearchAttemptsByIp.set(clientIp, recent);
}

async function verifySearchIdentity(req: express.Request, res: express.Response) {
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
    if (!await hasGuestIpCapacity(req)) {
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

async function verifyRequestIdentity(req: express.Request, res: express.Response) {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) {
    res.status(401).json({ ok: false, error: "Please refresh the page and try again." });
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid, isAnonymous: decoded.firebase?.sign_in_provider === "anonymous" };
  } catch (error) {
    console.error('[RequestAuth] Token verification failed:', error);
    res.status(401).json({ ok: false, error: "Please refresh the page and try again." });
    return null;
  }
}

async function commitGuestSearchUsage(req: express.Request, uid: string) {
  try {
    const usageRef = getDb().collection("guestSearchUsage").doc(uid);
    const rateLimitRef = getGuestRateLimitRef(req);
    const usage = await getDb().runTransaction(async transaction => {
      const snapshot = await transaction.get(usageRef);
      const count = Number(snapshot.data()?.count || 0);
      if (count >= GUEST_SEARCH_LIMIT) return { allowed: false, count };

      const now = Date.now();
      if (rateLimitRef) {
        const rateLimitSnapshot = await transaction.get(rateLimitRef);
        const currentWindow = getGuestRateWindow(rateLimitSnapshot);
        if (!isGuestSearchRateLimitAvailable(currentWindow, now)) return { allowed: false, count, rateLimited: true };
        const nextWindow = nextGuestSearchRateWindow(currentWindow, now);
        transaction.set(rateLimitRef, {
          count: nextWindow.count,
          windowStartedAt: Timestamp.fromMillis(nextWindow.windowStartedAtMs),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      const next = count + 1;
      transaction.set(usageRef, {
        count: next,
        updatedAt: FieldValue.serverTimestamp(),
        lastSearchAt: FieldValue.serverTimestamp()
      }, { merge: true });
      return { allowed: true, count: next };
    });

    if (!usage.allowed) return usage.rateLimited ? "rate_limit" as const : "limit" as const;
    recordGuestIpAttempt(req);
    return "committed" as const;
  } catch (error) {
    console.error("[SearchAuth] Failed to commit guest search usage:", error);
    return "unavailable" as const;
  }
}

async function verifySearchAppCheck(req: express.Request, res: express.Response) {
  if (String(process.env.FIREBASE_APP_CHECK_ENFORCE_API || '').toLowerCase() !== 'true') return true;
  const token = String(req.get('x-firebase-appcheck') || '').trim();
  if (!token) {
    res.status(401).json({ ok: false, error: 'Please refresh the page and try again.' });
    return false;
  }
  try {
    await getAdminAppCheck().verifyToken(token);
    return true;
  } catch (error) {
    console.error('[AppCheck] Request verification failed:', error);
    res.status(401).json({ ok: false, error: 'Please refresh the page and try again.' });
    return false;
  }
}

async function listAllAuthenticationIdentities() {
  const identities: Array<{
    uid: string;
    isAnonymous: boolean;
    email: string | null;
    displayName: string | null;
    createdAt: string | null;
    lastSignInAt: string | null;
    providers: string[];
    disabled: boolean;
  }> = [];
  let pageToken: string | undefined;

  do {
    const page = await getAdminAuth().listUsers(1000, pageToken);
    page.users.forEach(userRecord => {
      identities.push({
        uid: userRecord.uid,
        isAnonymous: !userRecord.email && !userRecord.phoneNumber && userRecord.providerData.length === 0,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        createdAt: userRecord.metadata.creationTime || null,
        lastSignInAt: userRecord.metadata.lastSignInTime || null,
        providers: userRecord.providerData.map(provider => provider.providerId),
        disabled: userRecord.disabled,
      });
    });
    pageToken = page.pageToken;
  } while (pageToken);

  return identities;
}

async function provisionMissingUserProfile(identity: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}) {
  const db = getDb();
  const profileRef = db.collection("users").doc(identity.uid);
  const preferencesRef = profileRef.collection("profile").doc("preferences");
  const email = String(identity.email || "").trim();
  const displayName = String(identity.displayName || email || "User").trim();
  const names = displayName.split(/\s+/).filter(Boolean);
  const owner = ADMIN_EMAILS.has(email.toLowerCase());
  const preferences = normaliseUserPreferences(null);
  let provisioned = false;

  await db.runTransaction(async transaction => {
    const profileSnapshot = await transaction.get(profileRef);
    const preferencesSnapshot = await transaction.get(preferencesRef);

    if (!profileSnapshot.exists) {
      transaction.create(profileRef, {
        uid: identity.uid,
        email,
        displayName,
        firstName: names[0] || (email ? email.split("@")[0] : "User"),
        lastName: names.length > 1 ? names.slice(1).join(" ") : "",
        phoneNumber: "",
        preferences,
        isPremium: owner,
        accessStatus: owner ? "paid" : "trial",
        trialStartedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        searchOnboardingDismissed: false,
        welcomeEmailSent: false,
      });
      provisioned = true;
    }

    if (!preferencesSnapshot.exists) {
      transaction.create(preferencesRef, {
        ...preferences,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });

  return provisioned;
}

interface EmailEventMeta {
  type?: string;
  source?: string;
  userId?: string | null;
  metadata?: Record<string, any>;
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
}: EmailEventMeta & {
  to?: string;
  subject?: string;
  from?: string;
  status: "sent" | "failed" | "simulated";
  simulated?: boolean;
  error?: any;
  response?: any;
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
      errorMessage: error ? (error?.message || String(error)) : null,
      errorName: error?.name || null,
      providerId: response?.id || response?.data?.id || null,
      metadata,
      createdAt: FieldValue.serverTimestamp()
    });
    if (status === 'failed' && !String(type).endsWith('_alert')) {
      await maybeSendEmailFailureAlert(type);
    }
  } catch (logErr) {
    console.error("[EmailLog] Failed to record email event:", logErr);
  }
}

async function maybeSendEmailFailureAlert(failedType: string) {
  try {
    const cutoff = Date.now() - 60 * 60 * 1000;
    const snapshot = await getDb().collection('emailEvents')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    const recentFailures = snapshot.docs
      .map((doc: any) => doc.data())
      .filter((event: any) => {
        const createdAt = event.createdAt;
        const createdAtMillis = typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : 0;
        return event.status === 'failed' && createdAtMillis >= cutoff;
      });
    const criticalTypes = new Set([
      'new_account_notification',
      'welcome_email',
      'trial_ending_reminder',
      'password_changed_confirmation'
    ]);
    const criticalFailure = criticalTypes.has(failedType) || recentFailures.some((event: any) => criticalTypes.has(event.type));
    if (!criticalFailure && recentFailures.length < 3) return;

    const stateRef = getDb().collection('emailFailureAlertState').doc('current');
    const state = (await stateRef.get()).data() || {};
    const lastAlertMillis = typeof state.lastAlertAt?.toMillis === 'function' ? state.lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < MONITORING_ALERT_COOLDOWN_MS) return;

    const failedTypes = [...new Set(recentFailures.map((event: any) => String(event.type || 'unspecified')))].slice(0, 8);
    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: 'DinnerByDesign email delivery issue detected',
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Email delivery issue detected</h2>
  <p>Recent transactional email failures have crossed the monitoring threshold.</p>
  <p><strong>${recentFailures.length}</strong> failed email attempts were recorded in the last hour.</p>
  <p style="color: #666; font-size: 13px;">Types: ${escapeHtml(failedTypes.join(', ') || failedType)}</p>
  <p>Review the Email log in the Admin Dashboard. Recipient content is not included in this alert.</p>
</div>
      `.trim()
    }, {
      type: 'email_delivery_alert',
      source: 'monitoring',
      metadata: { failureCount: recentFailures.length, failedTypes }
    });
    await stateRef.set({
      lastAlertAt: FieldValue.serverTimestamp(),
      failureCount: recentFailures.length,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('[EmailMonitoring] Failure alert evaluation failed:', error);
  }
}

async function sendTrackedEmail(
  email: { to: string; subject: string; html: string; from?: string; replyTo?: string },
  meta: EmailEventMeta
) {
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

async function updateSearchCanaryState(details: {
  status: 'passed' | 'failed';
  requestId: string;
  latencyMs: number;
  resultCount: number;
  errorCategory?: string | null;
}) {
  const stateRef = getDb().collection('searchCanaryState').doc('current');
  const currentSnapshot = await stateRef.get();
  const current = currentSnapshot.data() || {};
  const now = Date.now();
  const lastAlertAt = current.lastFailureAlertAt;
  const lastAlertMillis = typeof lastAlertAt?.toMillis === 'function' ? lastAlertAt.toMillis() : 0;
  const shouldAlert = details.status === 'failed'
    && (current.status !== 'failed' || now - lastAlertMillis >= 24 * 60 * 60 * 1000);

  let lastFailureAlertAt = current.lastFailureAlertAt || null;
  if (shouldAlert) {
    try {
      await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: 'DinnerByDesign search canary failed',
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Search canary failure</h2>
  <p>The scheduled production search check failed.</p>
  <p>Review <strong>Search assurance</strong> in the Admin Dashboard. No customer search allowance was used.</p>
  <p style="color: #666; font-size: 13px;">Latency: ${details.latencyMs}ms · Category: ${escapeHtml(details.errorCategory || 'unknown')}</p>
</div>
        `.trim()
      }, {
        type: 'search_canary_failure',
        source: 'search_canary',
        metadata: { requestId: details.requestId, status: details.status }
      });
      lastFailureAlertAt = FieldValue.serverTimestamp();
    } catch (error) {
      console.error('[SearchCanary] Failure alert could not be sent:', error);
    }
  }

  await stateRef.set({
    status: details.status,
    requestId: details.requestId,
    latencyMs: details.latencyMs,
    resultCount: details.resultCount,
    errorCategory: details.errorCategory || null,
    lastPassedAt: details.status === 'passed' ? FieldValue.serverTimestamp() : (current.lastPassedAt || null),
    lastFailedAt: details.status === 'failed' ? FieldValue.serverTimestamp() : (current.lastFailedAt || null),
    lastFailureAlertAt,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}

async function updateDeepHealthState(details: {
  status: 'passed' | 'failed';
  latencyMs: number;
  checks: Record<string, string>;
  errorCategory?: string | null;
}) {
  const stateRef = getDb().collection('deepHealthState').doc('current');
  const currentSnapshot = await stateRef.get();
  const current = currentSnapshot.data() || {};
  const now = Date.now();
  const lastAlertAt = current.lastFailureAlertAt;
  const lastAlertMillis = typeof lastAlertAt?.toMillis === 'function' ? lastAlertAt.toMillis() : 0;
  const shouldAlert = details.status === 'failed'
    && (current.status !== 'failed' || now - lastAlertMillis >= MONITORING_ALERT_COOLDOWN_MS);

  let lastFailureAlertAt = current.lastFailureAlertAt || null;
  if (shouldAlert) {
    try {
      await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: 'DinnerByDesign dependency health check failed',
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Dependency health check failed</h2>
  <p>The protected daily readiness check found a production dependency or configuration problem.</p>
  <p>Review the service health signals in the Admin Dashboard. No customer search allowance was used.</p>
  <p style="color: #666; font-size: 13px;">Checks: ${escapeHtml(JSON.stringify(details.checks))} · Latency: ${details.latencyMs}ms · Category: ${escapeHtml(details.errorCategory || 'unknown')}</p>
</div>
        `.trim()
      }, {
        type: 'deep_health_failure',
        source: 'deep_health_monitor',
        metadata: { checks: details.checks, status: details.status }
      });
      lastFailureAlertAt = FieldValue.serverTimestamp();
    } catch (error) {
      console.error('[DeepHealth] Failure alert could not be sent:', error);
    }
  }

  await stateRef.set({
    status: details.status,
    checks: details.checks,
    latencyMs: details.latencyMs,
    errorCategory: details.errorCategory || null,
    lastPassedAt: details.status === 'passed' ? FieldValue.serverTimestamp() : (current.lastPassedAt || null),
    lastFailedAt: details.status === 'failed' ? FieldValue.serverTimestamp() : (current.lastFailedAt || null),
    lastFailureAlertAt,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}

async function maybeSendSearchDeliveryAlert(details: {
  stage: string;
  source: string;
  deviceClass: string;
}) {
  if (!['failed', 'user_reported'].includes(details.stage)) return;

  try {
    const cutoff = Date.now() - 60 * 60 * 1000;
    const snapshot = await getDb().collection('searchDeliveryEvents')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();
    const recentEvents = snapshot.docs
      .map((doc: any) => doc.data())
      .filter((event: any) => {
        const createdAt = event.createdAt;
        const createdAtMillis = typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : 0;
        return createdAtMillis >= cutoff;
      });
    const failures = recentEvents.filter((event: any) => event.stage === 'failed');
    const reports = recentEvents.filter((event: any) => event.stage === 'user_reported');
    const shouldAlert = failures.length >= 3 || reports.length >= 2;
    if (!shouldAlert) return;

    const stateRef = getDb().collection('searchDeliveryAlertState').doc('current');
    const stateSnapshot = await stateRef.get();
    const state = stateSnapshot.data() || {};
    const lastAlertAt = state.lastAlertAt;
    const lastAlertMillis = typeof lastAlertAt?.toMillis === 'function' ? lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < 24 * 60 * 60 * 1000) return;

    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: 'DinnerByDesign search issues detected',
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Search issues detected</h2>
  <p>The last hour contains repeated search failures or user reports.</p>
  <p><strong>${failures.length}</strong> failed searches and <strong>${reports.length}</strong> user reports were recorded.</p>
  <p>Most recent signal: ${escapeHtml(details.source)} on ${escapeHtml(details.deviceClass)}.</p>
  <p>Review Search assurance in the Admin Dashboard. Search text and user details are not included.</p>
</div>
      `.trim()
    }, {
      type: 'search_delivery_alert',
      source: 'search_telemetry',
      metadata: {
        failureCount: failures.length,
        reportCount: reports.length,
        source: details.source,
        deviceClass: details.deviceClass
      }
    });

    await stateRef.set({
      lastAlertAt: FieldValue.serverTimestamp(),
      failureCount: failures.length,
      reportCount: reports.length,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('[SearchTelemetry] Delivery alert evaluation failed:', error);
  }
}

async function recordStripeWebhookEvent(event: any, status: "processing" | "succeeded" | "failed", details: Record<string, any> = {}) {
  try {
    const eventId = event?.id || `unverified_${Date.now()}`;
    const record: Record<string, any> = {
      eventId,
      type: event?.type || "unknown",
      status,
      stripeCreatedAt: event?.created ? Timestamp.fromMillis(event.created * 1000) : null,
      receivedAt: details.receivedAt || FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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

async function claimStripeWebhookEvent(event: any) {
  const eventId = String(event?.id || '').trim();
  if (!eventId) return { status: 'process' as const, eventId: null };

  const eventRef = getDb().collection('stripeWebhookEvents').doc(eventId);
  const now = Date.now();
  return getDb().runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(eventRef);
    const decision = getWebhookClaimDecision(snapshot.data(), now, STRIPE_WEBHOOK_PROCESSING_LEASE_MS);
    if (decision !== 'process') return { status: decision, eventId };

    transaction.set(eventRef, {
      eventId,
      type: event?.type || 'unknown',
      status: 'processing',
      stripeCreatedAt: event?.created ? Timestamp.fromMillis(event.created * 1000) : null,
      processingStartedAt: Timestamp.fromMillis(now),
      receivedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      message: 'Webhook claimed for processing',
      error: null,
    }, { merge: true });

    return { status: 'process' as const, eventId };
  });
}

async function hasLiveAuthenticationIdentity(uid: string) {
  try {
    await getAdminAuth().getUser(uid);
    return true;
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found') return false;
    throw error;
  }
}

async function claimUserEmailSend(userRef: any, sentField: string) {
  const sendingField = `${sentField}SendingAt`;
  const now = Date.now();

  return getDb().runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return false;

    const data = snapshot.data() || {};
    if (data[sentField] === true || isFreshEmailClaim(data[sendingField], now)) return false;

    transaction.update(userRef, {
      [sendingField]: Timestamp.fromMillis(now),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

async function completeUserEmailSend(userRef: any, sentField: string) {
  const sendingField = `${sentField}SendingAt`;
  await getDb().runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return;

    transaction.update(userRef, {
      [sentField]: true,
      [`${sentField}At`]: FieldValue.serverTimestamp(),
      [sendingField]: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

async function releaseUserEmailSend(userRef: any, sentField: string) {
  const sendingField = `${sentField}SendingAt`;
  try {
    await getDb().runTransaction(async (transaction: any) => {
      const snapshot = await transaction.get(userRef);
      if (!snapshot.exists) return;
      transaction.update(userRef, { [sendingField]: FieldValue.delete() });
    });
  } catch (error) {
    console.error(`[Email] Failed to release ${sentField} claim:`, error);
  }
}

async function claimUserInvoiceEmailSend(userRef: any, invoiceId: string) {
  const sendingField = 'subscriptionPaymentFailedEmailSendingAt';
  const sendingInvoiceField = 'subscriptionPaymentFailedEmailSendingInvoiceId';
  const now = Date.now();

  return getDb().runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return false;

    const data = snapshot.data() || {};
    if (data.subscriptionPaymentFailedEmailLastInvoiceId === invoiceId) return false;
    if (
      data[sendingInvoiceField] === invoiceId
      && isFreshEmailClaim(data[sendingField], now)
    ) return false;

    transaction.update(userRef, {
      [sendingInvoiceField]: invoiceId,
      [sendingField]: Timestamp.fromMillis(now),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

async function completeUserInvoiceEmailSend(userRef: any, invoiceId: string) {
  await getDb().runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists) return;

    transaction.update(userRef, {
      subscriptionPaymentFailedEmailLastInvoiceId: invoiceId,
      subscriptionPaymentFailedEmailSentAt: FieldValue.serverTimestamp(),
      subscriptionPaymentFailedEmailSendingInvoiceId: FieldValue.delete(),
      subscriptionPaymentFailedEmailSendingAt: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

async function releaseUserInvoiceEmailSend(userRef: any) {
  try {
    await getDb().runTransaction(async (transaction: any) => {
      const snapshot = await transaction.get(userRef);
      if (!snapshot.exists) return;
      transaction.update(userRef, {
        subscriptionPaymentFailedEmailSendingInvoiceId: FieldValue.delete(),
        subscriptionPaymentFailedEmailSendingAt: FieldValue.delete(),
      });
    });
  } catch (error) {
    console.error('[Email] Failed to release payment-failure email claim:', error);
  }
}

function estimateTokensFromChars(chars: number) {
  return Math.ceil(Math.max(chars || 0, 0) / 4);
}

function classifyAiRequest(searchParams: any) {
  const query = String(searchParams?.query || '').toLowerCase();
  if (
    query.includes('cooked dinners for') ||
    query.includes('ready-made dinner products') ||
    query.includes('ready-made ') ||
    query.includes('weekday cooked') ||
    query.includes('weekly')
  ) {
    return 'weekly_plan';
  }
  return searchParams?.source === 'ready-made' ? 'ready_made_search' : 'recipe_search';
}

async function recordAiUsageEvent(details: Record<string, any>) {
  try {
    const now = new Date();
    await getDb().collection("aiUsageEvents").add({
      ...details,
      dateKey: now.toISOString().slice(0, 10),
      createdAt: FieldValue.serverTimestamp()
    });
    if (details.status === 'failed') {
      await maybeSendAiFailureAlert(String(details.errorCategory || details.failureStage || 'unknown'));
    }
  } catch (logErr) {
    console.error("[Usage] Failed to record usage event:", logErr);
  }
}

function scheduleAiUsageEvent(details: Record<string, any>) {
  waitUntil(recordAiUsageEvent(details));
}

async function maybeSendAiFailureAlert(failedCategory: string) {
  try {
    const cutoff = Date.now() - 60 * 60 * 1000;
    const snapshot = await getDb().collection('aiUsageEvents')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();
    const recentFailures = snapshot.docs
      .map((doc: any) => doc.data())
      .filter((event: any) => {
        const createdAt = event.createdAt;
        const createdAtMillis = typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : 0;
        return event.status === 'failed' && createdAtMillis >= cutoff;
      });
    const criticalPattern = /auth|permission|quota|rate|limit|unauthori[sz]ed|forbidden|capacity/i;
    const criticalFailure = criticalPattern.test(failedCategory)
      || recentFailures.some((event: any) => criticalPattern.test(String(event.errorCategory || event.failureStage || '')));
    if (!criticalFailure && recentFailures.length < 3) return;

    const stateRef = getDb().collection('aiFailureAlertState').doc('current');
    const state = (await stateRef.get()).data() || {};
    const lastAlertMillis = typeof state.lastAlertAt?.toMillis === 'function' ? state.lastAlertAt.toMillis() : 0;
    if (Date.now() - lastAlertMillis < MONITORING_ALERT_COOLDOWN_MS) return;

    const categories = [...new Set(recentFailures.map((event: any) => String(event.errorCategory || event.failureStage || 'unknown')))].slice(0, 8);
    await sendTrackedEmail({
      to: CONTACT_RECIPIENT,
      subject: 'DinnerByDesign AI service issue detected',
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">AI service issue detected</h2>
  <p>Recent AI request failures have crossed the monitoring threshold.</p>
  <p><strong>${recentFailures.length}</strong> failed AI requests were recorded in the last hour.</p>
  <p style="color: #666; font-size: 13px;">Categories: ${escapeHtml(categories.join(', ') || failedCategory)}</p>
  <p>Review Service Health in the Admin Dashboard. Search text and account details are not included in this alert.</p>
</div>
      `.trim()
    }, {
      type: 'ai_service_alert',
      source: 'monitoring',
      metadata: { failureCount: recentFailures.length, categories }
    });
    await stateRef.set({
      lastAlertAt: FieldValue.serverTimestamp(),
      failureCount: recentFailures.length,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('[AiMonitoring] Failure alert evaluation failed:', error);
  }
}

function normaliseSearchRequestId(value: unknown): string | null {
  const requestId = String(value || '').trim();
  return /^[a-zA-Z0-9-]{8,80}$/.test(requestId) ? requestId : null;
}

function isAuthorisedCronRequest(req: express.Request) {
  const cronSecret = String(process.env.CRON_SECRET || '').trim();
  const authorization = req.get('authorization') || '';
  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}

// Safe path resolution for ESM/cjs
let _filename = "";
let _dirname = "";

try {
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    _filename = fileURLToPath(import.meta.url);
    _dirname = path.dirname(_filename);
  } else if (typeof __filename !== 'undefined') {
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

export function createApp() {
  console.log(`[API] Booting app (env: ${process.env.NODE_ENV})...`);
  const app = express();
  const isProdEnv = process.env.NODE_ENV === "production";

  // Simplified CORS setup allowing all origins for /api endpoints to support Vercel deployments
  app.use("/api", cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  }));

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    const redirectPath = getPublicPageRedirect(req.path);
    if (!redirectPath) {
      return next();
    }

    return res.redirect(308, redirectPath);
  });

  app.use((req, res, next) => {
    if (req.path === "/api/stripe-webhook") return next();
    return express.json()(req, res, next);
  });

  app.get("/api/connection-test", (req, res) => {
    if (isProdEnv) { return res.status(404).json({ ok: false }); }
    res.json({ 
      ok: true, 
      time: new Date().toISOString(),
      env: {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      geminiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  app.get("/api/health/deep", async (req, res) => {
    if (!isAuthorisedCronRequest(req)) {
      return res.status(process.env.CRON_SECRET ? 401 : 503).json({
        ok: false,
        error: process.env.CRON_SECRET ? "Unauthorised." : "Deep health monitoring is not configured."
      });
    }

    const startedAt = Date.now();
    const checks: Record<string, string> = {
      firestore: 'not_checked',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      backups: String(process.env.FIRESTORE_BACKUP_MONITORING_ENABLED || '').toLowerCase() === 'true'
        ? 'not_checked'
        : 'not_configured'
    };
    let errorCategory: string | null = null;

    try {
      await getDb().collection('monitoring').doc('readiness').get();
      checks.firestore = 'ok';
    } catch (error: any) {
      checks.firestore = 'failed';
      errorCategory = String(error?.code || error?.name || 'firestore_unavailable').slice(0, 80);
      console.error('[DeepHealth] Firestore readiness check failed:', error);
    }

    if (checks.backups === 'not_checked') {
      try {
        const backupCheck = await checkFirestoreBackups();
        checks.backups = backupCheck.status;
        if (backupCheck.status === 'failed') errorCategory ||= backupCheck.errorCategory || 'backup_check_failed';
      } catch (error: any) {
        checks.backups = 'failed';
        errorCategory ||= String(error?.code || error?.name || 'backup_check_failed').slice(0, 80);
        console.error('[DeepHealth] Firestore backup check failed:', error);
      }
    }

    const latencyMs = Date.now() - startedAt;
    const healthy = checks.firestore === 'ok'
      && checks.gemini === 'configured'
      && checks.backups !== 'failed';
    try {
      await updateDeepHealthState({
        status: healthy ? 'passed' : 'failed',
        latencyMs,
        checks,
        errorCategory: healthy ? null : (errorCategory || 'configuration_missing')
      });
    } catch (error) {
      console.error('[DeepHealth] State update failed:', error);
    }

    return res.status(healthy ? 200 : 503).json({
      ok: healthy,
      status: healthy ? 'ok' : 'failed',
      checks,
      latencyMs
    });
  });

  app.get("/api/monitor/search-canary", async (req, res) => {
    if (!isAuthorisedCronRequest(req)) {
      return res.status(process.env.CRON_SECRET ? 401 : 503).json({
        ok: false,
        error: process.env.CRON_SECRET ? "Unauthorised." : "Search canary monitoring is not configured."
      });
    }

    const startedAt = Date.now();
    const requestId = `canary-${Date.now()}`;
    const searchParams: SearchParams = {
      query: 'pasta',
      source: 'cook',
      count: 1,
      telemetryRequestId: requestId
    };

    try {
      const result = await generateDinnerSuggestions(searchParams);
      const resultCount = (result?.recipes?.length || 0) + (result?.readyMeals?.length || 0);
      const deliverable = isDeliverableSearchResult(result);
      const latencyMs = Date.now() - startedAt;

      await getDb().collection('searchCanaryEvents').add({
        requestId,
        status: deliverable ? 'passed' : 'failed',
        source: 'cook',
        resultCount,
        latencyMs,
        createdAt: FieldValue.serverTimestamp()
      });
      await updateSearchCanaryState({
        status: deliverable ? 'passed' : 'failed',
        requestId,
        latencyMs,
        resultCount,
        errorCategory: deliverable ? null : 'undeliverable_response'
      });
      await recordAiUsageEvent({
        requestId,
        type: 'search_canary',
        source: 'cook',
        model: result?.diagnostics?.usage?.model || ACTIVE_GEMINI_MODEL,
        status: deliverable ? 'succeeded' : 'failed',
        failureStage: deliverable ? null : 'undeliverable_response',
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
        return res.status(503).json({ ok: false, status: 'failed', latencyMs });
      }

      return res.json({ ok: true, status: 'passed', resultCount, latencyMs });
    } catch (error: any) {
      const latencyMs = Date.now() - startedAt;
      await getDb().collection('searchCanaryEvents').add({
        requestId,
        status: 'failed',
        source: 'cook',
        resultCount: 0,
        latencyMs,
        errorCategory: String(error?.category || error?.name || 'unknown').slice(0, 80),
        createdAt: FieldValue.serverTimestamp()
      });
      await updateSearchCanaryState({
        status: 'failed',
        requestId,
        latencyMs,
        resultCount: 0,
        errorCategory: String(error?.category || error?.name || 'unknown').slice(0, 80)
      });
      await recordAiUsageEvent({
        requestId,
        type: 'search_canary',
        source: 'cook',
        model: ACTIVE_GEMINI_MODEL,
        status: 'failed',
        failureStage: 'request_error',
        queryLength: searchParams.query.length,
        requestedCount: searchParams.count,
        resultCount: 0,
        serverLatencyMs: latencyMs,
        estimatedCostUsd: 0,
        errorCategory: String(error?.category || error?.name || 'unknown').slice(0, 80)
      });
      console.error('[SearchCanary] Production canary failed:', error);
      return res.status(503).json({ ok: false, status: 'failed', latencyMs });
    }
  });

  app.get("/api/admin/accounts/reconciliation", async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;

    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get(),
      ]);
      const profileIds = profileSnapshot.docs.map((profile: any) => profile.id);
      const summary = summariseAccountReconciliation(
        identities,
        profileIds,
      );
      const registeredWithoutProfileAccounts = findRegisteredIdentitiesWithoutProfiles(
        identities,
        profileIds,
      )
        .map(identity => ({
          uid: identity.uid,
          email: identity.email,
          displayName: identity.displayName,
          createdAt: identity.createdAt,
          lastSignInAt: identity.lastSignInAt,
          providers: identity.providers,
          disabled: identity.disabled,
        }))
        .sort((a, b) => {
          const bCreatedAt = b.createdAt ? Date.parse(b.createdAt) : 0;
          const aCreatedAt = a.createdAt ? Date.parse(a.createdAt) : 0;
          return bCreatedAt - aCreatedAt;
        });
      const anonymousWithoutProfileUids = findAnonymousIdentitiesWithoutProfiles(
        identities,
        profileIds,
      ).map(identity => identity.uid);

      return res.json({
        ok: true,
        summary: {
          ...summary,
          registeredWithoutProfileAccounts,
          anonymousWithoutProfileUids,
        },
        checkedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[AdminAccounts] Reconciliation failed:", error);
      return res.status(503).json({
        ok: false,
        error: "Account reconciliation is unavailable. Server-side Firebase administration must be configured.",
      });
    }
  });

  app.post("/api/admin/accounts/repair-profiles", express.json(), async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;

    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get(),
      ]);
      const profileIds = profileSnapshot.docs.map((profile: any) => profile.id);
      const missingIdentities = findRegisteredIdentitiesWithoutProfiles(identities, profileIds);
      let provisionedCount = 0;

      for (const identity of missingIdentities) {
        if (await provisionMissingUserProfile(identity)) provisionedCount += 1;
      }

      const remainingProfileSnapshot = await getDb().collection("users").get();
      const remainingProfileIds = remainingProfileSnapshot.docs.map((profile: any) => profile.id);
      const remainingCount = findRegisteredIdentitiesWithoutProfiles(identities, remainingProfileIds).length;

      return res.json({
        ok: true,
        reviewedCount: missingIdentities.length,
        provisionedCount,
        skippedCount: missingIdentities.length - provisionedCount,
        remainingCount,
      });
    } catch (error) {
      console.error("[AdminAccounts] Profile repair failed:", error);
      return res.status(500).json({
        ok: false,
        error: "The missing account profiles could not be created. Please try again.",
      });
    }
  });

  app.post("/api/admin/accounts/send-missing-welcome-emails", express.json(), async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;

    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get(),
      ]);
      const identitiesByUid = new Map(identities.map(identity => [identity.uid, identity]));
      const candidates = profileSnapshot.docs
        .map((profile: any) => ({ uid: profile.id, data: profile.data() || {} }))
        .filter(({ uid, data }) => {
          const identity = identitiesByUid.get(uid);
          return data.welcomeEmailSent !== true && !!identity?.email;
        })
        .map(({ uid, data }) => {
          const identity = identitiesByUid.get(uid)!;
          return {
            uid,
            email: String(identity.email || data.email || "").trim(),
            displayName: String(data.displayName || identity.displayName || identity.email || "User").trim(),
          };
        })
        .filter(candidate => candidate.email.length > 0);

      const sent: string[] = [];
      const failed: Array<{ email: string; error: string }> = [];
      const skipped: string[] = [];

      for (const candidate of candidates) {
        const profileRef = getDb().collection("users").doc(candidate.uid);
        const claimed = await claimUserEmailSend(profileRef, "welcomeEmailSent");
        if (!claimed) {
          skipped.push(candidate.email);
          continue;
        }

        try {
          await sendTrackedEmail({
            to: candidate.email,
            subject: "Welcome to DinnerByDesign",
            html: renderWelcomeEmailHtml(candidate.displayName),
            from: "DinnerByDesign <terence@dinnerbydesign.app>",
          }, {
            type: "welcome",
            source: "admin_repair",
            userId: candidate.uid,
          });
          await completeUserEmailSend(profileRef, "welcomeEmailSent");
          sent.push(candidate.email);
        } catch (error: any) {
          await releaseUserEmailSend(profileRef, "welcomeEmailSent");
          failed.push({
            email: candidate.email,
            error: String(error?.message || "Email delivery failed.").slice(0, 240),
          });
        }
      }

      return res.json({
        ok: failed.length === 0,
        candidateCount: candidates.length,
        sentCount: sent.length,
        skippedCount: skipped.length,
        failedCount: failed.length,
        sent,
        skipped,
        failed,
      });
    } catch (error) {
      console.error("[AdminAccounts] Welcome email repair failed:", error);
      return res.status(500).json({
        ok: false,
        error: "The missing welcome emails could not be sent. Please try again.",
      });
    }
  });

  app.post("/api/admin/monitoring/access", async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;

    try {
      const requestedPath = String(req.body?.path || '/admin').split('?')[0].slice(0, 120) || '/admin';
      const deviceClass = ['mobile', 'tablet', 'desktop'].includes(req.body?.deviceClass)
        ? req.body.deviceClass
        : 'unknown';
      await getDb().collection('adminAccessEvents').add({
        event: 'dashboard_opened',
        userId: admin.uid,
        email: String(admin.email || '').toLowerCase() || null,
        path: requestedPath,
        deviceClass,
        createdAt: FieldValue.serverTimestamp()
      });
      return res.status(204).send();
    } catch (error) {
      console.error('[AdminMonitoring] Failed to record administrator access:', error);
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/admin/accounts/cleanup", express.json(), async (req, res) => {
    const admin = await verifyAdminRequest(req, res);
    if (!admin) return;

    const category = String(req.body?.category || "");
    const requestedUids: string[] = Array.isArray(req.body?.uids)
      ? [...new Set<string>(
          req.body.uids
            .map((uid: unknown) => String(uid || "").trim())
            .filter((uid: string) => uid.length > 0),
        )]
      : [];

    if (!["registered_without_profile", "anonymous_without_profile"].includes(category)) {
      return res.status(400).json({ ok: false, error: "A valid cleanup category is required." });
    }
    if (requestedUids.length === 0 || requestedUids.length > 1000 || requestedUids.some(uid => uid.length > 128)) {
      return res.status(400).json({ ok: false, error: "Between 1 and 1,000 valid account identifiers are required." });
    }
    if (requestedUids.includes(admin.uid)) {
      return res.status(400).json({ ok: false, error: "The administrative account cannot be included." });
    }

    try {
      const [identities, profileSnapshot] = await Promise.all([
        listAllAuthenticationIdentities(),
        getDb().collection("users").get(),
      ]);
      const profileIds = profileSnapshot.docs.map((profile: any) => profile.id);
      const eligibleIdentities = category === "registered_without_profile"
        ? findRegisteredIdentitiesWithoutProfiles(identities, profileIds)
        : findAnonymousIdentitiesWithoutProfiles(identities, profileIds);
      const eligibleByUid = new Map(eligibleIdentities.map(identity => [identity.uid, identity]));
      const invalidUids = requestedUids.filter(uid => {
        const identity = eligibleByUid.get(uid);
        const email = String(identity?.email || "").toLowerCase();
        return !identity || ADMIN_EMAILS.has(email);
      });

      if (invalidUids.length > 0) {
        return res.status(409).json({
          ok: false,
          error: "Cleanup stopped because one or more accounts no longer match the reviewed category.",
          invalidCount: invalidUids.length,
        });
      }

      const result = await getAdminAuth().deleteUsers(requestedUids);
      if (result.failureCount > 0) {
        return res.status(500).json({
          ok: false,
          error: `${result.failureCount} account identities could not be deleted.`,
          successCount: result.successCount,
          failureCount: result.failureCount,
        });
      }

      return res.json({
        ok: true,
        category,
        deletedCount: result.successCount,
      });
    } catch (error) {
      console.error("[AdminAccounts] Cleanup failed:", error);
      return res.status(500).json({
        ok: false,
        error: "The reviewed account identities could not be deleted.",
      });
    }
  });

  app.delete("/api/admin/accounts/:uid", async (req, res) => {
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
      let authenticationRecord: any = null;

      try {
        authenticationRecord = await getAdminAuth().getUser(targetUid);
      } catch (error: any) {
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
        profileDataDeleted: profileSnapshot.exists,
      });
    } catch (error) {
      console.error(`[AdminAccounts] Failed to delete ${targetUid}:`, error);
      return res.status(500).json({
        ok: false,
        error: "The complete account could not be deleted.",
      });
    }
  });

  // Stripe lazy initialization
  let stripe: any = null;
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

  app.post("/api/search-telemetry", async (req, res) => {
    const authorization = req.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return res.status(401).json({ ok: false });

    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      const requestId = normaliseSearchRequestId(req.body?.requestId);
      const stage = String(req.body?.stage || '');
      const source = req.body?.source === 'ready-made' ? 'ready-made' : req.body?.source === 'cook' ? 'cook' : null;
      const allowedStages = new Set(['started', 'results_delivered', 'no_results_delivered', 'failed', 'cancelled', 'user_reported']);

      if (!requestId || !allowedStages.has(stage) || !source) {
        return res.status(400).json({ ok: false, error: "Invalid search telemetry event." });
      }

      const durationMs = Number.isFinite(Number(req.body?.durationMs))
        ? Math.max(0, Math.min(300000, Number(req.body.durationMs)))
        : null;
      const resultCount = Number.isFinite(Number(req.body?.resultCount))
        ? Math.max(0, Math.min(100, Number(req.body.resultCount)))
        : null;
      const viewportWidth = Number.isFinite(Number(req.body?.viewportWidth))
        ? Math.max(0, Math.min(5000, Number(req.body.viewportWidth)))
        : null;

      await getDb().collection("searchDeliveryEvents").add({
        requestId,
        stage,
        source,
        durationMs,
        resultCount,
        errorCategory: String(req.body?.errorCategory || '').slice(0, 80) || null,
        deviceClass: ['mobile', 'tablet', 'desktop'].includes(req.body?.deviceClass) ? req.body.deviceClass : 'unknown',
        viewportWidth,
        userId: decoded.uid,
        isAnonymous: decoded.firebase?.sign_in_provider === 'anonymous',
        createdAt: FieldValue.serverTimestamp()
      });
      await maybeSendSearchDeliveryAlert({
        stage,
        source,
        deviceClass: ['mobile', 'tablet', 'desktop'].includes(req.body?.deviceClass) ? req.body.deviceClass : 'unknown'
      });

      return res.status(204).send();
    } catch (error) {
      console.error("[SearchTelemetry] Failed to record client event:", error);
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/client-errors", async (req, res) => {
    if (!hasClientErrorRateLimitCapacity(req)) {
      return res.status(429).json({ ok: false });
    }

    const allowedKinds = new Set(['runtime', 'unhandled_rejection', 'boundary', 'dynamic_import', 'resource']);
    const kind = String(req.body?.kind || '');
    const message = sanitiseClientErrorText(req.body?.message, 2000);
    if (!allowedKinds.has(kind) || !message) {
      return res.status(400).json({ ok: false, error: 'Invalid client error event.' });
    }

    let userId: string | null = null;
    let isAnonymous: boolean | null = null;
    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (token) {
      try {
        const decoded = await getAdminAuth().verifyIdToken(token);
        userId = decoded.uid;
        isAnonymous = decoded.firebase?.sign_in_provider === 'anonymous';
      } catch {
        // Client diagnostics remain useful before authentication finishes.
      }
    }

    try {
      await getDb().collection('clientErrorEvents').add({
        kind,
        message,
        stack: sanitiseClientErrorText(req.body?.stack, 3000) || null,
        source: sanitiseClientErrorText(req.body?.source, 500) || null,
        path: sanitiseClientErrorText(req.body?.path, 300) || '/',
        deviceClass: ['mobile', 'tablet', 'desktop'].includes(req.body?.deviceClass) ? req.body.deviceClass : 'unknown',
        viewportWidth: Number.isFinite(Number(req.body?.viewportWidth))
          ? Math.max(0, Math.min(5000, Number(req.body.viewportWidth)))
          : null,
        userId,
        isAnonymous,
        createdAt: FieldValue.serverTimestamp()
      });
      return res.status(204).send();
    } catch (error) {
      console.error('[ClientErrors] Failed to record browser error:', error);
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/ai-created-dinners", async (req, res) => {
    if (!THREE_WAY_SEARCH_PILOT) {
      return res.status(404).json({ ok: false, error: "AI-created dinners are not available right now." });
    }

    if (!await verifySearchAppCheck(req, res)) return;
    const searchIdentity = await verifySearchIdentity(req, res);
    if (!searchIdentity) return;

    const startedAt = Date.now();
    const brief = String(req.body?.brief || '').replace(/\s+/g, ' ').trim().slice(0, 500);
    if (!brief) {
      return res.status(400).json({ ok: false, error: "Add a dinner brief before generating choices." });
    }

    const preferences = normaliseUserPreferences(req.body?.preferences);
    const strictIngredientMatch = req.body?.strictIngredientMatch === true;
    try {
      const choices = await generateInternalDinnerChoices(brief, preferences, strictIngredientMatch);
      if (choices.length === 0) {
        scheduleAiUsageEvent({
          type: 'ai_created_dinner',
          source: 'ai-created',
          model: ACTIVE_GEMINI_MODEL,
          status: 'failed',
          userId: searchIdentity.uid,
          requestedCount: 3,
          resultCount: choices.length,
          queryLength: brief.length,
          serverLatencyMs: Date.now() - startedAt,
          estimatedCostUsd: 0,
          failureStage: 'underfilled_choices',
          errorCategory: 'model'
        });
        return res.status(503).json({
          ok: false,
          error: "We could not create a suitable choice this time. Please try a broader brief or adjust your preferences."
        });
      }

      const partialChoices = choices.length < 3;

      if (searchIdentity.isAnonymous) {
        const usageCommit = await commitGuestSearchUsage(req, searchIdentity.uid);
        if (usageCommit === "limit") {
          return res.status(403).json({ ok: false, error: "You've used your 3 free searches. Create an account to start your 7-day trial." });
        }
        if (usageCommit === "rate_limit") {
          return res.status(429).json({ ok: false, error: "Guest search access is temporarily limited. Please create an account to continue." });
        }
        if (usageCommit === "unavailable") {
          return res.status(503).json({ ok: false, error: "Your search could not be completed. Please try again in a moment." });
        }
      }

      scheduleAiUsageEvent({
        type: 'ai_created_dinner',
        source: 'ai-created',
        model: ACTIVE_GEMINI_MODEL,
        status: 'succeeded',
        userId: searchIdentity.uid,
        requestedCount: 3,
        resultCount: choices.length,
        partial: partialChoices,
        queryLength: brief.length,
        serverLatencyMs: Date.now() - startedAt,
        estimatedCostUsd: 0
      });

      return res.json({ choices, partial: partialChoices });
    } catch (error: any) {
      console.error('[AiCreatedDinners] Generation failed:', error);
      scheduleAiUsageEvent({
        type: 'ai_created_dinner',
        source: 'ai-created',
        model: ACTIVE_GEMINI_MODEL,
        status: 'failed',
        userId: searchIdentity.uid,
        requestedCount: 3,
        resultCount: 0,
        queryLength: brief.length,
        serverLatencyMs: Date.now() - startedAt,
        estimatedCostUsd: 0,
        errorCategory: String(error?.category || error?.name || 'model').slice(0, 80)
      });
      return res.status(503).json({
        ok: false,
        error: "AI-created dinners are temporarily unavailable. Please try again shortly."
      });
    }
  });

  app.post("/api/generate-suggestions", async (req, res) => {
    console.log(`[API] Received request for /api/generate-suggestions`);
    const requestStartedAt = Date.now();
    const requestId = normaliseSearchRequestId(req.body?.requestId || req.body?.searchParams?.telemetryRequestId);
    try {
      if (!await verifySearchAppCheck(req, res)) return;
      const searchIdentity = await verifySearchIdentity(req, res);
      if (!searchIdentity) return;
      const { searchParams: rawSearchParams, preferences } = req.body;
      const validation = validateSearchRequestPayload(rawSearchParams, preferences);
      if ('code' in validation) {
        return res.status(400).json({
          ok: false,
          error: {
            code: validation.code,
            message: validation.message,
            retryable: false,
            status: 400,
            category: 'request'
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
        scheduleAiUsageEvent({
          requestId,
          type: classifyAiRequest(searchParams),
          source: searchParams.source || 'cook',
          model: ACTIVE_GEMINI_MODEL,
          status: 'failed',
          failureStage: 'undeliverable_response',
          queryLength: String(searchParams.query || '').length,
          requestedCount: searchParams.count || 3,
          resultCount: 0,
          serverLatencyMs: Date.now() - requestStartedAt,
          estimatedCostUsd: 0,
          errorCategory: 'model'
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

      if (searchIdentity.isAnonymous && hasDeliveredSearchChoices(result)) {
        const usageCommit = await commitGuestSearchUsage(req, searchIdentity.uid);
        if (usageCommit === "limit") {
          return res.status(403).json({ ok: false, error: "You've used your 3 free searches. Create an account to start your 7-day trial." });
        }
        if (usageCommit === "rate_limit") {
          return res.status(429).json({
            ok: false,
            error: {
              code: "GUEST_SEARCH_RATE_LIMITED",
              message: "Guest search access is temporarily limited. Please create an account to continue.",
              retryable: true,
              status: 429,
              category: "rate_limit"
            }
          });
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
      const inputTokens = usage?.inputTokensEstimate || estimateTokensFromChars((usage?.inputChars || 0) || String(searchParams.query || '').length);
      const outputTokens = usage?.outputTokensEstimate || estimateTokensFromChars(JSON.stringify(result || {}).length);
      scheduleAiUsageEvent({
        requestId,
        type: classifyAiRequest(searchParams),
        source: searchParams.source || 'cook',
        model: usage?.model || ACTIVE_GEMINI_MODEL,
        status: 'succeeded',
        queryLength: String(searchParams.query || '').length,
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
    } catch (error: any) {
      console.error("[Server API] Gemini Search Error:", error);
      logApiError("generate-suggestions", error);
      const failedSearchParams = req.body?.searchParams || {};
      scheduleAiUsageEvent({
        requestId,
        type: classifyAiRequest(failedSearchParams),
        source: failedSearchParams.source || 'cook',
        model: ACTIVE_GEMINI_MODEL,
        status: 'failed',
        queryLength: String(failedSearchParams.query || '').length,
        requestedCount: failedSearchParams.count || 3,
        resultCount: 0,
        latencyMs: null,
        totalRoundTripMs: null,
        serverLatencyMs: Date.now() - requestStartedAt,
        inputTokensEstimate: estimateTokensFromChars(String(failedSearchParams.query || '').length),
        outputTokensEstimate: 0,
        estimatedCostUsd: 0,
        errorCategory: error.category || 'model'
      });
      
      const category = error.category || 'model';
      let message = error.message || "Internal search service error";
      
      // Prevent HTML leakage
      if (message.includes('<!DOCTYPE html>') || message.includes('<html')) {
        message = "Search is temporarily unavailable. Please try again.";
      }

      // Convert any high-demand/temporary/quota error into a clean user-friendly plain English notice
      const messageLower = message.toLowerCase();
      const isPermission =
        category === 'permission' ||
        messageLower.includes("permission_denied") ||
        messageLower.includes("permission denied") ||
        messageLower.includes("lightning dunning") ||
        (messageLower.includes("deny") && messageLower.includes("project"));
      const isTransient = 
        messageLower.includes("high demand") ||
        messageLower.includes("503") ||
        messageLower.includes("unavailable") ||
        messageLower.includes("overloaded") ||
        messageLower.includes("capacity") ||
        messageLower.includes("deadline exceeded") ||
        messageLower.includes("temporary") ||
        messageLower.includes("apierror") ||
        messageLower.includes("internal error");

      const isQuota = category === 'quota' || messageLower.includes("quota") || messageLower.includes("limit") || messageLower.includes("resource exhausted");

      if (isPermission || isTransient || isQuota) {
        message = isPermission
          ? "Recipe search is temporarily unavailable because the search service account needs attention. This is on our side, so please try again later."
          : isQuota 
          ? "Our search service is currently at capacity due to high demand. You didn't do anything wrong! Please wait about 60 seconds and try again."
          : "Our search provider is experiencing a temporary issue. This is a backend stability matter and usually resolves quickly. Please try again in a moment. [Check Status](https://aistudio.google.com/status)";
      }

      const status = isQuota ? 429 : 503;
      
      const errorResponse = { 
        ok: false,
        error: {
          code: isPermission ? "SEARCH_SERVICE_ACCOUNT_UNAVAILABLE" : isQuota ? "SEARCH_QUOTA_EXHAUSTED" : "SEARCH_TEMPORARY_FAILURE",
          message,
          retryable: !isPermission && (isTransient || isQuota),
          status: status,
          category: isPermission ? 'permission' : category
        }
      };
      
      res.status(status).json(errorResponse);
    }
  });

  app.post("/api/enrich-recipe", async (req, res) => {
    console.log(`[API] Received request for /api/enrich-recipe`);
    try {
      if (!await verifySearchAppCheck(req, res)) return;
      const requestIdentity = await verifyRequestIdentity(req, res);
      if (!requestIdentity) return;
      const validation = validateEnrichmentRequestPayload(req.body);
      if ('code' in validation) {
        return res.status(400).json({
          ok: false,
          error: {
            code: validation.code,
            message: validation.message,
            retryable: false,
            status: 400,
            category: 'request'
          }
        });
      }
      const { title, cuisine, mode } = req.body;
      const options = parseEnrichmentRequestOptions(req.body);
      const cacheKey = getEnrichmentCacheKey(title, cuisine, mode, options);
      const cached = cacheKey ? enrichmentCache.get(cacheKey) : null;
      if (cached && cached.expiresAt > Date.now()) {
        console.log(`[EnrichmentCache] cache_hit ${cacheKey}`);
        const checkedUrl = options.sourceUrl
          ? await confirmPublisherRecipePageUrl(options.sourceUrl)
          : options.sourceUrl;
        if (!options.sourceUrl || checkedUrl) return res.json(cached.result);
        enrichmentCache.delete(cacheKey);
      } else if (cached) {
        enrichmentCache.delete(cacheKey!);
      }

      if (cacheKey) console.log(`[EnrichmentCache] cache_miss ${cacheKey}`);

      let pending = cacheKey ? enrichmentInFlight.get(cacheKey) : undefined;
      const startedHere = !pending;
      if (pending) console.log(`[EnrichmentCache] shared_inflight ${cacheKey}`);
      if (!pending) {
        pending = enrichRecipe(title, cuisine, mode, options);
        if (cacheKey) enrichmentInFlight.set(cacheKey, pending);
      }
      let result: any;
      try {
        result = await pending;
      } finally {
        if (cacheKey && startedHere) enrichmentInFlight.delete(cacheKey);
      }
      const sourceLinkUsable = !options.sourceUrl || !!(await confirmPublisherRecipePageUrl(options.sourceUrl));
      if (cacheKey && startedHere && !sourceLinkUsable) {
        console.log(`[EnrichmentCache] cache_skip_unusable_link ${cacheKey}`);
      }
      if (cacheKey && startedHere && sourceLinkUsable && isCacheableEnrichment(result)) {
        const now = Date.now();
        for (const [key, entry] of enrichmentCache) {
          if (entry.expiresAt <= now) enrichmentCache.delete(key);
        }
        while (enrichmentCache.size >= ENRICHMENT_CACHE_MAX_ENTRIES) {
          const oldestKey = enrichmentCache.keys().next().value;
          if (!oldestKey) break;
          enrichmentCache.delete(oldestKey);
        }
        enrichmentCache.set(cacheKey, { result, expiresAt: now + ENRICHMENT_CACHE_TTL_MS });
      }
      res.json(result);
    } catch (error: any) {
      console.error("[Server API] Gemini Enrichment Error:", error);
      logApiError("enrich-recipe", error);
      let message = error.message || "Internal enrichment error";
      
      // Prevent HTML leakage
      if (message.includes('<!DOCTYPE html>') || message.includes('<html')) {
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

  app.post("/api/create-checkout-session", async (req, res) => {
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

      const isYearly = plan === 'yearly';
      
      const successUrl = origin.endsWith('/') 
        ? `${origin}success?session_id={CHECKOUT_SESSION_ID}` 
        : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = origin.endsWith('/') ? `${origin}?payment=cancel` : `${origin}/?payment=cancel`;
      
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: userId,
        customer_email: decoded.email || undefined,
        metadata: { userId, plan: isYearly ? 'annual' : 'monthly' },
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `DinnerByDesign Access (${isYearly ? 'Annual' : 'Monthly'})`,
                description: "Unlock advanced search and unlimited dinner planning",
              },
              unit_amount: isYearly ? 3000 : 299, // £30.00 or £2.99
              recurring: {
                interval: isYearly ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/get-checkout-session", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
      
      const stripeClient = await getStripe();
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-portal-session", async (req, res) => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      if (!token) return res.status(401).json({ error: "A signed-in account is required." });

      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.firebase?.sign_in_provider === "anonymous") {
        return res.status(403).json({ error: "A registered account is required to manage billing." });
      }

      const stripeClient = await getStripe();
      const userRef = getDb().collection('users').doc(decoded.uid);
      const profileSnapshot = await userRef.get();
      const profile = profileSnapshot.data() || {};
      let customerId = String(profile.subscription?.stripeCustomerId || '').trim();

      if (!customerId && decoded.email) {
        const customers = await stripeClient.customers.list({
          email: decoded.email,
          limit: 100,
        });
        const customersWithActiveSubscriptions: string[] = [];

        for (const customer of customers.data || []) {
          const subscriptions = await stripeClient.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 20,
          });
          const hasManageableSubscription = (subscriptions.data || []).some((subscription: any) => (
            ['active', 'trialing', 'past_due', 'unpaid'].includes(subscription.status)
          ));
          if (hasManageableSubscription) customersWithActiveSubscriptions.push(customer.id);
        }

        if (customersWithActiveSubscriptions.length === 1) {
          customerId = customersWithActiveSubscriptions[0];
          if (profileSnapshot.exists) {
            await userRef.set({
              subscription: {
                stripeCustomerId: customerId,
                updatedAt: FieldValue.serverTimestamp(),
              },
              updatedAt: FieldValue.serverTimestamp(),
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
        return_url: returnUrl,
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Portal Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/request-refund", async (req, res) => {
    try {
      const authorization = req.get("authorization") || "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      if (!token) return res.status(401).json({ error: "A signed-in account is required." });

      const decoded = await getAdminAuth().verifyIdToken(token);
      if (decoded.firebase?.sign_in_provider === "anonymous") {
        return res.status(403).json({ error: "A registered account is required to request a refund." });
      }

      const stripeClient = await getStripe();
      const userRef = getDb().collection('users').doc(decoded.uid);
      const profileSnapshot = await userRef.get();
      const profile = profileSnapshot.data() || {};
      let customerId = String(profile.subscription?.stripeCustomerId || '').trim();

      if (!customerId && decoded.email) {
        const customers = await stripeClient.customers.list({ email: decoded.email, limit: 100 });
        const customersWithPaidSubscriptionInvoices: string[] = [];

        for (const customer of customers.data || []) {
          const invoices = await stripeClient.invoices.list({
            customer: customer.id,
            status: 'paid',
            limit: 20,
          });
          if ((invoices.data || []).some((invoice: any) => invoice.subscription && invoice.amount_paid > 0)) {
            customersWithPaidSubscriptionInvoices.push(customer.id);
          }
        }

        if (customersWithPaidSubscriptionInvoices.length === 1) {
          customerId = customersWithPaidSubscriptionInvoices[0];
          if (profileSnapshot.exists) {
            await userRef.set({
              subscription: {
                stripeCustomerId: customerId,
                updatedAt: FieldValue.serverTimestamp(),
              },
              updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });
          }
        }
      }

      if (!customerId) {
        return res.status(404).json({ error: "Your billing details are not ready yet. Please try again shortly." });
      }

      const paidInvoices = await stripeClient.invoices.list({
        customer: customerId,
        status: 'paid',
        limit: 100,
      });
      const subscriptionInvoices = (paidInvoices.data || [])
        .filter((invoice: any) => invoice.subscription && invoice.amount_paid > 0)
        .sort((a: any, b: any) => {
          const aPaidAt = a.status_transitions?.paid_at || a.created || 0;
          const bPaidAt = b.status_transitions?.paid_at || b.created || 0;
          return bPaidAt - aPaidAt;
        });
      const latestInvoice = subscriptionInvoices[0];

      if (!latestInvoice) {
        return res.status(422).json({ error: "There is no successful subscription payment available for an automatic refund." });
      }

      const paidAtSeconds = latestInvoice.status_transitions?.paid_at || latestInvoice.created || 0;
      const paidAtMillis = paidAtSeconds * 1000;
      if (!paidAtMillis || Date.now() - paidAtMillis > AUTOMATIC_REFUND_WINDOW_MS || Date.now() < paidAtMillis) {
        return res.status(422).json({
          error: "This payment is outside the 14-day automatic refund window. Please contact terence@dinnerbydesign.app for help.",
          code: "refund_window_expired",
        });
      }

      const paymentIntentId = typeof latestInvoice.payment_intent === 'string'
        ? latestInvoice.payment_intent
        : latestInvoice.payment_intent?.id;
      const chargeId = typeof latestInvoice.charge === 'string'
        ? latestInvoice.charge
        : latestInvoice.charge?.id;

      if (!paymentIntentId && !chargeId) {
        return res.status(422).json({
          error: "This payment needs a manual refund review. Please contact terence@dinnerbydesign.app.",
          code: "manual_refund_review",
        });
      }

      const refundLookup = paymentIntentId
        ? { payment_intent: paymentIntentId, limit: 100 }
        : { charge: chargeId, limit: 100 };
      const existingRefunds = await stripeClient.refunds.list(refundLookup);
      const refundedAmount = (existingRefunds.data || [])
        .reduce((total: number, refund: any) => total + Number(refund.amount || 0), 0);
      if (refundedAmount > 0) {
        return res.status(409).json({
          error: "A refund has already been issued or started for this payment. Please contact terence@dinnerbydesign.app if you need help.",
          code: "refund_already_exists",
        });
      }

      const refundRequestRef = getDb().collection('refundRequests').doc(`${decoded.uid}_${latestInvoice.id}`);
      const claim = await getDb().runTransaction(async (transaction: any) => {
        const snapshot = await transaction.get(refundRequestRef);
        const current = snapshot.data() || {};
        const requestedAtMillis = typeof current.requestedAt?.toMillis === 'function'
          ? current.requestedAt.toMillis()
          : 0;

        if (current.status === 'refunded') return { status: 'refunded' };
        if (current.status === 'processing' && requestedAtMillis && Date.now() - requestedAtMillis < REFUND_REQUEST_LEASE_MS) {
          return { status: 'processing' };
        }

        transaction.set(refundRequestRef, {
          uid: decoded.uid,
          customerId,
          invoiceId: latestInvoice.id,
          status: 'processing',
          requestedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        return { status: 'claimed' };
      });

      if (claim.status === 'refunded') {
        return res.status(409).json({ error: "A refund has already been issued for this payment.", code: "refund_already_exists" });
      }
      if (claim.status === 'processing') {
        return res.status(409).json({ error: "A refund request for this payment is already being processed. Please check again shortly.", code: "refund_processing" });
      }

      let refund;
      try {
        refund = await stripeClient.refunds.create(
          paymentIntentId
            ? { payment_intent: paymentIntentId, amount: latestInvoice.amount_paid, metadata: { userId: decoded.uid, invoiceId: latestInvoice.id } }
            : { charge: chargeId, amount: latestInvoice.amount_paid, metadata: { userId: decoded.uid, invoiceId: latestInvoice.id } },
          { idempotencyKey: `dinnerbydesign-refund-${decoded.uid}-${latestInvoice.id}` },
        );
      } catch (error: any) {
        await refundRequestRef.set({
          status: 'failed',
          updatedAt: FieldValue.serverTimestamp(),
          errorMessage: String(error?.message || 'Stripe refund failed').slice(0, 500),
        }, { merge: true });
        console.error('[Refund] Stripe refund failed:', error);
        return res.status(502).json({ error: "The refund could not be completed automatically. Please contact terence@dinnerbydesign.app for help.", code: "refund_failed" });
      }

      let renewalCancelled = false;
      let cancellationError = false;
      const subscriptionId = typeof latestInvoice.subscription === 'string'
        ? latestInvoice.subscription
        : latestInvoice.subscription?.id;
      if (subscriptionId) {
        try {
          const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
          if (['active', 'trialing', 'past_due', 'unpaid'].includes(subscription.status)) {
            if (!subscription.cancel_at_period_end) {
              await stripeClient.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
            }
            renewalCancelled = true;
          }
        } catch (error) {
          cancellationError = true;
          console.error('[Refund] Future renewal could not be cancelled:', error);
        }
      }

      await refundRequestRef.set({
        status: 'refunded',
        refundId: refund.id,
        amount: latestInvoice.amount_paid,
        currency: latestInvoice.currency,
        renewalCancelled,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      const recipient = String(decoded.email || profile.email || '').trim();
      if (recipient) {
        try {
          const amountText = `£${(Number(latestInvoice.amount_paid || 0) / 100).toFixed(2)}`;
          await sendTrackedEmail({
            to: recipient,
            subject: 'Your DinnerByDesign refund has been issued',
            html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">Your refund has been issued</h2>
  <p>We have issued a refund of <strong>${amountText}</strong> to your original payment method.</p>
  <p>${renewalCancelled ? 'Your next subscription renewal has also been cancelled.' : 'We could not confirm the future renewal change automatically. Please open Manage Billing in DinnerByDesign or contact support.'}</p>
  <p>Stripe may take additional time to return the funds to your account.</p>
</div>
            `.trim(),
          }, {
            type: 'subscription_refund_issued',
            source: 'stripe_refund',
            userId: decoded.uid,
            metadata: {
              invoiceId: latestInvoice.id,
              refundId: refund.id,
              amount: latestInvoice.amount_paid,
              currency: latestInvoice.currency,
              renewalCancelled,
            },
          });
        } catch (error) {
          console.error('[Refund] Confirmation email failed:', error);
        }
      }

      const message = cancellationError
        ? "Your refund has been issued, but future renewal could not be cancelled automatically. Please open Manage Billing or contact terence@dinnerbydesign.app."
        : "Your refund has been issued to the original payment method and your next renewal has been cancelled. Stripe may take additional time to return the funds.";
      return res.json({ ok: true, status: 'refunded', message, refundId: refund.id });
    } catch (error: any) {
      console.error('[Refund] Request failed:', error);
      return res.status(500).json({ error: "The refund request could not be completed. Please contact terence@dinnerbydesign.app for help." });
    }
  });

  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const stripeClient = await getStripe();
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret) {
        event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        event = JSON.parse(req.body.toString());
        console.log("[Webhook] WARNING: Signature verification skipped (no secret set)");
      }
    } catch (err: any) {
      console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[Webhook] Handling event: ${event.type}`);
    const webhookClaim = await claimStripeWebhookEvent(event);
    if (webhookClaim.status === 'already_processed') {
      console.log(`[Webhook] Ignoring duplicate event ${webhookClaim.eventId}`);
      return res.json({ received: true, duplicate: true });
    }
    if (webhookClaim.status === 'in_progress') {
      console.log(`[Webhook] Deferring event ${webhookClaim.eventId} while another attempt is active`);
      return res.status(409).json({ received: false, retryable: true });
    }
    await recordStripeWebhookEvent(event, "processing", {
      message: "Webhook received and verified"
    });

    try {
      // const db = admin.firestore(); // already defined at top level

      switch (event.type) {
        case 'checkout.session.completed': {
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
            
            const userRef = getDb().collection('users').doc(userId);
            await userRef.set({
              subscription: {
                stripeCustomerId: customerId,
                updatedAt: FieldValue.serverTimestamp()
              }
            }, { merge: true });

            // Trigger subscription confirmation email once. Stripe sends the formal receipt.
            const userDoc = await userRef.get();
            const userData = userDoc.data();
            const userEmail = userData?.email || session.customer_details?.email;

            const shouldSendSubscriptionConfirmation = userEmail
              ? await claimUserEmailSend(userRef, 'subscriptionConfirmationEmailSent')
              : false;
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
                      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">To change or cancel your subscription, open DinnerByDesign and go to Settings → Subscription.</p>
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
                await completeUserEmailSend(userRef, 'subscriptionConfirmationEmailSent');
                console.log(`[Webhook] Subscription confirmation email sent to ${userEmail}`);
              } catch (emailErr) {
                await releaseUserEmailSend(userRef, 'subscriptionConfirmationEmailSent');
                console.error(`[Webhook] Failed to send subscription confirmation email:`, emailErr);
              }
            }
          }
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          await recordStripeWebhookEvent(event, "processing", {
            customerId,
            subscriptionId: subscription.id,
            message: `Subscription event ${subscription.status || "unknown"}`
          });

          // Find user by customer ID
          const userQuery = await getDb().collection('users')
            .where('subscription.stripeCustomerId', '==', customerId)
            .limit(1)
            .get();

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
            const isTrialing = status === 'trialing';
            const isPaying = status === 'active';
            const graceEndsAt = userData?.subscriptionPaymentGraceEndsAt;
            const graceEndsAtMillis = typeof graceEndsAt?.toMillis === 'function'
              ? graceEndsAt.toMillis()
              : (graceEndsAt instanceof Date ? graceEndsAt.getTime() : 0);
            const isPaymentGraceActive = status === 'past_due' && graceEndsAtMillis > Date.now();
            const hasAccess = isTrialing || isPaying || isPaymentGraceActive;
            const subscriptionAccessStatus = isPaying || isPaymentGraceActive
              ? 'paid'
              : (isTrialing ? 'trial' : 'read_only');
            
            const summary = {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: status,
              accessStatus: subscriptionAccessStatus,
              trialStart: subscription.trial_start ? Timestamp.fromMillis(subscription.trial_start * 1000) : null,
              trialEnd: subscription.trial_end ? Timestamp.fromMillis(subscription.trial_end * 1000) : null,
              subscriptionCreatedAt: subscription.created ? Timestamp.fromMillis(subscription.created * 1000) : null,
              currentPeriodStart: Timestamp.fromMillis(subscription.current_period_start * 1000),
              currentPeriodEnd: Timestamp.fromMillis(subscription.current_period_end * 1000),
              isTrialing,
              isPaying,
              hasAccess,
              lastStripeEventCreatedAt: event.created || null,
              lastStripeEventId: event.id || null,
              updatedAt: FieldValue.serverTimestamp()
            };

            console.log(`[Webhook] Updating subscription for user ${userId} to ${status}`);
            const appliedSubscriptionUpdate = await getDb().runTransaction(async (transaction: any) => {
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
                updatedAt: FieldValue.serverTimestamp()
              }, { merge: true });
              return true;
            });

            if (!appliedSubscriptionUpdate) {
              console.log(`[Webhook] Ignoring older subscription event ${event.id || '(unknown)'}`);
              break;
            }

            const userEmail = userData?.email;
            const shouldSendCancellationEmail = event.type === 'customer.subscription.deleted'
              && userEmail
              && await claimUserEmailSend(userDoc.ref, 'subscriptionCancellationEmailSent');

            if (shouldSendCancellationEmail) {
              try {
                const appUrl = PRODUCTION_APP_URL;
                const endDate = subscription.current_period_end
                  ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : null;

                await sendTrackedEmail({
                  to: userEmail,
                  subject: "Your DinnerByDesign subscription has been cancelled",
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.55;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">DinnerByDesign</p>
                      <h2 style="color: #111827; margin: 0 0 16px; font-size: 26px; line-height: 1.2;">Your subscription has been cancelled</h2>
                      <p style="margin: 0 0 14px;">This email confirms that your DinnerByDesign subscription has been cancelled.</p>
                      ${endDate ? `<p style="margin: 0 0 14px;">Your paid access is currently scheduled to end on <strong>${endDate}</strong>.</p>` : ''}
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

                await completeUserEmailSend(userDoc.ref, 'subscriptionCancellationEmailSent');
                console.log(`[Webhook] Subscription cancellation email sent to ${userEmail}`);
              } catch (emailErr) {
                await releaseUserEmailSend(userDoc.ref, 'subscriptionCancellationEmailSent');
                console.error(`[Webhook] Failed to send subscription cancellation email:`, emailErr);
              }
            }
          } else {
            console.warn(`[Webhook] No user found for customer ID: ${customerId}`);
          }
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object;
          await recordStripeWebhookEvent(event, "processing", {
            customerId: invoice.customer,
            subscriptionId: invoice.subscription,
            invoiceId: invoice.id,
            message: "Invoice paid"
          });
          if (invoice.subscription) {
            const customerId = invoice.customer;
            const userQuery = await getDb().collection('users')
              .where('subscription.stripeCustomerId', '==', customerId)
              .limit(1)
              .get();

            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              if (await hasLiveAuthenticationIdentity(userDoc.id)) {
                await getDb().runTransaction(async (transaction: any) => {
                  const currentSnapshot = await transaction.get(userDoc.ref);
                  if (!currentSnapshot.exists) return;
                  const currentData = currentSnapshot.data() || {};
                  if (!shouldApplyStripeEvent(currentData.lastStripePaymentEventCreatedAt, event.created)) return;
                  transaction.set(userDoc.ref, {
                    isPremium: true,
                    accessStatus: 'paid',
                    subscriptionPaymentFailedEmailLastInvoiceId: null,
                    subscriptionPaymentGraceEndsAt: null,
                    lastStripePaymentEventCreatedAt: event.created || null,
                    lastStripePaymentEventId: event.id || null,
                    updatedAt: FieldValue.serverTimestamp()
                  }, { merge: true });
                });
              }
            }
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          const customerId = invoice.customer;
          await recordStripeWebhookEvent(event, "processing", {
            customerId,
            subscriptionId: invoice.subscription,
            invoiceId: invoice.id,
            message: "Invoice payment failed"
          });
          const userQuery = await getDb().collection('users')
            .where('subscription.stripeCustomerId', '==', customerId)
            .limit(1)
            .get();

          if (!userQuery.empty) {
            const userDoc = userQuery.docs[0];
            if (!await hasLiveAuthenticationIdentity(userDoc.id)) {
              console.warn(`[Webhook] Skipping payment-failure update for deleted authentication identity ${userDoc.id}`);
              break;
            }
            const userData = userDoc.data();
            const graceEndsAt = Timestamp.fromMillis(Date.now() + 5 * 24 * 60 * 60 * 1000);
            console.log(`[Webhook] Payment failed for user ${userDoc.id}`);
            const appliedPaymentFailure = await getDb().runTransaction(async (transaction: any) => {
              const currentSnapshot = await transaction.get(userDoc.ref);
              if (!currentSnapshot.exists) return false;
              const currentData = currentSnapshot.data() || {};
              if (!shouldApplyStripeEvent(currentData.lastStripePaymentEventCreatedAt, event.created)) return false;
              transaction.set(userDoc.ref, {
                isPremium: true,
                accessStatus: 'paid',
                'subscription.subscriptionStatus': 'past_due',
                'subscription.accessStatus': 'paid',
                'subscription.hasAccess': true,
                subscriptionPaymentGraceEndsAt: graceEndsAt,
                lastStripePaymentEventCreatedAt: event.created || null,
                lastStripePaymentEventId: event.id || null,
                updatedAt: FieldValue.serverTimestamp()
              }, { merge: true });
              return true;
            });

            if (!appliedPaymentFailure) {
              console.log(`[Webhook] Ignoring older payment event ${event.id || '(unknown)'}`);
              break;
            }

            const userEmail = userData?.email || invoice.customer_email;
            const shouldSendPaymentFailureEmail = userEmail
              ? await claimUserInvoiceEmailSend(userDoc.ref, invoice.id)
              : false;

            if (shouldSendPaymentFailureEmail) {
              try {
                const appUrl = PRODUCTION_APP_URL;
                const invoiceUrl = invoice.hosted_invoice_url || null;
                const amountDue = typeof invoice.amount_due === 'number' && invoice.currency
                  ? new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: String(invoice.currency).toUpperCase()
                    }).format(invoice.amount_due / 100)
                  : null;

                await sendTrackedEmail({
                  to: userEmail,
                  subject: "Action needed: payment failed for your DinnerByDesign subscription",
                  html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.55;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">DinnerByDesign</p>
                      <p style="margin: 0 0 14px;">We couldn't process your payment${amountDue ? ` of <strong>${amountDue}</strong>` : ''}.</p>
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
    } catch (err: any) {
      console.error(`[Webhook Handler Error] ${err.message}`);
      await recordStripeWebhookEvent(event, "failed", {
        error: err?.message || String(err),
        message: "Webhook handler failed"
      });
      res.status(500).send(`Webhook Handler Error: ${err.message}`);
    }
  });

  app.post("/api/send-email", async (req, res) => {
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
    } catch (error: any) {
      const statusCode = error?.status || 500;
      const errorMsg = (error?.message || "").toLowerCase();
      const errorName = (error?.name || (error?.error && error?.error.name) || "").toLowerCase();
      
      const isValidationError = errorName.includes("validation") || 
                                errorName.includes("restriction") ||
                                errorMsg.includes("restricted") ||
                                errorMsg.includes("verified") ||
                                errorMsg.includes("sandbox") ||
                                errorMsg.includes("onboarding");
      
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
      
      // Only log genuine unexpected errors
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
          message: isProdEnv ? "Failed to send email" : (error.message || "Failed to send email"),
          status: statusCode,
          name: error.name || "EMAIL_FAILURE"
        }
      });
    }
  });

  app.post("/api/notify-new-account", async (req, res) => {
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

      const createdAt = new Date().toISOString();
      const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="margin: 0 0 20px; color: #111;">New DinnerByDesign account</h2>
  <p>A new registered account has been created.</p>
  <p>Open the Admin Dashboard to review the account details.</p>
  <p style="color: #666; font-size: 13px;">Created: ${escapeHtml(createdAt)}</p>
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

      await profileRef.set({ newAccountNotificationSentAt: FieldValue.serverTimestamp() }, { merge: true });
      return res.json({ ok: true, alreadySent: false });
    } catch (error: any) {
      console.error("[AccountNotification] Failed to notify owner of new account:", error);
      return res.status(500).json({ ok: false, error: "The owner notification could not be sent." });
    }
  });

  app.post("/api/contact", async (req, res) => {
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

    if (!name || !email || !message || name.length > 120 || email.length > 254 || message.length > 4000) {
      return res.status(400).json({ ok: false, error: "Please enter your name, email address and message." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }

    if (!hasContactRateLimitCapacity(req)) {
      return res.status(429).json({ ok: false, error: "Please wait a little while before sending another enquiry." });
    }

    const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1f2937"><h1 style="margin:0 0 20px;font-size:22px">New DinnerByDesign enquiry</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p style="margin:24px 0 8px"><strong>Message:</strong></p><div style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</div></div>`;

    try {
      const response = await sendTrackedEmail({
        to: CONTACT_RECIPIENT,
        subject: `DinnerByDesign enquiry from ${name}`,
        html,
        replyTo: email,
      }, {
        type: "contact_enquiry",
        source: "public_contact_form",
        metadata: { name, replyTo: email },
      });
      return res.status(200).json({ ok: true, response });
    } catch (error) {
      console.error("[Contact] Failed to send enquiry:", error);
      return res.status(503).json({ ok: false, error: "We could not send your enquiry just now. Please try again shortly." });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/ingredient-prices/refresh", async (req, res) => {
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
        reason: "A licensed ingredient-price feed has not been fully configured.",
      });
    }

    let parsedFeedUrl: URL;
    let parsedAllowedOrigin: URL;
    try {
      parsedFeedUrl = new URL(feedUrl);
      parsedAllowedOrigin = new URL(allowedOrigin);
      if (parsedFeedUrl.protocol !== "https:" || parsedAllowedOrigin.protocol !== "https:" || parsedFeedUrl.origin !== parsedAllowedOrigin.origin) {
        throw new Error("Feed URL and allowed origin must use the same HTTPS origin.");
      }
    } catch (error: any) {
      return res.status(503).json({ ok: false, error: error.message || "The licensed feed configuration is invalid." });
    }

    const runStartedAt = new Date().toISOString();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      let response: Response;
      try {
        response = await fetch(parsedFeedUrl, {
          signal: controller.signal,
          headers: process.env.INGREDIENT_PRICE_FEED_TOKEN
            ? { Authorization: `Bearer ${process.env.INGREDIENT_PRICE_FEED_TOKEN}` }
            : undefined,
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`Licensed price feed returned HTTP ${response.status}.`);

      const items = parseLicensedIngredientPriceFeed(await response.json());
      const db = getDb();
      const documentRefs = items.map(item => db.collection("ingredientPriceCatalogue").doc(ingredientPriceDocumentId(item.ingredientKey)));
      const currentSnapshots = documentRefs.length ? await db.getAll(...documentRefs) : [];
      const batch = db.batch();
      let reviewCount = 0;
      let currentCount = 0;

      items.forEach((item, index) => {
        const reference = documentRefs[index];
        const snapshot = currentSnapshots[index];
        const current = snapshot?.exists ? snapshot.data() : undefined;
        const receivedAt = FieldValue.serverTimestamp();
        const isPublishedAndUnchanged = current?.active === true &&
          current?.verificationStatus === "verified" &&
          catalogueEntryMatchesFeedItem(current, item);

        if (isPublishedAndUnchanged) {
          currentCount += 1;
          batch.set(reference, {
            aliases: item.aliases,
            verifiedAt: item.observedAt,
            catalogueVersion: item.observedAt.slice(0, 10),
            sourceType: "retailer-verified",
            refreshStatus: "current",
            lastRefreshAttemptAt: receivedAt,
            pendingPriceRefresh: FieldValue.delete(),
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
          catalogueVersion: "draft",
        };
        batch.set(reference, {
          ...baseDocument,
          refreshStatus: "review",
          lastRefreshAttemptAt: receivedAt,
          pendingPriceRefresh: {
            ...item,
            receivedAt,
          },
        }, { merge: true });
      });

      await batch.commit();
      await db.collection("ingredientPriceRefreshRuns").add({
        status: "completed",
        itemCount: items.length,
        reviewCount,
        currentCount,
        startedAt: runStartedAt,
        completedAt: FieldValue.serverTimestamp(),
        feedOrigin: parsedFeedUrl.origin,
      });
      return res.json({ ok: true, itemCount: items.length, reviewCount, currentCount });
    } catch (error: any) {
      logApiError("INGREDIENT_PRICE_REFRESH", error);
      try {
        await getDb().collection("ingredientPriceRefreshRuns").add({
          status: "failed",
          startedAt: runStartedAt,
          completedAt: FieldValue.serverTimestamp(),
          errorMessage: String(error?.message || error).slice(0, 500),
        });
      } catch (logError) {
        console.error("[IngredientPriceRefresh] Failed to record refresh failure:", logError);
      }
      return res.status(502).json({ ok: false, error: "The licensed ingredient-price feed could not be refreshed." });
    }
  });

  app.post("/api/generate-rationales", async (req, res) => {
    console.log(`[API] Received request for /api/generate-rationales`);
    try {
      if (!await verifySearchAppCheck(req, res)) return;
      const requestIdentity = await verifyRequestIdentity(req, res);
      if (!requestIdentity) return;
      const { items, searchParams, preferences } = req.body;
      const result = await generateMatchRationales(items, searchParams, preferences);
      res.json(result);
    } catch (error: any) {
      console.error("[Server API] Rationale Error:", error);
      let errMsg = error.message || "Internal server error";
      if (errMsg.includes('<!DOCTYPE html>') || errMsg.includes('<html')) {
        errMsg = "Rationale generation is temporarily unavailable. Please try again.";
      }
      const isQuotaErr = (error.category === 'quota');
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

  app.use((req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !isUnknownPublicArticlePath(req.path)) {
      return next();
    }

    const requestedPath = req.path.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));
    res.status(404).type('html').send(`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Page not found — DinnerByDesign</title></head><body><main><p><a href="/">DinnerByDesign</a></p><h1>Page not found</h1><p>There is no published guide or dinner plan at ${requestedPath}.</p><p><a href="/dinner-plans/5-dinners-for-2-under-40">View the affordable dinner plan</a> or <a href="/food-costs/uk-food-costs-2026">read the UK food-cost guide</a>.</p></main></body></html>`);
  });

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (isProd) {
    const distPath = path.resolve(process.cwd(), "dist");
    const indexPath = path.resolve(distPath, "index.html");
    
    console.log(`[API] Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    
    app.get(/.*/, async (req, res, next) => {
      if (req.url && req.url.startsWith("/api/")) {
        return next();
      }
      try {
        let html = await fs.promises.readFile(indexPath, "utf8");
        
        const siteUrl = "https://dinnerbydesign.app";
        let title = "DinnerByDesign | Ad-free UK Dinner Recipe Finder & Costed Shopping Lists";
        let description = "Ad-free UK dinner recipe search: dinner ideas from trusted UK sources, ready-made supermarket options, preference-led search and costed shopping lists.";
        let shareTitle = "DinnerByDesign | UK Dinner Recipe Finder";
        let shareDescription = "Less searching. More relevant dinners. Find verified dinner recipes, ready-made supermarket options and costed shopping lists built around your tastes and budget.";
        let canonicalPath = "/";
        let noIndex = false;
        let schema: any = null;
        let initialBody: string | null = null;

        const pathName = req.path;
        if (pathName === FIVE_DINNERS_FOR_TWO_UNDER_40_PATH) {
          title = FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle;
          description = "Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.";
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
          title = "Privacy, Cookies & AI Data — DinnerByDesign";
          description = "Read how DinnerByDesign handles account data, AI processing, service providers, retention, cookies and UK data-protection rights.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/privacy";
          initialBody = renderPublicSeoInitialHtml("Privacy, cookies and AI data", description);
        } else if (pathName === "/terms") {
          title = "Terms of Service — DinnerByDesign";
          description = "Review DinnerByDesign service terms, free-trial rules, subscription prices, renewals, cancellation, refunds and account access.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/terms";
          initialBody = renderPublicSeoInitialHtml("Terms of Service", description);
        } else if (pathName === "/pricing-methodology") {
          title = "Ingredient Pricing Methodology — DinnerByDesign";
          description = "Learn how DinnerByDesign calculates estimated ingredient costs, full-pack checkout costs, catalogue coverage and price fallbacks.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/pricing-methodology";
          initialBody = renderPublicSeoInitialHtml("Ingredient Pricing Methodology", description);
        } else if (pathName === "/food-safety") {
          title = "Dietary, Allergy & Cooking Safety — DinnerByDesign";
          description = "Understand how DinnerByDesign applies dietary rules and allergy filters, and why labels and safe cooking guidance must still be checked.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/food-safety";
          initialBody = renderPublicSeoInitialHtml("Dietary, Allergy & Cooking Safety", description);
        } else if (pathName === "/recipe-methodology") {
          title = "Recipe & Recommendation Methodology — DinnerByDesign";
          description = "Learn how DinnerByDesign creates, attributes, checks and selects recipe and ready-made dinner information.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/recipe-methodology";
          initialBody = renderPublicSeoInitialHtml("Recipe & Recommendation Methodology", description);
        } else if (pathName === "/nutrition-methodology") {
          title = "Nutrition Estimate Methodology — DinnerByDesign";
          description = "Learn how DinnerByDesign nutrition and calorie estimates are produced and why actual values may vary.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/nutrition-methodology";
          initialBody = renderPublicSeoInitialHtml("Nutrition Estimate Methodology", description);
        } else if (pathName === "/planner") {
          title = "Your Dinner Planner — DinnerByDesign";
          description = "Your weekly bespoke dinner schedule and preparation planner.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/planner";
          noIndex = true;
        } else if (pathName === "/shopping") {
          title = "Your Shopping List — DinnerByDesign";
          description = "Your smart, interactive shopping and grocery lists automatically grouped by department.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/shopping";
          noIndex = true;
        } else if (pathName === "/settings") {
          title = "Account Settings — DinnerByDesign";
          description = "Manage your dietary rule taxonomies, allergies, excluded ingredients, and account credentials.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/settings";
          noIndex = true;
        } else if (pathName === "/signin" || pathName === "/success" || pathName === "/admin") {
          title = pathName === "/signin" ? "Sign In / Sign Up — DinnerByDesign" : pathName === "/success" ? "Subscription Success — DinnerByDesign" : "Admin Dashboard — DinnerByDesign";
          description = pathName === "/signin" ? "Access your DinnerByDesign account or create a new profile to start planning your custom menus." : pathName === "/success" ? "Thank you for subscribing to DinnerByDesign Premium! Your account has been upgraded." : "DinnerByDesign Administration and Management.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = pathName;
          noIndex = true;
        } else {
          // Default Landing Page / Home / fallback
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
                    "name": "Why aren’t some publishers included?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We show published recipes only when we can link directly to an accessible recipe page. Some publishers are not included when their pages require a subscription, sign-in, app hand-off or do not reliably open as a direct recipe link."
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

        // Replace title
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

        // Replace or insert meta description
        if (html.includes('<meta name="description"')) {
          html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`);
        } else {
          html = html.replace("</head>", `<meta name="description" content="${description}" />\n</head>`);
        }

        const canonicalUrl = `${siteUrl}${canonicalPath}`;
        if (html.includes('rel="canonical"')) {
          html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
          html = html.replace("</head>", `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";
        if (html.includes('<meta name="robots"')) {
          html = html.replace(/<meta name="robots" content=".*?"\s*\/?>/, `<meta name="robots" content="${robotsContent}" />`);
        } else {
          html = html.replace("</head>", `<meta name="robots" content="${robotsContent}" />\n</head>`);
        }

        const shareImage = `${siteUrl}/og-image.svg`;
        html = html
          .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonicalUrl}" />`)
          .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${shareTitle}" />`)
          .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${shareDescription}" />`)
          .replace(/<meta property="og:image" content=".*?"\s*\/?>/, `<meta property="og:image" content="${shareImage}" />`)
          .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${shareTitle}" />`)
          .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${shareDescription}" />`)
          .replace(/<meta name="twitter:image" content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${shareImage}" />`);

        // Insert schema if present
        if (schema) {
          const schemaString = `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(schema)}</script>`;
          html = html.replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '');
          html = html.replace("</head>", `${schemaString}\n</head>`);
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
    let viteMiddleware: any = null;
    let vitePromise: Promise<any> | null = null;
    
    app.use((req, res, next) => {
      if (viteMiddleware) {
        return viteMiddleware(req, res, next);
      }
      
      if (!vitePromise) {
        console.log(`[API] Lazy-initializing Vite middleware...`);
        const viteModuleName = "vite";
        vitePromise = import(viteModuleName)
          .then(({ createServer: createViteServer }) => {
            return createViteServer({
              root: process.cwd(),
              server: { middlewareMode: true },
              appType: "spa",
            });
          })
          .then((vite) => {
            viteMiddleware = vite.middlewares;
          })
          .catch((err) => {
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

  // Global Error Handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Global Error Handler Caught]:", err);
    
    // Ensure CORS headers are present even on errors if cors middleware failed
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
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: isProd ? "An unexpected error occurred" : (err.message || "Unknown error"),
        status: statusCode,
        stack: isProd ? undefined : err.stack
      }
    });
  });

  return app;
}

export default createApp;
