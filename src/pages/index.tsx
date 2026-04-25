import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { GetStaticProps } from 'next'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import SEO from '../components/SEO'
import HeroInfoCards from '../components/HeroInfoCards'
import WhyUs from '../components/WhyUs'
import ProductGrid from '../components/ProductGrid'
import { useLanguage } from '@/contexts/LanguageContext'
import { CONTACT, SOCIAL } from '@/config/contactConfig'
import { MAP_PLACES } from '@/config/mapPlaces'
import { loadProducts } from '@/lib/loadProducts'
import type { Product } from '@/types/product'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yasarunderwear.com').replace(/\/$/, '')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('../components/WorldMap') as Promise<any>, { ssr: false })
const MediaWrap = dynamic(() => import('../components/MediaWrap'), {
  ssr: false,
  loading: () => <section className="min-h-[24rem] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)]" aria-hidden="true" />,
})
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

export default function Home({ products }: { products: Product[] }) {
  const { t } = useLanguage()
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key)
      return v === key ? fallback : v
    } catch {
      return fallback
    }
  }

  const operationalPillars = [
    {
      title: tr('pagesHome.structure.production.title', 'Üretim Partnerliği'),
      body: tr('pagesHome.structure.production.body', 'Toptan, private label ve kurumsal taleplerde planlı üretim ve düzenli teslim akışı sunuyoruz.'),
    },
    {
      title: tr('pagesHome.structure.quality.title', 'Kalite & İzlenebilirlik'),
      body: tr('pagesHome.structure.quality.body', 'Numuneden sevkiyata kadar kontrol edilen süreçlerle tekrar edilebilir kalite standardı sağlıyoruz.'),
    },
    {
      title: tr('pagesHome.structure.global.title', 'Global Erişim'),
      body: tr('pagesHome.structure.global.body', 'Türkiye merkezli üretim altyapımızla farklı pazarlara düzenli ve sürdürülebilir biçimde ulaşıyoruz.'),
    },
  ]
  const headOffice = MAP_PLACES[0]
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Yasar Underwear',
    alternateName: ['Yaşar Çamaşır', 'Yasar Textile', 'Yasar Tekstil'],
    legalName: 'Yaşar Çamaşır Sanayi Ticaret Limited Şirketi',
    url: SITE_URL,
    logo: `${SITE_URL}/photos/yasarLogo.png`,
    image: `${SITE_URL}/photos/yasarLogo.png`,
    foundingDate: '1969',
    email: CONTACT.EMAIL,
    telephone: CONTACT.PHONE_MAIN,
    address: {
      '@type': 'PostalAddress',
      streetAddress: headOffice?.addr ?? 'Mahmutpaşa Camii Avlu İçi No:12/A',
      addressLocality: 'Fatih',
      addressRegion: 'Istanbul',
      addressCountry: 'TR',
    },
    geo: headOffice ? {
      '@type': 'GeoCoordinates',
      latitude: headOffice.lat,
      longitude: headOffice.lng,
    } : undefined,
    sameAs: [SOCIAL.INSTAGRAM, SOCIAL.FACEBOOK].filter(Boolean),
    areaServed: ['Turkey', 'United States', 'France', 'Spain', 'Greece', 'Germany', 'United Kingdom', 'Middle East', 'Europe'],
    knowsAbout: ['Underwear manufacturing', 'Pajama manufacturing', 'Private label textile production', 'Wholesale underwear', 'OEM textile production'],
  }
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Yasar Underwear',
    alternateName: ['Yaşar Çamaşır', 'Yasar Textile'],
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['tr', 'en'],
  }

  return (
    <>
      <SEO
        title={tr('pagesHome.seo.title', 'Yasar Underwear | Türkiye İç Giyim, Pijama ve Private Label Üreticisi')}
        description={tr('pagesHome.seo.description', 'Yasar Underwear, 1969’dan beri Türkiye’de iç giyim, pijama, homewear, private label, OEM ve toptan tekstil üretimi yapan deneyimli bir üreticidir.')}
        url="/"
        keywords={['Yasar Underwear', 'Yaşar Çamaşır', 'Yasar Textile', 'iç giyim üreticisi', 'pijama üreticisi', 'private label underwear Turkey', 'OEM textile manufacturer Turkey', 'wholesale underwear manufacturer']}
        jsonLd={[organizationSchema, websiteSchema]}
        breadcrumbs={[{ name: 'Home', item: '/' }]}
      />

      <Hero />

      <main className="bg-[linear-gradient(180deg,#f5f2ea_0%,#faf9f6_16%,#ffffff_100%)]">
        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.10),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.08),_transparent_24%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-stone-200 bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur">
                  {tr('pagesHome.overview.eyebrow', 'Ana Bakış')}
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {tr('pagesHome.overview.title', 'Üretim, kalite ve pazar erişimini tek akışta toplayan daha net bir ana sayfa deneyimi.')}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {tr('pagesHome.overview.body', 'Yaşar Tekstil; kurumsal üretim partnerliği, ürün geliştirme kabiliyeti ve ihracat odaklı operasyon yapısını aynı çatı altında sunar. Aşağıdaki bölümlerde ana iş modelimizi daha net biçimde görebilirsiniz.')}
                </p>
              </div>

              <M.div
                variants={staggerGroup}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid gap-4 md:grid-cols-3"
              >
                {operationalPillars.map((item, index) => (
                  <M.article
                    key={item.title}
                    variants={sectionReveal}
                    whileHover={{ y: -4 }}
                    className={`rounded-[28px] border p-5 shadow-sm transition ${index === 1 ? 'border-amber-200 bg-amber-50/65' : 'border-stone-200 bg-white'}`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                  </M.article>
                ))}
              </M.div>
            </div>
          </div>
        </M.section>

        <section className="bg-[linear-gradient(180deg,#fbfaf7_0%,#ffffff_100%)]">
          <HeroInfoCards />
        </section>

        <section className="border-y border-stone-200/70 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)]">
          <MediaWrap />
        </section>

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          <WhyUs />
        </section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"
        >
          <div className="rounded-[34px] border border-stone-200 bg-[linear-gradient(145deg,#fffaf0_0%,#ffffff_100%)] p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{tr('pagesHome.catalog.eyebrow', 'Ürün Seçkisi')}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {tr('pagesHome.catalog.title', 'Öne çıkan ürünler yalnızca vitrin değil, üretim kabiliyetimizin örnekleri.')}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {tr('pagesHome.catalog.body', 'Kumaş kalitesi, kullanım konforu ve günlük giyilebilirlik açısından öne çıkan ürünleri bu bölümde topladık. Kullanıcı isterse detay modalı üzerinden hızlıca incelemeye geçebilir.')}
                </p>
              </div>
              <Link href="/urunler" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-stone-50">
                {tr('components.productGrid.viewAll', 'Tümünü Gör')}
              </Link>
            </div>
          </div>
        </M.section>

        <section className="bg-white">
          <ProductGrid products={products} />
        </section>

        <M.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full border-t border-stone-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-0"
        >
          <div className="mx-auto max-w-6xl px-4 pt-12 pb-5 sm:pt-16">
            <div className="mb-6 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{tr('pagesHome.export.eyebrow', 'İhracat Ağı')}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {tr('pagesHome.export.title', 'Türkiye’den farklı pazarlara uzanan dağıtım yapımız')}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                {tr('pagesHome.export.body', 'Yaşar Tekstil’in aktif olarak ulaştığı bölgeleri inceleyin. Harita, markanın üretim gücünü ve uluslararası erişimini tek bakışta gösterir.')}
              </p>
            </div>
            <div className="w-full map-wrapper mb-0 md:mb-4 z-20 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.35)]">
              <WorldMap />
            </div>
          </div>
        </M.section>
      </main>
      {/* FlagsStrip layout seviyesinde kalıyor; marquee davranışına dokunulmadı */}
    </>
  )
}

export const getStaticProps: GetStaticProps<{ products: Product[] }> = async () => {
  const products = await loadProducts()
  return {
    props: { products },
    revalidate: 300,
  }
}
