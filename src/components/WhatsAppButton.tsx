import React from 'react';

// Reads number from NEXT_PUBLIC_WHATSAPP_NUMBER (e.g. +90530xxxxxxx)
// Falls back to a placeholder — please set NEXT_PUBLIC_WHATSAPP_NUMBER in your env.
function normalizeNumber(n: string) {
  // Keep a leading + if present, otherwise keep only digits.
  const raw = (n || '').toString().trim();
  if (!raw) return '';
  const hasPlus = raw.startsWith('+');
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
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
  // Use NEXT_PUBLIC_WHATSAPP_NUMBER as the authoritative source for the phone number.
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+902125190149';
  // Do not fall back to a hard-coded placeholder. If you want a different number in tests,
  // set NEXT_PUBLIC_WHATSAPP_NUMBER or pass the `number` prop explicitly.
  const raw = envNumber || number || '+902125190149';
  const digits = normalizeNumber(raw);

  // For wa.me links we must use only digits (no leading '+').
  const digitsForWa = typeof digits === 'string' ? digits.replace(/^\+/, '') : '902125190149';

  // Consider configured if either the env var or a `number` prop is provided.
  const isConfigured = Boolean(envNumber || number);
  // If we have digits after sanitization, we can build the wa.me URL.
  const hasDigits = digitsForWa.length > 0;

  // Support an optional default message from NEXT_PUBLIC_WHATSAPP_MESSAGE
  const envMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || '';
  const encodedMessage = envMessage ? encodeURIComponent(envMessage) : '';

  let webUrl = '#';
  if (hasDigits) {
    webUrl = `https://wa.me/${digitsForWa}`;
    if (encodedMessage) webUrl += `?text=${encodedMessage}`;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // If NEXT_PUBLIC_WHATSAPP_NUMBER is not configured, show a clear alert and do nothing.
    if (!isConfigured) {
      alert(tr('components.whatsApp.noNumber','WhatsApp numarası yapılandırılmamış.'));
      return;
    }

    // If configured but sanitization produced no digits, do nothing (avoid opening malformed links).
    if (!hasDigits) return;

    // Always open the wa.me link in a new tab/window. On mobile this will hand off to the app.
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={webUrl}
      onClick={handleClick}
      aria-label={tr('components.whatsApp.open','WhatsApp uygulamasında aç')}
      title={tr('components.whatsApp.open','WhatsApp uygulamasında aç')}
      className="fixed right-4 bottom-28 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-2 ring-white/25 transition-transform duration-200 hover:scale-110 hover:bg-[#22c55e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span className="sr-only">{tr('components.whatsApp.sr','WhatsApp')}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-9 w-9" aria-hidden>
        <path fill="currentColor" d="M27.3 4.7A15.5 15.5 0 0 0 16.1.1C7.5.1.5 7.1.5 15.7c0 2.7.7 5.4 2.1 7.7L0 32l8.9-2.3c2.1 1.1 4.6 1.7 7.1 1.7h.1c8.6 0 15.6-7 15.6-15.6 0-4.2-1.6-8.1-4.4-11.1ZM16.1 28.7c-2.2 0-4.3-.6-6.1-1.7l-.4-.2-5.3 1.4 1.4-5.1-.3-.4a12.7 12.7 0 0 1-2-7c0-7 5.7-12.7 12.7-12.7 3.4 0 6.6 1.3 9 3.7a12.6 12.6 0 0 1 3.7 9c0 7-5.7 12.7-12.7 12.7Zm7-9.5c-.4-.2-2.2-1.1-2.5-1.3-.3-.1-.5-.2-.7.2-.2.3-.9 1.3-1.1 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.1-2.2-2.5-.2-.4 0-.5.1-.7.1-.1.3-.3.4-.5.2-.2.2-.3.4-.6.1-.2.1-.5 0-.6-.1-.2-.7-1.8-1-2.5-.2-.6-.5-.6-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 5 3.3 1.4 3.3 1 3.9.9.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.2-.7-.4Z"/>
      </svg>
    </a>
  );
}
