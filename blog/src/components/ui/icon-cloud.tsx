import type { PointerEvent, ReactNode } from 'react';
import type { Locale } from '@/i18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { chromeMessages } from '@/i18n/chrome';
import { useI18n } from '@/i18n/react';
import { cn } from '@/lib/utils';

interface IconCloudProps {
  icons?: ReactNode[];
  images?: string[];
  maxSize?: number;
  className?: string;
  locale?: Locale;
}

type Point = { x: number; y: number; z: number; id: number };
type Rotation = Pick<Point, 'x' | 'y'>;
type TargetRotation = {
  start: Rotation;
  end: Rotation;
  startedAt: number;
  duration: number;
};
type DragState = { status: 'idle' } | {
  status: 'pending' | 'dragging' | 'scrolling';
  pointerId: number;
  pointerType: string;
  start: Rotation;
  last: Rotation;
  lastTime: number;
};
type AssetState = 'loading' | 'ready' | 'error';

const ICON_SIZE = 40;
const MAX_VELOCITY = 0.65;

function clampVelocity(value: number) {
  return Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, value));
}

function rotatePoint(point: Point, rotation: Rotation) {
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const x = point.x * cosY - point.z * sinY;
  const z = point.x * sinY + point.z * cosY;
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  return { ...point, x, y: point.y * cosX + z * sinX, z: z * cosX - point.y * sinX };
}

function nearestAngle(current: number, target: number) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

export function IconCloud({ icons, images, maxSize = 600, className, locale }: IconCloudProps) {
  const { t } = useI18n(locale, chromeMessages);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  const velocityRef = useRef<Rotation>({ x: 0.03, y: 0.1 });
  const hoverRef = useRef<Rotation | null>(null);
  const dragRef = useRef<DragState>({ status: 'idle' });
  const targetRef = useRef<TargetRotation | null>(null);
  const texturesRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const requestDrawRef = useRef(() => {});
  const reducedMotionRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState(0);
  const [assetState, setAssetState] = useState<AssetState>(icons?.length || images?.length ? 'loading' : 'ready');
  const itemCount = icons?.length || images?.length || 20;

  const positions = useMemo(() => {
    const increment = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: itemCount }, (_, id) => {
      const y = (id * 2 + 1) / itemCount - 1;
      const radius = Math.sqrt(1 - y * y);
      return { x: Math.cos(id * increment) * radius * 100, y: y * 100, z: Math.sin(id * increment) * radius * 100, id };
    });
  }, [itemCount]);

  // Pointer input stays outside React state, so movement never restarts the render loop.
  useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;
    const updateSize = () => setCanvasSize(Math.round(Math.min(container.clientWidth, maxSize)));
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [maxSize]);

  useEffect(() => {
    const sources = icons?.length ? icons : images;
    if (!sources?.length) {
      texturesRef.current = [];
      setAssetState('ready');
      requestDrawRef.current();
      return;
    }
    let disposed = false;
    let settled = 0;
    let loaded = 0;
    const imageElements: HTMLImageElement[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const textureSize = Math.round(ICON_SIZE * dpr);
    texturesRef.current = Array.from({ length: sources.length }, () => null);
    setAssetState('loading');

    const finish = () => {
      if (disposed)
        return;
      settled++;
      requestDrawRef.current();
      if (settled === sources.length)
        setAssetState(loaded ? 'ready' : 'error');
    };
    const loadImage = (source: string, index: number) => {
      if (disposed)
        return;
      const image = new Image();
      imageElements.push(image);
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (disposed)
          return;
        const texture = document.createElement('canvas');
        texture.width = textureSize;
        texture.height = textureSize;
        const context = texture.getContext('2d');
        if (context) {
          // Preserve the full logo and its aspect ratio instead of clipping it to a circle.
          const scale = textureSize / Math.max(image.naturalWidth, image.naturalHeight);
          const width = image.naturalWidth * scale;
          const height = image.naturalHeight * scale;
          context.drawImage(image, (textureSize - width) / 2, (textureSize - height) / 2, width, height);
          texturesRef.current[index] = texture;
          loaded++;
        }
        finish();
      };
      image.onerror = finish;
      image.src = source;
    };

    if (icons?.length) {
      // The optional React-node API remains supported without shipping the serializer
      // in the normal image-only path used by Home.
      import('react-dom/server').then(({ renderToStaticMarkup }) => {
        icons.forEach((icon, index) => {
          loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderToStaticMarkup(icon))}`, index);
        });
      }).catch(() => {
        if (!disposed)
          setAssetState('error');
      });
    }
    else {
      images?.forEach(loadImage);
    }
    return () => {
      disposed = true;
      for (const image of imageElements) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [icons, images]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !container || !canvasSize)
      return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasSize * dpr);
    canvas.height = Math.round(canvasSize * dpr);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let pausedAt = 0;
    let disposed = false;

    const draw = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden)
        return;
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      const target = targetRef.current;
      if (target) {
        const progress = Math.min(1, (time - target.startedAt) / target.duration);
        const eased = 1 - (1 - progress) ** 3;
        rotationRef.current = {
          x: target.start.x + (target.end.x - target.start.x) * eased,
          y: target.start.y + (target.end.y - target.start.y) * eased,
        };
        if (progress === 1)
          targetRef.current = null;
      }
      else if (!reducedMotionRef.current && dragRef.current.status !== 'dragging') {
        const hover = hoverRef.current;
        const desired = hover ? { x: hover.y * 0.22, y: hover.x * 0.22 } : { x: 0.03, y: 0.1 };
        const smoothing = 1 - Math.exp(-seconds * 4);
        velocityRef.current.x += (desired.x - velocityRef.current.x) * smoothing;
        velocityRef.current.y += (desired.y - velocityRef.current.y) * smoothing;
        rotationRef.current.x += velocityRef.current.x * seconds;
        rotationRef.current.y += velocityRef.current.y * seconds;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, canvasSize, canvasSize);
      const sphereScale = canvasSize / 280;
      const projected = positions.map((point) => rotatePoint(point, rotationRef.current)).sort((a, b) => a.z - b.z);
      for (const point of projected) {
        const scale = (point.z + 200) / 300;
        const size = ICON_SIZE * scale;
        const x = canvasSize / 2 + point.x * sphereScale - size / 2;
        const y = canvasSize / 2 + point.y * sphereScale - size / 2;
        context.globalAlpha = Math.max(0.28, Math.min(1, (point.z + 150) / 200));
        const texture = texturesRef.current[point.id];
        if (texture) {
          context.drawImage(texture, x, y, size, size);
        }
        else if (!icons?.length && !images?.length) {
          context.fillStyle = '#6366f1';
          context.beginPath();
          context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = '#f4f4f5';
          context.font = `${size / 2}px sans-serif`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(String(point.id + 1), x + size / 2, y + size / 2);
        }
      }
      context.globalAlpha = 1;
      if (!reducedMotionRef.current || targetRef.current)
        frame = requestAnimationFrame(draw);
    };
    const requestDraw = () => {
      if (!disposed && visible && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    };
    requestDrawRef.current = requestDraw;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const sync = () => {
      stop();
      const now = performance.now();
      if (!visible || document.hidden) {
        if (!pausedAt)
          pausedAt = now;
        return;
      }
      if (pausedAt) {
        if (targetRef.current)
          targetRef.current.startedAt += now - pausedAt;
        pausedAt = 0;
      }
      reducedMotionRef.current = motionQuery.matches;
      if (motionQuery.matches) {
        const target = targetRef.current;
        if (target)
          rotationRef.current = target.end;
        targetRef.current = null;
      }
      requestDraw();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(container);
    document.addEventListener('visibilitychange', sync);
    motionQuery.addEventListener('change', sync);
    return () => {
      disposed = true;
      stop();
      requestDrawRef.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motionQuery.removeEventListener('change', sync);
    };
  }, [canvasSize, positions, icons, images]);

  const focusIcon = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const sphereScale = canvasSize / 280;
    const hit = positions.map((point) => ({ original: point, rotated: rotatePoint(point, rotationRef.current) }))
      .sort((a, b) => b.rotated.z - a.rotated.z)
      .find(({ rotated }) => {
        const radius = ICON_SIZE / 2 * (rotated.z + 200) / 300;
        return (x - canvasSize / 2 - rotated.x * sphereScale) ** 2 + (y - canvasSize / 2 - rotated.y * sphereScale) ** 2 < radius ** 2;
      });
    if (!hit)
      return;
    const point = hit.original;
    const start = { ...rotationRef.current };
    const end = {
      x: nearestAngle(start.x, -Math.atan2(point.y, Math.hypot(point.x, point.z))),
      y: nearestAngle(start.y, Math.atan2(point.x, point.z)),
    };
    if (reducedMotionRef.current) {
      rotationRef.current = end;
    }
    else {
      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      targetRef.current = { start, end, startedAt: performance.now(), duration: Math.max(450, distance * 3000 / MAX_VELOCITY) };
    }
    requestDrawRef.current();
  }, [canvasSize, positions]);

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || event.button !== 0)
      return;
    targetRef.current = null;
    const start = { x: event.clientX, y: event.clientY };
    dragRef.current = { status: 'pending', pointerId: event.pointerId, pointerType: event.pointerType, start, last: start, lastTime: performance.now() };
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (drag.status === 'idle') {
      if (event.pointerType === 'mouse') {
        const rect = event.currentTarget.getBoundingClientRect();
        hoverRef.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
      }
      return;
    }
    if (event.pointerId !== drag.pointerId || drag.status === 'scrolling')
      return;
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;
    if (drag.status === 'pending') {
      if (Math.hypot(dx, dy) < 6)
        return;
      if (drag.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = { ...drag, status: 'scrolling' };
        return;
      }
      drag.status = 'dragging';
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const now = performance.now();
    const seconds = Math.max((now - drag.lastTime) / 1000, 0.008);
    const deltaX = (event.clientY - drag.last.y) * 0.004;
    const deltaY = (event.clientX - drag.last.x) * 0.004;
    rotationRef.current.x += deltaX;
    rotationRef.current.y += deltaY;
    velocityRef.current = { x: clampVelocity(deltaX / seconds), y: clampVelocity(deltaY / seconds) };
    drag.last = { x: event.clientX, y: event.clientY };
    drag.lastTime = now;
    requestDrawRef.current();
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (drag.status !== 'idle' && drag.pointerId === event.pointerId) {
      if (drag.status === 'pending')
        focusIcon(event.clientX, event.clientY);
      dragRef.current = { status: 'idle' };
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerCancel() {
    dragRef.current = { status: 'idle' };
    hoverRef.current = null;
  }

  return (
    <div ref={containerRef} className={cn('relative mx-auto w-full', className)} style={{ maxWidth: maxSize, aspectRatio: '1' }} data-load-state={assetState}>
      <canvas
        ref={canvasRef}
        className="block size-full rounded-lg touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={(event) => {
          hoverRef.current = null;
          if (!event.currentTarget.hasPointerCapture(event.pointerId))
            dragRef.current = { status: 'idle' };
        }}
        aria-label={t('icon-cloud.label', 'Interactive 3D Icon Cloud')}
        data-testid="home-icon-cloud-canvas"
        role="img"
      />
      {assetState === 'loading' && <span className="sr-only" role="status">{t('icon-cloud.loading', 'Loading technology icons…')}</span>}
      {assetState === 'error' && <p className="absolute inset-0 flex items-center justify-center text-muted-foreground" role="status">{t('icon-cloud.error', 'Technology icons could not be loaded.')}</p>}
    </div>
  );
}
