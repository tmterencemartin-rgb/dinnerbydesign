import { auth, signInAnon } from '../firebase';
import { getAppCheckToken } from './appCheck';

export async function getSearchAuthToken(): Promise<string> {
  const currentUser = auth.currentUser || (await signInAnon()).user;
  return currentUser.getIdToken();
}

export async function getSearchSecurityHeaders(): Promise<Record<string, string>> {
  const [token, appCheckToken] = await Promise.all([getSearchAuthToken(), getAppCheckToken()]);
  return {
    Authorization: `Bearer ${token}`,
    ...(appCheckToken ? { 'X-Firebase-AppCheck': appCheckToken } : {}),
  };
}
