import React from 'react';
import type { ProgrammaticDisclosureFooterCopy, ProgrammaticDisclosureItem } from '../content/programmaticDisclosures';
import { PROGRAMMATIC_DISCLOSURE_FOOTER } from '../content/programmaticDisclosures';

interface ProgrammaticDisclosureListProps {
  items: ProgrammaticDisclosureItem[];
  className?: string;
}

export const ProgrammaticDisclosureList: React.FC<ProgrammaticDisclosureListProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null;

  return (
    <aside aria-label="Important information" className={`rounded border border-[#ead8c4] bg-[#fff9f1] p-4 sm:p-5 ${className}`.trim()}>
      <div className="space-y-4">
        {items.map(item => (
          <section key={item.key}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b4c1f]">{item.title}</h2>
            <p className="mt-1.5 text-xs leading-5 text-dbd-ink-3">{item.body}</p>
          </section>
        ))}
      </div>
    </aside>
  );
};

interface ProgrammaticDisclosureFooterProps {
  copy?: ProgrammaticDisclosureFooterCopy;
  className?: string;
}

export const ProgrammaticDisclosureFooter: React.FC<ProgrammaticDisclosureFooterProps> = ({ copy = PROGRAMMATIC_DISCLOSURE_FOOTER, className = '' }) => (
  <aside aria-label="About this guide" className={`border-t border-dbd-rule/50 pt-6 ${className}`.trim()}>
    <h2 className="text-sm font-bold">About this guide</h2>
    <p className="mt-2 text-xs leading-5 text-dbd-ink-3">{copy.body}</p>
    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
      {copy.links.map(link => <a key={link.href} href={link.href} className="font-semibold text-dbd-accent hover:underline">{link.label}</a>)}
    </p>
  </aside>
);
