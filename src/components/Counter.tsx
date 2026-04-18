import React, { useEffect, useRef, useState } from 'react';

type CounterProps = {
  end: number;
  duration?: number; // in ms
  suffix?: string;
  label?: string;
};

export default function Counter({ end, duration = 1500, suffix = '+', label }: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const onIntersect: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const animate = (time: number) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad
            const eased = 1 - (1 - progress) * (1 - progress);
            setValue(Math.round(end * eased));

            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    };

    const obs = new IntersectionObserver(onIntersect, { threshold: 0.2 });
    obs.observe(el);

    return () => obs.disconnect();
  }, [end, duration]);

  const formatted = value.toLocaleString('tr-TR');

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-950">
        {formatted}
        {suffix}
      </div>
      {label ? (
        <div className="mt-1 max-w-xs text-center text-xs text-slate-700 sm:text-sm">{label}</div>
      ) : null}
    </div>
  );
}
