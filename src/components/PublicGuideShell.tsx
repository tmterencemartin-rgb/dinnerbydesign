import React from 'react';

const CONTACT_EMAIL = 'chef@dinnerbydesign.app';

const getBreadcrumbs = (pathName: string) => {
  if (pathName === '/guides') return [{ label: 'Guides' }];
  if (pathName.startsWith('/dinner-plans/')) return [{ label: 'Affordable dinner plans' }];
  if (pathName.startsWith('/guides/')) {
    return [{ label: 'Guides', href: '/guides' }, { label: 'Food cost guide' }];
  }
  return [{ label: 'Guides', href: '/guides' }, { label: 'Food cost guides' }];
};

const PublicGuideFooter: React.FC = () => (
  <footer className="mt-auto border-t border-dbd-rule/50 bg-dbd-surface py-5 sm:py-6">
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 text-center sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:text-left">
      <div className="space-y-1 text-[11px] leading-5 text-dbd-ink-3 sm:text-xs">
        <p>&copy; {new Date().getFullYear()} DinnerByDesign. All rights reserved.</p>
        <p className="font-semibold text-dbd-ink-3/70">Less searching. Better matches. Dinner, decided.</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block font-semibold text-dbd-accent hover:underline">
          {CONTACT_EMAIL}
        </a>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-dbd-ink-3 sm:max-w-xl sm:justify-end sm:text-xs">
        <a href="/guides" className="hover:text-dbd-accent">Guides</a>
        <a href="/pricing-methodology" className="hover:text-dbd-accent">How prices are calculated</a>
        <a href="/food-safety" className="hover:text-dbd-accent">Food safety</a>
        <a href="/recipe-methodology" className="hover:text-dbd-accent">Recipe information</a>
        <a href="/nutrition-methodology" className="hover:text-dbd-accent">Nutrition estimates</a>
        <a href="/privacy" className="hover:text-dbd-accent">Privacy &amp; cookies</a>
        <a href="/terms" className="hover:text-dbd-accent">Terms of Service</a>
      </nav>
      <p className="border-t border-dbd-rule/40 pt-3 text-center text-[10px] leading-5 text-dbd-ink-3/70 sm:col-span-2 sm:text-left sm:text-[11px]">
        DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
      </p>
    </div>
  </footer>
);

export const PublicGuideShell: React.FC<{ pathName: string; children: React.ReactNode }> = ({ pathName, children }) => {
  const breadcrumbs = getBreadcrumbs(pathName);
  const isLibrary = pathName === '/guides';

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] text-dbd-ink">
      <header className="border-b border-dbd-rule/50 bg-dbd-surface">
        <div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between px-4 sm:min-h-[88px]">
          <a href="/" aria-label="DinnerByDesign home">
            <img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[30.6px] w-auto max-w-[189px] object-contain mix-blend-multiply sm:h-[36px]" />
          </a>
          <a href="/signin?mode=signin" className="text-xs font-semibold text-dbd-accent hover:underline">Sign in</a>
        </div>
      </header>

      <div className={`mx-auto w-full px-4 pt-5 ${isLibrary ? 'max-w-5xl sm:pt-7' : 'max-w-3xl sm:pt-8'}`}>
        <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3">
          <a href="/" className="hover:underline">DinnerByDesign</a>
          {breadcrumbs.map(crumb => (
            <React.Fragment key={crumb.label}>
              <span className="px-2">/</span>
              {crumb.href ? <a href={crumb.href} className="hover:underline">{crumb.label}</a> : <span>{crumb.label}</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex-1 [&>div]:min-h-0 [&>div>header]:hidden [&>div>main>nav:first-child]:hidden [&>div>main]:pt-4 sm:[&>div>main]:pt-6">
        {children}
      </div>

      <PublicGuideFooter />
    </div>
  );
};
