import type { Locale } from '@/i18n';
import React, { useEffect } from 'react';
import DocNav from '@/components/layouts/DockNav.tsx';
import { DrawerNavigation } from '@/components/layouts/DrawerNavigation.tsx';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@/components/ui/icon';
import { stripLocale } from '@/i18n';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation({ locale: initialLocale }: { locale?: Locale }) {
  const { locale, t, localizePath } = useI18n(initialLocale, chromeMessages);
  const [tab, setTab] = React.useState('');
  const [isMobileMenuOpened, setIsMobileMenuOpened] = React.useState(false);

  useEffect(() => {
    function detectTab() {
      const path = stripLocale(window.location.pathname);
      if (path === '/' || path === '')
        setTab('home');
      else if (path.includes('blog'))
        setTab('blog');
      else if (path.includes('project'))
        setTab('project');
      else if (path.includes('playground'))
        setTab('playground');
      else if (path.includes('about'))
        setTab('about');
      else if (path.includes('resume'))
        setTab('resume');
    }

    detectTab();
    // Re-detect on SPA navigation (Astro View Transitions)
    document.addEventListener('astro:after-swap', detectTab);
    return () => document.removeEventListener('astro:after-swap', detectTab);
  }, []);

  function toggleMenu() {
    setIsMobileMenuOpened(!isMobileMenuOpened);
  }

  return (
    <>
      <nav>
        <div className="nav-content-wrapper layout-background">
          <div className="nav-content">
            <Button
              variant="ghost"
              size="icon"
              asChild
              name="to-home"
              aria-label={t('navigation.home', '홈으로 이동')}
            >
              <a href={localizePath('/')} data-testid="navigation-home-link">
                <Icon icon="mynaui:code-waves-solid" className="logo"></Icon>
              </a>
            </Button>

            <DocNav tab={tab} locale={locale} />

            <div className="action-btn-wrapper">
              <DrawerNavigation tab={tab} locale={locale}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="md:hidden"
                  aria-label={t('navigation.open_menu', '메뉴 열기')}
                  data-testid="navigation-menu-open"
                  name="mobile-drawer-menu"
                >
                  <Icon icon="mynaui:menu" className="logo"></Icon>
                </Button>
              </DrawerNavigation>
              <LanguageSwitcher locale={locale} />
              <AnimatedThemeToggler locale={locale} className="h-10 w-10" />
            </div>
          </div>
          <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" />
        </div>
        <div className="h-1"></div>
      </nav>
    </>

  );
}
