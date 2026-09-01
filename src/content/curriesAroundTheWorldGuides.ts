import type { ProgrammaticDisclosureKey, ProgrammaticDisclosureItem, ProgrammaticDisclosureFooterCopy } from './programmaticDisclosures';
import {
  getPublicGuideJsonLd,
  renderPublicGuideInitialHtml,
  type PublicGuideRecord,
  type PublicGuideSection,
} from './publicGuideModel';

const CURRIES_DISCLOSURES: ProgrammaticDisclosureItem[] = [
  {
    key: 'source_timing',
    title: 'About the sources',
    body: 'Recipe pages, publisher access and cooking times can change. The links below take you to the original pages, where the current method, ingredients, serving information and availability should be checked before cooking.',
  },
  {
    key: 'allergen_and_product',
    title: 'Ingredients and allergens',
    body: 'Publisher recipes and packaged ingredients vary. Check the original recipe and every product label, especially curry pastes, fish sauce, shrimp paste, stock, yoghurt, bread and other prepared ingredients.',
  },
] satisfies ProgrammaticDisclosureItem[];

const CURRIES_DISCLOSURE_FOOTER: ProgrammaticDisclosureFooterCopy = {
  body: 'DinnerByDesign summarises published recipe and cuisine information to help with comparison. It does not reproduce publisher recipes, and the linked publishers are not partners or endorsers of DinnerByDesign.',
  links: [
    { href: '/recipe-methodology', label: 'Recipe and recommendation methodology' },
    { href: '/food-safety', label: 'Dietary, allergy and cooking safety' },
  ],
};

const CURRIES_DISCLOSURE_KEYS = CURRIES_DISCLOSURES.map(item => item.key) as ProgrammaticDisclosureKey[];

export const CURRIES_AROUND_THE_WORLD_GUIDE_PATH = '/guides/curries-around-the-world';
export const INDIAN_REGIONAL_CURRIES_GUIDE_PATH = '/guides/indian-regional-curries';

const currySourceLinks = {
  sriLankan: 'https://www.olivemagazine.com/recipes/meat-and-poultry/kolambas-chicken-curry/',
  thai: 'https://www.deliciousmagazine.co.uk/recipes/the-ultimate-thai-green-curry/',
  japanese: 'https://www.olivemagazine.com/recipes/quick-and-easy/japanese-chicken-broccoli-and-mushroom-curry/',
  rendang: 'https://www.olivemagazine.com/recipes/meat-and-poultry/john-torodes-beef-rendang/',
  trinidadian: 'https://www.olivemagazine.com/recipes/meat-and-poultry/trini-curry-goat/',
  kukuPaka: 'https://thehappyfoodie.co.uk/recipes/aysha-boras-coconut-chicken-curry-kuku-paka/',
  capeMalay: 'https://www.harighotra.co.uk/cape-malay-chicken-curry-recipe',
  dalMakhani: 'https://www.deliciousmagazine.co.uk/recipes/dal-makhani/',
  bengali: 'https://www.deliciousmagazine.co.uk/recipes/easy-bengali-fish-curry/',
  roganJosh: 'https://www.deliciousmagazine.co.uk/recipes/kashmiri-lamb-shank-rogan-josh/',
  vindaloo: 'https://www.deliciousmagazine.co.uk/recipes/pork-vindaloo/',
  meenMoilee: 'https://www.deliciousmagazine.co.uk/recipes/meen-moilee-keralan-fish-curry/',
  chettinad: 'https://www.olivemagazine.com/recipes/meat-and-poultry/chettinad-chicken-curry/',
} as const;

const CURRIES_AROUND_THE_WORLD_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    rawHtml: `<section>
      <h2>Introduction</h2>
      <p>“Curry” does not name a single dish. In English, the word is applied to a wide range of spiced sauces, dry-fried pastes and slow-cooked stews from South Asia, Southeast Asia, East Africa, the Caribbean and beyond. Each has its own name, technique and history in its home country. A Sri Lankan chicken curry, Japanese curry rice and Trinidadian curry goat share little beyond a pot and a spoonful of spice.</p>
      <p>The word’s origins are debated. The most widely supported account traces it to a Dravidian word for a spiced dish or sauce eaten with rice, often identified as the Tamil <em>kari</em>. It is thought to have passed into European languages through Portuguese traders before the British applied it more broadly across South Asia. Local names remain important: English-language writing may add “curry” to help readers find their way, while the dishes themselves belong to more specific traditions.</p>
      <p>This guide sets out how the main traditions differ, what to look for when choosing a recipe and how to plan a dinner around whichever direction appeals, from a quick Thai curry made with a shop-bought paste to a long-cooked Indonesian rendang.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Indian regional curries</h2>
      <p>North and South India alone produce so many distinct styles that “Indian curry” is shorthand for dozens of traditions. Punjabi-style gravies often lean on ghee, onion, tomato and dairy, built up with garam masala, cumin and dried fenugreek leaves. Further south, coconut, curry leaves, mustard seed and tamarind become more prominent, and tempering may be poured over the finished dish rather than built in from the start.</p>
      <p>A Kerala fish curry and a Punjabi butter chicken may both be called Indian curry in English, but their cooking fat, souring agent and spice technique differ. Vegetarian versions are widespread, and quick dishes exist alongside long-cooked gravies. Ghee can be swapped for a neutral oil as a practical substitution, with some loss of richness.</p>
      <p>For the detail behind this broad comparison, read <a href="${INDIAN_REGIONAL_CURRIES_GUIDE_PATH}">Indian Regional Curries Explained</a>.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Sri Lankan curries</h2>
      <p>Sri Lankan curries share ingredients with South India, including coconut milk, curry leaves and mustard seed, but the spice blend has its own character. Roasted curry powder is toasted dark before grinding, giving a smoky, bitter edge. Cinnamon, cardamom, cloves and pandan may appear alongside it, with dishes ranging from a mild white curry to a fiery, almost dry black pork curry.</p>
      <p>Rice and curry is often a spread of several small curries, a sambol and rice rather than one dish with a side. Vegetable curries using runner beans, jackfruit or cashew are common, and many recipes come together fairly quickly once the spice paste is ready.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Thai curries</h2>
      <p>Thai curry is defined more by its paste than by a fixed spice cupboard. Red and green pastes commonly use chilli, lemongrass, galangal, garlic and shallot. Red paste usually uses dried chillies, while green paste uses fresh ones and can be hotter than its colour suggests. Yellow curry brings turmeric and tends to be milder, massaman adds warm spices such as cinnamon, cardamom and cumin, and panang makes a thicker sauce with ground peanuts.</p>
      <p>Shop-bought paste can make a Thai curry a practical weeknight choice. Vegetarian versions need fish sauce and shrimp paste replaced with suitable alternatives, and the flavour balance will change. The linked <a href="${currySourceLinks.thai}">ultimate Thai green curry</a> is a direct publisher example.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Japanese curry</h2>
      <p>Japanese curry, or <em>karē raisu</em>, has a different lineage. It arrived through the British navy in the late nineteenth century as a European-style stew thickened with a butter-and-flour roux and seasoned with curry powder. The Japanese version retained the roux, softened the spicing and often added sweetness from grated apple, honey or ketchup.</p>
      <p>The result is a thick, stew-like sauce with onion, carrot and potato, commonly served with chicken, pork or beef. Boxed roux cubes combine seasoning and thickening, which makes this one of the quicker curry styles to prepare. See the linked <a href="${currySourceLinks.japanese}">Japanese chicken and broccoli curry</a> for a publisher example.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Malaysian and Indonesian curries</h2>
      <p>Malay and Indonesian cooking includes wet, spiced coconut curries such as curry kapitan and dry, long-cooked dishes such as rendang. In rendang, meat cooks with coconut milk and spice paste until the liquid reduces and the meat begins to fry gently in its own oil. Versions differ between regions and households in their cooking time, ingredients and finishing method.</p>
      <p>Both countries also have laksa, a noodle soup built around a curry broth. Long ingredient lists can make these dishes slower to assemble, although a jarred paste can reduce the work. The linked <a href="${currySourceLinks.rendang}">John Torode beef rendang</a> is a long-cooked publisher example.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Caribbean curry dishes</h2>
      <p>Caribbean curry developed through the cooking of Indian communities brought to Trinidad and Guyana during the nineteenth century. Trinidad-style curry powder is worked into a paste with garlic, ginger and green seasoning. Curry goat and curry chicken are familiar examples, browned in the spice paste before liquid is added and served with rice, roti or both.</p>
      <p>Goat needs longer cooking to become tender, while chicken versions are generally quicker. A <a href="${currySourceLinks.trinidadian}">Trinidadian curry goat</a> gives one source-led route into the style.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>East African curries</h2>
      <p>Along the Swahili coast and inland into Kenya, Tanzania and Uganda, curry reflects Gujarati and Goan migration as well as local coastal cooking. Kuku paka combines spiced chicken, coconut, tomato and chilli. In the linked recipe, the chicken is marinated for one to five hours, grilled for colour and flavour, then finished in the coconut sauce. It is better suited to a relaxed weekend than a rushed weeknight.</p>
      <p>The linked <a href="${currySourceLinks.kukuPaka}">Kuku paka recipe</a> comes from a family with roots in Tanzania. Vegetable and pulse dishes such as ndengu made with mung dal offer a quicker, plant-based route into the region’s flavours.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>South African Cape Malay curries</h2>
      <p>Cape Malay curry comes from the Muslim communities of Bo-Kaap in Cape Town, whose history includes people brought to the Cape from Indonesia, Malaysia and India from the seventeenth century onwards. The cooking uses a fragrant blend of cumin, coriander, turmeric, cinnamon and cardamom, sometimes balanced with dried fruit and a light sour edge.</p>
      <p>Chicken and lamb versions are commonly served with yellow rice and sambals. The fruit-forward sweetness can make this a gentler starting point for a household that finds chilli-heavy dishes difficult. The linked <a href="${currySourceLinks.capeMalay}">Cape Malay chicken curry</a> is one publisher example.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Comparison table</h2>
      <p>Use this as a starting point rather than a fixed rule. Individual households and regions within each country vary, sometimes considerably.</p>
      <div class="guide-table-wrap"><table><thead><tr><th>Tradition</th><th>Typical flavour base</th><th>Texture</th><th>Common methods</th><th>Suitable ingredients</th></tr></thead><tbody>
        <tr><td>Indian, North</td><td>Ghee, onion, tomato, garam masala</td><td>Thick, creamy</td><td>Slow-simmered gravy</td><td>Chicken, paneer, lentils</td></tr>
        <tr><td>Indian, South</td><td>Coconut, curry leaves, tamarind</td><td>Thinner, tangy</td><td>Tempering and quick simmer</td><td>Fish, lentils, vegetables</td></tr>
        <tr><td>Sri Lankan</td><td>Roasted curry powder, coconut, pandan</td><td>Mild to dry-roasted</td><td>Simmered, several small dishes</td><td>Vegetables, chicken, seafood</td></tr>
        <tr><td>Thai</td><td>Fresh paste, chilli, lemongrass, galangal</td><td>Thin to thick, coconut-based</td><td>Quick simmer</td><td>Chicken, beef, tofu</td></tr>
        <tr><td>Japanese</td><td>Roux, butter, flour, curry powder</td><td>Thick, stew-like</td><td>Slow-braised stew</td><td>Beef, pork, root vegetables</td></tr>
        <tr><td>Malaysian and Indonesian</td><td>Candlenut, galangal, tamarind, coconut</td><td>Wet or dry and reduced</td><td>Long simmer or dry-fry</td><td>Chicken, beef</td></tr>
        <tr><td>Caribbean</td><td>Trinidad curry powder, green seasoning</td><td>Thick, wet</td><td>Browned, then slow-simmered</td><td>Goat, chicken, chickpeas</td></tr>
        <tr><td>East African</td><td>Coconut, tomato, mild spice</td><td>Light, coconut-forward</td><td>Quick simmer or grill then simmer</td><td>Chicken, mung dal, vegetables</td></tr>
        <tr><td>Cape Malay</td><td>Mild spice blend, dried fruit, vinegar</td><td>Thick, slightly sweet</td><td>Slow-simmered</td><td>Chicken, lamb</td></tr>
      </tbody></table></div>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Choosing a curry by preference</h2>
      <p>If time is short, a Thai curry made with a shop-bought paste, a quick East African ndengu or a tempered South Indian dal can fit inside 45 minutes. For a low-cost dinner, coconut milk, everyday spices and vegetables or pulses already in the cupboard can open several routes, although specialist ingredients and current shop prices vary.</p>
      <p>Vegetarian and vegan cooks have plenty of choice in South Indian and Sri Lankan traditions, where lentil, chickpea and vegetable curries are established dishes. Fish and seafood curries are particularly well established in Kerala, Sri Lanka and East Africa.</p>
      <p>For a milder dinner, Cape Malay and Japanese curry are two gentle starting points. Slower options include Caribbean curry goat, Indonesian rendang and East African kuku paka once its marinating time is included. These suit a day when there is time for cooking and planned leftovers.</p>
      <p>Air-fryer or oven-baked sides can work alongside many curries. Bhajis, papadums and flatbreads can be prepared separately while the curry finishes on the hob. If the shopping list is driven by what is already in the cupboard, coconut milk, tinned tomatoes and pulses give a practical starting point.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Source-led recipe examples</h2>
      <p>These named publisher recipes are starting points for exploring the traditions above. Each link opens the original publisher page. DinnerByDesign does not reproduce the recipes, and nothing here implies a partnership or endorsement.</p>
      <ul>
        <li><a href="${currySourceLinks.sriLankan}">Sri Lankan chicken curry from Kolamba</a>, olive magazine</li>
        <li><a href="${currySourceLinks.thai}">The ultimate Thai green curry</a>, delicious. magazine</li>
        <li><a href="${currySourceLinks.japanese}">Japanese chicken and broccoli curry</a>, olive magazine</li>
        <li><a href="${currySourceLinks.rendang}">John Torode’s beef rendang</a>, olive magazine</li>
        <li><a href="${currySourceLinks.trinidadian}">Trinidadian curry goat</a>, olive magazine</li>
        <li><a href="${currySourceLinks.kukuPaka}">Kuku paka</a>, The Happy Foodie</li>
        <li><a href="${currySourceLinks.capeMalay}">Cape Malay chicken curry</a>, Hari Ghotra</li>
      </ul>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>How DinnerByDesign can help</h2>
      <p>Searching by cuisine name only goes so far when traditions overlap. DinnerByDesign lets you search by ingredient, cuisine, cooking method, dietary preference, time and budget together, as well as by preferred recipe source. A search can begin with “chicken, 30 minutes, mild” rather than a cuisine name someone may not know.</p>
      <p><a href="/signin">Search DinnerByDesign</a> for a curry style, ingredient or cooking method, then compare source-backed recipes and plan the dinners that suit your household.</p>
    </section>`,
  },
  { disclosureItems: CURRIES_DISCLOSURES },
];

const CURRIES_AROUND_THE_WORLD_GUIDE_FAQS = [
  { question: 'Are all curry dishes similar?', answer: 'No. The word covers different sauces, pastes, stews and dry-cooked dishes from many culinary traditions. Texture, spice technique, souring ingredients and serving format can all differ.' },
  { question: 'Which curry is suitable for a quick dinner?', answer: 'A Thai curry made with a shop-bought paste, a quick South Indian dal or a simple East African pulse dish can be practical choices. Check the current publisher method and timing before cooking.' },
  { question: 'Which curry styles offer vegetarian choices?', answer: 'South Indian and Sri Lankan cooking include many lentil, chickpea and vegetable dishes. Thai, Japanese, Caribbean and East African traditions also have vegetarian routes, although fish sauce, shrimp paste and stock may need checking or replacing.' },
  { question: 'Which curry is likely to be milder?', answer: 'Cape Malay and Japanese curry can be gentle starting points because they rely more on warm spices than fresh chilli. Individual recipes and household tastes vary.' },
  { question: 'Can DinnerByDesign find a specific curry style?', answer: 'It can search for a cuisine, dish, ingredient or cooking method, then combine that with time, dietary preference, budget and preferred recipe source.' },
];

const CURRIES_AROUND_THE_WORLD_GUIDE_SOURCES = [
  { label: 'Sri Lankan chicken curry from Kolamba, olive magazine', url: currySourceLinks.sriLankan },
  { label: 'The ultimate Thai green curry, delicious. magazine', url: currySourceLinks.thai },
  { label: 'Japanese chicken and broccoli curry, olive magazine', url: currySourceLinks.japanese },
  { label: 'John Torode’s beef rendang, olive magazine', url: currySourceLinks.rendang },
  { label: 'Trinidadian curry goat, olive magazine', url: currySourceLinks.trinidadian },
  { label: 'Aysha Bora’s coconut chicken curry, Kuku Paka, The Happy Foodie', url: currySourceLinks.kukuPaka },
  { label: 'Cape Malay chicken curry, Hari Ghotra', url: currySourceLinks.capeMalay },
  { label: 'Oxford English Dictionary entry for curry', url: 'https://www.oed.com/dictionary/curry_n1' },
];

export const CURRIES_AROUND_THE_WORLD_GUIDE_RECORD: PublicGuideRecord = {
  id: 'curries-around-the-world',
  slug: 'curries-around-the-world',
  path: CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
  canonicalPath: CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  title: 'Curries Around the World: How to Choose the Right One for Your Kitchen',
  seoTitle: 'Curries around the world: styles, flavours and recipes | DinnerByDesign',
  description: 'A region-by-region guide to curry traditions from India to the Caribbean, with source-backed recipes and practical help choosing a dinner.',
  metaDescription: 'A region-by-region guide to curry traditions from India to the Caribbean, with source-backed recipes and practical help choosing a dinner.',
  label: 'Cuisine guide',
  publishedAt: '2026-09-01',
  reviewedAt: '2026-09-01',
  nextReviewAt: '2027-09-01',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Understand the differences between curry traditions and choose a source-backed recipe by time, flavour and dietary preference',
  indexingStatus: 'index',
  contentReviewedAt: '2026-09-01',
  editorialNotes: 'Draft IV source-led guide. Recipe links and key recipe-specific timings were checked on 1 September 2026. Historical and cultural framing remains due for a specialist review before the next annual content review.',
  internalLinks: [
    '/guides',
    INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
    '/recipes',
    '/food-costs',
    '/recipe-methodology',
    '/food-safety',
    '/signin',
  ],
  disclosures: CURRIES_DISCLOSURE_KEYS,
  disclosureItems: CURRIES_DISCLOSURES,
  disclosureFooter: CURRIES_DISCLOSURE_FOOTER,
  sources: CURRIES_AROUND_THE_WORLD_GUIDE_SOURCES,
  faqs: CURRIES_AROUND_THE_WORLD_GUIDE_FAQS,
  sections: CURRIES_AROUND_THE_WORLD_GUIDE_SECTIONS,
  cta: {
    title: 'Find a curry that fits your household',
    copy: 'Search by ingredient, time, dietary preference, budget and recipe source, then save and plan the dinners that suit you.',
    label: 'Find recipes',
    href: '/signin',
  },
};

const INDIAN_REGIONAL_CURRIES_GUIDE_SECTIONS: PublicGuideSection[] = [
  {
    rawHtml: `<section>
      <p>The hub article uses a North and South comparison to make a large subject easier to navigate. India’s curry traditions divide much further by state, community and coastline, and the differences go well beyond the amount of chilli used. This page looks at six: Punjab, Bengal, Kashmir, Goa, Kerala and Tamil Nadu.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Punjab and the North</h2>
      <p>Punjabi cooking is often associated outside India with thick, glossy gravies built on ghee or butter, onion, tomato and cream, seasoned with garam masala, cumin and dried fenugreek leaves. Butter chicken and dal makhani may be cooked slowly and finished with cream or butter. The tandoor contributes both breads such as naan, roti and kulcha, and meat that is charred before it meets the sauce.</p>
      <p>The <a href="${currySourceLinks.dalMakhani}">dal makhani from Babur restaurant</a> on delicious. magazine demonstrates a slow-cooked, dairy-finished restaurant style. A household version may be plainer and quicker.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Bengal</h2>
      <p>Bengali curries often use mustard oil and mustard seed paste, producing a sharper flavour than the ghee and cream associated with Punjabi gravies. Panch phoron, a whole-seed mixture of fenugreek, nigella, cumin, mustard and fennel, is a familiar tempering. Fish features strongly in West Bengal, a river delta and coastal state.</p>
      <p>The <a href="${currySourceLinks.bengali}">easy Bengali fish curry</a> on delicious. magazine uses panch phoron, tamarind and curry leaves rather than a raw mustard paste. It is a simplified route into related flavours rather than a definitive version of shorshe maach.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Kashmir</h2>
      <p>Kashmiri cooking sits within the geographic North but follows its own rules. Kashmiri Pandit households may cook without onion or garlic for religious reasons, using asafoetida, ginger and dried ginger powder instead. Kashmiri Muslim wazwan cooking uses onion and garlic, and households vary, so neither approach is the single correct version.</p>
      <p>Rogan josh gets its deep red colour from Kashmiri chilli and sometimes ratanjot, rather than from intense heat. The meat is browned and simmered in a yoghurt-based gravy. <a href="${currySourceLinks.roganJosh}">Vivek Singh’s Kashmiri lamb shank rogan josh</a> on delicious. magazine demonstrates the technique of whisking yoghurt in gradually to reduce the risk of splitting.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Goa</h2>
      <p>Goa’s cooking carries centuries of Portuguese influence, most clearly in vindaloo. The dish is linked to the Portuguese <em>carne de vinha d’alhos</em>, in which meat was prepared with wine, vinegar and garlic. Goan cooks developed their own versions using local vinegar, chilli and other spices. Marinating can be done the day before, while the cooking itself may be relatively short once that work is complete.</p>
      <p>The <a href="${currySourceLinks.vindaloo}">pork vindaloo</a> on delicious. magazine is a family recipe tested by the magazine’s kitchen. It represents one household’s take, since vindaloo varies between Goan kitchens.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Kerala and the Malabar coast</h2>
      <p>Kerala shares South India’s coconut, curry leaf and mustard seed base, while its coastal geography places fish and seafood near the centre of the cooking. Meen moilee is a gently spiced fish dish finished with coconut milk, turmeric and green chilli, and can be ready quickly.</p>
      <p><a href="${currySourceLinks.meenMoilee}">Atul Kochhar’s meen moilee</a> on delicious. magazine crisps the fish separately before it meets the sauce, helping the skin retain its texture. Avial, a mixed vegetable dish in coconut and yoghurt, offers a vegetarian counterpart.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Tamil Nadu and Chettinad</h2>
      <p>Chettinad food, from the trading communities of Tamil Nadu, is often described as one of India’s more heavily spiced regional cuisines. Whole spices are dry-roasted and ground for each dish, with black pepper contributing much of the heat in some preparations. This is a broad tendency rather than a fixed rule, since heat and spice balance vary between households.</p>
      <p><a href="${currySourceLinks.chettinad}">Chettinad chicken</a> from olive magazine uses a toasted, ground spice mix. A restaurant or family version in Chettinad may use more or different whole spices.</p>
      <p>Sambar and rasam are not usually filed under “curry” in English, and they are structurally different from a curry gravy. Sambar is a lentil-based vegetable stew, while rasam is a thin, spiced broth. They share a tempering technique with Chettinad and other South Indian curries, in which whole spices such as mustard seed are bloomed in hot oil and added towards the end.</p>
    </section>`,
  },
  {
    rawHtml: `<section>
      <h2>Accompaniments and practical notes</h2>
      <p>Bread is more common in the North, including naan, roti and paratha, while rice and rice-based dishes are particularly prominent further south and east. Both traditions appear throughout India. Dal and tempered vegetable dishes are often the quickest route into these regional flavours; tandoor-marinated meats, rogan josh and biryani-style dishes need longer and may benefit from preparation the day before.</p>
      <p>Ghee can be swapped for neutral oil, and fresh curry leaves for dried, with some loss of aroma. Coconut cream can stand in for coconut milk when a thicker sauce is wanted. These are practical substitutions rather than traditional versions of the dishes.</p>
    </section>`,
  },
];

const INDIAN_REGIONAL_CURRIES_GUIDE_FAQS = [
  { question: 'Is Indian curry one single style?', answer: 'No. North and South India are only a broad starting comparison. State, community, religion, geography and household practice all shape the cooking.' },
  { question: 'Which Indian regional styles use coconut?', answer: 'Coconut is especially prominent in many South Indian and coastal traditions, including Kerala and Goa, although the exact dish, coconut product and spice balance vary.' },
  { question: 'Are Kashmiri curries always made without onion and garlic?', answer: 'No. Some Kashmiri Pandit preparations avoid them for religious reasons, while Kashmiri Muslim cooking uses them. Households and communities differ.' },
  { question: 'Is vindaloo always very hot?', answer: 'No. Chilli heat varies between recipes and households. Vinegar, garlic and the broader spice balance are central to the style, while heat can be adjusted.' },
  { question: 'What is the quickest place to start?', answer: 'A dal, tempered vegetable dish or quick fish curry can be a practical introduction. Use a named publisher recipe and check its current timings and ingredient details.' },
];

const INDIAN_REGIONAL_CURRIES_GUIDE_SOURCES = [
  { label: 'Dal makhani from Babur restaurant, delicious. magazine', url: currySourceLinks.dalMakhani },
  { label: 'Easy Bengali fish curry, delicious. magazine', url: currySourceLinks.bengali },
  { label: 'Kashmiri lamb shank rogan josh, delicious. magazine', url: currySourceLinks.roganJosh },
  { label: 'Pork vindaloo, delicious. magazine', url: currySourceLinks.vindaloo },
  { label: 'Meen moilee, delicious. magazine', url: currySourceLinks.meenMoilee },
  { label: 'Chettinad chicken curry, olive magazine', url: currySourceLinks.chettinad },
];

export const INDIAN_REGIONAL_CURRIES_GUIDE_RECORD: PublicGuideRecord = {
  id: 'indian-regional-curries',
  slug: 'indian-regional-curries',
  path: INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
  canonicalPath: INDIAN_REGIONAL_CURRIES_GUIDE_PATH,
  status: 'published',
  category: 'guides',
  reviewSensitivity: 'standard',
  title: 'Indian Regional Curries Explained',
  seoTitle: 'Indian regional curries explained: six traditions and recipes | DinnerByDesign',
  description: 'A closer look at Punjabi, Bengali, Kashmiri, Goan, Keralan and Chettinad cooking, with source-backed recipes and practical substitutions.',
  metaDescription: 'A closer look at Punjabi, Bengali, Kashmiri, Goan, Keralan and Chettinad cooking, with source-backed recipes and practical substitutions.',
  label: 'Cuisine guide',
  publishedAt: '2026-09-01',
  reviewedAt: '2026-09-01',
  nextReviewAt: '2027-09-01',
  editorialOwner: 'DinnerByDesign editorial team',
  pageFamily: 'Practical cooking guide',
  primarySearchIntent: 'Understand the differences between six Indian regional curry traditions and choose a source-backed recipe',
  indexingStatus: 'index',
  contentReviewedAt: '2026-09-01',
  editorialNotes: 'Draft IV source-led regional guide. Six named publisher recipe links were checked on 1 September 2026. Historical and cultural framing remains due for a specialist review before the next annual content review.',
  internalLinks: [
    '/guides',
    CURRIES_AROUND_THE_WORLD_GUIDE_PATH,
    '/recipes',
    '/recipe-methodology',
    '/food-safety',
    '/signin',
  ],
  disclosures: CURRIES_DISCLOSURE_KEYS,
  disclosureItems: CURRIES_DISCLOSURES,
  disclosureFooter: CURRIES_DISCLOSURE_FOOTER,
  sources: INDIAN_REGIONAL_CURRIES_GUIDE_SOURCES,
  faqs: INDIAN_REGIONAL_CURRIES_GUIDE_FAQS,
  sections: INDIAN_REGIONAL_CURRIES_GUIDE_SECTIONS,
  cta: {
    title: 'Search by region, ingredient or time',
    copy: 'Use DinnerByDesign to compare source-backed recipes around the ingredients, dietary preferences and cooking time that suit your household.',
    label: 'Find recipes',
    href: '/signin',
  },
};

export function getCurriesAroundTheWorldGuideJsonLd() {
  return getPublicGuideJsonLd(CURRIES_AROUND_THE_WORLD_GUIDE_RECORD);
}

export function renderCurriesAroundTheWorldGuideInitialHtml() {
  return renderPublicGuideInitialHtml(CURRIES_AROUND_THE_WORLD_GUIDE_RECORD);
}

export function getIndianRegionalCurriesGuideJsonLd() {
  return getPublicGuideJsonLd(INDIAN_REGIONAL_CURRIES_GUIDE_RECORD);
}

export function renderIndianRegionalCurriesGuideInitialHtml() {
  return renderPublicGuideInitialHtml(INDIAN_REGIONAL_CURRIES_GUIDE_RECORD);
}
