import SEO from '@/components/SEO';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import LOCATIONS from '@/data/locations';

function flagEmoji(code: string) {
  const map: Record<string, string> = { uk: 'GB' };
  const cc = (map[code] ?? code).toUpperCase();
  if (cc.length !== 2) return '';
  const first = 0x1f1e6 + (cc.charCodeAt(0) - 65);
  const second = 0x1f1e6 + (cc.charCodeAt(1) - 65);
  return String.fromCodePoint(first, second);
}

// Dynamically load the full world map (client-only) — same component used on the homepage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('@/components/WorldMap') as Promise<any>, { ssr: false });

const companyData = {
  title: 'Hakkımızda',
  subtitle:
    'Yasar Tekstil — iç giyimde konfor, kalite ve sürdürülebilir üretim anlayışıyla hizmet veren köklü bir üreticidir.',
  intro: [
    'Türkiye’de modern tesislerde üretim yapan bir aile şirketiyiz. Tasarımdan teslimata kadar tüm süreçlerde kalite ve izlenebilirlik ilkelerini uygularız.',
    'Sürdürülebilir hammadde seçimi, enerji verimliliği ve atık azaltma uygulamaları iş süreçlerimizin merkezindedir.',
    'Takımımız; deneyimli, disiplinli ve sürekli gelişime açık profesyonellerden oluşur. İnsan odaklı yönetim anlayışımız ile güvenilir iş ortaklarıyız.'
  ],
  mission:
    'Müşterilerimize konforlu, dayanıklı ve etik üretimle hazırlanmış iç giyim çözümleri sunmak; iş ortaklarımıza sürdürülebilir değer üretmektir.',
  vision:
    'Ulusal ve uluslararası pazarlarda kalite ve güven denildiğinde ilk akla gelen üreticilerden biri olmak.',
  values: [
    { title: 'Kalite', desc: 'Her aşamada titiz kalite kontrol; uzun ömürlü ürünler.' },
    { title: 'Sürdürülebilirlik', desc: 'Çevresel etkimizi azaltmaya yönelik uygulamalar.' },
    { title: 'Şeffaflık', desc: 'Tedarik zincirinde izlenebilirlik ve dürüst iletişim.' },
    { title: 'İnsan Odaklılık', desc: 'Çalışan güvenliği ve gelişimini ön planda tutmak.' }
  ],
  milestones: [
    { year: '1992', text: 'Kuruluş ve yerel üretime başlama.' },
    { year: '2005', text: 'Modernize edilmiş üretim hattı ve kalite laboratuvarı.' },
    { year: '2017', text: 'Sürdürülebilir ham madde programının başlatılması.' },
    { year: '2023', text: 'Uluslararası iş ortaklıklarının güçlendirilmesi.' }
  ],
  stats: [
    { label: 'Yıllık Üretim (adet)', value: '1M+' },
    { label: 'İhracat Ülkeleri', value: '25+' },
    { label: 'Tesis', value: '2' }
  ]
};

export default function Hakkimizda() {
  return (
    <Fragment>
      <SEO title="Hakkımızda | Yasar Tekstil" description={companyData.subtitle} url="/about" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-white p-8 md:p-12 shadow-sm">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">{companyData.title}</h1>
              <p className="mt-4 text-gray-700 max-w-3xl">{companyData.subtitle}</p>

              {/* visual accent (no product/contact buttons here) */}
              <div className="mt-6">
                <span className="inline-block h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" aria-hidden />
              </div>
            </div>

            <div className="hidden md:block md:ml-8 md:w-2/5">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <dl className="grid grid-cols-3 gap-4 text-center">
                  {companyData.stats.map((s, i) => (
                    <div key={s.label} className="min-w-0">
                      <dt className="text-sm text-gray-500">{s.label}</dt>
                      <dd className="mt-2">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white font-bold text-sm ${
                          i === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : i === 1 ? 'bg-gradient-to-r from-sky-500 to-indigo-500' : 'bg-gray-800'
                        }`}>{s.value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mt-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 prose max-w-none">
            {companyData.intro.map((p, i) => (
              <p key={i} className="text-gray-700">{p}</p>
            ))}
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Hızlı Bilgiler</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li><strong>Kuruluş:</strong> 1992</li>
              <li><strong>Konum:</strong> Marmara Bölgesi, Türkiye</li>
              <li><strong>Sertifikalar:</strong> ISO 9001, BSCI (örnek)</li>
            </ul>
          </aside>
        </section>

        {/* Mission & Vision */}
        <section className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Misyonumuz</h3>
            <p className="text-gray-700">{companyData.mission}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Vizyonumuz</h3>
            <p className="text-gray-700">{companyData.vision}</p>
          </div>
        </section>

        {/* Values */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Değerlerimiz</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyData.values.map((v, idx) => (
              <article key={v.title} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                  idx === 0 ? 'bg-emerald-100 text-emerald-700' : idx === 1 ? 'bg-amber-100 text-amber-700' : idx === 2 ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'
                }`}>{v.title}</div>
                <p className="text-gray-600 flex-1">{v.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Timeline / Milestones */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Kilometre Taşlarımız</h3>
          <ol className="space-y-4">
            {companyData.milestones.map((m) => (
              <li key={m.year} className="flex items-start gap-4">
                <div className="w-20 text-sm font-mono text-gray-500">{m.year}</div>
                <div className="flex-1 flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">{m.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* World map (client-only) */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Global Varlığımız</h3>
          {/* Outer white shell removed so map sits flush with surrounding content */}
          <div className="w-full rounded-lg overflow-hidden">
            <div className="w-full h-64">
              <WorldMap />
            </div>

            {/* Countries list with flags */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">İş yaptığımız ülkeler</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {LOCATIONS.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-3 p-3 rounded-md border border-gray-100 bg-gray-50">
                    <span className="text-2xl" aria-hidden>{flagEmoji(loc.id)}</span>
                    <span className="font-medium text-gray-700">{loc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <p className="text-gray-700">Kurumsal iş birlikleri, OEM talepleri veya fabrikalarımız hakkında daha fazla bilgi almak için bize ulaşın.</p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-semibold">Teklif / İletişim</Link>
          </div>
        </section>
      </main>
    </Fragment>
  );
}