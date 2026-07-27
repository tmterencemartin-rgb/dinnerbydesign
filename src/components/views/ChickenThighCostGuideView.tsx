import React from 'react';
import {
  CHICKEN_THIGH_COST_GUIDE,
  renderChickenThighCostGuideInitialHtml,
} from '../../content/chickenThighCostGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const ChickenThighCostGuideView: React.FC<{ onFindRecipes: () => void }> = ({ onFindRecipes }) => (
  <PublicEditorialGuideView
    guide={CHICKEN_THIGH_COST_GUIDE}
    label="Recipe cost comparison"
    publishedLabel="Published 27 July 2026 · Last reviewed 27 July 2026"
    renderInitialHtml={renderChickenThighCostGuideInitialHtml}
    ctaTitle="Compare recipes with your own budget"
    ctaCopy="Use DinnerByDesign to search for recipes that fit your ingredients, preferences and available time."
    ctaLabel="Find a recipe"
    onCta={onFindRecipes}
  />
);
