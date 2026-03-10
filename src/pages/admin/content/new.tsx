import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import ContentEditor from '@/components/admin/ContentEditor'
import type { ContentStore } from '@/types/content'
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function NewPage() {
  const [store, setStore] = useState<ContentStore | null>(null)

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' }).then((r) => r.json()).then((j) => setStore(j.content || { pages: [] }))
  }, [])

  async function doSave(nextStore: ContentStore) {
    await fetch('/api/admin/content', { method: 'POST', body: JSON.stringify({ content: nextStore }), headers: { 'Content-Type': 'application/json' } })
    setStore(nextStore)
  }

  return (
    <AdminLayout>
      <Head><title>Yönetici - Yeni Sayfa</title></Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {!store && <div>Yükleniyor...</div>}
        {store && <ContentEditor initialStore={store} initialPage={null} onSave={doSave} />}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
  const authed = await isAuthed(context.req)
  if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
