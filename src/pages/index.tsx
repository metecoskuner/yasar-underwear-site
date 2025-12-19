import Hero from '../components/Hero';
import SEO from '../components/SEO';
import CategoryTiles from '../components/CategoryTiles';
import MediaWrap from '../components/MediaWrap';
import WhyUs from '../components/WhyUs';
import ProductGrid from '../components/ProductGrid';
import dynamic from 'next/dynamic';

// Dynamically import the restored WorldMap (client-only) so the preview PR shows the richer map
const WorldMap = dynamic(() => import('../components/WorldMapRestored'), { ssr: false });

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
        {/* Re-added world map component */}
        <section className="max-w-6xl mx-auto my-8 px-4">
          <WorldMap />
        </section>
      </main>
    </>
  );
}