import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40,
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  getFiveDinnersForTwoJsonLd,
  renderFiveDinnersForTwoInitialHtml,
} from '../src/content/seoMealPlans';
import {
  LOWER_COST_CUTS_GUIDE,
  LOWER_COST_CUTS_PATH,
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getLowerCostCutsJsonLd,
  getUkFoodCosts2026JsonLd,
  renderLowerCostCutsInitialHtml,
  renderUkFoodCosts2026InitialHtml,
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
