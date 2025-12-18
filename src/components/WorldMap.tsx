import React, { useEffect, useRef, useState, useMemo } from 'react';
import LOCATIONS from '../data/locations';
import * as d3Geo from 'd3-geo';
import * as topojsonClient from 'topojson-client';
import world110 from 'world-atlas/countries-110m.json';

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 857;

const Pin: React.FC<{ color?: string; size?: number }> = ({ color = '#ef4444', size = 28 }) => (
  <g transform={`translate(${-size / 2}, ${-size}) scale(${size / 24})`}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} />
    <circle cx="12" cy="9" r="3" fill="white" />
  </g>
);

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 800, h: 400 });
  const [isMobileView, setIsMobileView] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const ratio = MAP_HEIGHT / MAP_WIDTH;

  const worldFeatures = useMemo(() => {
    try {
      // @ts-ignore
      const geo = topojsonClient.feature(world110 as any, (world110 as any).objects.countries) as any;
      return geo.features;
    } catch {
      return [] as any[];
    }
  }, []);

 const { projection, pathGenerator } = useMemo(() => {
  const proj = d3Geo.geoEquirectangular();
  const path = d3Geo.geoPath().projection(proj as any);

  if (worldFeatures.length > 0) {
    // Ortalama LOCATIONS ile merkez
    if (LOCATIONS.length > 0) {
      const avgLon = LOCATIONS.reduce((sum, l) => sum + l.lon, 0) / LOCATIONS.length;
      const avgLat = LOCATIONS.reduce((sum, l) => sum + l.lat, 0) / LOCATIONS.length;
      try { (proj as any).center([avgLon, avgLat]); } catch {}
    }

    // Container boyutlarına göre fitSize (zoom)
    const containerW = size.w;
    const containerH = size.h;

    // İstenen doluluk oranı (container’ın %95’i dolacak)
    const fillRatio = isMobileView ? 0.95 : 0.98;

    // Sanal fit boyutu = normal map * fillRatio
    const fitW = MAP_WIDTH * fillRatio;
    const fitH = MAP_HEIGHT * fillRatio;

    // Projection zoom
    try {
      // @ts-ignore
      proj.fitSize([fitW, fitH], { type: 'FeatureCollection', features: worldFeatures });
    } catch {}
  } else {
    proj.translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]).scale(MAP_WIDTH / (2 * Math.PI));
  }

  return { projection: proj, pathGenerator: path };
}, [worldFeatures, isMobileView, size]);

  // ResizeObserver + matchMedia
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.getBoundingClientRect().width || MAP_WIDTH;
      const hRaw = w * ratio;
      let h = Math.min(hRaw, window.innerHeight * 0.95);
      h = Math.max(h, 240);
      setSize({ w, h });
      setIsMobileView(window.innerWidth < 640);
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);

    const mql = window.matchMedia('(max-width: 639px)');
    const onMql = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches);
      updateSize();
    };
    mql.addEventListener('change', onMql);

    window.addEventListener('orientationchange', () => setTimeout(updateSize, 50));

    updateSize();

    return () => {
      ro.disconnect();
      mql.removeEventListener('change', onMql);
    };
  }, [ratio]);

  // Header overlap detection
  useEffect(() => {
    const mapEl = containerRef.current;
    const headerEl = document.querySelector('header');
    if (!mapEl || !headerEl) return;

    let ticking = false;

    const check = () => {
      const m = mapEl.getBoundingClientRect();
      const h = headerEl.getBoundingClientRect();
      const intersects = !(h.right < m.left || h.left > m.right || h.bottom < m.top || h.top > m.bottom);
      document.body.classList.toggle('map-hovered', intersects);
      ticking = false;
    };

    const rafCheck = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };

    window.addEventListener('scroll', rafCheck, { passive: true });
    window.addEventListener('resize', rafCheck);

    const roHeader = new ResizeObserver(rafCheck);
    const roMap = new ResizeObserver(rafCheck);
    roHeader.observe(headerEl);
    roMap.observe(mapEl);

    rafCheck();

    return () => {
      window.removeEventListener('scroll', rafCheck);
      window.removeEventListener('resize', rafCheck);
      roHeader.disconnect();
      roMap.disconnect();
      document.body.classList.remove('map-hovered');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl shadow-xl bg-gray-50"
      style={{ width: '100%' }}
    >
      <div style={{ position: 'relative', width: '100%', height: `${size.h}px` }}>
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio={size.w < 420 ? 'xMidYMid slice' : 'xMidYMid meet'}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0b1220" />
          <g>
            {worldFeatures.map((f: any, i: number) => {
              const fid = f.id || `feat-${i}`;
              const isHovered = hoveredCountry === String(fid);
              return (
                <path
                  key={fid}
                  d={pathGenerator(f) as string}
                  fill={isHovered ? '#cde7ef' : '#e6e8ea'}
                  stroke={isHovered ? '#0b1220' : '#111827'}
                  strokeWidth={(isHovered ? 0.9 : 0.32) * Math.max(0.6, Math.min(1, size.w / MAP_WIDTH))}
                  strokeOpacity={isHovered ? 0.95 : 0.6}
                  style={{ transition: 'fill 160ms ease, stroke 160ms ease' }}
                  onMouseEnter={() => setHoveredCountry(String(fid))}
                  onMouseLeave={() => setHoveredCountry((cur) => (cur === String(fid) ? null : cur))}
                />
              );
            })}

            {LOCATIONS.map((loc) => {
              const [x, y] = projection([loc.lon, loc.lat]) as [number, number];
              const xAdj = x + (loc.offsetX ?? 0);
              const yAdj = y + (loc.offsetY ?? 0);
              const isHovered = hovered === loc.id;
              const visualScale = Math.max(0.35, Math.min(1, size.w / MAP_WIDTH));
              const baseR = loc.isCenter ? (isHovered ? 30 : 22) : (isHovered ? 24 : 16);
              const r = baseR * visualScale;
              const pinSize = loc.isCenter ? 34 * visualScale : 24 * visualScale;

              return (
                <g
                  key={loc.id}
                  transform={`translate(${xAdj}, ${yAdj})`}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setTooltip({ x: xAdj, y: yAdj, text: loc.name });
                    setHovered(loc.id);
                  }}
                  onMouseLeave={() => {
                    setTooltip(null);
                    setHovered(null);
                  }}
                  onPointerDown={() => {
                    if (hovered === loc.id) {
                      setTooltip(null);
                      setHovered(null);
                    } else {
                      setTooltip({ x: xAdj, y: yAdj, text: loc.name });
                      setHovered(loc.id);
                    }
                  }}
                >
                  <circle
                    r={r}
                    fill="#ef4444"
                    opacity={isHovered ? 0.18 : 0.08}
                    style={{ transition: 'r 120ms ease, opacity 120ms ease', pointerEvents: 'none' }}
                  />
                  <Pin color="#ef4444" size={pinSize} />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {tooltip && (() => {
        const maxW = 180;
        const leftRaw = (tooltip.x / MAP_WIDTH) * size.w;
        const left = Math.max(8, Math.min(leftRaw, size.w - 8 - maxW));
        const topRaw = (tooltip.y / MAP_HEIGHT) * size.h - 48;
        const top = Math.max(8, Math.min(topRaw, size.h - 40));
        return (
          <div
            className="absolute z-30 rounded p-2 text-sm shadow"
            style={{
              left,
              top,
              width: maxW,
              backgroundColor: 'rgba(0,0,0,0.75)',
              color: '#fff',
            }}
          >
            <strong>{tooltip.text}</strong>
          </div>
        );
      })()}
      {/* Country ticker: flags + names scrolling right-to-left */}
      <div className="w-full overflow-hidden bg-white border-t">
        <div className="relative">
          <div className="ticker py-2 sm:py-3">
            <div className="ticker-track">
              {LOCATIONS.concat(LOCATIONS).map((loc, i) => {
                // Turkish names for the ticker. Fallback to loc.name if not present.
                const TURKISH_NAMES: Record<string, string> = {
                  uk: 'Birleşik Krallık',
                  de: 'Almanya',
                  tr: 'Türkiye',
                  ro: 'Romanya',
                  kw: 'Kuveyt',
                  ly: 'Libya',
                  nl: 'Hollanda',
                  fr: 'Fransa',
                  us: 'Amerika Birleşik Devletleri',
                };

                // Some repos use 'uk' but flag emoji expects ISO alpha-2 (GB for United Kingdom)
                const isoCode = (loc.id === 'uk' ? 'GB' : (loc.id || '')).toUpperCase();
                const flag = (() => {
                  if (!isoCode || isoCode.length !== 2) return '🏳️';
                  const A = 0x1f1e6;
                  const first = A + (isoCode.charCodeAt(0) - 65);
                  const second = A + (isoCode.charCodeAt(1) - 65);
                  return String.fromCodePoint(first, second);
                })();

                const label = TURKISH_NAMES[loc.id as string] ?? loc.name;

                return (
                  <div
                    key={`ticker-${loc.id}-${i}`}
                    className="ticker-item inline-flex items-center gap-3 px-6 text-sm text-gray-700"
                    aria-hidden={i >= LOCATIONS.length ? 'true' : 'false'}
                  >
                    <span className="text-xl" aria-hidden>
                      {flag}
                    </span>
                    <span className="whitespace-nowrap font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style jsx>{`
          .ticker { overflow: hidden; }
          .ticker-track { display: inline-flex; align-items: center; gap: 0; white-space: nowrap; animation: scrollLeft 28s linear infinite; }
          .ticker-item { flex: 0 0 auto; }
          .ticker-track:hover { animation-play-state: paused; }

          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            .ticker-track { animation: none; }
          }
        `}</style>
      </div>
    </div>
  );
}