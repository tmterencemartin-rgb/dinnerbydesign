import { describe, expect, it, vi } from 'vitest';
import { canonicaliseGroundedUrl, confirmPublisherRecipePageUrl, isApprovedDirectRecipeUrl, isDirectHttpsContentUrl, isInternalGroundingUrl, isTrustedRecipePublisherUrl, reconcileGroundedSourceUrl, retainCandidateSourceUrl } from './groundingUtils';

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
    expect(isApprovedDirectRecipeUrl('https://www.waitrose.com/ecom/recipes/roast-chicken')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.asda.com/good-living/recipes/sausage-and-bean-stew')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.sainsburysmagazine.co.uk/recipes/chicken-pie')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.olivemagazine.com/recipes/vegetarian/green-lentil-curry/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.greatbritishchefs.com/recipes/chicken-curry-recipe')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.telegraph.co.uk/recipes/0/chicken-pie/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.thetimes.com/life-style/food-drink/recipe/chicken-pie-0')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.thesundaytimes.co.uk/thedish/recipe/chicken-pie')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.goodhousekeeping.com/uk/food/recipes/a12345/chicken-pie/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.deliaonline.com/recipes/chicken-casserole')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.nigella.com/recipes/chicken-with-chorizo-and-cannellini-beans')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://foodnetwork.co.uk/recipes/roast-chicken')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://pinchofnom.com/recipes/chicken-curry/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://maryberry.co.uk/recipes/chicken-valencia')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://greatbritishrecipes.com/chicken-casserole/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.recipetineats.com/chicken-stroganoff/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.gressinghamduck.co.uk/recipes/duck-breast-with-cherry-sauce/')).toBe(true);
    expect(isApprovedDirectRecipeUrl('https://www.bbcgoodfood.com/search?q=scallops')).toBe(false);
    expect(isApprovedDirectRecipeUrl('https://example.com/recipes/scallops')).toBe(false);
  });

  it('recognises direct HTTPS content URLs independently of publisher approval', () => {
    expect(isDirectHttpsContentUrl('https://example.com/recipes/scallops')).toBe(true);
    expect(isDirectHttpsContentUrl('http://example.com/recipes/scallops')).toBe(false);
    expect(isDirectHttpsContentUrl('https://user:password@example.com/recipes/scallops')).toBe(false);
    expect(isDirectHttpsContentUrl('https://example.com/search?q=scallops')).toBe(false);
    expect(isDirectHttpsContentUrl('https://example.com/collections/weeknight')).toBe(false);
  });

  it('rejects a trusted publisher page that explicitly reports it is missing', async () => {
    const request = vi.fn().mockResolvedValue({
      status: 404,
      url: 'https://www.bbcgoodfood.com/recipes/healthy-one-pan-roast-chicken'
    });

    await expect(confirmPublisherRecipePageUrl(
      'https://www.bbcgoodfood.com/recipes/healthy-one-pan-roast-chicken',
      request
    )).resolves.toBeNull();
    expect(request).toHaveBeenCalledWith(
      'https://www.bbcgoodfood.com/recipes/healthy-one-pan-roast-chicken',
      expect.objectContaining({ method: 'HEAD', redirect: 'follow' })
    );
  });

  it('retains a trusted publisher page when an automated check is blocked', async () => {
    const request = vi.fn().mockRejectedValue(new Error('Blocked'));
    const sourceUrl = 'https://www.bbcgoodfood.com/recipes/chicken-red-pepper-almond-traybake';

    await expect(confirmPublisherRecipePageUrl(sourceUrl, request)).resolves.toBe(sourceUrl);
  });

  it('rejects a publisher redirect that no longer resolves to a recipe page', async () => {
    const request = vi.fn().mockResolvedValue({
      status: 200,
      url: 'https://www.bbcgoodfood.com/'
    });

    await expect(confirmPublisherRecipePageUrl(
      'https://www.bbcgoodfood.com/recipes/chicken-red-pepper-almond-traybake',
      request
    )).resolves.toBeNull();
  });
});
