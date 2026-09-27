import React from 'react';
import {
  PUBLIC_PATHWAYS,
  getPublicPathway,
  getPublicPathwayForArticle,
} from '../content/publicPathways';
import { Wordmark } from './Wordmark';
import { Menu, X } from 'lucide-react';

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
  <footer className="mt-auto border-t border-gray-100 bg-gray-50 py-4 sm:py-6">
    <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-5 px-3 sm:px-4 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.8fr)] md:items-start lg:grid-cols-[minmax(340px,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-x-12 lg:px-6">
      <div className="flex min-w-0 flex-col items-center md:items-start">
        <div className="relative z-10 flex flex-col items-center gap-0.5 text-[12px] text-gray-500 sm:gap-1 sm:text-[13px] md:items-start">
          <span>&copy; {new Date().getFullYear()} DinnerByDesign. All rights reserved.</span>
          <span className="text-[12px] font-semibold text-gray-500 sm:text-[12px]">Less searching. More relevant dinners.</span>
          <a href="/contact" aria-label="Open contact form" className="relative z-50 block py-0.5 text-[12px] font-semibold text-dbd-accent transition-colors hover:text-dbd-accent-mid hover:underline sm:text-xs">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <nav aria-label="Footer" className="grid grid-cols-3 justify-items-start gap-x-3 text-left sm:justify-items-center sm:gap-x-6 md:justify-items-start lg:col-span-3">
        <div className="min-w-0">
          <p className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-gray-500">Guides</p>
          <div className="flex flex-col items-start gap-1.5 md:gap-2">
            <a href="/dinner-plans" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Affordable dinner plans</a>
            <a href="/recipes" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Recipes and cooking ideas</a>
            <a href="/food-costs" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Food-cost &amp; waste</a>
            <a href="/why-dinnerbydesign" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Why DinnerByDesign?</a>
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-gray-500">Information</p>
          <div className="flex flex-col items-start gap-1.5 md:gap-2">
            <a href="/contact" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Contact us</a>
            <a href="/pricing-methodology" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">How prices are calculated</a>
            <a href="/food-safety" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Food safety</a>
            <a href="/recipe-methodology" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Recipe information</a>
            <a href="/nutrition-methodology" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Nutrition estimates</a>
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-gray-500">Legal</p>
          <div className="flex flex-col items-start gap-1.5 md:gap-2">
            <a href="/privacy" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Privacy &amp; cookies</a>
            <a href="/terms" className="text-[12px] leading-4 text-gray-500 transition-colors hover:text-gray-900 sm:whitespace-nowrap sm:text-[13px]">Terms of Service</a>
          </div>
        </div>
      </nav>
      <p className="border-t border-gray-200/50 pt-2.5 text-center text-[11px] leading-4 text-gray-500 sm:pt-3 sm:text-[12px] sm:leading-relaxed md:col-span-2 md:text-left lg:col-span-4">
        DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
      </p>
    </div>
  </footer>
);

export const PublicGuideShell: React.FC<{ pathName: string; children: React.ReactNode }> = ({ pathName, children }) => {
  const breadcrumbs = getBreadcrumbs(pathName);
  const isCollection = pathName === '/guides' || Boolean(getPublicPathway(pathName));
  const [isPublicNavOpen, setIsPublicNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] text-dbd-ink">
      <header className="border-b border-dbd-rule/50 bg-dbd-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 lg:min-h-[88px] lg:flex-nowrap lg:py-0">
          <a href="/" aria-label="DinnerByDesign home">
            <Wordmark className="text-[30.6px] sm:text-[36px]" />
          </a>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublicNavOpen(previous => !previous)}
              aria-expanded={isPublicNavOpen}
              aria-controls="public-pathways"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded text-dbd-ink-2 transition-colors hover:bg-dbd-accent-light hover:text-dbd-accent focus:outline-none lg:hidden"
            >
              {isPublicNavOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              <span className="sr-only">{isPublicNavOpen ? 'Close navigation' : 'Open navigation'}</span>
            </button>
            <a href="/signin?mode=signin" className="text-xs font-semibold text-dbd-accent hover:underline">Sign in</a>
          </div>
          <nav
            id="public-pathways"
            aria-label="Public pathways"
            className={`${isPublicNavOpen ? 'flex' : 'hidden'} order-last w-full flex-col gap-2 border-t border-dbd-rule/40 pt-2.5 text-[11px] font-semibold text-dbd-ink-2 lg:order-none lg:flex lg:w-auto lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:border-0 lg:pt-0 lg:text-xs`}
          >
            {PUBLIC_PATHWAYS.map(pathway => (
              <a key={pathway.id} href={pathway.path} aria-current={pathName === pathway.path ? 'page' : undefined} className="leading-4 hover:text-dbd-accent aria-[current=page]:text-dbd-accent lg:text-center">
                {pathway.id === 'food-costs' ? 'Food-cost & waste' : pathway.title}
              </a>
            ))}
          </nav>
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
