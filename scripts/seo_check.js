#!/usr/bin/env node
// Simple SEO check script for local dev
// Usage: node ./scripts/seo_check.js [baseUrl]

const baseArg = process.argv[2]
const BASE = baseArg || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const fetchText = async (url) => {
  const res = await fetch(url)
  const txt = await res.text()
  return { status: res.status, ok: res.ok, text: txt, headers: res.headers }
}

const extractSitemapUrls = (xml) => {
  const locs = []
  const re = /<loc>\s*([^<]+)\s*<\/loc>/g
  let m
  while ((m = re.exec(xml))) locs.push(m[1].trim())
  return locs
}

const parseHeadChecks = (html) => {
  const out = { title: null, canonical: null, og: {}, twitter: {}, jsonLd: null }
  // title
  const tMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  out.title = tMatch ? tMatch[1].trim() : null
  // canonical
  const cMatch = html.match(/<link[^>]*rel=\"canonical\"[^>]*href=\"([^\"]+)\"/i)
  out.canonical = cMatch ? cMatch[1] : null
  // og tags
  const ogRe = /<meta[^>]*property=\"og:([^\"]+)\"[^>]*content=\"([^\"]*)\"/ig
  let om
  while ((om = ogRe.exec(html))) {
    out.og[om[1]] = om[2]
  }
  // twitter tags
  const twRe = /<meta[^>]*name=\"twitter:([^\"]+)\"[^>]*content=\"([^\"]*)\"/ig
  let tm
  while ((tm = twRe.exec(html))) {
    out.twitter[tm[1]] = tm[2]
  }
  // json-ld
  const jMatch = html.match(/<script[^>]*type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/i)
  out.jsonLd = jMatch ? jMatch[1].trim() : null
  return out
}

;(async () => {
  try {
    console.log('Base URL:', BASE)

    // robots.txt
    try {
      const r = await fetchText(`${BASE.replace(/\/$/, '')}/robots.txt`)
      console.log('\n=== /robots.txt ===')
      console.log('Status:', r.status)
      console.log(r.text)
    } catch (err) {
      console.warn('robots.txt fetch error:', err.message)
    }

    // sitemap
    console.log('\n=== /sitemap.xml ===')
    const s = await fetchText(`${BASE.replace(/\/$/, '')}/sitemap.xml`)
    console.log('Status:', s.status)
    if (!s.ok) {
      console.error('Failed to fetch sitemap.xml')
      process.exitCode = 2
      return
    }
    console.log(s.text.slice(0, 2000))

    const urls = extractSitemapUrls(s.text)
    console.log('\nFound', urls.length, 'URLs in sitemap')

    // find up to 3 product urls that include /urunler/
    const productUrlsRaw = urls.filter((u) => u.includes('/urunler/')).slice(0, 3)
    const baseOrigin = (() => {
      try { return new URL(BASE).origin } catch { return BASE.replace(/\/$/, '') }
    })()
    const productUrls = productUrlsRaw.map((u) => u.replace(/^https?:\/\/[^/]+/, baseOrigin))
    if (productUrls.length === 0) {
      console.log('No product urls found in sitemap to check')
      return
    }

    for (const u of productUrls) {
      console.log('\n--- Checking', u)
      const res = await fetchText(u)
      console.log('Status:', res.status)
      const head = parseHeadChecks(res.text)
      console.log('Title:', head.title)
      console.log('Canonical:', head.canonical)
      console.log('OG keys:', Object.keys(head.og).join(', '))
      if (head.og.image) console.log('OG image:', head.og.image)
      console.log('Twitter keys:', Object.keys(head.twitter).join(', '))
      console.log('JSON-LD present:', head.jsonLd ? 'yes' : 'no')
      if (head.jsonLd) {
        let json = null
        try { json = JSON.parse(head.jsonLd) } catch (e) { /* ignore parse error */ }
        console.log('JSON-LD preview:', head.jsonLd.slice(0, 400))
        if (json && json.offers) console.log('Offers.price:', json.offers.price, 'currency:', json.offers.priceCurrency)
      }
    }

    console.log('\nDone')
  } catch (err) {
    console.error('Error', err)
    process.exitCode = 1
  }
})()
