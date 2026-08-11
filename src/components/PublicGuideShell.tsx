import React from 'react';
import {
  PUBLIC_PATHWAYS,
  getPublicPathway,
  getPublicPathwayForArticle,
} from '../content/publicPathways';

const CONTACT_EMAIL = 'terence@dinnerbydesign.app';

const getBreadcrumbs = (pathName: string) => {
  if (pathName === '/guides') return [{ label: 'Explore' }];
  const pathway = getPublicPathway(pathName);
  if (pathway) return [{ label: pathway.title }];
  const articlePathway = getPublicPathwayForArticle(pathName);
  if (articlePathway) return [{ label: articlePathway.title, href: articlePathway.path }, { label: 'Guide' }];
  return [{ label: 'Explore', href: '/guides' }];
};

const PublicGuideFooter: React.FC = () => (
  <footer className="mt-auto border-t border-dbd-rule/50 bg-dbd-surface py-5 sm:py-6">
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 text-center sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:text-left">
      <div className="space-y-1 text-[11px] leading-5 text-dbd-ink-3 sm:text-xs">
        <p>&copy; {new Date().getFullYear()} DinnerByDesign. All rights reserved.</p>
        <p className="font-semibold text-dbd-ink-3/70">Less searching. Precise matches. Dinner, decided.</p>
        <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Contact DinnerByDesign" className="inline-block font-semibold text-dbd-accent hover:underline">
          {CONTACT_EMAIL}
        </a>
      </div>
      <nav aria-label="Footer" className="grid grid-cols-3 gap-x-3 gap-y-3 text-left text-[10.5px] leading-4 text-dbd-ink-3 sm:flex sm:max-w-xl sm:flex-wrap sm:justify-end sm:gap-x-5 sm:gap-y-1 sm:text-xs">
        <div className="min-w-0 sm:contents">
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Guides</p>
          <div className="flex flex-col gap-1.5 sm:contents">
            <a href="/dinner-plans" className="hover:text-dbd-accent">Affordable dinner plans</a>
            <a href="/recipes" className="hover:text-dbd-accent">Recipes and cooking ideas</a>
            <a href="/food-costs" className="hover:text-dbd-accent">Food-cost &amp; waste</a>
          </div>
        </div>
        <div className="min-w-0 sm:contents">
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Information</p>
          <div className="flex flex-col gap-1.5 sm:contents">
            <a href="/contact" className="hover:text-dbd-accent">Contact us</a>
            <a href="/pricing-methodology" className="hover:text-dbd-accent">How prices are calculated</a>
            <a href="/food-safety" className="hover:text-dbd-accent">Food safety</a>
            <a href="/recipe-methodology" className="hover:text-dbd-accent">Recipe information</a>
            <a href="/nutrition-methodology" className="hover:text-dbd-accent">Nutrition estimates</a>
          </div>
        </div>
        <div className="min-w-0 sm:contents">
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Legal</p>
          <div className="flex flex-col gap-1.5 sm:contents">
            <a href="/privacy" className="hover:text-dbd-accent">Privacy &amp; cookies</a>
            <a href="/terms" className="hover:text-dbd-accent">Terms of Service</a>
          </div>
        </div>
      </nav>
      <p className="border-t border-dbd-rule/40 pt-3 text-center text-[10px] leading-5 text-dbd-ink-3/70 sm:col-span-2 sm:text-left sm:text-[11px]">
        DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
      </p>
    </div>
  </footer>
);

export const PublicGuideShell: React.FC<{ pathName: string; children: React.ReactNode }> = ({ pathName, children }) => {
  const breadcrumbs = getBreadcrumbs(pathName);
  const isCollection = pathName === '/guides' || Boolean(getPublicPathway(pathName));

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] text-dbd-ink">
      <header className="border-b border-dbd-rule/50 bg-dbd-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-3 sm:min-h-[88px] sm:flex-nowrap sm:py-0">
          <a href="/" aria-label="DinnerByDesign home">
            <img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[30.6px] w-auto max-w-[189px] object-contain mix-blend-multiply sm:h-[36px]" />
          </a>
          <nav aria-label="Public pathways" className="order-last flex w-full items-center justify-between gap-3 border-t border-dbd-rule/40 pt-2.5 text-[10px] font-semibold text-dbd-ink-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0 sm:text-xs">
            {PUBLIC_PATHWAYS.map(pathway => (
              <a key={pathway.id} href={pathway.path} aria-current={pathName === pathway.path ? 'page' : undefined} className="text-center leading-4 hover:text-dbd-accent aria-[current=page]:text-dbd-accent">
                {pathway.id === 'food-costs' ? 'Food-cost & waste' : pathway.title}
              </a>
            ))}
          </nav>
          <a href="/signin?mode=signin" className="text-xs font-semibold text-dbd-accent hover:underline">Sign in</a>
        </div>
      </header>

      <div className={`mx-auto w-full px-4 pt-5 ${isCollection ? 'max-w-5xl sm:pt-7' : 'max-w-3xl sm:pt-8'}`}>
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
