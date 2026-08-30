import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, actionLabel, onAction, onClose }) => {
  const actionHandledRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const handleAction = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (actionHandledRef.current) return;
    actionHandledRef.current = true;
    onAction?.();
    onClose();
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: 'easeOut' }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
      role="status"
      aria-live="polite"
    >
      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-white/10 backdrop-blur-sm">
        <div className="flex-1 text-sm font-medium leading-tight">
          {message}
        </div>
        
        <div className="flex items-center gap-2">
          {actionLabel && onAction && (
            <button
              type="button"
              onTouchEnd={handleAction}
              onPointerUp={handleAction}
              onClick={handleAction}
              className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {actionLabel}
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
