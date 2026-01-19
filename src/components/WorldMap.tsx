import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { geoEquirectangular, geoPath } from 'd3-geo';
import LOCATIONS from '../data/locations';

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 600;

// Note: previously we kept a large raw `MOBILE_SVG` string and injected it on
// small screens. That approach increased bundle size and produced different
// projection/scale behavior between mobile and desktop. The component now
// always renders the D3-generated SVG (viewBox 0 0 1200 600) so projection
// math, strokes and text scale consistently across devices. The large static
// mobile SVG has been removed.

export default function WorldMap(): JSX.Element {
  const { t } = useLanguage();
  const tr = useCallback((key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  }, [t]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  // track container width for responsive sizing; projection will be computed in
  // a fixed SVG user coordinate system (BASE_WIDTH x BASE_HEIGHT) so the map
  // scales cleanly while projection math stays stable.
  // start at 0 so the first render on narrow viewports falls into the mobile branch
  // (previously defaulting to BASE_WIDTH could briefly force the desktop rendering
  // and hide the mobile SVG until ResizeObserver ran). ResizeObserver will update
  // the real width immediately after mount.
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // containerWidth used for mobile detection; we render SVG responsively via viewBox

  const [countries, setCountries] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const topo = await import('world-atlas/countries-110m.json');
        const topojson = await import('topojson-client');
        const feat = (topojson as any).feature(topo as any, (topo as any).objects.countries);
        if (mounted) setCountries(feat as any);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Mobile detection: used only for label visibility / pin scaling
  const isMobile = containerWidth < 640;
  // Tablet detection: between mobile and larger desktop widths. This lets us
  // apply tablet-specific offsets when needed.
  const isTablet = containerWidth >= 640 && containerWidth < 1024;

  // Edit mode flags + runtime editing offsets. Pins and labels can be edited
  // independently via the toolbar.
  // editPins is a read-only flag in the current UI (no setter usage). We
  // keep it as a single-value state entry to allow future expansion without
  // reintroducing unused-setter warnings.
  const editPins = useState(false)[0];
  const [editingOffsets, setEditingOffsets] = useState<{
    mobile: Record<string, { pin?: { x: number; y: number }; label?: { x: number; y: number } }>;
    tablet: Record<string, { pin?: { x: number; y: number }; label?: { x: number; y: number } }>;
    desktop: Record<string, { pin?: { x: number; y: number }; label?: { x: number; y: number } }>;
  }>({ mobile: {}, tablet: {}, desktop: {} });
  const dragState = useRef<null | { id: string; kind: 'pin' | 'label'; startX: number; startY: number; origX: number; origY: number }>(null);
  const [selected, setSelected] = useState<null | { id: string; kind: 'pin' | 'label' }>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const getSVGPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    try {
      const inv = svg.getScreenCTM()?.inverse();
      return pt.matrixTransform(inv as DOMMatrix);
    } catch {
      return null;
    }
  };

  // resetEdits removed — editingOffsets is preserved in-memory. If a
  // restore/reset control is added later we can reintroduce this helper.

  // Keyboard nudging: arrow keys move the selected pin/label by 1px (Shift = 10px)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selected) return;
  // only act when editing the corresponding kind (labels have been
  // removed from the UI so only pins are relevant)
  if (selected.kind === 'pin' && !editPins) return;

      const step = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case 'ArrowLeft':
          dx = -step; break;
        case 'ArrowRight':
          dx = step; break;
        case 'ArrowUp':
          dy = -step; break;
        case 'ArrowDown':
          dy = step; break;
        default:
          return;
      }
      e.preventDefault();

      const loc = LOCATIONS.find((l) => l.id === selected.id);
      if (!loc) return;

      setEditingOffsets((prev) => {
        const copy: typeof prev = { mobile: { ...prev.mobile }, tablet: { ...prev.tablet }, desktop: { ...prev.desktop } };
        const bucket = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
        const existing = copy[bucket][selected.id] ?? {};

        // helper to resolve base values from runtime or defaults
        const resolveBase = (kind: 'pin' | 'label') => {
          if (kind === 'pin') {
            const runtime = existing.pin;
            if (runtime) return { x: runtime.x, y: runtime.y };
            const baseX = bucket === 'mobile' ? (loc.mobileOffsetX ?? 0) : bucket === 'tablet' ? (loc.tabletOffsetX ?? 0) : ((loc as any).desktopOffsetX ?? 0);
            const baseY = bucket === 'mobile' ? (loc.mobileOffsetY ?? 0) : bucket === 'tablet' ? (loc.tabletOffsetY ?? 0) : ((loc as any).desktopOffsetY ?? 0);
            return { x: baseX, y: baseY };
          }
          // label
          const runtimeL = existing.label;
          if (runtimeL) return { x: runtimeL.x, y: runtimeL.y };
          const baseLX = bucket === 'mobile' ? ((loc as any).mobileLabelOffsetX ?? loc.mobileOffsetX ?? (loc.offsetX ?? 0)) : bucket === 'tablet' ? ((loc as any).tabletLabelOffsetX ?? loc.tabletOffsetX ?? (loc.offsetX ?? 0)) : ((loc as any).desktopLabelOffsetX ?? (loc as any).desktopOffsetX ?? (loc.offsetX ?? 0));
          const baseLY = bucket === 'mobile' ? ((loc as any).mobileLabelOffsetY ?? loc.mobileOffsetY ?? (loc.offsetY ?? 0)) : bucket === 'tablet' ? ((loc as any).tabletLabelOffsetY ?? loc.tabletOffsetY ?? (loc.offsetY ?? 0)) : ((loc as any).desktopLabelOffsetY ?? (loc as any).desktopOffsetY ?? (loc.offsetY ?? 0));
          return { x: baseLX, y: baseLY };
        };

        const base = resolveBase(selected.kind);
        const newX = Math.round(base.x + dx);
        const newY = Math.round(base.y + dy);

        if (selected.kind === 'pin') {
          (copy as any)[bucket][selected.id] = { ...(copy as any)[bucket][selected.id] ?? {}, pin: { x: newX, y: newY } };
        } else {
          (copy as any)[bucket][selected.id] = { ...(copy as any)[bucket][selected.id] ?? {}, label: { x: newX, y: newY } };
        }

        return copy;
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, editPins, isMobile, isTablet, setEditingOffsets]);

  // exportEditedJSON removed — kept out to avoid unused helper warnings.
  // If you need an export feature later we can re-add a trimmed, tested
  // implementation that respects server-side rendering constraints.

  // Use a single, stable projection across all breakpoints so lon/lat -> x/y
  // mapping is identical on mobile/tablet/desktop. This preserves the laptop/L
  // layout everywhere and prevents pins from being shifted by ad-hoc
  // mobile-only scale/translate tweaks.
  const { projection, pathGenerator } = React.useMemo(() => {
    if (!countries) {
      const p = geoEquirectangular().translate([BASE_WIDTH / 2, BASE_HEIGHT / 2]).scale((BASE_WIDTH + BASE_HEIGHT) / 8);
      return { projection: p, pathGenerator: geoPath().projection(p as any) };
    }
    const p = geoEquirectangular().fitSize([BASE_WIDTH, BASE_HEIGHT], countries as any);
    // center projection in SVG user space to match desktop/laptop centering
    try {
      p.translate([BASE_WIDTH / 2, BASE_HEIGHT / 2]);
    } catch {
      // ignore if translate isn't available
    }
    return { projection: p, pathGenerator: geoPath().projection(p as any) };
  }, [countries]);

  // Mobile labels visible on small screens; make pins larger on mobile so they're easier to see.
  const mobileLabelsVisible = isMobile;
  const pinScale = mobileLabelsVisible ? 0.85 : 1;

  // We always render the D3-generated SVG now; there is no separate mobile SVG.

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full shadow overflow-hidden relative z-0"
        style={{ aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}` }}
      >
      {/* Toolbar removed from top; rendered below the map so controls are easy to reach */}

      {/* Render the D3-generated SVG for all viewports so mobile matches the
          desktop rendering quality and responsive projection math. */}
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`} style={{ height: 'auto' }} className="worldmap-svg block w-full mx-auto" role="img" aria-label="Dünya haritası" preserveAspectRatio="xMidYMin meet">
        <rect width={BASE_WIDTH} height={BASE_HEIGHT} fill="#ffffff" />

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

        {/* Separate layer for pins: these are draggable when editPins === true */}
        <g className="pins">
          {LOCATIONS.map((loc) => {
            const [x, y] = projection([loc.lon, loc.lat]) as [number, number];
            const mobileYOffset = isMobile ? (loc.mobileOffsetY ?? 0) : 0;
            const tabletYOffset = isTablet ? (loc.tabletOffsetY ?? 0) : 0;
            const mobileXOffset = isMobile ? (loc.mobileOffsetX ?? 0) : 0;
            const tabletXOffset = isTablet ? (loc.tabletOffsetX ?? 0) : 0;

            const runtime = isMobile ? editingOffsets.mobile[loc.id] : isTablet ? editingOffsets.tablet[loc.id] : editingOffsets.desktop[loc.id];
            const runtimePin = runtime ? runtime.pin : undefined;
            const appliedYOffset = runtimePin ? runtimePin.y : isMobile ? mobileYOffset : isTablet ? tabletYOffset : 0;
            const appliedXOffset = runtimePin ? runtimePin.x : isMobile ? mobileXOffset : isTablet ? tabletXOffset : 0;
            const isCenter = !!loc.isCenter;
            const tipOffset = isCenter ? 11 : 12;

            const onPointerDown = (e: React.PointerEvent) => {
              if (!editPins) return;
              const p = getSVGPoint(e.clientX, e.clientY);
              if (!p) return;
              const orig = runtimePin ? { x: runtimePin.x, y: runtimePin.y } : { x: appliedXOffset, y: appliedYOffset };
              try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); } catch {}
              dragState.current = { id: loc.id, kind: 'pin', startX: p.x, startY: p.y, origX: orig.x, origY: orig.y };
              setSelected({ id: loc.id, kind: 'pin' });
              e.preventDefault();
            };

            const onPointerEnter = () => setHovered(loc.id);
            const onPointerLeave = () => setHovered((cur) => (cur === loc.id ? null : cur));

            const onPointerMove = (e: React.PointerEvent) => {
              if (!editPins || !dragState.current || dragState.current.id !== loc.id) return;
              const p = getSVGPoint(e.clientX, e.clientY);
              if (!p) return;
              const dx = p.x - dragState.current.startX;
              const dy = p.y - dragState.current.startY;
              const newX = dragState.current.origX + dx;
              const newY = dragState.current.origY + dy;
              setEditingOffsets((prev) => {
                const copy: typeof prev = { mobile: { ...prev.mobile }, tablet: { ...prev.tablet }, desktop: { ...prev.desktop } };
                if (isMobile) copy.mobile[loc.id] = { ...(copy.mobile[loc.id] ?? {}), pin: { x: newX, y: newY } };
                else if (isTablet) copy.tablet[loc.id] = { ...(copy.tablet[loc.id] ?? {}), pin: { x: newX, y: newY } };
                else copy.desktop[loc.id] = { ...(copy.desktop[loc.id] ?? {}), pin: { x: newX, y: newY } };
                return copy;
              });
              e.preventDefault();
            };

            const onPointerUp = (e: React.PointerEvent) => {
              try { (e.currentTarget as Element).releasePointerCapture?.(e.pointerId); } catch {}
              dragState.current = null;
            };

            return (
              <g
                key={loc.id}
                transform={`translate(${x + appliedXOffset},${y + appliedYOffset})`}
                tabIndex={0}
                onFocus={() => setSelected({ id: loc.id, kind: 'pin' })}
                // Allow pointer events on pins so hover tooltip works even when
                // edit mode is off. Dragging still requires editPins to be true
                // (onPointerDown checks editPins).
                className="pointer-events-auto"
                aria-hidden
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
              >
                <g className="pin-icon" transform={`translate(0,${-tipOffset}) scale(${pinScale})`} aria-hidden>
                  {isCenter ? (
                    <>
                      <path d="M0 -7 C3 -7 6 -4 6 -1 C6 3 0 10 0 12 C0 10 -6 3 -6 -1 C-6 -4 -3 -7 0 -7 Z" fill="#00e6c3" stroke="#0f172a" strokeWidth={0.9} className="animate-pulse" />
                      <circle r={1.6} fill="#0f172a" />
                    </>
                  ) : (
                    <>
                      <path d="M0 -7 C3 -7 6 -4 6 -1 C6 3 0 10 0 12 C0 10 -6 3 -6 -1 C-6 -4 -3 -7 0 -7 Z" fill="#ff3b30" stroke="#ffffff" strokeWidth={0.9} />
                      <circle r={1.2} fill="#ffffff" />
                    </>
                  )}
                </g>
                {/* show name only on hover */}
                {hovered === loc.id ? (
                  <text
                    x={12}
                    y={-tipOffset - 2}
                    fontSize={11}
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth={0.8}
                    strokeLinejoin="round"
                    fontWeight={600}
                    style={{ pointerEvents: 'none', userSelect: 'none', paintOrder: 'stroke' }}
                  >
                    {tr(`locations.${loc.id}`, loc.name)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>

        {/* labels removed: country/location names are not rendered per request */}
      </svg>
      </div>
    </div>
  );
}