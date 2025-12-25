import Hero from '../components/Hero';
import SEO from '../components/SEO';
import CategoryTiles from '../components/CategoryTiles';
import MediaWrap from '../components/MediaWrap';
import WhyUs from '../components/WhyUs';
import ProductGrid from '../components/ProductGrid';
import dynamic from 'next/dynamic';

// Dynamically import the WorldMap component (client-only)
// ensure TypeScript understands the loader returns the component default export
const WorldMap = dynamic(() => import('../components/WorldMap') as Promise<any>, { ssr: false });

export default function Home() {
  return (
    <>
  <SEO title="Yasar - Ana Sayfa" description="Yasar - Günlük kullanım için konforlu iç çamaşırları, Türkiye'de tasarlandı." url="/" />

      <main>
        <Hero />
  <CategoryTiles />
  <MediaWrap />
      <WhyUs />
      <ProductGrid />
  {/* Re-added world map component (full-width) */}
      <section className="w-full mx-0 my-0 px-0">
    <div className="w-full">
      {/* mobile fixed to 258px, restore larger breakpoints for desktop sizes */}
      <div className="w-full h-[258px] sm:h-[420px] md:h-[520px] lg:h-[640px] mb-6 md:mb-12 z-0">
        <WorldMap />
      </div>
    </div>
  </section>

  {/* FlagsStrip is now rendered by the site Layout (between main content and footer) */}
      </main>
    </>
  );
}