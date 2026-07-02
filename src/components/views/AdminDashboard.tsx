import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, AccessStatus } from '../../types';
import { ArrowLeft, Search, Download, ExternalLink, Calendar, CreditCard, Clock, Trash2, Users, MailCheck, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type AdminStatusFilter = AccessStatus | 'all' | 'permanent_access' | 'stripe_linked' | 'payment_issue' | 'no_stripe';

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

export const AdminDashboard: React.FC = () => {
  const { setView, isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<StripeWebhookHealthEvent[]>([]);
  const [aiUsageEvents, setAiUsageEvents] = useState<AiUsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
  }, [isAdmin, setView]);

  const handleDeleteUser = (userId: string, email: string) => {
    if (userId === currentUser?.uid || email === 'tmterencemartin@gmail.com') {
      showCustomAlert(
        "Action Blocked",
        "For safety and security reasons, you cannot delete your own administrative account."
      );
      return;
    }

    showCustomConfirm(
      "Confirm User Deletion",
      `Are you absolutely sure you want to permanently delete the user account for "${email || userId}"?\n\nThis will remove their profile document from the database. This action is irreversible.`,
      async () => {
        setActionLoading(userId);
        try {
          await deleteDoc(doc(db, 'users', userId));
          setUsers(prev => prev.filter(u => u.uid !== userId));
          showCustomAlert("Success", `User "${email || userId}" deleted successfully.`);
        } catch (err: any) {
          console.error("Error deleting user:", err);
          showCustomAlert("Error", `Failed to delete user: ${err?.message || 'Access denied'}`);
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  const handleDeleteAllUsers = () => {
    const listToDelete = users.filter(u => u.uid !== currentUser?.uid && u.email !== 'tmterencemartin@gmail.com');
    if (listToDelete.length === 0) {
      showCustomAlert(
        "No Users to Delete",
        "There are no other user accounts in the list to delete."
      );
      return;
    }

    setModal({
      isOpen: true,
      type: 'confirm_delete_all',
      title: "⚠️ Clear All Guest Users?",
      message: `This will permanently delete ALL ${listToDelete.length} other user accounts from the database.\n\nYour own admin account will be safely excluded.\n\nAre you absolutely sure you want to proceed? This cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        let deletedCount = 0;
        let failedCount = 0;

        for (const u of listToDelete) {
          try {
            await deleteDoc(doc(db, 'users', u.uid));
            deletedCount++;
          } catch (err) {
            console.error(`Error deleting user ${u.uid}:`, err);
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
        } catch (err) {
          console.error('Error re-fetching users:', err);
        } finally {
          setLoading(false);
        }

        if (failedCount > 0) {
          showCustomAlert(
            "Bulk Deletion Completed",
            `Successfully deleted ${deletedCount} users. Failed to delete ${failedCount} users.`
          );
        } else {
          showCustomAlert(
            "Bulk Deletion Successful",
            `Successfully deleted all ${deletedCount} other user accounts!`
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
            updatedAt: serverTimestamp()
          });
          setUsers(prev => prev.map(user => (
            user.uid === targetUser.uid
              ? {
                  ...user,
                  permanentAccess: nextValue,
                  permanentAccessGrantedAt: nextValue ? Timestamp.now() : undefined,
                  permanentAccessGrantedBy: nextValue ? currentUser?.email || currentUser?.uid || null : null
                }
              : user
          )));
          showCustomAlert(
            'Access Updated',
            `Permanent access has been ${nextValue ? 'granted to' : 'revoked for'} "${targetUser.email || targetUser.uid}".`
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
      'Stripe status',
      'Stripe customer ID',
      'Stripe subscription ID',
      'Joined',
      'Trial end',
      'Subscription created',
      'Current period start',
      'Current period end',
      'Welcome email sent',
      'Subscription email sent',
      'Search count'
    ];

    const rows = filteredUsers.map(user => {
      const subscription = user.subscription;
      return [
        user.displayName || '',
        user.email || '',
        user.uid,
        getAccessStatus(user),
        user.permanentAccess ? 'yes' : 'no',
        formatDate(user.permanentAccessGrantedAt),
        user.permanentAccessGrantedBy || '',
        subscription?.subscriptionStatus || '',
        subscription?.stripeCustomerId || '',
        subscription?.stripeSubscriptionId || '',
        formatDate(user.createdAt),
        formatDate(getTrialEndDate(user)),
        formatDate(getSubscriptionStartDate(user)),
        formatDate(subscription?.currentPeriodStart),
        formatDate(subscription?.currentPeriodEnd),
        user.welcomeEmailSent ? 'yes' : 'no',
        user.subscriptionConfirmationEmailSent ? 'yes' : 'no',
        getSearchCount(user)
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

  const getWebhookStatusClass = (status?: StripeWebhookHealthEvent['status']) => {
    if (status === 'succeeded') return 'bg-emerald-50 text-emerald-700';
    if (status === 'failed') return 'bg-red-50 text-red-700';
    return 'bg-amber-50 text-amber-700';
  };

  if (!isAdmin) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('settings')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Subscription Dashboard</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 focus:border-dbd-accent"
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 bg-white"
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
              className="px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider disabled:opacity-50"
              title="Export the current filtered subscriber list"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              onClick={handleDeleteAllUsers}
              disabled={loading || actionLoading !== null}
              className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider disabled:opacity-50"
              title="Delete all other user accounts from the database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All Users
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dbd-accent"></div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total users', value: summaryStats.total, detail: `${summaryStats.trial} trial / ${summaryStats.readOnly} read only`, icon: Users },
                { label: 'Paid access', value: summaryStats.paid, detail: `${summaryStats.stripeLinked} Stripe / ${summaryStats.permanentAccess} permanent`, icon: CreditCard },
                { label: 'Payment issues', value: summaryStats.paymentIssues, detail: 'Past due, unpaid or incomplete', icon: AlertTriangle },
                { label: 'Usage', value: summaryStats.aiCalls || summaryStats.totalSearches, detail: `${summaryStats.succeededAiCalls} model calls succeeded`, icon: Activity }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white border border-gray-100 rounded p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-950 mt-1">{item.value}</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-1">{item.detail}</p>
                      </div>
                      <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-gray-100 rounded p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <h2 className="text-[13px] font-bold text-gray-950">Launch cost monitor</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-500">
                      Estimate
                    </span>
                  </div>
                  <p className="text-[11.5px] text-gray-400 font-medium max-w-2xl">
                    Tracks server-side Gemini calls from the point this monitor was added. Token and cost figures are estimates based on prompt and response size.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:max-w-4xl">
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gemini cost</p>
                    <p className="text-lg font-bold text-gray-950 mt-1">{formatCurrency(summaryStats.estimatedAiCostGbp)}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">{formatCurrency(summaryStats.estimatedAiCostUsd, 'USD')} est.</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Model calls</p>
                    <p className="text-lg font-bold text-gray-950 mt-1">{summaryStats.aiCalls}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">{summaryStats.failedAiCalls} failed</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Call mix</p>
                    <p className="text-lg font-bold text-gray-950 mt-1">{summaryStats.recipeSearchCalls}/{summaryStats.readyMadeCalls}/{summaryStats.weeklyPlanCalls}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">Recipe / ready-made / weekly</p>
                  </div>
                  <div className="bg-gray-50/60 border border-gray-100 rounded p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Net snapshot</p>
                    <p className="text-lg font-bold text-gray-950 mt-1">{formatCurrency(summaryStats.estimatedNetAfterStripeAndAi)}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium">After Stripe + Gemini est.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-500">
                <div className="border-t border-gray-100 pt-2">
                  <span className="font-bold text-gray-700">Gross subscription value:</span> {formatCurrency(summaryStats.estimatedGrossRevenue)}
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <span className="font-bold text-gray-700">Stripe fees estimate:</span> {formatCurrency(summaryStats.estimatedStripeFees)}
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <span className="font-bold text-gray-700">Average Gemini time:</span> {summaryStats.averageLatencyMs ? `${(summaryStats.averageLatencyMs / 1000).toFixed(1)}s` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <h2 className="text-[13px] font-bold text-gray-950">Stripe webhook health</h2>
                    {latestWebhookEvent ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getWebhookStatusClass(latestWebhookEvent.status)}`}>
                        {latestWebhookEvent.status}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-500">
                        No events yet
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-gray-400 font-medium">
                    {latestWebhookEvent
                      ? `${latestWebhookEvent.type} · ${formatDateTime(latestWebhookEvent.updatedAt || latestWebhookEvent.receivedAt || latestWebhookEvent.stripeCreatedAt)}`
                      : 'No Stripe webhook health records have been received since this feature was added.'}
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

            <div className="overflow-x-auto border border-gray-100 rounded">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Stripe</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Key Dates</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Emails & Usage</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const subscription = user.subscription;
                  const trialEnd = getTrialEndDate(user);
                  const hasStripe = !!subscription?.stripeCustomerId;
                  const confirmationSent = !!user.subscriptionConfirmationEmailSent;

                  return (
                    <tr key={user.uid} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm leading-tight">{user.displayName || user.email || 'User'}</span>
                          <span className="text-gray-400 text-xs font-mono mt-0.5">{user.email || 'No email'}</span>
                          <span className="text-[10px] text-gray-300 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">UID: {user.uid}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(user)}
                          {subscription?.subscriptionStatus && (
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Stripe: {subscription.subscriptionStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {hasStripe ? (
                            <>
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">Customer linked</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono">Customer: {formatShortId(subscription?.stripeCustomerId)}</span>
                              <span className="text-[10px] text-gray-400 font-mono">Sub: {formatShortId(subscription?.stripeSubscriptionId)}</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No Stripe customer yet</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Joined: {formatDate(user.createdAt)}</span>
                          </div>
                          {trialEnd && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Trial end: {formatDate(trialEnd)}</span>
                            </div>
                          )}
                          {getSubscriptionStartDate(user) && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Subscribed: {formatDate(getSubscriptionStartDate(user))}</span>
                            </div>
                          )}
                          {subscription?.currentPeriodEnd && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{getPeriodLabel(user)}: {formatDate(subscription.currentPeriodEnd)}</span>
                            </div>
                          )}
                          {subscription?.updatedAt && (
                            <div className="text-[10px] text-gray-400 font-mono">
                              Last Stripe update: {formatDateTime(subscription.updatedAt)}
                            </div>
                          )}
                          {user.permanentAccessGrantedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Permanent: {formatDate(user.permanentAccessGrantedAt)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex flex-wrap gap-1.5">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                              user.welcomeEmailSent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              <MailCheck className="w-3 h-3" />
                              {user.welcomeEmailSent ? 'Welcome sent' : 'No welcome'}
                            </div>
                            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                              confirmationSent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {confirmationSent ? 'Sub email sent' : 'No sub email yet'}
                            </div>
                          </div>
                          {user.subscriptionConfirmationEmailSentAt && (
                            <div className="text-[10px] text-gray-400 font-mono">
                              Email: {formatDateTime(user.subscriptionConfirmationEmailSentAt)}
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 font-mono">
                            Searches: {getSearchCount(user)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Profile: {user.accessStatus || 'trial'}
                          </div>
                          {user.permanentAccess && (
                            <div className="text-[10px] text-blue-600 font-mono">
                              Permanent grant: on
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.uid !== currentUser?.uid && user.email !== 'tmterencemartin@gmail.com' && (
                            <button
                              onClick={() => handleTogglePermanentAccess(user)}
                              disabled={loading || actionLoading !== null}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                                user.permanentAccess
                                  ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                              } disabled:opacity-50`}
                              title={user.permanentAccess ? 'Revoke permanent access' : 'Grant permanent access'}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              {user.permanentAccess ? 'Revoke' : 'Grant'}
                            </button>
                          )}
                          {subscription?.stripeCustomerId && (
                            <a 
                              href={`https://dashboard.stripe.com/customers/${subscription.stripeCustomerId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-dbd-accent hover:bg-dbd-accent/5 rounded-md transition-colors"
                            >
                              View Stripe
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {user.uid !== currentUser?.uid && user.email !== 'tmterencemartin@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.email)}
                              disabled={loading || actionLoading !== null}
                              className={`p-1.5 rounded transition-all ${
                                actionLoading === user.uid 
                                  ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                                  : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                              } disabled:opacity-50`}
                              title="Delete user"
                            >
                              <Trash2 className={`w-4 h-4 ${actionLoading === user.uid ? 'animate-pulse' : ''}`} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                      No users match your current selection
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
