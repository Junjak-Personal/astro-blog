import type { Locale } from '@/i18n';
// @flow
import * as React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@/components/ui/icon';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';

export default function Footer({ locale }: { locale?: Locale }) {
  const { t } = useI18n(locale, chromeMessages);
  const currentYaer = new Date().getFullYear();

  return (
    <footer className="layout-background">
      <div className="footer-wrapper">
        <div className="flex items-center">
          <div className="text-sm text-gray-500">
            &copy;
            {' '}
            <span suppressHydrationWarning>{currentYaer}</span>
            {' '}
            • Junjak •
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/JunjaK/astro-blog" aria-label={t('footer.repository', '블로그 GitHub 저장소')} data-testid="footer-repository-link">
              <Icon icon="mingcute:git-branch-line" className="icon text-lg text-gray-500" />
            </a>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild name="github" aria-label={t('footer.github', 'GitHub 프로필')} data-testid="footer-github-link">
            <a href="https://github.com/JunjaK">
              <Icon icon="mingcute:github-fill" className="icon text-lg text-gray-500" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:haring157@gmail.com" aria-label={t('footer.email', '이메일 보내기')} data-testid="footer-email-link">
              <Icon icon="mingcute:mail-fill" className="icon text-lg text-gray-500" />
            </a>
          </Button>
        </div>
      </div>

    </footer>
  );
}
