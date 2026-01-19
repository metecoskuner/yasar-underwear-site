import SEO from '@/components/SEO';
import Image from 'next/image';
import { motion } from 'framer-motion';
// Framer Motion typing in this project is a bit strict for intrinsic elements.
// Use a small `any` helper to avoid TS issues when applying `className` to motion elements.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function SustPage() {
  return (
    <>
      <SEO title="Sürdürülebilirlik - Yasar" description="Yasar'ın üretim süreçlerindeki çevre, kalite ve insan odaklı sürdürülebilirlik yaklaşımı." url="/surdurulebilirlik" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <M.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={item} className="relative rounded-xl overflow-hidden shadow-lg mb-10">
          <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-amber-50 to-rose-50">
            <Image src="/photos/sustainability-410.svg" alt="Sürdürülebilirlik görseli" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70" />

            {/* decorative accent */}
            <svg className="absolute right-6 top-6 opacity-30 w-40 h-40 transform rotate-12" viewBox="0 0 100 100" fill="none" aria-hidden>
              <circle cx="50" cy="50" r="40" fill="url(#g)" />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff7ed" />
                  <stop offset="1" stopColor="#fff1f2" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 flex">
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black">Sürdürülebilirlik</h1>
                  <p className="mt-3 text-black/70 max-w-2xl">Çevresel, sosyal ve ekonomik sorumlulukları işimizin merkezine alıyoruz. Üretimden tedarike kadar yaptığımız her adımda sürdürülebilir çözümler uyguluyoruz.</p>
                  {/* No action buttons on this page by request */}
                </div>
              </div>
            </div>
          </div>
        </M.div>

        {/* Micro-metrics row under hero */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="mt-6 mb-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 justify-center">
              <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">10+ yıldır sürdürülebilir üretim</span>
              </M.div>

              <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">20+ tedarikçi denetimi / yıl</span>
              </M.div>

              <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">%30 daha az atık</span>
              </M.div>
            </div>
          </div>
        </M.div>

        {/* Three pillars */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="grid gap-6 md:grid-cols-3 mb-12">
          <M.article variants={item} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <div className="h-12 w-12 rounded-md bg-amber-100 flex items-center justify-center text-amber-600 mb-3">
              {/* leaf icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 7 3 11 3 15c0 3.866 3.582 7 9 7 1.333 0 2.667-.333 4-1.001V13.5C18 11 14 6 12 2z"/></svg>
            </div>
            <h3 className="font-semibold">Çevre Yönetimi</h3>
            <p className="mt-2 text-sm text-gray-600">Enerji ve su verimliliği, atık azaltma ve geri dönüşüm projeleri ile çevresel etkimizi azaltıyoruz.</p>
          </M.article>

          <M.article variants={item} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
            <div className="h-12 w-12 rounded-md bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
              {/* shield icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>
            </div>
            <h3 className="font-semibold">İş Sağlığı & Güvenlik</h3>
            <p className="mt-2 text-sm text-gray-600">Çalışan güvenliğini önceliyoruz: eğitimler, denetimler ve iyileştirme süreçleri düzenli olarak yapılıyor.</p>
          </M.article>

          <M.article variants={item} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            <div className="h-12 w-12 rounded-md bg-sky-100 flex items-center justify-center text-sky-600 mb-3">
              {/* handshake icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13v6a1 1 0 0 1-1 1h-5l-3-3-3 3H4a1 1 0 0 1-1-1v-6"/></svg>
            </div>
            <h3 className="font-semibold">Tedarikçi Sorumluluğu</h3>
            <p className="mt-2 text-sm text-gray-600">Tedarikçilerimizle yakın çalışıyor, etik ve çevresel standartlara uyumu sağlıyoruz.</p>
          </M.article>
        </M.div>

        {/* Details & visuals */}
        <M.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={container} className="grid gap-8 md:grid-cols-2 items-start mb-12">
          <M.div variants={item} className="space-y-4">
            <h2 className="text-2xl font-semibold">Nasıl çalışıyoruz</h2>
            <p className="text-gray-700">Ham maddeden nihai ürüne kadar süreçlerimizi optimize ederek çevresel ayak izimizi küçültmeyi hedefliyoruz. Süreçlerimizde şeffaflık, izlenebilirlik ve sürekli iyileştirme esas alınır.</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Enerji & su tüketiminde ölçüm ve iyileştirme</li>
              <li>Atıkların ayrıştırılması ve geri dönüşüm akışları</li>
              <li>Tedarikçi denetimleri ve sosyal uyumluluk</li>
            </ul>
          </M.div>

          <M.div variants={item} className="rounded-lg overflow-hidden shadow-sm">
            <Image src="/photos/sustainability-411.svg" alt="Sürdürülebilirlik görsel 2" width={900} height={600} className="object-cover w-full h-56 md:h-72" />
          </M.div>
  </M.div>

        {/* Cards */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="grid gap-6 md:grid-cols-3 mb-12">
          {[
            { title: 'Atık Yönetimi', text: 'Kaynağında ayrıştırma, lisanslı bertaraf ve geri dönüşüm çalışmaları.' },
            { title: 'Enerji Verimliliği', text: 'Tesislerde enerji tüketimi optimizasyonu ve yenilenebilir enerji adımları.' },
            { title: 'Sertifikasyon', text: 'Ulusal ve uluslararası standartlara uygun üretim süreçleri.' },
          ].map((c) => (
            <M.article key={c.title} variants={item} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold">{c.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{c.text}</p>
            </M.article>
          ))}
        </M.div>

        {/* Neutral footer note (no contact CTA on this page) */}
        <M.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={item} className="text-center">
          <p className="text-gray-700">Sürdürülebilirlik girişimlerimiz, raporlarımız ve güncellemeler için siteyi takip edebilirsiniz.</p>
        </M.div>
      </main>
    </>
  );
}
