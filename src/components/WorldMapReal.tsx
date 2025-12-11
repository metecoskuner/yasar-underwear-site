import React, { useEffect, useState, useRef } from 'react';

export default function WorldMapReal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth || 1120);
    try {
      const ro = new ResizeObserver((entries) => {
        if (entries.length > 0) setContainerWidth(entries[0].contentRect.width);
      });
      ro.observe(el);
      return () => ro.disconnect();
    } catch {
      return;
    }
  }, []);

  const targetWidth = containerWidth ?? 1120;
  const designOrigWidth = 1200;
  const designOrigHeight = 680;
  const mapWidth = targetWidth;
  const mapHeight = Math.round((mapWidth * designOrigHeight) / designOrigWidth);

  // sıralı gösterilecek ülkeler (eski SAMPLE sırasına yakın)
  const countries = [
    { id: 'p1', name: 'Fransa', iso2: 'fr' },
    { id: 'p2', name: 'Türkiye', iso2: 'tr' },
    { id: 'p4', name: 'Kuveyt', iso2: 'kw' },
    { id: 'p3', name: 'Libya', iso2: 'ly' },
    { id: 'p5', name: 'İngiltere', iso2: 'gb' },
    { id: 'p7', name: 'Almanya', iso2: 'de' },
    { id: 'p8', name: 'ABD', iso2: 'us' },
    { id: 'p9', name: 'Ürdün', iso2: 'jo' },
    { id: 'p10', name: 'Hollanda', iso2: 'nl' },
    { id: 'p11', name: 'Romanya', iso2: 'ro' },
  ];
  const flagsRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // otomatik soldan sağa kayan kaydırma (sonsuz loop)
  useEffect(() => {
    const el = flagsRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const speed = 0.6; // piksel/frame civarı; gerektiğinde artır

    // ensure we have duplicated content for smooth loop
    // we'll scroll and when we've passed half (one set), reset to 0
    const step = () => {
      if (!el) return;
      if (!paused) {
        el.scrollLeft = el.scrollLeft + speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [paused]);

  return (
    <div ref={containerRef} className="w-full">
      <h4 className="text-lg font-semibold mb-4">✔ Kalitemiz Dünya Haritasında</h4>

      <div className="bg-white rounded-lg shadow-sm px-6 py-6 sm:py-8">
        {/* Harita resmi - yüksekliğini biraz küçülttük */}
        <div style={{ width: '100%', height: 'auto' }}>
          <img
            src="/photos/world_map.png"
            alt="World map"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, maxHeight: 360 }}
            width={mapWidth}
            height={mapHeight}
          />
        </div>

        {/* Alt satır: işaretlenen ülkelerin bayrakları */}
        <div className="mt-4">
          {/* inline style + class to hide native scrollbar while keeping scrollLeft manipulations */}
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
          <div
            ref={flagsRef}
            className="flex gap-3 items-center overflow-x-hidden py-2 no-scrollbar" 
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-hidden={false}
            style={{ scrollBehavior: 'auto' }}
          >
              {[...countries, ...countries].map((c, idx) => {
              // flagcdn kullanıyoruz; fallback olarak emoji gösterilebilir
              // use SVG versions for consistent crisp rendering and visual sizing
              const flagUrlSvg = `https://flagcdn.com/${c.iso2.toLowerCase()}.svg`;
              const flagUrl80 = `https://flagcdn.com/w80/${c.iso2.toLowerCase()}.png`;
              const flagUrl160 = `https://flagcdn.com/w160/${c.iso2.toLowerCase()}.png`;
              // key must be unique; use idx
              return (
                <div
                  key={`${c.id}-${idx}`}
                  className="flex flex-col items-center justify-center text-xs"
                  style={{ minWidth: 96, maxWidth: 96 }}
                >
                  {/* fixed-size flag box so all flags align */}
                  <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {/* container en/yuvarlak köşe + overflow hidden, içinde bir <img> ile object-fit:cover kullanacağız */}
                    <div style={{ width: 72, height: 48, borderRadius: 6, overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={`https://flagcdn.com/w80/${c.iso2.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${c.iso2.toLowerCase()}.png 1x, https://flagcdn.com/w160/${c.iso2.toLowerCase()}.png 2x`}
                        alt={`${c.name} flag`}
                        width={72}
                        height={48}
                        style={{ width: 72, height: 48, objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm font-semibold text-gray-700 tracking-wide uppercase" style={{ letterSpacing: '0.03em', lineHeight: 1, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}