import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/demoProducts';

export default function ProductGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
  <h2 className="text-xl font-semibold">Öne Çıkan Ürünler</h2>
  <a href="/collections" className="text-sm text-blue-600 transition-colors duration-200 hover:text-blue-500">Tümünü Gör</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
