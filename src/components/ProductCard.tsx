import React from 'react';
import Image from 'next/image';
import type { Product } from '../data/demoProducts';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
  <div className={`relative h-40 sm:h-44 md:h-56 lg:h-72 flex items-center justify-center ${product.color ?? 'bg-gray-100'}`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 260px, 300px"
            className="object-contain"
          />
        ) : (
          <div className="text-gray-600 text-sm">Ürün görseli</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-600">urun kodu: <span className="font-mono text-sm text-gray-800">{product.productCode}</span></div>
          <button className="text-xs sm:text-sm text-white bg-black px-3 py-1 rounded-full">İncele</button>
        </div>
      </div>
    </div>
  );
}
