import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const mobileLangRef = useRef<HTMLDivElement | null>(null);
  const firstLangButtonRef = useRef<HTMLButtonElement | null>(null);

  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  // Use asPath (actual URL shown in browser) for active link detection.
  // router.pathname can contain dynamic segment placeholders (e.g. /collections/[id])
  // so asPath is more reliable for matching the current route.
  const asPath = router.asPath || "/";
  const isActive = (href: string) => (href === "/" ? asPath === "/" : asPath.startsWith(href));

  // Header visibility on scroll: hide on scroll down, show on small scroll up
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Close menus when route changes (e.g. navigation via Next Link)
  useEffect(() => {
    const onRouteChange = () => {
      setMobileOpen(false);
      setLangOpen(false);
    };
    router.events.on("routeChangeStart", onRouteChange);
    return () => {
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (langRef.current && target && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (mobileLangRef.current && target && !mobileLangRef.current.contains(target)) {
        setMobileLangOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Focus first language btn
  useEffect(() => {
    if (langOpen) {
      firstLangButtonRef.current?.focus();
    }
  }, [langOpen]);

  // Lock body scroll when mobile menu is open (simpler implementation)
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      // cleanup: restore default
      if (typeof document !== "undefined") document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      const isDesktop = window.innerWidth >= 640; // Tailwind 'sm' breakpoint
      const minDelta = isDesktop ? 8 : 10; // ignore tiny jitters
      const hideAfter = isDesktop ? 80 : 50; // desktop needs more scroll before hiding

      // Ignore very small movements
      if (Math.abs(delta) < minDelta) return;

      // If scrolling down past threshold, hide header; scrolling up shows header
      if (delta > 0 && currentY > hideAfter) {
        setHeaderVisible(false);
      } else if (delta < 0) {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    const onResize = () => {
      // reset baseline on resize to avoid jumpy behavior
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
  <header className={`w-full shadow-sm text-white bg-[var(--brand-color)] sticky top-0 z-40 relative transform transition-transform duration-500 ease-in-out ${
    headerVisible ? "translate-y-0" : "-translate-y-full"
  }`}>
  <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center md:grid md:[grid-template-columns:1fr_auto_1fr] relative">
        {/* LEFT - NAV */}
  <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative hover:text-white/90 ${active ? "text-white" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={`relative z-10 ${active ? "font-semibold" : ""} whitespace-nowrap`}>{item.label}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 transition-all duration-200 ${
                    active ? "w-full bg-amber-400" : "w-0 group-hover:w-full bg-white"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* CENTER - LOGO */}
  <div className="flex justify-center md:justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/photos/yasarLogo2.jpg"
              alt="Yasar Tekstil Logo"
              width={110}
              height={110}
              priority
              className="max-w-[90px] md:max-w-[120px] h-auto"
            />
          </Link>
        </div>

        {/* RIGHT - LANGUAGE + CONTACT + MOBILE */}
        <div className="flex items-center justify-end space-x-3">
          <div className="hidden md:block relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              aria-label={langOpen ? "Close language menu" : "Open language menu"}
              className="px-2 py-1 text-sm border border-gray-400 rounded flex items-center space-x-2 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              <span className="text-lg">{FLAGS[lang]}</span>
              <span className="uppercase">{lang}</span>
              <svg
                className={`h-3 w-3 ml-1 transform transition-transform duration-200 ${langOpen ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              role="menu"
              aria-label={t("nav.language")}
              className={`absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50 transform transition-all duration-150 origin-top ${
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
                  className={`w-full px-3 py-2 flex items-center space-x-2 transition-colors duration-150 ${
                    l === lang ? "bg-amber-400 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setLang(l);
                    setLangOpen(false);
                  }}
                >
                  <span className="text-lg">{FLAGS[l]}</span>
                  <span className="uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="hidden md:inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
          >
            {t("nav.contact")}
          </Link>

          {/* MOBILE: phone icon linking to contact page */}
          <Link href="/contact" aria-label="Contact" className="md:hidden p-2 rounded-full bg-white text-black flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.68.31 1.36.56 2a1 1 0 0 1-.24 1l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a1 1 0 0 1 1-.24c.64.25 1.32.44 2 .56a1 1 0 0 1 .75 1V21z" />
            </svg>
          </Link>

          {/* MOBILE: language button next to hamburger */}
          <div className="md:hidden relative" ref={mobileLangRef}>
            <button
              type="button"
              onClick={() => setMobileLangOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={mobileLangOpen}
              aria-label={mobileLangOpen ? "Close language menu" : "Open language menu"}
              className="px-2 py-1 text-sm rounded flex items-center space-x-1 transition-colors duration-200 hover:bg-amber-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              <span className="text-lg">{FLAGS[lang]}</span>
              <svg
                className={`h-3 w-3 ml-1 transform transition-transform duration-200 ${mobileLangOpen ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              role="menu"
              aria-label={t("nav.language")}
              className={`absolute right-0 mt-2 bg-white text-black rounded shadow-md w-36 z-50 transform transition-all duration-150 origin-top ${
                mobileLangOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
              aria-hidden={!mobileLangOpen}
            >
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l}
                  role="menuitem"
                  type="button"
                  className={`w-full px-3 py-2 flex items-center space-x-2 transition-colors duration-150 ${
                    l === lang ? "bg-amber-400 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setLang(l);
                    setMobileLangOpen(false);
                  }}
                >
                  <span className="text-lg">{FLAGS[l]}</span>
                  <span className="uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            className="md:hidden p-2 rounded-md hover:bg-black/20"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute left-0 right-0 top-full bg-[var(--brand-color)] text-white px-4 pb-4 space-y-1 transform transition-all duration-300 origin-top ${
          mobileOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded hover:bg-black/20 ${isActive(item.href) ? "bg-black/20 font-semibold" : ""}`}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}

        <Link href="/contact" className="block px-3 py-2 rounded bg-white text-black mt-2 hover:bg-gray-200">
          {t("nav.contact")}
        </Link>

        
      </div>
    </header>
  );
}