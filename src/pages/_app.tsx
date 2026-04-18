import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { LanguageProvider } from '../contexts/LanguageContext';
import CookieBanner from '../components/CookieBanner';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Splash from '../components/Splash';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function trackPageView(url: string) {
  if (!GA_ID || typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, {
    page_path: url,
  });
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Start as false to avoid SSR/client hydration mismatch.
  // We'll check sessionStorage on mount and show the splash only if it hasn't been shown in this session.
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    let defer: number | undefined;
    try {
      const seen = window.sessionStorage.getItem('yasar_splash_seen');
      if (!seen) {
        defer = window.setTimeout(() => {
          setShowSplash(true);
          try {
            window.sessionStorage.setItem('yasar_splash_seen', '1');
          } catch (err) {
            void err;
          }
        }, 0);
      }
    } catch (err) {
      void err;
      defer = window.setTimeout(() => setShowSplash(true), 0);
    }

    return () => {
      if (defer !== undefined) clearTimeout(defer);
    };
  }, []);

  // Add a 'js' class to <html> on mount so CSS can opt-in to JS-only
  // animations without hiding content for no-JS users. We remove it on
  // unmount for cleanliness (rare in Next.js but safe to do).
  useEffect(() => {
    try {
      document.documentElement.classList.add('js');
      return () => document.documentElement.classList.remove('js');
    } catch (e) {
      void e;
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!GA_ID) return;

    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    trackPageView(router.asPath);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.asPath, router.events]);

  return (
    <LanguageProvider>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}

      {/* Splash shown only on initial load. Duration tuned to 0.7s by default inside the component. */}
      {showSplash && <Splash duration={700} onFinish={() => setShowSplash(false)} />}

      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CookieBanner />
    </LanguageProvider>
  );
}
