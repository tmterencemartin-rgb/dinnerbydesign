import React from 'react';
import {
  SAUSAGE_WAYS_GUIDE,
  renderSausageWaysGuideInitialHtml,
} from '../../content/sausageWaysGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const SausageWaysGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => (
  <PublicEditorialGuideView
    guide={SAUSAGE_WAYS_GUIDE}
    label="Practical cooking guide"
    publishedLabel="Published 25 July 2026 · Last reviewed 25 July 2026"
    renderInitialHtml={renderSausageWaysGuideInitialHtml}
    ctaTitle="Find sausage recipes for dinner"
    ctaCopy="Search DinnerByDesign for sausage recipes that suit your time, budget and preferences."
    ctaLabel="Find sausage recipes"
    onCta={onFindDinners}
  />
);
