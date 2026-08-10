import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH = '/guides/nine-budget-friendly-dinners-with-eggs';

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'storage_and_cooking',
    title: 'Storage and cooking safety',
    body: 'Follow current Food Standards Agency guidance when cooling, storing and reheating cooked rice and other leftovers. Rice needs particularly prompt cooling and should be reheated only once until steaming hot throughout.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Eggs, pasta, bread, tortillas, stock, Parmesan, yogurt and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner.',
  },
  {
    key: 'source_timing',
    title: 'Source and guidance review',
    body: 'The recipe pages and Food Standards Agency guidance were checked on 7 August 2026. Recipe details, product ingredients and official guidance can change, so follow the cited sources for later information.',
  },
];

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers flexible dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and sources.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/food-safety', label: 'Food safety' },
  ],
};

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE = {
  title: 'Nine budget-friendly dinners with eggs',
  seoTitle: 'Nine budget-friendly dinners with eggs | DinnerByDesign',
  description: 'Nine varied budget-friendly dinners with eggs, rice, potatoes, beans, pasta and vegetables, using established recipe sources and practical leftovers advice.',
  publishedAt: '2026-08-07',
  reviewedAt: '2026-08-07',
  nextReviewAt: '2026-09-07',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find varied budget-friendly dinner ideas using eggs',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-07',
  editorialNotes: 'Nine source-led dinner ideas showing how eggs can support varied, budget-friendly cooking while helping use up rice, potatoes, vegetables and leftovers.',
  internalLinks: ['/guides', '/recipes', '/guides/nine-budget-dinners-three-cuisines', '/guides/9-ways-with-sausages', '/guides/9-budget-dinners-with-leftover-roast-chicken', '/food-safety', '/signin'],
  disclosures: ['storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Shakshuka, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/shakshuka' },
    { label: 'Easy egg-fried rice, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/egg-fried-rice' },
    { label: 'Spanish tortilla, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/spanish-tortilla' },
    { label: 'Quick veg and soft cheese frittata, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/quick-veg-soft-cheese-frittata' },
    { label: 'Egg curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/egg-curry' },
    { label: 'One-pan eggs with tomatoes, peppers & yogurt, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/turkish-one-pan-eggs-peppers-menemen' },
    { label: 'Bubble & squeak, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bubble-squeak' },
    { label: 'Potato hash with greens, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/potato-hash-with-greens' },
    { label: 'Beans-and-Greens Pasta with Fried Eggs, Food Network Kitchen', url: 'https://www.foodnetwork.com/fnk/recipes/beans-and-greens-pasta-with-fried-eggs-9840292' },
    { label: 'Food Standards Agency: Rice', url: 'https://www.food.gov.uk/print/pdf/node/4286' },
  ],
  faqs: [
    {
      question: 'Can eggs make a filling budget-friendly dinner?',
      answer: 'Yes. Eggs add protein to inexpensive ingredients such as rice, potatoes, beans, pasta and vegetables, while the recipes use different spices, textures and cooking methods to keep the dinners varied.',
    },
    {
      question: 'Which of these egg dinners are best for using leftovers?',
      answer: 'Egg-fried rice uses cooked rice, bubble and squeak uses leftover mashed potato and cooked vegetables, and the frittata is useful for small amounts of several vegetables. The shakshuka-style sauces can also use tomatoes and peppers that are starting to soften.',
    },
    {
      question: 'Can I substitute ingredients in these egg dinners?',
      answer: 'Yes, within reason. Frozen vegetables can replace fresh ones, tinned beans can usually replace another tinned bean, and ordinary spaghetti can replace chickpea spaghetti in the pasta dish. The article identifies where a substitution changes the original source recipe.',
    },
    {
      question: 'How should cooked rice be stored?',
      answer: 'Cool cooked rice as quickly as possible, ideally within one hour, then cover and refrigerate it. Use it within 24 hours, reheat it only once and make sure it is steaming hot throughout before serving.',
    },
    {
      question: 'Are these complete recipes?',
      answer: 'No. They are source-led dinner ideas and practical notes that point to the established recipe for the full method, ingredients and timings. Follow the linked source recipe and its current instructions when cooking.',
    },
  ],
};

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    paragraphs: [
      'Eggs are one of the few ingredients that make a genuine case for themselves on cost, versatility and speed all at once. A box of six is affordable for the protein it delivers, keeps for weeks in the fridge, and turns rice, potatoes, vegetables, beans and pasta into a finished dinner rather than a pile of leftovers. That makes eggs a useful starting point for anyone trying to keep grocery spending under control without falling back on the same two or three dishes on repeat.',
      'This is a guide to nine budget-friendly dinners with eggs, each taken from an established recipe source rather than presented as anything original. None of them assumes a big shop or a long ingredient list. Between them, they cover rice, potatoes, beans, pasta and a handful of vegetables, which means most of the store-cupboard basics already at the back of the cupboard have somewhere to go. The aim is affordable egg recipes that still feel like proper dinners: budget family dinners built around leftover ingredients, not a fallback when the fridge is bare.',
    ],
  },
  {
    title: '1. Shakshuka',
    paragraphs: [
      'Eggs baked in a spiced tomato sauce of onion, chilli, coriander and cherry tomatoes, a dish with roots across North Africa and the Middle East and a longstanding fixture on BBC Good Food.',
      'The sauce is built from onion, tinned or cherry tomatoes and a little chilli, all inexpensive and long-keeping, with the eggs turning a side sauce into a full dinner. It scales up easily by adding an extra egg or two per additional person.',
      'Onion, chilli, coriander, cherry tomatoes and eggs. A pepper can stand in for the chilli, parsley can replace the coriander, and a pinch of paprika is a reasonable way to add warmth if the chilli is left out. Tinned tomatoes can replace cherry tomatoes outside of summer.',
      'A good way to use up tomatoes that are starting to soften, since they cook down into the sauce rather than needing to look presentable. The sauce alone freezes well, ready for eggs to be added fresh another night.',
      'The sauce can be made ahead and reheated; add and cook the eggs fresh just before serving, since eggs are best cooked close to the point of eating rather than reheated from cold.',
    ],
    source: { label: 'Shakshuka, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/shakshuka', details: 'Serves 2 · Prep 5 mins · Cook 20 mins' },
  },
  {
    title: '2. Easy egg-fried rice',
    paragraphs: [
      'A quick stir-fry of rice, egg and onion, seasoned to taste, and one of the more direct ways to turn cooked rice into a dinner in its own right.',
      'It is built around rice and eggs rather than meat or fish, so a bag of rice and a box of eggs cover most of the cost. Cooking extra rice for an earlier dinner means a second one later in the week costs very little more.',
      'Long grain rice, vegetable oil, onion, eggs and spring onions to serve. Frozen peas, sweetcorn or diced carrot are common, inexpensive additions if there are vegetables that need using up.',
      'This is a genuine leftovers dish rather than one that merely tolerates them. Cold, day-old rice fries better than freshly cooked rice, and small amounts of odd vegetables can go in alongside it.',
      "Rice should be cooled and refrigerated quickly after cooking, then used within 24 hours and reheated only once. The Food Standards Agency's rice-specific food safety guidance recommends cooling rice quickly and using it within one day.",
    ],
    source: { label: 'Easy egg-fried rice, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/egg-fried-rice', details: 'Serves 4 · Prep 10 mins · Cook 10 mins' },
  },
  {
    title: '3. Spanish tortilla',
    paragraphs: [
      'A thick potato and onion omelette, cooked slowly in a covered pan until the base and edges are golden and the middle is just set, served warm or at room temperature.',
      'Potatoes and onions are two of the lower-cost vegetables on a UK shopping list, and the dish scales easily to whatever quantity of potato is in the cupboard.',
      'Potatoes, onion, garlic, eggs and olive oil. Any leftover cooked potato from a previous dinner can be used instead of cooking a fresh batch, cutting the cooking time down considerably.',
      'A practical way to use up potatoes that are past their best for roasting or mashing, and it keeps well, so a larger tortilla can cover more than one dinner across the week.',
      'Cooking the potato and onion gently, covered, before the eggs go in is what gives the tortilla its texture; rushing this stage with high heat tends to brown the potato rather than soften it.',
    ],
    source: { label: 'Spanish tortilla, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/spanish-tortilla', details: 'Serves 4 · Prep 30 mins · Cook 50 mins' },
  },
  {
    title: '4. Quick veg and soft cheese frittata',
    paragraphs: [
      'An open-faced omelette finished under the grill, built around courgette, sweetcorn, spinach and lardons or bacon, and softened with spoonfuls of soft cheese.',
      'Eight eggs and a small amount of bacon or lardons go a long way once padded out with courgette, sweetcorn and spinach, so the dish feeds four without needing a larger amount of meat.',
      'Eight eggs, lardons or bacon, courgettes, sweetcorn, spinach and soft cheese. The bacon or lardons can be left out for a vegetarian version, with the vegetable content adjusted to make up the difference, though this moves the dish away from the recipe as written.',
      'This is the dish to reach for when there are small amounts of several vegetables rather than a full portion of any one, since a frittata can absorb odd quantities without the dish looking thrown together.',
      'Starting the frittata on the hob and finishing it under the grill avoids the need to turn it, and a cast-iron or other ovenproof pan makes this easier.',
    ],
    source: { label: 'Quick veg and soft cheese frittata, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/quick-veg-soft-cheese-frittata', details: 'Serves 4 · Prep 10 mins · Cook 20 mins' },
  },
  {
    title: '5. Egg curry',
    paragraphs: [
      'Hard-boiled eggs served on a spiced curry sauce of onion, beans, spinach, tomatoes and coconut milk, closer to a bean and vegetable curry topped with eggs than a classic Indian egg curry, but a good example of how far a few eggs can stretch when paired with rice or flatbread.',
      'Beans, tinned tomatoes and a handful of spinach make a substantial sauce, with the eggs adding protein rather than being the main cost of the dish.',
      'Onion, curry paste, tinned beans, spinach, tinned tomatoes, coconut milk and hard-boiled eggs. A milder curry paste or powder suits those who prefer less heat, and any tinned bean can be used.',
      'The sauce freezes well on its own, so a batch can be split, with fresh eggs boiled and added when the second portion is reheated. It is also a good way to use spinach that is starting to wilt.',
      'Boiling the eggs while the sauce simmers means both are ready at the same time, rather than one holding up the other.',
    ],
    source: { label: 'Egg curry, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/egg-curry', details: 'Serves 2 · Prep 10 mins' },
  },
  {
    title: '6. One-pan eggs with tomatoes, peppers and yogurt (menemen-inspired)',
    paragraphs: [
      "BBC Good Food's own title for this recipe is One-pan eggs with tomatoes, peppers & yogurt, described on the page as inspired by menemen rather than presented as a direct version of it. It is a soft, cooked-down mixture of tomato and pepper with small wells made in the sauce, eggs cracked into the wells and cooked in pockets rather than stirred through, finished with a spoonful of yogurt. This is closer to shakshuka's method than to the more scrambled, mixed-through style traditionally associated with menemen.",
      'It shares most of its ingredients with shakshuka, which makes it a natural second dinner from the same shopping list, without repeating the same dish.',
      'Onion, green pepper, tomatoes, eggs and yogurt to finish, with chilli or paprika for warmth. Tinned tomatoes can be used in place of fresh outside of summer, and any colour of pepper works.',
      'A good home for tomatoes and peppers that are a little too soft to serve raw, since they cook down fully into the sauce rather than needing to hold their shape.',
      'Space the wells evenly so each egg has enough sauce around it, and keep the heat gentle once the eggs go in, since they continue cooking in the residual heat after the pan comes off the hob.',
    ],
    source: { label: 'One-pan eggs with tomatoes, peppers & yogurt, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/turkish-one-pan-eggs-peppers-menemen', details: 'Serves 4 · Prep 10 mins · Cook 25 mins' },
  },
  {
    title: '7. Bubble and squeak, adapted with a fried egg',
    paragraphs: [
      "BBC Good Food's bubble and squeak recipe includes bacon: leftover mashed potato fried with cabbage or sprouts, onion, garlic and chopped bacon until golden and crisp at the edges. The fried egg on top in this guide is a further adaptation, not part of the source recipe, added to turn a side dish into a full dinner.",
      'The base is designed specifically around leftovers rather than fresh ingredients bought for the dish, so the potato and vegetables cost nothing extra, and only a small amount of bacon and the added egg are new ingredients.',
      'Cold leftover mashed potato, leftover boiled cabbage or sprouts, onion, garlic and bacon, fried in butter or dripping, with a fried egg added on top. The bacon can be left out for a vegetarian version, and any leftover cooked vegetable can be worked in alongside the potato and cabbage.',
      'This is one of the clearest examples in the list of a dinner built specifically to use up what is already in the fridge, particularly after a roast dinner, rather than one that simply happens to keep well.',
      'Pressing the mixture down and leaving it to fry undisturbed for a few minutes is what gives it a crisp base; stirring too often keeps it soft rather than golden.',
    ],
    source: { label: 'Bubble & squeak, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/bubble-squeak', details: 'Serves 4 · Prep 10 mins · Cook 20 mins' },
  },
  {
    title: '8. Potato hash with greens',
    paragraphs: [
      'Diced potato fried with onion and pepper, seasoned with paprika and tarragon, finished with wilted spinach and topped with a poached egg, cooked in the same pan the potatoes were boiled in.',
      'Potatoes, onion and pepper are all lower-cost vegetables, and the egg on top turns what would otherwise be a side dish into a complete dinner without adding meat or fish.',
      'Potatoes, onion, pepper, paprika, tarragon, spinach and eggs. A tin of beans stirred through is a reasonable way to add bulk and stretch the dish further, though it is not part of the recipe as written.',
      'A practical way to use up potatoes, pepper and the last of a bag of spinach before it wilts past the point of being useful.',
      'Poaching the eggs in the reserved potato water, once it is back to a gentle simmer, saves boiling a separate pan.',
    ],
    source: { label: 'Potato hash with greens, BBC Good Food', url: 'https://www.bbcgoodfood.com/recipes/potato-hash-with-greens', details: 'Serves 2 · Prep 10 mins · Cook 40 mins' },
  },
  {
    title: '9. Beans-and-greens pasta with fried eggs',
    paragraphs: [
      'Chickpea spaghetti tossed with chickpeas, spinach and a lemony broth, topped with a fried egg and crisp Parmesan frico chips made by melting spoonfuls of grated Parmesan in the pan until browned. Ordinary spaghetti is a reasonable substitute for the chickpea spaghetti specified, at some cost to the extra protein and fibre it adds.',
      'Chickpeas and spinach make up most of the dish, with pasta as the base, so the egg on top adds protein and richness without the dish needing meat or a large amount of cheese.',
      'Chickpea spaghetti, olive oil, onion, garlic, chickpeas, vegetable broth, spinach, lemon, eggs and Parmesan for the frico. Ordinary spaghetti or another pasta shape can replace the chickpea spaghetti, any tinned bean can replace the chickpeas, and a vegetable stock cube dissolved in water is a reasonable stand-in for shop-bought broth.',
      'A reliable way to use up the last of a bag of spinach and the heel of a lemon or a block of Parmesan too small to grate for anything else.',
      'Frying the eggs separately keeps the yolk in control, so it can be broken over the pasta at the table rather than cooked through in the pan. The Parmesan frico is made by spooning small rounds of grated cheese into a dry pan and cooking until the edges brown and crisp.',
    ],
    source: { label: 'Beans-and-Greens Pasta with Fried Eggs, Food Network Kitchen', url: 'https://www.foodnetwork.com/fnk/recipes/beans-and-greens-pasta-with-fried-eggs-9840292', details: 'Serves 4 · Total 40 mins' },
  },
  {
    title: 'Variety, flexibility and reducing waste',
    paragraphs: [
      'These nine dinners share a single ingredient but do not share a single flavour, texture or cuisine, which is the point of building a week\'s cooking around eggs rather than around one recipe repeated with small changes. Between them, they use up leftover rice, cooked potato, softening tomatoes and peppers, the last of a bag of spinach, and whatever is left in the fridge after a roast dinner, so eggs end up doing double duty: they are the dinner in their own right, and they are also what makes it worth keeping other ingredients on hand rather than letting them go to waste.',
      'None of this depends on unusual ingredients or a big weekly shop. A box of eggs, a few tins, some rice or pasta and whatever vegetables are already in the fridge cover most of what is here, which is really the argument for budget cooking with eggs in the first place: not a fallback when money is tight, but a genuinely useful starting point for a varied week of dinners.',
    ],
  },
  {
    title: 'A note on rice safety',
    paragraphs: [
      "The egg-fried rice and the koshari-inspired pasta and rice dish both rely on cooked rice, so the Food Standards Agency's rice-specific guidance matters here. Cool cooked rice quickly, refrigerate it and use it within 24 hours. Reheat it only once and make sure it is steaming hot throughout before serving.",
    ],
  },
];

export const NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_RECORD: PublicGuideRecord = {
  id: 'nine-budget-friendly-dinners-with-eggs',
  slug: 'nine-budget-friendly-dinners-with-eggs',
  path: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  ...NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE,
  metaDescription: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE_SECTIONS,
  cta: {
    title: 'Find dinners for tonight',
    copy: 'Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.',
    label: 'Find dinners',
    href: '/signin',
  },
};
