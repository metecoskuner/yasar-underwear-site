import { GetServerSideProps } from 'next'

const DEFAULT_SITE_URL = 'https://yasarunderwear.com'

export default function Robots() {
  // handled by getServerSideProps
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const host = process.env.NEXT_PUBLIC_SITE_URL || (req.headers.host ? `https://${req.headers.host}` : DEFAULT_SITE_URL)
  const site = host.replace(/\/$/, '')
  const sitemap = `${site}/sitemap.xml`
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    `Sitemap: ${sitemap}`,
  ]
  const body = lines.join('\n') + '\n'

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.write(body)
  res.end()

  return { props: {} }
}
