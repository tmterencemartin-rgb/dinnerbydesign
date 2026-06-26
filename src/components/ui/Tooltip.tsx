import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  text: ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  interactive?: boolean;
  maxWidth?: string;
}

export const Tooltip = ({ 
  children, 
  text, 
  className = "relative inline-block", 
  position = 'top',
  align = 'center',
  interactive = false,
  maxWidth = "max-w-[240px]"
}: TooltipProps) => {
  const [show, setShow] = useState(false);

  const getAlignClasses = () => {
    switch (align) {
      case 'left': return 'left-0';
      case 'right': return 'right-0';
      default: return 'left-1/2 -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (align) {
      case 'left': return 'left-4';
      case 'right': return 'right-4';
      default: return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div 
      className={`${className} overflow-visible`} 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(true)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-[9999] ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} ${getAlignClasses()} px-2.5 py-1.5 bg-gray-900 text-white text-[11px] rounded whitespace-normal min-w-[140px] ${maxWidth} ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} shadow-xl border border-white/10 text-center leading-normal`}
          >
            {text}
            <div className={`absolute ${position === 'top' ? 'top-full border-t-gray-900' : 'bottom-full border-b-gray-900'} ${getArrowClasses()} border-4 border-transparent`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
