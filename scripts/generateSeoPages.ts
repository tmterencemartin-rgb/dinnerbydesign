import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40,
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  getFiveDinnersForTwoJsonLd,
  renderFiveDinnersForTwoInitialHtml,
} from '../src/content/seoMealPlans';
import {
  BATCH_COOKING_GUIDE,
  BATCH_COOKING_GUIDE_PATH,
  COOKING_FOR_ONE_GUIDE,
  COOKING_FOR_ONE_PATH,
  FRESH_OR_FROZEN_GUIDE,
  FRESH_OR_FROZEN_GUIDE_PATH,
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  LOW_COST_COOKING_TECHNIQUES_GUIDE,
  LOW_COST_COOKING_TECHNIQUES_PATH,
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
  getLowerCostCutsJsonLd,
  getLowCostCookingTechniquesJsonLd,
  getMediterraneanAffordableCookingJsonLd,
  getOffalBudgetGuideJsonLd,
  getPortionPlanningGuideJsonLd,
  getSummerStewsGuideJsonLd,
  getUkFoodCosts2026JsonLd,
  renderCookingForOneInitialHtml,
  renderFreshOrFrozenGuideInitialHtml,
  renderLowerCostCutsInitialHtml,
  renderLowCostCookingTechniquesInitialHtml,
  renderMediterraneanAffordableCookingInitialHtml,
  renderOffalBudgetGuideInitialHtml,
  renderPortionPlanningGuideInitialHtml,
  renderSummerStewsGuideInitialHtml,
  renderUkFoodCosts2026InitialHtml,
  renderBatchCookingGuideInitialHtml,
} from '../src/content/seoFoodCostGuides';

const distRoot = path.resolve(process.cwd(), 'dist');
const sourceHtml = await fs.readFile(path.join(distRoot, 'index.html'), 'utf8');
const canonicalUrl = `https://dinnerbydesign.app${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}`;
const title = '5 Affordable Dinners for Two Under £40 | DinnerByDesign';
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderFiveDinnersForTwoInitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getFiveDinnersForTwoJsonLd())}</script>\n</head>`);

if (!html.includes(`<h1>${FIVE_DINNERS_FOR_TWO_UNDER_40.title}</h1>`) || !html.includes(`href="${canonicalUrl}"`)) {
  throw new Error('SEO page generation failed its content or canonical check.');
}

const outputDir = path.join(distRoot, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH.slice(1));
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
console.log(`Generated ${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}/index.html`);

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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderUkFoodCosts2026InitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getUkFoodCosts2026JsonLd())}</script>\n</head>`);

if (!guideHtml.includes(`<h1>${UK_FOOD_COSTS_2026.title}</h1>`) || !guideHtml.includes(`href="${guideCanonicalUrl}"`)) {
  throw new Error('Food-cost guide generation failed its content or canonical check.');
}

const guideOutputDir = path.join(distRoot, UK_FOOD_COSTS_2026_PATH.slice(1));
await fs.mkdir(guideOutputDir, { recursive: true });
await fs.writeFile(path.join(guideOutputDir, 'index.html'), guideHtml, 'utf8');
console.log(`Generated ${UK_FOOD_COSTS_2026_PATH}/index.html`);

const cutsCanonicalUrl = `https://dinnerbydesign.app${LOWER_COST_CUTS_PATH}`;
let cutsHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${LOWER_COST_CUTS_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${LOWER_COST_CUTS_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${cutsCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${cutsCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${LOWER_COST_CUTS_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${LOWER_COST_CUTS_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${LOWER_COST_CUTS_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${LOWER_COST_CUTS_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderLowerCostCutsInitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getLowerCostCutsJsonLd())}</script>\n</head>`);

if (!cutsHtml.includes(`<h1>${LOWER_COST_CUTS_GUIDE.title}</h1>`) || !cutsHtml.includes(`href="${cutsCanonicalUrl}"`)) {
  throw new Error('Lower-cost-cuts guide generation failed its content or canonical check.');
}

const cutsOutputDir = path.join(distRoot, LOWER_COST_CUTS_PATH.slice(1));
await fs.mkdir(cutsOutputDir, { recursive: true });
await fs.writeFile(path.join(cutsOutputDir, 'index.html'), cutsHtml, 'utf8');
console.log(`Generated ${LOWER_COST_CUTS_PATH}/index.html`);

const techniquesCanonicalUrl = `https://dinnerbydesign.app${LOW_COST_COOKING_TECHNIQUES_PATH}`;
let techniquesHtml = sourceHtml
  .replace(/<title>.*?<\/title>/, `<title>${LOW_COST_COOKING_TECHNIQUES_GUIDE.seoTitle}</title>`)
  .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${LOW_COST_COOKING_TECHNIQUES_GUIDE.description}" />`)
  .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
  .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${techniquesCanonicalUrl}" />`)
  .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${techniquesCanonicalUrl}" />`)
  .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${LOW_COST_COOKING_TECHNIQUES_GUIDE.seoTitle}" />`)
  .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${LOW_COST_COOKING_TECHNIQUES_GUIDE.description}" />`)
  .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${LOW_COST_COOKING_TECHNIQUES_GUIDE.seoTitle}" />`)
  .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${LOW_COST_COOKING_TECHNIQUES_GUIDE.description}" />`)
  .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderLowCostCookingTechniquesInitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getLowCostCookingTechniquesJsonLd())}</script>\n</head>`);

if (!techniquesHtml.includes(`<h1>${LOW_COST_COOKING_TECHNIQUES_GUIDE.title}</h1>`) || !techniquesHtml.includes(`href="${techniquesCanonicalUrl}"`)) {
  throw new Error('Low-cost-cooking-techniques guide generation failed its content or canonical check.');
}

const techniquesOutputDir = path.join(distRoot, LOW_COST_COOKING_TECHNIQUES_PATH.slice(1));
await fs.mkdir(techniquesOutputDir, { recursive: true });
await fs.writeFile(path.join(techniquesOutputDir, 'index.html'), techniquesHtml, 'utf8');
console.log(`Generated ${LOW_COST_COOKING_TECHNIQUES_PATH}/index.html`);

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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderCookingForOneInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderOffalBudgetGuideInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderPortionPlanningGuideInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderMediterraneanAffordableCookingInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderSummerStewsGuideInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderFreshOrFrozenGuideInitialHtml())
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
  .replace(/<div id="root">[\s\S]*?<\/div>/, renderBatchCookingGuideInitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getBatchCookingGuideJsonLd())}</script>\n</head>`);
if (!batchCookingHtml.includes(`<h1>${BATCH_COOKING_GUIDE.title.replace("'", '&#039;')}</h1>`) || !batchCookingHtml.includes(`href="${batchCookingCanonicalUrl}"`)) throw new Error('Batch-cooking guide generation failed its content or canonical check.');
const batchCookingOutputDir = path.join(distRoot, BATCH_COOKING_GUIDE_PATH.slice(1));
await fs.mkdir(batchCookingOutputDir, { recursive: true });
await fs.writeFile(path.join(batchCookingOutputDir, 'index.html'), batchCookingHtml, 'utf8');
console.log(`Generated ${BATCH_COOKING_GUIDE_PATH}/index.html`);
