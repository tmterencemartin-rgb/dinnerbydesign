import React from 'react';
import { motion } from 'framer-motion';
import { LogoIcon } from './icons/LogoIcon';
import { useAuth } from '../contexts/AuthContext';
import { safeStorage } from '../lib/storage';

import { AuthForm } from './AuthForm';

export const AuthLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white p-4">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-[12px] text-gray-400 font-medium tracking-tight">Setting the table...</p>
    </div>
  </div>
);

export const AuthError: React.FC<{ error: string }> = ({ error }) => {
  const isOperationNotAllowed = error.includes('operation-not-allowed');
  // Hide raw technical codes for generic profile/account retrieval issues as requested
  const isProfileError = error.includes('account settings') || error.includes('user profile');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm">
        <LogoIcon className="w-12 h-12 mx-auto mb-6" />
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-3">Authentication Error</h1>
        <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
          {isOperationNotAllowed 
            ? "Your account access is currently restricted. Please contact support or try a different method." 
            : error}
        </p>

        {!isOperationNotAllowed && !isProfileError && (
          <div className="mb-8 px-2">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-left">
              <p className="text-[10px] text-gray-400 font-mono break-all leading-tight opacity-70">
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
            onClick={() => {
              safeStorage.removeItem('dbd_has_started');
              window.location.href = '/?view=landing';
            }}
            className="w-full text-gray-500 py-3 rounded text-[13px] font-medium hover:text-gray-900 transition-colors"
          >
            Back to landing page
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthSyncing: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white p-4">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-[12px] text-gray-400 font-medium tracking-tight">Re-syncing your station...</p>
    </div>
  </div>
);

export const AuthSignIn: React.FC<{ defaultMode?: 'signup' | 'signin' }> = ({ defaultMode = 'signup' }) => {
  const [isSignUp, setIsSignUp] = React.useState(defaultMode === 'signup');
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm border border-gray-100 p-6 sm:p-7 rounded-xl shadow-sm">
        <div className="text-center mb-5">
          <LogoIcon className="w-9 h-9 mx-auto mb-3" />
          <div className="mb-5">
            <h2 className="text-[18px] font-bold text-gray-900 flex items-center justify-center">
              Dinner<span className="text-accent mx-[1px]">By</span>Design
            </h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real world recipes</p>
          </div>
          
          <h1 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">
            {isSignUp ? 'Start your 7-day free trial.' : 'Sign in to DinnerByDesign'}
          </h1>
          <p className="text-[13px] text-gray-500 mt-1.5 leading-snug">
            {isSignUp 
              ? 'No credit card details required.' 
              : 'Pick up your saved recipes, planner and shopping list.'}
          </p>
        </div>
        
        <AuthForm 
          mode={isSignUp ? 'signup' : 'signin'}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </div>
    </div>
  );
};
