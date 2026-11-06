import type { APIContext } from 'astro';
import { isLocale } from '@/i18n';
import { createFeed } from '../rss.xml';

export function getStaticPaths() {
  return ['en', 'jp'].map((locale) => ({ params: { locale } }));
}

export function GET(context: APIContext) {
  const locale = context.params.locale;
  return createFeed(context, locale && isLocale(locale) ? locale : 'ko');
}
