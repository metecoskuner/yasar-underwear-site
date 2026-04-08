import React from 'react'
import Head from 'next/head'

type Alternate = { hrefLang: string; href: string }

type SEOProps = {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  url?: string
  canonical?: string
  alternates?: Alternate[]
  jsonLd?: Record<string, unknown>
  type?: string
  keywords?: string[]
  noindex?: boolean
}

const DEFAULT_LOCALES = ['tr', 'en', 'fr', 'ar', 'ru']
const DEFAULT_SITE_URL = 'https://yasarunderwear.com'
const LOCALE_TO_OG: Record<string, string> = {
  tr: 'tr_TR',
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_AR',
  ru: 'ru_RU',
}

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
  image = '/photos/yasarLogo.png',
  imageAlt = 'Yasar',
  url = '/',
  canonical,
  alternates,
  jsonLd,
  type = 'website',
  keywords,
  noindex = false,
}: SEOProps): React.ReactElement {

  const site = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
  const safeUrl = url || '/'
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr'
  const ogLocale = LOCALE_TO_OG[locale] || 'tr_TR'

  const fullUrl = safeUrl.startsWith('http')
    ? safeUrl
    : (site ? `${site}${safeUrl.startsWith('/') ? '' : '/'}${safeUrl}` : safeUrl)

  const canonicalHref = canonical || fullUrl
  const imageHref = image ? ensureAbsolute(site || '', image) : undefined

  const autoAlternates: Alternate[] = DEFAULT_LOCALES.map((l) => {
    const path = safeUrl === '/' ? '' : safeUrl
    const href = l === 'tr' ? `${site}${path}` : `${site}/${l}${path}`
    return { hrefLang: l, href }
  })

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

      {(alternates ?? autoAlternates).map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
      ))}
      {site ? <link rel="alternate" hrefLang="x-default" href={`${site}${safeUrl === '/' ? '' : safeUrl}`} /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Yasar" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageHref && <meta property="og:image" content={imageHref} />}
      {imageHref && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:url" content={fullUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageHref && <meta name="twitter:image" content={imageHref} />}
      {imageHref && <meta name="twitter:image:alt" content={imageAlt} />}

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}
