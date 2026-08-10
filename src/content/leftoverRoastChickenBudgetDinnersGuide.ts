import type { ProgrammaticDisclosureKey, ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem } from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH = '/guides/9-budget-dinners-with-leftover-roast-chicken';

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_comparison',
    title: 'A note on budget wording',
    body: 'This guide does not use live retailer prices or promise a fixed saving. Current pack sizes, retailer prices and ingredients already at home all affect the final cost.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and reheating',
    body: 'Follow current Food Standards Agency guidance when cooling, storing and reheating leftover chicken, cooked rice and dishes made with them. Check the guidance again if your storage conditions differ.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Stock, soy sauce, wraps, pastry, yoghurt, houmous, mayonnaise, cheese and prepared seasonings vary by product and may contain allergens. Check labels for everyone eating the dinner.',
  },
  {
    key: 'source_timing',
    title: 'Guidance review',
    body: 'Food-safety guidance and editorial claims were reviewed 6 August 2026. Follow the cited Food Standards Agency pages for later updates.',
  },
];

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers flexible dinner ideas rather than complete recipes. Ingredients, pack sizes, cooking instructions and allergens vary.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'How prices are calculated' },
    { href: '/food-safety', label: 'Food safety' },
  ],
};

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE = {
  title: '9 budget dinners with leftover roast chicken',
  seoTitle: '9 Budget Dinners With Leftover Roast Chicken | DinnerByDesign',
  description: 'Nine practical dinner ideas for using leftover roast chicken, with ways to stretch portions, use everyday ingredients and reduce food waste.',
  publishedAt: '2026-08-06',
  reviewedAt: '2026-08-06',
  nextReviewAt: '2027-08-06',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find budget dinner ideas using leftover roast chicken',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-06',
  editorialNotes: 'One canonical leftover-led guide with nine distinct roast chicken dinner ideas, food-safety guidance and one handoff to ordinary DinnerByDesign search.',
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
    {
      label: 'Food Standards Agency: Reheating leftovers until steaming hot throughout',
      url: 'https://www.food.gov.uk/research/behaviour-and-perception/not-reheating-leftovers-until-steaming-hot-throughout',
    },
  ],
};

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    paragraphs: [
      "A roast chicken rarely gets used all at once, and what's left in the fridge a day or two later is worth more than a sandwich filling. Shredded or diced, roast chicken carries flavour into soups, bakes, curries and rice dishes without much effort, and it pairs well with things already in the cupboard: potatoes, tinned tomatoes, stock, beans, yoghurt. Below are nine dinners built around that leftover chicken, each one designed to stretch it a bit further rather than just bulking out a plate.",
    ],
  },
  {
    title: 'Chicken fried rice',
    paragraphs: [
      "Fried rice is one of the quickest ways to turn a small amount of chicken into a full dinner. Cooked, cold rice fries better than fresh, so this is a natural fit for a rice portion left over from another night. Add a beaten egg, frozen peas and sweetcorn, and a splash of soy sauce, and around 150g of shredded chicken is enough for two generous portions once everything else bulks it out. A grated carrot or some finely sliced spring onion is a reasonable addition if there's some to use up. To stretch the chicken further, lean more heavily on the vegetables and treat the meat as one ingredient among several rather than the main event.",
    ],
  },
  {
    title: 'Chicken, leek and mushroom pie filling',
    paragraphs: [
      "A white sauce built from butter, flour and milk, with sliced leek and mushroom softened in first, turns a modest amount of chicken into a filling that goes a long way under pastry or mash. About 200g of diced chicken is plenty for a pie serving four, especially once the vegetables are added. Ready-rolled puff pastry keeps this simple, and a shortcrust or mashed potato topping works just as well if that's what's in. A tin of sweetcorn or a couple of handfuls of frozen peas stirred through the sauce add bulk and help the filling stretch across more portions than the chicken alone would manage.",
    ],
  },
  {
    title: 'Chicken and sweetcorn soup',
    paragraphs: [
      "This is the one to make if the chicken has dried out slightly, since a slow simmer in stock brings it back to life. Sweetcorn, whether tinned or frozen, is the main bulking ingredient here, along with a diced onion and some sliced spring onion if there's any about. Around 100g of shredded chicken is enough for a pan that serves two to three, particularly with a swirl of beaten egg stirred through at the end for extra body, in the style of a simple egg-drop soup. Rice or noodles added to the pot turn this from a starter into more of a main dinner. Any extra should be cooled promptly, covered and put in the fridge, then eaten within 48 hours or frozen for another week.",
    ],
  },
  {
    title: 'Chicken wraps with yoghurt, salad and pickles',
    paragraphs: [
      "This is the dinner for a night when there's not much appetite for cooking. Shredded chicken, a spoonful of plain yoghurt mixed with a little garlic or lemon, and whatever salad is knocking about in the fridge fill a wrap or flatbread well, and there's barely a pan to wash up afterwards. Around 80 to 100g of chicken per wrap is a reasonable amount, and a bit of pickled onion or gherkin adds the sharpness that stops the whole thing tasting flat. Swapping the yoghurt for houmous is an easy variation if that's what's open in the fridge. To stretch the chicken further, add a tin of drained chickpeas to the filling so the wrap isn't relying on meat for its bulk.",
    ],
  },
  {
    title: 'Chicken pasta bake',
    paragraphs: [
      "A tomato or white sauce poured over pasta and shredded chicken, topped with cheese and baked until bubbling, is a dependable way to use up both leftover chicken and any pasta sauce sitting in the cupboard. Around 150g of chicken is enough for a bake serving three to four once the pasta and sauce are factored in, and frozen spinach or broccoli stirred through adds colour and volume. A tin of chopped tomatoes can stand in for a jarred sauce if that's what's to hand. Bulking the pasta itself, rather than the chicken, is usually the easiest way to make this dinner go further across more portions.",
    ],
  },
  {
    title: 'Chicken curry with chickpeas or lentils',
    paragraphs: [
      "A curry built from onion, garlic, tinned tomatoes and whatever spices are in the cupboard turns a small amount of chicken into a dinner that reheats well the next day. Around 150g of shredded chicken is plenty for a curry serving three, especially once a tin of chickpeas or a handful of red lentils is added to thicken the sauce and increase the volume. Coconut milk is a reasonable swap for some of the tomato base if a creamier curry is wanted. Lentils are the more effective stretcher of the two, since they break down as they cook and thicken the sauce rather than sitting as a separate ingredient.",
    ],
  },
  {
    title: 'Chicken risotto',
    paragraphs: [
      "Risotto works from raw rice rather than leftover rice, unlike the fried rice above, so this is one to start from a bag of arborio or carnaroli rather than reaching for a cooked portion out of the fridge. Cooked slowly with stock, added a ladleful at a time, the rice gives a creamy base that carries shredded chicken well without needing much of it. Around 120g of chicken, stirred through near the end of cooking so it warms through rather than overcooks, is enough for a risotto serving two to three. Frozen peas or sweetcorn stirred in during the last few minutes add colour and bulk. A vegetable stock cube can replace chicken stock if that's what's in, and the flavour holds up reasonably well. Using a bit more rice and stock than the chicken alone would need is the simplest way to stretch this dinner across more servings.",
    ],
  },
  {
    title: 'Loaded baked potatoes with chicken and beans',
    paragraphs: [
      "A baked potato is already a filling base, so it doesn't take much chicken on top to make a proper dinner of it. For each potato, mix around 80g of shredded chicken with either a tin of beans in a light sauce, or with sweetcorn and a spoon of mayonnaise, then spoon that over the split potato. Cheese grated over the top is optional but does add to the sense of a finished plate. Baked beans are a fair swap for the tinned beans if that's what's in the cupboard, and this dinner scales easily up or down depending on how many potatoes go in the oven. Splitting the chicken across more potatoes, topped up with extra beans, is the easiest way to feed more people from the same amount of meat.",
    ],
  },
  {
    title: 'Chicken hash with potatoes and a fried egg',
    paragraphs: [
      "This is the one-pan dinner for when the fridge looks a bit bare and there's not much energy for a proper cook. Diced potato, fried until golden with an onion and the leftover chicken stirred through towards the end, comes together with barely any planning. Around 100 to 120g of chicken is enough for a hash serving two, topped with a fried egg so the yolk runs into everything underneath. Leftover roast potatoes work well here instead of raw diced ones if there are some going spare, which also cuts the cooking time considerably. Frozen diced onion is a reasonable time-saver if a fresh one isn't to hand. Adding a handful of frozen peas or sweetcorn towards the end of cooking bulks the pan out without needing more chicken.",
    ],
  },
  {
    title: 'A note on food safety',
    paragraphs: [
      "Leftover chicken should go in the fridge promptly, ideally within two hours of cooking. The Food Standards Agency advises eating leftovers within 48 hours or freezing them if that isn't going to happen. When reheating, chicken and any dish containing it should be heated until steaming hot all the way through, not just warmed, and should only be reheated once.",
      "Rice needs its own rule, and it applies to the fried rice above rather than the risotto, since risotto is cooked fresh from raw rice each time. The Food Standards Agency advises cooling cooked rice quickly, ideally within an hour, then refrigerating it and using it within 24 hours. As with any leftover, reheat rice only once and make sure it's steaming hot all the way through before serving.",
    ],
  },
];

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS = [
  {
    question: 'How long can leftover roast chicken be kept in the fridge?',
    answer: 'Cool it promptly, refrigerate it within two hours of cooking and eat it within 48 hours, or freeze it if that will not be possible. Follow current Food Standards Agency guidance if your storage conditions differ.',
  },
  {
    question: 'Can I use leftover chicken in fried rice?',
    answer: 'Yes, but use rice that was cooled quickly, refrigerated promptly and used within 24 hours. Reheat the finished fried rice only once and make sure it is steaming hot throughout before serving.',
  },
  {
    question: 'How can I make leftover chicken stretch further?',
    answer: 'Pair it with potatoes, pasta, rice, beans, lentils or vegetables that need using up. The chicken then adds flavour to the whole dinner rather than sitting as the only main ingredient.',
  },
  {
    question: 'Can these leftover chicken ideas be frozen?',
    answer: 'Many can be frozen, including soup, pie filling, curry and pasta bake. Cool the dish promptly, freeze it in useful portions and reheat it until steaming hot throughout. Check rice guidance separately.',
  },
];

export function getLeftoverRoastChickenBudgetDinnersGuideJsonLd() {
  return getPublicGuideJsonLd(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD);
}

export function renderLeftoverRoastChickenBudgetDinnersGuideInitialHtml() {
  return renderPublicGuideInitialHtml(LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD);
}

export const LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_RECORD: PublicGuideRecord = {
  id: '9-budget-dinners-with-leftover-roast-chicken',
  slug: '9-budget-dinners-with-leftover-roast-chicken',
  path: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  canonicalPath: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE,
  metaDescription: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURES,
  disclosureFooter: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_DISCLOSURE_FOOTER,
  sections: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_SECTIONS,
  faqs: LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE_FAQS,
  cta: {
    title: 'Find chicken recipes for dinner',
    copy: 'Search DinnerByDesign for chicken recipes that suit your time, budget and preferences.',
    label: 'Find chicken recipes',
    href: '/signin',
  },
};
