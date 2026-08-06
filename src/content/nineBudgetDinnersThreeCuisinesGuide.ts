import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH = '/guides/nine-budget-dinners-three-cuisines';

export const NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'price_estimate',
    title: 'About these estimates',
    body: 'Guide prices are estimates based on named Tesco products and pack sizes checked online on 6 August 2026. They cover the main ingredients only and use the stated serving assumptions. Retailer, regional and availability differences, offers, pack sizes and ingredients already at home change the result.',
  },
  {
    key: 'price_comparison',
    title: 'How to read the price examples',
    body: 'The per-serving figures are guide calculations, not fixed costs or a ranking of the three cuisines. They distinguish the value of the ingredients used from the packs you may need to buy, and exclude oil and salt assumed to be in the cupboard.',
  },
  {
    key: 'serving_assumption',
    title: 'Serving assumption',
    body: 'Figures are based on four servings unless the dinner fact line says otherwise. Rice served alongside the dal and bean chilli is assumed at 75g dry rice per person; bread and other sides are included only where stated.',
  },
  {
    key: 'storage_and_cooking',
    title: 'Storage and reheating',
    body: 'Follow current Food Standards Agency guidance when cooling, storing and reheating cooked rice and other leftovers. Rice needs particularly prompt cooling and should be reheated only once until steaming hot throughout.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Tortillas, flatbreads, stock, spices, curry powder, garam masala, eggs and other packaged ingredients vary by product and may contain allergens. Check labels and choose ingredients suitable for everyone eating the dinner.',
  },
  {
    key: 'source_timing',
    title: 'Price and guidance review',
    body: 'The Tesco price examples and Food Standards Agency guidance were checked on 6 August 2026. Prices, availability and official guidance can change, so follow the cited sources for later information.',
  },
];

export const NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers flexible dinner ideas rather than complete recipes. Product prices, pack sizes, ingredients, cooking instructions, storage advice and allergens vary.',
  links: [
    { href: '/guides', label: 'Browse all guides' },
    { href: '/pricing-methodology', label: 'How prices are calculated' },
    { href: '/food-safety', label: 'Food safety' },
  ],
};

export const NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE = {
  title: 'Nine budget dinners from three cuisines: Indian, Mexican and Egyptian',
  seoTitle: 'Nine budget dinners from three cuisines: Indian, Mexican and Egyptian | DinnerByDesign',
  description: 'Nine varied budget dinners inspired by Indian, Mexican and Egyptian cooking, using overlapping ingredients and practical UK supermarket substitutions.',
  publishedAt: '2026-08-06',
  reviewedAt: '2026-08-06',
  nextReviewAt: '2026-09-06',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find varied budget dinner ideas inspired by Indian, Mexican and Egyptian cooking',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-06',
  editorialNotes: 'One canonical guide showing how an overlapping shopping list can produce varied dinners inspired by three cuisines, with transparent Tesco guide prices and food-safety guidance.',
  internalLinks: ['/guides', '/recipes', '/food-costs/cooking-with-pulses-on-a-budget', '/food-costs/portion-planning-and-food-waste', '/food-costs/five-dinners-same-ingredients', '/pricing-methodology', '/food-safety', '/signin'],
  disclosures: ['price_estimate', 'price_comparison', 'serving_assumption', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food',
    },
    {
      label: 'Food Standards Agency: Home food fact checker',
      url: 'https://www.food.gov.uk/safety-hygiene/home-food-fact-checker',
    },
  ],
  faqs: [
    {
      question: 'Can budget cooking still produce varied dinners?',
      answer: 'Yes. The nine examples use overlapping ingredients but change the spice mix, texture and way the dinner is served. Dal, tacos, ful medames and koshari do not eat alike even when they share onions, pulses, rice or tomatoes.',
    },
    {
      question: 'What ingredients are used most often?',
      answer: 'Onions and garlic form the base of nearly all nine dinners. Tinned tomatoes, rice, pulses, potatoes, eggs and a small group of spices also recur across the list.',
    },
    {
      question: 'Are these traditional versions of the dishes?',
      answer: 'No. They are home-style or inspired adaptations for a UK cupboard. The guide identifies where a substitution or simplified method changes the dish rather than presenting it as a definitive version.',
    },
    {
      question: 'How should cooked rice be stored?',
      answer: 'Cool cooked rice as quickly as possible, ideally within one hour, then cover and refrigerate it. Use it within 24 hours, reheat it only once and make sure it is steaming hot throughout before serving.',
    },
    {
      question: 'Do the price figures include every ingredient?',
      answer: 'They cover the main ingredients listed for each dinner. Oil and salt are assumed to be in the cupboard, while rice, bread and tortillas are included only where the dinner fact line says so. The named products and price-check date are set out in the costing methodology.',
    },
  ],
};

export interface NineBudgetDinnersThreeCuisinesGuideSection {
  title?: string;
  paragraphs: string[];
}

export const NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_SECTIONS: NineBudgetDinnersThreeCuisinesGuideSection[] = [
  {
    paragraphs: [
      'Keeping food costs down does not have to mean eating the same few dishes on repeat. An overlapping shopping list of tinned pulses, rice, potatoes, eggs, vegetables and a handful of everyday spices can still produce dinners that taste genuinely different across the week. This guide sets out nine such dinners: three home-style Indian dinners, three Mexican-inspired dinners and three Egyptian-inspired dinners, built from ingredients most UK supermarkets already stock. None is presented as the definitive version of a national dish. Each is adapted for a UK cupboard, with substitutions suggested where an ingredient may be harder to find and the adaptation explained in the text.',
      'The aim is variety without a long shopping list. Onions, garlic, tinned tomatoes, tinned pulses, rice, eggs and a small spice collection cover most of what follows. The section on making these ingredients go further sets out what a full run of all nine actually uses, and what that means for the packs you would need to buy.',
    ],
  },
  {
    title: 'Cuisines',
    paragraphs: [],
  },
  {
    title: 'Budget Indian dinners',
    paragraphs: ['Three dinners built on lentils, chickpeas and vegetables, spiced simply rather than from a long ingredient list.'],
  },
  {
    title: '1. Home-style dal with rice or flatbreads',
    paragraphs: [
      'Serves 4 · about 35 minutes · around 35p per serving before rice or bread',
      '200g red split lentils, 1 onion, 2 garlic cloves, thumb-sized piece of ginger, ½ x 400g tin tomatoes, 1 tsp each cumin and turmeric',
      'To cook: soften the onion and garlic in a little oil over a medium hob heat for 3 to 4 minutes, stir in the ginger, cumin and turmeric for a minute, then add the lentils and tomatoes with about 600ml water. Simmer uncovered for 20 to 25 minutes, stirring occasionally, until the lentils have broken down and the dal is thick enough to coat the back of a spoon.',
      'This is a simple dal, red split lentils simmered until soft with onion, garlic and a little grated or frozen ginger. Dal has many regional variations, and this one uses a single lentil rather than a mix. Yellow split peas can be used instead of red lentils, and jarred or frozen chopped ginger and garlic are practical swaps for fresh. The dal can be made a day ahead, since the flavour rounds out overnight, and it freezes well in portions for a couple of months. Extra dal makes a good base for a vegetable soup, or can be stirred through cooked rice for a quick second dinner.',
    ],
  },
  {
    title: '2. Chana masala with rice or flatbreads',
    paragraphs: [
      'Serves 4 · about 30 minutes · around 35p per serving before rice or bread',
      '2 x 400g tins chickpeas, drained, 1 onion, 2 garlic cloves, 400g tin tomatoes, 1 tsp each cumin and ground coriander, 1 tsp garam masala or curry powder',
      'To cook: fry the onion and garlic in oil over a medium hob heat until soft, about 5 minutes, then add the spices and cook for a further minute. Stir in the tomatoes and chickpeas with a splash of water and simmer for 15 to 20 minutes, until the sauce has thickened and coats the chickpeas rather than pooling around them.',
      'Chana masala is a home-style chickpea curry from North India, with tinned chickpeas simmered in a spiced onion and tomato sauce until they take on the flavour. Tinned butter beans can be used in place of chickpeas, and shop-bought curry powder covers most of what garam masala adds if it is not already in the cupboard, though the result tends to read as flatter rather than equivalent. The tomato and onion base can be made ahead and the chickpeas stirred in when reheating. The finished dish freezes well. Keep unfrozen leftovers in the fridge and eat within 48 hours. Leftovers are good spooned into a wrap or over a jacket potato, rather than served the same way twice.',
    ],
  },
  {
    title: '3. Aloo gobi-inspired potato and vegetable dish',
    paragraphs: [
      'Serves 4 · about 35 minutes · around 45p per serving, using a whole cauliflower',
      '600g potatoes, 1 cauliflower (or 450g frozen cauliflower florets), 1 onion, 2 garlic cloves, 1 tsp turmeric, 1 tsp cumin or mustard seed',
      'To cook: fry the onion and garlic in oil over a medium hob heat for 3 to 4 minutes, stir in the turmeric and cumin or mustard seed, then add the potato and cauliflower with a small splash of water. Cover and cook for 20 to 25 minutes, stirring occasionally, until the potato is tender when tested with a knife and lightly golden at the edges.',
      'A simplified take on aloo gobi, diced potato and cauliflower cooked slowly with turmeric and cumin, or mustard seed if there is some in, until tender. Frozen cauliflower florets work as well as fresh here, and any other vegetable that needs using up, such as peas or green beans, can go in alongside. The potato can be parboiled in advance to shorten the final cooking time. Unlike the other two Indian dinners here, this one suits the fridge better than the freezer, since potato can turn watery once frozen and thawed, but it reheats well if eaten within 48 hours. Any extra is a useful base to bulk out with a tin of chickpeas for a slightly different dinner later in the week.',
    ],
  },
  {
    title: 'Budget Mexican-inspired dinners',
    paragraphs: ['Three dinners that lean on tinned beans, potatoes and eggs, spiced with cumin, paprika and chilli rather than a long list of specialist ingredients.'],
  },
  {
    title: '4. Bean chilli with rice',
    paragraphs: [
      'Serves 4 · about 35 minutes · around 35p per serving with kidney beans, or around 40p with black beans, before rice',
      '2 x 400g tins kidney or black beans, drained, 1 onion, 2 garlic cloves, 400g tin tomatoes, 1 tsp cumin, 1 tsp paprika, ½ tsp chilli powder',
      'To cook: fry the onion and garlic in oil over a medium hob heat until soft, about 5 minutes, stir in the spices for a minute, then add the tomatoes and beans. Simmer uncovered for 20 to 25 minutes, until the sauce has thickened and reduced by about a third.',
      'A home-style bean chilli, tinned kidney or black beans simmered in a warmly spiced tomato sauce with onion and garlic. Any tinned bean works here, and a spoonful of smoked paprika is a good addition if it is to hand. The chilli freezes and reheats very well, and the spicing tends to settle and round out if it is left overnight and reheated the next day. Refrigerate and use within 48 hours if it is not being frozen. Leftovers are just as good over a baked potato or spooned into a tortilla as a taco filling, rather than reheated exactly the same way twice.',
    ],
  },
  {
    title: '5. Potato and bean tacos',
    paragraphs: [
      'Serves 4, two tacos each · about 35 minutes · around 45p per serving, tortillas included',
      '500g potatoes, 400g tin kidney beans, drained, 1 onion, 1 tsp cumin, 1 tsp paprika, 8 tortillas',
      'To cook: soften the diced onion in oil over a medium hob heat for 3 to 4 minutes, then add the diced potato and fry over medium-high heat for 12 to 15 minutes, turning occasionally, until golden and cooked through. Stir in the spices and beans for a final 2 to 3 minutes to warm through. Warm the tortillas in a dry pan or a low oven for a couple of minutes before filling.',
      'Diced potato, onion and tinned beans, fried until golden and spiced with cumin and paprika, folded into warmed tortillas with whatever salad or salsa is to hand. A soft flatbread can be used instead of a tortilla, and any tinned bean can replace the kidney beans specified, though black beans cost a little more per tin than kidney beans do. The potato and bean filling can be cooked in advance and reheated in a dry pan before serving, which makes this a sensible option for a night with limited time. Extra filling is just as good spooned over rice or piled onto a jacket potato as it is folded into another tortilla.',
    ],
  },
  {
    title: '6. Mexican-style eggs with beans and tortillas',
    paragraphs: [
      'Serves 4 · about 25 minutes · around 70p per serving, tortillas included',
      '4 eggs, 400g tin tomatoes, 400g tin black beans, drained, 1 onion, 2 garlic cloves, 1 tsp cumin, 8 tortillas',
      'To cook: simmer the onion, garlic, tomatoes, cumin and beans in a pan over a medium hob heat for 10 to 12 minutes, until thickened, then set aside and keep warm. Fry or gently poach the eggs separately until the white is set and the yolk is still soft, then build each plate on a warmed tortilla.',
      'A stove-top take on huevos rancheros, with a fried egg on a tortilla and sauce spooned over rather than the egg poached directly in the sauce, which is closer to how the dish is commonly served than a fully poached version would be. Chilli flakes can replace fresh chilli, and any tinned bean can be used in place of black beans. The bean and tomato base can be made in advance and kept in the fridge for up to 48 hours, with the eggs cooked fresh when reheating, since eggs are best cooked just before serving rather than reheated from cold. This sits among the pricier dinners here, since eggs and a full pack of tortillas both go into the cost, but any leftover sauce on its own freezes well and can be reheated with fresh eggs added on another night.',
    ],
  },
  {
    title: 'Budget Egyptian-inspired dinners',
    paragraphs: ['Three dinners that draw on tinned pulses, rice and eggs, common ingredients in Egyptian home cooking and easy to adapt for a UK cupboard.'],
  },
  {
    title: '7. Ful medames with bread and salad',
    paragraphs: [
      'Serves 4 · about 20 minutes · around 60p per serving before bread',
      '2 x 300g tins broad (fava) beans, drained, 2 garlic cloves, ½ lemon, 1 tsp cumin, olive oil, 1 salad tomato and ¼ cucumber, sliced',
      'To cook: warm the beans through in a pan over a low to medium hob heat for 5 to 8 minutes, then drain, keeping a little of the liquid back. Roughly mash with a fork, garlic, lemon juice, cumin and olive oil, loosening with the reserved liquid if it seems dry.',
      'A practical version of ful medames, a widely eaten Egyptian dish of stewed fava beans, mashed with garlic, lemon juice, cumin and a little olive oil, served with flatbread and a simple tomato and cucumber salad. Fava beans cost more per tin than most other tinned pulses in this guide, which is most of why this dinner is pricier than the others despite the short ingredient list. Tinned butter beans are a workable alternative where fava beans are harder to find, and bottled lemon juice can be used instead of fresh, though both move the dish away from the version most commonly eaten in Egypt rather than standing in for it exactly. The mash keeps for up to two days in the fridge, covered, and the flavour holds up well over that time, so it is a sensible thing to make slightly ahead. Extra ful is good the next day as a sandwich filling or spread over a jacket potato.',
    ],
  },
  {
    title: '8. Koshari-inspired rice, lentils and pasta',
    paragraphs: [
      'Serves 4 · about 45 minutes · around 45p per serving',
      '150g rice, 100g brown or red lentils, 100g small pasta, 400g tin chickpeas, drained, 400g tin tomatoes, 1 onion, 2 garlic cloves, 1 tsp cumin, splash of vinegar',
      'To cook: cook the rice, lentils and pasta separately until tender, following pack instructions for the rice and pasta and allowing about 20 to 25 minutes for brown or red lentils. Meanwhile, fry the onion and garlic in oil over a medium hob heat, add the tomatoes, cumin and a splash of vinegar, and simmer for 10 minutes to make the sauce, stirring the chickpeas through it for the final few minutes to warm through. Layer the rice, lentils, pasta and chickpea sauce in a bowl to serve.',
      'Koshari is a well-known Egyptian dish combining rice, lentils, pasta and chickpeas, served with a spiced, vinegar-sharpened tomato sauce. Chickpeas are a standard part of koshari rather than an optional extra, so this version keeps them in rather than treating them as a stretch ingredient. Red split lentils cook faster than the brown or green lentils used traditionally and can stand in for them, though they break down more readily and change the texture of the finished dish rather than replicating it. The rice, lentils, pasta and chickpeas can each be cooked ahead and combined just before serving, which spreads the cooking out over less rushed pockets of time, and this is one of the better dinners here for making in a larger batch. Because it contains rice, leftovers should follow the rice guidance below: cool them quickly, refrigerate and eat within 24 hours, reheating only once, with an extra spoonful of the tomato sauce to loosen everything back up.',
    ],
  },
  {
    title: '9. Egyptian-inspired tomato and pepper eggs',
    paragraphs: [
      'Serves 4 · about 20 minutes · around 70p per serving before bread',
      '4 eggs, 400g tin tomatoes, 2 peppers (or 300g frozen sliced peppers), 1 onion, 2 garlic cloves, 1 tsp cumin, 1 tsp paprika',
      'To cook: soften the onion, garlic and peppers in oil over a medium hob heat for 6 to 8 minutes, add the tomatoes and spices, and simmer for 10 minutes until slightly reduced. Make small wells in the sauce, crack in the eggs, cover the pan and cook for 5 to 8 minutes until the whites are set and the yolks are as firm as you prefer.',
      'Eggs cooked into a spiced tomato and pepper sauce until just set, in a style found across Egyptian home cooking as well as elsewhere in the region, served with bread for mopping up the sauce. This version adds peppers, which are not always part of simpler Egyptian tomato and egg dishes, so it sits closer to a shared regional style than to one specific traditional recipe. A bag of frozen sliced peppers can be used instead of fresh, and chilli flakes stand in for fresh chilli if extra heat is wanted. The tomato and pepper sauce can be made ahead and kept in the fridge for up to 48 hours, with the eggs added fresh when it is reheated. Any leftover sauce on its own freezes well, ready for eggs to be added on a night when there is little time to cook from scratch.',
    ],
  },
  {
    title: 'A note on rice and leftovers',
    paragraphs: [
      "Two of these dinners, the dal and the bean chilli, are often served with rice, and rice is a central part of the koshari itself. The Food Standards Agency's food safety guidance covers rice specifically, separately from its general advice on leftovers: cool cooked rice as quickly as possible, ideally within one hour, then cover it, refrigerate it and use it within 24 hours. Rice should only be reheated once and should be steaming hot throughout before serving. Other leftovers should be cooled and refrigerated within two hours, eaten within 48 hours or frozen. Rice needs closer attention to cooling time than most other leftovers, which is why the guidance treats it separately.",
      'Sources: Food Standards Agency, Cooking your food, and the rice guidance in the Home food fact checker.',
    ],
  },
  {
    title: 'Making budget ingredients go further',
    paragraphs: [
      'A handful of ingredients turn up again and again across these nine dinners. Onions and garlic form the base of nearly all of them. Tinned tomatoes appear in six of the nine, in full or half tins. Rice supports the dal, the bean chilli and the koshari. Pulses, tinned or dried, give bulk and protein to seven of the nine: tinned chickpeas or beans in six of them, and dried red split lentils in two. Eggs cover two of the dishes, and flatbreads or tortillas turn up wherever a dinner is designed for scooping or wrapping rather than eating with a fork.',
      'Across the nine dinners, the ingredients actually used add up to 8 onions, 16 garlic cloves, 5½ tins of tomatoes, 3 tins of chickpeas, 4 tins of kidney or black beans, 2 tins of broad (fava) beans, 300g dried red split lentils, 1.1kg potatoes, 8 eggs, 16 tortillas, 1 cauliflower, 2 peppers and 100g small pasta. Buying to that exactly is not realistic, since tins, packs and loose vegetables come in fixed sizes, so the shopping list runs a little ahead of what gets used:',
      '6 x 400g tins tomatoes, to cover 5½ used (a half tin left over)\n3 x 400g tins chickpeas and 4 x 400g tins kidney or black beans (2 for the bean chilli, 1 for the tacos, 1 for the eggs), bought exactly to the tin\n2 x 300g tins broad (fava) beans for the ful medames, bought exactly to the tin\n1 x 500g pack dried red split lentils, to cover 300g used across the dal and the koshari\n2 garlic bulbs, to cover 16 cloves needed (roughly 2 cloves spare)\n1 x 2kg pack potatoes, to cover 1.1kg used\n2 x 6-packs eggs, to cover 8 used (4 spare)\n2 x 8-packs tortillas, used exactly\n1 cauliflower, 1 x 3-pack peppers (1 spare), 1 x 500g pack small pasta (400g spare)',
      'Rice and bread are not included in the per-serving figures above except where stated. Where the dal and the bean chilli are served with rice, this guide assumes a standard 75g dry rice per person, or 300g for four servings; across those two dinners plus the 150g used directly in the koshari, that comes to 750g of rice, from a single 1kg pack. Flatbread, naan or pitta served alongside the dal, the ful medames or the Egyptian-inspired eggs is costed separately by whatever bread is chosen, and is not included above.',
      'On seasoning, cumin does more work across this list than anything else, appearing in some form in all three cuisines. A basic set of ground cumin, ground coriander, paprika and chilli powder or flakes covers most of what these nine dinners need, and none of them assumes a full spice cupboard is already sitting in the kitchen. Garam masala adds something distinct to the chana masala, but shop-bought curry powder is a practical stand-in, and smoked paprika is worth adding to the bean chilli if it is to hand rather than something the recipe already assumes.',
    ],
  },
  {
    title: 'Costing methodology',
    paragraphs: [
      'Guide prices are named against a specific Tesco product and pack, checked online on 6 August 2026. Where the lowest-priced widely available line was out of stock at the time of checking, the next lowest-priced in-stock line is used instead.',
      'Tesco Red Split Lentils 500G: £2.10 (£4.20/kg)\nGrower\'s Harvest Long Grain Rice 1Kg: £0.52 (£0.52/kg)\nGrower\'s Harvest Chopped Tomatoes 400G: £0.43\nTesco Chickpeas In Water 400G: £0.41\nGrower\'s Harvest Red Kidney Beans In Water 400G: £0.33\nTesco Black Beans 400G: £0.46\nTesco Broad Beans In Water 300G: £0.90\nTesco 6 Mixed Weight Barn Eggs 268g: £1.00\nH.W. Nevills Plain White Tortilla Wraps 8 Pack: £0.99\nTesco All Rounder Potatoes 2Kg: £1.32 (£0.66/kg)\nTesco Cauliflower Each: £1.15\nTesco Sweet Peppers 500G (3-pack): £2.10, around 70p per pepper\nTesco Fusilli Pasta 500G: £0.75 (£1.50/kg)\nTesco Brown Onions Loose: £0.99/kg, around 15p per onion\nTesco Large Garlic (1 bulb, around 9 cloves): £0.40, around 9p for 2 cloves\nTesco Whole Cucumber Each: £0.89\nTesco Lemon Each: £0.37\nTesco Root Ginger Loose: £5.50/kg, around 14p for a thumb-sized piece\nTesco Classic Round Tomatoes 6 Pack: £0.99, around 16p per tomato',
      'A splash of vinegar in the koshari, from a bottle otherwise kept in the cupboard, works out at under 1p and is not itemised separately. Figures are per serving, based on four servings per dish unless the fact line says otherwise, and cover the main ingredients only. Oil and salt are assumed to already be in the cupboard and are not costed. Rice, bread or tortillas served alongside a dinner are included in the figure only where the fact line says so, and the rice assumption is set out above. Prices vary by retailer, pack size, offers and stock availability, so these are guide figures rather than a fixed cost, and are worth rechecking close to publication.',
    ],
  },
  {
    title: 'How the nine dinners compare',
    paragraphs: [
      'Despite the overlap in ingredients, these nine dinners do not taste or eat alike. The dal is soft and mellow, built for spooning over rice. The chana masala and the aloo gobi-inspired dish both lean toward warming spice, one saucy and one drier, with the potato dish holding its shape rather than breaking down. The bean chilli is warmly spiced and thick, closer in texture to a stew, while the potato and bean tacos are designed for eating with the hands, and the Mexican-style eggs sit somewhere between the two, a fried egg and a spooned sauce meant to be scooped up with tortilla rather than piled onto a plate. The ful medames is mashed and spreadable, eaten cool or just warm rather than hot from the pan, koshari is a layered, textured dish that mixes soft rice and lentils with bite from the pasta and chickpeas, and the Egyptian-inspired eggs are closer in style to the Mexican version but carry a different balance of spice, leaning on pepper and cumin rather than chilli heat.',
    ],
  },
];

export function getNineBudgetDinnersThreeCuisinesGuideJsonLd() {
  const guide = NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE;
  const url = `https://dinnerbydesign.app${NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: guide.reviewedAt,
        author: { '@type': 'Organization', name: guide.editorialOwner },
        publisher: { '@type': 'Organization', name: 'DinnerByDesign', url: 'https://dinnerbydesign.app/' },
        mainEntityOfPage: url,
        citation: guide.sources.map(source => source.url),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: guide.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DinnerByDesign', item: 'https://dinnerbydesign.app/' },
          { '@type': 'ListItem', position: 2, name: 'Recipes and cooking ideas', item: 'https://dinnerbydesign.app/recipes' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderNineBudgetDinnersThreeCuisinesGuideInitialHtml() {
  const guide = NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_DISCLOSURE_FOOTER);
  const sections = NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE_SECTIONS.map(section => {
    const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
    const paragraphs = section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`).join('');
    return `<section>${heading}${paragraphs}</section>`;
  }).join('');
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/recipes">Recipes and cooking ideas</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 6 August 2026 · Last reviewed 6 August 2026</p><article>${sections}${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find dinners for tonight</h2><p>Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.</p><p><a href="/signin">Find dinners</a></p></section></main></div>`;
}
