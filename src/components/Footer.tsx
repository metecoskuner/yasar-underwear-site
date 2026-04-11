import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// LOCATIONS not used in Footer; removed import to avoid unused-var lint

// flagEmoji removed: not used in footer

export default function Footer() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yasarunderwear.com').replace(/\/$/, '');
  const mapUrl = 'https://www.google.com/maps?q=Yasar+Camasir,+Mahmutpa%C5%9Fa+Cami+Avlu+i%C3%A7i+No:+12/A,+Mahmutpa%C5%9Fa+Yk%C5%9F.+Sk.,+34120,+T%C3%BCrkiye&ftid=0x14caa563cff9b7c9:0x892026ca3f79739e&entry=gps&shh=CAE&lucs=,94259551,94297699,100808508,100794546,94284496,94231188,94280568,47071704,94218641,94282134,100799877,94286869&g_ep=CAISEjI2LjEzLjYuODg4MzU5NjE4MBgAIIgnKm8sOTQyNTk1NTEsOTQyOTc2OTksMTAwODA4NTA4LDEwMDc5NDU0Niw5NDI4NDQ5Niw5NDIzMTE4OCw5NDI4MDU2OCw0NzA3MTcwNCw5NDIxODY0MSw5NDI4MjEzNCwxMDA3OTk4NzcsOTQyODY4NjlCAklF&skid=8dcef658-1ba7-4dac-9dec-f3ef8bdd396f&g_st=iw';
  const FALLBACK_NUMBER = '+902125190149';
  const rawEnvNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const sanitizedEnvNumber = rawEnvNumber.includes('$') ? '' : rawEnvNumber.trim();
  const envNumber = sanitizedEnvNumber || FALLBACK_NUMBER;
  const phoneHref = envNumber ? `tel:${envNumber}` : 'tel:+902125209299';
  const digitsForWa = envNumber.replace(/[^0-9]/g, '');
  const envMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || '';
  const footerWhatsAppUrl = digitsForWa
    ? `https://wa.me/${digitsForWa}${envMessage ? `?text=${encodeURIComponent(envMessage)}` : ''}`
    : 'https://wa.me/902125190149';
  const footerPhoneLabel = envNumber || '+90 212 520 92 99';
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
  <Link href="/wholesale" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Toptan</Link>
  <Link href="/private-label" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">Özel Marka</Link>
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
    url: `${siteUrl}/`,
    logo: `${siteUrl}/photos/yasarLogo.png`,
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
  <footer className="site-footer relative mt-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.12),_transparent_18%),linear-gradient(180deg,#161619_0%,#0f0f11_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_38%,transparent_70%)]" />

      <div className="relative z-10 border-b border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Yasar Tekstil</p>
            <p className="mt-2 text-sm leading-6 text-white/72 sm:text-base">
              {tr('footer.tagline','Türkiye yapımı iç giyim. Konfor ve kalite odaklı.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/urunler" className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:border-white/24 hover:bg-white/12">
              {tr('footer.products','Ürünlerimiz')}
            </Link>
            <Link href="/wholesale" className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:border-white/24 hover:bg-white/12">
              Toptan
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold !text-slate-900 transition hover:bg-stone-100">
              {tr('footer.contact','İletişim')}
            </Link>
          </div>
        </div>
      </div>

  <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">

        {/* (flags moved to homepage under the map) */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-block -mt-1 lg:-mt-2" aria-label={tr('footer.home','Yasar ana sayfa')}>
            <Image src="/photos/yasarLogo2.jpg" alt="Yasar" width={200} height={80} className="h-14 w-auto lg:h-20" />
          </Link>
          <p className="max-w-xs text-sm leading-6 text-white/85">{tr('footer.tagline','Türkiye yapımı iç giyim. Konfor ve kalite odaklı.')}</p>

          <div className="max-w-prose space-y-2 text-xs leading-relaxed text-white/70">
            <p>{tr('footer.company.paragraph1','1969 yılında kurulan firmamız, yarım asrı aşan köklü tecrübesiyle gecelik, pijama takımı, paçalı pijama altı ve iç giyim üretiminde uzmanlaşmış, sektörün önde gelen üretici ve ihracatçıları arasında yer almaktadır.')}</p>

            <p>{tr('footer.company.paragraph2','Amerika, Fransa, İspanya, Yunanistan, İsrail başta olmak üzere Doğu Avrupa ve Orta Doğu pazarlarına gerçekleştirdiğimiz ihracatlarla, yüksek kalite standartlarımızı ve müşteri odaklı yaklaşımımızı uluslararası arenada başarıyla temsil ediyoruz.')}</p>

            <p>{tr('footer.company.paragraph3','Güvenilirliği, sürekliliği ve kaliteyi esas alan firmamız, global ölçekte tercih edilen güçlü bir iş ortağı olmayı sürdürmektedir.')}</p>
          </div>
        </div>

        <nav aria-label="Bağlantılar" className="flex flex-col space-y-2 md:pl-2 lg:pl-6">
          <h4 className="text-base font-semibold tracking-tight lg:text-lg">{tr('footer.links','Bağlantılar')}</h4>
          <span className="mt-1 block h-0.5 w-12 rounded bg-gradient-to-r from-amber-300 to-transparent" aria-hidden />
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

        <nav aria-label="Kurumsal" className="flex flex-col space-y-2 md:pl-2 lg:pl-6">
          <h4 className="text-base font-semibold tracking-tight lg:text-lg">{tr('footer.corporate.title','Kurumsal')}</h4>
          <span className="mt-1 block h-0.5 w-12 rounded bg-gradient-to-r from-amber-300 to-transparent" aria-hidden />
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

        <div className="flex flex-col space-y-2 md:pl-2 lg:pl-6">
          <h4 className="text-base font-semibold tracking-tight lg:text-lg">{tr('footer.follow.title','Bizi takip et')}</h4>
          <span className="mt-1 block h-0.5 w-12 rounded bg-gradient-to-r from-amber-300 to-transparent" aria-hidden />
          <p className="text-sm leading-6 text-white/78">{tr('footer.follow.desc','Sosyal kanallarımızdan kampanyaları ve yenilikleri takip edebilirsiniz.')}</p>
          <div className="flex items-center space-x-4 mt-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:!text-[#E1306C]"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:!text-[#1877F2]"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13.62 22v-8.03h2.7l.4-3.12h-3.1V8.86c0-.9.25-1.51 1.54-1.51H16.7V4.56c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.92v2.48H8.06v3.12h2.56V22h3Z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={footerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-white transform transition duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded inline-block hover:!text-[#25D366]"
            >
              <span className="sr-only">WhatsApp</span>
              <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
                <path d="M27.3 4.7A15.5 15.5 0 0 0 16.1.1C7.5.1.5 7.1.5 15.7c0 2.7.7 5.4 2.1 7.7L0 32l8.9-2.3c2.1 1.1 4.6 1.7 7.1 1.7h.1c8.6 0 15.6-7 15.6-15.6 0-4.2-1.6-8.1-4.4-11.1ZM16.1 28.7c-2.2 0-4.3-.6-6.1-1.7l-.4-.2-5.3 1.4 1.4-5.1-.3-.4a12.7 12.7 0 0 1-2-7c0-7 5.7-12.7 12.7-12.7 3.4 0 6.6 1.3 9 3.7a12.6 12.6 0 0 1 3.7 9c0 7-5.7 12.7-12.7 12.7Zm7-9.5c-.4-.2-2.2-1.1-2.5-1.3-.3-.1-.5-.2-.7.2-.2.3-.9 1.3-1.1 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.1-2.2-2.5-.2-.4 0-.5.1-.7.1-.1.3-.3.4-.5.2-.2.2-.3.4-.6.1-.2.1-.5 0-.6-.1-.2-.7-1.8-1-2.5-.2-.6-.5-.6-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 5 3.3 1.4 3.3 1 3.9.9.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.2-.7-.4Z" />
              </svg>
            </a>
          </div>

          <div className="mt-4 text-sm text-white flex flex-col space-y-2">
            <h4 className="text-base font-semibold tracking-tight lg:text-lg">{tr('footer.contactInfo.title','İletişim')}</h4>
            <span className="mt-1 block h-0.5 w-12 rounded bg-gradient-to-r from-amber-300 to-transparent" aria-hidden />
            <a href={phoneHref} className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{footerPhoneLabel}</a>
            <a href="mailto:info@yasarunderwear.com" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contactInfo.email','info@yasarunderwear.com')}</a>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform transition-transform duration-150 hover:scale-105">{tr('footer.contactInfo.map','Adresimizi haritada gör')}</a>
            {/* moved developed-by link to bottom center */}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-black/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/70">
          <div className="flex items-center space-x-3">
            {/* Render copyright with current year when translations use a {year} placeholder */}
            {(() => {
              const raw = tr('footer.copyright', `© ${new Date().getFullYear()} Yasar. Tüm hakları saklıdır.`);
              // Avoid constructing JSX inside try/catch. Compute the safe string first.
              let safeText: string;
              try {
                safeText = String(raw).replace(/\{year\}/g, String(new Date().getFullYear()));
              } catch {
                safeText = String(raw);
              }
              return <span>{safeText}</span>;
            })()}
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
            <Link href="/privacy" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">{tr('components.cookieBanner.privacyLink','Gizlilik')}</Link>
            <Link href="/terms" className="text-sm text-white/70 hover:no-underline hover:text-white hover:font-medium transition-all duration-150">{tr('footer.terms','Kullanım Şartları')}</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <a href="https://www.linkedin.com/in/mete-coskuner-8623391a2/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/90 transition hover:border-white/20 hover:bg-white/12 hover:text-white">
            {tr('footer.developedBy','Developed by Mete Coskuner')}
          </a>
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
