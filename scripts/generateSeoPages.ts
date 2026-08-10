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
  UK_FOOD_COSTS_2026,
  UK_FOOD_COSTS_2026_PATH,
  getUkFoodCosts2026JsonLd,
  renderUkFoodCosts2026InitialHtml,
} from '../src/content/seoFoodCostGuides';
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
  CHICKEN_THIGH_COST_GUIDE,
  CHICKEN_THIGH_COST_GUIDE_PATH,
  getChickenThighCostGuideJsonLd,
  renderChickenThighCostGuideInitialHtml,
} from '../src/content/chickenThighCostGuide';
import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from '../src/content/publicGuideRegistry';
import { escapeGuideHtml, getPublicGuideJsonLd, renderPublicGuideInitialHtml } from '../src/content/publicGuideModel';
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

  if (!guideHtml.includes(`<h1>${escapeGuideHtml(guide.title)}</h1>`) || !guideHtml.includes(`href="${canonical}"`)) {
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
