import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// safe JSON parse: returns parsed value or undefined on failure
function safeParse<T>(input: unknown): T | undefined {
  if (typeof input !== 'string') return undefined
  try {
    return JSON.parse(input) as T
  } catch (err) {
    try { console.error('[api/content] safeParse failed for input:', String(input).slice(0, 200)) } catch {}
    return undefined
  }
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const entry = await prisma.siteContent.findUnique({ where: { key: 'site' } })
    if (entry && entry.value) {
      // value may be stored as JSON string in sqlite fallback
  let content: any
      if (typeof entry.value === 'string') {
        const parsed = safeParse<Record<string, unknown>>(entry.value)
        // if parsing fails, treat as no admin content so we can fall back to DB products
        content = parsed === undefined ? undefined : parsed
      } else {
        content = entry.value
      }

  // If admin content exists but doesn't include products (or it's an empty array), attach products from DB
  if (!content || !Array.isArray(content.products) || (Array.isArray(content.products) && content.products.length === 0)) {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
        try { console.log('[api/content] DB URL:', String(process.env.DATABASE_URL || '(none)')) } catch {}
        try { console.log('[api/content] DB PRODUCTS COUNT:', Array.isArray(products) ? products.length : 0) } catch {}

        const normalized = products.map((p: unknown) => {
          const rec = p as Record<string, unknown>
          const rawImages = rec.images
          const imgs = typeof rawImages === 'string' ? (safeParse<string[]>(String(rawImages)) ?? (Array.isArray(rawImages) ? (rawImages as string[]) : [])) : Array.isArray(rawImages) ? (rawImages as string[]) : []
          let i18nTitle: Record<string, string> | undefined = undefined
          let titleFallback = ''
          try {
            const rawTitle = rec.title
            if (typeof rawTitle === 'string') {
              let parsed: unknown = undefined
              try { parsed = safeParse<Record<string, unknown>>(rawTitle) } catch {}
              if (parsed && typeof parsed === 'object') {
                // unwrap nested encoded values if present
                const p = parsed as Record<string, unknown>
                try {
                  const maybe = (p.tr && typeof p.tr === 'string') ? (p.tr as string).trim() : ''
                  if (maybe.startsWith('{') || maybe.startsWith('%7B')) {
                    try {
                      const inner = safeParse<Record<string, unknown>>(maybe)
                      if (inner && typeof inner === 'object') parsed = inner
                    } catch {}
                  }
                } catch {}
                i18nTitle = parsed as Record<string, string>
                titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle || {}).find((x) => !!x) || ''
              } else {
                titleFallback = String(rawTitle || '')
              }
            } else if (rawTitle && typeof rawTitle === 'object') {
              // rawTitle may have language values that are themselves encoded JSON strings
              const p = rawTitle as Record<string, unknown>
              const safe: Record<string, string> = {}
              for (const k of ['tr', 'en', 'fr', 'ar', 'ru']) {
                const v = p[k]
                if (typeof v === 'string') {
                  const s = v.trim()
                  if (s.startsWith('{') || s.startsWith('%7B')) {
                    try {
                      const inner = JSON.parse(s)
                      // if inner has tr/en keys, prefer inner.tr as the language text
                      if (inner && typeof inner === 'object') {
                        const innerRec = inner as Record<string, unknown>
                        const innerTr = innerRec.tr
                        if (typeof innerTr === 'string') {
                          safe[k] = String(innerTr || '')
                          continue
                        }
                      }
                    } catch {}
                  }
                  safe[k] = s
                } else {
                  safe[k] = ''
                }
              }
              i18nTitle = safe
              titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle || {}).find((x) => !!x) || ''
            }
          } catch {
            titleFallback = String(rec.title ?? '')
          }
          return {
            ...(rec as Record<string, unknown>),
            images: imgs,
            i18nTitle,
            title: titleFallback,
          }
        })

        // ensure we don't mutate original content object
        const merged = { ...(content || {}), products: normalized }
        try { console.log('[api/content] returning merged content.products count:', Array.isArray(merged.products) ? merged.products.length : 0) } catch {}
        return res.status(200).json({ content: merged })
      }

      try { console.log('[api/content] returning admin content.products count:', Array.isArray(content?.products) ? content.products.length : '(none)') } catch {}
      return res.status(200).json({ content })
    }

    // Debug mode: no admin content present -> return products from DB
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    try { console.log('[api/content] DB URL:', String(process.env.DATABASE_URL || '(none)')) } catch {}
    try { console.log('[api/content] DB PRODUCTS COUNT:', Array.isArray(products) ? products.length : 0) } catch {}

    // normalize images/titles in case they're stored as JSON string (sqlite fallback)
    const normalized = products.map((p: unknown) => {
      const rec = p as Record<string, unknown>
      const rawImages = rec.images
      const imgs = typeof rawImages === 'string' ? (safeParse<string[]>(String(rawImages)) ?? []) : Array.isArray(rawImages) ? (rawImages as string[]) : []
      let i18nTitle: Record<string, string> | undefined = undefined
      let titleFallback = ''
      try {
        const rawTitle = rec.title
        if (typeof rawTitle === 'string') {
          let parsed: unknown = undefined
          try { parsed = safeParse<Record<string, unknown>>(rawTitle) } catch {}
          if (parsed && typeof parsed === 'object') {
            const p = parsed as Record<string, unknown>
            try {
              const maybe = (p.tr && typeof p.tr === 'string') ? (p.tr as string).trim() : ''
              if (maybe.startsWith('{') || maybe.startsWith('%7B')) {
                try {
                  const inner = safeParse<Record<string, unknown>>(maybe)
                  if (inner && typeof inner === 'object') parsed = inner
                } catch {}
              }
            } catch {}
            i18nTitle = parsed as Record<string, string>
            titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle || {}).find((x) => !!x) || ''
          } else {
            titleFallback = String(rawTitle || '')
          }
        } else if (rawTitle && typeof rawTitle === 'object') {
          const p = rawTitle as Record<string, unknown>
          const safe: Record<string, string> = {}
          for (const k of ['tr', 'en', 'fr', 'ar', 'ru']) {
            const v = p[k]
              if (typeof v === 'string') {
                  const s = v.trim()
                  if (s.startsWith('{') || s.startsWith('%7B')) {
                    try {
                      const inner = safeParse<Record<string, unknown>>(s)
                      if (inner && typeof inner === 'object') {
                        const innerRec = inner as Record<string, unknown>
                        const innerTr = innerRec.tr
                        if (typeof innerTr === 'string') {
                          safe[k] = String(innerTr || '')
                          continue
                        }
                      }
                    } catch {}
                  }
                  safe[k] = s
            } else {
              safe[k] = ''
            }
          }
          i18nTitle = safe
          titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle || {}).find((x) => !!x) || ''
        }
      } catch {
        titleFallback = String(rec.title ?? '')
      }
      return {
        ...(rec as Record<string, unknown>),
        images: imgs,
        i18nTitle,
        title: titleFallback,
      }
    })
    return res.status(200).json({ content: { products: normalized } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'server_error' })
  }

}
