import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40,
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  getFiveDinnersForTwoJsonLd,
  renderFiveDinnersForTwoInitialHtml,
} from '../src/content/seoMealPlans';
import {
  FAMILY_DINNERS_FOR_FOUR,
  FAMILY_DINNERS_FOR_FOUR_PATH,
  getFamilyDinnersForFourJsonLd,
  renderFamilyDinnersForFourInitialHtml,
} from '../src/content/familyDinnersForFourPlan';
import {
  BATCH_COOKING_GUIDE,
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE,
  MEDITERRANEAN_AFFORDABLE_COOKING_PATH,
  OFFAL_BUDGET_GUIDE,
  OFFAL_BUDGET_GUIDE_PATH,
  PORTION_PLANNING_GUIDE,
  PORTION_PLANNING_GUIDE_PATH,
  SUMMER_STEWS_GUIDE,
  SUMMER_STEWS_GUIDE_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getBatchCookingGuideJsonLd,
  getCookingForOneJsonLd,
  getFreshOrFrozenGuideJsonLd,
  getMediterraneanAffordableCookingJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getSummerStewsGuideJsonLd,
  getUkFoodCosts2026JsonLd,
  renderCookingForOneInitialHtml,
  renderFreshOrFrozenGuideInitialHtml,
  renderMediterraneanAffordableCookingInitialHtml,
  renderOffalBudgetGuideInitialHtml,
  renderPortionPlanningGuideInitialHtml,
  renderSummerStewsGuideInitialHtml,
  renderUkFoodCosts2026InitialHtml,
  renderBatchCookingGuideInitialHtml,
} from '../src/content/seoFoodCostGuides';
import {
  GROCERY_COST_OPTIONS_GUIDE,
  GROCERY_COST_OPTIONS_GUIDE_PATH,
  getGroceryCostOptionsGuideJsonLd,
  renderGroceryCostOptionsGuideInitialHtml,
} from '../src/content/groceryCostOptionsGuide';
import {
  GROCERY_COST_PREDICTION_GUIDE,
  GROCERY_COST_PREDICTION_GUIDE_PATH,
  getGroceryCostPredictionGuideJsonLd,
  renderGroceryCostPredictionGuideInitialHtml,
} from '../src/content/groceryCostPredictionGuide';
import {
  CHEAPER_MEAT_CUTS_GUIDE,
  CHEAPER_MEAT_CUTS_GUIDE_PATH,
  getCheaperMeatCutsGuideJsonLd,
  renderCheaperMeatCutsGuideInitialHtml,
} from '../src/content/cheaperMeatCutsGuide';
import {
  SHARED_INGREDIENTS_GUIDE,
  SHARED_INGREDIENTS_GUIDE_PATH,
  getSharedIngredientsGuideJsonLd,
  renderSharedIngredientsGuideInitialHtml,
} from '../src/content/sharedIngredientsGuide';
import {
  PUBLIC_GUIDE_LIBRARY,
  getPublicGuideLibraryJsonLd,
  renderPublicGuideLibraryInitialHtml,
} from '../src/content/publicGuideLibrary';
import {
  FIVE_A_DAY_GUIDE,
  FIVE_A_DAY_GUIDE_PATH,
  getFiveADayGuideJsonLd,
  renderFiveADayGuideInitialHtml,
} from '../src/content/fiveADayGuide';
import {
  HOME_COOKED_READY_MADE_GUIDE,
  HOME_COOKED_READY_MADE_GUIDE_PATH,
  getHomeCookedReadyMadeGuideJsonLd,
  renderHomeCookedReadyMadeGuideInitialHtml,
} from '../src/content/homeCookedReadyMadeGuide';
import {
  LOW_COST_DINNERS_GUIDE,
  LOW_COST_DINNERS_GUIDE_PATH,
  getLowCostDinnersGuideJsonLd,
  renderLowCostDinnersGuideInitialHtml,
} from '../src/content/lowCostDinnersGuide';
import {
  PULSES_BUDGET_GUIDE,
  PULSES_BUDGET_GUIDE_PATH,
  getPulsesBudgetGuideJsonLd,
  renderPulsesBudgetGuideInitialHtml,
} from '../src/content/pulsesBudgetGuide';
import {
  TRAYBAKE_GUIDE,
  TRAYBAKE_GUIDE_PATH,
  getTraybakeGuideJsonLd,
  renderTraybakeGuideInitialHtml,
} from '../src/content/traybakeGuide';
import {
  CHICKEN_THIGH_COST_GUIDE,
  CHICKEN_THIGH_COST_GUIDE_PATH,
  getChickenThighCostGuideJsonLd,
  renderChickenThighCostGuideInitialHtml,
} from '../src/content/chickenThighCostGuide';
import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from '../src/content/publicGuideRegistry';
import { getPublicGuideJsonLd, renderPublicGuideInitialHtml } from '../src/content/publicGuideModel';
import { PUBLIC_LIBRARY_PATH } from '../src/content/publicArticles';
import {
  PUBLIC_PATHWAYS,
  getPublicPathwayJsonLd,
  renderPublicPathwayInitialHtml,
} from '../src/content/publicPathways';

const distRoot = path.resolve(process.cwd(), 'dist');
const sourceHtml = await fs.readFile(path.join(distRoot, 'index.html'), 'utf8');
const hideInitialSeoContentWhenJavaScriptRuns = (initialHtml: string) => {
  const rootStart = '<div id="root">';
  if (!initialHtml.startsWith(rootStart) || !initialHtml.endsWith('</div>')) {
    throw new Error('Initial SEO content must have a single root container.');
  }

  const publicPathwayNav = '<nav aria-label="Public pathways"><a href="/dinner-plans">Affordable dinner plans</a> · <a href="/recipes">Recipes and cooking ideas</a> · <a href="/food-costs">Food-cost and waste guidance</a></nav>';
  const content = initialHtml.includes('aria-label="Public pathways"')
    ? initialHtml
    : initialHtml.replace('</header>', `</header>${publicPathwayNav}`);

  return `${rootStart}<div class="app-initial-fallback">${content.slice(rootStart.length, -6)}</div></div>`;
};

const generateEditorialGuide = async (
  guide: { title: string; seoTitle: string; description: string },
  guidePath: string,
  renderInitialHtml: () => string,
  getJsonLd: () => object,
) => {
  const canonical = `https://dinnerbydesign.app${guidePath}`;
  const initialHtml = renderInitialHtml();
  const guideHtml = sourceHtml
    .replace(/<title>.*?<\/title>/, `<title>${guide.seoTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${guide.description}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${guide.seoTitle}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${guide.description}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${guide.seoTitle}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${guide.description}" />`)
    .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
    .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(initialHtml))
    .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getJsonLd())}</script>\n</head>`);

  if (!guideHtml.includes(`<h1>${guide.title}</h1>`) || !guideHtml.includes(`href="${canonical}"`)) {
    throw new Error(`${guidePath} generation failed its content or canonical check.`);
  }

  const outputDir = path.join(distRoot, guidePath.slice(1));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), guideHtml, 'utf8');
  console.log(`Generated ${guidePath}/index.html`);
};
const canonicalUrl = `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`;
const title = FIVE_DINNERS_FOR_TWO_UNDER_40.seoTitle;
const description = 'Five affordable UK dinners for two under a £40 target, with shared ingredients, full-pack checkout estimates and practical substitutions.';

let html = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderFiveDinnersForTwoInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getFiveDinnersForTwoJsonLd())}</script>\n</head>`);

if (!html.includes(`<h1>${FIVE_DINNERS_FOR_TWO_UNDER_40.title}</h1>`) || !html.includes(`href="${canonicalUrl}"`)) {
  throw new Error('SEO page generation failed its content or canonical check.');
}

const outputDir = path.join(distRoot, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH.slice(1));
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
console.log(`Generated ${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}/index.html`);

await generateEditorialGuide(
  FAMILY_DINNERS_FOR_FOUR,
  FAMILY_DINNERS_FOR_FOUR_PATH,
  renderFamilyDinnersForFourInitialHtml,
  getFamilyDinnersForFourJsonLd,
);

const guideCanonicalUrl = `https://dinnerbydesign.app${UK_FOOD_COSTS_2026_PATH}`;
const guideTitle = `${UK_FOOD_COSTS_2026.title} | DinnerByDesign`;
let guideHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${guideTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${UK_FOOD_COSTS_2026.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${guideCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${guideCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${guideTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${UK_FOOD_COSTS_2026.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${guideTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${UK_FOOD_COSTS_2026.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderUkFoodCosts2026InitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getUkFoodCosts2026JsonLd())}</script>\n</head>`);

if (!guideHtml.includes(`<h1>${UK_FOOD_COSTS_2026.title}</h1>`) || !guideHtml.includes(`href="${guideCanonicalUrl}"`)) {
  throw new Error('Food-cost guide generation failed its content or canonical check.');
}

const guideOutputDir = path.join(distRoot, UK_FOOD_COSTS_2026_PATH.slice(1));
await fs.mkdir(guideOutputDir, { recursive: true });
await fs.writeFile(path.join(guideOutputDir, 'index.html'), guideHtml, 'utf8');
console.log(`Generated ${UK_FOOD_COSTS_2026_PATH}/index.html`);

const cookingForOneCanonicalUrl = `https://dinnerbydesign.app${COOKING_FOR_ONE_PATH}`;
let cookingForOneHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${COOKING_FOR_ONE_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${COOKING_FOR_ONE_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${cookingForOneCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${cookingForOneCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${COOKING_FOR_ONE_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${COOKING_FOR_ONE_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${COOKING_FOR_ONE_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${COOKING_FOR_ONE_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderCookingForOneInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getCookingForOneJsonLd())}</script>\n</head>`);

if (!cookingForOneHtml.includes(`<h1>${COOKING_FOR_ONE_GUIDE.title}</h1>`) || !cookingForOneHtml.includes(`href="${cookingForOneCanonicalUrl}"`)) {
  throw new Error('Cooking-for-one guide generation failed its content or canonical check.');
}

const cookingForOneOutputDir = path.join(distRoot, COOKING_FOR_ONE_PATH.slice(1));
await fs.mkdir(cookingForOneOutputDir, { recursive: true });
await fs.writeFile(path.join(cookingForOneOutputDir, 'index.html'), cookingForOneHtml, 'utf8');
console.log(`Generated ${COOKING_FOR_ONE_PATH}/index.html`);

const offalCanonicalUrl = `https://dinnerbydesign.app${OFFAL_BUDGET_GUIDE_PATH}`;
let offalHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${OFFAL_BUDGET_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${OFFAL_BUDGET_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${offalCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${offalCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${OFFAL_BUDGET_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${OFFAL_BUDGET_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${OFFAL_BUDGET_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${OFFAL_BUDGET_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderOffalBudgetGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getOffalBudgetGuideJsonLd())}</script>\n</head>`);

if (!offalHtml.includes(`<h1>${OFFAL_BUDGET_GUIDE.title}</h1>`) || !offalHtml.includes(`href="${offalCanonicalUrl}"`)) throw new Error('Offal guide generation failed its content or canonical check.');
const offalOutputDir = path.join(distRoot, OFFAL_BUDGET_GUIDE_PATH.slice(1));
await fs.mkdir(offalOutputDir, { recursive: true });
await fs.writeFile(path.join(offalOutputDir, 'index.html'), offalHtml, 'utf8');
console.log(`Generated ${OFFAL_BUDGET_GUIDE_PATH}/index.html`);

const portionCanonicalUrl = `https://dinnerbydesign.app${PORTION_PLANNING_GUIDE_PATH}`;
let portionHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${PORTION_PLANNING_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${PORTION_PLANNING_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${portionCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${portionCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${PORTION_PLANNING_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${PORTION_PLANNING_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${PORTION_PLANNING_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${PORTION_PLANNING_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderPortionPlanningGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getPortionPlanningGuideJsonLd())}</script>\n</head>`);
if (!portionHtml.includes(`<h1>${PORTION_PLANNING_GUIDE.title}</h1>`) || !portionHtml.includes(`href="${portionCanonicalUrl}"`)) throw new Error('Portion-planning guide generation failed its content or canonical check.');
const portionOutputDir = path.join(distRoot, PORTION_PLANNING_GUIDE_PATH.slice(1));
await fs.mkdir(portionOutputDir, { recursive: true });
await fs.writeFile(path.join(portionOutputDir, 'index.html'), portionHtml, 'utf8');
console.log(`Generated ${PORTION_PLANNING_GUIDE_PATH}/index.html`);

const mediterraneanCanonicalUrl = `https://dinnerbydesign.app${MEDITERRANEAN_AFFORDABLE_COOKING_PATH}`;
let mediterraneanHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${mediterraneanCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${mediterraneanCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderMediterraneanAffordableCookingInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getMediterraneanAffordableCookingJsonLd())}</script>\n</head>`);
if (!mediterraneanHtml.includes(`<h1>${MEDITERRANEAN_AFFORDABLE_COOKING_GUIDE.title}</h1>`) || !mediterraneanHtml.includes(`href="${mediterraneanCanonicalUrl}"`)) throw new Error('Mediterranean-inspired guide generation failed its content or canonical check.');
const mediterraneanOutputDir = path.join(distRoot, MEDITERRANEAN_AFFORDABLE_COOKING_PATH.slice(1));
await fs.mkdir(mediterraneanOutputDir, { recursive: true });
await fs.writeFile(path.join(mediterraneanOutputDir, 'index.html'), mediterraneanHtml, 'utf8');
console.log(`Generated ${MEDITERRANEAN_AFFORDABLE_COOKING_PATH}/index.html`);

const summerStewsCanonicalUrl = `https://dinnerbydesign.app${SUMMER_STEWS_GUIDE_PATH}`;
let summerStewsHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${SUMMER_STEWS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${SUMMER_STEWS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${summerStewsCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${summerStewsCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${SUMMER_STEWS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${SUMMER_STEWS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${SUMMER_STEWS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${SUMMER_STEWS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderSummerStewsGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getSummerStewsGuideJsonLd())}</script>\n</head>`);
if (!summerStewsHtml.includes(`<h1>${SUMMER_STEWS_GUIDE.title}</h1>`) || !summerStewsHtml.includes(`href="${summerStewsCanonicalUrl}"`)) throw new Error('Summer-stews guide generation failed its content or canonical check.');
const summerStewsOutputDir = path.join(distRoot, SUMMER_STEWS_GUIDE_PATH.slice(1));
await fs.mkdir(summerStewsOutputDir, { recursive: true });
await fs.writeFile(path.join(summerStewsOutputDir, 'index.html'), summerStewsHtml, 'utf8');
console.log(`Generated ${SUMMER_STEWS_GUIDE_PATH}/index.html`);

const freshOrFrozenCanonicalUrl = `https://dinnerbydesign.app${FRESH_OR_FROZEN_GUIDE_PATH}`;
let freshOrFrozenHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${FRESH_OR_FROZEN_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${FRESH_OR_FROZEN_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${freshOrFrozenCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${freshOrFrozenCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${FRESH_OR_FROZEN_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${FRESH_OR_FROZEN_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${FRESH_OR_FROZEN_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${FRESH_OR_FROZEN_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderFreshOrFrozenGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getFreshOrFrozenGuideJsonLd())}</script>\n</head>`);
if (!freshOrFrozenHtml.includes(`<h1>${FRESH_OR_FROZEN_GUIDE.title}</h1>`) || !freshOrFrozenHtml.includes(`href="${freshOrFrozenCanonicalUrl}"`)) throw new Error('Fresh-or-frozen guide generation failed its content or canonical check.');
const freshOrFrozenOutputDir = path.join(distRoot, FRESH_OR_FROZEN_GUIDE_PATH.slice(1));
await fs.mkdir(freshOrFrozenOutputDir, { recursive: true });
await fs.writeFile(path.join(freshOrFrozenOutputDir, 'index.html'), freshOrFrozenHtml, 'utf8');
console.log(`Generated ${FRESH_OR_FROZEN_GUIDE_PATH}/index.html`);

const batchCookingCanonicalUrl = `https://dinnerbydesign.app${BATCH_COOKING_GUIDE_PATH}`;
let batchCookingHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${BATCH_COOKING_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${BATCH_COOKING_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${batchCookingCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${batchCookingCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${BATCH_COOKING_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${BATCH_COOKING_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${BATCH_COOKING_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${BATCH_COOKING_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderBatchCookingGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getBatchCookingGuideJsonLd())}</script>\n</head>`);
if (!batchCookingHtml.includes(`<h1>${BATCH_COOKING_GUIDE.title.replace("'", '&#039;')}</h1>`) || !batchCookingHtml.includes(`href="${batchCookingCanonicalUrl}"`)) throw new Error('Batch-cooking guide generation failed its content or canonical check.');
const batchCookingOutputDir = path.join(distRoot, BATCH_COOKING_GUIDE_PATH.slice(1));
await fs.mkdir(batchCookingOutputDir, { recursive: true });
await fs.writeFile(path.join(batchCookingOutputDir, 'index.html'), batchCookingHtml, 'utf8');
console.log(`Generated ${BATCH_COOKING_GUIDE_PATH}/index.html`);

const groceryCostOptionsCanonicalUrl = `https://dinnerbydesign.app${GROCERY_COST_OPTIONS_GUIDE_PATH}`;
let groceryCostOptionsHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${GROCERY_COST_OPTIONS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${GROCERY_COST_OPTIONS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${groceryCostOptionsCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${groceryCostOptionsCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${GROCERY_COST_OPTIONS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${GROCERY_COST_OPTIONS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${GROCERY_COST_OPTIONS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${GROCERY_COST_OPTIONS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderGroceryCostOptionsGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getGroceryCostOptionsGuideJsonLd())}</script>\n</head>`);
if (!groceryCostOptionsHtml.includes(`<h1>${GROCERY_COST_OPTIONS_GUIDE.title}</h1>`) || !groceryCostOptionsHtml.includes(`href="${groceryCostOptionsCanonicalUrl}"`)) throw new Error('Grocery-cost options guide generation failed its content or canonical check.');
const groceryCostOptionsOutputDir = path.join(distRoot, GROCERY_COST_OPTIONS_GUIDE_PATH.slice(1));
await fs.mkdir(groceryCostOptionsOutputDir, { recursive: true });
await fs.writeFile(path.join(groceryCostOptionsOutputDir, 'index.html'), groceryCostOptionsHtml, 'utf8');
console.log(`Generated ${GROCERY_COST_OPTIONS_GUIDE_PATH}/index.html`);

const groceryCostPredictionCanonicalUrl = `https://dinnerbydesign.app${GROCERY_COST_PREDICTION_GUIDE_PATH}`;
let groceryCostPredictionHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${GROCERY_COST_PREDICTION_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${GROCERY_COST_PREDICTION_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${groceryCostPredictionCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${groceryCostPredictionCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${GROCERY_COST_PREDICTION_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${GROCERY_COST_PREDICTION_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${GROCERY_COST_PREDICTION_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${GROCERY_COST_PREDICTION_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderGroceryCostPredictionGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getGroceryCostPredictionGuideJsonLd())}</script>\n</head>`);
if (!groceryCostPredictionHtml.includes(`<h1>${GROCERY_COST_PREDICTION_GUIDE.title}</h1>`) || !groceryCostPredictionHtml.includes(`href="${groceryCostPredictionCanonicalUrl}"`)) throw new Error('Grocery-cost prediction guide generation failed its content or canonical check.');
const groceryCostPredictionOutputDir = path.join(distRoot, GROCERY_COST_PREDICTION_GUIDE_PATH.slice(1));
await fs.mkdir(groceryCostPredictionOutputDir, { recursive: true });
await fs.writeFile(path.join(groceryCostPredictionOutputDir, 'index.html'), groceryCostPredictionHtml, 'utf8');
console.log(`Generated ${GROCERY_COST_PREDICTION_GUIDE_PATH}/index.html`);

const cheaperMeatCutsCanonicalUrl = `https://dinnerbydesign.app${CHEAPER_MEAT_CUTS_GUIDE_PATH}`;
let cheaperMeatCutsHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${CHEAPER_MEAT_CUTS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${CHEAPER_MEAT_CUTS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${cheaperMeatCutsCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${cheaperMeatCutsCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${CHEAPER_MEAT_CUTS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${CHEAPER_MEAT_CUTS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${CHEAPER_MEAT_CUTS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${CHEAPER_MEAT_CUTS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderCheaperMeatCutsGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getCheaperMeatCutsGuideJsonLd())}</script>\n</head>`);
if (!cheaperMeatCutsHtml.includes(`<h1>${CHEAPER_MEAT_CUTS_GUIDE.title}</h1>`) || !cheaperMeatCutsHtml.includes(`href="${cheaperMeatCutsCanonicalUrl}"`)) throw new Error('Cheaper-meat-cuts guide generation failed its content or canonical check.');
const cheaperMeatCutsOutputDir = path.join(distRoot, CHEAPER_MEAT_CUTS_GUIDE_PATH.slice(1));
await fs.mkdir(cheaperMeatCutsOutputDir, { recursive: true });
await fs.writeFile(path.join(cheaperMeatCutsOutputDir, 'index.html'), cheaperMeatCutsHtml, 'utf8');
console.log(`Generated ${CHEAPER_MEAT_CUTS_GUIDE_PATH}/index.html`);

const sharedIngredientsCanonicalUrl = `https://dinnerbydesign.app${SHARED_INGREDIENTS_GUIDE_PATH}`;
let sharedIngredientsHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${SHARED_INGREDIENTS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${SHARED_INGREDIENTS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${sharedIngredientsCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${sharedIngredientsCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${SHARED_INGREDIENTS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${SHARED_INGREDIENTS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${SHARED_INGREDIENTS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${SHARED_INGREDIENTS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderSharedIngredientsGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getSharedIngredientsGuideJsonLd())}</script>\n</head>`);
if (!sharedIngredientsHtml.includes(`<h1>${SHARED_INGREDIENTS_GUIDE.title}</h1>`) || !sharedIngredientsHtml.includes(`href="${sharedIngredientsCanonicalUrl}"`)) throw new Error('Shared-ingredients guide generation failed its content or canonical check.');
const sharedIngredientsOutputDir = path.join(distRoot, SHARED_INGREDIENTS_GUIDE_PATH.slice(1));
await fs.mkdir(sharedIngredientsOutputDir, { recursive: true });
await fs.writeFile(path.join(sharedIngredientsOutputDir, 'index.html'), sharedIngredientsHtml, 'utf8');
console.log(`Generated ${SHARED_INGREDIENTS_GUIDE_PATH}/index.html`);

const fiveADayCanonicalUrl = `https://dinnerbydesign.app${FIVE_A_DAY_GUIDE_PATH}`;
let fiveADayHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${FIVE_A_DAY_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${FIVE_A_DAY_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${fiveADayCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${fiveADayCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${FIVE_A_DAY_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${FIVE_A_DAY_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${FIVE_A_DAY_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${FIVE_A_DAY_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderFiveADayGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getFiveADayGuideJsonLd())}</script>\n</head>`);
if (!fiveADayHtml.includes(`<h1>${FIVE_A_DAY_GUIDE.title}</h1>`) || !fiveADayHtml.includes(`href="${fiveADayCanonicalUrl}"`)) throw new Error('5 A Day guide generation failed its content or canonical check.');
const fiveADayOutputDir = path.join(distRoot, FIVE_A_DAY_GUIDE_PATH.slice(1));
await fs.mkdir(fiveADayOutputDir, { recursive: true });
await fs.writeFile(path.join(fiveADayOutputDir, 'index.html'), fiveADayHtml, 'utf8');
console.log(`Generated ${FIVE_A_DAY_GUIDE_PATH}/index.html`);

const homeCookedReadyMadeCanonicalUrl = `https://dinnerbydesign.app${HOME_COOKED_READY_MADE_GUIDE_PATH}`;
let homeCookedReadyMadeHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${HOME_COOKED_READY_MADE_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${HOME_COOKED_READY_MADE_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${homeCookedReadyMadeCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${homeCookedReadyMadeCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${HOME_COOKED_READY_MADE_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${HOME_COOKED_READY_MADE_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${HOME_COOKED_READY_MADE_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${HOME_COOKED_READY_MADE_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderHomeCookedReadyMadeGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getHomeCookedReadyMadeGuideJsonLd())}</script>\n</head>`);
if (!homeCookedReadyMadeHtml.includes(`<h1>${HOME_COOKED_READY_MADE_GUIDE.title}</h1>`) || !homeCookedReadyMadeHtml.includes(`href="${homeCookedReadyMadeCanonicalUrl}"`)) throw new Error('Home-cooked or ready-made guide generation failed its content or canonical check.');
const homeCookedReadyMadeOutputDir = path.join(distRoot, HOME_COOKED_READY_MADE_GUIDE_PATH.slice(1));
await fs.mkdir(homeCookedReadyMadeOutputDir, { recursive: true });
await fs.writeFile(path.join(homeCookedReadyMadeOutputDir, 'index.html'), homeCookedReadyMadeHtml, 'utf8');
console.log(`Generated ${HOME_COOKED_READY_MADE_GUIDE_PATH}/index.html`);

const lowCostDinnersCanonicalUrl = `https://dinnerbydesign.app${LOW_COST_DINNERS_GUIDE_PATH}`;
let lowCostDinnersHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${LOW_COST_DINNERS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${LOW_COST_DINNERS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${lowCostDinnersCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${lowCostDinnersCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${LOW_COST_DINNERS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${LOW_COST_DINNERS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${LOW_COST_DINNERS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${LOW_COST_DINNERS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderLowCostDinnersGuideInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getLowCostDinnersGuideJsonLd())}</script>\n</head>`);
if (!lowCostDinnersHtml.includes('<h1>Low-cost dinners don&#039;t have to be boring</h1>') || !lowCostDinnersHtml.includes(`href="${lowCostDinnersCanonicalUrl}"`)) throw new Error('Low-cost-dinners guide generation failed its content or canonical check.');
const lowCostDinnersOutputDir = path.join(distRoot, LOW_COST_DINNERS_GUIDE_PATH.slice(1));
await fs.mkdir(lowCostDinnersOutputDir, { recursive: true });
await fs.writeFile(path.join(lowCostDinnersOutputDir, 'index.html'), lowCostDinnersHtml, 'utf8');
console.log(`Generated ${LOW_COST_DINNERS_GUIDE_PATH}/index.html`);

await generateEditorialGuide(
  PULSES_BUDGET_GUIDE,
  PULSES_BUDGET_GUIDE_PATH,
  renderPulsesBudgetGuideInitialHtml,
  getPulsesBudgetGuideJsonLd,
);

await generateEditorialGuide(
  TRAYBAKE_GUIDE,
  TRAYBAKE_GUIDE_PATH,
  renderTraybakeGuideInitialHtml,
  getTraybakeGuideJsonLd,
);

for (const guideRecord of PUBLISHED_PUBLIC_GUIDE_RECORDS) {
  await generateEditorialGuide(
    guideRecord,
    guideRecord.path,
    () => renderPublicGuideInitialHtml(guideRecord),
    () => getPublicGuideJsonLd(guideRecord),
  );
}

await generateEditorialGuide(
  CHICKEN_THIGH_COST_GUIDE,
  CHICKEN_THIGH_COST_GUIDE_PATH,
  renderChickenThighCostGuideInitialHtml,
  getChickenThighCostGuideJsonLd,
);

if (!PUBLIC_LIBRARY_PATH) throw new Error('Public guide library path is not configured.');
const publicGuideLibraryCanonicalUrl = `https://dinnerbydesign.app${PUBLIC_LIBRARY_PATH}`;
let publicGuideLibraryHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${PUBLIC_GUIDE_LIBRARY.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${PUBLIC_GUIDE_LIBRARY.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${publicGuideLibraryCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${publicGuideLibraryCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${PUBLIC_GUIDE_LIBRARY.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${PUBLIC_GUIDE_LIBRARY.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${PUBLIC_GUIDE_LIBRARY.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${PUBLIC_GUIDE_LIBRARY.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, hideInitialSeoContentWhenJavaScriptRuns(renderPublicGuideLibraryInitialHtml()))
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getPublicGuideLibraryJsonLd())}</script>\n</head>`);
if (!publicGuideLibraryHtml.includes(`<h1>${PUBLIC_GUIDE_LIBRARY.title}</h1>`) || !publicGuideLibraryHtml.includes(`href="${publicGuideLibraryCanonicalUrl}"`)) throw new Error('Public guide library generation failed its content or canonical check.');
const publicGuideLibraryOutputDir = path.join(distRoot, PUBLIC_LIBRARY_PATH.slice(1));
await fs.mkdir(publicGuideLibraryOutputDir, { recursive: true });
await fs.writeFile(path.join(publicGuideLibraryOutputDir, 'index.html'), publicGuideLibraryHtml, 'utf8');
console.log(`Generated ${PUBLIC_LIBRARY_PATH}/index.html`);

for (const pathway of PUBLIC_PATHWAYS) {
  await generateEditorialGuide(
    pathway,
    pathway.path,
    () => renderPublicPathwayInitialHtml(pathway),
    () => getPublicPathwayJsonLd(pathway),
  );
}
