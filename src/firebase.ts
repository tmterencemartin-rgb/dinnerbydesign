import { initializeApp } from 'firebase/app';
import {
  browserPopupRedirectResolver,
  browserLocalPersistence,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, onSnapshot, getDocFromServer, limit, Timestamp, FieldValue } from 'firebase/firestore';

import firebaseConfig from '../firebase-applet-config.json';
import { reportClientError } from './lib/clientErrorTelemetry';

const app = initializeApp(firebaseConfig);
const isNativeRuntime = () => {
  const capacitor = (globalThis as any).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
};

export const auth = (() => {
  try {
    const isNative = isNativeRuntime();
    return initializeAuth(app, {
      persistence: isNative ? browserLocalPersistence : indexedDBLocalPersistence,
      ...(isNative ? {} : { popupRedirectResolver: browserPopupRedirectResolver })
    });
  } catch {
    return getAuth(app);
  }
})();

// Standard Firestore initialization with single tab manager to prevent iframe lease locking conflicts
// Initialize Firestore with settings for better connectivity in restricted environments
// Using experimentalForceLongPolling as a proven fix for many proxy/iframe issues
// Disabling persistent cache to avoid indexedDB lease locking issues in sandboxed previews
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: memoryLocalCache()
}, firebaseConfig.firestoreDatabaseId);

export const signInAnon = () => signInAnonymously(auth);

export function isTimestamp(val: unknown): val is Timestamp {
  return !!val && typeof (val as { toDate?: unknown }).toDate === 'function';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isPermissionError = errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('insufficient');
  const isLoggedOut = !auth.currentUser;

  reportClientError({
    kind: 'runtime',
    message: `Firestore ${operationType} request failed`,
    source: isPermissionError ? 'firestore_permission' : 'firestore_runtime',
  });

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    }
  };

  const jsonError = JSON.stringify(errInfo);
  
  // If it is a permission error and the user is logged out, don't throw to avoid uncaught exceptions
  // during standard logout or account deletion flows where listeners might linger for a moment.
  if (isPermissionError && isLoggedOut) {
    console.warn('Silent permission error handled during logout state:', jsonError);
    return;
  }

  // Otherwise log as error
  console.error('Firestore Error:', jsonError);
  
  // As per skill requirements: MUST throw a new error with the JSON string for genuine runtime errors
  throw new Error(jsonError);
}
