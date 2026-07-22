import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  CHEAPER_MEAT_CUTS_COST_DISCLOSURES,
  CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER,
  CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES,
  CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const CHEAPER_MEAT_CUTS_GUIDE_PATH = '/food-costs/cooking-with-cheaper-cuts-of-meat';

export const CHEAPER_MEAT_CUTS_GUIDE = {
  title: 'Cooking with cheaper cuts of meat: what to buy and how to use it',
  seoTitle: 'Cooking with cheaper cuts of meat | DinnerByDesign',
  description: 'Learn how to cook beef shin, braising steak, chicken thighs, pork shoulder and turkey thighs — and when these cuts may offer better value.',
  publishedAt: '2026-07-22',
  reviewedAt: '2026-07-22',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Food cost guide',
  primarySearchIntent: 'Choose and cook lower-cost meat cuts using methods that suit their texture, usable quantity and available time',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-22',
  editorialNotes: 'Method-led guide rather than a live price ranking. Keep it distinct from the comparison guide for four servings, and recheck Food Standards Agency cooking and storage guidance before changing the review date.',
  internalLinks: [
    '/food-costs/cooking-for-four-with-lower-cost-cuts',
    '/pricing-methodology',
    '/food-costs/why-grocery-costs-are-hard-to-predict',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/portion-planning-and-food-waste',
    '/food-costs/cooking-with-offal-on-a-budget',
    '/food-costs/low-cost-cooking-techniques',
    '/food-costs/ways-to-reduce-grocery-costs',
    '/guides',
  ],
  disclosures: ['price_comparison', 'allergen_and_product', 'storage_and_cooking', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food',
    },
    {
      label: 'Food Standards Agency: How to chill, freeze and defrost food safely',
      url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely',
    },
  ],
  faqs: [
    {
      question: 'Are cheaper cuts always cheaper per serving?',
      answer: 'Not always. Bone weight, trimming and cooking losses can reduce the usable meat you get, so it is worth considering cost per serving rather than price per pack or kilogram.',
    },
    {
      question: 'Which cheaper cut is easiest for a beginner?',
      answer: 'Boneless chicken thighs are a reasonable starting point. They are forgiving to cook and work in a wide range of everyday dinners.',
    },
    {
      question: 'Can chicken thighs replace chicken breast?',
      answer: 'Often, particularly in curries, casseroles and traybakes. The texture and cooking time differ slightly, so adjust the method rather than assume a direct swap.',
    },
    {
      question: 'Does slow cooking use too much energy to save money?',
      answer: 'It depends on the appliance, cooking duration and energy tariff. There is no single answer, so consider how the cut will actually be cooked rather than assuming every slowly cooked dish will cost less overall.',
    },
    {
      question: 'Can cooked meat be frozen?',
      answer: 'Yes. Cool, portion and store it safely, following current Food Standards Agency guidance and the product instructions.',
    },
  ],
};

export const CHEAPER_MEAT_CUTS_OPENING_HTML = `<section><h2>Quick answer</h2><p><em>Beef shin, braising steak, chicken thighs and drumsticks, pork shoulder and turkey thighs can be useful alternatives to more familiar cuts. Some need longer, gentler cooking; others can be roasted or cooked in one pan. The best choice depends on the pack price, the amount of usable meat, the cooking time and what you plan to do with the leftovers. Cheaper does not have to mean dull — these cuts often bring plenty of flavour and work particularly well with spices, herbs, tomatoes, pulses and seasonal vegetables.</em></p><p>If you want to compare different cuts when cooking for four, our separate <a href="/food-costs/cooking-for-four-with-lower-cost-cuts">guide to comparing meat cuts when cooking for four</a> looks at that decision. Here, the focus is on what each cut needs in the kitchen and the kinds of dinners it suits.</p></section>
<section><h2>Why are some cuts cheaper?</h2><p>A few ordinary factors explain the price difference: more connective tissue that needs longer cooking to soften, bones, skin or visible fat that reduce the usable meat in the pack, less consumer demand than convenient cuts such as chicken breast, and the usual effects of retailer, pack size, promotion and time of year.</p><p>A lower price per pack or kilogram does not automatically mean a lower cost per serving. Bone weight, trimming, longer cooking energy and what you serve alongside it all affect the real value of a dinner — our guide to <a href="/pricing-methodology">how prices are calculated</a> explains this distinction in more depth.</p><p><strong>Prices and availability:</strong> <em>Prices and availability vary between retailers, packs and dates. The comparisons in this guide are general rather than tied to a specific shop or price. Our guide to <a href="/food-costs/why-grocery-costs-are-hard-to-predict">why grocery costs are difficult to predict</a> looks at this in more detail.</em></p></section>`;

export const CHEAPER_MEAT_CUTS_DETAILS_HTML = `<section><h2>At a glance</h2><div class="guide-table-wrap"><table><thead><tr><th>Cut</th><th>Character</th><th>Best methods</th><th>Time</th><th>Good for</th></tr></thead><tbody><tr><td>Beef shin</td><td>Deep flavour; becomes tender slowly</td><td>Braising, slow cooking</td><td>Longer</td><td>Stews, ragù-style sauces, pies</td></tr><tr><td>Braising steak</td><td>Rich and versatile</td><td>Casseroles, braising</td><td>Longer</td><td>Tomato-based dishes, pies, shredded beef</td></tr><tr><td>Chicken thighs</td><td>Juicy and forgiving</td><td>Roasting, traybakes, casseroles</td><td>Moderate</td><td>Curries, rice dishes, one-pan dinners</td></tr><tr><td>Chicken drumsticks</td><td>Flavourful and bone-in</td><td>Roasting, braising</td><td>Moderate</td><td>Traybakes, spiced chicken, tomato dishes</td></tr><tr><td>Pork shoulder</td><td>Rich; suits larger batches</td><td>Slow roasting, braising</td><td>Longer</td><td>Shredded pork, stews, fillings</td></tr><tr><td>Turkey thighs</td><td>Full-flavoured and substantial</td><td>Roasting, braising</td><td>Moderate to long</td><td>Curries, casseroles, shredded turkey</td></tr></tbody></table></div><p><strong>Cooking times and safety:</strong> <em>Timings above are general guidance, not exact instructions for every pack. Always follow the cooking instructions on the product you have bought.</em></p></section>
<section><h2>Beef shin</h2><p>Beef shin comes from a hard-working part of the animal, which is exactly why it needs slow, gentle cooking. Connective tissue that would stay tough after a quick sear breaks down over time into something rich and tender. Onions, carrots, tomatoes, mushrooms, bay, thyme and warming spices such as cinnamon or allspice all suit it well, in a classic stew, a ragù-style sauce or a pie filling. A smaller quantity goes a long way stirred through beans, lentils or plenty of root vegetables, rather than needing to be the bulk of the dish.</p><p>It can be less convenient than braising steak when you are short on time. It often needs trimming, and the cooking time is genuinely long, so it suits a day when something can be left cooking rather than a rushed evening.</p></section>
<section><h2>Braising steak</h2><p>Braising steak is usually quicker to prepare than shin, making it a practical choice for casseroles, pie fillings and sauces left to cook gently. Browning the meat first can add depth of flavour, but it is a nice-to-have rather than essential — skip it on a busier evening and the dish will still work. Root vegetables, beans or lentils stretch the dish further. Pre-diced packs are convenient, but a larger piece cut yourself can sometimes offer better value. Compare the pack in front of you rather than assuming either is automatically the better buy.</p></section>
<section><h2>Chicken thighs and drumsticks</h2><p>Thighs and drumsticks behave a little differently. Boneless thighs give more usable meat for the pack weight, and they are generally more forgiving than chicken breast, tending to stay juicy during roasting, braising and casserole cooking. They suit curries, casseroles, traybakes and rice-based dinners well.</p><p>Drumsticks are usually bone-in, so part of the pack weight is not meat you will eat. That matters when working out portions. They roast and braise well and hold their own in a traybake or tomato-based dish. Skin-on or skinless is a matter of preference and the dish, rather than one being clearly better.</p><p>A few flavour directions worth trying: lemon and oregano, tomato and paprika, ginger and garlic, or a milder spice blend with peppers and rice.</p></section>`;

export const CHEAPER_MEAT_CUTS_PLANNING_HTML = `<section><h2>Pork shoulder</h2><p>Pork shoulder suits slow cooking for the same reason as beef shin — connective tissue and fat that reward a long, gentle cook, becoming tender and easy to shred rather than staying firm. Buying a whole joint rather than smaller pieces can offer good value, but only if your household will genuinely get through it. A large joint is only useful if it gets eaten, either at one sitting or across more than one dinner with a plan for the rest. Our guide to <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a> covers that approach in more detail.</p><p>A roast dinner, shredded pork in flatbreads or a filling for baked potatoes are all reasonable directions. Trim excess fat if you prefer; some of the fat melts during cooking and adds flavour.</p></section>
<section><h2>Turkey thighs</h2><p>Turkey thigh is the least familiar of these cuts, but worth getting to know. It is darker and generally fuller-flavoured than turkey breast, suiting casseroles, curries and roasting methods that give the darker meat enough time to become tender. Availability varies considerably between retailers and individual stores, so turkey thighs may not be as dependable an everyday option as chicken thighs.</p><p>Bone-in and boneless versions need different serving assumptions, since bone weight is not usable meat. Compare the specific pack in front of you rather than assuming turkey thigh will always be cheaper than chicken — that varies by retailer and by week.</p></section>
<section><h2>Choosing the right cut for the time you have</h2><ul><li><strong>Need something relatively quick:</strong> boneless chicken thighs</li><li><strong>Happy to leave something cooking:</strong> beef shin, braising steak or pork shoulder</li><li><strong>Want a traybake:</strong> thighs or drumsticks</li><li><strong>Cooking a larger batch:</strong> pork shoulder, braising steak or turkey thigh</li><li><strong>Need predictable portions:</strong> boneless cuts are usually easier to divide evenly</li><li><strong>Want deeper flavour from a smaller quantity:</strong> slow-cooked beef or pork alongside pulses and vegetables</li></ul><p>“Quick” is relative here and should not come at the expense of cooking something safely and thoroughly.</p></section>
<section><h2>Making cheaper cuts go further</h2><p>Our guide to <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a> covers the general principles behind this list in more detail.</p><ul><li>Cook a larger quantity only when there is a definite plan for all of it.</li><li>Pair meat with beans, lentils, potatoes, rice or seasonal vegetables, rather than serving it alone.</li><li>Reuse the cooked meat in a genuinely different second dinner, not the same dish twice.</li><li>Portion leftovers before refrigerating or freezing them.</li><li>Label frozen portions with the dish and the date.</li><li>Use bones and skin for stock if you would like to — it is a nice extra, not something you need to do.</li><li>Weigh up cooking energy and total preparation time alongside the shelf price, not instead of it.</li></ul><p>Pork shoulder is a good example: served with potatoes one evening, then shredded into a tomato and bean dish later in the week, the same joint covers two distinctly different dinners.</p></section>`;

export const CHEAPER_MEAT_CUTS_CLOSING_HTML = `<section><h2>When a cheaper cut may not be better value</h2><ul><li>A large pack or joint that will not realistically get used.</li><li>A high proportion of bone or trimming for what you actually need.</li><li>Several hours of cooking for a small quantity of usable meat.</li><li>A cut your household does not particularly enjoy, however good the price.</li><li>Extra ingredients bought specially for just one dish.</li><li>A promotion that week making a different cut cheaper instead.</li></ul><p>None of this makes these cuts a poor choice. It is simply why cheaper and better value are not always the same thing.</p></section>
<section><h2>Verdict</h2><p><em>Cheaper cuts can offer good value when they suit the dish, the cooking time and the household. Chicken thighs are useful for everyday flexibility, while beef shin, braising steak, pork shoulder and turkey thighs come into their own when there is time for slower cooking. Compare the actual pack, account for bones and trimming, and decide how any extra cooked meat will be used. The best-value cut is usually the one that becomes dinners people will genuinely eat.</em></p></section>
<section><h2>Related guides</h2><p><a href="/food-costs/cooking-with-offal-on-a-budget">Cooking with offal on a budget</a> covers a related but distinct subject. For the wider principles behind this guide, see <a href="/food-costs/low-cost-cooking-techniques">three low-cost cooking techniques</a> and <a href="/food-costs/ways-to-reduce-grocery-costs">12 practical ways to reduce grocery costs</a>.</p></section>`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function getCheaperMeatCutsGuideJsonLd() {
  const guide = CHEAPER_MEAT_CUTS_GUIDE;
  const url = `https://dinnerbydesign.app${CHEAPER_MEAT_CUTS_GUIDE_PATH}`;
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

export function renderCheaperMeatCutsGuideInitialHtml() {
  const guide = CHEAPER_MEAT_CUTS_GUIDE;
  const costDisclosures = renderProgrammaticDisclosuresInitialHtml(CHEAPER_MEAT_CUTS_COST_DISCLOSURES);
  const productDisclosures = renderProgrammaticDisclosuresInitialHtml(CHEAPER_MEAT_CUTS_PRODUCT_DISCLOSURES);
  const safetyDisclosures = renderProgrammaticDisclosuresInitialHtml(CHEAPER_MEAT_CUTS_SAFETY_DISCLOSURES);
  const disclosureFooter = renderProgrammaticDisclosureFooterInitialHtml(CHEAPER_MEAT_CUTS_DISCLOSURE_FOOTER);
  const faqs = guide.faqs.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Food cost guides</nav><p>Food cost guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 22 July 2026 · Last reviewed 22 July 2026</p><article>${CHEAPER_MEAT_CUTS_OPENING_HTML}${costDisclosures}${CHEAPER_MEAT_CUTS_DETAILS_HTML}${productDisclosures}${CHEAPER_MEAT_CUTS_PLANNING_HTML}${safetyDisclosures}${CHEAPER_MEAT_CUTS_CLOSING_HTML}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section></article>${disclosureFooter}<section><h2>Plan with these cuts in mind</h2><p>Build a week of dinners around your household, budget and available time, and see how a cut such as pork shoulder or braising steak can support more than one dinner.</p><p><a href="/signin">Plan my week</a></p></section></main></div>`;
}
