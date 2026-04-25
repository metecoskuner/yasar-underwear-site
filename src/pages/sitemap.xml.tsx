import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

const DEFAULT_SITE_URL = 'https://www.yasarunderwear.com'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function toAbsoluteUrl(host: string, value: string) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `${host}${value.startsWith('/') ? '' : '/'}${value}`
}

function normalizeImages(input: unknown): string[] {
  if (Array.isArray(input)) return input.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
  if (typeof input === 'string') {
    try {
      return normalizeImages(JSON.parse(input))
    } catch {
      return input.trim() ? [input] : []
    }
  }
  if (input && typeof input === 'object') {
    return Object.values(input as Record<string, unknown>).filter((item): item is string => typeof item === 'string' && item.trim() !== '')
  }
  return []
}

export default function Sitemap() {
  // getServerSideProps will handle response
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  try {
    const host = (SITE || `https://${req.headers.host}`).replace(/\/$/, '')
    const now = new Date().toISOString()
    const pages = [
      '/',
      '/about',
      '/about/hakkimizda',
      '/about/misyon-vizyon',
      '/contact',
      '/manufacturer-turkey',
      '/private-label',
      '/privacy',
      '/surdurulebilirlik',
      '/terms',
      '/uretim',
      '/uretim/kalite-surecleri',
      '/uretim/tesisler',
      '/urunler',
      '/wholesale',
    ]

    let products: Array<{ id: string; createdAt?: Date | string; images?: unknown; imageUrl?: string | null }> = []
    try {
      products = await prisma.product.findMany({ select: { id: true, createdAt: true, images: true, imageUrl: true }, orderBy: { createdAt: 'desc' } })
    } catch (err) {
      void err
      try {
        const dataPath = path.join(process.cwd(), 'data', 'products.json')
        const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Array<Record<string, unknown>>
        products = parsed
          .filter((item) => item.id && item.isActive !== false)
          .map((item) => ({
            id: String(item.id),
            createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
            images: item.images,
            imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : null,
          }))
      } catch (fileErr) {
        void fileErr
      }
    }

    const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string; images?: string[] }> = []
    pages.forEach((p) => {
      const priority =
        p === '/' ? '1.0'
        : p === '/urunler' || p === '/private-label' || p === '/wholesale' || p === '/manufacturer-turkey' ? '0.9'
        : p === '/about' || p.startsWith('/uretim') ? '0.8'
        : '0.7'
      urls.push({
        loc: `${host}${p}`,
        lastmod: now,
        changefreq: p === '/' ? 'weekly' : 'monthly',
        priority,
      })
    })
    products.forEach((p) =>
      urls.push({
        loc: `${host}/urunler/${encodeURIComponent(p.id)}`,
        lastmod: new Date(p.createdAt ?? new Date()).toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
        images: Array.from(new Set([...(p.imageUrl ? [p.imageUrl] : []), ...normalizeImages(p.images)])).map((image) => toAbsoluteUrl(host, image)),
      })
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls
      .map((u) => {
        const images = u.images?.length
          ? u.images.map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join('')
          : ''
        return `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : ''}${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}${u.priority ? `<priority>${u.priority}</priority>` : ''}${images}</url>`
      })
      .join('\n')}\n</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.write(xml)
    res.end()

    return { props: {} }
  } catch (err) {
    void err
    return { notFound: true }
  }
}
