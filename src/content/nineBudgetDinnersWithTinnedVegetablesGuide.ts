import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH = '/guides/nine-budget-dinners-with-tinned-vegetables';

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'storage_and_cooking', title: 'Storage and cooking safety', body: 'Follow the source recipe and current Food Standards Agency guidance when cooling, storing, freezing and reheating cooked dinners. Instructions and storage advice vary by recipe and product.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Tinned vegetables, beans, fish, cheese, stock, tortillas and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe pages were checked on 7 August 2026. Recipe details, ingredients, instructions and timings can change, so follow the linked publisher page when cooking.' },
];

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and sources.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE = {
  title: 'Nine budget dinners with tinned vegetables',
  seoTitle: 'Nine budget dinners with tinned vegetables | DinnerByDesign',
  description: 'Nine varied dinners using tinned vegetables, beans and potatoes, with established recipe sources and practical ideas for using what is already in the cupboard.',
  publishedAt: '2026-08-07', reviewedAt: '2026-08-07', nextReviewAt: '2026-09-07',
  editorialOwner: 'DinnerByDesign editorial team', pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find budget dinner ideas using tinned vegetables', indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-07',
  editorialNotes: 'Nine source-led dinners showing how tinned vegetables, beans and potatoes can support varied cooking with a useful cupboard back-up.',
  internalLinks: ['/guides', '/recipes', '/guides/nine-budget-friendly-dinners-with-eggs', '/guides/nine-budget-dinners-three-cuisines', '/guides/9-ways-with-sausages', '/food-safety', '/signin'],
  disclosures: ['storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Shakshuka, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/shakshuka' },
    { label: 'Easy tuna pasta bake, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/easy-tuna-pasta-bake' },
    { label: 'Vegetable and bean chilli, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli' },
    { label: 'Easy fish pie, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/family-meals-easy-fish-pie' },
    { label: 'Tomato and chickpea curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry' },
    { label: 'Dum Aloo Potato Curry, Krumpli', url: 'https://www.krumpli.co.uk/dum-aloo-curry/' },
    { label: 'Bean and sausage hotpot, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot' },
    { label: 'Refried bean quesadillas, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/refried-bean-quesadillas' },
    { label: 'Sweetcorn fritters with eggs and black bean salsa, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/sweetcorn-fritters-eggs-black-bean-salsa' },
  ],
  faqs: [
    { question: 'Which tinned vegetables are most useful for dinner?', answer: 'Chopped tomatoes, sweetcorn, peas and potatoes are useful cupboard staples. Beans and chickpeas are pulses rather than vegetables, but they are equally useful in a cupboard and work alongside the tinned vegetables in several of these dinners.' },
    { question: 'Can tinned potatoes be used in a dinner?', answer: 'Yes. The dum aloo potato curry linked in this guide gives instructions for using tinned new potatoes as an alternative to boiling and peeling fresh ones.' },
    { question: 'Are tinned vegetables better than fresh or frozen?', answer: 'No. Fresh, frozen and tinned vegetables all have a place. Tins are useful because they keep for months and can provide a back-up when the fridge is running low.' },
    { question: 'How can I avoid wasting tins?', answer: 'Keep a small rotating stock, buy a couple of extras as part of an ordinary shop and use the oldest tins first. This makes it less likely that unopened tins disappear at the back of the cupboard.' },
    { question: 'Are these complete recipes?', answer: 'No. They are source-led dinner ideas with practical notes. Use the linked publisher recipe for its full ingredient list, method, timings and current instructions.' },
  ],
};

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_SECTIONS: PublicGuideSection[] = [
  { paragraphs: [
    'Grocery bills have made a lot of households more careful about what goes in the trolley, and tinned vegetables are one of the simplest ways to keep costs down without cooking the same three dinners on repeat. They are not a replacement for fresh or frozen vegetables, which still earn their place for texture, flavour and variety. What tins offer is a back-up: something in the cupboard that keeps for months, does not wilt or spoil if the week gets away from you, and turns pasta, rice, potatoes, eggs, pulses or a small amount of meat or fish into a proper dinner even when the fridge is running low.',
    'This guide sets out nine dinners built around tinned vegetables, each taken from an established recipe publisher. Tinned tomatoes, sweetcorn, peas, beans and potatoes all turn up here, paired with everyday cupboard staples. None depends on a long fresh-ingredient list, and none is presented as the only or best way to cook the dish, just a workable one for a week when a full shop has not happened.',
  ] },
  { title: '1. Shakshuka', source: { label: 'Shakshuka, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/shakshuka', details: 'Serves 2 · Prep 5 mins · Cook 20 mins' }, paragraphs: [
    'Eggs baked in a spiced tomato sauce of onion, chilli, coriander and tomatoes, finished at the table straight from the pan.',
    'Tomatoes form the base of the sauce, either from a tin or from cherry tomatoes as the source recipe specifies. A pepper and a pinch of paprika are reasonable substitutes if fresh chilli and coriander are not to hand.',
    'It is a useful way to cook tomatoes that are starting to soften. The sauce can be prepared ahead, with eggs added fresh when it is time to cook.',
  ] },
  { title: '2. Easy tuna pasta bake', source: { label: 'Easy tuna pasta bake, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/easy-tuna-pasta-bake', details: 'Serves 4 · Prep 10 mins · Cook 20 mins' }, paragraphs: [
    'Pasta stirred through a cheese sauce with tuna, peas and sweetcorn, topped with grated cheddar and finished under the grill until golden.',
    'Sweetcorn, alongside peas, gives the bake colour and bite against the pasta and sauce. Any small pasta shape works in place of the one specified, and a tin of salmon is a straightforward swap for tuna.',
    'The full quantity is useful for a smaller household too, as the source recipe gives clear instructions for serving a larger dish.',
  ] },
  { title: '3. Vegetable and bean chilli', source: { label: 'Vegetable and bean chilli, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/vegetable-bean-chilli', details: 'Serves 4 · Prep 10 mins · Cook 30 to 35 mins' }, paragraphs: [
    'A chilli of courgette, peppers, red lentils and tomatoes, with sweetcorn and butter beans stirred through towards the end of cooking.',
    'Tinned tomatoes form the sauce, with tinned sweetcorn and butter beans added later so they keep some texture. Any tinned bean works in place of butter beans, and courgette can be swapped for another vegetable that needs using up.',
    'The recipe is a useful batch-cooking option, with the source providing the full method and storage advice.',
  ] },
  { title: '4. Easy fish pie', source: { label: 'Easy fish pie, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/family-meals-easy-fish-pie', details: 'Serves 6 to 8 · Prep 15 mins · Cook 45 mins' }, paragraphs: [
    'A creamy fish pie mix bound in a cheese sauce with mustard and chives, finished with sweetcorn and peas, topped with mash and grated cheddar, and baked until golden.',
    'Sweetcorn and peas add colour and a contrast in texture to the soft fish and sauce. Frozen versions of both work just as well as tinned, which gives the dish some flexibility.',
    'A bag of frozen fish pie mix is handy for a night when fresh fish was not part of the shop. Follow the source recipe for its preparation and serving advice.',
  ] },
  { title: '5. Tomato and chickpea curry', source: { label: 'Tomato and chickpea curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/tomato-chickpea-curry', details: 'Serves 4 · Prep 10 mins · Cook 45 mins' }, paragraphs: [
    'Chickpeas warmed through in a spiced tomato and coconut milk sauce, finished with coriander and served with rice.',
    'Tinned tomatoes and chickpeas do most of the work, needing little beyond onion, garlic, coconut milk and spices to become a full sauce. Any tinned pulse can stand in for chickpeas.',
    'It is a good one to cook ahead when the week is likely to be busy. Follow the source for its method and storage instructions.',
  ] },
  { title: '6. Dum aloo potato curry', source: { label: 'Dum Aloo Potato Curry, Krumpli', url: 'https://www.krumpli.co.uk/dum-aloo-curry/', details: 'Serves 2 · Prep 5 mins · Cook 1 hr 15 mins' }, paragraphs: [
    'A North Indian and Bangladeshi potato curry, with new potatoes fried in ghee then simmered in a spiced tomato gravy thickened with cashew nuts and finished with cream.',
    'The recipe explicitly builds in tinned new potatoes as an alternative to boiling and peeling fresh ones, with instructions given for both. Using tinned potatoes removes the boiling and peeling stage.',
    'The sauce can be made ahead and the potatoes added when reheating. The publisher gives further make-ahead advice on the recipe page.',
  ] },
  { title: '7. Bean and sausage hotpot', source: { label: 'Bean and sausage hotpot, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bean-and-sausage-hotpot', details: 'Serves 4 · Prep 5 mins · Cook 40 mins' }, paragraphs: [
    'Sausages browned and simmered in a tomato sauce with tinned butter beans, a little treacle or sugar and mustard, served with rice or crusty bread.',
    'Tinned butter beans and a tomato-based sauce carry most of the dish, with the sausages providing flavour and substance. Any tinned bean can be used in place of butter beans.',
    'Adding a second tin is one way to stretch the dish when there are more people to feed.',
  ] },
  { title: '8. Refried bean quesadillas', source: { label: 'Refried bean quesadillas, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/refried-bean-quesadillas', details: 'Serves 4 · Prep 10 mins · Cook 20 mins' }, paragraphs: [
    'Tortillas filled with refried beans, cheese and coriander, folded and fried until crisp and melted through, then served with salsa and sour cream.',
    'Tinned beans are mashed with onion, garlic and spices to make the filling, needing little more than cheese and a tortilla to become a dinner. Sweetcorn or leftover cooked vegetables can be added to the filling to bulk it out.',
    'Keep any unused filling according to the source guidance, ready for a second batch.',
  ] },
  { title: '9. Sweetcorn fritters with eggs and black bean salsa', source: { label: 'Sweetcorn fritters with eggs and black bean salsa, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/sweetcorn-fritters-eggs-black-bean-salsa', details: 'Serves 4 · Makes 8 fritters · Prep 10 mins · Cook 20 mins' }, paragraphs: [
    'Baked fritters of tinned sweetcorn, onion and pepper, topped with poached eggs and a salsa of tomato, black beans, lime and coriander.',
    'Tinned sweetcorn is central to the fritters, with tinned black beans forming the base of the salsa. The source recipe makes eight fritters and gives a way to serve half on the day and the rest later.',
    'That makes it a useful example of how one tin of sweetcorn can support more than one dinner without cooking the same thing twice.',
  ] },
  { title: 'A note on the cupboard', paragraphs: [
    'A small, rotating stock of tins covers most of what these nine dinners need: chopped tomatoes, sweetcorn, peas, beans, chickpeas and potatoes are the ones that turn up most often, alongside tinned fish if it is eaten in the household. Buying a couple of extras on a normal shop, rather than a large stockpile all at once, makes it easier to use them before the ones at the back of the cupboard are forgotten.',
    'Rotating stock and using the oldest tins first keeps things moving. Tinned vegetables in sauce or brine can carry more salt than fresh or frozen, so check the label where a dish is already well seasoned, and drain and rinse beans or pulses if that suits the product and recipe. Fresh and frozen vegetables still have their place in a weekly shop. The point of keeping a few tins in reserve is flexibility, not a rule about which is best.',
  ] },
];

export const NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_RECORD: PublicGuideRecord = {
  id: 'nine-budget-dinners-with-tinned-vegetables',
  slug: 'nine-budget-dinners-with-tinned-vegetables',
  path: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  ...NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_TINNED_VEGETABLES_GUIDE_SECTIONS,
  cta: {
    title: 'Find dinners for tonight',
    copy: 'Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.',
    label: 'Find dinners',
    href: '/signin',
  },
};
