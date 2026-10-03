// Checks a candidate publisher before it is added to the approved list.
// The checks are evidence for a human decision. They do not approve anything on their own.

import { ACCESS_BARRIER_PATTERN, isBlockedRecipePublisherUrl } from './groundingUtils';

export interface RobotsDecision {
  allowed: boolean;
  matchedRule: string | null;
}

const robotsPatternToRegExp = (pattern: string): RegExp => {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
};

/** Reads robots.txt rules for one user agent. The longest matching rule wins, and allow wins a tie. */
export function robotsAllows(robotsTxt: string, path: string, agent = '*'): RobotsDecision {
  type Rule = { type: 'allow' | 'disallow'; pattern: string };
  const groups: Array<{ agents: string[]; rules: Rule[] }> = [];
  let current: { agents: string[]; rules: Rule[] } | null = null;

  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    const separator = line.indexOf(':');
    if (!line || separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === 'user-agent') {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if ((field === 'allow' || field === 'disallow') && current) {
      current.rules.push({ type: field, pattern: value });
    }
  }

  const wanted = agent.toLowerCase();
  const group = groups.find(candidate => candidate.agents.includes(wanted))
    || groups.find(candidate => candidate.agents.includes('*'));
  if (!group) return { allowed: true, matchedRule: null };

  let best: Rule | null = null;
  for (const rule of group.rules) {
    if (!rule.pattern) continue; // An empty Disallow allows everything.
    if (!robotsPatternToRegExp(rule.pattern).test(path)) continue;
    if (!best || rule.pattern.length > best.pattern.length || (rule.pattern.length === best.pattern.length && rule.type === 'allow')) {
      best = rule;
    }
  }
  if (!best) return { allowed: true, matchedRule: null };
  return { allowed: best.type === 'allow', matchedRule: `${best.type}: ${best.pattern}` };
}

export interface RecipeJsonLd {
  found: boolean;
  name: string | null;
  hasIngredients: boolean;
  hasInstructions: boolean;
}

const isRecipeType = (value: unknown): boolean =>
  (typeof value === 'string' && value.toLowerCase().endsWith('recipe'))
  || (Array.isArray(value) && value.some(isRecipeType));

const nonEmpty = (value: unknown): boolean =>
  Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim().length > 0 : value != null;

/** Finds a schema.org Recipe in the page's JSON-LD blocks, including inside @graph and arrays. */
export function findRecipeJsonLd(html: string): RecipeJsonLd {
  const result: RecipeJsonLd = { found: false, name: null, hasIngredients: false, hasInstructions: false };
  const blocks = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  const visit = (node: any): void => {
    if (!node || typeof node !== 'object' || result.found) return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (isRecipeType(node['@type'])) {
      result.found = true;
      result.name = typeof node.name === 'string' ? node.name : null;
      result.hasIngredients = nonEmpty(node.recipeIngredient);
      result.hasInstructions = nonEmpty(node.recipeInstructions);
      return;
    }
    Object.values(node).forEach(value => { if (value && typeof value === 'object') visit(value); });
  };

  for (const block of blocks) {
    try { visit(JSON.parse(block[1])); } catch { /* ignore malformed blocks */ }
    if (result.found) break;
  }
  return result;
}

/** Signals that a site is aimed at UK readers. Informational only: the owner's rule decides. */
export function ukSignals(html: string, host: string): string[] {
  const signals: string[] = [];
  if (/\.uk$/i.test(host)) signals.push('UK domain');
  if (/<html[^>]*\blang=["']en-gb["']/i.test(html)) signals.push('html lang en-GB');
  if (/property=["']og:locale["'][^>]*content=["']en_GB["']/i.test(html) || /content=["']en_GB["'][^>]*property=["']og:locale["']/i.test(html)) signals.push('og:locale en_GB');
  if (html.includes('£')) signals.push('prices in pounds');
  return signals;
}

const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, '');

export interface CandidatePageResult {
  url: string;
  status: number;
  sameHost: boolean;
  recipe: RecipeJsonLd;
  paywall: boolean;
  ukSignals: string[];
  problems: string[];
  ok: boolean;
}

export function inspectCandidatePage(
  page: { url: string; status: number; finalUrl: string; html: string },
  host: string
): CandidatePageResult {
  const problems: string[] = [];
  let finalHost = '';
  try { finalHost = stripWww(new URL(page.finalUrl).hostname); } catch { /* handled below */ }
  const sameHost = finalHost === stripWww(host);
  const recipe = findRecipeJsonLd(page.html);
  const paywall = ACCESS_BARRIER_PATTERN.test(page.html);

  if (![200, 206].includes(page.status)) problems.push(`status ${page.status}`);
  if (!sameHost) problems.push(`redirects to ${finalHost || 'an invalid address'}`);
  if (!recipe.found) problems.push('no schema.org Recipe data');
  else {
    if (!recipe.hasIngredients) problems.push('Recipe data has no ingredients');
    if (!recipe.hasInstructions) problems.push('Recipe data has no method');
  }
  if (paywall) problems.push('sign-in or subscription wording on the page');

  return {
    url: page.url, status: page.status, sameHost, recipe, paywall,
    ukSignals: ukSignals(page.html, host), problems, ok: problems.length === 0
  };
}

export type CandidateVerdict = 'pass' | 'review' | 'fail';

export interface CandidateReport {
  host: string;
  verdict: CandidateVerdict;
  reasons: string[];
  robots: { fetched: boolean; decisions: Array<{ url: string; allowed: boolean; matchedRule: string | null }> };
  pages: CandidatePageResult[];
}

type FetchLike = (url: string, init?: RequestInit) => Promise<Pick<Response, 'status' | 'url' | 'text'>>;

const MIN_SAMPLE_PAGES = 3;

export async function checkCandidate(host: string, sampleUrls: string[], request: FetchLike = fetch): Promise<CandidateReport> {
  const reasons: string[] = [];
  const report: CandidateReport = { host, verdict: 'fail', reasons, robots: { fetched: false, decisions: [] }, pages: [] };

  if (isBlockedRecipePublisherUrl(`https://${host}/recipe`)) {
    reasons.push('host is on the blocked list');
    return report;
  }

  let robotsTxt = '';
  try {
    const robots = await request(`https://${host}/robots.txt`, { redirect: 'follow', headers: { Accept: 'text/plain' } });
    if (robots.status === 200) { robotsTxt = await robots.text(); report.robots.fetched = true; }
  } catch { /* no robots.txt reachable: treated as no rules, and noted below */ }
  if (!report.robots.fetched) reasons.push('robots.txt could not be read, so crawl rules are unchecked');

  for (const sample of sampleUrls) {
    let path = '/';
    try { const parsed = new URL(sample); path = parsed.pathname + parsed.search; } catch { /* keep default */ }
    const decision = robotsAllows(robotsTxt, path);
    report.robots.decisions.push({ url: sample, ...decision });
    try {
      const response = await request(sample, { redirect: 'follow', headers: { Accept: 'text/html,application/xhtml+xml' } });
      const html = await response.text();
      report.pages.push(inspectCandidatePage({ url: sample, status: response.status, finalUrl: response.url || sample, html }, host));
    } catch (error: any) {
      report.pages.push({
        url: sample, status: 0, sameHost: false, recipe: { found: false, name: null, hasIngredients: false, hasInstructions: false },
        paywall: false, ukSignals: [], problems: [`request failed: ${error?.message || 'unknown error'}`], ok: false
      });
    }
  }

  const disallowed = report.robots.decisions.filter(decision => !decision.allowed);
  const okPages = report.pages.filter(page => page.ok).length;
  if (disallowed.length) reasons.push(`robots.txt disallows ${disallowed.length} of ${report.robots.decisions.length} sample pages`);
  report.pages.filter(page => !page.ok).forEach(page => reasons.push(`${page.url}: ${page.problems.join('; ')}`));
  if (sampleUrls.length < MIN_SAMPLE_PAGES) reasons.push(`only ${sampleUrls.length} sample pages, at least ${MIN_SAMPLE_PAGES} needed`);

  if (okPages === 0 || disallowed.length === sampleUrls.length) report.verdict = 'fail';
  else if (okPages === report.pages.length && disallowed.length === 0 && report.robots.fetched && sampleUrls.length >= MIN_SAMPLE_PAGES) report.verdict = 'pass';
  else report.verdict = 'review';
  return report;
}
