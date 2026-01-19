import SEO from '@/components/SEO';
import { Fragment } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

const features = [
  { title: 'Modern Hatlar', desc: 'Otomatik kesim ve dikim hatları ile verimli üretim.' },
  { title: 'Kalite Laboratuvarı', desc: 'Gelişmiş test ve ölçüm laboratuvarları.' },
  { title: 'Çevresel Tedbirler', desc: 'Atık yönetimi ve enerji verimliliği uygulamaları.' },
  { title: 'Eğitim & Güvenlik', desc: 'Sürekli eğitim ve iş sağlığı önlemleri.' }
];

export default function Tesisler() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } } };

  return (
    <Fragment>
      <SEO title="Üretim Tesislerimiz - Yasar" description="Yasar üretim tesisleri, kalite ve sürdürülebilirlik odaklı üretim altyapısı." url="/uretim/tesisler" />

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
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Üretim Tesislerimiz</h1>
              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">Modern, güvenli ve sürdürülebilir bir üretim altyapısı sunuyoruz. Tesislerimizde kalite, çalışan güvenliği ve çevresel sorumluluk eş zamanlı olarak yönetilir; süreçler dijital kayıtlarla izlenir.</p>

              <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700">ISO 9001 uyumlu</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">Enerji verimliliği</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-700">SPC & izlenebilirlik</span>
              </div>
            </M.div>

            <M.div variants={item} className="md:w-1/2 hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64 md:h-72 lg:h-80">
                  <Image src="/photos/deneme3.jpg" alt="Tesis" fill className="object-cover" />
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
          {features.map((f) => (
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
            <h2 className="text-2xl font-bold mb-4">Nasıl Çalışıyoruz</h2>
            <p className="text-gray-700 mb-4">Tesislerimizde verimli üretim, çalışan güvenliği ve çevresel sorumluluk bir arada yürütülür. Dijital kayıtlarla izlenebilirlik sağlanır ve süreçler sürekli iyileştirilir.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Altyapı & Makine</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>Otomatik kesim ve dikim hatları</li>
                  <li>SPC tabanlı süreç kontrolü</li>
                  <li>Enerji verimli makineler</li>
                </ul>
              </article>

              <article className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Eğitim & Güvenlik</h3>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>Düzenli personel eğitimleri</li>
                  <li>İş sağlığı ve güvenliği protokolleri</li>
                  <li>Geri bildirim mekanizmaları</li>
                </ul>
              </article>
            </div>
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Kalite Güvencesi</h3>
            <p className="mt-2 text-gray-700 text-sm">Sürekli izleme, veri kayıtları ve geri bildirim mekanizmaları ile kalite güvencesi sağlanır.</p>

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

        <section className="space-y-8">
          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">Tesislerde Uygulamalar</h3>
            <p className="text-gray-700 mb-4">Tesislerimizde yürütülen başlıca uygulamalar ve dikkat ettiğimiz noktalar aşağıdaki gibidir.</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 bg-white/50 hover:bg-emerald-50/60 rounded-md p-3">Otomatik kesim ve kalite takibi</li>
                  <li className="flex items-start gap-3 bg-white/50 hover:bg-sky-50/60 rounded-md p-3">SPC ile proses kontrolü</li>
                  <li className="flex items-start gap-3 bg-white/50 hover:bg-amber-50/60 rounded-md p-3">Atık yönetimi ve su tasarrufu</li>
                </ul>

                <div className="mt-4 bg-slate-50 rounded-md p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">Tesis altyapımız verimlilik, iş sağlığı ve çevresel etki odağında tasarlanmıştır. Ölçülebilir hedeflerle enerji tüketimimizi azaltıyor ve atıklarımızı yönetiyoruz.</p>
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
            <h3 className="text-xl font-bold mb-3">Çalışan Eğitimi</h3>
            <p className="text-gray-700 mb-4">Personel eğitimleri ve güvenlik protokolleri düzenli olarak güncellenir ve takip edilir.</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-700">Personel eğitimleri sektörel en iyi uygulamalar ve yerel protokoller çerçevesinde düzenli olarak yapılır. Güvenlik kültürünü güçlendiriyoruz ve katılımcı geri bildirimleriyle programları geliştiriyoruz.</p>
              </div>
              <div className="md:col-span-1 hidden sm:block">
                <div className="rounded-md overflow-hidden shadow-md h-44 md:h-full">
                  <Image src="/photos/deneme3.jpg" alt="Eğitim" fill className="object-cover" />
                </div>
              </div>
            </div>
          </M.div>

          <M.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative bg-white rounded-lg p-6 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-3">Enerji & Çevre</h3>
            <p className="text-gray-700 mb-4">Enerji verimliliği projeleri ve atık azaltma programları tesis operasyonlarımızın parçasıdır.</p>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-700">Enerji verimliliği ve su tasarrufu projeleri mevcut; tesis genelinde ölçümler yapılıyor ve düzenli raporlama ile ilerleme izleniyor.</p>
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
