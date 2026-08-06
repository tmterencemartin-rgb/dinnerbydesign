import React from 'react';
import {
  MINCE_BUDGET_DINNERS_GUIDE,
  renderMinceBudgetDinnersGuideInitialHtml,
} from '../../content/minceBudgetDinnersGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const MinceBudgetDinnersGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={MINCE_BUDGET_DINNERS_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 6 August 2026 · Last reviewed 6 August 2026"
    renderInitialHtml={renderMinceBudgetDinnersGuideInitialHtml}
    ctaTitle="Find mince recipes for dinner"
    ctaCopy="Search DinnerByDesign for beef or pork mince recipes that suit your time, budget and preferences."
    ctaLabel="Find mince recipes"
    onCta={onFindDinners}
  />
);
