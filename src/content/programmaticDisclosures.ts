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

export const PORTION_PLANNING_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Portion sizes in this guide are illustrative. Adjust quantities to suit your household, appetite and what else is being served.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking safety',
    body: 'Freeze suitable surplus promptly and follow product labels. When reheating leftovers, reheat them only once and until steaming hot throughout. Follow current Food Standards Agency guidance.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Ingredients and allergens vary between packaged products, including curry pastes, harissa, sauces and cheese. Check individual labels.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance was reviewed on 20 July 2026. Follow the cited Food Standards Agency links for later updates.',
  },
];

export const MEDITERRANEAN_STORAGE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Cool cooked rice quickly, ideally within an hour, refrigerate it for no more than one day before reheating, and reheat it only once. If it will not be used that quickly, freeze planned portions promptly.',
  },
];

export const MEDITERRANEAN_PRODUCT_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'allergen_and_product',
    title: 'Allergens and product labels',
    body: 'Pasta and bulgur wheat contain gluten; anchovies contain fish; feta, Parmesan, Pecorino and yogurt contain milk. Almonds are a regulated nut allergen. Pine nuts can also cause allergic reactions, although they are not one of the UK\'s 14 regulated allergens. Chorizo, wine and packaged products vary, so check every label.',
  },
];

export const MEDITERRANEAN_SOURCE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Cultural references, food-safety guidance and allergen guidance were reviewed on 20 July 2026. Follow the cited sources for later updates.',
  },
];

export const SUMMER_STEWS_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow current Food Standards Agency guidance on cooling, refrigerating and reheating cooked dishes. Cook chicken thoroughly until steaming hot throughout, with no pink meat remaining.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Bread usually contains gluten. Stock, broth and other packaged ingredients vary by product and may contain allergens, so check every label.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance was reviewed on 20 July 2026. Follow the cited Food Standards Agency guidance for later updates.',
  },
];

export const FRESH_OR_FROZEN_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow the product date and its storage, defrosting and cooking instructions. Frozen vegetables should be cooked thoroughly according to the packet instructions.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'NHS and Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates.',
  },
];

export const BATCH_COOKING_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Standard pasta, tortillas and flatbreads commonly contain wheat. Products and alternative versions vary, so check labels for allergens and dietary suitability.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow current Food Standards Agency guidance on cooling, refrigerating, freezing and reheating cooked food, including the specific guidance on cooked rice.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates.',
  },
];

export const GROCERY_COST_OPTIONS_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'A note on cost',
    body: 'Grocery costs vary with household needs, products, retailers, pack sizes and location. These techniques can improve planning and ingredient use, but none of them guarantees a specific saving.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and product labels',
    body: 'Check product labels for allergens, storage instructions and suitability.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Food safety',
    body: 'Follow current Food Standards Agency guidance when cooling, storing, freezing or reheating food.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited sources for later updates.',
  },
];

export const GROCERY_COST_PREDICTION_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'How to read cost estimates',
    body: 'Prices and availability vary by retailer, location, product and date. Estimates are not guaranteed checkout totals, and complete-pack cost may exceed the value of the ingredients used. Promotional and loyalty prices may also have eligibility conditions.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage note',
    body: 'Follow current Food Standards Agency guidance when chilling, freezing, defrosting or reheating food.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food Standards Agency guidance was reviewed on 20 July 2026. Follow the cited source for later updates.',
  },
];

export const CHEAPER_MEAT_CUTS_COST_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'How to use this guide',
    body: 'This guide does not rank cuts or use live retailer prices. Prices, pack sizes and availability vary, and a lower pack or kilogram price does not automatically mean a lower cost per serving once bone, trimming and cooking time are considered.',
  },
];

export const CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Marinades, spice blends, stock products and prepared sauces vary by brand and can contain allergens, so check every product label before use.',
  },
];

export const CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow product cooking and storage instructions. Make sure chicken and turkey are steaming hot throughout, with no pink meat remaining and juices running clear. Follow current Food Standards Agency guidance when cooling, refrigerating, freezing, defrosting and reheating cooked meat.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food Standards Agency cooking and storage guidance was reviewed on 22 July 2026. Follow the cited sources for later updates.',
  },
];

export const SHARED_INGREDIENTS_PLANNING_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'The five dinner descriptions assume two adults. Adjust quantities for your household and compare the available pack sizes before buying.',
  },
  {
    key: 'price_comparison',
    title: 'A note on cost',
    body: 'Using shared ingredients can reduce part-used packs, but it does not guarantee a lower checkout total. Pack sizes, current prices, cupboard ingredients and how much the household uses all affect the outcome.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and product labels',
    body: 'Check labels on tinned products, seasonings and any substitutions for allergens, storage instructions and suitability.',
  },
];

export const SHARED_INGREDIENTS_SAFETY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking',
    body: 'Follow the chicken packaging and current Food Standards Agency guidance. Keep raw chicken separate, cook it thoroughly, cool and refrigerate leftovers promptly, and reheat them only once until steaming hot throughout.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food Standards Agency cooking, chilling, freezing and defrosting guidance was reviewed on 23 July 2026. Follow the cited sources for later updates.',
  },
];

export const FIVE_A_DAY_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'serving_assumption',
    title: 'Portion calculation',
    body: 'The NHS adult reference is 80g for one portion of ordinary fresh, frozen or tinned fruit and vegetables. Children need different amounts, and purées, dried produce, juice, beans and pulses follow separate rules. The worked calculation is illustrative rather than a result from a specific DinnerByDesign recipe.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'NHS and British Heart Foundation guidance was reviewed on 24 July 2026. Follow the cited sources for later updates.',
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

export const PORTION_PLANNING_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide explains a planning technique rather than prescribing fixed portions. Pack sizes, appetites, product information and storage instructions vary.',
  links: [
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const MEDITERRANEAN_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide draws practical techniques from several distinct culinary traditions. Ingredient availability, product information and allergens vary, so check labels and follow current storage and cooking guidance.',
  links: [
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const SUMMER_STEWS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers flexible dinner ideas rather than fixed recipes. Ingredient availability, product information, allergens and storage instructions vary, so check labels and follow current food-safety guidance.',
  links: [
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const FRESH_OR_FROZEN_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide describes general tendencies rather than fixed rules. Product preparation, storage instructions and suitability for uncooked use vary, so check the packet.',
  links: [
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const BATCH_COOKING_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Batch-cooking results vary with ingredients, portion sizes, available storage and how every portion is used. Check product labels and follow current food-safety guidance.',
  links: [
    { href: '/food-safety', label: 'Storage and cooking safety' },
    { href: '/recipe-methodology', label: 'How dinners are selected' },
  ],
};

export const GROCERY_COST_OPTIONS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'These are practical starting points rather than guaranteed savings. Grocery costs, pack sizes, ingredient needs and storage options vary by household.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
  ],
};

export const GROCERY_COST_PREDICTION_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Grocery estimates can improve visibility and control, but products, prices, pack sizes, substitutions and ingredients already at home vary by household and shop.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
  ],
};

export const CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Prices, pack sizes, usable quantities, cooking time and availability vary. Compare the pack in front of you, check product labels and follow current food-safety guidance.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
  ],
};

export const SHARED_INGREDIENTS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide illustrates one shared-ingredient planning approach rather than fixed recipes or guaranteed savings. Adjust quantities, check product labels and follow current food-safety guidance.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
  ],
};

export const COMPLETE_PACKS_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'Pack sizes, prices, availability and product information vary. The quantities shown are planning illustrations rather than retailer-specific comparisons. Check product labels and follow current food-safety guidance.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'Pricing methodology' },
    { href: '/food-safety', label: 'Storage and cooking safety' },
  ],
};

export const FIVE_A_DAY_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide explains general UK 5 A Day guidance. It does not replace individual advice from a registered healthcare professional.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/nutrition-methodology', label: 'Nutrition estimate methodology' },
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
