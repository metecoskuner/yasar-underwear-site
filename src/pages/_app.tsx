import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { LanguageProvider } from '../contexts/LanguageContext';
import CookieBanner from '../components/CookieBanner';
import React, { useState, useEffect } from 'react';
import Splash from '../components/Splash';

export default function App({ Component, pageProps }: AppProps) {
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

  return (
    <LanguageProvider>
      {/* Splash shown only on initial load. Duration tuned to 0.7s by default inside the component. */}
      {showSplash && <Splash duration={700} onFinish={() => setShowSplash(false)} />}

      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CookieBanner />
    </LanguageProvider>
  );
}
