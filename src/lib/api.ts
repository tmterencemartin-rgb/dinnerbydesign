import { safeStorage } from './storage';

export interface ApiConfig {
  mode: 'proxy' | 'direct';
  customBaseUrl?: string;
  directApiKey?: string;
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname.startsWith('192.168.') ||
         window.location.hostname.startsWith('10.');
}

export function getApiConfig(): ApiConfig {
  let mode = (safeStorage.getItem('MODEL_API_MODE') as 'proxy' | 'direct') || 'proxy';
  const customBaseUrl = safeStorage.getItem('CUSTOM_API_BASE_URL') || undefined;
  let directApiKey = safeStorage.getItem('DIRECT_GEMINI_API_KEY') || undefined;

  // Production Guard: If not on localhost, force proxy mode to ensure all real traffic goes via Vercel
  if (mode === 'direct' && !isLocalhost()) {
    console.log("[API] Production environment detected. Forcing MODEL_API_MODE to 'proxy' for reliability.");
    mode = 'proxy';
  }
  
  if (directApiKey !== undefined) {
    const trimmed = directApiKey.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
      directApiKey = undefined;
    } else {
      directApiKey = trimmed;
    }
  }
  
  // Resilient fallback: If mode is direct but no client-side key is stored, fall back to proxy mode
  if (mode === 'direct' && !directApiKey) {
    mode = 'proxy';
  }
  
  return { mode, customBaseUrl, directApiKey };
}

export function setApiConfig(config: Partial<ApiConfig>) {
  if (config.mode) safeStorage.setItem('MODEL_API_MODE', config.mode);
  if (config.customBaseUrl !== undefined) {
    if (config.customBaseUrl) safeStorage.setItem('CUSTOM_API_BASE_URL', config.customBaseUrl);
    else safeStorage.removeItem('CUSTOM_API_BASE_URL');
  }
  if (config.directApiKey !== undefined) {
    if (config.directApiKey) safeStorage.setItem('DIRECT_GEMINI_API_KEY', config.directApiKey);
    else safeStorage.removeItem('DIRECT_GEMINI_API_KEY');
  }
}

/**
 * Resolves API endpoints in a standard web environment.
 * Uses VITE_API_BASE_URL if configured, otherwise falls back to a relative path
 * that resolves to the same origin.
 */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 1. Try custom overriding in localStorage (e.g., from Settings page)
  const customUrl = safeStorage.getItem('CUSTOM_API_BASE_URL');
  if (customUrl && customUrl !== 'undefined' && customUrl !== 'null' && customUrl.trim() !== '') {
    const trimmed = customUrl.trim();
    
    // Sanitization: If it's a known non-working IP for a shared preview, 
    // but we aren't currently browsing on that origin, ignore it to prevent the "10.0.2.2" error.
    if (typeof window !== 'undefined') {
      const isKnownLocal = trimmed.includes('10.0.2.2') || trimmed.includes('localhost') || trimmed.includes('127.0.0.1');
      const isOnSameOrigin = window.location.origin.includes(trimmed.replace(/^https?:\/\//, '').split(':')[0]);
      
      if (!isKnownLocal || isOnSameOrigin) {
        const cleanBase = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
        return `${cleanBase}${normalizedPath}`;
      } else {
        console.warn(`[API] Ignoring saved custom URL (${trimmed}) as it is likely unreachable from this origin (${window.location.origin}).`);
      }
    } else {
      const cleanBase = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
      return `${cleanBase}${normalizedPath}`;
    }
  }

  // 2. Try environment variable
  const browserEnv = globalThis as typeof globalThis & {
    __DBD_API_BASE_URL__?: string;
  };
  const envUrl = browserEnv.__DBD_API_BASE_URL__ ||
    (typeof process !== 'undefined' ? (process.env.VITE_API_BASE_URL as string | undefined) : undefined);
    
  // Check for common falsy/invalid string values from env injectors
  if (envUrl && envUrl !== 'undefined' && envUrl !== 'null' && envUrl.trim() !== '') {
    const cleanBase = envUrl.trim().endsWith('/') ? envUrl.trim().slice(0, -1) : envUrl.trim();
    return `${cleanBase}${normalizedPath}`;
  }
  
  // 3. Simple relative path is most robust for unified server/client setups
  // and portable across various proxy/iframe configurations.
  return normalizedPath;
}
