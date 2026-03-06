import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

/* eslint-disable @next/next/no-img-element */

type Localized = { tr?: string; en?: string; fr?: string; ar?: string; ru?: string }

type ContentStore = Record<string, unknown>
const LOCALES = ['tr', 'en', 'fr', 'ar', 'ru'] as const
type LocaleKey = (typeof LOCALES)[number]

export default function HeroAdminPage() {
  const [store, setStore] = useState<ContentStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<Array<string | null>>([null, null, null])
  const [title, setTitle] = useState<Localized>({ tr: '', en: '', fr: '', ar: '', ru: '' })
  const [subtitle, setSubtitle] = useState<Localized>({ tr: '', en: '', fr: '', ar: '', ru: '' })
  const MAX_IMAGE_BYTES = 1024 * 1024 // 1MB per image

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
  const res = await fetch('/api/content', { cache: 'no-store' })
      if (!res.ok) {
        setStore(null)
        return
      }
      const j = await res.json()
      const content = j?.content ?? {}
      setStore(content)
      const hero = content.hero || {}
      const imgs = Array.isArray(hero.images) ? hero.images : []
      setImages([...imgs].slice(0,3).concat(new Array(Math.max(0, 3 - imgs.length)).fill(null)).slice(0,3))
      setTitle(hero.title || { tr: '', en: '', fr: '', ar: '', ru: '' })
      setSubtitle(hero.subtitle || { tr: '', en: '', fr: '', ar: '', ru: '' })
    } catch (err) {
      console.error('load hero', err)
      setStore(null)
    } finally {
      setLoading(false)
    }
  }

  async function uploadFile(file: File, slot: number) {
    if (!file) return
    if (file.size > MAX_IMAGE_BYTES) {
      alert('Dosya çok büyük (maks 1MB).')
      return
    }
    try {
      const fd = new FormData()
      fd.append('file', file)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
      const j = await r.json()
      if (!r.ok || !j.url) throw new Error(j?.message || 'upload_failed')
      const url = j.url as string
      setImages((cur) => {
        const copy = [...cur]
        copy[slot] = url
        return copy
      })
    } catch (err) {
      console.error('upload', err)
      alert('Resim yükleme başarısız')
    }
  }

  async function save() {
    if (!store) {
      alert('İçerik yüklenemedi; yenileyip tekrar deneyin.')
      return
    }
    setSaving(true)
    try {
      const newContent = { ...store, hero: { images: images.filter(Boolean), title, subtitle } }
      const res = await fetch('/api/admin/content', { method: 'POST', body: JSON.stringify({ content: newContent }), headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' })
      const j = await res.json()
      if (!res.ok) {
        console.error('save hero failed', res.status, j)
        alert('Kaydetme başarısız')
        return
      }
      setStore(newContent)
      alert('Kaydedildi')
    } catch (err) {
      console.error(err)
      alert('Sunucu hatası')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - Hero</title>
      </Head>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Hero Yönetimi</h2>
        </div>

        {loading && <div className="text-sm text-gray-500">Yükleniyor...</div>}

        {!loading && store && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Slider Resimleri (3 adet)</label>
              <div className="mt-2 grid grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="text-center">
                    <div className="w-48 h-36 mx-auto mb-2 bg-gray-100 rounded overflow-hidden">
                      {img ? <img src={img} alt="Hero slide" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No image</div>}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files && e.target.files[0]
                      if (f) void uploadFile(f, i)
                    }} />
                    <div className="mt-2">
                      <button className="text-sm text-red-600" onClick={() => setImages((cur) => cur.map((v, idx) => idx === i ? null : v))}>Kaldır</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Başlık (her dil)</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                {LOCALES.map((k) => (
                  <input
                    key={k}
                    value={title[k as LocaleKey] ?? ''}
                    onChange={(e) => setTitle((cur) => ({ ...(cur || {}), [k]: e.target.value }))}
                    placeholder={`Başlık (${k.toUpperCase()})`}
                    className="border rounded px-2 py-1 text-sm"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Alt Başlık / Açıklama (her dil)</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                {LOCALES.map((k) => (
                  <input
                    key={k}
                    value={subtitle[k as LocaleKey] ?? ''}
                    onChange={(e) => setSubtitle((cur) => ({ ...(cur || {}), [k]: e.target.value }))}
                    placeholder={`Alt başlık (${k.toUpperCase()})`}
                    className="border rounded px-2 py-1 text-sm"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => void save()} disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
              <button className="px-3 py-2 border rounded" onClick={() => void load()}>Yeniden Yükle</button>
            </div>
          </div>
        )}

        {!loading && !store && <div className="text-sm text-red-500">İçerik yüklenemedi.</div>}
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
