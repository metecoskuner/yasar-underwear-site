import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
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

  // Load topojson & countries on client only to avoid SSR/build-time issues
  const [countries, setCountries] = React.useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    // dynamic import inside useEffect => runs only on client
    (async () => {
      try {
        const topo = await import('world-atlas/countries-110m.json');
        const topojson = await import('topojson-client');
        const feat = (topojson as any).feature(topo as any, (topo as any).objects.countries);
        if (mounted) setCountries(feat as any);
      } catch (e) {
        // swallow; map will render empty until resolved
        // console.error('Failed to load topojson', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const { projection, pathGenerator } = React.useMemo(() => {
    if (!countries) {
      // fallback projection while countries load
      const p = geoEquirectangular().translate([width / 2, height / 2]).scale((width + height) / 8);
      return { projection: p, pathGenerator: geoPath().projection(p as any) };
    }
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
          {countries
            ? countries.features.map((f: any, i: number) => (
                <path
                  key={i}
                  d={pathGenerator(f) || undefined}
                  fill="#2c6f86" /* lighter slate so continents read clearly against black ocean */
                  stroke="#163f4a"
                  strokeWidth={0.6}
                  style={{ cursor: 'default' }}
                />
              ))
            : null}
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

            const tipOffset = isCenter ? 11 : 12;

            return (
              <g
                key={loc.id}
                transform={`translate(${x},${y})`}
                className="pointer-events-auto"
                role="button"
                tabIndex={0}
                aria-label={`Konum: ${loc.name}`}
                onFocus={handlePointerEnter}
                onBlur={handlePointerLeave}
                onKeyDown={handleKey}
              >
                <g aria-hidden className="pin-icon" transform={`translate(0,${-tipOffset})`}>
                  {isCenter ? (
                    <>
                      <path
                        d="M0 -7 C3 -7 6 -4 6 -1 C6 3 0 10 0 12 C0 10 -6 3 -6 -1 C-6 -4 -3 -7 0 -7 Z"
                        fill="#00e6c3"
                        stroke="#0f172a"
                        strokeWidth={0.9}
                        className="animate-pulse"
                      />
                      <circle r={1.6} fill="#0f172a" />
                    </>
                  ) : (
                    <>
                      <path
                        d="M0 -7 C3 -7 6 -4 6 -1 C6 3 0 10 0 12 C0 10 -6 3 -6 -1 C-6 -4 -3 -7 0 -7 Z"
                        fill="#ff3b30"
                        stroke="#ffffff"
                        strokeWidth={0.9}
                      />
                      <circle r={1.2} fill="#ffffff" />
                    </>
                  )}
                </g>

                {/* Always render labels for our LOCATIONS and give them an outline for contrast */}
                <text
                  x={(loc.offsetX ?? 10)}
                  y={(loc.offsetY ?? -8)}
                  // reduce labels a bit more per user request
                  fontSize={isCenter ? 11 : 10}
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth={isCenter ? 0.6 : 0.5}
                  style={{ paintOrder: 'stroke', pointerEvents: 'none' }}
                  fontWeight={600}
                >
                  {loc.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}