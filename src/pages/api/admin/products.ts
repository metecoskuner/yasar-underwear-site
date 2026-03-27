import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { isAuthed } from '@/lib/adminAuth'
// Supabase fallback client for Vercel connection pool issues

type IncomingProduct = {
  id?: string
  title?: unknown
  description?: unknown
  productCode?: unknown
  gender?: unknown
  images?: unknown
  stock?: unknown
  isActive?: unknown
  isFeatured?: unknown
}

function validateProductPayload(payload: IncomingProduct) {
  const errors: string[] = []
  // support localized titles: either a string (legacy) or an object like { tr: '', en: '', fr: '', ar: '', ru: '' }
  const langs = ['tr', 'en', 'fr', 'ar', 'ru']
  let titleObj: Record<string, string> | null = null
  if (typeof payload.title === 'string') {
    // legacy single-string title, assume Turkish
    titleObj = { tr: payload.title.trim(), en: '', fr: '', ar: '', ru: '' }
  } else if (payload.title && typeof payload.title === 'object') {
    titleObj = {} as Record<string, string>
    // payload.title may sometimes contain nested/encoded JSON strings (e.g. { tr: "{\"tr\":...}" })
    // detect and unwrap that case so we don't store double-encoded values.
    let titleRec = payload.title as Record<string, unknown>
    try {
      // common pattern: a single language field (e.g. tr) contains an encoded JSON object
      const maybe = (titleRec.tr && typeof titleRec.tr === 'string' ? (titleRec.tr as string).trim() : '')
      if (maybe.startsWith('{') || maybe.startsWith('%7B')) {
        try {
          const parsed = JSON.parse(maybe)
          if (parsed && typeof parsed === 'object') {
            titleRec = parsed as Record<string, unknown>
          }
        } catch {}
      }
    } catch {}
    for (const l of langs) {
      const v = titleRec[l]
      titleObj[l] = typeof v === 'string' ? v.trim() : ''
    }
  } else {
    titleObj = { tr: '', en: '', fr: '', ar: '', ru: '' }
  }
  const productCode = typeof payload.productCode === 'string' ? payload.productCode.trim() : ''
  // require Turkish title at minimum
  if (!titleObj.tr) errors.push('title_tr_required')
  if (!productCode) errors.push('productCode_required')

  const allowedGenders = ['', 'Erkek', 'Kadın']
  const gender = typeof payload.gender === 'string' ? payload.gender : ''
  if (!allowedGenders.includes(gender)) errors.push('gender_invalid')

  let images: string[] = []
  if (payload.images === undefined || payload.images === null) {
    images = []
  } else if (Array.isArray(payload.images)) {
    // allow nullable slots (e.g. [null, "url", null]) coming from the client
    const bad = payload.images.some((it) => !(typeof it === 'string' || it === null))
    if (bad) {
      errors.push('images_must_be_string_array')
    } else {
      images = (payload.images as Array<string | null>).filter((it): it is string => typeof it === 'string')
    }
  } else {
    errors.push('images_must_be_array')
  }

  const description = typeof payload.description === 'string' ? payload.description : null
  const stock = Number(payload.stock) || 0
  const isActive = !!payload.isActive
  const isFeatured = !!payload.isFeatured

  return {
    valid: errors.length === 0,
    errors,
    data: {
      id: typeof payload.id === 'string' ? payload.id : undefined,
      // return the localized title object
      title: titleObj,
      productCode,
      description,
      gender,
      images,
      stock,
      isActive,
      isFeatured,
    },
  }
}

// Defensive parser for incoming title values. Accepts a string or object and
// returns a flat record { tr, en, fr, ar, ru } with plain strings.
function normalizeIncomingTitle(raw: unknown): Record<string, string> {
  const langs = ['tr', 'en', 'fr', 'ar', 'ru']
  const out: Record<string, string> = { tr: '', en: '', fr: '', ar: '', ru: '' }
  try {
    if (!raw) return out
    // If it's a string, try to parse it (may be JSON-encoded)
    let candidate: unknown = raw
    if (typeof raw === 'string') {
      const s = raw.trim()
      if (!s) return out
      try {
        candidate = JSON.parse(s)
      } catch {
        // keep as string
      }
    }

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      const rec = candidate as Record<string, unknown>
      // Sometimes a language field itself is a JSON string (double-encoded).
      for (const l of langs) {
        const v = rec[l]
        if (typeof v === 'string') {
          const s = v.trim()
          if (s.startsWith('{') || s.startsWith('%7B')) {
            try {
              const inner = JSON.parse(s)
              if (inner && typeof inner === 'object' && typeof (inner as Record<string, unknown>).tr === 'string') {
                out[l] = String((inner as Record<string, unknown>).tr ?? '')
                continue
              }
            } catch {}
          }
          out[l] = s
        } else {
          out[l] = ''
        }
      }
      return out
    }

    // If we reach here and candidate is just a string, use it as Turkish title
    if (typeof candidate === 'string') {
      out.tr = String(candidate)
    }
  } catch {
    // fallthrough to empty
  }
  return out
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false, message: 'unauthorized' })

  try {
    if (req.method === 'GET') {
      let products: unknown[] = []
      let useSupabase = false
      
      // Try Prisma first
      try {
        products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
      } catch (prismaErr) {
        console.warn('[PRODUCTS GET] Prisma failed, falling back to Supabase:', prismaErr)
        // Fallback to Supabase
        try {
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          )
          const { data, error } = await supabase
            .from('Product')
            .select('*')
            .order('createdAt', { ascending: false })
          
          if (error) {
            console.error('[PRODUCTS GET] Supabase error:', error)
            throw error
          }
          products = data || []
          useSupabase = true
        } catch (supabaseErr) {
          console.error('[PRODUCTS GET] Both Prisma and Supabase failed:', supabaseErr)
          // Return empty list instead of failing
          products = []
        }
      }

      // normalize images and localized title: if stored as JSON string (sqlite fallback), parse them
      const normalized = products.map((p: unknown) => {
        const rec = p as Record<string, unknown>
        const rawImages = rec.images
        const imgs = typeof rawImages === 'string' ? JSON.parse(String(rawImages)) : Array.isArray(rawImages) ? (rawImages as string[]) : []
        let i18nTitle: Record<string, string> | undefined = undefined
        let titleFallback = ''
        try {
          const rawTitle = rec.title
          if (typeof rawTitle === 'string') {
            let parsed: unknown = undefined
            try { parsed = JSON.parse(rawTitle) } catch {}
            if (parsed && typeof parsed === 'object') {
              // unwrap nested encoded values if present (e.g. parsed.tr is itself a JSON string)
              const p = parsed as Record<string, unknown>
              try {
                const maybe = (p.tr && typeof p.tr === 'string') ? (p.tr as string).trim() : ''
                if (maybe.startsWith('{') || maybe.startsWith('%7B')) {
                  try {
                    const inner = JSON.parse(maybe)
                    if (inner && typeof inner === 'object') {
                      parsed = inner
                    }
                  } catch {}
                }
              } catch {}
              i18nTitle = parsed as Record<string, string>
              titleFallback = (i18nTitle.tr || i18nTitle.en) || Object.values(i18nTitle || {}).find((x) => !!x) || ''
            } else {
              titleFallback = String(rawTitle || '')
            }
          }
          } catch {
          const rawTitle = (rec.title ?? '') as unknown
          titleFallback = typeof rawTitle === 'string' ? rawTitle : String(rawTitle)
        }
        return {
          // keep known fields from the DB record; copy generically
          id: String(rec.id ?? ''),
          title: titleFallback,
          i18nTitle,
          description: typeof rec.description === 'string' ? rec.description : null,
          productCode: typeof rec.productCode === 'string' ? rec.productCode : undefined,
          gender: typeof rec.gender === 'string' ? rec.gender : undefined,
          images: imgs,
          stock: typeof rec.stock === 'number' ? rec.stock : Number(rec.stock ?? 0) || 0,
          isActive: !!rec.isActive,
          isFeatured: !!rec.isFeatured,
          createdAt: rec.createdAt ? String(rec.createdAt) : undefined,
        }
      })
      return res.status(200).json({ ok: true, products: normalized })
    }

    if (req.method === 'POST') {
      const payload = validateProductPayload(req.body || {})
      if (!payload.valid) return res.status(400).json({ ok: false, message: 'validation_failed', errors: payload.errors })
      const d = payload.data
      
      // Try Prisma first, fallback to Supabase if needed
      try {
        // enforce max 8 featured products
        if (d.isFeatured) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TS: local Prisma generated types may differ from runtime schema
          const featuredCount = await prisma.product.count({ where: { isFeatured: true } })
          if (featuredCount >= 8) return res.status(400).json({ ok: false, message: 'featured_limit', detail: 'Maximum 8 featured products allowed' })
        }
        const createData = {
          // Ensure title stored in DB is a properly-structured object (stringified).
          title: JSON.stringify(normalizeIncomingTitle(d.title)),
          description: d.description ?? null,
          productCode: d.productCode,
          gender: d.gender ?? '',
          images: JSON.stringify(d.images || []),
          stock: d.stock || 0,
          isActive: !!d.isActive,
          isFeatured: !!d.isFeatured,
        }
        // Log DB URL to confirm environment
        try { console.log('[admin/products] DB URL:', String(process.env.DATABASE_URL || '(none)')) } catch {}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TS: local Prisma generated types may differ from runtime schema
        const created = await prisma.product.create({ data: createData })
        // Confirm DB write by reading back all products and return the total count
        const all = await prisma.product.findMany()
        try { console.log('[admin/products] DB PRODUCTS COUNT:', Array.isArray(all) ? all.length : 0) } catch {}
        // return total so we can validate writes from the admin UI
        return res.status(200).json({ ok: true, product: created, total: Array.isArray(all) ? all.length : 0 })
      } catch (prismaErr: unknown) {
        console.error('prisma create error:', prismaErr)
        // Fallback to Supabase
        try {
          console.warn('[PRODUCTS POST] Prisma failed, falling back to Supabase')
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          )
          const createData: Record<string, unknown> = {
            title: JSON.stringify(normalizeIncomingTitle(d.title)),
            description: d.description ?? null,
            productCode: d.productCode,
            gender: d.gender ?? '',
            images: JSON.stringify(d.images || []),
            stock: d.stock || 0,
            isActive: !!d.isActive,
            isFeatured: !!d.isFeatured,
            createdAt: new Date().toISOString(),
          }
          // Supabase will generate id if not provided
          const { data, error } = await supabase
            .from('Product')
            .insert([createData])
            .select()
          
          if (error) {
            console.error('[PRODUCTS POST] Supabase insert error:', error)
            throw error
          }
          
          const created = data && data.length > 0 ? data[0] : null
          if (!created) throw new Error('No data returned from Supabase insert')
          
          // Get total count
          const { count } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true })
          
          return res.status(200).json({ ok: true, product: created, total: count || 1 })
        } catch (supabaseErr: unknown) {
          console.error('[PRODUCTS POST] Both Prisma and Supabase failed:', supabaseErr)
          const errRec = supabaseErr as { message?: unknown; code?: unknown; meta?: unknown }
          const detail = errRec && errRec.message ? String(errRec.message) : String(supabaseErr)
          return res.status(500).json({ ok: false, message: 'create_failed', detail })
        }
      }
    }

    if (req.method === 'PUT') {
      // allow partial updates (e.g. toggling only isFeatured). To validate, fetch existing product
      const id = (req.body && (req.body.id as string)) || undefined
      if (!id) return res.status(400).json({ ok: false, message: 'missing_id' })
      try {
        // cast to a loose record because local generated Prisma types may not match runtime schema
        const existing = (await prisma.product.findUnique({ where: { id } })) as unknown as Record<string, unknown>
        if (!existing) return res.status(404).json({ ok: false, message: 'not_found' })

        // normalize existing images (could be stored as JSON string in sqlite fallback)
        const existingImages = typeof existing.images === 'string' ? JSON.parse(String(existing.images)) : (Array.isArray(existing.images) ? (existing.images as string[]) : [])

        // build merged payload: incoming fields override existing
        const incoming = req.body || {}
        const merged = {
          id,
          title: typeof incoming.title === 'string' ? incoming.title : (existing.title as string | undefined),
          productCode: typeof incoming.productCode === 'string' ? incoming.productCode : (existing.productCode as string | undefined),
          description: typeof incoming.description === 'string' ? incoming.description : (existing.description as string | null | undefined),
          gender: typeof incoming.gender === 'string' ? incoming.gender : (existing.gender as string | undefined),
          images: incoming.images !== undefined ? incoming.images : existingImages,
          stock: incoming.stock !== undefined ? Number(incoming.stock) || 0 : (existing.stock as number | undefined) || 0,
          isActive: incoming.isActive !== undefined ? !!incoming.isActive : !!existing.isActive,
          isFeatured: incoming.isFeatured !== undefined ? !!incoming.isFeatured : !!existing.isFeatured,
        }

        const payload = validateProductPayload(merged as IncomingProduct)
        if (!payload.valid) return res.status(400).json({ ok: false, message: 'validation_failed', errors: payload.errors })
        const d = payload.data

        // enforce max 8 featured products (exclude current product)
        if (d.isFeatured) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TS: local Prisma generated types may differ from runtime schema
          const featuredCount = await prisma.product.count({ where: { isFeatured: true, NOT: { id } } })
          if (featuredCount >= 8) return res.status(400).json({ ok: false, message: 'featured_limit', detail: 'Maximum 8 featured products allowed' })
        }

        const updateData = {
          // Normalize title before writing to DB to avoid double-encoding
          title: JSON.stringify(normalizeIncomingTitle(d.title)),
          description: d.description ?? null,
          productCode: d.productCode,
          gender: d.gender ?? '',
          images: JSON.stringify(d.images || []),
          stock: d.stock || 0,
          isActive: !!d.isActive,
          isFeatured: !!d.isFeatured,
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TS: local Prisma generated types may differ from runtime schema
        const updated = await prisma.product.update({ where: { id }, data: updateData })
        return res.status(200).json({ ok: true, product: updated })
      } catch (innerErr: unknown) {
        console.error('prisma update error:', innerErr)
        const errRec = innerErr as { message?: unknown; code?: unknown; meta?: unknown }
        const detail = errRec && errRec.message ? String(errRec.message) : String(innerErr)
        const code = errRec && errRec.code ? String(errRec.code) : undefined
        const meta = errRec && errRec.meta ? errRec.meta : undefined
        return res.status(500).json({ ok: false, message: 'update_failed', detail, code, meta })
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      // delete a single product by id
      if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, message: 'missing_id' })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TS: local Prisma generated types may differ from runtime schema
      await prisma.product.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false })
  } catch (err: unknown) {
    const errRec = err as { message?: unknown }
    console.error('admin/products handler error:', errRec.message ?? err)
    const detail = errRec.message ? String(errRec.message) : String(err)
    return res.status(500).json({ ok: false, message: 'server_error', detail })
  }
}
