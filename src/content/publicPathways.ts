import { PUBLISHED_ARTICLES, type PublicArticleLink } from './publicArticles';

export const PUBLIC_DINNER_PLANS_PATH = '/dinner-plans';
export const PUBLIC_RECIPES_PATH = '/recipes';
export const PUBLIC_FOOD_COSTS_PATH = '/food-costs';

const SMALL_NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_WORDS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const numberToWords = (value: number): string => {
  if (value < 20) return SMALL_NUMBER_WORDS[value];
  if (value < 100) return `${TENS_WORDS[Math.floor(value / 10)]}${value % 10 ? `-${SMALL_NUMBER_WORDS[value % 10]}` : ''}`;
  if (value < 1000) return `${SMALL_NUMBER_WORDS[Math.floor(value / 100)]} hundred${value % 100 ? ` and ${numberToWords(value % 100)}` : ''}`;
  if (value < 10000) return `${numberToWords(Math.floor(value / 1000))} thousand${value % 1000 ? ` and ${numberToWords(value % 1000)}` : ''}`;
  return String(value);
};

export const formatPublicArticleTitle = (title: string) => {
  const formattedTitle = title.replace(/£(\d+)|\b\d+\b/g, token => {
    const isPounds = token.startsWith('£');
    const number = Number(isPounds ? token.slice(1) : token);
    const words = numberToWords(number);
    return isPounds ? `${words} pounds` : words;
  });

  return formattedTitle ? `${formattedTitle[0].toUpperCase()}${formattedTitle.slice(1)}` : formattedTitle;
};

export const formatPublicNumber = (value: number) => numberToWords(value);

export type PublicPathwayId = 'dinner-plans' | 'recipes' | 'food-costs';

export interface PublicPathway {
  id: PublicPathwayId;
  path: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  shortDescription: string;
  actionLabel: string;
  articlePaths: string[];
  articles: PublicArticleLink[];
}

const PATHWAY_CONFIG: Array<Omit<PublicPathway, 'articles'>> = [
  {
    id: 'dinner-plans',
    path: PUBLIC_DINNER_PLANS_PATH,
    eyebrow: 'Affordable dinner plans',
    title: 'Affordable dinner plans',
    seoTitle: 'Affordable dinner plans for UK households | DinnerByDesign',
    description: 'Cost-conscious dinner plans with clear servings, shared ingredients and realistic UK shopping estimates.',
    shortDescription: 'Start with a ready-made week, then adapt it around your household, budget and preferences.',
    actionLabel: 'Plan my week',
    articlePaths: [
      '/dinner-plans/5-affordable-family-dinners-for-four',
      '/dinner-plans/5-dinners-for-2-under-40',
    ],
  },
  {
    id: 'recipes',
    path: PUBLIC_RECIPES_PATH,
    eyebrow: 'Recipes and cooking ideas',
    title: 'Recipes and cooking ideas',
    seoTitle: 'Recipes and cooking ideas | DinnerByDesign',
    description: 'Flexible recipe ideas, dependable cooking formats and affordable ways to make everyday dinners more varied.',
    shortDescription: 'Find useful formats and ingredient-led ideas when you know roughly what you want to cook.',
    actionLabel: 'Find a recipe',
    articlePaths: [
      '/guides/tinned-fish-recipes-tuna-salmon-sardines',
      '/guides/fish-finger-fishcake-scampi-dinner-ideas',
      '/guides/dinners-built-around-potatoes-rice-pasta-bread-pulses',
      '/recipes/5-chicken-thigh-recipes-for-four-aldi-cost-estimates',
      '/guides/how-to-build-a-traybake',
      '/guides/9-ways-with-sausages',
      '/guides/9-budget-dinners-with-beef-or-pork-mince',
      '/guides/9-budget-dinners-with-leftover-roast-chicken',
      '/food-costs/summer-stews-seasonal-vegetables',
      '/food-costs/mediterranean-inspired-affordable-cooking',
      '/guides/do-vegetables-in-dishes-count-towards-5-a-day',
    ],
  },
  {
    id: 'food-costs',
    path: PUBLIC_FOOD_COSTS_PATH,
    eyebrow: 'Food-cost and waste guidance',
    title: 'Food-cost and waste guidance',
    seoTitle: 'Food-cost and waste guidance for UK households | DinnerByDesign',
    description: 'Practical guidance for understanding grocery costs, using what you buy and reducing avoidable food waste.',
    shortDescription: 'Make better use of your budget, portions and ingredients without relying on unrealistic price promises.',
    actionLabel: 'Plan my week',
    articlePaths: [
      '/food-costs/ways-to-reduce-grocery-costs',
      '/food-costs/why-grocery-costs-are-hard-to-predict',
      '/food-costs/uk-food-costs-2026',
      '/food-costs/cooking-with-cheaper-cuts-of-meat',
      '/food-costs/cooking-with-offal-on-a-budget',
      '/food-costs/cooking-with-pulses-on-a-budget',
      '/food-costs/cooking-for-one-without-waste',
      '/food-costs/five-dinners-same-ingredients',
      '/food-costs/batch-cooking-on-a-budget',
      '/food-costs/portion-planning-and-food-waste',
      '/food-costs/fresh-or-frozen',
      '/food-costs/make-low-cost-dinners-more-interesting',
      '/guides/home-cooked-or-ready-made-dinners',
    ],
  },
];

export const PUBLIC_PATHWAYS: PublicPathway[] = PATHWAY_CONFIG.map(pathway => ({
  ...pathway,
  articles: pathway.articlePaths.flatMap(articlePath => {
    const article = PUBLISHED_ARTICLES.find(item => item.path === articlePath);
    return article ? [article] : [];
  }),
}));

export const getPublicPathway = (pathName: string) =>
  PUBLIC_PATHWAYS.find(pathway => pathway.path === pathName);

export const getPublicPathwayForArticle = (articlePath: string) =>
  PUBLIC_PATHWAYS.find(pathway => pathway.articlePaths.includes(articlePath));

export function getPublicPathwayJsonLd(pathway: PublicPathway) {
  const url = `https://dinnerbydesign.app${pathway.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: pathway.title,
        description: pathway.description,
        url,
        publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
      },
      {
        '@type': 'ItemList',
        itemListElement: pathway.articles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: formatPublicArticleTitle(article.title),
          url: `https://dinnerbydesign.app${article.path}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: pathway.title, item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderPublicPathwayInitialHtml(pathway: PublicPathway) {
  const articles = pathway.articles.map(article => (
    `<li><p>${escapeHtml(article.category)}</p><h2><a href="${escapeHtml(article.path)}">${escapeHtml(formatPublicArticleTitle(article.title))}</a></h2></li>`
  )).join('');
  const otherPathways = PUBLIC_PATHWAYS.filter(item => item.id !== pathway.id).map(item => (
    `<li><a href="${escapeHtml(item.path)}">${escapeHtml(item.title)}</a></li>`
  )).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a><nav aria-label="Public pathways"><a href="${PUBLIC_DINNER_PLANS_PATH}">Affordable dinner plans</a> <a href="${PUBLIC_RECIPES_PATH}">Recipes and cooking ideas</a> <a href="${PUBLIC_FOOD_COSTS_PATH}">Food-cost and waste guidance</a></nav></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / ${escapeHtml(pathway.title)}</nav><p>${escapeHtml(pathway.eyebrow)}</p><h1>${escapeHtml(pathway.title)}</h1><p>${escapeHtml(pathway.description)}</p><ul>${articles}</ul><section><h2>Explore another pathway</h2><ul>${otherPathways}</ul></section><section><h2>Make it personal</h2><p>Use DinnerByDesign to adapt ideas around your household, budget and preferences.</p><p><a href="/signin">${escapeHtml(pathway.actionLabel)}</a></p></section></main></div>`;
}
