const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const { provisionUserProfile } = require('./profileProvisioning.cjs');

admin.initializeApp();

exports.provisionUserProfile = functions.auth.user().onCreate(async (user) => {
  const result = await provisionUserProfile(user);
  if (result.provisioned) {
    console.log(`[AuthProvisioning] Profile ensured for ${result.uid}`);
  } else {
    console.log('[AuthProvisioning] Anonymous identity skipped');
  }
  return null;
});
