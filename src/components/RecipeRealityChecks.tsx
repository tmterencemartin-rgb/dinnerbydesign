import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { RealityCheck } from '../types';

interface RecipeRealityChecksProps {
  checks?: RealityCheck[];
  compact?: boolean;
}

const toneClasses: Record<RealityCheck['tone'], string> = {
  positive: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  caution: 'bg-amber-50 text-amber-900 border-amber-100',
  neutral: 'bg-gray-50 text-gray-700 border-gray-100'
};

const toneIcons: Record<RealityCheck['tone'], React.ReactNode> = {
  positive: <CheckCircle2 className="w-3.5 h-3.5" />,
  caution: <AlertTriangle className="w-3.5 h-3.5" />,
  neutral: <Info className="w-3.5 h-3.5" />
};

export const RecipeRealityChecks: React.FC<RecipeRealityChecksProps> = ({ checks, compact = false }) => {
  const visibleChecks = (checks || [])
    .filter(check => check?.label && check?.note)
    .slice(0, compact ? 2 : 3);

  if (visibleChecks.length === 0) return null;

  return (
    <div className="w-full space-y-1 sm:space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[9.5px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Reality check
        </span>
        <span className="h-px flex-1 bg-gray-100" />
      </div>
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-1 sm:gap-1.5`}>
        {visibleChecks.map((check, index) => {
          const tone = check.tone || 'neutral';

          return (
            <div
              key={`${check.label}-${index}`}
              className={`flex items-start gap-1.5 sm:gap-2 rounded border px-2 py-1.5 ${toneClasses[tone] || toneClasses.neutral}`}
            >
              <span className="mt-0.5 shrink-0">{toneIcons[tone] || toneIcons.neutral}</span>
              <p className="min-w-0 text-[11px] sm:text-[11.5px] leading-snug">
                <span className="font-bold">{check.label}:</span>{' '}
                <span className="font-medium opacity-85">{check.note}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
