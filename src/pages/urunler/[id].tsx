import { GetServerSideProps } from 'next'
import React, { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
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
  gender?: string
  category?: string
}

function normalizeImageList(input: unknown, fallback?: unknown): string[] {
  const values: string[] = []
  const collect = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(collect)
      return
    }
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          collect(JSON.parse(trimmed))
          return
        } catch {
          // keep raw string below
        }
      }
      values.push(trimmed)
      return
    }
    if (value && typeof value === 'object') {
      Object.values(value as Record<string, unknown>).forEach(collect)
    }
  }

  collect(input)
  collect(fallback)
  return Array.from(new Set(values))
}

function resolveImageUrl(image: string, site: string) {
  const trimmed = image.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `${site}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
}

export default function ProductPage({ product }: { product: Product }) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yasarunderwear.com').replace(/\/$/, '')
  const pageUrl = `/urunler/${product.id}`
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartXRef = useRef<number | null>(null)
  const touchDeltaXRef = useRef(0)
  const pointerStartXRef = useRef<number | null>(null)
  const pointerDeltaXRef = useRef(0)
  const isPointerDraggingRef = useRef(false)
  const fullImages = useMemo(
    () =>
      (product.images || []).map((image) =>
        image && site ? resolveImageUrl(image, site) : image
      ),
    [product.images, site]
  )
  const image = fullImages[activeIndex] || fullImages[0]

  const availability = product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.productCode || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Yasar Underwear',
    },
    category: product.category || product.gender || 'Underwear',
    image: product.images && product.images.length ? product.images.map((i) => (site ? resolveImageUrl(i, site) : i)) : undefined,
    description: product.description || undefined,
    url: site ? `${site}${pageUrl}` : pageUrl,
    offers: {
      '@type': 'Offer',
      availability,
    },
  }

  function showPrevImage() {
    if (fullImages.length <= 1) return
    setActiveIndex((current) => (current - 1 + fullImages.length) % fullImages.length)
  }

  function showNextImage() {
    if (fullImages.length <= 1) return
    setActiveIndex((current) => (current + 1) % fullImages.length)
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
    touchDeltaXRef.current = 0
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current == null) return
    touchDeltaXRef.current = (event.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current
  }

  function handleTouchEnd() {
    if (touchStartXRef.current == null) return
    const deltaX = touchDeltaXRef.current
    touchStartXRef.current = null
    touchDeltaXRef.current = 0

    if (Math.abs(deltaX) < 36) return
    if (deltaX < 0) showNextImage()
    else showPrevImage()
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (fullImages.length <= 1 || event.pointerType === 'touch') return
    isPointerDraggingRef.current = true
    pointerStartXRef.current = event.clientX
    pointerDeltaXRef.current = 0
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isPointerDraggingRef.current || pointerStartXRef.current == null) return
    pointerDeltaXRef.current = event.clientX - pointerStartXRef.current
  }

  function handlePointerEnd() {
    if (!isPointerDraggingRef.current) return
    isPointerDraggingRef.current = false
    const deltaX = pointerDeltaXRef.current
    pointerStartXRef.current = null
    pointerDeltaXRef.current = 0

    if (Math.abs(deltaX) < 48) return
    if (deltaX < 0) showNextImage()
    else showPrevImage()
  }

  return (
    <Layout>
      <SEO
        title={`${product.title} — Yasar`}
        description={product.description || `${product.title} — Yasar ürün`}
        image={image || undefined}
        url={pageUrl}
        jsonLd={jsonLd}
        type="product"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Ürünler', item: '/urunler' },
          { name: product.title, item: pageUrl },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
        {image && (
          <section className="space-y-4">
            <div
              className={`relative w-full h-[24rem] max-h-96 overflow-hidden rounded-2xl bg-white select-none ${fullImages.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{ touchAction: 'pan-y' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  showPrevImage()
                }
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  showNextImage()
                }
              }}
              tabIndex={fullImages.length > 1 ? 0 : -1}
              role="region"
              aria-label={`${product.title} galeri`}
            >
              {fullImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevImage}
                    className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-xl font-semibold text-slate-800 shadow transition hover:bg-white md:flex"
                    aria-label="Önceki görsel"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-xl font-semibold text-slate-800 shadow transition hover:bg-white md:flex"
                    aria-label="Sonraki görsel"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {activeIndex + 1} / {fullImages.length}
                  </div>
                </>
              )}
              <Image
                src={image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                quality={78}
                className="object-contain"
              />
            </div>

            {fullImages.length > 1 && (
              <>
                <div className="flex items-center justify-center gap-2 md:hidden">
                  {fullImages.map((galleryImage, index) => (
                    <button
                      key={`${galleryImage}-dot`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-200 ${activeIndex === index ? 'w-6 bg-slate-900' : 'w-2.5 bg-slate-300'}`}
                      aria-label={`Görsel ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="hidden gap-3 overflow-x-auto pb-1 md:flex">
                  {fullImages.map((galleryImage, index) => (
                    <button
                      key={galleryImage}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-24 w-24 flex-none overflow-hidden rounded-xl border-2 transition ${activeIndex === index ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'}`}
                      aria-label={`Görsel ${index + 1}`}
                    >
                      <Image
                        src={galleryImage}
                        alt=""
                        fill
                        sizes="96px"
                        quality={65}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
        <p className="mt-4 text-gray-700">{product.description}</p>
        <div className="mt-6">
          <div>SKU: <span className="font-mono">{product.productCode}</span></div>
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
        gender: p.gender ?? undefined,
      }
      return { props: { product } }
    }
  } catch (err) {
    // ignore prisma errors and fallback
    void err
  }

  // Fallback to local data file
  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json')
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8')
      const list = JSON.parse(raw) as unknown[]
      const found = list.find((x) => String((x as Record<string, unknown>).id) === id) as Record<string, unknown> | undefined
      if (found) {
        const images = normalizeImageList(found.images, found.imageUrl ?? found.image)
        const product = {
          id: String(found.id ?? ''),
          title: String(found.title ?? ''),
          productCode: typeof found.productCode === 'string' ? found.productCode : undefined,
          description: typeof found.description === 'string' ? found.description : undefined,
          images,
          stock: typeof found.stock === 'number' ? found.stock : (found.stock == null ? null : Number(found.stock)),
          gender: typeof found.gender === 'string' ? found.gender : undefined,
          category: typeof found.category === 'string' ? found.category : undefined,
        }
        return { props: { product } }
      }
    }
  } catch {
    // ignore
  }

  return { notFound: true }
}
