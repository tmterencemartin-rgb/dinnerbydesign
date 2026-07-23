import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  COMPLETE_PACKS_DISCLOSURE_FOOTER,
  renderProgrammaticDisclosureFooterInitialHtml,
} from './programmaticDisclosures';

export const COMPLETE_PACKS_GUIDE_PATH = '/food-costs/how-to-use-complete-packs';

export const COMPLETE_PACKS_GUIDE = {
  title: 'How to use complete packs without wasting ingredients',
  seoTitle: 'How to use complete food packs and reduce waste | DinnerByDesign',
  description: 'Learn how to plan several dinners around complete supermarket packs, make use of pack remainders and avoid buying more than your household will use.',
  publishedAt: '2026-07-23',
  reviewedAt: '2026-07-23',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Plan practical uses for complete supermarket packs so checkout costs are easier to understand and fewer ingredients are wasted',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-23',
  editorialNotes: 'Keep complete-pack cost distinct from the value of ingredients used. Pack quantities are illustrative, and storage advice must remain led by product labels and current Food Standards Agency guidance.',
  internalLinks: [
    '/food-costs/why-grocery-costs-are-hard-to-predict',
    '/pricing-methodology',
    '/food-costs/five-dinners-same-ingredients',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/fresh-or-frozen',
    '/food-costs/cooking-for-one-without-waste',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/ways-to-reduce-grocery-costs',
    '/food-safety',
    '/guides',
  ],
  disclosures: ['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
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
      question: 'Does buying a larger pack always save money?',
      answer: 'Not always. It can lower the cost per unit while still costing the household more overall, particularly if part of the pack goes unused.',
    },
    {
      question: 'How can I use a pack across two dinners without repeating the same dish?',
      answer: 'Change the cooking method, seasoning or texture the second time. Roasted chicken can become shredded chicken with rice; a tomato-based mince dinner can become a stuffed-pepper filling.',
    },
    {
      question: 'Should I cook the whole pack at once?',
      answer: 'Not necessarily. Splitting a pack before cooking can preserve more flexibility than cooking everything at once and reheating part of it later.',
    },
    {
      question: 'Is frozen produce better for avoiding waste?',
      answer: 'It can help, since portions can be taken out as needed, but it is not automatically better for every ingredient or household. It depends on freezer space and how the ingredient is used.',
    },
    {
      question: 'What should I do when the smallest available pack is still too large?',
      answer: 'Look for loose alternatives where sold, plan a genuinely different second use in advance, or accept that a small amount may need to be frozen or discarded rather than forced into a dinner nobody wants.',
    },
  ],
};

export const COMPLETE_PACKS_OPENING_HTML = `<section><p>A recipe calls for three chicken thighs, but the pack in the fridge holds six. A sauce needs a few spoonfuls of yogurt, and the rest sits there with no obvious plan. This isn&apos;t a problem of buying too much. It&apos;s a problem of buying something without deciding, in advance, what the remainder is for. The supermarket checkout doesn&apos;t charge for the amount a recipe calls for; it charges for the pack it comes in, however much of that pack one dinner actually uses.</p></section>
<section><h2>Quick answer</h2><p><em>Complete packs are easiest to use well when every part has a purpose before shopping begins. That might mean spreading one ingredient across two different dinners, dividing and freezing a pack promptly, choosing a smaller or frozen alternative, or changing the planned dinner to fit what&apos;s actually available. A larger pack only offers real value when the household will genuinely use all of it, not simply because it&apos;s cheaper by weight.</em></p></section>
<section><h2>Why recipe cost and checkout cost differ</h2><p>A dinner might call for 300g of mince from a 500g pack, or three chicken thighs from a pack of six. The recipe cost reflects only the quantity used in that dinner; the checkout cost reflects the whole pack, because that&apos;s what actually leaves the shop. When the remainder has no planned use, part of what was paid at the checkout may never contribute to a dinner. This is one reason <a href="/food-costs/why-grocery-costs-are-hard-to-predict">why grocery costs are difficult to predict</a>: pack sizes rarely match recipe quantities exactly. The <a href="/pricing-methodology">pricing methodology</a> behind DinnerByDesign&apos;s costed dinners tries to account for that gap rather than ignore it.</p></section>
<section><h2>Plan the second use before buying</h2><p>Do not buy the pack for one dinner and hope to find a use for the remainder later. Decide on both uses before it enters the basket. The second use doesn&apos;t have to repeat the first dish; in fact it usually works better if it doesn&apos;t, since the same ingredient can take on a different texture, seasoning or cooking method entirely. Six chicken thighs might mean a tray bake on the night of shopping and shredded chicken with rice two days later. A pack of mince might mean a tomato-based dinner first, then stuffed peppers or a baked-potato topping later in the week. The guide on <a href="/food-costs/five-dinners-same-ingredients">turning the same five ingredients into five different dinners</a> covers this idea further. What matters here is deciding the second use before the first pack is even paid for.</p></section>`;

export const COMPLETE_PACKS_EXAMPLES_HTML = `<section><h2>Complete-pack planning examples</h2><div class="guide-table-wrap"><table><thead><tr><th>Pack or ingredient</th><th>First use</th><th>Planned further use</th><th>Practical action</th></tr></thead><tbody><tr><td>Chicken thighs</td><td>Tray bake</td><td>Shredded chicken and rice</td><td>Divide or cook safely, then store</td></tr><tr><td>Mince</td><td>Tomato-based dinner</td><td>Stuffed peppers or baked-potato topping</td><td>Split the pack before cooking</td></tr><tr><td>Spinach</td><td>Pasta or curry-style dish</td><td>Egg dish, soup or sauce</td><td>Schedule the more perishable use first</td></tr><tr><td>Plain yogurt</td><td>Sauce or marinade</td><td>Dressing or spiced accompaniment</td><td>Check the opened-product instructions</td></tr><tr><td>Peppers</td><td>Roasted dinner</td><td>Relish, stew or rice dish</td><td>Assign each pepper before shopping</td></tr><tr><td>Bread</td><td>Served fresh</td><td>Toasted topping or thickener</td><td>Use only while safe; discard if mouldy</td></tr></tbody></table></div><p>These are planning illustrations rather than complete recipes, but each shows a different way of handling a pack.</p><p>Chicken thighs show how to divide before cooking: two or three go into a tray bake, the rest portioned, labelled and refrigerated for prompt use, or frozen in line with the pack instructions. Mince works the same way, but raw, so both dinners get freshly cooked meat rather than a reheated version of the first.</p><p>Schedule quick-wilting vegetables such as spinach early in the week, following the storage instructions and use-by date on the pack. Yogurt is one opened product doing two jobs, a savoury sauce early on and a spiced dressing later, so long as the label allows it. Peppers make a simpler point: if a pack contains four, decide what each one is for before shopping, rather than reaching for “the rest” once two have already gone into one dinner.</p><p>Bread is the exception worth flagging directly: a stale end can become a topping or a thickener, but mould is not staleness, and mouldy bread should be thrown away rather than reused.</p></section>`;

export const COMPLETE_PACKS_METHODS_HTML = `<section><h2>Five ways to deal with a complete pack</h2><ul><li><strong>Use it across two genuinely different dinners.</strong> Change the seasoning, method or texture so the second dinner doesn&apos;t feel like a repeat of the first.</li><li><strong>Divide and freeze it promptly.</strong> Follow the pack&apos;s label and current food-safety guidance rather than leaving the decision until the ingredient looks past its best.</li><li><strong>Cook a flexible component rather than a finished dish.</strong> A tomato base, a tray of roasted vegetables or plain cooked chicken can be finished differently on two separate occasions; the <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a> guide has more on this.</li><li><strong>Choose loose, frozen or smaller formats where practical.</strong> A larger pack isn&apos;t useful if a good portion of it is likely to be thrown away; the <a href="/food-costs/fresh-or-frozen">fresh or frozen</a> guide looks at when each format makes more sense.</li><li><strong>Change the planned dinner to suit the pack.</strong> Sometimes adjusting what&apos;s for dinner is easier than forcing an unwanted remainder into the rest of the week.</li></ul><p>Freezing suits some ingredients better than others, so check the pack rather than assuming everything can go straight in the freezer.</p></section>
<section><h2>When a larger pack is false economy</h2><p>A bigger pack can cost less per unit and still be the wrong choice: when it holds more than the household can realistically use, when there&apos;s no freezer space for what&apos;s left, or when using the remainder means buying extra ingredients just to build a second dinner around it. It&apos;s also worth a second look when a larger pack encourages bigger portions than the household wants, or contains an ingredient only one person will eat. Households cooking for one hit this often; the <a href="/food-costs/cooking-for-one-without-waste">guide on cooking for one without waste</a> covers it directly. The lowest unit price and the best value for a household aren&apos;t always the same thing.</p></section>
<section><h2>Build the week around the awkward packs</h2><p>A simple planning order helps:</p><ul><li>Check the cupboard, fridge and freezer before adding anything to the list.</li><li>Identify the packs most likely to leave a remainder.</li><li>Choose a second use for each one.</li><li>Schedule the most perishable ingredients first.</li><li>Confirm that storage space and cooking time are realistic for the week ahead.</li><li>Build the shopping list only once the dinners are scheduled, not before.</li></ul><p>This is the same principle behind <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a> more generally, and it&apos;s one of the more effective <a href="/food-costs/ways-to-reduce-grocery-costs">ways to reduce and manage grocery costs</a>: not through smaller purchases necessarily, but through fewer purchases with no destination. DinnerByDesign can help by building several dinners around a household&apos;s budget and available time, while looking for these opportunities to reuse a pack across the week.</p></section>`;

export const COMPLETE_PACKS_CLOSING_HTML = `<section><h2>Storage, labels and food safety</h2><p>Use-by dates and product storage instructions come first, always. Refrigerate or freeze suitable ingredients promptly, and keep raw meat separate from ready-to-eat ingredients throughout. Cool, store, defrost and reheat cooked food in line with current <a href="/food-safety">Food Standards Agency guidance</a>. Check allergen information on packaged sauces, stock, seasonings, yogurt or any substitution before using it in a second dinner. Planning around a pack is never a reason to override a use-by date, and mouldy bread should always be discarded rather than reused.</p></section>
<section><h2>When complete-pack planning may not work</h2><p>Plans change, and a household&apos;s appetite for a planned second dinner doesn&apos;t always survive the week intact. Dietary needs can differ between household members, storage space is sometimes genuinely limited, and the second dinner built around a remainder may simply not appeal once the day arrives. In some of these cases, a smaller pack at a higher unit price is worth it if it avoids waste altogether. None of this makes complete-pack planning pointless; it just means treating it as a habit rather than a fixed rule.</p></section>
<section><h2>Verdict</h2><p><em>The aim isn&apos;t to buy the largest pack available, or to force every remainder into another dish out of principle. It&apos;s to know what the complete pack will contribute before it&apos;s bought. When each part has a realistic destination, checkout costs become easier to understand, and fewer ingredients are left waiting for a use that never comes.</em></p></section>`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function getCompletePacksGuideJsonLd() {
  const guide = COMPLETE_PACKS_GUIDE;
  const url = `https://dinnerbydesign.app${COMPLETE_PACKS_GUIDE_PATH}`;
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

export function renderCompletePacksGuideInitialHtml() {
  const guide = COMPLETE_PACKS_GUIDE;
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(COMPLETE_PACKS_DISCLOSURE_FOOTER);
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 23 July 2026 · Last reviewed 23 July 2026</p><article>${COMPLETE_PACKS_OPENING_HTML}${COMPLETE_PACKS_EXAMPLES_HTML}${COMPLETE_PACKS_METHODS_HTML}${COMPLETE_PACKS_CLOSING_HTML}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section></article>${disclosureFooter}<section><h2>Plan around the packs you buy</h2><p>DinnerByDesign can build several dinners around your household, budget and available time, while looking for sensible opportunities to reuse ingredients across the week.</p><p><a href="/signin">Plan my week</a> · <a href="/guides">Browse all guides</a></p></section></main></div>`;
}
