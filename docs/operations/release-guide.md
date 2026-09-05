# DinnerByDesign Operations and Release Guide

This document covers initial production configuration, routine releases, acceptance checks and common recovery steps.

## Production services

- Production app: `https://dinnerbydesign.app/`
- Source repository: `https://github.com/tmterencemartin-rgb/dinnerbydesign`
- Hosting and serverless functions: Vercel
- Authentication and data: Firebase
- Recipe generation and analysis: Gemini
- Payments: Stripe
- Transactional email: Resend

Use the primary production domain for sign-in, checkout and acceptance testing. Alternate deployment URLs may not be authorised by every connected service.

## Required Vercel environment variables

Configure these in the Vercel project:

```env
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ALLOWED_ORIGINS=
FIREBASE_SERVICE_ACCOUNT_JSON=
```

Set `RESEND_FROM_EMAIL` to `terence@dinnerbydesign.app`.

Set `ALLOWED_ORIGINS` to the production domains, separated by commas:

```env
ALLOWED_ORIGINS=https://dinnerbydesign.app,https://www.dinnerbydesign.app
```

Set `FIREBASE_SERVICE_ACCOUNT_JSON` to the complete JSON credential for a dedicated Firebase service account used by protected administrator endpoints. It is required for authentication reconciliation and complete-account deletion. Keep it encrypted in Vercel and never commit it.

Set `CRON_SECRET` to a random production-only secret. Vercel sends it as a bearer token when it runs `/api/monitor/search-canary` daily. The canary records pass/fail and latency without using a customer account or storing the canary query in telemetry. Real user searches continue to be observed continuously through delivery telemetry.

Firestore backup monitoring is opt-in because it requires a Google Cloud backup schedule and an IAM permission that should not be granted to the application by default. When the schedule is ready, add these Vercel variables:

```env
FIRESTORE_BACKUP_MONITORING_ENABLED=true
FIRESTORE_BACKUP_MAX_AGE_HOURS=48
```

Grant the Firebase service account used by `FIREBASE_SERVICE_ACCOUNT_JSON` the `roles/datastore.backupsViewer` and `roles/datastore.backupSchedulesViewer` roles. The protected daily deep-health run then checks that a daily schedule exists and that a `READY` backup for this database is no older than the configured limit. A failed check is recorded and included in the existing deduplicated owner alert. The application never creates, deletes or restores a backup.

Canary failures trigger a deduplicated owner alert. Repeated client failures or user reports trigger a separate alert after a threshold is reached within one hour. Alerts contain no search text or customer details.

Do not commit `.env.local`.

### Firestore backup setup

Create the daily schedule once in Google Cloud, using a retention period that fits the project budget. For the current project and database:

```bash
gcloud firestore backups schedules create \
  --project='gen-lang-client-0925408841' \
  --database='ai-studio-ffdbb575-df5b-4ac3-a6ad-710b4076125a' \
  --recurrence=daily \
  --retention=14w
```

If a schedule already exists, do not create a second daily schedule. Confirm it first:

```bash
gcloud firestore backups schedules list \
  --project='gen-lang-client-0925408841' \
  --database='ai-studio-ffdbb575-df5b-4ac3-a6ad-710b4076125a'
```

After the first backup reaches `READY`, set the Vercel variables above and redeploy. Then manually run the GitHub Actions workflow once and confirm that the protected deep-health check passes. A restore drill should use a separate staging Google Cloud project or an explicitly approved temporary database; restoring into the production database is destructive and must not be automated from the application.

## Connected-service configuration

### Firebase

- Keep `dinnerbydesign.app`, `www.dinnerbydesign.app`, `127.0.0.1` and `localhost` in the authorised-domain list where appropriate.
- Google sign-in uses `dinnerbydesign.app` as the Firebase `authDomain`. Keep the transparent Vercel rewrites for `/__/auth/` and `/__/firebase/` in place, and authorise `https://dinnerbydesign.app/__/auth/handler` in the Google provider configuration. This keeps mobile redirect sign-in on the app domain.
- Deploy the maintained `firestore.rules` before relying on a security-rule change.
- Confirm that signed-out users and users with a different account cannot read another user's data.

### Stripe

- Use live keys only in production.
- Configure the webhook endpoint as `https://dinnerbydesign.app/api/stripe-webhook`.
- Subscribe it to the lifecycle events handled by the application, including checkout completion, subscription changes, successful invoices and failed invoices.
- Check recent deliveries for a successful HTTP response after payment-related releases.

### Resend

- Keep the sending domain verified.
- Confirm that automatic account and subscription emails use `terence@dinnerbydesign.app`.
- Check the admin email-events panel when investigating a missing message.

## Before every release

Run:

```bash
npm run lint
npm test
npm run build
```

The build generates the static public-guide pages and bundles the serverless API entry point. Treat warnings separately from failures, but investigate new warnings before publishing.

Then:

1. Inspect the working tree and stage only the intended changes.
2. Commit to the maintained branch.
3. Push to GitHub.
4. Deploy the committed state to Vercel production.
5. Confirm the production deployment reaches `READY`.
6. Run `npm run smoke:public` to verify the live public pages, sitemap, robots file and health endpoint.
7. Verify that the local commit, remote branch and deployed source are aligned.

## Routine production acceptance checks

Use a fresh or private browser session where account state might hide a problem.

- Open the production landing page.
- Check `https://dinnerbydesign.app/api/health`.
- Create or sign in to a test account.
- Confirm email/password and Google sign-in.
- Run a recipe search.
- Save a recipe and schedule it.
- Open the generated shopping list.
- Check preference persistence.
- Send a test email.
- Confirm the admin dashboard loads for an authorised administrator.
- Review Search assurance in the admin dashboard. The latest canary should be passed, and delivery failures should be investigated rather than treated as successful searches.
- Use the Search assurance filters to compare the last 24 hours, last 7 days or all recorded events by search mode and device class.

### Signed-in browser checks

The Playwright public and guest checks can run without credentials. Signed-in checks are skipped unless dedicated QA accounts are configured locally:

```env
E2E_USER_EMAIL=
E2E_USER_PASSWORD=
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

Use a standard QA user for Planner and Shopping checks. Use an authorised administrator QA account for the Admin direct-route check. Keep these values in `.env.local`; never commit them.

The full save, schedule and shopping-list journey writes test data and should only run when deliberately enabled:

```env
E2E_RUN_LIVE_JOURNEY=true
```

For a release involving payments:

- Start checkout.
- Confirm the resulting subscription state in the app.
- Check the Stripe webhook delivery.
- Check the user record in the admin dashboard.
- Cancel or refund a genuine test transaction when appropriate.

For a new or changed public guide:

- Confirm the live page returns HTTP 200.
- Check its title, canonical URL and crawler-visible copy.
- Confirm the expected structured data is present.
- Confirm the page appears in the live guide library and sitemap.
- Check at least one relevant incoming internal link.
- Run `npm run smoke:public` after the production deployment.
- When the release adds a new public programmatic page, submit `https://dinnerbydesign.app/sitemap.xml` in Google Search Console after verifying its contents.
- If an authenticated Search Console session is unavailable, record the submission as an outstanding release step.

## Service-specific checks

### Gemini

- Recipe search returns usable results.
- Ingredient interpretation and dietary restrictions are applied.
- Technical service details are not exposed to ordinary users.

### Firebase

- Profile, saved recipes, scheduled dinners, shopping lists and settings persist.
- First-time users can create their profile data.
- Security rules prevent cross-account access.

### Stripe

- Checkout opens from the subscription controls.
- Trial users can subscribe before trial expiry.
- Subscription changes are reflected in the app.
- Automatic payment and subscription emails are recorded.

### Resend

- The Settings test email arrives.
- Automatic account and subscription emails are delivered.
- Recipe and shopping-list email actions work.

## Troubleshooting

- Sign-in failure: check Firebase authorised domains and the configured resolver.
- Recipe search failure: check `GEMINI_API_KEY`, the health endpoint and the latest serverless logs.
- Checkout failure: check Stripe public and secret keys.
- Paid access not appearing: inspect webhook delivery and `STRIPE_WEBHOOK_SECRET`.
- Email failure: check the Resend key, sending address and domain verification.
- Different behaviour on another URL: repeat the test on `https://dinnerbydesign.app/`.
- Public guide missing from search discovery: check the publishing registry, generated HTML, guide library and sitemap before using Search Console URL Inspection.

## Native iOS build

The web app remains the source of truth. Native packaging and simulator instructions are maintained in [the iOS guide](../platform/ios.md).
