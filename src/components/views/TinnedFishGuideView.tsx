import React from 'react';
import {
  TINNED_FISH_GUIDE,
  renderTinnedFishGuideInitialHtml,
} from '../../content/tinnedFishGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const TinnedFishGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={TINNED_FISH_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 28 July 2026 · Last reviewed 28 July 2026"
    renderInitialHtml={renderTinnedFishGuideInitialHtml}
    ctaTitle="Find more dinner ideas"
    ctaCopy="Search DinnerByDesign for ideas built around what is already in the cupboard, fridge or freezer."
    ctaLabel="Find a dinner"
    onCta={onFindDinners}
  />
);
