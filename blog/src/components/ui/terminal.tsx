import type { MotionProps } from 'motion/react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedSpan({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSpanProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : delay / 1000 }}
      className={cn('grid text-sm font-normal tracking-tight', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface TypingAnimationProps extends MotionProps {
  children?: string;
  className?: string;
  duration?: number;
  delay?: number;
  text?: string;
  as?: React.ElementType;
  onComplete?: () => void;
}

export function TypingAnimation({
  children,
  text,
  className,
  duration = 60,
  delay = 0,
  as: Component = 'span',
  onComplete,
  ...props
}: TypingAnimationProps) {
  const content = text ?? children ?? '';
  const reducedMotion = useReducedMotion();

  const MotionComponent = useMemo(() => motion.create(Component, { forwardMotionProps: true }), [Component]);

  const [displayedText, setDisplayedText] = useState<string>('');
  const completionRef = useRef(onComplete);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion) {
      completionRef.current?.();
      return;
    }

    let i = 0;
    let typingEffect: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      typingEffect = setInterval(() => {
        i++;
        setDisplayedText(content.substring(0, i));
        if (i >= content.length) {
          clearInterval(typingEffect);
          completionRef.current?.();
        }
      }, duration);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingEffect);
    };
  }, [content, delay, duration, reducedMotion]);

  return (
    <MotionComponent
      className={cn('inline-block min-h-[1.5em] text-sm font-normal tracking-tight', className)}
      {...props}
    >
      {reducedMotion ? content : displayedText}
    </MotionComponent>
  );
}

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export function Terminal({ children, className }: TerminalProps) {
  return (
    <div
      className={cn(
        'z-0 w-full max-w-lg rounded-xl border border-border bg-background',
        className,
      )}
    >
      <div className="flex flex-col gap-y-2 border-b border-border p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="p-4">
        <code className="grid gap-y-1 overflow-auto">{children}</code>
      </pre>
    </div>
  );
}
