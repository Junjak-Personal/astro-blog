import type { Locale, MessageCatalog, TranslationValues } from './types';
import { commonMessages } from './common';

export { getLocaleFromUrl, htmlLanguage, isLocale, localizePath, openGraphLocale, stripLocale } from './locale';
export { LOCALES } from './types';
export type { Locale, MessageCatalog, TranslationValues } from './types';

export function createTranslator(locale: Locale, catalog: MessageCatalog = commonMessages) {
  const shared: MessageCatalog = commonMessages;
  return (key: string, fallback: string, values: TranslationValues = {}) => {
    const message = catalog[key]?.[locale] ?? shared[key]?.[locale] ?? fallback;
    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder));
  };
}
