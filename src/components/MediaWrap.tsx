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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useRef<Set<number>>(new Set()); // hangi indeksler görünür
  const pointer = useRef({
    startX: 0,
    deltaX: 0,
    dragging: false,
    moved: false,
  });
  const autoplayDelay = 8000;

  // --- autoplay ---
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % VIDEOS.length);
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [paused]);

  // --- scroll to active (smooth center) ---
  useEffect(() => {
    const cont = containerRef.current;
    const card = videoRefs.current[index]?.parentElement as HTMLElement | undefined;
    if (!cont || !card) return;
    const left = card.offsetLeft + card.clientWidth / 2 - cont.clientWidth / 2;
    cont.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  // --- keyboard navigation when the carousel has focus ---
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const cont = containerRef.current;
      if (!cont) return;
      const activeEl = document.activeElement;
      if (!activeEl || !cont.contains(activeEl)) return; // only when focused inside carousel

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPaused(true);
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPaused(true);
        setIndex((i) => Math.min(VIDEOS.length - 1, i + 1));
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- ensure first video loads immediately on mount ---
  useEffect(() => {
    const v = videoRefs.current[0];
    if (v && !v.src && v.dataset.src) {
      v.src = v.dataset.src;
      v.removeAttribute("data-src");
      try {
        v.load();
      } catch {}
    }
  }, []);

  // --- IntersectionObserver: lazy-load & mark visible ---
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement;
          const i = Number(el.dataset.index);
          if (entry.isIntersecting) {
            // işaretle
            visible.current.add(i);
            // lazy-load (sadece bir kere)
            if (!el.src && el.dataset.src) {
              el.src = el.dataset.src;
              el.removeAttribute("data-src");
              try { el.load(); } catch {}
            }
          } else {
            visible.current.delete(i);
          }
        });
      },
      {
        root: containerRef.current ?? null,
        rootMargin: "300px",
        threshold: 0.5, // yarısından fazlası görünürse visible say
      }
    );

    videoRefs.current.forEach((v) => v && obs.observe(v));
    return () => obs.disconnect();
  }, []);

  // --- play active video (try to play regardless of intersection visibility) ---
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        // ensure the active video has a src (load if it was deferred)
        if (!v.src && v.dataset.src) {
          v.src = v.dataset.src;
          v.removeAttribute("data-src");
          try {
            v.load();
          } catch {}
        }
        v.muted = true;
        try {
          v.currentTime = 0;
        } catch {}
        v.play().catch(() => {});
      } else {
        try {
          v.pause();
        } catch {}
      }
    });
  }, [index]);

  // --- pointer / touch swipe handling (pointer events) ---
  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    function onPointerDown(e: PointerEvent) {
      pointer.current.dragging = true;
      pointer.current.moved = false;
      pointer.current.startX = e.clientX;
      pointer.current.deltaX = 0;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setPaused(true); // kullanıcı etkileşimi => autoplay dur
    }
    function onPointerMove(e: PointerEvent) {
      if (!pointer.current.dragging) return;
      pointer.current.deltaX = e.clientX - pointer.current.startX;
      if (Math.abs(pointer.current.deltaX) > 6) pointer.current.moved = true;
      // (isteğe bağlı) görsel feedback için translate eklenebilir
    }
    function onPointerUp() {
      if (!pointer.current.dragging) return;
      pointer.current.dragging = false;
      const dx = pointer.current.deltaX;
      const threshold = (cont!.clientWidth * 0.12); // %12 genişlik threshold
      if (dx > threshold) {
        // sağa kaydırdı -> önceki
        setIndex((i) => Math.max(0, i - 1));
      } else if (dx < -threshold) {
        // sola kaydırdı -> sonraki
        setIndex((i) => Math.min(VIDEOS.length - 1, i + 1));
      } else {
        // küçük hareket: snap back to current (scroll handled by scrollTo effect)
        const card = videoRefs.current[index]?.parentElement as HTMLElement | undefined;
        if (cont && card) {
          const left = card.offsetLeft + card.clientWidth / 2 - cont.clientWidth / 2;
          cont.scrollTo({ left, behavior: "smooth" });
        }
      }
      pointer.current.deltaX = 0;
      // pointer capture release handled automatically on pointerup
    }
    // --- touch fallback for browsers that don't use pointer events (or to improve mobile behavior) ---
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      pointer.current.dragging = true;
      pointer.current.moved = false;
      pointer.current.startX = t.clientX;
      pointer.current.deltaX = 0;
      setPaused(true);
    }
    function onTouchMove(e: TouchEvent) {
      if (!pointer.current.dragging) return;
      const t = e.touches[0];
      pointer.current.deltaX = t.clientX - pointer.current.startX;
      if (Math.abs(pointer.current.deltaX) > 6) pointer.current.moved = true;
      // prevent vertical page scroll when actively dragging horizontally
      if (Math.abs(pointer.current.deltaX) > 10) e.preventDefault();
    }
    function onTouchEnd() {
      if (!pointer.current.dragging) return;
      pointer.current.dragging = false;
      const dx = pointer.current.deltaX;
      const threshold = (cont!.clientWidth * 0.12);
      if (dx > threshold) {
        setIndex((i) => Math.max(0, i - 1));
      } else if (dx < -threshold) {
        setIndex((i) => Math.min(VIDEOS.length - 1, i + 1));
      } else {
        const card = videoRefs.current[index]?.parentElement as HTMLElement | undefined;
        if (cont && card) {
          const left = card.offsetLeft + card.clientWidth / 2 - cont.clientWidth / 2;
          cont.scrollTo({ left, behavior: "smooth" });
        }
      }
      pointer.current.deltaX = 0;
    }
    function onPointerCancel() {
      pointer.current.dragging = false;
      pointer.current.deltaX = 0;
    }

    cont.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
  // touch listeners — note: touchmove is non-passive so we can call preventDefault when dragging
  cont.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);
  window.addEventListener("touchcancel", onPointerCancel);

    return () => {
      cont.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      cont.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onPointerCancel);
    };
  }, [index]);

  // --- resume autoplay after mouse leaves (opsiyonel) ---
  // burada istersen belirli bir süre sonra autoplay i yeniden başlatabilirsin
  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => {
      setPaused(false);
    }, 30000); // 30s sonra otomatik geri başlat (isteğe bağlı)
    return () => clearTimeout(t);
  }, [paused]);

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
            setIndex((i) => Math.min(VIDEOS.length - 1, i + 1));
          }}
        >
          ›
        </button>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden overflow-y-hidden no-scrollbar snap-x snap-mandatory"
          style={{ touchAction: "pan-x" }}
          tabIndex={0}
          role="region"
          aria-label="Video carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {VIDEOS.map((it, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                className={`flex-shrink-0 w-[min(72vw,420px)] h-96 sm:h-[32rem] md:h-[36rem] rounded-xl overflow-hidden snap-start cursor-pointer transition-all duration-500 ${
                  active ? "scale-105 opacity-100 z-10 shadow-2xl" : "scale-95 opacity-80 hover:scale-100 hover:opacity-100"
                }`}
                onClick={() => {
                  setPaused(true);
                  setIndex(i);
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  data-src={it.src}
                  data-index={String(i)}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: it.focal }}
                />
              </div>
            );
          })}
        </div>

        {/* indicators */}
        <div className="mt-4 flex justify-center gap-2">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ${i + 1}`}
              onClick={() => {
                setPaused(true);
                setIndex(i);
              }}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-black" : "bg-black/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}