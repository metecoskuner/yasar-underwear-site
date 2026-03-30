import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import FlagsStrip from './FlagsStrip';
import ContactSection from './ContactSection';
import WhatsAppButton from './WhatsAppButton';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Hide site chrome (header/footer/flags/contact/whatsapp) for admin pages.
  // Admin pages live under `/admin` so any pathname that starts with that
  // should render a simplified container without the public site chrome.
  const isAdminRoute = router.pathname.startsWith('/admin');
  // Workaround: in some build setups Header's inferred type can become '() => unknown'
  // which TypeScript will reject as a JSX element type. Coerce to a component
  // type so it can be used in JSX. This mirrors the approach used for ContactSection.
  const HeaderComp = Header as unknown as React.ComponentType<unknown>;
  // Some versions of the ContactSection export can be typed as unknown by the TS
  // checker in this workspace; coerce to a React component type to avoid
  // spurious TS2786 when used as JSX. This is a small, local workaround.
  const ContactSectionComp = ContactSection as unknown as React.ComponentType<unknown>;

  // For admin pages render a simplified wrapper without public site chrome.
  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <main id="content" className="">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link: visible when focused for keyboard users */}
      <a
        href="#content"
        className="absolute left-4 -top-16 focus:top-4 focus:z-50 bg-white text-black px-3 py-2 rounded shadow transition-all duration-150"
      >
        Sayfaya atla
      </a>
      <HeaderComp />
      <main id="content" className="flex-1" style={{ paddingTop: 'var(--site-header-height, 120px)' }}>{children}</main>
      {/* Flags strip between main content (e.g. WorldMap) and footer */}
      {/* Render flags only on the homepage to avoid visual clutter on inner pages */}
      {/* Reduce vertical padding on small screens so flags sit closer to the map */}
      {router.pathname === '/' && (
        <section className="w-full bg-white text-black py-2 md:py-6 relative z-0">
          {/* FlagsStrip rendered full-bleed (edge-to-edge) so all flags can appear across the page */}
          <FlagsStrip />
        </section>
      )}
      {/* Contact section rendered above the footer only on the homepage */}
      {router.pathname === '/' && <ContactSectionComp />}
      <Footer />
      {/* Site-wide WhatsApp floating CTA */}
      <WhatsAppButton />
    </div>
  );
}
