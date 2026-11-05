import type { Locale } from '@/i18n';
import { IconCloud } from '@/components/ui/icon-cloud';

const slugs = [
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'vue',
  'nuxt',
  'astro',
  'pinia',
  'testinglibrary',
  'vitest',
  'tailwindcss',
  'chartdotjs',
  'vitepress',
  'vite',
  'webpack',
  'html5',
  'css',
  'node',
  'express',
  'kotlin',
  'spring',
  'postgresql',
  'redis',
  'sqlite',
  'flutter',
  'dart',
  'docker',
  'aws',
  'terraform',
  'storybook',
  'playwright',
  'pnpm',
  'githubactions',
  'python',
  'git',
  'cloudflare',
  'vercel',
  'firebase',
  'nginx',
  'netlify',
  'linux',
  'jira',
  'github',
  'gitlab',
  'webstorm',
  'figma',
  'perplexity',
  'anthropic',
  'rust',
  'tauri',
  'claude',
  'chatgpt',
  'codex',
  'hermes',
];

const images = slugs.map(
  (slug) => `/images/icon/tech-stack/color/${slug}.svg`,
);

export default function InteractiveIconCloud({ locale }: { locale?: Locale }) {
  return (
    <IconCloud locale={locale} images={images} maxSize={550} className="flex justify-center" />
  );
}
