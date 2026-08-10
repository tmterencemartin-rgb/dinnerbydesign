import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH = '/guides/nine-budget-dinners-built-around-bubble-and-squeak';

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on budget wording', body: 'This guide does not use live retailer prices or promise a fixed saving. The cost depends on what is already at home, current prices and the toppings you choose.' },
  { key: 'storage_and_cooking', title: 'Leftovers and food safety', body: 'Cooked potato, vegetables, meat and fish need prompt cooling, suitable storage and thorough reheating. Follow current Food Standards Agency guidance and product-label instructions.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Bacon, black pudding, sausages, baked beans, cheese, yoghurt, mustard, fish and prepared sauces vary by product and may contain allergens. Check labels for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe and food-safety sources were checked on 8 August 2026. Follow the linked publisher and Food Standards Agency pages for later updates.' },
];

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers variations on a flexible bubble-and-squeak base rather than nine separate complete recipes. Ingredient quantities, storage advice and cooking instructions vary.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE = {
  title: 'Nine budget dinners built around bubble and squeak',
  seoTitle: 'Nine Budget Dinners Built Around Bubble and Squeak | DinnerByDesign',
  description: 'Nine practical ways to turn bubble and squeak into a varied dinner, using eggs, beans, fish, leftover chicken and cupboard ingredients.',
  publishedAt: '2026-08-08', reviewedAt: '2026-08-08', nextReviewAt: '2027-08-08',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find dinner ideas built around bubble and squeak', indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-08',
  editorialNotes: 'Nine clearly labelled variations on one verified bubble-and-squeak method, with one separately sourced chickpea sauce.',
  internalLinks: ['/guides', '/recipes', '/guides/9-budget-dinners-with-leftover-roast-chicken', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Bubble & squeak, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bubble-squeak' },
    { label: 'Tomato & chickpea curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Can I make bubble and squeak without leftovers?', answer: 'Yes. Cook potato and vegetables specifically for it, then cool them before frying. Cold potato helps the mixture hold together.' },
    { question: 'What vegetables work in bubble and squeak?', answer: 'Cabbage and sprouts are traditional, but cooked carrots, peas and greens can work too. Use vegetables that are safe to eat and have been stored properly.' },
    { question: 'How do I stop bubble and squeak falling apart?', answer: 'Use cold cooked potato, avoid overloading the pan and add a little flour, breadcrumbs or beaten egg if the mixture feels too loose.' },
    { question: 'Can bubble and squeak be a dinner on its own?', answer: 'Yes. Eggs, beans, fish, sausages or a sauce can turn it into a fuller dinner, depending on what is available.' },
  ],
};

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_SECTIONS: PublicGuideSection[] = [
  { paragraphs: [
    "Bubble and squeak is cooked potato and vegetables, roughly mashed or chopped, fried until crisp and golden. It's particularly useful the day after a roast, when there's leftover mash, cabbage or sprouts sitting in the fridge, but there is no reason it has to start with leftovers; potato and vegetables cooked specifically for the purpose work just as well.",
    "The base recipe used throughout this guide is BBC Good Food's Bubble & squeak, which fries cold leftover mashed potato with cabbage or sprouts, onion, garlic and a little bacon until crisp at the edges. It serves four, with ten minutes of preparation and twenty minutes of cooking. Everything below builds on that base with a different topping or addition.",
  ] },
  { title: '1. Bubble and squeak with fried eggs', paragraphs: [
    'A fried egg with a runny yolk turns a panful of crisp potato and cabbage into a dinner rather than a side dish. Break the yolk over the top and it does the work a sauce would otherwise do.',
    'This is the base recipe with nothing added beyond the egg, so it is the one to start with if any of the others feel like too much. Frying the egg in a separate pan while the bubble and squeak finishes crisping means neither has to wait for the other.',
  ] },
  { title: '2. Bubble and squeak with black pudding and apples or chutney', paragraphs: [
    'Slices of black pudding fried alongside the potato cake, with a few slices of apple softened in the same pan, or a spoonful of chutney on the side to cut through the richness.',
    'Black pudding brings a peppery depth that is a long way from the plainness of the egg version. It is entirely optional, and the base works without it. Add it only in the final few minutes to avoid it drying out.',
  ] },
  { title: '3. Bubble and squeak with sausages and onion gravy', paragraphs: [
    'A small number of sausages, browned and simmered briefly in onion gravy, served alongside or on top of the bubble and squeak. The gravy gives the dinner more body and a longer cooking time than the egg version.',
    'Two or three sausages, sliced, go further across a panful of bubble and squeak than they would served whole alongside mash, which is a useful way to stretch a small pack.',
  ] },
  { title: '4. Bubble and squeak with baked beans and cheese', paragraphs: [
    'Tinned baked beans, warmed through and spooned generously over bubble and squeak, finished with grated cheese melted under the grill or stirred through while hot.',
    'The beans are the bulk of the dinner alongside the potato base, making this one of the most cupboard-led versions on the list. Transfer any unused beans to a covered container and follow the tin label guidance for storage.',
  ] },
  { title: '5. Bubble and squeak with leftover roast chicken', paragraphs: [
    'A modest amount of cooked chicken, shredded and folded through the bubble and squeak as it fries, or piled on top once served. It uses two sets of leftovers at once: chicken and vegetables.',
    'Cooked chicken only needs warming through, not further cooking, so add it towards the end to avoid it drying out or overcooking. The leftover roast chicken guide has more ideas if there is more meat left than one dinner can use.',
  ], relatedLink: { label: 'Nine budget dinners with leftover roast chicken', url: '/guides/9-budget-dinners-with-leftover-roast-chicken' } },
  { title: '6. Bubble and squeak with smoked fish and a poached egg', paragraphs: [
    'Flaked smoked mackerel or smoked haddock, warmed gently and folded through or served alongside the bubble and squeak, topped with a softly poached egg. Smoked fish takes the dish away from a fry-up and towards a fish supper.',
    'Check the pack instructions. Smoked haddock needs cooking, while some hot-smoked mackerel fillets are ready to eat or can simply be warmed through.',
  ] },
  { title: '7. Bubble and squeak topped with a spiced tomato and chickpea sauce', paragraphs: [
    "Spoon spiced tomato and chickpea sauce, in the style of BBC Good Food's Tomato & chickpea curry, over crisp bubble and squeak rather than serving it with rice. The sauce should sit on top and bring contrast, not smother the crisp base underneath.",
    'This is the only dinner on the list with a spiced, saucy element rather than a fried or grilled topping, and the only one built around a separate source recipe. Making a full batch of the sauce and freezing half keeps the next version simple.',
  ] },
  { title: '8. Bubble and squeak with mushrooms, greens and a soft egg', paragraphs: [
    'Mushrooms fried until golden, whatever greens are to hand wilted in at the last minute, and a softly cooked egg on top. This is the most adaptable entry, useful when there are odd amounts of several vegetables rather than a full portion of any one.',
    'Fry the mushrooms separately before adding them, rather than in with the potato from the start, to stop them making the whole pan watery.',
  ] },
  { title: '9. Bubble and squeak cakes with a simple salad and yoghurt or mustard dressing', paragraphs: [
    'Shape the same mixture into smaller patties rather than one large panful, then serve with a simple salad and a spoonful of yoghurt or mustard dressing rather than a hot topping.',
    'Smaller cakes cook faster and crisp more evenly than one large cake, and the cold salad and dressing make this feel like a genuinely different dinner. A spoonful of plain yoghurt with lemon, or a little mustard loosened with oil, is enough.',
  ] },
  { title: 'Getting the base right', paragraphs: [
    'Cold cooked potato holds together better than warm potato, so cool it in the fridge for at least an hour, or use genuine leftovers, before frying. Avoid overloading the pan: a thinner layer crisps on the outside, while a thick crowded pan tends to steam instead.',
    'Almost any cooked vegetable works, not just cabbage: sprouts, carrots, peas and other greens can all go in. If the mixture feels too loose to hold its shape, a spoonful of flour or breadcrumbs, or a beaten egg, helps bind it. None of this requires leftovers specifically.',
  ] },
  { title: 'A note on leftovers and food safety', paragraphs: [
    'Cooked potato, vegetables, meat and fish need proper cooling, storing and reheating to stay safe to eat. Check current Food Standards Agency guidance before building a dinner around anything that has been sitting in the fridge for more than a day or two.',
  ] },
  { title: 'A flexible base, not a rulebook', paragraphs: [
    'Bubble and squeak works best as a starting point rather than a compulsory way to use every leftover in the fridge. The practical win is that it gives odds and ends a defined purpose, so cooked potato and vegetables are more likely to get used before they are forgotten.',
  ], relatedLink: { label: 'Browse the guides library', url: '/guides' } },
];

export const BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_RECORD: PublicGuideRecord = {
  id: 'nine-budget-dinners-built-around-bubble-and-squeak',
  slug: 'nine-budget-dinners-built-around-bubble-and-squeak',
  path: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  ...BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE,
  metaDescription: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE_SECTIONS,
  cta: {
    title: 'Find dinners for tonight',
    copy: 'Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.',
    label: 'Find dinners',
    href: '/signin',
  },
};
