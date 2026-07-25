import React from 'react';
import {
  TRAYBAKE_GUIDE,
  renderTraybakeGuideInitialHtml,
} from '../../content/traybakeGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const TraybakeGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={TRAYBAKE_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 25 July 2026 · Last reviewed 25 July 2026"
    renderInitialHtml={renderTraybakeGuideInitialHtml}
    ctaTitle="Find a traybake for tonight"
    ctaCopy="Search DinnerByDesign for traybake dinners, filtered by what is already in your kitchen or by cost."
    ctaLabel="Search traybake dinners"
    onCta={onFindDinners}
  />
);
