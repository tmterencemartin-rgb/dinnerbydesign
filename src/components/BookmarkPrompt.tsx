import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, X } from 'lucide-react';
import { safeStorage } from '../lib/storage';

const BOOKMARK_DISMISSED_KEY = 'dbd_bookmark_prompt_dismissed';
const BOOKMARK_SESSION_KEY = 'dbd_bookmark_prompt_dismissed_session';

export const BookmarkPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shortcut, setShortcut] = useState('Ctrl + D');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://');

    if (isMobile || isStandalone) return;

    const isMac = /mac|iphone|ipad|ipod/.test(window.navigator.platform.toLowerCase());
    setShortcut(isMac ? 'Cmd + D' : 'Ctrl + D');

    const handleMeaningfulAction = () => {
      const dismissedSession = safeStorage.session.getItem(BOOKMARK_SESSION_KEY);
      const dismissedPermanent = safeStorage.getItem(BOOKMARK_DISMISSED_KEY);
      const alreadyShown = safeStorage.session.getItem('dbd_bookmark_prompt_shown_session');

      if (!dismissedSession && !dismissedPermanent && !alreadyShown) {
        safeStorage.session.setItem('dbd_bookmark_prompt_shown_session', 'true');
        setIsVisible(true);
      }
    };

    window.addEventListener('pwa-meaningful-action', handleMeaningfulAction);

    return () => window.removeEventListener('pwa-meaningful-action', handleMeaningfulAction);
  }, []);

  const dismissForSession = () => {
    setIsVisible(false);
    safeStorage.session.setItem(BOOKMARK_SESSION_KEY, 'true');
  };

  const dismissPermanently = () => {
    setIsVisible(false);
    safeStorage.setItem(BOOKMARK_DISMISSED_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-[95] pointer-events-none"
        >
          <div className="bg-white border border-gray-100 shadow-xl rounded p-4 w-full sm:w-[340px] pointer-events-auto relative">
            <button
              type="button"
              onClick={dismissForSession}
              className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
              aria-label="Dismiss bookmark prompt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-5">
              <div className="w-9 h-9 rounded bg-dbd-accent/10 flex items-center justify-center shrink-0">
                <Bookmark className="w-4 h-4 text-dbd-accent" />
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-gray-950 leading-tight">Bookmark DinnerByDesign</h3>
                  <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed">
                    Keep this site handy by pressing <span className="font-bold text-gray-800">{shortcut}</span>, or use your browser menu to add a bookmark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismissPermanently}
                  className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-dbd-accent transition-colors"
                >
                  Do not show again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
