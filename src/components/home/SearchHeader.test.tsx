import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchHeader } from './SearchHeader';

describe('SearchHeader', () => {
  it('names the published-source route', () => {
    render(
      <SearchHeader
        source="cook"
        setSource={vi.fn()}
        isDietaryRuleSuppressed={false}
        suppressedPermanentKeys={[]}
        clearSuppression={vi.fn()}
        sourceHandoff
      />
    );

    expect(screen.getByText('Published recipes')).toBeTruthy();
    expect(screen.getByText('open at the original source')).toBeTruthy();
  });

  it('gives the three public search routes equal visibility', () => {
    render(
      <SearchHeader
        source="cook"
        setSource={vi.fn()}
        isDietaryRuleSuppressed={false}
        suppressedPermanentKeys={[]}
        clearSuppression={vi.fn()}
        threeWaySearch
        mode="ai-created"
        onModeChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /AI-created dinners/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Published recipes/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ready-made/i })).toBeTruthy();
  });
});
