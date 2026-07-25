import React from 'react';
import {
  PULSES_BUDGET_GUIDE,
  renderPulsesBudgetGuideInitialHtml,
} from '../../content/pulsesBudgetGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const PulsesBudgetGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={PULSES_BUDGET_GUIDE}
    label="Food cost guide"
    publishedLabel="Published 25 July 2026 · Last reviewed 25 July 2026"
    renderInitialHtml={renderPulsesBudgetGuideInitialHtml}
    ctaTitle="Find a dinner built around pulses"
    ctaCopy="Search DinnerByDesign for dinners using lentils, beans or chickpeas."
    ctaLabel="Find pulse-based dinners"
    onCta={onFindDinners}
  />
);
