export interface AuthenticationIdentitySnapshot {
  uid: string;
  isAnonymous: boolean;
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
    registeredWithoutProfile: registeredIdentities.filter(identity => !profileIdSet.has(identity.uid)).length,
    anonymousWithoutProfile: anonymousIdentities.filter(identity => !profileIdSet.has(identity.uid)).length,
    profilesWithoutAuthentication: [...profileIdSet].filter(uid => !identityIdSet.has(uid)).length,
  };
}
