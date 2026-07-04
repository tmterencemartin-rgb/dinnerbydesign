import { useEffect } from 'react';

export interface SeoConfig {
  title: string;
  description?: string;
  jsonLd?: object;
  canonicalPath?: string;
  noIndex?: boolean;
}

const SITE_URL = 'https://dinnerbydesign.app';

export function useSeo({ title, description, jsonLd, canonicalPath = '/', noIndex = false }: SeoConfig) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription.setAttribute('content', 'DinnerByDesign is an ad-free UK dinner recipe app for verified dinner ideas, ready-made supermarket options, preference-led search and costed shopping lists.');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${canonicalPath}`);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Update/Inject JSON-LD Schema
    let scriptTag = document.querySelector('script[data-seo-jsonld]');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }

    return () => {
      // Cleanup jsonLd script on unmount
      const script = document.querySelector('script[data-seo-jsonld]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, JSON.stringify(jsonLd), canonicalPath, noIndex]);
}
