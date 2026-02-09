import SEO from '@/components/SEO';
import { Fragment } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;



export default function Tesisler() {
  const { t, g, lang } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch (err) {
      void err;
      return fallback;
    }
  };

  const title = tr('uretim.tesis.title', 'Üretim Tesislerimiz');
  const lead = tr(
    'uretim.tesis.lead',
    'Modern, güvenli ve sürdürülebilir bir üretim altyapısı sunuyoruz. Tesislerimizde kalite, çalışan güvenliği ve çevresel sorumluluk eş zamanlı olarak yönetilir; süreçler dijital kayıtlarla izlenir.'
  );

  const tags = [
    tr('uretim.tesis.tags.iso', 'ISO 9001 uyumlu'),
    tr('uretim.tesis.tags.energy', 'Enerji verimliliği'),
    tr('uretim.tesis.tags.spc', 'SPC & izlenebilirlik')
  ];

  const featuresResolved = [
    { title: tr('uretim.tesis.features.modernLines.title', 'Modern Hatlar'), desc: tr('uretim.tesis.features.modernLines.desc', 'Otomatik kesim ve dikim hatları ile verimli üretim.') },
    { title: tr('uretim.tesis.features.qualityLab.title', 'Kalite Laboratuvarı'), desc: tr('uretim.tesis.features.qualityLab.desc', 'Gelişmiş test ve ölçüm laboratuvarları.') },
    { title: tr('uretim.tesis.features.environment.title', 'Çevresel Tedbirler'), desc: tr('uretim.tesis.features.environment.desc', 'Atık yönetimi ve enerji verimliliği uygulamaları.') },
    { title: tr('uretim.tesis.features.training.title', 'Eğitim & Güvenlik'), desc: tr('uretim.tesis.features.training.desc', 'Sürekli eğitim ve iş sağlığı önlemleri.') }
  ];
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } } };
  const getArr = (key: string, fallback: string[]) => {
    try {
      const v = g?.(key);
      if (Array.isArray(v) && v.length > 0) return v as string[];
    } catch (err) {
      void err;
    }
    return fallback;
  };

  return (
    <Fragment>
  <SEO title={`${title} - Yasar`} description={tr('uretim.tesis.lead','Yasar üretim tesisleri, kalite ve sürdürülebilirlik odaklı üretim altyapısı.')} url="/uretim/tesisler" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <M.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="rounded-xl bg-gradient-to-r from-slate-50 to-white p-6 md:p-12 mb-8"
        >
          <div className="md:flex md:items-center md:gap-10">
            <M.div variants={item} className="md:flex-1 md:max-w-xl">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h1>
              <div className="mt-2 text-sm text-gray-500">DEBUG: lang = {lang}</div>
              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">{lead}</p>

              <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700">{tags[0]}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">{tags[1]}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">{tags[2]}</span>
              </div>
            </M.div>

            <M.div variants={item} className="md:w-1/2 hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64 md:h-72 lg:h-80">
                  <Image src="/photos/deneme3.jpg" alt={tr('uretim.tesis.imageAlt','Tesis')} fill className="object-cover" />
                </div>
              </div>
            </M.div>
          </div>
        </M.header>

        <M.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {featuresResolved.map((f) => (
            <M.article key={f.title} variants={item} className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm hover:shadow-md transition-transform">
              <div className="mb-4">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-100 to-white mb-3" />
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-50 text-slate-700 mb-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 12h18" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <h4 className="font-semibold mb-2 text-slate-800">{f.title}</h4>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </M.article>
          ))}
        </M.section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{tr('uretim.tesis.how.title','Nasıl Çalışıyoruz')}</h2>
            <p className="text-gray-700 mb-4">{tr('uretim.tesis.how.lead','Tesislerimizde verimli üretim, çalışan güvenliği ve çevresel sorumluluk bir arada yürütülür. Dijital kayıtlarla izlenebilirlik sağlanır ve süreçler sürekli iyileştirilir.')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{tr('uretim.tesis.infrastructure.title','Altyapı & Makine')}</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {getArr('uretim.tesis.infrastructure.items', [
                    'Otomatik kesim ve dikim hatları',
                    'SPC tabanlı süreç kontrolü',
                    'Enerji verimli makineler'
                  ]).map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </article>

              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{tr('uretim.tesis.training.title','Eğitim & Güvenlik')}</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  {getArr('uretim.tesis.training.items', ['Düzenli personel eğitimleri','İş sağlığı ve güvenliği protokolleri','Geri bildirim mekanizmaları']).map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{tr('uretim.tesis.quality.title','Kalite Güvencesi')}</h3>
            <p className="mt-2 text-gray-700 text-sm">{tr('uretim.tesis.quality.lead','Sürekli izleme, veri kayıtları ve geri bildirim mekanizmaları ile kalite güvencesi sağlanır.')}</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">✔</span>
                <span className="text-sm text-gray-700">{tr('uretim.tesis.quality.bullets.0','ISO 9001 uyumlu süreçler')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-50 text-sky-600">⚙</span>
                <span className="text-sm text-gray-700">{tr('uretim.tesis.quality.bullets.1','SPC ve raporlama')}</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="space-y-8">
          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{tr('uretim.tesis.applications.title','Tesislerde Uygulamalar')}</h3>
            <p className="text-gray-700 mb-4">{tr('uretim.tesis.applications.lead','Tesislerimizde yürütülen başlıca uygulamalar ve dikkat ettiğimiz noktalar aşağıdaki gibidir.')}</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <ul className="space-y-2">
                  {getArr('uretim.tesis.applications.items', ['Otomatik kesim ve kalite takibi','SPC ile proses kontrolü','Atık yönetimi ve su tasarrufu']).map((it, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/50 hover:bg-emerald-50/60 rounded-md p-3">{it}</li>
                  ))}
                </ul>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">{tr('uretim.tesis.applications.summary','Tesis altyapımız verimlilik, iş sağlığı ve çevresel etki odağında tasarlanmıştır. Ölçülebilir hedeflerle enerji tüketimimizi azaltıyor ve atıklarımızı yönetiyoruz.')}</p>
                </div>
              </div>

              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme1.jpg" alt="Tesis Görsel" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{tr('uretim.tesis.training.heading','Çalışan Eğitimi')}</h3>
            <p className="text-gray-700 mb-4">{tr('uretim.tesis.training.lead','Personel eğitimleri ve güvenlik protokolleri düzenli olarak güncellenir ve takip edilir.')}</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                <p className="text-sm text-slate-700">{tr('uretim.tesis.training.body','Personel eğitimleri sektörel en iyi uygulamalar ve yerel protokoller çerçevesinde düzenli olarak yapılır. Güvenlik kültürünü güçlendiriyoruz ve katılımcı geri bildirimleriyle programları geliştiriyoruz.')}</p>
              </div>
              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme3.jpg" alt="Eğitim" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">{tr('uretim.tesis.energy.title','Enerji & Çevre')}</h3>
            <p className="text-gray-700 mb-4">{tr('uretim.tesis.energy.lead','Enerji verimliliği projeleri ve atık azaltma programları tesis operasyonlarımızın parçasıdır.')}</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-700">{tr('uretim.tesis.energy.body','Enerji verimliliği ve su tasarrufu projeleri mevcut; tesis genelinde ölçümler yapılıyor ve düzenli raporlama ile ilerleme izleniyor.')}</p>
              </div>
              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme2.png" alt="Çevre" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>
        </section>
      </main>
    </Fragment>
  );
}
