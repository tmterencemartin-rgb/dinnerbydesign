export interface AuthenticationIdentitySnapshot {
  uid: string;
  isAnonymous: boolean;
  email?: string | null;
  displayName?: string | null;
  createdAt?: string | null;
  lastSignInAt?: string | null;
  providers?: string[];
  disabled?: boolean;
}

export interface AccountReconciliationSummary {
  authenticationIdentities: number;
  registeredIdentities: number;
  anonymousIdentities: number;
  profileDocuments: number;
  registeredWithoutProfile: number;
  anonymousWithoutProfile: number;
  profilesWithoutAuthentication: number;
}

export function findRegisteredIdentitiesWithoutProfiles(
  identities: AuthenticationIdentitySnapshot[],
  profileIds: Iterable<string>,
): AuthenticationIdentitySnapshot[] {
  const profileIdSet = new Set(profileIds);
  return identities.filter(identity => !identity.isAnonymous && !profileIdSet.has(identity.uid));
}

export function findAnonymousIdentitiesWithoutProfiles(
  identities: AuthenticationIdentitySnapshot[],
  profileIds: Iterable<string>,
): AuthenticationIdentitySnapshot[] {
  const profileIdSet = new Set(profileIds);
  return identities.filter(identity => identity.isAnonymous && !profileIdSet.has(identity.uid));
}

export function summariseAccountReconciliation(
  identities: AuthenticationIdentitySnapshot[],
  profileIds: Iterable<string>,
): AccountReconciliationSummary {
  const profileIdSet = new Set(profileIds);
  const identityIdSet = new Set(identities.map(identity => identity.uid));
  const registeredIdentities = identities.filter(identity => !identity.isAnonymous);
  const anonymousIdentities = identities.filter(identity => identity.isAnonymous);

  return {
    authenticationIdentities: identities.length,
    registeredIdentities: registeredIdentities.length,
    anonymousIdentities: anonymousIdentities.length,
    profileDocuments: profileIdSet.size,
    registeredWithoutProfile: findRegisteredIdentitiesWithoutProfiles(identities, profileIdSet).length,
    anonymousWithoutProfile: findAnonymousIdentitiesWithoutProfiles(identities, profileIdSet).length,
    profilesWithoutAuthentication: [...profileIdSet].filter(uid => !identityIdSet.has(uid)).length,
  };
}
