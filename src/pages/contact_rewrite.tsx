import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import SEO from '@/components/SEO';
import Layout from '../components/Layout';
import { loadLeaflet } from '../hooks/useLeafletLoader';
import { MAP_PLACES } from '../config/mapPlaces';
import { CONTACT, SOCIAL } from '../config/contactConfig';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu'),
  email: z.string().email('Geçerli bir e-posta girin'),
  message: z.string().min(1, 'Mesaj zorunlu'),
  company: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage(): JSX.Element {
  const { register, handleSubmit, formState, setError, reset } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const { errors, isSubmitting, isSubmitSuccessful } = formState;
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (typeof window === 'undefined') return;
      const L = await loadLeaflet();
      if (!mounted || !mapRef.current || !L) return;
      // Narrow the dynamic loader to a lightweight interface to avoid `any`.
      type LeafletLite = {
        map: (el: HTMLElement, opts?: unknown) => { setView: (c: [number, number], z: number) => void; fitBounds?: (c: [number, number][], opts?: unknown) => void };
        tileLayer: (tile: string, opts?: unknown) => { addTo: (m: unknown) => void };
  marker: (coords: [number, number]) => { addTo: (m: unknown) => { bindPopup?: (s: string) => void } };
      };
      const leaflet = L as unknown as LeafletLite;
      const map = leaflet.map(mapRef.current as HTMLElement, { zoomControl: true }) as { setView: (c: [number, number], z: number) => void; fitBounds?: (c: [number, number][], opts?: unknown) => void };
      map.setView([41.0335, 28.9689], 6);
      const tile = process.env.NEXT_PUBLIC_LIGHT_TILE || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      leaflet.tileLayer(tile, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        try {
          const coords: [number, number][] = [];
          (MAP_PLACES as readonly { lat?: number; lng?: number; title?: string; addr?: string }[]).forEach((p) => {
            if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
            const m = leaflet.marker([p.lat, p.lng]).addTo(map);
            if (typeof m.bindPopup === 'function') {
              const mapsHref = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
              const popup = '<strong>' + (p.title || '') + '</strong><br/>' + (p.addr || '') + '<br/><a href="' + mapsHref + '" target="_blank" rel="noreferrer">Konuma git</a>';
              m.bindPopup(popup);
            }
            coords.push([p.lat, p.lng]);
          });
          if (coords.length) {
            (map as unknown as { fitBounds: (c: [number, number][], opts?: unknown) => void }).fitBounds(coords, { padding: [40, 40] });
          }
  } catch {}
    }
    init();
    return () => { mounted = false; };
  }, []);

  async function onSubmit(data: ContactForm) {
    // clear previous general error
    const generalEl = document.getElementById('contact-form-error');
    if (generalEl) generalEl.textContent = '';

    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));

      if (res.status === 422 && body?.errors) {
        // Map field errors to react-hook-form
        const errs = body.errors as Record<string, string[]>;
        Object.entries(errs).forEach(([field, messages]) => {
          // join multiple messages into one
          // cast via unknown -> keyof to avoid `any` while remaining safe at runtime
          setError(field as unknown as keyof ContactForm, { type: 'server', message: messages.join('. ') }, { shouldFocus: true });
        });
        return;
      }

      if (!res.ok) {
        // Non-validation server error
        throw new Error(body?.message || 'Sunucu hatası');
      }

      // Success: reset form and let react-hook-form mark submission success
      reset();
      if (generalEl) generalEl.textContent = '';
    } catch (err) {
      console.error('contact submit error', err);
      if (generalEl) generalEl.textContent = (err as Error).message || 'Mesaj gönderilemedi.';
    }
  }

  return (
    <Layout>
      <SEO title="İletişim - Yasar" description="Bizimle iletişime geçin — soru, teklif veya işbirliği için formu doldurun." url="/contact" jsonLd={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Yasar",
        url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
        telephone: CONTACT.PHONE_MAIN,
        email: CONTACT.EMAIL,
      }} />
      <main className="max-w-6xl mx-auto px-4 py-12"> 
        <h1 className="text-3xl font-semibold mb-6">Bize Ulaşın</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
          <section>
            <p className="mb-4">Her türlü soru, teklif veya iş birliği için aşağıdaki formu doldurun ya da doğrudan iletişim bilgilerini kullanın.</p>
            <div className="mb-6">
              <h3 className="font-medium">Telefon</h3>
              <p>{CONTACT.PHONE_MAIN}{CONTACT.PHONE_MOBILE ? ` / ${CONTACT.PHONE_MOBILE}` : ''}</p>
              <h3 className="font-medium mt-3">E-posta</h3>
              <p>{CONTACT.EMAIL}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-describedby="contact-form-error"> 
              {/* Honeypot field - visually hidden for users, but present for bots */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" autoComplete="off" tabIndex={-1} {...register('company')} />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">İsim</label>
                <input id="name" aria-invalid={errors.name ? 'true' : 'false'} aria-describedby={errors.name ? 'error-name' : undefined} {...register('name')} className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p id="error-name" className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">E-posta</label>
                <input id="email" type="email" aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'error-email' : undefined} {...register('email')} className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p id="error-email" className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Mesaj</label>
                <textarea id="message" aria-invalid={errors.message ? 'true' : 'false'} aria-describedby={errors.message ? 'error-message' : undefined} {...register('message')} className={`w-full border rounded px-3 py-2 h-32 ${errors.message ? 'border-red-500' : ''}`} />
                {errors.message && <p id="error-message" className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <div id="contact-form-error" className="text-red-600" role="alert" aria-live="assertive" />
              <div>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={isSubmitting}>{isSubmitting ? 'Gönderiliyor...' : isSubmitSuccessful ? 'Gönderildi' : 'Gönder'}</button>
              </div>
            </form>
          </section>
          <section>
            <div className="mb-4"> <h3 className="font-medium">Sosyal</h3>
              <ul>{Object.entries(SOCIAL).map(([k, v]) => (<li key={k}><a href={v as string} target="_blank" rel="noreferrer" className="text-blue-600">{k}</a></li>))}</ul>
            </div>
            <div className="w-full h-96 border rounded overflow-hidden" id="yasar-map" ref={mapRef} />
          </section>
        </div>
      </main>
    </Layout>
  );
}
