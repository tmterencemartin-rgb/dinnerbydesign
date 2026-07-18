import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40,
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
  getFiveDinnersForTwoJsonLd,
  renderFiveDinnersForTwoInitialHtml,
} from '../src/content/seoMealPlans';

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
  .replace('<div id="root"></div>', renderFiveDinnersForTwoInitialHtml())
  .replace('</head>', `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(getFiveDinnersForTwoJsonLd())}</script>\n</head>`);

if (!html.includes(`<h1>${FIVE_DINNERS_FOR_TWO_UNDER_40.title}</h1>`) || !html.includes(`href="${canonicalUrl}"`)) {
  throw new Error('SEO page generation failed its content or canonical check.');
}

const outputDir = path.join(distRoot, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH.slice(1));
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
console.log(`Generated ${FIVE_DINNERS_FOR_TWO_UNDER_40_PATH}/index.html`);

