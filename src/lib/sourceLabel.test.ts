import { describe, expect, it } from 'vitest';
import { RECIPE_PUBLISHER_REGISTRY } from './groundingUtils';
import { getRecipeSourceLabel, getRecipeSourcePublisher } from './sourceLabel';

describe('getRecipeSourceLabel', () => {
  it('hides internal grounding hosts from users', () => {
    expect(getRecipeSourceLabel('https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc')).toBe('Source page');
  });

  it('keeps a normal source hostname readable', () => {
    expect(getRecipeSourceLabel('https://www.bbcgoodfood.com/recipes/example')).toBe('bbcgoodfood.com');
  });

  it('uses a readable publisher name when it is recognised', () => {
    expect(getRecipeSourcePublisher('https://www.goodto.com/food/recipes/chicken-curry')).toBe('Goodto');
    expect(getRecipeSourcePublisher('https://www.bbcgoodfood.com/recipes/example')).toBe('BBC Good Food');
    expect(getRecipeSourcePublisher('https://www.nigella.com/recipes/example')).toBe('Nigella Lawson');
    expect(getRecipeSourcePublisher('https://www.recipetineats.com/example')).toBe('RecipeTin Eats');
    expect(getRecipeSourcePublisher('https://ottolenghi.co.uk/pages/recipes/example')).toBe('Ottolenghi');
    expect(getRecipeSourcePublisher('https://www.coop.co.uk/recipes/example')).toBe('Co-op');
    expect(getRecipeSourcePublisher('https://www.hairybikers.com/recipes/example')).toBe('Hairy Bikers');
    expect(getRecipeSourcePublisher('https://www.easypeasyfoodie.com/chicken-tikka-kebabs/')).toBe('Easy Peasy Foodie');
    expect(getRecipeSourcePublisher('https://www.lovepork.com/recipes/pork-and-apple-traybake')).toBe('Love Pork');
    expect(getRecipeSourcePublisher('https://groceries.morrisons.com/recipes/chicken-traybake/example-recipe')).toBe('Morrisons');
    expect(getRecipeSourcePublisher('https://www.marksandspencer.com/c/food-and-wine/cooking/recipes/chicken-traybake/')).toBe('M&S Food');
    expect(getRecipeSourcePublisher('https://www.abelandcole.co.uk/recipes/chicken-and-bean-stew')).toBe('Abel & Cole');
  });
});

describe('publisher labels and the approved registry', () => {
  it('gives every approved host a display name, so a result button never shows a raw host name', () => {
    const unlabelled = RECIPE_PUBLISHER_REGISTRY
      .filter(({ host }) => getRecipeSourcePublisher(`https://www.${host}/recipe/example`) === host)
      .map(({ host }) => host);
    expect(unlabelled).toEqual([]);
  });

  it('labels the hosts that were missing', () => {
    expect(getRecipeSourcePublisher('https://www.jamieoliver.com/recipes/a')).toBe('Jamie Oliver');
    expect(getRecipeSourcePublisher('https://www.tesco.com/recipes/b')).toBe('Tesco Recipes');
    expect(getRecipeSourcePublisher('https://tescorealfood.com/c')).toBe('Tesco Real Food');
    expect(getRecipeSourcePublisher('https://www.goodhousekeeping.com/food/recipes/d')).toBe('Good Housekeeping');
    expect(getRecipeSourcePublisher('https://www.olivemagazine.com/recipes/e')).toBe('Olive Magazine');
    expect(getRecipeSourcePublisher('https://www.slimmingworld.co.uk/recipes/f')).toBe('Slimming World');
    expect(getRecipeSourcePublisher('https://audleyrestaurants.co.uk/recipes/g')).toBe('Audley Restaurants');
  });
});
