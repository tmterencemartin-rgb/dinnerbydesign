import { PUBLIC_LIBRARY_PATH, PUBLISHED_ARTICLES } from './publicArticles';

export const PUBLIC_GUIDE_LIBRARY = {
  title: 'Practical dinner, food cost and nutrition guides',
  seoTitle: 'Dinner, food cost and nutrition guides | DinnerByDesign',
  description: 'Practical DinnerByDesign guides to planning portions, understanding ingredients, managing grocery costs and cooking varied dinners.',
};

const PUBLIC_GUIDE_GROUP_CONFIG = [
  {
    id: 'dinner-planning',
    title: 'Start with a dinner plan',
    description: 'A ready-made weekly structure with costs, servings and a practical route into planning.',
    paths: ['/dinner-plans/5-dinners-for-2-under-40'],
  },
  {
    id: 'spend-less',
    title: 'Spend less on ingredients',
    description: 'Understand grocery costs and find realistic ways to choose lower-cost ingredients.',
    paths: [
      '/food-costs/ways-to-reduce-grocery-costs',
      '/food-costs/why-grocery-costs-are-hard-to-predict',
      '/food-costs/uk-food-costs-2026',
      '/food-costs/cooking-for-four-with-lower-cost-cuts',
      '/food-costs/cooking-with-cheaper-cuts-of-meat',
      '/food-costs/cooking-with-offal-on-a-budget',
      '/food-costs/cooking-for-one-without-waste',
    ],
  },
  {
    id: 'reduce-waste',
    title: 'Use what you buy',
    description: 'Plan portions, reuse ingredients and reduce the chance that part-used packs go to waste.',
    paths: [
      '/food-costs/how-to-use-complete-packs',
      '/food-costs/five-dinners-same-ingredients',
      '/food-costs/batch-cooking-on-a-budget',
      '/food-costs/portion-planning-and-food-waste',
      '/food-costs/fresh-or-frozen',
    ],
  },
  {
    id: 'flavour-and-variety',
    title: 'Make affordable cooking more enjoyable',
    description: 'Add flavour, texture and variety without turning a modest shopping list into a costly one.',
    paths: [
      '/food-costs/cheap-finishing-touches',
      '/food-costs/make-low-cost-dinners-more-interesting',
      '/food-costs/low-cost-cooking-techniques',
      '/food-costs/mediterranean-inspired-affordable-cooking',
      '/food-costs/summer-stews-seasonal-vegetables',
    ],
  },
  {
    id: 'choices-and-nutrition',
    title: 'Compare choices and nutrition',
    description: 'Put common cooking and nutrition questions into a useful everyday context.',
    paths: [
      '/guides/do-vegetables-in-dishes-count-towards-5-a-day',
      '/guides/home-cooked-or-ready-made-dinners',
    ],
  },
] as const;

export const PUBLIC_GUIDE_GROUPS = PUBLIC_GUIDE_GROUP_CONFIG.map(group => ({
  id: group.id,
  title: group.title,
  description: group.description,
  articles: group.paths.flatMap(path => {
    const article = PUBLISHED_ARTICLES.find(item => item.path === path);
    return article ? [article] : [];
  }),
}));

export function getPublicGuideLibraryJsonLd() {
  const url = `https://dinnerbydesign.app${PUBLIC_LIBRARY_PATH}`;
  const groupedArticles = PUBLIC_GUIDE_GROUPS.flatMap(group => group.articles);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: PUBLIC_GUIDE_LIBRARY.title,
        description: PUBLIC_GUIDE_LIBRARY.description,
        url,
        publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
      },
      {
        '@type': 'ItemList',
        itemListElement: groupedArticles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: article.title,
          url: `https://dinnerbydesign.app${article.path}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderPublicGuideLibraryInitialHtml() {
  const groups = PUBLIC_GUIDE_GROUPS.map(group => {
    const articles = group.articles.map(article => `<li><p>${escapeHtml(article.category)}</p><h3><a href="${escapeHtml(article.path)}">${escapeHtml(article.title)}</a></h3></li>`).join('');
    return `<section><h2 id="${escapeHtml(group.id)}">${escapeHtml(group.title)}</h2><p><a href="#guide-library-top">Back to top</a></p><p>${escapeHtml(group.description)}</p><ul>${articles}</ul></section>`;
  }).join('');
  const categoryLinks = PUBLIC_GUIDE_GROUPS.map(group => `<li><a href="#${escapeHtml(group.id)}">${escapeHtml(group.title)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main id="guide-library-top"><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Guides</nav><p>Public guide library</p><h1>${escapeHtml(PUBLIC_GUIDE_LIBRARY.title)}</h1><p>${escapeHtml(PUBLIC_GUIDE_LIBRARY.description)}</p><nav aria-label="Guide categories"><h2>Browse by category</h2><ul>${categoryLinks}</ul></nav>${groups}<section><h2>Plan dinners around your household</h2><p>Use DinnerByDesign to turn practical guidance into a coordinated week and a shopping list built from the dinners you schedule.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
