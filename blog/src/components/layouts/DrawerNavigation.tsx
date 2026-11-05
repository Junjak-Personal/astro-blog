import type { Locale } from '@/i18n';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';

type Props = {
  children: React.ReactNode;
  tab: string;
  locale?: Locale;
};

const NAVIGATION_ITEMS = [
  { id: 'home', path: '', label: 'Home' },
  { id: 'blog', path: 'blog', label: 'Blog' },
  { id: 'project', path: 'project', label: 'Project' },
  { id: 'playground', path: 'playground', label: 'Playground' },
  { id: 'about', path: 'about', label: 'About' },
] as const;

export function DrawerNavigation({ children, tab, locale }: Props) {
  const { t, localizePath } = useI18n(locale, chromeMessages);
  const [isOpen, setIsOpen] = React.useState(false);

  const checkRoute = React.useCallback((route: string) => {
    return tab === route ? 'default' : 'outline';
  }, [tab]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div>{children}</div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('navigation.menu_title', 'Navigation Menu')}</DrawerTitle>
          <DrawerDescription>{t('navigation.menu_description', 'Click to navigate other pages!')}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-2">
          {NAVIGATION_ITEMS.map(({ id, path, label }) => (
            <Button key={id} variant={checkRoute(id)} asChild className="w-full">
              <a
                href={localizePath(path === '' ? '/' : `/${path}/`)}
                aria-current={tab === id ? 'page' : undefined}
                data-testid={`navigation-mobile-${id}-link`}
                onClick={() => setIsOpen(false)}
              >
                {t(`navigation.${id}_label`, label)}
              </a>
            </Button>
          ))}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
