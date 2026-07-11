import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Crown, X } from 'lucide-react';
import { AppView } from '../types';
import { safeStorage } from '../lib/storage';

export const StatusBanner = ({ setView }: { setView: (v: AppView, highlight?: string) => void }) => {
  const { user, accessStatus, trialDaysLeft, profile } = useAuth();
  const [isDismissed, setIsDismissed] = React.useState(() => {
    return safeStorage.getItem('dbd_status_banner_dismissed') === 'true';
  });

  if (!user || user.isAnonymous) return null;

  // Robust checks to ensure the status banner is hidden for active premium subscribers
  const isPaid = 
    accessStatus === 'paid' || 
    profile?.isPremium === true || 
    profile?.accessStatus === 'paid' || 
    profile?.subscription?.accessStatus === 'paid';

  // Also check URL parameters to handle real-time checkout success redirects cleanly
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isTransitioningPaid = params ? (params.has('session_id') || params.get('payment') === 'success') : false;

  if (isPaid || isTransitioningPaid || isDismissed) return null;

  const isExpired = accessStatus === 'read_only';

  const handleDismiss = () => {
    setIsDismissed(true);
    safeStorage.setItem('dbd_status_banner_dismissed', 'true');
  };

  return (
    <div 
      className={`relative w-full py-3 px-4 pr-12 flex flex-col sm:flex-row items-center justify-center gap-3 transition-colors ${
        isExpired ? 'bg-red-50 border-b border-red-100' : 'bg-dbd-soft border-b border-dbd-rule'
      }`}
    >
      <div className="flex items-center gap-2 text-dbd-ink">
        {isExpired ? (
          <AlertCircle className="w-4 h-4 text-red-600" />
        ) : (
          <Crown className="w-4 h-4 text-dbd-accent" />
        )}
        <span className="text-[14px] font-sans font-medium">
          {isExpired 
            ? 'Your trial has ended. You’re in read-only mode.' 
            : trialDaysLeft === 0 
              ? 'Free trial ends today' 
              : `Free trial: ${trialDaysLeft} ${trialDaysLeft === 1 ? 'day' : 'days'} left`}
        </span>
      </div>
      
      {isExpired && (
        <button 
          onClick={() => setView('settings', 'subscription-section')}
          className="text-[12px] font-ibm-plex-mono font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-all bg-dbd-ink hover:bg-dbd-ink-2 text-white shadow-sm"
        >
          Subscribe
        </button>
      )}

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-black/5 text-dbd-ink-3 hover:text-dbd-ink transition-colors"
        title="Don't show this notification again"
        aria-label="Close notification"
      >
        <X className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};
