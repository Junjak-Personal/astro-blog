import type { APIContext } from 'astro';
import type { Locale } from '@/i18n';
import rss from '@astrojs/rss';
import dayjs from 'dayjs';
import { htmlLanguage, localizePath } from '@/i18n';
import { getLocalizedCollection } from '@/utils/localizedContent';

export async function createFeed(context: APIContext, locale: Locale) {
  const posts = await getLocalizedCollection('blog', locale);
  posts.sort((a, b) => dayjs(b.data.created).unix() - dayjs(a.data.created).unix());

  return rss({
    title: 'Jun Devlog',
    description: 'Personal developer blog by Jun — web development, game development, and more',
    site: new URL(localizePath('/', locale), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.created,
      description: post.data.description || [post.data.title, post.data.category, ...(post.data.tags || [])].filter(Boolean).join(' | '),
      link: localizePath(`/blog/${post.id}`, locale),
      categories: post.data.tags || [],
    })),
    customData: `<language>${htmlLanguage(locale)}</language>`,
  });
}

export function GET(context: APIContext) {
  return createFeed(context, 'ko');
}
