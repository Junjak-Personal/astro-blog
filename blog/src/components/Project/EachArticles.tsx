import type { Locale } from '@/i18n';
import type { ProjectInfo } from '@/types/commonType';
import { useStore } from '@nanostores/react';
import React from 'react';
import { TechIcon } from '@/components/About/TechStackComp/TechIcon';
import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';
import { cn } from '@/lib/utils';
import { $theme } from '@/store/system';
import getTechIcons from '@/utils/getTechIcons';
import { srcSet, variant } from '@/utils/imageVariant';

interface EachArticlesProps {
  frontmatter: ProjectInfo;
  url?: string;
  locale?: Locale;
}

const EachArticles: React.FC<EachArticlesProps> = ({ frontmatter, url, locale: initialLocale }) => {
  const { t, localizePath } = useI18n(initialLocale, contentMessages);
  const theme = useStore($theme);
  const techStacks = getTechIcons(frontmatter.techStacks ?? [], theme);

  return (
    <figure
      key={url}
      className={cn(
        'relative min-h-fit cursor-pointer  rounded-2xl',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
        'project-article-wrapper',
      )}
    >
      <a href={url ? localizePath(url) : undefined} className="h-full block">
        <article className="project-article">

          <img
            src={variant(frontmatter.thumbnail ?? '', 960)}
            srcSet={srcSet(frontmatter.thumbnail ?? '', [480, 960])}
            sizes="(max-width: 768px) 90vw, 400px"
            alt={frontmatter.title}
            loading="lazy"
            className="rounded-t-2xl project-thumbnail"
            onError={(e) => {
              const t = e.currentTarget; const o = frontmatter.thumbnail ?? '';
              if (t.dataset.fb === '2')
                return;
              if (t.dataset.fb === '1') { t.dataset.fb = '2'; t.src = '/fallbackImg.svg'; return; }
              t.dataset.fb = '1'; t.srcset = ''; t.src = o;
            }}
          />

          <div className="article-info">
            <h3 className="article-title">{frontmatter.title}</h3>
            <div className="duration">
              {frontmatter.duration?.replace(/진행\s?중|현재|present|ongoing|current/gi, t('project-card.ongoing', 'Present'))}
            </div>
            <p className="desc">
              {frontmatter.description?.split('<br/>').map((line, idx) => (
                <React.Fragment key={`${frontmatter.title}-${idx}`}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>

            <div className="tech-stack-wrapper">
              <div className="tech-stack-label">
                {t('project-card.tech_stack', 'Tech Stack')}
              </div>
              <div className="tech-stack-list">
                {techStacks.map((tech) => (
                  <TechIcon
                    key={`${frontmatter.title}-${tech.techName}`}
                    iconUrl={tech.iconUrl}
                    techName={tech.techName}
                    backgroundSize="size-7 shrink-0"
                    iconSize="size-5 object-contain"
                    hoverSize="p-1 text-sm"
                  />
                ))}
              </div>

            </div>
          </div>
        </article>
      </a>
    </figure>
  );
};

export default EachArticles;
