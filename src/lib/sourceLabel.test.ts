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
  });
});
