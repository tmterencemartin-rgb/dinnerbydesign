const INTERNAL_GROUNDING_HOSTS = new Set([
  'vertexaisearch.cloud.google.com',
  'vertexaisearch.googleapis.com'
]);

const PUBLISHER_LABELS: Array<[string, string]> = [
  ['goodto.com', 'Goodto'],
  ['bbcgoodfood.com', 'BBC Good Food'],
  ['bbc.co.uk', 'BBC Food'],
  ['realfood.tesco.com', 'Tesco Real Food'],
  ['waitrose.com', 'Waitrose'],
  ['sainsburysmagazine.co.uk', "Sainsbury's Magazine"],
  ['asda.com', 'Asda'],
  ['theguardian.com', 'Guardian Feast'],
  ['greatbritishchefs.com', 'Great British Chefs'],
  ['deliciousmagazine.co.uk', 'delicious. magazine'],
  ['thehappyfoodie.co.uk', 'The Happy Foodie'],
  ['deliaonline.com', 'Delia Online'],
  ['nigella.com', 'Nigella Lawson'],
  ['foodnetwork.co.uk', 'Food Network UK'],
  ['pinchofnom.com', 'Pinch of Nom'],
  ['maryberry.co.uk', 'Mary Berry'],
  ['greatbritishrecipes.com', 'Great British Recipes'],
  ['recipetineats.com', 'RecipeTin Eats'],
  ['gressinghamduck.co.uk', 'Gressingham Duck'],
  ['annaskitchentable.co.uk', "Anna's Kitchen Table"],
  ['independent.co.uk', 'The Independent'],
  ['recipesmadeeasy.co.uk', 'Recipes Made Easy'],
  ['riverford.co.uk', 'Riverford Organic Farmers'],
  ['ottolenghi.co.uk', 'Ottolenghi'],
  ['coop.co.uk', 'Co-op'],
  ['jamesmartinchef.co.uk', 'James Martin'],
  ['hairybikers.com', 'Hairy Bikers'],
  ['dontgobaconmyheart.co.uk', "Don't Go Bacon My Heart"],
  ['krumpli.co.uk', 'Krumpli'],
  ['ourmodernkitchen.com', 'Our Modern Kitchen'],
  ['kitchensanctuary.com', 'Kitchen Sanctuary'],
  ['diabetes.org.uk', 'Diabetes UK'],
  ['easypeasyfoodie.com', 'Easy Peasy Foodie'],
  ['lovepork.com', 'Love Pork'],
  ['groceries.morrisons.com', 'Morrisons'],
  ['marksandspencer.com', 'M&S Food'],
  ['abelandcole.co.uk', 'Abel & Cole'],
  ['tescorealfood.com', 'Tesco Real Food'],
  ['tesco.com', 'Tesco Recipes'],
  ['jamieoliver.com', 'Jamie Oliver'],
  ['goodhousekeeping.com', 'Good Housekeeping'],
  ['olivemagazine.com', 'Olive Magazine'],
  ['slimmingworld.co.uk', 'Slimming World'],
  ['audleyrestaurants.co.uk', 'Audley Restaurants']
];

const sourceHost = (sourceUrl: unknown): string | null => {
  if (typeof sourceUrl !== 'string' || !sourceUrl.trim()) return null;

  try {
    const host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, '');
    return INTERNAL_GROUNDING_HOSTS.has(host) || host.endsWith('.vertexaisearch.cloud.google.com')
      ? null
      : host || null;
  } catch {
    return null;
  }
};

export const getRecipeSourceLabel = (sourceUrl: unknown): string => {
  return sourceHost(sourceUrl) || 'Source page';
};

export const getRecipeSourcePublisher = (sourceUrl: unknown): string => {
  const host = sourceHost(sourceUrl);
  if (!host) return 'Source page';
  return PUBLISHER_LABELS.find(([domain]) => host === domain || host.endsWith(`.${domain}`))?.[1] || host;
};
