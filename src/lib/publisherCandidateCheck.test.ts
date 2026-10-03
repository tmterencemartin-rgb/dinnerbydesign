import { describe, expect, it } from 'vitest';
import { checkCandidate, contentSignals, findRecipeJsonLd, inspectCandidatePage, robotsAllows, ukSignals } from './publisherCandidateCheck';

const recipeLd = (extra: Record<string, unknown> = {}) => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Recipe', name: 'Leek soup',
  recipeIngredient: ['2 leeks', '1 potato'], recipeInstructions: [{ '@type': 'HowToStep', text: 'Cook.' }], ...extra
});
const UK_BODY = 'Sift the plain flour and caster sugar, then add the double cream and a courgette. Cook on the hob, or bake at gas mark 6.';
const US_BODY = 'Whisk 2 cups all-purpose flour with powdered sugar and heavy cream. Add zucchini and cilantro. Bake at 350°F.';
const page = (ld: string, body = '', lang = 'en-GB') =>
  `<html lang="${lang}"><head><script type="application/ld+json">${ld}</script></head><body>${body}</body></html>`;

describe('robotsAllows', () => {
  it('allows everything when there are no rules', () => {
    expect(robotsAllows('', '/recipes/a')).toEqual({ allowed: true, matchedRule: null });
  });
  it('blocks a path under a wildcard Disallow', () => {
    expect(robotsAllows('User-agent: *\nDisallow: /recipes/', '/recipes/leek-soup').allowed).toBe(false);
  });
  it('treats an empty Disallow as allow all', () => {
    expect(robotsAllows('User-agent: *\nDisallow:', '/recipes/a').allowed).toBe(true);
  });
  it('lets the longest matching rule win, and Allow win a tie', () => {
    const robots = 'User-agent: *\nDisallow: /recipes/\nAllow: /recipes/public/';
    expect(robotsAllows(robots, '/recipes/public/soup').allowed).toBe(true);
    expect(robotsAllows(robots, '/recipes/private/soup').allowed).toBe(false);
    expect(robotsAllows('User-agent: *\nDisallow: /a\nAllow: /a', '/a').allowed).toBe(true);
  });
  it('supports * and $ in patterns', () => {
    const robots = 'User-agent: *\nDisallow: /*?print=\nDisallow: /*.pdf$';
    expect(robotsAllows(robots, '/recipes/a?print=1').allowed).toBe(false);
    expect(robotsAllows(robots, '/files/a.pdf').allowed).toBe(false);
    expect(robotsAllows(robots, '/files/a.pdf.html').allowed).toBe(true);
  });
  it('prefers a group for the named agent over the wildcard group', () => {
    const robots = 'User-agent: *\nDisallow: /\n\nUser-agent: dinnerbydesignbot\nAllow: /';
    expect(robotsAllows(robots, '/recipes/a', 'DinnerByDesignBot').allowed).toBe(true);
    expect(robotsAllows(robots, '/recipes/a').allowed).toBe(false);
  });
  it('ignores comments and unrelated fields', () => {
    expect(robotsAllows('# note\nUser-agent: * # all\nCrawl-delay: 10\nDisallow: /x # private', '/x/y').allowed).toBe(false);
  });
});

describe('findRecipeJsonLd', () => {
  it('finds a plain Recipe', () => {
    expect(findRecipeJsonLd(page(recipeLd()))).toEqual({ found: true, name: 'Leek soup', hasIngredients: true, hasInstructions: true });
  });
  it('finds a Recipe inside @graph', () => {
    const graph = JSON.stringify({ '@graph': [{ '@type': 'WebSite' }, JSON.parse(recipeLd())] });
    expect(findRecipeJsonLd(page(graph)).found).toBe(true);
  });
  it('finds a Recipe with an array type', () => {
    expect(findRecipeJsonLd(page(recipeLd({ '@type': ['Recipe', 'Article'] }))).found).toBe(true);
  });
  it('reports a Recipe with no ingredients or method', () => {
    const result = findRecipeJsonLd(page(JSON.stringify({ '@type': 'Recipe', name: 'Empty' })));
    expect(result).toMatchObject({ found: true, hasIngredients: false, hasInstructions: false });
  });
  it('ignores malformed blocks and pages without Recipe data', () => {
    expect(findRecipeJsonLd(page('{not json')).found).toBe(false);
    expect(findRecipeJsonLd(page(JSON.stringify({ '@type': 'Article' }))).found).toBe(false);
  });
});

describe('ukSignals', () => {
  it('reports the signals present', () => {
    expect(ukSignals(page(recipeLd(), 'Costs £2'), 'example.co.uk')).toEqual(['UK domain', 'html lang en-GB', 'prices in pounds']);
  });
  it('reports none for a US page', () => {
    expect(ukSignals(page(recipeLd(), '$2', 'en-US'), 'example.com')).toEqual([]);
  });
});

describe('inspectCandidatePage', () => {
  const ok = (html: string, extra: Partial<{ status: number; finalUrl: string }> = {}) =>
    inspectCandidatePage({ url: 'https://www.example.co.uk/recipes/a', status: 200, finalUrl: 'https://www.example.co.uk/recipes/a', html, ...extra }, 'example.co.uk');

  it('passes a complete page', () => expect(ok(page(recipeLd())).ok).toBe(true));
  it('fails a page with subscription wording', () => {
    const result = ok(page(recipeLd(), 'Subscribe to continue reading'));
    expect(result.ok).toBe(false);
    expect(result.problems.join()).toMatch(/sign-in or subscription/);
  });
  it('fails a redirect to another host', () => {
    expect(ok(page(recipeLd()), { finalUrl: 'https://other.example.com/x' }).problems.join()).toMatch(/redirects to other\.example\.com/);
  });
  it('fails a missing page and a page without Recipe data', () => {
    expect(ok(page(recipeLd()), { status: 404 }).ok).toBe(false);
    expect(ok('<html></html>').problems).toContain('no recognisable recipe content');
  });
  it('accepts a complete visible recipe without schema.org data', () => {
    const html = '<html><body><h1>Bubble and squeak</h1><p>A traditional recipe with a short preparation and cooking method for a family kitchen.</p><h2>Ingredients</h2><p>500g potatoes, sprouts, chestnuts and oil. Add salt and pepper to taste, with seasoned flour for coating.</p><h2>Method</h2><p>Mix everything, shape into patties and cook until crisp and brown. Serve hot with seasoning and a little oil. Keep the patties evenly sized so they cook through at the same time.</p></body></html>';
    const result = ok(html);
    expect(result.ok).toBe(true);
    expect(result.evidence).toBe('visible');
    expect(result.notes.join()).toMatch(/no schema\.org Recipe data/);
  });
});

describe('visible recipe structure without schema.org data', () => {
  const inspect = (html: string) => inspectCandidatePage({ url: 'https://www.example.co.uk/x', status: 200, finalUrl: 'https://www.example.co.uk/x', html }, 'example.co.uk');
  const filler = ' Our team has spent a long time thinking about how we cook and what we serve across our restaurants and bars, and we want to share a few thoughts with guests who visit throughout the year in every season.'.repeat(2);

  it('rejects an article that only mentions ingredients and method in its text', () => {
    const result = inspect(`<html><body><h1>Our approach</h1><p>Ingredients matter to us and so does method.${filler}</p></body></html>`);
    expect(result.ok).toBe(false);
    expect(result.evidence).toBe('none');
    expect(result.problems).toContain('no recognisable recipe content');
  });

  it('rejects a category page whose navigation lists ingredients and method', () => {
    const result = inspect(`<html><body><nav><a>Ingredients</a> | <a>Method</a> | <a>Collections</a></nav><h1>Soup recipes</h1><ul><li>Leek soup</li><li>Tomato soup</li><li>Pea soup</li></ul><p>Browse by ingredients or by cooking method.${filler}</p></body></html>`);
    expect(result.ok).toBe(false);
    expect(result.evidence).toBe('none');
  });

  it('rejects headings with nothing under them', () => {
    const result = inspect(`<html><body><h1>Soup</h1><h2>Ingredients</h2><h2>Method</h2><p>${filler}</p></body></html>`);
    expect(result.evidence).toBe('none');
  });

  it('rejects a method heading with almost nothing under it', () => {
    const result = inspect(`<html><body><h1>Leek soup</h1><p>${filler}</p><h2>Ingredients</h2><ul><li>2 leeks</li><li>1 potato</li><li>stock</li></ul><h2>Method</h2><p>Cook it.</p></body></html>`);
    expect(result.evidence).toBe('none');
  });

  it('rejects a page with too little text to be a recipe page, even with both headings', () => {
    const result = inspect('<html><body><h2>Ingredients</h2><ul><li>2 leeks</li><li>1 potato</li><li>stock</li></ul><h2>Method</h2><ol><li>Chop.</li><li>Simmer.</li></ol></body></html>');
    expect(result.evidence).toBe('none');
  });

  it('accepts ingredient and method lists under headings', () => {
    const result = inspect(`<html><body><h1>Leek soup</h1><p>${filler}</p><h2>Ingredients</h2><ul><li>2 leeks</li><li>1 potato</li><li>stock</li></ul><h2>Method</h2><ol><li>Chop the leeks.</li><li>Simmer with the potato and stock.</li></ol></body></html>`);
    expect(result.evidence).toBe('visible');
    expect(result.ok).toBe(true);
  });

  it('accepts What you will need and Instructions headings with a curly apostrophe', () => {
    const result = inspect(`<html><body><h1>Leek soup</h1><p>${filler}</p><h3>What you\u2019ll need:</h3><p>2 large leeks and 500ml stock.</p><h3>Instructions</h3><p>Chop the leeks, add the stock and simmer until the leeks are soft, then blend and season to taste.</p></body></html>`);
    expect(result.evidence).toBe('visible');
  });

  it('prefers schema.org data when it is present', () => {
    expect(inspect(page(recipeLd(), UK_BODY)).evidence).toBe('structured');
  });
});

describe('checkCandidate and recipe evidence', () => {
  const host = 'www.example.co.uk';
  const urls = [1, 2, 3].map(n => `https://${host}/recipes/${n}`);
  const visibleRecipe = '<html lang="en-GB"><body><h1>Leek soup</h1><p>A simple soup made with plain flour and a courgette, cooked on the hob. A traditional recipe with a short preparation and a method for a family kitchen at home. It keeps well in the fridge for two days and freezes in portions, so it is a useful dish to make ahead for a busy week when there is little time to cook in the evening.</p><h2>Ingredients</h2><p>500g leeks, 1 courgette and stock, with plain flour to thicken.</p><h2>Method</h2><p>Cook the leeks on the hob, add the stock and the courgette and simmer, then season and serve hot with bread.</p></body></html>';
  const respond = (html: string) => async (url: string) =>
    url.endsWith('/robots.txt') ? { status: 200, url, text: async () => '' } : { status: 200, url, text: async () => html };

  it('gives review, not a pass, when pages have recipe structure but no schema.org data', async () => {
    const report = await checkCandidate(host, urls, respond(visibleRecipe) as any);
    expect(report.pages.every(pageResult => pageResult.ok)).toBe(true);
    expect(report.verdict).toBe('review');
    expect(report.reasons.join()).toMatch(/3 of 3 sample pages have no schema\.org Recipe data/);
  });

  it('still passes when every page has schema.org data', async () => {
    const report = await checkCandidate(host, urls, respond(page(recipeLd(), UK_BODY)) as any);
    expect(report.verdict).toBe('pass');
  });

  it('gives review when only some pages lack schema.org data', async () => {
    let n = 0;
    const request = async (url: string) => url.endsWith('/robots.txt')
      ? { status: 200, url, text: async () => '' }
      : { status: 200, url, text: async () => (++n === 2 ? visibleRecipe : page(recipeLd(), UK_BODY)) };
    const report = await checkCandidate(host, urls, request as any);
    expect(report.verdict).toBe('review');
    expect(report.reasons.join()).toMatch(/1 of 3 sample pages/);
  });
});

describe('checkCandidate', () => {
  const host = 'www.example.co.uk';
  const urls = [1, 2, 3].map(n => `https://${host}/recipes/${n}`);
  const respond = (robots: string, html: string, status = 200) => async (url: string) =>
    url.endsWith('/robots.txt')
      ? { status: 200, url, text: async () => robots }
      : { status, url, text: async () => html };

  it('passes when robots allow, every page has Recipe data and none is gated', async () => {
    const report = await checkCandidate(host, urls, respond('User-agent: *\nDisallow: /admin/', page(recipeLd(), UK_BODY)) as any);
    expect(report.verdict).toBe('pass');
    expect(report.reasons).toEqual([]);
  });
  it('fails a blocked host without any request', async () => {
    let called = false;
    const report = await checkCandidate('www.bbcgoodfood.com', urls, (async () => { called = true; return {} as any; }) as any);
    expect(report.verdict).toBe('fail');
    expect(called).toBe(false);
  });
  it('fails when robots disallow every sample page', async () => {
    const report = await checkCandidate(host, urls, respond('User-agent: *\nDisallow: /', page(recipeLd())) as any);
    expect(report.verdict).toBe('fail');
  });
  it('asks for review when some pages fail', async () => {
    let n = 0;
    const request = async (url: string) => url.endsWith('/robots.txt')
      ? { status: 200, url, text: async () => '' }
      : { status: 200, url, text: async () => (++n === 2 ? '<html></html>' : page(recipeLd())) };
    const report = await checkCandidate(host, urls, request as any);
    expect(report.verdict).toBe('review');
  });
  it('asks for review when robots.txt cannot be read or too few pages are sampled', async () => {
    const noRobots = async (url: string) => url.endsWith('/robots.txt')
      ? { status: 404, url, text: async () => '' }
      : { status: 200, url, text: async () => page(recipeLd()) };
    expect((await checkCandidate(host, urls, noRobots as any)).verdict).toBe('review');
    expect((await checkCandidate(host, urls.slice(0, 2), respond('', page(recipeLd())) as any)).verdict).toBe('review');
  });
  it('records a failed request as a page problem', async () => {
    const request = async (url: string) => { if (url.endsWith('/robots.txt')) return { status: 200, url, text: async () => '' }; throw new Error('timeout'); };
    const report = await checkCandidate(host, urls, request as any);
    expect(report.verdict).toBe('fail');
    expect(report.pages[0].problems[0]).toMatch(/request failed: timeout/);
  });
});

describe('contentSignals', () => {
  it('leans UK for UK usage', () => {
    const result = contentSignals(page(recipeLd(), UK_BODY));
    expect(result.lean).toBe('uk');
    expect(result.uk).toEqual(expect.arrayContaining(['plain flour', 'caster sugar', 'double cream', 'courgette', 'hob', 'gas mark']));
    expect(result.nonUk).toEqual([]);
  });
  it('leans non-UK for US usage, including cups and Fahrenheit', () => {
    const result = contentSignals(page(recipeLd(), US_BODY));
    expect(result.lean).toBe('non-uk');
    expect(result.nonUk).toEqual(expect.arrayContaining(['all-purpose flour', 'powdered sugar', 'heavy cream', 'zucchini', 'cilantro', 'Fahrenheit', 'cups']));
  });
  it('detects Australian usage that the UK does not share', () => {
    expect(contentSignals(page(recipeLd(), 'Add the capsicum and thickened cream.')).nonUk).toEqual(['capsicum', 'thickened cream']);
  });
  it('is mixed when both usages appear in similar amounts', () => {
    expect(contentSignals(page(recipeLd(), 'Use plain flour and a courgette, or zucchini and baking soda.')).lean).toBe('mixed');
  });
  it('is none when there is too little text to judge', () => {
    expect(contentSignals(page(recipeLd(), 'Dinner.')).lean).toBe('none');
    expect(contentSignals('').lean).toBe('none');
  });
  it('is none with a single term, because one term is not enough to judge', () => {
    expect(contentSignals(page(recipeLd(), 'Cook on the hob.'))).toEqual({ uk: ['hob'], nonUk: [], lean: 'none' });
    expect(contentSignals(page(recipeLd(), 'Add the zucchini.'))).toEqual({ uk: [], nonUk: ['zucchini'], lean: 'none' });
  });
  it('reads the Recipe ingredients as well as the visible text', () => {
    const ld = JSON.stringify({ '@type': 'Recipe', name: 'Pie', recipeIngredient: ['200g plain flour', '2 courgettes'], recipeInstructions: ['Bake.'] });
    expect(contentSignals(page(ld)).uk).toEqual(['courgette', 'plain flour']);
  });
  it('ignores terms that appear only in scripts and styles', () => {
    const html = '<html><script>var a = "zucchini cilantro";</script><style>.hob{}</style><body>Dinner.</body></html>';
    expect(contentSignals(html)).toEqual({ uk: [], nonUk: [], lean: 'none' });
  });
  it('does not match inside longer words or count unrelated cups', () => {
    expect(contentSignals(page(recipeLd(), 'The hobby cook has a teacup and a rocket ship.'))).toEqual({ uk: [], nonUk: [], lean: 'none' });
  });
});

describe('checkCandidate and content', () => {
  const host = 'www.example.com';
  const urls = [1, 2, 3].map(n => `https://${host}/recipes/${n}`);
  const respond = (html: string) => async (url: string) =>
    url.endsWith('/robots.txt')
      ? { status: 200, url, text: async () => '' }
      : { status: 200, url, text: async () => html };

  it('asks for review, not a pass, when the content reads as US', async () => {
    const report = await checkCandidate(host, urls, respond(page(recipeLd(), US_BODY, 'en-US')) as any);
    expect(report.verdict).toBe('review');
    expect(report.content.lean).toBe('non-uk');
    expect(report.reasons.join()).toMatch(/content reads as non-uk/);
  });
  it('accepts a .com site whose content reads as UK', async () => {
    const report = await checkCandidate(host, urls, respond(page(recipeLd(), UK_BODY)) as any);
    expect(report.verdict).toBe('pass');
    expect(report.content.lean).toBe('uk');
  });
  it('asks for review when the pages give too little to judge', async () => {
    const report = await checkCandidate(host, urls, respond(page(recipeLd(), 'Dinner.')) as any);
    expect(report.verdict).toBe('review');
    expect(report.reasons.join()).toMatch(/inconclusive/);
  });
  it('combines terms across the sampled pages', async () => {
    let n = 0;
    const request = async (url: string) => url.endsWith('/robots.txt')
      ? { status: 200, url, text: async () => '' }
      : { status: 200, url, text: async () => page(recipeLd(), ++n === 1 ? 'Use plain flour and caster sugar.' : n === 2 ? 'Add the double cream and a courgette.' : 'Cook on the hob.') };
    const report = await checkCandidate(host, urls, request as any);
    expect(report.content.uk).toEqual(expect.arrayContaining(['plain flour', 'caster sugar', 'double cream', 'courgette', 'hob']));
    expect(report.verdict).toBe('pass');
  });
});
