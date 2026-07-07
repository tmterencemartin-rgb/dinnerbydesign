import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getApiUrl } from '../../lib/api';
import { AppView } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SuccessViewProps {
  setView: (view: AppView) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ setView }) => {
  const { accessStatus, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  const isSubscriptionConfirmed =
    accessStatus === 'paid' ||
    profile?.isPremium === true ||
    profile?.accessStatus === 'paid' ||
    profile?.subscription?.accessStatus === 'paid' ||
    profile?.subscription?.subscriptionStatus === 'active';

  useEffect(() => {
    const fetchSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl('/api/get-checkout-session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) throw new Error('Failed to fetch session details');
        const data = await response.json();
        setSession(data);
      } catch (err: any) {
        console.error('Success fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        // Clear the query params without refreshing the page
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Confirming your subscription...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm text-center space-y-6"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${isSubscriptionConfirmed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          {isSubscriptionConfirmed ? (
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          ) : (
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-center">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
              isSubscriptionConfirmed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {isSubscriptionConfirmed ? 'Subscription confirmed' : 'Payment received'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSubscriptionConfirmed ? 'Account active' : 'Finalising your account'}
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {isSubscriptionConfirmed
              ? `Thanks for subscribing${session?.customer_details?.email ? ` (${session.customer_details.email})` : ''}. Your saved recipes, dinner schedules and trial preferences are now unlocked and stay available while your subscription is active.`
              : error
                ? 'Stripe has received the payment, but we could not fetch the checkout details. Your account should update shortly once the secure Stripe confirmation arrives.'
                : 'Stripe has received the payment. Dinner by Design is waiting for the secure Stripe confirmation to update your account; this usually takes a few seconds.'}
          </p>
          {!isSubscriptionConfirmed && (
            <p className="text-[12px] text-gray-400 leading-relaxed">
              If this message stays here, check Settings again in a moment. You will not need to pay twice.
            </p>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => setView('home')}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-sm"
          >
            Continue to recipe search
            <ArrowRight className="w-4 h-4" />
          </button>
          {!isSubscriptionConfirmed && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-gray-700 border border-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Check subscription status
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
