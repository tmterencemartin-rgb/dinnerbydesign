import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const NumberStepper = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 20, 
  label = "portions",
  className = "" 
}: NumberStepperProps) => (
  <div className={`flex items-center bg-white border border-gray-200 rounded overflow-hidden ${className}`}>
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-r border-gray-100 disabled:opacity-30"
      disabled={value <= min}
    >
      <Minus className="w-3 h-3" />
    </button>
    <div className="flex-grow flex items-center justify-center px-2 min-w-[2.5rem]">
      <span className="text-[12px] font-semibold text-gray-900 leading-none">{value}</span>
      <span className="ml-1 text-[10px] font-medium text-gray-500 tracking-tight leading-none">{label}</span>
    </div>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-l border-gray-100 disabled:opacity-30"
      disabled={value >= max}
    >
      <Plus className="w-3 h-3" />
    </button>
  </div>
);
