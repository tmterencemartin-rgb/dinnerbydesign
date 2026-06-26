import React from 'react';
import { CircleX } from './ui/CircleX';

interface SourceSwitcherProps {
  current: string;
  onSelect: (v: any) => void;
  targetDay: string | null;
  onCancel: () => void;
}

export const SourceSwitcher = ({ 
  current, 
  onSelect, 
  targetDay, 
  onCancel 
}: SourceSwitcherProps) => {
  const days: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  if (!targetDay) return null;

  return (
    <div className="bg-accent/5 border-b border-accent/10 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-display font-bold text-accent uppercase tracking-widest leading-none mb-1">Adding dinner</span>
          <span className="text-[13px] font-medium text-gray-900 leading-none">{days[targetDay]}</span>
        </div>
        <div className="h-6 w-px bg-accent/10 mx-1" />
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSelect('planner')}
            className={`text-[12px] font-medium transition-colors ${current === 'planner' ? 'text-accent underline underline-offset-4' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Saved
          </button>
          <button 
            onClick={() => onSelect('home')}
            className={`text-[12px] font-medium transition-colors ${current === 'home' ? 'text-accent underline underline-offset-4' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Search
          </button>
        </div>
      </div>
      <button 
        onClick={onCancel}
        className="text-[12px] text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
      >
        <CircleX size={12} className="mr-1.5" /> Cancel
      </button>
    </div>
  );
};
