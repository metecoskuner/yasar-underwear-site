import React from 'react';

// Reads number from NEXT_PUBLIC_WHATSAPP_NUMBER (e.g. +90530xxxxxxx)
// Falls back to a placeholder — please set NEXT_PUBLIC_WHATSAPP_NUMBER in your env.
function normalizeNumber(n: string) {
  return n.replace(/[^0-9]/g, '');
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function WhatsAppButton({ number }: { number?: string }) {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const raw = number || envNumber || '+905300000000';
  const digits = normalizeNumber(raw);
  const appUrl = `whatsapp://send?phone=${digits}`;
  const webUrl = `https://wa.me/${digits}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Try to open the native WhatsApp app. If it doesn't open, fallback to web URL.
    e.preventDefault();
    // First try the deep link
    window.location.href = appUrl;
    // After a short delay, open web fallback in a new tab/window
    setTimeout(() => {
      window.open(webUrl, '_blank', 'noopener');
    }, 600);
  };

  return (
    <a
      href={webUrl}
      onClick={handleClick}
      aria-label={tr('components.whatsApp.open','WhatsApp uygulamasında aç')}
      title={tr('components.whatsApp.open','WhatsApp uygulamasında aç')}
      className="fixed right-4 bottom-28 z-[60] bg-[#25D366] hover:bg-[#1bbf57] text-white p-3 rounded-full shadow-2xl hover:shadow-2xl ring-1 ring-black/6 flex items-center justify-center w-14 h-14 transition-transform transform hover:scale-110"
    >
      <span className="sr-only">{tr('components.whatsApp.sr','WhatsApp')}</span>
      {/* Use a simpler, crisper phone handset glyph for better visual fidelity */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.04.38 2.06.78 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.97.4 1.99.66 3.03.78A2 2 0 0 1 22 16.92z" fill="#fff" />
      </svg>
    </a>
  );
}
