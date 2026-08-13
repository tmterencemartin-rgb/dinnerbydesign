import {
  FAMILY_FUSSY_EATERS_DISCLOSURE_FOOTER,
  FAMILY_FUSSY_EATERS_DISCLOSURES,
  type ProgrammaticDisclosureKey,
} from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

export const FAMILY_FUSSY_EATERS_GUIDE_PATH = '/guides/family-dinners-for-fussy-eaters-one-base-flexible-finishes';

export const FAMILY_FUSSY_EATERS_GUIDE = {
  title: 'Family dinners for fussy eaters: one base, flexible finishes',
  seoTitle: 'Family dinners for fussy eaters: one base, flexible finishes | DinnerByDesign',
  description: 'A practical way to cook one mild base and finish it differently for children and adults, with flexible formats, freezer planning and food-safety guidance.',
  publishedAt: '2026-08-13',
  reviewedAt: '2026-08-13',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Plan family dinners for children with different food preferences using one mild base and flexible finishes',
  indexingStatus: 'index' as const,
  contentReviewedAt: '2026-08-13',
  editorialNotes: 'Draft V approved 13 August 2026. The 1kg mince quantity is explicitly presented as a planning estimate, not a tested recipe yield. Food-safety guidance was checked against current Food Standards Agency pages and child-feeding guidance was checked against Healthier Together.',
  internalLinks: [
    '/dinner-plans/5-affordable-family-dinners-for-four',
    '/food-costs/batch-cooking-on-a-budget',
    '/food-costs/portion-planning-and-food-waste',
    '/food-safety',
    '/recipe-methodology',
    '/pricing-methodology',
  ],
  disclosures: FAMILY_FUSSY_EATERS_DISCLOSURES.map(disclosure => disclosure.key) satisfies ProgrammaticDisclosureKey[],
  sources: [
    { label: 'Food Standards Agency: Cooking your food', url: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food' },
    { label: 'Food Standards Agency: How to chill, freeze and defrost food safely', url: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely' },
    { label: 'Healthier Together: Taste, texture and food fussiness', url: 'https://sybhealthiertogether.nhs.uk/parentscarers/general-wellbeing/food-eating/taste-texture-and-food-fussiness' },
  ],
};

export const FAMILY_FUSSY_EATERS_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    rawHtml: `<p>One person wants pasta with nothing on it. Someone else wants a dinner with a bit of spice. You're standing at the hob wondering whether tonight is, again, going to mean two or three separate dinners.</p><p>This is an ordinary problem in households where children eat differently from each other or from the adults. It's rarely about fussiness alone. Texture matters to a lot of children. So does familiarity. Some find a plate with everything touching genuinely harder to manage than the same food served apart.</p><p>The method below won't resolve every eating difficulty, and it isn't trying to. What it offers is a way to cook one dinner that finishes several ways, so the person cooking isn't running two or three separate jobs on a weeknight. One base, several finishes, fewer separate jobs.</p><section><h2>What “one base, flexible finishes” means</h2><p>Start with something mild. A tomato and mince base, a pot of shredded chicken, a tray of roasted vegetables: none of it needs seasoning strong enough to suit everyone, because the seasoning happens afterwards, not during cooking.</p><p>Keep the strong stuff separate. Chilli, harissa, a sharper sauce, a spoon of mustard stirred through for the adults: these sit in small bowls at the table rather than in the pan. Each person then finishes or assembles their own serving, which is a different job from cooking five different dinners. It's one dinner with several endings.</p><p>Whatever base is left gets stored properly and used again within a few days, ideally with a different format the second time round so it doesn't read as a repeat. A base cooked on Monday can turn up as a jacket potato filling on Wednesday without anyone feeling short-changed.</p></section><section><h2>Five base formats that work this way</h2><p>These are the formats that tend to hold up across a working week. Each one supports more than one finish, and each one can be scaled up deliberately so there's something left for later.</p><h3>Mild tomato base with beef, lentils or beans</h3><p>Cooked gently with onion, tomato and a small amount of stock, this is plain enough to serve over pasta with nothing more than grated cheese. The same pot, warmed through with a spoonful of chilli or paprika stirred in separately, becomes an adult's dinner. It also works over rice, in a jacket potato, or as a filling for a wrap.</p><h3>Plain shredded chicken or chicken thighs</h3><p>Poached or roasted without strong seasoning, chicken like this can go into a bowl with rice and cucumber for a child who wants things kept apart, or get tossed through a sauce for someone who doesn't. It keeps well and reheats without drying out if handled carefully.</p><h3>Baked potatoes with separate fillings</h3><p>The potato does most of the work here. Butter and cheese for one plate, baked beans or the tomato base for another, a sharper filling for the adults. Nothing needs to be cooked twice, only served differently.</p><h3>Rice with a mild protein and optional toppings</h3><p>A pan of plain rice with plain chicken, tofu or beans sitting alongside it lets each person build their own bowl. Toppings such as grated cheese, sweetcorn or a mild sauce stay in small dishes rather than mixed through everything.</p><h3>Soft roasted vegetables with pasta, couscous or flatbreads</h3><p>Roasted courgette, pepper and squash can be blended into a smooth sauce if that texture is more acceptable, left visible and separate for another child, and dressed with a stronger sauce for the adults. This is one option among several, not a rule, and some children do better when vegetables stay recognisable rather than hidden.</p></section><section><h2>Making it work on an ordinary weeknight</h2><p>Strong flavours go on last. Chilli, fresh herbs, a squeeze of lime: added at the table rather than in the pan, so the base itself stays neutral enough for everyone.</p><p>One familiar item alongside something less familiar may be easier for some children than presenting an entirely new dinner. A child who trusts the rice is more likely to try the new topping sitting next to it.</p><p>Dips, grated cheese, yoghurt or a piece of fruit can round out a plate without anyone having to cook a second dinner from scratch. These are additions, not compensations, and they're worth keeping stocked for exactly this purpose.</p><p>A plain component is a legitimate part of the dinner, not a failure of the dinner. Texture is worth checking as carefully as flavour: a child who avoids sauce may be responding to how it feels rather than how it tastes.</p><p>Where it suits the household, letting a child assemble their own wrap, bowl or jacket potato hands over some of the decision-making, which can lower resistance on its own. And leftovers used this way are a plan, not a container pushed to the back of the fridge because nobody quite knew what to do with it.</p></section><section><h2>A five-dinner example</h2><p>This plan uses one base all week: a mild tomato base with beef, lentils or beans. It's cooked once, in a larger batch than a single dinner needs, and carried through five different formats rather than restarted each night.</p><p><strong>Night one:</strong> the base freshly made, served over pasta. Plain for whoever wants it plain, chilli flakes stirred in at the table for whoever doesn't.</p><p><strong>Night two:</strong> the base over rice, with grated cheese, yoghurt or a mild sauce set out in separate small bowls.</p><p><strong>Night three:</strong> jacket potatoes, with the base as one filling option and plain butter and cheese as the other.</p><p><strong>Night four:</strong> wraps or flatbreads, filled with the base, cucumber and yoghurt laid out for anyone who wants to build their own.</p><p><strong>Night five:</strong> the last of the base under a layer of mash, baked until the top is golden. A different format again, from the same pot.</p><p>Because the base is only safe in the fridge for two days, night five's portion, and usually night four's, needs to come out of the freezer rather than the fridge. That's covered in the storage section below.</p></section><section><h2>Example shopping list</h2><p>This assumes two adults and two children, and makes roughly five portions of base, one per night. On pasta, rice and mash nights the base is the main component; on jacket potato and wrap nights it's used as a lighter filling alongside the potato or wrap itself, so the exact quantity matters less there. Adjust up or down against your own household and what's already in the cupboard.</p><p>This is a planning example rather than a tested recipe. The 1kg mince quantity is a starting estimate for a large batch, so adjust it to your household and the amount of base each dinner needs.</p><ul><li>1kg minced beef, or (vegetarian) 500g dried red lentils and 2 x 400g tins beans</li><li>4 x 400g tins chopped tomatoes, 2 onions, 4 cloves garlic, 1 stock cube</li><li>Pasta, rice, 5 to 6 baking potatoes, wraps or flatbreads</li><li>Potatoes and milk or butter, for the mash topping on night five</li><li>Grated cheese, plain yoghurt, cucumber, chilli flakes or hot sauce for the table</li><li>Freezer bags or containers, labelled with the date, for the portions cooked ahead</li></ul></section><section><h2>A short preparation plan</h2><ol><li><strong>Step one:</strong> cook the whole batch of base in one go, ideally at the weekend or whenever there's a spare hour. One large pot rather than five small ones.</li><li><strong>Step two:</strong> divide it into portions as soon as it's cooled, roughly matched to what each night needs. Keep only the portions planned for the next 48 hours in the fridge; freeze the rest.</li><li><strong>Step three:</strong> move the next frozen portion into the fridge the morning or evening before it's needed, so it's thawed and ready to reheat in time.</li><li><strong>Step four:</strong> reheat only the portion being used that night, add the format (pasta, rice, potato, wrap or mash), and put out the separate finishes.</li></ol></section><section><h2>Storage and leftovers</h2><p>Cooked food should go into the fridge or freezer within two hours, not left out to cool on the side for longer than that. Once refrigerated, this kind of base is best eaten within 48 hours, which is why the plan above splits it between fridge and freezer rather than keeping five days' worth in the fridge at once. Frozen portions should be labelled with the date and thawed in the fridge, not on the counter; once thawed, eat within 24 hours and don't refreeze. As a general quality guide, home-frozen batches like this are usually best used within a few months, though that's about flavour and texture rather than safety. When reheating, the base needs to be steaming hot all the way through, not just warmed, and each portion should only be reheated once. This follows current <a href="https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food">Food Standards Agency guidance on cooking your food</a> and on <a href="https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely">chilling, freezing and defrosting safely</a>, both worth checking directly for anything not covered here.</p></section><section><h2>Shopping and cost</h2><p>Buying for one base rather than five separate dinners tends to cut down on the small, disconnected purchases that push a weekly shop higher than planned. Costed examples and up-to-date pricing for individual recipes sit within each recipe page rather than in this guide, and the methodology behind those figures is set out separately below.</p></section><section><h2>Safety and suitability</h2><p>Cooking instructions on packaging should be followed rather than judged by eye, particularly for mince, chicken and any product where undercooking carries a real risk. Allergen labels are worth checking every time, including on stock cubes, sauces and any product bought as a substitute for a usual brand, since formulations do change.</p><p>Portion size and texture should be adapted to a child's age and ability. Where there's a swallowing difficulty, a diagnosed allergy or a significant feeding concern, that's a conversation for a GP, dietitian or health visitor rather than a dinner-planning guide. This page is about making weeknight cooking more manageable, not a substitute for medical or behavioural advice.</p></section><section><h2>How DinnerByDesign can help</h2><p>Search DinnerByDesign for a mild base you'd cook once and carry across a week, such as a tomato and lentil sauce or a plain roast chicken, and you can use the results to plan this kind of reuse. Once you've found one, the seven-day planner lets you place it early in the week and its later formats further along, and the costed shopping list groups the ingredients into one trip rather than several. Preferences can be adjusted as a household's needs change, which matters when what worked last month has stopped working this month. For related planning, see <a href="/dinner-plans/5-affordable-family-dinners-for-four">5 affordable family dinners for four</a>, <a href="/food-costs/batch-cooking-on-a-budget">batch cooking on a budget</a>, and <a href="/food-costs/portion-planning-and-food-waste">portion planning and food waste</a>. Details on ingredient sourcing and cost figures sit in our <a href="/recipe-methodology">recipe methodology</a> and <a href="/pricing-methodology">pricing methodology</a>.</p></section>`,
  },
];

export const FAMILY_FUSSY_EATERS_GUIDE_RECORD: PublicGuideRecord = {
  id: 'family-dinners-for-fussy-eaters-one-base-flexible-finishes',
  slug: 'family-dinners-for-fussy-eaters-one-base-flexible-finishes',
  path: FAMILY_FUSSY_EATERS_GUIDE_PATH,
  canonicalPath: FAMILY_FUSSY_EATERS_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'safety-sensitive',
  ...FAMILY_FUSSY_EATERS_GUIDE,
  metaDescription: FAMILY_FUSSY_EATERS_GUIDE.description,
  label: 'Family dinner guide',
  nextReviewAt: '2027-08-13',
  disclosureItems: FAMILY_FUSSY_EATERS_DISCLOSURES,
  disclosureFooter: FAMILY_FUSSY_EATERS_DISCLOSURE_FOOTER,
  sections: FAMILY_FUSSY_EATERS_GUIDE_SECTIONS,
  faqs: [
    {
      question: 'How do I avoid cooking separate dinners every night?',
      answer: 'Build the dinner around one mild base that can carry several formats, and move the strong flavours to the table instead of the pan. Each person can finish their plate differently, but only one thing has been cooked.',
    },
    {
      question: 'What if a child dislikes mixed textures?',
      answer: 'Keep components separate rather than combined. Rice, base and toppings in their own space on the plate, or in their own bowl, can work better for a child who finds mixed food harder to manage than the same ingredients kept apart.',
    },
    {
      question: 'Is this the same as hiding vegetables in the dinner?',
      answer: "No. Blending vegetables into a base is one option among several, offered for texture reasons, not as a way to get round what a child will and won't eat. Some readers will know this territory as picky eating rather than fussy eating; the practical answer is the same either way.",
    },
    {
      question: 'Can I use a different base?',
      answer: 'Yes. Plain shredded chicken, a lentil and tomato base, beans or soft roasted vegetables can all work. Keep the base mild, store portions safely and change the format or finishes so the later dinner feels different.',
    },
  ],
  cta: {
    title: 'Find a flexible dinner base',
    copy: 'Search DinnerByDesign for a base that suits your household, then adapt the formats, preferences and shopping list around the week ahead.',
    label: 'Find recipes',
    href: '/signin',
  },
  sourcesTitle: 'Sources and further reading',
};

export function getFamilyFussyEatersGuideJsonLd() {
  return getPublicGuideJsonLd(FAMILY_FUSSY_EATERS_GUIDE_RECORD);
}

export function renderFamilyFussyEatersGuideInitialHtml() {
  return renderPublicGuideInitialHtml(FAMILY_FUSSY_EATERS_GUIDE_RECORD);
}
