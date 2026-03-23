/* eslint-disable @next/next/no-img-element */
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
  const [imgFailed, setImgFailed] = React.useState(false);
  // null = unknown, true = available, false = not available
  const [imgAvailable, setImgAvailable] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let mounted = true;
    // Try to fetch the user-provided PNG from the public/photos folder. If it's present (HTTP 200), mark as available.
    fetch('/photos/whatsapp.png', { method: 'GET' })
      .then((res) => {
        if (!mounted) return;
        setImgAvailable(res.ok);
      })
      .catch(() => {
        if (!mounted) return;
        setImgAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  // Use NEXT_PUBLIC_WHATSAPP_NUMBER as the authoritative source for the phone number.
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  // Do not fall back to a hard-coded placeholder. If you want a different number in tests,
  // set NEXT_PUBLIC_WHATSAPP_NUMBER or pass the `number` prop explicitly.
  const raw = envNumber || number || '';
  const digits = normalizeNumber(raw);

  // For wa.me links we must use only digits (no leading '+').
  const digitsForWa = typeof digits === 'string' ? digits.replace(/^\+/, '') : '';

  // Warn early if the env var isn't set so devs notice in console (local & prod logs).
  if (!envNumber) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('NEXT_PUBLIC_WHATSAPP_NUMBER is not configured');
    }
  }
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

  // Helpful debug output in development so you can confirm what number/link the component resolved.
  if (process.env.NODE_ENV === 'development') {
    console.debug('WhatsAppButton resolved', { raw, digits, digitsForWa, webUrl, envNumber, envMessage });
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
      className="fixed right-4 bottom-28 z-[60] bg-[#25D366] hover:bg-[#1bbf57] text-white rounded-full shadow-2xl hover:shadow-2xl ring-1 ring-black/6 flex items-center justify-center w-14 h-14 overflow-hidden transition-transform transform hover:scale-110"
    >
      <span className="sr-only">{tr('components.whatsApp.sr','WhatsApp')}</span>
      {/* Prefer the Flaticon asset at /icons/whatsapp-flaticon.svg when available (user-provided).
          If that image fails to load, fall back to the embedded glyph so the button always shows an icon. */}
      {/* Render the external icon only if we confirmed it's available and hasn't errored. */}
      {imgAvailable ? (
        !imgFailed ? (
          <img
            src="/photos/whatsapp.png"
            alt=""
            role="presentation"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full p-0" aria-hidden>
            <path fill="#fff" d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.556 4.093 1.61 5.86L0 24l7.41-2.395A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.196-1.246-6.205-3.48-8.52zM17.86 15.1c-.3-.15-1.79-.87-2.06-.97-.28-.11-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.4-.05-.55-.05-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52-.18-.01-.39-.01-.59-.01-.2 0-.52.07-.8.37-.28.3-1.06 1.03-1.06 2.5 0 1.47 1.09 2.9 1.24 3.1.15.2 2.14 3.3 5.18 4.63 2.08.68 2.8.76 3.56.76.3 0 .94-.09 1.36-.35.42-.26.79-.61 1.01-1.09.22-.48.22-.9.16-1.03-.05-.12-.18-.2-.39-.35z" />
          </svg>
        )
      ) : (
        // If availability unknown or confirmed missing, show the embedded glyph immediately to avoid an empty button.
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full p-0" aria-hidden>
          <path fill="#fff" d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.556 4.093 1.61 5.86L0 24l7.41-2.395A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.196-1.246-6.205-3.48-8.52zM17.86 15.1c-.3-.15-1.79-.87-2.06-.97-.28-.11-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.4-.05-.55-.05-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52-.18-.01-.39-.01-.59-.01-.2 0-.52.07-.8.37-.28.3-1.06 1.03-1.06 2.5 0 1.47 1.09 2.9 1.24 3.1.15.2 2.14 3.3 5.18 4.63 2.08.68 2.8.76 3.56.76.3 0 .94-.09 1.36-.35.42-.26.79-.61 1.01-1.09.22-.48.22-.9.16-1.03-.05-.12-.18-.2-.39-.35z" />
        </svg>
      )}
    </a>
  );
}
