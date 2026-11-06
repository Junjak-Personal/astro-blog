import type { CollectionKey } from 'astro:content';
import type { Locale } from '@/i18n';
import { getCollection } from 'astro:content';
import { selectLocalizedEntries } from '@/i18n/locale';

type PostCollection = Extract<CollectionKey, 'blog' | 'project' | 'playground'>;

export async function getLocalizedCollection<C extends PostCollection>(collection: C, locale: Locale = 'ko') {
  return selectLocalizedEntries(await getCollection(collection), locale);
}
