import React from 'react';
import { WHOLE_CHICKEN_VALUE_GUIDE, renderWholeChickenValueGuideInitialHtml } from '../../content/wholeChickenValueGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const WholeChickenValueGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={WHOLE_CHICKEN_VALUE_GUIDE}
    label="Food cost guide"
    publishedLabel="Published 8 August 2026 · Last reviewed 8 August 2026"
    renderInitialHtml={renderWholeChickenValueGuideInitialHtml}
    ctaTitle="Find chicken recipes for dinner"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and find a recipe that suits your household."
    ctaLabel="Find chicken recipes"
    onCta={onFindDinners}
  />
);
