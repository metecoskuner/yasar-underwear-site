import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { useEffect, useState } from 'react'

type User = { id: string; username: string; role: string }

export default function SiteSettingsPage() {
  const [site, setSite] = useState<{ companyName?: string; contactEmail?: string; footerText?: string }>({})
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'same-origin' }).then(r => r.json()).then(j => { setSite(j.settings?.site || {}); setUsers(j.settings?.users || []); setLoading(false) }).catch(() => { setSite({}); setLoading(false) })
  }, [])

  async function save() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/save-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: { users, site } }), credentials: 'same-origin' })
      if (!res.ok) throw new Error('save failed')
    } catch (err) {
      void err
      // ignore
    } finally { setLoading(false) }
  }

  return (
    <AdminLayout>
      <Head><title>Admin - Site Ayarları</title></Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Site Ayarları</h1>
        <p className="text-sm text-gray-600 mb-4">Firma bilgileri, e-posta ayarları ve benzeri.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Firma Adı</label>
            <input className="w-full border rounded px-3 py-2" value={site.companyName || ''} onChange={(e) => setSite(prev => ({ ...prev, companyName: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium">İletişim E-posta</label>
            <input className="w-full border rounded px-3 py-2" value={site.contactEmail || ''} onChange={(e) => setSite(prev => ({ ...prev, contactEmail: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium">Footer Metni</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={site.footerText || ''} onChange={(e) => setSite(prev => ({ ...prev, footerText: e.target.value }))} />
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try { const authed = isAuthed(context.req); if (!authed) return { redirect: { destination: '/admin', permanent: false } } } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
