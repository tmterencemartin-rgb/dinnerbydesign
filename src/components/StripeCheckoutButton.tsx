import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../lib/api';

let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

interface StripeCheckoutButtonProps {
  className?: string;
}

export const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({ className }) => {
  const { showToast, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please sign in to subscribe.');
      return;
    }

    setLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        showToast('Stripe configuration is missing. Please ensure VITE_STRIPE_PUBLISHABLE_KEY is set in your environment.');
        setLoading(false);
        return;
      }

      const response = await fetch(getApiUrl('/api/create-checkout-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, userId: user.uid, email: user.email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const { id, url } = await response.json();

      if (url) {
        try {
          const isFramed = window.top && window.top !== window;
          if (isFramed) {
             try {
               window.top.location.href = url;
             } catch (e) {
               window.open(url, '_blank');
             }
          } else {
            window.location.href = url;
          }
        } catch (e) {
          window.open(url, '_blank') || (window.location.href = url);
        }
      } else {
        const stripeInstance = await stripe;
        if (stripeInstance) {
          const { error } = await stripeInstance.redirectToCheckout({
            sessionId: id,
          });
          if (error) {
            console.error('Stripe error:', error);
            showToast('Payment failed to initialize. Please try again.');
          }
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="premium-subscription-panel" 
      className={`${className}`}
    >
      <div className="flex flex-col gap-1.5">
        {/* Toggle - Directly below the panel title (SettingsView header) and above price figure */}
        <div id="plan-selection" className="flex bg-gray-100/50 p-1 rounded-sm border border-gray-100/60 w-full h-[30px] items-stretch">
          <button
            id="select-monthly-btn"
            onClick={() => setPlan('monthly')}
            className={`flex-grow flex items-center justify-center px-2 rounded-sm transition-all outline-none text-center text-[9.5px] font-bold ${
              plan === 'monthly' 
                ? 'bg-white text-dbd-accent border border-gray-200/20'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Monthly
          </button>
          
          <button
            id="select-yearly-btn"
            onClick={() => setPlan('yearly')}
            className={`flex-grow flex items-center justify-center px-2 rounded-sm transition-all outline-none text-center text-[9.5px] font-bold gap-1 ${
              plan === 'yearly' 
                ? 'bg-white text-dbd-accent border border-gray-200/20'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Annual <span className={`text-[8px] px-1 py-0.5 rounded-sm ${plan === 'yearly' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500 opacity-60'}`}>save 16%</span>
          </button>
        </div>

        {/* Price Figure - Below toggle */}
        <div className="flex items-baseline gap-1.5 select-none h-[26px]">
          <span className="text-[24px] font-bold text-gray-900 font-mono tracking-tight leading-none">
            {plan === 'monthly' ? '£2.99' : '£2.50'}
          </span>
          <span className="text-gray-400 text-[10px] font-semibold font-mono">/ month</span>
        </div>

        <div className="space-y-1">
          <div className="min-h-[38px] flex flex-col justify-start">
            <p className="text-[9.5px] text-gray-400 font-semibold font-ibm-plex-mono leading-tight">
              {plan === 'monthly' ? 'Billed monthly. Cancel anytime.' : 'Billed annually in advance (£30.00). Cancel anytime.'}
            </p>
            <p className="text-[9.5px] text-gray-400 font-semibold font-ibm-plex-mono leading-tight">
              No credit card required for the free trial.
            </p>
          </div>
          <button
            id="checkout-confirm-btn"
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full h-8 px-4 text-[10px] font-bold uppercase tracking-[0.12em] rounded-sm transition-all flex items-center justify-center ${
              loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-dbd-accent text-white hover:bg-dbd-accent-mid'
            }`}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : 'Activate Full Access'}
          </button>
        </div>
      </div>
    </div>
  );
};
