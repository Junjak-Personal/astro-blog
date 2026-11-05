export const LOCALES = ['ko', 'en', 'jp'] as const;

export type Locale = typeof LOCALES[number];
export type MessageCatalog = Record<string, Record<Locale, string>>;
export type TranslationValues = Record<string, string | number>;
