import type {
  ProgrammaticDisclosureFooterCopy,
  ProgrammaticDisclosureItem,
  ProgrammaticDisclosureKey,
} from './programmaticDisclosures';
import {
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export type PublicGuideStatus = 'draft' | 'in_review' | 'published' | 'needs_review' | 'retired';
export type PublicGuideIndexingStatus = 'index' | 'noindex';
export type PublicGuideCategory = 'guides' | 'food-costs' | 'dinner-plans' | 'recipes';
export type PublicGuideReviewSensitivity = 'standard' | 'price-sensitive' | 'safety-sensitive';

export interface PublicGuideLink {
  label: string;
  url: string;
}

export interface PublicGuideSource extends PublicGuideLink {}

export interface PublicGuideFaq {
  question: string;
  answer: string;
}

export interface PublicGuideSection {
  title?: string;
  paragraphs?: string[];
  rawHtml?: string;
  disclosureItems?: ProgrammaticDisclosureItem[];
  source?: PublicGuideLink & { details?: string };
  relatedLink?: PublicGuideLink;
}

export interface PublicGuideCta {
  title: string;
  copy: string;
  label: string;
  href: string;
}

export interface PublicGuideRecord {
  id: string;
  slug: string;
  path: string;
  canonicalPath: string;
  status: PublicGuideStatus;
  category: PublicGuideCategory;
  reviewSensitivity: PublicGuideReviewSensitivity;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  label: string;
  publishedAt: string;
  reviewedAt: string;
  nextReviewAt: string;
  editorialOwner: string;
  pageFamily: string;
  primarySearchIntent: string;
  indexingStatus: PublicGuideIndexingStatus;
  contentReviewedAt: string;
  editorialNotes: string;
  internalLinks: string[];
  disclosures: ProgrammaticDisclosureKey[];
  disclosureItems: ProgrammaticDisclosureItem[];
  disclosureFooter: ProgrammaticDisclosureFooterCopy;
  sources: PublicGuideSource[];
  faqs: PublicGuideFaq[];
  sections: PublicGuideSection[];
  cta: PublicGuideCta;
  jsonLdGraphItems?: Array<Record<string, any>>;
  autoRenderDisclosures?: boolean;
  autoRenderFaqs?: boolean;
  autoRenderSources?: boolean;
  sourcesTitle?: string;
}

export const escapeGuideHtml = (value: string) =>
  value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character] || character));

const formatGuideDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export const getPublicGuidePublishedLabel = (guide: Pick<PublicGuideRecord, 'publishedAt' | 'reviewedAt'>) =>
  `Published ${formatGuideDate(guide.publishedAt)} · Last reviewed ${formatGuideDate(guide.reviewedAt)}`;

export function getPublicGuideJsonLd(guide: PublicGuideRecord) {
  const url = `https://dinnerbydesign.app${guide.canonicalPath}`;
  const graph = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: guide.title,
      description: guide.metaDescription,
      datePublished: guide.publishedAt,
      dateModified: guide.reviewedAt,
      author: { '@type': 'Organization', name: guide.editorialOwner },
      publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
      mainEntityOfPage: url,
      citation: guide.sources.map(source => source.url),
    },
    ...(guide.jsonLdGraphItems ?? []),
    ...(guide.faqs.length > 0 ? [{
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: guide.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    }] : []),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
  ];

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function renderPublicGuideInitialHtml(guide: PublicGuideRecord) {
  const sectionsIncludeDisclosures = guide.sections.some(section => section.disclosureItems?.length);
  const shouldRenderDisclosures = guide.autoRenderDisclosures !== false && !sectionsIncludeDisclosures;
  const shouldRenderFaqs = guide.autoRenderFaqs !== false && guide.faqs.length > 0;
  const shouldRenderSources = guide.autoRenderSources !== false;
  const sections = guide.sections.map(section => {
    const disclosures = section.disclosureItems?.length
      ? renderProgrammaticDisclosuresInitialHtml(section.disclosureItems)
      : '';
    if (section.rawHtml) return `${section.rawHtml}${disclosures}`;
    const source = section.source
      ? `<p><strong>Source:</strong> <a href="${escapeGuideHtml(section.source.url)}">${escapeGuideHtml(section.source.label)}</a>${section.source.details ? ` &middot; ${escapeGuideHtml(section.source.details)}` : ''}</p>`
      : '';
    return `<section>${section.title ? `<h2>${escapeGuideHtml(section.title)}</h2>` : ''}${source}${(section.paragraphs ?? []).map(paragraph => `<p>${escapeGuideHtml(paragraph).replace(/\n/g, '<br />')}</p>`).join('')}${section.relatedLink ? `<p>Related guide: <a href="${escapeGuideHtml(section.relatedLink.url)}">${escapeGuideHtml(section.relatedLink.label)}</a></p>` : ''}</section>${disclosures}`;
  }).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeGuideHtml(faq.question)}</h3><p>${escapeGuideHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeGuideHtml(source.url)}">${escapeGuideHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / ${escapeGuideHtml(guide.label)}</nav><p>${escapeGuideHtml(guide.label)}</p><h1>${escapeGuideHtml(guide.title)}</h1><p>${escapeGuideHtml(guide.description)}</p><p>By ${escapeGuideHtml(guide.editorialOwner)} &middot; ${getPublicGuidePublishedLabel(guide)}</p><article>${sections}${shouldRenderDisclosures ? renderProgrammaticDisclosuresInitialHtml(guide.disclosureItems) : ''}${shouldRenderFaqs ? `<section><h2>Frequently asked questions</h2>${faqs}</section>` : ''}${shouldRenderSources ? `<section><h2>${escapeGuideHtml(guide.sourcesTitle ?? 'Sources')}</h2><ul>${sources}</ul></section>` : ''}${renderProgrammaticDisclosureFooterInitialHtml(guide.disclosureFooter)}</article><section><h2>${escapeGuideHtml(guide.cta.title)}</h2><p>${escapeGuideHtml(guide.cta.copy)}</p><p><a href="${escapeGuideHtml(guide.cta.href)}">${escapeGuideHtml(guide.cta.label)}</a></p></section></main></div>`;
}
