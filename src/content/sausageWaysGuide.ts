import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  SAUSAGE_GUIDE_DISCLOSURES,
  SAUSAGE_GUIDE_DISCLOSURE_FOOTER,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const SAUSAGE_WAYS_GUIDE_PATH = '/guides/9-ways-with-sausages';

export const SAUSAGE_WAYS_GUIDE = {
  title: '9 ways with sausages for easy everyday dinners',
  seoTitle: '9 easy ways with sausages for everyday dinners | DinnerByDesign',
  description: 'Nine practical ways to turn a pack of sausages into varied, affordable dinners, from traybakes and pasta to flatbreads, fried rice and hash.',
  publishedAt: '2026-07-25',
  reviewedAt: '2026-07-25',
  nextReviewAt: '2027-07-25',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Find simple and varied everyday dinner ideas using sausages',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-25',
  editorialNotes: 'One canonical inspiration guide with nine distinct ideas and one handoff to ordinary DinnerByDesign search.',
  internalLinks: ['/guides', '/guides/how-to-build-a-traybake', '/food-costs/cooking-with-pulses-on-a-budget', '/signin'],
  disclosures: ['price_comparison', 'storage_and_cooking', 'allergen_and_product', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    {
      label: 'Tesco Groceries: Tesco British Pork Sausages 8 Pack 454G',
      url: 'https://www.tesco.com/shop/en-GB/products/261879050',
    },
    {
      label: 'Tesco Groceries: Tesco Finest 6 Pork Sausages 400G',
      url: 'https://www.tesco.com/shop/en-GB/products/280002982',
    },
    {
      label: 'Food Standards Agency: Home food fact checker',
      url: 'https://www.gov.uk/government/publications/home-food-fact-checker',
    },
    {
      label: 'Food Standards Agency: Cooking your food',
      url: 'https://www.gov.uk/government/publications/cooking-your-food',
    },
  ],
};

export interface SausageWaysGuideSection {
  title?: string;
  paragraphs: string[];
}

export const SAUSAGE_WAYS_GUIDE_SECTIONS: SausageWaysGuideSection[] = [
  {
    paragraphs: [
      "There's a pack of sausages in the fridge, and nobody's especially keen on the usual sausage and mash again. It's easy to see why sausages end up there in the first place: they're straightforward to cook, widely liked, and a reasonable thing to reach for when there isn't much time or inspiration to spare. The trouble is that the same pack tends to become the same dinner, on repeat, until it doesn't feel worth buying again.",
      "The usual dinner isn't the only option, though. Sausages don't have to be cooked and served whole. Sliced, crumbled out of their skins, or roasted alongside other ingredients, the same pack can point in genuinely different directions. Most of the ideas below work with pork, chicken or vegetarian sausages, though cooking times and a few of the techniques will vary, so it's worth checking the pack.",
    ],
  },
  {
    title: 'Sausage, apple and mustard traybake',
    paragraphs: [
      "Everything goes on one tray: wedges of potato, red onion and eating apple, with a spoonful of mustard stirred through the oil before it all goes in. The apple softens and turns slightly sweet as it roasts, which sits well against the mustard and the sausages' own seasoning. Once the tray's in the oven there's very little else to do until it comes out, which makes this one of the more hands-off ideas here for a weeknight.",
    ],
  },
  {
    title: 'Sausage and tomato pasta',
    paragraphs: [
      'Take the meat out of the skins and break it into a tomato sauce, the way you might with mince. Sausages are already seasoned with herbs and spices, so this style of sauce usually needs less extra seasoning than a plain mince ragu would. Four or five sausages, broken up this way, will comfortably sauce a pack of pasta for several people, which is useful to know if the fridge only has a partly used pack to work with.',
    ],
  },
  {
    title: 'Sausage, bean and vegetable stew',
    paragraphs: [
      'Sliced or whole sausages simmer in a stew with tinned beans, tinned tomatoes and whatever vegetables need using up, fresh or frozen. The beans and vegetables carry a good share of the dish, so a modest number of sausages stretches further here than it would served on its own. It suits a stocked cupboard and a half-empty vegetable drawer particularly well.',
    ],
  },
  {
    title: 'Sausage fried rice',
    paragraphs: [
      "Slice cooked sausages and stir them through leftover rice with frozen peas, sweetcorn or whatever vegetables are around, plus a beaten egg stirred through towards the end. This one only works safely with rice that's been cooled and stored properly; see the food safety note below for what that involves.",
    ],
  },
  {
    title: 'Sausage and lentil casserole',
    paragraphs: [
      'Red lentils are the easiest choice because they soften into the sauce and help thicken it. Green or brown lentils work too, but they keep their shape and usually take longer. Either way, lentils make a smaller number of sausages go further while keeping the dinner filling.',
    ],
  },
  {
    title: 'Sausage flatbreads',
    paragraphs: [
      "Cooked sausages, sliced or split open, sit in a warmed flatbread with salad, a spoonful of yoghurt and something with a bit of sharpness: pickled onion, chopped herbs or a squeeze of lemon all work. This is a fresher way to eat sausages than most of the other ideas here, and a useful one when the rest of the fridge doesn't offer much beyond salad and yoghurt.",
    ],
  },
  {
    title: 'Sausage and pepper frittata',
    paragraphs: [
      "Leftover cooked sausages, sliced, go into a frittata with peppers and any small amounts of vegetables that aren't quite enough on their own for anything else. It's a good use for both a couple of leftover sausages and the odd half pepper or handful of spinach sitting in the fridge, and it works just as well served warm as it does cold the next day, which suits a packed lunch.",
    ],
  },
  {
    title: 'Sausage meatballs',
    paragraphs: [
      "Take the meat out of the skins, roll it into balls and cook them in a tomato sauce rather than serving the sausages whole. Because the meat is already seasoned, there's usually little need to add much beyond what's already in the sausage, which saves a step compared with making meatballs from plain mince and taste-testing the seasoning as you go.",
    ],
  },
  {
    title: 'Sausage and potato hash',
    paragraphs: [
      'A pan of diced potato, onion and sliced sausage, fried until the potato is properly browned and any other vegetables that need using are worked in. It uses up both leftover cooked sausages and the last of a bag of potatoes without much fuss, and holds up well finished with a fried egg on top.',
    ],
  },
  {
    title: 'Making a pack go further',
    paragraphs: [
      "Sausages vary a good deal in price depending on meat content, brand and pack size, so it isn't accurate to call them cheap as a rule. As one example, checked on Tesco's website on 25 July 2026, Tesco British Pork Sausages 8 Pack (454g) cost £1.79 (£3.94 per kg), while Tesco Finest 6 Pork Sausages (400g) cost £3.30 for a smaller pack (£8.25 per kg). Prices like these are examples rather than a fixed rule, and it's worth checking pack and unit prices against each other when deciding what to buy.",
      "What tends to make sausages cost-effective isn't the price on the pack, but how far their flavour is spread. A tomato pasta sauce made with four crumbled sausages can serve more people than four sausages presented whole on a plate, because the meat is seasoning the whole dish rather than making up the entire portion. The same idea applies to the bean stew, the lentil casserole and the hash.",
    ],
  },
  {
    title: 'A note on food safety',
    paragraphs: [
      'Cook sausages according to the pack instructions, keep raw and cooked sausages separate, and cool and refrigerate leftovers promptly, reheating them until steaming hot all the way through.',
      'Rice needs a little more care. Cool cooked rice quickly, ideally within an hour, keep it in the fridge for no more than a day, and reheat it only once until steaming hot throughout. Rice left at room temperature for too long may become unsafe, and reheating does not necessarily put that right.',
    ],
  },
  {
    title: 'In short',
    paragraphs: [
      "None of this needs unfamiliar ingredients or a shopping trip beyond the usual list. A pack of sausages that would otherwise become the same dinner twice in a fortnight can go nine different directions just by changing how it's used: sliced instead of whole, crumbled into a sauce, or paired with something fresher. Sometimes variety comes less from what's in the fridge and more from what's done with it.",
    ],
  },
];

export const SAUSAGE_WAYS_GUIDE_FAQS = [
  {
    question: 'Can sausages be cooked from frozen?',
    answer: 'Many can, but not all. Check the pack first and allow extra time where necessary. They should be cooked thoroughly and steaming hot all the way through, with no pink meat inside.',
  },
  {
    question: 'How long do cooked sausages keep?',
    answer: "Cooled and refrigerated promptly, cooked sausages are best eaten within two days, or frozen if that's not going to happen.",
  },
  {
    question: 'Which of these ideas work with vegetarian sausages?',
    answer: 'Most of them, though not every vegetarian sausage comes in a casing that peels away and crumbles the way a pork sausage does. Some are softer or already loose-textured, so they may suit slicing better than crumbling. Check the product before using it for the pasta or meatball ideas.',
  },
];

export function getSausageWaysGuideJsonLd() {
  const guide = SAUSAGE_WAYS_GUIDE;
  const url = `https://dinnerbydesign.app${SAUSAGE_WAYS_GUIDE_PATH}`;
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
        mainEntity: SAUSAGE_WAYS_GUIDE_FAQS.map(faq => ({
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

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));

export function renderSausageWaysGuideInitialHtml() {
  const guide = SAUSAGE_WAYS_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(SAUSAGE_GUIDE_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(SAUSAGE_GUIDE_DISCLOSURE_FOOTER);
  const sections = SAUSAGE_WAYS_GUIDE_SECTIONS.map(section => {
    const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : '';
    return `<section>${heading}${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`;
  }).join('');
  const faqs = SAUSAGE_WAYS_GUIDE_FAQS.map(faq => `<section><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></section>`).join('');
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Practical cooking guide</nav><p>Practical cooking guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 25 July 2026 · Last reviewed 25 July 2026</p><article>${sections}${disclosures}<section><h2>Frequently asked questions</h2>${faqs}</section><section><h2>Sources</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Find sausage recipes for dinner</h2><p>Search DinnerByDesign for sausage recipes that suit your time, budget and preferences.</p><p><a href="/signin">Find sausage recipes</a></p></section></main></div>`;
}
