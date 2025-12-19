import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';
import LOCATIONS from '../data/locations';

const BASE_WIDTH = 1200;
// Increase base height so the map appears larger when stretched full-width
const BASE_HEIGHT = 720;

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(BASE_WIDTH);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(Math.max(320, Math.round(el.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = Math.round((BASE_HEIGHT * width) / BASE_WIDTH);

  // Memoize countries (static) and projection/path (dependent on width)
  const countries = React.useMemo(
    () => feature(countriesTopo as any, (countriesTopo as any).objects.countries) as any,
    []
  );

  const { projection, pathGenerator } = React.useMemo(() => {
    const p = geoEquirectangular().fitSize([width, height], countries as any);
    return { projection: p, pathGenerator: geoPath().projection(p as any) };
  }, [width, height, countries]);

  // Tooltip state: {name,left,top} (screen coords)
  const [tooltip, setTooltip] = useState<{ name: string; left: number; top: number } | null>(null);

  return (
    <div ref={containerRef} className="w-full rounded-xl shadow overflow-hidden relative">
      {/* Tooltip overlay positioned in screen coords */}
      {tooltip ? (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltip.left, top: tooltip.top, transform: 'translate(-50%, -120%)' }}
        >
          <div className="bg-white text-black text-sm px-2 py-1 rounded shadow">
            {tooltip.name}
          </div>
        </div>
      ) : null}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block mx-auto"
        role="img"
        aria-label="Dünya haritası"
      >
  <rect width={width} height={height} fill="#000" />

        <g className="countries">
          {countries.features.map((f: any, i: number) => (
            <path
              key={i}
              d={pathGenerator(f) || undefined}
              fill="#2c6f86" /* lighter slate so continents read clearly against black ocean */
              stroke="#163f4a"
              strokeWidth={0.6}
              onMouseEnter={(e) => ((e.currentTarget as SVGPathElement).style.fill = '#3a9ab3')}
              onMouseLeave={(e) => ((e.currentTarget as SVGPathElement).style.fill = '#2c6f86')}
            />
          ))}
        </g>

        <g className="pins">
          {LOCATIONS.map((loc) => {
            const [x, y] = projection([loc.lon, loc.lat]) as [number, number];
            const isCenter = !!loc.isCenter;

            const handlePointerEnter = () => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) return;
              setTooltip({ name: loc.name, left: rect.left + x, top: rect.top + y });
            };

            const handlePointerLeave = () => setTooltip(null);

            const handleKey = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({ name: loc.name, left: rect.left + x, top: rect.top + y });
              }
            };

            return (
              <g
                key={loc.id}
                transform={`translate(${x},${y})`}
                className="pointer-events-auto"
                role="button"
                tabIndex={0}
                aria-label={`Konum: ${loc.name}`}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onFocus={handlePointerEnter}
                onBlur={handlePointerLeave}
                onKeyDown={handleKey}
              >
                <title>{loc.name}</title>
                <circle
                  r={isCenter ? 8 : 5}
                  fill={isCenter ? '#00e6c3' : '#ff6b6b'}
                  stroke={isCenter ? '#0f172a' : '#ffffff'}
                  strokeWidth={1.5}
                  className={isCenter ? 'animate-pulse' : undefined}
                  style={{ filter: isCenter ? 'drop-shadow(0 2px 6px rgba(0,230,195,0.35))' : undefined }}
                />
                {(isCenter || loc.offsetX !== undefined || loc.offsetY !== undefined) ? (
                  <text x={(loc.offsetX ?? 10)} y={(loc.offsetY ?? -8)} fontSize={12} fill="#e6eef8" fontWeight={isCenter ? 700 : 500}>
                    {loc.name}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}