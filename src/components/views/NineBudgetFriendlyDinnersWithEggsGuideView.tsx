import React from 'react';
import {
  NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE,
  renderNineBudgetFriendlyDinnersWithEggsGuideInitialHtml,
} from '../../content/nineBudgetFriendlyDinnersWithEggsGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const NineBudgetFriendlyDinnersWithEggsGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={NINE_BUDGET_FRIENDLY_DINNERS_WITH_EGGS_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 7 August 2026 · Last reviewed 7 August 2026"
    renderInitialHtml={renderNineBudgetFriendlyDinnersWithEggsGuideInitialHtml}
    ctaTitle="Find dinners for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household."
    ctaLabel="Find dinners"
    onCta={onFindDinners}
  />
);
