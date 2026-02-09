import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import FocusLock from 'react-focus-lock';
import Head from 'next/head';
import Link from 'next/link';
// Layout wrapper is provided by `src/pages/_app.tsx`; do not double-wrap pages.
import ProductCard from '@/components/ProductCard';
import CategoryTiles from '@/components/CategoryTiles';
import { getProducts, Product as ProductType } from '@/data/demoProducts';
import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';

const GENDER_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'male', label: 'Erkek' },
  { key: 'female', label: 'Kadın' },
];

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
  const router = useRouter();
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  const [products, setProducts] = useState<ProductType[]>([]);
  // category state — can be set via query param (?category=ic-giyim)
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<ProductType | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [allowHoverZoom, setAllowHoverZoom] = useState(false);
  const [hasHoveredOnce, setHasHoveredOnce] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
    return activeProduct.i18nTitle?.[lang] ?? activeProduct.title ?? ''
  }, [activeProduct, lang])

  useEffect(() => {
    setProducts(getProducts());
    function onProductsChange() {
      setProducts(getProducts());
    }
    // storage event for other tabs, custom event for same-tab updates
    window.addEventListener('storage', onProductsChange);
    window.addEventListener('yasar:products:changed', onProductsChange as EventListener);
    return () => {
      window.removeEventListener('storage', onProductsChange);
      window.removeEventListener('yasar:products:changed', onProductsChange as EventListener);
    };
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

  useEffect(() => {
    let allowTimer: number | undefined;
    if (activeProduct) setTimeout(() => closeBtnRef.current?.focus(), 0);
    const resetTimer = window.setTimeout(() => {
      setAllowHoverZoom(false);
      setHasHoveredOnce(false);
      setZoom(false);
      if (activeProduct) allowTimer = window.setTimeout(() => setAllowHoverZoom(true), 220);
    }, 0);
    return () => {
      if (resetTimer) window.clearTimeout(resetTimer);
      if (allowTimer) window.clearTimeout(allowTimer);
    };
  }, [activeProduct]);

  // If the page is opened with a ?product=<id> query (e.g. from favorites dropdown),
  // open the modal for that product and scroll it into view.
  useEffect(() => {
    if (!router) return;
    const pid = router.query.product as string | undefined;
  if (!pid) return;
  const p = products.find((x) => x.id === pid);
    if (!p) return;
    // open modal
    openProductModal(p);
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

  return (
    <>
      <Head>
        <title>{tr('pages.products.title','Ürünler — Yasar')}</title>
        <meta name="description" content={tr('pages.products.description','Yasar ürün koleksiyonu')} />
      </Head>

      {/* HERO */}
      <section className="bg-gradient-to-br from-amber-300 via-pink-300 to-indigo-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {tr('pages.products.hero.title','Erkek & Kadın İç Giyim Koleksiyonu')}
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              {tr('pages.products.hero.subtitle','Günlük kullanıma uygun, yüksek kaliteli kumaşlarla üretilmiş ürünlerimizi inceleyin.')}
            </p>
            <div className="mt-8 flex gap-3">
              <a href="#liste" className="px-6 py-3 bg-black text-white rounded-full font-semibold cursor-pointer">
                {tr('pages.products.hero.ctaInspect','Ürünleri İncele')}
              </a>
              <Link href="/contact" className="px-6 py-3 bg-white/20 border border-white/30 rounded-full font-semibold cursor-pointer">
                {tr('pages.products.hero.ctaContact','Bizimle İletişime Geç')}
              </Link>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* FILTERS */}
      <section id="liste" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 mb-6 sticky top-[calc(var(--site-header-height)+8px)] z-20 bg-white p-2 rounded-md">
          {GENDER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setGender(t.key as 'all' | 'male' | 'female')}
              className={`px-4 py-1.5 rounded-full ${gender === t.key ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              {tr(`pages.products.gender.${t.key}`, t.label)}
            </button>
          ))}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr('pages.products.searchPlaceholder','Ürün ara')}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-500">{tr('pages.products.noResults','Sonuç bulunamadı')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onInspect={openProductModal} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <CategoryTiles />
      </section>

      {/* MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveProduct(null)} />
          <div
            className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden ring-1 ring-black/5 transform-gpu transition-all duration-300"
            role="dialog"
            aria-modal="true"
            style={{ maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}
          >
            <FocusLock>
              <div className="grid md:grid-cols-2">
                <div className="bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                  <div
                    className="relative rounded-lg overflow-hidden bg-white/50 flex items-center justify-center"
                    style={{ width: '100%', maxWidth: 720, maxHeight: '86vh', overflow: 'hidden' }}
                    onMouseEnter={() => {
                      if (!allowHoverZoom) return;
                      if (!hasHoveredOnce) {
                        setZoom(true);
                        setHasHoveredOnce(true);
                        window.setTimeout(() => setZoom(false), 1200);
                      }
                    }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      // If hover-zoom isn't allowed yet, ignore clicks
                      if (!allowHoverZoom) return;
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const clickY = e.clientY - rect.top;
                      const xPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                      const yPercent = Math.max(0, Math.min(100, (clickY / rect.height) * 100));
                      setZoomOrigin({ x: xPercent, y: yPercent });

                      if (!hasHoveredOnce) {
                        // first interaction: mark hovered and zoom in
                        setHasHoveredOnce(true);
                        setZoom(true);
                        // don't auto-zoom-out here; user can click again to toggle off
                        return;
                      }

                      // toggle zoom state (click toggles after initial preview)
                      setZoom((s) => !s);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <Image
                      src={modalSrc}
                      alt={activeProduct?.i18nTitle?.[lang] ?? activeProduct?.title}
                      width={1200}
                      height={900}
                      className="object-contain transition-transform duration-300 will-change-transform"
                      style={{
                        transform: zoom ? 'scale(1.5)' : 'none',
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        cursor: hasHoveredOnce ? (zoom ? 'zoom-out' : 'zoom-in') : 'zoom-in',
                      }}
                    />
                  </div>
                </div>

                <div className="p-6 flex flex-col">
                    <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-semibold">{activeTitle}</h3>
                    <button
                      ref={closeBtnRef}
                      onClick={() => setActiveProduct(null)}
                      aria-label={tr('common.close','Kapat')}
                      className="p-2 rounded-full bg-white text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                    <p className="mt-4 text-gray-600 flex items-center gap-3">
                    <span>{tr('pages.products.productCode','Ürün kodu:')}</span>
                    <span className="font-mono">{activeProduct.productCode ?? ''}</span>
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
                          // small haptic feedback if available
                          if (navigator.vibrate) navigator.vibrate?.(10);
                          setCopiedCode(true);
                          window.setTimeout(() => setCopiedCode(false), 1600);
                        } catch (err) {
                          void err;
                        }
                      }}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition"
                      aria-label={`${tr('pages.products.copyCodeAria','Ürün kodunu kopyala')} ${activeProduct.productCode ?? ''}`}
                    >
                      {tr('pages.products.copy','Kopyala')}
                    </button>
                    {copiedCode && <span className="text-sm text-amber-600">{tr('pages.products.copied','Kopyalandı')}</span>}
                  </p>

                  <div className="mt-6 flex gap-2">
                    {activeProduct.images?.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setModalIndex(i)}
                        className={`w-14 h-14 border rounded overflow-hidden ${modalIndex === i ? 'ring-2 ring-amber-400' : ''} cursor-pointer transform transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-300`}
                        aria-label={`${tr('pages.products.preview','Önizleme')} ${i + 1}`}
                      >
                        <Image src={img} alt="" width={56} height={56} className="object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex gap-3 justify-end">
                    <Link
                      href={`/contact?product=${encodeURIComponent(activeTitle ?? '')}`}
                      className="px-6 py-3 bg-amber-400 text-black rounded-full font-semibold shadow-sm hover:bg-amber-500 transition-colors duration-150 cursor-pointer min-w-[160px] text-center"
                      aria-label={`${tr('pages.products.requestInfoAria','Bilgi Al -')} ${activeTitle ?? ''}`}
                    >
                      {tr('pages.products.requestInfo','Bilgi Al')}
                    </Link>
                  </div>
                </div>
              </div>
            </FocusLock>
          </div>
        </div>
      )}
      </>
  );
}