# Authentication profile provisioning

DinnerByDesign keeps a Firebase Authentication identity and a Firestore app profile in sync.

- New registered identities are provisioned by the Firebase Auth `onCreate` trigger in `functions/index.cjs`.
- Anonymous identities intentionally remain browser-local and do not receive a Firestore profile.
- The client also retries provisioning when a registered identity signs in without `users/{uid}`.
- Existing orphaned identities can be reviewed with the repair script before applying changes.

## Dry run

Set `FIREBASE_SERVICE_ACCOUNT_JSON` to a service-account JSON value, or use Application Default Credentials, then run:

```bash
node scripts/repairOrphanedProfiles.mjs
```

## Apply

After reviewing the dry-run list, run:

```bash
node scripts/repairOrphanedProfiles.mjs --apply
```

The script creates only missing profiles and preference documents. It does not delete authentication identities or overwrite existing profile documents.
