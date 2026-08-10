import { PUBLIC_GUIDE_LIBRARY } from '../src/content/publicGuideLibrary';
import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from '../src/content/publicGuideRegistry';
import { PUBLIC_LIBRARY_PATH } from '../src/content/publicArticles';
import { PUBLIC_PATHWAYS } from '../src/content/publicPathways';

const PRODUCTION_ORIGIN = 'https://dinnerbydesign.app';
const configuredBaseUrl = process.env.PUBLIC_SMOKE_BASE_URL || PRODUCTION_ORIGIN;
const baseUrl = new URL(configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`);
const productionOrigin = new URL(PRODUCTION_ORIGIN).origin;

interface CheckResult {
  label: string;
  path: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character] || character));

const toUrl = (path: string) => new URL(path, baseUrl).toString();

async function fetchText(path: string) {
  const response = await fetch(toUrl(path), {
    redirect: 'follow',
    headers: { 'user-agent': 'DinnerByDesign public smoke check' },
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  return { response, text };
}

const requireText = (text: string, expected: string, context: string) => {
  if (!text.includes(expected)) {
    throw new Error(`${context} missing ${expected}`);
  }
};

async function checkHtmlPage(path: string, title: string, jsonLdType?: string): Promise<CheckResult> {
  const { text } = await fetchText(path);
  const canonical = `${productionOrigin}${path}`;

  requireText(text, `<h1>${escapeHtml(title)}</h1>`, path);
  requireText(text, `rel="canonical" href="${canonical}"`, path);

  if (jsonLdType) {
    requireText(text, 'type="application/ld+json"', path);
    requireText(text, `"@type":"${jsonLdType}"`, path);
  }

  return { label: title, path };
}

async function checkSimplePath(path: string, expectedText: string): Promise<CheckResult> {
  const { text } = await fetchText(path);
  requireText(text, expectedText, path);
  return { label: path, path };
}

async function checkSitemap(): Promise<CheckResult> {
  const { text } = await fetchText('/sitemap.xml');
  const expectedPaths = [
    '/',
    ...(PUBLIC_LIBRARY_PATH ? [PUBLIC_LIBRARY_PATH] : []),
    ...PUBLIC_PATHWAYS.map(pathway => pathway.path),
    ...PUBLISHED_PUBLIC_GUIDE_RECORDS.map(guide => guide.path),
  ];

  expectedPaths.forEach(path => {
    const href = path === '/' ? `${productionOrigin}/` : `${productionOrigin}${path}`;
    requireText(text, `<loc>${href}</loc>`, '/sitemap.xml');
  });

  return { label: 'sitemap', path: '/sitemap.xml' };
}

async function checkRobots(): Promise<CheckResult> {
  const { text } = await fetchText('/robots.txt');
  requireText(text, `Sitemap: ${productionOrigin}/sitemap.xml`, '/robots.txt');
  return { label: 'robots', path: '/robots.txt' };
}

async function checkHealth(): Promise<CheckResult> {
  const { text } = await fetchText('/api/health');
  try {
    JSON.parse(text);
  } catch {
    throw new Error('/api/health did not return JSON');
  }

  return { label: 'health', path: '/api/health' };
}

const checks: Array<() => Promise<CheckResult>> = [
  () => checkSimplePath('/', 'DinnerByDesign'),
  ...(PUBLIC_LIBRARY_PATH ? [() => checkHtmlPage(PUBLIC_LIBRARY_PATH, PUBLIC_GUIDE_LIBRARY.title, 'CollectionPage')] : []),
  ...PUBLIC_PATHWAYS.map(pathway => () => checkHtmlPage(pathway.path, pathway.title, 'CollectionPage')),
  ...PUBLISHED_PUBLIC_GUIDE_RECORDS.map(guide => () => checkHtmlPage(guide.path, guide.title, 'Article')),
  () => checkSitemap(),
  () => checkRobots(),
  () => checkHealth(),
];

console.log(`Checking ${checks.length} public endpoints at ${baseUrl.origin}`);

const failures: string[] = [];
let passed = 0;

for (const runCheck of checks) {
  try {
    const result = await runCheck();
    passed += 1;
    console.log(`OK ${result.path} ${result.label}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(message);
    console.error(`FAIL ${message}`);
  }
}

if (failures.length > 0) {
  console.error(`Public smoke check failed: ${failures.length} failed, ${passed} passed.`);
  process.exitCode = 1;
} else {
  console.log(`Public smoke check passed: ${passed} checks.`);
}
