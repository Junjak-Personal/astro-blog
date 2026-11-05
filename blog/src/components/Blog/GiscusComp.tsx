import type { Locale } from '@/i18n';
import Giscus from '@giscus/react';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { contentMessages } from '@/i18n/content';
import { getDiscussionTerm } from '@/i18n/locale';

import { useI18n } from '@/i18n/react';
import { $theme, setTheme } from '@/store/system';

export default function GiscusComp({ locale: initialLocale }: { locale?: Locale }) {
  const { locale } = useI18n(initialLocale, contentMessages);
  const [pathname, setPathname] = useState<string | null>(null);
  const theme = useStore($theme);
  const giscusTheme = theme === 'dark' ? 'noborder_dark' : 'noborder_light';

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored)
      setTheme(stored);
  }, []);

  useEffect(() => {
    setPathname(getDiscussionTerm(window.location.pathname));
  }, [locale]);

  if (!pathname)
    return <></>;

  return (
    <Giscus
      id="comments"
      repo="Junjak-Personal/astro-blog"
      repoId="R_kgDONnXaZQ"
      category="General"
      categoryId="DIC_kwDONnXaZc4Cm4-Q"
      mapping="specific"
      term={pathname}
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={giscusTheme}
      lang={locale === 'jp' ? 'ja' : locale}
      loading="lazy"
    />
  );
}
