import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { loadLeaflet } from '@/hooks/useLeafletLoader';
import { MAP_PLACES } from '@/config/mapPlaces';
import { CONTACT, SOCIAL } from '@/config/contactConfig';

type FormState = {
  name: string;
  email: string;
  message: string;
  sending: boolean;
  sent: boolean;
  error?: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '', sending: false, sent: false });
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      if (typeof window === 'undefined') return;
      const L = await loadLeaflet();
      if (!mounted || !mapRef.current) return;

      // narrow to any for runtime leaflet usage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leaflet: any = L;
      if (!leaflet) return;

      const map = leaflet.map(mapRef.current, { zoomControl: true }).setView([41.0, 28.9], 10);
      const tile = process.env.NEXT_PUBLIC_LIGHT_TILE || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      leaflet.tileLayer(tile, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

      try {
        const bounds: [number, number][] = [];
        MAP_PLACES.forEach((p) => {
          if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
          const marker = leaflet.marker([p.lat, p.lng]).addTo(map);
          marker.bindPopup(`<strong>${p.title}</strong><br/>${p.addr || ''}`);
          bounds.push([p.lat, p.lng]);
        });
        if (bounds.length) map.fitBounds(bounds as any, { padding: [40, 40] });
      } catch (e) {
        // ignore
      }
    }

    initMap();
    return () => {
      mounted = false;
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.name || !form.message) return update('error', 'Lütfen tüm alanları doldurun.');
    update('sending', true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message })
      });
      if (!res.ok) throw new Error('Failed');
      update('sent', true);
      setForm({ name: '', email: '', message: '', sending: false, sent: true });
    } catch (err) {
      update('error', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      update('sending', false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>İletişim - Yasar</title>
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-6">Bize Ulaşın</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <p className="mb-4">Her türlü soru, teklif veya iş birliği için aşağıdaki formu doldurun ya da doğrudan iletişim bilgilerini kullanın.</p>
            <div className="mb-6">
              <h3 className="font-medium">Adres</h3>
              <p>{MAP_PLACES?.[0]?.addr ?? ''}</p>
              <h3 className="font-medium mt-3">Telefon</h3>
              <p>{CONTACT.PHONE_MAIN}</p>
              <h3 className="font-medium mt-3">E-posta</h3>
              <p>{CONTACT.EMAIL}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">İsim</label>
                <input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mesaj</label>
                <textarea value={form.message} onChange={(e) => update('message', e.target.value)} className="w-full border rounded px-3 py-2 h-32" />
              </div>

              {form.error && <div className="text-red-600">{form.error}</div>}

              <div>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={form.sending}>
                  {form.sending ? 'Gönderiliyor...' : form.sent ? 'Gönderildi' : 'Gönder'}
                </button>
              </div>
            </form>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-medium">Sosyal</h3>
              <ul>
                {Object.entries(SOCIAL).map(([k, v]) => (
                  <li key={k}>
                    <a href={v as string} target="_blank" rel="noreferrer" className="text-blue-600">{k}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-96 border rounded overflow-hidden" id="yasar-map" ref={mapRef} />
          </section>
        </div>
      </main>
    </Layout>
  );
}

