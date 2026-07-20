export const PROGRAMMATIC_DISCLOSURE_KEYS = [
  'price_estimate',
  'price_comparison',
  'serving_assumption',
  'source_timing',
  'storage_and_cooking',
  'allergen_and_product',
  'affiliate_or_commercial',
] as const;

export type ProgrammaticDisclosureKey = typeof PROGRAMMATIC_DISCLOSURE_KEYS[number];

export interface ProgrammaticDisclosureItem {
  key: ProgrammaticDisclosureKey;
  title: string;
  body: string;
}

export interface ProgrammaticDisclosureLink {
  href: string;
  label: string;
}

export interface ProgrammaticDisclosureFooterCopy {
  body: string;
  links: ProgrammaticDisclosureLink[];
}

export const FIVE_DINNERS_PRICE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_estimate',
    title: 'About these estimates',
    body: 'Costs cover ten portions and use representative UK reference packs with prices checked 18 July 2026. Retailer prices, pack sizes, promotions, availability and ingredients already at home vary. The expected checkout uses complete packs; the ingredient total uses the estimated quantities consumed. Cooking energy is excluded.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'This plan provides five dinners for two people. Appetite, portion size and any additional sides may change the quantity required.',
  },
];

export const UK_FOOD_COST_CONTEXT_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'source_timing',
    title: 'How to read these figures',
    body: 'National trackers use different baskets, weightings and collection dates, so their figures are not directly interchangeable and cannot predict one household’s shopping total. Figures were checked when this guide was reviewed on 19 July 2026; follow the cited sources for later releases.',
  },
];

export const LOWER_COST_CUTS_COMPARISON_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'How to use this comparison',
    body: 'This guide does not rank cuts or use live retailer prices. Apply the method using the current pack price, usable quantity and number of servings for your household. The round-figure calculation is illustrative rather than a market-price estimate.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Examples use four standard servings. Appetite, age, portion size and accompanying dishes may change the quantity your household requires.',
  },
];

export const LOWER_COST_CUTS_SAFETY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and safety',
    body: 'Always follow the product label, storage instructions and use-by date. Use a clean temperature probe when checking cooking temperatures and follow current Food Standards Agency guidance.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Safety and storage guidance was reviewed on 19 July 2026. Follow the cited Food Standards Agency links for subsequent updates.',
  },
];

export const PROGRAMMATIC_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Prices, availability and product information may change after publication. Costs are estimates based on the assumptions shown on each page.',
  links: [
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const LOWER_COST_CUTS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Pack prices, availability and product information vary. The calculation shown is illustrative and should be applied using current pack information and your household’s usual serving sizes.',
  links: [
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderProgrammaticDisclosuresInitialHtml(items: ProgrammaticDisclosureItem[]) {
  return `<aside aria-label="Important information">${items.map(item => `<section><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.body)}</p></section>`).join('')}</aside>`;
}

export function renderProgrammaticDisclosureFooterInitialHtml(copy = PROGRAMMATIC_DISCLOSURE_FOOTER) {
  const links = copy.links.map(link => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(' · ');
  return `<aside aria-label="About this guide"><h2>About this guide</h2><p>${escapeHtml(copy.body)}</p><p>${links}</p></aside>`;
}
