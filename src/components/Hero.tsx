import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Hero() {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoSrc = (isMobile ? '/videos/yasarheromobil.mp4' : '/videos/YasarHero1.mp4');

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[600px] lg:h-[700px] overflow-hidden z-0">
      <video
        key={videoSrc}
        ref={(video) => {
          if (video) video.muted = isMuted;
        }}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      
      {/* Mute/Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200 z-10 text-2xl"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </section>
  );
}