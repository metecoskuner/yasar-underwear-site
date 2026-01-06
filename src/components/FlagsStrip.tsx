import React from 'react';
import LOCATIONS from '../data/locations';

function flagEmoji(code: string) {
  const map: Record<string, string> = { uk: 'GB' };
  const cc = (map[code] ?? code).toUpperCase();
  if (cc.length !== 2) return '';
  const first = 0x1f1e6 + (cc.charCodeAt(0) - 65);
  const second = 0x1f1e6 + (cc.charCodeAt(1) - 65);
  return String.fromCodePoint(first, second);
}

export default function FlagsStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full mt-0 mb-0 ${className}`}>
      <div className="w-full overflow-hidden h-full flex items-center">
        <div className="marquee" aria-hidden="false">
          <div className="marquee__inner">
            {LOCATIONS.map((loc) => (
              <div key={`a-${loc.id}`} className="flex flex-col items-center space-y-1 text-center text-sm sm:text-base whitespace-nowrap px-4 sm:px-6 md:px-8">
                <span aria-hidden className="text-2xl sm:text-3xl md:text-4xl leading-none">{flagEmoji(loc.id)}</span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold">{loc.name}</span>
              </div>
            ))}
            {LOCATIONS.map((loc) => (
              <div key={`b-${loc.id}`} className="flex flex-col items-center space-y-1 text-center text-sm sm:text-base whitespace-nowrap px-4 sm:px-6 md:px-8">
                <span aria-hidden className="text-2xl sm:text-3xl md:text-4xl leading-none">{flagEmoji(loc.id)}</span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
  .marquee { --marquee-speed: 72s; display: block; width: 100%; height: 100%; }
  .marquee__inner { display: inline-flex; align-items: center; gap: 1.25rem; animation: marquee var(--marquee-speed) linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee__inner { animation: none; } }
      `}</style>
    </div>
  );
}
