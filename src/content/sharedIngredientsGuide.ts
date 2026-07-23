import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  SHARED_INGREDIENTS_DISCLOSURE_FOOTER,
  SHARED_INGREDIENTS_PLANNING_DISCLOSURES,
  SHARED_INGREDIENTS_SAFETY_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const SHARED_INGREDIENTS_GUIDE_PATH = '/food-costs/five-dinners-same-ingredients';

export const SHARED_INGREDIENTS_GUIDE = {
  title: 'How to turn the same five ingredients into five different dinners',
  seoTitle: 'Five dinners using the same ingredients | DinnerByDesign',
  description: 'See how chicken thighs, potatoes, peppers, onions and tinned tomatoes can become five different dinners while helping reduce part-used packs.',
  publishedAt: '2026-07-23',
  reviewedAt: '2026-07-23',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Plan five different dinners around the same five core ingredients to reduce disconnected purchases and part-used packs',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-23',
  editorialNotes: 'Planning guide for two adults using one shared five-ingredient basket. Keep the five dinners distinct by method, texture and seasoning, and recheck Food Standards Agency guidance before changing the review date.',
  internalLinks: [
    '/food-costs/cooking-with-cheaper-cuts-of-meat',
    '/food-costs/ways-to-reduce-grocery-costs',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/why-grocery-costs-are-hard-to-predict',
    '/guides',
    '/pricing-methodology',
    '/food-safety',
  ],
  disclosures: ['serving_assumption', 'price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: How to chill, freeze and defrost food safely',
      url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely',
    },
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food',
    },
  ],
  faqs: [
    {
      question: 'Do all five dinners use every core ingredient?',
      answer: 'Yes. Chicken thighs, potatoes, peppers, onions and tinned tomatoes appear in every dinner, but the cooking method, texture and seasoning change.',
    },
    {
      question: 'Does repeating ingredients mean repeating the same dinner?',
      answer: 'It should not. Roasting, braising, pan cooking, stuffing and layering create different textures and presentations even when the shopping basket stays the same.',
    },
    {
      question: 'Will buying one larger pack always cost less?',
      answer: 'No. Compare the pack price, the quantity and how much your household will genuinely use. The benefit comes from using what you buy, not simply choosing a larger pack.',
    },
    {
      question: 'Should I prepare all five dinners at once?',
      answer: 'Not necessarily. Portion and label the chicken, but prepare vegetables only for the next one or two dinners so they retain more of their texture and freshness.',
    },
    {
      question: 'Can I adapt the basket for a larger household?',
      answer: 'Yes. The examples assume two adults, so increase the quantities to suit your household and check that the available pack sizes still make sense for the plan.',
    },
  ],
};

export const SHARED_INGREDIENTS_OPENING_HTML = `<section><p>Five unrelated dinners can create five separate ingredient lists, and by Thursday, a fridge drawer holding half a bag of peppers and an onion with no obvious purpose. One way round this is to keep the core ingredients steady and change what you do with them.</p></section>
<section><h2>Quick answer</h2><p><em>The same five ingredients can produce five genuinely different dinners if the cooking method, texture and seasoning change each time. Chicken thighs, potatoes, peppers, onions and tinned tomatoes can be roasted, braised, crisped, stuffed or layered into a bake, each with its own herbs and spices. A few cupboard ingredients, including oil, salt, pepper and a chosen set of herbs or spices, are still needed alongside the five core ingredients.</em></p></section>
<section><h2>The five-ingredient basket</h2><p>This basket works because every item tolerates more than one cooking method.</p><ul><li><strong>Chicken thighs:</strong> roast, braise, shred or dice, as covered in <a href="/food-costs/cooking-with-cheaper-cuts-of-meat">cooking with cheaper cuts of meat</a>.</li><li><strong>Potatoes:</strong> crush, roast or fry.</li><li><strong>Peppers:</strong> roast whole, slice for a relish, or hollow out for stuffing.</li><li><strong>Onions:</strong> a base note in all five dinners, softened or caramelised depending on the dish.</li><li><strong>Tinned tomatoes:</strong> a sauce base, a relish, or a light braising liquid.</li></ul><p>Coordinating pack sizes across the five dinners can shorten the shopping list and reduce the number of part-used packs left over, as discussed in <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce and manage grocery costs</a>, though the right quantities depend on household size and on what pack sizes are available. Two adults is the assumption used for the dinner descriptions below, in line with <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>; larger households will need to scale the amounts.</p></section>`;

export const SHARED_INGREDIENTS_DINNERS_HTML = `<section><h2>How the five dinners remain different</h2><div class="guide-table-wrap"><table><thead><tr><th>Dinner</th><th>Main method</th><th>Dominant texture</th><th>Character</th></tr></thead><tbody><tr><td>Tray bake</td><td>Roasting</td><td>Crisp and caramelised</td><td>Smoky</td></tr><tr><td>Braise</td><td>Gentle braising</td><td>Soft and sauce-led</td><td>Rich and savoury</td></tr><tr><td>Hash</td><td>Pan cooking</td><td>Crisp and chopped</td><td>Quick and informal</td></tr><tr><td>Stuffed peppers</td><td>Baking</td><td>Structured and filled</td><td>Colourful and composed</td></tr><tr><td>Layered bake</td><td>Baking, layered</td><td>Crisp-topped, soft beneath</td><td>Warm and hearty</td></tr></tbody></table></div></section>
<section><h2>The five dinners</h2><h3>1. Smoky chicken, pepper and potato tray bake</h3><p>Chicken thighs, sliced peppers, onion wedges and quartered potatoes go into one tray, with tinned tomatoes spooned underneath to form a rough sauce as everything roasts. Smoked paprika and a splash of oil are the main cupboard additions. The result is crisp-edged, slightly caramelised at the corners, and largely hands-off once it is in the oven.</p><h3>2. Tomato-braised chicken with peppers and crushed potatoes</h3><p>Here the same five ingredients go into a pan rather than a tray. Chicken, onion and peppers are softened first, then simmered gently in the tinned tomatoes until the sauce thickens and the chicken is tender enough to break apart with a fork. Potatoes are boiled and roughly crushed rather than roasted. Bay leaf, thyme or a pinch of dried oregano suit this one. It is softer and more sauce-led than the tray bake, closer to a stew than a roast.</p><h3>3. Chicken and potato hash with pepper and tomato relish</h3><p>Diced potatoes are fried until crisp, then shredded cooked chicken and softened onion are worked through the pan. Peppers and tinned tomatoes are cooked down separately into a warm, chunky relish spooned over the top rather than mixed in. Paprika or a little chilli flake works well. The contrast between the crisp hash and the loose relish is what separates this from the braise: it is quicker to put together and better suited to a busy evening.</p><h3>4. Chicken-stuffed peppers with tomato-roasted potatoes</h3><p>Halved peppers are filled with a mixture of chopped cooked chicken, softened onion and cooked, diced potato, then baked until the filling is hot through and the pepper has softened at the edges. A separate batch of potatoes is roasted alongside in a tomato sauce made from the tin. Dried oregano or basil suits the filling. Because the ingredients are composed into a filled, baked dish rather than mixed loosely in a pan, this feels more structured and composed than the tray bake or hash, even though the shopping list has not changed.</p><h3>5. Chicken, pepper and tomato bake with a crisp potato topping</h3><p>Onions and peppers are softened, then chopped cooked chicken is added and the tinned tomatoes reduced down into a thick filling. This is topped with crushed or roughly mashed potato and baked until the top develops crisp, browned edges. Where the braise stays soft and sauce-led throughout, this one has a clear textural contrast: a firm, crisp top over a soft, savoury filling. Rosemary suits the topping.</p></section>`;

export const SHARED_INGREDIENTS_PLANNING_HTML = `<section><h2>One coordinated preparation session</h2><p>Rather than preparing all five dinners&apos; worth of ingredients in one sitting, the groundwork can be split sensibly:</p><ul><li>divide and label the chicken portions for each dinner;</li><li>freeze any portions that will not be used before their use-by date;</li><li>identify which vegetables belong to which dinner;</li><li>prepare vegetables for the first one or two dinners only, rather than all five, as set out in <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a>;</li><li>keep raw chicken separate from vegetables and any ready-to-eat ingredients throughout.</li></ul><p>Preparing all the vegetables at once may save a little time initially, but it can reduce their texture and freshness later in the week. Prepare only what will be used shortly and keep it covered and refrigerated.</p></section>
<section><h2>Scheduling and storage</h2><p>Follow the storage instructions and use-by date on the chicken packaging. Keep raw chicken covered at the bottom of the fridge, separate from cooked and ready-to-eat ingredients. Portions that will not be used before the use-by date should be frozen in time. Defrost chicken in the fridge and cook it within 24 hours of defrosting; do not refreeze it raw once thawed.</p><p>Cook chicken until it is steaming hot throughout, with no pink meat and clear juices. Cooked leftovers should be cooled and refrigerated within two hours, then eaten within 48 hours or frozen. Reheat leftovers only once, and make sure they are steaming hot throughout.</p></section>`;

export const SHARED_INGREDIENTS_CLOSING_HTML = `<section><h2>Does using the same ingredients reduce costs?</h2><p>Not necessarily. Coordinating one basket across five dinners can reduce the number of part-used packs left in the fridge, which is where a lot of ingredients quietly go to waste. But the checkout total depends on pack sizes, on how much of each pack is actually used, and on what is already sitting in the cupboard, as explained in <a href="/food-costs/why-grocery-costs-are-hard-to-predict">why grocery costs are difficult to predict</a>. Buying one larger tray does not automatically reduce the cost per serving. Compare the pack price, the quantity and how much the household will genuinely use. The saving, where it exists, tends to come from using what is bought rather than from any five-ingredient trick.</p></section>
<section><h2>When this approach works well</h2><p>This style of planning suits households that want a shorter shopping list, do not mind repeating ingredients as long as the dinners look and taste different, and have a reasonable set of herbs and spices already in the cupboard. It also depends on having enough fridge or freezer space to store portioned ingredients safely across the week, and on being willing to plan several dinners at once rather than deciding dinner by dinner.</p></section>
<section><h2>When it may not work</h2><p>It is less useful where one household member dislikes chicken, peppers or tinned tomatoes, since the whole basket rests on those five ingredients pulling their weight across every dinner. Households with significantly different dietary needs from one dinner to the next may find the approach adds complexity rather than removing it. And if the basket ends up needing several new sauces, spice blends or specialist ingredients to make the five dinners feel distinct, much of the point of a shared shopping list is lost.</p></section>
<section><h2>Verdict</h2><p><em>Repeat the basket, not the dinner. The five dinners above show how far cooking method, texture and seasoning can stretch the same five ingredients, but the approach only earns its keep if every dinner still feels worth eating, and every ingredient bought actually gets used.</em></p></section>`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function getSharedIngredientsGuideJsonLd() {
  const guide = SHARED_INGREDIENTS_GUIDE;
  const url = `https://dinnerbydesign.app${SHARED_INGREDIENTS_GUIDE_PATH}`;
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
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dinnerbydesign.app/guides' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}

export function renderSharedIngredientsGuideInitialHtml() {
  const guide = SHARED_INGREDIENTS_GUIDE;
  const planningDisclosures = renderProgrammaticDisclosuresInitialHtml(SHARED_INGREDIENTS_PLANNING_DISCLOSURES);
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(SHARED_INGREDIENTS_SAFETY_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(SHARED_INGREDIENTS_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 23 July 2026 · Last reviewed 23 July 2026</p><article>${SHARED_INGREDIENTS_OPENING_HTML}${planningDisclosures}${SHARED_INGREDIENTS_DINNERS_HTML}${SHARED_INGREDIENTS_PLANNING_HTML}${safetyDisclosures}${SHARED_INGREDIENTS_CLOSING_HTML}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section></article>${disclosureFooter}<section><h2>Plan your week</h2><p>DinnerByDesign can build several dinners around your household, budget and available time, while looking for opportunities to reuse ingredients across the week.</p><p><a href="/signin">Plan my week</a> · <a href="/guides">Browse all guides</a></p></section></main></div>`;
}
