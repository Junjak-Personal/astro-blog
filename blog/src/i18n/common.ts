import type { MessageCatalog } from './types';

export const commonMessages = {
  'home.personal_blog': { ko: 'Private Blog', en: 'Private Blog', jp: 'Private Blog' },
  'home.greeting': { ko: 'Hello World! I\'m Junja', en: 'Hello World! I\'m Junja', jp: 'Hello World! I\'m Junja' },
  'home.technologies': { ko: 'Technologies I\'ve worked', en: 'Technologies I\'ve worked', jp: 'Technologies I\'ve worked' },
  'site.home': { ko: 'Home', en: 'Home', jp: 'Home' },
  'site.blog': { ko: 'Blog', en: 'Blog', jp: 'Blog' },
  'site.project': { ko: 'Project', en: 'Project', jp: 'Project' },
  'site.playground': { ko: 'Playground', en: 'Playground', jp: 'Playground' },
  'site.about': { ko: 'About', en: 'About', jp: 'About' },
  'site.home_description': { ko: 'Personal developer blog by Jun — web development, game development, and more', en: 'Personal developer blog by Jun — web development, game development, and more', jp: 'Personal developer blog by Jun — web development, game development, and more' },
  'site.blog_description': { ko: 'Articles on web development, game development, and developer diary', en: 'Articles on web development, game development, and developer diary', jp: 'Articles on web development, game development, and developer diary' },
  'site.project_description': { ko: 'Portfolio of web and game development projects by Jun', en: 'Portfolio of web and game development projects by Jun', jp: 'Portfolio of web and game development projects by Jun' },
  'site.playground_description': { ko: 'Interactive demos and experiments with frontend technologies', en: 'Interactive demos and experiments with frontend technologies', jp: 'Interactive demos and experiments with frontend technologies' },
  'site.about_description': { ko: 'About Jun — career history, tech stack, tools, and development journey', en: 'About Jun — career history, tech stack, tools, and development journey', jp: 'About Jun — career history, tech stack, tools, and development journey' },
  'site.not_found': { ko: 'Page Not Found', en: 'Page Not Found', jp: 'Page Not Found' },
  'site.back_home': { ko: 'Back to Home', en: 'Back to Home', jp: 'Back to Home' },
  'site.go_back': { ko: '이전 페이지로 돌아가기', en: 'Go back', jp: '前のページに戻る' },
  'site.back_command': { ko: '> cd ..', en: '> cd ..', jp: '> cd ..' },
} satisfies MessageCatalog;
