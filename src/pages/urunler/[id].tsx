import { GetServerSideProps } from 'next'
import React from 'react'
import SEO from '@/components/SEO'
import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

type Product = {
  id: string
  title: string
  productCode?: string
  description?: string
  images: string[]
  stock?: number | null
  price?: number | null
}

export default function ProductPage({ product }: { product: Product }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  const pageUrl = `/urunler/${product.id}`
  const image = product.images?.[0]
  const fullImage = image && site ? `${site.replace(/\/$/, '')}${image.startsWith('/') ? '' : '/'}${image}` : image

  const availability = product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.productCode || undefined,
    image: product.images && product.images.length ? product.images.map((i) => (site ? `${site.replace(/\/$/, '')}${i.startsWith('/') ? '' : '/'}${i}` : i)) : undefined,
    description: product.description || undefined,
    url: site ? `${site.replace(/\/$/, '')}${pageUrl}` : pageUrl,
    offers: {
      '@type': 'Offer',
      availability,
      price: product.price != null ? String(product.price) : undefined,
      priceCurrency: process.env.NEXT_PUBLIC_CURRENCY || 'TRY',
    },
  }

  return (
    <Layout>
      <SEO
        title={`${product.title} — Yasar`}
        description={product.description || `${product.title} — Yasar ürün`}
        image={fullImage || undefined}
        url={pageUrl}
        jsonLd={jsonLd}
        type="product"
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
        {image && <img src={fullImage || image} alt={product.title} className="w-full max-h-96 object-contain" />}
        <p className="mt-4 text-gray-700">{product.description}</p>
        <div className="mt-6">
          <div>SKU: <span className="font-mono">{product.productCode}</span></div>
          <div>Fiyat: {product.price != null ? `${product.price} ${process.env.NEXT_PUBLIC_CURRENCY || 'TRY'}` : 'Görünmüyor'}</div>
          <div>Stok: {product.stock != null ? String(product.stock) : 'Bilinmiyor'}</div>
        </div>
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = String(params?.id ?? '')

  // Try Prisma first
  try {
    const p = await prisma.product.findUnique({ where: { id } })
    if (p) {
      // images stored as JSON string in sqlite fallback
      let images: string[] = []
      try {
        images = Array.isArray(p.images) ? (p.images as unknown as string[]) : JSON.parse(String(p.images))
      } catch {
        images = []
      }

      const product = {
        id: p.id,
        title: p.title,
        productCode: p.productCode,
        description: p.description ?? undefined,
        images,
        stock: p.stock,
        price: null,
      }
      return { props: { product } }
    }
  } catch (err) {
    // ignore prisma errors and fallback
     
    console.warn('prisma product read failed', err)
  }

  // Fallback to local data file
  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json')
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8')
      const list = JSON.parse(raw) as unknown[]
      const found = list.find((x) => String((x as Record<string, unknown>).id) === id) as Record<string, unknown> | undefined
      if (found) {
        const images: string[] = Array.isArray(found.images) ? (found.images as string[]) : (typeof found.image === 'string' ? [found.image as string] : [])
        const product = {
          id: String(found.id ?? ''),
          title: String(found.title ?? ''),
          productCode: typeof found.productCode === 'string' ? found.productCode : undefined,
          description: typeof found.description === 'string' ? found.description : undefined,
          images,
          stock: typeof found.stock === 'number' ? found.stock : (found.stock == null ? null : Number(found.stock)),
          price: typeof found.price === 'number' ? found.price : (found.price == null ? null : Number(found.price)),
        }
        return { props: { product } }
      }
    }
  } catch (err) {
    // ignore
  }

  return { notFound: true }
}
