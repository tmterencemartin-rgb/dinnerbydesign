# DinnerByDesign Programmatic SEO Publishing Standard

## Purpose and authority

This is the operational publishing standard for DinnerByDesign public programmatic content. It converts the strategic direction in the DinnerByDesign Programmatic SEO Strategy into rules that can be reviewed in source control and enforced by the application build.

Every new public page, topic, template and publishing workflow must comply with this standard. Where this file and the strategy appear to differ, stop publication and resolve the difference before release.

The objective is to answer a practical customer question: what can a household cook for dinner, and what is it likely to cost? Programmatic publishing must create useful planning resources. It must never create thin pages merely to cover keyword combinations.

## Product and commercial boundary

DinnerByDesign should demonstrate financial usefulness before asking a visitor to subscribe.

Public pages may provide:

- Permanent recipes where publication and image rights permit.
- Budget dinner collections.
- Selected fixed weekly dinner plans.
- Cost-per-portion and total-dinner estimates.
- Sample grouped shopping lists.
- Ingredient-reuse and leftover guidance.
- Affordability and food-cost guides.

Subscription functionality may provide:

- Weekly plans generated for a particular household and budget.
- Saved household, dietary and ingredient preferences.
- Automatic ingredient coordination across a week.
- Personalised costed shopping lists.
- Adjustments for ingredients already owned.
- Saved recipes and schedules.
- Price-aware recommendations and ongoing replanning.

Public articles must be complete and useful without registration. Do not obscure, truncate or interrupt them with a registration wall. A contextual CTA may invite the visitor to personalise the example. Registration begins only when the visitor requests personalised, saved or generated functionality.

The commercial message must remain measured. Demonstrate savings and waste reduction through transparent examples rather than promising that every subscriber will save a particular amount.

## Public discovery and library threshold

- Every published page must be reachable through at least one crawlable HTML link.
- Until 12 programmatic pages are published, individual links may remain in relevant page content and the landing-page footer.
- When the twelfth page is registered as published, create a public library at `/guides` and add one restrained `Guides` link to the landing-page footer.
- At that point, replace the growing collection of individual footer article links with the single library link.
- Do not add the library to the protected app's primary navigation unless a later product decision explicitly requires it.
- The public library must group pages by customer need and page family; it must not become an unstructured archive or tag cloud.
- `PUBLIC_LIBRARY_LAUNCH_THRESHOLD` and `PUBLIC_LIBRARY_PATH` in `src/content/publicArticles.ts` enforce the reminder through tests.

## Audience and search intent

Public content should address UK households choosing regular evening dinners, including families, couples, busy households, people managing dietary requirements and people seeking to reduce shopping costs or food waste.

A page should resolve a recognisable combination of constraints, such as:

- Budget or cost per portion.
- Household size.
- Available time.
- Dietary requirements.
- Ingredients already available.
- Cooking method.
- Ingredient reuse, batch preparation or leftovers.
- Cooking compared with a ready-made option.

Combine only two or three dimensions when they create a genuinely distinct need. Do not publish every possible filter permutation.

## Approved page families and URL patterns

### Broad dinner hubs

Use stable routes below `/dinner-ideas/`, such as budget, quick, family, vegetarian, air-fryer, batch-cooking or using-leftovers. A hub must introduce the customer decision, provide selection guidance and link to narrower useful collections.

### Combination collections

Use descriptive nested routes below `/dinner-ideas/`. A combination is eligible for indexing only when it:

- Represents a recognisably different search need.
- Has credible demand.
- Contains at least 8–12 suitable dinners.
- Provides distinctive comparisons, guidance or substitutions.
- Has reasonably stable inventory.
- Has useful internal links.
- Is substantially different from adjacent pages.

Empty combinations, arbitrary filters and user-generated search URLs must remain `noindex`.

### Costed weekly dinner plans

Use stable routes below `/dinner-plans/`. Each published plan should normally contain five or seven dinners and must include:

- Household size and serving assumptions.
- Estimated cost for each dinner and each portion.
- Estimated complete-pack checkout cost.
- Estimated value of ingredients used.
- A grouped shopping list that reconciles to both totals.
- Ingredients reused between dinners.
- Expected pack remainders and useful leftovers.
- Lower-cost substitutions.
- Preparation or batch advice.
- Pricing basis and price-review date.

The purpose is to reduce the cost and waste of the coordinated week, not simply collect individually inexpensive recipes.

### Permanent recipe pages

Use stable routes below `/recipes/`. Every page must include:

- A unique description.
- Ingredients and instructions.
- Preparation, cooking and total time.
- Number of servings.
- Estimated portion and total cost.
- Dietary and allergen information.
- Lower-cost substitutions and suggested sides where useful.
- Storage and leftover guidance.
- Original or appropriately licensed imagery.
- Links to relevant collections and dinner plans.

Search-result overlays are not substitutes for permanent crawlable recipe pages.

### Affordability and food-cost guides

Use stable routes below `/food-costs/` or another approved guide family. Guides should explain pricing, budgeting, waste reduction or related decisions that do not fit a structured recipe or plan template. They must use primary evidence wherever available and link to relevant practical content.

## Required page structure

Every collection or dinner-plan page must include:

- One precise H1 matching the primary customer need.
- A concise and useful introduction.
- Explicit household and serving assumptions.
- Suitable dinner or recipe results.
- Relevant time, cost, dietary and cooking-method comparisons.
- An explanation of how entries were selected.
- Advice specific to the collection.
- Substitutions and waste-reduction guidance.
- Four to six genuinely useful questions and answers.
- Selective links to related hubs, collections, plans, recipes and methodology pages.
- A contextual CTA to personalise, plan or generate a shopping list.

Structured planning utility is the core content. Do not pad pages with generic search-engine copy.

## Pricing integrity

Every financial claim must:

- Be described as an estimate.
- State the source, catalogue or supermarket basis.
- Display when prices were checked.
- Distinguish complete-pack checkout cost from the value consumed.
- State whether common cupboard ingredients are included.
- Make serving assumptions explicit.
- Allow for retailer, regional and availability differences.
- Avoid invented discounts and dependency on temporary promotions.
- Use a range when the evidence does not support a precise figure.

A clearly labelled round-figure calculation that exists only to demonstrate arithmetic is not a market-price claim. It does not require a retailer source or price-check date when the page states that the figures are illustrative, does not present them as observed prices and tells the reader to substitute current pack information. Any real product, retailer, basket, saving or `under £X` figure remains subject to the full pricing requirements above.

Visible line items must reconcile exactly to every stated total. Cost-sensitive plans and `under £X` collections require a monthly price check. Material price or availability changes must be addressed promptly.

## Disclosure framework

Use concise, specific disclosures rather than one defensive legal paragraph. A qualification must sit beside the claim it explains; a footer note must not be used to repair a misleading headline, price or comparison.

Each controlled page record must declare every applicable disclosure key:

- `price_estimate`: required when a page shows a calculated ingredient, portion, dinner, plan or checkout cost.
- `price_comparison`: required when a page compares retailers, products, baskets, cuts, recorded outcomes or forecasts.
- `serving_assumption`: required when cost or quantity depends on household size or portion count.
- `source_timing`: required when evidence changes over time, including prices, inflation, availability and forecasts.
- `storage_and_cooking`: required when the page gives storage, freezing, defrosting, cooking or reheating guidance.
- `allergen_and_product`: required when ingredients, packaged products or dietary suitability are presented.
- `affiliate_or_commercial`: required before any paid placement, affiliate link or other commercial relationship is introduced.

Placement rules:

- Show cost and comparison qualifications immediately below the relevant figures or comparison.
- Show serving assumptions beside the quantities or totals they affect.
- Show storage and product information within the relevant guidance, not only at the bottom of the page.
- Keep the shared `About this guide` footer on every programmatic page, with links to the pricing methodology and relevant selection methodology.
- Keep important exclusions visible. Do not hide them only in an accordion, tooltip, terms page or footer.
- Use reader-facing labels such as `About these estimates`, `How to read these figures`, `Serving assumption` and `Storage and safety` rather than repeating `Disclaimer`.

The controlled wording and initial-HTML renderer live in `src/content/programmaticDisclosures.ts`; the client component lives in `src/components/ProgrammaticDisclosures.tsx`. Page-specific disclosures must use that shared system so crawler-visible HTML and the rendered interface remain consistent.

## Evidence, rights and editorial verification

- Prefer official and primary sources for substantive claims.
- Record source URLs and the date on which evidence was reviewed.
- Verify recipes, prices, classifications and substantive claims before publication.
- Confirm recipe ownership, attribution and image rights.
- Automation may assist drafting, classification and summarisation, but it must not publish unverified claims.
- Structured data must describe information visibly available on the page.

## Required publishing record

Every controlled page record must include:

- Stable slug and canonical path.
- Page family.
- Primary search intent.
- Unique title, H1, description and introduction.
- Eligibility rules and minimum result count where applicable.
- Cost methodology where applicable.
- Editorial owner and notes.
- Publication status and indexing status.
- Publication, content-review and price-review dates as applicable.
- Internal-link relationships.
- Applicable disclosure keys and their placement.
- Source and rights information where applicable.

Published pages must be registered in `src/content/publicArticles.ts`. Draft and retired records must never appear in the published article list or sitemap.

## Technical requirements

Every indexable page must:

- Use a clean permanent URL.
- Return useful content in the initial HTML response.
- Be available without signing in.
- Have unique title and description metadata.
- Use a self-referencing canonical URL.
- Use only appropriate, visible and verified structured data.
- Be included selectively in the generated XML sitemap.
- Be connected through crawlable HTML links.
- Remain distinct from protected and personalised app routes.
- Return HTTP 404 when the requested public record does not exist.

Private account, planner, shopping and admin routes must remain `noindex`. Sitemaps must contain only canonical published URLs that deserve indexing.

## Structured data

Use the smallest appropriate set:

- `Recipe` for permanent recipe pages.
- `ItemList` for collections and coordinated dinner plans.
- `BreadcrumbList` for public hierarchy.
- `Article` for editorial guides.
- `Organization` or `WebApplication` for the service where appropriate.
- `FAQPage` only when the same questions and answers are visibly presented.

Initial HTML, client-rendered content and structured data must not contradict one another.

## Internal linking

- Broad hubs link to suitable combination pages.
- Combination pages link to permanent recipes.
- Recipes link back to relevant collections.
- Weekly plans link to their recipes and related plans.
- Affordability guides link to relevant costed content.
- Related links must be selective and useful, not mechanically generated lists.
- Every indexable page must be discoverable without relying solely on the sitemap or internal search.

## Publishing pace

During the controlled first phase, target three strong new pages each week:

- One costed weekly dinner plan.
- One collection or combination page.
- One permanent recipe page or affordability guide.

Materially improve at least one existing page each week. Increase output only after reliable indexing, relevant search visibility, positive engagement and useful product actions are demonstrated. Publishing volume must never exceed the ability to verify prices, maintain existing pages and preserve distinct value.

## Review and retirement

Review schedules:

- Costed weekly plans and `under £X` collections: monthly price check.
- Supermarket-specific pages: at least monthly.
- Seasonal pages: four to six weeks before the relevant period.
- General collections: every three to six months.
- Permanent recipes: every six to twelve months.

Consolidate, redirect or remove a page when it no longer has enough qualifying content, overlaps materially with another page, repeatedly fails to be indexed, cannot support its cost promise, attracts irrelevant searches or provides no measurable customer or business value.

## Measurement

Monitor performance by page family:

- Valid indexed pages compared with submitted pages.
- Non-brand impressions and clicks.
- Search click-through rate and average ranking.
- Search terms reaching the top ten.
- Structured-result eligibility.
- Page engagement and recipe saves.
- Dinner-plan interactions.
- Shopping-list creation.
- `Plan my week` usage.
- Trial and subscription conversion.

Do not increase production merely because page generation is technically easy.

## New-page workflow

1. Define the customer need, page family and primary search intent.
2. Confirm demand, distinctiveness, inventory and rights.
3. Create the controlled content record with every required field.
4. Draft the useful structured content, select applicable disclosure keys and verify claims, prices and sources.
5. Register the page in `src/content/publicArticles.ts`.
6. Add selective internal links from and to existing public pages.
7. Generate the static initial HTML, metadata, canonical and structured data.
8. Generate the sitemap from the published registry.
9. Run tests for totals, metadata, initial HTML parity, structured data, sitemap inclusion and unknown-path 404 behaviour.
10. Review the page at mobile, tablet and desktop widths.
11. Deploy and verify live HTTP status, canonical, structured data and sitemap inclusion.
12. Record the next content-review and price-review dates.

## Release gate

Do not publish unless all applicable answers are yes:

- Does the page serve a distinct and recognisable customer need?
- Does it meet its minimum qualifying-content threshold?
- Is the content materially different from adjacent pages?
- Are all cost figures transparent, current and internally reconciled?
- Are every applicable disclosure and material qualification visible beside the claim it explains?
- Are primary claims and sources verified?
- Are rights and attribution acceptable?
- Is core content present in the initial HTML?
- Are metadata, canonical and structured data correct?
- Is the page linked from another crawlable public page?
- Is it present in the generated sitemap?
- Do unknown records in the same family return HTTP 404?
- Is the CTA useful and proportionate to the public value already provided?
- Are review dates and ownership recorded?
