import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { useLanguage } from "../contexts/LanguageContext";

const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/about", label: "Kurumsal" },
  { href: "/production", label: "Üretim" },
  { href: "/sustainability", label: "Sürdürülebilirlik" },
  { href: "/collections", label: "Ürünler" },
];

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

export default function Header(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);
  const mobileLangRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstLangButtonRef = useRef<HTMLButtonElement | null>(null);

  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const asPath = router.asPath || "/";
  const isActive = (href: string) => (href === "/" ? asPath === "/" : asPath.startsWith(href));
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

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

  // header always visible
  const headerVisible = true;
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(64);

  // measure header height to avoid overlap with page content and position mobile menu below header
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    function measure() {
      const h = headerRef.current?.offsetHeight ?? 0;
      if (h && h !== headerHeight) setHeaderHeight(h);
    }
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // expose header height as a CSS variable so other parts of the layout
  // (e.g. main content / hero) can account for fixed header without relying
  // on a spacer element. This helps avoid flashes/overlap on first paint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);
  }, [headerHeight]);

  useEffect(() => {
    const onRouteChange = () => {
      setMobileOpen(false);
      setLangOpen(false);
      setMobileLangOpen(false);
    };
    router.events.on("routeChangeStart", onRouteChange);
    return () => router.events.off("routeChangeStart", onRouteChange);
  }, [router.events]);

  // language click-away & ESC handling (but do not close mobile menu on outside clicks)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (langRef.current && target && !langRef.current.contains(target)) setLangOpen(false);
      if (mobileLangRef.current && target && !mobileLangRef.current.contains(target)) setMobileLangOpen(false);
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
        setMobileLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // header hide-on-scroll removed intentionally

  // focus first language button when menu opens
  useEffect(() => {
    if (langOpen) firstLangButtonRef.current?.focus();
  }, [langOpen]);

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
        className={`w-full shadow-sm text-white bg-[var(--brand-color)] fixed top-0 left-0 right-0 z-40`}
      >
  <div className="max-w-6xl mx-auto px-4 py-4 lg:py-3 flex justify-between items-center lg:grid lg:[grid-template-columns:1fr_auto_1fr] relative">
          {/* LEFT - NAV */}
            <div className="hidden lg:flex items-center lg:space-x-4 space-x-3 text-sm font-medium min-w-0 overflow-x-auto lg:overflow-visible">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const highlight = active || hoveredNav === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative hover:text-white/90 ${active ? "text-white" : ""} min-w-0`}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHoveredNav(item.href)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span className={`relative z-10 ${active ? "font-semibold" : ""} whitespace-nowrap truncate`}>{item.label}</span>

                  {/* Framer Motion underline */}
                  <M.span
                    className={`absolute left-0 -bottom-1 h-0.5 z-0 ${active ? "bg-amber-400" : "bg-white"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: highlight ? "100%" : "0%" }}
                    transition={{ duration: 0.16 }}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>

          {/* CENTER - LOGO */}
          <div className="flex justify-center lg:justify-center">
            <Link href="/" className="flex items-center">
              <Image src="/photos/yasarLogo2.jpg" alt="Yasar Tekstil Logo" width={96} height={96} priority className="max-w-[120px] lg:max-w-[100px] h-auto" />
            </Link>
          </div>

          {/* RIGHT - LANGUAGE + CONTACT + MOBILE */}
          <div className="flex items-center justify-end space-x-3">
            <div className="hidden lg:block relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label={langOpen ? "Close language menu" : "Open language menu"}
                className="px-2 py-1 text-sm border border-gray-400 rounded flex items-center space-x-2 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
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
                className={`absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-40 z-50 transform transition-all duration-150 origin-top ${
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
                    }`}
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

            <Link href="/contact" className="hidden lg:inline-flex items-center bg-white text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition text-sm shadow-md" aria-label="İletişim sayfası">
              {t("nav.contact")}
            </Link>

            {/* MOBILE: compact, centered contact button */}
            <Link
              href="/contact"
              aria-label="Contact"
              className="lg:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center px-3 py-1 rounded-md bg-white text-black text-sm font-medium shadow-sm hover:scale-105 transition-transform duration-150"
            >
              <span className="truncate">{t("nav.contact")}</span>
            </Link>

            {/* MOBILE: language button next to hamburger */}
            <div className="lg:hidden relative" ref={mobileLangRef}>
              <button
                type="button"
                onClick={() => setMobileLangOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={mobileLangOpen}
                aria-label={mobileLangOpen ? "Close language menu" : "Open language menu"}
                className="px-2 py-1 text-sm rounded flex items-center space-x-1 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                <span className="text-lg">{FLAGS[lang]}</span>
                <svg className={`h-3 w-3 ml-1 transform transition-transform duration-200 ${mobileLangOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                role="menu"
                aria-label={t("nav.language")}
                className={`absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-36 z-50 transform transition-all duration-150 origin-top ${
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
                    }`}
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
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 rounded-md hover:bg-black/20"
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
              className="lg:hidden fixed left-0 right-0 bg-[var(--brand-color)] text-white shadow-xl z-30 overflow-y-auto origin-top"
              style={{ top: headerHeight, maxHeight: `calc(75vh - ${headerHeight}px)` }}
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
                            <Link
                              href={item.href}
                              className={`block px-3 py-3 rounded hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                                isActive(item.href) ? "bg-black/20 font-semibold" : ""
                              }`}
                              aria-current={isActive(item.href) ? "page" : undefined}
                              onClick={() => setMobileOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </M.div>
                        ))}
                      </div>

                      <M.div className="mt-4 border-t border-white/10 pt-4" variants={itemChild}>
                        <Link href="/contact" className="block w-full text-center bg-white text-black px-4 py-3 rounded font-semibold" onClick={() => setMobileOpen(false)}>
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