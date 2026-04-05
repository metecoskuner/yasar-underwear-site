import { useState, useSyncExternalStore } from 'react';

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
  const [isMuted, setIsMuted] = useState(true);
  const isLargeScreen = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        minHeight: 'clamp(28rem, calc(100svh - var(--site-header-height, 72px)), 52rem)',
      }}
    >
      {/* Single responsive video element - only one renders at a time */}
      <video
        key={isLargeScreen ? 'desktop' : 'mobile'}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ width: '100%', height: '100%' }}
      >
        <source
          src={isLargeScreen ? '/videos/YasarHero1.mp4' : '/videos/yasarheromobil.mp4'}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay - positioned above video, below controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent z-[5] pointer-events-none" />

      {/* Mute toggle button - highest z-index */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2.5 sm:p-3 z-[10] transition-all duration-200 hover:scale-110"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        title={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
