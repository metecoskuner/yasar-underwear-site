import React, { useEffect, useState } from 'react'
import ApplicationCard from './ApplicationCard'

type Application = { id?: string; type?: string; payload?: Record<string, unknown>; createdAt?: string; read?: boolean }

function notifyAdminDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin-data-changed'))
  }
}

export default function ApplicationsList({ initialFilter }: { initialFilter?: string }) {
  const [items, setItems] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filter = initialFilter || 'all'

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((j) => { if (!mounted) return; setItems((j.applications || []) as Application[]) })
      .catch((err) => { void err; if (mounted) setError('Yükleme başarısız') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function markRead(id?: string) {
    if (!id) return
    setError(null)
    try {
      const resp = await fetch('/api/admin/applications/read', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!resp.ok) {
        const errData = await resp.json()
        console.error('markRead error:', resp.status, errData)
        setError(`Başvuru okundu olarak işaretlenemedi (${resp.status}: ${errData?.error || 'unknown'})`)
        return
      }
      setItems((s) => s.map((m) => (m.id === id ? { ...m, read: true } : m)))
      notifyAdminDataChanged()
    } catch (err) {
      console.error('markRead exception:', err)
      setError(`Hata: ${String(err)}`)
    }
  }

  async function remove(id?: string) {
    if (!id) return
    if (!confirm('Bu başvuruyu kalıcı olarak silmek istiyor musunuz?')) return
    setError(null)
    const resp = await fetch('/api/admin/applications/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (resp.ok) {
      setItems((s) => s.filter((m) => m.id !== id))
      notifyAdminDataChanged()
    } else setError('Başvuru silinemedi')
  }

  const filtered = items.filter((it) => filter === 'all' ? true : it.type === filter)

  const titleFor = (f: string) => {
    if (f === 'wholesale') return 'Toptan Başvuruları'
    if (f === 'private-label') return 'Özel Marka Başvuruları'
    return 'Başvurular'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{titleFor(filter)}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Mobilde aksiyonlar alta akacak şekilde düzenlendi. Kartlar tek elde daha rahat yönetilir.</p>
      </div>

      {loading && <div>Yükleniyor…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4">
          {filtered.length === 0 && <div className="text-sm text-gray-500">Henüz başvuru yok.</div>}

          {filtered.map((m) => (
            <div key={m.id}>
              <ApplicationCard application={m} onMarkRead={(id) => markRead(id)} onDelete={(id) => remove(id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
