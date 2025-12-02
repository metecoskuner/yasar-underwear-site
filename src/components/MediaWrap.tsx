import React, { useEffect, useRef, useState } from "react";

type VideoItem = { src: string; poster?: string; focal?: string };

const VIDEOS: VideoItem[] = [
  { src: "/videos/DSCF7638.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 30%" },
  { src: "/videos/DSCF7639.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 35%" },
  { src: "/videos/DSCF7649.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 40%" },
  { src: "/videos/DSCF7648.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 30%" },
  { src: "/videos/DSCF7645.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 45%" },
  { src: "/videos/DSCF7651.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 50%" },
];

export default function MediaWrap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [items, setItems] = useState(VIDEOS);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // --- auto-slide ---
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 8000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  // --- scroll to active ---
  useEffect(() => {
    const cont = containerRef.current;
    const card = videoRefs.current[index]?.parentElement;
    if (!cont || !card) return;

    const left = card.offsetLeft + card.clientWidth / 2 - cont.clientWidth / 2;
    cont.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  // --- play only active video ---
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        if (!v.src) {
          v.src = v.dataset.src!;
          v.load();
        }
        v.muted = true;
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [index]);

  // --- lazy loading via observer ---
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const v = e.target as HTMLVideoElement;
            if (!v.src) {
              v.src = v.dataset.src!;
              v.load();
            }
          }
        });
      },
      { rootMargin: "300px" }
    );

    videoRefs.current.forEach((v) => v && obs.observe(v));

    return () => obs.disconnect();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-lg font-semibold mb-4">Gör, Hisset, Keşfet</h3>

      <div className="relative">
        {/* LEFT BUTTON */}
        <button
          aria-label="Önceki"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 rounded-full shadow-md cursor-pointer"
          onClick={() => {
            setPaused(true);
            setIndex((i) => Math.max(0, i - 1));
          }}
        >
          ‹
        </button>

        {/* RIGHT BUTTON */}
        <button
          aria-label="Sonraki"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 rounded-full shadow-md cursor-pointer"
          onClick={() => {
            setPaused(true);
            setIndex((i) => Math.min(items.length - 1, i + 1));
          }}
        >
          ›
        </button>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden overflow-y-hidden no-scrollbar snap-x snap-mandatory"
          style={{ touchAction: "pan-x" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.map((it, i) => {
            const active = i === index;

            return (
              <div
                key={i}
                className={`flex-shrink-0 w-[min(72vw,420px)] h-96 sm:h-[32rem] md:h-[36rem] rounded-xl overflow-hidden snap-start cursor-pointer transition-all duration-500 ${
                  active
                    ? "scale-105 opacity-100 z-10 shadow-2xl ring-4 ring-indigo-300"
                    : "scale-95 opacity-80 hover:scale-100 hover:opacity-100"
                }`}
                onClick={() => {
                  setPaused(true);
                  setIndex(i);
                }}
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[i] = el;
                  }}
                  data-src={it.src}
                  poster={it.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: it.focal }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}