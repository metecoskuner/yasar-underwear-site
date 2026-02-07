import Link from 'next/link';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  { id: 'c1', key: 'ic-giyim', href: '/urunler?category=ic-giyim' },
  { id: 'c2', key: 'ev-giyim', href: '/urunler?category=ev-giyim' },
  { id: 'c3', key: 'corap', href: '/urunler?category=corap' },
  { id: 'c4', key: 'aktif', href: '/urunler?category=aktif' },
];

export default function CategoryTiles() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => {
          const label = tr(`components.categories.${cat.key}`, cat.key === 'ic-giyim' ? 'İç Giyim' : cat.key === 'ev-giyim' ? 'Ev Giyimi' : cat.key === 'corap' ? 'Çorap & Aksesuar' : 'Aktif & Rahat');
          const imageLabel = tr('components.common.imagePlaceholder', 'Resim');
          return (
            <Link key={cat.id} href={cat.href}>
              <div
                className="block p-6 rounded-lg bg-white shadow-sm hover:shadow-md text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer"
                aria-label={`Kategori: ${label}`}
              >
                <div className="h-16 w-full mb-3 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">{imageLabel}</div>
                <div className="font-medium">{label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
