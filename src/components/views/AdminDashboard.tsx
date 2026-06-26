import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, AccessStatus } from '../../types';
import { ArrowLeft, Search, Filter, Download, ExternalLink, Calendar, CreditCard, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const { setView, isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccessStatus | 'all'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'confirm_delete' | 'confirm_delete_all' | 'alert';
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

  useEffect(() => {
    if (!isAdmin) {
      setView('home');
      return;
    }

    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
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
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uid.includes(searchTerm);
    
    const status = user.subscription?.accessStatus || user.accessStatus || 'trial';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (user: UserProfile) => {
    const status = user.subscription?.accessStatus || user.accessStatus || 'trial';
    const subStatus = user.subscription?.subscriptionStatus;

    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-tight">
            Paid {subStatus && <span className="ml-1 opacity-70 font-normal">({subStatus})</span>}
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-tight">
            Trial
          </span>
        );
      case 'read_only':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 uppercase tracking-tight">
            Read Only
          </span>
        );
      default:
        return null;
    }
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
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
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
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 focus:border-dbd-accent"
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dbd-accent/20 bg-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="trial">Trial</option>
              <option value="read_only">Read Only</option>
            </select>

            <button
              onClick={handleDeleteAllUsers}
              disabled={loading || actionLoading !== null}
              className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 uppercase tracking-wider disabled:opacity-50"
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
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Billing Cycle</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Key Dates</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm leading-tight">{user.displayName || user.email || 'User'}</span>
                        <span className="text-gray-400 text-xs font-mono mt-0.5">{user.email || 'No email'}</span>
                        <span className="text-[10px] text-gray-300 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">ID: {user.uid}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {user.subscription?.stripeCustomerId ? (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium font-mono">Stripe User</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">None</span>
                        )}
                        {user.subscription?.stripeSubscriptionId && (
                          <span className="text-[10px] text-gray-400 font-mono">ID: {user.subscription.stripeSubscriptionId.substring(0, 12)}...</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                        {user.subscription?.currentPeriodEnd && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Ends: {formatDate(user.subscription.currentPeriodEnd)}</span>
                          </div>
                        )}
                        {!user.subscription && user.trialStartedAt && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600/70">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Trial Start: {formatDate(user.trialStartedAt)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.subscription?.stripeCustomerId && (
                          <a 
                            href={`https://dashboard.stripe.com/customers/${user.subscription.stripeCustomerId}`}
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
                            className={`p-1.5 rounded-lg transition-all ${
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
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                      No users match your current selection
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modal Prompt */}
      {modal.isOpen && (
        <div id="admin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
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
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setModal(prev => ({ ...prev, isOpen: false }));
                      if (modal.onConfirm) modal.onConfirm();
                    }}
                    className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-xs ${
                      modal.type === 'confirm_delete_all' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    Confirm Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-bold text-white bg-dbd-accent hover:bg-dbd-accent/90 rounded-lg transition-all shadow-xs"
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
