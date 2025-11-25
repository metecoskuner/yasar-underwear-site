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

Kurulum (yerel)
```bash
cd /Users/metecoskuner/yasar-redesign/yasar-underwear-site
npm install
# veya
# yarn install
```

Geliştirme
```bash
npm run dev
# ardından http://localhost:3000 aç
```

Production build
```bash
npm run build
npm start
```

Notlar
- `.gitignore` dosyası projeye eklendi (node_modules, .next, .env vb.).
- Görseller `/public/photos/` içinde bulunuyor.

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

Useful commands
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm start` — start built app (if configured)

License
Lisans belirtilmemiştir. İstersen MIT lisansı ekleyebilirim.

Contact
Hazırlayan: Mete

---

Not: Uzak (GitHub) henüz eklenmedi. GitHub'a göndermek için:

1) GitHub'da yeni bir repository oluştur (ör: `yasar-underwear-site`).
2) Terminalde:

```bash
git remote add origin https://github.com/USERNAME/yasar-underwear-site.git
git branch -M main
git push -u origin main
```


