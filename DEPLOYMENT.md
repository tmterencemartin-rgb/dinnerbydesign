# DinnerByDesign Deployment Checklist

## Source of Truth

Use this repository as the maintained app source. Do not commit `.env.local`.

## Required Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

```env
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ALLOWED_ORIGINS=
```

`GEMINI_API_KEY` is required for recipe generation.

`STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` are required for paid subscriptions.

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` are required for email delivery.

Set `ALLOWED_ORIGINS` to the public app domains, comma-separated. Example:

```env
ALLOWED_ORIGINS=https://dinnerbydesign.app,https://www.dinnerbydesign.app
```

## Firebase

`firestore.rules` were deployed to Firebase project `gen-lang-client-0925408841` on 2026-06-26.

Add the Vercel production domain and any custom domain to Firebase Authentication -> Settings -> Authorized domains.

## Local Checks Before Deploy

Run:

```bash
npm run lint
npm test
npm run build
```

## Vercel

The app uses `vercel.json`.

Expected build command:

```bash
npm run build
```

The API function entry is:

```text
api/server.cjs
```
