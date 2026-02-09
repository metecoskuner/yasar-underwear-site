import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Page, ContentStore } from '@/types/content'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function ContentPage() {
  const [store, setStore] = useState<ContentStore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // avoid synchronous setState in effect body (lint rule)
    const raf = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(() => setLoading(true)) : setTimeout(() => setLoading(true), 0)
    fetch('/api/content')
      .then((r) => r.json())
      .then((j) => {
        setStore(j.content || null)
      })
      .catch(() => setStore(null))
      .finally(() => {
        try {
          if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf as number)
          else clearTimeout(raf as number)
        } catch {}
        setLoading(false)
      })
  }, [])

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
            {(Array.isArray(store.pages) ? store.pages : []).map((p: Page) => (
              <div key={p.id} className="p-3 border rounded flex items-center justify-between hover:shadow-sm transition-bg hover:bg-slate-50">
                <div>
                  <div className="font-medium">{((p.title && (p.title as any).tr && (((p.title as any).tr as any).title)) || p.slug)} <span className="text-xs text-gray-500">({p.id})</span></div>
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
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) {
    void err
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { props: {} }
}
