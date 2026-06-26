# Ingredient Interpretation Rules

When the user lists ingredients (for example: 'red peppers, rice' or 'tomatoes'), interpret this as a list of separate ingredients.

- Split on commas and the word 'and'.
- Normalise ingredients to singular names in UK English (tomatoes → tomato, red peppers → red pepper).
- Treat plurals and spelling variants as equivalent.
- Always try to return recipes that contain all listed ingredients, not zero results.

# Local Host Testing & Connection Protocol

When testing this web application locally, you can connect to your local backends or specify server overrides.
- **Configuration**: The app includes a "Developer Connection Settings" section in the the Settings view (accessible in debug mode) to allow runtime server URL overrides.
- **API Keys**: When running `npm run dev` locally, provide your own `GEMINI_API_KEY` in your local environment (shell or `.env` file).

# AI Service Architecture

- **Model Strategy**: The application uses `gemini-3.5-flash` for all recipe generation and analysis tasks.
- **Operational Silence**:
  - Technical status indicators (e.g., "Connected", "AI Key: OK", "Direct Mode") must be hidden from the primary UI.
  - Diagnostics and connection overrides are moved to a hidden "Service Diagnostics" panel in Settings, accessible via URL parameter (`?debug=true`) or a 5-tap gesture on the Settings title (non-production only).
- **Connection Modes**:
  - **Cloud Proxy**: Default mode for production traffic.
  - **Direct Mode**: Client-side connection for local development and troubleshooting.
  - **Resilient Fallback**: If Direct Mode is enabled in the client but fails for any reason (e.g. quota limits, invalid API keys, or browser connectivity restrictions), the application automatically catches the error and seamlessly falls back to Cloud Proxy mode. This ensures that the user's planning flow remains uninterrupted.
- **Error Handling**: Use plain English for all user-facing errors (e.g., "Our AI service is experiencing a temporary issue" instead of "Quota Exceeded"). Avoid exposing technical codes or routing details.

# Project Persistence & Communication

- **Instruction Persistence**: All project-specific logic, architectural decisions, and custom rules MUST be recorded in `AGENTS.md`.
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

- **Password Changed Confirmation (Email 1)**:
  - Dispatched via `/api/send-email` using `Resend` instantly upon successful client-side updates inside `updateUserPassword` in `AuthContext.tsx`.
  - Automatically captures browser userAgent metadata and real-time transaction timestamps to include security alerts and OS details.
  - Includes a prominent warnings block with a security lock indicator if the change was unauthorised, as well as a direct CTA to back to the main app dashboard.

- **Account Deletion & Data Clear Confirmation (Email 2)**:
  - Dispatched client-side via `/api/send-email` within `handleDeleteAccount` in `SettingsView.tsx` right after the user profile data collections are successfully wiped but immediately before `user.delete()` is executed. This prevents session loss during the network fetch.
  - Includes polite support details, a data propagation notice (up to 48 hours), and an interactive link to an exit survey to optimize UX retention efforts.



