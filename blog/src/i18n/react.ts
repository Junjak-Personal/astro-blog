import type { Locale, MessageCatalog } from './types';
import { useSyncExternalStore } from 'react';
import { createTranslator } from './index';
import { getLocaleFromUrl, localizePath } from './locale';

function subscribe(onChange: () => void) {
  document.addEventListener('astro:after-swap', onChange);
  document.addEventListener('astro:page-load', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    document.removeEventListener('astro:after-swap', onChange);
    document.removeEventListener('astro:page-load', onChange);
    window.removeEventListener('popstate', onChange);
  };
}

function getSnapshot() {
  return getLocaleFromUrl(window.location.href);
}

export function useI18n(initialLocale: Locale = 'ko', catalog?: MessageCatalog) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => initialLocale);
  return {
    locale,
    t: createTranslator(locale, catalog),
    localizePath: (path: string) => localizePath(path, locale),
  };
}
