import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';
import LOCATIONS from '../data/locations';

// Match the original feel: base dimensions and equirectangular projection
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 600;

export default function WorldMapRestored() {
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

  // build projection and path
  const countries = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as any;
  const projection = geoEquirectangular().fitSize([width, height], countries as any);
  const pathGenerator = geoPath().projection(projection as any);

  return (
    <div ref={containerRef} className="w-full">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block mx-auto">
        <rect width={width} height={height} fill="#f8fafc" />

        <g className="countries">
          {countries.features.map((f: any, i: number) => (
            <path
              key={i}
              d={pathGenerator(f) || undefined}
              fill="#ffffff"
              stroke="#e6eef8"
              strokeWidth={0.6}
              style={{ transition: 'fill 120ms ease' }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGPathElement).style.fill = '#eef6ff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGPathElement).style.fill = '#ffffff';
              }}
            />
          ))}
        </g>

        <g className="pins">
          {LOCATIONS.map((loc) => {
            const [x, y] = projection([loc.lon, loc.lat]) as [number, number];
            const isCenter = !!loc.isCenter;
            return (
              <g key={loc.id} transform={`translate(${x},${y})`} className="pointer-events-auto">
                <title>{loc.name}</title>
                <circle r={isCenter ? 8 : 5} fill={isCenter ? '#0ea5a0' : '#ef4444'} stroke="#fff" strokeWidth={1.5} />
                {/* show label for those with explicit offsets or for center */}
                {(isCenter || loc.offsetX !== undefined || loc.offsetY !== undefined) ? (
                  <text
                    x={(loc.offsetX ?? 10)}
                    y={(loc.offsetY ?? -8)}
                    fontSize={12}
                    fill="#0f172a"
                    fontWeight={isCenter ? 700 : 500}
                  >
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
