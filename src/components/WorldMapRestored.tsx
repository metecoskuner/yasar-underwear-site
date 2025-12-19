import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';
import LOCATIONS from '../data/locations';

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
  const projection = geoEquirectangular().fitSize([width, height], feature(countriesTopo as any, (countriesTopo as any).objects.countries));
  const pathGenerator = geoPath().projection(projection as any);

  // countries feature
  const countries = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as any;

  return (
    <div ref={containerRef} className="w-full">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block mx-auto">
        <g className="countries">
          {countries.features.map((f: any, i: number) => (
            <path
              key={i}
              d={pathGenerator(f) || undefined}
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth={0.5}
            />
          ))}
        </g>

        <g className="pins">
          {LOCATIONS.map((loc) => {
            const [x, y] = projection([loc.lon, loc.lat]) as [number, number];
            return (
              <g key={loc.id} transform={`translate(${x},${y})`} className="pointer-events-auto">
                <circle r={6} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
                {loc.offsetX !== undefined || loc.offsetY !== undefined ? (
                  <text x={(loc.offsetX ?? 8)} y={(loc.offsetY ?? -8)} fontSize={12} fill="#0f172a">
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
