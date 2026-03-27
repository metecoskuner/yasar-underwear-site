import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import normalizeProduct from '@/lib/normalizeProduct'

/* eslint-disable @next/next/no-img-element */
type Product = {
  id: string
  title: string
  i18nTitle?: Record<string, string> | null
  productCode?: string
  description?: string
  gender?: 'Erkek' | 'Kadın' | ''
  images?: (string | null)[] // exactly 3 slots: [main, 1, 2]
  isFeatured?: boolean
}

type Page = { id: string; slug: string; sections?: unknown[] }

type ContentStore = Record<string, unknown> & { products?: Product[] }

export default function ContentPage() {
  const [store, setStore] = useState<ContentStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const MAX_IMAGE_BYTES = 512 * 1024 // 512KB per image limit to avoid huge base64 payloads

  useEffect(() => {
    // load products from DB-backed API
    const raf = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(() => setLoading(true)) : setTimeout(() => setLoading(true), 0)
    // use the shared loader so other handlers can refresh the list
  void loadProducts().finally(() => {
      try {
        if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf as number)
        else clearTimeout(raf as number)
      } catch {}
    })
    // also load site content (pages, etc.)
    void loadStore()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/products', { credentials: 'same-origin' })
      if (!r.ok) {
        setProducts([])
        return
      }
      const j = await r.json()
  const list = Array.isArray(j.products) ? (j.products as unknown as Array<Record<string, unknown>>) : []
  const normalized = list.map((p) => {
        const imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
        // ensure exactly 3 slots
        const images = [...imgs].slice(0, 3).concat(new Array(Math.max(0, 3 - imgs.length)).fill(null)).slice(0, 3)
        // normalize title: server should provide i18nTitle and title fallback, but be defensive
        let i18n: Record<string, string> | null = null
        let titleFallback = ''
        try {
            if (p.i18nTitle && typeof p.i18nTitle === 'object') {
            i18n = p.i18nTitle as Record<string, string>
            titleFallback = (i18n && (i18n.tr || i18n.en)) || Object.values(i18n || {}).find((x) => !!x) || ''
          } else if (typeof p.title === 'string') {
            // try to parse JSON title
            try {
              const parsed = JSON.parse(p.title)
              if (parsed && typeof parsed === 'object') {
                i18n = parsed as Record<string, string>
                titleFallback = (i18n.tr || i18n.en) || Object.values(i18n || {}).find((x) => !!x) || ''
              } else {
                titleFallback = p.title
              }
            } catch {
              titleFallback = p.title
            }
          }
        } catch {}
        return { ...p, images, i18nTitle: i18n, title: titleFallback }
      }) as Product[]
  // normalize before setting state to avoid language/object corruption
  const safe = normalized.map((x) => normalizeProduct(x as Record<string, unknown>) as Product)
  setProducts(safe)
    } catch (err) {
      console.error('loadProducts error', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function loadStore() {
    try {
  const r = await fetch('/api/content', { cache: 'no-store' })
      if (!r.ok) {
        setStore(null)
        return
      }
      const j = await r.json()
      // public /api/content returns { content: { ... } }
      const content = j?.content ?? null
      setStore(content)
    } catch (err) {
      console.error('loadStore error', err)
      setStore(null)
    }
  }

  const pages = store && Array.isArray(store.pages) ? (store.pages as unknown as Page[]) : []

  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - İçerik</title>
      </Head>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">İçerik Yönetimi</h2>
        </div>

        {loading && <div className="text-sm text-gray-500">Yükleniyor...</div>}

        {!loading && !store && <div className="text-sm text-red-500">İçerik yüklenemedi veya boş.</div>}

        {!loading && store && (
          <div className="space-y-3">
            {pages.map((p) => (
              <div key={p.id} className="p-3 border rounded flex items-center justify-between hover:shadow-sm transition-bg hover:bg-slate-50">
                <div>
                  <div className="font-medium">{p.slug} <span className="text-xs text-gray-500">({p.id})</span></div>
                  <div className="text-sm text-gray-500">{p.sections?.length ?? 0} bölüm</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/content/edit?slug=${encodeURIComponent(p.slug)}`} className="text-sm text-blue-600 hover:underline cursor-pointer">Düzenle</Link>
                </div>
              </div>
            ))}
            {(!Array.isArray(store.pages) || store.pages.length === 0) && <div className="text-sm text-gray-600">Henüz sayfa yok.</div>}
          </div>
        )}

        {/* Products management section */}
        <div className="mt-6 bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ürünler</h2>
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-white px-3 py-1 rounded transition"
                onClick={() => setEditing({ id: String(Date.now()), title: '', i18nTitle: { tr: '', en: '', fr: '', ar: '', ru: '' }, productCode: '', description: '', gender: '', images: [null, null, null] } as Product)}
              >
                Ürün Ekle
              </button>
              <button
                className={`inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white px-3 py-1 rounded transition ${saving ? 'opacity-60 cursor-wait' : ''}`}
                onClick={async () => {
                  if (!store) return
                  setSaving(true)
                  try {
                    const newContent = { ...store, products }
                    const res = await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent }), credentials: 'same-origin' })
                    if (!res.ok) {
                      let text: string | undefined
                      try { const j = await res.json(); text = j && j.message ? String(j.message) : undefined } catch { try { text = await res.text() } catch {} }
                      console.error('save failed', res.status, text)
                      alert(`Kaydetme başarısız (${res.status}${text ? `: ${text}` : ''})`)
                      return
                    }
                    // reflect saved content
                    setStore(newContent)
                    alert('Kaydedildi')
                  } catch (err) {
                    console.error(err)
                    alert('Kaydetme başarısız (network veya sunucu hatası)')
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {products.length === 0 && <div className="text-sm text-gray-600">Henüz ürün yok.</div>}
            {/* If editing a new product (not yet in products list), render editor here */}
            {editing && !products.some((x) => x.id === editing.id) && (
              <div className="mt-4 border-t pt-4 w-full">
                <h3 className="font-medium mb-2">{editing && editing.id ? 'Ürün Düzenle' : 'Yeni Ürün'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input value={editing?.i18nTitle?.tr ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), tr: e.target.value } } : cur)} placeholder="Ürün adı (Türkçe)" className="border rounded px-3 py-2" />
                    <input value={editing?.i18nTitle?.en ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), en: e.target.value } } : cur)} placeholder="Ürün adı (English)" className="border rounded px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <input value={editing?.i18nTitle?.fr ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), fr: e.target.value } } : cur)} placeholder="Ürün adı (Français)" className="border rounded px-3 py-2" />
                    <input value={editing?.i18nTitle?.ar ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), ar: e.target.value } } : cur)} placeholder="Ürün adı (العربية)" className="border rounded px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <input value={editing?.i18nTitle?.ru ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), ru: e.target.value } } : cur)} placeholder="Ürün adı (Русский)" className="border rounded px-3 py-2" />
                    <input value={editing?.productCode || ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, productCode: e.target.value } : cur)} placeholder="Ürün kodu" className="border rounded px-3 py-2" />
                  </div>
                  <select value={editing.gender || ''} onChange={(e) => setEditing({ ...editing, gender: e.target.value as 'Erkek' | 'Kadın' | '' })} className="border rounded px-3 py-2">
                    <option value="">Cinsiyet</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                  <input value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Kısa açıklama" className="border rounded px-3 py-2" />
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" checked={!!editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} />
                    <span>Öne Çıkar</span>
                  </label>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Resimler (maks 3 — Main, 1, 2)</label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((slot) => (
                      <div key={slot} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{slot === 0 ? 'Main' : String(slot)}</div>
                        <div className="w-28 h-28 mx-auto mb-2">
                          {(editing.images || [null, null, null])[slot] ? (
                            <img src={(editing.images || [null, null, null])[slot] as string} alt="Ürün resmi" className="w-28 h-28 object-cover rounded" />
                          ) : (
                            <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">No image</div>
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files && e.target.files[0]
                          if (!file) return
                          if (file.size > MAX_IMAGE_BYTES) {
                            alert(`Dosya çok büyük. Maksimum ${(MAX_IMAGE_BYTES/1024)|0} KB olabilir.`)
                            return
                          }
                          try {
                            const fd = new FormData()
                            fd.append('file', file)
                            const r = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
                            const j = await r.json()
                            if (!r.ok || !j.url) throw new Error(j?.message || 'upload_failed')
                            const url = j.url as string
                            setEditing((cur) => {
                              if (!cur) return cur
                              const imgs = Array.isArray(cur.images) ? [...cur.images] : [null, null, null]
                              imgs[slot] = url
                              return { ...cur, images: imgs }
                            })
                          } catch (err) {
                            console.error(err)
                            alert('Resim yükleme başarısız')
                          }
                        }} />
                        <div className="mt-1">
                          <button className="text-xs text-red-600" onClick={() => setEditing((cur) => cur ? { ...cur, images: (cur.images || [null, null, null]).map((v, i) => i === slot ? null : v) } : cur)}>Kaldır</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <button 
                    className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={saving}
                    onClick={async () => {
                    if (!editing || saving) return
                    setSaving(true)
                    try {
                      const exists = products.find((x) => x.id === editing.id)
                      if (exists) {
                        const ed = editing as Product
                        const bodyData = { ...ed, title: ed.i18nTitle ?? ed.title, images: ed.images || [] }
                        const res = await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData), credentials: 'same-origin' })
                        const j = await res.json()
                        if (!res.ok) {
                          console.error('update failed', res.status, j)
                          alert(`Kaydetme başarısız (${j?.message || res.status}${j?.detail ? `: ${j.detail}` : ''})`)
                          return
                        }
                        // refresh list from server to ensure titles/images are normalized
                        await loadProducts()
                      } else {
                        const ed = editing as Product
                        const bodyData = { ...ed, title: ed.i18nTitle ?? ed.title, images: ed.images || [] }
                        const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData), credentials: 'same-origin' })
                        const j = await res.json()
                        if (!res.ok) {
                          console.error('create failed', res.status, j)
                          const extra = Array.isArray(j?.errors) ? `\nHatalar: ${j.errors.join(', ')}` : ''
                          alert(`Kaydetme başarısız (${j?.message || res.status}${j?.detail ? `: ${j.detail}` : ''})${extra}`)
                          return
                        }
                        // refresh from server so titles are normalized (i18nTitle parsed)
                        await loadProducts()
                      }
                      setEditing(null)
                    } catch (err) {
                      console.error(err)
                      const rr = err as unknown as { message?: unknown }
                      alert(`Kaydetme başarısız: ${String(rr.message ?? err)}`)
                    } finally {
                      setSaving(false)
                    }
                  }}>Uygula</button>
                  <button className="px-3 py-1 rounded border" onClick={() => setEditing(null)}>İptal</button>
                </div>
              </div>
            )}
            {products.map((p) => (
              <div key={p.id} className="p-3 border rounded flex items-center justify-between hover:shadow-sm transition-bg hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    {p.images && p.images[0] ? <img src={p.images[0] as string} alt="" className="w-16 h-16 object-cover rounded" /> : <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">No image</div>}
                    <div>
                      <div className="font-medium">{p.title || <span className="text-gray-400">(Başlıksız)</span>}</div>
            <div className="text-sm text-gray-500">{p.productCode ? `${p.productCode}` : ''} {p.gender ? `· ${p.gender}` : ''}</div>
                    </div>
                  </div>
                <div className="flex items-center space-x-2">
                  <button
                    title={p.isFeatured ? 'Öne çıkan üründen çıkar' : 'Öne çıkan yap'}
                    aria-pressed={!!p.isFeatured}
                    onClick={async () => {
                      // check featured limit before toggling on
                      const currentFeatured = products.filter((x) => !!x.isFeatured).length
                      const willBeFeatured = !p.isFeatured
                      if (willBeFeatured && currentFeatured >= 8) {
                        alert('En fazla 8 ürün öne çıkarılabilir. Lütfen önce başka bir ürünü öne çıkarılanlardan çıkarın.')
                        return
                      }
                      // optimistic update: only change `isFeatured` and preserve `language` as a string
                      setProducts((cur) => cur.map((x) => {
                        if (x.id !== p.id) return x
                        const newIsFeatured = !x.isFeatured
                        // Preserve any existing `language` value if it's a string. Do not merge or spread a language object.
                        const rawLang = (x as Record<string, unknown>).language
                        const language = typeof rawLang === 'string' ? rawLang : (rawLang && typeof rawLang === 'object' ? String(((rawLang as Record<string, unknown>).tr ?? (rawLang as Record<string, unknown>).en ?? '')) : '')
                        return { ...x, isFeatured: newIsFeatured, // explicit language preserve
                          ...(language ? { language } : {})
                        }
                      }).map((y) => normalizeProduct(y as Record<string, unknown>) as Product))
                      try {
                        const res = await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, isFeatured: !p.isFeatured }), credentials: 'same-origin' })
                        const j = await res.json()
                        if (!res.ok) {
                          console.error('feature toggle failed', res.status, j)
                          alert('Öne çıkarma işlemi başarısız')
                          // revert: only set isFeatured back, keep language untouched
                          setProducts((cur) => cur.map((x) => {
                            if (x.id !== p.id) return x
                            const rawLang = (x as Record<string, unknown>).language
                            const language = typeof rawLang === 'string' ? rawLang : (rawLang && typeof rawLang === 'object' ? String(((rawLang as Record<string, unknown>).tr ?? (rawLang as Record<string, unknown>).en ?? '')) : '')
                            return { ...x, isFeatured: p.isFeatured, ...(language ? { language } : {}) }
                          }).map((y) => normalizeProduct(y as Record<string, unknown>) as Product))
                          return
                        }
                        // refresh list from server to ensure consistency
                        await loadProducts()
                      } catch (err) {
                        console.error(err)
                        alert('Öne çıkarma sırasında ağ hatası')
                        setProducts((cur) => cur.map((x) => {
                          if (x.id !== p.id) return x
                          const rawLang = (x as Record<string, unknown>).language
                          const language = typeof rawLang === 'string' ? rawLang : (rawLang && typeof rawLang === 'object' ? String(((rawLang as Record<string, unknown>).tr ?? (rawLang as Record<string, unknown>).en ?? '')) : '')
                          return { ...x, isFeatured: p.isFeatured, ...(language ? { language } : {}) }
                        }).map((y) => normalizeProduct(y as Record<string, unknown>) as Product))
                      }
                    }}
                    className={`px-2 py-1 rounded ${p.isFeatured ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {p.isFeatured ? '★' : '☆'}
                  </button>
                  <button className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => setEditing({ ...p, images: Array.isArray(p.images) ? [...p.images].slice(0,3).concat(new Array(Math.max(0, 3 - (p.images || []).length)).fill(null)).slice(0,3) : [null, null, null] })}>Düzenle</button>
                  <button className="text-sm text-red-600 hover:underline cursor-pointer" onClick={async () => {
                    if (!confirm('Ürünü silmek istediğinize emin misiniz?')) return
                    try {
                      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(p.id)}`, { method: 'DELETE', credentials: 'same-origin' })
                      const j = await res.json()
                      if (!res.ok) throw new Error(j?.message || 'delete_failed')
                      // refresh list from server after delete so panel stays in sync
                      await loadProducts()
                    } catch (err) {
                      console.error(err)
                      alert('Silme başarısız')
                    }
                  }}>Sil</button>
                </div>
                {/* Inline editor: render directly under the product when editing that product */}
                {editing && editing.id === p.id && (
                  <div className="mt-4 border-t pt-4 w-full">
                    <h3 className="font-medium mb-2">{editing && editing.id ? 'Ürün Düzenle' : 'Yeni Ürün'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <input value={editing?.i18nTitle?.tr ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), tr: e.target.value } } : cur)} placeholder="Ürün adı (Türkçe)" className="border rounded px-3 py-2" />
                        <input value={editing?.i18nTitle?.en ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), en: e.target.value } } : cur)} placeholder="Ürün adı (English)" className="border rounded px-3 py-2" />
                      </div>
                      <div className="space-y-1">
                        <input value={editing?.i18nTitle?.fr ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), fr: e.target.value } } : cur)} placeholder="Ürün adı (Français)" className="border rounded px-3 py-2" />
                        <input value={editing?.i18nTitle?.ar ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), ar: e.target.value } } : cur)} placeholder="Ürün adı (العربية)" className="border rounded px-3 py-2" />
                      </div>
                      <div className="space-y-1">
                        <input value={editing?.i18nTitle?.ru ?? ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, i18nTitle: { ...(cur.i18nTitle ?? {}), ru: e.target.value } } : cur)} placeholder="Ürün adı (Русский)" className="border rounded px-3 py-2" />
                        <input value={editing?.productCode || ''} onChange={(e) => setEditing((cur) => cur ? { ...cur, productCode: e.target.value } : cur)} placeholder="Ürün kodu" className="border rounded px-3 py-2" />
                      </div>
                      <select value={editing.gender || ''} onChange={(e) => setEditing({ ...editing, gender: e.target.value as 'Erkek' | 'Kadın' | '' })} className="border rounded px-3 py-2">
                        <option value="">Cinsiyet</option>
                        <option value="Erkek">Erkek</option>
                        <option value="Kadın">Kadın</option>
                      </select>
                        <input value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Kısa açıklama" className="border rounded px-3 py-2" />
                        <label className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" checked={!!editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} />
                          <span>Öne Çıkar</span>
                        </label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-1">Resimler (maks 3 — Main, 1, 2)</label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {[0, 1, 2].map((slot) => (
                          <div key={slot} className="text-center">
                            <div className="text-xs text-gray-600 mb-1">{slot === 0 ? 'Main' : String(slot)}</div>
                            <div className="w-28 h-28 mx-auto mb-2">
                              {(editing.images || [null, null, null])[slot] ? (
                                <img src={(editing.images || [null, null, null])[slot] as string} alt="Ürün resmi" className="w-28 h-28 object-cover rounded" />
                              ) : (
                                <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">No image</div>
                              )}
                            </div>
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files && e.target.files[0]
                              if (!file) return
                              if (file.size > MAX_IMAGE_BYTES) {
                                alert(`Dosya çok büyük. Maksimum ${(MAX_IMAGE_BYTES/1024)|0} KB olabilir.`)
                                return
                              }
                              try {
                                const fd = new FormData()
                                fd.append('file', file)
                                const r = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
                                const j = await r.json()
                                if (!r.ok || !j.url) throw new Error(j?.message || 'upload_failed')
                                const url = j.url as string
                                setEditing((cur) => {
                                  if (!cur) return cur
                                  const imgs = Array.isArray(cur.images) ? [...cur.images] : [null, null, null]
                                  imgs[slot] = url
                                  return { ...cur, images: imgs }
                                })
                              } catch (err) {
                                console.error(err)
                                alert('Resim yükleme başarısız')
                              }
                            }} />
                            <div className="mt-1">
                              <button className="text-xs text-red-600" onClick={() => setEditing((cur) => cur ? { ...cur, images: (cur.images || [null, null, null]).map((v, i) => i === slot ? null : v) } : cur)}>Kaldır</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save/Cancel buttons are handled in the first editor block above */}
                  </div>
                )}
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
  const authed = await isAuthed(context.req)
  if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) {
    void err
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { props: {} }
}
