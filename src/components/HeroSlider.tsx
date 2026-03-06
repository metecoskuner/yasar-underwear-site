import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const defaultSlides = [
  '/photos/PYJAMA-BRANDS.avif',
  '/photos/yasarLogo2.jpg',
  '/photos/yasarLogo.png',
];

type Props = { slides?: string[] }

export default function HeroSlider({ slides }: Props) {
  const activeSlides = Array.isArray(slides) && slides.length > 0 ? slides : defaultSlides
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % activeSlides.length), 4000);
    return () => clearInterval(t);
  }, [activeSlides.length]);

  return (
    <div className="absolute inset-0">
      {activeSlides.map((s, i) => (
        <div key={`${s}-${i}`} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={s}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover object-top"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black opacity-10" />
    </div>
  );
}
