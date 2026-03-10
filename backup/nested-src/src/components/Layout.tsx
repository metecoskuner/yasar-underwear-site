import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link: visible when focused for keyboard users */}
      <a
        href="#content"
        className="absolute left-4 -top-16 focus:top-4 focus:z-50 bg-white text-black px-3 py-2 rounded shadow transition-all duration-150"
      >
        Sayfaya atla
      </a>
      <Header />
      <main id="content" className="flex-1">{children}</main>
      <Footer />
      {/* Site-wide WhatsApp floating CTA */}
      <WhatsAppButton />
    </div>
  );
}
