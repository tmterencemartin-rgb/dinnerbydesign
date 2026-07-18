# Ingredient Interpretation Rules

## Brand Naming and Wordmark

- Write the product name as `DinnerByDesign` in all prose, headings, metadata, emails, accessible labels, legal copy, and possessive constructions such as `DinnerByDesign's`.
- Do not use `Dinner By Design` or `Dinner by Design` as the product name.
- Use the approved `/dbd-logo-with-pin.png` asset when displaying the visual wordmark; do not recreate the wordmark with styled text.
- Keep domains and email addresses lowercase, such as `dinnerbydesign.app` and `chef@dinnerbydesign.app`.

## Terminology Rule

Use "dinner" or "dinners" in user-facing copy. Avoid "meal" or "meals" unless quoting an external source or referring to a technical identifier, data key, or legacy name.

When the user lists ingredients (for example: 'red peppers, rice' or 'tomatoes'), interpret this as a list of separate ingredients.

- Split on commas and the word 'and'.
- Normalise ingredients to singular names in UK English (tomatoes → tomato, red peppers → red pepper).
- Treat plurals and spelling variants as equivalent.
- Always try to return recipes that contain all listed ingredients, not zero results.

# Local Host Testing & Connection Protocol

When testing this web application locally, you can connect to your local backends or specify server overrides.
- **Configuration**: The app includes a "Developer Connection Settings" section in the the Settings view (accessible in debug mode) to allow runtime server URL overrides.
- **API Keys**: When running `npm run dev` locally, provide your own `GEMINI_API_KEY` in your local environment (shell or `.env` file).

# Search Service Architecture

- **Model Strategy**: The application uses `gemini-3.5-flash` for all recipe generation and analysis tasks.
- **Operational Silence**:
  - Technical status indicators (e.g., "Connected", "Service key: OK", "Direct Mode") must be hidden from the primary UI.
  - Diagnostics and connection overrides are moved to a hidden "Service Diagnostics" panel in Settings, accessible via URL parameter (`?debug=true`) or a 5-tap gesture on the Settings title (non-production only).
- **Connection Modes**:
  - **Cloud Proxy**: Default mode for production traffic.
  - **Direct Mode**: Client-side connection for local development and troubleshooting.
  - **Resilient Fallback**: If Direct Mode is enabled in the client but fails for any reason (e.g. quota limits, invalid API keys, or browser connectivity restrictions), the application automatically catches the error and seamlessly falls back to Cloud Proxy mode. This ensures that the user's planning flow remains uninterrupted.
- **Error Handling**: Use plain English for all user-facing errors (e.g., "Our search service is experiencing a temporary issue" instead of "Quota Exceeded"). Avoid exposing technical codes or routing details.

# Project Persistence & Communication

- **Instruction Persistence**: All project-specific logic, architectural decisions, and custom rules MUST be recorded in `AGENTS.md`.
- **Live Repo Location**: The live DinnerByDesign app repository for this project is `/Users/home/Desktop/DinnerByDesign/DinnerByDesign-app`.
- **Serverless Compatibility**: The API routes and entry points are optimized to run seamlessly in read-only and ephemeral execution environments (e.g., serverless functions). Direct local file writes (such as to `api-errors.log`) are completely avoided, and all file path resolutions use absolute resolution with `path.resolve` to prevent execution path mismatch errors.
- **Hiding Internals**: When communicating with the user, hide internal directory paths and engineering details. Focus on visual and functional outcomes.
- **Evidence-Led Replies**: State whether acceptance tests were verified in the running app or implementation level. Avoid self-congratulatory language.

# Database Security Rules & Safe Trial Validation

- **Safe Path Check Strategy**: When validating trial or premium status in Firestore Security Rules, the rules evaluate paths using an `exists` check block BEFORE looking up properties. This ensures first-time or guest users whose parent profiles are not yet loaded do not cause evaluation crashes (which behave as unexpected database rejection errors).
- **Trial Status Schema Integrity**: If a user document hasn't been written to the database yet, we implicitly treat them as an active trial user so they can populate and sync initial subcollection data.

# Administrative Access

- **Access Strategy**: Admin access is currently enforced via a verified-email allow-list in `AuthContext.tsx` and duplicated in `firestore.rules` for database security. 
- **Future Considerations**: This mechanism is sufficient for initial launch but should be migrated to Firebase Custom Claims if the number of administrative users grows or if more granular role-based access control is required.

# Authentication & Password Recovery Fallbacks

- **Password Reset Deliverability**:
  - Because Cloud Run dynamic staging and preview domains change frequently and are not whitelisted in the Firebase Console's Authorized Domains list by default, the app is configured to fall back gracefully.
  - If a password reset attempt using custom `actionCodeSettings` (which provides a continue URL redirection to the app) fails for *any reason*, the system automatically catches the exception and prints a warnings diagnostic. 
  - It then immediately retries sending a standard, secure password reset email (without `actionCodeSettings`). This ensures password reset deliverability under all host domains and local environments.
  - Neutral user messaging is maintained regardless of success/error state to prevent user-account enumeration attacks.

# Core Transactional Email Automation

- **Delivery path**: App-authored transactional emails are sent through `/api/send-email` using `Resend`. Stripe lifecycle emails use `sendTrackedEmail` in `src/api-server.ts` so delivery attempts are recorded in `emailEvents`.
- **Welcome email**: Sent from `AuthContext.tsx` for first-time users and retried on profile load if `welcomeEmailSent` was not recorded.
- **Trial ending reminder**: Sent from `AuthContext.tsx` when a non-paying user is within 24 hours of trial expiry. Subject format is `Your free trial ends [trial end date]`.
- **Password changed confirmation**: Sent after successful password updates inside `updateUserPassword` in `AuthContext.tsx`; includes browser/OS and timestamp context for security awareness.
- **Account deletion and data clear confirmation**: Sent from `SettingsView.tsx` after profile data collections are wiped and before `user.delete()` removes the authenticated session.
- **Subscription active confirmation**: Sent from the Stripe `checkout.session.completed` webhook once per user when DinnerByDesign activates paid access.
- **Subscription cancelled confirmation**: Sent from the Stripe `customer.subscription.deleted` webhook once per user.
- **Payment failed notice**: Sent from the Stripe `invoice.payment_failed` webhook once per invoice, with grace-period messaging.
- **Permanent access granted email**: Sent from `AdminDashboard.tsx` when an admin grants permanent full access.
- **User-requested emails**: Recipe email, shopping-list email, Settings test email, and admin-triggered sends are not treated as automatic lifecycle emails, but they still use `/api/send-email` and appear in email telemetry where metadata is provided.

# Weekly Planner Controls

- **Protein options**: The weekly planner protein dropdown is alphabetised and includes Beef, Chicken, Eggs, Fish & seafood, Lamb, Mixed, No preference, Pescatarian, Pork, Pulses, Tofu / plant-based, Turkey, Vegetarian, and Vegan.
- **Time options**: Weekly planner time supports Any, Quick, Under 30 mins, and Under 45 mins. Under-30 and under-45 selections set hard `maxTotalTime` limits in weekly-plan search params.
- **Saved dinner quick filters**: The saved-list quick filters are Under 20 min, Vegetarian, High protein, and Batch-friendly. Cost remains a sort option through `Lowest cost first`, not a duplicate quick filter.
- **Compact saved rows**: Do not show `Main salad` / `Side salad` in compact saved or planner rows. Salad type can remain visible in richer search-result/detail contexts where it helps comparison.

# Programmatic SEO Experience Prototype

- **Preview route**: The isolated budget-family public-page concept is available with `?design=budget-family` and is intentionally kept outside the standard signed-in navigation.
- **Experience boundary**: Public SEO pages should demonstrate costs, ingredient reuse and the route into personalisation without adding SEO copy or category clutter to protected app views.
- **Cost presentation**: Public cost claims must be labelled as estimates, show the price-check date, explain assumptions, and distinguish the coordinated basket from buying dinners separately.
- **Affordability pilot boundary**: `AFFORDABILITY_PLANNER_PILOT` in `src/config/features.ts` gates the public budget-plan route and its planner handoff. Set it to `false` for an immediate product-level rollback without deleting the implementation.
- **Shared planner path**: Public budget-plan handoffs prefill the existing `Plan my week` controls; they must not introduce a separate recipe-selection engine.
- **Built-week cost feedback**: After weekly dinners are generated, show their combined estimated dinner cost, per-portion cost, budget variance, and pricing coverage above Saved. Keep this explicitly distinct from the later shopping-list estimate based on scheduled dinners, pack sizes, shared ingredients, and pantry items.
- **Rollback checkpoint**: Local branch `backup/pre-affordability-planner-20260717` points to the repository state before this pilot was introduced.
