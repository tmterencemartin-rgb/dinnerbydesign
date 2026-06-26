import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, X } from 'lucide-react';
import { safeStorage } from '../lib/storage';

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return;

    // 2. Check platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    }

    // 3. Listen for meaningful actions instead of a timer
    const handleMeaningfulAction = () => {
      const hasDismissedSession = safeStorage.session.getItem('pwa_prompt_dismissed_session');
      const hasDismissedPermanent = safeStorage.getItem('pwa_prompt_dismissed');
      
      if (!hasDismissedSession && !hasDismissedPermanent && (isIos || isAndroid)) {
        setIsVisible(true);
      }
    };

    window.addEventListener('pwa-meaningful-action', handleMeaningfulAction);
    
    // Also check if we should show it if they already engaged in this session but we haven't shown it yet
    // For now, only trigger on explicit event
    
    return () => window.removeEventListener('pwa-meaningful-action', handleMeaningfulAction);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    // Suppress for current session as requested
    safeStorage.session.setItem('pwa_prompt_dismissed_session', 'true');
  };

  const handleInstall = () => {
    // On Android, we could try to trigger the native prompt if we have the event, 
    // but for now we follow the brief's manual instructions UI approach as it's more reliable across browsers
    // If we want to hide it after they click "Add to home screen"
    // dismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center pointer-events-none"
        >
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-5 w-full max-w-sm pointer-events-auto relative">
            <button 
              onClick={dismiss}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1 pr-8">
                <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Keep DinnerByDesign handy</h3>
                <p className="text-[14px] text-gray-600 leading-snug">
                  Add it to your home screen for faster access to recipes, plans and shopping.
                </p>
              </div>

              <div className="pt-2">
                {platform === 'ios' ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex items-start gap-3 text-[13px] text-gray-700">
                      <Share className="w-5 h-5 text-accent shrink-0" />
                      <span>Tap the <b>Share icon</b> at the bottom of your screen.</span>
                    </div>
                    <div className="flex items-start gap-3 text-[13px] text-gray-700">
                      <PlusSquare className="w-5 h-5 text-gray-900 shrink-0" />
                      <span>Scroll down and select <b>'Add to Home Screen'</b>.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={handleInstall}
                      className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl text-[15px] font-bold shadow-sm hover:bg-gray-800 transition-colors"
                    >
                      Add to home screen
                    </button>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 italic text-[12px] text-gray-600 text-center leading-relaxed">
                      Tap the three dots (⋮) in your browser menu and select 'Install' or 'Add to home screen'.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={dismiss}
                  className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
