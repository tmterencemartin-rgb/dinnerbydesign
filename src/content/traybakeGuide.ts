import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  TRAYBAKE_DISCLOSURE_FOOTER,
  TRAYBAKE_SAFETY_DISCLOSURES,
} from './programmaticDisclosures';
import {
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const TRAYBAKE_GUIDE_PATH = '/guides/how-to-build-a-traybake';

export const TRAYBAKE_GUIDE = {
  title: 'How to build a traybake that cooks evenly and tastes properly finished',
  seoTitle: 'How to build a traybake that cooks evenly | DinnerByDesign',
  description: 'Tray size, staged cooking and a proper finish: the method behind a traybake that browns instead of steams. Search traybake dinners on DinnerByDesign.',
  publishedAt: '2026-07-25',
  reviewedAt: '2026-07-25',
  nextReviewAt: '2027-07-25',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Learn how to build a traybake that browns well and finishes cooking at the same time',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-25',
  editorialNotes: 'One canonical technique guide with a single handoff to ordinary DinnerByDesign search. No indexable filter pages.',
  internalLinks: ['/guides', '/food-safety', '/signin'],
  disclosures: ['storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food',
    },
  ],
};

export const TRAYBAKE_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    paragraphs: [
      "A traybake is easy to get onto a plate and easy to get wrong. Everything goes onto one tray, into one oven, and comes out looking like a dinner. Whether it tastes like one, and whether it's actually cooked through, has usually been decided before anything went in the oven.",
      "Most disappointing traybakes come down to a small number of avoidable choices: too much crammed onto one tray, ingredients cut to different sizes and added all at once regardless of how quickly they cook, and nothing added once it comes out. None of that takes extra time to fix. It takes doing things in a different order.",
    ],
  },
  {
    title: '1. Choose a tray large enough to leave space between ingredients',
    paragraphs: [
      "Overcrowding is probably the most common reason a traybake disappoints. When ingredients are packed close together, the moisture they release turns into steam with nowhere to go, and instead of browning, everything softens and stews in its own liquid. If the tray looks full before anything's gone in, use a bigger one or a second tray. Ingredients should sit in close to a single layer, with visible gaps between them, not stacked or touching edge to edge.",
    ],
  },
  {
    title: '2. Select a base that can tolerate the longest cooking time',
    paragraphs: [
      'The ingredient that takes longest to cook, usually a potato, a piece of squash, or another dense vegetable, goes in first and effectively sets the length of time the tray spends in the oven. Larger or thickly cut potatoes take noticeably longer than small ones, and may need a head start in the oven on their own before anything else goes in, rather than assuming any potato counts as the base regardless of size. Everything else is added or timed relative to that base, rather than cooked alongside it for the same length of time regardless of what it actually needs.',
    ],
  },
  {
    title: '3. Cut ingredients to match how quickly they cook',
    paragraphs: [
      "Consistency matters most within an ingredient, not necessarily across all of them. Potatoes cut to a similar size cook at a similar rate; cut unevenly, some pieces will be done while others are still raw in the middle. A piece of potato and a piece of pepper were never going to cook in the same time regardless of how neatly they're cut, which is part of why staging matters more than trying to make every ingredient on the tray the same size.",
    ],
  },
  {
    title: '4. Add quicker ingredients in stages',
    paragraphs: [
      "A raw potato and a piece of fish don't belong in the oven for the same length of time, and no amount of clever cutting changes that. The base goes in first. Ingredients that cook faster, peppers, cherry tomatoes, delicate fish, quick-cooking greens, go in partway through, timed so everything finishes together rather than starting together. This is the single biggest fix for an unevenly cooked traybake, and it costs nothing beyond opening the oven door once or twice.",
      "Watery vegetables need a bit more thought within this. Courgettes, mushrooms and tomatoes all release a lot of liquid as they cook, which can undo a well-spaced tray by flooding the base of it late on. Salting courgette slices for ten minutes beforehand and patting them dry removes some of that liquid before it reaches the tray. Mushrooms are better handled differently: giving them a bit more space than other ingredients and roasting them uncovered lets the liquid they release evaporate rather than pool, without needing to salt them first. Tomatoes are usually fine left as they are, since their liquid is often meant to become part of the dish, but it's worth knowing which ingredients are contributing moisture on purpose and which are doing it by accident.",
    ],
  },
  {
    title: '5. Finish with something the oven never touched',
    paragraphs: [
      'The element that separates a considered traybake from an assembled one is usually added after the tray comes out, not before it goes in. Fresh herbs, a spoonful of yoghurt, crumbled cheese, toasted seeds, or a squeeze of lemon each add contrast, brightness or texture that sustained oven heat tends to flatten out.',
      'Acid is worth treating on its own terms rather than folding it in with spice. A spoonful of harissa or curry paste stirred through before roasting has time to cook into everything else and mellow, which is usually the effect wanted. Lemon and vinegar behave differently: roasted alongside everything else, much of their brightness cooks off, leaving a general sourness rather than the fresh lift a squeeze of lemon gives at the table. Where a dish wants that lift, adding the acid after cooking rather than before tends to get closer to it.',
      "Seasoning is worth checking twice for a related reason. Salt and spice can taste right on raw ingredients and still read as underseasoned once roasted, partly because some of the moisture carrying that seasoning cooks away, and partly because roasting changes how strongly other flavours come through. That isn't true of every dish, but tasting and adjusting once the tray comes out catches problems that seasoning only at the start sometimes misses.",
    ],
  },
  {
    title: 'Three traybakes that use this method',
    paragraphs: [],
  },
  {
    title: 'Chicken thighs, potatoes and peppers',
    paragraphs: [
      "Potatoes as the base, cut to an even size and started first with oil and seasoning; larger chunks or whole baby potatoes benefit from ten to fifteen minutes in the oven on their own before anything else goes in. Bone-in, skin-on chicken thighs go in alongside the potatoes once they've had that head start, since the two then need a similar length of time. Peppers, cut into large pieces so they don't disappear, go in around twenty minutes before the end. Finish with lemon squeezed over at the table rather than before cooking, and parsley if there's some to hand.",
    ],
  },
  {
    title: 'Chickpeas, squash and harissa',
    paragraphs: [
      "Squash as the base, cut into wedges rather than small cubes so it holds its shape through the full cooking time. A spoonful of harissa mixed with oil goes over the squash from the start, giving it time to cook in properly. Drained tinned chickpeas go in for the final fifteen minutes or so, since they're already cooked and only need warming through and a little colour, not the full time in the oven. Finish with yoghurt loosened with a splash of water and drizzled over, plus coriander if available.",
    ],
  },
  {
    title: 'Fish, tomatoes and courgettes, with the fish added later',
    paragraphs: [
      'Cherry tomatoes and courgette, salted and patted dry beforehand given how much water courgette releases, go in first, since they need longer in the oven than the fish will. A firm white fish fillet, or salmon, goes in for the final part of cooking only. Fish is done when the flesh turns opaque and flakes easily with a fork; overcooking it by even a few minutes undoes the point of adding it last.',
    ],
  },
  {
    title: 'A note on food safety',
    paragraphs: [
      "Cooking times for chicken and fish vary too much by cut, thickness and oven to give one number that works for every traybake. For chicken, the Food Standards Agency's guidance is to check with a food thermometer that the thickest part has reached 70°C for at least 2 minutes, or an equivalent combination such as 75°C for 30 seconds. Without a thermometer, cut into the thickest part and check that the juices run clear, there's no pink meat left, and it's steaming hot all the way through. For fish, cook until the flesh turns opaque and separates easily with a fork. When in doubt, particularly with chicken, it's better to give it a few more minutes than to guess.",
    ],
  },
  {
    title: 'In short',
    paragraphs: [
      "None of this makes a traybake more complicated to cook, just more deliberate about the order things happen in. A tray with room to spare, a base that can take the time, additions staged to match how quickly they cook, and something added at the end that the oven never touched: that's most of the difference between a traybake that tastes assembled and one that tastes considered.",
    ],
  },
];

export const TRAYBAKE_GUIDE_FAQS = [
  {
    question: 'Why does a traybake steam instead of brown?',
    answer: 'The tray is usually overcrowded or contains several ingredients releasing liquid at once. Use a larger tray or a second tray and leave visible space between ingredients.',
  },
  {
    question: 'Which ingredient should go into a traybake first?',
    answer: 'Start with the ingredient that needs the longest cooking time, often potato, squash or another dense vegetable. Add quicker ingredients later.',
  },
  {
    question: 'Should fish go into a traybake at the beginning?',
    answer: 'Usually not. Add fish for the final part of cooking so it finishes with the vegetables without becoming dry.',
  },
  {
    question: 'How do I know chicken in a traybake is safely cooked?',
    answer: 'Check that the thickest part reaches 70°C for 2 minutes, or 75°C for 30 seconds. If you do not have a thermometer, check that it is steaming hot throughout, with no pink meat and clear juices.',
  },
  {
    question: 'What should I add after a traybake comes out of the oven?',
    answer: 'Try fresh herbs, yoghurt, crumbled cheese, toasted seeds, lemon juice or vinegar. Choose one that adds freshness, acidity, creaminess or texture.',
  },
];

export const TRAYBAKE_GUIDE_RECORD: PublicGuideRecord = {
  id: 'how-to-build-a-traybake',
  slug: 'how-to-build-a-traybake',
  path: TRAYBAKE_GUIDE_PATH,
  canonicalPath: TRAYBAKE_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...TRAYBAKE_GUIDE,
  metaDescription: TRAYBAKE_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: TRAYBAKE_SAFETY_DISCLOSURES,
  disclosureFooter: TRAYBAKE_DISCLOSURE_FOOTER,
  sections: TRAYBAKE_GUIDE_SECTIONS,
  faqs: TRAYBAKE_GUIDE_FAQS,
  cta: {
    title: 'Find a traybake for tonight',
    copy: 'Search DinnerByDesign for traybake dinners, filtered by what is already in your kitchen or by cost.',
    label: 'Search traybake dinners',
    href: '/signin',
  },
};
