import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

const DEFAULT_SITE_URL = 'https://yasarunderwear.com'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
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

    let products: Array<{ id: string; createdAt?: Date }> = []
    try {
      products = await prisma.product.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } })
    } catch (err) {
      void err
    }

    const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }> = []
    pages.forEach((p) => {
      urls.push({
        loc: `${host}${p}`,
        lastmod: now,
        changefreq: p === '/' ? 'weekly' : 'monthly',
        priority: p === '/' ? '1.0' : p === '/urunler' ? '0.9' : '0.7',
      })
    })
    products.forEach((p) =>
      urls.push({
        loc: `${host}/urunler/${encodeURIComponent(p.id)}`,
        lastmod: (p.createdAt ?? new Date()).toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
      })
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : ''}${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}${u.priority ? `<priority>${u.priority}</priority>` : ''}</url>`)
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
