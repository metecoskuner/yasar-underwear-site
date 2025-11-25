import Link from 'next/link';
import React from 'react';

const categories = [
  { id: 'c1', name: 'İç Giyim', href: '/c/ic-giyim' },
  { id: 'c2', name: 'Ev Giyimi', href: '/c/ev-giyim' },
  { id: 'c3', name: 'Çorap & Aksesuar', href: '/c/corap' },
  { id: 'c4', name: 'Aktif & Rahat', href: '/c/aktif' },
];

export default function CategoryTiles() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Link key={cat.id} href={cat.href} legacyBehavior>
            <a className="block p-6 rounded-lg bg-white shadow-sm hover:shadow-md text-center">
              <div className="h-16 w-full mb-3 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Resim</div>
              <div className="font-medium">{cat.name}</div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
