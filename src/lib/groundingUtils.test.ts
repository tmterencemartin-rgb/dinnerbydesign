import { describe, expect, it } from 'vitest';
import { canonicaliseGroundedUrl, isApprovedDirectRecipeUrl, isInternalGroundingUrl, isTrustedRecipePublisherUrl, reconcileGroundedSourceUrl, retainCandidateSourceUrl } from './groundingUtils';

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

  it('retains a valid source URL when Google returns no grounding metadata', () => {
    expect(retainCandidateSourceUrl('https://www.bbcgoodfood.com/recipes/haddock-potato-bake#method', [])).toBe(
      'https://www.bbcgoodfood.com/recipes/haddock-potato-bake'
    );
    expect(retainCandidateSourceUrl('not a URL', [])).toBeNull();
  });

  it('recognises internal grounding URLs that are not recipe pages', () => {
    expect(isInternalGroundingUrl('https://vertexaisearch.cloud.google.com/grounding/recipe')).toBe(true);
    expect(isInternalGroundingUrl('https://www.bbcgoodfood.com/recipes/haddock-potato-bake')).toBe(false);
  });

  it('accepts only recognised recipe-publisher domains when no grounding record is available', () => {
    expect(isTrustedRecipePublisherUrl('https://www.bbcgoodfood.com/recipes/haddock-potato-bake')).toBe(true);
    expect(isTrustedRecipePublisherUrl('https://example.com/haddock-potato-bake')).toBe(false);
  });

  it('accepts only direct recipe pages from approved publishers when grounding metadata is absent', () => {
    expect(isApprovedDirectRecipeUrl('https://www.bbcgoodfood.com/recipes/haddock-potato-bake')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.kitchensanctuary.com/creamy-garlic-scallops/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.bbcgoodfood.com/search?q=scallops')).toBe(false);
    expect(isApprovedDirectRecipeUrl('https://example.com/recipes/scallops')).toBe(false);
  });
});
