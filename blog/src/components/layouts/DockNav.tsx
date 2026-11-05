import type { Locale } from '@/i18n';
import { buttonVariants } from '@/components/ui/button.tsx';
import { Dock, DockIcon } from '@/components/ui/dock';

import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';

interface Props {
  tab: string;
  locale?: Locale;
}

export default function DocNav({ tab, locale }: Props) {
  const { t, localizePath } = useI18n(locale, chromeMessages);
  function checkRoute(e: string) {
    return buttonVariants({ variant: tab === e ? 'default' : 'ghost', size: 'icon', className: 'nav-btn' });
  }
  return (
    <Dock direction="middle" className="doc-nav max-md:hidden">
      <DockIcon>
        <a
          href={localizePath('/')}
          className={checkRoute('home')}
          aria-current={tab === 'home' ? 'page' : undefined}
          data-testid="navigation-home-tab-link"
        >
          {t('navigation.home_label', 'Home')}
        </a>
      </DockIcon>
      <DockIcon>
        <a
          href={localizePath('/blog/')}
          className={checkRoute('blog')}
          aria-current={tab === 'blog' ? 'page' : undefined}
          data-testid="navigation-blog-link"
        >
          {t('navigation.blog_label', 'Blog')}
        </a>
      </DockIcon>
      <DockIcon>
        <a
          href={localizePath('/project/')}
          className={checkRoute('project')}
          aria-current={tab === 'project' ? 'page' : undefined}
          data-testid="navigation-project-link"
        >
          {t('navigation.project_label', 'Project')}
        </a>
      </DockIcon>
      <DockIcon>
        <a
          href={localizePath('/playground/')}
          className={checkRoute('playground')}
          aria-current={tab === 'playground' ? 'page' : undefined}
          data-testid="navigation-playground-link"
        >
          {t('navigation.playground_label', 'Playground')}
        </a>
      </DockIcon>
      <DockIcon>
        <a
          href={localizePath('/about/')}
          className={checkRoute('about')}
          aria-current={tab === 'about' ? 'page' : undefined}
          data-testid="navigation-about-link"
        >
          {t('navigation.about_label', 'About')}
        </a>
      </DockIcon>
    </Dock>
  );
}
