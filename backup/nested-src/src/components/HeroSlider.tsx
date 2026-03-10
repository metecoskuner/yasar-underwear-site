import React, { useEffect, useState } from 'react';

const slides = [
  '/photos/PYJAMA-BRANDS.avif',
  '/photos/yasarLogo2.jpg',
  '/photos/yasarLogo.png',
];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((s, i) => (
        <div
          key={s}
          className={`absolute inset-0 bg-cover bg-top transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-10" />
    </div>
  );
}
