import React from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'ghost' | 'outline';

type Props = {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

const base = 'inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full font-bold transition transform will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg hover:from-amber-500 hover:to-amber-700 hover:scale-105 active:scale-100',
  ghost: 'bg-white/6 border border-white/20 text-white hover:bg-white hover:text-black hover:scale-105 shadow-sm',
  outline: 'bg-transparent border border-white/40 text-white hover:bg-white hover:text-black hover:scale-105 shadow-sm',
};

export default function HeroCTA({ href, onClick, variant = 'primary', children, ariaLabel, className }: Props) {
  const cls = `${base} ${variants[variant]} ${className ?? ''}`.trim();

  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        <span className="truncate">{children}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      <span className="truncate">{children}</span>
      {icon}
    </button>
  );
}
