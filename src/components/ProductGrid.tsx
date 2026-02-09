import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

function useTr() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
}
import { getProducts } from '../data/demoProducts';
import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

function SlideCard({ id, side = 'left', children }: { id?: string; side?: 'left' | 'right'; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });
  return (
    <div id={id} ref={ref} data-side={side} className={`slide-section ${inView ? 'in-view' : ''}`}>
      {children}
    </div>
  );
}

export default function ProductGrid() {
  const tr = useTr();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    function onProductsChange() {
      setProducts(getProducts());
    }
    window.addEventListener('storage', onProductsChange);
    window.addEventListener('yasar:products:changed', onProductsChange as EventListener);
    return () => {
      window.removeEventListener('storage', onProductsChange);
      window.removeEventListener('yasar:products:changed', onProductsChange as EventListener);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{tr('components.productGrid.title','Öne Çıkan Ürünler')}</h2>
          <p className="text-sm text-gray-500 mt-1">{tr('components.productGrid.subtitle','Seçtiğimiz popüler ve önerilen ürünler — kalite ve konfor bir arada.')}</p>
          <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-rose-400 via-yellow-300 to-indigo-400" />
        </div>
        <Link href="/urunler" className="text-sm text-blue-600 transition-colors duration-200 hover:text-blue-500">{tr('components.productGrid.viewAll','Tümünü Gör')}</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, idx) => (
          <SlideCard key={p.id} id={`product-${p.id}`} side={idx % 2 === 0 ? 'left' : 'right'}>
            <ProductCard product={p} showWishlist={false} />
          </SlideCard>
        ))}
      </div>
    </section>
  );
}
