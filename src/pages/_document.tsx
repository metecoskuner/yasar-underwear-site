import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="500x500" href="/photos/yasarLogo.png" />
        <link rel="apple-touch-icon" sizes="500x500" href="/photos/yasarLogo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#7c2d12" />
        <meta name="apple-mobile-web-app-title" content="Yasar" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
