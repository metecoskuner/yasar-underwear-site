import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import ContactSection from '../components/ContactSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadLeaflet } from '../hooks/useLeafletLoader';
import { MAP_PLACES, type MapPlace } from '../config/mapPlaces';
import { CONTACT, SOCIAL } from '../config/contactConfig';

// Use MAP_PLACES (title/addr/lat/lng) for location cards. Phones/emails are shown
// once below in the "Hızlı Bilgiler" section to avoid duplication.
const LOCATIONS = MAP_PLACES;

export default function ContactPage(): JSX.Element {
  const ContactSectionComp = ContactSection as unknown as React.ComponentType<{ showSummary?: boolean }>;
  const { t } = useLanguage();
  const tr = useCallback((key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  }, [t]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, unknown>>({});
  const mapInstanceRef = useRef<unknown | null>(null);

  useEffect(() => {
    let mounted = true;
    async function initMap() {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = await loadLeaflet();
      if (!mounted || !L) return;
      // Leaflet's types aren't part of this small loader helper; allow a local any here.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leaflet: any = L;
  // Create the map and add tiles
  const places = MAP_PLACES as readonly MapPlace[];
      const first = places[0];
      const map = leaflet.map(mapRef.current, { zoomControl: true }).setView([first.lat, first.lng], 8);
      mapInstanceRef.current = map;
      const tile = process.env.NEXT_PUBLIC_LIGHT_TILE || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      leaflet.tileLayer(tile, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

      try {
        const group = leaflet.featureGroup();
        places.forEach((p) => {
          const m = leaflet.marker([p.lat, p.lng]).addTo(map);
          // include a direct link to Google Maps for this location
          const mapsHref = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
          const popupHtml = `<strong>${p.title}</strong><br/>${p.addr}<br/><a href="${mapsHref}" target="_blank" rel="noreferrer">${tr('pages.contact.map.goto','Konuma git')}</a>`;
          m.bindPopup(popupHtml);
          markersRef.current[p.id] = m;
          group.addLayer(m);
        });
        if (places.length) map.fitBounds(group.getBounds(), { padding: [40, 40] });
      } catch {
        // ignore leaflet errors
      }

      return () => { mounted = false; try { map.remove(); } catch {} };
    }
    initMap();
  }, [tr]);

  function showPlace(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = (markersRef.current as any)[id];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = mapInstanceRef.current as any;
    if (!m || !map) return;
    try {
      const latlng = m.getLatLng();
      const targetZoom = 15;

      // open popup first so we can measure its DOM size
      try { m.openPopup(); } catch {}

      // after popup renders, compute its pixel height and shift center accordingly
          setTimeout(() => {
        try {
          const popups = Array.from(document.querySelectorAll('.leaflet-popup')) as HTMLElement[];
          // take the last popup (most recently opened)
          const popupEl = popups.length ? popups[popups.length - 1] : null;
          let yOffset = 120; // default if we can't measure
          if (popupEl) {
            const rect = popupEl.getBoundingClientRect();
            // add a small margin so popup isn't flush to the top
            yOffset = Math.round(rect.height / 2) + 20;
          }

          const containerPoint = map.latLngToContainerPoint(latlng);
          const shifted = containerPoint.subtract([0, yOffset]);
          const targetLatLng = map.containerPointToLatLng(shifted);

          map.setView(targetLatLng, targetZoom, { animate: true });
          // ensure popup stays open after move
          setTimeout(() => { try { m.openPopup(); } catch {} }, 300);
        } catch {
          // fallback to simple behavior
          try { map.setView(latlng, targetZoom, { animate: true }); } catch {}
          try { m.openPopup(); } catch {}
        }
      }, 80);
    } catch {
      // final fallback
      try { map.setView(m.getLatLng(), 15, { animate: true }); } catch {}
      try { m.openPopup(); } catch {}
    }
  }

  return (
    <>
  <SEO title={tr('pages.contact.seo.title','İletişim - Yasar')} description={tr('pages.contact.seo.description','Görüş, öneri veya taleplerinizi bize yazın.')} url="/contact" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:underline">{tr('pages.contact.breadcrumb.home','Anasayfa')}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{tr('pages.contact.breadcrumb.title','İletişim')}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{tr('pages.contact.header.title','Bize Yazın')}</h1>
          <p className="text-slate-600 max-w-2xl">{tr('pages.contact.header.intro','Görüş, öneri, istek ya da başka herhangi bir şey için bize mesaj gönderin.')}</p>
        </header>

        <section className="mb-8">
          <div ref={mapRef} id="yasar-map" className="w-full h-64 md:h-80 rounded-lg border overflow-hidden" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start md:items-stretch">
          <div className="flex">
            <div className="w-full">
              <ContactSectionComp showSummary={false} />
            </div>
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow border">
              <h2 className="text-xl font-semibold mb-4">{tr('pages.contact.locationsTitle','Merkez & Üretim Bilgileri')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LOCATIONS.map((l) => (
                  <div key={l.title} className="p-4 rounded-lg bg-slate-50 border flex flex-col">
                    <h3 className="text-sm font-semibold mb-1">{l.title}</h3>
                    <address className="not-italic text-sm whitespace-pre-line text-slate-700 mb-2">{l.addr}</address>
                    <div className="mt-3">
                      <button type="button" onClick={() => showPlace(l.id)} className="inline-flex items-center gap-2 text-sm text-slate-700 hover:underline transition">
                        {tr('pages.contact.map.showLocation','Konumu göster')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-4 shadow border text-sm">
              <h3 className="font-medium mb-2">{tr('pages.contact.quickInfoTitle','Hızlı Bilgiler')}</h3>
              <div className="text-sm text-slate-700">
                <div>{tr('pages.contact.phoneLabel','Telefon:')} <a className="hover:underline" href={`tel:${CONTACT.PHONE_MAIN}`}>{CONTACT.PHONE_MAIN}</a></div>
                <div>{tr('pages.contact.emailLabel','E-posta:')} <a className="hover:underline" href={`mailto:${CONTACT.EMAIL}`}>{CONTACT.EMAIL}</a></div>
              </div>
              <div className="flex gap-3 mt-3 items-center">
                {Object.entries(SOCIAL).map(([k, v]) => {
                  const key = k.toUpperCase();
                  const base = 'transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded inline-block';
                  const colorClass = key === 'INSTAGRAM' ? 'hover:text-[#E1306C]' : key === 'FACEBOOK' ? 'hover:text-[#1877F2]' : key === 'WHATSAPP' ? 'hover:text-[#25D366]' : 'hover:underline';
                  return (
                    <a key={k} href={v as string} target="_blank" rel="noreferrer" aria-label={k} className={`${base} text-sm text-slate-700 ${colorClass}`}>
                      <span className="sr-only">{k}</span>
                      {key === 'INSTAGRAM' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <rect x="3" y="3" width="18" height="18" rx="4" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <path d="M17.5 6.5h.01" />
                        </svg>
                      )}
                      {key === 'FACEBOOK' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" />
                        </svg>
                      )}
                      {key === 'WHATSAPP' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M20.52 3.48A11.82 11.82 0 0 0 12 .25C5.94.25.98 5.21.98 11.27c0 2.02.53 3.9 1.53 5.55L.1 23.9l7.38-1.94a11.96 11.96 0 0 0 4.5.88c6.06 0 11.02-4.96 11.02-11.02 0-3-1.17-5.81-3.48-7.34zM12 21.5c-1.3 0-2.57-.2-3.76-.6l-.27-.09-4.38 1.14 1.17-4.26-.08-.28A9.17 9.17 0 0 1 2.83 11.3c0-5.01 4.08-9.09 9.09-9.09 2.43 0 4.71.95 6.42 2.67a9.1 9.1 0 0 1-6.34 15.51z" />
                          <path d="M17.23 14.11c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.51-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.51-.17-.02-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49 3 .8 3.6.63 4.25.59.65-.05 2.12-.86 2.42-1.69.3-.83.3-1.54.21-1.69-.09-.15-.27-.24-.57-.39z" />
                        </svg>
                      )}
                    </a>
                  );
                })}
              </div>
            </section>

            <section className="mt-0 text-sm text-slate-600">
              <h4 className="font-medium mb-2">{tr('pages.contact.noteTitle','Not')}</h4>
              <p>{tr('pages.contact.noteText','Formu doldurarak ')}<Link href="/privacy" className="underline">{tr('pages.contact.privacyPolicy','Kullanıcı Verilerinin Korunması Kanunu')}</Link>{tr('pages.contact.noteTextSuffix',' kapsamında verilerin işlenmesini onaylamış olursunuz.')}</p>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
