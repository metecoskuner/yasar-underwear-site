import SEO from '@/components/SEO';
import { Fragment } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

const sampleChecks = [
  'Güvence kontrolü',
  'Kalıp kontrolü',
  'Dikim içi ve sonrası kontrolü',
  'Yıkama aşamasında kontroller',
  'Paketleme aşamasındaki kontroller'
];

const productionChecks = [
  'Aksesuar ve kumaş kabul kontrolleri',
  'Kalıp ölçü ve çekme değerlerinin kontrolü',
  'Pastal ve kumaş kontrolü',
  'Kesim sonrası defo ayıklama',
  'Dikim anı ve sonrası kalite raporlaması'
];

const packingChecks = [
  'İplik temizleme kontrolü',
  'Ütü kalite kontrolü',
  'Ölçü kontrolü',
  'Renk kontrolü',
  'Optik kalite kontrol'
];

export default function KaliteSurecleri() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <Fragment>
      <SEO title="Kalite Süreçlerimiz - Yasar" description="Yasar üretiminde Numune, Üretim ve Paketleme aşamalarında uyguladığımız kalite kontrolleri." url="/uretim/kalite-surecleri" />

      <main className="max-w-6xl mx-auto px-6 py-12">
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
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Kalite Kontrol Süreçlerimiz</h1>
              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">Üretimin her aşamasında uyguladığımız sıkı kalite denetimleriyle tutarlı, izlenebilir ve güvenilir ürünler sunuyoruz. Numuneden paketlemeye kadar her adım, kayıt altına alınır ve sürekli iyileştirme ile desteklenir.</p>

              <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700">ISO 9001 uyumlu</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">İzlenebilirlik / SPC</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">30+ yıllık üretim tecrübesi</span>
              </div>
            </M.div>

            <M.div variants={item} className="md:w-1/2 hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md"><div className="relative h-64 md:h-72 lg:h-80">
                <Image src="/photos/PYJAMA-BRANDS.avif" alt="Kalite" fill className="object-cover" />
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
            { title: 'Numune', desc: 'Numune aşamasında ölçü, dikiş ve yıkama değerlendirmeleri.', icon: 'check' },
            { title: 'Üretim', desc: 'Kesim ve dikim süreçlerinde sürekli kontroller.', icon: 'factory' },
            { title: 'Paketleme', desc: 'Ambalaj öncesi son kontroller ve etiketleme.', icon: 'box' },
            { title: 'Kalite Güvencesi', desc: 'SPC, raporlama ve izlenebilirlikle sürekli iyileştirme.', icon: 'chart' }
          ].map((f) => (
            <M.article
              key={f.title}
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

              <h4 className="font-semibold mb-2 text-slate-800">{f.title}</h4>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </M.article>
          ))}
        </M.section>

        {/* Visual checklist */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Nasıl Çalışıyoruz</h2>
            <p className="text-gray-700 mb-4">Aşağıda kalite kontrol süreçlerimizin ana başlıklarını ve uygulama örneklerini bulabilirsiniz. Her adımda standart prosedürler (SOP) uygulanır ve kayıt altına alınır.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Numune Aşaması</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {sampleChecks.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Üretim Aşaması</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {productionChecks.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                        <path d="M2 15a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1z" />
                      </svg>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Kalite Güvencesi</h3>
            <p className="mt-2 text-gray-700 text-sm">Sürekli izleme, veri kayıtları ve geri bildirim mekanizmaları ile kalite güvencesini sağlar; gerektiğinde geri çağırma ve düzeltici faaliyet prosedürleri uygulanır.</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">✔</span>
                <span className="text-sm text-gray-700">ISO 9001 uyumlu süreçler</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-50 text-sky-600">⚙</span>
                <span className="text-sm text-gray-700">SPC ve raporlama</span>
              </div>
            </div>
          </aside>
        </section>

        {/* Detailed sections */}
        <section className="space-y-8">
          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">Numune Aşamasında</h3>
            <p className="text-gray-700 mb-4">Numune aşamasında aşağıdaki maddeler en ince detayına kadar incelenir:</p>

              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                  <M.ul variants={container} className="space-y-2">
                    {sampleChecks.map((s) => (
                      <M.li key={s} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-emerald-50/60 rounded-md p-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M4 10l3 3 9-9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{s}</span>
                      </M.li>
                    ))}
                  </M.ul>

                  <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                    <p className="text-sm text-slate-700">Numune aşamasında yapılan ölçümler, yıkama testleri ve dikiş kontrolleri ürünün seri üretime hazır olduğundan emin olmamıza yardımcı olur. Numunelerimiz genellikle 3 iş günü içinde raporlanır ve gerekli düzeltmeler hızlıca uygulanır.</p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-slate-800">98%</span>
                        <span className="text-xs text-slate-600">Ortalama ilk-pass oranı</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-semibold text-slate-800">3 gün</span>
                        <span className="text-xs text-slate-600">Numune raporlama süresi</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 hidden sm:block">
                  <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                    <Image src="/photos/deneme3.jpg" alt="Numune" fill className="object-cover" />
                  </div>
                </div>
              </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">Üretim Aşamasında</h3>
            <p className="text-gray-700 mb-4">Üretim boyunca kaliteyi sağlamak için planlama, kesim ve dikim adımlarında özel kontroller yürütülür:</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <M.ol variants={container} className="space-y-2 list-decimal pl-5">
                  {productionChecks.map((s) => (
                    <M.li key={s} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-sky-50/60 rounded-md p-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex-shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M3 11h18" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3 15h10" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{s}</span>
                    </M.li>
                  ))}
                </M.ol>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">Üretim hattında gerçek zamanlı kontroller ve operatör eğitimleri sayesinde proses sapmaları minimize edilir. Kritik kontrol noktalarında örnekleme ile veriler düzenli olarak raporlanır.</p>
                </div>
              </div>

              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme1.jpg" alt="Üretim" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">Paketleme Aşamasında</h3>
            <p className="text-gray-700 mb-4">Son aşamada ambalaj öncesi ve ambalaj sırasında uyguladığımız kontroller:</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <M.ul variants={container} className="space-y-2">
                  {packingChecks.map((s) => (
                    <M.li key={s} variants={item} whileHover={{ x: 2 }} className="flex items-start gap-3 bg-white/50 hover:bg-amber-50/60 rounded-md p-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex-shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{s}</span>
                    </M.li>
                  ))}
                </M.ul>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">Paketleme aşamasında ambalaj malzemesi ve etiketleme kontrolleri, lojistik süreçlerinin hata oranını azaltır. Sevkiyat öncesi son kontroller titizlikle uygulanır.</p>
                </div>
              </div>

              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme2.png" alt="Paketleme" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>
        </section>
      </main>
    </Fragment>
  );
}
