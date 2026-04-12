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

export default function SustPage() {
  const { t } = useLanguage()

  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key)
      return value === key ? fallback : value
    } catch {
      return fallback
    }
  }

  const title = tr('sustainability.title', 'Sürdürülebilirlik')
  const heroLead = tr(
    'sustainability.heroLead',
    'Üretim yaklaşımımızda çevresel etkiyi azaltan, kaynak kullanımını iyileştiren ve uzun vadeli sorumluluk alan süreçler geliştiriyoruz.'
  )

  const metrics = [
    { value: tr('sustainability.metrics.m1', 'İzlenebilir süreçler'), label: '01' },
    { value: tr('sustainability.metrics.m2', 'Verimli kaynak kullanımı'), label: '02' },
    { value: tr('sustainability.metrics.m3', 'Sürekli iyileştirme'), label: '03' },
  ]

  const resolvedPillars = [
    {
      title: tr('sustainability.pillars.0.title', 'Çevresel Etki'),
      desc: tr('sustainability.pillars.0.desc', 'Enerji, su ve atık yönetiminde daha dengeli ve ölçülebilir uygulamalar geliştiriyoruz.'),
    },
    {
      title: tr('sustainability.pillars.1.title', 'Sorumlu Operasyon'),
      desc: tr('sustainability.pillars.1.desc', 'Kalite, çalışan güvenliği ve operasyonel disiplin sürdürülebilirliğin temel parçası olarak ele alınıyor.'),
    },
    {
      title: tr('sustainability.pillars.2.title', 'Sürekli Gelişim'),
      desc: tr('sustainability.pillars.2.desc', 'Süreçleri düzenli takip edip geri bildirimlerle daha iyi hale getiriyoruz.'),
    },
  ]

  const howTitle = tr('sustainability.how.title', 'Nasıl Çalışıyoruz')
  const howLead = tr(
    'sustainability.how.lead',
    'Operasyonlarımızda ölçülebilir, uygulanabilir ve sürekli gelişen sürdürülebilirlik adımları kullanıyoruz.'
  )
  const resolvedHowBullets = [
    tr('sustainability.how.bullets.0', 'Kaynak kullanımlarını ölçüyor ve düzenli olarak gözden geçiriyoruz.'),
    tr('sustainability.how.bullets.1', 'Üretim akışında iyileştirme alanlarını veriyle takip ediyoruz.'),
    tr('sustainability.how.bullets.2', 'Operasyon kararlarında kalite ve çevresel etkiyi birlikte değerlendiriyoruz.'),
    tr('sustainability.how.bullets.3', 'Düzenli denetimler ve şeffaf raporlama ile süreci görünür tutuyoruz.'),
  ]

  const resolvedCards = [
    {
      title: tr('sustainability.cards.0.title', 'Kaynak Verimliliği'),
      text: tr('sustainability.cards.0.text', 'Enerji, su ve malzeme kullanımını daha verimli hale getiren uygulamalara öncelik veriyoruz.'),
    },
    {
      title: tr('sustainability.cards.1.title', 'Sorumlu Üretim'),
      text: tr('sustainability.cards.1.text', 'Kalite, güvenlik ve çevresel hassasiyeti aynı üretim disiplini içinde yönetiyoruz.'),
    },
    {
      title: tr('sustainability.cards.2.title', 'Uzun Vadeli Yaklaşım'),
      text: tr('sustainability.cards.2.text', 'Süreçlerimizi kısa vadeli değil, kalıcı iyileştirme hedefleriyle geliştiriyoruz.'),
    },
  ]

  const footerNote = tr(
    'sustainability.footerNote',
    'Sürdürülebilirlik yaklaşımımız operasyonel disiplin, sorumlu üretim ve sürekli gelişim odağında ilerler.'
  )

  return (
    <>
      <SEO title={`${title} - Yasar`} description={heroLead} url="/surdurulebilirlik" />

      <main className="bg-[linear-gradient(180deg,#f4f1ea_0%,#f8f7f3_18%,#ffffff_100%)]">
        <M.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_28%),linear-gradient(180deg,#f7f5ef_0%,#fbfaf7_100%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:items-start">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-emerald-200 bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 backdrop-blur">
                  {title}
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.1rem] lg:leading-[1.03]">
                  {tr('sustainability.heroHeading', 'Kaynakları daha dikkatli kullanan, etkisini ölçen ve uzun vadeyi gözeten üretim yaklaşımı.')}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {heroLead}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                    {tr('pages.about.collab.cta', 'İletişime Geç')}
                  </Link>
                  <Link href="/uretim/tesisler" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                    {tr('footer.production.facilities', 'Üretim Tesislerimiz')}
                  </Link>
                </div>

                <M.div variants={staggerGroup} initial="hidden" animate="visible" className="mt-10 grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric, index) => (
                    <M.div
                      key={metric.value}
                      variants={sectionReveal}
                      whileHover={{ y: -4 }}
                      className={`rounded-[24px] border p-4 shadow-sm transition ${index === 0 ? 'border-emerald-200 bg-emerald-50/80' : 'border-stone-200 bg-white/95'}`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{metric.label}</div>
                      <div className="mt-3 text-sm font-medium leading-6 text-slate-800">{metric.value}</div>
                    </M.div>
                  ))}
                </M.div>
              </div>

              <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_40px_90px_-40px_rgba(15,23,42,0.22)]">
                  <div className="relative h-72 sm:h-80 lg:h-[22rem]">
                    <Image src="/photos/fabric-texture-light.jpg" alt={title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" priority />
                  </div>
                  <div className="border-t border-stone-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('sustainability.approach.eyebrow', 'Yaklaşım')}</p>
                    <div className="mt-3 text-sm leading-6 text-slate-700">
                      {tr('sustainability.approach.body', 'Sürdürülebilirlik bizim için ayrı bir başlık değil; üretim, kalite, operasyon ve karar alma süreçlerinin doğal parçası.')}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <M.div whileHover={{ y: -4 }} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm transition">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('sustainability.focus.resource.title', 'Kaynak')}</div>
                    <div className="mt-3 text-base font-semibold text-slate-900">{tr('sustainability.focus.resource.body', 'Enerji, su ve malzeme kullanımında daha dengeli kararlar.')}</div>
                  </M.div>
                  <M.div whileHover={{ y: -4 }} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm transition">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('sustainability.focus.process.title', 'Süreç')}</div>
                    <div className="mt-3 text-base font-semibold text-slate-900">{tr('sustainability.focus.process.body', 'İzleme, raporlama ve sürekli iyileştirme ile ilerleyen işleyiş.')}</div>
                  </M.div>
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('sustainability.pillarsEyebrow', 'Temel Başlıklar')}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {tr('sustainability.pillarsTitle', 'Sürdürülebilirlik yaklaşımını taşıyan ana eksenler.')}
            </h2>
          </div>

          <M.div variants={staggerGroup} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
            {resolvedPillars.map((pillar, index) => (
              <M.article
                key={pillar.title}
                variants={sectionReveal}
                whileHover={{ y: -4 }}
                className={`rounded-[30px] border p-6 shadow-sm transition ${
                  index === 0
                    ? 'xl:col-span-4 border-emerald-200 bg-emerald-50/55'
                    : index === 1
                    ? 'xl:col-span-5 border-stone-200 bg-white'
                    : 'xl:col-span-3 border-amber-200 bg-amber-50/60'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{pillar.desc}</p>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
            <div className="rounded-[34px] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{howTitle}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {tr('sustainability.how.heading', 'Ölçülebilir ve uygulanabilir adımlarla ilerleyen operasyon yaklaşımı.')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {howLead}
              </p>

              <div className="mt-6 space-y-4">
                {resolvedHowBullets.map((bullet, index) => (
                  <M.div key={bullet} whileHover={{ y: -2 }} className="flex gap-4 rounded-[22px] bg-stone-50 px-4 py-4 transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-sm">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{bullet}</p>
                  </M.div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <M.div whileHover={{ y: -4 }} className="relative overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-sm transition">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{tr('sustainability.operationNote.eyebrow', 'Operasyon Notu')}</p>
                    <div className="mt-4 text-sm leading-7 text-slate-600">
                      {tr('sustainability.operationNote.body', 'Sürdürülebilirlik başlıklarımız yalnızca hedef beyanı değil; günlük operasyon içinde takip edilen ve düzenli olarak gözden geçirilen uygulamalara dayanır.')}
                    </div>
                  </div>
                  <div className="flex h-44 items-end border-t border-stone-200 bg-[linear-gradient(135deg,#f6fbf8_0%,#f7f1e6_100%)] p-5 lg:h-full lg:border-t-0 lg:border-l">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{tr('sustainability.operationNote.sideTitle', 'İzleme')}</div>
                      <div className="mt-3 text-sm leading-6 text-slate-600">
                        {tr('sustainability.operationNote.sideBody', 'Kaynak kullanımı, süreç çıktıları ve operasyon notları düzenli olarak gözden geçirilir.')}
                      </div>
                    </div>
                  </div>
                </div>
              </M.div>

              <div className="grid gap-4 sm:grid-cols-3">
                {resolvedCards.map((card, index) => (
                  <M.div
                    key={card.title}
                    whileHover={{ y: -4 }}
                    className={`rounded-[28px] border p-5 shadow-sm transition ${index === 0 ? 'border-emerald-200 bg-emerald-50/50' : index === 1 ? 'border-stone-200 bg-white' : 'border-amber-200 bg-amber-50/55'}`}
                  >
                    <div className="text-sm font-semibold text-slate-900">{card.title}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
                  </M.div>
                ))}
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
          <div className="rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,#f6fbf8_0%,#f9f5eb_100%)] p-8 text-slate-950 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.12)] sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{tr('sustainability.closing.eyebrow', 'Yaklaşım Notu')}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  {tr('sustainability.closing.title', 'Sürdürülebilirlik yaklaşımımız tek seferlik değil, operasyon içinde devam eden bir gelişim alanıdır.')}
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {footerNote}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/uretim/tesisler" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-50">
                  {tr('footer.production.facilities', 'Üretim Tesislerimiz')}
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
