import { shopConfig, type Language } from '../data/shop';

// The customer's language choice is saved on the phone, next to the cart (same shop, its own key).
export const LANGUAGE_STORAGE_KEY = `${shopConfig.cartStorageKey}-language`;

const DEFAULT_LANGUAGE = shopConfig.languages[0];

// Uses the saved language only if this shop still offers it; otherwise the shop's first language.
export function parseSavedLanguage(saved: string | null, offered: readonly Language[] = shopConfig.languages): Language {
  return offered.find((code) => code === saved) ?? offered[0];
}

// A tiny store so React reads the saved language with useSyncExternalStore (like cartStore in cart.ts).
let languageCache: Language | null = null;
const listeners = new Set<() => void>();

function readLanguage(): Language {
  if (languageCache === null) {
    try {
      languageCache = parseSavedLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    } catch {
      languageCache = DEFAULT_LANGUAGE;
    }
  }
  return languageCache;
}

export const languageStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot: readLanguage,
  getServerSnapshot: () => DEFAULT_LANGUAGE,
  set(language: Language) {
    languageCache = parseSavedLanguage(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCache);
    } catch { /* Storage can be full or blocked; the choice still works for this visit. */ }
    listeners.forEach((listener) => listener());
  },
};
