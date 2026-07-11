import React, { createContext, useState, useEffect, ReactNode, useRef, useContext } from 'react';
import { useLocation } from 'wouter';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  getAuth,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  deleteUser as firebaseDeleteUser,
  linkWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithRedirect,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  Timestamp,
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../firebase';
import { getApiUrl } from '../lib/api';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  UserPreferences, 
  SavedRecipe, 
  ShoppingListItem, 
  PantryItem, 
  Recipe, 
  ReadyMeal,
  DinnerSource,
  SaladPreference,
  DietaryRule,
  OperationType,
  AppView
} from '../types';
import { normaliseUserPreferences, checkNeedsDietConfirmation } from '../lib/preferenceUtils';
import { buildShoppingListData, SHOPPING_CATEGORIES, normalizeIngredientKey } from '../lib/shoppingUtils';
import { generateDinnerSuggestions, enrichRecipe } from '../services/geminiService';
import { safeStorage } from '../lib/storage';
import { prepareSavedRecipeData } from '../lib/savedRecipeData';
import {
  clearPlannerWeekRecipes,
  getScheduledRecipeForDay,
  isMissingPlannerRecipeError,
  unschedulePlannerRecipe,
  updatePlannerRecipe,
} from '../lib/plannerWrites';
import {
  removeAllUnscheduledSavedRecipes,
  removeRecipeDocument,
  saveRecipeDocument,
  updateRecipeDocument,
} from '../lib/savedRecipeWrites';
import {
  addCustomShoppingItemDocument,
  clearDerivedShoppingListDocuments,
  removeShoppingItemDocument,
  syncShoppingListDocuments,
  updateShoppingItemDocument,
} from '../lib/shoppingListWrites';
import {
  addPantryItemDocument,
  removePantryItemDocument,
  updatePantryStapleDocument,
} from '../lib/pantryWrites';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  planner: SavedRecipe[];
  loading: boolean;
  isAuthReady: boolean;
  diagnosticLogs: { id: string; message: string }[];
  addLog: (msg: string) => void;
  error: string | null;
  needsDietConfirmation: boolean;
  setNeedsDietConfirmation: (val: boolean) => void;
  updatePreference: (key: keyof UserPreferences, value: any) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePlanner: (scheduledDate: string, recipe: SavedRecipe | Recipe | ReadyMeal) => Promise<{ id: string, wasUnscheduledId?: string, isNew?: boolean } | undefined>;
  saveRecipe: (item: Recipe | ReadyMeal) => Promise<string | undefined>;
  removeRecipe: (recipeId: string) => Promise<void>;
  updateRecipe: (recipeId: string, updates: Partial<SavedRecipe>) => Promise<void>;
  unscheduleRecipe: (recipeId: string) => Promise<void>;
  clearPlannerDay: (scheduledDate: string) => Promise<void>;
  clearPlannerWeek: () => Promise<void>;
  removeAllSavedRecipes: () => Promise<void>;
  generateShoppingList: () => Promise<void>;
  toggleShoppingItem: (id: string, checked: boolean) => Promise<void>;
  updateShoppingItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  addCustomShoppingItem: (name: string, category?: string) => Promise<void>;
  removeShoppingItem: (id: string) => Promise<void>;
  addToPantry: (name: string, category?: string, isStaple?: boolean) => Promise<void>;
  removeFromPantry: (id: string) => Promise<void>;
  togglePantryStaple: (id: string, isStaple: boolean) => Promise<void>;
  clearError: () => void;
  setError: (msg: string | null) => void;
  authError: string | null;
  savedRecipes: SavedRecipe[];
  shoppingList: ShoppingListItem[];
  pantry: PantryItem[];
  persistentPantryItems: string[];
  addPersistentPantryItem: (key: string) => Promise<void>;
  removePersistentPantryItem: (key: string) => Promise<void>;
  savePreferences: (newPreferences: UserPreferences) => Promise<void>;
  clearLogs: () => void;
  toast: { message: string; actionLabel?: string; onAction?: () => void; id: number } | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  setToast: (val: any) => void;
  handlePrintRecipe: (recipe: SavedRecipe | Recipe | ReadyMeal) => void;
  accessStatus: 'trial' | 'read_only' | 'paid';
  trialDaysLeft: number;
  trialTimeRemaining: string;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  reauthenticateUser: (password: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  view: AppView;
  setView: (view: AppView, highlight?: string | null) => void;
  goToSignIn: () => void;
  highlight: string | null;
  clearHighlight: () => void;
  addToSearchHistory: (query: string, mode: DinnerSource) => Promise<void>;
  unitSystem: 'metric' | 'imperial';
  setUnitSystem: (system: 'metric' | 'imperial') => void;
}

const OWNER_EMAILS = ["tmterencemartin@gmail.com"];

const isOwnerEmail = (email?: string | null) => (
  !!email && OWNER_EMAILS.includes(email.toLowerCase())
);

const hasPermanentAccess = (profile?: UserProfile | null) => profile?.permanentAccess === true;

const parseToDate = (val: any): Date => {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  // Handle Firestore/Admin Timestamp instances
  if (typeof val.toDate === 'function') {
    try {
      return val.toDate();
    } catch (e) {
      // Fallback in case of call signature differences
    }
  }
  // Handle plain JavaScript serialized objects {seconds, nanoseconds}
  if (typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1000000));
  }
  // Handle ISO Strings, formatted dates, or numbers
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Clear any existing session/local storage for temporary preferences to prevent restoration
  useEffect(() => {
    safeStorage.session.removeItem('dbd_temporary_preferences');
    safeStorage.removeItem('dbd_dietary_preferences');
  }, []);

  const isAuthInProgress = useRef(false);

  const [diagnosticLogs, setDiagnosticLogs] = useState<{ id: string; message: string }[]>([]);
  const logCounterRef = useRef(0);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    logCounterRef.current += 1;
    const id = `${Date.now()}-${logCounterRef.current}-${Math.random().toString(36).substring(2, 9)}`;
    setDiagnosticLogs(prev => [...prev.slice(-100), { id, message: `${time}: ${msg}` }]);
    console.log(`[Diagnostic] ${msg}`);
  };

  const clearLogs = () => {
    setDiagnosticLogs([]);
    console.log('[Diagnostic] Logs cleared');
  };

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [dbShoppingList, setDbShoppingList] = useState<ShoppingListItem[]>([]);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [persistentPantryItems, setPersistentPantryItems] = useState<string[]>(() => {
    const stored = safeStorage.getItem('persistentPantryItems');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("[AuthContext] Failed to parse persistentPantryItems:", e);
      return [];
    }
  });

  const addPersistentPantryItem = async (key: string) => {
    setPersistentPantryItems(prev => {
      const updated = Array.from(new Set([...prev, key]));
      safeStorage.setItem('persistentPantryItems', JSON.stringify(updated));
      return updated;
    });
  };

  const removePersistentPantryItem = async (key: string) => {
    setPersistentPantryItems(prev => {
      const updated = prev.filter(k => k !== key);
      safeStorage.setItem('persistentPantryItems', JSON.stringify(updated));
      return updated;
    });
  };
  const [authError, setAuthError] = useState<string | null>(null);
  const setAuthErrorLogged = (msg: string | null) => {
    setAuthError(msg);
    if (msg) addLog(`AUTH_ERROR_SET: ${msg}`);
  };

  const [accessStatus, setAccessStatus] = useState<'trial' | 'read_only' | 'paid'>('trial');
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(7);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<string>(''); // New granular display
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Admin logic
  useEffect(() => {
    setIsAdmin(isOwnerEmail(user?.email));
  }, [user]);

  // Derived status calculation
  useEffect(() => {
    const calculateStatus = () => {
      if (isOwnerEmail(user?.email || profile?.email) || hasPermanentAccess(profile)) {
        setAccessStatus('paid');
        setTrialDaysLeft(0);
        setTrialTimeRemaining('');
        return;
      }

      if (!profile) {
        setAccessStatus('trial');
        setTrialDaysLeft(7);
        setTrialTimeRemaining('7 days');
        return;
      }

      // 1. Paid Status (Explicit or from Subscription)
      const isPastDue = profile.subscription?.subscriptionStatus === 'past_due';
      const graceEndsAt = profile.subscriptionPaymentGraceEndsAt
        ? parseToDate(profile.subscriptionPaymentGraceEndsAt)
        : null;
      const hasActiveGrace = !!graceEndsAt && graceEndsAt.getTime() > Date.now();
      const hasPaidFlag = profile.subscription?.accessStatus === 'paid' || profile.isPremium || profile.accessStatus === 'paid';

      if (hasPaidFlag && (!isPastDue || hasActiveGrace)) {
        setAccessStatus('paid');
        setTrialDaysLeft(0);
        setTrialTimeRemaining('');
        return;
      }

      // 2. Trial Status (from Subscription or initial account creation)
      let trialEndDate: Date;
      
      if (profile.subscription?.isTrialing && profile.subscription.trialEnd) {
        trialEndDate = parseToDate(profile.subscription.trialEnd);
      } else {
        const trialStart = parseToDate(profile.trialStartedAt || profile.createdAt);
        trialEndDate = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      const now = new Date();
      const diffMs = trialEndDate.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setAccessStatus('read_only');
        setTrialDaysLeft(0);
        setTrialTimeRemaining('Trial ended');
      } else {
        setAccessStatus('trial');
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        setTrialDaysLeft(Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        
        if (days >= 1) {
          setTrialTimeRemaining(`${days} day${days > 1 ? 's' : ''} left`);
        } else if (hours >= 1) {
          setTrialTimeRemaining(`${hours} hour${hours > 1 ? 's' : ''} left`);
        } else {
          setTrialTimeRemaining(`${mins} min${mins > 1 ? 's' : ''} left`);
        }
      }
    };

    calculateStatus();
    const timer = setInterval(calculateStatus, 10000); // Update every 10s for responsive UX
    return () => clearInterval(timer);
  }, [profile, user?.email]);

  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isAuthReadyProcessed = useRef(false);
  const [unitSystem, setUnitSystemInternal] = useState<'metric' | 'imperial'>(() => {
    return (safeStorage.getItem('dbd_unit_system') as 'metric' | 'imperial') || 'metric';
  });

  const setUnitSystem = (val: 'metric' | 'imperial') => {
    setUnitSystemInternal(val);
    safeStorage.setItem('dbd_unit_system', val);
  };

  const [location, setLocation] = useLocation();
  const [viewNavigationTick, setViewNavigationTick] = useState(0);

  const [highlight, setHighlightInternal] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('highlight');
    }
    return null;
  });

  const view = React.useMemo<AppView>(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const viewParam = params?.get('view') as AppView | null;

    if (viewParam && ['home', 'settings', 'planner', 'shopping', 'privacy', 'terms', 'admin', 'success', 'signin', 'landing'].includes(viewParam)) {
      return viewParam;
    }

    if (location === '/privacy') return 'privacy';
    if (location === '/terms') return 'terms';
    if (location === '/settings') return 'settings';
    if (location === '/planner') return 'planner';
    if (location === '/shopping') return 'shopping';
    if (location === '/success') return 'success';
    if (location === '/signin') return 'signin';
    if (location === '/admin') return 'admin';

    const hasStarted = safeStorage.getItem('dbd_has_started') === 'true';
    return hasStarted ? 'home' : 'landing';
  }, [location, viewNavigationTick]);

  const setView = (newView: AppView, newHighlight: string | null = null) => {
    if (newHighlight) setHighlightInternal(newHighlight);
    
    if (typeof window !== 'undefined') {
      const path = newView === 'home' ? '/?view=home' : newView === 'landing' ? '/?view=landing' : newView === 'success' ? '/success' : `/${newView}`;
      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (location !== path || currentPath !== path) {
        setLocation(path);
        setViewNavigationTick(tick => tick + 1);
      }
    }
  };

  const goToSignIn = () => {
    safeStorage.setItem('dbd_has_started', 'true');
    setHighlightInternal(null);
    setLocation('/signin?mode=signin');
  };

  const clearHighlight = () => setHighlightInternal(null);
  const planner = React.useMemo(() => savedRecipes.filter(r => !!r.scheduledDate), [savedRecipes]);

  const healingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthReady || !user || planner.length === 0 || accessStatus === 'read_only') return;
    
    // Auto-heal legacy thin recipes in the planner
    const thinRecipes = planner.filter(r => 
      r.id && 
      r.mode === 'cook' && 
      (!r.ingredients || r.ingredients.length === 0) &&
      !healingRef.current.has(r.id)
    );

    if (thinRecipes.length > 0) {
      addLog(`SYSTEM: Detected ${thinRecipes.length} thin recipes in planner. Healing...`);
      thinRecipes.forEach(async (recipe) => {
        const recipeId = recipe.id!;
        healingRef.current.add(recipeId);
        try {
          const enriched = await enrichRecipe(recipe.title, recipe.cuisine, 'cook');
          if (enriched && 'ingredients' in enriched && Array.isArray(enriched.ingredients) && enriched.ingredients.length > 0) {
            const cleanData = prepareSavedRecipeData({ ...recipe, ...enriched } as Recipe, user.uid, recipe.scheduledDate || null, {
              savedAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            await updateDoc(doc(db, 'users', user.uid, 'savedRecipes', recipeId), {
              ...cleanData,
              updatedAt: serverTimestamp()
            });
            addLog(`SYSTEM: Healed recipe: ${recipe.title}`);
          }
        } catch (err) {
          addLog(`SYSTEM ERROR: Healing failed for ${recipe.title}: ${err}`);
        }
      });
    }
  }, [planner, isAuthReady, user, accessStatus]);

  const shoppingList = React.useMemo(() => {
    if (!user) return [];
    
    const derived = buildShoppingListData({
      planner,
      pantry,
      existingItems: dbShoppingList,
      userId: user.uid,
      persistentPantryKeys: persistentPantryItems
    });
    
    return derived;
  }, [planner, pantry, dbShoppingList, user, persistentPantryItems]);

  useEffect(() => {
    if (!user || !isAuthReady || loading || accessStatus === 'read_only') return;
    
    const syncList = async () => {
      try {
        await syncShoppingListDocuments({
          firestoreDb: db,
          userId: user.uid,
          dbItems: dbShoppingList,
          derivedItems: shoppingList,
        });
      } catch (err) {
        console.error("Failed to sync shopping list:", err);
      }
    };

    const timer = setTimeout(syncList, 800); 
    return () => clearTimeout(timer);
  }, [planner, dbShoppingList, shoppingList, user, isAuthReady, loading, accessStatus]);

  useEffect(() => {
    if (isAuthReady) {
      addLog(`SYSTEM: Planner updated. ${planner.length} recipes scheduled.`);
    }
  }, [planner.length, isAuthReady]);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = (reason?.message || String(reason || "")).toLowerCase();
      
      // Filter out common persistent noise in the hosted studio environment
      if (
        msg.includes("websocket") || 
        msg.includes("hmr") || 
        msg.includes("failed to fetch") || 
        msg.includes("failed to connect") ||
        msg.includes("transport-base") ||
        msg.includes("script error")
      ) {
        return;
      }

      console.error('CRITICAL[UnhandledRejection]:', reason);
      let detail = reason instanceof Error ? reason.message : String(reason);
      addLog(`UNHANDLED_REJECTION_DIAGNOSTIC_V2: ${detail}`);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const { message, filename, lineno, colno, error } = event;

      // Noise reduction for "Script error." (cross-origin or extension noise)
      if (message === 'Script error.' || (message && message.includes('Script error'))) {
        event.preventDefault();
        return;
      }

      console.error('[Global Error Listener]', { message, source: filename, lineno, colno, error });
      addLog(`UNCAUGHT_RUNTIME_ERROR: ${message} at ${filename}:${lineno}:${colno}`);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    if (isAuthInProgress.current) {
      addLog("AUTH: Sign-In already in progress, skipping.");
      return false;
    }
    isAuthInProgress.current = true;
    setError(null);
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Use auth.currentUser directly to avoid stale closured state
    const currentFirebaseUser = auth.currentUser;
    const isAnonymous = currentFirebaseUser?.isAnonymous || false;
    
    try {
      addLog(`AUTH: Initiating Google Sign-In. User: ${currentFirebaseUser?.uid}, Anon: ${isAnonymous}`);
      
      if (currentFirebaseUser && isAnonymous) {
        addLog("AUTH: Attempting to link anonymous account...");
        try {
          const result = await linkWithPopup(currentFirebaseUser, provider);
          setUser(result.user);
          addLog("AUTH: linkWithPopup SUCCESS.");
          showToast("Account linked successfully!");
          return true;
        } catch (linkErr: any) {
          const errorCode = linkErr.code || "";
          const errorMessage = linkErr.message || "";
          addLog(`AUTH ERROR: linkWithPopup failed code: ${errorCode}, msg: ${errorMessage}`);
          
          const isExisting = 
            errorCode === 'auth/credential-already-in-use' || 
            errorCode === 'auth/email-already-in-use' ||
            errorCode === 'auth/account-exists-with-different-credential' ||
            /already-in-use|already-registered|exists-with-different|already-exists/i.test(errorCode || errorMessage);

          if (isExisting) {
            addLog("AUTH: Account linkage conflict detected. Attempting direct sign-in with credential...");
            const credential = GoogleAuthProvider.credentialFromError(linkErr);
            if (credential) {
              try {
                const result = await signInWithCredential(auth, credential);
                setUser(result.user);
                addLog(`AUTH: Automatic credential sign-in SUCCESS: ${result.user.email}`);
                showToast("Signed in to your existing account.");
                return true;
              } catch (credErr: any) {
                addLog(`AUTH ERROR: Automatic credential sign-in failed code: ${credErr.code}`);
              }
            }

            // Fallback: If credential sign-in fails or is not available, try standard sign-in automatically
            addLog("AUTH: Falling back to automatic popup login...");
            try {
              const result = await signInWithPopup(auth, provider);
              setUser(result.user);
              addLog(`AUTH: Automatic popup switch SUCCESS: ${result.user.email}`);
              showToast("Signed in to your existing account.");
              return true;
            } catch (switchErr: any) {
              addLog(`AUTH ERROR: Automatic popup switch failed code: ${switchErr.code}`);
              setError(`Failed to sign in to existing account: ${switchErr.message}`);
              return false;
            }
          }
          
          if (errorCode === 'auth/popup-blocked') {
            showToast("Popup blocked. Redirecting to Google sign-in...");
            await linkWithRedirect(currentFirebaseUser, provider);
            return false;
          } else if (errorCode === 'auth/cancelled-popup-request' || errorCode === 'auth/popup-closed-by-user') {
            addLog("AUTH: Link popup closed by user.");
            return false;
          } else {
            throw linkErr; // Let the main catch handle it
          }
        }
      } else {
        addLog("AUTH: Standard sign-in...");
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        addLog(`AUTH: Standard SUCCESS: ${result.user.email}`);
        showToast("Signed in successfully!");
        return true;
      }
    } catch (err: any) {
      const errorCode = err.code || "";
      const errorMessage = err.message || "";

      if (errorCode === 'auth/popup-blocked') {
        showToast("Popup blocked. Redirecting to Google sign-in...");
        await signInWithRedirect(auth, provider);
        return false;
      } else if (errorCode === 'auth/cancelled-popup-request' || errorCode === 'auth/popup-closed-by-user') {
        addLog("AUTH: Popup closed by user.");
        return false;
      } else {
        console.error("Google Sign-In failed:", err);
        addLog(`AUTH ERROR: External Catch - Code: ${errorCode}, Msg: ${errorMessage}`);
        
        const isExisting = 
          errorCode === 'auth/credential-already-in-use' || 
          errorCode === 'auth/email-already-in-use' ||
          errorCode === 'auth/account-exists-with-different-credential' ||
          /already-in-use|already-registered|exists-with-different|already-exists/i.test(errorCode || errorMessage);

        if (isExisting) {
          showToast("This Google account is already registered. Please sign in directly.", "Sign In", () => {
            // Re-trigger without linkage attempt
            addLog("AUTH: Retrying sign-in without linkage...");
            signInWithGoogle();
          });
          return false;
        }

        if (errorCode === 'auth/unauthorized-domain') {
          setError(`Domain not authorized. Please add ${window.location.hostname} to Authorized Domains in Firebase Console.`);
        } else {
          setError(`Authentication failed: ${errorMessage}`);
        }
        return false;
      }
    } finally {
      isAuthInProgress.current = false;
    }
  };

  // Handle Firebase Auth
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Safety timeout to ensure isAuthReady is ALWAYS true after 10s
    timeoutId = setTimeout(() => {
      if (!isAuthReadyProcessed.current) {
        addLog("AUTH: Initialisation safety timeout reached");
        setIsAuthReady(true);
        setLoading(false);
        isAuthReadyProcessed.current = true;
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Safety: detect if this is a repeat event for the same user ID to avoid duplicate init logic
      if (isAuthReadyProcessed.current && firebaseUser?.uid === user?.uid && firebaseUser) {
        return;
      }

      addLog(`AUTH_STATE_CHANGE: ${firebaseUser ? 'IN' : 'OUT'}`);
      
      if (firebaseUser) {
        // Ensure state reflects the new user immediately
        setUser(firebaseUser);
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          addLog(`AUTH: Checking for profile ${firebaseUser.uid}...`);
          // Using standard getDoc (with cache support) for maximum reliability in varying network conditions
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            addLog(`AUTH: Profile found for ${firebaseUser.uid}`);
            const profileData = userDoc.data() as UserProfile;
            
            // Preferences are stored in a subcollection document to match the blueprint/rules
            try {
              addLog('AUTH: Loading preferences...');
              const prefsDoc = await getDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'preferences'));
              if (prefsDoc.exists()) {
                addLog('AUTH: Preferences found.');
                profileData.preferences = normaliseUserPreferences(prefsDoc.data() as UserPreferences);
              } else {
                addLog('AUTH: No preferences found, using defaults.');
                profileData.preferences = normaliseUserPreferences(null);
              }
            } catch (pErr: any) {
              addLog(`AUTH_PREFS_LOAD_FAIL: ${pErr?.message || pErr}`);
              profileData.preferences = normaliseUserPreferences(null);
            }
            
            setProfile(profileData);

            // Re-trigger welcome email if it was missed in a previous attempt (e.g. API down)
            if (!profileData.welcomeEmailSent && firebaseUser.email) {
              triggerWelcomeEmail(firebaseUser.email, profileData.displayName);
            }

            if (firebaseUser.email) {
              triggerTrialEndingReminderEmail(firebaseUser.uid, firebaseUser.email, profileData);
            }
          } else {
            addLog(`AUTH: No profile exists for ${firebaseUser.uid}. Creating...`);
            const initialPrefs = normaliseUserPreferences(null);
            const displayName = firebaseUser.displayName || firebaseUser.email || 'User';
            let firstName = "";
            let lastName = "";
            if (firebaseUser.displayName) {
              const names = firebaseUser.displayName.split(/\s+/);
              if (names.length > 0) firstName = names[0];
              if (names.length > 1) lastName = names.slice(1).join(' ');
            } else if (firebaseUser.email) {
              firstName = firebaseUser.email.split('@')[0];
            } else {
              firstName = "User";
            }

            const initialProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: displayName,
              firstName: firstName,
              lastName: lastName,
              phoneNumber: '',
              preferences: initialPrefs,
              isPremium: isOwnerEmail(firebaseUser.email),
              accessStatus: isOwnerEmail(firebaseUser.email) ? 'paid' : 'trial',
              trialStartedAt: serverTimestamp(),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              searchOnboardingDismissed: false,
              welcomeEmailSent: false
            };
            
            await setDoc(userDocRef, initialProfile);
            addLog('AUTH: User document created successfully.');
            
            // Also initialize the preferences subcollection doc for consistency
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'preferences'), {
                ...initialPrefs,
                updatedAt: serverTimestamp()
              });
              addLog('AUTH: Preferences subcollection created.');
            } catch (pErr: any) {
              addLog(`AUTH_PREFS_INIT_FAIL: ${pErr?.message || pErr}`);
            }
            
            setProfile(initialProfile);

            // Send first-time user thank you / welcome email gracefully
            if (firebaseUser.email) {
              triggerWelcomeEmail(firebaseUser.email, initialProfile.displayName);
            }
          }
        } catch (err: any) {
          addLog(`AUTH_PROFILE_LOAD_FAIL: ${err?.message || err}`);
          console.error("Profile load error:", err);
          try {
            handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          } catch (jsonErr: any) {
            setAuthErrorLogged(jsonErr.message);
          }
        } finally {
          setLoading(false);
          setIsAuthReady(true);
          isAuthReadyProcessed.current = true;
          cleanup();
        }
      } else {
        addLog("AUTH: No user detected. Cleaning up state.");
        setUser(null);
        setProfile(null);
        setSavedRecipes([]);
        setDbShoppingList([]);
        setPantry([]);
        setLoading(false);
        setIsAuthReady(true);
        isAuthReadyProcessed.current = true;
        cleanup();
      }
    });

    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  const [error, setErrorState] = useState<string | null>(null);
  const setError = (msg: string | null) => {
    setErrorState(msg);
    if (msg) addLog(`UI_ERROR_SET: ${msg}`);
  };
  const [needsDietConfirmation, setNeedsDietConfirmation] = useState(false);

  const clearError = () => setError(null);

  const [toast, setToast] = useState<{ 
    message: string; 
    actionLabel?: string; 
    onAction?: () => void;
    id: number;
  } | null>(null);

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now();
    setToast({ message, actionLabel, onAction, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 5000);
  };

  // Handle Stripe Success/Cancel on redirect
  useEffect(() => {
    if (!user || !isAuthReady) return;
    
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');
    
    if (payment === 'success' || (sessionId && window.location.pathname.startsWith('/success'))) {
      showToast("Thanks! Your subscription is being confirmed.");
      // Only clean up URL if it's payment=success, otherwise let SuccessView do it.
      // Paid access is granted by the verified Stripe webhook, not by the browser.
      if (payment === 'success') {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else if (payment === 'cancel') {
      showToast("Payment cancelled. You can try again anytime.");
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, isAuthReady]);

  useEffect(() => {
    if (!user) return;

    const unsubRecipes = onSnapshot(
      query(collection(db, 'users', user.uid, 'savedRecipes'), orderBy('savedAt', 'desc')),
      (snapshot) => {
        const recipes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SavedRecipe));
        setSavedRecipes(recipes);
      },
      (err) => {
        if (!auth.currentUser) return; // Silent during logout/transition
        try {
          handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/savedRecipes`);
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
      }
    );

    const unsubShopping = onSnapshot(
      collection(db, 'users', user.uid, 'shoppingList'),
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShoppingListItem));
        setDbShoppingList(items);
      },
      (err) => {
        if (!auth.currentUser) return;
        try {
          handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/shoppingList`);
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
      }
    );

    const unsubPantry = onSnapshot(
      collection(db, 'users', user.uid, 'pantry'),
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PantryItem));
        setPantry(items);
      },
      (err) => {
        if (!auth.currentUser) return;
        try {
          handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/pantry`);
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
      }
    );

    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          const profileData = snapshot.data() as UserProfile;
          setProfile(prev => {
            if (!prev || prev.uid !== user.uid) {
              return { 
                ...profileData, 
                preferences: profileData.preferences || normaliseUserPreferences(null) 
              };
            }
            return { 
              ...prev, 
              ...profileData,
              preferences: prev.preferences || profileData.preferences || normaliseUserPreferences(null)
            };
          });
        }
      },
      (err) => {
        if (!auth.currentUser) return;
        try {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
      }
    );

    const unsubPrefs = onSnapshot(
      doc(db, 'users', user.uid, 'profile', 'preferences'),
      (snapshot) => {
        if (snapshot.exists()) {
          const prefsData = normaliseUserPreferences(snapshot.data());
          setProfile(prev => {
            if (!prev || prev.uid !== user.uid) {
              return {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || user.email || 'User',
                preferences: prefsData,
                isPremium: false,
                accessStatus: 'trial',
                createdAt: null,
                updatedAt: null
              } as any; // Cast safely as fallback UserProfile structure
            }
            return { ...prev, preferences: prefsData };
          });
          setNeedsDietConfirmation(checkNeedsDietConfirmation(snapshot.data()));
        }
      },
      (err) => {
        if (!auth.currentUser) return;
        try {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}/profile/preferences`);
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
      }
    );

    return () => {
      unsubRecipes();
      unsubShopping();
      unsubPantry();
      unsubProfile();
      unsubPrefs();
    };
  }, [user]);

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    if (!profile || !user) return;
    setError(null);
    const updatedPrefs = { ...profile.preferences, [key]: value };
    // Optimistic update
    setProfile(prev => prev ? { ...prev, preferences: updatedPrefs } : null);
    try {
      await savePreferences(updatedPrefs);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/profile/preferences`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    if (!user) return;
    setError(null);
    setProfile(prev => prev ? { ...prev, preferences: newPreferences } : null);

    try {
      const docRef = doc(db, `users/${user.uid}/profile/preferences`);
      const allowedFields = [
        'dietaryRule', 'saladPreference', 'allergies', 'nutritiousChoice',
        'isSimple', 'isLowCost', 'highOmega3', 'highProtein', 'servings', 'calorieCeiling', 'budgetLimit',
        'exclusions', 'cuisinePreferences', 'religiousEthical',
        'cookingMethods', 'cookingFats', 'readyToEatUnderMins', 'preferredMode',
        'customCuisines', 'preferredSupermarkets', 'preferredSourceIds'
      ];
      const updatedPrefs: any = {};
      allowedFields.forEach(k => {
        if ((newPreferences as any)[k] !== undefined) updatedPrefs[k] = (newPreferences as any)[k];
      });
      updatedPrefs.updatedAt = serverTimestamp();
      await setDoc(docRef, updatedPrefs, { merge: true });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/profile/preferences`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    setError(null);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    try {
      await setDoc(doc(db, 'users', user.uid), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const updatePlanner = async (scheduledDate: string, recipe: SavedRecipe | Recipe | ReadyMeal) => {
    if (!user) return;
    setError(null);
    try {
      return await updatePlannerRecipe({
        firestoreDb: db,
        userId: user.uid,
        savedRecipes,
        scheduledDate,
        recipe,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRecipes`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const saveRecipe = async (item: Recipe | ReadyMeal) => {
    if (!user) return;
    try {
      return await saveRecipeDocument({
        firestoreDb: db,
        userId: user.uid,
        savedRecipes,
        item,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRecipes`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const updateRecipe = async (id: string, updates: Partial<SavedRecipe>) => {
    if (!user) return;
    try {
      await updateRecipeDocument({
        firestoreDb: db,
        userId: user.uid,
        recipeId: id,
        updates,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRecipes/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const removeRecipe = async (id: string) => {
    if (!user) return;
    try {
      await removeRecipeDocument({
        firestoreDb: db,
        userId: user.uid,
        recipeId: id,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/savedRecipes/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const unscheduleRecipe = async (id: string) => {
    if (!user || !id || id === 'unknown') return;
    try {
      await unschedulePlannerRecipe({
        firestoreDb: db,
        userId: user.uid,
        recipeId: id,
      });
    } catch (err: any) {
      if (isMissingPlannerRecipeError(err)) {
        console.warn(`[unscheduleRecipe] Document ${id} not found or already unscheduled.`);
        return;
      }
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRecipes/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const clearPlannerDay = async (date: string) => {
    if (!user) return;
    const entry = getScheduledRecipeForDay(savedRecipes, date);
    if (entry?.id) await unscheduleRecipe(entry.id);
  };

  const clearPlannerWeek = async () => {
    if (!user) return;
    try {
      await clearPlannerWeekRecipes({
        firestoreDb: db,
        userId: user.uid,
        planner,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/savedRecipes`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const removeAllSavedRecipes = async () => {
    if (!user) return;
    try {
      const removedCount = await removeAllUnscheduledSavedRecipes({
        firestoreDb: db,
        userId: user.uid,
        savedRecipes,
      });
      addLog(`AUTH: Removed all unscheduled recipes (${removedCount})`);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/savedRecipes`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const generateShoppingList = async () => {
    if (!user) return;
    try {
      await clearDerivedShoppingListDocuments({
        firestoreDb: db,
        userId: user.uid,
        dbItems: dbShoppingList,
      });
      showToast("List synced successfully");
    } catch (err) {
      setError("Failed to sync shopping list");
    }
  };

  const toggleShoppingItem = async (id: string, checked: boolean) => {
    if (!user) return;
    try {
      await updateShoppingItemDocument({
        firestoreDb: db,
        userId: user.uid,
        itemId: id,
        updates: { checked },
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/shoppingList/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const updateShoppingItem = async (id: string, updates: Partial<ShoppingListItem>) => {
    if (!user) return;
    try {
      await updateShoppingItemDocument({
        firestoreDb: db,
        userId: user.uid,
        itemId: id,
        updates,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/shoppingList/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const addCustomShoppingItem = async (name: string, category: string = 'Other') => {
    if (!user) return;
    try {
      await addCustomShoppingItemDocument({
        firestoreDb: db,
        userId: user.uid,
        name,
        category,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/shoppingList`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const removeShoppingItem = async (id: string) => {
    if (!user) return;
    try {
      await removeShoppingItemDocument({
        firestoreDb: db,
        userId: user.uid,
        itemId: id,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/shoppingList/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const addToPantry = async (name: string, category: string = 'Other', isStaple: boolean = false) => {
    if (!user) return;
    try {
      await addPantryItemDocument({
        firestoreDb: db,
        userId: user.uid,
        name,
        category,
        isStaple,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/pantry`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const removeFromPantry = async (id: string) => {
    if (!user) return;
    try {
      await removePantryItemDocument({
        firestoreDb: db,
        userId: user.uid,
        pantryItemId: id,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/pantry/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const togglePantryStaple = async (id: string, isStaple: boolean) => {
    if (!user) return;
    try {
      await updatePantryStapleDocument({
        firestoreDb: db,
        userId: user.uid,
        pantryItemId: id,
        isStaple,
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/pantry/${id}`);
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
    }
  };

  const handlePrintRecipe = (recipe: SavedRecipe | Recipe | ReadyMeal) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Type safer access for optional fields
    const ingredients = 'ingredients' in recipe ? recipe.ingredients : [];
    const instructions = 'instructions' in recipe ? recipe.instructions : [];
    const description = 'description' in recipe ? recipe.description : '';

    const content = `
      <html>
        <head><title>Print Recipe: ${recipe.title}</title></head>
        <body>
          <h1>${recipe.title}</h1>
          <p>${description || ''}</p>
          <h3>Ingredients:</h3>
          <ul>${ingredients?.map(ing => `<li>${ing}</li>`).join('') || '<li>Check retailer for pack ingredients.</li>'}</ul>
          <h3>Instructions:</h3>
          <ol>${instructions?.map(step => `<li>${step}</li>`).join('') || '<li>Follow heating instructions on packaging.</li>'}</ol>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProfile(null);
      setAuthError(null);
      safeStorage.removeItem('dbd_has_started'); // Clear the start flag
      safeStorage.removeItem('dbd_temporary_preferences');
      safeStorage.removeItem('dbd_dietary_preferences');
      setView('landing'); // Redirect to landing
      showToast("Signed out");
      addLog("AUTH: Signed out.");
    } catch (err: any) {
      setError("Failed to sign out");
    }
  };

  const sentEmails = useRef<Set<string>>(new Set());
  const sentTrialReminderEmails = useRef<Set<string>>(new Set());

  const triggerWelcomeEmail = (email: string, displayName?: string) => {
    if (!email || sentEmails.current.has(email)) return;
    
    sentEmails.current.add(email);
    addLog(`AUTH: Triggering welcome email task for ${email}...`);
    
    setTimeout(async () => {
      try {
        const currentUser = auth.currentUser;
        const nameToUse = displayName || currentUser?.displayName || email.split('@')[0] || 'User';
        let firstName = "there";
        if (nameToUse && nameToUse.trim()) {
          const parts = nameToUse.trim().split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            firstName = parts[0];
          }
        }

        const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <p>Hi ${firstName},</p>
  <p>DinnerByDesign helps you decide what to cook, search recipes you can actually make, and build a shopping list as you go — around your diet, budget and the time you have.</p>
  
  <p>Get started in under a minute:</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <span style="font-size: 15px; font-weight: bold; color: #111;">1. Set your preferences</span><br>
        <span style="color: #555; font-size: 13.5px;">On the search page, tap Preferences beside the search box to set dietary needs, portions, budget, calorie targets and any ingredients to exclude.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <span style="font-size: 15px; font-weight: bold; color: #111;">2. Find and schedule recipes</span><br>
        <span style="color: #555; font-size: 13.5px;">Search by ingredients you have in, filter to your constraints, and tap Schedule to add a recipe to your planner.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 0;">
        <span style="font-size: 15px; font-weight: bold; color: #111;">3. Build your shopping list</span><br>
        <span style="color: #555; font-size: 13.5px;">Your list updates automatically, scaled to your portions — tick off what you already have and it adjusts.</span>
      </td>
    </tr>
  </table>

  <div style="margin: 32px 0; text-align: center;">
    <a href="${window.location.origin}/?view=home&from=email" style="background-color: #111; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 14px;">Find your first recipe →</a>
  </div>

  <p>Questions or feedback? Reply to this email — we read and answer every one.</p>
  <p style="margin-top: 24px; font-weight: 500; margin-bottom: 2px;">The DinnerByDesign team</p>
  <p style="margin: 0; font-size: 13px; color: #666;"><a href="mailto:chef@dinnerbydesign.app" style="color: #666; text-decoration: underline;">chef@dinnerbydesign.app</a></p>
</div>
        `.trim();

        fetch(getApiUrl("/api/send-email"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: email,
            subject: "Welcome to DinnerByDesign",
            html: emailHtml,
            from: "DinnerByDesign <chef@dinnerbydesign.app>",
            type: "welcome",
            source: "auth_context",
            userId: currentUser?.uid || null
          })
        })
          .then(r => r.json())
          .then(async resp => {
            if (resp?.ok) {
              addLog(`AUTH: Welcome email successfully sent to ${email}`);
              const uid = currentUser?.uid;
              if (uid) {
                try {
                  await updateDoc(doc(db, 'users', uid), { welcomeEmailSent: true });
                } catch (e) {}
              }
            } else {
              addLog(`AUTH WARNING: Welcome email api returned structure with error or false: ${JSON.stringify(resp)}`);
            }
          })
          .catch(fetchErr => {
            addLog(`AUTH ERROR: Async fetch to send welcome email failed: ${fetchErr}`);
          });
      } catch (emailTaskErr) {
        addLog(`AUTH ERROR: Catch inside welcome email timeout block: ${emailTaskErr}`);
      }
    }, 1500);
  };

  const triggerTrialEndingReminderEmail = (uid: string, email: string, profileData: UserProfile) => {
    if (!uid || !email || profileData.trialEndingReminderEmailSent || sentTrialReminderEmails.current.has(uid)) return;

    if (profileData.subscription?.accessStatus === 'paid' || profileData.isPremium || profileData.accessStatus === 'paid') {
      return;
    }

    const trialEndDate = profileData.subscription?.isTrialing && profileData.subscription.trialEnd
      ? parseToDate(profileData.subscription.trialEnd)
      : new Date(parseToDate(profileData.trialStartedAt || profileData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);

    const msRemaining = trialEndDate.getTime() - Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (msRemaining <= 0 || msRemaining > oneDayMs) return;

    sentTrialReminderEmails.current.add(uid);
    addLog(`AUTH: Triggering trial ending reminder email task for ${email}...`);

    const nameToUse = profileData.displayName || email.split('@')[0] || 'User';
    const firstName = nameToUse.trim().split(/\s+/)[0]?.includes('@')
      ? nameToUse.trim().split(/\s+/)[0].split('@')[0]
      : nameToUse.trim().split(/\s+/)[0] || 'there';
    const formattedEnd = trialEndDate.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dinnerbydesign.app';

    setTimeout(async () => {
      const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <div style="border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px;">
    <h2 style="color: #111; margin: 0; font-size: 20px;">DinnerByDesign</h2>
  </div>

  <p>Hi ${firstName},</p>

  <p>Your DinnerByDesign free trial ends on <strong>${formattedEnd}</strong>.</p>

  <p>Subscribe from Account Settings to keep:</p>

  <ul style="margin: 0 0 22px; padding-left: 20px;">
    <li>Recipe search</li>
    <li>Saved recipes</li>
    <li>Scheduling tools</li>
    <li>Shopping lists</li>
    <li>Personalised settings</li>
  </ul>

  <div style="margin: 28px 0;">
    <a href="${currentAppUrl}/?view=settings" style="background-color: #111; color: #fff; padding: 13px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Open Account Settings</a>
  </div>

  <p style="font-size: 14px; color: #666;">No action needed if you don't want to continue.</p>
</div>
      `.trim();

      try {
        const response = await fetch(getApiUrl("/api/send-email"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: `Your free trial ends ${formattedEnd}`,
            html: emailHtml,
            from: "DinnerByDesign <chef@dinnerbydesign.app>",
            type: "trial_ending",
            source: "auth_context",
            userId: uid
          })
        });

        const resp = await response.json().catch(() => null);
        if (resp?.ok) {
          await updateDoc(doc(db, 'users', uid), {
            trialEndingReminderEmailSent: true,
            trialEndingReminderEmailSentAt: serverTimestamp()
          });
          addLog(`AUTH: Trial ending reminder email successfully sent to ${email}`);
        } else {
          sentTrialReminderEmails.current.delete(uid);
          addLog(`AUTH WARNING: Trial ending reminder email API returned error: ${JSON.stringify(resp)}`);
        }
      } catch (emailErr) {
        sentTrialReminderEmails.current.delete(uid);
        addLog(`AUTH ERROR: Trial ending reminder email failed: ${emailErr}`);
      }
    }, 1000);
  };

  const triggerPasswordChangedEmail = (email: string, displayName?: string) => {
    if (!email) {
      addLog("AUTH WARNING: Cannot trigger password changed email because email is missing.");
      return;
    }
    
    addLog(`AUTH: Triggering password changed notification email task for ${email}...`);
    
    // Gather context info immediately to avoid stale state or navigator access issues later
    const userAgentStr = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
    const currentDisplayName = displayName || auth.currentUser?.displayName || email.split('@')[0] || 'User';
    const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dinnerbydesign.app';

    setTimeout(async () => {
      try {
        let firstName = "there";
        const nameToUse = currentDisplayName.trim();
        if (nameToUse) {
          const parts = nameToUse.split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            firstName = parts[0].includes('@') ? parts[0].split('@')[0] : parts[0];
          }
        }

        const formattedDate = new Date().toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });

        let browserName = "Unknown Browser";
        let osName = "Unknown OS";
        if (userAgentStr.includes("Chrome")) browserName = "Chrome";
        else if (userAgentStr.includes("Safari") && !userAgentStr.includes("Chrome")) browserName = "Safari";
        else if (userAgentStr.includes("Firefox")) browserName = "Firefox";
        else if (userAgentStr.includes("Edge")) browserName = "Edge";
        
        if (userAgentStr.includes("Windows")) osName = "Windows";
        else if (userAgentStr.includes("Mac")) osName = "macOS";
        else if (userAgentStr.includes("Linux")) osName = "Linux";
        else if (userAgentStr.includes("Android")) osName = "Android";
        else if (userAgentStr.includes("iPhone") || userAgentStr.includes("iPad")) osName = "iOS";

        const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <div style="border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px;">
    <h2 style="color: #111; margin: 0; font-size: 20px;">🔒 DinnerByDesign Security Alert</h2>
  </div>
  
  <p>Hi ${firstName},</p>
  
  <p>This email confirms your DinnerByDesign password was recently changed.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f7fafc; border-radius: 6px; border: 1px solid #edf2f7;">
    <tr>
      <td style="padding: 12px 16px; font-size: 13.5px; color: #4a5568; font-weight: 600; width: 120px;">Date & Time:</td>
      <td style="padding: 12px 16px; font-size: 13.5px; color: #1a202c;">${formattedDate}</td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; font-size: 13.5px; color: #4a5568; font-weight: 600; border-top: 1px solid #edf2f7;">Device/OS:</td>
      <td style="padding: 12px 16px; font-size: 13.5px; color: #1a202c; border-top: 1px solid #edf2f7;">${osName} (${browserName})</td>
    </tr>
  </table>

  <p style="margin: 24px 0;">If you made this change yourself, you're all set — no further action is needed.</p>

  <div style="border-top: 1px solid #f0f0f0; padding-top: 24px; margin-top: 24px;">
    <h4 style="margin: 0 0 12px 0; color: #111; font-size: 16px; font-weight: bold;">Didn't make this change?</h4>
    <p style="margin: 0 0 20px 0; color: #444; font-size: 14px;">
      If this wasn't you, your account may be at risk. Please click below to go to your account settings and update your password immediately.
    </p>
    
    <div style="margin: 24px 0;">
      <a href="${currentAppUrl}/?view=settings&highlight=password-management" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 14px;">Secure My Account →</a>
    </div>

    <p style="margin: 20px 0 0 0; color: #666; font-size: 13.5px;">
      If you have any questions, email us at <a href="mailto:chef@dinnerbydesign.app" style="color: #111; text-decoration: underline; font-weight: 500;">chef@dinnerbydesign.app</a> and we'll get back to you as soon as we can.
    </p>
  </div>

  <p style="margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 20px; color: #444;">— The DinnerByDesign Team</p>
</div>
        `.trim();

        const apiUrl = getApiUrl("/api/send-email");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Your DinnerByDesign password has been updated",
            html: emailHtml,
            from: "DinnerByDesign Security <security@dinnerbydesign.app>",
            type: "password_changed",
            source: "auth_context",
            userId: auth.currentUser?.uid || null
          })
        });

        const resp = await response.json();
        if (resp?.ok) {
          addLog(`AUTH: Password change notification successfully sent to ${email}`);
        } else {
          addLog(`AUTH WARNING: Password change email API returned error: ${JSON.stringify(resp?.error || resp)}`);
        }
      } catch (err: any) {
        addLog(`AUTH ERROR: Password change notification task failed: ${err.message || err}`);
        console.error("Password changed notification failed:", err);
      }
    }, 800);
  };


  const signUpWithEmail = async (email: string, pass: string, firstName: string, lastName: string, phone: string) => {
    if (isAuthInProgress.current) return;
    isAuthInProgress.current = true;
    try {
      addLog(`AUTH: Signing up ${email}...`);
      const fullname = `${firstName} ${lastName}`.trim();
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      
      // Update Auth Profile for simple greeting display names
      await updateAuthProfile(credential.user, { displayName: fullname });
      
      // Explicitly create the user profile document to ensure lastName and phone are saved immediately
      const userDocRef = doc(db, 'users', credential.user.uid);
      const initialPrefs = normaliseUserPreferences(null);
      const initialProfile: UserProfile = {
        uid: credential.user.uid,
        email: email,
        displayName: fullname,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        preferences: initialPrefs,
        isPremium: isOwnerEmail(email),
        accessStatus: isOwnerEmail(email) ? 'paid' : 'trial',
        trialStartedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        searchOnboardingDismissed: false,
        welcomeEmailSent: false
      };
      
      await setDoc(userDocRef, initialProfile);
      
      // Trigger welcome email
      triggerWelcomeEmail(email, fullname);
      
      // Also initialize preferences subcollection
      await setDoc(doc(db, 'users', credential.user.uid, 'profile', 'preferences'), {
        ...initialPrefs,
        updatedAt: serverTimestamp()
      });

      setUser(credential.user);
      setProfile(initialProfile);
      
      showToast("Account created successfully!");
      addLog(`AUTH: Sign-up success for ${email}`);
    } catch (err: any) {
      addLog(`AUTH ERROR: Sign-up failed: ${err.message}`);
      throw err;
    } finally {
      isAuthInProgress.current = false;
    }
  };

  const addToSearchHistory = async (q: string, mode: DinnerSource) => {
    if (!user || !profile || !q.trim() || q.trim().length < 3) return;
    
    try {
      // Determine which field to use
      const historyKey = mode === 'cook' ? 'searchHistoryCook' : 'searchHistoryReadyMade';
      const history = [...((profile as any)[historyKey] || [])];
      const cleanQuery = q.trim();
      
      // Remove if already exists to move to top
      const index = history.findIndex(h => h.toLowerCase() === cleanQuery.toLowerCase());
      if (index > -1) {
        history.splice(index, 1);
      }
      
      // Add to top
      history.unshift(cleanQuery);
      
      // Keep max 10
      const finalHistory = history.slice(0, 10);
      
      // Special case: 'searchHistory' (legacy/shared) is updated for 'cook' mode for compatibility
      const legacyHistory = [...(profile.searchHistory || [])];
      if (mode === 'cook') {
        const lIndex = legacyHistory.findIndex(h => h.toLowerCase() === cleanQuery.toLowerCase());
        if (lIndex > -1) legacyHistory.splice(lIndex, 1);
        legacyHistory.unshift(cleanQuery);
      }
      
      await updateProfile({ 
        [historyKey]: finalHistory,
        ...(mode === 'cook' ? { searchHistory: legacyHistory.slice(0, 10) } : {})
      });
    } catch (err) {
      console.warn("Failed to add to search history silently:", err);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isAuthInProgress.current) return;
    isAuthInProgress.current = true;
    try {
      addLog(`AUTH: Signing in ${email}...`);
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(credential.user);
      showToast("Signed in!");
      addLog(`AUTH: Sign-in success for ${email}`);
    } catch (err: any) {
      addLog(`AUTH ERROR: Sign-in failed: ${err.message}`);
      throw err;
    } finally {
      isAuthInProgress.current = false;
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (isAuthInProgress.current) return;
    isAuthInProgress.current = true;
    try {
      addLog(`AUTH: Sending password reset to ${email}...`);
      
      // Use window.location.origin as the redirect URL
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      // We attempt to add a success parameter to the redirect URL to help detect return
      // The user requested that this leads to the search page (home view)
      const successRedirectUrl = origin ? (origin.includes('?') ? `${origin}&reset_success=true&view=home` : `${origin}/?reset_success=true&view=home`) : origin;
      
      const actionCodeSettings = successRedirectUrl ? {
        url: successRedirectUrl,
        handleCodeInApp: false,
      } : undefined;
      
      try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        showToast("Password reset email sent!");
        addLog(`AUTH: Password reset success for ${email} with actionCodeSettings`);
      } catch (innerErr: any) {
        addLog(`AUTH WARNING: Password reset with actionCodeSettings failed: ${innerErr.message || innerErr}`);
        addLog(`AUTH: Attempting fallback password reset (no continue URL/origin)...`);
        try {
          await sendPasswordResetEmail(auth, email);
          showToast("Password reset email sent!");
          addLog(`AUTH: Password reset fallback success for ${email}`);
        } catch (fallbackErr: any) {
          addLog(`AUTH ERROR: Password reset fallback failed: ${fallbackErr.message || fallbackErr}`);
          throw fallbackErr;
        }
      }
    } catch (err: any) {
      addLog(`AUTH ERROR: Password reset failed: ${err.message}`);
      throw err;
    } finally {
      isAuthInProgress.current = false;
    }
  };

  const reauthenticateUser = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("No signed-in user found to re-authenticate.");
    }
    try {
      addLog(`AUTH: Re-authenticating user ${currentUser.email}...`);
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      addLog(`AUTH: Re-authentication successful!`);
    } catch (err: any) {
      addLog(`AUTH ERROR: Re-authentication failed: ${err.message}`);
      throw err;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("No signed-in user found to update password.");
    }

    try {
      addLog(`AUTH: Initiating password update for ${currentUser.email}...`);
      
      // Step 1: Re-authenticate first to ensure session is fresh (required by Firebase for sensitive ops)
      await reauthenticateUser(currentPassword);
      
      // Step 2: Perform the password update
      await updatePassword(currentUser, newPassword);
      
      showToast("Password updated successfully.");
      addLog(`AUTH: Password update success for ${currentUser.email}`);

      // Trigger security alert email
      triggerPasswordChangedEmail(currentUser.email, profile?.displayName);
    } catch (err: any) {
      addLog(`AUTH ERROR: Password update failed: ${err.message}`);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, profile, planner, loading, isAuthReady, diagnosticLogs, addLog, error,
      needsDietConfirmation, setNeedsDietConfirmation, updatePreference, updateProfile,
      updatePlanner, saveRecipe, removeRecipe, updateRecipe, unscheduleRecipe, clearPlannerDay,
      clearPlannerWeek, removeAllSavedRecipes, generateShoppingList, toggleShoppingItem, updateShoppingItem,
      addCustomShoppingItem, removeShoppingItem, addToPantry, removeFromPantry, togglePantryStaple,
      clearError, setError, authError, savedRecipes, shoppingList, pantry,
      persistentPantryItems, addPersistentPantryItem, removePersistentPantryItem,
      savePreferences, clearLogs,
      toast, showToast, setToast, handlePrintRecipe,  
      accessStatus, trialDaysLeft, trialTimeRemaining, isAdmin,
      signInWithGoogle, signOut,
      signUpWithEmail, signInWithEmail, sendPasswordReset, reauthenticateUser, updateUserPassword, view, setView, goToSignIn, highlight, clearHighlight, addToSearchHistory,
      unitSystem, setUnitSystem
    }}>
      {children}
    </AuthContext.Provider>
  );
};
