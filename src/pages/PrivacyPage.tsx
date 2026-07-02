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
      className="max-w-4xl mx-auto px-4 py-12 select-text"
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

      <h1 className="text-xl font-bold text-gray-900">Privacy Policy for DinnerByDesign</h1>
      <p className="text-[11px] text-gray-400 italic mb-4">Last Updated: May 29, 2026</p>
      
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        DinnerByDesign ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web platform (the "Application"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">1. Information We Collect</h2>
      <div className="space-y-3 text-xs text-gray-600">
        <p>
          <strong className="text-gray-800">A. Personal Data:</strong> DinnerByDesign is designed to be a high-efficiency utility. We do not require you to create an account, log in, or provide personal identifiable information (such as your name, phone number, or physical address) to use the core recipe search features. If you contact us directly via our support channel (<code className="bg-gray-100 px-1 rounded text-gray-700">chef@dinnerbydesign.app</code>), we will retain your email address and message history solely to resolve your inquiry.
        </p>
        <p>
          <strong className="text-gray-800">B. Application Data & Local Storage:</strong> To provide features like the Save & Schedule planner and the Shop checklist matrix, the Application utilizes your device's native local storage (such as <code className="bg-gray-100 px-1 rounded text-gray-700">localStorage</code> or IndexedDB). Your saved recipes, weekly dinner schedules, and active grocery checklists are stored <span className="underline font-medium">locally on your device</span>. This data is not uploaded to our servers or synced to external databases.
        </p>
        <p>
          <strong className="text-gray-800">C. Search Queries & Automated Processing:</strong> When you execute a search query (including text inputs, selected filter attributes, or using Leftover Mode), these anonymized keywords are transmitted to third-party processing services (specifically Google Gemini APIs) to generate tailored recipe suggestions. These queries do not contain personal identification data.
        </p>
      </div>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">2. How We Use Your Information</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        We use the processing tokens collected through the application to generate precise, context-aware recipe suggestions matching your budget and ingredient preferences; process input parameters to prioritize zero-waste and food-waste reduction recipes when Leftover Mode is active; and maintain, optimize, and debug the local performance of the application dashboard.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">3. Disclosure of Your Information</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        We do not sell, trade, or rent your data to third-party advertisers. We may share anonymized search query attributes with our trusted service providers strictly to fulfill the search functionality of the application. We may also disclose information if required by law to comply with legal obligations or protect user safety.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">4. Third-Party Websites & Content</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        The Application contains links to external third-party recipe source websites. Once you use these links to leave the Application, any information you provide to these third parties is not covered by this Privacy Policy. We claim no ownership over third-party content and encourage you to review their respective privacy policies.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">5. Data Security</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        We implement standard technical and programmatic security measures designed to protect your locally cached app configurations. However, please be aware that no security measures are perfect or impenetrable, and no method of data transmission over the internet can be guaranteed against interception or misuse.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">6. Children's Privacy</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        Our Application does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we immediately delete this from our support records.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">7. Changes to This Privacy Policy</h2>
      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this document.
      </p>

      <div className="border-b border-gray-200/60 my-4" />

      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">8. Contact Us</h2>
      <p className="text-xs text-gray-600 leading-relaxed font-sans">
        If you have questions or comments about this Privacy Policy, please contact us at:<br />
        <a href="mailto:chef@dinnerbydesign.app" className="text-accent font-semibold hover:underline">chef@dinnerbydesign.app</a>
      </p>
    </motion.div>
  );
};
