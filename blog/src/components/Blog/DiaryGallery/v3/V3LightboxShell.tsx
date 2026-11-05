'use client';

import type { ReactNode } from 'react';
import type { Locale } from '@/i18n';
import { AnimatePresence, motion } from 'framer-motion';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';
import { wrapIndex } from './shared';

type V3LightboxShellProps = {
  locale?: Locale;
  count: number;
  /** Active index, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndex: (index: number) => void;
  /** Render the variant-specific 3D stage for the given index. */
  children: (index: number) => ReactNode;
};

export function V3LightboxShell({ count, index, onClose, onIndex, children, locale }: V3LightboxShellProps) {
  const { t } = useI18n(locale, contentMessages);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null)
        return;
      onIndex(wrapIndex(index + delta, count));
    },
    [index, count, onIndex],
  );

  useEffect(() => {
    if (!open)
      return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape')
        onClose();
      else if (event.key === 'ArrowLeft')
        go(-1);
      else if (event.key === 'ArrowRight')
        go(1);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, go, onClose]);

  if (typeof document === 'undefined')
    return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="dgv3-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
        >
          <button type="button" className="dgv3-lightbox__close" data-testid="gallery-lightbox-close" aria-label={t('content-gallery.close', '닫기')} onClick={onClose}>
            <X size={20} />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                className="dgv3-lightbox__nav dgv3-lightbox__nav--prev"
                data-testid="gallery-lightbox-previous"
                aria-label={t('content-gallery.previous', '이전 사진')}
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                className="dgv3-lightbox__nav dgv3-lightbox__nav--next"
                data-testid="gallery-lightbox-next"
                aria-label={t('content-gallery.next', '다음 사진')}
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <div className="dgv3-lightbox__stage" onClick={(event) => event.stopPropagation()}>
            {children(index as number)}
          </div>

          {count > 1 && (
            <div className="dgv3-lightbox__counter">
              {(index as number) + 1}
              {' '}
              /
              {count}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
