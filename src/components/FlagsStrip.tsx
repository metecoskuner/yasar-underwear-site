import React, { useEffect, useRef } from 'react';
import LOCATIONS from '../data/locations';
import { useLanguage } from '@/contexts/LanguageContext';

function flagEmoji(code: string) {
  const map: Record<string, string> = { uk: 'GB' };
  const cc = (map[code] ?? code).toUpperCase();
  if (cc.length !== 2) return '';
  const first = 0x1f1e6 + (cc.charCodeAt(0) - 65);
  const second = 0x1f1e6 + (cc.charCodeAt(1) - 65);
  return String.fromCodePoint(first, second);
}

export default function FlagsStrip({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const locName = (id: string, fallback: string) => {
    try {
      const v = t(`locations.${id}`);
      return v === `locations.${id}` ? fallback : v;
    } catch {
      return fallback;
    }
  };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const speed = 40; // px/sec
    let rafId: number;
    let last = 0;
    let pos = 0;
    let baseWidth = 0;
    let dragging = false;
    let startX = 0;
    let startPos = 0;

    const measure = () => {
      baseWidth = inner.scrollWidth / 3; // 1 set
      pos = baseWidth; // start from middle copy
      inner.style.transform = `translateX(${-pos}px)`;
    };

    const loop = (t: number) => {
      if (!last) last = t;
      const dt = t - last;
      last = t;

      if (!dragging) {
        pos += (speed * dt) / 1000;
      }

      // infinite wrap
      if (baseWidth > 0) {
        pos = ((pos % baseWidth) + baseWidth) % baseWidth;
      }
      inner.style.transform = `translateX(${-pos}px)`;

      rafId = requestAnimationFrame(loop);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startPos = pos;
      try { container.setPointerCapture(e.pointerId); } catch {}
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      pos = startPos - (e.clientX - startX);
    };

    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { container.releasePointerCapture(e.pointerId); } catch {}
    };

    requestAnimationFrame(() => {
      measure();
      last = 0;
      rafId = requestAnimationFrame(loop);
    });

    container.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div className={`w-full mt-0 mb-0 ${className}`}>
      <div className="w-full h-full flex items-center">
        <div
          ref={containerRef}
          className="strip w-full"
          aria-hidden="false"
        >
          <div ref={innerRef} className="strip__inner inline-flex items-center gap-5">
            {LOCATIONS.map((loc) => (
              <div key={`a-${loc.id}`} className="flex flex-col items-center space-y-1 text-center text-sm sm:text-base whitespace-nowrap px-4 sm:px-6 md:px-8">
                <span aria-hidden className="text-2xl sm:text-3xl md:text-4xl leading-none">{flagEmoji(loc.id)}</span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold">{locName(loc.id, loc.name)}</span>
              </div>
            ))}
            {LOCATIONS.map((loc) => (
              <div key={`b-${loc.id}`} className="flex flex-col items-center space-y-1 text-center text-sm sm:text-base whitespace-nowrap px-4 sm:px-6 md:px-8">
                <span aria-hidden className="text-2xl sm:text-3xl md:text-4xl leading-none">{flagEmoji(loc.id)}</span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold">{locName(loc.id, loc.name)}</span>
              </div>
            ))}
            {LOCATIONS.map((loc) => (
              <div key={`c-${loc.id}`} className="flex flex-col items-center space-y-1 text-center text-sm sm:text-base whitespace-nowrap px-4 sm:px-6 md:px-8">
                <span aria-hidden className="text-2xl sm:text-3xl md:text-4xl leading-none">{flagEmoji(loc.id)}</span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold">{locName(loc.id, loc.name)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
  .strip { overflow: hidden; -webkit-overflow-scrolling: touch; white-space: nowrap; cursor: grab; touch-action: pan-y; }
  .strip:active { cursor: grabbing; }
  .strip::-webkit-scrollbar { display: none; }
  .strip__inner { gap: 1.25rem; }
  @media (prefers-reduced-motion: reduce) { /* if user prefers reduced motion, don't auto-scroll */ }
      `}</style>
    </div>
  );
}
