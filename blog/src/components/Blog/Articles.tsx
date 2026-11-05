import type { CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
/* eslint-disable react/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EachArticle from '@/components/Blog/EachArticle';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stripLocale } from '@/i18n';

import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';
import { FadeText } from '~/components/ui/fade-text';
import CategoryTags from './CategoryTags';
import SearchLoading from './SearchLoading';

type BlogPost = Omit<CollectionEntry<'blog'>, 'body'>;

type Props = {
  posts: BlogPost[];
  categories: string[];
  locale?: Locale;
};

type PagefindResult = {
  id: string;
  data: () => Promise<{ url: string; excerpt: string; meta: Record<string, string> }>;
};

type Pagefind = {
  search: (query: string, options?: { filters?: Record<string, string | string[]> }) => Promise<{ results: PagefindResult[] }>;
  init: () => Promise<void>;
};

export default function Articles({ posts, categories, locale: initialLocale }: Props) {
  const { locale, t, localizePath } = useI18n(initialLocale, contentMessages);
  const formSchema = z.object({
    search: z.string().min(2, t('blog-search.length', '검색어는 2~50자로 입력해 주세요.')).max(50, t('blog-search.length', '검색어는 2~50자로 입력해 주세요.')),
    searchType: z.enum(['tag', 'title-content']),
  });
  const [appliedQuery, setAppliedQuery] = useState({ search: '', searchType: 'title-content' as 'tag' | 'title-content' });
  const [searchError, setSearchError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState(posts);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const pagefindRef = useRef<Promise<Pagefind | null> | null>(null);
  const resetCategoryRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: articles.length,
    estimateSize: () => 176,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
      searchType: 'title-content',
    },
  });

  useEffect(() => {
    async function loadPagefind() {
      try {
        const pagefindPath = `${window.location.origin}/pagefind/pagefind.js`;
        const pf = await import(/* @vite-ignore */ pagefindPath) as Pagefind;
        await pf.init();
        return pf;
      }
      catch {
        // A missing build index is reported when full-text search is requested.
        return null;
      }
    }
    pagefindRef.current = loadPagefind();
  }, []);

  const postsByUrl = useRef(
    new Map(posts.map((post) => [`/blog/${post.id}/`, post])),
  );

  const searchWithPagefind = useCallback(async (query: string): Promise<BlogPost[]> => {
    if (!query)
      return posts;
    const pf = await pagefindRef.current;
    if (!pf)
      throw new Error('Search index unavailable');

    const search = await pf.search(query);
    const results = await Promise.all(
      search.results.map(async (r) => {
        const data = await r.data();
        const pathname = decodeURI(new URL(data.url, window.location.origin).pathname);
        return postsByUrl.current.get(`${stripLocale(pathname).replace(/\/$/, '')}/`);
      }),
    );
    return [...new Set(results.filter((r): r is BlogPost => r != null))];
  }, [posts]);

  const searchByTag = useCallback((query: string): BlogPost[] => {
    if (!query)
      return posts;
    const lowerQuery = query.toLowerCase();
    return posts.filter((post) =>
      post.data.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }, [posts]);

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setAppliedQuery(values);
    setSearchError(false);
    setIsSearchActive(true);
    setIsSearching(true);
    try {
      const url = new URL(window.location.href);

      if (values.search !== '') {
        url.searchParams.set('type', values.searchType);
        url.searchParams.set('q', values.search);
      }

      let result: BlogPost[];
      if (values.search === '') {
        result = posts;
      }
      else if (values.searchType === 'tag') {
        result = searchByTag(values.search);
      }
      else {
        result = await searchWithPagefind(values.search);
      }

      if (selectedCategory !== '' && selectedCategory !== null) {
        url.searchParams.set('category', selectedCategory);
        setArticles(result.filter((post) => post.data.category === selectedCategory));
      }
      else {
        url.searchParams.delete('category');
        setArticles(result);
      }

      window.history.pushState({}, '', url);
      virtualizer.scrollToOffset(0);
    }
    catch {
      setSearchError(true);
    }
    finally {
      setIsSearching(false);
    }
  }, [searchWithPagefind, searchByTag, setArticles, setIsSearchActive, selectedCategory, posts, virtualizer]);

  const searchCategory = useCallback((category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
    }
    else {
      setSelectedCategory(category);
    }
  }, [selectedCategory]);

  function resetForm() {
    form.reset();
    setAppliedQuery({ search: '', searchType: 'title-content' });
    setSearchError(false);
    setIsSearchActive(false);
    setArticles(posts);
    resetCategoryRef.current = selectedCategory !== '';
    setSelectedCategory('');
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('q');
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);
    virtualizer.scrollToOffset(0);
  }

  useEffect(() => {
    if (resetCategoryRef.current) {
      resetCategoryRef.current = false;
      return;
    }
    if (mounted) {
      onSubmit(appliedQuery);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchType = url.searchParams.get('type');
    const searchQuery = url.searchParams.get('q');
    const category = url.searchParams.get('category');

    if ((searchType === 'tag' || searchType === 'title-content') && searchQuery) {
      form.setValue('searchType', searchType);
      setAppliedQuery({ search: searchQuery, searchType });
      form.setValue('search', searchQuery);

      if (category !== null && category !== '') {
        searchCategory(category);
      }
      else {
        onSubmit(form.getValues());
      }
    }
    else if (category !== null && category !== '') {
      searchCategory(category);
    }
    else {
      form.setValue('searchType', 'title-content');
      form.setValue('search', '');
    }
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      <CategoryTags locale={locale} categories={categories} selectedCategory={selectedCategory} onSelectCategory={searchCategory} />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="search-area">
            <FormField
              control={form.control}
              name="searchType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    name={field.name}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="blog-search-type-select" aria-label={t('blog-search.submit', '검색')} className="w-[9rem] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="title-content">{t('blog-search.title_content', 'Title & Content')}</SelectItem>
                      <SelectItem value="tag">{t('blog-search.tag', 'Tag')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="search-input rounded-lg" data-testid="blog-search-query-input" aria-label={t('blog-search.query', '검색어')} placeholder={t('blog-search.query', '검색어')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" size="icon" type="submit" data-testid="blog-search-submit" aria-label={t('blog-search.submit', '검색')}>
              <Icon icon="tabler:search" className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="reset-btn rounded-lg"
              type="button"
              name="search-reset"
              data-testid="blog-search-reset"
              aria-label={t('blog-search.reset', '검색 초기화')}
              onClick={resetForm}
            >
              <Icon icon="tabler:rotate" className="h-[1.5rem] w-[1.5rem] "></Icon>
            </Button>
          </form>
        </Form>
        {isSearchActive && !searchError && (
          <div className="search-result">
            <FadeText
              className="transition ease-out text-neutral-400"
              direction="down"
              framerProps={{
                show: { transition: { delay: 0.1 } },
              }}
              text={t('blog-search.results', '{count}개의 포스트를 찾았습니다.', { count: articles.length })}
            />
          </div>
        )}
      </div>

      <div className="relative">
        {searchError && <p role="alert" className="my-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4">{t('blog-search.unavailable', '검색 색인을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')}</p>}
        {isSearching && <SearchLoading locale={locale} />}
        {articles.length > 0
          ? (
              <div
                ref={listRef}
                style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const article = articles[virtualRow.index];
                  return (
                    <div
                      key={`${article.data.title}-${article.data.category}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                      }}
                    >
                      <EachArticle
                        locale={locale}
                        frontmatter={article.data}
                        url={localizePath(`/blog/${article.id}`)}
                      />
                    </div>
                  );
                })}
              </div>
            )
          : (
              <div className="empty-result" role="status" aria-label={t('blog-search.empty', '검색 결과가 없습니다.')}>
                <div>
                  <Icon icon="mynaui:inbox-x" className="empty-icon" />
                  <div className="desc">{t('blog-search.empty', '검색 결과가 없습니다.')}</div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
