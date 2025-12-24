import React from 'react';

// Reads number from NEXT_PUBLIC_WHATSAPP_NUMBER (e.g. +90530xxxxxxx)
// Falls back to a placeholder — please set NEXT_PUBLIC_WHATSAPP_NUMBER in your env.
function normalizeNumber(n: string) {
  return n.replace(/[^0-9]/g, '');
}

export default function WhatsAppButton({ number }: { number?: string }) {
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
      aria-label="WhatsApp uygulamasında aç"
      title="WhatsApp uygulamasında aç"
  className="fixed right-4 bottom-28 z-[60] bg-[#25D366] hover:bg-[#1bbf57] text-white p-3 rounded-full shadow-2xl hover:shadow-2xl ring-1 ring-black/6 flex items-center justify-center w-14 h-14 transition-transform transform hover:scale-110"
    >
      <span className="sr-only">WhatsApp</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
        aria-hidden
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12 .25C5.94.25.98 5.21.98 11.27c0 2.02.53 3.9 1.53 5.55L.1 23.9l7.38-1.94a11.96 11.96 0 0 0 4.5.88c6.06 0 11.02-4.96 11.02-11.02 0-3-1.17-5.81-3.48-7.34zM12 21.5c-1.3 0-2.57-.2-3.76-.6l-.27-.09-4.38 1.14 1.17-4.26-.08-.28A9.17 9.17 0 0 1 2.83 11.3c0-5.01 4.08-9.09 9.09-9.09 2.43 0 4.71.95 6.42 2.67a9.1 9.1 0 0 1-6.34 15.51z" />
        <path d="M17.23 14.11c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.51-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.51-.17-.02-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49 3 .8 3.6.63 4.25.59.65-.05 2.12-.86 2.42-1.69.3-.83.3-1.54.21-1.69-.09-.15-.27-.24-.57-.39z" />
      </svg>
    </a>
  );
}
