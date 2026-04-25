import SEO from '@/components/SEO'
import { CONTACT } from '@/config/contactConfig'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import LOCATIONS from '@/data/locations'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yasarunderwear.com').replace(/\/$/, '')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('@/components/WorldMap') as Promise<any>, { ssr: false })

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const staggerGroup = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

function flagEmoji(code: string) {
  const map: Record<string, string> = { uk: 'GB' }
  const cc = (map[code] ?? code).toUpperCase()
  if (cc.length !== 2) return ''
  const first = 0x1f1e6 + (cc.charCodeAt(0) - 65)
  const second = 0x1f1e6 + (cc.charCodeAt(1) - 65)
  return String.fromCodePoint(first, second)
}

export default function About() {
  return <AboutPage canonicalUrl="/about" />
}

type AboutPageProps = {
  canonicalUrl?: string
}

export function AboutPage({ canonicalUrl = '/about' }: AboutPageProps) {
  const { t } = useLanguage()
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key)
      return v === key ? fallback : v
    } catch {
      return fallback
    }
  }

  const countryLabel = (id: string, fallback: string) => {
    const v = tr(`locations.${id}`, fallback)
    return v.trim() || fallback
  }

  const highlights = [
    { value: '1M+', label: tr('pages.about.stats.production', 'Yıllık Üretim') },
    { value: '25+', label: tr('pages.about.stats.exports', 'İhracat Ülkeleri') },
    { value: '2', label: tr('pages.about.stats.facilities', 'Tesis') },
  ]

  const pillars = [
    {
      title: tr('pages.about.values.design.title', 'Tasarım & Konfor'),
      body: tr('pages.about.values.design.body', 'İyi tasarım, dayanıklılık ve kullanım rahatlığı bir arada.'),
    },
    {
      title: tr('pages.about.values.facilities.title', 'Modern Tesisler'),
      body: tr('pages.about.values.facilities.body', 'Enerji verimli, izlenebilir üretim altyapısı.'),
    },
    {
      title: tr('pages.about.values.responsibility.title', 'Sosyal Sorumluluk'),
      body: tr('pages.about.values.responsibility.body', 'Çalışan sağlığı, adil ücretlendirme ve çevresel önlemler.'),
    },
  ]

  const operationalPoints = [
    tr('pages.about.profile.point1', 'Tasarım, üretim ve teslimat akışını tek operasyon disiplini altında yönetiyoruz.'),
    tr('pages.about.profile.point2', 'Kurumsal müşteriler için izlenebilir, planlı ve sürdürülebilir bir üretim modeli sunuyoruz.'),
    tr('pages.about.profile.point3', 'OEM, private label ve toptan sipariş süreçlerine uygun esnek altyapıyla çalışıyoruz.'),
  ]

  const overviewDetails = [
    { label: tr('pages.about.quick.foundation', 'Kuruluş'), value: '1969' },
    { label: tr('pages.about.quick.location', 'Konum'), value: tr('pages.about.quick.locationValue', 'Marmara Bölgesi, Türkiye') },
    { label: tr('pages.about.quick.certificates', 'Sertifikalar'), value: 'ISO 9001, BSCI' },
  ]

  const marketChips = LOCATIONS.map((loc) => ({
    id: loc.id,
    flag: flagEmoji(loc.id),
    label: countryLabel(loc.id, loc.name),
  }))

  return (
    <>
      <SEO
        title={tr('pages.about.title', 'Kurumsal - Yasar')}
        description={tr('pages.about.description', 'Yasar Tekstil hakkında, misyonumuz, vizyonumuz ve üretim altyapımız.')}
        url={canonicalUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: tr('pages.about.orgName', 'Yasar'),
          url: SITE_URL,
          telephone: CONTACT.PHONE_MAIN,
          email: CONTACT.EMAIL,
        }}
      />

      <main className="bg-[linear-gradient(180deg,#f5f2ea_0%,#fbfaf7_22%,#ffffff_100%)]">
        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(15,118,110,0.12),_transparent_26%)]" />
          <div className="absolute left-0 right-0 top-0 h-[34rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0)_45%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-amber-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700 backdrop-blur">
                {tr('pages.about.hero.title', 'Kurumsal')}
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.2rem] lg:leading-[1.03]">
                  {tr('pages.about.hero.heading', 'Türkiye’den global markalara düzenli, izlenebilir iç giyim üretimi.')}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {tr('pages.about.hero.desc', 'Yasar olarak kalite, sürdürülebilirlik ve çalışan refahını merkeze alan üretim süreçleri ile iç giyim sektöründe öne çıkıyoruz. Türkiye’deki tesislerimizde modern üretim teknikleriyle dünya standartlarında ürünler geliştiriyoruz.')}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/uretim/tesisler" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                    {tr('pages.about.hero.ctaFacilitiesInspect', 'Üretim Altyapısını İnceleyin')}
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                    {tr('pages.about.collab.cta', 'İletişime Geç')}
                  </Link>
                </div>

                <M.div variants={staggerGroup} initial="hidden" animate="visible" className="mt-10 grid gap-3 sm:grid-cols-3">
                  {highlights.map((item, index) => (
                    <M.div
                      key={item.label}
                      variants={sectionReveal}
                      whileHover={{ y: -4 }}
                      className={`rounded-[24px] border p-4 shadow-sm transition ${index === 0 ? 'border-amber-200 bg-amber-50/80' : 'border-stone-200 bg-white/95'}`}
                    >
                      <div className="text-3xl font-semibold tracking-tight text-slate-950">{item.value}</div>
                      <div className="mt-2 text-sm text-slate-600">{item.label}</div>
                    </M.div>
                  ))}
                </M.div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {marketChips.slice(0, 8).map((item) => (
                    <div key={item.id} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/85 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                      <span aria-hidden>{item.flag}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-amber-300/30 blur-2xl lg:block" />
                <div className="absolute -right-6 bottom-8 hidden h-28 w-28 rounded-full bg-teal-300/20 blur-2xl lg:block" />
                <div className="overflow-hidden rounded-[36px] border border-white/80 bg-white shadow-[0_40px_90px_-40px_rgba(15,23,42,0.35)]">
                  <div className="relative h-72 sm:h-80 lg:h-[25rem]">
                    <Image
                      src="/photos/loom-threads-unsplash.jpg"
                      alt={tr('pages.about.imageAlt', 'Üretim Tesisleri')}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="border-t border-stone-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.about.overview.title', 'Genel Bakış')}</p>
                    <div className="mt-4 space-y-3">
                      {overviewDetails.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-right text-sm font-medium text-slate-800">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-[22px] bg-stone-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{tr('pages.about.overview.operationEyebrow', 'Operasyon')}</div>
                      <div className="mt-2 text-sm font-medium leading-6 text-slate-700">{tr('pages.about.overview.operationBody', 'OEM, private label ve toptan sipariş süreçleri için yapılandırılmış üretim akışı.')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.about.profile.eyebrow', 'Profil')}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{tr('pages.about.profile.title', 'Uzun vadeli üretim partnerliği için düzenli ve okunaklı operasyon yapısı.')}</h2>
              <div className="mt-6 space-y-4">
                {operationalPoints.map((point, index) => (
                  <div key={point} className="flex gap-4 rounded-[22px] bg-stone-50 px-4 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-sm">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/uretim/tesisler" className="inline-flex items-center rounded-full bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600">
                  {tr('pages.about.cta.facilities', 'Tesislerimiz')}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">{tr('pages.about.quality.eyebrow', 'Kalite')}</div>
                  <div className="mt-3 text-xl font-semibold">{tr('pages.about.quality.title', 'Standart odaklı üretim disiplini')}</div>
                  <div className="mt-3 text-sm leading-6 text-white/70">{tr('pages.about.quality.body', 'Kontrol, takip ve tekrar edilebilir kaliteyi merkezde tutan işleyiş.')}</div>
                </div>
                <div className="rounded-[28px] bg-amber-50 p-6 text-slate-900 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{tr('pages.about.capacity.eyebrow', 'Kapasite')}</div>
                  <div className="mt-3 text-xl font-semibold">{tr('pages.about.capacity.title', 'Planlı teslim, ölçeklenebilir operasyon')}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-600">{tr('pages.about.capacity.body', 'Kurumsal partnerler için düzenli ve sürdürülebilir üretim akışı.')}</div>
                </div>
              </div>
              <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.about.values.eyebrow', 'Değerler')}</p>
                <M.div variants={staggerGroup} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-5 grid gap-4 sm:grid-cols-3">
                  {pillars.map((item, index) => (
                    <M.article
                      key={item.title}
                      variants={sectionReveal}
                      whileHover={{ y: -5 }}
                      className={`rounded-[24px] border p-5 shadow-sm transition ${index === 1 ? 'border-teal-200 bg-teal-50/50' : 'border-stone-200 bg-white'}`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">0{index + 1}</div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                    </M.article>
                  ))}
                </M.div>
              </div>
            </div>
          </div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.about.export.eyebrow', 'İhracat Ağı')}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{tr('pages.about.headings.global', 'Global Varlığımız')}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {tr('pages.about.export.lead', 'Amerika, Avrupa ve Orta Doğu pazarlarında aktif iş ortaklıklarıyla çalışıyoruz. Satış yapılan ülkelerin tamamı aşağıda listelenir.')}
              </p>
            </div>

            <div className="h-[22rem] border-b border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] sm:h-[26rem] lg:h-[32rem]">
              <WorldMap />
            </div>

            <div className="bg-[linear-gradient(180deg,#fffaf0_0%,#f7f1e6_100%)] px-6 py-6 text-slate-950">
              <div className="flex flex-col gap-3 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{tr('pages.about.headings.countries', 'İş yaptığımız ülkeler')}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    {tr('pages.about.countries.lead', 'Avrupa, Orta Doğu ve Amerika pazarlarında aktif müşteri ve iş ortaklığı ağı ile çalışıyoruz.')}
                  </p>
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {tr('pages.about.countries.activeMarkets', '{count}+ aktif pazar').replace('{count}', String(LOCATIONS.length))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {LOCATIONS.map((loc) => (
                  <M.div
                    key={loc.id}
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition"
                  >
                    <span className="text-2xl" aria-hidden>{flagEmoji(loc.id)}</span>
                    <span className="text-sm font-medium text-slate-800">{countryLabel(loc.id, loc.name)}</span>
                  </M.div>
                ))}
              </div>
            </div>
          </div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="rounded-[36px] border border-amber-200 bg-[linear-gradient(135deg,#fffaf0_0%,#f6efe2_100%)] p-8 text-slate-950 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.14)] sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{tr('pages.about.collab.eyebrow', 'İş Birliği')}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">{tr('pages.about.collab.heading', 'Kurumsal iş birlikleri, OEM talepleri ve üretim görüşmeleri için hazırız.')}</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  {tr('pages.about.collab.body', 'Saha ziyaretleri, teknik sorular veya büyük hacimli sipariş talepleri için doğrudan iletişime geçebilirsiniz.')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/about/hakkimizda" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-50">
                  {tr('pages.about.collab.detailCta', 'Hakkımızda Detayı')}
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                  {tr('pages.about.collab.cta', 'İletişime Geç')}
                </Link>
              </div>
            </div>
          </div>
        </M.section>
      </main>
    </>
  )
}
