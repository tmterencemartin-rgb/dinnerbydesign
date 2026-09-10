import { describe, expect, it } from 'vitest';
import { getRecipeSourceLabel, getRecipeSourcePublisher } from './sourceLabel';

describe('getRecipeSourceLabel', () => {
  it('hides internal grounding hosts from users', () => {
    expect(getRecipeSourceLabel('https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc')).toBe('Source page');
  });

  it('keeps a normal source hostname readable', () => {
    expect(getRecipeSourceLabel('https://www.bbcgoodfood.com/recipes/example')).toBe('bbcgoodfood.com');
  });

  it('uses a readable publisher name when it is recognised', () => {
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
