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

Do not commit `.env.local`.

## Connected-service configuration

### Firebase

- Keep `dinnerbydesign.app`, `www.dinnerbydesign.app`, `127.0.0.1` and `localhost` in the authorised-domain list where appropriate.
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
6. Verify that the local commit, remote branch and deployed source are aligned.

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

The web app remains the source of truth. Native packaging and simulator instructions are maintained in [native-ios.md](native-ios.md).
