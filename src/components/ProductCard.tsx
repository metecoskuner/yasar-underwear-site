import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import useWishlist from '@/hooks/useWishlist';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../data/demoProducts';

export default function ProductCard({
  product,
  onInspect,
  showWishlist = true,
  elementId,
}: {
  product: Product;
  onInspect?: (p: Product, preview?: number | string) => void;
  showWishlist?: boolean;
  elementId?: string;
}) {
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const PLACEHOLDER = '/photos/PYJAMA-BRANDS.avif';
  const [errored, setErrored] = useState<Record<number, boolean>>({});
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
  const langKey = String(lang).toLowerCase();
  const rawLocalized = product.i18nTitle?.[langKey];
  const displayTitle = (rawLocalized && String(rawLocalized).trim()) ? String(rawLocalized) : (product.title ?? '');

  const categoryNames: Record<string, string> = {
    'ic-giyim': tr('components.productCard.categories.ic-giyim', 'İç Giyim'),
    'ev-giyim': tr('components.productCard.categories.ev-giyim', 'Ev Giyimi'),
    corap: tr('components.productCard.categories.corap', 'Çorap & Aksesuar'),
    aktif: tr('components.productCard.categories.aktif', 'Aktif & Rahat'),
  };

  const thumbs = gallery.length ? gallery.slice(0, 3) : Array.from({ length: 3 }).map((_, i) => `placeholder-${i}`);
  const extraCount = Math.max(0, gallery.length - thumbs.length);

  const showPrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!gallery.length) return;
    setActive((current) => (current - 1 + gallery.length) % gallery.length);
  };

  const showNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!gallery.length) return;
    setActive((current) => (current + 1) % gallery.length);
  };

  return (
    <div
      id={elementId}
      role="button"
      tabIndex={0}
      aria-label={`${tr('components.productCard.openDetails', 'Ürün detayını aç')}: ${displayTitle}`}
      onClick={() => onInspect?.(product, active)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInspect?.(product, active);
        }
      }}
      className="group overflow-hidden rounded-[26px] border border-stone-200/80 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.34)] cursor-pointer transition duration-300 md:hover:-translate-y-1.5 md:hover:border-stone-300 md:hover:shadow-[0_30px_65px_-30px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
  <div className={`relative product-card-media h-[300px] sm:h-[340px] md:h-[380px] lg:h-[400px] flex items-center justify-center overflow-hidden ${product.color ?? 'bg-stone-100'}`}>
        {/* category badge */}
        {product.category && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
            {categoryNames[product.category] ?? product.category}
          </div>
        )}

        {/* wishlist */}
        {showWishlist && (
          <button
            onClick={(e) => {
                e.stopPropagation();
                // If we're inside admin pages, avoid triggering client wishlist UI or
                // dispatching events that other parts of the site listen to. Admin
                // editors may reuse product cards for management actions and we
                // should not modify local user wishlist or open UI in that context.
                if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin')) {
                  return;
                }

                const wasFav = isFavorite(product.id);
                // pass the product object so the hook can persist minimal metadata
                toggle(product);
                if (!wasFav) {
                  setPopping(true);
                  window.setTimeout(() => setPopping(false), 380);
                }
                if (!wasFav && typeof navigator !== 'undefined') {
                  // navigator.vibrate is not on every platform; cast to an extended Navigator
                  const nav = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean | void };
                  nav.vibrate?.(10);
                }
              }}
              aria-pressed={isFavorite(product.id)}
            data-wishlist-button="true"
              aria-label={isFavorite(product.id) ? tr('components.productCard.wishlist.remove', 'Favorilerden çıkar') : tr('components.productCard.wishlist.add', 'Favorilere ekle')}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/88 p-2.5 text-gray-700 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer touch-manipulation"
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
          <Image
            key={gallery[active]}
            src={errored[active] ? PLACEHOLDER : (gallery[active] as string)}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setErrored((s) => ({ ...s, [active]: true }))}
            className="pointer-events-none object-cover object-center"
          />
        ) : (
          <Image src={PLACEHOLDER} alt={tr('components.productCard.imageAlt', 'Ürün görseli')} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="pointer-events-none object-cover object-center" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevImage}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-lg font-semibold text-slate-800 shadow-md transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 cursor-pointer"
              aria-label="Önceki fotoğraf"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-lg font-semibold text-slate-800 shadow-md transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 cursor-pointer"
              aria-label="Sonraki fotoğraf"
            >
              ›
            </button>
            <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center gap-1.5 px-4 md:hidden">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(idx);
                  }}
                  className={`h-1.5 rounded-full transition cursor-pointer ${active === idx ? 'w-6 bg-white' : 'w-2 bg-white/55'}`}
                  aria-label={`${idx + 1}. fotoğraf`}
                  aria-current={active === idx}
                />
              ))}
            </div>
          </>
        )}

        {/* Desktop thumbnails */}
        <div className="absolute bottom-4 right-4 z-10 hidden gap-2 md:flex">
              {thumbs.map((t, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (active === idx) onInspect?.(product, t);
                else setActive(idx);
              }}
              className={`h-14 w-14 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 cursor-pointer transition ${active === idx ? 'scale-[1.02] ring-2 ring-white shadow-md' : 'opacity-85 hover:opacity-100'}`}
              aria-current={active === idx}
            >
              {gallery[idx] ? (
                <Image
                  key={t}
                  src={errored[idx] ? PLACEHOLDER : (t as string)}
                  alt=""
                  width={56}
                  height={56}
                  onError={() => setErrored((s) => ({ ...s, [idx]: true }))}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </button>
          ))}
          {extraCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInspect?.(product, active);
              }}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/70 text-xs font-semibold text-white shadow backdrop-blur-sm cursor-pointer"
              aria-label={`${extraCount} fotoğraf daha görüntüle`}
            >
              +{extraCount}
            </button>
          )}
        </div>
      </div>

      {/* Mobile thumbnails */}
      <div className="mt-3 flex gap-2 px-4 md:hidden">
        {thumbs.map((t, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (active === idx) onInspect?.(product, t);
              else setActive(idx);
            }}
            className={`h-12 w-12 overflow-hidden rounded-xl border border-stone-200 cursor-pointer transition ${active === idx ? 'ring-2 ring-slate-900' : 'opacity-80'}`}
          >
            {gallery[idx] ? <Image src={t} alt="" width={48} height={48} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-200" />}
          </button>
        ))}
        {extraCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect?.(product, active);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/80 text-xs font-semibold text-white cursor-pointer"
            aria-label={`${extraCount} foto daha görüntüle`}
          >
            +{extraCount}
          </button>
        )}
      </div>

      <div className="space-y-2 p-5">
  <h3 className="text-base font-semibold tracking-[0.01em] text-slate-900 truncate">{displayTitle}</h3>
  {/* Product code shown prominently on card for quick reference */}
  {product.productCode ? (
    <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-[11px] font-mono text-slate-500">{`${tr('pages.products.productCode','Ürün kodu:')} ${product.productCode}`}</div>
  ) : null}
  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
    <span>{tr('components.productCard.viewInCollection', 'Koleksiyonda görüntüle')}</span>
    <span className="text-sm transition-transform duration-300 md:group-hover:translate-x-1">→</span>
  </div>
      </div>
    </div>
  );
}
