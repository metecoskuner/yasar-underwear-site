import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type SplashProps = {
  duration?: number; // ms before starting hide transition
  onFinish?: () => void;
};

export default function Splash({ duration = 700, onFinish }: SplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Skip animation, finish immediately but defer state update to avoid sync setState inside effect
      const defer = setTimeout(() => setVisible(false), 0);
      const t = setTimeout(() => onFinish && onFinish(), 50);
      return () => {
        clearTimeout(defer);
        clearTimeout(t);
      };
    }

    const hideTimer = setTimeout(() => setVisible(false), duration);
    const removeTimer = setTimeout(() => onFinish && onFinish(), duration + 300); // allow transition to complete

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      aria-hidden={!visible}
      className={
        'fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-300 ease-out transform'
      }
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div
        className={
          'flex items-center justify-center transition-opacity transition-transform ease-out ' +
          (visible ? 'opacity-100 scale-100' : 'opacity-0 scale-105')
        }
        // small inline style to ensure smooth transform
      >
        <Image
          src="/photos/yasarlogo_black.png"
          alt="Yasar Underwear"
          width={180}
          height={80}
          priority
          className="w-[160px] h-auto sm:w-[180px] object-contain"
        />
      </div>
    </div>
  );
}
