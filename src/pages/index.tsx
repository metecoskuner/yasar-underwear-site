import Hero from '../components/Hero';
import SEO from '../components/SEO';
import HeroInfoCards from '../components/HeroInfoCards';
import MediaWrap from '../components/MediaWrap';
import WhyUs from '../components/WhyUs';
import ProductGrid from '../components/ProductGrid';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamically load the WorldMap component (client-only rendering only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('../components/WorldMap') as Promise<any>, { ssr: false });

export default function Home() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  return (
    <>
      <SEO title="Yasar - Ana Sayfa" description="Yasar - Günlük kullanım için konforlu iç çamaşırları, Türkiye'de tasarlandı." url="/" />
      <Hero />
      <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_18%,#f8fafc_100%)]">
        <HeroInfoCards />
      </div>
      <section className="border-y border-stone-200/70 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)]">
        <MediaWrap />
      </section>
      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <WhyUs />
      </div>
      <section className="bg-white">
        <ProductGrid />
      </section>
      <section className="w-full border-t border-stone-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-0">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-5 sm:pt-16">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{tr('pagesHome.export.eyebrow','İhracat Ağı')}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {tr('pagesHome.export.title','Türkiye’den farklı pazarlara uzanan dağıtım yapımız')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {tr('pagesHome.export.body','Yaşar Tekstil’in aktif olarak ulaştığı bölgeleri inceleyin. Harita, markanın üretim gücünü ve uluslararası erişimini tek bakışta gösterir.')}
            </p>
          </div>
          <div className="w-full map-wrapper mb-0 md:mb-4 z-20 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.35)]">
            <WorldMap />
          </div>
        </div>
      </section>
      {/* FlagsStrip is now rendered by the site Layout (between main content and footer) */}
    </>
  );
}
