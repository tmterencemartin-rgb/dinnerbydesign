import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
const { isRegisteredUser, provisionUserProfile } = require('../functions/profileProvisioning.cjs');
const firebaseConfig = JSON.parse(await readFile(new URL('../firebase-applet-config.json', import.meta.url), 'utf8'));
const shouldApply = process.argv.includes('--apply');
const serviceAccountJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();

if (getApps().length === 0) {
  initializeApp(serviceAccountJson
    ? {
        credential: cert(JSON.parse(serviceAccountJson)),
        projectId: firebaseConfig.projectId,
      }
    : { projectId: firebaseConfig.projectId });
}

const auth = getAuth();
const db = getFirestore(firebaseConfig.firestoreDatabaseId);
const identities = [];
let pageToken;

do {
  const page = await auth.listUsers(1000, pageToken);
  identities.push(...page.users);
  pageToken = page.pageToken;
} while (pageToken);

const profileSnapshot = await db.collection('users').get();
const profileIds = new Set(profileSnapshot.docs.map(document => document.id));
const orphanedUsers = identities.filter(user => isRegisteredUser(user) && !profileIds.has(user.uid));

console.log(`Found ${orphanedUsers.length} registered identities without profiles.`);
for (const user of orphanedUsers) {
  console.log(`- ${user.email || user.phoneNumber || user.uid}`);
}

if (!shouldApply) {
  console.log('Dry run only. Re-run with --apply to create the missing profiles.');
  process.exit(0);
}

for (const user of orphanedUsers) {
  await provisionUserProfile(user, db);
}

console.log(`Provisioned ${orphanedUsers.length} missing profiles.`);
