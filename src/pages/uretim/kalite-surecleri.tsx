import SEO from '@/components/SEO'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion

const sampleCheckKeys = [
  'pages.production.quality.sampleChecks.0',
  'pages.production.quality.sampleChecks.1',
  'pages.production.quality.sampleChecks.2',
  'pages.production.quality.sampleChecks.3',
  'pages.production.quality.sampleChecks.4',
]

const productionCheckKeys = [
  'pages.production.quality.productionChecks.0',
  'pages.production.quality.productionChecks.1',
  'pages.production.quality.productionChecks.2',
  'pages.production.quality.productionChecks.3',
  'pages.production.quality.productionChecks.4',
]

const packingCheckKeys = [
  'pages.production.quality.packingChecks.0',
  'pages.production.quality.packingChecks.1',
  'pages.production.quality.packingChecks.2',
  'pages.production.quality.packingChecks.3',
  'pages.production.quality.packingChecks.4',
]

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const staggerGroup = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export default function KaliteSurecleri() {
  const { t, g } = useLanguage()

  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key)
      return value === key ? fallback : value
    } catch {
      return fallback
    }
  }

  const ensureArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v as string[]
    if (v == null) return []
    if (typeof v === 'string') return [v]
    if (typeof v === 'object') return Object.values(v as Record<string, string>)
    return []
  }

  const title = tr('pages.production.quality.title', 'Kalite Süreçlerimiz')
  const heroLead = tr(
    'pages.production.quality.heroLead',
    'Üretimin her aşamasında uyguladığımız sıkı kalite denetimleriyle tutarlı, izlenebilir ve güvenilir ürünler sunuyoruz.'
  )

  const highlights = [
    { value: tr('pages.production.quality.stats.firstPass', '98%'), label: tr('pages.production.quality.stats.firstPassLabel', 'İlk Geçiş Uygunluk') },
    { value: tr('pages.production.quality.stats.sampleReportTime', '24s'), label: tr('pages.production.quality.stats.sampleReportTimeLabel', 'Numune Raporlama') },
    { value: '3', label: tr('pages.production.quality.stats.stages', 'Kontrol Aşaması') },
  ]

  const phaseCards = [
    {
      title: tr('pages.production.quality.features.sample.title', 'Numune Kontrolü'),
      desc: tr('pages.production.quality.features.sample.desc', 'İlk onay aşamasında ölçü, dikiş ve malzeme uygunluğu denetlenir.'),
    },
    {
      title: tr('pages.production.quality.features.production.title', 'Üretim Kontrolleri'),
      desc: tr('pages.production.quality.features.production.desc', 'Üretim akışında belirlenen kritik noktalarda düzenli kontroller yapılır.'),
    },
    {
      title: tr('pages.production.quality.features.packing.title', 'Paketleme Kontrolü'),
      desc: tr('pages.production.quality.features.packing.desc', 'Son ürün, etiket, ambalaj ve sevkiyat hazırlığı aşamasında doğrulanır.'),
    },
    {
      title: tr('pages.production.quality.features.assurance.title', 'Kalite Güvencesi'),
      desc: tr('pages.production.quality.features.assurance.desc', 'Tüm bulgular kayıt altına alınır ve sürekli iyileştirme döngüsüne dahil edilir.'),
    },
  ]

  const assuranceBullets = ensureArray(g('pages.production.quality.features.assurance.bullets'))

  const sampleChecks = sampleCheckKeys.map((key) => t(key))
  const productionChecks = productionCheckKeys.map((key) => t(key))
  const packingChecks = packingCheckKeys.map((key) => t(key))

  return (
    <>
      <SEO
        title={`${title} - Yasar`}
        description={heroLead}
        url="/uretim/kalite-surecleri"
      />

      <main className="bg-[linear-gradient(180deg,#f4f1ea_0%,#f8f7f3_18%,#ffffff_100%)]">
        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_28%),linear-gradient(180deg,#f7f5ef_0%,#fbfaf7_100%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-start">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-emerald-200 bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 backdrop-blur">
                  {title}
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.1rem] lg:leading-[1.03]">
                  {tr('pages.production.quality.heroHeading', 'Her aşamada ölçülen, raporlanan ve tekrar doğrulanan kalite akışı.')}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {heroLead}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {tr('pages.production.quality.badges.iso', 'ISO Uyumlu')}
                  </div>
                  <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {tr('pages.production.quality.badges.spc', 'SPC Takibi')}
                  </div>
                  <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {tr('pages.production.quality.badges.experience', 'Sürekli İyileştirme')}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                    {tr('pages.about.collab.cta', 'İletişime Geç')}
                  </Link>
                  <Link href="/uretim/tesisler" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                    {tr('footer.production.facilities', 'Üretim Tesislerimiz')}
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_40px_90px_-40px_rgba(15,23,42,0.22)]">
                  <div className="relative h-72 sm:h-80 lg:h-[22rem]">
                    <Image
                      src="/photos/machinery-line.jpg"
                      alt={tr('pages.production.quality.imageAlt.hero', 'Kalite süreçleri')}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="border-t border-stone-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.summary.eyebrow', 'Kalite Özeti')}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {highlights.map((item, index) => (
                        <div key={item.label} className={`rounded-[22px] border p-4 ${index === 0 ? 'border-emerald-200 bg-emerald-50/80' : 'border-stone-200 bg-stone-50/80'}`}>
                          <div className="text-2xl font-semibold tracking-tight text-slate-950">{item.value}</div>
                          <div className="mt-2 text-xs leading-5 text-slate-600">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.features.assurance.title', 'Kalite Güvencesi')}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {assuranceBullets.map((bullet) => (
                      <div key={bullet} className="rounded-[20px] bg-stone-50 px-4 py-3 text-sm leading-6 text-slate-700">
                        {bullet}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.layers.eyebrow', 'Kontrol Katmanları')}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {tr('pages.production.quality.layers.title', 'Numuneden sevkiyata uzanan doğrulama yapısı.')}
            </h2>
          </div>

          <M.div variants={staggerGroup} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
            {phaseCards.map((card, index) => (
              <M.article
                key={card.title}
                variants={sectionReveal}
                whileHover={{ y: -4 }}
                className={`flex h-full flex-col rounded-[30px] border p-6 shadow-sm transition ${
                  index === 0 ? 'xl:col-span-6 border-emerald-200 bg-emerald-50/55' :
                  index === 1 ? 'xl:col-span-6 border-stone-200 bg-white' :
                  index === 2 ? 'xl:col-span-6 border-amber-200 bg-amber-50/55' :
                  'xl:col-span-6 border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{card.desc}</p>
              </M.article>
            ))}
          </M.div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
            <div className="rounded-[34px] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.sections.how.title', 'Nasıl Çalışıyoruz')}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {tr('pages.production.quality.sections.how.heading', 'Her kontrol adımı kayıt altına alınır ve iyileştirme döngüsüne bağlanır.')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {tr('pages.production.quality.sections.how.lead', 'Kalite yaklaşımımız sadece final kontrolden ibaret değildir; numune, üretim ve paketleme adımlarında ayrı ayrı gözlem ve doğrulama yapılır.')}
              </p>

              <div className="mt-6 space-y-4">
                <div className="border-l border-stone-200 pl-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">01</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tr('pages.production.quality.sections.how.steps.0', 'Ölçü tablosu, dikiş kalitesi, kumaş davranışı ve ilk görünüm onayı numune aşamasında birlikte değerlendirilir.')}</p>
                </div>
                <div className="border-l border-stone-200 pl-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">02</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tr('pages.production.quality.sections.how.steps.1', 'Üretim boyunca kesim, dikim ve ara operasyonlarda tanımlı kritik kontrol noktaları düzenli aralıklarla izlenir.')}</p>
                </div>
                <div className="border-l border-stone-200 pl-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">03</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tr('pages.production.quality.sections.how.steps.2', 'Paketleme, etiketleme ve sevkiyat hazırlığı öncesinde son doğrulamalar yapılarak uygunsuzluk riski minimize edilir.')}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">{tr('pages.production.quality.sections.sample.title', 'Numune Kontrolü')}</div>
                  <div className="mt-4 space-y-3">
                    {sampleChecks.slice(0, 3).map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm border border-stone-200">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{tr('pages.production.quality.sections.production.title', 'Üretim Kontrolleri')}</div>
                  <div className="mt-4 space-y-3">
                    {productionChecks.slice(0, 3).map((item) => (
                      <div key={item} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.sections.packing.title', 'Paketleme Kontrolü')}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {tr('pages.production.quality.details.packingNote', 'Etiket, paket içeriği, lot doğruluğu ve sevkiyat hazırlığı son aşamada tekrar kontrol edilir.')}
                    </p>
                  </div>
                  <div className="relative h-40 overflow-hidden rounded-[24px]">
                    <Image
                      src="/photos/weaving-machine-unsplash.jpg"
                      alt={tr('pages.production.quality.imageAlt.packing', 'Paketleme kalite kontrolü')}
                      fill
                      sizes="220px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </M.section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
              <div className="border-b border-stone-200 p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('pages.production.quality.detailedLists.eyebrow', 'Detaylı Kontrol Listeleri')}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {tr('pages.production.quality.detailedLists.title', 'Kontrol başlıkları tek tek görünür ve raporlanır.')}
                </h2>
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-[24px] bg-emerald-50/70 p-4">
                    <div className="text-sm font-semibold text-slate-900">{tr('pages.production.quality.sections.sample.title', 'Numune Kontrolü')}</div>
                    <div className="mt-3 space-y-2">
                      {sampleChecks.map((item) => (
                        <div key={item} className="text-sm leading-6 text-slate-700">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-sky-50/70 p-4">
                    <div className="text-sm font-semibold text-slate-900">{tr('pages.production.quality.sections.production.title', 'Üretim Kontrolleri')}</div>
                    <div className="mt-3 space-y-2">
                      {productionChecks.map((item) => (
                        <div key={item} className="text-sm leading-6 text-slate-700">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-amber-50/75 p-4">
                    <div className="text-sm font-semibold text-slate-900">{tr('pages.production.quality.sections.packing.title', 'Paketleme Kontrolü')}</div>
                    <div className="mt-3 space-y-2">
                      {packingChecks.map((item) => (
                        <div key={item} className="text-sm leading-6 text-slate-700">{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex h-64 items-end border-b border-stone-200 bg-[linear-gradient(135deg,#f6fbf8_0%,#ffffff_100%)] p-6 sm:h-72 lg:h-[18rem]">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{tr('pages.production.quality.bottomCards.sample.eyebrow', 'Numune Aşaması')}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">{tr('pages.production.quality.bottomCards.sample.title', 'İlk onay aşaması sonraki tüm kalite akışının referans noktasını oluşturur.')}</div>
                    <div className="mt-3 text-sm leading-6 text-slate-600">{tr('pages.production.quality.bottomCards.sample.body', 'Ölçü, yüzey, dikiş ve malzeme uyumu bu aşamada netleştirilir.')}</div>
                  </div>
                </div>
                <div className="flex h-64 items-end border-t border-stone-200 bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] p-6 sm:h-72 lg:h-[18rem]">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">{tr('pages.production.quality.bottomCards.reporting.eyebrow', 'Raporlama')}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">{tr('pages.production.quality.bottomCards.reporting.title', 'Kontrol bulguları yalnızca tespit edilmez, kayıt altına alınır ve aksiyona çevrilir.')}</div>
                    <div className="mt-3 text-sm leading-6 text-slate-600">{tr('pages.production.quality.bottomCards.reporting.body', 'Bu görünürlük kalite disiplininin sürdürülebilir hale gelmesini sağlar.')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </M.section>
      </main>
    </>
  )
}
