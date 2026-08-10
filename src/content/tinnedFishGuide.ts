import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  TINNED_FISH_GUIDE_DISCLOSURES,
  TINNED_FISH_GUIDE_DISCLOSURE_FOOTER,
} from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const TINNED_FISH_GUIDE_PATH = '/guides/tinned-fish-recipes-tuna-salmon-sardines';

export const TINNED_FISH_GUIDE = {
  title: 'Tinned fish recipes: easy dinner ideas with tuna, salmon, sardines and more',
  seoTitle: 'Tinned fish recipes and dinner ideas | DinnerByDesign',
  description: 'Practical tinned fish recipes and dinner ideas using tuna, salmon, sardines, pilchards, mackerel, crab, mussels, cockles and winkles.',
  publishedAt: '2026-07-28',
  reviewedAt: '2026-07-28',
  nextReviewAt: '2027-01-28',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find practical dinner ideas using tinned fish and preserved seafood',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-28',
  editorialNotes: 'Separates fish, crustacean and mollusc products; uses no fixed product timings or unsupported health comparisons.',
  internalLinks: [
    '/recipes',
    '/guides/fish-finger-fishcake-scampi-dinner-ideas',
    '/food-costs/cooking-with-pulses-on-a-budget',
    '/food-costs/portion-planning-and-food-waste',
    '/food-safety',
    '/recipe-methodology',
    '/signin',
  ],
  disclosures: [
    'allergen_and_product',
    'storage_and_cooking',
    'source_timing',
  ] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'NHS: Fish and shellfish',
      url: 'https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/',
    },
    {
      label: 'Food Standards Agency: Allergen guidance',
      url: 'https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses',
    },
    {
      label: 'Food Standards Agency: Canned food safety',
      url: 'https://www.food.gov.uk/print/pdf/node/4286',
    },
    {
      label: 'Princes: Canned tuna range',
      url: 'https://www.princes.co.uk/product-categories/tuna-chunks/',
    },
    {
      label: 'UK legislation archive: Preserved sardine marketing standards',
      url: 'https://www.legislation.gov.uk/eur/1989/2136/pdfs/eur_19892136_2003-07-01_en.pdf',
    },
  ],
  faqs: [
    {
      question: 'Does tinned tuna count as oily fish?',
      answer: 'No. NHS guidance says that neither fresh nor tinned tuna counts as oily fish.',
    },
    {
      question: 'Are sardines and pilchards the same fish?',
      answer: 'The names overlap, but the answer depends on the product. Preserved sardines and sardine-type products can come from several related species, so read the species and description on the label rather than relying on size.',
    },
    {
      question: 'Can you eat the bones in tinned salmon or sardines?',
      answer: 'Yes. The NHS lists the soft bones in tinned salmon, sardines and pilchards as edible and notes that they provide calcium and phosphorus. They can still be removed if preferred.',
    },
    {
      question: 'Should I drain tinned fish?',
      answer: 'It depends on the dish and the packing liquid. Drain brine when it would make the dish too salty; keep some tomato sauce when it forms part of the recipe. Check whether the nutrition panel is given for the drained product.',
    },
    {
      question: 'Are anchovies the same as sardines?',
      answer: 'No. They are different fish and have different flavours and uses, even though both are sold in small tins or jars.',
    },
    {
      question: 'Can tinned mackerel replace fresh mackerel?',
      answer: 'Sometimes. The texture, salt and sauce can change the dish, so it works better in recipes that welcome those differences than as an automatic swap.',
    },
    {
      question: 'Can leftovers stay in the opened tin?',
      answer: 'No. Transfer them to a covered container, refrigerate them and follow the storage period on the manufacturer’s label.',
    },
  ],
};

export const TINNED_FISH_GUIDE_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>A tin of tuna, salmon, sardines or mackerel can do more than fill a sandwich. Add a carbohydrate, something fresh or frozen from the vegetable drawer, and one strong flavouring, and the cupboard tin becomes the starting point for dinner.</em></p><p>The detail on the label matters. Packing liquid, drained weight, salt, bones and allergens vary between products, even when the name on the front looks similar. Use these ideas as combinations rather than fixed recipes, then follow the pack and any tested recipe for preparation and cooking.</p></section>
<section><h2>Tinned fish and seafood at a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Product</th><th>Often sold in</th><th>Good dinner partners</th><th>Check the label for</th></tr></thead><tbody><tr><td>Tuna</td><td>Spring water, brine or oil</td><td>White beans, pasta, rice, jacket potatoes, sweetcorn, lemon, chilli</td><td>Drained weight, salt and packing liquid</td></tr><tr><td>Salmon</td><td>Red or pink salmon; liquids vary</td><td>Potatoes, rice, pasta, peas, leeks, lemon, dill, capers</td><td>Skin and soft edible bones; drained weight</td></tr><tr><td>Sardines and pilchards</td><td>Oil, brine or tomato sauce</td><td>Toast, pasta, potatoes, tomatoes, peppers, lemon, parsley</td><td>Species and product wording; soft edible bones</td></tr><tr><td>Mackerel</td><td>Oil, brine or flavoured sauce</td><td>Potatoes, rice, pasta, beetroot, tomato, mustard, lemon</td><td>Salt, sauce ingredients and drained weight</td></tr><tr><td>Crab</td><td>Brine or dressed products</td><td>Pasta, rice, bread, cucumber, spring onion, chilli, lime</td><td>Crustacean allergen and any added ingredients</td></tr><tr><td>Mussels</td><td>Brine, oil or sauce</td><td>Pasta, rice, bread, tomato, garlic, parsley, chilli</td><td>Mollusc allergen and sauce ingredients</td></tr><tr><td>Cockles and winkles</td><td>Often jarred in vinegar or brine</td><td>Bread, potatoes, rice, salads, spring onion, white pepper</td><td>Mollusc allergen, storage instructions and vinegar</td></tr></tbody></table></div></section>`;

export const TINNED_FISH_GUIDE_IDEAS_HTML = `<section><h2>Tuna</h2><p>Tuna is sold in spring water, brine and oil. Each behaves a little differently once drained, so choose by looking at the full dish rather than treating the tins as interchangeable. Oil-packed tuna can bring some of its own richness; tuna in spring water or brine often needs a dressing, tomatoes or another moist ingredient.</p><h3>Tonno e fagioli</h3><p>Mix drained tuna with white beans, red onion, parsley, lemon and olive oil. The beans make the dish more substantial, while the sharp dressing keeps the tuna from feeling heavy.</p><h3>Tuna Caesar-style salad</h3><p>Add tuna to crisp lettuce, croutons and a Caesar-style dressing. Calling it Caesar-style makes the variation clear and leaves room to adjust the dressing for eggs, anchovies, milk or other allergens.</p><h3>Pasta, jacket potatoes and rice bowls</h3><p>Try tuna with capers and parsley in pasta, with sweetcorn and yoghurt on a jacket potato, or in a rice bowl with spring onion, cucumber and chilli. These combinations also make good use of small amounts of vegetables already in the fridge.</p></section>
<section><h2>Salmon</h2><p>Tinned salmon flakes easily and suits dishes where the fish is mixed through rather than left in large pieces. Some tins contain skin and small bones. The NHS notes that the soft bones in tinned salmon can be eaten and provide calcium and phosphorus, though they can be removed if the texture is unwelcome.</p><h3>Fishcakes</h3><p>Combine drained salmon with mashed potato, herbs and a binder such as beaten egg. Quantities and cooking instructions belong in a tested recipe, particularly when raw egg is used.</p><h3>Creamy pasta</h3><p>Fold flaked salmon through pasta with crème fraîche, lemon, dill and peas. Add the salmon near the end so it stays in flakes rather than disappearing into the sauce.</p><h3>Kedgeree-style rice</h3><p>Rice, curry spices, boiled egg and tinned salmon make a useful kedgeree-style dish. The description matters here: traditional kedgeree is commonly made with smoked fish.</p><h3>Chowder</h3><p>Potato, leek, milk and salmon make a straightforward chowder. Taste before adding salt, especially if the fish was packed in brine.</p></section>
<section><h2>Sardines and pilchards</h2><p>The names overlap in everyday use, but the label is the safest guide to the species and product in front of you. Preserved sardines and sardine-type products can be made from several related species, while UK products labelled pilchards are often sold in tomato sauce. Size alone is not a dependable way to tell one tin from another.</p><h3>Tomato pasta</h3><p>Sardines or pilchards in tomato sauce can be folded through pasta with onion, parsley and lemon. Check the sauce before seasoning because salt and sugar vary by product.</p><h3>Toast and beans</h3><p>Mash sardines onto toast with lemon and black pepper, or serve them with white beans or baked beans. A spoonful of chopped tomato or cucumber cuts through an oil-packed tin.</p><h3>Warm potato salad</h3><p>New potatoes, sardines, green beans and a mustard dressing make a fuller potato salad. Keep the fish in pieces and fold it through last.</p></section>
<section><h2>Mackerel</h2><p>Tinned mackerel has a pronounced flavour, especially when it comes in tomato, mustard or pepper sauce. That makes it useful with ingredients that can stand up to it, including beetroot, horseradish, pickled vegetables and sharp dressings.</p><h3>Pâté and toast</h3><p>Blend drained mackerel with cream cheese, lemon and black pepper, then serve with toast and a crisp salad. Check both the fish and cheese labels for allergens and salt.</p><h3>Warm potato salad</h3><p>Pair flaked mackerel with warm potatoes, beetroot and watercress. Mustard or horseradish adds enough sharpness without hiding the fish.</p><h3>Rice bowls and pasta</h3><p>Use mackerel with rice and pickled vegetables, or fold it through pasta with lemon, chilli and tomatoes. A flavoured tin may already provide most of the sauce.</p></section>`;

export const TINNED_FISH_GUIDE_CLOSING_HTML = `<section><h2>Tinned and jarred shellfish</h2><p>Crab, mussels, cockles and winkles need their own treatment because they fall into different allergen categories from fish. They are also sold in different formats. Crab and mussels may be tinned, while cockles and winkles are often jarred in vinegar or brine.</p><h3>Crab</h3><p>Stir crab through pasta or rice with spring onion, chilli and lime. White and brown crab meat have different flavours, so check which the tin contains before choosing the other ingredients.</p><h3>Mussels</h3><p>Use tinned mussels with tomato, garlic and pasta, or serve them on toast with parsley and lemon. If they come in a flavoured sauce, read the label before adding more salt or fat.</p><h3>Cockles and winkles</h3><p>Their briny or vinegary flavour works best as an accent. Add a small spoonful to potato salad, rice or toast, then taste before adding more vinegar or seasoning.</p></section>
<section><h2>Anchovies as a flavouring</h2><p>Anchovies usually make more sense as a seasoning than as the centre of dinner. Stir a small amount into tomato sauce, a dressing or pasta, then taste before adding salt. Their presence still needs to be declared as fish.</p></section>
<section><h2>Practical handling</h2><p>A few checks make these cupboard ingredients easier to use well.</p><ul><li>Compare drained weight as well as the size of the tin. The liquid can account for a sizeable part of the stated weight.</li><li>Drain according to the dish and the label. Oil, brine and sauce affect flavour and nutrition differently.</li><li>Soft bones in tinned salmon, sardines and pilchards are edible, according to the NHS, but can be removed for texture.</li><li>If only part of a tin is used, transfer the remainder to a covered container, refrigerate it and follow the manufacturer’s open-life instructions. Do not store leftovers in the opened tin.</li><li>Reject tins that are bulging, leaking or badly damaged, and follow any preparation instructions on the label.</li></ul></section>
<section><h2>Allergens and safety</h2><p>Fish, crustaceans and molluscs are three separate regulated allergen categories. Tuna, salmon, sardines, pilchards, mackerel and anchovies are fish; crab is a crustacean; mussels, cockles and winkles are molluscs.</p><p>That classification should not be used to predict what is safe for one person. Anyone with a diagnosed or suspected allergy should follow their medical advice and check every current label. Sauces and dressings can also introduce egg, milk, mustard, sulphites or cereals containing gluten.</p></section>
<section><h2>Nutrition framing</h2><p>The <a href="https://www.nhs.uk/live-well/eat-well/food-types/fish-and-shellfish-nutrition/">NHS recommends</a> at least two portions of fish a week, including one portion of oily fish; a portion is around 140g. Salmon, sardines, pilchards and mackerel count as oily fish. Fresh and tinned tuna do not.</p><p>The NHS gives separate limits for some people, including those who are pregnant or trying for a baby. Product-level claims still need the current nutrition panel because salt, oil, sauce and drained weight differ between tins.</p></section>
<section><h2>Related DinnerByDesign guidance</h2><ul><li><a href="/guides/fish-finger-fishcake-scampi-dinner-ideas">Fish finger, fishcake and scampi dinner ideas</a></li><li><a href="/food-costs/cooking-with-pulses-on-a-budget">Cooking with pulses on a budget</a></li><li><a href="/food-costs/portion-planning-and-food-waste">Portion planning and food waste</a></li><li><a href="/food-safety">Food-safety guidance</a></li><li><a href="/recipe-methodology">Recipe methodology</a></li></ul></section>`;

export const TINNED_FISH_GUIDE_SECTIONS: PublicGuideSection[] = [
  { rawHtml: TINNED_FISH_GUIDE_OPENING_HTML },
  { rawHtml: TINNED_FISH_GUIDE_IDEAS_HTML },
  { rawHtml: TINNED_FISH_GUIDE_CLOSING_HTML },
];

export const TINNED_FISH_GUIDE_RECORD: PublicGuideRecord = {
  id: 'tinned-fish-recipes-tuna-salmon-sardines',
  slug: 'tinned-fish-recipes-tuna-salmon-sardines',
  path: TINNED_FISH_GUIDE_PATH,
  canonicalPath: TINNED_FISH_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...TINNED_FISH_GUIDE,
  metaDescription: TINNED_FISH_GUIDE.description,
  label: 'Practical cooking guide',
  internalLinks: TINNED_FISH_GUIDE.internalLinks.filter(path => path !== '/recipes'),
  disclosureItems: TINNED_FISH_GUIDE_DISCLOSURES,
  disclosureFooter: TINNED_FISH_GUIDE_DISCLOSURE_FOOTER,
  sections: TINNED_FISH_GUIDE_SECTIONS,
  cta: {
    title: 'Find more dinner ideas',
    copy: 'Search DinnerByDesign for ideas built around what is already in the cupboard, fridge or freezer.',
    label: 'Find a dinner',
    href: '/signin',
  },
};

export function getTinnedFishGuideJsonLd() {
  return getPublicGuideJsonLd(TINNED_FISH_GUIDE_RECORD);
}

export function renderTinnedFishGuideInitialHtml() {
  return renderPublicGuideInitialHtml(TINNED_FISH_GUIDE_RECORD);
}
