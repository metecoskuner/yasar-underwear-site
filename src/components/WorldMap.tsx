import React, { useEffect, useMemo, useRef, useState } from 'react';
import LOCATIONS from '@/data/locations';

// Equirectangular projection helper (no extra packages)
function projectEquirectangular(lon: number, lat: number, width: number, height: number) {
  // lon: -180..180 => x: 0..width
  const x = ((lon + 180) / 360) * width;
  // lat: -90..90 => y: 0..height (flip because SVG y increases down)
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState({ w: 800, h: 420 });
  const [ratio, setRatio] = useState(0.5);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    // if image has intrinsic ratio, use it
    if (imgRef.current && imgRef.current.naturalWidth && imgRef.current.naturalHeight) {
      setRatio(imgRef.current.naturalHeight / imgRef.current.naturalWidth);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(280, Math.round(rect.width));
      const h = Math.max(180, Math.round(w * ratio));
      setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio]);

  const points = useMemo(() => {
    return LOCATIONS.map((l) => {
      const [x, y] = projectEquirectangular(l.lon, l.lat, size.w, size.h);
      return { ...l, x, y };
    });
  }, [size]);

  return (
    <div ref={containerRef} className="w-full relative rounded-xl overflow-hidden shadow-xl bg-gray-50">
      {/* background map image (placed in public/photos/world.svg) */}
      <img
        ref={imgRef}
        src="/photos/world.svg"
        alt="World map"
        className="w-full h-auto block"
        style={{ display: 'block', pointerEvents: 'none' }}
      />

      {/* overlay SVG sized to the displayed image area */}
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="absolute left-0 top-0"
      >
        <defs>
          <filter id="pulseBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feBlend in="SourceGraphic" in2="b" />
          </filter>
        </defs>

        {points.map((p) => (
          <g
            key={p.id}
            transform={`translate(${p.x}, ${p.y})`}
            className="cursor-pointer"
            onMouseEnter={(e) => {
              setHovered(p.id);
              setTooltip({ x: p.x, y: p.y, text: p.name + (p.desc ? ` — ${p.desc}` : '') });
            }}
            onMouseLeave={() => {
              setHovered(null);
              setTooltip(null);
            }}
            onClick={() => {
              // default action: nothing heavy; can be extended
              // eslint-disable-next-line no-alert
              alert(`${p.name}\n${p.desc ?? ''}`);
            }}
            role="button"
            tabIndex={0}
            aria-label={p.name}
          >
            {/* pulsing ring */}
            <circle r={16} fill="#06b6d4" opacity={0.12} />
            <circle r={8} fill="#06b6d4" stroke="#fff" strokeWidth={1.5} />
          </g>
        ))}
      </svg>

      {/* tooltip rendered in DOM so we can style and clamp to viewport */}
      {tooltip ? (
        <div
          aria-hidden={hovered === null}
          className="absolute z-30 pointer-events-none"
          style={{
            left: Math.min(Math.max(8, tooltip.x), size.w - 220),
            top: Math.max(8, tooltip.y - 48),
            width: 200,
          }}
        >
          <div className="bg-white shadow rounded p-2 text-sm">
            <strong className="block text-sm">{tooltip.text.split(' — ')[0]}</strong>
            <div className="text-gray-600 text-xs mt-1">{tooltip.text.split(' — ')[1]}</div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        /* small pulse animation fallback (if wanted to enhance) */
        @keyframes map-pulse {
          0% { transform: scale(0.9); opacity: 0.9 }
          70% { transform: scale(1.6); opacity: 0 }
          100% { opacity: 0 }
        }
      `}</style>
    </div>
  );
}
