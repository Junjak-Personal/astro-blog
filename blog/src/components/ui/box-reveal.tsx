import type { ReactElement } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

interface BoxRevealProps {
  children: ReactElement;
  width?: 'fit-content' | '100%';
  boxColor?: string;
  duration?: number;
}

export function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
}: BoxRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion || isInView ? 'visible' : 'hidden'}
        transition={shouldReduceMotion
          ? { duration: 0 }
          : { duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-1 bottom-1 z-20"
          variants={{
            hidden: { x: 0 },
            visible: { x: '100%' },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
          style={{ background: boxColor || '#5046e6' }}
        />
      )}
    </div>
  );
}

export default BoxReveal;
