import type { Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';

interface FadeTextProps {
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  framerProps?: Variants;
  text: ReactNode;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export function FadeText({
  direction = 'up',
  className,
  framerProps = defaultVariants,
  text,
}: FadeTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const directionOffset = { up: 10, down: -10, left: -10, right: 10 }[direction];
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';

  const fadeVariants = useMemo<Variants>(() => {
    const { hidden, show, ...rest } = framerProps;
    return {
      ...rest,
      hidden: typeof hidden === 'function'
        ? hidden
        : {
            ...hidden,
            opacity: hidden?.opacity ?? 0,
            [axis]: hidden?.[axis] ?? directionOffset,
          },
      show: typeof show === 'function'
        ? show
        : {
            ...show,
            opacity: show?.opacity ?? 1,
            [axis]: show?.[axis] ?? 0,
            transition: { duration: 0.35, ease: 'easeOut', ...show?.transition },
          },
    };
  }, [directionOffset, axis, framerProps]);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? { opacity: 1, x: 0, y: 0 } : undefined}
      whileInView={shouldReduceMotion ? undefined : 'show'}
      viewport={{ once: true }}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      variants={shouldReduceMotion ? undefined : fadeVariants}
    >
      <span className={className}>{text}</span>
    </motion.div>
  );
}
