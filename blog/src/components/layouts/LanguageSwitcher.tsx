import type { Locale } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { isLocale, localizePath } from '@/i18n';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';

export default function LanguageSwitcher({ locale: initialLocale }: { locale?: Locale }) {
  const { locale, t } = useI18n(initialLocale, chromeMessages);
  const languages = [
    { value: 'ko', label: t('navigation.korean', '한국어'), code: 'KO' },
    { value: 'en', label: t('navigation.english', 'English'), code: 'EN' },
    { value: 'jp', label: t('navigation.japanese', '日本語'), code: 'JA' },
  ];
  const currentLanguage = languages.find((language) => language.value === locale)?.label ?? locale;
  const accessibleLabel = t('navigation.language_current', '언어: {language}', { language: currentLanguage });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-accent"
          aria-label={accessibleLabel}
          title={accessibleLabel}
          data-testid="navigation-language-open"
          data-locale={locale}
        >
          <Icon icon="material-symbols:translate" width={21} height={21} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-44 rounded-xl p-1.5">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-normal text-muted-foreground">
          {t('navigation.language', '언어')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(nextLocale) => {
            if (!isLocale(nextLocale) || nextLocale === locale)
              return;
            const { pathname, search, hash } = window.location;
            window.location.assign(localizePath(`${pathname}${search}${hash}`, nextLocale));
          }}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem
              key={language.value}
              value={language.value}
              data-testid={`navigation-language-${language.value}-select`}
              className="min-h-10 cursor-pointer rounded-md pl-3 pr-3 data-[state=checked]:bg-accent data-[state=checked]:font-semibold data-[state=checked]:text-accent-foreground [&>span:first-child]:hidden"
            >
              <span className="flex-1">{language.label}</span>
              <span className="text-[10px] tracking-wide text-muted-foreground">{language.code}</span>
              <span className="ml-2 flex size-4 items-center justify-center" aria-hidden="true">
                {locale === language.value && <Icon icon="material-symbols:check" width={16} height={16} />}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
