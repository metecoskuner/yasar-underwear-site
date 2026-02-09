import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ContentEditor from '@/components/admin/ContentEditor'
import type { ContentStore, Page } from '@/types/content'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function EditPage() {
  const router = useRouter()
  const { slug } = router.query
  const [store, setStore] = useState<ContentStore | null>(null)
  const [page, setPage] = useState<Page | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch('/api/content').then((r) => r.json()).then((j) => {
      const s: ContentStore = j.content || { pages: [] }
      setStore(s)
      const found = (s.pages || []).find((p: Page) => p.slug === slug)
      if (found) setPage(found as Page)
      else setPage(null)
    })
  }, [slug])

  async function doSave(nextStore: ContentStore) {
    await fetch('/api/admin/save-content', { method: 'POST', body: JSON.stringify({ content: nextStore }), headers: { 'Content-Type': 'application/json' } })
    // refresh
    setStore(nextStore)
  }

  return (
    <AdminLayout>
      <Head><title>Yönetici - Düzenle</title></Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {!store && <div>Yükleniyor...</div>}
        {store && page && <ContentEditor initialStore={store} initialPage={page} onSave={doSave} />}
        {store && !page && <div>Sayfa bulunamadı.</div>}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
