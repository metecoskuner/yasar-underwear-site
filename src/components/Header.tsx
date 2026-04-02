import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { useLanguage } from "../contexts/LanguageContext";
import useWishlist, { WishlistItem } from '@/hooks/useWishlist';
import { getProducts } from '@/data/demoProducts';
import type { Product } from '@/data/demoProducts';

const NAV_ITEMS: Array<{
  href: string;
  label: string; // fallback (Turkish)
  labelKey?: string; // optional translation key (e.g. "nav.home")
  children?: { href: string; label: string; labelKey?: string; subtitleKey?: string }[];
}> = [
  { href: "/", label: "Ana Sayfa", labelKey: "nav.home" },
  {
    href: "/about",
    label: "Kurumsal",
  labelKey: "nav.corporate.title",
    children: [
      { href: "/about/hakkimizda", label: "Hakkımızda", labelKey: "nav.corporate.about", subtitleKey: "nav.corporate.aboutSubtitle" },
    ],
  },
  {
    href: "/uretim",
    label: "Üretim",
  labelKey: "nav.production.title",
    children: [
      { href: "/uretim/tesisler", label: "Üretim Tesislerimiz", labelKey: "nav.production.facilities", subtitleKey: "nav.production.facilitiesSubtitle" },
      { href: "/uretim/kalite-surecleri", label: "Kalite Süreçlerimiz", labelKey: "nav.production.quality", subtitleKey: "nav.production.qualitySubtitle" },
    ],
  },
  { href: "/surdurulebilirlik", label: "Sustainability", labelKey: "nav.sustainability" },
  { href: "/urunler", label: "Ürünler", labelKey: "nav.products" },
];

const CHILD_META: Record<string, { subtitle?: string }> = {
  '/uretim/tesisler': { subtitle: 'Tesis altyapısı, kapasite ve görseller' },
  '/uretim/kalite-surecleri': { subtitle: 'Kalite kontrolleri, testler ve sertifikasyon' },
  '/about/hakkimizda': { subtitle: 'Şirket geçmişi, değerler ve misyon & vizyon bilgileri' },
};

const LANG_OPTIONS = ["TR", "EN", "FR", "AR", "RU"] as const;
type LangOption = (typeof LANG_OPTIONS)[number];
const FLAGS: Record<LangOption, string> = { TR: "🇹🇷", EN: "🇬🇧", FR: "🇫🇷", AR: "🇸🇦", RU: "🇷🇺" };
const NAMES: Record<LangOption, string> = {
  TR: "Türkçe",
  EN: "English",
  FR: "Français",
  AR: "العربية",
  RU: "Русский",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);
  const mobileLangRef = useRef<HTMLDivElement | null>(null);
  const langToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileLangToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstLangButtonRef = useRef<HTMLButtonElement | null>(null);

  const { lang, setLang, t } = useLanguage();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // small helper to resolve translations with a Turkish fallback
  const tr = useCallback((key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  }, [t]);
  // label helpers replace verbose switch/case blocks for readability
  const getLabel = useCallback((href: string) => {
    const map: Record<string, string> = {
      '/': t('nav.home'),
      '/about': t('nav.corporate.title'),
      '/uretim': t('nav.production.title'),
      '/surdurulebilirlik': t('nav.sustainability'),
      '/urunler': t('nav.products'),
    };
    return map[href] ?? href;
  }, [t]);

  const getChildLabel = useCallback((href: string) => {
    const map: Record<string, string> = {
      '/about/hakkimizda': t('nav.corporate.about'),
      '/uretim/tesisler': t('nav.production.facilities'),
      '/uretim/kalite-surecleri': t('nav.production.quality'),
    };
    return map[href] ?? href;
  }, [t]);
  const getChildSubtitle = useCallback((href: string) => {
    const map: Record<string, string> = {
      '/about/hakkimizda': t('nav.corporate.aboutSubtitle'),
      '/uretim/tesisler': t('nav.production.facilitiesSubtitle'),
      '/uretim/kalite-surecleri': t('nav.production.qualitySubtitle'),
    };
    return map[href] ?? CHILD_META[href]?.subtitle ?? '';
  }, [t]);
  const { favorites, toggle, clear } = useWishlist();
  // bump to force re-render when product list changes (storage event)
  const [, setProductsVersion] = useState(0);
  const [wishOpen, setWishOpen] = useState(false);
  const wishRefDesktop = useRef<HTMLDivElement | null>(null);
  const wishRefMobile = useRef<HTMLDivElement | null>(null);
  const wishCloseTimer = useRef<number | null>(null);
  // Toast removed: user requested no "Ürün favorilere eklendi" messages
  // (previously: const [toast, setToast] = useState(...); const toastRef = useRef(...))
  const panelActionTimer = useRef<number | null>(null);
  const panelActionRef = useRef<boolean>(false);
  const router = useRouter();
  const asPath = router.asPath || "/";
  const isActive = (href: string) => (href === "/" ? asPath === "/" : asPath.startsWith(href));
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);
  const navItemRefs = useRef<Record<string, HTMLElement | null>>({});

  const cancelHoverClose = () => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const scheduleHoverClose = (delay = 140) => {
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = window.setTimeout(() => {
      setHoveredNav(null);
      hoverCloseTimer.current = null;
    }, delay);
  };
  // which top-level nav (if any) is opened via click/tap (not used currently)
  // note: kept as a comment placeholder in case click-to-open is added later
  // mobile per-item open state for accordion behavior
  const [mobileOpenItems, setMobileOpenItems] = useState<Record<string, boolean>>({});

  const toggleMobileItem = (key: string) => {
    setMobileOpenItems((p) => ({ ...p, [key]: !p[key] }));
  };

  // Framer Motion variants for mobile menu and items
  const panelVariants = {
    // closed off-screen above for top slide-down. Use the measured header height
    // as `custom` so the panel starts hidden immediately above the header instead
    // of sliding from the very top of the page.
    // closed slides the panel fully up (by its own height). Since the panel
    // is positioned with `top: headerHeight`, using `-100%` here ensures the
    // panel hides under the header instead of coming from the top of the page.
    closed: {
      y: "-100%",
      transition: { duration: 0.28, ease: "easeInOut" },
    },
    open: {
      y: 0,
      transition: { duration: 0.28, ease: "easeInOut" },
    },
  };



  const itemsParent = {
    closed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
  };

  const itemChild = {
    closed: { opacity: 0, x: -10, transition: { duration: 0.18, ease: "easeInOut" } },
    open: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  // helper to avoid TS generic issues with motion.* typing in this project
  // we intentionally allow `any` here and disable the lint rule because
  // Framer Motion's element types can be awkward with this project's TS setup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const M: any = motion;

  // Small helper component to render a wishlist thumbnail with robust fallbacks.
  // Tries the product's `image` first, then several common `/photos/<id>.<ext>`
  // fallbacks. If all candidates fail to load, shows the placeholder box.
  const WishlistThumb = ({ p, id }: { p?: Product | undefined; id: string }) => {
    const candidates: string[] = [];
    if (p?.image) candidates.push(p.image);
    // try common extensions from public/photos
    candidates.push(`/photos/${id}.jpg`, `/photos/${id}.png`, `/photos/${id}.webp`, `/photos/${id}.avif`);
    const [idx, setIdx] = useState(0);
    const src = candidates[idx];

    // move to next candidate on error
    const handleError = () => {
      if (idx < candidates.length - 1) setIdx((i) => i + 1);
    };

    if (!src) {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-sm text-gray-500">
          Ü
        </div>
      );
    }

    return (
      // Use Next/Image for optimized delivery; onError will advance to next candidate
      // If all candidates fail, the onError loop will exhaust and we can show the placeholder.
      // We guard by rendering the placeholder when idx becomes >= candidates.length.
      idx < candidates.length ? (
        // eslint-disable-next-line @next/next/no-img-element -- we prefer Next/Image but keep onError
        <Image src={src} alt={p?.title ?? `Ürün ${id}`} width={48} height={48} className="rounded-md object-cover flex-shrink-0" onError={handleError} />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-sm text-gray-500">
          Ü
        </div>
      )
    );
  };

  // Shared wishlist list component used for both desktop and mobile panels.
  function WishlistList({
    favorites,
    setWishOpen,
    toggle,
    getProducts,
    containerClass = '',
  }: {
    favorites: WishlistItem[];
    setWishOpen: (v: boolean) => void;
    toggle: (idOrProduct: string | Product | WishlistItem) => void;
    getProducts: () => Product[];
    containerClass?: string;
  }) {
    // Build id->product map once for performance
    const products = getProducts();
    const map = useMemo(() => {
      const out: Record<string, Product | undefined> = {};
      for (const p of products || []) out[p.id] = p;
      return out;
    }, [products]);

    // helper to mark panel-origin actions (debounced)
    const markPanelAction = useCallback(() => {
      panelActionRef.current = true;
      if (panelActionTimer.current) window.clearTimeout(panelActionTimer.current);
      panelActionTimer.current = window.setTimeout(() => {
        panelActionRef.current = false;
        panelActionTimer.current = null;
      }, 800);
    }, []);

    const handleRemove = useCallback((e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      markPanelAction();
      toggle(id);
    }, [toggle, markPanelAction]);

    const handleClearAll = useCallback(async () => {
      // Use the hook's clear helper when available for a single sync update
      try {
        // toggle might be a prop but our outer scope can call clear via closure
        // so prefer calling that when possible (Header passes clear in outer scope)
        // If not available, fallback to toggling each id.
        if (typeof clear === 'function') {
          clear();
          return;
        }
      } catch (err) {
        void err;
      }

      const ids = Array.from(favorites || []);
      for (const it of ids) {
        await Promise.resolve(toggle(it.id));
      }
    }, [favorites, toggle]);

    if (!favorites || favorites.length === 0) {
      return (
        <>
          <div className="text-center py-6">
            <div className="text-3xl">🤍</div>
            <div className="mt-3 font-semibold">{tr('wishlist.emptyTitle','Favori listen boş')}</div>
            <div className="mt-1 text-sm text-gray-500">{tr('wishlist.emptyBody','Beğendiğin ürünleri kalbe tıklayarak favorilere ekleyebilirsin.')}</div>
            <div className="mt-3">
              {!asPath.startsWith('/urunler') && (
                <Link href="/urunler" className="inline-flex items-center px-3 py-2 bg-black text-white rounded-full text-sm cursor-pointer">{tr('wishlist.viewProducts','Ürünleri Görüntüle')}</Link>
              )}
            </div>
          </div>
        </>
      );
    }

    return (
      <div className={`flex flex-col gap-2 overflow-auto pr-2 ${containerClass}`} style={{ maxHeight: 240 }}>
        {favorites.map((it) => {
          const id = it.id;
          const p = map[id];
          // combine persisted metadata with canonical product data if available
          const combined = p ? ({ ...p, ...it } as Product) : (it as unknown as Product);
          // We prefer showing the product code in the wishlist secondary line
          // instead of the description per UX request.
          const localizedDescription = undefined;
          return (
            <div key={id} className="flex items-center gap-3 w-full cursor-pointer px-1">
              <Link
                href={`/urunler?product=${encodeURIComponent(id)}`}
                onClick={() => setWishOpen(false)}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <WishlistThumb p={combined} id={id} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{combined?.title ?? `Ürün (${id})`}</div>
                  <div className="text-xs text-gray-400">
                    {(() => {
                      const code = combined?.productCode ?? it?.productCode;
                      if (code) return `${tr('pages.products.productCode','Ürün kodu:')} ${code}`;
                      return combined?.category ?? tr('wishlist.missingInfo','Ürün bilgisi bulunamadı');
                    })()}
                  </div>
                </div>
              </Link>

              <button
                onClick={(e) => handleRemove(e, id)}
                data-wishlist-button="true"
                aria-label={`Kaldır ${combined?.title ?? id}`}
                className="ml-2 p-1 rounded-full text-rose-500 hover:bg-rose-50 focus:outline-none flex-shrink-0 cursor-pointer transition-transform duration-150 hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 8.586L15.95 2.636a1 1 0 111.414 1.414L11.414 10l5.95 5.95a1 1 0 11-1.414 1.414L10 11.414l-5.95 5.95a1 1 0 11-1.414-1.414L8.586 10 2.636 4.05A1 1 0 114.05 2.636L10 8.586z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // header always visible
  const headerVisible = true;
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(64);

  // Measure the fixed header and keep a single CSS variable in sync so the rest
  // of the layout can position itself under it without per-page hacks.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const node = headerRef.current;
    if (!node) return;

    function measure() {
      const h = Math.round(node.getBoundingClientRect().height);
      setHeaderHeight((prev) => (h > 0 && h !== prev ? h : prev));
    }

    measure();

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => measure())
      : null;
    resizeObserver?.observe(node);

    window.addEventListener("resize", measure, { passive: true });
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure as EventListener);
    };
  }, []);

  // expose header height as a CSS variable so other parts of the layout
  // (e.g. main content / hero) can account for fixed header without relying
  // on a spacer element. This helps avoid flashes/overlap on first paint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);
  }, [headerHeight]);

  useEffect(() => {
    // Keep product change listeners and route-change listener in the same effect
    // so all handlers are registered and cleaned up together.
    function onProductsChange() {
      setProductsVersion((v) => v + 1);
    }

    const onRouteChange = () => {
      setMobileOpen(false);
      setLangOpen(false);
      setMobileLangOpen(false);
      // close wishlist dropdown on navigation to avoid it staying visible under header
      setWishOpen(false);
      if (wishCloseTimer.current) {
        window.clearTimeout(wishCloseTimer.current);
        wishCloseTimer.current = null;
      }
    };

    window.addEventListener('storage', onProductsChange);
    window.addEventListener('yasar:products:changed', onProductsChange as EventListener);
    router.events.on('routeChangeStart', onRouteChange);

    return () => {
      window.removeEventListener('storage', onProductsChange);
      window.removeEventListener('yasar:products:changed', onProductsChange as EventListener);
      router.events.off('routeChangeStart', onRouteChange);
    };
  }, [router.events]);

  // language click-away & ESC handling (but do not close mobile menu on outside clicks)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node | null;
      // if user clicked outside the header entirely, close any open navs
      if (headerRef.current && target && !headerRef.current.contains(target)) {
        setHoveredNav(null);
        // click-away: close any click-opened navs (click-to-open not implemented currently)
      }
      if (langRef.current && target && !langRef.current.contains(target)) setLangOpen(false);
      if (mobileLangRef.current && target && !mobileLangRef.current.contains(target)) setMobileLangOpen(false);

      // For the wishlist dropdown: close only if the click is outside the wishlist
      // and not originated from a wishlist button (product card heart). ProductCard
      // marks its heart button with data-wishlist-button="true" so we can detect it.
      // If click is inside the wishlist panel (desktop or mobile), do nothing (keep it open)
      const wishPanels = [wishRefDesktop.current, wishRefMobile.current].filter(Boolean) as Element[];
      const clickedInsideWish = wishPanels.some((el) => el.contains && el.contains(target as Node));
      if (clickedInsideWish) return;

      // walk up from the target to see if it (or an ancestor) is a wishlist button
      let node = target as Element | null;
      let fromWishlistButton = false;
      while (node) {
        try {
          const el = node as HTMLElement;
          if (el.dataset?.wishlistButton === 'true') {
            fromWishlistButton = true;
            break;
          }
          node = node.parentElement;
        } catch (err) {
          void err;
          break;
        }
      }

      if (!fromWishlistButton) {
        if (wishCloseTimer.current) window.clearTimeout(wishCloseTimer.current);
        wishCloseTimer.current = window.setTimeout(() => {
          setWishOpen(false);
          wishCloseTimer.current = null;
        }, 120);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
        setMobileLangOpen(false);
        setWishOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    // open wishlist when product heart is clicked elsewhere
    function onOpenWishlist(e?: Event) {
      try {
        // debug log to verify event reception on header (development only)
        if (process.env.NODE_ENV === 'development') console.log('[Header] onOpenWishlist event received', e && (e as CustomEvent)?.detail);
      } catch (err) {
        void err;
      }
      // Cancel any pending close (click-away) and open immediately
      if (wishCloseTimer.current) {
        window.clearTimeout(wishCloseTimer.current);
        wishCloseTimer.current = null;
      }
      setWishOpen(true);
    }
    function onWishlistChanged(e: Event) {
      // show toast when an item is added
      try {
        const detail = (e as CustomEvent).detail as { id: string; title?: string; added?: boolean };
        if (process.env.NODE_ENV === 'development') {
          try {
            // debug: log event detail and current persisted wishlist for investigation
            const rawDebug = localStorage.getItem('yasar:wishlist');
            // eslint-disable-next-line no-console
            console.debug('[Header] onWishlistChanged detail=', detail, 'persisted=', rawDebug);
          } catch (err) {
            void err;
          }
        }
        // If the change was initiated from inside the wishlist panel (user
        // clicked remove), suppress the "added" toast to avoid confusing UX.
        if (panelActionRef.current) {
          // clear the marker after a short debounce window
          if (panelActionTimer.current) window.clearTimeout(panelActionTimer.current);
          panelActionTimer.current = window.setTimeout(() => { panelActionRef.current = false; panelActionTimer.current = null; }, 800);
        }

        // Only show "added" toast when an item was actually added and the
        // wishlist panel is not currently open. Also suppress when the change
        // originated from inside the panel (panelActionRef).
        if (detail?.added && !wishOpen && !panelActionRef.current) {
          // Toast suppressed: user requested no "Ürün favorilere eklendi" messages.
          // Previously we double-checked persisted state and set a short toast.
        }
      } catch (err) {
        void err;
      }
    }
    function onCloseWishlist(e: Event) {
      try {
        if (process.env.NODE_ENV === 'development') console.log('[Header] onCloseWishlist event received', (e as CustomEvent)?.detail);
      } catch (err) {
        void err;
      }
      setWishOpen(false);
    }
    window.addEventListener('yasar:wishlist:open', onOpenWishlist as EventListener);
    window.addEventListener('yasar:wishlist:changed', onWishlistChanged as EventListener);
    window.addEventListener('yasar:wishlist:close', onCloseWishlist as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener('yasar:wishlist:open', onOpenWishlist as EventListener);
      window.removeEventListener('yasar:wishlist:changed', onWishlistChanged as EventListener);
      window.removeEventListener('yasar:wishlist:close', onCloseWishlist as EventListener);
      if (wishCloseTimer.current) {
        window.clearTimeout(wishCloseTimer.current);
        wishCloseTimer.current = null;
      }
    };
  }, [tr]);

  // header hide-on-scroll removed intentionally

  // focus first language button when menu opens
  useEffect(() => {
    if (langOpen) firstLangButtonRef.current?.focus();
  }, [langOpen]);

  // When language menu closes, if focus remained inside the hidden menu,
  // move it back to the language toggle to avoid aria-hidden on a focused descendant.
  useEffect(() => {
    if (langOpen) return;
    try {
      const active = document.activeElement as HTMLElement | null;
      if (active && langRef.current && langRef.current.contains(active)) {
        // If we have a toggle button ref, focus it; otherwise blur the active element
        if (langToggleRef.current) langToggleRef.current.focus();
        else active.blur();
      }
    } catch (err) {
      void err;
    }
  }, [langOpen]);

  // Similar handling for the mobile language menu
  useEffect(() => {
    if (mobileLangOpen) return;
    try {
      const active = document.activeElement as HTMLElement | null;
      if (active && mobileLangRef.current && mobileLangRef.current.contains(active)) {
        if (mobileLangToggleRef.current) mobileLangToggleRef.current.focus();
        else active.blur();
      }
    } catch (err) {
      void err;
    }
  }, [mobileLangOpen]);

  // simple focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen) {
      menuButtonRef.current?.focus();
      return;
    }

    const container = mobileMenuRef.current;
    if (!container) return;
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])")
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab" || !first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // (dropdown removed) -- simplified header does not compute dynamic panelLeft

  // keep portal mounted while exit animation plays so closing is smooth
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    let closeTimer: number | undefined;
    let openTimer: number | undefined;
    if (mobileOpen) {
      // avoid calling setState synchronously inside effect
      openTimer = window.setTimeout(() => setIsMounted(true), 0);
    } else {
      // match longest animation duration (280ms) so exit animation can finish
      closeTimer = window.setTimeout(() => setIsMounted(false), 320);
    }
    return () => {
      if (openTimer) window.clearTimeout(openTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [mobileOpen]);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);
  return (
    <>
      <M.header
        initial={false}
        animate={headerVisible || mobileOpen ? { y: 0 } : { y: "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        ref={headerRef}
        className={`w-full shadow-sm text-white bg-[var(--brand-color)] sticky top-0 left-0 right-0 z-50`}
      >
  <div className="max-w-6xl mx-auto px-4 py-4 lg:py-3 flex justify-between items-center lg:grid lg:gap-x-8 lg:[grid-template-columns:1fr_auto_1fr] relative">
      {/* LEFT - NAV */}
      {/* Use slightly smaller text and tighter gaps at the lg (≈1024px) breakpoint,
        but restore normal size on xl+ so large/4k screens keep the original look */}
  <div className="hidden lg:flex items-center lg:space-x-2 space-x-3 text-sm font-medium min-w-0 overflow-x-auto lg:overflow-visible lg:text-xs xl:text-sm">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const highlight = active || hoveredNav === item.href;

              // render label via mapping helper
              const resolvedLabel = getLabel(item.href);

              if (item.children && item.children.length > 0) {
                // Simplify: do not render a dropdown here. Show the parent link only.
                return (
                  <div
                    key={item.href}
                    className={`group relative min-w-0 ${active ? 'text-white' : ''}`}
                    onMouseEnter={() => { cancelHoverClose(); setHoveredNav(item.href); }}
                    onMouseLeave={() => scheduleHoverClose()}
                  >
                    <button
                      type="button"
                      ref={(el) => { navItemRefs.current[item.href] = el; }}
                      aria-haspopup="menu"
                      aria-expanded={hoveredNav === item.href}
                      onFocus={() => { cancelHoverClose(); setHoveredNav(item.href); }}
                      onBlur={() => scheduleHoverClose()}
                      onClick={() => setHoveredNav((prev) => (prev === item.href ? null : item.href))}
                      className={`relative z-10 ${active ? 'font-semibold' : ''} whitespace-nowrap truncate group-hover:text-white/90 flex items-center gap-1 focus:outline-none cursor-pointer`}
                    >
                      <span>{resolvedLabel}</span>
                      <svg className={`h-3 w-3 ml-1 transform transition-transform duration-150 ${hoveredNav === item.href ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <M.span
                      className={`absolute left-0 -bottom-1 h-0.5 z-0 ${active ? 'bg-amber-400' : 'bg-white'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: highlight ? '100%' : '0%' }}
                      transition={{ duration: 0.16 }}
                      aria-hidden
                    />

                    <div
                      role="menu"
                      aria-label={resolvedLabel}
                      className={`absolute left-0 top-full mt-2 z-[60] transition-all duration-180 ease-out transform origin-top ${
                        hoveredNav === item.href ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                      }`}
                      aria-hidden={!(hoveredNav === item.href)}
                    >
                      {/* Gradient border */}
                      <div className="p-px rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-pink-300">
                        {/* Inner panel */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg text-gray-900 w-56 max-w-[80vw]">
                          <ul className="p-1">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  role="menuitem"
                                  className="group relative block px-3 py-2 pl-4 rounded-md overflow-hidden"
                                  onClick={() => { setHoveredNav(null); }}
                                >
                                  {/* left accent bar appears on hover */}
                                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-l-md bg-gradient-to-b from-amber-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                  <div className="ml-2">
                                    <div className="font-medium text-gray-900">{getChildLabel(c.href) ?? c.label}</div>
                                    {getChildSubtitle(c.href) && (
                                      <div className="text-xs text-gray-500 mt-0.5">{getChildSubtitle(c.href)}</div>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative hover:text-white/90 ${active ? 'text-white' : ''} min-w-0 cursor-pointer`}
                  aria-current={active ? 'page' : undefined}
                  onMouseEnter={() => { cancelHoverClose(); setHoveredNav(item.href); }}
                  onMouseLeave={() => scheduleHoverClose()}
                >
                  <span className={`relative z-10 ${active ? 'font-semibold' : ''} whitespace-nowrap truncate`}>{resolvedLabel}</span>

                  <M.span
                    className={`absolute left-0 -bottom-1 h-0.5 z-0 ${active ? 'bg-amber-400' : 'bg-white'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: highlight ? '100%' : '0%' }}
                    transition={{ duration: 0.16 }}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>

          {/* CENTER - LOGO */}
          <div className="flex justify-center lg:justify-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image
                src="/photos/yasarLogo2.jpg"
                alt="Yasar Tekstil Logo"
                width={140}
                height={140}
                sizes="(max-width: 640px) 72px, (max-width: 1024px) 100px, 140px"
                priority
                loading="eager"
                style={{ height: 'auto', width: 'auto' }}
                className="max-w-[160px] lg:max-w-[140px] h-auto"
              />
            </Link>
          </div>

          {/* RIGHT - LANGUAGE + CONTACT + MOBILE */}
          <div className="flex items-center justify-end space-x-3">
            {/* MOBILE: favorites button (compact) */}
            <div className="relative lg:hidden">
              <button
                  type="button"
                  data-wishlist-button="true"
                  onClick={() => setWishOpen((s) => !s)}
                  aria-label={tr('wishlist.title', 'Favoriler')}
                  className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ml-2 z-50"
                >
                  <span aria-hidden className="text-xl">🤍</span>
                {hydrated && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-rose-500 text-white text-xs font-semibold">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
            {/* Favorites dropdown (catalog-only site; no login) */}
            <div className="relative hidden lg:block" ref={wishRefDesktop}>
              <button
                type="button"
                data-wishlist-button="true"
                onClick={() => setWishOpen((s) => !s)}
                aria-expanded={wishOpen}
                aria-haspopup="menu"
                  aria-label={tr('wishlist.title', 'Favoriler')}
                className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer flex items-center"
              >
                <span aria-hidden className="text-lg">🤍</span>
                {hydrated && favorites.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-xs font-semibold">
                    {favorites.length}
                  </span>
                )}
              </button>

              <div
                role="menu"
                aria-label={tr('wishlist.title', 'Favoriler')}
                  className={`absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-72 z-[60] transform transition-all duration-150 origin-top overflow-auto max-h-[60vh] ${wishOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">{tr('wishlist.title','Favoriler')} <span className="text-xs text-gray-500">({hydrated ? favorites.length : 0})</span></h4>
                    {hydrated && favorites.length > 0 && (
                      <button
                        type="button"
                        onClick={() => clear()}
                        className="text-xs text-gray-500 hover:text-black focus:outline-none cursor-pointer"
                      >
                        {tr('wishlist.clear','Hepsini Kaldır')}
                      </button>
                    )}
                  </div>

                  {wishOpen && (
                    <WishlistList
                      favorites={favorites}
                      setWishOpen={setWishOpen}
                      toggle={toggle}
                      getProducts={getProducts}
                      containerClass="max-h-60 lg:max-h-72"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* MOBILE: favorites sheet (bottom) */}
            <div
              ref={wishRefMobile}
              className={`lg:hidden fixed left-1/2 bottom-0 z-[51] bg-white text-black rounded-t-xl shadow-xl transform transition-transform duration-200 -translate-x-1/2 w-full max-w-[680px] px-4 sm:px-6 overflow-auto max-h-[70vh] ${wishOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
              aria-hidden={!wishOpen}
              aria-modal={wishOpen}
              role="dialog"
              aria-label={`${tr('wishlist.title','Favoriler')} (mobil)`}
            >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">{tr('wishlist.title','Favoriler')} <span className="text-xs text-gray-500">({hydrated ? favorites.length : 0})</span></h4>
                    <div className="flex items-center gap-2">
                      {hydrated && favorites.length > 0 && (
                        <button
                          type="button"
                          onClick={() => clear()}
                          className="text-xs text-gray-500 hover:text-black focus:outline-none cursor-pointer"
                        >
                          {tr('wishlist.clear','Hepsini Kaldır')}
                        </button>
                      )}
                      <button type="button" onClick={() => setWishOpen(false)} aria-label={tr('common.close','Kapat')} className="p-2 rounded-md hover:bg-gray-100">
                        ✕
                      </button>
                    </div>
                  </div>

                  {wishOpen && (
                    <WishlistList
                      favorites={favorites}
                      setWishOpen={setWishOpen}
                      toggle={toggle}
                      getProducts={getProducts}
                      containerClass="max-h-60 sm:max-h-72"
                    />
                  )}
                </div>
              </div>

            
            <div className="hidden lg:block relative" ref={langRef}>
              <button
                type="button"
                ref={langToggleRef}
                onClick={() => setLangOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label={langOpen ? t('header.aria.closeLangMenu') : t('header.aria.openLangMenu')}
                className="px-2 py-1 text-sm border border-gray-400 rounded flex items-center space-x-2 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer"
              >
                <span className="text-lg">{FLAGS[lang]}</span>
                <span className="font-medium">{NAMES[lang]}</span>
                <svg className={`h-3 w-3 ml-1 transform transition-transform duration-200 ${langOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                role="menu"
                aria-label={t("nav.language")}
                className={`absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-40 z-[60] transform transition-all duration-150 origin-top ${
                  langOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}
                aria-hidden={!langOpen}
              >
                {LANG_OPTIONS.map((l, idx) => (
                  <button
                    key={l}
                    role="menuitem"
                    type="button"
                    ref={idx === 0 ? firstLangButtonRef : null}
                    className={`w-full px-3 py-2 flex items-center space-x-2 transition-colors duration-150 rounded-md ${
                      l === lang ? "bg-amber-400 text-white" : "hover:bg-gray-100"
                    } cursor-pointer`}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                  >
                    <span className="text-lg">{FLAGS[l]}</span>
                    <span className="truncate">{NAMES[l]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact button (desktop) - show on lg+ */}
            <div className="hidden lg:block">
              <Link href="/contact" className="ml-3 inline-flex items-center bg-white text-black px-4 py-2 rounded font-semibold hover:opacity-95">
                {t('nav.contact')}
              </Link>
            </div>

            {/* MOBILE: language button next to hamburger */}
            <div className="lg:hidden relative" ref={mobileLangRef}>
              <button
                type="button"
                ref={mobileLangToggleRef}
                onClick={() => setMobileLangOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={mobileLangOpen}
                aria-label={mobileLangOpen ? t('header.aria.closeLangMenu') : t('header.aria.openLangMenu')}
                className="px-2 py-1 text-sm rounded flex items-center space-x-1 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer"
              >
                <span className="text-lg">{FLAGS[lang]}</span>
                <svg className={`h-3 w-3 ml-1 transform transition-transform duration-200 ${mobileLangOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                role="menu"
                aria-label={t("nav.language")}
                className={`absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-36 z-[60] transform transition-all duration-150 origin-top ${
                  mobileLangOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}
                aria-hidden={!mobileLangOpen}
              >
                {LANG_OPTIONS.map((l) => (
                  <button
                    key={l}
                    role="menuitem"
                    type="button"
                    className={`w-full px-3 py-2 flex items-center space-x-2 transition-colors duration-150 rounded-md ${
                      l === lang ? "bg-amber-400 text-white" : "hover:bg-gray-100"
                    } cursor-pointer`}
                    onClick={() => {
                      setLang(l);
                      setMobileLangOpen(false);
                    }}
                  >
                    <span className="text-lg">{FLAGS[l]}</span>
                    <span className="truncate">{NAMES[l]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setMobileOpen((p) => !p)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t('header.aria.closeMenu') : t('header.aria.openMenu')}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 rounded-md hover:bg-black/20 cursor-pointer"
            >
              {/* Animated hamburger -> X using Framer Motion */}
              <M.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6"
                initial={false}
                animate={mobileOpen ? "open" : "closed"}
                aria-hidden
              >
                <M.path
                  d="M4 6h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    closed: { y: 0, rotate: 0 },
                    open: { y: 6, rotate: 45 },
                  }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                />

                <M.path
                  d="M4 12h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />

                <M.path
                  d="M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    closed: { y: 0, rotate: 0 },
                    open: { y: -6, rotate: -45 },
                  }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                />
              </M.svg>
            </button>
          </div>
        </div>
  </M.header>
  {/* spacer removed: layout uses --site-header-height CSS variable so double-padding is avoided */}

      {/* Render mobile overlay + panel into document.body via portal to avoid transform/stacking issues */}
      {typeof document !== "undefined" && isMounted &&
        createPortal(
          <>
              {/* overlay removed: menu opens without backdrop per request */}

              <M.div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal={mobileOpen}
              className="lg:hidden fixed left-0 right-0 bg-[var(--brand-color)] text-white shadow-xl z-[51] overflow-y-auto origin-top"
              style={{ top: 'var(--site-header-height, 64px)', maxHeight: `calc(75vh - var(--site-header-height, 64px))` }}
              initial="closed"
              animate={mobileOpen ? "open" : "closed"}
              variants={panelVariants}
              // closed/open are expressed relative to the panel itself (percent),
              // so custom is no longer required.
              aria-hidden={!mobileOpen}
            >
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-3 flex items-center justify-between">
                      {/* Logo removed from mobile menu per request */}
                      <div className="flex items-center" aria-hidden />
                      {/* Removed inner close button to avoid duplicate close controls — header hamburger/X handles closing */}
                    </div>

                    <M.div className="px-4 pb-6" variants={itemsParent} initial="closed" animate={mobileOpen ? "open" : "closed"}>
                      <div className="space-y-1">
                        {NAV_ITEMS.map((item) => (
                          <M.div key={item.href} variants={itemChild}>
                            {/* If the mobile menu item has children, render parent label and nested links */}
                            {item.children && item.children.length > 0 ? (
                              <div>
                                <div className="flex items-center justify-between px-3 py-3 rounded">
                                  <span className={`font-medium ${isActive(item.href) ? 'font-semibold' : ''}`}>
                                    {(() => {
                                      switch (item.href) {
                                        case "/":
                                          return t("nav.home");
                                        case "/about":
                                          return t("nav.corporate.title");
                                        case "/uretim":
                                          return t("nav.production.title");
                                        case "/surdurulebilirlik":
                                          return t("nav.sustainability");
                                        case "/urunler":
                                          return t("nav.products");
                                        default:
                                          return item.label;
                                      }
                                    })()}
                                  </span>
                                  <button
                                    type="button"
                                    aria-expanded={!!mobileOpenItems[item.href]}
                                    aria-controls={`mobile-${item.href.replace(/\//g, '-')}-panel`}
                                    onClick={() => toggleMobileItem(item.href)}
                                    className="p-2 rounded-md hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                                  >
                                    <svg className={`h-4 w-4 transform transition-transform ${mobileOpenItems[item.href] ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                                      <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>

                                <div
                                  id={`mobile-${item.href.replace(/\//g, '-')}-panel`}
                                  className={`pl-4 mt-1 space-y-1 ${mobileOpenItems[item.href] ? '' : 'hidden'}`}
                                >
                                      {item.children.map((c) => (
                                    <Link
                                      key={c.href}
                                      href={c.href}
                                      className={`block px-3 py-2 rounded hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                                        isActive(c.href) ? 'bg-black/20 font-semibold' : ''
                                      } cursor-pointer`}
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      {getChildLabel(c.href) ?? c.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className={`block px-3 py-3 rounded hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                                  isActive(item.href) ? 'bg-black/20 font-semibold' : ''
                                } cursor-pointer`}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                onClick={() => setMobileOpen(false)}
                                >
                                {getLabel(item.href)}
                              </Link>
                            )}
                          </M.div>
                        ))}
                      </div>

                      <M.div className="mt-4 border-t border-white/10 pt-4" variants={itemChild}>
                        <Link href="/contact" className="block w-full text-center bg-white text-black px-4 py-3 rounded font-semibold cursor-pointer" onClick={() => setMobileOpen(false)}>
                          {t("nav.contact")}
                        </Link>
                      </M.div>
                    </M.div>
                  </div>
                </M.div>
              </>,
            document.body
          )
        }
    </>
  );
}
