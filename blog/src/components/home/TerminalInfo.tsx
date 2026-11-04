'use client';

import { useCallback, useRef } from 'react';
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from '@/components/ui/terminal';

export default function TerminalInfo() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const handleReady = useCallback(() => {
    const content = terminalRef.current?.closest('[data-home]')?.querySelector<HTMLElement>('[data-home-content]');
    if (content) {
      content.hidden = false;
      document.dispatchEvent(new Event('home:ready'));
    }
  }, []);

  return (
    <div ref={terminalRef} className="w-full max-w-lg" data-testid="home-terminal-panel">
      <Terminal className="">
        <TypingAnimation duration={24}>&gt; bunx blog@latest init</TypingAnimation>

        <AnimatedSpan delay={600} className="text-green-500">
          <span>✔ Preflight checks.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1000} className="text-green-500">
          <span>✔ Installing dependencies...</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1400} className="text-green-500">
          <span>✔ Check updates...</span>
        </AnimatedSpan>

        <AnimatedSpan delay={1800} className="text-blue-500">
          <span>ℹ Current version is Latest!:</span>
        </AnimatedSpan>

        <TypingAnimation duration={20} delay={2200} className="text-muted-foreground" onComplete={handleReady}>
          Success! Dev-Blog loaded completed.
        </TypingAnimation>
      </Terminal>
    </div>
  );
}
