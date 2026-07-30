import { describe, expect, it } from 'vitest';
import { summariseAccountReconciliation } from './accountReconciliation';

describe('account reconciliation', () => {
  it('separates registered and anonymous identities from stored profiles', () => {
    expect(summariseAccountReconciliation([
      { uid: 'admin', isAnonymous: false },
      { uid: 'customer', isAnonymous: false },
      { uid: 'orphaned-customer', isAnonymous: false },
      { uid: 'guest', isAnonymous: true },
      { uid: 'orphaned-guest', isAnonymous: true },
    ], ['admin', 'customer', 'guest', 'profile-without-auth'])).toEqual({
      authenticationIdentities: 5,
      registeredIdentities: 3,
      anonymousIdentities: 2,
      profileDocuments: 4,
      registeredWithoutProfile: 1,
      anonymousWithoutProfile: 1,
      profilesWithoutAuthentication: 1,
    });
  });

  it('does not count duplicate profile ids twice', () => {
    const summary = summariseAccountReconciliation(
      [{ uid: 'customer', isAnonymous: false }],
      ['customer', 'customer'],
    );

    expect(summary.profileDocuments).toBe(1);
    expect(summary.registeredWithoutProfile).toBe(0);
    expect(summary.profilesWithoutAuthentication).toBe(0);
  });
});
