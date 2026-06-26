import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getApiUrl } from '../../lib/api';
import { AppView } from '../../types';

interface SuccessViewProps {
  setView: (view: AppView) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ setView }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

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
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Account active</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {error 
              ? "Thanks for subscribing. Your account is now active and your features should be unlocked shortly."
              : `Thanks for subscribing${session?.customer_details?.email ? ` (${session.customer_details.email})` : ''}. Your saved recipes, dinner schedules and trial preferences are now unlocked and stay available while your subscription is active. Preferences can be changed at any time.`
            }
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setView('home')}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-sm"
          >
            Continue to recipe search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
