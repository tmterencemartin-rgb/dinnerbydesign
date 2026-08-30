import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getRetailerCta } from '../lib/retailerUtils';
import { Tooltip } from './ui/Tooltip';

interface RetailerCtaLinkProps {
  product: any;
  type?: 'cook' | 'ready-made';
}

export const RetailerCtaLink = ({ product, type = 'ready-made' }: RetailerCtaLinkProps) => {
  if (type !== 'ready-made') return null;
  const cta = getRetailerCta(product);
  
  if (!cta) return null;

  return (
    <div className="w-full py-1 space-y-0.5">
      <div className="flex items-center gap-2">
        <Tooltip text="Redirects to retailer for purchase" className="relative inline-block">
          <a 
            href={cta.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            className="text-[13px] sm:text-[13.5px] text-accent hover:text-accent hover:underline transition-colors flex items-center gap-1.5 font-bold tracking-tight"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{cta.label}</span>
          </a>
        </Tooltip>
      </div>
      {cta.helper && (
        <p className="text-[11px] text-gray-500 font-medium pl-5 leading-tight">
          {cta.helper}
        </p>
      )}
    </div>
  );
};
