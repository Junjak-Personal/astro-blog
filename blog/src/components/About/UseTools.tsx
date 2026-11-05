import type { Locale } from '@/i18n';
import { motion } from 'framer-motion';
// @flow
import * as React from 'react';
import { aboutMessages } from '@/i18n/about';
import { useI18n } from '@/i18n/react';

type ToolCategory = {
  title: string;
  items: string[];
};

export function UseTools({ locale: initialLocale }: { locale?: Locale } = {}) {
  const { t } = useI18n(initialLocale, aboutMessages);
  const tools: ToolCategory[] = [
    {
      title: 'OS',
      items: [t('about.os_mac', 'Mac: Mostly Dev'), t('about.os_windows', 'Window: Game + Dev'), t('about.os_linux', 'Linux(Ubuntu): Server')],
    },
    {
      title: t('about.browser', 'Browser'),
      items: [t('about.browser_pc', 'PC: Chrome, Aside, Ego lite'), t('about.browser_mobile', 'Mobile: Safari')],
    },
    {
      title: 'IDE / ADE',
      items: ['Orca', t('about.herdr', 'Herdr: Testing')],
    },
    {
      title: 'AI',
      items: ['Claude / Claude Code', 'ChatGPT / Codex', 'Hermes', 'Gemini'],
    },
    {
      title: t('about.text_editor', 'Text Editor'),
      items: [t('about.memo', 'Memo: 개인 앱'), t('about.orca_editor', 'Orca text editor')],
    },
    {
      title: t('about.dev_apps', '기타 개발 앱'),
      items: ['Fork: Git GUI', t('about.mise', 'Mise: 통합 개발 툴 버전 매니저')],
    },
    {
      title: 'Mac',
      items: [
        t('about.homebrew', 'Homebrew: App Package Manager'),
        t('about.btt', 'Better Touch Tool: Mac Trackpad Gesture & Shortcut Customization'),
        t('about.cleanshot', 'CleanShot X: ScreenShot & Screen Record Tool'),
        t('about.pixelsnap', 'PixelSnap: Screen px Measuring Tool'),
        t('about.colorslurp', 'ColorSlurp: ColorPicker'),
        t('about.alttab', 'AltTab: Tab Handling Tool'),
        t('about.pastpal', 'Pastpal: Clipboard Manager'),
        t('about.karabiner', 'Karabiner: 맥 키보드 매핑'),
      ],
    },
    {
      title: t('about.cross', 'Cross'),
      items: ['NordVPN', 'NordPass'],
    },
    {
      title: 'Windows',
      items: [t('about.picpick', '픽픽: 이미지 캡처'), t('about.ditto', 'Ditto: 클립보드 매니저'), t('about.powertoys', 'PowerToys: 윈도우 공식 유틸앱')],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        {t('about.use_tools', 'Use Tools')}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-muted-foreground"
      >
        {t('about.tools_description', '개발과 개인 작업에 주로 사용하는 도구들입니다.')}
      </motion.p>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tools.map((category) => (
          <motion.div
            key={category.title}
            variants={item}
            className={`space-y-2 p-4 bg-white dark:bg-neutral-800 shadow-md rounded-lg ${category.title === 'Mac' ? 'md:row-span-2' : ''}`}
          >
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {category.title}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              {category.items.map((item) => (
                <li key={item} className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
