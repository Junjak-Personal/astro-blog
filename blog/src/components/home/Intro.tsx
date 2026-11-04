import BoxReveal from '@/components/ui/box-reveal';
import { Button } from '@/components/ui/button';
import { FadeText } from '@/components/ui/fade-text';
import { Icon } from '@/components/ui/icon';

const destinations = [
  { label: 'Blog', href: '/blog/', icon: 'material-symbols:article-outline', testId: 'home-blog-link' },
  { label: 'Project', href: '/project/', icon: 'material-symbols:work-outline', testId: 'home-project-link' },
  { label: 'Playground', href: '/playground/', icon: 'material-symbols:science-outline', testId: 'home-playground-link' },
];

const developmentTopics = [
  { label: '웹 개발', icon: 'mdi:web' },
  { label: '프론트엔드', icon: 'mdi:laptop' },
];

const interests = [
  { label: '게임', icon: 'mdi:gamepad-variant' },
  { label: '여행', icon: 'mdi:beach' },
  { label: '음악', icon: 'mdi:music' },
  { label: '애니메이션', icon: 'mdi:movie-open' },
];

export default function Intro() {
  return (
    <div className="mt-4 space-y-4 text-center">
      <BoxReveal width="100%" boxColor="rgba(39,39,39,0.6)" duration={0.5}>
        <p className="max-sm:text-sm">
          안녕하세요, 여기는 저의 개인 블로그입니다.
          <br />
          이 블로그에서는 저의 간단한 정보들을 확인 할 수 있습니다.
        </p>
      </BoxReveal>
      <BoxReveal width="100%" boxColor="rgba(39,39,39,0.6)" duration={1}>
        <div className="max-sm:text-sm">
          <p>블로그 포스트는 주로 개발에 관한 것들,</p>
          <FadeText
            className="font-bold"
            direction="right"
            framerProps={{ show: { transition: { delay: 0.4 } } }}
            text={(
              <>
                (
                {developmentTopics.map((topic, index) => (
                  <span key={topic.label} className="whitespace-nowrap">
                    {index > 0 && ', '}
                    <Icon icon={topic.icon} ssr aria-hidden="true" className="inline-block size-4 align-text-bottom" />
                    {' '}
                    {topic.label}
                  </span>
                ))}
                )
              </>
            )}
          />
          <p className="mt-1">그리고 제가 관심있어 하는 주제를 올릴 예정입니다.</p>
          <FadeText
            className="font-bold"
            direction="right"
            framerProps={{ show: { transition: { delay: 0.4 } } }}
            text={(
              <>
                (
                {interests.map((interest, index) => (
                  <span key={interest.label} className="whitespace-nowrap">
                    {index > 0 && ', '}
                    <Icon icon={interest.icon} ssr aria-hidden="true" className="inline-block size-4 align-text-bottom" />
                    {' '}
                    {interest.label}
                  </span>
                ))}
                )
              </>
            )}
          />
        </div>
      </BoxReveal>
      <BoxReveal width="100%" boxColor="rgba(39,39,39,0.6)" duration={1.5}>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {destinations.map((destination) => (
            <Button key={destination.href} variant="outline" asChild>
              <a href={destination.href} data-testid={destination.testId}>
                <Icon icon={destination.icon} ssr className="mr-2 size-5 shrink-0" />
                {destination.label}
              </a>
            </Button>
          ))}
        </div>
      </BoxReveal>
    </div>
  );
}
