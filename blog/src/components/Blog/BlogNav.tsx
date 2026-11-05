import type { CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n';
import dayjs from 'dayjs';
import { Icon } from '@/components/ui/icon';
import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';
import { Button } from '../ui/button';

type Props = {
  locale?: Locale;
  nav?: {
    prev: CollectionEntry<'blog'> | null;
    next: CollectionEntry<'blog'> | null;
  };
};

export default function BlogNav({ nav, locale: initialLocale }: Props) {
  const { t, localizePath } = useI18n(initialLocale, contentMessages);
  function getCreatedDt(date: Date) {
    return dayjs(date).format('YYYY-MM-DD');
  }

  return (
    <div className="flex justify-between gap-4">
      <div className="btn-wrapper">
        {nav?.prev && (
          <Button variant="outline" className="prev nav-button">
            <a data-testid="blog-previous-link" href={localizePath(`/blog/${nav.prev.id}`)}>
              <div className="flex justify-start">
                <Icon icon="mingcute:left-line" className="nav-icon" />
                <h3>{t('blog-post.previous', '이전 글')}</h3>
              </div>
              <div className="content">
                <div className="title">
                  {nav.prev.data.title}
                </div>
                <div className="nav-created-time">
                  {getCreatedDt(nav.prev.data.created)}
                </div>
              </div>

            </a>
          </Button>
        )}
      </div>

      <div className="btn-wrapper">
        {nav?.next && (
          <Button variant="outline" className="next nav-button">
            <a data-testid="blog-next-link" href={localizePath(`/blog/${nav.next.id}`)}>
              <div className="flex justify-end">
                <h3>{t('blog-post.next', '다음 글')}</h3>
                <Icon icon="mingcute:right-line" className="nav-icon" />
              </div>
              <div className="content">
                <p className="title">
                  {nav.next.data.title}
                </p>
                <p className="nav-created-time">
                  {getCreatedDt(nav.next.data.created)}
                </p>
              </div>
            </a>
          </Button>
        )}
      </div>
    </div>

  );
}
