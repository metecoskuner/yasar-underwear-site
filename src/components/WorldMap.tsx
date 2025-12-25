import React, { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import LOCATIONS from '../data/locations';

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 720;

export default function WorldMap(): JSX.Element {
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

  const [countries, setCountries] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const topo = await import('world-atlas/countries-110m.json');
        const topojson = await import('topojson-client');
        const feat = (topojson as any).feature(topo as any, (topo as any).objects.countries);
        if (mounted) setCountries(feat as any);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Mobile detection: apply fixed mobile-only zoom (1.76) without UI.
  const isMobile = width < 640;
  const effectiveZoom = isMobile ? 1.76 : 1;

  const { projection, pathGenerator } = React.useMemo(() => {
    if (!countries) {
      const p = geoEquirectangular().translate([width / 2, height / 2]).scale((width + height) / 8);
      if (width < 640 && effectiveZoom && effectiveZoom !== 1) {
        p.scale((p.scale() ?? 1) * effectiveZoom);
        // center projection on pin cluster: compute centroid of LOCATIONS and move it near top-center
        try {
          const n = LOCATIONS.length;
          const avgLon = LOCATIONS.reduce((s, l) => s + l.lon, 0) / n;
          const avgLat = LOCATIONS.reduce((s, l) => s + l.lat, 0) / n;
          const [cx, cy] = (p as any)([avgLon, avgLat]) as [number, number];
          if (Number.isFinite(cx) && Number.isFinite(cy)) {
            const desiredX = width / 2;
            const desiredY = Math.round(height * 0.38); // pin cluster slightly above center
            const currTrans = (p as any).translate ? (p as any).translate() : [width / 2, height / 2];
            const newTx = Math.round(currTrans[0] + (desiredX - cx));
            const newTy = Math.round(currTrans[1] + (desiredY - cy));
            p.translate([newTx, newTy]);
          }
        } catch (e) {
          // fallback: position to 35% height
          p.translate([width / 2, Math.round(height * 0.35)]);
        }
      }
      return { projection: p, pathGenerator: geoPath().projection(p as any) };
    }
    const p = geoEquirectangular().fitSize([width, height], countries as any);
    if (width < 640 && effectiveZoom && effectiveZoom !== 1) {
      p.scale((p.scale() ?? 1) * effectiveZoom);
      try {
        const n = LOCATIONS.length;
        const avgLon = LOCATIONS.reduce((s, l) => s + l.lon, 0) / n;
        const avgLat = LOCATIONS.reduce((s, l) => s + l.lat, 0) / n;
        const [cx, cy] = (p as any)([avgLon, avgLat]) as [number, number];
        if (Number.isFinite(cx) && Number.isFinite(cy)) {
          const desiredX = width / 2;
          const desiredY = Math.round(height * 0.38);
          const currTrans = (p as any).translate ? (p as any).translate() : [width / 2, height / 2];
          const newTx = Math.round(currTrans[0] + (desiredX - cx));
          const newTy = Math.round(currTrans[1] + (desiredY - cy));
          p.translate([newTx, newTy]);
        }
      } catch (e) {
        p.translate([width / 2, Math.round(height * 0.35)]);
      }
    }
    return { projection: p, pathGenerator: geoPath().projection(p as any) };
  }, [width, height, countries, effectiveZoom]);

  const [tooltip, setTooltip] = useState<{ name: string; left: number; top: number } | null>(null);
  // Mobile labels visible only when zoom>1; pinScale reduced slightly when labels are visible.
  const mobileLabelsVisible = isMobile && effectiveZoom > 1;
  const pinScale = mobileLabelsVisible ? 0.7 : 1;

  return (
  <div ref={containerRef} className="w-full shadow overflow-hidden relative z-0">
      {tooltip ? (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltip.left, top: tooltip.top, transform: 'translate(-50%, -120%)' }}
        >
          <div className="bg-white text-black text-sm px-2 py-1 rounded shadow">{tooltip.name}</div>
        </div>
      ) : null}

  {/* Mobile zoom applied automatically (1.76) without UI. */}

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block mx-auto" role="img" aria-label="Dünya haritası">
        <rect width={width} height={height} fill="#000" />

        <g className="countries">
          {countries
            ? countries.features.map((f: any, i: number) => (
                <path
                  key={i}
                  d={pathGenerator(f) || undefined}
                  fill="#2c6f86"
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
                <g aria-hidden className="pin-icon" transform={`translate(0,${-tipOffset}) scale(${pinScale})`}>
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

                {( !isMobile || mobileLabelsVisible ) ? (
                  <text
                    x={loc.offsetX ?? 10}
                    y={loc.offsetY ?? -8}
                    fontSize={mobileLabelsVisible ? (isCenter ? 10 : 8) : (isCenter ? 11 : 10)}
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth={mobileLabelsVisible ? 0.4 : (isCenter ? 0.6 : 0.5)}
                    style={{ paintOrder: 'stroke', pointerEvents: 'none' }}
                    fontWeight={600}
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