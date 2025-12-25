import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FlagsStrip from './FlagsStrip';
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
      {/* Flags strip between main content (e.g. WorldMap) and footer */}
      {/* Reduce vertical padding on small screens so flags sit closer to the map */}
      <section className="w-full bg-white text-black py-2 md:py-6 relative z-10">
        {/* FlagsStrip rendered full-bleed (edge-to-edge) so all flags can appear across the page */}
        <FlagsStrip />
      </section>
  <Footer />
      {/* Site-wide WhatsApp floating CTA */}
      <WhatsAppButton />
    </div>
  );
}
