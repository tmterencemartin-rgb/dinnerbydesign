import type { ProgrammaticDisclosureKey } from './programmaticDisclosures';
import {
  FIVE_A_DAY_DISCLOSURE_FOOTER,
  FIVE_A_DAY_DISCLOSURES,
  renderProgrammaticDisclosureFooterInitialHtml,
  renderProgrammaticDisclosuresInitialHtml,
} from './programmaticDisclosures';

export const FIVE_A_DAY_GUIDE_PATH = '/guides/do-vegetables-in-dishes-count-towards-5-a-day';

export const FIVE_A_DAY_GUIDE = {
  title: 'Do vegetables in dishes count towards your 5 A Day?',
  seoTitle: 'Vegetables in dishes and your 5 A Day | DinnerByDesign',
  description: 'Find out how vegetables in Bolognese, paella, chilli and other dishes count towards your 5 A Day, including portions and the effect of cooking.',
  publishedAt: '2026-07-24',
  reviewedAt: '2026-07-24',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Nutrition guide',
  primarySearchIntent: 'Understand whether vegetables cooked into a dish count towards 5 A Day and how portions should be calculated',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-07-24',
  editorialNotes: 'Keep the portion rules aligned with current NHS guidance. The worked calculation is illustrative and does not represent a specific DinnerByDesign recipe.',
  internalLinks: ['/guides', '/nutrition-methodology', '/signin'],
  disclosures: ['serving_assumption', 'source_timing'] satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'NHS: 5 A Day, what counts?', url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/' },
    { label: 'NHS: 5 A Day portion sizes', url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/' },
    { label: 'NHS: Why 5 A Day?', url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/why-5-a-day/' },
    { label: 'British Heart Foundation: What counts as 5-a-day?', url: 'https://www.bhf.org.uk/informationsupport/heart-matters-magazine/nutrition/5-a-day/what-counts-as-5-a-day' },
    { label: 'American Journal of Clinical Nutrition: Lycopene bioavailability study', url: 'https://doi.org/10.1093/ajcn/66.1.116' },
  ],
};

export function getFiveADayGuideJsonLd() {
  const guide = FIVE_A_DAY_GUIDE;
  const url = `https://dinnerbydesign.app${FIVE_A_DAY_GUIDE_PATH}`;
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

export function renderFiveADayGuideInitialHtml() {
  const guide = FIVE_A_DAY_GUIDE;
  const disclosures = renderProgrammaticDisclosuresInitialHtml(FIVE_A_DAY_DISCLOSURES);
  const footer = renderProgrammaticDisclosureFooterInitialHtml(FIVE_A_DAY_DISCLOSURE_FOOTER);
  const sources = guide.sources.map(source => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><header><a href="/">DinnerByDesign</a></header><main><nav aria-label="Breadcrumb"><a href="/">DinnerByDesign</a> / <a href="/guides">Guides</a> / Nutrition guide</nav><p>Nutrition guide</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><p>By ${escapeHtml(guide.editorialOwner)} · Published 24 July 2026 · Last reviewed 24 July 2026</p><article><section><p>Onion, carrot, celery and tomato go into the pan for a Bolognese. Four vegetables, and a natural assumption follows: that is four portions of your 5 A Day, sorted. It is not quite that simple, though the vegetables are not wasted either.</p><p>They still count. Cooking, mixing and serving vegetables inside a dish does not cancel them out. What changes is the maths, not the eligibility.</p></section><section><h2>Vegetables cooked into a dish still count</h2><p>The NHS is direct on this point: fruit and vegetables do not have to be eaten on their own to count, and they do not have to be fresh. Frozen, tinned and dried varieties are all eligible, and so are vegetables cooked into soups, stews, curries and pasta sauces.</p><p>That covers much of what a UK household cooks on a weeknight. A chilli made with tinned tomatoes and kidney beans, a paella built on peppers and peas, or a curry base of onion and garlic can all contribute. Cooking a vegetable into a sauce does not remove it from the count.</p><p>Base ingredients people may overlook can contribute too. Onion counts when enough reaches the plate. Concentrated tomato purée follows a different calculation from fresh tomato, with one heaped tablespoon counting as a portion.</p></section><section><h2>Variety and portion count are not the same thing</h2><p>This is where the confusion usually starts. Four vegetable varieties in a recipe reads as four portions, but a portion is a quantity, not a headcount of ingredients.</p><p>An adult portion is roughly 80g of eligible vegetable, and it has to reach the plate. A Bolognese made with onion, carrot, celery and tomato may deliver only one or two full portions per serving once the total vegetable weight is divided across everyone eating it. The dish contains four varieties. It is unlikely to contain four portions.</p><p>Potatoes are a separate case and worth flagging early. They are classed as a starchy food by the NHS, not a vegetable, so they do not count towards the total, however they are cooked.</p></section><section><h2>Working out what a dinner is actually giving you</h2><p>For ordinary fresh, frozen or tinned vegetables, the calculation is straightforward once the ingredient weights are known. Purées, dried produce, beans and pulses each follow their own rule instead. Add up the eligible vegetable weight in the full recipe, divide by the number of servings, then divide that figure by 80.</p><ul><li>800g eligible vegetables in the pot</li><li>Recipe serves four</li><li>200g vegetables per serving</li><li>200 ÷ 80 = roughly 2.5 portions per serving</li></ul><p>Treat that as an estimate rather than a fixed figure. Trimming, ingredient swaps and how generously a dish is served can all move the number up or down. A recipe listing four vegetables and a recipe delivering four portions on the plate are two different things, and the gap between them is usually where people overestimate.</p></section>${disclosures}<section><h2>Does cooking reduce the benefit?</h2><p>Some vitamins are heat-sensitive, and prolonged cooking does reduce levels of certain ones, vitamin C among them. That is a real trade-off, not a reason to write off cooked vegetables generally.</p><p>Cooking can also improve access to certain nutrients. The clearest evidence is for tomatoes: a controlled trial found that lycopene from tomato paste was substantially more available to the body than the same dose from fresh tomato, when both were eaten alongside a source of fat. That finding is specific to tomatoes and to this comparison. It is not a general rule that cooking improves nutrient absorption across vegetables.</p><p>Tinned, frozen and dried forms can all contribute, though not always by the same rule. Tinned and frozen vegetables match fresh weight for weight. Dried fruit is measured differently, at 30g rather than 80g. Beans and pulses can count only once per day, however much of them you eat.</p></section><section><h2>Getting more from dinners you already cook</h2><p>Reaching a higher portion count rarely means changing what is on the menu. Smaller adjustments to a recipe already in rotation tend to move the number more than switching to something new.</p><p>Bulking a Bolognese or chilli with extra tinned tomatoes or added vegetables such as mushrooms and peppers raises the total vegetable weight without changing the dish. Beans and pulses are a partial exception: a second tin adds volume and fibre, but it does not add a second portion, since beans and pulses can count only once per day.</p><p>The ratio of sauce to servings matters too. Stretching a sauce from four servings to six leaves each serving at about two-thirds of its original amount. The drop still reduces what each person gets.</p></section><section><h2>The short version</h2><p>A dish with several vegetable ingredients is not the same as a dish with several portions. Cooking does not disqualify a vegetable from the 5 A Day count, and tinned, frozen and dried forms can all contribute, though each follows its own rule rather than one shared 80g calculation. What determines the portion figure is weight per serving, not the number of vegetables listed. Working that out, even roughly, is a better guide than counting ingredients on the packet.</p></section><section><h2>Sources and further reading</h2><ul>${sources}</ul></section>${footer}</article><section><h2>Put the vegetables you have to use</h2><p>Tell DinnerByDesign what needs using, along with your time, budget and preferences, and find a dinner that fits.</p><p><a href="/signin">Find a dinner</a></p></section></main></div>`;
}
