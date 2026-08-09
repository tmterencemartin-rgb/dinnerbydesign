import React, { useMemo, useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, AccessStatus } from '../../types';
import { ArrowLeft, Search, Download, ExternalLink, CreditCard, Trash2, Users, AlertTriangle, Activity, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../../lib/api';
import { IngredientPriceCatalogueAdmin } from '../admin/IngredientPriceCatalogueAdmin';
import { PUBLISHED_ARTICLES } from '../../content/publicArticles';
import { formatPublicArticleTitle, formatPublicNumber } from '../../content/publicPathways';

type AdminStatusFilter = AccessStatus | 'all' | 'permanent_access' | 'stripe_linked' | 'payment_issue' | 'no_stripe';
type PublishedArticleSort = 'newest' | 'oldest' | 'title' | 'category' | 'topic' | 'reviewed';

interface StripeWebhookHealthEvent {
  eventId: string;
  type: string;
  status: 'processing' | 'succeeded' | 'failed';
  stripeCreatedAt?: Timestamp | null;
  receivedAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  customerId?: string | null;
  userId?: string | null;
  subscriptionId?: string | null;
  invoiceId?: string | null;
  message?: string | null;
  error?: string | null;
}

interface AiUsageEvent {
  id: string;
  type?: 'recipe_search' | 'ready_made_search' | 'weekly_plan' | string;
  source?: string;
  model?: string;
  status?: 'succeeded' | 'failed' | string;
  requestedCount?: number;
  resultCount?: number;
  latencyMs?: number | null;
  totalRoundTripMs?: number | null;
  inputTokensEstimate?: number;
  outputTokensEstimate?: number;
  estimatedCostUsd?: number;
  createdAt?: Timestamp | null;
  dateKey?: string;
}

interface EmailEvent {
  id: string;
  to?: string;
  subject?: string;
  type?: string;
  source?: string;
  status?: 'sent' | 'failed' | 'simulated' | string;
  errorMessage?: string | null;
  createdAt?: Timestamp | null;
}

interface AdminDinnerStats {
  savedCount: number;
  scheduledCount: number;
}

interface AccountReconciliation {
  authenticationIdentities: number;
  registeredIdentities: number;
  anonymousIdentities: number;
  profileDocuments: number;
  registeredWithoutProfile: number;
  anonymousWithoutProfile: number;
  profilesWithoutAuthentication: number;
  anonymousWithoutProfileUids: string[];
  registeredWithoutProfileAccounts: Array<{
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: string | null;
    lastSignInAt: string | null;
    providers: string[];
    disabled: boolean;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { setView, isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<StripeWebhookHealthEvent[]>([]);
  const [emailEvents, setEmailEvents] = useState<EmailEvent[]>([]);
  const [aiUsageEvents, setAiUsageEvents] = useState<AiUsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedArticleQuery, setPublishedArticleQuery] = useState('');
  const [publishedArticleSort, setPublishedArticleSort] = useState<PublishedArticleSort>('newest');
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dinnerStats, setDinnerStats] = useState<Record<string, AdminDinnerStats>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [editingNoteUid, setEditingNoteUid] = useState<string | null>(null);
  const [noteSavingUid, setNoteSavingUid] = useState<string | null>(null);
  const [expandedAccountUids, setExpandedAccountUids] = useState<Record<string, boolean>>({});
  const [accountReconciliation, setAccountReconciliation] = useState<AccountReconciliation | null>(null);
  const [accountReconciliationError, setAccountReconciliationError] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'confirm_access' | 'confirm_delete' | 'confirm_delete_all' | 'alert';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  const visiblePublishedArticles = useMemo(() => {
    const query = publishedArticleQuery.trim().toLowerCase();
    const filtered = PUBLISHED_ARTICLES.filter(article => {
      if (!query) return true;
      return [
        article.title,
        article.category,
        article.pageFamily,
        article.primarySearchIntent,
        article.path,
      ].some(value => value.toLowerCase().includes(query));
    });

    return [...filtered].sort((a, b) => {
      if (publishedArticleSort === 'newest') return b.publishedAt.localeCompare(a.publishedAt);
      if (publishedArticleSort === 'oldest') return a.publishedAt.localeCompare(b.publishedAt);
      if (publishedArticleSort === 'reviewed') return b.reviewedAt.localeCompare(a.reviewedAt);
      if (publishedArticleSort === 'category') return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      if (publishedArticleSort === 'topic') return a.primarySearchIntent.localeCompare(b.primarySearchIntent) || a.title.localeCompare(b.title);
      return formatPublicArticleTitle(a.title).localeCompare(formatPublicArticleTitle(b.title));
    });
  }, [publishedArticleQuery, publishedArticleSort]);

  const showCustomAlert = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'alert',
      title,
      message
    });
  };

  const showCustomConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModal({
      isOpen: true,
      type: 'confirm_delete',
      title,
      message,
      onConfirm
    });
  };

  const showAccessConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModal({
      isOpen: true,
      type: 'confirm_access',
      title,
      message,
      onConfirm
    });
  };

  const escapeHtml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const getFirstName = (targetUser: UserProfile) => {
    const rawName = targetUser.firstName || targetUser.displayName || targetUser.email?.split('@')[0] || 'there';
    const firstName = rawName.trim().split(/\s+/)[0] || 'there';
    return firstName.includes('@') ? firstName.split('@')[0] : firstName;
  };

  const sendPermanentAccessEmail = async (targetUser: UserProfile) => {
    if (!targetUser.email) {
      throw new Error('This account does not have an email address.');
    }

    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dinnerbydesign.app';
    const firstName = escapeHtml(getFirstName(targetUser));
    const safeAppUrl = escapeHtml(appUrl);

    const html = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <div style="border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px;">
    <h2 style="color: #111; margin: 0; font-size: 20px;">DinnerByDesign</h2>
  </div>

  <p>Hello ${firstName},</p>

  <p>Your DinnerByDesign account now has permanent access.</p>

  <p>Use the app without a subscription &mdash; indefinitely. Please try it in your everyday dinner planning and let me know what works for you and what doesn't.</p>

  <p>Sign in: <a href="${safeAppUrl}" style="color: #111; text-decoration: underline; font-weight: 600;">${safeAppUrl}</a></p>

  <p style="margin-top: 24px; margin-bottom: 2px;">Best,</p>
  <p style="margin: 0;">Terry (Executive chef at DinnerByDesign)</p>
</div>
    `.trim();

    const response = await fetch(getApiUrl('/api/send-email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetUser.email,
        subject: 'Your DinnerByDesign access is now permanent',
        html,
        from: 'DinnerByDesign <terence@dinnerbydesign.app>',
        type: 'permanent_access_granted',
        source: 'admin_dashboard',
        userId: targetUser.uid
      })
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error?.message || result?.message || 'The email service did not confirm delivery.');
    }
  };

  const refreshAccountReconciliation = React.useCallback(async () => {
    if (!currentUser) {
      setAccountReconciliation(null);
      setAccountReconciliationError('Sign in as an administrator to compare account records.');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(getApiUrl('/api/admin/accounts/reconciliation'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok || !result?.summary) {
        throw new Error(result?.error || 'Account reconciliation is unavailable.');
      }
      setAccountReconciliation(result.summary as AccountReconciliation);
      setAccountReconciliationError(null);
    } catch (error: any) {
      console.error('Account reconciliation failed:', error);
      setAccountReconciliation(null);
      setAccountReconciliationError(error?.message || 'Account reconciliation is unavailable.');
    }
  }, [currentUser]);

  const deleteCompleteAccount = React.useCallback(async (userId: string) => {
    if (!currentUser) {
      throw new Error('Sign in as an administrator to delete an account.');
    }

    const token = await currentUser.getIdToken();
    const response = await fetch(getApiUrl(`/api/admin/accounts/${encodeURIComponent(userId)}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error || 'The complete account could not be deleted.');
    }
    return result;
  }, [currentUser]);

  const cleanupProfilelessIdentities = React.useCallback(async (
    category: 'registered_without_profile' | 'anonymous_without_profile',
    uids: string[],
  ) => {
    if (!currentUser) {
      throw new Error('Sign in as an administrator to clean up account identities.');
    }

    const token = await currentUser.getIdToken();
    const response = await fetch(getApiUrl('/api/admin/accounts/cleanup'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, uids }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error || 'The reviewed account identities could not be deleted.');
    }
    return result as { deletedCount: number };
  }, [currentUser]);

  useEffect(() => {
    if (!isAdmin) {
      setView('home');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const usersQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        const userData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        })) as UserProfile[];

        // Sort client-side to prevent missing 'createdAt' field or type mismatch from hiding any users
        userData.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt as any) : new Date(0));
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt as any) : new Date(0));
          return dateB.getTime() - dateA.getTime();
        });

        setUsers(userData);
        setNoteDrafts(Object.fromEntries(userData.map(user => [user.uid, user.adminNote || ''])));
        await refreshAccountReconciliation();

        const statsEntries = await Promise.all(userData.map(async user => {
          try {
            const savedSnapshot = await getDocs(collection(db, 'users', user.uid, 'savedRecipes'));
            let scheduledCount = 0;
            savedSnapshot.docs.forEach(savedDoc => {
              if (savedDoc.data()?.scheduledDate) scheduledCount += 1;
            });
            return [user.uid, {
              savedCount: savedSnapshot.size,
              scheduledCount
            }] as const;
          } catch (err) {
            console.warn(`Could not load saved dinner stats for ${user.uid}`, err);
            return [user.uid, {
              savedCount: 0,
              scheduledCount: 0
            }] as const;
          }
        }));
        setDinnerStats(Object.fromEntries(statsEntries));

        const webhookSnapshot = await getDocs(collection(db, 'stripeWebhookEvents'));
        const eventData = webhookSnapshot.docs.map(doc => ({
          ...doc.data(),
          eventId: doc.id
        })) as StripeWebhookHealthEvent[];

        eventData.sort((a, b) => {
          const dateA = toDate(a.updatedAt || a.receivedAt || a.stripeCreatedAt) || new Date(0);
          const dateB = toDate(b.updatedAt || b.receivedAt || b.stripeCreatedAt) || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setWebhookEvents(eventData.slice(0, 12));

        const emailSnapshot = await getDocs(collection(db, 'emailEvents'));
        const emailData = emailSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as EmailEvent[];

        emailData.sort((a, b) => {
          const dateA = toDate(a.createdAt) || new Date(0);
          const dateB = toDate(b.createdAt) || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setEmailEvents(emailData.slice(0, 30));

        const usageSnapshot = await getDocs(collection(db, 'aiUsageEvents'));
        const usageData = usageSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as AiUsageEvent[];

        usageData.sort((a, b) => {
          const dateA = toDate(a.createdAt) || new Date(0);
          const dateB = toDate(b.createdAt) || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setAiUsageEvents(usageData.slice(0, 500));
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, refreshAccountReconciliation, setView]);

  const handleDeleteUser = (userId: string, email: string) => {
    if (userId === currentUser?.uid || email === 'tmterencemartin@gmail.com') {
      showCustomAlert(
        "Action Blocked",
        "For safety and security reasons, you cannot delete your own administrative account."
      );
      return;
    }

    showCustomConfirm(
      "Confirm Complete Account Deletion",
      `Are you absolutely sure you want to permanently delete the account for "${email || userId}"?\n\nThis removes the sign-in identity, profile, saved recipes, preferences and shopping data. This action is irreversible.`,
      async () => {
        setActionLoading(userId);
        try {
          await deleteCompleteAccount(userId);
          setUsers(prev => prev.filter(u => u.uid !== userId));
          setDinnerStats(prev => {
            const next = { ...prev };
            delete next[userId];
            return next;
          });
          await refreshAccountReconciliation();
          showCustomAlert("Success", `Account "${email || userId}" deleted successfully.`);
        } catch (err: any) {
          console.error("Error deleting account:", err);
          showCustomAlert("Error", `Failed to delete account: ${err?.message || 'Access denied'}`);
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  const handleCleanupProfilelessRegisteredAccounts = () => {
    const accounts = accountReconciliation?.registeredWithoutProfileAccounts || [];
    if (accounts.length === 0) {
      showCustomAlert('No Accounts to Remove', 'There are no registered sign-ins without profiles.');
      return;
    }

    showCustomConfirm(
      'Delete Reviewed Test Sign-ins?',
      `This permanently deletes the ${accounts.length} registered sign-ins currently listed without profiles. The action will stop if any listed identity has acquired a profile.\n\nThis cannot be undone.`,
      async () => {
        setActionLoading('cleanup-registered');
        try {
          const result = await cleanupProfilelessIdentities(
            'registered_without_profile',
            accounts.map(account => account.uid),
          );
          await refreshAccountReconciliation();
          showCustomAlert('Cleanup Complete', `${result.deletedCount} registered test sign-ins were deleted.`);
        } catch (error: any) {
          await refreshAccountReconciliation();
          showCustomAlert('Cleanup Stopped', error?.message || 'The registered sign-ins could not be deleted.');
        } finally {
          setActionLoading(null);
        }
      },
    );
  };

  const handleCleanupAnonymousAccounts = () => {
    const uids = accountReconciliation?.anonymousWithoutProfileUids || [];
    if (uids.length === 0) {
      showCustomAlert('No Identities to Remove', 'There are no anonymous identities without profiles.');
      return;
    }

    showCustomConfirm(
      'Delete Anonymous Identities?',
      `This permanently deletes the ${uids.length} anonymous identities currently shown without profiles. Registered accounts and identities with profiles are excluded.\n\nOld anonymous browser sessions will return to the ordinary signed-out guest state. This cannot be undone.`,
      async () => {
        setActionLoading('cleanup-anonymous');
        try {
          const result = await cleanupProfilelessIdentities('anonymous_without_profile', uids);
          await refreshAccountReconciliation();
          showCustomAlert('Cleanup Complete', `${result.deletedCount} anonymous identities were deleted.`);
        } catch (error: any) {
          await refreshAccountReconciliation();
          showCustomAlert('Cleanup Stopped', error?.message || 'The anonymous identities could not be deleted.');
        } finally {
          setActionLoading(null);
        }
      },
    );
  };

  const handleDeleteAllUsers = () => {
    const listToDelete = users.filter(u => u.uid !== currentUser?.uid && u.email !== 'tmterencemartin@gmail.com');
    if (listToDelete.length === 0) {
      showCustomAlert(
        "No Accounts to Delete",
        "There are no other app profiles in the register to delete."
      );
      return;
    }

    setModal({
      isOpen: true,
      type: 'confirm_delete_all',
      title: "Delete All Listed Accounts?",
      message: `This will permanently delete all ${listToDelete.length} other accounts listed in the app-profile register, including their sign-in identities, profiles and stored app data.\n\nYour own administrative account will be excluded. Authentication identities without profiles are not included.\n\nAre you absolutely sure you want to proceed? This cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        let deletedCount = 0;
        let failedCount = 0;

        for (const u of listToDelete) {
          try {
            await deleteCompleteAccount(u.uid);
            deletedCount++;
          } catch (err) {
            console.error(`Error deleting account ${u.uid}:`, err);
            failedCount++;
          }
        }

        // Re-fetch remaining users
        try {
          const q = query(collection(db, 'users'));
          const querySnapshot = await getDocs(q);
          const userData = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
          })) as UserProfile[];

          userData.sort((a, b) => {
            const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt as any) : new Date(0));
            const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt as any) : new Date(0));
            return dateB.getTime() - dateA.getTime();
          });

          setUsers(userData);
          await refreshAccountReconciliation();
        } catch (err) {
          console.error('Error re-fetching users:', err);
        } finally {
          setLoading(false);
        }

        if (failedCount > 0) {
          showCustomAlert(
            "Bulk Deletion Completed",
            `Successfully deleted ${deletedCount} accounts. Failed to delete ${failedCount} accounts.`
          );
        } else {
          showCustomAlert(
            "Bulk Deletion Successful",
            `Successfully deleted all ${deletedCount} other accounts.`
          );
        }
      }
    });
  };

  const paymentIssueStatuses = ['past_due', 'unpaid', 'incomplete', 'paused'];

  const getAccessStatus = (user: UserProfile): AccessStatus => {
    if (user.permanentAccess) return 'paid';
    return user.subscription?.accessStatus || user.accessStatus || 'trial';
  };

  const getAccessLabel = (user: UserProfile) => {
    if (user.permanentAccess) return 'Permanent';
    switch (getAccessStatus(user)) {
      case 'paid': return 'Paid';
      case 'read_only': return 'Read only';
      default: return 'Trial';
    }
  };

  const handleTogglePermanentAccess = (targetUser: UserProfile) => {
    const nextValue = !targetUser.permanentAccess;
    const action = nextValue ? 'grant' : 'revoke';

    showAccessConfirm(
      `${nextValue ? 'Grant' : 'Revoke'} Permanent Access`,
      `This will ${action} permanent full access for "${targetUser.email || targetUser.uid}".\n\nThis is separate from Stripe and will remain active until you revoke it here.`,
      async () => {
        setActionLoading(targetUser.uid);
        try {
          await updateDoc(doc(db, 'users', targetUser.uid), {
            permanentAccess: nextValue,
            permanentAccessGrantedAt: nextValue ? serverTimestamp() : null,
            permanentAccessGrantedBy: nextValue ? currentUser?.email || currentUser?.uid || null : null,
            permanentAccessEmailSent: nextValue ? false : null,
            permanentAccessEmailSentAt: nextValue ? null : null,
            permanentAccessEmailError: nextValue ? null : null,
            updatedAt: serverTimestamp()
          });
          setUsers(prev => prev.map(user => (
            user.uid === targetUser.uid
              ? {
                  ...user,
                  permanentAccess: nextValue,
                  permanentAccessGrantedAt: nextValue ? Timestamp.now() : undefined,
                  permanentAccessGrantedBy: nextValue ? currentUser?.email || currentUser?.uid || null : null,
                  permanentAccessEmailSent: nextValue ? false : undefined,
                  permanentAccessEmailSentAt: undefined,
                  permanentAccessEmailError: undefined
                }
              : user
          )));

          let emailSent = false;
          let emailError = '';
          if (nextValue) {
            try {
              await sendPermanentAccessEmail(targetUser);
              emailSent = true;
              await updateDoc(doc(db, 'users', targetUser.uid), {
                permanentAccessEmailSent: true,
                permanentAccessEmailSentAt: serverTimestamp(),
                permanentAccessEmailError: null,
                updatedAt: serverTimestamp()
              });
              setUsers(prev => prev.map(user => (
                user.uid === targetUser.uid
                  ? {
                      ...user,
                      permanentAccessEmailSent: true,
                      permanentAccessEmailSentAt: Timestamp.now(),
                      permanentAccessEmailError: null
                    }
                  : user
              )));
            } catch (err: any) {
              emailError = err?.message || 'Email delivery failed.';
              console.error('Permanent access email failed:', err);
              await updateDoc(doc(db, 'users', targetUser.uid), {
                permanentAccessEmailSent: false,
                permanentAccessEmailSentAt: null,
                permanentAccessEmailError: emailError,
                updatedAt: serverTimestamp()
              });
              setUsers(prev => prev.map(user => (
                user.uid === targetUser.uid
                  ? {
                      ...user,
                      permanentAccessEmailSent: false,
                      permanentAccessEmailSentAt: null,
                      permanentAccessEmailError: emailError
                    }
                  : user
              )));
            }
          }

          showCustomAlert(
            'Access Updated',
            nextValue
              ? `Permanent access has been granted to "${targetUser.email || targetUser.uid}".${emailSent ? '\n\nEmail sent.' : `\n\nEmail not sent: ${emailError}`}`
              : `Permanent access has been revoked for "${targetUser.email || targetUser.uid}".`
          );
        } catch (err: any) {
          console.error('Error updating permanent access:', err);
          showCustomAlert('Error', `Failed to update access: ${err?.message || 'Access denied'}`);
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  const handleSaveAdminNote = async (targetUser: UserProfile) => {
    const note = (noteDrafts[targetUser.uid] || '').trim();
    setNoteSavingUid(targetUser.uid);
    try {
      await updateDoc(doc(db, 'users', targetUser.uid), {
        adminNote: note,
        updatedAt: serverTimestamp()
      });
      setUsers(prev => prev.map(user => (
        user.uid === targetUser.uid ? { ...user, adminNote: note } : user
      )));
      setEditingNoteUid(null);
    } catch (err: any) {
      console.error('Error saving admin note:', err);
      showCustomAlert('Error', `Failed to save note: ${err?.message || 'Access denied'}`);
    } finally {
      setNoteSavingUid(null);
    }
  };

  const getSearchCount = (user: UserProfile) => {
    const combined = user.searchHistory?.length || 0;
    const cook = user.searchHistoryCook?.length || 0;
    const readyMade = user.searchHistoryReadyMade?.length || 0;
    return combined + cook + readyMade;
  };

  const hasPaymentIssue = (user: UserProfile) => {
    const status = user.subscription?.subscriptionStatus;
    return !!status && paymentIssueStatuses.includes(status);
  };

  const filteredUsers = users.filter(user => {
    const email = user.email || '';
    const displayName = user.displayName || '';
    const matchesSearch = 
      email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uid.includes(searchTerm);
    
    const status = getAccessStatus(user);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'permanent_access' && !!user.permanentAccess) ||
      status === statusFilter ||
      (statusFilter === 'stripe_linked' && !!user.subscription?.stripeCustomerId) ||
      (statusFilter === 'payment_issue' && hasPaymentIssue(user)) ||
      (statusFilter === 'no_stripe' && !user.subscription?.stripeCustomerId);

    return matchesSearch && matchesStatus;
  });

  const toDate = (date: any): Date | null => {
    if (!date) return null;
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (date: any) => {
    const d = toDate(date);
    if (!d) return 'N/A';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (date: any) => {
    const d = toDate(date);
    if (!d) return 'N/A';
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatShortId = (id?: string | null) => id ? `${id.substring(0, 16)}...` : 'N/A';

  const formatCurrency = (value: number, currency: 'GBP' | 'USD' = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: value < 1 ? 2 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };

  const escapeCsv = (value: any) => {
    const raw = value == null ? '' : String(value);
    const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Name',
      'Email',
      'UID',
      'Access status',
      'Permanent access',
      'Permanent access granted',
      'Permanent access granted by',
      'Permanent access email sent',
      'Permanent access email sent at',
      'Permanent access email error',
      'Stripe status',
      'Stripe customer ID',
      'Stripe subscription ID',
      'Joined',
      'Trial end',
      'Subscription created',
      'Current period start',
      'Current period end',
      'Payment grace ends',
      'Welcome email sent',
      'Subscription email sent',
      'Search count',
      'Saved count',
      'Scheduled count',
      'Admin note'
    ];

    const rows = filteredUsers.map(user => {
      const subscription = user.subscription;
      const stats = dinnerStats[user.uid] || { savedCount: 0, scheduledCount: 0 };
      return [
        user.displayName || '',
        user.email || '',
        user.uid,
        getAccessStatus(user),
        user.permanentAccess ? 'yes' : 'no',
        formatDate(user.permanentAccessGrantedAt),
        user.permanentAccessGrantedBy || '',
        user.permanentAccessEmailSent ? 'yes' : 'no',
        formatDate(user.permanentAccessEmailSentAt),
        user.permanentAccessEmailError || '',
        subscription?.subscriptionStatus || '',
        subscription?.stripeCustomerId || '',
        subscription?.stripeSubscriptionId || '',
        formatDate(user.createdAt),
        formatDate(getTrialEndDate(user)),
        formatDate(getSubscriptionStartDate(user)),
        formatDate(subscription?.currentPeriodStart),
        formatDate(subscription?.currentPeriodEnd),
        formatDate(user.subscriptionPaymentGraceEndsAt),
        user.welcomeEmailSent ? 'yes' : 'no',
        user.subscriptionConfirmationEmailSent ? 'yes' : 'no',
        getSearchCount(user),
        stats.savedCount,
        stats.scheduledCount,
        user.adminNote || ''
      ];
    });

    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dinnerbydesign-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTrialEndDate = (user: UserProfile) => {
    if (user.subscription?.trialEnd) return user.subscription.trialEnd;
    const trialStart = toDate(user.trialStartedAt || user.createdAt);
    if (!trialStart) return null;
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 7);
    return trialEnd;
  };

  const getPeriodLabel = (user: UserProfile) => {
    const status = user.subscription?.subscriptionStatus;
    if (status === 'canceled' || status === 'unpaid' || status === 'paused') return 'Ends';
    return 'Renews';
  };

  const getSubscriptionStartDate = (user: UserProfile) => {
    return user.subscription?.subscriptionCreatedAt || user.subscription?.currentPeriodStart || null;
  };

  const getStatusBadge = (user: UserProfile) => {
    const status = getAccessStatus(user);
    const subStatus = user.subscription?.subscriptionStatus;

    if (user.permanentAccess) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-tight">
          <ShieldCheck className="w-3 h-3" />
          Permanent
        </span>
      );
    }

    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-tight">
            Paid {subStatus && <span className="ml-1 opacity-70 font-normal">({subStatus})</span>}
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase tracking-tight">
            Trial
          </span>
        );
      case 'read_only':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 uppercase tracking-tight">
            Read Only
          </span>
        );
      default:
        return null;
    }
  };

  const summaryStats = React.useMemo(() => {
    const paid = users.filter(user => getAccessStatus(user) === 'paid').length;
    const permanentAccess = users.filter(user => !!user.permanentAccess).length;
    const trial = users.filter(user => getAccessStatus(user) === 'trial').length;
    const readOnly = users.filter(user => getAccessStatus(user) === 'read_only').length;
    const stripeLinked = users.filter(user => !!user.subscription?.stripeCustomerId).length;
    const paymentIssues = users.filter(hasPaymentIssue).length;
    const subscriptionEmails = users.filter(user => !!user.subscriptionConfirmationEmailSent).length;
    const totalSearches = users.reduce((sum, user) => sum + getSearchCount(user), 0);
    const succeededAiCalls = aiUsageEvents.filter(event => event.status === 'succeeded');
    const failedAiCalls = aiUsageEvents.filter(event => event.status === 'failed');
    const estimatedAiCostUsd = aiUsageEvents.reduce((sum, event) => sum + (event.estimatedCostUsd || 0), 0);
    const estimatedAiCostGbp = estimatedAiCostUsd * 0.79;
    const weeklyPlanCalls = aiUsageEvents.filter(event => event.type === 'weekly_plan').length;
    const recipeSearchCalls = aiUsageEvents.filter(event => event.type === 'recipe_search').length;
    const readyMadeCalls = aiUsageEvents.filter(event => event.type === 'ready_made_search').length;
    const averageLatencyMs = succeededAiCalls.length
      ? Math.round(succeededAiCalls.reduce((sum, event) => sum + (event.latencyMs || 0), 0) / succeededAiCalls.length)
      : 0;
    const estimatedGrossRevenue = paid * 2.99;
    const estimatedStripeFees = paid * ((2.99 * 0.015) + 0.2);
    const estimatedNetAfterStripeAndAi = estimatedGrossRevenue - estimatedStripeFees - estimatedAiCostGbp;

    return {
      total: users.length,
      paid,
      permanentAccess,
      trial,
      readOnly,
      stripeLinked,
      paymentIssues,
      subscriptionEmails,
      totalSearches,
      aiCalls: aiUsageEvents.length,
      succeededAiCalls: succeededAiCalls.length,
      failedAiCalls: failedAiCalls.length,
      estimatedAiCostUsd,
      estimatedAiCostGbp,
      weeklyPlanCalls,
      recipeSearchCalls,
      readyMadeCalls,
      averageLatencyMs,
      estimatedGrossRevenue,
      estimatedStripeFees,
      estimatedNetAfterStripeAndAi
    };
  }, [users, aiUsageEvents]);

  const latestWebhookEvent = webhookEvents[0];
  const latestEmailEvent = emailEvents[0];

  const getWebhookStatusClass = (status?: StripeWebhookHealthEvent['status']) => {
    if (status === 'succeeded') return 'bg-emerald-50 text-emerald-700';
    if (status === 'failed') return 'bg-red-50 text-red-700';
    return 'bg-amber-50 text-amber-700';
  };

  const getEmailStatusClass = (status?: EmailEvent['status']) => {
    if (status === 'sent') return 'bg-emerald-50 text-emerald-700';
    if (status === 'failed') return 'bg-red-50 text-red-700';
    return 'bg-amber-50 text-amber-700';
  };

  if (!isAdmin) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50/70"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 py-4">
        <div className="w-full flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-center gap-3 xl:min-w-[210px]">
            <button 
              onClick={() => setView('settings')}
              className="shrink-0 p-1.5 hover:bg-gray-100 rounded transition-colors"
              aria-label="Back to settings"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Admin dashboard</h1>
            </div>
          </div>
          
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 xl:flex-1 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 focus:border-dbd-accent"
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 items-stretch gap-1.5 sm:grid-cols-2 md:grid-cols-[minmax(140px,1fr)_auto_auto] md:items-center md:gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 w-full min-w-0 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 bg-white sm:h-10 sm:px-3 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="permanent_access">Permanent Access</option>
                <option value="trial">Trial</option>
                <option value="read_only">Read Only</option>
                <option value="stripe_linked">Stripe Linked</option>
                <option value="payment_issue">Payment Issues</option>
                <option value="no_stripe">No Stripe Customer</option>
              </select>

              <button
                onClick={handleExportCsv}
                disabled={loading || filteredUsers.length === 0}
                className="h-9 w-full px-2 text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-colors inline-flex items-center justify-center gap-1 uppercase tracking-wider whitespace-nowrap disabled:opacity-50 sm:px-3 sm:text-xs sm:gap-1.5 md:w-auto md:px-2 md:text-[11px] md:gap-1"
                title="Export the current filtered subscriber list"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                onClick={handleDeleteAllUsers}
                disabled={loading || actionLoading !== null}
                className="h-9 w-full px-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors inline-flex items-center justify-center gap-1 uppercase tracking-wider whitespace-nowrap disabled:opacity-50 sm:col-span-2 sm:px-3 sm:text-xs sm:gap-1.5 md:col-auto md:w-auto"
                title="Delete all other accounts listed in the app-profile register"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete All Listed Accounts
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-5 sm:py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dbd-accent"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <IngredientPriceCatalogueAdmin />
            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5" aria-labelledby="published-articles-heading">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-dbd-accent">Editorial content</p>
                  <h2 id="published-articles-heading" className="mt-1 text-base font-bold text-gray-950">Published articles</h2>
                  <p className="mt-1 text-xs font-medium text-gray-500">Open every public editorial page from one place.</p>
                </div>
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">{formatPublicNumber(PUBLISHED_ARTICLES.length)} live</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <label htmlFor="published-article-search" className="sr-only">Search published articles by ingredient or topic</label>
                  <input
                    id="published-article-search"
                    type="search"
                    value={publishedArticleQuery}
                    onChange={event => setPublishedArticleQuery(event.target.value)}
                    placeholder="Search by ingredient or topic"
                    className="h-9 w-full rounded border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-dbd-accent/50 focus:ring-2 focus:ring-dbd-accent/10"
                  />
                </div>
                <label className="flex h-9 shrink-0 items-center gap-2 rounded border border-gray-200 bg-white px-2.5 text-xs text-gray-500">
                  <span>Sort by</span>
                  <select
                    value={publishedArticleSort}
                    onChange={event => setPublishedArticleSort(event.target.value as PublishedArticleSort)}
                    aria-label="Sort published articles"
                    className="bg-transparent font-semibold text-gray-800 outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A to Z</option>
                    <option value="category">Category</option>
                    <option value="topic">Ingredient or topic</option>
                    <option value="reviewed">Last reviewed</option>
                  </select>
                </label>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Showing {visiblePublishedArticles.length} of {PUBLISHED_ARTICLES.length} published articles
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {visiblePublishedArticles.map(article => (
                  <a
                    key={article.path}
                    href={article.path}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-14 items-center justify-between gap-3 rounded border border-gray-200 bg-gray-50/60 px-3 py-2.5 transition-colors hover:border-dbd-accent/30 hover:bg-white"
                  >
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold text-gray-500">{article.category}</span>
                      <span className="mt-0.5 block text-xs font-bold leading-4 text-gray-800 group-hover:text-dbd-accent">{formatPublicArticleTitle(article.title)}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-dbd-accent" aria-hidden="true" />
                  </a>
                ))}
              </div>
              {visiblePublishedArticles.length === 0 && (
                <p className="mt-3 rounded border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-500">
                  No published articles match that ingredient or topic.
                </p>
              )}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5" aria-labelledby="account-overview-heading">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Accounts</p>
                <h2 id="account-overview-heading" className="mt-1 text-base font-bold text-gray-950">Account overview</h2>
                <p className="mt-1 text-xs font-medium text-gray-500">Stored app profiles, access, payment and usage totals.</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { label: 'App profiles', value: summaryStats.total, detail: `${summaryStats.trial} trial / ${summaryStats.readOnly} read only`, icon: Users },
                { label: 'Paid access', value: summaryStats.paid, detail: `${summaryStats.stripeLinked} Stripe / ${summaryStats.permanentAccess} permanent`, icon: CreditCard },
                { label: 'Payment issues', value: summaryStats.paymentIssues, detail: 'Past due, unpaid, incomplete or paused', icon: AlertTriangle },
                { label: 'Usage', value: summaryStats.aiCalls || summaryStats.totalSearches, detail: `${summaryStats.succeededAiCalls} model calls succeeded`, icon: Activity }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded border border-gray-200 bg-gray-50/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                        <p className="text-xl font-bold text-gray-950 mt-0.5">{item.value}</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">{item.detail}</p>
                      </div>
                      <div className="w-7 h-7 rounded bg-gray-50 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {accountReconciliation ? (
                <div className="mt-3 rounded border border-gray-200 bg-gray-50/60 p-3" aria-label="Account reconciliation">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[13px] font-bold text-gray-950">Authentication reconciliation</h3>
                      <p className="text-[11px] font-medium text-gray-500">Compares Firebase sign-in identities with stored DinnerByDesign profiles.</p>
                    </div>
                    <span className={`w-fit rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${
                      accountReconciliation.registeredWithoutProfile === 0 && accountReconciliation.profilesWithoutAuthentication === 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {accountReconciliation.registeredWithoutProfile === 0 && accountReconciliation.profilesWithoutAuthentication === 0
                        ? 'Aligned'
                        : 'Review needed'}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                    <div className="rounded border border-gray-200 bg-white p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Registered sign-ins</p>
                      <p className="mt-0.5 text-lg font-bold text-gray-950">{accountReconciliation.registeredIdentities}</p>
                      <p className="text-[10.5px] font-medium text-gray-500">{accountReconciliation.registeredWithoutProfile} without a profile</p>
                    </div>
                    <div className="rounded border border-gray-200 bg-white p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Anonymous identities</p>
                      <p className="mt-0.5 text-lg font-bold text-gray-950">{accountReconciliation.anonymousIdentities}</p>
                      <p className="text-[10.5px] font-medium text-gray-500">{accountReconciliation.anonymousWithoutProfile} without a profile</p>
                      {accountReconciliation.anonymousWithoutProfileUids.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCleanupAnonymousAccounts}
                          disabled={actionLoading !== null}
                          className="mt-2 text-[10px] font-bold uppercase tracking-wide text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {actionLoading === 'cleanup-anonymous' ? 'Removing…' : 'Remove reviewed identities'}
                        </button>
                      )}
                    </div>
                    <div className="rounded border border-gray-200 bg-white p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">App profiles</p>
                      <p className="mt-0.5 text-lg font-bold text-gray-950">{accountReconciliation.profileDocuments}</p>
                      <p className="text-[10.5px] font-medium text-gray-500">{accountReconciliation.profilesWithoutAuthentication} without a sign-in</p>
                    </div>
                    <div className="rounded border border-gray-200 bg-white p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">All identities</p>
                      <p className="mt-0.5 text-lg font-bold text-gray-950">{accountReconciliation.authenticationIdentities}</p>
                      <p className="text-[10.5px] font-medium text-gray-500">Registered and anonymous</p>
                    </div>
                  </div>
                  {accountReconciliation.registeredWithoutProfileAccounts.length > 0 && (
                    <div className="mt-3 overflow-hidden rounded border border-amber-200 bg-white">
                      <div className="border-b border-amber-100 bg-amber-50/70 px-3 py-2.5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-[12px] font-bold text-amber-900">Registered accounts without profiles</h4>
                            <p className="mt-0.5 text-[10.5px] font-medium text-amber-800">
                              Review these individually. No account is repaired or deleted automatically.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCleanupProfilelessRegisteredAccounts}
                            disabled={actionLoading !== null}
                            className="w-fit shrink-0 rounded border border-red-200 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {actionLoading === 'cleanup-registered' ? 'Removing…' : 'Remove reviewed test sign-ins'}
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {accountReconciliation.registeredWithoutProfileAccounts.map(account => (
                          <div key={account.uid} className="px-3 py-2.5">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                              <div className="min-w-0">
                                <p className="truncate text-[12px] font-bold text-gray-900">
                                  {account.email || account.displayName || 'Registered account'}
                                </p>
                                {account.displayName && account.email && (
                                  <p className="mt-0.5 text-[10.5px] font-medium text-gray-500">{account.displayName}</p>
                                )}
                              </div>
                              <div className="shrink-0 text-[10.5px] font-medium text-gray-500 sm:text-right">
                                <p>Created {formatDateTime(account.createdAt)}</p>
                                <p>
                                  {account.lastSignInAt
                                    ? `Last sign-in ${formatDateTime(account.lastSignInAt)}`
                                    : 'No recorded sign-in'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-gray-400">
                              <span>{account.providers.length > 0 ? account.providers.join(', ') : 'Email or phone sign-in'}</span>
                              {account.disabled && <span className="font-bold text-red-600">Disabled</span>}
                              <span className="font-mono">UID {account.uid}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : accountReconciliationError ? (
                <div className="mt-3 rounded border border-amber-200 bg-amber-50/60 p-3">
                  <p className="text-[12px] font-bold text-amber-800">Authentication reconciliation unavailable</p>
                  <p className="mt-1 text-[11px] font-medium text-amber-700">{accountReconciliationError}</p>
                </div>
              ) : null}
            </section>

            <section className="order-2 rounded-lg border border-gray-200 bg-white p-4 shadow-xs sm:p-5" aria-labelledby="operations-heading">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Service health</p>
                <h2 id="operations-heading" className="mt-1 text-base font-bold text-gray-950">Operations and delivery</h2>
                <p className="mt-1 text-xs font-medium text-gray-500">Monitor AI costs, Stripe events and customer email delivery.</p>
              </div>
              <div className="mt-4 space-y-3">
            <div className="rounded border border-gray-200 bg-gray-50/40 p-3">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <h2 className="text-[13px] font-bold text-gray-950">Launch cost monitor</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-500">
                      Estimate
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight text-gray-400 font-medium max-w-2xl">
                    Tracks server-side Gemini calls from the point this monitor was added. Token and cost figures are estimates based on prompt and response size.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 w-full lg:max-w-4xl">
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gemini cost</p>
                    <p className="text-lg font-bold text-gray-950 mt-0.5">{formatCurrency(summaryStats.estimatedAiCostGbp)}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">{formatCurrency(summaryStats.estimatedAiCostUsd, 'USD')} est.</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Model calls</p>
                    <p className="text-lg font-bold text-gray-950 mt-0.5">{summaryStats.aiCalls}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">{summaryStats.failedAiCalls} failed</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Call mix</p>
                    <p className="text-lg font-bold text-gray-950 mt-0.5">{summaryStats.recipeSearchCalls}/{summaryStats.readyMadeCalls}/{summaryStats.weeklyPlanCalls}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">Recipe / ready-made / weekly</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Net snapshot</p>
                    <p className="text-lg font-bold text-gray-950 mt-0.5">{formatCurrency(summaryStats.estimatedNetAfterStripeAndAi)}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">After Stripe + Gemini est.</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-gray-500">
                <div className="border-t border-gray-100 pt-1">
                  <span className="font-bold text-gray-700">Gross subscription value:</span> {formatCurrency(summaryStats.estimatedGrossRevenue)}
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <span className="font-bold text-gray-700">Stripe fees estimate:</span> {formatCurrency(summaryStats.estimatedStripeFees)}
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <span className="font-bold text-gray-700">Average Gemini time:</span> {summaryStats.averageLatencyMs ? `${(summaryStats.averageLatencyMs / 1000).toFixed(1)}s` : 'N/A'}
                </div>
              </div>
            </div>

            {webhookEvents.length > 0 ? (
              <div className="rounded border border-gray-200 bg-gray-50/40 p-3">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <h2 className="text-[13px] font-bold text-gray-950">Stripe webhook health</h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getWebhookStatusClass(latestWebhookEvent.status)}`}>
                        {latestWebhookEvent.status}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-gray-400 font-medium">
                      {latestWebhookEvent.type} · {formatDateTime(latestWebhookEvent.updatedAt || latestWebhookEvent.receivedAt || latestWebhookEvent.stripeCreatedAt)}
                    </p>
                    {latestWebhookEvent?.message && (
                      <p className="text-[11.5px] text-gray-600 font-semibold">{latestWebhookEvent.message}</p>
                    )}
                    {latestWebhookEvent?.error && (
                      <p className="text-[11.5px] text-red-600 font-semibold">{latestWebhookEvent.error}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-w-0 lg:max-w-3xl">
                    {webhookEvents.slice(0, 6).map(event => (
                      <div key={event.eventId} className="border border-gray-100 rounded p-2.5 bg-gray-50/40 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10.5px] font-bold text-gray-800 truncate">{event.type}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getWebhookStatusClass(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-1 truncate">{event.eventId}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">
                          {formatDateTime(event.updatedAt || event.receivedAt || event.stripeCreatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50/40 p-3">
                <Activity className="w-3.5 h-3.5 text-gray-500" />
                <h2 className="text-[13px] font-bold text-gray-950">Stripe webhook health</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-500">
                  No events yet
                </span>
              </div>
            )}

            {emailEvents.length > 0 ? (
              <div className="rounded border border-gray-200 bg-gray-50/40 p-3">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <h2 className="text-[13px] font-bold text-gray-950">Email log</h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getEmailStatusClass(latestEmailEvent.status)}`}>
                        {latestEmailEvent.status}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-gray-400 font-medium">
                      {latestEmailEvent.type || latestEmailEvent.subject || 'Email'} · {formatDateTime(latestEmailEvent.createdAt)}
                    </p>
                    {latestEmailEvent?.errorMessage && (
                      <p className="text-[11.5px] text-red-600 font-semibold">{latestEmailEvent.errorMessage}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-w-0 lg:max-w-3xl">
                    {emailEvents.slice(0, 6).map(event => (
                      <div key={event.id} className="border border-gray-100 rounded p-2.5 bg-gray-50/40 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10.5px] font-bold text-gray-800 truncate">{event.type || event.subject || 'Email'}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getEmailStatusClass(event.status)}`}>
                            {event.status || 'unknown'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-1 truncate">{event.to || 'No recipient'}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 truncate">
                          {event.subject || 'No subject'} · {formatDateTime(event.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50/40 p-3">
                <Activity className="w-3.5 h-3.5 text-gray-500" />
                <h2 className="text-[13px] font-bold text-gray-950">Email log</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-500">
                  No emails yet
                </span>
              </div>
            )}

              </div>
            </section>

            <section className="order-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs" aria-labelledby="user-accounts-heading">
              <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dbd-accent">User register</p>
                  <h2 id="user-accounts-heading" className="mt-1 text-base font-bold text-gray-950">App profiles</h2>
                  <p className="mt-1 text-xs font-medium text-gray-500">Review stored profiles, access, activity, subscriptions and private admin notes.</p>
                </div>
                <p className="text-xs font-semibold text-gray-500">{filteredUsers.length} of {users.length} profiles shown</p>
              </div>
              <div className="bg-white">
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const subscription = user.subscription;
                  const trialEnd = getTrialEndDate(user);
                  const hasStripe = !!subscription?.stripeCustomerId;
                  const confirmationSent = !!user.subscriptionConfirmationEmailSent;
                  const canManageUser = user.uid !== currentUser?.uid && user.email !== 'tmterencemartin@gmail.com';
                  const stats = dinnerStats[user.uid] || { savedCount: 0, scheduledCount: 0 };
                  const graceEndsAt = toDate(user.subscriptionPaymentGraceEndsAt);
                  const hasActiveGrace = !!graceEndsAt && graceEndsAt.getTime() > Date.now();
                  const trialEndDate = toDate(trialEnd);
                  const trialHasEnded = !!trialEndDate && trialEndDate.getTime() < Date.now();
                  const detailGroups: Array<{ label: string; items: Array<{ label: string; value: string; muted?: boolean; mono?: boolean }> }> = [
                    {
                      label: 'Email',
                      items: [
                        { label: 'Welcome', value: user.welcomeEmailSent ? 'Sent' : 'Not sent' },
                        { label: 'Subscription confirmation', value: confirmationSent ? 'Sent' : 'Not sent' },
                      ],
                    },
                    {
                      label: 'Access',
                      items: [
                        user.permanentAccessGrantedAt ? { label: 'Permanent access', value: formatDate(user.permanentAccessGrantedAt) } : null,
                        user.permanentAccessEmailSentAt ? { label: 'Access email', value: `Sent ${formatDate(user.permanentAccessEmailSentAt)}` } : null,
                        user.permanentAccessEmailError ? { label: 'Access email', value: 'Failed', muted: false } : null,
                      ].filter(Boolean),
                    },
                    {
                      label: 'Billing',
                      items: [
                        { label: 'Stripe customer', value: hasStripe ? formatShortId(subscription?.stripeCustomerId) : 'None', muted: !hasStripe },
                        subscription?.subscriptionStatus ? { label: 'Status', value: subscription.subscriptionStatus } : null,
                        hasActiveGrace ? { label: 'Grace ends', value: formatDate(graceEndsAt) } : null,
                        getSubscriptionStartDate(user) ? { label: 'Subscribed', value: formatDate(getSubscriptionStartDate(user)) } : null,
                        subscription?.currentPeriodEnd ? { label: getPeriodLabel(user), value: formatDate(subscription.currentPeriodEnd) } : null,
                        subscription?.stripeSubscriptionId ? { label: 'Subscription', value: formatShortId(subscription.stripeSubscriptionId), mono: true } : null,
                        subscription?.updatedAt ? { label: 'Stripe updated', value: formatDateTime(subscription.updatedAt) } : null,
                      ].filter(Boolean),
                    },
                  ].filter(group => group.items.length > 0);

                  const isExpanded = !!expandedAccountUids[user.uid];

                  return (
                    <div key={user.uid} className="px-4 py-2.5 transition-colors hover:bg-gray-50/70 sm:px-5">
                      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <p className="truncate text-sm font-bold leading-tight text-gray-950 sm:text-[15px]">{user.displayName || user.email || 'User'}</p>
                            {getStatusBadge(user)}
                            <span className="min-w-0 basis-full truncate font-mono text-[11.5px] text-gray-400 sm:basis-auto" title={user.email || 'No email'}>{user.email || 'No email'}</span>
                          </div>

                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] leading-snug">
                            <span><span className="text-gray-400">Joined</span> <span className="font-semibold text-gray-700">{formatDate(user.createdAt)}</span></span>
                            {trialEndDate && <span><span className="text-gray-400">{trialHasEnded ? 'Trial ended' : 'Trial ends'}</span> <span className="font-semibold text-gray-700">{formatDate(trialEndDate)}</span></span>}
                            <span><span className="text-gray-400">Saved</span> <span className="font-semibold text-gray-700">{stats.savedCount}</span></span>
                            <span><span className="text-gray-400">Scheduled</span> <span className="font-semibold text-gray-700">{stats.scheduledCount}</span></span>
                            <span><span className="text-gray-400">Searches</span> <span className="font-semibold text-gray-700">{getSearchCount(user)}</span></span>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] leading-snug text-gray-400">
                            <span>Welcome <span className="font-semibold text-gray-600">{user.welcomeEmailSent ? 'sent' : 'not sent'}</span></span>
                            {confirmationSent && <span>Subscription confirmation <span className="font-semibold text-gray-600">sent</span></span>}
                            {user.permanentAccessEmailSentAt && <span>Access email <span className="font-semibold text-gray-600">sent {formatDate(user.permanentAccessEmailSentAt)}</span></span>}
                            {user.permanentAccessEmailError && <span className="font-semibold text-red-600">Access email failed</span>}
                            {hasActiveGrace && <span className="font-semibold text-amber-700">Grace ends {formatDate(graceEndsAt)}</span>}
                            {editingNoteUid !== user.uid && (
                              <button
                                onClick={() => setEditingNoteUid(user.uid)}
                                className={`min-w-0 truncate text-left font-semibold ${
                                  user.adminNote
                                    ? 'max-w-[220px] text-gray-500 hover:text-gray-900'
                                    : 'text-gray-300 hover:text-gray-500'
                                }`}
                                title={user.adminNote || 'Add private note'}
                              >
                                {user.adminNote ? `Note: ${user.adminNote}` : 'Add note'}
                              </button>
                            )}
                          </div>

                          {editingNoteUid === user.uid && (
                            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                              <input
                                type="text"
                                value={noteDrafts[user.uid] || ''}
                                onChange={(e) => setNoteDrafts(prev => ({ ...prev, [user.uid]: e.target.value }))}
                                placeholder="Private admin note"
                                className="min-w-0 flex-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-dbd-accent"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSaveAdminNote(user)}
                                  disabled={noteSavingUid === user.uid}
                                  className="text-xs font-bold text-dbd-accent hover:text-dbd-accent/80 disabled:opacity-50"
                                >
                                  {noteSavingUid === user.uid ? 'Saving...' : 'Save note'}
                                </button>
                                <button
                                  onClick={() => {
                                    setNoteDrafts(prev => ({ ...prev, [user.uid]: user.adminNote || '' }));
                                    setEditingNoteUid(null);
                                  }}
                                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {isExpanded && (
                            <div className="mt-2.5 rounded border border-gray-100 bg-gray-50/60 p-3">
                              <div className="grid gap-x-5 gap-y-2.5 text-[11px] sm:grid-cols-3">
                                {detailGroups.map((group) => (
                                  <div key={group.label} className="min-w-0">
                                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">{group.label}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                      {group.items.map((item) => (
                                        <div key={`${group.label}-${item.label}`} className="inline-flex min-w-0 items-baseline gap-1.5 leading-snug">
                                          <span className="shrink-0 text-gray-400">{item.label}</span>
                                          <span className={`${item.muted ? 'italic text-gray-400' : 'text-gray-700'} ${item.mono ? 'font-mono' : ''} truncate`} title={item.value}>{item.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-2 text-[10px] font-mono text-gray-300">UID {user.uid}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 lg:justify-end">
                          <button
                            onClick={() => setExpandedAccountUids(prev => ({ ...prev, [user.uid]: !prev[user.uid] }))}
                            className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[11px] font-bold text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-800"
                            aria-expanded={isExpanded}
                            title={isExpanded ? 'Hide account details' : 'Show account details'}
                          >
                            Details
                            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {canManageUser && (
                            <button
                              onClick={() => handleTogglePermanentAccess(user)}
                              disabled={loading || actionLoading !== null}
                              className={`text-xs font-bold transition-colors ${
                                user.permanentAccess
                                  ? 'text-blue-700 hover:text-blue-900'
                                  : 'text-gray-600 hover:text-gray-900'
                              } disabled:opacity-50`}
                              title={user.permanentAccess ? 'Revoke permanent access' : 'Grant permanent access'}
                            >
                              {user.permanentAccess ? 'Revoke' : 'Grant'}
                            </button>
                          )}
                          {subscription?.stripeCustomerId && (
                            <a
                              href={`https://dashboard.stripe.com/customers/${subscription.stripeCustomerId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-dbd-accent transition-colors hover:text-dbd-accent/80"
                            >
                              Stripe
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {canManageUser && (
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.email)}
                              disabled={loading || actionLoading !== null}
                              className={`text-xs font-bold transition-colors ${
                                actionLoading === user.uid
                                  ? 'cursor-not-allowed text-gray-400'
                                  : 'text-gray-400 hover:text-red-600'
                              } disabled:opacity-50`}
                              title="Delete the sign-in identity, profile and stored app data"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-400 italic">
                    No users match your current selection
                  </div>
                )}
              </div>
            </div>
            </section>
          </div>
        )}
      </div>

      {/* Custom Modal Prompt */}
      {modal.isOpen && (
        <div id="admin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded shadow-md w-full max-w-md p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              {modal.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed whitespace-pre-line">
              {modal.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              {modal.type !== 'alert' ? (
                <>
                  <button
                    onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setModal(prev => ({ ...prev, isOpen: false }));
                      if (modal.onConfirm) modal.onConfirm();
                    }}
                    className={`px-4 py-2 text-sm font-bold text-white rounded transition-colors ${
                      modal.type === 'confirm_delete_all' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : modal.type === 'confirm_delete'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-dbd-accent hover:bg-dbd-accent/90'
                    }`}
                  >
                    {modal.type === 'confirm_access' ? 'Confirm' : 'Confirm Delete'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-bold text-white bg-dbd-accent hover:bg-dbd-accent/90 rounded transition-all"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
