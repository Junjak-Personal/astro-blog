import type { Locale } from '@/i18n';
import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';

export default function SearchLoading({ locale }: { locale?: Locale }) {
  const { t } = useI18n(locale, contentMessages);
  return (
    <div role="status" aria-label={t('blog-search.loading', '검색 중입니다.')} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="text-4xl text-white">
        <Icon icon="svg-spinners:bars-rotate-fade" />
      </div>
    </div>
  );
}
