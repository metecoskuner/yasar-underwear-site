import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { useEffect, useState } from 'react'

type Message = { id?: string; from?: string; email?: string; phone?: string; message?: string; createdAt?: string; read?: boolean }

export default function MessagesPage() {
  const [items, setItems] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((j) => { if (!mounted) return; setItems(j.messages || []) })
      .catch((err) => { void err; if (mounted) setError('Yükleme başarısız') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function markRead(id?: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (!id) return
    await fetch('/api/admin/messages/read', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    setItems((s) => s.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  async function removeMessage(id?: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (!id) return
    if (!confirm('Bu mesajı kalıcı olarak silmek istiyor musunuz?')) return
    const resp = await fetch('/api/admin/messages/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (resp.ok) {
      setItems((s) => s.filter((m) => m.id !== id))
      // reload to ensure sidebar badges and counts are updated
      setTimeout(() => { if (typeof window !== 'undefined') window.location.reload() }, 150)
    }
    else alert('Silme başarısız oldu')
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin - Gelen Mesajlar</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Gelen Mesajlar</h1>
        {loading && <div>Yükleniyor…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-gray-500">Henüz mesaj yok.</div>}
            {items.map((m) => {
              const isOpen = openId === m.id
              const created = m.createdAt ? new Date(m.createdAt) : null
              const createdDisplay = created
                ? created.toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : ''
              // visual styles: read items dimmed, unread more solid
              const containerClasses = `p-4 border rounded cursor-pointer ${isOpen ? 'ring-2 ring-blue-200' : ''} ${m.read ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-800'}`
              const metaClasses = `text-xs ${m.read ? 'text-gray-400' : 'text-gray-500'} mt-2`

              return (
                <div key={m.id} onClick={() => setOpenId(isOpen ? null : (m.id as string))} className={containerClasses}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{m.from || 'Anonim'}</div>
                      {m.email && (
                        <div className="text-sm">
                          <a href={`mailto:${m.email}`} className={`underline text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.email}</a>
                        </div>
                      )}
                      {m.phone && (
                        <div className="text-sm">
                          <a href={`tel:${m.phone}`} className={`underline text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.phone}</a>
                        </div>
                      )}
                      <div className={`text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.message}</div>
                      <div className={metaClasses}>{createdDisplay}</div>
                    </div>
                    <div className="space-x-2">
                      {!m.read && <button onClick={(e) => markRead(m.id, e)} className="text-sm text-blue-600">Okundu olarak işaretle</button>}
                      <button onClick={(e) => removeMessage(m.id, e)} className="text-sm text-red-600">Kalıcı Sil</button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Detaylar:</strong>
                      <div className="mt-2 whitespace-pre-wrap">{m.message}</div>
                    </div>
                  )}
                </div>
              )
            })}
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
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
