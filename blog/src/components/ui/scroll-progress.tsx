import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  useEffect(() => {
    let frame = 0;
    const resetProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollRange = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0;
        scrollYProgress.jump(progress);
        scaleX.jump(progress);
      });
    };
    resetProgress();
    document.addEventListener('home:ready', resetProgress);
    document.addEventListener('astro:page-load', resetProgress);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('home:ready', resetProgress);
      document.removeEventListener('astro:page-load', resetProgress);
    };
  }, [scrollYProgress, scaleX]);

  return (
    <motion.div
      data-testid="layout-scroll-progress"
      className={cn(
        'fixed inset-x-0 top-0 z-[20] h-1 origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]',
        className,
      )}
      style={{
        scaleX,
      }}
    />
  );
}
