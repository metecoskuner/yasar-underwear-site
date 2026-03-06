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
    // Always show the splash on each page load/refresh.
    // Keep the deferred setState to avoid SSR/client hydration mismatch.
    const defer = window.setTimeout(() => setShowSplash(true), 0);

    return () => clearTimeout(defer);
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