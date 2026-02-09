import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { useEffect, useState } from 'react'

type Offer = { id?: string; title?: string; summary?: string; createdAt?: string; handled?: boolean }

export default function OffersPage() {
  const [items, setItems] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/offers')
      .then((r) => r.json())
      .then((j) => { if (!mounted) return; setItems(j.offers || []) })
      .catch((err) => { void err; if (mounted) setError('Yükleme başarısız') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function markHandled(id?: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (!id) return
    await fetch('/api/admin/offers/handle', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    setItems((s) => s.map((o) => (o.id === id ? { ...o, handled: true } : o)))
  }

  async function removeOffer(id?: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    if (!id) return
    if (!confirm('Bu teklifi kalıcı olarak silmek istiyor musunuz?')) return
    const resp = await fetch('/api/admin/offers/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (resp.ok) setItems((s) => s.filter((o) => o.id !== id))
    else alert('Silme başarısız oldu')
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin - Gelen Teklifler</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Gelen Teklifler</h1>
        {loading && <div>Yükleniyor…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-gray-500">Henüz teklif yok.</div>}
            {items.map((o) => {
              const isOpen = openId === o.id
              const created = o.createdAt ? new Date(o.createdAt) : null
              const createdDisplay = created
                ? created.toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : ''
              const containerClasses = `p-4 border rounded cursor-pointer ${isOpen ? 'ring-2 ring-blue-200' : ''} ${o.handled ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-800'}`
              const metaClasses = `text-xs ${o.handled ? 'text-gray-400' : 'text-gray-500'} mt-2`

              return (
                <div key={o.id} onClick={() => setOpenId(isOpen ? null : (o.id as string))} className={containerClasses}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{o.title || 'Teklif'}</div>
                      <div className={`text-sm ${o.handled ? 'text-gray-500' : 'text-gray-700'}`}>{o.summary}</div>
                      <div className={metaClasses}>{createdDisplay}</div>
                    </div>
                    <div className="space-x-2">
                      {!o.handled && <button onClick={(e) => markHandled(o.id, e)} className="text-sm text-blue-600">İşlendi olarak işaretle</button>}
                      <button onClick={(e) => removeOffer(o.id, e)} className="text-sm text-red-600">Kalıcı Sil</button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Detaylar:</strong>
                      <div className="mt-2 whitespace-pre-wrap">{o.summary}</div>
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
