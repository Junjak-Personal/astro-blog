import { Icon } from '@/components/ui/icon';
import { motion } from 'framer-motion';
// @flow
import * as React from 'react';
import profileImg from '@/assets/images/profile.png';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

const titleFramer = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};
const contentFramer = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, x: 0 },
};

export function SimpleIntro() {
  return (
    <motion.section layout className="simple-intro">
      <div className="simple-intro-wrapper">
        <figure
          className={`${cn(
            'relative mx-auto h-[23.5rem] max-md:w-full w-[20rem] overflow-hidden rounded-2xl py-4',
            // animation styles

            'transition-all duration-200 ease-in-out hover:scale-[103%]',
            // light styles

            'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
            // dark styles

            'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
          )} profile-wrapper`}
        >
          <div className="flex justify-center">
            <Avatar className="size-52 bg-zinc-200 dark:bg-zinc-800">
              <AvatarImage src={profileImg.src} alt="서점에서 책을 읽는 윤준현" className="object-cover scale-150 origin-[50%_60%]" />
              <AvatarFallback>MY</AvatarFallback>
            </Avatar>
          </div>

          <div className="name text-zinc-800 dark:text-zinc-100">
            Yoon JunHyeon
          </div>
          <div className="desc text-zinc-500 dark:text-zinc-400">
            Software Developer · Team Lead
          </div>
          <div className="desc text-zinc-500 dark:text-zinc-400">
            Currently - QESG
          </div>
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/JunjaK" aria-label="GitHub">
                <Icon icon="mingcute:github-fill" className="icon size-5 shrink-0 text-gray-700 dark:text-gray-300" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:haring157@gmail.com" aria-label="Email">
                <Icon icon="mingcute:mail-fill" className="icon size-5 shrink-0 text-gray-700 dark:text-gray-300" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://memo.jun-devlog.win/ext/01M6KQ3X9KXJGEVP1PPYZC5NKX" aria-label="Resume">
                <Icon icon="mingcute:profile-fill" className="icon size-5 shrink-0 text-gray-700 dark:text-gray-300" />
              </a>
            </Button>
          </div>
        </figure>

        <div className="desc-wrapper">
          <motion.h3
            className="text-zinc-800 dark:text-zinc-100 mt-2"
            variants={titleFramer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            Hi, I'm JunHyeon
          </motion.h3>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFramer}
            className="mt-3"
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="desc text-zinc-700 dark:text-zinc-300 ">
              저는 게임과 서브컬쳐, 그리고 일본 여행을 좋아하는 소프트웨어 개발자입니다.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFramer}
            className="mt-2"
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="desc text-zinc-700 dark:text-zinc-300">
              직접 만든 기능이 화면에서 바로 반응하는 재미에 프론트엔드 개발을 시작했습니다.
            </p>
            <p className="desc text-zinc-700 dark:text-zinc-300">
              AI 시대에 개발 영역 간의 경계가 허물어지면서,
            </p>
            <p className="desc text-zinc-700 dark:text-zinc-300">
              현재는 프론트엔드뿐 아니라 백엔드, 인프라, 설계까지 맡고 있습니다.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFramer}
            className="mt-2"
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="desc text-zinc-700 dark:text-zinc-300">
              다양하고 새로운 기술을 사용하여 생산성을 올리는 것에 큰 관심을 가지고 있고,
            </p>
            <p className="desc text-zinc-700 dark:text-zinc-300">
              여러 아티클, 유튜브 등을 보며 최신 기술 동향을 파악하려고 노력하고 있습니다.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFramer}
            className="mt-2"
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <p className="desc text-zinc-700 dark:text-zinc-300">
              최근에는 멀티 에이전트 오케스트레이션과 저에게 맞는 하네스 구조를 정착시키는 데 관심을 두고,
            </p>
            <p className="desc text-zinc-700 dark:text-zinc-300">
              개인 프로젝트를 꾸준히 진행하는 데 힘쓰고 있습니다.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFramer}
            className="mt-2"
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <p className="desc text-zinc-700 dark:text-zinc-300">
              이 블로그는 예전부터 기술 블로그를 만들어 보고 싶었던 소망을 이루기 위해,
            </p>
            <p className="desc text-zinc-700 dark:text-zinc-300">
              그리고 새로운 기술을 써서 개인 프로젝트를 진행해보자! 라는 모토로 만들어졌습니다.
            </p>
          </motion.div>
        </div>
      </div>

    </motion.section>
  );
}
