# Published recipe sourcing report

**Audience:** prospective recipe publishers, retailers and commercial partners
**Status:** current operating position
**Date:** 10 September 2026

## Executive position

DinnerByDesign helps people discover suitable dinners by combining their search terms and saved preferences with live web discovery. For published recipes, it uses Google Search grounding to find relevant pages and presents concise comparison information with a direct link to the original publisher.

This is a controlled discovery service, not an unrestricted web crawl or a fixed catalogue of copied recipes. Only direct, accessible recipe pages from an approved set of UK-oriented sources can be displayed. DinnerByDesign does not reproduce a publisher's full recipe method, and it does not imply that a publisher has created, approved, endorsed or partnered with DinnerByDesign merely because a page is linked.

## How published-recipe discovery works

### 1. The user defines the brief

A search begins with the user's words, such as an ingredient, dish, cuisine or chef. Active search filters and saved preferences are sent with that request.

Dietary rules, allergies and exclusions are screened against the result information returned to the app. When a request is parsed as an ingredient-led search, each named ingredient is treated as a separate requirement and results that do not show all of those ingredients are removed. Budget and total-time limits are checked against the returned estimate and timing fields.

Cooking-method and preferred-source settings guide discovery, but do not operate as absolute filters. Preferred sources are a ranking preference: a more relevant result from another approved source can be shown instead. DinnerByDesign does not independently verify every ingredient or allergen statement on the publisher's full page. No result should be described as allergen-safe, and users should consult the original publisher's ingredients, allergen information and method before cooking.

### 2. Google Search finds candidate pages

The search service asks Google Search to find genuine UK recipe pages that match the brief. It normally asks for three choices. Google Search is used for discovery at the time of the request; DinnerByDesign does not maintain or claim to search a complete index of every recipe available online.

### 3. Candidate pages must pass source checks

Every published-recipe result must have a direct HTTPS source link. The app accepts a candidate only when it meets the following conditions:

- It is a direct recipe page, rather than a home page, search page, category, topic or collection page.
- It is available without a paywall, trial, sign-in or app hand-off.
- It comes from an approved source domain.
- Where Google supplies grounding metadata, the final link must reconcile with that specific grounded page.
- Where grounding metadata is not available, the fallback is limited to a direct page from the approved source list. This is source-backed validation, not a claim that the result was Google-grounded.
- Duplicate titles are removed and the app aims to show different publishers where suitable alternatives exist.

The app checks that the linked page remains usable before it is delivered. A candidate that fails these checks is excluded.

### 4. Recovery is limited and preserves the brief

Some requests have few suitable, accessible pages. In that case, DinnerByDesign makes a small, bounded set of follow-up searches across unused approved sources. It does not relax dietary, allergy, ingredient, budget or time restrictions to fill the screen.

For a broad published-recipe search, there can be an initial request and up to three recovery requests. Ingredient-led searches use one compact recovery request designed to preserve every named ingredient. If valid choices cannot be verified, the app may return fewer than three rather than present a weak or unverified match.

## Current fixed parameters

| Control | Current position |
| --- | --- |
| Standard result request | Three published recipes |
| Approved web domains | 41 domains, listed below |
| Link requirement | Direct, accessible HTTPS recipe page |
| Excluded page types | Search, category, topic and collection pages, home pages, paywalled, trial-only, sign-in-only and app-only content |
| User constraints | Dietary rules, allergies, exclusions, ingredients, budget, time, cuisine, cooking method and source preferences |
| Source variety | One result per publisher where suitable alternatives exist |
| Recovery | Bounded source-focused follow-up searches, with the original restrictions retained |

## What users see

DinnerByDesign presents a short comparison card and a direct link to the original source. The original publisher remains the authoritative source for the recipe, including its current ingredients, quantities, method, allergen information, timings and food-safety guidance.

DinnerByDesign's description is a concise aid to comparison and planning. It is not presented as a reproduction of the publisher's recipe or as a substitute for the original source page.

## Attribution, independence and commercial position

- A source link does not mean the publisher created, approved or endorsed DinnerByDesign.
- A source link does not establish a commercial relationship with the publisher.
- DinnerByDesign does not accept payment to rank published-recipe results.
- Trusted-source preferences may influence ranking, but do not guarantee that a particular publisher appears.
- The product should not be described as a complete catalogue of any publisher's recipes or of recipes available on the web.

Any affiliate, licensed-content, referral or data-feed arrangement would be a separate commercial agreement. It would need clear disclosure, agreed reporting, permitted-use terms and a route to pause or remove the arrangement.

## Limits to state plainly

Published-recipe discovery is designed for relevant, attributable choices rather than exhaustive coverage. Search outcomes can vary because pages change, become unavailable, are blocked by access conditions, or do not meet the user's restrictions. A source-backed result is not always technically Google-grounded, because a strict approved-source fallback is used when Google does not return usable grounding metadata.

No publisher should be described as a partner, supporter or endorser unless there is a signed agreement stating that relationship.

## Current approved source domains

The present allow-list covers the following domains:

- goodto.com; bbc.co.uk
- tescorealfood.com; realfood.tesco.com; tesco.com
- theguardian.com; deliciousmagazine.co.uk; thehappyfoodie.co.uk; deliaonline.com; nigella.com
- foodnetwork.co.uk; pinchofnom.com; maryberry.co.uk; greatbritishrecipes.com; recipetineats.com
- gressinghamduck.co.uk; annaskitchentable.co.uk; independent.co.uk; recipesmadeeasy.co.uk; riverford.co.uk
- ottolenghi.co.uk; coop.co.uk; jamesmartinchef.co.uk; hairybikers.com; dontgobaconmyheart.co.uk
- krumpli.co.uk; ourmodernkitchen.com; kitchensanctuary.com; diabetes.org.uk; slimmingworld.co.uk
- jamieoliver.com; asda.com; sainsburysmagazine.co.uk; olivemagazine.com; greatbritishchefs.com
- goodhousekeeping.com; easypeasyfoodie.com; lovepork.com; groceries.morrisons.com; marksandspencer.com; abelandcole.co.uk

The allow-list is a product control, not a statement of endorsement or a commercial arrangement.

## Recommended additions before partner discussions

### Publisher participation and removal policy

Publish a short policy that gives publishers one contact route for attribution corrections, broken links, questions about source use and requests to remove a domain or page. Set a response target and identify who can approve a removal.

### Source governance record

Maintain an internal record for every approved domain: owner, reason for inclusion, review date, known access restrictions, permitted link format and removal history. Review the list on a scheduled basis and after material site changes.

### Commercial-link disclosure standard

Define how affiliate links, paid placements, licensed content and retailer data feeds would be labelled before any arrangement begins. The disclosure should sit close to the affected link or result.

### Partner data boundary

State that personal data, search history, dietary preferences and saved dinners are not shared with a partner by default. Any proposed data-sharing arrangement should be documented separately, with a lawful basis, data-minimisation approach, retention period and user notice.

### Service and incident commitments

Define how broken links, inaccessible content, incorrect attribution and partner queries are logged, investigated and closed. A small monthly report covering link health, referrals, removals and unresolved issues would provide useful evidence for a partner.

## Partner-ready wording

> DinnerByDesign uses Google Search to find published recipes that match a user's request and preferences. We show concise comparison information and direct users to the original publisher's recipe page. Every displayed result must meet our direct-link and accessibility checks and come from an approved source domain. We do not copy the full recipe or imply that a publisher endorses DinnerByDesign. If we cannot verify a suitable source, we may show fewer results rather than lower the standard.
