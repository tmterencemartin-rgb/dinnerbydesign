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
    <motion.main
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
      <p className="text-[11px] text-gray-500 italic mb-4">Last updated: 18 July 2026</p>
      
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        This notice explains what personal information DinnerByDesign uses, why it is needed, how AI and service providers are involved, how long information is retained, and the choices available to users.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">Who is responsible for your information</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign is the controller responsible for personal information processed through this service. Privacy questions and rights requests can be sent through the <a href="/contact" className="text-dbd-accent font-semibold hover:underline">contact form</a>.
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
          <strong className="text-gray-800">D. Support messages:</strong> If you contact us through the <a href="/contact" className="text-dbd-accent font-semibold hover:underline">contact form</a>, we use your message and contact details to respond.
        </p>
      </div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">2. How we use your information</h2>
      <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed mb-4"><p>We use information to provide search, saved dinners, scheduling, shopping lists, account access, subscription handling, support, security and service diagnostics. We do not sell personal data.</p><p>Our principal lawful bases are performance of the service contract, legitimate interests in operating and securing the service, compliance with legal obligations, and consent where the law requires it. Legitimate interests are used only where those interests are not overridden by the individual’s rights.</p></div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">3. AI processing and generated results</h2>
      <div className="space-y-3 text-[14px] leading-relaxed text-gray-600 mb-4"><p>Search wording and the settings needed to answer it—such as dietary rules, allergies, exclusions, budget, household size and preferred retailers—may be sent to Google’s Gemini service to generate or expand dinner suggestions and weekly plans.</p><p>Account email addresses, payment details and full account records are not intentionally included in AI prompts. Do not enter confidential personal information in a dinner search. Information typed into a search may be processed as part of that request.</p><p>DinnerByDesign does not use user searches to train its own AI model. AI output is automated and is not routinely reviewed by a person before being shown. It can be inaccurate, so the app applies structured checks and asks users to verify important information.</p></div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">4. Cookies and browser storage</h2>
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

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">5. Service providers and international processing</h2>
      <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed mb-4"><p>Core providers include Google Firebase for authentication and database services, Google Gemini for AI processing, Vercel for hosting, Stripe for subscriptions and payments, and Resend for service emails. They receive only the information needed for their role and process it under their own security and contractual obligations.</p><p>Some providers may process information outside the UK. Where UK data-protection law requires safeguards, transfers are made using an applicable adequacy regulation or contractual and organisational safeguards supplied by the provider.</p><p>Information may also be disclosed where required by law, to establish or defend legal rights, or to protect users and the service.</p></div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">6. Third-party websites and sources</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign links to external publishers, supermarkets, and other third-party sites. Once you leave DinnerByDesign, those sites are responsible for their own privacy practices and content.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">7. Retention and account deletion</h2>
      <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed mb-4"><p>Account information, preferences, saved dinners, schedules and shopping-list data are generally retained while the account remains active so the service can provide continuity across devices. Users can delete their account through Settings, subject to recent sign-in checks.</p><p>Deletion removes the active account information controlled by DinnerByDesign, but limited payment, invoice, security, email or diagnostic records may be retained where required for legal, tax, fraud-prevention or dispute purposes. Backup copies may persist temporarily until ordinary backup cycles replace them.</p><p>Where no fixed period is stated, retention is based on whether the information remains necessary for the purpose collected, legal obligations, security needs and the time reasonably required to resolve disputes.</p></div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">8. Data security</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We use reasonable technical and organisational measures to protect account and app data. No online service can guarantee complete security, but we aim to keep the data we hold limited, useful, and protected.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">9. Your data-protection rights</h2>
      <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed mb-4"><p>Depending on the circumstances, UK data-protection law may provide rights to access, correct, erase, restrict or receive personal information, and to object to particular processing. Consent can be withdrawn where processing depends on consent.</p><p><strong className="text-gray-800">Right to object:</strong> you may object to processing based on legitimate interests. The request will be considered against any compelling legitimate grounds or legal requirements.</p><p>Requests can be sent through the <a href="/contact" className="text-dbd-accent font-semibold hover:underline">contact form</a>. Identity may need to be verified. Users also have the right to complain to the UK Information Commissioner’s Office at <a href="https://ico.org.uk/make-a-complaint/" className="text-dbd-accent font-semibold hover:underline" target="_blank" rel="noreferrer">ico.org.uk</a>.</p></div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">10. Children's privacy</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        DinnerByDesign is not intended for children under 13. We do not knowingly collect personal information from children under 13.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">11. Changes to this notice</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
        We may update this notice from time to time. The latest version will be posted on this page.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-[18px] font-bold text-gray-900 mb-2">12. Contact us</h2>
      <p className="text-[14px] text-gray-600 leading-relaxed font-sans">
        If you have questions about privacy or cookies, contact:<br />
        <a href="/contact" className="text-dbd-accent font-semibold hover:underline">contact form</a>
      </p>
    </motion.main>
  );
};
