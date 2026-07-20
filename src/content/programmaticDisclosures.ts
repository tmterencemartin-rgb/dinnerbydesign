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

export const LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Ingredients and suitability vary by product. Check every label, especially fish sauce, soy sauce, tamari, pasta, bread, stock cubes, sauces and toppings.',
  },
];

export const LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and safety',
    body: 'Use bread and vegetables only while safe to eat. Never use mouldy bread. Follow product storage instructions and current Food Standards Agency guidance.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance was reviewed on 20 July 2026. Follow the cited Food Standards Agency link for later updates.',
  },
];

export const COOKING_FOR_ONE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Pastes, sauces and stock products vary by brand and can contain gluten, dairy, nuts or other allergens. Check every product label before use.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Appetite and portion needs vary from person to person. Adjust quantities to suit you.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and safety',
    body: 'Freeze suitable food before its use-by date and follow the label. Cool cooked food before freezing. Defrost in the fridge and use within 24 hours once fully defrosted.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance was reviewed on 20 July 2026. Follow the linked Food Standards Agency guidance for later updates.',
  },
];

export const OFFAL_PRICE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'How to read this price snapshot',
    body: 'The figures compare listed shelf prices per kilogram checked 20 July 2026. They do not compare complete-pack checkout cost, edible yield or the total cost of a finished dinner. Prices, ranges and availability change.',
  },
  {
    key: 'source_timing',
    title: 'Price and guidance review',
    body: 'Retailer prices and official guidance were checked on 20 July 2026. Follow the cited retailer, Food Standards Agency and NHS links for current information.',
  },
];

export const OFFAL_SAFETY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking safety',
    body: 'Cook liver, kidney and other offal thoroughly until steaming hot throughout. Follow product storage instructions, use-by dates and current Food Standards Agency guidance.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Worcestershire sauce commonly contains fish, mustard is an allergen, ale usually contains gluten, and sherry may contain sulphites. Stock and prepared sauces vary by product, so check every label.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Quantities are not fixed in this guide. Adjust them to your appetite and to the dinner you are building around them.',
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

export const LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Ingredient availability and product information can vary. The examples illustrate planning techniques rather than complete recipes. Check product labels and follow current storage and cooking guidance.',
  links: [
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const COOKING_FOR_ONE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers practical planning ideas rather than fixed quantities. Product suitability, storage instructions and allergens vary, so check labels and follow current food-safety guidance.',
  links: [
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const OFFAL_BUDGET_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Offal prices, ranges, availability and product information vary. Check current shelf prices and labels, and follow current NHS and Food Standards Agency guidance.',
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
