import React from 'react';
import {
  FIVE_STAPLES_GUIDE,
  renderFiveStaplesGuideInitialHtml,
} from '../../content/fiveStaplesGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const FiveStaplesGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={FIVE_STAPLES_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 28 July 2026 · Last reviewed 28 July 2026"
    renderInitialHtml={renderFiveStaplesGuideInitialHtml}
    ctaTitle="Find a dinner for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn one of these staple-led ideas into a plan for your household."
    ctaLabel="Find a dinner"
    onCta={onFindDinners}
  />
);
