import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { generateDinnerSuggestions, enrichRecipe, generateMatchRationales } from "../src/services/geminiService";
import { sendEmail } from "../src/lib/resend";
// Safe dynamic lazy loading of firebase-applet-config.json to support serverless / ephemeral environments
let firebaseConfigCache: any = null;
function getFirebaseConfig() {
  if (firebaseConfigCache) return firebaseConfigCache;
  
  let config: any = {};
  try {
    const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch (e) {
    console.warn("[FirebaseConfig] Failed to load firebase-applet-config.json lazily:", e);
  }
  firebaseConfigCache = config;
  return config;
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

function getAppOrigin(req: express.Request): string {
  const requestOrigin = req.headers.origin || req.headers.referer || `${req.protocol}://${req.get("host")}`;
  const origin = Array.isArray(requestOrigin) ? requestOrigin[0] : requestOrigin;

  if (!origin) return PRODUCTION_APP_URL;

  try {
    const parsed = new URL(origin);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    return isLocal ? parsed.origin : PRODUCTION_APP_URL;
  } catch {
    return PRODUCTION_APP_URL;
  }
}

// Initialize Firebase Admin lazily
let _db: any = null;
function getDb() {
  if (!_db) {
    const config = getFirebaseConfig();
    if (getApps().length === 0) {
      initializeApp({
        projectId: config.projectId || process.env.FIREBASE_PROJECT_ID,
      });
    }
    _db = getFirestore(config.firestoreDatabaseId || undefined);
  }
  return _db;
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
  } catch (logErr) {
    console.error("[EmailLog] Failed to record email event:", logErr);
  }
}

async function sendTrackedEmail(
  email: { to: string; subject: string; html: string; from?: string },
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

const GEMINI_FLASH_INPUT_USD_PER_MILLION = 1.5;
const GEMINI_FLASH_OUTPUT_USD_PER_MILLION = 9;

function estimateTokensFromChars(chars: number) {
  return Math.ceil(Math.max(chars || 0, 0) / 4);
}

function estimateGeminiCostUsd(inputTokens: number, outputTokens: number) {
  return (inputTokens / 1_000_000) * GEMINI_FLASH_INPUT_USD_PER_MILLION +
    (outputTokens / 1_000_000) * GEMINI_FLASH_OUTPUT_USD_PER_MILLION;
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
  } catch (logErr) {
    console.error("[Usage] Failed to record usage event:", logErr);
  }
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

  app.post("/api/generate-suggestions", async (req, res) => {
    console.log(`[API] Received request for /api/generate-suggestions`);
    try {
      const { searchParams, preferences } = req.body;
      if (!searchParams) {
        throw new Error("Missing searchParams in request body");
      }
      const result = await generateDinnerSuggestions(searchParams, preferences);
      const usage = result?.diagnostics?.usage || null;
      const inputTokens = usage?.inputTokensEstimate || estimateTokensFromChars((usage?.inputChars || 0) || String(searchParams.query || '').length);
      const outputTokens = usage?.outputTokensEstimate || estimateTokensFromChars(JSON.stringify(result || {}).length);
      await recordAiUsageEvent({
        type: classifyAiRequest(searchParams),
        source: searchParams.source || 'cook',
        model: usage?.model || 'gemini-3.5-flash',
        status: 'succeeded',
        queryLength: String(searchParams.query || '').length,
        requestedCount: searchParams.count || 3,
        resultCount: (result?.recipes?.length || 0) + (result?.readyMeals?.length || 0),
        latencyMs: result?.diagnostics?.timings?.geminiCall || null,
        totalRoundTripMs: result?.diagnostics?.timings?.totalRoundTrip || null,
        inputTokensEstimate: inputTokens,
        outputTokensEstimate: outputTokens,
        estimatedCostUsd: estimateGeminiCostUsd(inputTokens, outputTokens)
      });
      res.json(result);
    } catch (error: any) {
      console.error("[Server API] Gemini Search Error:", error);
      logApiError("generate-suggestions", error);
      const failedSearchParams = req.body?.searchParams || {};
      await recordAiUsageEvent({
        type: classifyAiRequest(failedSearchParams),
        source: failedSearchParams.source || 'cook',
        model: 'gemini-3.5-flash',
        status: 'failed',
        queryLength: String(failedSearchParams.query || '').length,
        requestedCount: failedSearchParams.count || 3,
        resultCount: 0,
        latencyMs: null,
        totalRoundTripMs: null,
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
      const { title, cuisine, mode } = req.body;
      const result = await enrichRecipe(title, cuisine, mode);
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
      const stripeClient = await getStripe();
      const origin = getAppOrigin(req);
      const { plan, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const isYearly = plan === 'yearly';
      
      const successUrl = origin.endsWith('/') 
        ? `${origin}success?session_id={CHECKOUT_SESSION_ID}` 
        : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = origin.endsWith('/') ? `${origin}?payment=cancel` : `${origin}/?payment=cancel`;
      
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: userId,
        customer_email: req.body.email, // Use email from body if provided
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
      const { customerId } = req.body;
      if (!customerId) return res.status(400).json({ error: "Missing customerId" });
      
      const stripeClient = await getStripe();
      const origin = req.headers.origin || req.headers.referer || `${req.protocol}://${req.get('host')}`;
      const returnUrl = origin.endsWith('/') ? `${origin}settings` : `${origin}/settings`;
      
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

            if (userEmail && !userData?.subscriptionConfirmationEmailSent) {
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
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:chef@dinnerbydesign.app" style="color: #111827;">chef@dinnerbydesign.app</a>.</p>
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
                await userRef.set({
                  subscriptionConfirmationEmailSent: true,
                  subscriptionConfirmationEmailSentAt: FieldValue.serverTimestamp()
                }, { merge: true });
                console.log(`[Webhook] Subscription confirmation email sent to ${userEmail}`);
              } catch (emailErr) {
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
              updatedAt: FieldValue.serverTimestamp()
            };

            console.log(`[Webhook] Updating subscription for user ${userId} to ${status}`);
            await userDoc.ref.set({
              subscription: summary,
              isPremium: isPaying || isPaymentGraceActive,
              accessStatus: summary.accessStatus,
              updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            const userEmail = userData?.email;
            const shouldSendCancellationEmail = event.type === 'customer.subscription.deleted'
              && userEmail
              && !userData?.subscriptionCancellationEmailSent;

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
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:chef@dinnerbydesign.app" style="color: #111827;">chef@dinnerbydesign.app</a>.</p>
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

                await userDoc.ref.set({
                  subscriptionCancellationEmailSent: true,
                  subscriptionCancellationEmailSentAt: FieldValue.serverTimestamp()
                }, { merge: true });
                console.log(`[Webhook] Subscription cancellation email sent to ${userEmail}`);
              } catch (emailErr) {
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
              await userQuery.docs[0].ref.set({
                isPremium: true,
                accessStatus: 'paid',
                subscriptionPaymentFailedEmailLastInvoiceId: null,
                subscriptionPaymentGraceEndsAt: null,
                updatedAt: FieldValue.serverTimestamp()
              }, { merge: true });
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
            const userData = userDoc.data();
            const graceEndsAt = Timestamp.fromMillis(Date.now() + 5 * 24 * 60 * 60 * 1000);
            console.log(`[Webhook] Payment failed for user ${userDoc.id}`);
            await userDoc.ref.set({
              isPremium: true,
              accessStatus: 'paid',
              'subscription.subscriptionStatus': 'past_due',
              'subscription.accessStatus': 'paid',
              'subscription.hasAccess': true,
              subscriptionPaymentGraceEndsAt: graceEndsAt,
              updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            const userEmail = userData?.email || invoice.customer_email;
            const alreadySentForInvoice = userData?.subscriptionPaymentFailedEmailLastInvoiceId === invoice.id;

            if (userEmail && !alreadySentForInvoice) {
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
                      <p style="font-size: 14px; color: #6b7280; margin: 0;">Questions? Reply to this email or contact <a href="mailto:chef@dinnerbydesign.app" style="color: #111827;">chef@dinnerbydesign.app</a>.</p>
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

                await userDoc.ref.set({
                  subscriptionPaymentFailedEmailLastInvoiceId: invoice.id,
                  subscriptionPaymentFailedEmailSentAt: FieldValue.serverTimestamp()
                }, { merge: true });
                console.log(`[Webhook] Payment failed email sent to ${userEmail}`);
              } catch (emailErr) {
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
        return res.status(200).json({ 
          ok: true, 
          simulated: true,
          message: "Email simulated successfully (Sandbox/Verification Restriction)."
        });
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

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-rationales", async (req, res) => {
    console.log(`[API] Received request for /api/generate-rationales`);
    try {
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
        let shareDescription = "Less searching. Better matches. Find verified dinner recipes, ready-made supermarket options and costed shopping lists built around your tastes and budget.";
        let canonicalPath = "/";
        let noIndex = false;
        let schema: any = null;

        const pathName = req.path;
        if (pathName === "/privacy") {
          title = "Privacy & Cookies — DinnerByDesign";
          description = "Read how DinnerByDesign handles account data, saved dinners, essential browser storage, cookies and privacy.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/privacy";
        } else if (pathName === "/terms") {
          title = "Terms of Service — DinnerByDesign";
          description = "Review terms of use, trials, and premium account rules for the DinnerByDesign service.";
          shareTitle = title;
          shareDescription = description;
          canonicalPath = "/terms";
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
                "description": "Ad-free UK dinner finding with verified dinner ideas, ready-made supermarket options, preference-led search and costed shopping lists.",
                "applicationCategory": "FoodAndDrinkApplication",
                "operatingSystem": "Web",
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
                      "text": "DinnerByDesign is an ad-free UK dinner recipe app which enables you to search, compare, save, schedule and shop from one place."
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
                      "text": "Yes. DinnerByDesign estimates cost per portion and builds a grouped UK shopping list from your scheduled dinners."
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
          html = html.replace("</head>", `${schemaString}\n</head>`);
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
