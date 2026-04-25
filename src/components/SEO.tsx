import React from 'react'
import Head from 'next/head'

type Alternate = { hrefLang: string; href: string }
type Breadcrumb = { name: string; item: string }

type SEOProps = {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  url?: string
  canonical?: string
  alternates?: Alternate[] | false
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
  breadcrumbs?: Breadcrumb[]
  type?: string
  keywords?: string[]
  noindex?: boolean
}

const DEFAULT_SITE_URL = 'https://www.yasarunderwear.com'
const LOCALE_TO_OG: Record<string, string> = {
  tr: 'tr_TR',
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_AR',
  ru: 'ru_RU',
}

function cleanSiteUrl(site: string) {
  return (site || DEFAULT_SITE_URL).replace(/\/$/, '')
}

function ensureAbsolute(site: string, path: string) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = cleanSiteUrl(site)
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function normalizeCanonical(site: string, rawUrl: string) {
  const fallback = '/'
  const value = rawUrl || fallback
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const parsed = new URL(value)
      parsed.hash = ''
      return parsed.toString().replace(/\/$/, parsed.pathname === '/' ? '/' : '')
    } catch {
      return value
    }
  }

  const [pathOnly] = value.split('#')
  const path = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  return `${cleanSiteUrl(site)}${path === '/' ? '' : path}`
}

export default function SEO({
  title = 'Yasar',
  description = "Yasar — konforlu iç çamaşırları. Türkiye'de tasarlandı.",
  image = '/photos/yasarLogo.png',
  imageAlt = 'Yasar',
  imageWidth = 1200,
  imageHeight = 630,
  url = '/',
  canonical,
  alternates,
  jsonLd,
  breadcrumbs,
  type = 'website',
  keywords,
  noindex = false,
}: SEOProps): React.ReactElement {

  const site = cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)
  const safeUrl = url || '/'
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr'
  const ogLocale = LOCALE_TO_OG[locale] || 'tr_TR'

  const fullUrl = normalizeCanonical(site, safeUrl)
  const canonicalHref = canonical ? normalizeCanonical(site, canonical) : fullUrl
  const imageHref = image ? ensureAbsolute(site, image) : undefined
  const breadcrumbSchema = breadcrumbs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: ensureAbsolute(site, breadcrumb.item),
    })),
  } : null
  const jsonLdItems = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ]

  const robots = noindex
    ? 'noindex,nofollow,noarchive'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      {keywords?.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}

      {canonicalHref && <link rel="canonical" href={canonicalHref} />}

      {Array.isArray(alternates) ? alternates.map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={ensureAbsolute(site, a.href)} />
      )) : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Yasar" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageHref && <meta property="og:image" content={imageHref} />}
      {imageHref && <meta property="og:image:alt" content={imageAlt} />}
      {imageHref && <meta property="og:image:width" content={String(imageWidth)} />}
      {imageHref && <meta property="og:image:height" content={String(imageHeight)} />}
      <meta property="og:url" content={fullUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageHref && <meta name="twitter:image" content={imageHref} />}
      {imageHref && <meta name="twitter:image:alt" content={imageAlt} />}

      {jsonLdItems.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  )
}
