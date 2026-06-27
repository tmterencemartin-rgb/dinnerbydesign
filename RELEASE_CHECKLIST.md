# DinnerByDesign Release Checklist

Use this before sharing the app publicly, after changing environment variables, or after a major deploy.

## Production URL

- [ ] Use this as the production app URL:
  `https://dinnerbydesign.app/`
- [ ] Do not share or test production sign-in on old/alternate Vercel URLs unless they are also configured everywhere.
- [ ] If a custom domain is added later, update Firebase, Stripe, Resend links, and this checklist.

## Vercel

- [ ] Project is connected to:
  `https://github.com/tmterencemartin-rgb/dinnerbydesignv2`
- [ ] Latest deployment is successful.
- [ ] Production environment variables are set:
  - [ ] `GEMINI_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`
- [ ] `RESEND_FROM_EMAIL` is:
  `chef@dinnerbydesign.app`
- [ ] Live health check opens without a Vercel function error:
  `https://dinnerbydesign.app/api/health`

## Firebase

- [ ] Firebase Authentication authorized domains include:
  `dinnerbydesign.app`
- [ ] Email/password sign-in works.
- [ ] Google sign-in works, if enabled.
- [ ] Firestore rules are deployed.
- [ ] A signed-in user can save recipes, planner items, shopping lists, and settings.
- [ ] A signed-out or wrong user cannot see another user's saved data.

## Gemini

- [ ] Recipe search returns results on the live site.
- [ ] Ingredient normalization and dietary assessment work.
- [ ] If the app says the AI service is temporarily unavailable, confirm `GEMINI_API_KEY` exists in Vercel and redeploy.

## Stripe

- [ ] Stripe is using live keys for production.
- [ ] Checkout opens from Settings -> Subscription.
- [ ] Trial users can subscribe before their trial ends.
- [ ] Stripe webhook endpoint is:
  `https://dinnerbydesign.app/api/stripe-webhook`
- [ ] Webhook signing secret is saved in Vercel as:
  `STRIPE_WEBHOOK_SECRET`
- [ ] Stripe webhook events include:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
- [ ] Recent webhook deliveries show `200` / `Succeeded`.
- [ ] After checkout, the app shows a clear subscription confirmation state.
- [ ] Admin dashboard shows the user's Stripe customer/subscription information.
- [ ] If a real test payment was made, refund or cancel it in Stripe when testing is complete.

## Resend Email

- [ ] Resend domain is verified.
- [ ] Test email from Settings succeeds.
- [ ] Email arrives from:
  `chef@dinnerbydesign.app`
- [ ] Welcome email sends for new accounts.
- [ ] Subscription confirmation email sends after successful checkout.
- [ ] Shopping list and recipe email buttons work.

## Admin / Support

- [ ] Admin account can open the admin dashboard.
- [ ] Admin dashboard shows:
  - [ ] user email
  - [ ] access status
  - [ ] trial end date
  - [ ] Stripe customer ID
  - [ ] Stripe subscription ID
  - [ ] subscription status
  - [ ] renewal/end date
  - [ ] last Stripe update
  - [ ] subscription confirmation email status
- [ ] Stripe customer link opens the correct Stripe customer page.

## End-to-End Smoke Test

- [ ] Open the live app in a fresh/private browser window.
- [ ] Create or sign in to a test account.
- [ ] Run a recipe search.
- [ ] Save a recipe.
- [ ] Add a recipe to the planner.
- [ ] Open the shopping list.
- [ ] Send a test email.
- [ ] Start checkout.
- [ ] Confirm subscription status in the app.
- [ ] Confirm webhook delivery in Stripe.
- [ ] Confirm user status in admin dashboard.

## Before Every Deploy

Run locally:

```bash
npm run lint
npm test
npm run build
```

Then push to GitHub and wait for Vercel to deploy.

## If Something Breaks

- Sign-in fails: check Firebase authorized domains.
- Recipe search fails: check `GEMINI_API_KEY` in Vercel and redeploy.
- Checkout fails: check Stripe publishable and secret keys in Vercel.
- Paid user stays on trial: check Stripe webhook deliveries and `STRIPE_WEBHOOK_SECRET`.
- Email fails: check `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and Resend domain verification.
- Wrong site behaves differently: confirm you are using `https://dinnerbydesign.app/`.
