import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openCorporate, setOpenCorporate] = useState(false);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const corpRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const linksInner = (
    <div className="flex flex-col space-y-2">
      <Link href="/" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Ana sayfa</Link>
      <Link href="/products" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Ürünlerimiz</Link>
      <Link href="/surdurulebilirlik" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Sürdürülebilirlik</Link>
      <Link href="/contact" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">İletişim</Link>
    </div>
  );

  const corpInner = (
    <div className="flex flex-col space-y-2">
      <Link href="/about" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Hakkımızda</Link>
      <Link href="/about#vision" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Vizyon</Link>
      <Link href="/about#mission" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Misyon</Link>
      <Link href="/about#clients" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Müşterilerimiz</Link>
      <Link href="/production" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Üretim</Link>
      <Link href="/production#facilities" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Üretim Tesislerimiz</Link>
      <Link href="/production#quality" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Kalite Süreçlerimiz</Link>
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

  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yasar",
    url: "https://yasar.local/",
    logo: "https://yasar.local/photos/yasarLogo2.jpg",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+90-212-000-0000",
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
    <footer className="relative text-white mt-12 bg-[var(--brand-color)]">
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
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-block -mt-1 lg:-mt-2" aria-label="Yasar ana sayfa">
            <Image src="/photos/yasarLogo2.jpg" alt="Yasar" width={200} height={80} className="h-14 lg:h-20 w-auto" />
          </Link>
          <p className="text-sm text-white">Türkiye yapımı iç giyim. Konfor ve kalite odaklı.</p>

          <div className="text-xs text-white/80 space-y-2 leading-relaxed max-w-prose">
            <p>
              1969 yılında kurulan firmamız, yarım asrı aşan köklü tecrübesiyle gecelik, pijama takımı, paçalı pijama altı ve
              iç giyim üretiminde uzmanlaşmış, sektörün önde gelen üretici ve ihracatçıları arasında yer almaktadır.
            </p>

            <p>
              Amerika, Fransa, İspanya, Yunanistan, İsrail başta olmak üzere Doğu Avrupa ve Orta Doğu pazarlarına
              gerçekleştirdiğimiz ihracatlarla, yüksek kalite standartlarımızı ve müşteri odaklı yaklaşımımızı uluslararası
              arenada başarıyla temsil ediyoruz.
            </p>

            <p>
              Güvenilirliği, sürekliliği ve kaliteyi esas alan firmamız, global ölçekte tercih edilen güçlü bir iş ortağı
              olmayı sürdürmektedir.
            </p>
          </div>
        </div>

        <nav aria-label="Bağlantılar" className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">Bağlantılar</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          {/* mobile accordion toggle */}
          {windowWidth < 640 && (
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
          {windowWidth >= 640 ? (
            <div>{linksInner}</div>
          ) : (
            <div
              ref={linksRef}
              className="overflow-hidden"
              style={{
                maxHeight: openLinks ? `${linksRef.current?.scrollHeight ?? 0}px` : '0px',
                transition: 'max-height 250ms ease'
              }}
            >
              {linksInner}
            </div>
          )}
        </nav>

        <nav aria-label="Kurumsal" className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">Kurumsal</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          {windowWidth < 640 && (
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
          {windowWidth >= 640 ? (
            <div>{corpInner}</div>
          ) : (
            <div
              ref={corpRef}
              className="overflow-hidden"
              style={{
                maxHeight: openCorporate ? `${corpRef.current?.scrollHeight ?? 0}px` : '0px',
                transition: 'max-height 250ms ease'
              }}
            >
              {corpInner}
            </div>
          )}
        </nav>

        <div className="flex flex-col space-y-2 pl-4 lg:pl-6">
          <h4 className="text-base lg:text-lg font-semibold text-white">Bizi takip et</h4>
          <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
          <p className="text-sm text-white">Sosyal kanallarımızdan kampanyaları ve yenilikleri takip edebilirsiniz.</p>
          <div className="flex items-center space-x-4 mt-3">
            <a href="#" aria-label="Instagram" className="text-white hover:text-white transform transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/60 rounded inline-block">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h.01" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-white hover:text-white transform transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/60 rounded inline-block">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" className="text-white hover:text-white transform transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/60 rounded inline-block">
              <span className="sr-only">Pinterest</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M8.5 21S8 14.5 8 12.5A4.5 4.5 0 1 1 13 17c-.9 2-2.8 3.9-4.5 4z" />
              </svg>
            </a>
          </div>

          <div className="mt-4 text-sm text-white flex flex-col space-y-2">
            <h4 className="text-base lg:text-lg font-semibold text-white">İletişim</h4>
            <span className="block mt-1 h-0.5 w-12 bg-white/90 rounded" aria-hidden />
            <a href="tel:+902120000000" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">+90 212 000 00 00</a>
            <a href="mailto:info@yasar.example" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">info@yasar.example</a>
            <a href="https://maps.google.com?q=Yasar+Tekstil" target="_blank" rel="noopener noreferrer" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Adresimizi haritada gör</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/70">
          <div className="flex items-center space-x-3">
            <span>© {new Date().getFullYear()} Yasar. Tüm hakları saklıdır.</span>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('yasar_cookie_consent');
                } catch (e) {}
                try {
                  document.cookie = 'yasar_cookie_consent=; max-age=0; path=/';
                } catch (e) {}
                try {
                  delete (window as any).__yasarConsent;
                } catch (e) {}
                // reload to show banner again
                window.location.reload();
              }}
              className="text-[10px] text-white bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded-md transition"
            >
              Çerezleri sıfırla
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">Gizlilik</Link>
            <Link href="/terms" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">Kullanım Şartları</Link>
          </div>
        </div>
      </div>

      {/* Back to top button (yarı saydam siyah arka plan, beyaz ikon) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Sayfanın başına dön"
        className={`fixed right-4 bottom-4 z-50 inline-flex items-center justify-center p-2 rounded-full bg-black/60 text-white hover:bg-black/70 shadow-2xl ring-1 ring-black/20 hover:shadow-2xl transition-opacity transition-transform duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/20 ${showTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <span className="sr-only">Sayfanın başına dön</span>
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
