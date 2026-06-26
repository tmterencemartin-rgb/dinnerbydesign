import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const AiSafetyNotice = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-start gap-2 sm:gap-2.5 ${className}`}>
    <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600/70 shrink-0 mt-0" />
    <div className="space-y-0.5">
      <p className="text-[10px] sm:text-[11px] font-bold text-amber-900/60 uppercase tracking-widest leading-none">AI-generated</p>
      <p className="text-[10.5px] sm:text-[11.5px] font-medium text-gray-500/90 leading-snug">
        In the style of trusted UK recipe sites — check ingredients, quantities and cooking times before you start.
      </p>
    </div>
  </div>
);

interface CostDisclaimerNoticeProps {
  hasCost: boolean;
  mode?: 'cook' | 'ready-made';
  className?: string;
}

export const CostDisclaimerNotice = ({ hasCost, mode = 'cook', className = "" }: CostDisclaimerNoticeProps) => {
  if (!hasCost) return null;
  
  const guidanceText = mode === 'ready-made' 
    ? "Estimated price for one adult portion, based on typical UK retail cost. Individual retailers vary, and premium products may cost more."
    : "Estimated cost for one adult portion, based on official UK market data. Actual prices vary by season and retailer.";

  return (
    <div className={`flex items-start gap-2 sm:gap-2.5 ${className}`}>
      <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0 mt-0" aria-hidden="true" />
      <div className="space-y-0.5">
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          Pricing guidance
        </p>
        <p className="text-[10.5px] sm:text-[12px] font-medium text-gray-500/90 leading-snug">
          {guidanceText}
        </p>
      </div>
    </div>
  );
};
