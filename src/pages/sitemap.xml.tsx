import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || ''

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function Sitemap() {
  // getServerSideProps will handle response
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  try {
    const host = SITE || `https://${req.headers.host}`
    // static pages
  const pages = ['/', '/urunler', '/contact', '/about', '/privacy', '/terms']

    // include products by id as /urunler?product=id
    let products: Array<{ id: string; createdAt?: Date }> = []
    try {
      products = await prisma.product.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } })
    } catch (err) {
      // ignore if prisma not available
      console.error('sitemap products read error', err)
    }

    const urls: string[] = []
    pages.forEach((p) => urls.push(`${host}${p}`))
  products.forEach((p) => urls.push(`${host}/urunler/${encodeURIComponent(p.id)}`))

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`)
      .join('\n')}\n</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.write(xml)
    res.end()

    return { props: {} }
  } catch (err) {
    console.error('sitemap error', err)
    return { notFound: true }
  }
}
