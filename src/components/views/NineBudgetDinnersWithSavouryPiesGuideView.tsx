import React from 'react';
import { NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE, renderNineBudgetDinnersWithSavouryPiesGuideInitialHtml } from '../../content/nineBudgetDinnersWithSavouryPiesGuide';
import { PublicEditorialGuideView } from './PublicEditorialGuideView';

export const NineBudgetDinnersWithSavouryPiesGuideView: React.FC<{ onFindDinners: () => void }> = ({ onFindDinners }) => <PublicEditorialGuideView guide={NINE_BUDGET_DINNERS_WITH_SAVOURY_PIES_GUIDE} label="Practical cooking guide" publishedLabel="Published 9 August 2026 · Last reviewed 9 August 2026" renderInitialHtml={renderNineBudgetDinnersWithSavouryPiesGuideInitialHtml} ctaTitle="Find dinners for tonight" ctaCopy="Search DinnerByDesign by ingredient, time or dietary preference and turn these ideas into a plan for your household." ctaLabel="Find dinners" onCta={onFindDinners} />;
