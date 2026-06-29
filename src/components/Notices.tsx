import React from 'react';
import { Info } from 'lucide-react';

interface GuidanceNoticeProps {
  hasCost: boolean;
  mode?: 'cook' | 'ready-made';
  className?: string;
}

export const GuidanceNotice = ({ hasCost, mode = 'cook', className = "" }: GuidanceNoticeProps) => {
  const guidanceText = mode === 'ready-made' 
    ? "Estimated price for one adult portion, based on typical UK retail cost. Individual retailers vary, and premium products may cost more."
    : "Estimated cost for one adult portion, based on official UK market data. Actual prices vary by season and retailer.";

  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
      <div className="space-y-1 min-w-0">
        <p className="text-[10px] sm:text-[10.5px] font-bold text-gray-400 uppercase tracking-widest leading-none">Guidance</p>
        <p className="text-[11px] sm:text-[11.5px] font-medium text-gray-500/90 leading-snug">
          Check ingredients, quantities, timings and retailer details before cooking or buying.
        </p>
        {hasCost && (
          <p className="text-[11px] sm:text-[12px] font-medium text-gray-500/90 leading-snug">
            {guidanceText}
          </p>
        )}
      </div>
    </div>
  );
};
