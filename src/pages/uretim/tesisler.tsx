import SEO from '@/components/SEO'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion

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

export default function Tesisler() {
  const { t, g } = useLanguage()

  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key)
      return v === key ? fallback : v
    } catch {
      return fallback
    }
  }

  const getArr = (key: string, fallback: string[]) => {
    try {
      const v = g?.(key)
      if (Array.isArray(v) && v.length > 0) return v as string[]
    } catch {
      return fallback
    }
    return fallback
  }

  const title = tr('uretim.tesis.title', 'Üretim Tesislerimiz')
  const lead = tr(
    'uretim.tesis.lead',
    'Modern, güvenli ve sürdürülebilir bir üretim altyapısı sunuyoruz. Tesislerimizde kalite, çalışan güvenliği ve çevresel sorumluluk eş zamanlı olarak yönetilir; süreçler dijital kayıtlarla izlenir.'
  )

  const tags = [
    tr('uretim.tesis.tags.iso', 'ISO 9001 uyumlu'),
    tr('uretim.tesis.tags.energy', 'Enerji verimliliği'),
    tr('uretim.tesis.tags.spc', 'SPC & izlenebilirlik'),
  ]

  const highlights = [
    { value: '1969', label: tr('uretim.tesis.stats.foundation', 'Kuruluş') },
    { value: '2', label: tr('uretim.tesis.stats.facilities', 'Tesis') },
    { value: '1M+', label: tr('uretim.tesis.stats.capacity', 'Yıllık Üretim') },
  ]

  const featuresResolved = [
    {
      title: tr('uretim.tesis.features.modernLines.title', 'Modern Hatlar'),
      desc: tr('uretim.tesis.features.modernLines.desc', 'Otomatik kesim ve dikim hatları ile verimli üretim.'),
    },
    {
      title: tr('uretim.tesis.features.qualityLab.title', 'Kalite Laboratuvarı'),
      desc: tr('uretim.tesis.features.qualityLab.desc', 'Gelişmiş test ve ölçüm laboratuvarları.'),
    },
    {
      title: tr('uretim.tesis.features.environment.title', 'Çevresel Tedbirler'),
      desc: tr('uretim.tesis.features.environment.desc', 'Atık yönetimi ve enerji verimliliği uygulamaları.'),
    },
    {
      title: tr('uretim.tesis.features.training.title', 'Eğitim & Güvenlik'),
      desc: tr('uretim.tesis.features.training.desc', 'Sürekli eğitim ve iş sağlığı önlemleri.'),
    },
  ]

  const infrastructure = getArr('uretim.tesis.infrastructure.items', [
    'Otomatik kesim ve dikim hatları',
    'SPC tabanlı süreç kontrolü',
    'Enerji verimli makineler',
  ])

  const trainingItems = getArr('uretim.tesis.training.items', [
    'Düzenli personel eğitimleri',
    'İş sağlığı ve güvenliği protokolleri',
    'Geri bildirim mekanizmaları',
  ])

  const applications = getArr('uretim.tesis.applications.items', [
    'Otomatik kesim ve kalite takibi',
    'SPC ile proses kontrolü',
    'Atık yönetimi ve su tasarrufu',
  ])

  return (
    <>
      <SEO
        title={`${title} - Yasar`}
        description={tr('uretim.tesis.lead', 'Yasar üretim tesisleri, kalite ve sürdürülebilirlik odaklı üretim altyapısı.')}
        url="/uretim/tesisler"
      />

      <main className="bg-[linear-gradient(180deg,#f4f1ea_0%,#f8f7f3_18%,#ffffff_100%)]">
        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_28%),linear-gradient(180deg,#f7f4ee_0%,#fbfaf7_100%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] lg:items-stretch">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-amber-200 bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700 backdrop-blur">
                  {title}
                </div>
                <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.2rem] lg:leading-[1.03]">
                  {tr('uretim.tesis.heroHeading', 'Üretim hattından kalite kontrolüne kadar tek akışta çalışan tesis yapısı.')}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {lead}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag} className="inline-flex items-center rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                    {tr('pages.about.collab.cta', 'İletişime Geç')}
                  </Link>
                  <Link href="/uretim/kalite-surecleri" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                    {tr('footer.production.quality', 'Kalite Süreçlerimiz')}
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
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-amber-300/20 blur-2xl lg:block" />
                <div className="absolute -right-6 bottom-8 hidden h-28 w-28 rounded-full bg-teal-300/20 blur-2xl lg:block" />
                <div className="grid gap-4 lg:grid-rows-[minmax(0,1fr)_auto]">
                  <div className="relative overflow-hidden rounded-[34px] border border-white/10 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.55)]">
                    <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.45)_100%)]" />
                    <div className="relative h-72 sm:h-80 lg:h-[22rem]">
                      <Image
                        src="/photos/weaving-detail.jpg"
                        alt={tr('uretim.tesis.imageAlt', 'Tesis')}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                      <div className="rounded-[24px] border border-white/50 bg-white/86 p-4 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{tr('uretim.tesis.fieldView.label', 'Saha Görünümü')}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-700">{tr('uretim.tesis.fieldView.body', 'Üretim, kalite ve proses takibi aynı fiziksel ve operasyonel altyapı üzerinde yönetilir.')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.quality.title', 'Kalite Güvencesi')}</div>
                      <div className="mt-3 text-base font-semibold text-slate-900">{tr('uretim.tesis.quality.bullets.0', 'ISO 9001 uyumlu süreçler')}</div>
                    </div>
                    <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.processTracking.label', 'Proses Takibi')}</div>
                      <div className="mt-3 text-base font-semibold text-slate-900">{tr('uretim.tesis.quality.bullets.1', 'SPC ve raporlama')}</div>
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
          animate="visible"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.components.eyebrow', 'Tesis Bileşenleri')}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{tr('uretim.tesis.components.title', 'Operasyonu taşıyan ana katmanlar.')}</h2>
            </div>
          </div>
          <M.div variants={staggerGroup} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
            {featuresResolved.map((feature, index) => (
              <M.article
                key={feature.title}
                variants={sectionReveal}
                whileHover={{ y: -4 }}
                className={`rounded-[30px] border p-6 shadow-sm transition ${
                  index === 0 ? 'xl:col-span-5 border-stone-200 bg-white' :
                  index === 1 ? 'xl:col-span-3 border-teal-200 bg-teal-50/55' :
                  index === 2 ? 'xl:col-span-4 border-stone-200 bg-white' :
                  'xl:col-span-12 border-amber-200 bg-amber-50/70'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.desc}</p>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.86fr)_minmax(0,1.14fr)]">
            <div className="relative overflow-hidden rounded-[34px] border border-stone-200 bg-white shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.08),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.08),_transparent_26%)]" />
              <div className="relative p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.how.title', 'Nasıl Çalışıyoruz')}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {tr('uretim.tesis.how.heading', 'Hat düzeni, veri takibi ve kalite kontrol aynı sistem içinde ilerler.')}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tr('uretim.tesis.how.lead', 'Tesislerimizde verimli üretim, çalışan güvenliği ve çevresel sorumluluk bir arada yürütülür. Dijital kayıtlarla izlenebilirlik sağlanır ve süreçler sürekli iyileştirilir.')}
                </p>

                <div className="mt-6 space-y-4">
                  <div className="border-l border-stone-200 pl-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">01</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tr('uretim.tesis.how.steps.0', 'Üretim planlama, kalite kontrol ve teslim takibini aynı operasyon akışında birleştiriyoruz.')}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">02</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tr('uretim.tesis.how.steps.1', 'Dijital kayıt, raporlama ve süreç kontrolü ile tekrarlanabilir kalite standardı sağlıyoruz.')}</p>
                  </div>
                  <div className="border-l border-stone-200 pl-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">03</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tr('uretim.tesis.how.steps.2', 'Çalışan güvenliği, enerji verimliliği ve çevresel tedbirler operasyonun ayrılmaz parçası olarak ele alınıyor.')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">{tr('uretim.tesis.infrastructure.title', 'Altyapı & Makine')}</div>
                  <div className="mt-4 space-y-3">
                    {infrastructure.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-amber-50 p-6 text-slate-900 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{tr('uretim.tesis.training.title', 'Eğitim & Güvenlik')}</div>
                  <div className="mt-4 space-y-3">
                    {trainingItems.map((item) => (
                      <div key={item} className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.quality.title', 'Kalite Güvencesi')}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tr('uretim.tesis.quality.lead', 'Sürekli izleme, veri kayıtları ve geri bildirim mekanizmaları ile kalite güvencesi sağlanır.')}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-stone-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{tr('uretim.tesis.quality.standardLabel', 'Standart')}</div>
                    <div className="mt-2 text-sm font-medium text-slate-700">{tr('uretim.tesis.quality.bullets.0', 'ISO 9001 uyumlu süreçler')}</div>
                  </div>
                  <div className="rounded-[22px] bg-stone-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{tr('uretim.tesis.quality.trackingLabel', 'Takip')}</div>
                    <div className="mt-2 text-sm font-medium text-slate-700">{tr('uretim.tesis.quality.bullets.1', 'SPC ve raporlama')}</div>
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
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="border-b border-stone-200 p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('uretim.tesis.applications.title', 'Tesislerde Uygulamalar')}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {tr('uretim.tesis.applications.heading', 'Operasyona yansıyan somut uygulamalar.')}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tr('uretim.tesis.applications.lead', 'Tesislerimizde yürütülen başlıca uygulamalar ve dikkat ettiğimiz noktalar aşağıdaki gibidir.')}
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {applications.map((item, index) => (
                    <div key={item} className="rounded-[24px] border border-stone-200 bg-stone-50 px-4 py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-sm">
                        0{index + 1}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[26px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] px-5 py-5 text-sm leading-6 text-white/75">
                  {tr('uretim.tesis.applications.summary', 'Tesis altyapımız verimlilik, iş sağlığı ve çevresel etki odağında tasarlanmıştır. Ölçülebilir hedeflerle enerji tüketimimizi azaltıyor ve atıklarımızı yönetiyoruz.')}
                </div>
              </div>

              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-1">
                <div className="relative h-64 border-b border-stone-200 sm:h-72 lg:h-[18rem]">
                  <Image src="/photos/fabric-rolls.jpg" alt={tr('uretim.tesis.imageLabel', 'Tesis görseli')} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                </div>
                <div className="flex h-64 items-end border-t border-stone-200 bg-[linear-gradient(135deg,#fffaf0_0%,#f3efe7_100%)] p-6 sm:h-72 lg:h-[18rem]">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{tr('uretim.tesis.materialFlow.title', 'Malzeme Akışı')}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">{tr('uretim.tesis.materialFlow.heading', 'Kumaş ve yarı mamul akışı üretim verimliliğini destekleyecek şekilde organize edilir.')}</div>
                    <div className="mt-3 text-sm leading-6 text-slate-600">{tr('uretim.tesis.materialFlow.body', 'Fiziksel yerleşim ve süreç disiplini, kapasite kullanımı ile kalite standardını birlikte destekler.')}</div>
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
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="rounded-[36px] border border-amber-200 bg-[linear-gradient(135deg,#fffaf0_0%,#f6efe2_100%)] p-8 text-slate-950 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.16)] sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{tr('uretim.tesis.energy.title', 'Enerji & Çevre')}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  {tr('uretim.tesis.energy.heading', 'Enerji verimliliği ve çevresel etki yönetimi üretim kararlarının parçasıdır.')}
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {tr('uretim.tesis.energy.body', 'Enerji verimliliği ve su tasarrufu projeleri mevcut; tesis genelinde ölçümler yapılıyor ve düzenli raporlama ile ilerleme izleniyor.')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/surdurulebilirlik" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-50">
                  {tr('footer.sustainability', 'Sürdürülebilirlik')}
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
