# DinnerByDesign Project Instructions

These are the durable working rules for this repository. Detailed procedures belong in the linked documents rather than being repeated here.

## Documentation authority

- Preferences and search behaviour: `docs/PREFERENCES_AND_SEARCH_RULES.md`
- Public content and programmatic SEO: `docs/PROGRAMMATIC_SEO_PUBLISHING_STANDARD.md`
- Deployment and acceptance checks: `docs/OPERATIONS_AND_RELEASE.md`
- Durable implementation principles: `docs/ENGINEERING_NOTES.md`
- Native iOS packaging: `docs/native-ios.md`
- Active roadmap and technical debt: `TODO.md`

When implementation and documentation disagree, verify the running code and update the affected document in the same change.

## Brand and terminology

- Write the product name as `DinnerByDesign` in prose, headings, metadata, emails, accessible labels and legal copy.
- Do not write `Dinner By Design` or `Dinner by Design` as the product name.
- Use `/dbd-logo-with-pin.png` for the visual wordmark. Do not recreate it with styled text.
- Keep domains and email addresses lowercase.
- Use `dinner`, `recipe`, `dish`, `serving` or another accurate alternative in user-facing copy. Do not use the prohibited food-planning synonym.
- Use UK English.
- The approved tagline is `Less searching. Precise matches. Dinner, decided.` Use this exact wording wherever the tagline appears.

## Editorial style

Humanise AI-assisted drafts without changing their meaning:

- Do not use `affordable` in public article H1 headings or SEO titles. Prefer a specific cost, budget, basket or value basis that readers can assess.
- Vary sentence structure and length.
- Qualify genuine uncertainty with wording such as `may suggest`, `appears to` or `is likely to`.
- Do not weaken settled facts, safety instructions or supported claims with artificial hesitation.
- Add useful nuance, limitations or another reasonable perspective where relevant.
- Avoid inflated, generic language such as `delve`, `robust` and `innovative`.
- Use natural transitions sparingly.
- Prefer specific, familiar examples to vague generalities.
- Allow a little informality where it suits the subject.
- Never invent personal experience, testing or customer stories.
- Vary sentence and paragraph openings.
- Use the rule of three sparingly.
- Avoid em dashes.

## Ingredient interpretation

When a user lists ingredients:

- split on commas and the word `and`;
- normalise singular and plural forms in UK English;
- treat common spelling variants as equivalent;
- try to return recipes containing all listed ingredients before relaxing the search.

## Working repository and communication

- The maintained repository is `/Users/home/Desktop/DinnerByDesign/DinnerByDesign-app`.
- Preserve unrelated work in a dirty working tree.
- Stage only the intended files unless the user explicitly requests all changes.
- When the user asks to push, commit the completed changes and publish them to the maintained remote.
- Hide internal paths and low-level engineering details in user-facing updates.
- State whether acceptance was verified in the running app, in production or at implementation level.
- Record new durable product rules here or in the appropriate linked document.

## View navigation loading

- Reserve the full branded loading screen for the initial app code load.
- Use a React transition for ordinary view changes so the current interface remains visible until the next view is ready.
- Keep any slow-view fallback inside the existing app layout rather than replacing the entire screen.
- Prepare Planner, Shopping and Settings shortly after a signed-in session becomes ready to reduce first-visit delay.

## Search service

- Recipe generation and analysis use `gemini-3.5-flash`.
- Production traffic uses the cloud proxy.
- Direct mode is for local development and troubleshooting.
- A failed direct request must fall back to the cloud proxy where the existing flow supports it.
- Technical connection status belongs in the restricted diagnostics panel, not the ordinary interface.
- User-facing errors must be plain English and must not expose provider codes or routing details.
- Local development requires a valid `GEMINI_API_KEY`.

## Serverless compatibility

- Do not write runtime state or logs to the local filesystem.
- Use explicit path resolution.
- Treat function storage as temporary and read-only.

## Data security and administration

- Firestore rules must check that a path exists before reading properties from it.
- A first-time user without a stored profile is treated as having an active trial while initial profile data is created.
- Administrative access currently uses the verified-email allow-list in `AuthContext.tsx` and `firestore.rules`.
- Migrate to Firebase Custom Claims if roles expand or become more granular.
- Keep the admin dashboard divided into clearly labelled panels. Account metrics must not appear to belong to the published-articles section.

## Authentication

- Web authentication uses `browserPopupRedirectResolver`.
- Keep production and supported local domains authorised in Firebase.
- Password reset first attempts the configured continuation URL, then retries the standard secure reset email if that attempt fails.
- Use neutral password-reset messaging to reduce account enumeration risk.

## Transactional email

- App-authored email uses `/api/send-email` with Resend.
- Stripe lifecycle email uses `sendTrackedEmail` and records delivery attempts in `emailEvents`.
- Maintain automatic email for welcome, trial ending, password change, account deletion, subscription activation, subscription cancellation, payment failure and permanent access.
- User-requested recipe, shopping-list, test and administrator sends use the same delivery path but are not automatic lifecycle messages.

## Weekly planner

- Planner protein choices inherit compatible dietary, allergen, exclusion, religious and ethical preferences.
- Available choices must explain that personalised preferences are being applied when the filtering could otherwise seem arbitrary.
- Planner time choices are Any, Quick, Under 30 mins and Under 45 mins.
- Under-30 and under-45 choices set hard maximum total times.
- Saved-dinner quick filters are Under 20 min, Vegetarian, High protein and Batch-friendly.
- Cost remains a sort option through `Lowest cost first`.
- Compact saved and planner rows do not show salad type.

## Offal

- Ordinary suggestions exclude offal unless `includeOffal` is enabled.
- Use one saved `Include offal in suggestions` control.
- A direct search for a recognised offal term may permit it for that search without changing the saved preference.
- Selecting Offal in the weekly planner permits it for that plan only.
- Continue to apply all other dietary, allergen, religious and ethical restrictions.
- Enforce the rule in generation instructions and deterministic filtering.

## Programmatic SEO

- Every public guide must comply with `docs/PROGRAMMATIC_SEO_PUBLISHING_STANDARD.md`.
- Public pages may demonstrate cost, ingredient reuse and personalisation without cluttering protected app views.
- Register each published page in the structured publishing registry.
- Generate crawler-visible HTML, canonical metadata and the appropriate structured data.
- Include published pages in the generated guide library and sitemap.
- Unknown paths under the public page families must return HTTP 404 with `noindex, nofollow`.
- Apply only the controlled disclosures relevant to the page's claims.
- Public cost claims must distinguish ingredient value from complete-pack checkout cost.
- After publication, verify the live page, canonical URL, structured data, internal discovery and sitemap entry.
- Whenever a new public programmatic page is published, submit the canonical sitemap URL in Google Search Console after verifying the live sitemap.
- If authenticated Search Console access is unavailable, report the submission as outstanding. Do not claim it was completed.

## Public affordability experience

- `AFFORDABILITY_PLANNER_PILOT` gates the public budget-plan route and planner handoff.
- Public handoffs prefill the existing weekly planner. Do not create a second selection engine.
- A built week may show combined estimated dish cost, cost per serving, budget variance and pricing coverage.
- Keep that estimate distinct from the later shopping-list estimate based on scheduled dinners, complete packs, shared ingredients and available ingredients.
- The rollback branch is `backup/pre-affordability-planner-20260717`.

## Guest Search experience

- `SIMPLIFIED_GUEST_SEARCH_STATES` in `src/config/features.ts` gates the simplified new, returning and exhausted guest Search states.
- Keep the existing guest Search interface available behind the `false` flag path. Set the flag to `false` for an immediate rollback without deleting either implementation.
- When the free-search allowance is exhausted, replace inactive Search controls with one account panel while leaving any existing results visible below it.
- New guests may see no more than three compact starter searches. Returning guests should see a quiet remaining-search count rather than the full onboarding panel.
- Count each guest search-service request against the three-search allowance, including `More choices`. Label that action clearly for guests and block it when the allowance is exhausted.

## Public guides inside the working app

- Keep contextual guide links short and situational. Show portion planning beside the portions control, pricing methodology beside cost controls and estimates, fresh-versus-frozen guidance only for relevant searches, and pack-use guidance in Shopping.
- Direct loads under `/guides/`, `/food-costs/` and `/dinner-plans/` use the lightweight `PublicGuideApp` shell. They must not initialise authentication, search, planner, shopping or administration code.
- `AppCore` owns the working application and may lazy-load individual views. Keep `src/lib/publicRoute.ts` aligned with public route families and preserve crawler-visible HTML generation for every published guide.
- Direct guide routes use `PublicGuideShell` for the shared wordmark, breadcrumb treatment and public linked footer. Keep public footer links as ordinary URLs so they work without the authenticated app context.
- Keep Playwright coverage for guest tab restrictions, search preferences, guide category jumps, guide-to-account handoffs, public footer links and the signed-in planner-to-shopping route. The signed-in journey uses `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` when a dedicated test account is available.

## Public SEO pathways

- `/guides` is a restrained signpost to three public pathways. It must not become a second full article index.
- The permanent hubs are `/dinner-plans`, `/recipes` and `/food-costs`.
- Every published public article must appear in exactly one pathway in `src/content/publicPathways.ts`. Tests enforce complete coverage and prevent duplicate assignments.
- Assigning an article to a pathway does not change its existing canonical URL.
- The public homepage, public header, footer, breadcrumbs, generated HTML and sitemap should make the three hubs easy to reach.

## Ingredient price refresh

- Do not scrape retailer websites without written permission or an appropriately licensed feed.
- Scheduled refresh requires the configured secret, feed URL, allowed origin and confirmed permission flag.
- Unchanged active prices may have their verification date refreshed automatically.
- Stage new or changed product, pack and price data for administrator approval.
- If no licensed feed is available, retain the verified catalogue and built-in UK reference prices.

## Release rule

Before production publication, follow `docs/OPERATIONS_AND_RELEASE.md`. A public guide release must also pass the release gate in `docs/PROGRAMMATIC_SEO_PUBLISHING_STANDARD.md`.
