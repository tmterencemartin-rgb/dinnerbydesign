import React from 'react';
import { MEAT_STRETCHING_GUIDE, renderMeatStretchingGuideInitialHtml } from '../../content/meatStretchingGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const MeatStretchingGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={MEAT_STRETCHING_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 9 August 2026 · Last reviewed 9 August 2026"
    renderInitialHtml={renderMeatStretchingGuideInitialHtml}
    ctaTitle="Find dinners for tonight"
    ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household."
    ctaLabel="Find dinners"
    onCta={onFindDinners}
  />
);
