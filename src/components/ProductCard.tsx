import React from 'react';
import Image from 'next/image';
import type { Product } from '../data/demoProducts';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
      <div className={`h-44 flex items-center justify-center ${product.color ?? 'bg-gray-100'}`}>
        {product.image ? (
          <Image src={product.image} alt={product.title} width={220} height={160} className="object-contain" />
        ) : (
          <div className="text-gray-600 text-sm">Ürün görseli</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">{product.price}</div>
          <button className="text-sm text-white bg-black px-3 py-1 rounded-full">İncele</button>
        </div>
      </div>
    </div>
  );
}
