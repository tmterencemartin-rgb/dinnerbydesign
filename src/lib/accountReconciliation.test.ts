import { describe, expect, it } from 'vitest';
import {
  findAnonymousIdentitiesWithoutProfiles,
  findRegisteredIdentitiesWithoutProfiles,
  summariseAccountReconciliation,
} from './accountReconciliation';

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

  it('returns only registered identities that have no stored profile', () => {
    const missing = findRegisteredIdentitiesWithoutProfiles([
      { uid: 'customer', isAnonymous: false, email: 'customer@example.com' },
      { uid: 'missing', isAnonymous: false, email: 'missing@example.com' },
      { uid: 'guest', isAnonymous: true },
    ], ['customer']);

    expect(missing).toEqual([
      { uid: 'missing', isAnonymous: false, email: 'missing@example.com' },
    ]);
  });

  it('returns only anonymous identities that have no stored profile', () => {
    const missing = findAnonymousIdentitiesWithoutProfiles([
      { uid: 'customer', isAnonymous: false },
      { uid: 'guest-with-profile', isAnonymous: true },
      { uid: 'guest-without-profile', isAnonymous: true },
    ], ['customer', 'guest-with-profile']);

    expect(missing).toEqual([
      { uid: 'guest-without-profile', isAnonymous: true },
    ]);
  });
});
