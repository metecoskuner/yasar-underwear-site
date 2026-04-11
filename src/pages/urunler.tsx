import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import FocusLock from 'react-focus-lock';
import Head from 'next/head';
import Link from 'next/link';
// Layout wrapper is provided by `src/pages/_app.tsx`; do not double-wrap pages.
import ProductCard from '@/components/ProductCard';
import type { Product as ProductType } from '@/types/product';
import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = "force-dynamic";

const GENDER_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'male', label: 'Erkek' },
  { key: 'female', label: 'Kadın' },
];

const CATEGORY_LABELS: Record<string, string> = {
  'ic-giyim': 'İç Giyim',
  'ev-giyim': 'Ev Giyimi',
  corap: 'Çorap & Aksesuar',
  aktif: 'Aktif & Rahat',
};

export default function UrunlerPage() {
  const { t, lang } = useLanguage();
  
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  
  const langKey = String(lang).toLowerCase();
  const router = useRouter();
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  const [products, setProducts] = useState<ProductType[]>([]);
  // category state — can be set via query param (?category=ic-giyim)
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<ProductType | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [magnifier, setMagnifier] = useState<{ x: number; y: number; offsetX: number; offsetY: number }>({
    x: 50,
    y: 50,
    offsetX: 0,
    offsetY: 0,
  });
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage-based client cache disabled during debugging — rely on API

  function safeParseStringArray(input: unknown): string[] {
    if (Array.isArray(input)) return input.filter((item): item is string => typeof item === 'string');
    if (typeof input !== 'string') return [];
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  function normalizeI18nMap(input: unknown): Record<string, string> | undefined {
    if (input && typeof input === 'object' && !Array.isArray(input)) {
      return Object.fromEntries(
        Object.entries(input as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')])
      );
    }
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return Object.fromEntries(
            Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')])
          );
        }
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  function openProductModal(product: ProductType, preview?: number | string) {
    let index = 0;
    if (typeof preview === 'number') index = preview;
    else if (typeof preview === 'string') {
      const i = product.images?.indexOf(preview);
      index = i !== undefined && i >= 0 ? i : 0;
    }
    setModalIndex(index);
    setActiveProduct(product);
  }

  const activeTitle = React.useMemo(() => {
    if (!activeProduct) return ''
    // Product titles are dynamic and should come from product data, not locale files.
    const langKey = String(lang).toLowerCase();
    const rawLocalized = activeProduct.i18nTitle?.[langKey];
    return (rawLocalized && String(rawLocalized).trim()) ? String(rawLocalized) : (activeProduct.title ?? '');
  }, [activeProduct, lang])

  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/content', { cache: 'no-store' })
        if (!res.ok) {
          if (mounted) setIsLoading(false)
          return
        }
        const j = await res.json()
        // Accept multiple shapes from /api/content during debugging:
        // - legacy: { content: { products: [...] } }
        // - debug/raw: [ ...products ]
        const list = Array.isArray(j)
          ? j
          : Array.isArray(j?.content?.products)
          ? j.content.products
          : Array.isArray(j?.products)
          ? j.products
          : []
        if (!mounted) return
        function mapGender(raw: unknown) {
          if (!raw && raw !== '') return undefined
          const s = String(raw ?? '').trim().toLowerCase()
          if (!s) return undefined
          if (s.startsWith('erk') || s === 'male' || s === 'm') return 'male'
          if (s.startsWith('kad') || s === 'female' || s === 'f') return 'female'
          return undefined
        }

        const normalized = list.map((raw: unknown) => {
          const p = raw as Record<string, unknown>;
          const imgs = safeParseStringArray(p.images);

          let i18nTitle: Record<string, string> | undefined = undefined;
          let i18nDescription: Record<string, string> | undefined = undefined;
          let titleFallback = '';
          try {
            i18nTitle = normalizeI18nMap(p.i18nTitle);
            i18nDescription = normalizeI18nMap(p.i18nDescription);
            if (i18nTitle) {
              titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle).find((x) => !!x) || '';
            } else if (typeof p.title === 'string') {
              const parsedTitle = normalizeI18nMap(p.title);
              if (parsedTitle) {
                i18nTitle = parsedTitle;
                titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle).find((x) => !!x) || '';
              } else {
                titleFallback = String(p.title);
              }
            }
          } catch {
            // ignore parsing errors
          }

          return {
            id: String(p.id),
            title: titleFallback || String(p.title ?? ''),
            i18nTitle,
            i18nDescription,
            productCode: typeof p.productCode === 'string' ? p.productCode : undefined,
            description: typeof p.description === 'string' ? p.description : undefined,
            images: imgs,
            image: typeof p.image === 'string' ? p.image : imgs[0],
            color: typeof p.color === 'string' ? p.color : undefined,
            stock: typeof p.stock === 'number' ? p.stock : Number(p.stock) || 0,
            createdAt: p.createdAt ? new Date(Number(p.createdAt) || String(p.createdAt)).toISOString() : undefined,
            gender: mapGender(p.gender),
            category: typeof p.category === 'string' ? p.category : undefined,
          } as ProductType;
        }) as ProductType[];
        
        // Always set products if mounted - no additional normalization needed
        // The API endpoint already returns normalized data
        if (mounted) {
          setProducts(normalized)
          setIsLoading(false)
        }
      } catch (err) {
        void err;
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (gender !== 'all' && p.gender !== gender) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (query.trim()) {
        const qc = query.toLowerCase();
        const title = (p.title || '').toLowerCase();
        const code = (p.productCode || '').toLowerCase();
        if (!title.includes(qc) && !code.includes(qc)) return false;
      }
      return true;
    });
  }, [products, gender, category, query]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(products.map((product) => product.category).filter(Boolean))) as string[];
    return values;
  }, [products]);

  const activeProductIndex = useMemo(() => {
    if (!activeProduct) return -1;
    return filtered.findIndex((item) => item.id === activeProduct.id);
  }, [activeProduct, filtered]);

  const relatedProducts = useMemo(() => {
    if (!activeProduct) return [];

    const sameCategory = filtered.filter((item) => item.id !== activeProduct.id && item.category === activeProduct.category);
    const sameGender = filtered.filter((item) => item.id !== activeProduct.id && item.gender === activeProduct.gender);
    const fallback = filtered.filter((item) => item.id !== activeProduct.id);

    const merged = [...sameCategory, ...sameGender, ...fallback];
    const unique = merged.filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index);
    return unique.slice(0, 3);
  }, [activeProduct, filtered]);

  const hasActiveFilters = gender !== 'all' || category !== 'all' || query.trim().length > 0;

  useEffect(() => {
    setCopiedCode(false);
    setIsMagnifierVisible(false);
    if (activeProduct) setTimeout(() => closeBtnRef.current?.focus(), 0);
    return undefined;
  }, [activeProduct]);

  useEffect(() => {
    if (!activeProduct || typeof document === 'undefined') return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveProduct(null);
        return;
      }
      if (event.key === 'ArrowUp' && activeProductIndex > 0) {
        event.preventDefault();
        openProductModal(filtered[activeProductIndex - 1], 0);
        return;
      }
      if (event.key === 'ArrowDown' && activeProductIndex >= 0 && activeProductIndex < filtered.length - 1) {
        event.preventDefault();
        openProductModal(filtered[activeProductIndex + 1], 0);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProduct, activeProductIndex, filtered]);

  // If the page is opened with a ?product=<id> query (e.g. from favorites dropdown),
  // open the modal for that product and scroll it into view.
  useEffect(() => {
    if (!router) return;
    const pid = router.query.product as string | undefined;
  if (!pid) return;
  const p = products.find((x) => x.id === pid);
    if (!p) return;
    // open modal
    const rawPreview = router.query.preview as string | string[] | undefined
    let preview: number | string | undefined = undefined
    if (typeof rawPreview === 'string') {
      const n = Number(rawPreview)
      if (!Number.isNaN(n)) preview = n
      else preview = rawPreview
    }
    openProductModal(p, preview)
    // scroll to product card after a short delay so layout is ready
    window.setTimeout(() => {
      const el = document.getElementById(`product-${p.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
    // remove query param so it doesn't re-trigger on history navigation
    void router.replace(router.pathname, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.product]);

  // If the page is opened with a ?category=<slug> query (from homepage tiles),
  // set the category filter and remove the query param to avoid re-triggering on back/forward.
  useEffect(() => {
    if (!router) return;
    const cat = router.query.category as string | undefined;
    if (!cat) return;
    setCategory(cat);
    // remove category query param shallowly
    try {
      const { pathname, query } = router;
      const nextQuery = { ...(query as Record<string, string>) };
      delete nextQuery.category;
      void router.replace({ pathname, query: nextQuery }, undefined, { shallow: true });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.category]);

  const modalSrc = activeProduct?.images?.[modalIndex] ?? activeProduct?.image ?? '/photos/placeholder.png';
  const modalImages = activeProduct?.images?.length ? activeProduct.images : activeProduct?.image ? [activeProduct.image] : [];
  const activeCategoryLabel = activeProduct?.category
    ? ({
        'ic-giyim': tr('components.productCard.categories.ic-giyim', 'İç Giyim'),
        'ev-giyim': tr('components.productCard.categories.ev-giyim', 'Ev Giyimi'),
        corap: tr('components.productCard.categories.corap', 'Çorap & Aksesuar'),
        aktif: tr('components.productCard.categories.aktif', 'Aktif & Rahat'),
      }[activeProduct.category] ?? activeProduct.category)
    : null;

  function showPrevImage() {
    if (!modalImages.length) return;
    setModalIndex((current) => (current - 1 + modalImages.length) % modalImages.length);
  }

  function showNextImage() {
    if (!modalImages.length) return;
    setModalIndex((current) => (current + 1) % modalImages.length);
  }

  function resetFilters() {
    setGender('all');
    setCategory('all');
    setQuery('');
  }

  function showPrevProduct() {
    if (activeProductIndex <= 0) return;
    openProductModal(filtered[activeProductIndex - 1], 0);
  }

  function showNextProduct() {
    if (activeProductIndex < 0 || activeProductIndex >= filtered.length - 1) return;
    openProductModal(filtered[activeProductIndex + 1], 0);
  }

  function handleMagnifierMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    setMagnifier({
      x: Math.max(0, Math.min(100, (offsetX / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (offsetY / rect.height) * 100)),
      offsetX,
      offsetY,
    });
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current == null) return;
    touchDeltaXRef.current = (event.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current;
  }

  function handleTouchEnd() {
    if (touchStartXRef.current == null) return;
    const deltaX = touchDeltaXRef.current;
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;

    if (Math.abs(deltaX) < 36) return;
    if (deltaX < 0) showNextImage();
    else showPrevImage();
  }

  return (
    <div suppressHydrationWarning>
      <Head>
        <title>{tr('pages.products.title','Ürünler — Yasar')}</title>
        <meta name="description" content={tr('pages.products.description','Yasar ürün koleksiyonu')} />
      </Head>

      {/* HERO */}
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.35),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.18),_transparent_28%),linear-gradient(135deg,#475569_0%,#64748b_34%,#1e293b_100%)] text-white">
        <div className="max-w-6xl mx-auto grid gap-8 px-4 py-12 sm:gap-10 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
              Yaşar Koleksiyonu
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {tr('pages.products.hero.title','Erkek ve Kadın İç Giyim Koleksiyonu')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/86 sm:mt-4 sm:text-base">
              {tr('pages.products.hero.subtitle','Yaşar Tekstil koleksiyonundaki ürünleri; kategori, ürün kodu ve görsel seçenekleriyle tek ekranda inceleyin. Günlük kullanıma uygun, yüksek kaliteli modelleri hızlıca karşılaştırın.')}
            </p>
            <div className="mt-6 flex flex-col sm:mt-8 sm:flex-row gap-3">
              <a href="#liste" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-stone-100 cursor-pointer">
                {tr('pages.products.hero.ctaInspect','Ürünleri İncele')}
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/14 px-6 py-3 font-semibold text-white transition hover:bg-white/20 cursor-pointer">
                {tr('pages.products.hero.ctaContact','Bizimle İletişime Geç')}
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-[30px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.6)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{tr('pages.products.hero.guide.eyebrow','Koleksiyon Rehberi')}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {tr('pages.products.hero.guide.title','Doğru modele daha hızlı ulaşın')}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/74">
                {tr('pages.products.hero.guide.body','Koleksiyon içinde ilerlerken filtreleri, ürün kodlarını ve görsel seçeneklerini birlikte kullanabilirsiniz.')}
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{tr('pages.products.hero.guide.items.filters.title','Kategori filtreleriyle koleksiyonu daraltın')}</p>
                  <p className="mt-1 text-sm text-white/68">{tr('pages.products.hero.guide.items.filters.body','İhtiyacınız olan ürün grubuna birkaç adımda ulaşın.')}</p>
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{tr('pages.products.hero.guide.items.code.title','Ürün kodu ile hızlı arama yapın')}</p>
                  <p className="mt-1 text-sm text-white/68">{tr('pages.products.hero.guide.items.code.body','Teklif ve sipariş sürecinde doğru ürünü hızlıca ayırt edin.')}</p>
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{tr('pages.products.hero.guide.items.gallery.title','Detay modali ile tüm görselleri inceleyin')}</p>
                  <p className="mt-1 text-sm text-white/68">{tr('pages.products.hero.guide.items.gallery.body','Aynı ürünün farklı açılarını tek ekranda karşılaştırın.')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug banner removed */}
      </section>

      {/* FILTERS */}
      <section id="liste" className="bg-stone-50/70">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ürün Seçkisi</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Koleksiyonu kategori ve ürün koduna göre inceleyin</h2>
          </div>
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-black/5">
            {filtered.length} ürün
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2.5 lg:sticky lg:top-[calc(var(--site-header-height)+12px)] z-20 rounded-[24px] bg-white/92 p-3 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.4)] backdrop-blur-md ring-1 ring-black/5">
          {GENDER_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setGender(t.key as 'all' | 'male' | 'female')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${gender === t.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}`}
            >
              {tr(`pages.products.gender.${t.key}`, t.label)}
            </button>
          ))}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr('pages.products.searchPlaceholder','Ürün ara')}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white sm:min-w-[14rem] sm:flex-1"
          />
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-stone-100 cursor-pointer"
            >
              Filtreleri temizle
            </button>
          ) : null}
        </div>

        {categories.length > 0 ? (
          <div className="-mx-4 mb-8 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${category === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-black/5 hover:bg-stone-100'}`}
            >
              Tüm kategoriler
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${category === item ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-600 ring-1 ring-black/5 hover:bg-stone-100'}`}
              >
                {CATEGORY_LABELS[item] ?? item}
              </button>
            ))}
          </div>
          </div>
        ) : null}

        {hasActiveFilters ? (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">Aktif seçimler:</span>
            {gender !== 'all' ? <span className="rounded-full bg-stone-200 px-3 py-1">{GENDER_TABS.find((tab) => tab.key === gender)?.label}</span> : null}
            {category !== 'all' ? <span className="rounded-full bg-stone-200 px-3 py-1">{CATEGORY_LABELS[category] ?? category}</span> : null}
            {query.trim() ? <span className="rounded-full bg-stone-200 px-3 py-1">Arama: {query.trim()}</span> : null}
          </div>
        ) : null}

        {/* Render filtered products via ProductCard */}
        {isLoading ? (
          <div className="py-24 text-center text-gray-500">{tr('common.loading', 'Yükleniyor...')}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">{tr('pages.products.noResults','Sonuç bulunamadı')}</p>
            <p className="mt-2 text-sm text-slate-500">Farklı bir ürün kodu deneyebilir veya filtreleri temizleyerek tüm koleksiyona dönebilirsiniz.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
            >
              Filtreleri sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onInspect={openProductModal} elementId={`product-${p.id}`} />
            ))}
          </div>
        )}
        </div>
      </section>

      {/* categories removed from products page as requested */}

      {/* MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:px-4 md:items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveProduct(null)} />
          <div
            className="relative h-[100svh] w-full max-w-7xl overflow-y-auto overflow-x-hidden rounded-none bg-[#fcfbf8] shadow-[0_40px_120px_-40px_rgba(15,23,42,0.5)] ring-1 ring-black/5 transform-gpu transition-all duration-300 sm:h-auto sm:rounded-t-[24px] sm:rounded-b-[32px] md:overflow-hidden"
            role="dialog"
            aria-modal="true"
            style={{ maxHeight: '100vh' }}
          >
            <FocusLock>
              <div className="flex min-h-[100svh] flex-col md:grid md:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] md:h-auto md:max-h-[calc(100vh-24px)]">
                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
                  <div className="min-w-0">
                    {activeCategoryLabel ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {activeCategoryLabel}
                      </p>
                    ) : null}
                    <h3 className="truncate pr-4 text-base font-semibold text-slate-900">
                      {activeTitle}
                    </h3>
                  </div>
                  <button
                    ref={closeBtnRef}
                    onClick={() => setActiveProduct(null)}
                    aria-label={tr('common.close','Kapat')}
                    className="shrink-0 rounded-full border border-stone-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="relative shrink-0 bg-white md:min-h-0 md:overflow-hidden md:border-r md:border-stone-200 md:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_26%),linear-gradient(180deg,#f8fafc_0%,#f5f5f4_100%)] md:p-6 lg:p-8">
                  {modalImages.length > 1 ? (
                    <div className="absolute right-4 top-4 z-20 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm md:hidden">
                      {modalIndex + 1} / {modalImages.length}
                    </div>
                  ) : null}
                  <div className="md:grid md:grid-cols-[88px_minmax(0,1fr)] md:items-center md:gap-5 lg:grid-cols-[96px_minmax(0,1fr)]">
                    {modalImages.length > 1 ? (
                      <div className="hidden md:flex md:max-h-[72vh] md:flex-col md:justify-center md:gap-3 md:overflow-y-auto md:pr-1">
                        {modalImages.map((img, i) => (
                          <button
                            key={`${img}-desktop-thumb`}
                            type="button"
                            onClick={() => setModalIndex(i)}
                            className={`group relative h-20 w-20 overflow-hidden rounded-[20px] border bg-white transition duration-200 ${modalIndex === i ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-md' : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'}`}
                            aria-label={`${tr('pages.products.preview','Önizleme')} ${i + 1}`}
                          >
                            <Image src={img} alt="" fill sizes="96px" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <div
                      className="relative flex min-h-[46svh] w-full items-center justify-center bg-white px-4 py-5 md:min-h-[78vh] md:rounded-[32px] md:border md:border-stone-200 md:px-6 md:py-6 md:shadow-[0_30px_65px_-36px_rgba(15,23,42,0.24)]"
                      style={{ width: '100%', touchAction: 'pan-y' }}
                      onMouseEnter={() => setIsMagnifierVisible(true)}
                      onMouseLeave={() => setIsMagnifierVisible(false)}
                      onMouseMove={handleMagnifierMove}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      role="region"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          showPrevImage();
                          return;
                        }
                        if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          showNextImage();
                        }
                      }}
                      aria-label="Ürün görseli alanı"
                    >
                      {modalImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showPrevImage();
                            }}
                            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-lg font-semibold text-slate-800 shadow transition hover:bg-white cursor-pointer md:flex"
                            aria-label="Önceki fotoğraf"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showNextImage();
                            }}
                            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-lg font-semibold text-slate-800 shadow transition hover:bg-white cursor-pointer md:flex"
                            aria-label="Sonraki fotoğraf"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:bottom-4 sm:block sm:text-xs">
                            {modalIndex + 1} / {modalImages.length}
                          </div>
                        </>
                      )}
                      <Image
                        src={modalSrc}
                        alt={(() => {
                          if (!activeProduct) return '';
                          const lk = String(lang).toLowerCase();
                          const raw = activeProduct.i18nTitle?.[lk];
                          return (raw && String(raw).trim()) ? String(raw) : (activeProduct.title ?? '');
                        })()}
                        width={1200}
                        height={900}
                        className="block h-auto max-h-[58svh] w-full max-w-full object-contain object-center md:max-h-[72vh] md:p-0"
                        style={{ cursor: 'zoom-in' }}
                      />
                      {isMagnifierVisible && (
                        <div
                          className="pointer-events-none absolute hidden h-52 w-52 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white/95 shadow-[0_28px_65px_-24px_rgba(15,23,42,0.78)] ring-1 ring-black/10 md:block"
                          style={{
                            left: magnifier.offsetX,
                            top: magnifier.offsetY,
                            backgroundImage: `url(${modalSrc})`,
                            backgroundPosition: `${magnifier.x}% ${magnifier.y}%`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '520%',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {modalImages.length > 1 ? (
                    <div className="flex items-center justify-center gap-2 border-b border-stone-200 px-4 pb-4 pt-1 md:hidden">
                      {modalImages.map((img, i) => (
                        <button
                          key={`${img}-mobile-dot`}
                          type="button"
                          onClick={() => setModalIndex(i)}
                          className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                            modalIndex === i ? 'w-6 bg-slate-900' : 'w-2.5 bg-slate-300'
                          }`}
                          aria-label={`${tr('pages.products.preview','Önizleme')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="bg-[#fcfbf8] p-4 pt-5 sm:p-6 lg:p-8 md:min-h-0 md:max-h-[calc(100vh-24px)] md:flex md:overflow-y-auto">
                  <div className="mb-5 rounded-[24px] border border-stone-200 bg-stone-50/70 p-4 md:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      {activeCategoryLabel ? (
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 ring-1 ring-black/5">
                          {activeCategoryLabel}
                        </span>
                      ) : null}
                      {modalImages.length > 1 ? (
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-black/5">
                          {modalImages.length} görsel
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-[1.45rem] font-semibold leading-tight tracking-tight text-slate-900">
                      {activeTitle}
                    </h3>
                  </div>
                  <div className="w-full space-y-5 lg:space-y-6">
                  <div className="hidden items-start justify-between gap-4 border-b border-stone-200 pb-5 md:flex">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {activeCategoryLabel ? (
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 ring-1 ring-stone-200">
                            {activeCategoryLabel}
                          </span>
                        ) : null}
                        {modalImages.length > 1 ? (
                          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 ring-1 ring-amber-100">
                            {modalImages.length} görsel
                          </span>
                        ) : null}
                      </div>
                      <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">{activeTitle}</h3>
                      <p className="max-w-xl text-sm leading-6 text-slate-500">
                        Ürün detaylarını inceleyebilir, ürün kodunu kopyalayabilir ve doğrudan bilgi talebi oluşturabilirsiniz.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveProduct(null)}
                      aria-label={tr('common.close','Kapat')}
                      className="rounded-full border border-stone-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:bg-slate-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {filtered.length > 1 ? (
                    <div className="flex items-center justify-between rounded-[20px] border border-stone-200 bg-white px-3 py-3 shadow-sm sm:rounded-[22px] sm:px-4">
                      <button
                        type="button"
                        onClick={showPrevProduct}
                        disabled={activeProductIndex <= 0}
                        className="rounded-full px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                      >
                        ← Önceki ürün
                      </button>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                        {activeProductIndex + 1} / {filtered.length}
                      </span>
                      <button
                        type="button"
                        onClick={showNextProduct}
                        disabled={activeProductIndex < 0 || activeProductIndex >= filtered.length - 1}
                        className="rounded-full px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                      >
                        Sonraki ürün →
                      </button>
                    </div>
                  ) : null}

                  <div className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.28)]">
                    <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{tr('pages.products.productCode','Ürün kodu:')}</span>
                    <span className="rounded-full bg-white px-3 py-1.5 font-mono text-sm text-slate-800 shadow-sm ring-1 ring-black/5">{activeProduct.productCode ?? ''}</span>
                    {activeProduct.productCode && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            if (navigator.clipboard && activeProduct.productCode) {
                              await navigator.clipboard.writeText(activeProduct.productCode);
                            } else {
                              // fallback
                              const el = document.createElement('textarea');
                              el.value = activeProduct.productCode ?? '';
                              document.body.appendChild(el);
                              el.select();
                              document.execCommand('copy');
                              document.body.removeChild(el);
                            }
                            if (navigator.vibrate) navigator.vibrate?.(10);
                            setCopiedCode(true);
                            window.setTimeout(() => setCopiedCode(false), 1600);
                          } catch (err) {
                            void err;
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer"
                        aria-label={`${tr('pages.products.copyCodeAria','Ürün kodunu kopyala')} ${activeProduct.productCode ?? ''}`}
                      >
                        {tr('pages.products.copy','Kopyala')}
                      </button>
                    )}
                    {copiedCode && <span className="text-sm font-medium text-emerald-600">{tr('pages.products.copied','Kopyalandı')}</span>}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Teklif ve sipariş sürecinde doğru modele hızlıca referans vermek için ürün kodunu kullanabilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Kategori</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{activeCategoryLabel ?? 'Koleksiyon parçası'}</p>
                    </div>
                    <div className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Cinsiyet</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{activeProduct.gender === 'male' ? 'Erkek' : activeProduct.gender === 'female' ? 'Kadın' : 'Unisex'}</p>
                    </div>
                    <div className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Galeri</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{modalImages.length} görsel</p>
                    </div>
                  </div>

                  {/* Admin-provided description (localized if available) */}
                  {(() => {
                    const localizedDescription = (activeProduct?.i18nDescription && activeProduct.i18nDescription[langKey]) ?? activeProduct?.description;
                    if (!localizedDescription) return null;
                    return (
                      <div className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.3)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ürün Detayı</p>
                        <p className="mt-3 text-[15px] leading-7 text-slate-700">{localizedDescription}</p>
                      </div>
                    );
                  })()}

                  <div className="hidden rounded-[26px] border border-stone-200 bg-white p-5 shadow-sm md:block">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Görsel Seçenekleri</p>
                    <div className="grid grid-cols-4 gap-3">
                    {modalImages.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setModalIndex(i)}
                        className={`relative aspect-square overflow-hidden rounded-2xl border bg-white cursor-pointer transition duration-200 ${modalIndex === i ? 'scale-[1.03] border-slate-900 ring-2 ring-slate-900/10 shadow-md' : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm'}`}
                        aria-label={`${tr('pages.products.preview','Önizleme')} ${i + 1}`}
                      >
                        <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                      </button>
                    ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                    <Link
                      href={`/contact?product=${encodeURIComponent(activeTitle ?? '')}`}
                      className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-700 cursor-pointer text-center"
                      aria-label={`${tr('pages.products.requestInfoAria','Bilgi Al -')} ${activeTitle ?? ''}`}
                    >
                      {tr('pages.products.requestInfo','Bilgi Al')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveProduct(null)}
                      className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-stone-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-stone-50 cursor-pointer"
                    >
                      Koleksiyona dön
                    </button>
                    {/* Product structured data moved to dedicated product detail pages (SEO component). */}
                  </div>

                  {relatedProducts.length > 0 ? (
                    <div className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Benzer Ürünler</p>
                          <h4 className="mt-2 text-lg font-semibold text-slate-900">Koleksiyondaki benzer alternatifler</h4>
                        </div>
                        <span className="hidden text-xs font-medium text-slate-400 sm:inline">{relatedProducts.length} öneri</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {relatedProducts.map((item) => {
                          const itemTitle = (() => {
                            const localized = item.i18nTitle?.[langKey];
                            return localized && String(localized).trim() ? String(localized) : item.title ?? '';
                          })();
                          const itemImage = item.images?.[0] ?? item.image ?? '/photos/placeholder.png';
                          const itemCategory = item.category ? CATEGORY_LABELS[item.category] ?? item.category : null;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => openProductModal(item, 0)}
                              className="group overflow-hidden rounded-[22px] border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md cursor-pointer"
                            >
                              <div className="grid min-h-[128px] grid-cols-[104px_minmax(0,1fr)]">
                              <div className="relative overflow-hidden bg-stone-100">
                                <Image
                                  src={itemImage}
                                  alt={itemTitle}
                                  fill
                                  sizes="160px"
                                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                />
                              </div>
                              <div className="space-y-2 p-4">
                                {itemCategory ? (
                                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    {itemCategory}
                                  </div>
                                ) : null}
                                <div className="line-clamp-2 text-sm font-semibold text-slate-900">{itemTitle}</div>
                                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                  <span>{item.productCode ?? 'Ürün seçeneği'}</span>
                                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </div>
                              </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  </div>
                </div>
              </div>
            </FocusLock>
          </div>
        </div>
      )}
      </div>
  );
}
