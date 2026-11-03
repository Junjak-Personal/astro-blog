import type { StringKeyType } from '@/types/commonType.ts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import { EachProject } from '@/components/About/ChronicleComp/EachProject.tsx';
import { Button } from '@/components/ui/button.tsx';

import { Card, CardDescription, CardTitle } from '@/components/ui/card.tsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { $theme } from '@/store/system.ts';
import getTechIcons from '@/utils/getTechIcons';

type Props = {
  role?: 'manager' | 'team-lead';
  isOpen: StringKeyType<boolean>;
  handleOpenChange: (key: string) => void;
};

export function QesgTimeline({ role = 'team-lead', isOpen, handleOpenChange }: Props) {
  const theme = useStore($theme);
  const stateKey = role === 'manager' ? 'qesgManager' : 'qesgTeamLead';
  const title = role === 'manager' ? 'QESG 매니저' : 'QESG 개발팀 팀 리더';
  const duration = role === 'manager' ? '2025.04 ~ 2026.10.07' : '2026.10.08 ~ Present';
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function projectList(mode: string) {
    if (role === 'team-lead') {
      return [
        {
          title: 'QESG Core',
          duration: '2026.08.20 ~ Present',
          desc: '여러 ESG 제품이 같은 계정·고객사·프로젝트·권한을 사용하는 공통 플랫폼입니다. 정 담당으로 개발과 유지보수를 맡고 있습니다.\nKotlin·Spring Boot 백엔드와 Nuxt 프론트엔드로 공통 로그인, OAuth 인가 서버, 구성원 초대·권한, 고객사 포털과 백오피스를 개발했습니다. 제품마다 중복되던 계정 관리와 알림을 공통 기반으로 모았습니다.',
          techStackIcon: getTechIcons(['kotlin', 'spring', 'postgresql', 'redis', 'typescript', 'nuxt', 'pinia'], mode),
        },
        {
          title: 'QESG Design System',
          duration: '2026.03.04 ~ Present',
          desc: '사내 제품의 UI와 동작을 통일하는 공통 컴포넌트 라이브러리입니다. 정 담당으로 토큰·컴포넌트 개발과 패키지 발행을 맡고 있습니다.\nVue 컴포넌트를 디자인과 동작의 기준으로 두고, React 컴포넌트도 같은 계약에 맞춰 검증합니다. 색·간격 토큰을 별도 패키지로 분리하고, Storybook과 한국어·영어·중국어 대응을 함께 관리합니다.',
          techStackIcon: getTechIcons(['typescript', 'vue', 'react', 'storybook', 'tailwindcss', 'pnpm'], mode),
        },
        {
          title: 'DMS v2 (Data Management System)',
          duration: '2026.08.21 ~ Present',
          desc: '엑셀과 이메일에 흩어져 있던 ESG 정량 데이터를 사업장·회차·지표별로 모으고 검증·승인하는 플랫폼입니다. 정 담당으로 개발을 맡고 있습니다.\nKotlin·Spring Boot와 Nuxt 기반으로 프로젝트·템플릿 관리, Handsontable·HyperFormula를 이용한 시트 입력과 수식, 셀 단위 저장, 증빙 첨부와 승인 단계를 개발했습니다. 공통 인증은 QESG Core와 연결하고, 제품 안에 공통 AI Shell을 통합했습니다.',
          techStackIcon: [
            ...getTechIcons(['kotlin', 'spring', 'postgresql', 'redis', 'typescript', 'nuxt'], mode),
            { iconUrl: '/images/icon/tech-stack/light/handsontable.png', techName: 'Handsontable' },
          ],
        },
        {
          title: 'QESG Harness',
          duration: '2026.10.07 ~ Present',
          desc: '개발팀이 AI 코딩 에이전트를 같은 규칙과 절차로 쓰도록 만든 사내 개발 도구입니다. 정 담당으로 설계·개발과 배포를 맡고 있습니다.\n이슈 작성부터 계획·구현·검증·PR·QA까지의 흐름을 skill로 제공하고, hook으로 운영 DB 접근이나 직접 머지 같은 동작을 통제합니다. 저장소별 정책과 담당자를 적용하며, Claude Code와 Codex 환경 및 macOS·Windows 사용을 지원합니다.',
          techStackIcon: getTechIcons(['claudecode', 'codex', 'nodedotjs', 'python', 'githubactions'], mode),
        },
        {
          title: 'QESG Client Auth',
          duration: '2026.09.02 ~ Present',
          desc: 'QESG Core 계정으로 로그인하는 제품들이 함께 쓰는 인증 클라이언트입니다. 정 담당으로 개발과 유지보수를 맡고 있습니다.\n앱마다 다르게 구현하기 쉬운 세션 복구·만료·CSRF 처리를 프레임워크에 의존하지 않는 TypeScript 모듈로 묶었습니다. 토큰 인증에서 공통 세션 쿠키 방식으로 전환하고, MFA 등록과 기기별 로그아웃 흐름을 지원합니다.',
          techStackIcon: getTechIcons(['typescript', 'swagger'], mode),
        },
        {
          title: 'QESG AI Shell',
          duration: '2026.09.10 ~ Present',
          desc: '여러 제품과 단독 화면에서 같은 AI 대화 UI를 쓰게 하는 공용 패키지입니다. 정 담당으로 개발과 유지보수를 맡고 있습니다.\nAgent 클라이언트, SSE 스트리밍, 상태와 계약 타입을 공통 core로 분리하고 Vue·React 화면이 이를 함께 사용합니다. 시트·셀 등 사용자가 보고 있는 위치를 대화 맥락으로 넘기고, 작업별 대화와 명령을 제품 안에서 이어갈 수 있도록 구성했습니다.',
          techStackIcon: getTechIcons(['typescript', 'vue', 'react', 'pinia', 'zustand', 'immer'], mode),
        },
        {
          title: 'QESG Client Notify',
          duration: '2026.10.07 ~ Present',
          desc: 'QESG Core의 알림을 여러 제품에서 일관되게 받는 공통 클라이언트 모듈입니다. 정 담당으로 개발과 유지보수를 맡고 있습니다.\n인박스 조회, WebSocket 실시간 수신, 브라우저 푸시와 Service Worker 처리를 TypeScript로 묶었습니다. 알림 구독과 링크 검증은 모듈이 담당하고, 각 제품은 자신의 화면에 맞게 알림을 표시합니다.',
          techStackIcon: getTechIcons(['typescript', 'esbuild'], mode),
        },
      ];
    }
    return [
      {
        title: 'DMS v1 (ERT Data Management System)',
        duration: '2025.09.03 ~ 2026.09.07',
        desc: '엑셀과 이메일로 수집하던 ESG 데이터를 한곳에서 관리하는 시스템을 개발했습니다.\n초기 요구사항과 기획을 바탕으로 DB 설계, UI/UX, 기능 설계, 프론트엔드 메인 개발과 개발 PM을 맡았습니다. 데이터 편집·증빙·결재를 엑셀과 유사한 인터페이스에서 처리하고 대용량 편집을 지원하도록 Handsontable을 커스텀했습니다.\n종료일은 마지막 성능 측정일인 2026년 9월 7일 기준입니다.',
        techStackIcon: [
          { iconUrl: `/images/icon/tech-stack/${mode}/typescript.svg`, techName: 'Typescript' },
          { iconUrl: `/images/icon/tech-stack/${mode}/nuxt.svg`, techName: 'Nuxt' },
          { iconUrl: `/images/icon/tech-stack/${mode}/unocss.svg`, techName: 'Uno CSS' },
          { iconUrl: `/images/icon/tech-stack/light/naive-ui.svg`, techName: 'Naive UI' },
          { iconUrl: `/images/icon/tech-stack/light/handsontable.png`, techName: 'Handsontable' },
          { iconUrl: `/images/icon/tech-stack/${mode}/vitest.svg`, techName: 'Vitest' },
          { iconUrl: `/images/icon/tech-stack/${mode}/playwright.svg`, techName: 'Playwright' },
          { iconUrl: `/images/icon/tech-stack/${mode}/github.svg`, techName: 'GitHub' },
          { iconUrl: `/images/icon/tech-stack/${mode}/claudecode.svg`, techName: 'Claude Code' },
          { iconUrl: `/images/icon/tech-stack/${mode}/amazons3.svg`, techName: 'S3' },
          { iconUrl: `/images/icon/tech-stack/${mode}/mysql.svg`, techName: 'mysql' },
          { iconUrl: `/images/icon/tech-stack/${mode}/swagger.svg`, techName: 'Swagger' },
        ],
      },
      {
        title: 'Carbon v1 (만도 카본)',
        duration: '2026.06.22 ~ Present',
        desc: '매니저 재직 중이던 2026년 6월 22일, 이미 운영 중인 탄소배출 관리 서비스를 인계받았습니다.\n기존 운영 서비스의 유지보수를 맡았으며, 팀 리더로 역할이 바뀐 이후에도 현재까지 운영을 이어가고 있습니다.',
        techStackIcon: getTechIcons(['typescript', 'react', 'vite', 'python', 'fastapi'], mode),
      },
      {
        title: 'Custom Assessment',
        duration: '2025.04 ~ 2026.07.16',
        desc: 'ESG 평가 플랫폼의 유지보수와 신규 평가 대응을 맡았습니다. 입사 초 온보딩을 이 프로젝트로 진행했으며, 두 개의 대규모 평가를 위한 신규 개발과 운영 대응을 담당했습니다.\n운영 중인 서비스의 비즈니스 로직을 파악하고 평가 일정에 맞춰 기능 개발과 운영 이슈에 대응했습니다.',
        techStackIcon: [
          { iconUrl: `/images/icon/tech-stack/${mode}/javascript.svg`, techName: 'Javascript' },
          { iconUrl: `/images/icon/tech-stack/${mode}/vuedotjs.svg`, techName: 'Vue' },
          { iconUrl: `/images/icon/tech-stack/${mode}/mysql.svg`, techName: 'mysql' },
          { iconUrl: `/images/icon/tech-stack/${mode}/python.svg`, techName: 'Python' },
          { iconUrl: `/images/icon/tech-stack/${mode}/flask.svg`, techName: 'Flask' },
        ],
      },
    ];
  }

  const collapsibleVariants = {
    open: { height: 'auto', opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  return (
    <div>
      <Collapsible
        open={isOpen[stateKey]}
        onOpenChange={() => handleOpenChange(stateKey)}
        className="space-y-2"
      >
        <div className="flex items-center justify-between collapsible">
          <div className="text-md font-semibold">
            {duration}
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0" data-testid={`about-qesg-${role}-toggle`} aria-label={`${title} 경력 ${isOpen[stateKey] ? '접기' : '펼치기'}`}>
              {isOpen[stateKey]
                ? (<ChevronUp className="w-4 h-4" aria-hidden="true" />)
                : (<ChevronDown className="w-4 h-4" aria-hidden="true" />)}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <motion.div
          initial="closed"
          animate={isOpen[stateKey] ? 'open' : 'closed'}
          variants={collapsibleVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <CollapsibleContent className="space-y-2">
            <Card className="project-card">
              <CardTitle className="px-4 pt-4">
                {title}
              </CardTitle>
              <CardDescription className="px-4 mt-1 project-card-desc">
                {role === 'manager'
                  ? 'QESG에서 프론트엔드 개발자로 일하며 ESG 평가 플랫폼과 데이터 관리 시스템을 개발했습니다.'
                  : '2026년 10월 8일부터 QESG 개발팀 팀 리더를 맡고 있습니다.'}
              </CardDescription>
              {role === 'team-lead' && (
                <CardDescription className="px-4 mt-2 project-card-desc">
                  프로젝트 시작일은 각 저장소의 첫 커밋 기준입니다.
                </CardDescription>
              )}
              <Separator className="mt-4" />
              <ul className="p-4">
                {projectList(theme).map((project, idx) => {
                  return (
                    <li className="" key={`qesg-${role}-project-${project.title}`}>
                      <EachProject {...project}></EachProject>
                      {projectList(theme).length - 1 === idx || <Separator className="my-4" />}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </CollapsibleContent>
        </motion.div>
      </Collapsible>
    </div>
  );
}
