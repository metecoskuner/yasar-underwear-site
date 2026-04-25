import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import type { Product } from '@/types/product'

function safeParseStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.filter((item): item is string => typeof item === 'string')
  if (typeof input !== 'string') return []
  try {
    const parsed = JSON.parse(input)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function normalizeI18nMap(input: unknown): Record<string, string> | undefined {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')])
    )
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')])
        )
      }
    } catch {
      return undefined
    }
  }
  return undefined
}

function mapGender(raw: unknown): Product['gender'] | undefined {
  if (!raw && raw !== '') return undefined
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s) return undefined
  if (s.startsWith('erk') || s === 'male' || s === 'm') return 'male'
  if (s.startsWith('kad') || s === 'female' || s === 'f') return 'female'
  if (s === 'unisex' || s === 'uni') return 'unisex'
  return undefined
}

function normalizeProduct(raw: unknown): Product {
  const p = raw as Record<string, unknown>
  const imgs = safeParseStringArray(p.images)

  let i18nTitle: Record<string, string> | undefined
  let i18nDescription: Record<string, string> | undefined
  let titleFallback = ''

  try {
    i18nTitle = normalizeI18nMap(p.i18nTitle)
    i18nDescription = normalizeI18nMap(p.i18nDescription)
    if (i18nTitle) {
      titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle).find((x) => !!x) || ''
    } else if (typeof p.title === 'string') {
      const parsedTitle = normalizeI18nMap(p.title)
      if (parsedTitle) {
        i18nTitle = parsedTitle
        titleFallback = i18nTitle.tr || i18nTitle.en || Object.values(i18nTitle).find((x) => !!x) || ''
      } else {
        titleFallback = String(p.title)
      }
    }
  } catch {
    // ignore malformed product translations
  }

  const product: Product = {
    id: String(p.id ?? ''),
    title: titleFallback || String(p.title ?? ''),
    isFeatured: Boolean(p.isFeatured),
    images: imgs,
    stock: typeof p.stock === 'number' ? p.stock : Number(p.stock) || 0,
  }

  if (i18nTitle) product.i18nTitle = i18nTitle
  if (i18nDescription) product.i18nDescription = i18nDescription
  if (typeof p.productCode === 'string') product.productCode = p.productCode
  if (typeof p.description === 'string') product.description = p.description
  if (typeof p.image === 'string') product.image = p.image
  else if (imgs[0]) product.image = imgs[0]
  if (typeof p.color === 'string') product.color = p.color
  if (p.createdAt) product.createdAt = new Date(Number(p.createdAt) || String(p.createdAt)).toISOString()
  const gender = mapGender(p.gender)
  if (gender) product.gender = gender
  if (typeof p.category === 'string') product.category = p.category

  return product
}

export async function loadProducts(): Promise<Product[]> {
  let rawProducts: unknown[] = []

  try {
    rawProducts = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
        const { data, error } = await supabase.from('Product').select('*').order('createdAt', { ascending: false })
        if (!error && data) rawProducts = data
      } catch {
        rawProducts = []
      }
    }
  }

  return rawProducts.map(normalizeProduct)
}
