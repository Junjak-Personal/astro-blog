import type { Locale } from '@/i18n';
import type { TechIconType } from '@/types/commonType.ts';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'framer-motion';
// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TechIcon } from '@/components/About/TechStackComp/TechIcon.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { aboutMessages } from '@/i18n/about';
import { useI18n } from '@/i18n/react';
import { $theme } from '@/store/system.ts';
import getTechIcons from '@/utils/getTechIcons';

export function TechStack({ locale: initialLocale }: { locale?: Locale } = {}) {
  const { t } = useI18n(initialLocale, aboutMessages);
  const theme = useStore($theme);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function usingTechList(mode: string): TechIconType[] {
    if (!isHydrated)
      return [];
    return getTechIcons([
      'typescript',
      'javascript',
      'vue',
      'nuxt',
      'react',
      'tailwindcss',
      'pinia',
      'zustand',
      'nodedotjs',
      'kotlin',
      'spring',
      'postgresql',
      'redis',
      'sqlite',
      'flutter',
      'dart',
      'astro',
      'docker',
      'aws',
      'terraform',
      'storybook',
      'vitest',
      'playwright',
      'pnpm',
      'githubactions',
      'claude',
      'chatgpt',
      'hermes',
    ], mode);
  }

  function experimentTechList(mode: string) {
    if (!isHydrated)
      return [];
    return getTechIcons([
      'docker',
      'aws',
      'flutter',
      'kotlin',
      'spring',
      'postgresql',
      'redis',
      'claude',
      'codex',
      'hermes',
      'tauri',
      'rust',
    ], mode);
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        {t('about.tech_stack', 'Tech Stack')}
      </motion.h2>
      <Tabs defaultValue="use" className="tech-stack-tabs">
        <TabsList className="grid w-full grid-cols-2 h-[3rem]">
          <TabsTrigger value="use" data-testid="about-tech-use-tab">
            <motion.div
              className="text-lg font-normal"
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {t('about.using', 'Using')}
            </motion.div>
          </TabsTrigger>
          <TabsTrigger value="experiment" data-testid="about-tech-experiment-tab">
            <motion.div
              className="text-lg font-normal"
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {t('about.experiment', 'Experiment')}
            </motion.div>
          </TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <TabsContent value="use" key="using">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="tech-stack-card">
                <CardHeader>
                  <CardTitle>{t('about.using', 'Using')}</CardTitle>
                  <CardDescription>
                    {t('about.using_description', '회사 제품과 개인 프로젝트에서 현재 사용하는 기술입니다.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
                    {usingTechList(theme).map((item) => (
                      <TechIcon key={`using-${item.techName}`} iconUrl={item.iconUrl} techName={item.techName} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="experiment" key="experiment">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="tech-stack-card">
                <CardHeader>
                  <CardTitle>{t('about.experiment', 'Experiment')}</CardTitle>
                  <CardDescription>
                    {t('about.experiment_description', '사용 경험을 넓히거나 더 깊이 익히고 있는 기술과 AI 도구입니다.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">

                    {experimentTechList(theme).map((item) => (
                      <TechIcon key={`learning-${item.techName}`} iconUrl={item.iconUrl} techName={item.techName} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
