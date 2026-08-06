import React from 'react';
import {
  LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE,
  renderLeftoverRoastChickenBudgetDinnersGuideInitialHtml,
} from '../../content/leftoverRoastChickenBudgetDinnersGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const LeftoverRoastChickenBudgetDinnersGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={LEFTOVER_ROAST_CHICKEN_BUDGET_DINNERS_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 6 August 2026 · Last reviewed 6 August 2026"
    renderInitialHtml={renderLeftoverRoastChickenBudgetDinnersGuideInitialHtml}
    ctaTitle="Find chicken recipes for dinner"
    ctaCopy="Search DinnerByDesign for chicken recipes that suit your time, budget and preferences."
    ctaLabel="Find chicken recipes"
    onCta={onFindDinners}
  />
);
