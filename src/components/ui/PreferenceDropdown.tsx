import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface PreferenceDropdownProps {
  label: string;
  options: string[];
  selected: string | string[] | null;
  onSelect: (val: any) => void;
  isMulti?: boolean;
  placeholder?: string;
  maxSelected?: number;
  hint?: string;
  compact?: boolean;
  hideSelectedSummary?: boolean;
}

export const PreferenceDropdown = ({ 
  label, 
  options, 
  selected, 
  onSelect, 
  isMulti = false,
  placeholder = "Select...",
  maxSelected,
  hint,
  compact = false,
  hideSelectedSummary = false
}: PreferenceDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const isSelected = (opt: string) => {
    if (isMulti) return (selected as string[])?.includes(opt);
    return selected === opt;
  };

  const handleToggle = (opt: string) => {
    if (isMulti) {
      const current = (selected as string[]) || [];
      if (!isSelected(opt) && maxSelected && current.length >= maxSelected) return;
      const next = isSelected(opt) ? current.filter(o => o !== opt) : [...current, opt];
      onSelect(next);
    } else {
      onSelect(isSelected(opt) ? null : opt);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (isMulti) {
      const count = (selected as string[])?.length || 0;
      return count > 0 ? `${count} selected` : placeholder;
    }
    return (selected as string) || placeholder;
  };

  return (
    <div className={`space-y-2 relative ${isOpen ? 'z-50' : 'z-0'}`}>
      <div className="flex items-center justify-between gap-2">
        <label className={compact ? "block text-[10px] font-bold uppercase tracking-widest text-gray-500" : "block text-[12px] text-gray-500 font-normal"}>{label}</label>
        {hint && <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">{hint}</span>}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 transition-all ${compact ? 'h-10 px-3 text-[12px] font-semibold' : 'px-4 py-2.5 text-[13px]'}`}
        >
          <span className={`truncate ${((isMulti ? (selected as string[])?.length : selected) ? 'text-gray-900' : 'text-gray-500')}`}>
            {getDisplayValue()}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className={`absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 shadow-lg overflow-y-auto ${compact ? 'max-h-44' : 'max-h-60'}`}>
              {options.map((opt) => {
                const active = isSelected(opt);
                const disabled = isMulti && !active && !!maxSelected && ((selected as string[])?.length || 0) >= maxSelected;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggle(opt)}
                    disabled={disabled}
                    className={`w-full flex items-center justify-between px-4 text-[13px] transition-colors group text-left ${compact ? 'py-2' : 'py-2.5'} ${disabled ? 'cursor-not-allowed opacity-35' : 'hover:bg-gray-50'}`}
                  >
                    <span className={active ? 'text-gray-900 font-medium' : 'text-gray-600'}>{opt}</span>
                    <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                      active ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200 group-hover:border-gray-300'
                    }`}>
                      {active && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      {isMulti && !hideSelectedSummary && (selected as string[])?.length > 0 && !isOpen && (
        <p className="text-[12px] text-gray-500 px-1 leading-relaxed">
          {(selected as string[]).join(', ')}
        </p>
      )}
    </div>
  );
};
