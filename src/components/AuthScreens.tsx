import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

import { AuthForm } from './AuthForm';
import { Wordmark } from './Wordmark';

export const AuthLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white p-4">
    <div className="text-center" role="status" aria-live="polite" aria-label="Loading your account">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-[12px] text-gray-500 font-medium tracking-tight">Setting the table...</p>
    </div>
  </div>
);

export const AuthError: React.FC<{ error: string }> = ({ error }) => {
  const { signOut } = useAuth();
  const isOperationNotAllowed = error.includes('operation-not-allowed');
  // Hide raw technical codes for generic profile/account retrieval issues as requested
  const isProfileError = error.includes('account settings') || error.includes('user profile') || error.includes('account could not be loaded');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm">
        <Wordmark className="mx-auto mb-6 text-[29.33px]" />
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-3">
          {isProfileError ? 'We could not load your account' : 'Authentication Error'}
        </h1>
        <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
          {isOperationNotAllowed 
            ? "Your account access is currently restricted. Please contact support or try a different method." 
            : error}
        </p>

        {!isOperationNotAllowed && !isProfileError && (
          <div className="mb-8 px-2">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-left">
              <p className="text-[10px] text-gray-500 font-mono break-all leading-tight">
                {error}
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-900 text-white py-4 rounded-lg text-[14px] font-bold shadow-sm hover:bg-black transition-all"
          >
            Retry
          </button>
          <button 
            onClick={() => { void signOut(); }}
            className="w-full text-gray-500 py-3 rounded text-[13px] font-medium hover:text-gray-900 transition-colors"
          >
            Sign out and return to landing
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthSyncing: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white p-4">
    <div className="text-center" role="status" aria-live="polite" aria-label="Synchronising your account">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-[12px] text-gray-500 font-medium tracking-tight">Re-syncing your station...</p>
    </div>
  </div>
);

export const AuthSignIn: React.FC<{ defaultMode?: 'signup' | 'signin' }> = ({ defaultMode = 'signup' }) => {
  const [isSignUp, setIsSignUp] = React.useState(defaultMode === 'signup');
  
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm border border-gray-100 p-5 sm:p-6 rounded-xl shadow-sm">
        <div className="text-center mb-4">
          <Wordmark className="mx-auto mb-2 text-[29.33px]" />
          <p className="text-[10px] text-gray-500 font-medium tracking-[0.01em] mb-4">Less searching. More relevant dinners.</p>
          
          <h1 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">
            {isSignUp ? 'Start your free 7-day trial.' : 'Sign in to your account'}
          </h1>
          <p className="text-[13px] text-gray-500 mt-1.5 leading-snug">
            {isSignUp 
              ? 'No card details required.'
              : 'Pick up your saved recipes, planner and shopping list.'}
          </p>
        </div>
        
        <AuthForm 
          mode={isSignUp ? 'signup' : 'signin'}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </div>
    </main>
  );
};
