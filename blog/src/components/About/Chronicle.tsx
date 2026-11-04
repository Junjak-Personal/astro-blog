import type { StringKeyType } from '@/types/commonType.ts';
import { motion } from 'framer-motion';

// @flow
import * as React from 'react';
import { FreeTimeline } from '@/components/About/ChronicleComp/FreeTimeline.tsx';
import { QesgTimeline } from '@/components/About/ChronicleComp/QesgTimeline';
import { Twoz1stTimeline } from '@/components/About/ChronicleComp/Twoz1stTimeline.tsx';
import { Twoz2ndTimeline } from '@/components/About/ChronicleComp/Twoz2ndTimeline.tsx';
import { Twoz3rdTimeline } from '@/components/About/ChronicleComp/Twoz3rdTimeline.tsx';
import { UnivTimeline } from '@/components/About/ChronicleComp/UnivTimeline.tsx';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline';

export function Chronicle() {
  const [isOpen, setIsOpen] = React.useState<StringKeyType<boolean>>({
    qesgTeamLead: false,
    qesgManager: false,
    free: false,
    twoz3rd: false,
    twoz2nd: false,
    twoz1st: false,
    univ: false,
  });

  function handleOpenChange(key: string) {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        Timeline
      </motion.h2>
      <p className="text-muted-foreground mb-4">
        Vue.js를 주로 사용해 온 프론트엔드 개발자였지만,
        <br />
        AI 시대에 개발 영역 간의 경계가 허물어지면서 현재는 백엔드, 인프라, 설계까지 담당하고 있습니다.
        <br />
        업무 외적으로는 Astro를 활용한 정적 페이지와 Flutter를 활용한 앱 개발 등 다양한 개인 프로젝트를 진행하고 있습니다.
        <br />
        이하 현재까지의 경력사항 및 진행한 프로젝트입니다.
        <br />
        더 자세한 사항은
        {' '}
        <a href="https://memo.jun-devlog.win/ext/01M6KQ3X9KXJGEVP1PPYZC5NKX" target="_blank" rel="noopener noreferrer" className="resume-link ">이력서</a>
        를 참고해주세요.
      </p>

      <Timeline>
        <TimelineItem status="done">

          <TimelineHeading>QESG 개발팀 팀 리더</TimelineHeading>
          <TimelineDot status="current" />
          <TimelineLine done />
          <TimelineContent>
            <QesgTimeline role="team-lead" isOpen={isOpen} handleOpenChange={handleOpenChange} />

          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">
          <TimelineHeading>QESG 매니저</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <QesgTimeline role="manager" isOpen={isOpen} handleOpenChange={handleOpenChange} />

          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">

          <TimelineHeading>Free</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <FreeTimeline isOpen={isOpen} handleOpenChange={handleOpenChange} />

          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">
          <TimelineHeading>트웬티온스 선임</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <Twoz3rdTimeline isOpen={isOpen} handleOpenChange={handleOpenChange} />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">
          <TimelineHeading>트웬티온스 전임</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <Twoz2ndTimeline isOpen={isOpen} handleOpenChange={handleOpenChange} />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">
          <TimelineHeading>트웬티온스 인턴</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <Twoz1stTimeline isOpen={isOpen} handleOpenChange={handleOpenChange} />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="done">
          <TimelineHeading>경희대학교 컴퓨터공학 학사</TimelineHeading>
          <TimelineDot status="default" />
          <TimelineLine done />
          <TimelineContent>
            <UnivTimeline isOpen={isOpen} handleOpenChange={handleOpenChange} />
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
