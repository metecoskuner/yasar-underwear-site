import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';

type VideoItem = { src: string; poster?: string; focal?: string };

const VIDEOS: VideoItem[] = [
  { src: "/videos/DSCF7638-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 30%" },
  { src: "/videos/DSCF7639-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 35%" },
  { src: "/videos/DSCF7649-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 40%" },
  { src: "/videos/DSCF7648-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 30%" },
  { src: "/videos/DSCF7645-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 45%" },
  { src: "/videos/DSCF7651-web.mp4", poster: "/photos/PYJAMA-BRANDS.avif", focal: "center 50%" },
];

const ALWAYS_PLAY_COUNT = 3;

export default function MediaWrap() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const indexRef = useRef<number>(0);
  const skipScrollRef = useRef(false); // set when index was changed by scroll handler to avoid fighting user
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const visible = useRef<Set<number>>(new Set()); // hangi indeksler görünür
  const pointer = useRef({
    startX: 0,
    deltaX: 0,
    dragging: false,
    moved: false,
  });
  const autoplayDelay = 8000;

  function pauseAllVideos() {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      try {
        video.pause();
      } catch {}
    });
  }

  function ensureVideoLoaded(i: number) {
    if (i < 0 || i >= VIDEOS.length) return;
    const video = videoRefs.current[i];
    if (!video || !video.dataset.src || video.src) return;

    video.src = video.dataset.src;
    video.removeAttribute("data-src");
    try {
      video.load();
    } catch {}
  }

  // --- autoplay ---
  useEffect(() => {
    if (paused || !isSectionVisible || prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % VIDEOS.length);
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [paused, isSectionVisible, prefersReducedMotion]);

  // Track whether the section is actually on screen so autoplay doesn't run
  // while the user is elsewhere on the page.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Respect reduced-motion preferences for calmer behavior.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // --- scroll to active (smooth center) ---
  useEffect(() => {
    const cont = containerRef.current;
    const card = videoRefs.current[index]?.parentElement as HTMLElement | undefined;
    if (!cont || !card) return;
    // if the index was set from a user scroll, don't force-scroll and clear the flag
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }

    const left = card.offsetLeft + card.clientWidth / 2 - cont.clientWidth / 2;
    cont.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  // keep an up-to-date ref of index for event handlers
  useEffect(() => {
    indexRef.current = index;
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

  // --- ensure first 3 videos load immediately on mount ---
  useEffect(() => {
    ensureVideoLoaded(0);
    ensureVideoLoaded(1);
    ensureVideoLoaded(2);
  }, []);

  // --- IntersectionObserver: lazy-load & mark visible ---
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement;
          const i = Number(el.dataset.index);
          if (entry.isIntersecting) {
            visible.current.add(i);
            ensureVideoLoaded(i);
          } else {
            visible.current.delete(i);
          }
        });
      },
      { root: containerRef.current ?? null, rootMargin: "48px", threshold: 0.7 }
    );

    videoRefs.current.forEach((v) => v && obs.observe(v));
    return () => obs.disconnect();
  }, []);

  // --- play active video (try to play regardless of intersection visibility) ---
  useEffect(() => {
    if (!isSectionVisible) {
      pauseAllVideos();
      return;
    }

    ensureVideoLoaded(index);
    ensureVideoLoaded(index + 1);
    for (let i = 0; i < ALWAYS_PLAY_COUNT; i += 1) {
      ensureVideoLoaded(i);
    }

    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const shouldPlay = i < ALWAYS_PLAY_COUNT || i === index;

      if (shouldPlay) {
        v.muted = true;
        if (v.readyState >= 2) {
          if (i === index) {
            try {
              v.currentTime = 0;
            } catch {}
          }
          if (!prefersReducedMotion) {
            v.play().catch(() => {});
          }
        } else {
          const handleCanPlay = () => {
            v.removeEventListener("canplay", handleCanPlay);
            if (i === index) {
              try {
                v.currentTime = 0;
              } catch {}
            }
            if (!prefersReducedMotion) {
              v.play().catch(() => {});
            }
          };
          v.addEventListener("canplay", handleCanPlay);
        }
      } else {
        try {
          v.pause();
          if (i >= ALWAYS_PLAY_COUNT && Math.abs(i - index) > 1) {
            v.removeAttribute("src");
            v.load();
            v.dataset.src = VIDEOS[i]?.src ?? "";
          }
        } catch {}
      }
    });
  }, [index, isSectionVisible, prefersReducedMotion]);

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
      // We no longer call preventDefault here because the listener is passive.
      // Rely on the container's `touch-action: pan-x` to allow horizontal swipes
      // while preserving native scroll performance.
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
  // touch listeners — keep touchmove passive so native scrolling on touch devices isn't blocked
  cont.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
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

  // --- user scroll handling: detect which card is centered and set index so its video plays ---
  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    let rafPending = false;

    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const current = containerRef.current;
        if (!current) return;
        const contRect = current.getBoundingClientRect();
        const contCenter = (contRect.left + contRect.right) / 2;
        let bestIdx = indexRef.current;
        let bestDist = Infinity;
        videoRefs.current.forEach((v, i) => {
          if (!v || !v.parentElement) return;
          const cardRect = (v.parentElement as HTMLElement).getBoundingClientRect();
          const cardCenter = (cardRect.left + cardRect.right) / 2;
          const dist = Math.abs(cardCenter - contCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });

        if (bestIdx !== indexRef.current) {
          // mark skipScroll so the scroll-to-active effect doesn't fight this user scroll
          skipScrollRef.current = true;
          setPaused(true);
          setIndex(bestIdx);
        }
      });
    }

    cont.addEventListener('scroll', onScroll, { passive: true });
    return () => cont.removeEventListener('scroll', onScroll);
  }, []);

  // --- resume autoplay after mouse leaves (opsiyonel) ---
  // burada istersen belirli bir süre sonra autoplay i yeniden başlatabilirsin
  useEffect(() => {
    if (!paused || !isSectionVisible || prefersReducedMotion) return;
    const t = setTimeout(() => {
      setPaused(false);
    }, 12000);
    return () => clearTimeout(t);
  }, [paused, isSectionVisible, prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <h3 className="text-lg font-semibold mb-4">{tr('components.media.title','Gör, Hisset, Keşfet')}</h3>

      <div className="relative">
        {/* LEFT BUTTON */}
        <button
          aria-label={tr('components.media.prev','Önceki')}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 rounded-full shadow-md cursor-pointer"
          onClick={() => {
            setPaused(true);
            setIndex((i) => Math.max(0, i - 1));
          }}
        >
          ‹
        </button>

        {/* RIGHT BUTTON */}
        <button
          aria-label={tr('components.media.next','Sonraki')}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 rounded-full shadow-md cursor-pointer"
          onClick={() => {
            setPaused(true);
            setIndex((i) => Math.min(VIDEOS.length - 1, i + 1));
          }}
        >
          ›
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory scroll-px-4 sm:scroll-px-6"
          style={{ touchAction: "pan-x", WebkitOverflowScrolling: 'touch' }}
          tabIndex={0}
          role="region"
          aria-label="Video carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            if (!prefersReducedMotion) setPaused(false);
          }}
        >
          {VIDEOS.map((it, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                className={`flex-shrink-0 w-[clamp(16rem,78vw,26rem)] sm:w-[clamp(18rem,62vw,26rem)] aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden snap-start cursor-pointer transition-all duration-500 ${
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
                  preload={i < ALWAYS_PLAY_COUNT || active || i === index + 1 ? "metadata" : "none"}
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
              aria-label={tr('components.media.goTo','Go to {n}').replace('{n}', String(i + 1))}
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
