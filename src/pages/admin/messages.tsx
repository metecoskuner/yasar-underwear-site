import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { useEffect, useState } from 'react'

type Message = { id?: string; from?: string; email?: string; phone?: string; message?: string; createdAt?: string; read?: boolean }

function notifyAdminDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin-data-changed'))
  }
}

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
    setError(null)
    try {
      const resp = await fetch('/api/admin/messages/read', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!resp.ok) {
        const errData = await resp.json()
        console.error('markRead error:', resp.status, errData)
        setError(`Mesaj okundu olarak işaretlenemedi (${resp.status}: ${errData?.error || 'unknown'})`)
        return
      }
      setItems((s) => s.map((m) => (m.id === id ? { ...m, read: true } : m)))
      notifyAdminDataChanged()
    } catch (err) {
      console.error('markRead exception:', err)
      setError(`Hata: ${String(err)}`)
    }
  }

  async function removeMessage(id?: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (!id) return
    if (!confirm('Bu mesajı kalıcı olarak silmek istiyor musunuz?')) return
    setError(null)
    const resp = await fetch('/api/admin/messages/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (resp.ok) {
      setItems((s) => s.filter((m) => m.id !== id))
      notifyAdminDataChanged()
    }
    else setError('Mesaj silinemedi')
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin - Gelen Mesajlar</title>
      </Head>

      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-3 text-xl font-semibold text-slate-900 sm:text-2xl">Gelen Mesajlar</h1>
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
              const containerClasses = `p-4 border rounded cursor-pointer transition-colors ${isOpen ? 'ring-2 ring-blue-200' : ''} ${m.read ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-blue-100 bg-white text-gray-800 shadow-sm'}`
              const metaClasses = `text-xs ${m.read ? 'text-gray-400' : 'text-gray-500'} mt-2`

              return (
                <div key={m.id} onClick={() => setOpenId(isOpen ? null : (m.id as string))} className={containerClasses}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-900">{m.from || 'Anonim'}</div>
                      {m.email && (
                        <div className="mt-1 text-sm">
                          <a href={`mailto:${m.email}`} className={`break-all underline text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.email}</a>
                        </div>
                      )}
                      {m.phone && (
                        <div className="text-sm">
                          <a href={`tel:${m.phone}`} className={`underline text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.phone}</a>
                        </div>
                      )}
                      <div className={`mt-2 line-clamp-3 text-sm ${m.read ? 'text-gray-500' : 'text-gray-700'}`}>{m.message}</div>
                      <div className={metaClasses}>{createdDisplay}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:ml-4 sm:w-auto">
                      {m.read && <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">Okundu</span>}
                      {!m.read && <button onClick={(e) => markRead(m.id, e)} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">Okundu</button>}
                      <button onClick={(e) => removeMessage(m.id, e)} className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">Sil</button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
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
  const authed = await isAuthed(context.req)
  if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
