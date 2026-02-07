import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import useWishlist from '@/hooks/useWishlist';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../data/demoProducts';

export default function ProductCard({
  product,
  onInspect,
  showWishlist = true,
}: {
  product: Product;
  onInspect?: (p: Product, preview?: number | string) => void;
  showWishlist?: boolean;
}) {
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [active, setActive] = useState(0);
  const activeResetRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeResetRef.current) window.clearTimeout(activeResetRef.current);
    activeResetRef.current = window.setTimeout(() => setActive(0), 0);
    return () => {
      if (activeResetRef.current) window.clearTimeout(activeResetRef.current);
    };
  }, [product.id]);

  const { isFavorite, toggle } = useWishlist();
  const [popping, setPopping] = useState(false);
  const { t, lang } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  // Product titles are dynamic data; do not route through i18n keys.
  const displayTitle = product.i18nTitle?.[lang] ?? product.title;

  const categoryNames: Record<string, string> = {
    'ic-giyim': tr('components.productCard.categories.ic-giyim', 'İç Giyim'),
    'ev-giyim': tr('components.productCard.categories.ev-giyim', 'Ev Giyimi'),
    corap: tr('components.productCard.categories.corap', 'Çorap & Aksesuar'),
    aktif: tr('components.productCard.categories.aktif', 'Aktif & Rahat'),
  };

  const thumbs = gallery.length ? gallery.slice(0, 3) : Array.from({ length: 3 }).map((_, i) => `placeholder-${i}`);

  return (
    <div
      role="button"
      tabIndex={0}
  aria-label={`${tr('components.productCard.inspect', 'İncele')}: ${product.title}`}
      onClick={() => onInspect?.(product, active)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInspect?.(product, active);
        }
      }}
      className="group rounded-lg overflow-hidden transform transition-transform duration-300 ease-out hover:scale-105 hover:shadow-md bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      <div className={`relative h-[214px] sm:h-[246px] md:h-[278px] lg:h-[400px] flex items-center justify-center ${product.color ?? 'bg-gray-100'}`}>
        {/* category badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-white/20 text-gray-300 text-xs px-2 py-1 rounded-md backdrop-blur-sm ring-1 ring-white/10">
            {categoryNames[product.category] ?? product.category}
          </div>
        )}

        {/* wishlist */}
        {showWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const wasFav = isFavorite(product.id);
              toggle(product.id);
              if (!wasFav) {
                setPopping(true);
                window.setTimeout(() => setPopping(false), 380);
              }
              if (!wasFav && typeof navigator !== 'undefined') {
                // navigator.vibrate is not on every platform; cast to an extended Navigator
                const nav = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean | void };
                nav.vibrate?.(10);
              }
              if (typeof window !== 'undefined') {
                if (!wasFav) window.dispatchEvent(new CustomEvent('yasar:wishlist:open', { detail: { id: product.id } }));
                window.dispatchEvent(new CustomEvent('yasar:wishlist:changed', { detail: { id: product.id, title: product.title, added: !wasFav } }));
              }
            }}
              aria-pressed={isFavorite(product.id)}
            data-wishlist-button="true"
              aria-label={isFavorite(product.id) ? tr('components.productCard.wishlist.remove', 'Favorilerden çıkar') : tr('components.productCard.wishlist.add', 'Favorilere ekle')}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 z-20 cursor-pointer touch-manipulation"
          >
            {isFavorite(product.id) ? (
              <svg className={`h-5 w-5 text-rose-500 ${popping ? 'pop-heart' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            ) : (
              <svg className={`h-5 w-5 ${popping ? 'pop-heart' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            )}
          </button>
        )}

        {/* main image */}
        {gallery[active] ? (
          <Image src={gallery[active]} alt={displayTitle} fill className="object-cover object-center pointer-events-none" />
        ) : (
          <div className="text-gray-500 text-sm">{tr('components.productCard.imageAlt', 'Ürün görseli')}</div>
        )}

        {/* Desktop thumbnails */}
        <div className="absolute left-4 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all hidden md:flex gap-2">
          {thumbs.map((t, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (active === idx) onInspect?.(product, t);
                else setActive(idx);
              }}
              className="w-14 h-14 rounded-md overflow-hidden bg-white shadow border cursor-pointer"
              aria-current={active === idx}
            >
              {gallery[idx] ? <Image src={t} alt="" width={56} height={56} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-200" />}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile thumbnails */}
      <div className="md:hidden mt-3 px-4 flex gap-2">
        {thumbs.map((t, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (active === idx) onInspect?.(product, t);
              else setActive(idx);
            }}
            className="w-12 h-12 rounded-md overflow-hidden border cursor-pointer"
          >
            {gallery[idx] ? <Image src={t} alt="" width={48} height={48} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-200" />}
          </button>
        ))}
      </div>

      <div className="p-4">
  <h3 className="text-sm font-semibold text-gray-800 truncate">{displayTitle}</h3>
  {/* Product code shown prominently on card for quick reference */}
  {product.productCode ? (
    <div className="text-xs text-gray-500 mt-1 font-mono">{`ürün kodu: ${product.productCode}`}</div>
  ) : null}
      </div>
    </div>
  );
}