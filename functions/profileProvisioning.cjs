const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || 'ai-studio-ffdbb575-df5b-4ac3-a6ad-710b4076125a';
const OWNER_EMAILS = new Set([
  'tmterencemartin@gmail.com',
  'qa-admin@dinnerbydesign.app',
]);

const defaultPreferences = () => ({
  dietaryRule: 'none',
  saladPreference: 'all',
  allergies: [],
  nutritiousChoice: false,
  isSimple: false,
  isLowCost: false,
  highOmega3: false,
  highProtein: false,
  includeOffal: false,
  servings: 2,
  calorieCeiling: null,
  budgetLimit: null,
  exclusions: [],
  cuisinePreferences: [],
  religiousEthical: [],
  cookingMethods: [],
  cookingFats: [],
  readyToEatUnderMins: null,
  preferredMode: 'cook',
  customCuisines: [],
  preferredSupermarkets: [],
  preferredSourceIds: [],
});

const isRegisteredUser = (user) => Boolean(
  user && (user.email || user.phoneNumber || (user.providerData && user.providerData.length > 0))
);

const getUserDisplayNameParts = (user, email) => {
  const names = String(user.displayName || '').trim().split(/\s+/).filter(Boolean);
  return {
    displayName: user.displayName || email || 'User',
    firstName: names[0] || (email ? email.split('@')[0] : 'User'),
    lastName: names.length > 1 ? names.slice(1).join(' ') : '',
  };
};

const buildDefaultUserProfile = (user) => {
  const email = user.email || '';
  const owner = OWNER_EMAILS.has(email.toLowerCase());
  const names = getUserDisplayNameParts(user, email);
  const preferences = defaultPreferences();

  return {
    uid: user.uid,
    email,
    displayName: names.displayName,
    firstName: names.firstName,
    lastName: names.lastName,
    phoneNumber: user.phoneNumber || '',
    preferences,
    isPremium: owner,
    accessStatus: owner ? 'paid' : 'trial',
    trialStartedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    searchOnboardingDismissed: false,
    welcomeEmailSent: false,
  };
};

const provisionUserProfile = async (user) => {
  if (!isRegisteredUser(user)) return { provisioned: false, reason: 'anonymous' };

  const db = getFirestore(FIRESTORE_DATABASE_ID);
  const profileRef = db.collection('users').doc(user.uid);
  const preferencesRef = profileRef.collection('profile').doc('preferences');
  const profile = buildDefaultUserProfile(user);

  await db.runTransaction(async (transaction) => {
    const profileSnapshot = await transaction.get(profileRef);
    const preferencesSnapshot = await transaction.get(preferencesRef);

    if (!profileSnapshot.exists) {
      transaction.create(profileRef, profile);
    }
    if (!preferencesSnapshot.exists) {
      transaction.create(preferencesRef, {
        ...profile.preferences,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });

  return { provisioned: true, uid: user.uid };
};

module.exports = {
  buildDefaultUserProfile,
  defaultPreferences,
  isRegisteredUser,
  provisionUserProfile,
};
