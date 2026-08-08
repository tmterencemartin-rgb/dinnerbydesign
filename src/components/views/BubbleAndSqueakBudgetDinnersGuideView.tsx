import React from 'react';
import { BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE, renderBubbleAndSqueakBudgetDinnersGuideInitialHtml } from '../../content/bubbleAndSqueakBudgetDinnersGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const BubbleAndSqueakBudgetDinnersGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={BUBBLE_AND_SQUEAK_BUDGET_DINNERS_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 8 August 2026 · Last reviewed 8 August 2026"
    renderInitialHtml={renderBubbleAndSqueakBudgetDinnersGuideInitialHtml}
    ctaTitle="Find dinners for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household."
    ctaLabel="Find dinners"
    onCta={onFindDinners}
  />
);
