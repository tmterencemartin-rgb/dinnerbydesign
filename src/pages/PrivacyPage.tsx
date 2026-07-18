import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface PrivacyPageProps {
  setView?: (view: any) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ setView }) => {
  const { user } = useAuth();
  const isGuest = !user || user.isAnonymous;
  const backTarget = isGuest ? 'landing' : 'settings';
  const backLabel = isGuest ? '← Back to Landing' : '← Back to Settings';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto px-4 py-12 pb-20 select-text"
    >
      {setView && (
        <button 
          id="back-to-settings-btn-privacy"
          onClick={() => {
            setView(backTarget); 
          }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors mb-6 bg-transparent border-none p-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded"
        >
          <span>{backLabel}</span>
        </button>
      )}

      <h1 className="text-[24px] leading-9 font-bold text-gray-900">Privacy & cookies</h1>
      <p className="text-[11px] text-gray-400 italic mb-4">Last updated: 6 July 2026</p>
      
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign is designed to be lean, practical, and low-clutter. This page explains what information the app needs, why it is used, and how cookies or similar browser storage are handled.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">1. Information we collect</h2>
      <div className="space-y-3 text-[14px] leading-relaxed text-gray-600">
        <p>
          <strong className="text-gray-800">A. Account details:</strong> If you create an account, we store the details needed to run it, such as your email address, sign-in provider, subscription status, trial status, and account access level.
        </p>
        <p>
          <strong className="text-gray-800">B. App data:</strong> To provide the service, we store information such as your preferences, saved dinners, weekly schedule, shopping list, search history, account settings, and email notification records.
        </p>
        <p>
          <strong className="text-gray-800">C. Search inputs:</strong> When you search, the app processes the words, filters, budget, timing, source choices, retailer choices, and preference settings needed to return suitable dinner results.
        </p>
        <p>
          <strong className="text-gray-800">D. Support messages:</strong> If you contact us at <a href="mailto:chef@dinnerbydesign.app" className="text-accent font-semibold hover:underline">chef@dinnerbydesign.app</a>, we use your message and contact details to respond.
        </p>
      </div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">2. How we use your information</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We use this information to provide search, saved dinners, scheduling, shopping lists, account access, subscription handling, support, security, and service diagnostics. We do not sell your personal data.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">3. Cookies and browser storage</h2>
      <div className="space-y-3 text-[14px] leading-relaxed text-gray-600">
        <p>
          DinnerByDesign may use cookies, local storage, IndexedDB, or similar browser storage where needed for sign-in, security, account continuity, saved app state, preferences, and core functionality.
        </p>
        <p>
          These are used to provide the service you request. We do not use advertising cookies, tracking pixels, sponsor tracking, or behavioural ad profiling.
        </p>
        <p>
          If non-essential analytics are added in future, they will be off unless you actively choose to allow them.
        </p>
      </div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">4. Service providers</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We use trusted service providers to operate the app, including hosting, database, authentication, payment processing, email delivery, and search processing. They receive only the information needed to provide those services. We may also disclose information where required by law or to protect the service and its users.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">5. Third-party websites and sources</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign links to external publishers, supermarkets, and other third-party sites. Once you leave DinnerByDesign, those sites are responsible for their own privacy practices and content.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">6. Data security</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We use reasonable technical and organisational measures to protect account and app data. No online service can guarantee complete security, but we aim to keep the data we hold limited, useful, and protected.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">7. Your choices</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        You can update app preferences in your account settings. You can contact us to ask about personal data linked to your account, or to request deletion where applicable.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">8. Children's privacy</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign is not intended for children under 13. We do not knowingly collect personal information from children under 13.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">9. Changes to this notice</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We may update this notice from time to time. The latest version will be posted on this page.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">10. Contact us</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed font-sans">
        If you have questions about privacy or cookies, contact:<br />
        <a href="mailto:chef@dinnerbydesign.app" className="text-accent font-semibold hover:underline">chef@dinnerbydesign.app</a>
      </p>
    </motion.div>
  );
};
