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
      res.json(result);
    } catch (error: any) {
      console.error("[Server API] Gemini Search Error:", error);
      logApiError("generate-suggestions", error);
      
      const category = error.category || 'model';
      let message = error.message || "Internal AI model error";
      
      // Prevent HTML leakage
      if (message.includes('<!DOCTYPE html>') || message.includes('<html')) {
        message = "Search is temporarily unavailable. Please try again.";
      }

      // Convert any high-demand/temporary/quota error into a clean user-friendly plain English notice
      const messageLower = message.toLowerCase();
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

      if (isTransient || isQuota) {
        message = isQuota 
          ? "Our AI service is currently at capacity due to high demand. You didn't do anything wrong! Please wait about 60 seconds and try again."
          : "Our AI provider is experiencing a temporary issue. This is a backend stability matter and usually resolves quickly. Please try again in a moment. [Check Status](https://aistudio.google.com/status)";
      }

      const status = isQuota ? 429 : 503;
      
      const errorResponse = { 
        ok: false,
        error: {
          code: isQuota ? "AI_SEARCH_QUOTA_EXHAUSTED" : "AI_SEARCH_TEMPORARY_FAILURE",
          message,
          retryable: isTransient || isQuota,
          status: status,
          category
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
          code: "AI_ENRICHMENT_TEMPORARY_FAILURE",
          message: "Recipe enrichment is temporarily unavailable due to high AI demand. Please try again in a moment.",
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
                const appUrl = `https://${req.get('host')}`;
                await sendEmail({
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
            await recordStripeWebhookEvent(event, "processing", {
              userId,
              customerId,
              subscriptionId: subscription.id,
              message: `Updating subscription to ${subscription.status || "unknown"}`
            });
            
            const status = subscription.status;
            const isTrialing = status === 'trialing';
            const isPaying = status === 'active';
            const hasAccess = isTrialing || isPaying;
            
            const summary = {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: status,
              accessStatus: isPaying ? 'paid' : (isTrialing ? 'trial' : 'read_only'),
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
              isPremium: isPaying,
              accessStatus: summary.accessStatus,
              updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            const userData = userDoc.data();
            const userEmail = userData?.email;
            const shouldSendCancellationEmail = event.type === 'customer.subscription.deleted'
              && userEmail
              && !userData?.subscriptionCancellationEmailSent;

            if (shouldSendCancellationEmail) {
              try {
                const appUrl = `https://${req.get('host')}`;
                const endDate = subscription.current_period_end
                  ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : null;

                await sendEmail({
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
            console.log(`[Webhook] Payment failed for user ${userQuery.docs[0].id}`);
            await userQuery.docs[0].ref.set({
              accessStatus: 'read_only',
              'subscription.subscriptionStatus': 'past_due',
              updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });
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
    const { to, subject, html, from } = req.body;
    const hasApiKey = !!process.env.RESEND_API_KEY;
    console.log(`[API] /api/send-email: to=${to}, subject=${subject}, hasKey=${hasApiKey}`);
    
    try {
      if (!hasApiKey) {
        console.error("[API] RESEND_API_KEY is missing");
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
        return res.status(200).json({ 
          ok: true, 
          simulated: true,
          message: "Email simulated successfully (Sandbox/Verification Restriction)."
        });
      }
      
      // Only log genuine unexpected errors
      console.error("[API] send-email caught unexpected error:", error);
      
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
        let title = "DinnerByDesign — Bespoke Food Planning & Smart Shopping Lists";
        let description = "Bespoke, AI-powered food planning, recipe prep, and smart shopping lists tailored to your tastes, budget, and dietary requirements.";
        let canonicalPath = "/";
        let noIndex = false;
        let schema: any = null;

        const pathName = req.path;
        if (pathName === "/privacy") {
          title = "Privacy Policy — DinnerByDesign";
          description = "Read how DinnerByDesign handles and secures your personal profiles, tastes, and recipe data.";
          canonicalPath = "/privacy";
        } else if (pathName === "/terms") {
          title = "Terms of Service — DinnerByDesign";
          description = "Review terms of use, trials, and premium account rules for the DinnerByDesign service.";
          canonicalPath = "/terms";
        } else if (pathName === "/planner") {
          title = "Your Dinner Planner — DinnerByDesign";
          description = "Your weekly bespoke dinner schedule and preparation planner.";
          canonicalPath = "/planner";
          noIndex = true;
        } else if (pathName === "/shopping") {
          title = "Your Shopping List — DinnerByDesign";
          description = "Your smart, interactive shopping and grocery lists automatically grouped by department.";
          canonicalPath = "/shopping";
          noIndex = true;
        } else if (pathName === "/settings") {
          title = "Account Settings — DinnerByDesign";
          description = "Manage your dietary rule taxonomies, allergies, excluded ingredients, and account credentials.";
          canonicalPath = "/settings";
          noIndex = true;
        } else if (pathName === "/signin" || pathName === "/success" || pathName === "/admin") {
          title = pathName === "/signin" ? "Sign In / Sign Up — DinnerByDesign" : pathName === "/success" ? "Subscription Success — DinnerByDesign" : "Admin Dashboard — DinnerByDesign";
          description = pathName === "/signin" ? "Access your DinnerByDesign account or create a new profile to start planning your custom menus." : pathName === "/success" ? "Thank you for subscribing to DinnerByDesign Premium! Your account has been upgraded." : "DinnerByDesign Administration and Management.";
          canonicalPath = pathName;
          noIndex = true;
        } else {
          // Default Landing Page / Home / fallback
          schema = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DinnerByDesign",
            "description": "Bespoke, AI-powered food planning, recipe prep, and smart shopping lists tailored to your tastes, budget, and dietary requirements.",
            "applicationCategory": "HealthAndFitnessApplication, FoodAndDrink",
            "operatingSystem": "All"
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
