# Yasar Underwear Site

![CI](https://github.com/metecoskuner/yasar-underwear-site/actions/workflows/ci.yml/badge.svg)

Minimal Next.js (Pages Router) site used for the Yasar redesign demo.

Quick start

- Install dependencies:

```bash
npm install
```

- Run development server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
npm run start
```

Deploy to Vercel

1. Connect this repository to Vercel (https://vercel.com).
2. Vercel autodetects Next.js projects. Default Build command: `npm run build` and Output Directory: (not required for Next.js).
3. If you need specific Node.js version, this repo suggests Node >= 18 (see `package.json` -> `engines`).
4. Add any required Environment Variables in the Vercel project settings.

Notes

- This project uses Next.js (Pages Router), Tailwind CSS and TypeScript.
- If CI or Vercel logs show issues, open the Actions/Deploy logs and share them so they can be fixed quickly.
# Yasar Underwear Site

Kısa kurulum ve çalışma talimatları.

Gereksinimler
# Yasar Underwear Site

Bu depo Yasar markası için yeniden tasarlanmış bir Next.js ön yüzünü içerir.

## Türkçe (TR)

Kısa Açıklama
: Basit bir Next.js projesi. Ürün kartları, ana sayfa, koleksiyon sayfaları ve çoklu dil (i18n) için hazırlık içerir.

Gereksinimler
- Node.js v16 veya üzeri
- npm veya yarn



Eklenecek/Öneriler
- SEO meta tag'ları, mobil navigasyon, CI/CD workflow ve i18n iyileştirmeleri.

## English (EN)

Short description
This repository contains a redesigned Next.js front-end for the Yasar brand.

Requirements
- Node.js v16+
- npm or yarn

Local setup
```bash
cd /Users/metecoskuner/yasar-redesign/yasar-underwear-site
npm install
# or
# yarn install
```

Development
```bash
npm run dev
# then open http://localhost:3000
```

Production
```bash
npm run build
npm start
```

Notes
- `.gitignore` includes common ignores (node_modules, .next, .env).
- Images are in `/public/photos/`.

Deploy
You can deploy this Next.js app to Vercel, Netlify or any Node hosting. For Vercel, connect the GitHub repository and follow Vercel setup.


Contact
Hazırlayan: Mete

---


