import React from 'react';
import {
  NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE,
  renderNineBudgetDinnersThreeCuisinesGuideInitialHtml,
} from '../../content/nineBudgetDinnersThreeCuisinesGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const NineBudgetDinnersThreeCuisinesGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={NINE_BUDGET_DINNERS_THREE_CUISINES_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 6 August 2026 · Last reviewed 6 August 2026"
    renderInitialHtml={renderNineBudgetDinnersThreeCuisinesGuideInitialHtml}
    ctaTitle="Find dinners for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household."
    ctaLabel="Find dinners"
    onCta={onFindDinners}
  />
);
