import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  PublicEditorialGuideView,
} from './components/views/PublicEditorialGuideView';
import { WhyDinnerByDesignView } from './components/views/WhyDinnerByDesignView';
import {
  FAMILY_DINNERS_FOR_FOUR_PATH,
} from './content/familyDinnersForFourPlan';
import { PUBLISHED_PUBLIC_GUIDE_RECORDS } from './content/publicGuideRegistry';
import {
  FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
} from './content/seoMealPlans';
import {
  getPublicRoute,
  getPublicRouteSeo,
} from './PublicGuideApp';

const renderRoute = (path: string) => {
  const route = getPublicRoute(path);
  expect(route).toBeDefined();
  return route?.render({ plan: vi.fn(), search: vi.fn() });
};

const expectReactElement = (node: React.ReactNode) => {
  expect(React.isValidElement(node)).toBe(true);
  if (!React.isValidElement(node)) {
    throw new Error('Expected route to render a React element');
  }
  return node;
};

describe('PublicGuideApp routing', () => {
  it('has a public route for every published guide record', () => {
    PUBLISHED_PUBLIC_GUIDE_RECORDS.forEach(guide => {
      const route = getPublicRoute(guide.path);
      expect(route, guide.path).toBeDefined();
      expect(route?.seo.canonicalPath).toBe(guide.canonicalPath);
    });
  });

  it('uses the shared editorial view for registry-rendered guide pages', () => {
    const registryPage = expectReactElement(renderRoute('/guides/nine-budget-dinners-with-savoury-pies'));

    expect(registryPage.type).toBe(PublicEditorialGuideView);
  });

  it('keeps richer dinner-plan pages on their custom renderers', () => {
    const twoPersonPlan = expectReactElement(renderRoute(FIVE_DINNERS_FOR_TWO_UNDER_40_PATH));
    const familyPlan = expectReactElement(renderRoute(FAMILY_DINNERS_FOR_FOUR_PATH));

    expect(twoPersonPlan.type).not.toBe(PublicEditorialGuideView);
    expect(familyPlan.type).not.toBe(PublicEditorialGuideView);
  });

  it('exposes the public comparison page', () => {
    const comparisonPage = expectReactElement(renderRoute('/why-dinnerbydesign'));

    expect(comparisonPage.type).toBe(WhyDinnerByDesignView);
    expect(getPublicRouteSeo('/why-dinnerbydesign').canonicalPath).toBe('/why-dinnerbydesign');
  });

  it('keeps unknown guide URLs out of the index', () => {
    const seo = getPublicRouteSeo('/guides/not-a-real-guide');

    expect(getPublicRoute('/guides/not-a-real-guide')).toBeUndefined();
    expect(seo.title).toBe('Guide not found | DinnerByDesign');
    expect(seo.canonicalPath).toBe('/guides/not-a-real-guide');
    expect(seo.noIndex).toBe(true);
  });
});
