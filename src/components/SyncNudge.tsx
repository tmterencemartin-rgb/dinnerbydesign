import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SyncNudgeProps {
  onNavigate?: (view: any, highlight?: string) => void;
  showLowCost?: boolean;
}

export const SyncNudge: React.FC<SyncNudgeProps> = ({ onNavigate, showLowCost = true }) => {
  const { user, profile, setView: authSetView } = useAuth();
  
  const handleNavigate = (view: any, highlight?: string) => {
    if (onNavigate) {
      onNavigate(view, highlight);
    } else {
      authSetView(view);
    }
  };

  // If user is not anonymous (signed in with Google/Email), we don't need the sync nudge
  if (!user || !user.isAnonymous) return null;

  const isLowCostEnabled = profile?.preferences?.isLowCost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50/50 border border-gray-100 rounded-lg overflow-hidden shadow-sm"
    >
      <div className="p-3 space-y-2">
        {showLowCost && !isLowCostEnabled && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[12px] text-gray-500 leading-relaxed">
                <span className="text-[12px] font-bold text-gray-900 mr-2">Food prices rising?</span>
                Switch on <button onClick={() => handleNavigate('settings', 'isLowCost')} className="text-accent font-bold hover:underline">Low-cost recipes</button> recipes in settings.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-gray-500 leading-tight">
              Your saves and shopping list are stored on this browser. Sign in to keep them across devices.
            </p>
          </div>
          <button
            id="sync-nudge-cta"
            onClick={() => handleNavigate('settings')}
            className="text-[12px] font-bold text-accent hover:underline flex items-center gap-1 transition-all group px-1 whitespace-nowrap"
          >
            Sign In
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
