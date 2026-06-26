import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
}

export const ToggleSwitch = ({ enabled, onChange }: ToggleSwitchProps) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-accent' : 'bg-gray-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-4' : 'translate-x-0.5'
      }`}
    />
  </button>
);
