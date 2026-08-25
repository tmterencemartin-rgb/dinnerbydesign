import { describe, expect, it } from 'vitest';
import { canonicaliseGroundedUrl, reconcileGroundedSourceUrl } from './groundingUtils';

describe('grounded source URL reconciliation', () => {
  const groundedSources = [
    { url: 'https://www.bbcgoodfood.com/recipes/haddock-potato-bake?b=2&a=1' },
    { url: 'https://www.tescorealfood.com/recipes/haddock-potatoes' },
  ];

  it('canonicalises fragments and trailing slashes', () => {
    expect(canonicaliseGroundedUrl('https://example.com/recipe/#ingredients')).toBe('https://example.com/recipe');
  });

  it('matches a grounded URL despite harmless URL formatting differences', () => {
    expect(reconcileGroundedSourceUrl(
      'https://BBCGoodFood.com/recipes/haddock-potato-bake?a=1&utm_source=search&b=2#method',
      groundedSources
    )).toBe('https://www.bbcgoodfood.com/recipes/haddock-potato-bake?b=2&a=1');
  });

  it('rejects URLs that are not in the grounded source set', () => {
    expect(reconcileGroundedSourceUrl('https://example.com/haddock-potatoes', groundedSources)).toBeNull();
    expect(reconcileGroundedSourceUrl('recipe-search', groundedSources)).toBeNull();
  });
});
