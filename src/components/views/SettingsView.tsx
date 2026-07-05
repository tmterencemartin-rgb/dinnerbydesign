import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  ExternalLink,
  Info,
  Sparkles,
  ShieldCheck,
  Mail,
  Loader2,
  Check,
  Sliders,
  Apple,
  Utensils,
  Clock,
  Database,
  FileText,
  Settings
} from 'lucide-react';
import { CircleX } from '../ui/CircleX';
import { useAuth } from '../../contexts/AuthContext';
import { UserPreferences, AppView } from '../../types';
import { NumberStepper } from '../ui/NumberStepper';
import { Tooltip } from '../ui/Tooltip';
import { 
  DIETARY_TAXONOMY, 
} from '../../constants';
import { normaliseUserPreferences } from '../../lib/preferenceUtils';
import { getApiUrl, getApiConfig, setApiConfig } from '../../lib/api';
import { safeStorage } from '../../lib/storage';
import { ConnectionDiagnostics } from '../home/ConnectionDiagnostics';
import { doc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../firebase';
import { OperationType } from '../../types';

import { StripeCheckoutButton } from '../StripeCheckoutButton';
import { PREFERRED_SOURCES } from '../../data/preferredSources';
import { AuthForm } from '../AuthForm';

interface SettingsViewProps {
  setView: (view: AppView, openFilters?: boolean) => void;
  highlight?: string | null;
  clearHighlight?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ setView, highlight, clearHighlight }) => {
  const { 
    user, 
    profile, 
    savedRecipes, 
    addLog, 
    setError, 
    savePreferences,
    signInWithGoogle,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    reauthenticateUser,
    showToast,
    accessStatus,
    isAdmin,
    trialDaysLeft,
    trialTimeRemaining
  } = useAuth();

  const trialEndFormatted = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + trialDaysLeft);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  }, [trialDaysLeft]);

  const trialDurationText = (trialTimeRemaining || '').replace(' left', '');

  const isReadOnly = accessStatus === 'read_only';

  const checkReadOnly = (msg: string) => {
    if (isReadOnly) {
      showToast(msg, "Upgrade", () => setView('settings'));
      return true;
    }
    return false;
  };

  const [localPreferences, setLocalPreferences] = useState<UserPreferences | null>(profile?.preferences || null);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [exclusionsDraft, setExclusionsDraft] = useState('');
  const [customApiUrl, setCustomApiUrl] = useState(() => (typeof window !== 'undefined' ? (safeStorage.getItem('CUSTOM_API_BASE_URL') || '') : ''));
  const [apiConfig, setApiConfigState] = useState(() => getApiConfig());
  const [showEmailCopied, setShowEmailCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security' | 'support' | 'privacy' | 'developer'>('profile');
  const [openFaqId, setOpenFaqId] = useState<string | null>('cancel');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { updateUserPassword } = useAuth();

  const faqData = [
    {
      id: 'cancel',
      question: 'How do I cancel my subscription?',
      answer: 'Go to Settings → Subscription. Your cancellation options are listed there.'
    },
    {
      id: 'dietary',
      question: 'Can I change my dietary profile?',
      answer: 'Yes. Go to Settings → Profile and select your dietary preferences.'
    },
    {
      id: 'display',
      question: "My recipe isn't displaying correctly.",
      answer: 'Please try clearing your browser\'s cache and cookies, or try a different browser. If the issue persists, contact us at chef@dinnerbydesign.app.'
    }
  ];

  const handleSendTestEmail = async () => {
    if (!user || !user.email) {
      showToast("Please sign in to send a test email.");
      return;
    }

    setIsSendingTest(true);
    const apiUrl = getApiUrl('/api/send-email');
    const recipient = user.email;
    
    console.log(`[Settings] Sending test email to ${recipient} via ${apiUrl}...`);
    
    try {
      // 1. Health Check Ping
      try {
        const healthUrl = getApiUrl('/api/health');
        const healthRes = await fetch(healthUrl);
        console.log(`[Diagnostic] Health check to ${healthUrl}: ${healthRes.status} ${healthRes.ok ? '(OK)' : '(FAILED)'}`);
      } catch (healthErr) {
        console.warn("[Diagnostic] Health check failed, but proceeding with email anyway:", healthErr);
      }

      console.log(`[Diagnostic] Executing fetch to ${apiUrl}...`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          to: recipient,
          subject: 'DinnerByDesign Test Email',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
              <h1 style="color: #111;">Connection Successful!</h1>
              <p>This is a test email from <strong>DinnerByDesign</strong> to verify your Resend configuration.</p>
              <p>Your email service is now ready to send recipe instructions and shopping lists.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">Sent at: ${new Date().toLocaleString()}</p>
            </div>
          `
        })
      }).catch(fetchErr => {
        // Explicitly handle and wrap network level failures
        console.error("[Diagnostic] Native fetch catch:", fetchErr);
        throw new Error(`NETWORK_ERROR: ${fetchErr.message || 'Failed to reach server'}`);
      });

      console.log(`[Diagnostic] Response status: ${response.status} ${response.ok ? '(OK)' : '(FAILED)'}`);
      
      if (!response.ok) {
        let errorMsg = 'Failed to send test email';
        let errorCode = '';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error?.message || errorData?.message || errorMsg;
          errorCode = errorData?.error?.code ? ` (${errorData.error.code})` : '';
        } catch (e) {
          errorMsg = `${response.status} ${response.statusText}`;
        }
        throw new Error(`${errorMsg}${errorCode}`);
      }
      
      const resData = await response.json().catch(() => ({}));
      if (resData?.simulated) {
        showToast(`Simulated send: Verify your email on Resend to receive real ones!`);
      } else {
        showToast(`Test email sent successfully to ${recipient}!`);
      }
    } catch (err: any) {
      console.error("Test email error details:", err);
      const isFetchError = err.message.includes("NETWORK_ERROR") || 
                         err.message.toLowerCase().includes("failed to fetch") || 
                         err.name === "TypeError";
      
      if (isFetchError) {
        showToast(`Network Error: Ensure the search service is online. (Target: ${apiUrl})`);
      } else if (
        err.name === "validation_error" ||
        err.message?.toLowerCase().includes("validation") ||
        err.message?.includes("restricted") || 
        err.message?.includes("RECIPIENT_RESTRICTION") || 
        err.message?.includes("RESEND_RESTRICTION") || 
        err.message?.includes("validation_error")
      ) {
        showToast("Delivery restricted: This email isn't verified in the sending service yet. Copy manually instead.");
      } else {
        showToast(`Email error: ${err.message}`);
      }
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveConnectionUrl = () => {
    addLog(`UI ACTION: handleSaveConnectionUrl to ${customApiUrl}`);
    const cleanUrl = customApiUrl.trim();
    if (cleanUrl) {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        showToast("Error: Connection URL must start with http:// or https://");
        return;
      }
      safeStorage.setItem('CUSTOM_API_BASE_URL', cleanUrl);
      showToast("Connection URL saved! Ready to connect.");
    } else {
      safeStorage.removeItem('CUSTOM_API_BASE_URL');
      showToast("Reverted to default cloud endpoints.");
    }
  };

  const handleSaveApiConfig = () => {
    const cleanedConfig = {
      ...apiConfig,
      directApiKey: apiConfig.directApiKey?.trim() || ''
    };
    setApiConfig(cleanedConfig);
    setApiConfigState(cleanedConfig);
    showToast(`Model configuration saved in ${apiConfig.mode} mode!`);
    // Reload if switching to direct to ensure the service instance is re-initialized
    if (apiConfig.mode === 'direct') {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Handle highlighting/scrolling
  React.useEffect(() => {
    if (highlight) {
      if (highlight === 'account-section' || highlight === 'dietary-profile-summary') {
        setActiveTab('profile');
      } else if (highlight === 'security-section' || highlight === 'password-management') {
        setActiveTab('security');
      } else if (highlight === 'data-privacy-section' || highlight === 'data-privacy') {
        setActiveTab('privacy');
      } else if (highlight === 'subscription-section') {
        setActiveTab('subscription');
      } else if (highlight === 'developer-section') {
        setActiveTab('developer');
      }

      setTimeout(() => {
        const el = document.getElementById(highlight);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => clearHighlight?.(), 2000);
        }
      }, 100);
    }
  }, [highlight, clearHighlight]);

  // Keep track of previous user state to handle sign-in transitions gracefully
  const prevUserRef = React.useRef(user);
  React.useEffect(() => {
    prevUserRef.current = user;
  }, [user]);

  // Keep track of the last synchronized database state of profile preferences
  const lastProfilePrefsRef = React.useRef<string | null>(
    profile?.preferences ? JSON.stringify(profile.preferences) : null
  );

  // Keep localPreferences in sync with hydrated profile preferences from Database
  React.useEffect(() => {
    const prefsJson = profile?.preferences ? JSON.stringify(profile.preferences) : null;
    const oldPrefsJson = lastProfilePrefsRef.current;

    if (prefsJson !== oldPrefsJson) {
      lastProfilePrefsRef.current = prefsJson;
      if (profile?.preferences) {
        // If localPreferences is null, or it is identical to the old database state,
        // it means the user hasn't made any unsaved edits relative to that state.
        // Therefore, we can safely overwrite it with the new database state.
        const isLocalClean = !localPreferences || !oldPrefsJson || JSON.stringify(localPreferences) === oldPrefsJson;
        if (isLocalClean) {
          setLocalPreferences(profile.preferences);
          addLog("SYSTEM: Preference baseline changed. Syncing local preferences with database.");
        }
      }
    }
  }, [profile?.preferences, localPreferences, addLog]);

  const updateLocalPreference = (key: keyof UserPreferences, value: any) => {
    addLog(`UI ACTION: updateLocalPreference triggered for ${key} = ${value}`);
    setLocalPreferences(prev => {
      const base = prev || profile?.preferences || normaliseUserPreferences(null);
      return { ...base, [key]: value };
    });
  };

  const onSaveGlobalDefaults = async () => {
    if (checkReadOnly("Your trial has ended. Upgrade to change your preferences.")) return;
    addLog('UI ACTION: onSaveGlobalDefaults START');
    setPreferencesError(null);
    setError(null);

    const currentPrefs = localPreferences || profile?.preferences || normaliseUserPreferences(null);
    if (!currentPrefs) {
      addLog('UI ERROR: No preferences to save');
      setPreferencesError("No preferences found to save.");
      return;
    }
    
    let updatedPrefs = { ...currentPrefs };
    let changed = false;

    if (exclusionsDraft.trim()) {
      const val = exclusionsDraft.trim().replace(/,$/, '').trim();
      if (val) {
        const isDuplicate = updatedPrefs.exclusions?.some(i => i.toLowerCase() === val.toLowerCase());
        if (!isDuplicate) {
          updatedPrefs.exclusions = [...(updatedPrefs.exclusions || []), val];
          changed = true;
        }
        setExclusionsDraft('');
      }
    }

    try {
      if (changed) {
        setLocalPreferences(updatedPrefs);
        await savePreferences(updatedPrefs);
      } else {
        await savePreferences(currentPrefs);
      }
      
      setPreferencesError(null); 
      setShowInlineSuccess(true);
      
      // Immediate redirect to search view as requested
      setTimeout(() => setView('home'), 500);
    } catch (err: any) {
      addLog(`UI ERROR: saving failed: ${err.message || err}`);
      console.error('[Action] persistence error:', err);
      const errorMsg = err.message || "Failed to save preferences. Please check your connection.";
      setPreferencesError(errorMsg);
    }
  };

  const handleResetPreferences = async () => {
    if (checkReadOnly("Your trial has ended. Upgrade to change your preferences.")) return;
    addLog('UI ACTION: handleResetPreferences START');
    setPreferencesError(null);
    setError(null);
    const defaultPrefs = normaliseUserPreferences(null);
    try {
      setLocalPreferences(defaultPrefs);
      await savePreferences(defaultPrefs);
      setPreferencesError(null);
      setShowInlineSuccess(true);
      
      // Immediate redirect to search view as requested
      setTimeout(() => setView('home'), 500);
    } catch (err) {
      setPreferencesError("Failed to reset preferences");
    }
  };

  const handleDownloadData = () => {
    if (!profile) return;
    const data = {
      preferences: profile.preferences,
      savedRecipes: savedRecipes.map(({ id, ...rest }) => rest)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dinnerbydesign-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    setDeleteError(null);
    
    // 1. Proactive Re-authentication if provider is password and password is provided
    const hasPasswordProvider = user.providerData.some(p => p.providerId === 'password');
    if (hasPasswordProvider) {
      if (!deletePassword.trim()) {
        setDeleteError("Password is required to confirm deletion.");
        setIsDeleting(false);
        return;
      }
      try {
        await reauthenticateUser(deletePassword);
      } catch (reauthErr: any) {
        let cleanErr = "Could not verify your password. Please try again.";
        const errMsg = reauthErr.message || '';
        if (errMsg.includes("wrong-password") || errMsg.includes("invalid-credential")) {
          cleanErr = "Incorrect password. Please try again.";
        } else if (errMsg.includes("too-many-requests")) {
          cleanErr = "Too many failed attempts. Please try again later.";
        }
        setDeleteError(cleanErr);
        setIsDeleting(false);
        return;
      }
    }

    // 2. Perform safe Firestore data deletion
    try {
      addLog(`SETTINGS: Deleting user data collections for ${user.uid}`);
      const savedRecipesSnapshot = await getDocs(collection(db, 'users', user.uid, 'savedRecipes'));
      const pantrySnapshot = await getDocs(collection(db, 'users', user.uid, 'pantry'));
      const shoppingListSnapshot = await getDocs(collection(db, 'users', user.uid, 'shoppingList'));
      
      const batch = writeBatch(db);
      
      savedRecipesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      pantrySnapshot.docs.forEach(doc => batch.delete(doc.ref));
      shoppingListSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      batch.delete(doc(db, 'users', user.uid, 'profile', 'preferences'));
      batch.delete(doc(db, 'users', user.uid));
      
      await batch.commit();
      addLog(`SETTINGS: Firestore user data successfully purged!`);
    } catch (dbErr: any) {
      console.error("Database deletion failed:", dbErr);
      try {
        handleFirestoreError(dbErr, OperationType.DELETE, 'user data');
      } catch (jsonErr: any) {
        setError(jsonErr.message);
      }
      setIsDeleting(false);
      return;
    }

    // 3. Delete auth account
    try {
      addLog(`SETTINGS: Deleting auth account for ${user.uid}`);

      const userEmailForEmail = user.email;
      if (userEmailForEmail) {
        addLog(`SETTINGS: Triggering account deletion email to ${userEmailForEmail}`);
        const nameToUse = profile?.displayName || user.displayName || userEmailForEmail.split('@')[0] || 'User';
        let firstName = "there";
        if (nameToUse && typeof nameToUse === 'string') {
          const parts = nameToUse.trim().split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            if (parts[0].includes('@')) {
              firstName = parts[0].split('@')[0];
            } else {
              firstName = parts[0];
            }
          }
        }
        
        const emailHtml = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <div style="border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px;">
    <h2 style="color: #111; margin: 0; font-size: 20px;">DinnerByDesign</h2>
  </div>

  <p>Hi ${firstName},</p>

  <p>As requested, your DinnerByDesign account has been closed, and your personal data (including saved dinner plans, pantry logs, and profile info) has been permanently deleted from our systems.</p>

  <p style="font-size: 14px; color: #555;">Please note it may take up to 48 hours for cache layers and automated backup rotations to clear completely.</p>

  <p>You are always welcome back if you ever want to start dinner planning again in the future.</p>

  <p>Warmly,</p>
  <p>The DinnerByDesign team</p>
  <p style="margin: 0; font-size: 13px; color: #666;"><a href="mailto:support@dinnerbydesign.app" style="color: #666; text-decoration: underline;">support@dinnerbydesign.app</a></p>
</div>
        `.trim();

        try {
          await fetch(getApiUrl("/api/send-email"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: userEmailForEmail,
              subject: "Confirmation: DinnerByDesign account closure & data removal",
              html: emailHtml,
              from: "DinnerByDesign Support <support@dinnerbydesign.app>",
              type: "account_closure",
              source: "settings_view",
              userId: user.uid
            })
          });
          addLog(`SETTINGS: Deletion confirmation email API call finished.`);
        } catch (emailErr) {
          console.error("Account deletion confirmation email failed to send:", emailErr);
          addLog(`SETTINGS WARNING: Failed to send account deletion confirmation email: ${emailErr}`);
        }
      }

      await user.delete();
      
      // Explicitly clear local preferences to prevent stale restoration
      safeStorage.removeItem('dbd_has_started');
      safeStorage.removeItem('dbd_temporary_preferences');

      showToast("Account deleted");
      addLog(`SETTINGS: Account purged, redirecting to landing.`);
      
      // Navigate to landing and ensure state is reset
      setView('landing'); 
      window.scrollTo(0, 0);
    } catch (authErr: any) {
      const errMessage = authErr.message || '';
      if (errMessage.includes("requires-recent-login") || authErr.code === "auth/requires-recent-login") {
        addLog("SETTINGS WARNING: auth/requires-recent-login during user.delete() despite re-auth check. Prompting for verification.");
        setDeleteError("Your login session has expired. Please enter your password again to confirm account deletion.");
        setIsDeleting(false);
      } else {
        try {
          handleFirestoreError(authErr, OperationType.DELETE, 'user data');
        } catch (jsonErr: any) {
          setError(jsonErr.message);
        }
        setIsDeleting(false);
      }
    }
  };

  const handleManageBilling = async () => {
    const customerId = profile?.subscription?.stripeCustomerId;
    
    if (!customerId) {
      showToast("No active subscription found to manage.");
      return;
    }

    setIsPortalLoading(true);
    
    try {
      const response = await fetch(getApiUrl('/api/create-portal-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) throw new Error('Failed to create portal session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err: any) {
      console.error("Portal error:", err);
      showToast(`Error: ${err.message}`);
    } finally {
      setIsPortalLoading(false);
    }
  };

  const isPreferencesDirty = React.useMemo(() => {
    if (exclusionsDraft.trim()) return true;
    if (!localPreferences) return false;
    const currentPrefs = profile?.preferences || normaliseUserPreferences(null);
    return JSON.stringify(localPreferences) !== JSON.stringify(currentPrefs);
  }, [localPreferences, profile?.preferences, exclusionsDraft]);

  const displayedPreferences = localPreferences || profile?.preferences || normaliseUserPreferences(null);

  const [debugClicks, setDebugClicks] = useState(0);
  const isDebugUrl = typeof window !== 'undefined' && window.location.search.includes('debug=true');
  const isProd = (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production') || import.meta.env.MODE === 'production';
  const showDebug = isAdmin || isDebugUrl;

  const handleDebugClick = () => {
    if (isProd && !isDebugUrl) return;
    setDebugClicks(prev => {
      const next = prev + 1;
      if (next === 5) showToast("Debug settings unlocked");
      return next;
    });
  };

  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-10 space-y-6 -mt-4"
    >
      <div className="space-y-1 pt-5 sm:pt-6">
        <div className="flex items-center justify-between">
          <button 
            id="back-to-search-btn"
            onClick={() => setView('home')} 
            className="flex items-center gap-1 text-[13px] font-normal text-accent hover:text-gray-900 transition-colors"
          >
            <ChevronLeft id="back-chevron" className="w-4 h-4 -ml-1" />
            <span id="back-text">Back to search</span>
          </button>
          
          <button 
            onClick={() => setView('home')}
            className="p-1 px-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close settings"
          >
            <CircleX size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center pb-2 pt-0 space-y-1">
          <h2 
            className="text-[20px] font-bold text-gray-900 text-center select-none cursor-default"
            onClick={handleDebugClick}
          >
            Settings
          </h2>
        </div>

        {/* Tab switcher navigation bar */}
        <div className="flex border-b border-gray-100 justify-start sm:justify-center gap-1 sm:gap-4 mt-6 overflow-x-auto no-scrollbar scroll-smooth px-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'text-gray-950 font-extrabold' 
                : 'text-gray-400/80 hover:text-gray-600 font-bold'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <motion.div 
                layoutId="activeSettingsTabLine" 
                className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
              activeTab === 'subscription' 
                ? 'text-gray-950 font-extrabold' 
                : 'text-gray-400/80 hover:text-gray-600 font-bold'
            }`}
          >
            Subscription
            {activeTab === 'subscription' && (
              <motion.div 
                layoutId="activeSettingsTabLine" 
                className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
              activeTab === 'security' 
                ? 'text-gray-950 font-extrabold' 
                : 'text-gray-400/80 hover:text-gray-600 font-bold'
            }`}
          >
            Security
            {activeTab === 'security' && (
              <motion.div 
                layoutId="activeSettingsTabLine" 
                className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
              activeTab === 'support' 
                ? 'text-gray-950 font-extrabold' 
                : 'text-gray-400/80 hover:text-gray-600 font-bold'
            }`}
          >
            Help
            {activeTab === 'support' && (
              <motion.div 
                layoutId="activeSettingsTabLine" 
                className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
              activeTab === 'privacy' 
                ? 'text-gray-950 font-extrabold' 
                : 'text-gray-400/80 hover:text-gray-600 font-bold'
            }`}
          >
            Privacy
            {activeTab === 'privacy' && (
              <motion.div 
                layoutId="activeSettingsTabLine" 
                className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
              />
            )}
          </button>
          {showDebug && (
            <button
              onClick={() => setActiveTab('developer')}
              className={`pb-2.5 px-3 text-[13px] relative transition-all duration-200 outline-none whitespace-nowrap ${
                activeTab === 'developer' 
                  ? 'text-gray-950 font-extrabold' 
                  : 'text-gray-400/80 hover:text-gray-600 font-bold'
              }`}
            >
              Developer
              {activeTab === 'developer' && (
                <motion.div 
                  layoutId="activeSettingsTabLine" 
                  className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gray-950 rounded-full z-10" 
                />
              )}
            </button>
          )}
        </div>

        {/* Status Notifications */}
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          {showInlineSuccess && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-900 text-white px-6 py-2.5 rounded shadow-md flex items-center justify-center gap-2 border border-white/10"
            >
              <div className="w-4 h-4 rounded bg-accent flex items-center justify-center">
                <CircleX size={10} className="rotate-45" /> 
              </div>
              <span className="text-[13px] font-bold">Preferences saved</span>
            </motion.div>
          )}
          {preferencesError && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-red-600 text-white px-6 py-2.5 rounded shadow-md flex items-center justify-between gap-4 pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <CircleX size={14} />
                <span className="text-[13px] font-medium">{preferencesError}</span>
              </div>
              <button 
                onClick={() => setPreferencesError(null)}
                className="text-white/80 hover:text-white"
              >
                <CircleX size={14} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="pt-2 min-h-[440px]">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            <div className={isAdmin && user && !user.isAnonymous ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
              {/* Account Card */}
              <div id="account-section" className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Profile</h3>
                {user && !user.isAnonymous ? (
                  <div className="space-y-3 pb-1">
                    <div className="flex items-center gap-3 min-w-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded border border-gray-100 object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-dbd-accent text-white flex items-center justify-center text-[15px] font-bold border border-gray-100">
                          {user.email?.charAt(0).toUpperCase() || user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[14px] text-gray-900 font-bold leading-none">{user.displayName || user.email || 'User'}</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium leading-none truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:pl-[52px]">
                      <button 
                        onClick={signOut}
                        className="px-3 py-1.5 bg-white border border-gray-100 text-gray-700 text-[11px] font-bold rounded hover:bg-gray-50 hover:border-gray-200 transition-all"
                      >
                        Sign out
                      </button>
                      <button 
                        onClick={handleSendTestEmail}
                        disabled={isSendingTest}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-[11px] font-bold rounded hover:bg-gray-100 transition-all disabled:opacity-50"
                      >
                        {isSendingTest ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                        Test email
                      </button>
                    </div>
                  </div>
                ) : (
                  <AuthForm onSuccess={() => showToast("Welcome back!")} />
                )}
              </div>

              {isAdmin && user && !user.isAnonymous && (
                <div className="bg-white rounded p-5 sm:p-6 space-y-4 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-[13.5px] text-gray-900 font-bold">Admin dashboard</h3>
                      <p className="text-[11.5px] text-gray-400 font-semibold leading-relaxed">
                        Review subscribers, subscription status, Stripe webhook health, email status and CSV exports.
                      </p>
                    </div>
                    <button
                      onClick={() => setView('admin')}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Database className="w-3.5 h-3.5" />
                      Open dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Read-Only Dietary Profile Summary */}
            {user && !user.isAnonymous && (
              <div id="dietary-profile-summary" className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">My Dietary Profile</h3>
                </div>

                <div className="bg-white rounded border border-gray-100 p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-0.5">
                      <p className="text-[13px] text-gray-900 font-bold leading-snug">My Search Defaults</p>
                      <p className="text-[11px] text-gray-400 font-semibold">Applied automatically to every search</p>
                    </div>
                    <button
                      onClick={() => setView('home', true)}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[10.5px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 w-fit"
                    >
                      <Sliders className="w-3 h-3" />
                      Edit Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Core Rules */}
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Apple className="w-3.5 h-3.5 text-gray-500" />
                        Core Rules & Restrictions
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium">Dietary preference</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.dietaryRule ? (DIETARY_TAXONOMY.dietaryPreferences.labels[displayedPreferences.dietaryRule] || displayedPreferences.dietaryRule) : 'None'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium">Salad preference</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.saladPreference ? (DIETARY_TAXONOMY.saladPreferences.labels[displayedPreferences.saladPreference] || displayedPreferences.saladPreference) : 'All salads permitted'}
                          </span>
                        </div>

                        {displayedPreferences.allergies && displayedPreferences.allergies.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-gray-500 font-medium text-[13px] block">Allergies / Safe Eating</span>
                            <div className="flex flex-wrap gap-1.5">
                              {displayedPreferences.allergies.map(allergy => (
                                <span key={allergy} className="inline-flex items-center bg-red-50 text-red-750 text-[10.5px] px-2 py-0.5 rounded font-bold border border-red-100">
                                  No {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {displayedPreferences.exclusions && displayedPreferences.exclusions.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-gray-500 font-medium text-[13px] block">Excluded ingredients</span>
                            <div className="flex flex-wrap gap-1.5">
                              {displayedPreferences.exclusions.map(exc => (
                                <span key={exc} className="inline-flex items-center bg-amber-50 text-amber-700 text-[10.5px] px-2 py-0.5 rounded font-bold border border-amber-100">
                                  Exclude: {exc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Limits, Budget & Priorities */}
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        Limits & Saved Priorities
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium">Standard portions</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.servings || 2} adult portions
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium font-semibold">Max calories</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.calorieCeiling ? `${displayedPreferences.calorieCeiling} kcal` : 'No calorie limit'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium font-semibold">Max cost</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.budgetLimit ? `£${displayedPreferences.budgetLimit.toFixed(2)}` : 'No budget limit'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 text-[12.5px] border-b border-gray-50 pb-1">
                          <span className="text-gray-500 font-medium font-semibold">Ready in under</span>
                          <span className="font-bold text-gray-800 text-right">
                            {displayedPreferences.readyToEatUnderMins ? `${displayedPreferences.readyToEatUnderMins} mins` : 'No limit'}
                          </span>
                        </div>

                        {/* Saved Priorities */}
                        {(displayedPreferences.nutritiousChoice || displayedPreferences.isSimple || displayedPreferences.isLowCost || displayedPreferences.highOmega3 || displayedPreferences.highProtein) && (
                          <div className="pt-2 border-t border-gray-100/50">
                            <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider block mb-1.5 opacity-80">Saved Priorities</span>
                            <div className="flex flex-wrap gap-1.5">
                              {displayedPreferences.nutritiousChoice && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-tight">
                                  Wholesome
                                </span>
                              )}
                              {displayedPreferences.isSimple && (
                                <span className="bg-gray-50 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold border border-gray-100 uppercase tracking-tight">
                                  Quick & Easy
                                </span>
                              )}
                              {displayedPreferences.isLowCost && (
                                <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-100 uppercase tracking-tight">
                                  Low Cost
                                </span>
                              )}
                              {displayedPreferences.highOmega3 && (
                                <span className="bg-gray-50 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold border border-gray-100 uppercase tracking-tight">
                                  High Omega-3
                                </span>
                              )}
                              {displayedPreferences.highProtein && (
                                <span className="bg-gray-50 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold border border-gray-100 uppercase tracking-tight">
                                  High Protein
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Global Culinary & Store Preferences */}
                    <div className="space-y-2.5 md:col-span-2 pt-3 border-t border-gray-100">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-gray-500" />
                        Culinary Preferences
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-gray-500 font-semibold text-[11.5px] block">Cuisine Preferences</span>
                          <p className="text-[12px] text-gray-800 font-bold mt-1">
                            {displayedPreferences.cuisinePreferences && displayedPreferences.cuisinePreferences.length > 0 
                              ? displayedPreferences.cuisinePreferences.join(', ') 
                              : 'All world cuisines'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-semibold text-[11.5px] block">Cooking Methods</span>
                          <p className="text-[12px] text-gray-800 font-bold mt-1">
                            {displayedPreferences.cookingMethods && displayedPreferences.cookingMethods.length > 0 
                              ? displayedPreferences.cookingMethods.join(', ') 
                              : 'Any methods allowed'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-semibold text-[11.5px] block">Nearby retailers</span>
                          <p className="text-[12px] text-gray-800 font-bold mt-1">
                            {displayedPreferences.preferredSupermarkets && displayedPreferences.preferredSupermarkets.length > 0 
                              ? displayedPreferences.preferredSupermarkets.join(', ') 
                              : 'All UK retailers'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            

          </motion.div>
        )}

        {/* Tab 2: Subscription */}
        {activeTab === 'subscription' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            <div id="subscription-section" className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Subscription</h3>
                {(accessStatus === 'paid' || accessStatus === 'trial') && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded uppercase tracking-wider">
                     <ShieldCheck size={14} strokeWidth={2.5} />
                     <span>Account active</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50/50 rounded p-5 space-y-4">
                {(accessStatus === 'read_only') ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch pt-2">
                    <div className="space-y-4 flex flex-col justify-center">
                      <div className="space-y-1.5">
                        <p className="text-[13px] text-gray-900 font-bold leading-snug">
                          Unlock Full Access
                        </p>
                        <p className="text-[12px] text-gray-400 leading-relaxed font-semibold opacity-85">
                          Activate your monthly or annual subscription to unlock unlimited recipes, multi-device planning, and full supermarket costing.
                        </p>
                      </div>
                      
                      <ul id="feature-list" className="space-y-3.5 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-dbd-accent font-bold mt-0.5 text-[11px]">✓</span>
                          <span className="text-[12px] text-gray-500 font-medium leading-normal">
                            <strong className="text-gray-900">Saved across devices</strong>: linked securely to your email profile.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-dbd-accent font-bold mt-0.5 text-[11px]">✓</span>
                          <span className="text-[12px] text-gray-500 font-medium leading-normal">
                            <strong className="text-gray-900">Unlimited searches</strong>: zero daily or weekly caps.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-dbd-accent font-bold mt-0.5 text-[11px]">✓</span>
                          <span className="text-[12px] text-gray-500 font-medium leading-normal">
                            <strong className="text-gray-900">Full UK metrics</strong>: cost-per-portion, portion scaler, and nutrient totals.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col justify-center">
                      <StripeCheckoutButton className="w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded space-y-1 ${accessStatus === 'paid' ? 'bg-emerald-50/40' : 'bg-gray-50/70'}`}>
                      <p className="text-[13.5px] text-gray-900 font-bold">
                        {accessStatus === 'paid' 
                          ? 'Your subscription is currently active!' 
                          : `Free Trial — ${trialDurationText} remaining`}
                      </p>
                      <p className="text-[12px] text-gray-400 leading-normal font-semibold">
                        {accessStatus === 'paid'
                          ? 'Thank you for supporting DinnerByDesign. You have unlimited bespoke searches, portion sizes, active plans and UK supermarket trackers synced across all devices.'
                          : `You have full access to all features. Your trial ends on ${trialEndFormatted}.`}
                      </p>
                    </div>

                    {accessStatus === 'trial' && (
                      <div className="p-4 bg-white rounded space-y-3">
                        <div className="space-y-1">
                          <p className="text-[13px] text-gray-900 font-bold leading-snug">
                            Subscribe before your trial ends
                          </p>
                          <p className="text-[12px] text-gray-400 leading-normal font-semibold">
                            Choose a monthly or annual account now to keep DinnerByDesign active without interruption.
                          </p>
                        </div>
                        <StripeCheckoutButton className="w-full" />
                      </div>
                    )}
                    
                    {(profile?.isPremium || profile?.subscription?.stripeCustomerId) && (
                      <button
                        onClick={handleManageBilling}
                        disabled={isPortalLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-gray-900 text-[12px] font-bold rounded hover:bg-gray-50 transition-all font-bold disabled:opacity-50"
                      >
                        {isPortalLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        )}
                        Manage Billing & Subscription
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'security' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            <div id="security-section" className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Security</h3>
              </div>

              {user?.providerData.some(p => p.providerId === 'password') ? (
                <div className="space-y-6 max-w-md">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 id="password-management" className="text-[13px] font-bold text-gray-900">Change Password</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        Keeping your account secure is important. Your new password must be at least 6 characters long.
                      </p>
                    </div>

                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setPasswordError(null);
                        if (newPassword !== confirmPassword) {
                          setPasswordError("Passwords do not match.");
                          return;
                        }
                        if (newPassword.length < 6) {
                          setPasswordError("New password must be at least 6 characters.");
                          return;
                        }
                        
                        setIsUpdatingPassword(true);
                        try {
                          await updateUserPassword(currentPassword, newPassword);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          showToast("Password updated successfully.");
                        } catch (err: any) {
                          let msg = err.message || "Failed to update password.";
                          if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                            msg = "The current password you entered is incorrect.";
                          }
                          setPasswordError(msg);
                        } finally {
                          setIsUpdatingPassword(false);
                        }
                      }}
                      className="space-y-3"
                    >
                      {passwordError && (
                        <div className="p-3 bg-red-50 rounded flex items-start gap-2.5">
                          <CircleX className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] font-bold text-red-700 leading-tight">{passwordError}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[11.5px] font-bold text-gray-500 block pl-0.5 uppercase tracking-wide">Current Password</label>
                        <input 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-50/50 border border-gray-100 rounded px-3.5 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-accent/20 transition-all font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11.5px] font-bold text-gray-500 block pl-0.5 uppercase tracking-wide">New Password</label>
                        <input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-50/50 border border-gray-100 rounded px-3.5 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-accent/20 transition-all font-medium"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11.5px] font-bold text-gray-500 block pl-0.5 uppercase tracking-wide">Confirm New Password</label>
                        <input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-50/50 border border-gray-100 rounded px-3.5 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-accent/20 transition-all font-medium"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isUpdatingPassword ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50/50 rounded p-5 space-y-3">
                  <div className="flex items-center gap-2 text-dbd-accent">
                    <Sparkles size={16} />
                    <p className="text-[13.5px] font-bold">Social Login Enabled</p>
                  </div>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed max-w-sm">
                    You are currently using Google to sign in. Since Google manages your authentication, 
                    there is no password for you to change here. To update your Google account security, 
                    please visit your Google Account settings.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Support */}
        {activeTab === 'support' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Support Contact Card */}
            <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Help & Support</h3>
                <p className="text-[13.5px] text-gray-900 font-bold">How can we help you today?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                <div className="space-y-4 bg-gray-50/50 p-5 rounded">
                  <div className="w-10 h-10 rounded bg-dbd-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-dbd-accent" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[14px] text-gray-900 font-bold">Email Support</h4>
                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                      Facing a technical issue or have a question about your recipes? Our team usually responds within 24 hours.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('chef@dinnerbydesign.app');
                        setShowEmailCopied(true);
                        setTimeout(() => setShowEmailCopied(false), 3000);
                        const a = document.createElement('a');
                        a.href = 'mailto:chef@dinnerbydesign.app';
                        a.click();
                      }}
                      className="w-full py-2 bg-gray-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={14} />
                      Email chef@dinnerbydesign.app
                    </button>
                    {showEmailCopied && (
                      <p className="text-[10px] text-emerald-600 font-bold mt-2 text-center flex items-center justify-center gap-1">
                        <Check size={10} />
                        Copied to clipboard
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/40 p-5 rounded flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="text-[14px] text-gray-900 font-bold">Frequently Asked</h4>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {faqData.map((faq) => {
                      const isOpen = openFaqId === faq.id;
                      return (
                        <div key={faq.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                          <button
                            onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${faq.id}`}
                            className="w-full flex items-center justify-between py-2 text-left group transition-all"
                          >
                            <span className={`text-[12.5px] font-bold transition-colors ${isOpen ? 'text-accent' : 'text-gray-700 group-hover:text-gray-900'}`}>
                              {faq.question}
                            </span>
                            <ChevronDown 
                              size={16} 
                              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'group-hover:text-gray-600'}`} 
                            />
                          </button>
                          {isOpen && (
                            <motion.div
                              id={`faq-answer-${faq.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed pb-2 pr-4">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Help Card */}
            <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Billing & Account</h3>
              <div className="space-y-4 pl-0.5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={12} className="text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] text-gray-900 font-bold">Secure Billing via Stripe</p>
                    <p className="text-[11.5px] text-gray-400 font-medium leading-relaxed">
                      All payments are processed securely by Stripe. We do not store your credit card details on our servers.
                    </p>
                  </div>
                </div>
                {profile?.isPremium && (
                  <div className="pt-2">
                    <button className="text-[12px] text-dbd-accent hover:underline font-bold transition-all flex items-center gap-1.5">
                      Manage subscription in customer portal
                      <ExternalLink size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Troubleshooting Card */}
            <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                <Settings size={14} className="text-gray-400" />
                Search Setup
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-0.5">
                <div>
                  <h4 className="text-[13px] text-gray-900 font-semibold">Reset Search Guide</h4>
                  <p className="text-[11.5px] text-gray-400 font-medium">Reset the search walkthrough if you missed it.</p>
                </div>
                <button 
                  onClick={() => {
                    safeStorage.removeItem('dbd_onboarding_completed');
                    safeStorage.removeItem('dbd_has_searched');
                    safeStorage.removeItem('dbd_search_onboarding_dismissed');
                    safeStorage.removeItem('dbd_has_started');
                    showToast("Search state reset!");
                    setTimeout(() => window.location.reload(), 500);
                  }} 
                  className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-900 text-[11px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                >
                  Reset Walkthrough
                </button>
              </div>
            </div>

            {/* Company Info Footer Section in Tab */}
            <div className="pt-4 flex flex-col items-center space-y-4 text-center pb-8">
              <div className="space-y-1">
                <p className="text-[16px] text-gray-900 font-bold font-sans">DinnerByDesign</p>
                <p className="text-[12px] text-gray-400 font-semibold max-w-xs leading-relaxed">
                  Real-world recipes, planned around your preferences.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => setView('privacy')}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
                >
                  Privacy
                </button>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <button 
                  onClick={() => setView('terms')}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
                >
                  Terms
                </button>
              </div>
              {user && !user.isAnonymous && (
                <div className="pt-8 border-t border-gray-50 w-full flex justify-center">
                  <button onClick={handleResetPreferences} className="text-[11px] uppercase tracking-wider text-gray-400 hover:text-red-500 font-bold transition-colors cursor-pointer">Clear all active filters</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Developer */}
        {showDebug && activeTab === 'developer' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Developer Connection Card */}
            <div id="developer-section" className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Internal tools</h3>
              
              <div className="space-y-1">
                <h4 className="text-[13.5px] text-gray-900 font-bold">Backend override</h4>
                <p className="text-[11.5px] text-gray-400 font-semibold leading-normal">
                  Leave blank for the deployed server. Use only when testing a local backend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[12px] text-gray-800 font-bold block">Local server URL</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={customApiUrl}
                      onChange={(e) => setCustomApiUrl(e.target.value)}
                      placeholder="e.g., http://localhost:3000"
                      className="flex-1 bg-gray-50/50 border border-gray-100 rounded px-4 py-2 text-[12.5px] outline-none focus:ring-2 focus:ring-gray-900/5 font-mono"
                    />
                    <button 
                      onClick={handleSaveConnectionUrl}
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                    >
                      Save URL
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded p-4 space-y-1.5 self-center">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Preset Quicklinks</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        setCustomApiUrl("http://localhost:3000");
                        safeStorage.setItem('CUSTOM_API_BASE_URL', "http://localhost:3000");
                        showToast("Local Preset loaded! Ready to connect.");
                      }}
                      className="px-2 py-1.5 bg-white hover:bg-gray-100 border border-gray-100 text-[10.5px] font-bold rounded text-gray-700 transition-all"
                    >
                      localhost:3000
                    </button>
                    <button 
                      onClick={() => {
                        setCustomApiUrl("");
                        safeStorage.removeItem('CUSTOM_API_BASE_URL');
                        showToast("Reverted to default cloud endpoints.");
                      }}
                      className="px-2 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-[10.5px] font-bold rounded text-red-600 transition-all"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Routing Settings */}
            <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Request routing</h3>
              <div className="space-y-1">
                <h4 className="text-[13.5px] text-gray-900 font-bold">Server route</h4>
                <p className="text-[11.5px] text-gray-400 font-semibold leading-normal">
                  Cloud Proxy is the normal production route. Direct Mode is for local testing only.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-1">
                <div className="flex-1 space-y-3">
                  <label className="text-[12px] text-gray-800 font-bold block">Routing mode</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setApiConfigState(prev => ({ ...prev, mode: 'proxy' }))}
                      className={`flex-1 py-1.5 px-3 rounded border text-[11px] font-bold uppercase tracking-wider transition-all ${
                        apiConfig.mode === 'proxy' 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      Cloud Proxy
                    </button>
                    <button 
                      onClick={() => setApiConfigState(prev => ({ ...prev, mode: 'direct' }))}
                      className={`flex-1 py-1.5 px-3 rounded border text-[11px] font-bold uppercase tracking-wider transition-all ${
                        apiConfig.mode === 'direct' 
                          ? 'bg-accent text-white border-accent' 
                          : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      Direct Mode
                    </button>
                  </div>
                </div>

                {apiConfig.mode === 'direct' && (
                  <div className="flex-1 space-y-3 animate-fade-in">
                    <label className="text-[12px] text-gray-800 font-bold block">Local test key</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="password"
                        value={apiConfig.directApiKey || ''}
                        onChange={(e) => setApiConfigState(prev => ({ ...prev, directApiKey: e.target.value }))}
                        placeholder="Paste Gemini key here..."
                        className="flex-1 bg-gray-50/50 border border-gray-100 rounded px-4 py-1.5 text-[12.5px] outline-none focus:ring-2 focus:ring-gray-900/5 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-1 flex justify-end">
                <button 
                  onClick={handleSaveApiConfig}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </div>

            {showDebug && (
              <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Service Diagnostics</h3>
                <div className="p-0.5">
                  <ConnectionDiagnostics />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Privacy */}
        {activeTab === 'privacy' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Privacy Management Card */}
            <div id="privacy-section" className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-gray-400" />
                Privacy & Data
              </h3>
              <div className="flex flex-col gap-4 pl-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100/50">
                  <div>
                    <h4 className="text-[13px] text-gray-900 font-semibold">Download My Data</h4>
                    <p className="text-[11.5px] text-gray-400 font-medium">Export all preferences, plans and recipe history offline.</p>
                  </div>
                  <button 
                    onClick={handleDownloadData} 
                    className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-900 text-[11px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Download JSON
                  </button>
                </div>
              </div>
            </div>

            {/* Legal Notices Card */}
            <div className="bg-white rounded border border-gray-100 p-5 sm:p-6 space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                Legal Notices
              </h3>
              <p className="text-[12px] text-gray-400 font-medium pl-0.5 max-w-lg leading-normal">
                Review our comprehensive policies regarding personal data processing, allergy declarations, liability limitations, and terms of service.
              </p>
              <div className="flex flex-wrap gap-3 pl-0.5 pt-1">
                <button 
                  onClick={() => setView('privacy')} 
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-850 text-[12px] font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button 
                  onClick={() => setView('terms')} 
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-850 text-[12px] font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Terms of Service</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Account Protection / Delete Section for Signed-In Users */}
            {user && !user.isAnonymous && (
              <div className="bg-red-50/20 rounded border border-red-100 p-5 sm:p-6 space-y-4">
                <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  Account Security
                </h3>
                <div className="flex flex-col gap-4 pl-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[13px] text-red-650 font-bold">Delete Account</h4>
                      <p className="text-[11.5px] text-gray-400 font-medium">Permanently delete your profile and wipe out all remote storage.</p>
                    </div>
                    <div className="flex flex-col justify-end">
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => {
                            setDeletePassword('');
                            setDeleteError(null);
                            setShowDeleteConfirm(true);
                          }}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2.5 bg-red-50 p-3.5 rounded border border-red-100 max-w-xs mt-1">
                          <span className="text-[11px] text-red-700 font-semibold leading-normal leading-tight">
                            Are you absolutely sure? This action is immediate and cannot be undone.
                          </span>
                          
                          {user.providerData.some(p => p.providerId === 'password') && (
                            <div className="space-y-1">
                              <label className="text-[10px] text-red-600 font-bold">CONFIRM YOUR PASSWORD:</label>
                              <input
                                id="delete-account-password-input"
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Enter password to confirm"
                                className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 bg-white"
                              />
                            </div>
                          )}
                          
                          {deleteError && (
                            <span className="text-[10px] text-red-650 font-semibold leading-normal block">
                              ⚠️ {deleteError}
                            </span>
                          )}

                          <div className="flex items-center gap-2.5 pt-0.5">
                            <button
                              onClick={async () => {
                                await handleDeleteAccount();
                              }}
                              disabled={isDeleting}
                              className="text-[10px] bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer"
                            >
                              {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeletePassword('');
                                setDeleteError(null);
                              }}
                              className="text-[10px] text-gray-500 hover:text-gray-700 font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
