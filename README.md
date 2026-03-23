# Yasar Underwear Site

![CI](https://github.com/metecoskuner/yasar-underwear-site/actions/workflows/ci.yml/badge.svg)

A modern Next.js (Pages Router) e-commerce site for Yasar brand, built with TypeScript, Tailwind CSS, and Prisma.

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL database or Supabase

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials and API keys

# Run database migrations
npx prisma migrate deploy
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production

```bash
npm run build
npm run start
```

## Environment Setup

Create a `.env.local` file based on `.env.example`. Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (optional)
- `ADMIN_USER` / `ADMIN_PASS` - Admin credentials

## Project Structure

```
src/
├── pages/           # Next.js pages and API routes
├── components/      # Reusable React components
├── contexts/        # React Context providers (i18n)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── locales/         # i18n translation files (TR, EN, FR, AR, RU)
├── styles/          # Global CSS and Tailwind
└── types/           # TypeScript types
```

## Features

- 🌐 **Multi-language support** - Turkish, English, French, Arabic, Russian
- 🎨 **Modern UI** - Tailwind CSS with Framer Motion animations
- 📦 **Product management** - Admin panel for products, messages, and content
- 🛍️ **E-commerce** - Product catalog, favorites wishlist, B2B forms
- 📱 **Responsive design** - Mobile-first approach with full responsive support
- 🔐 **Admin authentication** - Secure admin panel

## Database

This project uses Prisma ORM with PostgreSQL. Models:
- `Product` - Product catalog
- `ContactMessage` - Contact form submissions
- `SiteContent` - CMS content storage
- `HoneypotLog` - Spam protection logs

Run `npx prisma studio` to browse the database.

## Deployment

### Vercel (Recommended)

1. Connect repository to [Vercel](https://vercel.com)
2. Set environment variables in Vercel project settings
3. Deploy - automatic on push to `main` branch

### Other Platforms

- Docker: Use `npm run build && npm run start`
- Railway, Render, Heroku: Configure buildpack for Node.js

## API Routes

- `POST /api/contact` - Submit contact form
- `POST /api/b2b` - B2B inquiry
- `POST /api/quote` - Quote request
- `POST /api/content` - Update site content (admin)

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run seed             # Seed database with demo data
npm run capture-screenshots  # Capture UI screenshots
```

## Troubleshooting

### Database connection issues
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running or Supabase is reachable
- Run `npx prisma db push` to sync schema

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feat/your-feature`
4. Open a pull request

## License

© 2026 Yasar. All rights reserved.

---


