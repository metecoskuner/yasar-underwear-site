import Head from 'next/head'

type Alternate = { hrefLang: string; href: string }

type SEOProps = {
  title?: string
  description?: string
  image?: string
  url?: string
  canonical?: string
  alternates?: Alternate[]
  jsonLd?: Record<string, unknown>
  type?: string
}

const DEFAULT_LOCALES = ['tr', 'en', 'fr', 'ar', 'ru']

function ensureAbsolute(site: string, path: string) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = site.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export default function SEO({
  title = 'Yasar',
  description = "Yasar — konforlu iç çamaşırları. Türkiye'de tasarlandı.",
  image = '/photos/yasarLogo2.jpg',
  url = '/',
  canonical,
  alternates,
  jsonLd,
  type = 'website',
}: SEOProps) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const safeUrl = url || '/'
  const fullUrl = safeUrl.startsWith('http') ? safeUrl : (site ? `${site}${safeUrl.startsWith('/') ? '' : '/'}${safeUrl}` : safeUrl)
  const canonicalHref = canonical || fullUrl
  const imageHref = image ? ensureAbsolute(site || '', image) : undefined

  // build alternates automatically if none provided (best-effort)
  const autoAlternates: Alternate[] | undefined = alternates ?? DEFAULT_LOCALES.map((l) => {
    // assume localized pages live under /<lang>/<path> except for 'tr' which is root
    const path = safeUrl === '/' ? '' : safeUrl
    const href = l === 'tr' ? `${site}${path}` : `${site}/${l}${path}`
    return { hrefLang: l, href }
  })

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      {canonicalHref && <link rel="canonical" href={canonicalHref} />}

      {/* hreflang alternates (auto or explicit) */}
      {(alternates ?? autoAlternates)?.map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageHref && <meta property="og:image" content={imageHref} />}
      <meta property="og:url" content={fullUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageHref && <meta name="twitter:image" content={imageHref} />}

      <link rel="icon" href="/photos/yasarLogo2.jpg" />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON.stringify returns string; cast safe for React
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}
