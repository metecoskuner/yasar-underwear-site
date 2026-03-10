import SEO from '@/components/SEO';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

// note: list items are translated via locale keys below
const sampleCheckKeys = [
  'pages.production.quality.sampleChecks.0',
  'pages.production.quality.sampleChecks.1',
  'pages.production.quality.sampleChecks.2',
  'pages.production.quality.sampleChecks.3',
  'pages.production.quality.sampleChecks.4'
];

const productionCheckKeys = [
  'pages.production.quality.productionChecks.0',
  'pages.production.quality.productionChecks.1',
  'pages.production.quality.productionChecks.2',
  'pages.production.quality.productionChecks.3',
  'pages.production.quality.productionChecks.4'
];

const packingCheckKeys = [
  'pages.production.quality.packingChecks.0',
  'pages.production.quality.packingChecks.1',
  'pages.production.quality.packingChecks.2',
  'pages.production.quality.packingChecks.3',
  'pages.production.quality.packingChecks.4'
];

export default function KaliteSurecleri() {
  const { t, g, lang } = useLanguage();

  // small helper to normalize g() results into an array of strings
  function ensureArray(v: unknown): string[] {
    if (Array.isArray(v)) return v as string[];
    if (v == null) return [];
    if (typeof v === 'string') return [v];
    if (typeof v === 'object') return Object.values(v as Record<string, string>);
    return [];
  }
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <>
  <SEO title={`${t('pages.production.quality.title')} - Yasar`} description={t('pages.production.quality.heroLead')} url="/uretim/kalite-surecleri" />

      {/* remount main content when language changes so motion "whileInView" animations
          and any locale-dependent rendering are re-evaluated and do not remain
          stuck hidden after a language swap */}
      <main key={lang} className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <M.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="rounded-xl bg-gradient-to-r from-slate-50 to-white p-6 md:p-12 mb-8"
        >
          <div className="md:flex md:items-center md:gap-10">
            <M.div variants={item} className="md:flex-1 md:max-w-xl">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{t('pages.production.quality.title')}</h1>
              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">{t('pages.production.quality.heroLead')}</p>

              <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700">{t('pages.production.quality.badges.iso')}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">{t('pages.production.quality.badges.spc')}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">{t('pages.production.quality.badges.experience')}</span>
              </div>
            </M.div>

            <M.div variants={item} className="md:w-1/2 hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md"><div className="relative h-64 md:h-72 lg:h-80">
                <Image src="/photos/PYJAMA-BRANDS.avif" alt={t('pages.production.quality.imageAlt.hero')} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div></div>
            </M.div>
          </div>
        </M.header>

        {/* Feature cards (Modern Product style) */}
        <M.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { titleKey: 'pages.production.quality.features.sample.title', descKey: 'pages.production.quality.features.sample.desc', icon: 'check' },
            { titleKey: 'pages.production.quality.features.production.title', descKey: 'pages.production.quality.features.production.desc', icon: 'factory' },
            { titleKey: 'pages.production.quality.features.packing.title', descKey: 'pages.production.quality.features.packing.desc', icon: 'box' },
            { titleKey: 'pages.production.quality.features.assurance.title', descKey: 'pages.production.quality.features.assurance.desc', icon: 'chart' }
          ].map((f) => (
            <M.article
              key={f.titleKey}
              variants={item}
              className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm hover:shadow-md transition-transform"
            >
              <div className="mb-4">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-100 to-white mb-3" />
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-50 text-slate-700 mb-1">
                  {f.icon === 'check' ? (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path d="M4 10l3 3 9-9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : f.icon === 'factory' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M3 21h18V8l-6 4-4-3-5 4v8z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : f.icon === 'box' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M3 3v18h18" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 14l3-6 4 8 3-10" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>

              <h4 className="font-semibold mb-2 text-slate-800">{t(f.titleKey)}</h4>
              <p className="text-gray-600 text-sm">{t(f.descKey)}</p>
            </M.article>
          ))}
        </M.section>

        {/* Visual checklist */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{t('pages.production.quality.sections.how.title')}</h2>
            <p className="text-gray-700 mb-4">{t('pages.production.quality.sections.how.lead')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('pages.production.quality.sections.sample.title')}</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {sampleCheckKeys.map((k) => (
                    <li key={k} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('pages.production.quality.sections.production.title')}</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {productionCheckKeys.map((k) => (
                    <li key={k} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                        <path d="M2 15a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1z" />
                      </svg>
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t('pages.production.quality.features.assurance.title')}</h3>
            <p className="mt-2 text-gray-700 text-sm">{t('pages.production.quality.features.assurance.desc')}</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {ensureArray(g('pages.production.quality.features.assurance.bullets')).map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">{i === 0 ? '✔' : '⚙'}</span>
                  <span className="text-sm text-gray-700">{b}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Detailed sections */}
        <section className="space-y-8">
          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{t('pages.production.quality.sections.sample.title')}</h3>
            <p className="text-gray-700 mb-4">{t('pages.production.quality.sections.sample.desc')}</p>

              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                  <M.ul variants={container} className="space-y-2">
                    {sampleCheckKeys.map((k) => (
                      <M.li key={k} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-emerald-50/60 rounded-md p-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M4 10l3 3 9-9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{t(k)}</span>
                      </M.li>
                    ))}
                  </M.ul>

                  <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                    <p className="text-sm text-slate-700">{t('pages.production.quality.sample.detail')}</p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-slate-800">{t('pages.production.quality.stats.firstPass')}</span>
                        <span className="text-xs text-slate-600">{t('pages.production.quality.stats.firstPassLabel')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-slate-800">{t('pages.production.quality.stats.sampleReportTime')}</span>
                        <span className="text-xs text-slate-600">{t('pages.production.quality.stats.sampleReportTimeLabel')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 hidden sm:block">
                  <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                    <Image src="/photos/deneme3.jpg" alt="Numune" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                </div>
              </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{t('pages.production.quality.sections.production.title')}</h3>
            <p className="text-gray-700 mb-4">{t('pages.production.quality.sections.production.desc')}</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <M.ol variants={container} className="space-y-2 list-decimal pl-5">
                  {productionCheckKeys.map((k) => (
                    <M.li key={k} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-sky-50/60 rounded-md p-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex-shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M3 11h18" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3 15h10" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{t(k)}</span>
                    </M.li>
                  ))}
                </M.ol>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">{t('pages.production.quality.details.productionNote')}</p>
                </div>
              </div>

              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme1.jpg" alt="Üretim" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{t('pages.production.quality.sections.packing.title')}</h3>
            <p className="text-gray-700 mb-4">{t('pages.production.quality.sections.packing.desc')}</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <M.ul variants={container} className="space-y-2">
                  {packingCheckKeys.map((k) => (
                    <M.li key={k} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-amber-50/60 rounded-md p-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex-shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{t(k)}</span>
                    </M.li>
                  ))}
                </M.ul>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">{t('pages.production.quality.details.packingNote')}</p>
                </div>
              </div>

              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme2.png" alt="Paketleme" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>
        </section>
      </main>
    </>
  );
}
