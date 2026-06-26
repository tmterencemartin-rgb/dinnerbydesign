/**
 * Safe wrapper for localStorage and sessionStorage to prevent crashes 
 * in restricted environments (like iframes without storage permissions).
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key} from localStorage:`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[Storage] Failed to write ${key} to localStorage:`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Failed to remove ${key} from localStorage:`, e);
    }
  },
  session: {
    getItem: (key: string): string | null => {
      try {
        if (typeof window === 'undefined' || !window.sessionStorage) return null;
        return sessionStorage.getItem(key);
      } catch (e) {
        console.warn(`[Storage] Failed to read ${key} from sessionStorage:`, e);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window === 'undefined' || !window.sessionStorage) return;
        sessionStorage.setItem(key, value);
      } catch (e) {
        console.warn(`[Storage] Failed to write ${key} to sessionStorage:`, e);
      }
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window === 'undefined' || !window.sessionStorage) return;
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`[Storage] Failed to remove ${key} from sessionStorage:`, e);
      }
    }
  }
};
