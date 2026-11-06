import type { Locale } from './types';

export function isLocale(value: string): value is Locale {
  return value === 'ko' || value === 'en' || value === 'jp';
}

export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? new URL(url, 'https://jun-devlog.invalid').pathname : url.pathname;
  const prefix = pathname.split('/')[1];
  return prefix === 'en' || prefix === 'jp' ? prefix : 'ko';
}

export function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|jp)(?=\/|$)/, '') || '/';
}

export function getContentLocale(id: string): Locale {
  const prefix = id.split('/')[0];
  return isLocale(prefix) ? prefix : 'ko';
}

export function getContentSlug(id: string) {
  return id.replace(/^(?:ko|en|jp)\//, '');
}

export function selectLocalizedEntries<T extends { id: string }>(entries: T[], locale: Locale) {
  const selected = new Map<string, T>();
  // Keep the original files as the root (Korean) locale and fallback source.
  for (const entry of entries) {
    if (!/^(?:ko|en|jp)\//.test(entry.id))
      selected.set(entry.id, entry);
  }
  for (const entry of entries) {
    if (/^(?:ko|en|jp)\//.test(entry.id) && getContentLocale(entry.id) === locale)
      selected.set(getContentSlug(entry.id), entry);
  }
  // Astro renders from filePath/rendered, so a stable public id can be shared
  // by all translations without changing the MDX module used by render().
  return [...selected.values()].map((entry) => ({ ...entry, id: getContentSlug(entry.id) }));
}

// Match Giscus's original pathname mapping so existing discussions stay attached.
export function getDiscussionTerm(pathname: string) {
  const originalPath = stripLocale(pathname);
  return originalPath.length < 2 ? 'index' : originalPath.substring(1).replace(/\.\w+$/, '');
}

export function localizePath(path: string, locale: Locale) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path))
    return path;
  const url = new URL(path, 'https://jun-devlog.invalid');
  const pathname = stripLocale(url.pathname);
  if (!/^\/(?:$|about(?:\/|$)|blog(?:\/|$)|project(?:\/|$)|playground(?:\/|$)|404(?:\/|$))/.test(pathname))
    return path;
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  return `${prefix}${pathname}${url.search}${url.hash}`;
}

export function htmlLanguage(locale: Locale) {
  return locale === 'jp' ? 'ja' : locale;
}

export function openGraphLocale(locale: Locale) {
  return { ko: 'ko_KR', en: 'en_US', jp: 'ja_JP' }[locale];
}
