import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface TermsViewProps {
  setView: (view: any) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ setView }) => {
  const { user } = useAuth();
  const isGuest = !user || user.isAnonymous;
  const backTarget = isGuest ? 'landing' : 'settings';
  const backLabel = isGuest ? '← Back to Landing' : '← Back to Settings';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
      className="max-w-2xl mx-auto px-4 py-12 pb-20"
    >
      <button 
        id="back-to-settings-btn-terms"
        onClick={() => {
          setView(backTarget); 
        }}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 bg-transparent border-none p-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded"
      >
        <span>{backLabel}</span>
      </button>

      <div className="prose prose-sm max-w-none">
        <h1 className="text-[24px] font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="space-y-6 text-[14px] text-gray-600 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By using DinnerByDesign, you agree to these terms. If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-gray-900">2. Nature of Service</h2>
            <p>
              This application provides generated dinner suggestions. While we strive for accuracy, users should always verify details, especially ingredient safety and cooking times, before preparation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-gray-900">3. User Responsibility</h2>
            <p>
              You are responsible for maintaining the privacy of your session and for all activities that occur under your user ID.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-gray-900">4. Modifications</h2>
            <p>
              We reserve the right to modify or terminate the service at any time without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-gray-900">5. Independent Application & Attribution</h2>
            <p>
              DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, or food brand mentioned on this platform. Chef names are used solely as descriptive search filters to help users find recipes in a particular culinary style. All recipes are sourced from their respective websites and full attribution is provided. DinnerByDesign claims no ownership of third-party recipe content.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-[12px] font-mono text-gray-400">Last updated: May 2026</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
