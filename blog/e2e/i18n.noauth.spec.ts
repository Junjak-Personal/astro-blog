import { expect, test } from '@playwright/test';

const languages = [
  { path: '', locale: 'ko', html: 'ko', about: 'About', blog: 'Blog', success: 'Success! Dev-Blog loaded completed.' },
  { path: '/en', locale: 'en', html: 'en', about: 'About', blog: 'Blog', success: 'Success! Dev-Blog loaded completed.' },
  { path: '/jp', locale: 'jp', html: 'ja', about: 'About', blog: 'Blog', success: 'Success! Dev-Blog loaded completed.' },
] as const;

for (const language of languages) {
  test(`${language.locale}: localized SSR and Home terminal completion gate`, async ({ page, request }) => {
    const response = await request.get(`${language.path}/about/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`lang="${language.html}"`);
    expect(html).toContain(`Jun Devlog | ${language.about}`);
    expect(html).toContain('hreflang="ja"');
    for (const label of ['Tech Stack', 'Using', 'Experiment', 'Use Tools', 'Software Developer · Team Lead']) {
      expect(html).toContain(label);
    }
    const introduction = {
      ko: '저는 게임과 서브컬쳐',
      en: 'a software developer who enjoys games',
      jp: 'ゲームやサブカルチャー',
    };
    expect(html).toContain(introduction[language.locale]);

    await page.goto(`${language.path}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', language.html);
    await expect(page.getByTestId('navigation-language-open')).toHaveAttribute('data-locale', language.locale);
    await expect(page.locator('.doc-nav a')).toHaveText(['Home', 'Blog', 'Project', 'Playground', 'About']);
    await expect(page.getByTestId('home-terminal-panel').locator('code > :last-child')).toHaveText(language.success, { timeout: 12000 });
    await expect(page.locator('[data-home-content]')).toBeVisible();
    await expect(page.getByTestId('home-blog-link')).toHaveAttribute('href', `${language.path}/blog/`);
  });

  test(`${language.locale}: full-text search keeps localized result links and resets`, async ({ page }) => {
    await page.goto(`${language.path}/blog/`);
    const input = page.getByTestId('blog-search-query-input');
    await expect(page.getByTestId('blog-search-type-select')).toHaveText('Title & Content');
    const placeholders = { ko: '검색어', en: 'Search query', jp: '検索キーワード' };
    await expect(input).toHaveAttribute('placeholder', placeholders[language.locale]);
    await input.fill('Astro');
    await expect(page).not.toHaveURL(/q=Astro/);
    await input.press('Enter');
    await expect(page).toHaveURL(/q=Astro/);
    await expect(page.locator('a[href*="/blog/web/"]').first()).toBeVisible();
    const href = await page.locator('a[href*="/blog/web/"]').first().getAttribute('href');
    expect(href).toMatch(new RegExp(`^${language.path}/blog/`));
    await page.getByTestId('blog-search-reset').click();
    await expect(input).toHaveValue('');
    await expect(page).not.toHaveURL(/[?&]q=/);
  });
}

test('language selection preserves the page, query, hash, and subsequent navigation', async ({ page }) => {
  await page.goto('/about/?section=tools#using');
  await page.getByTestId('navigation-language-open').click();
  await page.getByTestId('navigation-language-jp-select').click();
  await expect(page).toHaveURL(/\/jp\/about\/\?section=tools#using$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
  await page.getByTestId('navigation-home-link').click();
  await expect(page).toHaveURL(/\/jp\/$/);
  await expect(page.getByTestId('navigation-language-open')).toHaveAttribute('data-locale', 'jp');
  await page.getByTestId('navigation-language-open').click();
  await expect(page.getByTestId('navigation-language-jp-select')).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('navigation-language-en-select')).toHaveAttribute('aria-checked', 'false');
});

test('localized article routes preserve the original article body', async ({ page, request }) => {
  const original = await request.get('/project/memo/');
  const korean = await original.text();
  await page.goto('/en/project/memo/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.article-entry')).toHaveAttribute('lang', 'ko');
  const heading = await page.locator('.article-entry h2').first().textContent();
  expect(korean).toContain(heading?.trim() ?? 'Intro');
  await page.getByTestId('navigation-language-open').click();
  await page.getByTestId('navigation-language-jp-select').click();
  await expect(page).toHaveURL(/\/jp\/project\/memo\/$/);
  await expect(page.locator('.article-entry h2').first()).toHaveText(heading ?? 'Intro');
});

test('Japanese navigation fits desktop and mobile widths', async ({ page }) => {
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/jp/about/');
    const selector = page.getByTestId('navigation-language-open');
    await expect(selector).toBeVisible();
    const bounds = await selector.boundingBox();
    expect(bounds).not.toBeNull();
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
    const themeBounds = await page.getByTestId('theme-toggle-click').boundingBox();
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(themeBounds?.x ?? 0);
    const clippedLabels = await page.locator('nav a:visible').evaluateAll((links) => links.filter((link) => link.scrollWidth > link.clientWidth).map((link) => link.textContent));
    expect(clippedLabels).toEqual([]);
    if (width === 390) {
      await page.getByTestId('navigation-menu-open').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog').locator('a')).toHaveText(['Home', 'Blog', 'Project', 'Playground', 'About']);
      const opacities = await page.getByRole('dialog').locator('a').evaluateAll((links) => links.map((link) => getComputedStyle(link).opacity));
      expect(opacities).toEqual(['1', '1', '1', '1', '1']);
      await page.getByRole('dialog').getByTestId('navigation-mobile-blog-link').click();
      await expect(page).toHaveURL(/\/jp\/blog\/$/);
    }
  }
});
