import Hero from '../components/Hero';
import SEO from '../components/SEO';
import CategoryTiles from '../components/CategoryTiles';
import MediaWrap from '../components/MediaWrap';
import WhyUs from '../components/WhyUs';
import ProductGrid from '../components/ProductGrid';

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
        {/* World map removed */}
      </main>
    </>
  );
}