import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';
import LOCATIONS from '../data/locations';

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 600;

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

  const countries = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as any;
  const projection = geoEquirectangular().fitSize([width, height], countries as any);
  const pathGenerator = geoPath().projection(projection as any);

  return (
    <div ref={containerRef} className="w-full rounded-xl shadow overflow-hidden">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block mx-auto">
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
            return (
              <g key={loc.id} transform={`translate(${x},${y})`} className="pointer-events-auto">
                <title>{loc.name}</title>
                <circle
                  r={isCenter ? 8 : 5}
                  fill={isCenter ? '#00e6c3' : '#ff6b6b'}
                  stroke={isCenter ? '#0f172a' : '#ffffff'}
                  strokeWidth={1.5}
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