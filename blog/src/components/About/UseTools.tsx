import { motion } from 'framer-motion';
// @flow
import * as React from 'react';

type ToolCategory = {
  title: string;
  items: string[];
};

export function UseTools() {
  const tools: ToolCategory[] = [
    {
      title: 'OS',
      items: ['Mac: Mostly Dev', 'Window: Game + Dev', 'Linux(Ubuntu): Server'],
    },
    {
      title: 'Browser',
      items: ['PC: Chrome, Aside, Ego lite', 'Mobile: Safari'],
    },
    {
      title: 'IDE / ADE',
      items: ['Orca', 'Herdr: Testing'],
    },
    {
      title: 'AI',
      items: ['Claude / Claude Code', 'ChatGPT / Codex', 'Hermes', 'Gemini'],
    },
    {
      title: 'Text Editor',
      items: ['Memo: 개인 앱', 'Orca text editor'],
    },
    {
      title: '기타 개발 앱',
      items: ['Fork: Git GUI', 'Mise: 통합 개발 툴 버전 매니저'],
    },
    {
      title: 'Mac',
      items: [
        'Homebrew: App Package Manager',
        'Better Touch Tool: Mac Trackpad Gesture & Shortcut Customization',
        'CleanShot X: ScreenShot & Screen Record Tool',
        'PixelSnap: Screen px Measuring Tool',
        'ColorSlurp: ColorPicker',
        'AltTab: Tab Handling Tool',
        'Pastpal: Clipboard Manager',
        'Karabiner: 맥 키보드 매핑',
      ],
    },
    {
      title: 'Cross',
      items: ['NordVPN', 'NordPass'],
    },
    {
      title: 'Windows',
      items: ['픽픽: 이미지 캡처', 'Ditto: 클립보드 매니저', 'PowerToys: 윈도우 공식 유틸앱'],
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
        Use Tools
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-muted-foreground"
      >
        개발과 개인 작업에 주로 사용하는 도구들입니다.
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
