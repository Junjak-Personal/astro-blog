import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const containerElement = containerRef.current;
    const context = canvasElement?.getContext('2d');
    if (!canvasElement || !containerElement || !context)
      return;
    const canvas = canvasElement;
    const container = containerElement;
    const ctx = context;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frameInterval = 1000 / 24;
    let frameId: number | null = null;
    let lastFrameTime: number | null = null;
    let isInView = false;
    let cols = 0;
    let rows = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let dpr = 1;
    let squares = new Float32Array(0);

    function drawGrid() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = color;
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          ctx.globalAlpha = squares[col * rows + row];
          ctx.fillRect(col * (squareSize + gridGap), row * (squareSize + gridGap), squareSize, squareSize);
        }
      }
      ctx.globalAlpha = 1;
    }

    function canAnimate() {
      return isInView && !document.hidden && !motionPreference.matches && squares.length > 0;
    }

    function animate(time: number) {
      frameId = null;
      if (!canAnimate())
        return;

      if (lastFrameTime === null)
        lastFrameTime = time;
      const elapsed = time - lastFrameTime;
      if (elapsed >= frameInterval) {
        const deltaTime = Math.min(elapsed / 1000, 0.1);
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < flickerChance * deltaTime)
            squares[i] = Math.random() * maxOpacity;
        }
        drawGrid();
        lastFrameTime = time;
      }
      frameId = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      lastFrameTime = null;
      if (canAnimate())
        frameId = requestAnimationFrame(animate);
    }

    function updateCanvasSize() {
      const nextWidth = Math.max(0, width ?? container.clientWidth);
      const nextHeight = Math.max(0, height ?? container.clientHeight);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (nextWidth === canvasWidth && nextHeight === canvasHeight && nextDpr === dpr)
        return;

      canvasWidth = nextWidth;
      canvasHeight = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(canvasWidth * dpr);
      canvas.height = Math.round(canvasHeight * dpr);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      const cellSize = Math.max(1, squareSize + gridGap);
      cols = Math.floor(canvasWidth / cellSize);
      rows = Math.floor(canvasHeight / cellSize);
      squares = Float32Array.from({ length: cols * rows }, () => Math.random() * maxOpacity);
      drawGrid();
      syncAnimation();
    }

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      syncAnimation();
    });

    updateCanvasSize();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', syncAnimation);
    motionPreference.addEventListener('change', syncAnimation);

    return () => {
      if (frameId !== null)
        cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncAnimation);
      motionPreference.removeEventListener('change', syncAnimation);
    };
  }, [color, flickerChance, gridGap, height, maxOpacity, squareSize, width]);

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />
    </div>
  );
}
