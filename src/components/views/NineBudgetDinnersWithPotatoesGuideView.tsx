import React from 'react';
import { NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE, renderNineBudgetDinnersWithPotatoesGuideInitialHtml } from '../../content/nineBudgetDinnersWithPotatoesGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const NineBudgetDinnersWithPotatoesGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={NINE_BUDGET_DINNERS_WITH_POTATOES_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 9 August 2026 · Last reviewed 9 August 2026"
    renderInitialHtml={renderNineBudgetDinnersWithPotatoesGuideInitialHtml}
    ctaTitle="Find dinners for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household."
    ctaLabel="Find dinners"
    onCta={onFindDinners}
  />
);
