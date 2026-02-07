import React from 'react';
import Link from 'next/link';

// Basit placeholder yerine ziyaretçiyi ilgili sayfalara yönlendiren kısa içerik.
export default function WorldMapClean() {
  return (
    <div className="w-full rounded-xl shadow bg-white p-6 text-center text-sm text-gray-700">
      <div className="mb-2 font-semibold">Dünyada nerelere gönderiyoruz?</div>
      <div className="text-sm text-gray-600">Global satış ve iş birlikleri hakkında bilgi almak için ilgili sayfalara göz atın:</div>
      <div className="mt-3 flex justify-center gap-3">
        <Link href="/about" className="inline-block text-amber-600 hover:underline">Kurumsal</Link>
        <Link href="/urunler" className="inline-block text-amber-600 hover:underline">Ürünler</Link>
        <Link href="/contact" className="inline-block text-amber-600 hover:underline">İletişim</Link>
      </div>
    </div>
  );
}

