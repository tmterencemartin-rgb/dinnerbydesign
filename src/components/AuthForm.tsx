import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isNativeApp } from '../lib/platform';

interface AuthFormProps {
  onSuccess?: () => void;
  mode?: 'signup' | 'signin';
  onToggleMode?: () => void;
  className?: string;
}

const AUTH_TIMEOUT_MS = 15000;

const withAuthTimeout = async <T,>(operation: Promise<T>, isNative: boolean): Promise<T> => {
  if (!isNative) return operation;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Sign-in is taking too long. Please check the simulator connection and try again."));
        }, AUTH_TIMEOUT_MS);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export const AuthForm: React.FC<AuthFormProps> = ({ 
  onSuccess, 
  mode = 'signup',
  onToggleMode,
  className = ""
}) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset,
    signInWithGoogle
  } = useAuth();

  const isSignUp = mode === 'signup';
  const isNative = isNativeApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+44');

  const COUNTRY_CODES = [
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'US/CA' },
    { code: '+61', country: 'AU' },
    { code: '+353', country: 'IE' },
    { code: '+49', country: 'DE' },
    { code: '+33', country: 'FR' },
    { code: '+34', country: 'ES' },
    { code: '+39', country: 'IT' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      if (isSignUp) {
        if (!cleanEmail || !password || !firstName || !lastName || !phone) {
          throw new Error("All fields are required");
        }
        const fullPhone = `${countryCode}${phone.trim().replace(/^\+/, '')}`;
        await withAuthTimeout(
          signUpWithEmail(cleanEmail, password, firstName.trim(), lastName.trim(), fullPhone),
          isNative
        );
      } else {
        if (!cleanEmail || !password) throw new Error("Email and password are required");
        await withAuthTimeout(signInWithEmail(cleanEmail, password), isNative);
      }
      onSuccess?.();
    } catch (err: any) {
      let msg = err.message || "Authentication failed";
      
      if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password login is not enabled in Firebase.";
      } else if (err.code === 'auth/email-already-in-use') {
        msg = "An account with this email already exists.";
      } else if (err.code === 'auth/weak-password') {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = "Incorrect email or password.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(cleanEmail);
      setError("If the address is registered, we've sent a reset link.");
    } catch (err: any) {
      // Still use neutral messaging even on error to prevent account enumeration
      // unless it's a specific rate limit or system error
      setError("If the address is registered, we've sent a reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={isSignUp ? '' : 'space-y-2'}>
        {!isSignUp && (
          <label className="text-[13px] font-bold text-gray-900 block">
            Sign in
          </label>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-1 relative">
          {error && (
            <p className={`text-[12px] font-bold leading-tight mb-3 ${error.includes('sent') ? 'text-emerald-600' : 'text-red-500'}`}>
              {error}
            </p>
          )}
          
          <div className="space-y-0.5">
            {isSignUp && (
              <>
                <div className="flex gap-0.5">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    className="w-1/2 bg-gray-50 border border-gray-100 rounded-tl px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400" 
                    required={isSignUp}
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    className="w-1/2 bg-gray-50 border border-gray-100 rounded-tr px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400" 
                    required={isSignUp}
                  />
                </div>
                <div className="flex gap-0.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-[80px] bg-gray-50 border border-gray-100 px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 cursor-pointer appearance-none"
                    required={isSignUp}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                    ))}
                  </select>
                  <input 
                    type="tel" 
                    placeholder="Telephone Number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="flex-1 bg-gray-50 border border-gray-100 px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400" 
                    required={isSignUp}
                  />
                </div>
              </>
            )}
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={`w-full bg-gray-50 border border-gray-100 px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400 ${!isSignUp ? 'rounded-t' : ''}`} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-100 rounded-b px-3 py-2.5 text-[13.5px] outline-none focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400" 
              required 
              minLength={6} 
            />
          </div>
          
          <div className="pt-2 space-y-1.5">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-2.5 bg-gray-900 text-white rounded text-[13px] font-bold shadow-sm hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (isSignUp ? 'Create account' : 'Sign in')}
            </button>

            {!isSignUp && (
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  className="text-[11px] text-gray-400 hover:text-accent font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {isNative ? (
        <p className="text-[11px] text-gray-400 font-medium text-center leading-snug">
          Google sign-in will be added to the native app later. Please use email and password for this test build.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const success = await signInWithGoogle();
                if (success) {
                  onSuccess?.();
                }
              } catch (err: any) {
                setError(err.message || "Google sign-in failed");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full py-2.5 bg-white border border-gray-100 hover:bg-gray-50/80 rounded text-[13px] font-bold text-gray-700 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      )}

      <div className="pt-2.5 text-center border-t border-gray-50">
        {isSignUp ? (
          <p className="text-[13px] text-gray-500 font-medium">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onToggleMode} 
              className="text-gray-900 font-bold underline hover:text-accent transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </p>
        ) : (
          <p className="text-[13px] text-gray-500 font-medium">
            New here?{' '}
            <button 
              type="button" 
              onClick={onToggleMode} 
              className="text-gray-900 font-bold underline hover:text-accent transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
