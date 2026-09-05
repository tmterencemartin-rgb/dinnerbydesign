import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchHeader } from './SearchHeader';

describe('SearchHeader', () => {
  it('names the published-source route for the administrator hand-off test', () => {
    render(
      <SearchHeader
        source="cook"
        setSource={vi.fn()}
        isDietaryRuleSuppressed={false}
        suppressedPermanentKeys={[]}
        clearSuppression={vi.fn()}
        adminSourceHandoff
      />
    );

    expect(screen.getByText('Published recipes')).toBeTruthy();
    expect(screen.getByText('open at the original source')).toBeTruthy();
  });

  it('gives the three administrator test routes equal visibility', () => {
    render(
      <SearchHeader
        source="cook"
        setSource={vi.fn()}
        isDietaryRuleSuppressed={false}
        suppressedPermanentKeys={[]}
        clearSuppression={vi.fn()}
        adminThreeWayPilot
        adminMode="ai-created"
        onAdminModeChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /AI-created dinners/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Published recipes/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ready-made/i })).toBeTruthy();
  });
});
