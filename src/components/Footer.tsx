import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// LOCATIONS not used in Footer; removed import to avoid unused-var lint

// flagEmoji removed: not used in footer

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openCorporate, setOpenCorporate] = useState(false);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const corpRef = useRef<HTMLDivElement | null>(null);
  const [linksMaxHeight, setLinksMaxHeight] = useState(0);
  const [corpMaxHeight, setCorpMaxHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(typeof window !== 'undefined' ? window.innerWidth : undefined);
  const [mounted, setMounted] = useState(false);

  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch (err) {
      void err;
      return fallback;
    }
  };

  const linksInner = (
    <div className="flex flex-col space-y-2">
      <Link href="/" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.home','Ana sayfa')}</Link>
      <Link href="/urunler" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.products','Ürünlerimiz')}</Link>
      <Link href="/surdurulebilirlik" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.sustainability','Sürdürülebilirlik')}</Link>
      <Link href="/contact" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contact','İletişim')}</Link>
    </div>
  );

  const corpInner = (
    <div className="flex flex-col space-y-2">
      <Link href="/about" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.corporate.about','Hakkımızda')}</Link>
      <Link href="/about/hakkimizda" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.corporate.aboutDetail','Şirket Bilgileri')}</Link>
      <Link href="/uretim" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.production.title','Üretim')}</Link>
      <Link href="/uretim/tesisler" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.production.facilities','Üretim Tesislerimiz')}</Link>
      <Link href="/uretim/kalite-surecleri" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.production.quality','Kalite Süreçlerimiz')}</Link>
    </div>
  );

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 240);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, []);

  // track window width to change accordion behavior around 931px
  useEffect(() => {
    function setWidth() {
      const w = window.innerWidth;
      setWindowWidth(w);
      // ensure lists are open on wider viewports (>= 640px) and closed on smaller
      if (w >= 640) {
        setOpenLinks(true);
        setOpenCorporate(true);
      } else {
        setOpenLinks(false);
        setOpenCorporate(false);
      }
    }
    if (typeof window !== 'undefined') {
      setWidth();
      window.addEventListener('resize', setWidth, { passive: true });
      return () => window.removeEventListener('resize', setWidth);
    }
  }, []);

  // compute measured heights for the animated mobile accordions without reading refs during render
  useEffect(() => {
    if (linksRef.current) setLinksMaxHeight(linksRef.current.scrollHeight);
    if (corpRef.current) setCorpMaxHeight(corpRef.current.scrollHeight);
  }, [openLinks, openCorporate, windowWidth]);

  // To avoid hydration mismatches, render the responsive branches the same
  // on server and the initial client render. We track `mounted` so the
  // server/client initial render behave as mobile (isDesktop = false). After
  // mounting we can use the real window width to switch to desktop behavior.
  useEffect(() => {
    // avoid calling setState synchronously in effect body to satisfy lint rules
    const id = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(() => setMounted(true)) : setTimeout(() => setMounted(true), 0);
    return () => {
      try {
        if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(id as number);
        else clearTimeout(id as number);
      } catch {}
    };
  }, []);
  const isDesktop = mounted ? (windowWidth ?? 640) >= 640 : false;

  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yasar",
    url: "https://yasar.local/",
    logo: "https://yasar.local/photos/yasarLogo2.jpg",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+90-212-520-9299",
        contactType: "customer service",
        areaServed: "TR"
      }
    ],
    sameAs: [
      "https://www.facebook.com/",
      "https://www.instagram.com/"
    ]
  };

  return (
  <footer className="relative text-white mt-0 bg-[var(--brand-color)]">
  <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src="/photos/footerBgImage1.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* tint the image with the brand color so footer reads like the header while keeping the image */}
  <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'var(--brand-color)', opacity: 0.18 }} />

  <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">

        {/* (flags moved to homepage under the map) */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-block -mt-1 lg:-mt-2" aria-label={tr('footer.home','Yasar ana sayfa')}>
            <Image src="/photos/yasarLogo2.jpg" alt="Yasar" width={200} height={80} className="h-14 lg:h-20 w-auto" />
          </Link>
          <p className="text-sm text-white">{tr('footer.tagline','Türkiye yapımı iç giyim. Konfor ve kalite odaklı.')}</p>

          <div className="text-xs text-white/80 space-y-2 leading-relaxed max-w-prose">
            <p>{tr('footer.company.paragraph1','1969 yılında kurulan firmamız, yarım asrı aşan köklü tecrübesiyle gecelik, pijama takımı, paçalı pijama altı ve iç giyim üretiminde uzmanlaşmış, sektörün önde gelen üretici ve ihracatçıları arasında yer almaktadır.')}</p>

            <p>{tr('footer.company.paragraph2','Amerika, Fransa, İspanya, Yunanistan, İsrail başta olmak üzere Doğu Avrupa ve Orta Doğu pazarlarına gerçekleştirdiğimiz ihracatlarla, yüksek kalite standartlarımızı ve müşteri odaklı yaklaşımımızı uluslararası arenada başarıyla temsil ediyoruz.')}</p>

            <p>{tr('footer.company.paragraph3','Güvenilirliği, sürekliliği ve kaliteyi esas alan firmamız, global ölçekte tercih edilen güçlü bir iş ortağı olmayı sürdürmektedir.')}</p>
          </div>
        </div>

        <nav aria-label="Bağlantılar" className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">{tr('footer.links','Bağlantılar')}</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          {/* mobile accordion toggle */}
          {!isDesktop && (
            <button
              type="button"
              className="text-sm text-white/90 text-left w-full flex items-center justify-end"
              aria-expanded={openLinks}
              onClick={() => setOpenLinks((s) => !s)}
            >
              <span className="sr-only">{openLinks ? 'Kapat' : 'Aç'}</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${openLinks ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
          {/* mobile: animated max-height container; desktop: always show */}
          {isDesktop ? (
            <div>{linksInner}</div>
          ) : (
            <div
              ref={linksRef}
              className="overflow-hidden"
              style={{
                maxHeight: openLinks ? `${linksMaxHeight}px` : '0px',
                transition: 'max-height 250ms ease'
              }}
            >
              {linksInner}
            </div>
          )}
        </nav>

        <nav aria-label="Kurumsal" className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">{tr('footer.corporate.title','Kurumsal')}</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          {!isDesktop && (
            <button
              type="button"
              className="text-sm text-white/90 text-left w-full flex items-center justify-end"
              aria-expanded={openCorporate}
              onClick={() => setOpenCorporate((s) => !s)}
            >
              <span className="sr-only">{openCorporate ? 'Kapat' : 'Aç'}</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${openCorporate ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
          {/* mobile: animated max-height container; desktop: always show */}
          {isDesktop ? (
            <div>{corpInner}</div>
          ) : (
            <div
              ref={corpRef}
              className="overflow-hidden"
              style={{
                maxHeight: openCorporate ? `${corpMaxHeight}px` : '0px',
                transition: 'max-height 250ms ease'
              }}
            >
              {corpInner}
            </div>
          )}
        </nav>

        <div className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">{tr('footer.follow.title','Bizi takip et')}</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          <p className="text-sm text-white">{tr('footer.follow.desc','Sosyal kanallarımızdan kampanyaları ve yenilikleri takip edebilirsiniz.')}</p>
          <div className="flex items-center space-x-4 mt-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:text-[#E1306C]"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h.01" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:text-[#1877F2]"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:text-[#25D366]"
            >
              <span className="sr-only">WhatsApp</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12 .25C5.94.25.98 5.21.98 11.27c0 2.02.53 3.9 1.53 5.55L.1 23.9l7.38-1.94a11.96 11.96 0 0 0 4.5.88c6.06 0 11.02-4.96 11.02-11.02 0-3-1.17-5.81-3.48-7.34zM12 21.5c-1.3 0-2.57-.2-3.76-.6l-.27-.09-4.38 1.14 1.17-4.26-.08-.28A9.17 9.17 0 0 1 2.83 11.3c0-5.01 4.08-9.09 9.09-9.09 2.43 0 4.71.95 6.42 2.67a9.1 9.1 0 0 1-6.34 15.51z" />
                <path d="M17.23 14.11c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.51-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.51-.17-.02-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49 3 .8 3.6.63 4.25.59.65-.05 2.12-.86 2.42-1.69.3-.83.3-1.54.21-1.69-.09-.15-.27-.24-.57-.39z" />
              </svg>
            </a>
          </div>

          <div className="mt-4 text-sm text-white flex flex-col space-y-2">
            <h4 className="text-base lg:text-lg font-semibold text-white">{tr('footer.contactInfo.title','İletişim')}</h4>
            <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
            <a href="tel:+902125209299" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contactInfo.phone','+90 212 520 92 99')}</a>
            <a href="mailto:info@yasarunderwear.com" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contactInfo.email','info@yasarunderwear.com')}</a>
            <a href="https://maps.google.com?q=Yasar+Tekstil" target="_blank" rel="noopener noreferrer" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contactInfo.map','Adresimizi haritada gör')}</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/70">
          <div className="flex items-center space-x-3">
            <span>{tr('footer.copyright', `© ${new Date().getFullYear()} Yasar. Tüm hakları saklıdır.`)}</span>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('yasar_cookie_consent');
                } catch {}
                try {
                  document.cookie = 'yasar_cookie_consent=; max-age=0; path=/';
                } catch {}
                try {
                  const w = window as unknown as Record<string, unknown>;
                  delete w.__yasarConsent;
                } catch {}
                // reload to show banner again
                window.location.reload();
              }}
              className="text-[10px] text-white bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded-md transition"
            >
              {tr('footer.cookie.reset','Çerezleri sıfırla')}
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">{tr('footer.privacy','Gizlilik')}</Link>
            <Link href="/terms" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">{tr('footer.terms','Kullanım Şartları')}</Link>
          </div>
        </div>
      </div>

      {/* Back to top button (yarı saydam siyah arka plan, beyaz ikon) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  aria-label={tr('footer.backToTop','Sayfanın başına dön')}
        className={`fixed right-4 bottom-4 z-50 inline-flex items-center justify-center p-2 rounded-full bg-black/60 text-white hover:bg-black/70 shadow-2xl ring-1 ring-black/20 hover:shadow-2xl transition-opacity transition-transform duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/20 ${showTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
  <span className="sr-only">{tr('footer.backToTop','Sayfanın başına dön')}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* JSON-LD Organization for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }} />
    </footer>
  );
}
