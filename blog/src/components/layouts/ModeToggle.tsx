import type { Locale } from '@/i18n';
import { useStore } from '@nanostores/react';
import * as React from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Icon } from '@/components/ui/icon';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';
import { $theme, setTheme } from '@/store/system.ts';

export function ModeToggle({ locale }: { locale?: Locale }) {
  const { t } = useI18n(locale, chromeMessages);
  const theme = useStore($theme);
  const event = new Event('theme-set');
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    localStorage.getItem('theme') && setTheme(localStorage.getItem('theme') ?? 'dark');
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isHydrated)
      document.body.dispatchEvent(event);
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', theme);
    }
    else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="theme-menu-open">
          <Icon icon="mynaui:sun-solid" className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"></Icon>
          <Icon icon="mynaui:moon-solid" className="absolute h-[2rem] w-[2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"></Icon>
          <span className="sr-only">{t('theme.toggle', 'Toggle theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} data-testid="theme-light-select">
          {t('theme.light', 'Light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} data-testid="theme-dark-select">
          {t('theme.dark', 'Dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} data-testid="theme-system-select">
          {t('theme.system', 'System')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
