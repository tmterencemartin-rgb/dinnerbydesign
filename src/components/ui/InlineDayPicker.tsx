import React from 'react';
import { motion } from 'framer-motion';
import { CircleX } from './CircleX';
import { SavedRecipe } from '../../types';

interface InlineDayPickerProps {
  onSelect: (day: string) => void;
  onClose: () => void;
  planner: SavedRecipe[];
  currentDay?: string | null;
}

export const InlineDayPicker = ({ 
  onSelect, 
  onClose,
  planner,
  currentDay
}: InlineDayPickerProps) => {
  const days = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden border-t border-gray-50 bg-gray-50/50"
    >
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          {days.map(day => {
            const isPlanned = planner.some(p => p.scheduledDate === day.id);
            const isSelected = currentDay === day.id;
            
            return (
              <button
                key={day.id}
                onClick={() => onSelect(day.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  isSelected 
                    ? 'bg-accent text-white shadow-sm' 
                    : isPlanned 
                      ? 'bg-white text-gray-400 opacity-50 border border-gray-100' 
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-accent/30'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        <button 
          onClick={onClose}
          className="p-1 transition-colors"
        >
          <CircleX size={14} />
        </button>
      </div>
    </motion.div>
  );
};
