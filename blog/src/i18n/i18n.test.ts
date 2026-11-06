import { describe, expect, it } from 'vitest';
import { aboutMessages } from './about';
import { chromeMessages } from './chrome';
import { commonMessages } from './common';
import { contentMessages } from './content';
import { createTranslator, getLocaleFromUrl, htmlLanguage, localizePath } from './index';
import { getContentLocale, getContentSlug, getDiscussionTerm, selectLocalizedEntries } from './locale';

describe('site locale routing', () => {
  it('selects one translation per public slug while retaining the localized render source', () => {
    const originals = [
      { id: 'diary/intro', filePath: 'blog/diary/intro.mdx', data: { title: '여행 일지' } },
      { id: 'web/astro', filePath: 'blog/web/astro.mdx', data: { title: 'Astro' } },
    ];
    const translations = [
      { id: 'en/diary/intro', filePath: 'blog/en/diary/intro.mdx', data: { title: 'Travel journal' } },
      { id: 'jp/diary/intro', filePath: 'blog/jp/diary/intro.mdx', data: { title: '旅行記' } },
    ];
    const entries = [...originals, ...translations];
    expect(selectLocalizedEntries(entries, 'ko')).toEqual(originals);
    const english = selectLocalizedEntries(entries, 'en');
    expect(english).toHaveLength(2);
    expect(english[0]).toEqual({ ...translations[0], id: 'diary/intro' });
    expect(english[1]).toEqual(originals[1]);
    expect(selectLocalizedEntries(entries, 'jp')[0]).toEqual({ ...translations[1], id: 'diary/intro' });
    expect(translations[0].id).toBe('en/diary/intro');
    expect(getContentLocale('jp/web/astro')).toBe('jp');
    expect(getContentLocale('web/astro')).toBe('ko');
    expect(getContentSlug('en/web/astro')).toBe('web/astro');
  });

  it('allows a Korean translation of a non-Korean source without changing the root URL', () => {
    const entries = [{ id: 'music/song', body: '日本語' }, { id: 'ko/music/song', body: '한국어' }, { id: 'en/music/song', body: 'English' }];
    expect(selectLocalizedEntries(entries, 'ko')).toEqual([{ id: 'music/song', body: '한국어' }]);
    expect(selectLocalizedEntries(entries, 'en')).toEqual([{ id: 'music/song', body: 'English' }]);
  });

  it('keeps original English UI copy in ko, en, and jp while translating Korean prose', () => {
    const catalogs = { ...commonMessages, ...chromeMessages, ...aboutMessages, ...contentMessages };
    const originalEnglish = {
      'home.personal_blog': 'Private Blog',
      'home.technologies': 'Technologies I\'ve worked',
      'site.about': 'About',
      'terminal.success': 'Success! Dev-Blog loaded completed.',
      'about.greeting': 'Hi, I\'m JunHyeon',
      'about.tech_stack': 'Tech Stack',
      'about.using': 'Using',
      'about.experiment': 'Experiment',
      'about.use_tools': 'Use Tools',
      'about.browser': 'Browser',
      'about.homebrew': 'Homebrew: App Package Manager',
      'blog-search.categories': 'Categories:',
      'blog-search.title_content': 'Title & Content',
      'blog-post.toc': 'Table of Contents',
      'project-card.tech_stack': 'Tech Stack',
    } as const;
    for (const [key, expected] of Object.entries(originalEnglish)) {
      expect(catalogs[key as keyof typeof originalEnglish], key).toEqual({ ko: expected, en: expected, jp: expected });
    }
    expect(chromeMessages['home.introduction'].jp).toBe('こんにちは、私の個人ブログへようこそ。');
    expect(contentMessages['blog-search.query'].jp).toBe('検索キーワード');
    expect(contentMessages['blog-post.previous'].jp).toBe('前の記事');
    expect(aboutMessages['about.intro_personal'].jp).toContain('ソフトウェア開発者');
  });

  it('keeps Korean URLs and maps Japanese paths to the standard HTML language', () => {
    expect(localizePath('/jp/about/?section=tools#using', 'ko')).toBe('/about/?section=tools#using');
    expect(localizePath('/blog/web/astro/?q=Astro#intro', 'jp')).toBe('/jp/blog/web/astro/?q=Astro#intro');
    expect(localizePath('/en/', 'jp')).toBe('/jp/');
    expect(localizePath('/en/about/', 'en')).toBe('/en/about/');
    expect(getLocaleFromUrl('/jp/about/')).toBe('jp');
    expect(getLocaleFromUrl('/about/')).toBe('ko');
    expect(htmlLanguage('jp')).toBe('ja');
  });

  it('preserves external links, anchors, feeds, and downloadable assets', () => {
    for (const path of ['https://memo.jun-devlog.win/ext/123', '//example.com/blog/', '#intro', '/files/photo.webp', '/rss.xml', '/pagefind/pagefind.js']) {
      expect(localizePath(path, 'jp')).toBe(path);
    }
  });

  it('shares existing Giscus discussions without changing the original pathname term', () => {
    expect(getDiscussionTerm('/en/blog/web/astro/')).toBe('blog/web/astro/');
    expect(getDiscussionTerm('/jp/blog/web/astro/')).toBe(getDiscussionTerm('/blog/web/astro/'));
    expect(getDiscussionTerm('/jp/blog/article.html')).toBe('blog/article');
    expect(getDiscussionTerm('/en/')).toBe('index');
  });

  it('requires complete translations and matching interpolation placeholders', () => {
    for (const catalog of [commonMessages, chromeMessages, contentMessages, aboutMessages]) {
      for (const [key, values] of Object.entries(catalog)) {
        expect(key).toMatch(/^[a-z][a-z\d-]*\.[a-z][a-z_\d]*$/);
        expect(Object.keys(values).sort()).toEqual(['en', 'jp', 'ko']);
        const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
        for (const value of Object.values(values)) {
          expect(value.trim(), key).not.toBe('');
          expect(placeholders(value), key).toEqual(placeholders(values.ko));
        }
      }
    }
    expect(createTranslator('jp')('site.home', 'Home')).toBe('Home');
  });
});
