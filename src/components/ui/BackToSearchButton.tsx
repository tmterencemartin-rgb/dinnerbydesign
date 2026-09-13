import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackToSearchButtonProps {
  onClick: () => void;
  id?: string;
}

export const BackToSearchButton: React.FC<BackToSearchButtonProps> = ({ onClick, id }) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    className="fixed right-4 top-1/2 z-50 inline-flex min-h-9 -translate-y-1/2 items-center gap-1.5 rounded border border-gray-200 bg-white px-3 text-[11px] font-bold uppercase tracking-widest text-gray-700 shadow-sm transition-colors hover:border-dbd-accent hover:text-dbd-accent sm:right-6"
  >
    <ChevronLeft className="h-4 w-4 -ml-0.5" aria-hidden="true" />
    Back to search
  </button>
);
