import type { ProgrammaticDisclosureKey, ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem } from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const MINCE_BUDGET_DINNERS_GUIDE_PATH = '/guides/9-budget-dinners-with-beef-or-pork-mince';

export const MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'A note on budget wording',
    body: 'This guide does not use live retailer prices or promise a fixed saving. Current pack size, fat percentage, retailer, promotion status and ingredients already at home all affect the final cost.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and reheating',
    body: 'Follow product labels, chill leftovers promptly and reheat cooked mince dishes until steaming hot throughout. Rice needs particular care, so follow current Food Standards Agency guidance when cooling and reheating it.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Stock, sauces, pasta, wraps, breadcrumbs, oats, cheese and prepared seasonings vary by product and may contain allergens. Check labels for everyone eating the dinner.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance and editorial claims were reviewed 6 August 2026. Follow the cited Food Standards Agency pages for later updates.',
  },
];

export const MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers flexible dinner ideas rather than complete recipes. Product prices, pack sizes, ingredients, cooking instructions and allergens vary.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'How prices are calculated' },
    { href: '/food-safety', label: 'Food safety' },
  ],
};

export const MINCE_BUDGET_DINNERS_GUIDE = {
  title: '9 budget dinners with beef or pork mince',
  seoTitle: '9 Budget Dinners With Beef or Pork Mince | DinnerByDesign',
  description: 'Nine practical dinner ideas using beef or pork mince, with ways to stretch portions, use up everyday ingredients and keep weeknight cooking simple.',
  publishedAt: '2026-08-06',
  reviewedAt: '2026-08-06',
  nextReviewAt: '2027-08-06',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find budget dinner ideas using beef mince or pork mince',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-06',
  editorialNotes: 'One canonical ingredient-led guide with nine distinct mince dinner ideas and one handoff to ordinary DinnerByDesign search.',
  internalLinks: ['/guides', '/recipes', '/food-costs/cooking-with-pulses-on-a-budget', '/food-costs/portion-planning-and-food-waste', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: Home food fact checker',
      url: 'https://www.gov.uk/government/publications/home-food-fact-checker',
    },
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.gov.uk/government/publications/cooking-your-food',
    },
  ],
};

export const MINCE_BUDGET_DINNERS_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    paragraphs: [
      "Mince is one of the more useful things to keep in, whether it's beef, pork or a mix of the two. It cooks quickly, picks up whatever flavour you're going for, and stretches a long way once it's paired with something starchy or a tin of pulses. Below are nine ways to use it across the week that don't all collapse into the same tomato-and-pasta idea.",
    ],
  },
  {
    title: 'Mince and bean chilli with rice or baked potatoes',
    paragraphs: [
      "Beef mince holds its shape well under chilli spicing, which is likely why it's the usual choice here, though pork mince works too if that's what you've got in. A tin of kidney beans or black beans adds bulk without adding much to the bill, and the dish is forgiving enough to take whatever vegetables need using up, such as a diced pepper, a grated carrot, or half a bag of frozen sweetcorn. Serve over rice or split between a couple of baked potatoes, with soured cream or grated cheese if there's some in the fridge. Chilli freezes well, so a bigger batch cooked on a Sunday can cover a midweek dinner with little extra effort. Swapping in a drained tin of lentils for part of the mince stretches it further without changing much about how it eats.",
    ],
  },
  {
    title: 'Pork mince noodles with cabbage, carrot and soy',
    paragraphs: [
      "Pork mince suits this one because it cooks fast and takes on soy, ginger and garlic without much persuasion. Shredded cabbage and grated carrot bulk the dish out at low cost and add a bit of crunch, and frozen stir-fry vegetables are a fair substitute when fresh ones aren't to hand. Straight noodles or rice noodles both work, and this is a dinner that's genuinely quicker to cook than a takeaway is to arrive. Leftovers reheat reasonably well in a pan with a splash of water, though the noodles will soften further. Beef mince can stand in if pork isn't available, though the flavour leans a little richer.",
    ],
  },
  {
    title: 'Cottage pie with extra lentils or frozen mixed veg',
    paragraphs: [
      "Beef mince is the traditional choice for cottage pie. A beef-pork mix can work when you want the filling to stretch further. Stirring in a tin of green lentils or a bag of frozen mixed vegetables stretches it considerably more and doesn't stand out once it's under the mash. This is a good batch-cooking candidate: the filling freezes on its own, or the whole assembled pie can go in the freezer before baking. A simpler mash on top, roughly mashed rather than whipped smooth, still does the job.",
    ],
  },
  {
    title: 'Mince pasta bake with tomato sauce and grated cheese',
    paragraphs: [
      'This is the dish most people already associate with mince, so the aim here is to make it stretch rather than reinvent it. A tin of chopped tomatoes, a squeeze of tomato puree and a grated carrot or courgette bulk the sauce without much fuss, and dried pasta shapes such as penne or fusilli hold sauce better than spaghetti in a bake. Topping with grated cheese and a short spell under the grill gives a bit of texture without much extra spend. Any leftover sauce freezes well on its own, separate from the pasta, which keeps it more useful later on.',
    ],
  },
  {
    title: 'Beef mince tacos or wraps with beans and salad',
    paragraphs: [
      'Beef mince browned with a basic spice mix of cumin, paprika and a little chilli powder covers most of what a shop-bought taco seasoning does. A tin of black beans, refried or otherwise, makes the filling more substantial, and shredded lettuce, a chopped tomato or a spoon of salsa rounds it out. Wraps or hard shells both work, and this is one of the quicker dinners on this list from fridge to table. Leftover filling keeps for a day or two and works equally well spooned over rice the next night rather than reheated in a wrap.',
    ],
  },
  {
    title: 'Pork mince meatballs with pasta or mash',
    paragraphs: [
      'Pork mince makes a softer, slightly fattier meatball than beef, which is usually an advantage rather than a drawback here. Mixing in a handful of oats or breadcrumbs and a beaten egg helps them hold together and quietly increases the yield. They sit well in a tomato sauce over pasta, or alongside mash and a green vegetable for something closer to a Sunday-dinner feel. Meatballs freeze cleanly either raw or cooked, so doubling the mixture and freezing half is a reasonable use of the extra ten minutes it takes to roll them.',
    ],
  },
  {
    title: 'Mince and potato hash with a fried egg',
    paragraphs: [
      "This one is closer to a fridge-clearing dinner than a planned one, and that's part of its appeal. Diced potato, browned mince and an onion cooked down together in one pan make a filling dish without much washing-up, and a fried egg on top turns it into something that feels more finished than it is. Frozen diced onion or ready-diced potato can save a bit of time on a weeknight. Either beef or pork mince works, and leftover roast potatoes are a reasonable substitute for raw diced ones if there are some going spare.",
    ],
  },
  {
    title: 'Stuffed peppers with mince, rice and tomato',
    paragraphs: [
      'Peppers vary in price through the year, so this is one to use when peppers are good value rather than a weekly staple, but it stretches mince well when they are. Cooked rice mixed with browned mince, a little tomato and some herbs fills the halved peppers, which then bake until soft. A tin of chopped tomatoes poured around the peppers in the dish doubles as a light sauce. This dinner also works with courgettes halved lengthways if peppers are pricier that week, and any extra filling freezes on its own for using another way later.',
    ],
  },
  {
    title: 'Mince ragu stretched with lentils, mushrooms or grated carrot',
    paragraphs: [
      "A ragu built slowly with a tin of tomatoes, a splash of stock and a good hour on a low heat gets more flavour out of a modest amount of mince than a quick fry ever will. Mushrooms, finely chopped, add a savoury depth that appears to make the mince go further without anyone missing the extra meat, and grated carrot or a tin of green lentils does something similar for texture and bulk. This is a good dinner to cook in a larger batch, since ragu tends to taste better the next day and freezes well in portions. Beef mince is the more traditional choice, though pork works fine if that's what's in.",
    ],
  },
  {
    title: 'A note on cost',
    paragraphs: [
      "Beef mince, pork mince and mixed mince can move around in price depending on the shop, the fat percentage, the pack size and what's on promotion. It is worth checking the current pack and unit prices rather than building a whole dinner plan around a fixed rule. Where a specific saving is mentioned elsewhere on the site, it will be dated and tied to a particular price check rather than presented as a permanent figure.",
    ],
  },
];

export const MINCE_BUDGET_DINNERS_GUIDE_FAQS = [
  {
    question: 'Can I use beef and pork mince in the same dinners?',
    answer: 'Often, yes. Beef mince usually gives a deeper flavour, while pork mince can be softer and slightly richer. The swap works best in chilli, noodles, meatballs, hash and ragu. For cottage pie, beef is the more traditional choice.',
  },
  {
    question: 'How do I make mince stretch further?',
    answer: 'Pair it with beans, lentils, rice, pasta, potatoes or vegetables that need using up. The mince then seasons the whole dinner instead of sitting as the only main ingredient on the plate.',
  },
  {
    question: 'Can cooked mince dishes be frozen?',
    answer: 'Many cooked mince dishes freeze well, including chilli, ragu, meatballs and cottage pie filling. Cool them promptly, freeze in useful portions and reheat until steaming hot all the way through.',
  },
  {
    question: 'Are these full recipes?',
    answer: 'No. These are flexible dinner ideas to help you decide what to cook. Use DinnerByDesign search when you want recipes matched to your time, budget and preferences.',
  },
];

export function getMinceBudgetDinnersGuideJsonLd() {
  return getPublicGuideJsonLd(MINCE_BUDGET_DINNERS_GUIDE_RECORD);
}

export function renderMinceBudgetDinnersGuideInitialHtml() {
  return renderPublicGuideInitialHtml(MINCE_BUDGET_DINNERS_GUIDE_RECORD);
}

export const MINCE_BUDGET_DINNERS_GUIDE_RECORD: PublicGuideRecord = {
  id: '9-budget-dinners-with-beef-or-pork-mince',
  slug: '9-budget-dinners-with-beef-or-pork-mince',
  path: MINCE_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: MINCE_BUDGET_DINNERS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...MINCE_BUDGET_DINNERS_GUIDE,
  metaDescription: MINCE_BUDGET_DINNERS_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: MINCE_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: MINCE_BUDGET_DINNERS_GUIDE_SECTIONS,
  faqs: MINCE_BUDGET_DINNERS_GUIDE_FAQS,
  cta: {
    title: 'Find mince recipes for dinner',
    copy: 'Search DinnerByDesign for beef or pork mince recipes that suit your time, budget and preferences.',
    label: 'Find mince recipes',
    href: '/signin',
  },
};
