import React from 'react';
import { X } from 'lucide-react';

interface CircleXProps {
  size?: string;
  className?: string;
}

export const CircleX = ({ size = "12", className = "" }: { size?: string | number, className?: string }) => (
  <span className={`inline-flex items-center justify-center rounded-full bg-gray-100 p-1 shrink-0 ${className}`}>
    <X size={Number(size)} strokeWidth={3} className="text-[#8c7355]" />
  </span>
);
