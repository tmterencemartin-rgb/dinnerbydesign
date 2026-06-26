import { useEffect } from 'react';

export interface SeoConfig {
  title: string;
  description?: string;
  jsonLd?: object;
}

export function useSeo({ title, description, jsonLd }: SeoConfig) {
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
      metaDescription.setAttribute('content', 'Bespoke food planning, intelligent recipe personalization, and integrated smart shopping lists.');
    }

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
  }, [title, description, JSON.stringify(jsonLd)]);
}
