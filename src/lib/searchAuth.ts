import { auth, signInAnon } from '../firebase';

export async function getSearchAuthToken(): Promise<string> {
  const currentUser = auth.currentUser || (await signInAnon()).user;
  return currentUser.getIdToken();
}
