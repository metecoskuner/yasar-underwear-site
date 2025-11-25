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
  { href: "/collections", label: "Ürünlerimiz" },
];

const LANG_OPTIONS = ["TR", "EN", "FR", "AR", "RU"] as const;
type LangOption = (typeof LANG_OPTIONS)[number];
const FLAGS: Record<LangOption, string> = { TR: "🇹🇷", EN: "🇬🇧", FR: "🇫🇷", AR: "🇸🇦", RU: "🇷🇺" };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const firstLangButtonRef = useRef<HTMLButtonElement | null>(null);

  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const pathname = router.pathname || "/";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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

  return (
  <header className="w-full shadow-sm text-white bg-[var(--brand-color)] sticky top-0 z-40 relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center sm:grid sm:grid-cols-3 relative">
        {/* LEFT - NAV */}
        <div className="hidden sm:flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative hover:text-white/90 ${active ? "text-white" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={`relative z-10 ${active ? "font-semibold" : ""}`}>{item.label}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-200 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* CENTER - LOGO */}
        <div className="flex justify-center sm:justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/photos/yasarLogo2.jpg"
              alt="Yasar Tekstil Logo"
              width={110}
              height={110}
              priority
              className="max-w-[90px] sm:max-w-[120px] h-auto"
            />
          </Link>
        </div>

        {/* RIGHT - LANGUAGE + CONTACT + MOBILE */}
        <div className="flex items-center justify-end space-x-3">
          <div className="hidden sm:block relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              aria-label={langOpen ? "Close language menu" : "Open language menu"}
              className="px-2 py-1 text-sm border border-gray-400 rounded flex items-center space-x-2"
            >
              <span className="text-lg">{FLAGS[lang]}</span>
              <span>{lang}</span>
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
                  className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-gray-100"
                  onClick={() => {
                    setLang(l);
                    setLangOpen(false);
                  }}
                >
                  <span className="text-lg">{FLAGS[l]}</span>
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="hidden sm:inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
          >
            {t("nav.contact")}
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            className="sm:hidden p-2 rounded-md hover:bg-black/20"
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
        className={`sm:hidden absolute left-0 right-0 top-full bg-[var(--brand-color)] text-white px-4 pb-4 space-y-1 transform transition-all duration-300 origin-top ${
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

        <div className="border-t border-white/30 pt-3">
          <button
            type="button"
            aria-expanded={mobileLangOpen}
            aria-controls="mobile-lang-menu"
            onClick={() => setMobileLangOpen((p) => !p)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-200 rounded hover:bg-black/10"
          >
            <span>{t("nav.language")}</span>
            <span className="flex items-center space-x-2">
              <span className="text-lg">{FLAGS[lang]}</span>
              <svg className={`h-4 w-4 transition-transform ${mobileLangOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div
            id="mobile-lang-menu"
            className={`mt-2 overflow-hidden transition-[max-height,opacity] duration-200 ${mobileLangOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
            aria-hidden={!mobileLangOpen}
          >
            {LANG_OPTIONS.map((l) => (
              <button
                key={l}
                type="button"
                className="w-full flex items-center px-3 py-2 space-x-2 rounded hover:bg-black/20"
                onClick={() => {
                  setLang(l);
                  setMobileLangOpen(false);
                }}
              >
                <span className="text-lg">{FLAGS[l]}</span>
                <span>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}