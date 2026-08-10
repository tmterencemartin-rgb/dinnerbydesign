import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem, ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH = '/guides/nine-budget-dinners-with-savoury-pies';

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  { key: 'price_comparison', title: 'A note on budget wording', body: 'This guide uses no live retailer prices or fixed savings. What each dinner costs depends on current prices, the ingredients already at home and the products chosen.' },
  { key: 'storage_and_cooking', title: 'Storage and cooking safety', body: 'Cool, store, freeze and reheat pies and leftovers safely. Follow the linked recipe and current Food Standards Agency guidance, as timings and storage advice vary.' },
  { key: 'allergen_and_product', title: 'Ingredients and allergens', body: 'Pastry, dairy, fish, sausages, stock, sauces and other packaged ingredients vary by product and may contain allergens. Check labels for everyone eating the dinner.' },
  { key: 'source_timing', title: 'Source review', body: 'The recipe and food-safety sources were checked on 9 August 2026. Follow the linked publisher page for the current ingredients, method and timings.' },
];

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'This guide offers source-led dinner ideas rather than complete recipes. Ingredients, cooking instructions, storage advice and allergens vary between products and publishers.',
  links: [{ href: '/guides', label: 'Browse all guides' }, { href: '/food-safety', label: 'Food safety' }],
};

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE = {
  title: 'Nine budget dinners with savoury pies',
  seoTitle: 'Nine budget dinners with savoury pies | DinnerByDesign',
  description: 'Nine savoury pie dinners from established UK recipe sources, with practical ideas for stretching ingredients, using leftovers and choosing budget-friendly toppings.',
  publishedAt: '2026-08-09',
  reviewedAt: '2026-08-09',
  nextReviewAt: '2027-02-09',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find budget dinner ideas using savoury pies',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-09',
  editorialNotes: 'Nine source-led savoury pie dinners with adaptations clearly separated from publisher methods.',
  internalLinks: ['/guides', '/recipes', '/guides/9-budget-dinners-with-beef-or-pork-mince', '/guides/9-budget-dinners-with-leftover-roast-chicken', '/guides/nine-budget-dinners-with-potatoes', '/guides/nine-budget-dinners-with-tinned-vegetables', '/guides/seven-ways-to-make-meat-go-further', '/food-safety', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Seven veg cottage pie, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/seven-veg-cottage-pie.html' },
    { label: 'Chip shop fish pie, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/chip-shop-fish-pie.html' },
    { label: 'Chicken and leek pot pies, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/chicken-and-leek-pot-pies.html' },
    { label: 'Cowboy pie, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/cowboy-pie.html' },
    { label: "Lentil shepherd's pie with garlic and herb mash, Tesco Real Food", url: 'https://realfood.tesco.com/recipes/lentil-shepherds-pie-with-garlic-and-herb-mash.html' },
    { label: 'Creamy mushroom pot pie, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/creamy-mushroom-pot-pie.html' },
    { label: 'Melting cheese and onion pie, Olive magazine', url: 'https://www.olivemagazine.com/recipes/vegetarian/melting-cheese-and-onion-pie/' },
    { label: 'Chicken, tarragon and mushroom pies, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/chicken-tarragon-and-mushroom-pies.html' },
    { label: 'Corned beef pie, Tesco Real Food', url: 'https://realfood.tesco.com/recipes/corned-beef-pie.html' },
    { label: 'Cooking your food, Food Standards Agency', url: 'https://www.food.gov.uk/safety-hygiene/cooking-your-food' },
  ],
  faqs: [
    { question: 'Can savoury pies help with budget cooking?', answer: 'They can, when the filling and topping are chosen carefully. A pie can stretch smaller amounts of meat, fish, vegetables or pulses into a fuller dinner without relying on a large centrepiece ingredient.' },
    { question: 'Do all savoury pies need pastry?', answer: 'No. Mash, sliced potato, puff pastry, shortcrust pastry, filo and crumble-style toppings can all work, depending on the filling and what is already in the kitchen.' },
    { question: 'Can I freeze savoury pies?', answer: 'Some source recipes are marked freezable and some give specific freezing or reheating instructions. Follow the linked publisher guidance for the individual recipe, and use current Food Standards Agency advice for safe storage and reheating.' },
    { question: 'Are pies always lower cost than other dinners?', answer: 'No. The cost depends on the filling, topping, pack sizes and what is already at home. The useful point is that pies give small amounts of protein, vegetables or pulses somewhere practical to go.' },
  ],
};

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_SECTIONS: PublicGuideSection[] = [
  { paragraphs: [
    'A pie is a shape more than a recipe. That is worth remembering when the freezer holds half a bag of mince, two tins of beans and the end of a block of cheese. Wrapped in mash, pastry, filo or a scattering of oats, small amounts of meat, fish, vegetables or pulses go further than they would sitting on a plate on their own.',
    'None of this is about occasion baking or a from-scratch shortcrust every night. It is about treating a pie as a practical dinner format: a way to stretch what is already in, use up odds and ends, and end up with something that still feels like a proper dinner rather than a compromise.',
    'The nine dinners below come from established UK food publishers, each verified and linked. Every one uses a topping that suits a weekday budget: mash, sliced potato, puff or shortcrust pastry, or a simple pastry lid. Where a swap comes directly from the recipe, it is presented as the publisher\'s own suggestion. Where it does not, it is labelled below as an adaptation rather than something the source recommends.',
  ] },
  { title: '1. Cottage pie, stretched with lentils', paragraphs: [
    'Tesco Real Food\'s seven veg cottage pie takes a single 250g pack of mince and pads it out with tinned green lentils and blitzed chestnut mushrooms, so a small amount of meat covers four dinners rather than two or three. The root vegetable and spinach layers use up whatever is soft in the vegetable drawer, and the soft cheese folded through the mash means a little goes further than a block of butter alone.',
    'The soy sauce and Worcestershire sauce are both listed as optional extras in the recipe itself, so a store cupboard without either is not a barrier. Adaptation, not from the source: any mushroom variety should blitz down in the same way as the chestnut mushrooms specified, if that is what is available.',
    'The recipe carries a freezable tag, so it suits batch cooking: make a double portion and freeze half before baking, or freeze the finished pie in portions for later in the week.',
  ] },
  { title: '2. Fish pie topped with frozen chips', paragraphs: [
    'Tesco Real Food\'s chip shop fish pie swaps the usual mashed potato topping for frozen oven chips, which removes the peeling and boiling stage and uses a bag that is likely already in the freezer. The filling is built from a standard frozen fish pie mix plus a small amount of salmon, bulked out with frozen peas, so there is no need to buy several types of fresh fish.',
    'The recipe itself suggests using white onions or leeks in place of spring onions, adjusting the quantity to suit. A jar of white lasagne sauce stands in for a homemade white sauce, which keeps the method to one dish and limited washing up.',
    'No freezing guidance is given for this particular dish, so it is best treated as a same-week dinner rather than a batch-and-freeze option.',
  ] },
  { title: '3. Chicken and leek pot pies', paragraphs: [
    'A single 258g pack of chicken breast fillets is enough for four individual Tesco Real Food chicken and leek pot pies once mixed with a cream and mustard sauce and half a pack of leeks. That keeps the meat cost down while still giving each portion a reasonable amount of filling. Shop-bought ready-rolled pastry means there is no pastry-making stage to build into an evening.',
    'The recipe itself notes that spring onions or white onions can replace the leeks if needed. The recipe carries a freezable tag, though it does not give specific reheating or defrosting guidance beyond that.',
  ] },
  { title: '4. Sausage and bean pie', paragraphs: [
    'Tesco Real Food\'s cowboy pie is built from frozen sausages, two tins of baked beans and frozen mashed potato, so it is close to a store cupboard dinner already. The tinned beans do double duty as both protein and sauce, so there is no separate gravy to make, and the mash topping comes from the freezer rather than a bag of fresh potatoes.',
    'The recipe suggests any hard cheese in place of Cheddar if that is what is available. It does not carry a freezing tag, so it reads as a cook-and-eat dinner rather than one to batch ahead.',
  ] },
  { title: "5. Lentil shepherd's pie", paragraphs: [
    'Tesco Real Food\'s lentil shepherd\'s pie with garlic and herb mash is a fully meat-free take on shepherd\'s pie, built from four tins of green lentils, a tin of chopped tomatoes and a vegetable stock pot rather than any mince substitute. It is a useful one for a week where the meat budget is going elsewhere, and the ragu makes considerably more than the pie itself needs.',
    'The recipe\'s own tip is to set aside half the ragu to use later in a lentil keema curry, effectively turning one cooking session into two separate dinners. Adaptation, not from the source: if the garlic and herb soft cheese specified for the mash is not available, a plain soft cheese with a little crushed garlic stirred through would follow the same principle, though this has not been tested against the recipe.',
  ] },
  { title: '6. Vegetable pot pie', paragraphs: [
    'Described by Tesco Real Food as a five-ingredient dinner, creamy mushroom pot pie leans entirely on the freezer and store cupboard: a frozen vegetable base mix, frozen mushrooms, a tin of condensed mushroom soup standing in for a homemade sauce, and ready-rolled puff pastry. A frozen bean and pea mix is served alongside rather than folded in, which keeps the main filling simple.',
    'Because the sauce comes from a tin rather than a roux, there is no butter, flour and stock to balance, and the whole dinner can be built without any fresh vegetables at all if the freezer is better stocked than the fridge.',
  ] },
  { title: '7. Cheese, onion and potato pie', paragraphs: [
    'Olive magazine\'s melting cheese and onion pie is built almost entirely from onions cooked down to a soft puree, with floury potatoes added in slices rather than mashed, so it uses a fairly small amount of cheese for the number of portions it makes. Lancashire cheese is specified alongside a smaller amount of mature Cheddar. Adaptation, not from the source: another crumbly or well-flavoured hard cheese may work on the same principle if Lancashire is not stocked locally, though the recipe itself does not suggest this.',
    'At eight servings from one pie, this is one of the better dinners here for splitting across two evenings or freezing the second half. The recipe gives explicit freezing and reheating instructions: cool completely, then freeze, defrost overnight in the fridge, and reheat until piping hot.',
  ] },
  { title: '8. Leftover chicken pie', paragraphs: [
    'Tesco Real Food\'s chicken, tarragon and mushroom pies are written specifically around leftover roast chicken. The recipe uses 300g of already-cooked meat rather than raw chicken, which is roughly what is left after a Sunday roast for two or three people. Chestnut mushrooms and frozen peas round out the filling, so a modest amount of chicken still fills four individual pie dishes.',
    'This is one of the more direct answers to the question of what to do with a chicken carcass and a bowl of cold meat once the initial roast dinner is done, rather than reheating the same dinner a second time. The freezable tag and full freezing instructions make it suitable for batching: freeze the assembled pies unbaked, or freeze once cooked and reheat from frozen until piping hot.',
  ] },
  { title: '9. Corned beef pie', paragraphs: [
    'Tesco Real Food\'s corned beef pie is built from a single tin of corned beef and leans on a mix of fresh and frozen vegetables to fill it out: onions, leek and carrot in the filling, and frozen peas with sliced Savoy cabbage served alongside. It is still a largely store-cupboard dinner, since the tinned corned beef is doing the main work, but it draws on more of the vegetable drawer and freezer than some of the other dinners here. Ready-rolled shortcrust pastry sits on top rather than a mash lid, which keeps the method to one pan and one baking step.',
    'The recipe itself suggests spring or white onions in place of leek if needed. It is not written with a potato topping. Adaptation, not from the source: for a more traditional corned beef and potato pie, a layer of thinly sliced or diced potato could be added to the filling before the pastry goes on, following the same ordinary logic used in older regional versions of this dish. This is a suggested variation rather than part of the Tesco recipe, and has not been tested against it. This recipe does not carry freezing guidance, so it is best treated as a cook-and-eat dinner.',
  ] },
  { title: 'Choosing a topping, and not wasting what is left', paragraphs: [
    'The topping is usually the easiest place to adjust a pie to what is actually in the kitchen. Mash suits a fridge with soft or slightly tired potatoes that need using rather than serving whole. Sliced potato works well when there are just one or two left over from another dinner. Pastry, fresh or ready-rolled, is the option that needs the least from the fridge and the most from the freezer or store cupboard. Filo and crumble-style toppings, while not covered in the nine dinners above, are worth keeping in mind for the same reason: they use small amounts of fat and can sit on top of almost any filling below.',
    'None of this makes pies automatically less expensive, healthier or quicker than any other dinner. What it does is give small amounts of protein, vegetables or pulses somewhere useful to go, rather than sitting half-used in the fridge until they are thrown out. Starting from what is already in, rather than a shopping list, is usually where the saving actually comes from.',
  ], relatedLink: { label: 'Browse the guides library', url: '/guides' } },
];

export const NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD: PublicGuideRecord = {
  id: 'nine-budget-dinners-with-savoury-pies',
  slug: 'nine-budget-dinners-with-savoury-pies',
  path: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
  canonicalPath: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  ...NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE,
  metaDescription: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE.description,
  label: 'Practical cooking guide',
  disclosureItems: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURES,
  disclosureFooter: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_DISCLOSURE_FOOTER,
  sections: NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_SECTIONS,
  cta: {
    title: 'Find dinners for tonight',
    copy: 'Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household.',
    label: 'Find dinners',
    href: '/signin',
  },
};

export function getNineBudgetDinnersWithSavouryPiesGuideJsonLd() {
  return getPublicGuideJsonLd(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD);
}

export function renderNineBudgetDinnersWithSavouryPiesGuideInitialHtml() {
  return renderPublicGuideInitialHtml(NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE_RECORD);
}
