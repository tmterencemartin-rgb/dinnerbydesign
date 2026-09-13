# DinnerByDesign partner readiness pack

**Status:** Internal working draft  
**Reviewed:** 13 September 2026

## Product in one paragraph

DinnerByDesign helps people search for dinner ideas, organise suitable recipes, build a weekly plan and create a shopping list. It uses user-selected preferences, structured checks and automated generation to narrow results. It links to external recipe publishers and retailers where a relevant source is available.

DinnerByDesign is independent. A source mention or external link does not mean that the named publisher, retailer, chef or brand has created, approved or endorsed the app.

## Technology and service dependencies

DinnerByDesign currently relies on the following services and platforms:

- **Vercel** hosts the public website, serverless API and scheduled operational checks.
- **Firebase** provides account authentication, Google sign-in, anonymous access and Cloud Firestore storage for profiles, preferences, saved recipes, weekly plans, shopping lists and selected operational records.
- **Google Gemini API** supports recipe search, ready-made product search, weekly planning and recipe analysis. Requests may use Gemini's Google Search grounding to locate current publisher or retailer pages. This is not the same as presenting every AI-generated result as independently verified: DinnerByDesign applies its own source-link and result checks before delivery.
- **Stripe** handles subscription checkout, billing status and payment webhooks.
- **Resend** sends account, password, subscription and other transactional emails.

The app links to external recipe publishers and retailer websites. These links may be validated publisher pages, validated retailer product pages or retailer search pages, depending on the result available. DinnerByDesign does not claim that a named publisher, retailer, chef or brand has approved or endorsed the app.

Ingredient costs currently use a curated UK reference catalogue, with a separate path available for an approved licensed retailer price feed. Retailer prices, pack sizes, promotions, availability and product information remain subject to the relevant retailer's current page.

GitHub is used for source-code management and release history. Capacitor is used for the optional iOS wrapper, which uses the same application and production API. Optional Google Cloud and Firebase administrative capabilities support server-side administration and Firestore backup monitoring where separately configured. No separate advertising or third-party analytics platform currently forms part of the production stack.

## What we can say today

- Recipe results may include a publisher source page or domain. Generic dinner ideas may have no identifiable publisher source.
- External publishers retain ownership of their recipes and current source-page details.
- Trusted-source preferences influence ranking but do not guarantee that a source will appear.
- Price and nutrition figures are estimates. Retailer, location, pack size, availability, promotion and date can change the result.
- Search wording and relevant preferences may be processed by Google Gemini to generate or expand results and weekly plans.
- User searches are not used to train DinnerByDesign's own AI model.
- The app does not currently accept payment to rank results and does not currently present links as affiliate links.
- Support is available through `terence@dinnerbydesign.app`.

## Partner categories

### Recipe publishers

The appropriate relationship is source attribution, a direct referral link, a licensed feed or a separately negotiated content arrangement. The app should not be described as reproducing a publisher's full recipe unless a written licence allows that use.

### Retailers and product brands

The appropriate relationship may involve product links, a licensed catalogue, verified price data, referral links or a campaign. Product availability, pack information, ingredients and labels must remain subject to the current retailer or manufacturer page.

### Commercial affiliates

An affiliate arrangement must be treated as a separate commercial relationship. It requires written terms, a visible disclosure beside affected links, a defined attribution window, reporting rules, payment terms, refund handling and a process for broken or withdrawn products.

## Data boundary

The default partner position should be that DinnerByDesign does not pass customer names, email addresses, search histories, dietary preferences or saved plans to a partner. Partner reporting should use aggregated referral or conversion data unless a separate, lawful data-sharing arrangement has been reviewed and agreed.

## Operational commitments to define

Before a live partner link or feed is introduced, agree:

1. Who owns the customer relationship.
2. Which links or products are commercial and how they are labelled.
3. What source, price, stock and product information may be displayed.
4. How often source and catalogue information is checked.
5. What happens when a page, product, price or feed becomes unavailable.
6. What reporting a partner receives and when it is issued.
7. Who handles customer, safety, refund and attribution questions.
8. How either party can pause or end the arrangement.

## Evidence currently available

- Production service health endpoint: `https://dinnerbydesign.app/api/health`
- Public privacy, terms, pricing, food-safety, nutrition and recipe-information pages.
- Automated checks for required fields, dietary conflicts, exclusions and retailer restrictions.
- Curated UK reference pricing with a separate path for approved licensed retailer data.
- Internal admin views for account access, subscription state, usage totals and email events.

## Open items before commercial launch

- Choose the first partner category and agree the commercial model.
- Add first-party referral tracking only after the link and disclosure rules are agreed.
- Confirm whether a licensed retailer or publisher feed is required.
- Write the partner data-processing and reporting schedule.
- Define a support response target and an incident escalation route.
- Obtain specialist UK legal review of affiliate, consumer, privacy, advertising and intellectual-property wording before signing.

## Suggested opening position

DinnerByDesign is an independent dinner-planning service. We can help people discover relevant recipes and products, while keeping source attribution clear and leaving the publisher or retailer as the authority for current instructions, labels, price and availability. Any commercial relationship would be disclosed, measurable and kept separate from relevance-based ranking.
