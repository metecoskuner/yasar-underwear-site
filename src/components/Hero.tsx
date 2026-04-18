import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

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
  const [isMuted, setIsMuted] = useState(false);
  const isLargeScreen = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
  }, [isLargeScreen, isMuted]);

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
        preload="metadata"
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
