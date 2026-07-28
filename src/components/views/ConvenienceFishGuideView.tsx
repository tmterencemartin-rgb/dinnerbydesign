import React from 'react';
import {
  CONVENIENCE_FISH_GUIDE,
  renderConvenienceFishGuideInitialHtml,
} from '../../content/convenienceFishGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const ConvenienceFishGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={CONVENIENCE_FISH_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 28 July 2026 · Last reviewed 28 July 2026"
    renderInitialHtml={renderConvenienceFishGuideInitialHtml}
    ctaTitle="Find more dinner ideas"
    ctaCopy="Search DinnerByDesign for ideas built around what is already in the freezer or fridge."
    ctaLabel="Find a dinner"
    onCta={onFindDinners}
  />
);
