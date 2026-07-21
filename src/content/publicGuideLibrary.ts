import { PUBLIC_LIBRARY_PATH, PUBLISHED_ARTICLES } from './publicArticles';

export const PUBLIC_GUIDE_LIBRARY = {
  title: 'Food cost and dinner-planning guides',
  seoTitle: 'Food cost and dinner-planning guides | DinnerByDesign',
  description: 'Practical DinnerByDesign guides to managing grocery costs, planning portions, using ingredients well and cooking varied dinners on a budget.',
};

export function getPublicGuideLibraryJsonLd() {
  const url = `https://dinnerbydesign.app${PUBLIC_LIBRARY_PATH}`;
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
        itemListElement: PUBLISHED_ARTICLES.map((article, index) => ({
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
  const articles = PUBLISHED_ARTICLES.map(article => `<li><p>${escapeHtml(article.category)}</p><h2><a href="${escapeHtml(article.path)}">${escapeHtml(article.title)}</a></h2></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Guides</nav><p>Public guide library</p><h1>${escapeHtml(PUBLIC_GUIDE_LIBRARY.title)}</h1><p>${escapeHtml(PUBLIC_GUIDE_LIBRARY.description)}</p><section><h2>Browse all guides</h2><ul>${articles}</ul></section><section><h2>Plan dinners around your household</h2><p>Use DinnerByDesign to turn practical guidance into a coordinated week and a shopping list built from the dinners you schedule.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
