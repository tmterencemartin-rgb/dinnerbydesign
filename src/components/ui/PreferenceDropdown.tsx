import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface PreferenceDropdownProps {
  label: string;
  options: string[];
  selected: string | string[] | null;
  onSelect: (val: any) => void;
  isMulti?: boolean;
  placeholder?: string;
}

export const PreferenceDropdown = ({ 
  label, 
  options, 
  selected, 
  onSelect, 
  isMulti = false,
  placeholder = "Select..."
}: PreferenceDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const isSelected = (opt: string) => {
    if (isMulti) return (selected as string[])?.includes(opt);
    return selected === opt;
  };

  const handleToggle = (opt: string) => {
    if (isMulti) {
      const current = (selected as string[]) || [];
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
    <div className="space-y-2">
      <label className="block text-[12px] text-gray-500 font-normal">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-100 text-[13px] text-gray-700 hover:bg-gray-50 transition-all"
        >
          <span className={((isMulti ? (selected as string[])?.length : selected) ? 'text-gray-900' : 'text-gray-500')}>
            {getDisplayValue()}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 shadow-lg max-h-60 overflow-y-auto">
              {options.map((opt) => {
                const active = isSelected(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggle(opt)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors group text-left"
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
      {isMulti && (selected as string[])?.length > 0 && !isOpen && (
        <p className="text-[12px] text-gray-500 px-1 leading-relaxed">
          {(selected as string[]).join(', ')}
        </p>
      )}
    </div>
  );
};
