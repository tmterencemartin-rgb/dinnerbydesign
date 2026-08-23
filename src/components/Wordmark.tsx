import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface WordmarkProps {
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({ className = '' }) => (
  <span className={`relative inline-flex whitespace-nowrap pl-[0.98em] font-wordmark font-bold leading-none tracking-[-0.04em] text-gray-700 ${className}`}>
    <LogoIcon className="absolute left-0 top-1/2 h-[0.9em] w-[0.9em] -translate-y-1/2" />
    <span>Dinner</span><span className="text-dbd-accent">By</span><span>Design</span>
  </span>
);
