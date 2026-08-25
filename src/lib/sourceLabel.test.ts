import { describe, expect, it } from 'vitest';
import { getRecipeSourceLabel } from './sourceLabel';

describe('getRecipeSourceLabel', () => {
  it('hides internal grounding hosts from users', () => {
    expect(getRecipeSourceLabel('https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc')).toBe('Source page');
  });

  it('keeps a normal source hostname readable', () => {
    expect(getRecipeSourceLabel('https://www.bbcgoodfood.com/recipes/example')).toBe('bbcgoodfood.com');
  });
});
