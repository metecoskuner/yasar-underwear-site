import Link from 'next/link';
import SEO from '@/components/SEO';

export default function UretimIndex() {
  return (
    <>
      <SEO title="Üretim - Yasar" description="Üretim sayfası - tesisler ve kalite süreçleri" url="/uretim" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold">Üretim</h1>
          <p className="mt-2 text-gray-600">Tesislerimiz ve kalite süreçlerimiz hakkında bilgi almak için aşağıdaki bağlantılara göz atın.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Link href="/uretim/tesisler" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold">Üretim Tesislerimiz</h2>
            <p className="mt-2 text-gray-600">Tesis altyapımız, kapasitelerimiz ve kalite odaklı üretim yaklaşımımız hakkında bilgi.</p>
          </Link>

          <Link href="/uretim/kalite-surecleri" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold">Kalite Süreçlerimiz</h2>
            <p className="mt-2 text-gray-600">Kalite kontrol, test ve sertifikasyon süreçlerimiz ile ilgili detaylar.</p>
          </Link>
        </section>
      </main>
    </>
  );
}
