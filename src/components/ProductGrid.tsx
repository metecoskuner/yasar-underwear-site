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
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from '../hooks/useInView';
import type { Product } from '@/types/product';

function SlideCard({ id, side = 'left', children }: { id?: string; side?: 'left' | 'right'; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });
  return (
    <div id={id} ref={ref} data-side={side} className={`slide-section ${inView ? 'in-view' : ''}`}>
      {children}
    </div>
  );
}

export default function ProductGrid({ products: initialProducts = [] }: { products?: Product[] }) {
  const tr = useTr();
  const [products] = useState<Product[]>(initialProducts);

  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      {/* products fetched (debug banner removed for production) */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{tr('components.productGrid.eyebrow','Öne Çıkan Seçki')}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{tr('components.productGrid.title','Öne Çıkan Ürünler')}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{tr('components.productGrid.subtitle','Seçtiğimiz popüler ve önerilen ürünler; kalite, konfor ve günlük kullanımı bir arada sunar.')}</p>
          <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-slate-900" />
        </div>
        <Link href="/urunler" className="inline-flex shrink-0 items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-stone-50">{tr('components.productGrid.viewAll','Tümünü Gör')}</Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(() => {
          const featured = products.filter((x) => !!x.isFeatured)
          // Render only featured products. If none are featured, render an empty list
          const listToRender = featured
          return listToRender.map((p, idx) => (
          <SlideCard key={p.id} id={`product-${p.id}`} side={idx % 2 === 0 ? 'left' : 'right'}>
            <ProductCard
              product={p}
              showWishlist={false}
              onInspect={(prod, preview) => {
                // navigate to products page and open the product modal there
                const query: Record<string, string> = { product: prod.id }
                if (typeof preview === 'number') query.preview = String(preview)
                void router.push({ pathname: '/urunler', query }, undefined, { shallow: false })
              }}
            />
          </SlideCard>
          ))
        })()}
      </div>
    </section>
  );
}
