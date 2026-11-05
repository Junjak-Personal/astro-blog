'use client';

import type { Locale } from '@/i18n';
import { useCallback, useRef } from 'react';
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from '@/components/ui/terminal';

import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';

export default function TerminalInfo({ locale }: { locale?: Locale }) {
  const { t } = useI18n(locale, chromeMessages);
  const terminalRef = useRef<HTMLDivElement>(null);
  const handleReady = useCallback(() => {
    const content = terminalRef.current?.closest('[data-home]')?.querySelector<HTMLElement>('[data-home-content]');
    if (content) {
      content.hidden = false;
      document.dispatchEvent(new Event('home:ready'));
    }
  }, []);

  return (
    <div ref={terminalRef} className="w-full max-w-lg" data-testid="home-terminal-panel">
      <Terminal className="">
        <TypingAnimation duration={24}>{t('terminal.command', '> bunx blog@latest init')}</TypingAnimation>

        <AnimatedSpan delay={600} className="text-green-500">
          <span>{t('terminal.preflight', '✔ Preflight checks.')}</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1000} className="text-green-500">
          <span>{t('terminal.dependencies', '✔ Installing dependencies...')}</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1400} className="text-green-500">
          <span>{t('terminal.updates', '✔ Check updates...')}</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1800} className="text-blue-500">
          <span>{t('terminal.latest', 'ℹ Current version is Latest!:')}</span>
        </AnimatedSpan>

        <TypingAnimation duration={20} delay={2200} className="text-muted-foreground" onComplete={handleReady}>
          {t('terminal.success', 'Success! Dev-Blog loaded completed.')}
        </TypingAnimation>
      </Terminal>
    </div>
  );
}
