import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  const handleChange = () => callback();
  mediaQuery.addEventListener('change', handleChange);

  return () => mediaQuery.removeEventListener('change', handleChange);
}

function getSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

export default function Hero() {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isLargeScreen = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key);
      return value === key ? fallback : value;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;
    let idleId: number | undefined;

    const enableVideo = () => {
      if (cancelled) return;
      setShouldLoadVideo(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => enableVideo(), { timeout: 1500 });
    } else {
      timeoutId = globalThis.setTimeout(enableVideo, 900);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const tryPlay = async () => {
      try {
        video.muted = isMuted;
        await video.play();
      } catch {
        // Most mobile browsers block autoplay with sound.
        // Fall back to muted autoplay; user can enable sound from the control button.
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
        } catch {
          // user interaction will be required
        }
      }
    };

    void tryPlay();
  }, [isLargeScreen, isMuted, shouldLoadVideo]);

  const applyMuteState = async (nextMuted: boolean) => {
    const video = videoRef.current;
    setIsMuted(nextMuted);
    if (!video) return false;

    try {
      video.muted = nextMuted;
      await video.play();
      return true;
    } catch {
      video.muted = true;
      setIsMuted(true);
      return false;
    }
  };

  const toggleMute = async () => {
    await applyMuteState(!isMuted);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        minHeight: 'clamp(28rem, calc(100svh - var(--site-header-height, 72px)), 52rem)',
      }}
    >
      {/* Single responsive video element - only one renders at a time */}
      <video
        ref={videoRef}
        key={isLargeScreen ? 'desktop' : 'mobile'}
        autoPlay
        loop
        muted={isMuted}
        preload="none"
        poster="/photos/PYJAMA-BRANDS.avif"
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ width: '100%', height: '100%' }}
      >
        {shouldLoadVideo ? (
          <source
            src={isLargeScreen ? '/videos/YasarHero1.mp4' : '/videos/yasarheromobil.mp4'}
            type="video/mp4"
          />
        ) : null}
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay - positioned above video, below controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/45 z-[5] pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 z-[8]">
        <div className="mx-auto flex min-h-[22rem] max-w-7xl items-end px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
              {tr('components.hero.eyebrow', 'Turkish Textile Manufacturer')}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
              {tr('components.hero.brand', 'Yasar Underwear')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
              {tr('components.hero.subtitle', 'Trusted Turkish pajama, underwear and homewear manufacturer since 1969. Private label, OEM and wholesale production for global brands.')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/urunler" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-stone-100">
                {tr('components.hero.ctaCollections', 'View Collections')}
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
                {tr('components.hero.ctaQuote', 'Get a Quote')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mute toggle button - highest z-index */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2.5 sm:p-3 z-[10] transition-all duration-200 hover:scale-110"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        title={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
