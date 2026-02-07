import SEO from '@/components/SEO';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import LOCATIONS from '@/data/locations';
import { useLanguage } from '@/contexts/LanguageContext';

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

// Content is sourced from translations so the page updates with the language selector

export default function Hakkimizda() {
  const { t } = useLanguage();

  const title = t('pages.about.hero.title');
  const subtitle = t('pages.about.hero.desc');

  const intro = [
    t('pages.about.intro.p1'),
    t('pages.about.intro.p2'),
    t('pages.about.intro.p3')
  ];

  const mission = t('pages.about.mission');
  const vision = t('pages.about.vision');

  const values = [
    { title: t('pages.about.values.design.title'), desc: t('pages.about.values.design.body') },
    { title: t('pages.about.values.facilities.title'), desc: t('pages.about.values.facilities.body') },
    { title: t('pages.about.values.responsibility.title'), desc: t('pages.about.values.responsibility.body') },
    { title: t('pages.about.values.human.title'), desc: t('pages.about.values.human.body') }
  ];

  const milestones = [
    { year: '1992', text: t('pages.about.milestones.1992') },
    { year: '2005', text: t('pages.about.milestones.2005') },
    { year: '2017', text: t('pages.about.milestones.2017') },
    { year: '2023', text: t('pages.about.milestones.2023') }
  ];

  const stats = [
    { label: t('pages.about.stats.production'), value: '1M+' },
    { label: t('pages.about.stats.exports'), value: '25+' },
    { label: t('pages.about.stats.facilities'), value: '2' }
  ];

  return (
    <Fragment>
      <SEO title={`${t('pages.about.title')} | Yasar Tekstil`} description={subtitle} url="/about" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-white p-8 md:p-12 shadow-sm">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">{title}</h1>
              <p className="mt-4 text-gray-700 max-w-3xl">{subtitle}</p>

              {/* visual accent (no product/contact buttons here) */}
              <div className="mt-6">
                <span className="inline-block h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" aria-hidden />
              </div>
            </div>

            <div className="hidden md:block md:ml-8 md:w-2/5">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <dl className="grid grid-cols-3 gap-4 text-center">
                  {stats.map((s, i) => (
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
            {intro.map((p, i) => (
              <p key={i} className="text-gray-700">{p}</p>
            ))}
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t('pages.about.quick.title')}</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li><strong>{t('pages.about.quick.labels.foundation') || 'Kuruluş:'}</strong> 1992</li>
              <li><strong>{t('pages.about.quick.labels.location') || 'Konum:'}</strong> Marmara Bölgesi, Türkiye</li>
              <li><strong>{t('pages.about.quick.labels.certificates') || 'Sertifikalar:'}</strong> ISO 9001, BSCI (örnek)</li>
            </ul>
          </aside>
        </section>

        {/* Mission & Vision */}
        <section className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">{t('pages.about.headings.mission') || 'Misyonumuz'}</h3>
            <p className="text-gray-700">{mission}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">{t('pages.about.headings.vision') || 'Vizyonumuz'}</h3>
            <p className="text-gray-700">{vision}</p>
          </div>
        </section>

        {/* Values */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">{t('pages.about.headings.values') || 'Değerlerimiz'}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
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
          <h3 className="text-2xl font-bold mb-6">{t('pages.about.headings.milestones') || 'Kilometre Taşlarımız'}</h3>
          <ol className="space-y-4">
            {milestones.map((m) => (
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
          <h3 className="text-2xl font-bold mb-6">{t('pages.about.headings.global') || 'Global Varlığımız'}</h3>
          {/* Outer white shell removed so map sits flush with surrounding content */}
          <div className="w-full rounded-lg overflow-hidden">
            <div className="w-full h-64">
              <WorldMap />
            </div>

            {/* Countries list with flags */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">{t('pages.about.headings.countries') || 'İş yaptığımız ülkeler'}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {LOCATIONS.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-3 p-3 rounded-md border border-gray-100 bg-gray-50">
                    <span className="text-2xl" aria-hidden>{flagEmoji(loc.id)}</span>
                    <span className="font-medium text-gray-700">{(() => {
                      switch (loc.id) {
                        case 'tr':
                          return t('locations.tr');
                        case 'uk':
                          return t('locations.uk');
                        case 'de':
                          return t('locations.de');
                        case 'ro':
                          return t('locations.ro');
                        case 'kw':
                          return t('locations.kw');
                        case 'ly':
                          return t('locations.ly');
                        case 'nl':
                          return t('locations.nl');
                        case 'fr':
                          return t('locations.fr');
                        case 'us':
                          return t('locations.us');
                        default:
                          return loc.name;
                      }
                    })()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <p className="text-gray-700">{t('pages.about.contactPrompt')}</p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-semibold">{t('pages.about.collab.cta') || 'Teklif / İletişim'}</Link>
          </div>
        </section>
      </main>
    </Fragment>
  );
}