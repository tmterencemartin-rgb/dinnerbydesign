import { PUBLIC_LIBRARY_PATH } from './publicArticles';
import { PUBLIC_PATHWAYS } from './publicPathways';

export const PUBLIC_GUIDE_LIBRARY = {
  title: 'Explore DinnerByDesign',
  seoTitle: 'Dinner plans, recipes and food-cost guidance | DinnerByDesign',
  description: 'Choose a clear starting point: affordable dinner plans, recipes and cooking ideas, or practical food-cost and waste guidance.',
};

export const PUBLIC_GUIDE_PATHWAYS = PUBLIC_PATHWAYS;

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
        itemListElement: PUBLIC_GUIDE_PATHWAYS.map((pathway, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: pathway.title,
          url: `https://dinnerbydesign.app${pathway.path}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Explore', item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderPublicGuideLibraryInitialHtml() {
  const pathways = PUBLIC_GUIDE_PATHWAYS.map(pathway => (
    `<article><p>${escapeHtml(pathway.eyebrow)}</p><h2><a href="${escapeHtml(pathway.path)}">${escapeHtml(pathway.title)}</a></h2><p>${escapeHtml(pathway.shortDescription)}</p><p>${pathway.articles.length} ${pathway.articles.length === 1 ? 'guide' : 'guides'}</p></article>`
  )).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / Explore</nav><p>Public resources</p><h1>${escapeHtml(PUBLIC_GUIDE_LIBRARY.title)}</h1><p>${escapeHtml(PUBLIC_GUIDE_LIBRARY.description)}</p><section><h2>Choose where to start</h2>${pathways}</section><section><h2>Plan dinners around your household</h2><p>Use DinnerByDesign to turn practical ideas into a coordinated week and a shopping list built from the dinners you schedule.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
