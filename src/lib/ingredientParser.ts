/**
 * INGRIDIENT INTERPRETATION RULES & UK ENGLISH NORMALIZER
 * 
 * Rules:
 * - Split on commas and the word 'and'.
 * - Normalise ingredients to singular names in UK English (tomatoes → tomato, red peppers → red pepper).
 * - Treat plurals and spelling variants as equivalent.
 */

// Main ingredient aliases shared by normalisation and the short-search catalogue.
// Keep dish names out of this list: "lamb curry" is a dish search, not two raw ingredients.
const MAIN_INGREDIENT_ALIAS_MAP: Record<string, string> = {
  // Meat, poultry and game
  'turkey breasts': 'turkey breast', 'turkey thighs': 'turkey thigh', 'turkey mince': 'turkey mince',
  'duck legs': 'duck leg', 'duck breasts': 'duck breast', 'duck fillets': 'duck fillet',
  'venison steaks': 'venison steak', 'venison mince': 'venison mince',
  'rabbit legs': 'rabbit leg', 'rabbit joints': 'rabbit joint',
  'lamb shoulders': 'lamb shoulder', 'lamb legs': 'lamb leg', 'lamb necks': 'lamb neck',
  'lamb loins': 'lamb loin', 'lamb steaks': 'lamb steak', 'lamb fillets': 'lamb fillet',
  'lamb racks': 'lamb rack', 'rack of lamb': 'lamb rack', 'racks of lamb': 'lamb rack',
  'lamb cutlets': 'lamb cutlet', 'lamb breasts': 'lamb breast', 'lamb saddles': 'lamb saddle',
  'lamb ribs': 'lamb rib', 'lamb medallions': 'lamb medallion', 'lamb kebabs': 'lamb kebab',
  // Silverside is a beef cut in UK usage; keep the protein explicit in searches.
  'silverside': 'beef silverside', 'silversides': 'beef silverside',
  'silverside joint': 'beef silverside joint', 'silverside joints': 'beef silverside joint',
  'beef silverside': 'beef silverside', 'beef silverside joint': 'beef silverside joint',
  'beef silverside joints': 'beef silverside joint',
  // Fish and seafood
  'anchovies': 'anchovy', 'sardines': 'sardine', 'herrings': 'herring', 'trouts': 'trout',
  'pollocks': 'pollock', 'plaice': 'plaice', 'hakes': 'hake', 'monkfish': 'monkfish',
  'seabass': 'sea bass', 'sea bass fillets': 'sea bass fillet', 'salmon fillets': 'salmon fillet',
  'cod fillets': 'cod fillet', 'haddock fillets': 'haddock fillet', 'tuna steaks': 'tuna steak',
  'mackerel fillets': 'mackerel fillet', 'squid': 'squid', 'calamari': 'squid',
  'scallops': 'scallop', 'mussels': 'mussel', 'oysters': 'oyster', 'lobsters': 'lobster',
  'langoustines': 'langoustine', 'crayfish': 'crayfish', 'prawns': 'prawn',
  // Vegetables and herbs
  'carrots': 'carrot', 'leeks': 'leek', 'parsnips': 'parsnip', 'radishes': 'radish',
  'turnips': 'turnip', 'swedes': 'swede', 'beetroots': 'beetroot', 'beets': 'beetroot',
  'cabbages': 'cabbage', 'cauliflowers': 'cauliflower', 'courgettes': 'courgette',
  'aubergines': 'aubergine', 'asparagus': 'asparagus', 'artichokes': 'artichoke',
  'fennel bulbs': 'fennel bulb', 'celeriac': 'celeriac', 'watercress': 'watercress',
  'rocket leaves': 'rocket', 'spring greens': 'spring green', 'green beans': 'green bean',
  'runner beans': 'runner bean', 'broad beans': 'broad bean', 'fava beans': 'fava bean',
  'edamame beans': 'edamame bean', 'sugar snap peas': 'sugar snap', 'snap peas': 'snap pea',
  'pak choi': 'pak choi', 'bok choy': 'pak choi', 'spring onions': 'spring onion',
  'shallots': 'shallot', 'red onions': 'red onion', 'white onions': 'white onion',
  'cherry tomatoes': 'cherry tomato', 'plum tomatoes': 'plum tomato',
  'sun-dried tomatoes': 'sun-dried tomato', 'butternut squashes': 'butternut squash',
  'sweet potatoes': 'sweet potato', 'brussels sprouts': 'brussels sprout',
  'coriander leaves': 'coriander', 'parsley leaves': 'parsley', 'flat leaf parsley': 'flat-leaf parsley',
  'basil leaves': 'basil',
  'mint leaves': 'mint', 'thyme leaves': 'thyme', 'rosemary sprigs': 'rosemary', 'chives': 'chive',
  // Pulses, grains and starches
  'lentils': 'lentil', 'red lentils': 'red lentil', 'green lentils': 'green lentil',
  'chickpeas': 'chickpea', 'chick peas': 'chickpea', 'kidney beans': 'kidney bean',
  'butter beans': 'butter bean', 'butterbeans': 'butter bean', 'black beans': 'black bean', 'cannellini beans': 'cannellini bean',
  'haricot beans': 'haricot bean', 'baked beans': 'baked bean', 'peas': 'pea',
  'oats': 'oat', 'noodles': 'noodle', 'egg noodles': 'egg noodle', 'rice noodles': 'rice noodle',
  'hen eggs': 'hen egg', 'chicken eggs': 'chicken egg', 'duck eggs': 'duck egg',
  'goose eggs': 'goose egg', 'quail eggs': 'quail egg',
  'pearl barley': 'pearl barley', 'bulgur wheat': 'bulgur wheat', 'cous cous': 'couscous',
  'couscous': 'couscous', 'quinoas': 'quinoa', 'polenta': 'polenta',
  // Dairy, fats and compound cupboard ingredients
  'butters': 'butter', 'milks': 'milk', 'greek yogurt': 'greek yoghurt', 'greek yoghurts': 'greek yoghurt',
  'natural yogurt': 'natural yoghurt', 'plain yogurt': 'plain yoghurt', 'yogurts': 'yoghurt',
  'yoghurts': 'yoghurt', 'creme fraiche': 'crème fraîche', 'crèmes fraîches': 'crème fraîche',
  'cheddars': 'cheddar', 'mozzarella': 'mozzarella', 'parmesan': 'parmesan', 'fetas': 'feta',
  'halloumi': 'halloumi', 'ricotta': 'ricotta', 'mascarpone': 'mascarpone',
  'olive oils': 'olive oil', 'coconut milks': 'coconut milk', 'sesame oils': 'sesame oil',
  // Fruit, nuts and seeds
  'apples': 'apple', 'bananas': 'banana', 'oranges': 'orange', 'lemons': 'lemon', 'limes': 'lime',
  'peaches': 'peach', 'nectarines': 'nectarine', 'plums': 'plum', 'pears': 'pear',
  'strawberries': 'strawberry', 'raspberries': 'raspberry', 'blueberries': 'blueberry',
  'almonds': 'almond', 'walnuts': 'walnut', 'hazelnuts': 'hazelnut', 'cashews': 'cashew',
  'pistachios': 'pistachio', 'peanuts': 'peanut', 'pine nuts': 'pine nut',
  'pumpkin seeds': 'pumpkin seed', 'sunflower seeds': 'sunflower seed', 'sesame seeds': 'sesame seed',
  'chia seeds': 'chia seed', 'flax seeds': 'flax seed', 'linseeds': 'linseed'
};

const ADDITIONAL_MAIN_INGREDIENT_TERMS = [
  'lamb', 'turkey', 'duck', 'venison', 'rabbit', 'game',
  'sardine', 'herring', 'trout', 'pollock', 'plaice', 'hake', 'monkfish', 'anchovy',
  'scallop', 'mussel', 'oyster', 'lobster', 'langoustine', 'crayfish', 'squid',
  'parsnip', 'radish', 'artichoke', 'fennel', 'fennel bulb', 'celeriac', 'watercress', 'rocket',
  'spring green', 'runner bean', 'broad bean', 'fava bean', 'edamame bean', 'snap pea', 'shallot',
  'pak choi', 'butternut squash', 'asparagus', 'aubergine', 'courgette',
  'coriander', 'parsley', 'basil', 'mint', 'thyme', 'rosemary', 'sage', 'oregano', 'dill', 'chive',
  'barley', 'bulgur wheat', 'couscous', 'quinoa', 'polenta', 'oat', 'bread',
  'pasta', 'spaghetti', 'penne', 'macaroni', 'orzo', 'gnocchi', 'tortilla', 'corn',
  'butter', 'milk', 'cheddar', 'mozzarella', 'parmesan', 'feta', 'halloumi', 'ricotta', 'mascarpone',
  'greek yoghurt', 'natural yoghurt', 'plain yoghurt', 'crème fraîche',
  'orange', 'peach', 'nectarine', 'plum', 'pear', 'strawberry', 'raspberry', 'blueberry',
  'almond', 'walnut', 'hazelnut', 'cashew', 'pistachio', 'peanut', 'pumpkin seed',
  'sunflower seed', 'sesame seed', 'chia seed', 'flax seed', 'linseed'
];

const ADDITIONAL_COMPOUND_INGREDIENT_PHRASES = [
  'turkey breast', 'turkey thigh', 'turkey mince', 'duck leg', 'duck breast', 'duck fillet',
  'venison steak', 'venison mince', 'rabbit leg', 'rabbit joint', 'lamb mince', 'lamb shoulder',
  'lamb leg', 'lamb neck', 'lamb loin', 'lamb steak', 'lamb fillet', 'lamb rack', 'lamb chop',
  'lamb shank', 'lamb cutlet', 'lamb breast', 'lamb saddle', 'lamb rib', 'lamb medallion', 'lamb kebab',
  'sea bass', 'sea bass fillet', 'tiger prawn', 'king prawn', 'king crab', 'salmon fillet', 'cod fillet', 'haddock fillet', 'tuna steak',
  'mackerel fillet', 'spring green', 'runner bean', 'broad bean', 'fava bean', 'edamame bean',
  'sugar snap', 'snap pea', 'pak choi', 'spring onion', 'red onion', 'white onion', 'cherry tomato',
  'plum tomato', 'sun-dried tomato', 'butternut squash', 'fennel bulb', 'red cabbage', 'savoy cabbage',
  'sweet potato', 'new potato', 'roast potato', 'red lentil', 'green lentil', 'butter bean',
  'kidney bean', 'black bean', 'cannellini bean', 'haricot bean', 'baked bean', 'egg noodle',
  'rice noodle', 'wild rice', 'brown rice', 'basmati rice', 'long grain rice', 'pearl barley',
  'bulgur wheat', 'coconut milk', 'greek yoghurt', 'natural yoghurt', 'plain yoghurt', 'crème fraîche',
  'flat-leaf parsley', 'fresh coriander', 'fresh basil', 'fresh mint', 'fresh thyme', 'fresh rosemary',
  'cream cheese', 'goat cheese', 'cottage cheese', 'cheddar cheese', 'mozzarella cheese',
  'parmesan cheese', 'feta cheese', 'halloumi cheese', 'ricotta cheese', 'olive oil', 'rapeseed oil', 'sesame oil',
  'pumpkin seed', 'sunflower seed', 'sesame seed', 'chia seed', 'flax seed', 'pine nut'
];

export function parseAndNormaliseIngredients(query: string): string[] {
  if (!query || typeof query !== 'string') return [];
  
  // Split on commas and the word 'and' (with word boundaries to avoid matching "hand" or "brand")
  const parts = query.split(/,|\band\b/i);
  
  const results: string[] = [];
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    let normalized = trimmed.toLowerCase();
    
    // Comprehensive spelling and vocabulary mapping to UK English and singular forms
    const vocabularyMap: Record<string, string> = {
      ...MAIN_INGREDIENT_ALIAS_MAP,
      // US and plural variant mapping to singular UK English
      'cilantro': 'coriander',
      'cilantros': 'coriander',
      'coriander leaf': 'coriander',
      'coriander leaves': 'coriander',
      
      'eggplant': 'aubergine',
      'eggplants': 'aubergine',
      
      'zucchini': 'courgette',
      'zucchinis': 'courgette',
      'baby marrow': 'courgette',
      'baby marrows': 'courgette',
      
      'bell pepper': 'bell pepper',
      'bell peppers': 'bell pepper',
      'red peppers': 'red pepper',
      'green peppers': 'green pepper',
      'yellow peppers': 'yellow pepper',
      'chili': 'chilli',
      'chilis': 'chilli',
      'chilly': 'chilli',
      'chillies': 'chilli',
      'chili pepper': 'chilli',
      'chili peppers': 'chilli',
      'chilli peppers': 'chilli',
      'chilli pepper': 'chilli',
      
      'scallion': 'spring onion',
      'scallions': 'spring onion',
      'green onion': 'spring onion',
      'green onions': 'spring onion',
      
      'rutabaga': 'swede',
      'rutabagas': 'swede',
      
      'beet': 'beetroot',
      'beets': 'beetroot',
      
      'chickpeas': 'chickpea',
      'chick peas': 'chickpea',
      
      'snow pea': 'mange tout',
      'snow peas': 'mange tout',
      'sugar snap pea': 'mange tout',
      'sugar snap peas': 'mange tout',
      'sugar snaps': 'sugar snap',
      'mange touts': 'mange tout',
      
      'shrimp': 'prawn',
      'shrimps': 'prawn',
      
      'heavy cream': 'double cream',
      'heavy whipping cream': 'double cream',
      'whipping cream': 'double cream',
      
      'ground beef': 'beef mince',
      'beef minced': 'beef mince',
      'minced beef': 'beef mince',
      
      'ground pork': 'pork mince',
      'pork minced': 'pork mince',
      'minced pork': 'pork mince',
      
      'ground lamb': 'lamb mince',
      'lamb minced': 'lamb mince',
      'minced lamb': 'lamb mince',
      
      'ground turkey': 'turkey mince',
      'turkey minced': 'turkey mince',
      'minced turkey': 'turkey mince',

      'streaky bacon': 'streaky bacon',
      'back bacon': 'back bacon',
      'smoked bacon': 'smoked bacon',
      'unsmoked bacon': 'unsmoked bacon',
      'bacon rashers': 'bacon rasher',
      'rashers': 'bacon rasher',
      'bacon lardons': 'bacon lardon',
      'lardons': 'bacon lardon',
      'bacon medallions': 'bacon medallion',
      'bacon bits': 'bacon bit',
      'pork bellies': 'pork belly',
      'pork loins': 'pork loin',
      'pork tenderloins': 'pork tenderloin',
      'pork shoulders': 'pork shoulder',
      'pork legs': 'pork leg',
      'pork chops': 'pork chop',
      'pork steaks': 'pork steak',
      'pork ribs': 'pork rib',
      'pork joints': 'pork joint',
      'pork roasting joints': 'pork roasting joint',
      'pork fillets': 'pork fillet',
      'pork medallions': 'pork medallion',
      'pork tenderloin': 'pork tenderloin',
      'pork knuckles': 'pork knuckle',
      'pork hocks': 'pork hock',
      'pork collars': 'pork collar',
      'pork necks': 'pork neck',
      'pork escalopes': 'pork escalope',
      'pork schnitzels': 'pork schnitzel',
      'spare ribs': 'spare rib',
      'baby back ribs': 'baby back rib',
      'gammon steaks': 'gammon steak',
      'gammon joints': 'gammon joint',
      'roast pork': 'roast pork',
      'roasting pork': 'roasting pork',
      'pulled pork': 'pulled pork',
      'diced pork': 'diced pork',
      'chicken tenderloin': 'chicken tenderloin',
      'chicken fillets': 'chicken fillet',
      'chicken tenderloins': 'chicken tenderloin',
      'chicken tenders': 'chicken tender',
      'chicken strips': 'chicken strip',
      'chicken drumsticks': 'chicken drumstick',
      'chicken drumettes': 'chicken drumette',
      'chicken breast fillets': 'chicken breast fillet',
      'chicken thigh fillets': 'chicken thigh fillet',
      'chicken winglets': 'chicken winglet',
      'chicken quarters': 'chicken quarter',
      'chicken leg quarters': 'chicken leg quarter',
      'chicken crowns': 'chicken crown',
      'whole chickens': 'whole chicken',
      'chicken pieces': 'chicken piece',
      'chicken portions': 'chicken portion',
      'chicken sausages': 'chicken sausage',
      'chicken giblets': 'chicken giblet',
      'chicken livers': 'chicken liver',
      'chicken hearts': 'chicken heart',
      'chicken necks': 'chicken neck',
      'pot roasts': 'pot roast',

      'beef fillets': 'beef fillet',
      'beef sirloins': 'beef sirloin',
      'sirloin steak': 'sirloin steak',
      'sirloin steaks': 'sirloin steak',
      'rib eye': 'ribeye',
      'rib-eye': 'ribeye',
      'rib eyes': 'ribeye',
      'rib-eyes': 'ribeye',
      'ribeyes': 'ribeye',
      'ribeye steaks': 'ribeye steak',
      'rib eye steak': 'ribeye steak',
      'rib eye steaks': 'ribeye steak',
      'beef ribeye': 'beef ribeye',
      'beef ribeye steaks': 'beef ribeye steak',
      'rib steaks': 'rib steak',
      'beef rib steaks': 'beef rib steak',
      'strip loin': 'striploin',
      'striploin steaks': 'striploin steak',
      'beef striploin': 'beef striploin',
      'beef striploin steaks': 'beef striploin steak',
      'beef rumps': 'beef rump',
      'rump steak': 'rump steak',
      'rump steaks': 'rump steak',
      'beef topsides': 'beef topside',
      'beef silversides': 'beef silverside',
      'top rump': 'top rump',
      'top rumps': 'top rump',
      'thick flank': 'thick flank',
      'thick flanks': 'thick flank',
      'beef chucks': 'beef chuck',
      'chuck steaks': 'chuck steak',
      'chuck roast': 'chuck roast',
      'chuck roasts': 'chuck roast',
      'braising steaks': 'braising steak',
      'stewing steaks': 'stewing steak',
      'frying steaks': 'frying steak',
      'minute steaks': 'minute steak',
      'beef shins': 'beef shin',
      'beef briskets': 'beef brisket',
      'short ribs': 'short rib',
      'beef short ribs': 'beef short rib',
      'flank steaks': 'flank steak',
      'skirt steaks': 'skirt steak',
      'feather blades': 'featherblade',
      'featherblade steaks': 'featherblade steak',
      'bavette steaks': 'bavette steak',
      'onglet steaks': 'onglet steak',
      'flat irons': 'flat iron',
      'flat iron steaks': 'flat iron steak',
      'hanger steaks': 'hanger steak',
      'beef hanger steaks': 'beef hanger steak',
      'beef cheeks': 'beef cheek',
      'beef oxtail': 'oxtail',
      'oxtails': 'oxtail',
      't bone': 't-bone',
      't-bone steaks': 't-bone steak',
      'porterhouse steaks': 'porterhouse steak',
      'tomahawk steaks': 'tomahawk steak',
      'beef medallions': 'beef medallion',
      'diced beef': 'diced beef',
      'stewing beef': 'stewing beef',
      'braising beef': 'braising beef',
      'beef joints': 'beef joint',
      'roasting joint': 'roasting joint',
      'roasting joints': 'roasting joint',
      'beef roasting joint': 'beef roasting joint',
      'topside joints': 'topside joint',
      'silverside joints': 'silverside joint',
      'rump joints': 'rump joint',
      'beef tenderloin': 'beef fillet',
      'tenderloin': 'beef fillet',
      'lamb shoulders': 'lamb shoulder',
      'lamb legs': 'lamb leg',
      'lamb necks': 'lamb neck',
      'lamb loins': 'lamb loin',
      'lamb steaks': 'lamb steak',
      'lamb fillets': 'lamb fillet',
      'lamb racks': 'lamb rack',
      'rack of lamb': 'lamb rack',
      'racks of lamb': 'lamb rack',
      'lamb cutlets': 'lamb cutlet',
      'lamb breasts': 'lamb breast',
      'lamb saddles': 'lamb saddle',
      'lamb ribs': 'lamb rib',
      'lamb medallions': 'lamb medallion',
      'lamb kebabs': 'lamb kebab',
      'lamb shanks': 'lamb shank',
      'duck breasts': 'duck breast',
      'tiger prawns': 'tiger prawn',
      'king crabs': 'king crab',
      'sea bass': 'sea bass',
      
      'tinned tomatoes': 'tinned tomato',
      'chopped tomatoes': 'chopped tomato',
      'plum tomatoes': 'plum tomato',
      'cherry tomatoes': 'cherry tomato',
      'beef tomatoes': 'beef tomato',
      'roma tomatoes': 'roma tomato',
      'tomatoes': 'tomato',
      
      'potatoes': 'potato',
      'peas': 'pea',
      'sweet potatoes': 'sweet potato',
      'new potatoes': 'new potato',
      'roast potatoes': 'roast potato',
      
      'onions': 'onion',
      'red onions': 'red onion',
      'white onions': 'white onion',
      
      'garlic cloves': 'garlic clove',
      'garlics': 'garlic',
      
      'mushrooms': 'mushroom',
      'chestnut mushrooms': 'chestnut mushroom',
      'button mushrooms': 'button mushroom',
      'wild mushrooms': 'wild mushroom',
      
      'chicken breasts': 'chicken breast',
      'chicken thighs': 'chicken thigh',
      'chicken wings': 'chicken wing',
      'chicken legs': 'chicken leg',
      
      'lamb chops': 'lamb chop',
      
      'sausages': 'sausage',
      'pork sausages': 'pork sausage',
      
      'lentils': 'lentil',
      'red lentils': 'red lentil',
      'green lentils': 'green lentil',
      
      'beans': 'bean',
      'butter beans': 'butter bean',
      'kidney beans': 'kidney bean',
      'black beans': 'black bean',
      'cannellini beans': 'cannellini bean',
      'haricot beans': 'haricot bean',
      'baked beans': 'baked bean',
      'green beans': 'green bean',
      'sweet corn': 'sweetcorn',
      'wild rice': 'wild rice',
      'brussels sprouts': 'brussels sprout',
      'baby corn': 'baby corn',
      'lemon grass': 'lemongrass',
      
      'eggs': 'egg',
      'cream cheese': 'cream cheese',
      'sour cream': 'sour cream',
      'goat cheese': 'goat cheese',
      'cottage cheese': 'cottage cheese',
      'buttermilk': 'buttermilk',
      'passion fruit': 'passion fruit',
      'dragon fruit': 'dragon fruit',
      'star fruit': 'star fruit',
      'pine nuts': 'pine nut',
      'chest nuts': 'chestnut',
      'macadamia nuts': 'macadamia nut',
      'lime juice': 'lime',
      'lemon juice': 'lemon',
      'proteins': 'protein',
      'carbohydrates': 'carbohydrate',
      'carbs': 'carbohydrate',
    };
    
    // Try vocab mapping first
    if (vocabularyMap[normalized]) {
      normalized = vocabularyMap[normalized];
    } else {
      // 1. If compound term, split and handle singulars or sub-vocab mapping
      const words = normalized.split(/\s+/);
      const singularizedWords = words.map((word, index) => {
        // Skip last word check if it's already a matching sub-element
        if (vocabularyMap[word]) return vocabularyMap[word];
        
        let sing = word;
        if (sing.endsWith('oes')) {
          sing = sing.slice(0, -2); // tomatoes -> tomato
        } else if (sing.endsWith('ies')) {
          sing = sing.slice(0, -3) + 'y'; // strawberries -> strawberry
        } else if (sing.endsWith('s') && !sing.endsWith('ss') && !sing.endsWith('as') && !sing.endsWith('us') && !sing.endsWith('is')) {
          sing = sing.slice(0, -1); // peppers -> pepper
        }
        return vocabularyMap[sing] || sing;
      });
      
      normalized = singularizedWords.join(' ');
      
      // Fallback post-processed mapping
      if (vocabularyMap[normalized]) {
        normalized = vocabularyMap[normalized];
      }
    }
    
    const finalClean = normalized.trim();
    if (finalClean && !results.includes(finalClean)) {
      results.push(finalClean);
    }
  }
  
  return results;
}

// Single-word ingredients used by short searches without commas or joining
// words. Compound ingredients are kept separately below so a phrase such as
// "butter beans" is consumed as one ingredient rather than two words.
const UNSEPARATED_INGREDIENT_TERMS = new Set([
  'anchovy', 'apple', 'aubergine', 'avocado', 'bacon', 'banana', 'bean',
  'beef', 'broccoli', 'cabbage', 'carrot', 'cauliflower', 'celery', 'cheese',
  'chickpea', 'chicken', 'chilli', 'chorizo', 'cod', 'courgette', 'cucumber', 'duck',
  'egg', 'fish', 'flour', 'garlic', 'ginger', 'ham', 'haddock', 'kale', 'lamb', 'leek',
  'lentil', 'lemon', 'lime', 'mackerel', 'mushroom', 'noodle', 'oat', 'onion',
  'pasta', 'pea', 'pepper', 'prawn', 'potato', 'pork', 'rice', 'salmon', 'crab', 'bass',
  'sausage', 'shin', 'brisket', 'sirloin', 'ribeye', 'rump', 'topside', 'silverside', 'chuck',
  'beef silverside',
  'flank', 'skirt', 'featherblade', 'bavette', 'onglet', 'hanger', 'cheek', 'oxtail',
  'striploin', 'porterhouse', 'tomahawk', 'medallion', 'gammon', 'pancetta', 'rasher', 'lardon',
  'drumstick', 'drumette', 'tenderloin', 'tender', 'strip', 'quarter', 'crown', 'piece', 'portion',
  'giblet', 'liver', 'heart', 'neck',
  'spinach', 'squash', 'steak', 'sweetcorn', 'tofu', 'tomato',
  'tuna', 'turkey', 'turnip', 'vegetable', 'protein', 'carbohydrate', 'yogurt', 'yoghurt', 'lemongrass', 'buttermilk', 'chestnut',
  ...ADDITIONAL_MAIN_INGREDIENT_TERMS
]);

const UNSEPARATED_INGREDIENT_PHRASES = new Set([
  // Vegetables, pulses and fruit
  'green bean', 'red bean', 'butter bean', 'butterbeans', 'kidney bean', 'black bean', 'baked bean',
  'cannellini bean', 'haricot bean', 'broad bean', 'fava bean', 'mixed bean',
  'chickpea', 'sweetcorn', 'red pepper', 'green pepper', 'yellow pepper', 'bell pepper', 'sweet pepper', 'sugar snap', 'mange tout',
  'red onion', 'white onion', 'spring onion',
  'hen egg', 'chicken egg', 'duck egg', 'goose egg', 'quail egg',
  'sweet potato', 'new potato', 'roast potato', 'garlic clove',
  'chestnut mushroom', 'button mushroom', 'wild mushroom',
  'chopped tomato', 'tinned tomato', 'plum tomato', 'cherry tomato', 'beef tomato', 'roma tomato',
  // Meat, fish and seafood forms
  'beef fillet', 'beef sirloin', 'sirloin steak', 'beef ribeye', 'ribeye', 'beef rump', 'rump steak',
  'beef topside', 'beef silverside', 'top rump', 'thick flank', 'beef chuck',
  'beef silverside joint',
  'braising steak', 'stewing steak', 'beef shin', 'beef brisket', 'short rib', 'beef short rib',
  'flank steak', 'skirt steak', 'featherblade', 'featherblade steak', 'bavette steak', 'onglet steak',
  'flat iron', 'flat iron steak', 'hanger steak', 'beef cheek', 'oxtail', 'diced beef',
  'stewing beef', 'braising beef', 'beef joint',
  'ribeye steak', 'rib steak', 'striploin', 'striploin steak', 'beef striploin', 'beef striploin steak',
  'chuck steak', 'chuck roast', 'frying steak', 'minute steak', 't-bone', 't-bone steak',
  'porterhouse steak', 'tomahawk steak', 'beef hanger steak', 'beef medallion', 'roasting joint',
  'beef roasting joint', 'topside joint', 'silverside joint', 'rump joint', 'pot roast',
  'streaky bacon', 'back bacon', 'smoked bacon', 'unsmoked bacon', 'bacon rasher', 'bacon lardon',
  'bacon medallion', 'bacon bit', 'pancetta',
  'pork belly', 'pork loin', 'pork tenderloin', 'pork shoulder', 'pork leg', 'pork chop',
  'pork steak', 'pork rib', 'pork joint', 'pork roasting joint', 'pork fillet', 'pork medallion',
  'pork knuckle', 'pork hock', 'pork collar', 'pork neck', 'pork escalope', 'pork schnitzel',
  'spare rib', 'baby back rib', 'gammon steak', 'gammon joint', 'roast pork', 'roasting pork',
  'pulled pork', 'diced pork', 'chicken breast', 'lamb mince', 'lamb shank', 'lamb chop',
  'lamb shoulder', 'lamb leg', 'lamb neck', 'lamb loin', 'lamb steak', 'lamb fillet',
  'lamb rack', 'lamb cutlet', 'lamb breast', 'lamb saddle', 'lamb rib', 'lamb medallion', 'lamb kebab', 'duck breast',
  'tiger prawn', 'king crab', 'sea bass',
  'chicken thigh', 'chicken wing', 'chicken leg', 'chicken fillet', 'chicken tenderloin',
  'chicken tender', 'chicken strip', 'chicken drumstick', 'chicken drumette',
  'chicken breast fillet', 'chicken thigh fillet', 'chicken winglet', 'chicken quarter',
  'chicken leg quarter', 'chicken crown', 'whole chicken', 'chicken piece', 'chicken portion',
  'chicken mince', 'chicken sausage', 'chicken giblet', 'chicken liver', 'chicken heart', 'chicken neck',
  'pork mince', 'beef mince', 'lamb mince', 'turkey mince',
  'pork chop', 'lamb chop', 'pork sausage',
  'salmon fillet', 'salmon steak', 'cod fillet', 'haddock fillet', 'white fish',
  // Pulses, grains and noodles
  'red lentil', 'green lentil', 'wild rice', 'pearl barley', 'basmati rice', 'brown rice',
  'long grain rice', 'egg noodle', 'rice noodle',
  'brussels sprout', 'baby corn', 'lemongrass',
  // Sauces, stocks, fats and other compound cupboard ingredients
  'coconut milk', 'coconut cream', 'curry paste', 'tomato puree', 'tomato paste',
  'fish sauce', 'soy sauce', 'oyster sauce', 'hot sauce',
  'vegetable stock', 'chicken stock', 'beef stock', 'vegetable stock cube', 'chicken stock cube',
  'olive oil', 'rapeseed oil', 'sesame oil', 'balsamic vinegar', 'red wine vinegar', 'white wine vinegar',
  'double cream', 'cream cheese', 'sour cream', 'goat cheese', 'cottage cheese', 'buttermilk',
  'passion fruit', 'dragon fruit', 'star fruit', 'pine nut', 'chestnut', 'macadamia nut',
  ...ADDITIONAL_COMPOUND_INGREDIENT_PHRASES
]);

// "Vegetables" is a useful category in a search such as "chicken vegetables".
// It should match a named vegetable, but not vegetable oil or vegetable stock.
const VEGETABLE_CATEGORY_TERMS = new Set([
  'artichoke', 'asparagus', 'aubergine', 'avocado', 'beetroot', 'broccoli', 'brussels sprout',
  'butternut squash', 'cabbage', 'carrot', 'cauliflower', 'celeriac', 'celery', 'chard',
  'courgette', 'cucumber', 'fennel', 'fennel bulb', 'garlic', 'green bean', 'kale', 'leek',
  'lettuce', 'mange tout', 'mushroom', 'okra', 'onion', 'pak choi', 'parsnip', 'pea', 'pepper',
  'potato', 'pumpkin', 'radish', 'rocket', 'shallot', 'spinach', 'spring green', 'spring onion',
  'squash', 'sweetcorn', 'sweet potato', 'swede', 'tomato', 'turnip', 'watercress',
  'mixed vegetable', 'seasonal vegetable', 'frozen vegetable', 'stir-fry vegetable'
]);

type IngredientCategory = 'vegetable' | 'protein' | 'carbohydrate';

const INGREDIENT_CATEGORY_ALIASES: Record<string, IngredientCategory> = {
  vegetable: 'vegetable',
  vegetables: 'vegetable',
  veg: 'vegetable',
  veggies: 'vegetable',
  protein: 'protein',
  proteins: 'protein',
  carbohydrate: 'carbohydrate',
  carbohydrates: 'carbohydrate',
  carb: 'carbohydrate',
  carbs: 'carbohydrate'
};

const CATEGORY_LABEL_PATTERN = /\b(vegetable|vegetables|veg|veggies|protein|proteins|carbohydrate|carbohydrates|carb|carbs)\b/gi;
const CATEGORY_QUANTITY_PATTERN = /\b(?:(?:at\s+least|a\s+minimum\s+of)\s+)?(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|a\s+couple\s+of|a\s+few)\s+(?:(?:different|distinct|separate)\s+)?(vegetable|vegetables|veg|veggies|protein|proteins|carbohydrate|carbohydrates|carb|carbs)\b/gi;
const CATEGORY_QUANTITY_WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  'a couple of': 2,
  'a few': 3
};

const normaliseCategoryQuantities = (query: string): {
  query: string;
  minimums: Partial<Record<IngredientCategory, number>>;
} => {
  const minimums: Partial<Record<IngredientCategory, number>> = {};
  const quantityNormalisedQuery = query.replace(CATEGORY_QUANTITY_PATTERN, (_match, rawQuantity: string, rawCategory: string) => {
    const category = INGREDIENT_CATEGORY_ALIASES[rawCategory.toLowerCase()];
    const quantity = Number(rawQuantity) || CATEGORY_QUANTITY_WORDS[rawQuantity.toLowerCase()];
    if (category && quantity > 0) {
      minimums[category] = Math.max(minimums[category] || 0, quantity);
      return category;
    }
    return rawCategory;
  });
  const labelNormalisedQuery = quantityNormalisedQuery.replace(CATEGORY_LABEL_PATTERN, rawCategory =>
    INGREDIENT_CATEGORY_ALIASES[rawCategory.toLowerCase()] || rawCategory
  );
  const queryWithConnectors = /\b(?:vegetable|veg|veggies|protein|carbohydrate|carbs?)\b/i.test(labelNormalisedQuery)
    ? labelNormalisedQuery.replace(/\b(?:with|plus)\b/gi, ' and ')
    : labelNormalisedQuery;
  return { query: queryWithConnectors, minimums };
};

const PROTEIN_CATEGORY_TERMS = new Set([
  'anchovy', 'bacon', 'beef', 'bean', 'chickpea', 'chorizo', 'chicken', 'crab', 'duck', 'egg',
  'game', 'haddock', 'ham', 'hake', 'herring', 'lamb', 'lentil', 'lobster', 'mackerel', 'monkfish',
  'mussel', 'oyster', 'pancetta', 'pea', 'pork', 'prawn', 'rabbit', 'salmon', 'sausage', 'scallop',
  'seitan', 'sardine', 'squid', 'tofu', 'trout', 'tuna', 'turkey', 'venison', 'white fish',
  'tempeh', 'edamame', 'quinoa', 'almond', 'cashew', 'peanut', 'walnut', 'pistachio'
]);

const CARBOHYDRATE_CATEGORY_TERMS = new Set([
  'barley', 'bean', 'bread', 'bulgur wheat', 'chickpea', 'couscous', 'corn', 'flour', 'gnocchi',
  'lentil', 'macaroni', 'naan', 'noodle', 'oat', 'orzo', 'pasta', 'pea', 'pitta', 'polenta',
  'potato', 'quinoa', 'rice', 'roti', 'spaghetti', 'sweetcorn', 'sweet potato', 'tortilla',
  'wrap', 'yam', 'plantain', 'cassava'
]);

// A single ingredient should still be treated as ingredient-led unless it is
// commonly used as a broad dish search. This keeps queries such as
// "mackerel" tied to the named ingredient without turning "pasta" or
// "chilli" into unnecessarily narrow searches.
const AMBIGUOUS_STANDALONE_DISH_TERMS = new Set([
  'chilli', 'pasta', 'rice', 'noodle', 'steak'
]);

const COMPOUND_INGREDIENT_MODIFIERS = new Set([
  'juice', 'fillet', 'fillets', 'steak', 'steaks', 'breast', 'thigh', 'wing', 'leg',
  'chop', 'chops', 'mince', 'minced', 'sausage', 'sausages', 'tenderloin', 'tender', 'strip',
  'drumstick', 'drumsticks', 'drumette', 'drumettes', 'quarter', 'quarters', 'crown', 'crowns',
  'piece', 'pieces', 'portion', 'portions', 'giblet', 'giblets', 'liver', 'livers', 'heart', 'hearts',
  'neck', 'necks', 'paste', 'puree',
  'sauce', 'stock', 'cube', 'oil', 'vinegar', 'cream', 'milk', 'powder',
  'fresh', 'frozen', 'tinned', 'canned', 'cooked', 'raw', 'large', 'medium', 'small',
  'new', 'baby', 'mashed', 'boiled', 'baked', 'roasted', 'diced', 'chopped',
  'sliced', 'quartered', 'halved'
]);

export type IngredientPreparationPreferences = {
  skin?: 'on' | 'off';
  bone?: 'in' | 'out';
  fishForm?: 'filleted' | 'whole' | 'steak';
};

export const extractIngredientPreparationPreferences = (query: string): {
  cleanedQuery: string;
  preferences: IngredientPreparationPreferences;
} => {
  const source = typeof query === 'string' ? query : '';
  const preferences: IngredientPreparationPreferences = {};
  const skinOn = /\bskin[-\s]+on\b|\bwith(?:\s+the)?\s+skin\b|\bskin\s+attached\b/gi;
  const skinOff = /\bskinless\b|\bwithout(?:\s+the)?\s+skin\b|\bno\s+skin\b/gi;
  const boneIn = /\bbone[-\s]+in\b|\bwith(?:\s+the)?\s+bones?\b|\bon\s+the\s+bone\b/gi;
  const boneOut = /\bboneless\b|\bwithout(?:\s+the)?\s+bones?\b|\bno\s+bones?\b/gi;
  const hasFishContext = /\b(?:fish|salmon|cod|haddock|mackerel|trout|tuna|sardine|herring|pollock|plaice|hake|monkfish|bass|anchovy)\b/i.test(source);
  const fishFilleted = hasFishContext ? /\bfilleted\b/gi : /$^/g;
  const fishFilletNoun = hasFishContext ? /\bfillet(?:s)?\b/gi : /$^/g;
  const fishWhole = hasFishContext ? /\bwhole\b/gi : /$^/g;
  const fishSteak = hasFishContext ? /\bsteaks?\b/gi : /$^/g;

  if (source.match(skinOn)) preferences.skin = 'on';
  if (source.match(skinOff)) preferences.skin = 'off';
  if (source.match(boneIn)) preferences.bone = 'in';
  if (source.match(boneOut)) preferences.bone = 'out';
  if (source.match(fishFilleted) || source.match(fishFilletNoun)) preferences.fishForm = 'filleted';
  if (source.match(fishWhole)) preferences.fishForm = 'whole';
  if (source.match(fishSteak)) preferences.fishForm = 'steak';

  const cleanedQuery = source
    .replace(skinOn, ' ')
    .replace(skinOff, ' ')
    .replace(boneIn, ' ')
    .replace(boneOut, ' ')
    .replace(fishFilleted, ' ')
    .replace(fishWhole, ' ')
    .replace(fishSteak, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { cleanedQuery, preferences };
};

const hasPreparationPreferences = (preferences: IngredientPreparationPreferences) =>
  Boolean(preferences.skin || preferences.bone || preferences.fishForm);

const PREFIX_INGREDIENT_MODIFIERS = new Set([
  'fresh', 'frozen', 'tinned', 'canned', 'cooked', 'raw', 'large', 'medium', 'small',
  'new', 'baby', 'mashed', 'boiled', 'baked', 'roasted', 'diced', 'chopped',
  'sliced', 'quartered', 'halved'
]);

const parseUnseparatedIngredientList = (query: string): string[] => {
  const words = query.split(/\s+/).filter(word => !/^and$/i.test(word));
  const parsed: string[] = [];

  for (let index = 0; index < words.length;) {
    let matchedPhrase = false;
    const maxPhraseLength = Math.min(3, words.length - index);
    for (let phraseLength = maxPhraseLength; phraseLength >= 2; phraseLength -= 1) {
      const phrase = words.slice(index, index + phraseLength).join(' ');
      const normalisedPhrase = parseAndNormaliseIngredients(phrase)[0];
      const firstWord = words[index].toLowerCase();
      const lastWord = words[index + phraseLength - 1].toLowerCase();
      const modifierBody = firstWord !== lastWord && PREFIX_INGREDIENT_MODIFIERS.has(firstWord)
        ? parseAndNormaliseIngredients(words.slice(index + 1, index + phraseLength).join(' '))[0]
        : normalisedPhrase;
      const isKnownCompound = UNSEPARATED_INGREDIENT_PHRASES.has(normalisedPhrase)
        || (UNSEPARATED_INGREDIENT_TERMS.has(normalisedPhrase) && COMPOUND_INGREDIENT_MODIFIERS.has(lastWord))
        || (firstWord !== lastWord && PREFIX_INGREDIENT_MODIFIERS.has(firstWord) && UNSEPARATED_INGREDIENT_TERMS.has(modifierBody));
      if (isKnownCompound) {
        parsed.push(normalisedPhrase);
        index += phraseLength;
        matchedPhrase = true;
        break;
      }
    }
    if (matchedPhrase) continue;

    const normalisedWord = parseAndNormaliseIngredients(words[index])[0];
    if (!normalisedWord || !UNSEPARATED_INGREDIENT_TERMS.has(normalisedWord)) return [];
    parsed.push(normalisedWord);
    index += 1;
  }

  return parsed;
};

export function detectIngredientIntent(query: string): {
  isIngredientLed: boolean;
  ingredients: string[];
  reason: 'list' | 'phrase' | 'short-food-list';
  preparationPreferences?: IngredientPreparationPreferences;
  categoryMinimums?: Partial<Record<IngredientCategory, number>>;
} | null {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  const { cleanedQuery, preferences } = extractIngredientPreparationPreferences(trimmed);
  const hasPreparation = hasPreparationPreferences(preferences);
  const { query: categoryNormalisedQuery, minimums: categoryMinimums } = normaliseCategoryQuantities(cleanedQuery);
  const lower = categoryNormalisedQuery.toLowerCase();
  const ingredientPhrases = /\b(i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only|what can i make with|what can i cook with)\b/i;
  const hasListPunctuation = /[,;]/.test(cleanedQuery);
  const hasSimpleAndList = /\b\w+\b\s+\band\b\s+\b\w+\b/i.test(lower) && lower.split(/\s+/).length <= 7;

  const withoutLeadIn = lower
    .replace(/\b(what can i make with|what can i cook with|i have|i've got|we have|use up|using up|leftover|left over|in the fridge|in my fridge|in the cupboard|with only)\b/gi, '')
    .replace(/\b(?:only|just)\b/gi, ' ')
    .replace(/[?!.]/g, ' ')
    .trim();

  const ingredients = parseAndNormaliseIngredients(withoutLeadIn || categoryNormalisedQuery)
    .map(item => item.replace(/^(some|a bit of|a few|half a|one|two|three)\s+/i, '').trim())
    .filter(item => item.length > 1 && item.split(/\s+/).length <= 3);

  const shortIngredientQuery = withoutLeadIn || categoryNormalisedQuery;
  const unseparatedWords = shortIngredientQuery.split(/\s+/).filter(word => !/^and$/i.test(word));
  const unseparatedIngredients = parseUnseparatedIngredientList(shortIngredientQuery);
  const categoryMetadata = Object.keys(categoryMinimums).length > 0 ? { categoryMinimums } : {};
  const isShortUnseparatedIngredientList =
    !hasListPunctuation
    && !ingredientPhrases.test(trimmed)
    && unseparatedWords.length >= 2
    && unseparatedWords.length <= 6
    && unseparatedIngredients.length >= 2
    && unseparatedIngredients.length <= 4;

  if (isShortUnseparatedIngredientList) {
    return { isIngredientLed: true, ingredients: unseparatedIngredients, reason: 'short-food-list', ...categoryMetadata, ...(hasPreparation ? { preparationPreferences: preferences } : {}) };
  }

  const isStandaloneIngredientSearch =
    !hasListPunctuation
    && !ingredientPhrases.test(trimmed)
    && !/\b(?:recipe|recipes|dish|dishes|dinner|dinners|ideas|idea|curry)\b/i.test(cleanedQuery)
    && ingredients.length === 1
    && unseparatedWords.length === 1
    && (UNSEPARATED_INGREDIENT_TERMS.has(ingredients[0]) || /^butterbeans$/i.test(trimmed))
    && !AMBIGUOUS_STANDALONE_DISH_TERMS.has(ingredients[0]);

  if (isStandaloneIngredientSearch) {
    return { isIngredientLed: true, ingredients: /^butterbeans$/i.test(trimmed) ? ['butter bean'] : ingredients, reason: 'short-food-list', ...categoryMetadata, ...(hasPreparation ? { preparationPreferences: preferences } : {}) };
  }

  if (ingredients.length >= 2 && ingredientPhrases.test(cleanedQuery)) {
    return { isIngredientLed: true, ingredients, reason: 'phrase', ...categoryMetadata, ...(hasPreparation ? { preparationPreferences: preferences } : {}) };
  }

  if (ingredients.length >= 2 && hasListPunctuation) {
    return { isIngredientLed: true, ingredients, reason: 'list', ...categoryMetadata, ...(hasPreparation ? { preparationPreferences: preferences } : {}) };
  }

  if (ingredients.length >= 2 && hasSimpleAndList) {
    // A short "and" phrase is only an ingredient list when every part is in
    // the supported ingredient catalogue. Otherwise ordinary dish names such
    // as "fish and chips" or descriptive searches such as "quick and easy"
    // can be mistaken for ingredient requests.
    if (unseparatedIngredients.length === ingredients.length) {
      return { isIngredientLed: true, ingredients: unseparatedIngredients, reason: 'short-food-list', ...categoryMetadata, ...(hasPreparation ? { preparationPreferences: preferences } : {}) };
    }
  }

  if (hasPreparation && ingredients.length > 0) {
    return { isIngredientLed: true, ingredients, reason: 'short-food-list', ...categoryMetadata, preparationPreferences: preferences };
  }

  return null;
}

const PANTRY_STAPLE_PATTERN = /^(?:water|salt|pepper|black pepper|white pepper|oil|olive oil|vegetable oil|sunflower oil|rapeseed oil|cooking spray|seasoning|mixed herbs?|dried herbs?|fresh herbs?|herbs?|spices?)$/i;
const INGREDIENT_MODIFIER_PATTERN = /^(?:a|an|the|fresh|frozen|tinned|canned|dried|cooked|raw|large|medium|small|baby|new|free[- ]range|boneless|skinless|lean|smoked|unsmoked|cured|grated|chopped|diced|sliced|quartered|halved|mashed|boiled|roasted|baked|trimmed|drained)$/i;

const INGREDIENT_VARIANT_WORDS: Record<string, Set<string>> = {
  bacon: new Set(['streaky', 'back', 'smoked', 'unsmoked', 'rasher', 'lardon', 'medallion', 'bit', 'pancetta']),
  pork: new Set([
    'mince', 'chop', 'loin', 'tenderloin', 'shoulder', 'belly', 'leg', 'fillet', 'steak', 'rib',
    'sausage', 'joint', 'roast', 'roasting', 'pulled', 'diced', 'knuckle', 'hock', 'collar', 'neck',
    'escalope', 'schnitzel', 'gammon'
  ]),
  onion: new Set(['red', 'white', 'spring']),
  potato: new Set(['new', 'roast']),
  // Generic tomato searches should include common substantive forms used in
  // UK recipes, including passata and purée.
  tomato: new Set([
    'cherry', 'plum', 'beef', 'tinned', 'chopped', 'sun-dried', 'sundried',
    'puree', 'purée', 'paste', 'passata', 'sauce', 'based'
  ]),
  egg: new Set(['hen', 'chicken', 'duck', 'goose', 'quail']),
  pepper: new Set(['red', 'green', 'yellow', 'bell']),
  chicken: new Set([
    'breast', 'thigh', 'wing', 'leg', 'fillet', 'tenderloin', 'tender', 'strip', 'drumstick', 'drumette',
    'winglet', 'quarter', 'crown', 'whole', 'piece', 'portion', 'mince', 'sausage', 'giblet', 'liver',
    'heart', 'neck'
  ]),
  beef: new Set([
    'mince', 'steak', 'fillet', 'sirloin', 'ribeye', 'rib', 'rump', 'topside', 'silverside',
    'top', 'thick', 'flank', 'chuck', 'braising', 'stewing', 'shin', 'brisket',
    'short', 'skirt', 'featherblade', 'bavette', 'onglet', 'flat', 'hanger', 'cheek', 'oxtail',
    'striploin', 'porterhouse', 'tomahawk', 'medallion', 'diced', 'joint', 'roasting', 'tenderloin'
  ]),
  lamb: new Set([
    'mince', 'chop', 'shoulder', 'leg', 'neck', 'loin', 'steak', 'fillet', 'rack', 'cutlet',
    'breast', 'saddle', 'rib', 'medallion', 'kebab', 'shank'
  ]),
  turkey: new Set(['mince', 'breast', 'thigh']),
  duck: new Set(['breast', 'leg', 'fillet']),
  fish: new Set([
    'salmon', 'cod', 'haddock', 'mackerel', 'trout', 'tuna', 'sardine', 'herring',
    'pollock', 'plaice', 'hake', 'monkfish', 'bass', 'anchovy', 'white', 'oily', 'sea',
    'fillet', 'fillets', 'steak', 'steaks', 'portion', 'portions', 'side', 'sides', 'whole'
  ]),
  rice: new Set(['wild', 'brown', 'basmati', 'long', 'jasmine', 'bomba', 'risotto']),
  bean: new Set(['butter', 'kidney', 'black', 'cannellini', 'haricot', 'baked', 'green', 'broad', 'fava', 'runner', 'edamame']),
  lentil: new Set(['red', 'green', 'brown', 'black', 'puy']),
  noodle: new Set(['egg', 'rice', 'udon', 'soba']),
  mushroom: new Set(['chestnut', 'button', 'wild', 'portobello', 'shiitake', 'oyster']),
  cheese: new Set(['cheddar', 'goat', 'cottage', 'cream', 'blue', 'feta', 'parmesan', 'mozzarella', 'halloumi', 'ricotta']),
  yoghurt: new Set(['greek', 'natural', 'plain']),
  salmon: new Set(['fillet', 'steak', 'portion', 'side']),
  cod: new Set(['fillet', 'loin', 'steak', 'portion']),
  haddock: new Set(['fillet', 'loin', 'portion']),
  mackerel: new Set(['fillet', 'steak', 'portion']),
  trout: new Set(['fillet', 'steak', 'portion']),
  tuna: new Set(['fillet', 'steak', 'portion']),
  plaice: new Set(['fillet', 'portion', 'side', 'whole']),
  sardine: new Set(['fillet', 'portion', 'whole']),
  herring: new Set(['fillet', 'portion', 'whole']),
  pollock: new Set(['fillet', 'loin', 'portion']),
  hake: new Set(['fillet', 'loin', 'portion']),
  monkfish: new Set(['fillet', 'tail', 'portion']),
  anchovy: new Set(['fillet']),
  sausage: new Set(['pork', 'chicken', 'beef', 'lamb', 'turkey', 'vegetarian', 'veggie', 'chipolata']),
  prawn: new Set(['tiger', 'king']),
  crab: new Set(['king', 'meat', 'claw', 'white', 'brown', 'lump']),
  bass: new Set(['sea']),
};

const FISH_SPECIES_WORDS = new Set([
  'salmon', 'cod', 'haddock', 'mackerel', 'trout', 'tuna', 'sardine', 'herring',
  'pollock', 'plaice', 'hake', 'monkfish', 'bass', 'anchovy'
]);
const FISH_FORM_WORDS = new Set([
  'fillet', 'fillets', 'steak', 'steaks', 'portion', 'portions',
  'side', 'sides', 'whole'
]);

const BEEF_CUT_TERMS = new Set([
  'fillet', 'sirloin', 'rib', 'ribeye', 'ribeye steak', 'rib steak', 'striploin', 'striploin steak',
  'rump', 'topside', 'silverside', 'beef silverside', 'top rump', 'thick flank', 'chuck', 'chuck steak', 'chuck roast',
  'braising steak', 'stewing steak', 'frying steak', 'minute steak', 'shin', 'brisket', 'short rib',
  'flank', 'flank steak', 'skirt', 'skirt steak', 'featherblade', 'featherblade steak',
  'bavette', 'bavette steak', 'onglet', 'onglet steak', 'flat iron', 'flat iron steak',
  'hanger', 'hanger steak', 'beef cheek',
  'oxtail', 'diced beef', 'stewing beef', 'braising beef', 'beef joint',
  'beef striploin', 'beef striploin steak',
  'chuck roast', 'frying steak', 'minute steak', 't-bone', 't-bone steak', 'porterhouse steak',
  'tomahawk', 'tomahawk steak', 'porterhouse', 'beef hanger steak', 'medallion', 'beef medallion', 'roasting joint',
  'beef roasting joint', 'topside joint', 'silverside joint', 'beef silverside joint', 'rump joint', 'pot roast'
]);

const BEEF_CUT_VARIANT_WORDS = new Set([
  'beef', 'steak', 'joint', 'roast', 'fillet', 'loin', 'portion', 'diced', 'braising', 'stewing',
  'rib', 'striploin', 'porterhouse', 'tomahawk', 'medallion', 'roasting'
]);

const BACON_VARIANT_TERMS = new Set([
  'streaky bacon', 'back bacon', 'smoked bacon', 'unsmoked bacon', 'bacon rasher', 'bacon lardon',
  'bacon medallion', 'bacon bit', 'pancetta'
]);

const BACON_VARIANT_WORDS = new Set([
  'bacon', 'streaky', 'back', 'smoked', 'unsmoked', 'rasher', 'lardon', 'medallion', 'bit', 'pancetta'
]);

const PORK_CUT_TERMS = new Set([
  'pork belly', 'pork loin', 'pork tenderloin', 'pork shoulder', 'pork leg', 'pork chop', 'pork steak',
  'pork rib', 'pork joint', 'pork roasting joint', 'pork fillet', 'pork medallion', 'pork knuckle',
  'pork hock', 'pork collar', 'pork neck', 'pork escalope', 'pork schnitzel', 'spare rib',
  'baby back rib', 'gammon steak', 'gammon joint', 'roast pork', 'roasting pork', 'pulled pork', 'diced pork'
]);

const PORK_CUT_VARIANT_WORDS = new Set([
  'pork', 'mince', 'chop', 'loin', 'tenderloin', 'shoulder', 'belly', 'leg', 'fillet', 'steak', 'rib',
  'joint', 'roast', 'roasting', 'pulled', 'diced', 'knuckle', 'hock', 'collar', 'neck', 'escalope',
  'schnitzel', 'gammon'
]);

const CHICKEN_CUT_TERMS = new Set([
  'chicken breast', 'chicken thigh', 'chicken wing', 'chicken leg', 'chicken fillet',
  'chicken tenderloin', 'chicken tender', 'chicken strip', 'chicken drumstick', 'chicken drumette',
  'chicken breast fillet', 'chicken thigh fillet', 'chicken winglet', 'chicken quarter',
  'chicken leg quarter', 'chicken crown', 'whole chicken', 'chicken piece', 'chicken portion',
  'chicken mince', 'chicken sausage', 'chicken giblet', 'chicken liver', 'chicken heart', 'chicken neck'
]);

const CHICKEN_CUT_VARIANT_WORDS = new Set([
  'chicken', 'breast', 'thigh', 'wing', 'leg', 'fillet', 'tenderloin', 'tender', 'strip', 'drumstick',
  'drumette', 'winglet', 'quarter', 'crown', 'whole', 'piece', 'portion', 'mince', 'sausage', 'giblet',
  'liver', 'heart', 'neck'
]);

const stripIngredientQuantity = (value: string) => value
  .replace(/^\s*[\d¼½¾⅓⅔⅛⅜⅝⅞]+(?:[\d\/\s.-]+)?\s*(?:g|kg|ml|l|oz|lb|tbsp|tsp|tablespoons?|teaspoons?|cups?|cloves?|slices?|pieces?|pcs|cans?|tins?|packets?|packs?|bunches?|sprigs?)?\s*/i, '')
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[•*]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normaliseStrictIngredientLine = (value: string) => {
  const stripped = stripIngredientQuantity(value);
  const parsed = parseAndNormaliseIngredients(stripped);
  return parsed.length > 0 ? parsed : [stripped.toLowerCase()];
};

const isPantryStaple = (value: string) => {
  const normalised = value.trim().toLowerCase();
  return PANTRY_STAPLE_PATTERN.test(normalised)
    || /^(?:(?:freshly|coarsely|finely)\s+)?ground\s+(?:black|white)?\s*pepper$/i.test(normalised)
    || /^(?:sea|fine|coarse)\s+salt$/i.test(normalised)
    || normalised.split(/\s+/).every(word => INGREDIENT_MODIFIER_PATTERN.test(word));
};

const matchesAllowedIngredient = (value: string, allowed: string) => {
  const valueWithoutPreparation = extractIngredientPreparationPreferences(value).cleanedQuery;
  const valueWords = valueWithoutPreparation.toLowerCase().split(/\s+/).filter(Boolean);
  const allowedWords = allowed.toLowerCase().split(/\s+/).filter(Boolean);
  const allowedKey = allowedWords.join(' ');
  if (valueWords.join(' ') === allowedWords.join(' ')) return true;

  const allowedStart = valueWords.findIndex((_, index) =>
    allowedWords.every((word, offset) => valueWords[index + offset] === word)
  );
  if (allowedStart < 0) {
    if (allowedKey !== 'fish') return false;
    const speciesIndex = valueWords.findIndex(word => FISH_SPECIES_WORDS.has(word));
    if (speciesIndex < 0) return false;
    const remainingWords = valueWords.filter((_, index) => index !== speciesIndex);
    return remainingWords.length === 0 || remainingWords.every(word =>
      INGREDIENT_MODIFIER_PATTERN.test(word) || FISH_FORM_WORDS.has(word) || word === 'sea'
    );
  }

  const remainingWords = valueWords.filter((_, index) =>
    index < allowedStart || index >= allowedStart + allowedWords.length
  );

  const allowedVariantWords = INGREDIENT_VARIANT_WORDS[allowedKey]
    || (FISH_SPECIES_WORDS.has(allowedKey) || allowedKey === 'sea bass' ? new Set([...FISH_FORM_WORDS, 'loin', 'tail'])
      : allowedKey === 'fish' ? new Set([...FISH_SPECIES_WORDS, ...FISH_FORM_WORDS, 'white', 'oily', 'sea'])
      : BEEF_CUT_TERMS.has(allowedKey) ? BEEF_CUT_VARIANT_WORDS
      : BACON_VARIANT_TERMS.has(allowedKey) ? BACON_VARIANT_WORDS
        : PORK_CUT_TERMS.has(allowedKey) ? PORK_CUT_VARIANT_WORDS
          : CHICKEN_CUT_TERMS.has(allowedKey) ? CHICKEN_CUT_VARIANT_WORDS
            : new Set<string>());
  return remainingWords.length === 0 || remainingWords.every(word =>
    INGREDIENT_MODIFIER_PATTERN.test(word) || allowedVariantWords.has(word)
  );
};

const matchesVegetableCategory = (value: string) => {
  const normalisedValue = value.trim().toLowerCase();
  if (/\bvegetable\s+(?:oil|stock|broth|bouillon)\b/i.test(normalisedValue)) return false;

  const parsedValues = parseAndNormaliseIngredients(normalisedValue);
  return parsedValues.some(candidate => candidate === 'vegetable'
    || VEGETABLE_CATEGORY_TERMS.has(candidate)
    || candidate.split(/\s+/).some(word => VEGETABLE_CATEGORY_TERMS.has(word)));
};

const matchesIngredientCategory = (value: string, categoryTerms: Set<string>) => {
  const normalisedValue = value.trim().toLowerCase();
  const parsedValues = parseAndNormaliseIngredients(normalisedValue);
  return parsedValues.some(candidate => {
    if (categoryTerms.has(candidate)) return true;
    return candidate.split(/\s+/).some(word => categoryTerms.has(word));
  });
};

const matchesRequestedIngredient = (value: string, allowed: string) =>
  allowed === 'vegetable'
    ? matchesVegetableCategory(value)
    : allowed === 'protein'
      ? matchesIngredientCategory(value, PROTEIN_CATEGORY_TERMS)
      : allowed === 'carbohydrate'
        ? matchesIngredientCategory(value, CARBOHYDRATE_CATEGORY_TERMS)
        : matchesAllowedIngredient(value, allowed);

const isIngredientCategory = (value: string): value is IngredientCategory =>
  value === 'vegetable' || value === 'protein' || value === 'carbohydrate';

const matchesRequestedPreparation = (
  value: string,
  requested?: IngredientPreparationPreferences
) => {
  if (!requested || !hasPreparationPreferences(requested)) return true;
  const found = extractIngredientPreparationPreferences(value).preferences;
  const isFishOrMeatLine = /\b(?:fish|salmon|cod|haddock|mackerel|trout|tuna|sardine|herring|pollock|plaice|hake|monkfish|bass|anchovy|chicken|turkey|duck|pork|beef|lamb|venison|rabbit)\b/i.test(value);
  if (!isFishOrMeatLine) return true;
  return (!requested.skin || found.skin === requested.skin)
    && (!requested.bone || found.bone === requested.bone)
    && (!requested.fishForm || found.fishForm === requested.fishForm);
};

/**
 * Applies the Search view's ingredient requirement to generated recipe stubs.
 * Every listed ingredient must be present, while extra ingredients remain
 * allowed unless strict mode is enabled.
 */
export function matchesRequestedIngredientSearch(item: { ingredients?: string[]; title?: string; description?: string; totalIngredientsCount?: number }, query: string): boolean {
  const intent = detectIngredientIntent(query);
  if (!intent?.isIngredientLed || intent.ingredients.length === 0) return true;

  const recipeIngredientLines = Array.isArray(item.ingredients) ? item.ingredients.filter(Boolean) : [];
  const ingredientLines = [
    ...recipeIngredientLines,
    item.title || '',
    item.description || ''
  ].filter(Boolean);
  if (ingredientLines.length === 0) return false;

  const normalisedLines = ingredientLines.flatMap(normaliseStrictIngredientLine);
  const normalisedRecipeIngredients = recipeIngredientLines.flatMap(normaliseStrictIngredientLine);
  const requestedIngredients = intent.ingredients;
  const requestedPreparation = intent.preparationPreferences;

  return requestedIngredients.every(requested =>
    isIngredientCategory(requested) && (intent.categoryMinimums?.[requested] || 1) > 1
      ? new Set(normalisedRecipeIngredients.filter(line =>
          matchesRequestedIngredient(line, requested)
          && matchesRequestedPreparation(line, requestedPreparation)
        )).size >= (intent.categoryMinimums?.[requested] || 1)
      : normalisedLines.some(line =>
          matchesRequestedIngredient(line, requested)
          && matchesRequestedPreparation(line, requestedPreparation)
        )
  );
}

/**
 * Applies the Search view's strict ingredient option to generated recipe stubs.
 * Pantry staples are allowed, but every other ingredient must be one of the
 * ingredients listed by the user and every listed ingredient must be present.
 */
export function matchesStrictIngredientSearch(item: { ingredients?: string[]; totalIngredientsCount?: number }, query: string): boolean {
  if (!matchesRequestedIngredientSearch(item, query)) return false;

  const ingredientLines = Array.isArray(item.ingredients) ? item.ingredients.filter(Boolean) : [];
  if (typeof item.totalIngredientsCount === 'number' && item.totalIngredientsCount > ingredientLines.length) return false;

  const intent = detectIngredientIntent(query);
  if (!intent?.isIngredientLed || intent.ingredients.length === 0) return true;
  const normalisedLines = ingredientLines.flatMap(normaliseStrictIngredientLine);
  const requestedIngredients = intent.ingredients;
  const requestedPreparation = intent.preparationPreferences;
  return normalisedLines.every(line =>
    isPantryStaple(line) || requestedIngredients.some(requested =>
      matchesRequestedIngredient(line, requested)
      && matchesRequestedPreparation(line, requestedPreparation)
    )
  );
}
