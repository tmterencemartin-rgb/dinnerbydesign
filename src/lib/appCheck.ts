import { getToken, initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';
import type { FirebaseApp } from 'firebase/app';

let appCheck: AppCheck | null = null;

export function initialiseAppCheck(app: FirebaseApp, isNativeRuntime: boolean) {
  const siteKey = typeof process !== 'undefined'
    ? String(process.env.VITE_FIREBASE_APP_CHECK_SITE_KEY || '').trim()
    : '';
  if (!siteKey || isNativeRuntime || appCheck) return;

  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn('[AppCheck] Initialisation was unavailable.', error);
  }
}

export async function getAppCheckToken(): Promise<string | null> {
  if (!appCheck) return null;
  try {
    return (await getToken(appCheck)).token;
  } catch (error) {
    console.warn('[AppCheck] Token could not be obtained.', error);
    return null;
  }
}
