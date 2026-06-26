/**
 * INGRIDIENT INTERPRETATION RULES & UK ENGLISH NORMALIZER
 * 
 * Rules:
 * - Split on commas and the word 'and'.
 * - Normalise ingredients to singular names in UK English (tomatoes → tomato, red peppers → red pepper).
 * - Treat plurals and spelling variants as equivalent.
 */

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
      
      'bell pepper': 'pepper',
      'bell peppers': 'pepper',
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
      
      'snow pea': 'mange tout',
      'snow peas': 'mange tout',
      'sugar snap pea': 'mange tout',
      'sugar snap peas': 'mange tout',
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
      
      'tinned tomatoes': 'tinned tomato',
      'chopped tomatoes': 'chopped tomato',
      'plum tomatoes': 'plum tomato',
      'cherry tomatoes': 'cherry tomato',
      'beef tomatoes': 'beef tomato',
      'roma tomatoes': 'roma tomato',
      'tomatoes': 'tomato',
      
      'potatoes': 'potato',
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
      
      'pork chops': 'pork chop',
      'lamb chops': 'lamb chop',
      
      'sausages': 'sausage',
      'pork sausages': 'pork sausage',
      
      'lentils': 'lentil',
      'red lentils': 'red lentil',
      'green lentils': 'green lentil',
      
      'beans': 'bean',
      'kidney beans': 'kidney bean',
      'black beans': 'black bean',
      'cannellini beans': 'cannellini bean',
      'haricot beans': 'haricot bean',
      'baked beans': 'baked bean',
      'green beans': 'green bean',
      
      'eggs': 'egg',
      'lime juice': 'lime',
      'lemon juice': 'lemon',
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
