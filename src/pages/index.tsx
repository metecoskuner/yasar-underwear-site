import Hero from '../components/Hero';
import SEO from '../components/SEO';
import CategoryTiles from '../components/CategoryTiles';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <>
  <SEO title="Yasar - Ana Sayfa" description="Yasar - Günlük kullanım için konforlu iç çamaşırları, Türkiye'de tasarlandı." url="/" />

      <main>
        <Hero />
        <CategoryTiles />
        <ProductGrid />
        <section className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-gray-600">Hoşgeldiniz — demo tanıtım sayfası. Beğenmezseniz geri döneriz, kolaylıkla değiştiriz.</p>
        </section>
      </main>
    </>
  );
}