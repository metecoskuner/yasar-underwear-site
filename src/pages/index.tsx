import Hero from '../components/Hero';
import SEO from '../components/SEO';
import HeroInfoCards from '../components/HeroInfoCards';
import MediaWrap from '../components/MediaWrap';
import WhyUs from '../components/WhyUs';
import ProductGrid from '../components/ProductGrid';
import dynamic from 'next/dynamic';

// Dynamically load the WorldMap component (client-only rendering only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('../components/WorldMap') as Promise<any>, { ssr: false });

export default function Home() {
  return (
    <>
  <SEO title="Yasar - Ana Sayfa" description="Yasar - Günlük kullanım için konforlu iç çamaşırları, Türkiye'de tasarlandı." url="/" />

      <main>
        <Hero />
  <HeroInfoCards />
  <MediaWrap />
      <WhyUs />
      <ProductGrid />
  {/* Re-added world map component (full-width) */}
      <section className="w-full mx-0 my-0 px-0">
    <div className="w-full">
      {/* Map container: use a responsive aspect-ratio wrapper so the SVG keeps
          its 2:1 proportions across devices and doesn't force extra vertical
          space that pushes other blocks down. */}
      <div className="w-full map-wrapper mb-0 md:mb-4 z-20 overflow-hidden">
        <WorldMap />
      </div>
    </div>
  </section>

  {/* FlagsStrip is now rendered by the site Layout (between main content and footer) */}
      </main>
    </>
  );
}