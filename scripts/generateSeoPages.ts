import fs from 'node:fs/promises';
import path from 'node:path';
import {
  PUBLIC_GUIDE_LIBRARY,
  getPublicGuideLibraryJsonLd,
  renderPublicGuideLibraryInitialHtml,
} from '../src/content/publicGuideLibrary';
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

const SIMPLE_SEO_PAGES = [
  {
    path: '/why-dinnerbydesign',
    title: 'Why DinnerByDesign? Search, plan and shop in one workflow',
    description: 'See how DinnerByDesign extends recipe search with saved preferences, estimated costs, weekly planning and a consolidated shopping list.',
    heading: 'Recipe search is only the first step.',
  },
  {
    path: '/privacy',
    title: 'Privacy, Cookies & AI Data — DinnerByDesign',
    description: 'Read how DinnerByDesign handles account data, AI processing, service providers, retention, cookies and UK data-protection rights.',
    heading: 'Privacy, cookies and AI data',
  },
  {
    path: '/terms',
    title: 'Terms of Service — DinnerByDesign',
    description: 'Review DinnerByDesign service terms, free-trial rules, subscription prices, renewals, cancellation, refunds and account access.',
    heading: 'Terms of Service',
  },
  {
    path: '/pricing-methodology',
    title: 'Ingredient Pricing Methodology — DinnerByDesign',
    description: 'Learn how DinnerByDesign calculates estimated ingredient costs, full-pack checkout costs, catalogue coverage and price fallbacks.',
    heading: 'Ingredient Pricing Methodology',
  },
  {
    path: '/recipe-methodology',
    title: 'Recipe & Recommendation Methodology — DinnerByDesign',
    description: 'Learn how DinnerByDesign creates, attributes, checks and selects recipe and ready-made dinner information.',
    heading: 'Recipe & Recommendation Methodology',
  },
  {
    path: '/nutrition-methodology',
    title: 'Nutrition Estimate Methodology — DinnerByDesign',
    description: 'Learn how DinnerByDesign nutrition and calorie estimates are produced and why actual values may vary.',
    heading: 'Nutrition Estimate Methodology',
  },
  {
    path: '/food-safety',
    title: 'Dietary, Allergy & Cooking Safety — DinnerByDesign',
    description: 'Understand how DinnerByDesign applies dietary rules and allergy filters, and why labels and safe cooking guidance must still be checked.',
    heading: 'Dietary, Allergy & Cooking Safety',
  },
] as const;

for (const page of SIMPLE_SEO_PAGES) {
  const canonical = `https://dinnerbydesign.app${page.path}`;
  const initialHtml = `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><h1>${escapeGuideHtml(page.heading)}</h1><p>${escapeGuideHtml(page.description)}</p></main></div>`;
  const pageHtml = sourceHtml
    .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/?>/, '<meta name="robots" content="index, follow" />')
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${page.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${page.description}" />`)
    .replace(/<script type="application\/ld\+json" data-seo-jsonld="static-home">.*?<\/script>/s, '')
    .replace(/<div id="root">[\s\S]*?<\/div>/, initialHtml);

  const outputDir = path.join(distRoot, page.path.slice(1));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), pageHtml, 'utf8');
  console.log(`Generated ${page.path}/index.html`);
}

for (const guideRecord of PUBLISHED_PUBLIC_GUIDE_RECORDS) {
  await generateEditorialGuide(
    guideRecord,
    guideRecord.path,
    () => renderPublicGuideInitialHtml(guideRecord),
    () => getPublicGuideJsonLd(guideRecord),
  );
}

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
